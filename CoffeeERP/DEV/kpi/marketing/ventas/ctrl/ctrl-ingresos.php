<?php
session_start();
if (empty($_POST['opc'])) exit(0);


header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

require_once '../mdl/mdl-ingresos.php';
require_once('../../conf/coffeSoft.php');

class ctrl extends mdl {

    function init(){

        return [
            'udn' => $this -> lsUDN()
        ];
    }

    function list() {
        $type = $_POST['type'];

        switch ($type) {
            case 1:
                return $this->resumenIngresosPorDia();
            case 2:
                return $this->lsIngresosCaptura();
            case 3:
                return $this->PromediosDiarios();
            default:
                return ["error" => "Tipo no reconocido"];
        }
    }


    function lsIngresosCaptura() {
        $fi = new DateTime($_POST['anio'].'-' . $_POST['mes'] . '-01');
        $hoy = clone $fi;
        $hoy->modify('last day of this month');

        $__row = [];

        while ($fi <= $hoy) {
            $idRow++;
            $fecha = $fi->format('Y-m-d');


            $softVentas = $this->getsoftVentas([$_POST['udn'], $fecha]);
            $idVentas   = $softVentas['id_venta'];

            $row = [
                'id'     => $idRow,
                'fecha'  => $fecha,
                'dia'    => formatSpanishDay($fecha),
                'Estado' => $softVentas['id_venta']
                    ? '<i class="icon-ok-circled-2 text-success"></i>'
                    : '<i class="icon-info-circled-3 text-orange-500"></i>',
            ];

            if ($_POST['udn'] == 1) {
                $total = $softVentas['Hospedaje'] + $softVentas['AyB'] + $softVentas['Diversos'];
                $grupo = $this->createdGroups(['noHabitaciones', 'Hospedaje', 'AyB', 'Diversos'], $softVentas, $idVentas);
                $grupo['total'] = evaluar($total);
                $grupo['opc'] = 0;
            } elseif ($_POST['udn'] == 5) {
                $total          = $softVentas['alimentos'] + $softVentas['bebidas'] + $softVentas['guarniciones'] + $softVentas['sales'] + $softVentas['domicilio'];
                $grupo          = createdGroups(['noHabitaciones', 'alimentos', 'bebidas', 'guarniciones', 'sales', 'domicilio'], $softVentas, $idVentas);
                $grupo['total'] = evaluar($total);
                $grupo['opc']   = 0;

            } else {
                $grupo = [
                    'alimentos' => createElement('input', [
                        'name' => 'alimentos',
                        'value' => number_format($softVentas['alimentos'], 2, '.', ''),
                        'onkeyup' => "ingresosDiarios.setVentas(event, $idVentas)"
                    ]),
                    'bebidas' => createElement('input', [
                        'name' => 'bebidas',
                        'value' => number_format($softVentas['bebidas'], 2, '.', ''),
                        'onkeyup' => "ingresosDiarios.setVentas(event, $idVentas)"
                    ]),
                    'No habitaciones' => createElement('input', [
                        'name' => 'noHabitaciones',
                        'value' => $softVentas['noHabitaciones'],
                        'onkeyup' => "ingresosDiarios.setVentas(event, $idVentas)"
                    ]),
                    'Total' => evaluar($softVentas['bebidas'] + $softVentas['alimentos']),
                    'opc' => 0
                ];
            }

            $__row[] = array_merge($row, $grupo);
            $fi->modify('+1 day');
        }

        return [
            "row" => $__row,
            "thead" => '',
            "frm_head" => "<strong>Conectado a: </strong> {$this->bd}"
        ];
    }

