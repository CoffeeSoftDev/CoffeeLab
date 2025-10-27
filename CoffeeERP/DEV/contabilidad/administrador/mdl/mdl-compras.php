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

    // Compras

    function listCompras($array) {
        $leftjoin = [
            $this->bd . 'insumo' => 'compras.insumo_id = insumo.id',
            $this->bd . 'clase_insumo' => 'compras.clase_insumo_id = clase_insumo.id',
            $this->bd . 'proveedores' => 'compras.proveedor_id = proveedores.id',
            $this->bd . 'tipo_compra' => 'compras.tipo_compra_id = tipo_compra.id',
            $this->bd . 'forma_pago' => 'compras.forma_pago_id = forma_pago.id'
        ];

        $where = 'compras.activo = ? AND compras.udn_id = ?';
        $data = [$array['activo'], $array['udn_id']];

        if (!empty($array['tipo_compra_id'])) {
            $where .= ' AND compras.tipo_compra_id = ?';
            $data[] = $array['tipo_compra_id'];
        }

        return $this->_Select([
            'table'    => $this->bd . 'compras',
            'values'   => "
                compras.id,
                compras.subtotal,
                compras.impuesto,
                compras.total,
                compras.descripcion,
                compras.fecha_operacion,
                insumo.nombre AS producto,
                clase_insumo.nombre AS categoria,
                proveedores.nombre AS proveedor,
                tipo_compra.nombre AS tipo_compra,
                forma_pago.nombre AS forma_pago,
                compras.activo
            ",
            'leftjoin' => $leftjoin,
            'where'    => $where,
            'order'    => ['DESC' => 'compras.id'],
            'data'     => $data
        ]);
    }

    function getCompraById($id) {
        return $this->_Select([
            'table'  => $this->bd . 'compras',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
        ])[0];
    }


    function getTotalesByType($array) {
        $query = "
            SELECT 
                SUM(total) AS total_general,
                SUM(CASE WHEN tipo_compra_id = 1 THEN total ELSE 0 END) AS total_fondo_fijo,
                SUM(CASE WHEN tipo_compra_id = 2 THEN total ELSE 0 END) AS total_corporativo,
                SUM(CASE WHEN tipo_compra_id = 3 THEN total ELSE 0 END) AS total_credito
            FROM {$this->bd}compras
            WHERE activo = ? AND udn_id = ?
        ";
        
        return $this->_Read($query, [$array['activo'], $array['udn_id']])[0];
    }

    function createCompra($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'compras',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateCompra($array) {
        return $this->_Update([
            'table'  => $this->bd . 'compras',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function deleteCompraById($id) {
        return $this->_Delete([
            'table' => $this->bd . 'compras',
            'where' => 'id = ?',
            'data'  => [$id]
        ]);
    }


    // Catálogos

    function lsClaseInsumo() {
        return $this->_Select([
            'table'  => $this->bd . 'clase_insumo',
            'values' => 'id, nombre AS valor',
            'where'  => 'activo = ?',
            'order'  => ['ASC' => 'nombre'],
            'data'   => [1]
        ]);
    }

    function lsInsumo($array = []) {
        $where = 'activo = ?';
        $data = [1];

        if (!empty($array['clase_insumo_id'])) {
            $where .= ' AND clase_insumo_id = ?';
            $data[] = $array['clase_insumo_id'];
        }

        return $this->_Select([
            'table'  => $this->bd . 'insumo',
            'values' => 'id, nombre AS valor, clase_insumo_id',
            'where'  => $where,
            'order'  => ['ASC' => 'nombre'],
            'data'   => $data
        ]);
    }

    function lsTipoCompra() {
        return $this->_Select([
            'table'  => $this->bd . 'tipo_compra',
            'values' => 'id, nombre AS valor',
            'where'  => 'activo = ?',
            'order'  => ['ASC' => 'id'],
            'data'   => [1]
        ]);
    }

    function lsFormaPago() {
        return $this->_Select([
            'table'  => $this->bd . 'forma_pago',
            'values' => 'id, nombre AS valor',
            'where'  => 'activo = ?',
            'order'  => ['ASC' => 'id'],
            'data'   => [1]
        ]);
    }

    function lsProveedor() {
        return $this->_Select([
            'table'  => $this->bd . 'proveedores',
            'values' => 'id, nombre AS valor',
            'where'  => 'activo = ?',
            'order'  => ['ASC' => 'nombre'],
            'data'   => [1]
        ]);
    }
}
