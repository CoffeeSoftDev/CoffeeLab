let api = 'ctrl/ctrl-ingresos.php';
let app, sales, salesDashboard, monthlySales, cumulativeAverages, dashboardChequePromedio;

let udn, lsudn, clasificacion, clasificacionUdn;

$(async () => {
    app = new App(api, "root");

    const data = await useFetch({ url: api, data: { opc: "init" } });
    console.log(data)
    udn           = data.udn;
    lsudn         = data.lsudn;
    clasificacion = data.clasification;

    // ** Instancias **
    app = new App(api, "root");

    salesDashboard = new SalesDashboard(api, "root");
    dashboardChequePromedio = new DashboardChequePromedio(api, "root");

    sales = new Sales(api, "root");
    monthlySales = new MonthlySales(api, "root");
    cumulativeAverages = new CumulativeAverages(api, "root");


    app.render();


});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "orders";
    }


    render() {
        this.layout();

        // init instancias.

        salesDashboard.render();
        dashboardChequePromedio.render();
        sales.render();
        monthlySales.render();
        cumulativeAverages.render();

    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterBarVentas" },
                container: { class: "w-full h-full", id: "containerVentas" },
            },
        });

        this.headerBar({
            parent: `filterBarVentas`,
            title: "📊 Módulo de ventas",
            subtitle: "Consulta las métricas de ventas.",
            onClick: () => this.redirectToHome(),
        });

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
                    onClick: () => salesDashboard.renderDashboard()
                },
                {
                    id: "dashboardChequePromedio",
                    tab: "Dashboard Cheque Promedio",
                    onClick: () => dashboardChequePromedio.renderDashboard()
                },
                {
                    id: "sales",
                    tab: "Módulo ventas",
                    onClick: () => {
                    }
                },
                {
                    id: "comparativasMensuales",
                    tab: "Comparativas mensuales",
                    onClick: () => {
                    }
                },
                {
                    id: "promediosAcumulados",
                    tab: "Promedios acumulados",
                    onClick: () => {
                    }
                },
            ]
        });

        $('#content-tabsVentas').removeClass('h-screen');
    }


    // Components.
    redirectToHome() {
        const base = window.location.origin + '/DEV';
        window.location.href = `${base}/kpi/marketing.php`;
    }


    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Título por defecto",
            subtitle: "Subtítulo por defecto",
            icon: "icon-home",
            textBtn: "Inicio",
            classBtn: "border-1 border-blue-700 text-blue-600 hover:bg-blue-700 hover:text-white transition-colors duration-200",
            onClick: null,
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "relative flex justify-center items-center px-2 pt-3 pb-3"
        });

        // 🔵 Botón alineado a la izquierda (posición absoluta)
        const leftSection = $("<div>", {
            class: "absolute left-0"
        }).append(
            $("<button>", {
                class: `${opts.classBtn} font-semibold px-4 py-2 rounded transition flex items-center`,
                html: `<i class="${opts.icon} mr-2"></i>${opts.textBtn}`,
                click: () => typeof opts.onClick === "function" && opts.onClick()
            })
        );

        // 📜 Texto centrado
        const centerSection = $("<div>", {
            class: "text-center"
        }).append(
            $("<h2>", {
                class: "text-2xl font-bold",
                text: opts.title
            }),
            $("<p>", {
                class: "text-gray-400",
                text: opts.subtitle
            })
        );

        container.append(leftSection, centerSection);
        $(`#${opts.parent}`).html(container);
    }



}

