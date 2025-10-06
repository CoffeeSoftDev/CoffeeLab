
class Destajo extends Templates{

    constructor(link, div_modulo) {
        super(link, div_modulo)
    }

    initComponents() {
        this.filterBarDestajo();
    }


    crearFormatoDestajo() {
        let json_grupos = {

            id: "grupo",
            class: "col-12",

            contenedor: [

                {
                    id: "ingresos",
                    class: "col-12  "
                },
                {
                    id: "content-mermas",
                    class: "col-12 "
                },

                {
                    id: "content-colaborador",
                    class: "col-12 "
                },

            ]
        };

        this.createDivs({ data: json_grupos, div_content: 'contentDataGrupos' });// crear formato de reporte
    }

    filterBarDestajo() {

        const data = [

            {
                opc: 'input-calendar',
                id: 'date',
                class: 'col-12 col-lg-2 col-sm-3'
            },

            {
                opc: 'btn',
                id: 'btnDestajo',
                text: 'Buscar',
                class: 'col-12 col-lg-2 col-sm-3',

                fn: 'destajo.listDestajo()'
            },

            {
                opc      : 'btn',
                id       : 'btnImprimir',
                text     : '<i class="icon-print"></i> Imprimir',
                class    : 'col-12 col-lg-2 col-sm-3',
                color_btn: 'outline-primary',
                fn       : 'destajo.printReport()'

            },

        ];


        this.createfilterBar({ data: data, parent: 'filterBarDestajo' });




        // obj.filterBar('filterBarDestajo');
        range_picker_now('date');

        this.listDestajo();



    }

    listDestajo() {

        const conf = {
            class: 'table table-bordered table-sm table-striped',
            color_th: "bg-primary",
            center: [4],
            right: [2, 3],

        };

        this.useAjax({

            idFilterBar: 'jsonForm',
            parent:'contentDataGrupos',
            data: { opc: 'lsDestajo', date: $('#date').val()},
            conf:{beforeSend:true},
            
            success:(data) => {

                this.crearFormatoDestajo();

                collector = data.folio;

                $('#ingresos').rpt_json_table2({ 
                   ...conf,
                    f_size:'12',
                    data: data.listVentas 
                })

                $('#content-mermas').rpt_json_table2({
                    data: data.listMermas,
                   ...conf
                })
                
                $('#content-colaborador').rpt_json_table2({
                    data: data.listPagoColaborador,
                   ...conf,
                    ipt: [2, 3, 4, 5, 6, 7],
                    
                    //         class: 'table table-bordered table-sm m-0 ',
                            color_group: 'bg-disabled2',
                    //         id: 'tb_pagoColaborador',
                    //         f_size: '12'
                })

                
            }



        });

   
        // let dtx = {
        //     tipo: "text",
        //     opc: "lsIngresos",
        //     date: $("#date").val(),
        // }

        // fn_ajax(dtx, link, "#contentDataGrupos").then((data) => {

       



        //     //    var ajax = this.searchTable({ id: "contentDataGrupos", extends: true });

        //     //    ajax.then((data) => {

        //     this.crearFormatoDestajo();

   

        //     $('#controlMermas').rpt_json_table2({
        //         data: data.controlMermas,
        //         class: 'table table-bordered table-sm table-striped ',
        //         color_th: "bg-primary",

        //         right: [2, 3, 4, 5],
        //         f_size: '12'
        //     });

        //     $('#merma').rpt_json_table2({
        //         data: data.pagoColaborador,
        //         color_th: "bg-primary",

        //         right: [2, 3, 4, 5, 6, 7, 8],
      
        //     });

        //     eventoTabla('tb_pagoColaborador');



        // });

    }


}


class FormatoDestajo extends Complements {

    constructor(link, div_modulo) {
        super(link, div_modulo)
    }

    initComponents() {

        this.crearFormatoDestajo();
    }

    



