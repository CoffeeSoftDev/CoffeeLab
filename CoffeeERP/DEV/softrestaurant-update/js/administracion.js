let api = 'ctrl/ctrl-administracion.php';
let app;
let udn, categorias;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn = data.udn;
    categorias = data.categorias;

    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "administracion";
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
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full mb-3', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-sm-3",
                    data: udn,
                    onchange: "app.ls()"
                },
                {
                    opc: "select",
                    id: "tipoReporte",
                    lbl: "Tipo de Reporte",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Lista General" },
                        { id: "2", valor: "Por Categoría" },
                        { id: "3", valor: "Reporte Detallado" }
                    ],
                    onchange: "app.cambiarVista()"
                },
                {
                    opc: "button",
                    class: "col-sm-2",
                    id: "btnNuevoProducto",
                    text: "Nuevo Producto",
                    onClick: () => this.addProducto()
                }
            ]
        });
    }

    cambiarVista() {
        const tipo = $(`#filterBar${this.PROJECT_NAME} #tipoReporte`).val();
        
        switch(tipo) {
            case "1":
                this.ls();
                break;
            case "2":
                this.lsGrupo();
                break;
            case "3":
                this.rptDetallado();
                break;
        }
    }

    ls() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📦 Administración de Productos</h2>
                <p class="text-gray-400">Gestiona los productos de SoftRestaurant</p>
            </div>
            <div id="tabla-productos"></div>
        `);

        this.createTable({
            parent: 'tabla-productos',
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'ls' },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbProductos',
                theme: 'corporativo',
                title: 'Lista de Productos',
                subtitle: 'Productos registrados en el sistema',
                center: [1, 2],
                right: [5, 6]
            }
        });
    }

    lsGrupo() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📊 Productos por Categoría</h2>
                <p class="text-gray-400">Vista agrupada por categorías</p>
            </div>
            <div id="tabla-grupos"></div>
        `);

        this.createTable({
            parent: 'tabla-grupos',
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsGrupo' },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbGrupos',
                theme: 'corporativo',
                title: 'Categorías de Productos',
                subtitle: 'Agrupación por categorías',
                center: [1, 2, 3]
            }
        });
    }

    rptDetallado() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📋 Reporte Detallado</h2>
                <p class="text-gray-400">Vista detallada de todos los productos</p>
            </div>
            <div id="tabla-detallado"></div>
        `);

        this.createTable({
            parent: 'tabla-detallado',
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'rptDetallado' },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbDetallado',
                theme: 'corporativo',
                title: 'Reporte Detallado',
                subtitle: 'Información completa de productos',
                center: [1, 2],
                right: [5, 6]
            }
        });
    }

    addProducto() {
        this.createModalForm({
            id: 'formProductoAdd',
            data: { opc: 'addProducto' },
            bootbox: {
                title: 'Agregar Producto',
                closeButton: true
            },
            json: [
                {
                    opc: "select",
                    id: "id_udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 mb-3",
                    data: udn,
                    text: "valor",
                    value: "id"
                },
                {
                    opc: "input",
                    id: "descripcion",
                    lbl: "Nombre del Producto",
                    class: "col-12 mb-3",
                    required: true
                },
                {
                    opc: "select",
                    id: "id_grupo_productos",
                    lbl: "Categoría",
                    class: "col-12 mb-3",
                    data: categorias,
                    text: "valor",
                    value: "id"
                },
                {
                    opc: "input",
                    id: "costo",
                    lbl: "Costo",
                    tipo: "cifra",
                    class: "col-12 mb-3",
                    onkeyup: "validationInputForNumber('#costo')"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editProducto(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getProducto", id: id }
        });

        if (request.status === 200) {
            const producto = request.data;

            this.createModalForm({
                id: 'formProductoEdit',
                data: { opc: 'editProducto', id: producto.id },
                bootbox: {
                    title: 'Editar Producto',
                    closeButton: true
                },
                autofill: producto,
                json: [
                    {
                        opc: "select",
                        id: "id_udn",
                        lbl: "Unidad de Negocio",
                        class: "col-12 mb-3",
                        data: udn,
                        text: "valor",
                        value: "id"
                    },
                    {
                        opc: "input",
                        id: "descripcion",
                        lbl: "Nombre del Producto",
                        class: "col-12 mb-3",
                        required: true
                    },
                    {
                        opc: "select",
                        id: "id_grupo_productos",
                        lbl: "Categoría",
                        class: "col-12 mb-3",
                        data: categorias,
                        text: "valor",
                        value: "id"
                    },
                    {
                        opc: "input",
                        id: "costo",
                        lbl: "Costo",
                        tipo: "cifra",
                        class: "col-12 mb-3",
                        onkeyup: "validationInputForNumber('#costo')"
                    }
                ],
                success: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "info", title: "Oops!...", text: response.message });
                    }
                }
            });
        } else {
            alert({ icon: "error", text: request.message });
        }
    }

    statusProducto(id, active) {
        const accion = active === 1 ? 'desactivar' : 'activar';
        
        this.swalQuestion({
            opts: {
                title: `¿Desea ${accion} este producto?`,
                text: "Esta acción cambiará el estado del producto.",
                icon: "warning"
            },
            data: {
                opc: "statusProducto",
                activo_soft: active === 1 ? 0 : 1,
                id: id
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "info", title: "Oops!...", text: response.message });
                    }
                }
            }
        });
    }

    uploadExcel() {
        alert({
            icon: "info",
            title: "Subir Productos desde Excel",
            text: "Esta funcionalidad estará disponible próximamente.",
            btn1: true,
            btn1Text: "Ok"
        });
    }
}
