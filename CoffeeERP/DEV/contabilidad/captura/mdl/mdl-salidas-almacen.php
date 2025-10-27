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

    function listWarehouseOutputs($array) {
        $where = 'warehouse_output.active = ?';
        $data = [$array['active']];

        if (!empty($array['product_id'])) {
            $where .= ' AND warehouse_output.product_id = ?';
            $data[] = $array['product_id'];
        }

        $query = "
            SELECT 
                warehouse_output.id,
                warehouse_output.product_id,
                warehouse_output.amount,
                warehouse_output.description,
                warehouse_output.operation_date,
                warehouse_output.active,
                COALESCE(product.name, 'Sin especificar') as product_name,
                DATE_FORMAT(warehouse_output.operation_date, '%d/%m/%Y %H:%i') as formatted_date
            FROM {$this->bd}warehouse_output
            LEFT JOIN {$this->bd}product ON warehouse_output.product_id = product.id
            WHERE {$where}
            ORDER BY warehouse_output.operation_date DESC, warehouse_output.id DESC
        ";

        return $this->_Read($query, $data);
    }

    function getWarehouseOutputById($array) {
        return $this->_Select([
            'table' => $this->bd . 'warehouse_output',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
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
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function deleteWarehouseOutputById($array) {
        return $this->_Update([
            'table' => $this->bd . 'warehouse_output',
            'values' => 'active = ?',
            'where' => 'id = ?',
            'data' => [0, $array[0]]
        ]);
    }

    function getTotalWarehouseOutputs($array) {
        $where = 'active = 1';
        $data = [];

        if (!empty($array['product_id'])) {
            $where .= ' AND product_id = ?';
            $data[] = $array['product_id'];
        }

        $query = "
            SELECT COALESCE(SUM(amount), 0) as total
            FROM {$this->bd}warehouse_output
            WHERE {$where}
        ";

        $result = $this->_Read($query, $data);
        return $result[0]['total'] ?? 0;
    }

    function lsProducts() {
        return $this->_Select([
            'table' => $this->bd . 'product',
            'values' => 'id, name as valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
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
}
