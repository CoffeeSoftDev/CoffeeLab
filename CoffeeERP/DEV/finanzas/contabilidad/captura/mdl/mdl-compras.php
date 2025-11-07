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

    function listCompras($params) {
        $where = "purchase.active = 1";
        $data = [];

        if (!empty($params['udn'])) {
            $where .= " AND purchase.udn_id = ?";
            $data[] = $params['udn'];
        }

        if (!empty($params['purchase_type'])) {
            $where .= " AND purchase.purchase_type_id = ?";
            $data[] = $params['purchase_type'];
        }

        if (!empty($params['method_pay'])) {
            $where .= " AND purchase.method_pay_id = ?";
            $data[] = $params['method_pay'];
        }

        if (!empty($params['fi']) && !empty($params['ff'])) {
            $where .= " AND purchase.operation_date BETWEEN ? AND ?";
            $data[] = $params['fi'];
            $data[] = $params['ff'];
        }

        $leftjoin = [
            $this->bd . 'product_class' => 'purchase.product_class_id = product_class.id',
            $this->bd . 'product' => 'purchase.product_id = product.id',
            $this->bd . 'purchase_type' => 'purchase.purchase_type_id = purchase_type.id',
            $this->bd . 'method_pay' => 'purchase.method_pay_id = method_pay.id',
            $this->bd . 'supplier' => 'purchase.supplier_id = supplier.id',
            $this->bd . 'udn' => 'purchase.udn_id = udn.id'
        ];

        return $this->_Select([
            'table' => $this->bd . 'purchase',
            'values' => "
                purchase.id,
                purchase.product_class_id,
                purchase.product_id,
                purchase.purchase_type_id,
                purchase.method_pay_id,
                purchase.supplier_id,
                purchase.subtotal,
                purchase.tax,
                purchase.total,
                purchase.description,
                purchase.operation_date,
                product_class.name AS product_class_name,
                product.name AS product_name,
                purchase_type.name AS purchase_type_name,
                method_pay.name AS method_pay_name,
                supplier.name AS supplier_name,
                udn.name AS udn_name
            ",
            'leftjoin' => $leftjoin,
            'where' => $where,
            'order' => ['DESC' => 'purchase.id'],
            'data' => $data
        ]);
    }

    function getCompraById($array) {
        $leftjoin = [
            $this->bd . 'product_class' => 'purchase.product_class_id = product_class.id',
            $this->bd . 'product' => 'purchase.product_id = product.id',
            $this->bd . 'purchase_type' => 'purchase.purchase_type_id = purchase_type.id',
            $this->bd . 'method_pay' => 'purchase.method_pay_id = method_pay.id',
            $this->bd . 'supplier' => 'purchase.supplier_id = supplier.id'
        ];

        return $this->_Select([
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
            'data' => $array
        ])[0];
    }

    function createCompra($array) {
        return $this->_Insert([
            'table' => $this->bd . 'purchase',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCompra($array) {
        return $this->_Update([
            'table' => $this->bd . 'purchase',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function deleteCompraById($array) {
        return $this->_Delete([
            'table' => $this->bd . 'purchase',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function lsProductClass() {
        return $this->_Select([
            'table' => $this->bd . 'product_class',
            'values' => 'id, name AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }

    function lsProduct() {
        return $this->_Select([
            'table' => $this->bd . 'product',
            'values' => 'id, name AS valor, product_class_id',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }

    function lsProductByClass($array) {
        return $this->_Select([
            'table' => $this->bd . 'product',
            'values' => 'id, name',
            'where' => 'product_class_id = ? AND active = 1',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    function lsSupplier() {
        return $this->_Select([
            'table' => $this->bd . 'supplier',
            'values' => 'id, name AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }

    function lsPurchaseType() {
        return $this->_Select([
            'table' => $this->bd . 'purchase_type',
            'values' => 'id, name AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'id']
        ]);
    }

    function lsMethodPay() {
        return $this->_Select([
            'table' => $this->bd . 'method_pay',
            'values' => 'id, name AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }

    function lsUdn() {
        return $this->_Select([
            'table' => $this->bd . 'udn',
            'values' => 'id, name AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }

    function listReporteConcentrado($params) {
        $where = "purchase.active = 1";
        $data = [];

        if (!empty($params['udn'])) {
            $where .= " AND purchase.udn_id = ?";
            $data[] = $params['udn'];
        }

        if (!empty($params['purchase_type'])) {
            $where .= " AND purchase.purchase_type_id = ?";
            $data[] = $params['purchase_type'];
        }

        if (!empty($params['fi']) && !empty($params['ff'])) {
            $where .= " AND purchase.operation_date BETWEEN ? AND ?";
            $data[] = $params['fi'];
            $data[] = $params['ff'];
        }

        $query = "
            SELECT 
                DATE(purchase.operation_date) AS fecha,
                product_class.name AS product_class_name,
                SUM(purchase.subtotal) AS subtotal,
                SUM(purchase.tax) AS tax,
                SUM(purchase.total) AS total
            FROM {$this->bd}purchase
            LEFT JOIN {$this->bd}product_class ON purchase.product_class_id = product_class.id
            WHERE $where
            GROUP BY DATE(purchase.operation_date), product_class.id
            ORDER BY fecha DESC, product_class_name ASC
        ";

        return $this->_Read($query, $data);
    }
}
