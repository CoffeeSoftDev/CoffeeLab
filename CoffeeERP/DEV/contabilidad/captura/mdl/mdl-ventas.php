<?php
require_once '../../../conf/_CRUD.php';
require_once '../../../conf/_Utileria.php';
session_start();

class mdlVentas extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_contabilidad.";
    }

    // Daily Closure

    function listDailySales($array) {
        return $this->_Select([
            'table' => "{$this->bd}daily_closure",
            'values' => "
                id,
                udn_id,
                employee_id,
                operation_date,
                total_sale_without_tax,
                total_sale,
                subtotal,
                tax,
                cash,
                bank,
                foreing_currency,
                credit_consumer,
                credit_payment,
                total_received,
                difference,
                turn,
                status,
                DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') as created_at
            ",
            'where' => 'operation_date BETWEEN ? AND ? AND udn_id = ?',
            'order' => ['DESC' => 'operation_date'],
            'data' => $array
        ]);
    }

    function getDailySaleById($id) {
        return $this->_Select([
            'table' => "{$this->bd}daily_closure",
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ])[0];
    }

    function createDailySale($array) {
        return $this->_Insert([
            'table' => "{$this->bd}daily_closure",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateDailySale($array) {
        return $this->_Update([
            'table' => "{$this->bd}daily_closure",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lockClosure($id) {
        return $this->_Update([
            'table' => "{$this->bd}daily_closure",
            'values' => "status = ?",
            'where' => 'id = ?',
            'data' => ['closed', $id]
        ]);
    }

    function validateClosureStatus($id) {
        $result = $this->_Select([
            'table' => "{$this->bd}daily_closure",
            'values' => 'status',
            'where' => 'id = ?',
            'data' => [$id]
        ]);
        return $result[0]['status'] ?? null;
    }

    // Sale Details

    function createSaleDetail($array) {
        return $this->_Insert([
            'table' => "{$this->bd}detail_sale_category",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getSaleDetails($closureId) {
        return $this->_Select([
            'table' => "{$this->bd}detail_sale_category",
            'values' => '*',
            'where' => 'daily_closure_id = ?',
            'data' => [$closureId]
        ]);
    }

    // Discount Details

    function createDiscountDetail($array) {
        return $this->_Insert([
            'table' => "{$this->bd}detail_discount_courtesy",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDiscountDetails($closureId) {
        return $this->_Select([
            'table' => "{$this->bd}detail_discount_courtesy",
            'values' => '*',
            'where' => 'daily_closure_id = ?',
            'data' => [$closureId]
        ]);
    }

    // Cash Details

    function createCashDetail($array) {
        return $this->_Insert([
            'table' => "{$this->bd}detail_cash_concept",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getCashDetails($closureId) {
        return $this->_Select([
            'table' => "{$this->bd}detail_cash_concept",
            'values' => '*',
            'where' => 'daily_closure_id = ?',
            'data' => [$closureId]
        ]);
    }

    // Bank Details

    function createBankDetail($array) {
        return $this->_Insert([
            'table' => "{$this->bd}detail_bank_account",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getBankDetails($closureId) {
        return $this->_Select([
            'table' => "{$this->bd}detail_bank_account",
            'values' => '*',
            'where' => 'daily_closure_id = ?',
            'data' => [$closureId]
        ]);
    }

    // Credit Details

    function createCreditDetail($array) {
        return $this->_Insert([
            'table' => "{$this->bd}detail_credit_customer",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getCreditDetails($closureId) {
        return $this->_Select([
            'table' => "{$this->bd}detail_credit_customer",
            'values' => '*',
            'where' => 'daily_closure_id = ?',
            'data' => [$closureId]
        ]);
    }

    function getPaymentDetails($closureId) {
        $cash = $this->getCashDetails($closureId);
        $banks = $this->getBankDetails($closureId);
        $credits = $this->getCreditDetails($closureId);

        return [
            'cash' => $cash,
            'banks' => $banks,
            'credits' => $credits
        ];
    }

    // Turn Summary

    function getTurnSummaryByUDN($array) {
        return $this->_Select([
            'table' => "{$this->bd}daily_closure",
            'values' => "
                turn,
                operation_date,
                SUM(total_sale) as total_sale,
                SUM(total_received) as total_received,
                SUM(difference) as difference,
                COUNT(*) as count
            ",
            'where' => 'operation_date BETWEEN ? AND ? AND udn_id = ? AND turn IS NOT NULL',
            'group' => 'turn, operation_date',
            'order' => ['ASC' => 'operation_date, turn'],
            'data' => $array
        ]);
    }

    // File Management

    function createClosureFile($array) {
        return $this->_Insert([
            'table' => "{$this->bd}closure_files",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getClosureFiles($closureId) {
        return $this->_Select([
            'table' => "{$this->bd}closure_files",
            'values' => '*',
            'where' => 'daily_closure_id = ?',
            'data' => [$closureId]
        ]);
    }

    function deleteClosureFile($id) {
        return $this->_Delete([
            'table' => "{$this->bd}closure_files",
            'where' => 'id = ?',
            'data' => [$id]
        ]);
    }

    function getClosureFileById($id) {
        return $this->_Select([
            'table' => "{$this->bd}closure_files",
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ])[0];
    }
}
