<?php
session_start();
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../mdl/mdl-pedidos.php';

class ctrl extends mdl{

    function init(){
        $sub = $_SESSION['SUB'] ?? $_SESSION['subsidiaries_id'] ?? 4;
        $Sucursal = $this->getSucursalByID([$sub]);
        return [
            'status' => $Sucursal,
            'SESSION' => $_SESSION,
        ];
    }

    function apiVentas() {

        $__row     = [];
        $idEstatus = $_POST['status'] ?? 1;
        $mes       = filter_var($_POST['mes'], FILTER_VALIDATE_INT);
        $anio      = filter_var($_POST['anio'], FILTER_VALIDATE_INT);

        if ($mes < 1 || $mes > 12) {
            $mes = date('m');
        }

        if ($anio < 2020 || $anio > 2030) {
            $anio = date('Y');
        }

        $fi        = sprintf("%04d-%02d-01", $anio, $mes);
        $ultimoDia = date("t", mktime(0, 0, 0, $mes, 1, $anio));
        $ff        = sprintf("%04d-%02d-%02d", $anio, $mes, $ultimoDia);

        $sub      = $_SESSION['SUB'] ?? $_SESSION['subsidiaries_id'] ?? 1;
        $Sucursal = $this->getSucursalByID([$sub]);

        $ls       = $this->getOrders([
            'subsidiaries_id' => $Sucursal['idSucursal'],
            'fi'              => $fi,
            'ff'              => $ff,
            'status'          => $idEstatus
        ]);

        foreach ($ls as $key) {
            $pagos    = $this->getOrderPayments([$key['id']])['totalPay'] ?? 0;
            $discount = $key['discount'] ?? 0;
            $total    = $key['total_pay'];
            $saldo    = $total - $discount - $pagos;

            $__row[] = [
                'id'            => $key['id'],
                'folio'         => formatFolio($Sucursal['name'], $Sucursal['sucursal'], $key['id']),
                'date_creation' => formatSpanishDate($key['date_creation'], 'normal'),
                'date_order'    => formatSpanishDate($key['date_order'], 'normal'),
                'time_order'    => $key['time_order'],
                'location'      => $key['location'],
                'pagos'         => $pagos,
                'discount'      => $discount,
                'total'         => $total,
                'saldo'         => $saldo,
                'status'        => $key['status_id'],
                'status_name'   => $key['status_name'],
                'opc'           => 0
            ];
        }

        return [
            'ls'              => $ls,
            'row'             => $__row,
            'cards'           => $this->apiResumenVentas($fi, $ff, $Sucursal['idSucursal']),
            'subsidiaries_id' => $Sucursal['idSucursal'],
            'fi'              => $fi,
            'ff'              => $ff,
            'status'          => $idEstatus
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

// Complements.
function dropdown($id, $status) {

    $instancia = 'app';

    $options = [
        ['Ver', 'icon-eye', "{$instancia}.viewOrder({$id})"],
        ['Editar', 'icon-pencil', "{$instancia}.editOrder({$id})"],
        ['Historial', 'icon-history', "{$instancia}.history({$id})"],
        ['Cancelar', 'icon-block-1', "{$instancia}.cancelOrder({$id})"],
    ];

    if ($status == 4) {
        $options = [
            ['Ver', 'icon-eye', "{$instancia}.viewOrder({$id})"],
            ['Historial', 'icon-history', "{$instancia}.history({$id})"],
        ];
    } elseif ($status == 3) {
        $options = [
            ['Ver', 'icon-eye', "{$instancia}.viewOrder({$id})"],
            ['Historial', 'icon-history', "{$instancia}.history({$id})"],
        ];
    }

    return array_map(fn($opt) => [
        'text'    => $opt[0],
        'icon'    => $opt[1],
        'onclick' => $opt[2],
    ], $options);
}

function status($idEstado) {
    $estados = [
        1 => ['bg' => '#EBD9FF', 'text' => '#6B3FA0', 'label' => 'Cotización'],
        2 => ['bg' => '#B9FCD3', 'text' => '#032B1A', 'label' => 'Pendiente'],
        3 => ['bg' => '#E5E7EB', 'text' => '#374151', 'label' => 'Pagado'],
        4 => ['bg' => '#572A34', 'text' => '#E05562', 'label' => 'Cancelado'],
    ];

    if (isset($estados[$idEstado])) {
        $estado = $estados[$idEstado];
        return "<span class='w-32 inline-block text-center bg-[{$estado['bg']}] text-[{$estado['text']}] text-xs font-semibold px-3 py-1 rounded'>{$estado['label']}</span>";
    }

    return '';
}

function formatFolio($compania, $sucursal, $numero = null){
    $letraCompania = strtoupper(substr(trim($compania), 0, 1));
    $letraSucursal = strtoupper(substr(trim($sucursal), 0, 1));
    $number = $numero ?? rand(1, 99);
    $formattedNumber = str_pad($number, 2, '0', STR_PAD_LEFT);
    return 'P-'.$letraCompania . $letraSucursal .'-'. $formattedNumber;
}

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);

?>
