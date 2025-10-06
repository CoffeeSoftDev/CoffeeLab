window.ctrlDesplazamientos =
    window.ctrlDesplazamientos ||
    "softrestaurant/ctrl/ctrl-desplazamientos.php";
window.modal = window.modal || "";

$(function () {
    listUDN();

    $("#cbUDN").on("change", () => {
        showDataSoft();
        listGroups();
    });

    $("#costys-or-soft").on("change", () => {
        // showDataSoft();
        listGroups();
    });

    // CERRAR FORMULARIO SOFT/COSTSYS
    $("#btnCerrarForm").on("click", () => {
        $("#gpDatos").removeClass("col-lg-8");
        $("#gpDatos").addClass("col-lg-12");
        $("#cardForm").addClass("hide");
    });
});
function showForm(clave, nombre) {
    $("#formTitle").html(`[${clave}] ${nombre}`);
    $("#gpDatos").removeClass("col-lg-12");
    $("#gpDatos").addClass("col-lg-8");
    $("#cardForm").removeClass("hide");
}

function togglePQT(clave) {
    $(".pqt" + clave).toggleClass("hide");
}

function listUDN() {
    let datos = new FormData();
    datos.append("opc", "udn");
    send_ajax(datos, ctrlDesplazamientos).then((data) => {
        let option = "";
        data.forEach((p) => {
            option += `<option value="${p.id}">${p.valor}</option>`;
        });
        $("#cbUDN").html(option);
        // showDataSoft();
        listGroups();
    });
}

function listGroups() {
    let datos = new FormData();
    datos.append("opc", "listGroups");
    datos.append("udn", $("#cbUDN").val());
    send_ajax(datos, ctrlDesplazamientos).then((data) => {
        let content = "";
        if (data.length > 0) {
            data.forEach((gp) => {
                content += `
                <div class="m-0">
                    <p sql="0" id="gp${gp.id}" class="fw-bold bg-alice text-center p-1 m-0 pointer" onClick="listProducts(${gp.id},'${gp.nombre}')"> ${gp.nombre} <i class="icon-down-dir"></i></p>
                </div>
                `;
            });
        } else {
            content =
                '<h4 class="text-center text-primary"><i class="text-danger icon-attention"></i> No se encontraron resultados en esta UDN</h4>';
        }

        $("#gpDatos").html(content);
    });
}

function listProducts(id, nombre) {
    const GROUP = $("#gp" + id);
    const SQL = GROUP.attr("sql");

    if (SQL == 0) {
        let datos = new FormData();
        datos.append("opc", "listProduct");
        datos.append("group", id);
        datos.append("nombre", nombre);
        send_ajax(datos, ctrlDesplazamientos).then((data) => {
            console.log(data);
            let tbody = "";
            data.forEach((p) => {
                const ESTADO = p.estado;
                const NEWCLAVE = p.clave.replace("'", "");
                let estado =
                    "<span class='fw-bold text-danger'>INACTIVO</span>";
                if (ESTADO == 1)
                    estado = "<span class='fw-bold text-success'>ACTIVO</span>";

                tbody += `
                <tr>
                    <td>${p.clave}</td>
                    <td class="pointer" onClick="togglePQT('${NEWCLAVE}')">${p.nombre} <i class="icon-down-dir"></i></td>
                    <td></td>
                    <td>${estado}</td>
                    <td class="text-center">
                        <button type="button" title="Editar" class="btn btn-sm btn-outline-primary" onClick="showForm('${NEWCLAVE}','${p.nombre}');"><i class="icon-pencil"></i></button>
                        <button type="button" title="Editar" class="btn btn-sm btn-outline-success" onClick="showModal('${NEWCLAVE}','${p.nombre}');"><i class="icon-pencil"></i></button>
                    </td>
                </tr>
                `;

                if (p.paquetes.length > 0) {
                    p.paquetes.forEach((pqt) => {
                        tbody += `
                        <tr class="pqt${NEWCLAVE} hide">
                            <td>${pqt.id}</td>
                            <td>${pqt.nombre} ($ ${pqt.precio})</td>
                            <td></td>
                            <td></td>
                            <td class="text-center"></td>
                        </tr>
                        `;
                    });
                }
            });

            GROUP.after(`
            <table class="table table-sm table-hover no-wrap m-0 tbGroups" style="width:100%;" check="1" id="tb${id}">
                    <thead>
                        <tr>
                            <th>Clave</th>
                            <th>Producto</th>
                            <th>Receta</th>
                            <th>Estado</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${tbody}
                    </tbody>
            </table>
            `);

            prioridad = [
                {
                    responsivePriority: 1,
                    targets: 0,
                },
                {
                    responsivePriority: 2,
                    targets: 1,
                },
            ];
            dataTable_responsive2("#tb" + id, prioridad);

            GROUP.attr("sql", "1");
        });
    } else {
        $('#gpDatos table:not([id="tb' + id + '"])').addClass("hide");
        let table = $("#tb" + id);
        let open = table.attr("check");

        if (open == 1) {
            table.addClass("hide");
            table.attr("check", "0");
        } else {
            table.attr("check", "1");
            table.removeClass("hide");
        }
    }
}

