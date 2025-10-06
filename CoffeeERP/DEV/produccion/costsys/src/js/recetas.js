window.ctrlRecetas = window.ctrlRecetas || "ctrl/ctrl-recetas.php";

function bodyReceta() {
  $("#containerButtonAdd").html(
    `<label col="col-12 d-none d-md-block"> </label>
    <button type="button" class="btn btn-primary col-12" id="btnAddReceta" title="Nueva Receta">
        <i class="icon-plus"></i> Receta
    </button>`
  );
  $(".clasificacion-select").removeClass("hide");
  $("#btnAddReceta").on("click", function () {
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
        addRecetaInterface();
      }
    });
  });
  lsRecetas();

  $("#photo-receta").change(function () {
    photoReceta();
  });
}
// INTERFACES ------------------------------------------------------------
function addRecetaInterface() {
  $("#titleReceta").text(
    "Nueva receta / " + $("#txtcbUDN option:selected").text().toLowerCase()
  );
  $("#containerCatalogo").addClass("hide");
  $("#btnCreateReceta").text("Crear receta");
  $("#btnCreateReceta").removeClass("hide");
  $(".main-rec").addClass("hide");
  $(".secondary-rec").removeClass("hide");
  $("#fillReceta").addClass("hide");
  $("#btnSaveReceta").addClass("hide");
  $("#txtRecetas").prop("disabled", false);
  $("#textareaNotasRec").prop("disabled", false);
  $("#txtcbClasificacionRec").prop("disabled", false);
  $("#txtRecetas").val("");
  $("#textareaNotasRec").val("");
  $("#txtRecetas").focus();
  $("#formAddReceta")[0].reset();
  $("#formAddReceta button[type='submit']").removeAttr("disabled");
  $("#formProcedimientoCulinarioRec button[type='submit']").removeAttr(
    "disabled"
  );
  $("#formAddRecetasIng button[type='submit']").removeAttr("disabled");
  $("#formAddRecetasSub button[type='submit']").removeAttr("disabled");
  $("#formAddReceta :input.is-invalid").removeClass("is-invalid");
  $("#imgReceta").attr(
    "src",
    "https://minuspain.cl/wp-content/uploads/2021/09/default-placeholder-1.png"
  );

  $("#txtcbClasificacionRec").val(
    $("#txtcbClasificacion option:selected").val()
  );

  recipe("create", null);
}

function editRecetaInterface(id) {
  $("#titleReceta").text(
    "Editar receta / " + $("#txtcbUDN option:selected").text().toLowerCase()
  );
  $("#containerCatalogo").addClass("hide");
  $("#btnCreateReceta").text("Actualizar receta");
  $("#btnCreateReceta").removeClass("hide");
  $(".main-rec").addClass("hide");
  $(".secondary-rec").removeClass("hide");
  $("#fillReceta").removeClass("hide");
  $("#btnSaveReceta").addClass("hide");
  $("#txtRecetas").prop("disabled", false);
  $("#textareaNotasRec").prop("disabled", false);
  $("#txtcbClasificacionRec").prop("disabled", false);
  $("#txtRecetas").val("");
  $("#textareaNotasRec").val("");
  $("#txtRecetas").focus();
  $("#formAddReceta")[0].reset();
  $("#formAddReceta button[type='submit']").removeAttr("disabled");
  $("#formProcedimientoCulinarioRec button[type='submit']").removeAttr(
    "disabled"
  );
  $("#formAddRecetasIng button[type='submit']").removeAttr("disabled");
  $("#formAddRecetasSub button[type='submit']").removeAttr("disabled");
  $("#formAddReceta :input.is-invalid").removeClass("is-invalid");

  // Obtener data de ingredientes y subrecetas para select
  let dataIng = actualizarDataIngredientes();
  let dataSub = actualizarDataSubRecetas(
    dataCatalogo.recetas.find((x) => x.id == id).idclasificacion
  );

  // Recuperar datos de la receta
  let foto = dataCatalogo.recetas.find((x) => x.id == id).foto;
  if (foto !== null && foto !== "" && foto !== undefined) {
    $("#imgReceta").attr("src", "https://www.erp-varoch.com/" + foto);
  } else {
    $("#imgReceta").attr(
      "src",
      "https://minuspain.cl/wp-content/uploads/2021/09/default-placeholder-1.png"
    );
  }
  $("#txtRecetas").val(dataCatalogo.recetas.find((x) => x.id == id).valor);
  $("#textareaNotasRec").val(dataCatalogo.recetas.find((x) => x.id == id).nota);
  $("#txtcbClasificacionRec").val(
    dataCatalogo.recetas.find((x) => x.id == id).idclasificacion
  );

  recipe("edit", id);
  culinaryProcedureReceta("edit", id);
  ingredientsAndSubrecetasReceta(id, dataIng, dataSub);
}

