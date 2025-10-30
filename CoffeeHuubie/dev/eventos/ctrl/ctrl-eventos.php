<?php

if (empty($_POST['opc'])) exit(0);
session_start();
header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

// incluir tu modelo
require_once '../mdl/mdl-eventos.php';

// sustituir 'mdl' extends de acuerdo al nombre que tiene el modelo
$encode = [];

class ctrl extends MEvent{

    function init(){
        return [
            'estados' => $this->getStatus()
        ];
    }

    function lsVentas(){
        // 📜 Parámetros
        $__row     = [];

        $idEstatus = $_POST['status'];
        $fi        = $_POST['fi'];
        $ff        = $_POST['ff'];

        // $sub       = $_SESSION['SUB'];
        $sub       =  $_SESSION['SUB'];
        $Sucursal  = $this->getSucursalByID([$sub]);

        // 📦 Obtener datos desde base
        $ls = $this->getEvents([
            'subsidiaries_id' => $Sucursal['idSucursal'],
            'fi'              => $fi,
            'ff'              => $ff,
            'status'          => $_POST['status']
        ]);

        foreach ($ls as $key) {
            // 🔵 Variables de negocio
            $advancePayEvento = $key['advanced_pay'] ?? 0; // Anticipo declarado en el evento
            $advanceExtra     = $this->getAdvancedPay([$key['id']])['totalPay'] ?? 0; // Avances registrados
            $discount         = $key['discount'] ?? 0;
            $total            = $key['total_pay'];
            $totalGral        = $total - $discount;
            $saldo            = $total - $discount - $advanceExtra;
            $hasDiscount      = floatval($discount) > 0;
            $anticipoTotal    = $advanceExtra;

            // 🔵 Formato visual del Total con descuento
            $htmlTotal = $hasDiscount
                ? "<div class='text-end'>
                    <p title='Con descuento aplicado' class='text-green-400 cursor-pointer font-semibold'>" . evaluar($totalGral) . "</p>
                    <p class='line-through text-gray-500 text-[10px]'>" . evaluar($total) . "</p>
                    <p class='text-gray-500 text-[10px]'><i class='icon-tag'></i> Descuento: " . evaluar($discount) . "</p>
                </div>"
                : evaluar($total);

            // 🔵 Formato de fechas y folio
            $date_creation = formatSpanishDate($key['date_creation'], 'normal');
            $folio         = $Sucursal['name'] . "-" . $this->util->zeroFill($key['id']);
            $Folio         = formatSucursal($Sucursal['name'], $Sucursal['sucursal'], $key['id']);

            // 📤 Agregar fila
            $__row[] = [
                'id'       => $key['id'],
                'folio'    => $Folio,
                'Creación' => $date_creation,

                'Cliente'  => [
                    'html'  => "<p class='text-gray-300'>{$key['name_event']}</p>
                                <p class='text-gray-500'>{$key['name_client']}</p>",
                ],

                'Abono' => [
                    "html"  => evaluar($anticipoTotal),
                    "class" => "text-[#3FC189] text-end bg-[#283341]"
                ],

                'Total' => [
                    "html"  => $htmlTotal,
                    "class" => "text-end bg-[#283341]"
                ],

                'Saldo' => [
                    "html"  => evaluar($saldo),
                    "class" => "text-[#E05562] text-end bg-[#283341]"
                ],

                'Fecha de evento' => formatSpanishDate($key['date_start'], 'normal'),
                'Ubicación'       => $key['location'],
                'Horario'         => $key['hours_start'],
                'Estado'          => status($key['idStatus']),
                'dropdown'        => $this->dropdownEvent($key['id'], $key['idStatus'], count($this->getSubEventsByEventId([$key['id']])) > 0 ? 1 : 0)
            ];
        }

        // 📦 Retornar resultado final
        return [
            "row" => $__row,
            'ls'  => $ls,
            $_SESSION['SUB'],
            'id'  => $Sucursal['idSucursal'],
        ];
    }

