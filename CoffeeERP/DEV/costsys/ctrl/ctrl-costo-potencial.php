<?php
if (empty($_POST['opc']))
    exit(0);

// incluir modelo
require_once ('../mdl/mdl-costo-potencial.php');
require_once ('../mdl/mdl-calculo.php');
require_once ('../../conf/_Utileria.php');
require_once('../../conf/coffeSoft.php');

header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

class ctrl extends Costsys{
    public $util;
    public $recetas;
  

    public function __construct() {
        parent::__construct(); // Llama al constructor de la clase padre
        $this->util = new Utileria();          // Inicializa la propiedad util
        $this-> recetas     = $this -> bd2.'recetas';
        
    }

    function initComponents(){

        $lsUDN              = $this->lsUDN();
        $lsClasificacion    = $this->lsClasificacion();
        $lsSubClasificacion = $this->lsSubClasificacion();

       return [

            'lsUDN'              => $lsUDN,
            'lsClasificacion'    => $lsClasificacion,
            'lsSubClasificacion' => $lsSubClasificacion
       
        ];
    }

    function lsCostoPotencial(){

        $calculo = new aux_cp;

        # Declarar variables
        $__row   = [];
        $__lsMod = [];
        
        $mes                  = $_POST['Mes'];
        $year                 = $_POST['Anio'];
        $idClasificacion      = $_POST['Clasificacion'];
        $subClasificacion     = $_POST['Subclasificacion'];

        $productosModificados = false;
        $mostrar              = $_POST['mostrar'];


        //  Variables de tablero de control 

        $tablero = $this->selectTablero([$idClasificacion, $mes, $year]);

        $desplazamientoPromedio = 0;
        $costoAlto              = 0;
        $costoBajo              = 0;
        $mcAlto                 = 0;
        $mcBajo                 = 0;


        if (!isset($tablero)) {


            $data = $this->insertTablero($idClasificacion, $mes, $year);

            $tablero = $this->selectTablero([$idClasificacion, $mes, $year]);

            $desplazamientoPromedio = $tablero['desplazamientoPromedio'];
            $costoBajo              = $tablero['CostoProduccionBajo'];
            $costoAlto              = $tablero['CostoProduccionAlto'];
            $mcBajo                 = $tablero['MargenContribucionBajo'];
            $mcAlto                 = $tablero['MargenContribucionAlto'];


        } else {

            $desplazamientoPromedio = $tablero['desplazamientoPromedio'];
            $costoAlto              = $tablero['CostoProduccionBajo'];
            $costoBajo              = $tablero['CostoProduccionAlto'];
            $mcBajo                 = $tablero['MargenContribucionBajo'];
            $mcAlto                 = $tablero['MargenContribucionAlto'];
        }


        // Recorrido de productos por grupos :

        $subClasificacion = $this-> listSubClasificacion( [ $idClasificacion ] );
        array_unshift($subClasificacion, ['id' => 0, 'nombre' => 'SIN SUBCLASIFICACION']);

        foreach ($subClasificacion as $sub) {

            $__row[] = array(
                'id'               => $sub['id'],
                'nombre'           => $sub['nombre'],
                'P.propuesto'      => '',
                'p.venta'          => '',
                'p.venta sin iva'  => '',
                'costo '           => '',
                '% cost'           => '',
                'mc'               => '',
                'desplazamiento'   => '',
                'ventas estimadas' => '',
                'costo estimado'   => '',
                'mc estimado'      => '',
                'opc'=> 1
            );

            // Recorrido de productos en la tabla costo potencial :
            if ($sub['id'] != 0):

                $productos = $this->lsCostoPotencialSubClasificacion([$mes, $year, $sub['id']]);
                
            else:

                $productos = $this->lsCostoPotencialReceta([$mes, $year, $idClasificacion]);
            
            endif;


            foreach ($productos as $_key) {

                // Aplicar calculo de costo potencial
                $filter =  getFilterDate([ 'mesPropuesto' => $_POST['Mes'],'anioPropuesto' => $_POST['Anio']]);

                $costoPotencial = $this->aplicarCalculo([
                    'idReceta'        => $_key['idReceta'],
                    'precioPropuesto' => $_key['precio_propuesto'],
                    'iva'             => $_key['iva'],
                    'ieps'            => $_key['ieps'],
                    'pVenta'          => $_key['precioVenta'],
                    'rendimiento'     => $_key['rendimiento'],
                    'desplazamiento'  => $_key['desplazamiento'],
                    'costo'           => $_key['costo'],
                    'filter'          => $filter
                ], $calculo);

                // Pintar diferencias costo  :

                $bgCosto           = verificarCostoDiferente($_key['costo'], $costoPotencial['costoReceta']);
                $bgPorcentajeCosto = determinarBgCosto($costoPotencial['porcentajeCosto'], $costoAlto, $costoBajo);
                $bgMC              = determinarBgMC($costoPotencial['mc'], $mcAlto, $mcBajo);
                $bg                = $_key['precio_propuesto'] ? 'bg-warning-1' : '';
                $bgDesplazamiento  = getDesplazamientoClass($_key['desplazamiento'], $desplazamientoPromedio);

                if($bgCosto['productosModificados']):
                    $__lsMod[] = ['receta' => $_key['nombre'] ,'costoAnt' =>  $costoPotencial['costo'],'costoAct' => $_key['costo'] ];
                endif;    


                // Eventos P.propuesto y desplazamiento 

                $precio_propuesto = [];
                $desp = [];

                $precio_propuesto = [
                    'onclick' => 'costsys.precioPropuesto(' . $_key['idcostopotencial'] . ',event)',
                    'class'   => 'fw-bold text-end pointer '.$bg.' '.$bgCosto['bgCostoDif'],
                    'html'    => ($_key['precio_propuesto'] == 0) ? '' : $_key['precio_propuesto']
                ];

                $desp  = [
                    'onclick' => 'costsys.desplazamiento(' . $_key['idcostopotencial'] . ',event)',
                    'class'   => $bgCosto['bgCostoDif'].' '.$bgDesplazamiento.' fw-bold text-end pointer',
                    'html'    => ($_key['desplazamiento'] == 0) ? '' : $_key['desplazamiento']
                ];


                // if($_key['desplazamiento'])

                $__row[] = array(
                    'id'               => $sub['id'],
                    'nombre'           => ['class' => $bgCosto['bgCostoDif'],'idCost'=>'id:'.$_key['idcostopotencial'], 'html' => $_key['nombre']],
                    'P.propuesto'      => $precio_propuesto,
                    'p.venta'          => ['html' => evaluar($costoPotencial['pVenta']), 'class' => 'text-end '.$bgCosto['bgCostoDif'] ],
                    'p.venta sin iva'  => ['html' => evaluar($costoPotencial['pVentaIVA']),'class' => 'text-end '.$bgCosto['bgCostoDif'] . ' text-end ' . $bg ],
                    'costo '           => [
                        'class' => 'text-end '.$bgCosto['bgCostoDif'],
                        'html'  => '<span class="pointer text-success" >' .evaluar($_key['costo']). $bgCosto['iconCosto'] . ' </span> '],
                    
                    
                    
                    
                    
                    
                    '% cost'           => ['class' => ' text-end ' . $bgPorcentajeCosto, 'html' => evaluar2($costoPotencial['porcentajeCosto']) . ' %'],
                    'mc'               => ['class' => ' text-end ' . $bgMC, 'html' => evaluar2($costoPotencial['mc'])],
                    
                    'desplazamiento'   =>  $desp,

                    'ventas estimadas' => [
                        'class' => $bgCosto['bgCostoDif'] . ' text-end ' . $bg,
                        'html'  => evaluar($costoPotencial['ventasEstimadas'])],
                    'costo estimado'   => ['class' => $bgCosto['bgCostoDif'] . ' text-end ', 'html' => evaluar($costoPotencial['costoEstimado'])],
                
                    'mc estimado'      => [
                        'class' => $bgCosto['bgCostoDif'].' text-end '.$bg,
                        'html'  => evaluar($costoPotencial['mcEstimado'])
                    ],
                    
                    
                    'opc' => 0
                );

            }

        }


        #encapsular datos
        
        return [

            "thead"    => ['Producto', 'P.propuesto', 'P.venta', 'P.venta sin iva', 'Costo', 'Costo %', 'MC', 'Desplazamiento', 'Ventas estimadas', 'Costo estimado', 'MC estimado'],
            "row"      => $__row,
            'mod'      => $__lsMod,
            'frm_head' => "<small> <strong>Conectado a: </strong> {$this->bd2} </small>",
            'tablero'  => $tablero
        ];

    }

