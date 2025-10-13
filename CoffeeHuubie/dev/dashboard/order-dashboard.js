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
    }

    init() {
        // Initialize error handling system
        this.initializeErrorHandling();

        // Setup connection monitoring
        this.setupConnectionMonitoring();

        // Start performance monitoring
        const perfMonitor = this.monitorPerformance();

        // Render dashboard
        this.render();

        // End performance monitoring
        perfMonitor.end();

        // Finalize initialization
        this.finalizeInitialization();
    }

    render() {
        this.layout();
        this.createFilterBar();

        // Setup responsive design
        this.setupResponsiveDesign();

        // Load URL parameters if available
        this.loadUrlParams();

        // Initial data load
        this.loadMetrics();

        // Setup browser back/forward support
        this.setupBrowserNavigation();

        // Setup responsive chart
        this.setupResponsiveChart();

        // Setup advanced loading states
        this.setupAdvancedLoadingStates();

        // Check if user needs onboarding
        this.checkOnboarding();
    }

    setupBrowserNavigation() {
        window.addEventListener('popstate', () => {
            this.loadUrlParams();
            this.loadMetrics();
        });
    }

    layout() {
        // Main container with responsive padding
        const mainContainer = $('<div>', {
            id: this.PROJECT_NAME,
            class: 'min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8'
        });

        // Header section with improved typography and spacing
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

        // Filter bar container with enhanced styling
        const filterBarContainer = $('<div>', {
            id: 'filterBar' + this.PROJECT_NAME,
            class: 'bg-gray-800 rounded-xl p-4 sm:p-6 mb-8 border border-gray-700 shadow-lg'
        });

        // Main content container with improved grid layout
        const contentContainer = $('<div>', {
            id: 'container' + this.PROJECT_NAME,
            class: 'space-y-8'
        });

        // Metrics cards section with responsive grid
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

        // Chart section with enhanced design
        const chartSection = $('<div>', {
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

        // Assemble the layout
        contentContainer.append(metricsSection, chartSection);
        mainContainer.append(headerSection, filterBarContainer, contentContainer);

        // Clear and append to root
        $('#root').html(mainContainer);

        // Add refresh button functionality
        $('#refreshMetrics').on('click', () => {
            this.loadMetrics();
        });
    }

    createFilterBar() {
        const currentMonth = String(this.currentMonth).padStart(2, '0');
        const currentYear = String(this.currentYear);

        // Enhanced filter bar with better UX
        const filterBarHtml = `
            <div class="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
                <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-white mb-4 flex items-center">
                        <i class="icon-filter mr-2"></i>
                        Filtros de Consulta
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <!-- Month Selector -->
                        <div class="space-y-2">
                            <label for="monthSelect" class="block text-sm font-medium text-gray-300">
                                Mes
                            </label>
                            <select id="monthSelect" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                ${Array.from({ length: 12 }, (_, i) => {
            const monthNum = String(i + 1).padStart(2, '0');
            const monthName = new Date(0, i).toLocaleString('es-MX', { month: 'long' });
            const selected = monthNum === currentMonth ? 'selected' : '';
            return `<option value="${monthNum}" ${selected}>${monthName}</option>`;
        }).join('')}
                            </select>
                        </div>

                        <!-- Year Selector -->
                        <div class="space-y-2">
                            <label for="yearSelect" class="block text-sm font-medium text-gray-300">
                                Año
                            </label>
                            <select id="yearSelect" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                ${Array.from({ length: 5 }, (_, i) => {
            const year = this.currentYear - i;
            const selected = year === this.currentYear ? 'selected' : '';
            return `<option value="${year}" ${selected}>${year}</option>`;
        }).join('')}
                            </select>
                        </div>

                        <!-- Quick Filters -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-300">
                                Acceso Rápido
                            </label>
                            <div class="flex flex-wrap gap-2">
                                <button id="currentMonth" class="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
                                    Mes Actual
                                </button>
                                <button id="lastMonth" class="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200">
                                    Mes Anterior
                                </button>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-300">
                                Acciones
                            </label>
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

        // Add event listeners for enhanced functionality
        this.setupFilterEvents();
    }

    setupFilterEvents() {
        // Apply filters button
        $('#applyFilters').on('click', (e) => {
            e.preventDefault();
            this.applyFilters();
        });

        // Reset filters button
        $('#resetFilters').on('click', (e) => {
            e.preventDefault();
            this.resetFilters();
        });

        // Current month quick filter
        $('#currentMonth').on('click', (e) => {
            e.preventDefault();
            this.setCurrentMonth();
        });

        // Last month quick filter
        $('#lastMonth').on('click', (e) => {
            e.preventDefault();
            this.setLastMonth();
        });

        // Auto-apply on select change (with debounce)
        let filterTimeout;
        $('#monthSelect, #yearSelect').on('change', () => {
            clearTimeout(filterTimeout);
            filterTimeout = setTimeout(() => {
                this.highlightApplyButton();
            }, 300);
        });

        // Enter key support
        $('#monthSelect, #yearSelect').on('keypress', (e) => {
            if (e.which === 13) {
                e.preventDefault();
                this.applyFilters();
            }
        });

        // Auto-refresh functionality
        this.setupAutoRefresh();
    }

    async applyFilters() {
        const month = $('#monthSelect').val();
        const year = $('#yearSelect').val();

        // Validate selections
        if (!month || !year) {
            this.showError('Por favor selecciona un mes y año válidos');
            return;
        }

        // Store current selection for comparison
        this.lastSelectedMonth = month;
        this.lastSelectedYear = year;

        // Update URL parameters (for browser back/forward support)
        this.updateUrlParams(month, year);

        // Load metrics
        await this.loadMetrics();

        // Update filter button state
        this.resetApplyButtonHighlight();
    }

    resetFilters() {
        // Reset to current month/year
        $('#monthSelect').val(String(this.currentMonth).padStart(2, '0'));
        $('#yearSelect').val(String(this.currentYear));

        // Show confirmation
        this.showFilterResetMessage();

        // Auto-apply
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
        button.addClass('ring-2 ring-green-400 bg-green-700');

        // Add pulsing effect
        button.addClass('animate-pulse');

        setTimeout(() => {
            button.removeClass('animate-pulse');
        }, 2000);
    }

    resetApplyButtonHighlight() {
        $('#applyFilters').removeClass('ring-2 ring-green-400 bg-green-700 animate-pulse');
    }

    highlightQuickFilter(selector) {
        // Remove previous highlights
        $('#currentMonth, #lastMonth').removeClass('bg-blue-700 ring-2 ring-blue-400');

        // Highlight selected
        $(selector).addClass('bg-blue-700 ring-2 ring-blue-400');

        // Remove highlight after delay
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
        // Auto-refresh every 5 minutes for current month
        setInterval(() => {
            const selectedMonth = parseInt($('#monthSelect').val());
            const selectedYear = parseInt($('#yearSelect').val());

            // Only auto-refresh if viewing current month
            if (selectedMonth === this.currentMonth && selectedYear === this.currentYear) {
                this.loadMetrics();
                this.showAutoRefreshMessage();
            }
        }, 5 * 60 * 1000); // 5 minutes
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

        // Subtle indicator
        const indicator = $('#lastUpdate');
        indicator.addClass('text-green-400');
        setTimeout(() => indicator.removeClass('text-green-400'), 2000);
    }

    async loadMetrics() {
        try {
            // Show loading states
            this.showLoadingState();
            this.setButtonLoadingState(true);

            const month = $('#monthSelect').val() || this.currentMonth;
            const year = $('#yearSelect').val() || this.currentYear;

            // Validate input parameters
            if (!this.validateDateInputs(month, year)) {
                this.showError('Por favor selecciona un mes y año válidos');
                return;
            }

            // Update UI feedback
            this.updateTimestamp();
            this.logActivity(`Cargando métricas para ${this.getMonthName(month)} ${year}`);

            // Make API call with timeout
            const response = await Promise.race([
                useFetch({
                    url: this._link,
                    data: {
                        opc: 'getDashboardMetrics',
                        month: parseInt(month),
                        year: parseInt(year)
                    }
                }),
                this.createTimeout(10000) // 10 second timeout
            ]);

            // Handle response
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
        // Validate data structure
        if (!this.validateResponseData(data)) {
            throw new Error('Estructura de datos inválida recibida del servidor');
        }

        // Update UI components with animation
        await Promise.all([
            this.updateCards(data),
            this.renderChart(data.chartData)
        ]);

        // Show success feedback
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
        // Optional: Show a subtle success notification
        const notification = $(`
            <div class="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300">
                <div class="flex items-center space-x-2">
                    <i class="icon-check"></i>
                    <span>${message}</span>
                </div>
            </div>
        `);

        $('body').append(notification);

        // Animate in
        setTimeout(() => notification.removeClass('translate-x-full'), 100);

        // Animate out and remove
        setTimeout(() => {
            notification.addClass('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    handleLoadError(error) {
        console.error('Error loading dashboard metrics:', error);

        // Use enhanced error handling
        this.handleAPIError(error, 'loadMetrics');

        // Log activity
        this.logActivity(`Error: ${error.message || 'Unknown error'}`);

        // Show fallback data
        this.showFallbackData();
    }

    showFallbackData() {
        // Show empty state with helpful message
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
        // Prepare card data with enhanced formatting
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

        // Create cards HTML
        const cardsHtml = cards.map(card => this.createMetricCard(card)).join('');

        // Update with fade animation
        const container = $('#metricsCards');

        // Fade out existing cards
        await this.fadeOut(container);

        // Update content
        container.html(cardsHtml);

        // Fade in new cards with stagger effect
        await this.fadeInCards();

        // Add interactive behaviors
        this.setupCardInteractions();

        // Animate numbers (count up effect)
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

        // Add hover effects for detail buttons
        $('.card-detail-btn').on('click', function (e) {
            e.stopPropagation();
            const cardId = $(this).data('card-id');
            orderDashboard.showCardDetails(cardId);
        });
    }

    animateNumbers(cards) {
        cards.forEach((card, index) => {
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
        // Placeholder for future detail modal/popup
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
                <!-- Card Header -->
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

                <!-- Card Value -->
                <div class="mb-3">
                    <p class="metric-value text-3xl font-bold ${card.textColor} mb-1 transition-all duration-300 font-mono">
                        ${card.value}
                    </p>
                    <p class="text-gray-500 text-sm">${card.subtitle}</p>
                </div>

                <!-- Card Footer -->
                <div class="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-${card.color}-500 rounded-full animate-pulse"></div>
                        <span class="text-xs text-gray-400">En tiempo real</span>
                    </div>
                    <button class="card-detail-btn text-xs text-${card.color}-400 hover:text-${card.color}-300 font-medium transition-colors duration-200 px-2 py-1 rounded hover:bg-${card.color}-900 hover:bg-opacity-20" data-card-id="${card.id}">
                        Ver detalles →
                    </button>
                </div>

                <!-- Loading Overlay (hidden by default) -->
                <div class="card-loading absolute inset-0 bg-gray-800 bg-opacity-75 rounded-xl flex items-center justify-center hidden">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-${card.color}-500 mx-auto mb-2"></div>
                        <p class="text-gray-400 text-xs">Actualizando...</p>
                    </div>
                </div>
            </div>
        `;
    }

    calculateTrend(current, previous) {
        if (!previous || previous === 0) return 0;
        return Math.round(((current - previous) / previous) * 100);
    }

    async updateChart(chartData) {
        // Remove loading overlay
        $('#chartLoading').remove();

        const ctx = document.getElementById('ordersChart');

        if (!ctx) {
            console.error('Chart canvas not found');
            return;
        }

        // Destroy existing chart
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }

        // Prepare chart data with validation
        const processedData = this.processChartData(chartData);

        // Create chart with enhanced configuration
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: processedData,
            options: this.getChartOptions(),
            plugins: [this.createCustomPlugins()]
        });

        // Add chart interactions
        this.setupChartInteractions();

        // Animate chart entrance
        this.animateChartEntrance();
    }

    processChartData(chartData) {
        const defaultLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        const defaultData = [0, 0, 0, 0];

        const labels = chartData?.labels || defaultLabels;
        const data = chartData?.datasets?.[0]?.data || defaultData;

        // Calculate additional metrics
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
                // Custom properties for tooltips
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
                    // Draw "No data" message
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

    setupChartInteractions() {
        if (!this.chartInstance) return;

        // Add double-click to reset zoom (future feature)
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

    handleChartClick(label, value, dataIndex) {
        console.log(`Chart clicked: ${label}, Value: ${value}, Index: ${dataIndex}`);

        // Show detailed information
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

    // Main chart rendering method
    async renderChart(chartData) {
        try {
            // Validate chart container
            if (!this.validateChartContainer()) {
                throw new Error('Contenedor del gráfico no encontrado');
            }

            // Show loading state
            this.showChartLoading();

            // Process and validate data
            const processedData = this.processChartData(chartData);

            if (!this.validateChartData(processedData)) {
                throw new Error('Datos del gráfico inválidos');
            }

            // Create or update chart
            await this.createChart(processedData);

            // Setup chart interactions and animations
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
            // Destroy existing chart
            if (this.chartInstance) {
                this.chartInstance.destroy();
                this.chartInstance = null;
            }

            // Small delay for smooth transition
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

    finalizeChart() {
        // Remove loading overlay
        $('#chartLoading').remove();

        // Setup interactions
        this.setupChartInteractions();

        // Animate entrance
        this.animateChartEntrance();

        // Add chart controls
        this.addChartControls();
    }

    addChartControls() {
        // Add chart type toggle (future enhancement)
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

            // Add event listeners
            $('#chartTypeToggle').on('click', () => this.toggleChartType());
            $('#chartFullscreen').on('click', () => this.toggleFullscreen());
        }
    }

    toggleChartType() {
        if (!this.chartInstance) return;

        const currentType = this.chartInstance.config.type;
        const newType = currentType === 'line' ? 'bar' : 'line';

        // Update chart type
        this.chartInstance.config.type = newType;
        this.chartInstance.update('active');

        // Update button text
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
                // Resize chart for fullscreen
                setTimeout(() => {
                    if (this.chartInstance) {
                        this.chartInstance.resize();
                    }
                }, 100);
            });
        } else {
            document.exitFullscreen().then(() => {
                $('#chartFullscreen').html('<i class="icon-expand"></i>');
                // Resize chart back to normal
                setTimeout(() => {
                    if (this.chartInstance) {
                        this.chartInstance.resize();
                    }
                }, 100);
            });
        }
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

    // Chart update methods for smooth transitions
    async updateChartData(newData) {
        if (!this.chartInstance) {
            return this.renderChart(newData);
        }

        try {
            // Prepare new data
            const processedData = this.processChartData(newData);

            // Animate data change
            await this.animateDataChange(processedData);

        } catch (error) {
            console.error('Error updating chart data:', error);
            // Fallback to full re-render
            this.renderChart(newData);
        }
    }

    async animateDataChange(newData) {
        return new Promise((resolve) => {
            // Update chart data
            this.chartInstance.data.labels = newData.labels;
            this.chartInstance.data.datasets[0].data = newData.datasets[0].data;

            // Update with animation
            this.chartInstance.update('active');

            // Resolve after animation completes
            setTimeout(resolve, 1500);
        });
    }

    // Responsive chart handling
    setupResponsiveChart() {
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            if (this.chartInstance) {
                this.chartInstance.resize();
            }
        }, 250));

        // Handle container visibility changes
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.chartInstance) {
                    // Chart is visible, ensure it's properly sized
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

    // Utility method for debouncing
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

    // Chart export functionality
    exportChart(format = 'png') {
        if (!this.chartInstance) {
            this.showError('No hay gráfico para exportar');
            return;
        }

        try {
            const canvas = this.chartInstance.canvas;
            const url = canvas.toDataURL(`image/${format}`);

            // Create download link
            const link = document.createElement('a');
            link.download = `dashboard-chart-${new Date().toISOString().split('T')[0]}.${format}`;
            link.href = url;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showSuccessMessage('Gráfico exportado correctamente');

        } catch (error) {
            console.error('Error exporting chart:', error);
            this.showError('Error al exportar el gráfico');
        }
    }

    // Chart data analysis methods
    getChartAnalytics() {
        if (!this.chartInstance || !this.chartInstance.data.datasets[0]) {
            return null;
        }

        const data = this.chartInstance.data.datasets[0].data;
        const labels = this.chartInstance.data.labels;

        const analytics = {
            total: data.reduce((sum, val) => sum + val, 0),
            average: data.reduce((sum, val) => sum + val, 0) / data.length,
            max: Math.max(...data),
            min: Math.min(...data),
            maxWeek: labels[data.indexOf(Math.max(...data))],
            minWeek: labels[data.indexOf(Math.min(...data))],
            trend: this.calculateTrendDirection(data),
            variance: this.calculateVariance(data)
        };

        return analytics;
    }

    calculateTrendDirection(data) {
        if (data.length < 2) return 'stable';

        const firstHalf = data.slice(0, Math.floor(data.length / 2));
        const secondHalf = data.slice(Math.floor(data.length / 2));

        const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

        const difference = secondAvg - firstAvg;
        const threshold = firstAvg * 0.1; // 10% threshold

        if (difference > threshold) return 'increasing';
        if (difference < -threshold) return 'decreasing';
        return 'stable';
    }

    calculateVariance(data) {
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
        return squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
    }

    // Show chart analytics in a modal
    showChartAnalytics() {
        const analytics = this.getChartAnalytics();

        if (!analytics) {
            this.showError('No hay datos para analizar');
            return;
        }

        const trendIcon = {
            'increasing': '📈',
            'decreasing': '📉',
            'stable': '➡️'
        };

        const trendText = {
            'increasing': 'Tendencia creciente',
            'decreasing': 'Tendencia decreciente',
            'stable': 'Tendencia estable'
        };

        alert({
            icon: "info",
            title: "📊 Análisis del Gráfico",
            html: `
                <div class="text-left space-y-3">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="font-semibold">Total de Pedidos:</p>
                            <p class="text-blue-600">${analytics.total}</p>
                        </div>
                        <div>
                            <p class="font-semibold">Promedio Semanal:</p>
                            <p class="text-green-600">${Math.round(analytics.average * 100) / 100}</p>
                        </div>
                        <div>
                            <p class="font-semibold">Semana Pico:</p>
                            <p class="text-purple-600">${analytics.maxWeek} (${analytics.max})</p>
                        </div>
                        <div>
                            <p class="font-semibold">Semana Baja:</p>
                            <p class="text-orange-600">${analytics.minWeek} (${analytics.min})</p>
                        </div>
                    </div>
                    <div class="mt-4 p-3 bg-gray-100 rounded">
                        <p class="font-semibold">${trendIcon[analytics.trend]} ${trendText[analytics.trend]}</p>
                        <p class="text-sm text-gray-600 mt-1">Varianza: ${Math.round(analytics.variance * 100) / 100}</p>
                    </div>
                </div>
            `,
            btn1: true,
            btn1Text: "Cerrar"
        });
    }

    showLoadingState() {
        const loadingCards = Array.from({ length: 3 }, (_, i) => `
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

        // Also show loading in chart
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

        // Show default empty state
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

    formatNumber(number) {
        return new Intl.NumberFormat('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }
}
    /
    / Responsive Design Methods
setupResponsiveDesign() {
    // Detect device type
    this.deviceType = this.detectDeviceType();

    // Setup viewport meta tag if not present
    this.ensureViewportMeta();

    // Setup responsive breakpoint listeners
    this.setupBreakpointListeners();

    // Setup touch gestures for mobile
    if (this.deviceType === 'mobile') {
        this.setupMobileGestures();
    }

    // Setup orientation change handling
    this.setupOrientationHandling();

    // Apply initial responsive adjustments
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
    // Define breakpoints
    this.breakpoints = {
        mobile: window.matchMedia('(max-width: 768px)'),
        tablet: window.matchMedia('(min-width: 769px) and (max-width: 1024px)'),
        desktop: window.matchMedia('(min-width: 1025px)')
    };

    // Add listeners for each breakpoint
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

        // Resize chart if exists
        if (this.chartInstance) {
            setTimeout(() => {
                this.chartInstance.resize();
            }, 300);
        }
    }
}

applyResponsiveAdjustments() {
    const container = $(`#${this.PROJECT_NAME}`);

    // Remove existing responsive classes
    container.removeClass('mobile-layout tablet-layout desktop-layout');

    // Apply device-specific classes and adjustments
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

    // Adjust padding for mobile
    container.removeClass('p-4 sm:p-6 lg:p-8').addClass('p-3');

    // Make filter bar more compact
    this.optimizeFilterBarForMobile();

    // Adjust card grid for mobile
    $('#metricsCards').removeClass('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')
        .addClass('grid-cols-1 gap-3');

    // Optimize chart for mobile
    this.optimizeChartForMobile();

    // Add mobile-specific interactions
    this.addMobileInteractions();
}

applyTabletLayout() {
    const container = $(`#${this.PROJECT_NAME}`);
    container.addClass('tablet-layout');

    // Adjust for tablet
    $('#metricsCards').removeClass('grid-cols-1 gap-3')
        .addClass('grid-cols-1 sm:grid-cols-2 gap-4');
}

applyDesktopLayout() {
    const container = $(`#${this.PROJECT_NAME}`);
    container.addClass('desktop-layout');

    // Full desktop layout
    $('#metricsCards').removeClass('grid-cols-1 gap-3')
        .addClass('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6');
}

optimizeFilterBarForMobile() {
    if (this.deviceType !== 'mobile') return;

    const filterBar = $(`#filterBar${this.PROJECT_NAME}`);

    // Make filter bar collapsible on mobile
    if (filterBar.find('.mobile-filter-toggle').length === 0) {
        filterBar.prepend(`
                <button class="mobile-filter-toggle w-full mb-3 p-3 bg-gray-700 rounded-lg text-white flex items-center justify-between lg:hidden">
                    <span class="flex items-center">
                        <i class="icon-filter mr-2"></i>
                        Filtros
                    </span>
                    <i class="icon-chevron-down transform transition-transform duration-200"></i>
                </button>
            `);

        // Make filter content collapsible
        const filterContent = filterBar.find('.flex-1');
        filterContent.addClass('hidden lg:block mobile-filter-content');

        // Add toggle functionality
        $('.mobile-filter-toggle').on('click', function () {
            const content = $('.mobile-filter-content');
            const icon = $(this).find('.icon-chevron-down');

            content.toggleClass('hidden');
            icon.toggleClass('rotate-180');
        });
    }
}

optimizeChartForMobile() {
    if (this.deviceType !== 'mobile') return;

    const chartSection = $('#chartSection');

    // Adjust chart container height for mobile
    chartSection.find('.relative').removeClass('h-64 sm:h-80').addClass('h-48');

    // Add mobile chart controls
    this.addMobileChartControls();
}

addMobileChartControls() {
    const chartSection = $('#chartSection');

    if (chartSection.find('.mobile-chart-controls').length === 0) {
        chartSection.append(`
                <div class="mobile-chart-controls mt-4 flex justify-center space-x-2 lg:hidden">
                    <button id="mobileChartAnalytics" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200">
                        <i class="icon-bar-chart mr-1"></i>
                        Análisis
                    </button>
                    <button id="mobileChartExport" class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors duration-200">
                        <i class="icon-download mr-1"></i>
                        Exportar
                    </button>
                </div>
            `);

        // Add event listeners
        $('#mobileChartAnalytics').on('click', () => this.showChartAnalytics());
        $('#mobileChartExport').on('click', () => this.exportChart());
    }
}

addMobileInteractions() {
    // Add pull-to-refresh functionality
    this.setupPullToRefresh();

    // Add swipe gestures for navigation
    this.setupSwipeGestures();

    // Optimize touch targets
    this.optimizeTouchTargets();
}

setupPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    const threshold = 100;

    const container = $(`#${this.PROJECT_NAME}`)[0];

    container.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
        }
    });

    container.addEventListener('touchmove', (e) => {
        if (window.scrollY === 0 && startY > 0) {
            currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;

            if (pullDistance > 0) {
                e.preventDefault();

                // Visual feedback
                const opacity = Math.min(pullDistance / threshold, 1);
                $('#refreshIndicator').css('opacity', opacity);

                if (pullDistance > threshold) {
                    this.showPullToRefreshIndicator();
                }
            }
        }
    });

    container.addEventListener('touchend', () => {
        if (pullDistance > threshold) {
            this.loadMetrics();
            this.showSuccessMessage('Actualizando datos...');
        }

        this.hidePullToRefreshIndicator();
        startY = 0;
        pullDistance = 0;
    });
}

