// Order Module

class Order extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "order";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-${this.PROJECT_NAME}`,
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

class OrderDay extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "orderDay";
    }

    render() {
        this.layout();
        this.lsVentas();
    }

    layout() {
        this.primaryLayout({
            parent: `container-${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            class: 'w-full ',
            card: {
                filterBar: {
                    class: "w-full ",
                    id: `filterBar${this.PROJECT_NAME}`

                },
                container: {
                    class: "w-full my-3 h-full  rounded-lg p-3",
                    id: `container${this.PROJECT_NAME}`
                }
            }
        });


        $("#container-orderDay").prepend(`
            <div class="px-4 pt-3 ">
                <h2 class="text-xl font-bold ">Captura de ingresos</h2>
                <p class="text-gray-500 text-sm">Captura de bitacora diaria</p>
            </div>
        `);


        this.filterBarPedidos();
        this.lsVentas();
    }

    filterBarPedidos() {
        $(`#container${this.PROJECT_NAME}`).prepend(`
        <div id="filterbar-orderDay" class="mb-3"></div>
        <div id="tabla-orderDay"></div>
        `);

        this.createfilterBar({
            parent: "filterbar-orderDay",
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
                    onchange: "orderDay.ls()"
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
                    onchange: "orderDay.ls()"
                },


                {
                    opc: "button",
                    class: "col-md-3",
                    className: "w-100",
                    id: "btnNuevoPedido",
                    text: "+ Agregar nuevo ingreso",
                    onClick: () => this.agregarPedidos()
                }
            ]
        });
    }

    lsVentas() {

        this.createCoffeTable({
            parent: "tabla-orderDay",
            id: "tbOrder",
            theme: "corporativo",
            data: this.jsonTable(),
            center: [2, 3, 4, 5, 6, 7, 8],
            color_group: 'bg-blue-100',
            right: [],
            left: []

        });
    }


    jsonVentas() {
        const hoy = new Date();
        const fechas = [
            new Date(hoy), // hoy
            new Date(hoy.setDate(hoy.getDate() - 1)), // ayer
            new Date(hoy.setDate(hoy.getDate() - 1))  // antier
        ].map(d => {
            return d.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }).replace('.', '');
        });

        return {
            "row": [
                {
                    "id": 0,
                    "Fecha": fechas[0],
                    "Llamada": 280.20,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otros": "",
                    "Envío a domicilio": "✅",
                    "Pasaron a recoger": "",
                    "Nombre": "Ingrid",
                    "Teléfono": "9622420161",
                    "opc": 0
                },
                {
                    "id": 1,
                    "Fecha": fechas[0],
                    "Llamada": 988.50,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otros": "",
                    "Envío a domicilio": "✅",
                    "Pasaron a recoger": "",
                    "Nombre": "Milka Cortés",
                    "Teléfono": "9621027218",
                    "opc": 0
                },
                {
                    "id": 2,
                    "Fecha": fechas[1],
                    "Llamada": 432.30,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otros": "",
                    "Envío a domicilio": "✅",
                    "Pasaron a recoger": "",
                    "Nombre": "Martha Villarreal",
                    "Teléfono": "9621095756",
                    "opc": 0
                },
                {
                    "id": 3,
                    "Fecha": fechas[1],
                    "Llamada": 724.00,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otros": "",
                    "Envío a domicilio": "✅",
                    "Pasaron a recoger": "",
                    "Nombre": "Adela Orduña",
                    "Teléfono": "9621250462",
                    "opc": 0
                },
                {
                    "id": 4,
                    "Fecha": fechas[2],
                    "Llamada": 1148.00,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otros": "",
                    "Envío a domicilio": "✅",
                    "Pasaron a recoger": "",
                    "Nombre": "Ricardo Ordoñez",
                    "Teléfono": "9621207389",
                    "opc": 0
                },
                {
                    "id": 5,
                    "Fecha": fechas[2],
                    "Llamada": 1175.00,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otros": "",
                    "Envío a domicilio": "✅",
                    "Pasaron a recoger": "",
                    "Nombre": "Angélica Mijangos",
                    "Teléfono": "9621681876",
                    "opc": 0
                },
                {
                    "id": 6,
                    "Fecha": fechas[2],
                    "Llamada": 601.45,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otros": "",
                    "Envío a domicilio": "✅",
                    "Pasaron a recoger": "",
                    "Nombre": "Yaneli Hernández",
                    "Teléfono": "9621118860",
                    "opc": 0
                },
                {
                    "id": 7,
                    "Fecha": fechas[2],
                    "Llamada": 604.10,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otros": "",
                    "Envío a domicilio": "✅",
                    "Pasaron a recoger": "",
                    "Nombre": "Rodrigo Ruiz",
                    "Teléfono": "9621257327",
                    "opc": 0
                },
                {
                    "id": 8,
                    "Fecha": fechas[2],
                    "Llamada": 542.25,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otros": "",
                    "Envío a domicilio": "✅",
                    "Pasaron a recoger": "",
                    "Nombre": "Sofía Guerrero",
                    "Teléfono": "9621697416",
                    "opc": 0
                }
            ],
            "thead": ""
        };

    }

    jsonTable() {
        return {
            row: [
                {
                    "Fecha": "26-septiembre-2025",
                    "Llamada": "$609.00",
                    "WhatsApp": "$282.50",
                    "Facebook": "",
                    "Meep": "",
                    "Ecommerce": "",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": '<i class="icon-ok-circled-1 text-green-600"></i>',
                    "Pasaron a Recoger": "",
                    "Nombre": "Felinda",
                    "Número telefónico": "6260133"
                },
                {
                    "Fecha": "26-septiembre-2025",
                    "Llamada": "$1,374.20",
                    "WhatsApp": "$681.00",
                    "Facebook": "",
                    "Meep": "",
                    "Ecommerce": "",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": '<i class="icon-ok-circled-1 text-green-600"></i>',
                    "Pasaron a Recoger": "",
                    "Nombre": "Jorge Santos",
                    "Número telefónico": "9621383723"
                },
                {
                    "Fecha": "26-septiembre-2025",
                    "Llamada": "$440.00",
                    "WhatsApp": "$286.00",
                    "Facebook": "",
                    "Meep": "",
                    "Ecommerce": "",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": "",
                    "Pasaron a Recoger": '<i class="icon-ok-circled-1 text-green-600"></i>',
                    "Nombre": "Ivett Cifuentes",
                    "Número telefónico": "9621078420"
                },
                {
                    "Fecha": "26-septiembre-2025",
                    "Llamada": "$412.00",
                    "WhatsApp": "$719.00",
                    "Facebook": "",
                    "Meep": "",
                    "Ecommerce": "",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": "",
                    "Pasaron a Recoger": "",
                    "Nombre": "Fabiola Martínez",
                    "Número telefónico": "9622014591"
                },
                {
                    "Fecha": "25-septiembre-2025",
                    "Llamada": "$415.90",
                    "WhatsApp": "$557.20",
                    "Facebook": "",
                    "Meep": "$180.00",
                    "Ecommerce": "",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": "",
                    "Pasaron a Recoger": '<i class="icon-ok-circled-1 text-green-600"></i>',
                    "Nombre": "Ángeles Corea",
                    "Número telefónico": "9621303872"
                },
                {
                    "Fecha": "25-septiembre-2025",
                    "Llamada": "$769.00",
                    "WhatsApp": "",
                    "Facebook": "",
                    "Meep": "",
                    "Ecommerce": "$609.00",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": "",
                    "Pasaron a Recoger": '<i class="icon-ok-circled-1 text-green-600"></i>',
                    "Nombre": "Ziarc Osorio",
                    "Número telefónico": "9621091016"
                },
                {
                    "Fecha": "25-septiembre-2025",
                    "Llamada": "$479.00",
                    "WhatsApp": "$574.00",
                    "Facebook": "",
                    "Meep": "",
                    "Ecommerce": "",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": '<i class="icon-ok-circled-1 text-green-600"></i>',
                    "Pasaron a Recoger": "",
                    "Nombre": "Carolina Camacho",
                    "Número telefónico": "9621103592"
                },
                {
                    "Fecha": "25-septiembre-2025",
                    "Llamada": "$275.00",
                    "WhatsApp": "$245.00",
                    "Facebook": "",
                    "Meep": "",
                    "Ecommerce": "",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": "",
                    "Pasaron a Recoger": '<i class="icon-ok-circled-1 text-green-600"></i>',
                    "Nombre": "Fernando Rivas",
                    "Número telefónico": "9621257599"
                },
                {
                    "Fecha": "25-septiembre-2025",
                    "Llamada": "$539.95",
                    "WhatsApp": "$615.40",
                    "Facebook": "",
                    "Meep": "",
                    "Ecommerce": "",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": "",
                    "Pasaron a Recoger": '<i class="icon-ok-circled-1 text-green-600"></i>',
                    "Nombre": "Sandra Ruiz",
                    "Número telefónico": "9621384402"
                },
                {
                    "Fecha": "25-septiembre-2025",
                    "Llamada": "$292.35",
                    "WhatsApp": "$320.40",
                    "Facebook": "",
                    "Meep": "",
                    "Ecommerce": "",
                    "Uber": "",
                    "Otros": "",
                    "Envio a domicilio": "",
                    "Pasaron a Recoger": "",
                    "Nombre": "Gabriela Ortiz",
                    "Número telefónico": "9621002291"
                }
            ],
            th: "0"
        };
    }

    agregarPedidos() {

    }
}

