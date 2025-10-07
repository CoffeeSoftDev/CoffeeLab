window.link_soft =
  window.link_soft || "ctrl/ctrl-gestion-de-archivos.php";
window.link_soft_archivos =
  "ctrl/ctrl-soft-archivos-diarios.php";

url_file = "ctrl/ctrl-subir-ventas.php";
udn = [];
$(function () {

  initComponents(link_soft).then((data) => {
    udn = data.udn;
    filtro_busqueda();
    dias_pendientes_soft();
  });

});

function filtro_busqueda() {
  json_filter = [
    {
      opc: "select",
      lbl: "Unidad de negocio",
      id: "txtUDN",
      tipo: "texto",
      data: udn,
      class: "col-12 col-sm-3 col-lg-2",
    },

    {
      opc: "select",
      lbl: "Mes",
      id: "txtMes",
      data: [
        { id: 1, valor: "Enero" },
        { id: 2, valor: "Febrero" },
        { id: 3, valor: "Marzo" },
        { id: 4, valor: "Abril" },
        { id: 5, valor: "Mayo" },
        { id: 6, valor: "Junio" },
        { id: 7, valor: "Julio" },
        { id: 8, valor: "Agosto" },
      ],
    },

    {
      opc: "select",
      lbl: "Año",
      id: "Anio",
      data: [
        { id: 2024, valor: "2024" },
        { id: 2023, valor: "2023" },
        { id: 2022, valor: "2022" },
       
      ],
    },

    {
      opc: "btn",
      id: "btnBuscar",
      tipo: "texto",
      text: "Buscar",
      fn: "dias_pendientes_soft()",
    },
  ];

  $("#content-gestion-archivos").simple_json_content({
    data: json_filter,
    type: "",
  });

  $("#txtMes").val(4);
}

function listUDN() {
  //   let datos = new FormData();
  //   datos.append("opc", "udn");
  //   send_ajax(datos, link_soft).then((data) => {
  //     let option = "";
  //     data.forEach((p) => {
  //       option += `<option value="${p.id}">${p.valor}</option>`;
  //     });
  //     $("#txtUDN").html(option);
  //     // showDataSoft();
  //     console.log(data);
  //   });
}

/* --  Gestion de archivos Soft restaurant  --- */

function dias_pendientes_soft() {
  let dtx = {
    opc: "dias-pendientes",
    Mes: $("#txtMes").val(),
    Anio: $("#Anio").val(),
    UDN: $("#txtUDN").val(),
  };

  fn_ajax(dtx, link_soft_archivos, "#content-calendario").then((data) => {

    
    $("#content-calendario").rpt_json_table2({
      data    : data,
      id      : "table-dias",
      color_th: "bg-primary",
      grupo   : "bg-disabled2",
      f_size  : "12",
      center  : [1, 2,5,6, 7],
      right   : [3, 4, ],
    });


  });
}

function fn_modal(id) {
  modal = bootbox.dialog({
    title: `<strong> Registros </strong> `,
    size: "large",
    // centerVertical: true,

    closeButton: true,
    message: `<div class="" id="content-frm" ></div>
    
     <ul class="mt-3 nav nav-tabs" id="myTabs">
      <li class="nav-item">
            <a class="nav-link active" id="tab2-tab" data-bs-toggle="tab" href="#tab2" > 
            <i class="icon-file-excel text-success"></i> Productos vendidos ( <span style="font-size:.87em;" id="totalProductosVendidos"></span> )</a>
      </li>

       <li class="nav-item">
            <a class="nav-link " onclick="lsVentas()" id="tab-tab" data-bs-toggle="tab" href="#tab"> <i class="icon-file-excel text-success"></i>
             Ventas ( <span style="font-size:.87em;" id="totalVentas"></span> )  </a>
       </li>

       <li class="nav-item">
            <a class="nav-link " id="tab3-tab" data-bs-toggle="tab" href="#tab3" > 
            <i class="icon-calendar text-primary"></i> Bitacora ( <span style="font-size:.87em;" id="totalPendientes"></span> )</a>
      </li>


     </ul>

     <div class="tab-content mt-2">
        <div class="tab-pane fade " id="tab">
        <div id="content-ventas"></div>
        </div>

        <div class="tab-pane fade show active" id="tab2">
          <div class="mt-3" id="content-table"></div>
        </div>

        <div class="tab-pane fade" id="tab3">
          <div class="mt-3" id="content-bitacora"></div>
        </div>


     </div>
    
    `,
  });

  let json_modal = [
    {
      opc: "input-calendar",
      lbl: "",
      id: "iptFecha",
      tipo: "cifra",
      icon: "icon-calendar",
      class: "col-12 col-sm-3",
      //  value: $('#1_1').text(),
    },

    {
      opc: "btn",
      id: "btnVer",
      tipo: "texto",
      text: "Buscar",
      fn: "lsRegistros()",
      color_btn: "secondary",
    },
    {
      opc: "input-file",
      text: "Subir archivo",
      id: "btnSubir",
      color_btn: "primary",
      fn: "SubirArchivo()",
      class: "col-12 col-sm-3",
    },

    {
      opc: "btn",
      text: "Imprimir",
      id: "btnImprimir",
      color_btn: "info",
      fn: "ImprimirReporte()",
      class: "col-12 col-sm-3",
    },
  ];

  $("#content-frm").simple_json_content({
    data: json_modal,
    type: "",
  });

  let valor = $("#fecha_" + id).text();

  console.log(id+'el valor es'+valor);

  $("#iptFecha").daterangepicker(
    {
      singleDatePicker: true,
      startDate: moment(valor),
      locale: {
        format: "YYYY-MM-DD",
      },
    },
    function (start, end, label) {
      console.log(start.format("YYYY-MM-DD"));
    }
  );
  
  lsRegistros();
  lsVentas();
  lsBitacora();
 
}