    function resumenIngresosPorDia() {
        $__row = [];
        $days = [2 => 'Lunes', 3 => 'Martes', 4 => 'Miércoles', 5 => 'Jueves', 6 => 'Viernes', 7 => 'Sábado', 1 => 'Domingo'];

        // Inicializar totales
        $totalFields = [
            'Hospedaje'    => 0,
            'AyB'          => 0,
            'Diversos'     => 0,
            'alimentos'    => 0,
            'bebidas'      => 0,
            'complementos' => 0,
            'total'        => 0,
            'totalGral'    => 0,
            'noHabitaciones' => 0
        ];

        foreach ($days as $noDias => $Days) {
            $lsDays = $this->getIngresosDayOfWeek([$_POST['udn'], $_POST['anio'], $_POST['mes'], $noDias]);

            foreach ($lsDays as $key) {
                if ($_POST['udn'] == 1) {
                    $totalFields['Hospedaje']   += $key['Hospedaje'];
                    $totalFields['AyB']         += $key['AyB'];
                    $totalFields['Diversos']    += $key['Diversos'];
                    $totalFields['total']       += $key['total'];
                    $totalFields['noHabitaciones'] += $key['noHabitaciones'];

                    $__row[] = [
                        'id'               => $noDias,
                        'fecha'            => $key['fecha'],
                        'Dia de la semana' => $Days,
                        'Hospedaje'        => evaluar($key['Hospedaje']),
                        'AyB'              => evaluar($key['AyB']),
                        'Diversos'         => evaluar($key['Diversos']),
                        'No habitaciones'  => $key['noHabitaciones'],
                        'Total'            => evaluar($key['total']),
                        'opc'              => 0
                    ];
                } elseif ($_POST['udn'] == 5) {
                    $totalFields['alimentos']    += $key['alimentos'];
                    $totalFields['bebidas']      += $key['bebidas'];
                    $totalFields['complementos'] += $key['complementos'];
                    $totalFields['total']        += $key['total'];

                    $__row[] = [
                        'id'               => $noDias,
                        'fecha'            => $key['fecha'],
                        'Dia de la semana' => $Days,
                        'alimentos'        => evaluar($key['alimentos']),
                        'bebidas'          => evaluar($key['bebidas']),
                        'complementos'     => evaluar($key['complementos']),
                        'Total'            => evaluar($key['total']),
                        'opc'              => 0
                    ];
                } else {
                    $totalFields['alimentos']    += $key['alimentos'];
                    $totalFields['bebidas']      += $key['bebidas'];
                    $totalFields['totalGral']    += $key['totalGral'];
                    $totalFields['noHabitaciones'] += $key['noHabitaciones'];

                    $__row[] = [
                        'id'               => $noDias,
                        'fecha'            => $key['fecha'],
                        'Dia de la semana' => $Days,
                        'alimentos'        => evaluar($key['alimentos']),
                        'bebidas'          => evaluar($key['bebidas']),
                        'No habitaciones'  => ['html'=>$key['noHabitaciones'],'class'=>'text-center'],
                        'total'            => evaluar($key['totalGral']),
                        'opc'              => 0
                    ];
                }
            }

            $__row[] = [
                'id'       => '',
                'fecha'    => '',
                'colgroup' => true
            ];
        }

        // Agregar fila de totales al final
        if ($_POST['udn'] == 1) {
            $__row[] = [
                'id'               => '',
                'fecha'            => 'Totales',
                'Dia de la semana' => '',
                'Hospedaje'        => evaluar($totalFields['Hospedaje']),
                'AyB'              => evaluar($totalFields['AyB']),
                'Diversos'         => evaluar($totalFields['Diversos']),
                'No habitaciones'  => $totalFields['noHabitaciones'],
                'Total'            => evaluar($totalFields['total']),
                'opc'              => 1
            ];
        } elseif ($_POST['udn'] == 5) {
            $__row[] = [
                'id'               => '',
                'fecha'            => 'Totales',
                'Dia de la semana' => '',
                'alimentos'        => evaluar($totalFields['alimentos']),
                'bebidas'          => evaluar($totalFields['bebidas']),
                'complementos'     => evaluar($totalFields['complementos']),
                'Total'            => evaluar($totalFields['total']),
                'opc'              => 1
            ];
        } else {
            $__row[] = [
                'id'               => '',
                'fecha'            => 'Totales',
                'Dia de la semana' => '',
                'alimentos'        => evaluar($totalFields['alimentos']),
                'bebidas'          => evaluar($totalFields['bebidas']),
                'No habitaciones'  => ['html'=>$totalFields['noHabitaciones'],'class'=>'text-center'],
                'total'            => evaluar($totalFields['totalGral']),
                'opc'              => 1
            ];
        }

        return [
            "thead"    => $this->get_th_ingresos(),
            "row"      => $__row,
            "frm_head" => ''
        ];
    }

