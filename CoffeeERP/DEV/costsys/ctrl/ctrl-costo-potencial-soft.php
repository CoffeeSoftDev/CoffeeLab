<?php
if (empty($_POST['opc']))
    exit(0);

// incluir modelo
require_once ('../mdl/mdl-costo-potencial.php');
require_once ('../mdl/mdl-calculo.php');
require_once ('../../conf/_Utileria.php');


class ctrl extends SoftRestaurant{

    public $util;

    public function __construct() {
        parent::__construct(); // Llama al constructor de la clase padre
        $this->util = new Utileria();
    }

    // actualizacion de desplazamiento
    public function updateDesplazamiento(){
        # Declarar variables
        $__row                  = [];
        $__rowNotFound          = [];
        $mes                    = $_POST['Mes'];
        $year                   = $_POST['Anio'];
        $udns                   = $_POST['UDNs'];
        $clasificacion          = $_POST['Clasificacion'];

        $th = ['Fecha', 'Producto', 'Enlace', 'Desplazamiento', 'Costo', 'Estatus'];

         #Consultar a la base de datos
        $isData = $this->getCostoPotencialAll([$mes, $year, $udns]);

        if (count($isData)): // Existe costo potencial : actualiza desplazamiento.

        //     //  $isCreateCostoPotencial = 1;

             if ($_POST['UDNs'] == 6): // Pertenece a la UDN 6

             else:

        //     //     $data = $this->SubirCostoPotencialUDNs();

        //     //     $__row = $data['row'];
        //     //     // $__rowNotFound = $data['rowNotFound'];
             endif;

        //     // lsUploadUdns



            $message = '
                <div>
                 <i class=" icon-arrows-ccw text-success"></i>
                 <i class=" icon-database-1 text-primary"></i> Se actualizo el desplazamiento.
                </div>';



       else:  // 📜 **Crear todo desde cero.**

        // 📜 **Preparar tablero de CostSys.**

        $this->createListCostoPotencial();

        // 📜 **Añadir desplazamientos.**
        if ($_POST['UDNs'] == 6):  // 🔵 Pertenece a la UDN 6

            $th    = '';
            $data  = $this->subirCostoPotencialFogaza();
            $__row = $data['row'];

        else:   // 🔵 Pertenece a cualquier unidad de negocio

            $data  = $this->SubirCostoPotencialUDNs();
            $__row = $data['row'];

              // 📌 **Código comentado para futura referencia**
              // $__rowNotFound = $data['rowNotFound'];
              // $notFound = [
              //     'thead' => $th,
              //     'row' => $__rowNotFound,
              // ];
        endif;

            $message = '
            <div class = "py-2">
            <i   class = "icon-ok-1 text-success"></i>
            <i   class = "icon-database-1 text-primary"></i>
                Se creó un nuevo costo potencial.
            </div>';

        endif;

        #encapsular datos
        return [
            'frm_head' => $message,
            "thead"    => $th,
            "row"      => $__row,
            'isData'   => $isData,
            ];


    }

