

let appSoft = {};
const ctrl_Soft = 'ctrl/ctrl-app-soft-restaurant.php';
const url_file = 'ctrl/ctrl-subir-ventas.php';
class AppSoftRestaurant extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents() {
        this.listTable();
    }

    modalProductosVendidos() {

        bootbox.dialog({
            title: 'Registros',
            size: 'large',
            message: '<div class=" mb-3" id="filterRegistros"></div><div id="contentVentas"></div>',
            closeButton: true,
        });

        // view.
        this.createLayaout();


    }


    createLayaout() {

        // add tabs

        let jsonTabs = [
            {
                tab: "Productos vendidos",
                id: "productos_vendidos",
                // fn: 'historial.listHistorial()',

                active: true,
            },

            {
                tab: "Ventas",
                id: "ventas",
                fn: 'appSoft.lsVentas()',

            },

            {
                tab: "Bitacora",
                id: "bitacora",
                fn:'appSoft.lsBitacora()',
                contenedor:[
                    {id:'listBitacora',class:'col-8 block'},
                    {id:'contentBitacora',class:'col-4 block'},
                ],
            },
            {
                tab: "KPI",
                id: "tab-kpi",
                fn: 'appSoft.lsKPI()'
            },
        ];

        $("#contentVentas").simple_json_tab({ data: jsonTabs });

        // add filter

        let jsonFilter = [
            {
                opc: "input-group",
                id: "iptSoftFecha",

                icon: "icon-calendar-2",
                class: "col-12 col-sm-6 col-lg-4",
            },

            {
                opc: "btn",
                id: "btnVer",
                tipo: "texto",
                text: "<i class='icon-search-3'></i>",
                
                class: "col-12 col-sm-6 col-lg-2",
                fn: "appSoft.lsProductosVendidos()",
                color_btn: "outline-secondary",
            },
            {
                opc: "btn",
                text: "<i class='icon-print'></i>",
                id: "btnImprimir",
                color_btn: "outline-info",
                fn: "appSoft.ImprimirReporte()",
                class: "col-12 col-sm-6 col-lg-2",
            },

            {
                opc: "input-file",
                text: "Subir",
                id: "btnSubir",
                color_btn: "primary",
                fn: "appSoft.SubirArchivo()",
                class: "col-12 col-sm-6 col-lg-2",
            },

            {
                opc: "btn",
                text: "Guardar",
                id: "btnGuardar",
                color_btn: "outline-success",
                fn: "appSoft.openSobre()",
                class: "col-12 col-sm-6 col-lg-2",
            },


         
        ];


        $("#filterRegistros").simple_json_content({ data: jsonFilter, type: "" });

        // custom:
        dataPicker({

            parent: 'iptSoftFecha',
            // success: () => { appSoft.lsProductosVendidos(); },
            daterangepicker: {
                singleDatePicker: true,
                showDropdowns: true,

                locale: {
                    format: "YYYY-MM-DD",
                }

            }
        });

        this.lsProductosVendidos();
        this.lsBitacora();

    }

    lsBitacora() {

        this.createTable({

            parent: 'listBitacora',
            idFilterBar: 'filterRegistros',

            data: {
                opc: 'lsBitacora',
                udn: $('#UDNs').val()
            },

            conf: {
                datatable:false,
           
            },

            attr: {
                id:'tbListBitacora',
                color_th: 'bg-primary',
                f_size:14,
                center:[1,2],
                right:[3,4]
            },


        });

    }

    lsProductosVendidos() {

        this.createTable({

            parent: 'productos_vendidos',
            idFilterBar: 'filterRegistros',
            data: {
                opc: 'lsProductosVendidos',
                udn: $('#UDNs').val()

            },

            conf: { datatable: false },

            attr: {
                color_th: 'bg-primary',
                class: 'table table-bordered table-sm',
                f_size: '12',
                right: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            },


        });
    }

    lsVentas(){
        this.createTable({

            parent: 'ventas',
            idFilterBar: 'filterRegistros',
            data: {
                opc: 'lsVentas',
                udn: $('#UDNs').val()

            },

            conf: { datatable:false },

            attr: {
                color_th: 'bg-primary',
                class_table: 'table table-bordered table-sm table-striped',
                center:[2,3],
                right: [ 4, 5, 6, 7, 8, 9, 10, 11, 12]
            },

        });
    }

    addVentas(idfolio){


        let dtx = { 
            opc: 'addVentas' ,
            udn: $('#UDNs').val(),
            folio: idfolio,
            fecha_archivo: $('#fecha_'+idfolio).text()
        };

        fn_ajax(dtx, this._link, "#contentBitacora").then((data) => {

            $('#contentBitacora').rpt_json_table2({
                data:data,
                f_size:14,
                right:[2],
                class: 'table table-bordered table-sm table-striped text-uppercase',
                color_group:'bg-disabled2'
            });

        });
    }


    lsKPI(){
        this.createTable({

            parent: 'tab-kpi',
            idFilterBar: 'filterRegistros',
            data: {
                opc: 'lsKPI',
                UDNs: $('#UDNs').val()
            
            },

            conf: {
                datatable:true,
                fn_datatable: 'export_data_table'

            },

            attr: {
                class: 'table table-bordered table-sm text-uppercase table-striped',
                center: [1,2,4,7],
                right:[5,6]
            },

        });
    }

    // extras.

    ImprimirReporte() {
        var divToPrint = document.getElementById("productos_vendidos");
        var html =
            "<html><head>" +
            '<link href="../src/plugin/bootstrap-5/css/bootstrap.min.css" rel="stylesheet" type="text/css">' +
            '<link href="../src/css/navbar.css" rel="stylesheet" type="text/css">' +
            '<body style="background-color:white;" onload="window.print();   ">' +
            divToPrint.innerHTML +
            "</body></html>";

        // window.close();

        var popupWin = window.open();
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    SubirArchivo() {
        var InputFile = document.getElementById("btnSubir");

        var file = InputFile.files;
        var data = new FormData();
        let cant_file = file.length;

        for (let i = 0; i < file.length; i++) {
            data.append("excel_file" + i, file[i]);
        }

        data.append("udn", $("#UDNs").val());
        data.append("fecha_archivo", $("#iptSoftFecha").val());

        form_data_ajax(data, url_file, "#productos_vendidos").then((data) => {

            this.lsVentas();

            $("#productos_vendidos").rpt_json_table2({
                data: data,
                class: 'table table-bordered table-sm ',
                f_size: "12",
                // color_col:[5],
                center: [1, 3],
                right: [4, 8],
                extends: true
            });

            // $('#ventas').rpt_json_table2({ 
            //     data: data.grupos,
            //     f_size: 12,
            //     id: 'exportTABLE',
            //     extends: true 
            // });


            // data_table_export('#exportTABLE');


            
            document.getElementById("btnSubir").value = "";

            // toast.emptyNotifications();
            // toast.getNotifications();
            // toast.updateNotificationCount();

        });
    }

    openSobre() {
        $('.bootbox.modal').modal('hide');
    }

}




function dataPicker(options) {

    let defaults = {
        parent: 'iptCalendar',
        success:()=>{ console.warn() },

        daterangepicker: {

            startDate: moment().subtract(6, 'days'),
            endDate: moment(),
            showDropdowns: true,

            ranges: {
                "Prox 7 days": [moment(), moment().subtract(-7, "days")],
                "Prox 15 days": [moment(), moment().subtract(-15, "days")],
                "Mes actual": [moment().startOf("month"), moment().endOf("month")],
                "Mes prox": [
                    moment().subtract(-1, "month").startOf("month"),
                    moment().subtract(-1, "month").endOf("month"),
                ],
                "AÑO actual": [moment().startOf("year"), moment().endOf("year")],
            },

            locale: {
                format: "YYYY-MM-DD",
            }

        }

    };

    const settings = { ...defaults, ...options };

    $("#" + settings.parent).daterangepicker(settings.daterangepicker,function(start,end,label){
        settings.success();
    });
}

