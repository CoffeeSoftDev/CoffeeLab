<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-launcher.php';

class ctrl extends mdl {

    function init() {
        $systemVersion = 'v3.0';
        $systemStatus = 'online';
        
        return [
            'version' => $systemVersion,
            'status'  => $systemStatus,
            'user'    => [
                'id'   => $_SESSION['user_id'] ?? null,
                'name' => $_SESSION['username'] ?? 'Usuario'
            ]
        ];
    }

    function getModules() {
        $status  = 500;
        $message = 'Error al obtener módulos';
        $data    = [];
        
        try {
            $userId = $_SESSION['user_id'] ?? null;
            
            if (!$userId) {
                return [
                    'status'  => 401,
                    'message' => 'Sesión no válida',
                    'data'    => []
                ];
            }
            
            $modules = $this->getModulesByUser([]);
            
            if ($modules) {
                $status  = 200;
                $message = 'Módulos obtenidos correctamente';
                $data    = $modules;
            } else {
                $status  = 404;
                $message = 'No se encontraron módulos disponibles';
            }
            
        } catch (Exception $e) {
            $status  = 500;
            $message = 'Error del servidor: ' . $e->getMessage();
        }
        
        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data,
            'count'   => count($data)
        ];
    }

    function logAccess() {
        $status  = 500;
        $message = 'Error al registrar acceso';
        
        try {
            $userId    = $_SESSION['user_id'] ?? null;
            $moduleId  = $_POST['module_id'] ?? null;
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
            
            if (!$userId || !$moduleId) {
                return [
                    'status'  => 400,
                    'message' => 'Datos incompletos'
                ];
            }
            
            $logData = $this->util->sql([
                'user_id'     => $userId,
                'module_id'   => $moduleId,
                'ip_address'  => $ipAddress,
                'module_type' => 'modulo',
                'access_date' => date('Y-m-d H:i:s')
            ]);
            
            $created = $this->createAccessLog($logData);
            
            if ($created) {
                $status  = 200;
                $message = 'Acceso registrado correctamente';
            }
            
        } catch (Exception $e) {
            $status  = 500;
            $message = 'Error al registrar: ' . $e->getMessage();
        }
        
        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    function getAccessHistory() {
        $status  = 500;
        $message = 'Error al obtener historial';
        $data    = [];
        
        try {
            $userId = $_SESSION['user_id'] ?? null;
            
            if (!$userId) {
                return [
                    'status'  => 401,
                    'message' => 'Sesión no válida',
                    'data'    => []
                ];
            }
            
            $history = $this->listAccessLogsByUser([$userId]);
            
            if ($history) {
                $status  = 200;
                $message = 'Historial obtenido correctamente';
                $data    = $history;
            }
            
        } catch (Exception $e) {
            $status  = 500;
            $message = 'Error del servidor: ' . $e->getMessage();
        }
        
        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
