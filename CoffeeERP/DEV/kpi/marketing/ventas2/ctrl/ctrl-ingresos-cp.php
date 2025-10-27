<?php
session_start();
if (empty($_POST['opc'])) exit(0);


header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

require_once '../mdl/mdl-ingresos.php';
require_once('../../../../conf/coffeSoft.php');

class ctrl extends mdl {

     public function apiPromediosDiarios() {
        $response = [];

        $anio         = isset($_POST['anio1']) ? (int) $_POST['anio1'] : date('Y');
        $anioAnterior = $anio - 1;
        $mes          = isset($_POST['mes1']) ? (int) $_POST['mes1'] : date('m');
        $udn          = isset($_POST['udn']) ? (int) $_POST['udn'] : 1;

        $meses = [
            'actual'   => ['year' => $_POST['anio1'],        'mes' => $_POST['mes1']],
            'anterior' => ['year' => $_POST['anio2'],'mes' =>$_POST['mes2']]
        ];

        if ($udn == 1) {
            $consultas = [
                'totalGeneral'              => 'Suma de ingresos',
                'totalHospedaje'            => 'Ingreso de Hospedaje',
                'totalAyB'                  => 'Ingreso AyB',
                'totalDiversos'             => 'Ingreso Diversos',
                'totalHabitaciones'         => 'Habitaciones',
                'porcAgrupacion'            => '% Ocupación',
                'tarifaEfectiva'            => 'Tarifa efectiva acumulada',
                'chequePromedio'            => 'Cheque Promedio',
                'chequePromedioHospedaje'   => 'Cheque Promedio Hospedaje',
                'chequePromedioAyB'         => 'Cheque Promedio AyB',
                'chequePromedioDiversos'    => 'Cheque Promedio Diversos',
            ];
        } else {
            $consultas = [
                'totalHabitaciones'         => 'Clientes',
                'totalGralAyB'              => 'Ventas AyB',
                'totalAlimentos'            => 'Ventas Alimentos',
                'totalBebidas'              => 'Ventas Bebidas',
                'chequePromedioAyB'         => 'Cheque Promedio AyB',
                'chequePromedioAlimentos'   => 'Cheque Promedio Alimentos',
                'chequePromedioBebidas'     => 'Cheque Promedio Bebidas',
            ];
        }

        foreach ($consultas as $clave => $concepto) {
            $datos = [
                'id'         => $clave,
                'concepto'   => $concepto,
                'anterior'   => ['valor' => 0, 'formato' => 0],
                'actual'     => ['valor' => 0, 'formato' => 0],
                'diferencia' => 0
            ];

            foreach ($meses as $tipo => $fecha) {
                $totalDias = cal_days_in_month(CAL_GREGORIAN, $fecha['mes'], $fecha['year']);
                $ventas    = $this->ingresosMensuales([$udn, $fecha['year'], $fecha['mes']]);

                $valor = $this->getCalculoPorConcepto($clave, $ventas, $totalDias);

                $datos[$tipo] = [
                    'valor'   => $valor,
                    'ventas'  =>  [$udn, $fecha['year'], $fecha['mes']],
                    'formato' => ($clave === 'totalHabitaciones') ? $valor : evaluar($valor),
                ];
            }

            // Validar que existan valores antes de calcular diferencia
            $valorActual   = isset($datos['actual']['valor']) ? $datos['actual']['valor'] : 0;
            $valorAnterior = isset($datos['anterior']['valor']) ? $datos['anterior']['valor'] : 0;

            $dif = $valorActual - $valorAnterior;
            $datos['diferencia'] = ($clave === 'totalHabitaciones') ? $dif : evaluar($dif);

            $response[] = $datos;
        }

        return [
            'status'    => 200,
            'data'      => $response,
            'meses'     => $meses,
            'dashboard' => $this->apiDashBoard($response, $udn),
            // 'barras'    => $this->comparativaChequePromedio(),
            // 'linear'    => $this->apiLinearPromediosDiario($anio, $mes, $udn),
            // 'barDays'   => $this->apiIngresosComparativoSemana(),
            // 'topDays'   => $this->apiTopDiasMes(),
            // 'topWeek'   => $this->apiTopDiasSemanaPromedio($anio, $mes, $udn)
        ];
    }

