$(() => buscarReceta());

function buscarReceta() {
  let datos = new FormData();
  datos.append("opc", "printReceta");
  datos.append("id", sessionStorage.getItem("receta"));
  send_ajax(datos, "ctrl/ctrl-recetas.php").then((data) => {

    // Llenar los datos de la receta
    let foto = data.receta.foto;
    if (foto != null && foto != "" && foto != undefined && foto != "erp_files/default.png") {
        // Hacer un explote por el nombre de la foto
        let fotoSplit = foto.split("/");
        if (fotoSplit[0] == "erp_files") {
            // Cargar la foto de la receta
            $("#fotoReceta").attr("src", "https://www.erp-varoch.com/" + foto);
        } else {
            // Cargar la foto de la receta
            $("#fotoReceta").attr("src", "https://www.erp-varoch.com/ERP/" + foto);
        }
    } else {
        // Cargar imagen por defecto
        $("#fotoReceta").attr(
            "src",
            "./src/img/default.png"
        );
    }

    $("title").html(data.receta.nombre);
    $("#title").html(data.receta.nombre);
    let subclase = (data.receta.subclase != null) ? " / " + data.receta.subclase : "";

    $("#subtitle").html(
      data.receta.udn + " / " + data.receta.clase + subclase
    );
    $("#iptTotal").val(data.receta.total);
    $("#iptRendimiento").val(data.receta.rendimiento);
    $("#iptCosto").val(data.receta.costo);
    $("#iptPVenta").val(data.receta.precioVenta);
    $("#iptImpuestos").val(data.receta.impuestos);
    $("#iptPVentaSI").val(data.receta.precioVentaSinImpuestos);
    $("#iptMC").val(data.receta.mc);
    $("#iptPCosto").val(data.receta.porcentaje);
    $("#notaReceta").html(data.receta.nota.replace(/<br\s*\/?>/g, " "));

    // Llenar los ingredientes en el tbody de la tabla $("#tbIngredientes")
    let tbody = "";
    data.ingrediente.forEach((ingrediente) => {
      tbody += `
                <tr>
                <td>${ingrediente.nombre}</td>
                <td class="text-center">${ingrediente.unidad}</td>
                <td class="text-end">${ingrediente.cantidad}</td>
                <td class="text-end">${ingrediente.precioUnidad}</td>
                <td class="text-end">${ingrediente.costo}</td>
                </tr>
            `;
    });
    $("#tbIngredientes").append(`<tbody>${tbody}</tbody>`);

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