    function dropdownEvent($id, $status, $type){

        $functionEdit = $type == 1 ? 'sub.editSubevent' : 'eventos.editEventTabs';
        $category = $type == 1 ? 'Subevento' : 'Evento';
        $options = [
            ['Ver', 'icon-eye', "eventos.showEvent({$id}, '{$category}')"],
            ['Editar', 'icon-pencil', "{$functionEdit}({$id})"],
            ['Cancelar', 'icon-block-1', "eventos.removeItem({$id})"],
            ['Pagar', 'icon-money', "payment.addPayment({$id})"],
            ['Historial', 'icon-history', "payment.historyPay({$id})"],
            ['Imprimir', 'icon-print', "payment.onShowDocument({$id})"],
            ['Descuento', 'icon-tag', "sub.Descuento({$id})"],

        ];

        if ($status == 4) {
            $options = [
                ['Ver', 'icon-eye', "eventos.showEvent({$id}, '{$category}')"],
                ['Historial', 'icon-history', "payment.historyPay({$id})"],
            ];
        }

        if ($status == 3) {
            $options = [
                ['Ver', 'icon-eye', "eventos.showEvent({$id}, '{$category}')"],
                ['Historial', 'icon-history', "payment.historyPay({$id})"],
                ['Imprimir', 'icon-print', "payment.onShowDocument({$id})"],
            ];
        }

        return array_map( fn($opt) => [
            'text'    => $opt[0],
            'icon'    => $opt[1],
            'onclick' => $opt[2],
        ], $options);
    }


    // Calendario
    function getCalendario()  {
        $event = [];
        $getCalendar = $this->getCalendar([$_SESSION['SUB']]);

        foreach ($getCalendar as $key) {
            $category = 'Evento';
            $getSubevents = $this->getSubEventsByEventId([$key['id']]);

            if (count($getSubevents) > 0) {
                $category = "Subevento";
            }

            $color = '';
            if ($key['idStatus'] == 1) $color = "#6E95C0";
            elseif ($key['idStatus'] == 2) $color = "#FE6F00";
            elseif ($key['idStatus'] == 3) $color = "#0E9E6E";
            elseif ($key['idStatus'] == 4) $color = "#E60001";


            // Agregar un dia a la fecha de fin
            // $key['end'] = date('Y-m-d', strtotime($key['end'] . ' +1 day'));
            $event[] = [
                'id'       => $key['id'],
                'title'    => $key['title'],
                'start' => date('Y-m-d', strtotime($key['start'])),
                'end'   => date('Y-m-d', strtotime($key['end'])),
                'category' => $category,
                'status'   => $key['status'],
                'location' => $key['location'],
                'client'   => $key['client'],
                'color'    => $color
            ];
        }
        return $event;
    }

    function getByIdCalendario(){
        $status = 500;
        $message = 'Error al obtener el evento.';
        if ($_POST['category'] == 'Evento') {
            // Obtener evento por ID
            return $this->getEvent([$_POST['id']]);
        } else if ($_POST['category'] == 'Subevento') {
            // Obtener subevento por ID
            return $this->getSubEvent([$_POST['id']]);
        }

        return [
            'status' => $status,
            'message' => $message,
        ];
    }


    // Evento
    function getEvent(){
        $status = 500;
        $message = 'Error al obtener el evento.';
        $getEvent = $this->getEventById([$_POST['id']]);

        // Separar fecha y hora de inicio y fin agregando a getEvent time_start y time_end
        $getEvent['time_start'] = date('H:i', strtotime($getEvent['date_start']));
        $getEvent['time_end'] = date('H:i', strtotime($getEvent['date_end']));
        $getEvent['date_start'] = date('Y-m-d', strtotime($getEvent['date_start']));
        $getEvent['date_end'] = date('Y-m-d', strtotime($getEvent['date_end']));

        $color = '';
        if ($getEvent['status_process_id'] == 2) {
            $color = "#856E1D";
        } else if ($getEvent['status_process_id'] == 3){
            $color = "#0E9E6E";
        } else if ($getEvent['status_process_id'] == 4){
            $color = "#EF5252";
        }

        $getEvent['color'] = $color;

        if (!empty($getEvent) && is_array($getEvent)) {
            $status = 200;
            $message = 'Evento obtenido correctamente.';

        }

        $extras = $this->getExtrasByEvent([$_POST['id']]);
        $lsmenu = $this->getPackagesByEventId([$_POST['id']]);

        // Detallado de menú
        $_menu = [];
        foreach($lsmenu as $menu){
            $_menu[] = [
                'idPackage'     => $menu['idPackage'],
                'id'            => $menu['id'],
                'name'          => $menu['name'],
                'active'        => $menu['active'],
                'date_creation' => $menu['date_creation'],
                'description'   => $menu['description'],
                'event_id'      => $menu['event_id'],
                'package_id'    => $menu['package_id'],
                'price'         => $menu['price'],
                'price_person'  => $menu['price_person'],
                'quantity'      => $menu['quantity'],
                'subevent_id'   => $menu['subevent_id'],
                'dishes'        => $this->getProductsPackageId([$menu['idPackage']])
            ];
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => [
                'event'  => $getEvent,
                'menu'   => $_menu,
                'extras' => $extras,
            ],
        ];
    }