    // Cards.

    public function apiDashBoard($response, $udn) {
        $ventaMesActual       = 0;
        $ventaMesAnterior     = 0;
        $clientesActual       = 0;
        $clientesAnterior     = 0;
        $chequePromedioActual = 0;
        $chequePromedioAnterior = 0;

        foreach ($response as $item) {
            switch ($item['id']) {
                case 'totalGeneral':
                case 'totalGralAyB':
                    $ventaMesActual   = $item['actual']['valor'];
                    $ventaMesAnterior = $item['anterior']['valor'];
                    break;
                case 'totalHabitaciones':
                    $clientesActual   = $item['actual']['valor'];
                    $clientesAnterior = $item['anterior']['valor'];
                    break;
                case 'chequePromedio':
                case 'chequePromedioAyB':
                    $chequePromedioActual   = $item['actual']['valor'];
                    $chequePromedioAnterior = $item['anterior']['valor'];
                    break;
            }
        }

        $ventasDia = $this->getVentasDelDia([$udn]);
        $fechaAyer = date('d/m/Y', strtotime('-1 day'));

        $variacionVentas = $this->calcularVariacion($ventaMesActual, $ventaMesAnterior);
        $variacionClientes = $this->calcularVariacion($clientesActual, $clientesAnterior);
        $variacionCheque = $this->calcularVariacion($chequePromedioActual, $chequePromedioAnterior);

        return [
            'ventaDia' => [
                'valor' => evaluar($ventasDia),
                'fecha' => $fechaAyer,
                'titulo' => 'Venta del día de ayer',
                'color' => 'text-[#8CC63F]'
            ],
            'ventaMes' => [
                'valor' => evaluar($ventaMesActual),
                'variacion' => $variacionVentas['porcentaje'],
                'mensaje' => $variacionVentas['mensaje'],
                'tendencia' => $variacionVentas['tendencia'],
                'titulo' => 'Venta del Mes',
                'color' => $variacionVentas['tendencia'] === 'up' ? 'text-green-800' : 'text-red-600'
            ],
            'clientes' => [
                'valor' => number_format($clientesActual, 0),
                'variacion' => $variacionClientes['porcentaje'],
                'mensaje' => $variacionClientes['mensaje'],
                'tendencia' => $variacionClientes['tendencia'],
                'titulo' => 'Clientes',
                'color' => 'text-[#103B60]'
            ],
            'chequePromedio' => [
                'valor' => evaluar($chequePromedioActual),
                'variacion' => $variacionCheque['porcentaje'],
                'mensaje' => $variacionCheque['mensaje'],
                'tendencia' => $variacionCheque['tendencia'],
                'titulo' => 'Cheque Promedio',
                'color' => $variacionCheque['tendencia'] === 'up' ? 'text-green-600' : 'text-red-600'
            ]
        ];
    }

    private function calcularVariacion($actual, $anterior) {
        if ($anterior == 0) {
            return [
                'porcentaje' => '0%',
                'mensaje' => 'Sin datos del año anterior',
                'tendencia' => 'neutral'
            ];
        }

        $diferencia = $actual - $anterior;
        $porcentaje = ($diferencia / $anterior) * 100;
        $signo = $porcentaje >= 0 ? '+' : '';
        $tendencia = $porcentaje > 0 ? 'up' : ($porcentaje < 0 ? 'down' : 'neutral');

        return [
            'porcentaje' => $signo . number_format($porcentaje, 1) . '%',
            'mensaje' => $signo . number_format($porcentaje, 1) . '% comparado con el año pasado',
            'tendencia' => $tendencia
        ];
    }

