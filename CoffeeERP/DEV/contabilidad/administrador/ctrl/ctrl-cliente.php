<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-cliente.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN()
        ];
    }

    function lsClientes() {
        $__row = [];
        $active = $_POST['active'];
        $udn = $_POST['udn'];

        $ls = $this->listClientes([$active, $udn]);

        foreach ($ls as $key) {
            $a = [];

            if ($active == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'app.editCliente(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'app.statusCliente(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'app.statusCliente(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'     => $key['id'],
                'Nombre' => $key['name'],
                'Estado' => renderStatus($key['active']),
                'a'      => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getCliente() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Cliente no encontrado';
        $data = null;

        $cliente = $this->getClienteById([$id]);

        if ($cliente) {
            $status  = 200;
            $message = 'Cliente encontrado';
            $data    = $cliente;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addCliente() {
        $status = 500;
        $message = 'No se pudo agregar el cliente';
        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $exists = $this->existsClienteByName([$_POST['name'], $_POST['udn_id']]);

        if ($exists === 0) {
            $create = $this->createCliente($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Cliente agregado correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe un cliente con ese nombre en esta unidad de negocio.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editCliente() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar cliente';

        $edit = $this->updateCliente($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Cliente editado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusCliente() {
        $status = 500;
        $message = 'No se pudo actualizar el estado del cliente';

        $update = $this->updateCliente($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado del cliente se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($estatus) {
    switch ($estatus) {
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
