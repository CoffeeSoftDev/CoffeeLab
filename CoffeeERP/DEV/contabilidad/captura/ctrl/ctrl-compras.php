<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-compras.php';

class ctrl extends mdl {

    function init() {
        $udnId = $_POST['udn'] ?? 5;
        
        return [
            'purchaseTypes' => $this->lsPurchaseTypes(),
            'methodPay' => $this->lsMethodPay(),
            'udn' => $this->lsUDN(),
            'productClass' => $this->listProductClassByUDN($udnId)
        ];
    }

    function ls() {
        $__row = [];
        $udnId = $_POST['udn'] ?? 1;
        $purchaseTypeFilter = $_POST['purchase_type_filter'] ?? null;

        $ls = $this->listPurchases([$udnId]);

        $totalGeneral = 0;
        $totalFondoFijo = 0;
        $totalCredito = 0;
        $totalCorporativo = 0;

        foreach ($ls as $key) {
            if ($purchaseTypeFilter && $key['purchase_type_id'] != $purchaseTypeFilter) {
                continue;
            }

            $totalGeneral += $key['total'];

            switch ($key['purchase_type_name']) {
                case 'Fondo fijo':
                    $totalFondoFijo += $key['total'];
                    break;
                case 'Crédito':
                    $totalCredito += $key['total'];
                    break;
                case 'Corporativo':
                    $totalCorporativo += $key['total'];
                    break;
            }

            $a = [];
            $a[] = [
                'class' => 'btn btn-sm btn-info me-1',
                'html' => '<i class="icon-eye"></i>',
                'onclick' => 'app.viewPurchase(' . $key['id'] . ')'
            ];
            $a[] = [
                'class' => 'btn btn-sm btn-primary me-1',
                'html' => '<i class="icon-pencil"></i>',
                'onclick' => 'app.editPurchase(' . $key['id'] . ')'
            ];
            $a[] = [
                'class' => 'btn btn-sm btn-danger',
                'html' => '<i class="icon-trash"></i>',
                'onclick' => 'app.deletePurchase(' . $key['id'] . ')'
            ];

            $__row[] = [
                'id' => $key['id'],
                'Folio' => '#' . str_pad($key['id'], 6, '0', STR_PAD_LEFT),
                'Clase de producto' => $key['product_class_name'],
                'Producto' => $key['product_name'],
                'Tipo de compra' => $key['purchase_type_name'],
                'Total' => [
                    'html' => evaluar($key['total']),
                    'class' => 'text-end'
                ],
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'totals' => [
                'general' => $totalGeneral,
                'fondoFijo' => $totalFondoFijo,
                'credito' => $totalCredito,
                'corporativo' => $totalCorporativo
            ]
        ];
    }


    function getPurchase() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Compra no encontrada';
        $data = null;

        $purchase = $this->getPurchaseById($id);

        if ($purchase) {
            $status = 200;
            $message = 'Compra encontrada';
            $data = $purchase;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addPurchase() {
        $status = 500;
        $message = 'No se pudo registrar la compra';

        if (empty($_POST['product_class_id'])) {
            return ['status' => 400, 'message' => 'Categoría de producto requerida'];
        }

        if (empty($_POST['product_id'])) {
            return ['status' => 400, 'message' => 'Producto requerido'];
        }

        if (!is_numeric($_POST['subtotal']) || $_POST['subtotal'] <= 0) {
            return ['status' => 400, 'message' => 'Subtotal inválido'];
        }

        $_POST['tax'] = $_POST['tax'] ?? 0;
        $_POST['total'] = $_POST['subtotal'] + $_POST['tax'];
        $_POST['operation_date'] = date('Y-m-d');
        $_POST['active'] = 1;

        $create = $this->createPurchase($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Compra registrada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editPurchase() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar compra';

        if (empty($_POST['product_class_id'])) {
            return ['status' => 400, 'message' => 'Categoría de producto requerida'];
        }

        if (empty($_POST['product_id'])) {
            return ['status' => 400, 'message' => 'Producto requerido'];
        }

        if (!is_numeric($_POST['subtotal']) || $_POST['subtotal'] <= 0) {
            return ['status' => 400, 'message' => 'Subtotal inválido'];
        }

        $_POST['tax'] = $_POST['tax'] ?? 0;
        $_POST['total'] = $_POST['subtotal'] + $_POST['tax'];

        $edit = $this->updatePurchase($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Compra actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function deletePurchase() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'No se pudo eliminar la compra';

        $delete = $this->deletePurchaseById($id);

        if ($delete) {
            $status = 200;
            $message = 'Compra eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }


    // Product Class operations

    function lsProductClass() {
        $__row = [];
        $udnId = $_POST['udn'] ?? 1;
        $active = $_POST['active'] ?? 1;

        $ls = $this->listProductClassByUDN([$udnId, $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminPurchase.editProductClass(' . $key['id'] . ')'
                ];
                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminPurchase.statusProductClass(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminPurchase.statusProductClass(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['name'],
                'Descripción' => $key['description'],
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function addProductClass() {
        $status = 500;
        $message = 'No se pudo agregar la categoría';

        $_POST['active'] = 1;

        $create = $this->createProductClass($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Categoría agregada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editProductClass() {
        $status = 500;
        $message = 'Error al editar categoría';

        $edit = $this->updateProductClass($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Categoría actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusProductClass() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateProductClass($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }


    // Product operations

    function lsProducts() {
        $__row = [];
        $active = $_POST['active'] ?? 1;

        $ls = $this->listProducts([$active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminPurchase.editProduct(' . $key['id'] . ')'
                ];
                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminPurchase.statusProduct(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminPurchase.statusProduct(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['name'],
                'Categoría' => $key['product_class_name'],
                'Descripción' => $key['description'],
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function addProduct() {
        $status = 500;
        $message = 'No se pudo agregar el producto';

        $_POST['active'] = 1;

        $create = $this->createProduct($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Producto agregado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editProduct() {
        $status = 500;
        $message = 'Error al editar producto';

        $edit = $this->updateProduct($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Producto actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusProduct() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateProduct($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }


    // Supplier operations

    function lsSuppliers() {
        $__row = [];
        $udnId = $_POST['udn'] ?? 1;
        $active = $_POST['active'] ?? 1;

        require_once '../mdl/mdl-proveedores.php';
        $supplierModel = new mdl();
        $ls = $supplierModel->listSuppliers([$udnId, $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminPurchase.editSupplier(' . $key['id'] . ')'
                ];
                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminPurchase.statusSupplier(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminPurchase.statusSupplier(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['name'],
                'RFC' => $key['rfc'],
                'Teléfono' => $key['phone'],
                'Email' => $key['email'],
                'Saldo' => [
                    'html' => evaluar($key['balance']),
                    'class' => 'text-end'
                ],
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function addSupplier() {
        $status = 500;
        $message = 'No se pudo agregar el proveedor';

        $_POST['active'] = 1;
        $_POST['balance'] = 0.00;

        require_once '../mdl/mdl-proveedores.php';
        $supplierModel = new mdl();
        $create = $supplierModel->createSupplier($this->util->sql($_POST));

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
        $status = 500;
        $message = 'Error al editar proveedor';

        require_once '../mdl/mdl-proveedores.php';
        $supplierModel = new mdl();
        $edit = $supplierModel->updateSupplier($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Proveedor actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSupplier() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        require_once '../mdl/mdl-proveedores.php';
        $supplierModel = new mdl();
        $update = $supplierModel->updateSupplier($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getSupplier() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Proveedor no encontrado';
        $data = null;

        require_once '../mdl/mdl-proveedores.php';
        $supplierModel = new mdl();
        $supplier = $supplierModel->getSupplierById($id);

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

    function getProductClass() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Categoría no encontrada';
        $data = null;

        $productClass = $this->getProductClassById($id);

        if ($productClass) {
            $status = 200;
            $message = 'Categoría encontrada';
            $data = $productClass;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function getProduct() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Producto no encontrado';
        $data = null;

        $product = $this->getProductById($id);

        if ($product) {
            $status = 200;
            $message = 'Producto encontrado';
            $data = $product;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function getProductsByClass() {
        $productClassId = $_POST['product_class_id'];
        return $this->lsProductsByID($productClassId);
    }

    function getSuppliersByUdn() {
        $udnId = $_POST['udn_id'];
        require_once '../mdl/mdl-proveedores.php';
        $supplierModel = new mdl();
        return $supplierModel->lsSuppliers($udnId);
    }
}

// Complements

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

function evaluar($amount) {
    return '$' . number_format($amount, 2);
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