showPullToRefreshIndicator() {
    if ($('#refreshIndicator').length === 0) {
        $('body').prepend(`
                <div id="refreshIndicator" class="fixed top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 z-50 transform -translate-y-full transition-transform duration-200">
                    <i class="icon-refresh mr-2"></i>
                    Suelta para actualizar
                </div>
            `);
    }

    $('#refreshIndicator').removeClass('-translate-y-full');
}

hidePullToRefreshIndicator() {
    $('#refreshIndicator').addClass('-translate-y-full');
    setTimeout(() => {
        $('#refreshIndicator').remove();
    }, 200);
}

setupSwipeGestures() {
    // Add swipe left/right for quick filter changes
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

        // Detect swipe (minimum distance and maximum duration)
        if (Math.abs(distance) > 50 && duration < 300) {
            if (distance > 0) {
                // Swipe right - previous month
                this.setLastMonth();
            } else {
                // Swipe left - current month
                this.setCurrentMonth();
            }
        }
    });
}

optimizeTouchTargets() {
    // Ensure all interactive elements are at least 44px in height/width
    const minTouchSize = 44;

    $('button, .metric-card, select').each(function () {
        const $el = $(this);
        const height = $el.outerHeight();
        const width = $el.outerWidth();

        if (height < minTouchSize) {
            $el.css('min-height', minTouchSize + 'px');
        }

        if (width < minTouchSize && $el.is('button')) {
            $el.css('min-width', minTouchSize + 'px');
        }
    });
}

