let api = 'ctrl/ctrl-kpí-campaign.php';
let app, dashboardSocialNetwork, registerSocialNetWork, adminMetrics, adminSocialNetWork;

let udn, lsudn, socialNetworks, metrics;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn = data.udn;
    lsudn = data.lsudn;
    socialNetworks = data.socialNetworks;
    metrics = data.metrics;

    app = new App(api, "root");
    dashboardSocialNetwork = new DashboardSocialNetwork(api, "root");
    registerSocialNetWork = new RegisterSocialNetWork(api, "root");
    adminMetrics = new AdminMetrics(api, "root");
    adminSocialNetWork = new AdminSocialNetWork(api, "root");
    
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SocialNetworks";
    }

    render() {
        this.layout();
        dashboardSocialNetwork.render();
        registerSocialNetWork.render();
        adminMetrics.render();
        adminSocialNetWork.render();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full h-full", id: "container" + this.PROJECT_NAME },
            },
        });

        this.headerBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            title: "📱 Módulo de Redes Sociales",
            subtitle: "Gestión y análisis de métricas de redes sociales",
            onClick: () => app.render(),
        });

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "short",
            json: [
                {
                    id: "dashboard",
                    tab: "Dashboard",
                    class: "mb-1",
                    active: true,
                    onClick: () => dashboardSocialNetwork.renderDashboard()
                },
                {
                    id: "capture",
                    tab: "Captura de información",
                    onClick: () => registerSocialNetWork.renderCapture()
                },
                {
                    id: "adminMetrics",
                    tab: "Administrador de métricas",
                    onClick: () => adminMetrics.lsMetrics()
                },
                {
                    id: "adminNetworks",
                    tab: "Administrador de redes sociales",
                    onClick: () => adminSocialNetWork.lsSocialNetworks()
                }
            ]
        });

        $('#content-tabs' + this.PROJECT_NAME).removeClass('h-screen');
    }

    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Título por defecto",
            subtitle: "Subtítulo por defecto",
            icon: "icon-home",
            textBtn: "Inicio",
            classBtn: "bg-blue-600 hover:bg-blue-700",
            onClick: null,
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

        const rightSection = $("<div>").append(
            $("<button>", {
                class: `${opts.classBtn} text-white font-semibold px-4 py-2 rounded transition flex items-center`,
                html: `<i class="${opts.icon} mr-2"></i>${opts.textBtn}`,
                click: () => {
                    if (typeof opts.onClick === "function") {
                        opts.onClick();
                    }
                }
            })
        );

        container.append(leftSection, rightSection);
        $(`#${opts.parent}`).html(container);
    }
}

