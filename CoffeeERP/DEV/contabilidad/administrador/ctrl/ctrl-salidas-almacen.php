<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-salidas-almacen.php';

class ctrl extends mdl {

    function init() {
        return [
            'warehouses' => $this->lsWarehouses(),
            'udn' => $this->lsUDN()
        ];
    }

    function lsWarehouseOutputs() {
        $active = $_POST['active'] ?? 1;
        $udn_id = $_POST['udn'] ?? null;
        
        $data = $this->listWarehouseOutputs([
            'active' => $active,
            'udn_id' => $udn_id
        ]);
        
        $rows = [];

        foreach ($data as $item) {
            $a = [];

            if ($active == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'warehouseOutput.editWarehouseOutput(' . $item['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-trash"></i>',
                    'onclick' => 'warehouseOutput.deleteWarehouseOutput(' . $item['id'] . ')'
                ];
            }

            $rows[] = [
                'id' => $item['id'],
                'Almacén' => htmlspecialchars($item['warehouse_name']),
                'Monto' => [
                    'html' => '$ ' . number_format($item['amount'], 2),
                    'class' => 'text-end'
                ],
                'Descripción' => htmlspecialchars($item['description'] ?: 'Sin descripción'),
                'a' => $a
            ];
        }

        return [
            'row' => $rows,
            'ls' => $data
        ];
    }

    function getWarehouseOutput() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Salida de almacén no encontrada';
        $data = null;

        $output = $this->getWarehouseOutputById([$id]);

        if ($output) {
            $status = 200;
            $message = 'Salida de almacén encontrada';
            $data = $output;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addWarehouseOutput() {
        $status = 500;
        $message = 'Error al registrar salida de almacén';

        if (empty($_POST['insumo_id']) || empty($_POST['amount'])) {
            return [
                'status' => 400,
                'message' => 'El almacén y la cantidad son obligatorios'
            ];
        }

        if ($_POST['amount'] <= 0) {
            return [
                'status' => 400,
                'message' => 'La cantidad debe ser mayor a cero'
            ];
        }

        $_POST['active'] = 1;
        $_POST['operation_date'] = date('Y-m-d H:i:s');

        $create = $this->createWarehouseOutput($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Salida de almacén registrada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editWarehouseOutput() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar salida de almacén';

        if (empty($_POST['insumo_id']) || empty($_POST['amount'])) {
            return [
                'status' => 400,
                'message' => 'El almacén y la cantidad son obligatorios'
            ];
        }

        if ($_POST['amount'] <= 0) {
            return [
                'status' => 400,
                'message' => 'La cantidad debe ser mayor a cero'
            ];
        }

        $edit = $this->updateWarehouseOutput($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Salida de almacén actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function deleteWarehouseOutput() {
        $status = 500;
        $message = 'Error al eliminar salida de almacén';

        $delete = $this->deleteWarehouseOutputById([$_POST['id']]);

        if ($delete) {
            $status = 200;
            $message = 'Salida de almacén eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getTotalOutputs() {
        $udn_id = $_POST['udn'] ?? null;
        
        $total = $this->getTotalWarehouseOutputs([
            'udn_id' => $udn_id
        ]);

        return [
            'status' => 200,
            'total' => $total
        ];
    }
}

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

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
