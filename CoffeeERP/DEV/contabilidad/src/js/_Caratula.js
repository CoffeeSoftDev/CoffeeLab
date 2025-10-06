class Caratula extends Contabilidad {
    #_caja;
    constructor(ctrl) {
        super(ctrl);
    }
    get caja() {
        return this.#_caja;
    }
    set caja(valor) {
        this.#_caja = $(valor);
    }
    async caratula() {
        this.lsInit = await this.fnDateUDN("caratula", this.Container);
        const content = [
            { class: "col-12", id: "caja" },
            { class: "col-12", id: "saldo" },
            { class: "col-12 col-md-6", id: "ingresos" },
            { class: "col-12 col-md-6", id: "descuentos" },
            { class: "col-12 col-md-6", id: "impuestos" },
            { class: "col-12 col-md-6", id: "totales" },
            { class: "col-12 col-md-6", id: "anticipos" },
            { class: "col-12 col-md-6", id: "bancos" },
            { class: "col-12", id: "gastosFondo" },
            { class: "col-12", id: "almacen" },
            { class: "col-12", id: "costos" },
            { class: "col-12", id: "creditos" },
        ];
        await this.createContent(this.Container.html(''), content);
        await this.caja();
        await this.saldos();
        await this.ingresos();
        await this.descuentos();
        await this.impuestos();
        await this.totales();
        await this.anticipos();
        await this.bancos();
        await this.gastosFondo();
        await this.almacen();
        await this.costos();
        await this.creditos();
    }
    async caja() {
        let tbody = [];
        const datos = this.lsInit.caja;
        for (const x in datos) {
            let concepto = x;
            let ingreso = Array.isArray(datos[x]) ? datos[x][0] : datos[x];
            let egreso = Array.isArray(datos[x]) ? datos[x][1] : 0;
            tbody.push([
                { html: concepto, class: "" },
                { html: this.format_number(ingreso), class: "text-end" },
                { html: this.format_number(egreso), class: "text-end" },
            ]);
        }

        $("#caja").html("").create_table({
            thead: "CONCEPTO,INGRESO,EGRESO",
            tbody,
        });
    }
    async saldos() {
        const datos = this.lsInit.saldo;

        let tbody = [];
        for (const x in datos) {
            tbody.push(
                [{ html: x, colspan: 4, class: "text-center fw-bold" }],
                [
                    { html: datos[x][0], class: "text-end" },
                    { html: datos[x][1], class: "text-end" },
                    { html: datos[x][2], class: "text-end" },
                    { html: datos[x][3], class: "text-end" },
                ]
            );
        }

        $("#saldo").html("").create_table({
            thead: "Saldo inicial, ingreso, egreso, saldo final",
            tbody,
        });
    }
    async ingresos() {
        let tbody = [];
        const datos = this.lsInit.ingreso;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 2 }]);
        for (const x in datos) tbody.push([{ html: x }, { html: datos[x], class: "text-end" }]);

        $("#ingresos").html("").create_table({
            thead: "Ingreso, Saldo",
            tbody,
        });
    }
    async descuentos() {
        let tbody = [];
        const datos = this.lsInit.descuentos;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 2 }]);
        for (const x in datos) tbody.push([{ html: x }, { html: datos[x], class: "text-end" }]);

        $("#descuentos").html("").create_table({
            thead: "descuentos, Saldo",
            tbody,
        });
    }
    async impuestos() {
        let tbody = [];
        const datos = this.lsInit.impuestos;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 2 }]);
        for (const x in datos) tbody.push([{ html: x }, { html: datos[x], class: "text-end" }]);

        $("#impuestos").html("").create_table({
            thead: "impuestos, Saldo",
            tbody,
        });
    }
    async totales() {
        let tbody = [];
        const datos = this.lsInit.totales;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 2 }]);
        for (const x in datos) tbody.push([{ html: x }, { html: datos[x], class: "text-end" }]);

        $("#totales").html("").create_table({
            thead: "CONCEPTO, TOTAL",
            tbody,
        });
    }
    async bancos() {
        let tbody = [];
        const datos = this.lsInit.bancos;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 2 }]);
        for (const x in datos) tbody.push([{ html: x }, { html: datos[x], class: "text-end" }]);

        $("#bancos").html("").create_table({
            thead: "BANCO, TOTAL",
            tbody,
        });
    }
    async anticipos() {
        let tbody = [];
        const datos = this.lsInit.anticipos;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 2 }]);

        for (const x in datos) tbody.push([{ html: x }, { html: datos[x], class: "text-end" }]);

        $("#anticipos").html("").create_table({
            thead: "ANTICIPOS, TOTAL",
            tbody,
        });
    }
    async gastosFondo() {
        let tbody = [];
        const datos = this.lsInit.gastosFondo;
        tbody.push(datos["tr1"]);
        tbody.push(datos["tr2"]);

        delete datos.tr1;
        delete datos.tr2;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 4 }]);

        for (const x in datos) tbody.push(datos[x]);

        $("#gastosFondo")
            .html("")
            .create_table({
                thead: [{ html: "COMPRAS FONDO FIJO", colspan: 4 }],
                tbody,
            });
    }
    async almacen() {
        let tbody = [];
        const datos = this.lsInit.almacen;
        tbody.push(datos["tr1"]);
        tbody.push(datos["tr2"]);

        delete datos.tr1;
        delete datos.tr2;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 4 }]);

        for (const x in datos) tbody.push(datos[x]);

        $("#almacen")
            .html("")
            .create_table({
                thead: [{ html: "almacén", colspan: 4 }],
                tbody,
            });
    }
    async costos() {
        let tbody = [];
        const datos = this.lsInit.costos;
        tbody.push(datos["tr1"]);
        tbody.push(datos["tr2"]);

        delete datos.tr1;
        delete datos.tr2;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 4 }]);

        for (const x in datos) tbody.push(datos[x]);

        $("#costos")
            .html("")
            .create_table({
                thead: [{ html: "costos", colspan: 4 }],
                tbody,
            });
    }
    async creditos() {
        let tbody = [];
        const datos = this.lsInit.creditos;
        tbody.push(datos["tr1"]);

        delete datos.tr1;

        if (Object.keys(datos).length == 0) tbody.push([{ html: "Ningún dato disponible en esta tabla", class: "text-center fst-italic", colspan: 4 }]);

        for (const x in datos) tbody.push(datos[x]);

        $("#creditos")
            .html("")
            .create_table({
                thead: [{ html: "clientes", colspan: 4 }],
                tbody,
            });
    }
}
