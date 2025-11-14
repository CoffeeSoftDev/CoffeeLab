let api_pedidos = "ctrl/ctrl-pedidos-simple.php";
let app, main;
let SUBSIDIARIES_ID = 1; // Cambia este valor por tu ID de sucursal

$(async () => {
    
    // Verificar que useFetch esté disponible
    if (typeof useFetch === 'undefined') {
        console.error('useFetch no está definido. Verifica que plugins.js se haya cargado correctamente.');
        alert('Error: No se pudo cargar el framework CoffeeSoft');
        return;
    }
    
    try {
        const data = await useFetch({ 
            url: api_pedidos, 
            data: { 
                opc: "init",
                subsidiaries_id: SUBSIDIARIES_ID 
            } 
        });
        
        app = new App(api_pedidos, 'root');
        app.render();

        main = new MainApp(api_pedidos, 'root');
        main.navBar({ theme: 'dark' });
        
    } catch (error) {
        console.error('Error inicializando dashboard:', error);
        alert('Error al cargar el dashboard. Revisa la consola para más detalles.');
    }

});

class App extends Templates {

    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Pedidos";
    }

    render() {
        this.layoutDashboard();
        this.renderDashboard();
    }

    createFilterBar() {
        const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

        this.createfilterBar({
            parent: `filterBarDashboard`,
            data: [
                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "mes",
                    lbl: "Mes: ",
                    data: Array.from({ length: 12 }, (_, i) => ({
                        id: String(i + 1).padStart(2, '0'),
                        valor: new Date(0, i).toLocaleString('es-MX', { month: 'long' })
                    })),
                },
                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "anio",
                    lbl: "Año: ",
                    data: Array.from({ length: 3 }, (_, i) => {
                        const year = 2025 - i;
                        return { id: String(year), valor: String(year) };
                    })
                },
                {
                    opc: "button",
                    class: "col-sm-2 d-flex align-items-end",
                    className: 'w-100 mt-4',
                    color_btn: "success",
                    id: "btnBuscar",
                    text: "Buscar",
                    onClick: () => { this.renderDashboard() }
                }
            ],
        });

        $(`#mes`).val(currentMonth);
    }

    layoutDashboard() {
        this.dashboardComponent({
            parent: "root",
            title: "📊 Dashboard de Pedidos",
            subtitle: "Resumen mensual · Cotizaciones · Pagados · Cancelados",
            json: [
                { type: "grafico", id: "ventasMes", title: "Pedidos realizados en el mes" },
                { type: "grafico", id: "estadisticasMes", title: "Estadísticas del mes" },
            ]
        });
        this.createFilterBar();
    }

    async renderDashboard() {
        try {
            let mes = $(`#mes`).val();
            let anio = $(`#anio`).val();

            const data = await useFetch({
                url: this._link,
                data: { 
                    opc: "apiVentas", 
                    mes: mes, 
                    anio: anio,
                    subsidiaries_id: SUBSIDIARIES_ID 
                }
            });

            if (data.cards) {
                this.showCardsDashboard(data.cards);
            } else {
                console.error("No se recibieron datos de cards");
                this.showCardsDashboard(this.getDefaultCards());
            }

            this.barChart({
                parent: 'ventasMes',
                data: this.jsonBarPedidos(data.cards)
            });

        } catch (error) {
            console.error("Error cargando dashboard:", error);
            alert({
                icon: "error",
                text: "Error al cargar las métricas del dashboard"
            });
            this.showCardsDashboard(this.getDefaultCards());
        }
    }

    showCardsDashboard(data) {
        console.log(data);
        this.cardsDashboard({
            parent: 'cardDashboard',
            theme: 'dark',
            json: [
                {
                    title: "Pedidos del mes",
                    id: "totalPedidos",
                    data: {
                        value: data.total_pedidos,
                        description: `${data.desglose.cotizaciones} cotizaciones • ${data.desglose.pagados} pagados • ${data.desglose.cancelados} cancelados`,
                        color: "text-purple-400"
                    }
                },
                {
                    title: "Dinero entrante este mes",
                    id: "dineroEntrante",
                    data: {
                        value: formatPrice(data.dinero_entrante),
                        description: "Total de pagos recibidos en el período",
                        color: "text-pink-400"
                    }
                },
                {
                    title: "Ventas cerradas del mes",
                    id: "ventasCerradas",
                    data: {
                        value: formatPrice(data.ventas_cerradas.monto),
                        description: `${data.ventas_cerradas.cantidad} pedidos completados`,
                        color: "text-cyan-400"
                    }
                },
                {
                    title: "Cancelaciones del mes",
                    id: "cancelaciones",
                    data: {
                        value: formatPrice(data.cancelaciones.monto),
                        description: `${data.cancelaciones.cantidad} pedidos cancelados`,
                        color: "text-red-400"
                    }
                }
            ]
        });
    }

    getDefaultCards() {
        return {
            total_pedidos: 0,
            dinero_entrante: 0,
            ventas_cerradas: { cantidad: 0, monto: 0 },
            cancelaciones: { cantidad: 0, monto: 0 },
            desglose: { cotizaciones: 0, pagados: 0, cancelados: 0 }
        };
    }

    jsonBarPedidos(data) {
        return {
            labels: ['Cotizaciones', 'Pagados', 'Cancelados'],
            datasets: [
                {
                    label: 'Cantidad de Pedidos',
                    data: [
                        data.desglose.cotizaciones,
                        data.desglose.pagados,
                        data.desglose.cancelados
                    ],
                    backgroundColor: ['#EC4899', '#10B981', '#F97316'],
                    borderColor: ['#EC4899', '#10B981', '#F97316'],
                    borderWidth: 1
                }
            ]
        };
    }

}

class MainApp extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Pedidos";
    }

    init() {
        this.navBar('nav');
    }

    navBar(options) {
        const defaults = {
            id: "navBar",
            theme: "light",
            class: "h-[56px] px-4 shadow-md",
            logoFull: "https://erp-varoch.com/ERP24/src/img/logos/logo_row_wh.png",
            logoMini: "https://erp-varoch.com/ERP24/src/img/logos/logo_icon_wh.png",
            user: {
                name: "Usuario",
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

        const isDark = String(opts.theme).toLowerCase() === "dark";
        const colors = {
            navbar: isDark ? "bg-[#1F2A37] text-white" : "bg-[#0A2B4B] text-white",
            dropdownBg: isDark ? "bg-[#1F2A37] text-white" : "bg-white text-gray-800",
            hoverText: isDark ? "hover:text-blue-300" : "hover:text-blue-200",
            userHover: isDark ? "" : "hover:bg-blue-100",
            userBg: isDark ? "bg-[#1F2A37]" : "bg-white",
            border: isDark ? "border border-gray-700" : "border border-gray-200",
            chipBg: isDark ? "bg-gray-700" : "bg-gray-100"
        };

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
