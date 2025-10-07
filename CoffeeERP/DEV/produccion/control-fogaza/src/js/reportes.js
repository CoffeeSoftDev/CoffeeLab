link_reporte = "ctrl/ctrl-reportes.php";

/* -- Init Components --*/

let obj = new Templates(link_reporte,'');


let collector = [];
let idFolio   = 0;

$(function () {
  initComponents(link_reporte).then((data) => {
    collector = data;
    ticket_abierto();
  });
});


function lsProducts(){
    let components = $('<div>', { class: 'col-12 decorative-box', id: 'contentProducts' });

    let filterBar  = [
        {
            opc  : 'select',
            id   : 'grupo',
            lbl  : 'Grupo',
            class: 'col-sm-4',
            data: [
                { id: 1, valor: 'FRANCES' },
                { id: 2, valor: 'PASTELERIA' },
                { id: 4, valor: 'BIZCOCHO' }
            ],
            onchange:'showListProducts()'
        },
        {
            opc: 'select',
            id: 'Estado',
            lbl: 'Estado',
            class: 'col-sm-4',
            data: [
                {id:2, valor:'-- Mostrar todos --'},
                { id: 1, valor: 'Activo' },
                { id: 0, valor: 'Inactivo' }
            ],
            onchange: 'showListProducts()'

        }

    ];

    obj.createModal({
  

        bootbox: {
             
            title  : 'Activar/Desactivar productos',
            size   : 'large',
            message: '<div id="filterCategory" class="col-12"></div><div id="contentProducts" class="block"></div>'

        }, 

        data: { opc:'lsProductos',grupo: 1, Estado: 2 },
        
        success: (data) => { 

            $('#filterCategory').content_json_form({data:filterBar ,type:''});
        
            $('#contentProducts').rpt_json_table2({
                data  : data,
                f_size: 12,
                center: [1,2],
                id    : 'tbProducts',
                class : 'table table-bordered table-sm text-uppercase'
            });

            simple_data_table('#tbProducts', 12);


        }
   

    });
}

function showListProducts(){
    obj.createTable({

        parent   : 'contentProducts',
        idFilterBar: 'jsonForm',
        data     : { opc: 'lsProductos' },
        conf     : { datatable: true, },

        attr: {
            color_th: 'bg-primary-1',
            center: [1,2],
            id    : 'tbProducts',
            class : 'table table-bordered table-sm text-uppercase'
        },

       success:(data)=>{

           simple_data_table('#tbProducts', 12);
       }



    });
}

function toggleEstatus(id) {
    
    // Obtiene el icono dentro del botón
    let button = document.getElementById('btnEstatus'+id);
    let icon = button.querySelector('i');
    let estatus = button.getAttribute('estatus');




    // Alterna las clases del icono entre "icon-toggle-on" y "icon-toggle-off"
    if (icon.classList.contains('icon-toggle-on')) {

        icon.classList.remove('icon-toggle-on');
        icon.classList.add('icon-toggle-off');
    } else {

        icon.classList.remove('icon-toggle-off');
        icon.classList.add('icon-toggle-on');
    }

    let nuevoEstatus = estatus === '1' ? '0' : '1';

    fn_ajax({ opc: 'setEstatus', estadoProducto: nuevoEstatus, idAlmacen: id }, link_reporte).then((data) => {

     
        
        button.setAttribute('estatus', nuevoEstatus);

    });



}



function CancelarFolio() {

    alert({
        title: "¿Deseas cancelar el formato de pedidos ?",
        icon: "question",
        
    }).then((rtx) => {

        if (rtx.isConfirmed) {

            let dtx = {
              opc       : "cancelar-folio",
              id_Estado : 3,
              id_tipo   : 3,
              new_estado: 3,
              idLista   : collector.folio.id,
            };

            fn_ajax(dtx, link_reporte, "").then((data) => {
                collector = data;
                ticket_abierto();
            });

        }


    });

}

