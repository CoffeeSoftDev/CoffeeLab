<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-banco.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'paymentMethods' => $this->lsPaymentMethods(),
            'banks' => $this->listBanks([1])
        ];
    }

    function lsBankAccounts() {
        $active = $_POST['active'] ?? 1;
        $udn_id = $_POST['udn'] ?? null;
        $payment_method_id = $_POST['payment_method'] ?? null;
        
        $data = $this->listBankAccounts([
            'active' => $active,
            'udn_id' => $udn_id,
            'payment_method_id' => $payment_method_id
        ]);
        
        $rows = [];

        foreach ($data as $item) {
            $a = [];

            if ($active == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'bankAccounts.editBankAccount(' . $item['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'bankAccounts.toggleStatusAccount(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-success',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'bankAccounts.toggleStatusAccount(' . $item['id'] . ', ' . $item['active'] . ')'
                ];
            }

            $accountName = !empty($item['account_alias']) ? $item['account_alias'] : 'Sin alias';

            $rows[] = [
                'id' => $item['id'],
                'Banco' => $item['bank_name'],
                'Nombre de la cuenta' => $accountName,
                'Últimos 4 dígitos' => [
                    'html' => '<span class="badge bg-secondary">****' . $item['last_four_digits'] . '</span>',
                    'class' => 'text-center'
                ],
                'Unidad de negocio' => $item['udn_name'],
                'Forma de pago' => $item['payment_method_name'] ?? 'N/A',
                'Estado' => renderStatus($item['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $rows,
            'ls' => $data
        ];
    }

    function getBank() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Banco no encontrado';
        $data = null;

        $bank = $this->getBankById([$id]);

        if ($bank) {
            $status = 200;
            $message = 'Banco encontrado';
            $data = $bank;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function getBankAccount() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Cuenta bancaria no encontrada';
        $data = null;

        $account = $this->getBankAccountById([$id]);

        if ($account) {
            $status = 200;
            $message = 'Cuenta bancaria encontrada';
            $data = $account;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addBank() {
        $status = 500;
        $message = 'Error al agregar banco';

        if (empty($_POST['name'])) {
            return [
                'status' => 400,
                'message' => 'El nombre del banco es obligatorio'
            ];
        }

        $_POST['active'] = 1;
        $_POST['created_at'] = date('Y-m-d H:i:s');

        $exists = $this->existsBankByName([$_POST['name']]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe un banco con ese nombre'
            ];
        }

        $create = $this->createBank($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Banco agregado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function addBankAccount() {
        $status = 500;
        $message = 'Error al agregar cuenta bancaria';

        if (empty($_POST['bank_id']) || empty($_POST['last_four_digits'])) {
            return [
                'status' => 400,
                'message' => 'El banco y los últimos 4 dígitos son obligatorios'
            ];
        }

        if (!preg_match('/^\d{4}$/', $_POST['last_four_digits'])) {
            return [
                'status' => 400,
                'message' => 'Los últimos 4 dígitos deben ser numéricos'
            ];
        }

        $_POST['active'] = 1;
        $_POST['created_at'] = date('Y-m-d H:i:s');

        $create = $this->createBankAccount($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Cuenta bancaria agregada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editBankAccount() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar cuenta bancaria';

        if (empty($_POST['bank_id']) || empty($_POST['last_four_digits'])) {
            return [
                'status' => 400,
                'message' => 'El banco y los últimos 4 dígitos son obligatorios'
            ];
        }

        if (!preg_match('/^\d{4}$/', $_POST['last_four_digits'])) {
            return [
                'status' => 400,
                'message' => 'Los últimos 4 dígitos deben ser numéricos'
            ];
        }

        $edit = $this->updateBankAccount($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Cuenta bancaria actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function toggleStatusAccount() {
        $status = 500;
        $message = 'Error al cambiar el estado de la cuenta';

        $newStatus = $_POST['active'];
        
        $update = $this->updateBankAccount($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            if ($newStatus == 1) {
                $message = 'La cuenta estará disponible para captura de información.';
            } else {
                $message = 'La cuenta bancaria ya no estará disponible, pero seguirá reflejándose en los registros contables.';
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
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Activa</span>';
        case 0:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Inactiva</span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-500 text-white">Desconocido</span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
