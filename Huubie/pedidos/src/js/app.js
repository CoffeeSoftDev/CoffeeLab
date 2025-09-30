let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';
let api = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos-catalogo.php";
let api_pedidos = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos.php";
let app, main, pos;
let modifier, products;
let idFolio;
let orders;

$(async () => {

    // instancias.
    app = new App(api_pedidos, 'root');
    orders = app; // Variable global para acceder desde el botón
    app.init();

    main = new MainApp(api, 'root');
    main.navBar({ theme: 'dark' });

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
        this.renderDashboard();
        this.createFilterBar();

    }

    layout() {

        this.primaryLayout({
            parent: `root`,
            class: 'pt-14  p-3',
            id: this.PROJECT_NAME,

            card: {
                container: {
                    class: 'w-full my-3 bg-[#1F2A37] rounded-lg ',
                    id: 'container' + this.PROJECT_NAME
                }
            }
        });
    }

    createFilterBar() {
        this.createfilterBar({
            parent: `filterBarDashboard`,
            data: [
                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "mes" + this.PROJECT_NAME,
                    lbl: "Mes: ",
                    data: [
                        { id: "01", valor: "Enero" },
                  
                    ]
                },
                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "anio" + this.PROJECT_NAME,
                    lbl: "Año: ",
                    options: [
                        { value: "2023", text: "2023" },
                        { value: "2024", text: "2024" },
                        { value: "2025", text: "2025" }
                    ]
                },
                {
                    opc: "btn",
                    class: "col-sm-2 d-flex align-items-end",
                    className:'w-100 mt-4',
                    color_btn: "success",
                    id: "btnBuscar",
                    text: "Buscar",
                  
                }
            ],
        });
    }

    ls() {
        const mes = $(`#mes${this.PROJECT_NAME}`).val();
        const anio = $(`#anio${this.PROJECT_NAME}`).val();

        console.log('Buscando pedidos:', { mes, anio });

        // Aquí se implementaría la lógica de búsqueda
        // this.useFetch({
        //     opc: 'list',
        //     mes: mes,
        //     anio: anio
        // }).then(response => {1
        //     // Procesar respuesta y actualizar tabla
        // });
    }

    async renderDashboard() {

        this.dashboardComponent({
            parent  : "container" + this.PROJECT_NAME,
            title   : "📊  · Dashboard de Eventos",
            subtitle: "Resumen mensual · Cotizaciones · Pagados · Cancelados",
            json: [
                { type: "grafico", id: "ventasMes", title: "Ventas del mes" },
                { id: "tablaUsuarios", title: "Usuarios activos", emoji: "👤" },
                {  id: "filtros", title: "Opciones de búsqueda", emoji: "👤" }
            ]
        });

        this.themeSelector();

        this.barChart({
            parent: 'ventasMes',
            data: this.jsonBarEventos()
        })

        // Agregar contenido personalizado después del gráfico
        const customContent = $('<div>', {
            id: 'tableChart',
            class: 'border p-4 rounded mt-4',
            text: 'ContainerText'
        });
        
        $('#ventasMes').append(customContent);

    }

    themeSelector() {
        const themeContainer = $('<div>', {
            class: 'fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border'
        });

        const themeLabel = $('<label>', {
            class: 'block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300',
            text: '🎨 Tema:'
        });

        const themeSelect = $('<select>', {
            id: 'themeSelector',
            class: 'w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white'
        });

        const themes = [
            { value: 'light', text: '☀️ Light' },
            { value: 'dark', text: '🌙 Dark' },
            { value: 'coffeeSoft', text: '☕ CoffeeSoft' }
        ];

        themes.forEach(theme => {
            const option = $('<option>', {
                value: theme.value,
                text: theme.text
            });
            themeSelect.append(option);
        });

        themeSelect.on('change', (e) => {
            this.setTheme(e.target.value);
        });

        themeContainer.append(themeLabel, themeSelect);
        $('body').append(themeContainer);

        // Cargar tema guardado o por defecto
        const savedTheme = localStorage.getItem('theme') || 'light';
        themeSelect.val(savedTheme);
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        const body = $('body');
        
        // Remover clases de tema anteriores
        body.removeClass('theme-light theme-dark theme-coffeesoft');
        
        // Aplicar nuevo tema
        switch(theme) {
            case 'dark':
                body.addClass('theme-dark dark');
                document.documentElement.classList.add('dark');
                break;
            case 'coffeeSoft':
                body.addClass('theme-coffeesoft');
                document.documentElement.classList.remove('dark');
                this.applyCoffeeSoftTheme();
                break;
            default: // light
                body.addClass('theme-light');
                document.documentElement.classList.remove('dark');
                break;
        }
        
        // Guardar tema en localStorage
        localStorage.setItem('theme', theme);
    }

    applyCoffeeSoftTheme() {
        const style = $('<style id="coffeesoft-theme">');
        style.html(`
            .theme-coffeesoft {
                background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
                color: #F5DEB3;
            }
            .theme-coffeesoft .border {
                border-color: #CD853F !important;
            }
            .theme-coffeesoft .bg-white {
                background-color: #8B4513 !important;
                color: #F5DEB3 !important;
            }
            .theme-coffeesoft .text-gray-700 {
                color: #F5DEB3 !important;
            }
            .theme-coffeesoft .bg-gray-50 {
                background-color: #A0522D !important;
            }
            .theme-coffeesoft .shadow-lg {
                box-shadow: 0 10px 15px -3px rgba(139, 69, 19, 0.3) !important;
            }
        `);
        
        // Remover estilo anterior si existe
        $('#coffeesoft-theme').remove();
        $('head').append(style);
    }

    // Components.
    dashboardComponent(options) {
        const defaults = {
            parent: "root",
            id: "dashboardComponent",
            title: "📊 Huubie · Dashboard de Eventos",
            subtitle: "Resumen mensual · Cotizaciones · Pagados · Cancelados",
            json: [
                { type: "card", id: "infoCards", class: '' },
                { type: "grafico", id: "barChartContainer", title: "Eventos por sucursal" },
                { type: "tabla", id: "tableSucursal", title: "Tabla de sucursales" },
                { type: "grafico", id: "donutChartContainer", title: "Ventas vs Entrada de dinero" },
                { type: "grafico", id: "topClientsChartContainer", title: "Top 10 clientes" },
                { type: "tabla", id: "tableClientes", title: "Tabla de clientes" }
            ]
        };

        const opts = Object.assign(defaults, options);

        const container = $(`
        <div id="${opts.id}" class="w-full bg-[#111928] text-white">
            <!-- Header -->
            <header class="bg-[#0F172A] p-6 border-b border-[#1E293B] ">
                <div class="max-w-7xl mx-auto">
                    <h1 class="text-2xl font-bold text-white">${opts.title}</h1>
                    <p class="text-sm text-slate-300">${opts.subtitle}</p>
                </div>
            </header>

            <!-- FilterBar -->
            <section id="filterBarDashboard" class="max-w-7xl mx-auto px-4 py-4 ">
                <!-- Aquí puedes renderizar selects, inputs o botones -->
            </section>

            <!-- Content -->
            <section id="content-${opts.id}" class="max-w-7xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-2"></section>
        </div>`);

        // Renderizar contenedores desde JSON
        opts.json.forEach(item => {
            let block = $("<div>", {
                id: item.id,
                class: "bg-slate-800 p-4 rounded-xl shadow min-h-[200px]"
            });

            if (item.title) {
                // Emojis por defecto según el tipo
                const defaultEmojis = {
                    'grafico': '📊',
                    'tabla': '📋',
                    'doc': '📄',
                    'filterBar': '🔍'
                };

                // Usar emoji personalizado o por defecto
                const emoji = item.emoji || defaultEmojis[item.type] || '';
                
                // Usar icono si está definido
                const iconHtml = item.icon ? `<i class="${item.icon}"></i> ` : '';
                
                // Construir el título con emoji e icono
                const titleContent = `${emoji} ${iconHtml}${item.title}`;
                
                block.prepend(`<h3 class="text-sm font-bold mb-2">${titleContent}</h3>`);
            }

            // Procesar contenido personalizado antes de agregar el bloque
            if (item.content && Array.isArray(item.content)) {
                item.content.forEach(contentItem => {
                    const element = $(`<${contentItem.type}>`, {
                        id: contentItem.id || '',
                        class: contentItem.class || '',
                        text: contentItem.text || ''
                    });
                    
                    // Agregar atributos adicionales si existen
                    if (contentItem.attributes) {
                        Object.keys(contentItem.attributes).forEach(attr => {
                            element.attr(attr, contentItem.attributes[attr]);
                        });
                    }
                    
                    // Agregar HTML interno si existe
                    if (contentItem.html) {
                        element.html(contentItem.html);
                    }
                    
                    // Agregar el contenido directamente al bloque
                    block.append(element);
                });
            }
            
            $(`#content-${opts.id}`, container).append(block);
        });

        $(`#${opts.parent}`).html(container);
    }

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

    barChart(options) {
        const defaults = {
            parent: "containerChequePro",
            id: "chart",
            title: "",
            class: "border p-4 rounded-xl",
            data: {},
            json: [],
            onShow: () => { },
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", { class: opts.class });

        const title = $("<h2>", {
            class: "text-lg font-bold mb-2",
            text: opts.title
        });

        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-[300px]"
        });

        container.append(title, canvas);
        $('#' + opts.parent).append(container); // 🔹 cambio: append en vez de html()

        const ctx = document.getElementById(opts.id).getContext("2d");

        // 🔹 guardar instancias de charts en un objeto
        if (!window._charts) window._charts = {};

        if (window._charts[opts.id]) {
            window._charts[opts.id].destroy();
        }

        window._charts[opts.id] = new Chart(ctx, {
            type: "bar",
            data: opts.data,
            options: {
                responsive: true,
                animation: {
                    onComplete: function () { }
                },
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${formatPrice(ctx.parsed.y)}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (v) => formatPrice(v)
                        }
                    }
                }
            }
        });
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
