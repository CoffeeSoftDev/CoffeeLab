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

    function listMovements($array) {
        $leftjoin = [
            $this->bd . 'customer' => 'detail_credit_customer.customer_id = customer.id',
            $this->bd . 'daily_closure' => 'detail_credit_customer.daily_closure_id = daily_closure.id'
        ];

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
                daily_closure.operation_date,
                daily_closure.turn
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'daily_closure.udn_id = ?',
            'order'    => ['DESC' => 'detail_credit_customer.created_at'],
            'data'     => $array
        ]);
    }

    function getMovementById($array) {
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
                daily_closure.operation_date,
                daily_closure.turn
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'detail_credit_customer.id = ?',
            'data'     => $array
        ]);

        return count($result) > 0 ? $result[0] : null;
    }

    function createMovement($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'detail_credit_customer',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateMovement($array) {
        return $this->_Update([
            'table'  => $this->bd . 'detail_credit_customer',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function deleteMovementById($array) {
        return $this->_Delete([
            'table' => $this->bd . 'detail_credit_customer',
            'where' => 'id = ?',
            'data'  => $array
        ]);
    }

    function listCustomers($array) {
        return $this->_Select([
            'table'  => $this->bd . 'customer',
            'values' => "
                id,
                udn_id,
                name,
                balance,
                active
            ",
            'where'  => 'udn_id = ? AND active = ?',
            'order'  => ['ASC' => 'name'],
            'data'   => $array
        ]);
    }

    function getCustomerById($array) {
        $result = $this->_Select([
            'table'  => $this->bd . 'customer',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => $array
        ]);

        return count($result) > 0 ? $result[0] : null;
    }

    function createCustomer($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'customer',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateCustomer($array) {
        return $this->_Update([
            'table'  => $this->bd . 'customer',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function updateCustomerBalance($array) {
        return $this->_Update([
            'table'  => $this->bd . 'customer',
            'values' => 'balance = ?',
            'where'  => 'id = ?',
            'data'   => $array
        ]);
    }

    function existsCustomerByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}customer
            WHERE LOWER(name) = LOWER(?)
            AND udn_id = ?
            AND active = 1
        ";

        $result = $this->_Read($query, $array);
        return count($result) > 0;
    }

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

    function getCurrentDailyClosure($array) {
        $query = "
            SELECT id, operation_date, turn
            FROM {$this->bd}daily_closure
            WHERE udn_id = ?
            AND active = 1
            ORDER BY id DESC
            LIMIT 1
        ";

        $result = $this->_Read($query, $array);
        return count($result) > 0 ? $result[0] : null;
    }
}
