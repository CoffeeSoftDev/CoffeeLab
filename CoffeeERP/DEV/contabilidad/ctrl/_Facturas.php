<?php
require_once('../mdl/mdl-facturas.php');
require_once('../../conf/_Utileria.php');
class Facturas {
    private $c;//conta
    private $obj;
    private $util;

    public function __construct($conta) {
        $this->c = $conta;
        $this->obj = new MClientes();
        $this->util = new Utileria();
    }
}
?>