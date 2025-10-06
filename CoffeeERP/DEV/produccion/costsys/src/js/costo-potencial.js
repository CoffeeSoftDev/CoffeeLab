  window.ctrl_costo_potencial = window.ctrl_costo_potencial || "ctrl/ctrl-costo-potencial.php";
  window.ctrl_cuadro_comparativo = "ctrl/ctrl-costo-potencial-cuadro-comparativo.php";
//  temporal
window.ctrl_kpi = "ctrl/ctrl-temp-kpi.php";
let kpi = {};
let data_udn              = [];
let data_clasificacion    = [];
let data_subclasificacion = [];
let obj = {};
let tablero = {};
let cuadro = {};

$(function () {
    filtroBusqueda();

    initComponents(ctrl_costo_potencial).then((data) => {
        
        $("#contentTab").simple_json_tab({ data: json_tab });
        
        data_udn              = data.lsUDN;
        data_clasificacion    = data.lsClasificacion;
        data_subclasificacion = data.lsSubClasificacion;
        
        $('#Mes').val(4);
        $("#UDNs").option_select({ data: data_udn });
        lsBuscarFiltros();


        // Costo Potencial
        obj = new Complements(ctrl_costo_potencial,'');
        lsCostoPotencial(); 
                
        // $('#showFilter').html('<a class="btn btn-link" href="#" data-toggle="collapse" data-target="#tbTablero">Ver tablero</a > ');

        // Tablero de control :  
        tablero = new TableroControl(ctrl_costo_potencial, 'tab-tablero-control');
        tablero.initComponents();


        // Cuadro comparativo :
        cuadro = new cuadroComparativo(ctrl_cuadro_comparativo, 'tab-cuadro-comparativo');
        cuadro.initComponents();


        // KPI temporal:
        kpi = new kpis(ctrl_kpi, 'tab-kpi');
        kpi.initComponents();


    });

  let datos = new FormData();

  datos.append("opc", "listUDN");



});


/*--   Tabs    --*/

let json_tab = [
    {
        tab: "Costo Potencial",
        id: "tab-costsys",
        fn:'lsCostoPotencial()',
        active: true,// indica q pestaña se activara por defecto

        contenedor: [

            {
                id: "showFilter",
                class: "col-12 "
            },


            {
                id: "tbTablero",
                class: "col-12 "
            },

            {
                id: "tbDatos",
                class: "col-12 line"
            },


        ],
    },

    {
        tab: "Tablero de Control",
        id: "tab-tablero-control",

        fn: 'tablero.listTable()',
    },

    {
        tab: "Cuadro comparativo",
        id: "tab-cuadro-comparativo",
        fn: 'cuadro.lsCuadroComparativo()',

    },

    {
        tab: "KPI",
        id: "tab-kpi",
        fn: 'kpi.lsKpi()',

    },




];


/*-- Tablero de operaciones --*/

function limpiarDesplazamientos(){
    obj.attr_question = {
       title: '¿Estas seguro de eliminar todos los desplazamientos ?',
    };

    obj.data_question = { 
        opc          : 'setter-desplazamientos',
        UDN          : $("#UDNs").val(),
        Anio         : $("#Anio").val(),
        Mes          : $("#Mes").val(),
        Clasificacion: $("#Clasificacion").val(),
    };

    obj.modal_question({ fn:'lsCostoPotencial'});
}

function preciosPropuestos() {
    
    objModal = new modal_complements();

    objModal._attr_modal = {
        title             : '¿Que te gustaria hacer con los precios propuesto ?',
        confirmButtonText : 'Limpiar Precio Prop.',
        denyButtonText    : 'Actualizar Precios Receta',
        confirmButtonColor: "#66A997",
        denyButtonColor   : "#009AFF",
        cancelButtonColor : "#A72A32",
    };


    // asignar metodo multiple questions y extender el swal.fire: 
    let swalPrecio = objModal.multipleQuestions({ extends:true });


    swalPrecio.then((result) => {  // Realiza la accion de acuerdo a la respuesta del usuario :    

        if (result.isConfirmed) {

            let dtx = {
                opc          : 'LimpiarPrecioPropuesto',
                UDN          : $("#UDNs").val(),
                Anio         : $("#Anio").val(),
                Mes          : $("#Mes").val(),
                Clasificacion: $("#Clasificacion").val(),
            };

            fn_ajax(dtx, ctrl_costo_potencial, "#tbDatos").then((data) => {
            
            
            });

        
            
        } else if (result.isDenied) {
            
            var dtx = {
                opc          : 'actualizarPrecios',
                UDN          : $("#UDNs").val(),
                Anio         : $("#Anio").val(),
                Mes          : $("#Mes").val(),
                Clasificacion: $("#Clasificacion").val(),
            };

        

            fn_ajax(dtx, ctrl_costo_potencial, "#tbDatos").then((data) => {

                $('#tbDatos').rpt_json_table2({ data: data, });

            });


            
            // obj.data = {
            //     opc          : 'limpiarCostoPotencial',
            //     UDN          : $("#UDNs").val(),
            //     Anio         : $("#Anio").val(),
            //     Mes          : $("#Mes").val(),
            //     Clasificacion: $("#Clasificacion").val(),
            // };
        
        
            // obj.sendAjax();
           





        }
             
        

    });


}

