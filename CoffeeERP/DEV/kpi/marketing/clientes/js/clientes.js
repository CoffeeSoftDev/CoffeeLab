
let clientes;
let udnData = [];

const api = "ctrl/ctrl-clientes.php";

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udnData = data.udn;

    clientes = new Clientes(api, "root");
    clientes.render();
});


class Clientes extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Clientes";
    }


    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }


    layout() {
        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: '',
            card: {
                filterBar: { class: 'w-full my-2 border rounded p-3', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full h-full border rounded p-3', id: 'container' + this.PROJECT_NAME }
            }
        });

        $("#filterBar" + this.PROJECT_NAME).before(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">👥 Gestión de Clientes</h2>
                <p class="text-gray-400">Administración de información y seguimiento de clientes de las unidades de negocio.</p>
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
