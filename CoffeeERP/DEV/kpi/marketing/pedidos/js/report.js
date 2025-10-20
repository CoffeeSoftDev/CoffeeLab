let api_report = 'ctrl/ctrl-report.php';
let api_canal = 'ctrl/ctrl-canal.php';
let app, report, admin;
let lsUDN, lsCanales, lsAños;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsUDN = data.udn;
    lsCanales = data.canales;
    lsAños = data.años;

    app = new AppTemporal(api_report, "root");
    report = new Report(api_report, "root");
    admin = new Admin(api_canal, "root");
  

    // app.render();
    // admin.render()
});

class AppTemporal extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Reportes";
        this.currentReportType = "pedidos";
    }

    render() {
        this.layout();
        report.render();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full ", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full h-full", id: "container" + this.PROJECT_NAME }
            }
        });

        this.headerBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            title: "📊 Reportes de Pedidos e Ingresos",
            subtitle: "Análisis de rendimiento por canales de comunicación",
            textBtn: "Dashboard",
            icon: "icon-chart",
            onClick: () => this.renderKPIDashboard()
        });

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            type: "short",
            json: [
                {
                    id: "dashboard",
                    tab: "Dashboard",
                    onClick: () => report.render()
                },
                {
                    id: "history",
                    tab: "Resumen Pedidos",
                    onClick: () => report.render()
                },
                {
                    id: "admin",
                    tab: "Administrador",
                    active: true,

                    onClick: () => admin.lsCanales()
                },

            ]
        });
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