    private function getCalculoPorConcepto($clave, $ventas, $totalDias) {
        switch ($clave) {
            case 'totalGeneral':
                return $ventas['totalGeneral'] ?? 0;
            case 'totalHospedaje':
                return $ventas['totalHospedaje'] ?? 0;
            case 'totalAyB':
                return $ventas['totalAyB'] ?? 0;
            case 'totalGralAyB':
                return $ventas['totalGralAyB'] ?? 0;
            case 'totalAlimentos':
                return $ventas['totalAlimentos'] ?? 0;
            case 'totalBebidas':
                return $ventas['totalBebidas'] ?? 0;
            case 'totalDiversos':
                return $ventas['totalDiversos'] ?? 0;
            case 'totalHabitaciones':
                return $ventas['totalHabitaciones'] ?? 0;
            case 'porcAgrupacion':
                $habitaciones = $ventas['totalHabitaciones'] ?? 0;
                return $habitaciones > 0 ? ($habitaciones / (12 * $totalDias)) * 100 : 0;
            case 'tarifaEfectiva':
                $hospedaje = $ventas['totalHospedaje'] ?? 0;
                $habitaciones = $ventas['totalHabitaciones'] ?? 0;
                return $habitaciones > 0 ? $hospedaje / $habitaciones : 0;
            case 'chequePromedio':
                $total = $ventas['totalGeneral'] ?? 0;
                $habitaciones = $ventas['totalHabitaciones'] ?? 0;
                return $habitaciones > 0 ? $total / $habitaciones : 0;
            case 'chequePromedioHospedaje':
                $hospedaje = $ventas['totalHospedaje'] ?? 0;
                $habitaciones = $ventas['totalHabitaciones'] ?? 0;
                return $habitaciones > 0 ? $hospedaje / $habitaciones : 0;
            case 'chequePromedioAyB':
                $ayb = $ventas['totalAyB'] ?? $ventas['totalGralAyB'] ?? 0;
                $habitaciones = $ventas['totalHabitaciones'] ?? 0;
                return $habitaciones > 0 ? $ayb / $habitaciones : 0;
            case 'chequePromedioAlimentos':
                $alimentos = $ventas['totalAlimentos'] ?? 0;
                $habitaciones = $ventas['totalHabitaciones'] ?? 0;
                return $habitaciones > 0 ? $alimentos / $habitaciones : 0;
            case 'chequePromedioBebidas':
                $bebidas = $ventas['totalBebidas'] ?? 0;
                $habitaciones = $ventas['totalHabitaciones'] ?? 0;
                return $habitaciones > 0 ? $bebidas / $habitaciones : 0;
            case 'chequePromedioDiversos':
                $diversos = $ventas['totalDiversos'] ?? 0;
                $habitaciones = $ventas['totalHabitaciones'] ?? 0;
                return $habitaciones > 0 ? $diversos / $habitaciones : 0;
            default:
                return 0;
        }
    }


