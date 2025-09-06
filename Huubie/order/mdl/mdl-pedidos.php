<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');
class MPedidos extends CRUD {
    protected $util;
    public function __construct() {
        $this->util = new Utileria;
    }
}
?>