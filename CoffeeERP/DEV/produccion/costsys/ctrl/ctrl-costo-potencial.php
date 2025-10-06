<?php
if (empty($_POST['opc']))
    exit(0);


require_once ('../mdl/mdl-costo-potencial.php');
$obj = new Costopotencial;
$tablero = new TableroControl;

/*--  Librerias para el calculo del costsys -- */
require_once ('../mdl/mdl-costsys.php');
$sub = new sub;

require_once ('../mdl/mdl-calculo.php');

require_once ('../../../conf/_Utileria.php');
$util = new Utileria;


$encode = [];
switch ($_POST['opc']) {

    case 'initComponents':

        $lsUDN              = $obj-> lsUDN();
        $lsClasificacion    = $obj-> lsClasificacion();
        $lsSubClasificacion = $obj-> lsSubClasificacion();

        $encode = [

            'lsUDN'              => $lsUDN,
            'lsClasificacion'    => $lsClasificacion,
            'lsSubClasificacion' => $lsSubClasificacion
        ];

    break;

    case 'listUDN':

        $encode = $obj->lsUDN();
    break;

    case 'lsCostoPotencial':
        // $encode = lsCostoPotencial($obj);
        $encode = listCostoPotencial($obj);
    break;

    case 'lsClase':
        $encode = $obj->lsClase([$_POST['UDN']]);
        break;

    case 'iptPrecioPropuesto':

        $values = [
            'precio_propuesto'          => $_POST['precio_propuesto'],
            'ventasestimadas_propuesto' => $_POST['ventasestimadas_propuesto'],
            'costoestimado_propuesto'   => $_POST['costoestimado_propuesto'],
            'mcestimado_propuesto'      => $_POST['mcestimado_propuesto'],
            'mc_propuesto'              => $_POST['mc_propuesto'],
            'costo_porc_propuesto'      => $_POST['costo_porc_propuesto'],
            'idcostopotencial'          => $_POST['idcostopotencial']
        ];

        $data   = $util->sql($values, 1);


        $ok     = $obj->udpt_precio_propuesto($data);
        $encode = ['ok' => $ok,'data' => $data];
    break;

    case 'setter-desplazamientos':
        setter_desplazamiento($obj);
        break;

    case 'LimpiarPrecioPropuesto':

        $mes              = $_POST['Mes'];
        $year             = $_POST['Anio'];
        $UDN              = $_POST['UDN'];

    
        $idClasificacion  = $_POST['Clasificacion'];
        $subClasificacion = $_POST['Subclasificacion'];
       
        $ok               = $obj -> LimpiarPrecioPropuesto([$year, $mes, $UDN, $_POST['Clasificacion']]);
       

        $encode = ['ok' => $ok];

    break;


    case 'ejercicioMensual':

        $encode = $_POST;
        break;

    case 'lsMensual':
        // se copia las ventas estimadas 
        $encode = ejercicioMensual($obj);

        // $encode = setCostoPotencial($obj);

        break;


    case 'limpiarCostoPotencial':

        $fecha = $_POST['Anio'] . '-' . $_POST['Mes'] . '-01';


        // $obj->limpiarCostoPotencial([
        //     $_POST['UDN'],
        //     $fecha]);    
        break;

    case 'actualizarPrecios':
        $encode = actualizarPrecios($obj);
        break;

    case 'lsTable':
        $encode = calculoTotalCostoPotencial($obj);
        break;


    // Tablero de control:

    case 'lsTableroControl':
        $encode = lsTableroControl($tablero);

    break;

}



