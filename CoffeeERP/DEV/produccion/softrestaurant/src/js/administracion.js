window.ctrl = window.ctrl || "ctrl/ctrl-administracion.php";
window.modal = window.modal || "";
$(function () {
  let datos = new FormData();
  datos.append("opc", "listUDN");

  send_ajax(datos, ctrl).then((data) => {
    let option = "";
    data.forEach((p) => {
      option += `<option value="${p.id}">${p.valor}</option>`;
    });
    $("#txtUDN").html(option);
  });

  $("#btn").on("change", function () {
    Swal.fire({
      title: "¿Qué deseas hacer?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Comparar",
      cancelButtonText: "Subir",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        subir_fichero_ventas(1);
      } else {
        subir_fichero_ventas(2);
      }
    });
  });

  if (typeof moment === "function") {
    rangepicker(
      "#iptDate",
      false,
      moment().subtract(1, "days"),
      moment(),
      {
        Hoy: [moment(), moment()],
        Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Última semana": [moment().subtract(6, "days"), moment()],
        "Mes actual": [moment().startOf("month"), moment().endOf("month")],
        "Mes anterior": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
        "Año actual": [moment().startOf("year"), moment()],
        "Año anterior": [
          moment().subtract(1, "year").startOf("year"),
          moment().subtract(1, "year").endOf("year"),
        ],
      },
      true,
      function (startDate, endDate) {
        date1 = startDate.format("YYYY/MM/DD");
        date2 = endDate.format("YYYY/MM/DD");
      }
    );

    $("#iptDate")
      .next("span")
      .on("click", () => {
        $("#iptDate").click();
      });
  } else {
    Swal.fire({
      title: "404 Not Found",
      text: "Moment.js",
      icon: "error",
      width: 300,
      showConfirmButton: false,
      timer: 1000,
    });
  }
});

url_administracion = "ctrl/ctrl-subir-productos.php";
$("#btnAdministracion").on("click", () => {
  list_productos_soft();
});

$("#btnBuscar").on("click", () => {

    if($('#txtRpt').val() == 1){
       rpt_detallado();
    }else{
       lsGrupo();
    }
 
});


function rpt_detallado() {
    udn = $("#txtUDN").val();

  let fn_opc = udn == 6 ? "list-productos-fogaza" : "rpt_detallado";

  let dtx = {
    opc: fn_opc,
    UDN: $("#txtUDN").val(),
  };

  fn_ajax(dtx, ctrl, "#tbDatos").then((data) => {

    data_right = udn == 6  ? [5,6,7] :[4,5] ; 



    $("#tbDatos").rpt_json_table2({
      data: data,
      center: [1, 6],
      right: data_right,
      id: "tb_detallado",
    });

    datable_export_excel("#tb_detallado", 100);
  });
}


function lsGrupo() {

    let fn_opc = $("#txtUDN").val() == 6 ? "lsGrupoFz" : "lsGrupo";
    
    let dtx = {
        opc: fn_opc,
        UDN: $("#txtUDN").val(),
    };
    
    fn_ajax(dtx, ctrl, "#tbDatos").then((data) => {
        $("#tbDatos").item_json({ data });
    });
}


function enlace_receta(id, idHomologo) {

  idreceta = $("#cb_producto" + id).val();
  nombre   = $("#txtProducto" + id).attr('name');
  txt      = $("#cb_producto"+id+" option:selected").text();

  Swal.fire({
    icon : "warning",
    title: ` ¿Deseas crear un vinculo de la receta  
    <span class="text-info">${nombre}</span> con el producto ${txt} ? `,
    confirmButtonText: "Continuar",
    showCancelButton : true,
    cancelButtonText : "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      datos = _get_data([], "enlace-costsys");
      datos += "&idProducto=" + id + "&idHomologo=" + idHomologo +"&idreceta=" +  idreceta;

      simple_send_ajax(datos, ctrl).then((data) => {});
    }
  });
}

