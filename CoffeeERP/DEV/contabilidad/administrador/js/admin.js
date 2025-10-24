let api = 'ctrl/ctrl-admin.php';
let app;
let lsudn, lsmodules;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsudn = data.udn;
    lsmodules = data.modules;

    app = new App(api, "root");
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
                        <button onclick="window.location.href='../../'" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center gap-2">
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
                    active: true,
                    onClick: () => this.lsModulesUnlocked()
                },
                {
                    id: "cuentaVentas",
                    tab: "Cuenta de ventas",
                    onClick: () => console.log("Cuenta de ventas")
                },
                {
                    id: "formasPago",
                    tab: "Formas de pago",
                    onClick: () => console.log("Formas de pago")
                },
                {
                    id: "clientes",
                    tab: "Clientes",
                    onClick: () => console.log("Clientes")
                },
                {
                    id: "compras",
                    tab: "Compras",
                    onClick: () => console.log("Compras")
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
                    class: "col-12 col-md-3",
                    id: "btnDesbloquear",
                    text: "Desbloquear módulo",
                    color_btn: "primary",
                    onClick: () => this.addUnlockRequest()
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnHorarios",
                    text: "Horario de cierre mensual",
                    color_btn: "secondary",
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
                title: 'Tabla de módulos desbloqueados actualmente',
                center: [1, 2, 5],
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
            {
                opc: "btn-submit",
                text: "Continuar",
                class: "col-12"
            }
        ];
    }

    toggleLockStatus(id, active) {
        const newStatus = active === 1 ? 0 : 1;
        const action = newStatus === 1 ? "desbloquear" : "bloquear";

        this.swalQuestion({
            opts: {
                title: `¿Confirmar acción?`,
                text: `¿Deseas ${action} este módulo?`,
                icon: "warning"
            },
            data: {
                opc: "toggleLockStatus",
                id: id,
                active: newStatus
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

    lsCloseTime() {
        bootbox.dialog({
            title: 'Horario de cierre mensual',
            size: 'large',
            message: `
                <div id="container-close-time">
                    <div id="filterbar-close-time" class="mb-3"></div>
                    <div id="table-close-time"></div>
                </div>
            `,
            onShown: () => {
                this.createTable({
                    parent: "table-close-time",
                    idFilterBar: "filterbar-close-time",
                    data: { opc: "lsCloseTime" },
                    coffeesoft: true,
                    conf: { datatable: false, pag: 12 },
                    attr: {
                        id: "tbCloseTime",
                        theme: 'light',
                        center: [0, 1],
                        right: [2]
                    }
                });
            }
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