    function addEvent(){
        // EVENTO
        $status = 500;
        $message = 'Error al crear el Evento.';
        $date_start = formatDateTime($_POST['date_start'], $_POST['time_start']);
        $date_end = formatDateTime($_POST['date_end'], $_POST['time_end']);

        // Si la fecha es inválida
        if (empty($date_start) || empty($date_end)) {
            return [
                'status'   => $status,
                'message' => 'Error al crear el Evento. Verifica las fechas.'
            ];
        }
        // Si tiene método de pago
        $metodo_pago = [];
        if (!empty($_POST['method_pay_id'])) {
            $metodo_pago = [
                'method_pay_id' => $_POST['method_pay_id'],
            ];
        } else {
           unset($_POST['method_pay_id']); // Si no tiene método de pago, eliminar el campo.
        }

        // Si tiene anticipo
        $status_process = 1; // Cotización


        $eventos = [
            'name_event'        => $_POST['name_event'],
            'date_creation'     => date('Y-m-d H:i:s'),
            'date_start'        => $date_start,
            'date_end'          => $date_end,
            'location'          => $_POST['location'],
            'name_client'       => $_POST['name_client'],
            'phone'             => $_POST['phone'],
            'email'             => $_POST['email'],
            'type_event'        => $_POST['type_event'],
            'quantity_people'   => $_POST['quantity_people'],
            'subsidiaries_id'   => $_SESSION['SUB'],
            'notes'             => $_POST['notes'],
            'status_process_id' => $status_process
        ];

        // Fusionar `$metodo_pago` solo si tiene valores
        $eventos = array_merge( $metodo_pago, $eventos);

        // Insertar evento
        $create = $this->createEvent($this->util->sql($eventos));

        if ($create == true) {
            $status      = 200;
            $message = 'Sigue continuando con el menú. 🍜🍽️';
            $id_event    = $this->maxEvent();

            $history = "Se creó el evento {$_POST['name_event']}";
            $this->addHistories($this->util->sql([
                'title'         => 'Evento creado',
                'evt_events_id' => $id_event,
                'comment'       => $history,
                'action'        => $history,
                'date_action'   => date('Y-m-d H:i:s'),
                'type'          => 'creation',
                'usr_users_id'  => $_SESSION['USR']
            ]));
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => [
                'id' => $id_event
            ],

        ];
    }

    function editEvent() {
        // EVENTO
        $status     = 500;
        $message    = 'Error al editar el Evento.';
        $date_start = formatDateTime($_POST['date_start'], $_POST['time_start']);
        $date_end   = formatDateTime($_POST['date_end'], $_POST['time_end']);
        unset($_POST['time_start']);
        unset($_POST['time_end']);


        // Si la fecha es inválida
        if (empty($date_start) || empty($date_end)) {
            return [
                'status'   => $status,
                'message' => 'Error al crear el Evento. Verifica las fechas.'
            ];
        } else {
            $_POST['date_start'] = $date_start;
            $_POST['date_end'] = $date_end;
        }


        // Actualizar evento
        $update = $this->updateEvent($this->util->sql($_POST, 1));

        if ($update == true) {
            $status  = 200;
            $message = 'Datos del evento editados correctamente.';
        }

        return [
            'status'   => $status,
            'message' => $message,

        ];
    }

    function cancelEvent(){
        return $this->updateEvent($this->util->sql($_POST, 1));
    }