    function getTableroCostoPotencial(){

        $mes              = $_POST['Mes'];
        $year             = $_POST['Anio'];
        $idClasificacion  = $_POST['Clasificacion'];
        $subClasificacion = $_POST['Subclasificacion'];

    

        //  Variables de tablero de control 

        $tablero = $this->selectTablero([$idClasificacion, $mes, $year]);

        return [
            'tablero' => $tablero
        ];

    }

    function lsTablero(){

        # Declarar variables
        $row             = [];

        $mes             = $_POST['Mes'];
        $year            = $_POST['Anio'];
        $idClasificacion = $_POST['Clasificacion'];
        $idE             = $_POST['UDNs'];

        $cpReal = 0;
        $cpPropuesto = 0;


        $data = [$idClasificacion, $year, $mes];


        /* -- Calculo de costo Potencial -- */

        $sumatorias          = $this->selectSumatoriasEstimadas($data);
        $totalDesplazamiento = $sumatorias['desplazamiento'];
        
        if (isset($sumatorias['ventasestimada']) && $sumatorias['ventasestimada'] != 0) { // ya se agrego a costo potenciañ

            $ventaReal = $sumatorias['ventasestimada'];
            $costoReal = $sumatorias['costoestimado'];
            $mcReal = $sumatorias['mc_estimado'];
            $cpReal = ($costoReal / $ventaReal) * 100;
        }

        if ( isset($sumatorias['ventasestimadas_propuesto']) && $sumatorias['ventasestimadas_propuesto'] != 0) {
            $ventaPropuesto = $sumatorias['ventasestimadas_propuesto'];
            $costoPropuesto = $sumatorias['costoestimado_propuesto'];
            $mcPropuesto    = $sumatorias['mcestimado_propuesto'];
            $cpPropuesto    = ($costoPropuesto / $ventaPropuesto) * 100;
        }

        if ( isset($sumatorias['desplazamiento']) && $sumatorias['desplazamiento'] != 0 ) {
            $desplazamiento         = $sumatorias['desplazamiento'];
            $produccion             = $sumatorias['produccion'];
            $desplazamientoPromedio = $desplazamiento / $produccion;
        }


        // actualizar tablero de control.
        $tablero        = $this ->selectTablero([$idClasificacion,$mes, $year]);

        $updateTablero  = [

            'ventaEstimadaReal'       => $ventaReal,
            'costoEstimadoReal'       => $costoReal,
            'mcEstimadoReal'          => $mcReal,
            'costoPotencialReal'      => $cpReal,
            'ventaEstimadaPropuesta'  => $ventaPropuesto,
            
            'costoEstimadoPropuesto'  => $costoPropuesto,
            'mcEstimadoPropuesto'     => $mcPropuesto,
            'costoPotencialPropuesto' => $cpPropuesto,
            'desplazamientoPromedio'  => $desplazamientoPromedio,
            'idTablero'               => $tablero['idTablero']

        ];

        $dataTab = $this  ->  util ->  sql($updateTablero,1);
        $ok      = $this  ->  updTablero( $dataTab );





        $row[] = array(
         
            'id'               => '',
            '-'                => 'ACTUAL',
            'VENTAS ESTIMADAS' => evaluar($ventaReal),
            'COSTO ESTIMADO'   => evaluar($costoReal),
            'MC ESTIMADO'      => evaluar($mcReal),
            
            'opc'              => 0
        
        );

        $row[] = [
            'id'               => '',
            '-'                => 'PROPUESTO',
            'VENTAS ESTIMADAS' => evaluar($ventaPropuesto),
            'COSTO ESTIMADO'   => evaluar($costoPropuesto),
            'MC ESTIMADO'      => evaluar($mcPropuesto),
            'opc'              => 0
        ];


        // Diferencia 
        $diferenciaVentas = $ventaReal - $ventaPropuesto;
        $diferenciaCostos = $costoReal - $costoPropuesto;
        $diferenciaMC     = $mcReal - $mcPropuesto;


        $row[] = [
            'id'               => '',
            '-'                => '<strong> DIFERENCIA </strong>',
            'VENTAS ESTIMADAS' => evaluar($diferenciaVentas),
            'COSTO ESTIMADO'   => evaluar($diferenciaCostos),
            'MC ESTIMADO'      => evaluar($diferenciaMC),
            'opc'              => 1
        ];


          $arrayTablero   = array(
                    $ventaReal,
                    $costoReal,
                    $mcReal,
                    $cpReal,
                    $ventaPropuesto,
                    $costoPropuesto,
                    $mcPropuesto,
                    $cpPropuesto,
                    $desplazamientoPromedio,
                    $tablero['idTablero']
                );


        $panel = '
        <div class="row">
            <h5 class="col-sm-6  text-center">Actual: ' . evaluar2($cpReal) . ' % </h5>
            <h5 class="col-sm-6 text-center">Propuesto: ' . evaluar2($cpPropuesto) . ' % </h5>
        </div>';


        return [
                'frm_head' => $panel,
                'thead'    => '',
                'row'      => $row,
                'frm_foot' => ticket_head(['totalDesplazamiento'=> $totalDesplazamiento])

        ];


    }

