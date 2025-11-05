<?php
if (empty($_POST['opc'])) {
    exit(0);
}
 
require_once ('../mdl/mdl-costo-potencial.php');

class cuadroComparativo extends cuadroComp{

    private $conn;

    function lsEstadoResultado(){
        $mensualidad    = $_POST['mensualidad'];
        $promedioActivo = $_POST['promedioActivo'];


        # Declarar variables
            $__row = [];

            #Consultar a la base de datos
            $list = $this->selectCategorias($_POST['UDN']);

            // lists
            
        
            foreach ($list as $key) {
                $tableroControl = $this->selectTableroControl($key['idClasificacion'], $mensualidad);

                if($tableroControl):
                      $__row[] = array(
                        
                        'id'              => $key['idClasificacion'],
                        'MES'             => '<i class="ico'.$key['idClasificacion'].' icon-right-dir-1"></i>'.$key['Clasificacion'],
                        'COSTO POTENCIAL' => '',
                        'EDO RESULTADO'   => '',
                        'DIFERENCIA %'    => '',
                        'DIFERENCIA $'    => '',
                        "opc"             => 1
                    );
              

                // arreglo de datos:
                $sumaCostoPotencial = 0;
                $arrayCostoPotencial = array();
                $sumaEdoResultado = 0;
                $arrayEdoResultado = array();
                $contMeses = 0;
                
                foreach ($tableroControl as $tablero) {
                    $sumaCostoPotencial += $tablero['costoPotencialReal'];
                    $arrayCostoPotencial[] = $tablero['costoPotencialReal'];

                    $sumaEdoResultado += $tablero['ventasoficial'];
                    $arrayEdoResultado[] = $tablero['ventasoficial'];


                $contMeses++;
                }

                // $promedioCostoPotencial = $sumaCostoPotencial / $contMeses;
                // $promedioEdoResultado = $sumaEdoResultado / $contMeses;
                
                $promedioEdoResultados = $sumaEdoResultado / $contMeses;
                $promedioCostoPotencial = $sumaCostoPotencial / $contMeses;



            // desplegar costos:
                foreach ($tableroControl as  $tablero) {
                    $textDiferencia = '';

                    // calculos para el estado de resultados
                    $ventasEstimadas = $tablero['ventaEstimadaReal'];
                    $costoPotencial  = $tablero['costoPotencialReal'];
                    $edoResultado    = $tablero['ventasoficial'];

                    $diferenciaPercent = $edoResultado - $costoPotencial;
                    $diferenciaDollar = (($edoResultado / 100) - ($costoPotencial / 100)) * $ventasEstimadas;

                    // promedio Manual .
                    if($promedioActivo == 2):
                        $promedioManual = $this->selectPromedioManual([$key['idClasificacion']]);
                        
                        if (!isset($promedioManual['costopotencial1'])) {
                      
                            // $promedioCostoPotencial = $promedioCostoPotencial;
                      
                        } else {

                            $promedioCostoPotencial = $promedioManual['costopotencial1'];
                        }

                        if (!isset($promedioManual['estadoResultado'])) {
                        //     $promedioEdoResultados = $promedioEdoResultados;
                      
                        } else {
                            
                            $promedioEdoResultados = $promedioManual['estadoResultado'];
                        }
                    
                    
                    
                    endif; 
    
                    
                   

                // Aplicar filtros de color:
                    $bgCostoPotencial = $this->filterColorCostoPotencial($costoPotencial, $arrayCostoPotencial);

                    // Aplicar filtro del estado de resultado:

                    $bgEdoResultado = '';
                    $edoResultadoMinimo = min($arrayEdoResultado);
                    $edoResultadoMaximo = max($arrayEdoResultado);

                    if ($edoResultadoMaximo == $edoResultado) {
                        $bgEdoResultado = 'background:#BB1430;color:#FFF;';
                    } else if ($edoResultadoMinimo == $edoResultado) {
                        $bgEdoResultado = 'background:#0E8040;color:#FFF;';
                    } else if ($edoResultado < $promedioEdoResultados) {
                        $bgEdoResultado = 'background:#D3F0C7;';
                    } else if ($edoResultado > $promedioEdoResultados) {
                        $bgEdoResultado = 'background:#DEAAAC;';
                    }



                    if ($diferenciaPercent < 0) {
                        $textDiferencia = 'color:#CC0000;';
                    }
                
                    $__row[] = array(
                        
                        'id'              => $key['idClasificacion'],
                        'MES'             => formatSpanishDate($tablero['fechaMovimiento']),
                        
                        'COSTO POTENCIAL' => ['html' => evaluar($costoPotencial).'  %', 'class'  => ' text-end', 'style' => $bgCostoPotencial.' font-size:12px;'],
                        'EDO RESULTADO'   => ['html' => evaluar($edoResultado) . '  %', 'class'  => ' text-end', 'style' => $bgEdoResultado.' font-size:12px;'],


                        'DIFERENCIA %'    => ['html' => evaluar($diferenciaPercent) . '  %', 'class' => $textDiferencia.'  text-end','style'=> $textDiferencia.' font-size:12px;' ],
                        'DIFERENCIA $'    => ['html' => '$ '.evaluar($diferenciaDollar)    , 'class' => $textDiferencia.' text-end', 'style' => $textDiferencia.' font-size:12px;'],
                        
                        "opc"             => 0
                    );
                }

                if($promedioActivo==1):
                
                    $__row[] = array(
                        "id"              => $key['idClasificacion'],
                        'MES'             => 'Promedio de datos',
                        'COSTO POTENCIAL' => evaluar($promedioCostoPotencial).' %',
                        'EDO RESULTADO'   => evaluar($promedioEdoResultados) . ' %',
                        'DIFERENCIA %'    => '',
                        'DIFERENCIA $'    => '',
                        'opc'             => 2

                    );

                else:

                
                    $__row[] = array(
                        "id"              => $key['idClasificacion'],
                        'MES'             => 'Promedio de datos',
                        'COSTO POTENCIAL' => inputGroup([
                            'id'    => 'promedioManualCP',
                            'fn'    => 'updatePromedio',
                            'idClase'=> $key['idClasificacion'],
                            'valor' => number_format($promedioCostoPotencial, 2, '.', ',')
                        ]),
                        'EDO RESULTADO'   => inputGroup([

                            'id'    => 'promedioManualEdo',
                            'fn'    => 'updatePromedio',
                            'valor' => number_format($promedioEdoResultados, 2, '.', ',')
                        
                        ]),
                        
                        'DIFERENCIA %'    => '',
                        'DIFERENCIA $'    => '',
                        'opc'             => 2

                    );

                     


                endif;

               endif;
            }

                


            #encapsular datos
            return [
                "thead" => ['MES', 'COSTO POTENCIAL',
                 'EDO RESULTADO','DIFERENCIA %','DIFERENCIA $'],
                "row" => $__row,
                // "thead" => ''
            ];
       
    }

