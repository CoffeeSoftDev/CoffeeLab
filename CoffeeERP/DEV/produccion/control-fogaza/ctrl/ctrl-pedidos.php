<?php
if (empty($_POST['opc']))
    exit(0);

setlocale(LC_TIME, 'es_ES.UTF-8'); // Configura el idioma a español
header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

require_once ('../mdl/mdl-pedidos.php');
require_once '../../../conf/coffeSoft.php';
require_once('../../../conf/_Utileria.php');

require_once ('../src/libreria/dompdf/autoload.inc.php');
use Dompdf\Dompdf;

require_once('../../../conf/_Message.php');


// sustituir 'mdl' extends de acuerdo al nombre que tiene el modelo
class ctrl extends Pedidos{

    public $util;

    public function __construct() {
        parent::__construct(); // Llama al constructor de la clase padre
        $this->util = new Utileria();
    }

    function init(){
        return [
            'grupo'         => $this -> getClasificacion(),
            'tickets'       => $this -> getTickets(),
            'colaboradores' => $this ->getListColaboradores()
        ];
    }

    function getProductsBy() {

        $row = [];
        $ls  = $this->getProducts([$_POST['id']]);

        foreach ($ls as $key) {

            $costsys = $this->getPriceByCostsys([$key['id']]);

            // Validar si existe precio en costsys
            $hasCostsysPrice = isset($costsys[0]['precioVenta']) && $costsys[0]['precioVenta'] !== null;

            // Usar el precio de costsys o el del producto
            $precio = $hasCostsysPrice ? $costsys[0]['precioVenta'] : $key['price'];

            // Ruta de imagen
            $src = (isset($costsys[0]['foto']) && $costsys[0]['foto']) ? 'https://erp-varoch.com/' . $costsys[0]['foto'] : '';

            // Validar antigüedad de creación
            $fechaProducto = isset($key['fechaIngreso']) ? $key['fechaIngreso'] : null;
            $isRecent = false;

            if ($fechaProducto) {
                $fechaLimite = date('Y-m-d', strtotime('-7 days'));
                $isRecent = ($fechaProducto >= $fechaLimite);
            }

            $row[] = [
                'id'       => $key['id'],
                'valor'    => $key['valor'],
                'costo'    => $precio,
                'src'      => $src,
                'isRecent' => $isRecent
            ];
        }

        return $row;
    }


    function getProductsByFol(){

        # Variables
        $__row   = [];
        $idFolio = $_POST['NoFolio'];

        # Lista de productos
        $ls    = $this->listProducts([$idFolio]);
        $total = 0;

        foreach ($ls as $key) {

            $getInfo      = $this->getInfoPersonalizado([$key['id']]);
            $costsys      = $this->getPriceByCostsys([$key['idAlmacen']]);
            $orderImage   = $this->getOrderImages([$key['id']]);

            $photoCostsys = (isset($costsys[0]['foto']) && $costsys[0]['foto']) ? $costsys[0]['foto'] : '';
            $image        = (isset($orderImage[0]['path']) && $orderImage[0]['path']) ? $orderImage[0]['path'] : $photoCostsys;

            $importeBase  = isset($getInfo[0]['importeBase']) ? floatval($getInfo[0]['importeBase']) : 0;
            $importeOblea = isset($getInfo[0]['importeOblea']) ? floatval($getInfo[0]['importeOblea']) : 0;

            $__row[] = array(
                'id'            => $key['id'],
                'valor'         => $key['NombreProducto'],
                'Cant.'         => $key['cantidad'],
                'costo'         => $key['costo'],
                'personalizado' => $key['personalizado'],
                'data'          => $getInfo,
                'leyenda'       => $key['leyenda'],
                'src'           => $image,
                'costsys'       => $costsys,
                'countImages'   => count($orderImage),
                'opc'           => 0
            );

            $total += floatval($key['costo']) + $importeBase + $importeOblea;
        }


        $lsFolio = $this->getFolio([$idFolio]);
        
        // Verificar que $lsFolio no sea null o vacío
        if (empty($lsFolio)) {
            return [
                'error' => true,
                'message' => 'No se encontró información del folio',
                'thead' => '',
                'row' => [],
                'frm_foot' => '',
                'head' => []
            ];
        }

        $head = [
            'data' => [
                'folio'       => isset($lsFolio['folio']) ? $lsFolio['folio'] : '',
                'pedido'      => isset($lsFolio['fechapedido']) ? formatSpanishDate($lsFolio['fechapedido']) : '',
                'cliente'     => isset($lsFolio['Name_Cliente']) ? $lsFolio['Name_Cliente'] : '',
                'telefono'    => isset($lsFolio['Telefono']) ? $lsFolio['Telefono'] : '',
                'cumple'      => isset($lsFolio['fechaCumple']) ? formatSpanishDate($lsFolio['fechaCumple']) : '',
                'anticipo'    => isset($lsFolio['anticipo']) ? evaluar($lsFolio['anticipo']) : '0.00',
                'observacion' => isset($lsFolio['observacion']) ? $lsFolio['observacion'] : '',
                'estatus'     => isset($lsFolio['estatus']) ? $lsFolio['estatus'] : 0,
                'horapedido'  => isset($lsFolio['horapedido']) ? $lsFolio['horapedido'] : '',
            ],
            'type' => 'details'
        ];

        $observacion = isset($lsFolio['observacion']) ? $lsFolio['observacion'] : '';
        $foot = $this::ticket_foot([ 'id'  => $idFolio, 'total' => $total ,'obs' => $observacion ]);

        // Encapsular arreglos
        return [ "thead" => '', "row" => $__row,'frm_foot' => $foot ,'head' => $head];


    }

