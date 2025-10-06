<?php
if (empty($_POST['opc'])) {
    exit(0);
}

require_once('../mdl/mdl-conexion.php');
$obj = new Conexion;

$encode = [];
switch ($_POST['opc']) {
    case 'prueba':
        $encode = $obj->now();
        break;
}
echo json_encode($encode);
?>