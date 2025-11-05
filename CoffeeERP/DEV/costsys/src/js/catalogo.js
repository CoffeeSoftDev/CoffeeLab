window.ctrlCatalogo = window.ctrlCatalogo || "ctrl/ctrl-catalogo.php";
window.dataCatalogo = window.dataCatalogo || [];
let defaultPermissions = {
    buttons: [
        "btnAddIngrediente",
        "btnAddSubReceta",
        "btnAddReceta",
        "btnSaveSubReceta",
        "btnCreateSubReceta",
        "btnSaveReceta",
        "btnSoftReceta",
        "btnCreateReceta",
    ], // IDs botones eliminados
    tables: {
        tbIngredientes: [8],
        tbSubRecetasIng: [5],
    }, // Columnas eliminadas de la tabla
    a: [
        "dropdownItemEditarReceta",
        "dropdownItemSubClassReceta",
        "dropdownItemSoftReceta",
        // "dropdownItemRecetarioReceta",
        // "dropdownItemDescargarReceta",
        "dropdownItemEditarSubReceta",
        "dropdownItemRecetarioSubReceta",
        "dropdownItemEliminarSubReceta",
    ], // Clases de enlaces eliminados
};

let permissions = {
    // Permisos para CORPORATIVO
    8: {
        // Permisos para DIRECCIÓN OPERATIVA
        36: {
            a: ["dropdownItemVerSubReceta", "dropdownItemVerReceta"], // Clases de enlaces eliminados
        },
        // Permisos para USUARIO X
        // 41: {
        //   3: {
        //     buttons: [], // IDs botones eliminados
        //     tables: {}, // Columnas eliminadas de la tabla
        //     a: [], // Clases de enlaces eliminados
        //   },
        // },
    },
};

$(function () {
    initComponents(ctrlCatalogo)
        .then((data) => {
            dataCatalogo = data;
            $("#txtcbUDN").option_select({ data: dataCatalogo.udn });
            permissionUDN();
        })
        .then(() => {
            updateClassification();
            applyPermissions();
        })
        .then(() => {
            loadCatalog();
            $("#ingredientes-tab").click();
        });
});

function permissionUDN() {
    return new Promise((resolve, reject) => {
        idE = getCookie("IDE");
        if (idE != 8) {
            $("#txtcbUDN").val(idE).change();

            var $optionToKeep = $("#txtcbUDN option[value='" + idE + "']");
            $("#txtcbUDN").empty().append($optionToKeep).change();
        }
        resolve();
    });
}

function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

function applyPermissions() {
    let idEmpresa = getCookie("IDE");
    let idArea = getCookie("IDA");
    let idPuesto = getCookie("IDP");
    let idUsuario = getCookie("IDU");

    let userPermissions = null;

    // Si es CORPORATIVO
    if (idEmpresa != 8) {
        userPermissions = defaultPermissions;
    } else {
        // Si es diferente de ROOT, entonces tiene permisos
        if (idUsuario != 1) {
            // Permisos para usuarios específicos
            //   if (idUsuario == 6) {
            //     userPermissions = permissions[idEmpresa][idArea][idPuesto];
            //   } else {
            if (permissions[idEmpresa][idArea]) {
                userPermissions = permissions[idEmpresa][idArea];
            }
            //   }
        }
    }

    if (userPermissions != null) {
        // Mostrar u ocultar botones
        $("button").each(function () {
            const buttonId = $(this).attr("id");
            if (userPermissions.buttons) {
                if (userPermissions.buttons.includes(buttonId)) {
                    $(this).remove();
                } else {
                    $(this).show();
                }
            }
        });

        // Mostrar u ocultar enlaces
        $("a").each(function () {
            let aClass = $(this).attr("class");
            if (aClass && userPermissions.a) {
                const aClassArray = aClass.split(" ");
                if (aClassArray.some((cls) => userPermissions.a.includes(cls))) {
                    $(this).remove();
                } else {
                    $(this).show();
                }
            }
        });

        // Eliminar columnas especificadas en las tablas
        for (let tableId in userPermissions.tables) {
            const columnsToRemove = userPermissions.tables[tableId];

            // Eliminar las columnas especificadas del tbody
            $(`#${tableId} tbody tr`).each(function () {
                columnsToRemove.forEach((columnIndex) => {
                    let cell = $(this).find(`td:nth-child(${columnIndex + 1})`);
                    cell.remove();
                });
            });

            // Eliminar las columnas especificadas del thead
            columnsToRemove.forEach((columnIndex) => {
                let headerCell = $(
                    `#${tableId} thead tr th:nth-child(${columnIndex + 1})`
                );
                headerCell.remove();
            });
        }
    }
}