    // Payment.
    function addPayment($idEvent) {

        $values_pay = [
            'date_pay'      => date('Y-m-d H:i:s'),
            'type'          => 2,
            'method_pay_id' => $_POST['method_pay_id'],
            'pay'           => $_POST['advanced_pay'],
            'evt_events_id' => $idEvent,
        ];

        $addPay = $this->addMethodPay($this->util->sql($values_pay));

        if (!$addPay) {

            return [
                'status'  => 500,
                'message' => 'Error al agregar el pago'
            ];
        }

        $methodPay = $this->getMethodPay([$_POST['method_pay_id']]);
        $message   = 'Se dio un anticipo de ' . evaluar($_POST['advanced_pay']) . ' en ' . $methodPay;

        // Historial de acción
        $history = [
            'title'         => 'Anticipo',
            'evt_events_id' => $idEvent,
            'comment'       => $message,
            'action'        => $message,
            'date_action'   => date('Y-m-d H:i:s'),
            'type'          => 'payment',
            'usr_users_id'  => $_SESSION['USR'],
        ];

        $success = $this->addHistories($this->util->sql($history));

        return [
             $values_pay,
            'status'        => $addPay,
        //     'statusMessage' => $success,
            'message'       => $message,
        //     'historys'      => $history,
        ];
    }



    // MENU
    function getPackages(){

        $status     = 500;
        $message    = 'Error al obtener los menús precargados.';
        $subsidiary = $_SESSION['SUB'];

        $dataRaw = $this->getMenus([$subsidiary]);

        $menus = [];

        $agrupados = [];
        foreach ($dataRaw as $row) {
            $idP = $row['package_id'];

            if (!isset($agrupados[$idP])) {
                $agrupados[$idP] = [
                    'id' => $row['package_id'],
                    'nombre' => $row['package'],
                    'descripcion' => $row['description'],
                    'precioPorPersona' => floatval($row['price_person']),
                    'platillos' => [],
                    'bebidas' => [],
                ];
            }

            $item = [
                'id' => $row['idPr'],
                'nombre' => $row['product'],
                'precio' => 0,
            ];

            if ($row['idC'] == 2) {
                $agrupados[$idP]['bebidas'][] = $item;
            } else {
                $agrupados[$idP]['platillos'][] = $item;
            }
        }

        foreach ($agrupados as $menu) {
            $menus[] = $menu;
        }

        return [
            'status' => 200,
            'message' => 'Menús cargados correctamente.',
            'data' => $menus,
            'row'  =>  $dataRaw
        ];
    }

    function getProducts()
    {
        $subsidiary =  $_SESSION['SUB'];

        $data = $this->getProductosExtras([$subsidiary]);

        $productos = array_map(function ($item) {
            return [
                'id' => $item['id'],
                'nombre' => $item['nombre'],
                'precio' => $item['precio'],
                'id_clasificacion' => $item['id_clasificacion'],
            ];
        }, $data);

        return [
            'status' => 200,
            'message' => 'Productos cargados correctamente.',
            'data' => $productos,
        ];
    }

    function getClassifications()
    {
        $subsidiary =  $_SESSION['SUB'];

        $data = $this->getClasificaciones([$subsidiary]);

        $clasificaciones = array_map(function ($item) {
            return [
                'id' => $item['id'],
                'nombre' => $item['nombre'],

            ];
        }, $data);

        return [
            'status' => 200,
            'message' => 'Clasificaciones cargadas correctamente.',
            'data' => $clasificaciones,
            'sub'=>$_SESSION
        ];
    }

