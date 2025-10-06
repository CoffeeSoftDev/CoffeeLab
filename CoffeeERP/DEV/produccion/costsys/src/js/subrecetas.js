window.ctrlSubrecetas =
  window.ctrlSubrecetas || "ctrl/ctrl-subrecetas.php";

function bodySubreceta() {
  // Crear el boton dinamicamente
  $("#containerButtonAdd").html(
    `<label col="col-12 d-none d-md-block"> </label>
    <button type="button" class="btn btn-primary col-12" id="btnAddSubReceta" title="Nueva SubReceta">
        <i class="icon-plus"></i> Subreceta
    </button>`
  );
  $(".clasificacion-select").removeClass("hide");
  $("#btnAddSubReceta").on("click", function () {
    alert({
      icon: "question",
      title:
        "¿Desea agregar una nueva receta a " +
        $("#txtcbUDN option:selected").text() +
        " con clasificación " +
        $("#txtcbClasificacion option:selected").text() +
        "?",
    }).then((result) => {
      if (result.isConfirmed) {
        addSubRecetaInterface();
      }
    });
  });
  lsSubrecetas();
  $("#photo-subreceta").change(function () {
    photoSubReceta().then(() => {
      uploadPhotoSubReceta();
    });
  });
}

// INTERFACES ------------------------------------------------------------
function addSubRecetaInterface() {
  $("#titleSubReceta").text(
    "Nueva subreceta / " + $("#txtcbUDN option:selected").text().toLowerCase()
  );
  $("#containerCatalogo").addClass("hide");
  $("#btnCreateSubReceta").text("Crear receta");
  $("#btnCreateSubReceta").removeClass("hide");
  $(".main-sub").addClass("hide");
  $(".secondary-sub").removeClass("hide");
  $("#fillSubReceta").addClass("hide");
  $("#btnSaveSubReceta").addClass("hide");
  $("#txtSubReceta").prop("disabled", false);
  $("#textareaNotasSub").prop("disabled", false);
  $("#txtcbClasificacionSub").prop("disabled", false);
  $("#txtSubReceta").val("");
  $("#textareaNotasSub").val("");
  $("#txtSubReceta").focus();

  $("#txtcbClasificacionSub").val(
    $("#txtcbClasificacion option:selected").val()
  );

  subrecipe("create", null);
}

function editSubRecetaInterface(id) {
  $("#titleSubReceta").text(
    "Editar subreceta / " + $("#txtcbUDN option:selected").text().toLowerCase()
  );
  $("#containerCatalogo").addClass("hide");
  $("#btnCreateSubReceta").text("Actualizar subreceta");
  $("#btnCreateSubReceta").removeClass("hide");
  $(".main-sub").addClass("hide");
  $(".secondary-sub").removeClass("hide");
  $("#fillSubReceta").removeClass("hide");
  $("#btnSaveSubReceta").addClass("hide");
  $("#txtSubReceta").prop("disabled", false);
  $("#textareaNotasSub").prop("disabled", false);
  $("#txtcbClasificacionSub").prop("disabled", false);
  $("#txtSubReceta").val("");
  $("#textareaNotasSub").val("");
  $("#txtSubReceta").focus();

  // Obtener data de ingredientes y subrecetas para select
  let dataIng = actualizarDataIngredientes();
  let dataSub = actualizarDataSubRecetas(
    dataCatalogo.subrecetas.find((x) => x.id == id).idclasificacion
  );

  // Recuperar datos de la subreceta
  $("#txtSubReceta").val(dataCatalogo.subrecetas.find((x) => x.id == id).valor);
  $("#textareaNotasSub").val(
    dataCatalogo.subrecetas.find((x) => x.id == id).nota
  );
  $("#txtcbClasificacionSub").val(
    dataCatalogo.subrecetas.find((x) => x.id == id).idclasificacion
  );

  subrecipe("edit", id);
  culinaryProcedureSubReceta("edit", id);
  ingredientsAndSubRecetaSubReceta(id, dataIng, dataSub);
}

