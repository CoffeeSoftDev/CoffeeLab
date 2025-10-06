window.link = window.link || "ctrl/ctrl-gestion-de-ventas.php";
ctrl = "ctrl/ctrl-destajo.php";

let obj     = {};
let destajo = {};

collector   = {};

/* Init components */
$(function () {

  $("#content-data").simple_json_tab({ data: json_tab });

    obj = new Modulo_busqueda(link, "content-destajo-grupos");
    // destajo = new Modulo_dos(link, "");
    mdl('content-folios');

    barraBusqueda();
    range_date_picker("iptDate");

    lsFolios();

    // Interface destajo:
    destajo = new Destajo(ctrl, "tab-destajo");
    destajo.initComponents();


    
  
});


let json_tab = [

    {
        tab: "Historial",
        id: "tab-historial",

        contenedor: [
            {
                id: "content-folios",
                class: "col-sm-6 mt-3",
                data: [],
            },
            {
                id: "content-visor",
                class: "col-sm-6 line p-3 mt-3",
            },
        ]
    },

    {
        tab   : "Destajo",
        id    : "tab-destajo",
        fn    : 'destajo.listDestajo()',
        active: true,                      // indica q pestaña se activara por defecto


        contenedor: [

            {
                id: "filterBarDestajo",
                class: "col-12  mb-2",

            },

            {
                id: "contentDataGrupos",
                class: "col-12 ",

            },
          


        ],



    },


];


/*  --    Modulo busqueda     --*/

function barraBusqueda(){

    obj.json_filter_bar = [
        {
            opc : 'input-calendar',
            id: 'iptDate',
            class:'col-4'
        },
        {
            opc : 'select',
            id  : 'txtRpt',
            class:'col-4',
            data : [
                {id:1,valor:"Producción"},
                {id:2,valor:"Merma"},
                {id:3,valor:"Cancelados"},
            ]
        },
        {
            opc : 'btn',
            id  : 'btnBuscar',
            text: 'Busqueda',
            class:'col-4',
            fn: 'lsFolios()'

        }
    
    ];

    obj.filterBar('content-filter-folio');
}

function mdl(id_content){
   
   let div = $('<div>',{
    class : 'row'
   });

   
   let opts_bar = {
      class: 'col-12',
      id: 'content-filter-folio',
   };


   let bar = $('<div>', opts_bar);
   
   div.append(bar);

    /*--   Crear contenedor para la tabla  --*/    
   
   var opts_table = {
        class: 'col-12 mt-3',
        id: 'content-table-folio',
   };

   let table = $('<div>', opts_table); 

    div.append(table);


   $('#'+id_content).html(div);
}

function lsFolios() {

  dtx = {
    opc: "lsFolios",
    fi : ipt_date().fi,
    ff : ipt_date().ff,
    rpt: $("#txtRpt").val(),
  };

  fn_ajax(dtx, link, "#content-table-folio").then((data) => {
    
    
    // if(data.row.length == 0){

        $("#content-table-folio").rpt_json_table2({
          data    : data,
          name    : "table_pedidos",
          color_th: "bg-primary",
          center  : [1,2,3,4],
          f_size  : '12',
          id: "tbHistory",
        });
    
    // }else{


      $("#content-visor").html('');
    
    // }

      simple_data_table_no("#tbHistory", 10);
  });
}


/*  -- Modulo ver ticket -- */ 
function lsTicket(id) {
    dtx = {
        opc: "ticketMermas",
        id: id,
    };

    fn_ajax(dtx, link, "#content-visor").then((data) => {

        $("#content-visor").rpt_json_table2({
          
            data       : data,
            f_size     : '14',
            right      : [2, 3, 4, 5, 6],
            color_group: "bg-default",
            id         : "tbMermas",
        });

        //  simple_data_table_no("#table_pedidos", 100);


        
    });
}


function verTicket(id) {
  dtx = {
    opc: "ver-ticket",
    id: id,
  };

  fn_ajax(dtx, link, "#content-visor").then((data) => {
    $("#content-visor").rpt_json_table2({
    //   color_th: "bg-primary",
      data: data,
      f_size: '14',
      right: [2, 3, 4,5,6],
      parametric: true,
      ipt:[4],
      color_group: "bg-disabled8",
      id: "table_pedidos",
    });

    //  simple_data_table_no("#table_pedidos", 100);


    eventoInput("table_pedidos");
  });
}

function eventoInput(idTable) {
  
    $("#" + idTable + " input[type='text']").on("input", function () {
  
    let name = $(this).attr("name");
    var tr   = $(this).closest("tr");

    let cantidad = $(this).val();
    let precio   = tr.find('td').eq(4).text();
    let total    = precio * cantidad;

    tr.find('td').eq(5).text(evaluar(total));
    tr.find('td').eq(5).addClass('bg-warning-1');

    

        


    // Creamos un paquete para enviar a php
    let dtx = {
      opc             : "ipt",
      [name]          : $(this).val(),
      idListaProductos: $(this).attr("id"),
    };

    simple_send_ajax(dtx, link, "").then((data) => {
        let totalGral = totalColumna(idTable, 5);
        $('#txtTotal').html(totalGral);

    });
  

  });
}


