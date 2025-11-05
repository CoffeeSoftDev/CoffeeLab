
/*-- Cuadro comparativo --*/
class cuadroComparativo extends Complements {

    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents() {
        this.crearFormato();
        this.tabsCostoVentas();
        this.filtroCuadroComparativo();
        //    --
        // this.lsCuadroComparativo();
        // this.lsVentasCosto();
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
          
            ]
        };

        this.createDivs({ data: json_grupos, div_content: 'tab-cuadro-comparativo' });// crear formato de reporte
    }

    lsCuadroComparativo() {

        this._idFilterBar = "filterCuadroComparativo";


        this._dataSearchTable = {

            tipo: "text",
            opc: "lsEstadoResultado",
            UDN: $("#UDNs").val(),
            Anio: $("#Anio").val(),
            Mes: $("#Mes").val(),
            Clasificacion: $("#Clasificacion").val(),

        };

        var ajax = this.searchTable({ id: "tab-estado-resultado", extends: true });

        ajax.then((data) => {

            $("#tab-estado-resultado").rpt_json_table2({

                data: data,
                id:'tbEstadoResult',
                f_size: "12",
                color_th: 'bg-primary',
                class: 'table text-uppercase table-bordered table-sm ',
                color_group: 'bg-disabled2',
                center: [1],
                right: [2, 3, 4],
                extends: true,
                folding:true

            });

            // data_table_scroll('tbEstadoResult');
            // allUnfold();
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
                opc: "select",
                id: "mensualidad",
                lbl: 'Periodo',
                class: "col-12 col-sm-3",
                data: [
                    { id: 12, valor: "12 Meses" },
                    { id: 18, valor: "18 Meses" },
                    { id: 24, valor: "24 Meses" },
                ]
            },
            {
                opc: "select",
                id: "promedioActivo",
                lbl: 'Tipo de costo',
                class: "col-12 col-sm-3",
                data: [
                    { id: 1, valor: "Costo Promedio" },
                    { id: 2, valor: "Costo Fijo" },

                ]
            },
            {
                opc: "btn",
                id: "btn",
                text: "Buscar",
                fn: "cuadro.lsCuadroComparativo()",
            }

        ];

        $('#filterCuadroComparativo').simple_json_content({ data: jsonFiltro, type: '' });

    }


    tabsCostoVentas() {

        let jsonTabCuadroComp = [
            
            {
                tab: "Estado de resultados",
                id: "tab-estado-resultado",
                active: true,// indica q pestaña se activara por defecto
            },

            {
                tab: "Ventas y costos",
                id: "tab-ventas-costos",
                fn: 'cuadro.lsVentasCosto()',
            },


        ];

        $("#tabsCuadroComparativo").simple_json_tab({ data: jsonTabCuadroComp });


    }

    updatePromedio(event){

    }




}


function data_table_scroll(idTable){

    $(`#${idTable}`).DataTable({
    
        responsive: true,
        bFilter: false,
        ordering: false,
        scrollY: "440px",
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        fixedColumns: true
    
    });
}

function unfold(id) {

    $(".unfold" + id).toggleClass("d-none");
    $(".ico" + id).toggleClass("icon-right-dir-1");
    $(".ico" + id).toggleClass(" icon-down-dir-1");
}

function allUnfold() {
    // Mostrar todos los elementos que contienen la clase 'unfold'
    $("[class*='unfold']").removeClass("d-none");

    // Asegurarse de que todos los iconos tengan la clase 'icon-down-dir-1' y no 'icon-right-dir-1'
    $("[class*='ico']").removeClass("icon-right-dir-1").addClass("icon-down-dir-1");

}