function lsTableroControl($obj){
    # Declarar variables
    $udn = $_POST['UDN'];
    $mes = $_POST['Mes'];
    $year = $_POST['Anio'];
    $idClasificacion = $_POST['Clasificacion'];

    $__row = [];

    $data = [
        $udn,
        $idClasificacion,
        $mes,
        $year
    ];

    $tablero = $obj->selectTablero($data);


    // Costo potencial :

    $costoPotencialActual     = $tablero['costoPotencialReal'];
    $costoPotencialPropuesto  = $tablero['costoPotencialPropuesto'];
    $diferenciaCostoPotencial = $costoPotencialActual - $costoPotencialPropuesto;
    //VENTAS ESTIMADAS
    $ventaEstimadaActual     = $tablero['ventaEstimadaReal'];
    $ventaEstimadaPropuesta  = $tablero['ventaEstimadaPropuesta'];
    $diferenciaVentaEstimada = $ventaEstimadaActual - $ventaEstimadaPropuesta;
    //COSTO ESTIMADAS
    $costoEstimadaActual     = $tablero['costoEstimadoReal'];
    $costoEstimadaPropuesta  = $tablero['costoEstimadoPropuesto'];
    $diferenciaCostoEstimada = $costoEstimadaActual - $costoEstimadaPropuesta;
    //VENTAS
    $ventaCosto              = $tablero['ventascosto'];
    $diferenciaVentasCostos  = (($ventaCosto / 100) - ($costoPotencialActual / 100)) * $ventaEstimadaActual;
    $ventasOficial           = $tablero['ventasoficial'];
    $diferenciaVentasOficial = (($ventasOficial / 100) - ($costoPotencialActual / 100)) * $ventaEstimadaActual;

    $countProductos = $obj->countRecetas($udn, $idClasificacion);

    $costoProduccionAlto = $tablero['CostoProduccionAlto'];
    $countPorcentajeCostoAlto = $obj->countPorcentajeCostoAlto($data, $costoProduccionAlto);
    $porcentajeTotalCostoAlto = ($countPorcentajeCostoAlto / $countProductos) * 100;


    $costoProduccionBajo = $tablero['CostoProduccionBajo'];
    $countPorcentajeCostoBajo = $obj->countPorcentajeCostoBajo($data, $costoProduccionBajo);
    $porcentajeTotalCostoBajo = ($countPorcentajeCostoBajo / $countProductos) * 100;




    $mcEstimadoActual    = $tablero['mcEstimadoReal'];
    $mcEstimadoPropuesto = $tablero['mcEstimadoPropuesto'];

    $diferenciaMCEstimado  = $mcEstimadoActual - $mcEstimadoPropuesto;
    // $sumaMC                = $obj->sumaMC($data);
    // $mcPromedio            = $sumaMC / $countProductos;
    $mcAlto                = $tablero['MargenContribucionAlto'];
    $countPorcentajeMCAlto = $obj->countMCAlto($data, $mcAlto);
    $porcentajeTotalMCAlto = ($countPorcentajeMCAlto / $countProductos) * 100;
    
    $mcBajo                = $tablero['MargenContribucionBajo'];
    $countPorcentajeMCBajo = $obj->countMCBajo($data, $mcBajo);
    $porcentajeTotalMCBajo = ($countPorcentajeMCBajo / $countProductos) * 100;




    $desplazamientoPromedio          = $tablero['desplazamientoPromedio'];
    $productosProducidos             = $obj->countProductosProducidos($data);
    $porcentajeProductosProducidos   = ($productosProducidos / $countProductos)*100;
    $productosNoProducidos           = $countProductos - $productosProducidos;
    $porcentajeProductosNoProducidos = ($productosNoProducidos / $countProductos) * 100;

    $ventaPromedioReal       = $ventaEstimadaActual / $productosProducidos;
    $ventaPromedioPropuesto  = $ventaEstimadaPropuesta / $productosProducidos;
    $diferenciaVentaPromedio = $ventaPromedioReal - $ventaPromedioPropuesto;

    $mcPromedioReal       = $mcEstimadoActual / $productosProducidos;
    $mcPromedioPropuesto  = $mcEstimadoPropuesto / $productosProducidos;
    $diferenciaMCPromedio = $mcPromedioReal - $mcPromedioPropuesto;




    $__row = array(


        array(
            'id'         => 0,
            'control'    => 'Costo Potencial',
            'actual'     => evaluar2($tablero['costoPotencialReal']) . ' %',
            'propuesta'  => evaluar2($tablero['costoPotencialPropuesto']) . ' %',
            'diferencia' => evaluar2($diferenciaCostoPotencial),
            "opc"        => 0

        ),

        array(
            'id'         => 0,
            'control'    => 'Ventas estimadas',
            'actual'     => evaluar($tablero['ventaEstimadaReal']),
            'propuesta'  => evaluar($tablero['ventaEstimadaPropuesta']),
            'diferencia' => $diferenciaVentaEstimada,
            'opc'        => 0
        ),

        array(
            'id'         => 0,
            'control'    => 'Costo estimado',
            'actual'     => evaluar($tablero['costoEstimadoReal']),
            'propuesta'  => evaluar($tablero['costoEstimadoPropuesto']),
            'diferencia' => $diferenciaCostoPotencial,
            'opc'        => 0
        ),

        // Separador
        array(
            'id' => 0,
            'control' => ' ',
            "colgroup" => true
        ),

        array(
        'id' => 0,
        'control'    => 'Costo de producción (ventas y costo)',
        'actual'     => inputGroup(['valor' => $ventaCosto]),
        'propuesta'  =>'',
        'diferencia' => evaluar($diferenciaVentasCostos),
        "opc" => 0
        ),

        array(
        'id'         => 0,
        'control'    => 'Costo de ventas oficial',
            'actual' => inputGroup(['valor' => $ventasOficial]),
        'propuesta'  => '',
        'diferencia' => evaluar($diferenciaVentasOficial),
        "opc"        => 0
       ),

 
       array(
        'id'         => 0,
        'control'    => 'Costo de producción alto',
        'actual'     =>inputGroup(['valor' => $costoProduccionAlto]),
        'propuesta'  => evaluar2($countPorcentajeCostoAlto),
        'diferencia' => evaluar2($porcentajeTotalCostoAlto).'%',
        "opc"        => 0
       ),

       array(
        'id'         => 0,
        'control'    => 'Costo de producción bajo',
        'actual'     => inputGroup(['valor' => $costoProduccionBajo]),
        'propuesta'  => evaluar2($countPorcentajeCostoBajo),
        'diferencia' => evaluar2( $porcentajeTotalCostoBajo).' %',
        
        "opc"        => 0
       ),


        // Separador
        array(
            'id' => 0,
            'control' => ' ',
            "colgroup" => true
        ),

        array(
            'id' => 0,
            'control'    => 'Margen de contribución estimado',
            'actual'     => evaluar($mcEstimadoActual),
            'propuesta'  => evaluar($mcEstimadoPropuesto),
            'diferencia' => evaluar($diferenciaMCEstimado),
            "opc" => 0

        ),




        array(
            'id' => 0,
            'control' => 'Margen de contribución promedio',
            'actual' => evaluar($mcPromedioReal),
            'propuesta' => '',
            'diferencia' => '',
            "opc" => 0

        ),

        array(
            'id' => 0,
            'control'    => 'Margen de contribución alto',
            'actual' => inputGroup(['valor' => $mcAlto]),

            'propuesta'  => $countPorcentajeMCAlto,
            'diferencia' => evaluar2($porcentajeTotalMCAlto).' %',
            "opc" => 0

        ),

        array(
            'id' => 0,
            'control'    => 'Margen de contribución bajo',
            'actual' => inputGroup(['valor' => $mcBajo]),
            'propuesta'  => $countPorcentajeMCBajo,
            'diferencia' => evaluar2($porcentajeTotalMCBajo).' %',
            "opc" => 0

        ),
        
        // Separador
        array(
            'id' => 0,
            'control' => ' ',
            "colgroup" => true
        ),

        array(
            'id'         => 0,
            'control'    => 'Desplazamiento promedio',
            'actual'     => number_format($desplazamientoPromedio,2),
            'propuesta'  => '',
            'diferencia' => '',
            'opc'        => 0
        ),

        array(
            'id'         => 0,
            'control'    => 'Cantidad de productos',
            'actual'     => $countProductos,
            'propuesta'  => '',
            'diferencia' => '',
            'opc'        => 0
        ),

        array(
            'id'         => 0,
            'control'    => 'Productos producidos',
            'actual'     => $productosProducidos,
            'propuesta'  => evaluar2($porcentajeProductosProducidos).' %',
            'diferencia' => '',
            'opc'        => 0
        ),

        [
            'id' => 0,
            'control'    => 'Productos no producidos',
            'actual'     => $productosNoProducidos,
            'propuesta'  => evaluar2($porcentajeProductosNoProducidos).' %',
            'diferencia' => '',
            'opc' => 0
        ],

        [
            'id' => 0,
            'control'    => 'Venta promedio por producto',
            'actual'     => evaluar($ventaPromedioReal),
            'propuesta'  => evaluar($ventaPromedioPropuesto),
            'diferencia' => $diferenciaVentaPromedio,
            'opc' => 0
        ],

        [
            'id'         => 0,
            'control'    => 'Margen de contribución promedio por producto',
            'actual'     => evaluar($mcPromedioReal),
            'propuesta'  => evaluar($mcPromedioPropuesto),
            'diferencia' => evaluar($diferenciaMCPromedio),
            'opc'        => 0
        ],


      


    );




    // Margen de contribucion :

    // $__row[] = 



    #encapsular datos
    return [
        "thead" => ['control', 'actual', 'propuesta', 'diferencia'],
        "row" => $__row
    ];
}

