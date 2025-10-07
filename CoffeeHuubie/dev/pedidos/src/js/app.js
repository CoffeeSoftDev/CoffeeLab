
let api = 'ctrl/ctrl-pedidos.php';
let api_catalogo = 'ctrl/ctrl-pedidos-catalogo.php';
let api_custom = 'ctrl/ctrl-pedidos-personalizado.php';

let normal, app, custom; //Clases.
let idFolio;
let categories, estado, clients;

$(async () => {
    let dataModifiers = await useFetch({ url: api, data: { opc: "getModifiers" } });
    categories = dataModifiers.data || [];

    const req     = await useFetch({ url: api, data: { opc: "init" } });
          estado  = req.status;
          clients = req.clients || [];
          app     = new App(api, 'root');
          custom  = new CustomOrder(api_custom, 'root');
          normal  = new CatalogProduct(api_catalogo, 'root');

    app.render();
    app.actualizarFechaHora();

    // idFolio = 25;
    // app.editOrder(idFolio);

    setInterval(() => {
        app.actualizarFechaHora();
    }, 60000);
});

class App extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Pedidos";
    }

    render() {
        this.layout();
        this.createFilterBar();
        this.ls();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: 'flex mx-2 my-2 p-2',
            heightPreset: 'viewport', // Usa el preset estándar
            card: {
                filterBar: { class: 'w-full my-3 ', id: 'filterBar' },
                container: { class: 'w-100 h-full my-3 bg-[#1F2A37] rounded p-3', id: 'container' + this.PROJECT_NAME }
            }
        });

        // Filter bar.
        $('#filterBar').html(`
            <div id="filterBar${this.PROJECT_NAME}" class="w-full my-3 " ></div>
            <div id="containerHours"></div>
        `);
    }

    createFilterBar() {
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
                    id: "status",
                    lbl: "Seleccionar estados:",
                    class: "col-sm-3",
                    onchange: "app.ls()",
                    data: [
                        { id: "", valor: "Todos los estados" },
                        ...estado

                    ]
                },

                {
                    opc: 'button',
                    id: 'btnNuevoPedido',
                    class: 'col-sm-2',
                    text: 'Nuevo Pedido',
                    className: 'btn-primary w-100',
                    onClick: () => this.showTypePedido()
                },

                {
                    opc: "button",
                    className: "w-100",
                    class: "col-sm-2",
                    color_btn: "secondary",
                    id: "btnCalendario",
                    text: "Calendario",
                    onClick: () => {
                        this.ls()
                        // window.location.href = '/dev/calendario/'
                    }
                },

            ]
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
                    "Próxima semana": [moment().add(1, "week").startOf("week"), moment().add(1, "week").endOf("week")],
                    "Próximo mes": [moment().add(1, "month").startOf("month"), moment().add(1, "month").endOf("month")],
                    "Mes anterior": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
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

    showTypePedido() {
        normal.render();
    }

    // Orders.
    ls() {
        let rangePicker = getDataRangePicker("calendar");
        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "listOrders", fi: rangePicker.fi, ff: rangePicker.ff },
            conf: { datatable: true, pag: 10 },
            coffeesoft: true,

            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'dark',
                center: [1, 2, 7, 8, 9, 10, 11],
                extends: true,
            },
        });
    }

    addOrder() {
        $("#container-pedido").html(`<form id="formCreatePedido" novalidate></form>`);

        this.createForm({
            parent: "formCreatePedido",
            id: "formPedido",
            data: { opc: "addOrder" },
            json: this.jsonOrder(),

            success: (response) => {
                if (response.status == 200) {

                    alert({
                        icon: "success",
                        title: "Pedido creado con éxito",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });

                    idFolio = response.id;
                    normal.layoutPos();


                    // 🔵 Activar la pestaña "Catálogo de productos"
                    setTimeout(() => {
                        $("#tab-package")
                            .attr("data-state", "active")
                            .addClass("bg-blue-600 text-white")
                            .removeClass("text-gray-300 hover:bg-gray-700")
                            .trigger("click"); // 👈 simula el click real

                        $("#tab-pedido")
                            .attr("data-state", "inactive")
                            .removeClass("bg-blue-600 text-white")
                            .addClass("text-gray-300 hover:bg-gray-700");
                    }, 300);

                    // 🔒 Bloquear todos los campos después de guardar
                    $("#formPedido :input, #formPedido textarea").prop("disabled", true);


                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });

        // render.

        $("#date_order").val(new Date().toISOString().split("T")[0]);
        $("#date_birthday").val(new Date().toISOString().split("T")[0]);

        const ahora = new Date();
        const hora = ahora.toTimeString().split(":").slice(0, 2).join(":");
        $("#time_order").val(hora);

        $("#lblCliente").addClass("border-b p-1");
        $("#lblPedido").addClass("border-b p-1");

        $("#phone").on("input", function () {
            let value = $(this).val().replace(/\D/g, ""); // Elimina caracteres no numéricos
            if (value.length > 10) {
                value = value.slice(0, 10); // Limita a 10 dígitos
            }
            $(this).val(value);
        });


        $('#formPedido #name').autocomplete({
            source: clients.map(client => ({
                label: client.name,   // lo que se muestra en el dropdown
                phone: client.phone,  // extra
                email: client.email   // extra
            })),
            select: function (event, ui) {
                $('#formPedido #phone').val(ui.item.phone);
                $('#formPedido #email').val(ui.item.email);
            }
        });

        // 🔄 Si borra el nombre, limpiar teléfono y correo
        $('#formPedido #name').on("input", function () {
            if ($(this).val().trim() === "") {
                $('#formPedido #phone').val("");
                $('#formPedido #email').val("");
            }
        });


    }

    async editOrder(id) {
        idFolio = id;
        normal.render();
        $("#container-pedido").html(`<form id="formEditPedido" novalidate></form>`);



        const request = await useFetch({
            url: this._link,
            data: { opc: "getOrder", id }
        });

        const order = request.data;


        this.createForm({
            parent: "formEditPedido",
            id: "formPedido",
            data: { opc: "editOrder", id },
            autofill: order,
            json: this.jsonOrder(),
            success: (response) => {
                if (response.status == 200) {
                    alert({
                        icon: "success",
                        title: "Pedido actualizado",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });



                    // 🔒 Bloquear campos tras guardar
                    $("#formPedido :input, #formPedido textarea").prop("disabled", true);

                    // 🔵 Mostrar pestaña Catálogo de productos
                    setTimeout(() => {
                        $("#tab-package")
                            .attr("data-state", "active")
                            .addClass("bg-blue-600 text-white")
                            .removeClass("text-gray-300 hover:bg-gray-700")
                            .trigger("click");

                        $("#tab-pedido")
                            .attr("data-state", "inactive")
                            .removeClass("bg-blue-600 text-white")
                            .addClass("text-gray-300 hover:bg-gray-700");
                    }, 250);

                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });

        if (!$("#date_order").val()) $("#date_order").val(new Date().toISOString().split("T")[0]);
        if (!$("#date_birthday").val()) $("#date_birthday").val(new Date().toISOString().split("T")[0]);

        const ahora = new Date();
        const hora = ahora.toTimeString().split(":").slice(0, 2).join(":");
        if (!$("#time_order").val()) $("#time_order").val(hora);

        $("#lblCliente").addClass("border-b p-1");
        $("#lblPedido").addClass("border-b p-1");

        $("#phone").on("input", function () {
            let value = $(this).val().replace(/\D/g, "");
            if (value.length > 10) value = value.slice(0, 10);
            $(this).val(value);
        });
    }

    cancelOrder(id) {
        const row = event.target.closest('tr');
        const folio = row.querySelectorAll('td')[0]?.innerText || '';

        this.swalQuestion({
            opts: {
                title: `¿Esta seguro?`,
                html: `¿Deseas cancelar la reservación con folio <strong>${folio}</strong>?
                Esta acción actualizará el estado a "Cancelado" en la tabla [reservaciones].`,
            },
            data: { opc: "cancelOrder", status: 4, id: id },
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

    async printOrder(id) {

        const pos = await useFetch({
            url: api_catalogo,
            data: { opc: "getOrder", id: id }
        });

        const modal = bootbox.dialog({
            closeButton: true,
            title: ` <div class="flex items-center gap-2 text-white text-lg font-semibold">
                        <i class="icon-print text-blue-400 text-xl"></i>
                        Imprimir
                    </div>`,
            message: `<div id="containerPrintOrder"></div>`
        });


        normal.ticketPasteleria({
            parent: 'containerPrintOrder',
            data: {
                head: pos.order,
                products: pos.products,
                paymentMethods: [
                    { method_pay: "Tarjeta", pay: 200 },
                    { method_pay: "Efectivo", pay: 100 }
                ]
            }
        })

    }

    jsonOrder() {
        return [
            {
                opc: "label",
                id: "lblCliente",
                text: "Información del cliente",
                class: "col-12 fw-bold text-lg mb-2  p-1"
            },
            {
                opc: "input",
                lbl: "Nombre del cliente",
                id: "name",
                tipo: "texto",
                class: "col-12 col-sm-6 col-lg-3 mb-3"
            },
            {
                opc: "input",
                lbl: "Teléfono",
                id: "phone",
                tipo: "tel",
                class: "col-12 col-sm-6 col-lg-3 mb-3"
            },
            {
                opc: "input",
                lbl: "Correo electrónico",
                id: "email",
                tipo: "email",
                class: "col-12 col-sm-6 col-lg-3 mb-3",
                required: false
            },

            {
                opc: "input",
                lbl: "Fecha de cumpleaños",
                id: "date_birthday",
                type: "date",
                class: "col-12 col-sm-6 col-lg-3 mb-3"
            },

            {
                opc: "label",
                id: "lblPedido",
                text: "Datos del pedido",
                class: "col-12 fw-bold text-lg  mb-2 p-1"
            },


            {
                opc: "input",
                lbl: "Fecha de entrega",
                id: "date_order",
                type: "date",
                class: "col-12 col-lg-3 mb-3"
            },

            {
                opc: "input",
                lbl: "Hora de entrega",
                id: "time_order",
                type: "time",
                class: "col-12  col-lg-3 mb-3"
            },



            {
                opc: "textarea",
                id: "note",
                lbl: "Notas adicionales",
                rows: 3,
                class: "col-12 mb-3"
            },



            {
                opc: "btn-submit",
                id: "btnGuardarPedido",
                text: "Guardar Pedido",
                class: "col-12  offset-md-8 offset-lg-6 col-md-2 col-lg-3 "
            },
            {
                opc: "button",
                id: "btnRegresar",
                text: "Salir",
                class: "col-12 col-lg-3 col-md-2 ",
                className: 'w-full',
                icono: "fas fa-arrow-left",
                color_btn: "danger",
                onClick: () => this.render()
            },
        ];

    }

    // Payments.

    async historyPay(id) {

        const data = await useFetch({ url: this._link, data: { opc: 'initHistoryPay', id } });
        const order = data.order;

        // Modal con información mejorada
        bootbox.dialog({
            title: `
                <div class="flex items-center gap-3">
                  
                    <div>
                        <h2 class="text-lg font-semibold text-white">Gestión de Pagos</h2>
                        <p class="text-sm text-gray-400">
                            <i class="icon-doc-text-1"></i> Folio: ${order.folio} | 
                            <i class="icon-calendar-1"></i> Creado: ${order.formatted_date_order || order.date_order}
                        </p>
                    </div>
                </div>
            `,
            id: 'modalAdvance',
            closeButton: true,

            message: '<div id="containerChat"></div>'
        });

        this.tabLayout({
            parent: 'containerChat',
            theme: 'dark',
            class: '',
            json: [
                { id: 'payment', tab: 'Registrar Pago', icon: 'icon-plus-circled', active: true },
                { id: 'listPayment', tab: 'Historial de Pagos', icon: 'icon-list', onClick: () => { } },
            ]
        });

        // Renders     
        $('#container-listPayment').html(`
            <div id="container-info-payment"></div>
            <div id="container-methodPay"></div>
        `);

        this.addPayment(order, id);
        this.renderResumenPagos(data.details);
        this.lsPay(id);

    }

    async addPayment(order, id) {
        // Totales base
        this.totalPay = order.total_pay;
        this.totalPaid = order.total_paid;

        const saldoOriginal = order.total_pay;
        const saldoRestante = order.total_pay - order.total_paid;
        const isPaidInFull = saldoRestante <= 0;

        // Contenedor del formulario centrado y reducido
        $("#container-payment").html(`
            <div class="flex justify-center items-start">
                <div class="w-full">
                    <form id="form-payment" novalidate></form>
                </div>
            </div>
        `);

        this.createForm({
            id: "formRegisterPayment",
            parent: "form-payment",
            data: {
                opc: "addPayment",
                total: order.total_pay,
                saldo: saldoRestante,
                id: id
            },
            json: [
                {
                    opc: "div",
                    id: "Amount",
                    class: "col-12",
                    html: `
                    <div id="dueAmount" class="p-4 rounded-xl ${isPaidInFull ? 'bg-green-900/30 border border-green-500' : 'bg-[#1E293B]'} text-white text-center">
                        <p class="text-sm opacity-80">${isPaidInFull ? 'Pedido pagado completamente' : 'Monto restante a pagar'}</p>
                        <p id="SaldoEvent" class="text-2xl font-bold mt-1">
                            ${formatPrice(saldoRestante)}
                        </p>
                        ${isPaidInFull ? '<i class="icon-ok-circled text-green-400 text-2xl mt-2"></i>' : ''}
                    </div>`
                },
                {
                    opc: "input",
                    type: "number",
                    id: "advanced_pay",
                    lbl: "Importe",
                    class: "col-12 mb-3",
                    placeholder: "0.00",
                    required: true,
                    min: 0,
                    onkeyup: "app.updateTotal()",
                    disabled: isPaidInFull
                },
                {
                    opc: "select",
                    id: "method_pay_id",
                    lbl: "Método de pago",
                    class: "col-12 mb-3",
                    data: [
                        { id: "1", valor: "Efectivo" },
                        { id: "2", valor: "Tarjeta" },
                        { id: "3", valor: "Transferencia" }
                    ],
                    required: true,
                    disabled: isPaidInFull
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Observación",
                    class: "col-12 mb-3",
                    disabled: isPaidInFull
                },
                {
                    opc: "btn-submit",
                    id: "btnSuccess",
                    class: "col-12",
                    text: isPaidInFull ? "Pedido Pagado" : "Registrar Pago",
                    disabled: isPaidInFull
                }
            ],
            success: async (response) => {
                if (response.status === 200) {

                    const data = response.data;

                    // ✅ Alert con cierre automático
                    alert({
                        icon: "success",
                        text: "Pago registrado correctamente ✅",
                        timer: 1000
                    });

                    // Refrescar pagos y vista general
                    this.lsPay(id);
                    this.ls();
                    this.renderResumenPagos(data.details);

                    // Recalcular saldo restante sin redibujar
                    const order = data.order;
                    const restante2 = order.total_pay - order.total_paid;
                    this.totalPay = order.total_pay;
                    this.totalPaid = order.total_paid;

                    // Verificar si se pagó completamente
                    if (restante2 <= 0) {
                        // Recargar el formulario para mostrar estado pagado
                        this.addPayment(order, id);
                    } else {
                        $("#SaldoEvent").text(formatPrice(restante2));
                        $("#advanced_pay").val("");
                        $("#description").val("");
                        app.updateTotal();
                    }

                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }

            }
        });

        // Aplicar estilos disabled si está pagado
        if (isPaidInFull) {
            setTimeout(() => {
                $("#advanced_pay, #method_pay_id, #description, #btnSuccess").prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
            }, 100);
        }
    }

    deletePay(id, idFolio) {
        const row = event.target.closest("tr");
        const raw = row.cells[2].textContent;
        const clean = raw.replace(/[^\d.-]/g, "");
        const amount = parseFloat(clean);

        this.swalQuestion({
            opts: {
                title: "¿Confirmar eliminación?",
                text: `Se eliminará el pago de ${formatPrice(amount)} de forma permanente.`,
                icon: "warning"
            },
            data: { opc: "deletePay", id: idFolio, idPay: id },
            methods: {
                success: (res) => {
                    const data = res.initHistoryPay;

                    if (res.status === 200) {
                        // Actualizar resumen y lista de pagos
                        this.renderResumenPagos(data.details);
                        this.lsPay(idFolio);
                        this.ls();

                        // Actualizar el formulario con el nuevo saldo
                        const order = data.order;
                        const restante = order.total_pay - order.total_paid;

                        // Actualizar totales
                        this.totalPay = order.total_pay;
                        this.totalPaid = order.total_paid;

                        // Recargar el formulario para reflejar el nuevo estado
                        this.addPayment(order, idFolio);

                        // Mostrar mensaje de éxito
                        alert({
                            icon: "success",
                            text: "Pago eliminado correctamente. Saldo actualizado.",
                            timer: 2000
                        });
                    } else {
                        alert({ icon: "error", text: res.message });
                    }
                }
            }
        });
    }

    async lsPay(id) {
        // Obtener los pagos primero para verificar si existen
        const response = await useFetch({
            url: this._link,
            data: { opc: 'listPayment', id: id }
        });

        // Verificar si hay pagos
        if (!response.row || response.row.length === 0) {
            // Mostrar mensaje cuando no hay pagos
            $("#container-methodPay").html(`
                <div class="flex flex-col items-center justify-center py-12 text-center">
                    <div class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <i class="icon-money text-gray-400 text-3xl"></i>
                    </div>
                    <p class="text-gray-400 text-lg font-semibold mb-2">Aún no se ha realizado ningún abono</p>
                    <p class="text-gray-500 text-sm">Los pagos registrados aparecerán aquí</p>
                </div>
            `);
            return;
        }

        // Si hay pagos, mostrar la tabla
        this.createTable({
            parent: "container-methodPay",
            idFilterBar: "filterBarEventos",
            data: { opc: 'listPayment', id: id },
            conf: { datatable: false, pag: 8 },
            coffeesoft: true,

            attr: {
                id: "tableOrder",
                theme: 'dark',
                center: [1, , 3, 6, 7],
                right: [4,],
                extends: true,
            },
        });

    }

    renderResumenPagos(totales) {
        const totalPagado = totales?.pagado ?? 0;
        const discount = totales?.discount ?? 0;
        const totalEvento = totales?.total ?? 0;

        // El total sin descuento es el total actual + lo descontado
        const totalConDescuento = totalEvento - discount;
        const restante = totalConDescuento - totalPagado;

        // Formateador de moneda
        const fmt = (n) => n.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        });

        let originalHTML = `<p class="text-lg font-bold text-blue-900" id="totalEvento">${formatPrice(totalEvento)}</p>`;

        // Si hay descuento, mostrar desglose visual
        if (discount > 0) {
            originalHTML = `
            <p class="text-lg font-bold text-blue-900" id="totalEvento">${fmt(totalConDescuento)}</p>
            <p class="text-sm text-gray-400 line-through -mt-1">${fmt(totalEvento)}</p>
            <p class="text-sm text-blue-700 mt-1">
                <i class="icon-tag"></i> Descuento:
                <span class="font-semibold">${fmt(discount)}</span>
            </p>
        `;
        }



        $('#container-info-payment').html(`
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            <div class="bg-green-100 p-4 rounded-lg text-center shadow">
                <p class="text-sm text-green-700">Total Pagado</p>
                <p class="text-lg font-bold text-green-900" id="totalPagado">${fmt(totalPagado)}</p>
            </div>

            <div class="bg-blue-100 p-4 rounded-lg text-center shadow">
                <p class="text-sm text-blue-700">Total</p>
                ${originalHTML}
            </div>

            <div class="bg-red-100 p-4 rounded-lg text-center shadow">
                <p class="text-sm text-red-700">Restante</p>
                <p class="text-lg font-bold text-red-900" id="totalRestante">${fmt(restante)}</p>
            </div>

        </div>
    `);
    }

    renderOrderInfo(order) {
        const html = `
            <div class="space-y-4">
                <!-- Información del Cliente -->
                <div class="bg-[#1F2A37] rounded-lg p-4">
                    <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                        <i class="icon-user text-blue-400"></i>
                        Información del Cliente
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="flex items-center gap-3">
                            <i class="icon-user-1 text-gray-400"></i>
                            <div>
                                <p class="text-gray-400 text-xs">Nombre:</p>
                                <p class="text-white font-semibold">${order.name || 'N/A'}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <i class="icon-phone text-gray-400"></i>
                            <div>
                                <p class="text-gray-400 text-xs">Teléfono:</p>
                                <p class="text-white font-semibold">${order.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <i class="icon-mail text-gray-400"></i>
                            <div>
                                <p class="text-gray-400 text-xs">Correo:</p>
                                <p class="text-white font-semibold">${order.email || 'N/A'}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <i class="icon-birthday text-gray-400"></i>
                            <div>
                                <p class="text-gray-400 text-xs">Cumpleaños:</p>
                                <p class="text-white font-semibold">${order.date_birthday || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detalles del Pedido -->
                <div class="bg-[#1F2A37] rounded-lg p-4">
                    <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                        <i class="icon-doc-text text-blue-400"></i>
                        Detalles del Pedido
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="flex items-center gap-3">
                            <i class="icon-doc-text-1 text-gray-400"></i>
                            <div>
                                <p class="text-gray-400 text-xs">Folio:</p>
                                <p class="text-white font-semibold">${order.folio || 'N/A'}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <i class="icon-calendar text-gray-400"></i>
                            <div>
                                <p class="text-gray-400 text-xs">Fecha de Entrega:</p>
                                <p class="text-white font-semibold">${order.formatted_date_order || order.date_order || 'N/A'}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <i class="icon-clock text-gray-400"></i>
                            <div>
                                <p class="text-gray-400 text-xs">Hora de Entrega:</p>
                                <p class="text-white font-semibold">${order.time_order || 'N/A'}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <i class="icon-money text-gray-400"></i>
                            <div>
                                <p class="text-gray-400 text-xs">Total:</p>
                                <p class="text-white font-semibold">${formatPrice(order.total_pay)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Observaciones -->
                ${order.note ? `
                <div class="bg-[#1F2A37] rounded-lg p-4">
                    <h3 class="text-white font-semibold mb-2 flex items-center gap-2">
                        <i class="icon-doc-text text-blue-400"></i>
                        Observaciones
                    </h3>
                    <div class="bg-[#28324c] rounded p-3 text-gray-300">
                        ${order.note}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        $('#order-details-info').html(html);
    }

    // Show Order.

    async showOrder(orderId) {
        const response = await useFetch({
            url: this._link,
            data: { opc: 'getOrderDetails', id: orderId }
        });

        const modal = bootbox.dialog({
            title: `
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <i class=" icon-birthday text-white text-sm"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold text-white">Pedido</h2>
                    </div>
                </div>
            `,
            message: '<div id="orderDetailsContainer" class="  m-3 min-h-[400px]"></div>',
            size: 'small',
            closeButton: true,
            className: 'order-details-modal-dialog'
        });

        this.tabLayout({
            parent: "orderDetailsContainer",
            id: "orderDetailsTabs",
            theme: "dark",
            type: "large",
            renderContainer: true,
            content: { class: "p-2" },
            json: [
                {
                    id: "details",
                    tab: "Detalles del pedido",
                },
                {
                    id: "order",
                    tab: "Pedido",
                    active: true,
                }
            ]
        });

        setTimeout(() => {
            this.renderOrderDetails({ json: response.data.order });
            this.renderOrder(response.data);
        }, 100);

        $("<style>").text(`
            .order-details-modal-dialog .modal-dialog {
                max-width: 800px !important;
                width: 90vw !important;
            }
            .order-details-modal-dialog .modal-body {
                padding: 0 !important;
            }
        `).appendTo("head");

        return modal;
    }

    renderOrderDetails(options) {
        const defaults = {
            parent: "container-details",
            json: {
                folio: "P-0028",
                name: "Cliente",
                formatted_date_order: "15/09/2025",
                date_order: "",
                time_order: "10:00 AM",
                note: "Sin observaciones",
                total_pay: 0,
                total_paid: 0,
                discount: 0,
                balance: 0,
            },
        };

        const opts = Object.assign({}, defaults, options);
        const d = opts.json;

        const html = `
        <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
                <div class="flex items-center gap-3">
                <i class="icon-doc-text-1 text-gray-400"></i>
                <div>
                    <p class="text-gray-400 text-sm">Folio:</p>
                    <p class="text-white font-semibold">${d.folio}</p>
                </div>
                </div>
                <div class="flex items-center gap-3">
                <i class="icon-user-1 text-gray-400"></i>
                <div>
                    <p class="text-gray-400 text-sm">Nombre:</p>
                    <p class="text-white font-semibold">${d.name}</p>
                </div>
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex items-center gap-3">
                <i class="icon-calendar text-gray-400"></i>
                <div>
                    <p class="text-gray-400 text-sm">Fecha del pedido:</p>
                    <p class="text-white font-semibold">${d.formatted_date_order || d.date_order}</p>
                </div>
                </div>
                <div class="flex items-center gap-3">
                <i class="icon-clock text-gray-400"></i>
                <div>
                    <p class="text-gray-400 text-sm">Hora de entrega:</p>
                    <p class="text-white font-semibold">${d.time_order}</p>
                </div>
                </div>
            </div>
            </div>

            <div class="bg-[#283341] rounded-lg p-3">
            <p class="text-gray-400 text-sm mb-2">Observación:</p>
            <p class="text-gray-300">${d.note ?? ''}</p>
            </div>

            <div class="bg-[#283341] rounded-lg p-3">
            <h3 class="text-white font-semibold mb-3">Resumen</h3>
            <div class="grid grid-cols-3 md:grid-cols-3 gap-3">
                <div class="text-center">
                <p class="text-gray-400 text-sm">Total</p>
                <p class="text-white font-bold">$${parseFloat(d.total_pay).toFixed(2)}</p>
                </div>
                <div class="text-center">
                <p class="text-gray-400 text-sm">Pagado</p>
                <p class="text-green-400 font-bold">$${parseFloat(d.total_paid).toFixed(2)}</p>
                </div>
               
                <div class="text-center">
                <p class="text-gray-400 text-sm">Saldo</p>
                <p class="text-red-400 font-bold">$${parseFloat(d.balance).toFixed(2)}</p>
                </div>
            </div>
            </div>
        </div>`;

        $(`#${opts.parent}`).html(html);
    }

    renderOrder(data) {
        const orderData = data.order || {};
        const products = data.products || [];
        const payments = data.payments || [];

        const orderHtml = `
            <div class="space-y-4">
                <div class="">
                    <h3 class="text-white font-semibold mb-3">Productos del Pedido</h3>
                    <div id="container-products" class="space-y-3 max-h-96 overflow-y-auto"></div>
                </div>
            </div>
        `;

        $('#container-order').html(orderHtml);

        this.orderProductList({
            parent: "container-products",
            json: products
        });
    }

    orderProductList(options) {
        const defaults = {
            parent: "container-products",
            json: []
        };

        const opts = Object.assign({}, defaults, options);

        const totalItems = opts.json.reduce((acc, item) => acc + parseInt(item.quantity || 1), 0);

        if (!opts.json || opts.json.length === 0) {
            $(`#${opts.parent}`).html(`
            <div class="text-center py-8">
                <i class="icon-basket text-gray-500 text-3xl mb-2"></i>
                <p class="text-gray-400">No hay productos en este pedido</p>
            </div>
        `);
            return;
        }

        let productsHtml = `
        <div class="text-right text-gray-300 font-semibold mb-3">
            Total de productos: ${totalItems}
        </div>
    `;

        opts.json.forEach(product => {
            const total = parseFloat(product.price || 0) * parseInt(product.quantity || 1);
            // Detect custom products: if is_custom is true, apply purple theme and show "personalizado" label
            const isCustomProduct = product.is_custom === true;

            const hasImage = product.image && product.image.trim() !== '';
            let imageContent;

            if (isCustomProduct) {
                imageContent = `<div class="w-full h-full flex items-center justify-center bg-purple-500">
                    <i class="icon-birthday text-purple-200 text-3xl"></i>
                </div>`;
            } else {
                imageContent = hasImage
                    ? `<img src="${product.image.startsWith('http') ? product.image : `https://huubie.com.mx/${product.image}`}" 
                         alt="${product.name}" 
                         class="object-cover w-full h-full"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="w-full h-full items-center justify-center hidden">
                        <i class="icon-birthday text-gray-500 text-2xl"></i>
                    </div>`
                    : `<div class="w-full h-full flex items-center justify-center">
                        <i class="icon-birthday text-gray-500 text-2xl"></i>
                   </div>`;
            }

            let thumbnailsHtml = '';
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                thumbnailsHtml = '<div class="flex gap-2 mt-2 flex-wrap">';
                product.images.forEach(img => {
                    let thumbUrl = img.path.startsWith('http') ? img.path : `https://huubie.com.mx/${img.path}`;
                    thumbnailsHtml += `
                    <div class="w-20 h-20 rounded overflow-hidden bg-[#1F2A37] cursor-pointer hover:border-blue-500 transition-colors">
                        <img src="${thumbUrl}" alt="${img.original_name || 'Imagen'}" 
                             class="object-cover w-full h-full"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="w-full h-full items-center justify-center hidden">
                            <i class="icon-picture text-gray-500 text-sm"></i>
                        </div>
                    </div>
                `;
                });
                thumbnailsHtml += '</div>';
            }


            productsHtml += `
            <div class="bg-[#283341] rounded-lg p-3 space-y-2">
                <div class="flex gap-4">
                    <!-- 📷 Imagen principal -->
                    <div class="w-40 h-40 rounded-md overflow-hidden bg-[#1F2A37] flex-shrink-0">
                        ${imageContent}
                    </div>

                    <!-- 🧾 Info + totales -->
                    <div class="flex-1 flex justify-between">
                        <!-- Info textual -->
                        <div class="flex-1">
                            <h4 class="text-white font-semibold text-lg uppercase mb-1">${product.name || 'Producto sin nombre'}</h4>
                            ${isCustomProduct ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-600 text-purple-100 mb-2"><i class="icon-magic mr-1"></i>personalizado</span>' : ''}
                            <p class="text-blue-400 font-medium mb-1">$${parseFloat(product.price || 0).toFixed(2)}</p>

                            ${product.dedication ? `
                                <div class="mb-1">
                                    <span class="text-gray-400 text-sm">Dedicatoria:</span>
                                    <p class="text-gray-300">${product.dedication}</p>
                                </div>
                            ` : ''}

                            ${product.order_details ? `
                                <div class="mb-1">
                                    <span class="text-gray-400 text-sm">Detalles:</span>
                                    <p class="text-gray-300">${product.order_details}</p>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Cantidad y Total -->
                        <div class="flex flex-col justify-between items-end ml-4">
                            <div class="flex items-center gap-2">
                                <span class="text-gray-400 text-sm">Cantidad:</span>
                                <span class="bg-[#1F2A37] text-white px-3 py-1 rounded-md font-medium">${product.quantity || 1}</span>
                            </div>

                            <div class="text-right mt-auto">
                                <div class="text-gray-400 text-sm mb-1">Total:</div>
                                <div class="text-white font-bold text-xl">$${total.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ➗ Línea divisora + Thumbnails abajo -->
                <div class="border-t border-gray-700 pt-3">
                    ${thumbnailsHtml}
                </div>
            </div>
        `;
        });

        $(`#${opts.parent}`).html(productsHtml);
    }

    // 


    // Components.
    detailCard(options = {}) {
        const defaults = {
            parent: "body",
            title: "",
            subtitle: "",
            class: "space-y-2",
            data: [],
        };

        const opts = Object.assign({}, defaults, options);

        const isCols2 = opts.class.includes("cols-2");
        let contentClass = isCols2
            ? `grid grid-cols-2 ${opts.class.replace("cols-2", "")}`
            : `flex flex-col ${opts.class}`;

        let infoHtml = `<div class="${contentClass}">`;

        opts.data.forEach(item => {
            if (item.type === "div") {
                infoHtml += `<div class="${item.class || ''}">${item.html || ''}</div>`;
            } else if (item.type === "status") {
                infoHtml += `
                <div class="flex items-center mb-1">
                    <span class="text-gray-400 font-medium flex items-center text-base">
                        ${item.icon ? `<i class="${item.icon} mr-2"></i>` : ""}
                        ${item.text}:
                    </span>
                    <span class="ml-2 px-3 py-1 rounded-full text-xs font-bold ${item.color || "bg-gray-500"}">${item.value}</span>
                </div>
            `;
            } else if (item.type === "observacion") {
                infoHtml += `
                <div class="col-span-2 mt-2">
                    <label class="text-gray-400 font-medium text-base mb-1 block">${item.text || "Observación"}:</label>
                    <div class="bg-[#28324c] rounded p-3 text-gray-300 min-h-[80px]">${item.value || ""}</div>
                </div>
            `;
            } else {
                infoHtml += `
                <div class="flex items-center mb-1">
                    <span class="text-gray-400 font-medium flex items-center text-base">
                        ${item.icon ? `<i class="${item.icon} mr-2"></i>` : ""}
                        ${item.text}:
                    </span>
                    <span class="ml-2 font-semibold text-white text-base">${item.value}</span>
                </div>
            `;
            }
        });

        infoHtml += `</div>`;

        const html = `
        <div class="text-white rounded-xl p-3 min-w-[320px]">
            ${infoHtml}
        </div>
    `;

        $(`#${opts.parent}`).html(html);
    }

 
    updateTotal(total, totalPaid) {
        const val = parseFloat($("#advanced_pay").val()) || 0;
        const t = typeof total === 'number' ? total : (this.totalPay || 0);
        const tp = typeof totalPaid === 'number' ? totalPaid : (this.totalPaid || 0);
        const restante = (t - (tp || 0)) - val;
        const btn = $("#btnSuccess");
        const display = $("#SaldoEvent");
        if (display && display.length) {
            display.text(formatPrice(restante < 0 ? 0 : restante));
        }
        if (restante < 0) {
            btn.prop("disabled", true).addClass("opacity-50 cursor-not-allowed");
        } else {
            btn.prop("disabled", false).removeClass("opacity-50 cursor-not-allowed");
        }
    }
}

class Order extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Pedidos";
    }

  

    // Payments.

    addPayment(id) {

        let tr = $(event.target).closest("tr");

        // Obtiene la celda de la cantidad (columna 5)
        let saldo = tr.find("td").eq(5).text();
        let saldoOriginal = tr.find("td").eq(5).text().replace(/[^0-9.-]+/g, "");
        let total = parseFloat(saldoOriginal);

        this.createModalForm({
            id: "modalRegisterPayment",
            bootbox: { title: "Registrar Pago", id: "registerPaymentModal", size: "medium" },
            data: { opc: 'addPayment', total: total, evt_events_id: id },
            json: [
                {
                    opc: "input",
                    type: "number",
                    id: "pay",
                    lbl: "Pago",
                    class: "col-12 mb-3",
                    placeholder: "$ 0",
                    required: true,
                    min: 0, // 📛 Evita valores negativos desde el input
                    onkeyup: 'payment.updateSaldoEvent(' + saldoOriginal + ')'
                },
                {
                    opc: "select",
                    id: "type",
                    lbl: "Tipo de pago",
                    class: "col-12 mb-3",
                    data: [
                        { id: "2", valor: "Anticipo" },
                        { id: "1", valor: "Abono" },

                    ],
                    required: true
                },


                {
                    opc: "select",
                    id: "method_pay_id",
                    lbl: "Método de pago",
                    class: "col-12 mb-3",
                    data: [
                        { id: "1", valor: "Efectivo" },
                        { id: "2", valor: "Tarjeta" },
                        { id: "3", valor: "Transferencia" }
                    ],
                    required: true
                },
                {
                    opc: "div",
                    id: "dueAmount",
                    class: "col-12 text-center bg-gray-800 text-white p-2 rounded",
                    html: `<strong>Adeudado</strong><br> <span id="SaldoEvent">${saldo}</span>`
                }
            ],
            success: (response) => {
                if (response.status == 200) {
                    alert({ icon: "success", text: response.message, btn1: true, btn1Text: "Ok" });
                    app.ls();
                } else {
                    alert({ icon: "error", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });

        $("#btnSuccess").addClass("text-white");
        $("#btnExit").addClass("text-white");
    }

    updateSaldoEvent(saldo) {
        let payInput = document.getElementById("pay");
        let saldoElement = document.getElementById("SaldoEvent");
        let pagarBtn = document.querySelector(".bootbox .btn-primary");

        if (payInput && saldoElement && pagarBtn) {
            let saldoOriginal = parseFloat(saldo) || 0;
            let pago = parseFloat(payInput.value) || 0;

            // ⛔ Bloquear si el valor es negativo
            if (pago < 0) {
                payInput.value = 0;
                pago = 0;
            }

            let nuevoSaldo = saldoOriginal - pago;

            saldoElement.textContent = formatPrice(nuevoSaldo);

            if (nuevoSaldo < 0) {
                saldoElement.classList.add("text-danger");
            } else {
                saldoElement.classList.remove("text-danger");
            }

            pagarBtn.disabled = nuevoSaldo < 0 || pago <= 0;
        }
    }

}


