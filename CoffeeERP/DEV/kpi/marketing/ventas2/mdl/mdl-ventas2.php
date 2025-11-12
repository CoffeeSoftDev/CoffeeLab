<?php
require_once '../../../../conf/_CRUD.php';
require_once '../../../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_gvsl_finanzas.";
    }

    function listSales($array) {
        $query = "
            SELECT 
                vb.idBV as id,
                vb.Fecha_Venta as fecha,
                DAYNAME(vb.Fecha_Venta) as dia,
                vb.Cantidad as clientes,
                vu.Stado as estado,
                u.UDN as udn_nombre,
                u.idUDN as id_udn,
                v.Name_Venta as categoria,
                v.idVenta as id_venta
            FROM {$this->bd}venta_bitacora vb
            LEFT JOIN {$this->bd}ventas_udn vu ON vb.id_Folio = vu.idUV
            LEFT JOIN {$this->bd}udn u ON vu.id_UDN = u.idUDN
            LEFT JOIN {$this->bd}ventas v ON vu.id_Venta = v.idVenta
            WHERE u.idUDN = ?
                AND YEAR(vb.Fecha_Venta) = ?
                AND MONTH(vb.Fecha_Venta) = ?
            ORDER BY vb.Fecha_Venta DESC
        ";

        return $this->_Read($query, $array);
    }

    function getSaleById($id) {
        return $this->_Select([
            'table' => "{$this->bd}venta_bitacora",
            'values' => "*",
            'where' => 'idBV = ?',
            'data' => [$id]
        ])[0];
    }

    function createSale($array) {
        return $this->_Insert([
            'table' => "{$this->bd}venta_bitacora",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSale($array) {
        return $this->_Update([
            'table' => "{$this->bd}venta_bitacora",
            'values' => $array['values'],
            'where' => 'idBV = ?',
            'data' => $array['data']
        ]);
    }


    function existsSaleByDate($array) {
        $query = "
            SELECT COUNT(*) as total
            FROM {$this->bd}venta_bitacora vb
            LEFT JOIN {$this->bd}ventas_udn vu ON vb.id_Folio = vu.idUV
            WHERE vu.id_UDN = ?
                AND vb.Fecha_Venta = ?
        ";

        $result = $this->_Read($query, $array);
        return $result[0]['total'];
    }

    function lsUDN() {
        return $this->_Select([
            'table' => "udn",
            'values' => "idUDN as id, UDN as valor",
            'where' => 'Stado = 1',
            'order' => ['ASC' => 'UDN']
        ]);
    }

    function lsVentas() {
        return $this->_Select([
            'table' => "{$this->bd}ventas",
            'values' => "idVenta as id, Name_Venta as valor",
            'order' => ['ASC' => 'Name_Venta']
        ]);
    }

    function createVentaUDN($array) {
        return $this->_Insert([
            'table' => "{$this->bd}ventas_udn",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateVentaUDN($array) {
        return $this->_Update([
            'table' => "{$this->bd}ventas_udn",
            'values' => $array['values'],
            'where' => 'idUV = ?',
            'data' => $array['data']
        ]);
    }

    function getVentaUDNByFolio($id_folio) {
        return $this->_Select([
            'table' => "{$this->bd}ventas_udn",
            'values' => "*",
            'where' => 'idUV = ?',
            'data' => [$id_folio]
        ])[0];
    }
}
