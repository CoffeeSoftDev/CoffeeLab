<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-almacen.php';

class ctrl extends mdl {

    function init() {
        return [
            'products' => $this->listProducts(),
            'productClass' => $this->listProductClass(),
            'businessUnits' => $this->listBusinessUnits()
        ];
    }

    function ls() {
        $__row = [];
        $date = $_POST['date'];
        $udn = $_POST['udn'];

        $ls = $this->listWarehouseOutput([$date, $udn]);
        $dailyTotal = $this->getDailyTotal([$date, $udn]);

        foreach ($ls as $key) {
            $__row[] = [
                'id' => $key['id'],
                'Almacén' => $key['product_name'],
                'Monto' => [
                    'html' => evaluar($key['amount']),
                    'class' => 'text-end'
                ],
                'Descripción' => [
                    'html' => '<span class="cursor-pointer text-blue-600 hover:text-blue-800" onclick="app.showDescription(' . $key['id'] . ', \'' . htmlspecialchars($key['description'], ENT_QUOTES) . '\')">
                        <i class="fas fa-info-circle"></i> Ver descripción
                    </span>',
                    'class' => 'text-center'
                ],
                'dropdown' => dropdown($key['id'])
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls,
            'dailyTotal' => evaluar($dailyTotal)
        ];
    }

    function addWarehouseOutput() {
        $status = 500;
        $message = 'No se pudo agregar la salida de almacén';

        $_POST['operation_date'] = $_POST['date'];
        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;

        $create = $this->createWarehouseOutput($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Salida de almacén registrada correctamente';

            $this->logAudit($this->util->sql([
                'udn_id' => $_POST['udn'],
                'user_id' => $_POST['user_id'],
                'record_id' => $create,
                'name_table' => 'warehouse_output',
                'name_user' => $_POST['user_name'] ?? '',
                'name_udn' => $_POST['udn_name'] ?? '',
                'action' => 'create',
                'change_items' => json_encode($_POST)
            ]));
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editWarehouseOutput() {
        $status = 500;
        $message = 'Error al editar la salida de almacén';

        $_POST['updated_at'] = date('Y-m-d H:i:s');

        $edit = $this->updateWarehouseOutput($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Salida de almacén actualizada correctamente';

            $this->logAudit($this->util->sql([
                'udn_id' => $_POST['udn'],
                'user_id' => $_POST['user_id'],
                'record_id' => $_POST['id'],
                'name_table' => 'warehouse_output',
                'name_user' => $_POST['user_name'] ?? '',
                'name_udn' => $_POST['udn_name'] ?? '',
                'action' => 'update',
                'change_items' => json_encode($_POST)
            ]));
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getWarehouseOutput() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $data = null;

        $output = $this->getWarehouseOutputById([$_POST['id']]);

        if ($output) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
            $data = $output;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function deleteWarehouseOutput() {
        $status = 500;
        $message = 'No se pudo eliminar la salida de almacén';

        $output = $this->getWarehouseOutputById([$_POST['id']]);

        $delete = $this->deleteWarehouseOutputById([$_POST['id']]);

        if ($delete) {
            $status = 200;
            $message = 'Salida de almacén eliminada correctamente';

            $this->logAudit($this->util->sql([
                'udn_id' => $_POST['udn'],
                'user_id' => $_POST['user_id'],
                'record_id' => $_POST['id'],
                'name_table' => 'warehouse_output',
                'name_user' => $_POST['user_name'] ?? '',
                'name_udn' => $_POST['udn_name'] ?? '',
                'action' => 'delete',
                'change_items' => json_encode([
                    'deleted_amount' => $output['amount'],
                    'deleted_date' => $output['operation_date']
                ])
            ]));
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function lsReport() {
        $__row = [];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];
        $udn = $_POST['udn'];

        $ls = $this->listWarehouseReport([$fi, $ff, $udn]);
        $totalBalance = $this->getBalance([$fi, $ff, $udn]);

        $groupedData = [];
        foreach ($ls as $key) {
            $class = $key['product_class_name'];
            if (!isset($groupedData[$class])) {
                $groupedData[$class] = [];
            }
            $groupedData[$class][] = $key;
        }

        foreach ($groupedData as $className => $products) {
            $classTotal = 0;
            foreach ($products as $product) {
                $classTotal += $product['total_output'];
            }

            $__row[] = [
                'Clasificación' => [
                    'html' => '<strong>' . $className . '</strong>',
                    'class' => 'bg-gray-200'
                ],
                'Total Salidas' => [
                    'html' => '<strong>' . evaluar($classTotal) . '</strong>',
                    'class' => 'text-end bg-red-100'
                ]
            ];

            foreach ($products as $product) {
                $__row[] = [
                    'Clasificación' => '&nbsp;&nbsp;&nbsp;' . $product['product_name'],
                    'Total Salidas' => [
                        'html' => evaluar($product['total_output']),
                        'class' => 'text-end bg-red-50'
                    ]
                ];
            }
        }

        $__row[] = [
            'Clasificación' => [
                'html' => '<strong>TOTAL GENERAL</strong>',
                'class' => 'bg-blue-200'
            ],
            'Total Salidas' => [
                'html' => '<strong>' . evaluar($totalBalance) . '</strong>',
                'class' => 'text-end bg-blue-200'
            ]
        ];

        return [
            'row' => $__row,
            'totalBalance' => evaluar($totalBalance)
        ];
    }

    function uploadFile() {
        $status = 500;
        $message = 'Error al subir el archivo';

        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $fileSize = $_FILES['file']['size'];
            $maxSize = 20 * 1024 * 1024;

            if ($fileSize > $maxSize) {
                return [
                    'status' => 400,
                    'message' => 'El archivo excede el tamaño máximo de 20 MB'
                ];
            }

            $fileName = $_FILES['file']['name'];
            $extension = pathinfo($fileName, PATHINFO_EXTENSION);
            $uploadPath = '../uploads/' . time() . '_' . $fileName;

            if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadPath)) {
                $create = $this->createFile($this->util->sql([
                    'udn_id' => $_POST['udn'],
                    'user_id' => $_POST['user_id'],
                    'file_name' => $fileName,
                    'size_bytes' => $fileSize,
                    'path' => $uploadPath,
                    'extension' => $extension,
                    'operation_date' => $_POST['date']
                ]));

                if ($create) {
                    $status = 200;
                    $message = 'Archivo subido correctamente';
                }
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function listUploadedFiles() {
        $__row = [];
        $udn = $_POST['udn'];
        $date = $_POST['date'];

        $ls = $this->listFiles([$udn, $date]);

        foreach ($ls as $key) {
            $__row[] = [
                'id' => $key['id'],
                'Archivo' => $key['file_name'],
                'Tamaño' => formatBytes($key['size_bytes']),
                'Fecha de subida' => formatSpanishDate($key['upload_date']),
                'a' => [
                    [
                        'class' => 'btn btn-sm btn-danger',
                        'html' => '<i class="fas fa-trash"></i>',
                        'onclick' => 'fileUpload.deleteFile(' . $key['id'] . ')'
                    ]
                ]
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function deleteFile() {
        $status = 500;
        $message = 'Error al eliminar el archivo';

        $delete = $this->deleteFileById([$_POST['id']]);

        if ($delete) {
            $status = 200;
            $message = 'Archivo eliminado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function dropdown($id) {
    return [
        [
            'icon' => 'icon-pencil',
            'text' => 'Editar',
            'onclick' => "app.editWarehouseOutput($id)"
        ],
        [
            'icon' => 'icon-trash',
            'text' => 'Eliminar',
            'onclick' => "app.deleteWarehouseOutput($id)"
        ]
    ];
}

function formatBytes($bytes) {
    if ($bytes >= 1048576) {
        return number_format($bytes / 1048576, 2) . ' MB';
    } elseif ($bytes >= 1024) {
        return number_format($bytes / 1024, 2) . ' KB';
    }
    return $bytes . ' bytes';
}

function evaluar($amount) {
    return '$' . number_format($amount, 2);
}

function formatSpanishDate($date) {
    $timestamp = strtotime($date);
    $months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return date('d', $timestamp) . ' de ' . $months[date('n', $timestamp) - 1] . ' de ' . date('Y', $timestamp);
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
