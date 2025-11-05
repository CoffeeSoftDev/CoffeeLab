window.ctrlAdminCostsys =
  window.ctrlAdminCostsys || "ctrl/ctrl-administracion.php";

$(function () {
  // Mayúsculas en el input clasificacion
  $("#txtClasificacion").on("input", function () {
    this.value = this.value.toUpperCase();
  });
  // Mayúsculas en el input subclasificacion
  $("#txtSubClasificacion").on("input", function () {
    this.value = this.value.toUpperCase();
  });
  // Cargar select de UDN
  lsUDN().then((data) => {
    $("#txtcbUDN").option_select({
      data: data,
      select2: true,
      group: false,
    });
    tbClasificacion();
    // Evento change de UDN
    $("#txtcbUDN").change(function () {
      tbClasificacion();
    });
  });

  // Cargar select de clasificacion
  lsClasificacion().then((data) => {
    $("#txtcbClasificacion").option_select({
      data: data,
      select2: true,
      group: false,
    });
    tbSubClasificacion();
    // Evento change de clasificacion
    $("#txtcbClasificacion").change(function () {
      tbSubClasificacion();
    });
  });

  // Validation form de clasificacion
  $("#formClasificacion").validation_form(
    { opc: "createClasificacion" },
    function (result) {
      $("#formClasificacion button[type='submit']").attr(
        "disabled",
        "disabled"
      );
      createClasificacion();
    }
  );

  // Validation form de subclasificacion
  $("#formSubClasificacion").validation_form(
    { opc: "createSubClasificacion" },
    function (result) {
      $("#formSubClasificacion button[type='submit']").attr(
        "disabled",
        "disabled"
      );
      createSubClasificacion();
    }
  );
});

// Select de UDN
function lsUDN() {
  let datos = {
    opc: "getUDN",
  };
  return fn_ajax(datos, ctrlAdminCostsys);
}

// Select de clasificacion
function lsClasificacion() {
  let datos = {
    opc: "getClasificacion",
  };
  return fn_ajax(datos, ctrlAdminCostsys);
}

// Tabla de clasificacion
function tbClasificacion() {
  datos = _get_data_opc(["cbUDN"], "tbClasificacion");

  fn_ajax(datos, ctrlAdminCostsys, $("#containerTbClasificacion")).then(
    (data) => {
      $("#containerTbClasificacion").rpt_json_table2({
        data: data,
        center: [3],
        id: "tbClasificacion",
        color_th: "bg-default",
        f_size: 16,
        class: "table table-hover table-bordered",
      });
      simple_data_table("#tbClasificacion", 10);
    }
  );
}

// Tabla de subclasificacion
function tbSubClasificacion() {
  datos = _get_data_opc(["cbClasificacion"], "tbSubClasificacion");

  fn_ajax(datos, ctrlAdminCostsys, $("#containerTbSubClasificacion")).then(
    (data) => {
      $("#containerTbSubClasificacion").rpt_json_table2({
        data: data,
        center: [3],
        id: "tbSubClasificacion",
        color_th: "bg-default",
        f_size: 16,
        class: "table table-hover table-bordered",
      });
      simple_data_table("#tbSubClasificacion", 10);
    }
  );
}

// Crear clasificacion
function createClasificacion() {
  let datos = {
    opc: "createClasificacion",
    id_UDN: $("#txtcbUDN").val(),
    Clasificacion: $("#txtClasificacion").val().toUpperCase().trim(),
    iva: $("#txtIva").val(),
  };
  fn_ajax(datos, ctrlAdminCostsys).then((data) => {
    if (data.status == 200) {
      alert({
        icon: "success",
        title: "Correcto",
        text: data.message,
      });
      $("#txtClasificacion").val("");
      $("#txtIva").val("");
      $("#formClasificacion button[type='submit']").removeAttr("disabled");
      tbClasificacion();
    } else {
      alert({
        icon: "error",
        title: "Error",
        text: data.message,
        btn1: "Aceptar",
      });
      $("#formClasificacion button[type='submit']").removeAttr("disabled");
    }
  });
}

// Crear subclasificacion
function createSubClasificacion() {
  let datos = {
    opc: "createSubClasificacion",
    id_Clasificacion: $("#txtcbClasificacion").val(),
    nombre: $("#txtSubClasificacion").val().toUpperCase().trim(),
  };
  fn_ajax(datos, ctrlAdminCostsys).then((data) => {
    if (data.status == 200) {
      alert({
        icon: "success",
        title: "Correcto",
        text: data.message,
      });
      $("#txtSubClasificacion").val("");
      $("#formSubClasificacion button[type='submit']").removeAttr("disabled");
      tbSubClasificacion();
    } else {
      alert({
        icon: "error",
        title: "Error",
        text: data.message,
        btn1: "Aceptar",
      });
      $("#formSubClasificacion button[type='submit']").removeAttr("disabled");
    }
  });
}

// Dar de baja clasificacion
function deleteClasificacion(id) {
  alert({
    icon: "question",
    title: "¿Está seguro de dar de baja esta clasificación?",
  }).then((result) => {
    if (result.isConfirmed) {
      let datos = {
        opc: "deleteClasificacion",
        id: id,
      };
      fn_ajax(datos, ctrlAdminCostsys).then((data) => {
        tbClasificacion();
      });
    }
  });
}

// Dar de baja subclasificacion
function deleteSubClasificacion(id) {
  alert({
    icon: "question",
    title: "¿Está seguro de dar de baja esta subclasificación?",
  }).then((result) => {
    if (result.isConfirmed) {
      let datos = {
        opc: "deleteSubClasificacion",
        id: id,
      };
      fn_ajax(datos, ctrlAdminCostsys).then((data) => {
        tbSubClasificacion();
      });
    }
  });
}

// Data table
function simple_data_table(table, no = 10) {
  $(table).DataTable({
    pageLength: no,
    searching: true,
    bLengthChange: false,
    bFilter: false,
    order: [],
    bInfo: false,
    oLanguage: {
      sSearch: "Buscar:",
      sInfo:
        "Mostrando del (_START_ al _END_) de un total de _TOTAL_ registros",
      sInfoEmpty: "Mostrando del 0 al 0 de un total de 0 registros",
      sLoadingRecords: "Por favor espere - cargando...",
      oPaginate: {
        sFirst: "Primero",
        sLast: "'Ãšltimo",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
    },
  });
}
