<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-compras.php';

class ctrl extends mdl {

    function init() {
        return [
            'productClass' => $this->lsProductClass(),
            'product' => $this->lsProduct(),
            'supplier' => $this->lsSupplier(),
            'purchaseType' => $this->lsPurchaseType(),
            'methodPay' => $this->lsMethodPay(),
            'udn' => $this->lsUdn()
        ];
    }

    function ls() {
        $__row = [];
        
        $udn = $_POST['udn'];
        $purchaseType = $_POST['purchase_type'];
        $methodPay = $_POST['method_pay'];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];

        $ls = $this->listCompras([
            'udn' => $udn,
            'purchase_type' => $purchaseType,
            'method_pay' => $methodPay,
            'fi' => $fi,
            'ff' => $ff
        ]);

        $totales = [
            'total_general' => 0,
            'fondo_fijo' => 0,
            'corporativo' => 0,
            'credito' => 0
        ];

        foreach ($ls as $key) {
            $totales['total_general'] += $key['total'];
            
            switch ($key['purchase_type_id']) {
                case 1:
                    $totales['fondo_fijo'] += $key['total'];
                    break;
                case 2:
                    $totales['corporativo'] += $key['total'];
                    break;
                case 3:
                    $totales['credito'] += $key['total'];
                    break;
            }

            $__row[] = [
                'id' => $key['id'],
                'Folio' => '#' . str_pad($key['id'], 6, '0', STR_PAD_LEFT),
                'Fecha' => formatSpanishDate($key['operation_date']),
                'Producto' => $key['product_name'],
                'Tipo' => renderPurchaseType($key['purchase_type_id']),
                'Subtotal' => [
                    'html' => evaluar($key['subtotal']),
                    'class' => 'text-end'
                ],
                'Total' => [
                    'html' => evaluar($key['total']),
                    'class' => 'text-end font-bold'
                ],
                'dropdown' => dropdown($key['id'])
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls,
            'totales' => $totales
        ];
    }

    function getCompra() {
        $status = 500;
        $message = 'Error al obtener los datos';
        $data = null;

        $compra = $this->getCompraById([$_POST['id']]);

        if ($compra) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
            $data = $compra;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addCompra() {
        $status = 500;
        $message = 'No se pudo registrar la compra';

        $_POST['udn_id'] = $_POST['udn'];
        $_POST['operation_date'] = date('Y-m-d');
        $_POST['active'] = 1;

        $subtotal = floatval($_POST['subtotal']);
        $tax = floatval($_POST['tax']);
        $_POST['total'] = $subtotal + $tax;

        $create = $this->createCompra($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Compra registrada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editCompra() {
        $status = 500;
        $message = 'Error al editar la compra';

        $subtotal = floatval($_POST['subtotal']);
        $tax = floatval($_POST['tax']);
        $_POST['total'] = $subtotal + $tax;

        $edit = $this->updateCompra($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Compra actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function deleteCompra() {
        $status = 500;
        $message = 'No se pudo eliminar la compra';

        $delete = $this->deleteCompraById([$_POST['id']]);

        if ($delete) {
            $status = 200;
            $message = 'Compra eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getProductsByClass() {
        $products = $this->lsProductByClass([$_POST['class_id']]);

        return [
            'status' => 200,
            'products' => $products
        ];
    }

    function lsReporte() {
        $__row = [];
        
        $udn = $_POST['udn'];
        $purchaseType = $_POST['purchase_type'];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];

        $ls = $this->listReporteConcentrado([
            'udn' => $udn,
            'purchase_type' => $purchaseType,
            'fi' => $fi,
            'ff' => $ff
        ]);

        foreach ($ls as $key) {
            $__row[] = [
                'Fecha' => formatSpanishDate($key['fecha']),
                'Clase Producto' => $key['product_class_name'],
                'Subtotal' => [
                    'html' => evaluar($key['subtotal']),
                    'class' => 'text-end'
                ],
                'Impuesto' => [
                    'html' => evaluar($key['tax']),
                    'class' => 'text-end'
                ],
                'Total' => [
                    'html' => evaluar($key['total']),
                    'class' => 'text-end font-bold'
                ]
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function exportExcel() {
        $udn = $_GET['udn'];
        $purchaseType = $_GET['purchase_type'];
        $fi = $_GET['fi'];
        $ff = $_GET['ff'];

        $ls = $this->listReporteConcentrado([
            'udn' => $udn,
            'purchase_type' => $purchaseType,
            'fi' => $fi,
            'ff' => $ff
        ]);

        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="concentrado_compras_' . date('Y-m-d') . '.xls"');
        header('Cache-Control: max-age=0');

        echo '<table border="1">';
        echo '<tr>';
        echo '<th>Fecha</th>';
        echo '<th>Clase Producto</th>';
        echo '<th>Subtotal</th>';
        echo '<th>Impuesto</th>';
        echo '<th>Total</th>';
        echo '</tr>';

        foreach ($ls as $row) {
            echo '<tr>';
            echo '<td>' . $row['fecha'] . '</td>';
            echo '<td>' . $row['product_class_name'] . '</td>';
            echo '<td>' . $row['subtotal'] . '</td>';
            echo '<td>' . $row['tax'] . '</td>';
            echo '<td>' . $row['total'] . '</td>';
            echo '</tr>';
        }

        echo '</table>';
        exit;
    }
}

function dropdown($id) {
    $options = [
        ['icon' => 'icon-eye', 'text' => 'Ver detalle', 'onclick' => "app.detailCompra($id)"],
        ['icon' => 'icon-pencil', 'text' => 'Editar', 'onclick' => "app.editCompra($id)"],
        ['icon' => 'icon-trash', 'text' => 'Eliminar', 'onclick' => "app.deleteCompra($id)"]
    ];

    return $options;
}

function renderPurchaseType($typeId) {
    $types = [
        1 => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-green-100 text-green-800">Fondo Fijo</span>',
        2 => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-blue-100 text-blue-800">Corporativo</span>',
        3 => '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-orange-100 text-orange-800">Crédito</span>'
    ];

    return $types[$typeId] ?? '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-100 text-gray-800">Desconocido</span>';
}

$obj = new ctrl();
$fn = $_POST['opc'] ?? $_GET['opc'];
$encode = $obj->$fn();

if ($_GET['opc'] !== 'exportExcel') {
    echo json_encode($encode);
}
