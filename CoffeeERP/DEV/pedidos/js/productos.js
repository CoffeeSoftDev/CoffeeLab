



// $(async () => {
//     const data = await useFetch({ url: apiProductos, data: { opc: "init" } });
//     lsudn = data.udn;

//     productos = new Productos(apiProductos, 'root');
//     productos.render();
// });

class Productos extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Productos";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsProductos();
    }

    layout() {
        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: 'w-full min-h-screen bg-[#0f172a]',
            card: {
                filterBar: { class: 'w-full border-b border-gray-700 pb-4', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-4', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#${this.PROJECT_NAME}`).prepend(`
            <div class="px-6 pt-6 pb-4">
                <h1 class="text-3xl font-bold text-white">🛍️ Gestión de Productos</h1>
                <p class="text-gray-400 mt-2">Administración de productos y servicios del catálogo</p>
            </div>
        `);
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: `productos.lsProductos()`
                },
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `productos.lsProductos()`
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNuevoProducto",
                    text: "Nuevo Producto",
                    onClick: () => this.addProducto()
                }
            ]
        });
    }

    lsProductos() {
        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "ls" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbProductos",
                theme: 'dark',
                center: [5, 6],
                right: [3]
            }
        });
    }

    addProducto() {
        this.createModalForm({
            id: 'formProductoAdd',
            data: { opc: 'addProducto' },
            bootbox: {
                title: 'Agregar Producto',
                size: 'large'
            },
            json: this.jsonProducto(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsProductos();
                } else {
                    alert({
                        icon: response.status === 409 ? "warning" : "error",
                        title: response.status === 409 ? "Producto duplicado" : "Error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

    async editProducto(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getProducto", id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: request.message,
                btn1: true
            });
            return;
        }

        this.createModalForm({
            id: 'formProductoEdit',
            data: { opc: 'editProducto', id },
            bootbox: {
                title: 'Editar Producto',
                size: 'large'
            },
            autofill: request.data,
            json: this.jsonProducto(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.lsProductos();
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

    statusProducto(id, active) {
        const accion = active === 1 ? "desactivar" : "activar";
        
        this.swalQuestion({
            opts: {
                title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} producto?`,
                text: `Esta acción ${accion === "desactivar" ? "ocultará" : "mostrará"} el producto del catálogo.`,
                icon: "warning"
            },
            data: { opc: "statusProducto", active: active === 1 ? 0 : 1, id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.lsProductos();
                    }
                }
            }
        });
    }

    jsonProducto() {
        return [
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre del Producto",
                class: "col-12 mb-3"
            },
            {
                opc: "textarea",
                id: "descripcion",
                lbl: "Descripción",
                rows: 3,
                class: "col-12 mb-3"
            },
            {
                opc: "input",
                id: "precio",
                lbl: "Precio",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                onkeyup: "validationInputForNumber('#precio')"
            },
            {
                opc: "select",
                id: "tipo",
                lbl: "Tipo",
                class: "col-12 col-md-6 mb-3",
                data: [
                    { id: "producto", valor: "Producto" },
                    { id: "servicio", valor: "Servicio" }
                ]
            }
        ];
    }
}
