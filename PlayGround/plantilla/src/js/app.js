
// init vars.
let app, sub;

let api = "https://huubie.com.mx/alpha/eventos/ctrl/ctrl-sub-eventos.php";



$(async () => {
    // instancias.
    app = new App(api, 'root');
    app.init();
});

class App extends UI {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";
    }

    init() {
        this.render();
    }

    render(options) {
      this.layout();
      this.filterBar();
      this.ls()
    }

    layout(){
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            card: {
                filterBar: {
                    class: "lg:h-[12%] line",
                    id: "filterBar" + this.PROJECT_NAME,
                },
                container: {
                    class: "lg:h-[88%] line",
                    id: "container" + this.PROJECT_NAME,
                },
            },
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            type: 'simple',
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-3",
                    id: "calendar" + this.PROJECT_NAME,
                    lbl: "Rango de fechas",
                },
                {
                    opc: "button",
                    class: "col-sm-2",
                    className:'w-100',
                    color_btn: "primary",
                    id: "btnNuevoDestajo",
                    text: "Consultar",
                    onClick: () => {
                        this.ls();
                    },
                },
            ],
        });

        // Init del rango de fechas
        dataPicker({
            parent: "calendar" + this.PROJECT_NAME,
            rangepicker: {
                startDate: moment().subtract(2, "month").startOf("month"),
                endDate: moment().endOf("month"),
                showDropdowns: true,
                ranges: {
                    "Mes actual": [moment().startOf("month"), moment().endOf("month")],
                    "Mes anterior": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
                    "Primeros 6 meses": [moment().startOf("year"), moment().month(5).endOf("month")],
                    "Últimos 6 meses": [moment().month(6).startOf("month"), moment().endOf("year")]
                }
            },
            onSelect: (start, end) => {
                this.ls();
            },
        });
    }

    ls() {
        let range = getDataRangePicker("calendar" + this.PROJECT_NAME);

        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            coffeesoft:true,
            data: {
                opc: "list",
                fi: range.fi,
                ff: range.ff,
                udn: 0,
                status:0
            },
            conf: { datatable: false, pag: 10 },
            attr: {
                id: "tb" + this.PROJECT_NAME,
                extends: true,
                title:'Reporte de pagos por destajo',
                subtitle: `Correspondiente del ${this.formatDateText(range.fi)} a ${this.formatDateText(range.ff)}`,
                theme:'corporativo',
                right: [3,4,5,6,7,8,9],
                center: [2,10],
                f_size: 12,
                striped:false
            },
        });
    }

<<<<<<< HEAD
=======
    formatDateText(fechaStr) {
        const [dia, mes, año] = fechaStr.split('-');
        const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        const nombreMes = meses[parseInt(mes, 10) - 1];
        return `${año}/${nombreMes}/${dia}`;
    }