function subrecipe(param, id) {
  // Mayúsculas en el input de subrecetas
  $("#txtSubReceta").on("input", function () {
    this.value = this.value.toUpperCase();
  });

  // Agregar/Editar subrecetas
  $("#formAddSubReceta").validation_form({}, async function (result) {
    $("#formAddSubReceta button[type='submit']").attr("disabled", "disabled");
    let idReceta = param === "create" ? null : id; // Obtener el ID según la condición
    let udn =
      param === "create"
        ? $("#txtcbUDN").val()
        : dataCatalogo.subrecetas.find((x) => x.id == id).idudn;

    let confirmarGuardado = await validateSubReceta(idReceta, udn);

    if (confirmarGuardado) {
      if (param === "create") {
        addSubReceta();
      } else {
        editSubReceta(id);
      }
    } else {
      $("#formAddSubReceta button[type='submit']").removeAttr("disabled");
    }
  });

  // Cerrar interfaz
  $("#btnCloseSubReceta").on("click", function () {
    alert({
      icon: "question",
      title: "¿Desea terminar de editar esta subreceta?",
      text: "Los cambios no guardados se perderán.",
    }).then((result) => {
      if (result.isConfirmed) {
        $("#btnAddSubReceta").removeClass("hide");
        $(".main-sub").removeClass("hide");
        $(".secondary-sub").addClass("hide");
        $("#formAddSubReceta")[0].reset();
        $("#containerCatalogo").removeClass("hide");
        $("#containerFormProcCulinarioSub").html("");
        lsSubrecetas();
      }
    });
  });
}

function culinaryProcedureSubReceta(param, id) {
  // PROCEDIMIENTO CULINARIO
  let json_form_proc_culinario_sub = [];
  if (param === "create") {
    json_form_proc_culinario_sub = [
      {
        opc: "input-group",
        lbl: "Total ingredientes",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "TotalIngredientesSub",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "select",
        lbl: "Unidad",
        id: "UnidadSub",
        required: true,
      },
      {
        opc: "input-group",
        lbl: "Rendimiento",
        icon: "icon-hash",
        tipo: "cifra",
        id: "RendimientoSub",
        placeholder: "0.00",
        required: true,
      },
      {
        opc: "input-group",
        lbl: "Costo",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "CostoSub",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Precio de venta",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "PrecioVentaSub",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Margen de contribución",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "MargenConSub",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Porcentaje de costo",
        icon: "icon-percent",
        tipo: "cifra",
        id: "PorcentajeCostoSub",
        placeholder: "100.00",
        disabled: true,
        required: false,
      },
    ];
  } else {
    json_form_proc_culinario_sub = [
      {
        opc: "input-group",
        lbl: "Total ingredientes",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "TotalIngredientesSub",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "select",
        lbl: "Unidad",
        id: "UnidadSub",
        required: true,
        value: dataCatalogo.subrecetas.find((x) => x.id == id).idunidad,
      },
      {
        opc: "input-group",
        lbl: "Rendimiento",
        icon: "icon-hash",
        tipo: "cifra",
        id: "RendimientoSub",
        placeholder: "0.00",
        required: true,
        value: dataCatalogo.subrecetas.find((x) => x.id == id).rendimiento,
      },
      {
        opc: "input-group",
        lbl: "Costo",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "CostoSub",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Precio de venta",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "PrecioVentaSub",
        placeholder: "0.00",
        disabled: true,
        required: false,
        value: dataCatalogo.subrecetas.find((x) => x.id == id).precio,
      },
      {
        opc: "input-group",
        lbl: "Margen de contribución",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "MargenConSub",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Porcentaje de costo",
        icon: "icon-percent",
        tipo: "cifra",
        id: "PorcentajeCostoSub",
        placeholder: "100.00",
        disabled: true,
        required: false,
      },
    ];
  }
  let form_proc_sub = $("<form>", {
    id: "formProcedimientoCulinarioSub",
    class: "row row-cols-1",
    novalidate: true,
  });
  // Crear el formulario
  form_proc_sub.html("").simple_json_form({
    data: json_form_proc_culinario_sub,
  });
  // Anexar el formulario al contenedor
  $("#containerFormProcCulinarioSub").html("");
  form_proc_sub.appendTo("#containerFormProcCulinarioSub");
  // Cargar datos en el select unidad
  $("#txtUnidadSub").option_select({
    data: dataCatalogo.unidad,
    select2: true,
    group: false,
    placeholder: "Selecciona una unidad",
  });
  // Validation form procedimiento culinario
  $("#formProcedimientoCulinarioSub").validation_form({}, function (result) {
    $("#formProcedimientoCulinarioSub button[type='submit']").attr(
      "disabled",
      "disabled"
    );
    addProcedimientoCulinarioSub(id);
  });
}