    listDestajo() {

  

        let dtx = {
            tipo: "text",
            opc: "lsIngresos",
            date: $("#date").val(),
        }

        fn_ajax(dtx, link, "#contentDataGrupos").then((data) => {

            collector = data.folio;



            //    var ajax = this.searchTable({ id: "contentDataGrupos", extends: true });

            //    ajax.then((data) => {

            this.crearFormatoDestajo();

            $('#ingreso').rpt_json_table2({
                data: data.ventasArea,
                color_th: "bg-primary",
                grupo: "bg-disabled2",
                class: 'table table-bordered table-sm table-striped',

                f_size: "12",
                center:[4],
                right: [2, 3],
            });

            $('#controlMermas').rpt_json_table2({
                data: data.controlMermas,
                class: 'table table-bordered table-sm table-striped ',
                color_th: "bg-primary",

                right: [2, 3, 4, 5],
                f_size: '12'
            });

            $('#merma').rpt_json_table2({
                data: data.pagoColaborador,
                color_th: "bg-primary",

                right: [2, 3, 4, 5, 6, 7, 8],
                ipt: [2, 3, 4, 5, 6, 7],
                class: 'table table-bordered table-sm m-0 ',
                color_group: 'bg-disabled2',
                id: 'tb_pagoColaborador',
                f_size: '12'
            });

            eventoTabla('tb_pagoColaborador');



        });

    }

    printReport() {

        let dtx = {
            tipo: "text",
            opc: "lsIngresos",
            date: $("#date").val(),
        }

        fn_ajax(dtx, link, "#contentDataGrupos").then((data) => {

            collector = data.folio;



            //    var ajax = this.searchTable({ id: "contentDataGrupos", extends: true });

            //    ajax.then((data) => {

            this.crearFormatoDestajo();

            $('#ingreso').rpt_json_table2({
                data: data.ventasArea,
                color_th: "bg-primary",
                grupo: "bg-disabled2",
                class: 'table table-bordered table-sm table-striped',

                f_size: "14",
                center: [4],
                right: [2, 3],
            });

            $('#controlMermas').rpt_json_table2({
                data: data.controlMermas,
                class: 'table table-bordered table-sm table-striped ',
                color_th: "bg-primary",

                right: [2, 3, 4, 5],
                f_size: '14'
            });

            $('#merma').rpt_json_table2({
                data: data.pagoColaborador,
                color_th: "bg-primary",

                right: [2, 3, 4, 5, 6, 7, 8],
                ipt: [2, 3, 4, 5, 6, 7],
                class: 'table table-bordered table-sm ',
                color_group: 'bg-disabled2',
                id: 'tb_pagoColaborador',
                f_size: '12'
            });

            eventoTabla('tb_pagoColaborador');


            var divToPrint = document.getElementById("contentDataGrupos");

            var html =
                "<html><head>" +
                '<link href="../../src/plugin/bootstrap-5/css/bootstrap.min.css" rel="stylesheet" type="text/css">' +
                '<link href="../../src/css/navbar.css" rel="stylesheet" type="text/css">' +
                '<link href="https://www.plugins.erp-varoch.com/style.css" rel="stylesheet" type="text/css">' +
                '<body style="background-color:white;" onload="window.print(); window.close();  ">' +
                divToPrint.innerHTML +
                "</body></html>"

            var popupWin = window.open();

            popupWin.document.open();
            popupWin.document.write(html);
            popupWin.document.close();

        });


      
    }


    
   reabrirTicket(id) {

    this.swalQuestion({
        opts: {
            title: '¿Deseas reabrir el ticket ?',
        },
        data: {
            opc: 'reabrirTicket',
            id: id


        },
        methods: {
            request: (data) => {

                lsFolios();


            }
        }

    });
}

}



/* -- TAB DESTAJO -- */

