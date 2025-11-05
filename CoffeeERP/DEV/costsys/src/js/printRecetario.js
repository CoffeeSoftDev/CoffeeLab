$(() => buscarReceta());

function buscarReceta() {
  let datos = new FormData();
  datos.append("opc", "printReceta");
  datos.append("id", sessionStorage.getItem("receta"));
  send_ajax(datos, "ctrl/ctrl-recetas.php").then((data) => {
    // Llenar los datos de la receta
    let foto = data.receta.foto;

    if (foto && foto !== "" && foto !== "undefined" && foto !== "erp_files/default.png") {
    let ruta = foto.startsWith("erp_files/")
        ? "https://www.erp-varoch.com/" + foto
        : "https://www.erp-varoch.com/ERP/" + foto;

    $("#fotoReceta").attr("src", ruta);
    } else {
    $("#fotoReceta").attr("src", "./src/img/default.png");
    }

    $("title").html(data.receta.nombre);
    $("#nombre-receta").html(data.receta.nombre);
    let subclase =
      data.receta.subclase != null ? " / " + data.receta.subclase : "";

    $("#categoria-receta").html(
      data.receta.udn + " / " + data.receta.clase + subclase
    );
    $("#procedimiento").html(data.receta.nota);
    
    // Llenar los ingredientes en el tbody de la tabla $("#tbIngredientes")
    let listIng = "";
    let listSub = "";

    listIng = `
      ${
        data.ingrediente &&
        Array.isArray(data.ingrediente) &&
        data.ingrediente.length > 0
          ? data.ingrediente
              .map(
                (ingrediente) => `
              <li><span class="text-primary">${ingrediente.cantidad} ${ingrediente.unidad}</span> ${ingrediente.nombre}.</li>
          `
              )
              .join("")
          : "<li>No hay ingredientes disponibles.</li>"
      }
            `;

            listSub = `
            ${
                data.subreceta &&
                Array.isArray(data.subreceta) &&
                data.subreceta.length > 0
                  ? data.subreceta
                      .map(
                        (subreceta) => `
                      <li><span class="text-primary">${subreceta.cantidad} ${subreceta.unidad}</span> ${subreceta.nombre}.</li>
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
    data.subreceta.forEach((subreceta) => {
      tbody += `
                <tr>
                    <td>${subreceta.nombre}</td>
                    <td class="text-center">${subreceta.unidad}</td>
                    <td class="text-end">${subreceta.cantidad}</td>
                    <td class="text-end">${subreceta.precioUnidad}</td>
                    <td class="text-end">${subreceta.costo}</td>
                </tr>
            `;
    });
    $("#tbSubrecetas").append(`<tbody>${tbody}</tbody>`);

    setTimeout(() => {
      imprimirReceta();
    }, 100);
  });
}

function imprimirReceta() {
  window.print();
  sessionStorage.removeItem("receta");
  window.close();
}
