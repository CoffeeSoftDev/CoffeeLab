<?php
session_start();
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../mdl/mdl-dashboard-cheque-promedio.php';
require_once('../../../../conf/coffeSoft.php');

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
        ];
    }

    function apiChequePromedioDashboard() {
        if (!isset($_POST['anio']) || !isset($_POST['mes']) || !isset($_POST['udn'])) {
            return [
                'status' => 400,
                'message' => 'Parámetros requeridos faltantes'
            ];
        }

        $anio = (int) $_POST['anio'];
        $mes = (int) $_POST['mes'];
        $udn = (int) $_POST['udn'];

        if ($anio < 2020 || $anio > date('Y') + 1) {
            return ['status' => 400, 'message' => 'Año inválido'];
        }

        if ($mes < 1 || $mes > 12) {
            return ['status' => 400, 'message' => 'Mes inválido'];
        }

        if (!in_array($udn, [1, 2, 3, 4, 5])) {
            return ['status' => 400, 'message' => 'UDN inválida'];
        }

        try {
            $data = $this->listChequePromedioDashboard([$udn, $anio, $mes]);

            $data['ventaDia'] = formatChequePromedio($data['ventaDia']);
            $data['ventaMes'] = formatChequePromedio($data['ventaMes']);
            $data['ChequePromedio'] = formatChequePromedio($data['ChequePromedio']);
            $data['Clientes'] = number_format($data['Clientes'], 0, '.', ',');

            return [
                'status' => 200,
                'data' => $data
            ];
        } catch (Exception $e) {
            error_log("Error en apiChequePromedioDashboard: " . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Error interno del servidor'
            ];
        }
    }

    function apiChequePromedioByCategory() {
        if (!isset($_POST['anio']) || !isset($_POST['mes']) || !isset($_POST['udn'])) {
            return [
                'status' => 400,
                'message' => 'Parámetros requeridos faltantes'
            ];
        }

        $anio = (int) $_POST['anio'];
        $mes = (int) $_POST['mes'];
        $udn = (int) $_POST['udn'];
        $anioAnterior = $anio - 1;

        try {
            $data = $this->listChequePromedioByCategory([$udn, $anio, $mes]);

            return [
                'status' => 200,
                'dataset' => [
                    'labels' => $data['labels'],
                    'A' => $data['dataActual'],
                    'B' => $data['dataAnterior']
                ],
                'anioA' => $anio,
                'anioB' => $anioAnterior
            ];
        } catch (Exception $e) {
            error_log("Error en apiChequePromedioByCategory: " . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Error interno del servidor'
            ];
        }
    }

    function apiVentasPorDiaSemana() {
        if (!isset($_POST['anio']) || !isset($_POST['mes']) || !isset($_POST['udn'])) {
            return [
                'status' => 400,
                'message' => 'Parámetros requeridos faltantes'
            ];
        }

        $anio = (int) $_POST['anio'];
        $mes = (int) $_POST['mes'];
        $udn = (int) $_POST['udn'];
        $anioAnterior = $anio - 1;

        try {
            $data = $this->listVentasPorDiaSemana([$udn, $anio, $mes]);

            return [
                'status' => 200,
                'labels' => $data['labels'],
                'dataA' => $data['dataActual'],
                'dataB' => $data['dataAnterior'],
                'yearA' => $anio,
                'yearB' => $anioAnterior
            ];
        } catch (Exception $e) {
            error_log("Error en apiVentasPorDiaSemana: " . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Error interno del servidor'
            ];
        }
    }

    function apiTopDiasMes() {
        if (!isset($_POST['anio']) || !isset($_POST['mes']) || !isset($_POST['udn'])) {
            return [
                'status' => 400,
                'message' => 'Parámetros requeridos faltantes'
            ];
        }

        $anio = (int) $_POST['anio'];
        $mes = (int) $_POST['mes'];
        $udn = (int) $_POST['udn'];

        try {
            $data = $this->listTopDiasMes([$udn, $anio, $mes]);

            $formatted = [];
            foreach ($data as $item) {
                $formatted[] = [
                    'fecha' => date('d/m/Y', strtotime($item['fecha'])),
                    'dia' => traducirDia($item['dia']),
                    'clientes' => $item['clientes'],
                    'total' => $item['total'],
                    'nota' => ''
                ];
            }

            return [
                'status' => 200,
                'data' => $formatted
            ];
        } catch (Exception $e) {
            error_log("Error en apiTopDiasMes: " . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Error interno del servidor'
            ];
        }
    }

    function apiTopDiasSemanaPromedio() {
        if (!isset($_POST['anio']) || !isset($_POST['mes']) || !isset($_POST['udn'])) {
            return [
                'status' => 400,
                'message' => 'Parámetros requeridos faltantes'
            ];
        }

        $anio = (int) $_POST['anio'];
        $mes = (int) $_POST['mes'];
        $udn = (int) $_POST['udn'];

        try {
            $data = $this->listTopDiasSemanaPromedio([$udn, $anio, $mes]);

            $formatted = [];
            foreach ($data as $item) {
                $formatted[] = [
                    'dia' => $item['dia'],
                    'promedio' => round($item['promedio'], 2),
                    'veces' => $item['veces'],
                    'clientes' => $item['clientes']
                ];
            }

            return [
                'status' => 200,
                'data' => $formatted
            ];
        } catch (Exception $e) {
            error_log("Error en apiTopDiasSemanaPromedio: " . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Error interno del servidor'
            ];
        }
    }

    function apiComparativaIngresosDiarios() {
        if (!isset($_POST['anio']) || !isset($_POST['mes']) || !isset($_POST['udn'])) {
            return [
                'status' => 400,
                'message' => 'Parámetros requeridos faltantes'
            ];
        }

        $anio = (int) $_POST['anio'];
        $mes = (int) $_POST['mes'];
        $udn = (int) $_POST['udn'];
        $categoria = isset($_POST['categoria']) ? $_POST['categoria'] : null;
        $anioAnterior = $anio - 1;

        try {
            $data = $this->listIngresosDiariosComparativos([$udn, $anio, $mes, $categoria]);

            $diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            $tooltips = [];
            
            foreach ($data['labels'] as $index => $dia) {
                $fecha = sprintf('%04d-%02d-%02d', $anio, $mes, (int)$dia);
                $diaSemana = $diasSemana[date('w', strtotime($fecha))];
                $tooltips[] = "$diaSemana $dia";
            }

            return [
                'status' => 200,
                'labels' => $data['labels'],
                'tooltip' => $tooltips,
                'datasets' => [
                    [
                        'label' => $anio,
                        'data' => $data['dataActual'],
                        'borderColor' => "#103B60",
                        'backgroundColor' => "rgba(16, 59, 96, 0.2)",
                        'fill' => true,
                        'tension' => 0.3,
                        'pointRadius' => 4,
                        'pointBackgroundColor' => "#103B60"
                    ],
                    [
                        'label' => $anioAnterior,
                        'data' => $data['dataAnterior'],
                        'borderColor' => "#8CC63F",
                        'backgroundColor' => "rgba(140, 198, 63, 0.2)",
                        'fill' => true,
                        'tension' => 0.3,
                        'pointRadius' => 4,
                        'pointBackgroundColor' => "#8CC63F"
                    ]
                ]
            ];
        } catch (Exception $e) {
            error_log("Error en apiComparativaIngresosDiarios: " . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Error interno del servidor'
            ];
        }
    }
}

function formatChequePromedio($valor) {
    return '$ ' . number_format($valor, 2, '.', ',');
}

function calculateVariacion($actual, $anterior) {
    if ($anterior == 0) return 0;
    return (($actual - $anterior) / $anterior) * 100;
}

function getTendencia($variacion) {
    if ($variacion > 5) return 'positiva';
    if ($variacion < -5) return 'negativa';
    return 'estable';
}

function traducirDia($dia) {
    $dias = [
        'Monday' => 'Lunes',
        'Tuesday' => 'Martes',
        'Wednesday' => 'Miércoles',
        'Thursday' => 'Jueves',
        'Friday' => 'Viernes',
        'Saturday' => 'Sábado',
        'Sunday' => 'Domingo'
    ];
    return $dias[$dia] ?? $dia;
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
