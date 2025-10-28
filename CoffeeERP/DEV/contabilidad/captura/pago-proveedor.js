let api = 'ctrl/ctrl-pago-proveedor.php';
let app;
let suppliers, paymentTypes;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    suppliers = data.suppliers;
    paymentTypes = data.paymentTypes;

    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "pagoProveedor";
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

        $(`#filterBar${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-semibold">💰 Pagos a Proveedor</h2>
                        <p class="text-gray-400">Gestiona los pagos realizados a proveedores</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500">Fecha de captura</p>
                        <p class="text-lg font-semibold">${moment().format('DD/MM/YYYY')}</p>
                    </div>
                </div>
            </div>
        `);
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnSubirArchivos",
                    text: "Subir archivos de proveedores",
                    color_btn: "secondary",
                    onClick: () => {
                        alert({ icon: "info", text: "Funcionalidad en desarrollo" });
                    }
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoPago",
                    text: "Registrar nuevo pago a proveedor",
                    onClick: () => this.addPayment()
                }
            ]
        });
    }

    ls() {
        const container = $(`#container${this.PROJECT_NAME}`);
        container.html('<div id="totalsCards"></div><div id="tablePayments"></div>');

        this.createTable({
            parent: 'tablePayments',
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'ls', udn: $_POST['udn'] },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbPayments',
                theme: 'corporativo',
                title: 'Lista de Pagos a Proveedores',
                subtitle: 'Pagos registrados en el sistema',
                center: [1, 2],
                right: [3, 5]
            },
            success: (response) => {
                if (response.totals) {
                    this.showTotals(response.totals);
                }
            }
        });
    }

    addPayment() {
        this.createModalForm({
            id: 'formPaymentAdd',
            data: { opc: 'addPayment', udn: $_POST['udn'] },
            bootbox: {
                title: 'Registrar nuevo pago a proveedor',
                closeButton: true
            },
            json: this.jsonPayment(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    async editPayment(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getPayment", id: id }
        });

        if (request.status === 200) {
            const payment = request.data;

            this.createModalForm({
                id: 'formPaymentEdit',
                data: { opc: 'editPayment', id: id, udn: $_POST['udn'] },
                bootbox: {
                    title: 'Editar pago a proveedor',
                    closeButton: true
                },
                autofill: payment,
                json: this.jsonPayment(),
                success: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            });
        } else {
            alert({ icon: "error", text: request.message });
        }
    }

    deletePayment(id) {
        this.swalQuestion({
            opts: {
                title: "¿Está seguro?",
                text: "¿Desea eliminar el pago a proveedor?",
                icon: "warning"
            },
            data: { opc: "deletePayment", id: id, udn: $_POST['udn'] },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    jsonPayment() {
        return [
            {
                opc: "select",
                id: "supplier_id",
                lbl: "Proveedor",
                class: "col-12 mb-3",
                data: suppliers,
                text: "valor",
                value: "id",
                required: true
            },
            {
                opc: "select",
                id: "payment_type",
                lbl: "Tipo de pago",
                class: "col-12 col-md-6 mb-3",
                data: paymentTypes,
                text: "valor",
                value: "id",
                required: true
            },
            {
                opc: "input",
                id: "amount",
                lbl: "Cantidad",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                required: true,
                onkeyup: "validationInputForNumber('#amount')"
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción (opcional)",
                rows: 3,
                class: "col-12 mb-3"
            },
            {
                opc: "btn-submit",
                text: "Guardar pago a proveedor",
                class: "col-12"
            }
        ];
    }

    showTotals(data) {
        const container = $('#totalsCards');
        
        const cards = $('<div>', {
            class: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 px-4'
        });

        const cardTotal = $('<div>', {
            class: 'bg-green-100 p-4 rounded-lg border border-green-300',
            html: `
                <p class="text-sm text-gray-600 mb-1">Total de pagos a proveedores</p>
                <p class="text-2xl font-bold text-green-800">${formatPrice(data.total_general)}</p>
            `
        });

        const cardFondoFijo = $('<div>', {
            class: 'bg-blue-100 p-4 rounded-lg border border-blue-300',
            html: `
                <p class="text-sm text-gray-600 mb-1">Total pagos de fondo fijo</p>
                <p class="text-2xl font-bold text-blue-800">${formatPrice(data.total_fondo_fijo)}</p>
            `
        });

        const cardCorporativo = $('<div>', {
            class: 'bg-purple-100 p-4 rounded-lg border border-purple-300',
            html: `
                <p class="text-sm text-gray-600 mb-1">Total pagos de corporativo</p>
                <p class="text-2xl font-bold text-purple-800">${formatPrice(data.total_corporativo)}</p>
            `
        });

        cards.append(cardTotal, cardFondoFijo, cardCorporativo);
        container.html(cards);
    }
}
