<?php
session_start();
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-metrics.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->listUDN(),
            'social_networks' => $this->listSocialNetworks(),
            'months' => $this->getMonths()
        ];
    }

    function listMetrics() {
        $__row = [];
        
        $filters = [
            'udn_id' => $_POST['udn'] ?? null,
            'social_id' => $_POST['social_network'] ?? null,
            'year' => $_POST['year'] ?? null,
            'month' => $_POST['month'] ?? null
        ];

        $ls = $this->getMetricsList($filters);

        foreach ($ls as $key) {
            $a = [];

            if ($key['validated'] == 0) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'app.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-trash"></i>',
                    'onclick' => 'app.deleteMetric(' . $key['id'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-success',
                    'html' => '<i class="icon-check"></i> Validado',
                    'disabled' => true
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Mes' => $key['month_name'],
                'Año' => $key['year'],
                'Seguidores' => number_format($key['followers']),
                'Publicaciones' => $key['publications'],
                'Engagement' => $key['engagement_rate'] . '%',
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $status = 500;
        $message = 'Error al obtener los datos';
        
        $metric = $this->getMetricById([$_POST['id']]);

        if ($metric) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $metric
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';

        $exists = $this->existsMetric([
            $_POST['udn_id'],
            $_POST['social_id'],
            $_POST['year'],
            $_POST['month']
        ]);

        if ($exists > 0) {
            $status = 409;
            $message = 'Ya existe una captura para este mes y red social';
        } else {
            $_POST['created_by'] = $_SESSION['USER'];
            $_POST['created_at'] = date('Y-m-d H:i:s');
            $_POST['validated'] = 0;

            $create = $this->createMetric($this->util->sql($_POST));

            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $status = 500;
        $message = 'Error al editar la métrica';

        $metric = $this->getMetricById([$_POST['id']]);

        if ($metric['validated'] == 1) {
            $status = 403;
            $message = 'No se puede editar una métrica validada';
        } else {
            $_POST['updated_at'] = date('Y-m-d H:i:s');
            
            $edit = $this->updateMetric($this->util->sql($_POST, 1));

            if ($edit) {
                $status = 200;
                $message = 'Métrica actualizada correctamente';
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function deleteMetric() {
        $status = 500;
        $message = 'Error al eliminar la métrica';

        $metric = $this->getMetricById([$_POST['id']]);

        if ($metric['validated'] == 1) {
            $status = 403;
            $message = 'No se puede eliminar una métrica validada';
        } else {
            $delete = $this->deleteMetricById([$_POST['id']]);

            if ($delete) {
                $status = 200;
                $message = 'Métrica eliminada correctamente';
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function annualReport() {
        $__row = [];
        
        $filters = [
            'udn_id' => $_POST['udn'],
            'social_id' => $_POST['social_network'],
            'year' => $_POST['year']
        ];

        $data = $this->getAnnualReport($filters);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Ene' => $key['jan'] ?? '-',
                'Feb' => $key['feb'] ?? '-',
                'Mar' => $key['mar'] ?? '-',
                'Abr' => $key['apr'] ?? '-',
                'May' => $key['may'] ?? '-',
                'Jun' => $key['jun'] ?? '-',
                'Jul' => $key['jul'] ?? '-',
                'Ago' => $key['aug'] ?? '-',
                'Sep' => $key['sep'] ?? '-',
                'Oct' => $key['oct'] ?? '-',
                'Nov' => $key['nov'] ?? '-',
                'Dic' => $key['dec'] ?? '-',
                'Total' => $key['total']
            ];
        }

        return ['row' => $__row];
    }

    function monthlyReport() {
        $__row = [];
        
        $filters = [
            'udn_id' => $_POST['udn'],
            'social_id' => $_POST['social_network'],
            'year' => $_POST['year'],
            'month' => $_POST['month']
        ];

        $data = $this->getMonthlyComparison($filters);

        foreach ($data as $key) {
            $comparison = $key['current'] - $key['previous'];
            $percentage = $key['previous'] > 0 
                ? round(($comparison / $key['previous']) * 100, 2) 
                : 0;

            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Mes Anterior' => $key['previous'] ?? 0,
                'Mes Actual' => $key['current'] ?? 0,
                'Diferencia' => $comparison,
                'Porcentaje' => $percentage . '%'
            ];
        }

        return ['row' => $__row];
    }

    function yearlyReport() {
        $__row = [];
        
        $filters = [
            'udn_id' => $_POST['udn'],
            'social_id' => $_POST['social_network'],
            'year' => $_POST['year']
        ];

        $data = $this->getYearlyComparison($filters);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? round(($comparison / $key['previous_year']) * 100, 2) 
                : 0;

            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Año Anterior' => $key['previous_year'] ?? 0,
                'Año Actual' => $key['current_year'] ?? 0,
                'Diferencia' => $comparison,
                'Porcentaje' => $percentage . '%'
            ];
        }

        return ['row' => $__row];
    }
}

$obj = new ctrl();
$fn = $_POST['opc'];
echo json_encode($obj->$fn());