    // Eventos input.


    function iptPrecioPropuesto(){

        //  (isset($producto['precio_propuesto']) && intval($_POST['precio_propuesto']) != 0) ? $_POST['precio_propuesto'] : $producto['precioventa'];
        $idCostoPotencial = $_POST['idcostopotencial'];
        $producto         = $this->getCostoPotencialbyid([$idCostoPotencial]);
        $pPropuesto       = intval($_POST['precio_propuesto']);
       
        // data tabla costsys
        $costo          = $producto['costo'];
        $iva            = $producto['iva'];
        $ieps           = $producto['ieps'];
        $impuestos      = (($iva + $ieps) / 100) + 1;
        $desplazamiento = $producto['desplazamiento'];
        
        
        if($pPropuesto):
        
            $pPropuestoIVA      = $pPropuesto/$impuestos;
            
            $porcCostoPropuesto = ($costo / $pPropuestoIVA) * 100;
            $mcPropuesto        = $pPropuestoIVA - $costo;
            $ventaEstPropuesto  = $pPropuestoIVA * $desplazamiento;
            $costoEstPropuesto  = $costo * $desplazamiento;
            $mcEstPropuesto     = $mcPropuesto * $desplazamiento;


        else: 

            $pVentaIVA          = $producto['precioventa'] / $impuestos;
            $pPropuestoIVA      = $pVentaIVA;
            $porcCostoPropuesto = ($costo / $pVentaIVA) * 100;

            $mcPropuesto        = $pVentaIVA - $costo;
            $ventaEstPropuesto  = $pVentaIVA * $desplazamiento;
            $costoEstPropuesto  = $costo * $desplazamiento;
            $mcEstPropuesto     = $mcPropuesto * $desplazamiento;

        endif;   


              
        // aplicar calculos con el pPropuesto.
        
        $values = [
        
            'precio_propuesto'          => $_POST['precio_propuesto'],
            'costo_porc_propuesto'      => $porcCostoPropuesto,
            'mc_propuesto'              => $mcPropuesto,
            'ventasestimadas_propuesto' => $ventaEstPropuesto,
            'costoestimado_propuesto'   => $costoEstPropuesto,
            'mcestimado_propuesto'      => $mcEstPropuesto,
            'idcostopotencial'          => $idCostoPotencial
        ];
        
        $data = $this->util :: sql($values, 1);
        $ok   = $this->udpt_precio_propuesto($data);
  

        
        return [
            'data'          => $producto,
            'pPropuesto'    => intval($_POST['precio_propuesto']),
            // 'pPropuestoIVA' => $pPropuestoIVA,
            'pVentaIva'     => $pPropuestoIVA,
            'costo_porc' => $porcCostoPropuesto,
            
            'mc'         => $mcPropuesto,

            'ventasEstimadas' => $ventaEstPropuesto,
            'costoEstimado'   => $costoEstPropuesto,
            'mcEstimado'      => $mcEstPropuesto,
             
        ];
    }

