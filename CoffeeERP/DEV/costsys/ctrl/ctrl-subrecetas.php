<?php
if (empty($_POST['opc']))
    exit(0);

require_once ('../mdl/mdl-subrecetas.php');
$obj = new Subrecetas;
require_once ('../../conf/_Utileria.php');
$util = new Utileria;
require_once ('../mdl/mdl-calculo.php');
$calculo = new aux_cp;

$encode = [];
switch ($_POST['opc']) {
    // SUBRECETA ------------------------------------------------------------------
    // Tabla principal de subrecetas
    case 'tbSubReceta':
        $encode = tbDataSubRecetas($obj, $calculo);
        break;

    // Crear subreceta
    case 'createSubReceta':
        unset($_POST['foto']);
        $array = array();
        foreach ($_POST as $key => $value) {
            if ($key != 'opc' && $key != 'id')
                if ($value != '' && $value != '0' && $value != null) {
                    $array[$key] = $value;
                }
        }
        $idSubReceta = $obj->createSubReceta($util->sql($array));

        if (isset($idSubReceta)) {
            if (count($_FILES) > 0) {
                $encode = subir_foto_sub($_FILES['foto'], $idSubReceta, $obj, $util);
            } else {
                $encode = ['idSubReceta' => $idSubReceta];
            }
        } else {
            $encode = ['idSubReceta' => null];
        }
        break;

    // Actualizar subreceta
    case 'updateSubReceta':
        unset($_POST['foto']);
        $result = $obj->updateSubReceta($util->sql($_POST, 1));

        if (isset($result)) {
            if (count($_FILES) > 0) {
                $encode = subir_foto_sub($_FILES['foto'], $_POST['idSubreceta'], $obj, $util);
            } else {
                $encode = ['idSubReceta' => $_POST['idSubreceta']];
            }
        } else {
            $encode = ['idSubReceta' => null];
        }
        break;
    // Eliminar subreceta
    case 'deleteSubReceta':
        $encode = $obj->updateSubReceta($util->sql([
            'id_Status' => "0",
            'idSubreceta' => $_POST['idSubreceta']
        ], 1));
        break;
    // Validar subreceta
    case 'validateSubReceta':
        $encode = $obj->validateSubReceta($_POST['nombre'], $_POST['udn']);
        break;

    // Validar subreceta-subreceta
    case 'lsSubrecetaSubreceta':
        $encode = $obj->lsSubRecetaSubReceta([$_POST['idSubreceta']]);
        break;
        
    // Validar subreceta-receta
    case 'lsSubrecetaReceta':
        $encode = $obj->lsSubRecetaReceta([$_POST['idSubreceta']]);
        break;
    // Eliminar foto de subreceta
    case 'deletePhotoSubReceta':
        $encode = $obj->deletePhotoSubReceta($util->sql($_POST, 1));
        break;
    // SUBRECETA-INGREDIENTE --------------------------------------------------------
    // Tabla ingredientes para subreceta
    case 'tbSubRecetaIngrediente':
        $encode = tbDataSubrecetaIngrediente($obj);
        break;

    // Tabla ingredientes para subreceta (show)
    case 'tbSubRecetaShowIngrediente':
        $encode = tbDataSubrecetaShowIngrediente($obj);
        break;

    // Crear subreceta-ingrediente
    case 'createSubRecetaIngrediente':
        $arreglo = [$_POST['id_Ingrediente'], $_POST['id_Subreceta']];
        $exist = $obj->existSubRecetaIngrediente($arreglo);
        $ok = false;
        $msg = 'El ingrediente ya existe en la subreceta';
        if (!$exist) {
            $ok = $obj->createSubRecetaIngrediente($util->sql($_POST));
            $msg = '';
        }
        $encode = [
            'ok' => $ok,
            'msg' => $msg
        ];
        break;

    // Actualizar subreceta-ingrediente
    case 'updateSubRecetaIngrediente':
        $array = $util->sql($_POST, 2);
        $ok = $obj->updateSubRecetaIngrediente($array);
        $encode = ['ok' => $ok];
        break;

    // Eliminar subreceta-ingrediente
    case 'deleteSubRecetaIngrediente':
        $encode = $obj->deleteSubRecetaIngrediente($util->sql($_POST, 2));
        break;

    // SUBRECETA-SUBRECETA --------------------------------------------------------
    // Tabla subrecetas para subreceta
    case 'tbSubRecetaSubReceta':
        $encode = tbDataSubRecetaSubReceta($obj, $calculo);
        break;

    // Tabla subrecetas para subreceta (show)
    case 'tbSubRecetaSubRecetaShow':
        $encode = tbDataSubrecetaSubRecetaShow($obj, $calculo);
        break;

    // Crear subreceta-subreceta
    case 'createSubRecetaSubReceta':
        $arreglo = [$_POST['id_Subreceta2'], $_POST['id_Subreceta1']];
        $exist = $obj->existSubRecetaSubReceta($arreglo);
        $ok = false;
        $msg = 'La subreceta ya existe en la subreceta';
        if (!$exist) {
            $ok = $obj->createSubRecetaSubReceta($util->sql($_POST));
            $msg = '';
        }
        $encode = [
            'ok' => $ok,
            'msg' => $msg
        ];
        break;

    // Actualizar subreceta-subreceta
    case 'updateSubRecetaSubReceta':
        $array = $util->sql($_POST, 2);
        $ok = $obj->updateSubRecetaSubReceta($array);
        $encode = ['ok' => $ok];
        break;

    // Eliminar subreceta-subreceta
    case 'deleteSubRecetaSubReceta':
        $encode = $obj->deleteSubRecetaSubReceta($util->sql($_POST, 2));
        break;

    // PROCEDIMIENTO CULINARIO -----------------------------------------------------
    // Actualizar subreceta
    case 'procedimientoCulinarioSubReceta':
        unset($_POST['foto']);
        $encode = $obj->updateSubReceta($util->sql($_POST, 1));
        break;

    case 'printSubReceta':
        $encode = printSubReceta($obj, $calculo);
        break;
}

