<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-ventas.php';
require_once '../mdl/mdl-admin.php';

class ctrl extends mdlVentas {

    private $adminModel;

    public function __construct() {
        parent::__construct();
        $this->adminModel = new mdl();
    }

    function init() {
        $udn = $_POST['udn'];

        return [
            'saleCategories' => $this->adminModel->lsSaleCategory([$udn]),
            'discounts'      => $this->adminModel->lsDiscount([$udn]),
            'cashConcepts'   => $this->adminModel->lsCashConcept([$udn]),
            'bankAccounts'   => $this->adminModel->lsBankAccount([$udn]),
            'customers'      => $this->adminModel->lsCustomer([$udn])
        ];
    }

    // Daily Sales Capture

    function saveDailySale() {
        $status = 500;
        $message = 'Error al guardar la venta';
        $closureId = null;

        if (empty($_POST['operation_date']) || empty($_POST['udn_id'])) {
            return [
                'status' => 400,
                'message' => 'La fecha de operación y UDN son requeridos'
            ];
        }

        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['status'] = 'open';

        $closureData = $this->util->sql($_POST);
        $closureId = $this->createDailySale($closureData);

        if ($closureId) {
            $status = 200;
            $message = 'Venta guardada correctamente';

            if (isset($_POST['categories']) && is_array($_POST['categories'])) {
                foreach ($_POST['categories'] as $category) {
                    $category['daily_closure_id'] = $closureId;
                    $this->createSaleDetail($this->util->sql($category));
                }
            }

            if (isset($_POST['discounts']) && is_array($_POST['discounts'])) {
                foreach ($_POST['discounts'] as $discount) {
                    $discount['daily_closure_id'] = $closureId;
                    $this->createDiscountDetail($this->util->sql($discount));
                }
            }
        }

        return [
            'status' => $status,
            'message' => $message,
            'closure_id' => $closureId
        ];
    }

    function getDailySale() {
        $id = $_POST['id'];
        $closure = $this->getDailySaleById($id);

        if (!$closure) {
            return [
                'status' => 404,
                'message' => 'Corte no encontrado'
            ];
        }

        $saleDetails = $this->getSaleDetails($id);
        $discountDetails = $this->getDiscountDetails($id);
        $paymentDetails = $this->getPaymentDetails($id);

        return [
            'status' => 200,
            'message' => 'Datos obtenidos',
            'data' => [
                'closure' => $closure,
                'saleDetails' => $saleDetails,
                'discountDetails' => $discountDetails,
                'paymentDetails' => $paymentDetails
            ]
        ];
    }

    // Payment Forms

