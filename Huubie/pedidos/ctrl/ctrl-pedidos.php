<?php
if (empty($_POST['opc'])) exit(0);
require_once '../mdl/mdl-pedidos.php';
class Pedidos extends MPedidos{
    
    function init(){
        return [
            'init' => "Hola Mundo"
        ];
    }
}

$obj    = new Pedidos();
$fn     = $_POST['opc'];
$encode = [];
$encode = $obj->$fn();
echo json_encode($encode);
?>