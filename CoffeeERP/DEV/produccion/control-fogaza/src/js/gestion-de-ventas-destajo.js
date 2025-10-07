class CoffeeSoft {
    ObjectMerge(target, source) {
        // Iterar sobre todas las claves del objeto fuente
        for (const key in source) {
            // Verificar si la propiedad es propia del objeto fuente
            if (source.hasOwnProperty(key)) {
                // Verificar si el valor es un objeto y si el target tiene la misma propiedad
                if (typeof source[key] === 'object' && source[key] !== null) {
                    // Si el target no tiene la propiedad o no es un objeto, inicializarla como un objeto vacÃ­o
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = {};
                    }
                    // Llamada recursiva para combinar sub-objetos
                    this.ObjectMerge(target[key], source[key]);
                } else {
                    // Si no es un objeto, asignar el valor directamente
                    target[key] = source[key];
                }
            }
        }
        return target;
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
        }

        else if (options.theme === 'shadcdn') {
            defaults.color_th = "bg-[#111827] text-white";
            defaults.color_row = "bg-white text-[#111827]";
            defaults.color_group = "bg-[#F1F5F9]";
            defaults.class = "w-full table-auto text-sm";
            defaults.border_table = "border rounded-md border-[#CBD5E1]";
            defaults.border_row = "border-t border-[#E2E8F0]";
            defaults.color_row_alt = "bg-[#F8FAFC]";
        }
        else {
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

            // 🚩 Detectamos fila de agrupación horizontal
            if (data.colgroup) {
                const colspan = opts.data.thead?.length || Object.keys(data).length - 2; // exclude id, colgroup
                const labelKey = Object.keys(data).find(key => !['id', 'colgroup'].includes(key));
                const labelText = data[labelKey] || "";
                const paddingClass = labelText ? "py-2" : "py-1";

                const colgroupRow = $("<tr>").append(
                    $("<td>", {
                        colspan: colspan,
                        class: `px-3 ${paddingClass} font-semibold lowercase capitalize ${opts.border_row} ${opts.color_group}`,
                        html: labelText
                    })
                );

                tbody.append(colgroupRow);
                return; // Salta esta iteración
            }



            let bg_grupo = "";

            if (data.opc) {
                if (data.opc == 1) {
                    bg_grupo = opts.color_group + " font-bold";
                } else if (data.opc == 2) {
                    bg_grupo = opts.color_group + " text-primary fw-bold ";
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
                    class: `${align} ${opts.border_row} px-2 py-2 truncate ${colorBg}`,
                    html: tdText
                };



                // Si opts.extends está activo y data[key] es objeto, sobrescribe atributos
                if (opts.extends && typeof data[key] === 'object' && data[key] !== null) {
                    cellAttributes = Object.assign(cellAttributes, data[key]);
                    cellAttributes.class += `${align} px-2 ${opts.border_row} ${colorBg} `;
                }

                tr.append($("<td>", cellAttributes));
            });

            let actions = '';

            if (data.a?.length) {
                actions = $("<td>", { class: `px-2 py-2 flex justify-center items-center ${colorBg} ${opts.border_row}` });
                data.a.forEach(atributos => {

                    const button_a = $("<a>", atributos);
                    actions.append(button_a);
                });
                tr.append(actions);
            }

            if (data.dropdown) {
                actions = $("<td>", { class: `px-2 py-2 relative justify-center items-center ${colorBg} ${opts.border_row}` });

                const wrapper = $("<div>", {
                    class: "relative"
                });

                const btn = $("<button>", {
                    class: "icon-dot-3 text-gray-600 hover:text-blue-600",
                    click: function (e) {
                        e.stopPropagation();
                        $("ul.dropdown-menu").hide(); // cerrar todos los menús antes

                        $(this).next("ul").toggle();
                    }
                });

                const menu = $("<ul>", {
                    class: "dropdown-menu absolute top-full right-0 mt-2 w-44 z-10 bg-white border rounded-md shadow-md hidden"
                });

                data.dropdown.forEach((item) =>
                    menu.append(`
                    <li><a onclick="${item.onclick}"text-left class="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-800">
                    <i class="${item.icon} "></i> ${item.text}</a></li>`)
                );





                wrapper.append(btn, menu);
                actions.append(wrapper);

                // Cerrar todos los dropdowns al hacer clic fuera
                $(document).on("click", () => {
                    $("ul.dropdown-menu").hide();
                });
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

    primaryLayout(options) {
        const name = options.id ? options.id : 'primaryLayout';

        let defaults = {
            id: name,
            parent: this._div_modulo,
            class: "d-flex mx-2 my-2 h-100",
            card: {
                name: "singleLayout",
                class: "flex flex-col col-12",
                filterBar: { class: 'w-full my-3 ', id: 'filterBar' + name },
                container: { class: 'w-full my-3 bg-[#1F2A37] rounded-lg h-[calc(100vh-20rem)] ', id: 'container' + name }
            }
        };


        // Mezclar opciones con valores predeterminados
        const opts = this.ObjectMerge(defaults, options);


        this.createPlantilla({
            data: {
                id: opts.id,
                class: opts.class,
                contenedor: [
                    {
                        type: "div",
                        id: opts.card.name,
                        class: opts.card.class,
                        children: [
                            { type: "div", class: opts.card.filterBar.class, id: opts.card.filterBar.id },
                            { type: "div", class: opts.card.container.class, id: opts.card.container.id }
                        ]
                    }
                ]
            }, parent: opts.parent, design: false
        });

    }

    createLayaout(options = {}) {
        const defaults = {
            design: true,
            content: this._div_modulo,
            parent: '',
            clean: false,
            data: { id: "rptFormat", class: "col-12" },
        };

        const opts = Object.assign({}, defaults, options);
        const lineClass = opts.design ? ' block ' : '';

        const div = $("<div>", {
            class: opts.data.class,
            id: opts.data.id,
        });

        const row = opts.data.contenedor ? opts.data.contenedor : opts.data.elements;

        row.forEach(item => {
            let div_cont;

            switch (item.type) {

                case 'div':

                    div_cont = $("<div>", {
                        class: (item.class ? item.class : 'row') + ' ' + lineClass,
                        id: item.id,
                    });

                    if (item.children) {
                        item.children.forEach(child => {
                            child.class = (child.class ? child.class + ' ' : '') + lineClass;

                            if (child.type) {

                                div_cont.append($(`<${child.type}>`, child));

                            } else {

                                div_cont.append($("<div>", child));
                            }

                        });
                    }

                    div.append(div_cont);

                    break;

                default:

                    const { type, ...attr } = item;


                    div_cont = $("<" + item.type + ">", attr);

                    div.append(div_cont);
                    break;
            }
        });


        // aplicar limpieza al contenedor

        if (opts.clean)
            $("#" + opts.content ? opts.content : opts.parent).empty();


        if (!opts.parent) {
            $("#" + opts.content).html(div);
        } else {
            $("#" + opts.parent).html(div);
        }

    }

    createPlantilla(options) {

        let json_components = {
            id: "mdlGastos",
            class: "card-body row m-2",

            contenedor: [
                {
                    type: "form",
                    id: "formGastos",
                    class: " col-lg-4  block pt-2",
                    novalidate: true,
                },

                {
                    type: "div",
                    id: "contentGast",
                    class: "col-lg-8 ",
                    children: [
                        { class: 'col-12', id: 'filterGastos' },
                        { class: 'col-12', id: 'tableGastos' }
                    ]
                },
            ]
        };


        var defaults = { data: json_components, design: true };
        let opts = Object.assign(defaults, options);
        this.createLayaout(opts);

    }

}