class Report extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Report";
        this.currentReportType = "pedidos";
    }


    render() {
        this.layout();
        this.filterBar();
        this.lsResumenPedidos();
    }

    layout() {
        this.primaryLayout({
            parent: "container-history",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full ", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full h-full", id: "container" + this.PROJECT_NAME }
            }
        });


    }


    filterBar() {
        const currentMonth = new Date().getMonth() + 1;



        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: udn,
                    text: "valor",
                    value: "id",
                    onchange: "report.showReport()"
                },
                {
                    opc: "select",
                    id: "year",
                    lbl: "Año",
                    class: "col-12 col-md-2",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    text: "valor",
                    value: "id",
                    onchange: "report.showReport()"
                },
                {
                    opc: "select",
                    id: "filterMes",
                    lbl: "Mes",
                    class: "col-12 col-md-2",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    text: "valor",
                    value: "id",
                    onchange: "report.showReport()"
                },
                {
                    opc: "select",
                    id: "report",
                    class: "col-md-3",
                    lbl: "Reporte",
                    data: [
                        { id: 1, valor: "RESUMEN DE PEDIDOS " },
                        { id: 2, valor: "RESUMEN DE VENTAS " },

                    ],
                    onchange: "report.showReport()"
                },

            ]
        });


    }

    showReport() {
        console.log("Cargando datos de pedidos o ventas según selección...");
        const value = $("#report").val();
        switch (value) {
            case "1":
                this.lsResumenPedidos();
                break;
            case "2":
                this.lsResumenVentas();
                break;

        }

    }


    lsResumenPedidos() {
        const udnText = $('#filterBarReport #udn option:selected').text();
        const año = $('#filterBarReport #year').val();

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: "filterBarReport",
            data: { opc: "lsResumenPedidos" },
            coffeesoft: true,
            conf: { datatable: false, pag: 12 },
            attr: {
                id: "tbResumenPedidos",
                theme: 'corporativo',
                title: '📊 Resumen de Pedidos por Canal',
                subtitle: `Cantidad de órdenes recibidas por mes y canal de comunicación - ${udnText} (${año})`,
                center: [1, 2, 3, 4, 5, 6, 7, 8],
                right: [8],

            }
        });
    }

    lsResumenVentas() {
        const udnText = $('#filterBarReport #udn  option:selected').text();
        const año = $('#filterBarReport #year').val();

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: "filterBarReport",
            data: { opc: "lsResumenVentas" },
            coffeesoft: true,
            conf: { datatable: false, pag: 12 },
            attr: {
                id: "tbResumenVentas",
                theme: 'corporativo',
                title: '💰 Resumen de Ventas por Canal',
                subtitle: `Montos monetarios generados por mes y canal de comunicación - ${udnText} (${año})`,
                right: [2, 3, 4, 5, 6, 7, 8],

            }
        });
    }





    changeReportType(type) {
        this.currentReportType = type;
        this.toggleMonthFilter();
        this.renderCurrentReport();
    }

    toggleMonthFilter() {
        // Mostrar/ocultar filtro de mes y botón según el tipo de reporte
        if (this.currentReportType === "bitacora") {
            $('#reportFilters #filterMes').closest('.col-12').show();
            $('#reportFilters #btnAddIngreso').closest('.col-12').show();
        } else {
            $('#reportFilters #filterMes').closest('.col-12').hide();
            $('#reportFilters #btnAddIngreso').closest('.col-12').hide();
        }
    }

    renderCurrentReport() {
        switch (this.currentReportType) {
            case 'pedidos':
                this.lsResumenPedidos();
                break;
            case 'ventas':
                this.lsResumenVentas();
                break;
            case 'bitacora':
                this.lsBitacoraIngresos();
                break;
            case 'dashboard':
                this.renderKPIDashboard();
                break;
        }
    }

    updateReports() {
        this.renderCurrentReport();
    }



    lsBitacoraIngresos() {
        const udnText = $('#reportFilters #filterUDN option:selected').text();
        const año = $('#reportFilters #filterAño').val();
        const mesText = $('#reportFilters #filterMes option:selected').text();

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: "reportFilters",
            data: { opc: "lsBitacoraIngresos" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbBitacoraIngresos",
                theme: 'corporativo',
                title: '📝 Bitácora de Ingresos Diarios',
                subtitle: `Registro detallado de ingresos por fecha y canal - ${udnText} (${mesText} ${año})`,
                center: [1, 2, 3, 4],
                right: [3, 6]
            }
        });
    }

    async renderKPIDashboard() {
        const udn = $('#reportFilters #filterUDN').val();
        const año = $('#reportFilters #filterAño').val();

        const response = await useFetch({
            url: api,
            data: {
                opc: "getKPIDashboard",
                udn: udn,
                año: año
            }
        });

        if (response.status === 200) {
            const data = response.data;

            $(`#container-dashboard`).html(`
                <div class="p-6">
                    <div class="mb-6">
                        <h2 class="text-2xl font-bold text-[#103B60] mb-2">📈 Dashboard de KPIs</h2>
                        <p class="text-gray-600">Indicadores clave de rendimiento para el año ${año}</p>
                    </div>
                    
                    <div id="kpiCards" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"></div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold mb-4">📊 Participación por Canal</h3>
                            <div id="canalesChart"></div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold mb-4">📈 Comparativa Anual</h3>
                            <div id="comparativeChart"></div>
                        </div>
                    </div>
                </div>
            `);

            this.renderKPICards(data.kpis);
            this.renderCanalesChart(data.canales);
            this.renderComparativeChart(data.comparative);
        }
    }

    renderKPICards(kpis) {
        const cards = [
            {
                title: "Total Pedidos Año",
                value: kpis.total_pedidos || 0,
                color: "text-[#103B60]",
                icon: "icon-shopping-cart"
            },
            {
                title: "Total Ingresos Año",
                value: `$${parseFloat(kpis.total_ingresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
                color: "text-[#8CC63F]",
                icon: "icon-dollar"
            },
            {
                title: "Cheque Promedio",
                value: `$${parseFloat(kpis.cheque_promedio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
                color: "text-blue-600",
                icon: "icon-calculator"
            }
        ];

        let cardsHTML = '';
        cards.forEach(card => {
            cardsHTML += `
                <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#103B60]">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 mb-1">${card.title}</p>
                            <p class="text-2xl font-bold ${card.color}">${card.value}</p>
                        </div>
                        <div class="text-3xl ${card.color}">
                            <i class="${card.icon}"></i>
                        </div>
                    </div>
                </div>
            `;
        });

        $('#kpiCards').html(cardsHTML);
    }

    renderCanalesChart(canales) {
        if (!canales || canales.length === 0) {
            $('#canalesChart').html('<p class="text-gray-500 text-center py-8">No hay datos disponibles</p>');
            return;
        }

        const labels = canales.map(c => c.canal_comunicacion);
        const data = canales.map(c => parseFloat(c.porcentaje));
        const colors = ['#103B60', '#8CC63F', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

        $('#canalesChart').html('<canvas id="canalesChartCanvas" width="400" height="300"></canvas>');

        const ctx = document.getElementById('canalesChartCanvas').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed.toFixed(1) + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    renderComparativeChart(comparative) {
        if (!comparative || comparative.length === 0) {
            $('#comparativeChart').html('<p class="text-gray-500 text-center py-8">No hay datos disponibles</p>');
            return;
        }

        $('#comparativeChart').html('<canvas id="comparativeChartCanvas" width="400" height="300"></canvas>');

        // Procesar datos para Chart.js
        const canales = [...new Set(comparative.map(c => c.canal_comunicacion))];
        const currentYear = Math.max(...comparative.map(c => c.año));
        const previousYear = currentYear - 1;

        const currentYearData = canales.map(canal => {
            const item = comparative.find(c => c.canal_comunicacion === canal && c.año === currentYear);
            return item ? parseInt(item.cantidad) : 0;
        });

        const previousYearData = canales.map(canal => {
            const item = comparative.find(c => c.canal_comunicacion === canal && c.año === previousYear);
            return item ? parseInt(item.cantidad) : 0;
        });

        const ctx = document.getElementById('comparativeChartCanvas').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: canales,
                datasets: [
                    {
                        label: `${previousYear}`,
                        data: previousYearData,
                        backgroundColor: '#E5E7EB',
                        borderColor: '#9CA3AF',
                        borderWidth: 1
                    },
                    {
                        label: `${currentYear}`,
                        data: currentYearData,
                        backgroundColor: '#103B60',
                        borderColor: '#1E40AF',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    addIngreso() {
        this.createModalForm({
            id: 'formIngresoAdd',
            data: { opc: 'addIngreso' },
            bootbox: {
                title: 'Agregar Ingreso Diario'
            },
            json: this.jsonIngreso(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.renderBitacoraIngresos();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editIngreso(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getIngreso", id: id }
        });

        if (request.status === 200) {
            this.createModalForm({
                id: 'formIngresoEdit',
                data: { opc: 'editIngreso', id: id },
                bootbox: {
                    title: 'Editar Ingreso Diario'
                },
                autofill: request.data,
                json: this.jsonIngreso(),
                success: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.renderBitacoraIngresos();
                    } else {
                        alert({ icon: "info", title: "Oops!...", text: response.message });
                    }
                }
            });
        }
    }

    deleteIngreso(id) {
        this.swalQuestion({
            opts: {
                title: "¿Eliminar este ingreso?",
                text: "Esta acción no se puede deshacer",
                icon: "warning"
            },
            data: {
                opc: "deleteIngreso",
                id: id
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.renderBitacoraIngresos();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    jsonIngreso() {
        const udn = $('#reportFilters #filterUDN').val();

        return [
            {
                opc: "input",
                id: "udn_id",
                type: "hidden",
                value: udn
            },
            {
                opc: "input",
                id: "fecha",
                lbl: "Fecha",
                type: "date",
                class: "col-12 mb-3",
                value: moment().format('YYYY-MM-DD')
            },
            {
                opc: "select",
                id: "canal_comunicacion",
                lbl: "Canal de Comunicación",
                class: "col-12 mb-3",
                data: lsCanales,
                text: "valor",
                value: "valor"
            },
            {
                opc: "input",
                id: "monto",
                lbl: "Monto Total",
                type: "number",
                step: "0.01",
                class: "col-12 mb-3",
                placeholder: "0.00"
            },
            {
                opc: "input",
                id: "cantidad_pedidos",
                lbl: "Cantidad de Pedidos",
                type: "number",
                class: "col-12 mb-3",
                placeholder: "0"
            }
        ];
    }

}

class Admin extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Admin";
        this.currentReportType = "pedidos";
    }


    render() {
        this.layout();
        this.filterBar();
        this.lsCanales();
    }

    layout() {
        this.primaryLayout({
            parent: "container-admin",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full ", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full h-full", id: "container" + this.PROJECT_NAME }
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
                    onchange: `admin.lsCanales()`
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNuevoCanal",
                    text: "Nuevo Canal",
                    onClick: () => this.addCanal()
                }
            ]
        });


    }

    lsCanales() {
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBarAdmin",
            data: { opc: "lsCanales" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbCanales",
                theme: 'corporativo',
                center: [2, 3]
            }
        });
    }

    addCanal() {
        this.createModalForm({
            id: 'formCanalAdd',
            data: { opc: 'addCanal' },
            bootbox: {
                title: 'Agregar Canal',
            },
            json: this.jsonCanal(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsCanales();
                } else {
                    alert({
                        icon: response.status === 409 ? "warning" : "error",
                        title: response.status === 409 ? "Canal duplicado" : "Error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

    async editCanal(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCanal", id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message,
                btn1: true
            });
            return;
        }

        this.createModalForm({
            id: 'formCanalEdit',
            data: { opc: 'editCanal', id },
            bootbox: {
                title: 'Editar Canal',
            },
            autofill: request.data,
            json: this.jsonCanal(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsCanales();
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

    statusCanal(id, active) {
        const accion = active === 1 ? "desactivar" : "activar";

        this.swalQuestion({
            opts: {
                title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} canal?`,
                text: `Esta acción ${accion === "desactivar" ? "ocultará" : "mostrará"} el canal.`,
                icon: "warning"
            },
            data: { opc: "statusCanal", active: active === 1 ? 0 : 1, id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.lsCanales();
                    }
                }
            }
        });
    }

    jsonCanal() {
        return [
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre del Canal",
                class: "col-12 mb-3"
            }
        ];
    }

}

class DashboardOrder extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "salesDashboard";
    }

    render() {
        this.layout();
    }

    async layout() {
        this.dashboardComponent({
            parent: "container-dashboard",
            id: "dashboardComponent",
            title: "📊 Dashboard de Ventas",
            subtitle: "Análisis anual, por periodo y por hora.",
            json: [
                { type: "grafico", id: "lineChartContainer", title: "Pedidos por mes del año 2025" },
                { type: "grafico", id: "barChartContainer", title: "Ventas por Canal" },
                { type: "tabla", id: "channelRankingContainer", title: "Canales con Mejor Rendimiento" },
                { type: "tabla", id: "monthlyPerformanceContainer", title: "Rendimiento mensual" },
            ]
        });

        this.filterBarDashboard();

        let udn = $('#filterBarDashboard #udn').val();
        let month = $('#filterBarDashboard #mes').val();
        let year = $('#filterBarDashboard #anio').val();

        let mkt = await useFetch({
            url: api_dashboard,
            data: {
                opc: "apiPromediosDiarios",
                udn: udn,
                mes: month,
                anio: year,
            },
        });

        this.showCards(mkt.dashboard);
        this.renderLineChart(mkt.lineChart);
        this.renderBarChart(mkt.barChart);
        this.renderChannelRanking(mkt.channelRanking);
        this.renderMonthlyPerformance(mkt.monthlyPerformance);
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
                    onchange: `salesDashboard.layout()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `salesDashboard.layout()`,
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
                    onchange: `salesDashboard.layout()`,
                },
            ],
        });

        const currentMonth = moment().month() + 1;
        setTimeout(() => {
            $(`#filterBarDashboard #mes`).val(currentMonth);
        }, 100);
    }

    showCards(data) {
        this.infoCard({
            parent: "cardDashboard",
            theme: "light",
            json: [
                {
                    id: "kpiIngresos",
                    title: "Ingresos Totales",
                    data: {
                        value: data.ingresosTotales,
                        description: data.variacionIngresos,
                        color: "text-[#8CC63F]",
                    },
                },
                {
                    id: "kpiPedidos",
                    title: "Total de Pedidos",
                    data: {
                        value: data.totalPedidos,
                        description: data.rangeFechas,
                        color: "text-[#103B60]",
                    },
                },
                {
                    id: "kpiPromedio",
                    title: "Valor Promedio",
                    data: {
                        value: data.valorPromedio,
                        description: "por pedido",
                        color: "text-blue-600",
                    },
                },
                {
                    id: "kpiCanal",
                    title: "Canal Principal",
                    data: {
                        value: data.canalPrincipal,
                        description: data.porcentajeCanal,
                        color: "text-green-700",
                    },
                },
            ],
        });
    }



    renderLineChart(data) {
        const container = $("<div>", { class: "p-4" });
        const title = $("<h3>", {
            class: "text-lg font-semibold mb-4 text-gray-800",
            text: `Pedidos por mes del año ${new Date().getFullYear()}`
        });
        const canvasContainer = $("<div>", {
            class: "chart-container"
        });
        const canvas = $("<canvas>", {
            id: "lineChart",
            class: "w-full h-full"
        });

        canvasContainer.append(canvas);
        container.append(title, canvasContainer);
        $("#lineChartContainer").html(container);

        const ctx = document.getElementById("lineChart").getContext("2d");
        if (window._lineChart) window._lineChart.destroy();

        window._lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.labels,
                datasets: [{
                    label: "Total de Pedidos",
                    data: data.values,
                    borderColor: "#103B60",
                    backgroundColor: "rgba(16, 59, 96, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#103B60",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        callbacks: {
                            label: (context) => `${context.parsed.y} pedidos`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(0, 0, 0, 0.1)"
                        },
                        ticks: {
                            color: "#6B7280"
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: "#6B7280"
                        }
                    }
                }
            }
        });
    }

    renderBarChart(data) {
        const container = $("<div>", { class: "p-4" });
        const title = $("<h3>", {
            class: "text-lg font-semibold mb-4 text-gray-800",
            text: "Ventas por Canal"
        });
        const canvasContainer = $("<div>", {
            class: "chart-container"
        });
        const canvas = $("<canvas>", {
            id: "barChart",
            class: "w-full h-full"
        });

        canvasContainer.append(canvas);
        container.append(title, canvasContainer);
        $("#barChartContainer").html(container);

        const ctx = document.getElementById("barChart").getContext("2d");
        if (window._barChart) window._barChart.destroy();

        const channelColors = {
            'WhatsApp': '#25D366',
            'Meep': '#FF6B35',
            'Ecommerce': '#007BFF',
            'Facebook': '#1877F2',
            'Llamada': '#6C757D',
            'Uber': '#000000',
            'Otro': '#9E9E9E'
        };

        const datasets = data.channels.map(channel => ({
            label: channel.name,
            data: channel.data,
            backgroundColor: channelColors[channel.name] || '#9E9E9E',
            borderRadius: 4,
            borderSkipped: false
        }));

        window._barChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.months,
                datasets: datasets
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
                            boxWidth: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${this.formatPrice(context.parsed.y)}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: false,
                        grid: {
                            color: "rgba(0, 0, 0, 0.1)"
                        },
                        ticks: {
                            color: "#6B7280",
                            callback: (value) => this.formatPrice(value)
                        }
                    },
                    x: {
                        stacked: false,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: "#6B7280"
                        }
                    }
                }
            }
        });
    }

    renderChannelRanking(data) {
        const container = $("<div>", { class: "p-4" });
        const title = $("<h3>", {
            class: "text-lg font-semibold mb-4 text-gray-800",
            text: "Canales con Mejor Rendimiento"
        });

        const list = $("<div>", { class: "space-y-3" });

        const channelIcons = {
            'WhatsApp': '💬',
            'Meep': '🛍️',
            'Ecommerce': '🌐',
            'Facebook': '📘',
            'Llamada': '📞',
            'Uber': '🚗',
            'Otro': '📋'
        };

        const channelColors = {
            'WhatsApp': 'bg-green-50 border-green-200',
            'Meep': 'bg-orange-50 border-orange-200',
            'Ecommerce': 'bg-blue-50 border-blue-200',
            'Facebook': 'bg-blue-50 border-blue-200',
            'Llamada': 'bg-gray-50 border-gray-200',
            'Uber': 'bg-gray-50 border-gray-200',
            'Otro': 'bg-gray-50 border-gray-200'
        };

        data.forEach((channel, index) => {
            const row = $("<div>", {
                class: `flex items-center justify-between p-3 rounded-lg border ${channelColors[channel.name] || 'bg-gray-50 border-gray-200'}`
            });

            const leftSection = $("<div>", { class: "flex items-center gap-3" });

            const icon = $("<span>", {
                class: "text-2xl",
                text: channelIcons[channel.name] || '📋'
            });

            const info = $("<div>");
            info.append($("<div>", {
                class: "font-semibold text-gray-800",
                text: channel.name
            }));
            info.append($("<div>", {
                class: "text-sm text-gray-600",
                text: `${channel.orders} pedidos`
            }));

            leftSection.append(icon, info);

            const rightSection = $("<div>", { class: "text-right" });
            rightSection.append($("<div>", {
                class: "font-bold text-lg text-gray-800",
                text: this.formatPrice(channel.total)
            }));
            rightSection.append($("<div>", {
                class: "text-sm text-gray-600",
                text: `${channel.percentage}%`
            }));

            row.append(leftSection, rightSection);
            list.append(row);
        });

        container.append(title, list);
        $("#channelRankingContainer").html(container);
    }

    renderMonthlyPerformance(data) {
        const container = $("<div>", { class: "p-4" });
        const title = $("<h3>", {
            class: "text-lg font-semibold mb-4 text-gray-800",
            text: "📊 Rendimiento mensual"
        });

        const table = $("<div>", { class: "overflow-x-auto" });
        const tableElement = $("<table>", { class: "w-full border-collapse" });

        // Header
        const thead = $("<thead>");
        const headerRow = $("<tr>", { class: "bg-[#103B60] text-white" });
        headerRow.append(
            $("<th>", { class: "px-4 py-3 text-left font-semibold", text: "Mes" }),
            $("<th>", { class: "px-4 py-3 text-center font-semibold", text: "Pedidos" }),
            $("<th>", { class: "px-4 py-3 text-right font-semibold", text: "Ventas" }),
            $("<th>", { class: "px-4 py-3 text-center font-semibold", text: "Crecimiento" })
        );
        thead.append(headerRow);

        // Body
        const tbody = $("<tbody>");
        data.forEach((month, index) => {
            const row = $("<tr>", {
                class: index % 2 === 0 ? "bg-gray-50" : "bg-white"
            });

            const growthClass = month.growth >= 0 ? "text-green-600" : "text-red-600";
            const growthIcon = month.growth >= 0 ? "↑" : "↓";
            const growthText = `${growthIcon} ${Math.abs(month.growth)}%`;

            row.append(
                $("<td>", { class: "px-4 py-3 font-medium", text: month.name }),
                $("<td>", { class: "px-4 py-3 text-center", text: month.orders }),
                $("<td>", { class: "px-4 py-3 text-right font-semibold", text: this.formatPrice(month.sales) }),
                $("<td>", {
                    class: `px-4 py-3 text-center font-semibold ${growthClass}`,
                    text: growthText
                })
            );
            tbody.append(row);
        });

        tableElement.append(thead, tbody);
        table.append(tableElement);
        container.append(title, table);
        $("#monthlyPerformanceContainer").html(container);
    }

    dashboardComponent(options) {
        const defaults = {
            parent: "root",
            id: "dashboardComponent",
            title: "📊 Dashboard de Ventas",
            subtitle: "Análisis mensual de productos vendidos y con margen",
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
                class: "bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            });

            if (item.title) {
                const emoji = '📊';
                const titleContent = `${emoji} ${item.title}`;
                block.prepend(`<h3 class="text-sm font-semibold text-gray-800 mb-3 px-4 pt-4">${titleContent}</h3>`);
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
            json: []
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

            const description = $("<p>", {
                class: `text-xs mt-1 ${card.data?.description?.includes('↑') ? 'text-green-600' : card.data?.description?.includes('↓') ? 'text-red-600' : 'text-gray-500'}`,
                text: card.data?.description || ""
            });

            box.append(title, value, description);
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
            class: "rounded-xl",
            data: {}
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
                                const tooltips = opts.data.tooltip || opts.data.labels;
                                return tooltips[index];
                            },
                            label: (ctx) => `${ctx.dataset.label}: ${this.formatPrice(ctx.parsed.y)}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (v) => this.formatPrice(v)
                        }
                    }
                }
            }
        });
    }

    formatPrice(amount) {
        return '$' + Number(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}