<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-clientes.php';

class ctrl extends mdl {

    function init() {
        $udn = $_POST['udn'];
        
        return [
            'clients' => $this->listClients([1, $udn]),
            'movementTypes' => $this->lsMovementTypes(),
            'paymentMethods' => $this->lsPaymentMethods()
        ];
    }

    function ls() {
        $__row = [];
        $captureDate = $_POST['capture_date'];
        $udn = $_POST['udn'];
        
        $ls = $this->listMovements([1, $captureDate, $udn]);
        
        foreach ($ls as $key) {
            $a = [];
            
            $a[] = [
                'class'   => 'btn btn-sm btn-info me-1',
                'html'    => '<i class="icon-eye"></i>',
                'onclick' => 'app.viewMovimiento(' . $key['id'] . ')'
            ];
            
            $a[] = [
                'class'   => 'btn btn-sm btn-primary me-1',
                'html'    => '<i class="icon-pencil"></i>',
                'onclick' => 'app.editMovimiento(' . $key['id'] . ')'
            ];
            
            $a[] = [
                'class'   => 'btn btn-sm btn-danger',
                'html'    => '<i class="icon-trash"></i>',
                'onclick' => 'app.deleteMovimiento(' . $key['id'] . ')'
            ];
            
            $__row[] = [
                'id'              => $key['id'],
                'Cliente'         => $key['client_name'],
                'Tipo'            => renderMovementType($key['movement_type']),
                'Método de pago'  => renderPaymentMethod($key['payment_method']),
                'Monto'           => [
                    'html'  => evaluar($key['amount']),
                    'class' => 'text-end'
                ],
                'a'               => $a
            ];
        }
        
        $totals = $this->getDailyTotals([$captureDate, $udn]);
        
        return [
            'row'    => $__row,
            'ls'     => $ls,
            'totals' => $totals
        ];
    }

