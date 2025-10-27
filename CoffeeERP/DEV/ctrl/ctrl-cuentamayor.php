<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-cuentamayor.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN()
        ];
    }

    // Cuenta de Mayor

    function lsCuentaMayor() {
        $__row = [];
        $udn = $_POST['udn'];
        $ls = $this->listProductClass([$udn]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'app.editCuentaMayor(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'app.statusCuentaMayor(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'app.statusCuentaMayor(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'          => $key['id'],
                'Nombre'      => $key['name'],
                'Descripción' => $key['description'],
                'Estado'      => renderStatus($key['active']),
                'a'           => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getCuentaMayor() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Cuenta no encontrada';
        $data = null;

        $cuenta = $this->getProductClassById($id);

        if ($cuenta) {
            $status = 200;
            $message = 'Cuenta encontrada';
            $data = $cuenta;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addCuentaMayor() {
        $status = 500;
        $message = 'No se pudo agregar la cuenta';

        $exists = $this->existsProductClassByName([$_POST['name'], $_POST['udn_id']]);

        if (!$exists) {
            $_POST['active'] = 1;
            $create = $this->createProductClass($this->util->sql($_POST));
            
            if ($create) {
                $status = 200;
                $message = 'Cuenta agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una cuenta con ese nombre en esta unidad de negocio';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editCuentaMayor() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar cuenta';

        $edit = $this->updateProductClass($this->util->sql($_POST, 1));
        
        if ($edit) {
            $status = 200;
            $message = 'Cuenta editada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function statusCuentaMayor() {
        $status = 500;
        $message = 'No se pudo actualizar el estado de la cuenta';

        $update = $this->updateProductClass($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado de la cuenta se actualizó correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    // Subcuenta de Mayor

    function lsSubcuenta() {
        $__row = [];
        $udn = $_POST['udn'];
        $ls = $this->listProduct([$udn]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'subAccount.editSubcuenta(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'subAccount.statusSubcuenta(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'subAccount.statusSubcuenta(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'            => $key['id'],
                'Nombre'        => $key['name'],
                'Cuenta Mayor'  => $key['cuenta_mayor'],
                'Estado'        => renderStatus($key['active']),
                'a'             => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getSubcuenta() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Subcuenta no encontrada';
        $data = null;

        $subcuenta = $this->getProductById($id);

        if ($subcuenta) {
            $status = 200;
            $message = 'Subcuenta encontrada';
            $data = $subcuenta;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addSubcuenta() {
        $status = 500;
        $message = 'No se pudo agregar la subcuenta';

        $exists = $this->existsProductByName([$_POST['name'], $_POST['clase_insumo_id']]);

        if (!$exists) {
            $_POST['active'] = 1;
            $create = $this->createProduct($this->util->sql($_POST));
            
            if ($create) {
                $status = 200;
                $message = 'Subcuenta agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una subcuenta con ese nombre';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editSubcuenta() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar subcuenta';

        $edit = $this->updateProduct($this->util->sql($_POST, 1));
        
        if ($edit) {
            $status = 200;
            $message = 'Subcuenta editada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function statusSubcuenta() {
        $status = 500;
        $message = 'No se pudo actualizar el estado de la subcuenta';

        $update = $this->updateProduct($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado de la subcuenta se actualizó correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    // Tipos de Compra

    function lsTipoCompra() {
        $__row = [];
        $udn = $_POST['udn'];
        $ls = $this->listTipoCompra([$udn]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'purchaseType.editTipoCompra(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'purchaseType.statusTipoCompra(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'purchaseType.statusTipoCompra(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'          => $key['id'],
                'Nombre'      => $key['nombre'],
                'Descripción' => $key['descripcion'],
                'Estado'      => renderStatus($key['active']),
                'a'           => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getTipoCompra() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Tipo de compra no encontrado';
        $data = null;

        $tipo = $this->getTipoCompraById($id);

        if ($tipo) {
            $status = 200;
            $message = 'Tipo de compra encontrado';
            $data = $tipo;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addTipoCompra() {
        $status = 500;
        $message = 'No se pudo agregar el tipo de compra';

        $exists = $this->existsTipoCompraByName([$_POST['nombre'], $_POST['udn_id']]);

        if (!$exists) {
            $_POST['active'] = 1;
            $_POST['date_creation'] = date('Y-m-d H:i:s');
            $create = $this->createTipoCompra($this->util->sql($_POST));
            
            if ($create) {
                $status = 200;
                $message = 'Tipo de compra agregado correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe un tipo de compra con ese nombre en esta unidad de negocio';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editTipoCompra() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar tipo de compra';

        $edit = $this->updateTipoCompra($this->util->sql($_POST, 1));
        
        if ($edit) {
            $status = 200;
            $message = 'Tipo de compra editado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function statusTipoCompra() {
        $status = 500;
        $message = 'No se pudo actualizar el estado del tipo de compra';

        $update = $this->updateTipoCompra($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado del tipo de compra se actualizó correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    // Formas de Pago

    function lsFormaPago() {
        $__row = [];
        $udn = $_POST['udn'];
        $ls = $this->listFormaPago([$udn]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'paymentMethod.editFormaPago(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'paymentMethod.statusFormaPago(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'paymentMethod.statusFormaPago(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'          => $key['id'],
                'Nombre'      => $key['nombre'],
                'Descripción' => $key['descripcion'],
                'Estado'      => renderStatus($key['active']),
                'a'           => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getFormaPago() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Forma de pago no encontrada';
        $data = null;

        $forma = $this->getFormaPagoById($id);

        if ($forma) {
            $status = 200;
            $message = 'Forma de pago encontrada';
            $data = $forma;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addFormaPago() {
        $status = 500;
        $message = 'No se pudo agregar la forma de pago';

        $exists = $this->existsFormaPagoByName([$_POST['nombre'], $_POST['udn_id']]);

        if (!$exists) {
            $_POST['active'] = 1;
            $_POST['date_creation'] = date('Y-m-d H:i:s');
            $create = $this->createFormaPago($this->util->sql($_POST));
            
            if ($create) {
                $status = 200;
                $message = 'Forma de pago agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una forma de pago con ese nombre en esta unidad de negocio';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editFormaPago() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar forma de pago';

        $edit = $this->updateFormaPago($this->util->sql($_POST, 1));
        
        if ($edit) {
            $status = 200;
            $message = 'Forma de pago editada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function statusFormaPago() {
        $status = 500;
        $message = 'No se pudo actualizar el estado de la forma de pago';

        $update = $this->updateFormaPago($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado de la forma de pago se actualizó correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }
}

// Complements

function renderStatus($active) {
    switch ($active) {
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
