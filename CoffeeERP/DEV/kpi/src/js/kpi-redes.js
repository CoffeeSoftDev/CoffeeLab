// Redes Module


class DashboardRedes extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Dashboard";
    }

    render() {
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
                <h1 class="text-2xl font-bold text-[#103B60]">Dashboard de redes sociales</h1>
                <p class="text-sm text-gray-600 mt-1 ">Análisis anual, por período y por hora</p>
                </div>
            </div>


            <!-- KPIs -->
            <div class=" p-4 my-2" id="containerKpi"></div>

            <!-- Resto del dashboard (gráficas, tabla, etc.) -->


            <div class="grid lg:grid-cols-2 gap-4 mb-2">
            <!-- Cheque Promedio A & B -->
            <div class="bg-white rounded-lg shadow-sm p-3 max-h-[90vh]" id="containerBar"></div>


            <div class="bg-white rounded-lg shadow-sm p-3 " id="containerComparation">
              <div id="containerVentas" class="overflow-auto max-h-[90vh]"></div>
            </div>
            </div>


        `);


        this.cardsDashboard({
            parent: "containerKpi",
            id: "cardsMKT",
            class: "mb-6",
            theme: "light",
            json: [
                {
                    title: "Total Alcance",
                    data: {
                        value: "865,186",
                        description: "+135.1% vs mes anterior",
                        color: "text-blue-700"
                    }
                },
                {
                    title: "Interacciones",
                    data: {
                        value: "23,142",
                        description: "+3116.3% vs mes anterior",
                        color: "text-green-700"
                    }
                },
                {
                    title: "Visualizaciones de julio",
                    data: {
                        value: "2,293,285",
                        description: "+144.5% vs mes anterior",
                        color: "text-indigo-700"
                    }
                },
                {
                    title: "Inversión Total",
                    data: {
                        value: "$3,200.00",
                        description: "+66.7% vs mes anterior",
                        color: "text-orange-700"
                    }
                }
            ]
        });


        this.barChart({ id: 'cart', parent: 'containerBar', data: this.jsonLikesComparacion() });
        this.pieChart({
            id: 'ventas', parent: 'containerVentas',

            id: "likesDistribucion",
            title: "Distribución - Likes a la Página (2025)",
            data: {
                labels: ["FB", "Google", "TIKTOK", "INSTA"],
                datasets: [
                    {
                        data: [25, 20, 30, 25], // porcentajes de ejemplo
                        backgroundColor: [
                            "#1877F2", // FB
                            "#DB4437", // Google
                            "#29E8E3", // TikTok (oscuro)
                            "#E1306C"  // Insta
                        ],
                        borderWidth: 2,
                        hoverOffset: 8
                    }
                ]
            }

        });


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

    pieChart(options) {

        const defaults = {
            parent: "containerComparation",
            id: "pieChart",
            title: "",
            class: "border p-4 rounded-xl",
            type: "doughnut", // o "pie"
            data: {},
            json: [],
            onShow: () => { }
        };

        const opts = Object.assign({}, defaults, options);

        // Contenedor base
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
        $("#" + opts.parent).append(container); // append permite varios charts

        const ctx = document.getElementById(opts.id).getContext("2d");

        // Control de múltiples instancias
        if (!window._charts) window._charts = {};
        if (window._charts[opts.id]) {
            window._charts[opts.id].destroy();
        }

        // Renderiza gráfico
        window._charts[opts.id] = new Chart(ctx, {
            type: opts.type,
            data: opts.data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "right",
                        labels: {
                            color: "#1E88E5",
                            font: { size: 14 },
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label} ${data.datasets[0].data[i]}%`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].backgroundColor[i],
                                    hidden: false,
                                    index: i
                                }));
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
                        }
                    }
                }
            }
        });
    }



    jsonBar() {
        return {
            labels: [
                "enero 2025", "febrero 2025", "marzo 2025", "abril 2025", "mayo 2025",
                "junio 2025", "julio 2025", "agosto 2025", "septiembre 2025", "octubre 2025",
                "noviembre 2025", "diciembre 2025"
            ],
            datasets: [
                {
                    label: "Ecommerce",
                    data: [5, 3, 4, 6, 7, 6, 4, 7, 0, 0, 0, 0],
                    backgroundColor: "#4CAF50"
                },
                {
                    label: "Meep",
                    data: [7, 6, 8, 6, 6, 6, 5, 6, 0, 0, 0, 0],
                    backgroundColor: "#FFEB3B"
                },
                {
                    label: "Facebook",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "#9E9E9E"
                },
                {
                    label: "WhatsApp",
                    data: [201, 190, 187, 211, 212, 213, 192, 215, 0, 0, 0, 0],
                    backgroundColor: "#FF5722"
                },
                {
                    label: "Llamada",
                    data: [0, 2, 0, 4, 2, 4, 0, 3, 0, 0, 0, 0],
                    backgroundColor: "#2196F3"
                }
            ]
        };

    }

    jsonLikesComparacion() {
        return {
            labels: ["FACEBOOK", "INSTAGRAM", "TIKTOK", "WHATSAPP"],
            datasets: [
                {
                    label: "Periodo Anterior",
                    data: [10500, 8500, 5000, 3000], // 🔹 valores de ejemplo (gris)
                    backgroundColor: "#9E9E9E"
                },
                {
                    label: "Periodo Actual",
                    data: [12000, 15800, 7900, 4300], // 🔹 valores de ejemplo (azul)
                    backgroundColor: "#2196F3"
                }
            ]
        };
    }




}

