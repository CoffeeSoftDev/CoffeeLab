<?php
if(empty($_POST['opc'])) exit(0);

setlocale(LC_TIME, 'es_ES.UTF-8');
date_default_timezone_set('America/Mexico_City');
header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos
require_once('../mdl/mdl-administrador.php');

class App extends MAdministrador {
    function init(){
        return [
            'udn'       => $this -> lsUDN('all'),
            'udnForm'   => $this -> lsUDN(),
            'estados'   => $this -> lsStatus(),
            'temporada' => $this -> lsSeason(),
            'replay'    => $this -> lsReplay(),
        ];
    }
    function getListEmployed(){
        return [ 'employeds' => $this -> lsEmployed([$_POST['udn'],8]) ];
    }
    function addEvent() {
        $date_init  = explode('-',$_POST['date_init']);
        $date_end   = explode('-',$_POST['date_end']);
        $init_day   = $date_init[0];
        $init_month = $date_init[1];
        $init_year  = $date_init[2];
        $end_day    = $date_end[0];
        $end_month  = $date_end[1];
        $end_year   = $date_end[2];
        
        $idSeason = intval($_POST['id_Season']) === 0 ? $this->newSeason([$_POST['id_Season']]) : $_POST['id_Season'];

        $array_event = [
            'title'      => $_POST['title'],
            'activities' => $_POST['activities'],
            'day_init'   => $init_day,
            'month_init' => $init_month,
            'day_end'    => $end_day,
            'month_end'  => $end_month,
            'id_UDN'     => $_POST['id_UDN'],
            'id_Season'  => $idSeason,
            'id_Replay'  => $_POST['id_Replay'],
        ];
        $idEvent = $this->newEvent($this->util->sql($array_event));

        $array_employed = [];
        foreach ($_POST['id_Employed'] as $value) {
            $array_employed[] = [
                "id_Employed" => $value,
                "id_Event"    => $idEvent,
                'year'        => date('Y')
            ];
        }
        $this->newResponsibleEvent($this->util->sql($array_employed));//Nuevo responsable del evento.
        
        $date1 = strtotime($_POST['date_init']);
        $date2 = strtotime($_POST['date_end']);        
        $array_event_year =  [
            'id_Event'  => $idEvent,
            'year'      => $init_year,
            'date_init' => date('Y-m-d',$date1),
            'date_end'  => date('Y-m-d',$date2),
        ];
        $success = $this->newEventYear($this->util->sql($array_event_year));//Nuevo evento del año.

        return [
            'success'   => $success,
            'temporada' => $this->lsSeason()
        ];
    }
    function lsEvents(){
        $__row = [];
        unset($_POST['calendar'],$_POST['opc']);
        $ls = $this->listEvent($_POST);
        foreach ($ls as $key) {
            $responsible = $this->lsReponsibleEvent([$key['id'],$key['year']]);
            $responsables = "";
            foreach ($responsible as $value) $responsables .= "{$value['Nombres']}<br>";


            $__row[] = [
                'id'           => $key['id'],
                'fecha'        => $this->dateAnalitycs($key['date_init'],$key['date_end'],$key['id_status']),
                'udn'          => $key['abreviatura'],
                'temporada'    => $key['name_season'],
                'titulo'       => $key['title'],
                'responsables' => $responsables,
                'estado'       => $this->getEstatus($key['id_status']),
                'dropdown'     => $this-> list_dropdown($key['id_status'],$key['id'],$key['year'],$key['title']),
            ];
        }

        return [ "row" => $__row, 'post' => $this->util->sql($_POST)];
    }
    function list_dropdown($idEstado,$idEvent,$year,$title){
        $values = [
            'delete'    => ['icon' => 'icon-trash',     'text' => 'Eliminar',           'onclick' => "calendarizacion.statusEvents(5,{$idEvent},{$year},'{$title}')"],
            'inProcess' => ['icon' => 'icon-spinner',   'text' => 'En proceso',         'onclick' => "calendarizacion.statusEvents(2,{$idEvent},{$year},'{$title}')"],
            'pause'     => ['icon' => 'icon-pause',     'text' => 'Pausar',             'onclick' => "calendarizacion.statusEvents(3,{$idEvent},{$year},'{$title}')"],
            'finalize'  => ['icon' => 'icon-ok',        'text' => 'Finalizar',          'onclick' => "calendarizacion.statusEvents(4,{$idEvent},{$year},'{$title}')"],
            'resume'    => ['icon' => 'icon-play',      'text' => 'Reanudar',           'onclick' => "calendarizacion.statusEvents(6,{$idEvent},{$year},'{$title}')"],
            'edit'      => ['icon' => 'icon-pencil',    'text' => 'Editar',             'onclick' => "calendarizacion.editModal({$idEvent},{$year})"],
            'feedback'  => ['icon' => 'icon-comment',   'text' => 'Retroalimentacion',  'onclick' => "calendarizacion.feedBackModal({$idEvent},{$year})"],
        ];
    
        $options = [
            '1' => [
                $values['inProcess'],
                $values['edit'],
                $values['pause'],
                $values['delete']
            ],
            '2' => [
                $values['edit'],
                $values['pause'],
                $values['delete'],
                $values['finalize']
            ],
            '3' => [
                $values['resume'],
                $values['delete'],
                $values['finalize']
            ],
            '4' => [
                $values['edit'],
                $values['delete'],
                $values['feedback']
            ]
        ];
    
        return $options[$idEstado] ?? [];
    }
    function dateAnalitycs($inicio,$fin,$status){
        $hoy     = date("Y-m-d");
        $start   = $this->util->formatDate($inicio,'dayMonth');
        $end     = $this->util->formatDate($fin,'dayMonth');
        $bgClass = "";
        $red = "#f87171";
        $orange = "#fdba74";

        if (strtotime($fin) < strtotime($hoy) && ($status == 1 || $status == 2 )) $bgClass = $red;
        elseif (strtotime($hoy) > strtotime($inicio) && $status == 1) $bgClass = $orange;
        

        return ['class'=>"text-center",'html'=>"{$start} / {$end}","style"=>"background:{$bgClass}"];
    }
    function getEstatus($idEstado){
        switch ($idEstado) {
            case '1': return '⌚ POR INICIAR';
            case '2': return '⏳ EN PROCESO';
            case '3': return '⏸️ PAUSADO';
            case '4': return '✅ FINALIZADO';
            case '5': return '🚫 CANCELADO';
        }
    }
    function editEvent(){
        return $this->getEventByID([$_POST['id']]);
    }
    function statusEvents(){
        return $this->statusEvent($this->util->sql($_POST,2));
    }

    // RETROALIMENTACION
    function getFeedback(){}
    function setFeedback(){}
}


$opc    = $_POST['opc'];
$obj    = new App();
$encode = $obj->$opc();
echo json_encode($encode);
?>