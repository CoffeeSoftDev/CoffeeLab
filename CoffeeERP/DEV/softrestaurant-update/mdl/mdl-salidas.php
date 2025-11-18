<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_gvsl_finanzas.";
    }

    function lsUDN() {
        $query = "
            SELECT 
                idUDN AS id, 
                UDN AS valor 
            FROM udn 
            WHERE Stado = 1
        ";
        return $this->_Read($query, null);
    }

    function listSalidas($array) {
        return $this->_Select([
            'table' => "{$this->bd}salidas",
            'values' => '
                id,
                producto_id,
                cantidad,
                motivo,
                udn,
                usuario_id,
                DATE_FORMAT(fecha_salida, "%Y-%m-%d %H:%i:%s") AS fecha_salida,
                active
            ',
            'where' => 'udn = ? AND active = ?',
            'order' => ['DESC' => 'fecha_salida'],
            'data' => $array
        ]);
    }

    function listSalidasByDateRange($array) {
        $query = "
            SELECT 
                id,
                producto_id,
                cantidad,
                motivo,
                udn,
                usuario_id,
                DATE_FORMAT(fecha_salida, '%Y-%m-%d %H:%i:%s') AS fecha_salida,
                active
            FROM {$this->bd}salidas
            WHERE udn = ? 
                AND DATE(fecha_salida) BETWEEN ? AND ?
                AND active = ?
            ORDER BY fecha_salida DESC
        ";
        return $this->_Read($query, $array);
    }

    function getSalidaById($array) {
        return $this->_Select([
            'table' => "{$this->bd}salidas",
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function createSalida($array) {
        return $this->_Insert([
            'table' => "{$this->bd}salidas",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSalida($array) {
        return $this->_Update([
            'table' => "{$this->bd}salidas",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function deleteSalidaById($array) {
        return $this->_Delete([
            'table' => "{$this->bd}salidas",
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function lsProductos($array) {
        return $this->_Select([
            'table' => "{$this->bd}soft_productos",
            'values' => 'id_Producto AS id, descripcion AS valor',
            'where' => 'id_udn = ? AND activo_soft = 1',
            'order' => ['ASC' => 'descripcion'],
            'data' => $array
        ]);
    }

    function getTotalSalidasByProducto($array) {
        $query = "
            SELECT 
                producto_id,
                SUM(cantidad) AS total_salidas
            FROM {$this->bd}salidas
            WHERE producto_id = ? 
                AND MONTH(fecha_salida) = ? 
                AND YEAR(fecha_salida) = ?
                AND active = 1
            GROUP BY producto_id
        ";
        $result = $this->_Read($query, $array);
        return $result ? $result[0]['total_salidas'] : 0;
    }

    function listSalidasByProducto($array) {
        $query = "
            SELECT 
                s.id,
                s.producto_id,
                p.descripcion AS producto,
                s.cantidad,
                s.motivo,
                DATE_FORMAT(s.fecha_salida, '%Y-%m-%d %H:%i:%s') AS fecha_salida,
                s.active
            FROM {$this->bd}salidas s
            INNER JOIN {$this->bd}soft_productos p 
                ON s.producto_id = p.id_Producto
            WHERE s.producto_id = ? 
                AND s.active = 1
            ORDER BY s.fecha_salida DESC
        ";
        return $this->_Read($query, $array);
    }
}
