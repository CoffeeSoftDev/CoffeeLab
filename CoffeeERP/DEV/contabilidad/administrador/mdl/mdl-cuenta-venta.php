<?php
require_once '../../../conf/_CRUD.php';
require_once '../../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd   = "rfwsmqex_contabilidad.";
    }

    function listSalesAccount($array) {
        $query = "
            SELECT 
                sale_category.id,
                sale_category.udn_id,
                sale_category.name,
                sale_category.tax_iva,
                sale_category.tax_ieps,
                sale_category.tax_hospedaje,
                sale_category.discount,
                sale_category.courtesy,
                sale_category.active,
                udn.UDN AS udn_nombre
            FROM {$this->bd}sale_category
            LEFT JOIN udn ON sale_category.udn_id = udn.idUDN
            WHERE sale_category.udn_id = ?
            ORDER BY sale_category.name ASC
        ";
        
        return $this->_Read($query, $array);
    }

    function getSalesAccountById($array) {
        return $this->_Select([
            'table' => "{$this->bd}sale_category",
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM {$this->bd}udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function existsSalesAccountByName($array) {
        $query = "
            SELECT COUNT(*) as total
            FROM {$this->bd}sale_category
            WHERE LOWER(name) = LOWER(?)
            AND udn_id = ?
            AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0]['total'];
    }

    function createSalesAccount($array) {
        return $this->_Insert([
            'table' => "{$this->bd}sale_category",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSalesAccount($array) {
        return $this->_Update([
            'table' => "{$this->bd}sale_category",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }


}
