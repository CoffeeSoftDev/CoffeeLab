<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'lsudn' => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics' => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach' => formatPrice($metrics['total_reach'] ?? 0),
                'interactions' => formatPrice($metrics['total_interactions'] ?? 0),
                'monthViews' => formatPrice($metrics['total_views'] ?? 0),
                'totalInvestment' => formatPrice($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([$udn, $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icon'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['name'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
        $_POST['nombre'] = $_POST['name'];
        unset($_POST['name']);

        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
        $_POST['nombre'] = $_POST['name'];
        unset($_POST['name']);

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([$udn, $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Tipo' => $key['name'],
                'Red Social' => $key['social_network_name'],
                'Estado' => renderStatus($key['active']),
                'Descripción' => $key['description'],
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
        $_POST['nombre'] = $_POST['name'];
        $_POST['red_social_id'] = $_POST['social_network_id'];
        unset($_POST['name']);
        unset($_POST['social_network_id']);

        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
        $_POST['nombre'] = $_POST['name'];
        $_POST['red_social_id'] = $_POST['social_network_id'];
        unset($_POST['name']);
        unset($_POST['social_network_id']);

        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => formatPrice($key['month_1']),
                'Febrero' => formatPrice($key['month_2']),
                'Marzo' => formatPrice($key['month_3']),
                'Abril' => formatPrice($key['month_4']),
                'Mayo' => formatPrice($key['month_5']),
                'Junio' => formatPrice($key['month_6']),
                'Julio' => formatPrice($key['month_7']),
                'Agosto' => formatPrice($key['month_8']),
                'Septiembre' => formatPrice($key['month_9']),
                'Octubre' => formatPrice($key['month_10']),
                'Noviembre' => formatPrice($key['month_11']),
                'Diciembre' => formatPrice($key['month_12']),
                'Total' => formatPrice($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Mes Anterior' => formatPrice($key['previous_value']),
                'Mes Actual' => formatPrice($key['current_value']),
                'Comparación' => formatPrice($comparison),
                'Porcentaje' => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Año ' . ($year - 1) => formatPrice($key['previous_year']),
                'Año ' . $year => formatPrice($key['current_year']),
                'Comparación' => formatPrice($comparison),
                'Porcentaje' => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Activo</span>';
        case 0:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Inactivo</span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-500 text-white">Desconocido</span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
