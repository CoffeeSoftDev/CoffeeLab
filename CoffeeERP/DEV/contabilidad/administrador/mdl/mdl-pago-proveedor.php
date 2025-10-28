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

    function listPagos($array) {
        $where = "sp.operation_date BETWEEN ? AND ?";
        $data = [$array['fi'], $array['ff']];

        if (!empty($array['udn'])) {
            $where .= " AND s.udn_id = ?";
            $data[] = $array['udn'];
        }

        $query = "
            SELECT 
                sp.id,
                sp.operation_date,
                sp.amount,
                sp.description,
                s.name AS supplier_name,
                s.rfc,
                s.balance,
                sp.active
            FROM {$this->bd}supplier_payment AS sp
            LEFT JOIN {$this->bd}supplier AS s ON sp.supplier_id = s.id
            WHERE {$where}
            ORDER BY sp.operation_date DESC
        ";

        return $this->_Read($query, $data);
    }

    function getPagoById($array) {
        $query = "
            SELECT *
            FROM {$this->bd}supplier_payment
            WHERE id = ?
        ";

        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function createPago($array) {
        return $this->_Insert([
            'table' => $this->bd . 'supplier_payment',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updatePago($array) {
        return $this->_Update([
            'table' => $this->bd . 'supplier_payment',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function deletePagoById($array) {
        return $this->_Delete([
            'table' => $this->bd . 'supplier_payment',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function lsSuppliers($array) {
        $query = "
            SELECT 
                id, 
                name AS valor
            FROM {$this->bd}supplier
            WHERE active = 1 AND udn_id = ?
            ORDER BY name ASC
        ";
        
        return $this->_Read($query, $array);
    }

    function lsUDN() {
        $query = "
            SELECT 
                id, 
                name AS valor
            FROM {$this->bd}udn
            WHERE active = 1
            ORDER BY name ASC
        ";

        return $this->_Read($query, []);
    }

    function getSupplierById($array) {
        $query = "
            SELECT *
            FROM {$this->bd}supplier
            WHERE id = ?
        ";

        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function updateSupplierBalance($array) {
        return $this->_Update([
            'table' => $this->bd . 'supplier',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function getTotalesPagos($array) {
        $where = "sp.operation_date BETWEEN ? AND ?";
        $data = [$array['fi'], $array['ff']];

        if (!empty($array['udn'])) {
            $where .= " AND s.udn_id = ?";
            $data[] = $array['udn'];
        }

        $query = "
            SELECT 
                SUM(sp.amount) AS total_general,
                COUNT(sp.id) AS total_pagos
            FROM {$this->bd}supplier_payment AS sp
            LEFT JOIN {$this->bd}supplier AS s ON sp.supplier_id = s.id
            WHERE {$where} AND sp.active = 1
        ";

        return $this->_Read($query, $data)[0] ?? [
            'total_general' => 0,
            'total_pagos' => 0
        ];
    }
}
