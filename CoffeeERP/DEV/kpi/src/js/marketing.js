let api = "ctrl/ctrl-ingresos.php";
let api_marketing = "ctrl/ctrl-marketing.php";
let api_redes_sociales = 'ctrl/ctrl-kpi-redes.php';
let soft, ingresos, comparativa, diario, acumulados;
let app, dashboard;

let order, orderDay, orderDashboard, category, clients, concept;
let redesCategory, metricas, redes, redesDashboard;
let udn, lsudn, clasification, mkt;

$(async () => {
    mkt = await useFetch({ url: api_marketing, data: { opc: "init" } });

    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn = data.udn;
    lsudn = data.lsudn;
    clasification = data.clasification;


    // Instancias globales.
    app = new App(api, "root");

    // ** KPI Costsys **
    costsys = new Costsys(api_costsys, 'root');
    analitycs_costsys = new AnalyticsCostsys(api_kpi_costsys, 'root');
    app.init();

    // Instancias.
    soft        = new SoftRestaurant(api, "root");
    ingresos    = new Ingresos(api, "root");
    comparativa = new ComparativaMensual(api, "root");
    diario      = new PromediosDiarios(api, "root");
    acumulados  = new PromediosAcumulados(api, "root");

    // ** KPI ORDER **
    orderDashboard = new OrderDashboard(api, "root");
    order          = new Order(api, "root");
    orderDay       = new OrderDay(api, "root");
    category       = new Category(api, "root");
    concept        = new Concept(api, "root");
    clients        = new Clients(api, "root");

    // ** KPI REDES **

    redesDashboard = new DashboardRedes(api_redes_sociales, "root");
    redes = new CapturaRedes(api_redes_sociales, "root");
    redesCategory = new RedesCategory(api_redes_sociales, "root");
    metricas = new Metricas(api_redes_sociales, "root");

    // init.
    // app.layoutRedes();

});


