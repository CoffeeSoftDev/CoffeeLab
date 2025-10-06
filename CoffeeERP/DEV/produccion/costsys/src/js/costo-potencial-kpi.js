





class kpis extends Complements {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents() {
       
        // this.lsKpi();
    }




    lsKpi() {
        this._dataSearchTable = {
            tipo: "text",
            opc: "listKPI",
        };

        this.attr_table = {
            color_th: "bg-primary",
            right: [2,3,4],
            color_col: [2,3]
        };

      

        this.searchTable({ id: 'tab-kpi'});

        // ajax.then((data) => {
        // //     $("#contentDataIngresos").rpt_json_table2({
        // //         data: data,
        // //         f_size: "12",
        // //     });
        // });
    }
  
}
