let api = 'ctrl/ctrl-social-networks.php';
let app, dashboardSocialNetwork, registerSocialNetWork, report, adminMetrics, adminSocialNetWork;

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
    report = new ReportSocialNetwork(api, "root");

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
        registerSocialNetWork.render()
        report.render();
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
                    onClick: () => dashboardSocialNetwork.renderDashboard()
                },
                {
                    id: "capture",
                    tab: "Captura de información",
                    active: true,
                    onClick: () => registerSocialNetWork.render()
                },
                {
                    id: "report",
                    tab: "Reportes",

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
                { type: "grafico", id: "containerMonthlyComparative", title: 'Comparitva mensual' },
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
        setTimeout(() => {
            // $(`#filterBarDashboard #mes`).val(currentMonth).trigger("change");
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
            ROI: item.roi
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
        this.layoutCaptureForm()
    }

    layout() {
        this.primaryLayout({
            parent: `container-capture`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  pb-2', id: `filterBar${this.PROJECT_NAME}` },
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

            ],
        });
    }

    layoutCaptureForm() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                <!-- Formulario de Captura -->
                <div class="bg-white rounded-lg border p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <i class="icon-edit text-blue-600 text-xl"></i>
                        <h3 class="text-lg font-semibold text-gray-800">Capturar Métricas Manualmente</h3>
                    </div>

                    <div id="capture-filters" class="mb-4"></div>
                    <div id="metrics-inputs" class="grid grid-cols-2 gap-3 border rounded p-3 "></div>
                    
                    <button id="btnSaveCapture" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-lg mt-4 flex items-center justify-center gap-2">
                        <i class="icon-check"></i>
                        Actualizar Métrica
                    </button>


                </div>

                <!-- Historial de Métricas -->
                <div class="bg-white rounded-lg border  p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <i class="icon-clock text-green-600 text-xl"></i>
                        <h3 class="text-lg font-semibold text-gray-800">Historial de Métricas</h3>
                    </div>
                    <div id="history-container" class="space-y-3"></div>
                </div>
            </div>
        `);

        this.createCaptureFilters();
        this.loadHistory();
    }

    async loadHistory() {
        const container = $('#history-container');
        container.html('<p class="text-gray-500 text-center">Cargando historial...</p>');

        const response = await useFetch({
            url: api,
            data: {
                opc: "apiGetHistoryMetrics"
            }
        });

        if (response.status !== 200) {
            container.html('<p class="text-red-500 text-center">Error al cargar el historial</p>');
            return;
        }

        const history = response.data;

        if (!history || history.length === 0) {
            container.html('<p class="text-gray-500 text-center">No hay registros en el historial</p>');
            return;
        }

        container.empty();
        history.forEach(item => {
            const card = $(`
                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: ${item.color}20;">
                                <i class="${item.icon}" style="color: ${item.color}; font-size: 20px;"></i>
                            </div>
                            <span class="font-semibold text-gray-800">${item.network}</span>
                        </div>
                        <span class="text-sm text-gray-500">${item.date}</span>
                    </div>
                    <div class="space-y-2 mb-3">
                        ${item.metrics.map(m => `
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">${m.name}:</span>
                                <span class="font-medium">${m.value}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="flex gap-2">
                        <button class="flex-1 text-blue-600 hover:bg-blue-50 py-2 px-3 rounded text-sm font-medium transition" onclick="registerSocialNetWork.editHistory(${item.id})">
                            <i class="icon-edit mr-1"></i> Editar
                        </button>
                        <button class="flex-1 text-red-600 hover:bg-red-50 py-2 px-3 rounded text-sm font-medium transition" onclick="registerSocialNetWork.deleteHistory(${item.id})">
                            <i class="icon-trash mr-1"></i> Eliminar
                        </button>
                    </div>
                </div>
            `);
            container.append(card);
        });
    }



    createCaptureFilters() {
        const container = $('#capture-filters');
        container.html(`
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Red Social</label>
                <select id="captureNetwork" class="form-select w-full" onchange="registerSocialNetWork.loadMetrics()">
                    <option value="">Seleccionar...</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de la Métrica</label>
                <input type="date" id="captureDate" class="form-control w-full" value="${moment().format('YYYY-MM-DD')}">
            </div>
        `);

        // Llenar select de redes sociales
        socialNetworks.forEach(network => {
            $('#captureNetwork').append(`<option value="${network.id}">${network.valor}</option>`);
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
            container.html('<p class="col-span-2 text-gray-500 text-center py-4">Selecciona una red social para ver sus métricas</p>');
            return;
        }

        metrics.forEach(metric => {
            const input = $(`
                <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">${metric.name}</label>
                    <input type="number" 
                           class="form-control w-full metric-input" 
                           data-metric-id="${metric.id}"
                           data-metric-name="${metric.name}"
                           placeholder="0"
                           step="1">
                </div>
            `);
            container.append(input);
        });

        $('#btnSaveCapture').off('click').on('click', () => this.saveCapture());
    }

    async saveCapture() {
        const networkId = $('#captureNetwork').val();
        const captureDate = $('#captureDate').val();

        if (!networkId || !captureDate) {
            alert({ icon: "warning", text: "Por favor selecciona una red social y fecha" });
            return;
        }

        const date = moment(captureDate);
        const month = date.month() + 1;
        const year = date.year();

        const metrics = [];
        $('.metric-input').each(function () {
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
            this.loadHistory();
        } else {
            alert({ icon: "error", text: response.message });
        }
    }



    async editCapture(id) {
        const response = await useFetch({
            url: api,
            data: {
                opc: "getCaptureById",
                id: id
            }
        });

        if (response.status !== 200) {
            alert({ icon: "error", text: "No se pudo cargar la información" });
            return;
        }

        const capture = response.data;

        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <i class="icon-edit text-blue-600 text-xl"></i>
                        <h3 class="text-lg font-semibold text-gray-800">Editar Captura de Métricas</h3>
                    </div>
                    <div id="edit-capture-info" class="mb-4"></div>
                    <div id="edit-metrics-inputs" class="grid grid-cols-2 gap-3"></div>
                    <div class="flex gap-2 mt-4">
                        <button id="btnUpdateCapture" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                            <i class="icon-check"></i>
                            Actualizar Métrica
                        </button>
                        <button id="btnCancelEdit" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                            <i class="icon-close"></i>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `);

        $('#edit-capture-info').html(`
            <div class="bg-gray-50 p-3 rounded-lg mb-3">
                <div class="flex items-center gap-2 mb-2">
                    <i class="${capture.social_network_icon}" style="color: ${capture.social_network_color}; font-size: 24px;"></i>
                    <span class="font-semibold">${capture.social_network_name}</span>
                </div>
                <p class="text-sm text-gray-600">Fecha: ${capture.date}</p>
            </div>
        `);

        const metricsContainer = $('#edit-metrics-inputs');
        capture.metrics.forEach(metric => {
            const input = $(`
                <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">${metric.name}</label>
                    <input type="number" 
                           class="form-control w-full metric-input-edit" 
                           data-metric-id="${metric.metric_id}"
                           data-historial-metric-id="${metric.historial_metric_id}"
                           value="${metric.value}"
                           placeholder="0"
                           step="1">
                </div>
            `);
            metricsContainer.append(input);
        });

        $('#btnUpdateCapture').on('click', () => this.updateCapture(id));
        $('#btnCancelEdit').on('click', () => this.layoutCaptureForm());
    }

    async updateCapture(id) {
        const metrics = [];
        $('.metric-input-edit').each(function () {
            const value = $(this).val();
            if (value) {
                metrics.push({
                    historial_metric_id: $(this).data('historial-metric-id'),
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
                opc: "updateCaptureMetrics",
                id: id,
                metrics: JSON.stringify(metrics)
            }
        });

        if (response.status === 200) {
            alert({ icon: "success", text: response.message });
            this.layoutCaptureForm();
        } else {
            alert({ icon: "error", text: response.message });
        }
    }

    deleteCapture(id) {
        this.swalQuestion({
            opts: {
                title: "¿Eliminar esta captura?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
            },
            data: {
                opc: "deleteCapture",
                id: id,
            },
            methods: {
                send: () => {
                    alert({ icon: "success", text: "Captura eliminada correctamente" });
                    this.loadHistory();
                },
            },
        });
    }

    editHistory(id) {
        this.editCapture(id);
    }

    deleteHistory(id) {
        this.deleteCapture(id);
    }
}

class ReportSocialNetwork extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "report";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsMonthlyComparative();
    }

    layout() {
        this.primaryLayout({
            parent: `container-report`,
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
                    onchange: `report.updateView()`,
                },
                {
                    opc: "select",
                    id: "social_network_id",
                    lbl: "Red Social",
                    class: "col-sm-3",
                    data: socialNetworks,
                    onchange: `report.updateView()`,
                },
                {
                    opc: "select",
                    id: "year",
                    lbl: "Año",
                    class: "col-sm-2",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: `report.updateView()`,
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
                    onchange: `report.updateView()`,
                },
            ],
        });
    }

    updateView() {
        const reportType = $('#filterBarreport #reportType').val();

        switch (reportType) {
            case "1":
                this.lsAnualReport();
                break;
            case "2":
                this.lsMonthlyComparative();
                break;
            case "3":
                this.lsAnnualComparative();
                break;

        }

    }

    // Concentrado anual.

    lsAnualReport() {
        const year = $('#filterBarreport #year').val();
        const networkId = $('#filterBarreport #social_network_id').val();
        const networkName = $('#filterBarreport #social_network_id option:selected').text();

        const title = networkId ? `📊 Concentrado Anual - ${networkName}` : '📊 Concentrado Anual';

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'apiAnnualReport' },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                title: title,
                subtitle: `Resumen de métricas por mes del año ${year}`,
                id: "tbAnnualReport",
                theme: 'corporativo',
                center: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                striped: true
            },
        });
    }

    lsMonthlyComparative() {
        const year = $('#filterBarreport #year').val();
        const networkId = $('#filterBarreport #socialNetwork').val();
        const networkName = $('#filterBarreport #socialNetwork option:selected').text();

        const title = networkId ? `📊 Comparativa Mensual - ${networkName}` : '📊 Comparativa Mensual';

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'apiMonthlyComparative' },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                title: title,
                subtitle: `Comparación mes a mes del año ${year}`,
                id: "tbMonthlyComparative",
                theme: 'corporativo',
                center: [1, 2, 3],
                right: [4],
                striped: true
            },
        });
    }

    lsAnnualComparative() {

        const year = $('#filterBarreport #year').val();
        const networkId = $('#filterBarreport #socialNetwork').val();
        const networkName = $('#filterBarreport #socialNetwork option:selected').text();

        const title = networkId ? `📊 Comparativa Anual - ${networkName}` : '📊 Comparativa Anual';

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'apiAnnualComparative' },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                title: title,
                subtitle: `Comparación año ${year} vs ${year - 1}`,
                id: "tbAnnualComparative",
                theme: 'corporativo',
                center: [1, 2, 3],
                right: [4],
                striped: true
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
                    opc: "select",
                    id: "socialNetwork",
                    lbl: "Red Social",
                    class: "col-sm-3",
                    data: [
                        { id: "", valor: "-- Todas las redes sociales --" },
                        ...socialNetworks
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
                theme: 'corporativo',
                center: [2, 3],
                striped: true
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
            json: this.jsonMetric(),
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
            json: this.jsonMetric(),
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

    jsonMetric() {
        return [
            {
                opc: "select",
                id: "red_social_id",
                lbl: "Red Social",
                class: "col-12 mb-3",
                data: socialNetworks,
                text: "valor",
                value: "id"
            },
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre de la Métrica",
                class: "col-12 mb-3"
            },

        ];
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
                filterBar: { class: 'w-full ', id: `filterBar${this.PROJECT_NAME}` },
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
        $(`#container${this.PROJECT_NAME}`).html(`<div id="container-table-networks"></div>`);

        this.createTable({
            parent: "container-table-networks",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsSocialNetworks' },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbNetworks",
                theme: 'corporativo',
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
            json: this.jsonSocialNetwork(),
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
            json: this.jsonSocialNetwork(),
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

    jsonSocialNetwork() {
        return [
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre de la Red Social",
                class: "col-12 mb-3"
            },
            {
                opc: "input",
                id: "icono",
                lbl: "Icono ",
                class: "col-12 mb-3",
                placeholder: "icon-facebook"
            },
            {
                opc: "input",
                id: "color",
                lbl: "Color (Hex)",
                class: "col-12 mb-3",
                placeholder: "#1877F2"
            },
        ];
    }

}
