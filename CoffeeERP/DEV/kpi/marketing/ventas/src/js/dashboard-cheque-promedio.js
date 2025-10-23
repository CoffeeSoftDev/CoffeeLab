class DashboardChequePromedio extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "dashboardChequePromedio";
    }

    render() {
        this.layout();
    }

    layout() {
        this.dashboardComponent({
            parent: "container-dashboardChequePromedio",
            id: "dashboardComponentCP",
            title: "📊 Dashboard de Cheque Promedio",
            subtitle: "Análisis detallado de cheque promedio, ventas y clientes con comparativas anuales",
            json: [
                { type: "grafico", id: "containerChequeComparativo", title: "Cheque Promedio por Categoría" },
                { type: "grafico", id: "containerVentasDiarias", title: "Tendencia de Ventas Diarias" },
                { type: "grafico", id: "containerVentasSemanales", title: "Ventas por Día de la Semana" },
                { type: "grafico", id: "containerRankingSemanal", title: "Ranking Semanal" },
            ]
        });

        this.filterBarDashboard();
    }

    filterBarDashboard() {
        this.createfilterBar({
            parent: `filterBarDashboardCP`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0",
                    data: udn,
                    onchange: `dashboardChequePromedio.renderDashboard()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `dashboardChequePromedio.renderDashboard()`,
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: `dashboardChequePromedio.renderDashboard()`,
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
                            onclick="dashboardChequePromedio.renderDashboard()"
                        >
                            <i class="icon-arrows-cw mr-2"></i>Actualizar
                        </button>
                    `
                },
            ],
        });

        const currentMonth = moment().month() + 1;
        const currentYear = moment().year();

        setTimeout(() => {
            $(`#filterBarDashboardCP #mes`).val(currentMonth).trigger("change");
            $(`#filterBarDashboardCP #anio`).val(currentYear).trigger("change");
        }, 100);
    }

    async renderDashboard() {
        if (!this.validateFilters()) {
            return;
        }

        this.showLoadingState();

        let udn = $('#filterBarDashboardCP #udn').val();
        let mes = $('#filterBarDashboardCP #mes').val();
        let anio = $('#filterBarDashboardCP #anio').val();

        try {
            let [dashboardData, categoriaData, semanalData, topMesData, topSemanaData, diariosData] = await Promise.all([
                useFetch({
                    url: 'ctrl/ctrl-dashboard-cheque-promedio.php',
                    data: { opc: "apiChequePromedioDashboard", udn, anio, mes }
                }),
                useFetch({
                    url: 'ctrl/ctrl-dashboard-cheque-promedio.php',
                    data: { opc: "apiChequePromedioByCategory", udn, anio, mes }
                }),
                useFetch({
                    url: 'ctrl/ctrl-dashboard-cheque-promedio.php',
                    data: { opc: "apiVentasPorDiaSemana", udn, anio, mes }
                }),
                useFetch({
                    url: 'ctrl/ctrl-dashboard-cheque-promedio.php',
                    data: { opc: "apiTopDiasMes", udn, anio, mes }
                }),
                useFetch({
                    url: 'ctrl/ctrl-dashboard-cheque-promedio.php',
                    data: { opc: "apiTopDiasSemanaPromedio", udn, anio, mes }
                }),
                useFetch({
                    url: 'ctrl/ctrl-dashboard-cheque-promedio.php',
                    data: { opc: "apiComparativaIngresosDiarios", udn, anio, mes }
                })
            ]);

            if (dashboardData.status !== 200) {
                this.showError("Error al obtener datos del servidor");
                return;
            }

            this.showCards(dashboardData.data);
            this.renderCharts({
                barras: categoriaData,
                barDays: semanalData,
                topDays: topMesData.data,
                topWeek: topSemanaData.data,
                linear: diariosData
            });

        } catch (error) {
            console.error("Error en renderDashboard:", error);
            this.showError("Error al cargar el dashboard. Por favor, intente nuevamente.");
        }
    }

    renderCharts(mkt) {
        this.chequeComparativo({
            data: mkt.barras.dataset,
            anioA: mkt.barras.anioA,
            anioB: mkt.barras.anioB,
        });

        this.comparativaIngresosDiarios({ data: mkt.linear });
        this.ventasPorDiaSemana(mkt.barDays);

        this.topDiasSemana({
            parent: "containerRankingSemanal",
            title: "📊 Ranking por Promedio Semanal",
            subtitle: "Promedio de ventas por día de la semana en el mes seleccionado",
            data: mkt.topWeek
        });
    }

    validateFilters() {
        const udn = $('#filterBarDashboardCP #udn').val();
        const mes = $('#filterBarDashboardCP #mes').val();
        const anio = $('#filterBarDashboardCP #anio').val();
        
        if (!udn || !mes || !anio) {
            this.showError("Todos los filtros son requeridos para generar el dashboard");
            return false;
        }
        return true;
    }

    showLoadingState() {
        $('#cardDashboardCP').html(`
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
        $('#cardDashboardCP').html(`
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div class="text-red-600 font-semibold mb-2">⚠️ Error</div>
                <div class="text-red-700">${message}</div>
            </div>
        `);
    }
}

    showCards(data) {
        if (!data) {
            this.showError("No hay datos disponibles para mostrar");
            return;
        }

        const chequePromedioActual = this.parseNumericValue(data.ChequePromedio);
        
        this.infoCard({
            parent: "cardDashboardCP",
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
        if (data && data.variacionCheque !== undefined) {
            const variacion = data.variacionCheque;
            if (variacion > 5) return `↗️ +${variacion.toFixed(1)}% vs año anterior`;
            if (variacion < -5) return `↘️ ${variacion.toFixed(1)}% vs año anterior`;
            return `→ ${variacion.toFixed(1)}% vs año anterior`;
        }

        if (valor > 1000) return "↗️ Excelente rendimiento";
        if (valor > 500) return "→ Rendimiento estable";
        return "↘️ Oportunidad de mejora";
    }

    getChequePromedioColor(valor, data = null) {
        if (data && data.tendencia) {
            switch (data.tendencia) {
                case 'positiva': return "text-[#8CC63F]";
                case 'negativa': return "text-red-600";
                default: return "text-[#103B60]";
            }
        }

        if (valor > 1000) return "text-[#8CC63F]";
        if (valor > 500) return "text-[#103B60]";
        return "text-orange-600";
    }

    chequeComparativo(options) {
        const defaults = {
            parent: "containerChequeComparativo",
            id: "chartChequeComp",
            title: "Comparativa por Categorías",
            class: "border p-4 rounded-xl",
            data: {},
            anioA: new Date().getFullYear(),
            anioB: new Date().getFullYear() - 1,
        };
        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", { class: opts.class });
        const title = $("<h2>", {
            class: "text-lg font-bold mb-2",
            text: `${opts.title}: ${opts.anioA} vs ${opts.anioB}`
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
        if (window._chqComp) window._chqComp.destroy();
        window._chqComp = new Chart(ctx, {
            type: "bar",
            data: {
                labels: opts.data.labels,
                datasets: [
                    {
                        label: `${opts.anioB}`,
                        data: opts.data.B,
                        backgroundColor: "#8CC63F"
                    },
                    {
                        label: `${opts.anioA}`,
                        data: opts.data.A,
                        backgroundColor: "#103B60"
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
        const mes = $('#filterBarDashboardCP #mes option:selected').text();
        const anio = $('#filterBarDashboardCP #anio').val();

        this.linearChart({
            parent: "containerVentasDiarias",
            id: "chartLineDiarios",
            title: `📈 Ventas de ${mes} ${anio}`,
            data: options.data
        });
    }

    ventasPorDiaSemana(data) {
        this.barChart({
            parent: 'containerVentasSemanales',
            title: 'Ventas por Día de Semana',
            ...data
        });
    }

    topDiasSemana(options) {
        const defaults = {
            parent: "containerTopDiasSemana",
            title: "📊 Ranking por Promedio Semanal",
            subtitle: "",
            data: []
        };

        const opts = Object.assign({}, defaults, options);
        const container = $("<div>", { class: "border p-4 rounded-xl bg-white" });

        const header = $("<div>", { class: "mb-3" })
            .append($("<h2>", { class: "text-lg font-bold", text: opts.title }))
            .append($("<p>", { class: "text-sm text-gray-500", text: opts.subtitle }));

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