function ticket_abierto() {
  let data_ticket_abierto = collector.folio;
 
  if (data_ticket_abierto) {

    idFolio = data_ticket_abierto.id;

    $("#btnCrearPedido").addClass("d-none");
    $("#btnCerrarTicket").removeClass("d-none");

   $("#CancelarBtn").removeClass("d-none");
   $("#btnImprimir").removeClass("d-none");

    $("#content-hora").html(
      '<b>Apertura: </b> <span title="'+idFolio +'" class="text-info">' +
        data_ticket_abierto.hora +
        "</span><br>"
    );

     $("#content-nota").html(
       '<b>Nota: </b> <span class="text-info">' +
         data_ticket_abierto.id +
         "</span>"
     );

    verFormato();

  } else {
    
    $("#CancelarBtn").addClass("d-none");
    $("#btnImprimir").addClass("d-none");
    $("#btnCerrarTicket").addClass("d-none");
    $("#btnCrearPedido").removeClass("d-none");
   
    $("#content-hora").html("");
    $("#content-nota").html("");
    $("#content-visor").empty_state();

  }
}

function verFormato() {

  dtx = {
    opc          : "ls",
    clasificacion: $("#txtClasificacion").val(),
    id           : idFolio,
  };

  fn_ajax(dtx, link_reporte, "#content-visor").then((data) => {
    
    $("#content-visor").rpt_json_table2({

     data  : data,
     center: [1,3,4],
     right : [5, 6, 7],
     f_size: '12',
    //  id:'simple_table'
 
    });

    let NoProductos = data.NoProductos + 4;
    // console.log(NoProductos);

      simple_data_table("#simple-table", NoProductos);

        let info = $('#simple-table_info').addClass('hide').text();
      $('#simple-table_filter').parent().prev().html('<strong>No. productos: </strong>'+info);
   

   
    eventoInput('simple-table');
  });

}

function simple_data_table(table, no_paginate = 10) {
    $(table).DataTable({
        pageLength: no_paginate,
        // showNEntries: false,
        searching: true,
        bLengthChange: false,
        bFilter: false,
        "order": [],
        // bInfo: false,
        "oLanguage": {
            "sSearch": "Buscar:",
            "sInfo": "  _TOTAL_  ",
            "sInfoEmpty": "Mostrando del 0 al 0 de un total de 0 registros",
            "sLoadingRecords": "Por favor espere - cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }

        }
    });
}


function CrearFormatoPedido() {

  modal = bootbox.dialog({
    title: `<strong>  CREAR FORMATO </strong> `,
    message: `<form class="" id="content-pedido-fogaza"  novalidate></form>`,
  });

  $("#content-pedido-fogaza").simple_json_form({
    data: JSON_pedido,
    type_btn: "two_btn",
  });

  fecha_control();

  $("#content-pedido-fogaza").validation_form(
    {
      tipo: "text",
      opc: "crear-formato",
    },
    (datos) => {
      control = $("#txtfoliofecha").val();
     
      MessageDialogConfirm(
        "La fecha de tu pedido queda para el día " + Formatear_fecha(control),
        datos
      );
      
    }
  );
  
}

function MessageDialogConfirm(mnsj,datos) {

    Swal.fire({
      title           : mnsj,
      text            : "¿Deseas continuar?",
      icon            : "warning",
      showCancelButton: true,

      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fn_ajax(datos, link_reporte, "").then((data) => {
          alert();
          modal.modal("hide");
          formato_ctrl_produccion();
        });
      }
    });

}

function formato_ctrl_produccion() {
    let dtx = {
      opc: "initComponents",
    };
 
    fn_ajax(dtx, link_reporte, "#content-visor").then((data) => {
        collector = data;
        ticket_abierto();
    });
  

}