class FormatoDestajo extends Complements {

    constructor(link, div_modulo) {
        super(link, div_modulo)
    }

    initComponents() {


        this.crearFormatoDestajo();
    }

    crearFormatoDestajo() {
        let json_grupos = {

            id: "grupo",
            class: "col-12",

            contenedor: [

                {
                    id: "ingreso",
                    class: "col-12 mb-1"
                },
                {
                    id: "controlMermas",
                    class: "col-12 "
                },

                {
                    id: "merma",
                    class: "col-12 "
                },

            ]
        };

        this.createDivs({ data: json_grupos, div_content: 'contentDataGrupos' });// crear formato de reporte
    }

    filterBarDestajo() {

        obj.json_filter_bar = [
            {
                opc: 'input-calendar',
                id: 'date',
                class: 'col-12 col-lg-2 col-sm-3'
            },

            {
                opc: 'btn',
                id: 'btnDestajo',
                text: 'Buscar',
                class: 'col-12 col-lg-2 col-sm-3',

                fn: 'destajo.listDestajo()'

            },

            {
                opc: 'btn',
                id: 'btnImprimir',
                text: '<i class="icon-print"></i> Imprimir',
                class: 'col-12 col-lg-2 col-sm-3',
                color_btn: 'outline-primary',

                fn: 'destajo.printReport()'

            },

            // {
            //     opc: 'lbl',
            //     id: 'lblFolio',
            //     lbl: '<i class="icon-print"></i> Imprimir',
            //     class: 'col-12 col-lg-2 col-sm-3',


            // }

        ];


        obj.filterBar('filterBarDestajo');
        range_picker_now('date');

        this.listDestajo();



    }