class SoftRestaurant extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Dashboard";
    }

    render() {
        this.layoutVentas();
        this.tabs();
        //
        this.layoutDashboard();
        this.filterBarDashboard();
        // init.
        ingresos.render();
        comparativa.init();
        diario.init();
        acumulados.init();
    }

    layoutVentas() {
        this.primaryLayout({
            parent: `root`,
            id: 'Ventas',
            card: {
                filterBar: { class: 'w-full   ', },
                container: { class: 'w-full  h-full ', }
            }
        });
        $(`#filterBarVentas`).append(`
            <div class="flex justify-between items-center px-2 pt-3 pb-3">
            <div>
            <h2 class="text-2xl font-semibold ">📊Módulo de ventas</h2>
            <p class="text-gray-400">Consulta las métricas de ventas.</p>
            </div>
            <div>
            <button id="btnBackHome" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition">
                <i class="icon-home mr-2"></i>Inicio
            </button>
            </div>
            </div>
        `);
        $("#btnBackHome").on("click", function () {
            app.init();
        });
    }

    tabs() {
        this.tabLayout({
            parent: `containerVentas`,
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
                    onClick: () => this.renderDashboard()
                },
                {
                    id: "modIngresos",
                    tab: "Módulo ingresos",
                    onClick: () => {
                        // ingresos.lsIngresos()
                    }
                },
                {
                    id: "comparativasMensuales",
                    tab: "Comparativas mensuales",
                    onClick: () => {
                        comparativa.lsComparativa()
                    }
                },
                // {
                //     id: "promediosDiarios",
                //     tab: "Promedios diarios",
                //     onClick: () => {
                //     }
                // },
                {
                    id: "promediosAcumulados",
                    tab: "Promedios acumulados",
                    onClick: () => {
                    }
                },
            ]
        });
    }
    // Dashboard.
    layoutDashboard() {
        this.primaryLayout({
            parent: `container-dashboard`,
            id: 'dashboard',
            card: {
                filterBar: { class: 'w-full  rounded', id: `container-filterBar` },
                container: { class: 'w-full   h-full mt-3  ', id: `containerDashboard` }
            }
        });
        $("#container-filterBar").prepend(`
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-[#103B60]">Dashboard de Ventas</h1>
                    <p class="text-sm text-gray-600 mt-1 "></p>
                </div>
            </div>
            <div class="w-full mt-2" id="filterBarDashboard"></div>
        `);
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
                    onchange: `soft.renderDashboard()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `soft.renderDashboard()`,
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
                    onchange: `soft.renderDashboard()`,
                },
            ],
        });
        const currentMonth = moment().month() + 1; // Mes actual (1-12)
        setTimeout(() => {
            $(`#filterBarDashboard #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    async renderDashboard() {
        let udn = $('#filterBarDashboard #udn').val();
        let month = $('#filterBarDashboard #mes').val();
        let year = $('#filterBarDashboard #anio').val();
        let mkt = await useFetch({
            url: api,
            data: {
                opc: "apiPromediosDiarios",
                udn: udn,
                mes: month,
                anio: year,
            },
        });


        $("#containerDashboard").html(`
            <div class=" font-sans  mx-auto">
                <!-- KPIs -->
                <div class="my-3" id="containerKpi"></div>
                <!-- Resto del dashboard (gráficas, tabla, etc.) -->
                <div class="grid lg:grid-cols-2 gap-4 mb-2">
                    <div class="bg-white rounded-lg shadow-sm p-3 max-h-[90vh]" id="containerChequePro"></div>
                    <div class="bg-white rounded-lg shadow-sm p-3 max-h-[90vh]" id="barProductMargen"></div>
                    <div class="bg-white rounded-lg shadow-sm p-3 max-h-[90vh]" id="ventasDiasSemana"></div>
                    <div class="bg-white rounded-lg shadow-sm p-3 max-h-[90vh]" id="Tendencia"></div>

                </div>
                <div class="bg-white p-3 w-full rounded-xl shadow overflow-auto" id="containerAttentionProducts"></div>
            </div>
        `);


        this.showCards(mkt.dashboard);



        this.chequeComparativo({ data: mkt.barras });
        this.lineChartPromediosDiario({ data: mkt.linear });

        this.barChart({
            parent: 'ventasDiasSemana',
            title: 'Ventas por Día de Semana',
            ...mkt.barDays

        })

        // this.topDiasMes({
        //     parent: "Tendencia",
        //     title: "Mejores Días del Mes",
        //     subtitle: "Septiembre 2025 - Top 5",
        //     data: mkt.topDays
        // });

        this.topDiasSemana({
            parent: "Tendencia",
            title: "📊 Ranking por Promedio Semanal",
            subtitle: "Promedio de ventas por día de la semana en el mes seleccionado",
            data: mkt.topWeek
        });
    }

    showCards(data) {
        // KPIs visuales
        this.infoCard({
            parent: "containerKpi",
            theme: "light",
            json: [
                {
                    id: "kpiDia",
                    title: "Venta del día de ayer",
                    data: {
                        value: data.ventaDia,
                        // description: "+12% vs ayer",
                        color: "text-[#8CC63F]",
                    },
                },
                {
                    id: "kpiMes",
                    title: "Venta del Mes",
                    data: {
                        value: data.ventaMes,
                        // description: "+8% vs mes anterior",
                        color: "text-green-800",
                    },
                },
                {
                    title: "Clientes",
                    data: {
                        value: data.Clientes,
                        // description: "+5% vs período anterior",
                        color: "text-[#103B60]",
                    },
                },
                {
                    id: "kpiCheque",
                    title: "Cheque Promedio",
                    data: {
                        value: data.ChequePromedio,
                        // description: "-2% vs período anterior",
                        color: "text-red-600",
                    },
                },
            ],
        });
    }

    lineChartPromediosDiario(options) {
        let nombreMes = $('#filterBarDashboard #mes option:selected').text();
        this.linearChart({
            parent: "barProductMargen",
            id: "chartLine",
            title: `📈 Ventas de ${nombreMes} por Categoría`,
            data: options.data // ← ya contiene labels y datasets reales
        });

    }

    infoCard(options) {
        const defaults = {
            parent: "root",
            id: "infoCardKPI",
            class: "",
            theme: "light", // light | dark
            json: [],
            data: {
                value: "0",
                description: "",
                color: "text-gray-800"
            },
            onClick: () => { }
        };
        const opts = Object.assign({}, defaults, options);
        const isDark = opts.theme === "dark";
        const cardBase = isDark
            ? "bg-[#1F2A37] text-white rounded-xl shadow"
            : "bg-white text-gray-800 rounded-xl shadow";
        const titleColor = isDark ? "text-gray-300" : "text-gray-600";
        const descColor = isDark ? "text-gray-400" : "text-gray-500";
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
            const description = $("<p>", {
                class: `text-xs mt-1 ${card.data?.color || descColor}`,
                text: card.data?.description
            });
            box.append(title, value, description);
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
        } else {
            container.append(renderCard(opts));
        }
        $(`#${opts.parent}`).html(container);
    }

    chequeComparativo(options) {
        const defaults = {
            parent: "containerChequePro",
            id: "chart",
            title: "Comparativa por Categorías",
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
        $('#' + opts.parent).html(container);
        const anioA = new Date().getFullYear();
        const anioB = anioA - 1;
        const dCheque = {
            labels: ["A&B", "Alimentos", "Bebidas"],
            A: [673.18, 613.0, 54.6],
            B: [640.25, 590.5, 49.75]
        };
        const ctx = document.getElementById(opts.id).getContext("2d");
        if (window._chq) window._chq.destroy();
        window._chq = new Chart(ctx, {
            type: "bar",
            data: {
                labels: opts.data.labels,
                datasets: [
                    {
                        label: `Año ${anioA}`,
                        data: opts.data.A,
                        backgroundColor: "#103B60"
                    },
                    {
                        label: `Año ${anioB}`,
                        data: opts.data.B,
                        backgroundColor: "#8CC63F"
                    }
                ]
            },
            options: {
                responsive: true,
                animation: {
                    onComplete: function () {
                        const chart = this;
                        const ctx = chart.ctx;
                        ctx.font = "12px sans-serif";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "bottom";
                        ctx.fillStyle = "#000";
                        chart.data.datasets.forEach(function (dataset, i) {
                            const meta = chart.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                const value = dataset.data[index];
                                const label = typeof formatPrice === "function" ? formatPrice(value) : value;
                                ctx.fillText(label, bar.x, bar.y - 5);
                            });
                        });
                    }
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

    comparativaCategorias(options) {
        const defaults = {
            parent: "containerVentas",
            id: "chartCategorias",
            title: "Comparativa de Categorías",
            class: "bg-white p-4 rounded-xl shadow-md",
            data: {},
            json: {
                labels: ["Bebidas", "Snacks", "Frutas"],
                A: [5000, 3200, 1800],
                B: [4700, 3000, 1600]
            },
            anioA: new Date().getFullYear(),
            anioB: new Date().getFullYear() - 1,
            onShow: () => { }
        };
        const opts = Object.assign({}, defaults, options);
        const rows = opts.json.labels.length;
        const canvasHeight = Math.max(rows * 26 + 50, 300);
        const container = $("<div>", {
            class: opts.class
        });
        const title = $("<h3>", {
            class: "text-sm font-semibold text-[#103B60] mb-2",
            text: opts.title
        });
        // 🔁 Nuevo wrapper para canvas con altura controlada
        const canvasWrapper = $("<div>", {
            class: "relative w-full",
            css: {
                height: `${canvasHeight}px`
            }
        });
        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full"
        });
        canvasWrapper.append(canvas);
        container.append(title, canvasWrapper);
        $(`#${opts.parent}`).html(container);
        if (window._cat) window._cat.destroy();
        window._cat = new Chart(document.getElementById(opts.id).getContext("2d"), {
            type: "bar",
            data: {
                labels: opts.json.labels,
                datasets: [
                    {
                        label: `Año ${opts.anioA}`,
                        data: opts.json.A,
                        backgroundColor: "#103B60"
                    },
                    {
                        label: `Año ${opts.anioB}`,
                        data: opts.json.B,
                        backgroundColor: "#8CC63F"
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                indexAxis: "y",
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${formatPrice(ctx.parsed.x)}`
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            callback: (v) => formatPrice(v),
                            font: { size: 11 }
                        },
                        grid: { display: true }
                    },
                    y: {
                        ticks: {
                            autoSkip: false,
                            font: { size: 11 }
                        },
                        grid: { display: false }
                    }
                }
            }
        });
        if (typeof opts.onShow === "function") opts.onShow();
    }

    // Components.
    linearChart(options) {
        const defaults = {
            parent: "containerLineChart",
            id: "linearChart",
            title: "",
            class: "border p-3 rounded-xl",
            data: {},   // <- puede contener { labels: [], datasets: [], tooltip: [] }
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
            class: "w-full h-[150px]"
        });
        container.append(title, canvas);
        $('#' + opts.parent).append(container);

        const ctx = document.getElementById(opts.id).getContext("2d");
        if (!window._charts) window._charts = {};
        if (window._charts[opts.id]) {
            window._charts[opts.id].destroy();
        }

        window._charts[opts.id] = new Chart(ctx, {
            type: "line",
            data: opts.data,
            options: {
                responsive: true,
                aspectRatio: 3,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                const index = items[0].dataIndex;
                                // Si existe "tooltip" en los datos, úsalo. Si no, usa labels.
                                const tooltips = opts.data.tooltip || opts.data.labels;
                                return tooltips[index];
                            },
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

    barChart(options) {
        const defaults = {
            parent: "containerBarChart",
            id: "chartBar",
            title: "Ventas por Día de Semana",
            class: "border p-4 rounded-xl",
            labels: [],
            dataA: [],
            dataB: [],
            yearA: new Date().getFullYear(),
            yearB: new Date().getFullYear() - 1
        };

        const opts = Object.assign({}, defaults, options);

        // Crear contenedor
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
        $("#" + opts.parent).html(container);

        const ctx = document.getElementById(opts.id).getContext("2d");
        if (window._barChart) window._barChart.destroy();

        // Crear gráfico
        window._barChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: opts.labels,
                datasets: [
                    {
                        label: opts.yearA,
                        data: opts.dataA,
                        backgroundColor: "#2196F3" // Azul fuerte
                    },
                    {
                        label: opts.yearB,
                        data: opts.dataB,
                        backgroundColor: "#9E9E9E" // Gris neutro
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    tooltip: {
                        callbacks: {
                            label: (ctx) =>
                                `${ctx.dataset.label}: ${formatPrice(ctx.parsed.y)}`
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

    topDiasMes(options) {
        const defaults = {
            parent: "containerTopDias",
            title: "Mejores Días del Mes",
            subtitle: "",
            data: [] // [{fecha, dia, clientes, total, nota}]
        };

        const opts = Object.assign({}, defaults, options);
        const container = $("<div>", { class: "border p-4 rounded-xl bg-white " });

        // Título
        const header = $("<div>", { class: "mb-3" })
            .append($("<h2>", { class: "text-lg font-bold", text: opts.title }))
            .append($("<p>", { class: "text-sm text-gray-500", text: opts.subtitle }));

        // Lista
        const list = $("<div>", { class: "space-y-3" });

        const colores = [
            { bg: "bg-green-100", circle: "bg-green-500 text-white" },
            { bg: "bg-blue-100", circle: "bg-blue-500 text-white" },
            { bg: "bg-purple-100", circle: "bg-purple-500 text-white" },
            { bg: "bg-orange-100", circle: "bg-orange-500 text-white" },
            { bg: "bg-gray-100", circle: "bg-gray-600 text-white" }
        ];

        opts.data.forEach((item, i) => {
            const rank = i + 1;
            const palette = colores[i] || { bg: "bg-white", circle: "bg-gray-300 text-black" };

            // Fila con fondo dinámico
            const row = $("<div>", {
                class: `flex items-center gap-3 p-3 rounded-lg ${palette.bg}`
            });

            // Número ranking con círculo dinámico
            row.append(
                $("<span>", {
                    class: `flex items-center justify-center w-8 h-8 rounded-full font-bold ${palette.circle}`,
                    text: rank
                })
            );

            // Datos
            const content = $("<div>", { class: "flex-1" });
            content.append(
                $("<div>", { class: "flex justify-between" })
                    .append($("<span>", { class: "font-semibold", text: `${item.dia}, ${item.fecha}` }))
                    .append($("<span>", { class: "font-bold", text: formatPrice(item.total) }))
            );
            content.append(
                $("<div>", { class: "text-sm text-gray-600 flex justify-between" })
                    .append($("<span>", { text: `${item.clientes} clientes` }))
                    .append($("<span>", { class: "italic", text: item.nota }))
            );

            row.append(content);
            list.append(row);
        });

        container.append(header, list);
        $("#" + opts.parent).html(container);
    }

    topDiasSemana(options) {
        const defaults = {
            parent: "containerTopDiasSemana",
            title: "📊 Ranking por Promedio Semanal",
            subtitle: "",
            data: [] // [{dia, promedio, veces}]
        };

        const opts = Object.assign({}, defaults, options);
        const container = $("<div>", { class: "border p-4 rounded-xl bg-white " });

        // Título
        const header = $("<div>", { class: "mb-3" })
            .append($("<h2>", { class: "text-lg font-bold", text: opts.title }))
            .append($("<p>", { class: "text-sm text-gray-500", text: opts.subtitle }));

        // Lista
        const list = $("<div>", { class: "space-y-3" });

        const colores = [
            { bg: "bg-green-100", circle: "bg-green-500 text-white" },
            { bg: "bg-blue-100", circle: "bg-blue-500 text-white" },
            { bg: "bg-purple-100", circle: "bg-purple-500 text-white" },
            { bg: "bg-orange-100", circle: "bg-orange-500 text-white" },
            { bg: "bg-pink-100", circle: "bg-pink-500 text-white" },
            { bg: "bg-yellow-100", circle: "bg-yellow-600 text-white" },
            { bg: "bg-gray-100", circle: "bg-gray-600 text-white" }
        ];

        opts.data.forEach((item, i) => {
            const rank = i + 1;
            const palette = colores[i] || { bg: "bg-white", circle: "bg-gray-300 text-black" };

            // Fila con fondo dinámico
            const row = $("<div>", {
                class: `flex items-center gap-3 p-3 rounded-lg ${palette.bg}`
            });

            // Número ranking con círculo dinámico
            row.append(
                $("<span>", {
                    class: `flex items-center justify-center w-8 h-8 rounded-full font-bold ${palette.circle}`,
                    text: rank
                })
            );

            // Datos
            const content = $("<div>", { class: "flex-1" });
            content.append(
                $("<div>", { class: "flex justify-between" })
                    .append($("<span>", { class: "font-semibold", text: item.dia }))
                    .append($("<span>", { class: "font-bold", text: formatPrice(item.promedio) }))
            );
            content.append(
                $("<div>", { class: "text-sm text-gray-600 flex justify-between" })
                    .append($("<span>", { text: `${item.veces} ocurrencias con ${item.clientes} clientes` }))
                    .append($("<span>", { class: "italic", text: rank === 1 ? "⭐ Mejor día" : "" }))
            );

            row.append(content);
            list.append(row);
        });

        container.append(header, list);
        $("#" + opts.parent).html(container);
    }

}

class Ingresos extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Ingresos";
    }

    render() {
        this.layout();
        this.filterBar();
    }

    init() {
        // this.lsIngresos();
    }

    layout() {
        this.primaryLayout({
            parent: `container-modIngresos`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  border-b pb-2 ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full ', id: `container${this.PROJECT_NAME}` }
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
                    lbl: "Seleccionar udn",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `ingresos.lsIngresos()`,
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
                    onchange: `ingresos.lsIngresos()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `ingresos.lsIngresos()`,
                },
                {
                    opc: "select",
                    id: "type",
                    lbl: "Consultar",
                    class: "col-sm-3",
                    data: [
                        { id: "3", valor: "Promedios Diarios" },
                        { id: "1", valor: " Ingresos por día" },
                        { id: "2", valor: "Captura de ingresos" },
                    ],
                    onchange: `ingresos.lsIngresos()`,
                },
            ],
        });
        const currentMonth = moment().month() + 1; // Mes actual (1-12)
        setTimeout(() => {
            $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    lsIngresos() {
        const monthText = $("#filterBarIngresos #mes option:selected").text();
        $("#containerIngresos").html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold ">📦 VENTAS DIARIAS</h2>
                <p class="text-gray-400">Consultar y capturar ventas diaria por unidad de negocio (ingresos)</p>
            </div>
            <div id="container-table-ingresos"></div>
        `);
        this.createTable({
            parent: "container-table-ingresos",
            idFilterBar: `filterBarIngresos`,
            data: { opc: 'list', monthText: monthText },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbIngresos",
                theme: 'corporativo',
                color_group: "bg-gray-300",
                // center: [2],
                right: [4]
            },
        });
    }
}

class ComparativaMensual extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "ComparativaMensual";
    }

    init() {
        this.layout();
        this.filterBar();
        this.lsComparativa();
    }

    layout() {
        this.primaryLayout({
            parent: `container-comparativasMensuales`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  border-b pb-2 ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full ', id: `container${this.PROJECT_NAME}` }
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
                    lbl: "UDN:",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `ingresos.lsIngresos()`,
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-sm-3",
                    data: [
                        { id: "2025", valor: "2025" },
                        { id: "2024", valor: "2024" },
                        { id: "2023", valor: "2023" },
                    ],
                    onchange: `comparativa.lsComparativa()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `comparativa.lsComparativa()`,
                },
                {
                    opc: "select",
                    id: "type",
                    lbl: "Consultar",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Consulta de promedios" },
                        { id: "2", valor: "Consulta de ingresos" },
                    ],
                    onchange: `comparativa.lsComparativa()`,
                },
            ],
        });
        const currentMonth = moment().month() + 1; // Mes actual (1-12)
        setTimeout(() => {
            $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    lsComparativa() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold ">📦 Comparativas Mensuales </h2>
                <p class="text-gray-400">Consulta las ventas (ingresos) y el cheque promedio (Promedios) mensual contra el año seleccionado. </p>
            </div>
            <div id="container-table-comparativa"></div>
        `);
        this.createTable({
            parent: "container-table-comparativa",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'listComparative' },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbIngresos",
                theme: 'corporativo',
                center: [1, 2, 3],
                right: [6]
            },
        });
    }
}

class PromediosDiarios extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "promediosDiarios";
    }

    render() {
        this.layout();
    }

    init() {
        this.layout();
        this.filterBar();
        // this.lsComparativa();
    }

    layout() {
        this.primaryLayout({
            parent: `container-${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  border-b pb-2 ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full ', id: `container${this.PROJECT_NAME}` }
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
                    lbl: "UDN:",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `ingresos.lsIngresos()`,
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-sm-3",
                    data: [
                        { id: "2025", valor: "2025" },
                        { id: "2024", valor: "2024" },
                        { id: "2023", valor: "2023" },
                    ],
                    onchange: `comparativa.lsComparativa()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `comparativa.lsComparativa()`,
                },
                {
                    opc: "select",
                    id: "type",
                    lbl: "Consultar",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Consulta de promedios" },
                        { id: "2", valor: "Consulta de ingresos" },
                    ],
                    onchange: `comparativa.lsComparativa()`,
                },
            ],
        });
    }
}

class PromediosAcumulados extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "promediosAcumulados";
    }

    init() {
        this.layout();
        this.filterBar();
        // this.ls();
    }

    layout() {
        this.primaryLayout({
            parent: `container-promediosAcumulados`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  border-b pb-2 ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full ', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    filterBar() {
        const currentMonth = moment().month(); // Índice de mes actual (0-11)
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Seleccionar udn",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `acumulados.ls()`,
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
                    onchange: `acumulados.ls()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({
                        id: i + 1,
                        valor: m,
                        selected: i === currentMonth
                    })),
                    onchange: `acumulados.ls()`,
                },
            ],
        });
        // initialized.
        setTimeout(() => {
            $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth + 1).trigger("change");
        }, 100);
    }

    ls() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold ">📦Ch </h2>
                <p class="text-gray-400">
                Consulta los promedios acumulados del año seleccionado, hasta el mes seleccionado.
                </p>
            </div>
            <div id="container-table-acumulados"></div>
        `);
        this.createTable({
            parent: "container-table-acumulados",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'listAcumulados' },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbI",
                theme: 'corporativo',
                center: [1, 2, 3],
                right: [6]
            },
        });
    }
}
