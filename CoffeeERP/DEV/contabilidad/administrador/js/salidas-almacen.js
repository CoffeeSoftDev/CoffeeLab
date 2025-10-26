let api = 'ctrl/ctrl-salidas-almacen.php';
let warehouseOutput;
let warehouses, lsudn;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    warehouses = data.warehouses;
    lsudn = data.udn;

    warehouseOutput = new AdminWarehouseOutput(api, "root");
    warehouseOutput.render();
});

class AdminWarehouseOutput extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "WarehouseOutput";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsWarehouseOutputs();
    }

    layout() {
        this.primaryLayout({
            parent: `container-salidas-almacen`,
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full mb-3', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#container${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📦 Salidas de Almacén</h2>
                <p class="text-gray-400">Administra las salidas de almacén del sistema.</p>
            </div>
        `);
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de negocio",
                    class: "col-12 col-md-3",
                    data: lsudn,
                    onchange: 'warehouseOutput.lsWarehouseOutputs()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activas" },
                        { id: "0", valor: "Eliminadas" }
                    ],
                    onchange: 'warehouseOutput.lsWarehouseOutputs()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnUploadFiles",
                    text: "📁 Subir archivos de almacén",
                    color_btn: "success",
                    onClick: () => this.uploadFiles()
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnAddOutput",
                    text: "+ Registrar nueva salida",
                    color_btn: "primary",
                    onClick: () => this.addWarehouseOutput()
                }
            ]
        });
    }

    async lsWarehouseOutputs() {
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const active = $(`#filterBar${this.PROJECT_NAME} #active`).val();

        const totalData = await useFetch({
            url: api,
            data: { opc: 'getTotalOutputs', udn: udn }
        });

        $(`#container${this.PROJECT_NAME}`).find('.px-4').after(`
            <div class="mx-4 mb-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Total de salidas de almacén</span>
                    <span class="text-2xl font-bold text-green-700">$ ${this.formatPrice(totalData.total)}</span>
                </div>
            </div>
        `);

        this.createTable({
            parent: `containerWarehouseOutput`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsWarehouseOutputs', udn: udn, active: active },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
                center: [0],
                right: [1]
            }
        });
    }

    addWarehouseOutput() {
        this.createModalForm({
            id: 'formWarehouseOutputAdd',
            data: { opc: 'addWarehouseOutput' },
            bootbox: {
                title: '📦 Nueva Salida de Almacén',
                closeButton: true
            },
            json: this.jsonWarehouseOutput(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsWarehouseOutputs();
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

    async editWarehouseOutput(id) {
        const request = await useFetch({
            url: api,
            data: { opc: "getWarehouseOutput", id: id }
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

        const output = request.data;

        this.createModalForm({
            id: 'formWarehouseOutputEdit',
            data: { opc: 'editWarehouseOutput', id: output.id },
            bootbox: {
                title: '✏️ Editar Salida de Almacén',
                closeButton: true
            },
            autofill: output,
            json: this.jsonWarehouseOutput(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsWarehouseOutputs();
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

    deleteWarehouseOutput(id) {
        this.swalQuestion({
            opts: {
                title: "¿Está seguro de querer eliminar la salida de almacén?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning"
            },
            data: {
                opc: "deleteWarehouseOutput",
                id: id
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                        this.lsWarehouseOutputs();
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

    uploadFiles() {
        alert({
            icon: "info",
            text: "Funcionalidad de carga de archivos en desarrollo",
            btn1: true,
            btn1Text: "Ok"
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
                placeholder: "Selecciona el almacén"
            },
            {
                opc: "input",
                id: "amount",
                lbl: "Cantidad",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                placeholder: "0.00",
                onkeyup: "validationInputForNumber('#amount')"
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción (opcional)",
                rows: 3,
                class: "col-12 mb-3",
                placeholder: "Escribe una breve descripción",
                required: false
            }
        ];
    }

    formatPrice(amount) {
        return new Intl.NumberFormat('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
}
