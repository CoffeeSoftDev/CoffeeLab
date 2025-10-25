
// let salesAccount;
// let udn, lsudn;

// $(async () => {
//     const data = await useFetch({ url: api, data: { opc: "init" } });
//     lsudn = data.udn;
//     udn = data.udn;

//     console.log(data)

//     salesAccount = new SalesAccountManager(api, "root");
//     salesAccount.render();
// });

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
            parent: "container-cta",
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

            setTimeout(() => {
                this.initializeToggles(data);
            }, 100);
        }
    }

    statusSalesAccount(id, currentStatus) {
        const isActive = currentStatus === 1;
        const action = isActive ? 'desactivar' : 'activar';
        const newStatus = isActive ? 0 : 1;

        let message = '';
        if (isActive) {
            message = 'Esta categoría <strong>no podrá usarse </strong> no podrá usarse en las ventas diarias, pero seguirá reflejándose en los registros contables.<br><br>Es importante que también se desactive en el <strong>Soft-Restaurant</strong>.';
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
                active: newStatus,
                id: id,
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

    jsonSalesAccount(isEdit = false, _lsudn = []) {

        return [
            {
                opc: "select",
                id: "udn_id",
                name: "udn_id",
                lbl: "Unidad de negocio",
                class: "col-12 mb-3",
                data: udn,
                required: true
            },
            {
                opc: "input",
                id: "name",
                name: "name",
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
                class: "col-12 fw-bold text-lg "
            },
            ...this.toggleDiv("discount", "Permitir descuento",'col-12 '),
            ...this.toggleDiv("courtesy", "Permitir cortesía",'col-12 mb-2 '),
            {
                opc: "label",
                id: "lblImpuestos",
                text: "Impuestos aplicables",
                class: "col-12 fw-bold text-lg "
            },
            ...this.toggleDiv("tax_iva", "IVA"),
            ...this.toggleDiv("tax_ieps", "IEPS"),
            ...this.toggleDiv("tax_hospedaje", "Hospedaje"),
            // ...this.toggleDiv("impuesto_cero", "Impuesto al 0%"),
            {
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
                            <p class="text-sm text-yellow-700">${isEdit
                        ? "**Importante:** Antes de cambiar el nombre de la categoría, es importante que el cambio sea realizado con anticipación en el *Soft-Restaurant* de la unidad de negocio."
                        : "**Importante:** Antes de registrar una nueva categoría de venta, es importante que exista en el *Soft-Restaurant* de la unidad de negocio."
                    }</p>
                        </div>
                    </div>
                </div>
            `
            }
        ];
    }

    // Auxiliar.

    toggleDiv(id, labelText,clase = "col-6") {
        return [
            {
                opc: "div",
                id: `toggle-${id}`,
                class:  clase ,
                html: `
                    <label for="check-${id}" class="flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="check-${id}" 
                            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                            onchange="salesAccount.handleCheckboxChange('${id}', this.checked)"
                        >
                        <input type="hidden" name="${id}" id="${id}" value="0">
                        <span class="ml-3 text-sm text-gray-700 font-medium">${labelText}</span>
                    </label>
                `
            }
        ];
    }

    handleCheckboxChange(id, isChecked) {
        const hidden = document.getElementById(id);
        if (hidden) {
            hidden.value = isChecked ? "1" : "0";
        }
    }

    initializeToggles(data) {
        const toggleFields = ['discount', 'courtesy', 'tax_iva', 'tax_ieps', 'tax_hospedaje'];

        toggleFields.forEach(field => {
            const checkbox = document.getElementById(`check-${field}`);
            const hidden = document.getElementById(field);

            if (checkbox && hidden && data[field]) {
                const value = data[field].toString();
                hidden.value = value;
                checkbox.checked = value === "1";
            }
        });
    }

}
