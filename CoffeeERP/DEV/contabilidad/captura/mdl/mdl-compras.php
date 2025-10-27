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

    // Purchase operations

    function listPurchases($array) {
        $query = "
            SELECT 
                purchase.id,
                purchase.udn_id,
                product_class.name AS product_class_name,
                product.name AS product_name,
                purchase_type.name AS purchase_type_name,
                method_pay.name AS method_pay_name,
                supplier.name AS supplier_name,
                purchase.total,
                purchase.subtotal,
                purchase.tax,
                purchase.description,
                DATE_FORMAT(purchase.operation_date, '%d/%m/%Y') AS operation_date,
                purchase.active
            FROM {$this->bd}purchase
            LEFT JOIN {$this->bd}product_class ON purchase.product_class_id = product_class.id
            LEFT JOIN {$this->bd}product ON purchase.product_id = product.id
            LEFT JOIN {$this->bd}purchase_type ON purchase.purchase_type_id = purchase_type.id
            LEFT JOIN {$this->bd}method_pay ON purchase.method_pay_id = method_pay.id
            LEFT JOIN {$this->bd}supplier ON purchase.supplier_id = supplier.id
            WHERE purchase.udn_id = ? 
            AND purchase.active = 1
            ORDER BY purchase.id DESC
        ";
        
        return $this->_Read($query, $array);
    }

    function getPurchaseById($id) {
        $leftjoin = [
            $this->bd . 'product_class' => 'purchase.product_class_id = product_class.id',
            $this->bd . 'product' => 'purchase.product_id = product.id',
            $this->bd . 'purchase_type' => 'purchase.purchase_type_id = purchase_type.id',
            $this->bd . 'method_pay' => 'purchase.method_pay_id = method_pay.id',
            $this->bd . 'supplier' => 'purchase.supplier_id = supplier.id'
        ];

        $result = $this->_Select([
            'table' => $this->bd . 'purchase',
            'values' => "
                purchase.*,
                product_class.name AS product_class_name,
                product.name AS product_name,
                purchase_type.name AS purchase_type_name,
                method_pay.name AS method_pay_name,
                supplier.name AS supplier_name
            ",
            'leftjoin' => $leftjoin,
            'where' => 'purchase.id = ?',
            'data' => [$id]
        ]);

        return $result ? $result[0] : null;
    }


    function createPurchase($array) {
        return $this->_Insert([
            'table' => $this->bd . 'purchase',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updatePurchase($array) {
        return $this->_Update([
            'table' => $this->bd . 'purchase',
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function deletePurchaseById($id) {
        return $this->_Update([
            'table' => $this->bd . 'purchase',
            'values' => 'active = ?',
            'where' => 'id = ?',
            'data' => [0, $id]
        ]);
    }

    // Product Class operations

    function listProductClass($array) {
        return $this->_Select([
            'table' => $this->bd . 'product_class',
            'values' => "
                id,
                name,
                description,
                active
            ",
            'where' => 'udn_id = ? AND active = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    function getProductClassById($id) {
        $result = $this->_Select([
            'table' => $this->bd . 'product_class',
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ]);

        return $result ? $result[0] : null;
    }

    function createProductClass($array) {
        return $this->_Insert([
            'table' => $this->bd . 'product_class',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateProductClass($array) {
        return $this->_Update([
            'table' => $this->bd . 'product_class',
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function listProductClassByUDN($udnId) {
        return $this->_Select([
            'table' => $this->bd . 'product_class',
            'values' => 'id, name AS valor',
            'where' => 'udn_id = ? AND active = 1',
            'order' => ['ASC' => 'name'],
            'data' => [$udnId]
        ]);
    }


    // Product operations

    function listProducts($array) {
        $leftjoin = [
            $this->bd . 'product_class' => 'product.product_class_id = product_class.id'
        ];

        return $this->_Select([
            'table' => $this->bd . 'product',
            'values' => "
                product.id,
                product.name,
                product.description,
                product_class.name AS product_class_name,
                product.active
            ",
            'leftjoin' => $leftjoin,
            'where' => 'product.active = ?',
            'order' => ['ASC' => 'product.name'],
            'data' => $array
        ]);
    }

    function getProductById($id) {
        $result = $this->_Select([
            'table' => $this->bd . 'product',
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ]);

        return $result ? $result[0] : null;
    }

    function createProduct($array) {
        return $this->_Insert([
            'table' => $this->bd . 'product',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateProduct($array) {
        return $this->_Update([
            'table' => $this->bd . 'product',
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lsProductsByID($productClassId) {
        $query = "
            SELECT 
                id, 
                name AS valor
            FROM {$this->bd}product
            WHERE class_insumo_id = ? 
            AND active = 1
            ORDER BY name ASC
        ";
        
        return $this->_Read($query, [$productClassId]);
    }

    // Catalog operations

    function lsPurchaseTypes() {
        return $this->_Select([
            'table' => $this->bd . 'purchase_type',
            'values' => 'id, name AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name'],
            'data' => []
        ]);
    }

    function lsMethodPay() {
        return $this->_Select([
            'table' => $this->bd . 'method_pay',
            'values' => 'id, name AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name'],
            'data' => []
        ]);
    }

    function lsUDN() {
        return $this->_Select([
            'table' => 'rfwsmqex_erp.udn',
            'values' => 'id, name AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name'],
            'data' => []
        ]);
    }
}
