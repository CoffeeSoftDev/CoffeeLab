let api = 'ctrl/ctrl-clientes.php';
let app, customerManager;

let udn, lsUdn, movementTypes, paymentMethods, customers;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn = data.udn;
    lsUdn = data.udn;
    movementTypes = data.movementTypes;
    paymentMethods = data.paymentMethods;

    app = new App(api, "root");
    customerManager = new CustomerManager(api, "root");
    
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "clientes";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsMovements();
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#container${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📊 Módulo de Clientes - Movimientos a Crédito</h2>
                <p class="text-gray-400">Gestiona consumos, anticipos y pagos de clientes con cuenta a crédito.</p>
            </div>
        `);

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            type: "short",
            json: [
                {
                    id: "movimientos",
                    tab: "Movimientos",
                    class: "mb-1",
                    active: true,
                    onClick: () => this.lsMovements()
                },
                {
                    id: "clientes",
                    tab: "Clientes",
                    onClick: () => customerManager.lsCustomers()
                }
            ]
        });

        $(`#content-tabs${this.PROJECT_NAME}`).removeClass('h-screen');
    }

    filterBar() {
        const container = $(`#container-movimientos`);
        container.html('<div id="filterbar-movimientos" class="mb-2"></div><div id="dashboard-cards"></div><div id="tabla-movimientos"></div>');

        this.createfilterBar({
            parent: "filterbar-movimientos",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: lsUdn,
                    onchange: 'app.lsMovements()'
                },
                {
                    opc: "select",
                    id: "movement_type",
                    lbl: "Filtrar por tipo",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Todos los movimientos" },
                        { id: "Consumo a crédito", valor: "Consumos a crédito" },
                        { id: "Anticipo", valor: "Anticipos" },
                        { id: "Pago total", valor: "Pagos totales" }
                    ],
                    onchange: 'app.lsMovements()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoMovimiento",
                    text: "Registrar nuevo movimiento",
                    onClick: () => this.addMovement()
                }
            ]
        });

        this.renderDashboard();
    }

    async renderDashboard() {
        const udn = $('#filterbar-movimientos #udn').val();
        const totals = await useFetch({
            url: api,
            data: { opc: 'getDashboardTotals', udn: udn }
        });

        this.infoCard({
            parent: "dashboard-cards",
            theme: "light",
            json: [
                {
                    title: "Total de consumos",
                    data: {
                        value: formatPrice(totals.total_consumos),
                        color: "text-[#f0ad28]"
                    }
                },
                {
                    title: "Pagos/Anticipos en efectivo",
                    data: {
                        value: formatPrice(totals.total_efectivo),
                        color: "text-[#3FC189]"
                    }
                },
                {
                    title: "Pagos/Anticipos en banco",
                    data: {
                        value: formatPrice(totals.total_banco),
                        color: "text-[#4A9EFF]"
                    }
                }
            ]
        });
    }

    lsMovements() {
        this.createTable({
            parent: "tabla-movimientos",
            idFilterBar: "filterbar-movimientos",
            data: { opc: "lsMovements" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbMovimientos",
                theme: 'corporativo',
                title: 'Lista de Movimientos',
                subtitle: 'Movimientos de crédito registrados',
                center: [1, 2],
                right: [4]
            }
        });

        this.renderDashboard();
    }

    addMovement() {
        this.createModalForm({
            id: 'formMovementAdd',
            data: { opc: 'addMovement', udn: $('#filterbar-movimientos #udn').val() },
            bootbox: {
                title: 'Nuevo Movimiento de Crédito'
            },
            json: this.jsonMovement(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsMovements();
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

        this.setupMovementFormLogic();
    }

    async editMovement(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getMovement", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message,
                btn1: true,
                btn1Text: "Ok"
            });
            return;
        }

        const movement = request.data;

        this.createModalForm({
            id: 'formMovementEdit',
            data: { opc: 'editMovement', id: id, udn: $('#filterbar-movimientos #udn').val() },
            bootbox: {
                title: 'Editar Movimiento de Crédito'
            },
            autofill: movement,
            json: this.jsonMovement(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsMovements();
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

        this.setupMovementFormLogic();
    }

    async viewDetail(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getMovement", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message,
                btn1: true,
                btn1Text: "Ok"
            });
            return;
        }

        const movement = request.data;
        const isConsumption = movement.movement_type === 'Consumo a crédito';
        const amountClass = isConsumption ? 'text-[#f0ad28]' : 'text-[#3FC189]';
        const amountPrefix = isConsumption ? '+' : '-';

        bootbox.dialog({
            title: 'Detalle del Movimiento a Crédito',
            message: `
                <div class="p-4">
                    <p class="text-sm text-gray-500 mb-4">Actualizado por última vez: ${movement.created_at}, Por: ${movement.updated_by}</p>
                    
                    <h3 class="font-bold text-lg mb-2">INFORMACIÓN DEL CLIENTE</h3>
                    <p class="mb-4"><strong>Nombre del cliente:</strong> ${movement.customer_name}</p>
                    
                    <h3 class="font-bold text-lg mb-2">DETALLES DEL MOVIMIENTO</h3>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p><strong>Tipo de movimiento:</strong></p>
                            <p>${movement.movement_type}</p>
                        </div>
                        <div>
                            <p><strong>Método de Pago:</strong></p>
                            <p>${movement.method_pay}</p>
                        </div>
                    </div>
                    
                    <h3 class="font-bold text-lg mb-2">DESCRIPCIÓN</h3>
                    <p class="mb-4">${movement.description || 'Ninguna'}</p>
                    
                    <h3 class="font-bold text-lg mb-2">RESUMEN FINANCIERO</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span>Deuda actual:</span>
                            <span class="font-bold">${formatPrice(movement.current_balance)}</span>
                        </div>
                        <div class="flex justify-between ${amountClass}">
                            <span>${movement.movement_type}:</span>
                            <span class="font-bold">${amountPrefix} ${formatPrice(movement.amount)}</span>
                        </div>
                        <div class="flex justify-between border-t pt-2">
                            <span class="font-bold">Nueva deuda:</span>
                            <span class="font-bold text-xl">${formatPrice(movement.new_balance)}</span>
                        </div>
                    </div>
                </div>
            `,
            buttons: {
                ok: {
                    label: 'Cerrar',
                    className: 'btn-primary'
                }
            }
        });
    }

    deleteMovement(id) {
        this.swalQuestion({
            opts: {
                title: "¿Está seguro?",
                text: "¿Está seguro de querer eliminar el movimiento a crédito?",
                icon: "warning"
            },
            data: { opc: "deleteMovement", id: id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                        this.lsMovements();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Ok"
                        });
                    }
                }
            }
        });
    }

    jsonMovement() {
        return [
            {
                opc: "select",
                id: "customer_id",
                lbl: "Nombre del Cliente",
                class: "col-12 mb-3",
                data: [],
                text: "name",
                value: "id",
                required: true
            },
            {
                opc: "div",
                id: "current_balance_display",
                class: "col-12 mb-3",
                html: '<div class="alert alert-info">Seleccione un cliente para ver su deuda actual</div>'
            },
            {
                opc: "select",
                id: "movement_type",
                lbl: "Tipo de movimiento",
                class: "col-12 col-md-6 mb-3",
                data: movementTypes,
                required: true
            },
            {
                opc: "select",
                id: "method_pay",
                lbl: "Forma de pago",
                class: "col-12 col-md-6 mb-3",
                data: paymentMethods,
                required: true
            },
            {
                opc: "input",
                id: "amount",
                lbl: "Cantidad",
                tipo: "cifra",
                class: "col-12 mb-3",
                required: true,
                onkeyup: "validationInputForNumber('#amount')"
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción del movimiento (opcional)",
                class: "col-12 mb-3",
                rows: 3
            }
        ];
    }

    setupMovementFormLogic() {
        const udn = $('#filterbar-movimientos #udn').val();
        
        useFetch({
            url: api,
            data: { opc: 'lsCustomers', udn: udn, active: 1 }
        }).then(response => {
            $('#customer_id').option_select({
                data: response.ls,
                text: 'name',
                value: 'id',
                placeholder: 'Seleccione un cliente'
            });
        });

        $('#customer_id').on('change', async function() {
            const customerId = $(this).val();
            if (customerId) {
                const customer = await useFetch({
                    url: api,
                    data: { opc: 'getCustomer', id: customerId }
                });
                
                if (customer.status === 200) {
                    $('#current_balance_display').html(`
                        <div class="alert alert-warning">
                            <strong>Deuda actual:</strong> ${formatPrice(customer.data.balance)}
                        </div>
                    `);
                }
            }
        });

        $('#movement_type').on('change', function() {
            const movementType = $(this).val();
            if (movementType === 'Consumo a crédito') {
                $('#method_pay').val('N/A').prop('disabled', true);
            } else {
                $('#method_pay').prop('disabled', false);
                if ($('#method_pay').val() === 'N/A') {
                    $('#method_pay').val('');
                }
            }
        });

        if ($('#movement_type').val() === 'Consumo a crédito') {
            $('#method_pay').val('N/A').prop('disabled', true);
        }
    }

    infoCard(options) {
        const defaults = {
            parent: "root",
            id: "infoCardKPI",
            class: "",
            theme: "light",
            json: [],
            data: {
                value: "0",
                description: "",
                color: "text-gray-800"
            },
            onClick: () => {}
        };
        const opts = Object.assign({}, defaults, options);
        const isDark = opts.theme === "dark";
        const cardBase = isDark
            ? "bg-[#1F2A37] text-white rounded-xl shadow"
            : "bg-white text-gray-800 rounded-xl shadow";
        const titleColor = isDark ? "text-gray-300" : "text-gray-600";
        const descColor = isDark ? "text-gray-400" : "text-gray-500";
        
        const renderCard = (card, i = "") => {
            const box = $("<div>", {
                id: `${opts.id}_${i}`,
                class: `${cardBase} p-4`
            });
            const title = $("<p>", {
                class: `text-sm ${titleColor}`,
                text: card.title
            });
            const value = $("<p>", {
                id: card.id || "",
                class: `text-2xl font-bold ${card.data?.color || "text-white"}`,
                text: card.data?.value
            });
            const description = $("<p>", {
                class: `text-xs mt-1 ${card.data?.color || descColor}`,
                text: card.data?.description
            });
            box.append(title, value, description);
            return box;
        };
        
        const container = $("<div>", {
            id: opts.id,
            class: `grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ${opts.class}`
        });
        
        if (opts.json.length > 0) {
            opts.json.forEach((item, i) => {
                container.append(renderCard(item, i));
            });
        } else {
            container.append(renderCard(opts));
        }
        
        $(`#${opts.parent}`).html(container);
    }
}

