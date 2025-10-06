<?php
session_start();

if (empty($_POST['opc'])) exit(0);

require_once '../mdl/mdl-kpi-redes.php';
require_once('../../conf/coffeSoft.php');


class ctrl extends mdl {

    function init() {
        return [
            'socialNetworks' => $this->listSocialNetworks(),
            'businessUnits' => $this->listBusinessUnits()
        ];
    }

    // Metricas:
     function lsMetrics() {
        $__row = [];
        
        // Obtener filtros si existen
        $filters = [
            'social_network_id' => $_POST['social_network_id'] ?? null,
            'type' => $_POST['type'] ?? null,
            'status' => $_POST['status'] ?? null
        ];
        
        $ls = $this->listMetrics($filters);

        foreach ($ls as $key) {
        //     // Generar icono de tipo de métrica
            $typeIcon = $this->getMetricTypeIcon($key['type']);
            
            $__row[] = [
                'id' => $key['id'],
                'Red Social' => [
                    'html'  => "<i class='{$key['social_network_icon']}' style='color: {$key['social_network_color']}'></i> {$key['social_network_name']}",
                    'class' => ''
                ],
                'Métrica'     => $key['name'],
                'Descripción' => $this->truncateText($key['description'] ?: 'Sin descripción', 60),
                'Tipo'        => [
                    'html'  => "{$typeIcon} " . ucfirst($key['type']),
                    'class' => 'text-center'
                ],
                'Estado' => [
                    'html'  => $this->generateStatusBadge($key['status']),
                    'class' => 'text-center'
                ],
                'dropdown' => $this->dropdownMetrics($key['id'], $key['status'])
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        
        ];
    }

    function getMetric() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $getMetric = $this->getMetricById([$_POST['id']]);

        if ($getMetric) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $getMetric[0] ?? null
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'Error al agregar métrica';
        
        // Validaciones de entrada
        $validationErrors = $this->validateMetricData($_POST);
        if (!empty($validationErrors)) {
            return [
                'status' => 400,
                'message' => implode('. ', $validationErrors)
            ];
        }
        
        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['status'] = 1;

        $create = $this->createMetric($this->util->sql($_POST));
        if ($create) {
            $status = 200;
            $message = 'Métrica agregada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $status = 500;
        $message = 'Error al editar métrica';
        
        $edit = $this->updateMetric($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'edit'    => $edit
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'Error al cambiar estado';
        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
   


    // Social Networks.

    function lsSocialNetworks() {
        $__row = [];
        
        // Obtener filtros si existen
        $filters = [
            'status' => $_POST['status'] ?? null,
            'name' => $_POST['name'] ?? null
        ];
        
        $ls = $this->listSocialNetworks($filters);

        foreach ($ls as $key) {
            $__row[] = [
                'id'          => $key['id'],
                'Icono' => [
                    'html' => $this->generateColoredIcon($key['icon'], $key['color'], '22px'),
                    'class' => 'text-center '
                ],
                'Nombre'      => $key['valor'],
                'Descripción' => $this->truncateText($key['description'] ?: 'Sin descripción', 60),
               
                'Estado' => [
                    'html' => $this->generateStatusBadge($key['status']),
                    'class' => 'text-center'
                ],
                'Fecha' => formatSpanishDate($key['created_at']),
                'dropdown' => $this->dropdownSocialNetworks($key['id'], $key['status'])
            ];
        }

        return [
            'row' => $__row,
            'total' => count($__row),
            'filters_applied' => array_filter($filters)
        ];
    }

    function getSocialNetwork() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $getSocialNetwork = $this->getSocialNetworkById([$_POST['id']]);

        if ($getSocialNetwork) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $getSocialNetwork[0] ?? null
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'Error al agregar red social';
        
      
        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['status'] = 1;

        $exists = $this->existsSocialNetworkByName([$_POST['name']]);

        if ($exists === 0) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $status = 500;
        $message = 'Error al editar red social';
        
      
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
        $message = 'Error al cambiar estado';
        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }




    // // Components.
    private function generateStatusBadge($status, $activeText = 'Activo', $inactiveText = 'Inactivo') {
        $isActive = $status == 1;

        $badgeClass = $isActive 
            ? 'inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-green-600 text-white' 
            : 'inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-red-600 text-white';

        $text = $isActive ? $activeText : $inactiveText;

        return "<span class='{$badgeClass}'>{$text}</span>";
    }
    
    private function generateColoredIcon($iconClass, $color, $size = '18px') {
        return "<i class='{$iconClass}' style='color: {$color}; font-size: {$size};'></i>";
    }
    
    private function truncateText($text, $maxLength = 50) {
        if (!$text || strlen($text) <= $maxLength) return $text;
        return substr($text, 0, $maxLength) . '...';
    }

    private function dropdownMetrics($id, $status) {
        $opciones = [
            ['text' => 'Editar', 'onclick' => "metricas.editMetric({$id})", 'icon' => 'fas fa-edit'],
        ];

        if ($status == 1) {
            $opciones[] = ['text' => 'Desactivar', 'onclick' => "metricas.statusMetric({$id}, 0)", 'icon' => 'fas fa-ban'];
        } else {
            $opciones[] = ['text' => 'Activar', 'onclick' => "metricas.statusMetric({$id}, 1)", 'icon' => 'fas fa-check'];
        }

        return $opciones;
    }

     private function getMetricTypeIcon($type) {
        $icons = [
            'reach' => '<i class="fas fa-users text-primary"></i>',
            'interaction' => '<i class="fas fa-heart text-danger"></i>',
            'conversion' => '<i class="fas fa-exchange-alt text-success"></i>',
            'investment' => '<i class="fas fa-dollar-sign text-warning"></i>'
        ];
        
        return $icons[$type] ?? '<i class="fas fa-chart-bar text-secondary"></i>';
    }


    private function dropdownSocialNetworks($id, $status) {
        $opciones = [
            ['text' => 'Editar', 'onclick' => "redesCategory.editSocialNetwork({$id})", 'icon' => 'fas fa-edit'],
        ];

        if ($status == 1) {
            $opciones[] = ['text' => 'Desactivar', 'onclick' => "redesCategory.statusSocialNetwork({$id}, 0)", 'icon' => 'fas fa-ban'];
        } else {
            $opciones[] = ['text' => 'Activar', 'onclick' => "redesCategory.statusSocialNetwork({$id}, 1)", 'icon' => 'fas fa-check'];
        }

        return $opciones;
    }
    
}


$ctrl = new ctrl();
echo json_encode($ctrl->{$_POST['opc']}());

