window.ctrlIngredientes =
  window.ctrlIngredientes || "ctrl/ctrl-ingredientes.php";

function bodyIngrediente() {
  $("#containerButtonAdd").html(
    `<label col="col-12 d-none d-md-block"> </label>
    <button type="button" class="btn btn-primary col-12" id="btnAddIngrediente" title="Nuevo Ingrediente">
        <i class="icon-plus"></i> Ingrediente
    </button>`
  );
  $(".clasificacion-select").addClass("hide");
  $("#containerCatalogo").removeClass("hide");
  $("#containerTitleIngredientes").html(
    "Lista de ingredientes / " +
      `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
        .text()
        .toLowerCase()}</span>`
  );
  $("#btnAddIngrediente").on("click", function () {
    alert({
      icon: "question",
      title:
        "¿Desea agregar un ingrediente nuevo a " +
        $("#txtcbUDN option:selected").text() +
        "?",
    }).then((result) => {
      if (result.isConfirmed) {
        addIngrediente();
      }
    });
  });
  //   lsIngredientes().then(() => {'
  lsIngredientes();
  applyPermissions();
  //   });
}

function addIngrediente() {
  let json_ingredientes_inputs = [
    {
      opc: "input",
      lbl: "Nombre",
      placeholder: "Nombre",
      tipo: "alfanumerico",
      id: "nombre",
      class: "col-lg-12",
    },
    {
      opc: "input-group",
      lbl: "Contenido neto",
      placeholder: "0.00",
      tipo: "cifra",
      id: "contNeto",
      icon: "icon-hash",
    },
    {
      opc: "span-select",
      lbl: "Unidad",
      tipo: "texto",
      id: "id_Unidad",
      btn_color: "success",
      fn: "addUnidad()",
    },
    {
      opc: "input-group",
      lbl: "Precio",
      placeholder: "0.00",
      tipo: "cifra",
      id: "precio",
      icon: "icon-dollar",
    },
    {
      opc: "input-group",
      lbl: "Precio por unidad",
      placeholder: "0.00",
      tipo: "cifra",
      id: "precioUnidad",
      icon: "icon-dollar",
      readonly: true,
      required: false,
    },
    {
      opc: "span-select",
      lbl: "Marca",
      tipo: "texto",
      id: "id_Marca",
      btn_color: "success",
      required: false,
      fn: "addMarca()",
    },
    {
      opc: "span-select",
      lbl: "Proveedor",
      tipo: "texto",
      id: "id_Proveedor",
      btn_color: "success",
      required: false,
      fn: "addProveedor()",
    },
    {
      opc: "textarea",
      row: 5,
      lbl: "Descripción",
      id: "descripcion",
      class: "col-lg-12 col-md-12",
      placeholder: "Escribe algo...",
      required: false,
    },
  ];

  let form = $("<form>", {
    id: "formAddIngredientes",
    class: "row row-cols-md-2 row-cols-1",
    novalidate: true,
  });

  form.html("").simple_json_form({
    type_btn: "two_btn",
    data: json_ingredientes_inputs,
  });

  let modalAddIngrediente = bootbox.dialog({
    title: `AGREGAR INGREDIENTE A ${$("#txtcbUDN option:selected").text()}`,
    size: "large",
    message: form,
  });

  modalAddIngrediente.on("shown.bs.modal", function () {
    $("#txtnombre").on("input", function () {
      $(this).val($(this).val().toUpperCase());
    });

    $("#txtcontNeto").on("input", function () {
      $("#txtprecioUnidad").val(unitPrice("#txtprecio", "#txtcontNeto"));
    });

    $("#txtprecio").on("input", function () {
      $("#txtprecioUnidad").val(unitPrice("#txtprecio", "#txtcontNeto"));
    });

    const select2 = true;
    const father = true;
    const group = true;
    let placeholder = "- Seleccionar -";

    $("#txtid_Marca").option_select({
      data: dataCatalogo.marca,
      select2,
      father,
      group,
      placeholder,
    });

    $("#txtid_Proveedor").option_select({
      data: dataCatalogo.proveedor,
      select2,
      father,
      group,
      placeholder,
    });

    $("#txtid_Unidad").option_select({
      data: dataCatalogo.unidad,
      select2,
      father,
      group,
      placeholder,
    });

    $("#formAddIngredientes").validation_form(
      { opc: "createOrUpdateIngredientes", id_UDN: $("#txtcbUDN").val() },
      function (result) {
        $("#formAddIngredientes button[type='submit']").attr(
          "disabled",
          "disabled"
        );
        let nombre = $("#txtnombre").val().trim();
        let udn_select = $("#txtcbUDN").val();
        let ingredienteEncontrado = dataCatalogo.ingredientes.filter(
          (x) => x.valor == nombre && x.idudn == udn_select
        );

        if (ingredienteEncontrado.length > 0) {
          alert({
            icon: "error",
            title: "El ingrediente ya existe",
            text: "Por favor, verifique el nombre del ingrediente",
            btn1: "Cerrar",
          });
          $("#formAddIngredientes button[type='submit']").removeAttr(
            "disabled"
          );
          return false;
        } else {
          send_ajax(result, ctrlIngredientes).then((data) => {
            if (data != "" && data != null) {
              alert({
                icon: "success",
                title: "Agregado correctamente",
              });
              // Agregar la lista de dataCatalogo
              dataCatalogo.ingredientes.push({
                id: data[0]["id"],
                valor: $("#txtnombre").val(),
                costo: $("#txtprecio").val(),
                descripcion: $("#txtdescripcion").val(),
                idmarca: $("#txtid_Marca").val(),
                marca: $("#txtid_Marca option:selected").text(),
                idproveedor: $("#txtid_Proveedor").val(),
                proveedor: $("#txtid_Proveedor option:selected").text(),
                idudn: $("#txtcbUDN").val(),
                idunidad: $("#txtid_Unidad").val(),
                neto: $("#txtcontNeto").val(),
                precioUnidad: $("#txtprecioUnidad").val(),
                unidad: $("#txtid_Unidad option:selected").text(),
              });
              $("#formAddIngredientes")[0].reset();
              $(".bootbox").modal("hide");
              $("#formAddIngredientes button[type='submit']").removeAttr(
                "disabled"
              );
              lsIngredientes();
            }
          });
        }
      }
    );
  });
}