function totalColumna(idTable, col) {

    let total = 0;

    $("#" + idTable + " tbody tr").each(function () {

        var valor = $(this).find("td:eq(" + col + ")").text();

        if(valor){

            let valorReal = parseFloat(valor.replace(/\$/g, "").replace(/,/g, "")); // Utilizar parseFloat para convertir a número decimal y reemplazar las comas por puntos si es necesario
            
            if (!isNaN(valorReal)) 
                total += valorReal;
            
        }

    });

    return total;

}


/* -- Operaciones de ticket -- */ 

function CancelarFolio(id) {
  alert({
    title: "¿Deseas cancelar el siguiente folio ?",
    icon: "question",
  }).then((rtx) => {
    if (rtx.isConfirmed) {
      let dtx = {
        opc: "cancelar-folio",
        id_Estado: 3,
        id_tipo: 3,
        new_estado: 3,
        idLista: id,
      };

      fn_ajax(dtx, link, "").then((data) => {
       lsFolios();
      });
    }
  });
}

function cerrarTicket(idFolio) {

    Swal.fire({
    title: "¿ Deseas terminar de capturar la producción ?",
    text: "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "Cancelar",
    }).then((result) => {
    if (result.isConfirmed) {

    let dtx = {
      opc: "cerrar-ticket",
      idFolio: idFolio,
    };

    fn_ajax(dtx, link, "").then((data) => {
        verTicket(idFolio);
    });


    //   $.ajax({
    //     type: "POST",
    //     url: url_file + "formato_control.php",
    //     data: "opc=4&idFolio=" + idFolio,
    //     success: function (rp) {
    //       data = eval(rp);
    //       ver_ticket_control(idFolio);
    //     },
    //   });
    }
    });
}





/* --  Complementos   -- */
function range_picker_now(id) {

  
    rangepicker(
    "#" + id,
    true,
    
    moment(),
    moment(),
    
    {
      Hoy: [moment(), moment()],
      Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "Última semana": [moment().subtract(6, "days"), moment()],
      "Mes anterior": [
        moment().subtract(1, "month").startOf("month"),
        moment().subtract(1, "month").endOf("month"),
      ],
    },
    "",
    function (startDate, endDate) {
      date1 = startDate.format("YYYY/MM/DD");
      date2 = endDate.format("YYYY/MM/DD");
    }
  );
}

function ipt_date() {
  const fi = $("#iptDate")
    .data("daterangepicker")
    .startDate.format("YYYY-MM-DD");
  const ff = $("#iptDate").data("daterangepicker").endDate.format("YYYY-MM-DD");

  return { fi, ff };
}

function print_formato(idFolio) {
  var window_width = 758;
  var window_height = 479;
  var newfeatures = "scrollbars=no,resizable=no";
  var window_top = (screen.height - window_height) / 2;
  var window_left = (screen.width - window_width) / 2;
  // newWindow=window.open("./../recursos/pdf/lista_productos_ticket.php?id=" + id, "_blank",'width=' + window_width + ',height=' + window_height + ',top=' + window_top + ',left=' + window_left + ',features=' + newfeatures + '');
  myWindow = window.open(
    "ctrl/ctrl_formato_destajo.php?id=" + idFolio,
    "_blank",
    "width=625, height=500,top=120,left=" + window_left
  );
}

function print_formatox() {
  var divToPrint = document.getElementById("content-rpt");
  var html =
    "<html>" +
    "<head>" +
    '<link href="recursos/css/print.css" rel="stylesheet" type="text/css">' +
    '<link rel="stylesheet" href="recursos/css/bootstrap/bootstrap.min.css">' +
    '<link rel="stylesheet" href="https://cdn.linearicons.com/free/1.0.0/icon-font.min.css">' +
    '<style type="text/css" media="print"> @page{  margin-top:  20px;' +
    "margin-bottom:   20px;" +
    "margin-left:   20px;" +
    "margin-right:    30px;" +
    "} </style>" +
    '<body onload="window.print(); ">' +
    divToPrint.innerHTML +
    "</body>" +
    "</html>";
  //  window.close();

  var popupWin = window.open();
  popupWin.document.open();
  popupWin.document.write(html);
  popupWin.document.close();
}

function evaluar(valor) {
    return valor ? '$ ' + valor.toFixed(2) : '-';
}

function simple_date_picker(id) {

    $('#' + id).daterangepicker({
        "singleDatePicker": true,
    });

}

function range_date_picker(id) {
    
    var start = moment().subtract(1, 'days');
    var end   = moment();

    $('#' + id).daterangepicker(
        {
            startDate: start,
            endDate: end,
            cancelClass: "btn-danger",
            ranges: {
                'Hoy': [moment(), moment()],
                'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Ultimos 7 dias': [moment().subtract(6, 'days'), moment()],
                //    'Ultimo 30 dias': [moment().subtract(29, 'days'), moment()],
                'Mes actual': [moment().startOf('month'), moment().endOf('month')],
                'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1,
                    'month').endOf(
                        'month')]
            }
        }

    );
}
