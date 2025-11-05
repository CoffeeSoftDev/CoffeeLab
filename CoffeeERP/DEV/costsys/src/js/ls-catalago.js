window.dataRec = window.dataRec || [];
window.dataSub = window.dataSub || [];

function lsIngredientes() {
  return new Promise((resolve, reject) => {
    let datos = _get_data_opc(["cbUDN"], "tbIngredientes");

    fn_ajax(datos, "ctrl/ctrl-ingredientes.php", $("#containerTbIngrediente"))
      .then((data) => {
        $("#containerTbIngrediente").rpt_json_table2({
          data: data,
          center: [3, 5, 6, 7],
          right: [2, 4],
          id: "tbIngredientes",
          color_th: "",
          f_size: 12,
          class: "table table-sm table-hover table-bordered",
        });
        data_table_export("#tbIngredientes", 7);
        const table = $("#tbIngredientes").DataTable();
        getPageDataTable("#tbIngredientes");

        // Evento para dibujar dropdowns
        table.on("draw", function () {
            applyPermissions();
        });

        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  }).then(() => {
    applyPermissions();
  });
}

function lsSubrecetas() {
  return new Promise((resolve, reject) => {
    let datos = _get_data_opc(["cbUDN", "cbClasificacion"], "tbSubReceta");

    fn_ajax(datos, "ctrl/ctrl-subrecetas.php", $("#containerTbSubReceta"))
      .then((data) => {
        dataSub = data.lsSubRecetas;
        $("#containerTbSubReceta").rpt_json_table2({
          data: data,
          right: [3, 5],
          center: [1, 4, 6, 7],
          id: "tbSubRecetas",
          color_th: "",
          f_size: 12,
          class: "table table-sm table-hover table-bordered",
        });

        // Crear DataTable
        simple_data_table("#tbSubRecetas", 7);
        const table = $("#tbSubRecetas").DataTable();
        getPageDataTable("#tbSubRecetas");

        // Inicializar dropdowns
        dataSub.forEach((data) => {
          dropdownSubreceta(data.id);
        });

        // Evento para dibujar dropdowns
        table.on("draw", function () {
          dataSub.forEach((data) => {
            dropdownSubreceta(data.id);
            applyPermissions();
          });
        });

        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  }).then(() => {
    applyPermissions();
  });
}

function lsRecetas() {
  return new Promise((resolve, reject) => {
    let datos = _get_data_opc(["cbUDN", "cbClasificacion"], "tbRecetas");

    fn_ajax(datos, "ctrl/ctrl-recetas.php", $("#containerTbReceta"))
      .then((data) => {
        dataRec = data.lsRecetas;
        $("#containerTbReceta").rpt_json_table2({
          data: data,
          center: [1, 4, 8],
          right: [5, 6, 7],
          id: "tbRecetas",
          color_th: "",
          f_size: 12,
          class: "table table-sm table-hover table-bordered",
          extends: true,
        });

        // Crear DataTable
        simple_data_table("#tbRecetas", 7);
        const table = $("#tbRecetas").DataTable();
        getPageDataTable("#tbRecetas");

        // Inicializar dropdowns
        dataRec.forEach((data) => {
          dropdownReceta(data.id);
        });

        // Evento para dibujar dropdowns
        table.on("draw", function () {
          dataRec.forEach((data) => {
            dropdownReceta(data.id);
            applyPermissions();
          });
        });

        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  }).then(() => {
    applyPermissions();
  });
}

// -- Complementos --
function simple_data_table(table, no = 10) {
  return $(table).DataTable({
      dom: 'lpftrip',
    pageLength: no,
    searching: true,
    bLengthChange: false,
    bFilter: false,
    order: [],
    bInfo: true,
    oLanguage: {
      sSearch: "Buscar:",
      sInfo:
        "Mostrando del (_START_ al _END_) de un total de _TOTAL_ registros",
      sInfoEmpty: "Mostrando del 0 al 0 de un total de 0 registros",
      sLoadingRecords: "Por favor espere - cargando...",
      oPaginate: {
        sFirst: "Primero",
        sLast: "'Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
    },
  });
  
  getPageDataTable(table)
}

function getPageDataTable(tableId) {
    const tablePage = tableId.replace('#','');
    const storageKey = `${tablePage}_page`;
    const table = $(`${tableId}`).DataTable();

    // Restaurar la página guardada
    const savedPage = sessionStorage.getItem(storageKey);
    if (savedPage) {
        table.page(parseInt(savedPage, 10)).draw(false); // Cambiar a la página guardada
    }

    // Guardar la página actual cuando el usuario cambie de página
    table.off("page").on("page", function () {
        const currentPage = table.page.info().page; // Obtener la página actual
        sessionStorage.setItem(storageKey, currentPage); // Guardar en sessionStorage
    });
}