function editIngrediente(id) {
  let data = JSON.parse(id);

  let json_ingredientes_inputs = [
    {
      opc: "input",
      lbl: "Nombre",
      placeholder: "Nombre",
      tipo: "alfanumerico",
      id: "nombre",
      class: "col-lg-12",
      value: data.name,
    },
    {
      opc: "input-group",
      lbl: "Contenido neto",
      placeholder: "0.00",
      tipo: "cifra",
      id: "contNeto",
      icon: "icon-hash",
      value: data.neto,
    },
    {
      opc: "span-select",
      lbl: "Unidad",
      tipo: "texto",
      id: "id_Unidad",
      btn_color: "success",
      fn: "addUnidad()",
    },
    {
      opc: "input-group",
      lbl: "Precio",
      placeholder: "0.00",
      tipo: "cifra",
      id: "precio",
      icon: "icon-dollar",
      value: data.precio,
    },
    {
      opc: "input-group",
      lbl: "Precio por unidad",
      placeholder: "0.00",
      tipo: "cifra",
      id: "precioUnidad",
      icon: "icon-dollar",
      value: data.precioUnidad,
      readonly: true,
      required: false,
    },
    {
      opc: "span-select",
      lbl: "Marca",
      tipo: "texto",
      id: "id_Marca",
      btn_color: "success",
      required: false,
      fn: "addMarca()",
    },
    {
      opc: "span-select",
      lbl: "Proveedor",
      tipo: "texto",
      id: "id_Proveedor",
      btn_color: "success",
      required: false,
      fn: "addProveedor()",
    },
    {
      opc: "textarea",
      row: 5,
      lbl: "Descripción",
      id: "descripcion",
      class: "col-lg-12 col-md-12",
      placeholder: "Escribe algo...",
      value: data.descripcion,
      required: false,
    },
  ];

  let form = $("<form>", {
    id: "formEditIngredientes",
    class: "row row-cols-md-2 row-cols-1",
    novalidate: true,
  });

  form.html("").simple_json_form({
    type_btn: "two_btn",
    data: json_ingredientes_inputs,
  });

  let modalEditIngrediente = bootbox.dialog({
    title: `EDITAR INGREDIENTE DE ${$("#txtcbUDN option:selected").text()}`,
    size: "large",
    message: form,
  });

  modalEditIngrediente.on("shown.bs.modal", function () {
    $("#txtnombre").on("input", function () {
      $(this).val($(this).val().toUpperCase());
    });

    $("#txtcontNeto").on("input", function () {
      $("#txtprecioUnidad").val(unitPrice("#txtprecio", "#txtcontNeto"));
    });

    $("#txtprecio").on("input", function () {
      $("#txtprecioUnidad").val(unitPrice("#txtprecio", "#txtcontNeto"));
    });

    const select2 = true;
    const father = true;
    const group = true;
    const placeholder = "- Seleccionar -";

    $("#txtid_Marca").option_select({
      data: dataCatalogo.marca,
      select2,
      father,
      group,
      placeholder,
    });

    $("#txtid_Proveedor").option_select({
      data: dataCatalogo.proveedor,
      select2,
      father,
      group,
      placeholder,
    });

    $("#txtid_Unidad").option_select({
      data: dataCatalogo.unidad,
      select2,
      father,
      group,
      placeholder,
    });

    // Llenar los selects
    $("#txtid_Unidad option[value='" + data.unidad + "']")
      .prop("selected", true)
      .trigger("change");

    $("#txtid_Marca option[value='" + data.marca + "']")
      .prop("selected", true)
      .trigger("change");

    $("#txtid_Proveedor option[value='" + data.proveedor + "']")
      .prop("selected", true)
      .trigger("change");

    // Validar el formulario y enviar los datos
    $("#formEditIngredientes").validation_form(
      { opc: "createOrUpdateIngredientes", id_UDN: $("#txtcbUDN").val() },
      function (result) {
        alert({
          icon: "question",
          title:
            "¿Está seguro de actualizar <strong>" + data.name + "</strong>?",
          text: "Esto afectará a todas las recetas y subrecetas que lo contengan",
        }).then((result_alert) => {
          if (result_alert.isConfirmed) {
            $("#formEditIngredientes button[type='submit']").attr(
              "disabled",
              "disabled"
            );
            result.append("idIngrediente", data.id);
            let ingredientesEncontrados = dataCatalogo.ingredientes.filter(
              (x) =>
                x.valor == $("#txtnombre").val() &&
                x.idudn == $("#txtcbUDN").val() &&
                x.id != data.id
            );
            if (ingredientesEncontrados.length > 0) {
              alert({
                icon: "error",
                title: "El ingrediente ya existe",
                text: "Por favor, verifique el nombre del ingrediente",
                btn1: "Cerrar",
              });
              $("#formEditIngredientes button[type='submit']").removeAttr(
                "disabled"
              );
              return false;
            } else {
              send_ajax(result, ctrlIngredientes).then((dat) => {
                if (dat === true) {
                  alert({
                    icon: "success",
                    title: "Actualizado correctamente",
                  });

                  // Actualizar la lista de dataCatalogo
                  dataCatalogo.ingredientes.find((x) => x.id == data.id).valor =
                    $("#txtnombre").val();
                  dataCatalogo.ingredientes.find((x) => x.id == data.id).costo =
                    $("#txtprecio").val();
                  dataCatalogo.ingredientes.find(
                    (x) => x.id == data.id
                  ).descripcion = $("#txtdescripcion").val();
                  dataCatalogo.ingredientes.find(
                    (x) => x.id == data.id
                  ).idmarca = $("#txtid_Marca").val();
                  dataCatalogo.ingredientes.find((x) => x.id == data.id).marca =
                    $("#txtid_Marca option:selected").text();
                  dataCatalogo.ingredientes.find(
                    (x) => x.id == data.id
                  ).idproveedor = $("#txtid_Proveedor").val();
                  dataCatalogo.ingredientes.find(
                    (x) => x.id == data.id
                  ).proveedor = $("#txtid_Proveedor option:selected").text();
                  dataCatalogo.ingredientes.find((x) => x.id == data.id).idudn =
                    $("#txtcbUDN").val();
                  dataCatalogo.ingredientes.find(
                    (x) => x.id == data.id
                  ).idunidad = $("#txtid_Unidad").val();
                  dataCatalogo.ingredientes.find((x) => x.id == data.id).neto =
                    $("#txtcontNeto").val();
                  dataCatalogo.ingredientes.find(
                    (x) => x.id == data.id
                  ).precioUnidad = $("#txtprecioUnidad").val();
                  dataCatalogo.ingredientes.find(
                    (x) => x.id == data.id
                  ).unidad = $("#txtid_Unidad option:selected").text();
                  $("#formEditIngredientes")[0].reset();
                  $(".bootbox").modal("hide");
                  $("#formEditIngredientes button[type='submit']").removeAttr(
                    "disabled"
                  );
                  lsIngredientes();
                } else {
                  alert({
                    icon: "error",
                    title: "Error al actualizar",
                  });
                }
              });
            }
          }
        });
      }
    );
  });
}

