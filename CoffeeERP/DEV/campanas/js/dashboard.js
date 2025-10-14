class CampaignDashboard extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Dashboard";
        this.apiDashboard = 'ctrl/ctrl-dashboard.php';
    }

    async render() {
        this.layout();
        this.filterBarDashboard();
        await this.renderDashboard();
    }

    async layout() {
        this.dashboardComponent({
            parent: "container-dashboard",
            id: "dashboardComponent",
            title: "📊 Dashboard de Campañas Publicitarias",
            subtitle: "Análisis mensual de inversión, clics y métricas de rendimiento",
            json: [
                { type: "grafico", id: "containerComparativo" },
                { type: "grafico", id: "containerTendencias", title: "Tendencias Diarias" },
                { type: "grafico", id: "containerPorTipo", title: "Inversión por Tipo de Anuncio" },
                { type: "grafico", id: "containerTopCampaigns", title: "Top 5 Campañas" },
            ]
        });
    }

    filterBarDashboard() {
        this.createfilterBar({
            parent: `filterBarDashboard`,
            data: [
                {
                    opc: "select",
                    id: "udn_id",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: udn,
                    onchange: `dashboard.renderDashboard()`,
                },
                {
                    opc: "select",
                    id: "red_social_id",
                    lbl: "Red Social",
                    class: "col-sm-3",
                    data: red_social,
                    onchange: `dashboard.renderDashboard()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `dashboard.renderDashboard()`,
                },
                {
                    opc: "select",
                    id: "año",
                    lbl: "Año",
                    class: "col-sm-3",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: `dashboard.renderDashboard()`,
                },
            ],
        });
        
        const currentMonth = moment().month() + 1;
        setTimeout(() => {
            $(`#filterBarDashboard #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    async renderDashboard() {
        let udn_id = $('#filterBarDashboard #udn_id').val();
        let red_social_id = $('#filterBarDashboard #red_social_id').val();
        let mes = $('#filterBarDashboard #mes').val();
        let año = $('#filterBarDashboard #año').val();

        let mkt = await useFetch({
            url: this.apiDashboard,
            data: {
                opc: "apiDashboard",
                udn_id: udn_id,
                red_social_id: red_social_id,
                mes: mes,
                año: año,
            },
        });

        this.showCards(mkt.dashboard);
        this.comparativoAnual({ data: mkt.barras, año: año });
        this.lineChartTendencias({ data: mkt.linear });
        this.barChartPorTipo({ data: mkt.byType });
        this.topCampaignsRanking({ data: mkt.topCampaigns });
    }

    showCards(data) {
        this.infoCard({
            parent: "cardDashboard",
            theme: "dark",
            json: [
                {
                    id: "kpiInversion",
                    title: "Inversión Total",
                    data: {
                        value: data.inversion_total,
                        color: "text-[#8CC63F]",
                    },
                },
                {
                    id: "kpiClics",
                    title: "Total de Clics",
                    data: {
                        value: data.total_clics,
                        color: "text-blue-400",
                    },
                },
                {
                    id: "kpiCPC",
                    title: "CPC Promedio",
                    data: {
                        value: data.cpc_promedio,
                        color: "text-[#103B60]",
                    },
                },
                {
                    id: "kpiCampañas",
                    title: "Campañas Activas",
                    data: {
                        value: data.total_campañas,
                        color: "text-purple-400",
                    },
                },
            ],
        });
    }

    comparativoAnual(options) {
        const defaults = {
            parent: "containerComparativo",
            id: "chartComparativo",
            title: "",
            class: "p-4",
            data: {},
            año: new Date().getFullYear()
        };
        
        const opts = Object.assign({}, defaults, options);
        const container = $("<div>", { class: opts.class });
        const title = $("<h2>", {
            class: "text-lg font-bold mb-3 text-white",
            text: `Comparativa Anual: ${opts.año} vs ${opts.año - 1}`
        });
        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-[320px]"
        });
        
        container.append(title, canvas);
        $('#' + opts.parent).html(container);

        const ctx = document.getElementById(opts.id).getContext("2d");
        if (window._chqComp) window._chqComp.destroy();
        
        window._chqComp = new Chart(ctx, {
            type: "bar",
            data: {
                labels: opts.data.labels,
                datasets: [
                    {
                        label: `Año ${opts.año}`,
                        data: opts.data.A,
                        backgroundColor: "#103B60"
                    },
                    {
                        label: `Año ${opts.año - 1}`,
                        data: opts.data.B,
                        backgroundColor: "#8CC63F"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: "bottom",
                        labels: { color: '#fff' }
                    },
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
                            callback: (v) => formatPrice(v),
                            color: '#9CA3AF'
                        },
                        grid: { color: '#374151' }
                    },
                    x: {
                        ticks: { color: '#9CA3AF' },
                        grid: { color: '#374151' }
                    }
                }
            }
        });
    }

    lineChartTendencias(options) {
        let nombreMes = $('#filterBarDashboard #mes option:selected').text();
        this.linearChart({
            parent: "containerTendencias",
            id: "chartTendencias",
            title: `📈 Tendencias Diarias de ${nombreMes}`,
            data: options.data
        });
    }

    barChartPorTipo(options) {
        const container = $("<div>", { class: "p-4" });
        const title = $("<h2>", {
            class: "text-lg font-bold mb-3 text-white",
            text: "Inversión por Tipo de Anuncio"
        });
        const canvas = $("<canvas>", {
            id: "chartPorTipo",
            class: "w-full h-[300px]"
        });
        
        container.append(title, canvas);
        $('#containerPorTipo').html(container);

        const ctx = document.getElementById("chartPorTipo").getContext("2d");
        if (window._chartTipo) window._chartTipo.destroy();
        
        window._chartTipo = new Chart(ctx, {
            type: "bar",
            data: {
                labels: options.data.labels,
                datasets: [{
                    label: 'Inversión',
                    data: options.data.data,
                    backgroundColor: ['#103B60', '#8CC63F', '#3B82F6', '#8B5CF6', '#EC4899']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `Inversión: ${formatPrice(ctx.parsed.y)}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (v) => formatPrice(v),
                            color: '#9CA3AF'
                        },
                        grid: { color: '#374151' }
                    },
                    x: {
                        ticks: { color: '#9CA3AF' },
                        grid: { color: '#374151' }
                    }
                }
            }
        });
    }

    topCampaignsRanking(options) {
        const defaults = {
            parent: "containerTopCampaigns",
            title: "📊 Top 5 Campañas por Inversión",
            subtitle: "",
            data: []
        };

        const opts = Object.assign({}, defaults, options);
        const container = $("<div>", { class: "border p-4 rounded-xl bg-[#1F2A37]" });

        const header = $("<div>", { class: "mb-3" })
            .append($("<h2>", { class: "text-lg font-bold text-white", text: opts.title }))
            .append($("<p>", { class: "text-sm text-gray-400", text: opts.subtitle }));

        const list = $("<div>", { class: "space-y-3" });

        const colores = [
            { bg: "bg-green-900", circle: "bg-green-500 text-white" },
            { bg: "bg-blue-900", circle: "bg-blue-500 text-white" },
            { bg: "bg-purple-900", circle: "bg-purple-500 text-white" },
            { bg: "bg-orange-900", circle: "bg-orange-500 text-white" },
            { bg: "bg-gray-800", circle: "bg-gray-600 text-white" }
        ];

        opts.data.forEach((item, i) => {
            const rank = i + 1;
            const palette = colores[i] || { bg: "bg-gray-800", circle: "bg-gray-600 text-white" };

            const row = $("<div>", {
                class: `flex items-center gap-3 p-3 rounded-lg ${palette.bg}`
            });

            row.append(
                $("<span>", {
                    class: `flex items-center justify-center w-8 h-8 rounded-full font-bold ${palette.circle}`,
                    text: rank
                })
            );

            const content = $("<div>", { class: "flex-1" });
            content.append(
                $("<div>", { class: "flex justify-between" })
                    .append($("<span>", { class: "font-semibold text-white", text: item.campaña }))
                    .append($("<span>", { class: "font-bold text-[#8CC63F]", text: formatPrice(item.inversion) }))
            );
            content.append(
                $("<div>", { class: "text-sm text-gray-400 flex justify-between" })
                    .append($("<span>", { text: `${item.clics} clics` }))
                    .append($("<span>", { text: `CPC: ${formatPrice(item.cpc)}` }))
            );

            row.append(content);
            list.append(row);
        });

        container.append(header, list);
        $("#" + opts.parent).html(container);
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
            <div class="p-6 border-b border-gray-700">
                <div class="mx-auto">
                    <h1 class="text-2xl font-bold text-white">${opts.title}</h1>
                    <p class="text-sm text-gray-400">${opts.subtitle}</p>
                </div>
            </div>

            <div id="filterBarDashboard" class="mx-auto px-4 py-4"></div>

            <section id="cardDashboard" class="mx-auto px-4 py-4"></section>

            <section id="content-${opts.id}" class="mx-auto px-4 py-6 grid gap-6 lg:grid-cols-2"></section>
        </div>`);

        opts.json.forEach(item => {
            let block = $("<div>", {
                id: item.id,
                class: "bg-[#1F2A37] p-4 rounded-xl shadow-md border border-gray-700 min-h-[200px]"
            });

            if (item.title) {
                block.prepend(`<h3 class="text-sm font-semibold text-white mb-3">${item.title}</h3>`);
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
            theme: "dark",
            json: []
        };
        
        const opts = Object.assign({}, defaults, options);
        const isDark = opts.theme === "dark";
        const cardBase = isDark
            ? "bg-[#1F2A37] text-white rounded-xl shadow border border-gray-700"
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

    linearChart(options) {
        const defaults = {
            parent: "containerLineChart",
            id: "linearChart",
            title: "",
            class: "rounded-xl p-4",
            data: {}
        };
        
        const opts = Object.assign({}, defaults, options);
        const container = $("<div>", { class: opts.class });
        const title = $("<h2>", {
            class: "text-lg font-bold mb-2 text-white",
            text: opts.title
        });
        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-[250px]"
        });
        
        container.append(title, canvas);
        $('#' + opts.parent).html(container);

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
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: "bottom",
                        labels: { color: '#fff' }
                    },
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
                            callback: (v) => formatPrice(v),
                            color: '#9CA3AF'
                        },
                        grid: { color: '#374151' }
                    },
                    x: {
                        ticks: { color: '#9CA3AF' },
                        grid: { color: '#374151' }
                    }
                }
            }
        });
    }
}
