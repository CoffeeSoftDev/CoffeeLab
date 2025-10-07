
<?php
require_once('../../../conf/_CRUD.php');

class Gestiondeventas extends CRUD{
    private $bd;
    private $erp;

    public function __construct() {
        $this->bd = "rfwsmqex_gvsl_produccion.";
        $this->erp = "rfwsmqex_gvsl_produccion.";
    }

}    