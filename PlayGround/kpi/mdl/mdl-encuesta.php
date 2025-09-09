<?php

require_once('../conf/_Utileria.php');
require_once('../conf/_CRUD.php');


class MApp extends CRUD {

    public $bd_ch = "rfwsmqex_gvsl_rrhh.";
    public $util;

    public function __construct() {
        $this->util = new Utileria();
    }

}    