<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-efectivo.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn'           => $this->lsUDN(),
            'operationType' => $this->lsOperationType(),
            'movementType'  => $this->lsMovementType(),
            'status'        => $this->lsStatus()
        ];
    }

    // Cash Concepts

    function lsConceptos() {
        $udn    = $_POST['udn'];
        $active = $_POST['active'];
        $data   = $this->listConceptos([$udn, $active]);
        $rows   = [];

        foreach ($data as $item) {
            $a = [];

            if ($active == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'formasPago.editConcepto(' . $item['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'formasPago.statusConcepto(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'formasPago.statusConcepto(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            }

            $rows[] = [
                'id'          => $item['id'],
                'Concepto'    => $item['name'],
                'Tipo'        => renderOperationType($item['operation_type']),
                'Descripción' => $item['description'],
                'Estado'      => renderStatus($item['active']),
                'Fecha'       => $item['date_creation'],
                'a'           => $a
            ];
        }

        return [
            'row' => $rows,
            'ls'  => $data
        ];
    }

    function getConcepto() {
        $id      = $_POST['id'];
        $status  = 404;
        $message = 'Concepto no encontrado';
        $data    = null;

        $concepto = $this->getConceptoById($id);

        if ($concepto) {
            $status  = 200;
            $message = 'Concepto encontrado';
            $data    = $concepto;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addConcepto() {
        $status  = 500;
        $message = 'No se pudo agregar el concepto';
        
        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['active']        = 1;

        $exists = $this->existsConceptoByName([$_POST['name'], $_POST['udn_id']]);

        if (!$exists) {
            $create = $this->createConcepto($this->util->sql($_POST));
            if ($create) {
                $status  = 200;
                $message = 'Concepto agregado correctamente';
            }
        } else {
            $status  = 409;
            $message = 'Ya existe un concepto con ese nombre en esta unidad de negocio.';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editConcepto() {
        $id      = $_POST['id'];
        $status  = 500;
        $message = 'Error al editar concepto';

        $edit = $this->updateConcepto($this->util->sql($_POST, 1));

        if ($edit) {
            $status  = 200;
            $message = 'Concepto editado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function statusConcepto() {
        $status  = 500;
        $message = 'No se pudo actualizar el estado del concepto';

        $update = $this->updateConcepto($this->util->sql($_POST, 1));

        if ($update) {
            $status  = 200;
            $message = 'El estado del concepto se actualizó correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    // Cash Movements

    function lsMovimientos() {
        $udn    = $_POST['udn'];
        $active = 1;
        $data   = $this->listMovimientos([$udn, $active]);
        $rows   = [];

        foreach ($data as $item) {
            $a = [];

            $a[] = [
                'class'   => 'btn btn-sm btn-primary me-1',
                'html'    => '<i class="icon-pencil"></i>',
                'onclick' => 'cashMovement.editMovimiento(' . $item['id'] . ')'
            ];

            $rows[] = [
                'id'          => $item['id'],
                'Fecha'       => $item['date_creation'],
                'Concepto'    => $item['concept_name'],
                'Tipo'        => renderMovementType($item['movement_type']),
                'Monto'       => [
                    'html'  => formatPrice($item['amount']),
                    'class' => 'text-end'
                ],
                'Usuario'     => $item['user_name'],
                'Descripción' => $item['description'],
                'a'           => $a
            ];
        }

        return [
            'row' => $rows,
            'ls'  => $data
        ];
    }

    function getMovimiento() {
        $id      = $_POST['id'];
        $status  = 404;
        $message = 'Movimiento no encontrado';
        $data    = null;

        $movimiento = $this->getMovimientoById($id);

        if ($movimiento) {
            $status  = 200;
            $message = 'Movimiento encontrado';
            $data    = $movimiento;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addMovimiento() {
        $status  = 500;
        $message = 'No se pudo registrar el movimiento';
        
        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['active']        = 1;
        $_POST['user_id']       = $_SESSION['user_id'] ?? 1;

        if ($_POST['amount'] <= 0) {
            return [
                'status'  => 400,
                'message' => 'El monto debe ser mayor a 0'
            ];
        }

        $create = $this->createMovimiento($this->util->sql($_POST));

        if ($create) {
            $status  = 200;
            $message = 'Movimiento registrado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editMovimiento() {
        $id      = $_POST['id'];
        $status  = 500;
        $message = 'Error al editar movimiento';

        if ($_POST['amount'] <= 0) {
            return [
                'status'  => 400,
                'message' => 'El monto debe ser mayor a 0'
            ];
        }

        $edit = $this->updateMovimiento($this->util->sql($_POST, 1));

        if ($edit) {
            $status  = 200;
            $message = 'Movimiento editado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function getAvailableAmountByUdn() {
        $udn_id = $_POST['udn_id'];
        $amount = $this->getAvailableAmount($udn_id);

        return [
            'status'  => 200,
            'amount'  => $amount,
            'message' => 'Monto disponible obtenido'
        ];
    }

    // Cash Closure

    function closeCash() {
        $status  = 500;
        $message = 'Error al realizar el cierre de efectivo';
        
        $udn_id = $_POST['udn_id'];
        $amount = $this->getAvailableAmount($udn_id);

        $_POST['total_amount']  = $amount;
        $_POST['closure_date']  = date('Y-m-d H:i:s');
        $_POST['user_id']       = $_SESSION['user_id'] ?? 1;

        $closure = $this->createClosure($this->util->sql($_POST));

        if ($closure) {
            $status  = 200;
            $message = 'El cierre de efectivo se realizó con éxito. No se permitirán más movimientos hasta el siguiente periodo.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'amount'  => $amount
        ];
    }

    function getConceptsByUdn() {
        $udn_id = $_POST['udn_id'];
        $data   = $this->lsConceptsByUdn($udn_id);

        return [
            'status' => 200,
            'data'   => $data
        ];
    }
}

// Complements

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Activo</span>';
        case 0:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Inactivo</span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-500 text-white">Desconocido</span>';
    }
}

function renderOperationType($type) {
    switch ($type) {
        case 'suma':
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-green-100 text-green-800">Suma</span>';
        case 'resta':
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-red-100 text-red-800">Resta</span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-100 text-gray-800">N/A</span>';
    }
}

function renderMovementType($type) {
    switch ($type) {
        case 'entrada':
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-blue-100 text-blue-800">Entrada</span>';
        case 'salida':
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-orange-100 text-orange-800">Salida</span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-100 text-gray-800">N/A</span>';
    }
}

function formatPrice($amount) {
    return '$' . number_format($amount, 2, '.', ',');
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
