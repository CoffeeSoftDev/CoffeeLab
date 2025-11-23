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
        $items   = ( $_POST['items'] ? json_decode($_POST['items'], true) : [] );
        unset($_POST['items']);
        $idPedido   = $_POST['orderId'];
        unset($_POST['orderId']);

        $insert = $this->createCustomOrder($this->util->sql($_POST));

        if ($insert) {
            $status  = 200;
            $message = 'Pedido personalizado agregado correctamente';
            $max = $this->maxCustomOrder();

             if ($max != null) {
                // Agregar ala orden 
                $this->createOrderPackage($this->util->sql([
                    'custom_id' => $max,
                    'pedidos_id'=> $idPedido,
                    'quantity' => 1,
                    'date_creation' => date('Y-m-d H:i:s'),
                    'status' => 1
                ]));
                // El ID del nuevo paquete en la orden
                $maxOrden = $this->maxOrderPackage();

                // Agregar productos al pedido personalizado
                $productos = [];
                foreach ($items as $item) {
                    $productos[] = [
                        'modifier_id'  => $item['modifier_id'],
                        'quantity'     => $item['quantity'],
                        'price'        => $item['price'],
                        'date_created' => date('Y-m-d H:i:s'),
                        'custom_id'    => $max
                    ];
                }
                $add = $this->createProductInOrderCustom($this->util->sql($productos));
            }
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => [
                'id' => $max, 
                'orderId' => $maxOrden
            ],
            'items' => $items
        ];
    }

    function editOrderPackage() {
        $status  = 500;
        $message = 'No se pudo actualizar el paquete en la orden';

        $update = $this->updateOrderPackage($this->util->sql($_POST, 1));

        if ($update) {
            $status  = 200;
            $message = 'Paquete en la orden actualizado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message
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

    // MODIFICADORES Y PRODUCTOS DE LOS MODIFICADORES -------------
    // Agregar producto de modificador
    function addModifierProduct() {
        $status  = 500;
        $message = 'Error al agregar el producto del modificador';

        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;
        $insert = $this->createOrderModifierProduct($this->util->sql($_POST));

        if ($insert) {
            $status  = 200;
            $message = 'Producto del modificador agregado correctamente';
            $max = $this->maxOrderModifierProduct();
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => ['id' => $max]
        ];
    }

    // Agregar imagenes del pedido personalizado
    function addOrderImages() {
     
        $status  = 500;
        $message = 'Error al agregar las imágenes del pedido personalizado';

        $company = $_SESSION['COMPANY'] ?? 'coffee';
        $sub     = $_SESSION['SUB'] ?? '1';

        // images.
        $ruta    = 'alpha_files/' .$company. '/' . $sub . '/order/images/custom/';
        $oldFile = $_SERVER['DOCUMENT_ROOT'] . '/' . $ruta;

        if (!file_exists($oldFile)) {
            mkdir($oldFile, 0777, true);
        }

        if (!empty($_FILES['archivos']['name'][0])) {

            
            foreach ($_FILES['archivos']['name'] as $i => $nombreOriginal) {
                if ($_FILES['archivos']['error'][$i] === UPLOAD_ERR_OK) {


                    $temporal    = $_FILES['archivos']['tmp_name'][$i];
                    $ext         = pathinfo($nombreOriginal, PATHINFO_EXTENSION);
                    $nuevoNombre = substr(md5(uniqid('', true)), 0, 8) . '.' . strtolower($ext);
                    $destino     = $oldFile . $nuevoNombre;
                    
                    
                    if (move_uploaded_file($temporal, $destino)) {
                        $values = [
                            'path'          => $ruta.$nuevoNombre,
                            'name'          => $nuevoNombre,
                            'original_name' => $nombreOriginal,
                            'date_created'  => date('Y-m-d H:i:s'),
                            'package_id'    => $_POST['id']
                        ];

                        $insert =  $this->createOrderImages($this->util->sql($values));
                        
                        if ($insert) {
                            $status  = 200;
                            $message = 'Imágenes del pedido personalizado agregadas correctamente';
                        }
                
                }

                




                }
            
            }
        
        
        
        }




        // foreach ($images as $img) {
        //     $insert = $this->createOrderImages($this->util->sql([
        //         'order_custom_id' => $_POST['order_custom_id'],
        //         'image_path'      => $img,
        //         'date_created'    => date('Y-m-d H:i:s')
        //     ]));
        // }
     
        return [
            'status'  => $status,
            'message' => $message,
            'end-point' => $values
        ];
    }
}


$obj    = new OrderCustomController();
$fn     = $_POST['opc'];

$encode = [];
$encode = $obj->$fn();
echo json_encode($encode);


?>