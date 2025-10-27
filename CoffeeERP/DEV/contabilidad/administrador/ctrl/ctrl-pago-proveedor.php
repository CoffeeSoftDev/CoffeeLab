<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-pago-proveedor.php';

class ctrl extends mdl {

    function init() {
        return [
            'proveedores' => $this->lsProveedores(),
            'tipoPago' => $this->lsTipoPago()
        ];
    }

    function lsPagos() {
        $__row = [];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];
        $tipoPago = $_POST['tipoPago'] ?? '';

        $ls = $this->listPagos([
            'fi' => $fi,
            'ff' => $ff,
            'tipo_pago' => $tipoPago
        ]);

        foreach ($ls as $key) {
            $a = [];

            $a[] = [
                'class' => 'btn btn-sm btn-primary me-1',
                'html' => '<i class="icon-pencil"></i>',
                'onclick' => 'app.editPago(' . $key['id'] . ')'
            ];

            $a[] = [
                'class' => 'btn btn-sm btn-danger',
                'html' => '<i class="icon-trash"></i>',
                'onclick' => 'app.deletePago(' . $key['id'] . ')'
            ];

            $__row[] = [
                'id' => $key['id'],
                'Fecha' => formatSpanishDate($key['fecha_pago'], 'normal'),
                'Proveedor' => $key['proveedor'],
                'Monto' => [
                    'html' => evaluar($key['monto']),
                    'class' => 'text-end'
                ],
                'Tipo de Pago' => $key['tipo_pago'],
                'Descripción' => $key['descripcion'] ?: '-',
                'a' => $a
            ];
        }

        $totales = $this->getTotalesPagos([
            'fi' => $fi,
            'ff' => $ff,
            'tipo_pago' => $tipoPago
        ]);

        return [
            'row' => $__row,
            'ls' => $ls,
            'totales' => $totales
        ];
    }

    function getPago() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Pago no encontrado';
        $data = null;

        $pago = $this->getPagoById([$id]);

        if ($pago) {
            $status = 200;
            $message = 'Pago encontrado';
            $data = $pago;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addPago() {
        $status = 500;
        $message = 'No se pudo registrar el pago';

        $_POST['fecha_registro'] = date('Y-m-d H:i:s');
        $_POST['usuario_id'] = $_SESSION['id_usuario'] ?? 1;

        $create = $this->createPago($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Pago registrado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editPago() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar el pago';

        $edit = $this->updatePago($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Pago actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function deletePago() {
        $status = 500;
        $message = 'No se pudo eliminar el pago';

        $delete = $this->deletePagoById([$_POST['id']]);

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

$obj = new ctrl();
$fn = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);
