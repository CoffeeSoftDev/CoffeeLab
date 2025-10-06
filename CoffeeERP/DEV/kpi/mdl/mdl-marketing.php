<?php

require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');

class mdl extends CRUD {

  public $util;
  public $bd;

    function __construct() {
        // $this->util = new _Utileria();
        $this->bd  = "rfwsmqex_gvsl_finanzas.";
    }

    // Dashboard - Ventas
    public function getVentasDelDia($array) {
        $query = "
            SELECT
                FORMAT(SUM(F.monto_productos_vendidos), 2, 'es_MX') AS ventas
            FROM {$this->bd}soft_restaurant_ventas V
            JOIN {$this->bd}soft_folio F ON V.soft_folio = F.id_folio
            WHERE F.fecha_folio = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
            AND F.id_udn = ?
        ";
        return $this->_Read($query, $array)[0]['ventas'];
    }

    public function getVentasMonetariasMes($array) {
        $query = "
        SELECT
            FORMAT(SUM(F.monto_productos_vendidos), 2, 'es_MX') AS ventas_mes

        FROM {$this->bd}soft_restaurant_ventas V
        JOIN {$this->bd}soft_folio F ON V.soft_folio = F.id_folio
        WHERE MONTH(F.fecha_folio) = ?
            AND YEAR(F.fecha_folio) = ?
            AND F.id_udn = ?
        ";
        return $this->_Read($query,$array)[0]['ventas_mes'];
    }

    public function getClientesMes($array) {
        $query = "
        SELECT
            SUM(V.personas) AS ventas_mes
        FROM {$this->bd}soft_restaurant_ventas V
        JOIN {$this->bd}soft_folio F ON V.soft_folio = F.id_folio
        WHERE MONTH(F.fecha_folio) = ?
            AND YEAR(F.fecha_folio) = ?
            AND F.id_udn = ?
        ";
        return $this->_Read($query,$array)[0]['ventas_mes'];
    }

    public function getResumenMes($array) {
        $query = "
        SELECT
            SUM(V.personas) AS total_clientes_mes,
            SUM(F.monto_ventas_dia) AS total_ventas_mes,
            ROUND(SUM(F.monto_ventas_dia) / NULLIF(SUM(V.personas), 0), 2) AS cheque_promedio
        FROM {$this->bd}soft_restaurant_ventas V
        JOIN {$this->bd}soft_folio F ON V.soft_folio = F.id_folio
        WHERE MONTH(F.fecha_folio) = ?
            AND YEAR(F.fecha_folio) = ?
            AND F.id_udn = ?
        ";
        return $this->_Read($query,$array)[0]['cheque_promedio'];
    }

    public function getComparativaChequePromedio($array) {
    $query = "
        SELECT
        SUM(V.AyB) as AyB,
        SUM(V.alimentos) as Alimentos,
        SUM(V.bebidas) as Bebidas
        FROM {$this->bd}soft_restaurant_ventas V
        JOIN {$this->bd}soft_folio F ON V.soft_folio = F.id_folio
        WHERE MONTH(F.fecha_folio) = ?
        AND YEAR(F.fecha_folio) = ?
        AND F.id_udn = 4
    ";
    return $this->_Read($query, $array)[0];
    }

}
