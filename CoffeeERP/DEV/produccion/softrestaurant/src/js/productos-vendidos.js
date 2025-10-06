window.ctrl = "ctrl/ctrl-productos-vendidos.php";
window.ctrl_soft = "ctrl/ctrl-soft-archivos-diarios.php";
window.modal = window.modal || "";


/* -- Coleccion de datos -- */
let json_dias_pendientes = [];


$(function () {

    let datos = new FormData();
    datos.append("opc", "listUDN");

    send_ajax(datos, ctrl).then((data) => {
        let option = "";

        data.forEach((p) => {
            option += `<option value="${p.id}" >${p.valor}</option>`;
        });

        range_date_picker("iptDate");


        $("#txtUDN").html(option);

        

    }).then(() => {

        Soft_Restaurant();
    });


    //OBTENER el mes anterior con javascript  y asignarlo al input
    var d   = new Date();
    var mes = d.getMonth();
        mes = mes ;

    $("#txtMes").val(mes+1);

   
    


});


function add_componente() {
    if ($("#txtUDN").val() == 6) {
        // Reiniciar el contado de archivos pendientes
        $('#txtDias').html(0);
        $("#content-consultar").addClass("d-none");

        console.log("content-consultar");

        let div = $("<div>", {});

        // let lbl = $("<label>", {
        //     class: "fw-bold",
        //     text: "Selecciona una categoria",
        // });

        // div.append(lbl);

        let select = $("<select>", {
            class: "form-control",
            id: "txtCategoria",
        });

        var opciones = [
            { value: 1, text: "Frances" },
            { value: 4, text: "Bizcocho" },
            { value: 2, text: "Pasteleria" },
        ];

        $.each(opciones, function (index, opcion) {
            var nuevaOpcion = $("<option>", {
                value: opcion.value,
                text: opcion.text,
            });

            select.append(nuevaOpcion);
        });

        div.append(select);

        $("#content-cat-fogaza").html(div);
    } else {
        $("#content-consultar").removeClass("d-none");

        $("#content-cat-fogaza").html("");
    }
}

function buscar() {
    opc = $("#txtSoft").val();
    udn = $("#txtUDN").val();

    if (udn == 6) {
        fogaza_productos_vendidos();
    
    
    } else {
        switch (opc) {
            case "1":
                SoftRestaurant();
                break;
            case "2":
                // CostSys();
                break;
        }
    }
}

function CostSys() {

    let dtx = {
        opc: "lsGrupo",
        UDN: $("#txtUDN").val(),
        Mes: $("#txtMes").val(),
        Anio: $("#txAnio").val(),
    };

    fn_ajax(dtx, ctrl, "#content-desplazamiento").then((data) => {
        // $("#content-desplazamiento").rpt_json_table2({ data: data });
        $("#content-desplazamiento").item_json({ data });
    });


    //   datos = _get_data(["UDN", "Mes","Anio","Reporte"], "desplazamiento");
    //   datos = datos + "&fi=" + fi + "&ff=" + ff;

    //   $.ajax({
    //     type: "POST",
    //     url: ctrl,
    //     data: datos,
    //     dataType: "json",
    //     beforeSend: function () {
    //       $("#content-desplazamiento").Loading();
    //     },

    //     success: function (data) {
    //       $("#content-desplazamiento").simple_json_table({
    //         data: data,
    //         grupo: "bg-primary",
    //         right: [3, 4, 5],
    //         center: [0],
    //         color: [4, 5],
    //         folding: false,
    //         name: "table-desplazamiento",
    //       });

    //       // simple_data_table_no("#table-desplazamiento", 20);
    //     },
    //   });
}


function fn_costsys(id) {
    let dtx = {
        opc: "desplazamiento",
        UDN: $("#txtUDN").val(),
        Mes: $("#txtMes").val(),
        Anio: $("#txAnio").val(),
        id: id,
    };

    fn_ajax(dtx, ctrl, "#content-desplazamiento").then((data) => {
        $("#content-desplazamiento").rpt_json_table2({ data: data });
    });
}


function Soft_Restaurant() {
    $("#content-bar").validar_contenedor(
        {
            opc: "soft-restaurant",
        },
        (datos) => {

            tb_ajax(datos, ctrl, "#content-desplazamiento").then((data) => {
                $("#content-desplazamiento").rpt_json_table2({
                    data: data,
                    grupo: "bg-disabled4",
                    right: [3, 4, 5],
                    center: [0],
                    // color_col: [5],
                    color_th: "bg-primary",
                    f_size: "12",
                    id: "table-desplazamiento",
                });

                simple_data_table_no("#table-desplazamiento", 120);


                ContarDiasPendientes();
            });
        }
    );
}

