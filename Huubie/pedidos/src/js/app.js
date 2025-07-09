$(function () {
    const app = new App(api,'root');
    sub = new Sub(api,'');
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
                    onClick: () => { },
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
    }

    // layout() {
    //     this.primaryLayout({
    //         parent: `root`,
    //         class: 'flex mx-2 my-2 h-100 mt-5 p-2',
    //         card:{
    //             container:{
    //                 class:'bg-[#1F2A37] p-3 rounded-3 '
    //             },
    //         },

    //         id: this.PROJECT_NAME,
    //     });
    // }

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

    ls() {
        let rangePicker = getDataRangePicker("calendar");

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "lsMenu", fi: rangePicker.fi, ff: rangePicker.ff },
            conf: { datatable: false, pag: 3 },
            attr: {
                color_th: "bg-primary",
                id: `tb${this.PROJECT_NAME}`,
                class: "table table-bordered table-sm uppercase",
                f_size: 12,
                center: [2],
                right: [2, 3, 4, 5],
                extends: true,
            },
        });
    }
}