    function iptDesplazamiento(){
      
        // actualizar sumatorias del tablero.
        $desplazamiento     = ($_POST['desplazamiento']) ? $_POST['desplazamiento'] : 0;
        $producto           = $this->getCostoPotencialbyid([$_POST['idcostopotencial']]);
       
        $fecha              = strtotime($producto['fecha_costo']);
        $idClasificacion    = $producto['id_Clasificacion'];
        $pPropuesto         = $producto['precio_propuesto'];
        $pVenta             = $producto['precioventa'];
        $costo              = $producto['costo'];
        $iva                = $producto['iva'];
        $ieps               = $producto['ieps'];
        $impuestos          = (($iva + $ieps) / 100 ) + 1;
        $pVentaIVA          = $pVenta / $impuestos;
       
          
        $pVentaIVAPropuesto = (isset($producto['precio_propuesto']) && $pPropuesto != 0) ? $pPropuesto / $impuestos : $pVentaIVA;
        
        $mc                 = $pVentaIVA - $costo;
        $porcentajeCosto    = $costo / $pVentaIVA;
        $ventasEstimadas    = $desplazamiento * $pVentaIVA;
        $costoEstimado      = $desplazamiento * $costo;
        $mcEstimado         = $desplazamiento * $mc;
        
        $mcPropuesto        = $pVentaIVAPropuesto - $costo;
        $porcCostoPropuesto = $producto['costo_porc'];
        $ventasEstimadasP   = $desplazamiento * $pVentaIVAPropuesto;
        $costoEstimadoP     = $desplazamiento * $costo;
        $mcEstimadoP        = $desplazamiento * $mcPropuesto;


        // actualizar desplazamientos.
        
        $values = [
            'margencontribucion'        => $mc,
            'costo_porc'                => $porcentajeCosto,
            'ventasestimadas'           => $ventasEstimadas,
            'costoestimado'             => $costoEstimado,
            'mc_estimado'               => $mcEstimado,
            'mc_propuesto'              => $mcPropuesto,
            
            'costo_porc_propuesto'      => $porcCostoPropuesto,
            'ventasestimadas_propuesto' => $ventasEstimadasP,
            'costoestimado_propuesto'   => $costoEstimadoP,
            'mcestimado_propuesto'      => $mcEstimadoP,
            'precio_propuesto'          => $pPropuesto,
            'desplazamiento'            => $_POST['desplazamiento'],
            'idcostopotencial'          => $_POST['idcostopotencial']
        ];

       
        $data  = $this->util :: sql($values, 1);
        $ok    = $this->updDesplazamiento($data);

        if($pPropuesto):

            $ventasEstimadas  = $pVentaIVAPropuesto * $desplazamiento;

        endif;    


        // aplicar conf. de color.

        $year                   = date("Y", $fecha);
        $month                  = date("m", $fecha);


        $tablero = $this->selectTablero([$idClasificacion, $month, $year]);

        
        $costoAlto              = $tablero['CostoProduccionAlto'];
        $costoBajo              = $tablero['CostoProduccionBajo'];
        $mcAlto                 = $tablero['MargenContribucionAlto'];
        $mcBajo                 = $tablero['MargenContribucionBajo'];
        

        $array = array($idClasificacion,$year, $month );
                 


        return [
            'despl'           => $desplazamiento,
            'ventasEstimadas' => $ventasEstimadas,
            'costoEstimado'   => $costoEstimado,
            'mcEstimado'      => $mcEstimado,
            'bgDespl'         => 'bg-default',
            'data'            => $values,
            'ok'              => $tablero
        ];



    }

