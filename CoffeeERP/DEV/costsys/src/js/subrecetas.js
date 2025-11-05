window.ctrlSubrecetas = window.ctrlSubrecetas || "ctrl/ctrl-subrecetas.php";

let data_table_sub_sub = {};
let data_event_sub_sub = {};

function bodySubreceta() {
    // Agregar el boton de agregar subreceta
    $("#containerButtonAdd").html(
        `<label col="col-12 d-none d-md-block"> </label>
    <button type="button" class="btn btn-primary col-12" id="btnAddSubReceta" title="Nueva SubReceta">
        <i class="icon-plus"></i> Subreceta
    </button>`
    );
    // Mostrar la clasificación
    $(".clasificacion-select").removeClass("hide");
    // Para el cambio de pestañas, cuando se van a catalogo de recetas
    if ($(".secondary-sub").hasClass("hide")) {
        $("#containerCatalogo").removeClass("hide");
    }
    // Mostrar la UDN de lista de subrecetas
    $("#containerTitleSubRecetas").html(
        "Lista de subrecetas / " +
        `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
            .text()
            .toLowerCase()}</span>`
    );
    // Agregar una subreceta alerta de confirmación
    $("#btnAddSubReceta").on("click", function () {
        alert({
            icon: "question",
            title:
                "¿Desea agregar una nueva subreceta a " +
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
    // Mostrar las subrecetas
    lsSubrecetas();
    //   applyPermissions();

    // Evento para la foto de la subreceta
    $("#photo-subreceta").change(function () {
        photoSubReceta();
    });
}

//? Opciones subrecetas
function handleActionSubReceta(id, action) {
    switch (action) {
        case "Ver":
            showSubReceta(id);
            break;
        case "Editar":
            editSubRecetaInterface(id);
            break;
        case "Recetario":
            procedureSubReceta(id);
            break;
        case "Observaciones":
            observationSubReceta(id);
            break;
        case "Imprimir":
            printSubReceta(id);
            break;
        case "Eliminar":
            deleteSubReceta(id);
            break;
    }
}

//? Desplegar subreceta
function dropdownSubreceta(id) {
    let dropdownMenu = `
        <ul class="dropdown-menu" aria-labelledby="aDropdownSubReceta${id}" data-popper-placement="bottom-end">
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemVerSubReceta" href="#" onclick="handleActionSubReceta(${id}, 'Ver')"><i class="text-info icon-eye"></i> Ver</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemEditarSubReceta" href="#" onclick="handleActionSubReceta(${id}, 'Editar')"><i class="text-info icon-pencil-5"></i> Editar</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemRecetario SubReceta" href="#" onclick="handleActionSubReceta(${id}, 'Recetario')"><i class="text-info icon-comment-1"></i> Recetario</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemObservacionesSubReceta" href="#" onclick="handleActionSubReceta(${id}, 'Observaciones')"><i class="text-info icon-search-5"></i> Observaciones</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemImprimirSubReceta" href="#" onclick="handleActionSubReceta(${id}, 'Imprimir')"><i class="text-info icon-print"></i> Imprimir</a></li>
            <li><a class="dropdown-item pt-2 pb-3 dropdownItemEliminarSubReceta" href="#" onclick="handleActionSubReceta(${id}, 'Eliminar')"><i class="text-info icon-cancel"></i> Eliminar</a></li>
        </ul>
    `;

    if (!$(`#aDropdownSubReceta${id}`).next(".dropdown-menu").length) {
        $(`#aDropdownSubReceta${id}`).after(dropdownMenu);
    }
}

//* INTERFACES ------------------------------------------------------------
//? Agregar subreceta interfaz y eventos.
function addSubRecetaInterface() {
    // Cambiar el título de la interfaz addSubReceta
    $("#titleSubReceta").html(
        "Nueva subreceta / " +
        `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
            .text()
            .toLowerCase()}</span>`
    );
    // Ocultar el catálogo de subrecetas
    $("#containerCatalogo").addClass("hide");
    $(".main-sub").addClass("hide");
    $("#btnSaveSubReceta").addClass("hide");
    $("#fillSubReceta").addClass("hide");
    // Mostrar la interfaz de addSubReceta
    $(".secondary-sub").removeClass("hide");
    $("#btnCreateSubReceta").removeClass("hide");
    // Habilitar los campos de formAddSubReceta
    $("#txtSubReceta").prop("disabled", false);
    $("#textareaNotasSub").prop("disabled", false);
    $("#txtcbClasificacionSub").prop("disabled", false);
    $("#txtSubReceta").val("");
    $("#textareaNotasSub").val("");
    $("#txtSubReceta").focus();
    // Cambiar el texto del botón de guardar
    $("#btnCreateSubReceta").text("Crear subreceta");
    // Habilitar los botones de submit
    $("#formAddSubReceta button[type='submit']").removeAttr("disabled");
    $("#formProcedimientoCulinarioSub button[type='submit']").removeAttr(
        "disabled"
    );
    $("#formAddSubRecetasIng button[type='submit']").removeAttr("disabled");
    $("#formAddSubRecetasSub button[type='submit']").removeAttr("disabled");
    // Eliminar las clases is-invalid
    $("#formAddSubReceta :input.is-invalid").removeClass("is-invalid");
    // Cargar imagen por defecto
    $("#imgSubReceta").attr(
        "src",
        "./src/img/default.png"
    );
    $("#content_photo_subreceta p").removeClass("d-flex").addClass("hide");
    // Obtener la clasificación seleccionada para la nueva subreceta
    $("#txtcbClasificacionSub").val(
        $("#txtcbClasificacion option:selected").val()
    );
    $("#btnCloseSubReceta").removeClass("mt-4");
    $("#btnCloseSubReceta").addClass("mt-2");

    // Llamar a la función subreceta
    subrecipe("create", null);
}

//? Editar subreceta interfaz y eventos.
function editSubRecetaInterface(id) {
    // Cambiar el título de la interfaz editSubReceta
    $("#titleSubReceta").html(
        "Editar subreceta / " +
        `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
            .text()
            .toLowerCase()}</span>`
    );
    // Ocultar el catálogo de subrecetas
    $("#containerCatalogo").addClass("hide");
    $(".main-sub").addClass("hide");
    $("#btnSaveSubReceta").addClass("hide");
    // Mostrar la interfaz de editSubReceta
    $("#fillSubReceta").removeClass("hide");
    $(".secondary-sub").removeClass("hide");
    $("#btnCreateSubReceta").removeClass("hide");
    // Habilitar los campos de formAddSubReceta
    $("#txtSubReceta").prop("disabled", false);
    $("#textareaNotasSub").prop("disabled", false);
    $("#txtcbClasificacionSub").prop("disabled", false);
    $("#txtSubReceta").val("");
    $("#textareaNotasSub").val("");
    $("#txtSubReceta").focus();
    // Cambiar el texto del botón de actualizar
    $("#btnCreateSubReceta").text("Actualizar subreceta");
    // Habilitar los botones de submit
    $("#formAddSubReceta button[type='submit']").removeAttr("disabled");
    $("#formProcedimientoCulinarioSub button[type='submit']").removeAttr(
        "disabled"
    );
    $("#formAddSubRecetasIng button[type='submit']").removeAttr("disabled");
    $("#formAddSubRecetasSub button[type='submit']").removeAttr("disabled");
    // Eliminar las clases is-invalid
    $("#formAddSubReceta :input.is-invalid").removeClass("is-invalid");

    // Obtenemos el arreglo de datos de ingredientes filtrados por clasificación
    let dataIng = updateDataIngredientes();
    // Obtenemos el arreglo de datos de subrecetas filtrados por clasificación
    let dataSubreceta = updateDataSubRecetas();

    // Borra la foto
    deletePhotoSubReceta(id);

    // Recuperar datos de la subreceta
    let foto = dataSub.find((x) => x.id == id).foto;
    if (foto !== null && foto !== "" && foto !== undefined  && foto !== "erp_files/default.png") {
        // Hacer un explote por el nombre de la foto
        let fotoSplit = foto.split("/");
        if (fotoSplit[0] == "erp_files") {
            // Cargar la foto de la subreceta
            $("#imgSubReceta").attr("src", "https://www.erp-varoch.com/" + foto);
        } else {
            // Cargar la foto de la subreceta
            $("#imgSubReceta").attr("src", "https://www.erp-varoch.com/ERP/" + foto);
        }
        $("#content_photo_subreceta p").removeClass("hide").addClass("d-flex");
    } else {
        // Cargar imagen por defecto
        $("#imgSubReceta").attr(
            "src",
            "./src/img/default.png"
        );
        $("#content_photo_subreceta p").removeClass("d-flex").addClass("hide");
    }
    // Rellenar los campos de la subreceta
    $("#txtSubReceta").val(dataSub.find((x) => x.id == id).valor);
    $("#textareaNotasSub").val(dataSub.find((x) => x.id == id).observaciones);
    $("#txtcbClasificacionSub").val(
        dataSub.find((x) => x.id == id).idclasificacion
    );

    $("#btnCloseSubReceta").removeClass("mt-4");
    $("#btnCloseSubReceta").addClass("mt-2");

    // Llamar a la funciones de subreceta y procedimiento culinario
    subrecipe("edit", id);
    culinaryProcedureSubReceta("edit", id);
    ingredientsAndSubRecetaSubReceta(id, dataIng, dataSubreceta);
}

//? Maneja la validación para agregar o editar subrecetas.
function subrecipe(param, id) {
    // Mayúsculas en el input nombre
    $("#txtSubReceta").on("input", function () {
        this.value = this.value.toUpperCase();
    });

    // Agregar/Editar subrecetas
    $("#formAddSubReceta").validation_form({}, async function (result) {
        $("#formAddSubReceta button[type='submit']").attr("disabled", "disabled");
        let idSubReceta = param === "create" ? null : id; // Obtener el ID según la condición
        let udn =
            param === "edit"
                ? dataSub.find((x) => x.id == id).idudn
                : $("#txtcbUDN").val();

        // Validar si la subreceta ya existe
        let confirmarGuardado = await validateSubReceta(idSubReceta, udn);

        if (confirmarGuardado) {
            if (param === "create") {
                addSubReceta();
            } else if (param === "edit") {
                editSubReceta(id);
            }
        } else {
            $("#formAddSubReceta button[type='submit']").removeAttr("disabled");
        }
    });

    // Cerrar interfaz
    $("#btnCloseSubReceta")
        .off()
        .on("click", function () {
            let alert_close_subreceta = "";
            if (param === "create") {
                alert_close_subreceta = alert({
                    icon: "question",
                    title: "¿Desea regresar a la página principal?",
                    text: "Los datos que NO han sido guardados se perderán.",
                });
            } else if (param === "edit") {
                alert_close_subreceta = alert({
                    icon: "question",
                    title: "¿Desea terminar de editar esta subreceta?",
                    text: "Los cambios NO guardados se perderán.",
                });
            }

            alert_close_subreceta.then((result) => {
                if (result.isConfirmed) {
                    // Validar que si la unidad no es seleccionada en procedimiento culinario no pueda salir
                    if ($("#txtUnidadSub").val() === null || $("#txtUnidadSub").val() === "") {
                        alert({
                            icon: "error",
                            title: "Procedimiento culinario",
                            text: "Seleccione una unidad",
                            btn1: true,
                        });
                        return false;
                    } else {
                        // Ocultar la interfaz de addSubReceta / editSubReceta
                        $(".secondary-sub").addClass("hide");
                        $("#formAddSubReceta")[0].reset();
                        $("#containerFormProcCulinarioSub").html("");
                        $("#frmAndTbSubRecetasIng").html("");
                        $("#frmAndTbSubRecetasSub").html("");
                        // Habilitar los botones de submit
                        $("#formAddSubReceta button[type='submit']").removeAttr("disabled");
                        $("#formProcedimientoCulinarioSub button[type='submit']").removeAttr(
                            "disabled"
                        );
                        $("#formAddSubRecetasIng button[type='submit']").removeAttr(
                            "disabled"
                        );
                        $("#formAddSubRecetasSub button[type='submit']").removeAttr(
                            "disabled"
                        );
                        // Eliminar las clases is-invalid
                        $("#formAddSubReceta :input.is-invalid").removeClass("is-invalid");
                        // Cargar imagen por defecto
                        $("#imgSubReceta").attr(
                            "src",
                            "./src/img/default.png"
                        );
                        // Mostrar la interfaz de catálogo de subrecetas
                        $("#btnAddSubReceta").removeClass("hide");
                        $(".main-sub").removeClass("hide");
                        $("#containerCatalogo").removeClass("hide");
                        lsSubrecetas();
                    }
                }
            });
        });
}

//? Procedimiento culinario intefaz y eventos.
function culinaryProcedureSubReceta(param, id) {
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
            },
            {
                opc: "input-group",
                lbl: "Rendimiento",
                icon: "icon-hash",
                tipo: "cifra",
                id: "RendimientoSub",
                placeholder: "0.00",
                required: true,
                value: dataSub.find((x) => x.id == id).rendimiento,
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
                value: dataSub.find((x) => x.id == id).costo,
            },
        ];
    }

    // Crear el formulario
    let form_proc_sub = $("<form>", {
        id: "formProcedimientoCulinarioSub",
        class: "row row-cols-1",
        novalidate: true,
    });
    form_proc_sub.html("").simple_json_form({
        data: json_form_proc_culinario_sub,
        name_btn: "Guardar Procedimiento",
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
    // Si es editar selecciona la unidad
    if (param === "edit") {
        $("#txtUnidadSub")
            .val(dataSub.find((x) => x.id == id).idunidad)
            .trigger("change");
    }

    // EVENTOS
    // Evento para el input rendimiento
    $("#txtRendimientoSub").on("input", function () {
        let totalIng = parseFloat(
            $("#txtTotalIngredientesSub").val().replace(/,/g, "")
        );
        let rendimiento =
            $(this).val() !== "" ? parseFloat($(this).val().replace(/,/g, "")) : 0;

        // Calcular el costo
        let costo = rendimiento === 0 ? 0 : totalIng / rendimiento;

        // Dar formato
        let costoFormat = costo.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        // Agregar el costo al input costo
        $("#txtCostoSub").val(costoFormat);
    });

    // Validation form procedimiento culinario
    $("#formProcedimientoCulinarioSub").validation_form({}, function (result) {
        $("#formProcedimientoCulinarioSub button[type='submit']").attr(
            "disabled",
            "disabled"
        );
        // Guardar el procedimiento culinario
        addProcedimientoCulinarioSub(id);
    });
}

//? Modulo 1: form/table ingredientes y subrecetas interfaz y eventos.
function ingredientsAndSubRecetaSubReceta(id, dataIng, dataSubreceta) {
    // Objeto tabla para ambos módulos
    let object_table = {};
    object_table = {
        f_size: "14",
        ipt: [3],
        color_th: "bg-primary",
        right: [4, 5],
    };
    //* MODULO 1. FORM/TABLE SUBRECETA - INGREDIENTE -------------
    // FORMULARIO AGREGAR SUBRECETA - INGREDIENTE ----------------
    // JSON
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
    // OBJETOS
    // Guardar SUBRECETA - INGREDIENTE
    let object_frm_ing = {
        id_Subreceta: id,
        opc: "createSubRecetaIngrediente",
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

    // TABLA SUBRECETA - INGREDIENTE -----------------------------
    // OBJETOS
    // Datos tabla
    let dtx_sub_ing = {
        opc: "tbSubRecetaIngrediente",
        idSubReceta: id,
    };
    // Editar SUBRECETA - INGREDIENTE (Evento input tabla)
    let object_event_ing = {
        opc: "updateSubRecetaIngrediente",
        id_Subreceta: id,
    };

    // CREACIÓN DEL MÓDULO 1 - SUBRECETA - INGREDIENTE -----------
    $("#frmAndTbSubRecetasIng").modulo_1({
        json_frm: json_form_sub_ing,
        datos: dtx_sub_ing,
        enlace: ctrlSubrecetas,
        content_table: "contentTableSubRecetasIng",
        frm: "formAddSubRecetasIng",
        table: "tbSubRecetasIng",
        class_frm: "col-12 col-md-4 hide",
        class_formulario: "col-12 container-border-right container-border-info",
        class_table: "col-12 col-md-12",
        atributos_table: object_table,
        atributos_frm: object_frm_ing,
        atributos_alert: object_alert_ing,
        atributos_event: object_event_ing,
        attr_json_frm: object_attr_json_frm_ing,
        extend_fn: function () {
            changeCulinaryProcedureSubReceta();
            inputEventTbIngSub();
            applyPermissions();
        },
    });

    // Cargar datos en el select ingredientes
    if (dataIng.length > 0) {
        $("#txtid_Ingrediente").option_select({
            data: dataIng,
            select2: true,
            group: false,
            placeholder: "Selecciona un ingrediente",
        });
    }

    //* MODULO 1. FORM/TABLE SUBRECETA - SUBRECETA --------------
    // FORMULARIO AGREGAR SUBRECETA - SUBRECETA -----------------
    // JSON
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
    // OBJETOS
    // Guardar SUBRECETA - SUBRECETA
    let object_frm_sub = {
        id_Subreceta1: id,
        opc: "createSubRecetaSubReceta",
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

    // TABLA SUBRECETA - SUBRECETA -----------------------------
    // OBJETOS
    // Datos tabla
    data_table_sub_sub = {
        opc: "tbSubRecetaSubReceta",
        idSubReceta: id,
    };
    // Editar SUBRECETA - SUBRECETA (Evento input tabla)
    data_event_sub_sub = {
        opc: "updateSubRecetaSubReceta",
        id_Subreceta1: id,
    };

    // CREACIÓN DEL MÓDULO 1 - SUBRECETA - SUBRECETA ----------
    if (dataSubreceta.length > 0) {
        $("#frmAndTbSubRecetasSub").modulo_1({
            json_frm: json_form_sub_sub,
            datos: data_table_sub_sub,
            enlace: ctrlSubrecetas,
            content_table: "contentTableSubRecetasSub",
            frm: "formAddSubRecetasSub",
            table: "tbSubRecetasSub",
            class_frm: "col-12 col-md-4 hide",
            class_formulario: "col-12  container-border-right container-border-info",
            class_table: "col-12 col-md-12",
            atributos_table: object_table,
            atributos_frm: object_frm_sub,
            atributos_alert: object_alert_sub,
            atributos_event: data_event_sub_sub,
            attr_json_frm: object_attr_json_frm_sub,
            extend_fn: function () {
                changeCulinaryProcedureSubReceta();
                inputEventTbSubSub();
                applyPermissions();
            },
        });
    }

    // Eliminar la subreceta actual de la lista de subrecetas
    let subreceta2 = dataSubreceta.filter((item) => item.id !== String(id));

    // Cargar datos en el select subrecetas
    $("#txtid_Subreceta2").option_select({
        data: subreceta2,
        select2: true,
        group: false,
        placeholder: "Selecciona una subreceta",
    });

    // Cargar el select de subrecetas y el modulo 1 de acuerdo a la clasificación
    $("#txtcbClasificacionSub").on("change", function () {
        //  Obtenemos el arreglo de datos de subrecetas filtrados por clasificación
        let dataSubreceta = updateDataSubRecetas();

        // Si hay datos de subrecetas con la clasificación seleccionada se crea el módulo 1 si no se ha creado
        if (dataSubreceta.length > 0 && $("#frmAndTbSubRecetasSub").html() === "") {
            $("#frmAndTbSubRecetasSub").modulo_1({
                json_frm: json_form_sub_sub,
                datos: data_table_sub_sub,
                enlace: ctrlSubrecetas,
                content_table: "contentTableSubRecetasSub",
                frm: "formAddSubRecetasSub",
                table: "tbSubRecetasSub",
                class_frm: "col-12 col-md-4 hide",
                class_formulario:
                    "col-12  container-border-right container-border-info",
                class_table: "col-12 col-md-12",
                atributos_table: object_table,
                atributos_frm: object_frm_sub,
                atributos_alert: object_alert_sub,
                atributos_event: data_event_sub_sub,
                attr_json_frm: object_attr_json_frm_sub,
                extend_fn: function () {
                    changeCulinaryProcedureSubReceta();
                    inputEventTbSubSub();
                    applyPermissions();
                },
            });
        } else if (dataSubreceta.length === 0) {
            // Si no hay datos de subrecetas con la clasificación seleccionada se elimina el módulo 1
            $("#frmAndTbRecetasSub").html("");
        }

        // Eliminar la subreceta actual de la lista de subrecetas
        let subreceta2 = dataSubreceta.filter((item) => item.id !== String(id));
        $("#txtid_Subreceta2").html("");
        // Cargar datos en el select subrecetas
        $("#txtid_Subreceta2").option_select({
            data: subreceta2,
            select2: true,
            group: false,
            placeholder: "Selecciona una subreceta",
        });
    });

    //* ESTILOS -----------------------------------------------
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

//* SUBRECETA ------------------------------------------------------------
//? Validar el cambio de nombre de la subreceta.
async function validateSubReceta(id, udn) {
    // Confimar guardado
    const confirmacionInicial = await alert({
        icon: "question",
        title: "¿Está seguro de guardar esta subreceta?",
    });
    // Si no la guardan no se hace nada
    if (!confirmacionInicial.isConfirmed) return false;
    // Variable input nombre subreceta
    const nameSubReceta = $("#txtSubReceta").val().toUpperCase().trim();

    // Consulta si existe la subreceta
    let datos = new FormData();
    datos.append("opc", "validateSubReceta");
    datos.append("nombre", nameSubReceta);
    datos.append("udn", udn);

    data = await send_ajax(datos, ctrlSubrecetas);

    // Verifica si hay datos
    if (data && data.length > 0) {
        let nombres = "";
        let id_udn = "";
        let encontrado = false;

        // Recorre los datos
        data.forEach((element) => {
            // Concatena los nombres y los id_udn
            nombres += element.nombre + ", ";
            id_udn = element.id_udn + ", ";
            // Si el id es igual al id de la subreceta a validar
            if (element.id == id) {
                encontrado = true;
            }
        });

        // Si encontrado es true, entonces es una edición de una subreceta y el nombre sigue siendo el mismo
        if (encontrado) {
            return true;
        } else {
            // Si no, es una subreceta nueva o un cambio de nombre
            let existe = data.some(
                (x) => x.nombre === nameSubReceta && x.id_udn === udn && x.id !== id
            ); // Verifica si el nombre ya existe en la UDN con distinto ID

            // Si existe, muestra un mensaje con los nombres de las subrecetas iguales o similares
            if (existe) {
                let confirmacionSimilar = await alert({
                    icon: "question",
                    title:
                        "Se encontraron subrecetas relacionadas con este nombre ¿Deseas continuar?",
                    text: "Subrecetas existentes:\n" + nombres,
                });
                // Si el usuario confirma que desea continuar aparece un mensaje de error
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

//? Agregar subreceta.
function addSubReceta() {
    let foto = $("#photo-receta")[0].files[0];

    let datos = new FormData();
    datos.append("opc", "createSubReceta");
    datos.append("nombre", $("#txtSubReceta").val());
    datos.append("id_Clasificacion", $("#txtcbClasificacionSub").val());
    datos.append("observaciones", $("#textareaNotasSub").val());
    datos.append("id_UDN", $("#txtcbUDN").val());
    datos.append("foto", foto);
    send_ajax(datos, ctrlSubrecetas).then((data) => {
        if (data.idSubReceta !== null && data.idSubReceta !== "null") {
            alert({
                icon: "success",
                title: "Subreceta",
                text: "Subreceta creada correctamente",
            });
            // Borra la foto
            deletePhotoSubReceta(data.idSubReceta);

            // Ocultar botones y deshabilitar campos
            $("#btnCreateSubReceta").addClass("hide");
            $("#txtSubReceta").prop("disabled", true);
            $("#txtcbClasificacionSub").prop("disabled", true);

            // Mostrar formularios y tablas de ingredientes y subrecetas
            $("#fillSubReceta").removeClass("hide");
            $("#btnSaveSubReceta").removeClass("hide");

            // Habilitar el botones de submit
            $("#formAddSubReceta button[type='submit']").removeAttr("disabled");

            // Actualizar el dataCatálogo de subrecetas
            dataCatalogo.subrecetas.unshift({
                id: data.idSubReceta,
                valor: $("#txtSubReceta").val(),
                idclasificacion: $("#txtcbClasificacionSub").val(),
                idudn: $("#txtcbUDN").val(),
            });

            // Filtra los datos de los ingredientes y subrecetas de acuerdo a la clasificación
            let dataIng = updateDataIngredientes();
            let dataSub = updateDataSubRecetas();

            // Crear formulario de procedimiento culinario
            culinaryProcedureSubReceta("create", data.idSubReceta);

            // Crear formulario y tabla de ingredientes y subrecetas
            ingredientsAndSubRecetaSubReceta(data.idSubReceta, dataIng, dataSub);

            // Actualización de la subreceta recién creada
            $("#btnSaveSubReceta").on("click", function () {
                $("#textareaNotasSub").prop("disabled", false);
                alert({
                    icon: "question",
                    title: "¿Está seguro de guardar la subreceta?",
                }).then((result) => {
                    // Si el usuario confirma el guardado, se procede a actualizar la subreceta
                    if (result.isConfirmed) {
                        editSubReceta(data.idSubReceta);
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

//? Editar subreceta.
function editSubReceta(id) {
    let foto = $("#photo-subreceta")[0].files[0];

    let dtx = new FormData();
    dtx.append("opc", "updateSubReceta");
    dtx.append("nombre", $("#txtSubReceta").val());
    dtx.append("id_Clasificacion", $("#txtcbClasificacionSub").val());
    dtx.append("observaciones", $("#textareaNotasSub").val());
    dtx.append("rendimiento", $("#txtRendimientoSub").val());
    dtx.append("id_Unidad", $("#txtUnidadSub").val());
    dtx.append("foto", foto);
    dtx.append("idSubreceta", id);

    // Validar que si la unidad no es seleccionada en procedimiento culinario no pueda actualizar
    if ($("#txtUnidadSub").val() === null || $("#txtUnidadSub").val() === "") {
        alert({
            icon: "error",
            title: "Procedimiento culinario",
            text: "Seleccione una unidad",
            btn1: true,
        });
        $("#formProcedimientoCulinarioSub button[type='submit']").removeAttr(
            "disabled"
        );
        $("#formAddSubReceta button[type='submit']").removeAttr("disabled");
    } else {
        send_ajax(dtx, ctrlSubrecetas).then((data) => {
            if (
                data.idSubReceta !== null &&
                data.idSubReceta !== "null" &&
                data.idSubReceta !== "" &&
                data.idSubReceta !== undefined
            ) {
                alert({
                    icon: "success",
                    title: "Subreceta",
                    text: "Guardado correctamente",
                });

                // Actualizar el dataCatálogo de subrecetas
                dataCatalogo.subrecetas.find((x) => x.id == id).valor = $("#txtSubReceta").val();
                dataCatalogo.subrecetas.find((x) => x.id == id).idclasificacion = $("#txtcbClasificacionSub").val();
                dataCatalogo.subrecetas.find((x) => x.id == id).idudn = $("#txtcbUDN").val();

                // Ocultar div y limpiar contenedores
                $(".secondary-sub").addClass("hide");
                $("#formAddSubReceta")[0].reset();
                $("#containerFormProcCulinarioSub").html("");
                $("#frmAndTbSubRecetasIng").html("");
                $("#frmAndTbSubRecetasSub").html("");

                // Habilitar botones de submit
                $("#formAddSubReceta button[type='submit']").removeAttr("disabled");
                $("#formProcedimientoCulinarioSub button[type='submit']").removeAttr(
                    "disabled"
                );
                $("#formAddSubRecetasIng button[type='submit']").removeAttr("disabled");
                $("#formAddSubRecetasSub button[type='submit']").removeAttr("disabled");

                // Eliminar las clases is-invalid
                $("#formAddSubReceta :input.is-invalid").removeClass("is-invalid");

                // Cargar imagen por defecto
                $("#imgSubReceta").attr(
                    "src",
                    "./src/img/default.png"
                );

                // Mostrar el catálogo de subrecetas
                $("#btnAddSubReceta").removeClass("hide");
                $(".main-sub").removeClass("hide");
                $("#containerCatalogo").removeClass("hide");
                lsSubrecetas();
            } else {
                alert({
                    icon: "error",
                    title: "Subreceta",
                    text: "Error al actualizar la subreceta",
                });
            }
        });
    }
}

// Eliminar subreceta.
function deleteSubReceta(id) {

    let subrecetitasData = {
        opc: "lsSubrecetaSubreceta",
        idSubreceta: id,
    };
    let recetitasData = {
        opc: "lsSubrecetaReceta",
        idSubreceta: id,
    };

    let dataRecetas = '';
    let dataSubrecetas = '';
    let hayrecetas = false;
    let haysubrecetas = false;


    new Promise((resolve, reject) => {
        Promise.all([
            fn_ajax(recetitasData, ctrlSubrecetas),
            fn_ajax(subrecetitasData, ctrlSubrecetas)
        ]).then(([dataRecetasResponse, dataSubrecetasResponse]) => {
            // Procesar dataRecetas
            if (dataRecetasResponse.length > 0) {
                dataRecetas = dataRecetasResponse.map((x) => x.valor).join(", ");
                hayrecetas = true;
            } else {
                dataRecetas = 'No hay recetas que contengan esta subreceta.';
            }

            // Procesar dataSubrecetas
            if (dataSubrecetasResponse.length > 0) {
                dataSubrecetas = dataSubrecetasResponse.map((x) => x.valor).join(", ");
                haysubrecetas = true;
            } else {
                dataSubrecetas = 'No hay subrecetas que contengan esta subreceta.';
            }
            resolve(); // Resuelve la promesa después de que ambas solicitudes hayan terminado
        }).catch(reject); // En caso de error, rechaza la promesa
    }).then(() => {
        if (hayrecetas || haysubrecetas) {
            alert({
                icon: 'error',
                title: `No se puede eliminar la subreceta: ${dataSub.find((x) => x.id == id).valor}`,
                html: `La subreceta está presente en las siguientes...<br> <br><strong>RECETAS:</strong> ${dataRecetas}<br><br><strong>SUBRECETAS:</strong> ${dataSubrecetas}`,
                btn1: true,
                btn1Text: 'Ok'
            });
        } else {
            alert({
                icon: "question",
                title: "¿Está seguro de eliminar " + dataSub.find((x) => x.id == id).valor + "?", 
                text: `Esta acción no se puede deshacer.`,
            }).then((result) => {
                if (result.isConfirmed) {
                    let datos = new FormData();
                    datos.append("opc", "deleteSubReceta");
                    datos.append("idSubreceta", id);
                    send_ajax(datos, ctrlSubrecetas).then((data) => {
                        if (data == true) {
                            alert({
                                icon: "success",
                                title: "Subreceta",
                                text: "Eliminada correctamente",
                            });
                            // Redireccionar a la página principal
                            lsSubrecetas();
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
    });
}

//? Guardar procedimiento culinario.
function addProcedimientoCulinarioSub(id) {
    let dtx = new FormData();
    dtx.append("opc", "procedimientoCulinarioSubReceta");
    dtx.append("rendimiento", $("#txtRendimientoSub").val());
    dtx.append("id_Unidad", $("#txtUnidadSub").val());
    dtx.append("idSubreceta", id);
    if (id === null || id === "null" || id === undefined) {
        alert({
            icon: "error",
            title: "Procedimiento culinario",
            text: "Error al guardar, llame a soporte técnico",
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

//* SUBRECETA - INGREDIENTE ----------------------------------------------
//? Eliminar SUBRECETA - INGREDIENTE.
function deleteSubRecetaIngrediente(
    btn,
    idSubReceta,
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
            datos.append("id_Subreceta", idSubReceta);
            datos.append("id_Ingrediente", idIngrediente);
            send_ajax(datos, ctrlSubrecetas).then((data) => {
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
                    changeCulinaryProcedureSubReceta();
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

//* SUBRECETA - SUBRECETA ------------------------------------------------
//? Eliminar SUBRECETA - SUBRECETA.
function deleteSubRecetaSubReceta(
    btn,
    idSubreceta1,
    idSubreceta2,
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
            datos.append("id_Subreceta1", idSubreceta1);
            datos.append("id_Subreceta2", idSubreceta2);
            send_ajax(datos, ctrlSubrecetas).then((data) => {
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
                    changeCulinaryProcedureSubReceta();
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
function photoSubReceta() {
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
                $("#content_photo_subreceta p").removeClass("hide").addClass("d-flex");
            };
        }, 500);
    }
}

//? Evento para el input cantidad de la tabla SUBRECETA - INGREDIENTE.
function inputEventTbIngSub() {
    $("#tbSubRecetasIng tbody").on("input", "input[type='text']", function () {
        // Inicializar variables
        let cantidadIng = $(this).val(); // Cantidad del ingrediente
        let precioUnidadIng = $(this)
            .closest("tr")
            .find("td")
            .eq(3)
            .text()
            .trim()
            .substring(2)
            .replace(/,/g, ""); // Precio unidad del ingrediente
        let costoIng = 0; // Costo del ingrediente

        // Si la cantidad no es nula o vacía, se calcula el costo
        if (cantidadIng !== "" && cantidadIng !== null) {
            costoIng = parseFloat(precioUnidadIng) * parseFloat(cantidadIng);
        }

        // Dar formato al nuevo costo
        let costoIngFormat = costoIng.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        // Agregar el nuevo costo a la celda correspondiente de la tabla subreceta - ingrediente
        $(this)
            .closest("tr")
            .find("td")
            .eq(4)
            .text("$ " + costoIngFormat);

        // Actualizar el total costo de la tabla subreceta - ingrediente
        $("#lblTotalCostoSubRecetaIng").text(addCostColumn("#tbSubRecetasIng", 4));

        // Actualizar el procedimiento culinario
        changeCulinaryProcedureSubReceta();
    });
}

//? Evento para el input cantidad de la tabla SUBRECETA - SUBRECETA.
function inputEventTbSubSub() {
    // Evento para el input cantidad
    $("#tbSubRecetasSub tbody").on("input", "input[type='text']", function () {
        let cantidadSub = $(this).val();
        let costoSub = 0;
        let precioUnidadSub = $(this)
            .closest("tr")
            .find("td")
            .eq(3)
            .text()
            .trim()
            .substring(2)
            .replace(/,/g, "");

        if (cantidadSub !== "" && cantidadSub !== null) {
            costoSub = parseFloat(precioUnidadSub) * parseFloat(cantidadSub);
        }
        let costoSubFormat = costoSub.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        // Agregar el costo a la tb de subrecetas
        $(this)
            .closest("tr")
            .find("td")
            .eq(4)
            .text("$ " + costoSubFormat);
        // Actualizar el costo total de la subreceta
        $("#lblTotalCostoSubRecetaSub").text(addCostColumn("#tbSubRecetasSub", 4));
        changeCulinaryProcedureSubReceta();
    });
}

//? Eventos del procedimiento culinario.
function changeCulinaryProcedureSubReceta() {
    // Inicializar variables
    // Costo total de ingredientes label
    let costoTotalIngredientes = $("#lblTotalCostoSubRecetaIng").length
        ? parseFloat($("#lblTotalCostoSubRecetaIng").text().replace(/,/g, ""))
        : 0;

    // Costo total de subrecetas label
    let costoTotalSubrecetas = $("#lblTotalCostoSubRecetaSub").length
        ? parseFloat($("#lblTotalCostoSubRecetaSub").text().replace(/,/g, ""))
        : 0;

    // Rendimiento
    let rendimiento =
        $("#txtRendimientoSub").val() !== ""
            ? parseFloat($("#txtRendimientoSub").val().replace(/,/g, ""))
            : 0;

    // Validar labels vacíos
    if (costoTotalIngredientes === 0 && costoTotalSubrecetas === 0) {
        $("#txtTotalIngredientesSub").val("0.00");
    } else {
        // Total de ingredientes y subrecetas
        let totalIngredientes = costoTotalIngredientes + costoTotalSubrecetas;
        let totalIngFormat = totalIngredientes.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        $("#txtTotalIngredientesSub").val(totalIngFormat);

        // Calcular el costo de la subreceta... si el rendimiento es distinto de 0
        if (rendimiento !== 0.0) {
            let costo = totalIngredientes / rendimiento;
            let costoFormat = costo.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            $("#txtCostoSub").val(costoFormat);
        } else {
            $("#txtCostoSub").val("0.00");
        }
    }
}

//? Recetario de la subreceta.
function procedureSubReceta(id) {
    let datos = new FormData();
    datos.append("opc", "printSubReceta");
    datos.append("id", id);
    // Consulta de la subreceta junto con sus ingredientes y subrecetas
    send_ajax(datos, ctrlSubrecetas).then((data) => {
        let modalAddRecetario = bootbox
            .dialog({
                title: `<h3 class="text-center">${data.subreceta1.nombre}</h3>`,
                size: "large",
                closeButton: true,
                message: `
                  <div class="row mb-3">
                      <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                          <h4 class="fw-bold">Ingredientes</h4>
                          <ul>
                          ${data.ingrediente &&
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
                          ${data.subreceta2 &&
                        Array.isArray(data.subreceta2) &&
                        data.subreceta2.length > 0
                        ? data.subreceta2
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
                  <form class="row" id="formRecetarioSub" novalidate>
                      <div class="col-12">
                          <h4 class="fw-bold">Procedimiento</h4>
                          <textarea class="form-control textareasub" rows="16" required="required">
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
                $(".textareasub").val(data.subreceta1.nota.replace(/<br\s*\/?>/g, ""));

                $("#formRecetarioSub").validation_form({}, function (result) {
                    $("#formRecetarioSub button[type='submit']").attr(
                        "disabled",
                        "disabled"
                    );
                    let objRecetario = new FormData();
                    objRecetario.append("opc", "updateSubReceta");
                    objRecetario.append("nota", $(".textareasub").val());
                    objRecetario.append("idSubreceta", id);

                    // Guardar notas, o recetario de la subreceta
                    send_ajax(objRecetario, ctrlSubrecetas).then((data) => {
                        if (
                            data.idSubReceta !== null &&
                            data.idSubReceta !== "null" &&
                            data.idSubReceta !== "" &&
                            data.idSubReceta !== undefined
                        ) {
                            alert({
                                icon: "success",
                                title: "Procedimiento",
                                text: "Guardado correctamente",
                            });
                            $("#formRecetarioSub button[type='submit']").removeAttr(
                                "disabled"
                            );
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

//? Mostrar subreceta.
function showSubReceta(id) {
    $("#btnCloseSubReceta")
        .off()
        .on("click", function () {
            $(".secondary-sub").addClass("hide");
            $("#btnAddSubReceta").removeClass("hide");
            $(".main-sub").removeClass("hide");
            $("#containerCatalogo").removeClass("hide");
            lsSubrecetas();
        });

    // Consultar la subreceta
    let datos = new FormData();
    datos.append("opc", "printSubReceta");
    datos.append("id", id);

    send_ajax(datos, ctrlSubrecetas).then((data) => {
        // Llenar los campos de la subreceta
        $("#txtSubReceta").val(data.subreceta1.nombre);
        $("#txtcbClasificacionSub").val(data.subreceta1.idclasificacion);
        $("#textareaNotasSub").val(data.subreceta1.observaciones);
        $("#imgSubReceta").attr("src", data.subreceta1.foto);

        if (data.subreceta1.foto == null || data.subreceta1.foto == "") {	
            $("#imgSubReceta").attr("src", "./src/img/default.png");
        }

        Promise.all([lsSubRecetaIngredientes(id), lsSubRecetaSubRecetas(id)])
            .then(() => {
                culinaryProcedureSubReceta("edit", id);

                $("#containerCatalogo").addClass("hide");
                $(".main-sub").addClass("hide");
                // Mostrar botones de la subreceta
                $("#btnAddSubReceta").addClass("hide");
                $(".secondary-sub").removeClass("hide");
                $("#fillSubReceta").removeClass("hide");
                $("#btnCloseSubReceta").addClass("mt-4");
                // Desabilitar campos
                $("#txtSubReceta").prop("disabled", true);
                $("#txtcbClasificacionSub").prop("disabled", true);
                // Mostrar botón de guardar
                $("#btnCreateSubReceta").addClass("hide");
                $("#btnSaveSubReceta").addClass("hide");
                $("#textareaNotasSub").prop("disabled", true);

                $("#txtUnidadSub").prop("disabled", true);
                $("#txtRendimientoSub").prop("disabled", true);
                $("#btnAceptar").addClass("hide");
                changeCulinaryProcedureSubReceta();
            })
            .catch((error) => {
                console.error("Error al cargar la tabla: ", error);
            });
    });
}

//? Cargar los ingredientes de la subreceta.
function lsSubRecetaIngredientes(id) {
    return new Promise((resolve, reject) => {
        let datos = {
            opc: "tbSubRecetaShowIngrediente",
            idSubReceta: id,
        };

        fn_ajax(datos, ctrlSubrecetas, $("#frmAndTbSubRecetasIng"))
            .then((data) => {
                $("#frmAndTbSubRecetasIng").rpt_json_table2({
                    data: data,
                    right: [4, 5],
                    id: "tbSubRecetasIng",
                    color_th: "bg-primary",
                    f_size: 16,
                    class: "table table-hover table-bordered",
                });
                simple_data_table("#tbSubRecetasIng", 10);
                $("#tbSubRecetasIng_wrapper > .row > .col-sm-12.col-md-6:first").html(
                    "<strong>Total costo: $" +
                    $("#lblTotalCostoSubRecetaIng").text() +
                    "</strong>"
                );
                $("#lblTotalSubRecetaIng").parent().addClass("hide");
                $("#lblTotalCostoSubRecetaIng").parent().addClass("hide");
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//? Cargar las subrecetas de la subreceta.
function lsSubRecetaSubRecetas(id) {
    return new Promise((resolve, reject) => {
        let datos = {
            opc: "tbSubRecetaSubRecetaShow",
            idSubReceta: id,
        };

        fn_ajax(datos, ctrlSubrecetas, $("#frmAndTbSubRecetasSub"))
            .then((data) => {
                $("#frmAndTbSubRecetasSub").rpt_json_table2({
                    data: data,
                    right: [4, 5],
                    id: "tbSubRecetasSub",
                    color_th: "bg-primary",
                    f_size: 16,
                    class: "table table-hover table-bordered",
                });
                simple_data_table("#tbSubRecetasSub", 10);
                $("#tbSubRecetasSub_wrapper > .row > .col-sm-12.col-md-6:first").html(
                    "<strong>Total costo: $" +
                    $("#lblTotalCostoSubRecetaSub").text() +
                    "</strong>"
                );
                $("#lblTotalSubRecetaSub").parent().addClass("hide");
                $("#lblTotalCostoSubRecetaSub").parent().addClass("hide");
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//? Observaciones de la subreceta.
function observationSubReceta(id) {
    let datos = new FormData();
    datos.append("opc", "printSubReceta");
    datos.append("id", id);

    send_ajax(datos, ctrlSubrecetas).then((data) => {
        bootbox.dialog({
            title: `<h3 class="text-center">${data.subreceta1.nombre}</h3>`,
            size: "large",
            closeButton: true,
            message: `
        <form class="row" id="formObservacionesSub" novalidate>
            <div class="col-12">
                <h4 class="fw-bold">Observaciones</h4>
                <textarea class="form-control textareaobs" rows="6" required="required">
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

        $(".textareaobs").val(data.subreceta1.observaciones);

        $("#formObservacionesSub").validation_form({}, function (result) {
            $("#formObservacionesSub button[type='submit']").attr(
                "disabled",
                "disabled"
            );
            let objObservaciones = new FormData();
            objObservaciones.append("opc", "updateSubReceta");
            objObservaciones.append("observaciones", $(".textareaobs").val());
            objObservaciones.append("idSubreceta", id);

            // Guardar notas, o recetario de la subreceta
            send_ajax(objObservaciones, ctrlSubrecetas).then((data) => {
                if (
                    data.idSubReceta !== null &&
                    data.idSubReceta !== "null" &&
                    data.idSubReceta !== "" &&
                    data.idSubReceta !== undefined
                ) {
                    alert({
                        icon: "success",
                        title: "Observaciones",
                        text: "Guardado correctamente",
                    });
                    $("#formObservacionesSub button[type='submit']").removeAttr(
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

//? Imprimir subreceta.
function printSubReceta(id) {
    sessionStorage.setItem("subreceta", id);
    window.open("printSubReceta.php", "_blank");
}

//? Borrar foto de la subreceta.
function deletePhotoSubReceta(id) {
    $("#content_photo_subreceta p").on("click", function () {
        alert({
            icon: "question",
            title: "¿Está seguro de eliminar la imagen?",
            text: "No se podrá recuperar la imagen una vez eliminada.",
        }).then((result) => {
            if (result.isConfirmed) {
                let ola = {
                    opc: "deletePhotoSubReceta",
                    foto: null,
                    idSubreceta: id,
                };
                fn_ajax(ola, ctrlSubrecetas).then((data) => {
                    if (data) {
                        // Cargar imagen por defecto
                        $("#imgSubReceta").attr(
                            "src",
                            "./src/img/default.png"
                        );
                        $("#photo-subreceta").val("");
                        $("#content_photo_subreceta p").addClass("hide").removeClass("d-flex");
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
