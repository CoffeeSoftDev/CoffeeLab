<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-admin-productos.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'status' => [
                ['id' => 1, 'valor' => 'Disponibles'],
                ['id' => 0, 'valor' => 'No disponibles']
            ]
        ];
    }

    function lsProductos() {
        $active = $_POST['estado-productos'];
        $udn = $_POST['udn'];
        $data = $this->listProductos([$active, $udn]);
        $rows = [];

        foreach ($data as $item) {
            $a = [];

            if ($active == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminProductos.editProducto(' . $item['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminProductos.statusProducto(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminProductos.statusProducto(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            }

            $rows[] = [
                'id'          => $item['id'],
                'Nombre'      => $item['nombre'],
                'Descripción' => $item['descripcion'],
                'Es Servicio' => $item['es_servicio'] ? 'Sí' : 'No',
                'UDN'         => $item['udn_nombre'],
                'Estado'      => renderStatus($item['active']),
                'a'           => $a
            ];
        }

        return [
            'row' => $rows,
            'ls'  => $data,
        ];
    }

    function getProducto() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Producto no encontrado';
        $data = null;

        $producto = $this->getProductoById($id);

        if ($producto) {
            $status  = 200;
            $message = 'Producto encontrado';
            $data    = $producto;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addProducto() {
        $status = 500;
        $message = 'No se pudo agregar el producto';
        $_POST['date_creation'] = date('Y-m-d H:i:s');

        $exists = $this->existsProductoByName([$_POST['nombre'], $_POST['udn_id']]);

        if (!$exists) {
            $create = $this->createProducto($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Producto agregado correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe un producto con ese nombre en esta UDN.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editProducto() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar producto';

        $edit = $this->updateProducto($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Producto editado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusProducto() {
        $status = 500;
        $message = 'No se pudo actualizar el estado del producto';

        $update = $this->updateProducto($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado del producto se actualizó correctamente';
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