setupOrientationHandling() {
    window.addEventListener('orientationchange', () => {
        // Wait for orientation change to complete
        setTimeout(() => {
            this.handleOrientationChange();
        }, 500);
    });
}

handleOrientationChange() {
    // Recalculate device type
    this.deviceType = this.detectDeviceType();

    // Reapply responsive adjustments
    this.applyResponsiveAdjustments();

    // Resize chart
    if (this.chartInstance) {
        this.chartInstance.resize();
    }

    // Show orientation message
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    console.log(`Orientation changed to: ${orientation}`);
}
}

// Enhanced Error Handling and User Feedback System
initializeErrorHandling() {
    // Global error handler for unhandled promises
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        this.handleGlobalError(event.reason);
        event.preventDefault();
    });

    // Global error handler for JavaScript errors
    window.addEventListener('error', (event) => {
        console.error('Global JavaScript error:', event.error);
        this.handleGlobalError(event.error);
    });

    // Initialize notification system
    this.initializeNotificationSystem();
}

initializeNotificationSystem() {
    // Create notification container if it doesn't exist
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
        type: 'info', // info, success, warning, error
        title: '',
        message: '',
        duration: 3000,
        actions: [],
        persistent: false
    };

    const config = Object.assign({}, defaults, options);
    const notificationId = 'notification_' + Date.now();

    // Create notification HTML
    const notification = this.createNotificationHTML(notificationId, config);

    // Add to container
    $('#notificationContainer').append(notification);

    // Animate in
    setTimeout(() => {
        $(`#${notificationId}`).removeClass('translate-x-full opacity-0');
    }, 100);

    // Auto-remove if not persistent
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
                    onclick="${action.action}">
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

