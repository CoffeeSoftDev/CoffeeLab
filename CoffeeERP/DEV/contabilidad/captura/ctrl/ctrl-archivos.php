<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-archivos.php';

class ctrl extends mdl {

    function init() {
        return [
            'modules' => $this->lsModules(),
            'udn' => $this->lsUDN(),
            'counts' => $this->getFileCountsByModule()
        ];
    }

    function ls() {
        $module = $_POST['module'] ?? '';
        $search = $_POST['search'] ?? '';
        $udn_id = $_POST['udn'] ?? null;
        
        $data = $this->listFiles([
            'module' => $module,
            'search' => $search,
            'udn_id' => $udn_id
        ]);
        
        $rows = [];

        foreach ($data as $item) {
            $fileSize = $this->formatFileSize($item['file_size']);
            $fileType = $this->getFileType($item['file_name']);
            
            $rows[] = [
                'id' => $item['id'],
                'Módulo' => [
                    'html' => '<span class="badge bg-primary">' . htmlspecialchars($item['module']) . '</span>',
                    'class' => 'text-center'
                ],
                'Subido por' => htmlspecialchars($item['uploaded_by']),
                'Nombre del archivo' => htmlspecialchars($item['file_name']),
                'Tipo/Tamaño' => [
                    'html' => '<span class="text-muted">' . $fileType . ' / ' . $fileSize . '</span>',
                    'class' => 'text-center'
                ],
                'dropdown' => $this->dropdown($item['id'], $item['src'])
            ];
        }

        return [
            'row' => $rows,
            'ls' => $data
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

    function deleteFile() {
        $status = 500;
        $message = 'Error al eliminar el archivo';
        
        try {
            $id = $_POST['id'];
            
            $file = $this->getFileById([$id]);
            
            if (!$file) {
                return [
                    'status' => 404,
                    'message' => 'Archivo no encontrado'
                ];
            }
            
            $filePath = '../../../' . $file['src'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            
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

    function dropdown($id, $src) {
        return [
            [
                'icon' => 'icon-eye',
                'text' => 'Ver archivo',
                'onclick' => "adminFiles.viewFile($id, '$src')"
            ],
            [
                'icon' => 'icon-download',
                'text' => 'Descargar',
                'onclick' => "adminFiles.downloadFile($id, '$src')"
            ],
            [
                'icon' => 'icon-trash',
                'text' => 'Eliminar',
                'onclick' => "adminFiles.deleteFile($id)"
            ]
        ];
    }

    function formatFileSize($bytes) {
        if ($bytes == 0) return '0 B';
        
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = floor(log($bytes) / log(1024));
        
        return round($bytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }

    function getFileType($filename) {
        $extension = strtoupper(pathinfo($filename, PATHINFO_EXTENSION));
        return $extension ?: 'FILE';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
