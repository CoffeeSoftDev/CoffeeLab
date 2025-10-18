
let clientes,analitycs;
let udnData = [];

const api = "ctrl/ctrl-clientes.php";

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udnData = data.udn;

    clientes  = new Clientes(api, "root");
    analitycs = new Analitycs(api, "root");

    clientes.render();
    analitycs.render();

});

class Clientes extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Clientes";
    }


    render() {
        this.layout();
        // this.filterBar();
        // this.ls();
    }


    layout() {

        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: '',
            card: {
                filterBar: { class: 'w-full my-2', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full h-full border rounded p-3', id: 'container' + this.PROJECT_NAME }
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
            class: '',
            type: "short",
            json: [
               
                {
                    id     : "capture",
                    tab    : "Captura de información",
                    active : true,
                    onClick: () => registerSocialNetWork.render()
                },
                {
                    id     : "analitycs",
                    tab    : "Analisis",
                    class  : "mb-1",
                    onClick: () => dashboardSocialNetwork.renderDashboard()
                },
              
            ]
        });


        // $('#content-tabs' + this.PROJECT_NAME).removeClass('h-screen');
    }

    layoutClients() {

        this.primaryLayout({
            parent: 'container-capture',
            id: this.PROJECT_NAME,
            class: '',
            card: {
                filterBar: { class: 'w-full my-2', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full h-full border rounded p-3', id: 'container' + this.PROJECT_NAME }
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
                center: [5, 6]
            }
        });
    }

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
                filterBar: { class: 'w-full my-3', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full my-3 h-full rounded-lg p-3', id: 'container' + this.PROJECT_NAME }
            }
        });

        // Agregar título y descripción
        $("#filterBar" + this.PROJECT_NAME).before(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📊 Comportamiento de Clientes</h2>
                <p class="text-gray-400">Análisis de frecuencia de compra, última visita y patrones de consumo.</p>
            </div>
        `);
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
                    onchange: 'comportamiento.ls()'
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
                    onchange: 'comportamiento.ls()'
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
                right: [9],  // Columna de acciones
                center: [3, 7, 8]  // Total Pedidos, Días sin Comprar, Frecuencia
            }
        });
    }


    async verDetalle(id) {
        // Obtener datos del cliente
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

        // Formatear nombre completo
        const nombreCompleto = `${cliente.nombre} ${cliente.apellido_paterno || ''} ${cliente.apellido_materno || ''}`.trim();

        // Badge VIP
        const badgeVIP = cliente.vip == 1 ? '<span class="badge bg-warning text-dark ms-2"><i class="icon-star"></i> VIP</span>' : '';

        // Calcular días como cliente
        const diasComoCliente = cliente.primera_compra 
            ? Math.floor((new Date() - new Date(cliente.primera_compra)) / (1000 * 60 * 60 * 24))
            : 0;

        // Generar HTML del historial
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
                    <div class="border-bottom pb-2 mb-2">
                        <div class="d-flex justify-content-between">
                            <span><strong>Pedido #${pedido.id}</strong></span>
                            <span class="text-success"><strong>$${parseFloat(pedido.monto).toFixed(2)}</strong></span>
                        </div>
                        <small class="text-muted">
                            ${fechaFormateada} • ${pedido.udn_nombre || 'N/A'} • 
                            ${pedido.envio_domicilio == 1 ? '🏠 Domicilio' : '🏪 Recoger'}
                        </small>
                    </div>
                `;
            });
        } else {
            historialHTML = '<p class="text-muted text-center py-3">No hay pedidos registrados</p>';
        }

        // Crear modal con información detallada
        bootbox.dialog({
            title: `<h4><i class="icon-chart-line"></i> Comportamiento de Cliente ${badgeVIP}</h4>`,
            message: `
                <div class="container-fluid">
                    <!-- Información del Cliente -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <h5 class="border-bottom pb-2">${nombreCompleto}</h5>
                            <p class="mb-1"><i class="icon-phone"></i> ${cliente.telefono}</p>
                            <p class="mb-1"><i class="icon-mail"></i> ${cliente.correo || 'No registrado'}</p>
                            <p class="mb-1"><i class="icon-building"></i> ${cliente.udn_nombre}</p>
                        </div>
                    </div>

                    <!-- Métricas Principales -->
                    <div class="row mb-4">
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card bg-primary text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-0">${cliente.total_pedidos || 0}</h3>
                                    <small>Total Pedidos</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card bg-success text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-0">$${parseFloat(cliente.monto_total || 0).toFixed(2)}</h3>
                                    <small>Monto Total</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card bg-info text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-0">$${parseFloat(cliente.ticket_promedio || 0).toFixed(2)}</h3>
                                    <small>Ticket Promedio</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card ${cliente.dias_sin_comprar > 60 ? 'bg-danger' : 'bg-warning'} text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-0">${cliente.dias_sin_comprar || 'N/A'}</h3>
                                    <small>Días sin Comprar</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Información Adicional -->
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">📅 Primera Compra</h6>
                                    <p class="mb-0">${cliente.primera_compra ? new Date(cliente.primera_compra).toLocaleDateString('es-MX') : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">🕒 Última Compra</h6>
                                    <p class="mb-0">${cliente.ultima_compra ? new Date(cliente.ultima_compra).toLocaleDateString('es-MX') : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Historial de Pedidos -->
                    <div class="row">
                        <div class="col-12">
                            <h6 class="border-bottom pb-2 mb-3">📋 Últimos 10 Pedidos</h6>
                            <div style="max-height: 300px; overflow-y: auto;">
                                ${historialHTML}
                            </div>
                        </div>
                    </div>
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

    /**
     * Muestra el top de clientes por monto
     */
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
