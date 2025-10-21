<?php
require_once('../../conf/_Utileria.php');
require_once('../../conf/_CRUD.php');

class Gestordeactividades extends CRUD {
    protected $bd;
    protected $ch;
    protected $util;

    public function __construct() {
        $this->bd = "rfwsmqex_gvsl_calendarizacion2.";
        $this->ch = "rfwsmqex_gvsl_rrhh.";   
        $this->util = new Utileria(); 
    }

    // Evaluacion
    function hasRatingByActivityId($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}ga_ratings",
            'values' => 'id',
            'where' => 'ga_activities_id = ?',
            'data' => $array,
            'limit' => 1
        ]);

        return !empty($result);
    }

    function createRating($array){
        return $this->_Insert([
            'table' => "{$this->bd}ga_ratings",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function maxRating(){
        return $this->_Select([
            'table' => "{$this->bd}ga_ratings",
            'values' =>'MAX(id) AS id'
        ])[0]['id'];
    }
    
    function createAnsweredRating($array){
        return $this->_Insert([
            'table' => "{$this->bd}ga_questions_ratings",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getEmployedByID($array){
        $query = "
            SELECT
                Nombres,
                FullName,
                idEmpleado,
                Telefono_Movil,
                idUser, 
                APaterno
            FROM
                rfwsmqex_gvsl_rrhh.empleados
            LEFT JOIN
                rfwsmqex_erp.usuarios ON rfwsmqex_erp.usuarios.usr_empleado  = rfwsmqex_gvsl_rrhh.empleados.idEmpleado
            WHERE idEmpleado = ?
        ";
        return $this->_Read($query, $array)[0];
    }
   
    function lsActivities($array){
        return $this->_Select([
            'table'     => "{$this->bd}ga_activities",
            'values'    => "id_employed, CONCAT(Nombres) AS nameResponsible, user_photo AS src, activities, id_user_creator, Telefono_Movil AS phone, title",
            
            'leftjoin' => [
                "{$this->ch}empleados"  => "id_employed = idEmpleado",
                "rfwsmqex_erp.usuarios" => "id_employed = usr_empleado",
            ],

            'where'     => "Estado = 1 AND idActivity = ?",
            'data'      => $array,
        ])[0];
    }

    function lsQuestions(){
        return $this->_Select([
            'table'     => "{$this->bd}ga_questions",
            'values'    => "ga_questions.id AS id, question AS valor, ga_question_type_id, type",
            'leftjoin' => [
                "{$this->bd}ga_questions_type"  => "ga_questions_type.id = ga_question_type_id",
            ],
            "where"     => "status = 0",
        ]);
    }

   function getMyCompletedTasks($array) {
        return $this->_Select([
            'table'     => "{$this->bd}ga_activities",
            'values'    => "idActivity AS id, activities, title, id_user_creator, FullName, APaterno, Nombres, UDN, Abreviatura, date_finished, id_priority",
            "leftjoin" => [
                "{$this->ch}empleados"  => "id_user_creator = idEmpleado",
                "udn"                  => "id_udn = idUDN",
            ],
            'where'     => 'id_status = 4 AND id_employed = ?',
            'order'     => ['DESC'=>'date_finished'],
            'data'      => $array
        ]);
    }

    function getCreatedCompletedTasks($array) {
        return $this->_Select([
            'table'     => "{$this->bd}ga_activities",
            'values'    => "idActivity AS id, activities, title, id_employed, id_user_creator, FullName, APaterno, Nombres, UDN,  Abreviatura, date_finished, id_priority",
            "leftjoin" => [
                "{$this->ch}empleados"  => "id_employed = idEmpleado",
                "udn"                  => "id_udn = idUDN",
            ],
            'where'     => 'id_status = 4 AND id_user_creator = ?',
            'order'     => ['DESC'=>'date_finished'],
            'data'      => $array
        ]);
    }

    function getRatingsByActivityId($array) {
        return $this->_Select([
            'table' => "{$this->bd}ga_ratings",
            'values' => '*',
            'where' => 'ga_activities_id = ?',
            'data' => $array
        ]);
    }

    // Listas
    function lsUDN(){
        $data = [];
        $where = ['Stado = 1'];
        
        if ( $_COOKIE['IDE'] != 8 ) {
            $where[] = "idUDN = ? OR idUDN = ?";
            $data    = [$_COOKIE['IDE'],8];
        }

        return $this->_Select([
            'table'  => 'udn',
            'values' => 'idUDN AS id, UDN AS valor',
            'where'  => $where,
            'data'   => $data,
            'order'  => ['ASC'=>'Antiguedad']
        ]);
    }

    function lsPriority(){
        return $this->_Select([
            'table'     => "{$this->bd}ga_priority",
            'values'    => "idPriority AS id,priority AS valor,description",
        ]);
    }

    function lsEmployed($array){
        $innerjoin = [
            "rh_puesto_area" => "Puesto_Empleado = idPuesto_Area",
            "rh_puestos"     => "id_Puesto = idPuesto",
            "rh_area_udn"    => "Area_Empleado = idAreaUDN",
            "rh_area"        => "id_Area = idArea",
        ];

        //  OR Area LIKE '%TICS%' 
        $where   = ["Estado = 1","UDN_Empleado","idEmpleado NOT IN (562,704,742,863)"];
        $where[] = $array[0] == 8 
                ? "(Nombre_Puesto LIKE '%jefe%' OR idEmpleado = 846 OR idEmpleado = 299 OR Area LIKE '%TICS%' OR Area LIKE '%direccion%' OR idEmpleado = 773 OR idEmpleado = 409)" 
                : ($array[0] == 7 ? "Area LIKE '%operacion%'" : "Area LIKE '%gerencia%'");

        return $this->_Select([
            'table'     => "{$this->ch}empleados",
            'values'    => 'idEmpleado AS id,CONCAT(Area," / ",Nombres) AS valor',
            'where'     => $where,
            'innerjoin' => $innerjoin,
            'order'     => ['ASC'=>'Area'],
            'data'      => $array
        ]);
    }

    function lsUsers($array){
        $values = [
            "idUser AS id",
            "CONCAT(FullName,' ',APaterno) AS valor",
            "Sexo AS sexo",
            "rfwsmqex_erp.usuarios.user_photo AS src",
        ];

        $leftjoin = [
            "rfwsmqex_gvsl_rrhh.empleados" => "idEmpleado = usr_empleado",
        ];

        return $this->_Select([
            'table'    => "rfwsmqex_erp.usuarios",
            'values'   => $values,
            'where'    => "idUser = ?",
            'leftjoin' => $leftjoin,
            'data'     => $array
        ]);
    }
    
    function employedByUser($array){
        return $this->_Select([
            'table'     => 'rfwsmqex_erp.usuarios',
            'values'    => [
                'rfwsmqex_erp.usuarios.usr_empleado AS id',
                'rfwsmqex_gvsl_rrhh.empleados.Nombres',
                'rfwsmqex_gvsl_rrhh.empleados.FullName',
                'rfwsmqex_gvsl_rrhh.empleados.Telefono_Movil',
                'idUser',
            ],
            'innerjoin' => [
                'rfwsmqex_gvsl_rrhh.empleados' => 'rfwsmqex_erp.usuarios.usr_empleado = rfwsmqex_gvsl_rrhh.empleados.idEmpleado'
            ],
            'where'     => 'rfwsmqex_erp.usuarios.idUser',
            'data'      => $array
        ])[0];
    }

    function lsStatus(){
        $sql = $this->_Select([
            'table'  => "{$this->bd}event_status",
            'values' => 'idStatus AS id, UPPER(name_status) AS valor',
            'where'  => 'idStatus NOT IN (3, 1)',
        ]);
        
        return $sql;
    }

    function lsActivity($array) {
        return $this->_Select([
            'table'  => "{$this->bd}ga_activities",
            'values' => 'idActivity AS id, activities, title, id_employed, id_user_creator',
            'where'  => 'idActivity = ?',
            'data'   => $array
        ])[0];
    }


    // Tarea
    function newTask($array){
        $array['table'] = "{$this->bd}ga_activities";
        return $this->_Insert($array);
    }

    function updateTask($array){
        $array['table'] = "{$this->bd}ga_activities";
        return $this->_Update($array);
    }

    function cancelTaskByID($array){
        return $this->_Update([
            'table'  => "{$this->bd}ga_activities",
            'values' => "id_status",
            'where'  => "idActivity",
            'data'   => $array
        ]);
    }

    function getTaskByID($array){
        $values = [
            "id_udn",
            "id_employed",
            "title",
            "activities",
            "id_priority",
            "DATE_FORMAT(date_start,'%Y-%m-%d') AS date_start",
            "DATE_FORMAT(date_follow,'%Y-%m-%d') AS date_follow",
            "DATE_FORMAT(date_end,'%Y-%m-%d') AS date_end",
            "objetivo",
            "que",
        ];
        return $this->_Select([
            'table'     => "{$this->bd}ga_activities",
            'values'    => $values,
            'where'     => "idActivity",
            'data'      => $array
        ])[0];
    }
  
    function listTask($array, $idEmpleado) {
        $values = [
            "idActivity AS id",
            "Nombres",
            "name_status",
            "activities",
            "date_creation",
            "date_start",
            "date_end",
            "DATE_FORMAT(date_seen,'%d-%m-%Y') AS date_seen",
            "date_follow",
            "id_status",
            "UDN",
            "priority",
            "id_employed",
            "id_user_creator",
            "id_priority",
            "title",
            "Abreviatura",
            "id_udn",
            "date_finished",
        ];

        $innerjoin = [
            "{$this->bd}event_status" => "id_status = idStatus",
            "{$this->ch}empleados"    => "id_employed = idEmpleado",
            "udn"                     => "id_udn = idUDN",
            "{$this->bd}ga_priority"  => "id_priority = idPriority",
        ];

        $where = [];
        $data  = [];

        $where[] = 'id_user_creator = ?';
        $data[]  = $idEmpleado;
   

        // 🔵 Filtro por estado
        if ($array['estado'] != 0) {
            $where[] = "id_status = ?";
            $data[]  = $array['estado'];

            if ($array['estado'] == 4 ) {
                if (!empty($array['filtroMes']) && $array['filtroMes'] != '0') {
                    $where[] = "MONTH(date_finished) = ?";
                    $data[]  = $array['filtroMes'];
                } else {
                    $where[] = "YEAR(date_finished) = YEAR(CURDATE())";
                }
            }
        } else {
            // 📌 Mostrar todos los estados excepto cancelado
            $where[] = "(id_status IS NULL OR id_status NOT IN (5))";
        }

        // 🔵 Filtro por UDN
        if ($array['udn'] != '0') {
            $where[] = "id_udn = ?";
            $data[]  = $array['udn'];
        }

        return $this->_Select([
            'table'      => "{$this->bd}ga_activities",
            'values'     => $values,
            'where'      => $where,
            'innerjoin'  => $innerjoin,
            'data'       => $data,
            'order'      => [ 
                'ASC'=>['id_status, id_priority'],
                'DESC'=>['date_creation'], 
            ],
        ]);

    }

    function statusTask($array){
        $array['table'] = "{$this->bd}ga_activities";
        return $this->_Update($array);
    }


    // Recordatorio
    function lsEvaluationNivel2($array) {
        $query = "
            SELECT
                val_evaluation.idEvaluation AS id,
                CONCAT(
                    DATE_FORMAT(val_evaluation.date_creation, '%d-%m-%Y %H:%i'), ' - ',
                    empleados.Nombres, ' (', udn.UDN, ')'
                ) AS valor
            FROM rfwsmqex_erp.val_evaluation
            INNER JOIN rfwsmqex_gvsl_rrhh.empleados 
                ON val_evaluation.id_evaluator = empleados.idEmpleado
            INNER JOIN rfwsmqex_erp.udn 
                ON val_evaluation.id_udn = udn.idUDN
            INNER JOIN rfwsmqex_erp.val_periods 
                ON val_periods.id_UDN = udn.idUDN 
                AND val_evaluation.id_period = val_periods.id
            WHERE val_evaluation.date_creation BETWEEN ? AND ?
        ";

        $params = [$array['fi'] . ' 00:00:00', $array['ff'] . ' 23:59:59'];

        if (!empty($array['udn']) && $array['udn'] !== '0') {
            $query .= " AND val_evaluation.id_udn = ?";
            $params[] = $array['udn'];
        }

        if (!empty($array['estado']) && $array['estado'] !== '0') {
            $query .= " AND val_evaluation.id_status = ?";
            $params[] = $array['estado'];
        }

        if (!empty($array['season']) && $array['season'] !== '0') {
            $query .= " AND val_evaluation.id_period = ?";
            $params[] = $array['season'];
        }

        $query .= " ORDER BY val_evaluation.date_creation ASC";

        return $this->_Read($query, $params);
    }

    function listReminder($array){
        $values = [
            "idActivity AS id",
            "Nombres",
            "FullName",
            "name_status",
            "activities",
            "date_creation",
            "date_start",
            "date_end",
            "date_follow",
            "id_status",
            "UDN",
            "priority",
            "title",
        ];

        $innerjoin = [
            "{$this->bd}event_status" => "id_status = idStatus",
            "{$this->ch}empleados"     => "id_employed = idEmpleado",
            "udn"                      => "id_udn = idUDN",
            "{$this->bd}ga_priority"   => "id_priority = idPriority",
        ];

        $where   = [];
        $data    = [];
      
        $where       = ['id_status NOT IN (4, 5)'];
        $userCreator = $this->employedByUser([$_COOKIE['IDU']]);
        $where[]     = 'id_user_creator';
        $data[]      = $userCreator['id'];

        if($array['udn'] != 0) {
            $where[] = "id_udn";
            $data[]  = $array['udn'];
        }

        if ($array['reminder'] == 'inprogress') {
            $where[] = 'id_status = 2';
            unset($array['reminder']); // No es necesario enviar valores adicionales
        }
        if($array['reminder'] == 'siete_dias' ) {
            $where[] = '(date_start BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) OR date_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY))';
            unset($array['reminder']); // No es necesario enviar valores adicionales
        }

        if ($array['reminder'] == 'atrasados') {
            $where[] = 'date_end < CURDATE()';
            unset($array['reminder']); // No es necesario enviar valores adicionales
        }

        return $this->_Select([
            'table'     => "{$this->bd}ga_activities",
            'values'    => $values,
            'where'     => $where,
            'innerjoin' => $innerjoin,
            'data'      => $data
        ]);
    }

    function listTaskByID($array){
        $query = "
            SELECT
                FullName,
                Telefono_movil,
                title,
                activities,
                rfwsmqex_gvsl_calendarizacion2.ga_activities.date_start,
                rfwsmqex_gvsl_calendarizacion2.ga_activities.date_follow,
                rfwsmqex_gvsl_calendarizacion2.ga_activities.date_end,
                rfwsmqex_gvsl_calendarizacion2.ga_activities.idActivity
            
            FROM
                rfwsmqex_gvsl_rrhh.empleados
            INNER JOIN rfwsmqex_gvsl_calendarizacion2.ga_activities 
            ON rfwsmqex_gvsl_calendarizacion2.ga_activities.id_employed = rfwsmqex_gvsl_rrhh.empleados.idEmpleado

            WHERE idActivity = ?
        
        ";

        return $this->_Read($query, $array)[0];
    }

    function lsEncargados($array){
        $where = "";
        $data  = [];
    
        if ($array[0] != "0") {
            $where = "WHERE rfwsmqex_gvsl_rrhh.empleados.UDN_Empleado = ?";
            $data[] = $array[0];
        }
    
        $query = "
            SELECT
                rfwsmqex_gvsl_rrhh.empleados.FullName AS valor,
                rfwsmqex_gvsl_calendarizacion2.ga_activities.id_employed AS id,
                rfwsmqex_gvsl_rrhh.empleados.Telefono_Movil,
                rfwsmqex_gvsl_rrhh.empleados.UDN_Empleado
            FROM
                rfwsmqex_gvsl_rrhh.empleados
            INNER JOIN rfwsmqex_gvsl_calendarizacion2.ga_activities 
                ON rfwsmqex_gvsl_calendarizacion2.ga_activities.id_employed = rfwsmqex_gvsl_rrhh.empleados.idEmpleado
            $where
            GROUP BY FullName ASC
        ";
    
        return $this->_Read($query, $data);
    }
    
    function listTaskByEmployed($array) {
        $values = [
            "id_employed",
            "empleados.Nombres AS nameResponsible",
            "empleados.Telefono_movil",
            "GROUP_CONCAT(CASE 
                WHEN ga_activities.title IS NOT NULL AND ga_activities.title <> '' 
                THEN ga_activities.title 
                ELSE ga_activities.activities 
            END SEPARATOR ', ') AS titles",
            "GROUP_CONCAT(ga_activities.activities SEPARATOR ' | ') AS actividades",
            "COUNT(*) AS total_actividades",
            "MIN(date_start) AS primera_fecha",
            "MAX(date_end) AS ultima_fecha",
            "id_user_creator",
        ];

        $innerjoin = [
            "{$this->bd}event_status" => "id_status = idStatus",
            "{$this->ch}empleados"   => "id_employed = idEmpleado",
            "udn"                     => "id_udn = idUDN",
            "{$this->bd}ga_priority" => "id_priority = idPriority",
        ];

        $where   = ['id_status NOT IN (4, 5)'];
        $data    = [];

        $userCreator = $this->employedByUser([$_COOKIE['IDU']]);
        $where[]     = 'id_user_creator';
        $data[]      = $userCreator['id'];

        if ($array['udn'] != 0) {
            $where[] = "id_udn";
            $data[]  = $array['udn'];
        }

        if ($array['reminder'] == 'siete_dias') {
            $where[] = '(date_start BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) OR date_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY))';
        }

        if ($array['reminder'] == 'atrasados') {
            $where[] = 'date_end < CURDATE()';
        }

        if ($array['reminder'] == 'inprogress') {
            $where[] = 'id_status = 2';
        }

        return $this->_Select([
            'table'     => "{$this->bd}ga_activities",
            'values'    => $values,
            'where'     => $where,
            'innerjoin' => $innerjoin,
            'group'     => "id_employed",
            'data'      => $data
        ]);
    }
    

    // Avance  
    function lsAdvance($array) {
        $leftjoin = [
            "rfwsmqex_erp.usuarios" => "idUser = id_user",
            "rfwsmqex_gvsl_rrhh.empleados" => "idEmpleado = usr_empleado",
        ];

        $values = [
            "idAdvance AS id",
            "rfwsmqex_erp.usuarios.idUser AS iduser",
            "CONCAT(rfwsmqex_gvsl_rrhh.empleados.FullName,' ',rfwsmqex_gvsl_rrhh.empleados.APaterno) AS empleado",
            "rfwsmqex_gvsl_rrhh.empleados.Sexo AS sexo",
            "rfwsmqex_erp.usuarios.user_photo AS src",
            "date_advance AS date",
            "advance AS valor",
            "date_seen",
        ];

        return $this->_Select([
            'table'    => "{$this->bd}ga_activities_advance",
            'values'   => $values,
            'where'    => "id_activity = ?",
            'leftjoin' => $leftjoin,
            'order'    => ['ASC'=>'date_advance'],
            'data'     => $array
        ]);
    }

    function getCountAdvanceNotSeen($array){
        $query = "
            SELECT COUNT(idAdvance) AS count
            FROM {$this->bd}ga_activities_advance
            WHERE id_activity = ? AND id_user = ? AND date_seen IS NULL
        ";
        return $this->_Read($query, $array)[0]['count'];
    }

    function getAdvanceById($array){
        $values = [
            "idAdvance AS id",
            "id_activity",
            "advance AS valor",
            "date_advance AS date",
            "id_user",
            "CONCAT(rfwsmqex_gvsl_rrhh.empleados.FullName,' ',rfwsmqex_gvsl_rrhh.empleados.APaterno) AS empleado",
            "rfwsmqex_gvsl_rrhh.empleados.Sexo AS sexo",
            "rfwsmqex_erp.usuarios.user_photo AS src",
            "date_seen",
        ];

        $leftjoin = [
            "rfwsmqex_erp.usuarios" => "idUser = id_user",
            "rfwsmqex_gvsl_rrhh.empleados" => "idEmpleado = usr_empleado",
        ];

        return $this->_Select([
            'table'    => "{$this->bd}ga_activities_advance",
            'values'   => $values,
            'where'    => "idAdvance = ?",
            'leftjoin' => $leftjoin,
            'data'     => $array
        ])[0];
    }

    function getLastAdvance($array){
      $query = "

        SELECT
            ga_activities_advance.date_advance,
            ga_activities_advance.id_activity,
            ga_activities_advance.idAdvance
        FROM {$this->bd}ga_activities_advance
        WHERE id_activity = ?

        ORDER BY idAdvance DESC limit 1
      
      ";
        return $this->_Read($query, $array)[0];
    }
  
    function createAdvance($array){
        return $this->_Insert([
            'table' => "{$this->bd}ga_activities_advance",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateAdvance($array){
        return $this->_Update([
            'table' => "{$this->bd}ga_activities_advance",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }
    
    function maxAdvance(){
        return $this->_Select([
            'table' => "{$this->bd}ga_activities_advance",
            'values' =>'MAX(idAdvance) AS id'
        ])[0]['id'];
    }

    function deleteAdvance($array){
        return $this->_Delete([
            'table' => "{$this->bd}ga_activities_advance",
            'where' => $array['where'],
            'data'  => $array['data']
        ]);
    }

    function getActivityById($array) {
        $values = [
            "idActivity AS id",
            "Nombres",
            "name_status",
            "activities",
            "date_creation",
            "date_start",
            "date_end",
            "date_follow",
            "date_seen",
            "id_status",
            "UDN",
            "priority",
            "id_employed",
            "id_user_creator",
            "id_priority",
            "title",
        ];

        $innerjoin = [
            "{$this->bd}event_status" => "id_status = idStatus",
            "{$this->ch}empleados"    => "id_employed = idEmpleado",
            "udn"                     => "id_udn = idUDN",
            "{$this->bd}ga_priority"  => "id_priority = idPriority",
        ];

        return $this->_Select([
            'table'     => "{$this->bd}ga_activities",
            'values'    => $values,
            'where'     => ['idActivity = ?'],
            'innerjoin' => $innerjoin,
            'data'      => $array
        ]);
    }

} 
?>