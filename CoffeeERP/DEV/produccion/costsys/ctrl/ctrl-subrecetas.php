<?php
if (empty($_POST['opc']))
    exit(0);

require_once ('../mdl/mdl-subrecetas.php');
$obj = new Subrecetas;
require_once ('../../../conf/_Utileria.php');
$util = new Utileria;
require_once ('../mdl/mdl-calculo.php'); // Libreria para calculo de costos
$calculo = new aux_cp;

$encode = [];
switch ($_POST['opc']) {
    // SUBRECETA ------------------------------------------------------------------
    // Tabla principal de subrecetas
    case 'tbSubReceta':
        $th = [
            'Subreceta',
            'Total Ing.',
            'Rendimiento',
            'Costo',
            'MC',
            'Porcentaje Costo',
            'Opciones'
        ];
        $encode = tbDataSubRecetas($obj, $calculo);

        break;

    // Crear subreceta
    case 'createSubReceta':
        $array = array();
        foreach ($_POST as $key => $value) {
            if ($key != 'opc' && $key != 'id')
                if ($value != '' && $value != '0' && $value != null) {
                    $array[$key] = $value;
                }
        }
        $encode = $obj->createSubReceta($util->sql($array));
        break;
    // Actualizar subreceta
    case 'updateSubReceta':
        $encode = $obj->updateSubReceta($util->sql($_POST, 1));
        break;

    // Validar subreceta
    case 'validateSubReceta':
        $encode = $obj->validateSubReceta($_POST['nombre'], $_POST['udn']);
        break;

    // SUBRECETA-INGREDIENTE --------------------------------------------------------
    // Tabla ingredientes para subreceta
    case 'tbSubRecetaIngrediente':
        $encode = tbDataSubrecetaIngrediente($obj);
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
        $encode = tbDataSubRecetaSubReceta($obj);
        break;

    // Crear subreceta-subreceta
    case 'createSubRecetaSubReceta':
        $arreglo = [$_POST['id_Subreceta2'], $_POST['id_Subreceta1']];
        $exist = $obj->existSubRecetaSubReceta($arreglo);
        $ok = false;
        $msg = 'La subreceta ya existe en la receta';
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
}

function tbDataSubRecetas($obj, $calculo)
{
    $idClasificacion = $_POST['cbClasificacion'];
    $__row = [];
    $ls = $obj->lsSubRecetas([$idClasificacion]);

    foreach ($ls as $key) {
        $btn = [];
        $btn[] = [
            "fn" => 'editSubRecetaInterface',
            "color" => 'primary ',
            "icon" => 'icon-pencil',
        ];

        $btn[] = [
            "fn" => 'printSubreceta',
            "color" => 'success ',
            "icon" => 'icon-print',
        ];

        /*--    Aplicar formulas para calcular el costo -- */
        $subreceta = $calculo->totalSubreceta($key['id']);
        $total = $subreceta['totalSubreceta'];

        $rendimiento = $key['rendimiento'];
        // $precioVenta     = $key['precioVenta'];
        $porcentajeCosto = 0;

        $costo = $total / $rendimiento;
        $precioVenta = $costo;
        $mc = $precioVenta - $costo;

        if ($precioVenta != 0) {
            $porcentajeCosto = ($costo / $precioVenta) * 100;
        }

        $precioVenta = $costo;
        $__row[] = array(
            'id' => $key['id'],
            'Fecha' => $key['fecha'],
            'SubReceta' => $key['subreceta'],
            'Total Ing.' => evaluar($subreceta['TotalIngredientesSubreceta']),
            'rendimiento' => $rendimiento,
            'costo' => evaluar($costo),


            'mc' => evaluar($mc),
            '% costo' => $porcentajeCosto . ' %',
            "btn" => $btn

        );
    }

    #encapsular datos
    $encode = [
        "thead" => '',
        "row" => $__row,
        // "contar" => $contar
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
            "fn" => "modalEditIngrediente(" . $key['id'] . ", event)",
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
            'precioUnidad' => $key['precioUnidad'],
            'costo' => $key['costo'],
            "btn_personalizado" => $btn,
        );
    }
    $html = "<div class='row mt-3 mt-md-0'>
                <div class = 'col-12'>
                    <button class = 'btn btn-success mb-1 hide' id = 'addSubRecetasIng' onclick = 'openForm(\"#formAddSubRecetasIng\", \"#contentTableSubRecetasIng\", \"#addSubRecetasIng\")'>
                        <i class = 'icon-plus'></i>
                    </button>
                    <div class = 'd-flex justify-content-between'>
                        <label class = 'fw-bold'>Ingredientes: #<span id='lblTotalSubRecetaIng'>" . count($ls) . "</span></label>
                        <label class = 'fw-bold'>Total costo: $<span id='lblTotalCostoSubRecetaIng'>" . $costo_total . "</label>
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

function tbDataSubRecetaSubReceta($obj)
{
    $__row = [];
    $ls = $obj->lsSubRecetaSubReceta([$_POST['idSubReceta']]);

    $costo_total = 0;
    foreach ($ls as $key) {
        $costo_total += $key['costo'];
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
            "id_row" => 'id_Subreceta',
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
                    <button class = 'btn btn-success mb-1 hide' id = 'addSubRecetasSub' onclick = 'openForm(\"#formAddSubRecetasSub\", \"#contentTableSubRecetasSub\", \"#addSubRecetasSub\")'>
                        <i class = 'icon-plus'></i>
                    </button>
                    <div class = 'd-flex justify-content-between'>
                        <label class = 'fw-bold'>Subrecetas: #<span id='lblTotalSubRecetaSub'>" . count($ls) . "</span></label>
                        <label class = 'fw-bold'>Total costo: $<span id='lblTotalCostoSubRecetaSub'>" . $costo_total . "</span></label>
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


// Funciones auxiliares
function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}
function formatSpanishDate($fecha = null)
{
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    $formatoFecha = " %d/%b/%Y"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}
echo json_encode($encode);
?>