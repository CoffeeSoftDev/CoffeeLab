let api = 'ctrl/ctrl-admin.php';
let api_cta = 'ctrl/ctrl-cuenta-venta.php';
let api_cliente = 'ctrl/ctrl-cliente.php';
let api_supplier = 'ctrl/ctrl-proveedores.php';
let api_efectivo = 'ctrl/ctrl-efectivo.php';
let api_formasPago = 'ctrl/ctrl-formasPago.php';

// vars.
let app, salesAccount, client, paymentMethod, cashMovement, supplier, formasPago;
let lsudn, udn, lsmodules;


$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsudn = data.udn;
    udn = data.udn;
    lsmodules = data.modules;

    app = new App(api, "root");
    salesAccount = new SalesAccountManager(api_cta, "root");
    supplier = new AdminSupplier(api_supplier, "root");
    client = new Clientes(api_cliente, "root");
    formasPago = new FormasPago(api_formasPago, "root");

    paymentMethod = new Efectivo(api_efectivo, "root");
    cashMovement = new CashMovement(api_efectivo, "root");



    app.render();

});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "unlockModules";
    }

    render() {

        this.layout();
        this.layoutHeader();
        this.lsModulesUnlocked();


        // initial.
        salesAccount.render();
        client.render();
        supplier.render();
        formasPago.render();
        paymentMethod.render();
    }

    layout() {

        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: 'w-full min-h-screen bg-gray-50',
            card: {
                filterBar: { class: 'w-full', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        this.layoutTabs();
    }

    layoutHeader() {
        const userName = "Usuario";
        const currentDate = moment().format('dddd, D [de] MMMM [del] YYYY');

        const header = $(`
            <div class="bg-white border-b px-6 py-4">
                <div class="flex justify-between items-center">
                    <div>
                        <button onclick="window.location.href='home.php'" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center gap-2">
                            <i class="icon-arrow-left"></i>
                            Menú principal
                        </button>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-semibold text-gray-800">Bienvenido, ${userName}</p>
                        <p class="text-sm text-gray-500">${currentDate}</p>
                    </div>
                </div>
            </div>
        `);

        $(`#filterBar${this.PROJECT_NAME}`).html(header);
    }

    layoutTabs() {
        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            type: "short",
            json: [
                {
                    id: "desbloqueo",
                    tab: "Desbloqueo de módulos",

                    onClick: () => this.lsModulesUnlocked()
                },
                {
                    id: "cta",
                    tab: "Cuenta de ventas",
                    onClick: () => salesAccount.lsSalesAccount()
                },
                {
                    id: "formasPago",
                    tab: "Formas de pago",
                    active: true,
                    onClick: () => formasPago.lsFormasPago()
                },
                {
                    id: "client",
                    tab: "Clientes",

                    onClick: () => client.lsClientes()
                },
                {
                    id: "compras",
                    tab: "Compras",
                    onClick: () => console.log("Compras")
                },
                {
                    id: "proveedores",
                    tab: "Proveedores",
                    onClick: () => supplier.lsSuppliers()
                }
            ]
        });

        $(`#container-desbloqueo`).html(`
            <div class="px-6 pt-4 pb-2">
                <h2 class="text-2xl font-semibold text-gray-800">📦 Desbloqueo de Módulos</h2>
                <p class="text-gray-500">Administración de solicitudes de apertura de módulos operativos</p>
            </div>
            <div id="filterbar-desbloqueo" class="px-6 py-3"></div>
            <div id="table-desbloqueo" class="px-6"></div>
        `);

        this.filterBarDesbloqueo();
    }

    filterBarDesbloqueo() {
        this.createfilterBar({
            parent: "filterbar-desbloqueo",
            data: [
                {
                    opc: "button",
                    class: "col-12 col-md-2",
                    id: "btnDesbloquear",
                    className: 'w-full',
                    text: "Desbloquear módulo",
                    color_btn: "primary",
                    onClick: () => this.addUnlockRequest()
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnHorarios",
                    className: 'w-full bg-orange-400 hover:bg-orange-700 text-white',

                    text: "Horario de cierre mensual",
                    color_btn: " ",
                    onClick: () => this.lsCloseTime()
                }
            ]
        });
    }

    lsModulesUnlocked() {
        this.createTable({
            parent: "table-desbloqueo",
            idFilterBar: "filterbar-desbloqueo",
            data: { opc: "lsModulesUnlocked", active: 1 },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbModulesUnlocked",
                theme: 'corporativo',
                center: [1, 2, 5, 6],
                right: []
            }
        });
    }

    addUnlockRequest() {
        this.createModalForm({
            id: 'formUnlockRequest',
            data: { opc: 'addUnlockRequest' },
            bootbox: {
                title: 'APERTURA DE MÓDULO',
                closeButton: true
            },
            json: this.jsonUnlockForm(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsModulesUnlocked();
                } else {
                    alert({
                        icon: "error",
                        title: "Error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });
    }

    jsonUnlockForm() {
        return [
            {
                opc: "input",
                id: "unlock_date",
                lbl: "Fecha solicitada",
                type: "date",
                class: "col-12 mb-3",
                required: true
            },
            {
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de negocio (UDN)",
                class: "col-12 mb-3",
                data: lsudn,
                text: "valor",
                value: "id",
                required: true
            },
            {
                opc: "select",
                id: "module_id",
                lbl: "Módulo",
                class: "col-12 mb-3",
                data: lsmodules,
                text: "valor",
                value: "id",
                required: true
            },
            {
                opc: "textarea",
                id: "lock_reason",
                lbl: "Motivo de apertura",
                class: "col-12 mb-3",
                rows: 3,
                required: true
            },

        ];
    }

    toggleLockStatus(id, active) {
        const newStatus = active === 1 ? 0 : 1;
        const action = newStatus === 1 ? "desbloquear" : "bloquear";

        this.swalQuestion({
            opts: {
                title: `¿Confirmar acción?`,
                html: `¿Deseas <b>${action} / ${newStatus} </b> este módulo?`,
                icon: "warning"
            },
            data: {
                opc: "toggleLockStatus",
                operation_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                active: newStatus,
                id: id,
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.lsModulesUnlocked();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
                            btn1: true
                        });
                    }
                }
            }
        });
    }

    // Time

    async lsCloseTime() {
        const response = await useFetch({
            url: this._link,
            data: { opc: "lsCloseTime" }
        });

        const meses = [
            { id: 1, valor: 'Enero' },
            { id: 2, valor: 'Febrero' },
            { id: 3, valor: 'Marzo' },
            { id: 4, valor: 'Abril' },
            { id: 5, valor: 'Mayo' },
            { id: 6, valor: 'Junio' },
            { id: 7, valor: 'Julio' },
            { id: 8, valor: 'Agosto' },
            { id: 9, valor: 'Septiembre' },
            { id: 10, valor: 'Octubre' },
            { id: 11, valor: 'Noviembre' },
            { id: 12, valor: 'Diciembre' }
        ];

        bootbox.dialog({
            title: 'HORA DE CIERRE MENSUAL',
            closeButton: true,
            message: `
                <div id="container-close-time" class="p-3">
                    <form id="form-close-time" novalidate></form>
                    <div id="table-close-time" class="mt-4"></div>
                </div>
            `,

        });

        this.createForm({
            parent: 'form-close-time',
            id: 'formCloseTime',
            data: { opc: 'updateCloseTime' },
            json: [
                {
                    opc: "select",
                    id: "month",
                    lbl: "Mes",
                    class: "col-12 mb-3",
                    data: meses,
                    text: "valor",
                    value: "id",
                    required: true
                },
                {
                    opc: "input",
                    id: "close_time",
                    lbl: "Horario de cierre",
                    type: "time",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "btn-submit",
                    text: "Actualizar hora de cierre",
                    class: "col-12"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsCloseTime();
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });

        $('#close_time').val('12:00');

        this.renderCloseTimeTable(response.ls);
    }

    renderCloseTimeTable(data) {
        const meses = [
            '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const rows = data.map(item => ({
            'Mes': meses[item.month],
            'Hora de cierre': `${item.close_time_formatted} hrs`
        }));

        this.createCoffeTable({
            parent: 'table-close-time',
            id: 'tbCloseTimeModal',
            theme: 'corporativo',
            data: {
                thead: ['Mes', 'Hora de cierre'],
                row: rows
            },
            center: [0, 1]
        });
    }

    editCloseTime(id, month) {
        const meses = [
            '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        this.createModalForm({
            id: 'formCloseTime',
            data: { opc: 'updateCloseTime', month: month },
            bootbox: {
                title: `Actualizar hora de cierre - ${meses[month]}`,
                closeButton: true
            },
            json: [
                {
                    opc: "input",
                    id: "close_time",
                    lbl: "Hora de cierre",
                    type: "time",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "btn-submit",
                    text: "Actualizar hora de cierre",
                    class: "col-12"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsCloseTime();
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

}
