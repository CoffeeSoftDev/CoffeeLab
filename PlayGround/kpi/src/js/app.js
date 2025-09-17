
let api_costsys = 'https://erp-varoch.com/ERP24/costsys/ctrl/ctrl-menu.php';
let app;
let udn;

$(async () => {
    // instancias.
    app = new App(App, 'root');
    app.render();
    idFolio = 24;

    udn = [{ id:4 , valor:'Baos'} ];

});

class App extends Templates {
    constructor(api, root) {
        super();
        this.api = api;
        this.root = root;
        this.PROJECT_NAME = "kpiCampañas";
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        this.filterBar();
    }

    layout() {
        this.primaryLayout({
            parent: 'root',
            class: 'flex p-2',
            id: this.PROJECT_NAME
        });
    }

    filterBar() {
        this.createFilterBar();
    }

    createFilterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-4",
                    id: "calendar" + this.PROJECT_NAME,
                    lbl: "Consultar fecha: "
                },
                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "campaignFilter",
                    lbl: "Campaña: ",
                    data: []
                },
                {
                    opc: "select",
                    class: "col-sm-2",
                    id: "statusFilter",
                    lbl: "Estado: ",
                    data: []
                },
                {
                    opc: "btn",
                    class: "col-sm-2",
                    color_btn: "primary",
                    id: "btnSearch",
                    text: "Buscar",
                    fn: `${this.PROJECT_NAME.toLowerCase()}.ls()`
                },
                {
                    opc: "btn",
                    class: "col-sm-1",
                    color_btn: "success",
                    id: "btnAdd",
                    text: "Nuevo",
                    fn: `${this.PROJECT_NAME.toLowerCase()}.add()`
                }
            ]
        });

        dataPicker({
            parent: "calendar" + this.PROJECT_NAME,
            onSelect: () => this.ls()
        });

        this.loadFilters();
    }

    async loadFilters() {
        try {
            // Cargar datos desde archivo JSON local
            const response = await fetch('./data/sample-data.json');
            const jsonData = await response.json();

            // Cargar opciones de campaña
            const campaignSelect = document.getElementById('campaignFilter');
            if (campaignSelect && jsonData.campaigns) {
                campaignSelect.innerHTML = '<option value="">Todas las campañas</option>';
                jsonData.campaigns.forEach(campaign => {
                    campaignSelect.innerHTML += `<option value="${campaign.id}">${campaign.name}</option>`;
                });
            }

            // Cargar opciones de estado
            const statusSelect = document.getElementById('statusFilter');
            if (statusSelect && jsonData.status_options) {
                statusSelect.innerHTML = '<option value="">Todos los estados</option>';
                jsonData.status_options.forEach(status => {
                    statusSelect.innerHTML += `<option value="${status.value}">${status.text}</option>`;
                });
            }
        } catch (error) {
            console.error('Error loading filters:', error);
        }
    }

    populateSelect(selectId, data, valueField, textField) {
        const select = $(`#${selectId}`);
        select.empty();
        select.append('<option value="">Todos</option>');

        data.forEach(item => {
            select.append(`<option value="${item[valueField]}">${item[textField]}</option>`);
        });
    }

    async ls() {
        try {
            // Cargar datos desde archivo JSON local
            const response = await fetch('./data/sample-data.json');
            const jsonData = await response.json();

            // Formatear datos para la tabla
            const formattedData = jsonData.kpis.map(kpi => ({
                ...kpi,
                ctr: kpi.ctr + '%',
                cpc: '$' + kpi.cpc.toFixed(2),
                roi: kpi.roi + '%',
                cost: '$' + kpi.cost.toFixed(2),
                revenue: '$' + kpi.revenue.toFixed(2),
                conversion_rate: kpi.conversion_rate + '%',
                status: this.getStatusBadge(kpi.status),
                actions: this.getActionButtons(kpi.id)
            }));

            this.createTable({
                parent: `tableContainer${this.PROJECT_NAME}`,
                id: `table${this.PROJECT_NAME}`,
                data: formattedData,
                columns: [
                    { data: 'campaign_name', title: 'Campaña' },
                    { data: 'period', title: 'Período' },
                    { data: 'impressions', title: 'Impresiones' },
                    { data: 'clicks', title: 'Clics' },
                    { data: 'conversions', title: 'Conversiones' },
                    { data: 'ctr', title: 'CTR' },
                    { data: 'cpc', title: 'CPC' },
                    { data: 'roi', title: 'ROI' },
                    { data: 'status', title: 'Estado' },
                    { data: 'actions', title: 'Acciones', orderable: false }
                ],
                responsive: true,
                pageLength: 10
            });

            this.updateStats(jsonData.summary_stats);
        } catch (error) {
            console.error('Error loading KPIs:', error);
            swalError('Error al cargar los KPIs');
        }
    }

    getDateRange() {
        const calendar = $(`#calendar${this.PROJECT_NAME}`);
        const dateRange = calendar.data('daterangepicker');

        if (dateRange) {
            return {
                fi: dateRange.startDate.format('YYYY-MM-DD'),
                ff: dateRange.endDate.format('YYYY-MM-DD')
            };
        }

        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

        return {
            fi: lastMonth.toISOString().split('T')[0],
            ff: today.toISOString().split('T')[0]
        };
    }

    async add() {
        try {
            // Cargar datos desde archivo JSON local
            const response = await fetch('./data/sample-data.json');
            const jsonData = await response.json();

            // Simular modal form con SweetAlert2
            const { value: formData } = await Swal.fire({
                title: 'Agregar KPI de Campaña',
                html: `
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label">Campaña</label>
                            <select id="swal-campaign" class="form-select">
                                ${jsonData.campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Período</label>
                            <select id="swal-period" class="form-select">
                                <option value="daily">Diario</option>
                                <option value="weekly">Semanal</option>
                                <option value="monthly">Mensual</option>
                                <option value="quarterly">Trimestral</option>
                                <option value="yearly">Anual</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Impresiones</label>
                            <input type="number" id="swal-impressions" class="form-control" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Clics</label>
                            <input type="number" id="swal-clicks" class="form-control" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Conversiones</label>
                            <input type="number" id="swal-conversions" class="form-control" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Costo ($)</label>
                            <input type="number" step="0.01" id="swal-cost" class="form-control" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Ingresos ($)</label>
                            <input type="number" step="0.01" id="swal-revenue" class="form-control" required>
                        </div>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    return {
                        campaign_id: document.getElementById('swal-campaign').value,
                        period: document.getElementById('swal-period').value,
                        impressions: document.getElementById('swal-impressions').value,
                        clicks: document.getElementById('swal-clicks').value,
                        conversions: document.getElementById('swal-conversions').value,
                        cost: document.getElementById('swal-cost').value,
                        revenue: document.getElementById('swal-revenue').value
                    };
                }
            });

            if (formData) {
                // Simular guardado exitoso
                swalSuccess('KPI agregado exitosamente');
                this.ls();
            }
        } catch (error) {
            console.error('Error opening add form:', error);
        }
    }

    async edit(id) {
        try {
            // Cargar datos desde archivo JSON local
            const response = await fetch('./data/sample-data.json');
            const jsonData = await response.json();

            // Buscar el KPI por ID
            const kpi = jsonData.kpis.find(k => k.id == id);
            if (!kpi) {
                Swal.fire('Error', 'KPI no encontrado', 'error');
                return;
            }

            // Simular modal form con SweetAlert2
            const { value: formData } = await Swal.fire({
                title: 'Editar KPI de Campaña',
                html: `
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label">Campaña</label>
                            <select id="swal-campaign" class="form-select">
                                ${jsonData.campaigns.map(c => `<option value="${c.id}" ${c.id == kpi.campaign_id ? 'selected' : ''}>${c.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Período</label>
                            <select id="swal-period" class="form-select">
                                <option value="daily" ${kpi.period == 'daily' ? 'selected' : ''}>Diario</option>
                                <option value="weekly" ${kpi.period == 'weekly' ? 'selected' : ''}>Semanal</option>
                                <option value="monthly" ${kpi.period == 'monthly' ? 'selected' : ''}>Mensual</option>
                                <option value="quarterly" ${kpi.period == 'quarterly' ? 'selected' : ''}>Trimestral</option>
                                <option value="yearly" ${kpi.period == 'yearly' ? 'selected' : ''}>Anual</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Impresiones</label>
                            <input type="number" id="swal-impressions" class="form-control" value="${kpi.impressions}" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Clics</label>
                            <input type="number" id="swal-clicks" class="form-control" value="${kpi.clicks}" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Conversiones</label>
                            <input type="number" id="swal-conversions" class="form-control" value="${kpi.conversions}" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Costo ($)</label>
                            <input type="number" step="0.01" id="swal-cost" class="form-control" value="${kpi.cost}" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Ingresos ($)</label>
                            <input type="number" step="0.01" id="swal-revenue" class="form-control" value="${kpi.revenue}" required>
                        </div>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Actualizar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    return {
                        campaign_id: document.getElementById('swal-campaign').value,
                        period: document.getElementById('swal-period').value,
                        impressions: document.getElementById('swal-impressions').value,
                        clicks: document.getElementById('swal-clicks').value,
                        conversions: document.getElementById('swal-conversions').value,
                        cost: document.getElementById('swal-cost').value,
                        revenue: document.getElementById('swal-revenue').value
                    };
                }
            });

            if (formData) {
                // Simular actualización exitosa
                swalSuccess('KPI actualizado exitosamente');
                this.ls();
            }
        } catch (error) {
            console.error('Error loading KPI for edit:', error);
        }
    }

    async cancel(id) {
        const result = await Swal.fire({
            title: '¿Eliminar KPI?',
            text: '¿Estás seguro de que deseas eliminar este KPI?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            // Simular eliminación exitosa
            swalSuccess('KPI eliminado exitosamente');
            this.ls();
        }
    }

    async saveKPI(formData) {
        // Simular guardado - en un entorno real esto haría una llamada al backend
        console.log('Guardando KPI:', formData);
        return { status: 200, message: 'KPI guardado exitosamente' };
    }

    async updateKPI(id, formData) {
        // Simular actualización - en un entorno real esto haría una llamada al backend
        console.log('Actualizando KPI:', id, formData);
        return { status: 200, message: 'KPI actualizado exitosamente' };
    }

    updateStats(stats) {
        if (stats) {
            document.getElementById('totalImpressions').textContent = this.formatNumber(stats.total_impressions || 0);
            document.getElementById('totalClicks').textContent = this.formatNumber(stats.total_clicks || 0);
            document.getElementById('totalConversions').textContent = this.formatNumber(stats.total_conversions || 0);
            document.getElementById('avgROI').textContent = (stats.avg_roi || 0) + '%';
        }
    }

    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }

    getStatusBadge(status) {
        const statusMap = {
            'active': '<span class="badge bg-success">Activo</span>',
            'paused': '<span class="badge bg-warning">Pausado</span>',
            'completed': '<span class="badge bg-info">Completado</span>',
            'cancelled': '<span class="badge bg-danger">Cancelado</span>'
        };
        return statusMap[status] || '<span class="badge bg-secondary">Desconocido</span>';
    }

    getActionButtons(id) {
        return `
            <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-outline-primary" onclick="${this.PROJECT_NAME.toLowerCase()}.edit(${id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn btn-outline-danger" onclick="${this.PROJECT_NAME.toLowerCase()}.cancel(${id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }
}