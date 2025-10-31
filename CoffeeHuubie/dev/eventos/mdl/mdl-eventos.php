<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');


class MEvent extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "{$_SESSION['DB']}.";
        // $this->bd = "fayxzvov_coffee.";
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

        $where = ['subsidiaries_id = ? AND DATE(date_creation) BETWEEN ? AND ? '];

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

    function getStatus()  {
      $query = "
        SELECT
            status_process.id as id,
            status as valor
        FROM
        {$this->bd}status_process";

      $sql = $this->_Read($query, null);

      return array_merge([["id"=>0,"valor"=>"Todos los estados"]],$sql);
    }

    function getMenus($array) {
        $query = "

            SELECT 

                p.id AS package_id,
                p.name AS package,
                p.description,
                p.price_person,
                pr.id AS idPr,
                pr.name AS product,
                c.id AS idC,
                c.classification

            FROM {$this->bd}evt_package AS p
            LEFT JOIN {$this->bd}evt_package_products AS pp ON p.id = pp.package_id
            LEFT JOIN {$this->bd}evt_products AS pr ON pp.products_id = pr.id
            LEFT JOIN {$this->bd}evt_classification AS c ON pr.id_classification = c.id
            WHERE p.subsidiaries_id = ? 
            AND p.active = 1 
            AND pr.active = 1
        ";
        
        return $this->_Read($query, $array);
    }

    function getProductosExtras($array){
        $values = '
            p.id,
            p.name AS nombre,
            p.price AS precio,
            c.id AS id_clasificacion,
            c.classification
        ';

        $leftjoin = [
            $this->bd.'evt_classification AS c' => 'p.id_classification = c.id'
        ];

        return $this->_Select([
            'table'     => "{$this->bd}evt_products AS p",
            'values'    => $values,
            'leftjoin'  => $leftjoin,
            'where'     => 'p.subsidiaries_id = ? AND p.active = 1',
            'data'      => $array
        ]);
    }

    function getClasificaciones($array)
    {
        return $this->_Select([
            'table'  => "{$this->bd}evt_classification",
            'values' => 'id, classification AS nombre',
            'where'  => 'subsidiaries_id = ? AND active = 1',
            'data'   => $array
        ]);
    }

    // Menu
    function getPackagesByEventId($array) {
        $query = "
        SELECT
            evt_package.id as idPackage,
            evt_package.`name`,
            evt_package.description,
            evt_package.date_creation,
            evt_package.price_person,
            evt_package.active,
            evt_events_package.id ,
            evt_events_package.package_id ,
            evt_events_package.event_id,
            evt_events_package.subevent_id,
            evt_events_package.quantity,
            evt_events_package.price
        FROM
            {$this->bd}evt_package
            INNER JOIN {$this->bd}evt_events_package ON evt_events_package.package_id = evt_package.id
            WHERE event_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function getProductsPackageId($array) {
        $query = "
            SELECT
            evt_package_products.quantity,
            evt_package_products.date_creation,
            evt_products.`name`,
            evt_products.price,
            evt_products.active,
            evt_package_products.package_id
            FROM
            {$this->bd}evt_package_products
            INNER JOIN {$this->bd}evt_products ON evt_package_products.products_id = evt_products.id
            WHERE package_id = ?
        ";

        return $this->_Read($query, $array);
    }




    // BORRAR ----------------
    function getMenu($array) {
        $values = 'id, id_event, quantity, package_type, price';
        return $this->_Select([
            'table'     => "{$this->bd}evt_menu",
            'values'    => $values,
            'where'     => 'id_event = ?',
            'data'      => $array
        ])[0];
    }

    function getExtrasByEvent($array) {

        $query = "
            SELECT
                evt_events_package.id,
                evt_events_package.date_creation,
                evt_events_package.event_id,
                evt_events_package.subevent_id,
                evt_events_package.package_id,
                evt_events_package.quantity,
                evt_events_package.price,
                evt_events_package.product_id,
                evt_products.`name`,
                evt_products.price
            FROM
                {$this->bd}evt_events_package
            INNER JOIN {$this->bd}evt_products ON evt_events_package.product_id = evt_products.id
            WHERE package_id is null
            AND event_id = ? ";

        return $this->_Read($query, $array);
    }


    // CALENDARIO
    function getCalendar($array){
        $values = "
            ev.id,
            ev.name_event AS title,
            ev.date_start AS start,
            ev.date_end AS end,
            ev.location,
            s.status,
            ev.status_process_id AS idStatus,
            ev.name_client AS client
        ";

        $leftjoin = [
            "status_process s" => "ev.status_process_id = s.id",
        ];

        return $this->_Select([
            'table'    => "{$this->bd}evt_events ev",
            'values'   => $values,
            'leftjoin' => $leftjoin,
            'where'    => 'ev.subsidiaries_id = ? AND YEAR(ev.date_start) = YEAR(CURDATE())',
            'group'    => 'ev.id',
            'order'    => ['ASC'=>'ev.date_start'],
            'data'     => $array
        ]);
    }



    // EVENTOS
    function getEventById($array) {
        $values = '
        	evt_events.id AS idEvent,
            name_event,
            date_creation,
            date_start,
            date_end,
            total_pay,
            status_process_id,
            location,
            name_client,
            phone,
            email,
            type_event,
            status,
            quantity_people,
            notes,
            subsidiaries_id,
            advanced_pay,
            method_pay_id
            ';

        $leftjoin = [
            "status_process" => "status_process_id = status_process.id"
        ];
        return $this->_Select([
            'table'    => "{$this->bd}evt_events",
            'values'   => $values,
            'leftjoin' => $leftjoin,
            'where'    => 'evt_events.id = ?',
            'data'     => $array
        ])[0];
    }

    function maxEvent(){
        return $this->_Select([
            'table'  => "{$this->bd}evt_events",
            'values' => 'MAX(id) AS id',
        ])[0]['id'];
    }

    function createEvent($array) {
        return $this->_Insert([
            'table' => "{$this->bd}evt_events",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateEvent($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}evt_events",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function deleteEvent($array)
    {
        return $this->_Delete([
            'table' => "{$this->bd}evt_events",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function statusEvent($array)
    {
        $array['table'] = "{$this->bd_event}evt_events";
        return $this->_Update($array);
    }




    // RELACION EVENTO - PAQUETE (O PRODUCTO)
    function getEventPackage($array)
    {
        $values = '
        	ep.id AS idRelation,
            event_id,
            ep.package_id,
            ep.quantity,
            ep.price,
            ep.date_creation,
            p.id AS idP,
            p. NAME AS package,
            description,
            price_person,
            pr.id AS idPr,
            pr. NAME AS product,
            pp.quantity AS quantityProduct,
            c.id AS idC,
            c.classification
        ';

        $leftjoin = [
            $this->bd.'evt_package AS p' => 'ep.package_id = p.id',
            $this->bd.'evt_package_products AS pp' => 'p.id = pp.package_id',
            $this->bd.'evt_products AS pr' => 'pp.products_id = pr.id',
            $this->bd.'evt_classification AS c' => 'pr.id_classification = c.id'
        ];

        return $this->_Select([
            'table'     => "{$this->bd}evt_events_package AS ep",
            'values'    => $values,
            'leftjoin'  => $leftjoin,
            'where'     => 'ep.event_id = ? AND ep.product_id IS NULL AND ep.package_id IS NOT NULL',
            'data'      => $array
        ]);
    }

    function getEventProduct($array)
    {
        $values = '
            ep.id AS idRelation,
            ep.event_id,
            ep.product_id,
            ep.quantity,
            ep.price,
            ep.date_creation,
            p.name AS nombre,
            p.price AS precioUnitario,
            c.id AS id_clasificacion,
            c.classification AS clasificacion
        ';

        $leftjoin = [
            $this->bd.'evt_products AS p' => 'ep.product_id = p.id',
            $this->bd.'evt_classification AS c' => 'p.id_classification = c.id'
        ];

        return $this->_Select([
            'table'     => $this->bd.'evt_events_package AS ep',
            'values'    => $values,
            'leftjoin'  => $leftjoin,
            'where'     => 'ep.event_id = ? AND ep.product_id IS NOT NULL AND ep.package_id IS NULL',
            'data'      => $array
        ]);
    }

    function createEventPackage($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}evt_events_package",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function deleteEventPackage($array)
    {
        return $this->_Delete([
            'table' => "{$this->bd}evt_events_package",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function maxEventPackageId()
    {
        return $this->_Select([
            'table'  => "{$this->bd}evt_events_package",
            'values' => 'MAX(id) AS id',
        ])[0]['id'];
    }


    // PAGOS
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

    function addMethodPay($array){
        return $this->_Insert([
            'table'  => "{$this->bd}evt_payments",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function getMethodPay($array){
        $query = "
            SELECT
                method_pay.id,
                method_pay.method_pay
            FROM
                {$this->bd}method_pay
            WHERE id = ?
        ";

        return $this->_Read($query, $array)[0]['method_pay'];
    }

    function addHistories($array){
        return $this->_Insert([
            'table'  => "{$this->bd}evt_histories",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }

    // SUB EVENTS
    public function getSubEventsByEventId($array)
    {
        $query = "
        SELECT
            sub.id,
            sub.name_subevent as title,
            sub.name_subevent,
            sub.date_start as date,
            sub.date_start,
            sub.date_end,
            sub.time_start,
            sub.time_end,
            sub.quantity_people,
            sub.total_pay,
            sub.location,
            sub.notes,
            sub.type_event,
            sub.status_process_id,
            sub.type_event as type,
            evt.name_event as event
        FROM {$this->bd}evt_subevents sub
        INNER JOIN {$this->bd}evt_events evt ON sub.evt_events_id = evt.id
        WHERE sub.evt_events_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function getExtrasBySubEventId($array) {

        $query = "
            SELECT
                evt_events_package.id,
                evt_events_package.date_creation,
                evt_events_package.event_id,
                evt_events_package.subevent_id,
                evt_events_package.package_id,
                evt_events_package.quantity,
                evt_events_package.price,
                evt_events_package.product_id,
                evt_products.`name`,
                evt_products.price
            FROM
                {$this->bd}evt_events_package
            INNER JOIN {$this->bd}evt_products ON evt_events_package.product_id = evt_products.id
            WHERE package_id is null
            AND subevent_id = ? ";

        return $this->_Read($query, $array);
    }



    function getPackagesBySubEventId($array) {
        $query = "
            SELECT
                evt_package.id,
                evt_package.`name`,
                evt_package.description,
                evt_package.date_creation,
                evt_package.price_person,
                evt_package.active,
                evt_events_package.id,
                evt_events_package.event_id,
                evt_events_package.package_id ,
                evt_events_package.subevent_id,
                evt_events_package.quantity,

                (evt_events_package.quantity * evt_package.price_person) AS price

            FROM
                {$this->bd}evt_package
            INNER JOIN
                {$this->bd}evt_events_package ON evt_events_package.package_id = evt_package.id
            WHERE subevent_id = ? ";

        return $this->_Read($query, $array);
    }

    // PRODUCTOS (O EXTRAS PERSONALIZADOS)
    function createProduct($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}evt_products",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function maxProduct()
    {
        return $this->_Select([
            'table'  => "{$this->bd}evt_products",
            'values' => 'MAX(id) AS id',
        ])[0]['id'];
    }

    // PACKAGE CHECK - GESTIÓN DE PRODUCTOS EN PAQUETES
    function getEventsPackage($array) {
        $query = "
            SELECT 
                id
            FROM {$this->bd}evt_events_package
            WHERE event_id = ? 
            AND package_id = ?
        ";
        
        return $this->_Read($query, $array)[0];
    }
    
    function getProductsByPackage($array) {
        $query = "
            SELECT 
                products_id as product_id, 
                quantity
            FROM {$this->bd}evt_package_products
            WHERE package_id = ? 
            AND active = 1
        ";
        
        return $this->_Read($query, $array);
    }

    function insertPackageCheck($events_package_id) {
        $data = [
            'events_package_id' => $events_package_id,
            'created_at'        => date('Y-m-d H:i:s')
        ];
        
        $result = $this->_Insert([
            'table'  => "{$this->bd}evt_package_check",
            'values' => $this->util->sql($data)['values'],
            'data'   => $this->util->sql($data)['data']
        ]);
        
        if ($result) {
            return $this->maxPackageCheckId();
        }
        
        return false;
    }

    function maxPackageCheckId() {
        $result = $this->_Select([
            'table'  => "{$this->bd}evt_package_check",
            'values' => 'MAX(id) as max_id'
        ]);
        
        return $result[0]['max_id'] ?? null;
    }

    function insertProductCheck($check_id, $product_id) {
        $exists = $this->_Select([
            'table'  => "{$this->bd}evt_check_products",
            'values' => 'id',
            'where'  => 'package_check_id = ? AND product_id = ?',
            'data'   => [$check_id, $product_id]
        ]);
        
        if (!empty($exists)) {
            return true;
        }
        
        $data = [
            'package_check_id' => $check_id,
            'product_id'       => $product_id,
            'active'           => 1
        ];
        
        return $this->_Insert([
            'table'  => "{$this->bd}evt_check_products",
            'values' => $this->util->sql($data)['values'],
            'data'   => $this->util->sql($data)['data']
        ]);
    }

    function getPackageCheckByEventPackageId($array) {
        $query = "
            SELECT 
                id, 
                events_package_id, 
                created_at
            FROM {$this->bd}evt_package_check
            WHERE events_package_id = ?
        ";
        
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function listProductsCheckByPackageCheckId($array) {
        $query = "
            SELECT 
                cp.id as check_product_id,
                cp.product_id,
                cp.active,
                p.name as product_name,
                p.id_classification
            FROM {$this->bd}evt_check_products cp
            LEFT JOIN {$this->bd}evt_products p ON cp.product_id = p.id
            WHERE cp.package_check_id = ?
        ";
        
        return $this->_Read($query, $array);
    }

    function updateProductCheckActive($array) {
        return $this->_Update([
            'table'  => "{$this->bd}evt_check_products",
            'values' => $array['values'],
            'where'  => 'id = ?',
            'data'   => $array['data']
        ]);
    }

    function insertPackageWithProducts($events_package_id, $package_id) {
        try {
            $packageExists = $this->_Select([
                'table'  => "{$this->bd}evt_package",
                'values' => 'id',
                'where'  => 'id = ?',
                'data'   => [$package_id]
            ]);

            if (empty($packageExists)) {
                return [
                    'status'  => 404,
                    'message' => 'Paquete no encontrado'
                ];
            }

            $package_check_id = $this->insertPackageCheck($events_package_id);
            
            if (!$package_check_id) {
                return [
                    'status'  => 500,
                    'message' => 'Error al crear registro de verificación'
                ];
            }

            $products = $this->getProductsByPackage([$package_id]);
            
            $products_inserted = 0;
            foreach ($products as $product) {
                $result = $this->insertProductCheck($package_check_id, $product['product_id']);
                if ($result) {
                    $products_inserted++;
                }
            }

            return [
                'status'  => 200,
                'message' => 'Paquete vinculado correctamente',
                'data'    => [
                    'package_check_id'   => $package_check_id,
                    'products_inserted'  => $products_inserted
                ]
            ];

        } catch (Exception $e) {
            error_log("Error en insertPackageWithProducts: " . $e->getMessage());
            
            return [
                'status'  => 500,
                'message' => 'Error al procesar: ' . $e->getMessage()
            ];
        }
    }
}
?>