function inputGroup($data = []){
    return '
    <div class="input-group input-group-sm ">
    <input type="text" class="form-control fw-bold text-primary text-end" placeholder="0.00" value="' . $data['valor'] . '" >
    <span class="input-group-text fw-bold" id="basic-addon1"> %</span>
    </div>
    
    ';
}



function setCostoPotencial($obj)
{
    $calculo = new aux_cp;

    # Declarar variables
    $__row = [];
    $mes = $_POST['Mes'];
    $year = $_POST['Anio'];
    $idClasificacion = $_POST['Clasificacion'];
    $subClasificacion = $_POST['Subclasificacion'];


    //-- Costo Potencial -- 

    if ($subClasificacion) {
        $productos = $obj->lsCostoPotencialSubClasificacion([$mes, $year, $subClasificacion]);

    } else {
        $productos = $obj->lsCostoPotencialReceta([$mes, $year, $idClasificacion]);
    }

    foreach ($productos as $_key) { // hacer un update 

        $idCostoPotencial = $_key['idcostopotencial'];



        $costoPotencial = $obj->calculoCostoPotencial([
            'idReceta' => $_key['idReceta'],
            'precioPropuesto' => $_key['precio_propuesto'],
            'iva' => $_key['iva'],
            'ieps' => $_key['ieps'],
            'pVenta' => $_key['precioVenta'],
            'rendimiento' => $_key['rendimiento'],
            'desplazamiento' => $_key['desplazamiento'],

        ], $calculo);




        // $__row[] = array(

        //     'id' => $_key['idReceta'],
        //     'nombre' => $_key['nombre'],
        //     // 'idcostopotencial' => $_key['precio_propuesto'],
        // 'P.propuesto'      => $precio_propuesto,
        // 'p.venta'          => filtro($costoPotencial['pVenta'], ''),
        // 'p.venta sin iva'  => ['class' => ' text-end ' . $bg, 'html' => evaluar($costoPotencial['pVentaIVA'])],
        // 'iva'              => $costoPotencial['impuestos'],
        // 'costo'            => evaluar($costoPotencial['costo']),
        // '% cost'           => ['class' => ' text-end ' . $bgCosto, 'html' => evaluar2($costoPotencial['porcentajeCosto'])],
        // 'mc'               => ['class' => ' text-end ' . $bgMC, 'html' => evaluar2($costoPotencial['mc'])],
        // 'desplazamiento'   => $_key['desplazamiento'],
        // 'ventas estimadas' => ['class' => ' text-end ' . $bg, 'html' => evaluar($costoPotencial['ventasEstimadas'])],
        // 'costo estimado'   => ['class' => ' text-end ' . $bg, 'html' => evaluar($costoPotencial['costoEstimado'])],
        // 'mc estimado'      => ['class' => ' text-end ' . $bg, 'html' => evaluar($costoPotencial['mcEstimado'])],
        // 'opc'              => 0
        // );




        $__row[] = array(

            'id' => $_key['idReceta'],
            'nombre' => $_key['nombre'],
            'margencontribucion' => $_key['mc'],
            'costo_porc' => $costoPotencial['porcentajeCosto'],
            'ventasestimadas' => $costoPotencial['ventasEstimadas'],
            'costoestimado' => $costoPotencial['costoEstimado'],
            'mc_estimado' => $costoPotencial['mcEstimado'],
            'precio_propuesto' => $_key['precio_propuesto'],
            'desplazamiento' => $_key['desplazamiento'],
            'idcostopotencial' => $idCostoPotencial,
            'opc' => 0
        );


        $data = [

            'desplazamiento' => $_key['desplazamiento'],
            'idcostopotencial' => $idCostoPotencial
        ];





        // $ok = $obj->updateDatosCostoPotencial([$idCostoPotencial]);
    }


    return [
        'thead' => '',
        'row' => $__row,
    ];




}

