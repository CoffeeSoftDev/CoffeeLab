<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');
session_start();

class mdl extends CRUD {
    protected $util;
    protected $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd   = 'fayxzvov_coffee.';
    }

    function getSucursalByID($array){
        $query = "SELECT
            fayxzvov_alpha.subsidiaries.id AS idSucursal,
            fayxzvov_admin.companies.id AS idCompany,
            fayxzvov_admin.companies.social_name as name,
            fayxzvov_alpha.subsidiaries.`name` as sucursal
        FROM
            fayxzvov_alpha.subsidiaries
        INNER JOIN fayxzvov_admin.companies ON fayxzvov_alpha.subsidiaries.companies_id = fayxzvov_admin.companies.id
        where subsidiaries.id = ?";
        return $this->_Read($query, $array)[0];
    }

    function getOrders($array){
        $values = [
            '`order`.id as id',
            '`order`.date_creation',
            '`order`.date_birthday',
            '`order`.status',
            '`order`.location',
            '`order`.total_pay',
            '`order`.discount',
            '`order`.note',
            '`order`.date_order',
            '`order`.time_order',
            'status_process.status as status_name',
            'status_process.id AS status_id',
        ];

        $innerjoin = [
            $this->bd.'status_process' => '`order`.status = status_process.id',
        ];

        $where = ['`order`.subsidiaries_id = ? AND `order`.date_creation BETWEEN ? AND ? '];

        if ( $array['status'] == '0') unset($array['status']);
        else $where[] = '`order`.status = ?';

        return $this->_Select([
            'table'     => "{$this->bd}`order`",
            'values'    => $values,
            'innerjoin' => $innerjoin,
            'where'     => $where,
            'order'     => ['DESC' => '`order`.date_creation'],
            'data'      => array_values($array),
        ]);
    }

    function getOrderPayments($array)
    {
         $query = "
            SELECT
                COALESCE(SUM(pay), 0) as totalPay
            FROM
            {$this->bd}order_payments
            WHERE order_id = ?
         ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? ['totalPay' => 0];
    }

    function getTotalPedidosMes($array)
    {
        $query = "
            SELECT COUNT(*) as total_pedidos
            FROM {$this->bd}`order`
            WHERE subsidiaries_id = ?
              AND date_creation BETWEEN ? AND ?
        ";
        
        $result = $this->_Read($query, $array);
        
        if (empty($result)) {
            return ['total_pedidos' => 0];
        }
        
        return $result[0];
    }

    function getDineroEntranteMes($array)
    {
        $query = "
            SELECT 
                COALESCE(SUM(order_payments.pay), 0) as dinero_entrante
            FROM {$this->bd}`order`
            LEFT JOIN {$this->bd}order_payments 
                ON `order`.id = order_payments.order_id
            WHERE `order`.subsidiaries_id = ?
              AND order_payments.date_pay BETWEEN ? AND ?
        ";
        
        $result = $this->_Read($query, $array);
        
        if (empty($result)) {
            return ['dinero_entrante' => 0];
        }
        
        return $result[0];
    }

    function getVentasCerradasMes($array)
    {
        $query = "
            SELECT 
                COUNT(*) as cantidad_cerradas,
                COALESCE(SUM(`order`.total_pay), 0) as monto_total_ventas
            FROM {$this->bd}`order`
            WHERE subsidiaries_id = ?
              AND date_creation BETWEEN ? AND ?
              AND status = 3
        ";
        
        $result = $this->_Read($query, $array);
        
        if (empty($result)) {
            return [
                'cantidad_cerradas' => 0,
                'monto_total_ventas' => 0
            ];
        }
        
        return $result[0];
    }

    function getCancelacionesMes($array)
    {
        $query = "
            SELECT 
                COUNT(*) as cantidad_canceladas,
                COALESCE(SUM(`order`.total_pay), 0) as monto_perdido
            FROM {$this->bd}`order`
            WHERE subsidiaries_id = ?
              AND date_creation BETWEEN ? AND ?
              AND status = 4
        ";
        
        $result = $this->_Read($query, $array);
        
        if (empty($result)) {
            return [
                'cantidad_canceladas' => 0,
                'monto_perdido' => 0
            ];
        }
        
        return $result[0];
    }

    function getDesgloseEstadosMes($array)
    {
        $query = "
            SELECT 
                `order`.status as status_process_id,
                status_process.status as nombre_estado,
                COUNT(*) as cantidad
            FROM {$this->bd}`order`
            INNER JOIN {$this->bd}status_process 
                ON `order`.status = status_process.id
            WHERE `order`.subsidiaries_id = ?
              AND `order`.date_creation BETWEEN ? AND ?
            GROUP BY `order`.status, status_process.status
            ORDER BY `order`.status ASC
        ";
        
        $result = $this->_Read($query, $array);
        
        if (empty($result)) {
            return [];
        }
        
        return $result;
    }

}
?>
