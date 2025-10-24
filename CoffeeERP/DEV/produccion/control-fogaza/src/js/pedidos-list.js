class ListaPedidos extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    render() {
        this.layout();
        this.filterBar();

        this.lsPedidos();
    }

    layout() {
        // this.layoutWithCards({

        //     parent: 'tab-lista-pedidos',

        //     cardtable: {
        //         className: 'col-8 ',
        //         filterBar: { id: 'filterBarPedidos' },
        //         container: { id: 'containerListPedidos', class:'w-100' },
        //     },

        //     cardticket: {
        //         className: 'col-4 line',
        //         filterBar: { id: 'filterBarTicket' },
        //         message: { id: 'containerMessage',class:'h-full' },
        //         container: { id: 'containerTicketPedidos', class:'col-12 p-2' },
        //     }
        // });

        this.primaryLayout({
            parent: 'tab-lista-pedidos',
            id: this.PROJECT_NAME,
            class: 'flex mx-2 my-2 h-100 p-2',
            card: {
                filterBar: { class: 'w-full my-3', id: 'filterBarPedidos' },
                container: {
                    class: 'w-full my-3 rounded p-3',
                    id: 'containerListPedidos',
                },
            },
        });
    }

    filterBar() {

        const filter = [
            {
                opc: "input-calendar",
                lbl: "Buscar por fecha:",
                id: "iptCalendar",
                class: 'col-sm-3 col-12'
            },
            {
                opc: "select",
                lbl: "Ver por:",
                id: "typeReport",
                class: 'col-sm-3 col-12',
                data: [
                    { id: 'creacion', valor: 'Pedidos creados' },
                    { id: 'entrega', valor: 'Pedidos programados' },
                ],
                onchange: 'pedidos.lsPedidos()'
            },




            {
                opc: 'button',
                className: 'w-100',
                class: 'col-sm-3',
                icon: 'icon-box-1',
                color_btn: 'primary',
                text: 'Formato de pedido',
                onClick: () => {
                    this.createFormatPedidos();
                },
            },
            {
                opc: 'button',
                className: 'w-100 ',
                class: 'col-sm-2',
                icon: 'icon-whatsapp',
                color_btn: 'success',
                text: 'Enviar',
                onClick: () => {
                    this.modalPedidos();
                },
            },
        ];

        this.createfilterBar({ parent: 'filterBarPedidos', data: filter });
        // initialized.
        dataPicker({
            parent: 'iptCalendar',
            rangepicker: {
                startDate: moment(), // Día actual por defecto
                endDate: moment(),
                showDropdowns: true,
                ranges: {
                    'Día actual': [moment(), moment()],
                    '1 Semana': [moment().startOf('week'), moment().endOf('week')],
                    '2 Semanas': [moment().startOf('week'), moment().add(1, 'week').endOf('week')],
                    'Mes actual': [moment().startOf('month'), moment().endOf('month')],
                    'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                }
            },
            onSelect: (start, end) => {
                this.lsPedidos();
            }
        });
    }

    createFormatPedidos() {
        let rangePicker = getDataRangePicker('iptCalendar');

        useFetch({
            url: this._link,
            data: { opc: 'listAllpedidos', fi: rangePicker.fi, ff: rangePicker.ff },
            success: (data) => {
                $('#containerListPedidos').html(data);
            }
        });
    }

    lsPedidos() {
        const tipo = $("#typeReport").val();
        const date = getDataRangePicker('iptCalendar');

        const titulo = date.fi === date.ff
            ? `Pedidos Generados el día (${formatSpanish(date.fi)})`
            : `Pedidos Generados al Periodo del (${formatSpanish(date.fi)}) al (${formatSpanish(date.ff)})`;


        $('#containerListPedidos').html(`
            <div class="w-full mb-4 space-y-4">

                <div id="containerTable"></div>

                <div class="flex justify-end gap-8 text-sm md:text-base text-gray-600">

                    <div class="flex items-center gap-2">
                        <span class="font-medium">Total General:</span>
                        <span id="txtTotal" class="font-bold ">0.00</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <span class="font-medium">Total Anticipos:</span>
                        <span id="txtAnticipo" class="font-bold ">0.00</span>
                    </div>
                </div>

            </div>
         `);


        const opc = tipo === 'entrega' ? 'lsPedidosProgramados' : 'lsPedidos';

        const tituloPrincipal = tipo === 'entrega'
            ? 'Lista de Pedidos Programados'
            : 'Lista de Pedidos Creados';

        this.createdTable({
            parent: 'containerTable',
            idFilterBar: 'filterBarPedidos',
            coffeesoft: true,
            data: {
                opc: opc,
                fi: date.fi,
                ff: date.ff,
            },
            conf: { datatable: true, pag: 10 },
            attr: {
                id: 'tableVentas',
                theme: 'corporativo',
                subtitle: titulo,
                title: tituloPrincipal,
                right: [5],
                f_size: 12,
                center: [1, 2, 6]
            },
            success: (request) => {
                $('#txtTotal').html(request.totalGeneral);
                $('#txtAnticipo').html(request.totalAnticipo);
            }
        });

    }

    onshowTicket(id) {



        useFetch({
            url: this._link,
            data: { opc: 'getProductsByFol', NoFolio: id, },
            success: (data) => {

                this.showTicket({
                    parent: 'containerTicketPedidos',
                    data: data,
                    type: 'details'
                });
            }
        });

    }

    async printOrderDoc() {

        const date = getDataRangePicker('iptCalendar');


        this.swalQuestion({
            opts: {
                title: '¿Confirmar envío de pedidos?',
                text: "Esta acción generará el documento e indicará que los pedidos han sido enviados.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, imprimir y confirmar',
                cancelButtonText: 'Cancelar'
            },

            data: { opc: "confirmOrder", fi: date.fi, ff: date.ff },

            methods: {
                send: () => this.formatOrder(),
            },
        });

    }

    formatOrder() {

        var divToPrint = document.getElementById("containerListPedidos");

        var style = `
             *{box-sizing:border-box}
            .titulo{font-size:16px;font-weight:700;text-align:center;margin:6px 0 12px}
            .box{padding:10px 12px;margin:20px 0 14px;page-break-inside:avoid;border:1px solid#c0c0c0;border-radius:8px}
            .header-ord{font-weight:700;font-size:14px;margin-bottom:2px}.subheader{font-size:11px;color:#666;margin-bottom:8px}
            .tbl{width:100%;border-collapse:collapse}.tbl td{border:1px solid #cfcfcf;vertical-align:top;padding:6px}
            .tbl tr.img-row td{border:none;}           /* <-- sin borde en fila de imágenes */
            .col-img{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start; padding-bottom:10px;}
            .col-prod{width:44%}.col-entrega{width:30%}
            .title-sec{font-weight:700;font-size:13px;margin:0 0 8px;border-bottom:1px solid #cfcfcf;padding-bottom:4px}
            .label{font-weight:700}.kv{line-height:1.45}.w-25{width:25%}
            .img{width:150px;height:150px;border-radius:10px;border:1px solid #cfcfcf;object-fit:cover;display:block}
            .img-ph{width:150px;height:150px;border:1px solid #cfcfcf;background:#eee;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#888;font-size:11px}
            .specs{width:100%;border-collapse:collapse}.specs td{border:1px solid #cfcfcf;padding:8px;vertical-align:top}
            .observa{padding:10px 0 3px}
            .text-purple{color:#5a2d82}
            .text-description{color:#003360; font-weight:600; }
            `;

        var html =
            "<html><head>" +
            '<link href="https://erp-varoch.com/ERP24/src/css/navbar.css" rel="stylesheet" type="text/css">' +
            '<link href="https://erp-varoch.com/ERP24/src/plugin/bootstrap-5/css/bootstrap.min.css" rel="stylesheet" type="text/css">' +
            '<script src="https://cdn.tailwindcss.com"></script>' +

            '<style type="text/css" media="print"> @page { margin: 5px; } </style> ' +
            '<style>' + style + '</style>' +
            '</head>' +
            '<body onload="window.print(); window.close(); ">' +
            divToPrint.innerHTML +
            "</body></html>"
        //
        var popupWin = window.open("", "_blank", "width=758, height=800");

        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    modalPedidos() {
        let cookies = getCookies();
        const tipo = $("#typeReport").val();

        let rangePicker = getDataRangePicker('iptCalendar');
        this.createModalForm({
            id: 'modalListaPedidos',
            bootbox: { title: ' Enviar lista de pedidos ', id: 'mdlPedidos' }, // agregar conf. bootbox
            json: [
                {
                    opc: 'select',
                    lbl: 'Elige un colaborador',
                    id: 'id_colaborador',
                    data: [
                        { id: 0, valor: ' -- Selecciona un colaborador -- ' },
                        { id: 9621501886, valor: 'Sergio Os' },
                        // { id: 9621149020, valor: 'CoffeSoft ' },
                        ...colaboradores
                    ],
                    class: 'col-12',
                    multiple: true,
                    onchange: 'setTelefono()'
                },
                {
                    opc: "input-group",
                    lbl: "Número de WhatsApp",
                    id: "wp",
                    tipo: "number",
                    required: true,
                    placeholder: "",
                    icon: "icon-phone-2",
                    class: 'col-12',
                },
                {
                    opc: "input-group",
                    lbl: "Con copia",
                    class: 'col-12',
                    id: "CC",
                    tipo: "number",
                    required: false,
                    value: cookies.TEL,
                    icon: "icon-phone-2",
                },
                {
                    opc: 'btn-submit',
                    text: 'Enviar',
                    class: 'col-12'
                }
            ]
            ,
            autovalidation: true,
            data: { opc: 'sendWhatsapp', fi: rangePicker.fi, ff: rangePicker.ff, typeReport: tipo },
            success: (data) => {

                let orderCount = data.oderCount === 1
                    ? 'Se ha enviado 1 pedido a producción exitosamente.'
                    : `Se han enviado ${data.orderCount} pedidos a producción exitosamente.`;

                alert({ title: orderCount });


                this.lsPedidos();

            }


        });


        // iniatilized.
        $('#id_colaborador').option_select({ select2: true, father: true });
    }

    cancelPedidoTicket(id) {
        this.swalQuestion({
            opts: {
                title: '¿Deseas cancelar el siguiente ticket de ventas ?',
            },
            data: { opc: 'cancelTicket', idFolio: id },
            methods: {
                request: (data) => {
                    this.lsPedidos();
                }
            }
        });
    }


    // Order ticket


    async printOrder(id) {
        idFolio = id;

        const pos = await useFetch({
            url: this._link,
            data: { opc: 'getOrder', NoFolio: id, },
        });

        const modal = bootbox.dialog({
            closeButton: true,
            title: ` <div class="flex items-center gap-2 text-gray-800 text-lg font-semibold">
                        <i class="icon-print text-blue-900 text-xl"></i>
                        Imprimir comprobante de pedido
                    </div>`,

            message: `
                <div id="filterBarPrintOrder"  class="text-center"></div>
                <div id="containerPrintOrder"></div>
                `
        });

        this.filterBarTicket();

        // this.showTicket({ parent: 'containerPrintOrder', data: pos, type: 'details' });

        this.ticketPasteleria({

            parent: 'containerPrintOrder',
            data: {
                head: pos.order || {},
                products: pos.products || {},
            }
        });

    }


    ticketPasteleria(options) {
        const defaults = {
            parent: "root",
            id: "ticketPasteleria",
            class: "bg-white p-4 rounded-lg shadow font-mono text-gray-900",
            data: {
                head: {
                    folio: "",
                    is_quote: false,
                    name: "[cliente]",
                    phone: "",
                    date_order: "[fecha]",
                    time_order: "[hora]",
                    notes: "[nota]",
                    total_pay: 0,
                    anticipo: 0,
                    forma_pago: "",
                },
                products: []
            }
        };

        const opts = Object.assign({}, defaults, options);
        const data = opts.data.head || {};
        const productos = opts.data.products || [];

        const container = $("<div>", {
            id: opts.id,
            class: opts.class
        });

        const fmt = (val) => {
            const num = parseFloat(val || 0);
            return num > 0 ? `$${num.toFixed(2)}` : "-";
        };

        const header = `
        <div class="flex flex-col items-center mb-4">
            ${data.logo ? `<img src="https://erp-varoch.com/ERP24/${data.logo}" alt="Logo" class="w-32 mb-1" />` : ""}
            ${data.company ? `<div class="text-xs font-semibold uppercase mb-1">${data.company}</div>` : ""}
            <h1 class="text-lg font-bold">PEDIDOS DE PASTELERÍA</h1>
            ${data.is_quote ? `<div class="text-xs font-bold text-red-600 uppercase">COTIZACIÓN</div>` : ""}
        </div>

        <div class="text-sm space-y-2">
            ${data.folio ? `
            <div class="flex justify-between">
                <div>
                    <div class="font-semibold">FOLIO:</div>
                    <div class="uppercase">${data.folio}</div>
                </div>
            </div>` : ""}
            <div class="flex justify-between">
                <div>
                    <div class="font-semibold">NOMBRE:</div>
                    <div class="uppercase">${data.Name_Cliente}</div>
                </div>
                <div>
                    <div class="font-semibold">FECHA Y HORA DE ENTREGA:</div>
                    <div class="uppercase">${data.fechapedido} ${data.horapedido}</div>
                </div>
            </div>
            ${data.observacion ? `
            <div>
                <div class="font-semibold">NOTA:</div>
                <div>${data.observacion}</div>
            </div>` : ""}
            <hr class="border-dashed border-t my-2 mt-4" />
            <div class="text-center font-bold mb-2 mt-2">PRODUCTOS</div>
            <hr class="border-dashed border-t my-2" />
        </div>`;

        let containerProducto = '';
        let totalGeneral = 0;

        productos.forEach(product => {
            const p        = product.data[0] || {};
            const base     = parseFloat(p.importeBase || 0);
            const oblea    = parseFloat(p.importeOblea || 0);
            const precio   = parseFloat(product.price || 0);
            const subtotal = base + oblea + precio;

            totalGeneral += subtotal;

            containerProducto += `
            <div class="text-sm space-y-2 mb-4">
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <div class="font-semibold">MODELO:</div>
                        <div class="uppercase">${product.name || "-"}</div>
                    </div>
                    <div>
                        <div class="font-semibold">PERSONAS:</div>
                        <div class="uppercase">${product.portion || "-"}</div>
                    </div>
                </div>

            ${(p.relleno || p.leyenda) ? `
            <div class="grid grid-cols-2 gap-4 mt-2">
                ${p.relleno ? `
                <div>
                    <div class="font-semibold">RELLENO:</div>
                    <div class="uppercase">${p.relleno}</div>
                </div>` : ""}
                ${p.leyenda ? `
                <div>
                    <div class="font-semibold">LEYENDA:</div>
                    <div class="uppercase">${p.leyenda}</div>
                </div>` : ""}
            </div>` : ""}

           
            <div class="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <div class="font-semibold">PRECIO:</div>
                    <div class="text-right me-5">${fmt(precio)}</div>
                </div>
                ${oblea > 0 ? `
                <div>
                    <div class="font-semibold">IMPORTE OBLEA:</div>
                    <div class="text-right me-5">${fmt(oblea)}</div>
                </div>` : ""}
            </div>
            ${base > 0 ? `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <div class="font-semibold">IMPORTE BASE:</div>
                    <div class="text-right me-5">${fmt(base)}</div>
                </div>
            </div>` : ""}
            <hr class="border-dashed border-t my-2" />
        </div>`;
        });

        const descuento = parseFloat(data.discount || 0);
        const subtotalConDescuento = totalGeneral - descuento;

        const anticipo =
            parseFloat(data.efectivo || 0) +
            parseFloat(data.tdc || 0);

        const restante = subtotalConDescuento - anticipo;

        containerProducto += `
        <div class="text-sm space-y-2 mt-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <div class="font-semibold">SUBTOTAL:</div>
                    <div class="text-right me-5">${fmt(totalGeneral)}</div>
                </div>
                ${descuento > 0 ? `
                <div>
                    <div class="font-semibold">DESCUENTO ${data.discount_percent} %:</div>
                    <div class="text-right me-5 text-green-600">-${fmt(descuento)}</div>
                </div>` : ''}
            </div>
            <div class="grid grid-cols-2 gap-4 mt-2">
                <div>
                    <div class="font-semibold">TOTAL:</div>
                    <div class="text-right me-5 font-bold">${fmt(subtotalConDescuento)}</div>
                </div>
                <div>
                    <div class="font-semibold">ANTICIPO:</div>
                    <div class="text-right me-5">${fmt(anticipo)}</div>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-2">
                <div>
                    <div class="font-semibold">RESTANTE:</div>
                    <div class="text-right me-5">${fmt(restante)}</div>
                </div>
            </div>
            <hr class="border-dashed border-t my-2" />
        </div>`;

        container.append(header);
        container.append(containerProducto);
        container.append(this.createNote());

        $(`#${opts.parent}`).html(container);
    }

    filterBarTicket() {
        const container = $("#filterBarPrintOrder").empty();

        // Row principal
        const row = $("<div>", { class: "row", id: "filterForm" });

        // Columna: subir archivo
        const colFile = $("<div>", { class: "col-sm-4" });
        colFile.append(
            $("<label>", { class: "fw-bold", text: "" }),
            $("<input>", {
                class: "hide",
                type: "file",
                accept: ".xlsx, .xls",
                id: "iptFile",
                onchange: "pedidos.subirFoto()"
            }),
            $("<label>", {
                for: "iptFile",
                class: "btn btn-outline-primary border border-primary-400 col-12 ",
                html: `<i class="icon-file-image"></i> Subir foto`
            })
        );

        // Columna: imprimir
        const colPrint = $("<div>", { class: "col-sm-4" });
        colPrint.append(
            $("<label>", { class: "fw-bold", text: "" }),
            $("<button>", {
                class: " btn btn-outline-primary col-12",
                type: "button",
                html: `<i class="icon-print"></i> Imprimir`
            }).on("click", () => {
                const divToPrint = document.getElementById("containerTicks");
                const html = `
                <html><head>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style type="text/css" media="print">@page { margin: 5px; }</style>
                    <style>
                        #containerTicks {
                            font-family: Arial, sans-serif;
                            font-size: 15px;
                            line-height: 1.42857143;
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    ${divToPrint.innerHTML}
                </body></html>`;
                const popupWin = window.open("", "_blank", "width=758, height=800");
                popupWin.document.open();
                popupWin.document.write(html);
                popupWin.document.close();
            })
        );

        // Ensamblar
        row.append(colPrint, colFile);
        container.append(row);
    }


    subirFoto() {

        var archivos = document.getElementById("iptFile");
        var archivo = archivos.files[0]; // Obtener el primer archivo seleccionado


        const formData = new FormData();

        formData.append('file', archivo);
        formData.append('id', idFolio);
        formData.append('opc', 'setPastel');


        fetch(ctrl_list, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al subir la foto: " + response.statusText);
                }
                return response.json();

            }).then((data) => {

                alert("Foto subida exitosamente.");

                this.onshowTicket(idFolio);
                this.lsPedidos();

            })
            .catch((error) => {
                console.error("Hubo un problema con la subida de la foto:", error);
                alert("Hubo un problema al subir la foto. Por favor, inténtalo nuevamente.");
            });





        // console.log('subirFoto',file)
    }

    showTicket(options) {
        const defaults = { parent: 'container', data: { head: { data: {} }, row: [] }, type: '' };
        const opts = Object.assign({}, defaults, options);

        // Alert sin foto
        const alertComponent = $('<div>', {
            class: 'alert alert-warning text-xs m-2',
            role: 'alert',
            html: '<i class="icon-camera"></i> Para cerrar el proceso es necesario subir evidencia de pastel ',
        });

        // Alert con foto subida
        const alertSuccess = $('<div>', {
            class: 'flex items-center border rounded-lg my-2 bg-gray-100 p-2',
            role: 'alert',
            html: `
            <div class="flex-shrink-0">
                <img src="https://erp-varoch.com/${opts.data.row[0]?.srcCatalog || ''}" class="w-28 h-28 rounded-md object-cover" alt="Foto evidencia" />
            </div>
            <div class="ml-4">
                <p class="text-xs">La foto se subió exitosamente.</p>
            </div>
        `,
        });

        const data = opts.data.head.data;
        const div = $('<div>', { id: 'containerTicks', class: 'bg-white' });

        div.append(`
            <div class="flex flex-col items-center">
                <img src="" alt="Panadería y pastelería" class="w-48 max-w-full mt-2" />
                <h1 class="p-2 text-center font-bold">PEDIDOS DE PASTELERÍA </h1>
            </div>
        `);

        let card = $('<div>', { class: 'flex grid grid-cols-2 text-xs mx-2 my-2' });

        div.append($('<hr>', { class: 'py-2 mx-2' }));

        const head = `
            <div class="flex-1 text-xs p-2 space-y-2">
                <div class="flex justify-between">
                    <div>
                        <div class="font-bold">NOMBRE:</div>
                        <div class="uppercase">${data.cliente || ''}</div>
                    </div>
                    <div>
                        <div class="font-bold">FECHA Y HORA DE ENTREGA:</div>
                        <div class="uppercase">${data.pedido || ''} ${data.horapedido || ''}</div>
                    </div>
                </div>
                <div>
                    <div class="font-bold">NOTA:</div>
                    <div>${data.observacion ?? ''}</div>
                </div>
                <hr class="border-black" />
            </div>
        `;


        div.append(head);

        // Mostrar alerta según si hay foto o no
        if (!opts.data.row[0]?.srcCatalog) {
            $('#' + opts.parent).html(alertComponent);
        } else {
            $('#' + opts.parent).html(alertSuccess);
        }

        const costo = data.total || 0;
        const anticipo = data.anticipo || 0;
        const total = costo - anticipo;



        const products = [
            {
                row: {
                    Modelo: opts.data.row[0]?.name || '',
                    Personas: opts.data.row[0]?.portion || '',
                },

                Relleno: opts.data.row[0]?.data?.[0]?.relleno || '',
                leyenda: opts.data.row[0]?.leyenda || '',
                observaciones: opts.data.row[0]?.data?.[0]?.observaciones || '',
                separator: true,
                'IMPORTE BASE': formatPrice(opts.data.row[0]?.data?.[0]?.importeBase) || '',
                'IMPORTE OBLEA': formatPrice(opts.data.row[0]?.data?.[0]?.importeOblea) || '',

                ANTICIPO: formatPrice(anticipo),
                TOTAL: formatPrice(costo),
                'RESTANTE': formatPrice(total),
            }

        ];
        const priceKeys = ['IMPORTE BASE', 'IMPORTE OBLEA', 'ANTICIPO', 'TOTAL', 'RESTANTE'];
        products.forEach(item => {
            Object.entries(item).forEach(([key, value]) => {
                if (key === 'separator' && value) {
                    div.append(card);
                    div.append($('<hr>', { class: 'mx-2 border-black' }));
                    card = $('<div>', { class: 'flex grid grid-cols-2 text-xs gap-2 p-3 uppercase' });
                } else if (key !== 'separator') {
                    if (key === 'row' && typeof value === 'object' && value !== null) {
                        Object.entries(value).forEach(([subKey, subValue]) => {
                            const box = $('<div>').append(
                                $('<div>', { class: 'font-bold uppercase py-2', html: `${subKey}: ` }),
                                $('<div>', { html: `${subValue || ''}` })
                            );
                            card.append(box);
                        });
                    } else {
                        const isPrice = priceKeys.includes(key);
                        const valueClass = isPrice ? 'ms-12' : '';
                        const box = $('<div>').append(
                            $('<div>', { class: 'font-bold uppercase', html: `${key}: ` }),
                            $('<div>', { class: valueClass, html: `${value || ''}` })
                        );
                        card.append(box);
                    }
                }
            });
        });

        // products.forEach(item => {
        //     Object.entries(item).forEach(([key, value]) => {
        //         if (key === 'separator' && value) {
        //             div.append(card);
        //             div.append($('<hr>', { class: 'mx-2 border-black' }));
        //             card = $('<div>', { class: 'flex grid grid-cols-2 text-xs gap-2 p-3 uppercase' });
        //         } else if (key !== 'separator') {
        //             if (key === 'row' && typeof value === 'object' && value !== null) {
        //                 Object.entries(value).forEach(([subKey, subValue]) => {
        //                     const box = $('<div>').append(
        //                         $('<div>', { class: 'font-bold uppercase', html: `${subKey}: ` }),
        //                         $('<div>', { html: `${subValue || ''}` })
        //                     );
        //                     card.append(box);
        //                 });
        //             } else {
        //                 const isPrice = priceKeys.includes(key);
        //                 const valueClass = isPrice ? 'ms-12' : '';
        //                 const box = $('<div>').append(
        //                     $('<div>', { class: 'font-bold uppercase', html: `${key}: ` }),
        //                     $('<div>', { class: valueClass, html: `${value || ''}` })
        //                 );
        //                 card.append(box);
        //             }
        //         }
        //     });
        // });

        div.append(card);
        div.append(this.createNote());
        $('#' + opts.parent).append(div);
    }

    createNote() {

        return `
            <div class="p-6 mt-2 ">
            <h1 class="text-center text-xs font-bold mb-4">
                Al realizar el pedido en la panadería y pastelería La Fogaza, usted acepta las siguientes condiciones:
            </h1>

            <h2 class="text-xs font-semibold ">Recomendaciones de refrigeración:</h2>
            <ul class="list-none text-xs space-y-2 mb-6">
            <li class="flex items-start">
             -
            <span>El pastel puede permanecer sin refrigeración por un máximo de 20 minutos, posteriormente debe refrigerarse para asegurar su frescura y calidad.</span>
            </li>

            <li class="flex items-start">
             -
            <span>Evite exponer el pastel a cambios bruscos de temperatura para preservar su textura y sabor.</span>
            </li>
            </ul>

            <p class="text-xs text-center font-bold  mb-2">
            La Fogaza no se hace responsable por los daños o deterioros del pastel una vez entregado,
            especialmente si no se siguen las recomendaciones anteriores.
            </p>

            <h2 class="text-xs font-semibold mb-2">Devolución de bases de pastel:</h2>
            <ul class="list-none text-xs space-y-2">
            <li class="flex items-start">
            <i class="icon-check"> - </i>
            <span>El cliente debe devolver las bases en buen estado, sin daños ni manchas. En caso contrario, el depósito no será reembolsado y podrán aplicarse cargos adicionales.</span>
            </li>
            </ul>

            <div class="text-center mt-2">
            <p class="font-semibold">Firma del cliente</p>
            <div class="border-t border-black w-1/2 mx-auto mt-2"></div>
            </div>
            </div>

             <div class="text-center mb-6 mt-2">
               <p class="font-semibold text-xs">Este ticket no es un comprobante fiscal.</p>
             </div>

             <div class="text-center mb-6 ">
               <p class="font-semibold text-xs ">Consulta nuestras politicas de privacidad en:</p>
               <a href="https://www.panaderiafogaza.com/politics" class="font-semibold text-xs text-info">www.panaderiafogaza.com/politics</a>
             </div>



        `;

    }

    // Components coffeeSoft.
    createdTable(options) {

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
            defaults.color_group = "bg-[#D0E3FF] ";
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
            const colorBg = opts.striped && i % 2 === 0 ? opts.color_row_alt : opts.color_row;
            const tr = $("<tr>", {
                class: ``,
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

            const actions = $("<td>", { class: `px-2 py-2 flex justify-center items-center ${colorBg} ${opts.border_row}` });

            if (data.a?.length) {
                data.a.forEach(atributos => {

                    const button_a = $("<a>", atributos);
                    actions.append(button_a);
                });
                tr.append(actions);
            }

            if (data.dropdown) {
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

// Operations.
function setTelefono() {
    let telefono = $('#id_colaborador').val()

    if (telefono != 0) {
        $('#wp').val(telefono)
    } else {
        $('#wp').val('');

    }

}

function formatSpanish(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-MX', opciones);
}

function convertPDF(options) {

    let defaults = {
        divElement: 'containerTicketPedidos',
        nameFile: 'captura',
        linkServer: '',
        download: false
    };

    let opts = Object.assign(defaults, options);

    const apiUrl = "https://www.erp-varoch.com/erp_files/pedidos/formato";

    // Verificar si el elemento existe
    const element = document.getElementById(opts.divElement);
    if (!element) {
        console.error("Error: El elemento div no existe.");
        return;
    }
    // Usar html2canvas para capturar el elemento
    html2canvas(element, { scale: 1 }).then(canvas => {
        // Convertir el lienzo a un archivo de imagen
        const imgData = canvas.toDataURL("image/png");

        // Crear un enlace para descargar la imagen
        if (opts.download === true) {

            const link = document.createElement("a");
            link.href = imgData;
            link.download = opts.nameFile + ".png"; // Nombre del archivo descargado
            link.click();

        } else { // guardar en server.





            let base = {
                opc: "setMessageUser",
                id: idFolio,
                img: imgData // Añadir la imagen en formato Base64
            };

            $.ajax({
                type: "POST",
                url: ctrl_list,
                data: base,
                success: function (respuesta) {
                    respuesta = parseInt(respuesta);
                    if (respuesta > 0) {
                        alert("Imagen creada con exito!");
                    } else {
                        alert("No se pudo crear la imagen :(");
                    }
                }
            });



            // $.ajax({
            //     url: "https://api.ultramsg.com/instance50238/messages/chat",
            //     type: 'POST',
            //     data: {
            //         token: "pjsvyuxnqx2rj4ed",
            //         to: '9621501886',
            //         image: imgData,
            //         body: 'Aquí tienes la imagen',  // Opcional: texto de la imagen
            //     },
            //     success: function (response) {
            //         console.log('Imagen enviada exitosamente:', response);
            //     },
            //     error: function (xhr, status, error) {
            //         console.log('Error al enviar la imagen:', error);
            //     }
            // });

        }



    }).catch(error => {
        console.error("Error al capturar el div:", error);
    });


}
