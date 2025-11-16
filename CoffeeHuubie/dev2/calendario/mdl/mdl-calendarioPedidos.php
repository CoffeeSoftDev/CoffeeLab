<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');


class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        // $this->bd = "{$_SESSION['DB']}.";
        $this->bd   = 'fayxzvov_coffee.';
         $this->bd2   = 'fayxzvov_alpha.';

    }

    function listOrdersByDate($array) {
        $query = "
            SELECT 
                o.id,
                o.folio_id AS folio,
                COALESCE(oc.name, 'Sin nombre') AS cliente,
                COALESCE(oc.phone, '') AS telefono,
                o.date_order,
                o.time_order,
                o.status,
                COALESCE(o.location, '') AS location,
                COALESCE(o.total_pay, 0) AS total,
                o.subsidiaries_id
            FROM {$this->bd}order o
            LEFT JOIN {$this->bd}order_clients oc ON o.client_id = oc.id
            WHERE o.date_order BETWEEN ? AND ?
                AND (? IS NULL OR o.subsidiaries_id = ?)
            ORDER BY o.date_order ASC, o.time_order ASC
        ";
        
        return $this->_Read($query, $array);
    }

    function lsUDN() {
        return $this->_Select([
            'table' => $this->bd2 . 'subsidiaries',
            'values' => 'id, name AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }

    function lsStatus() {
        return $this->_Select([
            'table' => $this->bd . 'status_process',
            'values' => 'id, status AS valor',
            'order' => ['ASC' => 'id']
        ]);
    }
}
?>