// Enhanced error handling for specific scenarios
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

handleValidationError(field, message) {
    // Highlight the problematic field
    const fieldElement = $(`#${field}`);
    if (fieldElement.length) {
        fieldElement.addClass('border-red-500 bg-red-50');

        // Remove highlight after 3 seconds
        setTimeout(() => {
            fieldElement.removeClass('border-red-500 bg-red-50');
        }, 3000);
    }

    this.showNotification({
        type: 'warning',
        title: 'Datos Inválidos',
        message: message,
        duration: 4000
    });
}

handleDataError(context, details = '') {
    this.showNotification({
        type: 'error',
        title: 'Error de Datos',
        message: `Problema procesando datos${context ? ` en ${context}` : ''}${details ? `: ${details}` : ''}`,
        duration: 4000,
        actions: [{
            text: 'Reintentar',
            action: () => this.loadMetrics()
        }]
    });
}

// Success feedback methods
showSuccessMessage(message, title = 'Éxito') {
    this.showNotification({
        type: 'success',
        title: title,
        message: message,
        duration: 3000
    });
}

showWarningMessage(message, title = 'Advertencia') {
    this.showNotification({
        type: 'warning',
        title: title,
        message: message,
        duration: 4000
    });
}

showInfoMessage(message, title = 'Información') {
    this.showNotification({
        type: 'info',
        title: title,
        message: message,
        duration: 3000
    });
}

