<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';

class mdl extends CRUD {
    public $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria();
        $this->bd2 = 'rfwsmqex_gvsl_costsys.';
        $this->bd = 'rfwsmqex_gvsl_costsys.';

    }

    public function lsUDN() {
        return $this->_Select([
            'table'  => "udn",
            'values' => 'id, name',
            'order'  => ['ASC' => 'name']
        ]);
    }

    function lsClasificacion(){

        $query= $this->_Select([
            "table" => "{$this->bd}clasificacion",
            "values" => "idClasificacion AS id,Clasificacion AS valor,id_UDN as udn",
            "where" => "idClasificacion != 7 AND idClasificacion != 9",
        ],true);

        return $this->_Read($query, null);
    }






    public function lsYears() {
        return $this->_Read("SELECT DISTINCT year FROM {$this->bd}ventas ORDER BY year DESC", []);
    }

    public function listIngresos($array) {
        $query = "
            SELECT id, name, SUM(total) as total
            FROM {$this->bd}ventas
            WHERE fecha BETWEEN ? AND ?
            GROUP BY id, name
        ";
        return $this->_Read($query, [$array['fi'], $array['ff']]);
    }

    public function listMargen($array) {
        $query = "
            SELECT id, name, AVG(margen) as margen
            FROM {$this->bd}ventas
            GROUP BY id, name
        ";
        return $this->_Read($query, []);
    }

    public function listPromotionSales($array) {
        $query = "
            SELECT id, producto, SUM(ingreso) as ingreso
            FROM {$this->bd}promociones
            GROUP BY id, producto
        ";
        return $this->_Read($query, []);
    }

    public function listPromotionMargen($array) {
        $query = "
            SELECT id, producto, AVG(margen) as margen
            FROM {$this->bd}promociones
            GROUP BY id, producto
        ";
        return $this->_Read($query, []);
    }

    public function listProductosAtencion($array) {
        $query = "
            SELECT id, producto, DATEDIFF(NOW(), ultima_venta) as dias
            FROM {$this->bd}productos
            WHERE ultima_venta IS NULL OR DATEDIFF(NOW(), ultima_venta) > 30
        ";
        return $this->_Read($query, []);
    }
}
