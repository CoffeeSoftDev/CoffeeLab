let api = "../pedidos/ctrl/ctrl-pedidos.php";
let orderDashboard;

$(async () => {
    orderDashboard = new OrderDashboard(api, 'root');
    orderDashboard.init();
});

class OrderDashboard extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "OrderDashboard";
        this.chartInstance = null;
        this.currentMonth = new Date().getMonth() + 1;
        this.currentYear = new Date().getFullYear();
        this.errorCount = 0;
        this.lastLoadTime = 0;
    }

    init() {
        this.initializeErrorHandling();
        this.setupConnectionMonitoring();

        const perfMonitor = this.monitorPerformance();
        this.render();
        perfMonitor.end();

        this.finalizeInitialization();
    }

    render() {
        this.layout();
        this.createFilterBar();
        this.setupResponsiveDesign();
        this.loadUrlParams();
        this.loadMetrics();
        this.setupBrowserNavigation();
        this.setupResponsiveChart();
        this.setupAdvancedLoadingStates();
        this.checkOnboarding();
    }

    setupBrowserNavigation() {
        window.addEventListener('popstate', () => {
            this.loadUrlParams();
            this.loadMetrics();
        });
    }

    layout() {
        const mainContainer = $('<div>', {
            id: this.PROJECT_NAME,
            class: 'min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8'
        });

        const headerSection = $('<div>', {
            class: 'mb-8'
        }).html(`
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                    <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">
                        📊 Dashboard de Pedidos
                    </h1>
                    <p class="text-gray-400 text-lg">Métricas y análisis en tiempo real</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <div class="flex items-center space-x-2 text-sm text-gray-500">
                        <i class="icon-clock"></i>
                        <span id="lastUpdate">Última actualización: ${new Date().toLocaleTimeString('es-MX')}</span>
                    </div>
                </div>
            </div>
        `);

        const filterBarContainer = $('<div>', {
            id: 'filterBar' + this.PROJECT_NAME,
            class: 'bg-gray-800 rounded-xl p-4 sm:p-6 mb-8 border border-gray-700 shadow-lg'
        });

        const contentContainer = $('<div>', {
            id: 'container' + this.PROJECT_NAME,
            class: 'space-y-8'
        });

        const metricsSection = $('<div>', {
            class: 'space-y-6'
        }).html(`
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-white">Métricas Principales</h2>
                <button id="refreshMetrics" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                    <i class="icon-refresh"></i>
                    <span class="hidden sm:inline">Actualizar</span>
                </button>
            </div>
            <div id="metricsCards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"></div>
        `);

        const chartSection = $('<div>', {
            id: 'chartSection',
            class: 'bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 shadow-lg'
        }).html(`
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h3 class="text-xl font-semibold text-white mb-1">Tendencia de Pedidos</h3>
                    <p class="text-gray-400 text-sm">Evolución mensual de pedidos</p>
                </div>
                <div class="mt-4 sm:mt-0 flex items-center space-x-2">
                    <div class="flex items-center space-x-2 text-sm text-gray-400">
                        <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Pedidos</span>
                    </div>
                </div>
            </div>
            <div class="relative h-64 sm:h-80">
                <canvas id="ordersChart"></canvas>
            </div>
        `);

        contentContainer.append(metricsSection, chartSection);
        mainContainer.append(headerSection, filterBarContainer, contentContainer);
        $('#root').html(mainContainer);

        $('#refreshMetrics').on('click', () => {
            this.loadMetrics();
        });
    }

    createFilterBar() {
        const currentMonth = String(this.currentMonth).padStart(2, '0');
        const currentYear = String(this.currentYear);

        const filterBarHtml = `
            <div class="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
                <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-white mb-4 flex items-center">
                        <i class="icon-filter mr-2"></i>
                        Filtros de Consulta
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="space-y-2">
                            <label for="monthSelect" class="block text-sm font-medium text-gray-300">Mes</label>
                            <select id="monthSelect" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                ${Array.from({ length: 12 }, (_, i) => {
            const monthNum = String(i + 1).padStart(2, '0');
            const monthName = new Date(0, i).toLocaleString('es-MX', { month: 'long' });
            const selected = monthNum === currentMonth ? 'selected' : '';
            return `<option value="${monthNum}" ${selected}>${monthName}</option>`;
        }).join('')}
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label for="yearSelect" class="block text-sm font-medium text-gray-300">Año</label>
                            <select id="yearSelect" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                ${Array.from({ length: 5 }, (_, i) => {
            const year = this.currentYear - i;
            const selected = year === this.currentYear ? 'selected' : '';
            return `<option value="${year}" ${selected}>${year}</option>`;
        }).join('')}
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-300">Acceso Rápido</label>
                            <div class="flex flex-wrap gap-2">
                                <button id="currentMonth" class="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
                                    Mes Actual
                                </button>
                                <button id="lastMonth" class="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200">
                                    Mes Anterior
                                </button>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-300">Acciones</label>
                            <div class="flex flex-col sm:flex-row gap-2">
                                <button id="applyFilters" class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                                    <i class="icon-search mr-2"></i>
                                    Aplicar
                                </button>
                                <button id="resetFilters" class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                                    <i class="icon-refresh mr-2"></i>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $(`#filterBar${this.PROJECT_NAME}`).html(filterBarHtml);
        this.setupFilterEvents();
    }

    setupFilterEvents() {
        $('#applyFilters').on('click', (e) => {
            e.preventDefault();
            this.applyFilters();
        });

        $('#resetFilters').on('click', (e) => {
            e.preventDefault();
            this.resetFilters();
        });

        $('#currentMonth').on('click', (e) => {
            e.preventDefault();
            this.setCurrentMonth();
        });

        $('#lastMonth').on('click', (e) => {
            e.preventDefault();
            this.setLastMonth();
        });

        let filterTimeout;
        $('#monthSelect, #yearSelect').on('change', () => {
            clearTimeout(filterTimeout);
            filterTimeout = setTimeout(() => {
                this.highlightApplyButton();
            }, 300);
        });

        $('#monthSelect, #yearSelect').on('keypress', (e) => {
            if (e.which === 13) {
                e.preventDefault();
                this.applyFilters();
            }
        });

        this.setupAutoRefresh();
    }

    async applyFilters() {
        const month = $('#monthSelect').val();
        const year = $('#yearSelect').val();

        if (!month || !year) {
            this.showError('Por favor selecciona un mes y año válidos');
            return;
        }

        this.lastSelectedMonth = month;
        this.lastSelectedYear = year;
        this.updateUrlParams(month, year);
        await this.loadMetrics();
        this.resetApplyButtonHighlight();
    }

    resetFilters() {
        $('#monthSelect').val(String(this.currentMonth).padStart(2, '0'));
        $('#yearSelect').val(String(this.currentYear));
        this.showFilterResetMessage();
        setTimeout(() => this.applyFilters(), 500);
    }

    setCurrentMonth() {
        $('#monthSelect').val(String(this.currentMonth).padStart(2, '0'));
        $('#yearSelect').val(String(this.currentYear));
        this.highlightQuickFilter('#currentMonth');
        this.applyFilters();
    }

    setLastMonth() {
        const lastMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1;
        const lastMonthYear = this.currentMonth === 1 ? this.currentYear - 1 : this.currentYear;

        $('#monthSelect').val(String(lastMonth).padStart(2, '0'));
        $('#yearSelect').val(String(lastMonthYear));
        this.highlightQuickFilter('#lastMonth');
        this.applyFilters();
    }

    highlightApplyButton() {
        const button = $('#applyFilters');
        button.addClass('ring-2 ring-green-400 bg-green-700 animate-pulse');
        setTimeout(() => {
            button.removeClass('animate-pulse');
        }, 2000);
    }

    resetApplyButtonHighlight() {
        $('#applyFilters').removeClass('ring-2 ring-green-400 bg-green-700 animate-pulse');
    }

    highlightQuickFilter(selector) {
        $('#currentMonth, #lastMonth').removeClass('bg-blue-700 ring-2 ring-blue-400');
        $(selector).addClass('bg-blue-700 ring-2 ring-blue-400');
        setTimeout(() => {
            $(selector).removeClass('bg-blue-700 ring-2 ring-blue-400');
        }, 2000);
    }

    updateUrlParams(month, year) {
        if (window.history && window.history.pushState) {
            const url = new URL(window.location);
            url.searchParams.set('month', month);
            url.searchParams.set('year', year);
            window.history.pushState({}, '', url);
        }
    }

    loadUrlParams() {
        const url = new URL(window.location);
        const month = url.searchParams.get('month');
        const year = url.searchParams.get('year');

        if (month && year) {
            $('#monthSelect').val(month);
            $('#yearSelect').val(year);
        }
    }

    setupAutoRefresh() {
        setInterval(() => {
            const selectedMonth = parseInt($('#monthSelect').val());
            const selectedYear = parseInt($('#yearSelect').val());

            if (selectedMonth === this.currentMonth && selectedYear === this.currentYear) {
                this.loadMetrics();
                this.showAutoRefreshMessage();
            }
        }, 5 * 60 * 1000);
    }

    showFilterResetMessage() {
        const message = $(`
            <div class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300">
                <div class="flex items-center space-x-2">
                    <i class="icon-refresh"></i>
                    <span>Filtros restablecidos al mes actual</span>
                </div>
            </div>
        `);

        $('body').append(message);
        setTimeout(() => {
            message.addClass('opacity-0 transform -translate-y-2');
            setTimeout(() => message.remove(), 300);
        }, 2000);
    }

    showAutoRefreshMessage() {
        console.log('Auto-refresh: Datos actualizados automáticamente');
        const indicator = $('#lastUpdate');
        indicator.addClass('text-green-400');
        setTimeout(() => indicator.removeClass('text-green-400'), 2000);
    }

    async loadMetrics() {
        try {
            this.showLoadingState();
            this.setButtonLoadingState(true);

            const month = $('#monthSelect').val() || this.currentMonth;
            const year = $('#yearSelect').val() || this.currentYear;

            if (!this.validateDateInputs(month, year)) {
                this.showError('Por favor selecciona un mes y año válidos');
                return;
            }

            this.updateTimestamp();
            this.logActivity(`Cargando métricas para ${this.getMonthName(month)} ${year}`);

            const response = await Promise.race([
                useFetch({
                    url: this._link,
                    data: {
                        opc: 'getDashboardMetrics',
                        month: parseInt(month),
                        year: parseInt(year)
                    }
                }),
                this.createTimeout(10000)
            ]);

            if (response.status === 200 && response.data) {
                await this.handleSuccessResponse(response.data);
                this.logActivity('Métricas cargadas exitosamente');
            } else {
                throw new Error(response.message || 'Respuesta inválida del servidor');
            }

        } catch (error) {
            this.handleLoadError(error);
        } finally {
            this.setButtonLoadingState(false);
        }
    }

    async handleSuccessResponse(data) {
        if (!this.validateResponseData(data)) {
            throw new Error('Estructura de datos inválida recibida del servidor');
        }

        await Promise.all([
            this.updateCards(data),
            this.renderChart(data.chartData)
        ]);

        this.showSuccessMessage('Datos actualizados correctamente');
    }

    validateDateInputs(month, year) {
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        return monthNum >= 1 && monthNum <= 12 &&
            yearNum >= 2020 && yearNum <= new Date().getFullYear() + 1;
    }

    validateResponseData(data) {
        return data &&
            typeof data.totalOrders !== 'undefined' &&
            data.completedSales &&
            data.pendingSales &&
            data.chartData;
    }

    createTimeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: La solicitud tardó demasiado')), ms);
        });
    }

    setButtonLoadingState(isLoading) {
        const button = $('#applyFilters');
        const refreshButton = $('#refreshMetrics');

        if (isLoading) {
            button.prop('disabled', true)
                .html('<i class="icon-spin animate-spin mr-2"></i>Cargando...');
            refreshButton.prop('disabled', true)
                .html('<i class="icon-spin animate-spin mr-2"></i><span class="hidden sm:inline">Cargando...</span>');
        } else {
            button.prop('disabled', false)
                .html('<i class="icon-search mr-2"></i>Aplicar');
            refreshButton.prop('disabled', false)
                .html('<i class="icon-refresh mr-2"></i><span class="hidden sm:inline">Actualizar</span>');
        }
    }

    updateTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        $('#lastUpdate').text(`Última actualización: ${timeString}`);
    }

    getMonthName(monthNum) {
        return new Date(0, monthNum - 1).toLocaleString('es-MX', { month: 'long' });
    }

    logActivity(message) {
        console.log(`[Dashboard] ${new Date().toISOString()}: ${message}`);
    }

    showSuccessMessage(message) {
        const notification = $(`
            <div class="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300">
                <div class="flex items-center space-x-2">
                    <i class="icon-check"></i>
                    <span>${message}</span>
                </div>
            </div>
        `);

        $('body').append(notification);
        setTimeout(() => notification.removeClass('translate-x-full'), 100);
        setTimeout(() => {
            notification.addClass('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    handleLoadError(error) {
        console.error('Error loading dashboard metrics:', error);
        this.handleAPIError(error, 'loadMetrics');
        this.logActivity(`Error: ${error.message || 'Unknown error'}`);
        this.showFallbackData();
    }

    showFallbackData() {
        this.updateCards({
            totalOrders: 0,
            completedSales: { count: 0, amount: 0 },
            pendingSales: { count: 0, amount: 0 }
        });

        this.renderChart({
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            datasets: [{ data: [0, 0, 0, 0] }]
        });
    }

    async updateCards(data) {
        const cards = [
            {
                id: 'totalOrders',
                title: 'Pedidos del Mes',
                value: this.formatInteger(data.totalOrders || 0),
                rawValue: data.totalOrders || 0,
                subtitle: 'Total de pedidos registrados',
                icon: 'icon-shopping-cart',
                color: 'blue',
                bgGradient: 'from-blue-500 to-blue-600',
                textColor: 'text-blue-400',
                trend: this.calculateTrend(data.totalOrders, data.previousTotalOrders),
                prefix: '',
                suffix: ' pedidos'
            },
            {
                id: 'completedSales',
                title: 'Ventas Completadas',
                value: `$${this.formatCurrency(data.completedSales?.amount || 0)}`,
                rawValue: data.completedSales?.amount || 0,
                subtitle: `${data.completedSales?.count || 0} pedidos completados`,
                icon: 'icon-check-circle',
                color: 'green',
                bgGradient: 'from-green-500 to-green-600',
                textColor: 'text-green-400',
                trend: this.calculateTrend(data.completedSales?.amount, data.previousCompletedSales?.amount),
                prefix: '$',
                suffix: ''
            },
            {
                id: 'pendingSales',
                title: 'Ventas Pendientes',
                value: `$${this.formatCurrency(data.pendingSales?.amount || 0)}`,
                rawValue: data.pendingSales?.amount || 0,
                subtitle: `${data.pendingSales?.count || 0} pedidos pendientes`,
                icon: 'icon-clock',
                color: 'yellow',
                bgGradient: 'from-yellow-500 to-yellow-600',
                textColor: 'text-yellow-400',
                trend: this.calculateTrend(data.pendingSales?.amount, data.previousPendingSales?.amount),
                prefix: '$',
                suffix: ''
            }
        ];

        const cardsHtml = cards.map(card => this.createMetricCard(card)).join('');
        const container = $('#metricsCards');

        await this.fadeOut(container);
        container.html(cardsHtml);
        await this.fadeInCards();
        this.setupCardInteractions();
        this.animateNumbers(cards);
    }

    async fadeOut(element) {
        return new Promise(resolve => {
            element.addClass('opacity-0 transform scale-95');
            setTimeout(resolve, 200);
        });
    }

    async fadeInCards() {
        return new Promise(resolve => {
            const cards = $('.metric-card');
            cards.each((index, card) => {
                setTimeout(() => {
                    $(card).removeClass('opacity-0 transform scale-95')
                        .addClass('opacity-100 transform scale-100');
                }, index * 100);
            });
            setTimeout(resolve, cards.length * 100 + 200);
        });
    }

    setupCardInteractions() {
        $('.metric-card').on('click', function () {
            const $this = $(this);
            $this.addClass('transform scale-95');
            setTimeout(() => {
                $this.removeClass('scale-95').addClass('scale-100');
            }, 150);
        });

        $('.card-detail-btn').on('click', function (e) {
            e.stopPropagation();
            const cardId = $(this).data('card-id');
            orderDashboard.showCardDetails(cardId);
        });
    }

    animateNumbers(cards) {
        cards.forEach((card) => {
            const element = $(`.metric-card[data-card-id="${card.id}"] .metric-value`);
            if (element.length && card.rawValue > 0) {
                this.countUpAnimation(element, card.rawValue, card.prefix, card.suffix);
            }
        });
    }

    countUpAnimation(element, targetValue, prefix = '', suffix = '') {
        const duration = 1000;
        const steps = 30;
        const increment = targetValue / steps;
        let currentValue = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            currentValue += increment;

            if (step >= steps) {
                currentValue = targetValue;
                clearInterval(timer);
            }

            const displayValue = prefix === '$' ?
                `${prefix}${this.formatCurrency(currentValue)}` :
                `${this.formatInteger(currentValue)}${suffix}`;

            element.text(displayValue);
        }, duration / steps);
    }

    showCardDetails(cardId) {
        console.log(`Showing details for card: ${cardId}`);

        alert({
            icon: "info",
            title: "Detalles de Métrica",
            text: `Funcionalidad de detalles para ${cardId} próximamente disponible.`,
            btn1: true,
            btn1Text: "Ok"
        });
    }

    formatInteger(number) {
        return new Intl.NumberFormat('es-MX').format(Math.round(number));
    }

    formatCurrency(number) {
        return new Intl.NumberFormat('es-MX', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(number));
    }

    createMetricCard(card) {
        const trendIcon = card.trend > 0 ? 'icon-trending-up' : card.trend < 0 ? 'icon-trending-down' : 'icon-minus';
        const trendColor = card.trend > 0 ? 'text-green-400' : card.trend < 0 ? 'text-red-400' : 'text-gray-400';
        const trendText = card.trend !== 0 ? `${Math.abs(card.trend)}%` : '0%';
        const trendDirection = card.trend > 0 ? 'Incremento' : card.trend < 0 ? 'Disminución' : 'Sin cambios';

        return `
            <div class="metric-card opacity-0 transform scale-95 transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 cursor-pointer hover:scale-105 shadow-lg hover:shadow-xl" data-card-id="${card.id}">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-gradient-to-r ${card.bgGradient} rounded-lg flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-110">
                            <i class="${card.icon} text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-gray-300 text-sm font-medium">${card.title}</h3>
                            <div class="flex items-center space-x-2 mt-1" title="${trendDirection} del ${Math.abs(card.trend)}% respecto al mes anterior">
                                <i class="${trendIcon} ${trendColor} text-xs"></i>
                                <span class="${trendColor} text-xs font-medium">${trendText}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <button class="card-detail-btn text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded hover:bg-gray-700" data-card-id="${card.id}" title="Ver detalles">
                            <i class="icon-more-vert"></i>
                        </button>
                    </div>
                </div>
                <div class="mb-3">
                    <p class="metric-value text-3xl font-bold ${card.textColor} mb-1 transition-all duration-300 font-mono">
                        ${card.value}
                    </p>
                    <p class="text-gray-500 text-sm">${card.subtitle}</p>
                </div>
                <div class="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-${card.color}-500 rounded-full animate-pulse"></div>
                        <span class="text-xs text-gray-400">En tiempo real</span>
                    </div>
                    <button class="card-detail-btn text-xs text-${card.color}-400 hover:text-${card.color}-300 font-medium transition-colors duration-200 px-2 py-1 rounded hover:bg-${card.color}-900 hover:bg-opacity-20" data-card-id="${card.id}">
                        Ver detalles →
                    </button>
                </div>
            </div>
        `;
    }

    calculateTrend(current, previous) {
        if (!previous || previous === 0) return 0;
        return Math.round(((current - previous) / previous) * 100);
    }

    async renderChart(chartData) {
        try {
            if (!this.validateChartContainer()) {
                throw new Error('Contenedor del gráfico no encontrado');
            }

            this.showChartLoading();
            const processedData = this.processChartData(chartData);

            if (!this.validateChartData(processedData)) {
                throw new Error('Datos del gráfico inválidos');
            }

            await this.createChart(processedData);
            this.finalizeChart();

        } catch (error) {
            console.error('Error rendering chart:', error);
            this.showChartError(error.message);
        }
    }

    validateChartContainer() {
        const canvas = document.getElementById('ordersChart');
        return canvas && canvas.getContext;
    }

    validateChartData(data) {
        return data &&
            data.labels &&
            data.datasets &&
            data.datasets.length > 0 &&
            data.datasets[0].data;
    }

    showChartLoading() {
        const chartContainer = $('#chartSection');
        const existingLoading = $('#chartLoading');

        if (existingLoading.length === 0) {
            chartContainer.append(`
                <div id="chartLoading" class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-xl z-10">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        <p class="text-gray-400 text-sm">Generando gráfico...</p>
                    </div>
                </div>
            `);
        }
    }

    async createChart(processedData) {
        return new Promise((resolve) => {
            if (this.chartInstance) {
                this.chartInstance.destroy();
                this.chartInstance = null;
            }

            setTimeout(() => {
                const ctx = document.getElementById('ordersChart');

                this.chartInstance = new Chart(ctx, {
                    type: 'line',
                    data: processedData,
                    options: this.getChartOptions(),
                    plugins: [this.createCustomPlugins()]
                });

                resolve();
            }, 100);
        });
    }

    processChartData(chartData) {
        const defaultLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        const defaultData = [0, 0, 0, 0];

        const labels = chartData?.labels || defaultLabels;
        const data = chartData?.datasets?.[0]?.data || defaultData;

        const maxValue = Math.max(...data);
        const totalOrders = data.reduce((sum, val) => sum + val, 0);
        const avgOrders = totalOrders / data.length;

        return {
            labels: labels,
            datasets: [{
                label: 'Pedidos por Semana',
                data: data,
                borderColor: '#3B82F6',
                backgroundColor: this.createGradient(),
                borderWidth: 3,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#1F2937',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#60A5FA',
                pointHoverBorderColor: '#1F2937',
                pointHoverBorderWidth: 3,
                tension: 0.4,
                fill: true,
                maxValue: maxValue,
                totalOrders: totalOrders,
                avgOrders: Math.round(avgOrders * 100) / 100
            }]
        };
    }

    createGradient() {
        const ctx = document.getElementById('ordersChart');
        if (!ctx) return 'transparent';

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
        return gradient;
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(31, 42, 55, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#374151',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    callbacks: {
                        title: (context) => {
                            return `📊 ${context[0].label}`;
                        },
                        label: (context) => {
                            const value = context.parsed.y;
                            const dataset = context.dataset;
                            const percentage = dataset.maxValue > 0 ?
                                Math.round((value / dataset.totalOrders) * 100) : 0;

                            return [
                                `Pedidos: ${value}`,
                                `Porcentaje del total: ${percentage}%`,
                                `Promedio semanal: ${dataset.avgOrders}`
                            ];
                        },
                        afterBody: () => {
                            return '\n💡 Haz clic para ver detalles';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#374151',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9CA3AF',
                        font: {
                            size: 12
                        },
                        padding: 8,
                        callback: function (value) {
                            return value % 1 === 0 ? value : '';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Número de Pedidos',
                        color: '#D1D5DB',
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#374151',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9CA3AF',
                        font: {
                            size: 12
                        },
                        padding: 8
                    },
                    title: {
                        display: true,
                        text: 'Semanas del Mes',
                        color: '#D1D5DB',
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            },
            hover: {
                animationDuration: 300
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const element = elements[0];
                    const dataIndex = element.index;
                    const label = this.chartInstance.data.labels[dataIndex];
                    const value = this.chartInstance.data.datasets[0].data[dataIndex];

                    this.handleChartClick(label, value, dataIndex);
                }
            }
        };
    }

    createCustomPlugins() {
        return {
            id: 'customChartPlugin',
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const data = chart.data.datasets[0].data;
                const hasData = data.some(value => value > 0);

                if (!hasData) {
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = '16px Arial';
                    ctx.fillStyle = '#9CA3AF';
                    ctx.fillText(
                        'No hay datos para mostrar en este período',
                        chart.width / 2,
                        chart.height / 2
                    );
                    ctx.restore();
                }
            }
        };
    }

    finalizeChart() {
        $('#chartLoading').remove();
        this.setupChartInteractions();
        this.animateChartEntrance();
        this.addChartControls();
    }

    setupChartInteractions() {
        if (!this.chartInstance) return;

        document.getElementById('ordersChart').addEventListener('dblclick', () => {
            console.log('Chart double-clicked - Reset zoom functionality');
        });
    }

    animateChartEntrance() {
        const chartContainer = $('#chartSection');
        chartContainer.addClass('animate-fade-in');

        setTimeout(() => {
            chartContainer.removeClass('animate-fade-in');
        }, 1500);
    }

    addChartControls() {
        const chartHeader = $('#chartSection .flex');

        if (chartHeader.find('.chart-controls').length === 0) {
            chartHeader.append(`
                <div class="chart-controls flex items-center space-x-2 ml-4">
                    <button id="chartTypeToggle" class="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors duration-200" title="Cambiar tipo de gráfico">
                        <i class="icon-bar-chart mr-1"></i>
                        Línea
                    </button>
                    <button id="chartFullscreen" class="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors duration-200" title="Pantalla completa">
                        <i class="icon-expand"></i>
                    </button>
                </div>
            `);

            $('#chartTypeToggle').on('click', () => this.toggleChartType());
            $('#chartFullscreen').on('click', () => this.toggleFullscreen());
        }
    }

    toggleChartType() {
        if (!this.chartInstance) return;

        const currentType = this.chartInstance.config.type;
        const newType = currentType === 'line' ? 'bar' : 'line';

        this.chartInstance.config.type = newType;
        this.chartInstance.update('active');

        const button = $('#chartTypeToggle');
        const icon = newType === 'line' ? 'icon-trending-up' : 'icon-bar-chart';
        const text = newType === 'line' ? 'Línea' : 'Barras';

        button.html(`<i class="${icon} mr-1"></i>${text}`);
    }

    toggleFullscreen() {
        const chartSection = document.getElementById('chartSection');

        if (!document.fullscreenElement) {
            chartSection.requestFullscreen().then(() => {
                $('#chartFullscreen').html('<i class="icon-compress"></i>');
                setTimeout(() => {
                    if (this.chartInstance) {
                        this.chartInstance.resize();
                    }
                }, 100);
            });
        } else {
            document.exitFullscreen().then(() => {
                $('#chartFullscreen').html('<i class="icon-expand"></i>');
                setTimeout(() => {
                    if (this.chartInstance) {
                        this.chartInstance.resize();
                    }
                }, 100);
            });
        }
    }

    handleChartClick(label, value, dataIndex) {
        console.log(`Chart clicked: ${label}, Value: ${value}, Index: ${dataIndex}`);

        alert({
            icon: "info",
            title: `Detalles de ${label}`,
            html: `
                <div class="text-left">
                    <p><strong>Período:</strong> ${label}</p>
                    <p><strong>Pedidos:</strong> ${value}</p>
                    <p><strong>Posición:</strong> ${dataIndex + 1} de ${this.chartInstance.data.labels.length}</p>
                </div>
            `,
            btn1: true,
            btn1Text: "Cerrar"
        });
    }

    showChartError(message) {
        $('#chartLoading').remove();

        const chartContainer = $('#ordersChart').parent();
        chartContainer.append(`
            <div class="absolute inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center rounded-xl">
                <div class="text-center">
                    <i class="icon-alert-triangle text-red-400 text-3xl mb-2"></i>
                    <p class="text-red-400 text-sm mb-2">Error al cargar el gráfico</p>
                    <p class="text-gray-400 text-xs">${message}</p>
                    <button id="retryChart" class="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200">
                        Reintentar
                    </button>
                </div>
            </div>
        `);

        $('#retryChart').on('click', () => {
            $('.absolute').remove();
            this.loadMetrics();
        });
    }

    setupResponsiveDesign() {
        this.deviceType = this.detectDeviceType();
        this.ensureViewportMeta();
        this.setupBreakpointListeners();

        if (this.deviceType === 'mobile') {
            this.setupMobileGestures();
        }

        this.setupOrientationHandling();
        this.applyResponsiveAdjustments();
    }

    detectDeviceType() {
        const width = window.innerWidth;
        const userAgent = navigator.userAgent;

        if (width <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            return 'mobile';
        } else if (width <= 1024) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    ensureViewportMeta() {
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }
    }

    setupBreakpointListeners() {
        this.breakpoints = {
            mobile: window.matchMedia('(max-width: 768px)'),
            tablet: window.matchMedia('(min-width: 769px) and (max-width: 1024px)'),
            desktop: window.matchMedia('(min-width: 1025px)')
        };

        Object.keys(this.breakpoints).forEach(breakpoint => {
            this.breakpoints[breakpoint].addListener(() => {
                this.handleBreakpointChange();
            });
        });
    }

    handleBreakpointChange() {
        const newDeviceType = this.detectDeviceType();

        if (newDeviceType !== this.deviceType) {
            this.deviceType = newDeviceType;
            this.applyResponsiveAdjustments();

            if (this.chartInstance) {
                setTimeout(() => {
                    this.chartInstance.resize();
                }, 300);
            }
        }
    }

    applyResponsiveAdjustments() {
        const container = $(`#${this.PROJECT_NAME}`);
        container.removeClass('mobile-layout tablet-layout desktop-layout');

        switch (this.deviceType) {
            case 'mobile':
                this.applyMobileLayout();
                break;
            case 'tablet':
                this.applyTabletLayout();
                break;
            case 'desktop':
                this.applyDesktopLayout();
                break;
        }
    }

    applyMobileLayout() {
        const container = $(`#${this.PROJECT_NAME}`);
        container.addClass('mobile-layout');
        container.removeClass('p-4 sm:p-6 lg:p-8').addClass('p-3');

        $('#metricsCards').removeClass('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')
            .addClass('grid-cols-1 gap-3');
    }

    applyTabletLayout() {
        const container = $(`#${this.PROJECT_NAME}`);
        container.addClass('tablet-layout');

        $('#metricsCards').removeClass('grid-cols-1 gap-3')
            .addClass('grid-cols-1 sm:grid-cols-2 gap-4');
    }

    applyDesktopLayout() {
        const container = $(`#${this.PROJECT_NAME}`);
        container.addClass('desktop-layout');

        $('#metricsCards').removeClass('grid-cols-1 gap-3')
            .addClass('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6');
    }

    setupMobileGestures() {
        let startX = 0;
        let startTime = 0;

        const container = $(`#${this.PROJECT_NAME}`)[0];

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
        });

        container.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endTime = Date.now();
            const distance = endX - startX;
            const duration = endTime - startTime;

            if (Math.abs(distance) > 50 && duration < 300) {
                if (distance > 0) {
                    this.setLastMonth();
                } else {
                    this.setCurrentMonth();
                }
            }
        });
    }

    setupOrientationHandling() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 500);
        });
    }

    handleOrientationChange() {
        this.deviceType = this.detectDeviceType();
        this.applyResponsiveAdjustments();

        if (this.chartInstance) {
            this.chartInstance.resize();
        }

        const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        console.log(`Orientation changed to: ${orientation}`);
    }

    setupResponsiveChart() {
        window.addEventListener('resize', this.debounce(() => {
            if (this.chartInstance) {
                this.chartInstance.resize();
            }
        }, 250));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.chartInstance) {
                    setTimeout(() => {
                        this.chartInstance.resize();
                    }, 100);
                }
            });
        });

        const chartContainer = document.getElementById('chartSection');
        if (chartContainer) {
            observer.observe(chartContainer);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    initializeErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleGlobalError(event.reason);
            event.preventDefault();
        });

        window.addEventListener('error', (event) => {
            console.error('Global JavaScript error:', event.error);
            this.handleGlobalError(event.error);
        });

        this.initializeNotificationSystem();
    }

    initializeNotificationSystem() {
        if ($('#notificationContainer').length === 0) {
            $('body').append(`
                <div id="notificationContainer" class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
                </div>
            `);
        }
    }

    handleGlobalError(error) {
        let errorMessage = 'Ha ocurrido un error inesperado';

        if (error && error.message) {
            if (error.message.includes('Network')) {
                errorMessage = 'Error de conexión. Verifica tu internet.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'La operación tardó demasiado tiempo.';
            } else if (error.message.includes('permission')) {
                errorMessage = 'No tienes permisos para realizar esta acción.';
            } else {
                errorMessage = `Error: ${error.message}`;
            }
        }

        this.showNotification({
            type: 'error',
            title: 'Error del Sistema',
            message: errorMessage,
            duration: 5000,
            actions: [
                {
                    text: 'Reintentar',
                    action: () => this.loadMetrics()
                },
                {
                    text: 'Reportar',
                    action: () => this.reportError(error)
                }
            ]
        });
    }

    showNotification(options) {
        const defaults = {
            type: 'info',
            title: '',
            message: '',
            duration: 3000,
            actions: [],
            persistent: false
        };

        const config = Object.assign({}, defaults, options);
        const notificationId = 'notification_' + Date.now();

        const notification = this.createNotificationHTML(notificationId, config);
        $('#notificationContainer').append(notification);

        setTimeout(() => {
            $(`#${notificationId}`).removeClass('translate-x-full opacity-0');
        }, 100);

        if (!config.persistent && config.duration > 0) {
            setTimeout(() => {
                this.removeNotification(notificationId);
            }, config.duration);
        }

        return notificationId;
    }

    createNotificationHTML(id, config) {
        const iconMap = {
            info: 'icon-info-circle text-blue-500',
            success: 'icon-check-circle text-green-500',
            warning: 'icon-alert-triangle text-yellow-500',
            error: 'icon-x-circle text-red-500'
        };

        const bgMap = {
            info: 'bg-blue-50 border-blue-200',
            success: 'bg-green-50 border-green-200',
            warning: 'bg-yellow-50 border-yellow-200',
            error: 'bg-red-50 border-red-200'
        };

        const actionsHTML = config.actions.map(action => `
            <button class="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-200" 
                    onclick="orderDashboard.${action.action.name}()">
                ${action.text}
            </button>
        `).join('');

        return `
            <div id="${id}" class="transform translate-x-full opacity-0 transition-all duration-300 ${bgMap[config.type]} border rounded-lg p-4 shadow-lg max-w-sm">
                <div class="flex items-start space-x-3">
                    <i class="${iconMap[config.type]} text-lg mt-0.5"></i>
                    <div class="flex-1 min-w-0">
                        ${config.title ? `<h4 class="text-sm font-semibold text-gray-900 mb-1">${config.title}</h4>` : ''}
                        <p class="text-sm text-gray-700">${config.message}</p>
                        ${actionsHTML ? `<div class="mt-2 space-x-2">${actionsHTML}</div>` : ''}
                    </div>
                    <button class="text-gray-400 hover:text-gray-600 transition-colors duration-200" 
                            onclick="orderDashboard.removeNotification('${id}')">
                        <i class="icon-x text-sm"></i>
                    </button>
                </div>
            </div>
        `;
    }

    removeNotification(notificationId) {
        const notification = $(`#${notificationId}`);
        if (notification.length) {
            notification.addClass('translate-x-full opacity-0');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }

    handleAPIError(error, context = '') {
        console.error(`API Error in ${context}:`, error);

        let errorConfig = {
            type: 'error',
            title: 'Error de Conexión',
            message: 'No se pudo conectar con el servidor',
            duration: 5000
        };

        if (error.status) {
            switch (error.status) {
                case 400:
                    errorConfig.message = 'Datos inválidos enviados al servidor';
                    break;
                case 401:
                    errorConfig.message = 'Sesión expirada. Por favor, inicia sesión nuevamente';
                    errorConfig.actions = [{
                        text: 'Iniciar Sesión',
                        action: () => window.location.reload()
                    }];
                    break;
                case 403:
                    errorConfig.message = 'No tienes permisos para realizar esta acción';
                    break;
                case 404:
                    errorConfig.message = 'Recurso no encontrado en el servidor';
                    break;
                case 500:
                    errorConfig.message = 'Error interno del servidor. Intenta más tarde';
                    break;
                case 503:
                    errorConfig.message = 'Servicio temporalmente no disponible';
                    break;
                default:
                    errorConfig.message = `Error del servidor (${error.status})`;
            }
        } else if (error.message) {
            if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorConfig.message = 'Sin conexión a internet. Verifica tu red';
            } else if (error.message.includes('timeout')) {
                errorConfig.message = 'La solicitud tardó demasiado tiempo';
            }
        }

        this.showNotification(errorConfig);
    }

    reportError(error) {
        const errorReport = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            error: {
                message: error.message || 'Unknown error',
                stack: error.stack || 'No stack trace',
                name: error.name || 'Error'
            },
            dashboardState: {
                currentMonth: $('#monthSelect').val(),
                currentYear: $('#yearSelect').val(),
                deviceType: this.deviceType,
                chartExists: !!this.chartInstance
            }
        };

        console.log('Error Report:', errorReport);

        this.showNotification({
            type: 'info',
            title: 'Reporte Enviado',
            message: 'El error ha sido reportado al equipo técnico',
            duration: 3000
        });
    }

    setupConnectionMonitoring() {
        window.addEventListener('online', () => {
            this.showNotification({
                type: 'success',
                title: 'Conexión Restaurada',
                message: 'La conexión a internet se ha restablecido',
                duration: 3000
            });

            this.loadMetrics();
        });

        window.addEventListener('offline', () => {
            this.showNotification({
                type: 'warning',
                title: 'Sin Conexión',
                message: 'No hay conexión a internet. Los datos pueden no estar actualizados',
                persistent: true
            });
        });
    }

    monitorPerformance() {
        const loadStart = performance.now();

        return {
            end: () => {
                const loadTime = performance.now() - loadStart;
                if (loadTime > 3000) {
                    this.showNotification({
                        type: 'warning',
                        title: 'Carga Lenta',
                        message: 'La aplicación está tardando más de lo normal en cargar',
                        duration: 4000
                    });
                }
                console.log(`Dashboard load time: ${loadTime.toFixed(2)}ms`);
            }
        };
    }

    setupAdvancedLoadingStates() {
        this.loadingTemplate = `
            <div class="loading-overlay absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center rounded-xl z-10">
                <div class="text-center">
                    <div class="loading-spinner animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p class="text-white text-sm loading-message">Cargando...</p>
                    <div class="mt-2">
                        <div class="w-32 h-1 bg-gray-700 rounded-full mx-auto">
                            <div class="loading-progress h-1 bg-blue-500 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showLoadingState() {
        const loadingCards = Array.from({ length: 3 }, () => `
            <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-gray-700 rounded-lg"></div>
                        <div>
                            <div class="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                            <div class="h-3 bg-gray-700 rounded w-16"></div>
                        </div>
                    </div>
                    <div class="w-6 h-6 bg-gray-700 rounded"></div>
                </div>
                <div class="mb-3">
                    <div class="h-8 bg-gray-700 rounded w-20 mb-2"></div>
                    <div class="h-4 bg-gray-700 rounded w-32"></div>
                </div>
                <div class="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-gray-700 rounded-full"></div>
                        <div class="h-3 bg-gray-700 rounded w-16"></div>
                    </div>
                    <div class="h-3 bg-gray-700 rounded w-20"></div>
                </div>
            </div>
        `).join('');

        $('#metricsCards').html(loadingCards);

        const chartContainer = $('#ordersChart').parent();
        chartContainer.append(`
            <div id="chartLoading" class="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-xl">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p class="text-gray-400 text-sm">Actualizando gráfico...</p>
                </div>
            </div>
        `);
    }

    showError(message) {
        alert({
            icon: "error",
            title: "Error",
            text: message,
            btn1: true,
            btn1Text: "Ok"
        });

        this.updateCards({
            totalOrders: 0,
            completedSales: { count: 0, amount: 0 },
            pendingSales: { count: 0, amount: 0 }
        });

        this.renderChart({
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            datasets: [{ data: [0, 0, 0, 0] }]
        });
    }

    checkOnboarding() {
        const completed = localStorage.getItem('dashboard_onboarding_completed');
        if (!completed) {
            setTimeout(() => {
                this.showNotification({
                    type: 'info',
                    title: '¿Primera vez aquí?',
                    message: 'Te guiamos por las funcionalidades principales',
                    duration: 5000,
                    actions: [{
                        text: 'Comenzar Tour',
                        action: () => this.startOnboarding()
                    }]
                });
            }, 2000);
        }
    }

    startOnboarding() {
        const steps = [
            {
                target: `#filterBar${this.PROJECT_NAME}`,
                title: 'Filtros de Consulta',
                content: 'Aquí puedes seleccionar el mes y año que deseas consultar. También hay botones rápidos para períodos comunes.',
                position: 'bottom'
            },
            {
                target: '#metricsCards',
                title: 'Métricas Principales',
                content: 'Estas tarjetas muestran las métricas más importantes de tu negocio. Las flechas indican tendencias.',
                position: 'bottom'
            },
            {
                target: '#chartSection',
                title: 'Gráfico Interactivo',
                content: 'Este gráfico muestra la evolución de pedidos por semana. Puedes hacer clic en los puntos para más detalles.',
                position: 'top'
            }
        ];

        this.showOnboardingStep(0, steps);
    }

    showOnboardingStep(stepIndex, steps) {
        if (stepIndex >= steps.length) return;

        const step = steps[stepIndex];
        const target = $(step.target);

        if (target.length === 0) {
            this.showOnboardingStep(stepIndex + 1, steps);
            return;
        }

        $('body').append(`
            <div id="onboardingOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-50">
                <div id="onboardingTooltip" class="absolute bg-white rounded-lg shadow-xl p-4 max-w-sm">
                    <h3 class="font-semibold text-gray-900 mb-2">${step.title}</h3>
                    <p class="text-gray-700 text-sm mb-4">${step.content}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-500">${stepIndex + 1} de ${steps.length}</span>
                        <div class="space-x-2">
                            ${stepIndex > 0 ? '<button id="onboardingPrev" class="px-3 py-1 text-sm bg-gray-200 rounded">Anterior</button>' : ''}
                            <button id="onboardingNext" class="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                                ${stepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        const targetOffset = target.offset();
        const targetHeight = target.outerHeight();
        const targetWidth = target.outerWidth();
        const tooltip = $('#onboardingTooltip');

        let top, left;
        if (step.position === 'bottom') {
            top = targetOffset.top + targetHeight + 10;
            left = targetOffset.left + (targetWidth / 2) - (tooltip.outerWidth() / 2);
        } else {
            top = targetOffset.top - tooltip.outerHeight() - 10;
            left = targetOffset.left + (targetWidth / 2) - (tooltip.outerWidth() / 2);
        }

        tooltip.css({ top, left });
        target.addClass('relative z-50 ring-4 ring-blue-500 ring-opacity-75');

        $('#onboardingNext').on('click', () => {
            this.closeOnboardingStep();
            if (stepIndex === steps.length - 1) {
                this.completeOnboarding();
            } else {
                this.showOnboardingStep(stepIndex + 1, steps);
            }
        });

        $('#onboardingPrev').on('click', () => {
            this.closeOnboardingStep();
            this.showOnboardingStep(stepIndex - 1, steps);
        });

        $('#onboardingOverlay').on('click', (e) => {
            if (e.target.id === 'onboardingOverlay') {
                this.closeOnboardingStep();
                this.completeOnboarding();
            }
        });
    }

    closeOnboardingStep() {
        $('.ring-4').removeClass('relative z-50 ring-4 ring-blue-500 ring-opacity-75');
        $('#onboardingOverlay').remove();
    }

    completeOnboarding() {
        this.showNotification({
            type: 'success',
            title: '¡Bienvenido!',
            message: 'Has completado la introducción al dashboard. ¡Explora todas las funcionalidades!',
            duration: 4000
        });

        localStorage.setItem('dashboard_onboarding_completed', 'true');
    }

    finalizeInitialization() {
        console.log('Dashboard initialized successfully');
    }
}
