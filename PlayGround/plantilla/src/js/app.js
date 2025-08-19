
// init vars.
let app, sub;
let api = "https://erp-varoch.com/DEV/capital-humano/ctrl/ctrl-rotacion-de-personal.php";
let api2 = "https://erp-varoch.com/DEV/kpi/ctrl/ctrl-ingresos.php";
let data;

$(async () => {
    // instancias.
    app = new App(api2, 'root');
    app.init();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Ingresos";
    }

    init() {
        this.render();
    }

    render(options) {
        this.layout();
        this.filterBar();
        this.lsIngresos();

    }
// 
    layout() {
        this.primaryLayout({
            parent: `root`,
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
                    data: [
                        {id:'5',valor:'BAOS'}
                    ],
                    onchange: `ingresos.lsIngresos()`,
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
                    onchange: `ingresos.lsIngresos()`,

                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `app.lsIngresos()`,

                },

                {
                    opc: "select",
                    id: "type",
                    lbl: "Consultar",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: " Ingresos por día" },
                        { id: "2", valor: "Captura de ingresos" },
                    ],
                    onchange: `app.lsIngresos()`,
                },
            ],
        });
    }

    lsIngresos() {

        $("#containerIngresos").html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold ">📦 VENTAS DIARIAS</h2>
                <p class="text-gray-400">Consultar y capturar ventas diaria por unidad de negocio (ingresos)</p>
            </div>

            <div id="container-table-ingresos"></div>`);

        this.createTable({
            parent: "container-table-ingresos",
            idFilterBar: `filterBarIngresos`,
            data: { opc: 'list' },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbIngresos",
                theme: 'corporativo',
                center: [1, 2, 3],
                right: [4, 6]
            },

        });

    }







    dashboard() {

        $('#root').append(`<div id="dashboard" class="p-6  font-sans space-y-3 max-w-[1400px] mx-auto"></div>`);
        this.infoCard({
            parent: "dashboard",
            id: 'dashboardIngresos',
            class: '',
            theme: 'light',
            json: [
                {
                    id: "kpiDia",
                    title: "Venta del Día ",
                    data: {
                        value: "$12,500",
                        description: "+12% vs ayer",
                        color: "text-[#8CC63F]"
                    }
                },
                {
                    id: "kpiMes",
                    title: "Venta del Mes",
                    data: {
                        value: "$125,000",
                        description: "+8% vs mes anterior",
                        color: "text-[#8CC63F]"
                    }
                },
                {
                    title: "Clientes",
                    data: {
                        value: "1248",
                        description: "+5% vs período anterior",
                        color: "text-[#103B60]"
                    }
                },
                {
                    id: "kpiCheque",
                    title: "Cheque Promedio",
                    data: {
                        value: "$1,156",
                        description: "-2% vs período anterior",
                        color: "text-red-600"
                    }
                }
            ]
        });

    }


    infoCard(options) {
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


   

    // Rotation.
    layoutNewRotation(request) {
        const data = request.data;

        $("#root").html(`
            <div class="flex flex-col ">
                <div class="grid grid-cols-3 items-center gap-4 px-4 pb-4 pt-6">
                    <!-- Columna 1: Botones -->
                    <div class="flex gap-2">
                        <button id="btnRegresar"
                            class="inline-flex items-center gap-2 px-5 py-2 border border-blue-600 bg-white text-blue-600 font-semibold rounded-lg transition hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200">
                            <i class="icon-left text-lg"></i>
                            <span>Regresar</span>
                        </button>
                        <button id="btnGuardarRotation"
                            class="inline-flex items-center gap-2 px-5 py-2 border border-green-400 bg-white text-green-600 font-semibold rounded-lg transition hover:bg-green-50 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-200">
                            <i class="icon-save text-lg"></i>
                            <span>Guardar</span>
                        </button>
                    </div>
                    <!-- Columna 2: Título Centrado -->
                    <div class="flex flex-col items-center">
                        <h2 class="text-2xl md:text-3xl font-bold text-gray-700 tracking-wide text-center">
                            Rotación de Personal
                        </h2>
                        <p>Gestión y análisis de rotación mensual</p>
                    </div>
                    <!-- Columna 3: Info derecha -->
                    <div class="flex flex-col items-end">
                        <span class="text-xl font-semibold text-gray-800">${request.period.name}</span>
                        <span class="text-base font-medium text-gray-600"># 00${request.period.id}</span>
                    </div>
                </div>
            </div>

            <div id="rotacionModulo" class="mb-2 p-3 border rounded-lg bg-white"></div>
            <div id="plantillaRotacion" class="mb-2 p-3 border rounded-lg bg-white"></div>
            <div id="plantillaBaja" class="p-3 border rounded-lg bg-white"></div>
        `);

        $("#btnRegresar").on("click", () => {
            app.layout();
        });

        $("#btnGuardarRotation").on("click", () => {
            this.saveRotationTemplate(request.period.id);
        });

        this.newRotation(data);
    }

    async viewLayout() {
        const mes = moment().format('MMMM').toUpperCase();
        const anio = moment().format('YYYY');

        let request = await useFetch({
            url: api,
            data: {
                opc: "getRotation",
                month: mes,
                year: anio
            },
        });

        this.layoutNewRotation(request)

    }

    newRotation(data) {
        this.createCoffeTable({
            parent: "rotacionModulo",
            title: "Rotación Mensual",
            subtitle: 'EPM (Empleados Por Mes): Promedio de empleados por mes.',

            data: data.editRotation,
            conf: {
                datatable: false,
                pag: 10
            },

            right: [2, 3, 4, 5, 6],

            attr: {
                class: "table-auto w-full",
                id: "tabla-rotacion-mensual",
                extends: true
            }
        })

        // Crea la tabla de rotación
        this.createCoffeTable({
            parent: "plantillaRotacion",
            title: "Plantilla Rotación",
            data: data.editTemplate,
            conf: {
                datatable: false,
                pag: 10
            },
            attr: {
                class: "table-auto w-full",
                id: "tabla-rotacion-mensual",
                right: [2, 3, 4, 5, 6],
                extends: true
            }
        })

        // Crea la tabla de rotación
        this.createCoffeTable({
            parent: "plantillaBaja",
            title: "Causas de Bajas - " + data.periodo,
            data: data.lsDismissal,
            conf: {
                datatable: false,
                pag: 10
            },
            attr: {
                id: "tabla-rotacion-mensual",
                right: [2, 3, 4, 5, 6],
                border_row: "px-2 py-2",
                extends: true
            }
        })
    }

    saveRotationTemplate(id) {

        this.swalQuestion({
            opts: {
                title: "¿Deseas guardar la plantilla de rotación?",
                text: "Esta acción almacenará la plantilla actual para futuras rotaciones.",
                icon: "question",
            },
            data: {
                opc: 'updateRotation',
                status: 2,
                id: id
            },
            methods: {
                send: () => {

                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            title: "Guardado exitoso",
                            text: response.message || "La plantilla se guardó correctamente.",
                            btn1: true,
                            btn1Text: "Aceptar"
                        });

                        app.render();

                    } else {
                        alert({
                            icon: "error",
                            title: "Ocurrió un error",
                            text: response.message || "No fue posible guardar la plantilla.",
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                    }

                }
            }
        });
    }

    async onEditRotation(input) {
        const id = input.dataset.id;
        const field = input.dataset.field;
        const value = parseFloat(input.value);

        if (!id || !field || isNaN(value)) {
            alert({ icon: "error", text: "Identificador o campo inválido." });
            return;
        }

        const row = input.closest('tr');

        // Obtener los valores actuales de la fila
        const initialInput = row.querySelector('input[name="initial_template"]');
        const endInput = row.querySelector('input[name="end_template"]');

        const initialValue = parseFloat(initialInput?.value || 0);
        const endValue = parseFloat(endInput?.value || 0);

        const epm = initialValue + (endValue / 2);
        const bajas = parseFloat(row.cells[4]?.innerText || 0); // Asumiendo columna 4 = BAJAS
        const rotacion = epm > 0 ? ((bajas * 100) / epm).toFixed(2) : 0;

        // Actualizar la fila visualmente
        row.cells[3].innerText = epm.toFixed(2);     // EPM
        row.cells[5].innerText = rotacion;           // ROTACION

        // Llamar backend
        await useFetch({
            url: api,
            data: {
                opc: "editRotationField",
                [field]: value,
                epm: epm.toFixed(2),
                rotation: rotacion,
                id: id,
            },
        });

    }

    // Template Rotation.

    async onEditTemplate(input) {
        const id = input.dataset.id;
        const field = input.dataset.field;
        const value = parseFloat(input.value);

        if (!id || !field || isNaN(value)) {
            alert({ icon: "error", text: "Identificador o campo inválido." });
            return;
        }

        const row = input.closest('tr');

        // Obtener inputs de la fila
        const realInput = row.querySelector('input[name="real_template"]');
        const authorizedInput = row.querySelector('input[name="authorized_template"]');

        const realValue = parseFloat(realInput?.value || 0);
        const authorizedValue = parseFloat(authorizedInput?.value || 0);

        // Calcular ROTACIÓN
        const rotacion = authorizedValue > 0 ? ((realValue * 100) / authorizedValue).toFixed(2) : "0.00";

        // Actualizar celda visualmente
        row.cells[3].innerText = rotacion;

        // Enviar datos al backend
        await useFetch({
            url: api,
            data: {
                opc: "editTemplateField",
                [field]: value,
                percentage_template: rotacion,
                id: id,
            },
        });
    }



}



function formatSpanishDate(fecha = null, type = "normal") {
    let date;

    if (!fecha) {
        // Si no se pasa nada, usamos la fecha actual
        date = new Date();
    } else {
        // Dividimos fecha y hora si existe
        // ejemplo: "2025-03-08 09:14" => ["2025-03-08", "09:14"]
        const [fechaPart, horaPart] = fecha.split(" ");

        // Descomponer "YYYY-MM-DD"
        const [year, month, day] = fechaPart.split("-").map(Number);

        if (horaPart) {
            // Si hay hora, por ejemplo "09:14"
            const [hours, minutes] = horaPart.split(":").map(Number);
            // Crear Date con hora local
            date = new Date(year, month - 1, day, hours, minutes);
        } else {
            // Solo fecha
            date = new Date(year, month - 1, day);
        }
    }

    // Extraer partes de la fecha
    const dia = date.getDate();
    const anio = date.getFullYear();

    // Obtenemos el mes en español (México).
    // Nota: El mes corto en español a veces incluye punto (ej: "mar."). Lo eliminamos:
    const mesCorto = date
        .toLocaleString("es-MX", { month: "short" })
        .replace(".", "");
    const mesLargo = date.toLocaleString("es-MX", { month: "long" });

    // Asegurar que el día tenga 2 dígitos
    const diaPadded = String(dia).padStart(2, "0");

    // Formatos deseados
    const formatos = {
        short: `${diaPadded}/${mesCorto}/${anio}`, // p.ej. "08/mar/2025"
        normal: `${diaPadded} de ${mesLargo} del ${anio}`, // p.ej. "08 de marzo del 2025"
    };

    // Devolvemos el formato según type
    return formatos[type] || formatos.short;
}



