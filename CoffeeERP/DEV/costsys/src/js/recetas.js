window.ctrlRecetas = window.ctrlRecetas || "ctrl/ctrl-recetas.php";

let data_table_rec_sub = {};
let data_event_rec_sub = {};

function bodyReceta() {
  // Agregar el boton de agregar receta
  $("#containerButtonAdd").html(
    `<label col="col-12 d-none d-md-block"> </label>
    <button type="button" class="btn btn-primary col-12" id="btnAddReceta" title="Nueva Receta">
        <i class="icon-plus"></i> Receta
    </button>`
  );

  // Mostrar la clasificación
  $(".clasificacion-select").removeClass("hide");
  // Para el cambio de pestañas, cuando se van a catalogo de recetas
  if ($(".secondary-rec").hasClass("hide")) {
    $("#containerCatalogo").removeClass("hide");
  }
  // Mostrar la UDN de lista de recetas
  $("#containerTitleRecetas").html(
    "Lista de recetas / " +
      `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
        .text()
        .toLowerCase()}</span>`
  );
  // Agregar una receta alerta de confirmación
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
  // Mostrar las recetas
  lsRecetas();
//   applyPermissions();

  // Evento para la foto de la receta
  $("#photo-receta").change(function () {
    photoReceta();
  });
}

//? Opciones recetas
function handleActionReceta(id, action) {
  switch (action) {
    case "Ver":
      showReceta(id);
      break;
    case "Editar":
      editRecetaInterface(id);
      break;
    case "Subclasificación":
      updateSubclassificationsReceta(id);
      break;
    case "Soft":
      vincularSoftReceta(id);
      break;
    case "Recetario":
      procedureReceta(id);
      break;
    case "Observaciones":
      observationReceta(id);
      break;
    case "Imprimir":
      printReceta(id);
      break;
  }
}

//? Desplegar receta
function dropdownReceta(id) {
  let dropdownMenu = `
        <ul class="dropdown-menu" aria-labelledby="aDropdownReceta${id}" data-popper-placement="bottom-end">
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemVerReceta" href="#" onclick="handleActionReceta(${id}, 'Ver')"><i class="text-info icon-eye"></i> Ver</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemEditarReceta" href="#" onclick="handleActionReceta(${id}, 'Editar')"><i class="text-info icon-pencil-5"></i> Editar</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemSubClassReceta" href="#" onclick="handleActionReceta(${id}, 'Subclasificación')"><i class="text-info icon-cw"></i> Act. Subclasificación</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemSoftReceta" href="#" onclick="handleActionReceta(${id}, 'Soft')"><i class="text-info icon-link-2"></i> Vincular</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemRecetarioReceta" href="#" onclick="handleActionReceta(${id}, 'Recetario')"><i class="text-info icon-comment-1"></i> Recetario</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemObservacionesReceta" href="#" onclick="handleActionReceta(${id}, 'Observaciones')"><i class="text-info icon-search-5"></i> Observaciones</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemDescargarReceta" href="#" onclick="handleActionReceta(${id}, 'Imprimir')"><i class="text-info icon-print"></i> Imprimir</a></li>
        </ul>
      `;

  //   $(`#aDropdownReceta${id}`).after(dropdownMenu);
  if (!$(`#aDropdownReceta${id}`).next(".dropdown-menu").length) {
    $(`#aDropdownReceta${id}`).after(dropdownMenu);
  }
}

//* INTERFACES ------------------------------------------------------------
//? Agregar receta interfaz y eventos.
function addRecetaInterface() {
  // Cambiar el título de la interfaz addReceta
  $("#titleReceta").html(
    "Nueva receta / " +
      `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
        .text()
        .toLowerCase()}</span>`
  );
  // Ocultar el catálogo de recetas
  $("#containerCatalogo").addClass("hide");
  $(".main-rec").addClass("hide");
  $("#btnSaveReceta").addClass("hide");
  $("#fillReceta").addClass("hide");
  // Mostrar la interfaz de recetas
  $(".secondary-rec").removeClass("hide");
  $("#btnCreateReceta").removeClass("hide");
  $("#btnSoftReceta").removeClass("hide");
  // Habilitar los campos de formAddReceta
  $("#txtRecetas").prop("disabled", false);
  $("#textareaNotasRec").prop("disabled", false);
  $("#txtcbClasificacionRec").prop("disabled", false);
  $("#txtcbSubClasificacionRec").prop("disabled", false);
  $("#btnSoftReceta").prop("disabled", true);
  $("#txtRecetas").val("");
  $("#textareaNotasRec").val("");
  $("#txtRecetas").focus();
  // Cambiar el texto del botón de guardar
  $("#btnCreateReceta").text("Crear receta");
  // Habilitar los botones de submit
  $("#formAddReceta button[type='submit']").removeAttr("disabled");
  $("#formProcedimientoCulinarioRec button[type='submit']").removeAttr(
    "disabled"
  );
  $("#formAddRecetasIng button[type='submit']").removeAttr("disabled");
  $("#formAddRecetasSub button[type='submit']").removeAttr("disabled");
  // Eliminar las clases de error
  $("#formAddReceta :input.is-invalid").removeClass("is-invalid");
  // Cargar imagen por defecto
  $("#imgReceta").attr(
    "src",
    "./src/img/default.png"
  );
  $("#content_photo_receta p").addClass("hide").removeClass("d-flex");
  // Obtener la clasificación seleccionada para la nueva receta
  $("#txtcbClasificacionRec").val(
    $("#txtcbClasificacion option:selected").val()
  );
  // Filtrar las subclasificaciones de acuerdo a la clasificación seleccionada
  let dataSubClass = updateSubclassifications(
    $("#txtcbClasificacionRec").val()
  );
  // Cargar select de subclasificaciones
  if (dataSubClass.length > 0) {
    $("#txtcbSubClasificacionRec").option_select({
      data: dataSubClass,
      select2: true,
      group: false,
      placeholder: "SELECCIONA UNA SUBCLASIFICACIÓN",
    });
  } else {
    $("#txtcbSubClasificacionRec").option_select({
      select2: true,
      group: false,
      placeholder: "NO HAY SUBCLASIFICACIONES",
      disabled: true,
    });
  }
  // Evento para cambiar las subclasificaciones de acuerdo a la clasificación
  $("#txtcbClasificacionRec").on("change", function () {
    let dataSubClass = updateSubclassifications($(this).val());
    $("#txtcbSubClasificacionRec").html("");
    if (dataSubClass.length > 0) {
      $("#txtcbSubClasificacionRec").prop("disabled", false).option_select({
        data: dataSubClass,
        select2: true,
        group: false,
        placeholder: "SELECCIONA UNA SUBCLASIFICACIÓN",
      });
    } else {
      $("#txtcbSubClasificacionRec").prop("disabled", true).option_select({
        select2: true,
        placeholder: "NO HAY SUBCLASIFICACIONES",
      });
    }
  });
  $("#btnCloseReceta").removeClass("mt-4");
  $("#btnCloseReceta").addClass("mt-2");

  // Llamar a la función de receta
  recipe("create", null);
}