    // control de botones 

    function ejercicioMensual(){

        $__row = [];

        $fechaInicio     =  explode('-',$_POST['fecha_inicio']);
        $fechaFinal     =  explode('-',$_POST['fecha_final']);
   
        $listRecetas         = $this ->listCostoPotencial([$fechaInicio[1],$fechaInicio[0], $_POST['Clasificacion']]);
        $nextCostoPotencial  = $this ->listCostoPotencial([$fechaFinal[1],$fechaFinal[0],$_POST['Clasificacion']]);
        $isCreated           = true;


        if (!$nextCostoPotencial): // No existe costo potencial:
            $isCreated = false;

            foreach ($listRecetas as $_key) {

                $data = [];


                if($_key['precio_propuesto'] == 0){
                    $mc_propuesto = 0;
                    $costo_porc_propuesto = 0;
                }else{
                    $mc_propuesto = $_key['mc_propuesto'];
                    $costo_porc_propuesto = $_key['costo_porc_propuesto'];
                }
               
                if($_key['desplazamiento'] == 0){
                
                        $data = [

                            'idE'                       => $_key['idE'],
                            'id_Clasificacion'          => $_key['id_Clasificacion'],
                            'receta'                    => $_key['idReceta'],
                            'fecha_costo'               => $_POST['fecha_final'].'-01',
                            'precioventa'               => $_key['precioVenta'],
                            'precio_propuesto'          => $_key['precio_propuesto'],
                            'iva'                       => $_key['iva'],
                            'ieps'                      => $_key['ieps'],
                            'costo'                     => $_key['costo'],

                            'margencontribucion'        => $_key['margencontribucion'],
                            'desplazamiento'            => $_key['desplazamiento'],
                            
                            'ventasestimadas'           => $_key['ventasestimadas'],
                            'costoestimado'             => $_key['costoestimado'],
                            'mc_estimado'               => $_key['mc_estimado'],

                            'ventasestimadas_propuesto' => $_key['ventasestimadas_propuesto'],
                            'costoestimado_propuesto'   => $_key['costoestimado_propuesto'],
                            'mcestimado_propuesto'      => $_key['mcestimado_propuesto'],
                            
                            'mc_propuesto'              => $mc_propuesto,
                            'costo_porc_propuesto'      => $costo_porc_propuesto

                        ];


                        $ok    = $this  -> add_costo_potencial($this-> util -> sql($data));
                        $opc   = ($_key['precio_propuesto']) ? 1 : 0;
                        
                        $row         = [  'id' => 0];
                        $data['ok']  = $ok;
                        $data['opc'] = $opc;
                        $__row[]     = array_merge($row, $data);



                }



            }


        endif;

        #encapsular datos
        return [
            "thead"              => '',
            "row"                => $__row,
            'costoPotencial'     => $PotentialCostCreated,
            'nextCostoPotencial' => $nextCostoPotencial,
            "created"            => $isCreated,
            "fechaInicio"        => $listRecetas 
        ];


    }

    function limpiarDesplazamiento(){

        $fecha = $_POST['Anio'] . '-' . $_POST['Mes'] . '-01';
        $util = new Utileria;


        $values = [

            'desplazamiento'            => '',
            'ventasestimadas_propuesto' => '',
            'costoestimado_propuesto'   => '',
            'mcestimado_propuesto'      => '',

            'mc_propuesto'              => '',
            'costo_porc_propuesto'      => '',
           
            'ventasestimadas'           => '',
            'costoestimado'             => '',
            'mc_estimado'               => '',
     
            'fecha_costo'               => $fecha,
            'idE'                       => $_POST['UDN'],
            'id_Clasificacion'          => $_POST['Clasificacion'],
        ];

        $data = $util->sql($values, 3);

        $ok = $this->limpiarCostoPotencial($data);
   
        return ['ok' => $ok];
    }

    function LimpiarPrecioPropuesto(){

        $mes              = $_POST['Mes'];
        $year             = $_POST['Anio'];
        $UDN              = $_POST['UDN'];
        
        $idClasificacion  = $_POST['Clasificacion'];
        $subClasificacion = $_POST['Subclasificacion'];


        $data             = [$year, $mes, $UDN, $_POST['Clasificacion']];

        $ok = $this->limpiarPrecioPro($data);

        return ['ok' => $ok];

    }

