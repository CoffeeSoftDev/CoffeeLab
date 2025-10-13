let api = 'ctrl/ctrl-ingresos.php';
let app;

let udn, lsudn, clasificacion;

$(async () => {
    app = new App(api, "root");

    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn = data.udn;
    lsudn = data.lsudn;
    clasification = data.clasification;

    // ** Instancias **

    app = new App(api, "root");
    app.render();


});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "orders";
    }


    render() {
        this.layoutRedes();

        socialnetworkDashboard.render();
        socialNetworkCapture.render();
        // redesCategory.render();
        // metricas.render();

    }

    layoutRedes() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterBarRedes" },
                container: { class: "w-full h-full", id: "containerRedes" },
            },
        });

        this.headerBar({
            parent: `filterBarRedes`,
            title: "📱 Redes Sociales",
            subtitle: "Monitorea la actividad de redes sociales y estadísticas de interacción.",
            onClick: () => app.init(),
        });

        // Tabs
        this.tabLayout({
            parent: "containerRedes",
            id: "tabsRedes",
            theme: 'light',
            type: "short",
            json: [
                { id: "dashboard", tab: "Dashboard", active: true, },
                { id: "redes", tab: "Capturar Información de redes" },
                { id: "metricas", tab: "Metricas" },
                { id: "socialnetwork", tab: "Redes Sociales", onClick: () => { redesCategory.lsSocialNetwork() } },
            ],
        });

        $('#content-tabsRedes').removeClass('h-screen');

        // redesDashboard.render();
        // redes.render();
        // redesCategory.render();
        // metricas.render();

    }

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



