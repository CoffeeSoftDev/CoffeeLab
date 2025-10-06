class Proveedores extends Contabilidad {
    #_lsSupplier;
    #_balance;
    #_movDay;
    constructor(ctrl) {
        super(ctrl);
    }
    get lsSupplier() {
        return this.#_lsSupplier;
    }
    set lsSupplier(valor) {
        this.#_lsSupplier = valor;
    }
    get balance() {
        return this.#_balance;
    }
    set balance(valor) {
        this.#_balance = valor;
    }
    get movDay() {
        return this.#_movDay;
    }
    set movDay(valor) {
        this.#_movDay = valor;
    }
    async initSuppliers() {
        const data = await this.fnDateUDN("initSuppliers");
        this.lsSupplier = data.suppliers;
        this.balance = data.balance;
        await this.createContent(this.tbContainer.html(""), [
            { class: "col-12", id: "lsTbSuppliers" },
            { class: "col-12 col-md-7 hide", id: "movSuppliers" },
        ]);
        await this.tbSuppliers();
        await this.balanceSuppliers();
    }
    async suppliers() {
        await this.fechasPermitidas(2);
        await this.initSuppliers();
        this.Dates.off("change").on("change", () => this.initSuppliers());
    }
    async balanceSuppliers() {
        await this.callSaldos({
            titulo: "Saldo de proveedores",
            clase: "balanceSuppliers",
            saldos: [{ valor: this.balance.initial }, { text: "Compras", valor: this.balance.buys }, { text: "Pagos", valor: this.balance.pays }, { valor: this.balance.final }],
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
    async tbSuppliers() {
        await $("#lsTbSuppliers").html("").create_table(this.estructureTbSuppliers());
        $("#tbSuppliers").table_format();
    }
    estructureTbSuppliers() {
        let tbody = [];
        let total = 0;
        this.lsSupplier.forEach((tr) => {
            let deuda = parseFloat(tr.debt.replace(",", ""));
            total += deuda;

            let icon = "";
            if (parseInt(deuda) != 0 || tr.mov > 0) {
                icon = tr.mov > 0 ? '<i class="icon-right-hand"></i>' : "";
                tbody.push([
                    { html: icon + tr.valor, class: "pointer", onclick: "tbSuppliersDay(" + tr.id + ")" },
                    { html: this.format_number(deuda), class: "text-end" },
                ]);
            }
        });

        const tfoot = [{ html: "Total" }, { html: this.format_number(total), class: "text-end" }];

        return {
            table: { id: "tbSuppliers" },
            thead: "Proveedor,Crédito",
            tbody,
            tfoot,
        };
    }
    async tbSuppliersDay(id) {
        this.movDay = await this.fnDateUDN({ opc: "movSuppliersDay", id });
        if (this.movDay && this.movDay.length > 0) {
            $("#lsTbSuppliers").addClass("mb-3 col-md-5 mb-md-0");
            $("#movSuppliers").html("").removeClass("hide");

            await $("#movSuppliers")
                .html("")
                .create_table(await this.estructureTbSuppliersDay());
            this.table = "#tbMovSuppliers";
            this.table.table_format({ order: [[1, "ASC"]], priority: "4,3,2" });
            const table = this.table.DataTable();
            table.column(0).visible(false);
        } else alert({ icon: "info", title: "No contiene datos." });
    }
    async estructureTbSuppliersDay() {
        let tbody = [];
        let totalPay = 0;
        let totalBuy = 0;
        this.movDay.forEach((e) => {
            const pago = parseFloat(e.pago);
            const compra = parseFloat(e.subtotal) + parseFloat(e.impuesto);

            totalPay += pago;
            totalBuy += compra;

            let buttons =
                this.apertura.open && getCookies().IDE != 8
                    ? this.dropdown([
                          { icon: "icon-pencil", text: "Editar", onClick: "editMovSuppliers('" + e.folio + "');" },
                          { icon: "icon-trash", text: "Eliminar", onClick: "deleteMovSuppliers('" + e.folio + "');" },
                      ])
                    : "";

            if (pago != 0 && this.apertura.reembolso && e.idTP == 3) {
                const button = $("<button>", {
                    class: "btn btn-sm btn-outline-warning",
                    html: '<i class="icon-attention text-danger"></i>',
                    onclick: "alert('Ya existe un reembolso.')",
                });

                buttons = button.prop("outerHTML");
            }

            tbody.push([
                { html: e.folio, class: "text-center" },
                { html: e.clase, class: "text-center" },
                { html: this.format_number(compra), class: "text-end" },
                { html: this.format_number(pago), class: "text-end" },
                { html: buttons, class: "text-center" },
            ]);
        });

        let tfoot = [{ html: "" }, { html: "TOTAL" }, { html: this.format_number(totalBuy) }, { html: this.format_number(totalPay) }, { html: "TOTAL" }];

        return {
            table: { id: "tbMovSuppliers" },
            thead: "FOLIO,MOVIMIENTO,COMPRA,PAGO,OPCIONES",
            tbody,
            tfoot,
        };
    }
    async editMovSuppliers(folio) {
        const mov = this.movDay.filter((m) => m.folio == folio)[0];

        const form = this.createForm();

        form.create_elements([
            { div: { class: "col-12 mb-3" }, elemento: "select", option: { data: this.lsSupplier }, lbl: "Proveedor", disabled: true },
            { div: { class: "col-12 mb-3" }, elemento: "input-group", name: "Pago", tipo: "cifra", value: mov.pago, lbl: "Pago" },
            { div: { class: "col-12 mb-3" }, elemento: "input-group", name: "Gasto", tipo: "cifra", value: mov.subtotal, lbl: "Compra" },
            { div: { class: "col-12 mb-3" }, elemento: "input-group", name: "GastoIVA", tipo: "cifra", value: mov.impuesto, lbl: "Impuesto de Compra" },
            { div: { class: "col-12 mb-3" }, elemento: "textarea", lbl: "Observaciones", val: mov.obs, disabled: true },
            { elemento: "modal_button" },
        ]);

        this.createModal({ form, title: "Editar movimiento de proveedor" }).then(() => {
            if (mov.pago == 0) $("#pago").parent().parent().remove();
            else {
                $("#compra").parent().parent().remove();
                $("#impuestodecompra").parent().parent().remove();
            }

            $("#proveedor").val(mov.suppliers).change();

            form.validation_form({ opc: "editMovSuppliers", idCompras: folio }, (datos) => {
                send_ajax(datos, this._ctrl).then(async (data) => {
                    if (data === true) {
                        alert();
                        await this.initSuppliers();
                        await this.tbSuppliersDay(mov.suppliers);
                        $(".bootbox-close-button").click();
                    } else console.error(data);
                });
            });
        });
    }
    deleteMovSuppliers(folio) {
        const mov = this.movDay.filter((m) => m.folio === folio)[0];

        this.remove({
            data: { opc: "deleteMovSuppliers", folio: mov.folio },
            method: async (data) => {
                if (data === true) {
                    alert();
                    const mov2 = this.movDay.filter((m) => m.folio !== folio);
                    if (mov2.length == 0) {
                        $("#lsTbSuppliers").removeClass("mb-3 col-md-5 mb-md-0");
                        $("#movSuppliers").html("").addClass("hide");
                    } else {
                        this.deleteRow(folio);
                    }
                    await this.initSuppliers();
                } else console.error(data);
            },
        });
    }
    // CONSULTA DE RANGOS
    async filterConsult() {
        this.fillContainer.html("").create_elements([
            {
                lbl: "Filtro de proveedores",
                elemento: "select",
                option: {
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Todos" },
                    ],
                },
            },
        ]);
    }
    async initConsultSuppliers() {
        this.balanceConsult();
        this.tbConsulta();
    }
    async balanceConsult() {
        this.balance = await this.fnDateUDN("balanceSuppliers");
        this.balanceSuppliers();
    }
    async tbConsulta() {
        this.lsSupplier = await this.fnDateUDN("consultSuppliers", this.tbContainer);
        this.tbContainer.html("").create_table(await this.estructureTbConsulta());
        $("#tbConsultSuppliers").tb_fixed(2);
    }
    async estructureTbConsulta() {
        const icon = '<i class="icon-right-dir"></i>';
        let tbody = [];
        const dates = this.lsSupplier.dates;
        const list = this.lsSupplier.list;

        if (dates.length > 0) {
            this.lsSupplier.suppliers.forEach((tr) => {
                const initialData = list.filter((i) => i.id == tr.id);
                let initialHTML = [];
                let buysHTML = [];
                // let taxsHTML = [];
                let paysHTML = [];
                let finalHTML = [];
                let thFinalHTML = [];
                // let hrHTML = [];

                initialData.forEach((e) => {
                    // thFinalHTML.push({ html: e.final, class: "text-end fw-bold" });
                    // hrHTML.push({ html: "" });

                    const buys = isNaN(parseFloat(e.buys)) ? 0 : parseFloat(e.buys);
                    const taxs = isNaN(parseFloat(e.taxs)) ? 0 : parseFloat(e.taxs);
                    const totalBuy = buys + taxs;
                    const tdCompras = parseInt(totalBuy) !== 0 ? `<span class="text-danger">Compras: ${format_number(totalBuy)}</span>` : "-";
                    const tdPagos = e.pays !== "-" ? `<span class="text-primary">Pagos: ${e.pays}</span>` : `-`;
                    const tdString = tdCompras === "-" ? tdPagos : tdPagos != "-" ? tdCompras + "<br>" + tdPagos : tdCompras;
                    thFinalHTML.push({ html: tdString, class: "text-end fw-bold" });

                    initialHTML.push({ html: e.initial, class: "text-end" });
                    buysHTML.push({ html: format_number(totalBuy), class: "text-end" });
                    // taxsHTML.push({ html: e.taxs, class: "text-end" });
                    paysHTML.push({ html: e.pays, class: "text-end" });
                    finalHTML.push({ html: e.final, class: "text-end" });
                });

                tbody.push([{ html: icon + tr.valor, onclick: "showData('S" + tr.id + "')", class: "fw-bold pointer" }, { html: this.format_number(tr.debt), class: "fw-bold text-end" }, ...thFinalHTML]);

                const balance = this.lsSupplier.balance.filter((s) => s.id == tr.id);
                balance.forEach((b) => {
                    tbody.push(
                        [{ tr: { class: "hide S" + tr.id } }, { html: "Saldo inicial", class: "fst-italic" }, { html: b.initial, class: "fst-italic text-end" }, ...initialHTML],
                        [{ tr: { class: "hide S" + tr.id } }, { html: "Compra", class: "fst-italic" }, { html: b.buys, class: "fst-italic text-end" }, ...buysHTML],
                        // [{ tr: { class: "hide S" + tr.id } }, { html: "Impuestos", class: "fst-italic" }, { html: b.taxs, class: "fst-italic text-end" }, ...taxsHTML],
                        [{ tr: { class: "hide S" + tr.id } }, { html: "Pagos", class: "fst-italic" }, { html: b.pays, class: "fst-italic text-end" }, ...paysHTML],
                        [{ tr: { class: "hide S" + tr.id } }, { html: "Saldo final", class: "fst-italic" }, { html: b.final, class: "fst-italic text-end" }, ...finalHTML]
                        // [{ tr: { class: "hide S" + tr.id + " bg-disabled4" } }, { html: "" }, { html: "" }, ...hrHTML]
                    );
                });
            });
        }

        return {
            table: { id: "tbConsultSuppliers" },
            thead: "Proveedor,Crédito," + dates.join(","),
            tbody,
        };
    }
}