class CustomerManager extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    lsCustomers() {
        const container = $("#container-clientes");
        container.html('<div id="filterbar-clientes" class="mb-2"></div><div id="tabla-clientes"></div>');

        this.createfilterBar({
            parent: "filterbar-clientes",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: lsUdn,
                    onchange: 'customerManager.lsCustomers()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'customerManager.lsCustomers()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoCliente",
                    text: "Nuevo Cliente",
                    onClick: () => this.addCustomer()
                }
            ]
        });

        this.createTable({
            parent: "tabla-clientes",
            idFilterBar: "filterbar-clientes",
            data: { opc: "lsCustomers" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbClientes",
                theme: 'corporativo',
                title: 'Lista de Clientes',
                subtitle: 'Clientes con cuenta a crédito',
                center: [2],
                right: [1]
            }
        });
    }

    addCustomer() {
        this.createModalForm({
            id: 'formCustomerAdd',
            data: { opc: 'addCustomer' },
            bootbox: {
                title: 'Agregar Cliente'
            },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del Cliente",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "select",
                    id: "udn_id",
                    lbl: "Unidad de Negocio",
                    class: "col-12 mb-3",
                    data: lsUdn,
                    required: true
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsCustomers();
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
    }

    async editCustomer(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCustomer", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message,
                btn1: true,
                btn1Text: "Ok"
            });
            return;
        }

        const customer = request.data;

        this.createModalForm({
            id: 'formCustomerEdit',
            data: { opc: 'editCustomer', id: id },
            bootbox: {
                title: 'Editar Cliente'
            },
            autofill: customer,
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del Cliente",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "select",
                    id: "udn_id",
                    lbl: "Unidad de Negocio",
                    class: "col-12 mb-3",
                    data: lsUdn,
                    required: true
                },
                {
                    opc: "div",
                    class: "col-12",
                    html: `<div class="alert alert-info">
                        <strong>Saldo actual:</strong> ${formatPrice(customer.balance)}<br>
                        <small>El saldo solo se modifica mediante movimientos de crédito</small>
                    </div>`
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsCustomers();
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
    }

    statusCustomer(id, currentStatus) {
        const action = currentStatus === 1 ? 'desactivar' : 'activar';
        const newStatus = currentStatus === 1 ? 0 : 1;

        this.swalQuestion({
            opts: {
                title: `¿Desea ${action} este cliente?`,
                text: `Esta acción ${action === 'desactivar' ? 'impedirá nuevos movimientos' : 'permitirá nuevos movimientos'} para este cliente.`,
                icon: "warning"
            },
            data: { opc: "statusCustomer", id: id, active: newStatus },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                        this.lsCustomers();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Ok"
                        });
                    }
                }
            }
        });
    }
}
