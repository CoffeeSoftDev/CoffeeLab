function lsIngredientes() {
  datos = _get_data_opc(["cbUDN"], "tbIngredientes");

  fn_ajax(datos, "ctrl/ctrl-ingredientes.php", "#tbDatos").then(
    (data) => {
      $("#tbDatos").rpt_json_table2({
        data: data,
        center: [ 3, 5, 6, 7],
        right: [2, 4],
        id: "tbIngredientes",
      });
      simple_data_table("#tbIngredientes");
    }
  );
}

function lsSubrecetas() {
  datos = _get_data_opc(["cbUDN", "cbClasificacion"], "tbSubReceta");
  
  
  fn_ajax(datos, "ctrl/ctrl-subrecetas.php", "#tbDatosSubReceta").then(
    (data) => {
      $("#containerTbSubReceta").rpt_json_table2({
        data     : data,
        right    : [3,5,6],
        center   : [1,4,7],
        color_col: [4,5],
        color    : "bg-default",
        id       : "tbSubRecetas",
        color_th :'bg-primary',
        f_size   : 12,
      });
        simple_data_table_no("#tbSubRecetas", 20);
    }
  );
}

function lsRecetas() {
  datos = _get_data_opc(["cbUDN", "cbClasificacion"], "tbRecetas");
  fn_ajax(datos, "ctrl/ctrl-recetas.php", "#tbDatosReceta").then(
    (data) => {
      $("#containerTbReceta").rpt_json_table2({
        data: data,
        center: [3],
        right: [4, 5, 6, 7],
        id: "tbRecetas",
        color_group: "bg-disabled2",
      });
      simple_data_table("#tbRecetas");
    }
  );
}

// -- Complementos --
function simple_data_table(table) {
  $(table).DataTable({
    pageLength: 10,
    searching: true,
    bLengthChange: false,
    bFilter: false,
    order: [],
    bInfo: false,
    oLanguage: {
      sSearch: "Buscar:",
      sInfo:
        "Mostrando del (_START_ al _END_) de un total de _TOTAL_ registros",
      sInfoEmpty: "Mostrando del 0 al 0 de un total de 0 registros",
      sLoadingRecords: "Por favor espere - cargando...",
      oPaginate: {
        sFirst: "Primero",
        sLast: "'Ãšltimo",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
    },
  });
}
