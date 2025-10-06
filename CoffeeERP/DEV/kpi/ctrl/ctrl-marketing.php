<?php
session_start();
if (empty($_POST['opc'])) exit(0);
require_once '../mdl/mdl-marketing.php';
require_once('../../conf/coffeSoft.php');

class ctrl extends mdl {

  function init() {

    $fechaAyer = date('Y-m-d', strtotime('-1 day'));
    $udn = isset($_POST['udn']) ? $_POST['udn'] : null;
    $month = isset($_POST['month']) ? $_POST['month'] : date('n');
    $year = isset($_POST['year']) ? $_POST['year'] : date('Y');

    $ventasDia    = $this->getVentasDelDia([$udn]);
    $ventasMes    = $this->getVentasMonetariasMes([$month, $year, $udn]);
    $clientesMes  = $this->getClientesMes([$month, $year, $udn]);
    $resumenMes   = $this->getResumenMes([$month, $year, $udn]);

    

    return [
        'data' => [
            'ventas_dia'   => $ventasDia,
            'ventas_mes'   => '$ '.$ventasMes,
            'clientes_mes' => $clientesMes,
            'resumen_mes'  => evaluar($resumenMes),
        ], 
        'status'  => 200,
        'message' => 'Datos del dashboard cargados correctamente.',
        'barras'  => $this->comparativaChequePromedio()
    ];
  }

  function comparativaChequePromedio() {

    $mesActual = isset($_POST['month']) ? $_POST['month'] : date('n');
    $anioA     = isset($_POST['year']) ? $_POST['year'] : date('Y');
    $anioB     = $anioA - 1;

    $dataA = $this->getComparativaChequePromedio([$mesActual, $anioA]);
    $dataB = $this->getComparativaChequePromedio([$mesActual, $anioB]);

    $dataset = [
        'labels' => ['A&B', 'Alimentos', 'Bebidas'],
        'A' => [
            (float) $dataA['AyB'],
            (float) $dataA['Alimentos'],
            (float) $dataA['Bebidas']
        ],
        'B' => [
            (float) $dataB['AyB'],
            (float) $dataB['Alimentos'],
            (float) $dataB['Bebidas']
        ]
    ];


    return [
        'status'  => 200,
        'message' => 'Comparativa generada',
        'data'    => $dataset
    ];
  }

}

// 🟢 INSTANCIA DEL CONTROLADOR
echo json_encode((new ctrl)->{$_POST['opc']}());