function showModal(clave, nombre) {
    modal = bootbox.dialog({
        title: `[${clave}] ${nombre}`,
        message: `
                <div class="m-2">
                    <h5 class="text-center">Soft</h5>
                    <hr>
                    <div class="row mb-3">
                        <div class="col-12 col-md-3">
                            <label class="fw-bold">Grupo<span class="text-danger">&nbsp;*</span></label>
                        </div>
                        <div class="col-12 col-md-9">
                            <select class="form-select" name="" id="">

                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-md-3">
                            <label class="fw-bold">Clave<span class="text-danger">&nbsp;*</span></label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input class="form-control" type="text" placeholder="CLAVE" id="gv-clave">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-md-3">
                            <label class="fw-bold">Nombre<span class="text-danger">&nbsp;*</span></label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input class="form-control" type="text" placeholder="NOMBRE" id="gv-nombre-soft">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-md-3">
                            <label class="fw-bold">Precio<span class="text-danger">&nbsp;*</span></label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input class="form-control" type="text" placeholder="$" id="gv-ultimo-costo">
                        </div>
                    </div>
                    <h5 class="text-center">Costys</h5>
                    <hr>
                    <div class="row mb-3">
                        <div class="col-12 col-md-3">
                            <label class="fw-bold">Grupo<span class="text-danger">&nbsp;*</span></label>
                        </div>
                        <div class="col-12 col-md-9">
                            <select class="form-select" name="" id="">
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-md-3">
                            <label class="fw-bold">Nombre<span class="text-danger">&nbsp;*</span></label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input class="form-control" type="text" placeholder="NOMBRE" id="gv-nombre-soft">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-md-3">
                            <label class="fw-bold">Precio<span class="text-danger">&nbsp;*</span></label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input class="form-control" type="text" placeholder="$" id="gv-ultimo-costo">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <button type="button" class="col-12 col-sm-5 btn btn-primary">Continuar</button>
                        <button type="button" class="col-12 col-sm-5 offset-sm-2 btn btn-outline-danger bootbox-close-button">Cancelar</button>
                    </div>
                </div>
            `,
    });
}

function showDataSoft() {
    let datos = new FormData();
    datos.append("opc", "homologados");
    datos.append("udn", $("#cbUDN").val());
    send_ajax(datos, ctrlDesplazamientos, "#table-gv-soft").then((data) => {
        table_gv = simple_json_table(data);
        $("#table-gv-soft").html(table_gv);
    });
}

function simple_json_table(data) {
    thead = "";
    tbody = "";
    // Imprime las columnas de la tabla
    data.thead.forEach((k) => {
        thead += `<th class="text-center">${k}</th>`;
    });

    // Imprime la informacion contenida en rows
    if (data.grupos.length == 0) {
        tbody = `<tr class="bg-default-dark">
                    <th class="text-center" colspan="5">No hay datos para mostrar</th>
                </tr>`;
    } else {
        for (const x of data.grupos) {
            const v = Object.values(x);
            tbody += `
            <tr onclick = "showGroup(${v[0]})" class="pointer bg-default-dark">
                <th class="text-center" colspan="5">
                    <i class="bi bi-caret-right-fill group-icon" data-group="${v[0]}"></i>${v[1]}
                </th>
            </tr>`;

            for (const y of x.productos) {
                tbody += `
                <tr class="cat ${v[0]}">
                    <td>${y.id}</td>
                    <td class="text-right">${y.nombre}</td>
                    <td class="text-left">${y.homologados}</td>
                    <td class="text-center">${y.stado}</td>  
                    <td>${y.btn}</td>
                </tr> 
                    `;
            }
        }
    }

    // Imprime los resultados en una tabla
    table = `
            <table style="margin-top:15px; font-size:.8em; font-weight:500;"
             class="table table-bordered" width="100%" id="table-gv-soft">
            <thead>
            <tr>
                 ${thead}
            </tr>
            </thead>
           
            <tbody>
               ${tbody}
            </tbody>
            </table>
        `;

    return table;
}