function addDesplazamiento(idRow, event){
    let tr = $(event.target).closest("tr");
    let receta = tr.find('td').eq(0).text();
}

class modal_complements{

    _attr_modal = {};
   
    set attr_modal(value){
        this._attr_modal = value;
    }

    multipleQuestions(options = {}) {


        var defaults = {
            fnConfirm: '',
            fnDeny: '',
            extends: false,
        };

        var opts = Object.assign(defaults, options);

        var atributos_modal = {
            title: "¿Que te gustaria hacer con los precios propuesto ?",

            showDenyButton: true,
            showCancelButton: true,

            confirmButtonText: 'Actualizar',
            denyButtonText: 'Eliminar costo Potencial',
            cancelButtonText: 'Cancelar',

        };

        var atributos_mdl = Object.assign(atributos_modal, this._attr_modal);


        let extends_swal = Swal.fire(atributos_mdl);

        if(opts.extends){
            return extends_swal;
        }else{

            extends_swal.then((result) => {

                if (result.isConfirmed) {
                   opts.fnConfirm();
                } else if (result.isDenied) {
                    opts.fnDeny();
                }

            });
        
        }

        }

}


function ejercicioMensual() {

    mes_actual = $('#Mes option[value="' + $('#Mes').val() + '"]').text();

    let mes_proximo = $('#Mes option[value="' + (parseInt($('#Mes').val()) + 1) + '"]').text();

    obj.attr_question = {
        title: '¿Deseas crear el ejercicio mensual de  <span class="text-success">' + mes_proximo +' </span> ?',
        html: 'Ten en cuenta que se utilizarán los datos del mes de <span class="text-primary fw-bold">' + mes_actual +'</span> como base para este nuevo ejercicio.'
    };

    obj.data_question = {
        opc: 'ejercicioMensual',
        UDN: $("#UDNs").val(),
        Anio: $("#Anio").val(),
        Mes: $("#Mes").val(),
        Clasificacion: $("#Clasificacion").val(),
    };

    

    obj.modal_question({ fn: 'lsAux' });

    
}

function lsAux() {

    obj.data_table = {
        opc: 'lsMensual',
        UDN: $("#UDNs").val(),
        Anio: $("#Anio").val(),
        Mes: $("#Mes").val(),
        Clasificacion: $("#Clasificacion").val(),
    
    };

    obj.lsTable({id:'tbDatos',datatable:false});
}



/*-- filter bar--*/


function lsClasificacion() {
    let clasificacion = data_clasificacion.filter(json => json.udn === $("#UDNs").val());
    $("#Clasificacion").option_select({ data: clasificacion });
}

function lsSubClasificacion() {
    let sub = [];
    
    sub.unshift({
        id: 0,
        valor: '-- Todos --',
        idClasificacion: 0   
    });

    const filterData = data_subclasificacion.filter(json => json.idClasificacion === $("#Clasificacion").val());
    
    sub.push(...filterData);
    
    $("#Subclasificacion").option_select({ data: sub });
 
    
}

function lsBuscarFiltros() {
    lsClasificacion();
    lsSubClasificacion();
}

