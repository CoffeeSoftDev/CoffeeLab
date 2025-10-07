let api = "ctrl/ctrl-destajo-formato.php";
let concentrado;

$(async () => {
    // instancias.
    concentrado = new Concentrado(api, 'root');
    concentrado.init();
});

class Concentrado extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Concentrado";
    }

    init() {
        this.render();
    }

    render(options) {
        this.layout();
        this.filterBar();
    }

    layout() {
        this.primaryLayout({
            parent: "tab-concentrado",
            id: this.PROJECT_NAME,
            card: {
                filterBar: {
                    id: "filterBar" + this.PROJECT_NAME,
                },
                container: {
                    id: "container" + this.PROJECT_NAME,
                    class:'w-full my-2'
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
                    className: 'w-100',
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
                startDate: moment().startOf("month"),
                endDate: moment().endOf("month"),
                showDropdowns: true,
                ranges: {
                    "Mes actual": [moment().startOf("month"), moment().endOf("month")],
                    "Mes anterior": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
                    "Hace 2 meses": [moment().subtract(2, "month").startOf("month"), moment().subtract(2, "month").endOf("month")],
                },
            },
            onSelect: (start, end) => {
                this.ls();
            },
        });
    }

    async ls() {
        let range = getDataRangePicker("calendar" + this.PROJECT_NAME);
        $("#container" + this.PROJECT_NAME).html('Cargando...');

        let request = await useFetch({
            url: api,
            method: 'POST',
            data: {
                opc: "listDestajo",
                fi: range.fi,
                ff: range.ff,
            },
        });

      

       this.createCoffeTable({
           parent : "container" + this.PROJECT_NAME,
           data   : request.ConcentradoDestajo,
           id     : "tb" + this.PROJECT_NAME,
           extends: true,
           theme  : 'corporativo',
           right  : [2, 3, 4],
           f_size : 12,
           striped: false,
            
        });


        $("#containerConcentrado").prepend(`<div id="infoResumen" class="mb-4 "> </div> `);

        this.createCoffeTable({
            parent: "infoResumen" ,
            data: request.ConcentradoArea,
            id: "tbInfoResumen" + this.PROJECT_NAME,
            title: 'Reporte de pagos por destajo',
            subtitle: `Correspondiente del ${this.formatDateText(range.fi)} a ${this.formatDateText(range.ff)}`,
            extends: true,
            theme: 'corporativo',
            right: [3, 4, 5, 6, 7, 8, 9,10],
            center: [2, 10],
            f_size: 12,

        });

      
    }

    formatDateText(fechaStr) {
        const [dia, mes, año] = fechaStr.split('-');
        const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        const nombreMes = meses[parseInt(mes, 10) - 1];
        return `${año}/${nombreMes}/${dia}`;
    }

    createCoffeTable(options) {
        const defaults = {
            theme: 'light',
            subtitle: null,
            dark: false,
            parent: "root",
            id: "coffeeSoftGridTable",
            title: null,
            data: { thead: [], row: [] },
            center: [],
            right: [],
            color_th: "bg-[#003360] text-gray-100",
            color_row: "bg-white hover:bg-gray-50",
            color_group: "bg-gray-200",
            class: "w-full table-auto text-sm text-gray-800",
            onEdit: () => { },
            onDelete: () => { },
            extends: true,
            f_size: 12,
            includeColumnForA: false,
            border_table: "border border-gray-300",
            border_row: "border-t border-gray-200",
            color_row_alt: "bg-gray-100",
            striped: false
        };

        if (options.theme === 'dark') {
            defaults.dark = true;
            defaults.color_th = "bg-[#0F172A] text-white";
            defaults.color_row = "bg-[#1E293B] text-white";
            defaults.color_group = "bg-[#334155] text-white";
            defaults.class = "w-full table-auto text-sm text-white";
            defaults.border_table = "";
            defaults.border_row = "border-t border-gray-700";
            defaults.color_row_alt = "bg-[#111827]";
        } else if (options.theme === 'corporativo') {
            defaults.color_th = "bg-[#003360] text-white";
            defaults.color_row = "bg-white ";
            defaults.color_group = "bg-gray-100 ";
            defaults.class = "w-full text-sm ";
            defaults.border_table = "border rounded-lg  border-gray-300";
            defaults.border_row = "border-t border-gray-300";
            defaults.color_row_alt = "bg-gray-100";
        } else {
            defaults.color_th = "bg-[#F2F5F9] text-[#003360]";
            defaults.color_row = "bg-white hover:bg-gray-600";
            defaults.color_group = "bg-gray-200";
            defaults.class = "w-full table-auto text-sm text-gray-800";
            defaults.border_table = "border rounded-lg  border-gray-300";
            defaults.border_row = "border-t border-gray-200";
            defaults.color_row_alt = "bg-gray-50";
        }

        const opts = Object.assign({}, defaults, options);
        const container = $("<div>", {
            class: "rounded-lg h-full table-responsive ",
        });

        if (opts.title) {
            const titleRow = $(`
            <div class="flex flex-col py-2 ">
                <span class="text-lg font-semibold ${opts.dark ? 'text-gray-100' : 'text-gray-800'}">${opts.title}</span>
                ${opts.subtitle ? `<p class="text-sm ${opts.dark ? 'text-gray-400' : 'text-gray-600'} mt-1">${opts.subtitle}</p>` : ''}
            </div>`);
            container.append(titleRow);
        }

        const table = $("<table>", { id: opts.id, class: ` border-separate border-spacing-0 ${opts.border_table} ${opts.class}` });
        const thead = $("<thead>");

        if (opts.data.thead) {
            if (opts.extends) {
                const columnHeaders = opts.data.thead;
                if (Array.isArray(columnHeaders)) {
                    const headerRow = $('<tr>');
                    columnHeaders.forEach(column => {
                        if (typeof column === 'string') {
                            headerRow.append(`<th class="text-center px-3 py-2 ${opts.color_th}">${column}</th>`);
                        } else {
                            const complexHeaderRow = $('<tr>');
                            Object.keys(column).forEach(key => {
                                const cell = (typeof column[key] === 'object')
                                    ? $('<th>', column[key])
                                    : $('<th>', { text: column[key], class: `text-center ${opts.color_th}` });
                                complexHeaderRow.append(cell);
                            });
                            thead.append(complexHeaderRow);
                        }
                    });
                    thead.append(headerRow);

                } else {
                    columnHeaders.forEach(columnGroup => {
                        const headerGroup = $("<tr>");
                        Object.keys(columnGroup).forEach(key => {
                            const cell = (typeof columnGroup[key] === 'object')
                                ? $('<th>', columnGroup[key])
                                : $('<th>', { text: key });
                            headerGroup.append(cell);
                        });
                        thead.append(headerGroup);
                    });
                }
            } else {
                const simpleHeaderRow = $('<tr>');
                opts.data.thead.forEach(header => {
                    simpleHeaderRow.append(`<th class="text-center px-3 py-2 capitalize ${opts.color_th}">${header}</th>`);
                });
                thead.append(simpleHeaderRow);
            }
        } else {
            const autoHeaderRow = $("<tr>");
            for (let clave in opts.data.row[0]) {
                if (clave != "opc" && clave != "id") {
                    clave = (clave == 'btn' || clave == 'btn_personalizado' || clave == 'a' || clave == 'dropdown') ? '<i class="icon-gear"> </i>' : clave;
                    autoHeaderRow.append($("<th>", {
                        class: `px-2 py-2 ${opts.color_th} capitalize text-center font-semibold`,
                        style: `font-size:${opts.f_size}px;`
                    }).html(clave));
                }
            }
            thead.append(autoHeaderRow);
        }

        table.append(thead);
        const tbody = $("<tbody>");

        opts.data.row.forEach((data, i) => {
            let bg_grupo = "";

            if (data.opc) {
                if (data.opc == 1) {
                    bg_grupo = opts.color_group + " font-semibold";
                } else if (data.opc == 2) {
                    bg_grupo = opts.color_group + " text-primary font-semiold ";
                }
            }



            const colorBg = bg_grupo || (opts.striped && i % 2 === 0 ? opts.color_row_alt : opts.color_row);


            delete data.opc;

            const tr = $("<tr>", {
                class: ` `,
            });



            Object.keys(data).forEach((key, colIndex) => {
                if (["btn", "a", "dropdown", "id"].includes(key)) return;

                const align =
                    opts.center.includes(colIndex) ? "text-center" :
                        opts.right.includes(colIndex) ? "text-right" : "text-left";

                let tdText = data[key];
                let cellAttributes = {
                    id: `${key}_${data.id}`,
                    style: `font-size:${opts.f_size}px;`,
                    class: `${align} ${opts.border_row} px-3 py-1 truncate ${colorBg}`,
                    html: tdText
                };



                // Si opts.extends está activo y data[key] es objeto, sobrescribe atributos
                if (opts.extends && typeof data[key] === 'object' && data[key] !== null) {
                    cellAttributes = Object.assign(cellAttributes, data[key]);
                    cellAttributes.class += ` ${opts.border_row} `;
                }

                tr.append($("<td>", cellAttributes));
            });

            const actions = '';

            if (data.a?.length) {
                actions = $("<td>", { class: `px-2 py-[1.25rem] flex justify-center items-center ${colorBg} ${opts.border_row}` });
                data.a.forEach(atributos => {

                    const button_a = $("<a>", atributos);
                    actions.append(button_a);
                });
                tr.append(actions);
            }

            if (data.dropdown) {
                actions = $("<td>", { class: `px-2 py-[1.25rem] flex justify-center items-center ${colorBg} ${opts.border_row}` });

                const wrapper = $("<div>", {
                    class: "relative"
                });

                const btn = $("<button>", {
                    class: "icon-dot-3 text-gray-600 hover:text-blue-600",
                    click: function (e) {
                        e.stopPropagation();
                        $(this).next("ul").toggle();
                    }
                });

                const menu = $("<ul>", {
                    class: "absolute right-0 mt-2 w-44 z-10 bg-white border rounded-md shadow-md hidden",
                });

                data.dropdown.forEach((item) =>
                    menu.append(`
                    <li><a onclick="${item.onclick}"text-left class="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-800">
                    <i class="${item.icon} "></i> ${item.text}</a></li>`)
                );





                wrapper.append(btn, menu);
                actions.append(wrapper);
                $(document).on("click", () => menu.hide());
            }

            tr.append(actions);
            tbody.append(tr);
        });

        table.append(tbody);
        container.append(table);
        $(`#${opts.parent}`).html(container);

        $("<style>").text(`
        #${opts.id} th:first-child { border-top-left-radius: 0.5rem; }
        #${opts.id} th:last-child { border-top-right-radius: 0.5rem; }
        #${opts.id} tr:last-child td:first-child { border-bottom-left-radius: 0.5rem; }
        #${opts.id} tr:last-child td:last-child { border-bottom-right-radius: 0.5rem; }
        `).appendTo("head");
    }


}