function actualizarPrecios($obj)
{
    $util = new Utileria;

    $mes = $_POST['Mes'];
    $year = $_POST['Anio'];
    $idClasificacion = $_POST['Clasificacion'];

    $__row = [];


    $ls = $obj->lsPrecioPropuesto([$mes, $year, $idClasificacion]);

    foreach ($ls as $key) {

        $data = [
            'precioVenta' => $key['precio_propuesto'],
            'idReceta' => $key['receta'],
        ];

        $rr = $util->sql($data, 1);
        $ok = $obj->updatePrecioReceta($rr);

        $__row[] = array(

            'id' => $key['receta'],
            'idx' => $key['receta'],
            'fecha_costo' => $key['fecha_costo'],
            'receta' => $key['receta'],
            'precio_propuesto' => $key['precio_propuesto'],
            'ok' => $ok,
            'datas' => $rr,
            'opc' => 0

        );

    }

    return [
        "thead" => '',
        "row" => $__row,
    ];


}

function ejercicioMensual($obj)
{
    $util = new Utileria;

    $__row = [];
    $listRecetas = $obj->lsCostoPotencialReceta([$_POST['Mes'], $_POST['Anio'], $_POST['Clasificacion']]);
    $fecha_actual = $_POST['Anio'] . '-' . ($_POST['Mes'] + 1) . '-01';

    $mesProximo = ($_POST['Mes'] + 1);
    $year = $_POST['Anio'];



    $lsCostoPotencial = $obj->GetCostoPotencial([$mesProximo, $year, $_POST['UDN']]);

    $hasCreatedCostoPotencial = false;

    if (!$lsCostoPotencial): // No existe costo potencial: 

        $hasCreatedCostoPotencial = true;

        foreach ($listRecetas as $_key) {

            # ------- [ crear proyeccion de costo potencial ] ------- #

            $data = [

                'idE'              => $_key['idE'],
                'fecha_costo'      => $fecha_actual,
                'id_Clasificacion' => $_key['id_Clasificacion'],
                'receta'           => $_key['idReceta'],
                'precioventa'      => $_key['precioVenta'],
                'iva'              => $_key['iva'],
                'ieps'             => $_key['ieps'],
                'precio_propuesto' => $_key['precio_propuesto'],
                'desplazamiento'   => $_key['desplazamiento']

            ];


            // $paq   = $util ->sql($data);
            // $ok    = $obj ->add_costo_potencial($paq);



            $__row[] = array(

                'id' => $_key['idReceta'],
                'nombre' => $_key['nombre'],
                'fecha' => $fecha_actual,
                'precioventa' => $_key['precioVenta'],
                'iva' => $_key['iva'],
                'ieps' => $_key['ieps'],
                'P.propuesto' => $_key['precio_propuesto'],
                'desplazamiento' => $_key['desplazamiento'],

                'ok' => $ok,
                'opc' => 0
            );

        }


    endif;


    $head = ticket_head([]);

    #encapsular datos
    return [
        'frm_head' => $head,
        "thead" => '',
        "row" => $__row,
        'costoPotencial' => $hasCreatedCostoPotencial
        // "contar" => $contar
    ];

}

