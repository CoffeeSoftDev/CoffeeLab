<?php
if (empty($_POST['opc']))
    exit(0);

setlocale(LC_TIME, 'es_ES.UTF-8');
date_default_timezone_set('America/Mexico_City');

header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

require_once ('../mdl/mdl-pedidos.php');
require_once '../../../conf/coffeSoft.php';
require_once('../../../conf/_Utileria.php');

require_once ('../src/libreria/dompdf/autoload.inc.php');
use Dompdf\Dompdf;

require_once('../../../conf/_Message.php');


class ctrl extends listPedidos{

    public $util;

    public function __construct() {
        // Llama al constructor de la clase padre
        parent::__construct();
        $this-> util = new Utileria();

    }

    public function lsPedid() {
        // 📜 Parámetros
        $__row = [];
        $fi    = $_POST['fi'] ?? '';
        $ff    = $_POST['ff'] ?? '';

        // $sub       = $_SESSION['SUB'];
        // $Sucursal  = $this->getSucursalByID([$sub]);

        // 📦 Obtener datos desde base

        $ls = $this->list_ticket([$_POST['fi'],$_POST['ff']]);

        foreach ($ls as $key) {
        //     // Variables de negocio
        //     // $anticipoEfectivo  = floatval($key['efectivo'] ?? 0);
        //     // $anticipoTransfer  = floatval($key['tdc'] ?? 0);
        //     // $anticipoTotal     = $anticipoEfectivo + $anticipoTransfer;
            $total             = floatval($key['Total'] ?? 0);
        //     // $saldo             = $total - $anticipoTotal;

            // Cliente visual (puedes mejorar el html si tienes más datos)
            $clienteName = isset($key['Name_Cliente']) ? $key['Name_Cliente'] : 'Sin cliente';
            $cliente = [
                'html'  => "<p class='text-gray-300'>{$clienteName}</p>",
            ];

            // Anticipo visual
            $anticipoHtml = "<p class='text-[#3FC189] text-end'>" . evaluar($anticipoTotal) . "</p>";
            if ($anticipoEfectivo > 0) {
                $anticipoHtml .= "<p class='text-xs text-gray-500 text-end'>Efectivo: " . evaluar($anticipoEfectivo) . "</p>";
            }
            if ($anticipoTransfer > 0) {
                $anticipoHtml .= "<p class='text-xs text-gray-500 text-end'>Transferencia: " . evaluar($anticipoTransfer) . "</p>";
            }


            $acciones = $this->dropdownPedido(
                isset($key['id']) ? $key['id'] : 0, 
                isset($key['Status']) ? $key['Status'] : 0, 
                1
            );

        //     // Agregar fila al arreglo
            $__row[] = [
                'id'        => isset($key['id']) ? $key['id'] : 0,
                'folio'     => 'PD-'.(isset($key['id']) ? $key['id'] : 0),
                'Fecha de creación' => isset($key['fechapedido']) ? formatSpanishDate($key['fechapedido']) : '',
                'Cliente'   => $cliente,



                'Anticipo'  => [
                    "html"  => $anticipoHtml,
                    "class" => "text-[#3FC189] text-end bg-[#283341]"
                ],
                'Total'     => [
                    "html"  => evaluar($total),
                    "class" => "text-end bg-[#283341]"
                ],
                'Saldo'     => [
                    "html"  => evaluar($saldo),
                    "class" => "text-[#E05562] text-end bg-[#283341]"
                ],
                'Fecha de entrega' => isset($key['fechapedido']) ? formatSpanishDate($key['fechapedido']) : '',

                'Horario'   => '',
                'Personas'  => '',
                'Estado'    => isset($key['Status']) ? status($key['Status']) : '',
                'Entregado' => isset($key['Status']) ? entregado($key['Status']) : '',
                'dropdown'  => $acciones
            ];
        }

        // 📦 Retornar resultado final
        return [
            "row" => $__row,
            'ls'  => $ls,

        ];
    }

