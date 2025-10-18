const api = 'ctrl/ctrl-pedidos.php';
const apiDashboard = 'ctrl/ctrl-dashboard.php';


let pedidos, dashboard, producto, canal;
let canales, productos, campanas, lsudn,redes_sociales;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn          = data.udn;
    canales        = data.canales;
    productos      = data.productos;
    campanas       = data.campanas;
    redes_sociales = data.redes_sociales;

    app = new App(api, "root");
    pedidos = new Pedidos(api, 'root');
    // dashboard = new Dashboard(api, "root");
    // history = new AnnualHistory(api, "root");
    // admin = new Admin(api_admin, "root");



    app.render();

});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Pedido";
    }

    render() {
        this.layout();
        // dashboard.render();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterBarPedidos" },
                container: { class: "w-full h-full", id: "containerPedidos" },
            },
        });

        this.headerBar({
            parent: `filterBarPedidos`,
            title: "Módulo de Pedidos 🛵",
            subtitle: "Administra tus pedidos de manera eficiente.",
            onClick: () => app.redirectToHome(),
        });

        this.tabLayout({
            parent: `containerPedidos`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "short",
            json: [
                {
                    id: "dashboard",
                    tab: "Dashboard",
                    class: "mb-1",
                    onClick: () => dashboard.render()
                },
                {
                    id: "pedidos",
                    tab: "Pedidos",
                    active: true,
                    onClick: () => pedidos.render()
                },
                {
                    id: "history",
                    tab: "Historial Anual",
                    onClick: () => history.render()
                },
                {
                    id: "admin",
                    tab: "Administrador",
                    onClick: () => admin.lsTypes()
                },
            ]
        });
        pedidos.render()
        $('#content-tabsPedidos').removeClass('h-screen');
    }

    redirectToHome() {
        const base = window.location.origin + '/DEV';
        // window.location.href = `${base}/kpi/marketing.php`;
        window.location.href = `http://localhost/CoffeeLab/CoffeeERP/DEV/kpi/marketing.php`;
    }

    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Título por defecto",
            subtitle: "Subtítulo por defecto",
            icon: "icon-home",
            textBtn: "Inicio",
            classBtn: "border-1 border-blue-700 text-blue-600 hover:bg-blue-700 hover:text-white transition-colors duration-200",
            onClick: null,
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "relative flex justify-center items-center px-2 pt-3 pb-3"
        });

        // 🔵 Botón alineado a la izquierda (posición absoluta)
        const leftSection = $("<div>", {
            class: "absolute left-0"
        }).append(
            $("<button>", {
                class: `${opts.classBtn} font-semibold px-4 py-2 rounded transition flex items-center`,
                html: `<i class="${opts.icon} mr-2"></i>${opts.textBtn}`,
                click: () => typeof opts.onClick === "function" && opts.onClick()
            })
        );

        // 📜 Texto centrado
        const centerSection = $("<div>", {
            class: "text-center"
        }).append(
            $("<h2>", {
                class: "text-2xl font-bold",
                text: opts.title
            }),
            $("<p>", {
                class: "text-gray-400",
                text: opts.subtitle
            })
        );

        container.append(leftSection, centerSection);
        $(`#${opts.parent}`).html(container);
    }
}