function setter_desplazamiento($obj)
{

    $mes = $_POST['Mes'];
    $year = $_POST['Anio'];
    $UDN = $_POST['UDNs'];
    $idClasificacion = $_POST['Clasificacion'];
    $subClasificacion = $_POST['Subclasificacion'];


    $obj->LimpiarPrecioPropuesto([$year, $mes, $UDN]);

}

function lsSubRecetas($obj)
{

    $__row = [];
    $calculo = new aux_cp;
    $ls = $obj->lsSubRecetas([$_POST['Clasificacion']]);

    foreach ($ls as $key) {

        $subreceta = $calculo->totalSubreceta($key['id']);


        $__row[] = array(
            'id' => $key['id'],
            'Fecha' => $key['fecha'],
            'SubReceta' => $key['subreceta'],
            'Total Ing.' => evaluar($subreceta['totalSubreceta']),



            // 'rendimiento' => $rendimiento,
            // 'costo'       => evaluar($costo),


            // 'mc'      => evaluar($mc),
            // '% costo' => $porcentajeCosto . ' %',
            "opc" => 0

        );
    }

    #encapsular datos
    return [
        "thead" => '',
        "row" => $__row,
        // "contar" => $contar
    ];

}

//  Parametros aplicados al costo potencial
function verificarCostoDiferente($costoActual, $costoPotencial){
    $bgCostoDif = '';
    $iconCosto = '';
    $productosModificados = false;

    if (number_format($costoActual, 2) != number_format($costoPotencial, 2)) {
        $bgCostoDif = 'bg-warning-1';
        $productosModificados = true;
        $iconCosto = '<i class="text-danger icon-info-1" ></i>';
    }

    return [
        'bgCostoDif' => $bgCostoDif,
        'iconCosto' => $iconCosto,
        'productosModificados' => $productosModificados
    ];
}

function determinarBgCosto($porcentajeCosto, $costoAlto, $costoBajo)
{
    $bgCosto = '';

    if ($porcentajeCosto >= $costoAlto) {
        $bgCosto = 'bg-danger-light';
    } elseif ($porcentajeCosto <= $costoBajo) {
        $bgCosto = 'bg-success-light';
    }

    return $bgCosto;
}

function determinarBgMC($mcPotencial, $mcAlto, $mcBajo)
{
    $bgMC = '';

    if ($mcPotencial >= $mcAlto) {
        $bgMC = 'bg-success-light';
    } elseif ($mcPotencial <= $mcBajo) {
        $bgMC = 'bg-danger-light';
    }

    return $bgMC;
}


