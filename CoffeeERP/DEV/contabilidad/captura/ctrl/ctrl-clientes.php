<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-clientes.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn'            => $this->lsUDN(),
            'movementTypes'  => $this->lsMovementTypes(),
            'paymentMethods' => $this->lsPaymentMethods()
        ];
    }

    function lsMovements() {
        $__row = [];
        $udn = $_POST['udn'];
        $movementType = isset($_POST['movement_type']) ? $_POST['movement_type'] : '';

        $ls = $this->listMovements([$udn]);

        foreach ($ls as $key) {
            if (!empty($movementType) && $key['movement_type'] != $movementType) {
                continue;
            }

            $__row[] = [
                'id'              => $key['id'],
                'Cliente'         => $key['customer_name'],
                'Tipo'            => renderMovementType($key['movement_type']),
                'Forma de pago'   => $key['method_pay'],
                'Monto'           => [
                    'html'  => evaluar($key['amount']),
                    'class' => 'text-end'
                ],
                'dropdown' => dropdown($key['id'])
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getMovement() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Movimiento no encontrado';
        $data = null;

        $movement = $this->getMovementById([$id]);

        if ($movement) {
            $status = 200;
            $message = 'Movimiento encontrado';
            
            $currentBalance = floatval($movement['current_balance']);
            $amount = floatval($movement['amount']);
            
            if ($movement['movement_type'] == 'Consumo a crédito') {
                $newBalance = $currentBalance + $amount;
            } else {
                $newBalance = $currentBalance - $amount;
            }
            
            $movement['new_balance'] = $newBalance;
            $data = $movement;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addMovement() {
        $status = 500;
        $message = 'Error al registrar el movimiento';

        $udn = $_POST['udn'];
        $customerId = $_POST['customer_id'];
        $movementType = $_POST['movement_type'];
        $amount = floatval($_POST['amount']);

        $dailyClosure = $this->getCurrentDailyClosure([$udn]);
        if (!$dailyClosure) {
            return [
                'status' => 400,
                'message' => 'No hay corte diario activo para esta unidad de negocio'
            ];
        }

        $customer = $this->getCustomerById([$customerId]);
        if (!$customer || $customer['active'] != 1) {
            return [
                'status' => 404,
                'message' => 'Cliente no encontrado o inactivo'
            ];
        }

        if ($movementType == 'Consumo a crédito') {
            $_POST['method_pay'] = 'N/A';
        }

        if ($movementType == 'Pago total' || $movementType == 'Anticipo') {
            $currentBalance = floatval($customer['balance']);
            if ($amount > $currentBalance) {
                return [
                    'status' => 400,
                    'message' => 'El monto excede la deuda actual del cliente'
                ];
            }
        }

        $_POST['daily_closure_id'] = $dailyClosure['id'];
        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['updated_by'] = $_SESSION['user_name'] ?? 'Sistema';

        $create = $this->createMovement($this->util->sql($_POST));

        if ($create) {
            $currentBalance = floatval($customer['balance']);
            
            if ($movementType == 'Consumo a crédito') {
                $newBalance = $currentBalance + $amount;
            } else {
                $newBalance = $currentBalance - $amount;
            }

            $this->updateCustomerBalance([$newBalance, $customerId]);

            $status = 200;
            $message = 'Movimiento registrado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message,
            'new_balance' => $newBalance ?? 0
        ];
    }

    function editMovement() {
        $status = 500;
        $message = 'Error al actualizar el movimiento';

        $id = $_POST['id'];
        $newAmount = floatval($_POST['amount']);
        $newMovementType = $_POST['movement_type'];

        $originalMovement = $this->getMovementById([$id]);
        if (!$originalMovement) {
            return [
                'status' => 404,
                'message' => 'Movimiento no encontrado'
            ];
        }

        $customerId = $originalMovement['customer_id'];
        $customer = $this->getCustomerById([$customerId]);
        $currentBalance = floatval($customer['balance']);

        $originalAmount = floatval($originalMovement['amount']);
        $originalType = $originalMovement['movement_type'];

        if ($originalType == 'Consumo a crédito') {
            $currentBalance -= $originalAmount;
        } else {
            $currentBalance += $originalAmount;
        }

        if ($newMovementType == 'Consumo a crédito') {
            $_POST['method_pay'] = 'N/A';
            $newBalance = $currentBalance + $newAmount;
        } else {
            if ($newAmount > $currentBalance) {
                return [
                    'status' => 400,
                    'message' => 'El monto excede la deuda actual del cliente'
                ];
            }
            $newBalance = $currentBalance - $newAmount;
        }

        $_POST['updated_by'] = $_SESSION['user_name'] ?? 'Sistema';

        $update = $this->updateMovement($this->util->sql($_POST, 1));

        if ($update) {
            $this->updateCustomerBalance([$newBalance, $customerId]);
            $status = 200;
            $message = 'Movimiento actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function deleteMovement() {
        $status = 500;
        $message = 'Error al eliminar el movimiento';

        $id = $_POST['id'];

        $movement = $this->getMovementById([$id]);
        if (!$movement) {
            return [
                'status' => 404,
                'message' => 'Movimiento no encontrado'
            ];
        }

        $customerId = $movement['customer_id'];
        $customer = $this->getCustomerById([$customerId]);
        $currentBalance = floatval($customer['balance']);
        $amount = floatval($movement['amount']);

        if ($movement['movement_type'] == 'Consumo a crédito') {
            $newBalance = $currentBalance - $amount;
        } else {
            $newBalance = $currentBalance + $amount;
        }

        $delete = $this->deleteMovementById([$id]);

        if ($delete) {
            $this->updateCustomerBalance([$newBalance, $customerId]);
            $status = 200;
            $message = 'Movimiento eliminado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function lsCustomers() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = isset($_POST['active']) ? $_POST['active'] : 1;

        $ls = $this->listCustomers([$udn, $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'customerManager.editCustomer(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'customerManager.statusCustomer(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'customerManager.statusCustomer(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'           => $key['id'],
                'Nombre'       => $key['name'],
                'Saldo Actual' => [
                    'html'  => evaluar($key['balance']),
                    'class' => 'text-end'
                ],
                'Estado'       => renderStatus($key['active']),
                'a'            => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getCustomer() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Cliente no encontrado';
        $data = null;

        $customer = $this->getCustomerById([$id]);

        if ($customer) {
            $status = 200;
            $message = 'Cliente encontrado';
            $data = $customer;
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    function addCustomer() {
        $status = 500;
        $message = 'Error al registrar el cliente';

        $name = $_POST['name'];
        $udn = $_POST['udn_id'];

        $exists = $this->existsCustomerByName([$name, $udn]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe un cliente con ese nombre en esta unidad de negocio'
            ];
        }

        $_POST['balance'] = 0.00;
        $_POST['active'] = 1;

        $create = $this->createCustomer($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Cliente registrado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editCustomer() {
        $status = 500;
        $message = 'Error al actualizar el cliente';

        $update = $this->updateCustomer($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Cliente actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusCustomer() {
        $status = 500;
        $message = 'Error al cambiar el estado del cliente';

        $id = $_POST['id'];
        $newStatus = $_POST['active'];

        if ($newStatus == 0) {
            $customer = $this->getCustomerById([$id]);
            if ($customer && floatval($customer['balance']) > 0) {
                return [
                    'status' => 400,
                    'message' => 'No se puede desactivar un cliente con saldo pendiente'
                ];
            }
        }

        $update = $this->updateCustomer($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado del cliente actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getDashboardTotals() {
        $udn = $_POST['udn'];

        $query = "
            SELECT 
                SUM(CASE WHEN movement_type = 'Consumo a crédito' THEN amount ELSE 0 END) as total_consumos,
                SUM(CASE WHEN movement_type IN ('Anticipo', 'Pago total') AND method_pay = 'Efectivo' THEN amount ELSE 0 END) as total_efectivo,
                SUM(CASE WHEN movement_type IN ('Anticipo', 'Pago total') AND method_pay = 'Banco' THEN amount ELSE 0 END) as total_banco
            FROM {$this->bd}detail_credit_customer dcm
            INNER JOIN {$this->bd}daily_closure dc ON dcm.daily_closure_id = dc.id
            WHERE dc.udn_id = ?
        ";

        $result = $this->_Read($query, [$udn]);

        return [
            'total_consumos'  => $result[0]['total_consumos'] ?? 0,
            'total_efectivo'  => $result[0]['total_efectivo'] ?? 0,
            'total_banco'     => $result[0]['total_banco'] ?? 0
        ];
    }
}

function dropdown($id) {
    return [
        ['icon' => 'icon-eye', 'text' => 'Ver detalle', 'onclick' => "app.viewDetail($id)"],
        ['icon' => 'icon-pencil', 'text' => 'Editar', 'onclick' => "app.editMovement($id)"],
        ['icon' => 'icon-trash', 'text' => 'Eliminar', 'onclick' => "app.deleteMovement($id)"]
    ];
}

function renderStatus($active) {
    if ($active == 1) {
        return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Activo</span>';
    } else {
        return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Inactivo</span>';
    }
}

function renderMovementType($type) {
    $colors = [
        'Consumo a crédito' => 'bg-[#8a4600] text-[#f0ad28]',
        'Anticipo'          => 'bg-[#014737] text-[#3FC189]',
        'Pago total'        => 'bg-[#003360] text-[#4A9EFF]'
    ];

    $color = $colors[$type] ?? 'bg-gray-500 text-white';
    return '<span class="px-2 py-1 rounded-md text-sm font-semibold ' . $color . '">' . $type . '</span>';
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