    function savePaymentForms() {
        $status = 500;
        $message = 'Error al guardar formas de pago';

        $closureId = $_POST['closure_id'];
        $closureStatus = $this->validateClosureStatus($closureId);

        if ($closureStatus === 'closed') {
            return [
                'status' => 403,
                'message' => 'El corte ya está cerrado y no puede modificarse'
            ];
        }

        $updateData = [
            'values' => 'cash = ?, bank = ?, foreing_currency = ?, credit_consumer = ?, credit_payment = ?, total_received = ?, difference = ?',
            'where' => 'id = ?',
            'data' => [
                $_POST['cash'],
                $_POST['bank'],
                $_POST['foreing_currency'],
                $_POST['credit_consumer'],
                $_POST['credit_payment'],
                $_POST['total_received'],
                $_POST['difference'],
                $closureId
            ]
        ];

        $updated = $this->updateDailySale($updateData);

        if ($updated) {
            $status = 200;
            $message = 'Formas de pago guardadas correctamente';

            if (isset($_POST['cashDetails']) && is_array($_POST['cashDetails'])) {
                foreach ($_POST['cashDetails'] as $cash) {
                    $cash['daily_closure_id'] = $closureId;
                    $this->createCashDetail($this->util->sql($cash));
                }
            }

            if (isset($_POST['bankDetails']) && is_array($_POST['bankDetails'])) {
                foreach ($_POST['bankDetails'] as $bank) {
                    $bank['daily_closure_id'] = $closureId;
                    $this->createBankDetail($this->util->sql($bank));
                }
            }

            if (isset($_POST['creditDetails']) && is_array($_POST['creditDetails'])) {
                foreach ($_POST['creditDetails'] as $credit) {
                    $credit['daily_closure_id'] = $closureId;
                    $this->createCreditDetail($this->util->sql($credit));

                    if ($credit['movement_type'] === 'consumo') {
                        $this->adminModel->updateCustomerBalance([$credit['amount'], $credit['customer_id']]);
                    } elseif ($credit['movement_type'] === 'pago') {
                        $this->adminModel->updateCustomerBalance([-$credit['amount'], $credit['customer_id']]);
                    }
                }
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function convertCurrency() {
        $amount = floatval($_POST['amount']);
        $currency = $_POST['currency'];
        $rate = floatval($_POST['rate'] ?? 0);

        $converted = 0;

        if ($currency === 'USD' && $rate > 0) {
            $converted = $amount * $rate;
        } elseif ($currency === 'EUR' && $rate > 0) {
            $converted = $amount * $rate;
        }

        return [
            'status' => 200,
            'converted' => $converted
        ];
    }

    // Closure Validation and Locking

    function closeDailyOperation() {
        $closureId = $_POST['closure_id'];
        $closure = $this->getDailySaleById($closureId);

        if (!$closure) {
            return [
                'status' => 404,
                'message' => 'Corte no encontrado'
            ];
        }

        if ($closure['status'] === 'closed') {
            return [
                'status' => 403,
                'message' => 'El corte ya está cerrado'
            ];
        }

        $difference = abs(floatval($closure['difference']));
        $threshold = 1.00;

        if ($difference > $threshold) {
            return [
                'status' => 400,
                'message' => 'La diferencia excede el umbral permitido ($' . $threshold . ')'
            ];
        }

        $locked = $this->lockClosure($closureId);

        return [
            'status' => $locked ? 200 : 500,
            'message' => $locked ? 'Corte cerrado exitosamente' : 'Error al cerrar el corte'
        ];
    }

    function lsDailySales() {
        $__row = [];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];
        $udn = $_POST['udn'];

        $ls = $this->listDailySales([$fi, $ff, $udn]);

        foreach ($ls as $key) {
            $differenceClass = $key['difference'] != 0 ? 'text-danger font-bold' : 'text-success';
            
            $statusBadge = $key['status'] === 'closed' ? 
                '<span class="badge bg-success">Cerrado</span>' : 
                '<span class="badge bg-warning">Abierto</span>';

            $dropdown = [];

            if ($key['status'] === 'open') {
                $dropdown[] = [
                    'icon' => 'icon-pencil',
                    'text' => 'Editar',
                    'onclick' => 'saleCapture.editDailySale(' . $key['id'] . ')'
                ];

                $dropdown[] = [
                    'icon' => 'icon-lock',
                    'text' => 'Cerrar corte',
                    'onclick' => 'saleCapture.closeDailySale(' . $key['id'] . ')'
                ];
            } else {
                $dropdown[] = [
                    'icon' => 'icon-eye',
                    'text' => 'Ver detalles',
                    'onclick' => 'saleCapture.viewDailySale(' . $key['id'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Fecha' => $key['operation_date'],
                'Total Venta' => '$' . number_format($key['total_sale'], 2),
                'Total Recibido' => '$' . number_format($key['total_received'], 2),
                'Diferencia' => [
                    'html' => '$' . number_format($key['difference'], 2),
                    'class' => $differenceClass
                ],
                'Estado' => $statusBadge,
                'Turno' => $key['turn'] ?? 'N/A',
                'dropdown' => $dropdown
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    // Turn Control (Quinta Tabachines)

    function getTurnSummary() {
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];
        $udn = $_POST['udn'];

        $summary = $this->getTurnSummaryByUDN([$fi, $ff, $udn]);

        return [
            'status' => 200,
            'data' => $summary
        ];
    }

    // File Upload

    function uploadFiles() {
        $status = 500;
        $message = 'Error al subir archivos';
        $uploadedFiles = [];

        if (!isset($_FILES['files'])) {
            return [
                'status' => 400,
                'message' => 'No se recibieron archivos'
            ];
        }

        $closureId = $_POST['closure_id'];
        $uploadDir = '../../erp_files/ventas/';

        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $allowedExtensions = ['pdf', 'xml', 'jpg', 'jpeg', 'png'];
        $maxFileSize = 20 * 1024 * 1024;

        foreach ($_FILES['files']['tmp_name'] as $key => $tmpName) {
            $fileName = $_FILES['files']['name'][$key];
            $fileSize = $_FILES['files']['size'][$key];
            $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            if (!in_array($fileExt, $allowedExtensions)) {
                continue;
            }

            if ($fileSize > $maxFileSize) {
                continue;
            }

            $uniqueName = time() . '_' . uniqid() . '.' . $fileExt;
            $filePath = $uploadDir . $uniqueName;

            if (move_uploaded_file($tmpName, $filePath)) {
                $fileData = [
                    'values' => 'daily_closure_id, file_name, file_path, file_type, file_size',
                    'data' => [$closureId, $fileName, $filePath, $fileExt, $fileSize]
                ];

                $fileId = $this->createClosureFile($fileData);

                if ($fileId) {
                    $uploadedFiles[] = [
                        'id' => $fileId,
                        'name' => $fileName,
                        'path' => $filePath
                    ];
                }
            }
        }

        if (count($uploadedFiles) > 0) {
            $status = 200;
            $message = 'Archivos subidos correctamente';
        }

        return [
            'status' => $status,
            'message' => $message,
            'files' => $uploadedFiles
        ];
    }

    function deleteFile() {
        $fileId = $_POST['file_id'];
        $file = $this->getClosureFileById($fileId);

        if (!$file) {
            return [
                'status' => 404,
                'message' => 'Archivo no encontrado'
            ];
        }

        if (file_exists($file['file_path'])) {
            unlink($file['file_path']);
        }

        $deleted = $this->deleteClosureFile($fileId);

        return [
            'status' => $deleted ? 200 : 500,
            'message' => $deleted ? 'Archivo eliminado' : 'Error al eliminar'
        ];
    }

    // Soft-Restaurant Integration

    function loadSoftRestaurant() {
        return [
            'status' => 200,
            'message' => 'Integración pendiente de implementación',
            'data' => []
        ];
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