function listCostoPotencial($obj){
    
    // Declarar variables --
    $__row            = [];
    $mes              = $_POST['Mes'];
    $year             = $_POST['Anio'];
    $idClasificacion  = $_POST['Clasificacion'];
    $subClasificacion = $_POST['Subclasificacion'];
    $productosModificados = false;

    $mostrar   = $_POST['mostrar'];

    $calculo  = new aux_cp;
    $CONSULTA = $_POST['Consulta'];

    if ($CONSULTA == 1) {
        $cs = $obj;
    } else {
        $cs = new Costsys;
    }

    //  Variables de tablero de control 

    $tablero = $cs->selectTablero($idClasificacion, $mes, $year);

    $desplazamientoPromedio = 0;
    $costoAlto              = 0;
    $costoBajo              = 0;
    $mcAlto                 = 0;
    $mcBajo                 = 0;


    if (!isset($tablero)) {


    } else {

        $desplazamientoPromedio = $tablero['desplazamientoPromedio'];
        $costoAlto              = $tablero['CostoProduccionBajo'];
        $costoBajo              = $tablero['CostoProduccionAlto'];
        $mcBajo                 = $tablero['MargenContribucionBajo'];
        $mcAlto                 = $tablero['MargenContribucionAlto'];
    }

     // Recorrido de productos por grupos:
    $subClasificacion = $cs -> listSubClasificacion([$idClasificacion]);


    // Agregar la nueva fila al array de subclasificación
    $subClasificacion[] = [
    'id' => 0,
    'nombre' => 'SIN SUBCLASIFICACION'
    ];

    foreach ($subClasificacion as $sub) {

        $__row[] = array(
            'id'       => $sub['id'],
            'nombre'   => $sub['nombre'],
            'colgroup' => true
        );

        // Recorrido de productos en la tabla costo potencial :
        if($sub['id']  != 0):
            $productos = $cs->lsCostoPotencialSubClasificacion([$mes, $year, $sub['id']]);
        else:
            $productos = $cs->lsCostoPotencialReceta([$mes, $year, $idClasificacion]);    
        endif;

        foreach ($productos as $_key) {

            // Aplicar calculo de costo potencial
            $costoPotencial = $cs->aplicarCalculo([
                'idReceta'        => $_key['idReceta'],
                'precioPropuesto' => $_key['precio_propuesto'],
                'iva'             => $_key['iva'],
                'ieps'            => $_key['ieps'],
                'pVenta'          => $_key['precioVenta'],
                'rendimiento'     => $_key['rendimiento'],
                'desplazamiento'  => $_key['desplazamiento'],
            ], $calculo);
            
            // Pintar diferencias costo :
         
            $bgCosto           = verificarCostoDiferente($_key['costo'], $costoPotencial['costo']);
            $bgPorcentajeCosto = determinarBgCosto($costoPotencial['porcentajeCosto'], $costoAlto, $costoBajo);
            $bgMC              = determinarBgMC($costoPotencial['mc'], $mcAlto, $mcBajo);
            $bg                = $_key['precio_propuesto'] ? 'bg-warning-1' : '';

            
            $precio_propuesto = [];
            
            $precio_propuesto = [
                'onclick' => 'precioPropuesto(' . $_key['idcostopotencial'] . ',event)',
                'class'   => 'fw-bold text-end pointer',
                'html'    => ($_key['precio_propuesto'] == 0) ?  '': $_key['precio_propuesto']
            ];


            // Pintar desplazamientos :
            $bgDesplazamiento = '';
            if ($_key['desplazamiento'] >= $desplazamientoPromedio && $_key['desplazamiento'] != 0) {
                $bgDesplazamiento = 'bg-success-light';
            } else if ($_key['desplazamiento'] < $desplazamientoPromedio && $_key['desplazamiento'] != 0) {
                $bgDesplazamiento = 'bg-danger-light';
            }

            // empaquetar información
            
            // if($mostrar == 1 )
            if($_key['desplazamiento'])
            
            
            $__row[] = array(
                'id'               => $_key['idReceta'],
                'nombre'           => ['class' => $bgCosto['bgCostoDif'] ,'html' => $_key['nombre']],
                'P.propuesto'      => $precio_propuesto,


                'p.venta'          => ['class' => $bgCosto['bgCostoDif'], 'html' =>evaluar($costoPotencial['pVenta'])],
                'p.venta sin iva'  => ['class' => $bgCosto['bgCostoDif'].' text-end ' . $bg, 'html' => evaluar($costoPotencial['pVentaIVA'])],
                'costo '           => ['class' => $bgCosto['bgCostoDif'],'html' => '<span class="pointer" title="'.evaluar($costoPotencial['costo']).'"> $ '.number_format($_key['costo'],2). $bgCosto['iconCosto'].' </span> '],
                '% cost'           => ['class' => ' text-end ' . $bgPorcentajeCosto, 'html' => evaluar2($costoPotencial['porcentajeCosto']).' %'],
                'mc'               => ['class' => ' text-end ' . $bgMC, 'html' => evaluar2($costoPotencial['mc'])],
                'desplazamiento'   => ['html'  => $_key['desplazamiento'], 'class' => ' text-end ' . $bgDesplazamiento],
                'ventas estimadas' => ['class' => $bgCosto['bgCostoDif'].' text-end ' . $bg, 'html' => evaluar($costoPotencial['ventasEstimadas'])],
                'costo estimado'   => ['class' => $bgCosto['bgCostoDif'].' text-end ' . $bg, 'html' => evaluar($costoPotencial['costoEstimado'])],
                'mc estimado'      => ['class' => $bgCosto['bgCostoDif'].' text-end ' . $bg, 'html' => evaluar($costoPotencial['mcEstimado'])],
                'opc'              => 0
            );

        }

       


    }

  

    //-- encapsular datos
    return [
        
        "thead" => ['Producto','P.propuesto','P.venta','P.venta sin iva','Costo','Costo %','MC','Desplazamiento','Ventas estimadas','Costo estimado','MC estimado'],
        "row"   => $__row,
        'productosModificados' => $productosModificados
    ];


}




