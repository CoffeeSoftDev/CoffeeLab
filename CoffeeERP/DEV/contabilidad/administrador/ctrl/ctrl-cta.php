<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-cta.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN()
        ];
    }

    // Cuenta de mayor (product_class)

    function lsMayorAccount() {
        $__row = [];
        $udn = $_POST['udn'];
        
        $ls = $this->listProductClass([$udn]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'mayorAccount.editMayorAccount(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'mayorAccount.statusMayorAccount(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'mayorAccount.statusMayorAccount(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'            => $key['id'],
                'Cuenta de mayor' => $key['name'],
                'Estado'        => renderStatus($key['active']),
                'a'             => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getMayorAccount() {

        $id      = $_POST['id'];
        $status  = 404;
        $message = 'Cuenta no encontrada';
        $data    = null;

        $account = $this->getProductClassById([$id]);

        if ($account) {
            $status = 200;
            $message = 'Cuenta encontrada';
            $data = $account;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addMayorAccount() {
        $status = 500;
        $message = 'No se pudo agregar la cuenta';
        // $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $exists = $this->existsProductClassByName([$_POST['name'], $_POST['udn']]);

        if ($exists === 0) {
            $create = $this->createProductClass($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Cuenta de mayor agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una cuenta de mayor con ese nombre en esta unidad de negocio.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMayorAccount() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar cuenta';

        $edit = $this->updateProductClass($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Cuenta de mayor editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMayorAccount() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateProductClass($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado de la cuenta se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }


    // Sub cuenta 

    function lsSubAccount() {
        $__row = [];
        $udn = $_POST['udn'];
        
        $ls = $this->listProduct([$udn]);

        foreach ($ls as $key) {
            $__row[] = [
                'id'              => $key['id'],
                'Subcuenta'       => $key['name'],
                'Cuenta de mayor' => $key['product_class_name'],
                'Estado'          => renderStatus($key['active']),
                'opc'             => 0
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function lsPurchaseType() {
        $__row = [];
        $udn = $_POST['udn'];
        
        $ls = $this->listPurchaseType([$udn]);

        foreach ($ls as $key) {
            $__row[] = [
                'id'            => $key['id'],
                'Tipo de compra' => $key['name'],
                'Descripción'   => $key['description'],
                'Estado'        => renderStatus($key['active']),
                'opc'           => 0
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    

    function lsPaymentMethod() {
        $__row = [];
        $udn = $_POST['udn'];
        
        $ls = $this->listPaymentMethod([$udn]);

        foreach ($ls as $key) {
            $__row[] = [
                'id'           => $key['id'],
                'Forma de pago' => $key['name'],
                'Descripción'  => $key['description'],
                'Estado'       => renderStatus($key['active']),
                'opc'          => 0
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
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
