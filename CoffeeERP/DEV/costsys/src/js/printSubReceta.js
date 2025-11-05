$(() => buscarSubReceta());

function buscarSubReceta() {
    let datos = new FormData();
    datos.append("opc", "printSubReceta");
    datos.append("id", sessionStorage.getItem("subreceta"));
    send_ajax(datos, "ctrl/ctrl-subrecetas.php").then((data) => {
        // Llenar los datos de la receta
        let title = data.subreceta1.nombre;
        let foto = "https://www.erp-varoch.com/erp_files/costsys/default.png";
        let rendimiento =
            data.subreceta1.rendimiento != null ? data.subreceta1.rendimiento : "";
        let unidad = data.subreceta1.unidad != null ? data.subreceta1.unidad : "";
        let clasificacion =
            data.subreceta1.clasificacion != null
                ? " / " + data.subreceta1.clasificacion
                : "";
        let udn = data.subreceta1.udn != null ? data.subreceta1.udn : "";
        let nota =
            data.subreceta1.nota != null
                ?  data.subreceta1.nota.replace(/\s{2,}/g, '\n').replace(/\n/g, "<br>")
                : "";
               
        $("title").html(title);
        $("#nombre-subreceta").html(
            title + " (" + rendimiento + " " + unidad + ")" 
        );
        $("#categoria-subreceta").html(udn + clasificacion);
        $("#procedimiento-subreceta p").html(nota);
        $("#fotoSubReceta").attr("src", foto);

        // Llenar los ingredientes en el tbody de la tabla $("#tbIngredientes")
        let listIng = "";
        let listSub = "";

        listIng = `
      ${data.ingrediente &&
                Array.isArray(data.ingrediente) &&
                data.ingrediente.length > 0
                ? data.ingrediente
                    .map(
                        (ingrediente) => `
              <li><span class = "text-primary">${ingrediente.cantidad} ${ingrediente.unidad}</span> ${ingrediente.nombre}.</li>
          `
                    )
                    .join("")
                : "<li>No hay ingredientes disponibles.</li>"
            }
            `;

        listSub = `
            ${data.subreceta2 &&
                Array.isArray(data.subreceta2) &&
                data.subreceta2.length > 0
                ? data.subreceta2
                    .map(
                        (subreceta2) => `
                      <li><span class = "text-primary">${subreceta2.cantidad} ${subreceta2.unidad}</span> ${subreceta2.nombre}.</li>
                  `
                    )
                    .join("")
                : "<li>No hay subrecetas disponibles.</li>"
            }
            `;

        $("#lista-ingredientes").append(listIng);
        $("#lista-subrecetas").append(listSub);

        // Llenar las subrecetas en el tbody de la tabla $("#tbSubrecetas")
        tbody = "";
        data.subreceta2.forEach((subreceta2) => {
            tbody += `
                <tr>
                    <td>${subreceta2.nombre}</td>
                    <td class = "text-center">${subreceta2.unidad}</td>
                    <td class = "text-end">${subreceta2.cantidad}</td>
                    <td class = "text-end">${subreceta2.precioUnidad}</td>
                    <td class = "text-end">${subreceta2.costo}</td>
                </tr>
            `;
        });
        $("#tbSubrecetas").append(`<tbody>${tbody}</tbody>`);

        setTimeout(() => {
            imprimirSubReceta();
        }, 100);
    });
}

function imprimirSubReceta() {
    window.print();
    sessionStorage.removeItem("subreceta");
    window.close();
}
