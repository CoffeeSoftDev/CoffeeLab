<?php
if (empty($_POST['opc']))
    exit(0);

// incluir modelo
require_once ('../mdl/mdl-costo-potencial.php');
require_once ('../../conf/_Utileria.php');


class ctrl extends TableroControl{
    public $util;

    public function __construct(){
        parent::__construct(); // Llama al constructor de la clase padre
        $this->util = new Utileria(); // Inicializa la propiedad util
    }
    /* Tablero de control */
    function lsTableroControl(){

        # Declarar variables
        $udn = $_POST['UDNs'];
        $mes = $_POST['Mes'];
        $year = $_POST['Anio'];
        $idClasificacion = $_POST['Clasificacion'];

        $__row = [];

        $data = [
            $idClasificacion,
            $mes,
            $year
        ];

        $tablero = $this->selectTablero($data);

        // Costo potencial :

        $costoPotencialActual = $tablero['costoPotencialReal'];
        $costoPotencialPropuesto = $tablero['costoPotencialPropuesto'];
        $diferenciaCostoPotencial = $costoPotencialActual - $costoPotencialPropuesto;
        //VENTAS ESTIMADAS
        $ventaEstimadaActual = $tablero['ventaEstimadaReal'];
        $ventaEstimadaPropuesta = $tablero['ventaEstimadaPropuesta'];
        $diferenciaVentaEstimada = $ventaEstimadaActual - $ventaEstimadaPropuesta;
        //COSTO ESTIMADAS
        $costoEstimadaActual = $tablero['costoEstimadoReal'];
        $costoEstimadaPropuesta = $tablero['costoEstimadoPropuesto'];
        $diferenciaCostoEstimada = $costoEstimadaActual - $costoEstimadaPropuesta;
        //VENTAS
        $ventaCosto = $tablero['ventascosto'];
        $diferenciaVentasCostos = (($ventaCosto / 100) - ($costoPotencialActual / 100)) * $ventaEstimadaActual;
        $ventasOficial = $tablero['ventasoficial'];
        $diferenciaVentasOficial = (($ventasOficial / 100) - ($costoPotencialActual / 100)) * $ventaEstimadaActual;

        // Porcentaje de costos % :
        $countProductos           = $this->countRecetas($udn, $idClasificacion);
        $costoProduccionAlto      = $tablero['CostoProduccionAlto'];

        $data_costo = [$udn, $idClasificacion,$mes,$year];


        $countPorcentajeCostoAlto = $this->countPorcentajeCostoAlto($data_costo, $costoProduccionAlto);
        $porcentajeTotalCostoAlto = ($countPorcentajeCostoAlto / $countProductos) * 100;
        $costoProduccionBajo      = $tablero['CostoProduccionBajo'];
        $countPorcentajeCostoBajo = $this->countPorcentajeCostoBajo($data_costo, $costoProduccionBajo);
        $porcentajeTotalCostoBajo = ($countPorcentajeCostoBajo / $countProductos) * 100;



        $mcEstimadoActual    = $tablero['mcEstimadoReal'];
        $mcEstimadoPropuesto = $tablero['mcEstimadoPropuesto'];

        $diferenciaMCEstimado = $mcEstimadoActual - $mcEstimadoPropuesto;
          // $sumaMC                = $obj->sumaMC($data);
          // $mcPromedio            = $sumaMC / $countProductos;
        $mcAlto                = $tablero['MargenContribucionAlto'];
        $countPorcentajeMCAlto = $this->countMCAlto($data, $mcAlto);
        $porcentajeTotalMCAlto = ($countPorcentajeMCAlto / $countProductos) * 100;

        $mcBajo                = $tablero['MargenContribucionBajo'];
        $countPorcentajeMCBajo = $this->countMCBajo($data, $mcBajo);
        $porcentajeTotalMCBajo = ($countPorcentajeMCBajo / $countProductos) * 100;

        $desplazamientoPromedio          = $tablero['desplazamientoPromedio'];



        $productosProducidos             = $this->countProductosProducidos([$udn,$idClasificacion, $mes, $year]);




        $porcentajeProductosProducidos   = ($productosProducidos / $countProductos) * 100;
        $productosNoProducidos           = $countProductos - $productosProducidos;
        $porcentajeProductosNoProducidos = ($productosNoProducidos / $countProductos) * 100;

        // $ventaPromedioReal       = $ventaEstimadaActual / $productosProducidos;
        // $ventaPromedioPropuesto  = $ventaEstimadaPropuesta / $productosProducidos;
        // $diferenciaVentaPromedio = $ventaPromedioReal - $ventaPromedioPropuesto;

        // $mcPromedioReal       = $mcEstimadoActual / $productosProducidos;
        // $mcPromedioPropuesto  = $mcEstimadoPropuesto / $productosProducidos;
        // $diferenciaMCPromedio = $mcPromedioReal - $mcPromedioPropuesto;

        $__row = array(


            array(
                'id' => 0,
                'control' => 'Costo Potencial',
                'actual' => evaluar2($tablero['costoPotencialReal']) . ' %',
                'propuesta' => evaluar2($tablero['costoPotencialPropuesto']) . ' %',
                'diferencia' => evaluar2($diferenciaCostoPotencial),
                "opc" => 0

            ),

            array(
                'id'         => 0,
                'control'    => 'Ventas estimadas',
                'actual'     => evaluar($tablero['ventaEstimadaReal']),
                'propuesta'  => evaluar($tablero['ventaEstimadaPropuesta']),
                'diferencia' => evaluar($diferenciaVentaEstimada),
                'opc'        => 0
            ),

            array(
                'id' => 0,
                'control' => 'Costo estimado',
                'actual' => evaluar($tablero['costoEstimadoReal']),
                'propuesta' => evaluar($tablero['costoEstimadoPropuesto']),
                'diferencia' => evaluar($diferenciaCostoEstimada),
                'opc' => 0
            ),

            // Separador
            
            array(
                'id' => 0,
                'control' => ' ',
                "colgroup" => true
            ),


            array(
                'id' => 'costo_ventas',
                'control' => 'Costo de producción (ventas y costo)',
                'actual' => $this->inputGroup(['fn' => 'setTablero', 'idTablero' => $tablero['idTablero'], 'id' => 'ventasCosto', 'valor' => $ventaCosto]),
                'propuesta' => '',
                'diferencia' => evaluar($diferenciaVentasCostos),
                "opc" => 0
            ),

            array(
                'id' => 'costo_oficial',
                'control' => 'Costo de ventas oficial',
                'actual' => $this->inputGroup(['fn' => 'setTablero', 'idTablero' => $tablero['idTablero'], 'id' => 'costoOficial', 'valor' => $ventasOficial]),
                'propuesta' => '',
                'diferencia' => evaluar($diferenciaVentasOficial),
                "opc" => 0
            ),


            array(
                'id' => 'costo_prod_alto',
                'control' => 'Costo de producción alto',
                'actual' => $this->inputGroup(['fn' => 'setCostoTablero', 'idTablero' => $tablero['idTablero'], 'name' => 'CostoProduccionAlto', 'valor' => $costoProduccionAlto]),
                'propuesta' => evaluar2($countPorcentajeCostoAlto),
                'diferencia' => evaluar2($porcentajeTotalCostoAlto) . '%',
                "opc" => 0
            ),

            array(
                'id' => 'costo_prod_bajo',
                'control' => 'Costo de producción bajo',
                'actual' => $this->inputGroup(['fn' => 'setCostoTablero', 'idTablero' => $tablero['idTablero'], 'name' => 'CostoProduccionBajo', 'valor' => $costoProduccionBajo]),
                'propuesta' => evaluar2($countPorcentajeCostoBajo),
                'diferencia' => evaluar2($porcentajeTotalCostoBajo) . ' %',

                "opc" => 0
            ),


            // Separador
            array(
                'id' => 0,
                'control' => ' ',
                "colgroup" => true
            ),

        //     array(
        //         'id' => 0,
        //         'control' => 'Margen de contribución estimado',
        //         'actual' => evaluar($mcEstimadoActual),
        //         'propuesta' => evaluar($mcEstimadoPropuesto),
        //         'diferencia' => evaluar($diferenciaMCEstimado),
        //         "opc" => 0

        //     ),




        //     array(
        //         'id' => 0,
        //         'control' => 'Margen de contribución promedio',
        //         'actual' => evaluar($mcPromedioReal),
        //         'propuesta' => '',
        //         'diferencia' => '',
        //         "opc" => 0

        //     ),

            array(
                'id'         => 'MargenContribucionAlto',
                'control'    => 'Margen de contribución alto',
                'actual'     => $this->inputGroup(['fn' => 'setMargenContribucion', 'idTablero' => $tablero['idTablero'], 'name' => 'MargenContribucionAlto', 'valor' => $mcAlto]),
                'propuesta'  => $countPorcentajeMCAlto,
                'diferencia' => evaluar2($porcentajeTotalMCAlto) . ' %',
                "opc"        => 0

            ),

            array(

                'id'         => 'MargenContribucionBajo',
                'control'    => 'Margen de contribución bajo',
                'actual'     => $this->inputGroup(['fn' => 'setMargenContribucion', 'idTablero' => $tablero['idTablero'], 'name' => 'MargenContribucionBajo', 'valor' => $mcBajo]),
                'propuesta'  => $countPorcentajeMCBajo,
                'diferencia' => evaluar2($porcentajeTotalMCBajo) . ' %',
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
                'control' => 'Desplazamiento promedio',
                'actual' => number_format($desplazamientoPromedio, 2),
                'propuesta' => '',
                'diferencia' => '',
                'opc' => 0
            ),

            array(
                'id' => 0,
                'control' => 'Cantidad de productos',
                'actual' => $countProductos,
                'propuesta' => '',
                'diferencia' => '',
                'opc' => 0
            ),

            array(
                'id' => 0,
                'control' => 'Productos producidos',
                'actual' => $productosProducidos,
                'propuesta' => evaluar2($porcentajeProductosProducidos) . ' %',
                'diferencia' => '',
                'opc' => 0
            ),

            [
                'id' => 0,
                'control' => 'Productos no producidos',
                'actual' => $productosNoProducidos,
                'propuesta' => evaluar2($porcentajeProductosNoProducidos) . ' %',
                'diferencia' => '',
                'opc' => 0
            ],

            [
                'id' => 0,
                'control' => 'Venta promedio por producto',
                'actual' => evaluar($ventaPromedioReal),
                'propuesta' => evaluar($ventaPromedioPropuesto),
                'diferencia' => $diferenciaVentaPromedio,
                'opc' => 0
            ],

            //     [
            //         'id' => 0,
            //         'control' => 'Margen de contribución promedio por producto',
            //         'actual' => evaluar($mcPromedioReal),
            //         'propuesta' => evaluar($mcPromedioPropuesto),
            //         'diferencia' => evaluar($diferenciaMCPromedio),
            //         'opc' => 0
            //     ],





        );

        #encapsular datos
        return [
            "thead" => ['control', 'actual', 'propuesta', 'diferencia'],
            "row" => $__row,
            "frm_head" => 'Conectado a ' . $this->bd
        ];
    }