    function cancelPedido() {
        $status  = 500;
        $message = 'No se pudo cancelar el pedido.';

        // 🛠️ Validación de datos mínimos
        if (empty($_POST['id'])) {
            return [
                'status'  => 500,
                'message' => 'ID de pedido no proporcionado',
            ];
        }

        // 🧾 Actualizar estado del pedido
        $update = true;
        // $update = $this->update($this->util->sql($_POST, 1));

        if ($update) {
            $status  = 200;
            $message = 'El pedido ha sido cancelado exitosamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    public function dropdownPedido($id, $status) {
        $acciones = [];

        // Acción: Ver pedido (detalle)
        $acciones[] = [
            'text'    => ' Ver',
            'icon'    => 'icon-eye',
            'onclick' => "custom.showPedido($id)"
        ];

        // // Acción: Editar solo si el pedido no está cancelado
        // if (strtolower($status) !== 'cancelado') {
            $acciones[] = [
                'text'    => ' Editar',
                'icon'    => 'icon-pencil',
                'onclick' => "custom.render($id)"
            ];

            $acciones[] = [
                'text'    => 'Historial',
                'icon'    => 'icon-history',
                'onclick' => "custom.historyPedido($id)"
            ];
        // }

        // // Acción: Cancelar solo si no está cancelado
        // if (strtolower($status) !== 'cancelado') {
            $acciones[] = [
                'text'    => ' Cancelar',
                    'icon'    => 'icon-block-1',
                'onclick' => "custom.cancelPedido($id)"
            ];
        // }

        // Puedes agregar más acciones aquí

        // Devuelve la lista de acciones (el frontend genera el menú visual)
        return $acciones;
    }

    public function lsPedidos() {

        // 📌 Inicializar variables
        $__row          = [];
        $totalGeneral   = 0;
        $totalAnticipos = 0;


        $tipo = $_POST['typeReport'] ?? 'creacion';
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];

        $ls = $this->list_ticket([
            'fi'   => $fi,
            'ff'   => $ff,
            'tipo' => $tipo
        ]);

        foreach ($ls as $key) {

            $discount    = $key['discount'] ?? 0;
            $totalPagado = $key['efectivo'] ?? 0 + $key['tdc'] ?? 0;
            $saldo       = $key['Total'] - $discount - $totalPagado;
            $hasDiscount   = $discount > 0;
            $totalGral     = $key['Total'] - $discount;

            $htmlTotal = $hasDiscount
            ? "<div class='text-end'>
                    <p title='Con descuento aplicado' class='text-green-600 cursor-pointer font-semibold'>" . evaluar($totalGral) . "</p>
                    <p class='line-through text-gray-500 text-[10px]'>" . evaluar( $key['Total']) . "</p>
                    <p class='text-gray-500 text-[10px]'><i class='icon-tag'></i> Descuento: " . evaluar($discount) . "</p>
                </div>"
            : evaluar($key['Total']);


            // 🎯 Acciones
            $a = [
                [
                    'class'   => ' mx-0 text-[18px] pointer text-primary',
                    'html'    => '<i class="icon-print"></i>',
                    'onclick' => 'pedidos.printOrder(' . $key['id'] . ')',
                ],
                [
                    'class'   => ' mx-0 px-2 text-[18px] pointer text-danger',
                    'html'    => '<i class="icon-block-1"></i>',
                    'onclick' => 'pedidos.cancelPedidoTicket(' . $key['id'] . ')',
                ],
            ];

            // 💵 Anticipo formateado con saltos de línea
            $lineas = [];
            if ($key['efectivo']) {
                $lineas[] = evaluar($key['efectivo']) . ' en efectivo';
                $totalAnticipos += (float)$key['efectivo'];
            }
            if ($key['tdc']) {
                $lineas[] = evaluar($key['tdc']) . ' en transferencia';
                $totalAnticipos += (float)$key['tdc'];
            }


            // $lineas[] = isset($key['Name_Cliente']) ? $key['Name_Cliente'] : 'Sin cliente';

            $htmlAnticipo = '';
            foreach ($lineas as $line) {
                $htmlAnticipo .= "<p class='text-left text-gray-500'>{$line}</p>";
            }

            // ➕ Acumular total
            $totalGeneral += (float)$key['Total'];

            // 📋 Fila
            $__row[] = [
                'id'       => $key['id'],
                'Folio'    => 'P-'.$key['id'],
                'Creación' => formatDates($key['foliofecha']),
                'Cliente'  => isset($key['Name_Cliente']) ? $key['Name_Cliente'] : 'Sin cliente',
                'Abono'    => ['html' => $htmlAnticipo],
                'Total'    => $htmlTotal,
                'Saldo' => [
                    'html' => evaluar($saldo),
                    'class' => "text-[#E05562] text-end  px-2"
                ],
                'Entrega'  => isset($key['fechapedido']) ? formatDates($key['fechapedido']) : '',
                'Estado'   => setEstatus(['estatus' => isset($key['Status']) ? $key['Status'] : null]),
                'Canal'    => isset($key['whatsapp']) ? tipoPedido($key['whatsapp']) : '',
                'a'        => $a,
            ];
        }

        // 📦 Retornar datos
        return [
            "thead"         => '',
            "row"           => $__row,
            "ls"            => $ls,
            "totalGeneral"  => evaluar($totalGeneral),
            "totalAnticipo" => evaluar($totalAnticipos)
        ];
    }

    public function lsPedidosProgramados() {

        $__row          = [];
        $totalGeneral   = 0;
        $totalAnticipos = 0;

        $tipo = $_POST['typeReport'] ?? 'creacion';
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];

        $ls = $this->list_ticket([
            'fi'   => $fi,
            'ff'   => $ff,
            'tipo' => $tipo
        ]);