     public function createListCostoPotencial() {

        $mes = $_POST['Mes'];
        $year = $_POST['Anio'];
        $udns = $_POST['UDNs'];
        $clasificacion = $_POST['Clasificacion'];



          // Librerias
        $util    = new Utileria;
        $calculo = new aux_cp;
        $__row   = [];

        $fecha   = $year . '-' . $mes . '-01';
        $date    = date('Y-m-d', strtotime($fecha));



        $lsRecetas = $this->lsRecetas([$udns]);

        foreach ($lsRecetas as $key) {

            $sub = $this -> GET_SUB([$key['id_Subclasificacion']]);

            if ($sub != 'DESCONTINUADO' && $sub != 'DESCONTINUADOS'):

                $costoPotencial = $this->calculoCostoPotencial([

                    'idReceta'        => $key['idReceta'],
                    'precioPropuesto' => '0',
                    'costo'           => '',
                    'iva'             => $key['iva'],
                    'ieps'            => $key['ieps'],
                    'pVenta'          => $key['pventa'],
                    'rendimiento'     => $key['rendimiento'],
                    'desplazamiento'  => 0,

                ], $calculo);

                $data = [

                    'idE'              => $udns,
                    'fecha_costo'      => $date,
                    'id_Clasificacion' => $key['id_Clasificacion'],
                    'receta'           => $key['idReceta'],

                    'precioventa' => $key['pventa'],
                    'iva'         => $key['iva'],
                    'ieps'        => $key['ieps'],

                    'costo'              => $costoPotencial['costo'],
                    'costo_porc'         => $costoPotencial['porcentajeCosto'],
                    'margencontribucion' => $costoPotencial['mc'],

                ];

                $paq = $util->sql($data);

                if ($_POST['subir'] == '1') {

                    $ok = $this->add_costo_potencial($paq);

                    $message = '
                    <div class="display my-1">
                        <span class="
                            bg-green-100 text-green-600 text-[.7rem] font-semibold
                            px-3 py-1 rounded-lg border border-green-500">

                            Agregado
                        </span>
                    </div> ';

                } else {

                    $message = '
                    <div class="display my-1">
                        <span class="bg-slate-100 text-slate-600 text-[.7rem] font-semibold
                            px-3 py-1 rounded-lg border border-slate-500">

                            No se actualizo
                        </span>
                    </div> ';

                }

                $__row[] = array(

                    'id'                      => $key['idReceta'],
                    formatSpanishDate($fecha) => $key['receta'],
                    'sub-categoria'           => $sub,
                    'clasificacion'           => $key['clasificacion'],
                    'precioventa'             => $key['pventa'],
                    'costo'                   => ['class' => 'bg-default text-end', 'html' => number_format($costoPotencial['costo'], 4, '.', ',')],
                    '% Costo'                 => ['class' => 'bg-default text-end', 'html'  => number_format($costoPotencial['porcentajeCosto'], 4, '.', ',') . ' %'],
                    // 'ok'                      => $ok,
                    'data'                    =>  $message,
                    'opc'                     => 0,
                );

            endif;

        }

        return $__row;

    }


    // old actualizar desplazamiento.

    function subirDesplazamientos(){

        # Declarar variables
        $__row         = [];
        $__rowNotFound          = [];
        $mes                    = $_POST['Mes'];
        $year                   = $_POST['Anio'];
        $udns                   = $_POST['UDNs'];
        $clasificacion          = $_POST['Clasificacion'];
        $fecha                  = $year . '-' . $mes . '-01';
        $date                   = date('Y-m-d', strtotime($fecha));
        $calculo                = new aux_cp;
        $util                   = new Utileria;
        $isCreateCostoPotencial = 0;

        $th =  ['Fecha', 'Producto', 'Enlace', 'Desplazamiento', 'Costo', 'Estatus'];

        #Consultar a la base de datos
        $isData = $this->GetCostoPotencial([$mes, $year,$udns, $clasificacion]);


        if(count($isData)): // Existe costo potencial : actualiza desplazamiento


            $isCreateCostoPotencial = 1;

            if($_POST['UDNs'] == 6): // Pertenece a la UDN 6
               $data =  $this -> subirCostoPotencialFogaza();
               $th    = '';

                $__row = $data['row'];
                $__rowNotFound = $data['rowNotFound'];

                $notFound = [
                    'thead' => $th,
                    'row' => $__rowNotFound
                ];


            else: // Pertenece a cualquier unidad de negocio
                $data =  $this ->SubirCostoPotencialUDNs();

                $__row = $data['row'];
                $__rowNotFound = $data['rowNotFound'];

                $notFound = [
                    'thead' => $th,
                    'row' => $__rowNotFound
                ];

            endif;


          else: // Crea tablero de costo Potencial:


            $__row =  $this->crearTableroCostoPotencial();
            $th    = '';


          endif;


        $mensaje = ($isCreateCostoPotencial)
        ? '<i class="icon-ok-circle text-success"></i> Existe un tablero '
        : '<i class="icon-warning text-warning"></i> No existe un tablero creado.';


        #encapsular datos
        return [
            'frm_head' => $mensaje,

            "thead"  => $th,
            "row"    => $__row,
            'isData' => $isData,
            'notFound' => $notFound,
             'set' => $data['update']
        ];

    }