    function PromediosDiarios(){
         # Declarar variables
        $__row        = [];
        $mesCompleto  = $_POST['monthText'];
        $Anio         = $_POST['anio'];
        $AnioAnterior = $Anio-1;
        $udn          = $_POST['udn'];
        $__row        = [];
        $days         = listDays();

        $month = [
            'currentMonth'  => ['year'=> $Anio, 'month'=>$_POST['mes']],
            'previousMonth' => ['year'=> $AnioAnterior, 'month'=>$_POST['mes']],
        ];

        // consultas individuales.
        if($udn == 1):
            $consultas = array(
                'totalGeneral'      => 'Suma de ingresos',
                'totalHospedaje'    => 'ingreso de Hospedaje',
                'totalAyB'          => 'ingreso AyB',
                'totalDiversos'     => 'ingreso Diversos',
                'totalHabitaciones' => 'Habitaciones',
                'group'             => '',
                'porcAgrupacion'          => '% Ocupacion',
                'tarifaEfectiva'          => 'Tarifa efectiva acumulada',
                'chequePromedio'          => 'Cheque Promedio',
                'chequePromedioHospedaje' => 'chequePromedioHospedaje',
                'chequePromedioAyB'       => 'cheque Promedio AyB',
                'chequePromedioDiversos'  => 'cheque Promedio Diversos',
            );
        else:

              $consultas = array(
                  'totalHabitaciones'       => 'Clientes',
                  'totalGralAyB'            => 'Ventas AyB',
                  'totalAlimentos'          => 'Ventas alimentos',
                  'totalBebidas'            => 'Ventas bebidas',
                  'group'                   => '',
                  'chequePromedioAyB'       => 'Cheque Promedio AyB',
                  'chequePromedioAlimentos' => 'Cheque Promedio Alimentos',
                  'chequePromedioBebidas'   => 'Cheque Promedio Bebidas',
                  'group'                   => '',

              );
        endif;

        foreach ($consultas as $key => $titulo) {

            $row   = [];
            $meses = [];

            if ($key != 'group'):

                // Datos base del concepto
                $base = [
                    'id'       => $key,
                    'concepto' => $titulo
                ];

                // Recorrer los meses
                foreach ($month as $_key => $fecha):

                    $total_days = cal_days_in_month(CAL_GREGORIAN, $fecha['month'], $fecha['year']);
                    $ventas     = $this->ingresosMensuales([$udn, $fecha['year'], $fecha['month']]);

                    $value = $this->getCalculoPorConcepto($key, $ventas, $total_days);

                    $meses[$_key] = [
                        'val'   => $value,
                        'text'  => ($key == 'totalHabitaciones') ? $value : evaluar($value),
                        'class' => 'text-end'
                    ];

                endforeach;

                // Calcular diferencia actual - anterior
                $diferencia    = $meses['currentMonth']['val'] - $meses['previousMonth']['val'];
                $meses['dif']  = ($key == 'totalHabitaciones') ? $diferencia : evaluar($diferencia);
                $meses['opc']  = 0;

                // Combinar datos base con meses
                $row[]  = array_merge($base, $meses);
                $__row  = array_merge($__row, $row);

            else:
                $__row[] = [
                    'id'       => 0,
                    'Concepto' => '',
                    'colgroup' => true
                ];
            endif;
        }


        // Encapsular arreglos
        return [
            "thead" => [
                'Concepto ',
                $mesCompleto . ' / ' . $Anio,
                $mesCompleto . ' / ' . $AnioAnterior,
                'Diferencia'
            ],
            "row" => $__row,
        ];
    }

    // Comparativas Mensuales.

    function getCalculoPorConcepto($key, $ventas, $days) {

        $chequePromedioHospedaje = ($ventas['totalHabitaciones'] != 0) ? $ventas['totalHospedaje'] / $ventas['totalHabitaciones'] : 0;
        $chequePromedioAyB       = ($ventas['totalHabitaciones'] != 0) ? $ventas['totalAyB'] / $ventas['totalHabitaciones'] : 0;
        $chequeDiversos          = ($ventas['totalHabitaciones'] != 0) ? $ventas['totalDiversos'] / $ventas['totalHabitaciones'] : 0;
        $chequePromedio          = ($ventas['totalHabitaciones'] != 0) ? $ventas['totalGeneral'] / $ventas['totalHabitaciones'] : 0;

        switch ($key) {

            case 'porcAgrupacion':
                return ($days != 0) ? ($ventas['totalHabitaciones'] / $days / 12) * 100 : 0;

            case 'chequeDiversos':
                return $chequeDiversos;

            case 'chequePromedioHospedaje':
                return $chequePromedioHospedaje;

            case 'chequePromedioAyB':
                return $chequePromedioAyB;

            case 'chequePromedioAlimentos':
                return ($ventas['totalHabitaciones'] != 0) ? $ventas['totalAlimentos'] / $ventas['totalHabitaciones'] : 0;

            case 'chequePromedioBebidas':
                return ($ventas['totalHabitaciones'] != 0) ? $ventas['totalBebidas'] / $ventas['totalHabitaciones'] : 0;

            case 'chequePromedio':
                return $chequePromedio;

            case 'tarifaEfectiva':
                return ($days != 0) ? ($ventas['totalGeneral'] / 12) / $days : 0;

            default:
                return isset($ventas[$key]) ? $ventas[$key] : null;
        }
    }




