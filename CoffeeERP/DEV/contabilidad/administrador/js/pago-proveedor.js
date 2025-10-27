let api = 'ctrl/ctrl-pago-proveedor.php';
let app, lsProveedores, lsTipoPago;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsProveedores = data.proveedores;
    lsTipoPago = data.tipoPago;

    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "PagoProveedor";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsPagos();
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

        $(`#filterBar${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3 border-b">
                <h2 class="text-2xl font-semibold">💰 Pagos a Proveedor</h2>
                <p class="text-gray-400">Gestiona los pagos realizados a proveedores</p>
            </div>
        `);
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "tipoPago",
                    lbl: "Tipo de Pago",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Todos" },
                        ...lsTipoPago
                    ],
                    onchange: 'app.lsPagos()'
                },
                {
                    opc: "input-calendar",
                    class: "col-12 col-md-4",
                    id: "calendar" + this.PROJECT_NAME,
                    lbl: "Fecha de pago"
                },
                {
                    opc: "button",
                    class: "col-12 col-md-2",
                    id: "btnBuscar",
                    text: "Buscar",
                    onClick: () => this.lsPagos()
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoPago",
                    text: "Registrar Pago",
                    color_btn: "primary",
                    onClick: () => this.addPago()
                }
            ]
        });

        dataPicker({
            parent: "calendar" + this.PROJECT_NAME,
            onSelect: () => this.lsPagos()
        });
    }

    lsPagos() {
        let rangePicker = getDataRangePicker("calendar" + this.PROJECT_NAME);

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { 
                opc: "lsPagos", 
                fi: rangePicker.fi, 
                ff: rangePicker.ff 
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tbPagos`,
                theme: 'corporativo',
                title: '📊 Listado de Pagos a Proveedores',
                subtitle: 'Pagos registrados en el sistema',
                center: [1, 2, 4],
                right: [3]
            }
        });
    }

    addPago() {
        this.createModalForm({
            id: 'formPagoAdd',
            data: { opc: 'addPago' },
            bootbox: {
                title: '💰 Registrar Nuevo Pago a Proveedor',
                closeButton: true
            },
            json: this.jsonPago(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsPagos();
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

    async editPago(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getPago", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: "Error al obtener los datos del pago",
                btn1: true
            });
            return;
        }

        const pago = request.data;

        this.createModalForm({
            id: 'formPagoEdit',
            data: { opc: 'editPago', id: id },
            bootbox: {
                title: '✏️ Editar Pago a Proveedor',
                closeButton: true
            },
            autofill: pago,
            json: this.jsonPago(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsPagos();
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

    deletePago(id) {
        const row = event.target.closest('tr');
        const proveedor = row.querySelectorAll('td')[1]?.innerText || '';

        this.swalQuestion({
            opts: {
                title: "¿Está seguro?",
                html: `¿Desea eliminar el pago al proveedor <strong>${proveedor}</strong>?<br>Esta acción no se puede deshacer.`,
                icon: "warning"
            },
            data: { opc: "deletePago", id: id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.lsPagos();
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

    jsonPago() {
        return [
            {
                opc: "label",
                id: "lblDatos",
                text: "Información del Pago",
                class: "col-12 fw-bold text-lg mb-2 border-b p-1"
            },
            {
                opc: "select",
                id: "proveedor_id",
                lbl: "Proveedor",
                class: "col-12 col-md-6 mb-3",
                data: lsProveedores,
                text: "nombre",
                value: "id",
                required: true
            },
            {
                opc: "select",
                id: "tipo_pago_id",
                lbl: "Tipo de Pago",
                class: "col-12 col-md-6 mb-3",
                data: lsTipoPago,
                text: "tipo",
                value: "id",
                required: true
            },
            {
                opc: "input",
                id: "monto",
                lbl: "Monto",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                required: true,
                onkeyup: "validationInputForNumber('#monto')"
            },
            {
                opc: "input",
                id: "fecha_pago",
                lbl: "Fecha de Pago",
                type: "date",
                class: "col-12 col-md-6 mb-3",
                required: true
            },
            {
                opc: "textarea",
                id: "descripcion",
                lbl: "Descripción",
                rows: 3,
                class: "col-12 mb-3"
            }
        ];
    }
}