function TerminarFormato() {
  Swal.fire({
    title: "¿Deseas termina la captura del formato de producción?",
    text: "",
    icon: "warning",
    showCancelButton: true,

    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {


        let dtx_ = {
            opc: "terminar-formato",
            id_Estado:2,
            new_estado:2,
            idLista: collector.folio.id,
        };

        console.table(collector);
    
        fn_ajax(dtx_, link_reporte, "").then((data) => {
          collector = data;
          $("#content-visor").empty_state("Vacio");
          ticket_abierto();
        });


    }
  });
}

function generarPDF() {
    // Crea un nuevo documento PDF
    const doc = new jsPDF();

    // Datos para la tabla
    const headers = [["ID", "Nombre", "Apellido"]];
    const data = [
    [1, "John", "Doe"],
    [2, "Jane", "Smith"],
    [3, "Juan", "Pérez"],
    ];

    // Define el tamaño y la posición de la tabla (x, y, ancho, alto)
    // doc.autoTable({
    // head: headers,
    // body: data,
    // // startY: 20, // Puede ajustar la posición de inicio de la tabla según sea necesario
    // });

    // Guarda el documento
    // doc.save("tabla.pdf");
}

function QuitarLista(idRow) {

    let data_ipt = {
        opc       : "quitar-lista",
        idFolio        : collector.folio.id,
        idProducto: idRow
    
    }

    fn_ajax(data_ipt, link_reporte, "").then((data) => {
        $('#'+idRow).val('');

        let totalGral = $('#TotalProduccionCtrl').val();
        let totalRow  = $('#txtTotalCtrl'+idRow).val();


        if(totalGral != 0){
         
            let nuevo_totalGral = totalGral - totalRow;
            
            $('#TotalProduccionCtrl').val(nuevo_totalGral);
            
            $('#txtPrecio'+idRow).val('');
            $('#txtTotal'+idRow).val('');
            
        }

    });
}


/* -- Complementos -- */

function range_picker_now(id) {
  rangepicker(
    "#" + id,
    true,
    moment().subtract(6, "days"),
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
      date1 = startDate.format("YYYY-MM-DD");
      date2 = endDate.format("YYYY-MM-DD");
    }
  );
}

function ipt_date() {
  const fi = $("#iptDate")
    .data("daterangepicker")
    .startDate.format("YYYY-MM-DD");
  const ff = $("#foliofecha").data("daterangepicker").endDate.format("YYYY-MM-DD");

  return { fi, ff };
}

