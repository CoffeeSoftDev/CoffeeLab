<?php
if (empty($_POST['opc']))
    exit(0);

require_once('../mdl/mdl-ingredientes.php');
$obj = new Ingredientes;
require_once('../../conf/_Utileria.php');
$util = new Utileria;

$encode = [];
switch ($_POST['opc']) {
        // INGREDIENTE ---------------------------------------------------------------------
        // Tabla principal de ingredientes
    case 'tbIngredientes':
        $encode = tbDataIngredientes($obj);
        break;
    case 'createOrUpdateIngredientes':
        $array = array();
        foreach ($_POST as $key => $value) {
            if ($value == '' || $value == '0')
                $array[$key] = null;
            else
                $array[$key] = $value;
        }
        unset($array['precioUnidad']);
        if (isset($array['idIngrediente']) && $array['idIngrediente'] != '')
            $encode = $obj->updateIngrediente($util->sql($array, 1));
        else
            $encode = $obj->createIngrediente($util->sql($array));
        break;
    case 'deleteIngrediente':
        $encode = $obj->deleteIngrediente($util->sql($_POST, 1));
        break;
    case 'lsIngredientesReceta':
        $encode = $obj->lsIngredientesReceta([$_POST['idIngrediente']]);
        break;
    case 'lsIngredientesSubreceta':
        $encode = $obj->lsIngredientesSubReceta([$_POST['idIngrediente']]);
        break;
}

function tbDataIngredientes($obj)
{
    # Declarar variables
    $__row = [];
    #Consultar a la base de datos
    $ls = $obj->lsIngredientes([$_POST['cbUDN']]);
    foreach ($ls as $key) {
        $a = [];
        $datos = [
            "id" => $key['id'],
            "name" => $key['valor'],
            "precioUnidad" => $key['precioUnidad'],
            "neto" => $key['neto'],
            "precio" => $key['costo'],
            "unidad" => $key['idunidad'],
            "marca" => $key['idmarca'],
            "udn" => $key['idudn'],
            "proveedor" => $key['idproveedor'],
            "descripcion" => $key['descripcion']

        ];

        $a[] = [
            "onclick" => "editIngrediente('" . json_encode($datos) . "');",
            "class" => 'btn p-0 btn-sm btn-outline-primary btn-edit-ingrediente',
            "html" => '<i class="icon-pencil"></i>',
        ];

        $a[] = [
            "onclick" => "deleteIngrediente('" . $key['id'] . "');",
            "class" => 'btn p-0 btn-sm btn-outline-danger btn-delete-ingrediente ms-1',
            "html" => '<i class="icon-trash"></i>',
        ];

        $__row[] = array(
            'id' => $key['id'],
            'Producto' => $key['valor'],
            'Precio Compra' => evaluar($key['costo']),
            'Cont. Neto' => $key['neto'],
            'Precio Unidad' => evaluar($key['precioUnidad']),
            'Unidad' => $key['unidad'],
            'Marca' => isset($key['marca']) ? $key['marca'] : '',
            'proveedor' => isset($key['proveedor']) ? $key['proveedor'] : '',
            'Descripcion' => isset($key['descripcion']) ? $key['descripcion'] : '',
            "a" => $a
        );
    }
    #encapsular datos
    $encode = [
        "thead" => "",
        "row" => $__row
    ];
    return $encode;
}
function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

echo json_encode($encode);