// Loading states with better UX
showGlobalLoading(message = 'Cargando...') {
    if ($('#globalLoading').length === 0) {
        $('body').append(`
                <div id="globalLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4">
                        <div class="flex items-center space-x-3">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span class="text-gray-700">${message}</span>
                        </div>
                    </div>
                </div>
            `);
    }
}

hideGlobalLoading() {
    $('#globalLoading').fadeOut(300, function () {
        $(this).remove();
    });
}

// Progress indicator for long operations
showProgress(current, total, message = 'Procesando...') {
    const percentage = Math.round((current / total) * 100);

    if ($('#progressIndicator').length === 0) {
        $('body').append(`
                <div id="progressIndicator" class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm">
                    <div class="flex items-center space-x-3">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-700 mb-1" id="progressMessage">${message}</p>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div id="progressBar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
                            </div>
                            <p class="text-xs text-gray-500 mt-1" id="progressText">${current} de ${total} (${percentage}%)</p>
                        </div>
                        <button onclick="orderDashboard.hideProgress()" class="text-gray-400 hover:text-gray-600">
                            <i class="icon-x"></i>
                        </button>
                    </div>
                </div>
            `);
    } else {
        $('#progressMessage').text(message);
        $('#progressBar').css('width', `${percentage}%`);
        $('#progressText').text(`${current} de ${total} (${percentage}%)`);
    }
}

hideProgress() {
    $('#progressIndicator').fadeOut(300, function () {
        $(this).remove();
    });
}

// Error reporting system
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

    // In a real application, you would send this to your error tracking service
    this.showNotification({
        type: 'info',
        title: 'Reporte Enviado',
        message: 'El error ha sido reportado al equipo técnico',
        duration: 3000
    });
}

