<?php
session_start();
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../ctrl/ctrl-pedidos.php';
require_once '../mdl/mdl-calendario.php';

class CalendarioPedidos extends Pedidos {
    
    /**
     * Obtiene los pedidos en formato compatible con FullCalendar
     * @return array Eventos formateados para FullCalendar
     */
    function getCalendarioData() {
        $status  = 500;
        $message = 'Error al obtener los datos del calendario';
        $data    = [];

        try {
            // Validar parámetros
            if (empty($_POST['fi']) || empty($_POST['ff'])) {
                return [
                    'status'  => 400,
                    'message' => 'Parámetros de fecha inválidos',
                    'data'    => []
                ];
            }

            // Obtener pedidos usando el método heredado
            $result = $this->listOrders();
            
            if (isset($result['orders']) && is_array($result['orders'])) {
                $orders = $result['orders'];
                
                // Transformar datos al formato FullCalendar
                foreach ($orders as $order) {
                    $backgroundColor = $this->getColorByStatus($order['idStatus']);
                    $title = $this->formatEventTitle($order);
                    
                    $data[] = [
                        'id'              => $order['id'],
                        'title'           => $title,
                        'start'           => $order['date_order'] . 'T' . $order['time_order'],
                        'backgroundColor' => $backgroundColor,
                        'borderColor'     => $backgroundColor,
                        'extendedProps'   => [
                            'folio'       => $order['folio'],
                            'cliente'     => $order['name_client'],
                            'telefono'    => $order['phone'],
                            'estado'      => $order['status_label'],
                            'estadoId'    => $order['idStatus'],
                            'total'       => $order['total_pay'],
                            'discount'    => $order['discount'] ?? 0,
                            'domicilio'   => $order['delivery_type'] == 1,
                            'nota'        => $order['note'] ?? ''
                        ]
                    ];
                }
                
                $status  = 200;
                $message = 'Datos obtenidos correctamente';
            }
            
        } catch (Exception $e) {
            $message = 'Error interno del servidor: ' . $e->getMessage();
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }
    
    /**
     * Obtiene el color según el estado del pedido
     * @param int $statusId ID del estado
     * @return string Color hexadecimal
     */
    private function getColorByStatus($statusId) {
        switch($statusId) {
            case 1: return '#1E90FF'; // Cotización - Azul
            case 2: return '#FFCC00'; // Pendiente - Amarillo
            case 3: return '#8CC63F'; // Pagado - Verde
            case 4: return '#FF3B30'; // Cancelado - Rojo
            default: return '#6B7280'; // Gris por defecto
        }
    }
    
    /**
     * Formatea el título del evento con ícono de motocicleta si es envío a domicilio
     * @param array $order Datos del pedido
     * @return string Título formateado
     */
    private function formatEventTitle($order) {
        $title = $order['folio'] . ' - ' . $order['name_client'];
        
        // Agregar ícono de motocicleta si es envío a domicilio
        if ($order['delivery_type'] == 1) {
            $title = '🏍️ ' . $title;
        }
        
        return $title;
    }
    
    /**
     * Obtiene el detalle de un pedido específico
     * @return array Información completa del pedido
     */
    function getOrderDetail() {
        if (empty($_POST['id'])) {
            return [
                'status'  => 400,
                'message' => 'ID de pedido no proporcionado',
                'data'    => null
            ];
        }
        
        // Reutilizar método del padre
        return $this->getOrderDetails();
    }
}

$obj    = new CalendarioPedidos();
$fn     = $_POST['opc'];
$encode = [];

if (method_exists($obj, $fn)) {
    $encode = $obj->$fn();
} else {
    $encode = [
        'status'  => 404,
        'message' => 'Método no encontrado',
        'data'    => null
    ];
}

echo json_encode($encode);
?>