    function crearTableroCostoPotencial(){

        $mes = $_POST['Mes'];
        $year = $_POST['Anio'];
        $udns = $_POST['UDNs'];
        $clasificacion = $_POST['Clasificacion'];

        // Librerias
        $util    = new Utileria;
        $calculo = new aux_cp;



        $__row = [];

        $fecha = $year . '-' . $mes . '-01';
        $date = date('Y-m-d', strtotime($fecha));

        $lsRecetas = $this ->lsRecetasByClasificacion([$udns,$clasificacion]);

        foreach ($lsRecetas as $key ) {

              $sub    = $this->GET_SUB([$key['id_Subclasificacion']]);

                if($sub != 'DESCONTINUADO' && $sub != 'DESCONTINUADOS'):



                $costoPotencial = $this->calculoCostoPotencial([

                    'idReceta'        => $key['idReceta'],
                    'precioPropuesto' => '0',
                    'costo'           => '',
                    'iva'             => $key['iva'],
                    'ieps'            => $key['ieps'],
                    'pVenta'          => $key['pventa'],
                    'rendimiento'     => $key['rendimiento'],
                    'desplazamiento'  => 0,

                ], $calculo);


                     $data = [

                        'idE'                => $udns,
                        'fecha_costo'        => $date,
                        'id_Clasificacion'   => $key['id_Clasificacion'],
                        'receta'             => $key['idReceta'],

                        'precioventa'        => $key['pventa'],
                        'iva'                => $key['iva'],
                        'ieps'               => $key['ieps'],

                        'costo'              => $costoPotencial['costo'],
                        'costo_porc'         => $costoPotencial['porcentajeCosto'],
                        'margencontribucion' => $costoPotencial['mc'],

                    ];

                    $paq = $util->sql($data);

                    if($_POST['subir']){

                        $ok  = $this ->add_costo_potencial($paq);
                    }else{
                        $ok = 'No se ha creado';
                    }



                    $__row[] = array(

                        'id'                      => $key['idAlmacen'],
                        formatSpanishDate($fecha) => $key['receta'],
                        'sub'                     => $sub,
                        'clasificacion'           => $key['clasificacion'],
                        'precioventa'             => $key['pventa'],
                        'costo'                   => ['class'=>'bg-default text-end','html' => number_format($costoPotencial['costo'],4,'.',',')],
                        '% Costo'                 => ['class'=>'bg-default text-end','html' =>  number_format($costoPotencial['porcentajeCosto'],4,'.',',').' %'],
                        'ok'              => $ok,
                        'opc'             => 0,
                    );

                endif;

        }

        return $__row;

    }