function subir_foto_sub($file_foto, $idSubReceta, $obj, $util)
{
    $data = $obj->getSubRecetaById([$idSubReceta]);
    // Fijamos la ruta del archivo del costsys
    $destino = "erp_files/costsys/{$data['UDN']}/{$data['clase']}/";
    // Asignamos el nombre nuevo del archivo
    $nombreArchivo = $data['valor'];
    // Obtenemos la extenci贸n del archivo
    $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    // Concatenamos la ruta a guardar en la BD
    $ruta_completa = $destino . $nombreArchivo . '.' . $extension;
    // Guardamos en la BD
    $updateName = $obj->updatePhotoSubReceta([$ruta_completa, $idSubReceta]);
    //Subimos el archivo al servidor host
    if ($updateName)
        $util->upload_file($file_foto, '../../../' . $destino, $nombreArchivo);
    // Retornamos el id de la receta y la ruta de la foto
    return [
        'idSubReceta' => $idSubReceta,
        'rutaFoto' => $ruta_completa
    ];
}

function tbDataSubRecetas($obj, $calculo)
{
    $idClasificacion = $_POST['cbClasificacion'];
    $__row = [];
    $costo = 0;
    $pvsi = 0;
    $porcentaje = 0;
    $ls = $obj->getSubRecetas([$idClasificacion]);

    foreach ($ls as $key) {
        $a = [];
        $a[] = [
            "class" => 'btn p-0 btn-sm me-1 dropdownMenuSubReceta',
            "html" => '<i class="icon-dot-3 fs-5 text-info"></i>',
            "id" => 'aDropdownSubReceta' . $key['id'],
            "data-bs-toggle" => 'dropdown',
            "aria-expanded" => 'false',
        ];

        /*--    Aplicar formulas para calcular el costo -- */
        $Subreceta = $calculo->totalSubreceta($key['id']);
        $totalIng = $Subreceta['totalSubreceta'];
        $rendimiento = $key['rendimiento'];

        // Costo de la subreceta
        if ($rendimiento != 0 && $totalIng > 0) {
            $costo = $totalIng / $rendimiento;
        } else {
            $costo = 0;
        }

        // Margen de contribución
        $precioVenta = $costo;
        $mc = $precioVenta - $costo;

        // Porcentaje de costo
        $porcentajeCosto = 0;
        if ($precioVenta != 0) {
            $porcentajeCosto = ($costo / $precioVenta) * 100;
        }

        $foto = "<p class='text-center'><i class='icon-camera text-danger'></i></p>";
        if($key['foto'] != null && $key['foto'] != ''){
            $fotoSplit = explode("/", $key['foto']);
            if($fotoSplit[0] == "erp_files"){
                $foto = "<img src='https://www.erp-varoch.com/".$key['foto']."' class='img-fluid rounded-circle' alt='foto' style='max-height: 30px; width: 30px;  height: 30px;'>";
            }else{
                $foto = "<img src='https://www.erp-varoch.com/ERP/".$key['foto']."' class='img-fluid rounded-circle' alt='foto' style='max-height: 30px; width: 30px;  height: 30px;'>";
            }
        }

        $__list[] = array(
            'id' => $key['id'],
            'valor' => $key['valor'],
            'idclasificacion' => $key['idclasificacion'],
            'clasificacion' => $key['clasificacion'],
            'rendimiento' => $key['rendimiento'],
            'precio' => $key['precio'],
            'nota' => $key['nota'],
            'observaciones' => $key['observaciones'],
            'idunidad' => $key['idunidad'],
            'unidad' => $key['unidad'],
            'idudn' => $key['idudn'],
            'foto' => $key['foto'],

            // 'costo' => number_format($costo, 2, '.', ','),
        );
        $__row[] = array(
            'id' => $key['id'],
            'Creación' => date("Y-m-d", strtotime($key['fecha'])),
            'SubReceta' => $key['valor'],
            'Total Ing.' => evaluar($Subreceta['TotalIngredientesSubreceta']),
            'rendimiento' => $rendimiento,
            'costo' => evaluar($costo),
            'foto' => $foto,
            "a" => $a
        );
    }

    # Encapsular datos
    $encode = [
        "thead" => '',
        "row" => $__row,
        "lsSubRecetas" => $__list,
    ];
    return $encode;
}

