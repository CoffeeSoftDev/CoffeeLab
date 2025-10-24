<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "erp_varoch.";
    }

    function listSalesAccount($array) {
        return $this->_Select([
            'table' => "{$this->bd}categoria_venta",
            'values' => "
                categoria_venta.id,
                categoria_venta.udn_id,
                categoria_venta.nombre,
                categoria_venta.permiso_descuento,
                categoria_venta.permiso_cortesia,
                categoria_venta.impuesto_iva,
                categoria_venta.impuesto_ieps,
                categoria_venta.impuesto_hospedaje,
                categoria_venta.impuesto_cero,
                categoria_venta.activo,
                DATE_FORMAT(categoria_venta.fecha_creacion, '%d/%m/%Y %H:%i') AS fecha_creacion,
                udn.nombre AS udn_nombre
            ",
            'leftjoin' => [
                "{$this->bd}udn" => "categoria_venta.udn_id = udn.id"
            ],
            'where' => 'categoria_venta.udn_id = ?',
            'order' => ['ASC' => 'categoria_venta.nombre'],
            'data' => $array
        ]);
    }

    function getSalesAccountById($array) {
        return $this->_Select([
            'table' => "{$this->bd}categoria_venta",
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function lsUDN() {
        return $this->_Select([
            'table' => "{$this->bd}udn",
            'values' => 'id, nombre AS valor',
            'where' => 'activo = 1',
            'order' => ['ASC' => 'nombre']
        ]);
    }

    function existsSalesAccountByName($array) {
        $query = "
            SELECT COUNT(*) as total
            FROM {$this->bd}categoria_venta
            WHERE LOWER(nombre) = LOWER(?)
            AND udn_id = ?
            AND activo = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0]['total'];
    }

    function createSalesAccount($array) {
        return $this->_Insert([
            'table' => "{$this->bd}categoria_venta",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSalesAccount($array) {
        return $this->_Update([
            'table' => "{$this->bd}categoria_venta",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}