    function lsConcentrado() {
        $__row = [];
        $startDate = $_POST['start_date'];
        $endDate = $_POST['end_date'];
        $udn = $_POST['udn'];
        
        $ls = $this->getConsolidatedReport([$startDate, $endDate, $udn]);
        
        foreach ($ls as $key) {
            $__row[] = [
                'id'              => $key['id'],
                'Cliente'         => $key['client_name'],
                'Saldo inicial'   => [
                    'html'  => evaluar($key['initial_balance']),
                    'class' => 'text-end'
                ],
                'Consumos'        => [
                    'html'  => evaluar($key['total_consumptions']),
                    'class' => 'text-end bg-green-100 text-green-800'
                ],
                'Pagos'           => [
                    'html'  => evaluar($key['total_payments']),
                    'class' => 'text-end bg-orange-100 text-orange-800'
                ],
                'Saldo final'     => [
                    'html'  => evaluar($key['final_balance']),
                    'class' => 'text-end font-bold'
                ],
                'Movimientos'     => $key['movement_count']
            ];
        }
        
        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function addMovimiento() {
        $status = 500;
        $message = 'Error al registrar el movimiento';
        
        try {
            if (empty($_POST['client_id']) || empty($_POST['amount'])) {
                return [
                    'status' => 400,
                    'message' => 'Faltan campos obligatorios'
                ];
            }
            
            if ($_POST['movement_type'] !== 'consumo' && $_POST['payment_method'] === 'n/a') {
                return [
                    'status' => 400,
                    'message' => 'Debe seleccionar un método de pago válido para pagos y abonos'
                ];
            }
            
            $currentBalance = $this->getClientBalance([$_POST['client_id']]);
            
            $newBalance = $this->calculateNewBalance(
                $currentBalance,
                $_POST['movement_type'],
                $_POST['amount']
            );
            
            $_POST['previous_balance'] = $currentBalance;
            $_POST['new_balance'] = $newBalance;
            $_POST['capture_date'] = $_POST['capture_date'] ?? date('Y-m-d');
            $_POST['created_by'] = $_SESSION['user_id'] ?? 1;
            $_POST['active'] = 1;
            
            $create = $this->createMovement($this->util->sql($_POST));
            
            if ($create) {
                $this->updateClientBalance([$newBalance, $_POST['client_id']]);
                
                $this->logMovementAction($this->util->sql([
                    'movement_id' => $create,
                    'client_id' => $_POST['client_id'],
                    'action' => 'create',
                    'user_id' => $_SESSION['user_id'] ?? 1,
                    'new_data' => json_encode($_POST)
                ]));
                
                $status = 200;
                $message = 'Movimiento registrado correctamente';
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

    function editMovimiento() {
        $status = 500;
        $message = 'Error al editar el movimiento';
        
        try {
            $id = $_POST['id'];
            $oldMovement = $this->getMovementById([$id]);
            
            if (!$oldMovement) {
                return [
                    'status' => 404,
                    'message' => 'Movimiento no encontrado'
                ];
            }
            
            if ($_POST['movement_type'] !== 'consumo' && $_POST['payment_method'] === 'n/a') {
                return [
                    'status' => 400,
                    'message' => 'Debe seleccionar un método de pago válido'
                ];
            }
            
            $currentBalance = $this->getClientBalance([$_POST['client_id']]);
            
            $balanceWithoutOldMovement = $this->reverseMovement(
                $currentBalance,
                $oldMovement['movement_type'],
                $oldMovement['amount']
            );
            
            $newBalance = $this->calculateNewBalance(
                $balanceWithoutOldMovement,
                $_POST['movement_type'],
                $_POST['amount']
            );
            
            $_POST['previous_balance'] = $balanceWithoutOldMovement;
            $_POST['new_balance'] = $newBalance;
            $_POST['updated_by'] = $_SESSION['user_id'] ?? 1;
            
            $update = $this->updateMovement($this->util->sql($_POST, 1));
            
            if ($update) {
                $this->updateClientBalance([$newBalance, $_POST['client_id']]);
                
                $this->logMovementAction($this->util->sql([
                    'movement_id' => $id,
                    'client_id' => $_POST['client_id'],
                    'action' => 'update',
                    'user_id' => $_SESSION['user_id'] ?? 1,
                    'old_data' => json_encode($oldMovement),
                    'new_data' => json_encode($_POST)
                ]));
                
                $status = 200;
                $message = 'Movimiento actualizado correctamente';
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

    function getMovimiento() {
        $status = 500;
        $message = 'Error al obtener el movimiento';
        $data = null;
        
        $movement = $this->getMovementById([$_POST['id']]);
        
        if ($movement) {
            $status = 200;
            $message = 'Movimiento encontrado';
            $data = $movement;
        } else {
            $status = 404;
            $message = 'Movimiento no encontrado';
        }
        
        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function deleteMovimiento() {
        $status = 500;
        $message = 'Error al eliminar el movimiento';
        
        try {
            $id = $_POST['id'];
            $movement = $this->getMovementById([$id]);
            
            if (!$movement) {
                return [
                    'status' => 404,
                    'message' => 'Movimiento no encontrado'
                ];
            }
            
            $delete = $this->deleteMovementById([0, $id]);
            
            if ($delete) {
                $currentBalance = $this->getClientBalance([$movement['client_id']]);
                $newBalance = $this->reverseMovement(
                    $currentBalance,
                    $movement['movement_type'],
                    $movement['amount']
                );
                
                $this->updateClientBalance([$newBalance, $movement['client_id']]);
                
                $this->logMovementAction($this->util->sql([
                    'movement_id' => $id,
                    'client_id' => $movement['client_id'],
                    'action' => 'delete',
                    'user_id' => $_SESSION['user_id'] ?? 1,
                    'old_data' => json_encode($movement)
                ]));
                
                $status = 200;
                $message = 'Movimiento eliminado correctamente';
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

    function calculateNewBalance($currentBalance, $movementType, $amount) {
        if ($movementType === 'consumo') {
            return $currentBalance + $amount;
        } else {
            return $currentBalance - $amount;
        }
    }

    function reverseMovement($currentBalance, $movementType, $amount) {
        if ($movementType === 'consumo') {
            return $currentBalance - $amount;
        } else {
            return $currentBalance + $amount;
        }
    }
}

// Complements

function renderMovementType($type) {
    $types = [
        'consumo' => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-green-100 text-green-800">Consumo a crédito</span>',
        'abono_parcial' => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-blue-100 text-blue-800">Abono parcial</span>',
        'pago_total' => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-purple-100 text-purple-800">Pago total</span>',
        'anticipo' => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-yellow-100 text-yellow-800">Anticipo</span>'
    ];
    
    return $types[$type] ?? '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-100 text-gray-800">Desconocido</span>';
}

function renderPaymentMethod($method) {
    $methods = [
        'n/a' => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-100 text-gray-600">N/A</span>',
        'efectivo' => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-green-100 text-green-800">Efectivo</span>',
        'banco' => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-blue-100 text-blue-800">Banco</span>'
    ];
    
    return $methods[$method] ?? '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-100 text-gray-800">Desconocido</span>';
}

function evaluar($amount) {
    return '$' . number_format($amount, 2);
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