    function ticket_foot($data){

        $foot = '
            <div class="row">
            <div class="col-12 text-end">
            <label class="font-bold text-gray-700">TOTAL:
            <span id="total" class="font-semibold text-gray-500"> '.evaluar($data['total']).'</span> </label>
            </div>

            <div class="mt-4 border-t pt-4">
            <p class="text-gray-600 text-sm font-semibold">NOTA:</p>
            <p class="bg-gray-100 text-gray-700 p-3 my-2 rounded-md">'.$data['obs'].'</p>
            </div>
            </div>';
        return $foot;
    }

    function addItem() {

        if ($_POST['tipo'] == 1) {
            // Pedido normal
            $data = $this->util->sql([
                'id_folio'                 => $_POST['idFolio'],
                'id_productos'             => $_POST['id_producto'],
                'cantidad'                 => 1,
                'costo'                    => $_POST['costo'],
                'name'                     => $_POST['name'],
                'pedido_productos.portion' => $_POST['portion'],
                'leyenda'                  => $_POST['leyenda']
            ]);

            $ok = $this->add_producto_vendido($data);
        }
        else {

            // Pedido personalizado
            $ok = $this->addPedido([
                'id_folio'                 => $_POST['idFolio'],
                'id_productos'             => $_POST['id_producto'],
                'cantidad'                 => 1,
                'costo'                    => $_POST['costo'],
                'name'                     => $_POST['name'],
                'pedido_productos.portion' => $_POST['portion'],

                'personalizado' => 1,
                'leyenda'       => $_POST['leyenda'],
            ]);

            $pedido  = $this->getIdPedidoByFol([$_POST['idFolio'], $_POST['id_producto']]);
            
            // Verificar que el pedido exista
            if (empty($pedido) || !isset($pedido[0]['idListaProductos'])) {
                return [
                    'error' => true,
                    'message' => 'No se pudo obtener información del pedido',
                    'get' => null,
                    'files' => [],
                    'data_pedido' => null,
                    'success' => false,
                    'tipo' => $_POST['tipo']
                ];
            }
            
            $ruta    = "erp_files/pedidos/pasteleria/";
            $carpeta = '../../../../' . $ruta;

            if (!file_exists($carpeta)) {
                mkdir($carpeta, 0777, true);
            }

            // Subir archivos si existen
            if (!empty($_FILES['archivos']['name'][0])) {
                $files_up = [];

                foreach ($_FILES['archivos']['name'] as $i => $nombreOriginal) {
                    if ($_FILES['archivos']['error'][$i] === UPLOAD_ERR_OK) {
                        $temporal    = $_FILES['archivos']['tmp_name'][$i];
                        $ext         = pathinfo($nombreOriginal, PATHINFO_EXTENSION);
                        $nuevoNombre = substr(md5(uniqid('', true)), 0, 8) . '.' . strtolower($ext);
                        $destino     = $carpeta . $nuevoNombre;

                        if (move_uploaded_file($temporal, $destino)) {
                            $values = [
                                'path'          => $destino,
                                'name'          => $nuevoNombre,
                                'original_name' => $nombreOriginal,
                                'product_id'    => $pedido[0]['idListaProductos'],
                            ];

                            $success = $this->createOrderImages($this->util->sql($values));
                            $files_up[] = $values;
                        }
                    }
                }
            }

            // Guardar datos de pedido personalizado
            $success = $this->addPedidoPersonalizado([
                'id_pedidoproducto' => $pedido[0]['idListaProductos'],
                'observaciones'     => $_POST['observaciones'],
                'total'             => $_POST['costo'],
                'relleno'           => $_POST['relleno'],
                'importeBase'       => $_POST['importeBase'],
                'importeOblea'      => $_POST['importeOblea'],
                'saborPan'          => $_POST['saborPan'],
                'leyenda'           => $_POST['leyenda'],
            ]);
        }

        return [
            'get'         => $pedido ?? null,
            'files'       => $files_up ?? [],
            'data_pedido' => $data ?? null,
            'success'     => $success ?? null,
            'tipo'        => $_POST['tipo']
        ];
    }


