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

    function listCurrencies($array) {
        $where = 'foreign_currency.active = ?';
        $data = [$array['active']];

        if (!empty($array['udn_id'])) {
            $where .= ' AND foreign_currency.udn_id = ?';
            $data[] = $array['udn_id'];
        }

        $query = "
            SELECT 
                foreign_currency.id,
                foreign_currency.name,
                foreign_currency.code,
                foreign_currency.conversion_value,
                foreign_currency.active,
                udn.UDN as udn_name,
                DATE_FORMAT(foreign_currency.created_at, '%d/%m/%Y') as created_date
            FROM {$this->bd}foreign_currency
            LEFT JOIN udn ON foreign_currency.udn_id = udn.idUDN
            WHERE {$where}
            ORDER BY foreign_currency.id DESC
        ";

        return $this->_Read($query, $data);
    }

    function getCurrencyById($array) {
        return $this->_Select([
            'table' => $this->bd . 'foreign_currency',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function createCurrency($array) {
        return $this->_Insert([
            'table' => $this->bd . 'foreign_currency',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCurrency($array) {
        return $this->_Update([
            'table' => $this->bd . 'foreign_currency',
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function existsCurrencyByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}foreign_currency
            WHERE LOWER(name) = LOWER(?)
            AND udn_id = ?
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
