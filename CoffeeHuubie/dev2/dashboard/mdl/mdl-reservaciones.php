<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');
session_start();

class mdl extends CRUD {
    protected $util;
    protected $bd;

    public function __construct() {
        $this->util = new Utileria;
        // $this->bd   = "{$_SESSION['DB']}.";
        $this->bd   = 'fayxzvov_coffee.';
    }

      // LISTAS
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

    function getEvents($array){
        $values = [
            'evt_events.id as id',
            'name_event',
            'name_client',
            "DATE_FORMAT(date_creation,'%Y-%m-%d') AS date_creation",
            'date_start',
            "DATE_FORMAT(date_start,'%H:%i hrs') as hours_start",
            'date_end',
            'total_pay',
            'notes',
            'status_process.status',
            'location',
            'advanced_pay',
            'phone',
            'discount',
            'email',
            'status_process_id AS idStatus',
        ];

        $innerjoin = [
            $this->bd.'status_process' => 'evt_events.status_process_id = status_process.id',
        ];

        $where = ['subsidiaries_id = ? AND date_creation BETWEEN ? AND ? '];

        // FILTROS POR ESTADO

        if ( $array['status'] == '0') unset($array['status']);
        else $where[] = 'status_process_id = ?';


        return $this->_Select([
            'table'     => "{$this->bd}evt_events",
            'values'    => $values,
            'innerjoin' => $innerjoin,
            'where'     => $where,
            'order'     => ['ASC' => 'status_process.id','DESC' => 'evt_events.date_creation'],
            'data'      => array_values($array),

        ]);

    }

    function getAdvancedPay($array)
    {
         $query = "
            SELECT
                SUM(pay) as totalPay
            FROM
            {$this->bd}evt_payments
            INNER JOIN {$this->bd}method_pay ON evt_payments.method_pay_id = method_pay.id
            WHERE evt_events_id = ?
         ";
        return $this->_Read($query, $array)[0];
    }

    function getTotalPedidosMes($array)
    {
        $query = "
            SELECT COUNT(*) as total_pedidos
            FROM {$this->bd}evt_events
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
                COALESCE(SUM(evt_payments.pay), 0) as dinero_entrante
            FROM {$this->bd}evt_events
            LEFT JOIN {$this->bd}evt_payments 
                ON evt_events.id = evt_payments.evt_events_id
            WHERE evt_events.subsidiaries_id = ?
              AND evt_payments.date_creation BETWEEN ? AND ?
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
                COALESCE(SUM(evt_events.total_pay), 0) as monto_total_ventas
            FROM {$this->bd}evt_events
            WHERE subsidiaries_id = ?
              AND date_creation BETWEEN ? AND ?
              AND status_process_id = 3
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
                COALESCE(SUM(evt_events.total_pay), 0) as monto_perdido
            FROM {$this->bd}evt_events
            WHERE subsidiaries_id = ?
              AND date_creation BETWEEN ? AND ?
              AND status_process_id = 4
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
                status_process_id,
                status_process.status as nombre_estado,
                COUNT(*) as cantidad
            FROM {$this->bd}evt_events
            INNER JOIN {$this->bd}status_process 
                ON evt_events.status_process_id = status_process.id
            WHERE evt_events.subsidiaries_id = ?
              AND evt_events.date_creation BETWEEN ? AND ?
            GROUP BY status_process_id, status_process.status
            ORDER BY status_process_id ASC
        ";
        
        $result = $this->_Read($query, $array);
        
        if (empty($result)) {
            return [];
        }
        
        return $result;
    }


}
?>