    function SubirCostoPotencialUDNs(){

        $mes = $_POST['Mes'];
        $year = $_POST['Anio'];
        $udns = $_POST['UDNs'];
        $clasificacion = $_POST['Clasificacion'];

        $fecha = $year . '-' . $mes . '-01';
        $date = date('Y-m-d', strtotime($fecha));

        $calculo = new aux_cp;
        $util = new Utileria;

        $__row = [];
        $__rowNotFound = [];

        $ls        = $this ->select_list_grupo([$udns]);

        foreach($ls as $group){


            // $__row[] = array(
            //     'id'       => $group['idgrupo'],
            //     'grupo'    => $group['grupoproductos'],
            //     'colgroup' => true,
            // );

            $__rowNotFound[] = array(
                'id'       => $group['idgrupo'],
                'grupo'    => $group['grupoproductos'].'('.$group['idgrupo'].')',
                'colgroup' => true,
            );


            $lsProducto = $this ->SELECT_PRODUCTOS_x_SOFT([$udns,$group['idgrupo']]);

            foreach($lsProducto as $key){

                #Obtener el enlace con el soft y el costsys
                $list_costsys = $this ->Enlace_Costsys(array($key['id_Producto']));
                $nombre_cost = '<span class="text-danger">No encontrado </span>';
                $verificar = false;

                $idReceta = null;

                foreach ($list_costsys as $_key) {
                    $idCostsys       = $_key['id_costsys_recetas'];
                    $nombre_cost     = $_key['nombre'];
                    $costo           = $_key['precioVenta'];
                    $idClasificacion = $_key['id_Clasificacion'];
                    $verificar       = true;
                    $bg              = 0;

                    $idReceta    = $_key['idReceta'];
                    $iva         = $_key['iva'];
                    $ieps        = $_key['ieps'];
                    $pVenta      = $_key['precioVenta'];
                    $rendimiento = $_key['rendimiento'];
                }


                /*-- Separar recetas encontradas  --*/
                $CANT_MES = $this ->_GET_CANT_X_MES([$mes, $year, $key['id_Producto']]);
                $desplazamiento = $CANT_MES['total'];

                // if($desplazamiento):


                if($verificar): // Agregar a costo Potencial

                    $costoPotencial = $this ->calculoCostoPotencial([
                        'idReceta'        => $idReceta,
                        'precioPropuesto' => '0',
                        'iva'             => $iva,
                        'ieps'            => $ieps,
                        'pVenta'          => $pVenta,
                        'rendimiento'     => $rendimiento,
                        'desplazamiento'  => $desplazamiento,

                    ], $calculo);



                    # ------- [ actualizar desplazamiento ] ------- #
                    if ($_POST['subir']) {

                        $pPropuesto = $_key['precio_propuesto'];

                        // $pVentaIVAPropuesto = (isset($pPropuesto) && $pPropuesto != 0)
                        // ? $pPropuesto / $costoPotencial['impuestos']
                        // : $costoPotencial['pVentaIVA'];

                        $pVentaIVAPropuesto = $costoPotencial['pVentaIVA'];

                        $mcPropuesto = $costoPotencial['pVentaIVA'] - $costoPotencial['costo'];

                        // $porcCostoPropuesto = $producto['costo_porc'];

                        $ventasEstimadasP = $desplazamiento * $costoPotencial['pVentaIVA'];


                        $costoEstimadoP = $desplazamiento * $costoPotencial['costo'];
                        $mcEstimadoP = $desplazamiento * $mcPropuesto;



                            $update_data = [
                                'desplazamiento'     => $desplazamiento,
                                'costo'              => $costoPotencial['costo'],
                                'costo_porc'         => $costoPotencial['porcentajeCosto'],

                                'margencontribucion' => $costoPotencial['mc'],
                                'ventasestimadas'    => $costoPotencial['ventasEstimadas'],
                                'costoestimado'      => $costoPotencial['costoEstimado'],
                                'mc_estimado'        => $costoPotencial['mcEstimado'],

                            //     'mc_propuesto' => $mcPropuesto,
                            //     'costo_porc_propuesto' => $porcCostoPropuesto,

                                // TERMINANDO LA JUNTA REVISAR ESTE CODIGO.

                                'ventasestimadas_propuesto' => $costoPotencial['ventasEstimadas'],
                                'costoestimado_propuesto'   => $costoPotencial['costoEstimado'],
                                'mcestimado_propuesto'      => $costoPotencial['mcEstimado'],


                                'receta'             => $idReceta,
                                'fecha_costo'        => $date
                            ];

                            $update = $util->sql($update_data, 2);

                            $ok = $this->update_costo_potencial($update);


                            // ---

                    } else {
                            $ok = 'No se actualizo';
                    }
                        // if($group['idgrupo'] == 6 ):
                        $__row[] = array(
                            'id'             => $key['id_Producto'],
                            'fecha'          => $date,
                            'ventasestimadas_propuesto' => $ventasEstimadasP,
                            // 'p.Propuesto'    => $costoPotencial['pVentaIVA'],

                            // 'costoestimado_propuesto' => $costoEstimadoP,
                            // 'mcestimado_propuesto' => $mcEstimadoP,


                            'producto'       => $key['producto'],
                            'nombre_cost'    => $nombre_cost,
                            'desplazamiento' => $desplazamiento,
                            // 'costo'          => $costoPotencial['costo'],
                            'ok'             => $ok,
                            'opc'            => 0
                        );
                    // endif;

                else: // No se encontro enlace con el costsys

                        $__rowNotFound[] = array(
                            'id'             => $key['id_Producto'],
                            'fecha'          => $date,
                            'producto'       => $key['producto'],
                            'nombre_cost'    => $nombre_cost,
                            'desplazamiento' => $desplazamiento,
                            'costo'          => $costoPotencial['costo'],
                            'ok' => $ok,
                            'opc' => 0
                        );

                endif;





                // endif;// desplazamiento diferente de 0

            }

        }

        return [
            'row' => $__row,
            'rowNotFound' => $__rowNotFound
        ];


    }