function lsDestajo() {



    obj.dataSearchTable = {
        tipo: "text",
        opc: "rptGeneral",
        date: $("#iptDate").val(),
    };

    var ajax = obj.searchTable({  extends: true });




}

function StrTotal(total) {

    if (total == "-") {
        return 0;
    } else {
        return parseFloat(total.replace(/\$/g, "").replace(/,/g, ""));
    }

}

function eventoTabla(idTable) {

    $("#" + idTable + " input[type='text']").on("input", function () {

        var tr      = $(this).closest("tr");
        var columna = $(this).closest("td").index() + 1;  // Sumamos 1 porque los índices comienzan desde 0
        let idRow   = $(this).attr("id_row");
        let name    = $(this).attr("name");
        
        totalGrupo = 0;

        let totalxColumna =0;

        $("#" + idTable + " tbody tr").each(function () {

            var valor        = $(this).find("td input[id_row=" + idRow + "]:eq(" + (columna - 2) + ")").val();
            var valorColumna = $(this).find("td input:eq(" + (columna - 2) + ")").val();

            if (valor) {
                totalGrupo += parseFloat(valor);
            }

            if (valorColumna) {
                totalxColumna += parseFloat(valorColumna);
                console.log('total Columna',totalxColumna);
            }

        });

        $('#total' + name + idRow).text('$ ' + totalGrupo.toFixed(2));


        /*   -- calcular total general -- */

        let totalDestajo      = StrTotal($('#totalpagodestajo' + idRow).text());
        let totalDiasFestivos = StrTotal($('#totalDiasExtras' + idRow).text());
        let totalFonacot      = StrTotal($('#totalFonacot' + idRow).text());
        let totalInfonavit    = StrTotal($('#totalInfonavit' + idRow).text());
        let totalMaterial     = StrTotal($('#totalperdidaMaterial' + idRow).text());
        let totalPrestamos    = StrTotal($('#totalprestamoPersonal' + idRow).text());


        let totalX = totalDestajo - totalDiasFestivos - totalFonacot - totalInfonavit - totalMaterial - totalPrestamos;
        
      

        $('#totalPago' + idRow).text('$ ' + totalX);


        let data = {
            opc: "pagoColaborador",
            [name]: $(this).val(),
            id_Colaborador: $(this).attr("id"),
            id_Pago: collector.idPago
        };


        // Formulas para el calculo de destajo:


        let destajo      = tr.find('td input').eq(0).val();
        let diasFestivos = tr.find('td input').eq(1).val();
        let Fonacot      = tr.find('td input').eq(2).val();
        let Infonavit    = tr.find('td input').eq(3).val();
        let material     = tr.find('td input').eq(4).val();
        let prestamos    = tr.find('td input').eq(5).val();



        let pago = destajo - diasFestivos - Fonacot - Infonavit - material - prestamos;


        tr.find('td').eq(7).text(pago);
        tr.find('td').eq(7).addClass('text-end');

        const listConceptos = ['pagodestajo', 'DiasExtras', 'perdidaMaterial', 'Fonacot', 'Infonavit', 'prestamoPersonal', 'Pago'];

        listConceptos.forEach((element, index) => {

            let frances = StrTotal($(`#total${element}1`).text());
            let pasteleria = StrTotal($(`#total${element}2`).text());
            let bizcocho = StrTotal($(`#total${element}4`).text());

            let total = frances + pasteleria + bizcocho;


            $(`#total${element}5`).html('$ ' + total.toFixed(2)).addClass('text-end');
        });

        // upd / insert registros:

        simple_send_ajax(data, link, "").then((data) => { });



    });

   

    //     var tr      = $(this).closest("tr");
    //     var columna = tr.find('td input').eq(this).index();









    //     // Sumar la columna 

    //     let total = 0;
    //     let col = columna;












    //     // //     let totalGral = totalColumna(idTable, 5);
    //     // //     $('#txtTotal').html(totalGral);

    //     // });


    // });
}