<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-formasPago.php';
require_once '../../../conf/coffeSoft.php';

class ctrl extends mdl {

    function lsFormasPago() {
        $__row = [];
        $active = isset($_POST['active']) ? $_POST['active'] : 1;
        
        $ls = $this->listFormasPago([$active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'paymentMethod.editFormaPago(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'paymentMethod.statusFormaPago(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'paymentMethod.statusFormaPago(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['name'],
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getFormaPago() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $data = null;

        $get = $this->getFormaPagoById($_POST['id']);

        if ($get) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
            $data = $get;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addFormaPago() {
        $status = 500;
        $message = 'No se pudo agregar la forma de pago';

        try {
            // $_POST['date_creation'] = date('Y-m-d H:i:s');
            $_POST['active'] = 1;

            $exists = $this->existsFormaPagoByName([$_POST['name']]);

            if ($exists) {
                return [
                    'status' => 409,
                    'message' => 'Ya existe una forma de pago con ese nombre'
                ];
            }

            $create = $this->createFormaPago($this->util->sql($_POST));

            if ($create) {
                $status = 200;
                $message = 'Forma de pago agregada correctamente';
            }

        } catch (Exception $e) {
            $status = 500;
            $message = 'Error del servidor: ' . $e->getMessage();
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editFormaPago() {
        $status = 500;
        $message = 'Error al editar la forma de pago';

        try {
            $update = $this->updateFormaPago($this->util->sql($_POST, 1));

            if ($update) {
                $status = 200;
                $message = 'Forma de pago actualizada correctamente';
            }

        } catch (Exception $e) {
            $status = 500;
            $message = 'Error del servidor: ' . $e->getMessage();
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusFormaPago() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        try {
            $update = $this->updateFormaPago($this->util->sql($_POST, 1));

            if ($update) {
                $status = 200;
                $message = 'El estado de la forma de pago se actualizó correctamente';
            }

        } catch (Exception $e) {
            $status = 500;
            $message = 'Error del servidor: ' . $e->getMessage();
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