//? Editar receta interfaz y eventos.
function editRecetaInterface(id) {
  // Cambiar el título de la interfaz editReceta
  $("#titleReceta").html(
    "Editar receta / " +
      `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
        .text()
        .toLowerCase()}</span>`
  );
  // Ocultar el catálogo de recetas
  $("#containerCatalogo").addClass("hide");
  $(".main-rec").addClass("hide");
  $("#btnSaveReceta").addClass("hide");
  // Mostrar la interfaz de editRecetas
  $("#fillReceta").removeClass("hide");
  $(".secondary-rec").removeClass("hide");
  $("#btnCreateReceta").removeClass("hide");
  $("#btnSoftReceta").removeClass("hide");
  // Habilitar los campos de formAddReceta
  $("#txtRecetas").prop("disabled", false);
  $("#textareaNotasRec").prop("disabled", false);
  $("#txtcbClasificacionRec").prop("disabled", false);
  $("#txtcbSubClasificacionRec").prop("disabled", false);
  $("#btnSoftReceta").prop("disabled", false);
  $("#txtRecetas").val("");
  $("#textareaNotasRec").val("");
  $("#txtRecetas").focus();
  // Cambiar el texto del botón de actualizar
  $("#btnCreateReceta").text("Actualizar receta");
  // Habilitar los botones de submit
  $("#formAddReceta button[type='submit']").removeAttr("disabled");
  $("#formProcedimientoCulinarioRec button[type='submit']").removeAttr(
    "disabled"
  );
  $("#formAddRecetasIng button[type='submit']").removeAttr("disabled");
  $("#formAddRecetasSub button[type='submit']").removeAttr("disabled");
  // Eliminar las clases is-invalid
  $("#formAddReceta :input.is-invalid").removeClass("is-invalid");

  // Filtrar ingredientes y subrecetas por clasificación de la receta
  let dataIng = updateDataIngredientes();
//   let dataSub = updateDataSubRecetas(
//     dataRec.find((x) => x.id == id).idclasificacion
//   );
  let dataSub = updateDataSubRecetas();

  // Filtrar las subclasificaciones de acuerdo a la clasificación de la receta
  let dataSubClass = updateSubclassifications(
    dataRec.find((x) => x.id == id).idclasificacion
  );
  // Cargar select de subclasificaciones
  if (dataSubClass.length > 0) {
    $("#txtcbSubClasificacionRec").option_select({
      data: dataSubClass,
      select2: true,
      group: false,
      placeholder: "SELECCIONA UNA SUBCLASIFICACIÓN",
    });
  } else {
    $("#txtcbSubClasificacionRec").option_select({
      select2: true,
      group: false,
      placeholder: "NO HAY SUBCLASIFICACIONES",
      disabled: true,
    });
  }
  // Evento para cambiar las subclasificaciones de acuerdo a la clasificación
  $("#txtcbClasificacionRec").on("change", function () {
    let dataSubClass = updateSubclassifications($(this).val());
    $("#txtcbSubClasificacionRec").html("");
    if (dataSubClass.length > 0) {
      $("#txtcbSubClasificacionRec").prop("disabled", false).option_select({
        data: dataSubClass,
        select2: true,
        group: false,
        placeholder: "SELECCIONA UNA SUBCLASIFICACIÓN",
      });
    } else {
      $("#txtcbSubClasificacionRec").prop("disabled", true).option_select({
        select2: true,
        placeholder: "NO HAY SUBCLASIFICACIONES",
      });
    }
  });

  // Evento para el boton de vincular soft
  $("#btnSoftReceta")
    .off("click")
    .on("click", function () {
      vincularSoftReceta(id);
    });

  // Recuperar datos de la receta
  let foto = dataRec.find((x) => x.id == id).foto;

  if (foto !== null && foto !== "" && foto !== undefined && foto !== "erp_files/default.png") {
    // Hacer un explote por el nombre de la foto
    let fotoSplit = foto.split("/");
    if (fotoSplit[0] == "erp_files") {
        // Cargar la foto de la receta
        $("#imgReceta").attr("src", "https://www.erp-varoch.com/" + foto);
    } else {
        // Cargar la foto de la receta
        $("#imgReceta").attr("src", "https://www.erp-varoch.com/ERP/" + foto);
    }
    $("#content_photo_receta p").removeClass("hide").addClass("d-flex");
  } else {
    // Cargar imagen por defecto
    $("#imgReceta").attr(
      "src",
      "./src/img/default.png"
    );
    $("#content_photo_receta p").addClass("hide").removeClass("d-flex");
  }

  // Rellenar los campos de la receta
  $("#txtRecetas").val(dataRec.find((x) => x.id == id).valor);
  $("#textareaNotasRec").val(dataRec.find((x) => x.id == id).observaciones);
  $("#txtcbClasificacionRec").val(
    dataRec.find((x) => x.id == id).idclasificacion
  );
  $("#txtcbSubClasificacionRec")
    .val(dataRec.find((x) => x.id == id).idsubclasificacion)
    .trigger("change");

  $("#btnCloseReceta").removeClass("mt-4");
  $("#btnCloseReceta").addClass("mt-2");

    // Borra la foto
    deletePhotoReceta(id);

  // Llamar a las funciones de receta y procedimiento culinario
  recipe("edit", id);
  culinaryProcedureReceta("edit", id);
  ingredientsAndSubrecetasReceta(id, dataIng, dataSub);
}

//? Maneja la validación para agregar o editar recetas.
function recipe(param, id) {
  // Mayúsculas en el input nombre
  $("#txtRecetas").on("input", function () {
    this.value = this.value.toUpperCase();
  });

  // Agregar/Editar recetas
  $("#formAddReceta").validation_form({}, async function (result) {
    $("#formAddReceta button[type='submit']").attr("disabled", "disabled");
    let idReceta = param === "create" ? null : id; // Obtener el ID según la condición
    let udn =
      param === "edit"
        ? dataRec.find((x) => x.id == id).idudn
        : $("#txtcbUDN").val();

    // Validar si la receta ya existe
    let confirmarGuardado = await validateReceta(idReceta, udn);

    if (confirmarGuardado) {
      if (param === "create") {
        addRecetas();
      } else if (param === "edit") {
        editRecetas(id);
      }
    } else {
      $("#formAddReceta button[type='submit']").removeAttr("disabled");
    }
  });

  // Cerrar interfaz
  $("#btnCloseReceta")
    .off()
    .on("click", function () {
      let alert_close_receta = "";
      if (param === "create") {
        alert_close_receta = alert({
          icon: "question",
          title: "¿Desea regresar a la página principal?",
          text: "Los datos que NO han sido guardados se perderán.",
        });
        lsRecetas();
      } else if (param === "edit") {
        alert_close_receta = alert({
          icon: "question",
          title: "¿Desea terminar de editar esta receta?",
          text: "Los cambios NO guardados se perderán.",
        });
        lsRecetas();
      }

      alert_close_receta.then((result) => {
        if (result.isConfirmed) {
          // Ocultar la interfaz de addSubReceta / editSubReceta
          $(".secondary-rec").addClass("hide");
          $("#formAddReceta")[0].reset();
          $("#containerFormProcCulinarioRec").html("");
          $("#frmAndTbRecetasIng").html("");
          $("#frmAndTbRecetasSub").html("");
          // Habilitar los botones de submit
          $("#formAddReceta button[type='submit']").removeAttr("disabled");
          $("#formProcedimientoCulinarioRec button[type='submit']").removeAttr(
            "disabled"
          );
          $("#formAddRecetasIng button[type='submit']").removeAttr("disabled");
          $("#formAddRecetasSub button[type='submit']").removeAttr("disabled");
          // Eliminar las clases is-invalid
          $("#formAddReceta :input.is-invalid").removeClass("is-invalid");
          // Cargar imagen por defecto
          $("#imgReceta").attr(
            "src",
            "./src/img/default.png"
          );
          // Mostrar la interfaz de catálogo de recetas
          $("#btnAddReceta").removeClass("hide");
          $(".main-rec").removeClass("hide");
          $("#containerCatalogo").removeClass("hide");
          lsRecetas();
        }
      });
    });
}

