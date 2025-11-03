<?php
require_once '../../../conf/_CRUD.php';
require_once '../../../conf/_Utileria.php';


class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_gvsl_finanzas2.";
    }

    function listWarehouseOutput($array) {
        return $this->_Select([
            'table' => $this->bd . 'warehouse_output',
            'values' => "
                warehouse_output.id,
                warehouse_output.product_id,
                warehouse_output.amount,
                warehouse_output.description,
                warehouse_output.operation_date,
                warehouse_output.active,
                product.name as product_name,
                product_class.name as product_class_name
            ",
            'leftjoin' => [
                $this->bd . 'product' => 'warehouse_output.product_id = product.id',
                $this->bd . 'product_class' => 'product.product_class_id = product_class.id'
            ],
            'where' => 'warehouse_output.operation_date = ? AND warehouse_output.udn_id = ? AND warehouse_output.active = 1',
            'order' => ['DESC' => 'warehouse_output.id'],
            'data' => $array
        ]);
    }

    function createWarehouseOutput($array) {
        return $this->_Insert([
            'table' => $this->bd . 'warehouse_output',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateWarehouseOutput($array) {
        return $this->_Update([
            'table' => $this->bd . 'warehouse_output',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function getWarehouseOutputById($array) {
        return $this->_Select([
            'table' => $this->bd . 'warehouse_output',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function deleteWarehouseOutputById($array) {
        return $this->_Update([
            'table' => $this->bd . 'warehouse_output',
            'values' => 'active = 0',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function listProducts($array = []) {
        return $this->_Select([
            'table' => $this->bd . 'product',
            'values' => "
                product.id,
                product.name as valor,
                product_class.name as classification
            ",
            'leftjoin' => [
                $this->bd . 'product_class' => 'product.product_class_id = product_class.id'
            ],
            'where' => 'product.active = 1',
            'order' => ['ASC' => 'product.name']
        ]);
    }

    function listProductClass($array = []) {
        return $this->_Select([
            'table' => $this->bd . 'product_class',
            'values' => 'id, name as valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }

    function listBusinessUnits($array = []) {
        return $this->_Select([
            'table' => 'rfwsmqex_erp.udn',
            'values' => 'DISTINCT idUDN as id, nombre_udn as valor',
            'where' => 'activo = 1',
            'order' => ['ASC' => 'nombre_udn']
        ]);
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

    function listWarehouseReport($array) {
        $query = "
            SELECT 
                p.name as product_name,
                pc.name as product_class_name,
                COALESCE(SUM(wo.amount), 0) as total_output
            FROM {$this->bd}product p
            LEFT JOIN {$this->bd}product_class pc ON p.product_class_id = pc.id
            LEFT JOIN {$this->bd}warehouse_output wo ON p.id = wo.product_id 
                AND wo.operation_date BETWEEN ? AND ?
                AND wo.udn_id = ?
                AND wo.active = 1
            WHERE p.active = 1
            GROUP BY p.id, p.name, pc.name
            ORDER BY pc.name, p.name
        ";
        return $this->_Read($query, $array);
    }

    function getBalance($array) {
        $query = "
            SELECT 
                COALESCE(SUM(amount), 0) as total
            FROM {$this->bd}warehouse_output
            WHERE operation_date BETWEEN ? AND ?
                AND udn_id = ?
                AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0]['total'] ?? 0;
    }

    function getDailyTotal($array) {
        $query = "
            SELECT COALESCE(SUM(amount), 0) as total
            FROM {$this->bd}warehouse_output
            WHERE operation_date = ?
                AND udn_id = ?
                AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0]['total'] ?? 0;
    }

    function logAudit($array) {
        return $this->_Insert([
            'table' => $this->bd . 'audit_log',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createFile($array) {
        return $this->_Insert([
            'table' => $this->bd . 'file',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function listFiles($array) {
        return $this->_Select([
            'table' => $this->bd . 'file',
            'values' => '*',
            'where' => 'udn_id = ? AND operation_date = ?',
            'order' => ['DESC' => 'upload_date'],
            'data' => $array
        ]);
    }

    function deleteFileById($array) {
        return $this->_Delete([
            'table' => $this->bd . 'file',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }
}
