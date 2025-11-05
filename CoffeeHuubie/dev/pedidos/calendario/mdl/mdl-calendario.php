<?php
require_once('../../../conf/_CRUD.php');
require_once('../../../conf/_Utileria.php');

class MCalendarioPedidos extends CRUD {
    protected $util;
    protected $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd   = 'fayxzvov_coffee.';
    }
    
    function getOrders() {
        $query = "
        SELECT
            order.id AS id,
            DATE_FORMAT( order.date_creation, '%Y-%m-%d' ) AS date_creation,
            order.note,
            DATE_FORMAT( order.date_birthday,'%Y-%m-%d' ) AS date_birthday,
            order.STATUS,
            order.location,
            order.total_pay,
            order.discount,
            order.info_discount,
            order.is_delivered,
            order.delivery_type,
            order_clients. NAME AS name_client,
            order_clients.phone AS phone,
            order_clients.email AS email,
            status_process. STATUS AS status_label,
            DATE_FORMAT( order.date_order,'%Y-%m-%d' ) AS date_order,
            DATE_FORMAT(order.time_order, '%h:%i %p') AS time_order,
            status_process.id AS idStatus
        FROM
            {$this->bd}order
        INNER JOIN {$this->bd}order_clients ON client_id = order_clients.id
        INNER JOIN {$this->bd}status_process ON order.STATUS = status_process.id
        ";

        return $this->_Read($query, null);
    }
}
?>
