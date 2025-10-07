<?php
session_start();
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-kpi-campaign.php';

class ctrl extends mdl {

    function init() {
        return [
            
            'udn'             => $this->lsUDN(),
            'campaigns'       => $this->listCampaigns(),
            'types'           => $this->listCampaignTypes([1, 1]),
            'classifications' => $this->listCampaignClassification([1, 1]),

            'socialNetworks'  => [
                ['id' => 'Facebook', 'valor' => 'Facebook'],
                ['id' => 'Instagram', 'valor' => 'Instagram'],
                ['id' => 'TikTok', 'valor' => 'TikTok'],
                ['id' => 'Twitter', 'valor' => 'Twitter'],
                ['id' => 'LinkedIn', 'valor' => 'LinkedIn'],
                ['id' => 'YouTube', 'valor' => 'YouTube']
            ]
        ];
    }

    // Campaign Types

    function lsCampaignTypes() {
        $__row = [];
        $active = $_POST['active'];
        $udn = $_POST['udn'];

        $ls = $this->listCampaignTypes([$active, $udn]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'campaignTypes.editCampaignType(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'campaignTypes.statusCampaignType(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'campaignTypes.statusCampaignType(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['name'],
                'Descripción' => $key['description'],
                'Fecha de creación' => $key['date_creation'],
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getCampaignType() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $data = null;

        $getCampaignType = $this->getCampaignTypeById([$_POST['id']]);

        if ($getCampaignType) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
            $data = $getCampaignType;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addCampaignType() {
        $status = 500;
        $message = 'No se pudo agregar el tipo de campaña';

        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $exists = $this->existsCampaignTypeByName([$_POST['name'], $_POST['udn_id']]);

        if (!$exists) {
            $create = $this->createCampaignType($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Tipo de campaña agregado correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe un tipo de campaña con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editCampaignType() {
        $status = 500;
        $message = 'Error al editar tipo de campaña';

        $edit = $this->updateCampaignType($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Tipo de campaña editado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusCampaignType() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateCampaignType($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Campaign Classification

    function lsCampaignClassification() {
        $__row = [];
        $active = $_POST['active'];
        $udn = $_POST['udn'];

        $ls = $this->listCampaignClassification([$active, $udn]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'campaignClassification.editCampaignClassification(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'campaignClassification.statusCampaignClassification(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'campaignClassification.statusCampaignClassification(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Nombre' => $key['name'],
                'Descripción' => $key['description'],
                'Fecha de creación' => $key['date_creation'],
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getCampaignClassification() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $data = null;

        $getCampaignClassification = $this->getCampaignClassificationById([$_POST['id']]);

        if ($getCampaignClassification) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
            $data = $getCampaignClassification;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addCampaignClassification() {
        $status = 500;
        $message = 'No se pudo agregar la clasificación';

        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $exists = $this->existsCampaignClassificationByName([$_POST['name'], $_POST['udn_id']]);

        if (!$exists) {
            $create = $this->createCampaignClassification($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Clasificación agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una clasificación con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editCampaignClassification() {
        $status = 500;
        $message = 'Error al editar clasificación';

        $edit = $this->updateCampaignClassification($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Clasificación editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusCampaignClassification() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateCampaignClassification($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Campaign Ads

    function lsCampaignAds() {
        $__row = [];
        $active = $_POST['active'];
        $udn = $_POST['udn'];

        $ls = $this->listCampaignAds([$active, $udn]);

        foreach ($ls as $key) {
            $a = [];

            $a[] = [
                'class' => 'btn btn-sm btn-primary me-1',
                'html' => '<i class="icon-pencil"></i>',
                'onclick' => 'ads.editCampaignAd(' . $key['id'] . ')'
            ];

            $a[] = [
                'class' => 'btn btn-sm btn-success',
                'html' => '<i class="icon-chart-bar"></i>',
                'onclick' => 'ads.showResults(' . $key['id'] . ')'
            ];

            $imageHtml = !empty($key['image']) 
                ? '<img src="' . $key['image'] . '" class="w-12 h-12 py-2 object-cover rounded" />' 
                : '<div class="w-12 h-12 bg-gray-300 rounded flex items-center justify-center"><i class="icon-image text-gray-500"></i></div>';

            $__row[] = [
                'id' => $key['id'],
                'Imagen' => ['html' => $imageHtml, 'class' => 'text-center'],
                'Título' => $key['title'],
                'Subtítulo' => $key['subtitle'],
                'Campaña' => $key['campaign_name'],
                'Anuncio' => $key['ad_name'],
                'Clasificación' => $key['classification_name'],
                'Tipo' => $key['type_name'],
                'Fecha Inicio' => formatSpanishDate($key['start_date']),
                'Fecha Final' => formatSpanishDate($key['end_date']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getCampaignAd() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $data = null;

        $getCampaignAd = $this->getCampaignAdById([$_POST['id']]);

        if ($getCampaignAd) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
            $data = $getCampaignAd;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addCampaignAd() {
        $status = 500;
        $message = 'No se pudo agregar el anuncio';

        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $create = $this->createCampaignAd($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Anuncio agregado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editCampaignAd() {
        $status  = 500;
        $message = 'Error al editar anuncio';

        $edit = $this->updateCampaignAd($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Anuncio editado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function addCampaign() {
        $status = 500;
        $message = 'No se pudo crear la campaña';

        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $create = $this->createCampaign($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Campaña creada correctamente';
            $data = ['campaign_id' => $create];
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data ?? null
        ];
    }

    function addCampaignWithAd() {
        $status = 500;
        $message = 'No se pudo crear la campaña y anuncio';

        // Crear campaña
        $campaignData = [
            'name' => $_POST['ad_name'] . ' - Campaña',
            'udn_id' => $_POST['udn_id'],
            'social_network' => $_POST['social_network'],
            'strategy' => $_POST['strategy'],
            'start_date' => $_POST['start_date'],
            'end_date' => $_POST['end_date'],
            'active' => 1,
            'date_creation' => date('Y-m-d H:i:s')
        ];

        $campaignId = $this->createCampaign($this->util->sql($campaignData));

        if ($campaignId) {
            // Crear anuncio
            $adData = [
                'campaign_id' => $campaignId,
                'ad_name' => $_POST['ad_name'],
                'title' => $_POST['ad_name'],
                'type_id' => $_POST['type_id'] ?? null,
                'classification_id' => $_POST['classification_id'] ?? null,
                'image' => $_POST['image'] ?? null,
                'start_date' => $_POST['start_date'],
                'end_date' => $_POST['end_date'],
                'active' => 1,
                'date_creation' => date('Y-m-d H:i:s')
            ];

            $adId = $this->createCampaignAd($this->util->sql($adData));

            if ($adId) {
                $status = 200;
                $message = 'Campaña y anuncio creados correctamente';
            } else {
                $message = 'Campaña creada pero error al crear anuncio';
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function addCampaignWithMultipleAds() {
        $status = 500;
        $message = 'No se pudo crear la campaña';

        // Crear campaña
        $campaignData = [
            'name' => 'Campaña ' . date('Y-m-d H:i:s'),
            'udn_id' => $_POST['udn_id'],
            'social_network' => $_POST['social_network'],
            'strategy' => $_POST['strategy'],
            'active' => 1,
            'date_creation' => date('Y-m-d H:i:s')
        ];

        $campaignId = $this->createCampaign($this->util->sql($campaignData));

        if ($campaignId) {
            $adsCreated = 0;
            $ads = json_decode($_POST['ads'], true);

            if (is_array($ads)) {
                foreach ($ads as $ad) {
                    $adData = [
                        'campaign_id' => $campaignId,
                        'ad_name' => $ad['ad_name'],
                        'title' => $ad['ad_name'],
                        'subtitle' => $ad['classification_name'] ?? null,
                        'type_id' => !empty($ad['type_id']) ? $ad['type_id'] : null,
                        'image' => $ad['image_url'] ?? null,
                        'start_date' => $ad['start_date'],
                        'end_date' => $ad['end_date'],
                        'active' => 1,
                        'date_creation' => date('Y-m-d H:i:s')
                    ];

                    $adId = $this->createCampaignAd($this->util->sql($adData));
                    if ($adId) {
                        $adsCreated++;
                    }
                }

                if ($adsCreated > 0) {
                    $status = 200;
                    $message = "Campaña creada con $adsCreated anuncio(s) correctamente";
                } else {
                    $message = 'Campaña creada pero no se pudieron crear los anuncios';
                }
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getAdResults() {
        $status = 500;
        $message = 'Error al obtener resultados';
        $data = null;

        $results = $this->getCampaignAdResults([$_POST['ad_id']]);

        if ($results) {
            $status = 200;
            $message = 'Resultados obtenidos';
            $data = $results;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function saveAdResults() {
        $status = 500;
        $message = 'Error al guardar resultados';

        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['date_recorded'] = date('Y-m-d');
        
        $totalSpent = floatval($_POST['total_spent']);
        $totalResults = intval($_POST['total_results']);
        $_POST['cost_per_result'] = $totalResults > 0 ? round($totalSpent / $totalResults, 2) : 0;

        if (isset($_POST['id']) && !empty($_POST['id'])) {
            $update = $this->updateCampaignAdResult($this->util->sql($_POST, 1));
            if ($update) {
                $status = 200;
                $message = 'Resultados actualizados correctamente';
            }
        } else {
            $create = $this->createCampaignAdResult($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Resultados guardados correctamente';
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Historial Anual - Reportes

    function lsReporteCPC() {
        $__row = [];
        $udn = $_POST['udn'] ?? null;
        $mes = $_POST['mes'] ?? date('n');
        $anio = $_POST['anio'] ?? date('Y');

        $ls = $this->getReporteCPC([$udn, $mes, $anio]);

        $totalInversion = 0;
        $totalClics = 0;

        foreach ($ls as $key) {
            $inversion = floatval($key['inversion_total']);
            $clics = intval($key['clics_cpc']);
            
            $totalInversion += $inversion;
            $totalClics += $clics;

            $__row[] = [
                'id' => $key['id'],
                'Mes' => $key['mes_nombre'],
                'Campaña' => $key['campaign_name'],
                'Anuncio' => $key['ad_name'],
                'Plataforma' => $key['social_network'],
                'Inversión Total' => [
                    'html' => '$' . number_format($inversion, 2),
                    'class' => 'text-end'
                ],
                'Clics CPC' => [
                    'html' => number_format($clics),
                    'class' => 'text-center'
                ]
            ];
        }

        // Agregar fila de totales
        if (!empty($__row)) {
            $__row[] = [
                'id' => 'total',
                'Mes' => '',
                'Campaña' => '',
                'Anuncio' => '',
                'Plataforma' => '<strong>TOTAL</strong>',
                'Inversión Total' => [
                    'html' => '<strong>$' . number_format($totalInversion, 2) . '</strong>',
                    'class' => 'text-end bg-light'
                ],
                'Clics CPC' => [
                    'html' => '<strong>' . number_format($totalClics) . '</strong>',
                    'class' => 'text-center bg-light'
                ]
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function lsReporteCAC() {
        $__row = [];
        $udn = $_POST['udn'] ?? null;
        $mes = $_POST['mes'] ?? date('n');
        $anio = $_POST['anio'] ?? date('Y');

        $ls = $this->getReporteCAC([$udn, $mes, $anio]);

        $totalInversion = 0;
        $totalClientes = 0;

        foreach ($ls as $key) {
            $inversion = floatval($key['inversion_total']);
            $clientes = intval($key['clientes_cac']);
            
            $totalInversion += $inversion;
            $totalClientes += $clientes;

            $__row[] = [
                'id' => $key['id'],
                'Mes' => $key['mes_nombre'],
                'Campaña' => $key['campaign_name'],
                'Anuncio' => $key['ad_name'],
                'Plataforma' => $key['social_network'],
                'Inversión Total' => [
                    'html' => '$' . number_format($inversion, 2),
                    'class' => 'text-end'
                ],
                'Clientes CAC' => [
                    'html' => number_format($clientes),
                    'class' => 'text-center'
                ]
            ];
        }

        // Agregar fila de totales
        if (!empty($__row)) {
            $__row[] = [
                'id' => 'total',
                'Mes' => '',
                'Campaña' => '',
                'Anuncio' => '',
                'Plataforma' => '<strong>TOTAL</strong>',
                'Inversión Total' => [
                    'html' => '<strong>$' . number_format($totalInversion, 2) . '</strong>',
                    'class' => 'text-end bg-light'
                ],
                'Clientes CAC' => [
                    'html' => '<strong>' . number_format($totalClientes) . '</strong>',
                    'class' => 'text-center bg-light'
                ]
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    // Resumen de Campaña

    function lsResumenCampana() {
        $__row = [];
        $udn = $_POST['udn'] ?? null;
        $mes = $_POST['mes'] ?? date('n');
        $anio = $_POST['anio'] ?? date('Y');
        $redSocial = $_POST['red_social'] ?? null;

        $ls = $this->getResumenCampana([$udn, $mes, $anio, $redSocial]);

        $totalInversion = 0;
        $totalClics = 0;
        $totalCPC = 0;
        $contador = 0;

        foreach ($ls as $key) {
            $inversion = floatval($key['inversion']);
            $clics = intval($key['clic']);
            $cpc = floatval($key['cpc']);
            
            $totalInversion += $inversion;
            $totalClics += $clics;
            $totalCPC += $cpc;
            $contador++;

            // Calcular duración
            $fechaInicio = new DateTime($key['start_date']);
            $fechaFin = new DateTime($key['end_date']);
            $duracion = $fechaInicio->diff($fechaFin)->days + 1;

            $__row[] = [
                'id' => $key['id'],
                'Campaña' => $key['campaign_name'],
                'Anuncio' => $key['ad_name'],
                'Duración' => $fechaInicio->format('d/m/Y') . ' - ' . $fechaFin->format('d/m/Y') . ' DÍAS: ' . $duracion,
                'Tipo' => $key['type_name'] ?? '-',
                'Clasificación' => $key['classification_name'] ?? '-',
                'Inversión' => [
                    'html' => '$' . number_format($inversion, 2),
                    'class' => 'text-end'
                ],
                'Clic' => [
                    'html' => number_format($clics),
                    'class' => 'text-center'
                ],
                'CPC' => [
                    'html' => '$' . number_format($cpc, 2),
                    'class' => 'text-end'
                ]
            ];
        }

        // Agregar fila de totales y promedios
        if (!empty($__row)) {
            $promedioCPC = $contador > 0 ? $totalCPC / $contador : 0;
            
            $__row[] = [
                'id' => 'total',
                'Campaña' => '<strong>TOTALES/PROMEDIOS</strong>',
                'Anuncio' => '',
                'Duración' => '',
                'Tipo' => '',
                'Clasificación' => '',
                'Inversión' => [
                    'html' => '<strong>$' . number_format($totalInversion, 2) . '</strong>',
                    'class' => 'text-end bg-light'
                ],
                'Clic' => [
                    'html' => '<strong>' . number_format($totalClics) . '</strong>',
                    'class' => 'text-center bg-light'
                ],
                'CPC' => [
                    'html' => '<strong>$' . number_format($promedioCPC, 2) . '</strong>',
                    'class' => 'text-end bg-light'
                ]
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
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

function formatSpanishDate($date) {
    if (empty($date)) return '-';
    $timestamp = strtotime($date);
    $months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return date('d', $timestamp) . ' ' . $months[date('n', $timestamp) - 1] . ' ' . date('Y', $timestamp);
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
