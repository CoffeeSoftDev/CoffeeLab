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

    function listSuppliers($array) {
        return $this->_Select([
            'table' => $this->bd . 'supplier',
            'values' => "
                id,
                name,
                rfc,
                phone,
                email,
                balance,
                active
            ",
            'where' => 'udn_id = ? AND active = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    function getSupplierById($id) {
        $result = $this->_Select([
            'table' => $this->bd . 'supplier',
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ]);

        return $result ? $result[0] : null;
    }

    function createSupplier($array) {
        return $this->_Insert([
            'table' => $this->bd . 'supplier',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSupplier($array) {
        return $this->_Update([
            'table' => $this->bd . 'supplier',
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lsSuppliers($udnId) {
        return $this->_Select([
            'table' => $this->bd . 'supplier',
            'values' => 'id, name AS valor',
            'where' => 'udn_id = ? AND active = 1',
            'order' => ['ASC' => 'name'],
            'data' => [$udnId]
        ]);
    }

    function updateSupplierBalance($array) {
        return $this->_Update([
            'table' => $this->bd . 'supplier',
            'values' => 'balance = balance + ?',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }
}