    function addPedido($data){

        $values  = $this -> util -> sql( $data );
        return  $this ->add_producto_vendido($values);

    }

    function addPedidoPersonalizado($data){

        $values    = $this -> util -> sql($data);
        return  $this -> setPedidoPersonalizado($values);

    }



    function updateItem(){

        $ruta    = "erp_files/pedidos/pasteleria/";  // Ruta destino son hashes
        $carpeta = '../../../../'.$ruta;

        $registros     = true;
        $image         = '';

        $listPedido    = $this->getPedidoByIdList([$_POST['idFolio'], $_POST['id']]);
        $personalizado = (!empty($listPedido) && isset($listPedido[0]['personalizado']) && !empty($listPedido[0]['personalizado'])) ? 1 : 0;


         // add Personalizado.
         if ($personalizado == 0 ) { // add personalizado
             $successPedido = $this->updatePedido($this->util->sql([
                'costo'                    => $_POST['costo'],
                'leyenda'                  => $_POST['leyenda'],
                'personalizado'            => 1,
                'name'                     => $_POST['name'],
                'pedido_productos.portion' => $_POST['portion'],
                'idListaProductos'         => $_POST['id']
            ], 1));


            $success = $this -> addPedidoPersonalizado([
                'id_pedidoproducto' => $_POST['id'],
                'total'             => $_POST['costo'],
                'relleno'           => $_POST['relleno'],
                'observaciones'     => $_POST['observaciones'],
                'importeBase'       => $_POST['importeBase'],
                'importeOblea'      => $_POST['importeOblea'],
                'saborPan'          => $_POST['saborPan'],
            ]);


         }else { // ya existe personalizado

              $successPedido = $this->updatePedido($this->util->sql([
                'costo'                    => $_POST['costo'],
                'leyenda'                  => $_POST['leyenda'],
                'name'                     => $_POST['name'],
                'pedido_productos.portion' => $_POST['portion'],
                'idListaProductos'         => $_POST['id']
              ], 1));

              $successPersonalizado = $this->updatePersonalizado($this->util->sql([
                'total'                    => $_POST['costo'],
                'relleno'                  => $_POST['relleno'],
                'observaciones'            => $_POST['observaciones'],
                'importeBase'              => $_POST['importeBase'],
                'importeOblea'             => $_POST['importeOblea'],
                'saborPan'                 => $_POST['saborPan'],
                'id_pedidoproducto'        => $_POST['id']
              ], 1));

         }



            // Subir archivos si existen


            $files_up = [];
            if (!empty($_FILES['archivos']['name'][0])) {

                $this-> removeOrderImages([$_POST['id']]);

                foreach ($_FILES['archivos']['name'] as $i => $nombreOriginal) {

                    if ($_FILES['archivos']['error'][$i] === UPLOAD_ERR_OK) {
                        $temporal    = $_FILES['archivos']['tmp_name'][$i];
                        $ext         = pathinfo($nombreOriginal, PATHINFO_EXTENSION);

                        $nuevoNombre = substr(md5(uniqid('', true)), 0, 8) . '.' . strtolower($ext);
                        $destino     = $carpeta . $nuevoNombre;

                        if (move_uploaded_file($temporal, $destino)) {
                            $values = [
                                'path'          => $ruta.$nuevoNombre,
                                'name'          => $nuevoNombre,
                                'original_name' => $nombreOriginal,
                                'product_id'    => $_POST['id'],
                                'date_create'    => date('Y-m-d H:i:s'),
                            ];

                            $success = $this->createOrderImages($this->util->sql($values));
                            $files_up[] = $values;
                        }
                    }
                }
            }






        return [
            // 'file'    =>$_FILES['archivos'],
            // 'success' => $successPedido,
            // 'ok'      => $files_up,
            [$_POST['idFolio'], $_POST['id']],
            'list' => $listPedido,
            'personalizado' => $personalizado

        ];

    }