function loadCatalog() {
    // Cargar el cuerpo de cada pestaña
    $("#ingredientes-tab").on("click", function () {
        if ($(".main-sub").hasClass("hide")) {
            alert({
                icon: "question",
                title: "¿Desea abandonar la página?",
                text: "Si abandona la página, perderá los datos NO guardados",
            }).then((result) => {
                if (result.isConfirmed) {
                    $(".secondary-sub").addClass("hide");
                    $(".main-sub").removeClass("hide");

                    $(".nav-item").removeClass("active");
                    $(this).parent().addClass("active");
                    $(".nav-link").removeClass("active");
                    $(this).addClass("active");
                    $("#subrecetas").removeClass("active");
                    $("#ingredientes").addClass("active");
                    bodyIngrediente();
                }
            });
        } else if ($(".main-rec").hasClass("hide")) {
            alert({
                icon: "question",
                title: "¿Desea abandonar la página?",
                text: "Si abandona la página, perderá los datos NO guardados",
            }).then((result) => {
                if (result.isConfirmed) {
                    $(".secondary-rec").addClass("hide");
                    $(".main-rec").removeClass("hide");

                    $(".nav-item").removeClass("active");
                    $(this).parent().addClass("active");
                    $(".nav-link").removeClass("active");
                    $(this).addClass("active");
                    $("#recetas").removeClass("active");
                    $("#ingredientes").addClass("active");
                    bodyIngrediente();
                }
            });
        } else {
            $(".nav-item").removeClass("active");
            $(this).parent().addClass("active");
            $(".nav-link").removeClass("active");
            $(this).addClass("active");
            $("#recetas").removeClass("active");
            $("#subrecetas").removeClass("active");
            $("#ingredientes").addClass("active");
            bodyIngrediente();
        }
    });

    $("#subrecetas-tab").on("click", function () {
        if ($(".main-rec").hasClass("hide")) {
            alert({
                icon: "question",
                title: "¿Desea abandonar la página?",
                text: "Si abandona la página, perderá los datos NO guardados",
            }).then((result) => {
                if (result.isConfirmed) {
                    $(".secondary-rec").addClass("hide");
                    $(".main-rec").removeClass("hide");

                    $(".nav-item").removeClass("active");
                    $(this).parent().addClass("active");
                    $(".nav-link").removeClass("active");
                    $(this).addClass("active");
                    $("#ingredientes").removeClass("active");
                    $("#recetas").removeClass("active");
                    $("#subrecetas").addClass("active");
                    bodySubreceta();
                }
            });
        } else {
            $(".nav-item").removeClass("active");
            $(this).parent().addClass("active");
            $(".nav-link").removeClass("active");
            $(this).addClass("active");
            $("#ingredientes").removeClass("active");
            $("#recetas").removeClass("active");
            $("#subrecetas").addClass("active");
            bodySubreceta();
        }
    });

    $("#recetas-tab").on("click", function () {
        if ($(".main-sub").hasClass("hide")) {
            alert({
                icon: "question",
                title: "¿Desea abandonar la página?",
                text: "Si abandona la página, perderá los datos NO guardados",
            }).then((result) => {
                if (result.isConfirmed) {
                    $(".secondary-sub").addClass("hide");
                    $(".main-sub").removeClass("hide");

                    $(".nav-item").removeClass("active");
                    $(this).parent().addClass("active");
                    $(".nav-link").removeClass("active");
                    $(this).addClass("active");
                    $("#subrecetas").removeClass("active");
                    $("#ingredientes").removeClass("active");
                    $("#recetas").addClass("active");
                    bodyReceta();
                }
            });
        } else {
            $(".nav-item").removeClass("active");
            $(this).parent().addClass("active");
            $(".nav-link").removeClass("active");
            $(this).addClass("active");
            $("#subrecetas").removeClass("active");
            $("#ingredientes").removeClass("active");
            $("#recetas").addClass("active");
            bodyReceta();
        }
    });

    // Cambio de select udn
    $("#txtcbUDN").on("change", function () {
        updateClassification();
        if ($("#subrecetas-tab").hasClass("active")) {
            lsSubrecetas();
            $("#containerTitleSubRecetas").html(
                "Lista de subrecetas / " +
                `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
                    .text()
                    .toLowerCase()}</span>`
            );
        } else if ($("#recetas-tab").hasClass("active")) {
            lsRecetas();
            $("#containerTitleRecetas").html(
                "Lista de recetas / " +
                `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
                    .text()
                    .toLowerCase()}</span>`
            );
        } else if ($("#ingredientes-tab").hasClass("active")) {
            lsIngredientes();
            $("#containerTitleIngredientes").html(
                "Lista de ingredientes / " +
                `<span class="fw-bold text-danger">${$("#txtcbUDN option:selected")
                    .text()
                    .toLowerCase()}</span>`
            );
        }
    });
    // Cambio de select clasificación
    $("#txtcbClasificacion").on("change", function () {
        if ($("#subrecetas-tab").hasClass("active")) {
            lsSubrecetas();
        } else if ($("#recetas-tab").hasClass("active")) {
            lsRecetas();
        }
    });
}