function SoftRestaurant() {
    datos = _get_data(["UDN", "Mes", "Anio", "Reporte"], "soft-restaurant");

    $.ajax({
        type: "POST",
        url: ctrl,
        data: datos,
        dataType: "json",

        beforeSend: function () {
            $("#content-desplazamiento").Loading();
        },

        success: function (data) {
            $("#content-desplazamiento").rpt_json_table2({
                data: data,
                color_group: "bg-disabled2",
                right: [3, 4, 5],
                // center: [0],
                // color_col: [4],
                // color_th: 'bg-primary',
                f_size: "12",
                //   folding: true,
                id: "table-desplazamiento",
            });

            simple_data_table_no("#table-desplazamiento", 120);
            // ContarDiasPendientes();
        },
    });
}





function fogaza_productos_vendidos() {
    datos = _get_data(
        ["UDN", "Mes", 'Anio', "Reporte", "Categoria"],
        "fogaza-desplazamiento"
    );

    $.ajax({
        type    : "POST",
        url     : ctrl,
        data    : datos,
        dataType: "json",

        beforeSend: function () {
            $("#content-desplazamiento").Loading();
        },

        success: function (data) {

            $("#content-desplazamiento").rpt_json_table2({
            
                data : data,
                right: [3, 4, 5],
                f_size: "12",
                id   : "table-desplazamiento",
            
            });

            // datable_export_excel("#table-desplazamiento", 120);
        },
    });
}

function updateModal(id, title) {

    let form = $('<form>', {
        class: 'cols col-12',
        novalidate: true
    });

    $("#id").simple_json_form({
        data: data_json,
    });



    modal = bootbox.dialog({
        title: ` EDITAR "${title.toUpperCase()}" `,
        message: form,
    });



}

function update(id, input) {
    let INPUT = $(input);
    if (!INPUT.val()) {
        INPUT.focus();
        INPUT.addClass("is-invalid");
        INPUT.next("span").removeClass("hide");
    } else {
        INPUT.removeClass("is-invalid");
        INPUT.next("span").addClass("hide");
        //let datos = new FormData();
        //datos.append('opc', 'edit');
        //send_ajax(datos, ctrlUser).then((data) => {
        //    console.log(data);
        //    if (data === true) {
        $("#btnCerrarModal").click();
        swal_success();
        //   }
        //});
    }
}

/*----------------------------
  -- Subir Costo Potencial
-----------------------------*/
let _rowNotFound = [];

function SubirDesplazamiento() {
    var mes = $("#txtMes option:selected").text();
    var dias = $("#txtDias").text();

    //   if (dias == 0 || dias == 4) {
    Swal.fire({
        title: `¿Deseas mover el desplazamiento del mes de <span class="text-success">${mes}</span>  a costo Potencial ?`,
        text: "Esto afectara el desplazamiento del mes actual ",
        icon: "warning",
        confirmButtonText : 'Comparar costo potencial',
        denyButtonText    : 'Subir costo potencial',
        denyButtonColor: "#009AFF",
        showDenyButton: true,
        // showCancelButton: true,
    }).then((result) => {

        if (result.isConfirmed) {
            datos = {
                opc          : "subir-costo-potencial",
                UDN          : $("#txtUDN").val(),
                Mes          : $("#txtMes").val(),
                Anio         : $("#txAnio").val(),
                clasificacion: $("#txtCategoria").val(),
                subir:0,
            };


         
        }else if (result.isDenied) {

            datos = {
                opc: "subir-costo-potencial",
                UDN: $("#txtUDN").val(),
                Mes: $("#txtMes").val(),
                Anio: $("#txAnio").val(),
                clasificacion: $("#txtCategoria").val(),
                subir: 1,
            };
         
        }


        fn_ajax(datos, ctrl, "#content-desplazamiento").then((data) => {

            _rowNotFound = data.notFound;

            let json_tab = [
                {
                    tab: "Productos agregados (" + data.total + ")",
                    id: "tab1",
                    active: true, // indica q pestaña se activara por defecto
                    contenedor: [ // si el tab tendra contenedores especificos, se pueden agregar como objetos
                        {
                            id: "content-agregados",
                            class: "col-sm-12 ",
                        },

                    ],
                },

                // forma para crear un simple tab
                {
                    tab: "Productos no encontrados (" + _rowNotFound.total + ") ",
                    id: "content-no-agregados",

                },
            ];


            $("#content-desplazamiento").simple_json_tab({ data: json_tab });


            $("#content-agregados").rpt_json_table2({
                data     : data,
                center   : [1, 2, 4],
                right    : [5,6],
                color_col: [4],
                title_th : data.title,
                id       : "tb-subir-costo-potencial",
                f_size   : "10",
                color_th : "bg-primary",
                extends  : true
            });

            $("#content-no-agregados").rpt_json_table2({
                data    : _rowNotFound,
                center  : [2, 4],
                title_th: data.title,
                id      : "listNotFound",
                f_size  : "12",
            });

            datable_export_excel("#listNotFound", 50);


        });

    });


    //   } else {
    //     alert(
    //       "No se puede subir el costo potencial, Consulta las fechas pendientes."
    //     );
    //   }



}

