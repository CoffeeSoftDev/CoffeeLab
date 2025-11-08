<?php

if (empty($_POST['opc'])) exit(0);
session_start();
header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

// incluir tu modelo
require_once '../mdl/mdl-calendario.php';


$encode = [];

class ctrlCalendario extends MCalendarioPedidos{

    function getCalendar()  {
        $event = [];
        $getCalendar = $this->getOrders();

        foreach ($getCalendar as $key) {
            $color = '';
            if ($key['idStatus'] == 1) $color = "#6E95C0"; // cotizacion
            elseif ($key['idStatus'] == 2) $color = "#FE6F00"; // pediente
            elseif ($key['idStatus'] == 3) $color = "#0E9E6E"; // pagado
            elseif ($key['idStatus'] == 4) $color = "#E60001"; // cancelado

            $delivered = 'No Entregado';
            if ($key['is_delivered'] == 1) {
                $delivered = 'Entregado';
            }
            $type = 'Envío a Domicilio';
            if ($key['delivery_type'] == 1) {
                $type = 'Recogida en Tienda';
            }
            // Agregar un dia a la fecha de fin
            // $key['end'] = date('Y-m-d', strtotime($key['end'] . ' +1 day'));
            $event[] = [
                'id'       => $key['id'],
                'title'    => $key['name_client'],
                'start' => date('Y-m-d', strtotime($key['date_order'])),
                'hour'    =>$key['time_order'],
                'status'   => $key['status_label'],
                'location' => $key['location'],
                'client'   => $key['name_client'],
                'delivery' => $delivered,
                'type'     => $type,
                'color'    => $color
            ];
        }
        return $event;
    }
}

$obj    = new ctrlCalendario();
$fn     = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);
