class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "orders";
    }

    init() {
        this.render();
    }

    render() {
        this.renderModules();

    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full" },
                container: { class: "w-full h-full" },
            },
        });
    }

    // 🔷 Layout alterno (pedidos)
    layoutPedidos() {

        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: "w-full" },
                container: { class: "w-full h-full" },
            },
        });


        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: "tabsCostsSys",
            type: "short",
            json: [
                { id: "dashboard", tab: "Dashboard", onClick: () => orderDashboard.init() },
                { id: "order", tab: "Historial de pedidos"  },
                { id: "orderDay", tab: "Capturar Información de pedidos"   },
                { id: "clients", tab: "Clientes", active: true  },
                { id: "categoria", tab: "Categoría" },
                { id: "Concept", tab: "Conceptos" }

            ],
        });

        this.headerBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            title: "📊 Pedidos",
            subtitle: "Consulta los pedidos y las redes sociales.",
            onClick: () => app.init(),
        });

        orderDashboard.init();
        order.render();
        orderDay.render();
        category.render();
        concept.render();
        clients.render();
    }

    layoutRedes() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterBarRedes" },
                container: { class: "w-full h-full", id: "containerRedes" },
            },
        });

        this.headerBar({
            parent: `filterBarRedes`,
            title: "📱 Redes Sociales",
            subtitle: "Monitorea la actividad de redes sociales y estadísticas de interacción.",
            onClick: () => app.init(),
        });

        // Tabs
        this.tabLayout({
            parent: "containerRedes",
            id: "tabsRedes",
            theme:'light',
            type: "short",
            json: [
                { id: "dashboard", tab: "Dashboard",  },
                { id: "redes", tab: "Capturar Información de redes" },
                { id: "metricas", tab: "Metricas"},
                { id: "socialnetwork", tab: "Redes Sociales", active: true, onClick: () => { redesCategory.lsSocialNetwork() } },
            ],
        });

        $('#content-tabsRedes').removeClass('h-screen');

        redesDashboard.render();
        redes.render();
        redesCategory.render();
        metricas.render();

    }

    layoutCostsys() {

        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterCostsys" },
                container: { class: "w-full h-full", id: "containerCostsys" },
            },
        });

        this.tabLayout({
            parent: `containerCostsys`,
            id: "tabsCostsSys",
            type: "short",
            json: [
                { id: "Dashboard", tab: "Dashboard", active: true, onClick: () => { analitycs_costsys.renderDashboard() }  },
                { id: "costoPotencial", tab: "Costo Potencial"},
                { id: "desplazamiento", tab: "Desplazamiento Mensual" },
                { id: "ventas", tab: "Ventas Mensual"  }
            ]
        });

        $('#content-tabsCostsSys').removeClass('h-screen');

        this.headerBar({
            parent: `filterCostsys`,
            title: "📊 Panel CostSys",
            subtitle: "Consulta y visualiza ventas, costos y desplazamientos.",
            onClick: () => app.init(),
        });

        analitycs_costsys.render();
        // Costsys
        costsys.layoutCostoPotencial();
        costsys.filterBarCostoPotencial();
        costsys.lsCostoPotencial();

        // Desplazamiento por Mes

        costsys.layoutDesplazamiento();
        costsys.filterBarDesplazamiento();
        costsys.lsDesplazamiento();

         // Ventas

        costsys.layoutVentas();
        costsys.filterBarVentas();
        costsys.lsVentas();




    }

    layoutCampaign() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: 'w-full my-3', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full my-3 h-full rounded-lg p-3', id: 'container' + this.PROJECT_NAME }
            }
        });

        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabsCampaign",
            content: { class: "" },
            theme: "dark",
            type: 'short',
            json: [
                {
                    id: "clasificacion",
                    tab: "Clasificación de Campaña",
                    onClick: () => campaignClassification.lsCampaignClassification()
                },
                {
                    id: "tipos",
                    tab: "Tipos de Campaña",
                    class: 'mb-1',
                    onClick: () => campaignTypes.lsCampaignTypes(),
                    active: true,
                },
               
            ]
        });

        this.headerBar({
            parent: `filterBarorders`,
            title: "📊 Administrador de Campañas",
            subtitle: "Gestiona tipos y clasificaciones de campañas.",
            onClick: () => app.init(),
        });



    }

  

    // 🔷 Panel de módulos
    renderModules() {
        $("#root").empty();

        this.moduleCard({
            parent: "root",
            theme: "light",
            title: "Panel principal",
            subtitle: "Consulta rápida de métricas clave del sistema",
            json: [
                {
                    titulo: "Modulo de Costsys",
                    descripcion: "Accede a reportes de costos",
                    icon: "icon-food",
                    color: "bg-green-200",
                    textColor: "text-green-600",
                    borderColor: "green-600",
                    onClick: () => this.layoutCostsys(),
                },
                {
                    titulo: "Modulo de Ventas",
                    descripcion: "Consulta las métricas de ventas",
                    icon: "icon icon-dollar",
                    color: "bg-blue-200",
                    textColor: "text-blue-600",
                    borderColor: "border-blue-600",
                    onClick: () => soft.render(),
                },

                {
                    titulo: "Modulo de Pedidos",
                    descripcion: "Revisa actividad de pedidos",
                    icon: "icon-shopping-bag",
                    color: "bg-purple-200",
                    textColor: "text-purple-600",
                    onClick: () => this.layoutPedidos(),
                },

                {
                    titulo: "Modulo Redes Sociales",
                    descripcion: "Revisa actividad social",
                    icon: "icon-instagram",
                    color: "bg-pink-200",
                    textColor: "text-pink-600",
                    onClick: () => this.layoutRedes(),
                },


                 {
                    titulo: "Módulo de Campañas",
                    descripcion: "Revisa campañas y anuncios",
                    icon: "icon-megaphone",
                    color: "bg-orange-200",
                    textColor: "text-orange-600",
                    onClick: () => this.layoutCampaign (),
                },

            ]
        });
    }

    // 🔧 COMPONENTES
    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Default Title",
            subtitle: "Default subtitle",
            onClick: null,
        };

        const opts = Object.assign({}, defaults, options);

        const container = $(`
            <div class="flex justify-between items-center px-2 pt-3 pb-3">
                <div>
                    <h2 class="text-2xl font-semibold">${opts.title}</h2>
                    <p class="text-gray-400">${opts.subtitle}</p>
                </div>
                <div>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition flex items-center">
                        <i class="icon-home mr-2"></i>Inicio
                    </button>
                </div>
            </div>
        `);

        container.find("button").on("click", () => {
            if (typeof opts.onClick === "function") {
                opts.onClick();
            }
        });

        $(`#${opts.parent}`).append(container);
    }

    moduleCard(options) {
        const defaults = {
            parent: "cardInicioContainer",
            title: "",
            subtitle: "",
            theme: "light",
            json: [],
        };

        const opts = Object.assign({}, defaults, options);
        const isDark = opts.theme === "dark";

        const colors = {
            cardBg: isDark ? "bg-[#2C3544]" : "",
            titleColor: isDark ? "text-white" : "text-gray-800",
            subtitleColor: isDark ? "text-gray-400" : "text-gray-600",
            badgeColor: isDark ? "bg-blue-800 text-white" : "bg-blue-100 text-blue-800"
        };

        const titleContainer = $("<div>", { class: "w-full px-4 mt-3 mb-2" });
        const title = $("<h1>", { class: "text-2xl font-bold text-gray-900 mb-2", text: opts.title });
        const subtitle = $("<p>", { class: colors.subtitleColor + " ", text: opts.subtitle });
        titleContainer.append(title, subtitle);

        const container = $("<div>", {
            class: "w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4",
        });


        opts.json.forEach((item) => {
            let iconContent = item.icon
                ? `<div class="w-14 h-14 flex items-center justify-center ${item.color} ${item.textColor} rounded-lg text-xl mb-4 group-hover:bg-opacity-80 transition-all"><i class="${item.icon}"></i></div>`
                : item.imagen
                    ? `<img class="w-14 h-14 rounded-lg mb-3" src="${item.imagen}" alt="${item.titulo}">`
                    : "";

            const badge = item.badge
                ? `<span class="px-2 py-0.5 rounded-full text-xs font-medium ${colors.badgeColor}">${item.badge}</span>`
                : "";

            const card = $(`

                       <div class="group relative h-[250px] ${colors.cardBg} rounded-xl shadow-md
                        overflow-hidden p-4 flex flex-col justify-between cursor-pointer
                        border border-transparent  hover:scale-[1.05] hover:border-blue-700
                       transition-transform duration-300 ease-in-out transform font-[Poppins]">

                        <div class="flex justify-between items-start">
                            ${iconContent}
                            ${badge}
                        </div>
                        <div class="flex-grow flex flex-col justify-center ">
                            <h2 class="text-lg font-bold ${colors.titleColor}">${item.titulo}</h2>
                            ${item.descripcion ? `<p class="${colors.subtitleColor} text-sm mt-1">${item.descripcion}</p>` : ""}
                        </div>
                        <div class="mt-4 flex items-center ${item.textColor} text-[12px]">
                            <span>Acceder</span>
                            <i class="icon-right-1 ml-2 text-xs transition-transform group-hover:translate-x-2"></i>
                        </div>
                    </div>
                `).click(function () {


                // Ejecutar acciones
                if (item.enlace) window.location.href = item.enlace;
                if (item.onClick) item.onClick();
            });

            container.append(card);

        });

        const div = $('<div>',{
            class:'lg:px-8 mt-5'
        });
        div.append(titleContainer, container);

        $(`#${opts.parent}`).empty().append(div);
    }





}


