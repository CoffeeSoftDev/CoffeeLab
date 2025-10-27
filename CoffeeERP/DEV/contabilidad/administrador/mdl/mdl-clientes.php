<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_contabilidad.";
    }

    // Movimientos de Crédito

    function listMovements($filters) {
        $leftjoin = [
            $this->bd . 'customer' => 'detail_credit_customer.customer_id = customer.id',
            $this->bd . 'daily_closure' => 'detail_credit_customer.daily_closure_id = daily_closure.id'
        ];

        $where = 'daily_closure.udn_id = ?';
        $data = [$filters['udn']];

        if (!empty($filters['movement_type'])) {
            $where .= ' AND detail_credit_customer.movement_type LIKE ?';
            $data[] = '%' . $filters['movement_type'] . '%';
        }

        if (!empty($filters['fi']) && !empty($filters['ff'])) {
            $where .= ' AND DATE(detail_credit_customer.created_at) BETWEEN ? AND ?';
            $data[] = $filters['fi'];
            $data[] = $filters['ff'];
        }

        return $this->_Select([
            'table'    => $this->bd . 'detail_credit_customer',
            'values'   => "
                detail_credit_customer.id,
                customer.name as customer_name,
                detail_credit_customer.movement_type,
                detail_credit_customer.method_pay,
                detail_credit_customer.amount,
                detail_credit_customer.description,
                detail_credit_customer.created_at,
                detail_credit_customer.updated_by,
                customer.balance as current_balance,
                daily_closure.turn,
                DATE_FORMAT(detail_credit_customer.created_at, '%d/%m/%Y %H:%i') as formatted_date
            ",
            'leftjoin' => $leftjoin,
            'where'    => $where,
            'order'    => ['DESC' => 'detail_credit_customer.created_at'],
            'data'     => $data
        ]);
    }

    function getMovementById($id) {
        $leftjoin = [
            $this->bd . 'customer' => 'detail_credit_customer.customer_id = customer.id',
            $this->bd . 'daily_closure' => 'detail_credit_customer.daily_closure_id = daily_closure.id'
        ];

        $result = $this->_Select([
            'table'    => $this->bd . 'detail_credit_customer',
            'values'   => "
                detail_credit_customer.*,
                customer.name as customer_name,
                customer.balance as current_balance,
                daily_closure.turn,
                daily_closure.operation_date,
                DATE_FORMAT(detail_credit_customer.created_at, '%d/%m/%Y %H:%i') as formatted_date
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'detail_credit_customer.id = ?',
            'data'     => [$id]
        ]);

        return !empty($result) ? $result[0] : null;
    }

    function createMovement($data) {
        return $this->_Insert([
            'table'  => $this->bd . 'detail_credit_customer',
            'values' => $data['values'],
            'data'   => $data['data']
        ]);
    }

    function updateMovement($data) {
        return $this->_Update([
            'table'  => $this->bd . 'detail_credit_customer',
            'values' => $data['values'],
            'where'  => $data['where'],
            'data'   => $data['data']
        ]);
    }

    function deleteMovementById($id) {
        return $this->_Delete([
            'table' => $this->bd . 'detail_credit_customer',
            'where' => 'id = ?',
            'data'  => [$id]
        ]);
    }

    // Clientes

    function listCustomers($filters) {
        $where = 'active = ? AND udn_id = ?';
        $data = [$filters['active'], $filters['udn']];

        return $this->_Select([
            'table'  => $this->bd . 'customer',
            'values' => "
                id,
                name,
                balance,
                active,
                DATE_FORMAT(created_at, '%d/%m/%Y') as formatted_date
            ",
            'where'  => $where,
            'order'  => ['DESC' => 'id'],
            'data'   => $data
        ]);
    }

    function getCustomerById($id) {
        $result = $this->_Select([
            'table'  => $this->bd . 'customer',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
        ]);

        return !empty($result) ? $result[0] : null;
    }

    function createCustomer($data) {
        return $this->_Insert([
            'table'  => $this->bd . 'customer',
            'values' => $data['values'],
            'data'   => $data['data']
        ]);
    }

    function updateCustomer($data) {
        return $this->_Update([
            'table'  => $this->bd . 'customer',
            'values' => $data['values'],
            'where'  => $data['where'],
            'data'   => $data['data']
        ]);
    }

    function updateCustomerBalance($customer_id, $amount, $operation) {
        $customer = $this->getCustomerById($customer_id);
        
        if (!$customer) {
            return false;
        }

        $new_balance = $operation === 'add' 
            ? $customer['balance'] + $amount 
            : $customer['balance'] - $amount;

        $new_balance = max(0, $new_balance);

        return $this->_Update([
            'table'  => $this->bd . 'customer',
            'values' => 'balance = ?',
            'where'  => 'id = ?',
            'data'   => [$new_balance, $customer_id]
        ]);
    }

    function existsCustomerByName($name, $udn_id, $exclude_id = null) {
        $where = 'LOWER(name) = LOWER(?) AND udn_id = ? AND active = 1';
        $data = [$name, $udn_id];

        if ($exclude_id !== null) {
            $where .= ' AND id != ?';
            $data[] = $exclude_id;
        }

        $result = $this->_Select([
            'table'  => $this->bd . 'customer',
            'values' => 'id',
            'where'  => $where,
            'data'   => $data
        ]);

        return count($result) > 0;
    }

    // Auxiliares

    function lsUDN() {
        return $this->_Select([
            'table'  => $this->bd . 'udn',
            'values' => 'id, name as valor',
            'where'  => 'active = 1',
            'order'  => ['ASC' => 'name']
        ]);
    }

    function lsMovementTypes() {
        return [
            ['id' => 'Consumo a crédito', 'valor' => 'Consumo a crédito'],
            ['id' => 'Anticipo', 'valor' => 'Anticipo'],
            ['id' => 'Pago total', 'valor' => 'Pago total']
        ];
    }

    function lsPaymentMethods() {
        return [
            ['id' => 'Efectivo', 'valor' => 'Efectivo'],
            ['id' => 'Banco', 'valor' => 'Banco'],
            ['id' => 'N/A', 'valor' => 'N/A (No aplica)']
        ];
    }

    function getCurrentDailyClosure($udn_id) {
        $result = $this->_Select([
            'table'  => $this->bd . 'daily_closure',
            'values' => 'id, turn, operation_date',
            'where'  => 'udn_id = ? AND active = 1',
            'order'  => ['DESC' => 'id'],
            'data'   => [$udn_id],
            'limit'  => 1
        ]);

        return !empty($result) ? $result[0] : null;
    }

    function getCustomersByUDN($udn_id) {
        return $this->_Select([
            'table'  => $this->bd . 'customer',
            'values' => 'id, name as valor, balance',
            'where'  => 'udn_id = ? AND active = 1',
            'order'  => ['ASC' => 'name'],
            'data'   => [$udn_id]
        ]);
    }

    function getDashboardTotals($udn_id) {
        $query = "
            SELECT 
                SUM(CASE WHEN dcm.movement_type = 'Consumo a crédito' THEN dcm.amount ELSE 0 END) as total_consumos,
                SUM(CASE WHEN dcm.movement_type IN ('Anticipo', 'Pago total') AND dcm.method_pay = 'Efectivo' THEN dcm.amount ELSE 0 END) as total_pagos_efectivo,
                SUM(CASE WHEN dcm.movement_type IN ('Anticipo', 'Pago total') AND dcm.method_pay = 'Banco' THEN dcm.amount ELSE 0 END) as total_pagos_banco
            FROM {$this->bd}detail_credit_customer dcm
            INNER JOIN {$this->bd}daily_closure dc ON dcm.daily_closure_id = dc.id
            WHERE dc.udn_id = ?
        ";

        $result = $this->_Read($query, [$udn_id]);
        return !empty($result) ? $result[0] : [
            'total_consumos' => 0,
            'total_pagos_efectivo' => 0,
            'total_pagos_banco' => 0
        ];
    }
}
