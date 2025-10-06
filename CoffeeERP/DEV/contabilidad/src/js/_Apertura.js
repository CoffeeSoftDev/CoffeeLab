class Apertura extends Contabilidad {
    constructor(ctrl) {
        super(ctrl);
    }
    async filterApertura() {
        this.Container.html("").create_elements([
            {
                lbl: "Historial",
                id: "cbHistory",
                elemento: "select",
                option: {
                    data: [
                        { id: "1", valor: "UDN's desbloqueadas" },
                        { id: "0", valor: "Historial de aperturas" },
                    ],
                },
            },
            {
                lbl: "Rango de fecha",
                id: "cbDate",
                elemento: "input-group",
                icon: '<i class="icon-calendar"></i>',
                pos: "r",
                readonly: true,
                div: { class: "mb-3 col-12 col-sm-6 col-md-4 col-lg-3 hide", id: "hDate" },
            },
            {
                lbl: "<i class='icon-lock-open'></i> Apertura",
                elemento: "button",
                btncolor: "btn-info",
                onclick: "openTabs()",
            },
            {
                lbl: "<i class='icon-clock'></i> Horario de cierre",
                elemento: "button",
                btncolor: "btn-info",
                onclick: "outhours()",
            },
        ]);
    }
    aperturas() {
        this.filterApertura();
        this.tbAperturas();

        this.Dates = "#cbDate";
        this.dateRange("cbDate", () => this.tbHistory());

        $("#cbHistory")
            .off("change")
            .on("change", () => {
                $("#hDate").toggleClass("hide");
                if ($("#cbHistory").val() == 1) this.tbAperturas();
                else this.tbHistory();
            });
    }
    async formOpenTabs() {
        let jsonUDN = await fn_ajax({ opc: "listUDN" }, this._ctrl);

        const jsonTabs = [
            { id: 1, valor: "Ingresos" },
            { id: 2, valor: "Compras" },
            { id: 3, valor: "Pagos y Salidas" },
            { id: 5, valor: "Clientes" },
            { id: 4, valor: "Archivos" },
        ];

        const col12 = { div: { class: "col-12 mb-3" } };

        const elements = [
            {
                lbl: "Unidad de negocio",
                name: "id_UDN",
                id: "ctrlUDN",
                elemento: "select-group",
                icon: '<i class="icon-toggle-off"></i>',
                span: { class: "input-group-text btn btn-outline-info", onclick: "allSelectGroupMultiple('ctrlUDN')" },
                required: true,
                multiple: true,
                option: { data: jsonUDN, placeholder: "- SELECCIONAR -" },
                ...col12,
            },
            {
                lbl: "Pestañas de sobres",
                name: "Pestana",
                id: "ctrlTabs",
                elemento: "select-group",
                icon: '<i class="icon-toggle-off"></i>',
                span: { class: "input-group-text btn btn-outline-info", onclick: "allSelectGroupMultiple('ctrlTabs')" },
                required: true,
                multiple: true,
                option: { data: jsonTabs, placeholder: "- SELECCIONAR -" },
                ...col12,
            },
            { lbl: "Rango de fechas", readonly: true, name: "Fecha", id: "iptDate", class: "text-center", elmento: "input-group", icon: "<i class='icon-calendar'></i>", pos: "right", ...col12 },
            { lbl: "Motivo de apertura", name: "observaciones", elemento: "textarea", required: true, ...col12 },
            { elemento: "modal_button" },
        ];

        const form = this.createForm();
        form.create_elements(elements);
        return form;
    }
    async openTabs() {
        const form = await this.createModal({ form: await this.formOpenTabs(), title: "Apertura de sobres" });

        this.dateRange("iptDate");

        $("#ctrlUDN").option_select({ select2: true, father: true, group: true });
        $("#ctrlTabs").option_select({ select2: true, father: true, group: true });

        form.validation_form({ opc: "newOpen" }, async (datos) => {
            const data = await send_ajax(this.validationNewOpen(datos), this._ctrl);

            if (data === true) {
                alert();
                this.tbAperturas();
                $(".bootbox-close-button").click();
            } else console.error(data);
        });
    }
    validationNewOpen(datos) {
        const udn = $("#ctrlUDN").val().join(",");
        const tabs = $("#ctrlTabs").val().join(",");
        datos.delete("id_UDN");
        datos.delete("Pestana");
        datos.append("id_UDN", udn);
        datos.append("Pestana", tabs);
        return datos;
    }
    dateRange(id, fn) {
        $("#" + id).daterangepicker(
            {
                startDate: moment().subtract(1, "days"),
                endDate: moment().subtract(1, "days"),
                showDropdowns: true,
                parentEl: ".bootbox",
                ranges: {
                    Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
                    "Últimos 2 días": [moment().subtract(2, "days"), moment().subtract(1, "days")],
                    "Últimos 4 días": [moment().subtract(4, "days"), moment().subtract(1, "days")],
                    "Últimos 7 días": [moment().subtract(8, "days"), moment().subtract(1, "days")],
                    "Cierre de mes": [moment().subtract(1, "month").endOf("month").subtract(1, "days"), moment().subtract(1, "month").endOf("month")],
                },
            },
            fn
        );
    }
    async tbAperturas() {
        this.jsTable = await fn_ajax({ opc: "tbAperturas" }, this._ctrl, this.tbContainer);

        this.tbContainer.html("").create_table(this.structureTbApertura());
        this.table.table_format({ paging: false, info: false, ordering: false, searching: false });
        const table = this.table.DataTable();
        table.column(0).visible(false);
        table.column(1).visible(false);
        table.column(2).visible(false);
    }
    structureTbApertura() {
        let tbody = [];
        const icon = '<i class="icon-right-dir"></i>';

        const btnOff = $("<button>", {
            class: "btn btn-sm btn-outline-danger",
            html: '<i class="icon-lock"></i>',
            onClick: "closedUDN('0')",
        });

        const thead = "udn,tap,id,Apertura,Bloqueo " + btnOff.prop("outerHTML");

        // Crear un map de datos
        let map = new Map();
        this.jsTable.forEach((e) => map.set(e.udn, e.idE));
        // Convertir el map en un array iterable
        const idEUnique = Array.from(map, ([udn, idE]) => ({ udn, idE }));

        idEUnique.forEach((e) => {
            btnOff.attr({ class: "btn btn-sm btn-outline-info", onclick: "closedUDN(1)" });
            tbody.push([
                { html: e.idE },
                { html: "" },
                { html: "" },
                { html: icon + e.udn, class: "fw-bold fst-italic pointer", onclick: "showData('tab" + e.idE + "'); hideData('hudn" + e.idE + "');" },
                { html: btnOff.prop("outerHTML"), class: "text-center" },
            ]);

            map = new Map();
            this.jsTable.filter((t) => t.idE == e.idE).forEach((e) => map.set(e.tab, e.idT));
            const tabUnique = Array.from(map, ([tab, idT]) => ({ tab, idT }));

            tabUnique.forEach((t) => {
                btnOff.attr({ class: "btn btn-sm btn-outline-success", onclick: "closedUDN(2)" });
                tbody.push([
                    { tr: { class: "hide tab" + e.idE } },
                    { html: e.idE },
                    { html: t.idT },
                    { html: "" },
                    { html: icon + t.tab, class: "fst-italic pointer", onclick: "showData('date" + t.idT + e.idE + "')" },
                    { html: btnOff.prop("outerHTML"), class: "text-center" },
                ]);

                const dateUDNTab = this.jsTable.filter((x) => x.idE == e.idE && x.idT == t.idT);
                dateUDNTab.forEach((f) => {
                    btnOff.attr({ class: "btn btn-sm btn-outline-warning", onclick: "closedUDN(3)" });
                    tbody.push([
                        { tr: { class: "hide date" + t.idT + e.idE + " hudn" + e.idE } },
                        { html: e.idE },
                        { html: t.idT },
                        { html: f.id },
                        { html: f.date, class: "fst-italic text-center" },
                        { html: btnOff.prop("outerHTML"), class: "text-center" },
                    ]);
                });
            });
        });

        this.table = "#tbApertura";
        return {
            table: { id: "tbApertura" },
            thead,
            tbody,
        };
    }
    async searchPestana() {
        let self = this;

        const table = this.table.DataTable();

        return new Promise((resolve, reject) => {
            this.table.on("click", "button", function () {
                try {
                    const tr = $(this).closest("tr");

                    if (tr.length && !$(this).closest("th").length) {
                        const row = table.row(tr);
                        const rowData = row.data();

                        let title = rowData[3];

                        if (rowData[2] != "") {
                            const date = rowData[3].split("-");
                            title = date[2] + "-" + date[1] + "-" + date[0];
                        }

                        self.lsInit = { idE: rowData[0], idTap: rowData[1], idApertura: rowData[2], title };
                        resolve();
                    } else {
                        self.lsInit = { idE: 0, idTap: 0, idApertura: 0, title: "todas" };
                        resolve();
                    }
                } catch (error) {
                    reject(error); // Rechaza la promesa en caso de error
                }
            });
        });
    }
    async closedUDN(mod) {
        await this.searchPestana();

        let title = "¿Desea bloquear ";
        let concepto = this.lsInit.title.replace('<i class="icon-right-dir"></i>', "").trim();
        switch (mod.toString()) {
            case "1":
                title += "las fechas de <b>" + concepto + "</b>?";
                break;
            case "2":
                title += "las fechas de <b>" + concepto + "</b>?";
                break;
            case "3":
                title += "esta fecha <br><b>" + concepto + "</b>?";
                break;
            default:
                title += "<b>" + concepto + "</b> las fechas abiertas?";
                break;
        }

        this.remove({
            alert: { icon: "question", title },
            data: { opc: "closeTab", ...this.lsInit },
            method: (data) => {
                if (data === true) {
                    alert();
                    this.tbAperturas();
                } else console.error(data);
            },
        });
    }
    async tbHistory() {
        this.jsTable = await this.fnDateUDN("tbHistory");
        this.tbContainer.html("").create_table(this.structureTbHistory());
        this.table.table_format();
    }
    structureTbHistory() {
        let tbody = [];
        this.table = "#tbHistory";
        console.log(this.jsTable);

        this.jsTable.forEach((tr) => {
            tbody.push([
                { html: tr.udn, class: "text-center" },
                { html: tr.pestana, class: "text-center" },
                { html: tr.fecha },
                { html: tr.apertura, class: "text-center" },
                { html: tr.bloqueo, class: "text-center" },
                { html: tr.motivo },
            ]);
        });

        return {
            table: { id: "tbHistory" },
            thead: "UDN,PESTANA,FECHA,APERTURA,BLOQUEO,MOTIVO",
            tbody,
        };
    }
    formHours() {
        const meses = [
            { id: 1, valor: "Enero" },
            { id: 2, valor: "Febrero" },
            { id: 3, valor: "Marzo" },
            { id: 4, valor: "Abril" },
            { id: 5, valor: "Mayo" },
            { id: 6, valor: "Junio" },
            { id: 7, valor: "Julio" },
            { id: 8, valor: "Agosto" },
            { id: 9, valor: "Septiembre" },
            { id: 10, valor: "Octubre" },
            { id: 11, valor: "Noviembre" },
            { id: 12, valor: "Diciembre" },
        ];

        const horas = [
            { id: 9, valor: "09:00 am" },
            { id: 10, valor: "10:00 am" },
            { id: 11, valor: "11:00 am" },
            { id: 12, valor: "12:00 pm" },
            { id: 13, valor: "01:00 pm" },
            { id: 14, valor: "02:00 pm" },
            { id: 15, valor: "03:00 pm" },
            { id: 16, valor: "04:00 pm" },
            { id: 17, valor: "05:00 pm" },
            { id: 18, valor: "06:00 pm" },
            { id: 19, valor: "07:00 pm" },
            { id: 20, valor: "08:00 pm" },
            { id: 21, valor: "09:00 pm" },
        ];

        const form = this.createForm();
        const col6 = { div: { class: "mb-3 col-12 col-md-6" }, required: true };
        form.create_elements([
            { lbl: "Mes", elemento: "select", name: "mes", option: { data: meses, placeholder: "- Seleccionar -" }, ...col6 },
            { lbl: "Horario de cierre", elemento: "select", id: "hrs", name: "hora", option: { data: horas, placeholder: "- Seleccionar -" }, ...col6 },
            { elemento: "modal_button" },
        ]);
        return form;
    }
    async outhours() {
        this.lsInit = await this.fnDateUDN("listHrs");
        const form = await this.createModal({ form: this.formHours(), title: "Horarios de cierre" });

        $("#mes").on("change", () => $("#hrs").val(this.lsInit.filter((m) => m.id == $("#mes").val())[0]["hrs"]));

        form.validation_form({ opc: "updateHrs" }, async (datos) => {
            const data = await send_ajax(datos, this._ctrl);
            if (data === true) alert();
            else console.error(data);
        });
    }
}