    function actualizarPrecios(){

      $__row = [];
    

      $lsCostoPotencial   =   $this -> listCostoPotencialPropuesto([$_POST['Mes'], $_POST['Anio'], $_POST['Clasificacion']]);

       
      foreach ($lsCostoPotencial as $_key) {
     
          
          // actualizar precios propuestos a precios de venta de la receta
            
            $data  = $this -> util -> sql( [
                'precioVenta' => $_key['precio_propuesto'],
                'idReceta'    => $_key['idReceta'],
            ],1 );

            $ok = $this->_Update($data,$this->recetas);
            
            
            // actualizar precios propuesto a costsys:
            
            $pPropuesto      = $_key['precio_propuesto'];
            $iva             = $_key['iva'];
            $ieps            = $_key['ieps'];
            $impuestos       = (($iva + $ieps) / 100) + 1;
            $pPropuestoIVA   = $pPropuesto / $impuestos;
            $costo           = $_key['costo'];
            $porcentajeCosto = $costo / $pPropuestoIVA;
            $mc              = $pPropuestoIVA - $costo;
            $desplazamiento  = 0;
           

            
            if (isset($_key['desplazamiento'])) {
                $desplazamiento = $_key['desplazamiento'];
            }
            
            $ventasEstimadas = $pPropuestoIVA * $desplazamiento;
            $costoEstimadas  = $costo * $desplazamiento;
            $mcEstimadas     = $mc * $desplazamiento;
            
            /*  -- Se reinician los valores propuestos 
            y el precio propuesto pasa a ser el 
            precio de venta -- */

            $data = [];
                    
            $data = [
                
                'precioventa'               => $_key['precio_propuesto'],                
                'costo_porc'                => $porcentajeCosto,
                'margencontribucion'        => $mc,
                'ventasestimadas'           => $ventasEstimadas,
                'costoestimado'             => $costoEstimadas,
                'mc_estimado'               => $mcEstimadas,
                'ventasestimadas_propuesto' => $ventasEstimadas,
                'costoestimado_propuesto'   => $costoEstimadas,
                'mcestimado_propuesto'      => $mcEstimadas,
                'precio_propuesto'          => 0,
                'mc_propuesto'              => 0,
                'costo_porc_propuesto'      => 0,
                'idCostoPotencial'          => $_key['idcostopotencial'],
            ];



             $query  = $this -> util -> sql($data,1 );


             $updt = $this->_Update($query,$this->costopotencial);


         
            $row = [];

            $row = array(
                'id' => $_key['idcostopotencial'],
                'receta'             => $_key['nombre'],
            );

            $data['ok'] = $updt;
            $data['opc'] = 0;
            
            $__row[] = array_merge($row, $data);



      }


      return [

        'th'  => '',
        'row' => $__row,
        'ls'  => $lsCostoPotencial
      ];

    }