class CapturaRedes extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "redes";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: {
                    class: "w-full",
                    id: "filterBarCaptura"
                },
                container: {
                    class: "w-full my-3 h-full rounded-lg p-3",
                    id: "container-captura-redes"
                }
            }
        });

        $("#container-capturaRedes").prepend(`
            <div class="px-4 pt-3">
                <h2 class="text-xl font-bold">📊 Captura de métricas por Red Social</h2>
                <p class="text-gray-500 text-sm">Monitoreo mensual de indicadores clave por canal.</p>
            </div>
        `);

        this.filterBarCaptura();
        this.lsCaptura();
    }

    filterBarCaptura() {
        $("#container-captura-redes").prepend(`
            <div id="filterbar-captura" class="mb-3"></div>
            <div id="tabla-captura-redes"></div>
        `);

        this.createfilterBar({
            parent: "filterbar-captura",
            data: [
                {
                    opc: "select",
                    id: "redSocial",
                    class: "col-md-3",
                    lbl: "Red Social",
                    data: [
                        { id: "facebook", valor: "FACEBOOK" },
                        { id: "instagram", valor: "INSTAGRAM" },
                        { id: "tiktok", valor: "TIKTOK" }
                    ],
                    onchange: "redes.lsCaptura()"
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
                    onchange: "redes.lsCaptura()"
                },
                {
                    opc: "select",
                    id: "report",
                    class: "col-md-2",
                    lbl: "Reporte",
                    data: [
                        { id: 1, valor: "Concentrado anual" },
                        { id: 2, valor: "Comparativa mensual" },
                        { id: 3, valor: "Comparativa anual" },
                    ],
                    onchange: "redes.lsCaptura()"
                },


                {
                    opc: "button",
                    class: "col-md-3",
                    className: "w-100",
                    id: "btnNuevaCaptura",
                    text: "+ Nueva captura mensual",
                    onClick: () => this.agregarCaptura()
                }
            ]
        });
    }

    lsCaptura() {
        const red = $("#redSocial").val();
        const reporte = $("#report").val();
        let data = {};

        if (red === "facebook") {
            if (reporte == "2") {
                data = this.jsonComparacionFacebook();
            }
            else if (reporte == "3") {
                data = this.jsonComparacionFacebookAnual();
            }
            else {
                data = this.jsonCapturaRedes();
            }
        } else if (red === "instagram") {
            if (reporte == "2") {
                data = this.jsonComparacionInstagram(); // <-- deberás implementarlo
            } else {
                data = this.jsonCapturaInstagram();
            }
        } else if (red === "tiktok") {
            if (reporte == "2") {
                data = this.jsonComparacionTikTok(); // <-- opcional
            } else {
                data = this.jsonCapturaTikTok(); // <-- opcional
            }
        }

        this.createCoffeTable({
            parent: "tabla-captura-redes",
            id: "tbCapturaRedes",
            theme: "corporativo",
            data: data,
            f_size: 14,
            center: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            color_group: 'bg-blue-100'
        });
    }

    jsonCapturaRedes() {
        return {
            row: [
                {
                    "Métrica": "Likes a la página",
                    "Enero": 11240,
                    "Febrero": 11332,
                    "Marzo": 11517,
                    "Abril": 11658,
                    "Mayo": 12287,
                    "Junio": 11478,
                    "Julio": 11733,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 418
                },
                {
                    "Métrica": "Alcance",
                    "Enero": 345293,
                    "Febrero": 227340,
                    "Marzo": 1076046,
                    "Abril": 307188,
                    "Mayo": 747157,
                    "Junio": 368013,
                    "Julio": 865186,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 8336263
                },
                {
                    "Métrica": "Mensajes",
                    "Enero": 4,
                    "Febrero": 2,
                    "Marzo": 21,
                    "Abril": 5,
                    "Mayo": 8,
                    "Junio": 6,
                    "Julio": 8,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 38
                },
                {
                    "Métrica": "Visitas",
                    "Enero": 5116,
                    "Febrero": 5935,
                    "Marzo": 5226,
                    "Abril": 4610,
                    "Mayo": 10337,
                    "Junio": 6516,
                    "Julio": 22641,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 59227
                },
                {
                    "Métrica": "Visualizaciones",
                    "Enero": 773748,
                    "Febrero": 673111,
                    "Marzo": 378101,
                    "Abril": 806540,
                    "Mayo": 2103937,
                    "Junio": 838946,
                    "Julio": 2293285,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 7875412
                },
                {
                    "Métrica": "Interacciones con el contenido",
                    "Enero": 523,
                    "Febrero": 432,
                    "Marzo": 666,
                    "Abril": 504,
                    "Mayo": 2035,
                    "Junio": 721,
                    "Julio": 1319,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 6234
                },
                {
                    "Métrica": "Clics en el enlace",
                    "Enero": 90,
                    "Febrero": 148,
                    "Marzo": 1641,
                    "Abril": 573,
                    "Mayo": 1048,
                    "Junio": 526,
                    "Julio": 435,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 4493
                },
                {
                    "Métrica": "Número de publicaciones",
                    "Enero": 11,
                    "Febrero": 12,
                    "Marzo": 5,
                    "Abril": 9,
                    "Mayo": 12,
                    "Junio": 16,
                    "Julio": 18,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 83
                },
                {
                    "Métrica": "Número de publicaciones pautadas",
                    "Enero": 4,
                    "Febrero": 2,
                    "Marzo": 4,
                    "Abril": 2,
                    "Mayo": 4,
                    "Junio": 4,
                    "Julio": 4,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 24
                },
                {
                    "Métrica": "Inversión total de pautas",
                    "Enero": "$1,373.31",
                    "Febrero": "$1,350.33",
                    "Marzo": "$2,786.73",
                    "Abril": "######",
                    "Mayo": "######",
                    "Junio": "$1,313.62",
                    "Julio": "######",
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": "######"
                }
            ],
            th: "0"
        };
    }

    jsonCapturaInstagram() {
        return {
            row: [
                {
                    "Métrica": "Seguidores",
                    "Enero": 1553,
                    "Febrero": 1568,
                    "Marzo": 1612,
                    "Abril": 1648,
                    "Mayo": 1666,
                    "Junio": 1683,
                    "Julio": 1719,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 1665
                },
                {
                    "Métrica": "Visualizaciones",
                    "Enero": 358373,
                    "Febrero": 328628,
                    "Marzo": 474523,
                    "Abril": 521715,
                    "Mayo": 572441,
                    "Junio": 339873,
                    "Julio": 265538,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 2860103
                },
                {
                    "Métrica": "Publicaciones",
                    "Enero": 12,
                    "Febrero": 11,
                    "Marzo": 8,
                    "Abril": 13,
                    "Mayo": 11,
                    "Junio": 15,
                    "Julio": 12,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 82
                },
                {
                    "Métrica": "Publicaciones pautadas",
                    "Enero": 2,
                    "Febrero": 1,
                    "Marzo": 4,
                    "Abril": 3,
                    "Mayo": 1,
                    "Junio": 5,
                    "Julio": 6,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 22
                },
                {
                    "Métrica": "Inversión total de pautas",
                    "Enero": "$1,375.70",
                    "Febrero": "######",
                    "Marzo": "$2,364.00",
                    "Abril": "$1,176.68",
                    "Mayo": "$4,139.37",
                    "Junio": "######",
                    "Julio": "$1,200.00",
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": "14123"
                },
                {
                    "Métrica": "Cuentas alcanzadas",
                    "Enero": 281553,
                    "Febrero": 124174,
                    "Marzo": 171686,
                    "Abril": 144235,
                    "Mayo": 231430,
                    "Junio": 164650,
                    "Julio": 111371,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 1167100
                },
                {
                    "Métrica": "Interacciones",
                    "Enero": 176,
                    "Febrero": 197,
                    "Marzo": 168,
                    "Abril": 182,
                    "Mayo": 197,
                    "Junio": 150,
                    "Julio": 850,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 1415
                },
                {
                    "Métrica": "Interacciones con las publicaciones",
                    "Enero": 70,
                    "Febrero": 66,
                    "Marzo": 62,
                    "Abril": 70,
                    "Mayo": 74,
                    "Junio": 60,
                    "Julio": 3,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 405
                },
                {
                    "Métrica": "Interacciones con las historias",
                    "Enero": 6,
                    "Febrero": 8,
                    "Marzo": 2,
                    "Abril": 8,
                    "Mayo": 10,
                    "Junio": 6,
                    "Julio": 15,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 55
                },
                {
                    "Métrica": "Interacciones de Reels",
                    "Enero": 54,
                    "Febrero": 3,
                    "Marzo": 14,
                    "Abril": 33,
                    "Mayo": 46,
                    "Junio": 78,
                    "Julio": 162,
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": 383
                },
                {
                    "Métrica": "Engagement",
                    "Enero": "11%",
                    "Febrero": "13%",
                    "Marzo": "11%",
                    "Abril": "11%",
                    "Mayo": "12%",
                    "Junio": "12%",
                    "Julio": "16%",
                    "Agosto": "",
                    "Septiembre": "",
                    "Octubre": "",
                    "Noviembre": "",
                    "Diciembre": "",
                    "TOTAL": "1"
                }
            ],
            th: "0"
        };
    }

    jsonComparacionFacebook() {
        return {
            row: [
                {
                    "Métrica": "Likes a la página",
                    "Junio-2025": 14873,
                    "Julio-2025": 11733,
                    "Comparación": 2254,
                    "%": "15.1%"
                },
                {
                    "Métrica": "Alcance",
                    "Junio-2025": 368013,
                    "Julio-2025": 865186,
                    "Comparación": 497173,
                    "%": "135.1%"
                },
                {
                    "Métrica": "Mensajes",
                    "Junio-2025": 6,
                    "Julio-2025": 8,
                    "Comparación": 2,
                    "%": "200.0%"
                },
                {
                    "Métrica": "Visitas",
                    "Junio-2025": 4616,
                    "Julio-2025": 22641,
                    "Comparación": 18025,
                    "%": "390.5%"
                },
                {
                    "Métrica": "Visualizaciones",
                    "Junio-2025": 936946,
                    "Julio-2025": 2293285,
                    "Comparación": 1354339,
                    "%": "144.5%"
                },
                {
                    "Métrica": "Interacciones con el contenido",
                    "Junio-2025": 721,
                    "Julio-2025": 23142,
                    "Comparación": 22473,
                    "%": "3116.3%"
                },
                {
                    "Métrica": "Clics en el enlace",
                    "Junio-2025": 528,
                    "Julio-2025": 435,
                    "Comparación": -93,
                    "%": "-6.3%"
                },
                {
                    "Métrica": "Número de publicaciones",
                    "Junio-2025": 16,
                    "Julio-2025": 18,
                    "Comparación": 2,
                    "%": "12.5%"
                },
                {
                    "Métrica": "Inversión total de pautas",
                    "Junio-2025": "$1,919.62",
                    "Julio-2025": "$3,200.00",
                    "Comparación": "$1,280.38",
                    "%": "66.7%"
                }
            ],
            th: "0"
        };
    }

    jsonComparacionFacebookAnual() {
        return {
            row: [
                {
                    "id": 0,
                    "Métrica": "Likes a la página",
                    "Año-2024": 10401,
                    "Año-2025": 12237,
                    "Comparación": 1836,
                    "%": "17.7%",
                    "opc": 0
                },
                {
                    "id": 0,
                    "Métrica": "Alcance",
                    "Año-2024": 292215,
                    "Año-2025": 747197,
                    "Comparación": 454982,
                    "%": "155.7%",
                    "opc": 0
                },
                {
                    "id": 0,
                    "Métrica": "Mensajes",
                    "Año-2024": 33,
                    "Año-2025": 2,
                    "Comparación": -31,
                    "%": "-93.3%",
                    "opc": 0
                },
                {
                    "id": 0,
                    "Métrica": "Visitas",
                    "Año-2024": 4386,
                    "Año-2025": 10937,
                    "Comparación": 6551,
                    "%": "149.4%",
                    "opc": 0
                },
                {
                    "id": 0,
                    "Métrica": "Visualizaciones",
                    "Año-2024": "-",
                    "Año-2025": 2013087,
                    "Comparación": 2013087,
                    "%": "-",
                    "opc": 0
                },
                {
                    "id": 0,
                    "Métrica": "Interacciones con el contenido",
                    "Año-2024": "-",
                    "Año-2025": 2835,
                    "Comparación": 2835,
                    "%": "-",
                    "opc": 0
                },
                {
                    "id": 0,
                    "Métrica": "Clics en el enlace",
                    "Año-2024": "-",
                    "Año-2025": 1048,
                    "Comparación": 1048,
                    "%": "-",
                    "opc": 0
                },
                {
                    "id": 0,
                    "Métrica": "Número de publicaciones",
                    "Año-2024": 12,
                    "Año-2025": 12,
                    "Comparación": 0,
                    "%": "0.0%",
                    "opc": 0
                },
                {
                    "id": 0,
                    "Métrica": "Número de publicaciones pautadas",
                    "Año-2024": 2,
                    "Año-2025": 3,
                    "Comparación": 1,
                    "%": "50.0%",
                    "opc": 0
                },
                {
                    "id": 0,
                    "Métrica": "Inversión total de pautas",
                    "Año-2024": "$800.00",
                    "Año-2025": "$4,133.99",
                    "Comparación": "$3,333.99",
                    "%": "425.0%",
                    "opc": 0
                }
            ],
            th: "0"
        };
    }










    agregarCaptura() {
        console.log("Mostrar formulario para nueva captura mensual...");
        // Aquí podrías usar createModalForm() si ya está disponible
    }
}

