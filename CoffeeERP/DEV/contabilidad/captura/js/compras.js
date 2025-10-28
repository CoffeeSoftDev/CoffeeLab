// let api = 'ctrl/ctrl-compras.php';
// let app, adminPurchase;

// let purchaseTypes, methodPay, udn, productClass, suppliers, products;

// $(async () => {
//     const data          = await useFetch({ url: api, data: { opc: "init" } });
//           purchaseTypes = data.purchaseTypes;
//           methodPay     = data.methodPay;
//           udn           = data.udn;
//           productClass  = data.productClass;

//     app = new App(api, "root");
//     adminPurchase = new AdminPurchase(api, "root");

//     app.render();
// });

class Compras extends Templates {
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
            parent: "container-compras",
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full mb-3', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">🛒 Módulo de Compras</h2>
                <p class="text-gray-400">Gestiona las compras realizadas por la empresa</p>
            </div>
        `);

        // this.tabLayout({
        //     parent: `container${this.PROJECT_NAME}`,
        //     id: `tabs${this.PROJECT_NAME}`,
        //     theme: "light",
        //     type: "short",
        //     json: [
        //         {
        //             id: "compras",
        //             tab: "Compras",
        //             active: true,
        //             onClick: () => this.ls()
        //         },
        //         {
        //             id: "administrador",
        //             tab: "Administrador",
        //             onClick: () => adminPurchase.render()
        //         }
        //     ]
        // });

        // $(`#content-tabs${this.PROJECT_NAME}`).removeClass('h-screen');
    }

    filterBar() {
        const container = $(`#container-compras`);
        container.html(`
            <div id="summary-cards" class="mb-4"></div>
            <div id="filterbar-compras" class="mb-2"></div>
            <div id="tabla-compras"></div>
        `);

        this.createfilterBar({
            parent: "filterbar-compras",
            data: [
              
                {
                    opc      : "button",
                    class    : "col-12 col-md-2",
                    className: 'w-100',
                    color_btn: 'success',
                    id       : "btnSubirArchivos",
                    text     : "Subir archivos",
                    onClick  : () => console.log("Subir archivos")
                },
                {
                    opc      : "button",
                    class    : "col-12 col-md-2",
                    id       : "btnNuevaCompra",
                    className: 'w-100',
                    text     : "Registrar nueva compra",
                    onClick  : () => this.addPurchase()
                },
                {
                    opc  : "select",
                    id   : "purchase_type_filter",
                    lbl  : "Filtrar por tipo",
                    class: "col-12 col-md-3",
                    data : [
                        { id: "", valor: "Mostrar todas las compras" },
                        ...purchaseTypes
                    ],
                    onchange: 'app.ls()'
                },
            ]
        });
    }


    async ls() {
        const response = await useFetch({
            url: this._link,
            data: {
                opc: 'ls',
                udn: 1,
                purchase_type_filter: $('#purchase_type_filter').val() || null
            }
        });

        this.showSummaryCards(response.totals);

        this.createTable({
            parent: "tabla-compras",
            idFilterBar: "filterbar-compras",
            data: { opc: 'ls', udn: 1 },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbCompras",
                theme: 'corporativo',
                title: 'Lista de Compras',
                subtitle: 'Compras registradas en el sistema',
                center: [1, 4],
                right: [5]
            }
        });
    }

    showSummaryCards(totals) {
        this.infoCard({
            parent: 'summary-cards',
            theme: 'light',
            json: [
                {
                    title: 'Total de compras',
                    data: {
                        value: formatPrice(totals.general) ?? 13826.13,
                        color: 'text-[#103B60]'
                    }
                },
                {
                    title: 'Total compras de fondo fijo',
                    data: {
                        value: formatPrice(totals.fondoFijo) ?? 1635.31,
                        color: 'text-[#8CC63F]'
                    }
                },
                {
                    title: 'Total compras a crédito',
                    data: {
                        value: formatPrice(totals.credito) ?? 2758.12,
                        color: 'text-orange-600'
                    }
                },
                {
                    title: 'Total compras de corporativo',
                    data: {
                        value: formatPrice(totals.corporativo) ?? 9432.70,
                        color: 'text-blue-600'
                    }
                }
            ]
        });
    }

    addPurchase() {
        this.createModalForm({
            id: 'formPurchaseAdd',
            data: { opc: 'addPurchase', udn_id: 1 },
            bootbox: {
                title: 'Registrar Nueva Compra',
                closeButton: true
            },
            json: this.jsonPurchase(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message
                    });
                    this.ls();
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });

        this.setupPurchaseFormEvents();
    }


    async editPurchase(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getPurchase", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message
            });
            return;
        }

        const purchase = request.data;

        this.createModalForm({
            id: 'formPurchaseEdit',
            data: { opc: 'editPurchase', id: id },
            bootbox: {
                title: 'Editar Compra',
                closeButton: true
            },
            autofill: purchase,
            json: this.jsonPurchase(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message
                    });
                    this.ls();
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });

        this.setupPurchaseFormEvents();
    }

    deletePurchase(id) {
        const row = event.target.closest('tr');
        const folio = row.querySelectorAll('td')[0]?.innerText || '';

        this.swalQuestion({
            opts: {
                title: "¿Eliminar compra?",
                html: `¿Estás seguro de eliminar la compra <strong>${folio}</strong>?<br>Esta acción no se puede deshacer.`,
                icon: "warning"
            },
            data: { opc: "deletePurchase", id: id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message
                        });
                        this.ls();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message
                        });
                    }
                }
            }
        });
    }

    async viewPurchase(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getPurchase", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message
            });
            return;
        }

        const purchase = request.data;

        this.detailCard({
            parent: "root",
            title: "Detalle de Compra",
            class: "cols-2",
            data: [
                { text: "Folio", value: '#' + String(purchase.id).padStart(6, '0'), icon: "icon-tag" },
                { text: "Categoría de producto", value: purchase.product_class_name, icon: "icon-folder" },
                { text: "Producto", value: purchase.product_name, icon: "icon-box" },
                { text: "Tipo de compra", value: purchase.purchase_type_name, icon: "icon-shopping-cart" },
                { text: "Método de pago", value: purchase.method_pay_name, icon: "icon-credit-card" },
                { text: "Proveedor", value: purchase.supplier_name || "N/A", icon: "icon-user" },
                { text: "Subtotal", value: formatPrice(purchase.subtotal), icon: "icon-dollar-sign" },
                { text: "Impuesto", value: formatPrice(purchase.tax), icon: "icon-percent" },
                { text: "Total", value: formatPrice(purchase.total), icon: "icon-dollar-sign", color: "text-green-600" },
                { text: "Fecha de operación", value: purchase.operation_date, icon: "icon-calendar" },
                { type: "observacion", text: "Descripción", value: purchase.description || "Sin descripción" }
            ]
        });
    }


    jsonPurchase() {
        return [
            {
                opc: "label",
                id: "lblProductInfo",
                text: "Información del Producto",
                class: "col-12 fw-bold text-lg mb-2  p-1"
            },
            {
                opc: "select",
                id: "product_class_id",
                lbl: "Categoría de producto",
                class: "col-12 col-md-6 mb-3",
                data: productClass,
                required: true,
                onchange: "app.loadProducts()"
            },
            {
                opc: "select",
                id: "product_id",
                lbl: "Producto",
                class: "col-12 col-md-6 mb-3",
                data: [],
                required: true
            },
            {
                opc: "label",
                id: "lblPurchaseInfo",
                text: "Información de la Compra",
                class: "col-12 fw-bold text-lg mb-2 mt-2 p-1"
            },
            {
                opc: "select",
                id: "purchase_type_id",
                lbl: "Tipo de compra",
                class: "col-12 col-md-6 mb-3",
                data: purchaseTypes,
                required: true
            },
            {
                opc: "select",
                id: "method_pay_id",
                lbl: "Método de pago",
                class: "col-12 col-md-6 mb-3",
                data: methodPay,
                required: true
            },
            {
                opc: "select",
                id: "supplier_id",
                lbl: "Proveedor",
                class: "col-12 col-md-6 mb-3",
                data: [],
                required: false
            },
            {
                opc: "input",
                id: "subtotal",
                lbl: "Subtotal",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                required: true,
                onkeyup: "validationInputForNumber('#subtotal'); app.calculateTotal()"
            },
            {
                opc: "input",
                id: "tax",
                lbl: "Impuesto",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                required: false,
                onkeyup: "validationInputForNumber('#tax'); app.calculateTotal()"
            },
            {
                opc: "input",
                id: "total_display",
                lbl: "Total",
                tipo: "texto",
                class: "col-12 col-md-6 mb-3",
                readonly: true,
                disabled: true
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción de la compra",
                rows: 3,
                class: "col-12 mb-3",
                required: false
            }
        ];
    }

    async loadProducts() {
        const productClassId = $('#product_class_id').val();
        if (!productClassId) {
            $('#product_id').html('<option value="">Seleccione una categoría primero</option>');
            return;
        }

        const products = await useFetch({
            url: this._link,
            data: {
                opc: 'getProductsByClass',
                product_class_id: productClassId
            }
        });

        $('#product_id').option_select({
            data: products,
            placeholder: "Seleccionar producto"
        });
    }

    calculateTotal() {
        const subtotal = parseFloat($('#subtotal').val()) || 0;
        const tax = parseFloat($('#tax').val()) || 0;
        const total = subtotal + tax;
        $('#total_display').val(formatPrice(total));
    }

    setupPurchaseFormEvents() {
        setTimeout(() => {
            $('#lblProductInfo').addClass('border-b p-1');
            $('#lblPurchaseInfo').addClass('border-b p-1');
            this.calculateTotal();
        }, 100);
    }


    // Components.

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
            ? "bg-[#1F2A37] text-white border rounded "
            : "bg-white text-gray-800  border rounded";
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
                class: `text-2xl font-bold ${card.data?.color || "text-gray-800"}`,
                text: card.data?.value
            });
            box.append(title, value);
            return box;
        };

        const container = $("<div>", {
            id: opts.id,
            class: `grid grid-cols-2 md:grid-cols-5 gap-4 ${opts.class}`
        });

        opts.json.forEach((item, i) => {
            container.append(renderCard(item, i));
        });

        $(`#${opts.parent}`).html(container);
    }
}