class SalesDashboard extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "order";
    }

    render() {
        this.layout();
    }

    layout() {

        this.dashboardComponent({
            parent: "container-dashboard",
            id: "dashboardComponent",
            title: "📊 Dashboard de Ventas",
            subtitle: "Análisis comparativo de ventas entre dos períodos",
            json: [
                { type: "grafico", id: "containerChequePro" },
                {
                    type   : "grafico", id: "barProductMargen1", title: "",
                    content: [
                        { class: "border px-3 py-2 rounded", type: "div", id: "filterBarProductMargen" },
                        { class: " mt-2", type: "div", id: "barProductMargen" },
                    ]
                },
                { type: "grafico", id: "ventasDiasSemana", title: "Ventas por Día de la Semana" },
                { type: "grafico", id: "Tendencia", title: "Tendencia de Ventas" },
            ]
        });
   
        this.createfilterBar({
            parent: `filterBarProductMargen`,
            data: [
                {
                    opc: "select",
                    id: "category",
                    lbl: "Categorias",
                    class: "col-sm-4",
                    // data:,
                    onchange: `salesDashboard.comparativaByCategory()`,
                },

            ],
        });

        this.filterBarDashboard();
        this.renderDashboard();
    }

    async renderDashboard() {
        // Validar filtros antes de proceder
        if (!this.validateFilters()) {
            return;
        }

        // Filtrar clasificacion x udn 
        this.handleCategoryChange($('#filterBarDashboard #udn').val());

        let udn = $('#filterBarDashboard #udn').val();
        let periodo1 = $('#filterBarDashboard #periodo1').val();
        let [anio1, mes1] = periodo1.split('-');
        let periodo2 = $('#filterBarDashboard #periodo2').val();
        let [anio2, mes2] = periodo2.split('-');

        try {
            // Mostrar loading state
            this.showLoadingState();

            // Obtener datos principales del dashboard
            let mkt = await useFetch({
                url: api,
                data: {
                    opc: "apiPromediosDiarios",
                    udn: udn,
                    anio: anio1,
                    mes: mes1,
                    anio1: anio1,
                    mes1: mes1,
                    anio2: anio2,
                    mes2: mes2,
                },
            });

            // Obtener datos específicos de cheque promedio
            let chequeData = await useFetch({
                url: api,
                data: {
                    opc: "apiChequePromedioDashboard",
                    udn: udn,
                    anio: anio1,
                    mes: mes1,
                },
            });

            // Combinar datos para el dashboard
            if (chequeData && chequeData.status === 200) {
                mkt.dashboard = { ...mkt.dashboard, ...chequeData.data };
            }

            // Validar respuesta de la API
            if (!mkt || mkt.status === 500) {
                this.showError("Error al obtener datos del servidor");
                return;
            }

            // Renderizar componentes con datos validados
            this.showCards(mkt.dashboard);
            this.renderCharts(mkt);

        } catch (error) {
            console.error("Error en renderDashboard:", error);
            this.showError("Error al cargar el dashboard. Por favor, intente nuevamente.");
        }
    }

    renderCharts(mkt) {
        // Gráfico comparativo de cheque promedio por categorías
        this.chequeComparativo({
            data: mkt.barras.dataset,
            anioA: mkt.barras.anioA,
            anioB: mkt.barras.anioB,
        });

        // Comparativa de ingresos diarios
        this.comparativaIngresosDiarios({ data: mkt.linear });

        // Ventas por día de semana
        this.ventasPorDiaSemana(mkt.barDays);

        // Ranking semanal
        this.topDiasSemana({
            parent: "Tendencia",
            title: "📊 Ranking por Promedio Semanal",
            subtitle: "Promedio de ventas por día de la semana en el mes seleccionado",
            data: mkt.topWeek
        });
    }

    validateFilters() {
        const udn = $('#filterBarDashboard #udn').val();
        const periodo1 = $('#filterBarDashboard #periodo1').val();
        const periodo2 = $('#filterBarDashboard #periodo2').val();
        
        if (!udn || !periodo1 || !periodo2) {
            this.showError("Todos los filtros son requeridos para generar el dashboard");
            return false;
        }
        return true;
    }

    showLoadingState() {
        // Mostrar skeleton en KPI cards
        $('#cardDashboard').html(`
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${Array(4).fill().map(() => `
                    <div class="bg-white rounded-xl shadow p-4 animate-pulse">
                        <div class="h-4 bg-gray-200 rounded mb-2"></div>
                        <div class="h-8 bg-gray-200 rounded mb-1"></div>
                        <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                `).join('')}
            </div>
        `);
    }

    showError(message) {
        $('#cardDashboard').html(`
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div class="text-red-600 font-semibold mb-2">⚠️ Error</div>
                <div class="text-red-700">${message}</div>
            </div>
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
                    class: "col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0",
                    data: udn,
                    onchange: `salesDashboard.renderDashboard()`,
                },
                {
                    opc: "div",
                    id: "containerPeriodo1",
                    lbl: "Consultar con:",
                    class: "col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0",
                    html: `
                        <input 
                            type="month" 
                            id="periodo1" 
                            class="form-control w-100"
                            onchange="salesDashboard.renderDashboard()"
                        />
                    `
                },
                {
                    opc: "div",
                    id: "containerPeriodo2",
                    lbl: "Comparar con:",
                    class: "col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0",
                    html: `
                        <input 
                            type="month" 
                            id="periodo2" 
                            class="form-control w-100"
                            onchange="salesDashboard.renderDashboard()"
                        />
                    `
                },
                {
                    opc: "div",
                    id: "containerRefresh",
                    lbl: "&nbsp;",
                    class: "col-12 col-sm-6 col-lg-3 d-flex align-items-end",
                    html: `
                        <button 
                            type="button" 
                            class="btn btn-primary w-100"
                            onclick="salesDashboard.renderDashboard()"
                        >
                            <i class="icon-arrows-cw mr-2"></i>Actualizar
                        </button>
                    `
                },
            ],
        });

        const currentYear = moment().year();
        const currentMonth = moment().month() + 1;
        const lastYear = currentYear - 1;

        const periodo1 = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        const periodo2 = `${lastYear}-${String(currentMonth).padStart(2, '0')}`;

        $('#containerPeriodo1').removeClass('col-lg-3 col-sm-4');
        $('#containerPeriodo2').removeClass('col-lg-3 col-sm-4');

        setTimeout(() => {
            $(`#filterBarDashboard #periodo1`).val(periodo1).trigger("change");
            $(`#filterBarDashboard #periodo2`).val(periodo2).trigger("change");
        }, 100);
    }

    showCards(data) {
        // Validar datos antes de renderizar
        if (!data) {
            this.showError("No hay datos disponibles para mostrar");
            return;
        }

        // Calcular tendencias y variaciones
        const chequePromedioActual = this.parseNumericValue(data.ChequePromedio);
        const ventaMesActual = this.parseNumericValue(data.ventaMes);
        
        // KPIs visuales con métricas mejoradas
        this.infoCard({
            parent: "cardDashboard",
            theme: "light",
            json: [
                {
                    id: "kpiDia",
                    title: "Venta del día de ayer",
                    data: {
                        value: data.ventaDia || "$ 0.00",
                        description: this.getDateDescription(),
                        color: "text-[#8CC63F]",
                        icon: "📈"
                    },
                },
                {
                    id: "kpiMes",
                    title: "Venta del Mes",
                    data: {
                        value: data.ventaMes || "$ 0.00",
                        description: this.getMonthDescription(),
                        color: "text-green-800",
                        icon: "💰"
                    },
                },
                {
                    id: "kpiClientes",
                    title: "Clientes del Mes",
                    data: {
                        value: data.Clientes || "0",
                        description: "Total de clientes activos",
                        color: "text-[#103B60]",
                        icon: "👥"
                    },
                },
                {
                    id: "kpiCheque",
                    title: "Cheque Promedio",
                    data: {
                        value: data.ChequePromedio || "$ 0.00",
                        description: this.getChequePromedioTrend(chequePromedioActual, data),
                        color: this.getChequePromedioColor(chequePromedioActual, data),
                        icon: "🧾"
                    },
                },
            ],
        });
    }

    parseNumericValue(value) {
        if (!value) return 0;
        // Remover símbolos de moneda y convertir a número
        return parseFloat(value.toString().replace(/[$,\s]/g, '')) || 0;
    }

    getDateDescription() {
        const yesterday = moment().subtract(1, 'day');
        return yesterday.format('DD/MM/YYYY');
    }

    getMonthDescription() {
        const currentMonth = moment().format('MMMM YYYY');
        return `Período: ${currentMonth}`;
    }

    getChequePromedioTrend(valor, data = null) {
        // Usar datos reales de variación si están disponibles
        if (data && data.variacionCheque !== undefined) {
            const variacion = data.variacionCheque;
            if (variacion > 5) return `↗️ +${variacion.toFixed(1)}% vs año anterior`;
            if (variacion < -5) return `↘️ ${variacion.toFixed(1)}% vs año anterior`;
            return `→ ${variacion.toFixed(1)}% vs año anterior`;
        }

        // Lógica de fallback basada en valor
        if (valor > 1000) return "↗️ Excelente rendimiento";
        if (valor > 500) return "→ Rendimiento estable";
        return "↘️ Oportunidad de mejora";
    }

    getChequePromedioColor(valor, data = null) {
        // Usar tendencia real si está disponible
        if (data && data.tendencia) {
            switch (data.tendencia) {
                case 'positiva': return "text-[#8CC63F]"; // Verde
                case 'negativa': return "text-red-600";   // Rojo
                default: return "text-[#103B60]";         // Azul
            }
        }

        // Lógica de fallback basada en valor
        if (valor > 1000) return "text-[#8CC63F]"; // Verde para valores altos
        if (valor > 500) return "text-[#103B60]";  // Azul para valores medios
        return "text-orange-600";                   // Naranja para valores bajos
    }

    // graphigs.
    chequeComparativo(options) {
        const defaults = {
            parent: "containerChequePro",
            id: "chart",
            title: "Comparativa por Categorías",
            class: "border p-4 rounded-xl",
            data: {},
            json: [],
            anioA: new Date().getFullYear(),
            anioB: new Date().getFullYear() - 1,
            onShow: () => { },
        };
        const opts = Object.assign({}, defaults, options);

        const periodo1 = $('#filterBarDashboard #periodo1').val();
        const [anio1, mesNum1] = periodo1.split('-');
        const mes1 = moment().month(parseInt(mesNum1) - 1).format('MMMM');

        const periodo2 = $('#filterBarDashboard #periodo2').val();
        const [anio2, mesNum2] = periodo2.split('-');
        const mes2 = moment().month(parseInt(mesNum2) - 1).format('MMMM');

        const container = $("<div>", { class: opts.class });
        const title = $("<h2>", {
            class: "text-lg font-bold mb-2",
            text: `Comparativa: ${mes1} ${anio1} vs ${mes2} ${anio2}`
        });
        const canvasWrapper = $("<div>", {
            class: "w-full",
            css: { height: "300px" }
        });
        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-full"
        });
        canvasWrapper.append(canvas);
        container.append(title, canvasWrapper);

        $('#' + opts.parent).html(container);

        const ctx = document.getElementById(opts.id).getContext("2d");
        if (window._chq) window._chq.destroy();
        window._chq = new Chart(ctx, {
            type: "bar",
            data: {
                labels: opts.data.labels,
                datasets: [
                    {
                        label: `${mes2} ${anio2}`,
                        data: opts.data.B,
                        backgroundColor: "#8CC63F"
                    },
                    {
                        label: `${mes1} ${anio1}`,
                        data: opts.data.A,
                        backgroundColor: "#103B60"
                    },

                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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

    comparativaIngresosDiarios(options) {
        let periodo1 = $('#filterBarDashboard #periodo1').val();
        let [anio1, mesNum1] = periodo1.split('-');
        let mes1 = moment().month(parseInt(mesNum1) - 1).format('MMMM');

        let periodo2 = $('#filterBarDashboard #periodo2').val();
        let [anio2, mesNum2] = periodo2.split('-');
        let mes2 = moment().month(parseInt(mesNum2) - 1).format('MMMM');

        this.linearChart({
            parent: "barProductMargen",
            id: "chartLine",
            title: `📈 Comparativa de ventas :  ${mes2} ${anio2}  vs ${mes1} ${anio1} `,
            data: options.data
        });

    }

    ventasPorDiaSemana(data) {
        this.barChart({
            parent: 'ventasDiasSemana',
            title: 'Ventas por Día de Semana',
            ...data

        })
    }

    async comparativaByCategory(){
        let udn           = $('#filterBarDashboard #udn').val();
        let periodo1      = $('#filterBarDashboard #periodo1').val();
        let [anio1, mes1] = periodo1.split('-');
        let periodo2      = $('#filterBarDashboard #periodo2').val();
        let [anio2, mes2] = periodo2.split('-');

           let mkt = await useFetch({
            url: api,
            data: {
                opc: "comparativaByCategory",
                udn: udn,
                category: $('#category option:selected').text(),
                anio1: anio1,
                mes1: mes1,
                anio2: anio2,
                mes2: mes2,
            },
        });

      
            this.linearChart({
                parent: "barProductMargen",
                id: "barProductMargewn",
                title: "📈 Comparativa por Categoría",
                data:mkt
            });

    }

    // components.
    dashboardComponent(options) {
        const defaults = {
            parent: "root",
            id: "dashboardComponent",
            title: "📊 Huubie · Dashboard de Eventos",
            subtitle: "Resumen mensual · Cotizaciones · Pagados · Cancelados",
            json: [
                { type: "grafico", id: "barChartContainer", title: "Eventos por sucursal" },
                { type: "tabla", id: "tableSucursal", title: "Tabla de sucursales" },
                { type: "grafico", id: "donutChartContainer", title: "Ventas vs Entrada de dinero" },
                { type: "grafico", id: "topClientsChartContainer", title: "Top 10 clientes" },
                { type: "tabla", id: "tableClientes", title: "Tabla de clientes" }
            ]
        };

        const opts = Object.assign(defaults, options);

        const container = $(`
        <div id="${opts.id}" class="w-full min-h-screen bg-gray-50">
            <!-- Header -->
            <div class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 class="text-2xl sm:text-3xl font-bold text-[#103B60]">${opts.title}</h1>
                    <p class="text-sm sm:text-base text-gray-600 mt-1">${opts.subtitle}</p>
                </div>
            </div>

            <!-- FilterBar -->
            <div class="bg-white shadow-sm">
                <div id="filterBarDashboard" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                </div>
            </div>

            <!-- KPI Cards -->
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div id="cardDashboard" class="mb-8">
                </div>
            </section>

            <!-- Charts Content -->
            <section id="content-${opts.id}" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 grid gap-6 grid-cols-1 xl:grid-cols-2"></section>
        </div>`);

        // Renderizar contenedores desde JSON
        opts.json.forEach(item => {
            let block = $("<div>", {
                id: item.id,
                class: "bg-white p-2 rounded-xl shadow-md border border-gray-200 min-h-[200px] w-full"
            });

            if (item.title) {
                const defaultEmojis = {
                    'grafico': '📊',
                    'tabla': '�',
                    'doc': '�',
                    'filterBar': '🔍'
                };

                const emoji = item.emoji || defaultEmojis[item.type] || '';
                const iconHtml = item.icon ? `<i class="${item.icon}"></i> ` : '';
                const titleContent = `${emoji} ${iconHtml}${item.title}`;

                block.prepend(`<h3 class="text-sm font-semibold text-gray-800 mb-3">${titleContent}</h3>`);
            }

            if (item.content && Array.isArray(item.content)) {
                item.content.forEach(contentItem => {
                    const element = $(`<${contentItem.type}>`, {
                        id: contentItem.id || '',
                        class: contentItem.class || '',
                        text: contentItem.text || ''
                    });

                    if (contentItem.attributes) {
                        Object.keys(contentItem.attributes).forEach(attr => {
                            element.attr(attr, contentItem.attributes[attr]);
                        });
                    }

                    if (contentItem.html) {
                        element.html(contentItem.html);
                    }

                    block.append(element);
                });
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
            theme: "light", // light | dark
            json: [],
            data: {
                value: "0",
                description: "",
                color: "text-gray-800",
                icon: ""
            },
            onClick: () => { }
        };
        const opts = Object.assign({}, defaults, options);
        const isDark = opts.theme === "dark";
        const cardBase = isDark
            ? "bg-[#1F2A37] text-white rounded-xl shadow-lg border border-gray-700"
            : "bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200";
        const titleColor = isDark ? "text-gray-300" : "text-gray-600";
        const descColor = isDark ? "text-gray-400" : "text-gray-500";
        
        const renderCard = (card, i = "") => {
            const box = $("<div>", {
                id: `${opts.id}_${i}`,
                class: `${cardBase} p-4 cursor-pointer`,
                click: () => typeof opts.onClick === "function" && opts.onClick(card)
            });

            // Header con ícono y título
            const header = $("<div>", {
                class: "flex items-center justify-between mb-3"
            });

            const titleSection = $("<div>", {
                class: "flex items-center gap-2"
            });

            if (card.data?.icon) {
                titleSection.append($("<span>", {
                    class: "text-lg",
                    text: card.data.icon
                }));
            }

            const titleElement = $("<p>", {
                class: `text-sm font-medium ${titleColor}`,
                text: card.title
            });

            // Agregar tooltip informativo
            if (card.id) {
                const tooltipText = this.getTooltipText(card.id);
                if (tooltipText) {
                    titleElement.attr('title', tooltipText);
                    titleElement.addClass('cursor-help');
                    titleElement.append($("<i>", {
                        class: "icon-help-circled ml-1 text-xs opacity-60"
                    }));
                }
            }

            titleSection.append(titleElement);

            header.append(titleSection);
            
            // Valor principal
            const value = $("<p>", {
                id: card.id || "",
                class: `text-2xl font-bold ${card.data?.color || "text-gray-800"} mb-2`,
                text: card.data?.value || "0"
            });
            
            // Descripción con mejor formato
            const description = $("<p>", {
                class: `text-xs ${descColor} leading-relaxed`,
                text: card.data?.description || ""
            });

            // Indicador visual para cheque promedio
            if (card.id === "kpiCheque") {
                const indicator = $("<div>", {
                    class: "mt-2 h-1 bg-gray-200 rounded-full overflow-hidden"
                });
                const progress = $("<div>", {
                    class: `h-full ${card.data?.color?.includes('8CC63F') ? 'bg-[#8CC63F]' : 
                           card.data?.color?.includes('103B60') ? 'bg-[#103B60]' : 'bg-orange-400'} 
                           transition-all duration-500`,
                    css: { width: this.calculateChequeProgress(card.data?.value) + "%" }
                });
                indicator.append(progress);
                box.append(header, value, description, indicator);
            } else {
                box.append(header, value, description);
            }

            return box;
        };
        
        const container = $("<div>", {
            id: opts.id,
            class: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${opts.class}`
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

    calculateChequeProgress(value) {
        const numericValue = this.parseNumericValue(value);
        // Calcular progreso basado en rangos típicos (0-2000)
        return Math.min((numericValue / 2000) * 100, 100);
    }

    getTooltipText(cardId) {
        const tooltips = {
            'kpiDia': 'Total de ventas registradas el día anterior. Se actualiza automáticamente cada día.',
            'kpiMes': 'Suma total de ventas del mes seleccionado. Incluye todas las categorías de productos.',
            'kpiClientes': 'Número total de clientes únicos que realizaron compras en el período seleccionado.',
            'kpiCheque': 'Promedio de gasto por cliente (Total Ventas ÷ Total Clientes). Indicador clave de rentabilidad.'
        };
        return tooltips[cardId] || null;
    }

    showEmptyState(message) {
        return `
            <div class="flex flex-col items-center justify-center py-12 text-center">
                <div class="text-6xl text-gray-300 mb-4">📊</div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">Sin datos disponibles</h3>
                <p class="text-gray-500 max-w-md">${message}</p>
                <button 
                    class="mt-4 px-4 py-2 bg-[#103B60] text-white rounded-lg hover:bg-[#0d2f4d] transition-colors"
                    onclick="salesDashboard.renderDashboard()"
                >
                    Intentar nuevamente
                </button>
            </div>
        `;
    }

    linearChart(options) {
        const defaults = {
            parent: "containerLineChart",
            id: "linearChart",
            title: "",
            class: "border p-4 rounded-xl",
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
        const canvasWrapper = $("<div>", {
            class: "w-full",
            css: { height: "300px" }
        });
        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-full"
        });
        canvasWrapper.append(canvas);
        container.append(title, canvasWrapper);
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
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                const index = items[0].dataIndex;
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
            title: "Comparativa por Categorías",
            class: "border p-4 rounded-xl",
            labels: [],
            dataA: [], // Año anterior
            dataB: [], // Año actual
            yearA: new Date().getFullYear() - 1, // 2024
            yearB: new Date().getFullYear(),     // 2025
        };

        const opts = Object.assign({}, defaults, options);

        // 📦 Crear contenedor
        const container = $("<div>", { class: opts.class });
        const title = $("<h2>", {
            class: "text-lg font-bold mb-2",
            text: opts.title
        });
        const canvasWrapper = $("<div>", {
            class: "w-full",
            css: { height: "300px" }
        });
        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-full"
        });

        canvasWrapper.append(canvas);
        container.append(title, canvasWrapper);
        $("#" + opts.parent).html(container);

        const ctx = document.getElementById(opts.id).getContext("2d");
        if (window._barChart) window._barChart.destroy();

        // 🎨 Colores: Azul para período 1 (consulta), Verde para período 2 (comparación)
        const colorPeriodo1 = "#103B60"; // Azul oscuro - Período de consulta
        const colorPeriodo2 = "#8CC63F"; // Verde - Período de comparación

        // 📊 Crear gráfico
        window._barChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: opts.labels,
                datasets: [
                    {
                        label: `Año ${opts.yearA}`, // Período 2 (comparación) - dataB
                        data: opts.dataB,
                        backgroundColor: colorPeriodo2
                    },
                    {
                        label: `Año ${opts.yearB}`, // Período 1 (consulta) - dataA
                        data: opts.dataA,
                        backgroundColor: colorPeriodo1
                    },

                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 13,
                                weight: "600"
                            },
                            color: "#333"
                        }
                    },
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
                            callback: (v) => formatPrice(v),
                            color: "#333",
                            font: { size: 12 }
                        },
                        grid: { color: "rgba(0,0,0,0.05)" }
                    },
                    x: {
                        ticks: {
                            color: "#333",
                            font: { size: 12 }
                        },
                        grid: { display: false }
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
                    .append($("<span>", { text: `${item.veces} días con ${item.clientes} clientes` }))
                    .append($("<span>", { class: "italic", text: rank === 1 ? "⭐ Mejor día" : "" }))
            );

            row.append(content);
            list.append(row);
        });

        container.append(header, list);
        $("#" + opts.parent).html(container);
    }

    handleCategoryChange(idudn) {
        // Filtrar las clasificaciones que coincidan con el idudn
        let lsclasificacion = clasificacion.filter((item) => item.udn == idudn);

        // Generar options HTML para el select
        const optionsHtml = lsclasificacion.map(item => 
            `<option value="${item.id}">${item.valor}</option>`
        ).join('');

        // Actualizar el select con las opciones
        $('#category').html(optionsHtml);
    }
}

class Sales extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "sales";
    }

    render() {
        this.layout();
        this.filterBar();
        this.listSales()
    }



    layout() {
        this.primaryLayout({
            parent: `container-sales`,
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
                    onchange: `sales.listSales()`,
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
                    onchange: `sales.listSales()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `sales.listSales()`,
                },
                {
                    opc: "select",
                    id: "type",
                    lbl: "Consultar",
                    class: "col-sm-3",
                    data: [
                        { id: "3", valor: "Promedios Diarios" },
                        { id: "1", valor: " Ingresos por día" },
                        { id: "2", valor: "Captura de sales" },
                    ],
                    onchange: `sales.listSales()`,
                },
            ],
        });
        const currentMonth = moment().month() + 1; // Mes actual (1-12)
        setTimeout(() => {
            $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    listSales() {
        const monthText = $("#filterBarsales #mes option:selected").text();
        $("#containersales").html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold ">📦 VENTAS DIARIAS</h2>
                <p class="text-gray-400">Consultar y capturar ventas diaria por unidad de negocio (sales)</p>
            </div>
            <div id="container-table-sales"></div>
        `);
        this.createTable({
            parent: "container-table-sales",
            idFilterBar: `filterBarsales`,
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

class MonthlySales extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "ComparativaMensual";
    }

    render() {
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
                    onchange: `monthlySales.lsComparativa()`,
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
                    onchange: `monthlySales.lsComparativa()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `monthlySales.lsComparativa()`,
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
                    onchange: `monthlySales.lsComparativa()`,
                },
            ],
        });
        setTimeout(() => {
            // $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth).trigger("change");
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

class CumulativeAverages extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "promediosAcumulados";
    }

    render() {
        this.layout();
        this.filterBar();
        this.ls();
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
                    onchange: `cumulativeAverages.ls()`,
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
                    onchange: `cumulativeAverages.ls()`,
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
                    onchange: `cumulativeAverages.ls()`,
                },
            ],
        });
        // initialized.
        setTimeout(() => {
            // $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth + 1).trigger("change");
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


class DashboardChequePromedio extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
  