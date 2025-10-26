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

    function listFormasPago($array) {
        return $this->_Select([
            'table' => $this->bd . 'payment_methods',
            'values' => "
                id,
                name,
                active,
                DATE_FORMAT(date_creation, '%d/%m/%Y %H:%i') as date_creation,
                DATE_FORMAT(date_updated, '%d/%m/%Y %H:%i') as date_updated
            ",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getFormaPagoById($id) {
        return $this->_Select([
            'table' => $this->bd . 'payment_methods',
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ])[0];
    }

    function existsFormaPagoByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}payment_methods
            WHERE LOWER(name) = LOWER(?)
            AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return count($result) > 0;
    }

    function createFormaPago($array) {
        return $this->_Insert([
            'table' => $this->bd . 'payment_methods',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateFormaPago($array) {
        return $this->_Update([
            'table' => $this->bd . 'payment_methods',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}