function lsCostoPotencial($obj) {
    $calculo    = new aux_cp;
    $CONSULTA   = $_POST['Consulta'];

    
    if ($CONSULTA == 1) {
        
        $cs = $obj;
    } else {
    
        $cs = new Costsys;
    }



    # Declarar variables
    $__row = [];
    $mes              = $_POST['Mes'];
    $year             = $_POST['Anio'];
    $idClasificacion  = $_POST['Clasificacion'];
    $subClasificacion = $_POST['Subclasificacion'];

    $costo_potencial = false;


    $tablero = $cs->selectTablero($idClasificacion, $mes, $year);

    $desplazamientoPromedio = 0;
    $costoAlto = 0;
    $costoBajo = 0;
    $mcAlto = 0;
    $mcBajo = 0;


    if (!isset($tablero)) {

    } else {

        $desplazamientoPromedio = $tablero['desplazamientoPromedio'];
        $costoAlto              = $tablero['CostoProduccionBajo'];
        $costoBajo              = $tablero['CostoProduccionAlto'];
        $mcBajo                 = $tablero['MargenContribucionBajo'];
        $mcAlto                 = $tablero['MargenContribucionAlto'];
    }


    //-- Costo Potencial -- 

    if ($subClasificacion) {
        $productos = $cs->lsCostoPotencialSubClasificacion([$mes, $year, $subClasificacion]);

    } else {
        $productos = $cs->lsCostoPotencialReceta([$mes, $year, $idClasificacion]);
    }

    foreach ($productos as $_key) {

        // if($_key['desplazamiento'] ):

        $costoPotencial = $cs->aplicarCalculo([
            'idReceta' => $_key['idReceta'],
            'precioPropuesto' => $_key['precio_propuesto'],
            'iva' => $_key['iva'],
            'ieps' => $_key['ieps'],
            'pVenta' => $_key['precioVenta'],
            'rendimiento' => $_key['rendimiento'],
            'desplazamiento' => $_key['desplazamiento'],

        ], $calculo);


        // #   -- Calculo propuesto --

        $bgCosto = '';

        if ($costoPotencial['porcentajeCosto'] >= $costoAlto) {

            $bgCosto = 'bg-danger-light';

        } else if ($costoPotencial['porcentajeCosto'] <= $costoBajo) {

            $bgCosto = 'bg-success-light';
        }

        $bgMC = '';
        if ($costoPotencial['mc'] >= $mcAlto) {
            $bgMC = 'bg-success-light';
        } else if ($costoPotencial['mc'] <= $mcBajo) {
            $bgMC = 'bg-danger-light';
        }

        // Pintar desplazamientos :

        $bgDesplazamiento = '';

        if ($_key['desplazamiento'] >= $desplazamientoPromedio && $_key['desplazamiento'] != 0) {

            $bgDesplazamiento = 'bg-success-light';
        } else if ($_key['desplazamiento'] < $desplazamientoPromedio && $_key['desplazamiento'] != 0) {

            $bgDesplazamiento = 'bg-danger-light';
        }


        $bg = '';
        if ($_key['precio_propuesto'])
            $bg = 'bg-warning-1';



        $precio_propuesto = [];

        $precio_propuesto = [

            'onclick' => 'precioPropuesto(' . $_key['idcostopotencial'] . ',event)',
            'class'   => 'fw-bold bg-default text-end pointer',
            'style'   => 'font-size:14px;',
            'html'    => $_key['precio_propuesto']

        ];


        $__row[] = array(

            'id'          => $_key['idReceta'],
            'nombre'      => $_key['nombre'],
            'P.propuesto' => $precio_propuesto,

            'p.venta'         => evaluar($costoPotencial['pVenta']),
            'p.venta sin iva' => ['class' => ' text-end ' . $bg, 'html' => evaluar($costoPotencial['pVentaIVA'])],
            'iva'             => $costoPotencial['impuestos'],
            'costo'           => evaluar($costoPotencial['costo']),

            '% cost'         => ['class' => ' text-end ' . $bgCosto, 'html' => evaluar2($costoPotencial['porcentajeCosto'])],
            'mc'             => ['class' => ' text-end ' . $bgMC, 'html' => evaluar2($costoPotencial['mc'])],
            'desplazamiento' => ['html' => $_key['desplazamiento'], 'class' => ' text-end ' . $bgDesplazamiento],

            'ventas estimadas' => ['class' => ' text-end ' . $bg, 'html' => evaluar($costoPotencial['ventasEstimadas'])],
            'costo estimado'   => ['class' => ' text-end ' . $bg, 'html' => evaluar($costoPotencial['costoEstimado'])],
            'mc estimado'      => ['class' => ' text-end ' . $bg, 'html' => evaluar($costoPotencial['mcEstimado'])],
            'opc'              => 0
        );

        // endif;


    }




    //    endif;



    #encapsular datos
    $encode = [
        "thead" => '',
        "row" => $__row,
        "frm_head" => $tablero,
        'productos' => [$mes, $year, $idClasificacion]
    ];

    return $encode;

}

