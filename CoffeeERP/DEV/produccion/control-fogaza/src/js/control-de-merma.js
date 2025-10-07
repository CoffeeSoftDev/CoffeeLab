window.link = "ctrl/ctrl-control-de-merma.php";

/* -- Init components --*/

area      = [];
productos = [];
nuevo     = [];
recetas   = [];

let collector = [];
let idFolio   = 0;
let pos       = {};
let mdl       = {};

$(function () {
  initComponents(link).then((data) => {
    
    area      = data.area;
    productos = data.productos;
    collector = data.folio;
    recetas   = data.recetas;
    nuevo     = data.productos;

    pos       = new POS(link, "content-vista");
    merma     = new controlMerma(link, "content-vista");
    
    merma.ControlTicket();
    // merma.createModuleMerma();
    
 
    
   
  });
});


class controlMerma extends modulo_uno {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents(){
        // inicializar atributos
        this.attr_content_form = {
            class: "col-12 mb-3 ",
        };

        this.attr_content_table = {
            class: "col-12 mt-3 ",
        };
       
    


        this.attr_table = {
            color_th: "bg-primary",
            f_size: '12',
            right: [3, 4],
            ipt: [2],
            f_size: 12,
        };


        // inicializar Modulo Formulario
        this.createModulo();
        this.lsProductos();
    }

    ControlTicket() {

        if (collector) {
            $("#btnCrearPedido").addClass("d-none");
            $("#btnCerrarTicket").removeClass("d-none");

            $("#content-hora").html('<b>Apertura: </b> <span class="text-info"> ' +
                collector.fecha + ' - ' +
                collector.hora + "</span>");







            $("#content-nota").html(
                '<b>Folio: </b> <span class="text-info">' + collector.idLista + "</span>"
            ).append($('<b>', { html: ' ' }));
            this.initComponents();
        } else {

            $("#btnCerrarTicket").addClass("d-none");
            $("#btnCrearPedido").removeClass("d-none");

            $("#content-hora").html("");
            $("#content-nota").html("");
            $("#content-vista").empty_state();


        }
    }

    createfilterBarMerma(){
        let filter = [
          
            {
                opc  : 'input-group',
                icon : 'icon-calendar-1',
                lbl  : 'Fecha de captura',
                class: 'col-12 col-lg-4',
                id   : 'foliofecha',
                
            },
            {
                opc  : 'btn',
                class: 'btn-info',
                id   : 'addMerma',
                class: 'col-12 col-lg-3',
                text: 'Nuevo'
             
            }
            
        ]
        ;

        $('#content-bar').content_json_form({data:filter,type:''});
        simple_date_picker('foliofecha');
    }

    createModuleMerma(options) {

        let json_components = {
            id: "pos",
            class: "card-body row m-2",

            contenedor: [
                {
                    type: "form",
                    id: "formPos",
                    class: " col-lg-12 line  pt-2",
                    novalidate: true,
                },

                {
                    type: "div",
                    id: "contentPos ",
                    class: "col-lg-12 line",
                   
                },
            ]
        };


        var defaults = { data: json_components, design: true, parent: 'content-vista'};
        let opts = Object.assign(defaults, options);
        this.createLayaout(opts);

    }

    createModuloForm(){

    }

    createModuloTabla(){

    }












    createModulo(){

        

     
        // Agregar json para formulario
        
        this.data_plugin_form = {
            data: this.jsonForm(),
            type: ''
        };


        // asignamos la data para enviar al backend
        let dtx = {
            tipo: 'text',
            opc     : 'add-frm-data',
            id_lista: collector.id
        };

        this.data_table = {
            opc: "ls",
            id_lista: collector.id,
        };

        this.opts_table = {
            beforeSend: false,
            datatable: false
        };


    
        // Ejecutar metodo para visualizar formulario
        this.modulo_tabla_formulario({ alert: false ,autovalidation:false});
        
        // Validar formulario
        $('#frm').validation_form(dtx,(datos) => {

            
            fn_ajax(datos, link, "").then((data) => {

                        $('#frm')[0].reset();
                        this.lsProductos();
                
                });

            


          

        });

        
        // Complementos para formulario :
        $('#id_productos').select2({
            theme: "bootstrap-5",
            width: '100%',
        });



    }

   
    jsonForm(){

        return [
        
            {
                opc: "select",
                lbl: "Productos",
                id: "id_productos",
                
                tipo: "texto",
                class: 'col-12 col-lg-3',
                data: productos,
                
                selected: "-- Seleccione un producto --",
                onchange: "obtenerPrecio()",
            },

            {
                opc: "input-group",
                lbl: "Costo",
                class: 'col-12 col-lg-3',
                id: "costo",
                tipo: "cifra",
                icon: "icon-dollar",
                placeholder: '0.00',
            },

            {
                opc: "input-group",
                lbl: "Cantidad",
                class: 'col-12 col-lg-3',

                id: "cantidad",
                tipo: "cifra",
                icon: "icon-cube",
            },

            {
                opc: "btn-submit",
                class: 'col-12 col-lg-3',
                id: "btnNuevo",
                text: "Agregar",

                icon: "icon-cube",
            },
        ];

     

    }

