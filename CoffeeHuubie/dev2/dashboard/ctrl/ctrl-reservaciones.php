<?php
session_start();
if (empty($_POST['opc'])) exit(0);


header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

require_once '../mdl/mdl-reservaciones.php';

class ctrl extends mdl{

    function init(){
        $_SESSION['SUB'] = 4;
        $Sucursal = $this -> getSucursalByID([4]);
        return [
            'statusw' => $Sucursal,
            'SESSION' => $_SESSION,
        ];
    }

    
    // api eventos.

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

        // 📅 Calcular fecha inicial y final.
        $fi        = sprintf("%04d-%02d-01", $anio, $mes);
        $ultimoDia = date("t", mktime(0, 0, 0, $mes, 1, $anio));
        $ff        = sprintf("%04d-%02d-%02d", $anio, $mes, $ultimoDia);

        $sub      = $_SESSION['SUB'];
        $Sucursal = $this -> getSucursalByID([$sub]);

        $ls       = $this -> getEvents([
            'subsidiaries_id' => $Sucursal['idSucursal'],
            'fi'              => $fi,
            'ff'              => $ff,
            'status'          => $idEstatus
        ]);

        foreach ($ls as $key) {
            $advanceExtra  = $this->getAdvancedPay([$key['id']])['totalPay'] ?? 0;
            $discount      = $key['discount'] ?? 0;
            $total         = $key['total_pay'];
            $saldo         = $total - $discount - $advanceExtra;

            $__row[] = [
                'id'              => $key['id'],
                'folio'           => formatSucursal($Sucursal['name'], $Sucursal['sucursal'], $key['id']),
                'date_creation'   => formatSpanishDate($key['date_creation'], 'normal'),
                'client_name'     => $key['name_client'],
                'event_name'      => $key['name_event'],
                'advancePay'      => $advanceExtra,
                'discount'        => $discount,
                'total'           => $total,
                'saldo'           => $saldo,
                'date_event'      => formatSpanishDate($key['date_start'], 'normal'),
                'location'        => $key['location'],
                'hours_start'     => $key['hours_start'],
                'status'          => $key['idStatus'],
                'opc'             => 0
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
        ['Ver', 'icon-eye', "{$instancia}.viewReservation({$id})"],
        ['Editar', 'icon-pencil', "{$instancia}.editReservation({$id})"],
        ['Historial', 'icon-history', "{$instancia}.history({$id})"],
        ['Cancelar', 'icon-block-1', "{$instancia}.cancelReservation({$id})"],
    ];

    if ($status == 2) { // Cancelado
        $options = [
            ['Ver', 'icon-eye', "{$instancia}.viewReservation({$id})"],
            ['Historial', 'icon-history', "{$instancia}.history({$id})"],

        ];
    } elseif ($status == 3) { // Pagado
        $options = [
            ['Ver', 'icon-eye', "{$instancia}.viewReservation({$id})"],
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
        1 => ['bg' => '#EBD9FF', 'text' => '#6B3FA0', 'label' => 'Reservación'], // Lila
        2 => ['bg' => '#B9FCD3', 'text' => '#032B1A', 'label' => 'Si llego'],         // Verde
        3 => ['bg' => '#E5E7EB', 'text' => '#374151', 'label' => 'No llego'],      // Gris
        4 => ['bg' => '#572A34', 'text' => '#E05562', 'label' => 'Cancelado'],      // Gris
    ];

    if (isset($estados[$idEstado])) {
        $estado = $estados[$idEstado];
        return "<span class='w-32 inline-block text-center bg-[{$estado['bg']}] text-[{$estado['text']}] text-xs font-semibold px-3 py-1 rounded'>{$estado['label']}</span>";
    }

    return '';
}

function formatSucursal($compania, $sucursal, $numero = null){

    $letraCompania = strtoupper(substr(trim($compania), 0, 1));
    $letraSucursal = strtoupper(substr(trim($sucursal), 0, 1));

    $number = $numero ?? rand(1, 99);

    $formattedNumber = str_pad($number, 2, '0', STR_PAD_LEFT);

    return 'R-'.$letraCompania . $letraSucursal .'-'. $formattedNumber;
}

function formatDateTime($date, $time) {
    if (!empty($date) && !empty($time)) {
        $datetime = DateTime::createFromFormat('Y-m-d H:i', "$date $time");
        return $datetime ? $datetime->format('Y-m-d H:i:s') : null;
    }
    return null;
}



$obj    = new ctrl();
$fn     = $_POST['opc'];

$encode = [];
$encode = $obj->$fn();
echo json_encode($encode);


?>
