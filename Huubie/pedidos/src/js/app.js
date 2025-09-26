let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';
let api = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos-catalogo.php";
let api_pedidos = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos.php";
let app,main, pos;
let modifier, products;
let idFolio;

$(async () => {

    // instancias.
    app = new App(api_pedidos, 'root');
    app.init();

    main = new MainApp(api, 'root');
    main.navBar({theme:'dark'});

});



class App extends Templates {

    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Orders";
    }

    init() {
        this.render();
    }

    render() {
        this.layout();

        // interface.
        // this.showOrder(27)
        this.historyPay(30)

    }

    layout() {

        this.primaryLayout({
            parent: `root`,
            class:'mt-3 mx-2 sm:mx-4 p-3',
            id: this.PROJECT_NAME,

            card:{
                container: {
                class: 'w-full my-3 bg-[#1F2A37] rounded-lg h-[calc(100vh-7rem)] overflow-auto',
                id: 'container' + this.PROJECT_NAME
            }
            }
        });
    }

    // Order
     async historyPay(id) {
        
        let data = await useFetch({ url: this._link, data: { opc: 'getHistory', id: id } });


        bootbox.dialog({
            title      : ``,
            size       : "large",
            id         : 'modalAdvance',
            closeButton: true,
            message    : `<div id="containerChat"></div>`,

        }).on("shown.bs.modal", function () {
            $('.modal-body').css('min-height', '520px');
        });;

        this.tabLayout({
            parent: "containerChat",
            id: "tabComponent",
            content: { class: "" },
            theme: "dark",
            json: [
                {
                    id: "payment",
                    tab: "Pagos",
                    icon: "",
                    active: true,
                },
                {
                    id: "listPayment",
                    tab: "Lista de pagos",

                    onClick: () => { },
                },


            ],
        });

        // Layout payment
        this.addPayment(id);



        // Contenido de las pestañas

        $('#container-listPayment').html(`
            <div id="container-info-payment"></div>
            <div id="container-methodPay"></div>
        `);

        $('#container-payment').html(``);


        // this.renderResumenPagos(data.info);
        this.lsPay(id);

    }

    async addPayment(id) {

        let saldo, saldoOriginal, total, total_paid, saldo_restante;
        const req      = await useFetch({ url: api, data: { opc: "getPayment", id: id } });
        const response = req.order;

        if (req.total_paid) {


            saldo          = formatPrice(response.total_pay);
            saldoOriginal  = response.total_pay;
            total          = response.total_pay;
            total_paid     = req.total_paid;
            saldo_restante = total - total_paid;

        } 

        this.createForm({
            id: "formRegisterPayment",
            parent:'container-payment',
            data: { opc: 'addPayment', total: total, saldo: saldo_restante, id: id },
            json: [
                // this.cardPay(total, total_paid),
                 {
                    opc: "div",
                    id: "Amount",
                    class: "col-12",
                    html: `
                    <div id="dueAmount" class="p-4 rounded-xl bg-[#1E293B] text-white text-center">
                        <p class="text-sm opacity-80">Monto restante a pagar</p>
                        <p id="SaldoEvent" class="text-3xl font-bold mt-1">
                            ${formatPrice(total)}
                        </p>
                </div>

                    `
            },
               
                {
                    opc: "input",
                    type: "number",
                    id: "advanced_pay",
                    lbl: "Importe",
                    class: "col-12 mb-3 mt-2",
                    placeholder: "0.00",
                    required: false,
                    min: 0,
                    onkeyup: 'normal.updateTotal(' + total + ', ' + (total_paid || 0) + ')'
                },
                {
                    opc: "select",
                    id: "method_pay_id",
                    lbl: "Método de pago del anticipo",
                    class: "col-12 mb-3 ",
                    data: [
                        { id: "1", valor: "Efectivo" },
                        { id: "2", valor: "Tarjeta" },
                        { id: "3", valor: "Transferencia" }
                    ],
                    required: true
                },
                {
                    opc:'btn-submit',
                    id:'btnSuccess',
                    class:'col-12',
                    text:'Aceptar'
                }
            ],
            success: (response) => {
                // if (response.status == 200) {
                //     alert({ icon: "success", text: response.message, btn1: true, btn1Text: "Ok" });
                //     app.init();
                // } else {
                //     alert({ icon: "error", text: response.message, btn1: true, btn1Text: "Ok" });
                // }
            }
        });
        $("#btnSuccess").addClass("text-white");
        $("#btnExit").addClass("text-white");
    }

    lsPay(id) {

        this.createTable({

            parent: "container-methodPay",
            idFilterBar: "filterBarEventos",
            data: { opc: 'listPagos', id: id },
            conf: { datatable: true, pag: 8 },
            coffeesoft: true,

            attr: {
                id: "tableOrder",
                theme: 'dark',
                center: [1, , 3, 6, 7],
                right: [4,],
                extends: true,
            },
        });

    }


    // Pos.

    async showOrder(id) {
        // Obtener datos de la reservación
        const res = await useFetch({ url: api, data: { opc: "getOrder", id: id } });
        const data = res.order;

        // Mostrar modal y renderizar contenido
        bootbox.dialog({
            title: "📅 Pedido",
            closeButton: true,
            message: '<div id="containerOrder"></div>',
        });

        this.tabLayout({
            parent: "containerOrder",
            id: "tabsOrderDetails",
            theme: "dark",
            content: { class: "" },
            json: [
                {
                    id: "detail",
                    tab: "Detalles del pedido",
                    active: true,

                },
                {
                    id: "product-detail",
                    tab: "Pedido"
                }
            ]
        });

        this.menuResumenPaquete({parent:'container-detail'})

        // this.detailCard({
        //     parent: "container-detail",
        //     data: [
        //         { text: "Folio", value: 'P-00' + data.folio, icon: "icon-doc-text-1" },
        //         { text: "Nombre", value: data.name, icon: "icon-user-1" },
        //         { text: "Fecha del pedido", value: data.date_order, icon: "icon-calendar" },
        //         { text: "Hora de entrega", value: data.time_order, icon: "icon-clock" },
        //         { type: "observacion", value: data.note }
        //     ]
        // });


    }

    menuResumenPaquete(options) {
        const defaults = {
            parent: "root",
            id: "menuResumenPaquete",
            title: "Menú",
            class: "p-3 h-full rounded-lg bg-[#1F2A37]",
            total: "24,500.00",
            json: [
                {
                    cantidad: 50,
                    paquete: "BUFFET DESAYUNO",
                    precio: "24,500.00",
                    detalles: ["1 Pan Dulce"]
                }
            ]
        };

        const opts = Object.assign({}, defaults, options);

        const $container = $(`
            <div id="${opts.id}" class="${opts.class}">
            <div class="text-xs mt-3">
                <h3 class="text-sm font-bold text-white mb-2">${opts.title}</h3>
                <div class="flex justify-between text-[13px] text-white font-semibold border-b pb-1 mb-2">
                <div class="w-1/4 text-left"><i class="icon-basket-alt"></i> Cantidad</div>
                <div class="w-1/2 text-center"><i class="icon-dropbox"></i> Paquete</div>
                <div class="w-1/4 text-right"><i class="icon-dollar"></i> Precio</div>
                </div>
            </div>
            </div>
        `);

        opts.json.forEach((item) => {
            const $row = $(`
      <div class="mb-3">
        <div class="flex justify-between text-white font-medium py-1 border-b border-dashed">
          <div class="w-1/4 text-left">(${item.cantidad})</div>
          <div class="w-1/2 text-start">${item.paquete}</div>
          <div class="w-1/4 text-right">$${item.precio}</div>
        </div>
        <ul class="text-xs text-white pl-4 mt-1">
          ${item.detalles.map(d => `<li>- ${d}</li>`).join("")}
        </ul>
      </div>
    `);
            $container.find("div.text-xs").append($row);
        });

        const $footer = $(`
            <div class="mt-2 ">
            <div class="flex justify-end">
                <div class="text-white text-lg font-bold">
                Total: $${opts.total}
                </div>
            </div>
            </div>
        `);

        $container.find("div.text-xs").append($footer);

        $(`#${opts.parent}`).html($container);
    }


}

