let api = 'ctrl/ctrl-social-networks.php';
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
            subtitle: "Consulta las métricas de redes sociales por plataforma.",
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
                    onClick: () => registerSocialNetWork.render()
                },
                {
                    id: "adminMetrics",
                    tab: "Administrador de métricas",
                    onClick: () => adminMetrics.render()
                },
                {
                    id: "adminNetworks",
                    tab: "Administrador de redes sociales",
                    onClick: () => adminSocialNetWork.render()
                },
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

class DashboardSocialNetwork extends Templates {
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
                { type: "tabla", id: "containerComparativeTable", title: "Resumen General de Métricas" },
            ]
        });

        this.filterBarDashboard();

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
        this.monthlyComparative({ data: data.monthlyComparative });
        this.trendChart({ data: data.trendData });
        this.comparativeTable({ data: data.comparativeTable });
    }

    renderDashboard() {
        this.layout();
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

    monthlyComparative(options) {
        const defaults = {
            parent: "containerMonthlyComparative",
            id: "chartMonthlyComparative",
            title: "Comparativa Mensual por Red Social",
            class: "p-4",
            data: {},
        };
        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", { class: opts.class });
        const title = $("<h2>", {
            class: "text-lg font-bold mb-3",
            text: opts.title
        });
        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-[320px]"
        });

        container.append(title, canvas);
        $('#' + opts.parent).html(container);

        const ctx = document.getElementById(opts.id).getContext("2d");
        if (window._monthlyChart) window._monthlyChart.destroy();

        window._monthlyChart = new Chart(ctx, {
            type: "bar",
            data: opts.data,
            options: {
                responsive: true,
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

    trendChart(options) {
        const defaults = {
            parent: "containerTrendChart",
            id: "chartTrend",
            title: "Tendencia de Interacciones",
            class: "p-4",
            data: {},
        };
        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", { class: opts.class });
        const title = $("<h2>", {
            class: "text-lg font-bold mb-3",
            text: opts.title
        });
        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-[320px]"
        });

        container.append(title, canvas);
        $('#' + opts.parent).html(container);

        const ctx = document.getElementById(opts.id).getContext("2d");
        if (window._trendChart) window._trendChart.destroy();

        window._trendChart = new Chart(ctx, {
            type: "line",
            data: opts.data,
            options: {
                responsive: true,
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

    comparativeTable(options) {
        const defaults = {
            parent: "containerComparativeTable",
            data: []
        };
        const opts = Object.assign({}, defaults, options);

        const rows = opts.data.map(item => ({
            Plataforma: item.platform,
            Alcance: formatPrice(item.reach),
            Interacciones: formatPrice(item.interactions),
            Seguidores: formatPrice(item.followers),
            Inversión: formatPrice(item.investment),
            ROI: item.roi.toFixed(2)
        }));

        this.createCoffeTable({
            parent: opts.parent,
            id: "tableComparative",
            title: "📊 Resumen General de Métricas",
            theme: "light",
            data: {
                thead: ["Plataforma", "Alcance", "Interacciones", "Seguidores", "Inversión", "ROI"],
                row: rows
            },
            center: [1, 2, 3, 4, 5],
            right: [5]
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

        opts.json.forEach((item, i) => {
            container.append(renderCard(item, i));
        });

        $(`#${opts.parent}`).html(container);
    }
}

class RegisterSocialNetWork extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Capture";
    }

    render() {
        this.layout();
        this.filterBar();
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

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `registerSocialNetWork.updateView()`,
                },
                {
                    opc: "select",
                    id: "socialNetwork",
                    lbl: "Red Social",
                    class: "col-sm-3",
                    data: socialNetworks,
                    onchange: `registerSocialNetWork.updateView()`,
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-sm-2",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: `registerSocialNetWork.updateView()`,
                },
                {
                    opc: "select",
                    id: "reportType",
                    lbl: "Tipo de Reporte",
                    class: "col-sm-4",
                    data: [
                        { id: "1", valor: "Concentrado Anual" },
                        { id: "2", valor: "Comparativa Mensual" },
                        { id: "3", valor: "Comparativa Anual" },
                    ],
                    onchange: `registerSocialNetWork.updateView()`,
                },
            ],
        });
    }

    updateView() {
        const reportType = $('#filterBarCapture #reportType').val();
        
        switch(reportType) {
            case "1":
                this.showAnnualReport();
                break;
            case "2":
                this.showMonthlyComparative();
                break;
            case "3":
                this.showAnnualComparative();
                break;
            default:
                this.showCaptureForm();
        }
    }

    showCaptureForm() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📝 Captura de Información</h2>
                <p class="text-gray-400">Registra las métricas mensuales de redes sociales</p>
            </div>
            <div id="capture-form-container" class="p-4">
                <div class="bg-white rounded-lg shadow p-4">
                    <h3 class="text-lg font-semibold mb-4">Nueva Captura Mensual</h3>
                    <div id="capture-filters" class="mb-4"></div>
                    <div id="metrics-inputs"></div>
                    <button id="btnSaveCapture" class="btn btn-primary mt-3">Guardar Captura</button>
                </div>
            </div>
        `);

        this.createCaptureFilters();
    }

    createCaptureFilters() {
        this.createfilterBar({
            parent: 'capture-filters',
            data: [
                {
                    opc: "select",
                    id: "captureNetwork",
                    lbl: "Red Social",
                    class: "col-sm-4",
                    data: socialNetworks,
                    onchange: `registerSocialNetWork.loadMetrics()`,
                },
                {
                    opc: "select",
                    id: "captureMonth",
                    lbl: "Mes",
                    class: "col-sm-4",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                },
                {
                    opc: "select",
                    id: "captureYear",
                    lbl: "Año",
                    class: "col-sm-4",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                },
            ],
        });
    }

    async loadMetrics() {
        const networkId = $('#capture-filters #captureNetwork').val();
        
        if (!networkId) return;

        const data = await useFetch({
            url: api,
            data: {
                opc: "getMetricsByNetwork",
                social_network_id: networkId
            }
        });

        this.renderMetricsInputs(data.metrics);
    }

    renderMetricsInputs(metrics) {
        const container = $('#metrics-inputs');
        container.empty();

        if (!metrics || metrics.length === 0) {
            container.html('<p class="text-gray-500">No hay métricas configuradas para esta red social.</p>');
            return;
        }

        metrics.forEach(metric => {
            const input = $(`
                <div class="mb-3">
                    <label class="form-label">${metric.name}</label>
                    <input type="number" 
                           class="form-control metric-input" 
                           data-metric-id="${metric.id}"
                           placeholder="Ingrese el valor"
                           step="0.01">
                    <small class="text-muted">${metric.description || ''}</small>
                </div>
            `);
            container.append(input);
        });

        $('#btnSaveCapture').off('click').on('click', () => this.saveCapture());
    }

    async saveCapture() {
        const networkId = $('#capture-filters #captureNetwork').val();
        const month = $('#capture-filters #captureMonth').val();
        const year = $('#capture-filters #captureYear').val();

        if (!networkId || !month || !year) {
            alert({ icon: "warning", text: "Por favor complete todos los filtros" });
            return;
        }

        const metrics = [];
        $('.metric-input').each(function() {
            const value = $(this).val();
            if (value) {
                metrics.push({
                    metric_id: $(this).data('metric-id'),
                    value: parseFloat(value)
                });
            }
        });

        if (metrics.length === 0) {
            alert({ icon: "warning", text: "Por favor ingrese al menos una métrica" });
            return;
        }

        const response = await useFetch({
            url: api,
            data: {
                opc: "addCapture",
                social_network_id: networkId,
                month: month,
                year: year,
                metrics: JSON.stringify(metrics)
            }
        });

        if (response.status === 200) {
            alert({ icon: "success", text: response.message });
            $('.metric-input').val('');
        } else {
            alert({ icon: "error", text: response.message });
        }
    }

    async showAnnualReport() {
        const udn = $('#filterBarCapture #udn').val();
        const networkId = $('#filterBarCapture #socialNetwork').val();
        const year = $('#filterBarCapture #anio').val();

        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📊 Concentrado Anual</h2>
                <p class="text-gray-400">Resumen de métricas por mes del año ${year}</p>
            </div>
            <div id="annual-report-table"></div>
        `);

        this.createTable({
            parent: "annual-report-table",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { 
                opc: 'apiAnnualReport',
                udn: udn,
                social_network_id: networkId,
                year: year
            },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbAnnualReport",
                theme: 'light',
                right: [13]
            },
        });
    }

    async showMonthlyComparative() {
        const udn = $('#filterBarCapture #udn').val();
        const networkId = $('#filterBarCapture #socialNetwork').val();
        const year = $('#filterBarCapture #anio').val();

        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📊 Comparativa Mensual</h2>
                <p class="text-gray-400">Comparación mes a mes del año ${year}</p>
            </div>
            <div id="monthly-comparative-table"></div>
        `);

        this.createTable({
            parent: "monthly-comparative-table",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { 
                opc: 'apiMonthlyComparative',
                udn: udn,
                social_network_id: networkId,
                year: year
            },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbMonthlyComparative",
                theme: 'light',
                center: [1, 2, 3],
                right: [4]
            },
        });
    }

    async showAnnualComparative() {
        const udn = $('#filterBarCapture #udn').val();
        const networkId = $('#filterBarCapture #socialNetwork').val();
        const year = $('#filterBarCapture #anio').val();

        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📊 Comparativa Anual</h2>
                <p class="text-gray-400">Comparación año ${year} vs ${year - 1}</p>
            </div>
            <div id="annual-comparative-table"></div>
        `);

        this.createTable({
            parent: "annual-comparative-table",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { 
                opc: 'apiAnnualComparative',
                udn: udn,
                social_network_id: networkId,
                year: year
            },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbAnnualComparative",
                theme: 'light',
                center: [1, 2, 3],
                right: [4]
            },
        });
    }
}

