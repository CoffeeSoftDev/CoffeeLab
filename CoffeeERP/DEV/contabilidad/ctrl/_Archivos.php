<?php
require_once('../mdl/mdl-archivos.php');
require_once('../../conf/_Utileria.php');
class Archivos {
    // INSTANCIAS
    private $c;
    private $obj;
    private $util;

    public function __construct($conta) {
        $this->c    = $conta;
        $this->obj  = new MArchivos();
        $this->util = new Utileria();
    }

    public function lsFiles(){
        $idE    = $this->c->getVar('idE');
        $date1  = $this->c->getVar('date1');
        $date2  = $this->c->getVar('date2');
        $filtro = $this->c->getVar('filtro');

        $array  = [$filtro,$idE,$date1,$date2];

         if($filtro == 'TES')
            return $this->obj->lsFilesTesoreria([4,$idE,$date1,$date2]);
        else
            return $this->obj->lsFilesSales($array);
    }
    public function deleteFile(){
        return $this->obj->_Delete([
            'table' => "{$this->obj->getFzas()}sobres",
            'where' => "idSobre",
            'data' => [$_POST['id']]
        ]);
    }
}
?>