function NotFound() {


    $("#content-desplazamiento").rpt_json_table2({
        data: _rowNotFound.arreglo,
        center: [2, 4],
        right: [3],
        id: "tb-subir-costo-potencial",
    });

    datable_export_excel("#tb-subir-costo-potencial", 50);

}

function agregadosCostoPotencial() {

    $("#content-desplazamiento").simple_json_table({
        data: _rowNotFound,
        center: [2, 4],
        right: [3],
        id: "tb-subir-costo-potencial",
    });

    simple_data_table_no("#simple-table", 20);
}

function ver_costo_potencial() {

    $("#content-desplazamiento").simple_json_table({
        data: _rowNotFound.lsCP,
        center: [2, 4],
        right: [3],
        id: "tb-subir-costo-potencial",
    });

    //   simple_data_table_no("#simple-table", 20);
}

/*----------------------------
  -- Días Pendientes
-----------------------------*/

function _get_simple_data(multiple, name_opc) {
    url = "";

    if (multiple != null) {
        for (var i = 0; i < multiple.length; i++) {
            url = url + multiple[i] + "=" + $("#txt" + multiple[i]).val() + "&";
        }
    }

    url = url + "opc=" + name_opc;
    return url;
}

function lsDias() {
    $("#content-desplazamiento").rpt_json_table2({
        data: json_dias_pendientes,
        id: "table-dias",
        th: "bg-primary",
        grupo: "bg-disabled2",
        center: [1, 2],
        right: [3, 4, 5, 6],
    });
}

/*-------   [ ]   --------*/

function ContarDiasPendientes() {
    datos = _get_data(["Mes", "Anio", "UDN"], "dias-pendientes");

    simple_send_ajax(datos, ctrl_soft).then((data) => {
        $("#txtDias").html(data.dias);
        json_dias_pendientes = data;
    });
}


function dias_pendientes_soft() {
    datos = _get_data(["Mes", "Anio", "UDN"], "dias-pendientes");


    fn_ajax(datos, ctrl_soft, "#content-desplazamiento").then((data) => {
        $("#content-desplazamiento").rpt_json_table2({
            data: json_dias_pendientes,
            id: "table-dias",
            color_th: "bg-primary",
            grupo: "bg-disabled2",
            f_size: "12",
            center: [1, 2],
            right: [3, 4, 5, 6],
        });
    });
}



function fn_modal(id) {

    modal = bootbox.dialog({
        title: `<strong> Registros <i class="icon-cancel bootbox-close-button" ></i></strong> `,
        size: "large",
        message: `<div class="" id="content-frm" ></div><div class="mt-3" id="content-table"></div>`,
    });


    let json_modal = [
        {
            opc: "input-calendar",
            lbl: "",
            id: "iptFecha",
            tipo: "cifra",
            icon: "icon-calendar",
            //  value: $('#1_1').text(),

        },
    ];

    $("#content-frm").simple_json_content({
        data: json_modal,
        fn: "lsRegistros()",
        type_btn: "two_btn",
    });


    range_picker_now("iptFecha");


}


function lsRegistros() {
    dtx = {
        opc: "ls",
        //   id: id,
        fecha: $("#iptFecha").val(),
        udn: $("#txtUDN").val()
    };

    fn_ajax(dtx, ctrl_soft, "#content-table").then((data) => {
        $("#content-table").rpt_json_table2({
            data: data,
            f_size: "10",
            right: [2, 3, 4],
            clase_table: 'tb-report',
            color_th: "bg-primary",

        });
    });
}


function range_picker_now(id) {
    rangepicker(
        "#" + id,
        true,
        moment(),
        moment(),
        {
            Hoy: [moment(), moment()],
            Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
            "Última semana": [moment().subtract(6, "days"), moment()],
            "Mes anterior": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
            ],
        },
        "",
        function (startDate, endDate) {
            date1 = startDate.format("YYYY-MM-DD");
            date2 = endDate.format("YYYY-MM-DD");
        }
    );
}

function range_date_picker(id) {
    console.log(id);

    var start = moment().startOf('month');
    var end = moment();

    $('#iptDate').daterangepicker(
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