function updateClassification() {
    // Actualizar clasificaciones de acuerdo a la UDN
    let clasificaciones = dataCatalogo.clasificacion.filter(
        (item) => item.udn === $("#txtcbUDN").val()
    );

    $("#txtcbClasificacion").option_select({ data: clasificaciones });
    $("#txtcbClasificacionSub").option_select({ data: clasificaciones });
    $("#txtcbClasificacionRec").option_select({ data: clasificaciones });
}

function updateSubclassifications(select) {
    let subclasificaciones = dataCatalogo.subclasificacion.filter(
        (item) => item.idclasificacion == select
    );
    return subclasificaciones;
}

function updateDataIngredientes() {
    let dataIngredientes = dataCatalogo.ingredientes.filter((item) => item.idudn == $("#txtcbUDN").val()).map((item) => ({ id: parseInt(item.id), valor: item.valor }));

    return dataIngredientes;
}

function updateDataSubRecetas() {
    let dataSubreceta = dataCatalogo.subrecetas.filter((item) => item.idudn == $("#txtcbUDN").val()).map((item) => ({ id: parseInt(item.id), valor: item.valor }));

    return dataSubreceta;
}

// FUNCIONES UNIVERSALES
function unitPrice(precio, contNeto) {
    if ($(precio).val() != "" && $(contNeto).val() != "") {
        let price = parseFloat($(precio).val());
        let netContent = parseFloat($(contNeto).val());
        let precioUnidad = netContent == 0 ? 0 : price / netContent;
        return precioUnidad.toFixed(2);
    }
    return 0.0;
}

function closeForm(form, tb, btn) {
    $(form).parent().addClass("hide");
    $(tb).removeClass("col-md-8");
    $(tb).addClass("col-md-12");
    $(btn).removeClass("hide");
    $(form)[0].reset();
    $(form + " select")
        .val("")
        .trigger("change");
}

function openForm(form, tb, btn) {
    $(tb).removeClass("col-md-12");
    $(tb).addClass("col-md-8");
    $(form).parent().removeClass("hide");
    $(btn).addClass("hide");
}

function addCostColumn(tb, col) {
    let total = 0;
    let totalFormat = 0;
    $(tb + " tbody tr").each(function () {
        let numeros = $(this)
            .find("td")
            .eq(col)
            .text()
            .trim()
            .substring(2)
            .replace(/,/g, "");
        // Reemplaza NaN o valores vacíos con 0 antes de sumar
        numeros =
            isNaN(parseFloat(numeros)) || numeros === "-" ? 0 : parseFloat(numeros);
        total += numeros;

        totalFormat = total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    });

    return totalFormat;
}