function filtroBusqueda(){

    let json_filter = [

        {
            opc: "select",
            id: "UDNs",
            class: "col-sm-3 col-lg-2",
            onchange: 'lsBuscarFiltros()',
            lbl: "UDN",
        },

        {
            opc: "select",
            id: "Clasificacion",
            class: "col-sm-3 col-lg-2",
            onchange: 'lsSubClasificacion()',
            lbl: "Clasificación",
        },

        // {
        //     opc: "select",
        //     id: "Subclasificacion",
        //     class: "col-sm-3 col-lg-2",
        //     lbl: "Sub categoría",
        // },

        {
            opc: "select",
            id: "Anio",
            tipo: "text",
            class: "col-sm-3 col-lg-2",
            lbl: "Año",
            data:[
                {id:2024,valor:2024},
                {id:2023,valor:2023},
            ]
        },

        {
            opc: "select",
            id: "Mostrar",
            tipo: "text",
            class: "col-sm-4 col-lg-2",
            lbl: "Mostrar",
            data: [
                { id: 0, valor: '-- Todos los productos--'},
                { id: 1, valor: 'Solo productos con desplazamiento' },
            ]
        },

        {
            opc: "select",
            id: "Mes",
            tipo: "text",
            class: "col-sm-2",
            lbl: "Mes",
            data:[
                {id:1,valor:"Enero"},
                {id:2,valor:"Febrero"},
                {id:3,valor:"Marzo"},
                {id:4,valor:"Abril"},
                {id:5,valor:"Mayo"},
                {id:6,valor:"Junio"},
                // {id:7,valor:"Julio"},
                // {id:8,valor:"Agosto"},
                // {id:9,valor:"Septiembre"},
                // {id:10,valor:"Octubre"},
                // {id:11,valor:"Noviembre"},
                // {id:12,valor:"Diciembre"},
            ]
        },
        {
            opc: "select",
            id: "Consulta",
            tipo: "text",
            class: "col-sm-3 col-lg-2",
            lbl: "Consultar",
            data: [
                { id: 1, valor: 'Costsys Prueba'},
                { id: 2, valor: 'Costsys Real' },
            ]
        
        
        
        },


        {
            opc: "btn",
            fn: "lsCostoPotencial()",
            text: "Buscar",
            class: "col-sm-2",
        }
    ];

    $("#content-bar").simple_json_content({ data: json_filter, type: false });

}

function precioPropuesto(idRow,event){

    let tr     = $(event.target).closest("tr");
    let receta = tr.find('td').eq(0).text();

    let json_precio = [
        {
            opc : "input-group",
            id  : "precio_propuesto",
            lbl: "Precio Propuesto" ,
            tipo: "cifra",
            icon: 'icon-dollar',
            value: tr.find('td').eq(1).text(),
        },
      
    ];

    obj.data_modal = { title:  receta };
    var mdl = obj.modal_formulario({json:json_precio, autovalidation:false});
    
    setTimeout(function(){

        $('#txtprecio_propuesto').focus();
        
    }, 500); 


   

    $("#frm-modal").validation_form({
        opc             : "iptPrecioPropuesto",
        idcostopotencial: idRow,
    }, (datos) => {


        // Aplicar calculo de costo potencial al modificar el precio Propuesto

        let p_venta         = $('#txtprecio_propuesto').val();
        let pVentaIVA       = p_venta / (1 + (8 / 100));
        let costo           = (tr.find('td').eq(4).text()).replace(/\$/g, "");
        let costo_porc      = (costo / pVentaIVA) * 100;
        let mc              = pVentaIVA - costo;
        let desplazamiento  = tr.find('td').eq(7).text();
        let ventasEstimadas = pVentaIVA * desplazamiento;
        let costoEstimado   = costo * desplazamiento;
        let mcEstimado      = mc * desplazamiento;


        datos.append('ventasestimadas_propuesto', ventasEstimadas.toFixed(2) );
        datos.append('costoestimado_propuesto', costoEstimado.toFixed(2));
        datos.append('mcestimado_propuesto', mcEstimado.toFixed(2));
        datos.append('mc_propuesto', mc.toFixed(2));
        datos.append('costo_porc_propuesto', costo_porc.toFixed(2));

       
        send_ajax(datos, ctrl_costo_potencial , '').then((data) => {
        

           
            // Realizar cambios a la tabla
            tr.find('td').eq(1).text(p_venta);


            // Precio de venta sin iva

            tr.find('td').eq(3).text(evaluar(pVentaIVA));
            tr.find('td').eq(3).removeClass('bg-warning-1');
            tr.find('td').eq(3).addClass('bg-warning fw-bold');

            // Costo 
            tr.find('td').eq(4).text(costo);
            tr.find('td').eq(4).addClass('bg-warning fw-bold');

            // Ventas estimas :
            tr.find('td').eq(8).text(evaluar(ventasEstimadas));
            tr.find('td').eq(8).removeClass('bg-warning-1');
            tr.find('td').eq(8).addClass('bg-warning fw-bold');

            // Costo Estimado :

            tr.find('td').eq(9).text(evaluar(costoEstimado));
            tr.find('td').eq(9).removeClass('bg-warning-1');
            tr.find('td').eq(9).addClass('bg-warning fw-bold');

            // MC Estimado :

            tr.find('td').eq(10).text(evaluar(mcEstimado));
            tr.find('td').eq(10).removeClass('bg-warning-1');
            tr.find('td').eq(10).addClass('bg-warning fw-bold');


           

          
            



            // cerramos modal
            mdl.modal('hide');

        });



    });
   
    
}