>>>>>>> d728fa824ca0f7e6742bde990e82fedd9f225e3e
    async showSubEvent() {

        let subEvents = await useFetch({
            url: this._link,
            data: {
                opc: "listSubEvents",
                id: idEvent
            }
        });

<<<<<<< HEAD
=======

        if (subEvents.status == 200) {
            this.accordingMenu({
                parent: "container-companies",
                title: "Evento  : " + subEvents.event.name_event,
                subtitle: subEvents.event.status,
                data: subEvents.data,
>>>>>>> d728fa824ca0f7e6742bde990e82fedd9f225e3e

        this.accordingMenu({
            parent: 'container'
        })

    }

    accordingMenu(options) {
        const defaults = {
            parent: "tab-sub-event",
            id: "accordionTable",
            title: 'Titulo',
            subtitle: 'Subtitulo',
            color_primary: 'bg-[#1F2A37]',
            data: [],
            center: [1, 2, 5],
            right: [3, 4],
            onShow: () => { },
            onDetail: () => { }, // ✅ Nuevo hook
        };

        const opts = Object.assign(defaults, options);
        const container = $('<div>', {
            id: opts.id,
            class: `${opts.color_primary} rounded-lg my-5 border border-gray-700 overflow-hidden`
        });

        const titleRow = $(`
        <div class="flex justify-between items-center px-4 py-4 border-b border-gray-800">
            <div>
                <h2 class="text-lg font-semibold text-white">${opts.title}</h2>
                ${opts.subtitle ? `<span class="inline-block mt-1 text-xs font-medium text-gray-300 bg-gray-700 px-2 py-1 rounded-full">${opts.subtitle}</span>` : ''}
            </div>
            <div class="flex items-center gap-2">
                <button id="btn-new-sub-event" class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded w-40 flex items-center justify-center gap-2">
                    <span class="text-lg">＋</span> Nuevo
                </button>
                <button id="btn-print-sub-event" class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded w-40 flex items-center justify-center gap-2">
                    <span class="text-lg">🖨️</span> Imprimir
                </button>
            </div>
        </div>
    `);

        titleRow.find("#btn-new-sub-event").on("click", () => opts.onAdd?.());
        titleRow.find("#btn-print-sub-event").on("click", () => opts.onPrint?.());
        container.append(titleRow);

        const firstItem = opts.data[0] || {};
        const keys = Object.keys(firstItem).filter(k => k !== 'body' && k !== 'id');

        const headerRow = $('<div>', {
            class: "flex justify-between items-center px-4 py-2 font-medium text-gray-400 border-b border-gray-700 text-sm"
        });

        keys.forEach(key => {
            headerRow.append(`<div class="flex-1 text-center truncate">${key.charAt(0).toUpperCase() + key.slice(1)}</div>`);
        });

        headerRow.append(`<div class="flex-none text-right">Acciones</div>`);
        container.append(headerRow);

        let currentActive = null;

        opts.data.forEach((opt, index) => {
            const row = $('<div>', { class: "border-gray-700" });
            const header = $(`<div class="flex justify-between items-center px-3 py-2 border-y border-gray-700 hover:bg-[#18212F] bg-[#313D4F] cursor-pointer"></div>`);

            keys.forEach((key, i) => {
                let align = "text-left";
                if (opts.center.includes(i)) align = "text-center";
                if (opts.right.includes(i)) align = "text-end";
                header.append(`<div class="flex-1 px-3 text-gray-300 truncate ${align}">${opt[key]}</div>`);
            });

            const actions = $(`
            <div class="flex-none flex gap-2 mx-2">
                <button class="btn-detail bg-yellow-600 text-white text-sm px-2 py-1 rounded" title="Ver detalles">👁️</button>
                <button class="btn-edit bg-gray-700 text-white text-sm px-2 py-1 rounded" title="Editar">✏️</button>
                <button class="btn-delete bg-gray-700 text-red-500 text-sm px-2 py-1 rounded" title="Eliminar">🗑️</button>
            </div>`);

            header.append(actions);

            const bodyWrapper = $('<div>', {
                class: "bg-[#1F2A37] hidden px-4 py-4 text-sm text-gray-300 accordion-body",
                id: 'containerInfo' + opt.id,
                html: ``
            });

            header.on("click", function (e) {
                const target = $(e.target);
                if (target.closest(".btn-edit, .btn-delete, .btn-detail").length) return;
                $(".accordion-body").slideUp();
                const isVisible = bodyWrapper.is(":visible");
                if (!isVisible) {
                    bodyWrapper.slideDown(200);
                    opts.onShow?.(opt.id);
                }
            });

            header.find(".btn-edit").on("click", e => {
                e.stopPropagation();
                opts.onEdit?.(opt, index);
            });

            header.find(".btn-delete").on("click", e => {
                e.stopPropagation();
                opts.onDelete?.(opt, index);
            });

            header.find(".btn-detail").on("click", e => {
                e.stopPropagation();
                $(".active-sub-event").removeClass("border border-green-400 active-sub-event");
                row.addClass("border border-green-400 active-sub-event");
                opts.onDetail?.(opt, index);
            });

            row.append(header, bodyWrapper);
            container.append(row);
        });

        let totalGral = opts.data.reduce((sum, el) => {
            let clean = (el.Total || '0').toString().replace(/[^0-9.-]+/g, '');
            return sum + (parseFloat(clean) || 0);
        }, 0);

        container.append(`
        <div class="flex justify-between items-center px-4 py-4 mt-3 border-t border-gray-800 text-white text-sm">
            <div class="font-semibold text-green-400 text-lg">
                TOTAL GRAL: <span>$${totalGral.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <button type="button" class="flex bg-[#374151] hover:bg-[#4b5563] text-white items-center justify-center px-4 py-2 mt-3 text-sm w-40 rounded" onclick="eventos.closeEvent()">Cerrar</button>
        </div>
    `);

        $(`#${opts.parent}`).html(container);
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



