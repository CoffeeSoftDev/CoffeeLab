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

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function listProductClass($array) {
        return $this->_Select([
            'table'    => $this->bd . 'product_class',
            'values'   => "
                id,
                name,
                description,
                active
            ",
            'where'    => 'udn_id = ?',
            'order'    => ['DESC' => 'id'],
            'data'     => $array
        ]);
    }

    function getProductClassById($array) {
        return $this->_Select([
            'table'  => $this->bd . 'product_class',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => $array
        ])[0];
    }

    function existsProductClassByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}product_class
            WHERE LOWER(name) = LOWER(?)
            AND udn_id = ?
            AND active = 1
        ";

        $exists = $this->_Read($query, $array);
        return count($exists);
    }

    function createProductClass($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'product_class',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateProductClass($array) {
        return $this->_Update([
            'table'  => $this->bd . 'product_class',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }


    // Subcuenta

    function listProduct($array) {
        $query = "
            SELECT 
                product.id,
                product.name,
                product.active,
                product_class.name AS product_class_name
            FROM {$this->bd}product
            LEFT JOIN {$this->bd}product_class ON product.class_insumo_id = product_class.id
            WHERE udn_id = ?
            ORDER BY product.id DESC
        ";
        
        return $this->_Read($query, $array);
    }

    function getProductById($array) {
        return $this->_Select([
            'table'  => $this->bd . 'product',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => $array
        ])[0];
    }

    function existsProductByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}product
            WHERE LOWER(name) = LOWER(?)
            AND class_insumo_id = ?
            AND active = 1
        ";

        $exists = $this->_Read($query, $array);
        return count($exists);
    }

    function createProduct($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'product',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateProduct($array) {
        return $this->_Update([
            'table'  => $this->bd . 'product',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function lsProductClass($array) {
        return $this->_Select([
            'table'  => $this->bd . 'product_class',
            'values' => 'id, name as valor',
            'where'  => 'udn_id = ? AND active = 1',
            'order'  => ['ASC' => 'name'],
            'data'   => $array
        ]);
    }
}
