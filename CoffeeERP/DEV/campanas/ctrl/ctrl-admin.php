<?php
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-admin.php';

class ctrl extends mdl {

    // Tipo Anuncio Methods

    function lsTypes() {
        $__row = [];
        $active = $_POST['active'] ?? 1;

        $ls = $this->listTypes([$active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'admin.editType(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'admin.statusType(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'admin.statusType(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'     => $key['id'],
                'Nombre' => $key['valor'],
                'Estado' => renderStatus($key['active']),
                'a'      => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getType() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $getType = $this->getTypeById([$_POST['id']]);

        if ($getType) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $getType
        ];
    }

    function addType() {
        $status = 500;
        $message = 'No se pudo crear el tipo de anuncio';

        $_POST['active'] = 1;

        $create = $this->createType($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Tipo de anuncio creado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editType() {
        $status = 500;
        $message = 'Error al editar tipo de anuncio';

        $edit = $this->updateType($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Tipo de anuncio editado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function statusType() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateType($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    // Clasificacion Anuncio Methods

    function lsClassifications() {
        $__row = [];
        $active = $_POST['active'] ?? 1;

        $ls = $this->listClassifications([$active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'admin.editClassification(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'admin.statusClassification(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'admin.statusClassification(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'     => $key['id'],
                'Nombre' => $key['valor'],
                'Estado' => renderStatus($key['active']),
                'a'      => $a
            ];
        }

        return [
            'row' => $__row,
            'ls'  => $ls
        ];
    }

    function getClassification() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $getClassification = $this->getClassificationById([$_POST['id']]);

        if ($getClassification) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $getClassification
        ];
    }

    function addClassification() {
        $status = 500;
        $message = 'No se pudo crear la clasificación';

        $_POST['active'] = 1;

        $create = $this->createClassification($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Clasificación creada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function editClassification() {
        $status = 500;
        $message = 'Error al editar clasificación';

        $edit = $this->updateClassification($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Clasificación editada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function statusClassification() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateClassification($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
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

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
