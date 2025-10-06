window.ctrlIngredientes =
  window.ctrlIngredientes || "ctrl/ctrl-ingredientes.php";

function bodyIngrediente() {
  $("#containerButtonAdd").html(
    `<label col="col-12 d-none d-md-block"> </label>
    <button type="button" class="btn btn-primary col-12" id="btnAddIngrediente" title="Nuevo Ingrediente">
        <i class="icon-plus"></i> Ingrediente
    </button>`
  );
  $(".clasificacion-select").addClass("hide");
  $("#btnAddIngrediente").on("click", () => addIngrediente());
  lsIngredientes();
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
      tipo: "texto",
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
      $("#txtprecioUnidad").val(precio_x_unidad());
    });

    $("#txtprecio").on("input", function () {
      $("#txtprecioUnidad").val(precio_x_unidad());
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
        send_ajax(result, ctrlIngredientes).then((data) => {
          if (data === true) {
            alert({
              icon: "success",
              title: "Agregado correctamente",
            });
            $("#formAddIngredientes")[0].reset();
            $(".bootbox").modal("hide");
            $("#formAddIngredientes button[type='submit']").removeAttr(
              "disabled"
            );
            lsIngredientes();
          } else console.log(data);
        });
      }
    );
  });
}

function editIngrediente(id) {
  let data = JSON.parse(id);

  json_ingredientes_inputs = [
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
      tipo: "texto",
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
      $("#txtprecioUnidad").val(precio_x_unidad("#txtprecio", "#txtcontNeto"));
    });

    $("#txtprecio").on("input", function () {
      $("#txtprecioUnidad").val(precio_x_unidad("#txtprecio", "#txtcontNeto"));
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
            send_ajax(result, ctrlIngredientes).then((dat) => {
              if (dat === true) {
                alert({
                  icon: "success",
                  title: "Actualizado correctamente",
                });
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
                console.log(dat);
              }
            });
          }
        });
      }
    );
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
          console.log(data);
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
            console.log(data);
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
            console.log(data);
          }
        });
      }
    );
  });
}
