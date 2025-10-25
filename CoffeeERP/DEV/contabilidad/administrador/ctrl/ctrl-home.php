<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-home.php';

class ctrl extends mdl {

    function init() {
        return [
            'user' => $_SESSION['user'] ?? 'Usuario'
        ];
    }

    function getDashboardData() {
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];
        $udn = $_POST['udn'] ?? 1;

        $ventas = $this->getVentasPeriodo([$fi, $ff, $udn]);
        $compras = $this->getComprasPeriodo([$fi, $ff, $udn]);
        $archivos = $this->getArchivosSubidos([$fi, $ff, $udn]);
        $retiros = $this->getRetirosPeriodo([$fi, $ff, $udn]);

        return [
            'status' => 200,
            'summary' => [
                'ventas' => $ventas['total'] ?? 0,
                'compras' => $compras['total'] ?? 0,
                'archivos' => $archivos['count'] ?? 0,
                'retiros' => $retiros['total'] ?? 0
            ]
        ];
    }
}

$obj = new ctrl();
$fn = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);
