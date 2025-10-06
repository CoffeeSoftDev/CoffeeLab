<?php
require_once('../mdl/mdl-apertura.php');
require_once('../../conf/_Utileria.php');
class Apertura {
    // INSTANCIAS
    private $c;
    private $obj;
    private $util;

    public function __construct($conta) {
        $this->c    = $conta;
        $this->obj  = new MApertura();
        $this->util = new Utileria();
    }
public function newOpen(){
    $udn      = explode(',',$_POST['id_UDN']);
    $tabs     = explode(',',$_POST['Pestana']);
    $fecha    = explode(',',str_replace('/','-',str_replace(' - ',',',$_POST['Fecha'])));
    $obs      = $_POST['observaciones'];
    $interval = $this->util->intervalDates($fecha[0],$fecha[1])['dates'];

    $apertura = [];
    
    foreach ($interval as $date) {
        foreach ($udn as $idE) {
            foreach ($tabs as $tab) {
                $apertura[] = [
                    'id_UDN'        => $idE,
                    'Pestana'       => $tab,
                    'Fecha'         => $date,
                    'observaciones' => $obs,
                    'id_Usr'        => $_COOKIE['IDU'],
                ];
            }
        }
    }

    return $this->obj->newApertura($this->util->sql($apertura));
}
public function tbAperturas(){
    return $this->obj->listAperturas();   
}
public function tbHistory(){
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    return $this->obj->tbHistorial([$date1,$date2]);
}
public function closeTab(){
    $idE = $this->c->getVar('idE');
    $idT = $_POST['idTap'];
    $idA = $_POST['idApertura'];

    // return [$idE,$idT,$idA];
    return $this->obj->closeApertura($idE,$idT,$idA);
}
public function listHrs(){
    return $this->obj->lsHours();
}
public function updateHrs(){
    return $this->obj->updateHrs([$_POST['hora'],$_POST['mes']]);
}
}
?>