<?php
require_once('../../../conf/_CRUD.php');

class Conexion extends CRUD
{
    function now()
    {
        return $this->_Read('SELECT NOW()', null);
    }
}
?>