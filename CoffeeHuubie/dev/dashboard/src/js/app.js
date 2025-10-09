
let api_pedidos = "https://huubie.com.mx/dev/dashboard/ctrl/ctrl-reservaciones.php";
let app, main, pos;
let modifier, products;
let idFolio;
let orders;

$(async () => {
    
    const data = await useFetch({ url: api_pedidos, data: { opc: "init" } });
    // instancias.
    app = new App(api_pedidos, 'root');
    orders = app; // Variable global para acceder desde el botón
    app.render();

    main = new MainApp(api_pedidos, 'root');
    main.navBar({ theme: 'dark' });

});



class App extends Templates {

    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Orders";
    }

    render() {
        // this.layout();
        // interface.
        this.layoutDashboard();
        this.renderDashboard()
    
    }

    createFilterBar() {
        // Obtener el mes actual (0-11) y sumar 1 para que sea 1-12
        const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

        this.createfilterBar({
            parent: `filterBarDashboard`,
            data: [
                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "mes" ,
                    lbl: "Mes: ",
                    data: Array.from({ length: 12 }, (_, i) => ({
                        id: String(i + 1).padStart(2, '0'),
                        valor: new Date(0, i).toLocaleString('es-MX', { month: 'long' })
                    })),
                },
                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "anio" ,
                    lbl: "Año: ",
                    data: Array.from({ length: 3 }, (_, i) => {
                        const year = 2025 - i;
                        return { id: String(year), valor: String(year) };
                    })
                },
                {
                    opc      : "button",
                    class    : "col-sm-2 d-flex align-items-end",
                    className: 'w-100 mt-4',
                    color_btn: "success",
                    id       : "btnBuscar",
                    text     : "Buscar",
                    onClick: () => { this.renderDashboard() }
                  
                }
            ],
        });

        // seleccionar Mes actual 
        $(`#mes`).val(currentMonth);
    }

    layoutDashboard() {
        this.dashboardComponent({
            parent: "root" ,
            title   : "📊  · Dashboard de Eventos",
            subtitle: "Resumen mensual · Cotizaciones · Pagados · Cancelados",
            json: [
                { type: "grafico", id: "ventasMes", title: "Cuantos eventos se han hecho en el mes", },
                { type: "grafico", id: "eventMonth", title: "Cuantos eventos se realizaron este mes por sucursal" },
                { type: "grafico", id: "containerPayChart", title: "Cuanto dinero entro este mes de anticipo ( los que no se cerraron )" },
                { type: "grafico", id: "containerPayChartClosed", title: "Cuanto dinero entro este mes de anticipo ( de los que se cerraron )" },
                { type: "grafico", id: "containerTotalPay", title: "Cuanto se vendio en total este mes ( entrada de dinero ) " },
                { type: "grafico", id: "containerSales", title: "Cuanto dinero se pudo haber ganado ( pero se cancelo ) " },
                { type: "grafico", id: "ContainerTop", title: "TOP 10 Clientes " },
            ]
        });
        this.createFilterBar();

    }

    async renderDashboard(){

        let mes = $(`#mes`).val();
        let anio = $(`#anio`).val();

        const data = await useFetch({
            url: this._link,
            data: { opc: "apiVentas", mes: mes, anio: anio }
        });


        this.showCardsDashboard(data.cards);



        this.barChart({
            parent: 'ventasMes',
            data: this.jsonBarEventos()
        })

      

    }

    // Graficos.
    showCardsDashboard(data) {
        console.log(data)
        this.cardsDashboard({
            parent: 'cardDashboard',
            theme: 'dark',
            json: [
                {
                    title: "Eventos realizados este mes",
                    id: "eventosUsuario",
                    data: {
                        value: data.eventos,
                        description: "Eventos finales",
                        color: "text-purple-400"
                    }
                },
                {
                    title: "Dinero entrante este mes",
                    id: "dineroEntrado",
                    data: {
                        value: formatPrice(data.sales),
                        // description: "$950.00 anticipos (no cerrados) • $24,450.00 anticipos (cerrados)",
                        color: "text-pink-400"
                    }
                },
                {
                    title: "Ventas del mes",
                    id: "ventasMonth",
                    data: {
                        value: "$28,600.00",
                        description: "Comparado con entrada de dinero: $25,400.00",
                        color: "text-cyan-400"
                    }
                },
                {
                    title: "Potencial perdido (cancelaciones)",
                    id: "potencialPerdido",
                    data: {
                        value: "$5,900.00",
                        description: "Suma de pedidos cancelados del mes",
                        color: "text-red-400"
                    }
                }
            ]
        });
    }

    graficoEventosPorSucursal() {
        this.linearChart({
            parent: "eventMonth",
            id: "graficoEventosSucursal",
            data: this.jsonEventosPorSucursal(),
        });
    }

    chartEstatus() {
        this.payChart({
            parent: "containerPayChart",
            id: "chartEstatus",
            data: this.jsonEstatus()
        });
    }

    chartPaymentClosed() {
        this.payChart({
            parent: "containerPayChartClosed",
            id: "chartPaymentClosed",
            data: this.jsonPaymentClosed()
        });
    }

  

    // Components.
  

    jsonBarEventos() {
        return {
            labels: ['Centro', 'Norte', 'Sur'],
            datasets: [
                {
                    label: 'Total',
                    data: [7, 5, 3],
                    backgroundColor: '#3B82F6',
                    borderColor: '#3B82F6',
                    borderWidth: 1
                },
                {
                    label: 'Cotizaciones',
                    data: [2, 1, 1],
                    backgroundColor: '#EC4899',
                    borderColor: '#EC4899',
                    borderWidth: 1
                },
                {
                    label: 'Pagados',
                    data: [4, 3, 1],
                    backgroundColor: '#10B981',
                    borderColor: '#10B981',
                    borderWidth: 1
                },
                {
                    label: 'Cancelados',
                    data: [1, 1, 1],
                    backgroundColor: '#F97316',
                    borderColor: '#F97316',
                    borderWidth: 1
                }
            ]
        };
    }

 



}

class MainApp extends Templates {
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
