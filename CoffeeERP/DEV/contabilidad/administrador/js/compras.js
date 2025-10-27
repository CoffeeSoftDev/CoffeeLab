let api = 'ctrl/ctrl-compras.php';
let app, proveedor;

let categorias, productos, proveedores, tiposCompra, formasPago;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    categorias = data.categorias;
    productos = data.productos;
    proveedores = data.proveedores;
    tiposCompra = data.tiposCompra;
    formasPago = data.formasPago;

    app = new App(api, "root");
    proveedor = new Proveedor(api, "root");
    
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
        this.renderTotales();
        this.lsCompras();
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#filterBar${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">🛒 Módulo de Compras</h2>
                <p class="text-gray-400">Gestiona las compras de la empresa por tipo: fondo fijo, corporativo y crédito.</p>
            </div>
            <div id="totalesCompras" class="px-4 pb-3"></div>
        `);

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "short",
            json: [
                {
                    id: "compras",
                    tab: "Compras",
                    class: "mb-1",
                    active: true,
                    onClick: () => this.lsCompras()
                },
                {
                    id: "proveedores",
                    tab: "Proveedores",
                    onClick: () => proveedor.lsProveedor()
                }
            ]
        });

        $('#content-tabs' + this.PROJECT_NAME).removeClass('h-screen');
    }


    filterBar() {
        const container = $(`#container-compras`);
        container.html('<div id="filterbar-compras" class="mb-2 px-4"></div><div id="tabla-compras" class="px-4"></div>');

        this.createfilterBar({
            parent: "filterbar-compras",
            data: [
                {
                    opc: "select",
                    id: "tipo_compra_filter",
                    lbl: "Filtrar por tipo",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Mostrar todas las compras" },
                        { id: "1", valor: "Compras de fondo fijo" },
                        { id: "2", valor: "Compras de corporativo" },
                        { id: "3", valor: "Compras a crédito" }
                    ],
                    onchange: 'app.lsCompras()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevaCompra",
                    text: "Registrar nueva compra",
                    onClick: () => this.addCompra()
                }
            ]
        });
    }

    lsCompras() {
        const tipoCompra = $('#tipo_compra_filter').val();
        
        this.createTable({
            parent: "tabla-compras",
            idFilterBar: "filterbar-compras",
            data: { 
                opc: 'lsCompras',
                tipo_compra_id: tipoCompra,
                udn: 1
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
                title: '📋 Lista de Compras',
                subtitle: 'Compras registradas en el sistema',
                center: [1, 2, 3],
                right: [4]
            },
            success: (data) => {
                if (data.totales) {
                    this.updateTotales(data.totales);
                }
            }
        });
    }


    jsonCompra() {
        return [
            {
                opc: "label",
                id: "lblProducto",
                text: "Información del Producto",
                class: "col-12 fw-bold text-lg mb-2 border-b p-1"
            },
            {
                opc: "select",
                id: "clase_insumo_id",
                lbl: "Categoría de producto",
                class: "col-12 col-md-6 mb-3",
                data: categorias,
                text: "valor",
                value: "id",
                required: true,
                onchange: "app.loadProductosByCategoria()"
            },
            {
                opc: "select",
                id: "insumo_id",
                lbl: "Producto",
                class: "col-12 col-md-6 mb-3",
                data: [],
                text: "valor",
                value: "id",
                required: true,
                disabled: true
            },
            {
                opc: "label",
                id: "lblCompra",
                text: "Datos de la Compra",
                class: "col-12 fw-bold text-lg mb-2 border-b p-1"
            },
            {
                opc: "select",
                id: "tipo_compra_id",
                lbl: "Tipo de compra",
                class: "col-12 col-md-6 mb-3",
                data: tiposCompra,
                text: "valor",
                value: "id",
                required: true
            },
            {
                opc: "select",
                id: "forma_pago_id",
                lbl: "Método de pago",
                class: "col-12 col-md-6 mb-3",
                data: formasPago,
                text: "valor",
                value: "id",
                required: true
            },
            {
                opc: "select",
                id: "proveedor_id",
                lbl: "Proveedor",
                class: "col-12 col-md-6 mb-3",
                data: proveedores,
                text: "valor",
                value: "id",
                required: true
            },
            {
                opc: "input",
                id: "numero_factura",
                lbl: "Número de factura / ticket",
                tipo: "texto",
                class: "col-12 col-md-6 mb-3",
                placeholder: "Ej: N/A, 12345"
            },
            {
                opc: "label",
                id: "lblFinanciero",
                text: "Información Financiera",
                class: "col-12 fw-bold text-lg mb-2 border-b p-1"
            },
            {
                opc: "input",
                id: "subtotal",
                lbl: "Subtotal",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                required: true,
                onkeyup: "validationInputForNumber('#subtotal'); app.calcularTotal()"
            },
            {
                opc: "input",
                id: "impuesto",
                lbl: "Impuesto",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                value: "0",
                onkeyup: "validationInputForNumber('#impuesto'); app.calcularTotal()"
            },
            {
                opc: "input",
                id: "total",
                lbl: "Total",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                disabled: true,
                value: "0"
            },
            {
                opc: "textarea",
                id: "descripcion",
                lbl: "Descripción de la compra (opcional)",
                rows: 3,
                class: "col-12 mb-3",
                placeholder: "Escribe una breve descripción de la compra..."
            },
            {
                opc: "btn-submit",
                id: "btnGuardarCompra",
                text: "Guardar compra",
                class: "col-12 col-md-3 offset-md-9"
            }
        ];
    }

    loadProductosByCategoria() {
        const categoriaId = $('#clase_insumo_id').val();
        
        if (!categoriaId) {
            $('#insumo_id').prop('disabled', true).html('<option value="">Seleccione una categoría primero</option>');
            return;
        }

        const productosFiltrados = productos.filter(p => p.clase_insumo_id == categoriaId);
        
        $('#insumo_id').prop('disabled', false).option_select({
            data: productosFiltrados,
            placeholder: "Seleccionar producto"
        });
    }

    calcularTotal() {
        const subtotal = parseFloat($('#subtotal').val()) || 0;
        const impuesto = parseFloat($('#impuesto').val()) || 0;
        const total = subtotal + impuesto;
        
        $('#total').val(total.toFixed(2));
    }


    addCompra() {
        this.createModalForm({
            id: 'formCompraAdd',
            data: { opc: 'addCompra', udn: 1 },
            bootbox: {
                title: '🛒 Nueva Compra',
                closeButton: true
            },
            json: this.jsonCompra(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        title: "Compra registrada",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsCompras();
                    this.renderTotales();
                } else {
                    alert({
                        icon: "error",
                        title: "Error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });

        setTimeout(() => {
            $("#lblProducto, #lblCompra, #lblFinanciero").addClass("border-b p-1");
        }, 100);
    }

    async editCompra(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCompra", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: "No se pudo cargar la información de la compra",
                btn1: true
            });
            return;
        }

        const compra = request.data;

        this.createModalForm({
            id: 'formCompraEdit',
            data: { opc: 'editCompra', id: id, udn: 1 },
            bootbox: {
                title: '✏️ Editar Compra',
                closeButton: true
            },
            autofill: compra,
            json: this.jsonCompra(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        title: "Compra actualizada",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsCompras();
                    this.renderTotales();
                } else {
                    alert({
                        icon: "error",
                        title: "Error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });

        setTimeout(() => {
            $("#lblProducto, #lblCompra, #lblFinanciero").addClass("border-b p-1");
            app.loadProductosByCategoria();
        }, 100);
    }


    async viewCompra(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCompra", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: "No se pudo cargar la información de la compra",
                btn1: true
            });
            return;
        }

        const compra = request.data;
        
        const categoria = categorias.find(c => c.id == compra.clase_insumo_id);
        const producto = productos.find(p => p.id == compra.insumo_id);
        const proveedor = proveedores.find(p => p.id == compra.proveedor_id);
        const tipoCompra = tiposCompra.find(t => t.id == compra.tipo_compra_id);
        const formaPago = formasPago.find(f => f.id == compra.forma_pago_id);

        bootbox.dialog({
            title: '👁️ Detalle de Compra',
            message: `
                <div class="p-3">
                    <div class="mb-4">
                        <h5 class="font-bold text-gray-700 mb-3">INFORMACIÓN DEL PRODUCTO</h5>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Categoría de producto</p>
                                <p class="font-semibold">${categoria ? categoria.valor : 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Producto</p>
                                <p class="font-semibold">${producto ? producto.valor : 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Tipo de compra</p>
                                <p class="font-semibold">${tipoCompra ? tipoCompra.valor : 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Método de pago</p>
                                <p class="font-semibold">${formaPago ? formaPago.valor : 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h5 class="font-bold text-gray-700 mb-3">INFORMACIÓN DE FACTURACIÓN</h5>
                        <div>
                            <p class="text-sm text-gray-500">Proveedor</p>
                            <p class="font-semibold">${proveedor ? proveedor.valor : 'N/A'}</p>
                        </div>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">Número de Ticket/Factura</p>
                            <p class="font-semibold">${compra.numero_factura || 'N/A'}</p>
                        </div>
                    </div>

                    ${compra.descripcion ? `
                    <div class="mb-4">
                        <h5 class="font-bold text-gray-700 mb-3">DESCRIPCIÓN</h5>
                        <p>${compra.descripcion}</p>
                    </div>
                    ` : ''}

                    <div class="mb-4">
                        <h5 class="font-bold text-gray-700 mb-3">RESUMEN FINANCIERO</h5>
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <p class="text-sm text-gray-500">Subtotal</p>
                                <p class="font-semibold text-lg">$ ${parseFloat(compra.subtotal).toFixed(2)}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Impuesto</p>
                                <p class="font-semibold text-lg">$ ${parseFloat(compra.impuesto).toFixed(2)}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Total</p>
                                <p class="font-semibold text-xl text-green-600">$ ${parseFloat(compra.total).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div class="text-sm text-gray-500 border-t pt-2">
                        <p>Fecha de operación: ${compra.fecha_operacion}</p>
                    </div>
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


    deleteCompra(id) {
        const row = event.target.closest('tr');
        const folio = row.querySelectorAll('td')[0]?.innerText || '';

        this.swalQuestion({
            opts: {
                title: `¿Está seguro?`,
                html: `¿Desea eliminar la compra con folio <strong>${folio}</strong>?<br>
                       Esta acción eliminará el registro de forma permanente.`,
                icon: "warning"
            },
            data: { opc: "deleteCompra", id: id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            title: "Eliminado",
                            text: response.message,
                            btn1: true
                        });
                        this.lsCompras();
                        this.renderTotales();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
                            btn1: true
                        });
                    }
                }
            }
        });
    }

    async renderTotales() {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getTotales", udn: 1 }
        });

        if (request.status === 200) {
            this.updateTotales(request.totales);
        }
    }

    updateTotales(totales) {
        this.infoCard({
            parent: "totalesCompras",
            theme: "light",
            json: [
                {
                    title: "Total de compras",
                    data: {
                        value: formatPrice(totales.total_general || 0),
                        color: "text-[#103B60]"
                    }
                },
                {
                    title: "Total compras de fondo fijo",
                    data: {
                        value: formatPrice(totales.total_fondo_fijo || 0),
                        color: "text-green-600"
                    }
                },
                {
                    title: "Total compras a crédito",
                    data: {
                        value: formatPrice(totales.total_credito || 0),
                        color: "text-orange-600"
                    }
                },
                {
                    title: "Total compras de corporativo",
                    data: {
                        value: formatPrice(totales.total_corporativo || 0),
                        color: "text-blue-600"
                    }
                }
            ]
        });
    }
}


// Proveedores

class Proveedor extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "proveedores";
    }

    filterBarProveedor() {
        const container = $(`#container-proveedores`);
        container.html('<div id="filterbar-proveedores" class="mb-2 px-4"></div><div id="tabla-proveedores" class="px-4"></div>');

        this.createfilterBar({
            parent: "filterbar-proveedores",
            data: [
                {
                    opc: "select",
                    id: "estado-proveedores",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'proveedor.lsProveedor()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoProveedor",
                    text: "Nuevo Proveedor",
                    onClick: () => this.addProveedor()
                }
            ]
        });
    }

    lsProveedor() {
        this.filterBarProveedor();
        
        this.createTable({
            parent: "tabla-proveedores",
            idFilterBar: "filterbar-proveedores",
            data: { 
                opc: 'lsProveedores',
                activo: $('#estado-proveedores').val() || 1
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
                title: '👥 Lista de Proveedores',
                subtitle: 'Proveedores registrados en el sistema',
                center: [4]
            }
        });
    }

    jsonProveedor() {
        return [
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre del proveedor",
                tipo: "texto",
                class: "col-12 mb-3",
                required: true
            },
            {
                opc: "input",
                id: "rfc",
                lbl: "RFC",
                tipo: "texto",
                class: "col-12 col-md-6 mb-3",
                maxlength: 13
            },
            {
                opc: "input",
                id: "telefono",
                lbl: "Teléfono",
                tipo: "tel",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "email",
                lbl: "Correo electrónico",
                tipo: "email",
                class: "col-12 mb-3"
            },
            {
                opc: "textarea",
                id: "direccion",
                lbl: "Dirección",
                rows: 3,
                class: "col-12 mb-3"
            },
            {
                opc: "btn-submit",
                id: "btnGuardarProveedor",
                text: "Guardar proveedor",
                class: "col-12 col-md-3 offset-md-9"
            }
        ];
    }


    addProveedor() {
        this.createModalForm({
            id: 'formProveedorAdd',
            data: { opc: 'addProveedor' },
            bootbox: {
                title: '👤 Nuevo Proveedor',
                closeButton: true
            },
            json: this.jsonProveedor(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        title: "Proveedor registrado",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsProveedor();
                    
                    useFetch({ url: api, data: { opc: "init" } }).then(data => {
                        proveedores = data.proveedores;
                    });
                } else {
                    alert({
                        icon: "error",
                        title: "Error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });
    }

    async editProveedor(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getProveedor", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: "No se pudo cargar la información del proveedor",
                btn1: true
            });
            return;
        }

        const proveedor = request.data;

        this.createModalForm({
            id: 'formProveedorEdit',
            data: { opc: 'editProveedor', id: id },
            bootbox: {
                title: '✏️ Editar Proveedor',
                closeButton: true
            },
            autofill: proveedor,
            json: this.jsonProveedor(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        title: "Proveedor actualizado",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsProveedor();
                    
                    useFetch({ url: api, data: { opc: "init" } }).then(data => {
                        proveedores = data.proveedores;
                    });
                } else {
                    alert({
                        icon: "error",
                        title: "Error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });
    }

    statusProveedor(id, estado) {
        const nuevoEstado = estado === 1 ? 0 : 1;
        const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';

        this.swalQuestion({
            opts: {
                title: `¿Está seguro?`,
                html: `¿Desea ${accion} este proveedor?`,
                icon: "warning"
            },
            data: { opc: "statusProveedor", id: id, activo: nuevoEstado },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.lsProveedor();
                        
                        useFetch({ url: api, data: { opc: "init" } }).then(data => {
                            proveedores = data.proveedores;
                        });
                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
                            btn1: true
                        });
                    }
                }
            }
        });
    }
}
