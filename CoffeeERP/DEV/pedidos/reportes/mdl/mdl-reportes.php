<?php
require_once '../../../conf/_CRUD.php';
require_once '../../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "[name_bd].";
    }

    // UDN and Filters

    function lsUDN() {
        return $this->_Select([
            'table'  => "{$this->bd}udn",
            'values' => 'id, nombre as valor',
            'where'  => 'active = ?',
            'order'  => ['ASC' => 'nombre'],
            'data'   => [1]
        ]);
    }

    function lsCanales() {
        return $this->_Select([
            'table'  => "{$this->bd}pedidos_canales",
            'values' => 'id, nombre as valor, icono, color',
            'where'  => 'active = ?',
            'order'  => ['ASC' => 'nombre'],
            'data'   => [1]
        ]);
    }

    function lsAños() {
        $currentYear = date('Y');
        $years = [];
        for ($i = 0; $i < 5; $i++) {
            $year = $currentYear - $i;
            $years[] = ['id' => $year, 'valor' => $year];
        }
        return $years;
    }

    // Pedidos Reports

    function listPedidosByCanal($filters) {
        $query = "
            SELECT 
                MONTH(fecha_pedido) as mes,
                MONTHNAME(fecha_pedido) as mes_nombre,
                canal_comunicacion,
                COUNT(*) as cantidad
            FROM {$this->bd}pedidos_orders
            WHERE udn_id = ? 
            AND YEAR(fecha_pedido) = ?
            AND active = 1
            GROUP BY MONTH(fecha_pedido), canal_comunicacion
            ORDER BY MONTH(fecha_pedido)
        ";
        
        return $this->_Read($query, $filters);
    }

    function listVentasByCanal($filters) {
        $query = "
            SELECT 
                MONTH(fecha_pedido) as mes,
                MONTHNAME(fecha_pedido) as mes_nombre,
                canal_comunicacion,
                SUM(monto_total) as monto_total,
                COUNT(*) as cantidad_pedidos
            FROM {$this->bd}pedidos_orders
            WHERE udn_id = ? 
            AND YEAR(fecha_pedido) = ?
            AND active = 1
            GROUP BY MONTH(fecha_pedido), canal_comunicacion
            ORDER BY MONTH(fecha_pedido)
        ";
        
        return $this->_Read($query, $filters);
    }

    // Ingresos Diarios

    function listIngresosDiarios($filters) {
        return $this->_Select([
            'table'  => "{$this->bd}pedidos_ingresos_diarios",
            'values' => 'id, fecha, canal_comunicacion, monto, cantidad_pedidos, DATE_FORMAT(created_at, "%d/%m/%Y") as fecha_creacion',
            'where'  => 'udn_id = ? AND YEAR(fecha) = ? AND MONTH(fecha) = ? AND active = 1',
            'order'  => ['DESC' => 'fecha'],
            'data'   => $filters
        ]);
    }

    function createIngreso($data) {
        return $this->_Insert([
            'table'  => "{$this->bd}pedidos_ingresos_diarios",
            'values' => $data['values'],
            'data'   => $data['data']
        ]);
    }

    function updateIngreso($data) {
        return $this->_Update([
            'table'  => "{$this->bd}pedidos_ingresos_diarios",
            'values' => $data['values'],
            'where'  => 'id = ?',
            'data'   => $data['data']
        ]);
    }

    function deleteIngresoById($id) {
        return $this->_Update([
            'table'  => "{$this->bd}pedidos_ingresos_diarios",
            'values' => 'active = ?',
            'where'  => 'id = ?',
            'data'   => [0, $id]
        ]);
    }

    function getIngresoById($id) {
        return $this->_Select([
            'table'  => "{$this->bd}pedidos_ingresos_diarios",
            'values' => '*',
            'where'  => 'id = ? AND active = 1',
            'data'   => [$id]
        ])[0] ?? null;
    }

    function existsIngresoByDateAndCanal($filters) {
        $result = $this->_Select([
            'table'  => "{$this->bd}pedidos_ingresos_diarios",
            'values' => 'COUNT(*) as count',
            'where'  => 'fecha = ? AND canal_comunicacion = ? AND udn_id = ? AND active = 1',
            'data'   => $filters
        ]);
        
        return $result[0]['count'] > 0;
    }

    // KPIs and Analytics

    function getKPIData($filters) {
        $query = "
            SELECT 
                COUNT(*) as total_pedidos,
                SUM(monto_total) as total_ingresos,
                AVG(monto_total) as cheque_promedio
            FROM {$this->bd}pedidos_orders
            WHERE udn_id = ? 
            AND YEAR(fecha_pedido) = ?
            AND active = 1
        ";
        
        $kpis = $this->_Read($query, $filters)[0] ?? [];
        
        // Porcentaje por canal
        $queryCanales = "
            SELECT 
                canal_comunicacion,
                COUNT(*) as cantidad,
                SUM(monto_total) as monto,
                (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM {$this->bd}pedidos_orders WHERE udn_id = ? AND YEAR(fecha_pedido) = ? AND active = 1)) as porcentaje
            FROM {$this->bd}pedidos_orders
            WHERE udn_id = ? 
            AND YEAR(fecha_pedido) = ?
            AND active = 1
            GROUP BY canal_comunicacion
            ORDER BY cantidad DESC
        ";
        
        $canales = $this->_Read($queryCanales, array_merge($filters, $filters));
        
        return [
            'kpis' => $kpis,
            'canales' => $canales
        ];
    }

    function getComparativeData($filters) {
        $currentYear = $filters[1];
        $previousYear = $currentYear - 1;
        
        $query = "
            SELECT 
                YEAR(fecha_pedido) as año,
                canal_comunicacion,
                COUNT(*) as cantidad,
                SUM(monto_total) as monto
            FROM {$this->bd}pedidos_orders
            WHERE udn_id = ? 
            AND YEAR(fecha_pedido) IN (?, ?)
            AND active = 1
            GROUP BY YEAR(fecha_pedido), canal_comunicacion
            ORDER BY canal_comunicacion, YEAR(fecha_pedido)
        ";
        
        return $this->_Read($query, [$filters[0], $currentYear, $previousYear]);
    }
}