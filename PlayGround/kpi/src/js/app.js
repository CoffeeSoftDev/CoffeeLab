let api_costsys = 'https://erp-varoch.com/ERP24/costsys/ctrl/ctrl-menu.php';
let app;

$(async () => {
    
    // instancias.
    app = new App(api_costsys, 'root');
    app.render();
  
});


class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "costsys";
    }


    render() {
        this.layoutCostsys();
    }

  
    layoutCostsys() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterCostsys" },
                container: { class: "w-full ", id: "containerCostsys" },
            },
        });

        this.tabLayout({
            parent: `containerCostsys`,
            id: "tabsCostsSys",
            type: "short",
            json: [
                { id: "Dashboard", tab: "Dashboard",  },
                { id: "costoPotencial", tab: "Costo Potencial" },
                { id: "desplazamiento", tab: "Desplazamiento por Mes" },
                { id: "ventas", tab: "Ventas por Mes", active: true  }
            ]
        });

        this.headerBar({
            parent: `filterCostsys`,
            title: "📊 Panel CostSys",
            subtitle: "Consulta y visualiza ventas, costos y desplazamientos.",
            onClick: () => app.init(),
        });

        // Costsys
        this.layoutCostoPotencial();
        this.filterBarCostoPotencial();
        this.lsCostoPotencial();

        // Desplazamiento por Mes

        this.layoutDesplazamiento();
        this.filterBarDesplazamiento();
        this.lsDesplazamiento();

         // Ventas

        this.layoutVentas();
        this.filterBarVentas();
        this.lsVentas();



    }

    // tab Costo Potencial

    layoutCostoPotencial() {
        this.primaryLayout({
            parent: `container-costoPotencial`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full   ', id: `filterBarCostoPotencial` },
                container: { class: 'w-full mt-2', id: `containerCostoPotencial` }
            }
        });   
    }

    filterBarCostoPotencial() {
        this.createfilterBar({
            parent: `filterBarCostoPotencial`,
            data: [
                {
                    opc: "select",
                    id: "UDNs",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: [{id: 4, valor:'Baos'}]
                },
                {
                    opc: "select",
                    id: "Clasificacion",
                    lbl: "Clasificación",
                    class: "col-sm-3",
                    data: [
                        { id: 13, valor: "ALIMENTOS" },
                        { id: "BEBIDAS", valor: "BEBIDAS" }
                    ]
                },
                {
                    opc: "select",
                    id: "Anio",
                    lbl: "Año",
                    class: "col-sm-2",
                    data: Array.from({ length: 2 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                },
                {
                    opc: "select",
                    id: "Mes",
                    lbl: "Mes",
                    class: "col-sm-2",
                    data: Array.from({ length: 12 }, (_, i) => {
                        const month = moment().month(i); // i = 0 to 11
                        return {
                            id: month.format("MM"),
                            valor: month.format("MMMM") // "Enero", "Febrero", ...
                        };
                    }),
                },
                {
                    opc: "button",
                    id: "btnBuscar",
                    class: "col-sm-2",
                    text: "Buscar",
                    className: "btn-primary w-100",
                    onClick: () => this.lsCostoPotencial()
                }
            ]
        });

        // render
        setTimeout(() => {
            $("#filterBarCostoPotencial #Mes").val(moment().format("MM"));
            $("#filterBarCostoPotencial #Anio").val(moment().year());
        }, 50);
    }

    lsCostoPotencial() {

        this.createTable({
            parent: `containerCostoPotencial`,
            idFilterBar: `filterBarCostoPotencial`,
            data: {
                opc: "TypeReport",
                type:1,
                name_month: $('#Mes option:selected').text()
              
            },
            conf: { datatable: false, pag: 10 },
            coffeesoft: true,
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: "corporativo",
                title: 'Sistema de costos',
                right: [3, 4, 5, 6, 7, 8, 9],
                center: [1],
                extends: true,
                collapse: true
            },
        });
    }

    // tab Desplazamiento por Mes

    layoutDesplazamiento() {
        this.primaryLayout({
            parent: `container-desplazamiento`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full   ', id: `filterBarDesplazamiento` },
                container: { class: 'w-full mt-2', id: `containerDesplazamiento` }
            }
        });   
    }

    filterBarDesplazamiento() {
        this.createfilterBar({
            parent: `filterBarDesplazamiento`,
            data: [
                {
                    opc: "select",
                    id: "UDNs",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: [{id: 4, valor:'Baos'}]
                },
                {
                    opc: "select",
                    id: "Clasificacion",
                    lbl: "Clasificación",
                    class: "col-sm-3",
                    data: [
                        { id: 13, valor: "ALIMENTOS" },
                        { id: "BEBIDAS", valor: "BEBIDAS" }
                    ]
                },
                {
                    opc: "select",
                    id: "Anio",
                    lbl: "Año",
                    class: "col-sm-2",
                    data: Array.from({ length: 2 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                },
                {
                    opc: "select",
                    id: "Mes",
                    lbl: "Mes",
                    class: "col-sm-2",
                    data: Array.from({ length: 12 }, (_, i) => {
                        const month = moment().month(i); // i = 0 to 11
                        return {
                            id: month.format("MM"),
                            valor: month.format("MMMM") // "Enero", "Febrero", ...
                        };
                    }),
                },
                {
                    opc: "button",
                    id: "btnBuscar",
                    class: "col-sm-2",
                    text: "Buscar",
                    className: "btn-primary w-100",
                    onClick: () => this.lsDesplazamiento()
                }
            ]
        });

        setTimeout(() => {
            $("#filterBarDesplazamiento #Mes").val(moment().format("MM"));
            $("#filterBarDesplazamiento #Anio").val(moment().year());
        }, 50);
    }

    lsDesplazamiento() {

        this.createTable({
            parent: `containerDesplazamiento`,
            idFilterBar: `filterBarDesplazamiento`,
            data: {
                opc       : "TypeReport",
                type      : 2,
                name_month: $('#Mes option:selected').text()
              
            },
            conf: { datatable: false, pag: 10 },
            coffeesoft: true,
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: "corporativo",
                title: 'Histórico de desplazamiento por producto',
                subtitle:'Visualización detallada de los movimientos mensuales por producto, organizados por categoría y período de tiempo para análisis comparativo',
                right: [3, 4, 5, 6, 7, 8, 9],
                center: [1],
                extends: true,
                collapse: true
            },
        });
    }

    // tab Ventas por mes

    layoutVentas() {
        this.primaryLayout({
            parent: `container-ventas`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full   ', id: `filterBarVentas` },
                container: { class: 'w-full mt-2', id: `containerVentas` }
            }
        });   
    }

    filterBarVentas() {
        this.createfilterBar({
            parent: `filterBarVentas`,
            data: [
                {
                    opc: "select",
                    id: "UDNs",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: [{id: 4, valor:'Baos'}]
                },
                {
                    opc: "select",
                    id: "Clasificacion",
                    lbl: "Clasificación",
                    class: "col-sm-3",
                    data: [
                        { id: 13, valor: "ALIMENTOS" },
                        { id: "BEBIDAS", valor: "BEBIDAS" }
                    ]
                },
                {
                    opc: "select",
                    id: "Anio",
                    lbl: "Año",
                    class: "col-sm-2",
                    data: Array.from({ length: 2 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                },
                {
                    opc: "select",
                    id: "Mes",
                    lbl: "Mes",
                    class: "col-sm-2",
                    data: Array.from({ length: 12 }, (_, i) => {
                        const month = moment().month(i); // i = 0 to 11
                        return {
                            id: month.format("MM"),
                            valor: month.format("MMMM") // "Enero", "Febrero", ...
                        };
                    }),
                },
                {
                    opc: "button",
                    id: "btnBuscar",
                    class: "col-sm-2",
                    text: "Buscar",
                    className: "btn-primary w-100",
                    onClick: () => this.lsVentas()
                }
            ]
        });

          setTimeout(() => {
            $("#filterBarVentas #Mes").val(moment().format("MM"));
            $("#filterBarVentas #Anio").val(moment().year());
        }, 50);
    }

    lsVentas() {

        this.createTable({
            parent: `containerVentas`,
            idFilterBar: `filterBarVentas`,
            data: {
                opc       : "TypeReport",
                type      : 3,
                name_month: $('#Mes option:selected').text()
              
            },
            conf: { datatable: false, pag: 10 },
            coffeesoft: true,
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: "corporativo",
                title: 'Histórico de ventas por producto',
                subtitle:'Visualización detallada de los ventas mensuales por producto, organizados por categoría y período de tiempo para análisis comparativo',
                right: [3, 4, 5, 6, 7, 8, 9],
                center: [1],
                extends: true,
                collapse: true
            },
        });
    }




    // Components.
    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Default Title",
            subtitle: "Default subtitle",
            onClick: null,
        };

        const opts = Object.assign({}, defaults, options);

        const container = $(`
            <div class="flex justify-between items-center px-2 pt-3 pb-3">
                <div>
                    <h2 class="text-2xl font-semibold">${opts.title}</h2>
                    <p class="text-gray-400">${opts.subtitle}</p>
                </div>
                <div>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition flex items-center">
                        <i class="icon-home mr-2"></i>Inicio
                    </button>
                </div>
            </div>
        `);

        container.find("button").on("click", () => {
            if (typeof opts.onClick === "function") {
                opts.onClick();
            }
        });

        $(`#${opts.parent}`).append(container);
    }
}
