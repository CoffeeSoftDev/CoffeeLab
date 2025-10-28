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

    function listPayments($array) {
        $leftjoin = [
            $this->bd . 'supplier' => 'supplier_payment.supplier_id = supplier.id'
        ];

        return $this->_Select([
            'table' => $this->bd . 'supplier_payment',
            'values' => "
                supplier_payment.id,
                supplier.name as supplier_name,
                supplier_payment.payment_type,
                supplier_payment.amount,
                supplier_payment.description,
                DATE_FORMAT(supplier_payment.operation_date, '%d/%m/%Y') as operation_date,
                supplier_payment.active
            ",
            'leftjoin' => $leftjoin,
            'where' => 'supplier_payment.active = 1 AND supplier_payment.udn_id = ?',
            'order' => ['DESC' => 'supplier_payment.id'],
            'data' => $array
        ]);
    }

    function getPaymentById($array) {
        return $this->_Select([
            'table' => $this->bd . 'supplier_payment',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function createPayment($array) {
        return $this->_Insert([
            'table' => $this->bd . 'supplier_payment',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updatePayment($array) {
        return $this->_Update([
            'table' => $this->bd . 'supplier_payment',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function deletePaymentById($array) {
        return $this->_Update([
            'table' => $this->bd . 'supplier_payment',
            'values' => 'active = ?',
            'where' => 'id = ?',
            'data' => [0, $array[0]]
        ]);
    }

    function lsSuppliers($array) {
        return $this->_Select([
            'table' => $this->bd . 'supplier',
            'values' => 'id, name as valor',
            'where' => 'active = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    function calculateTotals($array) {
        $query = "
            SELECT 
                COALESCE(SUM(amount), 0) as total_general,
                COALESCE(SUM(CASE WHEN payment_type = 'Fondo fijo' THEN amount ELSE 0 END), 0) as total_fondo_fijo,
                COALESCE(SUM(CASE WHEN payment_type = 'Corporativo' THEN amount ELSE 0 END), 0) as total_corporativo
            FROM {$this->bd}supplier_payment
            WHERE active = 1 AND udn_id = ?
        ";
        return $this->_Read($query, $array)[0];
    }
}