function lsRegistros() {
  dtx = {
    opc: "ls",
    //   id: id,
    fecha: $("#iptFecha").val(),
    udn: $("#txtUDN").val(),
  };

  fn_ajax(dtx, link_soft_archivos, "#content-table").then((data) => {
    $("#totalProductosVendidos").html(data.total);

    $("#content-table").rpt_json_table2({
      data: data,
      f_size: "12",
      right: [2, 3, 4],
      clase_table: "tb-report",
      color_th: "bg-primary",
      color_group: "bg-disabled4",
    });
  });

   lsVentas();
}

/*  Subir Excel de productos */
function SubirArchivo() {
  var InputFile = document.getElementById("btnSubir");

  var file = InputFile.files;
  var data = new FormData();
  cant_file = file.length;

  for (i = 0; i < file.length; i++) {
    data.append("excel_file" + i, file[i]);
  }

  data.append("UDN", $("#txtUDN").val());
  data.append("fecha_archivo", $("#iptFecha").val());

  form_data_ajax(data, url_file, "#content-table").then((data) => {

    $("#content-table").rpt_json_table2({
      data: data,
      f_size: "12",
    });
    
    document.getElementById("btnSubir").value = "";
  
  });
}

function lsVentas() {
  dtx = {
    opc: "lsVentas",
    fecha: $("#iptFecha").val(),
    udn: $("#txtUDN").val(),
  };

  fn_ajax(dtx, link_soft_archivos, "#content-ventas").then((data) => {
    $("#totalVentas").html(data.total);
    $("#content-ventas").rpt_json_table2({
      data: data,

      right: [2, 3, 4],
      color_th: "bg-primary",
    });
  });
}

function lsBitacora() {
  let dtx = {
    opc: "lsBitacora",
    Mes: $("#txtMes").val(),
    Anio: 2024,
    UDN: $("#txtUDN").val()
  };

  fn_ajax(dtx, link_soft_archivos, "").then((data) => {
    $("#totalPendientes").html(data.dias +' dias pendientes');
    $("#content-bitacora").rpt_json_table2({ data: data });
  });
}

function ImprimirReporte(){
     var divToPrint = document.getElementById("content-table");
     var html =
       "<html><head>" +
       '<link href="../src/plugin/bootstrap-5/css/bootstrap.min.css" rel="stylesheet" type="text/css">' +
       '<link href="../src/css/navbar.css" rel="stylesheet" type="text/css">' +
       '<body style="background-color:white;" onload="window.print(); window.close();  ">' +
       divToPrint.innerHTML +
       "</body></html>";

     var popupWin = window.open();
     popupWin.document.open();
     popupWin.document.write(html);
     popupWin.document.close();
}

/* ---  Visualizar calendario   ---*/
function showDataSoft() {
  datos = _get_simple_datax(["UDN", "Mes"], "calendario-php");

  if ($("#txtUDN").val() == 6) {
    productos_nuevos_fogaza();
  } else {
    simple_send_ajax(datos, link_soft).then((data) => {
      // $("#content-calendario").simple_json_table({
      //   data: data,
      //   right: [],
      //   center:[],
      //   th: "bg-primary",
      // });
      var s = eval(data);

      $("#content-calendario").html(s["table"]);
    });
  }
}

function productos_nuevos_fogaza() {
  datos = _get_data(["Mes"], "productos-nuevos-fogaza");

  simple_send_ajax(datos, link_soft).then((data) => {
    $("#content-calendario").simple_json_table({
      data: data,
      th: "bg-primary",
      right: [],
    });
  });
}

function view() {
  //   datos = _get_data([], "");
  $("#content-calendario").simple_json_table();
}

function range_picker_now(id) {
  rangepicker(
    "#" + id,
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
