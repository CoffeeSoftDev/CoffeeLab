class Contabilidad {
    #_iptCifra;
    #_btnSave;
    #_udn;
    #_dates;
    #_table;
    #_tbContainer;
    #_container;
    #_jsTable;
    #_lsInit;
    #_fillContainer;
    #_apertura;

    constructor(ctrl) {
        this._ctrl = ctrl;
        this.#_iptCifra = { elemento: "input-group", tipo: "cifra", disabled: true };
        this.#_btnSave = { elemento: "button", class: "btn btn-info col-12" };
    }
    get apertura() {
        return this.#_apertura;
    }
    set apertura(conta) {
        this.#_apertura = conta;
    }
    get fillContainer() {
        return $(this.#_fillContainer);
    }
    set fillContainer(valor) {
        this.#_fillContainer = valor;
    }
    get UDN() {
        return $(this.#_udn);
    }
    set UDN(udn) {
        this.#_udn = udn;
    }
    get Dates() {
        return $(this.#_dates);
    }
    set Dates(dates) {
        this.#_dates = dates;
    }
    get table() {
        return $(this.#_table);
    }
    set table(id) {
        this.#_table = id;
    }
    get lsInit() {
        return this.#_lsInit;
    }
    set lsInit(ls) {
        this.#_lsInit = ls;
    }
    get jsTable() {
        return this.#_jsTable;
    }
    set jsTable(js) {
        this.#_jsTable = js;
    }
    get iptCifra() {
        return this.#_iptCifra;
    }
    set iptCifra(json) {
        this.#_iptCifra = json;
    }
    get btnSave() {
        return this.#_btnSave;
    }
    set btnSave(json) {
        this.#_btnSave = json;
    }
    get Container() {
        return $(this.#_container);
    }
    set Container(container) {
        this.#_container = container;
    }
    get tbContainer() {
        return $(this.#_tbContainer);
    }
    set tbContainer(container) {
        this.#_tbContainer = container;
    }
    async fnDateUDN(options, before = "") {
        let dates = { date1: this.Dates.val() };

        if (this.Dates.val().length > 10) {
            const lsDates = this.Dates.valueDates();
            dates = {
                date1: lsDates[0],
                date2: lsDates[1],
            };
        }

        const datos = { opc: "", idE: this.UDN.val(), ...dates };
        if (typeof options === "string") datos.opc = options;
        const opt = Object.assign(datos, options ?? {});
        return await fn_ajax(opt, this._ctrl, before);
    }
    async fechasPermitidas(filtro) {
        this.apertura = await this.fnDateUDN({ opc: "fechasPermitidas", filtro });
        console.log(this.apertura);


        let notaText = "";
        let notaClass = "";
        let parentClass = "";
        if (this.apertura.retiro) {
            const text = filtro === 1 ? "retiro." : "reembolso.";
            notaText = '<i class="icon-attention"></i> Tesorería ya realizó un ' + text;
            notaClass = "text-danger text-info";
            parentClass = "bd-callout-danger";
        } else if (this.apertura.open && !this.apertura.retiro) {
            notaText = '<i class="icon-ok"></i> Este día se encuentrá abierto'+this.apertura.closed;
            notaClass = "text-success";
            parentClass = "bd-callout-success";
        } else {
            notaText = '<i class="icon-info"></i> Este día esta cerrado.';
            notaClass = "text-info";
            parentClass = "bd-callout-info";
        }

        $("#nota").removeClass("text-success text-danger text-info").addClass(notaClass).parent().removeClass("bd-callout-success bd-callout-danger bd-callout-info").addClass(parentClass);
        $("#nota").html(notaText);
        $(".nota").removeClass("hide");
    }
    async createContent($parent, options) {
        let defaults = [{ class: "col-12 line-2 mb-3" }];
        let opts = Object.assign(defaults, options);
        opts.forEach((attr) => $parent.append($("<div>", attr)));
        return $parent;
    }
    loadFormData(elementos) {
        //A partir de un array cargar elementos al contenedor
        for (const x in elementos) $("#" + x).create_elements(elementos[x]);
    }
    async mergeFormDivs($form, lsElements) {
        $form.find("div").each(function (i, div) {
            const idContainer = $(div).attr("id");
            let element = lsElements.find((item) => item.container === idContainer)?.elements || [];
            $(div).create_elements(element);
        });

        return $form;
    }
    createModal(options) {
        return new Promise((resolve) => {
            if ($(".bootbox").length === 0) {
                let $form = $("<form>", { novalidate: true, id: "mdlDefault", class: "row" });
                $form.create_elements([{ lbl: "Elemento", placeholder: "", required: true, div: { class: "col-12 mb-3" } }, { elemento: "modal_button" }]);

                let defaults = {
                    title: "Titulo",
                    form: $form,
                    size: "medium",
                    close: false,
                };

                let opts = Object.assign(defaults, options);

                bootbox.dialog({
                    title: opts.title,
                    message: opts.form,
                    size: opts.size,
                    closeButton: opts.close,
                    onShown: function () {
                        if ($("#mdlDefault").length > 0) {
                            $("#mdlDefault").validation_form({ opc: "opc" }, (datos) => {
                                for (const x of datos) console.log(x);
                            });
                        }
                        resolve(opts.form);
                    },
                });

                if (typeof opts.fn === "function") opts.fn.call(this);
            }
        });
    }
    async createModal2(options) {
        const form = createForm();

        let defaults = {
            opc: "php",
            log: false,
            title: "Titulo",
            form: form,
            elements: [{ lbl: "Hola mundo" }],
            size: "medium",
            close: false,
            fn: null,
            ajax: true,
        };

        let opts = Object.assign(defaults, options);

        bootbox.dialog({
            title: opts.title,
            message: opts.form,
            size: opts.size,
            closeButton: opts.close,
        });

        opts.elements.push({ elemento: "modal_button" });
        form.create_elements(opts.elements);

        if (typeof opts.fn === "function") opts.fn.call(this);

        const waitValidation = () => {
            return new Promise((resolve, reject) => {
                form.validation_form({ opc: opts.opc }, async (datos) => {
                    if (datos) {
                        if (opts.log == true) for (const x of datos) console.log(x);

                        if (opts.ajax == true) {
                            datos = await send_ajax(datos, this._ctrl);
                            if (datos != true) console.error(datos);
                        }

                        resolve(datos);
                    } else reject(new Error("La validación falló"));
                });
            });
        };

        try {
            const datos = await waitValidation();
            return datos;
        } catch (error) {
            console.error("Error en la validación del formulario:", error);
        }
    }
    createForm(options) {
        const defaults = {
            class: "row",
            id: "dfForm",
            novalidate: true,
        };
        const attr = Object.assign(defaults, options);
        return $("<form>", attr);
    }
    attrElement(elements) {
        for (const x in elements) $(x).attr(elements[x]);
    }
    float(number) {
        return parseFloat(number.replace(",", ""));
    }
    dropdown(options) {
        let defaults = [
            { icon: "icon-pencil", text: "Editar", fn: "alert('Editar')" },
            { icon: "icon-trash", text: "Eliminar", fn: "alert('Eliminar')" },
        ];

        let opts = options != undefined ? options : defaults;

        const $container = $("<div>", { class: "dropdown" });

        const $button = $("<button>", {
            class: "btn btn-aliceblue btn-sm",
            id: "dropdownMenu",
            type: "button",
            "data-bs-toggle": "dropdown",
            "aria-expanded": "false",
            html: '<i class="icon-dot-3 text-info"></i>',
        });
        const $ul = $("<ul>", { class: "dropdown-menu", "aria-labelledby": "dropdownMenu" });

        opts.forEach((m) => {
            let html = m.icon != "" ? `<i class="text-info ${m.icon}"></i> ` : "<i class='icon-minus'></i>";
            html += m.text != "" ? m.text : "";

            const $a = $("<a>", { ...m, class: "pt-1 pb-1 pointer dropdown-item", onclick: m.fn, html });
            const $li = $("<li>").append($a);
            $ul.append($li);
        });

        $container.append($button, $ul);
        return $container.prop("outerHTML");
    }
    number_format(num, decimales, puntoDecimal, miles) {
        if (typeof num == "string") num = num.replace(",", "").replace("$", "").replace("%", "").replace(" ", "").trim();

        num = Number(num || 0).toFixed(decimales);

        puntoDecimal = puntoDecimal || ".";
        miles = miles || ",";

        var partes = num.toString().split(".");
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, miles);

        return partes.join(puntoDecimal);
    }
    format_number(number, prefix = "$", decimals = 2) {
        // Validamos si number es numérico y quitamos posibles espacios en blanco
        if (typeof number == "string") number = number.replace(",", "").replace("$", "").replace("%", "").replace(" ", "").trim();

        const num = parseFloat(number);
        number = typeof num === "number" && !isNaN(num) ? number : 0;

        // convertimos a decimal
        // Verificamos si el número es muy pequeño y se muestra como 0.00
        // Si el número es muy pequeño, devolvemos el guion (-) sin el icono
        // Math.abs devuelve el valor absoluto de un numero convirtiendolo en positivo
        if (number >= 0 && Math.abs(number) < 0.01) return "-";

        // Le damos formato al número
        number = this.number_format(number, decimals, ".", ",");
        return prefix == "$" ? "$ " + number : number + " %";
    }
    async remove(options) {
        const defaults = {
            alert: { icon: "question", title: "¿Desea eliminar permanentemente este movimiento?" },
            data: {},
            method: () => {},
        };

        const opts = options != undefined ? Object.assign({}, defaults, options) : defaults;

        const result = await alert(opts.alert);

        if (result.isConfirmed) {
            const data = await fn_ajax(opts.data, this._ctrl);
            if (typeof opts.method === "function") opts.method(data);
        }
    }
    deleteRow(valor, idTable = "") {
        const table = idTable != "" ? $("#" + idTable).DataTable() : this.table.DataTable();
        table.rows().every(function () {
            const data = this.data();
            if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] === valor.toString()) {
                        this.remove(); //Eliminar la fila adecuada
                        break;
                    }
                }
            }
        });
        table.draw(); // Redibujar la tabla para aplicar los cambios
    }
    strCapitalice(string) {
        string = typeof string === "string" ? string.toLowerCase() : "";

        let result = "";
        let capitalizeNext = true;

        for (let i = 0; i < string.length; i++) {
            if (capitalizeNext && /[a-záéíóúüñ]/i.test(string.charAt(i))) {
                result += string.charAt(i).toUpperCase();
                capitalizeNext = false;
            } else result += string.charAt(i);

            if (/[\p{P}\p{S}]/u.test(string.charAt(i))) capitalizeNext = true;
        }
        return result;
    }
    async createContainer(options) {
        let div = { div: { class: "col-12 col-sm-6 mb-3" } };
        let atrSelect = { elemento: "select", class: "text-uppercase", ...div };
        const defaults = {
            plugin: "create_elements",
            container: "div",
            elements: [
                {
                    container: "div1",
                    elements: [
                        {
                            lbl: "Proveedor",
                            name: "id_UP",
                            id: "modalProveedor",
                            option: { data: [], placeholder: "- Seleccionar -" },
                            ...atrSelect,
                            div: { class: "col-12 mb-3" },
                        },
                        { lbl: "Clase de insumo", name: "id_UI", id: "modalCInsumo", option: { data: [], placeholder: "- Seleccionar -" }, ...atrSelect },
                        { lbl: "Insumo", name: "id_UG", id: "modalInsumo", elemento: "select", disabled: true, ...atrSelect },
                    ],
                },
                {
                    container: { tipo: "div", attr: { id: "div2" } },
                    elements: [
                        { lbl: "Salida de compra", name: "id_CG", id: "modalTCompra", required: true, option: { data: [], placeholder: "- Seleccionar -" }, ...atrSelect },
                        { lbl: "Tipo de pago", name: "id_TP", id: "modalTPago", disabled: true, option: { data: [], placeholder: "- Seleccionar -" }, ...atrSelect },
                        { lbl: "Subtotal", name: "Gasto", elemento: "input-group", tipo: "cifra", required: true, ...div },
                        { lbl: "Impuesto", name: "GastoIVA", elemento: "input-group", tipo: "cifra", ...div },
                        { lbl: "No. Factura o nota", name: "id_F", id: "modalFactura", option: { data: [], placeholder: "-Factura-" }, ...atrSelect },
                        { lbl: "Comprobante", name: "comprobante", elemento: "input", type: "file", ...div },
                    ],
                },
                {
                    container: { class: "col-12 mb-3", id: "div3" },
                    elements: [{ lbl: "Observaciones", name: "Observacion", elemento: "textarea", div: { class: "col-12 mb-3" } }, { elemento: "modal_button" }],
                },
            ],
        };

        const opts = options ?? defaults;
        let objQuery = opts.container ?? "form";
        let attr = { class: "row" };

        if (typeof objQuery === "string") {
            if (objQuery === "form") attr.novalidate = true;
        } else if (typeof opts.container === "object") {
            objQuery = opts.container.tipo;
            attr = Object.assign(attr, opts.container.attr);
            if (opts.container.tipo === "form") attr.novalidate = true;
        }

        const $parent = $("<" + objQuery + ">", attr);
        opts.elements.forEach((e) => {
            let $container = null;
            objQuery = "div";
            attr = { class: "col-12" };

            if (typeof e.container === "string") attr.id = e.container;
            else if (typeof e.container === "object") {
                objQuery = e.container.tipo ?? objQuery;
                attr = Object.assign(attr, e.container.attr ?? e.container);
            }

            $container = $("<" + objQuery + ">", attr);

            const plugin = opts.plugin ?? "create_elements";
            $container[plugin](e.elements);
            $parent.append($container);
        });

        return $parent;
    }
    async callSaldos(options) {
        const defaults = {
            parent: "",
            btn: { icon: "icon-dollar", text: "Ver Saldos", color: "btn-outline-warning" },
            titulo: "Saldos",
            clase: "saldos",
            saldos: [
                { text: "Saldo inicial", idValor: "si", valor: 0.0, color: "info" },
                { text: "Ingresos", idValor: "ing", valor: 0.0, color: "warning" },
                { text: "Egresos", idValor: "egr", valor: 0.0, color: "success" },
                { text: "Saldo final", idValor: "sf", valor: 0.0, color: "info" },
            ],
        };

        let opts = this.mergeDeep({}, defaults);
        if (options) opts = this.mergeDeep(defaults, options);

        let countArray = 0;
        options.saldos.forEach((e) => (countArray += Object.keys(e).length > 0 ? 1 : 0));

        const parent = $("<div>", { class: "row row-cols-1 row-cols-sm-2 row-cols-lg-" + countArray + " m-0 p-0" });

        const divTitle = $("<div>", { class: "col-12 col-sm-12 col-md-12 col-lg-12 d-none d-sm-block " + opts.clase });
        const title = $("<label>", { class: "fw-bold fst-italic text-muted text-uppercase mt-2 mb-2", html: opts.titulo });
        divTitle.append(title);

        const divButton = $("<div>", { class: "col-12 m-0 mb-1 d-block d-sm-none" });
        const button = $("<button>", {
            class: "btn btn-sm col-12 " + opts.btn.color,
            html: '<i class="' + opts.btn.icon + '"></i> ' + opts.btn.text,
            onclick: "(function(){ $('." + opts.clase + "').toggleClass('d-block d-none'); })()",
        });

        divButton.append(button);
        parent.append(divButton, divTitle);

        opts.saldos.forEach((c, index) => {
            if (Object.keys(options.saldos[index]).length > 0) {
                const content = $("<div>", { class: "col mb-2 d-none d-sm-block " + opts.clase });
                const call = $("<div>", { class: "bd-callout bd-callout-" + c.color + " d-flex p-2 bd-highlight align-items-center m-0" });
                const text = $("<label>", { text: c.text });
                const valor = $("<label>", { class: "ms-auto fw-bold fs-5", text: c.valor, id: c.idValor });
                call.append(text, valor);
                content.append(call);
                parent.append(content);
            }
        });

        if (this.Container) this.Container.html(parent);
        else $("#" + opts.parent).html(parent);
    }
    createBdCallout(parent, options) {
        parent.html('');
        options.forEach((c, index) => {
            if (Object.keys(options[index]).length > 0) {
                // Crear contenedor de la columna
                const content = $("<div>", { 
                    class: `col mb-2 d-none d-sm-block ${options.clase}`
                });
    
                // Crear el callout de Bootstrap
                const call = $("<div>", { 
                    class: `bd-callout bd-callout-${c.color} d-flex p-2 bd-highlight align-items-center m-0` 
                });
    
                // Crear elementos de texto y valor
                const text = $("<label>", { text: c.text });
                const valor = $("<label>", { 
                    class: "ms-auto fw-bold fs-5", 
                    text: c.valor, 
                    id: c.idValor ?? ''
                });
    
                // Agregar elementos al callout y luego al contenido
                call.append(text, valor);
                content.append(call);
    
                // Añadir al contenedor padre
                parent.append(content);
            }
        });
    }
    
    mergeDeep(target, source) {
        const isObject = (obj) => obj && typeof obj === "object";

        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                this.mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }

        return target;
    }
}