    function subirCostoPotencialFogaza(){

        $mes           = $_POST['Mes'];
        $year          = $_POST['Anio'];
        $udns          = $_POST['UDNs'];
        $clasificacion = $_POST['Clasificacion'];

        $fecha         = $year . '-' . $mes . '-01';
        $date          = date('Y-m-d', strtotime($fecha));

        $calculo       = new aux_cp;
        $util          = new Utileria;

        $__row         = [];
        $__rowNotFound = [];

        $area          = $this->getAreaByName([$_POST['area']]);

        $lsProductosVendidos = $this->Productos_vendidos([$mes, $year, $area[0]['idArea']]);

                foreach ($lsProductosVendidos as $key) {

                    $desplazamiento = $key['CANT'];
                    $nombre_cost    = '';

                    // -- data receta --
                    $idCostsys   = 0;
                    $idReceta    = null;
                    $iva         = 0;
                    $ieps        = 0;
                    $pVenta      = 0;
                    $rendimiento = 0;

                    $list_costsys = $this ->_CONSULTA_COSTSYS(array($key['idAlmacen']));


                    foreach ($list_costsys as $_key) {
                        $verificar = true;

                        $idCostsys    = $_key['id_Costsys'];
                        $nombre_cost .= '<span class="text-muted" style="font-size:.678rem;">' . $_key['nombre'] . '</span>';
                        $costo        = $_key['precioVenta'];
                        $contador     = 1;

                        $idReceta    = $_key['idReceta'];
                        $iva         = $_key['iva'];
                        $ieps        = $_key['ieps'];
                        $pVenta      = $_key['precioVenta'];
                        $rendimiento = $_key['rendimiento'];

                    }

                    if($verificar): // Agregar a costo Potencial.

                        $producto    = $this -> getCostoPotencialByID([$mes,$year,$udns,$clasificacion,
                        $idReceta]);


                        $costoPotencial = $this->calculoCostoPotencial([
                            'idReceta'        => $idReceta,
                            'precioPropuesto' => '0',
                            'iva'             => $iva,
                            'ieps'            => $ieps,
                            'pVenta'          => $pVenta,
                            'rendimiento'     => $rendimiento,
                            'desplazamiento'  => $desplazamiento,

                        ], $calculo);







                        # ------- [ actualizar desplazamiento ] ------- #
                        if($_POST['subir']){


                            // sustituir p.Propuesto si no existe en la bd.
                            $pPropuesto = $producto['precio_propuesto'];
                            $pVentaIVAPropuesto = (isset($pPropuesto) && $pPropuesto != 0) ? $pPropuesto / $costoPotencial['impuestos'] : $costoPotencial['pVentaIVA'];

                            $mcPropuesto = $pVentaIVAPropuesto - $costoPotencial['costo'];

                            $porcCostoPropuesto = $producto['costo_porc'];
                            $ventasEstimadasP = $desplazamiento * $pVentaIVAPropuesto;
                            $costoEstimadoP = $desplazamiento * $costoPotencial['costo'];
                            $mcEstimadoP = $desplazamiento * $mcPropuesto;


                            $update_data = [
                                'desplazamiento'     => $desplazamiento,

                                'margencontribucion' => $costoPotencial['mc'],
                                'costo_porc'         => $costoPotencial['porcentajeCosto'],
                                'ventasestimadas'    => $costoPotencial['ventasEstimadas'],
                                'costoestimado'      => $costoPotencial['costoEstimado'],
                                'mc_estimado'        => $costoPotencial['mcEstimado'],

                                'mc_propuesto'              => $mcPropuesto,
                                'costo_porc_propuesto'      => $porcCostoPropuesto,
                                'ventasestimadas_propuesto' => $ventasEstimadasP,
                                'costoestimado_propuesto'   => $costoEstimadoP,
                                'mcestimado_propuesto'      => $mcEstimadoP,

                                'receta'             => $idReceta,
                                'fecha_costo'        => $date
                            ];

                            $update = $util->sql($update_data, 2);

                            $ok = $this->setCostoPotencial($update);

                            // cargar actualizacion 2.o de desplazamiento.

                        }else{
                            $ok = 'No se actualizo';
                        }




                # Lista de productos con desplazamiento.
                        $enlace = $nombre_cost ? "<span class='text-muted'>({$nombre_cost})</span>":' No encontrado';

                        $__row[] = array(

                        'id'                     => $key['idAlmacen'],
                        'idR'=> $producto['idcostopotencial'],
                        formatSpanishDate($date) => $key['NombreProducto'].$enlace,

                        'p.VentaIVA'  => ['html'=>number_format($costoPotencial['pVentaIVA'],4,'.',','), 'class'=>'bg-default text-end'],
                        'mc'          => number_format($costoPotencial['mc'],4,'.',','),
                        '% cost'      => number_format($costoPotencial['porcentajeCosto'],4,'.',','),
                        'v.estimadas' => number_format($costoPotencial['ventasEstimadas'],4,'.',','),
                        'c.estimado'  => number_format($costoPotencial['costoEstimado'],4,'.',','),

                        'desplazamiento' => ['html'  => $desplazamiento, 'class' => 'bg-default text-end'],
                        'p.Propuesto'    => $producto['precio_propuesto'].'/'. $pVentaIVAPropuesto,
                        'mcPropuesto'    =>  evaluar($mcPropuesto),
                        'porCosto' => evaluar($porcCostoPropuesto),
                        'ventasEstim'=> evaluar($ventasEstimadasP),
                        'costoEstim'  => evaluar($costoEstimadoP),
                        'mcEstim' => evaluar($mcEstimadoP),







                            // 'Cargar despl.' => $_POST['subir'],
                            'ok'            => $ok,
                            'opc'           => 0
                        );


                    else: // No se encontro enlace con el costsys

                        $__rowNotFound[] = array(

                            'id'             => $key['idAlmacen'],
                            'fecha'          => $date,
                            'producto'       => $key['NombreProducto'],
                            'link'           => $nombre_cost,
                            'desplazamiento' => $desplazamiento,
                            'costo'          => evaluar($costoPotencial['costo']),
                            'Cargar despl.'  => $_POST['subir'],
                            'ok'             => $ok,
                            'opc'            => 0
                        );
                    endif; // Si existe receta

                 }//end foreach




        return [
            'row' => $__row,
            'rowNotFound' => $__rowNotFound,
            'update' =>  $update,
            '$lsProductosVendidos' => $lsProductosVendidos
        ];



        //  return $__row;

    }

