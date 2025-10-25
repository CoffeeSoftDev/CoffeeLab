let api = 'ctrl/ctrl-cta.php';
let app, mayorAccount, subAccount, purchaseType, paymentMethod;

let lsudn;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsudn = data.udn;

    app = new App(api, "root");
    mayorAccount = new MayorAccount(api, "root");
    subAccount = new SubAccount(api, "root");
    purchaseType = new PurchaseType(api, "root");
    paymentMethod = new PaymentMethod(api, "root");
    
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "cuentasMayor";
    }

    render() {
        this.layout();
        mayorAccount.render();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: `filterBar${this.PROJECT_NAME}` },
                container: { class: "w-full h-full", id: `container${this.PROJECT_NAME}` },
            },
        });

        this.headerBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            title: "📊 Administración de módulos y conceptos",
            subtitle: "Gestiona cuentas de mayor, subcuentas, tipos de compra y formas de pago",
        });

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "short",
            json: [
                {
                    id: "cuentaMayor",
                    tab: "Cuenta de mayor",
                    class: "mb-1",
                    active: true,
                    onClick: () => mayorAccount.render()
                },
                {
                    id: "subcuentaMayor",
                    tab: "Subcuenta de mayor",
                    onClick: () => subAccount.render()
                },
                {
                    id: "tiposCompra",
                    tab: "Tipos de compra",
                    onClick: () => purchaseType.render()
                },
                {
                    id: "formasPago",
                    tab: "Formas de pago",
                    onClick: () => paymentMethod.render()
                }
            ]
        });

        $(`#content-tabs${this.PROJECT_NAME}`).removeClass('h-screen');
    }

    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Título por defecto",
            subtitle: "Subtítulo por defecto",
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "flex justify-between items-center px-2 pt-3 pb-3"
        });

        const leftSection = $("<div>").append(
            $("<h2>", {
                class: "text-2xl font-semibold",
                text: opts.title
            }),
            $("<p>", {
                class: "text-gray-400",
                text: opts.subtitle
            })
        );

        container.append(leftSection);
        $(`#${opts.parent}`).html(container);
    }
}

class MayorAccount extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "mayorAccount";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsMayorAccount();
    }

    layout() {
        this.primaryLayout({
            parent: `container-cuentaMayor`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
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
                    lbl: "Unidad de negocio",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `mayorAccount.lsMayorAccount()`,
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNewMayorAccount",
                    text: "Agregar nueva cuenta de mayor",
                    onClick: () => this.addMayorAccount(),
                },
            ],
        });
    }

    lsMayorAccount() {
        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "lsMayorAccount" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'light',
                center: [1]
            },
        });
    }

    addMayorAccount() {
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const udnText = $(`#filterBar${this.PROJECT_NAME} #udn option:selected`).text();

        this.createModalForm({
            id: 'formMayorAccountAdd',
            data: { opc: 'addMayorAccount', udn: udn },
            bootbox: {
                title: 'Nueva cuenta de mayor',
            },
            json: [
                {
                    opc: "label",
                    id: "lblUdn",
                    text: `Unidad de negocio: ${udnText}`,
                    class: "col-12 mb-2 text-gray-600"
                },
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la cuenta mayor",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsMayorAccount();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editMayorAccount(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getMayorAccount",
                id: id,
            },
        });

        const data = request.data;

        this.createModalForm({
            id: 'formMayorAccountEdit',
            data: { opc: 'editMayorAccount', id: id },
            bootbox: {
                title: 'Editar cuenta de mayor',
            },
            autofill: data,
            json: [
                {
                    opc: "label",
                    id: "lblUdn",
                    text: `Unidad de negocio: ${data.udn_name}`,
                    class: "col-12 mb-2 text-gray-600"
                },
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la cuenta mayor",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsMayorAccount();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message });
                }
            }
        });
    }

    statusMayorAccount(id, active) {
        const message = active === 1 
            ? "La cuenta mayor ya no estará disponible, pero seguirá reflejándose en los registros contables."
            : "La cuenta mayor ya estará disponible, para la captura de información.";

        const title = active === 1 
            ? "Desactivar la cuenta de mayor"
            : "Activar la cuenta de mayor";

        this.swalQuestion({
            opts: {
                title: title,
                text: message,
                icon: "warning",
            },
            data: {
                opc: "statusMayorAccount",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsMayorAccount();
                    } else {
                        alert({ icon: "info", title: "Oops!...", text: response.message });
                    }
                },
            },
        });
    }
}

class SubAccount extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "subAccount";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsSubAccount();
    }

    layout() {
        this.primaryLayout({
            parent: `container-subcuentaMayor`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
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
                    lbl: "Unidad de negocio",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `subAccount.lsSubAccount()`,
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNewSubAccount",
                    text: "Agregar subcuenta",
                    onClick: () => this.addSubAccount(),
                },
            ],
        });
    }

    lsSubAccount() {
        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "lsSubAccount" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'light',
                center: [1]
            },
        });
    }

    addSubAccount() {
        alert({ icon: "info", text: "Funcionalidad en desarrollo" });
    }
}

class PurchaseType extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "purchaseType";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsPurchaseType();
    }

    layout() {
        this.primaryLayout({
            parent: `container-tiposCompra`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
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
                    lbl: "Unidad de negocio",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `purchaseType.lsPurchaseType()`,
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNewPurchaseType",
                    text: "Agregar tipo de compra",
                    onClick: () => this.addPurchaseType(),
                },
            ],
        });
    }

    lsPurchaseType() {
        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "lsPurchaseType" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'light',
                center: [1]
            },
        });
    }

    addPurchaseType() {
        alert({ icon: "info", text: "Funcionalidad en desarrollo" });
    }
}

class PaymentMethod extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "paymentMethod";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsPaymentMethod();
    }

    layout() {
        this.primaryLayout({
            parent: `container-formasPago`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
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
                    lbl: "Unidad de negocio",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `paymentMethod.lsPaymentMethod()`,
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNewPaymentMethod",
                    text: "Agregar forma de pago",
                    onClick: () => this.addPaymentMethod(),
                },
            ],
        });
    }

    lsPaymentMethod() {
        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "lsPaymentMethod" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'light',
                center: [1]
            },
        });
    }

    addPaymentMethod() {
        alert({ icon: "info", text: "Funcionalidad en desarrollo" });
    }
}
