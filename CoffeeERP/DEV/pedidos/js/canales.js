

class Canales extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Canales";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: 'w-full min-h-screen ',
            card: {
                filterBar: { class: 'w-full ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-4', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#${this.PROJECT_NAME}`).prepend(`
            <div class="px-6 pt-6 pb-4">
                <h1 class="text-3xl font-bold ">📢 Gestión de Canales</h1>
                <p class="text-gray-400 mt-2">Administración de canales de comunicación y campañas publicitarias</p>
            </div>
        `);

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            type: "short",
            json: [
                {
                    id: "canales",
                    tab: "Canales de Comunicación",
                    active: true,
                    onClick: () => {
                        this.lsCanales();
                    }
                },
            
            ]
        });

        this.filterBarCanales();
        this.lsCanales();
    }

    filterBarCanales() {
        $(`#container-canales`).html(`
            <div class="px-6 py-4">
                <div id="filterBarCanales" class="mb-4"></div>
                <div id="tablaCanales"></div>
            </div>
        `);

        this.createfilterBar({
            parent: "filterBarCanales",
            data: [
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: `canales.lsCanales()`
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNuevoCanal",
                    text: "Nuevo Canal",
                    onClick: () => this.addCanal()
                }
            ]
        });
    }

    lsCanales() {
        this.createTable({
            parent: "tablaCanales",
            idFilterBar: "filterBarCanales",
            data: { opc: "lsCanales" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbCanales",
                theme: 'dark',
                center: [2, 3]
            }
        });
    }

    addCanal() {
        this.createModalForm({
            id: 'formCanalAdd',
            data: { opc: 'addCanal' },
            bootbox: {
                title: 'Agregar Canal',
            },
            json: this.jsonCanal(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsCanales();
                } else {
                    alert({
                        icon: response.status === 409 ? "warning" : "error",
                        title: response.status === 409 ? "Canal duplicado" : "Error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

    async editCanal(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCanal", id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message,
                btn1: true
            });
            return;
        }

        this.createModalForm({
            id: 'formCanalEdit',
            data: { opc: 'editCanal', id },
            bootbox: {
                title: 'Editar Canal',
            },
            autofill: request.data,
            json: this.jsonCanal(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsCanales();
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

    statusCanal(id, active) {
        const accion = active === 1 ? "desactivar" : "activar";

        this.swalQuestion({
            opts: {
                title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} canal?`,
                text: `Esta acción ${accion === "desactivar" ? "ocultará" : "mostrará"} el canal.`,
                icon: "warning"
            },
            data: { opc: "statusCanal", active: active === 1 ? 0 : 1, id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.lsCanales();
                    }
                }
            }
        });
    }

    jsonCanal() {
        return [
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre del Canal",
                class: "col-12 mb-3"
            }
        ];
    }

    filterBarCampanas() {
        $(`#container-campanas`).html(`
            <div class="px-6 py-4">
                <div id="filterBarCampanas" class="mb-4"></div>
                <div id="tablaCampanas"></div>
            </div>
        `);

        this.createfilterBar({
            parent: "filterBarCampanas",
            data: [
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Activas" },
                        { id: "0", valor: "Inactivas" }
                    ],
                    onchange: `canales.lsCampanas()`
                },
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `canales.lsCampanas()`
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNuevaCampana",
                    text: "Nueva Campaña",
                    onClick: () => this.addCampana()
                }
            ]
        });
    }

    lsCampanas() {
        this.createTable({
            parent: "tablaCampanas",
            idFilterBar: "filterBarCampanas",
            data: { opc: "lsCampanas" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbCampanas",
                theme: 'dark',
                center: [5, 6, 7],
                right: [3, 4]
            }
        });
    }

    addCampana() {
        this.createModalForm({
            id: 'formCampanaAdd',
            data: { opc: 'addCampana' },
            bootbox: {
                title: 'Agregar Campaña',
                size: 'large'
            },
            json: this.jsonCampana(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsCampanas();
                } else {
                    alert({
                        icon: response.status === 400 ? "warning" : "error",
                        title: response.status === 400 ? "Fechas inválidas" : "Error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

    async editCampana(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCampana", id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message,
                btn1: true
            });
            return;
        }

        this.createModalForm({
            id: 'formCampanaEdit',
            data: { opc: 'editCampana', id },
            bootbox: {
                title: 'Editar Campaña',
                size: 'large'
            },
            autofill: request.data,
            json: this.jsonCampana(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsCampanas();
                } else {
                    alert({
                        icon: response.status === 400 ? "warning" : "error",
                        title: response.status === 400 ? "Fechas inválidas" : "Error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

    statusCampana(id, active) {
        const accion = active === 1 ? "desactivar" : "activar";

        this.swalQuestion({
            opts: {
                title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} campaña?`,
                text: `Esta acción ${accion === "desactivar" ? "ocultará" : "mostrará"} la campaña.`,
                icon: "warning"
            },
            data: { opc: "statusCampana", active: active === 1 ? 0 : 1, id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.lsCampanas();
                    }
                }
            }
        });
    }

    async showCampanaPerformance(id) {
        const response = await useFetch({
            url: this._link,
            data: { opc: "apiCampanaPerformance", id }
        });

        if (response.status !== 200) {
            alert({
                icon: "error",
                text: "Error al obtener métricas",
                btn1: true
            });
            return;
        }

        const data = response.data;

        bootbox.dialog({
            title: `📊 Rendimiento: ${data.nombre}`,
            size: 'large',
            message: `
                <div class="bg-gray-800 p-4 rounded-lg">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-gray-400 text-sm">Pedidos Generados</p>
                            <p class="text-2xl font-bold text-green-400">${data.pedidos}</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-gray-400 text-sm">Ingresos</p>
                            <p class="text-2xl font-bold text-blue-400">${data.ingresos}</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-gray-400 text-sm">Presupuesto</p>
                            <p class="text-2xl font-bold text-purple-400">${data.presupuesto}</p>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <p class="text-gray-400 text-sm">ROI</p>
                            <p class="text-2xl font-bold text-yellow-400">${data.roi}</p>
                        </div>
                    </div>
                    <div class="bg-gray-700 p-4 rounded-lg">
                        <p class="text-gray-400 text-sm">Total de Clics</p>
                        <p class="text-xl font-bold text-white">${data.clics}</p>
                    </div>
                </div>
            `,
            buttons: {
                ok: {
                    label: "Cerrar",
                    className: "btn-primary"
                }
            }
        });
    }

    jsonCampana() {
        return [
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre de la Campaña",
                class: "col-12 mb-3"
            },
            {
                opc: "textarea",
                id: "estrategia",
                lbl: "Estrategia",
                rows: 3,
                class: "col-12 mb-3"
            },
            {
                opc: "select",
                id: "red_social_id",
                lbl: "Red Social",
                class: "col-12 col-md-6 mb-3",
                data: redesSociales
            },
            {
                opc: "input",
                id: "presupuesto",
                lbl: "Presupuesto",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                onkeyup: "validationInputForNumber('#presupuesto')"
            },
            {
                opc: "input",
                id: "fecha_inicio",
                lbl: "Fecha de Inicio",
                type: "date",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "fecha_fin",
                lbl: "Fecha de Fin",
                type: "date",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "total_clics",
                lbl: "Total de Clics",
                tipo: "numero",
                class: "col-12 mb-3",
                required: false
            }
        ];
    }
}
