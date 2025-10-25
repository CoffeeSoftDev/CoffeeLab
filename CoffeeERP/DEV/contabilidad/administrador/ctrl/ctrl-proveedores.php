<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-proveedores.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN()
        ];
    }

    function lsSuppliers() {
        $active = $_POST['active'] ?? 1;
        $udn_id = $_POST['udn'] ?? null;
        
        $data = $this->listSuppliers([
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
                    'onclick' => 'supplier.editSupplier(' . $item['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'supplier.toggleStatus(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-success',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'supplier.toggleStatus(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            }

            $rows[] = [
                'id' => $item['id'],
                'Proveedor' => $item['name'],
                'Estado' => renderStatus($item['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $rows,
            'ls' => $data
        ];
    }

    function getSupplier() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Proveedor no encontrado';
        $data = null;

        $supplier = $this->getSupplierById([$id]);

        if ($supplier) {
            $status = 200;
            $message = 'Proveedor encontrado';
            $data = $supplier;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSupplier() {
        $status = 500;
        $message = 'Error al agregar proveedor';

        if (empty($_POST['name'])) {
            return [
                'status' => 400,
                'message' => 'El nombre del proveedor es obligatorio'
            ];
        }

        if (empty($_POST['udn_id'])) {
            return [
                'status' => 400,
                'message' => 'Debe seleccionar una unidad de negocio'
            ];
        }

        $_POST['active'] = 1;

        $exists = $this->existsSupplierByName([$_POST['name'], $_POST['udn_id']]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe un proveedor con ese nombre para esta unidad de negocio'
            ];
        }

        $create = $this->createSupplier($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Proveedor agregado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSupplier() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar proveedor';

        if (empty($_POST['name'])) {
            return [
                'status' => 400,
                'message' => 'El nombre del proveedor es obligatorio'
            ];
        }

        $edit = $this->updateSupplier($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Proveedor actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function toggleStatus() {
        $status = 500;
        $message = 'Error al cambiar el estado del proveedor';

        $newStatus = $_POST['active'];
        
        $update = $this->updateSupplier($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            if ($newStatus == 1) {
                $message = 'El proveedor estará disponible para captura de información.';
            } else {
                $message = 'El proveedor ya no estará disponible, pero seguirá reflejándose en los registros contables.';
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
