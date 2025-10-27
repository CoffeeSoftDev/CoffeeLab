let api = 'ctrl/ctrl-ingresos.php';
let app, sales, salesDashboard, monthlySales, cumulativeAverages;

let udn, lsudn, clasificacion, clasificacionUdn;

$(async () => {
    app = new App(api, "root");

    const data = await useFetch({ url: api, data: { opc: "init" } });
    console.log(data)
    udn           = data.udn;
    lsudn         = data.lsudn;
    clasificacion = data.clasification;

    // ** Instancias **
    app = new App(api, "root");

    salesDashboard     = new SalesDashboard(api, "root");
    sales              = new Sales(api, "root");
    monthlySales       = new MonthlySales(api, "root");
    cumulativeAverages = new CumulativeAverages(api, "root");


    app.render();


});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "orders";
    }


    render() {
        this.layout();

        // init instancias.

        salesDashboard.render();
        // sales.render();
        // monthlySales.render();
        // cumulativeAverages.render();

    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterBarVentas" },
                container: { class: "w-full h-full", id: "containerVentas" },
            },
        });

        this.headerBar({
            parent: `filterBarVentas`,
            title: "📊 Módulo de ventas",
            subtitle: "Consulta las métricas de ventas.",
            onClick: () => this.redirectToHome(),
        });

        this.tabLayout({
            parent: `containerVentas`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "short",
            json: [
                {
                    id: "dashboard",
                    tab: "Dashboard",
                    class: "mb-1",
                    active: true,
                    onClick: () => salesDashboard.renderDashboard()
                },
                {
                    id: "sales",
                    tab: "Módulo ventas",
                    onClick: () => {
                    }
                },
                {
                    id: "comparativasMensuales",
                    tab: "Comparativas mensuales",
                    onClick: () => {
                    }
                },
                // {
                //     id: "promediosDiarios",
                //     tab: "Promedios diarios",
                //     onClick: () => {
                //     }
                // },
                {
                    id: "promediosAcumulados",
                    tab: "Promedios acumulados",
                    onClick: () => {
                    }
                },
            ]
        });

        $('#content-tabsVentas').removeClass('h-screen');
    }


    // Components.
    redirectToHome() {
        const base = window.location.origin + '/DEV';
        window.location.href = `${base}/kpi/marketing.php`;
    }


    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Título por defecto",
            subtitle: "Subtítulo por defecto",
            icon: "icon-home",
            textBtn: "Inicio",
            classBtn: "border-1 border-blue-700 text-blue-600 hover:bg-blue-700 hover:text-white transition-colors duration-200",
            onClick: null,
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "relative flex justify-center items-center px-2 pt-3 pb-3"
        });

        // 🔵 Botón alineado a la izquierda (posición absoluta)
        const leftSection = $("<div>", {
            class: "absolute left-0"
        }).append(
            $("<button>", {
                class: `${opts.classBtn} font-semibold px-4 py-2 rounded transition flex items-center`,
                html: `<i class="${opts.icon} mr-2"></i>${opts.textBtn}`,
                click: () => typeof opts.onClick === "function" && opts.onClick()
            })
        );

        // 📜 Texto centrado
        const centerSection = $("<div>", {
            class: "text-center"
        }).append(
            $("<h2>", {
                class: "text-2xl font-bold",
                text: opts.title
            }),
            $("<p>", {
                class: "text-gray-400",
                text: opts.subtitle
            })
        );

        container.append(leftSection, centerSection);
        $(`#${opts.parent}`).html(container);
    }



}



class Sales extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "sales";
    }

    render() {
        this.layout();
        this.filterBar();
        this.listSales()
    }



    layout() {
        this.primaryLayout({
            parent: `container-sales`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  border-b pb-2 ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full ', id: `container${this.PROJECT_NAME}` }
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
                    lbl: "Seleccionar udn",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `sales.listSales()`,
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-sm-3",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: `sales.listSales()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `sales.listSales()`,
                },
                {
                    opc: "select",
                    id: "type",
                    lbl: "Consultar",
                    class: "col-sm-3",
                    data: [
                        { id: "3", valor: "Promedios Diarios" },
                        { id: "1", valor: " Ingresos por día" },
                        { id: "2", valor: "Captura de sales" },
                    ],
                    onchange: `sales.listSales()`,
                },
            ],
        });
        const currentMonth = moment().month() + 1; // Mes actual (1-12)
        setTimeout(() => {
            $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    listSales() {
        const monthText = $("#filterBarsales #mes option:selected").text();
        $("#containersales").html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold ">📦 VENTAS DIARIAS</h2>
                <p class="text-gray-400">Consultar y capturar ventas diaria por unidad de negocio (sales)</p>
            </div>
            <div id="container-table-sales"></div>
        `);
        this.createTable({
            parent: "container-table-sales",
            idFilterBar: `filterBarsales`,
            data: { opc: 'list', monthText: monthText },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbIngresos",
                theme: 'corporativo',
                color_group: "bg-gray-300",
                // center: [2],
                right: [4]
            },
        });
    }
}

class MonthlySales extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "ComparativaMensual";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsComparativa();
    }

    layout() {
        this.primaryLayout({
            parent: `container-comparativasMensuales`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  border-b pb-2 ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full ', id: `container${this.PROJECT_NAME}` }
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
                    lbl: "UDN:",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `monthlySales.lsComparativa()`,
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-sm-3",
                    data: [
                        { id: "2025", valor: "2025" },
                        { id: "2024", valor: "2024" },
                        { id: "2023", valor: "2023" },
                    ],
                    onchange: `monthlySales.lsComparativa()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `monthlySales.lsComparativa()`,
                },
                {
                    opc: "select",
                    id: "type",
                    lbl: "Consultar",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Consulta de promedios" },
                        { id: "2", valor: "Consulta de ingresos" },
                    ],
                    onchange: `monthlySales.lsComparativa()`,
                },
            ],
        });
        setTimeout(() => {
            // $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    lsComparativa() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold ">📦 Comparativas Mensuales </h2>
                <p class="text-gray-400">Consulta las ventas (ingresos) y el cheque promedio (Promedios) mensual contra el año seleccionado. </p>
            </div>
            <div id="container-table-comparativa"></div>
        `);
        this.createTable({
            parent: "container-table-comparativa",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'listComparative' },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbIngresos",
                theme: 'corporativo',
                center: [1, 2, 3],
                right: [6]
            },
        });
    }
}

class CumulativeAverages extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "promediosAcumulados";
    }

    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }

    layout() {
        this.primaryLayout({
            parent: `container-promediosAcumulados`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  border-b pb-2 ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full ', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    filterBar() {
        const currentMonth = moment().month(); // Índice de mes actual (0-11)
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Seleccionar udn",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `cumulativeAverages.ls()`,
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-sm-3",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: `cumulativeAverages.ls()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({
                        id: i + 1,
                        valor: m,
                        selected: i === currentMonth
                    })),
                    onchange: `cumulativeAverages.ls()`,
                },
            ],
        });
        // initialized.
        setTimeout(() => {
            // $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth + 1).trigger("change");
        }, 100);
    }

    ls() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold ">📦Ch </h2>
                <p class="text-gray-400">
                Consulta los promedios acumulados del año seleccionado, hasta el mes seleccionado.
                </p>
            </div>
            <div id="container-table-acumulados"></div>
        `);
        this.createTable({
            parent: "container-table-acumulados",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'listAcumulados' },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbI",
                theme: 'corporativo',
                center: [1, 2, 3],
                right: [6]
            },
        });
    }
}