function ingredientsAndSubRecetaSubReceta(id, dataIng, dataSub) {
  // Objeto para la tabla
  let object_table = {
    f_size: "14",
    color_th: "bg-primary",
    ipt: [3],
  };

  // INGREDIENTES
  let json_form_sub_ing = [
    {
      opc: "btn",
      class: "float-end",
      btn_class: "btn-close",
      fn: "closeForm('#formAddSubRecetasIng', '#contentTableSubRecetasIng', '#addSubRecetasIng')",
    },
    {
      opc: "select",
      lbl: "Ingrediente",
      id: "id_Ingrediente",
      class: "mt-4",
      required: true,
    },
    {
      opc: "input",
      lbl: "Cantidad",
      id: "cantidad",
      tipo: "cifra",
      placeholder: "0.00",
      required: true,
    },
  ];
  let dtx_sub_ing = {
    opc: "tbSubRecetaIngrediente",
    idReceta: id,
  };

  // Objetos para el modulo de ingredientes
  let object_frm_ing = {
    id_Subreceta1: id,
    opc: "createSubRecetaIngrediente",
  };
  let object_event_ing = {
    opc: "updateSubRecetaIngrediente",
    id_Subreceta1: id,
  };
  let object_attr_json_frm_ing = {
    name_btn: "Agregar Ingrediente",
  };
  let object_alert_ing = {
    icon: "success",
    title: "Ingrediente",
    text: "Ingrediente guardado correctamente",
  };

  // Modulo subrecetas-ingredientes
  $("#frmAndTbSubRecetasIng").modulo_1({
    json_frm: json_form_sub_ing,
    datos: dtx_sub_ing,
    enlace: ctrlSubrecetas,
    content_table: "contentTableSubRecetasIng",
    frm: "formAddSubRecetasIng",
    table: "tbSubRecetasIng",
    class_frm: "col-12 col-md-4",
    class_formulario: "col-12  container-border-right container-border-info",
    class_table: "col-12 col-md-8",
    atributos_table: object_table,
    atributos_frm: object_frm_ing,
    atributos_alert: object_alert_ing,
    atributos_event: object_event_ing,
    attr_json_frm: object_attr_json_frm_ing,
  });

  // Cargar datos en el select ingredientes
  $("#txtid_Ingrediente").option_select({
    data: dataIng,
    select2: true,
    group: false,
    placeholder: "Selecciona un ingrediente",
  });

  // SUBRECETAS
  let json_form_sub_sub = [
    {
      opc: "btn",
      class: "float-end",
      btn_class: "btn-close",
      fn: "closeForm('#formAddSubRecetasSub', '#contentTableSubRecetasSub', '#addSubRecetasSub')",
    },
    {
      opc: "select",
      lbl: "Subreceta",
      id: "id_Subreceta2",
      class: "mt-4",
      required: true,
    },
    {
      opc: "input",
      lbl: "Cantidad",
      id: "cantidad",
      tipo: "cifra",
      placeholder: "0.00",
      required: true,
    },
  ];
  let dtx_sub_sub = {
    opc: "tbSubRecetaSubReceta",
    idSubreceta: id,
  };

  // Objetos para el modulo de subrecetas
  let object_frm_sub = {
    id_Subreceta1: id,
    opc: "createSubRecetaSubReceta",
  };
  let object_event_sub = {
    opc: "updateSubRecetaSubReceta",
    id_Subreceta1: id,
  };
  let object_attr_json_frm_sub = {
    name_btn: "Agregar Subreceta",
  };
  let object_alert_sub = {
    icon: "success",
    title: "Subreceta",
    text: "Subreceta guardada correctamente",
  };

  // Modulo subrecetas-subrecetas
  if (dataSub.length > 0) {
    $("#frmAndTbSubRecetasSub").modulo_1({
      json_frm: json_form_sub_sub,
      datos: dtx_sub_sub,
      enlace: ctrlSubrecetas,
      content_table: "contentTableSubRecetasSub",
      frm: "formAddSubRecetasSub",
      table: "tbSubRecetasSub",
      class_frm: "col-12 col-md-4",
      class_formulario: "col-12  container-border-right container-border-info",
      class_table: "col-12 col-md-8",
      atributos_table: object_table,
      atributos_frm: object_frm_sub,
      atributos_alert: object_alert_sub,
      atributos_event: object_event_sub,
      attr_json_frm: object_attr_json_frm_sub,
    });
  }
  // Cargar datos en el select subrecetas
  $("#txtid_Subreceta2").option_select({
    data: dataSub,
    select2: true,
    group: false,
    placeholder: "Selecciona una subreceta",
  });
  // Cargar el select de subrecetas de acuerdo a la clasificación
  $("#txtcbClasificacionSub").on("change", function () {
    let dataSub = actualizarDataSubRecetas($(this).val());
    $("#txtid_Subreceta2").html("");
    $("#txtid_Subreceta2").option_select({
      data: dataSub,
      select2: true,
      group: false,
      placeholder: "Selecciona una subreceta",
    });
  });

  // Estilos
  // Ingredientes
  $("#formAddSubRecetasIng").parent().addClass("p-0 m-0");
  $("#formAddSubRecetasIng")
    .children()
    .eq(3)
    .removeClass("mb-3")
    .addClass("mb-2");
  $("#formAddSubRecetasIng button[type='submit']")
    .removeClass("mt-4")
    .addClass("mt-3");
  // Subrecetas
  $("#formAddSubRecetasSub").parent().addClass("p-0 m-0");
  $("#formAddSubRecetasSub")
    .children()
    .eq(3)
    .removeClass("mb-3")
    .addClass("mb-2");
  $("#formAddSubRecetasSub button[type='submit']")
    .removeClass("mt-4")
    .addClass("mt-3");
  // Procedimiento culinario
  $("#formProcedimientoCulinarioSub button[type='submit']")
    .removeClass("mt-4")
    .addClass("mt-3");
}

