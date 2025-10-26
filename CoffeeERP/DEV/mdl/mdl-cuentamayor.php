<?php
require_once '../conf/_CRUD.php';
require_once '../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_contabilidad.";
    }

    // Cuenta de Mayor (product_class)

    function listProductClass($array) {
        $leftjoin = [
            $this->bd . 'unidades_negocio' => 'product_class.udn_id = unidades_negocio.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'product_class',
            'values'   => "
                product_class.id,
                product_class.name,
                product_class.description,
                product_class.active,
                unidades_negocio.nombre as udn_nombre
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'product_class.udn_id = ?',
            'order'    => ['DESC' => 'product_class.id'],
            'data'     => $array
        ]);
    }

    function getProductClassById($id) {
        return $this->_Select([
            'table'  => $this->bd . 'product_class',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
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
        return count($exists) > 0;
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

    // Subcuenta de Mayor (product)

    function listProduct($array) {
        $leftjoin = [
            $this->bd . 'product_class' => 'product.clase_insumo_id = product_class.id',
            $this->bd . 'unidades_negocio' => 'product_class.udn_id = unidades_negocio.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'product',
            'values'   => "
                product.id,
                product.name,
                product.active,
                product_class.name as cuenta_mayor,
                unidades_negocio.nombre as udn_nombre
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'product_class.udn_id = ?',
            'order'    => ['DESC' => 'product.id'],
            'data'     => $array
        ]);
    }

    function getProductById($id) {
        return $this->_Select([
            'table'  => $this->bd . 'product',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
        ])[0];
    }

    function existsProductByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}product
            WHERE LOWER(name) = LOWER(?)
            AND clase_insumo_id = ?
            AND active = 1
        ";

        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
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

    // Tipos de Compra

    function listTipoCompra($array) {
        $leftjoin = [
            $this->bd . 'unidades_negocio' => 'tipos_compra.udn_id = unidades_negocio.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'tipos_compra',
            'values'   => "
                tipos_compra.id,
                tipos_compra.nombre,
                tipos_compra.descripcion,
                tipos_compra.active,
                unidades_negocio.nombre as udn_nombre
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'tipos_compra.udn_id = ?',
            'order'    => ['DESC' => 'tipos_compra.id'],
            'data'     => $array
        ]);
    }

    function getTipoCompraById($id) {
        return $this->_Select([
            'table'  => $this->bd . 'tipos_compra',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
        ])[0];
    }

    function existsTipoCompraByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}tipos_compra
            WHERE LOWER(nombre) = LOWER(?)
            AND udn_id = ?
            AND active = 1
        ";

        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    function createTipoCompra($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'tipos_compra',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateTipoCompra($array) {
        return $this->_Update([
            'table'  => $this->bd . 'tipos_compra',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    // Formas de Pago

    function listFormaPago($array) {
        $leftjoin = [
            $this->bd . 'unidades_negocio' => 'formas_pago.udn_id = unidades_negocio.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'formas_pago',
            'values'   => "
                formas_pago.id,
                formas_pago.nombre,
                formas_pago.descripcion,
                formas_pago.active,
                unidades_negocio.nombre as udn_nombre
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'formas_pago.udn_id = ?',
            'order'    => ['DESC' => 'formas_pago.id'],
            'data'     => $array
        ]);
    }

    function getFormaPagoById($id) {
        return $this->_Select([
            'table'  => $this->bd . 'formas_pago',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
        ])[0];
    }

    function existsFormaPagoByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}formas_pago
            WHERE LOWER(nombre) = LOWER(?)
            AND udn_id = ?
            AND active = 1
        ";

        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    function createFormaPago($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'formas_pago',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateFormaPago($array) {
        return $this->_Update([
            'table'  => $this->bd . 'formas_pago',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    // Utilidades

    function lsUDN() {
        return $this->_Select([
            'table'  => $this->bd . 'unidades_negocio',
            'values' => 'id, nombre as valor',
            'where'  => 'active = 1',
            'order'  => ['ASC' => 'nombre']
        ]);
    }
}