function tableFixedExport(id, fileName) {
    $(`#${id}`).DataTable({
        scrollX: true,
        scrollY: "500px",
        scrollCollapse: true,
        ordering: false,
        responsive: false, // IMPORTANTE: fixedColumns NO es compatible con responsive:true
        paging: false,
        searching: false,
        info: false,
        keys: false,
        autoWidth: false,
        fixedColumns: {
            left: 2,
        },
        columnDefs: [
            { targets: "_all", width: "100px" },
            { targets: [0, 1], width: "150px", className: "bg-aliceblue" },
        ],
        dom: "Bfrtip", // Aquí activas los botones
        buttons: [
            {
                extend: "excelHtml5",
                text: "Exportar a Excel",
                title: fileName + " " + $("#cbUDN option:selected").text().toLowerCase(),
                className: "btn btn-success btn-md",
                customizeData: function (data) {
                    // Modificar cada celda de cada fila
                    data.body.forEach(function (row, rowIndex) {
                        row.forEach(function (cell, colIndex) {
                            // Convertir "-" a vacío
                            if (cell === "-") {
                                row[colIndex] = "0";
                            }

                            // Convertir valores numéricos de string a número
                            const maybeNumber = cell.replace(/[$,]/g, "").trim(); //limpia simbolos no númericos
                            if (!isNaN(maybeNumber) && maybeNumber !== "") {
                                row[colIndex] = Number(maybeNumber);
                            }
                        });
                    });
                },
            },
        ],
    });
}