        foreach ($ls as $key) {

            $a = [
                [
                    'class'   => ' mx-0 px-2 pointer text-primary',
                    'html'    => '<i class="icon-shop"></i>',
                    'onclick' => 'pedidos.printOrder(' . $key['id'] . ')',
                ],
                [
                    'class'   => ' mx-0 px-2 pointer text-danger',
                    'html'    => '<i class="icon-block-1"></i>',
                    'onclick' => 'pedidos.cancelPedidoTicket(' . $key['id'] . ')',
                ],
            ];

             // 💵 Anticipo formateado con saltos de línea
            $lineas = [];
            if ($key['efectivo']) {
                $lineas[] = evaluar($key['efectivo']) . ' en efectivo';
                $totalAnticipos += (float)$key['efectivo'];
            }
            if ($key['tdc']) {
                $lineas[] = evaluar($key['tdc']) . ' en transferencia';
                $totalAnticipos += (float)$key['tdc'];
            }
            $lineas[] = isset($key['Name_Cliente']) ? $key['Name_Cliente'] : 'Sin cliente';

            $htmlAnticipo = '';
            foreach ($lineas as $line) {
                $htmlAnticipo .= "<p class='text-left text-gray-500'>{$line}</p>";
            }


            $totalGeneral += (float)$key['Total'];

            $__row[] = [
                'id'       => $key['id'],
                'Folio'    => 'P-'.$key['id'],
                 'Entrega'  => [
                    'html'  =>formatDates($key['fechapedido'],'normal'),
                    'class' => 'text-sm text-center font-bold text-blue-800'
                ],
                'Cliente'  => isset($key['Name_Cliente']) ? $key['Name_Cliente'] : 'Sin cliente',
                'Abono'    => ['html' => $htmlAnticipo],
                'Total'    => isset($key['Total']) ? evaluar($key['Total']) : '0.00',

                'Creado' => isset($key['foliofecha']) ? formatDates($key['foliofecha']) : '',
                'Estado'   => setEstatus(['estatus' => isset($key['Status']) ? $key['Status'] : null]),

                'a'        => $a,
            ];
        }

