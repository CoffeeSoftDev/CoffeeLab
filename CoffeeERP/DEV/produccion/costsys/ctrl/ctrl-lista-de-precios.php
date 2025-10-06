<?php
if(empty($_POST['opc'])) exit(0);

require_once('../mdl/mdl-lista-de-precios.php');
$obj = new Listadeprecios;

$encode = [];
switch ($_POST['opc']) {
    case 'listUDN':
            $encode = $obj->lsUDN();
        break;
}

echo json_encode($encode);
?>