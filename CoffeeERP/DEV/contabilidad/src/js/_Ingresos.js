class Ingresos extends Contabilidad {
    #_teso;
    constructor(ctrl) {
        super(ctrl);
    }
    async incomes() {
        await this.changeDate();
        this.Dates.off("change").on("change", () => this.changeDate());
    }
    async changeDate() {
        sessionStorage.setItem("fecha", this.Dates.val());
        await this.fechasPermitidas(1);
        await this.formIncome();
    }
    summation(clase) {
        let total = 0;
        $(clase).each(function () {
            if (clase != ".caja_moneda") total += !$(this).val() ? 0 : parseFloat($(this).val().replace(",", ""));
            else total += !$(this).val() ? 0 : parseFloat($(this).val().replace(",", "")) * parseFloat($(this).attr("mxn"));
        });
        return total;
    }
    async formIncome() {
        const content = [
            { class: "col-12", id: "contentIngVentas" },
            { class: "col-12 border-top", id: "contentIngCaja" },
            { class: "col-12 border-top border-bottom", id: "contentIngClientes" },
            { class: "col-12 d-flex justify-content-center", id: "contentIngSubmit" },
        ];
        const $form = await this.createForm();
        await this.createContent($form, content);
        this.Container.html("").append($form);
        await this.showSales();
        $("#contentIngCaja")
            .html("")
            .create_elements([{ elemento: "h", tipo: "5", class: "pt-2 text-center fw-bold text-muted pointer", onclick: "showBox()", html: '<i class="icon-box"></i> CAJA <i class="icon-down-dir"></i>' }]);
        $("#contentIngClientes")
            .html("")
            .create_elements([{ elemento: "h", tipo: "5", class: "pt-2 text-center fw-bold text-muted pointer", onclick: "showBox()", html: '<i class="icon-users"></i> CLIENTES <i class="icon-down-dir"></i>' }]);

        if (!this.apertura.retiro && this.apertura.open && getCookies().IDE != 8)
            $("#contentIngSubmit")
                .html("")
                .create_elements([{ lbl: "Guardar movimientos", elemento: "button", id: "btnSaveSales", onclick: "saveIncome();" }]);

        $("#contentIngVentas")
            .off("keyup")
            .on("keyup", "input", () => this.calcSales());
        $("#contentIngCaja")
            .off("keyup")
            .on("keyup", "input", () => this.calcBox());
    }
    // INFORMACION DE VENTAS
    async showSales() {
        $("#contentIngVentas").children().length > 1 ? $(".divSales").toggleClass("hide") : await this.sales();
        $("#contentIngVentas").validar_contenedor();
    }
    async sales() {
        const containers = [
            { class: "row pt-1 border-top text-start", id: "ingTitle" },
            { class: "row pt-1 divSales border-top text-start", id: "ingSinImpuesto" },
            { class: "row pt-1 divSales border-top text-start", id: "ingVentas" },
            { class: "row pt-1 divSales border-top text-start", id: "ingDescuentos" },
            { class: "row pt-1 divSales border-top text-start", id: "ingImpuestos" },
            { class: "row pt-1 divSales border-top text-start", id: "ingTotales" },
        ];
        this.createContent($("#contentIngVentas"), containers);
        this.mergeFormDivs($("#contentIngVentas"), await this.dataSales());
        await this.calcSales();
    }
    async uploadBitacoraCCTV() {
        const data = await fn_ajax({ opc: "dataCCTV", date: this.Dates.val() }, this._ctrl);
        if (!data || data.suite == 0) alert({ icon: "info", title: "No hay suites registradas en turnos." });
        else {
            if (data.file) {
                this.createModal2({
                    close: true,
                    title: "Se regitraron " + data.suite + " suites en total",
                    form: '<a href="' + data.file + '" class="btn btn-success col-12" target="_blank" >Ver archivo</a><button class="btn btn-info col-12 mt-3" onclick="fileCCTV()">Actualizar</button>',
                });
            } else this.fileCCTV();
        }
    }
    async fileCCTV() {
        $("#filecctv")
            .click()
            .off("change")
            .on("change", async () => {
                const file = $("#filecctv")[0].files[0];
                if (file) {
                    const result = await alert({ icon: "question", title: '¿Estas seguro de subir el archivo "' + file.name + '"?' });

                    if (result.isConfirmed) {
                        let datos = new FormData();
                        datos.append("opc", "cctvFile");
                        datos.append("file", file);
                        datos.append("date", this.Dates.val());
                        datos.append("idE", this.UDN.val());

                        const data = await send_ajax(datos, "../kpi/ctrl/ctrl-cctv.php");
                        if (data === true) alert();
                        else console.error(data);
                    }
                }
            });
    }
    async dataSales() {
        const data = await this.fnDateUDN("datosVentas");
        const gbIpt = { elemento: "input-group", tipo: "cifra", disabled: true };

        let btnSoft = [];
        let btnFiles = [];
        let btnCCTV = [];
        if (this.apertura.open) {
            btnSoft = [{ lbl: "SoftRestaurant", elemento: "button", class: "btn btn-soft col-12", onclick: "softRestaurant()" }];
            btnFiles = [
                { elemento: "input", type: "file", div: { class: "hide" }, id: "btnIncomeFile", onChange: "uploadFile()" },
                { lbl: "Archivo de ventas", elemento: "button", class: "btn btn-info col-12", onclick: "incomeFile()" },
            ];
        }

        if (!this.apertura.retiro && this.apertura.open && getCookies().IDE != 8) {
            if (getCookies()["IDE"] === "1") {
                btnCCTV = [
                    { lbl: "Bitacora CCTV", elemento: "button", class: "btn btn-success col-12", onclick: "uploadBitacoraCCTV()" },
                    { lbl: "fileCCTV", elemento: "input", type: "file", div: { class: "hide" } },
                ];
            }
        }

        return [
            {
                container: "ingTitle",
                elements: [
                    {
                        elemento: "h",
                        tipo: "5",
                        class: "pt-2 text-center fw-bold text-muted pointer",
                        onclick: "showSales()",
                        html: '<i class="icon-dollar"></i> VENTAS <i class="icon-down-dir"></i>',
                    },
                ],
            },
            {
                container: "ingSinImpuesto",
                elements: [{ lbl: "Ventas sin impuestos", ...gbIpt }, ...btnFiles, ...btnSoft, ...btnCCTV],
            },
            ...data,
            {
                container: "ingTotales",
                elements: [
                    { lbl: "Subtotal", ...this.iptCifra },
                    { lbl: "Total de impuestos", ...this.iptCifra },
                    { lbl: "Total de ventas", ...this.iptCifra },
                ],
            },
        ];
    }
    async calcSales() {
        const sales = this.summation(".iptVentas");
        const discounts = this.summation(".iptDescuentos");
        const taxes = this.summation(".iptImpuestos");
        const subtotal = sales - discounts;
        const total = subtotal + taxes;
        $("#ventassinimpuestos").val(this.number_format(sales, 2, ".", ","));
        $("#subtotal").val(this.number_format(subtotal, 2, ".", ","));
        $("#totaldeimpuestos").val(this.number_format(taxes, 2, ".", ","));
        $("#totaldeventas").val(this.number_format(total, 2, ".", ","));
    }
    // INFORMACION DE CAJA
    async showBox() {
        $("#contentIngCaja").children().length > 1 ? $(".divBox").toggleClass("hide") : await this.box();
        await this.showCustomers();
        this.calcBox();
        $("#contentIngCaja").validar_contenedor();
    }
    async box() {
        const containers = [
            { class: "row pt-1 divBox border-top text-start", id: "dataBox" },
            { class: "row pt-1 divBox border-top text-start", id: "totalBox" },
        ];

        this.createContent($("#contentIngCaja"), containers);
        await this.mergeFormDivs($("#contentIngCaja"), await this.dataBox());
    }
    async dataBox() {
        const data = await this.fnDateUDN("datosCaja");

        return [
            {
                container: "dataBox",
                elements: data,
            },
            {
                container: "totalBox",
                elements: [
                    { lbl: "Total de caja", ...this.iptCifra },
                    { lbl: "Diferencia", ...this.iptCifra },
                ],
            },
        ];
    }
    async calcBox() {
        const bancos = this.summation(".caja_bancos");
        const monedas = this.summation(".caja_moneda");
        const propina = !$("#propina").val() ? 0 : parseFloat($("#propina").val().replace(",", ""));
        const efectivo = !$("#efectivo").val() ? 0 : parseFloat($("#efectivo").val().replace(",", ""));
        const pagos = !$("#customerPagos").val() ? 0 : parseFloat($("#customerPagos").val().replace(",", ""));
        const deuda = !$("#customerDeudas").val() ? 0 : parseFloat($("#customerDeudas").val().replace(",", ""));
        const totalVenta = !$("#totaldeventas").val() ? 0 : parseFloat($("#totaldeventas").val().replace(",", ""));

        let destajo = 0;
        if ($("#destajo").length && $("#destajo").val()) destajo = parseFloat($("#destajo").val().replace(",", ""));

        let descuentoDestajo = 0;
        if ($("#descuentodestajo").length && $("#descuentodestajo").val()) descuentoDestajo = parseFloat($("#descuentodestajo").val().replace(",", ""));

        const totalCaja = efectivo - propina + destajo - descuentoDestajo + bancos + monedas;
        const diferencia = totalCaja - pagos + deuda - totalVenta;
        
        console.clear();
        console.table({
            efectivo,
            propina,
            destajo,
            descuentoDestajo,
            bancos,
            monedas,
            totalCaja,
            pagos,
            deuda,
            totalVenta,
            totalCaja,
            diferencia,
        });

        $("#totaldecaja").val(this.number_format(totalCaja, 2, ".", ","));
        $("#diferencia").val(this.number_format(diferencia, 2, ".", ","));
    }
    // INFORMACION DE CLIENTES
    async showCustomers() {
        $("#contentIngClientes").children().length > 1 ? $(".divCustomer").toggleClass("hide") : await this.customers();
    }
    async customers() {
        const balance = await this.fnDateUDN("payDebtUDN");
        const containers = [{ class: "row pt-1 divCustomer border-top text-start", id: "dataCustomer" }];

        let buttonModal = [];

        if (!this.apertura.retiro && this.apertura.open && getCookies().IDE != 8) buttonModal = [{ lbl: "[+] Pagos / Consumos", ...this.btnSave, div: { class: "col-12 col-md-4 col-lg-3" }, onclick: "payDebt()" }];

        const elements = [
            {
                container: "dataCustomer",
                elements: [{ lbl: "Pagos", id: "customerPagos", value: balance.pay, ...this.iptCifra }, { lbl: "Deudas", id: "customerDeudas", value: balance.debt, ...this.iptCifra }, ...buttonModal],
            },
        ];

        this.createContent($("#contentIngClientes"), containers);
        this.mergeFormDivs($("#contentIngClientes"), elements);
    }
    // GUARDAR INFORMACION DE INGRESOS
    getDataForm(selector, idAttr, dateAttr, iptClass = "") {
        const id_UDN = this.UDN.val();
        const fecha = this.Dates.val();
        if (($(selector).children().length > 1 && selector == "#dataBox") || selector != "#dataBox") {
            return $(selector)
                .find("input" + iptClass)
                .map(function () {
                    const val = $(this).val();
                    const mxn = iptClass == ".caja_moneda" ? { Valor: $(this).attr("mxn") } : {};
                    const udn = iptClass === ".caja_bancos" || iptClass === "" ? {} : { id_UDN };
                    const cant = iptClass !== ".caja_bancos" ? { Cantidad: val } : { Pago: val };

                    return val !== ""
                        ? {
                              ...cant,
                              ...mxn,
                              [idAttr]: $(this).attr(idAttr.replace("_", "")),
                              ...udn,
                              [dateAttr]: fecha,
                              id: $(this).attr(idAttr.replace("_", "")),
                          }
                        : [];
                })
                .get();
        }
    }
    saveIncome() {
        $("#btnSaveSales").toggleClass("btn-primary btn-success").html('<i class="animate-spin icon-spin6"></i> Guardando...').prop("disabled", true);

        const ventas = this.getDataForm("#ingVentas", "id_UV", "Fecha_Venta");
        const descuentos = this.getDataForm("#ingDescuentos", "id_UD", "Fecha_Desc");
        const impuestos = this.getDataForm("#ingImpuestos", "id_UI", "Fecha_Impuesto");
        const efectivo = this.getDataForm("#dataBox", "id_Efectivo", "Fecha_Efectivo", ".caja_efectivo");
        const monedas = this.getDataForm("#dataBox", "id_Moneda", "Fecha_Moneda", ".caja_moneda");
        const bancos = this.getDataForm("#dataBox", "id_UB", "Fecha_Banco", ".caja_bancos");

        this.fnDateUDN({ opc: "insIncome", ventas, descuentos, impuestos, efectivo, monedas, bancos }).then((data) => {
            if (Object.values(data).some((value) => value === true)) {
                $("#btnSaveSales").toggleClass("btn-primary btn-success").html("Guardar movimientos").prop("disabled", false);
                alert({ timer: 1500 });
            } else console.error(data);
        });
    }
    // CONSULTAS DE INGRESOS
    async tbIncomes() {
        this.lsInit = await this.fnDateUDN("tbVentas", this.tbContainer);
        this.tbContainer.html("").create_table(this.structuretbIncomes());
        // $("#tbIncome").tb_fixed(2);
        tableFixedExport("tbIncome", "Consultas de ingresos");
    }
    structuretbIncomes() {
        let tbody = [];
        const ventas = this.lsInit.ventas;
        const descuentos = this.lsInit.descuentos;
        const impuestos = this.lsInit.impuestos;
        const efectivo = this.lsInit.efectivo;
        const moneda = this.lsInit.moneda;
        const banco = this.lsInit.banco;
        const clientes = this.lsInit.clientes;

        let hrHTML = [{ tr: { class: "bg-disabled4" } }, { html: "" }, { html: "" }];
        this.lsInit.thDate.forEach((d) => hrHTML.push({ html: "" }));

        // VENTAS
        let ventasDateHTML = [];
        ventas.granTotalDate.forEach((d) => ventasDateHTML.push({ html: this.format_number(d), class: "text-end fw-bold" }));
        tbody.push([{ html: "VENTAS SIN IMPUESTOS", class: "fw-bold" }, { html: this.format_number(ventas.granTotal), class: "fw-bold text-end" }, ...ventasDateHTML]);

        this.rowTbIncome(tbody, ventas.list);
        tbody.push(hrHTML);

        // DESCUENTOS
        this.rowTbIncome(tbody, descuentos.list);
        tbody.push(hrHTML);

        // IMPUESTOS
        this.rowTbIncome(tbody, impuestos.list);
        tbody.push(hrHTML);

        // SUBTOTAL
        let subtotalHTML = [];
        for (const x in this.lsInit.thDate) {
            subtotalHTML.push({ html: this.format_number(ventas.granTotalDate[x]), class: "fw-bold text-end" });
        }
        tbody.push([{ html: "SUBTOTAL", class: "fw-bold" }, { html: this.format_number(ventas.granTotal), class: "fw-bold text-end" }, ...subtotalHTML]);

        // IMPUESTOS
        let impuestosHTML = [];
        this.lsInit.impuestos.granTotalDate.forEach((d) => impuestosHTML.push({ html: this.format_number(d), class: "fw-bold text-end" }));
        tbody.push([{ html: "IMPUESTOS", class: "fw-bold" }, { html: this.format_number(impuestos.granTotal), class: "fw-bold text-end" }, ...impuestosHTML]);

        // TOTAL
        let totalHTML = [];
        for (const x in this.lsInit.thDate) {
            const totalVenta = ventas.granTotalDate[x] - descuentos.granTotalDate[x] + impuestos.granTotalDate[x];
            totalHTML.push({ html: this.format_number(totalVenta), class: "fw-bold text-end" });
        }
        const totalVenta = ventas.granTotal - descuentos.granTotal + impuestos.granTotal;
        tbody.push([{ html: "TOTAL", class: "fw-bold" }, { html: this.format_number(totalVenta), class: "fw-bold text-end" }, ...totalHTML]);
        tbody.push(hrHTML);

        // EFECTIVO
        this.rowTbIncome(tbody, efectivo.list);

        // MONEDAS
        this.rowTbIncome(tbody, moneda.list);

        // BANCOS
        this.rowTbIncome(tbody, banco.list);
        tbody.push(hrHTML);

        // SUBTOTAL CAJA
        const alias              = this.UDN.val == 6 ? "depóstos" : "propina";
        let   subtotalBoxHTML    = [];
        const lsPropina          = efectivo.list.filter((e) => e.id == 1);
        const lsEfectivo         = efectivo.list.filter((e) => e.id == 2);
        const lsDestajo          = efectivo.list.filter((e) => e.id == 3);
        const lsDescuentoDestajo = efectivo.list.filter((e) => e.id == 5);
        const lsExtra            = efectivo.list.filter((e) => e.id == 4);
        

        for (const x in this.lsInit.thDate) {
            const subtotalBox = lsEfectivo[0].totalDate[x] + lsDestajo[0].totalDate[x] - lsDescuentoDestajo[0].totalDate[x] + moneda.granTotalDate[x] + banco.granTotalDate[x];
            subtotalBoxHTML.push({ html: this.format_number(subtotalBox), class: "fw-bold text-end" });
        }

        const subtotalBox = lsEfectivo[0].total + lsDestajo[0].total - lsDescuentoDestajo[0].total + moneda.granTotal + banco.granTotal;
        tbody.push([{ html: "SUBTOTAL (sin " + alias + ")", class: "fw-bold" }, { html: this.format_number(subtotalBox), class: "fw-bold text-end" }, ...subtotalBoxHTML]);

        // TOTAL CAJA
        let totalBoxHTML = [];
        const consumoCliente = clientes.list.filter((e) => e.id == "C");
        const pagoCliente = clientes.list.filter((e) => e.id == "P");
        for (const x in this.lsInit.thDate) {
            const totalBox = lsEfectivo[0].totalDate[x] - lsPropina[0].totalDate[x] + lsDestajo[0].totalDate[x] - lsDescuentoDestajo[0].totalDate[x] + lsExtra[0].totalDate[x] + moneda.granTotalDate[x] + banco.granTotalDate[x] + consumoCliente[0].totalDate[x] - pagoCliente[0].totalDate[x];
            totalBoxHTML.push({ html: this.format_number(totalBox), class: "fw-bold text-end" });
        }
        const totalBox = lsEfectivo[0].total - lsPropina[0].total + lsDestajo[0].total - lsDescuentoDestajo[0].total + lsExtra[0].total + moneda.granTotal + banco.granTotal + consumoCliente[0].total - pagoCliente[0].total;
        tbody.push([{ html: "TOTAL (con " + alias + ")", class: "fw-bold" }, { html: this.format_number(totalBox), class: "fw-bold text-end" }, ...totalBoxHTML]);

        // DIFERENCIA
        let diferenciaBoxHTML = [];
        for (const x in this.lsInit.thDate) {
            console.log({
                efectivo         : lsEfectivo[0].totalDate[x],
                descuento        : lsPropina[0].totalDate[x],
                destajo          : lsDestajo[0].totalDate[x],
                descuentosDestajo: lsDescuentoDestajo[0].totalDate[x],
                extra            : lsExtra[0].totalDate[x],
                moneda           : moneda.granTotalDate[x],
                banco            : banco.granTotalDate[x],
                consumo          : consumoCliente[0].totalDate[x],
                pago             : pagoCliente[0].totalDate[x]
            });
            
            
            const totalVenta = ventas.granTotalDate[x] - descuentos.granTotalDate[x] + impuestos.granTotalDate[x];
            const totalBox = lsEfectivo[0].totalDate[x] - lsPropina[0].totalDate[x] + lsDestajo[0].totalDate[x] - lsDescuentoDestajo[0].totalDate[x] +  lsExtra[0].totalDate[x] + moneda.granTotalDate[x] + banco.granTotalDate[x] + consumoCliente[0].totalDate[x] - pagoCliente[0].totalDate[x];
            console.log(totalBox);
            
            const diferenciaBox = totalBox - totalVenta;
            diferenciaBoxHTML.push({ html: this.format_number(diferenciaBox), class: "fw-bold text-end" });
        }

        const diferenciaBox = totalBox - totalVenta;
        tbody.push([{ html: "DIFERENCIA", class: "fw-bold" }, { html: this.format_number(diferenciaBox), class: "fw-bold text-end" }, ...diferenciaBoxHTML]);
        tbody.push(hrHTML);

        // CLIENTES
        this.rowTbIncome(tbody, clientes.list);
        tbody.push(hrHTML);

        return {
            table: { id: "tbIncome" },
            thead: "CONCEPTO,TOTALES," + this.lsInit.thDate,
            tbody,
        };
    }
    rowTbIncome(tbody, group) {
        group.forEach((tr) => {
            let rowHTML = [];
            tr.totalDate.forEach((b) => rowHTML.push({ html: this.format_number(b), class: "text-end" }));
            tbody.push([{ html: tr.name, class: "fst-italic" }, { html: this.format_number(tr.total), class: "fw-bold text-end" }, ...rowHTML]);
        });
    }
    // ARCHIVOS
    async uploadFile() {
        const file = $("#btnIncomeFile")[0].files[0];
        if (file) {
            const result = await alert({ icon: "question", title: '¿Esta seguro de subir el archivo "' + file.name + '"?' });

            if (result.isConfirmed) {
                let datos = new FormData();
                datos.append("opc", "insFileIncome");
                datos.append("file", file);
                datos.append("date1", this.Dates.val());
                datos.append("idE", this.UDN.val());

                const data = await send_ajax(datos, this._ctrl);
                if (data === true) alert();
                else console.error(data);
            }
        }
    }
}
