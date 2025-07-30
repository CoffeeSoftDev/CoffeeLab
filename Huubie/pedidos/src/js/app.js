let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';
let api = "https://www.huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php";
let sub,app;
$(function () {
    const app = new App(api,'root');
    app.init();
    // sub.init();
});

class App extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Admin";
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        // this.createFilterBar();

        this.addModifier()

    }

    async addModifier() {
        this.tempProductList = [];
        this.idModifier = 0;

        bootbox.dialog({
            closeButton: true,
            title: `
            <h2 class="text-lg font-semibold leading-none tracking-tight text-gray-100">Crear Nuevo Modificador</h2>
            <p class="text-sm text-muted-foreground">Completa la información del modificador.</p>
        `,
            message: `
            <form id="formModifierContainer" novalidate></form>
            <form id="formProductsContainer" novalidate class="d-none"></form>
            <div id="product-list" class="overflow-y-auto max-h-52 mt-2"></div>
        `,
            buttons: {

                cerrar: {
                    label: 'Cancelar',
                    className: 'btn btn-secondary',

                    callback: () => { }
                },
                actualizar: {
                    label: 'Guardar',
                    className: 'btn btn-primary',
                    callback: () => {

                        useFetch({
                            url: this._link,
                            data: {
                                opc: 'updateModifier',
                                name: $('#name').val(),
                                productos: JSON.stringify(this.tempProductList)
                        },
                            success: (res) => {
                                if (res.status == 200) {
                                    Swal.fire("✔", "Modificador actualizado correctamente", "success");
                                } else {
                                    Swal.fire("Error", res.message || "No se pudo actualizar", "error");
                                }
                            }
                        });

                        return false;
                    }
                },
            }
        });

        this.createForm({
            parent: "formModifierContainer",
            id: "formModifier",
            data: { opc: 'addModifier' },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del Modificador",
                    required: true,
                    class: "col-12 ",
                },
                // {
                //     opc: "textarea",
                //     id: "description",
                //     lbl: "Descripción",
                //     class: "col-12",
                // },
                {
                    opc: "btn-submit",
                    text: "Crear Modificador",
                    class: "col-12",
                    id: "btnCrearModificador"
                }
            ],
            success: (response) => {
                if (response.status == 200) {
                    this.idModifier = response.id;
                    $('#btnCrearModificador').closest('.col-12').remove(); // Elimina el botón
                    $('#formProductsContainer').removeClass('d-none');
                    this.renderProductForm(response.id);
                }
            }
        });
    }

    renderProductForm(idModifier) {
        this.createForm({
          parent: "formProductsContainer",
          id: "formProduct",
          data: { opc: "addProductModifier", id: idModifier },
          json: [
            {
              opc: "div",
              html: ` <label class="text-lg font-medium text-gray-100">Productos Incluidos</label>
                    <p class="text-sm text-muted-foreground mb-1">Añade los productos que incluye este modificador</p> `,
              class: "col-12",
            },
            {
              opc: "input",
              id: "productName",
              lbl: "Nombre ",
              placeholder: "Ingrese nombre del producto",
              required: true,
              class: "col-5 mb-3",
            },

            {
              opc: "input",
              id: "price",
              lbl: "Precio",
              tipo: "numero",
              placeholder: "0.00",
              required: true,
              class: "col-3",
            },
            {
              opc: "button",
              text: "Añadir",
              className: "w-full",
              class: "col-4",
              onClick: () => this.addProductToList(),
            },
          ],
        });

        $("#formProduct").on('reset', () => {
            $("#productName").val('');

        });
    }

    addProductToList() {
        const name = $("#productName").val().trim();
        const qty = parseInt($("#cant").val());
        const price = $("#price").val();

        if (!name || qty < 1 || price < 0) {
            alert({ icon: "info", text: "Nombre, cantidad y precio son requeridos y válidos." });
            return;
        }

        this.tempProductList.push({
            id: name, // Aquí puedes poner el id real si usas catálogo
            text: name,
            qty,
            price
        });
        this.renderProductList();
        $("#formProductsContainer")[0].reset();
    }

    renderProductList() {
        let html = `<div id="product-list" class="overflow-y-auto max-h-52">`;

        this.tempProductList.forEach((prod, idx) => {
            html += `
            <div class="product-item" data-index="${idx}">
                <div class="border border-gray-200 rounded-lg p-2 shadow-sm flex items-center justify-between gap-4 mb-2">
                    <div class="text-sm font-semibold text-gray-900 flex-1 truncate text-white">${prod.text}</div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-800 font-medium">Precio:</label>
                        <input
                            type="text"
                            placeholder="0.00"
                            class="form-control bg-[#1F2A37] w-20 text-sm text-end input-qty"
                            data-index="${idx}"
                            value="${prod.price}"
                        >
                    </div>
                    <button
                        type="button"
                        class="btn btn-outline-danger btn-sm btn-remove-product"
                        data-index="${idx}">
                        <i class="icon-trash"></i>
                    </button>
                </div>
            </div>
        `;
        });

        html += `</div>`;
        $("#product-list").html(html);

        // Eliminar producto por índice exacto
        $('#product-list').off('click', '.btn-remove-product').on('click', '.btn-remove-product', (e) => {
            const index = $(e.currentTarget).data('index');
            this.tempProductList.splice(index, 1);
            this.renderProductList();
        });

        // Actualizar cantidad por índice
        $('#product-list').off('keyup', '.input-qty').on('keyup', '.input-qty', (e) => {
            const input = $(e.currentTarget);
            const index = parseInt(input.data('index'));
            const value = parseFloat(input.val()) || 1;
            this.tempProductList[index].price = value;
        });
    }


    layout() {
        let nameCompany = '';

        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: "flex mx-2 my-2 h-full mt-5 p-2",
            card: {
                filterBar: { class: "w-full my-3 ", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full my-3 h-full bg-[#1F2A37] rounded-lg p-3", id: "container" + this.PROJECT_NAME },
            },
        });

        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabComponent",
            content: { class: "" },
            theme: "dark",
            type:'short',
            json: [
                {
                    id: "company",
                    tab: "Empresa",
                    active: true,
                    onClick: () => { this.ls() },
                },

                {
                    id: "usuarios",
                    tab: "usuarios",
                    icon: "",
                    onClick: () => { },
                },

                {
                    id: "sucursal",
                    tab: "Sucursal",
                    icon: "",
                    onClick: () => { },
                },
            ],
        });



        // Titulo del modulo.

        $("#containerAdmin").prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold text-white">⚙️ Configuración de ${nameCompany}</h2>
                <p class="text-gray-400">Administra los datos de la empresa, los usuarios y sucursales de la aplicación.</p>
            </div>
        `);

        // usuarios.render();
        // sucursales.render();
        // company.render();
        // clausules.render();
        this.filterBarProductos()
    }



    createFilterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-4",
                    id: "calendar",
                    lbl: "Consultar fecha: ",
                },

                {
                    opc: "btn",
                    class: "col-sm-2",
                    color_btn: "primary",
                    id: "btn",
                    text: "Buscar",
                    fn: `${this.PROJECT_NAME.toLowerCase()}.ls()`,
                },
            ],
        });

        dataPicker({
            parent: "calendar",
            onSelect: () => this.ls(),
        });
    }

    filterBarProductos() {
        const container = $("#container-company");
        container.html('<div id="filterbar-company" class="mb-2"></div><div id="table-company"></div>');

        this.createfilterBar({
            parent: "filterbar-company",
            data: [
                {
                    opc: "select",
                    id: "estado-productos",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Disponibles" },
                        { id: "0", valor: "No disponibles" }
                    ],
                    // onchange: () => this.lsProductos()
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


        // setTimeout(() => this.lsProductos(), 50);
    }

    ls() {
        let rangePicker = getDataRangePicker("calendar");

        this.createTable({
            parent: `table-company`,
            idFilterBar: `filterbar-company`,
            data: { opc: "listProductos" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbProductos",
                theme: 'dark',
                right: [2],
                center: [3, 6]
            },
        });
    }
}
