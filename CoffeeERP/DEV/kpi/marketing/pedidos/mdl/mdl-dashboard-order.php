<?php
require_once '../../../../conf/_CRUD.php';
require_once '../../../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function listOrderMetrics($array) {
        $query = "
            SELECT 
                COUNT(*) as total_pedidos,
                SUM(monto) as total_ingresos,
                AVG(monto) as promedio_pedido,
                DATE_FORMAT(fecha_creacion, '%Y-%m') as periodo
            FROM {$this->bd}pedido 
            WHERE udn_id = ? 
            AND YEAR(fecha_creacion) = ? 
            AND MONTH(fecha_creacion) = ?
            AND active = 1
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyOrderTrends($array) {
        $query = "
            SELECT 
                MONTH(fecha_creacion) as mes,
                MONTHNAME(fecha_creacion) as nombre_mes,
                COUNT(*) as total_pedidos,
                SUM(monto) as total_ventas,
                AVG(monto) as promedio_pedido
            FROM {$this->bd}pedido 
            WHERE udn_id = ? 
            AND YEAR(fecha_creacion) = ?
            AND active = 1
            GROUP BY MONTH(fecha_creacion), MONTHNAME(fecha_creacion)
            ORDER BY MONTH(fecha_creacion)
        ";
        return $this->_Read($query, $array);
    }

    function getChannelPerformance($array) {
        $query = "
            SELECT 
                c.nombre as canal,
                c.id as canal_id,
                COUNT(p.id) as total_pedidos,
                SUM(p.monto) as total_monto,
                AVG(p.monto) as promedio_monto,
                (SUM(p.monto) / (
                    SELECT SUM(monto) 
                    FROM {$this->bd}pedido 
                    WHERE udn_id = ? AND YEAR(fecha_creacion) = ? AND MONTH(fecha_creacion) = ? AND active = 1
                )) * 100 as porcentaje
            FROM {$this->bd}pedido p
            JOIN {$this->bd}canal c ON p.canal_id = c.id
            WHERE p.udn_id = ? 
            AND YEAR(p.fecha_creacion) = ? 
            AND MONTH(p.fecha_creacion) = ?
            AND p.active = 1
            AND c.active = 1
            GROUP BY c.id, c.nombre
            ORDER BY total_monto DESC
        ";
        return $this->_Read($query, array_merge($array, $array));
    }

    function getWeeklyStats($array) {
        $query = "
            SELECT 
                DAYNAME(fecha_creacion) as dia,
                DAYOFWEEK(fecha_creacion) as dia_numero,
                COUNT(*) as total_pedidos,
                SUM(monto) as total_ventas,
                AVG(monto) as promedio_dia,
                COUNT(DISTINCT cliente_id) as clientes_unicos
            FROM {$this->bd}pedido 
            WHERE udn_id = ? 
            AND YEAR(fecha_creacion) = ? 
            AND MONTH(fecha_creacion) = ?
            AND active = 1
            GROUP BY DAYNAME(fecha_creacion), DAYOFWEEK(fecha_creacion)
            ORDER BY promedio_dia DESC
        ";
        return $this->_Read($query, $array);
    }

    function getRevenueComparison($array) {
        $query = "
            SELECT 
                YEAR(fecha_creacion) as anio,
                MONTH(fecha_creacion) as mes,
                SUM(monto) as total_ventas,
                COUNT(*) as total_pedidos
            FROM {$this->bd}pedido 
            WHERE udn_id = ? 
            AND fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 24 MONTH)
            AND active = 1
            GROUP BY YEAR(fecha_creacion), MONTH(fecha_creacion)
            ORDER BY YEAR(fecha_creacion) DESC, MONTH(fecha_creacion) DESC
        ";
        return $this->_Read($query, $array);
    }

    function getDashboardCards($array) {
        $query = "
            SELECT 
                (SELECT SUM(monto) FROM {$this->bd}pedido 
                 WHERE udn_id = ? AND DATE(fecha_creacion) = CURDATE() - INTERVAL 1 DAY AND active = 1) as venta_dia,
                (SELECT SUM(monto) FROM {$this->bd}pedido 
                 WHERE udn_id = ? AND YEAR(fecha_creacion) = ? AND MONTH(fecha_creacion) = ? AND active = 1) as venta_mes,
                (SELECT COUNT(DISTINCT cliente_id) FROM {$this->bd}pedido 
                 WHERE udn_id = ? AND YEAR(fecha_creacion) = ? AND MONTH(fecha_creacion) = ? AND active = 1) as clientes,
                (SELECT AVG(monto) FROM {$this->bd}pedido 
                 WHERE udn_id = ? AND YEAR(fecha_creacion) = ? AND MONTH(fecha_creacion) = ? AND active = 1) as cheque_promedio
        ";
        return $this->_Read($query, $array);
    }

    function getChannelComparison($array) {
        $currentYear = $array[2];
        $previousYear = $currentYear - 1;
        
        $query = "
            SELECT 
                'A&B' as categoria,
                COALESCE((SELECT SUM(monto) FROM {$this->bd}pedido WHERE udn_id = ? AND YEAR(fecha_creacion) = ? AND active = 1), 0) as anio_actual,
                COALESCE((SELECT SUM(monto) FROM {$this->bd}pedido WHERE udn_id = ? AND YEAR(fecha_creacion) = ? AND active = 1), 0) as anio_anterior
            UNION ALL
            SELECT 
                'Alimentos' as categoria,
                COALESCE((SELECT SUM(p.monto) FROM {$this->bd}pedido p 
                         JOIN {$this->bd}producto_pedido pp ON p.id = pp.pedido_id 
                         JOIN {$this->bd}producto pr ON pp.producto_id = pr.id 
                         WHERE p.udn_id = ? AND YEAR(p.fecha_creacion) = ? AND pr.es_servicio = 0 AND p.active = 1), 0) as anio_actual,
                COALESCE((SELECT SUM(p.monto) FROM {$this->bd}pedido p 
                         JOIN {$this->bd}producto_pedido pp ON p.id = pp.pedido_id 
                         JOIN {$this->bd}producto pr ON pp.producto_id = pr.id 
                         WHERE p.udn_id = ? AND YEAR(p.fecha_creacion) = ? AND pr.es_servicio = 0 AND p.active = 1), 0) as anio_anterior
            UNION ALL
            SELECT 
                'Bebidas' as categoria,
                COALESCE((SELECT SUM(p.monto) FROM {$this->bd}pedido p 
                         JOIN {$this->bd}producto_pedido pp ON p.id = pp.pedido_id 
                         JOIN {$this->bd}producto pr ON pp.producto_id = pr.id 
                         WHERE p.udn_id = ? AND YEAR(p.fecha_creacion) = ? AND pr.es_servicio = 1 AND p.active = 1), 0) as anio_actual,
                COALESCE((SELECT SUM(p.monto) FROM {$this->bd}pedido p 
                         JOIN {$this->bd}producto_pedido pp ON p.id = pp.pedido_id 
                         JOIN {$this->bd}producto pr ON pp.producto_id = pr.id 
                         WHERE p.udn_id = ? AND YEAR(p.fecha_creacion) = ? AND pr.es_servicio = 1 AND p.active = 1), 0) as anio_anterior
        ";
        
        $params = [
            $array[0], $currentYear, $array[0], $previousYear,
            $array[0], $currentYear, $array[0], $previousYear,
            $array[0], $currentYear, $array[0], $previousYear
        ];
        
        return $this->_Read($query, $params);
    }

    function getChannelMonthlyData($array) {
        $query = "
            SELECT 
                c.nombre as canal,
                MONTH(p.fecha_creacion) as mes,
                SUM(p.monto) as total_monto,
                COUNT(p.id) as total_pedidos
            FROM {$this->bd}pedido p
            JOIN {$this->bd}canal c ON p.canal_id = c.id
            WHERE p.udn_id = ? 
            AND YEAR(p.fecha_creacion) = ?
            AND p.active = 1
            AND c.active = 1
            GROUP BY c.id, c.nombre, MONTH(p.fecha_creacion)
            ORDER BY c.nombre, MONTH(p.fecha_creacion)
        ";
        return $this->_Read($query, $array);
    }

    function getTotalYearOrders($array) {
        $query = "
            SELECT COUNT(*) as total_pedidos
            FROM {$this->bd}pedido 
            WHERE udn_id = ? 
            AND YEAR(fecha_creacion) = ?
            AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0]['total_pedidos'] ?? 0;
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

}