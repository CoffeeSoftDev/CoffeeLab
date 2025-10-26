let api = 'ctrl/ctrl-moneda.php';
let currency;
let lsudn, lsPaymentMethods;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsudn = data.udn;
    lsPaymentMethods = data.paymentMethods;

    currency = new AdminForeignCurrency(api, "root");
    currency.render();
});

class AdminForeignCurrency extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "ForeignCurrency";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsCurrencies();
    }

    layout() {
        this.primaryLayout({
            parent: `container-moneda`,
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full mb-3', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#container${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">💱 Monedas Extranjeras</h2>
                <p class="text-gray-400">Administra las monedas extranjeras y sus tipos de cambio.</p>
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
                    onchange: 'currency.lsCurrencies()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activas" },
                        { id: "0", valor: "Inactivas" }
                    ],
                    onchange: 'currency.lsCurrencies()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-4",
                    id: "btnAddCurrency",
                    text: "+ Agregar nueva moneda extranjera",
                    color_btn: "primary",
                    onClick: () => this.addCurrency()
                }
            ]
        });
    }

    lsCurrencies() {
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const active = $(`#filterBar${this.PROJECT_NAME} #active`).val();

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsCurrencies', udn: udn, active: active },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
                  center: [1, 3],
                right: [2]
            }
        });
    }

    addCurrency() {
        this.createModalForm({
            id: 'formCurrencyAdd',
            data: { opc: 'addCurrency', udn_id: $(`#filterBar${this.PROJECT_NAME} #udn`).val() },
            bootbox: {
                title: '💱 Agregar Nueva Moneda Extranjera',
                closeButton: true
            },
            json: this.jsonCurrency(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsCurrencies();
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

    async editCurrency(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCurrency", id: id }
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

        const currency = request.data;

        this.createModalForm({
            id: 'formCurrencyEdit',
            data: { opc: 'editCurrency', id: currency.id },
            bootbox: {
                title: '✏️ Editar Moneda Extranjera',
                closeButton: true
            },
            autofill: currency,
            json: this.jsonCurrency(true),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsCurrencies();
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

    toggleStatus(id, currentStatus) {
        const newStatus = currentStatus === 1 ? 0 : 1;
        const action = newStatus === 1 ? 'activar' : 'desactivar';
        const message = newStatus === 1 
            ? 'La moneda extranjera estará disponible para captura de información.'
            : 'La moneda extranjera ya no estará disponible, pero seguirá reflejándose en los registros contables.';

        this.swalQuestion({
            opts: {
                title: `¿Desea ${action} esta moneda?`,
                text: message,
                icon: "warning"
            },
            data: {
                opc: "toggleStatus",
                active: newStatus,
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
                        this.lsCurrencies();
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

    jsonCurrency(isEdit = false) {
        const fields = [
            {
                opc: "input",
                id: "name",
                lbl: "Nombre del concepto",
                tipo: "texto",
                class: "col-12 mb-3",
                placeholder: "Ej.: Dólar, Quetzal, etc."
            },
            {
                opc: "input",
                id: "code",
                lbl: "Símbolo de la moneda",
                tipo: "texto",
                class: "col-12 mb-3",
                placeholder: "Ej.: USD, MXN, etc."
            },
            {
                opc: "input",
                id: "conversion_value",
                lbl: "Tipo de cambio (MXN)",
                tipo: "cifra",
                class: "col-12 mb-3",
                placeholder: "0.00",
                onkeyup: "validationInputForNumber('#conversion_value')"
            }
        ];

        if (isEdit) {
            fields.push({
                opc: "div",
                id: "warningMessage",
                class: "col-12 mb-3",
                html: `
                    <div class="alert alert-danger" role="alert">
                        <strong>⚠️ Importante:</strong> Los cambios afectarán a todas las unidades. 
                        Confirme que los retiros de efectivo se hayan realizado antes de actualizar el tipo de cambio (MXN).
                    </div>
                `
            });
        }

        return fields;
    }
}