    function productosModificados(){

        $calculo = new aux_cp;


        $mes  = $_POST['Mes'];
        $year = $_POST['Anio'];
        $UDN  = $_POST['UDN'];

        $idClasificacion = $_POST['Clasificacion'];

        $lsRecetas = $this -> selectRecetas([$idClasificacion]);

        foreach ($lsRecetas as $_key): // recorrido de recetas .

        $idReceta    = $_key['idReceta'];
        $rendimiento = $_key['rendimiento'];
        $receta      = $calculo->totalReceta($idReceta);

        // DATOS ACTUALES
        
        $costoActual            = $receta['total'] / $rendimiento;
        $ivaActual              = $_key['iva'];
        $iepsActual             = $_key['ieps'];
        $impuestosActual        = (($ivaActual + $iepsActual) / 100) + 1;
        $pVentaActual           = $_key['precioVenta'];
        $pVentaIVAActual        = $pVentaActual / $impuestosActual;

        //DATOS ANTERIORES

        $productos         = $this ->selectDatosCostoPotencial([$idReceta,$mes,$year]);
        $desplazamiento    = $productos['desplazamiento'];
        
        $pPropuesto        = $productos['precio_propuesto'];
        $costoAnterior     = $productos['costo'];
        $ivaAnterior       = $productos['iva'];
        $iepsAnterior      = $productos['ieps'];
        $impuestosAnterior = (($ivaAnterior + $iepsAnterior) / 100) + 1;
        $pVentaAnterior    = $productos['precioventa'];
        $pVentaIVAAnterior = $pVentaAnterior / $impuestosAnterior;
    

        if($productos): // la receta esta creada en costo Potencial

             // ACTUALIZAR PRODUCTOS MODIFICADOS
                $impuestosActualFormat   = number_format($impuestosActual, 2, '.', '');
                $impuestosAnteriorFormat = number_format($impuestosAnterior, 2, '.', '');
                $pVentaActualFormat      = number_format($pVentaActual, 2, '.', '');
                $pVentaAnteriorFormat    = number_format($pVentaAnterior, 2, '.', '');
                $costoActualFormat       = number_format($costoActual, 2, '.', '');
                $costoAnteriorFormat     = number_format($costoAnterior, 2, '.', '');

                // Verificar si hubo algún cambio significativo
                $requiresUpdate =  $impuestosActualFormat != $impuestosAnteriorFormat ||  $pVentaActualFormat != $pVentaAnteriorFormat || $costoActualFormat != $costoAnteriorFormat;

                if ( $requiresUpdate ) {


                    if(isset($productos['precio_propuesto']) && $productos['precio_propuesto'] != 0 ):
                    
                        $pPropuesto               = $productos['precio_propuesto'];
                        $pPropuestoIVA            = $pPropuesto / $impuestosActual;
                        $porcentajeCostoPropuesto = ($costoActual / $pPropuestoIVA) * 100;
                        $mcPropuesto              = $pPropuestoIVA - $costoActual;

                    endif;

                    // if($productos['desplazamiento']): // existe desplazamiento


                        $porcentajeCosto    = $costoActual / $pVentaIVAActual;
                        $mc                 = $pVentaIVAActual - $costoActual;
                        
                        $ventasEstimadas    = $pVentaIVAActual * $desplazamiento;
                        $costoEstimado      = $costoActual * $desplazamiento;
                        $mcEstimado         = $mc * $desplazamiento;

                        if( $pPropuesto ) {
                            
                            $ventasEstimadasP   = $pPropuestoIVA * $desplazamiento;
                            $costoEstimadoP     = $costoActual * $desplazamiento;
                            $mcEstimadoP        = $mcPropuesto * $desplazamiento;

                        } else {  

                            $ventasEstimadasP   = $ventasEstimadas;
                            $costoEstimadoP     = $costoEstimado;
                            $mcEstimadoP        = $mcEstimado;

                        }
                        
                        // preparar datos para actualizar la tabla .

                 
                        $data = $this-> util -> sql([
                            'precioventa'               => number_format($pVentaActual,2,'.','') ,
                            'iva'                       => $ivaActual ,
                            'ieps'                      => $iepsActual ,
                            'costo'                     => number_format($costoActual,2,'.','') ,
                            'costo_porc'                => number_format($porcentajeCosto,2,'.',''),
                            'margencontribucion'        => number_format($mc,2,'.','') ,
                            'ventasestimadas'           => number_format($ventasEstimadas,2,'.','') ,
                            'costoestimado'             => number_format($costoEstimado,2,'.','') ,
                            'mc_estimado'               => number_format($mcEstimado,2,'.','') ,
                                                      
                            'ventasestimadas_propuesto' => number_format($ventasEstimadasP,2,'.','') ,
                            'costoestimado_propuesto'   => number_format($costoEstimadoP,2,'.','') ,
                            'mcestimado_propuesto'      => number_format($mcEstimadoP,2,'.','') ,
                            'mc_propuesto'              => number_format($mcPropuesto,2,'.','') ,
                            'costo_porc_propuesto'      => number_format($porcentajeCostoPropuesto,2,'.','') ,
                            'upd_receta'                => 1,
                            
                            'receta'                => $idReceta,
                            'MONTH ( fecha_costo )' => $mes,
                            'YEAR ( fecha_costo )'  => $year,
                        ],3);

                        $ok  = $this -> _Update($data,$this->costopotencial);



                        $row = [
                        'id'                 => 0,
                        // 'idx'                => $idReceta,
                        'Prod'               => $_key['nombre'],
                        'pVenta'       => $pVentaActual,
                        'pPropuesto'         => $pPropuesto,

                        'total'              => evaluar($receta['total']),

                        'desplazamiento'     => $productos['desplazamiento'],
                        'impuestos'          => ['text' => $impuestosActualFormat . ' | ' . $impuestosAnteriorFormat, 'class' => 'bg-default text-center'],
                        'precio Actual/ Ant' => ['text' => $pVentaActualFormat . ' | ' . $pVentaAnteriorFormat, 'class' => 'bg-warning-1 text-center'],
                        'costo Actual/ Ant'  => ['text' => $costoActualFormat . ' | ' . $costoAnteriorFormat, 'class' => 'bg-warning-1 text-center'],

                        '%Costo'          => number_format($porcentajeCosto,2,'.',''),
                        'mc'              => number_format($mc,2,'.',''),
                        'ventasEstimadas' => number_format($ventasEstimadas,2,'.',''),
                        'costoEstimado'   => number_format($costoEstimado,2,'.',''),
                        'ventasEstimadas' => number_format($ventasEstimadas,2,'.',''),
                        'mcEstimado'      => $mcEstimado,
                        'ok'              => $ok,
                        'opc'             => 0,

                        ];

                        // $data['opc'] = 0;
                        $__row[] =$row;
                    // endif;
                }
        
        endif;    
   
        endforeach;



        return [
            'th' => '',
            'row' => $__row,
            'recetas' => $lsRecetas
        ];

    }


   

  


}


