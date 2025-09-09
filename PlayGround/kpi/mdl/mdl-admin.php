<?php
// require_once('../conf/_Utileria.php');
require_once('../conf/_CRUD.php');


class MApp extends CRUD {
    public $bd_event = "rfwsmqex_gvsl_calendarizacion2.";
    public $bd_ch = "rfwsmqex_gvsl_rrhh.";
    public $util;

    public function __construct() {
        $this->util = new Utileria();
    }

    
    function lsUDN($tipo = null){
        $sql = $this->_Select([
                'table'  => 'udn',
                'values' => 'idUDN AS id, UDN AS valor',
                'where'  => 'Stado = 1',
                'order' => ['ASC'=>'Antiguedad']
            ]);
        
        return empty($tipo) ? $sql : array_merge([["id"=>0,"valor"=>"TODAS LAS UDN"]],$sql);
    }
    function lsReplay(){
        return $this->_Select([
            'table'  => "{$this->bd_event}event_replay",
            'values' => 'idReplay AS id,name_replay AS valor',
        ]);
    }
    function lsSeason(){
        return $this->_Select([
            'table'     => "{$this->bd_event}event_seasons",
            'values'    => 'idSeason AS id,name_season AS valor',
            'order'     => ['ASC'=>'name_season'],
        ]);
    }
    function lsStatus(){
        $sql = $this->_Select([
            'table'  => "{$this->bd_event}event_status",
            'values' => 'idStatus AS id,UPPER(name_status) AS valor',
        ]);
        
        return array_merge([["id"=>0,"valor"=>"TODAS LOS ESTADOS"]],$sql);
    }
    function lsEmployed($array){
        return $this->_Select([
            'table'     => "{$this->bd_ch}empleados",
            'values'    => 'idEmpleado AS id,CONCAT("[",Abreviatura,"] ",Nombres) AS valor',
            'where'     => 'Estado = 1, (UDN_Empleado = ? OR UDN_Empleado = ?)',
            'innerjoin' => ["udn" => "UDN_Empleado = idUDN"],
            'order'     => ['ASC'=>'idUDN,Nombres'],
            'data'      => $array
        ]);
    }
    


}
?>