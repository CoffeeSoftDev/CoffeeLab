let api = 'ctrl/ctrl-clientes.php';
let app;

let clients, movementTypes, paymentMethods;

$(async () => {
    const data = await useFetch({ 
        url: api, 
        data: { opc: "init", udn: 1 } 
    });
    
    clients = data.clients;
    movementTypes = data.movementTypes;
    paymentMethods = data.paymentMethods;

    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "clientes";
    }

    render() {
        this.layout();
        this.renderDashboard();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full h-full', id: 'container' + this.PROJECT_NAME }
            }
        });

        $(`#filterBar${this.PROJECT_NAME}`).html(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">👥 Módulo de Clientes</h2>
                <p class="text-gray-400">Gestión integral de créditos y movimientos de clientes</p>
            </div>
        `);

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            type: "short",
            json: [
                {
                    id: "dashboard",
                    tab: "Dashboard",
                    active: true,
                    onClick: () => this.renderDashboard()
                },
                {
                    id: "movimientos",
                    tab: "Movimientos",
                    onClick: () => this.renderMovimientos()
                },
                {
                    id: "concentrado",
                    tab: "Concentrado",
                    onClick: () => this.renderConcentrado()
                }
            ]
        });
    }

    renderDashboard() {
        const container = $(`#container-dashboard`);
        container.html(`
            <div class="p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p class="text-sm text-gray-600 mb-1">Total de consumos</p>
                        <p id="totalConsumos" class="text-2xl font-bold text-green-700">$0.00</p>
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p class="text-sm text-gray-600 mb-1">Total pagos en efectivo</p>
                        <p id="totalEfectivo" class="text-2xl font-bold text-blue-700">$0.00</p>
                    </div>
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p class="text-sm text-gray-600 mb-1">Total pagos en banco</p>
                        <p id="totalBanco" class="text-2xl font-bold text-purple-700">$0.00</p>
                    </div>
                </div>
                
                <div class="flex gap-3 mb-4">
                    <button id="btnConcentrado" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                        <i class="icon-chart mr-2"></i>Concentrado de clientes
                    </button>
                    <button id="btnNuevoMovimiento" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
                        <i class="icon-plus mr-2"></i>Registrar nuevo movimiento
                    </button>
                </div>
                
                <div id="dashboardTable"></div>
            </div>
        `);

        $('#btnConcentrado').on('click', () => this.renderConcentrado());
        $('#btnNuevoMovimiento').on('click', () => this.addMovimiento());

        this.updateDashboardTotals();
        this.lsMovimientos('dashboardTable');
    }

    renderMovimientos() {
        const container = $(`#container-movimientos`);
        container.html(`
            <div class="p-4">
                <div id="filterBarMovimientos" class="mb-3"></div>
                <div id="tableMovimientos"></div>
            </div>
        `);

        this.filterBarMovimientos();
        this.lsMovimientos('tableMovimientos');
    }

    renderConcentrado() {
        const container = $(`#container-concentrado`);
        container.html(`
            <div class="p-4">
                <div id="filterBarConcentrado" class="mb-3"></div>
                <div id="tableConcentrado"></div>
            </div>
        `);

        this.filterBarConcentrado();
        this.lsConcentrado();
    }

    filterBarMovimientos() {
        this.createfilterBar({
            parent: "filterBarMovimientos",
            data: [
                {
                    opc: "input",
                    type: "date",
                    id: "capture_date",
                    lbl: "Fecha de captura",
                    class: "col-12 col-md-4",
                    onchange: "app.lsMovimientos('tableMovimientos')"
                },
                {
                    opc: "button",
                    id: "btnAddMovimiento",
                    text: "Nuevo movimiento",
                    class: "col-12 col-md-3",
                    className: "w-full",
                    color_btn: "primary",
                    onClick: () => this.addMovimiento()
                }
            ]
        });

        setTimeout(() => {
            $('#capture_date').val(moment().format('YYYY-MM-DD'));
        }, 100);
    }

    filterBarConcentrado() {
        this.createfilterBar({
            parent: "filterBarConcentrado",
            data: [
                {
                    opc: "input",
                    type: "date",
                    id: "start_date",
                    lbl: "Fecha inicial",
                    class: "col-12 col-md-3",
                    onchange: "app.lsConcentrado()"
                },
                {
                    opc: "input",
                    type: "date",
                    id: "end_date",
                    lbl: "Fecha final",
                    class: "col-12 col-md-3",
                    onchange: "app.lsConcentrado()"
                },
                {
                    opc: "button",
                    id: "btnExportExcel",
                    text: "Exportar a Excel",
                    class: "col-12 col-md-3",
                    className: "w-full",
                    color_btn: "success",
                    onClick: () => this.exportToExcel()
                }
            ]
        });

        setTimeout(() => {
            const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
            const today = moment().format('YYYY-MM-DD');
            $('#start_date').val(startOfMonth);
            $('#end_date').val(today);
        }, 100);
    }

    lsMovimientos(parentId = 'tableMovimientos') {
        const captureDate = $('#capture_date').val() || moment().format('YYYY-MM-DD');

        this.createTable({
            parent: parentId,
            idFilterBar: "filterBarMovimientos",
            data: { 
                opc: "ls", 
                capture_date: captureDate,
                udn: 1
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbMovimientos",
                theme: 'light',
                title: '📋 Movimientos del día',
                subtitle: `Fecha: ${moment(captureDate).format('DD/MM/YYYY')}`,
                center: [2, 3],
                right: [4]
            },
            success: (data) => {
                if (data.totals) {
                    $('#totalConsumos').text(formatPrice(data.totals.total_consumptions));
                    $('#totalEfectivo').text(formatPrice(data.totals.total_cash_payments));
                    $('#totalBanco').text(formatPrice(data.totals.total_bank_payments));
                }
            }
        });
    }

    lsConcentrado() {
        const startDate = $('#start_date').val();
        const endDate = $('#end_date').val();

        this.createTable({
            parent: "tableConcentrado",
            idFilterBar: "filterBarConcentrado",
            data: { 
                opc: "lsConcentrado",
                start_date: startDate,
                end_date: endDate,
                udn: 1
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbConcentrado",
                theme: 'light',
                title: '📊 Concentrado de clientes',
                subtitle: `Período: ${moment(startDate).format('DD/MM/YYYY')} - ${moment(endDate).format('DD/MM/YYYY')}`,
                center: [6],
                right: [2, 3, 4, 5]
            }
        });
    }

    addMovimiento() {
        this.createModalForm({
            id: 'formMovimientoAdd',
            data: { opc: 'addMovimiento', udn: 1 },
            bootbox: {
                title: '➕ Registrar nuevo movimiento de crédito',
                size: 'large'
            },
            json: this.jsonMovimiento(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsMovimientos('tableMovimientos');
                    this.updateDashboardTotals();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });

        setTimeout(() => {
            this.setupMovementTypeLogic();
        }, 200);
    }

    async editMovimiento(id) {
        const request = await useFetch({ 
            url: this._link, 
            data: { opc: "getMovimiento", id } 
        });

        if (request.status !== 200) {
            alert({ icon: "error", text: request.message });
            return;
        }

        this.createModalForm({
            id: 'formMovimientoEdit',
            data: { opc: 'editMovimiento', id, udn: 1 },
            bootbox: {
                title: '✏️ Editar movimiento de crédito',
                size: 'large'
            },
            autofill: request.data,
            json: this.jsonMovimiento(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsMovimientos('tableMovimientos');
                    this.updateDashboardTotals();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });

        setTimeout(() => {
            $('#client_id').prop('disabled', true);
            this.setupMovementTypeLogic();
        }, 200);
    }

    async viewMovimiento(id) {
        const request = await useFetch({ 
            url: this._link, 
            data: { opc: "getMovimiento", id } 
        });

        if (request.status !== 200) {
            alert({ icon: "error", text: request.message });
            return;
        }

        const data = request.data;
        const movementTypeText = movementTypes.find(t => t.id === data.movement_type)?.valor || data.movement_type;
        const paymentMethodText = paymentMethods.find(p => p.id === data.payment_method)?.valor || data.payment_method;

        bootbox.dialog({
            title: '👁️ Detalle de movimiento de crédito',
            message: `
                <div class="p-3">
                    <div class="mb-4">
                        <h5 class="font-bold text-lg mb-2">INFORMACIÓN DEL CLIENTE</h5>
                        <p class="mb-1"><strong>Nombre del cliente:</strong> ${data.client_name}</p>
                        ${data.client_phone ? `<p class="mb-1"><strong>Teléfono:</strong> ${data.client_phone}</p>` : ''}
                        ${data.client_email ? `<p class="mb-1"><strong>Email:</strong> ${data.client_email}</p>` : ''}
                    </div>
                    
                    <div class="mb-4">
                        <h5 class="font-bold text-lg mb-2">DETALLES DEL MOVIMIENTO</h5>
                        <p class="mb-1"><strong>Tipo de movimiento:</strong> ${movementTypeText}</p>
                        <p class="mb-1"><strong>Método de pago:</strong> ${paymentMethodText}</p>
                    </div>
                    
                    ${data.description ? `
                    <div class="mb-4">
                        <h5 class="font-bold text-lg mb-2">DESCRIPCIÓN</h5>
                        <p>${data.description}</p>
                    </div>
                    ` : '<div class="mb-4"><h5 class="font-bold text-lg mb-2">DESCRIPCIÓN</h5><p>Ninguna</p></div>'}
                    
                    <div class="mb-4">
                        <h5 class="font-bold text-lg mb-2">RESUMEN FINANCIERO</h5>
                        <p class="mb-1"><strong>Deuda actual:</strong> ${formatPrice(data.previous_balance)}</p>
                        <p class="mb-1"><strong>${data.movement_type === 'consumo' ? 'Consumo a crédito' : 'Pago'}:</strong> ${formatPrice(data.amount)}</p>
                        <p class="mb-1"><strong>Nueva deuda:</strong> <span class="text-lg font-bold">${formatPrice(data.new_balance)}</span></p>
                    </div>
                    
                    ${data.formatted_date_update ? `
                    <div class="text-sm text-gray-500 mt-4 pt-3 border-t">
                        <p>Actualizado por última vez: ${data.formatted_date_update}</p>
                    </div>
                    ` : ''}
                </div>
            `,
            size: 'large',
            buttons: {
                ok: {
                    label: 'Cerrar',
                    className: 'btn-primary'
                }
            }
        });
    }

    deleteMovimiento(id) {
        this.swalQuestion({
            opts: {
                title: "¿Está seguro?",
                text: "¿Desea eliminar este movimiento de crédito? Esta acción no se puede deshacer.",
                icon: "warning"
            },
            data: { opc: "deleteMovimiento", id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsMovimientos('tableMovimientos');
                        this.updateDashboardTotals();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    jsonMovimiento() {
        return [
            {
                opc: "select",
                id: "client_id",
                lbl: "Nombre del Cliente",
                class: "col-12 col-md-6 mb-3",
                data: clients,
                text: "name",
                value: "id",
                onchange: "app.updateCurrentBalance()"
            },
            {
                opc: "input",
                id: "current_balance",
                lbl: "Deuda actual",
                tipo: "texto",
                class: "col-12 col-md-6 mb-3",
                readonly: true
            },
            {
                opc: "select",
                id: "movement_type",
                lbl: "Tipo de movimiento",
                class: "col-12 col-md-6 mb-3",
                data: movementTypes,
                text: "valor",
                value: "id",
                onchange: "app.handleMovementTypeChange()"
            },
            {
                opc: "select",
                id: "payment_method",
                lbl: "Método de pago",
                class: "col-12 col-md-6 mb-3",
                data: paymentMethods,
                text: "valor",
                value: "id"
            },
            {
                opc: "input",
                id: "amount",
                lbl: "Cantidad",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                onkeyup: "validationInputForNumber('#amount')"
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción (opcional)",
                rows: 3,
                class: "col-12 mb-3",
                required: false
            }
        ];
    }

    setupMovementTypeLogic() {
        this.handleMovementTypeChange();
        this.updateCurrentBalance();
    }

    handleMovementTypeChange() {
        const movementType = $('#movement_type').val();
        const paymentMethodSelect = $('#payment_method');

        if (movementType === 'consumo') {
            paymentMethodSelect.val('n/a');
            paymentMethodSelect.prop('disabled', true);
        } else {
            paymentMethodSelect.prop('disabled', false);
            if (paymentMethodSelect.val() === 'n/a') {
                paymentMethodSelect.val('efectivo');
            }
        }
    }

    updateCurrentBalance() {
        const clientId = $('#client_id').val();
        if (clientId) {
            const client = clients.find(c => c.id == clientId);
            if (client) {
                $('#current_balance').val(formatPrice(client.current_balance));
            }
        }
    }

    updateDashboardTotals() {
        const captureDate = moment().format('YYYY-MM-DD');
        
        useFetch({
            url: this._link,
            data: { 
                opc: "ls", 
                capture_date: captureDate,
                udn: 1
            },
            success: (data) => {
                if (data.totals) {
                    $('#totalConsumos').text(formatPrice(data.totals.total_consumptions));
                    $('#totalEfectivo').text(formatPrice(data.totals.total_cash_payments));
                    $('#totalBanco').text(formatPrice(data.totals.total_bank_payments));
                }
            }
        });
    }

    exportToExcel() {
        const startDate = $('#start_date').val();
        const endDate = $('#end_date').val();
        
        alert({ 
            icon: "info", 
            text: "Funcionalidad de exportación a Excel en desarrollo" 
        });
    }
}

function formatPrice(amount) {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
