class MenuCostsys extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "MenuCostsys";
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        this.createFilterBar();
        this.ls();
    }

    layout() {
        this.primaryLayout({
            parent: `tab-${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME
        });
    }

    createFilterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    class: "col-lg-3 ",
                    id: "typeFormat",
                    lbl: "Tipo de busqueda",
                    data: [
                        {id:2 , valor: 'desplazamiento a traves de la carta '},
                        {id:3 , valor: 'ventas a traves de la carta '},
                        {id:0 , valor: 'a partir de la carta'},
                        {id:1 , valor: 'a partir del costo potencial'},
                    ]
                },
                // {
                //     opc: "select",
                //     class: "col-lg-2 ",
                //     id: "seasons",
                //     lbl: "Por temporadas",
                //     data: [
                //         { id: 0, valor: 'Chocolate' },
                //         // { id: 1, valor: 'a partir del costo potencial' },
                //         // { id: 2, valor: 'desplazamiento a traves de la carta ' },
                //     ]
                // },
                {
                    opc      : "btn",
                    class    : "col-sm-2",
                    color_btn: "primary",
                    id       : "btn",
                    text     : "Buscar",
                    fn       : 'menuCostsys.ls()',
                },
            ],
        });

    
    }

    ls() {


        let month = $('#Mes option:selected').text();

        this.createTable({

            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar`,
            data: { opc: "TypeReport", type: $('#typeFormat').val(), 'name_month': month },
            conf: { datatable: true, pag: 220, fn_datatable:'data_table_export' },

            attr: {
                color_th: "bg-default",
                id: `tb${this.PROJECT_NAME}`,
                class: 'table table-bordered table-sm uppercase',
                f_size: 12,
                right: [ 3, 4, 5,6,7,8,9],
                center: [1],
                extends: true,
                collapse:true
            },

        });

    }


}