    // Comparativas mensuales.
    function listComparative() {
        $type    = $_POST['type'];


        $data = ($type == "1")
            ? $this->ComparativaMensual()
            :  $this->ComparativaMensualPromedios();

        return $data;
    }

    function ComparativaMensual(){

        $Mes          = $_POST['mes'];
        $mesCompleto  = $_POST['mesCompleto'];
        $Anio         = $_POST['anio'];
        $AnioAnterior = $Anio - 1;
        $days         = listDays();
        $__row        = [];

        if($_POST['udn'] == 1){
            $consultas = [
                'totalGeneral'   => 'totalGeneral',
                'totalHospedaje' => 'totalHospedaje',
                'totalAyB'       => 'AyB',
                'totalDiversos'  => 'totalDiversos'
            ];
        } else {
            $consultas = [
                'totalAyB'       => 'AyB',
                'totalAlimentos' => 'total Alimentos',
                'totalBebidas'   => 'total Bebidas',
            ];
        }

        $month = [
            'currentMonth'   => ['year'=> $Anio, 'month'=>$_POST['mes']],
            'previousMonth'  => ['year'=> $AnioAnterior, 'month'=>$_POST['mes']],
        ];

        foreach ($consultas as $key => $value) {
            $__row[] = ['id' => $key, 'dayOfWeek' => $value, 'colgroup' => true];

            foreach ($days as $noDias => $Days){
                $campos = ['id' => $noDias, 'dayOfWeek' => $Days];
                $meses = [];

                foreach($month as $titulo => $_date){

                    $ingresoDiario = $this->ingresoPorDia([$_POST['udn'],$_date['year'],$_date['month'], $noDias]);

                    $promedio = ($ingresoDiario['totalDias'] != 0)
                        ? $ingresoDiario[$key] / $ingresoDiario['totalDias']
                        : $ingresoDiario[$key];

                    $meses[$titulo] = ['text' => evaluar($promedio), 'val' => $promedio,'class' => 'text-end'];
                }

                $diferencia   = evaluar($meses['currentMonth']['val'] - $meses['previousMonth']['val']);

                $meses['dif'] = [ 'html'=> $diferencia , 'class' => 'text-end px-2'];
                $meses['opc'] = 0;

                $__row[] = array_merge($campos, $meses);
            }
        }

        return [
            'view'  => $data,
            // 'thead' => [],
            'thead' => ['DIA', $mesCompleto . ' / ' . $Anio, $mesCompleto . ' / ' . $AnioAnterior, 'DIFERENCIA'],
            'row'   => $__row
        ];
    }

    function ComparativaMensualPromedios(){
          $Mes          = $_POST['mes'];
          $mesCompleto  = $_POST['mesCompleto'];
          $Anio         = $_POST['anio'];
          $AnioAnterior = $Anio - 1;
          $days         = listDays();
          $__row = [];

        $month = [
            'currentMonth' => ['year'=>$Anio, 'month'=>$_POST['mes']],
            'previousMonth'=> ['year'=>$AnioAnterior, 'month'=>$_POST['mes']],
        ];

        $consultas = ['Cheque Prom. Hosp' => 'chequePromHospedaje'];

        foreach ($consultas as $key => $value) {
            $row  = [];
            $row[] = ['id'=> 0,'dayOfWeek'=> $key,'colgroup'=> true];

            foreach ($days as $noDias => $Days){
                $campos = ['id' => $noDias, 'dayOfWeek' => $Days];
                $meses = [];

                foreach($month as $titulo => $getFecha){
        //     //         $lsPromedios = $this->lsPromediosAcomulados(['Anio' => $getFecha['year'], 'Mes' => $getFecha['month']]);
        //     //         $val = getPromedioDia(($noDias-1),$lsPromedios,$value);

                    $meses[$titulo] = ['text' => evaluar($val,''), 'val' => $val];
                }

                $meses['dif'] = 0;
                $meses['opc'] = 0;
                $row[] = array_merge($campos,$meses);
            }

            $__row = $row;


        //     // $res = pintarValPromedios($row,['currentMonth','previousMonth']);
            // $__row = array_merge($__row, $res);
        }

        return [
            // 'thead' => ['DIA', $mesCompleto . ' / ' . $Anio, $mesCompleto . ' / ' . $AnioAnterior, 'DIFERENCIA'],
            'row'   => $__row,
            // 'data'  => $lsPromedios,
            'ok'    => $ok
        ];
    }