    // Graficos cheque promedio.
    function apiIngresosTotales($udn, $anio, $mes) {
        $fi = new DateTime($anio . '-' . $mes . '-01');
        $hoy = clone $fi;
        $hoy->modify('last day of this month');

        $__row = [];
        $idRow = 0;
        
        // Obtener la categoría seleccionada y normalizarla
        $categoriaSeleccionada = isset($_POST['category']) ? strtolower(trim($_POST['category'])) : 'todas';

        while ($fi <= $hoy) {
            $idRow++;
            $fecha = $fi->format('Y-m-d');

            $softVentas = $this->getsoftVentas([$udn, $fecha]);

            // Si no hay datos, crear un registro vacío
            if ($softVentas === null) {
                $softVentas = [
                    'id_venta'       => null,
                    'noHabitaciones' => 0,
                    'Hospedaje'      => 0,
                    'AyB'            => 0,
                    'Diversos'       => 0,
                    'alimentos'      => 0,
                    'bebidas'        => 0,
                    'guarniciones'   => 0,
                    'sales'          => 0,
                    'domicilio'      => 0
                ];
            }

            $row = [
                'id'    => $idRow,
                'fecha' => $fecha,
                'estado' => $softVentas['id_venta'] ? 'Capturado' : 'Pendiente'
            ];

            if ($udn == 1) {
                $row['clientes'] = $softVentas['noHabitaciones'];
                
                // Filtrar por categoría o mostrar todas
                if ($categoriaSeleccionada == 'todas' || $categoriaSeleccionada == '') {
                    $row['Hospedaje'] = $softVentas['Hospedaje'];
                    $row['AyB']       = $softVentas['AyB'];
                    $row['Diversos']  = $softVentas['Diversos'];
                    $row['total']     = $softVentas['Hospedaje'] + $softVentas['AyB'] + $softVentas['Diversos'];
                } elseif ($categoriaSeleccionada == 'hospedaje') {
                    $row['Hospedaje'] = $softVentas['Hospedaje'];
                    $row['total']     = $softVentas['Hospedaje'];
                } elseif ($categoriaSeleccionada == 'ayb') {
                    $row['AyB']   = $softVentas['AyB'];
                    $row['total'] = $softVentas['AyB'];
                } elseif ($categoriaSeleccionada == 'diversos') {
                    $row['Diversos'] = $softVentas['Diversos'];
                    $row['total']    = $softVentas['Diversos'];
                }

            } elseif ($udn == 5) {
                $row['clientes'] = $softVentas['noHabitaciones'];
                
                if ($categoriaSeleccionada == 'todas' || $categoriaSeleccionada == '') {
                    $row['alimentos']    = $softVentas['alimentos'];
                    $row['bebidas']      = $softVentas['bebidas'];
                    $row['guarniciones'] = $softVentas['guarniciones'];
                    $row['sales']        = $softVentas['sales'];
                    $row['domicilio']    = $softVentas['domicilio'];
                    $row['total']        = $softVentas['alimentos'] + $softVentas['bebidas'] + $softVentas['guarniciones'] + $softVentas['sales'] + $softVentas['domicilio'];
                } elseif ($categoriaSeleccionada == 'alimentos' || $categoriaSeleccionada == 'cortes') {
                    $row['alimentos'] = $softVentas['alimentos'];
                    $row['total']     = $softVentas['alimentos'];
                } elseif ($categoriaSeleccionada == 'bebidas') {
                    $row['bebidas'] = $softVentas['bebidas'];
                    $row['total']   = $softVentas['bebidas'];
                } elseif ($categoriaSeleccionada == 'guarniciones') {
                    $row['guarniciones'] = $softVentas['guarniciones'];
                    $row['total']        = $softVentas['guarniciones'];
                } elseif ($categoriaSeleccionada == 'sales' || $categoriaSeleccionada == 'sales y condimentos') {
                    $row['sales'] = $softVentas['sales'];
                    $row['total'] = $softVentas['sales'];
                }

            } else {
                $row['clientes'] = $softVentas['noHabitaciones'];
                
                if ($categoriaSeleccionada == 'todas' || $categoriaSeleccionada === '') {
                    $row['alimentos'] = $softVentas['alimentos'];
                    $row['bebidas']   = $softVentas['bebidas'];
                    $row['total']     = $softVentas['alimentos'] + $softVentas['bebidas'];
                } elseif ($categoriaSeleccionada == 'alimentos') {
                    $row['alimentos'] = $softVentas['alimentos'];
                    $row['total']     = $softVentas['alimentos'];
                } elseif ($categoriaSeleccionada == 'bebidas') {
                    $row['bebidas'] = $softVentas['bebidas'];
                    $row['total']   = $softVentas['bebidas'];
                }
            }

            $__row[] = $row;
            $fi->modify('+1 day');
        }

        return ['data' => $__row];
    }
    
