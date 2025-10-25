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

    function listSuppliers($array) {
        $where = 'supplier.active = ?';
        $data = [$array['active']];

        if (!empty($array['udn_id'])) {
            $where .= ' AND supplier.udn_id = ?';
            $data[] = $array['udn_id'];
        }

        $query = "
            SELECT 
                supplier.id,
                supplier.name,
                supplier.active,
                udn.UDN as udn_name
            FROM {$this->bd}supplier
            LEFT JOIN udn ON supplier.udn_id = udn.idUDN
            WHERE {$where}
            ORDER BY supplier.name ASC
        ";

        return $this->_Read($query, $data);
    }

    function getSupplierById($array) {
        $query = "
            SELECT 
                supplier.id,
                supplier.name,
                supplier.udn_id,
                supplier.active,
                udn.UDN as udn_name
            FROM {$this->bd}supplier
            LEFT JOIN udn ON supplier.udn_id = udn.idUDN
            WHERE supplier.id = ?
        ";
        
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
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

    function existsSupplierByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}supplier
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
}
