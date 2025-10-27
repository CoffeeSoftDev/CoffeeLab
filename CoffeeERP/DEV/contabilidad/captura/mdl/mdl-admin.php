<?php
require_once '../../../conf/_CRUD.php';
require_once '../../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_contabilidad.";
    }

    // Sale Categories

    function listSaleCategories($array) {
        return $this->_Select([
            'table' => "{$this->bd}sale_category",
            'values' => "
                id,
                name as valor,
                description,
                active,
                DATE_FORMAT(created_at, '%d/%m/%Y') as created_at
            ",
            'where' => 'active = ? AND udn_id = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSaleCategoryById($id) {
        return $this->_Select([
            'table' => "{$this->bd}sale_category",
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ])[0];
    }

    function createSaleCategory($array) {
        return $this->_Insert([
            'table' => "{$this->bd}sale_category",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSaleCategory($array) {
        return $this->_Update([
            'table' => "{$this->bd}sale_category",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lsSaleCategory($array) {
        return $this->_Select([
            'table' => "{$this->bd}sale_category",
            'values' => "id, name as valor",
            'where' => 'active = 1 AND udn_id = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    // Discounts and Courtesies

    function listDiscounts($array) {
        return $this->_Select([
            'table' => "{$this->bd}discount_courtesy",
            'values' => "
                id,
                name as valor,
                tax_iva,
                tax_ieps,
                tax_hospedaje,
                active,
                DATE_FORMAT(created_at, '%d/%m/%Y') as created_at
            ",
            'where' => 'active = ? AND udn_id = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getDiscountById($id) {
        return $this->_Select([
            'table' => "{$this->bd}discount_courtesy",
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ])[0];
    }

    function createDiscount($array) {
        return $this->_Insert([
            'table' => "{$this->bd}discount_courtesy",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateDiscount($array) {
        return $this->_Update([
            'table' => "{$this->bd}discount_courtesy",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lsDiscount($array) {
        return $this->_Select([
            'table' => "{$this->bd}discount_courtesy",
            'values' => "id, name as valor, tax_iva, tax_ieps, tax_hospedaje",
            'where' => 'active = 1 AND udn_id = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    // Cash Concepts

    function listCashConcepts($array) {
        return $this->_Select([
            'table' => "{$this->bd}cash_concept",
            'values' => "
                id,
                name as valor,
                operation_type,
                active,
                DATE_FORMAT(created_at, '%d/%m/%Y') as created_at
            ",
            'where' => 'active = ? AND udn_id = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getCashConceptById($id) {
        return $this->_Select([
            'table' => "{$this->bd}cash_concept",
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ])[0];
    }

    function createCashConcept($array) {
        return $this->_Insert([
            'table' => "{$this->bd}cash_concept",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCashConcept($array) {
        return $this->_Update([
            'table' => "{$this->bd}cash_concept",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lsCashConcept($array) {
        return $this->_Select([
            'table' => "{$this->bd}cash_concept",
            'values' => "id, name as valor, operation_type",
            'where' => 'active = 1 AND udn_id = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    // Bank Accounts

    function listBankAccounts($array) {
        return $this->_Select([
            'table' => "{$this->bd}bank_account",
            'values' => "
                id,
                name as valor,
                account_number,
                bank_name,
                code,
                active,
                DATE_FORMAT(created_at, '%d/%m/%Y') as created_at
            ",
            'where' => 'active = ? AND udn_id = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getBankAccountById($id) {
        return $this->_Select([
            'table' => "{$this->bd}bank_account",
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ])[0];
    }

    function createBankAccount($array) {
        return $this->_Insert([
            'table' => "{$this->bd}bank_account",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateBankAccount($array) {
        return $this->_Update([
            'table' => "{$this->bd}bank_account",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lsBankAccount($array) {
        return $this->_Select([
            'table' => "{$this->bd}bank_account",
            'values' => "id, name as valor, code",
            'where' => 'active = 1 AND udn_id = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    // Customers

    function listCustomers($array) {
        return $this->_Select([
            'table' => "{$this->bd}customer",
            'values' => "
                id,
                name as valor,
                balance,
                active,
                DATE_FORMAT(created_at, '%d/%m/%Y') as created_at
            ",
            'where' => 'active = ? AND udn_id = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getCustomerById($id) {
        return $this->_Select([
            'table' => "{$this->bd}customer",
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ])[0];
    }

    function createCustomer($array) {
        return $this->_Insert([
            'table' => "{$this->bd}customer",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCustomer($array) {
        return $this->_Update([
            'table' => "{$this->bd}customer",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function updateCustomerBalance($array) {
        return $this->_Update([
            'table' => "{$this->bd}customer",
            'values' => 'balance = balance + ?',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function lsCustomer($array) {
        return $this->_Select([
            'table' => "{$this->bd}customer",
            'values' => "id, name as valor, balance",
            'where' => 'active = 1 AND udn_id = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }
}