function print_formato() {
  var divToPrint = document.getElementById("content-rpt");
  var html =
    "<html>" +
    "<head>" +
    '<link_reporte href="recursos/css/print.css" rel="stylesheet" type="text/css">' +
    '<link_reporte rel="stylesheet" href="recursos/css/bootstrap/bootstrap.min.css">' +
    '<link_reporte rel="stylesheet" href="https://cdn.linearicons.com/free/1.0.0/icon-font.min.css">' +
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

function print_ctrl_linea_produccion() {
  // selected = $('#AreaPasteleria').val();

  // titulo = $("#AreaPasteleria option:selected").text();
  folio = collector.folio.id;

  var window_width = 758;
  var window_height = 479;
  var newfeatures = "scrollbars=no,resizable=no";
  var window_top = (screen.height - window_height) / 2;
  var window_left = (screen.width - window_width) / 2;
  // newWindow=window.open("./../recursos/pdf/lista_productos_ticket.php?id=" + id, "_blank",'width=' + window_width + ',height=' + window_height + ',top=' + window_top + ',left=' + window_left + ',features=' + newfeatures + '');
  myWindow = window.open(
    "ctrl/ctrl-formato-produccion.php?id=" + folio,
    "_blank",
    "width=625, height=500,top=120,left=" + window_left
  );
}

function fecha_control() {
  rangepicker(
    "#txtfoliofecha",
    true,
    moment(),
    moment(),
    "",
    "",
    function (startDate, endDate) {
      date1 = startDate.format("YYYY-MM-DD");
      date2 = endDate.format("YYYY-MM-DD");
    }
  );
}

function eventoInput(idTable) {
    $("#" + idTable + " input[type='number']").on("input", function () {
        let name       = $(this).attr("name");
        let idProducto = $(this).attr("id");
        let sugerencia = $(this).val();

        /* data frm*/
         precio = $("#txtPrecioCtrl" + $(this).attr("id")).val();
         total = sugerencia * precio;

         $("#txtTotalCtrl" + $(this).attr("id")).val(total);


         anterior = $("#TotalProduccionCtrl").val();
        
        
        let dtx = {
          opc         : "ipt",
          [name]      : $(this).val(),
          id_productos: $(this).attr("id"),
          costo       : precio,
          id_lista    : collector.folio.id,
        };
        
        simple_send_ajax(dtx, link_reporte, "").then((data) => {
             $("#TotalProduccionCtrl").val(data.total);
        });
    });
}

function Formatear_fecha(fecha) {
  const fechaObj = new Date(fecha);

  const year = fechaObj.getFullYear();
  const month = fechaObj.getMonth() + 1; // El mes se indexa desde 0, por lo que debes sumar 1
  const day = fechaObj.getDate();
  
  var fechita = fecha;
  var elem = fechita.split('-');
  dia  = elem[2];
  mess = elem[1];
  anio  = elem[0];

 
  const dias = [
  
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo'
  ];

 const Mes = [
    'SB',
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE'
  ];

  const numeroDia = new Date(fecha).getDay();
  const nombreDia = dias[numeroDia];
  const nombreMes = Mes[month];
  
 

  fecha_format =  '<span class="text-primary">'+ nombreDia + ', ' + dia + ' de ' + nombreMes + ' del ' + year + '</span>' ;
  return fecha_format;
}



 link_rpt  = "ctrl/ctrl-formato-produccion.php";
function modal_envio_whatsapp() {

    let json_wp = [
      {
        opc: "input-group",
        lbl: "Número de WhatsApp",
        id: "wp",
        tipo: "number",
        required: true,
        placeholder: "",
        icon: "icon-phone-2",
      },

      {
        opc: "input-group",
        lbl: "Con copia",
        id: "CC",
        tipo: "number",
        required: false,
        value: "",
        disabled: true,
        value:"9621501886",
        icon: "icon-phone-2",
      },
    ];

    modal = bootbox.dialog({
      title: "<strong>  ENVIAR FORMATO DE PEDIDO </strong>",
      closeButton: true,
      message: '<form class="" id="frm-wp"  novalidate></form> <div id="content-wp"></div>',
    });
    

    $("#frm-wp").simple_json_form({ data: json_wp, type_btn: "two_btn" });

    $("#frm-wp").validation_form(
      {
        tipo: "text",
        opc: "enviar-whatsapp",
        id: collector.folio.id,
      },
      (datos) => {
        fn_ajax(datos,link_reporte, "").then((data) => {

          modal.modal("hide");
          
        // $('#content-wp').html(data.table);
        });
      }
    );



}

/*--   JSON PEDIDOS --*/

let JSON_pedido = [
  {
    opc: "Select",
    lbl: "Escoge una categoria:",
    id: "id_grupo",
    // required:false,
    data: [
      { id: 1, valor: "FRANCES" },
      { id: 2, valor: "PASTELERIA" },
      { id: 4, valor: "BIZCOCHO" },
    ],
  },
 
  {
    opc: "Select",
    lbl: "Elige un turno:",
    id: "turno",
    data: [
      { id: 3, valor: "UNICO" },
      { id: 1, valor: "MATUTINO" },
      { id: 2, valor: "VESPERTINO" },
    ],
  },

  {
    opc: "select_input",
    lbl: "Fecha",
    id: "foliofecha",
    tipo: "texto",

    holder: "",
  },

  {
    opc: "input",
    lbl: "Nota:",
    id: "Nota",
    tipo: "texto",
    required: false,
    value: "",
  },
];