class RedesCategory extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "socialnetwork";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-socialnetwork`,
            id: this.PROJECT_NAME,
            class: 'w-full ',
            card: {
                filterBar: {
                    class: "w-full",
                    id: "filterBarRedesCategoria"
                },
                container: {
                    class: "w-full my-3 h-full rounded-lg p-3",
                    id: "container-redes-categoria"
                }
            }
        });

        $("#container-redes-categoria").prepend(`
        <div class="px-2 ">
            <h2 class="text-2xl font-semibold">Administrador de redes sociales</h2>
            <p class="text-gray-400">Gestiona las redes sociales disponibles para los pedidos y promociones.</p>
        </div>`);

        this.filterBarRedesCategoria();
        this.lsSocialNetwork();
    }

    filterBarRedesCategoria() {
        const container = $("#container-redes-categoria");
        container.append('<div id="filterbar-redes-categoria" class="mb-3"></div><div id="tabla-redes-categoria"></div>');

        this.createfilterBar({
            parent: "filterbar-redes-categoria",
            data: [
                {
                    opc: "select",
                    id: "selectStatusRedesCategoria",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Todas" },
                        { id: "1", valor: "Activa" },
                        { id: "0", valor: "Inactiva" }
                    ],
                    onchange: "redesCategory.lsRedesCategoria()"
                },
                {
                    opc: "btn",
                    class: "col-sm-3 col-md-3",
                    color_btn: "primary",
                    id: `btnAgregarRed${this.PROJECT_NAME}`,
                    text: "Nueva Red Social",
                    fn: `redesCategory.addSocialNetwork()`,
                    icon: "fas fa-plus"
                }
            ],
        });
    }

    lsSocialNetwork() {

        this.createTable({
            parent: `tabla-redes-categoria`,
            data: { opc: "lsSocialNetworks" },
            idFilterBar: "filterbar-redes-categoria",

            conf: { datatable: true, pag: 15 },
            coffeesoft: true,
            attr: {
                id: `tbMetricas${this.PROJECT_NAME}`,
                theme: 'corporativo',

                center: [1, 2],
                right: [7]
            }
        });

    }

    addSocialNetwork() {
        this.createModalForm({
            id: "frmAddSocialNetwork",
            bootbox: {
                title: "Agregar Red Social",
                closeButton: true
            },
            json: this.jsonSocialNetwork(),
            data: { opc: "addSocialNetwork" },
           
            success: (response) => {
                if (response.status == 200) {
                    alert({
                        icon: "success",
                        title: "Red social agregada",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });

                    // Refrescar la vista actual
                    this.lsSocialNetwork()
                } else {
                    alert({
                        icon: "error",
                        title: "Error al agregar",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            },
            error: (error) => {
                console.error('Error en addSocialNetwork:', error);
                alert({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo conectar con el servidor. Intente nuevamente.",
                    btn1: true,
                    btn1Text: "Ok"
                });
            }
        });
    }

    async editSocialNetwork(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getSocialNetwork", id }
        });

        this.createModalForm({
            id: "frmEditSocialNetwork",
            bootbox: {
                title: "Editar Red Social",
                closeButton: true
            },
            json: this.jsonSocialNetwork(),
            data: { opc: "editSocialNetwork", id },
            autofill: request.data,
          
            success: (response) => {
                if (response.status == 200) {
                    alert({
                        icon: "success",
                        title: "Red social actualizada",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsSocialNetwork();
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

    statusSocialNetwork(id, status) {
        const accion = status == 1 ? 'activar' : 'desactivar';

        this.swalQuestion({
            opts: {
                title: `¿Está seguro?`,
                html: `¿Desea ${accion} esta red social?`,
                icon: "warning"
            },
            data: { opc: "statusSocialNetwork", status: status,  id: id, },
            methods: {
                request: (data) => {
                    alert({
                        icon: "success",
                        title: "Estado actualizado",
                        text: `Red social ${status == 1 ? 'activada' : 'desactivada'} correctamente`,
                        btn1: true
                    });
                    this.lsSocialNetwork();
                }
            }
        });
    }

    jsonSocialNetwork() {
        return [
            {
                opc: "input",
                lbl: "Nombre de la red social",
                id: "name",
                tipo: "texto",
                class: "col-12 col-sm-12 mb-3",
                required: true,
                minlength: 2,
                maxlength: 100
            },
            {
                opc: "input",
                lbl: "Icon (icon-font)",
                id: "icon",
                tipo: "texto",
                placeholder: "ej: icon-facebook",
                class: "col-12 col-sm-6 mb-3",
                pattern: "^(fa[brs]?\\s+fa-[a-z0-9-]+)$"
            },

            {
                opc: "input",
                lbl: "Color (Hex)",
                id: "color",
                type: "color",
                class: "col-12 col-sm-6 mb-3",
                value: "#1877F2"
            },

            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción",
                rows: 3,
                class: "col-12 mb-3",
                maxlength: 500
            },
            
       
        ];
    }


  
}

class Metricas extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Metricas";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-metricas`,
            id: this.PROJECT_NAME,
            class: 'w-full p-2',
            card: {
                filterBar: {
                    class: "w-full ",
                    id: "filterBarMetricas"
                },
                container: {
                    class: "w-full my-3 h-full",
                    id: "container-Metricas"
                }
            }
        });

        $("#container-Metricas").prepend(`
            <div class="px-3 ">
                <h2 class="text-2xl font-semibold"> Metricas</h2>
                <p class="text-gray-400">Administración de metricas</p>
            </div>
        `);

        this.filterBarMetricas();
        this.lsMetricas();
    }

    filterBarMetricas() {
        const container = $("#container-Metricas");
        container.append('<div id="filterbar-Metricas" class="mb-3"></div><div id="tabla-Metricas"></div>');

        this.createfilterBar({
            parent: "filterbar-Metricas",
            data: [
                {
                    opc: "select",
                    id: "selectStatusParametro",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Todos los estados" },
                        { id: "1", valor: "Activo" },
                        { id: "0", valor: "Inactivo" }
                    ],
                    onchange: "Metricas.lsMetricas()"
                },
                {
                    opc: "btn",
                    class: "col-sm-3 col-md-3 ",
                    color_btn: "primary",
                    id: `btnAgregarMetrica${this.PROJECT_NAME}`,
                    text: "Nueva Métrica",
                    fn: `metricas.addMetric()`,
                    icon: "fas fa-plus"
                }
            ],
        });
    }

    async addMetric() {
        // Cargar redes sociales para el dropdown
        const socialNetworks = await useFetch({
            url: this._link,
            data: { opc: "init" }
        });

    
        this.createModalForm({
            id: "frmAddMetric",
            bootbox: {
                title: "Agregar Métrica",
                closeButton: true
            },
            json: this.jsonMetric(socialNetworks.socialNetworks),
            data: { opc: "addMetric" },
          
            success: (response) => {
                if (response.status == 200) {
                    alert({
                        icon: "success",
                        title: "Métrica agregada",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.adminMetricas();
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

    lsMetricas() {

        this.createTable({
            parent: `tabla-Metricas`,
            data: { opc: "lsMetrics" },
            idFilterBar: "filterbar-Metricas",

            conf: { datatable: true, pag: 15 },
            coffeesoft: true,
            attr: {
                id: `tbMetricas${this.PROJECT_NAME}`,
                theme: 'corporativo',
            
                center: [0, 2, 4, 5, 6],
                right: [7]
            }
        });

   
    }

    async editMetric(id) {
        const [metric, socialNetworks] = await Promise.all([
            useFetch({ url: this._link, data: { opc: "getMetric", id } }),
            useFetch({ url: this._link, data: { opc: "init" } })
        ]);

        this.createModalForm({
            id: "frmEditMetric",
            bootbox: {
                title: "Editar Métrica",
                closeButton: true
            },
            json: this.jsonMetric(socialNetworks.socialNetworks),
            data: { opc: "editMetric", id },
            autofill: metric.data,
           
            success: (response) => {
                if (response.status == 200) {
                    alert({
                        icon: "success",
                        title: "Métrica actualizada",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });

                    this.lsMetricas();
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

    jsonMetric(socialNetworks = []) {

        return [

            {
                opc: "select",
                lbl: "Red Social",
                id: "social_networks_id",
                class: "col-12 col-sm-6 mb-3",
                required: true,
                data: socialNetworks
            },
            {
                opc: "select",
                lbl: "Tipo de métrica",
                id: "type",
                class: "col-12 col-sm-6 mb-3",
                required: true,
                data: [
                    { id: "reach", valor: "📊 Alcance - Personas que ven el contenido" },
                    { id: "interaction", valor: "❤️ Interacción - Likes, comentarios, shares" },
                    { id: "conversion", valor: "🎯 Conversión - Acciones específicas" },
                    { id: "investment", valor: "💰 Inversión - Gastos en publicidad" }
                ]
            },

            {
                opc: "input",
                lbl: "Nombre de la métrica",
                id: "name",
                tipo: "texto",
                placeholder: "ej: Alcance mensual, Interacciones totales",
                class: "col-12 col-sm-12 mb-3",
                required: true,
                minlength: 2,
                maxlength: 100
            },
           

            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción detallada",
                placeholder: "Describe qué mide exactamente esta métrica y cómo se calcula...",
                rows: 3,
                class: "col-12 mb-3",
                maxlength: 500
            },
            {
                opc: "label",
                id: "lblEjemplos",
                text: "💡 Ejemplos de métricas por tipo:",
                class: "col-12 text-muted small mb-2"
            },
            {
                opc: "div",
                id: "lblEjemplosDetalle",
                html: "• Alcance: Impresiones, Alcance único, Visualizaciones<br>• Interacción: Likes, Comentarios, Shares, Saves<br>• Conversión: Clicks en enlace, Descargas, Registros<br>• Inversión: Costo por click, Presupuesto gastado, ROI",
                class: "col-12 text-muted small mb-3"
            },

        ];
    }

    statusMetric(id, status) {
        const accion = status == 1 ? 'activar' : 'desactivar';

        this.swalQuestion({
            opts: {
                title: `¿Está seguro?`,
                html: `¿Desea ${accion} esta métrica?`,
                icon: "warning"
            },
            data: { opc: "statusMetric", id: id, status: status },
            methods: {
                request: (data) => {
                    alert({
                        icon: "success",
                        title: "Estado actualizado",
                        text: `Métrica ${status == 1 ? 'activada' : 'desactivada'} correctamente`,
                        btn1: true
                    });
                    this.adminMetricas();
                }
            }
        });
    }


 

    addParametro() {
        this.createModalForm({
            id: 'formParametroAdd',
            data: { opc: 'addParametro' },
            bootbox: {
                title: 'Agregar Parámetro',
            },
            json: [
                {
                    opc: "input",
                    id: "clave",
                    lbl: "Clave del parámetro",
                    class: "col-12 mb-3"
                },
                {
                    opc: "input",
                    id: "valor",
                    lbl: "Valor",
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
                    this.lsMetricas();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }
}