function deleteIngrediente(id) {
    let recetitasData = {
        opc: "lsIngredientesReceta",
        idIngrediente: id,
    };
    let subrecetitasData = {
        opc: "lsIngredientesSubreceta",
        idIngrediente: id,
    };

    let dataRecetas = '';
    let dataSubrecetas = '';
    let hayrecetas = false;
    let haysubrecetas = false;

    new Promise((resolve, reject) => {
        Promise.all([
            fn_ajax(recetitasData, ctrlIngredientes),
            fn_ajax(subrecetitasData, ctrlIngredientes)
        ]).then(([dataRecetasResponse, dataSubrecetasResponse]) => {
            // Procesar dataRecetas
            if (dataRecetasResponse.length > 0) {
                dataRecetas = dataRecetasResponse.map((x) => x.rec).join(", ");
                hayrecetas = true;
            } else {
                dataRecetas = 'No hay recetas que contengan este ingrediente.';
            }

            // Procesar dataSubrecetas
            if (dataSubrecetasResponse.length > 0) {
                dataSubrecetas = dataSubrecetasResponse.map((x) => x.sub).join(", ");
                haysubrecetas = true;
            } else {
                dataSubrecetas = 'No hay subrecetas que contengan este ingrediente.';
            }
            resolve(); // Resuelve la promesa después de que ambas solicitudes hayan terminado
        }).catch(reject); // En caso de error, rechaza la promesa
    }).then(() => {
        if (hayrecetas || haysubrecetas) {
            alert({
                icon: 'error',
                title: `No se puede eliminar el ingrediente: ${dataCatalogo.ingredientes.find((x) => x.id == id).valor}`,
                html: `El ingrediente está presente en las siguientes...<br> <br><strong>RECETAS:</strong> ${dataRecetas}<br><br><strong>SUBRECETAS:</strong> ${dataSubrecetas}`,
                btn1: true,
                btn1Text: 'Ok'
            });
        } else {
            alert({
                icon: "question",
                title: `¿Está seguro de eliminar el ${dataCatalogo.ingredientes.find((x) => x.id == id).valor}?`,
                text: `Esta acción no se puede deshacer`,
            }).then((result) => {
                if (result.isConfirmed) {
                    let dtx = {
                        opc: "deleteIngrediente",
                        idIngrediente: id,
                    }
                    fn_ajax(dtx, ctrlIngredientes).then((data) => {
                        if (data === true) {
                            alert({
                                icon: "success",
                                title: "Eliminado correctamente",
                            });
                            dataCatalogo.ingredientes = dataCatalogo.ingredientes.filter(
                                (x) => x.id != data.id
                            );
                            lsIngredientes();
                        } else {
                            alert({
                                icon: "error",
                                title: "Error al eliminar",
                            });
                        }
                    });
                }
            });
        }
    });
}

