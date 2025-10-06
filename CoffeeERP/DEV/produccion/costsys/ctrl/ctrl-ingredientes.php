<?php
if (empty($_POST['opc']))
    exit(0);

require_once('../mdl/mdl-ingredientes.php');
$obj = new Ingredientes;
require_once('../../../conf/_Utileria.php');
$util = new Utileria;

$encode = [];
switch ($_POST['opc']) {
    // INGREDIENTE ---------------------------------------------------------------------
    // Tabla principal de ingredientes
    case 'tbIngredientes':
        $th = [
            'Producto',
            'Precio Compra',
            'Cont. Neto',
            'Precio Unidad',
            'Unidad',
            'Marca',
            'Proveedor',
            'Descripcion',
            'opciones'
        ];
        $encode = tbDataIngredientes($obj, $th);
        break;
    // Listar ingredientes
    // case 'getIngrediente':
    //     $encode = $obj->getIngredientes();
    //     break;
    // Crear o actualizar ingredientes
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
    // PROVEEDOR ---------------------------------------------------------------------
    // case 'createProveedor':
    //     $array = array();
    //     foreach ($_POST as $key => $value) {
    //         if ($key != 'opc' && $key != 'id')
    //             if ($value == '' || $value == '0')
    //                 $array[] = null;
    //             else
    //                 $array[] = $value;
    //     }
    //     $encode = $obj->createProveedor($array);
    //     break;
    // case 'createMarca':
    //     $array = array();
    //     foreach ($_POST as $key => $value) {
    //         if ($key != 'opc' && $key != 'id')
    //             if ($value == '' || $value == '0')
    //                 $array[] = null;
    //             else
    //                 $array[] = $value;
    //     }
    //     $encode = $obj->createMarca($array);
    //     break;
    // case 'createUnidad':
    //     $array = array();
    //     foreach ($_POST as $key => $value) {
    //         if ($key != 'opc' && $key != 'id')
    //             if ($value == '' || $value == '0')
    //                 $array[] = null;
    //             else
    //                 $array[] = $value;
    //     }
    //     $encode = $obj->createUnidad($array);
    //     break;
    // Cargar selects
    // case 'loadSelects':
    //     $unidad = $obj->lsUnidad();
    //     $marca = $obj->lsMarca();
    //     $proveedor = $obj->lsProveedor();
    //     $encode = [
    //         "unidad" => $unidad,
    //         "marca" => $marca,
    //         "proveedor" => $proveedor
    //     ];
    //     break;
}

function tbDataIngredientes($obj, $th)
{
    # Declarar variables
    $__row = [];
    #Consultar a la base de datos
    $ls = $obj->lsIngredientes([$_POST['cbUDN']]);
    foreach ($ls as $key) {
        $btn = [];
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

        $btn[] = [
            "fn" => "editIngrediente('" . json_encode($datos) . "');",
            "color" => 'primary ',
            "icon" => 'icon-pencil',
        ];

        $__row[] = array(
            'id' => $key['id'],
            'name' => $key['valor'],
            'precioUnidad' => $key['precioUnidad'],
            'neto' => $key['neto'],
            'precio' => $key['costo'],
            'unidad' => $key['unidad'],
            'marca' => isset($key['marca']) ? $key['marca'] : '',
            'proveedor' => isset($key['proveedor']) ? $key['proveedor'] : '',
            'descripcion' => isset($key['descripcion']) ? $key['descripcion'] : '',
            "btn" => $btn
        );
    }
    #encapsular datos
    $encode = [
        "thead" => $th,
        "row" => $__row
    ];
    return $encode;

}

echo json_encode($encode);
?>