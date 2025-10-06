<?php
if (empty($_POST['opc']))
    exit(0);

require_once ('../mdl/mdl-recetas.php');
$obj = new Recetas;
require_once ('../mdl/mdl-calculo.php');
$calculo = new aux_cp;
require_once ('../../../conf/_Utileria.php');
$util = new Utileria;

$encode = [];
switch ($_POST['opc']) {
    // RECETA ------------------------------------------------------------------
    // Tabla principal de recetas
    case 'tbRecetas':
        $th = [
            'Receta',
            'sub-categoria',
            'Rendimiento',
            'Costo',
            'Precio Venta',
            'MC',
            'Porcentaje Costo',
            'opciones'
        ];
        $encode = tbDataRecetas($obj, $th);
        break;

    // Crear receta
    case 'createReceta':
        unset($_POST['foto']);
        $array = array();
        foreach ($_POST as $key => $value) {
            if ($key != 'opc' && $key != 'id')
                if ($value != '' && $value != '0' && $value != null) {
                    $array[$key] = $value;
                }
        }
        $idReceta = $obj->createReceta($util->sql($array));

        if(isset($idReceta) && count($_FILES) > 0) $encode = subir_foto($_FILES['foto'],$idReceta,$obj,$util);
        break;

    // Actualizar receta
    case 'updateReceta':
        unset($_POST['foto']);
        $result = $obj->updateReceta($util->sql($_POST, 1));

        if(isset($result) && count($_FILES) > 0) $encode = subir_foto($_FILES['foto'],$_POST['idReceta'],$obj,$util);
        break;

    // Validar receta
    case 'validateReceta':
        $encode = $obj->validateReceta($_POST['nombre'], $_POST['udn']);
        break;

    // RECETAS-INGREDIENTES -----------------------------------------------------
    // Tabla ingredientes para recetas
    case 'tbRecetasIngredientes':
        $encode = tbDataRecetasIngredientes($obj);
        break;

    // Crear recetas-ingredientes
    case 'createRecetasIngredientes':
        $arreglo = [$_POST['id_Ingrediente'], $_POST['id_Receta']];
        $exist = $obj->existRecetasIngredientes($arreglo);
        $ok = false;
        $msg = 'El ingrediente ya existe en la receta';
        if (!$exist) {
            $ok = $obj->createRecetasIngredientes($util->sql($_POST));
            $msg = '';
        }
        $encode = [
            'ok' => $ok,
            'msg' => $msg
        ];
        break;

    // Actualizar recetas-ingredientes
    case 'updateRecetasIngredientes':
        $array = $util->sql($_POST, 2);
        $ok = $obj->updateRecetasIngredientes($array);
        $encode = ['ok' => $ok];
        break;

    // Eliminar recetas-ingredientes
    case 'deleteRecetasIngredientes':
        $encode = $obj->deleteRecetasIngredientes($util->sql($_POST, 2));
        break;

    // RECETAS-SUBRECETAS --------------------------------------------------------
    // Tabla subrecetas para recetas
    case 'tbRecetasSubRecetas':
        $encode = tbDataRecetasSubRecetas($obj, $calculo);
        break;

    // Crear recetas-subrecetas
    case 'createRecetasSubRecetas':
        $arreglo = [$_POST['id_Subreceta'], $_POST['id_Receta']];
        $exist = $obj->existRecetasSubRecetas($arreglo);
        $ok = false;
        $msg = 'La subreceta ya existe en la receta';
        if (!$exist) {
            $ok = $obj->createRecetasSubRecetas($util->sql($_POST));
            $msg = '';
        }
        $encode = [
            'ok' => $ok,
            'msg' => $msg
        ];
        break;

    // Actualizar recetas-subrecetas
    case 'updateRecetasSubRecetas':
        $array = $util->sql($_POST, 2);
        $ok = $obj->updateRecetasSubRecetas($array);
        $encode = ['ok' => $ok];
        break;

    // Eliminar recetas-subrecetas
    case 'deleteRecetasSubRecetas':
        $encode = $obj->deleteRecetasSubRecetas($util->sql($_POST, 2));
        break;
}

function subir_foto($file_foto,$idReceta,$obj,$util) {
    $data = $obj->getRecetaById([$idReceta]);
    // Fijamos la ruta del archivo del costsys
    $destino = "erp_files/costsys/{$data['UDN']}/{$data['clase']}/";
    // Asignamos el nombre nuevo del archivo
    $nombreArchivo = $data['nombre'];
    // Obtenemos la extención del archivo
    $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    // Concatenamos la ruta a guardar en la BD
    $ruta_completa = $destino . $nombreArchivo . '.' . $extension;
    // Guardamos en la BD
    $updateName = $obj->updatePhotoReceta([$ruta_completa, $idReceta]);
    //Subimos el archivo al servidor host
    if ($updateName) 
        $util->upload_file($file_foto, '../../../../' . $destino, $nombreArchivo);
    // return $idReceta;
    // Retornamos el id de la receta y la ruta de la foto
    return [
        'idReceta' => $idReceta,
        'rutaFoto' => $ruta_completa
    ];
}