// SUBRECETA ------------------------------------------------------------
async function validateSubReceta(id, udn) {
  const confirmacionInicial = await alert({
    icon: "question",
    title: "¿Está seguro de guardar esta subreceta?",
  });

  if (!confirmacionInicial.isConfirmed) return false;

  const nameSubReceta = $("#txtSubReceta").val().toUpperCase().trim();

  let datos = new FormData();
  datos.append("opc", "validateSubReceta");
  datos.append("nombre", nameSubReceta);
  datos.append("udn", udn);

  // Validar si existe la subreceta
  data = await send_ajax(datos, ctrlSubrecetas);

  if (data && data.length > 0) {
    let nombres = "";
    let idSubReceta = 0;
    let id_udn = 0;

    data.forEach((element) => {
      nombres += element.nombre + ", ";
      idSubReceta = element.id;
      id_udn = element.id_udn;
    });

    let existe = data.some(
      (x) => x.nombre === nameSubReceta && x.id_udn === udn
    );

    if (existe) {
      if (idSubReceta == id) {
        return true;
      }

      if (id_udn == udn) {
        let confirmacionSimilar = await alert({
          icon: "question",
          title:
            "Se encontraron subrecetas relacionadas con este nombre ¿Deseas continuar?",
          text: "Subrecetas existentes:\n" + nombres,
        });

        if (confirmacionSimilar.isConfirmed) {
          alert({
            icon: "error",
            title: "Lo sentimos",
            text: `El nombre "${nameSubReceta}" ya existe, intente con otro nombre.`,
            btn1: true,
          });
          return false;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }
  return true;
}

function addSubReceta() {
  let datos = new FormData();
  datos.append("opc", "createSubReceta");
  datos.append("nombre", $("#txtSubReceta").val());
  datos.append("id_Clasificacion", $("#txtcbClasificacionSub").val());
  datos.append("nota", $("#textareaNotasSub").val());
  datos.append("id_UDN", $("#txtcbUDN").val());
  send_ajax(datos, ctrlSubrecetas).then((data) => {
    if (data !== false && data !== null && data !== "null") {
      alert({
        icon: "success",
        title: "Subreceta",
        text: "Subreceta creada correctamente",
      });
      $("#fillSubReceta").removeClass("hide");
      $("#txtSubReceta").prop("disabled", true);
      $("#txtcbClasificacionSub").prop("disabled", true);
      $("#btnCreateSubReceta").addClass("hide");
      $("#btnSaveSubReceta").removeClass("hide");
      $("#txtcbClasificacionSub").prop("disabled", true);
      $("#formAddSubReceta button[type='submit']").removeAttr("disabled");
      let dataIng = actualizarDataIngredientes();
      let dataSub = actualizarDataSubRecetas($("#txtcbClasificacionSub").val());
      culinaryProcedureSubReceta("create", data);
      ingredientsAndSubRecetaSubReceta(data, dataIng, dataSub);
      // Guardar datos de la subreceta
      $("#btnSaveSubReceta").on("click", function () {
        $("#textareaNotasSub").prop("disabled", false);
        alert({
          icon: "question",
          title: "¿Está seguro de guardar la subreceta?",
        }).then((result) => {
          if (result.isConfirmed) {
            editSubReceta(data);
          }
        });
      });
    } else {
      alert({
        icon: "error",
        title: "Subreceta",
        text: "Error al guardar la subreceta",
      });
    }
  });
}
// Aquí me quede 
function editSubReceta(id) {
  let dtx = new FormData();
  dtx.append("opc", "updateReceta");
  dtx.append("nombre", $("#txtSubReceta").val());
  dtx.append("id_Clasificacion", $("#txtcbClasificacionSub").val());
  dtx.append("nota", $("#textareaNotasSub").val());
  dtx.append("rendimiento", $("#txtRendimientoRec").val());
  dtx.append("precioVenta", $("#txtPrecioVentaRec").val());
  dtx.append("iva", $("#txtIVARec").val());
  dtx.append("idReceta", id);
  send_ajax(dtx, ctrlSubrecetas).then((data) => {
    if (data === true) {
      alert({
        icon: "success",
        title: "Subreceta",
        text: "Guardado correctamente",
      });
      $("#formAddSubReceta button[type='submit']").removeAttr("disabled");
      // Cambiar datos de dataCatalogo
      if (dataCatalogo.subrecetas.find((x) => x.id == id) !== undefined) {
        dataCatalogo.subrecetas.find((x) => x.id == id).valor =
          $("#txtSubReceta").val();
        dataCatalogo.subrecetas.find((x) => x.id == id).idclasificacion = $(
          "#txtcbClasificacionSub"
        ).val();
        dataCatalogo.subrecetas.find((x) => x.id == id).clasificacion = $(
          "#txtcbClasificacionSub option:selected"
        ).text();
        dataCatalogo.subrecetas.find((x) => x.id == id).nota =
          $("#textareaNotasSub").val();
        dataCatalogo.subrecetas.find((x) => x.id == id).rendimiento =
          $("#txtRendimientoRec").val();
        dataCatalogo.subrecetas.find((x) => x.id == id).precio =
          $("#txtPrecioVentaRec").val();
        dataCatalogo.subrecetas.find((x) => x.id == id).iva =
          $("#txtIVARec").val();
      } else {
        // Agregar a dataCatalogo la nueva receta
        dataCatalogo.subrecetas.push({
          id: id,
          valor: $("#txtSubReceta").val(),
          idclasificacion: $("#txtcbClasificacionSub").val(),
          clasificacion: $("#txtcbClasificacionSub option:selected").text(),
          nota: $("#textareaNotasSub").val(),
          rendimiento: $("#txtRendimientoRec").val(),
          precio: $("#txtPrecioVentaRec").val(),
          iva: $("#txtIVARec").val(),
        });
      }
      $("#btnAddSubReceta").removeClass("hide");
      $(".main-sub").removeClass("hide");
      $(".secondary-sub").addClass("hide");
      $("#formAddSubReceta")[0].reset();
      $("#containerCatalogo").removeClass("hide");
      lsSubrecetas();
    } else {
      alert({
        icon: "error",
        title: "Receta",
        text: "Error al actualizar la receta",
      });
    }
  });
}

// SUBRECETAS - INGREDIENTES --------------------------------------------
function deleteSubRecetaIngrediente(
  btn,
  idReceta,
  idIngrediente,
  tb,
  itemCount,
  costTotal
) {
  alert({
    icon: "question",
    title: "¿Está seguro de eliminar este ingrediente?",
    text: "Será de forma permanente.",
  }).then((result) => {
    if (result.isConfirmed) {
      let datos = new FormData();
      datos.append("opc", "deleteSubRecetaIngrediente");
      datos.append("id_Receta", idReceta);
      datos.append("id_Ingrediente", idIngrediente);
      send_ajax(datos, ctrlSubrecetas).then((data) => {
        if (data === true) {
          alert({
            icon: "success",
            title: "Ingrediente",
            text: "Eliminado correctamente",
            timer: 1000,
          });
          $(btn).closest("tr").remove();
          $(itemCount).text($(tb + " tbody tr").length);
          $(costTotal).text(addCostColumn(tb, 4));
        } else {
          alert({
            icon: "error",
            title: "Ingrediente",
            text: "Error al eliminar",
          });
        }
      });
    }
  });
}

// SUBRECETAS - SUBRECETAS ----------------------------------------------
function deleteSubRecetaSubReceta(
  btn,
  idReceta,
  idSubreceta,
  tb,
  itemCount,
  costTotal
) {
  alert({
    icon: "question",
    title: "¿Está seguro de eliminar esta subreceta?",
    text: "Será de forma permanente.",
  }).then((result) => {
    if (result.isConfirmed) {
      let datos = new FormData();
      datos.append("opc", "deleteSubRecetaSubReceta");
      datos.append("id_Receta", idReceta);
      datos.append("id_SubReceta", idSubreceta);
      send_ajax(datos, ctrlSubrecetas).then((data) => {
        if (data === true) {
          alert({
            icon: "success",
            title: "Subreceta",
            text: "Eliminada correctamente",
            timer: 1000,
          });
          $(btn).closest("tr").remove();
          $(itemCount).text($(tb + " tbody tr").length);
          $(costTotal).text(addCostColumn(tb, 4));
        } else {
          alert({
            icon: "error",
            title: "Subreceta",
            text: "Error al eliminar",
          });
        }
      });
    }
  });
}

// PROCEDIMIENTO CULINARIO ----------------------------------------------
function addProcedimientoCulinarioSub(id) {
  let dtx = new FormData();
  dtx.append("opc", "updateReceta");
  dtx.append("rendimiento", $("#txtRendimientoRec").val());
  dtx.append("precioVenta", $("#txtPrecioVentaRec").val());
  dtx.append("iva", $("#txtIVARec").val());
  dtx.append("idReceta", id);
  if (id === null || id === "null" || id === undefined) {
    alert({
      icon: "error",
      title: "Procedimiento culinario",
      text: "Error al guardar",
      timer: 1000,
    });
    $("#formProcedimientoCulinarioSub button[type='submit']").removeAttr(
      "disabled"
    );
  } else {
    send_ajax(dtx, ctrlSubrecetas).then((data) => {
      if (data === true) {
        $("#formProcedimientoCulinarioSub button[type='submit']").removeAttr(
          "disabled"
        );
        alert({
          icon: "success",
          title: "Procedimiento culinario",
          text: "Guardado correctamente",
        });
      } else {
        alert({
          icon: "error",
          title: "Procedimiento culinario",
          text: "Error al guardar",
        });
      }
    });
  }
}

// FUNCIONES ------------------------------------------------------------
function photoSubReceta() {
  return new Promise((resolve, reject) => {
    let file = $("#photo-subreceta")[0].files[0];
    if (file) {
      $("#content_photo_subreceta span").css({ display: "flex" });
      $("#content_photo_subreceta span").html(
        '<i class="animate-spin icon-spin6"></i> Analizando'
      );
      setTimeout(() => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        $("#content_photo_subreceta span").hide();
        $("#content_photo_subreceta span").removeAttr("style");
        $("#content_photo_subreceta span").addClass("text-uppercase");
        $("#content_photo_subreceta span").html(
          '<i class="icon-camera"></i> Subir foto'
        );
        reader.onload = function (e) {
          $("#imgSubReceta").attr("src", e.target.result);
          resolve();
        };
      }, 500);
    } else {
      $("#imgSubReceta").attr(
        "src",
        "https://minuspain.cl/wp-content/uploads/2021/09/default-placeholder-1.png"
      );
      reject();
    }
  });
}

function uploadPhotoSubReceta() {
  let foto = $("#photo-subreceta")[0].files[0];
  console.log(foto);
  if (foto) {
    let datos = new FormData();
    datos.append("opc", "foto");
    datos.append("foto", foto);
    send_ajax(datos, ctrlPerfil).then((data) => {
      if (data === true) alert();
      else console.log(data);
    });
  }
}