    lsProductos() {

        let dtx = {
            opc: "ls",
            id_lista: collector.id,
            idFormato: collector.id_grupo,
        };

        
        fn_ajax(dtx, link, "").then((data) => {
            let object_table = {
                data: data,
                right: [4, 5],
                center:[2],
                ipt: [3],
                f_size: 12,
                id: 'mdl-table',
                // color_th: "bg-primary",
            };

            $("#content-table").rpt_json_table2(object_table);

            eventoInput("mdl-table");
        });
    }

    /*-- Metodos para el control de ticket -- */ 
    CrearFormato(JSON) {
        let modal = bootbox.dialog({
            title: "<strong>  CREAR FORMATO </strong> ",
            closeButton: true,
            message: '<form id="content-formato"  novalidate></form>',
        });

        $("#content-formato").content_json_form({
            data: JSON,
            type_btn: "two_btn",
        });

        $("#txtfoliofecha").daterangepicker(
            {
                singleDatePicker: true,
                startDate: moment(),
                locale: {
                    format: "YYYY-MM-DD",
                },
            },
            function (start, end, label) {
                console.log(start.format("YYYY-MM-DD"));
            }
        );

        $("#content-formato").validation_form(
            {
                tipo: "text",
                opc: "crear-formato",
            },
            (datos) => {
                fn_ajax(datos, link, "").then((data) => {
                    alert();

                    modal.modal("hide");
                    collector = data.folio;
                    productos = data.productos;


                    console.log(collector);

                    this.ControlTicket();

                });
            }
        );

        return modal;
    }

    CerrarFormato(dataObject) {

        Swal.fire({
            title: "",
            text: "¿ Deseas terminar la captura ? ",
            icon: "warning",
            showCancelButton: true,

            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",

        }).then((result) => {
            
            if (result.isConfirmed) {
                let dtx = {
                    opc: "terminar-formato",
                };
            
                let object_dtx = Object.assign(dtx, dataObject);


                fn_ajax(object_dtx, link, "").then((data) => {

                    // collector = data.folio
                    // this.ControlTicket();

                });


            }
        });
    }


}



class POS {
    constructor(link, div) {
        this._link = link;
        this._div_modulo = div;
    }

    static object_close_format = {};



    /*-- Metodos  --*/

   

  

    QuitarProducto(object_data) {
        let dtx = {
            opc: "Quitar",
        };

        let object_dtx = Object.assign(dtx, object_data);

        let object_alert = {
            title: "",
            text: "¿ Deseas quitar el producto ?",
            icon: "warning",

            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
        };

        Swal.fire(
            object_alert,
        ).then((result) => {
            if (result.isConfirmed) {


                fn_ajax(object_dtx, link, "").then((data) => {

                    this.lsProductos();
                });
            }
        });
    }

    lsProductos() {

        let dtx = {
            opc: "ls",
            id_lista: collector.id,
            idFormato: collector.id_grupo,
        };

        this.object_table;

        fn_ajax(dtx, link, "").then((data) => {
            let object_table = {
                data    : data,
                right   : [3, 4],
                ipt     : [2],
                f_size  : 12,
                id      : 'mdl-table',
                color_th: "bg-primary",
            };

            $("#content-table").rpt_json_table2(object_table);

            eventoInput("mdl-table");
        });
    }

   


}


function interface() {  // sirve para cargar las configuraciones iniciales y settear los valores establecidos

    mdl.attr_content_form = {
        class: "col-12 col-md-4 container-border-right container-border-primary",
    };

    mdl.attr_content_table = {
        class: "col-12 col-md-8  p-3",
    };

    mdl.attr_table = {
        color_th: "bg-primary",
        right   : [3, 4],
        ipt     : [2],
        f_size  : 12,
    };

  

    mdl.opts_table = {
    
        beforeSend:false,
        datatable:false
    };

}