class Category extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Category";
    }

    render() {
        this.layout();
    }

    layout() {

        this.primaryLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            class: 'w-full border',
            card: {
                filterBar: {
                    class: "w-full my-3",
                    id: "filterBarCategoria"
                },
                container: {
                    class: "w-full my-3 h-full bg-[#1F2A37] rounded-lg p-3",
                    id: "container-categoria"
                }
            }
        });

        // Encabezado
        $("#container-categoria").prepend(`
        <div class="px-4 pt-3 ">
            <h2 class="text-2xl font-semibold ">🏷️ Categorías</h2>
            <p class="text-gray-400">Administra las categorías de productos.</p>
        </div>`);

        this.filterBarCategory();
        this.lsCategory();


    }

    filterBarCategory() {
        const container = $("#container-categoria");
        container.append('<div id="filterbar-categoria" class="mb-3"></div><div id="tabla-categoria"></div>');

        this.createfilterBar({
            parent: "filterbar-categoria",
            data: [

                {
                    opc: "select",
                    id: "selectStatusCategoria",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Todos los estados" },
                        { id: "1", valor: "Activo" },
                        { id: "0", valor: "Inactivo" }
                    ],
                    onchange: "category.lsCategory()"
                },

                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    className: 'w-100',
                    id: "btnNuevaCategoria",
                    text: "Nueva Categoría",
                    onClick: () => this.addCategory(),
                },

            ],
        });
    }

    lsCategory() {
        console.log("Listando Categorías...");
        // this.createTable({
        //     parent: "tabla-categoria",
        //     idFilterBar: "filterbar-categoria",
        //     data: { opc: "lsCategoria" },
        //     coffeesoft: true,
        //     conf: { datatable: true, pag: 10 },
        //     attr: {
        //         id: "tbCategoria",
        //         theme: 'dark',
        //         right: [2],
        //         center: [1]
        //     },
        // });

        this.createCoffeTable({
            parent: "tabla-categoria",
            id: "tbClientes",
            theme: "corporativo",
            data: this.jsonCategory(),
            center: [2],
            right: [4]
        });

    }

    jsonCategory() {
        return {
            "row": [
                {
                    "id": "152",
                    "Categoría": "Pedidos por redes",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Activo</span>',
                        class: "text-center"
                    },
                    "a": [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    "id": "153",
                    "Categoría": "Ventas por redes sociales",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactivo</span>',
                        class: "text-center"
                    },
                    "a": [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    "id": "154",
                    "Categoría": "Envios por Categoria",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactivo</span>',
                        class: "text-center"
                    },
                    "a": [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                }
            ],
            "th": "0"
        };
    }


    addCategory() {
        this.createModalForm({
            id: 'formCategoriaAdd',
            data: { opc: 'addCategoria' },
            bootbox: {
                title: 'Agregar Categoría',
            },
            json: [
                {
                    opc: "input",
                    id: "nombre",
                    lbl: "Nombre de la categoría",
                    class: "col-12 mb-3"
                },
                {
                    opc: "select",
                    id: "estado",
                    lbl: "Estado",
                    class: "col-12 mb-3",
                    data: [
                        { id: "1", valor: "Activo" },
                        { id: "0", valor: "Inactivo" }
                    ]
                },
                {
                    opc: "textarea",
                    id: "descripcion",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCategory();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }


    async editCategory(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getCategoria",
                id: id,
            },
        });

        const categoria = request.data;

        this.createModalForm({
            id: 'formCategoriaEdit',
            data: { opc: 'editCategoria', id: categoria.id },
            bootbox: {
                title: 'Editar Categoría',
            },
            autofill: categoria,
            json: [
                {
                    opc: "input",
                    id: "nombre",
                    lbl: "Nombre de la categoría",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                this.lsCategory();
            },
        });
    }

    statusCategory(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Desea cambiar el estado de la categoría?",
                text: "Esta acción activará o desactivará la categoría.",
                icon: "warning",
            },

            data: {
                opc: "statusCategoria",
                active: active === 1 ? 0 : 1,
                id: id,
            },

            methods: {
                success: () => {
                    this.lsCategory();
                }
            }
        });
    }
}