class Sales extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "order";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: 'w-full ',
            card: {
                filterBar: {
                    class: "w-full ",
                    id: "filterBarPedidos"
                },
                container: {
                    class: "w-full my-3 h-full  rounded-lg p-3",
                    id: "container-pedidos"
                }
            }
        });


        $("#container-order").prepend(`
        <div class="px-4 pt-3 ">
            <h2 class="text-xl font-bold ">PEDIDOS SONORA'S MEAT 2025</h2>
            <p class="text-gray-500 text-sm">Pedidos por canal para el análisis mensual.</p>
        </div>
        `);


        this.filterBarPedidos();
        this.lsPedidos();
    }

    filterBarPedidos() {
        $("#container-pedidos").prepend(`
      <div id="filterbar-pedidos" class="mb-3"></div>
      <div id="tabla-pedidos"></div>
    `);

        this.createfilterBar({
            parent: "filterbar-pedidos",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    class: "col-md-2",
                    lbl: "UDN",
                    data: [
                        { id: "4", valor: "SONORAS MEAT" },
                        // { id: "5", valor: "BAOS" }
                    ],
                    onchange: "order.ls()"
                },
                {
                    opc: "select",
                    id: "anio",
                    class: "col-md-2",
                    lbl: "Año",
                    data: [
                        { id: "2025", valor: "2025" },
                        { id: "2024", valor: "2024" }
                    ],
                    onchange: "order.ls()"
                },
                {
                    opc: "select",
                    id: "mes",
                    class: "col-md-2",
                    lbl: "Mes",
                    data: [
                        { id: "01", valor: "Enero" },
                        { id: "02", valor: "Febrero" },
                        { id: "03", valor: "Marzo" },
                        { id: "04", valor: "Abril" },
                        { id: "05", valor: "Mayo" },
                        { id: "06", valor: "Junio" },
                        { id: "07", valor: "Julio" }
                    ],
                    onchange: "order.ls()"
                },
                {
                    opc: "select",
                    id: "report",
                    class: "col-md-3",
                    lbl: "Reporte",
                    data: [
                        { id: 1, valor: "RESUMEN DE PEDIDOS " },
                        { id: 2, valor: "RESUMEN DE VENTAS " },

                    ],
                    onchange: "order.ls()"
                },

            ]
        });
    }

    ls() {
        console.log("Cargando datos de pedidos o ventas según selección...");
        const value = $("#report").val();
        switch (value) {
            case "1":
                this.lsPedidos();
                break;
            case "2":
                this.lsVentas();
                break;
            default:
                // Opcional: acción por defecto
                break;
        }

    }

    lsPedidos() {
        this.createCoffeTable({
            parent: "tabla-pedidos",
            id: "tbOrder",
            theme: "corporativo",
            data: this.jsonPedidos(),
            center: [2, 3, 4, 5, 6, 7, 8],
            color_group: 'bg-blue-100',
            right: [],
            left: []

        });
    }

    lsVentas() {
        this.createCoffeTable({
            parent: "tabla-pedidos",
            id: "tbOrder",
            theme: "corporativo",
            data: this.jsonVentas(),
            center: [2, 3, 4, 5, 6, 7, 8],
            color_group: 'bg-blue-100',
            right: [],
            left: []

        });
    }



    jsonPedidos() {
        return {
            row: [
                {
                    "Mes": "enero 2025",
                    "Llamada": 49,
                    "WhatsApp": 129,
                    "Facebook": 0,
                    "Meep": 10,
                    "Ecommerce": 8,
                    "Uber": 3,
                    "Otro": 0,
                    "Total": 199
                },
                {
                    "Mes": "febrero 2025",
                    "Llamada": 62,
                    "WhatsApp": 79,
                    "Facebook": 0,
                    "Meep": 5,
                    "Ecommerce": 15,
                    "Uber": 5,
                    "Otro": 1,
                    "Total": 167
                },
                {
                    "Mes": "marzo 2025",
                    "Llamada": 54,
                    "WhatsApp": 93,
                    "Facebook": 0,
                    "Meep": 11,
                    "Ecommerce": 17,
                    "Uber": 4,
                    "Otro": 0,
                    "Total": 179
                },
                {
                    "Mes": "abril 2025",
                    "Llamada": 51,
                    "WhatsApp": 86,
                    "Facebook": 0,
                    "Meep": 4,
                    "Ecommerce": 18,
                    "Uber": 4,
                    "Otro": 1,
                    "Total": 164
                },
                {
                    "Mes": "mayo 2025",
                    "Llamada": 53,
                    "WhatsApp": 107,
                    "Facebook": 0,
                    "Meep": 10,
                    "Ecommerce": 21,
                    "Uber": 4,
                    "Otro": 2,
                    "Total": 197
                },
                {
                    "Mes": "junio 2025",
                    "Llamada": 63,
                    "WhatsApp": 115,
                    "Facebook": 0,
                    "Meep": 10,
                    "Ecommerce": 21,
                    "Uber": 3,
                    "Otro": 0,
                    "Total": 212
                },
                {
                    "Mes": "julio 2025",
                    "Llamada": 48,
                    "WhatsApp": 100,
                    "Facebook": 0,
                    "Meep": 5,
                    "Ecommerce": 14,
                    "Uber": 3,
                    "Otro": 0,
                    "Total": 170
                },
                {
                    "Mes": "agosto 2025",
                    "Llamada": 96,
                    "WhatsApp": 95,
                    "Facebook": 0,
                    "Meep": 6,
                    "Ecommerce": 11,
                    "Uber": 5,
                    "Otro": 8,
                    "Total": 221,
                    'opc': 2
                },
                {
                    "Mes": "septiembre 2025",
                    "Llamada": 0,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otro": 0,
                    "Total": 0
                },
                {
                    "Mes": "octubre 2025",
                    "Llamada": 0,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otro": 0,
                    "Total": 0
                },
                {
                    "Mes": "noviembre 2025",
                    "Llamada": 0,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otro": 0,
                    "Total": 0
                },
                {
                    "Mes": "diciembre 2025",
                    "Llamada": 0,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otro": 0,
                    "Total": 0
                }
            ],
            th: "0"
        };
    }

    jsonVentas() {
        return {
            row: [
                {
                    "Mes": "enero 2025",
                    "Llamada": "$ 37,993.94",
                    "WhatsApp": "$ 132,110.11",
                    "Facebook": "-",
                    "Meep": "$ 8,808.85",
                    "Ecommerce": "$ 5,297.33",
                    "Uber": "$ 2,533.00",
                    "Otro": "-",
                    "Total": "$ 186,743.23"
                },
                {
                    "Mes": "febrero 2025",
                    "Llamada": "$ 32,423.93",
                    "WhatsApp": "$ 74,101.61",
                    "Facebook": "-",
                    "Meep": "$ 3,031.50",
                    "Ecommerce": "$ 16,157.11",
                    "Uber": "$ 2,792.00",
                    "Otro": "$ 1,482.95",
                    "Total": "$ 151,030.91"
                },
                {
                    "Mes": "marzo 2025",
                    "Llamada": "$ 49,707.99",
                    "WhatsApp": "$ 93,452.03",
                    "Facebook": "-",
                    "Meep": "$ 7,787.98",
                    "Ecommerce": "$ 13,396.59",
                    "Uber": "$ 2,979.00",
                    "Otro": "-",
                    "Total": "$ 167,863.59"
                },
                {
                    "Mes": "abril 2025",
                    "Llamada": "$ 44,572.98",
                    "WhatsApp": "$ 90,697.29",
                    "Facebook": "-",
                    "Meep": "$ 2,088.75",
                    "Ecommerce": "$ 16,834.65",
                    "Uber": "$ 3,489.00",
                    "Otro": "$ 1,920.00",
                    "Total": "$ 159,412.67"
                },
                {
                    "Mes": "mayo 2025",
                    "Llamada": "$ 50,089.68",
                    "WhatsApp": "$ 110,498.10",
                    "Facebook": "-",
                    "Meep": "$ 6,649.13",
                    "Ecommerce": "$ 18,732.73",
                    "Uber": "$ 1,635.00",
                    "Otro": "$ 2,306.00",
                    "Total": "$ 189,910.64"
                },
                {
                    "Mes": "junio 2025",
                    "Llamada": "$ 50,926.07",
                    "WhatsApp": "$ 129,174.49",
                    "Facebook": "-",
                    "Meep": "$ 10,169.68",
                    "Ecommerce": "$ 16,544.79",
                    "Uber": "$ 1,550.00",
                    "Otro": "$ 1,495.00",
                    "Total": "$ 211,859.63"
                },
                {
                    "Mes": "julio 2025",
                    "Llamada": "$ 48,606.35",
                    "WhatsApp": "$ 112,443.11",
                    "Facebook": "-",
                    "Meep": "$ 5,035.10",
                    "Ecommerce": "$ 12,479.43",
                    "Uber": "$ 1,385.00",
                    "Otro": "-",
                    "Total": "$ 179,948.99"
                },
                {
                    "Mes": "agosto 2025",
                    "Llamada": "$ 89,254.58",
                    "WhatsApp": "$ 105,373.77",
                    "Facebook": "-",
                    "Meep": "$ 6,366.70",
                    "Ecommerce": "$ 12,249.98",
                    "Uber": "$ 2,865.00",
                    "Otro": "$ 1,550.00",
                    "Total": "$ 217,660.03",
                    'opc': 2
                },
                {
                    "Mes": "septiembre 2025",
                    "Llamada": "-",
                    "WhatsApp": "-",
                    "Facebook": "-",
                    "Meep": "-",
                    "Ecommerce": "-",
                    "Uber": "-",
                    "Otro": "-",
                    "Total": "-"
                },
                {
                    "Mes": "octubre 2025",
                    "Llamada": "-",
                    "WhatsApp": "-",
                    "Facebook": "-",
                    "Meep": "-",
                    "Ecommerce": "-",
                    "Uber": "-",
                    "Otro": "-",
                    "Total": "-"
                },
                {
                    "Mes": "noviembre 2025",
                    "Llamada": "-",
                    "WhatsApp": "-",
                    "Facebook": "-",
                    "Meep": "-",
                    "Ecommerce": "-",
                    "Uber": "-",
                    "Otro": "-",
                    "Total": "-"
                },
                {
                    "Mes": "diciembre 2025",
                    "Llamada": "-",
                    "WhatsApp": "-",
                    "Facebook": "-",
                    "Meep": "-",
                    "Ecommerce": "-",
                    "Uber": "-",
                    "Otro": "-",
                    "Total": "-"
                }
            ],
            th: "0"
        };
    }

    agregarPedidos() {

    }
}