function modalEditIngrediente(idIng, event, param, id) {
    let modalEditIngrediente = bootbox.dialog({
        title: ` ACTUALIZAR INGREDIENTE `,
        message: `
                <form class="row row-cols-1 row-cols-sm-3 row-cols-md-3" id="formEditIngrediente" novalidate>
                    <div class="col-sm-12 col-md-12 mb-3">
                        <label for="iptNombreIng" class="form-label fw-bold"> Nombre</label>
                        <input type="text" class="form-control form-control-sm col-12" id="iptNombreIng" value="${dataCatalogo.ingredientes.find((x) => x.id == idIng)
                .valor
            }" tipo="alfanumerico" disabled>
                    </div>
                    <div class="col mb-3">
                        <label for="iptContenidoNetoIng" class="form-label fw-bold"> Contenido neto</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">
                                <i class="icon-hash"></i>
                            </span>
                            <input type="text" class="form-control text-end" id="iptContenidoNetoIng" placeholder="0" value="${dataCatalogo.ingredientes.find(
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
                            <input type="text" class="form-control text-end" id="iptPrecioIng" placeholder="0" value="${dataCatalogo.ingredientes.find(
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
                            <input type="text" class="form-control text-end" id="iptPrecioUnidadIng" placeholder="0" value="${dataCatalogo.ingredientes.find(
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
                unitPrice("#iptPrecioIng", "#iptContenidoNetoIng")
            );
        });

        $("#iptPrecioIng").on("input", function () {
            $("#iptPrecioUnidadIng").val(
                unitPrice("#iptPrecioIng", "#iptContenidoNetoIng")
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
                    $(tr)
                        .find("td")
                        .eq(3)
                        .text("$ " + $("#iptPrecioUnidadIng").val());
                    $(tr)
                        .find("td")
                        .eq(4)
                        .text("$ " + (input * precioUnidad).toFixed(2));
                    // Cambiar la data del total
                    let tb = "#" + tr.closest("table").attr("id");

                    if (param == "receta") {
                        $("#lblTotalCostoRecetaIng").text(addCostColumn(tb, 4));
                        lsRecetasSubRecetas();
                        changeCulinaryProcedureReceta();
                    } else {
                        $("#lblTotalCostoSubRecetaIng").text(addCostColumn(tb, 4));
                        lsSubRecetasSubRecetas();
                        changeCulinaryProcedureSubReceta();
                    }
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

let rec = {};
let sub = {};

function lsRecetasSubRecetas() {
    rec = new Complements(ctrlRecetas, "");

    // Settear ids por defecto
    rec.id_table = "tbRecetasSub";
    rec.id_content_table = "contentTableRecetasSub";

    // Definir atributos de la tabla
    rec.attr_table = {
        color_th: "bg-primary",
        ipt: [3],
        right: [4, 5],
        f_size: "14",
    };

    // settear opciones
    rec._opts_table = {
        data_events: data_event_rec_sub,
        datatable: false,
        extends_fn: function () {
            changeCulinaryProcedureReceta();
        },
    };

    rec.data_table = data_table_rec_sub;

    rec.lsTable({ datatable: false });
}

function lsSubRecetasSubRecetas() {
    sub = new Complements(ctrlSubrecetas, "");

    // Settear ids por defecto
    sub.id_table = "tbSubRecetasSub";
    sub.id_content_table = "contentTableSubRecetasSub";

    // Definir atributos de la tabla
    sub.attr_table = {
        color_th: "bg-primary",
        ipt: [3],
        right: [4, 5],
        f_size: "14",
    };

    // settear opciones
    sub._opts_table = {
        data_events: data_event_sub_sub,
        datatable: false,
        extends_fn: function () {
            changeCulinaryProcedureSubReceta();
        },
    };

    sub.data_table = data_table_sub_sub;

    sub.lsTable({ datatable: false });
}