    function setTablero(){
        $data = $this->util::sql($_POST, 1);
        $ok = $this->updateVentasCostos($data);


        // obtener nueva informacion del tablero.
        $tablero = $this->selectDatosTablero([$_POST['idTablero']]);

        $costoPotencialActual = $tablero['costoPotencialReal'];
        $ventaEstimadaActual = $tablero['ventaEstimadaReal'];

        $ventaCosto = $tablero['ventascosto'];
        $ventasOficial = $tablero['ventasoficial'];
        $diferenciaVentasCostos = (($ventaCosto / 100) - ($costoPotencialActual / 100)) * $ventaEstimadaActual;
        $diferenciaVentasOficial = (($ventasOficial / 100) - ($costoPotencialActual / 100)) * $ventaEstimadaActual;

        return [

            'ok' => $ok,
            'diferenciaVentasCostos' => evaluar($diferenciaVentasCostos),
            'diferenciaVentasOficial' => evaluar($diferenciaVentasOficial),


        ];


    }

    function setCostoTablero() {

        $count = $this   ->countRecetas($_POST['UDNs'], $_POST['Clasificacion']);
        $tablero = $this ->selectDatosTablero([$_POST['idTablero']]);

    
            $values = [
              $_POST['ipt'] => $_POST['valor'],
              'idTablero' => $_POST['idTablero'],      
            ];

            $data = $this->util :: sql($values, 1);

            $ok = $this->updateEstadoCosto($data);
      


        return [

            'ok'         => $ok,
            'count'      => '',
            'porcentaje' => '%',


        ];
    }

