window.ctrlCatalogo = window.ctrlCatalogo || "ctrl/ctrl-catalogo.php";
window.dataIng = window.dataIng || [];
window.dataSub = window.dataSub || [];
window.dataRec = window.dataRec || [];
window.dataCatalogo = window.dataCatalogo || [];

$(function () {
  initComponents(ctrlCatalogo).then((data) => {
    dataCatalogo = data;
    $("#txtcbUDN").option_select({ data: dataCatalogo.udn });
    actualizarClasificacion().then(() => {
      // Cargar el cuerpo de la pestaña por defecto
      bodySubreceta();
      cargarCatalogo();
    });
  });
});

function cargarCatalogo() {
  // Cargar el cuerpo de cada pestaña
  $("#ingredientes-tab").on("click", function () {
    $(".nav-item").removeClass("active");
    $(this).parent().addClass("active");
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    bodyIngrediente();
  });
  $("#subrecetas-tab").on("click", function () {
    $(".nav-item").removeClass("active");
    $(this).parent().addClass("active");
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    bodySubreceta();
  });
  $("#recetas-tab").on("click", function () {
    $(".nav-item").removeClass("active");
    $(this).parent().addClass("active");
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    bodyReceta();
  });

  // Eventos de cambio de select
  $("#txtcbUDN").on("change", function () {
    actualizarClasificacion().then(() => {
      if ($("#subrecetas-tab").hasClass("active")) {
        lsSubrecetas();
      } else if ($("#recetas-tab").hasClass("active")) {
        lsRecetas();
      } else {
        lsIngredientes();
      }
    });
  });
  $("#txtcbClasificacion").on("change", function () {
    if ($("#subrecetas-tab").hasClass("active")) {
      lsSubrecetas();
    } else if ($("#recetas-tab").hasClass("active")) {
      lsRecetas();
    }
  });
}

// Actualizar clasificaciones de acuerdo a la UDN
function actualizarClasificacion() {
  return new Promise((resolve, reject) => {
    let clasificaciones = dataCatalogo.clasificacion.filter(
      (item) => item.udn === $("#txtcbUDN").val()
    );

    $("#txtcbClasificacion").option_select({ data: clasificaciones });
    $("#txtcbClasificacionSub").option_select({ data: clasificaciones });
    $("#txtcbClasificacionRec").option_select({ data: clasificaciones });
    resolve();
  });
}

function actualizarDataSubRecetas(select) {
  let dataSubreceta = dataCatalogo.subrecetas.filter(
    (item) => item.idclasificacion === select
  );
  return dataSubreceta;
}

function actualizarDataIngredientes() {
  let dataIngredientes = dataCatalogo.ingredientes.filter(
    (item) => item.idudn === $("#txtcbUDN").val()
  );
  return dataIngredientes;
}

// FUNCIONES UNIVERSALES
function precio_x_unidad(precio, contNeto) {
  if ($(precio).val() != "" && $(contNeto).val() != "") {
    let price = parseFloat($(precio).val());
    let netContent = parseFloat($(contNeto).val());
    let precioUnidad = netContent == 0 ? 0 : price / netContent;
    return precioUnidad.toFixed(2);
  }
  return 0.0;
}

function closeForm(form, tb, btn) {
  $(form).addClass("hide");
  $(tb).removeClass("col-md-8");
  $(btn).removeClass("hide");
  $(form)[0].reset();
  $(form + " select")
    .val("")
    .trigger("change");
}

function openForm(form, tb, btn) {
  $(form).removeClass("hide");
  $(tb).addClass("col-md-8");
  $(btn).addClass("hide");
}

function addCostColumn(tb, col) {
  let total = 0;
  $(tb + " tbody tr").each(function () {
    total += parseFloat($(this).find("td").eq(col).text());
  });
  return total.toFixed(2);
}