//? Procedimiento culinario intefaz y eventos.
function culinaryProcedureReceta(param, id) {
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
        lbl: "Impuestos",
        icon: "icon-percent",
        tipo: "cifra",
        id: "IVARec",
        placeholder: "0.00",
        required: false,
      },
      {
        opc: "input-group",
        lbl: "Precio de venta sin impuestos",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "PrecioVentaImpuestosRec",
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
    ];
  } else {
    let precioVenta = dataRec.find((x) => x.id == id).precio;
    let impuestos = dataRec.find((x) => x.id == id).iva;
    let precioVentaImpuestos = precioVenta / (1 + impuestos / 100);
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
        value: dataRec.find((x) => x.id == id).totalIng,
      },
      {
        opc: "input-group",
        lbl: "Rendimiento",
        icon: "icon-hash",
        tipo: "cifra",
        id: "RendimientoRec",
        placeholder: "0.00",
        required: true,
        value: dataRec.find((x) => x.id == id).rendimiento,
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
        value: dataRec.find((x) => x.id == id).costo,
      },
      {
        opc: "input-group",
        lbl: "Precio de venta",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "PrecioVentaRec",
        placeholder: "0.00",
        required: true,
        value: dataRec.find((x) => x.id == id).precio,
      },
      {
        opc: "input-group",
        lbl: "Impuestos",
        icon: "icon-percent",
        tipo: "cifra",
        id: "IVARec",
        placeholder: "0.00",
        required: false,
        value: dataRec.find((x) => x.id == id).iva,
        align: "right",
      },
      {
        opc: "input-group",
        lbl: "Precio de venta sin impuestos",
        icon: "icon-dollar",
        tipo: "cifra",
        id: "PrecioVentaImpuestosRec",
        placeholder: "0.00",
        disabled: true,
        required: false,
        value: precioVentaImpuestos.toFixed(2),
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
        value: dataRec.find((x) => x.id == id).mc,
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
        value: dataRec.find((x) => x.id == id).porcentaje,
        align: "right",
      },
    ];
  }

  // Crear el formulario
  let form_proc_rec = $("<form>", {
    id: "formProcedimientoCulinarioRec",
    class: "row row-cols-1",
    novalidate: true,
  });
  form_proc_rec.html("").simple_json_form({
    data: json_form_proc_culinario_rec,
    name_btn: "Guardar Procedimiento",
  });

  // Anexar el formulario al contenedor
  $("#containerFormProcCulinarioRec").html("");
  form_proc_rec.appendTo("#containerFormProcCulinarioRec");

  // EVENTOS
  // Evento para el input rendimiento
  $("#txtRendimientoRec").on("input", function () {
    // Inicializar variables
    let rendimiento =
      $(this).val() === "" ? 0 : parseFloat($(this).val().replace(/,/g, ""));
    let totalIng =
      $("#txtTotalIngredientesRec").val() === ""
        ? 0
        : parseFloat($("#txtTotalIngredientesRec").val().replace(/,/g, ""));
    let precioVenta =
      $("#txtPrecioVentaRec").val() === ""
        ? 0
        : parseFloat($("#txtPrecioVentaRec").val().replace(/,/g, ""));
    let impuestos =
      $("#txtIVARec").val() === ""
        ? 0
        : parseFloat($("#txtIVARec").val().replace(/,/g, ""));

    // Calcular el costo
    let costo = rendimiento === 0 ? 0 : totalIng / rendimiento;
    // Calcular el precio de venta sin impuestos
    let precioVentaImpuestos =
      impuestos === 0 ? precioVenta : precioVenta / (1 + impuestos / 100);
    // Calcular el margen de contribución
    let margenCon = precioVentaImpuestos - costo;
    // Calcular el porcentaje de costo
    let porcentajeCosto =
      precioVentaImpuestos === 0 ? 0 : (costo * 100) / precioVentaImpuestos;

    // Dar formato a los campos a los que les afecta el rendimiento
    let costoFormat = costo.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    let margenConFormat = margenCon.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    let porcentajeCostoFormat = porcentajeCosto.toLocaleString("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });

    // Validaciones de NaN
    if (isNaN(costo) || costo === Infinity) {
      costoFormat = "0.00";
    }
    if (isNaN(margenCon)) {
      margenConFormat = "0.00";
    }
    if (isNaN(porcentajeCosto) || porcentajeCosto === Infinity) {
      porcentajeCostoFormat = "0.00";
    }

    // Asignar valores a los inputs
    $("#txtCostoRec").val(costoFormat);
    $("#txtMargenConRec").val(margenConFormat);
    $("#txtPorcentajeCostoRec").val(porcentajeCostoFormat);

    // Validar margen de contribución y porcentaje de costo para cambiar de color
    if ($("#txtMargenConRec").val().replace(/,/g, "") < 0.0) {
      $("#txtMargenConRec").addClass("is-invalid");
      $("#txtMargenConRec").prev("span").addClass("bg-danger");
    } else {
      $("#txtMargenConRec").removeClass("is-invalid");
      $("#txtMargenConRec").prev("span").removeClass("bg-danger");
    }

    if ($("#txtPorcentajeCostoRec").val().replace(/,/g, "") > 100.0) {
      $("#txtPorcentajeCostoRec").addClass("is-invalid");
      $("#txtPorcentajeCostoRec").next("span").addClass("bg-danger");
    } else {
      $("#txtPorcentajeCostoRec").removeClass("is-invalid");
      $("#txtPorcentajeCostoRec").next("span").removeClass("bg-danger");
    }
  });

  // Evento para el input precio de venta
  $("#txtPrecioVentaRec").on("input", function () {
    // Inicializar variables
    let rendimiento =
      $("#txtRendimientoRec").val() === ""
        ? 0
        : parseFloat($("#txtRendimientoRec").val().replace(/,/g, ""));
    let totalIng =
      $("#txtTotalIngredientesRec").val() === ""
        ? 0
        : parseFloat($("#txtTotalIngredientesRec").val().replace(/,/g, ""));
    let precioVenta =
      $(this).val() === "" ? 0 : parseFloat($(this).val().replace(/,/g, ""));
    let impuestos =
      $("#txtIVARec").val() === ""
        ? 0
        : parseFloat($("#txtIVARec").val().replace(/,/g, ""));

    // Calcular el costo
    let costo = rendimiento === 0 ? 0 : totalIng / rendimiento;
    // Calcular el precio de venta sin impuestos
    let precioVentaImpuestos =
      impuestos === 0 ? precioVenta : precioVenta / (1 + impuestos / 100);
    // Calcular el margen de contribución
    let margenCon = precioVentaImpuestos - costo;
    // Calcular el porcentaje de costo
    let porcentajeCosto =
      precioVentaImpuestos === 0 ? 0 : (costo * 100) / precioVentaImpuestos;

    // Dar formato a los campos a los que les afecta el precio de venta
    let precioVentaImpuestosFormat = precioVentaImpuestos.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
    let margenConFormat = margenCon.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    let porcentajeCostoFormat = porcentajeCosto.toLocaleString("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });

    // Validaciones de NaN
    if (isNaN(precioVentaImpuestos) || precioVentaImpuestos === Infinity) {
      precioVentaImpuestosFormat = "0.00";
    }
    if (isNaN(margenCon)) {
      margenConFormat = "0.00";
    }
    if (isNaN(porcentajeCosto) || porcentajeCosto === Infinity) {
      porcentajeCostoFormat = "0.00";
    }

    // Asignar valores a los inputs
    $("#txtPrecioVentaImpuestosRec").val(precioVentaImpuestosFormat);
    $("#txtMargenConRec").val(margenConFormat);
    $("#txtPorcentajeCostoRec").val(porcentajeCostoFormat);

    // Validar margen de contribución y porcentaje de costo para cambiar de color
    if ($("#txtMargenConRec").val().replace(/,/g, "") < 0.0) {
      $("#txtMargenConRec").addClass("is-invalid");
      $("#txtMargenConRec").prev("span").addClass("bg-danger");
    } else {
      $("#txtMargenConRec").removeClass("is-invalid");
      $("#txtMargenConRec").prev("span").removeClass("bg-danger");
    }

    if ($("#txtPorcentajeCostoRec").val().replace(/,/g, "") > 100.0) {
      $("#txtPorcentajeCostoRec").addClass("is-invalid");
      $("#txtPorcentajeCostoRec").next("span").addClass("bg-danger");
    } else {
      $("#txtPorcentajeCostoRec").removeClass("is-invalid");
      $("#txtPorcentajeCostoRec").next("span").removeClass("bg-danger");
    }
  });

  // Evento para el input impuestos
  $("#txtIVARec").on("input", function () {
    // Inicializar variables
    let rendimiento =
      $("#txtRendimientoRec").val() === ""
        ? 0
        : parseFloat($("#txtRendimientoRec").val().replace(/,/g, ""));
    let totalIng =
      $("#txtTotalIngredientesRec").val() === ""
        ? 0
        : parseFloat($("#txtTotalIngredientesRec").val().replace(/,/g, ""));
    let precioVenta =
      $("#txtPrecioVentaRec").val() === ""
        ? 0
        : parseFloat($("#txtPrecioVentaRec").val().replace(/,/g, ""));
    let impuestos =
      $(this).val() === "" ? 0 : parseFloat($(this).val().replace(/,/g, ""));

    // Calcular el costo
    let costo = rendimiento === 0 ? 0 : totalIng / rendimiento;
    // Calcular el precio de venta sin impuestos
    let precioVentaImpuestos =
      impuestos === 0 ? precioVenta : precioVenta / (1 + impuestos / 100);
    // Calcular el margen de contribución
    let margenCon =
      costo === 0 || precioVentaImpuestos === 0
        ? 0
        : precioVentaImpuestos - costo;
    // Calcular el porcentaje de costo
    let porcentajeCosto =
      precioVentaImpuestos === 0 ? 0 : (costo * 100) / precioVentaImpuestos;

    // Dar formato a los campos a los que les afecta el impuesto
    let precioVentaImpuestosFormat = precioVentaImpuestos.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
    let margenConFormat = margenCon.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    let porcentajeCostoFormat = porcentajeCosto.toLocaleString("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });

    // Validaciones de NaN
    if (isNaN(precioVentaImpuestos) || precioVentaImpuestos === Infinity) {
      precioVentaImpuestosFormat = "0.00";
    }
    if (isNaN(margenCon)) {
      margenConFormat = "0.00";
    }
    if (isNaN(porcentajeCosto)) {
      porcentajeCostoFormat = "0.00";
    }

    // Asignar valores a los inputs
    $("#txtPrecioVentaImpuestosRec").val(precioVentaImpuestosFormat);
    $("#txtMargenConRec").val(margenConFormat);
    $("#txtPorcentajeCostoRec").val(porcentajeCostoFormat);

    // Validar margen de contribución y porcentaje de costo para cambiar de color
    if ($("#txtMargenConRec").val().replace(/,/g, "") < 0.0) {
      $("#txtMargenConRec").addClass("is-invalid");
      $("#txtMargenConRec").prev("span").addClass("bg-danger");
    } else {
      $("#txtMargenConRec").removeClass("is-invalid");
      $("#txtMargenConRec").prev("span").removeClass("bg-danger");
    }

    if ($("#txtPorcentajeCostoRec").val().replace(/,/g, "") > 100.0) {
      $("#txtPorcentajeCostoRec").addClass("is-invalid");
      $("#txtPorcentajeCostoRec").next("span").addClass("bg-danger");
    } else {
      $("#txtPorcentajeCostoRec").removeClass("is-invalid");
      $("#txtPorcentajeCostoRec").next("span").removeClass("bg-danger");
    }
  });

  // Validation form procedimiento culinario
  $("#formProcedimientoCulinarioRec").validation_form({}, function (result) {
    if ($("#txtIVARec").val().trim() === "") {
        alert({
            icon: "error",
            title: "Error",
            text: "El campo impuestos es obligatorio",
        });
    } else {
        $("#formProcedimientoCulinarioRec button[type='submit']").attr(
            "disabled",
            "disabled"
        );
        // Guardar procedimiento culinario
        addProcedimientoCulinarioRec(id);
    }
  });
}

//? Modulo 1: form/table ingredientes y subrecetas interfaz y eventos.
function ingredientsAndSubrecetasReceta(id, dataIng, dataSub) {
  // Objeto tabla para ambos modulos
  let object_table = {
    f_size: "14",
    color_th: "bg-primary",
    ipt: [3],
    right: [4, 5],
  };

  //* MODULO 1. FORM/TABLE RECETAS - INGREDIENTES ------------
  // FORMULARIO AGREGAR RECETAS - INGREDIENTES ---------------
  // JSON
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
      id: "id_Ingredientes",
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
  // OBJETOS
  // Guardar RECETAS - INGREDIENTES
  let object_frm_ing = {
    id_Receta: id,
    opc: "createRecetasIngredientes",
  };
  // Cambiar nombre boton
  let object_attr_json_frm_ing = {
    name_btn: "Agregar Ingrediente",
  };
  // Alerta de guardado
  let object_alert_ing = {
    icon: "success",
    title: "Ingrediente",
    text: "Ingrediente guardado correctamente",
  };

  // TABLA RECETAS - INGREDIENTES ----------------------------
  // OBJETOS
  // Datos tabla
  let dtx_rec_ing = {
    opc: "tbRecetasIngredientes",
    idReceta: id,
  };
  // Editar RECETAS - INGREDIENTES (Evento input tabla)
  let object_event_ing = {
    opc: "updateRecetasIngredientes",
    id_Receta: id,
  };

  // CREACIÓN DEL MÓDULO 1 - RECETAS - INGREDIENTES ----------
  $("#frmAndTbRecetasIng").modulo_1({
    json_frm: json_form_rec_ing,
    datos: dtx_rec_ing,
    enlace: ctrlRecetas,
    content_table: "contentTableRecetasIng",
    frm: "formAddRecetasIng",
    table: "tbRecetasIng",
    class_frm: "col-12 col-md-4 hide",
    class_formulario: "col-12 container-border-right container-border-info",
    class_table: "col-12 col-md-12",
    atributos_table: object_table,
    atributos_frm: object_frm_ing,
    atributos_alert: object_alert_ing,
    atributos_event: object_event_ing,
    attr_json_frm: object_attr_json_frm_ing,
    extend_fn: function () {
      changeCulinaryProcedureReceta();
      inputEventTbIngRec();
    },
  });

  // Cargar datos en el select ingredientes
  if (dataIng.length > 0) {
    $("#txtid_Ingredientes").option_select({
      data: dataIng,
      select2: true,
      group: false,
      placeholder: "Selecciona un ingrediente",
    });
  }

  //* MODULO 1. FORM/TABLE RECETAS - SUBRECETAS --------------
  // FORMULARIO AGREGAR RECETAS - SUBRECETAS -----------------
  // JSON
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
  // OBJETOS
  // Guardar RECETAS - SUBRECETAS
  let object_frm_sub = {
    id_Receta: id,
    opc: "createRecetasSubRecetas",
  };
  // Cambiar nombre boton
  let object_attr_json_frm_sub = {
    name_btn: "Agregar Subreceta",
  };
  // Alerta de guardado
  let object_alert_sub = {
    icon: "success",
    title: "Subreceta",
    text: "Subreceta guardada correctamente",
  };

  // TABLA RECETAS - SUBRECETAS ------------------------------
  // OBJETOS
  // Datos tabla
  data_table_rec_sub = {
    opc: "tbRecetasSubRecetas",
    idReceta: id,
  };
  // Editar RECETAS - SUBRECETAS (Evento input tabla)
  data_event_rec_sub = {
    opc: "updateRecetasSubRecetas",
    id_Receta: id,
  };

  // CREACIÓN DEL MÓDULO 1 - RECETAS - SUBRECETAS ------------
  if (dataSub.length > 0) {
    $("#frmAndTbRecetasSub").modulo_1({
      json_frm: json_form_rec_sub,
      datos: data_table_rec_sub,
      enlace: ctrlRecetas,
      content_table: "contentTableRecetasSub",
      frm: "formAddRecetasSub",
      table: "tbRecetasSub",
      class_frm: "col-12 col-md-4 hide",
      class_formulario: "col-12  container-border-right container-border-info",
      class_table: "col-12 col-md-12",
      atributos_table: object_table,
      atributos_frm: object_frm_sub,
      atributos_alert: object_alert_sub,
      atributos_event: data_event_rec_sub,
      attr_json_frm: object_attr_json_frm_sub,
      extend_fn: function () {
        changeCulinaryProcedureReceta();
        inputEventTbSubRec();
      },
    });
  }

  // Cargar datos en el select subrecetas
  $("#txtid_Subreceta").option_select({
    data: dataSub,
    select2: true,
    group: false,
    placeholder: "Selecciona una subreceta",
  });

  // Cargar el select de subrecetas y el modulo 1 de acuerdo a la clasificación
  $("#txtcbClasificacionRec").on("change", function () {
    // let dataSub = updateDataSubRecetas($(this).val());
    let dataSub = updateDataSubRecetas();

    // Si hay datos de subrecetas con la clasificación seleccionada se crea el módulo 1 si no se ha creado
    if (dataSub.length > 0 && $("#frmAndTbRecetasSub").html() === "") {
      $("#frmAndTbRecetasSub").modulo_1({
        json_frm: json_form_rec_sub,
        datos: data_table_rec_sub,
        enlace: ctrlRecetas,
        content_table: "contentTableRecetasSub",
        frm: "formAddRecetasSub",
        table: "tbRecetasSub",
        class_frm: "col-12 col-md-4 hide",
        class_formulario:
          "col-12  container-border-right container-border-info",
        class_table: "col-12 col-md-12",
        atributos_table: object_table,
        atributos_frm: object_frm_sub,
        atributos_alert: object_alert_sub,
        atributos_event: data_event_rec_sub,
        attr_json_frm: object_attr_json_frm_sub,
        extend_fn: function () {
          changeCulinaryProcedureReceta();
          inputEventTbSubRec();
        },
      });
    } else if (dataSub.length === 0) {
      // Si no hay datos de subrecetas con la clasificación seleccionada se elimina el módulo 1
      $("#frmAndTbRecetasSub").html("");
    }

    $("#txtid_Subreceta").html("");
    // Cargar datos en el select subrecetas
    $("#txtid_Subreceta").option_select({
      data: dataSub,
      select2: true,
      group: false,
      placeholder: "Selecciona una subreceta",
    });
  });

  //* ESTILOS ------------------------------------------------
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

//* RECETA ---------------------------------------------------------------
//? Validar el cambio de nombre de la receta.
async function validateReceta(id, udn) {
  // Confimar guardado
  const confirmacionInicial = await alert({
    icon: "question",
    title: "¿Está seguro de guardar esta receta?",
  });
  // Si no la guardan no se hace nada
  if (!confirmacionInicial.isConfirmed) return false;
  // Variable input nombre receta
  const nameReceta = $("#txtRecetas").val().toUpperCase().trim();

  // Consulta si existe la receta
  let datos = new FormData();
  datos.append("opc", "validateReceta");
  datos.append("nombre", nameReceta);
  datos.append("udn", udn);

  data = await send_ajax(datos, ctrlRecetas);

  // Verifica si hay datos
  if (data && data.length > 0) {
    let nombres = "";
    let id_udn = "";
    let encontrado = false;

    // Recorre los datos
    data.forEach((element) => {
      // Concatena los nombres y los id_udn
      nombres += element.nombre + ", ";
      id_udn += element.id_udn + ", ";
      // Si el id es igual al id de la receta a validar
      if (element.id == id) {
        encontrado = true;
      }
    });

    // Si encontrado es true, entonces es una edición de una receta y el nombre sigue siendo el mismo
    if (encontrado) {
      return true;
    } else {
      // Si no, es una receta nueva o un cambio de nombre
      let existe = data.some(
        (x) => x.nombre === nameReceta && x.id_udn === udn && x.id !== id
      ); // Verifica si el nombre ya existe en la UDN con distinto ID

      // Si existe, muestra un mensaje con los nombres de las recetas iguales o similares
      if (existe) {
        let confirmacionSimilar = await alert({
          icon: "question",
          title:
            "Se encontraron recetas relacionadas con este nombre ¿Deseas continuar?",
          text: "Recetas existentes:\n" + nombres,
        });
        // Si el usuario confirma que desea continuar aparece un mensaje de error
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
    }
  }
  return true;
}

//? Crear receta.
function addRecetas() {
  let foto = $("#photo-receta")[0].files[0];

  let datos = new FormData();
  datos.append("opc", "createReceta");
  datos.append("nombre", $("#txtRecetas").val());
  datos.append("id_Clasificacion", $("#txtcbClasificacionRec").val());
  datos.append("id_Subclasificacion", $("#txtcbSubClasificacionRec").val());
  datos.append("observaciones", $("#textareaNotasRec").val());
  datos.append("id_UDN", $("#txtcbUDN").val());
  datos.append("foto", foto);
  send_ajax(datos, ctrlRecetas).then((data) => {
    if (data.idReceta !== null && data.idReceta !== "null") {
      alert({
        icon: "success",
        title: "Receta",
        text: "Receta creada correctamente",
      });

        // Borra la foto
        deletePhotoReceta(data.idReceta);

      // Ocultar botones y deshabilitar campos
      $("#btnCreateReceta").addClass("hide");
      $("#txtRecetas").prop("disabled", true);
      $("#txtcbClasificacionRec").prop("disabled", true);
      $("#txtcbSubClasificacionRec").prop("disabled", true);

      // Mostrar formularios y tablas de ingredientes y subrecetas
      $("#fillReceta").removeClass("hide");
      $("#btnSaveReceta").removeClass("hide");

      // Habilitar el botones de submit
      $("#formAddReceta button[type='submit']").removeAttr("disabled");

      // Filtra los datos de los ingredientes y subrecetas de acuerdo a la clasificación
      let dataIng = updateDataIngredientes();
    //   let dataSub = updateDataSubRecetas($("#txtcbClasificacionRec").val());
      let dataSub = updateDataSubRecetas();

      // Crear formulario de procedimiento culinario
      culinaryProcedureReceta("create", data.idReceta);

      // Crear formulario y tabla de ingredientes y subrecetas
      ingredientsAndSubrecetasReceta(data.idReceta, dataIng, dataSub);

      // Evento para el boton de vincular soft
      $("#btnSoftReceta")
        .prop("disabled", false)
        .off("click")
        .on("click", function () {
          vincularSoftReceta(data.idReceta);
        });

      // Actualización de la receta recién creada
      $("#btnSaveReceta").on("click", function () {
        $("#textareaNotasRec").prop("disabled", false);
        alert({
          icon: "question",
          title: "¿Está seguro de guardar la receta?",
        }).then((result) => {
          // Si el usuario confirma el guardado, se procede a actualizar la receta
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

//? Actualizar receta y procedimiento culinario.
function editRecetas(id) {
  let foto = $("#photo-receta")[0].files[0];

  let dtx = new FormData();
  dtx.append("opc", "updateReceta");
  dtx.append("nombre", $("#txtRecetas").val());
  dtx.append("id_Clasificacion", $("#txtcbClasificacionRec").val());
  dtx.append("id_Subclasificacion", $("#txtcbSubClasificacionRec").val());
  dtx.append("observaciones", $("#textareaNotasRec").val());
  dtx.append("rendimiento", $("#txtRendimientoRec").val());
  dtx.append("precioVenta", $("#txtPrecioVentaRec").val());
  dtx.append("iva", $("#txtIVARec").val());
  dtx.append("foto", foto);
  dtx.append("idReceta", id);
  send_ajax(dtx, ctrlRecetas).then((data) => {
    if (
      data.idReceta !== null &&
      data.idReceta !== "null" &&
      data.idReceta !== "" &&
      data.idReceta !== undefined
    ) {
      alert({
        icon: "success",
        title: "Receta",
        text: "Guardado correctamente",
      });

      // Ocultar div y limpiar contenedores
      $(".secondary-rec").addClass("hide");
      $("#formAddReceta")[0].reset();
      $("#containerFormProcCulinarioRec").html("");
      $("#frmAndTbRecetasIng").html("");
      $("#frmAndTbRecetasSub").html("");

      // Habilitar botones de submit
      $("#formAddReceta button[type='submit']").removeAttr("disabled");
      $("#formProcedimientoCulinarioRec button[type='submit']").removeAttr(
        "disabled"
      );
      $("#formAddRecetasIng button[type='submit']").removeAttr("disabled");
      $("#formAddRecetasSub button[type='submit']").removeAttr("disabled");

      // Eliminar las clases is-invalid
      $("#formAddReceta :input.is-invalid").removeClass("is-invalid");

      // Cargar imagen por defecto
      $("#imgReceta").attr(
        "src",
        "./src/img/default.png"
      );

      // Mostrar el catálogo de recetas
      $("#btnAddReceta").removeClass("hide");
      $(".main-rec").removeClass("hide");
      $("#containerCatalogo").removeClass("hide");
      lsRecetas();
    } else {
      alert({
        icon: "error",
        title: "Receta",
        text: "Error al actualizar la receta",
      });
    }
  });
}

//? Guardar procedimiento culinario.
function addProcedimientoCulinarioRec(id) {
  let dtx = new FormData();
  dtx.append("opc", "procedimientoCulinarioReceta");
  dtx.append("rendimiento", $("#txtRendimientoRec").val());
  dtx.append("precioVenta", $("#txtPrecioVentaRec").val());
  dtx.append("iva", $("#txtIVARec").val());
  dtx.append("idReceta", id);
  if (id === null || id === "null" || id === undefined) {
    alert({
      icon: "error",
      title: "Procedimiento culinario",
      text: "Error al guardar, llame a soporte técnico",
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

//* RECETAS - INGREDIENTES -----------------------------------------------
//? Eliminar RECETAS - INGREDIENTES.
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
            icon: "info",
            title: "Ingrediente",
            text: "Eliminado correctamente",
            btn1: true,
          });
          // Eliminar la fila de la tabla
          $(btn).closest("tr").remove();
          // Actualizar el número de ingredientes
          $(itemCount).text($(tb + " tbody tr").length);
          // Actualizar el costo total de ingredientes por la suma de su columna 4
          $(costTotal).text(addCostColumn(tb, 4));
          // Actualizar el procedimiento culinario
          changeCulinaryProcedureReceta();
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

//* RECETAS - SUBRECETAS -------------------------------------------------
//? Eliminar RECETAS - SUBRECETAS.
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
            icon: "info",
            title: "Subreceta",
            text: "Eliminada correctamente",
            btn1: true,
          });
          // Eliminar la fila de la tabla
          $(btn).closest("tr").remove();
          // Actualizar el número de subrecetas
          $(itemCount).text($(tb + " tbody tr").length);
          // Actualizar el costo total de subrecetas por la suma de su columna 4
          $(costTotal).text(addCostColumn(tb, 4));
          // Actualizar el procedimiento culinario
          changeCulinaryProcedureReceta();
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

//* FUNCIONES ------------------------------------------------------------
//? Renderizar la imagen en el frontend (no guardada en la BD).
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
                $("#content_photo_receta p").removeClass("hide").addClass("d-flex");
            };
        }, 500);
    }
}

//? Evento para el input cantidad de la tabla RECETAS - INGREDIENTES.
function inputEventTbIngRec() {
  $("#tbRecetasIng tbody").on("input", "input[type='text']", function () {
    // Inicializar variables
    let cantidadIng = $(this).val(); // Cantidad del ingrediente
    let precioUnidadIng = $(this)
      .closest("tr")
      .find("td")
      .eq(3)
      .text()
      .trim()
      .substring(2)
      .replace(/,/g, ""); // Precio por unidad del ingrediente
    let costoIng = 0; // Costo del ingrediente

    // Si la cantidad o es nula o vacía, se calcula el costo
    if (cantidadIng != "" && cantidadIng != null && cantidadIng != undefined) {
      costoIng = parseFloat(precioUnidadIng) * parseFloat(cantidadIng);
    }

    // Dar formato al nuevo costo
    let costoIngFormat = costoIng.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Agregar el nuevo costo a la celda correspondiente de la tabla recetas - ingredientes
    $(this)
      .closest("tr")
      .find("td")
      .eq(4)
      .text("$ " + costoIngFormat);

    // Actualizar el total costo de la tabla recetas - ingredientes
    $("#lblTotalCostoRecetaIng").text(addCostColumn("#tbRecetasIng", 4));

    // Actualizar el procedimiento culinario
    changeCulinaryProcedureReceta();
  });
}

//? Evento para el input cantidad de la tabla RECETAS - SUBRECETAS.
function inputEventTbSubRec() {
  $("#tbRecetasSub tbody").on("input", "input[type='text']", function () {
    // Inicializar variables
    let cantidadSub = $(this).val(); // Cantidad de la subreceta
    let precioUnidadSub = $(this)
      .closest("tr")
      .find("td")
      .eq(3)
      .text()
      .trim()
      .substring(2)
      .replace(/,/g, ""); // Precio por unidad de la subreceta
    let costoSub = 0; // Costo de la subreceta

    // Si la cantidad no es nula o vacía, se calcula el costo
    if (cantidadSub != "" && cantidadSub != null && cantidadSub != undefined) {
      costoSub = parseFloat(precioUnidadSub) * parseFloat(cantidadSub);
    }

    // Dar formato al nuevo costo
    let costoSubFormat = costoSub.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Agregar el nuevo costo a la celda correspondiente de la tabla recetas - subrecetas
    $(this)
      .closest("tr")
      .find("td")
      .eq(4)
      .text("$ " + costoSubFormat);

    // Actualizar el total costo de la tabla recetas - subrecetas
    $("#lblTotalCostoRecetaSub").text(addCostColumn("#tbRecetasSub", 4));

    // Actualizar el procedimiento culinario
    changeCulinaryProcedureReceta();
  });
}

//? Eventos del procedimiento culinario.
function changeCulinaryProcedureReceta() {
  // Inicializar variables
  // Costo total de ingredientes label
  // TODO: Revisión
  //   let costoTotalIngredientes = parseFloat(
  //     $("#lblTotalCostoRecetaIng").text().replace(/,/g, "")
  //   );
  let costoTotalIngredientes = $("#lblTotalCostoRecetaIng").length
    ? parseFloat($("#lblTotalCostoRecetaIng").text().replace(/,/g, ""))
    : 0;

  // Costo total de subrecetas label
  let costoTotalSubrecetas = $("#lblTotalCostoRecetaSub").length
    ? parseFloat($("#lblTotalCostoRecetaSub").text().replace(/,/g, ""))
    : 0;
  // Rendimiento
  let rendimiento =
    $("#txtRendimientoRec").val() !== ""
      ? parseFloat($("#txtRendimientoRec").val().replace(/,/g, ""))
      : 0;
  // Precio de venta sin impuestos
  let precioVentaImpuestos =
    $("#txtPrecioVentaRec").val() !== "" && $("#txtIVARec").val() !== ""
      ? parseFloat($("#txtPrecioVentaRec").val().replace(/,/g, "")) /
        (1 + parseFloat($("#txtIVARec").val().replace(/,/g, "")) / 100)
      : 0;

  // Validar labels vacíos
  if (costoTotalIngredientes === 0.0 && costoTotalSubrecetas === 0.0) {
    $("#txtTotalIngredientesRec").val("");
    $("#txtRendimientoRec").val("");
    $("#txtCostoRec").val("");
    $("#txtPrecioVentaImpuestosRec").val("");
    $("#txtMargenConRec").val("");
    $("#txtPorcentajeCostoRec").val("");
    return;
  }

  // Total de ingredientes y subrecetas
  let totalIngredientes = costoTotalIngredientes + costoTotalSubrecetas;
  let totalIngredientesFormat = totalIngredientes.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  $("#txtTotalIngredientesRec").val(totalIngredientesFormat);

  // Calcular el costo de la receta... si el rendimiento es distinto de 0
  let costoTotalReceta =
    rendimiento !== 0.0
      ? totalIngredientesFormat.replace(/,/g, "") / rendimiento
      : 0;
  $("#txtCostoRec").val(
    rendimiento !== 0.0
      ? costoTotalReceta.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : ""
  );

  // Calcular el precio de venta sin impuestos
  let precioVentaImpuestosFormat =
    precioVentaImpuestos !== 0.0
      ? precioVentaImpuestos.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "";
  $("#txtPrecioVentaImpuestosRec").val(precioVentaImpuestosFormat);

  // Calcular el margen de contribución
  let margenCon =
    precioVentaImpuestos !== 0.0 && costoTotalReceta !== 0.0
      ? precioVentaImpuestos - costoTotalReceta
      : 0;
  $("#txtMargenConRec").val(
    precioVentaImpuestos !== 0.0 && costoTotalReceta !== 0.0
      ? margenCon.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : ""
  );

  // Calcular el porcentaje de costo
  let porcentajeCosto =
    costoTotalReceta !== 0.0 && precioVentaImpuestos !== 0.0
      ? (costoTotalReceta * 100) / precioVentaImpuestos
      : 0;
  $("#txtPorcentajeCostoRec").val(
    costoTotalReceta !== 0.0 && precioVentaImpuestos !== 0.0
      ? porcentajeCosto.toLocaleString("en-US", {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      : ""
  );

  // Validar margen de contribución y porcentaje de costo para cambiar de color
  if ($("#txtMargenConRec").val().replace(/,/g, "") < 0.0) {
    $("#txtMargenConRec").addClass("is-invalid");
    $("#txtMargenConRec").prev("span").addClass("bg-danger");
  } else {
    $("#txtMargenConRec").removeClass("is-invalid");
    $("#txtMargenConRec").prev("span").removeClass("bg-danger");
  }
  if ($("#txtPorcentajeCostoRec").val().replace(/,/g, "") > 100.0) {
    $("#txtPorcentajeCostoRec").addClass("is-invalid");
    $("#txtPorcentajeCostoRec").next("span").addClass("bg-danger");
  } else {
    $("#txtPorcentajeCostoRec").removeClass("is-invalid");
    $("#txtPorcentajeCostoRec").next("span").removeClass("bg-danger");
  }
}

//? Recetario de la receta.
function procedureReceta(id) {
  let datos = new FormData();
  datos.append("opc", "printReceta");
  datos.append("id", id);
  // Consulta de la receta junto con sus ingredientes y subrecetas
  send_ajax(datos, ctrlRecetas).then((data) => {
    let modalAddRecetario = bootbox
      .dialog({
        title: `<h3 class="text-center">${data.receta.nombre}</h3>`,
        size: "large",
        closeButton: true,
        message: `
                <div class="row mb-3">
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6" id="ingredientesRecetario">
                        <h4 class="fw-bold">Ingredientes</h4>
                        <ul>
                        ${
                          data.ingrediente &&
                          Array.isArray(data.ingrediente) &&
                          data.ingrediente.length > 0
                            ? data.ingrediente
                                .map(
                                  (ingrediente) => `
                                <li><span class="text-primary">${ingrediente.cantidad} ${ingrediente.unidad}</span> ${ingrediente.nombre}</li>
                            `
                                )
                                .join("")
                            : "<li>No hay ingredientes disponibles</li>"
                        }
                        </ul>
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                        <h4 class="fw-bold">Subrecetas</h4>
                        <ul>
                        ${
                          data.subreceta &&
                          Array.isArray(data.subreceta) &&
                          data.subreceta.length > 0
                            ? data.subreceta
                                .map(
                                  (subreceta) => `
                                <li><span class="text-primary">${subreceta.cantidad} ${subreceta.unidad}</span> ${subreceta.nombre}</li>
                            `
                                )
                                .join("")
                            : "<li>No hay subrecetas disponibles</li>"
                        }
                        </ul>
                    </div>
                </div>
                <hr>
                <form class="row" id="formRecetario">
                    <div class="col-12">
                        <h4 class="fw-bold">Procedimiento</h4>
                        <textarea class="form-control textarea" rows="16" required="required">
                            </textarea>
                    </div>
                    <div class="col-12">
                        <div class="row d-flex justify-content-between mt-3">
                            <div class="col-5">
                                <button type="submit" class="btn btn-primary col-12">Guardar</button>
                            </div>
                            <div class="col-5">
                                <button type="button" class="btn btn-outline-danger col-12" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </form>
                `,
      })
      .on("shown.bs.modal", function () {
        $(".textarea").val(data.receta.nota.replace(/<br\s*\/?>/g, ""));

        $("#formRecetario").validation_form({}, function (result) {
          $("#formRecetario button[type='submit']").attr(
            "disabled",
            "disabled"
          );
          let objRecetario = new FormData();
          objRecetario.append("opc", "updateReceta");
          objRecetario.append("nota", $(".textarea").val());
          objRecetario.append("idReceta", id);

          // Guardar notas, o recetario de la receta
          send_ajax(objRecetario, ctrlRecetas).then((data) => {
            if (
              data.idReceta !== null &&
              data.idReceta !== "null" &&
              data.idReceta !== "" &&
              data.idReceta !== undefined
            ) {
              alert({
                icon: "success",
                title: "Procedimiento",
                text: "Guardado correctamente",
              });
              $("#formRecetario button[type='submit']").removeAttr("disabled");
              modalAddRecetario.modal("hide");
            } else {
              alert({
                icon: "error",
                title: "Procedimiento",
                text: "Error al guardar",
              });
            }
          });
        });
      });
  });
}

//? Mostar receta.
function showReceta(id) {
  $("#btnCloseReceta")
    .off("click")
    .on("click", function () {
      $(".secondary-rec").addClass("hide");
      $("#btnAddReceta").removeClass("hide");
      $(".main-rec").removeClass("hide");
      $("#containerCatalogo").removeClass("hide");
      lsRecetas();
    });

  // Consultar la receta
  let datos = new FormData();
  datos.append("opc", "printReceta");
  datos.append("id", id);

  send_ajax(datos, ctrlRecetas).then((data) => {

    // Llenar los campos de la receta
    $("#txtRecetas").val(data.receta.nombre);
    if (data.receta.idclasificacion !== null) {
      $("#txtcbClasificacionRec").val(data.receta.idclasificacion);
    } else {
      $("#txtcbClasificacionRec").html("").option_select({
        select2: true,
        group: false,
        placeholder: "SELECCIONA UNA CLASIFICACIÓN",
      });
    }
    
    let dataSubClass = updateSubclassifications(
        $("#txtcbClasificacionRec").val()
    );
    // Cargar select de subclasificaciones
    if (dataSubClass.length > 0) {
        $("#txtcbSubClasificacionRec").option_select({
            data: dataSubClass,
            select2: true,
            group: false,
            placeholder: "SELECCIONA UNA SUBCLASIFICACIÓN",
        });
        if (data.receta.idsubclasificacion != null) {
            $("#txtcbSubClasificacionRec").val(data.receta.idsubclasificacion).trigger("change");
        } else {
            $("#txtcbSubClasificacionRec").html("").option_select({
              select2: true,
              group: false,
              placeholder: "SELECCIONA UNA SUBCLASIFICACIÓN",
            });
          }
    } else {
        $("#txtcbSubClasificacionRec").option_select({
            select2: true,
            group: false,
            placeholder: "NO HAY SUBCLASIFICACIONES",
            disabled: true,
        });
    }

    $("#textareaNotasRec").val(data.receta.observaciones);

    let foto = data.receta.foto;
    $("#content_photo_receta p").addClass("hide").removeClass("d-flex");
    if (foto !== null && foto !== "" && foto !== undefined && foto !== "erp_files/default.png") {
        // Hacer un explote por el nombre de la foto
        let fotoSplit = foto.split("/");
        if (fotoSplit[0] == "erp_files") {
            // Cargar la foto de la receta
            $("#imgReceta").attr("src", "https://www.erp-varoch.com/" + foto);
        } else {
            // Cargar la foto de la receta
            $("#imgReceta").attr("src", "https://www.erp-varoch.com/ERP/" + foto);
        }
    } else {
        // Cargar imagen por defecto
        $("#imgReceta").attr(
            "src",
            "./src/img/default.png"
        );
    }

    Promise.all([lsRecetasIngredientes(id), lsRecetasSubRecetas(id)])
      .then(() => {
        culinaryProcedureReceta("edit", id);

        $("#containerCatalogo").addClass("hide");
        $(".main-rec").addClass("hide");
        // Mostrar botones de la receta
        $("#btnAddReceta").addClass("hide");
        $(".secondary-rec").removeClass("hide");
        $("#fillReceta").removeClass("hide");
        $("#btnCloseReceta").addClass("mt-4");
        // Deshabilitar campos
        $("#txtRecetas").prop("disabled", true);
        $("#txtcbClasificacionRec").prop("disabled", true);
        $("#txtcbSubClasificacionRec").prop("disabled", true);
        //Mostrar botón de guardar
        $("#btnCreateReceta").addClass("hide");
        $("#btnSaveReceta").addClass("hide");
        $("#textareaNotasRec").prop("disabled", true);

        $("#txtRendimientoRec").prop("disabled", true);
        $("#txtPrecioVentaRec").prop("disabled", true);
        $("#txtIVARec").prop("disabled", true);
        // $("#btnAceptar").addClass("hide");
        $("#formProcedimientoCulinarioRec #btnAceptar").remove();
        $("#btnSoftReceta").addClass("hide");
        changeCulinaryProcedureReceta();

        $("#formProcedimientoCulinarioRec").parent().addClass("p-0 m-0");
        $("#formProcedimientoCulinarioRec").addClass("m-0 p-0");
        $("#formProcedimientoCulinarioRec").children().addClass("pe-0");
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

//? Cargara los ingrediemtes de la receta.
function lsRecetasIngredientes(id) {
  return new Promise((resolve, reject) => {
    let datos = {
      opc: "tbRecetasIngredientesShow",
      idReceta: id,
    };

    fn_ajax(datos, ctrlRecetas, $("#frmAndTbRecetasIng"))
      .then((data) => {
        $("#frmAndTbRecetasIng").rpt_json_table2({
          data: data,
          rigth: [4, 5],
          id: "tbRecetasIng",
          color_th: "bg-primary",
          f_size: 16,
          class: "table table-hover table-bordered",
        });
        simple_data_table("#tbRecetasIng", 10);
        $("#tbRecetasIng_wrapper > .row > .col-sm-12.col-md-6:first").html("<strong>Total costo: $" + $('#lblTotalCostoRecetaIng').text() + "</strong>")
        $('#lblTotalRecetaIng').parent().addClass('hide');
        $('#lblTotalCostoRecetaIng').parent().addClass('hide');
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//? Cargara las subrecetas de la receta.
function lsRecetasSubRecetas(id) {
  return new Promise((resolve, reject) => {
    let datos = {
      opc: "tbRecetasSubRecetasShow",
      idReceta: id,
    };

    fn_ajax(datos, ctrlRecetas, $("#frmAndTbRecetasSub"))
      .then((data) => {
        $("#frmAndTbRecetasSub").rpt_json_table2({
          data: data,
          rigth: [4, 5],
          id: "tbRecetasSub",
          color_th: "bg-primary",
          f_size: 16,
          class: "table table-hover table-bordered",
        });
        simple_data_table("#tbRecetasSub", 10);
        $("#tbRecetasSub_wrapper > .row > .col-sm-12.col-md-6:first").html("<strong>Total costo: $" + $('#lblTotalCostoRecetaSub').text() + "</strong>")
        $('#lblTotalRecetaSub').parent().addClass('hide');
        $('#lblTotalCostoRecetaSub').parent().addClass('hide');
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//? Observaciones de la receta.
function observationReceta(id) {
  let datos = new FormData();
  datos.append("opc", "printReceta");
  datos.append("id", id);

  send_ajax(datos, ctrlRecetas).then((data) => {
    bootbox.dialog({
      title: `<h3 class="text-center">${data.receta.nombre}</h3>`,
      size: "large",
      closeButton: true,
      message: `
          <form class="row" id="formObservacionesRec" novalidate>
              <div class="col-12">
                  <h4 class="fw-bold">Observaciones</h4>
                  <textarea class="form-control textareaobsrec" rows="6" required="required">
                  </textarea>
              </div>
              <div class="col-12">
                  <div class="row d-flex justify-content-between mt-3">
                      <div class="col-5">
                          <button type="submit" class="btn btn-primary col-12">Aceptar</button>
                      </div>
                      <div class="col-5">
                          <button type="button" class="btn btn-outline-danger col-12" data-bs-dismiss="modal">Cerrar</button>
                      </div>
                  </div>
              </div>
          </form>
        `,
    });

    $(".textareaobsrec").val(data.receta.observaciones);

    $("#formObservacionesRec").validation_form({}, function (result) {
      $("#formObservacionesRec button[type='submit']").attr(
        "disabled",
        "disabled"
      );
      let objObservaciones = new FormData();
      objObservaciones.append("opc", "updateReceta");
      objObservaciones.append("observaciones", $(".textareaobsrec").val());
      objObservaciones.append("idReceta", id);

      // Guardar notas, o recetario de la receta
      send_ajax(objObservaciones, ctrlRecetas).then((data) => {
        if (
          data.idReceta !== null &&
          data.idReceta !== "null" &&
          data.idReceta !== "" &&
          data.idReceta !== undefined
        ) {
          alert({
            icon: "success",
            title: "Observaciones",
            text: "Guardado correctamente",
          });
          $("#formObservacionesRec button[type='submit']").removeAttr(
            "disabled"
          );
          bootbox.hideAll();
        } else {
          alert({
            icon: "error",
            title: "Observaciones",
            text: "Error al guardar",
          });
        }
      });
    });
  });
}

//? Imprimir receta.
function printReceta(id) {
  bootbox.dialog({
    title: "Imprimir receta",
    message: "<p>¿Qué deseas imprimir?</p>",
    size: "small",
    onEscape: true,
    backdrop: true,
    closeButton: true,
    buttons: {
      fee: {
        label: "Receta",
        className: "btn-primary",
        callback: function () {
          sessionStorage.setItem("receta", id);
          window.open("printReceta.php", "_blank");
        },
      },
      fie: {
        label: "Recetario",
        className: "btn-info",
        callback: function () {
          sessionStorage.setItem("receta", id);
          window.open("printRecetario.php", "_blank");
        },
      },
    },
  });
  $(".modal-footer").addClass(
    "d-flex justify-content-around align-items-center"
  );
}

//? Vincular producción con receta o soft con receta.
function vincularSoftReceta(id) {
  if ($("#txtcbUDN").val() === "6") {
    let nombre = dataRec.find((x) => x.id == id).valor;
    bootbox.dialog({
      title: "Vincular " + nombre,
      message: `
          <form class="row" id="formVincularProductos" novalidate>
            <div class="col-12">
              <label class="fw-bold" for="txtNombreProductos">Receta en Producción</label>
              <select class="form-select" id="txtCodigoProductos" required="required" multiple></select>
            </div>
            <div class="row mt-3 d-flex justify-content-end m-0 p-0">
              <div class="col-5">
                <button type="submit" class="btn btn-primary col-12">Vincular</button>
              </div>
              <div class="col-5">
                <button type="button" class="btn btn-outline-danger col-12" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </form>
        `,
    });
    $("#txtCodigoProductos").html("").option_select({
      data: dataCatalogo.productosfz,
      select2: true,
      group: false,
      father: true,
      placeholder: "Selecciona un producto",
    });

    if (dataCatalogo.productosfz.length > 0) {
      let recetaProducto = dataCatalogo.productosfz.filter(
        (receta) => receta.idreceta === String(id)
      );
      if (recetaProducto.length > 0) {
        $("#txtCodigoProductos").val(recetaProducto.map((x) => x.id));
        $("#txtCodigoProductos").trigger("change");
      }
    }

    $("#formVincularProductos").validation_form({}, function (result) {
      $("#formVincularProductos button[type='submit']").attr(
        "disabled",
        "disabled"
      );
      let objProductos = new FormData();
      objProductos.append("opc", "vincularProduccionReceta");
      objProductos.append("id_Costsys", id);
      objProductos.append(
        "id_Produccion",
        $("#txtCodigoProductos").val().join(",")
      );

      // Vincular receta con SoftRestaurant
      send_ajax(objProductos, ctrlRecetas).then((data) => {
        if (data.status == 200) {
          alert({
            icon: "success",
            title: "Vinculación",
            text: data.message,
          });
          $("#formVincularProductos button[type='submit']").removeAttr(
            "disabled"
          );

          dataCatalogo.productosfz.find((x) => x.id == data.idSoft).idreceta =
            String(id);
          bootbox.hideAll();
        } else {
          alert({
            icon: "error",
            title: "Vinculación",
            text: data.message,
            btn1: true,
          });
          $("#formVincularProductos button[type='submit']").removeAttr(
            "disabled"
          );
        }
      });
    });
  } else {
    let nombre = dataRec.find((x) => x.id == id).valor;
    bootbox.dialog({
      title: "Vincular " + nombre,
      message: `
          <form class="row" id="formVincularSoft" novalidate>
            <div class="col-12">
              <label class="fw-bold" for="txtNombreSoft">Receta en SoftRestaurant</label>
              <select class="form-select" id="txtCodigoSoft" required="required"></select>
            </div>
            <div class="row mt-3 d-flex justify-content-end m-0 p-0">
              <div class="col-5">
                <button type="submit" class="btn btn-primary col-12">Vincular</button>
              </div>
              <div class="col-5">
                <button type="button" class="btn btn-outline-danger col-12" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </form>
        `,
    });

    // Filtrar dataCatalogo.recetasoft por idudn con el valor del select udn
    let dataSoft = dataCatalogo.recetasoft.filter(
      (receta) => receta.idudn === $("#txtcbUDN").val()
    );

    // Cargar datos en el select
    $("#txtCodigoSoft").html("").option_select({
      data: dataSoft,
      select2: true,
      group: false,
      father: true,
      placeholder: "Selecciona una receta",
    });

    if (dataSoft.length > 0) {
      let recetaSoft = dataCatalogo.recetasoft.filter(
        (receta) =>
          receta.idudn === $("#txtcbUDN").val() &&
          receta.idreceta === String(id)
      );
      if (recetaSoft.length > 0) {
        $("#txtCodigoSoft").val(recetaSoft[0].id);
        $("#txtCodigoSoft").trigger("change");
      }
    }

    $("#formVincularSoft").validation_form({}, function (result) {
      $("#formVincularSoft button[type='submit']").attr("disabled", "disabled");
      let objSoft = new FormData();
      objSoft.append("opc", "vincularSoftReceta");
      objSoft.append("id_costsys_recetas", id);
      objSoft.append("id_soft_productos", $("#txtCodigoSoft").val());

      // Vincular receta con SoftRestaurant
      send_ajax(objSoft, ctrlRecetas).then((data) => {
        if (data.status == 200) {
          alert({
            icon: "success",
            title: "Vinculación",
            text: data.message,
          });
          $("#formVincularSoft button[type='submit']").removeAttr("disabled");

          dataCatalogo.recetasoft.find((x) => x.id == data.idSoft).idreceta =
            String(id);
          bootbox.hideAll();
        } else {
          alert({
            icon: "error",
            title: "Vinculación",
            text: data.message,
            btn1: true,
          });
          $("#formVincularSoft button[type='submit']").removeAttr("disabled");
        }
      });
    });
  }
}

//? Actualizar la subclasificación de acuerdo a la clasificación seleccionada.
function updateSubclassificationsReceta(id) {
  bootbox.dialog({
    title: "Subclasificación",
    message: `
          <form class="row" id="formSubClasificacion">
            <div class="col-12">
              <label class="fw-bold" for="txtcbSubClasificacionRec2">Subclasificación</label>
              <select class="form-select" id="txtcbSubClasificacionRec2" required="required"></select>
            </div>
            <div class="row mt-3 d-flex justify-content-end m-0 p-0">
              <div class="col-5">
                <button type="submit" class="btn btn-primary col-12">Guardar</button>
              </div>
              <div class="col-5">
                <button type="button" class="btn btn-outline-danger col-12" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </form>
        `,
  });

  // Filtrar dataCatalogo.subclasificacion por idclasificacion con el valor del select clasificacion
  let dataSubClass = updateSubclassifications(
    dataRec.find((x) => x.id == id).idclasificacion
  );

  $("#txtcbSubClasificacionRec2").html("").option_select({
    data: dataSubClass,
    select2: true,
    group: false,
    placeholder: "Selecciona una subclasificación",
  });

  if (dataSubClass.length > 0) {
    $("#txtcbSubClasificacionRec2").val(
      dataRec.find((x) => x.id == id).idsubclasificacion
    );
    $("#txtcbSubClasificacionRec2").trigger("change");
  }

  $("#formSubClasificacion").validation_form({}, function (result) {
    $("#formSubClasificacion button[type='submit']").attr(
      "disabled",
      "disabled"
    );
    let objSub = new FormData();
    objSub.append("opc", "updateSubClasificacionRecetas");
    objSub.append("id", id);
    objSub.append("idSub", $("#txtcbSubClasificacionRec").val());

    // Actualizar la subclasificación de la receta
    send_ajax(objSub, ctrlRecetas).then((data) => {
      if (data.id !== null && data.id !== "null" && data.id !== "") {
        alert({
          icon: "success",
          title: "Subclasificación",
          text: "Actualizada correctamente",
        });
        $("#formSubClasificacion button[type='submit']").removeAttr("disabled");
        bootbox.hideAll();
      } else {
        alert({
          icon: "error",
          title: "Subclasificación",
          text: "Error al actualizar",
        });
      }
    });
  });
}

//? Eliminar foto de la receta.
function deletePhotoReceta(id){
    $("#content_photo_receta p").on("click", function () {
        alert({
            icon: "question",
            title: "¿Está seguro de eliminar la imagen?",
            text: "No se podrá recuperar la imagen una vez eliminada.",
        }).then((result) => {
            if (result.isConfirmed) {
                let ola = {
                    opc: "deletePhotoReceta",
                    foto: null,
                    idReceta: id,
                };
                fn_ajax(ola, ctrlRecetas).then((data) => {
                    if (data) {
                        // Cargar imagen por defecto
                        $("#imgReceta").attr(
                            "src",
                            "./src/img/default.png"
                        );
                        $("#photo-receta").val("");
                        $("#content_photo_receta p").addClass("hide").removeClass("d-flex");
                        alert({
                            icon: "success",
                            title: "Imagen",
                            text: "Imagen eliminada correctamente",
                        });
                    } else {
                        alert({
                            icon: "error",
                            title: "Imagen",
                            text: "Error al eliminar la imagen",
                        });
                    }
                });
            }
        });
    });
}
//* Final final ----------------------------------------------------------
