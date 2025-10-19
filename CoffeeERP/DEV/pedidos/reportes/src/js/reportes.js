let api = 'ctrl/ctrl-reportes.php';
let app;
let lsUDN, lsCanales, lsAños;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsUDN = data.udn;
    lsCanales = data.canales;
    lsAños = data.años;

    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Reportes";
        this.currentReportType = "pedidos";
    }

    render() {
        this.layout();
        this.filterBar();
        // this.renderCurrentReport();
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
                    id: "pedidos",
                    tab: "Resumen Pedidos",
                    active: true,
                    onClick: () => this.changeReportType("pedidos")
                },
                {
                    id: "ventas",
                    tab: "Resumen Ventas",
                    onClick: () => this.changeReportType("ventas")
                },
                {
                    id: "bitacora",
                    tab: "Bitácora Ingresos",
                    onClick: () => this.changeReportType("bitacora")
                },
                {
                    id: "dashboard",
                    tab: "KPIs & Gráficas",
                    onClick: () => this.changeReportType("dashboard")
                }
            ]
        });
    }

    filterBar() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const months = [
            { id: 1, valor: "Enero" }, { id: 2, valor: "Febrero" }, { id: 3, valor: "Marzo" },
            { id: 4, valor: "Abril" }, { id: 5, valor: "Mayo" }, { id: 6, valor: "Junio" },
            { id: 7, valor: "Julio" }, { id: 8, valor: "Agosto" }, { id: 9, valor: "Septiembre" },
            { id: 10, valor: "Octubre" }, { id: 11, valor: "Noviembre" }, { id: 12, valor: "Diciembre" }
        ];

      
        this.createfilterBar({
            parent: "content-pedidos",
            data: [
                {
                    opc: "select",
                    id: "filterUDN",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: lsUDN,
                    text: "valor",
                    value: "id",
                    onchange: "app.updateReports()"
                },
                {
                    opc: "select",
                    id: "filterAño",
                    lbl: "Año",
                    class: "col-12 col-md-2",
                    data: lsAños,
                    text: "valor",
                    value: "id",
                    selected: currentYear,
                    onchange: "app.updateReports()"
                },
                {
                    opc: "select",
                    id: "filterMes",
                    lbl: "Mes",
                    class: "col-12 col-md-2",
                    data: months,
                    text: "valor",
                    value: "id",
                    selected: currentMonth,
                    onchange: "app.updateReports()"
                },
                {
                    opc: "button",
                    id: "btnAddIngreso",
                    text: "Nuevo Ingreso",
                    class: "col-12 col-md-2",
                    color_btn: "success",
                    icono: "icon-plus",
                    onClick: () => this.addIngreso(),
                    style: "display: none;"
                }
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
            classBtn: "bg-[#103B60] hover:bg-blue-800",
            onClick: null
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "flex justify-between items-center px-4 pt-4 pb-3"
        });

        const leftSection = $("<div>").append(
            $("<h2>", {
                class: "text-2xl font-semibold text-[#103B60]",
                text: opts.title
            }),
            $("<p>", {
                class: "text-gray-500",
                text: opts.subtitle
            })
        );

        const rightSection = $("<div>").append(
            $("<button>", {
                class: `${opts.classBtn} text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2`,
                html: `<i class="${opts.icon}"></i>${opts.textBtn}`,
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



class Resumen extends Templates{

    render(){

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
                this.renderResumenPedidos();
                break;
            case 'ventas':
                this.renderResumenVentas();
                break;
            case 'bitacora':
                this.renderBitacoraIngresos();
                break;
            case 'dashboard':
                this.renderKPIDashboard();
                break;
        }
    }

    updateReports() {
        this.renderCurrentReport();
    }

    renderResumenPedidos() {
        this.createTable({
            parent: `container-pedidos`,
            idFilterBar: "reportFilters",
            data: { opc: "lsResumenPedidos" },
            coffeesoft: true,
            conf: { datatable: false, pag: 12 },
            attr: {
                id: "tbResumenPedidos",
                theme: 'corporativo',
                title: '📊 Resumen de Pedidos por Canal',
                subtitle: 'Cantidad de órdenes recibidas por mes y canal de comunicación',
                center: [1, 2, 3, 4, 5, 6, 7, 8],
                right: [8],
                striped: true
            }
        });
    }

    renderResumenVentas() {
        this.createTable({
            parent: `container-ventas`,
            idFilterBar: "reportFilters",
            data: { opc: "lsResumenVentas" },
            coffeesoft: true,
            conf: { datatable: false, pag: 12 },
            attr: {
                id: "tbResumenVentas",
                theme: 'corporativo',
                title: '💰 Resumen de Ventas por Canal',
                subtitle: 'Montos monetarios generados por mes y canal de comunicación',
                center: [1, 2, 3, 4, 5, 6, 7, 8],
                right: [8],
                striped: true
            }
        });
    }

    renderBitacoraIngresos() {
        this.createTable({
            parent: `container-bitacora`,
            idFilterBar: "reportFilters",
            data: { opc: "lsBitacoraIngresos" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbBitacoraIngresos",
                theme: 'corporativo',
                title: '📝 Bitácora de Ingresos Diarios',
                subtitle: 'Registro detallado de ingresos por fecha y canal',
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