// Costsys.

class CostoPotencial extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "CostoPotencial";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: {
                    class: "w-full",
                    id: "filterBarCosto"
                },
                container: {
                    class: "w-full my-3 h-full rounded-lg p-3",
                    id: "container-costo-potencial"
                }
            }
        });

        $("#container-CostoPotencial").prepend(`
            <div class="px-4 pt-3">
                <h2 class="text-xl font-bold">💸 Costo Potencial por Red</h2>
                <p class="text-gray-500 text-sm">Análisis mensual del gasto estimado en redes sociales.</p>
            </div>
        `);

        this.filterBarCosto();
        this.lsCostoPotencial();
    }

    filterBarCosto() {
        $("#container-costo-potencial").prepend(`
            <div id="filterbar-costo" class="mb-3"></div>
            <div id="tabla-costo-potencial"></div>
        `);

        this.createfilterBar({
            parent: "filterbar-costo",
            data: [
                {
                    opc: "select",
                    id: "redSocial",
                    class: "col-md-3",
                    lbl: "Red Social",
                    data: [
                        { id: "facebook", valor: "FACEBOOK" },
                        { id: "instagram", valor: "INSTAGRAM" },
                        { id: "tiktok", valor: "TIKTOK" }
                    ],
                    onchange: "costo.lsCostoPotencial()"
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
                    onchange: "costo.lsCostoPotencial()"
                },
                {
                    opc: "select",
                    id: "report",
                    class: "col-md-2",
                    lbl: "Reporte",
                    data: [
                        { id: 1, valor: "Concentrado anual" },
                        { id: 2, valor: "Comparativa mensual" },
                        { id: 3, valor: "Comparativa anual" }
                    ],
                    onchange: "costo.lsCostoPotencial()"
                },
                {
                    opc: "button",
                    class: "col-md-3",
                    className: "w-100",
                    id: "btnNuevoCosto",
                    text: "+ Nueva estimación mensual",
                    onClick: () => this.agregarCosto()
                }
            ]
        });
    }

    lsCostoPotencial() {
        const red = $("#redSocial").val();
        const reporte = $("#report").val();
        let data = {};

        if (red === "facebook") {
            if (reporte == "2") {
                data = this.jsonComparacionFacebook();
            } else if (reporte == "3") {
                data = this.jsonComparacionFacebookAnual();
            } else {
                data = this.jsonCapturaRedes();
            }
        } else if (red === "instagram") {
            data = this.jsonCapturaInstagram();
        } else if (red === "tiktok") {
            data = this.jsonCapturaTikTok();
        }

        this.createCoffeTable({
            parent: "tabla-costo-potencial",
            id: "tbCostoPotencial",
            theme: "corporativo",
            data: data,
            f_size: 14,
            center: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            color_group: 'bg-pink-100'
        });
    }

    agregarCosto() {
        console.log("Mostrar formulario para nueva estimación mensual...");
    }

    jsonCapturaRedes() {
        return {
            row: [
                {
                    "Métrica": "Inversión total de pautas",
                    "Enero": "$1,373.31",
                    "Febrero": "$1,350.33",
                    "Marzo": "$2,786.73",
                    "Abril": "$1,313.62",
                    "Mayo": "$1,048.12",
                    "Junio": "$1,919.62",
                    "Julio": "$3,200.00",
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": "$13,991.73"
                }
            ],
            th: "0"
        };
    }

    jsonCapturaInstagram() {
        return {
            row: [
                {
                    "Métrica": "Inversión total de pautas",
                    "Enero": "$1,375.70",
                    "Febrero": "$0.00",
                    "Marzo": "$2,364.00",
                    "Abril": "$1,176.68",
                    "Mayo": "$4,139.37",
                    "Junio": "$0.00",
                    "Julio": "$1,200.00",
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": "$10,255.75"
                }
            ],
            th: "0"
        };
    }

    jsonComparacionFacebook() {
        return {
            row: [
                {
                    "Métrica": "Inversión total de pautas",
                    "Junio-2025": "$1,919.62",
                    "Julio-2025": "$3,200.00",
                    "Comparación": "$1,280.38",
                    "%": "66.7%"
                }
            ],
            th: "0"
        };
    }

    jsonComparacionFacebookAnual() {
        return {
            row: [
                {
                    "Métrica": "Inversión total de pautas",
                    "Año-2024": "$800.00",
                    "Año-2025": "$4,133.99",
                    "Comparación": "$3,333.99",
                    "%": "425.0%"
                }
            ],
            th: "0"
        };
    }

    jsonCapturaTikTok() {
        return {
            row: [
                {
                    "Métrica": "Inversión total de pautas",
                    "Enero": "$0.00",
                    "Febrero": "$0.00",
                    "Marzo": "$0.00",
                    "Abril": "$0.00",
                    "Mayo": "$0.00",
                    "Junio": "$0.00",
                    "Julio": "$0.00",
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": "$0.00"
                }
            ],
            th: "0"
        };
    }
}



