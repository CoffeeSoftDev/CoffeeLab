<?php
if (empty($_POST['opc']))
    exit(0);

require_once ('../mdl/mdl-recetas.php');
$obj = new Recetas;
require_once ('../../conf/_Utileria.php');
$util = new Utileria;
require_once ('../mdl/mdl-calculo.php');
$calculo = new aux_cp;

$encode = [];
switch ($_POST['opc']) {
    // RECETA ------------------------------------------------------------------
    // Tabla principal de recetas
    case 'tbRecetas':
        $encode = tbDataRecetas($obj, $calculo);
        break;

    // Create or Update Vincular SOFT
    case 'vincularSoftReceta':
        $duplicateFound = false;
        $ls = $obj->getRecetasSoft();
        foreach ($ls as $key) {
            if ($key['idreceta'] == $_POST['id_costsys_recetas']) {
                $updateVinculo = $obj->updateRecetaSoft($util->sql($_POST, 1));
                if ($updateVinculo) {
                    $encode = ['idSoft' => $_POST['id_soft_productos'], 'status' => 200, 'message' => 'Vínculo actualizado correctamente.'];
                } else {
                    $encode = ['idSoft' => null, 'status' => 500, 'message' => 'Error al actualizar el vínculo.'];
                }
                $duplicateFound = true;
                break; // Salir del bucle si se encuentra un duplicado
            }
        }
        if (!$duplicateFound) {
            // Crear vínculo
            $createVinculo = $obj->createRecetaSoft($util->sql($_POST));
            if ($createVinculo === true) {
                $encode = ['idSoft' => $_POST['id_soft_productos'], 'status' => 200, 'message' => 'Vinculo creado correctamente.'];
            } else {
                $encode = ['idSoft' => null, 'status' => 500, 'message' => 'Error al crear el vínculo.'];
            }
        }
        break;
    // Create or Update Vincular PRODUCCION
    case 'vincularProduccionReceta':
        $duplicateFound = false;
        $ls = $obj->getProductosFogaza();
        foreach ($ls as $key) {
            if ($key['id'] == $_POST['id_Produccion']) {
                $updateVinculo = $obj->updateHomologado($util->sql($_POST, 1));
                if ($updateVinculo) {
                    $encode = ['idProduccion' => $_POST['id_Produccion'], 'status' => 200, 'message' => 'Vínculo actualizado correctamente.'];
                } else {
                    $encode = ['idProduccion' => null, 'status' => 500, 'message' => 'Error al actualizar el vínculo.'];
                }
                $duplicateFound = true;
                break; // Salir del bucle si se encuentra un duplicado
            }
        }
        if (!$duplicateFound) {
            // Crear vínculo
            $createVinculo = $obj->createHomologado($util->sql($_POST));
            if ($createVinculo === true) {
                $encode = ['idProduccion' => $_POST['id_Produccion'], 'status' => 200, 'message' => 'Vinculo creado correctamente.'];
            } else {
                $encode = ['idProduccion' => null, 'status' => 500, 'message' => 'Error al crear el vínculo.'];
            }
        }
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

        if (isset($idReceta)) {
            if (count($_FILES) > 0) {
                $encode = subir_foto_rec($_FILES['foto'], $idReceta, $obj, $util);
            } else {
                $encode = ['idReceta' => $idReceta];
            }
        } else {
            $encode = ['idReceta' => null];
        }
        break;

    // Actualizar receta
    case 'updateReceta':
        unset($_POST['foto']);
        if ($_POST['id_Subclasificacion'] == 0 || $_POST['id_Subclasificacion'] == null || $_POST['id_Subclasificacion'] == '') {
            unset($_POST['id_Subclasificacion']);
        }
        $result = $obj->updateReceta($util->sql($_POST, 1));

        if (isset($result)) {
            if (count($_FILES) > 0) {
                $encode = subir_foto_rec($_FILES['foto'], $_POST['idReceta'], $obj, $util);
            } else {
                $encode = ['idReceta' => $_POST['idReceta']];
            }
        } else {
            $encode = ['idReceta' => null];
        }
        break;

    // Validar receta
    case 'validateReceta':
        $encode = $obj->validateReceta($_POST['nombre'], $_POST['udn']);
        break;
    // Eliminar foto de subreceta
    case 'deletePhotoReceta':
        $encode = $obj->deletePhotoReceta($util->sql($_POST, 1));
        break;
    // RECETAS-INGREDIENTES -----------------------------------------------------
    // Tabla ingredientes para recetas
    case 'tbRecetasIngredientes':
        $encode = tbDataRecetasIngredientes($obj);
        break;

    // Tabla ingredientes para recetas (show)
    case 'tbRecetasIngredientesShow':
        $encode = tbDataRecetasIngredientesShow($obj);
        break;

    // Crear recetas-ingredientes
    case 'createRecetasIngredientes':
        unset($_POST['opc']);
        $array = array();
        $array2 = array();

        $array = [$_POST['id_Ingredientes'], $_POST['id_Receta']];
        $array2 = ['id_Ingrediente' => $_POST['id_Ingredientes'], 'id_Receta' => $_POST['id_Receta'], 'cantidad' => $_POST['cantidad']];
        // $arreglo = [$_POST['id_Ingredientes'], $_POST['id_Receta']];

        $exist = $obj->existRecetasIngredientes($array);
        $ok = false;
        $msg = 'El ingrediente ya existe en la receta';
        if (!$exist) {
            $ok = $obj->createRecetasIngredientes($util->sql($array2));
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

    // Tabla subrecetas para recetas (show)
    case 'tbRecetasSubRecetasShow':
        $encode = tbDataRecetasSubRecetasShow($obj, $calculo);
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


    // PROCEDIMIENTO CULINARIO --------------------------------------------------
    // Actualizar receta
    case 'procedimientoCulinarioReceta':
        unset($_POST['foto']);
        $encode = $obj->updateReceta($util->sql($_POST, 1));
        break;

    case 'printReceta':
        $encode = printReceta($obj, $calculo);
        break;

}

function subir_foto_rec($file_foto, $idReceta, $obj, $util)
{
    $data = $obj->getRecetaById([$idReceta]);
    // Fijamos la ruta del archivo del costsys
    $destino = "erp_files/costsys/{$data['UDN']}/{$data['clase']}/";
    // Asignamos el nombre nuevo del archivo
    $nombreArchivo = $data['valor'];
    // Obtenemos la extención del archivo
    $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
    // Concatenamos la ruta a guardar en la BD
    $ruta_completa = $destino . $nombreArchivo . '.' . $extension;
    // Guardamos en la BD
    $updateName = $obj->updatePhotoReceta([$ruta_completa, $idReceta]);
    //Subimos el archivo al servidor host
    if ($updateName)
        $util->upload_file($file_foto, '../../../' . $destino, $nombreArchivo);
    // Retornamos el id de la receta y la ruta de la foto
    return [
        'idReceta' => $idReceta,
        'rutaFoto' => $ruta_completa
    ];
}

function tbDataRecetas($obj, $calculo)
{
    # Variables
    $__row = [];
    $__list = [];
    $costo = 0;
    $pvsi = 0;
    $porcentaje = 0;
    $idClasificacion = $_POST['cbClasificacion'];

    # Obtener recetas
    $ls = $obj->getRecetas([$idClasificacion]);

    # Recorrer recetas 
    foreach ($ls as $key) {
        $a = [];
        $a[] = [
            "class" => 'btn btn-sm p-0 me-1 dropdownMenuReceta',
            "html" => '<i class="icon-dot-3 fs-5 text-info"></i>',
            "id" => 'aDropdownReceta' . $key['id'],
            "data-bs-toggle" => 'dropdown',
            "aria-expanded" => 'false',
        ];

        # Obtener subclasificación
        $SubC = $obj->GET_SUB([$key['id_Subclasificacion']]);
        $opc = 0;
        if ($SubC == 'DESCONTINUADO') {
            $opc = 1;
        }

        # Trabajo con cálculo
        $Receta = $calculo->totalReceta($key['id']);
        $totalIng = $Receta['totalReceta'];
        $rendimiento = $key['rendimiento'];

        # Costo de la receta
        if ($rendimiento != 0 && $totalIng > 0) {
            $costo = $totalIng / $rendimiento;
        } else {
            $costo = 0;
        }

        # Precio de venta sin impuestos
        if ($key['iva'] == 0 || $key['iva'] == null) {
            $pvsi = $key['precio'];
        } else {
            $pvsi = $key['precio'] / (($key['iva'] / 100) + 1);
        }

        # Margen de contribución
        $mc = $pvsi - $costo;

        # Porcentaje de costo
        if ($costo > 0.0) {
            $porcentaje = ($costo * 100) / $pvsi;
        } else {
            $porcentaje = 0;
        }


        // Nota: El inge Leo me pidió que validara si la ruta existe y realmente redirige al erp.
        $fotoEdit = $key['foto'] ?  $key['foto'] : 'erp_files/default.png';
        $foto = "<p class='text-center'><i class='icon-camera text-danger'></i></p>";
        if($key['foto'] != null && $key['foto'] != ''){
            $fotoSplit = explode("/", $key['foto']);
            if($fotoSplit[0] == "erp_files"){
                $foto = "<img src='https://www.erp-varoch.com/".$key['foto']."' class='img-fluid rounded-circle' alt='foto' style='max-height: 30px; width: 30px;  height: 30px;'>";
            }else{
                $foto = "<img src='https://www.erp-varoch.com/ERP/".$key['foto']."' class='img-fluid rounded-circle' alt='foto' style='max-height: 30px; width: 30px; height: 30px;'>";
            }
        }

        # Renderizado para editar la receta
        $__list[] = array(
            'id' => $key['id'],
            'valor' => $key['valor'],
            'idsubclasificacion' => $key['id_Subclasificacion'],
            'subclasificacion' => $SubC,
            'idclasificacion' => $key['idclasificacion'],
            'clasificacion' => $key['clasificacion'],
            'rendimiento' => $key['rendimiento'],
            'precio' => $key['precio'],
            'nota' => $key['nota'],
            'observaciones' => $key['observaciones'],
            'iva' => $key['iva'],
            'idudn' => $key['idudn'],
            'foto' => $fotoEdit,
            'totalIng' => number_format($totalIng, 2, '.', ','),
            'costo' => number_format($costo, 2, '.', ','),
            'mc' => number_format($mc, 2, '.', ','),
            'porcentaje' => number_format($porcentaje, 3, '.', ','),
        );

        // 	 Buscar enlace con soft / erp:
        $link = '<span class="text-danger"> No encontrado </span>';
        if ($_POST['cbUDN'] == 6):   // exclusivo fogaza
            $link = $obj->getLinkFogaza([$key['id']]);
        else:
        endif;

        // # Renderizado de la tabla
        $__row[] = array(
            'id' => $key['id'],
            'Edición' => date("Y-m-d", strtotime($key['fecha'])),
            'Receta' => $key['valor'],
            'enlace' => $link[0]['NombreProducto'],
            'sub-categoria' => $SubC . '',
            'Rendimiento' => $key['rendimiento'],
            'Costo' => evaluar($costo),
            'P.Venta' => evaluar($key['precio']),
            'foto' => $foto,
            "a" => $a,
        );
    }

    # Encapsular datos
    $encode = [
        "thead" => '',
        "row" => $__row,
        "lsRecetas" => $__list,
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
            "fn" => "modalEditIngrediente(" . $key['id'] . ", event, 'receta', " . $_POST['idReceta'] . ")",
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
            'precioUnidad' => evaluar($key['precioUnidad']),
            'costo' => evaluar($key['costo']),
            "btn_personalizado" => $btn,
        );
    }
    $html = "<div class='row mt-3 mt-md-0'>
                <div    class = 'col-12'>
                <button class = 'btn btn-success mb-1' id = 'addRecetasIng' onclick = 'openForm(\"#formAddRecetasIng\", \"#contentTableRecetasIng\", \"#addRecetasIng\")'>
                <i      class = 'icon-plus'></i>
                    </button>
                    <div   class = 'd-flex justify-content-between'>
                    <label class = 'fw-bold'>Ingredientes: #<span id = 'lblTotalRecetaIng'>" . count($ls) . "</span></label>
                    <label class = 'fw-bold'>Total costo: $<span id  = 'lblTotalCostoRecetaIng'>" . number_format($costo_total, 2, '.', ',') . "</label>
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

function tbDataRecetasIngredientesShow($obj)
{
    $__row = [];
    $ls = $obj->lsRecetasIngredientes([$_POST['idReceta']]);
    $costo_total = 0;
    foreach ($ls as $key) {
        $costo_total += $key['costo'];

        $__row[] = array(
            'id' => $key['id'],
            'nombre' => $key['valor'],
            'unidad' => $key['unidad'],
            'cantidad' => $key['cantidad'],
            'precioUnidad' => evaluar($key['precioUnidad']),
            'costo' => evaluar($key['costo']),
            'opc' => 0,
        );
    }
    $html = "<div class='row mt-3 mt-md-0'>
                <div class = 'col-12'>
                    <div class = 'd-flex justify-content-between'>
                    <label class = 'fw-bold'>Ingredientes: #<span id = 'lblTotalRecetaIng'>" . count($ls) . "</span></label>
                    <label class = 'fw-bold'>Total costo: $<span id  = 'lblTotalCostoRecetaIng'>" . number_format($costo_total, 2, '.', ',') . "</label>
                    </div>
                </div>
            </div>";
    #encapsular datos
    return [
        "frm_head" => $html,
        "thead" => ['Ingrediente', 'Unidad', 'Cantidad', 'P.Unidad', 'Costo'],
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
            'cantidad' => $cantidad,
            'precioUnidad' => evaluar($Punidad),
            'costo' => evaluar($costo),
            "btn_personalizado" => $btn,
        );
    }
    $html = "<div class='row mt-3 mt-md-0'>
                <div    class = 'col-12'>
                <button class = 'btn btn-success mb-1' id = 'addRecetasSub' onclick = 'openForm(\"#formAddRecetasSub\", \"#contentTableRecetasSub\", \"#addRecetasSub\")'>
                <i      class = 'icon-plus'></i>
                    </button>
                    <div   class = 'd-flex justify-content-between'>
                    <label class = 'fw-bold'>Subrecetas: #<span id  = 'lblTotalRecetaSub'>" . count($ls) . "</span></label>
                    <label class = 'fw-bold'>Total costo: $<span id = 'lblTotalCostoRecetaSub'>" . number_format($costo_total, 2, '.', ',') . "</span></label>
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

function tbDataRecetasSubRecetasShow($obj, $calculo)
{
    $__row = [];
    $ls = $obj->lsRecetasSubRecetas([$_POST['idReceta']]);

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
    $html = "<div class ='row mt-3 mt-md-0'>
                <div class = 'col-12'>
                    <div class = 'd-flex justify-content-between'>
                        <label class = 'fw-bold'>Subrecetas: #<span id  = 'lblTotalRecetaSub'>" . count($ls) . "</span></label>
                        <label class = 'fw-bold'>Total costo: $<span id = 'lblTotalCostoRecetaSub'>" . number_format($costo_total, 2, '.', ',') . "</span></label>
                    </div>
                </div>
            </div>";
    #encapsular datos
    return [
        "frm_head" => $html,
        "thead" => ['SubReceta', 'Unidad', 'Cantidad', 'P.Unidad', 'Costo'],
        "row" => $__row
    ];
}


function printReceta($obj, $calculo)
{
    $dataReceta = $obj->getRecetaById([$_POST['id']]);
    $dataReceta_Ing = $obj->lsRecetasIngredientes([$_POST['id']]);
    $dataReceta_Sub = $obj->lsRecetasSubRecetas([$_POST['id']]);

    $__receta = [];
    $__subreceta = [];
    $__ingrediente = [];
    $totalIng = 0;
    $costo = 0;
    $pvsi = 0;
    $porcentaje = 0;
    $mc = 0;

    // Datos de la receta + procedimiento culinario
    $Receta = $calculo->totalReceta($_POST['id']);
    $totalIng = $Receta['totalReceta'];
    $rendimiento = $dataReceta['rendimiento'];

    // Costo de la receta
    if ($rendimiento != 0 && $totalIng > 0) {
        $costo = $totalIng / $rendimiento;
    } else {
        $costo = 0;
    }

    //Precio de venta sin impuestos de la receta
    if ($dataReceta['iva'] == 0 || $dataReceta['iva'] == null) {
        $pvsi = $dataReceta['precio'];
    } else {
        $pvsi = $dataReceta['precio'] / (($dataReceta['iva'] / 100) + 1);
    }

    // Margen de contribución de la receta
    $mc = $pvsi - $costo;

    // Porcentaje de costo de la receta
    if ($costo > 0.0) {
        $porcentaje = ($costo * 100) / $pvsi;
    } else {
        $porcentaje = 0;
    }

    $__receta = [
        'id' => $dataReceta['id'],
        'nombre' => $dataReceta['valor'],
        'foto' => $dataReceta['foto'],
        'udn' => $dataReceta['UDN'],
        'clase' => $dataReceta['clase'],
        'subclase' => $dataReceta['subclase'],
        'total' => number_format($totalIng, 2, '.', ','),
        'costo' => number_format($costo, 2, '.', ','),
        'rendimiento' => $dataReceta['rendimiento'],
        'precioVenta' => $dataReceta['precio'],
        'impuestos' => $dataReceta['iva'],
        'precioVentaSinImpuestos' => number_format($pvsi, 2, '.', ','),
        'mc' => number_format($mc, 2, '.', ','),
        'porcentaje' => number_format($porcentaje, 3, '.', ','),
        'nota' => nl2br($dataReceta['nota']),
        'observaciones' => $dataReceta['observaciones'],
        'idclasificacion' => $dataReceta['idclasificacion'],
        'idsubclasificacion' => $dataReceta['idsubclasificacion'],
    ];


    // Datos de los ingredientes
    foreach ($dataReceta_Ing as $key) {
        $__ingrediente[] = [
            'nombre' => $key['valor'],
            'unidad' => $key['unidad'],
            'cantidad' => $key['cantidad'],
            'precioUnidad' => evaluar($key['precioUnidad']),
            'costo' => evaluar($key['costo']),
        ];
    }

    // Datos de las subrecetas
    foreach ($dataReceta_Sub as $key) {
        $SUB = $calculo->totalSubreceta($key['id']);
        $Punidad = $SUB['totalSubreceta'] / $key['rendimiento'];
        $Punidad = is_nan($Punidad) || $Punidad === '' ? 0 : $Punidad;
        $costo = $Punidad * $key['cantidad'];
        $costo = is_nan($costo) || $costo === '' ? 0 : $costo;

        $__subreceta[] = [
            'nombre' => $key['valor'],
            'unidad' => $key['unidad'],
            'cantidad' => $key['cantidad'],
            'precioUnidad' => evaluar($Punidad),
            'costo' => evaluar($costo),
        ];
    }
    return [
        // "receta" => $__receta,
        "receta" => $__receta,
        "subreceta" => $__subreceta,
        "ingrediente" => $__ingrediente,
    ];

}

// Funciones auxiliares :
function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

echo json_encode($encode);
?>