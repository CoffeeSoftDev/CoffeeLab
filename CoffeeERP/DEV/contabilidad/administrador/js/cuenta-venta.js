let api = 'ctrl/ctrl-cuenta-venta.php';
let salesAccount;
let lsudn;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsudn = data.udn;

    salesAccount = new SalesAccountManager(api, "root");
    salesAccount.render();
});

class SalesAccountManager extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SalesAccount";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsSalesAccount();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full mb-3", id: `filterBar${this.PROJECT_NAME}` },
                container: { class: "w-full h-full", id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#container${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📊 Cuentas de Ventas</h2>
                <p class="text-gray-400">Gestiona las categorías de venta con permisos e impuestos aplicables</p>
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
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `salesAccount.lsSalesAccount()`
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNuevaCategoriaVenta",
                    text: "Agregar nueva categoría",
                    onClick: () => this.addSalesAccount()
                }
            ]
        });

        setTimeout(() => {
            const defaultUdn = lsudn.find(u => u.valor.toLowerCase().includes('baos'));
            if (defaultUdn) {
                $(`#filterBar${this.PROJECT_NAME} #udn`).val(defaultUdn.id).trigger("change");
            }
        }, 100);
    }

    lsSalesAccount() {
        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "lsSalesAccount" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
             
                center: [2, 3, 4, 5, 6, 7, 8],
                right: [9]
            }
        });
    }

    addSalesAccount() {
        this.createModalForm({
            id: 'formSalesAccountAdd',
            data: { opc: 'addSalesAccount' },
            bootbox: {
                title: 'Nueva cuenta de ventas',
                closeButton: true
            },
            json: this.jsonSalesAccount(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsSalesAccount();
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

    async editSalesAccount(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getSalesAccount", id: id }
        });

        if (request.status === 200) {
            const data = request.data;

            this.createModalForm({
                id: 'formSalesAccountEdit',
                data: { opc: 'editSalesAccount', id: id },
                bootbox: {
                    title: 'Editar categoría de venta',
                    closeButton: true
                },
                autofill: data,
                json: this.jsonSalesAccount(true),
                success: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                        this.lsSalesAccount();
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
    }

    statusSalesAccount(id, currentStatus) {
        const isActive = currentStatus === 1;
        const action = isActive ? 'desactivar' : 'activar';
        const newStatus = isActive ? 0 : 1;

        let message = '';
        if (isActive) {
            message = 'Esta categoría no podrá usarse en las ventas diarias, pero seguirá reflejándose en los registros contables.<br><br>Es importante que también se desactive en el <strong>Soft-Restaurant</strong>.';
        } else {
            message = 'Antes de activar la categoría de venta nuevamente, es importante que también se active en el <strong>Soft-Restaurant</strong>.';
        }

        this.swalQuestion({
            opts: {
                title: `¿Desea ${action} esta categoría?`,
                html: message,
                icon: "warning"
            },
            data: {
                opc: "statusSalesAccount",
                activo: newStatus,
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
                        this.lsSalesAccount();
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

    jsonSalesAccount(isEdit = false) {
        const fields = [
            {
                opc: "label",
                id: "lblInfo",
                text: "Información de la categoría",
                class: "col-12 fw-bold text-lg mb-2 border-b pb-2"
            }
        ];

        if (!isEdit) {
            fields.push({
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de negocio",
                class: "col-12 mb-3",
                data: lsudn,
                required: true
            });
        }

        fields.push(
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre de la cuenta",
                tipo: "texto",
                class: "col-12 mb-3",
                placeholder: "Ej. Alimentos, Bebidas, Otros...",
                required: true
            },
            {
                opc: "label",
                id: "lblPermisos",
                text: "Permisos",
                class: "col-12 fw-bold text-lg mb-2 mt-3 border-b pb-2"
            },
            {
                opc: "checkbox",
                id: "permiso_descuento",
                lbl: "Permitir descuento",
                class: "col-6 mb-3"
            },
            {
                opc: "checkbox",
                id: "permiso_cortesia",
                lbl: "Permitir cortesía",
                class: "col-6 mb-3"
            },
            {
                opc: "label",
                id: "lblImpuestos",
                text: "Impuestos aplicables",
                class: "col-12 fw-bold text-lg mb-2 mt-3 border-b pb-2"
            },
            {
                opc: "checkbox",
                id: "impuesto_iva",
                lbl: "IVA",
                class: "col-6 mb-3"
            },
            {
                opc: "checkbox",
                id: "impuesto_ieps",
                lbl: "IEPS",
                class: "col-6 mb-3"
            },
            {
                opc: "checkbox",
                id: "impuesto_hospedaje",
                lbl: "Hospedaje",
                class: "col-6 mb-3"
            },
            {
                opc: "checkbox",
                id: "impuesto_cero",
                lbl: "Impuesto al 0%",
                class: "col-6 mb-3"
            }
        );

        const warningMessage = isEdit
            ? "**Importante:** Antes de cambiar el nombre de la categoría, es importante que el cambio sea realizado con anticipación en el *Soft-Restaurant* de la unidad de negocio."
            : "**Importante:** Antes de registrar una nueva categoría de venta, es importante que exista en el *Soft-Restaurant* de la unidad de negocio.";

        fields.push({
            opc: "div",
            id: "warningMessage",
            class: "col-12 mt-3",
            html: `
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="icon-alert-triangle text-yellow-400"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-yellow-700">${warningMessage}</p>
                        </div>
                    </div>
                </div>
            `
        });

        return fields;
    }
}