class Concept extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Concept";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            class: 'w-full p-2',

            card: {
                filterBar: {
                    class: "w-full ",
                    id: "filterBarConcepto"
                },
                container: {
                    class: "w-full my-3 h-full  ",
                    id: "container-concepto"
                }
            }
        });

        // Encabezado
        $("#container-concepto").prepend(`
        <div class="px-3 ">
            <h2 class="text-2xl font-semibold">🧠 Conceptos</h2>
            <p class="text-gray-400">Administra los conceptos asignados a cada categoría.</p>
        </div>
        `);

        this.filterBarConcept();
        this.lsConcept();
    }

    filterBarConcept() {
        const container = $("#container-concepto");
        container.append('<div id="filterbar-concepto" class="mb-3"></div><div id="tabla-concepto"></div>');

        this.createfilterBar({
            parent: "filterbar-concepto",
            data: [
                {
                    opc: "select",
                    id: "selectStatusConcepto",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Todos los estados" },
                        { id: "1", valor: "Activo" },
                        { id: "0", valor: "Inactivo" }
                    ],
                    onchange: "concept.lsConcept()"
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    className: "w-100",
                    id: "btnNuevoConcepto",
                    text: "Nuevo Concepto",
                    onClick: () => this.addConcept(),
                }
            ],
        });
    }

    lsConcept() {
        this.createCoffeTable({
            parent: "tabla-concepto",
            id: "tbConcepto",
            theme: "corporativo",
            data: this.jsonConcept(),
            center: [2],
            right: [4]
        });

        simple_data_table("#tbConcepto", 10);
    }

    jsonConcept() {
        return {
            row: [
                {
                    id: "1",
                    "Concepto": "Entrega inmediata",
                    "Categoría": "Pedidos por redes",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "2",
                    "Concepto": "Requiere validación de stock",
                    "Categoría": "Ventas por redes sociales",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "3",
                    "Concepto": "Llamada",
                    "Categoría": "Atención al cliente",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "4",
                    "Concepto": "Whatsapp",
                    "Categoría": "Pedidos por redes",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "5",
                    "Concepto": "Facebook",
                    "Categoría": "Pedidos por redes",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "6",
                    "Concepto": "Mepp",
                    "Categoría": "Canales digitales",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "7",
                    "Concepto": "Ecommerce",
                    "Categoría": "Ventas por redes sociales",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "8",
                    "Concepto": "Uber",
                    "Categoría": "Ventas por redes sociales",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "9",
                    "Concepto": "Otro",
                    "Categoría": "Ventas por redes sociales",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "10",
                    "Concepto": "Envio a Domicilio",
                    "Categoría": "Logística",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "11",
                    "Concepto": "Pasaron a recoger",
                    "Categoría": "Logística",
                    "Estatus": {
                        html: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-info p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                }
            ],
            th: "0"
        };
    }


    addConcept() {
        this.createModalForm({
            id: 'formConceptoAdd',
            data: { opc: 'addConcepto' },
            bootbox: {
                title: 'Agregar Concepto',
            },
            json: [
                {
                    opc: "input",
                    id: "nombre",
                    lbl: "Nombre del concepto",
                    class: "col-12 mb-3"
                },
                {
                    opc: "select",
                    id: "categoria_id",
                    lbl: "Categoría",
                    class: "col-12 mb-3",
                    data: [], // se llena en init() si aplicas fetch
                    text: "nombre",
                    value: "id"
                },
                {
                    opc: "select",
                    id: "estado",
                    lbl: "Estado",
                    class: "col-12 mb-3",
                    data: [
                        { id: "1", valor: "Activo" },
                        { id: "0", valor: "Inactivo" }
                    ]
                },
                {
                    opc: "textarea",
                    id: "descripcion",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsConcept();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }
}

class Clients extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Clients";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            class: 'w-full p-2',

            card: {
                filterBar: {
                    class: "w-full ",
                    id: "filterBarClients"
                },
                container: {
                    class: "w-full my-3 h-full  ",
                    id: "container-Clients"
                }
            }
        });

        // Encabezado
        $("#container-Clients").prepend(`
        <div class="px-3 ">
            <h2 class="text-2xl font-semibold">🧠 Conceptos</h2>
            <p class="text-gray-400">Administra los conceptos asignados a cada categoría.</p>
        </div>
        `);

        // this.filterBarConcept();
        this.lsClients();
    }

    lsClients() {
        this.createCoffeTable({
            parent: "container-clients",
            id: "tbOrder",
            theme: "corporativo",
            data: this.jsonContactos(),
            center: [2, 3, 4, 5, 6, 7, 8],
            color_group: 'bg-blue-100',
            right: [],
            left: []

        });

        $("#container-clients").prepend(`

            <div class="w-full p-2 my-3">
            <div class="flex items-center gap-6 mb-2">
                <!-- Facebook -->
                <div class="flex items-center gap-2">
                <span class="font-medium">Facebook:</span>
                <span style="width:14px;height:14px;background-color:#1877F2;display:inline-block;border-radius:2px;"></span>
                <span style="width:14px;height:14px;background-color:#1877F2;display:inline-block;border-radius:2px;"></span>
                <span style="width:14px;height:14px;background-color:#1877F2;display:inline-block;border-radius:2px;"></span>
                <span class="text-sm text-gray-600">FB 1, FB 2, FB 3</span>
                </div>

                <!-- Instagram -->
                <div class="flex items-center gap-2">
                <span class="font-medium">Instagram:</span>
                <span style="width:14px;height:14px;background-color:#E1306C;display:inline-block;border-radius:2px;"></span>
                <span style="width:14px;height:14px;background-color:#E1306C;display:inline-block;border-radius:2px;"></span>
                <span style="width:14px;height:14px;background-color:#E1306C;display:inline-block;border-radius:2px;"></span>
                <span class="text-sm text-gray-600">IG 1, IG 2, IG 3</span>
                </div>

                <!-- TikTok -->
                <div class="flex items-center gap-2">
                <span class="font-medium">TikTok:</span>
                <span style="width:14px;height:14px;background-color:#444;display:inline-block;border-radius:2px;"></span>
                <span class="text-sm text-gray-600">TikTok</span>
                </div>
            </div>

            <!-- Promoción Activa -->
            <div class="mt-2 bg-yellow-50 border-l-4 border-yellow-300 p-2 rounded flex items-center">
                <span class="mr-2">🎯</span>
                <span class="font-semibold text-yellow-800">Promoción Activa:</span>
                <span class="ml-1 text-yellow-900">PROMO VINO - PROMO 6 HRS</span>
            </div>
            </div>
        `);

    }

    jsonContactos() {
        return {
            row: [
                {
                    "Medio": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">WhatsApp</span>',
                    "Nombre": "Sebastián Luna Pineda",
                    "Telefono": "971 117 5407",
                    "Confirmado": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">✔ Confirmado</span>',
                    "FB1": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB2": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB3": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "IG1": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG2": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG3": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "TikTok": '<div style="width:12px;height:12px;background-color:#E5E7EB;display:inline-block;border-radius:2px;"></div>'
                },
                {
                    "Medio": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">WhatsApp</span>',
                    "Nombre": "Luna",
                    "Telefono": "962 190 1299",
                    "Confirmado": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">✔ Confirmado</span>',
                    "FB1": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB2": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB3": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "IG1": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG2": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG3": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "TikTok": '<div style="width:12px;height:12px;background-color:#E5E7EB;display:inline-block;border-radius:2px;"></div>'
                },
                {
                    "Medio": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">WhatsApp</span>',
                    "Nombre": "Sr. Jorge",
                    "Telefono": "962 150 5975",
                    "Confirmado": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">✔ Confirmado</span>',
                    "FB1": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB2": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB3": "",
                    "IG1": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG2": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG3": "",
                    "TikTok": '<div style="width:12px;height:12px;background-color:#E5E7EB;display:inline-block;border-radius:2px;"></div>'
                },
                {
                    "Medio": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">WhatsApp</span>',
                    "Nombre": "Manuel González",
                    "Telefono": "961 253 1572",
                    "Confirmado": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">✔ Confirmado</span>',
                    "FB1": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB2": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB3": "",
                    "IG1": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG2": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG3": "",
                    "TikTok": '<div style="width:12px;height:12px;background-color:#E5E7EB;display:inline-block;border-radius:2px;"></div>'
                },
                {
                    "Medio": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">WhatsApp</span>',
                    "Nombre": "Alfonso Gordillo",
                    "Telefono": "521962193639",
                    "Confirmado": '<span class="px-2 py-1 rounded-full text-xs font-bold text-yellow-600 bg-yellow-100">⚠ Pendiente</span>',
                    "FB1": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB2": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB3": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "IG1": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG2": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG3": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "TikTok": '<div style="width:12px;height:12px;background-color:#000000;display:inline-block;border-radius:2px;"></div>'
                },
                {
                    "Medio": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">WhatsApp</span>',
                    "Nombre": "Gretel Muñoz",
                    "Telefono": "962 271 1887",
                    "Confirmado": '<span class="px-2 py-1 rounded-full text-xs font-bold text-yellow-600 bg-yellow-100">⚠ Pendiente</span>',
                    "FB1": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB2": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB3": "",
                    "IG1": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG2": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG3": "",
                    "TikTok": '<div style="width:12px;height:12px;background-color:#E5E7EB;display:inline-block;border-radius:2px;"></div>'
                },
                {
                    "Medio": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">WhatsApp</span>',
                    "Nombre": "Uriel de Jesús",
                    "Telefono": "521962147771",
                    "Confirmado": '<span class="px-2 py-1 rounded-full text-xs font-bold text-yellow-600 bg-yellow-100">⚠ Pendiente</span>',
                    "FB1": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB2": '<div style="width:12px;height:12px;background-color:#1877F2;display:inline-block;border-radius:2px;"></div>',
                    "FB3": "",
                    "IG1": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG2": '<div style="width:12px;height:12px;background-color:#E1306C;display:inline-block;border-radius:2px;"></div>',
                    "IG3": "",
                    "TikTok": '<div style="width:12px;height:12px;background-color:#E5E7EB;display:inline-block;border-radius:2px;"></div>'
                }
            ],
            th: "0"
        };
    }








}

