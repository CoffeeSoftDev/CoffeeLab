let api = 'ctrl/ctrl-ventas.php';
let apiAdmin = 'ctrl/ctrl-admin.php';
let app, saleCapture, paymentForms, adminModule;

let saleCategories, discounts, cashConcepts, bankAccounts, customers;

$(async () => {
    const udn = 1;
    
    const data = await useFetch({ 
        url: api, 
        data: { opc: "init", udn: udn } 
    });
    
    saleCategories = data.saleCategories;
    discounts      = data.discounts;
    cashConcepts   = data.cashConcepts;
    bankAccounts   = data.bankAccounts;
    customers      = data.customers;

    app = new App(api, "root");
    saleCapture = new SaleCapture(api, "root");
    // paymentForms = new PaymentForms(api, "root");
    // adminModule = new AdminModule(apiAdmin, "root");
    
    app.render();
    saleCapture.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "ventas";
    }

    render() {
        this.layout();
        this.layoutTabs();
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

        this.headerBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            title: "📊 Módulo de Ventas",
            subtitle: "Captura y consulta de ventas diarias",
            textBtn: "Menú principal",
            onClick: () => window.location.href = '../../'
        });
    }

    layoutTabs() {
        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "short",
            json: [
                {
                    id: "ventas",
                    tab: "Ventas",
                    class: "mb-1",
                    active: true,
                    onClick: () => saleCapture.render()
                },
                {
                    id: "admin",
                    tab: "Administrador",
                    onClick: () => adminModule.render()
                }
            ]
        });

        $('#content-tabsventas').removeClass('h-screen');
        
        // saleCapture.render();
    }

    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Título por defecto",
            subtitle: "Subtítulo por defecto",
            icon: "icon-home",
            textBtn: "Inicio",
            classBtn: "bg-blue-600 hover:bg-blue-700",
            onClick: null,
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "flex justify-between items-center px-2 pt-3 pb-3"
        });

        const leftSection = $("<div>").append(
            $("<h2>", {
                class: "text-2xl font-semibold",
                text: opts.title
            }),
            $("<p>", {
                class: "text-gray-400",
                text: opts.subtitle
            })
        );

        const rightSection = $("<div>").append(
            $("<button>", {
                class: `${opts.classBtn} text-white font-semibold px-4 py-2 rounded transition flex items-center`,
                html: `<i class="${opts.icon} mr-2"></i>${opts.textBtn}`,
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


class SaleCapture extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.currentClosureId = null;
    }

    render() {
        this.layout();
    }

    layout() {
        const container = $(`#container-ventas`);
        container.html(`
            <div class="p-4">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div class="bg-white rounded-lg shadow p-4">
                        <h3 class="text-lg font-bold mb-4">Ventas del día</h3>
                        <div id="formSaleCapture"></div>
                        <div id="totalsSale" class="mt-4"></div>
                        <button id="btnSaveSale" class="btn btn-primary w-full mt-4">
                            Guardar la venta del día
                        </button>
                    </div>
                    <div class="bg-white rounded-lg shadow p-4">
                        <h3 class="text-lg font-bold mb-4">Formas de ingreso</h3>
                        <div id="formPaymentForms"></div>
                        <div id="totalsPayment" class="mt-4"></div>
                        <button id="btnSavePayment" class="btn btn-success w-full mt-4">
                            Guardar formas de pago
                        </button>
                    </div>
                </div>
            </div>
        `);

        // this.renderSaleForm();
        // this.renderPaymentForm();
        // this.attachEvents();
    }

    renderSaleForm() {
        const form = $("<div>", { class: "space-y-4" });

        form.append(`
            <div class="form-group">
                <label>Fecha de operación</label>
                <input type="date" id="operation_date" class="form-control" value="${moment().format('YYYY-MM-DD')}">
            </div>
        `);

        const categoriesSection = $("<div>", { class: "border-t pt-3 mt-3" });
        categoriesSection.append(`<h4 class="font-semibold mb-2">Categorías de venta</h4>`);
        
        saleCategories.forEach(cat => {
            categoriesSection.append(`
                <div class="form-group">
                    <label>${cat.valor}</label>
                    <input type="number" step="0.01" class="form-control category-input" 
                           data-id="${cat.id}" data-name="${cat.valor}" value="0">
                </div>
            `);
        });

        const discountsSection = $("<div>", { class: "border-t pt-3 mt-3" });
        discountsSection.append(`<h4 class="font-semibold mb-2">Descuentos y cortesías</h4>`);
        
        discounts.forEach(disc => {
            discountsSection.append(`
                <div class="form-group">
                    <label>${disc.valor}</label>
                    <input type="number" step="0.01" class="form-control discount-input" 
                           data-id="${disc.id}" data-name="${disc.valor}" value="0">
                </div>
            `);
        });

        const taxesSection = $("<div>", { class: "border-t pt-3 mt-3" });
        taxesSection.append(`<h4 class="font-semibold mb-2">Impuestos</h4>`);
        taxesSection.append(`
            <div class="form-group">
                <label>IVA (8%)</label>
                <input type="number" step="0.01" id="tax_iva" class="form-control" value="0" readonly>
            </div>
            <div class="form-group">
                <label>IEPS</label>
                <input type="number" step="0.01" id="tax_ieps" class="form-control" value="0">
            </div>
            <div class="form-group">
                <label>Hospedaje</label>
                <input type="number" step="0.01" id="tax_hospedaje" class="form-control" value="0">
            </div>
        `);

        form.append(categoriesSection, discountsSection, taxesSection);
        $("#formSaleCapture").html(form);

        this.updateTotals();
    }

    renderPaymentForm() {
        const form = $("<div>", { class: "space-y-4" });

        const cashSection = $("<div>", { class: "border-t pt-3" });
        cashSection.append(`<h4 class="font-semibold mb-2">Pagado en efectivo</h4>`);
        
        cashConcepts.forEach(concept => {
            cashSection.append(`
                <div class="form-group">
                    <label>${concept.valor}</label>
                    <input type="number" step="0.01" class="form-control cash-input" 
                           data-id="${concept.id}" data-type="${concept.operation_type}" value="0">
                </div>
            `);
        });

        const banksSection = $("<div>", { class: "border-t pt-3 mt-3" });
        banksSection.append(`<h4 class="font-semibold mb-2">Pagado por bancos</h4>`);
        
        bankAccounts.forEach(bank => {
            banksSection.append(`
                <div class="form-group">
                    <label>${bank.valor}</label>
                    <input type="number" step="0.01" class="form-control bank-input" 
                           data-id="${bank.id}" value="0">
                </div>
            `);
        });

        const creditsSection = $("<div>", { class: "border-t pt-3 mt-3" });
        creditsSection.append(`<h4 class="font-semibold mb-2">Créditos a clientes</h4>`);
        creditsSection.append(`
            <div class="form-group">
                <label>Consumos</label>
                <input type="number" step="0.01" id="credit_consumer" class="form-control" value="0">
            </div>
            <div class="form-group">
                <label>Pagos o abonos</label>
                <input type="number" step="0.01" id="credit_payment" class="form-control" value="0">
            </div>
        `);

        form.append(cashSection, banksSection, creditsSection);
        $("#formPaymentForms").html(form);

        this.updatePaymentTotals();
    }

    attachEvents() {
        $(document).on('input', '.category-input, .discount-input, #tax_ieps, #tax_hospedaje', () => {
            this.updateTotals();
        });

        $(document).on('input', '.cash-input, .bank-input, #credit_consumer, #credit_payment', () => {
            this.updatePaymentTotals();
        });

        $('#btnSaveSale').on('click', () => this.saveDailySale());
        $('#btnSavePayment').on('click', () => this.savePaymentForms());
    }

    updateTotals() {
        let totalCategories = 0;
        $('.category-input').each(function() {
            totalCategories += parseFloat($(this).val()) || 0;
        });

        let totalDiscounts = 0;
        $('.discount-input').each(function() {
            totalDiscounts += parseFloat($(this).val()) || 0;
        });

        const subtotal = totalCategories - totalDiscounts;
        const taxIva = subtotal * 0.08;
        const taxIeps = parseFloat($('#tax_ieps').val()) || 0;
        const taxHospedaje = parseFloat($('#tax_hospedaje').val()) || 0;
        const totalTax = taxIva + taxIeps + taxHospedaje;
        const totalSale = subtotal + totalTax;

        $('#tax_iva').val(taxIva.toFixed(2));

        $('#totalsSale').html(`
            <div class="grid grid-cols-2 gap-2">
                <div class="bg-green-100 p-3 rounded">
                    <p class="text-sm text-gray-600">Venta sin impuestos</p>
                    <p class="text-xl font-bold text-green-700">$${totalCategories.toFixed(2)}</p>
                </div>
                <div class="bg-blue-100 p-3 rounded">
                    <p class="text-sm text-gray-600">Subtotal</p>
                    <p class="text-xl font-bold text-blue-700">$${subtotal.toFixed(2)}</p>
                </div>
                <div class="bg-purple-100 p-3 rounded">
                    <p class="text-sm text-gray-600">Total impuestos</p>
                    <p class="text-xl font-bold text-purple-700">$${totalTax.toFixed(2)}</p>
                </div>
                <div class="bg-red-100 p-3 rounded">
                    <p class="text-sm text-gray-600">Total de venta</p>
                    <p class="text-xl font-bold text-red-700">$${totalSale.toFixed(2)}</p>
                </div>
            </div>
        `);

        return { totalCategories, totalDiscounts, subtotal, totalTax, totalSale };
    }

    updatePaymentTotals() {
        let totalCash = 0;
        $('.cash-input').each(function() {
            const amount = parseFloat($(this).val()) || 0;
            const type = $(this).data('type');
            if (type === 'suma') {
                totalCash += amount;
            } else {
                totalCash -= amount;
            }
        });

        let totalBanks = 0;
        $('.bank-input').each(function() {
            totalBanks += parseFloat($(this).val()) || 0;
        });

        const creditConsumer = parseFloat($('#credit_consumer').val()) || 0;
        const creditPayment = parseFloat($('#credit_payment').val()) || 0;
        const netCredit = creditConsumer - creditPayment;

        const totalReceived = totalCash + totalBanks + netCredit;
        
        const totals = this.updateTotals();
        const difference = totals.totalSale - totalReceived;

        const differenceClass = Math.abs(difference) < 0.01 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

        $('#totalsPayment').html(`
            <div class="grid grid-cols-3 gap-2">
                <div class="bg-blue-100 p-3 rounded">
                    <p class="text-sm text-gray-600">Efectivo</p>
                    <p class="text-lg font-bold text-blue-700">$${totalCash.toFixed(2)}</p>
                </div>
                <div class="bg-blue-100 p-3 rounded">
                    <p class="text-sm text-gray-600">Bancos</p>
                    <p class="text-lg font-bold text-blue-700">$${totalBanks.toFixed(2)}</p>
                </div>
                <div class="bg-blue-100 p-3 rounded">
                    <p class="text-sm text-gray-600">Créditos</p>
                    <p class="text-lg font-bold text-blue-700">$${netCredit.toFixed(2)}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
                <div class="bg-cyan-100 p-3 rounded">
                    <p class="text-sm text-gray-600">Total pagado</p>
                    <p class="text-xl font-bold text-cyan-700">$${totalReceived.toFixed(2)}</p>
                </div>
                <div class="${differenceClass} p-3 rounded">
                    <p class="text-sm text-gray-600">Diferencia</p>
                    <p class="text-xl font-bold">$${difference.toFixed(2)}</p>
                </div>
            </div>
        `);

        return { totalCash, totalBanks, netCredit, totalReceived, difference };
    }

    async saveDailySale() {
        const totals = this.updateTotals();
        const categories = [];
        const discountsList = [];

        $('.category-input').each(function() {
            const amount = parseFloat($(this).val()) || 0;
            if (amount > 0) {
                categories.push({
                    sale_category_id: $(this).data('id'),
                    total: amount,
                    subtotal: amount,
                    tax_iva: amount * 0.08,
                    tax_ieps: 0,
                    tax_hospedaje: 0
                });
            }
        });

        $('.discount-input').each(function() {
            const amount = parseFloat($(this).val()) || 0;
            if (amount > 0) {
                discountsList.push({
                    discount_courtesy_id: $(this).data('id'),
                    total: amount,
                    subtotal: amount,
                    tax_iva: amount * 0.08,
                    tax_ieps: 0,
                    tax_hospedaje: 0
                });
            }
        });

        const response = await useFetch({
            url: this._link,
            data: {
                opc: 'saveDailySale',
                udn_id: 1,
                operation_date: $('#operation_date').val(),
                total_sale_without_tax: totals.totalCategories,
                subtotal: totals.subtotal,
                tax: totals.totalTax,
                total_sale: totals.totalSale,
                categories: categories,
                discounts: discountsList
            }
        });

        if (response.status === 200) {
            this.currentClosureId = response.closure_id;
            alert({ icon: "success", text: response.message });
        } else {
            alert({ icon: "error", text: response.message });
        }
    }

    async savePaymentForms() {
        if (!this.currentClosureId) {
            alert({ icon: "warning", text: "Primero debes guardar la venta del día" });
            return;
        }

        const paymentTotals = this.updatePaymentTotals();

        const response = await useFetch({
            url: this._link,
            data: {
                opc: 'savePaymentForms',
                closure_id: this.currentClosureId,
                cash: paymentTotals.totalCash,
                bank: paymentTotals.totalBanks,
                foreing_currency: 0,
                credit_consumer: parseFloat($('#credit_consumer').val()) || 0,
                credit_payment: parseFloat($('#credit_payment').val()) || 0,
                total_received: paymentTotals.totalReceived,
                difference: paymentTotals.difference
            }
        });

        if (response.status === 200) {
            alert({ icon: "success", text: response.message });
        } else {
            alert({ icon: "error", text: response.message });
        }
    }
}


class AdminModule extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    render() {
        this.layout();
    }

    layout() {
        const container = $(`#container-admin`);
        
        this.tabLayout({
            parent: "container-admin",
            id: "tabsAdmin",
            theme: "light",
            type: "short",
            json: [
                {
                    id: "categorias",
                    tab: "Categorías",
                    active: true,
                    onClick: () => this.lsSaleCategories()
                },
                {
                    id: "descuentos",
                    tab: "Descuentos",
                    onClick: () => this.lsDiscounts()
                },
                {
                    id: "conceptos",
                    tab: "Conceptos Efectivo",
                    onClick: () => this.lsCashConcepts()
                },
                {
                    id: "clientes",
                    tab: "Clientes",
                    onClick: () => this.lsCustomers()
                }
            ]
        });

        this.lsSaleCategories();
    }

    lsSaleCategories() {
        const container = $(`#container-categorias`);
        container.html('<div id="filterbar-categorias" class="mb-2"></div><div id="tabla-categorias"></div>');

        this.createfilterBar({
            parent: "filterbar-categorias",
            data: [
                {
                    opc: "select",
                    id: "active",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activas" },
                        { id: "0", valor: "Inactivas" }
                    ],
                    onchange: 'adminModule.lsSaleCategories()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNewCategory",
                    text: "Nueva categoría",
                    onClick: () => this.addSaleCategory(),
                },
            ],
        });

        this.createTable({
            parent: "tabla-categorias",
            idFilterBar: "filterbar-categorias",
            data: { opc: "lsSaleCategories", udn: 1 },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbCategories",
                theme: 'light',
                center: [3]
            },
        });
    }

    addSaleCategory() {
        this.createModalForm({
            id: 'formCategoryAdd',
            data: { opc: 'addSaleCategory', udn_id: 1 },
            bootbox: {
                title: 'Agregar Categoría de Venta',
            },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la categoría",
                    class: "col-12 mb-3"
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsSaleCategories();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    async editSaleCategory(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getSaleCategory", id: id }
        });

        const data = request.data;

        this.createModalForm({
            id: 'formCategoryEdit',
            data: { opc: 'editSaleCategory', id: id },
            bootbox: {
                title: 'Editar Categoría',
            },
            autofill: data,
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la categoría",
                    class: "col-12 mb-3"
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsSaleCategories();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    statusSaleCategory(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Cambiar estado?",
                text: "Esta acción activará o desactivará la categoría",
                icon: "warning",
            },
            data: {
                opc: "statusSaleCategory",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsSaleCategories();
                    }
                }
            },
        });
    }

    lsDiscounts() {
        const container = $(`#container-descuentos`);
        container.html('<div id="filterbar-descuentos" class="mb-2"></div><div id="tabla-descuentos"></div>');

        this.createfilterBar({
            parent: "filterbar-descuentos",
            data: [
                {
                    opc: "select",
                    id: "active",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'adminModule.lsDiscounts()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNewDiscount",
                    text: "Nuevo descuento",
                    onClick: () => this.addDiscount(),
                },
            ],
        });

        this.createTable({
            parent: "tabla-descuentos",
            idFilterBar: "filterbar-descuentos",
            data: { opc: "lsDiscounts", udn: 1 },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbDiscounts",
                theme: 'light',
                center: [2, 3]
            },
        });
    }

    addDiscount() {
        this.createModalForm({
            id: 'formDiscountAdd',
            data: { opc: 'addDiscount', udn_id: 1 },
            bootbox: {
                title: 'Agregar Descuento/Cortesía',
            },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre",
                    class: "col-12 mb-3"
                },
                {
                    opc: "checkbox",
                    id: "tax_iva",
                    lbl: "Aplica IVA",
                    class: "col-4 mb-3"
                },
                {
                    opc: "checkbox",
                    id: "tax_ieps",
                    lbl: "Aplica IEPS",
                    class: "col-4 mb-3"
                },
                {
                    opc: "checkbox",
                    id: "tax_hospedaje",
                    lbl: "Aplica Hospedaje",
                    class: "col-4 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsDiscounts();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    async editDiscount(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getDiscount", id: id }
        });

        const data = request.data;

        this.createModalForm({
            id: 'formDiscountEdit',
            data: { opc: 'editDiscount', id: id },
            bootbox: {
                title: 'Editar Descuento/Cortesía',
            },
            autofill: data,
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre",
                    class: "col-12 mb-3"
                },
                {
                    opc: "checkbox",
                    id: "tax_iva",
                    lbl: "Aplica IVA",
                    class: "col-4 mb-3"
                },
                {
                    opc: "checkbox",
                    id: "tax_ieps",
                    lbl: "Aplica IEPS",
                    class: "col-4 mb-3"
                },
                {
                    opc: "checkbox",
                    id: "tax_hospedaje",
                    lbl: "Aplica Hospedaje",
                    class: "col-4 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsDiscounts();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    statusDiscount(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Cambiar estado?",
                text: "Esta acción activará o desactivará el descuento/cortesía",
                icon: "warning",
            },
            data: {
                opc: "statusDiscount",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsDiscounts();
                    }
                }
            },
        });
    }

    lsCashConcepts() {
        const container = $(`#container-conceptos`);
        container.html('<div id="filterbar-conceptos" class="mb-2"></div><div id="tabla-conceptos"></div>');

        this.createfilterBar({
            parent: "filterbar-conceptos",
            data: [
                {
                    opc: "select",
                    id: "active",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'adminModule.lsCashConcepts()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNewConcept",
                    text: "Nuevo concepto",
                    onClick: () => this.addCashConcept(),
                },
            ],
        });

        this.createTable({
            parent: "tabla-conceptos",
            idFilterBar: "filterbar-conceptos",
            data: { opc: "lsCashConcepts", udn: 1 },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbConcepts",
                theme: 'light',
                center: [2, 3]
            },
        });
    }

    addCashConcept() {
        this.createModalForm({
            id: 'formConceptAdd',
            data: { opc: 'addCashConcept', udn_id: 1 },
            bootbox: {
                title: 'Agregar Concepto de Efectivo',
            },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del concepto",
                    class: "col-12 mb-3"
                },
                {
                    opc: "select",
                    id: "operation_type",
                    lbl: "Tipo de operación",
                    class: "col-12 mb-3",
                    data: [
                        { id: "suma", valor: "Suma" },
                        { id: "resta", valor: "Resta" }
                    ]
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCashConcepts();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    async editCashConcept(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCashConcept", id: id }
        });

        const data = request.data;

        this.createModalForm({
            id: 'formConceptEdit',
            data: { opc: 'editCashConcept', id: id },
            bootbox: {
                title: 'Editar Concepto',
            },
            autofill: data,
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del concepto",
                    class: "col-12 mb-3"
                },
                {
                    opc: "select",
                    id: "operation_type",
                    lbl: "Tipo de operación",
                    class: "col-12 mb-3",
                    data: [
                        { id: "suma", valor: "Suma" },
                        { id: "resta", valor: "Resta" }
                    ]
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCashConcepts();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    statusCashConcept(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Cambiar estado?",
                text: "Esta acción activará o desactivará el concepto",
                icon: "warning",
            },
            data: {
                opc: "statusCashConcept",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsCashConcepts();
                    }
                }
            },
        });
    }

    lsCustomers() {
        const container = $(`#container-clientes`);
        container.html('<div id="filterbar-clientes" class="mb-2"></div><div id="tabla-clientes"></div>');

        this.createfilterBar({
            parent: "filterbar-clientes",
            data: [
                {
                    opc: "select",
                    id: "active",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'adminModule.lsCustomers()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNewCustomer",
                    text: "Nuevo cliente",
                    onClick: () => this.addCustomer(),
                },
            ],
        });

        this.createTable({
            parent: "tabla-clientes",
            idFilterBar: "filterbar-clientes",
            data: { opc: "lsCustomers", udn: 1 },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbCustomers",
                theme: 'light',
                center: [2, 3]
            },
        });
    }

    addCustomer() {
        this.createModalForm({
            id: 'formCustomerAdd',
            data: { opc: 'addCustomer', udn_id: 1 },
            bootbox: {
                title: 'Agregar Cliente',
            },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del cliente",
                    class: "col-12 mb-3"
                },
                {
                    opc: "input",
                    id: "balance",
                    lbl: "Saldo inicial",
                    tipo: "cifra",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCustomers();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    async editCustomer(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCustomer", id: id }
        });

        const data = request.data;

        this.createModalForm({
            id: 'formCustomerEdit',
            data: { opc: 'editCustomer', id: id },
            bootbox: {
                title: 'Editar Cliente',
            },
            autofill: data,
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del cliente",
                    class: "col-12 mb-3"
                },
                {
                    opc: "input",
                    id: "balance",
                    lbl: "Saldo",
                    tipo: "cifra",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCustomers();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    statusCustomer(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Cambiar estado?",
                text: "Esta acción activará o desactivará el cliente",
                icon: "warning",
            },
            data: {
                opc: "statusCustomer",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsCustomers();
                    }
                }
            },
        });
    }
}
