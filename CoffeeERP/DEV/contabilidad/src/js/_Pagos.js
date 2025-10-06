class Pagos extends Contabilidad {
    #_balance;
    constructor(ctrl) {
        super(ctrl);
    }
    get balance() {
        return this.#_balance;
    }
    set balance(valor) {
        this.#_balance = valor;
    }
    async pays() {
        await this.changeDate();
        this.Dates.on("change", () => this.changeDate());
    }
    async changeDate() {
        await this.fechasPermitidas(3);
        await this.createfilterPay();
        await this.tbPay();
        $("#filtroPagos")
            .off("change")
            .on("change", () => this.tbPay());
    }
    async createfilterPay() {
        const filtro = [
            { id: 0, valor: "Todos los movimientos" },
            { id: 1, valor: "Almacén" },
            { id: 2, valor: "Proveedor" },
        ];

        const button = this.apertura.open && getCookies().IDE != 8 ? [{ lbl: "Nuevo pago o salida", elemento: "button", onclick: "newPay()" }] : [];

        const elementos = [
            ...button,
            { lbl: "Total del día", elemento: "input-group", tipo: "cifra", disabled: true },
            { lbl: "Filtrar por:", id: "filtroPagos", elemento: "select", option: { data: filtro, placeholder: "" } },
        ];

        this.Container.html("").create_elements(elementos);
    }
    async tbPay() {
        this.jsTable = await this.fnDateUDN({ opc: "tbPagos", filtro: $("#filtroPagos").val() }, this.tbContainer);
        this.tbContainer.html("").create_table(this.tableEstructure());
        this.table.table_format({ order: [[0, "desc"]], priority: "5,4,3,0" });
    }
    tableEstructure() {
        this.table = "#tbPagos";
        const thead = "Folio,Almacén,Proveedor,T. Pago,Pago,Opciones";
        let tbody = [];
        let granTotal = 0;
        this.jsTable.forEach((td) => {
            granTotal += parseFloat(td.pago);

            let btnExtra = [];
            if ((td.idCG != 3 || (td.idCG == 3 && !this.apertura.reembolso)) && getCookies().IDE != 8) {
                btnExtra = [
                    { icon: "icon-pencil", text: "Editar", fn: "editPay(" + td.folio + ")" },
                    { icon: "icon-trash", text: "Eliminar", fn: "deletePay(" + td.folio + ")" },
                ];
            }

            let btnFile = [];
            if (td.ruta) {
                let rutaFile = "https://www.erp-varoch.com/" + td.ruta + td.archivo;
                if (td.ruta.split("/")[0] == "recursos") rutaFile = "https://www.erp-varoch.com/ERP/" + td.ruta + td.archivo;

                btnFile = [{ icon: "icon-file-pdf", text: "Comprobante", href: rutaFile, target: "_blank" }];
            }

            const buttons = this.dropdown([{ icon: "icon-i-cursor", text: "Observaciones", fn: `viewObsPay(${td.folio})` }, ...btnFile, ...btnExtra]);

            let tr = [
                { html: "#" + td.folio },
                { html: td.almacen },
                { html: td.proveedor },
                { html: td.tPago },
                { html: this.format_number(td.pago), class: "text-end" },
                { class: "text-center", html: buttons },
            ];

            tbody.push(tr);
        });

        $("#totaldeldia").val(this.number_format(granTotal, 2, ".", ","));

        return {
            table: { id: "tbPagos" },
            thead,
            tbody,
        };
    }
    async formElements() {
        this.lsInit = await this.fnDateUDN("initPagos");
        const divClass = { div: { class: "col-12 col-md-6 mb-3" } };
        const atrSelect = { elemento: "select", class: "text-uppercase", required: true, ...divClass };

        const fondo = !this.apertura.reembolso ? [{ id: "3", valor: "Fondo fijo" }] : [];

        const tPago = [{ id: "1", valor: "Corporativo" }, ...fondo];

        const defJSON = { id: 0, valor: " - SELECCIONAR -" };
        let lsProveedores = this.lsInit.proveedores;
        lsProveedores.unshift(defJSON);
        let lsAlmacen = this.lsInit.almacenes;
        lsAlmacen.unshift(defJSON);

        const elements = [
            { lbl: "Proveedor", name: "id_UP", id: "modalProveedor", option: { data: lsProveedores}, ...atrSelect },
            { lbl: "Tipo de almacén", name: "id_UI", id: "modalAlmacen", option: { data: lsAlmacen }, ...atrSelect },
            {
                lbl: "Tipo de pago",
                id: "modalTPago",
                name: "id_CG",
                option: { data: tPago, placeholder: "- Seleccionar -" },
                ...atrSelect,
                disabled: true,
                required: false,
                div: { class: "col-12 col-md-6 col-lg-4 mb-3" },
            },
            { lbl: "Cantidad", name: "Pago", elemento: "input-group", tipo: "cifra", required: true, div: { class: "col-12 col-md-6 col-lg-4 mb-3" } },
            { lbl: "Comprobante", elemento: "input", type: "file", div: { class: "col-12  col-lg-4 mb-3" } },
            { lbl: "Observaciones", name: "Observacion", elemento: "textarea", div: { class: "col-12 mb-4" } },
            { elemento: "modal_button" },
        ];
        return elements;
    }
    async newPay() {
        const form = this.createForm();
        await form.create_elements(await this.formElements());
        this.createModal({ title: "NUEVO PAGO O SALIDA", form, size: "extra-large" }).then(() => {
            $("#modalProveedor").on("change", function () {
                if ($(this).val() != 0) {
                    $("#modalAlmacen").prop({ required: false, disabled: true });
                    $("#modalTPago").prop({ required: true, disabled: false });
                } else {
                    $("#modalAlmacen").prop({ required: true, disabled: false });
                    $("#modalTPago").prop({ required: false, disabled: true });
                }
            });

            $("#modalAlmacen").on("change", function () {
                if ($(this).val() != 0) {
                    $("#modalProveedor").prop({ required: false, disabled: true });
                    $("#modalTPago").prop({ disabled: true });
                } else {
                    $("#modalProveedor").prop({ required: true, disabled: false });
                    $("#modalTPago").prop({ disabled: false });
                }
            });

            form.validation_form({ opc: "newPay", id_UDN: this.UDN.val(), Fecha_Compras: this.Dates.val() }, (datos) => {
                send_ajax(datos, this._ctrl).then((data) => {
                    if (data === true) {
                        alert();
                        saldos();
                        this.tbPay();
                        $(".modal-body").find("form")[0].reset();
                        closedModal();
                    } else {
                        console.error(data);
                    }
                });
            });
        });
    }
    viewObsPay(folio) {
        const obs = this.jsTable.filter((tr) => tr.folio == folio)[0].obs;
        const text = obs ?? obs != "" ? obs : '<i class="text-muted">No hay observaciones</i>';
        this.createModal({ title: "Observaciones", form: text, close: true });
    }
    async editPay(folio) {
        const form = this.createForm();
        await form.create_elements(await this.formElements());
        this.createModal({ title: "NUEVO PAGO O SALIDA", form, size: "extra-large" }).then(() => {
            let mov = this.jsTable.filter((tr) => tr.folio == folio)[0];
            $("#modalProveedor").on("change", function () {
                if ($(this).val() != 0) {
                    $("#modalAlmacen").prop({ required: false, disabled: true });
                    $("#modalTPago").prop({ required: true, disabled: false });
                } else {
                    $("#modalAlmacen").prop({ required: true, disabled: false });
                    $("#modalTPago").prop({ required: false, disabled: true, selectedIndex: 0 });
                }
            });
            $("#modalAlmacen").on("change", function () {
                if ($(this).val() != 0) {
                    $("#modalProveedor").prop({ required: false, disabled: true, selectedIndex: 0 });
                    $("#modalTPago").prop({ disabled: true, selectedIndex: 0 });
                } else {
                    $("#modalProveedor").prop({ required: true, disabled: false });
                    $("#modalTPago").prop({ disabled: false });
                }
            });

            if (mov.idUP != null) $("#modalProveedor").val(mov.idUP).change();
            if (mov.idCG != null) $("#modalTPago").val(mov.idCG).change();
            if (mov.idUI != null) $("#modalAlmacen").val(mov.idUI).change();
            if (mov.obs != null) $("#observaciones").val(mov.obs);
            $("#cantidad").val(mov.pago);

            form.validation_form({ opc: "editPay" }, (datos) => {
                if ($("#modalProveedor").val() == 0) datos.append("id_UP", "");
                if ($("#modalAlmacen").val() == 0) datos.append("id_UI", "");
                if ($("#modalTPago").val() == 0) datos.append("id_CG", "");
                datos.append("idCompras", folio);
                send_ajax(datos, this._ctrl).then((data) => {
                    if (data === true) {
                        alert();
                        saldos();
                        this.tbPay();
                        $(".bootbox-close-button").click();
                    } else console.error(data);
                });
            });
        });
    }
    deletePay(folio) {
        this.remove({
            data: { opc: "deletePay", folio },
            method: (data) => {
                if (data) {
                    this.deleteRow("#" + folio);
                    saldos();
                    alert();
                }
            },
        });
    }
    // DATOS DE CONSULTAS
    async initConsultPays() {
        this.filterConsultPays();
        await this.balanceStorage();
        await this.tbStorage();
    }
    changeFilter() {
        const filter = $("#filterPay").val();
        if (filter == "A") {
            this.Container.removeClass("hide");
            this.tbStorage();
        } else {
            this.Container.addClass("hide");
            this.tbCosts();
        }
    }
    async filterConsultPays() {
        this.fillContainer.html("").create_elements([
            {
                lbl: "Filtro de consulta",
                elemento: "select",
                id: "filterPay",
                option: {
                    data: [
                        { id: "A", valor: "ALMACÉN" },
                        { id: "C", valor: "COSTOS" },
                    ],
                },
            },
        ]);

        $("#filterPay").on("change", () => this.changeFilter());
    }
    async balanceStorage() {
        this.balance = await this.fnDateUDN("balanceStorage", this.tbContainer);
        await this.callSaldos({
            titulo: "Saldo de almacén",
            clase: "balanceSuppliers",
            saldos: [{ valor: this.balance.initial }, { text: "Entradas", valor: this.balance.income }, { text: "Salidas", valor: this.balance.egress }, { valor: this.balance.final }],
        });
    }
    async tbStorage() {
        if (this.UDN.val() == 6) {
            this.lsInit = await this.fnDateUDN("tbStorageFZ", this.tbContainer);
            this.tbContainer.html("").create_table(this.structureTbStorageFZ());
        } else {
            this.lsInit = await this.fnDateUDN("tbStorage", this.tbContainer);
            this.tbContainer.html("").create_table(this.structureTbStorage());
        }
        // $("#tbStorage").tb_fixed(2);
        
        tableFixedExport('tbStorage','Consultas de almacen');
    }
    structureTbStorage() {
        let tbody = [];
        let incomeHTML = [];
        let egressHTML = [];
        let hrHTML = [];
        this.lsInit.list.income.forEach(() => hrHTML.push({ html: "" }));
        this.lsInit.list.income.forEach((tr) => incomeHTML.push({ html: this.format_number(tr), class: "fw-bold text-end" }));
        this.lsInit.list.egress.forEach((tr) => egressHTML.push({ html: this.format_number(tr), class: "fw-bold text-end" }));

        const icon = "<i class='icon-right-dir'></i>";
        this.lsInit.storage.forEach((tr) => {
            let initialStorage = [];
            let incomeStorage = [];
            let egressStorage = [];
            let finalStorage = [];
            let thfinalStorage = [];

            tr.data.forEach((row) => {
                thfinalStorage.push({ html: row.final, class: "fw-bold text-end" });
                initialStorage.push({ html: row.initial, class: "text-end" });
                incomeStorage.push({ html: row.income, class: "text-end" });
                egressStorage.push({ html: row.egress, class: "text-end" });
                finalStorage.push({ html: row.final, class: "text-end" });
            });

            tbody.push(
                [{ html: icon + tr.name, class: "fw-bold pointer", onclick: "showData('St" + tr.id + "')" }, { html: tr.final, class: "fw-bold text-end" }, ...thfinalStorage],
                [{ tr: { class: "hide St" + tr.id } }, { html: "Saldo inicial", class: "fst-italic" }, { html: tr.initial, class: "text-end" }, ...initialStorage],
                [{ tr: { class: "hide St" + tr.id } }, { html: "Entrada", class: "fst-italic" }, { html: tr.income, class: "text-end" }, ...incomeStorage],
                [{ tr: { class: "hide St" + tr.id } }, { html: "Salida", class: "fst-italic" }, { html: tr.egress, class: "text-end" }, ...egressStorage],
                [{ tr: { class: "hide St" + tr.id } }, { html: "Saldo final", class: "fst-italic" }, { html: tr.final, class: "text-end" }, ...finalStorage],
                [{ tr: { class: "bg-disabled4 hide St" + tr.id } }, { html: "", class: "" }, { html: "", class: "" }, ...hrHTML]
            );
        });

        tbody.push(
            [{ tr: { class: "bg-disabled4" } }, { html: "" }, { html: "" }, ...hrHTML],
            [{ html: "TOTAL ENTRADAS", class: "fw-bold" }, { html: this.balance.income, class: "fw-bold text-end" }, ...incomeHTML],
            [{ html: "TOTAL SALIDAS", class: "fw-bold pointer" }, { html: this.balance.egress, class: "fw-bold text-end" }, ...egressHTML]
        );

        return {
            table: { id: "tbStorage" },
            thead: "Almacen,Saldo," + this.lsInit.thDates,
            tbody,
        };
    }
    structureTbStorageFZ() {
        let tbody = [];
        let incomeHTML = [];
        let egressHTML = [];
        this.lsInit.list.income.forEach((tr) => incomeHTML.push({ html: this.format_number(tr), class: "fw-bold text-end" }));
        this.lsInit.list.egress.forEach((tr) => egressHTML.push({ html: this.format_number(tr), class: "fw-bold text-end" }));

        tbody.push(
            [{ html: "TOTAL ENTRADAS", class: "fw-bold" }, { html: this.balance.income, class: "fw-bold text-end" }, ...incomeHTML],
            [
                { html: "<i class='icon-right-dir'></i>TOTAL SALIDAS", class: "fw-bold pointer", onclick: "showData('allCosts')" },
                { html: this.balance.egress, class: "fw-bold text-end" },
                ...egressHTML,
            ]
        );

        this.lsInit.cost.forEach((tr) => {
            let costHTML = [];
            tr.fecha.forEach((val) => costHTML.push({ tr: { class: "hide allCosts" } }, { html: this.format_number(val), class: "text-end" }));
            tbody.push([{ tr: { class: "hide allCosts" } }, { html: tr.cost, class: "fst-italic" }, { html: this.format_number(tr.valor), class: "text-end" }, ...costHTML]);
        });

        return {
            table: { id: "tbStorage" },
            thead: "Almacen,Saldo," + this.lsInit.thDates,
            tbody,
        };
    }
    async tbCosts() {
        this.lsInit = await this.fnDateUDN("tbCosts", this.tbContainer);
        this.tbContainer.html("").create_table(this.structureCost());
        // $("#tbCost").tb_fixed(2);
        tableFixedExport('tbCost','Consultas de almacen');
    }
    structureCost() {
        const icon = '<i class="icon-right-dir"></i>';
        const tbody = [];
        let total = 0;

        this.lsInit.cost.forEach((tr) => {
            let totalHTML = [];
            let directoHTML = [];
            let costoHTML = [];
            let hrHTML = [];
            tr.dataDirecto.forEach((d) => directoHTML.push({ html: d, class: "text-end" }));
            tr.dataCosto.forEach((d) => costoHTML.push({ html: d, class: "text-end" }));
            tr.dataTotal.forEach((d) => totalHTML.push({ html: d, class: "text-end" }));
            tr.dataTotal.forEach((d) => hrHTML.push({ html: "" }));

            total += parseFloat(tr.total.replace(",", ""));
            tbody.push(
                [{ html: icon + tr.cost, class: "pointer fw-bold", onclick: "showData('cs" + tr.id + "')" }, { html: tr.total, class: "fw-bold text-end" }, ...totalHTML],
                [{ tr: { class: "hide cs" + tr.id } }, { html: tr.cost2 + " / costo Compras", class: "fst-italic" }, { html: tr.directo, class: "text-end" }, ...directoHTML],
                [{ tr: { class: "hide cs" + tr.id } }, { html: tr.cost2 + " / salidas almacén", class: "fst-italic" }, { html: tr.costo, class: "text-end" }, ...costoHTML],
                [{ tr: { class: "bg-disabled4 hide cs" + tr.id } }, { html: "" }, { html: "" }, ...hrHTML]
            );
        });

        let granTotalHTML = [];
        let totalDirectoHTML = [];
        let totalCostoHTML = [];
        let hrHTML = [];
        this.lsInit.dataTotal.forEach((d) => hrHTML.push({ html: "" }));
        this.lsInit.dataTotal.forEach((d) => granTotalHTML.push({ html: d, class: "text-end" }));
        this.lsInit.dataDirecto.forEach((d) => totalDirectoHTML.push({ html: d, class: "text-end" }));
        this.lsInit.dataCosto.forEach((d) => totalCostoHTML.push({ html: d, class: "text-end" }));

        tbody.push(
            [{ tr: { class: "bg-disabled4" } }, { html: "" }, { html: "" }, ...hrHTML],
            [{ html: icon + "TOTAL", class: "fw-bold pointer", onclick: "showData('csTotal')" }, { html: this.lsInit.total, class: "fw-bold text-end" }, ...granTotalHTML],
            [{ tr: { class: "hide csTotal" } }, { html: "Total costo compras", class: "fst-italic" }, { html: this.lsInit.directo, class: "text-end" }, ...totalDirectoHTML],
            [{ tr: { class: "hide csTotal" } }, { html: "Total salida almacén", class: "fst-italic" }, { html: this.lsInit.costo, class: "text-end" }, ...totalCostoHTML]
        );

        return {
            table: { id: "tbCost" },
            thead: "Costo,Saldo," + this.lsInit.thDates,
            tbody,
        };
    }
}
