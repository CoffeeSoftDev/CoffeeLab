let api = '../ctrl/ctrl-compras.php';
let app, reportConcentrado;

let lsProductClass, lsProduct, lsSupplier, lsPurchaseType, lsMethodPay, lsUdn;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    
    lsProductClass = data.productClass;
    lsProduct = data.product;
    lsSupplier = data.supplier;
    lsPurchaseType = data.purchaseType;
    lsMethodPay = data.methodPay;
    lsUdn = data.udn;

    app = new App(api, "root");
    reportConcentrado = new ReportConcentrado(api, "root");
    
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "compras";
    }

    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full border-b pb-3", id: `filterBar${this.PROJECT_NAME}` },
                container: { class: "w-full my-3 h-full", id: `container${this.PROJECT_NAME}` }
            }
        });

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            type: "short",
            json: [
                {
                    id: "compras",
                    tab: "📦 Compras",
                    active: true,
                    onClick: () => this.ls()
                },
                {
                    id: "reporte",
                    tab: "📊 Concentrado",
                    onClick: () => reportConcentrado.render()
                }
            ]
        });

        $(`#container${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">💰 Módulo de Compras</h2>
                <p class="text-gray-400">Gestiona las compras realizadas por la unidad de negocio</p>
            </div>
        `);
    }

    filterBar() {
        const container = $(`#container-compras`);
        container.html(`
            <div id="filterbar-compras" class="mb-3"></div>
            <div id="totales-compras" class="mb-3"></div>
            <div id="tabla-compras"></div>
        `);

        this.createfilterBar({
            parent: "filterbar-compras",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: lsUdn,
                    onchange: 'app.ls()'
                },
                {
                    opc: "select",
                    id: "purchase_type",
                    lbl: "Tipo de Compra",
                    class: "col-12 col-md-3",
                    data: lsPurchaseType,
                    onchange: 'app.ls()'
                },
                {
                    opc: "select",
                    id: "method_pay",
                    lbl: "Método de Pago",
                    class: "col-12 col-md-3",
                    data: lsMethodPay,
                    onchange: 'app.ls()'
                },
                {
                    opc: "input-calendar",
                    id: "calendar",
                    lbl: "Fecha",
                    class: "col-12 col-md-3"
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevaCompra",
                    text: "➕ Registrar Compra",
                    onClick: () => this.addCompra()
                }
            ]
        });

        dataPicker({
            parent: "calendar",
            onSelect: () => this.ls()
        });
    }

    async ls() {
        const rangePicker = getDataRangePicker("calendar");
        const udn = $('#filterbar-compras #udn').val();
        const purchaseType = $('#filterbar-compras #purchase_type').val();
        const methodPay = $('#filterbar-compras #method_pay').val();

        const data = await useFetch({
            url: this._link,
            data: {
                opc: "ls",
                udn: udn,
                purchase_type: purchaseType,
                method_pay: methodPay,
                fi: rangePicker.fi,
                ff: rangePicker.ff
            }
        });

        this.showTotales(data.totales);

        this.createTable({
            parent: "tabla-compras",
            idFilterBar: "filterbar-compras",
            data: {
                opc: "ls",
                udn: udn,
                purchase_type: purchaseType,
                method_pay: methodPay,
                fi: rangePicker.fi,
                ff: rangePicker.ff
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbCompras",
                theme: 'corporativo',
                title: '📋 Lista de Compras',
                subtitle: 'Compras registradas en el sistema',
                center: [1, 2, 3, 4],
                right: [5, 6]
            }
        });
    }

    showTotales(totales) {
        const container = $("<div>", {
            class: "grid grid-cols-1 md:grid-cols-4 gap-4 px-4"
        });

        const cards = [
            {
                title: "Total Compras",
                value: formatPrice(totales.total_general),
                color: "text-blue-600",
                bg: "bg-blue-50"
            },
            {
                title: "Fondo Fijo",
                value: formatPrice(totales.fondo_fijo),
                color: "text-green-600",
                bg: "bg-green-50"
            },
            {
                title: "Corporativo",
                value: formatPrice(totales.corporativo),
                color: "text-purple-600",
                bg: "bg-purple-50"
            },
            {
                title: "Crédito",
                value: formatPrice(totales.credito),
                color: "text-orange-600",
                bg: "bg-orange-50"
            }
        ];

        cards.forEach(card => {
            const cardDiv = $("<div>", {
                class: `${card.bg} p-4 rounded-lg`
            });

            cardDiv.append(
                $("<p>", {
                    class: "text-sm text-gray-600",
                    text: card.title
                }),
                $("<p>", {
                    class: `text-2xl font-bold ${card.color}`,
                    text: card.value
                })
            );

            container.append(cardDiv);
        });

        $("#totales-compras").html(container);
    }

    addCompra() {
        this.createModalForm({
            id: 'formCompraAdd',
            data: { opc: 'addCompra' },
            bootbox: {
                title: '➕ Registrar Nueva Compra',
                closeButton: true
            },
            json: this.jsonCompra(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });

        this.setupFormEvents();
    }

    async editCompra(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCompra", id: id }
        });

        this.createModalForm({
            id: 'formCompraEdit',
            data: { opc: 'editCompra', id: id },
            bootbox: {
                title: '✏️ Editar Compra',
                closeButton: true
            },
            autofill: request.data,
            json: this.jsonCompra(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });

        this.setupFormEvents();
    }

    deleteCompra(id) {
        this.swalQuestion({
            opts: {
                title: "¿Eliminar compra?",
                text: "Esta acción no se puede deshacer",
                icon: "warning"
            },
            data: { opc: "deleteCompra", id: id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    async detailCompra(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCompra", id: id }
        });

        const data = request.data;

        bootbox.dialog({
            title: '📄 Detalle de Compra',
            message: `
                <div class="p-4">
                    <h4 class="font-bold mb-3">INFORMACIÓN DEL PRODUCTO</h4>
                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <div><strong>Categoría:</strong> ${data.product_class_name}</div>
                        <div><strong>Producto:</strong> ${data.product_name}</div>
                        <div><strong>Tipo de Compra:</strong> ${data.purchase_type_name}</div>
                        <div><strong>Método de Pago:</strong> ${data.method_pay_name || 'N/A'}</div>
                    </div>

                    <h4 class="font-bold mb-3">INFORMACIÓN DE FACTURACIÓN</h4>
                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <div><strong>Proveedor:</strong> ${data.supplier_name || 'Al contado'}</div>
                        <div><strong>Subtotal:</strong> ${formatPrice(data.subtotal)}</div>
                        <div><strong>Impuesto:</strong> ${formatPrice(data.tax)}</div>
                        <div><strong>Total:</strong> ${formatPrice(data.total)}</div>
                    </div>

                    <h4 class="font-bold mb-3">DESCRIPCIÓN</h4>
                    <p>${data.description || 'Sin descripción'}</p>
                </div>
            `,
            closeButton: true
        });
    }

    jsonCompra() {
        return [
            {
                opc: "label",
                text: "Información del Producto",
                class: "col-12 fw-bold text-lg mb-2 border-b pb-2"
            },
            {
                opc: "select",
                id: "product_class_id",
                lbl: "Categoría de Producto",
                class: "col-12 col-md-6 mb-3",
                data: lsProductClass,
                text: "name",
                value: "id",
                required: true,
                onchange: "app.loadProducts()"
            },
            {
                opc: "select",
                id: "product_id",
                lbl: "Producto",
                class: "col-12 col-md-6 mb-3",
                data: [],
                text: "name",
                value: "id",
                required: true
            },
            {
                opc: "select",
                id: "purchase_type_id",
                lbl: "Tipo de Compra",
                class: "col-12 col-md-6 mb-3",
                data: lsPurchaseType,
                text: "name",
                value: "id",
                required: true,
                onchange: "app.handlePurchaseTypeChange()"
            },
            {
                opc: "select",
                id: "method_pay_id",
                lbl: "Método de Pago",
                class: "col-12 col-md-6 mb-3 d-none",
                data: lsMethodPay,
                text: "name",
                value: "id"
            },
            {
                opc: "select",
                id: "supplier_id",
                lbl: "Proveedor",
                class: "col-12 col-md-6 mb-3 d-none",
                data: lsSupplier,
                text: "name",
                value: "id"
            },
            {
                opc: "label",
                text: "Información Financiera",
                class: "col-12 fw-bold text-lg mb-2 border-b pb-2"
            },
            {
                opc: "input",
                id: "subtotal",
                lbl: "Subtotal",
                tipo: "cifra",
                class: "col-12 col-md-4 mb-3",
                required: true,
                onkeyup: "validationInputForNumber('#subtotal'); app.calculateTotal()"
            },
            {
                opc: "input",
                id: "tax",
                lbl: "Impuesto",
                tipo: "cifra",
                class: "col-12 col-md-4 mb-3",
                required: true,
                onkeyup: "validationInputForNumber('#tax'); app.calculateTotal()"
            },
            {
                opc: "input",
                id: "total",
                lbl: "Total",
                tipo: "cifra",
                class: "col-12 col-md-4 mb-3",
                readonly: true
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción",
                class: "col-12 mb-3",
                rows: 3
            },
            {
                opc: "btn-submit",
                text: "Guardar Compra",
                class: "col-12 col-md-6 offset-md-6"
            }
        ];
    }

    setupFormEvents() {
        setTimeout(() => {
            this.loadProducts();
        }, 100);
    }

    async loadProducts() {
        const classId = $('#product_class_id').val();
        if (!classId) return;

        const data = await useFetch({
            url: this._link,
            data: { opc: "getProductsByClass", class_id: classId }
        });

        $('#product_id').option_select({
            data: data.products,
            text: "name",
            value: "id",
            placeholder: "Seleccionar producto"
        });
    }

    handlePurchaseTypeChange() {
        const typeId = $('#purchase_type_id').val();
        
        $('#method_pay_id').closest('.col-12').addClass('d-none');
        $('#supplier_id').closest('.col-12').addClass('d-none');

        if (typeId == '2') {
            $('#method_pay_id').closest('.col-12').removeClass('d-none');
        } else if (typeId == '3') {
            $('#supplier_id').closest('.col-12').removeClass('d-none');
        }
    }

    calculateTotal() {
        const subtotal = parseFloat($('#subtotal').val() || 0);
        const tax = parseFloat($('#tax').val() || 0);
        const total = subtotal + tax;
        $('#total').val(total.toFixed(2));
    }
}

class ReportConcentrado extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "reporteConcentrado";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsReporte();
    }

    layout() {
        const container = $(`#container-reporte`);
        container.html(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📊 Concentrado de Compras</h2>
                <p class="text-gray-400">Reporte comparativo por clase de producto y día</p>
            </div>
            <div id="filterbar-reporte" class="mb-3 px-4"></div>
            <div id="tabla-reporte" class="px-4"></div>
        `);
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterbar-reporte",
            data: [
                {
                    opc: "select",
                    id: "udn_reporte",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: lsUdn,
                    onchange: 'reportConcentrado.lsReporte()'
                },
                {
                    opc: "select",
                    id: "purchase_type_reporte",
                    lbl: "Tipo de Compra",
                    class: "col-12 col-md-3",
                    data: lsPurchaseType,
                    onchange: 'reportConcentrado.lsReporte()'
                },
                {
                    opc: "input-calendar",
                    id: "calendar_reporte",
                    lbl: "Rango de Fechas",
                    class: "col-12 col-md-4"
                },
                {
                    opc: "button",
                    class: "col-12 col-md-2",
                    text: "📥 Exportar Excel",
                    onClick: () => this.exportExcel()
                }
            ]
        });

        dataPicker({
            parent: "calendar_reporte",
            onSelect: () => this.lsReporte()
        });
    }

    lsReporte() {
        const rangePicker = getDataRangePicker("calendar_reporte");
        const udn = $('#filterbar-reporte #udn_reporte').val();
        const purchaseType = $('#filterbar-reporte #purchase_type_reporte').val();

        this.createTable({
            parent: "tabla-reporte",
            idFilterBar: "filterbar-reporte",
            data: {
                opc: "lsReporte",
                udn: udn,
                purchase_type: purchaseType,
                fi: rangePicker.fi,
                ff: rangePicker.ff
            },
            coffeesoft: true,
            conf: { datatable: false, pag: 50 },
            attr: {
                id: "tbReporte",
                theme: 'corporativo',
                title: '📊 Concentrado de Compras',
                subtitle: 'Comparativa por clase de producto y día'
            }
        });
    }

    exportExcel() {
        const rangePicker = getDataRangePicker("calendar_reporte");
        const udn = $('#filterbar-reporte #udn_reporte').val();
        const purchaseType = $('#filterbar-reporte #purchase_type_reporte').val();

        window.open(
            `${api}?opc=exportExcel&udn=${udn}&purchase_type=${purchaseType}&fi=${rangePicker.fi}&ff=${rangePicker.ff}`,
            '_blank'
        );
    }
}
