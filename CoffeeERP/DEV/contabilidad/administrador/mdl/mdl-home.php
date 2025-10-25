<?php
require_once '../../../conf/_CRUD.php';
require_once '../../../conf/_Utileria.php';

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_contabilidad.";
    }

    function getVentasPeriodo($array) {
        $query = "
            SELECT 
                COALESCE(SUM(total), 0) as total
            FROM {$this->bd}sales
            WHERE date_sale BETWEEN ? AND ?
            AND udn_id = ?
            AND active = 1
        ";
        
        $result = $this->_Read($query, $array);
        return $result[0] ?? ['total' => 0];
    }

    function getComprasPeriodo($array) {
        $query = "
            SELECT 
                COALESCE(SUM(total), 0) as total
            FROM {$this->bd}purchases
            WHERE date_purchase BETWEEN ? AND ?
            AND udn_id = ?
            AND active = 1
        ";
        
        $result = $this->_Read($query, $array);
        return $result[0] ?? ['total' => 0];
    }

    function getArchivosSubidos($array) {
        $query = "
            SELECT 
                COUNT(*) as count
            FROM {$this->bd}files
            WHERE date_upload BETWEEN ? AND ?
            AND udn_id = ?
            AND active = 1
        ";
        
        $result = $this->_Read($query, $array);
        return $result[0] ?? ['count' => 0];
    }

    function getRetirosPeriodo($array) {
        $query = "
            SELECT 
                COALESCE(SUM(amount), 0) as total
            FROM {$this->bd}withdrawals
            WHERE date_withdrawal BETWEEN ? AND ?
            AND udn_id = ?
            AND active = 1
        ";
        
        $result = $this->_Read($query, $array);
        return $result[0] ?? ['total' => 0];
    }
}
