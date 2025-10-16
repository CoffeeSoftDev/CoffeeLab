let pedidos;
const apiPedidos = 'ctrl/ctrl-pedidos.php';
let canales, productos, campanas, lsudn;

$(async () => {
    const data = await useFetch({ url: apiPedidos, data: { opc: "init" } });
    canales = data.canales;
    productos = data.productos;
    campanas = data.campanas;
    lsudn = data.udn;

    pedidos = new Pedidos(apiPedidos, 'root');
    pedidos.render();
});

class Pedidos extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Pedidos";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: 'w-full min-h-screen bg-[#0f172a]',
            card: {
                filterBar: { class: 'w-full border-b border-gray-700 pb-4', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-4', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#${this.PROJECT_NAME}`).prepend(`
            <div class="px-6 pt-6 pb-4">
                <h1 class="text-3xl font-bold text-white">📦 Gestión de Pedidos</h1>
                <p class="text-gray-400 mt-2">Captura, visualización y administración de pedidos diarios</p>
            </div>
        `);

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "dark",
            type: "short",
            json: [
                {
                    id: "captura",
                    tab: "Captura de Pedidos",
                    active: true,
                    onClick: () => this.showCapturaForm()
                },
                {
                    id: "listado",
                    tab: "Listado de Pedidos",
                    onClick: () => {
                        this.filterBar();
                        this.lsPedidos();
                    }
                }
            ]
        });

        this.showCapturaForm();
    }

    showCapturaForm() {
        $(`#container-captura`).html(`
            <div class="px-6 py-4">
                <div class="bg-gray-800 rounded-xl p-6">
                    <h2 class="text-xl font-semibold text-white mb-4">📝 Nuevo Pedido</h2>
                    <div id="formCapturaPedido"></div>
                </div>
            </div>
        `);

        this.addPedido();
    }

    filterBar() {
        $(`#container-listado`).html(`
            <div class="px-6 py-4">
                <div id="filterBarListado" class="mb-4"></div>
                <div id="tablaPedidos"></div>
            </div>
        `);

        this.createfilterBar({
            parent: "filterBarListado",
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-4",
                    id: "calendarPedidos",
                    lbl: "Rango de fechas"
                },
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `pedidos.lsPedidos()`
                },
                {
                    opc: "button",
                    class: "col-sm-2",
                    id: "btnBuscar",
                    text: "Buscar",
                    onClick: () => this.lsPedidos()
                }
            ]
        });

        dataPicker({
            parent: "calendarPedidos",
            onSelect: () => this.lsPedidos()
        });
    }

    lsPedidos() {
        let rangePicker = getDataRangePicker("calendarPedidos");

        this.createTable({
            parent: "tablaPedidos",
            idFilterBar: "filterBarListado",
            data: { 
                opc: "ls", 
                fi: rangePicker.fi, 
                ff: rangePicker.ff,
                udn: $("#filterBarListado #udn").val()
            },
            conf: { datatable: true, pag: 15 },
            coffeesoft: true,
            attr: {
                id: "tbPedidos",
                theme: 'dark',
                center: [1, 2, 7, 8, 9],
                right: [6]
            }
        });
    }

    addPedido() {
        this.createForm({
            parent: "formCapturaPedido",
            id: "formPedido",
            data: { opc: "addPedido" },
            json: this.jsonPedido(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        title: "Pedido creado",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    $("#formPedido")[0].reset();
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

        $("#lblCliente").addClass("border-b border-gray-600 pb-2 mb-3");
        $("#lblPedido").addClass("border-b border-gray-600 pb-2 mb-3");
    }

    async editPedido(id) {
        const request = await useFetch({ 
            url: this._link, 
            data: { opc: "getPedido", id } 
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message,
                btn1: true
            });
            return;
        }

        this.createModalForm({
            id: 'formPedidoEdit',
            data: { opc: 'editPedido', id },
            bootbox: {
                title: 'Editar Pedido',
                size: 'large'
            },
            autofill: request.data,
            json: this.jsonPedido(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsPedidos();
                } else {
                    alert({
                        icon: response.status === 403 ? "warning" : "error",
                        title: response.status === 403 ? "Acceso denegado" : "Error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

    verifyTransfer(id) {
        this.swalQuestion({
            opts: {
                title: "¿Verificar transferencia?",
                text: "Se marcará el pago como verificado",
                icon: "question"
            },
            data: { opc: "verifyTransfer", id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.lsPedidos();
                    }
                }
            }
        });
    }

    registerArrival(id) {
        bootbox.dialog({
            title: "Registrar Llegada",
            message: `
                <div class="text-center">
                    <p class="mb-4">¿El cliente llegó al establecimiento?</p>
                    <button class="btn btn-success me-2" onclick="pedidos.confirmArrival(${id}, 1)">
                        <i class="icon-check"></i> Sí, llegó
                    </button>
                    <button class="btn btn-danger" onclick="pedidos.confirmArrival(${id}, 0)">
                        <i class="icon-times"></i> No llegó
                    </button>
                </div>
            `,
            buttons: {
                cancel: {
                    label: "Cancelar",
                    className: "btn-secondary"
                }
            }
        });
    }

    async confirmArrival(id, arrived) {
        bootbox.hideAll();
        
        const response = await useFetch({
            url: this._link,
            data: { opc: "registerArrival", id, arrived }
        });

        if (response.status === 200) {
            alert({
                icon: "success",
                text: response.message,
                btn1: true
            });
            this.lsPedidos();
        } else {
            alert({
                icon: "error",
                text: response.message,
                btn1: true
            });
        }
    }

    cancelPedido(id) {
        const row = event.target.closest('tr');
        const fecha = row.querySelectorAll('td')[1]?.innerText || '';

        this.swalQuestion({
            opts: {
                title: "¿Cancelar pedido?",
                html: `¿Deseas cancelar el pedido del <strong>${fecha}</strong>?<br>
                       Esta acción actualizará el estado a "Cancelado".`,
                icon: "warning"
            },
            data: { opc: "statusPedido", active: 0, id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            title: "Cancelado",
                            text: "El pedido fue cancelado exitosamente.",
                            btn1: true
                        });
                        this.lsPedidos();
                    }
                }
            }
        });
    }

    jsonPedido() {
        return [
            {
                opc: "label",
                id: "lblCliente",
                text: "Información del cliente",
                class: "col-12 fw-bold text-lg mb-2 text-white"
            },
            {
                opc: "input",
                lbl: "Nombre del cliente",
                id: "cliente_nombre",
                tipo: "texto",
                class: "col-12 col-sm-6 col-lg-4 mb-3"
            },
            {
                opc: "input",
                lbl: "Teléfono",
                id: "cliente_telefono",
                tipo: "tel",
                class: "col-12 col-sm-6 col-lg-4 mb-3"
            },
            {
                opc: "input",
                lbl: "Correo electrónico",
                id: "cliente_correo",
                tipo: "email",
                class: "col-12 col-sm-6 col-lg-4 mb-3",
                required: false
            },
            {
                opc: "input",
                lbl: "Fecha de cumpleaños",
                id: "cliente_cumpleaños",
                type: "date",
                class: "col-12 col-sm-6 col-lg-4 mb-3",
                required: false
            },
            {
                opc: "label",
                id: "lblPedido",
                text: "Datos del pedido",
                class: "col-12 fw-bold text-lg mb-2 text-white"
            },
            {
                opc: "input",
                lbl: "Fecha de pedido",
                id: "fecha_pedido",
                type: "date",
                class: "col-12 col-lg-3 mb-3"
            },
            {
                opc: "input",
                lbl: "Hora de entrega",
                id: "hora_entrega",
                type: "time",
                class: "col-12 col-lg-3 mb-3"
            },
            {
                opc: "select",
                id: "canal_id",
                lbl: "Canal de comunicación",
                class: "col-12 col-lg-3 mb-3",
                data: canales
            },
            {
                opc: "input",
                lbl: "Monto",
                id: "monto",
                tipo: "cifra",
                class: "col-12 col-lg-3 mb-3",
                onkeyup: "validationInputForNumber('#monto')"
            },
            {
                opc: "select",
                id: "envio_domicilio",
                lbl: "Tipo de entrega",
                class: "col-12 col-lg-4 mb-3",
                data: [
                    { id: 1, valor: "Envío a domicilio" },
                    { id: 0, valor: "Recoger en establecimiento" }
                ]
            },
            {
                opc: "select",
                id: "campana_id",
                lbl: "Campaña (opcional)",
                class: "col-12 col-lg-4 mb-3",
                data: campanas,
                required: false
            },
            {
                opc: "select",
                id: "red_social_id",
                lbl: "Red social",
                class: "col-12 col-lg-4 mb-3",
                data: [
                    { id: 1, valor: "WhatsApp" },
                    { id: 2, valor: "Facebook" },
                    { id: 3, valor: "Instagram" },
                    { id: 4, valor: "Llamada telefónica" }
                ]
            },
            {
                opc: "textarea",
                id: "notas",
                lbl: "Notas adicionales",
                rows: 3,
                class: "col-12 mb-3",
                required: false
            },
            {
                opc: "btn-submit",
                id: "btnGuardarPedido",
                text: "Guardar Pedido",
                class: "col-12 col-md-3 offset-md-9"
            }
        ];
    }
}