class OrderDashboard extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Dashboard";
    }

    init() {
        this.renderDashboard();
    }

    renderDashboard() {

        // let udn = $('#filterBarDashboard #udn').val();
        // let month = $('#filterBarDashboard #mes').val();
        // let year = $('#filterBarDashboard #anio').val();

        // let mkt = await useFetch({
        //     url: api_marketing,
        //     data: {
        //         opc: "init",
        //         udn: udn,
        //         month: month,
        //         year: year,
        //     },
        // });

        $("#container-dashboard").html(`
            <div class=" font-sans  mx-auto">

            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                <h1 class="text-2xl font-bold text-[#103B60]">Dashboard de Ventas</h1>
                <p class="text-sm text-gray-600 mt-1 ">Análisis anual, por período y por hora</p>
                </div>
            </div>


            <!-- KPIs -->
            <div class=" p-4 my-2" id="containerKpi"></div>

            <!-- Resto del dashboard (gráficas, tabla, etc.) -->

            <div class="grid lg:grid-cols-2 gap-4 mb-2">
                <div class="bg-white rounded-lg shadow-sm p-3 " id="barPedidoMes"></div>
                <div class="bg-white rounded-lg shadow-sm p-3 " id="containerBar"></div>
            </div>


            <div class="grid lg:grid-cols-2 gap-4 mb-2">
            <div class="bg-white rounded-lg shadow-sm p-3 " id="estadisticasVentas"></div>
                <div class="bg-white rounded-lg shadow-sm p-3 " id="tableMensual"></div>
            </div>

            <div class="bg-white rounded-xl shadow overflow-auto">


            </div>
        `);


        this.cardsDashboard({
            parent: "containerKpi", // Cambia esto por el contenedor real
            id: "cardsPedidos",
            class: "mb-6",
            theme: "light",
            json: [
                {
                    title: "Ingresos Totales",
                    data: {
                        value: "$1,464,429.69",
                        description: "📈 21.0% vs mes anterior",
                        color: "text-green-700"
                    }
                },
                {
                    title: "Total Pedidos",
                    data: {
                        value: "1,509",
                        description: "Enero - Agosto 2025",
                        color: "text-orange-800"
                    }
                },
                {
                    title: "Valor Promedio",
                    data: {
                        value: "$970",
                        description: "Por pedido",
                        color: "text-blue-700"
                    }
                },
                {
                    title: "Canal Principal",
                    data: {
                        value: "WhatsApp",
                        description: "57.9% del total",
                        color: "text-green-800"
                    }
                }
            ]
        });

        this.barChart({ parent: 'containerBar', data: this.jsonBar() });


        this.linearChart({
            parent: 'barPedidoMes',
            title: 'Pedidos por mes del año 2025',
            data: {
                labels: ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO"],
                tooltip: [
                    "Enero 2025", "Febrero 2025", "Marzo 2025", "Abril 2025",
                    "Mayo 2025", "Junio 2025", "Julio 2025", "Agosto 2025"
                ],
                datasets: [
                    {
                        label: "Total de Pedidos",
                        data: [199, 167, 179, 164, 197, 212, 170, 221],
                        borderColor: "rgba(30, 58, 138, 1)",        // Azul oscuro (línea)
                        backgroundColor: "rgba(30, 58, 138, 0.1)",  // Azul claro (relleno)
                        tension: 0.4
                    }
                ]
            }

        });

        this.canalesRendimiento({
            parent: "estadisticasVentas",
            id: "rankingCanales",
            json: this.jsonCanales()
        });

        this.lsRendimientoMensual();


    }

    cardsDashboard(options) {
        const defaults = {
            parent: "root",
            id: "infoCardKPI",
            class: "",
            theme: "light", // light | dark
            json: [],
            data: {
                value: "0",
                description: "",
                color: "text-gray-800"
            },
            onClick: () => { }
        };

        const opts = Object.assign({}, defaults, options);

        const isDark = opts.theme === "dark";

        const cardBase = isDark
            ? "bg-[#1F2A37] text-white rounded-xl shadow"
            : "bg-white text-gray-800 rounded-xl shadow";

        const titleColor = isDark ? "text-gray-300" : "text-gray-600";
        const descColor = isDark ? "text-gray-400" : "text-gray-500";

        const renderCard = (card, i = "") => {
            const box = $("<div>", {
                id: `${opts.id}_${i}`,
                class: `${cardBase} p-4`
            });

            const title = $("<p>", {
                class: `text-sm ${titleColor}`,
                text: card.title
            });

            const value = $("<p>", {
                id: card.id || "",
                class: `text-2xl font-bold ${card.data?.color || "text-white"}`,
                text: card.data?.value
            });

            const description = $("<p>", {
                class: `text-xs mt-1 ${card.data?.color || descColor}`,
                text: card.data?.description
            });

            box.append(title, value, description);
            return box;
        };

        const container = $("<div>", {
            id: opts.id,
            class: `grid grid-cols-2 md:grid-cols-4 gap-4 ${opts.class}`
        });

        if (opts.json.length > 0) {
            opts.json.forEach((item, i) => {
                container.append(renderCard(item, i));
            });
        } else {
            container.append(renderCard(opts));
        }

        $(`#${opts.parent}`).html(container);
    }

    barChart(options) {
        const defaults = {
            parent: "containerChequePro",
            id: "chart",
            title: "",
            class: "border p-4 rounded-xl",
            data: {},
            json: [],
            onShow: () => { },
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", { class: opts.class });

        const title = $("<h2>", {
            class: "text-lg font-bold mb-2",
            text: opts.title
        });

        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-[300px]"
        });

        container.append(title, canvas);
        $('#' + opts.parent).append(container); // 🔹 cambio: append en vez de html()

        const ctx = document.getElementById(opts.id).getContext("2d");

        // 🔹 guardar instancias de charts en un objeto
        if (!window._charts) window._charts = {};

        if (window._charts[opts.id]) {
            window._charts[opts.id].destroy();
        }

        window._charts[opts.id] = new Chart(ctx, {
            type: "bar",
            data: opts.data,
            options: {
                responsive: true,
                animation: {
                    onComplete: function () { }
                },
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${formatPrice(ctx.parsed.y)}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (v) => formatPrice(v)
                        }
                    }
                }
            }
        });
    }

    jsonBar() {
        return {
            labels: [
                "enero 2025", "febrero 2025", "marzo 2025", "abril 2025",
                "mayo 2025", "junio 2025", "julio 2025", "agosto 2025",
                "septiembre 2025", "octubre 2025", "noviembre 2025", "diciembre 2025"
            ],
            datasets: [
                {
                    label: "Ecommerce",
                    data: [8, 15, 17, 18, 21, 21, 14, 11, 0, 0, 0, 0],
                    backgroundColor: "#FF9800" // Naranja
                },
                {
                    label: "Meep",
                    data: [10, 5, 11, 4, 10, 10, 5, 6, 0, 0, 0, 0],
                    backgroundColor: "#FFEB3B"
                },
                {
                    label: "Facebook",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "#1877F2"
                },
                {
                    label: "WhatsApp",
                    data: [129, 79, 93, 86, 107, 115, 100, 95, 0, 0, 0, 0],
                    backgroundColor: "#25D366"
                },
                {
                    label: "Llamada",
                    data: [49, 62, 54, 51, 53, 63, 48, 96, 0, 0, 0, 0],
                    backgroundColor: "#00BCD4" // Celeste
                },
                {
                    label: "Uber",
                    data: [3, 5, 4, 4, 4, 3, 3, 5, 0, 0, 0, 0],
                    backgroundColor: "#000000"
                },
                {
                    label: "Otro",
                    data: [0, 1, 0, 1, 2, 0, 0, 8, 0, 0, 0, 0],
                    backgroundColor: "#9E9E9E"
                }
            ]
        };
    }


    //

    linearChart(options) {
        const defaults = {
            parent: "containerLineChart",
            id: "linearChart",
            title: "",
            class: "border p-3 rounded-xl",
            data: {},   // <- puede contener { labels: [], datasets: [], tooltip: [] }
            json: [],
            onShow: () => { },
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", { class: opts.class });
        const title = $("<h2>", {
            class: "text-lg font-bold mb-2",
            text: opts.title
        });
        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-[150px]"
        });

        container.append(title, canvas);
        $('#' + opts.parent).append(container);

        const ctx = document.getElementById(opts.id).getContext("2d");
        if (!window._charts) window._charts = {};
        if (window._charts[opts.id]) {
            window._charts[opts.id].destroy();
        }

        window._charts[opts.id] = new Chart(ctx, {
            type: "line",
            data: opts.data,
            options: {
                responsive: true,
                aspectRatio: 3,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                const index = items[0].dataIndex;
                                const tooltips = opts.data.tooltip || opts.data.labels;
                                return tooltips[index];
                            },
                            label: (ctx) => `${ctx.dataset.label}: ${formatPrice(ctx.parsed.y)}`
                        }
                    },
                    datalabels: {
                        display: true,
                        align: 'top',
                        anchor: 'end',
                        color: '#1E3A8A',
                        font: {
                            weight: 'bold',
                            size: 12
                        },
                        formatter: (value) => value
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (v) => v
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    canalesRendimiento(options) {
        const defaults = {
            parent: "root",
            id: "canalesRendimiento",
            title: "Canales con Mejor Rendimiento",
            class: "bg-white rounded-xl p-4  text-sm",
            json: [
                { color: "bg-green-500", canal: "WhatsApp", total: 814, porcentaje: "47.6%" },
                { color: "bg-blue-500", canal: "Llamada", total: 526, porcentaje: "30.8%" },
                { color: "bg-purple-500", canal: "Ecommerce", total: 125, porcentaje: "7.3%" },
                { color: "bg-yellow-500", canal: "Meep", total: 71, porcentaje: "4.2%" },
                { color: "bg-red-500", canal: "Uber", total: 30, porcentaje: "1.8%" }
            ]
        };

        const opts = Object.assign({}, defaults, options);

        // 🧮 Calcular total general
        const totalPedidos = opts.json.reduce((acc, item) => acc + item.total, 0);

        const container = $(`
            <div id="${opts.id}" class="${opts.class}">
            <div class="border-b pb-2 mb-3">
                <h2 class="text-base font-semibold text-gray-800">${opts.title}</h2>
                <p class="text-sm text-gray-500 mt-1">📦 Total: <span class="font-bold text-gray-700">${formatPrice(totalPedidos)} pedidos</span></p>
            </div>
            <div class="space-y-3" id="items-${opts.id}"></div>
            </div>
        `);

        opts.json.forEach(item => {
            const row = $(`
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full ${item.color}"></span>
                <span class="text-gray-700">${item.canal}</span>
                </div>
                <div class="text-end">
                <div class="font-semibold text-gray-800">${formatPrice(item.total)} pedidos</div>
                <div class="text-xs text-gray-400">${item.porcentaje} del total</div>
                </div>
            </div>
            `);
            container.find(`#items-${opts.id}`).append(row);
        });

        $(`#${opts.parent}`).append(container);
    }

    lsRendimientoMensual(data) {
        this.createCoffeTable({
            parent: "tableMensual",
            id: "tblRendimientoMensual",
            title: "🎯 Rendimiento mensual",
            theme: "corporativo",
            center: [2, 4],
            right: [3],
            data: this.jsonRendimientoMensual()
        });

    }


    // Jsons:

    jsonCanales(){

        return [
            { color: "bg-blue-500", canal: "Llamada", total: 89254.58, porcentaje: "41.0%" },
            { color: "bg-green-500", canal: "WhatsApp", total: 105373.77, porcentaje: "48.4%" },
            { color: "bg-yellow-500", canal: "Meep", total: 6366.70, porcentaje: "2.9%" },
            { color: "bg-purple-500", canal: "Ecommerce", total: 12249.98, porcentaje: "5.6%" },
            { color: "bg-red-500", canal: "Uber", total: 2865.00, porcentaje: "1.3%" },
            { color: "bg-gray-500", canal: "Otro", total: 1550.00, porcentaje: "0.7%" }
        ]
    }

    jsonRendimientoMensual() {
        return {
            row: [
                {
                    "id": 0,
                    "Mes": "Enero 2025",
                    "Pedidos": 0,
                    "Ventas": formatPrice(186743.23),
                    "Crecimiento": '<span class="px-2 py-1 rounded-full text-xs font-bold text-gray-600 bg-gray-100">-</span>',
                    "opc": 0
                },
                {
                    "id": 0,
                    "Mes": "Febrero 2025",
                    "Pedidos": 0,
                    "Ventas": formatPrice(151030.91),
                    "Crecimiento": '<span class="px-2 py-1 rounded-full text-xs font-bold text-red-600 bg-red-100">-19.1%</span>',
                    "opc": 0
                },
                {
                    "id": 0,
                    "Mes": "Marzo 2025",
                    "Pedidos": 0,
                    "Ventas": formatPrice(167363.59),
                    "Crecimiento": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">+10.8%</span>',
                    "opc": 0
                },
                {
                    "id": 0,
                    "Mes": "Abril 2025",
                    "Pedidos": 0,
                    "Ventas": formatPrice(159412.67),
                    "Crecimiento": '<span class="px-2 py-1 rounded-full text-xs font-bold text-red-600 bg-red-100">-4.8%</span>',
                    "opc": 0
                },
                {
                    "id": 0,
                    "Mes": "Mayo 2025",
                    "Pedidos": 0,
                    "Ventas": formatPrice(189910.64),
                    "Crecimiento": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">+19.1%</span>',
                    "opc": 0
                },
                {
                    "id": 0,
                    "Mes": "Junio 2025",
                    "Pedidos": 0,
                    "Ventas": formatPrice(211860.63),
                    "Crecimiento": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">+11.5%</span>',
                    "opc": 0
                },
                {
                    "id": 0,
                    "Mes": "Julio 2025",
                    "Pedidos": 0,
                    "Ventas": formatPrice(179948.99),
                    "Crecimiento": '<span class="px-2 py-1 rounded-full text-xs font-bold text-red-600 bg-red-100">-15.1%</span>',
                    "opc": 0
                },
                {
                    "id": 0,
                    "Mes": "Agosto 2025",
                    "Pedidos": 0,
                    "Ventas": formatPrice(217660.03),
                    "Crecimiento": '<span class="px-2 py-1 rounded-full text-xs font-bold text-green-600 bg-green-100">+20.9%</span>',
                    "opc": 0
                }
            ],
            th: "0"
        };
    }





}
