
let app, clientes, analitycs;
let udnData = [];

const api = "ctrl/ctrl-clientes.php";

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udnData = data.udn;

    app = new App(api, "root");
    clientes = new Clientes(api, "root");
    analitycs = new Analitycs(api, "root");

    app.render();
    clientes.render();
    analitycs.render();

});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Gestion";
    }


    render() {
        this.layout();
    }


    layout() {

        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: '',
            card: {
                filterBar: { class: 'w-full my-2', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full h-full p-2', id: 'container' + this.PROJECT_NAME }
            }
        });

        $("#filterBar" + this.PROJECT_NAME).html(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">👥 Gestión de Clientes</h2>
                <p class="text-gray-400">Administración de información y seguimiento de clientes de las unidades de negocio.</p>
            </div>
        `);

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            type: "short",
            json: [

                {
                    id: "capture",
                    tab: "Captura de información",
                    active: true,
                    onClick: () => clientes.ls()
                },
                {
                    id: "analitycs",
                    tab: "Estadisticas de clientes",
                    class: "mb-1",
                    onClick: () => analitycs.ls()
                },

            ]
        });


        $('#content-tabs' + this.PROJECT_NAME).removeClass('h-screen');
    }
}

class Clientes extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Clientes";
    }

    render() {
        this.layoutClients();
        this.filterBar();
        this.ls();
    }


    layoutClients() {

        this.primaryLayout({
            parent: 'container-capture',
            id: this.PROJECT_NAME,
            class: '',
            card: {
                filterBar: { class: 'w-full my-2', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full h-full ', id: 'container' + this.PROJECT_NAME }
            }
        });

    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            data: [
                {
                    opc: "select",
                    id: "udn_id",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-2",
                    data: [
                        { id: "all", valor: "Todas las unidades" },
                        ...udnData
                    ],
                    onchange: 'clientes.ls()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estatus",
                    class: "col-12 col-md-2",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'clientes.ls()'
                },
                {
                    opc: "select",
                    id: "vip",
                    lbl: "Tipo de Cliente",
                    class: "col-12 col-md-2",
                    data: [
                        { id: "all", valor: "Todos" },
                        { id: "1", valor: "VIP" },
                        { id: "0", valor: "Regular" }
                    ],
                    onchange: 'clientes.ls()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoCliente",
                    text: "Agregar Cliente",
                    onClick: () => this.addCliente()
                }
            ]
        });
    }

    ls() {
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "listClientes" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbClientes",
                theme: 'corporativo',
                right: [7],
                center: [5, 6, 7]
            }
        });
    }

    // Clients.

    addCliente() {
        this.createModalForm({
            id: 'formClienteAdd',
            data: { opc: 'addCliente' },
            bootbox: {
                title: 'Agregar Cliente',
                size: 'large'
            },
            json: this.jsonFormCliente(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else if (response.status === 409) {
                    alert({ icon: "warning", title: "Cliente Duplicado", text: response.message });
                } else if (response.status === 400) {
                    alert({ icon: "error", title: "Datos Inválidos", text: response.message });
                } else {
                    alert({ icon: "error", title: "Error", text: response.message });
                }
            }
        });
    }

    async editCliente(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getCliente",
                id: id
            }
        });

        if (request.status !== 200) {
            alert({ icon: "error", text: request.message });
            return;
        }

        const cliente = request.data;

        const autofillData = {
            ...cliente,
            ...(cliente.domicilio || {})
        };

        this.createModalForm({
            id: 'formClienteEdit',
            data: { opc: 'editCliente', id: cliente.id },
            bootbox: {
                title: '✏️ Editar Cliente',
                size: 'large'
            },
            autofill: autofillData,
            json: this.jsonFormCliente(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else if (response.status === 409) {
                    alert({ icon: "warning", title: "Teléfono Duplicado", text: response.message });
                } else if (response.status === 400) {
                    alert({ icon: "error", title: "Datos Inválidos", text: response.message });
                } else {
                    alert({ icon: "error", title: "Error", text: response.message });
                }
            }
        });
    }

    statusCliente(id, active) {
        const accion = active == 1 ? 'desactivar' : 'activar';
        const textoAccion = active == 1
            ? 'El cliente no estará disponible para nuevos pedidos.'
            : 'El cliente volverá a estar disponible para pedidos.';

        const nuevoEstado = active == 1 ? 0 : 1;

        this.swalQuestion({
            opts: {
                title: `¿Desea ${accion} este cliente?`,
                text: textoAccion,
                icon: "warning"
            },
            data: {
                opc: "statusCliente",
                active: nuevoEstado,
                id: id,
            },
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

    jsonFormCliente() {
        return [
            {
                opc: "div",
                class: "col-12 mb-3",
                html: '<h5 class="text-lg font-bold border-b pb-2">📋 Información Personal</h5>'
            },
            {
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de Negocio ",
                class: "col-12 col-md-4 mb-3",
                data: udnData,
                text: "valor",
                value: "id"
            },

            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre *",
                class: "col-12 col-md-4 mb-3",
                placeholder: "Ej: Juan"
            },
            {
                opc: "input",
                id: "apellido_paterno",
                lbl: "Apellido Paterno",
                class: "col-12 col-md-4 mb-3",
                placeholder: "Ej: Pérez"
            },
            {
                opc: "input",
                id: "apellido_materno",
                lbl: "Apellido Materno",
                class: "col-12 col-md-4 mb-3",
                placeholder: "Ej: García"
            },
            {
                opc: "div",
                class: "col-12 mb-3 mt-1",
                html: '<h5 class="text-lg font-bold border-b pb-2">📞 Información de Contacto</h5>'
            },
            {
                opc: "input",
                id: "telefono",
                lbl: "Teléfono *",
                tipo: "tel",
                class: "col-12 col-md-4 mb-3",
                placeholder: "10 dígitos",
                onkeyup: "validationInputForNumber('#telefono')"
            },
            {
                opc: "input",
                id: "correo",
                lbl: "Correo Electrónico",
                tipo: "email",
                class: "col-12 col-md-4 mb-3",
                placeholder: "ejemplo@correo.com"
            },
            {
                opc: "input",
                id: "fecha_cumpleaños",
                lbl: "Fecha de Cumpleaños",
                type: "date",
                class: "col-12 col-md-4 mb-3"
            },


            {
                opc: "div",
                class: "col-12 mt-2",
                html: '<p class="text-sm text-gray-500"><strong>*</strong> Campos obligatorios</p>'
            }
        ];
    }
}

class Analitycs extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Comportamiento";
    }

    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }


    layout() {

        this.primaryLayout({
            parent: 'container-analitycs',
            id: this.PROJECT_NAME,
            class: '',
            card: {
                filterBar: { class: 'w-full ', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full h-full ', id: 'container' + this.PROJECT_NAME }
            }
        });


    }


    filterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            data: [
                {
                    opc: "select",
                    id: "udn_id",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "all", valor: "Todas las unidades" },
                        ...udnData
                    ],
                    onchange: 'analitycs.ls()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estatus",
                    class: "col-12 col-md-2",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'analitycs.ls()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnTopClientes",
                    text: "🏆 Top Clientes",
                    onClick: () => this.showTopClientes()
                }
            ]
        });
    }


    ls() {
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "listComportamiento" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbComportamiento",
                theme: 'corporativo',
                title: '📊 Comportamiento de Clientes',
                subtitle: 'Análisis de frecuencia de compra, última visita y patrones de consumo.',
                right: [3, 4, 5, 6, 9],                                                                        // Columna de acciones
                center: [8]                                                                   // Total Pedidos, Días sin Comprar, Frecuencia
            }
        });
    }


    async verDetalle(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getComportamiento",
                id: id
            }
        });

        if (request.status !== 200) {
            alert({ icon: "error", text: request.message });
            return;
        }

        const data = request.data;
        const cliente = data.cliente;
        const historial = data.historial;

        const nombreCompleto = `${cliente.nombre} ${cliente.apellido_paterno || ''} ${cliente.apellido_materno || ''}`.trim();
        const iniciales = this.getInitials(nombreCompleto);

        const badgeVIP = cliente.vip == 1
            ? '<span class="px-2 py-1 rounded-md text-xs font-semibold bg-yellow-500 text-white ml-2"><i class="icon-star"></i> VIP</span>'
            : '';

        let historialHTML = '';
        if (historial && historial.length > 0) {
            historial.forEach(pedido => {
                const fechaPedido = new Date(pedido.fecha_pedido);
                const fechaFormateada = fechaPedido.toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                historialHTML += `
                    <div class="flex justify-between items-center p-3 border-b border-gray-200 hover:bg-gray-50 transition">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="font-semibold text-gray-800">Pedido #${pedido.id}</span>
                                <span class="text-xs px-2 py-1 rounded-full ${pedido.envio_domicilio == 1 ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}">
                                    ${pedido.envio_domicilio == 1 ? '🏠 Domicilio' : '🏪 Recoger'}
                                </span>
                            </div>
                            <div class="text-xs text-gray-500">
                                ${fechaFormateada} • ${pedido.udn_nombre || 'N/A'}
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-lg font-bold text-green-600">$${parseFloat(pedido.monto).toFixed(2)}</span>
                        </div>
                    </div>
                `;
            });
        } else {
            historialHTML = `
                <div class="flex flex-col items-center justify-center py-12 text-gray-400">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <i class="icon-inbox text-3xl"></i>
                    </div>
                    <p class="text-sm font-medium">No hay pedidos registrados</p>
                    <p class="text-xs">Los pedidos del cliente aparecerán aquí</p>
                </div>
            `;
        }

        bootbox.dialog({
            title: `
             <div class="bg-white">
                        <div class="flex items-center gap-4">
                            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-sm ">
                                ${iniciales}
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <h3 class="text-xl font-bold text-gray-800">${nombreCompleto}</h3>
                                    ${badgeVIP}
                                </div>
                                <div class="flex flex-wrap gap-3 text-sm text-gray-600">
                                    <span class="flex items-center gap-1">
                                        <i class="icon-phone "></i>
                                        ${cliente.telefono}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <i class="icon-mail "></i>
                                        ${cliente.correo || 'No registrado'}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <i class="icon-building "></i>
                                        ${cliente.udn_nombre}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
            `,
            message: `
                <div class="w-full bg-gray-50">
                    <!-- Header con Avatar -->
                   

                    <!-- Métricas Grid -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                        <div class="bg-blue-50 rounded p-3 border ">
                            <div class="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full mb-3 mx-auto">
                                <i class="icon-shopping-bag text-white text-sm"></i>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-blue-700">${cliente.total_pedidos || 0}</div>
                                <div class="text-xs text-blue-600 font-medium mt-1">TOTAL PEDIDOS</div>
                            </div>
                        </div>

                        <div class="bg-green-50 rounded p-3 border border-green-200">
                            <div class="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full mb-3 mx-auto">
                                <i class="icon-dollar text-white text-sm"></i>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-700">$${parseFloat(cliente.monto_total || 0).toFixed(2)}</div>
                                <div class="text-xs text-green-600 font-medium mt-1">MONTO TOTAL</div>
                            </div>
                        </div>

                        <div class="bg-cyan-50 rounded p-3 border border-cyan-200">
                            <div class="flex items-center justify-center w-10 h-10 bg-cyan-500 rounded-full mb-3 mx-auto">
                                <i class=" icon-user-3 text-white text-sm"></i>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-cyan-700">$${parseFloat(cliente.ticket_promedio || 0).toFixed(2)}</div>
                                <div class="text-xs text-cyan-600 font-medium mt-1">TICKET PROMEDIO</div>
                            </div>
                        </div>

                        <div class="bg-orange-50 ${cliente.dias_sin_comprar > 60 ? '' : ''} rounded-xl p-3 border">
                            <div class="flex items-center justify-center w-10 h-10 ${cliente.dias_sin_comprar > 60 ? 'bg-red-500' : 'bg-orange-500'} rounded-full mb-3 mx-auto">
                                <i class="icon-clock text-white text-sm"></i>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold ${cliente.dias_sin_comprar > 60 ? 'text-red-700' : 'text-orange-700'}">${cliente.dias_sin_comprar || 'N/A'}</div>
                                <div class="text-xs ${cliente.dias_sin_comprar > 60 ? 'text-red-600' : 'text-orange-600'} font-medium mt-1">DÍAS SIN COMPRAR</div>
                            </div>
                        </div>
                    </div>

                    <!-- Fechas -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
                        <div class="bg-white rounded p-4 border border-gray-200 ">
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                                    <i class="icon-calendar text-blue-600"></i>
                                </div>
                                <div>
                                    <div class="text-xs text-gray-500 font-medium">🔵 Primera Compra</div>
                                    <div class="text-sm font-semibold text-gray-800">${cliente.primera_compra ? new Date(cliente.primera_compra).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin registro de compras'}</div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded p-4 border border-gray-200 ">
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                                    <i class="icon-clock text-purple-600"></i>
                                </div>
                                <div>
                                    <div class="text-xs text-gray-500 font-medium">🟣 Última Compra</div>
                                    <div class="text-sm font-semibold text-gray-800">${cliente.ultima_compra ? new Date(cliente.ultima_compra).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin registro de compras'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Historial -->
                    <div class="px-6 pb-6">
                        <div class="bg-white rounded border border-gray-200  overflow-hidden">
                            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div class="flex items-center gap-2">
                                    <i class="icon-list text-gray-600"></i>
                                    <h6 class="font-semibold text-gray-800">Últimos 10 Pedidos</h6>
                                </div>
                            </div>
                            <div class="max-h-80 overflow-y-auto">
                                ${historialHTML}
                            </div>
                        </div>
                    </div>
                </div>
            `,
            size: 'large',
            closeButton: true,
            buttons: {
                close: {
                    label: '<i class="icon-x mr-1"></i> Cerrar',
                    className: 'btn-secondary'
                }
            }
        });
    }

    getInitials(name) {
        const nameParts = name.trim().split(' ');
        if (nameParts.length >= 2) {
            return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    async showTopClientes() {
        const udnId = $("#udn_id").val();

        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getTopClientes",
                limit: 10,
                udn_id: udnId
            }
        });

        if (request.status !== 200) {
            alert({ icon: "error", text: "Error al obtener top clientes" });
            return;
        }

        const topClientes = request.data;

        let topHTML = '';
        if (topClientes && topClientes.length > 0) {
            topClientes.forEach((cliente, index) => {
                const nombreCompleto = `${cliente.nombre} ${cliente.apellido_paterno || ''} ${cliente.apellido_materno || ''}`.trim();
                const badgeVIP = cliente.vip == 1 ? '<span class="badge bg-warning text-dark ms-2"><i class="icon-star"></i> VIP</span>' : '';
                const medalIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

                topHTML += `
                    <div class="border-bottom pb-3 mb-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">${medalIcon} ${nombreCompleto} ${badgeVIP}</h6>
                                <small class="text-muted">
                                    ${cliente.udn_nombre} • ${cliente.total_pedidos} pedidos • 
                                    Última compra: ${cliente.ultima_compra ? new Date(cliente.ultima_compra).toLocaleDateString('es-MX') : 'N/A'}
                                </small>
                            </div>
                            <div class="text-end">
                                <h5 class="mb-0 text-success">$${parseFloat(cliente.monto_total).toFixed(2)}</h5>
                                <small class="text-muted">Ticket: $${parseFloat(cliente.ticket_promedio).toFixed(2)}</small>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            topHTML = '<p class="text-muted text-center py-3">No hay datos disponibles</p>';
        }

        bootbox.dialog({
            title: '<h4><i class="icon-trophy"></i> Top 10 Clientes por Monto Total</h4>',
            message: `
                <div class="container-fluid">
                    ${topHTML}
                </div>
            `,
            size: 'large',
            buttons: {
                close: {
                    label: 'Cerrar',
                    className: 'btn-secondary'
                }
            }
        });
    }
}