function calculoTotalCostoPotencial($obj){

    // if ($_POST['Consulta']== 1) {
        $cs = $obj; // Costo Potencial
    // } else {
    //     $cs = new Costsys;
    // }


    # Declarar variables
    $row = [];
    $mes = $_POST['Mes'];
    $year = $_POST['Anio'];
    $idClasificacion = $_POST['Clasificacion'];

    /* -- Calculo de costo Potencial -- */

    $sumatorias = $cs->selectSumatoriasEstimadas([$idClasificacion, $year, $mes]);

    $contar = count($sumatorias);

    if (isset($sumatorias['ventasestimada']) && $sumatorias['ventasestimada'] != 0) { // ya se agrego a costo potenciañ

        $ventaReal = $sumatorias['ventasestimada'];
        $costoReal = $sumatorias['costoestimado'];
        $mcReal    = $sumatorias['mc_estimado'];
        $cpReal    = ($costoReal / $ventaReal) * 100;
    }


    if (isset($sumatorias['ventasestimadas_propuesto']) && $sumatorias['ventasestimadas_propuesto'] != 0) {
        $ventaPropuesto = $sumatorias['ventasestimadas_propuesto'];
        $costoPropuesto = $sumatorias['costoestimado_propuesto'];
        $mcPropuesto = $sumatorias['mcestimado_propuesto'];
        $cpPropuesto = ($costoPropuesto / $ventaPropuesto) * 100;
    }

    $diferenciaVentas = $ventaPropuesto - $ventaReal;
    $diferenciaCostos = $costoPropuesto - $costoReal;
    $diferenciaMC = $mcPropuesto - $mcReal;


    
    

    $row[] = [
        'id' => '',
        '-' => 'ACTUAL',
        'VENTAS ESTIMADAS' => evaluar($ventaReal),
        'COSTO ESTIMADO' => evaluar($costoReal),
        'MC ESTIMADO' => evaluar($mcReal),
        'opc' => 0
    ];

    $row[] = [
        'id' => '',
        '-' => 'PROPUESTO',
        'VENTAS ESTIMADAS' => evaluar($ventaPropuesto),
        'COSTO ESTIMADO' => evaluar($costoPropuesto),
        'MC ESTIMADO' => evaluar($mcPropuesto),
        'opc' => 0
    ];


    // Diferencia 

    $row[] = [
        'id'               => '',
        '-'                => '<strong> DIFERENCIA </strong>',
        
        'VENTAS ESTIMADAS' => evaluar($diferenciaVentas),
        'COSTO ESTIMADO'   => evaluar($diferenciaCostos),
        'MC ESTIMADO'      => evaluar($diferenciaMC),
        'opc'              => 0
    ];


    $panel = '
    <div class="row">
        <h5 class="col-sm-6 text-center">Actual: '. evaluar2($cpReal).' %</h5>
        <h5 class="col-sm-6 text-center">Propuesto: '. evaluar2($cpPropuesto).' %</h5>
    </div>

    
    ';





    return [
        'frm_head' => $panel,
        'thead'     => '',
        'row'       => $row,
        'frm_foot'  => ticket_head()
    ];


}


function filtro($val, $bg, $opc = 1)
{
    if ($opc == 1):
        return '<div class="' . $bg . '">' . evaluar($val) . '</div>';
    else:
        return '<div class="' . $bg . '">' . evaluar2($val) . ' %</div>';

    endif;
}



function ticket_head()
{

    return '
    <div class="row mb-3" id="gbOpciones">
    
    <div class="col-sm-3 col-12">
        <label>&nbsp;</label>
        <button class="btn btn-outline-primary col-12 btnPermisos" onclick="ejercicioMensual();">Ejercicio Mensual</button>
    </div>
   
    <div class="col-sm-3 col-12">
        <label>&nbsp;</label>
        <button class="btn btn-outline-info col-12 btnPermisos" onclick="preciosPropuestos();">Precio Propuesto</button>
    </div>
    
    <div class="col-sm-3 col-12">
        <label>&nbsp;</label>
        <button class="btn btn-outline-secondary col-12 btnPermisos" onclick="limpiarDesplazamientos();">Limpiar
            Desplazamiento</button>
    </div>

    <div class="col-sm-3 col-12">
        <label>&nbsp;</label>
        <button class="btn btn-outline-success col-12" id="updateListProductos" onclick="updateProductosModificados();">Actualizar productos</button>
    </div>
   
</div>
    ';

}

function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}
function evaluar2($val)
{
    return $val ? '' . number_format($val, 2, '.', ',') : '-';
}

echo json_encode($encode);

