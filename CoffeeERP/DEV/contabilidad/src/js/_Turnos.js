class Turnos extends Contabilidad {
    constructor(ctrl) {
        super(ctrl);
    }
    render() {
        this.layout();
        this.Dates.off("change").on("change", () => this.changeFilter());
    }
    async layout() {
        this.lsInit = await this.fnDateUDN("init");
        this.form();
        this.balance();
        this.tbTurns();
    }
    form() {
        const form = $("<form>", { id: "formTurns", novalidate: true, class: "col-12 m-0 p-0" });
        const col12 = { div: { class: "col-12 mb-3" } };

        const ventas = this.lsInit.ventas.map((v) => ({ ...col12, ...this.iptCifra, name: "idUV_" + v.id, lbl: v.valor, disabled: false }));
        const impuestos = this.lsInit.impuestos.map((v) => ({ ...col12, ...this.iptCifra, name: "idUI_" + v.id, lbl: v.valor, disabled: false }));

        form.create_elements([
            { ...col12, lbl: "Turnos", elemento: "select", name: "turno", option: { data: this.lsInit.turnos } },
            { ...col12, lbl: "Jefes de turno", elemento: "select", name: "id_Employed", option: { data: this.lsInit.jefes } },
            { ...col12, ...this.iptCifra, lbl: "Suites", name: "suite", icon: "#", disabled: false, required: true },
            ...ventas,
            ...impuestos,
            { ...col12, ...this.btnSave, lbl: "Guardar", type: "submit", onclick: "turn.saveTurno()", class: "btn btn-primary col-12" },
        ]);

        this.Container.html("").append(form);
    }
    balance() {
        this.createBdCallout(this.tbContainer, this.lsInit.saldos);
    }
    tbTurns() {
        this.tbContainer.create_table(this.lsInit.bitacora);
        this.tbContainer.find("table").table_format({
            info: false,
            searching: false,
            paging: false,
        });
    }
    async changeFilter() {
        this.lsInit = await this.fnDateUDN("changeFilter");
        this.balance();
        this.tbTurns();
    }
    async removeTurn(id) {
        const result = await alert({ icon: "question", text: "¿Esta seguro de eliminar este registro?" });

        if (result.isConfirmed) {
            this.lsInit = await this.fnDateUDN({ opc: "removeTurn", id });

            if (this.lsInit.success === true) {
                this.balance();
                this.tbTurns();
            }
        }
    }
    saveTurno() {
        $("#formTurns").off("submit");
        $("#formTurns").validation_form({ opc: "saveBitacora", date1: this.Dates.val() }, async (datos) => {
            $("#formTurns").find("[type='submit']").prop("disabled", true);
            this.lsInit = await send_ajax(datos, this._ctrl);
            $("#formTurns").find("[type='submit']").prop("disabled", false);
            if (this.lsInit.success === true) {
                this.balance();
                this.tbTurns();
                $("#formTurns")[0].reset();
            } else console.error(this.lsInit.success);
        });
    }
}
