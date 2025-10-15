<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');
session_start();

class mdl extends CRUD {

    public $util;
    public $bd;

    function __construct() {
        $this->util = new Utileria();
        $this->bd = "rfwsmqex_kpi.";
    }

    // Social Networks

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' 