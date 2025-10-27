<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-admin.php';

class ctrl extends mdl {

    function init() {
        return [
            'saleCategories' => $this->lsSaleCategory([$_POST['udn']]),
            'discounts' => $this->lsDiscount([$_POST['udn']]),
            'cashConcepts' => $this->lsCashConcept([$_POST['udn']]),
            'bankAccounts' => $this->lsBankAccount([$_POST['udn']]),
            'customers' => $this->lsCustomer([$_POST['udn']])
        ];
    }

    // Sale Categories

    function lsSaleCategories() {
        $__row = [];
        $ls = $this->listSaleCategories([$_POST['active'], $_POST['udn']]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminModule.editSaleCategory(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminModule.statusSaleCategory(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminModule.statusSaleCategory(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['valor'],
                'Descripción' => $key['description'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => $key['created_at'],
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSaleCategory() {
        $get = $this->getSaleCategoryById($_POST['id']);

        return [
            'status' => $get ? 200 : 404,
            'message' => $get ? 'Categoría obtenida' : 'No encontrada',
            'data' => $get
        ];
    }

    function addSaleCategory() {
        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $create = $this->createSaleCategory($this->util->sql($_POST));

        return [
            'status' => $create ? 200 : 500,
            'message' => $create ? 'Categoría agregada correctamente' : 'Error al agregar'
        ];
    }

    function editSaleCategory() {
        $edit = $this->updateSaleCategory($this->util->sql($_POST, 1));

        return [
            'status' => $edit ? 200 : 500,
            'message' => $edit ? 'Categoría actualizada' : 'Error al actualizar'
        ];
    }

    function statusSaleCategory() {
        $update = $this->updateSaleCategory($this->util->sql($_POST, 1));

        return [
            'status' => $update ? 200 : 500,
            'message' => $update ? 'Estado actualizado' : 'Error al cambiar estado'
        ];
    }

    // Discounts and Courtesies

    function lsDiscounts() {
        $__row = [];
        $ls = $this->listDiscounts([$_POST['active'], $_POST['udn']]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminModule.editDiscount(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminModule.statusDiscount(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminModule.statusDiscount(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $taxes = [];
            if ($key['tax_iva']) $taxes[] = 'IVA';
            if ($key['tax_ieps']) $taxes[] = 'IEPS';
            if ($key['tax_hospedaje']) $taxes[] = 'Hospedaje';

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['valor'],
                'Impuestos' => implode(', ', $taxes) ?: 'Sin impuestos',
                'Estado' => renderStatus($key['active']),
                'Fecha' => $key['created_at'],
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getDiscount() {
        $get = $this->getDiscountById($_POST['id']);

        return [
            'status' => $get ? 200 : 404,
            'message' => $get ? 'Descuento obtenido' : 'No encontrado',
            'data' => $get
        ];
    }

    function addDiscount() {
        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $create = $this->createDiscount($this->util->sql($_POST));

        return [
            'status' => $create ? 200 : 500,
            'message' => $create ? 'Descuento/Cortesía agregado correctamente' : 'Error al agregar'
        ];
    }

    function editDiscount() {
        $edit = $this->updateDiscount($this->util->sql($_POST, 1));

        return [
            'status' => $edit ? 200 : 500,
            'message' => $edit ? 'Descuento/Cortesía actualizado' : 'Error al actualizar'
        ];
    }

    function statusDiscount() {
        $update = $this->updateDiscount($this->util->sql($_POST, 1));

        return [
            'status' => $update ? 200 : 500,
            'message' => $update ? 'Estado actualizado' : 'Error al cambiar estado'
        ];
    }

    // Cash Concepts

    function lsCashConcepts() {
        $__row = [];
        $ls = $this->listCashConcepts([$_POST['active'], $_POST['udn']]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminModule.editCashConcept(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminModule.statusCashConcept(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminModule.statusCashConcept(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $operationType = $key['operation_type'] === 'suma' ? 
                '<span class="badge bg-success">Suma</span>' : 
                '<span class="badge bg-danger">Resta</span>';

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['valor'],
                'Operación' => $operationType,
                'Estado' => renderStatus($key['active']),
                'Fecha' => $key['created_at'],
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getCashConcept() {
        $get = $this->getCashConceptById($_POST['id']);

        return [
            'status' => $get ? 200 : 404,
            'message' => $get ? 'Concepto obtenido' : 'No encontrado',
            'data' => $get
        ];
    }

    function addCashConcept() {
        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $create = $this->createCashConcept($this->util->sql($_POST));

        return [
            'status' => $create ? 200 : 500,
            'message' => $create ? 'Concepto agregado correctamente' : 'Error al agregar'
        ];
    }

    function editCashConcept() {
        $edit = $this->updateCashConcept($this->util->sql($_POST, 1));

        return [
            'status' => $edit ? 200 : 500,
            'message' => $edit ? 'Concepto actualizado' : 'Error al actualizar'
        ];
    }

    function statusCashConcept() {
        $update = $this->updateCashConcept($this->util->sql($_POST, 1));

        return [
            'status' => $update ? 200 : 500,
            'message' => $update ? 'Estado actualizado' : 'Error al cambiar estado'
        ];
    }

    // Customers

    function lsCustomers() {
        $__row = [];
        $ls = $this->listCustomers([$_POST['active'], $_POST['udn']]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminModule.editCustomer(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminModule.statusCustomer(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminModule.statusCustomer(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $balanceClass = $key['balance'] > 0 ? 'text-success' : ($key['balance'] < 0 ? 'text-danger' : '');

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['valor'],
                'Saldo' => [
                    'html' => '$' . number_format($key['balance'], 2),
                    'class' => $balanceClass
                ],
                'Estado' => renderStatus($key['active']),
                'Fecha' => $key['created_at'],
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getCustomer() {
        $get = $this->getCustomerById($_POST['id']);

        return [
            'status' => $get ? 200 : 404,
            'message' => $get ? 'Cliente obtenido' : 'No encontrado',
            'data' => $get
        ];
    }

    function addCustomer() {
        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;
        if (!isset($_POST['balance'])) {
            $_POST['balance'] = 0;
        }

        $create = $this->createCustomer($this->util->sql($_POST));

        return [
            'status' => $create ? 200 : 500,
            'message' => $create ? 'Cliente agregado correctamente' : 'Error al agregar'
        ];
    }

    function editCustomer() {
        $edit = $this->updateCustomer($this->util->sql($_POST, 1));

        return [
            'status' => $edit ? 200 : 500,
            'message' => $edit ? 'Cliente actualizado' : 'Error al actualizar'
        ];
    }

    function statusCustomer() {
        $update = $this->updateCustomer($this->util->sql($_POST, 1));

        return [
            'status' => $update ? 200 : 500,
            'message' => $update ? 'Estado actualizado' : 'Error al cambiar estado'
        ];
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

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