function modalEditIngrediente(idIng, event) {
  let modalEditIngrediente = bootbox.dialog({
    title: ` ACTUALIZAR INGREDIENTE `,
    message: `
                <form class="row row-cols-1 row-cols-sm-3 row-cols-md-3" id="formEditIngrediente" novalidate>
                    <div class="col-sm-12 col-md-12 mb-3">
                        <label for="iptNombreIng" class="form-label fw-bold"> Nombre</label>
                        <input type="text" class="form-control form-control-sm col-12" id="iptNombreIng" value="${
                          dataCatalogo.ingredientes.find((x) => x.id == idIng)
                            .valor
                        }" tipo="alfanumerico" disabled>
                    </div>
                    <div class="col mb-3">
                        <label for="iptContenidoNetoIng" class="form-label fw-bold"> Contenido neto</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">
                                <i class="icon-hash"></i>
                            </span>
                            <input type="text" class="form-control text-end" id="iptContenidoNetoIng" placeholder="0" value="${
                              dataCatalogo.ingredientes.find(
                                (x) => x.id == idIng
                              ).neto
                            }" tipo="cifra" required/>
                        </div>
                    </div>
                    <div class="col mb-3">
                        <label for="iptPrecioIng" class="form-label fw-bold"> Precio</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">
                                <i class="icon-dollar"></i>
                            </span>
                            <input type="text" class="form-control text-end" id="iptPrecioIng" placeholder="0" value="${
                              dataCatalogo.ingredientes.find(
                                (x) => x.id == idIng
                              ).costo
                            }" tipo="cifra" required/>
                        </div>
                    </div>
                    <div class="col mb-4">
                        <label for="iptPrecioUnidadIng" class="form-label fw-bold"> Precio por unidad</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">
                                <i class="icon-dollar"></i>
                            </span>
                            <input type="text" class="form-control text-end" id="iptPrecioUnidadIng" placeholder="0" value="${
                              dataCatalogo.ingredientes.find(
                                (x) => x.id == idIng
                              ).precioUnidad
                            }" disabled/>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-12 mb-3 d-flex justify-content-between">
                        <button class="btn btn-primary col-5" type="submit">Actualizar</button>
                        <button class="btn btn-outline-danger col-5 offset-2 bootbox-close-button col-5" id="btnCerrarModal">Cancelar</button>
                    </div>
                </form>
            `,
  });
  modalEditIngrediente.on("shown.bs.modal", function () {
    $("#formEditIngrediente button[type='submit']").removeAttr("disabled");
    $("#iptContenidoNetoIng").on("input", function () {
      $("#iptPrecioUnidadIng").val(
        precio_x_unidad("#iptPrecioIng", "#iptContenidoNetoIng")
      );
    });

    $("#iptPrecioIng").on("input", function () {
      $("#iptPrecioUnidadIng").val(
        precio_x_unidad("#iptPrecioIng", "#iptContenidoNetoIng")
      );
    });

    $("#formEditIngrediente").validation_form({}, function (result) {
      $("#formEditIngrediente button[type='submit']").attr(
        "disabled",
        "disabled"
      );
      let tr = $(event.target).closest("tr");
      let dtx = new FormData();
      dtx.append("opc", "createOrUpdateIngredientes");
      dtx.append("precio", $("#iptPrecioIng").val());
      dtx.append("contNeto", $("#iptContenidoNetoIng").val());
      dtx.append("idIngrediente", idIng);
      send_ajax(dtx, ctrlIngredientes).then((data) => {
        if (data === true) {
          alert({
            icon: "success",
            title: "Ingrediente",
            text: "Actualizado correctamente",
          });
          // Cambiar la data del arreglo
          dataCatalogo.ingredientes.find((x) => x.id == idIng).costo =
            $("#iptPrecioIng").val();
          dataCatalogo.ingredientes.find((x) => x.id == idIng).neto = $(
            "#iptContenidoNetoIng"
          ).val();
          dataCatalogo.ingredientes.find((x) => x.id == idIng).precioUnidad = $(
            "#iptPrecioUnidadIng"
          ).val();
          let input = $(tr).find("td").eq(2).find("input").val();
          let precioUnidad = $("#iptPrecioUnidadIng").val();
          // Cambiar la data de la tabla
          $(tr).find("td").eq(3).text($("#iptPrecioUnidadIng").val());
          $(tr)
            .find("td")
            .eq(4)
            .text((input * precioUnidad).toFixed(2));
          modalEditIngrediente.modal("hide");
        } else {
          alert({
            icon: "error",
            title: "Ingrediente",
            text: "Error al actualizar",
          });
        }
      });
    });
  });
}
