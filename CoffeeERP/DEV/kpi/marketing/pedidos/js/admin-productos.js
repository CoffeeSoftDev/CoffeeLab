let adminProductos;
let lsudn;

$(async () => {
    const api = 'ctrl/ctrl-admin-productos.php';
    
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsudn = data.udn;

    adminProductos = new AdminProductos(api, "root");
});

class AdminProductos extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "AdminProductos";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsProductos();
    }

    layout() {
        this.primaryLayout({
            parent: `container-productos`,
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#container${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📦 Administrador de Productos</h2>
                <p class="text-gray-400">Gestiona los productos asociados a cada unidad de negocio.</p>
            </div>
        `);
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: lsudn,
                    onchange: 'adminProductos.lsProductos()'
                },
                {
                    opc: "select",
                    id: "estado-productos",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Disponibles" },
                        { id: "0", valor: "No disponibles" }
                    ],
                    onchange: 'adminProductos.lsProductos()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoProducto",
                    text: "Nuevo Producto",
                    onClick: () => this.addProducto(),
                },
            ],
        });
    }

    lsProductos() {
        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "lsProductos" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tbProductos`,
                theme: 'corporativo',
                title: 'Lista de Productos',
                subtitle: 'Productos registrados en el sistema',
                center: [3, 5],
                right: [6]
            },
        });
    }

    addProducto() {
        this.createModalForm({
            id: 'formProductoAdd',
            data: { opc: 'addProducto' },
            bootbox: {
                title: 'Agregar Producto',
            },
            json: this.jsonProducto(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsProductos();
                } else {
                    alert({ 
                        icon: response.status === 409 ? "warning" : "error", 
                        title: "Oops!...", 
                        text: response.message, 
                        btn1: true, 
                        btn1Text: "Ok" 
                    });
                }
            }
        });
    }

    async editProducto(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getProducto",
                id: id,
            },
        });

        if (request.status !== 200) {
            alert({ 
                icon: "error", 
                text: request.message, 
                btn1: true, 
                btn1Text: "Ok" 
            });
            return;
        }

        const producto = request.data;

        this.createModalForm({
            id: 'formProductoEdit',
            data: { opc: 'editProducto', id: producto.id },
            bootbox: {
                title: 'Editar Producto',
            },
            autofill: producto,
            json: this.jsonProducto(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsProductos();
                } else {
                    alert({ 
                        icon: "error", 
                        title: "Oops!...", 
                        text: response.message, 
                        btn1: true, 
                        btn1Text: "Ok" 
                    });
                }
            }
        });
    }

    statusProducto(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Desea cambiar el estado del Producto?",
                text: "Esta acción ocultará o reactivará el producto.",
                icon: "warning",
            },
            data: {
                opc: "statusProducto",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsProductos();
                    } else {
                        alert({ 
                            icon: "error", 
                            text: response.message, 
                            btn1: true, 
                            btn1Text: "Ok" 
                        });
                    }
                },
            },
        });
    }

    jsonProducto() {
        return [
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre del Producto",
                class: "col-12 mb-3",
                required: true
            },
            {
                opc: "textarea",
                id: "descripcion",
                lbl: "Descripción",
                class: "col-12 mb-3",
                rows: 3
            },
            {
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de Negocio",
                class: "col-12 mb-3",
                data: lsudn,
                text: "valor",
                value: "id",
                required: true
            },
            {
                opc: "checkbox",
                id: "es_servicio",
                lbl: "Es un servicio",
                class: "col-12 mb-3"
            },
            {
                opc: "checkbox",
                id: "active",
                lbl: "Activo",
                class: "col-12 mb-3",
                checked: true
            }
        ];
    }
}
