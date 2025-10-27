let api = 'ctrl/ctrl-salidas-almacen.php';
let app;

let warehouses;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    warehouses = data.warehouses;

    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "warehouseOutputs";
    }

    render() {
        this.layout();
        this.filterBar();
        this.renderTotal();
        this.lsWarehouseOutputs();
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

        $(`#filterBar${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📦 Salidas de Almacén</h2>
                <p class="text-gray-400">Gestiona las salidas de almacén y mantén el control de inventario.</p>
            </div>
            <div id="totalSalidas" class="px-4 pb-3"></div>
        `);
    }

    filterBar() {
        const container = $(`#container${this.PROJECT_NAME}`);
        container.html('<div id="filterbar-salidas" class="mb-2 px-4"></div><div id="tabla-salidas" class="px-4"></div>');

        this.createfilterBar({
            parent: "filterbar-salidas",
            data: [
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnSubirArchivos",
                    text: "Subir archivos de almacén",
                    color_btn: "secondary",
                    onClick: () => {
                        alert({
                            icon: "info",
                            text: "Funcionalidad en desarrollo",
                            btn1: true
                        });
                    }
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevaSalida",
                    text: "Registrar nueva salida de almacén",
                    onClick: () => this.addWarehouseOutput()
                }
            ]
        });
    }

    lsWarehouseOutputs() {
        this.createTable({
            parent: "tabla-salidas",
            idFilterBar: "filterbar-salidas",
            data: { 
                opc: 'lsWarehouseOutputs'
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
                title: '📋 Lista de Salidas de Almacén',
                subtitle: 'Salidas registradas en el sistema',
                center: [0],
                right: [1]
            },
            success: (data) => {
                if (data.total !== undefined) {
                    this.updateTotal(data.total);
                }
            }
        });
    }

    jsonWarehouseOutput() {
        return [
            {
                opc: "select",
                id: "insumo_id",
                lbl: "Almacén",
                class: "col-12 col-md-6 mb-3",
                data: warehouses,
                text: "valor",
                value: "id",
                required: true,
                placeholder: "Selecciona el almacén"
            },
            {
                opc: "input",
                id: "amount",
                lbl: "Cantidad",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                required: true,
                value: "0.00",
                onkeyup: "validationInputForNumber('#amount')"
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción (opcional)",
                rows: 3,
                class: "col-12 mb-3",
                placeholder: "Escribe una breve descripción..."
            },
            {
                opc: "btn-submit",
                id: "btnGuardarSalida",
                text: "Guardar salida de almacén",
                class: "col-12 col-md-4 offset-md-8"
            }
        ];
    }

    addWarehouseOutput() {
        this.createModalForm({
            id: 'formSalidaAdd',
            data: { opc: 'addWarehouseOutput' },
            bootbox: {
                title: 'NUEVA SALIDA DE ALMACÉN',
                closeButton: true
            },
            json: this.jsonWarehouseOutput(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        title: "Salida registrada",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsWarehouseOutputs();
                    this.renderTotal();
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

    async editWarehouseOutput(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getWarehouseOutput", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: "No se pudo cargar la información de la salida",
                btn1: true
            });
            return;
        }

        const output = request.data;

        this.createModalForm({
            id: 'formSalidaEdit',
            data: { opc: 'editWarehouseOutput', id: id },
            bootbox: {
                title: 'EDITAR SALIDA DE ALMACÉN',
                closeButton: true
            },
            autofill: output,
            json: this.jsonWarehouseOutput(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        title: "Salida actualizada",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsWarehouseOutputs();
                    this.renderTotal();
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

    deleteWarehouseOutput(id) {
        const row = event.target.closest('tr');
        const almacen = row.querySelectorAll('td')[0]?.innerText || '';

        this.swalQuestion({
            opts: {
                title: `ELIMINAR SALIDA DE ALMACÉN`,
                html: `¿Esta seguro de querer eliminar la salida de almacén <strong>${almacen}</strong>?<br>
                       Esta acción no se puede deshacer.`,
                icon: "warning",
                confirmButtonText: "Continuar",
                cancelButtonText: "Cancelar"
            },
            data: { opc: "deleteWarehouseOutput", id: id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            title: "Eliminado",
                            text: response.message,
                            btn1: true
                        });
                        this.lsWarehouseOutputs();
                        this.renderTotal();
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

    async renderTotal() {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getTotalOutputs" }
        });

        if (request.status === 200) {
            this.updateTotal(request.total);
        }
    }

    updateTotal(total) {
        this.infoCard({
            parent: "totalSalidas",
            theme: "light",
            json: [
                {
                    title: "Total de salidas de almacén",
                    data: {
                        value: formatPrice(total || 0),
                        color: "text-[#103B60]"
                    }
                }
            ]
        });
    }
}