class Pedidos extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Pedido";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsPedidos();
    }

    layout() {
        this.primaryLayout({
            parent: `container-pedidos`,
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
                    id: "udn_id",
                    lbl: "Unidad de Negocio",
                    class: "col-sm-3",
                    data: udn,
                    onchange: `pedidos.lsPedidos()`,
                },
                               {
                    opc: "select",
                    id: "anio",
                    class: "col-md-2",
                    lbl: "Año",
                    data: [
                        { id: "2025", valor: "2025" },
                        { id: "2024", valor: "2024" }
                    ],
                    onchange: "pedidos.lsPedidos()"
                },
                {
                    opc: "select",
                    id: "mes",
                    class: "col-md-2",
                    lbl: "Mes",
                    data: [
                        { id: "01", valor: "Enero" },
                        { id: "02", valor: "Febrero" },
                        { id: "03", valor: "Marzo" },
                        { id: "04", valor: "Abril" },
                        { id: "05", valor: "Mayo" },
                        { id: "06", valor: "Junio" },
                        { id: "07", valor: "Julio" }
                    ],
                    onchange: "pedidos.lsPedidos()"
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNewOrder",
                    text: "<i class='icon-plus'></i> Nuevo Pedido",
                },
            ],
        });
    }

    lsPedidos() {
        this.createTable({
            parent: "containerPedido",
            idFilterBar: "filterBarPedido",
            data: { 
                opc: "ls", 
                udn: $("#filterBarPedido #udn_id").val(),
                anio: $("#filterBarPedido #anio").val(),
                mes: $("#filterBarPedido #mes").val()
            },
            conf: { datatable: true, pag: 15 },
            coffeesoft: true,
            attr: {
                id: "tbPedidos",
                theme: 'corporativo',
                center: [1, 2, 7, 8, 9],
                right: [6]
            }
        });
    }

    // addPedido() {
    //     this.createForm({
    //         parent: "formCapturaPedido",
    //         id: "formPedido",
    //         data: { opc: "addPedido" },
    //         json: this.jsonPedido(),
    //         success: (response) => {
    //             if (response.status === 200) {
    //                 alert({
    //                     icon: "success",
    //                     title: "Pedido creado",
    //                     text: response.message,
    //                     btn1: true,
    //                     btn1Text: "Aceptar"
    //                 });
    //                 $("#formPedido")[0].reset();
    //             } else {
    //                 alert({
    //                     icon: "error",
    //                     text: response.message,
    //                     btn1: true,
    //                     btn1Text: "Ok"
    //                 });
    //             }
    //         }
    //     });

    //     $("#lblCliente").addClass("border-b border-gray-600 pb-2 mb-3");
    //     $("#lblPedido").addClass("border-b border-gray-600 pb-2 mb-3");
    // }

    // async editPedido(id) {
    //     const request = await useFetch({ 
    //         url: this._link, 
    //         data: { opc: "getPedido", id } 
    //     });

    //     if (request.status !== 200) {
    //         alert({
    //             icon: "error",
    //             text: request.message,
    //             btn1: true
    //         });
    //         return;
    //     }

    //     this.createModalForm({
    //         id: 'formPedidoEdit',
    //         data: { opc: 'editPedido', id },
    //         bootbox: {
    //             title: 'Editar Pedido',
    //             size: 'large'
    //         },
    //         autofill: request.data,
    //         json: this.jsonPedido(),
    //         success: (response) => {
    //             if (response.status === 200) {
    //                 alert({
    //                     icon: "success",
    //                     text: response.message,
    //                     btn1: true
    //                 });
    //                 this.lsPedidos();
    //             } else {
    //                 alert({
    //                     icon: response.status === 403 ? "warning" : "error",
    //                     title: response.status === 403 ? "Acceso denegado" : "Error",
    //                     text: response.message,
    //                     btn1: true
    //                 });
    //             }
    //         }
    //     });
    // }

    // verifyTransfer(id) {
    //     this.swalQuestion({
    //         opts: {
    //             title: "¿Verificar transferencia?",
    //             text: "Se marcará el pago como verificado",
    //             icon: "question"
    //         },
    //         data: { opc: "verifyTransfer", id },
    //         methods: {
    //             send: (response) => {
    //                 if (response.status === 200) {
    //                     alert({
    //                         icon: "success",
    //                         text: response.message,
    //                         btn1: true
    //                     });
    //                     this.lsPedidos();
    //                 }
    //             }
    //         }
    //     });
    // }

    // registerArrival(id) {
    //     bootbox.dialog({
    //         title: "Registrar Llegada",
    //         message: `
    //             <div class="text-center">
    //                 <p class="mb-4">¿El cliente llegó al establecimiento?</p>
    //                 <button class="btn btn-success me-2" onclick="pedidos.confirmArrival(${id}, 1)">
    //                     <i class="icon-check"></i> Sí, llegó
    //                 </button>
    //                 <button class="btn btn-danger" onclick="pedidos.confirmArrival(${id}, 0)">
    //                     <i class="icon-times"></i> No llegó
    //                 </button>
    //             </div>
    //         `,
    //         buttons: {
    //             cancel: {
    //                 label: "Cancelar",
    //                 className: "btn-secondary"
    //             }
    //         }
    //     });
    // }

    // async confirmArrival(id, arrived) {
    //     bootbox.hideAll();
        
    //     const response = await useFetch({
    //         url: this._link,
    //         data: { opc: "registerArrival", id, arrived }
    //     });

    //     if (response.status === 200) {
    //         alert({
    //             icon: "success",
    //             text: response.message,
    //             btn1: true
    //         });
    //         this.lsPedidos();
    //     } else {
    //         alert({
    //             icon: "error",
    //             text: response.message,
    //             btn1: true
    //         });
    //     }
    // }

    // cancelPedido(id) {
    //     const row = event.target.closest('tr');
    //     const fecha = row.querySelectorAll('td')[1]?.innerText || '';

    //     this.swalQuestion({
    //         opts: {
    //             title: "¿Cancelar pedido?",
    //             html: `¿Deseas cancelar el pedido del <strong>${fecha}</strong>?<br>
    //                    Esta acción actualizará el estado a "Cancelado".`,
    //             icon: "warning"
    //         },
    //         data: { opc: "statusPedido", active: 0, id },
    //         methods: {
    //             send: (response) => {
    //                 if (response.status === 200) {
    //                     alert({
    //                         icon: "success",
    //                         title: "Cancelado",
    //                         text: "El pedido fue cancelado exitosamente.",
    //                         btn1: true
    //                     });
    //                     this.lsPedidos();
    //                 }
    //             }
    //         }
    //     });
    // }

    // jsonPedido() {
    //     return [
    //         {
    //             opc: "label",
    //             id: "lblCliente",
    //             text: "Información del cliente",
    //             class: "col-12 fw-bold text-lg mb-2 "
    //         },
    //         {
    //             opc: "input",
    //             lbl: "Nombre del cliente",
    //             id: "cliente_nombre",
    //             tipo: "texto",
    //             class: "col-12 col-sm-6 col-lg-4 mb-3"
    //         },
    //         {
    //             opc: "input",
    //             lbl: "Teléfono",
    //             id: "cliente_telefono",
    //             tipo: "tel",
    //             class: "col-12 col-sm-6 col-lg-4 mb-3"
    //         },
    //         {
    //             opc: "input",
    //             lbl: "Correo electrónico",
    //             id: "cliente_correo",
    //             tipo: "email",
    //             class: "col-12 col-sm-6 col-lg-4 mb-3",
    //             required: false
    //         },
    //         {
    //             opc: "input",
    //             lbl: "Fecha de cumpleaños",
    //             id: "cliente_cumpleaños",
    //             type: "date",
    //             class: "col-12 col-sm-6 col-lg-4 mb-3",
    //             required: false
    //         },
    //         {
    //             opc: "label",
    //             id: "lblPedido",
    //             text: "Datos del pedido",
    //             class: "col-12 fw-bold text-lg mb-2 text-white"
    //         },
    //         {
    //             opc: "input",
    //             lbl: "Fecha de pedido",
    //             id: "fecha_pedido",
    //             type: "date",
    //             class: "col-12 col-lg-3 mb-3"
    //         },
    //         {
    //             opc: "input",
    //             lbl: "Hora de entrega",
    //             id: "hora_entrega",
    //             type: "time",
    //             class: "col-12 col-lg-3 mb-3"
    //         },
    //         {
    //             opc: "select",
    //             id: "canal_id",
    //             lbl: "Canal de comunicación",
    //             class: "col-12 col-lg-3 mb-3",
    //             data: canales
    //         },
    //         {
    //             opc: "input",
    //             lbl: "Monto",
    //             id: "monto",
    //             tipo: "cifra",
    //             class: "col-12 col-lg-3 mb-3",
    //             onkeyup: "validationInputForNumber('#monto')"
    //         },
    //         {
    //             opc: "select",
    //             id: "envio_domicilio",
    //             lbl: "Tipo de entrega",
    //             class: "col-12 col-lg-4 mb-3",
    //             data: [
    //                 { id: 1, valor: "Envío a domicilio" },
    //                 { id: 0, valor: "Recoger en establecimiento" }
    //             ]
    //         },
    //         {
    //             opc: "select",
    //             id: "campana_id",
    //             lbl: "Campaña (opcional)",
    //             class: "col-12 col-lg-4 mb-3",
    //             data: campanas,
    //             required: false
    //         },
    //         {
    //             opc: "select",
    //             id: "red_social_id",
    //             lbl: "Red social",
    //             class: "col-12 col-lg-4 mb-3",
    //             data: redes_sociales
    //         },
    //         {
    //             opc: "textarea",
    //             id: "notas",
    //             lbl: "Notas adicionales",
    //             rows: 3,
    //             class: "col-12 mb-3",
    //             required: false
    //         },
    //         {
    //             opc: "btn-submit",
    //             id: "btnGuardarPedido",
    //             text: "Guardar Pedido",
    //             class: "col-12 col-md-3 offset-md-9"
    //         }
    //     ];
    // }

    // showCapturaForm() {
    //     $(`#container-captura`).html(`
    //         <div class="px-6 py-4">
    //             <div class=" rounded-xl p-6">
    //                 <h2 class="text-xl font-semibold mb-4">📝 Nuevo Pedido</h2>
    //                 <form id="formCapturaPedido" novalidate></div>
    //             </div>
    //         </div>
    //     `);

    //     this.addPedido();
    // }

}