function tbDataSubrecetaIngrediente($obj)
{
    $__row = [];
    $ls = $obj->lsSubRecetaIngrediente([$_POST['idSubReceta']]);
    $costo_total = 0;
    foreach ($ls as $key) {
        $costo_total += $key['costo'];
        $val = $key['cantidad'] != null ? $key['cantidad'] : '';
        $btn = [];
        $btn[] = [
            "fn" => "modalEditIngrediente(" . $key['id'] . ", event, 'subreceta', " . $_POST['idSubReceta'] . ")",
            "color" => 'primary',
            "icon" => 'icon-eye',
        ];
        $btn[] = [
            "fn" => "deleteSubRecetaIngrediente(this," . $_POST['idSubReceta'] . ", " . $key['id'] . ", '#tbSubRecetasIng', '#lblTotalSubRecetaIng', '#lblTotalCostoSubRecetaIng')",
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
            'precioUnidad' => evaluar($key['precioUnidad']),
            'costo' => evaluar($key['costo']),
            "btn_personalizado" => $btn,
        );
    }
    $html = "<div class='row mt-3 mt-md-0'>
                <div    class = 'col-12'>
                <button class = 'btn btn-success mb-1' id = 'addSubRecetasIng' onclick = 'openForm(\"#formAddSubRecetasIng\", \"#contentTableSubRecetasIng\", \"#addSubRecetasIng\")'>
                <i      class = 'icon-plus'></i>
                    </button>
                    <div   class = 'd-flex justify-content-between'>
                    <label class = 'fw-bold'>Ingredientes: #<span id = 'lblTotalSubRecetaIng'>" . count($ls) . "</span></label>
                    <label class = 'fw-bold'>Total costo: $<span id  = 'lblTotalCostoSubRecetaIng'>" . number_format($costo_total, 2, '.', ',') . "</label>
                    </div>
                </div>
            </div>";
    # Encapsular datos
    return [
        "frm_head" => $html,
        "thead" => ['Ingrediente', 'Unidad', 'Cantidad', 'P.Unidad', 'Costo', 'Opciones'],
        "row" => $__row
    ];
}

