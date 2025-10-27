let api = 'ctrl/ctrl-ventas.php';
let apiAdmin = 'ctrl/ctrl-admin.php';
let app, saleCapture, paymentForms, adminModule;

let saleCategories, discounts, cashConcepts, bankAccounts, customers;

$(async () => {
    const udn = 5;

    const data = await useFetch({
        url: api,
        data: { opc: "init", udn: udn }
    });

    saleCategories = data.saleCategories;
    discounts = data.discounts;
    cashConcepts = data.cashConcepts;
    bankAccounts = data.bankAccounts;
    customers = data.customers;

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

        this.renderSaleForm();
        this.renderPaymentForm();
        // this.attachEvents();
    }

    renderSaleForm() {
        const form = $("<div>", { class: "space-y-6 p-4" });

        const categoriesSection = $("<div>", { class: "mb-6" });
        categoriesSection.append(`
            <h4 class="font-semibold text-gray-700 mb-3">Venta por categoría (sin impuestos)</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        `);

        saleCategories.forEach(cat => {
            categoriesSection.append(`
                <div class="form-group">
                    <label class="block text-sm font-medium text-gray-600 mb-1">${cat.valor}</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" step="0.01" 
                               class="form-control pl-8 w-full border border-gray-300 rounded-lg px-3 py-2 category-input" 
                               data-id="${cat.id}" 
                               data-name="${cat.valor}"
                               data-tax-iva="${cat.tax_iva || 0}"
                               data-tax-ieps="${cat.tax_ieps || 0}"
                               data-tax-hospedaje="${cat.tax_hospedaje || 0}"
                               data-courtesy="${cat.courtesy || 0}"
                               data-discount="${cat.discount || 0}"
                               value="0">
                    </div>
                </div>
            `);
        });
        categoriesSection.append(`</div>`);

        const discountsSection = $("<div>", { class: "mb-6 border-t pt-4" });
        discountsSection.append(`
            <h4 class="font-semibold text-gray-700 mb-3">Descuentos y cortesías (sin impuestos)</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        `);

        discounts.forEach(disc => {
            discountsSection.append(`
                <div class="form-group">
                    <label class="block text-sm font-medium text-gray-600 mb-1">${disc.valor}</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" step="0.01" 
                               class="form-control pl-8 w-full border border-gray-300 rounded-lg px-3 py-2 discount-input" 
                               data-id="${disc.id}" 
                               data-name="${disc.valor}"
                               data-tax-iva="${disc.tax_iva || 0}"
                               data-tax-ieps="${disc.tax_ieps || 0}"
                               data-tax-hospedaje="${disc.tax_hospedaje || 0}"
                               value="0">
                    </div>
                </div>
            `);
        });
        discountsSection.append(`</div>`);

        const taxesSection = $("<div>", { class: "mb-6 border-t pt-4" });
        taxesSection.append(`
            <h4 class="font-semibold text-gray-700 mb-3">Impuestos</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="form-group">
                    <label class="block text-sm font-medium text-gray-600 mb-1">IVA (8 %)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" step="0.01" 
                               id="tax_iva" 
                               class="form-control pl-8 w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" 
                               value="0" 
                               readonly>
                    </div>
                </div>
            </div>
        `);

        const summarySection = $("<div>", { class: "border-t pt-4 mt-6" });
        summarySection.append(`
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex justify-between text-gray-700">
                    <span>Ventas</span>
                    <span id="summary_sales" class="font-semibold">$ 0.00</span>
                </div>
                <div class="flex justify-between text-red-600">
                    <span>Descuentos y cortesías</span>
                    <span id="summary_discounts" class="font-semibold">$ 0.00</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span>Impuestos</span>
                    <span id="summary_taxes" class="font-semibold">$ 0.00</span>
                </div>
                <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
                    <span>Total de venta</span>
                    <span id="summary_total">$ 0.00</span>
                </div>
            </div>
        `);

        const buttonSection = $("<div>", { class: "mt-6 text-center" });
        buttonSection.append(`
            <button id="btnSaveSale" 
                    class="bg-[#103B60] hover:bg-[#0d2f4d] text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Guardar la venta del día
            </button>
        `);

        form.append(categoriesSection, discountsSection, taxesSection, summarySection, buttonSection);

        $("#formSaleCapture").html(form);

        $(".category-input, .discount-input").on("input", () => this.updateTotals());
        $("#btnSaveSale").on("click", () => this.saveDailySale());

        this.updateTotals();
    }

    renderPaymentForm() {
        console.log(cashConcepts)
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

        // const banksSection = $("<div>", { class: "border-t pt-3 mt-3" });
        // banksSection.append(`<h4 class="font-semibold mb-2">Pagado por bancos</h4>`);

        // bankAccounts.forEach(bank => {
        //     banksSection.append(`
        //         <div class="form-group">
        //             <label>${bank.valor}</label>
        //             <input type="number" step="0.01" class="form-control bank-input" 
        //                    data-id="${bank.id}" value="0">
        //         </div>
        //     `);
        // });

        // const creditsSection = $("<div>", { class: "border-t pt-3 mt-3" });
        // creditsSection.append(`<h4 class="font-semibold mb-2">Créditos a clientes</h4>`);
        // creditsSection.append(`
        //     <div class="form-group">
        //         <label>Consumos</label>
        //         <input type="number" step="0.01" id="credit_consumer" class="form-control" value="0">
        //     </div>
        //     <div class="form-group">
        //         <label>Pagos o abonos</label>
        //         <input type="number" step="0.01" id="credit_payment" class="form-control" value="0">
        //     </div>
        // `);

        // form.append(cashSection, banksSection, creditsSection);
        form.append(cashConcepts);
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
        $('.category-input').each(function () {
            totalCategories += parseFloat($(this).val()) || 0;
        });

        let totalDiscounts = 0;
        $('.discount-input').each(function () {
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
        $('.cash-input').each(function () {
            const amount = parseFloat($(this).val()) || 0;
            const type = $(this).data('type');
            if (type === 'suma') {
                totalCash += amount;
            } else {
                totalCash -= amount;
            }
        });

        let totalBanks = 0;
        $('.bank-input').each(function () {
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

        $('.category-input').each(function () {
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

        $('.discount-input').each(function () {
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


