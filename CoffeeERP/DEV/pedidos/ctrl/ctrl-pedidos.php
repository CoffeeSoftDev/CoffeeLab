<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-pedidos.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'canales' => $this->lsCanales([1]),
            'productos' => $this->lsProductos([1]),
            'campanas' => $this->lsCampanas([1])
        ];
    }

    function ls() {
        $__row = [];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];
        $udn = $_POST['udn'] ?? $_SESSION['SUB'];
        
        $ls = $this->listPedidos([$fi, $ff, $udn]);
        
        foreach ($ls as $key) {
            $diasTranscurridos = (strtotime(date('Y-m-d')) - strtotime($key['fecha_creacion'])) / 86400;
            $puedeEditar = $diasTranscurridos <= 7;
            
            $__row[] = [
                'id' => $key['id'],
                'Fecha' => formatSpanishDate($key['fecha_pedido']),
                'Hora' => $key['hora_entrega'],
                'Cliente' => $key['cliente_nombre'],
                'Teléfono' => $key['cliente_telefono'],
                'Canal' => [
                    'html' => '<div class="flex items-center gap-2">
                                <i class="' . $key['red_social_icono'] . '" style="color:' . $key['red_social_color'] . '"></i>
                                <span>' . $key['canal_nombre'] . '</span>
                              </div>',
                    'class' => 'text-left'
                ],
                'Monto' => evaluar($key['monto']),
                'Envío' => $key['envio_domicilio'] ? 'Domicilio' : 'Recoger',
                'Pago' => renderPaymentStatus($key['pago_verificado']),
                'Llegada' => renderArrivalStatus($key['llego_establecimiento']),
                'Estado' => renderStatus($key['active']),
                'dropdown' => dropdown($key['id'], $key['active'], $puedeEditar, $key['pago_verificado'])
            ];
        }
        
        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getPedido() {
        $status = 500;
        $message = 'Error al obtener pedido';
        
        $pedido = $this->getPedidoById([$_POST['id']]);
        
        if ($pedido) {
            $status = 200;
            $message = 'Pedido obtenido correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message,
            'data' => $pedido
        ];
    }

    function addPedido() {
        $status = 500;
        $message = 'Error al crear pedido';
        
        $_POST['fecha_creacion'] = date('Y-m-d H:i:s');
        $_POST['user_id'] = $_SESSION['USER_ID'];
        $_POST['udn_id'] = $_SESSION['SUB'];
        $_POST['active'] = 1;
        $_POST['pago_verificado'] = 0;
        
        $clienteExiste = $this->getClienteByPhone([$_POST['cliente_telefono'], $_SESSION['SUB']]);
        
        if (!$clienteExiste) {
            $clienteData = [
                'nombre' => $_POST['cliente_nombre'],
                'telefono' => $_POST['cliente_telefono'],
                'correo' => $_POST['cliente_correo'] ?? null,
                'fecha_cumpleaños' => $_POST['cliente_cumpleaños'] ?? null,
                'fecha_creacion' => date('Y-m-d H:i:s'),
                'udn_id' => $_SESSION['SUB'],
                'active' => 1
            ];
            
            $clienteId = $this->createCliente($this->util->sql($clienteData));
            $_POST['cliente_id'] = $clienteId;
        } else {
            $_POST['cliente_id'] = $clienteExiste['id'];
        }
        
        $create = $this->createPedido($this->util->sql($_POST));
        
        if ($create) {
            $status = 200;
            $message = 'Pedido creado correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editPedido() {
        $status = 500;
        $message = 'Error al editar pedido';
        
        $validation = $this->validatePedidoAge([$_POST['id']]);
        
        if (!$validation['valid']) {
            return [
                'status' => 403,
                'message' => 'No se puede editar pedidos con más de 7 días de antigüedad. Este pedido tiene ' . $validation['dias'] . ' días.'
            ];
        }
        
        $edit = $this->updatePedido($this->util->sql($_POST, 1));
        
        if ($edit) {
            $status = 200;
            $message = 'Pedido editado correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusPedido() {
        $status = 500;
        $message = 'Error al cambiar estado';
        
        $update = $this->updatePedido($this->util->sql($_POST, 1));
        
        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function verifyTransfer() {
        $status = 500;
        $message = 'Error al verificar transferencia';
        
        $_POST['fecha_verificacion'] = date('Y-m-d H:i:s');
        $_POST['usuario_verificacion'] = $_SESSION['USER_ID'];
        $_POST['pago_verificado'] = 1;
        
        $update = $this->updatePedido($this->util->sql($_POST, 1));
        
        if ($update) {
            $status = 200;
            $message = 'Transferencia verificada correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function registerArrival() {
        $status = 500;
        $message = 'Error al registrar llegada';
        
        $_POST['fecha_llegada'] = date('Y-m-d H:i:s');
        $_POST['llego_establecimiento'] = $_POST['arrived'];
        
        $update = $this->updatePedido($this->util->sql($_POST, 1));
        
        if ($update) {
            $status = 200;
            $message = 'Llegada registrada correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'] ?? $_SESSION['SUB'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics = $this->getDashboardMetrics([$udn, $year, $month]);
        $monthlyReport = $this->getMonthlyReport([$udn, $year, $month]);
        
        $labels = [];
        $data = [];
        foreach ($monthlyReport as $item) {
            $labels[] = $item['canal_nombre'];
            $data[] = $item['total_ventas'];
        }

        return [
            'dashboard' => [
                'totalPedidos' => evaluar($metrics['total_pedidos']),
                'ingresosTotales' => evaluar($metrics['ingresos_totales']),
                'chequePromedio' => evaluar($metrics['cheque_promedio']),
                'pagosVerificados' => evaluar($metrics['pagos_verificados']),
                'llegadasConfirmadas' => evaluar($metrics['llegadas_confirmadas'])
            ],
            'chartData' => [
                'labels' => $labels,
                'datasets' => [
                    [
                        'label' => 'Ventas por Canal',
                        'data' => $data,
                        'backgroundColor' => '#103B60',
                        'borderColor' => '#8CC63F',
                        'borderWidth' => 2
                    ]
                ]
            ]
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'] ?? $_SESSION['SUB'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $year]);
        
        $canales = [];
        foreach ($data as $item) {
            $canal = $item['canal_nombre'];
            $mes = $item['mes'];
            
            if (!isset($canales[$canal])) {
                $canales[$canal] = [
                    'Canal' => $canal,
                    'Enero' => 0, 'Febrero' => 0, 'Marzo' => 0, 'Abril' => 0,
                    'Mayo' => 0, 'Junio' => 0, 'Julio' => 0, 'Agosto' => 0,
                    'Septiembre' => 0, 'Octubre' => 0, 'Noviembre' => 0, 'Diciembre' => 0,
                    'Total' => 0
                ];
            }
            
            $meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            
            $canales[$canal][$meses[$mes]] = evaluar($item['total_ventas']);
            $canales[$canal]['Total'] += $item['total_ventas'];
        }
        
        foreach ($canales as $canal) {
            $canal['Total'] = evaluar($canal['Total']);
            $__row[] = $canal;
        }

        return [
            'row' => $__row
        ];
    }
}

function dropdown($id, $active, $puedeEditar, $pagoVerificado) {
    $options = [];
    
    if ($puedeEditar && $active == 1) {
        $options[] = [
            'icon' => 'icon-pencil',
            'text' => 'Editar',
            'onclick' => "pedidos.editPedido($id)"
        ];
    }
    
    if (!$pagoVerificado && $active == 1) {
        $options[] = [
            'icon' => 'icon-dollar',
            'text' => 'Verificar Pago',
            'onclick' => "pedidos.verifyTransfer($id)"
        ];
    }
    
    $options[] = [
        'icon' => 'icon-map-marker',
        'text' => 'Registrar Llegada',
        'onclick' => "pedidos.registerArrival($id)"
    ];
    
    if ($active == 1) {
        $options[] = [
            'icon' => 'icon-ban',
            'text' => 'Cancelar',
            'onclick' => "pedidos.cancelPedido($id)"
        ];
    }

    return $options;
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Cancelado
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

function renderPaymentStatus($verified) {
    if ($verified == 1) {
        return '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <i class="icon-check"></i>
                    Verificado
                </span>';
    } else {
        return '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    <i class="icon-clock"></i>
                    Pendiente
                </span>';
    }
}

function renderArrivalStatus($arrived) {
    if ($arrived === null) {
        return '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    <i class="icon-minus"></i>
                    N/A
                </span>';
    } elseif ($arrived == 1) {
        return '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <i class="icon-check"></i>
                    Llegó
                </span>';
    } else {
        return '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <i class="icon-times"></i>
                    No llegó
                </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
