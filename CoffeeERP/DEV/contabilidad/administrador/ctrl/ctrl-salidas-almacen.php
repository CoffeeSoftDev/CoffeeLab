<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-salidas-almacen.php';

class ctrl extends mdl {

    function init() {
        return [
            'warehouses' => $this->lsWarehouses()
        ];
    }

    function lsWarehouseOutputs() {
        $__row = [];
        
        $ls = $this->listWarehouseOutputs([
            'active' => 1
        ]);

        foreach ($ls as $key) {
            $__row[] = [
                'Almacén'     => $key['warehouse_name'],
                'Monto'       => [
                    'html'  => evaluar($key['amount']),
                    'class' => 'text-end font-semibold'
                ],
                'Descripción' => $key['description'] ?: 'Sin descripción',
                'dropdown'    => dropdown($key['id'])
            ];
        }

        $total = $this->calculateTotalOutputs(['active' => 1]);

        return [
            'row'   => $__row,
            'total' => $total
        ];
    }

    function getWarehouseOutput() {
        $status = 404;
        $message = 'Salida de almacén no encontrada';
        $data = null;

        $output = $this->getWarehouseOutputById($_POST['id']);

        if ($output) {
            $status = 200;
            $message = 'Salida de almacén encontrada';
            $data = $output;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addWarehouseOutput() {
        $status = 500;
        $message = 'Error al registrar la salida de almacén';

        if (empty($_POST['insumo_id']) || empty($_POST['amount'])) {
            return [
                'status' => 400,
                'message' => 'Campos obligatorios faltantes'
            ];
        }

        if ($_POST['amount'] <= 0) {
            return [
                'status' => 400,
                'message' => 'El monto debe ser mayor a cero'
            ];
        }

        $_POST['operation_date'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $create = $this->createWarehouseOutput($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Salida de almacén registrada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editWarehouseOutput() {
        $status = 500;
        $message = 'Error al editar la salida de almacén';

        if (empty($_POST['insumo_id']) || empty($_POST['amount'])) {
            return [
                'status' => 400,
                'message' => 'Campos obligatorios faltantes'
            ];
        }

        if ($_POST['amount'] <= 0) {
            return [
                'status' => 400,
                'message' => 'El monto debe ser mayor a cero'
            ];
        }

        $edit = $this->updateWarehouseOutput($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Salida de almacén actualizada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function deleteWarehouseOutput() {
        $status = 500;
        $message = 'Error al eliminar la salida de almacén';

        $delete = $this->deleteWarehouseOutputById($_POST['id']);

        if ($delete) {
            $status = 200;
            $message = 'Salida de almacén eliminada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function getTotalOutputs() {
        $total = $this->calculateTotalOutputs(['active' => 1]);

        return [
            'status' => 200,
            'total'  => $total
        ];
    }
}

// Complements

function dropdown($id) {
    return [
        [
            'icon'    => 'icon-pencil',
            'text'    => 'Editar',
            'onclick' => "app.editWarehouseOutput($id)"
        ],
        [
            'icon'    => 'icon-trash',
            'text'    => 'Eliminar',
            'onclick' => "app.deleteWarehouseOutput($id)"
        ]
    ];
}

function evaluar($monto) {
    return '$ ' . number_format($monto, 2, '.', ',');
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