class AdminMetrics extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "AdminMetrics";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsMetrics();
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
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `adminMetrics.lsMetrics()`,
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: `adminMetrics.lsMetrics()`,
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNewMetric",
                    text: "Nueva Métrica",
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
            <div id="container-table-metrics"></div>
        `);

        this.createTable({
            parent: "container-table-metrics",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsMetrics' },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbMetrics",
                theme: 'light',
                center: [2]
            },
        });
    }

    addMetric() {
        this.createModalForm({
            id: 'formMetricAdd',
            data: { opc: 'addMetric' },
            bootbox: {
                title: 'Agregar Métrica',
            },
            json: [
                {
                    opc: "select",
                    id: "social_network_id",
                    lbl: "Red Social",
                    class: "col-12 mb-3",
                    data: socialNetworks,
                    text: "valor",
                    value: "id"
                },
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la Métrica",
                    class: "col-12 mb-3"
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsMetrics();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editMetric(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getMetric",
                id: id,
            },
        });

        const metric = request.data;

        this.createModalForm({
            id: 'formMetricEdit',
            data: { opc: 'editMetric', id: metric.id },
            bootbox: {
                title: 'Editar Métrica',
            },
            autofill: metric,
            json: [
                {
                    opc: "select",
                    id: "social_network_id",
                    lbl: "Red Social",
                    class: "col-12 mb-3",
                    data: socialNetworks,
                    text: "valor",
                    value: "id"
                },
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la Métrica",
                    class: "col-12 mb-3"
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsMetrics();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message });
                }
            }
        });
    }

    statusMetric(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Desea cambiar el estado de la métrica?",
                text: "Esta acción activará o desactivará la métrica.",
                icon: "warning",
            },
            data: {
                opc: "statusMetric",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: () => this.lsMetrics(),
            },
        });
    }
}

class AdminSocialNetWork extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "AdminNetworks";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsSocialNetworks();
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
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `adminSocialNetWork.lsSocialNetworks()`,
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: `adminSocialNetWork.lsSocialNetworks()`,
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNewNetwork",
                    text: "Nueva Red Social",
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
            <div id="container-table-networks"></div>
        `);

        this.createTable({
            parent: "container-table-networks",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsSocialNetworks' },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbNetworks",
                theme: 'light',
                center: [2, 3]
            },
        });
    }

    addSocialNetwork() {
        this.createModalForm({
            id: 'formSocialNetworkAdd',
            data: { opc: 'addSocialNetwork' },
            bootbox: {
                title: 'Agregar Red Social',
            },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la Red Social",
                    class: "col-12 mb-3"
                },
                {
                    opc: "input",
                    id: "icon",
                    lbl: "Icono (Font Awesome)",
                    class: "col-12 mb-3",
                    placeholder: "fab fa-facebook"
                },
                {
                    opc: "input",
                    id: "color",
                    lbl: "Color (Hex)",
                    class: "col-12 mb-3",
                    placeholder: "#1877F2"
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsSocialNetworks();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editSocialNetwork(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getSocialNetwork",
                id: id,
            },
        });

        const network = request.data;

        this.createModalForm({
            id: 'formSocialNetworkEdit',
            data: { opc: 'editSocialNetwork', id: network.id },
            bootbox: {
                title: 'Editar Red Social',
            },
            autofill: network,
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la Red Social",
                    class: "col-12 mb-3"
                },
                {
                    opc: "input",
                    id: "icon",
                    lbl: "Icono (Font Awesome)",
                    class: "col-12 mb-3",
                    placeholder: "fab fa-facebook"
                },
                {
                    opc: "input",
                    id: "color",
                    lbl: "Color (Hex)",
                    class: "col-12 mb-3",
                    placeholder: "#1877F2"
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsSocialNetworks();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message });
                }
            }
        });
    }

    statusSocialNetwork(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Desea cambiar el estado de la red social?",
                text: "Esta acción activará o desactivará la red social.",
                icon: "warning",
            },
            data: {
                opc: "statusSocialNetwork",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: () => this.lsSocialNetworks(),
            },
        });
    }
}
