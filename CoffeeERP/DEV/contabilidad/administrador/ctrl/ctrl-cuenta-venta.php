<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-cuenta-venta.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN()
        ];
    }

    function lsSalesAccount() {
        $__row = [];
        $udn = $_POST['udn'];
        $ls = $this->listSalesAccount([$udn]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['activo'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'salesAccount.editSalesAccount(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'salesAccount.statusSalesAccount(' . $key['id'] . ', ' . $key['activo'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'salesAccount.statusSalesAccount(' . $key['id'] . ', ' . $key['activo'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Categoría' => $key['nombre'],
                'Descuento' => renderCheckbox($key['permiso_descuento']),
                'Cortesía' => renderCheckbox($key['permiso_cortesia']),
                'IVA' => renderCheckbox($key['impuesto_iva']),
                'IEPS' => renderCheckbox($key['impuesto_ieps']),
                'Hospedaje' => renderCheckbox($key['impuesto_hospedaje']),
                'Impuesto 0%' => renderCheckbox($key['impuesto_cero']),
                'Estado' => renderStatus($key['activo']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function addSalesAccount() {
        $status = 500;
        $message = 'No se pudo agregar la categoría de venta';
        
        $_POST['fecha_creacion'] = date('Y-m-d H:i:s');
        $_POST['activo'] = 1;

        $exists = $this->existsSalesAccountByName([$_POST['nombre'], $_POST['udn_id']]);

        if ($exists == 0) {
            $create = $this->createSalesAccount($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Categoría de venta agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una categoría con ese nombre para esta unidad de negocio';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getSalesAccount() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $data = null;

        $getSalesAccount = $this->getSalesAccountById([$_POST['id']]);

        if ($getSalesAccount) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
            $data = $getSalesAccount;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function editSalesAccount() {
        $status = 500;
        $message = 'Error al editar la categoría de venta';

        $edit = $this->updateSalesAccount($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Categoría de venta actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSalesAccount() {
        $status = 500;
        $message = 'No se pudo actualizar el estado de la categoría';

        $update = $this->updateSalesAccount($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado de la categoría se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($activo) {
    switch ($activo) {
        case 1:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">
                        <i class="icon-check-circle text-blue-500"></i> Activo
                    </span>';
        case 0:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">
                        <i class="icon-ban text-red-500"></i> Inactivo
                    </span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-500 text-white">Desconocido</span>';
    }
}

function renderCheckbox($value) {
    if ($value == 1) {
        return '<div class="flex justify-center">
                    <i class="icon-check-circle text-green-500 text-lg"></i>
                </div>';
    } else {
        return '<div class="flex justify-center">
                    <i class="icon-circle text-gray-400 text-lg"></i>
                </div>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