    listDestajo() {



        let dtx = {
            tipo: "text",
            opc: "lsIngresos",
            date: $("#date").val(),
        }

        fn_ajax(dtx, link, "#contentDataGrupos").then((data) => {

            collector = data.folio;



            //    var ajax = this.searchTable({ id: "contentDataGrupos", extends: true });

            //    ajax.then((data) => {

            this.crearFormatoDestajo();

            $('#ingreso').rpt_json_table2({
                data: data.ventasArea,
                color_th: "bg-primary",
                grupo: "bg-disabled2",
                class: 'table table-bordered table-sm table-striped',

                f_size: "12",
                center:[4],
                right: [2, 3],
            });

            $('#controlMermas').rpt_json_table2({
                data: data.controlMermas,
                class: 'table table-bordered table-sm table-striped ',
                color_th: "bg-primary",

                right: [2, 3, 4, 5],
                f_size: '12'
            });

            $('#merma').rpt_json_table2({
                data: data.pagoColaborador,
                color_th: "bg-primary",

                right: [2, 3, 4, 5, 6, 7, 8],
                ipt: [2, 3, 4, 5, 6, 7],
                class: 'table table-bordered table-sm m-0 ',
                color_group: 'bg-disabled2',
                id: 'tb_pagoColaborador',
                f_size: '12'
            });

            eventoTabla('tb_pagoColaborador');



        });

    }

    printReport() {

        let dtx = {
            tipo: "text",
            opc: "lsIngresos",
            date: $("#date").val(),
        }

        fn_ajax(dtx, link, "#contentDataGrupos").then((data) => {

            collector = data.folio;



            //    var ajax = this.searchTable({ id: "contentDataGrupos", extends: true });

            //    ajax.then((data) => {

            this.crearFormatoDestajo();

            $('#ingreso').rpt_json_table2({
                data: data.ventasArea,
                color_th: "bg-primary",
                grupo: "bg-disabled2",
                class: 'table table-bordered table-sm table-striped',

                f_size: "14",
                center: [4],
                right: [2, 3],
            });

            $('#controlMermas').rpt_json_table2({
                data: data.controlMermas,
                class: 'table table-bordered table-sm table-striped ',
                color_th: "bg-primary",

                right: [2, 3, 4, 5],
                f_size: '14'
            });

            $('#merma').rpt_json_table2({
                data: data.pagoColaborador,
                color_th: "bg-primary",

                right: [2, 3, 4, 5, 6, 7, 8],
                ipt: [2, 3, 4, 5, 6, 7],
                class: 'table table-bordered table-sm ',
                color_group: 'bg-disabled2',
                id: 'tb_pagoColaborador',
                f_size: '12'
            });

            eventoTabla('tb_pagoColaborador');


            var divToPrint = document.getElementById("contentDataGrupos");

            var html =
                "<html><head>" +
                '<link href="../../src/plugin/bootstrap-5/css/bootstrap.min.css" rel="stylesheet" type="text/css">' +
                '<link href="../../src/css/navbar.css" rel="stylesheet" type="text/css">' +
                '<link href="https://www.plugins.erp-varoch.com/style.css" rel="stylesheet" type="text/css">' +
                '<body style="background-color:white;" onload="window.print(); window.close();  ">' +
                divToPrint.innerHTML +
                "</body></html>"

            var popupWin = window.open();

            popupWin.document.open();
            popupWin.document.write(html);
            popupWin.document.close();

        });



    }



   reabrirTicket(id) {

    this.swalQuestion({
        opts: {
            title: '¿Deseas reabrir el ticket ?',
        },
        data: {
            opc: 'reabrirTicket',
            id: id


        },
        methods: {
            request: (data) => {

                lsFolios();


            }
        }

    });
}

}