function tbDataSubrecetaShowIngrediente($obj)
{
    $__row = [];
    $ls = $obj->lsSubRecetaIngrediente([$_POST['idSubReceta']]);
    $costo_total = 0;
    foreach ($ls as $key) {
        $costo_total += $key['costo'];
        $val = $key['cantidad'] != null ? $key['cantidad'] : '';

        $__row[] = array(
            'id' => $key['id'],
            'nombre' => $key['valor'],
            'unidad' => $key['unidad'],
            'cantidad' => $key['cantidad'], 
            'precioUnidad' => evaluar($key['precioUnidad']),
            'costo' => evaluar($key['costo']),
            'opc' => 0,
            // "btn_personalizado" => $btn,
        );
    }
    $html = "<div class='row mt-3 mt-md-0'>
                <div class = 'col-12'>                   
                    <div   class = 'd-flex justify-content-between'>
                    <label class = 'fw-bold'>Ingredientes: #<span id = 'lblTotalSubRecetaIng'>" . count($ls) . "</span></label>
                    <label class = 'fw-bold'>Total costo: $<span id  = 'lblTotalCostoSubRecetaIng'>" . number_format($costo_total, 2, '.', ',') . "</label>
                    </div>
                </div>
            </div>";
    # Encapsular datos
    return [
        "frm_head" => $html,
        "thead" => ['Ingrediente', 'Unidad', 'Cantidad', 'P.Unidad', 'Costo',],
        "row" => $__row
    ];
}