function recipe(param, id) {
  // Mayúsculas en el input de recetas
  $("#txtRecetas").on("input", function () {
    this.value = this.value.toUpperCase();
  });

  // Agregar/Editar recetas
  $("#formAddReceta").validation_form({}, async function (result) {
    $("#formAddReceta button[type='submit']").attr("disabled", "disabled");
    let idReceta = param === "create" ? null : id; // Obtener el ID según la condición
    let udn =
      param === "create"
        ? $("#txtcbUDN").val()
        : dataCatalogo.recetas.find((x) => x.id == id).idudn;

    let confirmarGuardado = await validateReceta(idReceta, udn);

    if (confirmarGuardado) {
      if (param === "create") {
        addRecetas();
      } else {
        editRecetas(id);
      }
    } else {
      $("#formAddReceta button[type='submit']").removeAttr("disabled");
    }
  });

  // Cerrar interfaz
  $("#btnCloseReceta").on("click", function () {
    alert({
      icon: "question",
      title: "¿Desea terminar de editar esta receta?",
      text: "Los cambios no guardados se perderán.",
    }).then((result) => {
      if (result.isConfirmed) {
        $("#btnAddReceta").removeClass("hide");
        $(".main-rec").removeClass("hide");
        $(".secondary-rec").addClass("hide");
        $("#formAddReceta")[0].reset();
        $("#containerCatalogo").removeClass("hide");
        $("#containerFormProcCulinarioRec").html("");
        $("#formAddReceta button[type='submit']").removeAttr("disabled");
        $("#formProcedimientoCulinarioRec button[type='submit']").removeAttr(
          "disabled"
        );
        $("#formAddRecetasIng button[type='submit']").removeAttr("disabled");
        $("#formAddRecetasSub button[type='submit']").removeAttr("disabled");
        $("#formAddReceta :input.is-invalid").removeClass("is-invalid");
        $("#imgReceta").attr(
          "src",
          "https://minuspain.cl/wp-content/uploads/2021/09/default-placeholder-1.png"
        );
        lsRecetas();
      }
    });
  });
}

function culinaryProcedureReceta(param, id) {
  // PROCEDIMIENTO CULINARIO
  let json_form_proc_culinario_rec = [];
  if (param === "create") {
    json_form_proc_culinario_rec = [
      {
        opc: "input-group",
        lbl: "Total ingredientes",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "TotalIngredientesRec",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Rendimiento",
        icon: "icon-hash",
        tipo: "cifra",
        id: "RendimientoRec",
        placeholder: "0.00",
        required: true,
      },
      {
        opc: "input-group",
        lbl: "Costo",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "CostoRec",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Precio de venta",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "PrecioVentaRec",
        placeholder: "0.00",
        required: true,
      },
      {
        opc: "input-group",
        lbl: "Margen de contribución",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "MargenConRec",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Porcentaje de costo",
        icon: "icon-percent",
        tipo: "cifra",
        id: "PorcentajeCostoRec",
        placeholder: "100.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "IVA",
        icon: "icon-percent",
        tipo: "cifra",
        id: "IVARec",
        placeholder: "0.00",
        required: true,
      },
      {
        opc: "input-group",
        lbl: "Porcentaje de costo - IVA()",
        icon: "icon-percent",
        tipo: "cifra",
        id: "PorcentajeCostoIVARec",
        placeholder: "100.00",
        disabled: true,
        required: false,
      },
    ];
  } else {
    json_form_proc_culinario_rec = [
      {
        opc: "input-group",
        lbl: "Total ingredientes",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "TotalIngredientesRec",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Rendimiento",
        icon: "icon-hash",
        tipo: "cifra",
        id: "RendimientoRec",
        placeholder: "0.00",
        required: true,
        value: dataCatalogo.recetas.find((x) => x.id == id).rendimiento,
      },
      {
        opc: "input-group",
        lbl: "Costo",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "CostoRec",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Precio de venta",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "PrecioVentaRec",
        placeholder: "0.00",
        required: true,
        value: dataCatalogo.recetas.find((x) => x.id == id).precio,
      },
      {
        opc: "input-group",
        lbl: "Margen de contribución",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "MargenConRec",
        placeholder: "0.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Porcentaje de costo",
        icon: "icon-percent",
        tipo: "cifra",
        id: "PorcentajeCostoRec",
        placeholder: "100.00",
        disabled: true,
        required: false,
      },
      {
        opc: "input-group",
        lbl: "IVA",
        icon: "icon-percent",
        tipo: "cifra",
        id: "IVARec",
        placeholder: "0.00",
        required: true,
        value: dataCatalogo.recetas.find((x) => x.id == id).iva,
      },
      {
        opc: "input-group",
        lbl: "Porcentaje de costo - IVA()",
        icon: "icon-percent",
        tipo: "cifra",
        id: "PorcentajeCostoIVARec",
        placeholder: "100.00",
        disabled: true,
        required: false,
      },
    ];
  }

  let form_proc_rec = $("<form>", {
    id: "formProcedimientoCulinarioRec",
    class: "row row-cols-1",
    novalidate: true,
  });
  // Crear el formulario
  form_proc_rec.html("").simple_json_form({
    data: json_form_proc_culinario_rec,
    name_btn: "Guardar Procedimiento",
  });

  // Anexar el formulario al contenedor
  $("#containerFormProcCulinarioRec").html("");
  form_proc_rec.appendTo("#containerFormProcCulinarioRec");

  $("#txtIVARec").on("input", function () {
    $("#txtPorcentajeCostoIVARec")
      .parent(".input-group")
      .prev("label")
      .html("Porcentaje de costo - IVA(" + $("#txtIVARec").val() + ")");
  });

  // Validation form procedimiento culinario
  $("#formProcedimientoCulinarioRec").validation_form({}, function (result) {
    $("#formProcedimientoCulinarioRec button[type='submit']").attr(
      "disabled",
      "disabled"
    );
    addProcedimientoCulinarioRec(id);
  });
}

