<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
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

    function lsCanales($array) {
        return $this->_Select([
            'table' => "{$this->bd}canal",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function lsProductos($array) {
        return $this->_Select([
            'table' => "{$this->bd}producto",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function lsCampanas($array) {
        return $this->_Select([
            'table' => "{$this->bd}campaña",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['DESC' => 'fecha_creacion'],
            'data' => $array
        ]);
    }

    function lsSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }
    
    // Pedidos

    function listPedidos($array) {
        $query = "
            SELECT 
                p.id,
                p.monto,
                p.fecha_pedido,
                p.fecha_creacion,
                p.envio_domicilio,
                p.active,
                c.nombre AS canal_nombre,
                rs.nombre AS red_social_nombre,
                rs.color AS red_social_color,
                ca.nombre AS campana_nombre,
                ca.estrategia AS campana_estrategia
            FROM {$this->bd}pedido p
            LEFT JOIN {$this->bd}canal c ON p.canal_id = c.id
            LEFT JOIN {$this->bd}red_social rs ON p.red_social_id = rs.id
            LEFT JOIN {$this->bd}campaña ca ON p.campaña_id = ca.id
            WHERE p.fecha_pedido BETWEEN ? AND ? 
            AND p.udn_id = ? 
            AND p.active = 1
            ORDER BY p.fecha_creacion DESC
        ";
        return $this->_Read($query, $array);
    }

    function getPedidoById($array) {
        $leftjoin = [
            $this->bd . 'cliente' => 'pedido.cliente_id = cliente.id',
            $this->bd . 'canal' => 'pedido.canal_id = canal.id',
            $this->bd . 'campana' => 'pedido.campana_id = campana.id'
        ];

        $result = $this->_Select([
            'table' => $this->bd . 'pedido',
            'values' => "
                pedido.*,
                cliente.nombre AS cliente_nombre,
                cliente.telefono AS cliente_telefono,
                cliente.correo AS cliente_correo,
                cliente.fecha_cumpleaños AS cliente_cumpleaños,
                canal.nombre AS canal_nombre,
                campana.nombre AS campana_nombre
            ",
            'leftjoin' => $leftjoin,
            'where' => 'pedido.id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function listPedidosByCliente($array) {
        return $this->_Select([
            'table' => $this->bd . 'pedido',
            'values' => "
                id,
                monto,
                fecha_pedido,
                fecha_creacion,
                active
            ",
            'where' => 'cliente_id = ? AND active = 1',
            'order' => ['DESC' => 'fecha_creacion'],
            'data' => $array
        ]);
    }

    function createPedido($array) {
        return $this->_Insert([
            'table' => $this->bd . 'pedido',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updatePedido($array) {
        return $this->_Update([
            'table' => $this->bd . 'pedido',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function validatePedidoAge($array) {
        $query = "
            SELECT 
                id,
                fecha_creacion,
                DATEDIFF(NOW(), fecha_creacion) AS dias_transcurridos
            FROM {$this->bd}pedido
            WHERE id = ?
        ";
        $result = $this->_Read($query, $array);
        
        if (empty($result)) {
            return ['valid' => false, 'dias' => 999];
        }
        
        $dias = $result[0]['dias_transcurridos'];
        return [
            'valid' => $dias <= 7,
            'dias' => $dias
        ];
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COUNT(*) AS total_pedidos,
                SUM(monto) AS ingresos_totales,
                AVG(monto) AS cheque_promedio,
                SUM(CASE WHEN pago_verificado = 1 THEN 1 ELSE 0 END) AS pagos_verificados,
                SUM(CASE WHEN llego_establecimiento = 1 THEN 1 ELSE 0 END) AS llegadas_confirmadas
            FROM {$this->bd}pedido
            WHERE udn_id = ?
            AND YEAR(fecha_pedido) = ?
            AND MONTH(fecha_pedido) = ?
            AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_pedidos' => 0,
            'ingresos_totales' => 0,
            'cheque_promedio' => 0,
            'pagos_verificados' => 0,
            'llegadas_confirmadas' => 0
        ];
    }

    function getMonthlyReport($array) {
        $query = "
            SELECT 
                c.nombre AS canal_nombre,
                COUNT(p.id) AS total_pedidos,
                SUM(p.monto) AS total_ventas
            FROM {$this->bd}pedido p
            LEFT JOIN {$this->bd}canal c ON p.canal_id = c.id
            WHERE p.udn_id = ?
            AND YEAR(p.fecha_pedido) = ?
            AND MONTH(p.fecha_pedido) = ?
            AND p.active = 1
            GROUP BY c.id, c.nombre
            ORDER BY total_ventas DESC
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                c.nombre AS canal_nombre,
                MONTH(p.fecha_pedido) AS mes,
                COUNT(p.id) AS total_pedidos,
                SUM(p.monto) AS total_ventas
            FROM {$this->bd}pedido p
            LEFT JOIN {$this->bd}canal c ON p.canal_id = c.id
            WHERE p.udn_id = ?
            AND YEAR(p.fecha_pedido) = ?
            AND p.active = 1
            GROUP BY c.id, c.nombre, MONTH(p.fecha_pedido)
            ORDER BY c.nombre, mes
        ";
        return $this->_Read($query, $array);
    }

    function getChannelPerformance($array) {
        $query = "
            SELECT 
                c.nombre AS canal_nombre,
                c.icono AS canal_icono,
                c.color AS canal_color,
                COUNT(p.id) AS total_pedidos,
                SUM(p.monto) AS total_ingresos,
                AVG(p.monto) AS cheque_promedio,
                SUM(CASE WHEN p.campana_id IS NOT NULL THEN 1 ELSE 0 END) AS pedidos_con_campana
            FROM {$this->bd}pedido p
            LEFT JOIN {$this->bd}canal c ON p.canal_id = c.id
            WHERE p.udn_id = ?
            AND p.fecha_pedido BETWEEN ? AND ?
            AND p.active = 1
            GROUP BY c.id, c.nombre, c.icono, c.color
            ORDER BY total_ingresos DESC
        ";
        return $this->_Read($query, $array);
    }

    function existsPedidoByDate($array) {
        $query = "
            SELECT id
            FROM {$this->bd}pedido
            WHERE fecha_pedido = ?
            AND udn_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    function createCliente($array) {
        return $this->_Insert([
            'table' => $this->bd . 'cliente',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getClienteByPhone($array) {
        $result = $this->_Select([
            'table' => $this->bd . 'cliente',
            'values' => '*',
            'where' => 'telefono = ? AND udn_id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }
}
