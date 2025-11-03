<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-archivos.php';
require_once '../../../conf/coffeSoft.php';
class ctrl extends mdl {

    function init() {
        $userLevel = 3;
        // if (isset($_SESSION['user_id'])) {
        //     $userLevel = $this->getUserLevel([$_SESSION['user_id']]);
        // }

        return [
            'modules'   => $this->lsModules(),
            'udn'       => $this->lsUDN(),
            'counts'    => $this->getFileCountsByModule(),
            'userLevel' => $userLevel
        ];
    }

    function ls() {
        $fi = $_POST['fi'] ?? date('Y-m-d');
        $ff = $_POST['ff'] ?? date('Y-m-d');
        $module = $_POST['module'] ?? '';
        $udn_id = $_POST['udn'] ?? null;
        
        $data = $this->listFiles([
            'fi'     => $fi,
            'ff'     => $ff,
            'module' => $module,
            'udn_id' => $udn_id
        ]);
        
        $rows = [];

        if (is_array($data) && !empty($data)) {
            foreach ($data as $item) {
                $fileSize = formatFileSize($item['size_bytes']);
                $uploadDate = formatSpanishDate($item['upload_date'], 'normal');
                $moduleBadge = renderModuleBadge($item['module']);
                
                $rows[] = [
                    'id' => $item['id'],
                    'Fecha subida' => $uploadDate,
                    'Módulo' => [
                        'html' => $moduleBadge,
                        'class' => 'text-center'
                    ],
                    'Subido por' => htmlspecialchars($item['uploaded_by']),
                    'Nombre del archivo' => htmlspecialchars($item['file_name']),
                    'Tipo/Tamaño' => [
                        'html' => '<span class="text-muted">' . strtoupper($item['extension']) . ' / ' . $fileSize . '</span>',
                        'class' => 'text-center'
                    ],
                    'a' => actionButtons($item['id'], $item['path'])
                ];
            }
        }

        return [
            'row' => $rows,
            'ls' => $data ?? []
        ];
    }

    function getFile() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Archivo no encontrado';
        $data = null;

        $file = $this->getFileById([$id]);

        if ($file) {
            $status = 200;
            $message = 'Archivo encontrado';
            $data = $file;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function downloadFile() {
        $status = 500;
        $message = 'Error al descargar el archivo';
        
        try {
            $id = $_POST['id'];
            
            if (!isset($_SESSION['user_id'])) {
                return [
                    'status' => 401,
                    'message' => 'Sesión no válida'
                ];
            }
            
            $file = $this->getFileById([$id]);
            
            if (!$file) {
                return [
                    'status' => 404,
                    'message' => 'Archivo no encontrado'
                ];
            }
            
            $token = bin2hex(random_bytes(32));
            $expiry = time() + 300;
            
            $_SESSION['download_tokens'][$token] = [
                'file_id' => $id,
                'user_id' => $_SESSION['user_id'],
                'expiry' => $expiry,
                'path' => $file['path']
            ];
            
            $this->createFileLog($this->util->sql([
                'file_id' => $id,
                'user_id' => $_SESSION['user_id'],
                'action' => 'download',
                'action_date' => date('Y-m-d H:i:s'),
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null
            ]));
            
            $status = 200;
            $message = 'Token generado correctamente';
            $url = '../../../' . $file['path'];
            
        } catch (Exception $e) {
            $status = 500;
            $message = 'Error: ' . $e->getMessage();
        }
        
        return [
            'status' => $status,
            'message' => $message,
            'url' => $url ?? null,
            'token' => $token ?? null
        ];
    }

    function deleteFile() {
        $status = 500;
        $message = 'Error al eliminar el archivo';
        
        try {
            $id = $_POST['id'];
            
            if (!isset($_SESSION['user_id'])) {
                return [
                    'status' => 401,
                    'message' => 'Sesión no válida'
                ];
            }
            
            $userLevel = $this->getUserLevel([$_SESSION['user_id']]);
            
            if ($userLevel < 1) {
                return [
                    'status' => 403,
                    'message' => 'No tiene permisos para eliminar archivos'
                ];
            }
            
            $file = $this->getFileById([$id]);
            
            if (!$file) {
                return [
                    'status' => 404,
                    'message' => 'Archivo no encontrado'
                ];
            }
            
            $filePath = '../../../' . $file['path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            
            $this->createFileLog($this->util->sql([
                'file_id' => $id,
                'user_id' => $_SESSION['user_id'],
                'action' => 'delete',
                'action_date' => date('Y-m-d H:i:s'),
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null
            ]));
            
            $delete = $this->deleteFileById([$id]);
            
            if ($delete) {
                $status = 200;
                $message = 'Archivo eliminado correctamente';
            }
            
        } catch (Exception $e) {
            $status = 500;
            $message = 'Error: ' . $e->getMessage();
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getFileCounts() {
        $counts = $this->getFileCountsByModule();
        
        return [
            'status' => 200,
            'data' => $counts
        ];
    }
}

function actionButtons($id, $path) {
    return [
        [
            'class' => 'btn btn-sm btn-success me-1',
            'html' => '<i class="icon-eye"></i>',
            'onclick' => "app.viewFile($id, '$path')"
        ],
        [
            'class' => 'btn btn-sm btn-primary me-1',
            'html' => '<i class="icon-download"></i>',
            'onclick' => "app.downloadFile($id)"
        ],
        [
            'class' => 'btn btn-sm btn-danger',
            'html' => '<i class="icon-trash"></i>',
            'onclick' => "app.deleteFile($id)"
        ]
    ];
}

function renderModuleBadge($module) {
    $colors = [
        'Ventas' => 'bg-green-500',
        'Compras' => 'bg-blue-500',
        'Almacén' => 'bg-purple-500',
        'Tesorería' => 'bg-orange-500'
    ];
    
    $color = $colors[$module] ?? 'bg-gray-500';
    
    return '<span class="px-2 py-1 rounded text-white text-xs font-semibold ' . $color . '">' . htmlspecialchars($module) . '</span>';
}

function formatFileSize($bytes) {
    if ($bytes == 0) return '0 B';
    
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = floor(log($bytes) / log(1024));
    
    return round($bytes / pow(1024, $i), 2) . ' ' . $units[$i];
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
