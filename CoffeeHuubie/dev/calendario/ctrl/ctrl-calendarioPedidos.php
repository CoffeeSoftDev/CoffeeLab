<?php
session_start();
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-calendarioPedidos.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'status' => $this->lsStatus()
        ];
    }

    function getOrders() {
        $status = 500;
        $message = 'Error al obtener los pedidos';
        $events = [];

        try {
            $fi = $_POST['fi'] ?? null;
            $ff = $_POST['ff'] ?? null;
            $udn = $_POST['udn'] ?? null;

            if (empty($fi) || empty($ff)) {
                return [
                    'status' => 400,
                    'message' => 'Debe proporcionar un rango de fechas válido',
                    'events' => []
                ];
            }

            if (!strtotime($fi) || !strtotime($ff)) {
                return [
                    'status' => 400,
                    'message' => 'Formato de fecha inválido',
                    'events' => []
                ];
            }

            if (strtotime($fi) > strtotime($ff)) {
                return [
                    'status' => 400,
                    'message' => 'La fecha inicial debe ser menor o igual a la fecha final',
                    'events' => []
                ];
            }

            $orders = $this->listOrdersByDate([$fi, $ff, $udn, $udn]);

            if ($orders && is_array($orders)) {
                $status = 200;
                $message = 'Pedidos obtenidos correctamente';

                foreach ($orders as $order) {
                    $color = $this->getEventColor($order['status']);
                    
                    $startDateTime = $order['date_order'];
                    if (!empty($order['time_order'])) {
                        $startDateTime .= 'T' . $order['time_order'];
                    }

                    $events[] = [
                        'id' => $order['id'],
                        'title' => "#{$order['folio']} - {$order['cliente']}",
                        'start' => $startDateTime,
                        'backgroundColor' => $color,
                        'borderColor' => $color,
                        'extendedProps' => [
                            'folio' => $order['folio'],
                            'cliente' => $order['cliente'] ?? 'Sin nombre',
                            'telefono' => $order['telefono'] ?? '',
                            'location' => $order['location'] ?? '',
                            'estado' => $this->getStatusName($order['status']),
                            'total' => $order['total'] ?? 0
                        ]
                    ];
                }
            } else {
                $status = 200;
                $message = 'No hay pedidos en el rango seleccionado';
            }

        } catch (Exception $e) {
            $status = 500;
            $message = 'Error en el servidor: ' . $e->getMessage();
        }

        return [
            'status' => $status,
            'message' => $message,
            'events' => $events
        ];
    }

    private function getEventColor($statusId) {
        $colors = [
            1 => '#3B82F6',  // Cotización - Azul
            2 => '#10B981',  // Pagado - Verde
            3 => '#FBBF24',  // Pendiente - Amarillo
            4 => '#EF4444',  // Cancelado - Rojo
            5 => '#8B5CF6'   // En proceso - Morado
        ];

        return $colors[$statusId] ?? '#6B7280';
    }

    private function getStatusName($statusId) {
        $statuses = [
            1 => 'Cotización',
            2 => 'Pagado',
            3 => 'Pendiente',
            4 => 'Cancelado',
            5 => 'En proceso'
        ];

        return $statuses[$statusId] ?? 'Desconocido';
    }
}

$obj = new ctrl();
$fn = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);
?>