function addProveedor() {
  let form = $("<form>", {
    id: "formAddProveedor",
    class: "row row-cols-md-2 row-cols-1",
    novalidate: true,
  });

  let json_proveedor_inputs = [
    {
      opc: "input",
      lbl: "Nombre",
      placeholder: "Nombre",
      tipo: "alfanumerico",
      id: "proveedor",
      class: "col-lg-12",
    },
  ];

  form.html("").simple_json_form({
    type_btn: "two_btn",
    data: json_proveedor_inputs,
  });

  let modalAddProveedor = bootbox.dialog({
    title: "AGREGAR PROVEEDOR",
    size: "small",
    message: form,
  });

  modalAddProveedor.on("shown.bs.modal", function () {
    modalAddProveedor.focus();
    $("#txtproveedor").focus();
    $("#txtproveedor").on("input", function () {
      $(this).val($(this).val().toUpperCase());
    });

    $("#formAddProveedor").validation_form({}, function (result) {
      $("#formAddProveedor button[type='submit']").attr("disabled", "disabled");
      let dtx = new FormData();
      dtx.append("opc", "createProveedor");
      dtx.append("nombre", $("#txtproveedor").val());
      send_ajax(dtx, ctrlCatalogo).then((data) => {
        if (data != "" && data != null) {
          alert({
            icon: "success",
            title: "Agregado correctamente",
          });
          $("#formAddProveedor")[0].reset();
          // Agregarlo en el select
          $("#txtid_Proveedor").append(
            $("<option>").text(data.valor).val(data.id).attr("id", data.id)
          );
          // Selecciona el nuevo proveedor
          $("#txtid_Proveedor option[value='" + data.id + "']").prop(
            "selected",
            true
          );
          $("#txtid_Proveedor").trigger("change");
          // Agregarlo a dataCatalogo
          dataCatalogo.proveedor.push({
            id: data.id,
            valor: data.valor,
          });
          modalAddProveedor.modal("hide");
          $("#formAddProveedor button[type='submit']").removeAttr("disabled");
        } else {
          alert({
            icon: "error",
            title: "Error al agregar",
          });
        }
      });
    });
  });
}

