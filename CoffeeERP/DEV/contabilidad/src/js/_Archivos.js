class Archivos extends Contabilidad {
    #_lsFiles;
    constructor(ctrl) {
        super(ctrl);
    }
    get lsFiles() {
        return this.#_lsFiles;
    }
    set lsFiles(valor) {
        this.#_lsFiles = valor;
    }
    async filterFiles() {
        const filter = [
            { id: "ING", valor: "INGRESOS" },
            { id: "TES", valor: "TESORERIA" },
            { id: "GAS", valor: "COMPRAS" },
            { id: "PAG", valor: "PAGOS" },
        ];
        this.Container.html("").create_elements([{ lbl: "Tipo de archivo", id: "filterFile", elemento: "select", option: { data: filter } }]);
    }
    async files() {
        await this.changeDate();
        this.Dates.off("change").on("change", () => this.changeDate());
        this.UDN.off("change").on("change", () => this.changeDate());
    }
    async changeDate() {
        await this.fechasPermitidas(4);
        await this.filterFiles();
        await this.tbFiles();
        this.changeFilter();
    }
    async changeFilter() {
        $("#filterFile")
            .off("change")
            .on("change", async () => await this.tbFiles());
    }
    async tbFiles() {
        const filtro = $("#filterFile").val();
        const data = await this.fnDateUDN({ opc: "lsFiles", filtro }, this.tbContainer);

        const thead = "archivos,fecha,descargar";
        let tbody = [];
        console.log(data);
        data.forEach((tr) => {
            const DOM = new URL(window.location.href).origin + "/";

            const href = tr.ruta.includes("erp_files") ? DOM + tr.ruta + tr.archivo : DOM + "ERP/" + tr.ruta + tr.archivo;

            const btnView = $("<a>", {
                class: "btn btn-sm btn-outline-success",
                target: "_blank",
                title: "Descargar",
                html: '<i class="icon-eye"></i>',
                href,
            });

            const btnDownload = $("<a>", {
                class: "btn btn-sm btn-outline-info",
                target: "_blank",
                title: "Descargar",
                download: tr.titulo,
                html: '<i class="icon-download"></i>',
                href,
            });

            let btnDelete = "";
            if (getCookies()['IDE'] != 8 && this.apertura && this.apertura.open) {
                const btn = $("<button>", {
                    class: "btn btn-sm btn-outline-danger",
                    title: "Eliminar ",
                    html: '<i class="icon-trash"></i>',
                    onclick: "deleteFile(" + tr.id + ")",
                });
                btnDelete = btn.prop("outerHTML");
            }

            let btn = btnDownload.prop("outerHTML") + btnView.prop("outerHTML") + btnDelete;
            if (getCookies()["IDE"] == "8") btn = btnDownload.prop("outerHTML");

            tbody.push([{ html: tr.titulo ?? tr.archivo }, { html: tr.fecha, class: "text-center" }, { html: btn, class: "text-center" }]);
        });

        this.tbContainer.html("").create_table({
            table: { id: "tbFiles" },
            thead,
            tbody,
        });
        $("#tbFiles").table_format();
    }
    async deleteFile(id) {
        const result = await alert({ icon: "question", title: "¿Desea eliminar permanentemente este archivo?" });

        if (result.isConfirmed) {
            const data = await fn_ajax({ opc: "deleteFile", id }, this._ctrl);
            if (data === true) this.tbFiles();
        }
    }
}
