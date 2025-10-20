<?php
require_once('../../conf/_Utileria.php');
require_once('../../conf/_CRUD.php');

class mdl extends CRUD {
    protected $util;
    protected $bd;
    protected $ch;


    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_gvsl_calendarizacion2.";
        $this->ch = "rfwsmqex_gvsl_rrhh.";   
    }

    function listTask($array, $idEmpleado){
        $values = [
            "idActivity AS id",
            "Nombres",
            "name_status",
            "activities",
            "date_creation",
            "date_start",
            "date_end",
            "date_finished",
            "date_follow",
            "id_status",
            "UDN",
            "priority",
            "id_employed",
            "id_user_creator",
            "id_priority",
            "title",
            "Abreviatura",
            "id_udn"
        ];

        $innerjoin = [
            "{$this->bd}event_status" => "id_status = idStatus",
            "{$this->ch}empleados"    => "id_employed = idEmpleado",
            "udn"                     => "id_udn = idUDN",
            "{$this->bd}ga_priority"  => "id_priority = idPriority",
        ];
    
        $where = [];
        $data = [];
        
        $where[] = 'id_employed = ?';
        $data[] = $idEmpleado;
        
        // 📏 FILTROS

        // 🔵 Filtro por estado
        if ($array['estadoAsignados'] != 0) {
            $where[] = "id_status = ?";
            $data[] = $array['estadoAsignados'];

            if ($array['estadoAsignados'] == 4 ) {
                if (!empty($array['filtroMesAsign']) && $array['filtroMesAsign'] != '0') {
                    $where[] = "MONTH(date_finished) = ?";
                    $data[]  = $array['filtroMesAsign'];
                } else {
                    $where[] = "YEAR(date_finished) = YEAR(CURDATE())";
                }
            }
        } else {
            // 📌 Mostrar todos los estados excepto cancelado
            $where[] = "(id_status IS NULL OR id_status != 5)";
        }

        
         // 📏 EJECUCIÓN
        return $this->_Select([
            'table'     => "{$this->bd}ga_activities",
            'values'    => $values,
            'where'     => $where,
            'innerjoin' => $innerjoin,
            'data'      => $data,
            'order'      => [ 
                'ASC'=>['id_status, id_priority'],
                'DESC'=>['date_creation'], 
            ],
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

    function getEmployedByID($array){
        $query = "
            SELECT
                Nombres,
                FullName,
                idEmpleado,
                Telefono_Movil,
                empleados.id_Patron,
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
        $result = $this->_Read($query, $array);
        return !empty($result) ? $result[0] : null;
    }
    function getTwoLastAdvance($array){
        $query = "
        SELECT CONCAT(
            ELT(WEEKDAY(ga_activities_advance.date_advance) + 1, 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'),
            ' ',
            DAY(ga_activities_advance.date_advance), ' ',
            ELT(MONTH(ga_activities_advance.date_advance), 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'),
            ' ',
            YEAR(ga_activities_advance.date_advance)
            ) AS date,
            ga_activities_advance.id_activity,
            ga_activities_advance.idAdvance,
            ga_activities_advance.id_user,
            ga_activities_advance.advance AS avance,
            Nombres AS usuario
        FROM
            rfwsmqex_gvsl_calendarizacion2.ga_activities_advance
        LEFT JOIN usuarios ON idUser = id_user
        LEFT JOIN rfwsmqex_gvsl_rrhh.empleados ON idEmpleado = usr_empleado
        WHERE
            id_activity = ?
        ORDER BY
            idAdvance DESC
        LIMIT 2
        ";
        return $this->_Read($query, $array);
    }

    function getCountAdvanceNotSeen($array){
        $query = "
            SELECT COUNT(idAdvance) AS count
            FROM {$this->bd}ga_activities_advance
            WHERE id_activity = ? AND id_user = ? AND date_seen IS NULL
        ";
        return $this->_Read($query, $array)[0]['count'];
    }

    // sctivity.
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
            "date_finished",
            "CONCAT(
            ELT(WEEKDAY(date_seen) + 1, 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'),' ',
            DAY(date_seen), ' ', ELT(MONTH(date_seen), 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'),' ',
            YEAR(date_seen)) AS date_seen",
            "id_status",
            "UDN",
            "priority",
            "id_employed",
            "id_user_creator",
            "id_priority",
            "title",
            "feedback",
            "average",
            "objetivo",
            "ga_ratings.id AS idRating",
        ];

        $innerjoin = [
            "{$this->bd}event_status" => "id_status = idStatus",
            "{$this->ch}empleados"    => "id_employed = idEmpleado",
            "udn"                     => "id_udn = idUDN",
            "{$this->bd}ga_priority"  => "id_priority = idPriority",
            "{$this->bd}ga_ratings"  => "idActivity = ga_activities_id",
        ];

        return $this->_Select([
            'table'     => "{$this->bd}ga_activities",
            'values'    => $values,
            'where'     => ['idActivity = ?'],
            'leftjoin' => $innerjoin,
            'data'      => $array
        ]);
    }

    function updateDateSeen($array){
        return $this->_Update([
            'table'  => "{$this->bd}ga_activities",
            'values' => "date_seen",
            'where'  => "idActivity = ?",
            'data'   => $array
        ]);
    }

    function getQuestionsByRating($array){
        $query = "
            SELECT
                ga_questions_ratings.id,
                ga_ratings_id,
                ga_questions_id,
                answered AS calification,
                question
            FROM
                {$this->bd}ga_questions_ratings
            LEFT JOIN {$this->bd}ga_questions ON ga_questions.id = ga_questions_ratings.ga_questions_id
            WHERE
                ga_ratings_id = ?
           
        ";
        return $this->_Read($query, $array);
    }

}