    function newTicket(){

        $date = date('Y-m-d H:i:s');
        $random = str_pad(mt_rand(0, 999), 3, '0', STR_PAD_LEFT);

        // add client.

        $data_client = $this -> util -> sql([
            'Name_Cliente'   => $_POST['cliente'],
            'Telefono'       => $_POST['telefono'],
            'Email'          => $_POST['correo'],
            'estado_cliente' => 1,
        ]);

        $client      = $this -> addClient($data_client);

        // add new ticket.

        $ticket                = [];
        $ticket['id_cliente']  = $client['idCliente'];
        $ticket['folio']       = 'P-'.$random;
        $ticket['foliofecha']  = $date;
        $ticket['horapedido']  = $_POST['horapedido'];
        $ticket['fechapedido'] = $_POST['fechapedido'];
        $ticket['fechaCumple'] = $_POST['fechaCumpleaños'];
        $ticket['observacion'] = $_POST['observacion'];
        $ticket['whatsapp']    = $_POST['isWhatsapp'];


        $data                = $this -> util->sql( $ticket );

        $ok = $this -> CrearTicket($data);

           // devolver lista con el nuevo ticket
        $lsFolio  = $this->getTickets();
        $newFolio = $this->newFolio();



        return [
            'ok' => $ok,
            'successclient' => $success_client ?? null,
            'lsFolio' => $lsFolio,
            'idFolio' => (isset($newFolio[0]['idLista'])) ? $newFolio[0]['idLista'] : null
        ];

    }

    function getTicket(){

        $pedido        = $this -> getPedidoByIdList([$_POST['idFolio'],$_POST['id_producto']]);
        $personalizado = $this -> getInfoPersonalizado([$_POST['id_producto']]);
        $orderImages   = $this -> getOrderImages([$_POST['id_producto']]);

        // Verificar que los datos existan
        if (empty($pedido) || empty($pedido[0])) {
            return [
                'error' => true,
                'message' => 'No se encontró información del pedido',
                'producto' => null,
                'personalizado' => null,
                'data' => null,
                'orderImages' => []
            ];
        }

        $data = [
            'costo'         => isset($pedido[0]['costo']) ? $pedido[0]['costo'] : 0,
            'importeBase'   => isset($personalizado[0]['importeBase']) ? $personalizado[0]['importeBase'] : 0,
            'importeOblea'  => isset($personalizado[0]['importeOblea']) ? $personalizado[0]['importeOblea'] : 0,
            'relleno'       => isset($personalizado[0]['relleno']) ? $personalizado[0]['relleno'] : '',
            'leyenda'       => isset($personalizado[0]['leyenda']) ? $personalizado[0]['leyenda'] : '',
            'personalizado' => isset($pedido[0]['personalizado']) ? $pedido[0]['personalizado'] : 0,
            'observaciones' => isset($personalizado[0]['observaciones']) ? $personalizado[0]['observaciones'] : '',
            'name'          => isset($pedido[0]['name']) ? $pedido[0]['name'] : '',
            'portion'       => isset($pedido[0]['portion']) ? $pedido[0]['portion'] : '',
            'saborPan'      => isset($personalizado[0]['saborPan']) ? $personalizado[0]['saborPan'] : '',
        ];

        return [
            'producto'      => isset($pedido[0]) ? $pedido[0] : null,
            'personalizado' => isset($personalizado[0]) ? $personalizado[0] : null,
            'data'          => $data,
            'orderImages'   => $orderImages ? $orderImages : []
        ];
    }