function tbDataSubRecetaSubReceta($obj, $calculo)
{
    $__row = [];
    $ls = $obj->lsSubRecetaSubReceta([$_POST['idSubReceta']]);

    $costo_total = 0;
    foreach ($ls as $key) {
        // $costo_total += $key['costo'];
        $val = $key['cantidad'] != null ? $key['cantidad'] : '';
        $btn = [];
        $btn[] = [
            "fn" => "deleteSubRecetaSubReceta(this," . $_POST['idSubReceta'] . ", " . $key['id'] . ", '#tbSubRecetasSub', '#lblTotalSubRecetaSub', '#lblTotalCostoSubRecetaSub')",
            "color" => 'danger',
            "icon" => 'icon-cancel',
        ];
        $cantidad = [];
        $cantidad[] = [
            "id" => $key['id'],
            "val" => $key['cantidad'],
            "name" => "cantidad",
            "value" => $val,
            "id_row" => 'id_Subreceta2',
            "tipo" => "cifra",
        ];

        $SUB = $calculo->totalSubreceta($key['id']);
        $rendimiento = $key['rendimiento'];
        if ($rendimiento > 0) {
            $Punidad = $SUB['totalSubreceta'] / $key['rendimiento'];
        } else {
            $Punidad = 0;
        }
        // $Punidad = $SUB['totalSubreceta'] / $key['rendimiento'];
        $Punidad = is_nan($Punidad) || $Punidad === '' ? 0 : $Punidad;
        $costo = $Punidad * $key['cantidad'];
        $costo = is_nan($costo) || $costo === '' ? 0 : $costo;
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
                <button class = 'btn btn-success mb-1' id = 'addSubRecetasSub' onclick = 'openForm(\"#formAddSubRecetasSub\", \"#contentTableSubRecetasSub\", \"#addSubRecetasSub\")'>
                <i class = 'icon-plus'></i>
                    </button>
                    <div class = 'd-flex justify-content-between'>
                        <label class = 'fw-bold'>Subrecetas: #<span id  = 'lblTotalSubRecetaSub'>" . count($ls) . "</span></label>
                        <label class = 'fw-bold'>Total costo: $<span id = 'lblTotalCostoSubRecetaSub'>" . number_format($costo_total, 2, '.', ',') . "</span></label>
                    </div>
                </div>
            </div>";
    # Encapsular datos
    return [
        "frm_head" => $html,
        "thead" => ['SubReceta', 'Unidad', 'Cantidad', 'P.Unidad', 'Costo', 'Opciones'],
        "row" => $__row
    ];
}

function tbDataSubRecetaSubRecetaShow($obj, $calculo)
{
    $__row = [];
    $ls = $obj->lsSubRecetaSubReceta([$_POST['idSubReceta']]);

    $costo_total = 0;
    foreach ($ls as $key) {
        $SUB = $calculo->totalSubreceta($key['id']);
        $rendimiento = $key['rendimiento'];
        if ($rendimiento > 0) {
            $Punidad = $SUB['totalSubreceta'] / $key['rendimiento'];
        } else {
            $Punidad = 0;
        }
       
        $Punidad = is_nan($Punidad) || $Punidad === '' ? 0 : $Punidad;
        $costo = $Punidad * $key['cantidad'];
        $costo = is_nan($costo) || $costo === '' ? 0 : $costo;
        $costo_total += $costo;


        $__row[] = array(
            'id' => $key['id'],
            'nombre' => $key['valor'],
            'unidad' => $key['unidad'],
            'cantidad' => $key['cantidad'],
            'precioUnidad' => evaluar($Punidad),
            'costo' => evaluar($costo),
            'opc' => 0,
        );
    }
    $html = "<div class='row mt-3 mt-md-0'>
                <div class = 'col-12'>
                    <div   class = 'd-flex justify-content-between'>
                        <label class = 'fw-bold'>Subrecetas: #<span id  = 'lblTotalSubRecetaSub'>" . count($ls) . "</span></label>
                        <label class = 'fw-bold'>Total costo: $<span id = 'lblTotalCostoSubRecetaSub'>" . number_format($costo_total, 2, '.', ',') . "</span></label>
                    </div>
                </div>
            </div>";
    # Encapsular datos
    return [
        "frm_head" => $html,
        "thead" => ['SubReceta', 'Unidad', 'Cantidad', 'P.Unidad', 'Costo'],
        "row" => $__row
    ];
}

function printSubReceta($obj, $calculo)
{
    $dataSubreceta = $obj->getSubRecetaById([$_POST['id']]);
    $dataSubreceta_Ing = $obj->lsSubRecetaIngrediente([$_POST['id']]);
    $dataSubreceta_Sub = $obj->lsSubRecetaSubReceta([$_POST['id']]);

    $__subreceta1 = [];
    $__subreceta2 = [];
    $__ingrediente = [];

    # Subreceta
    $__subreceta1 = [
        'id' => $_POST['id'],
        'nombre' => $dataSubreceta['valor'],
        'nota' => $dataSubreceta['nota'],
        'foto' => $dataSubreceta['foto'],
        'rendimiento' => $dataSubreceta['rendimiento'],
        'idclasificacion' => $dataSubreceta['idclasificacion'],
        'clasificacion' => $dataSubreceta['clase'],
        'observaciones' => $dataSubreceta['observaciones'],
        'udn' => $dataSubreceta['udn'],
        'unidad' => $dataSubreceta['unidad'],
    ];

    # Subreceta-Ingrediente
    foreach ($dataSubreceta_Ing as $key) {
        $__ingrediente[] = [
            'id' => $key['id'],
            'nombre' => $key['valor'],
            'unidad' => $key['unidad'],
            'cantidad' => $key['cantidad'],
        ];
    }

    # Subreceta-Subreceta
    foreach ($dataSubreceta_Sub as $key) {
        $__subreceta2[] = [
            'id' => $key['id'],
            'nombre' => $key['valor'],
            'unidad' => $key['unidad'],
            'cantidad' => $key['cantidad'],
        ];
    }

    # Encapsular datos
    return [
        "subreceta1" => $__subreceta1,
        "subreceta2" => $__subreceta2,
        "ingrediente" => $__ingrediente,
    ];
}


// Funciones auxiliares
function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

echo json_encode($encode);
?>