class TableroControl extends Complements {

    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents() {
        // this.createFormat();
        this.listTable();
    }

    listTable() {


        this._dataSearchTable = {
            tipo: "text",
            opc: "lsTableroControl",
            UDN: $("#UDNs").val(),
            Anio: $("#Anio").val(),
            Mes: $("#Mes").val(),
            Clasificacion: $("#Clasificacion").val(),

        };

        var ajax = this.searchTable({ id: "tab-tablero-control", extends: true });

        ajax.then((data) => {

            $("#tab-tablero-control").rpt_json_table2({
              
                data  : data,
                f_size: "12",
                right: [2,3,4]
            
            });
        });

    }

}


/*-- Cuadro comparativo --*/
class cuadroComparativo extends Complements {

    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents() {
        this.crearFormato();
        this.tabsCostoVentas();
        this.filtroCuadroComparativo();
        this.lsCuadroComparativo();
        this.lsVentasCosto();
    }

    crearFormato() {
        let json_grupos = {

            id: "contentCuadroComparativo",
            class: "col-12 line",

            contenedor: [

                {
                    id: "filterCuadroComparativo",
                    class: "col-12 mb-3 "
                },
                {
                    id: "tabsCuadroComparativo",
                    class: "col-12 mb-3 "
                },
                // {
                //     id: "listCuadroComparativo",
                //     class: "col-12 "
                // },



            ]
        };

        this.createDivs({ data: json_grupos, div_content: 'tab-cuadro-comparativo' });// crear formato de reporte
    }

    lsCuadroComparativo() {

        this._idFilterBar = "filterCuadroComparativo";

       
        this._dataSearchTable = {

            tipo         : "text",
            opc          : "lsEstadoResultado",
            UDN          : $("#UDNs").val(),
            Anio         : $("#Anio").val(),
            Mes          : $("#Mes").val(),
            Clasificacion: $("#Clasificacion").val(),

        };
        
        var ajax = this.searchTable({ id: "tab-estado-resultado", extends: true });

        ajax.then((data) => {

            $("#tab-estado-resultado").rpt_json_table2({

                data       : data,
                f_size     : "12",
                color_th   : 'bg-primary',
                class: 'table text-uppercase table-bordered table-sm ',
                color_group: 'default',
                center     : [1],
                right      : [2, 3, 4],
                extends: true,

            });
        });

    }

    lsVentasCosto() {

        this._idFilterBar = "filterCuadroComparativo";


        this._dataSearchTable = {

            tipo: "text",
            opc: "lsVentasCostos",
            UDN: $("#UDNs").val(),
            Anio: $("#Anio").val(),
            Mes: $("#Mes").val(),
            Clasificacion: $("#Clasificacion").val(),

        };

        var ajax = this.searchTable({ id: "tab-ventas-costos", extends: true });

        ajax.then((data) => {

            $("#tab-ventas-costos").rpt_json_table2({

                data: data,
                f_size: "12",
                color_th: 'bg-primary',
                class: 'table text-uppercase table-bordered table-sm ',
                color_group: 'default',
                center: [1],
                right: [2, 3, 4],
                extends: true,

            });
        });

    }


    filtroCuadroComparativo() {
       let jsonFiltro = [
        {
            opc  : "select",
            id   : "mensualidad",
            lbl  : 'Periodo',
            class: "col-12 col-sm-3",
            data : [
                {id:12, valor:"12 Meses"},
                {id:18, valor:"18 Meses"},
                {id:24, valor:"24 Meses"},
            ]
        },
           {
               opc: "select",
               id: "promedioActivo",
               lbl: 'Tipo de costo',
               class: "col-12 col-sm-3",
               data: [
                   { opc: 1, valor: "Costo Promedio" },
                   { opc: 2, valor: "Costo Bajo" },
               
               ]
           },
           {
            opc: "btn",
            id: "btn",
            text: "Buscar",
            fn: "cuadro.lsCuadroComparativo()",
           }

       ];

        $('#filterCuadroComparativo').simple_json_content({data:jsonFiltro, type: ''});

    }


    tabsCostoVentas(){

        let jsonTabCuadroComp = [
            {
                tab: "Estado de resultados",
                id: "tab-estado-resultado",
             

        
            },

            {
                tab: "Ventas y costos",
                id: "tab-ventas-costos",
                active: true,// indica q pestaña se activara por defecto

                fn: 'cuadro.lsVentasCosto()',
            },

        

        

        ];

        $("#tabsCuadroComparativo").simple_json_tab({ data: jsonTabCuadroComp });


    }




}
