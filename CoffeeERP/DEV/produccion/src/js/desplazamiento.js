window.ctrlDesplazamientos = window.ctrlDesplazamientos ||  "softrestaurant/ctrl/ctrl-desplazamientos.php";

$(function () {
    listUDN();

    $("#cbUDN").on("change", () => {
        // showDataSoft();
        listGroups();
    });
    $("#costys-or-soft").on("change", () => {
        // showDataSoft();
        listGroups();
    });
});

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
        console.log(data);
        let content = "";
        if(data.length > 0){
            data.forEach((gp) => {
                content += `
                <div class="m-0">
                    <p sql="0" id="gp${gp.id}" class="fw-bold bg-alice text-center p-1 m-0 pointer" onClick="listProducts(${gp.id},'${gp.nombre}')"> ${gp.nombre} <i class="icon-down-dir"></i></p>
                </div>
                `;
            });
        } else {
            content = '<h4 class="text-center text-primary"><i class="text-danger icon-attention"></i> No se encontraron resultados en esta UDN</h4>';
        }

        $("#gpDatos").html(content);
    });
}

function listProducts(id,nombre) {
    const GROUP = $("#gp" + id);
    const SQL = GROUP.attr("sql");

    if (SQL == 0) {
        let datos = new FormData();
        datos.append('opc','listProduct');
        datos.append('group',id);
        datos.append('nombre',nombre);
        send_ajax(datos,ctrlDesplazamientos).then((data)=>{
            
            let tbody = '';
            data.forEach(p => {
                const ESTADO = p.estado;
                let estado = 'INACTIVO';
                if ( ESTADO == 1) estado = 'ACTIVO';

                tbody += `
                <tr>
                    <td>${p.clave}</td>
                    <td>${p.nombre}</td>
                    <td>Cell 3</td>
                    <td>${estado}</td>
                    <td class="text-center">
                        <button type="button" title="Editar" class="btn btn-sm btn-outline-primary"><i class="icon-pencil"></i></button>
                    </td>
                </tr>
                `;
            });

            GROUP.after(`
            <table class="table m-0 tbGroups" check="1" id="tb${id}">
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
            GROUP.attr("sql","1");
        });
    } else {
        $('#gpDatos table:not([id="tb'+id+'"])').addClass('hide');
        let table = $('#tb'+id);
        let open = table.attr('check');

        if ( open == 1 ) {
            table.addClass('hide');
            table.attr('check','0');
        } else{
            table.attr('check','1');
            table.removeClass('hide');
        }
    }
}

function showDataSoft() {
    datos = "opc=homologados&udn=" + $("#cbUDN").val();
    tb_ajax_str(datos, ctrlDesplazamientos, "#table-gv-soft").then((data) => {
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