class AdminPurchase extends Compras {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    render() {
        const container = $('#container-administrador');
        container.html(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">⚙️ Administrador</h2>
                <p class="text-gray-400">Gestiona categorías, productos y proveedores</p>
            </div>
        `);

        this.tabLayout({
            parent: 'container-administrador',
            id: 'tabsAdmin',
            theme: 'light',
            type: 'short',
            json: [
                {
                    id: 'categorias',
                    tab: 'Categorías',
                    active: true,
                    onClick: () => this.lsProductClass()
                },
                {
                    id: 'productos',
                    tab: 'Productos',
                    onClick: () => this.lsProducts()
                },
                {
                    id: 'proveedores',
                    tab: 'Proveedores',
                    onClick: () => this.lsSuppliers()
                }
            ]
        });

        this.lsProductClass();
    }

    filterBarProductClass() {
        const container = $('#container-categorias');
        container.html('<div id="filterbar-categorias" class="mb-2"></div><div id="tabla-categorias"></div>');

        this.createfilterBar({
            parent: 'filterbar-categorias',
            data: [
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'adminPurchase.lsProductClass()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevaCategoria",
                    text: "Nueva Categoría",
                    onClick: () => this.addProductClass()
                }
            ]
        });
    }

    lsProductClass() {
        this.filterBarProductClass();

        this.createTable({
            parent: 'tabla-categorias',
            idFilterBar: 'filterbar-categorias',
            data: { opc: 'lsProductClass', udn: 1 },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbProductClass',
                theme: 'light',
                title: 'Categorías de Productos',
                subtitle: 'Cuentas mayores contables',
                center: [3]
            }
        });
    }

    addProductClass() {
        this.createModalForm({
            id: 'formProductClassAdd',
            data: { opc: 'addProductClass', udn_id: 1 },
            bootbox: {
                title: 'Agregar Categoría',
                closeButton: true
            },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la categoría",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3",
                    rows: 3
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsProductClass();
                } else {
                    alert({ icon: "error", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }


    async editProductClass(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getProductClass", id: id }
        });

        if (request.status !== 200) {
            alert({ icon: "error", text: request.message });
            return;
        }

        const productClass = request.data;

        this.createModalForm({
            id: 'formProductClassEdit',
            data: { opc: 'editProductClass', id: id },
            bootbox: {
                title: 'Editar Categoría',
                closeButton: true
            },
            autofill: productClass,
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre de la categoría",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3",
                    rows: 3
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsProductClass();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    statusProductClass(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Cambiar estado?",
                text: "Esta acción cambiará el estado de la categoría",
                icon: "warning"
            },
            data: { opc: "statusProductClass", id: id, active: active === 1 ? 0 : 1 },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsProductClass();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    filterBarProducts() {
        const container = $('#container-productos');
        container.html('<div id="filterbar-productos" class="mb-2"></div><div id="tabla-productos"></div>');

        this.createfilterBar({
            parent: 'filterbar-productos',
            data: [
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'adminPurchase.lsProducts()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoProducto",
                    text: "Nuevo Producto",
                    onClick: () => this.addProduct()
                }
            ]
        });
    }

    lsProducts() {
        this.filterBarProducts();

        this.createTable({
            parent: 'tabla-productos',
            idFilterBar: 'filterbar-productos',
            data: { opc: 'lsProducts' },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbProducts',
                theme: 'light',
                title: 'Productos',
                subtitle: 'Subcuentas contables',
                center: [4]
            }
        });
    }

    addProduct() {
        this.createModalForm({
            id: 'formProductAdd',
            data: { opc: 'addProduct' },
            bootbox: {
                title: 'Agregar Producto',
                closeButton: true
            },
            json: [
                {
                    opc: "select",
                    id: "product_class_id",
                    lbl: "Categoría",
                    class: "col-12 mb-3",
                    data: productClass,
                    required: true
                },
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del producto",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3",
                    rows: 3
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsProducts();
                } else {
                    alert({ icon: "error", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }


    async editProduct(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getProduct", id: id }
        });

        if (request.status !== 200) {
            alert({ icon: "error", text: request.message });
            return;
        }

        const product = request.data;

        this.createModalForm({
            id: 'formProductEdit',
            data: { opc: 'editProduct', id: id },
            bootbox: {
                title: 'Editar Producto',
                closeButton: true
            },
            autofill: product,
            json: [
                {
                    opc: "select",
                    id: "product_class_id",
                    lbl: "Categoría",
                    class: "col-12 mb-3",
                    data: productClass,
                    required: true
                },
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del producto",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3",
                    rows: 3
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsProducts();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    statusProduct(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Cambiar estado?",
                text: "Esta acción cambiará el estado del producto",
                icon: "warning"
            },
            data: { opc: "statusProduct", id: id, active: active === 1 ? 0 : 1 },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsProducts();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    filterBarSuppliers() {
        const container = $('#container-proveedores');
        container.html('<div id="filterbar-proveedores" class="mb-2"></div><div id="tabla-proveedores"></div>');

        this.createfilterBar({
            parent: 'filterbar-proveedores',
            data: [
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'adminPurchase.lsSuppliers()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoProveedor",
                    text: "Nuevo Proveedor",
                    onClick: () => this.addSupplier()
                }
            ]
        });
    }

    lsSuppliers() {
        this.filterBarSuppliers();

        this.createTable({
            parent: 'tabla-proveedores',
            idFilterBar: 'filterbar-proveedores',
            data: { opc: 'lsSuppliers', udn: 1 },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbSuppliers',
                theme: 'light',
                title: 'Proveedores',
                subtitle: 'Proveedores registrados',
                center: [6],
                right: [5]
            }
        });
    }

    addSupplier() {
        this.createModalForm({
            id: 'formSupplierAdd',
            data: { opc: 'addSupplier', udn_id: 1 },
            bootbox: {
                title: 'Agregar Proveedor',
                closeButton: true
            },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del proveedor",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "input",
                    id: "rfc",
                    lbl: "RFC",
                    class: "col-12 col-md-6 mb-3"
                },
                {
                    opc: "input",
                    id: "phone",
                    lbl: "Teléfono",
                    class: "col-12 col-md-6 mb-3"
                },
                {
                    opc: "input",
                    id: "email",
                    lbl: "Email",
                    tipo: "email",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsSuppliers();
                } else {
                    alert({ icon: "error", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editSupplier(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getSupplier", id: id }
        });

        if (request.status !== 200) {
            alert({ icon: "error", text: request.message });
            return;
        }

        const supplier = request.data;

        this.createModalForm({
            id: 'formSupplierEdit',
            data: { opc: 'editSupplier', id: id },
            bootbox: {
                title: 'Editar Proveedor',
                closeButton: true
            },
            autofill: supplier,
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del proveedor",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "input",
                    id: "rfc",
                    lbl: "RFC",
                    class: "col-12 col-md-6 mb-3"
                },
                {
                    opc: "input",
                    id: "phone",
                    lbl: "Teléfono",
                    class: "col-12 col-md-6 mb-3"
                },
                {
                    opc: "input",
                    id: "email",
                    lbl: "Email",
                    tipo: "email",
                    class: "col-12 mb-3"
                },
                {
                    opc: "input",
                    id: "balance",
                    lbl: "Saldo actual",
                    tipo: "cifra",
                    class: "col-12 mb-3",
                    readonly: true
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsSuppliers();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    statusSupplier(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Cambiar estado?",
                text: "Esta acción cambiará el estado del proveedor",
                icon: "warning"
            },
            data: { opc: "statusSupplier", id: id, active: active === 1 ? 0 : 1 },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsSuppliers();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }
}