    function addProduct()
    {
        $status = 500;
        $message = 'Error al agregar el producto personalizado.';
        $_POST['subsidiaries_id'] = $_SESSION['SUB']; // Asignar la sucursal actual
        $_POST['date_creation'] = date('Y-m-d H:i:s');

        // Validar datos requeridos
        if (empty($_POST['name']) || empty($_POST['price']) || empty($_POST['id_classification'])) {
            return [
                'status'  => $status,
                'message' => 'Faltan datos necesarios para agregar el producto.'
            ];
        }

        $data = $this->util->sql($_POST);
        // Insertar producto
        $create = $this->createProduct($data);

        if ($create == true) {
            $status = 200;
            $message = 'Producto agregado correctamente. 👌';
            return [
                'status' => $status,
                'message' => $message,
                'data' =>
                    [
                        'id' => $this->maxProduct(),
                    ]
            ];
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Traer menus de un evento específico
    function getEventMenus()
    {
        $status = 500;
        $message = 'Error al obtener los menús relacionados a este evento.';
        $id_event = $_POST['id_event'];

        // Obtener paquetes relacionados al evento
        $paquetesRaw = $this->getEventPackage([$id_event]);
        $productosRaw = $this->getEventProduct([$id_event]);

        $menus = [];
        $extras = [];

        // Agrupar paquetes por id del paquete
        $agrupados = [];
        foreach ($paquetesRaw as $row) {
            $idP = $row['package_id'];

            if (!isset($agrupados[$idP])) {
                $agrupados[$idP] = [
                    'menu' => [
                        'id' => $row['package_id'],
                        'nombre' => $row['package'],
                        'descripcion' => $row['description'],
                        'precioPorPersona' => floatval($row['price_person']),
                        'platillos' => [],
                        'bebidas' => [],
                    ],
                    'cantidadPersonas' => intval($row['quantity']),
                ];
            }

            $platillo = [
                'id' => $row['idPr'],
                'nombre' => $row['product'],
                'precio' => floatval($row['priceProduct']),
            ];

            // Clasifica como bebida o platillo por el idC (id de clasificación)
            if ($row['idC'] == 2) {
                $agrupados[$idP]['menu']['bebidas'][] = $platillo;
            } else {
                $agrupados[$idP]['menu']['platillos'][] = $platillo;
            }
        }

        // Convertir a array de valores
        foreach ($agrupados as $item) {
            $menus[] = $item;
        }

        // Formatear productos individuales (extras)
        foreach ($productosRaw as $row) {
            $extras[] = [
                'id' => $row['product_id'],
                'nombre' => $row['nombre'],
                'precio' => floatval($row['precioUnitario']),
                'cantidad' => intval($row['quantity']),
                'id_clasificacion' => $row['id_clasificacion'],
                'custom' => false,
            ];
        }

        return [
            'status' => 200,
            'message' => 'Datos cargados correctamente.',
            'menus' => $menus,
            'extras' => $extras,
        ];
    }

    // Vincular menú con evento.
    function addEventMenus()
    {
        $status  = 500;
        $message = 'Error al agregar menú.';
        $total   = $_POST['total'];
        $menus   = json_decode($_POST['menus'], true);
        $extras  = json_decode($_POST['extras'], true);

        $success = false;

        // 📦 PAQUETES
        $dataPackage = [];
        foreach ($menus as $key) {
            if (!isset($key['menu']['precioPorPersona'], $key['cantidadPersonas'], $key['menu']['id'])) continue;

            $precio = $key['menu']['precioPorPersona'] * $key['cantidadPersonas'];
            $dataPackage[] = [
                'package_id'    => $key['menu']['id'],
                'quantity'      => $key['cantidadPersonas'],
                'price'         => $precio,
                'date_creation' => date('Y-m-d H:i:s'),
                'event_id'      => $_POST['id_event'],
            ];
        }

        if (!empty($dataPackage)) {
            $addEventPackage = $this->createEventPackage($this->util->sql($dataPackage));
            if ($addEventPackage == true) {
                $success = true;
                
                // Vincular productos del paquete en evt_package_check y evt_check_products
                foreach ($menus as $menu) {
                    $package_id = $menu['menu']['id'];
                    $events_package_id = $this->maxEventPackageId();
                    
                    $result = $this->insertPackageWithProducts($events_package_id, $package_id);
                    
                    if ($result['status'] !== 200) {
                        error_log("Error al vincular productos: " . $result['message']);
                    }
                }
            }
        }

        // 🧃 EXTRAS
        $dataProducts = [];
        foreach ($extras as $key) {
            if (!isset($key['precio'], $key['cantidad'], $key['id'])) continue;

            $precio = $key['precio'] * $key['cantidad'];
            $dataProducts[] = [
                'product_id'    => $key['id'],
                'quantity'      => $key['cantidad'],
                'price'         => $precio,
                'date_creation' => date('Y-m-d H:i:s'),
                'event_id'      => $_POST['id_event'],
            ];
        }

        if (!empty($dataProducts)) {
            $addEventExtras = $this->createEventPackage($this->util->sql($dataProducts));
            if ($addEventExtras === true) {
                $success = true;
            }
        }

        // 💰 Actualizar total
        $this->updateEvent($this->util->sql([
            'total_pay' => $total,
            'id'        => $_POST['id_event'],
        ], 1));

        // ✅ Mensaje único de éxito
        if ($success) {
            $status = 200;
            $message = 'Menú(s) y/o extra(s) agregados correctamente. 🍽️✨';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    // Editar menú de evento
    function editEventMenus()
    {
        $status = 500;
        $message = 'Error al editar menú.';
        $total = $_POST['total'];
        $menus = json_decode($_POST['menus'], true);
        $extras = json_decode($_POST['extras'], true);
        $success = false;


        // Eliminar total
        $this->deleteEventPackage($this->util->sql([
            'event_id'  => $_POST['id_event'],
        ], 1));


        // 📦 PAQUETES
        $dataPackage = [];
        foreach ($menus as $key) {
            if (!isset($key['menu']['precioPorPersona'], $key['cantidadPersonas'], $key['menu']['id'])) continue;

            $precio = $key['menu']['precioPorPersona'] * $key['cantidadPersonas'];
            $dataPackage[] = [
                'package_id'    => $key['menu']['id'],
                'quantity'      => $key['cantidadPersonas'],
                'price'         => $precio,
                'date_creation' => date('Y-m-d H:i:s'),
                'event_id'      => $_POST['id_event'],
            ];
        }

        if (!empty($dataPackage)) {
            // Inserción múltiple de paquetes
            $addEventPackage = $this->createEventPackage($this->util->sql($dataPackage));
            if ($addEventPackage == true) {
                $success = true;
                
                // Vincular productos del paquete en evt_package_check y evt_check_products
                foreach ($menus as $menu) {
                    $package_id = $menu['menu']['id'];
                    $events_package_id = $this->maxEventPackageId();
                    
                    $result = $this->insertPackageWithProducts($events_package_id, $package_id);
                    
                    if ($result['status'] !== 200) {
                        error_log("Error al vincular productos en edición: " . $result['message']);
                    }
                }
            }
        }

        // 🧃 EXTRAS
        $dataProducts = [];
        foreach ($extras as $key) {
            if (!isset($key['precio'], $key['cantidad'], $key['id'])) continue;

            $precio = $key['precio'] * $key['cantidad'];
            $dataProducts[] = [
                'product_id'    => $key['id'],
                'quantity'      => $key['cantidad'],
                'price'         => $precio,
                'date_creation' => date('Y-m-d H:i:s'),
                'event_id'      => $_POST['id_event'],
            ];
        }

        if (!empty($dataProducts)) {
            // Inserción múltiple de productos
            $addEventExtras = $this->createEventPackage($this->util->sql($dataProducts));
            if ($addEventExtras == true) {
                $success = true;
            }
        }

        // 💰 Actualizar total
        $this->updateEvent($this->util->sql([
            'total_pay' => $total,
            'id'        => $_POST['id_event'],
        ], 1));


        // Agregar a bitacora.
        $events = $this-> getEventById([$_POST['id_event']]);

           $history = "Se edito el evento {$events['name_event']}";
            $this->addHistories($this->util->sql([
                'title'         => 'Evento editado ',
                'evt_events_id' => $_POST['id_event'],
                'comment'       => $history,
                'action'        => $history,
                'date_action'   => date('Y-m-d H:i:s'),
                'type'          => 'creation',
                'usr_users_id'  => $_SESSION['USR']
            ]));



        // ✅ Mensaje único de éxito
        if ($success) {
            $status = 200;
            $message = 'Menú(s) y/o extra(s) agregados correctamente. 🍽️✨';
        }

        return [
            'status'  => $status,
            'message' => $message,
            $dataPackage,
            $_SESSION['DB']
        ];
    }


    // Subeventos
    function getSubEvent()
    {
        $status = 500;
        $message = 'Error al obtener el subevento.';
        $getEvent = $this->getEventById([$_POST['id']]);

        // Separar fecha y hora de inicio y fin agregando a getEvent time_start y time_end
        $getEvent['time_start'] = date('H:i', strtotime($getEvent['date_start']));
        $getEvent['time_end'] = date('H:i', strtotime($getEvent['date_end']));
        $getEvent['date_start'] = date('Y-m-d', strtotime($getEvent['date_start']));
        $getEvent['date_end'] = date('Y-m-d', strtotime($getEvent['date_end']));

        $color = '';
        if ($getEvent['status_process_id'] == 2) {
            $color = "#856E1D";
        } else if ($getEvent['status_process_id'] == 3){
            $color = "#0E9E6E";
        } else if ($getEvent['status_process_id'] == 4){
            $color = "#EF5252";
        }

        $getEvent['color'] = $color;

        if (!empty($getEvent) && is_array($getEvent)) {
            $status = 200;
            $message = 'Subevento obtenido correctamente.';
        }

        $getSubevents = $this->getSubEventsByEventId([$_POST['id']]);

        foreach ($getSubevents as $subevent) {
            // Separar fecha y hora de inicio y fin agregando a getEvent time_start y time_end
            $subevent['time_start'] = date('H:i', strtotime($subevent['time_start']));
            $subevent['time_end'] = date('H:i', strtotime($subevent['time_end']));
            $subevent['date_start'] = date('d/m/Y', strtotime($subevent['date_start']));
            $subevent['date_end'] = date('d/m/Y', strtotime($subevent['date_end']));

            $extras = $this->getExtrasBySubEventId([$subevent['id']]);
            $lsmenu = $this->getPackagesBySubEventId([$subevent['id']]);

            // Detallado de menú
            $_menu = [];
            foreach($lsmenu as $menu) {
                $_menu[] = [
                    'idPackage'     => $menu['idPackage'],
                    'id'            => $menu['id'],
                    'name'          => $menu['name'],
                    'active'        => $menu['active'],
                    'date_creation' => $menu['date_creation'],
                    'description'   => $menu['description'],
                    'event_id'      => $menu['event_id'],
                    'package_id'    => $menu['package_id'],
                    'price'         => $menu['price'],
                    'price_person'  => $menu['price_person'],
                    'quantity'      => $menu['quantity'],
                    'subevent_id'   => $menu['subevent_id'],
                    'dishes'        => $this->getProductsPackageId([$menu['idPackage']])
                ];
            }

            $subevents[] = [
                'id'                => $subevent['id'],
                'name'              => $subevent['title'],
                'date_start'        => $subevent['date_start'],
                'time_start'        => $subevent['time_start'],
                'date_end'          => $subevent['date_end'],
                'time_end'          => $subevent['time_end'],
                'location'          => $subevent['location'],

                'quantity_people'   => $subevent['quantity_people'],
                'type'              => $subevent['type_event'],
                'total_pay'         => $subevent['total_pay'],
                'status_process_id' => $subevent['status_process_id'],
                'notes'             => $subevent['notes'],


                'color'             => $color,
                'menu'              => $_menu,
                'extras'            => $extras,
            ];
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => [
                'event'     => $getEvent,
                'subevents' => $subevents,
                'menu'      => $_menu,
                'extras'    => $extras,
            ],
        ];
    }

    // api eventos.

    function apiVentas() {


        $__row     = [];
        $idEstatus = $_POST['status'];
        $mes       = $_POST['mes'];
        $anio      = $_POST['anio'];

        // 📅 Calcular fecha inicial y final.

        $fi        = sprintf("%04d-%02d-01", $anio, $mes);
        $ultimoDia = date("t", mktime(0, 0, 0, $mes, 1, $anio));
        $ff        = sprintf("%04d-%02d-%02d", $anio, $mes, $ultimoDia);

        $sub      = 4; //
        $Sucursal = $this -> getSucursalByID([$sub]);

        $ls       = $this -> getEvents([
            'subsidiaries_id' => $Sucursal['idSucursal'],
            'fi'              => '2025-09-01',
            'ff'              => '2025-09-30',
            'status'          => 0
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
                // 'subevents_count' => count($this->getSubEventsByEventId([$key['id']])),
                'opc'             => 0
            ];
        }

        return [
            'row' => $__row,
            'cards' => $this->apiResumenVentas($__row)

        ];
    }

    function apiResumenVentas($row) {

        $totalEventos = count($row);
        $dineroEntrante = 0;

        $cotizacion = 0;
        $pendiente  = 0;
        $pagado     = 0;

        foreach ($row as $key) {
            $advancePay = $key['advancePay'] ?? 0;
            $status     = strtolower($key['status'] ?? '');

            // Total de dinero entrante
            $dineroEntrante += $advancePay;

            // Clasificación por estado
            if ($status === 1) {
                $cotizacion += $advancePay;
            } elseif ($status === 2) {
                $pendiente += $advancePay;
            } elseif ($status === 3 ) {
                $pagado += $advancePay;
            }
        }

        return [
            'eventos'        => $totalEventos,
            'sales' => $dineroEntrante,
            'details'        => [
                'cotizacion' => $cotizacion,
                'pendiente'  => $pendiente,
                'pagado'     => $pagado
            ]
        ];
    }

    // PACKAGE CHECK - GESTIÓN DE PRODUCTOS EN PAQUETES

    function insertPackageWithProducts($events_package_id, $package_id) {
        $status = 500;
        $message = 'Error al vincular productos del paquete';
        $check_id = null;
        $inserted = 0;
        
        try {
            $check_id = $this->insertPackageCheck($events_package_id);
            
            if (!$check_id) {
                return [
                    'status' => $status,
                    'message' => 'Error al crear package_check'
                ];
            }
            
            $products = $this->getProductsByPackage([$package_id]);
            
            if (empty($products)) {
                return [
                    'status' => 200,
                    'message' => 'Paquete sin productos asociados',
                    'check_id' => $check_id,
                    'products_inserted' => 0
                ];
            }
            
            foreach ($products as $product) {
                $result = $this->insertProductCheck($check_id, $product['product_id']);
                if ($result) $inserted++;
            }
            
            $status = 200;
            $message = "Se vincularon {$inserted} productos al paquete";
            
        } catch (Exception $e) {
            error_log("Error en insertPackageWithProducts: " . $e->getMessage());
            $message = 'Error: ' . $e->getMessage();
        }
        
        return [
            'status' => $status,
            'message' => $message,
            'check_id' => $check_id,
            'products_inserted' => $inserted
        ];
    }

    function getProductsCheckByPackage() {
        $status = 500;
        $message = 'Error al obtener productos del paquete';

        // obtener evt_events_package

        $events_package =  $this->getEventsPackage([
            $_POST['event_id'],
            $_POST['package_id']]
        );
        
        
        $check = $this->getPackageCheckByEventPackageId([$events_package['id']]);
        
        if (!$check) {
            return [
                'status' => 404,
                'message' => 'No se encontró registro de control'
            ];
        }
        
        $products = $this->listProductsCheckByPackageCheckId([$check['id']]);
        
        if ($products) {
            $status = 200;
            $message = 'Productos obtenidos correctamente';
        }
        
        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $products,
            $events_package
        ];
    }

    function updateProductActive() {
        $status = 500;
        $message = 'Error al actualizar estado del producto';
        
        $check_product_id = $_POST['check_product_id'];
        $active = $_POST['active'];
        
        if (!in_array($active, [0, 1], true)) {
            return [
                'status' => 400,
                'message' => 'Valor de active inválido'
            ];
        }
        
        if (!is_numeric($check_product_id)) {
            return [
                'status' => 400,
                'message' => 'ID inválido'
            ];
        }
        
        $update = $this->updateProductCheckActive($this->util->sql([
            'active' => $active,
            'id' => $check_product_id
        ], 1));
        
        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }


}



// Complementos
function status($idEstado)
{
    switch ($idEstado) {
        case 1:
            return '<span class="bg-[#9EBBDB] w-32 text-[#2A55A3] text-xs font-semibold mr-2 px-3 py-1 rounded">COTIZACIÓN</span>';
        case 2:
            return '<span class="bg-[#633112] w-32 text-[#F2C215] text-xs font-semibold mr-2 px-3 py-1 rounded">PENDIENTE</span>';
        case 3:
            return '<span class="bg-[#014737] w-32 text-[#3FC189] text-xs font-semibold mr-2 px-3 py-1 rounded">PAGADO</span>';
        case 4:
            return '<span class="bg-[#572A34] w-32 text-[#E05562] text-xs font-semibold mr-2 px-3 py-1 rounded">CANCELADO</span>';

    }
}

function formatDateTime($date, $time)
{
    if (!empty($date) && !empty($time)) {
        $datetime = DateTime::createFromFormat('Y-m-d H:i', "$date $time");
        return $datetime ? $datetime->format('Y-m-d H:i:s') : null;
    }
    return null;
}

function formatSucursal($compania, $sucursal, $numero = null)
{
    $letraCompania = strtoupper(substr(trim($compania), 0, 1));
    $letraSucursal = strtoupper(substr(trim($sucursal), 0, 1));

    $number = $numero ?? rand(1, 99);

    $formattedNumber = str_pad($number, 2, '0', STR_PAD_LEFT);

    return $letraCompania . $letraSucursal .'-'. $formattedNumber;
}


$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);
