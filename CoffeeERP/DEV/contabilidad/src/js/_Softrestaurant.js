let appSoft = {};
const ctrl_Soft = 'ctrl/_Softrestaurant.php';
const url_file  = 'ctrl/ctrl-subir-ventas.php';

class AppSoftRestaurant extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents() {
        this.listTable();
    }

    modalProductosVendidos() {
        const title = $('#cbUDN option:selected').text();

        bootbox.dialog({
            title: title,
            size: 'large',
            message: '<div class=" mb-3" id="filterRegistros"></div><div id="contentVentas"></div>',
            closeButton: false,
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
                text: "Aceptar",
                id: "btnGuardar",
                color_btn: "success",
                fn: "appSoft.openSobre()",
                class: "col-12 col-sm-6 col-lg-2",
            },


         
        ];


        $("#filterRegistros").simple_json_content({ data: jsonFilter, type: "" });

      // Initializer :
        this.dataPicker({ parent: 'iptSoftFecha', type: 'simple'});


        this.lsProductosVendidos();
        this.lsBitacora();

    }

     dataPicker(options) {
    let defaults = {
        parent: "iptCalendar",

        type: "all",

        rangepicker: {
            startDate: moment().startOf("month"),
            endDate: moment(),

            showDropdowns: true,
            autoApply: true,

            locale: {
                format: "DD-MM-YYYY",
            },

            ranges: {
                Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
                Antier: [moment().subtract(2, "days"), moment().subtract(2, "days")],
                "Mes actual": [moment().startOf("month"), moment()],
                "Mes anterior": [
                    moment().subtract(1, "month").startOf("month"),
                    moment().subtract(1, "month").endOf("month"),
                ],
            },

            function(start, end) {
                onDateRange(start, end);
            },
        },

        rangeDefault: {
            singleDatePicker: true,
            showDropdowns: true,
            autoApply: true,

            locale: {
                format: "DD-MM-YYYY",
            },
        },

        onSelect: (start, end) => {
            console.log(
                `Seleccionado: ${start.format("YYYY-MM-DD")} - ${end.format(
                    "YYYY-MM-DD"
                )}`
            );
        },
    };

    let onDateRange = (start, end) => {
        console.log(start, end);
    };

    const settings = { ...defaults, ...options };
    // Configurar el comportamiento según el tipo
    if (settings.type === "all") {
        $("#" + settings.parent).daterangepicker(
            settings.rangepicker,
            function (start, end) {
                settings.onSelect(start, end);
            }
        );
    } else if (settings.type === "simple") {
        $("#" + settings.parent).daterangepicker(
            settings.rangeDefault,
            function (start, end) {
                // Llamar a la función personalizada al seleccionar una fecha
                settings.onSelect(start, end);
            }
        );
    }

  
}

    lsBitacora() {

        this.createTable({

            parent: 'listBitacora',
            idFilterBar: 'filterRegistros',

            data: {
                opc: 'lsBitacora',
                udn: $('#cbUDN').val()
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
                udn: $('#cbUDN').val()

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
                udn: $('#cbUDN').val()

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
            udn: $('#cbUDN').val(),
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
                udn: $('#cbUDN').val()
            
            },

            conf: {
                datatable:false,
                fn_datatable: 'export_data_table'

            },

            attr: {
                class: 'table table-bordered table-sm text-uppercase table-striped',
                center: [1,2,3,4],
                right:[5,6,7,8,9,10]
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
        
        let udn = $('#cbUDN').val();

        data.append("udn", udn);
        data.append("fecha_archivo", $("#iptSoftFecha").val());

        form_data_ajax(data, url_file, "#productos_vendidos").then((data) => {

            this.lsProductosVendidos();

            // $("#productos_vendidos").rpt_json_table2({
            //     data: data,
            //     class: 'table table-bordered table-sm ',
            //     f_size: "12",
            //     // color_col:[5],
            //     center: [1, 3],
            //     right: [4, 8],
            //     extends: true
            // });

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

        $(".bootbox.modal").modal("hide");

        const udn = 4;

        const getDecimalFormat = (number) => {
            let valorLimpio = number.replace(/[\$,]/g, '');
            return parseFloat(valorLimpio) || 0;
        };


        // Convertir valores y asignarlos al formulario
        const guarn = getDecimalFormat($('#_guarn').val());
        $('#guarniciones').val(guarn);


        const aditamentos = getDecimalFormat($('#_aditamentos').val());
        $('#aditamentosparaasar').val(aditamentos);

        const bebidas = getDecimalFormat($('#_bebidas').val());
        $('#bebidas').val(bebidas);

        const alimentos = getDecimalFormat($('#_alimentos').val());
        $('#cortes').val(alimentos);

        const sales = getDecimalFormat($('#_sales').val());
        $('#salesycondimentos').val(sales);

        const domicilio = getDecimalFormat($('#_domicilio').val());
        $('#servicioadomicilio').val(domicilio);

        // Convertir y sumar subtotal e IVA
        const subtotal = getDecimalFormat($('#_subtotal').val());
        const iva8 = getDecimalFormat($('#_iva').val());
        const totaldeventas = subtotal + iva8;

        // Asignar valores calculados al formulario
        $('#totaldeventas').val(totaldeventas.toFixed(2));


        $('#ivaal8').val(iva8);
        $('#subtotal').val(subtotal);

        $('#totaldeimpuestos').val(iva8);







    }

}


class Soft extends Contabilidad {
//     constructor(ctrl) {
//         super(ctrl);
//     }
//     soft(){
     

//     }
}