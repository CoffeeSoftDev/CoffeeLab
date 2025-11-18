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

    function listProductosVendidos($array) {
        $query = '
            SELECT
                idAlmacen,
                almacen_productos.NombreProducto,
                almacen_productos.Area,
                listaproductos.idListaProductos,
                lista_productos.foliofecha,
                almacen_productos.sugerencia,
                SUM(cantidad) AS CANT,
                costo,
                almacen_productos.estadoProducto
            FROM rfwsmqex_gvsl_produccion.listaproductos
            INNER JOIN rfwsmqex_gvsl_produccion.almacen_productos 
                ON listaproductos.id_productos = almacen_productos.idAlmacen
            INNER JOIN rfwsmqex_gvsl_produccion.lista_productos 
                ON listaproductos.id_lista = lista_productos.idLista
            WHERE MONTH(foliofecha) = ?
                AND YEAR(foliofecha) = ?
                AND Area = ? 
                AND id_tipo = 1
            GROUP BY NombreProducto
            ORDER BY NombreProducto ASC
        ';
        return $this->_Read($query, $array);
    }

    function listDesplazamiento($array) {
        $query = "
            SELECT
                receta,
                recetas.nombre,
                precioventa,
                desplazamiento,
                fecha_costo,
                clasificacion.Clasificacion
            FROM rfwsmqex_gvsl_costsys.costopotencial
            INNER JOIN rfwsmqex_gvsl_costsys.recetas 
                ON costopotencial.receta = recetas.idReceta
            INNER JOIN rfwsmqex_gvsl_costsys.clasificacion 
                ON recetas.id_Clasificacion = clasificacion.idClasificacion
            WHERE MONTH(fecha_costo) = ? 
                AND YEAR(fecha_costo) = ?
                AND recetas.id_UDN = ?
            ORDER BY desplazamiento DESC
        ";
        return $this->_Read($query, $array);
    }

    function listFogaza($array) {
        $query = "
            SELECT
                receta,
                recetas.nombre,
                precioventa,
                desplazamiento,
                fecha_costo,
                clasificacion.Clasificacion,
                clasificacion.idClasificacion
            FROM rfwsmqex_gvsl_costsys.costopotencial
            INNER JOIN rfwsmqex_gvsl_costsys.recetas 
                ON costopotencial.receta = recetas.idReceta
            INNER JOIN rfwsmqex_gvsl_costsys.clasificacion 
                ON recetas.id_Clasificacion = clasificacion.idClasificacion
            WHERE MONTH(fecha_costo) = ? 
                AND YEAR(fecha_costo) = ?
                AND recetas.id_UDN = ?
                AND clasificacion.idClasificacion = ?
            ORDER BY desplazamiento DESC
        ";
        return $this->_Read($query, $array);
    }

    function lsDiasPendientes($array) {
        $query = "
            SELECT
                fecha_costo,
                COUNT(DISTINCT receta) AS total_productos
            FROM rfwsmqex_gvsl_costsys.costopotencial
            WHERE MONTH(fecha_costo) = ?
                AND YEAR(fecha_costo) = ?
                AND id_udn = ?
            GROUP BY fecha_costo
            ORDER BY fecha_costo ASC
        ";
        return $this->_Read($query, $array);
    }

    function getProductoCostoPotencial($array) {
        $query = "
            SELECT
                precioventa,
                desplazamiento,
                fecha_costo
            FROM rfwsmqex_gvsl_costsys.costopotencial
            WHERE receta = ? 
                AND MONTH(fecha_costo) = ? 
                AND YEAR(fecha_costo) = ?
        ";
        return $this->_Read($query, $array);
    }

    function createCostoPotencial($array) {
        return $this->_Insert([
            'table' => 'rfwsmqex_gvsl_costsys.costopotencial',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCostoPotencial($array) {
        return $this->_Update([
            'table' => 'rfwsmqex_gvsl_costsys.costopotencial',
            'values' => $array['values'],
            'where' => 'receta = ? AND fecha_costo = ?',
            'data' => $array['data']
        ]);
    }

    function deleteCostoPotencialByDate($array) {
        $query = "
            DELETE FROM rfwsmqex_gvsl_costsys.costopotencial
            WHERE fecha_costo = ?
                AND id_udn = ?
        ";
        return $this->_CUD($query, $array);
    }

    function existsCostoPotencial($array) {
        $query = "
            SELECT COUNT(*) as total
            FROM rfwsmqex_gvsl_costsys.costopotencial
            WHERE receta = ?
                AND fecha_costo = ?
        ";
        $result = $this->_Read($query, $array);
        return $result[0]['total'] > 0;
    }

    function lsRecetasCostsys($array) {
        $query = "
            SELECT
                idReceta,
                nombre,
                precioVenta,
                id_Clasificacion
            FROM rfwsmqex_gvsl_costsys.recetas 
            WHERE id_UDN = ? 
                AND id_Estado = 1
            ORDER BY nombre ASC
        ";
        return $this->_Read($query, $array);
    }

    function getRecetaById($array) {
        return $this->_Select([
            'table' => 'rfwsmqex_gvsl_costsys.recetas',
            'values' => '*',
            'where' => 'idReceta = ?',
            'data' => $array
        ])[0];
    }
}