class Merma extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Merma";
    }

    render() {
        this.layout();
        this.filterBar();
        // this.ls();
    }

    layout() {
        this.primaryLayout({
            parent: "tab-merma",
            class: "",
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: "w-full my-3 line", id: `filterBarMerma` },
                container: { class: "w-full my-3  h-[calc(100vh)] p-3 rounded", id: `containerMerma` },
            },
        });

        $(`#containerMerma`).html(
          `<h2 class="text-xl font-bold text-center">Módulo en desarrollo</h2>`
        );
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
                // this.ls();
            },
        });
    }

    ls() {
        const rangePicker = getDataRangePicker(`calendar${this.PROJECT_NAME}`);

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: {
                opc: "ls",
                fi: rangePicker.fi,
                ff: rangePicker.ff
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: "dark",
                center: [1, 2, 3],
                right: [4]
            }
        });
    }


}


/* -- TAB DESTAJO -- */

function lsDestajo() {



    obj.dataSearchTable = {
        tipo: "text",
        opc: "rptGeneral",
        date: $("#iptDate").val(),
    };

    var ajax = obj.searchTable({  extends: true });




}

function StrTotal(total) {

    if (total == "-") {
        return 0;
    } else {
        return parseFloat(total.replace(/\$/g, "").replace(/,/g, ""));
    }

}

function eventoTabla(idTable) {

    $("#" + idTable + " input[type='text']").on("input", function () {

        var tr      = $(this).closest("tr");
        var columna = $(this).closest("td").index() + 1;  // Sumamos 1 porque los índices comienzan desde 0
        let idRow   = $(this).attr("id_row");
        let name    = $(this).attr("name");

        totalGrupo = 0;

        let totalxColumna =0;

        $("#" + idTable + " tbody tr").each(function () {

            var valor        = $(this).find("td input[id_row=" + idRow + "]:eq(" + (columna - 2) + ")").val();
            var valorColumna = $(this).find("td input:eq(" + (columna - 2) + ")").val();

            if (valor) {
                totalGrupo += parseFloat(valor);
            }

            if (valorColumna) {
                totalxColumna += parseFloat(valorColumna);
                console.log('total Columna',totalxColumna);
            }

        });

        $('#total' + name + idRow).text('$ ' + totalGrupo.toFixed(2));


        /*   -- calcular total general -- */

        let totalDestajo      = StrTotal($('#totalpagodestajo' + idRow).text());
        let totalDiasFestivos = StrTotal($('#totalDiasExtras' + idRow).text());
        let totalFonacot      = StrTotal($('#totalFonacot' + idRow).text());
        let totalInfonavit    = StrTotal($('#totalInfonavit' + idRow).text());
        let totalMaterial     = StrTotal($('#totalperdidaMaterial' + idRow).text());
        let totalPrestamos    = StrTotal($('#totalprestamoPersonal' + idRow).text());


        let totalX = totalDestajo - totalDiasFestivos - totalFonacot - totalInfonavit - totalMaterial - totalPrestamos;



        $('#totalPago' + idRow).text('$ ' + totalX);


        let data = {
            opc: "pagoColaborador",
            [name]: $(this).val(),
            id_Colaborador: $(this).attr("id"),
            id_Pago: collector.idPago
        };


        // Formulas para el calculo de destajo:


        let destajo      = tr.find('td input').eq(0).val();
        let diasFestivos = tr.find('td input').eq(1).val();
        let Fonacot      = tr.find('td input').eq(2).val();
        let Infonavit    = tr.find('td input').eq(3).val();
        let material     = tr.find('td input').eq(4).val();
        let prestamos    = tr.find('td input').eq(5).val();



        let pago = destajo - diasFestivos - Fonacot - Infonavit - material - prestamos;


        tr.find('td').eq(7).text(pago);
        tr.find('td').eq(7).addClass('text-end');

        const listConceptos = ['pagodestajo', 'DiasExtras', 'perdidaMaterial', 'Fonacot', 'Infonavit', 'prestamoPersonal', 'Pago'];

        listConceptos.forEach((element, index) => {

            let frances = StrTotal($(`#total${element}1`).text());
            let pasteleria = StrTotal($(`#total${element}2`).text());
            let bizcocho = StrTotal($(`#total${element}4`).text());

            let total = frances + pasteleria + bizcocho;


            $(`#total${element}5`).html('$ ' + total.toFixed(2)).addClass('text-end');
        });

        // upd / insert registros:

        simple_send_ajax(data, link, "").then((data) => { });



    });



    //     var tr      = $(this).closest("tr");
    //     var columna = tr.find('td input').eq(this).index();









    //     // Sumar la columna

    //     let total = 0;
    //     let col = columna;












    //     // //     let totalGral = totalColumna(idTable, 5);
    //     // //     $('#txtTotal').html(totalGral);

    //     // });


    // });
}