    function setMargenContribucion(){

        $array    = [$_POST['UDNs'],$_POST['Clasificacion'], $_POST['Mes'], $_POST['Anio']];
        
        $tablero        = $this->selectDatosTablero([$_POST['idTablero']]);
        $countProductos = $this->countRecetas($_POST['UDNs'], $_POST['Clasificacion']);
        
        $values = [

            $_POST['ipt'] => $_POST['valor'],
            'idTablero'   => $_POST['idTablero'],
        
        ];

        // actualizar margen de contribución

        $data = $this-> util -> sql($values, 1);
        $ok   = $this-> updtMargenContribucion($data);


        // Calcular porcentaje.
        $mc = $tablero[$_POST['ipt']];

        if($_POST['ipt'] == 'MargenContribucionAlto'):
            $count = $this->countMCAlto($array, $mc);
        else:
            $count = $this->countMCBajo($array, $mc);    
        
        endif;

        $porcentaje = ($count / $countProductos) * 100;




        return [

            'ok'         => $_POST['ipt'],
            'count'      => $count,
            'porcentaje' => evaluar2($porcentaje),

        ];


    }

    function inputGroup($data = []){


        return '
            <div class="input-group input-group-sm ">
            <input id="' . $data['id'] . '"  idTablero="' . $data['idTablero'] . '" type="text" 
            class="form-control fw-bold text-primary text-end" placeholder="0.00" 
            value="' . $data['valor'] . '" 
            name = "' . $data['name'] . '"
            onkeyUp="tablero.' . $data['fn'] . '(event.target)">
            <span class="input-group-text fw-bold" id="basic-addon1"> %</span>
            </div> ';
    }
    
}


function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

function evaluar2($val){
    return $val ? '' . number_format($val, 2, '.', ',') : '-';
}



// Instancia del objeto

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);