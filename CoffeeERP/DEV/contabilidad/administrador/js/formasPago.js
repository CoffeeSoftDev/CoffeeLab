let api_formasPago = 'ctrl/ctrl-formasPago.php';
let formasPago;

$(async () => {
    formasPago = new FormasPago(api_formasPago, "root");
    formasPago.render();
});

class FormasPago extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "formasPago";
    }

    render() {
        this.layout();
        this.lsFormasPago();
    }

    layout() {
        $(`#container-formasPago`).html(`
            <div class="px-6 pt-4 pb-2">
                <h2 class="text-2xl font-semibold text-gray-800">💳 Formas de Pago</h2>
                <p class="text-gray-500">Gestiona los métodos de pago disponibles en el sistema</p>
            </div>
            <div id="filterbar-formasPago" class="px-6 py-3"></div>
            <div id="table-formasPago" class="px-6"></div>
        `);

        this.filterBar();
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterbar-formasPago",
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
                    onchange: 'formasPago.lsFormasPago()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevaFormaPago",
                    className: 'w-full',
                    text: "Agregar nuevo método de pago",
                    color_btn: "primary",
                    onClick: () => this.addFormaPago()
                }
            ]
        });
    }

    lsFormasPago() {
        this.createTable({
            parent: "table-formasPago",
            idFilterBar: "filterbar-formasPago",
            data: { opc: "lsFormasPago" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbFormasPago",
                theme: 'corporativo',
                title: '📋 Lista de Formas de Pago',
                subtitle: 'Métodos de pago registrados en el sistema',
                center: [1, 2, 3],
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
