<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-moneda.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'paymentMethods' => $this->lsPaymentMethods()
        ];
    }

    function lsCurrencies() {
        $active = $_POST['active'] ?? 1;
        $udn_id = $_POST['udn'] ?? null;
        
        $data = $this->listCurrencies([
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
                    'onclick' => 'currency.editCurrency(' . $item['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'currency.toggleStatus(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-success',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'currency.toggleStatus(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            }

            $rows[] = [
                'id' => $item['id'],
                'Moneda extranjera' => $item['name'],
                'Símbolo' => [
                    'html' => '<span class="badge bg-info">' . $item['code'] . '</span>',
                    'class' => 'text-center'
                ],
                'Tipo de cambio (MXN)' => [
                    'html' => '$ ' . number_format($item['conversion_value'], 2),
                    'class' => 'text-end'
                ],
                'a' => $a
            ];
        }

        return [
            'row' => $rows,
            'ls' => $data
        ];
    }

    function getCurrency() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Moneda no encontrada';
        $data = null;

        $currency = $this->getCurrencyById([$id]);

        if ($currency) {
            $status = 200;
            $message = 'Moneda encontrada';
            $data = $currency;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addCurrency() {
        $status = 500;
        $message = 'Error al agregar moneda';

        if (empty($_POST['name']) || empty($_POST['code']) || empty($_POST['conversion_value'])) {
            return [
                'status' => 400,
                'message' => 'Todos los campos son obligatorios'
            ];
        }

        if ($_POST['conversion_value'] <= 0) {
            return [
                'status' => 400,
                'message' => 'El tipo de cambio debe ser mayor a cero'
            ];
        }

        $_POST['active'] = 1;
        $_POST['created_at'] = date('Y-m-d H:i:s');

        $exists = $this->existsCurrencyByName([$_POST['name'], $_POST['udn_id']]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una moneda con ese nombre para esta unidad de negocio'
            ];
        }

        $create = $this->createCurrency($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Moneda agregada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editCurrency() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar moneda';

        if (empty($_POST['name']) || empty($_POST['code']) || empty($_POST['conversion_value'])) {
            return [
                'status' => 400,
                'message' => 'Todos los campos son obligatorios'
            ];
        }

        if ($_POST['conversion_value'] <= 0) {
            return [
                'status' => 400,
                'message' => 'El tipo de cambio debe ser mayor a cero'
            ];
        }

        $edit = $this->updateCurrency($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'La moneda se actualizó con éxito. La información futura se calculará según la configuración actual de la moneda.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function toggleStatus() {
        $status = 500;
        $message = 'Error al cambiar el estado de la moneda';

        $newStatus = $_POST['active'];
        
        $update = $this->updateCurrency($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            if ($newStatus == 1) {
                $message = 'La moneda extranjera estará disponible para captura de información.';
            } else {
                $message = 'La moneda extranjera ya no estará disponible, pero seguirá reflejándose en los registros contables.';
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
