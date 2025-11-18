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
                AND idUDN != 10 
                AND idUDN != 8
            ORDER BY idUDN ASC
        ";
        return $this->_Read($query, null);
    }

    function listArchivos($array) {
        return $this->_Select([
            'table' => "{$this->bd}soft_folio",
            'values' => '
                id_folio,
                DATE_FORMAT(fecha_folio, "%Y-%m-%d") AS fecha,
                id_udn,
                file_productos_vendidos,
                file_ventas_dia,
                monto_productos_vendidos,
                monto_ventas_dia
            ',
            'where' => 'id_udn = ? AND MONTH(fecha_folio) = ? AND YEAR(fecha_folio) = ?',
            'order' => ['DESC' => 'fecha_folio'],
            'data' => $array
        ]);
    }

    function listArchivosByDateRange($array) {
        $query = "
            SELECT 
                id_folio,
                DATE_FORMAT(fecha_folio, '%Y-%m-%d') AS fecha,
                id_udn,
                file_productos_vendidos,
                file_ventas_dia,
                monto_productos_vendidos,
                monto_ventas_dia
            FROM {$this->bd}soft_folio
            WHERE id_udn = ? 
                AND fecha_folio BETWEEN ? AND ?
            ORDER BY fecha_folio DESC
        ";
        return $this->_Read($query, $array);
    }

    function getFolio($array) {
        $folio = 0;
        $query = "
            SELECT id_folio
            FROM {$this->bd}soft_folio
            WHERE fecha_folio = ? 
                AND id_udn = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $folio = $key['id_folio'];
        }
        return $folio;
    }

    function existeFolio($array, $campo) {
        $folio = 0;
        $query = "
            SELECT id_folio
            FROM {$this->bd}soft_folio
            WHERE " . $campo . " = 1 
                AND id_folio = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $folio = 1;
        }
        return $folio;
    }

    function createFolio($array) {
        $query = "
            INSERT INTO {$this->bd}soft_folio
            (fecha_folio, id_udn)
            VALUES(?,?)
        ";
        return $this->_CUD($query, $array);
    }

    function updateFileProductos($array, $opc) {
        $campo = '';
        switch ($opc) {
            case 'productosvendidosperiodo':
                $campo = 'file_productos_vendidos';
                break;
            case 'ventas':
                $campo = 'file_ventas_dia';
                break;
        }
        $query = "
            UPDATE {$this->bd}soft_folio 
            SET " . $campo . " = ?
            WHERE id_folio = ?
        ";
        return $this->_CUD($query, $array);
    }

    function updateMontoVentasDia($array) {
        return $this->_Update([
            'table' => "{$this->bd}soft_folio",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lsGrupoC_ERP($array) {
        $query = "
            SELECT 
                idgrupo AS id,
                descripcion AS name 
            FROM {$this->bd}soft_grupoc_erp 
            WHERE id_udn = ? 
                AND status = 1
        ";
        return $this->_Read($query, $array);
    }

    function lsGrupoProductos($array) {
        $query = "
            SELECT * 
            FROM {$this->bd}soft_grupoproductos 
            WHERE id_udn = ? 
                AND id_grupo_erp = ?
        ";
        return $this->_Read($query, $array);
    }

    function listVendidosPorGrupo($array) {
        $query = "
            SELECT
                soft_productos.descripcion, 
                soft_productosvendidos.cantidad, 
                soft_productosvendidos.precioventa,
                soft_productos.id_grupoc
            FROM {$this->bd}soft_productos
            INNER JOIN {$this->bd}soft_productosvendidos
                ON soft_productos.id_Producto = soft_productosvendidos.id_productos
            WHERE idFolioRestaurant = ? 
                AND id_grupo_productos = ?
        ";
        return $this->_Read($query, $array);
    }

    function getGrupoC($array) {
        $idCat = 0;
        $SQL = "
            SELECT idgrupo
            FROM {$this->bd}soft_grupoc
            WHERE grupoc = ? 
                AND id_soft_udn = ?
        ";
        $ps = $this->_Read($SQL, $array);
        foreach ($ps as $key) {
            $idCat = $key['idgrupo'];
        }
        return $idCat;
    }

    function createGrupoC($array) {
        return $this->_Insert([
            'table' => "{$this->bd}soft_grupoc",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getGrupoProductos($array) {
        $idCat = 0;
        $SQL = "
            SELECT idgrupo
            FROM {$this->bd}soft_grupoproductos
            WHERE grupoproductos = ? 
                AND id_udn = ?
        ";
        $ps = $this->_Read($SQL, $array);
        foreach ($ps as $key) {
            $idCat = $key['idgrupo'];
        }
        return $idCat;
    }

    function getProductoByName($array) {
        $folio = 0;
        $query = "
            SELECT id_Producto
            FROM {$this->bd}soft_productos
            WHERE descripcion = ? 
                AND id_udn = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $folio = $key['id_Producto'];
        }
        return $folio;
    }

    function createProductosVendidos($array) {
        return $this->_Insert([
            'table' => "{$this->bd}soft_productosvendidos",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createProductoSoft($array) {
        $query = "
            INSERT INTO {$this->bd}soft_productos
            (clave, descripcion, id_grupoc, id_udn, status, costo, revision, id_grupo_productos)
            VALUES(?,?,?,?,?,?,?,?)
        ";
        return $this->_CUD($query, $array);
    }

    function deleteProductosVendidos($array) {
        $query = "
            DELETE FROM {$this->bd}soft_productosvendidos
            WHERE idFolioRestaurant = ?
        ";
        return $this->_CUD($query, $array);
    }

    function listReporteVentas($array) {
        $query = "
            SELECT
                id_venta,
                soft_area_restaurant.arearestaurant,
                porcentaje,
                alimentos,
                bebidas,
                otros,
                subtotal,
                iva,
                total,
                personas,
                cuentas,
                soft_folio
            FROM {$this->bd}soft_ventas
            INNER JOIN {$this->bd}soft_area_restaurant 
                ON soft_ventas.id_area = soft_area_restaurant.idarea
            WHERE soft_folio = ?
        ";
        return $this->_Read($query, $array);
    }

    function getArea($array) {
        $idCat = 'No encontrado';
        $SQL = "
            SELECT idarea
            FROM {$this->bd}soft_area_restaurant
            WHERE arearestaurant = ? 
                AND id_udn = ?
        ";
        $ps = $this->_Read($SQL, $array);
        foreach ($ps as $key) {
            $idCat = $key['idarea'];
        }
        return $idCat;
    }

    function createVenta($array) {
        return $this->_Insert([
            'table' => "{$this->bd}soft_ventas",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function listVentas($array) {
        $sql = "
            SELECT
                soft_ventas.id_venta,
                soft_ventas.soft_folio,
                soft_ventas.id_area,
                soft_ventas.alimentos,
                soft_ventas.personas,
                soft_ventas.cuentas,
                soft_ventas.bebidas,
                soft_ventas.otros,
                soft_ventas.subtotal,
                soft_ventas.iva,
                soft_ventas.total
            FROM {$this->bd}soft_ventas
            WHERE soft_folio = ?
        ";
        return $this->_Read($sql, $array);
    }

    function deleteVentas($array) {
        $query = "
            DELETE FROM {$this->bd}soft_ventas
            WHERE soft_folio = ?
        ";
        return $this->_CUD($query, $array);
    }

    function getPaqueteByName($array) {
        $idPaquete = 0;
        $query = "
            SELECT idpaquete
            FROM {$this->bd}soft_paquetes
            WHERE descripcion = ? 
                AND id_udn = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $idPaquete = $key['idpaquete'];
        }
        return $idPaquete;
    }

    function createProductosPaquete($array) {
        return $this->_Insert([
            'table' => "{$this->bd}soft_productosvendidos",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function listReportePaquetesVendidos($array) {
        $query = "
            SELECT
                idpaquete AS id,
                soft_paquetes.descripcion,
                soft_productosvendidos.clave,
                soft_productosvendidos.cantidad,
                soft_productosvendidos.precioventa,
                soft_productosvendidos.ventatotal,
                idpaquete
            FROM {$this->bd}soft_productosvendidos
            INNER JOIN {$this->bd}soft_paquetes 
                ON soft_productosvendidos.id_paquete = soft_paquetes.idpaquete
            WHERE idFolioRestaurant = ? 
                AND grupo = ? 
            ORDER BY descripcion ASC
        ";
        return $this->_Read($query, $array);
    }

    function getDesglosePaquete($array) {
        $query = "
            SELECT
                soft_paquetes.descripcion AS desc_paq,
                soft_productos.descripcion,
                soft_paquetes_productos.costo_producto,
                soft_grupoc_erp.descripcion AS desc_grupo
            FROM {$this->bd}soft_productos
            INNER JOIN {$this->bd}soft_grupoc_erp 
                ON soft_productos.id_grupoc = soft_grupoc_erp.idgrupo
            INNER JOIN {$this->bd}soft_paquetes_productos 
                ON soft_paquetes_productos.id_producto = soft_productos.id_Producto
            INNER JOIN {$this->bd}soft_paquetes 
                ON soft_paquetes_productos.id_paquete = soft_paquetes.idpaquete
            WHERE id_paquete = ?
        ";
        return $this->_Read($query, $array);
    }
}