    function getDailyCheck() {
        $udn      = $_POST['udn']    ?? null;
        $anio1    = $_POST['anio1']  ?? date('Y');
        $mes1     = $_POST['mes1']   ?? date('m');
        $anio2    = $_POST['anio2']  ?? date('Y') - 1;
        $mes2     = $_POST['mes2']   ?? date('m');
        $category = strtolower(trim($_POST['category'] ?? 'todas'));

        $apiActual   = $this->apiIngresosTotales($udn, $anio1, $mes1);
        $apiAnterior = $this->apiIngresosTotales($udn, $anio2, $mes2);

        $rowsActual   = $apiActual['data'] ?? [];
        $rowsAnterior = $apiAnterior['data'] ?? [];

        // Días en español
        $diasES = [
            'Monday'    => 'Lunes',
            'Tuesday'   => 'Martes',
            'Wednesday' => 'Miércoles',
            'Thursday'  => 'Jueves',
            'Friday'    => 'Viernes',
            'Saturday'  => 'Sábado',
            'Sunday'    => 'Domingo'
        ];

        $weeklyActual   = array_fill_keys(array_values($diasES), ['total' => 0, 'clientes' => 0]);
        $weeklyAnterior = array_fill_keys(array_values($diasES), ['total' => 0, 'clientes' => 0]);

        $processData = function ($rows, &$weeklyData) use ($category, $diasES) {
            foreach ($rows as $row) {
                if (empty($row['fecha'])) continue;

                $dayEnglish = ucfirst(strtolower(date('l', strtotime($row['fecha']))));
                $dayName    = $diasES[$dayEnglish] ?? $dayEnglish;

                $clientes = isset($row['clientes']) ? intval($row['clientes']) : 0;
                $total    = 0;

                if ($category == 'todas' || $category == '') {
                    $total = isset($row['total']) ? floatval($row['total']) : 0;
                } else {
                    foreach ($row as $key => $value) {
                        if (strtolower($key) == $category) {
                            $total = floatval($value);
                            break;
                        }
                    }
                }

                if (isset($weeklyData[$dayName])) {
                    $weeklyData[$dayName]['total']    += $total;
                    $weeklyData[$dayName]['clientes'] += $clientes;
                }
            }
        };

        $processData($rowsActual, $weeklyActual);
        $processData($rowsAnterior, $weeklyAnterior);

        $labels = [];
        $dataA  = [];
        $dataB  = [];

        foreach ($diasES as $en => $es) {
            $labels[] = $es;

            $avgActual = $weeklyActual[$es]['clientes'] > 0
                ? round($weeklyActual[$es]['total'] / $weeklyActual[$es]['clientes'], 2)
                : 0;

            $avgAnterior = $weeklyAnterior[$es]['clientes'] > 0
                ? round($weeklyAnterior[$es]['total'] / $weeklyAnterior[$es]['clientes'], 2)
                : 0;

            $dataA[] = $avgAnterior;
            $dataB[] = $avgActual;
        }

        return [
            'status'  => 200,
            'message' => 'Cheque promedio diario comparativo generado correctamente',
            'filter'  => $category,
            'labels'  => $labels,
            'dataA'   => $dataA,
            'dataB'   => $dataB,
            'yearA'   => intval($anio2),
            'yearB'   => intval($anio1),
            'api'     => [
                'actual'   => $apiActual,
                'anterior' => $apiAnterior
            ]
        ];
    }

    
}


// Complements.
function createdGroups($groups, $ventas, $id) {
    $row = [];

    foreach ($groups as $key => $nameGroup) {
        $value = evaluar($ventas[$nameGroup] ?? '', '');
        if ($key == 0) $value = $ventas[$nameGroup];

        $nameKey = $nameGroup === 'No habitaciones' ? 'clientes' : $nameGroup;

        $row[$nameKey] = [
            'html' => createElement('input', [
                'name'    => $nameKey,
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