function ingredientsAndSubrecetasReceta(id, dataIng, dataSub) {
  // Objetos para ambos modulos
  let object_table = {
    f_size: "14",
    color_th: "bg-primary",
    ipt: [3],
  };

  // INGREDIENTES
  let json_form_rec_ing = [
    {
      opc: "btn",
      class: "float-end",
      btn_class: "btn-close",
      fn: "closeForm('#formAddRecetasIng', '#contentTableRecetasIng', '#addRecetasIng')",
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
  let dtx_rec_ing = {
    opc: "tbRecetasIngredientes",
    idReceta: id,
  };

  // Objetos para el modulo de ingredientes
  let object_frm_ing = {
    id_Receta: id,
    opc: "createRecetasIngredientes",
  };
  let object_event_ing = {
    opc: "updateRecetasIngredientes",
    id_Receta: id,
  };
  let object_attr_json_frm_ing = {
    name_btn: "Agregar Ingrediente",
  };
  let object_alert_ing = {
    icon: "success",
    title: "Ingrediente",
    text: "Ingrediente guardado correctamente",
  };

  // Modulo recetas-ingredientes
  $("#frmAndTbRecetasIng").modulo_1({
    json_frm: json_form_rec_ing,
    datos: dtx_rec_ing,
    enlace: ctrlRecetas,
    content_table: "contentTableRecetasIng",
    frm: "formAddRecetasIng",
    table: "tbRecetasIng",
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
  let json_form_rec_sub = [
    {
      opc: "btn",
      class: "float-end",
      btn_class: "btn-close",
      fn: "closeForm('#formAddRecetasSub', '#contentTableRecetasSub', '#addRecetasSub')",
    },
    {
      opc: "select",
      lbl: "Subreceta",
      id: "id_Subreceta",
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
  let dtx_rec_sub = {
    opc: "tbRecetasSubRecetas",
    idReceta: id,
  };

  // Objetos para el modulo de subrecetas
  let object_frm_sub = {
    id_Receta: id,
    opc: "createRecetasSubRecetas",
  };
  let object_event_sub = {
    opc: "updateRecetasSubRecetas",
    id_Receta: id,
  };
  let object_attr_json_frm_sub = {
    name_btn: "Agregar Subreceta",
  };
  let object_alert_sub = {
    icon: "success",
    title: "Subreceta",
    text: "Subreceta guardada correctamente",
  };

  // Modulo recetas-subrecetas
  if (dataSub.length > 0) {
    $("#frmAndTbRecetasSub").modulo_1({
      json_frm: json_form_rec_sub,
      datos: dtx_rec_sub,
      enlace: ctrlRecetas,
      content_table: "contentTableRecetasSub",
      frm: "formAddRecetasSub",
      table: "tbRecetasSub",
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
  $("#txtid_Subreceta").option_select({
    data: dataSub,
    select2: true,
    group: false,
    placeholder: "Selecciona una subreceta",
  });
  // Cargar el select de subrecetas de acuerdo a la clasificación
  $("#txtcbClasificacionRec").on("change", function () {
    let dataSub = actualizarDataSubRecetas($(this).val());
    $("#txtid_Subreceta").html("");
    $("#txtid_Subreceta").option_select({
      data: dataSub,
      select2: true,
      group: false,
      placeholder: "Selecciona una subreceta",
    });
  });

  // Estilos
  // Ingredientes
  $("#formAddRecetasIng").parent().addClass("p-0 m-0");
  $("#formAddRecetasIng").children().eq(3).removeClass("mb-3").addClass("mb-2");
  $("#formAddRecetasIng button[type='submit']")
    .removeClass("mt-4")
    .addClass("mt-3");
  // Subrecetas
  $("#formAddRecetasSub").parent().addClass("p-0 m-0");
  $("#formAddRecetasSub").children().eq(3).removeClass("mb-3").addClass("mb-2");
  $("#formAddRecetasSub button[type='submit']")
    .removeClass("mt-4")
    .addClass("mt-3");
  // Procedimiento culinario
  $("#formProcedimientoCulinarioRec button[type='submit']")
    .removeClass("mt-4")
    .addClass("mt-3");
}

// RECETA ----------------------------------------------------------------
async function validateReceta(id, udn) {
  const confirmacionInicial = await alert({
    icon: "question",
    title: "¿Está seguro de guardar esta receta?",
  });

  if (!confirmacionInicial.isConfirmed) return false;

  const nameReceta = $("#txtRecetas").val().toUpperCase().trim();

  let datos = new FormData();
  datos.append("opc", "validateReceta");
  datos.append("nombre", nameReceta);
  datos.append("udn", udn);

  // Validar si existe la subreceta
  data = await send_ajax(datos, ctrlRecetas);

  if (data && data.length > 0) {
    let nombres = "";
    let idReceta = [];
    let id_udn = "";

    data.forEach((element) => {
      nombres += element.nombre + ", ";
      idReceta += element.id;
      id_udn += element.id_udn + ", ";

      if (id === element.id) {
        return true;
      }
    });

    let existe = data.some(
      (x) => x.nombre === nameReceta && x.id_udn === udn && x.id !== id
    );
    if (existe === true) {
      if (id_udn == udn) {
        let confirmacionSimilar = await alert({
          icon: "question",
          title:
            "Se encontraron recetas relacionadas con este nombre ¿Deseas continuar?",
          text: "Recetas existentes:\n" + nombres,
        });
        if (confirmacionSimilar.isConfirmed) {
          alert({
            icon: "error",
            title: "Lo sentimos",
            text: `El nombre "${nameReceta}" ya existe, intente con otro nombre.`,
            btn1: true,
          });
          return false;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      console.log("Receta no existe");
      return true;
    }
  }
  return true;
}

function addRecetas() {
  let foto = $("#photo-receta")[0].files[0];

  let datos = new FormData();
  datos.append("opc", "createReceta");
  datos.append("nombre", $("#txtRecetas").val());
  datos.append("id_Clasificacion", $("#txtcbClasificacionRec").val());
  datos.append("nota", $("#textareaNotasRec").val());
  datos.append("id_UDN", $("#txtcbUDN").val());
  datos.append("foto", foto);
  send_ajax(datos, ctrlRecetas).then((data) => {
    if (data !== false && data !== null && data !== "null" && data !== "") {
      alert({
        icon: "success",
        title: "Receta",
        text: "Receta creada correctamente",
      });
      console.log(data.idReceta);
      $("#fillReceta").removeClass("hide");
      $("#txtRecetas").prop("disabled", true);
      $("#txtcbClasificacionRec").prop("disabled", true);
      $("#btnCreateReceta").addClass("hide");
      $("#btnSaveReceta").removeClass("hide");
      $("#txtcbClasificacionSub").prop("disabled", true);
      $("#formAddReceta button[type='submit']").removeAttr("disabled");
      let dataIng = actualizarDataIngredientes();
      let dataSub = actualizarDataSubRecetas($("#txtcbClasificacionRec").val());
      culinaryProcedureReceta("create", data.idReceta);
      ingredientsAndSubrecetasReceta(data.idReceta, dataIng, dataSub);
      // Guardar datos de la receta
      $("#btnSaveReceta").on("click", function () {
        $("#textareaNotasRec").prop("disabled", false);
        alert({
          icon: "question",
          title: "¿Está seguro de guardar la receta?",
        }).then((result) => {
          if (result.isConfirmed) {
            editRecetas(data.idReceta);
          }
        });
      });
    } else {
      alert({
        icon: "error",
        title: "Receta",
        text: "Error al guardar la receta",
      });
    }
  });
}

function editRecetas(id) {
  let foto = $("#photo-receta")[0].files[0];

  let dtx = new FormData();
  dtx.append("opc", "updateReceta");
  dtx.append("nombre", $("#txtRecetas").val());
  dtx.append("id_Clasificacion", $("#txtcbClasificacionRec").val());
  dtx.append("nota", $("#textareaNotasRec").val());
  dtx.append("rendimiento", $("#txtRendimientoRec").val());
  dtx.append("precioVenta", $("#txtPrecioVentaRec").val());
  dtx.append("iva", $("#txtIVARec").val());
  dtx.append("foto", foto);
  dtx.append("idReceta", id);
  send_ajax(dtx, ctrlRecetas).then((data) => {
    if (data !== false && data !== null && data !== "null" && data !== "") {
      alert({
        icon: "success",
        title: "Receta",
        text: "Guardado correctamente",
      });
      $("#formAddReceta button[type='submit']").removeAttr("disabled");
      // Cambiar datos de dataCatalogo
      if (dataCatalogo.recetas.find((x) => x.id == id) !== undefined) {
        dataCatalogo.recetas.find((x) => x.id == id).valor =
          $("#txtRecetas").val();
        dataCatalogo.recetas.find((x) => x.id == id).idclasificacion = $(
          "#txtcbClasificacionRec"
        ).val();
        dataCatalogo.recetas.find((x) => x.id == id).clasificacion = $(
          "#txtcbClasificacionRec option:selected"
        ).text();
        dataCatalogo.recetas.find((x) => x.id == id).nota =
          $("#textareaNotasRec").val();
        dataCatalogo.recetas.find((x) => x.id == id).rendimiento =
          $("#txtRendimientoRec").val();
        dataCatalogo.recetas.find((x) => x.id == id).precio =
          $("#txtPrecioVentaRec").val();
        dataCatalogo.recetas.find((x) => x.id == id).iva =
          $("#txtIVARec").val();
        dataCatalogo.recetas.find((x) => x.id == id).foto = data.rutaFoto;
      } else {
        // Agregar a dataCatalogo la nueva receta
        dataCatalogo.recetas.push({
          id: id,
          valor: $("#txtRecetas").val(),
          idclasificacion: $("#txtcbClasificacionRec").val(),
          clasificacion: $("#txtcbClasificacionRec option:selected").text(),
          nota: $("#textareaNotasRec").val(),
          rendimiento: $("#txtRendimientoRec").val(),
          precio: $("#txtPrecioVentaRec").val(),
          iva: $("#txtIVARec").val(),
          foto: data.rutaFoto,
        });
      }

    } else {
      alert({
        icon: "error",
        title: "Receta",
        text: "Error al actualizar la receta",
      });
    }
  });
}

// RECETAS - INGREDIENTES -----------------------------------------------
function deleteRecetasIngredientes(
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
      datos.append("opc", "deleteRecetasIngredientes");
      datos.append("id_Receta", idReceta);
      datos.append("id_Ingrediente", idIngrediente);
      send_ajax(datos, ctrlRecetas).then((data) => {
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

// RECETAS - SUBRECETAS -------------------------------------------------
function deleteRecetasSubRecetas(
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
      datos.append("opc", "deleteRecetasSubRecetas");
      datos.append("id_Receta", idReceta);
      datos.append("id_SubReceta", idSubreceta);
      send_ajax(datos, ctrlRecetas).then((data) => {
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
function addProcedimientoCulinarioRec(id) {
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
    $("#formProcedimientoCulinarioRec button[type='submit']").removeAttr(
      "disabled"
    );
  } else {
    send_ajax(dtx, ctrlRecetas).then((data) => {
      if (data === true) {
        $("#formProcedimientoCulinarioRec button[type='submit']").removeAttr(
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
function photoReceta() {
  let file = $("#photo-receta")[0].files[0];
  if (file) {
    $("#content_photo_receta span").css({ display: "flex" });
    $("#content_photo_receta span").html(
      '<i class="animate-spin icon-spin6"></i> Analizando'
    );
    setTimeout(() => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      $("#content_photo_receta span").hide();
      $("#content_photo_receta span").removeAttr("style");
      $("#content_photo_receta span").addClass("text-uppercase");
      $("#content_photo_receta span").html(
        '<i class="icon-camera"></i> Subir foto'
      );
      reader.onload = function (e) {
        $("#imgReceta").attr("src", e.target.result);
        // resolve();
      };
    }, 500);
  }
}
