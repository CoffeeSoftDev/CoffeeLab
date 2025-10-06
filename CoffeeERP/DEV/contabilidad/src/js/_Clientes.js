class Clientes extends Contabilidad {
    #_lsCustomers;
    constructor(ctrl) {
        super(ctrl);
        this._dayMov = {};
    }
    get lsCustomer() {
        return this.#_lsCustomers;
    }
    set lsCustomer(valor) {
        this.#_lsCustomers = valor ?? null;
    }
    async payDebt(tab) {
        const form = await this.formPayDebt();

        this.createModal({ form, title: "Nueva transacción", size: "large" }).then(() => {
            $("#modalCliente").option_select({ select2: true, father: true });

            $("#modalCliente").on("change", () => {
                const deuda = this.findDebt($("#modalCliente").val());
                this.attrElement({ "#deuda": { value: deuda, deuda }, "#modalEfectivo": { disabled: false }, "#modalBanco": { disabled: false }, "#modalConsumo": { disabled: false } });
            });

            $("#modalEfectivo, #modalBanco, #modalConsumo").on("input", () => {
                this.calcTransaction();
                $("#modalEfectivo, #modalBanco, #modalConsumo").attr("required", false);
                if (!$("#modalEfectivo, #modalBanco, #modalConsumo").attr("required")) $("#modalEfectivo, #modalBanco, #modalConsumo").removeClass("is-invalid").parent().next("span").addClass("hide");
            });

            form.validation_form({ opc: "newTransaction", date1: this.Dates.val() }, async (datos) => {
                if (datos.get("efectivo") == "") datos.append("efectivo", 0);
                if (datos.get("banco") == "") datos.append("banco", 0);
                if (datos.get("consumo") == "") datos.append("consumo", 0);
                send_ajax(datos, this._ctrl).then(async (data) => {
                    if (data) {
                        alert();
                        if (tab == "ingresos") {
                            this.lsCustomer = await this.fnDateUDN("lsCustomer");
                            $("#modalCliente").option_select({ data: this.lsCustomer, select2: true, father: true });
                            $("#modalCliente").prop({ selectedIndex: 0 }).change();
                            const balance = await this.fnDateUDN("payDebtUDN");
                            $("#customerPagos").val(balance.pay);
                            $("#customerDeudas").val(balance.debt);
                            ing.calcBox();
                            closedModal();
                            // form[0].reset();
                        } else this.tbPayDebtCustomer();
                    } else console.error(data);
                });
            });
        });
    }
    async formPayDebt() {
        const container = [
            { class: "row m-0", id: "mdl_Customers" },
            { class: "row m-0 text-center border-start border-end border-top pt-2 text-muted fw-bold", html: '<h5><i class="icon-money-2"></i> Pagos o anticipos</h5>' },
            { class: "row m-0 mb-3 border-start border-end border-bottom", id: "mdl_payments" },
            { class: "row m-0 mb-3 border-bottom", id: "mdl_debt" },
            { class: "row m-0", id: "mdl_buttons" },
        ];

        const $form = this.createForm({ id: "modalFormCredit" });
        await this.createContent($form, container);

        const elements = await this.dataPayDebt();
        await this.mergeFormDivs($form, elements);

        return $form;
    }
    async dataPayDebt() {
        this.lsCustomer = this.lsCustomer ?? (await this.fnDateUDN("lsCustomer"));
        const divClass = { div: { class: "col-12 col-sm-6 mb-3" } };
        let attrSelect = { required: true, id: "modalCliente", option: { data: this.lsCustomer, placeholder: "-Seleccionar-" }, elemento: "select", ...divClass };

        return [
            {
                container: "mdl_Customers",
                elements: [
                    { lbl: "Cliente", ...attrSelect, div: { class: "col-12 col-md-8 mb-3" } },
                    { lbl: "Deuda", ...this.iptCifra, div: { class: "col-12 col-md-4 mb-3" } },
                ],
            },
            {
                container: "mdl_payments",
                elements: [
                    { lbl: "Efectivo", id: "modalEfectivo", required: true, ...this.iptCifra, ...divClass },
                    { lbl: "Banco", id: "modalBanco", required: true, ...this.iptCifra, ...divClass },
                ],
            },
            {
                container: "mdl_debt",
                elements: [{ lbl: "Consumo", id: "modalConsumo", required: true, ...this.iptCifra, div: { class: "col-12 mb-3" } }],
            },
            {
                container: "mdl_buttons",
                elements: [{ lbl: "Guardar,Cerrar", elemento: "modal_button" }],
            },
        ];
    }
    findDebt(id) {
        return this.lsCustomer.find((customer) => customer.id === id).deuda;
    }
    calcTransaction() {
        let deuda = this.float($("#deuda").attr("deuda"));
        let efectivo = !$("#modalEfectivo").val() ? 0 : this.float($("#modalEfectivo").val());
        let banco = !$("#modalBanco").val() ? 0 : this.float($("#modalBanco").val());
        let consumo = !$("#modalConsumo").val() ? 0 : this.float($("#modalConsumo").val());

        let pagosAnticipos = efectivo + banco;
        deuda = deuda + consumo - pagosAnticipos;
        $("#deuda").number_format(deuda, 2, ".", ",");
    }
    // CONTENIDO TAB/GERENCIA
    async initCustomerTab() {
        const init = await this.fnDateUDN("initCustomerTab");
        this.lsCustomer = init.customers;
        await this.balanceCustomer(init.balance);
    }
    async customers() {
        await this.fechasPermitidas(5);
        await this.initCustomerTab();
        await this.createContent(this.tbContainer.html(""), [
            { class: "col-12", id: "lsTbCustomers" },
            { class: "col-12 col-md-7 hide", id: "movCustomers" },
        ]);
        await this.tablesCustomers();
        this.Dates.off("change").on("change", () => this.changeDate());
    }
    async changeDate() {
        await this.fechasPermitidas(1);
        await this.initCustomerTab();
        await this.createContent(this.tbContainer.html(""), [
            { class: "col-12", id: "lsTbCustomers" },
            { class: "col-12 col-md-7 hide", id: "movCustomers" },
        ]);
        await this.tablesCustomers();
    }
    async tbContainerClean() {
        await this.createContent(this.tbContainer.html(""), [
            { class: "col-12", id: "lsTbCustomers" },
            { class: "col-12 col-md-7 hide", id: "movCustomers" },
        ]);
    }
    async tablesCustomers() {
        await $("#lsTbCustomers")
            .html("")
            .create_table(await this.tableEstructureCustomer());
        $("#tbCustomers").table_format();
    }
    async tableEstructureCustomer() {
        let tbody = [];
        let total = 0;
        // this.lsCustomer = this.lsCustomer ?? (await this.fnDateUDN("lsCustomer"));
        this.lsCustomer.forEach((c) => {
            const deuda = parseFloat(c.deuda.replace(",", ""));
            total += deuda;

            let icon = c.mov == true ? '<i class="icon-right-hand"></i> ' : "";

            tbody.push([
                { html: icon + c.valor, class: "pointer", onclick: "tbDayCustomer('" + c.id + "')" },
                { html: this.format_number(deuda), class: "text-end" },
            ]);
        });

        const tfoot = [
            { html: "TOTAL", class: "fw-bold" },
            { html: this.format_number(total), class: "fw-bold text-end" },
        ];

        return {
            table: { id: "tbCustomers" },
            thead: "Cliente,Crédito",
            tbody,
            tfoot,
        };
    }
    async tbDayCustomer(folio) {
        this._dayMov = await this.fnDateUDN({ opc: "payDebtCustomer", folio });

        if (this._dayMov && this._dayMov.length > 0) {
            $("#lsTbCustomers").addClass("mb-3 col-md-5 mb-md-0");
            $("#movCustomers").html("").removeClass("hide");

            await $("#movCustomers")
                .html("")
                .create_table(await this.tbPayDebtCustomer());
            this.table = "#tbMovCustomers";
            this.table.table_format({ order: [[2, "ASC"]], priority: "4,3,1" });
            const table = this.table.DataTable();
            table.column(0).visible(false);
        } else alert({ icon: "info", title: "No contiene datos." });
    }
    async tbPayDebtCustomer() {
        let tbody = [];
        let totalPay = 0;
        let totalDebt = 0;
        this._dayMov.forEach((e) => {
            let button = $("<button>", {
                class: "btn btn-sm btn-outline-warning",
                html: '<i class="icon-attention text-danger"></i>',
                onclick: "alert('Ya existe un retiro')",
            });

            let buttons = getCookies().IDE != 8 ? button.prop("outerHTML") : "";

            if (!this.apertura.retiro && getCookies().IDE != 8) {
                buttons = this.dropdown([
                    { icon: "icon-pencil", text: "Editar", onClick: "editMovCustomer('" + e.folio + "');" },
                    { icon: "icon-trash", text: "Eliminar", onClick: "deleteMovCustomer('" + e.folio + "');" },
                ]);
            }

            totalPay += parseFloat(e.pago);
            totalDebt += parseFloat(e.consumo);

            tbody.push([
                { html: e.folio, class: "text-center" },
                { html: e.tipoPago, class: "text-center" },
                { html: this.format_number(e.pago), class: "text-end" },
                { html: this.format_number(e.consumo), class: "text-end" },
                { html: buttons, class: "text-center" },
            ]);
        });

        const tfoot = [{ html: "" }, { html: "TOTAL" }, { html: this.format_number(totalPay) }, { html: this.format_number(totalDebt) }, { html: "" }];

        return {
            table: { id: "tbMovCustomers" },
            thead: "folio,T. Pago,Pago,Consumo,Opciones",
            tbody,
            tfoot,
        };
    }
    async balanceCustomer(balance) {
        await this.callSaldos({
            titulo: "Saldo de clientes",
            clase: "saldoCustomer",
            saldos: [{ valor: balance.initial }, { text: "Consumo", valor: balance.debt }, { text: "Pagos", valor: balance.pays }, { valor: balance.final }],
        });

        if (getCookies()["IDE"] != 8) {
            this.Container.append(`
            <div class="col mt-1 mb-3">
                <div class="bd-callout bd-callout-info d-flex p-3 bd-highlight align-items-center m-0">
                    <label class="fw-bold fs-5 text-info"><i class="icon-info"></i> Los proveedores con movimientos del día tienen el icono <i class="icon-right-hand"></i>, al dar click se muestra la información.</label>
                </div>
            </div>
            `);
        }
    }
    async editMovCustomer(folio) {
        const form = await this.formPayDebt();

        this.createModal({ form, title: "Editar transacción", size: "large" }).then(() => {
            $("#deuda").parent().parent().remove();
            $("#modalCliente").parent().removeClass("col-md-8");
            const mov = this._dayMov.filter((m) => m.folio === folio)[0];

            $("#modalCliente").on("change", () => {
                const deuda = this.findDebt($("#modalCliente").val());
                this.attrElement({ "#modalEfectivo": { disabled: false }, "#modalBanco": { disabled: false }, "#modalConsumo": { disabled: false } });
            });

            const inputs = $("#modalEfectivo, #modalBanco, #modalConsumo");

            inputs.on("keyup", function () {
                const currentInput = $(this);
                const hasValue = currentInput.val() !== "";

                // Habilitar todos los inputs inicialmente
                inputs.prop("disabled", false);

                // Verificar si todos los inputs están vacíos
                const allEmpty =
                    inputs.filter(function () {
                        return $(this).val() === "";
                    }).length === inputs.length;

                // Establecer la propiedad 'required' basándose en si todos los inputs están vacíos
                inputs.prop("required", allEmpty);

                // Deshabilitar otros inputs si el actual tiene valor
                if (hasValue) {
                    inputs.not(currentInput).prop("disabled", true);
                    inputs.next("span").addClass("hide");
                }
            });

            $("#modalCliente").val(mov.customer).change().prop("disabled", true);

            if (mov.pago != "0" && mov.tipoPago == "Efectivo") {
                $("#modalEfectivo").val(mov.pago).prop({ required: false });
                $("#modalBanco, #modalConsumo").prop({ disabled: true, required: false });
            }
            if (mov.pago != "0" && mov.tipoPago == "Banco") {
                $("#modalBanco").val(mov.pago).prop({ requried: false });
                $("#modalEfectivo, #modalConsumo").prop({ disabled: true, required: false });
            }
            if (mov.consumo != "0") {
                $("#modalConsumo").val(mov.consumo).prop({ required: false });
                $("#modalEfectivo, #modalBanco").prop({ disabled: true, required: false });
            }

            form.validation_form({ opc: "editMovCustomer", folio, table: mov.table }, async (datos) => {
                send_ajax(datos, this._ctrl).then(async (data) => {
                    if (data === true) {
                        alert();
                        $(".bootbox-close-button").click();
                        await this.initCustomerTab();
                        await this.tablesCustomers();
                        const customer = this._dayMov.filter((c) => c.folio == folio)[0]["customer"];
                        await this.tbDayCustomer(customer);
                    } else console.error(data);
                });
            });
        });
    }
    deleteMovCustomer(folio) {
        const mov = this._dayMov.filter((m) => m.folio === folio)[0];

        this.remove({
            data: { opc: "deleteMovCustomer", table: mov.table, folio: mov.id },
            method: async (data) => {
                if (data === true) {
                    alert();
                    this.deleteRow(folio);
                    await this.initCustomerTab();
                    await this.tablesCustomers();
                } else console.error(data);
            },
        });
    }
    // CONTENIDO CONSULTAS
    async initConsultCustomers() {
        this.balanceConsultCustomer();
        this.tbConsultCustomer();
    }
    async balanceConsultCustomer() {
        const balance = await this.fnDateUDN("balanceCustomer");
        this.balanceCustomer(balance);
    }
    async tbConsultCustomer() {
        this.lsCustomer = await this.fnDateUDN("consultCustomers", this.tbContainer);
        this.tbContainer.html("").create_table(this.estrucureTbConsultCustomer());
        $("#tbConsultCustomer").tb_fixed(2);
    }
    estrucureTbConsultCustomer() {
        let tbody = [];
        const icon = '<i class="icon-right-dir"></i>';
        const dates = this.lsCustomer.dates;
        const list = this.lsCustomer.list;

        if (dates.length > 0) {
            this.lsCustomer.customers.forEach((tr) => {
                const initialData = list.filter((i) => i.id == tr.id);
                let   initialHTML = [];
                let   debtHTML    = [];
                let   paysHTML    = [];
                let   finalHTML   = [];
                let   thFinalHTML = [];
                // let   hrHTML      = [];
                let columnDinamic = [];
                initialData.forEach((e) => {
                    initialHTML.push({ html: e.initial, class: "text-end" });
                    debtHTML.push({ html: e.debt, class: "text-end" });
                    paysHTML.push({ html: e.pays, class: "text-end" });
                    finalHTML.push({ html: e.final, class: "text-end" });
                    thFinalHTML.push({ html: e.final, class: "text-end fw-bold" });
                    // hrHTML.push({ html: ''});

                    const tdCompras = e.debt && e.debt !== "-" ? `<span class="text-danger">Consumo: ${e.debt}</span>` : "-";
                    const tdPagos = e.pays !== "-" ? `<span class="text-primary">Pago: ${e.pays}</span>` : `-`;
                    const tdString = tdCompras === "-" ? tdPagos : tdPagos != "-" ? tdCompras + "<br>" + tdPagos : tdCompras;
                    columnDinamic.push({ html: tdString, class: "text-end fw-bold" });
                });

                tbody.push([
                    { html: icon + tr.valor, class: "fw-bold pointer", onClick: "showData('C" + tr.id + "')" },
                    { html: this.format_number(tr.deuda), class: "fw-bold text-end" },
                    ...columnDinamic,
                ]);

                const balance = this.lsCustomer.balance.filter((b) => b.id == tr.id);

                balance.forEach((b) => {
                    tbody.push(
                        [{ tr: { class: "hide C" + tr.id } }, { html: "Saldo Inicial", class: "fst-italic" }, { html: b.initial, class: "fst-italic text-end" }, ...initialHTML],
                        [{ tr: { class: "hide C" + tr.id } }, { html: "Consumo", class: "fst-italic" }, { html: b.debt, class: "fst-italic text-end" }, ...debtHTML],
                        [{ tr: { class: "hide C" + tr.id } }, { html: "Pago", class: "fst-italic" }, { html: b.pays, class: "fst-italic text-end" }, ...paysHTML],
                        [{ tr: { class: "hide C" + tr.id } }, { html: "Saldo final", class: "fst-italic" }, { html: b.final, class: "fst-italic text-end" }, ...finalHTML],
                //         [{ tr: { class: "hide C" + tr.id + ' bg-disabled4'} }, { html: '' }, { html: '' }, ...hrHTML]
                    );
                });
            });
        }

        return {
            table: { id: "tbConsultCustomer" },
            thead: "Clientes,crédito," + dates.join(","),
            tbody,
        };
    }
}