function tbDataRecetas($obj, $th)
{
    # Declarar variables
    $__row = [];
    $idClasificacion = $_POST['cbClasificacion'];
    #Consultar a la base de datos
    $ls = $obj->lsRecetas([$idClasificacion]);

    foreach ($ls as $key) {
        $btn = [];
        $btn[] = [
            "fn" => 'editRecetaInterface',
            "color" => 'primary ',
            "icon" => 'icon-pencil',
        ];
        $btn[] = [
            "fn" => 'printSubreceta',
            "color" => 'success ',
            "icon" => 'icon-print',
        ];

        $SubC = $obj->GET_SUB([$key['id_Subclasificacion']]);
        $opc = 0;
        if ($SubC == 'DESCONTINUADO') {
            $opc = 1;
        }
        $__row[] = array(
            'id' => $key['id'],
            'name' => $key['valor'],
            'id_Subclasificacion' => $SubC . '',
            'rendimiento' => $key['rendimiento'],
            'costo' => $key['neto'],
            'precioUnidad' => $key['precio'],
            'mc' => $key['unidad'],
            'porc' => $key['unidad'],
            "btn" => $btn,
        );
    }
    #encapsular datos
    $encode = [
        "thead" => $th,
        "row" => $__row
    ];
    return $encode;
}

function tbDataRecetasIngredientes($obj)
{
    $__row = [];
    $ls = $obj->lsRecetasIngredientes([$_POST['idReceta']]);
    $costo_total = 0;
    foreach ($ls as $key) {
        $costo_total += $key['costo'];
        $val = $key['cantidad'] != null ? $key['cantidad'] : '';
        $btn = [];
        
        
        $btn[] = [
            "fn" => "modalEditIngrediente(" . $key['id'] . ", event)",
            "color" => 'primary',
            "icon" => 'icon-eye',
        ];
        $btn[] = [
            "fn" => "deleteRecetasIngredientes(this," . $_POST['idReceta'] . ", " . $key['id'] . ", '#tbRecetasIng', '#lblTotalRecetaIng', '#lblTotalCostoRecetaIng')",
            "color" => 'danger',
            "icon" => 'icon-cancel',
        ];
        $cantidad = [];
        $cantidad[] = [
            "id" => $key['id'],
            "val" => $key['cantidad'],
            "name" => "cantidad",
            "value" => $val,
            "id_row" => 'id_Ingrediente',
            "tipo" => "cifra",
        ];

        $__row[] = array(
            'id' => $key['id'],
            'nombre' => $key['valor'],
            'unidad' => $key['unidad'],
            'cantidad' => $cantidad,
            'precioUnidad' => $key['precioUnidad'],
            'costo' => $key['costo'],
            "btn_personalizado" => $btn,
        );
    }
    $html = "<div class='row mt-3 mt-md-0'>
                <div class = 'col-12'>
                    <button class = 'btn btn-success mb-1 hide' id = 'addRecetasIng' onclick = 'openForm(\"#formAddRecetasIng\", \"#contentTableRecetasIng\", \"#addRecetasIng\")'>
                        <i class = 'icon-plus'></i>
                    </button>
                    <div class = 'd-flex justify-content-between'>
                        <label class = 'fw-bold'>Ingredientes: #<span id='lblTotalRecetaIng'>" . count($ls) . "</span></label>
                        <label class = 'fw-bold'>Total costo: $<span id='lblTotalCostoRecetaIng'>" . $costo_total . "</label>
                    </div>
                </div>
            </div>";
    #encapsular datos
    return [
        "frm_head" => $html,
        "thead" => ['Ingrediente', 'Unidad', 'Cantidad', 'P.Unidad', 'Costo', 'Opciones'],
        "row" => $__row
    ];
}

function tbDataRecetasSubRecetas($obj, $calculo)
{
    $__row = [];
    $ls = $obj->lsRecetasSubRecetas([$_POST['idReceta']]);

    $costo_total = 0;
    foreach ($ls as $key) {
        $val = $key['cantidad'] != null ? $key['cantidad'] : '';
        $btn = [];
        $btn[] = [
            "fn" => "deleteRecetasSubRecetas(this," . $_POST['idReceta'] . ", " . $key['id'] . ", '#tbRecetasSub', '#lblTotalRecetaSub', '#lblTotalCostoRecetaSub')",
            "color" => 'danger',
            "icon" => 'icon-cancel',
        ];
        $cantidad = [];
        $cantidad[] = [
            "id" => $key['id'],
            "val" => $key['cantidad'],
            "name" => "cantidad",
            "value" => $val,
            "id_row" => 'id_Subreceta',
            "tipo" => "cifra",
        ];

        $SUB = $calculo->totalSubreceta($key['id']);
        $Punidad = $SUB['totalSubreceta'] / $key['rendimiento'];
        $costo = $Punidad * $key['cantidad'];
        $costo_total += $costo;
        $__row[] = array(
            'id' => $key['id'],
            'nombre' => $key['valor'],
            'unidad' => $key['unidad'],
            'cantidad' => $cantidad,
            'precioUnidad' => evaluar($Punidad),
            'costo' => evaluar($costo),
            "btn_personalizado" => $btn,
        );
    }
    $html = "<div class='row mt-3 mt-md-0'>
                <div class = 'col-12'>
                    <button class = 'btn btn-success mb-1 hide' id = 'addRecetasSub' onclick = 'openForm(\"#formAddRecetasSub\", \"#contentTableRecetasSub\", \"#addRecetasSub\")'>
                        <i class = 'icon-plus'></i>
                    </button>
                    <div class = 'd-flex justify-content-between'>
                        <label class = 'fw-bold'>Subrecetas: #<span id='lblTotalRecetaSub'>" . count($ls) . "</span></label>
                        <label class = 'fw-bold'>Total costo:<span id='lblTotalCostoRecetaSub'>" . evaluar($costo_total) . "</span></label>
                    </div>
                </div>
            </div>";
    #encapsular datos
    return [
        "frm_head" => $html,
        "thead" => ['SubReceta', 'Unidad', 'Cantidad', 'P.Unidad', 'Costo', 'Opciones'],
        "row" => $__row
    ];
}


function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

echo json_encode($encode);
?>