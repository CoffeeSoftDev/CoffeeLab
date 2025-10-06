<?php
require_once('../../conf/_CRUD2.php');
class MContabilidad extends CRUD {
    protected $bd_fzas = 'rfwsmqex_gvsl_finanzas2.';
    protected $bd_ch = 'rfwsmqex_gvsl_rrhh.';

    public function getFzas(){
        return $this->bd_fzas;
    }
    public function getCH(){
        return $this->bd_fzas;
    }
    public function onlyUDN($array){
        return $this->_Select([
            'table'     => "udn",
            'values'    => '*',
            'where'     => 'idUDN',
            'data'      => $array
        ])[0];
    }
}
?> 