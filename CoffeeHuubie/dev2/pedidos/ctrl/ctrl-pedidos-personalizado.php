<?php
session_start();
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

require_once '../mdl/mdl-pedidos-personalizado.php';

class OrderCustomController extends OrderCustom {
    // PEDIDOS PERSONALIZADOS ----------------------------------
    // Obtener pedido personalizado
    function getCustomOrder() {
        $status  = 404;
        $message = 'Error al obtener el pedido personalizado';
        $data    = null;

        $get = $this->getByIdCustomOrder([$_POST['id']]);
        
        if ($get) {
            $status  = 200;
            $message = 'Datos obtenidos correctamente';
            $data    = [
                $get,
                // 'productos' => $this->_Select([
                //     'table' => "{$this->bd}order_custom_products ocp
                //                 JOIN {$this->bd}products p ON ocp.product_id = p.id",
                //     'values' => "ocp.*, p.name, p.description, p.price, p.image",
                //     'where' => "ocp.order_custom_id = ?",
                //     'data' => [$_POST['id']]
                // ])
            ];
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }

    // Agregar pedido personalizado
    function addCustomOrder() {
        $status  = 500;
        $message = 'No se pudo agregar el pedido personalizado';
        // $items   = $_POST['items'];
        // unset($_POST['items']);
        $orderId   = $_POST['orderId'];
        unset($_POST['orderId']);

        $insert = $this->createCustomOrder($this->util->sql($_POST));
        $max = '';
        if ($insert) {
            $status  = 200;
            $message = 'Pedido personalizado agregado correctamente';
            $max = $this->maxCustomOrder();

            // Agregar ala orden 
            $this->addOrderPackage([
                'custom_id' => $max,
                'pedidos_id'=> $orderId,
                'quantity' => 1,
                'date_creation' => date('Y-m-d H:i:s'),
                'status' => 1
            ]);
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => [
                'id' => $max, 
            ]
        ];
    }

    // Editar pedido personalizado
    function editCustomOrder() {
        $status  = 500;
        $message = 'No se pudo actualizar el pedido personalizado';

        $update = $this->updateCustomOrder($this->util->sql($_POST, 1));

        if ($update) {
            $status  = 200;
            $message = 'Pedido personalizado actualizado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    // Cancelar pedido personalizado
    function cancelCustomOrder() {
        $status  = 500;
        $message = 'Error al cancelar el pedido personalizado.';

        $update = $this->updateCustomOrder($this->util->sql($_POST, 1));

        if ($update) {
            $status  = 200;
            $message = 'Pedido personalizado cancelado correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    // PRODUCTOS EN EL PEDIDO PERSONALIZADO ----------------------
    // Agregar producto al pedido personalizado
    function addProductToCustomOrder() {
        $status  = 500;
        $message = 'Error al agregar el producto al pedido';

        $insert = $this->createProductInOrder($this->util->sql($_POST));

        if ($insert) {
            $status  = 200;
            $message = 'Producto agregado correctamente al pedido';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $insert
        ];
    }


    // ORDEN DE PEDIDO ----------------------
    // Agregar pedido personalizado a la orden o paquete (qye ya existe)
    function addOrderPackage($data) {
        $status  = 500;
        $message = 'Error al agregar el pedido personalizado a la orden';

        $insert = $this->createOrderPackage($this->util->sql($data));

        if ($insert) {
            $status  = 200;
            $message = 'Pedido personalizado agregado correctamente a la orden';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

}


$obj    = new OrderCustomController();
$fn     = $_POST['opc'];

$encode = [];
$encode = $obj->$fn();
echo json_encode($encode);


?>