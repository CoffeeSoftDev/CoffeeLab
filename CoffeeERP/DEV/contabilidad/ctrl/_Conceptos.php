<?php
require_once('../mdl/mdl-conceptos.php');
require_once('../../conf/_Utileria.php');
class Conceptos {
    // INSTANCIAS
    private $c;
    private $obj;
    private $util;

    public function __construct($conta) {
        $this->c    = $conta;
        $this->obj  = new MConceptos();
        $this->util = new Utileria();
    }

public function tbConceptos(){
    $idE    = $this->c->getVar('idE');
    $filtro = $this->c->getVar('filtro');

    return [
        ['filtro' => 'ing', 'list' => $this->obj->lsVentas([$idE])],
        ['filtro' => 'des', 'list' => $this->obj->lsDescuentos([$idE])],
        ['filtro' => 'imp', 'list' => $this->obj->lsImpuestos([$idE])],
        ['filtro' => 'mon', 'list' => $this->obj->lsMonedasExtranjeras()],
        ['filtro' => 'ban', 'list' => $this->obj->lsBancos([$idE])],
        ['filtro' => 'cli', 'list' => $this->obj->lsClientes([$idE])],
        ['filtro' => 'pro', 'list' => $this->obj->lsProveedores([$idE])],
        ['filtro' => 'cin', 'list' => $this->obj->lsClaseInsumo([$idE])],
        ['filtro' => 'ins', 'list' => $this->obj->lsInsumos([$idE])],
    ];
}
}
?>