function list_productos_soft() {
  udn = $("#txtUDN").val();

  if (udn == 6) {
    datos = _get_data(["UDN", "Grupo"], "list-productos-fogaza");
  } else {
    datos = _get_data(["UDN", "Grupo"], "categoria-soft");
  }

  $.ajax({
    type: "POST",
    url: ctrl,
    data: datos,
    dataType: "json",
    beforeSend: function () {
      $("#tbDatos").Loading();
    },
    success: function (data) {
      if (udn == 6) {
        // Consulta a fogaza

        $("#tbDatos").btn_json_table({
          data: data,
          center: [0, 1, 2, 5],
          right: [6],
          th: "bg-primary",
          name: "table-fogaza",
          grupo: "bg-warning",
        });

        $("#txtTotals").html(data.Productos);

        datable_export_excel("#table-fogaza", 100);
      } else {
           $("#tbDatos").rpt_json_table2({ data });

        // $("#txtTotals").html(data.Productos);
        // $("#tbDatos").item_card({ data });
      }
    },
  });
}

function ver_productos_soft(id, ids) {

  let fn_opc =
    $("#txtUDN").val() == 6 ? "list_productos_fogaza" : "list-productos";

  datos = _get_data(["UDN"], fn_opc);
  datos = datos + "&id=" + id;



  simple_send_ajax(datos, ctrl).then((data) => {
    $("#txtTotals").html(data.total);

    $("#tbDatos").rpt_json_table2({
      data: data,
      right: [4, 5],
      center: [0, 1, 2, 6, 7],
      grupo: "bg-primary",
    }).then(() => {
         $(".js-example-basic-single").select2({
           theme: "bootstrap-5",
         });
    });
  });
}

function ver_grupo() {
  if ($("txtUDN").val() != 6) {
    datos = _get_data(["UDN"], "listGrupo");
  } else {
    datos = _get_data(["UDN"], "listGroupFogaza");
  }

  simple_send_ajax(datos, ctrl).then((data) => {
    // let option = "<option value='0'> --Ver todo -- </option>";

    // data.forEach((p) => {
    //   option += `<option value="${p.id}">${p.valor}</option>`;
    // });

    // $("#txtGrupo").html(option);
  });
}

function quest_agregar(id) {
  nombre_receta = $("#txtProducto" + id).attr("name");
  titulo        = $("#txtGrupo option:selected").text();

  // ---
  Swal.fire({
    title: `¿Deseas crear el enlace de la receta <small class="text-success">${nombre_receta}</small> ?`,
    text: "",
    icon: "warning",
    showCancelButton: true,
  }).then((result) => {
  
  
    if (result.isConfirmed) {
      datos = _get_data(["Grupo"], "link");

      datos += "&id=" + id;
      datos += "&nombre_receta=" + nombre_receta;
      datos += "&titulo=" + titulo;

      simple_send_ajax(datos, ctrl).then((data) => {
        list_productos_soft();
      });
    }
  });
}

/*  Subir Excel de productos */
function subir_fichero_ventas(idList) {
  var InputFile = document.getElementById("btn");

  var file = InputFile.files;
  var data = new FormData();
  cant_file = file.length;

  for (i = 0; i < file.length; i++) {
    data.append("excel_file" + i, file[i]);
  }

  data.append("idList", idList);
  data.append("UDN", $("#txtUDN").val());
  //   console.log(...data);

  $.ajax({
    url: url_administracion,
    contentType: false,
    processData: false,
    dataType: "json",
    type: "POST",
    cache: false,
    data: data,

    beforeSend: function () {
      $("#tbDatos").Loading();
    },

    success: function (datos) {
      $("#tbDatos").rpt_json_table2({
        data  : datos,
        center: [1, 3,6],
        // right : [6,7,10],
        f_size: "12",

        extends: true,
      });


        var conteoPorGrupo = {};
        datos.row.forEach(function (elemento) {

           
            var grupo = elemento.id_grupo;
                if (conteoPorGrupo[grupo]) {
                    conteoPorGrupo[grupo]++;
                } else {
                    conteoPorGrupo[grupo] = 1;
                }
        });



        // // Imprimir los conteos por grupo
        for (var idgrupo in conteoPorGrupo) {
            if (conteoPorGrupo.hasOwnProperty(idgrupo)) {
                console.log("Grupo " + idgrupo + ": " + conteoPorGrupo[idgrupo] + " elementos");
            }
        }

      $("#txtTotals").html(datos.prod_soft);

      // simple_data_table_no("#file-table", 35);
      document.getElementById("btn").value = "";
    },
  });

  //     } else { //  Fin del ciclo if
//   document.getElementById("btn" + idList).value = "";
  //     }

  // });
}
