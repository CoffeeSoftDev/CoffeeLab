<?php

if (empty($_POST['opc'])) exit(0);


session_start();

header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

require_once 'mdl/mdl-pedidos.php';



class ctrl extends mdl{

    function init(){
        // Usar ID de sucursal por defecto si no existe en sesión
        $subsidiaries_id = $_POST['subsidiaries_id'] ?? 4;
        
        return [
            'status' => 200,
            'subsidiaries_id' => $subsidiaries_id,
        ];
    }

    function apiVentas() {

        $__row     = [];
        $idEstatus = $_POST['status'] ?? 0;
        $mes       = filter_var($_POST['mes'], FILTER_VALIDATE_INT);
        $anio      = filter_var($_POST['anio'], FILTER_VALIDATE_INT);
        
        // ID de sucursal desde POST o por defecto
        $subsidiaries_id = $_POST['subsidiaries_id'] ?? 1;

        if ($mes < 1 || $mes > 12) {
            $mes = date('m');
        }

        if ($anio < 2020 || $anio > 2030) {
            $anio = date('Y');
        }

        $fi        = sprintf("%04d-%02d-01", $anio, $mes);
        $ultimoDia = date("t", mktime(0, 0, 0, $mes, 1, $anio));
        $ff        = sprintf("%04d-%02d-%02d", $anio, $mes, $ultimoDia);

        return [
            'cards'           => $this->apiResumenVentas($fi, $ff, $subsidiaries_id),
            'subsidiaries_id' => $subsidiaries_id,
            'fi'              => $fi,
            'ff'              => $ff,
            'status'          => $idEstatus,
            'mes'             => $mes,
            'anio'            => $anio
        ];
    }

    function apiResumenVentas($fi, $ff, $subsidiaries_id) {

        $totalPedidos = $this->getTotalPedidosMes([
            $subsidiaries_id, 
            $fi, 
            $ff
        ]);
        
        $dineroEntrante = $this->getDineroEntranteMes([
            $subsidiaries_id, 
            $fi, 
            $ff
        ]);
        
        $ventasCerradas = $this->getVentasCerradasMes([
            $subsidiaries_id, 
            $fi, 
            $ff
        ]);
        
        $cancelaciones = $this->getCancelacionesMes([
            $subsidiaries_id, 
            $fi, 
            $ff
        ]);
        
        $desglose = $this->getDesgloseEstadosMes([
            $subsidiaries_id, 
            $fi, 
            $ff
        ]);
        
        $desgloseProcesado = [
            'cotizaciones' => 0,
            'pagados' => 0,
            'cancelados' => 0
        ];
        
        foreach ($desglose as $estado) {
            if ($estado['status_process_id'] == 1) {
                $desgloseProcesado['cotizaciones'] = $estado['cantidad'];
            } elseif ($estado['status_process_id'] == 3) {
                $desgloseProcesado['pagados'] = $estado['cantidad'];
            } elseif ($estado['status_process_id'] == 4) {
                $desgloseProcesado['cancelados'] = $estado['cantidad'];
            }
        }
        
        return [
            'total_pedidos' => $totalPedidos['total_pedidos'],
            'dinero_entrante' => $dineroEntrante['dinero_entrante'],
            'ventas_cerradas' => [
                'cantidad' => $ventasCerradas['cantidad_cerradas'],
                'monto' => $ventasCerradas['monto_total_ventas']
            ],
            'cancelaciones' => [
                'cantidad' => $cancelaciones['cantidad_canceladas'],
                'monto' => $cancelaciones['monto_perdido']
            ],
            'desglose' => $desgloseProcesado
        ];
    }

}

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);

?>
