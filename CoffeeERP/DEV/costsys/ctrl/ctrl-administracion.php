<?php
if (empty($_POST['opc']))
    exit(0);


require_once ('../mdl/mdl-administracion.php');
$obj = new Administracion;
require_once ('../../conf/_Utileria.php');
$util = new Utileria;

$encode = [];
switch ($_POST['opc']) {
    case 'getUDN':
        $encode = $obj->lsUDN();
        break;
    case 'getClasificacion':
        $__classification = [];
        $ls = $obj->lsClassifications();
        foreach ($ls as $key) {
            $__classification[] = array(
                'id' => $key['id'],
                'valor' => $key['abreviatura'] . ' - ' . $key['valor'],
            );
        }
        $encode = $__classification;
        break;
    case 'tbClasificacion':
        $encode = tbDataClassification($obj);
        break;
    case 'tbSubClasificacion':
        $encode = tbDataSubClassification($obj);
        break;

    case 'createClasificacion':
        // Validar si ya existe la clasificación
        $duplicateFound = false;
        $ls = $obj->lsClassifications();
        foreach ($ls as $key) {
            if ($key['valor'] == $_POST['Clasificacion'] && $key['idudn'] == $_POST['id_UDN']) {
                $encode = ['status' => 500, 'message' => 'La clasificación ya existe.'];
                $duplicateFound = true;
                break; // Salir del bucle si se encuentra un duplicado
            }
        }
        if (!$duplicateFound) {
            // Crear clasificación
            $class = $obj->createClassification($util->sql($_POST));
            if ($class === true) {
                $encode = ['status' => 200, 'message' => 'Clasificación creada correctamente.'];
            } else {
                $encode = ['status' => 500, 'message' => 'Error al crear la clasificación.'];
            }
        }
        break;

    case 'createSubClasificacion':
        // Validar si ya existe la subclasificación
        $duplicateFound = false;
        $ls = $obj->lsSubClassifications();
        foreach ($ls as $key) {
            if ($key['valor'] == $_POST['nombre'] && $key['idclasificacion'] == $_POST['id_Clasificacion']) {
                $encode = ['status' => 500, 'message' => 'La subclasificación ya existe.'];
                $duplicateFound = true;
                break; // Salir del bucle si se encuentra un duplicado
            }
        }
        if (!$duplicateFound) {
            // Crear subclasificación
            $subclass = $obj->createSubClassification($util->sql($_POST));
            if ($subclass === true) {
                $encode = ['status' => 200, 'message' => 'SubClasificación creada correctamente.'];
            } else {
                $encode = ['status' => 500, 'message' => 'Error al crear la subclasificación.'];
            }
        }
        break;

    case 'deleteClasificacion':
        $encode = $obj->deleteClassification([$_POST['id']]);
        break;
    case 'deleteSubClasificacion':
        $encode = $obj->deleteSubClassification([$_POST['id']]);
        break;
}
function tbDataClassification($obj)
{
    $__row = [];
    #Consultar a la base de datos
    $ls = $obj->lsClassificationsTb([$_POST['cbUDN']]);
    foreach ($ls as $key) {
        $btn = [];
        $btn[] = [
            "fn" => "deleteClasificacion(" . $key['id'] . ");",
            "color" => 'danger',
            "icon" => 'icon-trash-2',
        ];

        $__row[] = array(
            'id' => $key['id'],
            'Clasificacion' => $key['valor'],
            'UDN' => $key['udn'],
            'Impuestos' => $key['impuestos'],
            "btn" => $btn
        );
    }
    #encapsular datos
    $encode = [
        "thead" => "",
        "row" => $__row
    ];
    return $encode;

}

function tbDataSubClassification($obj)
{
    $__row = [];
    #Consultar a la base de datos
    $ls = $obj->lsSubClassificationTb([$_POST['cbClasificacion']]);
    foreach ($ls as $key) {
        $btn = [];
        $btn[] = [
            "fn" => "deleteSubClasificacion(" . $key['id'] . ");",
            "color" => 'danger',
            "icon" => 'icon-trash-2',
        ];

        $__row[] = array(
            'id' => $key['id'],
            'SubClasificacion' => $key['valor'],
            'Clasificacion' => $key['clasificacion'],
            "btn" => $btn
        );
    }
    #encapsular datos
    $encode = [
        "thead" => "",
        "row" => $__row
    ];
    return $encode;

}

echo json_encode($encode);
?>