<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-admin.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'modules' => $this->lsModules()
        ];
    }

    function lsModulesUnlocked() {
        $__row = [];
        $active = isset($_POST['active']) ? $_POST['active'] : 1;
        
        $ls = $this->listModulesUnlocked([$active]);

        foreach ($ls as $key) {
            $lockIcon = $key['active'] == 1 
                ? '<i class="icon-lock-open text-green-500 cursor-pointer" onclick="app.toggleLockStatus(' . $key['id'] . ', ' . $key['active'] . ')"></i>'
                : '<i class="icon-lock text-red-500 cursor-pointer" onclick="app.toggleLockStatus(' . $key['id'] . ', ' . $key['active'] . ')"></i>';

            $__row[] = [
                'id' => $key['id'],
                'UDN' => $key['udn_name'],
                'Fecha solicitada' => $key['unlock_date_formatted'],
                'Módulo' => $key['module_name'],
                'Motivo' => $key['lock_reason'],
                'Bloquear' => [
                    'html' => $lockIcon,
                    'class' => 'text-center'
                ]
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function addUnlockRequest() {
        $status = 500;
        $message = 'Error al registrar solicitud';

        try {
            $exists = $this->existsActiveUnlock([
                $_POST['udn_id'],
                $_POST['module_id']
            ]);

            if ($exists) {
                return [
                    'status' => 409,
                    'message' => 'Ya existe una solicitud activa para este módulo y UDN'
                ];
            }

            $_POST['operation_date'] = date('Y-m-d H:i:s');
            $_POST['active'] = 1;

            $create = $this->createUnlockRequest($this->util->sql($_POST));

            if ($create) {
                $status = 200;
                $message = 'Solicitud registrada correctamente';
            }

        } catch (Exception $e) {
            $status = 500;
            $message = 'Error del servidor: ' . $e->getMessage();
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getUnlockRequest() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $data = null;

        $get = $this->getUnlockRequestById($_POST['id']);

        if ($get) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
            $data = $get;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function toggleLockStatus() {
        $status = 500;
        $message = 'Error al actualizar el estado';

        try {
            $_POST['operation_date'] = date('Y-m-d H:i:s');
            
            $update = $this->updateModuleStatus($this->util->sql($_POST, 1));

            if ($update) {
                $status = 200;
                $message = 'Estado actualizado correctamente';
            }

        } catch (Exception $e) {
            $status = 500;
            $message = 'Error del servidor: ' . $e->getMessage();
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function lsCloseTime() {
        $__row = [];
        $ls = $this->listCloseTime();

        $meses = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
            5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
            9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];

        foreach ($ls as $key) {
            $a = [];
            
            $currentMonth = (int)date('n');
            
            if ($key['month'] >= $currentMonth) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'app.editCloseTime(' . $key['id'] . ', ' . $key['month'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Mes' => $meses[$key['month']],
                'Hora de cierre' => $key['close_time_formatted'],
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function updateCloseTime() {
        $status = 500;
        $message = 'Error al actualizar horario';

        try {
            $selectedMonth = (int)$_POST['month'];
            $currentMonth = (int)date('n');

            if ($selectedMonth < $currentMonth) {
                return [
                    'status' => 400,
                    'message' => 'No se puede editar horarios de meses pasados'
                ];
            }

            $_POST['updated_at'] = date('Y-m-d H:i:s');
            $_POST['updated_by'] = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : 'Sistema';

            $update = $this->updateCloseTimeByMonth($this->util->sql($_POST, 1));

            if ($update) {
                $status = 200;
                $message = 'Horario actualizado correctamente';
            }

        } catch (Exception $e) {
            $status = 500;
            $message = 'Error del servidor: ' . $e->getMessage();
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