class DashboardSocialNetwork extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Dashboard";
    }

    render() {
        this.layout();
    }

    async layout() {
        this.dashboardComponent({
            parent: "container-dashboard",
            id: "dashboardComponent",
            title: "📊 Dashboard de Redes Sociales",
            subtitle: "Análisis mensual de métricas por plataforma",
            json: [
                { type: "grafico", id: "containerMonthlyComparative" },
                { type: "grafico", id: "containerTrendChart", title: "Tendencia de Interacciones" },
                { type: "tabla", id: "containerComparativeTable", title: "Resumen General de Métricas" }
            ]
        });

        this.filterBarDashboard();
    }

    async renderDashboard() {
        let udn = $('#filterBarDashboard #udn').val();
        let month = $('#filterBarDashboard #mes').val();
        let year = $('#filterBarDashboard #anio').val();

        let data = await useFetch({
            url: api,
            data: {
                opc: "apiDashboardMetrics",
                udn: udn,
                mes: month,
                anio: year,
            },
        });

        this.showCards(data.dashboard);
    }

    filterBarDashboard() {
        this.createfilterBar({
            parent: `filterBarDashboard`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `dashboardSocialNetwork.renderDashboard()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `dashboardSocialNetwork.renderDashboard()`,
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-sm-3",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: `dashboardSocialNetwork.renderDashboard()`,
                },
            ],
        });
        const currentMonth = moment().month() + 1;
        setTimeout(() => {
            $(`#filterBarDashboard #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    showCards(data) {
        this.infoCard({
            parent: "cardDashboard",
            theme: "light",
            json: [
                {
                    id: "kpiReach",
                    title: "Total de Alcance",
                    data: {
                        value: data.totalReach,
                        color: "text-[#8CC63F]",
                    },
                },
                {
                    id: "kpiInteractions",
                    title: "Interacciones",
                    data: {
                        value: data.interactions,
                        color: "text-green-800",
                    },
                },
                {
                    title: "Visualizaciones del Mes",
                    data: {
                        value: data.monthViews,
                        color: "text-[#103B60]",
                    },
                },
                {
                    id: "kpiInvestment",
                    title: "Inversión Total",
                    data: {
                        value: data.totalInvestment,
                        color: "text-red-600",
                    },
                },
            ],
        });
    }

    dashboardComponent(options) {
        const defaults = {
            parent: "root",
            id: "dashboardComponent",
            title: "📊 Dashboard",
            subtitle: "Resumen de métricas",
            json: []
        };

        const opts = Object.assign(defaults, options);

        const container = $(`
        <div id="${opts.id}" class="w-full">
            <div class="p-6 border-b border-gray-200">
                <div class="mx-auto">
                    <h1 class="text-2xl font-bold text-[#103B60]">${opts.title}</h1>
                    <p class="text-sm text-gray-600">${opts.subtitle}</p>
                </div>
            </div>

            <div id="filterBarDashboard" class="mx-auto px-4 py-4"></div>

            <section id="cardDashboard" class="mx-auto px-4 py-4"></section>

            <section id="content-${opts.id}" class="mx-auto px-4 py-6 grid gap-6 lg:grid-cols-2"></section>
        </div>`);

        opts.json.forEach(item => {
            let block = $("<div>", {
                id: item.id,
                class: "bg-white p-4 rounded-xl shadow-md border border-gray-200 min-h-[200px]"
            });

            if (item.title) {
                block.prepend(`<h3 class="text-sm font-semibold text-gray-800 mb-3">${item.title}</h3>`);
            }

            $(`#content-${opts.id}`, container).append(block);
        });

        $(`#${opts.parent}`).html(container);
    }

    infoCard(options) {
        const defaults = {
            parent: "root",
            id: "infoCardKPI",
            class: "",
            theme: "light",
            json: [],
            data: {
                value: "0",
                description: "",
                color: "text-gray-800"
            }
        };
        const opts = Object.assign({}, defaults, options);
        const isDark = opts.theme === "dark";
        const cardBase = isDark
            ? "bg-[#1F2A37] text-white rounded-xl shadow"
            : "bg-white text-gray-800 rounded-xl shadow";
        const titleColor = isDark ? "text-gray-300" : "text-gray-600";

        const renderCard = (card, i = "") => {
            const box = $("<div>", {
                id: `${opts.id}_${i}`,
                class: `${cardBase} p-4`
            });
            const title = $("<p>", {
                class: `text-sm ${titleColor}`,
                text: card.title
            });
            const value = $("<p>", {
                id: card.id || "",
                class: `text-2xl font-bold ${card.data?.color || "text-white"}`,
                text: card.data?.value
            });
            box.append(title, value);
            return box;
        };

        const container = $("<div>", {
            id: opts.id,
            class: `grid grid-cols-2 md:grid-cols-4 gap-4 ${opts.class}`
        });

        if (opts.json.length > 0) {
            opts.json.forEach((item, i) => {
                container.append(renderCard(item, i));
            });
        }

        $(`#${opts.parent}`).html(container);
    }
}

class RegisterSocialNetWork extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Capture";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-capture`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    renderCapture() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📊 Captura de Información</h2>
                <p class="text-gray-400">Registra las métricas mensuales de redes sociales</p>
            </div>
        `);
    }
}

class AdminMetrics extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "AdminMetrics";
    }

    render() {
        this.layout();
        this.filterBar();
    }

    layout() {
        this.primaryLayout({
            parent: `container-adminMetrics`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    filterBar() {
        const container = $(`#container-${this.PROJECT_NAME}`);
        container.html(`<div id="filterbar-metrics" class="mb-2"></div><div id="table-metrics"></div>`);

        this.createfilterBar({
            parent: "filterbar-metrics",
            data: [
                {
                    opc: "select",
                    id: "active",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Disponibles" },
                        { id: "0", valor: "No disponibles" }
                    ],
                    onchange: 'adminMetrics.lsMetrics()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNewMetric",
                    text: "Nueva métrica",
                    onClick: () => this.addMetric(),
                },
            ],
        });
    }

    lsMetrics() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📊 Administrador de Métricas</h2>
                <p class="text-gray-400">Gestiona las métricas de captura por red social</p>
            </div>
            <div id="table-metrics"></div>
        `);

        this.filterBar();
    }

    addMetric() {
        alert({ icon: "info", text: "Función en desarrollo" });
    }
}

class AdminSocialNetWork extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "AdminNetworks";
    }

    render() {
        this.layout();
        this.filterBar();
    }

    layout() {
        this.primaryLayout({
            parent: `container-adminNetworks`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    filterBar() {
        const container = $(`#container-${this.PROJECT_NAME}`);
        container.html(`<div id="filterbar-networks" class="mb-2"></div><div id="table-networks"></div>`);

        this.createfilterBar({
            parent: "filterbar-networks",
            data: [
                {
                    opc: "select",
                    id: "active",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Disponibles" },
                        { id: "0", valor: "No disponibles" }
                    ],
                    onchange: 'adminSocialNetWork.lsSocialNetworks()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNewNetwork",
                    text: "Nueva red social",
                    onClick: () => this.addSocialNetwork(),
                },
            ],
        });
    }

    lsSocialNetworks() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📱 Administrador de Redes Sociales</h2>
                <p class="text-gray-400">Gestiona el catálogo de redes sociales</p>
            </div>
            <div id="table-networks"></div>
        `);

        this.filterBar();
    }

    addSocialNetwork() {
        alert({ icon: "info", text: "Función en desarrollo" });
    }
}