    function filterColorCostoPotencial($costoPotencial, $arrayCostoPotencial){

        $bgCostoPotencial = '';

        // Calcula la suma y el número de elementos
       
        $sumaCostoPotencial = array_sum($arrayCostoPotencial);
        $contMeses          = count($arrayCostoPotencial);

        // Calcula el promedio
        $promedioCostoPotencial = $sumaCostoPotencial / $contMeses;

        // Calcula el mínimo y el máximo
        $costoPotencialMinimo = min($arrayCostoPotencial);
        $costoPotencialMaximo = max($arrayCostoPotencial);

        // Determina el estilo basado en las condiciones
        if ($costoPotencialMaximo == $costoPotencial) {
            $bgCostoPotencial = 'background:#BB1430;color:#FFF;';
        } else if ($costoPotencialMinimo == $costoPotencial) {
            $bgCostoPotencial = 'background:#0E8040;color:#FFF;';
        } else if ($costoPotencial < $promedioCostoPotencial) {
            $bgCostoPotencial = 'background:#5EAA7F;';
        } else if ($costoPotencial > $promedioCostoPotencial) {
            $bgCostoPotencial = 'background:#DEAAAC;';
        }

        return $bgCostoPotencial;
        
    }

    function lsVentasCostos(){

        # Declarar variables
        $mensualidad    = $_POST['mensualidad'];
        $promedioActivo = $_POST['promedioActivo'];

        $__row = [];


        #Consultar a la base de datos
        $sqlClase = $this->selectCategorias($_POST['UDN']);



        foreach ($sqlClase as $key) {
            $idClase = $key['idClasificacion'];
            $tableroControl = $this->selectTableroControl($idClase, $mensualidad);

            if($tableroControl)
            
            $__row[] = array(
                'id'       => $key['idClasificacion'],
                'MES'      => $key['Clasificacion'],
                "colgroup" => true
            );


            $arrayCostoPotencial = array();
            $arrayEdoResultado = array();
            $sumaCostoPotencial = 0;
            $sumaEdoResultado = 0;
            $contMensualidad = 0;

            $tableroControl = $this ->selectTableroControl($idClase, $mensualidad);
            
            foreach ($tableroControl as $key => $tablero) {
                
                if (!isset($tablero['costoPotencialReal']) || $tablero['costoPotencialReal'] != 0) {
                    $costoPotencial = $tablero['costoPotencialReal'];
                    $arrayCostoPotencial[] = $costoPotencial;
                    $sumaCostoPotencial += $costoPotencial;

                    $edoResultado = $tablero['ventascosto'];
                    $arrayEdoResultado[] = $edoResultado;
                    $sumaEdoResultado += $edoResultado;

                    $contMensualidad++;
                }
            }

            $promedioCostoPotencial = $sumaCostoPotencial / $contMensualidad;
            $promedioEdoResultado = $sumaEdoResultado / $contMensualidad;



            // Recorrido por meses en el tablero de control Fogaza

        foreach ($tableroControl as $key => $tablero) {

            //  Guardar la información en una variable

            $ventasEstimadas = $tablero['ventaEstimadaReal'];
            $costoPotencial  = $tablero['costoPotencialReal'];
            $edoResultado    = $tablero['ventascosto'];

            $textDiferencia    = '';
            $diferenciaPercent = $edoResultado - $costoPotencial;
            $diferenciaDollar  = (($edoResultado / 100) - ($costoPotencial / 100)) * $ventasEstimadas;
            
            if ($diferenciaPercent < 0) {
                $textDiferencia = 'text-danger';
            }

                $bgCostoPotencial = '';
                $costoPotencialMinimo = min($arrayCostoPotencial);
                $costoPotencialMaximo = max($arrayCostoPotencial);


                if ($costoPotencialMaximo == $costoPotencial) {
                    $bgCostoPotencial = 'background:#BB1430;color:#FFF"';
                } else if ($costoPotencialMinimo == $costoPotencial) {
                    $bgCostoPotencial = 'background:#0E8040;color:#FFF"';
                } else if ($costoPotencial < $promedioCostoPotencial) {
                    $bgCostoPotencial = 'background:#D3F0C7;"';
                } else if ($costoPotencial > $promedioCostoPotencial) {
                    $bgCostoPotencial = 'background:#DEAAAC;"';
                }



                $bgEdoResultado = '';
                $edoResultadoMinimo = min($arrayEdoResultado);
                $edoResultadoMaximo = max($arrayEdoResultado);


                if ($edoResultadoMaximo == $edoResultado) {
                    $bgEdoResultado = 'background:#BB1430; ';
                } else if ($edoResultadoMinimo == $edoResultado) {
                    $bgEdoResultado = 'background:#0E8040; "';
                } else if ($edoResultado < $promedioEdoResultado) {
                    $bgEdoResultado = 'background:#D3F0C7; ';
                } else if ($edoResultado > $promedioEdoResultado) {
                    $bgEdoResultado = 'background:#DEAAAC; ';
                }




            $__row[] = array(

            'id' => '',
            'MES'             => formatSpanishDate($tablero['fechaMovimiento']),
            'COSTO POTENCIAL' => ['html' => evaluar($costoPotencial) . '  %', 'class' => ' text-end', 'style' => $bgCostoPotencial . ' font-size:12px;'],
            'EDO RESULTADO'   => ['html' => evaluar($edoResultado) . '  %', 'class' => ' text-end', 'style' => $bgEdoResultado . ' font-size:12px;'],
            'DIFERENCIA %'    => ['html' => evaluar($diferenciaPercent) . '  %', 'class' => $textDiferencia . '  text-end', 'style' => $textDiferencia . ' font-size:12px;'],
            'DIFERENCIA $'    => ['html' => '$ ' . evaluar($diferenciaDollar), 'class' => $textDiferencia . ' text-end', 'style' => $textDiferencia . ' font-size:12px;'],
            "opc" => 0
            );
        }



        }            



        #encapsular datos
        return [
            "thead" => [
                'MES',
                'COSTO POTENCIAL',
                'VENTAS Y COSTOS    ',
                'DIFERENCIA %',
                'DIFERENCIA $'
            ],
            "row" => $__row,
            // "thead" => ''
        ];

    }

   


}

// Instancia del objeto

$obj    = new cuadroComparativo();
$fn     = $_POST['opc'];
$encode = $obj -> $fn();

// Print JSON :
echo json_encode($encode);


// Complementos .

function inputGroup($data = [])
{


    return '
            <div class="input-group input-group-sm ">
            <input disabled id="' . $data['id'] . '"  idClase="' . $data['idClase'] . '" type="text" 
            class="form-control fw-bold text-primary text-end" placeholder="0.00" 
            value="' . $data['valor'] . '" 
            onkeyUp="cuadro.' . $data['fn'] . '(event.target)">
            <span class="input-group-text fw-bold" id="basic-addon1"> %</span>
            </div> ';
}

function formatSpanishDate($fecha = null)
{
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    $formatoFecha = "%b - %Y"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}

function evaluar($val)
{
    return $val ? '' . number_format($val, 2, '.', ',') : '-';
}


