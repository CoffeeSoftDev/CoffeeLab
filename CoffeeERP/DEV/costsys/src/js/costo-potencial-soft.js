

class SoftRestaurant extends Complements {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        
    }

    initComponents() {
        this.crearFormato();
        this.filterBar();
        this.Status = "";
        this.Note = "";
    }

    crearFormato() {
        let json = {
            id: "grupo",
            class: "col-12",
            contenedor: [
                {
                    id: "filterDesp",
                    class: "col-12 mb-2"
                },
                {
                    id: "contentDespl",
                    class: "col-12 my-3"
                },
            ]
        };
        this.createDivs({ data: json, div_content: 'tab-soft' });// crear formato de reporte
    }

    SubirDesplazamiento() {
        
        // Obtén el texto del mes seleccionado
        const mesText = $('#Mes option:selected').text();

        Swal.fire({
            title: `¿Estas seguro?`,
            html: `Esta acción permite <b>${this.Status} </b> para el mes de <b class="uppercase">${mesText}</b>.<br>
            <span class="text-gray-400 text-xs">${this.Note}</span>
            <br>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si, Aceptar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2563eb', // Azul Tailwind 600
            cancelButtonColor: '#6b7280',  // Gris Tailwind 400
            allowOutsideClick: false

        }).then((result) => {

            // Si el usuario hace clic en "Subir desplazamientos"
            if (result.isConfirmed) {
                this.idFilterBar = "filterBar";
                // mandar a traer los desplazamientos:
                this._dataSearchTable = {
                    tipo: "text",
                    opc: "subirDesplazamientos",
                    subir: 1,
                    area: $('#Clasificacion option:selected').text()
                };
                var ajax = this.searchTable({ id: "contentDespl", extends: true });
                ajax.then((data) => {
                    soft.ls();
                });
            }
        });

    }

    // SubirDesplazamiento() {

    //     let upDesplazamiento = new modal_complements();

    //     upDesplazamiento._attr_modal = {
    //         title: '¿Que te gustaria hacer con los desplazamientos ?',
    //         // confirmButtonText: 'Consultar Despl. Soft',
    //         denyButtonText: 'Cargar en costo potencial',
    //         confirmButtonText:null

    //     };


    //     // asignar metodo multiple questions y extender el swal.fire:
    //     let swalDesp = upDesplazamiento.multipleQuestions({ extends: true });


    //     swalDesp.then((result) => {  // Realiza la accion de acuerdo a la respuesta del usuario :

    //         // if (result.isConfirmed) { // comparar desplazamientos:

    //         //     this.compararCostoPotencial();



    //         // } else
            
    //         if (result.isDenied) { //cargar costo potencial.

    //             this.idFilterBar = "filterBar";

    //             // mandar a traer los desplazamientos:
    //             this._dataSearchTable = {

    //                 tipo: "text",
    //                 opc: "subirDesplazamientos",
    //                 subir: 1,
    //                 area: $('#Clasificacion option:selected').text()

    //             };

    //             var ajax = this.searchTable({ id: "contentDespl", extends: true });

    //             ajax.then((data) => {

    //                 $("#contentDespl").rpt_json_table2({
    //                     data: data,
    //                     // color_th:'bg-success',
    //                     f_size: "14",
    //                     center: [3, 4, 7],
    //                     extends: true,
    //                 });
    //             });


    //         }







    //     });

    // }

    compararCostoPotencial() {

        // this.createTable({

        //     parent: 'contentDespl',
        //     idFilterbar:'filterBar',
        //     data: {
        //         opc: 'subirDesplazamientos',
        //             subir: 0,
        //             area: $('#Clasificacion option:selected').text()
        //     },

        //     conf: { datatable: false, },

        //     attr: {
        //         color_th: 'bg-primary',
        //         class_table: 'table table-bordered table-sm table-striped',
        //         right: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        //     },


        // });


        this.idFilterBar = "filterBar";

        // mandar a traer los desplazamientos:
        this.dataSearchTable = {

            tipo: "text",
            opc: "subirDesplazamientos",
            subir: 0,
            area: $('#Clasificacion option:selected').text()
        };

        var ajax = this.searchTable({ id: "contentDespl", extends: true });

        ajax.then((data) => {


            if (data.isData.length > 0) {

                let _rowNotFound = data.notFound;

                let json_tab = [
                    {
                        tab: "Productos agregados",
                        id: "tab1",
                        active: true, // indica q pestaña se activara por defecto
                        contenedor: [ // si el tab tendra contenedores especificos, se pueden agregar como objetos
                            {
                                id: "content-agregados",
                                class: "col-sm-12 ",
                            },

                        ],
                    },

                    // forma para crear un simple tab
                    {
                        tab: "Productos no encontrados ",
                        id: "content-no-agregados",

                    },
                ];

                $("#contentDespl").simple_json_tab({ data: json_tab });



                $("#content-agregados").rpt_json_table2({
                    data: data,
                    f_size: "12",
                    center: [6],
                    extends: true,
                    id:'tbSuccess'
                });

                $("#content-no-agregados").rpt_json_table2({
                    data: _rowNotFound,
                    f_size: "12",
                    center: [1, 4],
                    extends: true,
                });

                data_table_export('#tbSuccess');

            } else {

                $("#contentDespl").rpt_json_table2({
                    data: data,
                    f_size: "14",
                    center: [2, 5],
                    extends: true,
                });

            }

        });


    }

    filterBar() {
        const filterSoft = [
          // {
          //     opc      : 'btn',
          //     color_btn: 'soft',
          //     fn       : 'appSoft.modalProductosVendidos()',
          //     text     : "Soft Restaurant",
          //     class    : "col-sm-2 col-12",
          // },

          {
            opc: "btn",
                fn: "soft.ls()",
            text: "Consultar",
            icon: "icon-user",
            color_btn: "outline-primary",
            class: "col-sm-2 col-12",
          },

          {
            opc: "btn",
            fn: "soft.SubirDesplazamiento()",
            text: "Subir ",
            id: "buttonDesplazamiento",
            color_btn: "info",
            class: "col-sm-2 col-12",
          },

          // {
          //     opc      : 'btn',
          //     fn: 'des.ls()',
          //     text     : "Costsys",
          //     icon     : 'icon-user',
          //     color_btn: 'success',
          //     class    : "col-sm-2 col-12",
          // },
        ];

        $("#filterDesp").simple_json_content({ data: filterSoft, type: false });
    }

    ls() {
        const año = $('#Anio option:selected').text();

        this.createTable({
            parent: "contentDespl",
            idFilterBar: "filterBar",
            coffeesoft: true,
            data: { opc: "lsCostoPotencial" },
            conf: { datatable: false, pag: 10 },
            attr: {
                id: "tbEntities",
                f_size: 12,
                center: [1, 2, 3],
                right: [4],
                // Title con el mes seleccionado
                title: `Resumen mensual de desplazamientos cargados (${año})`,
                subtitle: 'Cada fila muestra los productos cargados en el mes seleccionado. Cuando estés listo, sube la información al sistema de costos (CostSys)',
                extends: true
            },

            success:(request )=>{

                const totalRecetas = request.totalRecetas;

                // Selecciona el botón por su ID
                const $btn = $("#buttonDesplazamiento");

                if (totalRecetas == 0) {
                    // Cambia a color amarillo y texto "Crear tablero"
                    this.Status = 'Crear tablero';
                    this.Note = "";

                    $btn
                        .removeClass('btn-info btn-primary bg-blue-600')
                        .addClass('btn-soft text-white')
                        .text('Crear tablero')
                        .off('click')
                        .on('click', () => soft.CrearTablero()); // Cambia la función si lo necesitas
                } else {
                    // Cambia a color azul y texto "Subir desplazamiento"
                    this.Status = 'Subir desplazamiento';
                    this.Note   = "Nota: Si ya existe un desplazamiento creado se remplazara con el mes actual.";
                    $btn
                        .removeClass('btn-soft text-white')
                        .addClass('btn-info bg-blue-600')
                        .text('Subir desplazamiento')
                        .off('click')
                        .on('click', () => soft.SubirDesplazamiento());
                }

            }
        });
    }

    listCostoPotencial() {

        this._dataSearchTable = {
            tipo: "text",
            opc: "lsCostoPotencial",

        };

        var ajax = this.searchTable({ id: "contentDespl", extends: true });

        ajax.then((data) => {

            $("#contentDespl").rpt_json_table2({
                data: data,
                center: [1, 2, 3],
                right: [4],
                f_size: "14",
            });
        });
    }

    listDesplazamientos() {

        this._dataSearchTable = {
            tipo: "text",
            opc: "lsTurnos",

        };

        var ajax = this.searchTable({ id: "ls", extends: true });

        ajax.then((data) => {

            $("#ls").rpt_json_table2({
                data: data,
                f_size: "12",
            });
        });

    }

    quitarCostoPotencial(event) {
        let tr = $(event.target).closest("tr");
        let fecha = tr.find('td').eq(0).text();
        let fechatext = tr.find('td').eq(1).text();

        let nameUdn = $('#UDNs option:selected').text();


        this.swalQuestion({

            opts: {
                title: `Deseas quitar los registros de
                <strong class="fw-semibold text-primary">${nameUdn}</strong> de
                <strong class="fw-semibold text-primary text-uppercase"> ${fechatext} </strong>` ,
            },

            extends: true,

        }).then((result) => {

            if (result.isConfirmed) {


                fn_ajax({

                    opc: 'quitarCostoPotencial',
                    fecha_costo: fecha,
                    id_Clasificacion: $('#Clasificacion').val()

                }, this._link).then((data) => {

                    soft.listCostoPotencial();

                });
            }
        });
    }

    // Complements.
    createTable(options) {

        var defaults = {

            extends: false,
            parent: this.div_modulo,
            idFilterBar: '',

            parent: 'lsTable',
            coffeesoft: false,

            conf: {
                datatable: true,
                fn_datatable: 'simple_data_table',
                beforeSend: true,
                pag: 15,
            },

            methods: {
                send: (data) => { }
            }


        };

        // configurations.
        const dataConfig = Object.assign(defaults.conf, options.conf);


        let opts = Object.assign(defaults, options);
        const idFilter = options.idFilterBar ? options.idFilterBar : '';

        if (idFilter) { // se activo la validacion por filtro

            const sendData = { tipo: 'text', opc: 'ls', ...options.data };
            var extendsAjax = null; // extender la funcion ajax


            $(`#${idFilter}`).validar_contenedor(sendData, (datos) => {

                // console.log('opts', dataConfig);

                let beforeSend = (dataConfig.beforeSend) ? '#' + options.parent : '';

                extendsAjax = fn_ajax(datos, this._link, beforeSend);


                if (!options.extends) { // si la variable extends no esta definida se ejectuta de forma normal


                    extendsAjax.then((data) => {


                        let attr_table_filter = {
                            data: data,
                            f_size: '14',
                            id: 'tbSearch'
                        };

                        attr_table_filter = Object.assign(attr_table_filter, opts.attr);

                        opts.methods.send(data);

                        if (opts.success)
                            opts.success(data);


                        if (opts.coffeesoft) {

                            attr_table_filter.parent = opts.parent;

                            this.createCoffeTable(attr_table_filter);

                        } else {

                            $('#' + options.parent).rpt_json_table2(attr_table_filter);
                        }

                        if (dataConfig.datatable) {
                            window[dataConfig.fn_datatable]('#' + attr_table_filter.id, dataConfig.pag);
                        }






                    });


                }


            });

            if (opts.extends) {
                return extendsAjax;
            }







        } else {

            let sendData = {
                opc: 'ls',
                ...opts.data
            };



            extendsAjax = fn_ajax(sendData, this._link, '#' + opts.parent);


            if (!opts.extends) { // si la variable extends no esta definida se ejectuta de forma normal


                extendsAjax.then((data) => {

                    opts.methods.send(data);

                    this.processData(data, opts, dataConfig);


                });


            }



        }





    }

    swalQuestion(options = {}) {

        /*--  plantilla --*/
        let objSwal = {
            title: "",
            text: " ",
            icon: "warning",

            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            ...options.opts,
            customClass: {
                popup: "bg-[#1F2A37] text-white rounded-lg shadow-lg",
                title: "text-2xl font-semibold",
                content: "text-gray-300",
                confirmButton:
                    "bg-[#1C64F2] hover:bg-[#0E9E6E] text-white py-2 px-4 rounded",
                cancelButton:
                    "bg-transparent text-white border border-gray-500 py-2 px-4 rounded hover:bg-[#111928]",
            },
        };


        var defaults = {

            data: { opc: "ls" },
            extends: false,
            fn: '',

            ...options,

            methods: ''

        };

        let opts = Object.assign(defaults, options);


        let extends_swal = Swal.fire(objSwal);



        if (options.extends) {

            return extends_swal;

        } else {

            extends_swal.then((result) => {

                if (result.isConfirmed) {


                    fn_ajax(opts.data, this._link, "").then((data) => {

                        if (opts.fn) {
                            window[opts.fn]();

                        } else if (opts.methods) {
                            // Obtener las llaves de los mÃ©todos
                            let methodKeys = Object.keys(opts.methods);
                            methodKeys.forEach((key) => {
                                const method = opts.methods[key];
                                method(data);
                            });

                        }


                    });
                }
            });



        }




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
                    class: `${align} ${opts.border_row} px-3 py-2 truncate ${colorBg}`,
                    html: tdText
                };



                // Si opts.extends está activo y data[key] es objeto, sobrescribe atributos
                if (opts.extends && typeof data[key] === 'object' && data[key] !== null) {
                    cellAttributes = Object.assign(cellAttributes, data[key]);
                    cellAttributes.class += ` ${opts.border_row} `;
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
                actions = $("<td>", { class: `px-2 py-2 flex justify-center items-center ${colorBg} ${opts.border_row}` });

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
