class Conceptos extends Contabilidad {
    constructor(ctrl) {
        super(ctrl);
    }

    async filterConceptos() {
        const lsUDN = await fn_ajax({ opc: "listUDN" }, this._ctrl);

        const lsConceptos = [
            { id: "ing", valor: "INGRESOS" },
            { id: "des", valor: "DESCUENTOS" },
            { id: "imp", valor: "IMPUESTOS" },
            { id: "mon", valor: "MONEDAS" },
            { id: "ban", valor: "BANCOS" },
            { id: "cli", valor: "CLIENTES" },
            { id: "pro", valor: "PROVEEDORES" },
            { id: "cin", valor: "CLASES DE INSUMOS" },
            { id: "ins", valor: "INSUMOS" },
        ];

        this.Container.html("").create_elements([
            { lbl: "Unidad de negocio", id: "cbUDN", elemento: "select", option: { data: lsUDN } },
            { lbl: "Filtro por concepto", id: "cbFiltro", elemento: "select", option: { data: lsConceptos } },
            { lbl: '<i class="icon-plus"></i> Nuevo concepto', elemento: "button", onclick: "addConcept()" },
        ]);
    }

    async conceptos() {
        await this.filterConceptos();
        this.tbConceptos();
        $("#cbFiltro, #cbUDN")
            .off("change")
            .on("change", () => this.tbConceptos());
    }

    async tbConceptos() {
        this.jsTable = await fn_ajax({ opc: "tbConceptos", idE: $("#cbUDN").val(), filtro: $("#cbFiltro").val() }, this._ctrl);
        this.tbContainer.html("").create_table(this.structureConceptos());
    }
    structureConceptos() {
        const filtro = $("#cbFiltro").val();

        let tbody = [];

        const btnToggle = $("<button>", { class: "btn btn-sm btn-outline-danger", html: '<i class="icon-toggle-on"></i>' });
        const btnEdit = $("<button>", { class: "btn btn-sm btn-outline-info", html: '<i class="icon-pencil"></i>' });

        let thead = filtro == "mon" ? "Concepto,Abreviatura,$MXN,Opciones" : filtro == "cin" ? "Concepto,Descripcion,Opciones" : "Concepto,Opciones";
        let colspan = filtro == "mon" ? 4 : filtro == "cin" ? 3 : 2;

        const lsData = this.jsTable.filter((z) => z.filtro == filtro)[0]["list"];

        lsData.forEach((e) => {
            let buttons = "";
            let trDisabled = [];

            if (e.stado == 0) {
                btnToggle.html('<i class="icon-toggle-off"></i>');
                buttons = btnToggle.prop("outerHTML");
                trDisabled.push({ tr: { class: "bg-disabled1" } });
            } else {
                buttons = btnEdit.prop("outerHTML") + btnToggle.prop("outerHTML");
            }

            if (filtro == "mon") {
                tbody.push([
                    ...trDisabled,
                    { html: e.valor, class: "text-center" },
                    { html: e.icon, class: "text-center" },
                    { html: this.format_number(e.mxn), class: "text-center" },
                    { html: buttons, class: "text-center" },
                ]);
            } else if (filtro == "cin") {
                tbody.push([...trDisabled, { html: e.valor }, { html: e.nota, class: "text-center" }, { html: buttons, class: "text-center" }]);
            } else {
                tbody.push([...trDisabled, { html: e.valor }, { html: buttons, class: "text-center" }]);
            }
        });

        this.table = "#tbConcepto";
        return {
            table: { id: "tbConcepto" },
            thead,
            tbody,
        };
    }

    // AGREGAR CONCEPTO
    addConcept() {
        const filtro = $("#cbFiltro").val();
        const col12 = { div: { class: "col-12 mb-3" } };
        const col6 = { div: { class: "col-6 mb-3" } };
        let elements = [];
        let title = "";
        switch (filtro) {
            case "ing":
                title = "Nuevo ingredente";
                elements = [{ ...col12, lbl: "Nuevo ingrediente" }];
                break;
            case "des":
                title: "Nuevo descuento o cortesía";
                elements = [
                    {
                        ...col12,
                        lbl: "Descuento o cortesía",
                        elemento: "select",
                        option: {
                            data: [
                                { id: "1", valor: "Descuento" },
                                { id: "2", valor: "Cortesía" },
                            ],
                        },
                    },
                    { ...col12, lbl: "Concepto", elemento: "input-group", icon: "Descuentos en" },
                ];
                break;
            case "imp":
                title = "Nuevo impuesto";
                elements = [{ ...col12, lbl: "Nuevo impuesto" }];
                break;
            case "mon":
                title = "Nueva moneda extranjera";
                elements = [
                    { ...col12, lbl: "Nueva moneda" },
                    { ...col6, lbl: "Abreviatura" },
                    { ...col6, lbl: "Valor", elemento: "input-group", tipo: "cifra" },
                ];
                break;
            case "ban":
                title = "Nuevo banco";
                elements = [{ ...col12, lbl: "Nuevo Banco" }];
                break;
            case "cli":
                title = "Nuevo cliente";
                elements = [{ ...col12, lbl: "Nuevo cliente" }];
                break;
            case "pro":
                title = "Nuevo proveedor";
                elements = [{ ...col12, lbl: "Nuevo proveedor" }];
                break;
            case "cin":
                title = "Nueva clase de insumo";
                elements = [{ ...col12, lbl: "Nuevo " }];
                break;
            case "ins":
                title = "Nuevo insumo";
                elements = [
                    { ...col12, lbl: "Clase de insumo", elemento: "select", option: "" },
                    { ...col12, lbl: "Nuevo " },
                ];
                break;
        }

        this.createModal2({ opc: "php", title, log: true, ajax: false, elements });
    }
}
