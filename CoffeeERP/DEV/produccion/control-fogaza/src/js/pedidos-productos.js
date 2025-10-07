class Products extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Products";
    }

    render() {
        this.layout();

    }

    layout() {
        this.primaryLayout({
            parent: 'tab-products',
            id: this.PROJECT_NAME,
            class: ' p-2',
            card: {
                filterBar: { class: 'w-full ', id: `containerFilterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-3 h-full rounded-lg px-2', id: `container${this.PROJECT_NAME}` }
            }
        });

        const container = $(`#containerFilterBar${this.PROJECT_NAME}`);
        container.html(`
            <div class="px-2">
                <h2 class="text-2xl font-semibold ">📦 Catálogo de productos</h2>
                <p class="text-gray-400">Gestión y consulta del inventario.</p>
            </div>
            <div id="filterBar${this.PROJECT_NAME}" class="mb-2"></div>
        `);

        this.filterBar();
        setTimeout(() => {

            this.ls();
        }, 500);
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBarProducts",
            data: [
                {
                    opc: "select",
                    id: "id_clasificacion",
                    lbl: "Clasificación",
                    class: "col-12 col-md-3",
                    text: "classification",
                    data: grupo,
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

    jsonProduct() {
        return [
            {
                opc: "input",
                id: "NombreProducto",
                lbl: "Nombre del Producto",
                class: "col-12 mb-3"
            },
            {
                opc: "input-group",
                id: "price",
                lbl: "Precio",
                tipo: "cifra",
                class: "col-12 mb-3",
                icon: "icon-dollar",

            },
            {
                opc: "select",
                id: "id_clasificacion",
                lbl: "Clasificación",
                class: "col-12",
                text: "classification",
                data: grupo,
            },
        ];
    }

    addProducto() {
        const modal = bootbox.dialog({
            closeButton: true,
            title: 'Agregar Producto',
            message: `<div><form id="formAddProducto" novalidate></form></div>`
        });

        this.createForm({
            id: 'formAddProductoInternal',
            parent: 'formAddProducto',
            autovalidation: false,
            data: [],
            json: [
                ...products.jsonProduct(),
                {
                    opc: "button",
                    id: "btnAddProducto",
                    class: "col-12 mt-2",
                    className: "w-full p-2",
                    text: "Guardar Producto",
                    onClick: () => {
                        const form = document.getElementById('formAddProducto');
                        const formData = new FormData(form);

                        formData.append('opc', 'addProduct');

                        // const files = document.getElementById('archivos').files;
                        // for (let i = 0; i < files.length; i++) {
                        //     formData.append('archivos[]', files[i]);
                        // }

                        fetch(this._link, {
                            method: 'POST',
                            body: formData
                        })
                            .then(response => response.json())
                            .then(response => {
                                if (response.status === 200) {
                                    alert({ icon: "success", text: response.message });
                                    this.ls();
                                    modal.modal('hide');
                                } else {
                                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                                }
                            });
                    }
                }
            ]
        });
    }

    async editProducto(id) {
        let request = await useFetch({
            url: this._link,
            data: {
                opc: "getProductsById",
                id: id
            },
        });

        const modal = bootbox.dialog({
            closeButton: true,
            title: 'Editar Producto',
            message: `<div><form id="formEditProducto" novalidate></form></div>`
        });

        this.createdForm({
            id: "formEditProducto",
            parent: "formEditProducto",
            autofill: request.data,
            autovalidation: false,
            data: [],
            json: [
                ...products.jsonProduct(),
                {
                    opc: "button",
                    id: "btnEditProducto",
                    class: "col-12 mt-2",
                    className: "w-full p-2",
                    text: "Guardar Cambios",
                    onClick: () => {
                        const form = document.getElementById('formEditProducto');
                        const formData = new FormData(form);
                        formData.append('opc', 'editProduct');
                        formData.append('id_producto', id);

                        fetch(this._link, {
                            method: 'POST',
                            body: formData
                        })
                            .then(response => response.json())
                            .then(response => {
                                if (response.status === 200) {
                                    alert({ icon: "success", text: response.message });
                                    this.ls();
                                    modal.modal('hide');
                                } else {
                                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                                }
                            });
                    }
                }
            ],
        });
    }

    statusProducto(id, estatus) {
        this.swalQuestion({
            opts: {
                title: '¿Deseas desactivar el producto?',
            },
            data: {
                opc: 'setEstatusProducts',
                id: id,
                estatus:0
            },
            methods: {
                request: (data) => {
                    this.ls();
                }
            }
        });
    }

    saveEditProducto(id) {
        const form = document.getElementById('formEditProducto');
        const formData = new FormData(form);
        formData.append('opc', 'editProduct');
        formData.append('id_producto', id);
        fetch(this._link, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === 200) {
                    this.ls();
                    modal.modal("hide");
                }
            });
    }

    ls() {
        this.createdTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: 'filterBarPedidos',
            data: {
                opc: 'lsProducts',
            },
            conf: {
                datatable: true,
                pag: 10
                // fn_datatable: 'datable_export_excel'
            },
            coffeesoft: true,
            attr: {
                id: 'tableProducts',
                theme: 'corporativo',
                // title   : 'Catálogo de productos',
                // subtitle: 'Pasteles dados de alta en el ERP',
                extends: true,
                right: [4],
                center: [1, 2, 5]
            },
        });
    }

    updateClasificacion(id) {
        const idClasificacion = $('#cb_producto' + id).val();

        this.swalQuestion({
            opts: {
                title: '¿Deseas añadir clasificación?',
            },
            data: {
                opc: 'addClasificacion',
                id_clasificacion: idClasificacion,
                idAlmacen: id
            },
            methods: {
                request: (data) => {
                    //   const row =   e.target.closest('tr');
                    //   row.remove();
                }
            }
        });
    }

    setEstatus(id) {
        this.toggleEstatus({
            id: id,
            data: { opc: 'setEstatusProducts' }, // nombre del opc del backend.
            success: (data) => { console.log(data) }
        });
    }
}
