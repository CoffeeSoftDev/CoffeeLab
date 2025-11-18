let api = 'ctrl/ctrl-salidas.php';
let app;
let udn, productos;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn = data.udn;
    productos = data.productos;

    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "salidas";
    }

    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }

    layout() {
        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full mb-3', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-sm-3",
                    data: udn,
                    onchange: "app.ls()"
                },
                {
                    opc: "input-calendar",
                    class: "col-sm-4",
                    id: "calendar",
                    lbl: "Rango de Fechas"
                },
                {
                    opc: "button",
                    class: "col-sm-2",
                    id: "btnBuscar",
                    text: "Buscar",
                    onClick: () => this.ls()
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNuevaSalida",
                    text: "Nueva Salida",
                    onClick: () => this.addSalida()
                }
            ]
        });

        dataPicker({
            parent: "calendar",
            onSelect: () => this.ls()
        });
    }

    ls() {
        const rangePicker = getDataRangePicker("calendar");

        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📤 Salidas de Productos</h2>
                <p class="text-gray-400">Registro de salidas y mermas</p>
            </div>
            <div id="tabla-salidas"></div>
        `);

        this.createTable({
            parent: 'tabla-salidas',
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'ls', fi: rangePicker.fi, ff: rangePicker.ff },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbSalidas',
                theme: 'corporativo',
                title: 'Lista de Salidas',
                subtitle: 'Salidas registradas en el sistema',
                center: [1, 3, 6]
            }
        });
    }

    addSalida() {
        this.createModalForm({
            id: 'formSalidaAdd',
            data: { opc: 'addSalida' },
            bootbox: {
                title: 'Registrar Salida',
                closeButton: true
            },
            json: [
                {
                    opc: "select",
                    id: "id_udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 mb-3",
                    data: udn,
                    text: "valor",
                    value: "id",
                    required: true
                },
                {
                    opc: "select",
                    id: "id_producto",
                    lbl: "Producto",
                    class: "col-12 mb-3",
                    data: productos,
                    text: "valor",
                    value: "id",
                    required: true
                },
                {
                    opc: "input",
                    id: "cantidad",
                    lbl: "Cantidad",
                    tipo: "numero",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "select",
                    id: "motivo",
                    lbl: "Motivo",
                    class: "col-12 mb-3",
                    data: [
                        { id: "Merma", valor: "Merma" },
                        { id: "Cortesía", valor: "Cortesía" },
                        { id: "Degustación", valor: "Degustación" },
                        { id: "Otro", valor: "Otro" }
                    ],
                    required: true
                },
                {
                    opc: "textarea",
                    id: "observaciones",
                    lbl: "Observaciones",
                    class: "col-12 mb-3",
                    rows: 3
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editSalida(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getSalida", id: id }
        });

        if (request.status === 200) {
            const salida = request.data;

            this.createModalForm({
                id: 'formSalidaEdit',
                data: { opc: 'editSalida', id: salida.id },
                bootbox: {
                    title: 'Editar Salida',
                    closeButton: true
                },
                autofill: salida,
                json: [
                    {
                        opc: "select",
                        id: "id_udn",
                        lbl: "Unidad de Negocio",
                        class: "col-12 mb-3",
                        data: udn,
                        text: "valor",
                        value: "id",
                        required: true
                    },
                    {
                        opc: "select",
                        id: "id_producto",
                        lbl: "Producto",
                        class: "col-12 mb-3",
                        data: productos,
                        text: "valor",
                        value: "id",
                        required: true
                    },
                    {
                        opc: "input",
                        id: "cantidad",
                        lbl: "Cantidad",
                        tipo: "numero",
                        class: "col-12 mb-3",
                        required: true
                    },
                    {
                        opc: "select",
                        id: "motivo",
                        lbl: "Motivo",
                        class: "col-12 mb-3",
                        data: [
                            { id: "Merma", valor: "Merma" },
                            { id: "Cortesía", valor: "Cortesía" },
                            { id: "Degustación", valor: "Degustación" },
                            { id: "Otro", valor: "Otro" }
                        ],
                        required: true
                    },
                    {
                        opc: "textarea",
                        id: "observaciones",
                        lbl: "Observaciones",
                        class: "col-12 mb-3",
                        rows: 3
                    }
                ],
                success: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "info", title: "Oops!...", text: response.message });
                    }
                }
            });
        } else {
            alert({ icon: "error", text: request.message });
        }
    }

    statusSalida(id, active) {
        const accion = active === 1 ? 'desactivar' : 'activar';
        
        this.swalQuestion({
            opts: {
                title: `¿Desea ${accion} esta salida?`,
                text: "Esta acción cambiará el estado del registro.",
                icon: "warning"
            },
            data: {
                opc: "statusSalida",
                activo: active === 1 ? 0 : 1,
                id: id
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "info", title: "Oops!...", text: response.message });
                    }
                }
            }
        });
    }
}