function modulo_mermas() {
    interface();
    /*-- CREAR FORMULARIO  --  */

    json_filter = [
    {
        opc: "select",
        lbl: "Producto",
        id: "id_productos",
        tipo: "texto",
        data: productos,
        selected: "-- Seleccione un producto --",
        onchange: "obtenerPrecio()",
    },

    {
        opc: "input-group",
        lbl: "Costo",
        id: "costo",
        tipo: "cifra",
        icon: "icon-dollar",
        //   disabled: true,
        placeholder: 0.00,
    },

    {
        opc: "input-group",
        lbl: "Cantidad",
        id: "cantidad",
        tipo: "cifra",
        icon: "icon-cube",
    },
    ];

    mdl.data_plugin_form = {
        data: json_filter
    };

    // asignamos la data para enviar al backend
    mdl.data_form = {
        opc: 'add-frm-data',
        id_lista: collector.id
    };

    mdl.data_table = {
        opc: "ls",
        id_lista: collector.id,
    };


    // Ejecutar metodo para visualizar formulario
    mdl.modulo_tabla_formulario({alert:false});

    $("#txtid_productos").option_select({
        select2: true,
        group: false,
    });



    mdl.lsTable();

   
    
}

function QuitarProducto(id){

   let object_data = {
        idListaProductos: id,
   };

   pos.QuitarProducto(object_data);   
}


function TerminarFormato(){
    
    merma.CerrarFormato({
        id_Estado      : 2,
        estado_revisado: 1,
        nota           : 'Cerrado',
    
        idLista: collector.id
    });

   
}


function eventoInput(idTable) {


    $("#" + idTable + " input[type='text']").on("input", function () {

        // Encontrar la fila más cercana
        var tr   = $(this).closest("tr");
        let name = $(this).attr("name");

        let cantidad = $(this).val();
        let precio   = tr.find('td').eq(3).text();

        let total    = precio * cantidad;

        tr.find('td').eq(4).text(evaluar(total));
        
        // Creamos un paquete para enviar a php
        let dtx = {
            opc             : "ipt",
            [name]          : $(this).val(),
            idListaProductos: $(this).attr("id"),
        };

        let totalGral = totalColumna(idTable,4);

        $('#lblTotalCostoRecetaIng').html(totalGral); 


        simple_send_ajax(dtx, link, "").then((data) => { });
    });
}








function totalColumna(idTable,col){

    let total = 0;

    $("#"+idTable+" tbody tr").each(function () {

        var valor = $(this).find("td:eq("+col+")").text();
        
        let valorReal = parseFloat(valor.replace(/\$/g, "").replace(/,/g, "")); // Utilizar parseFloat para convertir a número decimal y reemplazar las comas por puntos si es necesario
        
       

        if (!isNaN(valorReal)) {
          
            total += valorReal;

        }



    });

    return total;

}





function obtenerPrecio() {
    let idProducto = $("#id_productos").val();
    
    if(idProducto){

        let precio = recetas.filter((json) => json.id_Produccion == idProducto);
        $('#costo').val(precio[0].precioVenta);

    }else{
        $('#costo').val(0);
    }

    setTimeout(() => {
        
        $('#cantidad').focus();
    }, 200);
    

}

function Nuevo() {
  let JSON_pedido = [
    // {
    //   opc: "select",
    //   class: "col-12",
    //   lbl: "Elige una categoria:",
    //   id: "id_grupo",
    //   data: [
    //     { id: 1, valor: "FRANCES" },
    //     { id: 2, valor: "PASTELERIA" },
    //     { id: 4, valor: "BIZCOCHO" },
    //   ],
    // },

    {
      opc  : "input-group",
      icon: "icon-calendar",
      class: "col-12",
      lbl  : "Fecha ",
      name : "foliofecha",
      id   : "txtfoliofecha",
      tipo : "texto",

      holder: "",
    },
  ];

  merma.CrearFormato(JSON_pedido);
}

/*-- Complementos --*/ 
function evaluar(valor) {
    return valor ? '$ ' + valor.toFixed(2) : '-';
}

function simple_date_picker(id){

    $('#'+id).daterangepicker({ 
        "singleDatePicker": true, 
    });

}



function range_date_picker(id) {

    var start = moment().startOf('month');
    var end = moment();

    $('#' + id).daterangepicker(
        {
            startDate: start,
            endDate: end,
            cancelClass: "btn-danger",
            ranges: {
                'Hoy': [moment(), moment()],
                'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Ultimos 7 dias': [moment().subtract(6, 'days'), moment()],
                //    'Ultimo 30 dias': [moment().subtract(29, 'days'), moment()],
                'Mes actual': [moment().startOf('month'), moment().endOf('month')],
                'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1,
                    'month').endOf(
                        'month')]
            }
        }

    );
}

