<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-campaign.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn'             => $this->lsUDN(),
            'red_social'      => $this->lsRedSocial(),
            'tipo_anuncio'    => $this->lsTypes(),
            'clasificacion'   => $this->lsClassifications()
        ];
    }

    // Campaign Methods

    function lsCampaigns() {
        $__row = [];
        $active = $_POST['active'] ?? 1;
        $udn_id = $_POST['udn_id'] ?? $_SESSION['SUB'];

        $ls = $this->listCampaigns([$active, $udn_id]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-eye"></i>',
                    'onclick' => 'campaign.viewAnnouncements(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-success me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'campaign.editCampaign(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'campaign.statusCampaign(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'campaign.statusCampaign(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'              => $key['id'],
                'Nombre'          => $key['nombre'],
                'Estrategia'      => $key['estrategia'],
                'Red Social'      => $key['red_social'],
                'Fecha Creación'  => $key['fecha_creacion'],
                'Estado'          => renderStatus($key['active']),
                'a'               => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getCampaign() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $getCampaign = $this->getCampaignById([$_POST['id']]);

        if ($getCampaign) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $getCampaign
        ];
    }

    function addCampaign() {
        $status = 500;
        $message = 'No se pudo crear la campaña';

        $lastId = $this->getLastCampaignId();
        $_POST['nombre'] = 'Campaña ' . ($lastId + 1);
        $_POST['fecha_creacion'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;
        $_POST['udn_id'] = $_SESSION['SUB'];

        $create = $this->createCampaign($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Campaña creada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'id'      => $lastId + 1
        ];
    }

    function editCampaign() {
        $status = 500;
        $message = 'Error al editar campaña';

        $edit = $this->updateCampaign($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Campaña editada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function statusCampaign() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateCampaign($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    // Announcement Methods

    function lsAnnouncements() {
        $__row = [];
        $campaña_id = $_POST['campaña_id'];

        $ls = $this->listAnnouncements([$campaña_id]);

        foreach ($ls as $key) {
            $cpc = 0;
            if ($key['total_clics'] > 0) {
                $cpc = $key['total_monto'] / $key['total_clics'];
            }

            $a = [];

            $a[] = [
                'class'   => 'btn btn-sm btn-success me-1',
                'html'    => '<i class="icon-pencil"></i>',
                'onclick' => 'campaign.editAnnouncement(' . $key['id'] . ')'
            ];

            if ($key['total_clics'] == 0 || $key['total_monto'] == 0) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-warning',
                    'html'    => '<i class="icon-chart-bar"></i>',
                    'onclick' => 'campaign.captureResults(' . $key['id'] . ')'
                ];
            }

            $__row[] = [
                'id'              => $key['id'],
                'Nombre'          => $key['nombre'],
                'Tipo'            => $key['tipo'],
                'Clasificación'   => $key['clasificacion'],
                'Fecha Inicio'    => $key['fecha_inicio'],
                'Fecha Fin'       => $key['fecha_fin'],
                'Inversión'       => [
                    'html'  => evaluar($key['total_monto']),
                    'class' => 'text-end'
                ],
                'Clics'           => $key['total_clics'],
                'CPC'             => [
                    'html'  => evaluar($cpc),
                    'class' => 'text-end'
                ],
                'a'               => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getAnnouncement() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $getAnnouncement = $this->getAnnouncementById([$_POST['id']]);

        if ($getAnnouncement) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $getAnnouncement
        ];
    }

    function addAnnouncement() {
        $status = 500;
        $message = 'No se pudo crear el anuncio';

        if (empty($_POST['nombre']) || empty($_POST['fecha_inicio']) || empty($_POST['fecha_fin'])) {
            return [
                'status'  => 400,
                'message' => 'Campos obligatorios faltantes'
            ];
        }

        if (strtotime($_POST['fecha_fin']) < strtotime($_POST['fecha_inicio'])) {
            return [
                'status'  => 400,
                'message' => 'La fecha fin debe ser mayor a la fecha inicio'
            ];
        }

        $_POST['total_monto'] = $_POST['total_monto'] ?? 0;
        $_POST['total_clics'] = $_POST['total_clics'] ?? 0;

        $create = $this->createAnnouncement($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Anuncio creado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editAnnouncement() {
        $status = 500;
        $message = 'Error al editar anuncio';

        if (strtotime($_POST['fecha_fin']) < strtotime($_POST['fecha_inicio'])) {
            return [
                'status'  => 400,
                'message' => 'La fecha fin debe ser mayor a la fecha inicio'
            ];
        }

        $edit = $this->updateAnnouncement($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Anuncio editado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function captureResults() {
        $status = 500;
        $message = 'Error al capturar resultados';

        if ($_POST['total_monto'] <= 0 || $_POST['total_clics'] <= 0) {
            return [
                'status'  => 400,
                'message' => 'El monto y los clics deben ser mayores a 0'
            ];
        }

        $update = $this->updateAnnouncement($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Resultados capturados correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }
}

// Complements

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

function evaluar($value) {
    return '$' . number_format($value, 2, '.', ',');
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
