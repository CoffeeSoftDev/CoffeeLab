let api = 'ctrl/ctrl-proveedores.php';
let supplier;
let lsudn;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    lsudn = data.udn;

    supplier = new AdminSupplier(api, "root");
    supplier.render();
});

class AdminSupplier extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Supplier";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsSuppliers();
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full mb-3', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#container${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">🏢 Proveedores</h2>
                <p class="text-gray-400">Gestiona los proveedores por unidad de negocio.</p>
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
                    lbl: "Unidad de negocio",
                    class: "col-12 col-md-3",
                    data: lsudn,
                    onchange: 'supplier.lsSuppliers()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'supplier.lsSuppliers()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-4",
                    id: "btnAddSupplier",
                    text: "+ Agregar nuevo proveedor",
                    color_btn: "primary",
                    onClick: () => this.addSupplier()
                }
            ]
        });
    }

    lsSuppliers() {
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const active = $(`#filterBar${this.PROJECT_NAME} #active`).val();

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsSuppliers', udn: udn, active: active },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
                center: [1],
                right: []
            }
        });
    }

    addSupplier() {
        const currentUdn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const udnName = $(`#filterBar${this.PROJECT_NAME} #udn option:selected`).text();

        this.createModalForm({
            id: 'formSupplierAdd',
            data: { opc: 'addSupplier', udn_id: currentUdn },
            bootbox: {
                title: '🏢 Agregar Nuevo Proveedor',
                closeButton: true
            },
            json: this.jsonSupplier(udnName),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsSuppliers();
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
    }

    async editSupplier(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getSupplier", id: id }
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

        const supplier = request.data;

        this.createModalForm({
            id: 'formSupplierEdit',
            data: { opc: 'editSupplier', id: supplier.id },
            bootbox: {
                title: '✏️ Editar Proveedor',
                closeButton: true
            },
            autofill: supplier,
            json: this.jsonSupplier(supplier.udn_name, true),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsSuppliers();
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
    }

    toggleStatus(id, currentStatus) {
        const newStatus = currentStatus === 1 ? 0 : 1;
        const action = newStatus === 1 ? 'activar' : 'desactivar';
        const message = newStatus === 1 
            ? 'El proveedor estará disponible para captura de información.'
            : 'El proveedor ya no estará disponible, pero seguirá reflejándose en los registros contables.';

        this.swalQuestion({
            opts: {
                title: `¿Desea ${action} este proveedor?`,
                text: message,
                icon: "warning"
            },
            data: {
                opc: "toggleStatus",
                active: newStatus,
                id: id
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                        this.lsSuppliers();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Ok"
                        });
                    }
                }
            }
        });
    }

    jsonSupplier(udnName, isEdit = false) {
        const fields = [
            {
                opc: "input",
                id: "udn_display",
                lbl: "Unidad de negocio",
                tipo: "texto",
                class: "col-12 mb-3",
                value: udnName,
                disabled: true
            },
            {
                opc: "input",
                id: "name",
                lbl: "Nombre del proveedor",
                tipo: "texto",
                class: "col-12 mb-3",
                placeholder: "Ej.: Marina Chiapas, American Express, etc.",
                required: true
            }
        ];

        return fields;
    }
}