        return [
            "thead"         => '',
            "row"           => $__row,
            "ls"            => $ls,
            "totalGeneral"  => evaluar($totalGeneral),
            "totalAnticipo" => evaluar($totalAnticipos)
        ];
    }

    public function confirmOrder(){

         // actualizar estado de los pedidos
        $ls = $this->list_ticket([$_POST['fi'],$_POST['ff']]);

        foreach ($ls as $folio):

            $data  = $this -> util -> sql( [
                'Status'  => 4,
                'idLista' => $folio['id']
            ],1);

            $sql[] = $this->setTickets( $data );

        endforeach;

        return [
           'sql'=> $sql,
           'ls' => $ls
        ];


    }


    function cancelTicket(){
        return $this->update_ticket([
            3,
            $_POST['idFolio']
        ]);
    }

    function sendWhatsapp(){

        // $ls = $this->list_ticket([$_POST['fi'],$_POST['ff']]);
        $tipo = $_POST['typeReport'] ?? 'creacion';
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];

        $ls = $this->list_ticket([
            'fi'   => $fi,
            'ff'   => $ff,
            'tipo' => $tipo
        ]);

        foreach ($ls as $folio):

            $data  = $this -> util -> sql( [
                'Status'  => 4,
                'idLista' => $folio['id']
            ],1);

            $sql[] = $this->setTickets( $data );

        endforeach;

        $basePhones = ['9621149020'];

        $wp = $_POST['wp'] ?? null;
        $cc = $_POST['CC'] ?? null;

        $frontPhones = array_filter([
        $wp ? preg_replace('/\D+/', '', $wp) : null,
        $cc ? preg_replace('/\D+/', '', $cc) : null,
        ]);

        $phones = array_values(array_unique(array_merge($basePhones, $frontPhones)));

        $pdf =   $this :: sendPDF([
            'html'    => $this -> listAllpedidos(),
            'phones'  => $phones,
            'message' => 'Pedido de pastelería'
        ]);


        return [
            'status'    => 200,
            'orderCount' =>count($ls),
            'pdf'       => $pdf
        ];



    }

    public function listAllpedidoxs() {

        $fechaActual = date('Y-m-d');
        $estilos = $this->getEstilosPedidos();

        $table = '<html><head>    <style>
            .pedido-box {
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 25px;
                background-color: #ffffff;
            }
            .pedido-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 5px;
            }
            .pedido-subtitle {
                font-size: 12px;
                color: #555;
                margin-bottom: 10px;
            }
            .pedido-status {
                font-size: 12px;
                font-weight: bold;
                color: #111;
                background: #f1f5f9;
                padding: 5px 15px;
                border-radius: 9999px;
            }
            .pedido-badge {
                display: inline-block;
                background-color: #f0fdfa;
                color: #047857;
                font-size: 11px;
                font-weight: bold;
                padding: 4px 8px;
                border-radius: 9999px;
                margin-top: 6px;
            }

            .pedido-grid {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                margin-bottom: 15px;
            }
            .pedido-grid > div {
                width: 48%;
            }
            .pedido-section {
                margin-top: 15px;
            }
            .pedido-section-title {
                font-weight: bold;
                font-size: 12px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 6px;
                margin-bottom: 8px;
            }
            .pedido-row {
                margin-bottom: 6px;
                font-size: 12px;
            }
            .pedido-label {
                font-weight: bold;
            }
            .pedido-green {
                color: green;
                font-weight: bold;
            }
            .pedido-grid-3 {
                display: grid;
                grid-template-columns: 25% 35% 35%;
                gap: 20px;
                margin: 20px 0;
            }
            .pedido-img-label {
                font-size: 12px;
                text-align: center;
                margin-top: 6px;
                color: #777;
            }
            .pedido-status-mini {
                background: #f4f4f4;
                padding: 4px 10px;
                font-size: 12px;
                border-radius: 9999px;
            }
            .pedido-grid-4 {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin: 15px 0;
            }
            .pedido-observaciones {
                padding: 10px;
                font-size: 14px;
                border-radius: 6px;
                margin-top: 10px;
            }
        </style></head><body>';

        $lsPedidos = $this->list_pedidos([$_POST['fi'], $_POST['ff']]);
        $enlace = $this->util->url();

        foreach ($lsPedidos as $_key) {

            $ls = $this->listProducts([$_key['id']]);

         foreach ($ls as $key) {
                $costumerProduct = $this->getCustomerProduct([$key['id']]);
                $spanStatus = setEstatus(['estatus' => $_key['Status']]);

                $table .= '
                    <div class="pedido-box">

                        <div class="pedido-header">
                            <div>PEDIDO #' . str_pad($_key['id'], 4, "0", STR_PAD_LEFT) . ' - ' . $_key['Name_Cliente'] . '</div>
                            <div>' . $spanStatus . '</div>
                        </div>

                        <div class="pedido-subtitle">Fecha de pedido: ' . formatSpanishDateAll($_key['fechapedido']) . '</div>

                        <div class="pedido-grid-3">
                            <div class="pedido-img">
                                <div class="pedido-section-title">IMAGEN DE REFERENCIA</div>';

                                if ($key['image'] == null) {
                                    $table .= '
                                    <div width="220" height="220" style="height:150px; border-radius:10px; border:1px solid #ccc; background:#e5e7eb; display:flex; align-items:center; justify-content:center; font-size:20px; color:#777;">
                                        <i class="icon-picture"></i>
                                    </div>
                                    <div class="pedido-img-label">Imagen no disponible</div>';
                                } else {
                                    $table .= '
                                    <img src="' . $enlace[0] . $key['image'] . '" width="220" height="220" style="border-radius:10px; border:1px solid #ccc;" />';
                                }

                            $table .= '
                            </div>

                            <div>
                                <div class="pedido-section-title">INFORMACIÓN DEL PRODUCTO</div>

                                <div class="pedido-row"><span class="pedido-label">MODELO:</span><br>' . $key['NombreProducto'] . '</div>
                                <div class="pedido-row"><span class="pedido-label">NO. PERSONAS:</span></div>
                                <div class="pedido-row"><span class="pedido-label">MONTO TOTAL:</span> <span class="pedido-green">' . evaluar($key['costo']) . '</span></div>';

                                if ($key['personalizado']) {
                                    $table .= '
                                    <div class="pedido-row">
                                        <strong>TIPO:</strong> <span class="pedido-badge">PERSONALIZADO</span>
                                    </div>

                                    <div class="pedido-section col-span-2">
                                        <div class="pedido-section-title border-b pb-1">ESPECIFICACIONES ADICIONALES</div>
                                        <div class="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
                                    ';

                                    $personalizado = $this->getCustomerProduct([$key['id']]);

                                    $table .= '
                                            <div class="pedido-row"><span class="pedido-label">RELLENO:<br/></span>' . ($personalizado['relleno'] ?: 'No especificado') . '</div>
                                            <div class="pedido-row"><span class="pedido-label">SABOR DE PAN:<br/></span>' . ($personalizado['sabor'] ?: 'No especificado') . '</div>
                                            <div class="pedido-row"><span class="pedido-label">IMPORTE BASE:<br/></span>$' . (evaluar($personalizado['importeBase']) ?: 'No especificado') . '</div>
                                            <div class="pedido-row"><span class="pedido-label">LEYENDA:<br/></span><span style="color:purple;">' . ($personalizado['leyenda'] ?: 'No especificado') . '</span></div>
                                        </div>
                                    </div>';
                                }

                            $table .= '
                            </div>

                            <div>
                                <div class="pedido-section-title">INFORMACIÓN DE ENTREGA</div>
                                <div class="pedido-row"><span class="pedido-label">FECHA DE ENTREGA:</span> ' . formatSpanishDateAll($_key['fechapedido']) . '</div>
                                <div class="pedido-row"><span class="pedido-label">HORA DE ENTREGA:</span> 15:00</div>
                            </div>
                        </div>';

                // Observaciones final
                $observacion = $key['Observaciones'] ?? $personalizado['observaciones'] ?? 'Ninguna';

                $table .= '
                    <div class="pedido-observaciones mt-4">
                        <strong>OBSERVACIONES:</strong><br>' . $observacion . '
                    </div>

                </div>';
            }

        }


        $table .= '</body></html>';
        return $table;

    }

    public function getEstilosPedidos() {
        return '
        <style>
            .pedido-box {
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 25px;
                background-color: #ffffff;
            }
            .pedido-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 5px;
            }
            .pedido-subtitle {
                font-size: 12px;
                color: #555;
                margin-bottom: 10px;
            }
            .pedido-status {
                font-size: 12px;
                font-weight: bold;
                color: #111;
                background: #f1f5f9;
                padding: 5px 15px;
                border-radius: 9999px;
            }
            .pedido-badge {
                display: inline-block;
                background-color: #f0fdfa;
                color: #047857;
                font-size: 11px;
                font-weight: bold;
                padding: 4px 8px;
                border-radius: 9999px;
                margin-top: 6px;
            }

            .pedido-grid {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                margin-bottom: 15px;
            }
            .pedido-grid > div {
                width: 48%;
            }
            .pedido-section {
                margin-top: 15px;
            }
            .pedido-section-title {
                font-weight: bold;
                font-size: 12px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 6px;
                margin-bottom: 8px;
            }
            .pedido-row {
                margin-bottom: 6px;
                font-size: 12px;
            }
            .pedido-label {
                font-weight: bold;
            }
            .pedido-green {
                color: green;
                font-weight: bold;
            }
            .pedido-grid-3 {
                display: grid;
                grid-template-columns: 25% 35% 35%;
                gap: 20px;
                margin: 20px 0;
            }
            .pedido-img-label {
                font-size: 12px;
                text-align: center;
                margin-top: 6px;
                color: #777;
            }
            .pedido-status-mini {
                background: #f4f4f4;
                padding: 4px 10px;
                font-size: 12px;
                border-radius: 9999px;
            }
            .pedido-grid-4 {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin: 15px 0;
            }
            .pedido-observaciones {
                padding: 10px;
                font-size: 14px;
                border-radius: 6px;
                margin-top: 10px;
            }
        </style>
        ';
    }

    public function listAllpedidos() {
        $fechaActual = date('Y-m-d');
        $lsPedidos   = $this->list_pedidos([$_POST['fi'], $_POST['ff']]);
        $enlace      = $this->util->url();

        $html = '
        <html>
        <head>
            <meta charset="utf-8">
            <style>
            *{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:12px;color:#111}
            .titulo{font-size:16px;font-weight:700;text-align:center;margin:6px 0 6px}
            .box{padding:10px 12px;margin:15px 0 14px;page-break-inside:avoid;border:1px solid#c0c0c0;border-radius:8px}
            .header-ord{font-weight:700;font-size:14px;margin-bottom:2px}.subheader{font-size:11px;color:#666;margin-bottom:8px}
            .tbl{width:100%;border-collapse:collapse}.tbl td{border:1px solid #cfcfcf;vertical-align:top;padding:6px}
            .tbl tr.img-row td{border:none;}           /* <-- sin borde en fila de imágenes */
            .col-img{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start; padding-bottom:10px;}
            .col-prod{width:44%}.col-entrega{width:30%}
            .title-sec{font-weight:700;font-size:13px;margin:0 0 8px;border-bottom:1px solid #cfcfcf;padding-bottom:4px}
            .label{font-weight:700}.kv{line-height:1.45}.w-25{width:25%}
            .img{width:150px;height:150px;border-radius:10px;border:1px solid #cfcfcf;object-fit:cover;display:block}
            .img-ph{width:150px;height:150px;border:1px solid #cfcfcf;background:#eee;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#888;font-size:11px}
            .specs{width:100%;border-collapse:collapse}.specs td{border:1px solid #cfcfcf;padding:8px;vertical-align:top}
            .observa{padding:10px 0 3px}
            .text-purple{color:#5a2d82}
            .text-description{color:#003360; font-weight:700; }
            </style>
        </head>
        <body>

            <div style="display:flex; justify-content:flex-end; margin-bottom:6px;">
            <a onclick="pedidos.printOrderDoc()" style="cursor:pointer; text-decoration:none;">
                <span style="font-size:20px; color:#2563eb;"><i class="icon-print"> </i></span>
            </a>
            </div>

            <div class="titulo">PEDIDOS DE PASTELERÍA - ' . formatSpanishDateAll($fechaActual) . '</div>
        ';

        $values = [];

        foreach ($lsPedidos as $_key) {
            $ls = $this->listProducts([$_key['id']]);

            $values['key'] = $_key['id'];

            foreach ($ls as $key) {

                $personalizado = $this->getCustomerProduct([$key['id']]) ?: [];

                $html .= '
                <div class="box">
                    <div class="header-ord">PEDIDO # ' . str_pad($_key['id'], 4, "0", STR_PAD_LEFT) . ' - ' . htmlspecialchars($_key['Name_Cliente']) . '</div>
                    <div class="subheader">Creado el día: ' . formatSpanishDateAll($_key['foliofecha']) . '</div>

                    <table class="tbl"> ';

                $orderImages = $this->getOrderImages([$key['id']]);
                $values['orderImages'] = $orderImages;
                $values['personalizado'] = $personalizado;

                if (!empty($orderImages)) {
                    $html .= '<tr class="img-row"><td colspan="2"><table class="imgs"><tr>';
                    foreach ($orderImages as $img) {
                        $src = !empty($img['path'])
                            ? rtrim($enlace[0], '/').'/'.ltrim($img['path'], '/')
                            : (!empty($img['url']) ? $img['url'] : '');
                        $html .= '<td class="imgcell">';
                        if ($src !== '') {
                            $html .= '<img src="'.htmlspecialchars($src).'" alt="Imagen del producto" class="img">';
                        } else {
                            $html .= '<div class="img-ph">Sin imagen</div>';
                        }
                        $html .= '</td>';
                    }
                    $html .= '</tr></table></td></tr>';

                }

                        // <div class="kv"><span class="label">MONTO TOTAL:</span> ' . evaluar($key['costo']) . '</div>


                $html .= '

                    <tr>

                        <td class="col-prod">
                        <div class="title-sec">INFORMACIÓN DEL PRODUCTO:</div>
                        <div class="kv"><span class="label">MODELO: </span> ' . htmlspecialchars($key['name']) . '</div>
                        <div class="kv"><span class="label">NO. PERSONAS:</span> ' . $key['portion'] . '</div>
                        </td>

                        <td class="col-entrega">
                        <div class="title-sec">INFORMACIÓN DE ENTREGA:</div>
                        <div class="kv"><span class="label">FECHA DE ENTREGA:</span><br>
                            <span style="font-size:12px; text-transform:uppercase;">' . formatSpanishDateAll($_key['fechapedido']) . '</span>
                        </div>
                        <div  >
                            <span class="label">HORA DE ENTREGA:</span> ' . htmlspecialchars($_key['horapedido']) . '
                        </div>
                        </td>
                    </tr>';



                if (!empty($key['personalizado'])) {
                    $relleno     = trim($personalizado['relleno'] ?? '') !== '' ? $personalizado['relleno'] : 'No especificado';
                    $sabor       = trim($personalizado['saborPan'] ?? '')   !== '' ? $personalizado['saborPan']   : 'No especificado';
                    $importeBase = isset($personalizado['importeBase']) && $personalizado['importeBase'] !== '' ? evaluar($personalizado['importeBase']) : '-';
                    $Oblea       = isset($personalizado['importeOblea']) && $personalizado['importeOblea'] !== '' ? 'SI' : '';
                    $leyenda     = trim($personalizado['leyenda'] ?? '') !== '' ? $personalizado['leyenda'] : 'No especificado';

                    $html .= '
                    <tr>
                        <td colspan="2">
                        <div class="title-sec">ESPECIFICACIONES ADICIONALES</div>
                        <table class="specs">
                            <tr>
                            <td class="w-25">
                                <div class="label">RELLENO:</div>
                                <div class="text-description">' . htmlspecialchars($relleno) . '</div>
                            </td>
                            <td class="w-25">
                                <div class="label">SABOR DE PAN:</div>
                                <div class="text-description">' . htmlspecialchars($sabor) . '</div>
                            </td>
                            <td class="w-25">
                                <div class="label">Oblea:</div>
                                <div class="text-description">' . $Oblea  . '</div>
                            </td>
                            <td class="w-25">
                                <div class="label">LEYENDA:</div>
                                <div class="text-description">' . htmlspecialchars($leyenda) . '</div>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>';
                }

              $observaciones = [];

                if (!empty(trim($key['observacion'] ?? ''))) {
                    $observaciones[] = trim($key['observacion']);
                }

                if (!empty(trim($personalizado['observaciones'] ?? ''))) {
                    $observaciones[] = trim($personalizado['observaciones']);
                }

                $observacion = !empty($observaciones)
                    ? implode('<br>', $observaciones)
                    : 'Ninguna';


                $html .= '
                    <tr>
                        <td colspan="2" class="observa">
                        <div class="label">OBSERVACIONES:</div>
                        <div>' . nl2br(htmlspecialchars($observacion)) . '</div>
                        </td>
                    </tr>
                    </table>
                </div>';
            }
        }

        $html .= '</body></html>';
        return $html;

        // return [
        //     'values' => $values

        // ];
    }

     function getOrder(){

          // products.
        $__row = [];
        $ls    = $this->listProducts([$_POST['NoFolio']]);

        foreach ($ls as $key) {

            $getInfo = $this -> getInfoPersonalizado([$key['id']]);


            $__row[] = [
                'id'    => $key['id'],
                'name'    => $key['name'],
                'price'   => $key['costo'],
                'desc'    => $key['leyenda'],
                'portion' => $key['portion'],
                'data'    => $getInfo,
                'opc'     => 0
            ];


        }

        $order            = $this->getFolio([$_POST['NoFolio']]);
        $order['logo']    = 'src/img/udn/fz_black.png' ;
        $order['company'] = '' ;

         return [

            'order'          => $order,
            'products'       => $__row,
            'paymentMethods' => $ls,

         ];

    }

    function getProductsByFol(){

        # Variables
        $__row   = [];
        $idFolio = $_POST['NoFolio'];

        # Lista de productos
        $ls    = $this->listProducts([$idFolio]);
        $total = 0;

        foreach ($ls as $key) {

            $getInfo = $this -> getInfoPersonalizado([isset($key['id']) ? $key['id'] : 0]);

            $__row[] = array(

                'id'            => isset($key['id']) ? $key['id'] : 0,
                'valor'         => isset($key['NombreProducto']) ? $key['NombreProducto'] : '',
                'Cant.'         => isset($key['cantidad']) ? $key['cantidad'] : 0,
                'costo'         => isset($key['costo']) ? evaluar($key['costo']) : '0.00',
                'personalizado' => isset($key['personalizado']) ? $key['personalizado'] : '',
                'name'          => isset($key['name']) ? $key['name'] : '',
                'portion'       => isset($key['portion']) ? $key['portion'] : '',

                'data' => $getInfo,
                'leyenda'            => isset($key['leyenda']) ? $key['leyenda'] : '',
                'src'                => isset($key['image']) ? $key['image'] : '',
                'srcCatalog'         => isset($key['imageCatalog']) ? $key['imageCatalog'] : '',

                'opc'                => 0
            );

            $total += isset($key['costo']) ? $key['costo'] : 0;
        }

        $lsFolio = $this->getFolio([$idFolio]);

        $head = [

            'data' => [

                'folio'       => isset($lsFolio['folio']) ? $lsFolio['folio'] : '',
                'pedido'      => isset($lsFolio['fechapedido']) ? formatSpanishDate($lsFolio['fechapedido']) : '',
                'cliente'     => isset($lsFolio['Name_Cliente']) ? $lsFolio['Name_Cliente'] : 'Sin cliente',
                'telefono'    => isset($lsFolio['Telefono']) ? $lsFolio['Telefono'] : '',
                'cumple'      => isset($lsFolio['fechaCumple']) ? formatSpanishDate($lsFolio['fechaCumple']) : '',
                'anticipo'    => isset($lsFolio['anticipo']) ? $lsFolio['anticipo'] : 0,
                'observacion' => isset($lsFolio['observacion']) ? $lsFolio['observacion'] : '',
                'total'       => isset($lsFolio['Total']) ? $lsFolio['Total'] : 0,
                'horapedido'  => isset($lsFolio['horapedido']) ? $lsFolio['horapedido'] : '',

            ],

            'type' => 'details'
        ];



        // Encapsular arreglos
        return [ "thead" => '', "row" => $__row ,'head' => $head];


    }

    function setPastel(){

        $ruta    = "erp_files/pedidos/pasteles/";  // Ruta destino son hashes
        $carpeta = '../../../../'.$ruta;
        $estatus = true;

        if (!file_exists($carpeta)) { //Busca si existe la carpeta si no la crea
            $estatus = false;
            mkdir($carpeta, 0777, true);
        }

        foreach ($_FILES as $cont => $key):

            if($key['error'] == UPLOAD_ERR_OK ){

                $NombreOriginal = $key['name'];
                $temporal       = $key['tmp_name'];
                $destino        = $ruta.$NombreOriginal;
                $movefile       = $carpeta.$NombreOriginal;

                move_uploaded_file($temporal, $movefile);
                $ls    = $this->listProducts([$_POST['id']]);

                foreach ($ls as $product) {
                    $data  = $this -> util -> sql( [
                        'imageCatalog'    => $destino,
                        'idListaProductos' =>  $product['id'],
                    ],1);


                    $sqlPedido = $this->updatePedido(  $data );
                }


                // Actualizar estado de imagen.
                $updatePedidoFolio  = $this -> util -> sql( [
                    'Status'  => 5,
                    'idLista' => $_POST['id']
                ],1);
                $sql = $this->setTickets(  $updatePedidoFolio );
            }

        endforeach;

        return [
            'file'   => $data,
            'update' =>  $sqlPedido,
            'folder' =>  $_FILES,
            'status' =>  $estatus,
        ];
    }

    function setMessageUser(){
        $msg    = new Message();

        $image = $_POST['img'];

        $ruta    = "erp_files/pedidos/pasteles/";  // Ruta destino son hashes
        $carpeta = '../../../../'.$ruta;
        $estatus = true;

        if (!file_exists($carpeta)) { //Busca si existe la carpeta si no la crea
            $estatus = false;
            mkdir($carpeta, 0777, true);
        }



		$img     = str_replace('data:image/png;base64,', '', $image);
		$img     = str_replace(' ', '+', $img);
		$data    = base64_decode($img);
		$name    = 'tickets'.$_POST['id'].'.png';
		$file    = $carpeta.$name;
		$success = file_put_contents($file, $data);


        // Enlace público del PDF
        $enlace = $this->util->url();
        $link = $enlace[0]. $ruta;

        // Enviar el archivo por WhatsApp
        $send = $msg->whatsapp_file(
            '9621501886',
            'Hola , se ha enviado tu ticket de compra, Consulta nuestras politicas de privacidad en www.panaderiafogaza.com/politics',
            $link,
            $name
        );






		// return $success;

        return $success;



    }

    // globals

    public function sendPDF($params) {

        $dompdf = new Dompdf();
        $msg    = new Message();

        // Configuración de parámetros por defecto
        $defaults = [
            'html'        => '',                                         // Contenido HTML para el PDF
            'phones'      => [],                                         // Arreglo o cadena de números de teléfono
            'message'     => 'Nuevo archivo',                            // Mensaje para WhatsApp
            'path'        => '../../../../erp_files/pedidos/formato/',   // Ruta base para guardar el PDF
            'fileName'    => 'pedido_fogaza',                                  // Prefijo para el nombre del PDF
            'cssBasePath' => '/www/public/css/',                         // Ruta base para CSS
        ];

        // Combinar parámetros con valores por defecto
        $options = array_merge($defaults, $params);

        // Manejo de números de teléfono
        $tel = is_array($options['phones']) ? $options['phones'] : explode(",", $options['phones']);
        // if (isset($_COOKIE['TEL'])) {
        // array_push($tel, $_COOKIE['TEL']);
        // }

        // Configuración del archivo PDF
        $random         = rand(1, 100);
        $fecha_actual   = date('d_m_Y');
        $nombre_archivo = $options['fileName'] . '_' . $fecha_actual . '_' . $random . '.pdf';
        $rutaArchivoPdf = rtrim($options['path'], '/') . '/' . $nombre_archivo;

        // Generación del PDF
        $dompdf->set_base_path($options['cssBasePath']);
        $dompdf->loadHtml($options['html']);
        $dompdf->setPaper('letter');

        $optionsDompdf = $dompdf->getOptions();
        $optionsDompdf->set([
            'isRemoteEnabled' => true,
            'isHtml5ParserEnabled' => true,
            'isJavascriptEnabled' => true
        ]);
        $dompdf->setOptions($optionsDompdf);

        // Renderizar y guardar el PDF
        $dompdf->render();
        $bytesEscritos = file_put_contents($rutaArchivoPdf, $dompdf->output());

        // Enlace público del PDF
        $enlace = $this->util->url();
        $ruta = $enlace[0].'erp_files/pedidos/formato/';

        // Enviar el archivo por WhatsApp
        $send = $msg->whatsapp_file(
            $tel,
            $options['message'],
            $ruta,
            $nombre_archivo
        );

        // Retornar información relevante
            return [
            'rutaArchivoPdf' => $rutaArchivoPdf,
            'bytesEscritos' => $bytesEscritos,
            'rutaPublica' => $rutaPublica,
            'sendStatus' => $send
            ];
    }

}

// Complements.

function setEstatus($options) {
    $estatus = isset($options['estatus']) ? $options['estatus'] : null;
    
    switch ($estatus) {

        case 2:
            return '<span class="badge bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded text-xs ">📦 Enviar pedido</span>';

        case 4:
            return '<span class="badge bg-yellow-100 text-yellow-800 font-semibold px-2 py-1 rounded text-xs">📷 Subir foto pendiente</span>';

        case 5:
            return '<span class="badge bg-green-100 text-green-800 font-semibold px-2 py-1 rounded text-xs">✅ Terminado</span>';

        default:
            return '<span class="badge bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Sin estatus</span>';
    }
}

function tipoPedido($tipo) {
    switch ($tipo) {
        case 1:
            return '<span class="badge bg-green-100 text-green-800 font-semibold px-2 py-1  text-xs rounded"><i class="icon-whatsapp"></i> WhatsApp</span>';
        case 0:
        default:
            return '<span class="badge bg-gray-100 text-gray-800 font-semibold px-2 py-1  text-xs rounded">🛒 Local</span>';
    }
}


function createTable($row){
  $thead = '';
  $tbody = '';

  $thead .= "<tr class='bg-primary'>";
  $position = 0;
  foreach ($row[0] as $key => $value):
    $align = 'text-';
    $align = ($position == 0) ? 'text-center col-sm-3' : '';
    $thead .= "<th class='{$align}'> " . ucfirst($key) . "</th>";
    $position++;
  endforeach;

  $thead .= '</tr>';


  foreach ($row as $rows => $keyx):
    $tbody .= "<tr>";
    $position = 0;
    foreach ($keyx as $value):

        $align = 'text-end';

         if($position == 0){
            $align = 'text-center';
        }else if($position == 1){
           $align = 'text-centerx';
        }

      $tbody .= "<td class='{$align}'> " . $value . "</td>";
      $position++;
    endforeach;

    $tbody .= '</tr>';
  endforeach;




  // Imprime los resultados en una tabla

  $table .= '
        <table style="margin-top:15px;  "
         class="tb tb-report" width="100%" >

        <thead>
          '.$thead.'
        </thead>

        <tbody>
           ' . $tbody . '
        </tbody>
        </table>
    ';


  return $table;
}

function status($idEstado){
    if ($idEstado === null) {
        return '<span class="bg-gray-500 w-32 text-white text-xs font-semibold mr-2 px-3 py-1 rounded">SIN ESTADO</span>';
    }
    
    switch ($idEstado) {
        case 1:
            return '<span class="bg-[#9EBBDB] w-32 text-[#2A55A3] text-xs font-semibold mr-2 px-3 py-1 rounded">COTIZACIÓN</span>';
        case 3:
            return '<span class="bg-[#633112] w-32 text-[#F2C215] text-xs font-semibold mr-2 px-3 py-1 rounded">PENDIENTE</span>';
        case 2:
            return '<span class="bg-[#014737] w-32 text-[#3FC189] text-xs font-semibold mr-2 px-3 py-1 rounded">PAGADO</span>';
        case 4:
            return '<span class="bg-[#572A34] w-32 text-[#E05562] text-xs font-semibold mr-2 px-3 py-1 rounded">CANCELADO</span>';
        default:
            return '<span class="bg-gray-500 w-32 text-white text-xs font-semibold mr-2 px-3 py-1 rounded">DESCONOCIDO</span>';
    }
}

function entregado($idEstado){
    if ($idEstado === null) {
        return '<span class="bg-gray-900 text-gray-400 text-xs font-semibold px-3 py-1 rounded">N/A</span>';
    }
    
    switch ($idEstado) {
        case 2:
            return '<span class="bg-green-900 text-green-300 text-xs font-semibold px-3 py-1 rounded">SI</span>';
        default:
            return '<span class="bg-red-900 text-red-400 text-xs font-semibold px-3 py-1 rounded">NO</span>';
    }
}

function formatDates($fecha = null, $type = 'short') {
    setlocale(LC_TIME, 'es_ES.UTF-8');
    date_default_timezone_set('America/Mexico_City');

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Si no hay fecha, usar la actual
    }

    $marcaTiempo = strtotime($fecha);
    $hoy = date('Y-m-d');
    $ayer = date('Y-m-d', strtotime('-1 day'));
    $antier = date('Y-m-d', strtotime('-2 days'));

    // Verificar si la fecha es hoy o antier
    if ($fecha == $hoy) {
        return "Hoy";
    } elseif ($fecha == $ayer) {
        return "Ayer";
    }

    // Formatos de fecha en español
    $formatos = [
        'short'  => "%d/%b/%Y",          // Ejemplo: 01/ene/2025
        'normal' => "%d de %B del %Y",   // Ejemplo: 01 de enero del 2025
    ];

    // Usar el formato adecuado o 'short' por defecto
    $formatoFecha = $formatos[$type] ?? $formatos['short'];

    return strftime($formatoFecha, $marcaTiempo);
}


// Instancia del objeto

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);
