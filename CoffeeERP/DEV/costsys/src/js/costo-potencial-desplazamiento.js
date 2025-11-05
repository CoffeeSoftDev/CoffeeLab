const api = "ctrl/ctrl-menu.php";

class UpdateCostoPotencial extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);

        this.PROJECT_NAME = "";

    }

    ls() {
        let rangePicker = getDataRangePicker("calendar" + this.PROJECT_NAME);

        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "list" + this.PROJECT_NAME, fi: rangePicker.fi, ff: rangePicker.ff },
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tb" + this.PROJECT_NAME,
                center: [1],
                right: [2],
                extends: true,
            },

        });
    }






}