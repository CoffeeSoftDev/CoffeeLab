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

    function listBanks($array) {
        return $this->_Select([
            'table' => $this->bd . 'banks',
            'values' => 'id, name as valor, active',
            'where' => 'active = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    function listBankAccounts($array) {
        $where = 'bank_accounts.active = ?';
        $data = [$array['active']];

        if (!empty($array['udn_id'])) {
            $where .= ' AND bank_accounts.udn_id = ?';
            $data[] = $array['udn_id'];
        }

        if (!empty($array['payment_method_id'])) {
            $where .= ' AND bank_accounts.payment_method_id = ?';
            $data[] = $array['payment_method_id'];
        }

        $query = "
            SELECT 
                bank_accounts.id,
                bank_accounts.udn_id,
                bank_accounts.bank_id,
                bank_accounts.account_alias,
                bank_accounts.last_four_digits,
                bank_accounts.payment_method_id,
                bank_accounts.active,
                banks.name as bank_name,
                udn.UDN as udn_name,
                payment_methods.name as payment_method_name,
                DATE_FORMAT(bank_accounts.created_at, '%d/%m/%Y') as created_date
            FROM {$this->bd}bank_accounts
            INNER JOIN {$this->bd}banks ON bank_accounts.bank_id = banks.id
            LEFT JOIN udn ON bank_accounts.udn_id = udn.idUDN
            LEFT JOIN {$this->bd}payment_methods ON bank_accounts.payment_method_id = payment_methods.id
            WHERE {$where}
            ORDER BY bank_accounts.id DESC
        ";

        return $this->_Read($query, $data);
    }

    function getBankById($array) {
        return $this->_Select([
            'table' => $this->bd . 'banks',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function getBankAccountById($array) {
        return $this->_Select([
            'table' => $this->bd . 'bank_accounts',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function createBank($array) {
        return $this->_Insert([
            'table' => $this->bd . 'banks',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createBankAccount($array) {
        return $this->_Insert([
            'table' => $this->bd . 'bank_accounts',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateBankAccount($array) {
        return $this->_Update([
            'table' => $this->bd . 'bank_accounts',
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function existsBankByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}banks
            WHERE LOWER(name) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsPaymentMethods() {
        return $this->_Select([
            'table' => $this->bd . 'payment_methods',
            'values' => 'id, name as valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }
}
