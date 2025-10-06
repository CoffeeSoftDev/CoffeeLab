link = "ctrl/ctrl-dias-de-produccion.php";
let obj = {};
/* -- Variables --*/

let collector = [];
let json_filter = [];

$(function () {
  initComponents(link).then((data) => {
    collector = data;

    obj = new Complements(link,'');
    filtro_busqueda();
    buscar();
  });

  
});

function filtro_busqueda() {
  json_filter = [
   
    {
      opc: "select",
      lbl: "Categoria",
      id: "ls",
      tipo: "texto",
      data: collector.ls,
      class:'col-sm-3 '
    },

    {
      
      opc: "select",
      lbl: "Estado",
      id:  "estadoProducto",
      tipo: "texto",
      class: 'col-sm-2 ',

      data: [
          {'id': 1, 'valor': 'Activo'},
          {'id': 0, 'valor': 'Inactivo'},
      ],

 
    },

    {
      opc: "btn",
      id: "btn-buscar",
      text: "Buscar",
      color: "primary",
      fn: "buscar()"
    },
    {
        opc: "label",
        text: "",
        class: 'col-sm-2 offset-3 text-end',
        id: "noProductos"
    }

   


  ];

  $("#content-filter").simple_json_content({
    data: json_filter,
    type: ""
  });
}

function buscar() {
  
    let dtx = {
    opc        : "lsData",
    idcategoria: $("#ls").val(),
    estado     : $("#estadoProducto").val(),
    categoria: $("#ls option:selected").text()
  };

  fn_ajax(dtx, link, "#content-data").then((data) => {
    
    
    $("#content-data").rpt_json_table2({
      data     : data,
      center   : [1,2,3,4],
      right    : [6],
      color_col: [6],
    //   color_col: [7, 8,9,10,11,12,13],
      color    : 'bg-default',
    //   color_th : "bg-primary",
      id:'tb-dias-produccion',
      f_size:'11'
    }).then((data) => {
        simple_data_table_no('#tb-dias-produccion',10);
        
    });

    $('#noProductos').html('No. productos: '+data.noProductos);
    eventoInput('simple-table');

      $(".js-example-basic-single").select2({
          theme: "bootstrap-5",
      });



  });
}

function eventoInput(idTable){
  /* Detecta si los inputs en la tabla tienen algun evento */ 
  $("#" + idTable + " input[type='number']").on("input", function () {
    // Obtiene el nombre del input (debe tener el nombre del campo de la base de datos)
    let name = $(this).attr("name");
    
    // Creamos un paquete para enviar a php
    let dtx = {
      opc: "ipt",
      [name]: $(this).val(),
      idAlmacen: $(this).attr("id"),
    };

    simple_send_ajax(dtx, link, "").then((data) => {

    });
  });
}

function estadoProducto(estadoProducto,id) {


    let toggle = $('#btnEstado' + id);


    let status = 1;

    if (toggle.attr("status") == "1"){
        status = 0;    
    }

    let dtx = {
        opc: "estadoProducto",
        id: id,
        estadoProducto: status
    };

   
    let object_alert = {
      title: "",
      text: "¿ Deseas desactivar,el producto ?",
      icon: "warning",

      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    };

    Swal.fire(
      
        object_alert,

    ).then((result) => {
      if (result.isConfirmed) {

        fn_ajax(dtx, link, "").then((data) => {

        
            if (toggle.attr("status") == "1"){
                
                toggle.attr("status","0");
                toggle.html('<i class="icon-toggle-off"></i>');
                toggle.toggleClass("btn-outline-danger btn-outline-success");

            }else{

                toggle.toggleClass("btn-outline-danger btn-outline-success");
                toggle.html('<i class="icon-toggle-on"></i>');
                toggle.attr("status", "1"); 
                
                
            }
            
        });
      }
    });
}


function enlace_receta(){
    
    obj = new Complements(link,'');
    obj.modal_question(); 
}