function addMarca() {
  let form = $("<form>", {
    id: "formAddMarca",
    class: "row row-cols-md-2 row-cols-1",
    novalidate: true,
  });

  let json_marca_inputs = [
    {
      opc: "input",
      lbl: "Nombre",
      placeholder: "Nombre",
      tipo: "alfanumerico",
      id: "marca",
      class: "col-lg-12",
    },
  ];

  form.html("").simple_json_form({
    type_btn: "two_btn",
    data: json_marca_inputs,
  });

  let modalAddMarca = bootbox.dialog({
    title: "AGREGAR MARCA",
    size: "small",
    message: form,
  });

  modalAddMarca.on("shown.bs.modal", function () {
    modalAddMarca.focus();
    $("#txtmarca").focus();
    $("#txtmarca").on("input", function () {
      $(this).val($(this).val().toUpperCase());
    });

    $("#formAddMarca").validation_form(
      { opc: "createMarca" },
      function (result) {
        $("#formAddMarca button[type='submit']").attr("disabled", "disabled");
        send_ajax(result, ctrlCatalogo).then((data) => {
          if (data != "" && data != null) {
            alert({
              icon: "success",
              title: "Agregado correctamente",
            });
            $("#formAddMarca")[0].reset();
            // Agregarlo en el select
            $("#txtid_Marca").append(
              $("<option>")
                .text(data[0].valor)
                .val(data[0].id)
                .attr("id", data[0].id)
            );
            // Selecciona la nueva marca
            $("#txtid_Marca option[value='" + data[0].id + "']").prop(
              "selected",
              true
            );
            $("#txtid_Marca").trigger("change");
            // Agregarlo a dataCatalogo
            dataCatalogo.marca.push({
              id: data[0].id,
              valor: data[0].valor,
            });
            modalAddMarca.modal("hide");
            $("#formAddMarca button[type='submit']").removeAttr("disabled");
          } else {
            alert({
              icon: "error",
              title: "Error al agregar",
            });
          }
        });
      }
    );
  });
}

function addUnidad() {
  let form = $("<form>", {
    id: "formAddUnidad",
    class: "row row-cols-md-2 row-sm-1 row-cols-1",
    novalidate: true,
  });

  let json_unidad_inputs = [
    {
      opc: "input",
      lbl: "Nombre",
      placeholder: "Nombre",
      tipo: "alfanumerico",
      id: "unidad",
      class: "col-lg-12",
    },
  ];

  form.html("").simple_json_form({
    type_btn: "two_btn",
    data: json_unidad_inputs,
  });

  let modalAddUnidad = bootbox.dialog({
    title: "AGREGAR UNIDAD",
    size: "small",
    message: form,
  });

  modalAddUnidad.on("shown.bs.modal", function () {
    modalAddUnidad.focus();
    $("#txtunidad").focus();
    $("#txtunidad").on("input", function () {
      $(this).val($(this).val().toUpperCase());
    });

    $("#formAddUnidad").validation_form(
      { opc: "createUnidad" },
      function (result) {
        $("#formAddUnidad button[type='submit']").attr("disabled", "disabled");
        send_ajax(result, ctrlCatalogo).then((data) => {
          if (data != "" && data != null) {
            alert({
              icon: "success",
              title: "Agregado correctamente",
            });
            $("#formAddUnidad")[0].reset();
            // Agregarlo en el select
            $("#txtid_Unidad").append(
              $("<option>")
                .text(data[0].valor)
                .val(data[0].id)
                .attr("id", data[0].id)
            );
            // Selecciona la nueva unidad
            $("#txtid_Unidad option[value='" + data[0].id + "']").prop(
              "selected",
              true
            );
            $("#txtid_Unidad").trigger("change");
            // Agregarlo a dataCatalogo
            dataCatalogo.unidad.push({
              id: data[0].id,
              valor: data[0].valor,
            });
            modalAddUnidad.modal("hide");
            $("#formAddUnidad button[type='submit']").removeAttr("disabled");
          } else {
            alert({
              icon: "error",
              title: "Error al agregar",
            });
          }
        });
      }
    );
  });
}
