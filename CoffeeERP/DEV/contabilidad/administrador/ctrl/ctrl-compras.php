<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-compras.php';

class ctrl extends mdl {

    function init() {
        return [
            'categorias'  => $this->lsClaseInsumo(),
            'productos'   => $this->lsInsumo(),
            'proveedores' => $this->lsProveedor(),
            'tiposCompra' => $this->lsTipoCompra(),
            'formasPago'  => $this->lsFormaPago()
        ];
    }


    function lsCompras() {
        $__row = [];
        
        $tipo_compra_id = isset($_POST['tipo_compra_id']) ? $_POST['tipo_compra_id'] : null;
        
        $ls = $this->listCompras([
            'activo' => 1,
            'udn_id' => $_POST['udn'],
            'tipo_compra_id' => $tipo_compra_id
        ]);

        foreach ($ls as $key) {
            $__row[] = [
                'Folio'           => '#' . str_pad($key['id'], 6, '0', STR_PAD_LEFT),
                'Clase Producto'  => $key['categoria'],
                'Producto'        => $key['producto'],
                'Tipo de Compra'  => $key['tipo_compra'],
                'Total'           => [
                    'html'  => evaluar($key['total']),
                    'class' => 'text-end font-semibold'
                ],
                'dropdown' => dropdown($key['id'])
            ];
        }

        $totales = $this->getTotalesByType([
            'activo' => 1,
            'udn_id' => $_POST['udn']
        ]);

        return [
            'row'     => $__row,
            'totales' => $totales
        ];
    }


    function getCompra() {
        $status = 404;
        $message = 'Compra no encontrada';
        $data = null;

        $compra = $this->getCompraById($_POST['id']);

        if ($compra) {
            $status = 200;
            $message = 'Compra encontrada';
            $data = $compra;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addCompra() {
        $status = 500;
        $message = 'Error al registrar la compra';

        if (empty($_POST['insumo_id']) || empty($_POST['proveedor_id']) || empty($_POST['tipo_compra_id'])) {
            return [
                'status' => 400,
                'message' => 'Campos obligatorios faltantes'
            ];
        }

        if ($_POST['subtotal'] <= 0) {
            return [
                'status' => 400,
                'message' => 'El subtotal debe ser mayor a cero'
            ];
        }

        $_POST['total'] = $_POST['subtotal'] + $_POST['impuesto'];
        $_POST['fecha_operacion'] = date('Y-m-d H:i:s');
        $_POST['activo'] = 1;

        $create = $this->createCompra($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Compra registrada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }


    function editCompra() {
        $status = 500;
        $message = 'Error al editar la compra';

        if (empty($_POST['insumo_id']) || empty($_POST['proveedor_id']) || empty($_POST['tipo_compra_id'])) {
            return [
                'status' => 400,
                'message' => 'Campos obligatorios faltantes'
            ];
        }

        if ($_POST['subtotal'] <= 0) {
            return [
                'status' => 400,
                'message' => 'El subtotal debe ser mayor a cero'
            ];
        }

        $_POST['total'] = $_POST['subtotal'] + $_POST['impuesto'];

        $edit = $this->updateCompra($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Compra actualizada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function deleteCompra() {
        $status = 500;
        $message = 'Error al eliminar la compra';

        $delete = $this->deleteCompraById($_POST['id']);

        if ($delete) {
            $status = 200;
            $message = 'Compra eliminada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function getTotales() {
        $totales = $this->getTotalesByType([
            'activo' => 1,
            'udn_id' => $_POST['udn']
        ]);

        return [
            'status'  => 200,
            'totales' => $totales
        ];
    }


    // Proveedores

    function lsProveedores() {
        require_once '../mdl/mdl-proveedores.php';
        $mdlProv = new mdl();
        
        $__row = [];
        $ls = $mdlProv->listProveedores([$_POST['activo']]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['activo'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'proveedor.editProveedor(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'proveedor.statusProveedor(' . $key['id'] . ', ' . $key['activo'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'proveedor.statusProveedor(' . $key['id'] . ', ' . $key['activo'] . ')'
                ];
            }

            $__row[] = [
                'Nombre'    => $key['nombre'],
                'RFC'       => $key['rfc'] ?: 'N/A',
                'Teléfono'  => $key['telefono'] ?: 'N/A',
                'Email'     => $key['email'] ?: 'N/A',
                'Estado'    => renderStatus($key['activo']),
                'a'         => $a
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function getProveedor() {
        require_once '../mdl/mdl-proveedores.php';
        $mdlProv = new mdl();
        
        $status = 404;
        $message = 'Proveedor no encontrado';
        $data = null;

        $proveedor = $mdlProv->getProveedorById($_POST['id']);

        if ($proveedor) {
            $status = 200;
            $message = 'Proveedor encontrado';
            $data = $proveedor;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }


    function addProveedor() {
        require_once '../mdl/mdl-proveedores.php';
        $mdlProv = new mdl();
        
        $status = 500;
        $message = 'Error al registrar el proveedor';

        $exists = $mdlProv->existsProveedorByName([$_POST['nombre']]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe un proveedor con ese nombre'
            ];
        }

        $_POST['fecha_creacion'] = date('Y-m-d H:i:s');
        $_POST['activo'] = 1;

        $create = $mdlProv->createProveedor($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Proveedor registrado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editProveedor() {
        require_once '../mdl/mdl-proveedores.php';
        $mdlProv = new mdl();
        
        $status = 500;
        $message = 'Error al editar el proveedor';

        $exists = $mdlProv->existsOtherProveedorByName([$_POST['nombre'], $_POST['id']]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe otro proveedor con ese nombre'
            ];
        }

        $edit = $mdlProv->updateProveedor($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Proveedor actualizado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function statusProveedor() {
        require_once '../mdl/mdl-proveedores.php';
        $mdlProv = new mdl();
        
        $status = 500;
        $message = 'Error al cambiar el estado del proveedor';

        $update = $mdlProv->updateProveedor($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }
}


// Complements

function dropdown($id) {
    return [
        [
            'icon'    => 'icon-eye',
            'text'    => 'Ver detalle',
            'onclick' => "app.viewCompra($id)"
        ],
        [
            'icon'    => 'icon-pencil',
            'text'    => 'Editar',
            'onclick' => "app.editCompra($id)"
        ],
        [
            'icon'    => 'icon-trash',
            'text'    => 'Eliminar',
            'onclick' => "app.deleteCompra($id)"
        ]
    ];
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

function evaluar($monto) {
    return '$ ' . number_format($monto, 2, '.', ',');
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