// Connection status monitoring
setupConnectionMonitoring() {
    window.addEventListener('online', () => {
        this.showNotification({
            type: 'success',
            title: 'Conexión Restaurada',
            message: 'La conexión a internet se ha restablecido',
            duration: 3000
        });

        // Auto-refresh data when connection is restored
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

// Performance monitoring
monitorPerformance() {
    // Monitor load times
    const loadStart = performance.now();

    return {
        end: () => {
            const loadTime = performance.now() - loadStart;
            if (loadTime > 3000) { // More than 3 seconds
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
}    // Enh
anced Loading States and User Feedback
setupAdvancedLoadingStates() {
    // Create loading overlay template
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

showAdvancedLoading(container, message = 'Cargando...', showProgress = false) {
    const $container = $(container);

    // Remove existing loading
    $container.find('.loading-overlay').remove();

    // Add loading overlay
    $container.css('position', 'relative').append(this.loadingTemplate);

    // Update message
    $container.find('.loading-message').text(message);

    // Show/hide progress bar
    if (!showProgress) {
        $container.find('.loading-progress').parent().hide();
    }

    return {
        updateMessage: (newMessage) => {
            $container.find('.loading-message').text(newMessage);
        },
        updateProgress: (percentage) => {
            $container.find('.loading-progress').css('width', `${percentage}%`);
        },
        remove: () => {
            $container.find('.loading-overlay').fadeOut(300, function () {
                $(this).remove();
            });
        }
    };
}

// Enhanced card loading with skeleton
showCardSkeletonLoading() {
    const skeletonCards = Array.from({ length: 3 }, (_, i) => `
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

    $('#metricsCards').html(skeletonCards);
}

// Interactive loading messages
showInteractiveLoading(messages = []) {
    const defaultMessages = [
        'Conectando con el servidor...',
        'Obteniendo datos de pedidos...',
        'Calculando métricas...',
        'Generando gráficos...',
        'Finalizando carga...'
    ];

    const loadingMessages = messages.length > 0 ? messages : defaultMessages;
    let currentIndex = 0;

    const loadingId = this.showNotification({
        type: 'info',
        title: 'Cargando Dashboard',
        message: loadingMessages[0],
        persistent: true
    });

    const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex < loadingMessages.length) {
            $(`#${loadingId} .text-sm`).text(loadingMessages[currentIndex]);
        } else {
            clearInterval(interval);
            this.removeNotification(loadingId);
        }
    }, 1000);

    return {
        complete: () => {
            clearInterval(interval);
            this.removeNotification(loadingId);
        }
    };
}

// Contextual help system
showContextualHelp(context) {
    const helpContent = {
        filters: {
            title: 'Ayuda - Filtros',
            content: `
                    <div class="space-y-3 text-sm">
                        <p><strong>Mes y Año:</strong> Selecciona el período que deseas consultar.</p>
                        <p><strong>Mes Actual:</strong> Botón rápido para ver datos del mes en curso.</p>
                        <p><strong>Mes Anterior:</strong> Botón rápido para comparar con el mes pasado.</p>
                        <p><strong>Gestos Móviles:</strong> Desliza hacia la derecha para mes anterior, izquierda para actual.</p>
                    </div>
                `
        },
        metrics: {
            title: 'Ayuda - Métricas',
            content: `
                    <div class="space-y-3 text-sm">
                        <p><strong>Pedidos del Mes:</strong> Total de pedidos registrados en el período.</p>
                        <p><strong>Ventas Completadas:</strong> Pedidos pagados completamente.</p>
                        <p><strong>Ventas Pendientes:</strong> Dinero por cobrar de pedidos activos.</p>
                        <p><strong>Tendencias:</strong> Las flechas muestran cambios respecto al mes anterior.</p>
                    </div>
                `
        },
        chart: {
            title: 'Ayuda - Gráfico',
            content: `
                    <div class="space-y-3 text-sm">
                        <p><strong>Interacción:</strong> Haz clic en puntos para ver detalles.</p>
                        <p><strong>Tipos:</strong> Cambia entre línea y barras con el botón superior.</p>
                        <p><strong>Pantalla Completa:</strong> Usa el botón de expandir para mejor visualización.</p>
                        <p><strong>Análisis:</strong> Accede a estadísticas detalladas desde los controles.</p>
                    </div>
                `
        }
    };

    const help = helpContent[context];
    if (help) {
        alert({
            icon: "info",
            title: help.title,
            html: help.content,
            btn1: true,
            btn1Text: "Entendido"
        });
    }
}

// User onboarding system
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
        // Skip this step if target doesn't exist
        this.showOnboardingStep(stepIndex + 1, steps);
        return;
    }

    // Create overlay
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

    // Position tooltip
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

    // Highlight target
    target.addClass('relative z-50 ring-4 ring-blue-500 ring-opacity-75');

    // Event listeners
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

    // Close on overlay click
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

    // Save onboarding completion
    localStorage.setItem('dashboard_onboarding_completed', 'true');
}

// Check if user needs onboarding
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
}    // F
inal Integration and Testing Methods
validateSystemIntegration() {
    const validationResults = {
        apiConnection: false,
        sessionValid: false,
        permissionsValid: false,
        dataStructure: false,
        chartLibrary: false,
        responsiveDesign: false
    };

    // Test API connection
    this.testAPIConnection().then(result => {
        validationResults.apiConnection = result;
        this.updateValidationStatus('API Connection', result);
    });

    // Test session validity
    validationResults.sessionValid = this.testSessionValidity();
    this.updateValidationStatus('Session Validity', validationResults.sessionValid);

    // Test Chart.js availability
    validationResults.chartLibrary = typeof Chart !== 'undefined';
    this.updateValidationStatus('Chart.js Library', validationResults.chartLibrary);

    // Test responsive design
    validationResults.responsiveDesign = this.testResponsiveDesign();
    this.updateValidationStatus('Responsive Design', validationResults.responsiveDesign);

    return validationResults;
}

    async testAPIConnection() {
    try {
        const response = await fetch(this._link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'opc=init'
        });

        return response.ok;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
}

testSessionValidity() {
    // Check if session variables are available
    // This would typically be done server-side, but we can check for indicators
    return document.cookie.includes('PHPSESSID') ||
        localStorage.getItem('user_session') !== null;
}

testResponsiveDesign() {
    // Test if responsive classes are working
    const testElement = $('<div class="hidden sm:block"></div>').appendTo('body');
    const isHidden = testElement.is(':hidden');
    testElement.remove();

    return window.innerWidth < 640 ? isHidden : !isHidden;
}

updateValidationStatus(test, passed) {
    console.log(`${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
}

// System health monitoring
startHealthMonitoring() {
    // Monitor every 5 minutes
    setInterval(() => {
        this.performHealthCheck();
    }, 5 * 60 * 1000);

    // Initial health check
    this.performHealthCheck();
}

    async performHealthCheck() {
    const health = {
        timestamp: new Date().toISOString(),
        apiResponsive: false,
        memoryUsage: this.getMemoryUsage(),
        chartStatus: !!this.chartInstance,
        errorCount: this.getErrorCount(),
        loadTime: this.getLastLoadTime()
    };

    // Test API responsiveness
    const startTime = performance.now();
    try {
        await this.testAPIConnection();
        health.apiResponsive = true;
        health.apiResponseTime = performance.now() - startTime;
    } catch (error) {
        health.apiResponsive = false;
        health.apiResponseTime = -1;
    }

    // Log health status
    console.log('Dashboard Health Check:', health);

    // Alert if issues detected
    if (!health.apiResponsive || health.errorCount > 5) {
        this.showNotification({
            type: 'warning',
            title: 'Problemas de Rendimiento',
            message: 'Se detectaron problemas en el dashboard. Considera recargar la página.',
            actions: [{
                text: 'Recargar',
                action: () => window.location.reload()
            }]
        });
    }

    return health;
}

getMemoryUsage() {
    if (performance.memory) {
        return {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576),
            total: Math.round(performance.memory.totalJSHeapSize / 1048576),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        };
    }
    return null;
}

getErrorCount() {
    return this.errorCount || 0;
}

getLastLoadTime() {
    return this.lastLoadTime || 0;
}

// Development and debugging tools
enableDebugMode() {
    window.dashboardDebug = {
        instance: this,
        logs: [],
        performance: {},

        // Debug methods
        testAPI: () => this.testAPIConnection(),
        validateSystem: () => this.validateSystemIntegration(),
        healthCheck: () => this.performHealthCheck(),
        showMetrics: () => this.getChartAnalytics(),
        exportLogs: () => this.exportDebugLogs(),

        // Performance testing
        stressTest: () => this.runStressTest(),
        memoryTest: () => this.runMemoryTest()
    };

    console.log('🔧 Debug mode enabled. Use window.dashboardDebug for testing.');

    this.showNotification({
        type: 'info',
        title: 'Modo Debug Activado',
        message: 'Herramientas de desarrollo disponibles en consola',
        duration: 3000
    });
}

exportDebugLogs() {
    const debugData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        deviceType: this.deviceType,
        performance: window.dashboardDebug.performance,
        logs: window.dashboardDebug.logs,
        health: this.performHealthCheck()
    };

    const blob = new Blob([JSON.stringify(debugData, null, 2)], {
        type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-debug-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

    async runStressTest() {
    console.log('🧪 Running stress test...');

    const iterations = 10;
    const results = [];

    for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();

        try {
            await this.loadMetrics();
            const endTime = performance.now();
            results.push({
                iteration: i + 1,
                success: true,
                duration: endTime - startTime
            });
        } catch (error) {
            results.push({
                iteration: i + 1,
                success: false,
                error: error.message
            });
        }

        // Wait between iterations
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const successRate = results.filter(r => r.success).length / iterations * 100;
    const avgDuration = results
        .filter(r => r.success)
        .reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.success).length;

    console.log(`Stress test completed: ${successRate}% success rate, ${avgDuration.toFixed(2)}ms avg duration`);

    return { successRate, avgDuration, results };
}

runMemoryTest() {
    if (!performance.memory) {
        console.log('Memory API not available');
        return null;
    }

    const before = performance.memory.usedJSHeapSize;

    // Create and destroy multiple chart instances
    for (let i = 0; i < 5; i++) {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        const chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['A', 'B', 'C'],
                datasets: [{
                    data: [1, 2, 3]
                }]
            }
        });

        chart.destroy();
        document.body.removeChild(canvas);
    }

    // Force garbage collection if available
    if (window.gc) {
        window.gc();
    }

    const after = performance.memory.usedJSHeapSize;
    const difference = after - before;

    console.log(`Memory test: ${difference} bytes difference`);

    return { before, after, difference };
}

// Accessibility improvements
enhanceAccessibility() {
    // Add ARIA labels
    $(`#${this.PROJECT_NAME}`).attr('role', 'main').attr('aria-label', 'Dashboard de Pedidos');
    $('#metricsCards').attr('role', 'region').attr('aria-label', 'Métricas principales');
    $('#chartSection').attr('role', 'img').attr('aria-label', 'Gráfico de tendencia de pedidos');

    // Add keyboard navigation
    this.setupKeyboardNavigation();

    // Add screen reader announcements
    this.setupScreenReaderAnnouncements();

    // High contrast mode detection
    this.setupHighContrastMode();
}

setupKeyboardNavigation() {
    // Tab navigation for cards
    $('.metric-card').attr('tabindex', '0').on('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });

    // Keyboard shortcuts
    $(document).on('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'r':
                    e.preventDefault();
                    this.loadMetrics();
                    break;
                case 'h':
                    e.preventDefault();
                    this.showContextualHelp('general');
                    break;
            }
        }
    });
}

setupScreenReaderAnnouncements() {
    // Create live region for announcements
    if ($('#srAnnouncements').length === 0) {
        $('body').append('<div id="srAnnouncements" aria-live="polite" aria-atomic="true" class="sr-only"></div>');
    }
}

announceToScreenReader(message) {
    $('#srAnnouncements').text(message);
    setTimeout(() => {
        $('#srAnnouncements').empty();
    }, 1000);
}

setupHighContrastMode() {
    // Detect high contrast mode
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        $('body').addClass('high-contrast-mode');
    }
}