    // Products

    function lsProducts() {
        # Variables
        $__row = [];
        $ls    = $this->listProduction([2,1]);
        $grupo = $this -> getClasificacion();

        // $desplazamiento = $obj->consultar_x_mes(array(9, 2024, 1, $key['idAlmacen']));
        foreach ($ls as $key) {
            $estatus        = $key['estadoProducto'];
            $icon  = $estatus == 1 ? ' icon-toggle-on' : ' icon-toggle-off';

            $a = [];
            if ($estatus == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'products.editProducto(' . $key['idAlmacen'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'products.statusProducto(' . $key['idAlmacen'] . ')'
                ];
            } 
            $costsys  = $this -> getPriceByCostsys([$key['idAlmacen']]);

            $__row[] = array(
                'id'    => $key['idAlmacen'],
                'clave' => $key['idAlmacen'],
                'foto'  => [
                        'class' => 'flex justify-center py-2 bg-white',
                        'html'  => $this->getImageTagFromCostsys($costsys)
                ],
                'Producto'     => $key['NombreProducto'],
                'Precio Venta' => isset($costsys[0]['precioVenta'])
                        ? evaluar($costsys[0]['precioVenta'])
                        :  evaluar($key['price']),
                'Estado' => $this->formatStatusLabel( $estatus),
                'Clasificacion' => addSelectGroup([

                    'ls'              => $grupo,
                    'id'              => $key['idAlmacen'],
                    'idClasificacion' => $key['id_clasificacion']

                ]),
                'a' => $a
                // 'opc'             =>0
            );
        }
        return [  "row" => $__row,];
    }

    function addProduct() {
        $status                = 500;
        $message               = 'No se pudo agregar el producto';
        $_POST['FechaIngreso'] = date('Y-m-d H:i:s');
        $_POST['Area']         = 2;
        $exists                = $this->existsProductoByName([$_POST['name']]);

        if (!$exists) {
            $create = $this->createProduct($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Producto agregado correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe un producto con ese nombre.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $exists,
        ];
    }

    function getProductsById() {
        $data = [];
        $status  = 500;
        $message = 'No se pudo obtener el producto';

        $list = $this->getProduct([$_POST['id']]);
        if (empty($list)) {
            return [
                'status'  => 404,
                'message' => 'Producto no encontrado',
                'data'    => null
            ];
        }
        
        $costsys = $this->getPriceByCostsys([$list['id']]);
        $data    = [
            'id'               => $list['id'],
            'NombreProducto'   => $list['NombreProducto'],
            'price'            => isset($costsys[0]['precioVenta']) ? $costsys[0]['precioVenta'] : $list['price'],
            'id_clasificacion' => $list['id_clasificacion'],
        ];

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data,
        ];
    }

    function formatStatusLabel($estatus) {
        switch ($estatus) {
            case 1:
                return '<span class="bg-[#066d29] text-white px-2 py-1 rounded-md text-sm font-semibold">Activo</span>';
            case 0:
                return '<span class="bg-[#a12929] text-white px-2 py-1 rounded-md text-sm font-semibold">Inactivo</span>';
            case 2:
                return '<span class="bg-[#874e0a] text-white px-2 py-1 rounded-md text-sm font-semibold">Borrador</span>';
            default:
                return '<span class="bg-gray-500 text-white px-2 py-1 rounded-md text-sm font-semibold">Desconocido</span>';
        }
    }

