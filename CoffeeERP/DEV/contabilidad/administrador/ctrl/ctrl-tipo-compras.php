<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-tipo-compras.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN()
        ];
    }

    function lsTipoCompras() {
        $active = $_POST['active'] ?? 1;
        $udn = $_POST['udn'] ?? null;
        
        $data = $this->listPurchaseType([
            'active' => $active,
            'udn_id' => $udn
        ]);
        
        $rows = [];

        foreach ($data as $item) {
            $a = [];

            if ($active == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'tipoCompras.editTipoCompra(' . $item['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'tipoCompras.toggleStatusTipoCompra(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-success',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'tipoCompras.toggleStatusTipoCompra(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            }

            $rows[] = [
                'id' => $item['id'],
                'Tipo de compra' => $item['name'],
                'Estado' => renderStatus($item['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $rows,
            'ls' => $data
        ];
    }

    function getTipoCompra() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Tipo de compra no encontrado';
        $data = null;

        $tipoCompra = $this->getPurchaseTypeById([$id]);

        if ($tipoCompra) {
            $status = 200;
            $message = 'Tipo de compra encontrado';
            $data = $tipoCompra;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addTipoCompra() {
        $status = 500;
        $message = 'Error al agregar tipo de compra';

        if (empty($_POST['name'])) {
            return [
                'status' => 400,
                'message' => 'El nombre del tipo de compra es obligatorio'
            ];
        }

        if (empty($_POST['udn_id'])) {
            return [
                'status' => 400,
                'message' => 'Debe seleccionar una unidad de negocio'
            ];
        }

        $_POST['active'] = 1;

        $exists = $this->existsPurchaseTypeByName([$_POST['name'], $_POST['udn_id']]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe un tipo de compra con ese nombre en esta unidad de negocio'
            ];
        }

        $create = $this->createPurchaseType($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Tipo de compra agregado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editTipoCompra() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar tipo de compra';

        if (empty($_POST['name'])) {
            return [
                'status' => 400,
                'message' => 'El nombre del tipo de compra es obligatorio'
            ];
        }

        $edit = $this->updatePurchaseType($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Tipo de compra actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function toggleStatusTipoCompra() {
        $status = 500;
        $message = 'Error al cambiar el estado del tipo de compra';

        $newStatus = $_POST['active'];
        
        $update = $this->updatePurchaseType($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            if ($newStatus == 1) {
                $message = 'El tipo de compra está disponible para capturar o filtrar compras.';
            } else {
                $message = 'El tipo de compra ya no está disponible.';
            }
        }

        return [
            'status' => $status,
            'message' => $message
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
