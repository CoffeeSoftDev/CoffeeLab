let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';

$(function () {
    const app = new App(url,'root');
    sub = new Sub(url,'');
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
        this.createFilterBar();

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