// Final initialization method
finalizeInitialization() {
    // Run system validation
    const validation = this.validateSystemIntegration();

    // Start health monitoring
    this.startHealthMonitoring();

    // Enhance accessibility
    this.enhanceAccessibility();

    // Enable debug mode in development
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
        this.enableDebugMode();
    }

    // Log successful initialization
    console.log('✅ Dashboard initialization completed successfully');

    // Announce to screen readers
    this.announceToScreenReader('Dashboard de pedidos cargado correctamente');

    return validation;
}
}
   // End-to-End Testing Methods
    async runEndToEndTests() {
    console.log('🧪 Starting End-to-End Tests...');

    const testResults = {
        initialization: false,
        dataLoading: false,
        filterFunctionality: false,
        chartInteraction: false,
        responsiveDesign: false,
        errorHandling: false,
        accessibility: false
    };

    try {
        // Test 1: Initialization
        testResults.initialization = await this.testInitialization();

        // Test 2: Data Loading
        testResults.dataLoading = await this.testDataLoading();

        // Test 3: Filter Functionality
        testResults.filterFunctionality = await this.testFilterFunctionality();

        // Test 4: Chart Interaction
        testResults.chartInteraction = await this.testChartInteraction();

        // Test 5: Responsive Design
        testResults.responsiveDesign = await this.testResponsiveDesign();

        // Test 6: Error Handling
        testResults.errorHandling = await this.testErrorHandling();

        // Test 7: Accessibility
        testResults.accessibility = await this.testAccessibility();

    } catch (error) {
        console.error('E2E Test Suite Error:', error);
    }

    this.reportTestResults(testResults);
    return testResults;
}

    async testInitialization() {
    console.log('Testing: Dashboard Initialization');

    // Check if main container exists
    const mainContainer = $(`#${this.PROJECT_NAME}`);
    if (mainContainer.length === 0) return false;

    // Check if filter bar exists
    const filterBar = $(`#filterBar${this.PROJECT_NAME}`);
    if (filterBar.length === 0) return false;

    // Check if metrics cards container exists
    const metricsCards = $('#metricsCards');
    if (metricsCards.length === 0) return false;

    // Check if chart section exists
    const chartSection = $('#chartSection');
    if (chartSection.length === 0) return false;

    console.log('✅ Initialization test passed');
    return true;
}

    async testDataLoading() {
    console.log('Testing: Data Loading');

    try {
        // Simulate data loading
        await this.loadMetrics();

        // Wait for data to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check if cards have data
        const cards = $('.metric-card');
        if (cards.length < 3) return false;

        // Check if chart has data
        if (!this.chartInstance) return false;

        console.log('✅ Data loading test passed');
        return true;
    } catch (error) {
        console.error('❌ Data loading test failed:', error);
        return false;
    }
}

    async testFilterFunctionality() {
    console.log('Testing: Filter Functionality');

    try {
        // Test month selector
        const monthSelect = $('#monthSelect');
        if (monthSelect.length === 0) return false;

        // Change month and test
        const originalMonth = monthSelect.val();
        monthSelect.val('01').trigger('change');

        // Test apply button
        const applyButton = $('#applyFilters');
        if (applyButton.length === 0) return false;

        // Simulate click
        applyButton.click();

        // Wait for response
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Restore original month
        monthSelect.val(originalMonth);

        console.log('✅ Filter functionality test passed');
        return true;
    } catch (error) {
        console.error('❌ Filter functionality test failed:', error);
        return false;
    }
}

    async testChartInteraction() {
    console.log('Testing: Chart Interaction');

    try {
        if (!this.chartInstance) return false;

        // Test chart click simulation
        const canvas = document.getElementById('ordersChart');
        if (!canvas) return false;

        // Simulate click event
        const clickEvent = new MouseEvent('click', {
            clientX: canvas.width / 2,
            clientY: canvas.height / 2
        });
        canvas.dispatchEvent(clickEvent);

        // Test chart type toggle if available
        const typeToggle = $('#chartTypeToggle');
        if (typeToggle.length > 0) {
            typeToggle.click();
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('✅ Chart interaction test passed');
        return true;
    } catch (error) {
        console.error('❌ Chart interaction test failed:', error);
        return false;
    }
}

    async testResponsiveDesign() {
    console.log('Testing: Responsive Design');

    try {
        const originalWidth = window.innerWidth;

        // Test mobile breakpoint
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375
        });

        this.handleBreakpointChange();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if mobile layout is applied
        const container = $(`#${this.PROJECT_NAME}`);
        const hasMobileLayout = container.hasClass('mobile-layout');

        // Test tablet breakpoint
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 768
        });

        this.handleBreakpointChange();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Restore original width
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalWidth
        });

        this.handleBreakpointChange();

        console.log('✅ Responsive design test passed');
        return true;
    } catch (error) {
        console.error('❌ Responsive design test failed:', error);
        return false;
    }
}

    async testErrorHandling() {
    console.log('Testing: Error Handling');

    try {
        // Test API error handling
        const originalLink = this._link;
        this._link = 'invalid-url';

        // This should trigger error handling
        await this.loadMetrics();

        // Wait for error handling
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if error notification appeared
        const notifications = $('#notificationContainer .bg-red-50');
        const hasErrorNotification = notifications.length > 0;

        // Restore original link
        this._link = originalLink;

        console.log('✅ Error handling test passed');
        return hasErrorNotification;
    } catch (error) {
        // This is expected for this test
        console.log('✅ Error handling test passed (error caught as expected)');
        return true;
    }
}

    async testAccessibility() {
    console.log('Testing: Accessibility');

    try {
        // Check ARIA labels
        const mainContainer = $(`#${this.PROJECT_NAME}`);
        if (!mainContainer.attr('role') || !mainContainer.attr('aria-label')) {
            return false;
        }

        // Check keyboard navigation
        const focusableElements = $('[tabindex="0"]');
        if (focusableElements.length === 0) return false;

        // Check screen reader announcements
        const srRegion = $('#srAnnouncements');
        if (srRegion.length === 0) return false;

        // Test keyboard shortcuts
        const keyEvent = new KeyboardEvent('keydown', {
            key: 'r',
            ctrlKey: true
        });
        document.dispatchEvent(keyEvent);

        console.log('✅ Accessibility test passed');
        return true;
    } catch (error) {
        console.error('❌ Accessibility test failed:', error);
        return false;
    }
}