    function getImageTagFromCostsys($costsys) {

        $src = (!empty($costsys) && isset($costsys[0]['foto']) && !empty($costsys[0]['foto'])) ? 'https://erp-varoch.com/' . $costsys[0]['foto'] : '';

        if (!empty($src)) {
            return '<img src="' . $src . '" alt="Imagen Producto" class="w-10 h-10 bg-[#233876] rounded-lg" />';
        }

        // Contenedor vacío similar a la imagen (tamaño 56x56 px, fondo y borde)
         return '<div class="w-10 h-10 bg-gray-200 rounded border border-gray-500 flex items-center justify-center text-white text-sm">
                <i class="icon-birthday text-gray-500"></i>
            </div>';
    }


    function addClasificacion(){
       $data =   $this -> util-> sql($_POST,1);


       $success = $this -> updateClasificacion($data);

       return $success;
    }


    // Operations.
    function endTicket() {
        $tdc       = isset($_POST['tdc'])       && is_numeric($_POST['tdc'])       ? floatval($_POST['tdc'])       : 0;
        $efectivo  = isset($_POST['efectivo'])  && is_numeric($_POST['efectivo'])  ? floatval($_POST['efectivo'])  : 0;
        $descuentoPorcentaje = isset($_POST['descuento']) && is_numeric($_POST['descuento']) ? floatval($_POST['descuento']) : 0;

        $total = floatval($_POST['Total']);
        $montoDescuento = $total * ($descuentoPorcentaje / 100);
        $totalFinal = $total - $montoDescuento;

        $data = $this -> util -> sql([
            'efectivo'         => $efectivo,
            'tdc'              => $tdc,
            'anticipo'         => ($tdc + $efectivo),
            'Total'            => $totalFinal,
            'discount'         => $montoDescuento,
            'discount_percent' => $descuentoPorcentaje,
            'Status'           => 2,
            'foliofecha'       => date('Y-m-d H:i:s'),
            'idLista'          => $_POST['idFolio']
        ], 1);
    
        $res = $this->setTickets($data);
    
        if ($res) {
            return [
                'status'  => 200,
                'message' => "Ticket finalizado correctamente 🧾",
                'data'    => $data
            ];
        } else {
            return [
                'status'  => 500,
                'message' => "Error al finalizar el ticket",
                'data'    => []
            ];
        }
    }
    

    function cancelTicket(){
        return $this->update_ticket([
            3,
            $_POST['idFolio']
        ]);
    }

    function removeItem(){

        return $this -> removeProducts([$_POST['id']]);
    }

}

// Complementos
function diasFaltantes($fechaFutura) {
    // Convertir la fecha actual y futura en objetos DateTime
    $fechaHoy = new DateTime();
    $fechaDestino = new DateTime($fechaFutura);

    // Calcular la diferencia
    $diferencia = $fechaHoy->diff($fechaDestino);

    // Verificar si la fecha futura ya pasó
    if ($diferencia->invert) {

        return "<span class='fw-bold text-danger'> La fecha $fechaFutura ya pasó. </span>";
    }

    return "{$diferencia->days} días restantes";
}

 function addSelectGroup($data){

        $txt = '<div class="input-group w-100">';
        $txt .= '
        <select style="font-size:12px;"
        class="form-control input-sm p-1 fw-semibold js-example-basic-single " id="cb_producto' . $data['id'] . '">
        <option value="0"  > -- Clasificar -- </option>';

        $precioVenta = 0;

        foreach ($data['ls'] as $row) {
            if ($row['id'] == $data['idClasificacion']) {
            $txt         .= '<option value="' . $row['id'] . '" selected>' . $row['valor'].'  </option>';
            $precioVenta  = isset($row['precioVenta']) ? $row['precioVenta'] : 0;
            } else {
            $txt .= '<option value="' . $row['id'] . '" >
            ' . $row['valor'] . '</option>';
            }
        }


        $onClick = 'onclick="products.updateClasificacion(' .$data['id'] . ')"';
        $txt = $txt . '</select>
                <a '.$onClick.' class="input-group-text btn btn-outline-secondary p-1" >
                    <i class="icon-link-1 " ></i>
                </a>
                </div>
                ';


                return $txt;

 }



// Instancia del objeto

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);
