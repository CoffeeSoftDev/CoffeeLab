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
            'udn' => $this->lsUDN(),
            'suppliers' => $this->lsSuppliers([$_POST['udn'] ?? 5])
        ];
    }

    function ls() {
        $__row = [];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];
        $udn = $_POST['udn'] ?? '';

        $ls = $this->listPagos([
            'fi' => $fi,
            'ff' => $ff,
            'udn' => $udn
        ]);

        foreach ($ls as $key) {
            $dropdown = [
                [
                    'icon' => 'icon-pencil',
                    'text' => 'Editar',
                    'onclick' => 'app.editPago(' . $key['id'] . ')'
                ],
                [
                    'icon' => 'icon-trash',
                    'text' => 'Eliminar',
                    'onclick' => 'app.deletePago(' . $key['id'] . ')'
                ]
            ];

            $__row[] = [
                'id' => $key['id'],
                'Fecha' => formatSpanishDate($key['operation_date'], 'normal'),
                'Proveedor' => $key['supplier_name'],
                'RFC' => $key['rfc'] ?: '-',
                'Monto' => [
                    'html' => evaluar($key['amount']),
                    'class' => 'text-end bg-[#283341]'
                ],
                'Balance' => [
                    'html' => evaluar($key['balance']),
                    'class' => 'text-end'
                ],
                'Descripción' => $key['description'] ?: '-',
                'dropdown' => $dropdown
            ];
        }

        $totales = $this->getTotalesPagos([
            'fi' => $fi,
            'ff' => $ff,
            'udn' => $udn
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

        $_POST['active'] = 1;

        $create = $this->createPago($this->util->sql($_POST));

        if ($create) {
            $supplierId = $_POST['supplier_id'];
            $amount = $_POST['amount'];
            
            $supplier = $this->getSupplierById([$supplierId]);
            if ($supplier) {
                $newBalance = $supplier['balance'] - $amount;
                $this->updateSupplierBalance($this->util->sql([
                    'id' => $supplierId,
                    'balance' => $newBalance
                ], 1));
            }

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

        $oldPago = $this->getPagoById([$id]);
        
        if ($oldPago) {
            $oldAmount = $oldPago['amount'];
            $newAmount = $_POST['amount'];
            $supplierId = $_POST['supplier_id'];

            $edit = $this->updatePago($this->util->sql($_POST, 1));

            if ($edit && $oldAmount != $newAmount) {
                $supplier = $this->getSupplierById([$supplierId]);
                if ($supplier) {
                    $newBalance = $supplier['balance'] + $oldAmount - $newAmount;
                    $this->updateSupplierBalance($this->util->sql([
                        'id' => $supplierId,
                        'balance' => $newBalance
                    ], 1));
                }
            }

            if ($edit) {
                $status = 200;
                $message = 'Pago actualizado correctamente';
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusPago() {
        $status = 500;
        $message = 'No se pudo cambiar el estado del pago';

        $id = $_POST['id'];
        $newStatus = $_POST['active'];
        
        $pago = $this->getPagoById([$id]);
        
        if ($pago) {
            $update = $this->updatePago($this->util->sql($_POST, 1));

            if ($update) {
                $supplier = $this->getSupplierById([$pago['supplier_id']]);
                if ($supplier) {
                    if ($newStatus == 0) {
                        $newBalance = $supplier['balance'] + $pago['amount'];
                    } else {
                        $newBalance = $supplier['balance'] - $pago['amount'];
                    }
                    
                    $this->updateSupplierBalance($this->util->sql([
                        'id' => $pago['supplier_id'],
                        'balance' => $newBalance
                    ], 1));
                }

                $status = 200;
                $message = $newStatus == 1 ? 'Pago activado correctamente' : 'Pago cancelado correctamente';
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function deletePago() {
        $status = 500;
        $message = 'No se pudo eliminar el pago';

        $id = $_POST['id'];
        $pago = $this->getPagoById([$id]);
        
        if ($pago && $pago['active'] == 1) {
            $supplier = $this->getSupplierById([$pago['supplier_id']]);
            if ($supplier) {
                $newBalance = $supplier['balance'] + $pago['amount'];
                $this->updateSupplierBalance($this->util->sql([
                    'id' => $pago['supplier_id'],
                    'balance' => $newBalance
                ], 1));
            }
        }

        $delete = $this->deletePagoById([$id]);

        if ($delete) {
            $status = 200;
            $message = 'Pago eliminado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getSuppliersByUdn() {
        $udn = $_POST['udn'];
        $suppliers = $this->lsSuppliers([$udn]);

        return [
            'status' => 200,
            'data' => $suppliers
        ];
    }
}

function formatSpanishDate($date, $format = 'normal') {
    if (!$date) return '-';
    
    $timestamp = strtotime($date);
    $months = [
        'January' => 'Enero', 'February' => 'Febrero', 'March' => 'Marzo',
        'April' => 'Abril', 'May' => 'Mayo', 'June' => 'Junio',
        'July' => 'Julio', 'August' => 'Agosto', 'September' => 'Septiembre',
        'October' => 'Octubre', 'November' => 'Noviembre', 'December' => 'Diciembre'
    ];
    
    $formatted = date('d F Y', $timestamp);
    return str_replace(array_keys($months), array_values($months), $formatted);
}

function evaluar($amount) {
    if (!$amount) return '$0.00';
    return '$' . number_format($amount, 2);
}

$obj = new ctrl();
$fn = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);
