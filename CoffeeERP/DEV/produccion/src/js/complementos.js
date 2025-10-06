const LOAD = `<div class="d-flex align-items-center justify-content-center" style="min-height:300px;">
                    <h3 class="text-primary">
                        <i class="icon-spin4 animate-spin"></i>
                        ANALIZANDO
                    </h3>
                </div>`;

function swal_error(xhr, status, error) {
    let response = xhr.responseText;
    if (response === "")
        response = "Error de sistema: No se obtuvo una respuesta.";

    Swal.fire({
        icon: "error",
        title: "LLAMAR A SORPORTE TÉCNICO",
        html: status + " " + error + "<br>" + response,
        showConfirmButton: true,
    });
}

function swal_success() {
    Swal.fire({
        width: 200,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
    });
}

function swal_warning(title) {
    Swal.fire({
        icon: warning,
        title: title,
        showConfirmButton: false,
        timer: 2000,
    });
}

function swal_question(title, text) {
    return Swal.fire({
        icon: "question",
        title: title,
        text: text,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-danger",
        },
    });
}

function send_ajax(datos, url) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: url,
            contentType: false,
            data: datos,
            processData: false,
            cache: false,
            dataType: "json",
            success: function (data) {
                resolve(data);
            },
            error: function (xhr, status, error) {
                swal_error(xhr, status, error);
            },
        });
    });
}

function tb_ajax(datos, url, div) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: url,
            contentType: false,
            data: datos,
            processData: false,
            cache: false,
            dataType: "json",
            beforeSend: () => {
                $(div).html(LOAD);
            },
            success: (data) => {
                resolve(data);
            },
            error: function (xhr, status, error) {
                swal_error(xhr, status, error);
            },
        });
    });
}

function tb_ajax_str(datos, url, div) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: url,
            data: datos,
            dataType: "json",
            beforeSend: () => {
                $(div).html(LOAD);
            },
            success: (data) => {
                resolve(data);
            },
            error: function (xhr, status, error) {
                swal_error(xhr, status, error);
            },
        });
    });
}

function dataTable_responsive(id, prioridad) {
    $(id).DataTable({
        language: {
            url: "../src/plugin/datatables/spanish.json",
        },
        ordering: false,
        responsive: true,
        columnDefs: prioridad,
    });
}
function dataTable_responsive2(id, prioridad) {
    $(id).DataTable({
        language: {
            url: "../src/plugin/datatables/spanish.json",
        },
        info: false,
        searching: false,
        paging: false,
        ordering: false,
        responsive: true,
        columnDefs: prioridad,
    });
}

function rangepicker(id, start, end, range, custom, callback) {
    $(id).daterangepicker(
        {
            showDropdowns: true,
            minYear: 2016,
            maxYear: parseInt(moment().format("YYYY"), 10),
            cancelClass: "btn-outline-danger",
            applyClass: "btn-primary",
            startDate: start,
            endDate: end,
            ranges: range,
            locale: {
                format: "DD/MM/YYYY",
                applyLabel: "Aplicar",
                cancelLabel: "Cancelar",
                prevText: "< Ant.",
                nextText: "Sig. >",
                currentText: "Hoy",
                monthNames: [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                ],
                monthNamesShort: [
                    "Ene",
                    "Feb",
                    "Mar",
                    "Abr",
                    "May",
                    "Jun",
                    "Jul",
                    "Ago",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dic",
                ],
                daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                customRangeLabel: "Personalizado", 
            },
        },
        function (start, end, label) {
            callback(start, end);
        }
    );

    if(custom === false ){
        $(id).on('show.daterangepicker', function(ev, picker) {
            picker.container.find('.ranges li:last-child').css('display', 'none');
        });
    }
}



$.fn.bs_json_form = function (options) {
  var prefijo = "txt";

  var defaults = {
    data    : [],
    clase   : "",
    type_btn: "btn",
    bs3     : false,
    name_fn : "EnviarDatos",
    btn     : true
  };

   var opts = $.fn.extend(defaults, options);

   // Creamos el formulario
   var div = $(this);

     // Recorremos el arreglo json
  for (const x of opts.data) {

    var required = true;
    if (x.required == false) {
      required = false;
    }
    
    clase_bs = 'col mb-3';
    if(bs3 == true){
      clase_bs = "col-sm-2";
    }

    var div_hijo = $("<div>", {
      class: ` ${clase_bs}   ${opts.clase}`,
    });
  
    // ¿Que tipo de componente vas a crear ? -----

    switch (x.opc) {
      case "input":
          var align = "";
          if (x.tipo == "cifra" || x.tipo == "numero") {
            align = "text-end";
          }

          div_hijo.append(
            $(`<input>`, {
              class   : `form-control input-sm ${align}`,
              id      : prefijo + x.id,
              tipo    : x.tipo,
              name    : x.id,
              required: required,
              value   : x.value,
            })
          );
      break;
      
      case "btn":

        div_hijo.append(
             $("<button>", {
             class: "btn btn-primary ",
             text: "",
             id: "btnAceptar",
            
           });
        );
        
      break;  
    }

     div.append(div_hijo);

  }// end recorrido

};