class MainApp extends Templates{
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Order";
    }

    init() {
        this.navBar('nav');
    }

    navBar(options) {
        const defaults = {
            id: "navBar",
            theme: "light", // "light" | "dark" (Huubie)
            class: "h-[56px] px-4 shadow-md",
            logoFull: "https://erp-varoch.com/ERP24/src/img/logos/logo_row_wh.png",
            logoMini: "https://erp-varoch.com/ERP24/src/img/logos/logo_icon_wh.png",
            user: {
                name: "Sergio Osorio",
                photo: "https://huubie.com.mx/alpha/src/img/perfil/fotoUser26_20250803_120920.png",
                onProfile: () => redireccion('perfil/perfil.php'),
                onLogout: () => cerrar_sesion()
            },
            apps: [
                { icon: "icon-calculator", name: "Contabilidad", color: "text-indigo-400" },
                { icon: "icon-box", name: "Inventario", color: "text-blue-600" },
                { icon: "icon-cart", name: "Ventas", color: "text-green-600" },
                { icon: "icon-bag", name: "Compras", color: "text-yellow-600" },
                { icon: "icon-users", name: "Recursos", color: "text-pink-600" },
                { icon: "icon-chart", name: "Reportes", color: "text-purple-600" },
                { icon: "icon-handshake", name: "CRM", color: "text-red-600" },
                { icon: "icon-industry", name: "Producción", color: "text-orange-600" },
                { icon: "icon-cog", name: "Configuración", color: "text-gray-600" }
            ]
        };

        const opts = Object.assign({}, defaults, options);

        // ===== THEME: Huubie Dark =====
        const isDark = String(opts.theme).toLowerCase() === "dark";
        const colors = {
            navbar: isDark ? "bg-[#1F2A37] text-white" : "bg-[#0A2B4B] text-white", // Huubie dark / Light azul prof.
            dropdownBg: isDark ? "bg-[#1F2A37] text-white" : "bg-white text-gray-800",
            hoverText: isDark ? "hover:text-blue-300" : "hover:text-blue-200",
            userHover: isDark ? "" : "hover:bg-blue-100",
            userBg: isDark ? "bg-[#1F2A37]" : "bg-white",
            border: isDark ? "border border-gray-700" : "border border-gray-200",
            chipBg: isDark ? "bg-gray-700" : "bg-gray-100"
        };

        // NAVBAR
        const header = $("<header>", {
            id: opts.id,
            class: `${colors.navbar} ${opts.class} flex justify-between items-center w-full fixed top-0 left-0 z-40`
        });

        const left = $("<div>", { class: "flex items-center gap-4" }).append(
            $("<span>", {
                id: "btnSidebar",
                html: `<i class="icon-menu text-2xl cursor-pointer ${colors.hoverText}"></i>`
            }),
            $("<img>", {
                src: opts.logoFull,
                class: "h-8 hidden sm:block cursor-pointer",
                click: () => location.reload()
            }),
            $("<img>", {
                src: opts.logoMini,
                class: "h-8 block sm:hidden cursor-pointer",
                click: () => location.reload()
            })
        );

        const launcherButton = $("<div>", {
            id: "launcherBtn",
            class: `relative ${colors.hoverText} text-xl cursor-pointer`,
            html: `<i class="icon-th-3"></i>`,
            click: (e) => {
                e.stopPropagation();
                $("#appsLauncher").toggleClass("hidden");
            }
        });

        // USER (click para abrir menú)
        const user = $("<div>", {
            class: "flex items-center gap-2 ml-4 cursor-pointer relative",
            id: "userDropdown"
        }).append(
            $("<img>", {
                src: opts.user.photo,
                class: "w-9 h-9 rounded-full border-2 border-white shadow"
            }),
            $("<span>", {
                class: "hidden sm:block font-medium text-sm",
                text: opts.user.name
            }),
            $("<ul>", {
                id: "userMenu",
                class: `hidden fixed top-16 right-4 w-[280px] ${colors.dropdownBg} rounded-lg ${colors.border} shadow p-2 z-50`
            }).append(
                $("<li>", {
                    class: `px-3 py-2 rounded ${colors.userHover} cursor-pointer flex items-center gap-2`,
                    html: `<i class="icon-user"></i><span>Mi perfil</span>`,
                    click: opts.user.onProfile
                }),
                $("<li>", { class: `my-1 ${colors.border}` }),
                $("<li>", {
                    class: `px-3 py-2 rounded ${colors.userHover} cursor-pointer flex items-center gap-2`,
                    html: `<i class="icon-off"></i><span>Cerrar sesión</span>`,
                    click: opts.user.onLogout
                })
            )
        );

        const right = $("<div>", {
            class: "flex items-center gap-3 relative"
        }).append(launcherButton, user);

        header.append(left, right);
        $("body").prepend(header);

        // APPS LAUNCHER (Huubie dark)
        const launcher = $("<div>", {
            id: "appsLauncher",
            class: `hidden fixed top-16 right-4 w-[320px] ${colors.dropdownBg} rounded-lg ${colors.border} shadow p-4 z-50`
        }).append(
            $("<div>", { class: "mb-3 flex items-center justify-between" }).append(
                $("<h3>", { class: "text-sm font-semibold", text: "Módulos ERP" }),
                $("<span>", { class: `text-[10px] px-2 py-1 rounded ${colors.chipBg} opacity-80`, text: "Huubie UI" })
            ),
            $("<div>", { class: "grid grid-cols-3 gap-3" }).append(
                ...opts.apps.map(app =>
                    $("<button>", {
                        type: "button",
                        class: `flex flex-col items-center gap-2 text-xs px-2 pt-2 pb-3 rounded hover:scale-105 transition ${colors.userHover}`
                    }).append(
                        $("<div>", {
                            class: `w-12 h-12 rounded-lg flex items-center justify-center text-xl ${app.color} ${colors.chipBg}`
                        }).append($("<i>", { class: app.icon })),
                        $("<span>", { class: "opacity-90", text: app.name })
                    )
                )
            )
        );

        $("body").append(launcher);

        // Eventos de toggle/cierre (user & launcher)
        $("#userDropdown").on("click", function (e) {
            e.stopPropagation();
            $("#userMenu").toggleClass("hidden");
            $("#appsLauncher").addClass("hidden");
        });

        $(document).on("click", (e) => {
            if (!$(e.target).closest("#launcherBtn").length && !$(e.target).closest("#appsLauncher").length) {
                $("#appsLauncher").addClass("hidden");
            }
            if (!$(e.target).closest("#userDropdown").length && !$(e.target).closest("#userMenu").length) {
                $("#userMenu").addClass("hidden");
            }
        });
    }



}




