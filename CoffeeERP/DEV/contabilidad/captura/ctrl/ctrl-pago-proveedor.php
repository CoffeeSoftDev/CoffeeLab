<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-pago-proveedor.php';

class ctrl extends mdl {

    function init() {
        return [
            'suppliers' => $this->lsSuppliers([1]),
            'paymentTypes' => [
                ['id' => 'Fondo fijo', 'valor' => 'Fondo fijo'],
                ['id' => 'Corporativo', 'valor' => 'Corporativo']
            ]
        ];
    }

    function ls() {
        $__row = [];
        $udn = $_POST['udn'];
        
        $ls = $this->listPayments([$udn]);
        $totals = $this->calculateTotals([$udn]);

        foreach ($ls as $key) {
            $__row[] = [
                'id' => $key['id'],
                'Proveedor' => $key['supplier_name'],
                'Tipo de Pago' => $key['payment_type'],
                'Monto' => [
                    'html' => evaluar($key['amount']),
                    'class' => 'text-end'
                ],
                'Descripción' => $key['description'],
                'a' => [
                    [
                        'class' => 'btn btn-sm btn-primary me-1',
                        'html' => '<i class="icon-pencil"></i>',
                        'onclick' => 'app.editPayment(' . $key['id'] . ')'
                    ],
                    [
                        'class' => 'btn btn-sm btn-danger',
                        'html' => '<i class="icon-trash"></i>',
                        'onclick' => 'app.deletePayment(' . $key['id'] . ')'
                    ]
                ]
            ];
        }

        return [
            'row' => $__row,
            'totals' => $totals,
            'ls' => $ls
        ];
    }

    function getPayment() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $payment = $this->getPaymentById([$_POST['id']]);

        if ($payment) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $payment
        ];
    }

    function addPayment() {
        $status = 500;
        $message = 'No se pudo registrar el pago';
        
        $_POST['operation_date'] = date('Y-m-d');
        $_POST['active'] = 1;

        if (empty($_POST['supplier_id']) || empty($_POST['payment_type']) || empty($_POST['amount'])) {
            return [
                'status' => 400,
                'message' => 'Todos los campos obligatorios deben ser completados'
            ];
        }

        if (!is_numeric($_POST['amount']) || $_POST['amount'] <= 0) {
            return [
                'status' => 400,
                'message' => 'El monto debe ser un valor numérico mayor a cero'
            ];
        }

        $create = $this->createPayment($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Pago registrado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editPayment() {
        $status = 500;
        $message = 'Error al editar el pago';

        if (empty($_POST['supplier_id']) || empty($_POST['payment_type']) || empty($_POST['amount'])) {
            return [
                'status' => 400,
                'message' => 'Todos los campos obligatorios deben ser completados'
            ];
        }

        if (!is_numeric($_POST['amount']) || $_POST['amount'] <= 0) {
            return [
                'status' => 400,
                'message' => 'El monto debe ser un valor numérico mayor a cero'
            ];
        }

        $edit = $this->updatePayment($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Pago actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function deletePayment() {
        $status = 500;
        $message = 'No se pudo eliminar el pago';

        $delete = $this->deletePaymentById([$_POST['id']]);

        if ($delete) {
            $status = 200;
            $message = 'Pago eliminado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($active) {
    return $active == 1 
        ? '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Activo</span>'
        : '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Inactivo</span>';
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
