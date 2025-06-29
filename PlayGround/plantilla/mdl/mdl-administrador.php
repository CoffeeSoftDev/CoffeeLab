<?php
require_once('mdl-admin.php');
class MAdministrador extends MApp {
function listEvent($array){
    $values = [
        'idEvent AS id',
        'title',
        'name_season',
        'activities',
        'date_init',
        'date_end',
        'abreviatura',
        'id_status',
        'year'
    ];

    $innerjoin = [
        "udn"                             => "idUDN = id_UDN",
        "{$this->bd_event}event_year"    => "idEvent = id_Event",
        "{$this->bd_event}event_seasons" => "idSeason = id_Season",
        "{$this->bd_event}event_status"  => "idStatus = id_Status",
    ];

    $where = '';

    if ( $array['udn'] == '0') unset($array['udn']);
    else $where = ',id_UDN';

    if( $array['status'] != '0' ) $where .= ',id_Status';
    else {
        unset($array['status']);
        $where .= ',id_Status != 5';
    }

    return $this->_Select([
        'table'     => "{$this->bd_event}events",
        'values'    => $values,
        'innerjoin' => $innerjoin,
        'where'     => "date_init >= ? AND date_end <= ?".$where,
        'data'      => array_values($array)
    ]);
}
function listEvent2($array){
    $values = [
        "event_seasons.name_season",
        "title",
        "activities",
        "day_init",
        "month_init",
        "day_end",
        "month_end",
        "event_replay.name_replay",
        "event_year.idYear",
        "event_year.id_Event as id",
        "event_year.`year`",
        "event_year.date_init",
        "event_year.date_end",
        "event_year.id_status",
        "title",
        "event_status.name_status",
        "abreviatura",
    ];

    $innerjoin = [
        "{$this->bd_event}events"       => "id_Season = idSeason",
        "{$this->bd_event}event_replay" => "id_Replay = idReplay",
        "{$this->bd_event}event_year"   => "{$this->bd_event}event_year.id_Event = idEvent",
        "{$this->bd_event}event_status" => "{$this->bd_event}event_year.id_status = idStatus",
        "udn"                           => "id_UDN = idUDN",
    ];

    return $this->_Select([
        'table'     => "{$this->bd_event}event_seasons",
        'values'    => $values,
        'where'     => "id_UDN,id_status, date_init >= ? OR date_end <= ?",
        'innerjoin' => $innerjoin,
        'data'      => $array
    ]);
}
function lsReponsibleEvent($array){
    return $this->_Select([
        'table'     => "{$this->bd_event}event_responsible",
        'values'    => 'Nombres',
        'innerjoin' => ["{$this->bd_ch}empleados"=>'idEmpleado = id_Employed'],
        'where'     => 'id_Event,year',
        'order'     => ['ASC'=>'Nombres'],
        'data'      => $array
    ]);
}
function maxSeason(){
    return $this->_Select([
        'table'  => "{$this->bd_event}event_seasons",
        'values' => 'MAX(idSeason) AS id',
    ])[0]['id'];
}
function newSeason($array){
    $success = $this->_Insert([
        'table'  => "{$this->bd_event}event_seasons",
        'values' => 'name_season',
        'data'   => $array
    ]);
    if($success) return $this->maxSeason();
    return $success;
}
function maxEvent(){
    return $this->_Select([
        'table'  => "{$this->bd_event}events",
        'values' => 'MAX(idEvent) AS id',
    ])[0]['id'];
}
function newEvent($array){
    $array['table'] = "{$this->bd_event}events";
    $success        = $this->_Insert($array);
    if($success) return $this->maxEvent();
    return $success;
}
function statusEvent($array){
    $array['table'] = "{$this->bd_event}event_year";
    return $this->_Update($array);
}
function newResponsibleEvent($array){
    $array['table'] = "{$this->bd_event}event_responsible";
    return $this->_Insert($array);
}
function newEventYear($array){
    $array['table'] = "{$this->bd_event}event_year";
    return $this->_Insert($array);
}
function getEventByID($array = null){
    $array  = $array ?? $_POST['id'];
    $values = [
        "title",
        "id_Season",
        "id_Replay",
        "day_init",
        "month_init",
        "day_end",
        "month_end",
        "id_UDN",
        "activities",
    ];

    $event = $this->_Select([
        'table'  => "{$this->bd_event}events",
        'values' => $values,
        'where'  => 'idEvent',
        'data'   => $array
    ])[0];

    $event['date_init']   = date('Y').'-'.$event['month_init'].'-'.$event['day_init'];
    $event['date_end']    = date('Y').'-'.$event['month_end'].'-'.$event['day_end'];
    $event['id_Employed'] = [1,2,3,4];
    
    unset($event['day_init'],$event['month_init'],$event['day_end'],$event['month_end']);

    return $event;
}
function employedByidEvent($array){
    return $this->_Select([
        'table'  => "{$this->bd_event}event_responsible",
        'values' => 'id_Employed',
        'where'  => 'id_Event',
        'data'   => $array
    ]);
}
}
?> 