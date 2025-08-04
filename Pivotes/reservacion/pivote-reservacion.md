# Product Overview
Sistema administrativo para gestionar **reservaciones de clientes**.  
Permite registrar nuevas reservaciones, editar datos existentes, consultar detalles y aplicar filtros por estado o fecha para facilitar la organización operativa.

# key Features
- **Lista dinámica** de reservaciones con filtros por fecha y estado.
- **Formulario** para agregar y editar reservaciones.
- **Vista detallada** en modal.
- **Cancelación** de reservaciones.
- 📊 Estadísticas de estado (`Activa`, `Cancelada`, `Finalizada`).
 
 # Organization
 
 ## Reservation.js [Front JS] 
    ```javascript
    let api = 'ctrl/ctrl-reservaciones.php';

    let  app;

    let estado;

    $(async () => {
        const init = await useFetch({ url: api, data: { opc: "init" } });
        estado = init.status;
        app = new App(api, 'root');

        app.init();
        app.actualizarFechaHora();

        setInterval(() => {
            app.actualizarFechaHora();
        }, 60000);
    });

    class App extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Reservation";
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }

    layout() {
        this.primaryLayout({
        parent: "root",
        id: this.PROJECT_NAME,
        class: "flex mx-2 my-2 h-100 mt-5 p-2",
        card: {
            filterBar: { class: "w-full my-3 ", id: "filterBar" },
            container: {
            class: "w-full my-3 bg-[#1F2A37] h-[calc(100vh)] rounded p-3",
            id: "container" + this.PROJECT_NAME,
            },
        },
        });
        // Filter bar.
        $("#filterBar").html(`
                <div id="filterBar${this.PROJECT_NAME}" class="w-full my-3 " ></div>
                <div id="containerHours"></div>
            `);
    }

    filterBar() {
        this.createfilterBar({
        parent: `filterBar${this.PROJECT_NAME}`,
        data: [
            {
            opc: "input-calendar",
            class: "col-sm-3",
            id: "calendar",
            lbl: "Consultar fecha: ",
            },

            {
            opc: "select",
            id: "selectStatusPedido",
            class: "col-sm-3",
            onchange: "app.ls()",
            data: [{ id: "", valor: "Todos los estados" }, ...estado],
            },

            {
            opc: "button",
            id: "btnNuevoPedido",
            class: "col-sm-2",
            text: "Nueva Reservación",
            className: "btn-danger w-100",
            onClick: () => this.addReservation(),
            },

            {
            opc: "button",
            className: "w-100",
            class: "col-sm-2",
            color_btn: "secondary",
            id: "btnCalendario",
            text: "Calendario",
            onClick: () => {
                this.ls();
                // window.location.href = '/dev/calendario/'
            },
            },
        ],
        });

        dataPicker({
        parent: "calendar",
        rangepicker: {
            startDate: moment().startOf("month"), // Inicia con el primer día del mes actual
            endDate: moment().endOf("month"), // Finaliza con el último día del mes actual
            showDropdowns: true,
            ranges: {
            "Mes actual": [moment().startOf("month"), moment().endOf("month")],
            "Semana actual": [moment().startOf("week"), moment().endOf("week")],
            "Próxima semana": [
                moment().add(1, "week").startOf("week"),
                moment().add(1, "week").endOf("week"),
            ],
            "Próximo mes": [
                moment().add(1, "month").startOf("month"),
                moment().add(1, "month").endOf("month"),
            ],
            "Mes anterior": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
            ],
            },
        },
        onSelect: (start, end) => {
            this.ls();
        },
        });
    }

    actualizarFechaHora(options) {
        let fecha = new Date();
        let opciones = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        parent: "containerHours",
        label: "",
        };
        let opts = Object.assign({}, opciones, options);
        let fechaFormateada = fecha.toLocaleString("es-ES", opts);

        let div = $("<div>", {
        class: "flex justify-between border-b border-gray-300 mt-2 mb-3",
        }).append(
        $("<label>", {
            text: opts.label,
            class: "text-uppercase text-start font-semibold mb-2",
        }),
        $("<label>", {
            text: fechaFormateada,
            class: "text-uppercase text-end font-semibold mb-2",
        })
        );

        $(`#${opts.parent}`).html(div);
    }

    // reservation

    ls() {
        let rangePicker = getDataRangePicker("calendar");

        this.createTable({
        parent: `container${this.PROJECT_NAME}`,
        idFilterBar: `filterBar${this.PROJECT_NAME}`,
        data: { opc: "lsReservation", fi: rangePicker.fi, ff: rangePicker.ff },
        conf: { datatable: true, pag: 10 },
        coffeesoft: true,

        attr: {
            id: `tb${this.PROJECT_NAME}`,
            theme: "dark",
            center: [1, 2, 4, 5, 7, 8, 9],
            right: [6],
            extends: true,
        },
        });
    }


    layoutReservation() {

        this.primaryLayout({
        parent: "root",
        id: this.PROJECT_NAME,
        class: "flex mx-2 my-2 h-100 mt-5 p-2",
        card: {
            filterBar: {
            class: "w-full my-3 ",
            id: "filterBar" + this.PROJECT_NAME,
            },
            container: {
            class: "w-full my-3 bg-[#1F2A37] h-[calc(100vh)] p-3 rounded",
            id: "container" + this.PROJECT_NAME,
            },
        },
        });


    }

    addReservation() {

        this.layoutReservation()

        $("#container" + this.PROJECT_NAME).html(
        `<div><form id="formAddReservacion" novalidate></form></div>`
        );

        $("#formAddReservacion").prepend(`
        <div class="px-2 pt-3 pb-3">
        <h2 class="text-2xl font-semibold text-white">📆 Nueva Reservación</h2>
        <p class="text-gray-400"></p>
        </div>`);


        this.createForm({
        id: "formAddReservacion",
        data: { opc: "addReservation" },
        parent: "formAddReservacion",
        json: this.jsonReservacion(),

        success: (response) => {
            if (response.status === 200) {
            alert({
                icon: "success",
                title: "Reservación creada",
                text: response.message,
                btn1: true,
                btn1Text: "Ok",
            });

            app.render();
            app.actualizarFechaHora();
            } else {
            alert({
                icon: "error",
                text: response.message,
                btn1: true,
                btn1Text: "Ok",
            });
            }
        },
        });

        $("#date_start").val(new Date().toISOString().split("T")[0]);
        $("#phone").on("input", function () {
        let value = $(this).val().replace(/\D/g, ""); // Solo números
        if (value.length > 10) value = value.slice(0, 10);
        $(this).val(value);
        });

        $("#lblCliente").addClass("border-b p-1");
        $("#lblEvento").addClass("border-b p-1");
    }

    async editReservation(id) {

        this.layoutReservation();

        $("#container" + this.PROJECT_NAME).html(
            `<div><form id="formEditReservacion" novalidate></form></div>`
        );

        $("#formEditReservacion").prepend(`
        <div class="px-2 pt-3 pb-3">
        <h2 class="text-2xl font-semibold text-white">📆 Editar Reservación</h2>
        <p class="text-gray-400"></p>
        </div>`);

        const req = await useFetch({ opc: "get", id });
        const data = req?.data ?? {};

        this.createForm({
        id      : "formEditRes",
        parent  : 'formEditReservacion',
        data    : { opc: "edit", id },
        autofill: data,
        json    : this.jsonReservacion(),
        success : (response) => {
            if (response.status === 200) {
            alert({
                icon: "success",
                title: "Actualizado",
                text: response.message,
                btn1: true,
                btn1Text: "Ok",
            });
            this.ls();
            } else {
            alert({
                icon: "error",
                text: response.message,
                btn1: true,
                btn1Text: "Ok",
            });
            }
        },
        });

        $("#lblCliente").addClass("border-b p-1");
        $("#lblEvento").addClass("border-b p-1");


    }

    async viewReservation(id) {
        const res = await useFetch({ url: this._link, data: { opc: "getReservation", id: id }});
        const data = res.data;

        const html = `
                <div class="p-3 text-white">
                    <h5 class="text-xl font-bold">📅 ${data.name_event}</h5>
                    <p><b>Cliente:</b> ${data.name_client} | <b>Tel:</b> ${data.phone}</p>
                    <p><b>Locación:</b> ${data.location} | <b>Fecha:</b> ${data.date_start} ${data.time_start}</p>
                    <p><b>Total:</b> $${data.total_pay} | <b>Correo:</b> ${data.email}</p>
                    <p><b>Notas:</b> ${data.notes}</p>
                </div>`;

        bootbox.dialog({
        closeButton:true,
        title: "Detalle de Reservación",
        message: html,
        size: "large",
        });
    }

    cancelReservation(id) {
        const row = event.target.closest('tr');
        const folio = row.querySelectorAll('td')[0]?.innerText || '';

        this.swalQuestion({
            opts: {
                title: `¿Esta seguro?`,
                html: `¿Deseas cancelar el pedido con folio <strong>${folio}</strong>?
                    Esta acción actualizará el estado a "Cancelado" en la tabla [reservaciones].`,
            },
            data: { opc: "cancelReservation", status_reservation_id: 4, id: id },
            methods: {
                request: (data) => {
                    alert({
                        icon: "success",
                        title: "Cancelado",
                        text: "El pedido fue cancelado exitosamente.",
                        btn1: true
                    });

                    this.ls();
                },
            },
        });
    }

    jsonReservacion() {
        return [
        {
            opc: "label",
            text: "Datos del Cliente",
            id: "lblCliente",
            class: "col-12 fw-bold text-lg mb-2",
        },
        {
            opc: "input",
            lbl: "Contacto",
            id: "name_client",
            class: "col-12 col-sm-4 col-lg-3 mb-3",
            tipo: "texto",
            placeholder: "Nombre del contacto",
        },
        {
            opc: "input",
            lbl: "Teléfono",
            id: "phone",
            class: "col-12 col-sm-4 col-lg-3",
            tipo: "tel",
            placeholder: "999-999-9999",
        },
        {
            opc: "input",
            lbl: "Correo electrónico",
            id: "email",
            class: "col-12 col-sm-4 col-lg-3",
            tipo: "email",
            placeholder: "cliente@gmail.com",
        },

        {
            opc: "label",
            text: "Datos de la Reservación",
            id: "lblEvento",
            class: "col-12 fw-bold text-lg mt-2 mb-2",
        },
        {
            opc: "input",
            lbl: "Nombre",
            id: "name_event",
            class: "col-12 col-sm-4 col-lg-3",
            tipo: "texto",
            placeholder: "Nombre de la reservación",
        },
        {
            opc: "input",
            lbl: "Locación",
            id: "location",
            class: "col-12 col-sm-4 col-lg-3 mb-3",
            tipo: "texto",
            placeholder: "Locación",
        },
        {
            opc: "input",
            lbl: "Fecha de inicio",
            id: "date_start",
            class: "col-12 col-sm-4 col-lg-3",
            type: "date",
        },

        {
            opc: "input",
            lbl: "Hora de inicio",
            id: "time_start",
            tipo: "hora",
            type: "time",
            class: "col-12 col-sm-4 col-lg-3 mb-3",
            required:false
        },

        {
            opc: "input",
            lbl: "Total a pagar",
            id: "total_pay",
            tipo: "cifra",
            class: "col-12 col-sm-4 col-lg-3 mb-3",
            required:false
        },
        {
            opc: "textarea",
            lbl: "Observaciones",
            id: "notes",
            class: "col-12 col-sm-12 col-md-12 col-lg-12",
            rows: 3,
        },
        // 📏 Botones
        {
            opc: "btn-submit",
            id: "btnGuardar",
            text: "Guardar",
            class: "col-5 col-sm-2 col-md-2 col-lg-2 offset-lg-8",
        },
        {
            opc: "button",
            id: "btnCancelar",
            text: "Cancelar",
            class: "col-6 col-sm-2 col-md-2 col-lg-2",
            color_btn: "danger",
            className: "w-full",
            onClick: () => {

                app.render()
                app.actualizarFechaHora();
            }
        },
        ];
    }
    }


    ```

 ## ctrl-reservation.php [ctrl]
 ```php

    <?php
    session_start();
    if (empty($_POST['opc'])) exit(0);
    require_once '../mdl/mdl-reservaciones.php';

    header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
    header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos


    class Pedidos extends MPedidos{

        function init(){
            return [
                'status' => $this->lsEstatus()
            ];
        }

        // Reservations.
        function lsReservation() {
            $__row = [];

            $idEstatus = $_POST['status'];
            $fi        = $_POST['fi'];
            $ff        = $_POST['ff'];
            $sub       = $_SESSION['SUB'];

            $Sucursal  = $this->getSucursalByID([$sub]);

            $ls = $this->listReservations([
                'subsidiaries_id' => $Sucursal['idSucursal'],
                'fi'              => $fi,
                'ff'              => $ff,
                'status'          => 1
            ]);

            foreach ($ls as $key) {
                $date_creation = formatSpanishDate($key['date_creation'], 'normal');
                $Folio         = formatSucursal($Sucursal['name'], $Sucursal['sucursal'], $key['id']);

                $__row[] = [
                    'id'       => $key['id'],
                    'folio'    => $Folio,
                    'Creación' => $date_creation,
                    'Cliente'  => [
                        'html' => "<p class='text-gray-300'>{$key['name_event']}</p>
                                <p class='text-gray-500'>{$key['name_client']}</p>",
                    ],

                    'Fecha de evento' => formatSpanishDate($key['date_start'], 'normal'),

                    'Horario'         => $key['hours_start'],
                    'Total'           => [
                        "html"  => evaluar($total),
                        "class" => "text-end bg-[#283341]"
                    ],
                    'Ubicación' => $key['location'],
                    'Estado'    => status($key['estado']),
                    'dropdown'  => dropdown($key['id'], $key['estado'])
                ];
            }

            return [
                "row" => $__row,
                'ls'  => $ls,
                $_SESSION['SUB'],
                'id'  => $Sucursal['idSucursal'],
            ];
        }

        function getReservation() {
            $status = 500;
            $message = 'Error al obtener datos';

            $get = $this->getReservationById([$_POST['id']]);

            if ($get) {
                $status = 200;
                $message = 'Datos obtenidos correctamente';
            }

            return [
                'status' => $status,
                'message' => $message,
                'data' => $get
            ];

        }

        function addReservation() {

            $status  = 500;
            $message = 'Error al crear la reservación';

            $date_start = formatDateTime($_POST['date_start'], $_POST['time_start']);
            unset($_POST['time_start']);

            $_POST['date_start']        = $date_start;
            $_POST['date_creation']     = date('Y-m-d H:i:s');
            $_POST['subsidiaries_id']   = $_SESSION['SUB'];
            $_POST['category_id']       = 2;
            $_POST['status_process_id'] = 1;

            $create = $this->createReservation($this->util->sql($_POST));

            if ($create) {

                $status  = 200;
                $message = 'Reservación creada exitosamente';
            }

            return [
                'status'  => $status,
                'message' => $message
            ];

        }

        function editReservation() {
            $status  = 500;
            $message = 'Error al actualizar la reservación';

            $update = $this->update($this->util->sql($_POST, 1));

            if ($update) {
                $status  = 200;
                $message = 'Reservación actualizada correctamente';
            }

            return [
                'status'  => $status,
                'message' => $message,
            ];
        }

        function cancelReservation(){
            $status  = 500;
            $message = 'Error al cancelar el evento.';

            $update = $this->updateReservation($this->util->sql($_POST, 1));

            if ($update) {
                $status  = 200;
                $message = 'Reservación cancelada correctamente.';
            }

            return [
                'status'  => $status,
                'message' => $message,
            ];
        }

    }


    // Complements.
    function dropdown($id, $status) {

        $instancia = 'app';

        $options = [
            ['Ver', 'icon-eye', "{$instancia}.viewReservation({$id})"],
            ['Editar', 'icon-pencil', "{$instancia}.editReservation({$id})"],
            ['Cancelar', 'icon-block-1', "{$instancia}.cancelReservation({$id})"],
            ['Imprimir', 'icon-print', "{$instancia}.printReservation({$id})"],
        ];

        if ($status == 2) { // Cancelado
            $options = [
                ['Ver', 'icon-eye', "{$instancia}.viewReservation({$id})"],
                ['Imprimir', 'icon-print', "{$instancia}.printReservation({$id})"],
            ];
        } elseif ($status == 3) { // Pagado
            $options = [
                ['Ver', 'icon-eye', "{$instancia}.viewReservation({$id})"],
            ];
        }

        return array_map(fn($opt) => [
            'text' => $opt[0],
            'icon' => $opt[1],
            'onclick' => $opt[2],
        ], $options);
    }

    function status($idEstado) {
        $estados = [
            1 => ['bg' => '#EBD9FF', 'text' => '#6B3FA0', 'label' => 'RESERVACIÓN'], // Lila
            2 => ['bg' => '#B9FCD3', 'text' => '#032B1A', 'label' => 'Show'],         // Verde
            3 => ['bg' => '#E5E7EB', 'text' => '#374151', 'label' => 'No Show'],      // Gris
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



    $obj    = new Pedidos();
    $fn     = $_POST['opc'];

    $encode = [];
    $encode = $obj->$fn();
    echo json_encode($encode);

 ```

 ## mdl-reservation.php[mdl]

 ```php
    <?php
    require_once('../../conf/_CRUD.php');
    require_once('../../conf/_Utileria.php');

    class MPedidos extends CRUD {
        protected $util;
        protected $bd;

        public function __construct() {
            $this->util = new Utileria;
            $this->bd   = 'fayxzvov_coffee.';
        }

        // Init.
        public function lsEstatus() {
            return $this->_Select([
                'table' => "{$this->bd}reservation_status",
                'values' => "id , name as valor",
                'where' => "active =1",
            ]);
        }

        function getSucursalByID($array){
            $query = "SELECT
                fayxzvov_alpha.subsidiaries.id AS idSucursal,
                fayxzvov_admin.companies.id AS idCompany,
                fayxzvov_admin.companies.social_name as name,
                fayxzvov_alpha.subsidiaries.`name` as sucursal
            FROM
                fayxzvov_alpha.subsidiaries
            INNER JOIN fayxzvov_admin.companies ON fayxzvov_alpha.subsidiaries.companies_id = fayxzvov_admin.companies.id
            where subsidiaries.id = ?";
            return $this->_Read($query, $array)[0];
        }

        // Reservations.
        function listReservations($array){

            $values = [
                'reservation.id AS id',
                'name_event',
                'name_client',
                "DATE_FORMAT(date_creation,'%Y-%m-%d') AS date_creation",
                'date_start',
                "DATE_FORMAT(date_start,'%H:%i hrs') as hours_start",
                'date_end',
                'total_pay',
                'notes',
                'status_process.status',
                'location',
                'advanced_pay',
                'phone',
                'discount',
                'email',
                'status_reservation_id as estado',
                'status_process_id AS idStatus',
            ];

            $innerjoin = [
                $this->bd.'status_process' => 'reservation.status_process_id = status_process.id',
            ];

            $where = ['subsidiaries_id = ? AND date_creation BETWEEN ? AND ? '];

            // FILTROS POR ESTADO

            if ( $array['status'] == '0') unset($array['status']);
            else $where[] = 'status_process_id = ? and category_id = 2';


            return $this->_Select([

                'table'     => "{$this->bd}reservation",
                'values'    => $values,
                'innerjoin' => $innerjoin,
                'where'     => $where,
                'order'     => ['ASC' => 'status_process.id','DESC' => 'reservation.date_creation'],
                'data'      => array_values($array),

            ]);

        }

        public function getReservationById($array) {
            return $this->_Select([
                'table' => "{$this->bd}reservation",
                'values' => "*",
                'where' => "id = ?",
                'data' => $array
            ])[0];
        }

        public function createReservation($array) {
            return $this->_Insert([
                'table'  => "{$this->bd}reservation",
                'values' => $array['values'],
                'data'   => $array['data']
            ]);
        }

        public function updateReservation($array) {
            return $this->_Update([
                'table'  => "{$this->bd}reservation",
                'values' => $array['values'],
                'where'  => $array['where'],
                'data'   => $array['data']
            ]);
        }


    }

 ```