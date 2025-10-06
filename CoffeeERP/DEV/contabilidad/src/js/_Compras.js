class Compras extends Contabilidad {
    constructor(ctrl) {
        super(ctrl);
    }
    async buys() {
        await this.changeDate();
        this.Dates.off("change").on("change", () => this.changeDate());
    }
    async changeDate() {
        await this.fechasPermitidas(2);
        await this.createFilterBuy();
        await this.tbBuys();
        $("#filterBuy")
            .off("change")
            .on("change", () => this.tbBuys());
    }
    async createFilterBuy() {
        const filtro = [
            { id: 0, valor: "Todas las compras" },
            { id: 3, valor: "Fondo" },
            { id: 1, valor: "Corporativo" },
            { id: 2, valor: "Proveedor" },
            { id: 4, valor: "Almacén" },
            { id: 5, valor: "Costo" },
        ];

        let btnNewBuy = [];
        let btnBill = [];

        if (this.apertura.open) {
            btnBill = [
                { lbl: "", elemento: "input", multiple: true, type: "file", id: "iptFileBuy", div: { class: "hide" } },
                { lbl: "Subir archivos", elemento: "button", class: "btn btn-success col-12", onclick: "newBuyFile()" },
            ];
            btnNewBuy = [{ lbl: "Nueva compra", elemento: "button", onclick: "newBuy()" }];
        }

        let elementos = [
            ...btnBill,
            ...btnNewBuy,
            { lbl: "Total del día", id: "totalBuy", elemento: "input-group", tipo: "cifra", disabled: true },
            { lbl: "Filtrar por:", id: "filterBuy", elemento: "select", option: { data: filtro } },
        ];

        this.Container.html("").create_elements(elementos);
    }
    async newBuyFile() {
        $("#iptFileBuy").click();

        $("#iptFileBuy")
            .off("change")
            .on("change", async () => {
                const archivo = $("#iptFileBuy")[0];

                if (archivo.files && archivo.files.length > 0) {
                    let datos = new FormData();
                    datos.append("opc", "fileBuy");
                    datos.append("id_UDN", $("#cbUDN").val());
                    datos.append("Fecha_Compras", $("#cbDate").val());
                    for (var i = 0; i < archivo.files.length; i++) {
                        datos.append("archivos[]", archivo.files[i]);
                    }
                    send_ajax(datos, this._ctrl, "Espere un momento se están subiendo los archivos.").then((data) => {
                        $("#iptFileBuy").val("");

                        let divFiles = $("<div>");
                        divFiles.html("").create_table(this.tableEstructureFiles(data));

                        bootbox
                            .dialog({
                                title: "ARCHIVOS",
                                message: divFiles,
                                closeButton: true,
                                size: "large",
                            })
                            .on("shown.bs.modal", function () {
                                $(".cbFacturas").option_select({ placeholder: "-SELECCIONAR-", data: data.bills, select2: true });
                            });
                    });
                }
            });
    }
    tableEstructureFiles(data) {
        const thead = "#,Archivo,Comprobante,Guardar";
        let tbody = [];

        let select = $("<select>", {
            class: "form-select cbFacturas",
            multiple: true,
        });

        let button = $("<button>", { class: "btn btn-sm btn-primary", html: '<i class="icon-floppy"></i>' });

        data.files.forEach((td) => {
            select.attr("id", "slFile" + td.id);
            button.attr("onclick", "fileBill(" + td.id + ");");

            let icon = parseInt(td.id) == 0 ? '<i class="icon-cancel text-danger"></i>' : '<i class="icon-ok text-success"></i>';
            let cbSelect = parseInt(td.id) == 0 ? "<span>Pesa más de 20 Mb</span>" : select.prop("outerHTML");

            let tr = [
                { class: "text-center", html: icon },
                { class: "", html: this.strCapitalice(td.file) },
                { class: "text-center ", html: cbSelect },
                { class: "text-center ", html: button.prop("outerHTML") },
            ];
            tbody.push(tr);
        });

        return {
            table: { id: "tbFile" },
            thead,
            tbody,
        };
    }
    fileBill(idSobre) {
        let datos = new FormData();
        datos.append("opc", "fileBill");
        datos.append("id_F", $("#slFile" + idSobre).val());
        datos.append("idSobre", idSobre);
        send_ajax(datos, this._ctrl).then((data) => {
            if (data === true) {
                $("#slFile" + idSobre)
                    .parent()
                    .html('<span><i class="text-success icon-ok"></i> Facturas relacionadas</span>');
            } else console.error(data);
        });
    }
    async formCompras() {
        const container = [
            { class: "row m-0", id: "buy1" },
            { class: "row m-0", id: "ciDescription" },
            { class: "row m-0", id: "buy2" },
            { class: "row m-0", id: "buy3" },
        ];
        const $form = this.createForm();
        await this.createContent($form, container);
        const elements = await this.formElements();
        await this.mergeFormDivs($form, elements);
        return $form;
    }
    async formElements() {
        this.lsInit = await this.fnDateUDN("lsCompras");
        let div = { div: { class: "col-12 col-md-6 col-lg-4 mb-3" } };
        let atrSelect = { elemento: "select", class: "text-uppercase", ...div };

        let fondo = !this.apertura.reembolso || getCookies().IDP <= 5 ? [{ id: 3, valor: "Fondo" }] : [];
        const tipoCompra = [{ id: 1, valor: "Corporativo" }, { id: 2, valor: "Crédito" }, ...fondo];

        const tipoPago = await fn_ajax({ opc: "lsTPago" }, this._ctrl);

        const elements = [
            {
                container: "buy1",
                elements: [
                    {
                        lbl: "Proveedor",
                        required: true,
                        name: "id_UP",
                        id: "modalProveedor",
                        option: { data: this.lsInit.proveedores, placeholder: "- SELECCIONAR -" },
                        ...atrSelect,
                        div: { class: "col-12 col-lg-4 mb-3" },
                    },
                    { lbl: "Clase de insumo", required: true, name: "id_UI", id: "modalCInsumo", option: { data: this.lsInit.cInsumos, placeholder: "- SELECCIONAR -" }, ...atrSelect },
                    { lbl: "Insumo", name: "id_UG", id: "modalInsumo", elemento: "select", disabled: true, ...atrSelect },
                ],
            },
            {
                container: "buy2",
                elements: [
                    { lbl: "Salida de compra", name: "id_CG", id: "modalTCompra", required: true, option: { data: tipoCompra, placeholder: "- SELECCIONAR -" }, ...atrSelect },
                    {
                        lbl: "Tipo de pago",
                        name: "id_TP",
                        id: "modalTPago",
                        disabled: true,
                        option: { data: tipoPago, placeholder: "- SELECCIONAR -" },
                        ...atrSelect,
                    },
                    {
                        lbl: "No. Factura o nota",
                        name: "id_F",
                        id: "modalFactura",
                        option: { data: this.lsInit.facturas, placeholder: "- FACTURA -" },
                        ...atrSelect,
                        div: { class: "col-12 col-lg-4 mb-3" },
                    },
                    { lbl: "Subtotal", name: "Gasto", elemento: "input-group", tipo: "cifra", required: true, ...div },
                    { lbl: "Impuesto", name: "GastoIVA", elemento: "input-group", tipo: "cifra", ...div },
                    { lbl: "Comprobante", elemento: "input", type: "file", div: { class: "col-12 col-lg-4 mb-3 hide" } },
                ],
            },
            {
                container: "buy3",
                elements: [{ lbl: "Observaciones", name: "Observacion", elemento: "textarea", div: { class: "col-12 mb-3" } }, { elemento: "modal_button" }],
            },
        ];

        return elements;
    }
    async tbBuys() {
        this.jsTable = await this.fnDateUDN({ opc: "tbCompras", filtro: $("#filterBuy").val() }, this.tbContainer);
        this.tbContainer.html("").create_table(this.tableEstructure());
        this.table.table_format({ order: [[0, "desc"]], priority: "7,5,6,0" });
    }
    tableEstructure() {
        this.table = "#tbCompras";
        const thead = "Folio,Proveedor,Clase Insumo,Insumo,Factura,Total,T. Compra,T. Pago,OPCIONES";
        let tbody = [];
        let granTotal = 0;

        this.jsTable.forEach((td) => {
            const subtotal = isNaN(parseFloat(td.subtotal)) ? 0 : parseFloat(td.subtotal);
            const impuesto = isNaN(parseFloat(td.impuesto)) ? 0 : parseFloat(td.impuesto);
            const total = parseFloat(subtotal + impuesto);
            granTotal += total;

            let btnExtra = [];

            const assignButtons = (td.idCG != 3 && td.idCG != 4) || (td.idCG == 3 && !this.apertura.reembolso);

            if (assignButtons && getCookies().IDE != 8) {
                btnExtra = [
                    { icon: "icon-pencil", text: "Editar", fn: `editBuy(${td.folio})` },
                    { icon: "icon-trash", text: "Eliminar", fn: `deleteBuy(${td.folio})` },
                ];
            }

            let btnFile = [];
            if (td.ruta) {
                let rutaFile = "https://www.erp-varoch.com/" + td.ruta + td.archivo;
                if (td.ruta.split("/")[0] == "recursos") rutaFile = "https://www.erp-varoch.com/ERP/" + td.ruta + td.archivo;

                btnFile = [{ icon: "icon-file-pdf", text: "Comprobante", href: rutaFile, target: "_blank" }];
            }

            const buttons = this.dropdown([{ icon: "icon-i-cursor", text: "Observaciones", fn: `viewObsBuy(${td.folio})` }, ...btnFile, ...btnExtra]);

            let factura = td.factura == null ? "-" : td.factura;

            let tr = [
                { class: " text-center", html: "#" + td.folio },
                { class: "", html: this.strCapitalice(td.proveedor) },
                { class: "", html: this.strCapitalice(td.cinsumo) },
                { class: "", html: this.strCapitalice(td.insumo) },
                { class: "text-center", html: factura },
                { class: "text-end", html: this.format_number(total), title: "Subtotal: " + this.format_number(subtotal) + " / Impuesto: " + this.format_number(impuesto) },
                { class: "", html: this.strCapitalice(td.tCompra) },
                { class: "", html: this.strCapitalice(td.tPago) },
                { class: "text-center", html: buttons },
            ];
            tbody.push(tr);
        });

        $("#totalBuy").val(this.number_format(granTotal, 2, ".", ","));

        return {
            table: { id: "tbCompras" },
            thead,
            tbody,
        };
    }
    exist_bill(idF) {
        let exist_bill = false;
        if (idF != "" && this.lsInit.facturas != null) exist_bill = this.lsInit.facturas.some((e) => e.id == idF);

        return exist_bill;
    }
    async newBuy() {
        const form = await this.formCompras();

        this.createModal({ title: "NUEVA COMPRA", form, size: "extra-large" }).then(() => {
            $("#modalCInsumo").option_select({ select2: true, father: true });
            $("#modalFactura").option_select({ select2: true, father: true, tags: true });
            $("#modalProveedor").option_select({ select2: true, father: true });
            $("#modalProveedor").on("change", () => $("#modalCInsumo").prop({ required: false }));
            $("#modalCInsumo").on("change", () => {
                $("#modalProveedor").prop({ required: false });
                $("#ciDescription").html("");
                let descripcion = this.lsInit.cInsumos.filter((ci) => ci.id == $("#modalCInsumo").val())[0].descripcion;
                $("#ciDescription").children().remove();
                if (descripcion != null)
                    $("#ciDescription")
                        .html("")
                        .append($("<div>", { class: "col-12 mb-3 text-muted", html: `<i class="icon-pinboard"></i> <i>${descripcion}</i>` }));

                let insumos = this.lsInit.insumos.filter((i) => i.id_UI == $("#modalCInsumo").val());
                $("#modalInsumo").option_select({ data: insumos, placeholder: "- SELECCIONAR -", select2: true, father: true });

                const cInsumo = $("#modalCInsumo option:selected").text().toUpperCase();
                if (cInsumo.includes("MANTENIMIENTO")) {
                    $("#comprobante").parent().removeClass("hide");
                    // $("#comprobante").prop("required", true);
                } else {
                    $("#comprobante").parent().addClass("hide");
                    $("#comprobante").prop("required", false);
                }

                if (insumos.length) $("#modalInsumo").prop("disabled", false);
                else $("#modalInsumo").prop("disabled", true);
            });

            $("#modalTCompra").on("change", () => {
                if ($("#modalTCompra").val() == 1) $("#modalTPago").prop({ disabled: false });
                else $("#modalTPago").prop({ disabled: true, selectedIndex: 0, required: false });
            });

            let exist_bill = false;
            $("#modalFactura").on("change", () => {
                exist_bill = false;
                if ($("#modalFactura").val() != "" && $("#modalFactura").val() != "null" && $("#modalFactura").val() != "0") exist_bill = this.exist_bill($("#modalFactura").val());
            });

            form.validation_form({ opc: "putBuy", id_UDN: this.UDN.val(), Fecha_Compras: this.Dates.val() }, (datos) => {
                datos.append("exist_bill", exist_bill);
                if (datos.get("id_F") == "") datos.delete("id_F");
                if (datos.get("GastoIVA") == "") datos.append("GastoIVA", "0");
                if (datos.get("id_UP") == "" || datos.get("id_UP") == "0") datos.delete("id_UP");
                if (datos.get("id_CG") == "" || datos.get("id_CG") == "0") datos.delete("id_CG");
                if (datos.get("id_UI") == "" || datos.get("id_UI") == "0") datos.delete("id_UI");
                if (datos.get("Observacion") == "" || datos.get("Observacion") == "0") datos.delete("Observacion");

                const before = !$("#comprobante").val() ? undefined : "<i class='icon-spin6 animate-spin'></i> Espere un momento estamos subiendo el archivo.";
                send_ajax(datos, this._ctrl, before).then(async (data) => {
                    if (data === true) {
                        alert();
                        saldos();
                        this.tbBuys();
                        $(".modal-body").find("form")[0].reset();
                        bootbox.hideAll();

                        this.lsInit = await this.fnDateUDN("lsCompras");
                        $("#modalFactura").option_select({ data: this.lsInit.facturas, select2: true, father: true, tags: true });
                    } else {
                        console.error(data);
                    }
                });
            });
        });
    }
    viewObsBuy(folio) {
        const obs = this.jsTable.filter((tr) => tr.folio == folio)[0].obs;
        const text = obs ?? obs != "" ? obs : '<i class="text-muted">No hay observaciones</i>';
        this.createModal({ title: "Observaciones", form: text, close: true });
    }
    async editBuy(folio) {
        const form = await this.formCompras();
        this.createModal({ title: "EDITAR COMPRA #" + folio, form, size: "extra-large" }).then(() => {
            let compra = this.jsTable.filter((tr) => tr.folio == folio)[0];
            
            $("#modalFactura").val(compra.idF);
            $("#modalFactura").option_select({ select2: true, father: true, tags: true });
            $("#modalProveedor").on("change", () => $("#modalCInsumo").prop({ required: false }));

            $("#modalCInsumo").on("change", () => {
                $("#modalProveedor").prop({ required: false });
                let insumos = this.lsInit.insumos.filter((ci) => ci.id_UI == $("#modalCInsumo").val());
                $("#modalInsumo").option_select({ data: insumos, placeholder: "- SELECCIONAR -", select2: true, father: true });
                if (compra.idUG != null) $("#modalInsumo").val(compra.idUG).change();

                if (insumos.length) $("#modalInsumo").prop({ disabled: false, required: true });
                else $("#modalInsumo").prop({ disabled: true, required: false, selectedIndex: 0 });
            });

            $("#modalTCompra").on("change", () => {
                if ($("#modalTCompra").val() == 1) $("#modalTPago").prop("disabled", false);
                else $("#modalTPago").prop({ disabled: true, selectedIndex: 0 });
            });

            let exist_bill = false;
            $("#modalFactura").on("change", () => {
                if ($("#modalFactura").val() != "" && $("#modalFactura").val() != "null" && $("#modalFactura").val() != "0") {
                    exist_bill = this.exist_bill($("#modalFactura").val());
                }
            });

            if (compra.idUP != null) $("#modalProveedor").val(compra.idUP).change();
            if (compra.idUI != null) $("#modalCInsumo").val(compra.idUI).trigger("change");
            if (compra.idCG != null) $("#modalTCompra").val(compra.idCG).trigger("change");
            if (compra.idTP != null) $("#modalTPago").val(compra.idTP).trigger("change");
            if (compra.idCG != null) $("#modalFactura").val(compra.idF).trigger("change");
            if (compra.subtotal != null) $("#subtotal").val(compra.subtotal);
            if (compra.impuesto != null) $("#impuesto").val(compra.impuesto);
            if (compra.obs != null) $("#observaciones").val(compra.obs);

            form.validation_form({ opc: "putBuy", id_UDN: this.UDN.val(), Fecha_Compras: this.Dates.val(), idCompras: folio }, (datos) => {
                datos.append("exist_bill", exist_bill);
                if (datos.get("id_F") == "") datos.delete("id_F");
                send_ajax(datos, this._ctrl).then(async (data) => {
                    if (data === true) {
                        alert();
                        saldos();
                        this.tbBuys();
                        $(".bootbox-close-button").click();
                    } else {
                        console.error(data);
                    }
                });
            });
        });
    }
    async deleteBuy(folio) {
        this.remove({
            data: { opc: "deleteBuy", folio },
            method: (data) => {
                if (data === true) {
                    this.deleteRow("#" + folio);
                    saldos();
                    alert();
                } else console.error(error);
            },
        });
    }
    // DATOS DE CONSULTA DE COMPRAS
    async initConsultBuy() {
        await this.filterConsultBuy();
        await this.tbConsultBuy();
    }
    async filterConsultBuy() {
        const lsFormasPago = await fn_ajax({ opc: "lsTPago" }, this._ctrl);

        const elements = [
            {
                lbl: "Tipo de compras",
                id: "cbCompras",
                elemento: "select",
                div: { class: "mb-2 col-12 col-md-4 col-lg-2" },
                option: {
                    data: [
                        { id: 3, valor: "Fondo fijo" },
                        { id: 1, valor: "Corporativo" },
                        { id: 2, valor: "Crédito" },
                        { id: 4, valor: "Ventas" },
                        { id: 5, valor: "Todas las compras" },
                    ],
                },
            },
            {
                lbl: "Formas de pago",
                id: "cbFormasPago",
                div: { class: "mb-2 col-12 col-md-4 col-lg-2 d-none" },
                elemento: "select",
                option: { data: lsFormasPago },
            },
            {
                lbl: "Filtro de consulta",
                id: "cbComprasFiltro",
                elemento: "select",
                div: { class: "mb-2 col-12 col-md-4 col-lg-2" },
                option: {
                    data: [
                        { id: 1, valor: "Totales" },
                        { id: 2, valor: "Detallado" },
                    ],
                },
            },
        ];
        this.Container.html("").create_elements(elements);
        
        $("#cbCompras, #cbComprasFiltro, #cbFormasPago").on("change", async () => {
            if ($("#cbCompras").val() == "5") $("#cbComprasFiltro").parent().addClass("hide");
            else if ($("#cbCompras").val() == "1") $("#cbFormasPago").parent().removeClass("d-none");
            else {
                $("#cbComprasFiltro").parent().removeClass("hide");
                $("#cbFormasPago").prop('selectedIndex', 0).parent().addClass("d-none");
            }
            await this.tbConsultBuy();
        });
    }
    async tbConsultBuy() {
        this.lsInit = await this.fnDateUDN(
            {
                opc: "tbConsultBuy",
                tCompra: $("#cbCompras").val(),
                fPago: $('#cbFormasPago').val(),
                filtro: $("#cbComprasFiltro").val(),
            },
            this.tbContainer
        );

        this.tbContainer.html("").create_table(this.structure_ConsultBuy());
        // $("#tbConsultBuy").tb_fixed(2);

        tableFixedExport("tbConsultBuy", "Consultas de compras");
    }
    structure_ConsultBuy() {
        const icon = $("#cbCompras").val() == "5" ? "" : "<i class='icon-right-dir'></i>";
        const iconHand = "<i class='icon-right-dir'></i>";
        let tbody = [];
        let btnDetalles = $("<button>", { class: "btn btn-sm", html: '<i class="icon-doc-text-2 text-info"></i>' });
        if (this.lsInit.list.length > 0) {
            let hrHTML = [];
            this.lsInit.list.forEach((tr) => {
                // const total = $("#cbCompras").val() == "5" ? tr.subtotal : parseFloat(tr.subtotal) + parseFloat(tr.impuesto);
                const total = parseFloat(tr.subtotal) + parseFloat(tr.impuesto);
                hrHTML = [];
                let totalHTML = [];
                let subtotalHTML = [];
                let impuestoHTML = [];

                tr.totalDate.forEach((d, i) => {
                    btnDetalles.attr("onclick", "viewDetails(" + tr.id + ",'" + this.lsInit.dates[i] + "')");
                    const total = d == "-" ? d : d + btnDetalles.prop("outerHTML");
                    totalHTML.push({ html: total, class: "fw-bold text-end" });
                });

                if ($("#cbCompras").val() == "5") {
                    totalHTML = [];
                    tr.totalDate.forEach((d) => totalHTML.push({ html: d, class: "fw-bold text-end" }));
                }

                tr.subtotalDate.forEach((d) => subtotalHTML.push({ html: d, class: "text-end" }));
                tr.impuestosDate.forEach((d) => impuestoHTML.push({ html: d, class: "text-end" }));
                tr.subtotalDate.forEach((d) => hrHTML.push({ html: "" }));

                tbody.push([
                    { html: icon + tr.valor, class: "fw-bold pointer", onclick: "hideData('ugbuy" + tr.id + "'); showData('buy" + tr.id + "');" },
                    { html: this.format_number(total), class: "fw-bold text-end" },
                    ...totalHTML,
                ]);

                if ($("#cbComprasFiltro").val() != 2 || tr.gastos.length == 0) {
                    tbody.push(
                        [{ tr: { class: "hide buy" + tr.id } }, { html: tr.name + " / Subtotal", class: "fst-italic" }, { html: this.format_number(tr.subtotal), class: "text-end" }, ...subtotalHTML],
                        [{ tr: { class: "hide buy" + tr.id } }, { html: tr.name + " / Impuesto", class: "fst-italic" }, { html: this.format_number(tr.impuesto), class: "text-end" }, ...impuestoHTML],
                        [{ tr: { class: "hide buy" + tr.id + " bg-disabled4" } }, { html: "" }, { html: "" }, ...hrHTML]
                    );
                } else {
                    tr.gastos.forEach((tr2) => {
                        hrHTML = [];
                        totalHTML = [];
                        subtotalHTML = [];
                        impuestoHTML = [];
                        tr2.totalDate.forEach((d) => totalHTML.push({ html: d, class: "fw-bold text-end" }));
                        tr2.subtotalDate.forEach((d) => subtotalHTML.push({ html: d, class: "text-end" }));
                        tr2.impuestosDate.forEach((d) => impuestoHTML.push({ html: d, class: "text-end" }));
                        tr2.subtotalDate.forEach((d) => hrHTML.push({ html: "" }));

                        tbody.push(
                            [
                                { tr: { class: "hide buy" + tr.id } },
                                { html: iconHand + tr2.valor, class: "fst-italic pointer", onclick: "showData('ug" + tr2.id + "')" },
                                { html: this.format_number(tr2.total), class: "text-end" },
                                ...totalHTML,
                            ],
                            [
                                { tr: { class: "hide ugbuy" + tr.id + " ug" + tr2.id } },
                                { html: tr2.name + " / Subtotal", class: "fst-italic" },
                                { html: this.format_number(tr2.subtotal), class: "text-end" },
                                ...subtotalHTML,
                            ],
                            [
                                { tr: { class: "hide ugbuy" + tr.id + " ug" + tr2.id } },
                                { html: tr2.name + " / Impuesto", class: "fst-italic" },
                                { html: this.format_number(tr2.impuesto), class: "text-end" },
                                ...impuestoHTML,
                            ],
                            [{ tr: { class: "hide ugbuy" + tr.id + " ug" + tr2.id + " bg-disabled4" } }, { html: "" }, { html: "" }, ...hrHTML]
                        );
                    });
                }
            });

            hrHTML = [];
            let granTotalHTML = [];
            this.lsInit.totalDate.forEach((d) => granTotalHTML.push({ html: d, class: "fw-bold text-end" }));
            this.lsInit.thDates.forEach((d) => hrHTML.push({ html: "" }));
            tbody.push(
                [{ tr: { class: "bg-disabled4" } }, { html: "" }, { html: "" }, ...hrHTML],
                [{ html: "TOTAL", class: "fw-bold" }, { html: this.lsInit.total, class: "fw-bold text-end" }, ...granTotalHTML]
            );
        }

        return {
            table: { id: "tbConsultBuy" },
            thead: "COMPRA,TOTAL," + this.lsInit.thDates,
            tbody,
        };
    }
    async viewDetails(id, fecha) {
        const data = await fn_ajax({ opc: "lsDetails", tCompra: $("#cbCompras").val(), id, fecha }, this._ctrl);
        const div = $("<div>", { class: "col-12" });
        div.create_table(this.structureTbDetails(data.ls));
        this.createModal({ title: fecha + " / " + data.clase, form: div, size: "xl", close: true });
    }
    structureTbDetails(data) {
        let tbody = [];
        data.forEach((tr) => {
            tbody.push([{ html: tr.folio, class: "text-center" }, { html: tr.insumo }, { html: tr.subtotal, class: "text-end" }, { html: tr.impuesto, class: "text-end" }, { html: tr.obs }]);
        });

        return { thead: "Folio,Insumo,Subtotal,Impuesto,Observaciones", tbody };
    }
}
