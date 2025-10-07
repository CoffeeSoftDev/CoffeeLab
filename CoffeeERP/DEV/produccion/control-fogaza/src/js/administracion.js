window.ctrl = window.ctrl || "ctrl/ctrl-administracion.php";
window.modal = window.modal || "";
$(function () {
  let datos = new FormData();
  datos.append("opc", "lsCategoria");

  send_ajax(datos, ctrl).then((data) => {
    let option = "";
    data.forEach((p) => {
      option += `<option value="${p.id}">${p.valor}</option>`;
    });
    $("#txtCategoria").html(option);
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

  dataTable_responsive("#tb", [{ responsivePriority: 1, targets: 0 }]);

  $("#btnOk").on("click", () => busqueda());
});

function busqueda() {
  ipt_date = get_date("iptDate");

  $("#frm-panel").validar_contenedor(
    {
      tipo: "text",
      opc: "tabla",
      fi: ipt_date.fi,
      ff: ipt_date.ff,
    },
    (datos) => {
      fn_ajax(datos, ctrl, "#tbDatos").then((data) => {
        $("#tbDatos").JsonTablePro({
          data: data,
          id: "tb-busqueda",
          th: "bg-primary",
          f_size: 12,
          grupo: "bg-aliceblue",
          right: [4, 5, 6, 7],
          center: [1],
        });

        // simple_data_table_no("#simple-table", 120);
      });
    }
  );
}

function get_date(id) {
  const fi = $("#" + id)
    .data("daterangepicker")
    .startDate.format("YYYY-MM-DD");
  const ff = $("#" + id)
    .data("daterangepicker")
    .endDate.format("YYYY-MM-DD");

  return {
    fi: fi,
    ff: ff,
  };
}