     function lsPromediosAcomulados($array){


        $udn = $_POST['UDN'];
        # -- variables para fechas
        $fi = new DateTime($array['Anio'] . '-' . $array['Mes'] . '-01');

        $hoy = clone $fi;

        $hoy->modify('last day of this month');
        $__row = [];


        while ($fi <= $hoy) {
            $idRow++;
            $fecha = $fi->format('Y-m-d');

            // $softVentas = $this->getsoft_ventas([$udn,$fecha]);
            // $opc        = ($softVentas['noHabitaciones']) ? 0 : 1;


            // $noHabitaciones       += $softVentas['noHabitaciones'];
            // $total                += $softVentas['Hospedaje'] + $softVentas['AyB'] + $softVentas['Diversos'];

            // $hospedaje         += $softVentas['Hospedaje'];
            // $PromedioHospedaje  = $hospedaje / $noHabitaciones;

            // $AyB               += $softVentas['AyB'];
            // $PromedioAyB        = $AyB / $noHabitaciones;

            // $tarifaEfectiva     = ($idRow ==1 ) ? ($total/12) : (($total/12)/ ($idRow-1)) ;

            // $ingresosDiversos  += $softVentas['Diversos'];
            // $PromedioDiversos   = $ingresosDiversos / $noHabitaciones;


            // $tarifaEfectivaDiaria  = $total / 12;
            // $porcentajeOcupacion   = evaluar($noHabitaciones / 12, '%');

            $__row[] = array(

                'id'                    => $idRow,
                'fecha'                 => $fecha,
                'dia'                   => formatSpanishNoDay($fecha),

                'Hospedaje'              => $hospedaje,
                'chequePromHospedaje'    => $PromedioHospedaje,
                'chequePromedioAyB'      => $PromedioAyB,
                'chequePromedioDiversos' => $PromedioDiversos,

                'tarifaEfectiva'         => $tarifaEfectiva,




            );

        //     // endif;

            $fi->modify('+1 day');
        }


        #encapsular datos
        return $__row;




    }


    // Promedios Diarios


