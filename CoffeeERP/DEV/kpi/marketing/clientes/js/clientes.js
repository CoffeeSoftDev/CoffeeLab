/**
 * Módulo JavaScript - Gestión de Clientes
 * Sistema: KPI / Marketing - CoffeeSoft ERP
 * 
 * Este módulo maneja toda la interfaz de usuario para la gestión de clientes,
 * incluyendo listado, creación, edición y cambio de estatus
 */

let clientes;
let udnData = [];

const api = "ctrl/ctrl-clientes.php";

// Inicialización del módulo
$(async () => {
    // Cargar datos iniciales
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udnData = data.udn;

    // Inicializar módulo
    clientes = new Clientes(api, "root");
    clientes.render();
});

/**
 * Clase principal del módulo de Gestión de Clientes
 * Extiende de Templates para usar componentes de CoffeeSoft
 */
class Clientes extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Clientes";
    }

    /**
     * Renderiza el módulo completo
     */
    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }

    /**
     * Crea la estructura principal del layout
     */
    layout() {
        this.primaryLayout({
            parent: 'root',
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
                <h2 class="text-2xl font-semibold">👥 Gestión de Clientes</h2>
                <p class="text-gray-400">Administración de información y seguimiento de clientes de las unidades de negocio.</p>
            </div>
        `);
    }

    /**
     * Crea la barra de filtros con opciones de búsqueda
     */
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
                    text: "➕ Agregar Cliente",
                    onClick: () => this.addCliente()
                }
            ]
        });
    }

    /**
     * Lista los clientes en una tabla dinámica
     */
    ls() {
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "listClientes" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbClientes",
                theme: 'light',
                right: [7],  // Columna de acciones a la derecha
                center: [5, 6]  // Columnas de Estatus y VIP centradas
            }
        });
    }

    /**
     * Abre el formulario para agregar un nuevo cliente
     */
    addCliente() {
        this.createModalForm({
            id: 'formClienteAdd',
            data: { opc: 'addCliente' },
            bootbox: {
                title: '➕ Agregar Cliente',
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

    /**
     * Abre el formulario para editar un cliente existente
     * @param {number} id - ID del cliente a editar
     */
    async editCliente(id) {
        // Obtener datos del cliente
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

        // Preparar datos para autofill (incluir domicilio si existe)
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

    /**
     * Cambia el estatus de un cliente (activo/inactivo)
     * @param {number} id - ID del cliente
     * @param {number} active - Estatus actual (1 = activo, 0 = inactivo)
     */
    statusCliente(id, active) {
        const accion = active == 1 ? 'desactivar' : 'activar';
        const textoAccion = active == 1 
            ? 'El cliente no estará disponible para nuevos pedidos.' 
            : 'El cliente volverá a estar disponible para pedidos.';

        this.swalQuestion({
            opts: {
                title: `¿Desea ${accion} este cliente?`,
                text: textoAccion,
                icon: "warning"
            },
            data: {
                opc: "statusCliente",
                id: id,
                active: active
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

    /**
     * Define la estructura del formulario de cliente
     * @returns {Array} JSON con la configuración del formulario
     */
    jsonFormCliente() {
        return [
            // Sección: Información Personal
            {
                opc: "div",
                class: "col-12 mb-3",
                html: '<h5 class="text-lg font-semibold border-b pb-2">📋 Información Personal</h5>'
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

            // Sección: Información de Contacto
            {
                opc: "div",
                class: "col-12 mb-3 mt-2",
                html: '<h5 class="text-lg font-semibold border-b pb-2">📞 Información de Contacto</h5>'
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
                tipo: "date",
                class: "col-12 col-md-4 mb-3"
            },

            // Sección: Clasificación
            {
                opc: "div",
                class: "col-12 mb-3 mt-2",
                html: '<h5 class="text-lg font-semibold border-b pb-2">🏢 Clasificación</h5>'
            },
            {
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de Negocio *",
                class: "col-12 col-md-6 mb-3",
                data: udnData,
                text: "valor",
                value: "id"
            },
            {
                opc: "checkbox",
                id: "vip",
                lbl: "⭐ Cliente VIP",
                class: "col-12 col-md-6 mb-3 d-flex align-items-center",
                value: 1
            },

            // Sección: Domicilio
            {
                opc: "div",
                class: "col-12 mb-3 mt-2",
                html: '<h5 class="text-lg font-semibold border-b pb-2">🏠 Domicilio de Entrega</h5>'
            },
            {
                opc: "input",
                id: "calle",
                lbl: "Calle *",
                class: "col-12 col-md-8 mb-3",
                placeholder: "Ej: Av. Constituyentes"
            },
            {
                opc: "input",
                id: "numero_exterior",
                lbl: "Número Exterior",
                class: "col-12 col-md-2 mb-3",
                placeholder: "123"
            },
            {
                opc: "input",
                id: "numero_interior",
                lbl: "Número Interior",
                class: "col-12 col-md-2 mb-3",
                placeholder: "Depto 3"
            },
            {
                opc: "input",
                id: "colonia",
                lbl: "Colonia",
                class: "col-12 col-md-4 mb-3",
                placeholder: "Ej: Centro"
            },
            {
                opc: "input",
                id: "ciudad",
                lbl: "Ciudad",
                class: "col-12 col-md-4 mb-3",
                placeholder: "Ej: Querétaro"
            },
            {
                opc: "input",
                id: "estado",
                lbl: "Estado",
                class: "col-12 col-md-4 mb-3",
                placeholder: "Ej: Querétaro"
            },
            {
                opc: "input",
                id: "codigo_postal",
                lbl: "Código Postal",
                class: "col-12 col-md-4 mb-3",
                placeholder: "76000"
            },
            {
                opc: "textarea",
                id: "referencias",
                lbl: "Referencias",
                class: "col-12 mb-3",
                placeholder: "Ej: Casa blanca con portón negro, frente al parque",
                rows: 2
            },

            // Nota informativa
            {
                opc: "div",
                class: "col-12 mt-2",
                html: '<p class="text-sm text-gray-500"><strong>*</strong> Campos obligatorios</p>'
            }
        ];
    }
}
