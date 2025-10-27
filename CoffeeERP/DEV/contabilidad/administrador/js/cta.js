// let api = 'ctrl/ctrl-cta.php';
// let app, mayorAccount, subAccount, purchaseType, paymentMethod;

// let lsudn;

// $(async () => {
//     const data = await useFetch({ url: api, data: { opc: "init" } });
//     lsudn = data.udn;

//     app           = new App(api, "root");
//     mayorAccount  = new MayorAccount(api, "root");
//     subAccount    = new SubAccount(api, "root");
//     purchaseType = new TipoCompras('ctrl/ctrl-tipo-compras.php', "root");
//     paymentMethod = new FormasPago('ctrl/ctrl-formasPago.php', "root");

//     app.render();
// });

class ComprasCta extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "cuentasMayor";
    }

    render() {
        this.layout();
    
    }

    layout() {
        this.primaryLayout({
            parent: "container-compras",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: `filterBar${this.PROJECT_NAME}` },
                container: { class: "w-full h-full", id: `container${this.PROJECT_NAME}` },
            },
        });


        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "button",
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
                    id     : "tiposCompra",
                    tab    : "Tipos de compra",
                
                    onClick: () => purchaseType.render()
                },
                {
                    id     : "formasPago",
                    tab    : "Formas de pago",
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
                    text: "Agregar cuenta",
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
                theme: 'corporativo',
                center: [1]
            },
        });
    }

    addMayorAccount() {

        const udn     = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const udnText = $(`#filterBar${this.PROJECT_NAME} #udn option:selected`).text();

        this.createModalForm({
            id: 'formMayorAccountAdd',
            data: { opc: 'addMayorAccount', udn_id: udn },
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
                theme: 'corporativo',
                center: [1]
            },
        });
    }

    addSubAccount() {
        alert({ icon: "info", text: "Funcionalidad en desarrollo" });
    }
}

class TipoCompras extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "TipoCompras";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsTipoCompras();
    }

    layout() {
        this.primaryLayout({
            parent: 'container-tiposCompra',
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
                    lbl: "Unidad de negocio",
                    class: "col-12 col-md-3",
                    data: lsudn,
                    onchange: 'tipoCompras.lsTipoCompras()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-2",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'tipoCompras.lsTipoCompras()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnAddTipoCompra",
                    className: 'w-100',
                    text: "+ Agregar nuevo tipo de compra",
                    color_btn: "primary",
                    onClick: () => this.addTipoCompra()
                }
            ]
        });
    }

    lsTipoCompras() {
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const active = $(`#filterBar${this.PROJECT_NAME} #active`).val();

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: {
                opc: 'lsTipoCompras',
                udn: udn,
                active: active
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
                center: [1],
                right: []
            }
        });
    }

    addTipoCompra() {
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();

        this.createModalForm({
            id: 'formTipoCompraAdd',
            data: { opc: 'addTipoCompra', udn_id: udn },
            bootbox: {
                title: 'NUEVO TIPO DE COMPRA',
                closeButton: true
            },
            json: this.jsonTipoCompra(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsTipoCompras();
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

    async editTipoCompra(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getTipoCompra", id: id }
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

        const tipoCompra = request.data;

        this.createModalForm({
            id: 'formTipoCompraEdit',
            data: { opc: 'editTipoCompra', id: tipoCompra.id },
            bootbox: {
                title: 'EDITAR TIPO DE COMPRA',
                closeButton: true
            },
            autofill: tipoCompra,
            json: this.jsonTipoCompra(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsTipoCompras();
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

    toggleStatusTipoCompra(id, currentStatus) {
        const newStatus = currentStatus === 1 ? 0 : 1;
        const action = newStatus === 1 ? 'ACTIVAR' : 'DESACTIVAR';
        const message = newStatus === 1
            ? 'El tipo de compra estará disponible para capturar o filtrar las compras de todas las unidades de negocio.'
            : 'El tipo de compra ya no estará disponible para capturar o filtrar las compras de todas las unidades de negocio.';

        this.swalQuestion({
            opts: {
                title: `${action} TIPO DE COMPRA`,
                html: `<div class="text-center">
                    <div class="mb-3">
                        <i class="fas fa-exclamation-circle text-warning" style="font-size: 48px;"></i>
                    </div>
                    <p>${message}</p>
                </div>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#003360',
                cancelButtonColor: '#dc3545'
            },
            data: {
                opc: "toggleStatusTipoCompra",
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
                        this.lsTipoCompras();
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

    jsonTipoCompra() {
        return [
            {
                opc: "input",
                id: "name",
                lbl: "Nombre del tipo de compra",
                tipo: "texto",
                class: "col-12 mb-3",
                placeholder: "Ej: Corporativo, Fondo fijo, Crédito",
                required: true
            }
        ];
    }
}



class FormasPago extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "formasPago";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsFormasPago();
    }

    layout() {

        this.primaryLayout({
            parent: `container-formasPago`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });
     

       
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBarformasPago",
            data: [
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'paymentMethod.lsFormasPago()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-4",
                    id: "btnNuevaFormaPago",
                    className: 'w-full',
                    text: "Nuevo método de pago",
                    color_btn: "primary",
                    onClick: () => this.addFormaPago()
                }
            ]
        });
    }

    lsFormasPago() {
        this.createTable({
            parent: "containerformasPago",
            idFilterBar: "filterBarformasPago",
            data: { opc: "lsFormasPago" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbFormasPago",
                theme: 'corporativo',
                // title: '📋 Lista de Formas de Pago',
                // subtitle: 'Métodos de pago registrados en el sistema',
                center: [2, 3],
                right: [4]
            }
        });
    }

    addFormaPago() {
        this.createModalForm({
            id: 'formFormaPagoAdd',
            data: { opc: 'addFormaPago' },
            bootbox: {
                title: 'Nueva forma de pago',
                closeButton: true
            },
            json: this.jsonFormaPago(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsFormasPago();
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

    async editFormaPago(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getFormaPago",
                id: id
            }
        });

        const formaPago = request.data;

        this.createModalForm({
            id: 'formFormaPagoEdit',
            data: { opc: 'editFormaPago', id: formaPago.id },
            bootbox: {
                title: 'Editar forma de pago',
                closeButton: true
            },
            autofill: formaPago,
            json: this.jsonFormaPago(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsFormasPago();
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

    statusFormaPago(id, active) {
        const newStatus = active === 1 ? 0 : 1;
        const action = newStatus === 1 ? "activar" : "desactivar";
        const message = newStatus === 1
            ? "La forma de pago estará disponible para capturar y filtrar las compras en todas las unidades de negocio"
            : "La forma de pago ya no estará disponible para capturar o filtrar las compras de todas las unidades de negocio";

        this.swalQuestion({
            opts: {
                title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} forma de pago?`,
                html: `<p class="text-gray-600">${message}</p>`,
                icon: "warning"
            },
            data: {
                opc: "statusFormaPago",
                active: newStatus,
                id: id
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.lsFormasPago();
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

    jsonFormaPago() {
        return [
            {
                opc: "input",
                id: "name",
                lbl: "Nombre de la forma de pago",
                tipo: "texto",
                class: "col-12 mb-3",
                placeholder: "Ej: Efectivo, Transferencia, etc.",
                required: true
            }
        ];
    }
}