    function lsCostoPotencial(){

        # Variables
        $__row       = [];
        $mes         = $_POST['Mes'];
        $anio        = $_POST['Anio'];
        $fecha       = $anio.'-'.$mes.'-01';

        $fechaActual = new DateTime($fecha);
        $fechaInicio = new DateTime($anio.'-01-01');

        $mesActual =   $this -> getCostoPotencialByMonth([$fecha,$_POST['Clasificacion']]);

        $totalRecetas        = $mesActual['totalRecetas'];
        $totalDesplazamiento = $mesActual['totalDesplazamiento'];


        while ($fechaInicio <= $fechaActual) {

            $fechaConsulta = $fechaInicio->format('Y-m-d');

            $btn = [];

            if($fechaInicio == $fechaActual)

            $btn[] = [
                'fn'   => 'soft.quitarCostoPotencial(event)',
                'icon' => 'icon-trash',
                'color'=> 'danger',
                'text' => 'Limpiar',
            ];

            $costoPotencial = $this -> getCostoPotencialByMonth([$fechaConsulta,$_POST['Clasificacion']]);
            // $count          = count($costoPotencial);


            $__row[] = array(
               'id'                 => '',
               'Fecha'              => $fechaConsulta,                                                   // Corregir 'NombreProducto'
               'Mes'                => formatSpanishDate($fechaConsulta),
               'Estado en costsys'  => $this->estadoCostSys($costoPotencial['totalDesplazamiento']),
               'Productos cargados' => $this->productosCargadosBadge($costoPotencial['totalRecetas']),

                'opc'                => 0
                // 'a' => $btn
            );
            // Avanzar al siguiente mes
            $fechaInicio->modify('+1 month');

        }


        // Encapsular arreglos
        return [

            "thead"               => '',
            "row"                 => $__row,

            'Estado actual'       => $mesActual,
            'totalDesplazamiento' => $totalDesplazamiento,
            'totalRecetas'        => $totalRecetas,


        ];
    }

    function productosCargadosBadge($totalRecetas) {
        if ($totalRecetas == 0) {
            // Amarillo: crear tablero
            return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                         ❌ No existe tablero
                    </span>';
        } else {
            // Verde: total de productos cargados
            return '<span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium">
                        '.$totalRecetas.'
                    </span>';
        }
    }

    function estadoCostSys($totalDesplazamiento) {
        if ($totalDesplazamiento > 0) {
            // Verde: datos existentes
            return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                ✅ Subidos
            </span>';
        } elseif ($totalDesplazamiento === 0) {
            // Naranja/Amarillo: no enviado
            return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                🟡 No enviado
            </span>';
        } else {
            // Rojo: sin datos
            return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                ❌ Sin datos
            </span>';
        }
    }

    function quitarCostoPotencial(){

        $data = $this -> util->sql($_POST,2);
        $ok = $this ->deleteCostoPotencial($data);


        return  ['data' => $data, 'ok' => $ok];
    }




}

// Complementos :
function evaluar($val){
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

    $formatoFecha = "%b-%Y"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}

// Instancia del objeto

$obj = new ctrl();
$fn = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);