function ticket_head($data) {

    $statusBtn = isset($data['totalDesplazamiento']) ?  '' : 'disabled';

    $conf  = getFilterDate([ 'mesPropuesto' => $_POST['Mes'],'anioPropuesto' => $_POST['Anio']]);

    $classDisabled = ($conf)  ? '' : 'disabled not-allowed';


    return '
    <a class="btn btn-soft btn-sm p-0 pointer" data-bs-toggle="collapsex" href="#gbOpciones" role="button" aria-expanded="false" aria-controls="gbOpciones"> <i class="icon-eye"></i> </a>
    <div class="row mb-3 collapsex"  id="gbOpciones">
 
    <div class="col-sm-3 col-12">
        <label>&nbsp;</label>
        <button  '. $statusBtn.'  class="btn btn-outline-primary col-12 '.$classDisabled.' btnPermisos" onclick="costsys.ejercicioMensual();">Ejercicio Mensual</button>
    </div>
   
    <div class="col-sm-3 col-12">
        <label>&nbsp;</label>
        <button class="btn btn-outline-info col-12 '.$classDisabled.' btnPermisos" onclick="costsys.preciosPropuestos();">Precio Propuesto</button>
    </div>
    
    <div class="col-sm-3 col-12">
        <label>&nbsp;</label>
        <button class="btn btn-outline-secondary col-12 ' . $classDisabled . ' btnPermisos" onclick="costsys.limpiarDesplazamientos();">Limpiar
            despl.</button>
    </div>

    <div class="col-sm-3 col-12">
        <label>&nbsp;</label>
        <button class="btn btn-soft ' . $classDisabled . ' disabled col-12" 
            id="updateListProductos" 
            onclick="costsys.actualizarProductosModificados();" > Actualizar productos </ button>
    </div>
   
    </div>
    ';

}


function getFilterDate($data){
    $mesActual  = intval(date('m'));
    $anioActual = date('Y');

    /*
        Los productos solo se pueden actualizar con un mes de diferencia hacia atrás.
        Obtenemos año y mes propuestos por el usuario y
        obtenemos la fecha con un mes de diferencia para realizar comparativo.
    */

    $mesAnterior  = $mesActual - 1;
    $anioAnterior = intval($anioActual) - 1;


    if (  intval($data['mesPropuesto']) == $mesActual && intval($data['anioPropuesto']) == intval($anioActual) ) {
        return 1;

    }else if ( intval($data['mesPropuesto']) == $mesAnterior && intval($data['anioPropuesto']) == intval($anioActual)) {
        
        return true;
    
    }
    if (intval($data['mesPropuesto']) == 12 && $data['anioPropuesto'] == $anioAnterior) {
        return true;
    }else {

        return 0;

    }

    


}





//  Parametros aplicados al costo potencial

function getDesplazamientoClass($desplazamiento, $desplazamientoPromedio) {
    if ($desplazamiento >= $desplazamientoPromedio && $desplazamiento != 0) {
        return 'bg-success-light';
    } else if ($desplazamiento < $desplazamientoPromedio && $desplazamiento != 0) {
        return 'bg-danger-light';
    }
    return '';
}

function verificarCostoDiferente($costoActual, $costoPotencial){
    
    $bgCostoDif           = '';
    $iconCosto            = '';
    $productosModificados = false;

    if (number_format($costoActual, 2) != number_format($costoPotencial, 2)) {
        
        $bgCostoDif = 'bg-warning-2 ';
        $productosModificados = true;
        $iconCosto = '<i style="font-size:.8em; " class="text-danger  icon-info-1" title="precio diferente: '.evaluar($costoActual).'  / '.$costoPotencial.'    "></i>';
    
    }

    return [

        'bgCostoDif'           => $bgCostoDif,
        'iconCosto'            => $iconCosto,
        'productosModificados' => $productosModificados
    
    ];
}

function determinarBgCosto($porcentajeCosto, $costoAlto, $costoBajo){
    $bgCosto = '';

    if ($porcentajeCosto >= $costoAlto) {
        $bgCosto = 'bg-danger-light';
    } elseif ($porcentajeCosto <= $costoBajo) {
        $bgCosto = 'bg-success-light';
    }

    return $bgCosto;
}

function determinarBgMC($mcPotencial, $mcAlto, $mcBajo){
    $bgMC = '';

    if ($mcPotencial >= $mcAlto) {
        $bgMC = 'bg-success-light';
    } elseif ($mcPotencial <= $mcBajo) {
        $bgMC = 'bg-danger-light';
    }

    return $bgMC;
}

// function evaluar($val)
// {
//     return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
// }

function evaluar2($val)
{
    return $val ? '' . number_format($val, 2, '.', ',') : '-';
}



// Instancia del objetzo

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);