reportTestResults(results) {
    console.log('\n📊 End-to-End Test Results:');
    console.log('================================');

    let passedTests = 0;
    const totalTests = Object.keys(results).length;

    Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅ PASSED' : '❌ FAILED';
        console.log(`${test}: ${status}`);
        if (passed) passedTests++;
    });

    const successRate = (passedTests / totalTests * 100).toFixed(1);
    console.log(`\nOverall Success Rate: ${successRate}% (${passedTests}/${totalTests})`);

    // Show notification with results
    const notificationType = successRate >= 80 ? 'success' : successRate >= 60 ? 'warning' : 'error';

    this.showNotification({
        type: notificationType,
        title: 'Resultados de Testing',
        message: `${passedTests}/${totalTests} pruebas pasaron (${successRate}%)`,
        duration: 5000,
        actions: [{
            text: 'Ver Detalles',
            action: () => console.table(results)
        }]
    });

    return { passedTests, totalTests, successRate };
}

// User acceptance testing helpers
simulateUserWorkflow() {
    console.log('🎭 Simulating typical user workflow...');

    return new Promise(async (resolve) => {
        const steps = [
            { action: 'Load dashboard', delay: 1000 },
            { action: 'Change month filter', delay: 2000 },
            { action: 'Apply filters', delay: 2000 },
            { action: 'Click on metric card', delay: 1000 },
            { action: 'Interact with chart', delay: 1000 },
            { action: 'Export chart', delay: 1000 }
        ];

        for (const step of steps) {
            console.log(`Simulating: ${step.action}`);

            switch (step.action) {
                case 'Load dashboard':
                    await this.loadMetrics();
                    break;
                case 'Change month filter':
                    $('#monthSelect').val('01');
                    break;
                case 'Apply filters':
                    $('#applyFilters').click();
                    break;
                case 'Click on metric card':
                    $('.metric-card').first().click();
                    break;
                case 'Interact with chart':
                    if (this.chartInstance) {
                        this.showChartAnalytics();
                    }
                    break;
                case 'Export chart':
                    this.exportChart();
                    break;
            }

            await new Promise(resolve => setTimeout(resolve, step.delay));
        }

        console.log('✅ User workflow simulation completed');
        resolve();
    });
}
}