    // Promedios acomulados.
      function listAcomulados(){
        $udn = $_POST['udn'];
        # -- variables para fechas
        $fi = new DateTime($_POST['anio'] . '-' . $_POST['mes'] . '-01');

        $hoy = clone $fi;

        $hoy->modify('last day of this month');
        $__row = [];


        while ($fi <= $hoy) {
            $idRow++;
            $fecha = $fi->format('Y-m-d');

            $softVentas = $this->getsoft_ventas([$udn,$fecha]);
            $opc        = ($softVentas['noHabitaciones']) ? 0 : 1;


            $noHabitaciones    += $softVentas['noHabitaciones'];


        //     $PromedioDiversos = $softVentas['Diversos'] / $noHabitaciones;

        //     $tarifaEfectivaDiaria = $total / 12;
        //     $porcentajeOcupacion = evaluar($noHabitaciones / 12, '%');


           if($udn == 1):

                $total             += $softVentas['Hospedaje'] + $softVentas['AyB'] + $softVentas['Diversos'];
                $hospedaje         += $softVentas['Hospedaje'];
                $PromedioHospedaje  = $hospedaje / $noHabitaciones;
                $AyB               += $softVentas['AyB'];
                $PromedioAyB        = $AyB / $noHabitaciones;
                $tarifaEfectiva     = ($idRow ==1 ) ? evaluar($total/12) : evaluar(($total/12)/ ($idRow-1)) ;
                $ingresosDiversos  += $softVentas['Diversos'];
                $PromedioDiversos   = $ingresosDiversos / $noHabitaciones;


                $__row[] = array(

                    'id'                       => $idRow,
                    'fecha'                    => $fecha,
                    'dia'                      => formatSpanishDate($fecha),
                    'Habitaciones'             => $noHabitaciones,
                    'Suma de ingresos'         => $total,
                    'Hospedaje'                => $hospedaje,
                    'chequePromHospedaje'      => ['text'=>evaluar($PromedioHospedaje),'value'=>$PromedioHospedaje],
                    'Tarifa efectiva acum.'    => $tarifaEfectiva,

                    'Ingreso AyB'              => evaluar($AyB),
                    'Cheque Promedio AyB'      => evaluar($PromedioAyB),
                    'Ingreso Diversos'         => evaluar($ingresosDiversos),
                    'Cheque Promedio Diversos' => evaluar($PromedioDiversos),
                    // 'Costo de amenididad'      => '0.00',
                    // 'Costo de AyB '            => '0.00',
                    // 'Costo Diversos diario'    => '0.00',


                    'opc' => $opc
                );

            else:
                  // Calculo.
                  $total           += $softVentas['totalAyB'];
                  $ventasAlimentos += $softVentas['alimentos'];
                  $ventasBebidas   += $softVentas['bebidas'];




                  $__row[] = array(

                    'id'                    => $idRow,
                    'fecha'                 => $fecha,
                    'dia'                   => formatSpanishDate($fecha),
                    'Clientes'              => $noHabitaciones,

                    'Ventas AyB'            => evaluar($total),
                    'Ventas Alimentos'      => evaluar($ventasAlimentos),
                    'Cheque Prom Alimentos' => evaluar(0),

                    'Ventas Bebidas'      => evaluar($ventasBebidas),
                    'Cheque Prom Bebidas' => '',



                    // 'Costo de amenididad'      => '0.00',
                    // 'Costo de AyB '            => '0.00',
                    // 'Costo Diversos diario'    => '0.00',


                    'opc' => 0
                );



            endif;

            $fi->modify('+1 day');
        }


        #encapsular datos
        return [

            "row" => $__row,
            "thead" => ''
        ];


    }




    // Aux.

    function get_th_ingresos() {
        switch ($_POST['udn']) {
            case 1:
                return ['Fecha', 'Dia', 'Hospedaje', 'AYB', 'DIVERSOS', 'No. Habitaciones', 'Total'];
            case 5:
                return ['Fecha', 'Dia', 'Alimentos', 'Bebidas', 'Complementos', 'Total'];
            default:
                return ['Fecha', 'Dia', 'Alimentos', 'Bebidas', 'Clientes', 'Total'];
        }

    }

}


// Complements.
function createdGroups($groups, $ventas, $id) {
        $row = [];

        foreach ($groups as $key => $nameGroup) {
            $value = evaluar($ventas[$nameGroup] ?? '', '');
            if ($key == 0) $value = $ventas[$nameGroup];

            $row[$nameGroup] = [
                'html' => createElement('input', [
                    'name'    => $nameGroup,
                    'value'   => $value,
                    'onkeyup' => "ingresosDiarios.setVentas(event, $id)",
                ]),
                'style' => 'padding:0; margin:0;'
            ];
        }

        return $row;
}

function createElement($tag, $attributes = [], $text = null) {
    $defaultAttributes = [
        'placeholder' => '',
        'class'       => '
            w-full bg-gray-50
            text-slate-700 text-end text-sm  px-3 py-2
            focus:border-gray-400
            hover:border-slate-300 hover:bg-gray-100
        ',
    ];

    $attributes = array_merge($defaultAttributes, $attributes);
    $element = "<$tag";

    foreach ($attributes as $key => $value) {
        $element .= " $key=\"" . htmlspecialchars($value) . "\"";
    }

    $element .= ">";

    if ($text !== null) {
        $element .= htmlspecialchars($text);
    }

    // Cierra la etiqueta si no es self-closing
    if (!in_array($tag, ['input', 'img', 'br', 'hr', 'meta', 'link'])) {
        $element .= "</$tag>";
    }

    return $element;
}




// ✅ Instancia final del controlador
$ctrl = new ctrl();
echo json_encode($ctrl->{$_POST['opc']}());