function calcularCostoPotencial(tr, pp) {

    let pVentaIVA = pp / (1 + (8 / 100));
   
   
    return {
        'precio_propuesto': pp
    };
}

function lsCostoPotencial() {


  let datos = {
    opc             : "lsCostoPotencial",
    UDN             : $("#UDNs").val(),
    Anio            : $("#Anio").val(),
    Mes             : $("#Mes").val(),
    Clasificacion   : $("#Clasificacion").val(),
    Subclasificacion: $("#Subclasificacion").val(),
    Consulta        : $("#Consulta").val(),
    mostrar        : $("#Mostrar").val(),
  };

  fn_ajax(datos, ctrl_costo_potencial, "#tbDatos").then((data) => {

    // $('#tbTablero').rpt_json_table2({
    //     data: data.tablero,
    //     right:[2,3,4]
    // });

    if (data.productosModificados){

        // alert({icon:'warning',text:'Algunos productos han sido modificados.',timer:1200});
    }

    
    $("#tbDatos").rpt_json_table2({
        id         : 'tb-CostoPotencial',
        data       : data,
        color_th   : 'bg-primary',
        color_col  : [10],
        f_size     : '11',
        color      : 'bg-default',
        color_group: 'bg-warning-1',
          // class: 'table table-bordered table-hover',
        right  : [3,4,6,8,9,10,11,12],
        center : [5,7],
        extends: true
    });

    
    // dataTableScroll('#tb-CostoPotencial');
    //   simple_data_table_no('#tb-CostoPotencial',100)
      lsTablero();
  });

}

function lsTablero(){
    obj.data_table = {
        opc          : 'lsTable',
        UDN          : $("#UDNs").val(),
        Anio         : $("#Anio").val(),
        Mes          : $("#Mes").val(),
        Clasificacion: $("#Clasificacion").val(),
    };

    obj.opts_table = {
        id: 'tbTablero',
        datatable: false,
    };
    obj.attr_table = {
        color_th: 'bg-default',
        right:[2,3,4],
        id: 'tbTableroCollapse',
        // class: 'table table-bordered table-hover collapse',
    };
    
    obj.lsTable();
}

/* ----   Herramientas adicionales   --- */ 


function updateModal(id, title) {
  bootbox
    .dialog({
      title: ` EDITAR "${title.toUpperCase()}" `,
      message: `
                            <form id="modalForm" novalidate>
                                <div class="col-12 mb-3">
                                    <label for="cbModal" class="form-label fw-bold">Select</label>
                                    <div class="input-group-addon">
                                        <select class="form-select text-uppercase" name="cbModal" id="cbModal"></select>
                                    </div>
                                </div>
                              <div class="col-12 mb-3">
                                  <label for="iptModal" class="form-label fw-bold">Input</label>
                                  <input type="text" class="form-control" name="iptModal" id="iptModal" value="${title}" required>
                                  <span class="form-text text-danger hide">
                                      <i class="icon-warning-1"></i>
                                      El campo es requerido.
                                  </span>
                              </div>
                              <div class="col-12 mb-3 d-flex justify-content-between">
                                  <button type="submit" class="btn btn-primary col-5">Actualizar</button>
                                  <button type="button" class="btn btn-outline-danger col-5 bootbox-close-button">Cancelar</button>
                              </div>
                            </form>
                          `,
    })
    .on("shown.bs.modal", function () {
      const opciones = [
        { id: 1, valor: "Uno" },
        { id: 2, valor: "Dos" },
        { id: 3, valor: "Tres" },
      ];
      $("#cbModal").option_select({
        data: opciones,
        select2: true,
        father: true,
        placeholder: "- Seleccionar -",
      });

      let datos = $("#modalForm").validation_form({ id: id, opc: "update" });
      for (x of datos) {
        console.log(x);
      }

      // send_ajax(datos,ctrl_costo_potencial).then(data=>{
      //     alert();
      // });
    });
}



function evaluar(valor){
 return valor ? '$ ' + valor.toFixed(2) : '-';
}


function dataTableScroll(table){
    $(table).DataTable({
        destroy: true,
        responsive: false,
        ordering: false,
        paging: false,
        scrollY: "550px",
        // scrollX: true,
        scrollCollapse: true,
        // fixedColumns: true
        
    });
}