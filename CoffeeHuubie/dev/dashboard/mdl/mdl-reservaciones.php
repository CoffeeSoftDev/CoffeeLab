<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');
session_start();

class mdl extends CRUD {
    protected $util;
    protected $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd   = "{$_SESSION['DB']}.";
        // $this->bd   = 'fayxzvov_coffee.';
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

   


}
?>
