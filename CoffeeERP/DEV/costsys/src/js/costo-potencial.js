

window.ctrl_costo_potencial =
    window.ctrl_costo_potencial || "ctrl/ctrl-costo-potencial.php";
window.ctrl_costo_potencial_soft = "ctrl/ctrl-costo-potencial-soft.php";

ctrl_tableroCtrl = "ctrl/ctrl-costo-potencial-tablero.php";
ctrl_cuadro_comparativo = "ctrl/ctrl-cuadro-comparativo.php";

const ctrlMenu = "ctrl/ctrl-menu.php";
// const api      = "ctrl/ctrl-app-soft.php";

let costsys,desplazamiento,app;

let data_udn              = [];
let data_clasificacion    = [];
let data_subclasificacion = [];

let obj     = {};
let tablero = {};
let soft    = {};
let des ;

let cuadro;
let tableroCtrl;

let idProfile ;

$(function () {
    let cookies = getCookies();
    // instanciar clases:
    costsys     = new CostSys(ctrl_costo_potencial, "contentData");
    tablero     = new TableroControl(ctrl_tableroCtrl, "tab-tablero-control");
    cuadro      = new cuadroComparativo( ctrl_cuadro_comparativo, "tab-cuadro-comparativo");
    soft        = new SoftRestaurant(ctrl_costo_potencial_soft, "contentData");

    menuCostsys = new MenuCostsys(ctrlMenu, "");
    desplazamiento = new Desplazamiento(ctrl_costo_potencial_soft, "");
    appSoft = new AppSoftRestaurant(ctrl_Soft, "");
    app = new AppSoft("ctrl/ctrl-app-soft.php","");
    idProfile = cookies['IDP'];


    costsys.initComponents();

    initComponents(ctrl_costo_potencial).then((data) => {
              data_udn              = data.lsUDN;
              data_clasificacion    = data.lsClasificacion;
              data_subclasificacion = data.lsSubClasificacion;
        const fechaActual           = new Date();
        const mesActual             = fechaActual.getMonth();

        $("#Mes").val(mesActual);
        $("#UDNs").option_select({ data: data_udn });
        cuadro.initComponents();
          /*--    --*/
        lsBuscarFiltros();
        soft.initComponents();
        costsys.lsCostoPotencial();

        // Desplazamientos
        desplazamiento.init();

        // menu
        menuCostsys.init();

        console.log('idPuesto: ',cookies['IDP']);


            setTimeout(() => {
                if (cookies['IDP'] != '2' && cookies['IDP'] != 2) {
                $('#gbOpciones').empty();
            }
        }, 500); // puedes ajustar el tiempo de espera en milisegundos


    });
});

class CostSys extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents() {
        this.filterBar();
        this.tabsCostsys();

        // Especificar datos de consulta:
        this.idFilterBar = "filterBar";

        // this.buttonsCtrl();
    }

    filterBar() {


            const filter = [
                {
                    opc     : "select",
                    id      : "UDNs",
                    class   : "col-sm-3 col-lg-2",
                    onchange: "lsBuscarFiltros()",
                    lbl     : "UDN",
                    data    : data_udn,
                },

                {
                    opc     : "select",
                    id      : "Clasificacion",
                    class   : "col-sm-3 col-lg-2",
                    onchange: "lsSubClasificacion()",
                    lbl     : "Clasificación",

                },

                {
                    opc  : "select",
                    id   : "Anio",
                    tipo : "text",
                    class: "col-sm-2 col-lg-2",
                    lbl  : "Año",
                    data: [
                        { id: 2025, valor: 2025 },
                        { id: 2024, valor: 2024 },
                        { id: 2023, valor: 2023 },
                    ],
                    onchange: "costsys.lsCostoPotencial()",
                },

                {
                    opc  : "select",
                    id   : "Mes",
                    tipo : "text",
                    class: "col-sm-2",
                    lbl  : "Mes",
                    onchange: "costsys.lsCostoPotencial()",

                    data: [
                        { id: 1, valor: "Enero" },
                        { id: 2, valor: "Febrero" },
                        { id: 3, valor: "Marzo" },
                        { id: 4, valor: "Abril" },
                        { id: 5, valor: "Mayo" },
                        { id: 6, valor: "Junio" },
                        { id: 7, valor: "Julio" },
                        { id: 8, valor: "Agosto" },
                        { id: 9, valor: "Septiembre" },
                        { id: 10, valor: "Octubre" },
                        { id: 11, valor: "Noviembre" },
                        { id: 12, valor: "Diciembre" },
                    ],
                },

                {
                    opc: "btn",
                    fn: "costsys.lsCostoPotencial()",
                    text: "Buscar",
                    class: "col-sm-2",
                },
            ];



        $("#filterBar").simple_json_content({ data: filter, type: false });

    }

    tabsCostsys() {
        let tabs ;


        if (idProfile == '27' && idProfile == 27  ){

            tabs = [


                {
                    tab   : "Menu costsys",
                    id    : "tab-MenuCostsys",
                    fn    : "menuCostsys.ls()",
                    active: true,  // indica q pestaña se activara por defecto

                },
            ];


        }else   if (idProfile == '2' && idProfile == 2) {
        tabs = [
            {

                tab: "Costo Potencial",
                id: "tab-costsys",
                active: true, // indica q pestaña se activara por defecto
                fn: "costsys.lsCostoPotencial()",

                contenedor: [
                    {
                        id: "tbTablero",
                        class: "col-12 mb-2",
                    },

                    {
                        id: "showFilter",
                        class: "col-12 ",
                    },

                    {
                        id: "contentCostoPotencial",
                        class: "col-12",
                    },
                ],
            },

            {
                tab: "Tablero de Control",
                id: "tab-tablero-control",
                fn: "tablero.lsTableroControl()",
            },

            {
                tab: "Cuadro comparativo",
                id: "tab-cuadro-comparativo",
                fn: "cuadro.lsCuadroComparativo()",
            },

            {
                tab: "Desplazamientos",
                id: "tab-soft",
                fn: "soft.ls()",
            },
            // {
            //     tab: "Soft Restaurant ",
            //     id: "tab-desplazamiento",
            //     fn: "app.init()",

            // },

            {
                tab: "Menu costsys",
                id: "tab-MenuCostsys",
                fn: "menuCostsys.ls()",



            },
        ];

        }else{

            tabs = [
                {

                    tab: "Costo Potencial",
                    id: "tab-costsys",

                    fn: "costsys.lsCostoPotencial()",
                    active: true, // indica q pestaña se activara por defecto

                    contenedor: [
                        {
                            id: "tbTablero",
                            class: "col-12 mb-2",
                        },

                        {
                            id: "showFilter",
                            class: "col-12 ",
                        },

                        {
                            id: "contentCostoPotencial",
                            class: "col-12",
                        },
                    ],
                },



                {
                    tab: "Menu costsys",
                    id: "tab-MenuCostsys",
                    fn: "menuCostsys.ls()",




                },
            ];


        }


        $("#contentData").simple_json_tab({ data: tabs });
    }

    lsCostoPotencial() {

        this.createTable({
            parent: "contentCostoPotencial",
            idFilterBar: "filterBar",

            data: {
                tipo: "text",
                opc: "lsCostoPotencial",
            },

            conf: {

                datatable   : true,
                beforeSend  : true,
                fn_datatable: "data_table_export",
                pag:100

            },

            attr: {

                class: "table table-bordered table-stripedx  table-hover table-sm",
                color: "bg-default",
                // color_group: 'bg-warning-1',

                right  : [3, 4, 6, 8, 9, 10, 11, 12],
                center : [5, 7],
                extends: true,
                f_size : 12,

                // folding:true,
                extends: true,
                id: "tbCostsys",
            },

            methods: {send:(data)=>{


                if (data.mod.length) {


                    alert({
                        icon:'info',
                        title:'Algunos productos fueron modificados',
                        timer:1800
                    });

                    $('#updateListProductos').removeClass('disabled');


                }else{

                    $('#updateListProductos').addClass('disabled');

                }


            }}


        });

        // data_table_costsys('#tbCostsys', 120);


        // this.collapseTable('tbCostsys');
        this.getTablero();
    }

    collapseTable(idTable) {
        // Mostrar todos los elementos que contienen la clase 'unfold' dentro de la tabla con id 'myTable'
        $("[class*='unfold']").removeClass("d-none");

        // Asegurarse de que todos los iconos dentro de la tabla con id 'myTable' tengan la clase 'icon-down-dir-1' y no 'icon-right-dir-1'
        $("[class*='ico']")
            .removeClass("icon-right-dir-1")
            .addClass("icon-down-dir-1");
    }

    getTablero() {
        this.createTable({
            parent: "tbTablero",
            idFilterBar: "filterBar",

            data: {
                opc: "lsTablero",
            },

            conf: {
                datatable: false,
                beforeSend: false,
            },

            attr: {
                color_th: "bg-primary-1",
                class_table: "table table-bordered table-sm table-striped",
                right: [2, 3, 4],
            },
        });
    }

    // Tablero de control - botones

    buttonsCtrl() {
        const buttons = [
            {
                opc: "btn",
                class: "col-sm-3 col-6",
                text: "Crear ejercicio mensual",
                fn: "costsys.ejercicioMensual()",
            },
            {
                opc: "btn",
                class: "col-sm-3 col-6",
                color_btn: "info",
                text: "Precio Propuesto",
                fn: "costsys.preciosPropuestos()",
            },

            {
                opc: "btn",
                class: "col-sm-3 col-6",
                color_btn: "secondary",
                text: "Limpiar despl.",
                fn: "costsys.limpiarDesplazamientos()",
            },

            {
                opc: "btn",
                class: "col-sm-3 col-6",
                color_btn: "success",
                text: "Actualizar productos",
                fn: "costsys.actualizarProductosModificados()",
                disabled: "disabled",
            },
        ];

        $("#showFilter").content_json_form({ data: buttons, type: "" });
    }

    ejercicioMensual() {

        //
        let mes           = $("#Mes").val();
        let mes_siguiente = parseInt(mes) + 1;
        let anio          = $("#Anio").val();

        let month      = mes.padStart(2, "0");
        let month_next = mes_siguiente.toString().padStart(2, "0");

        let json = [
            {
                opc: "input-group",
                id: "fecha_inicio",
                lbl: "Copiar fecha de:",
                icon: "icon-calendar",
                value: `${anio}-${month}`,
                class: "col-lg-6 col-12",
            },

            {
                opc: "input-group",
                id: "fecha_final",
                lbl: "a la fecha de:",
                icon: "icon-calendar",
                value: `${anio}-${month_next}`,
                class: "col-lg-6 col-12",
            },

            {
                opc: "btn-submit",
                id: "btnSubmit",
                text: "Crear ejercicio",
                class: "col-12",
            },
        ];

        let modal = this.createModalForm({
            id: "modalEjercicioMensual",
            bootbox: { title: "Ejercicio mensual" },
            json: json,
            autovalidation: false,
            beforeSend: () => {
                let conf_picker = {
                    pattern: "yyyy-mm",
                    selectedYear: 2024,
                    startYear: 2022,
                    finalYear: 2026,
                };

                $("#fecha_inicio").monthpicker(conf_picker);
                $("#fecha_final").monthpicker(conf_picker);
            },
        });

        // acceso al backend.

        $("#modalEjercicioMensual").validation_form(
            {
                opc: "ejercicioMensual",
                tipo: "text",
                Clasificacion: $("#Clasificacion").val(),
            },
            (datos) => {
                let fechaInicio = $("#fecha_inicio").val();
                let fechaFinal = $("#fecha_final").val();

                let fi = $("#fecha_inicio").val().split("-");
                let ff = $("#fecha_final").val().split("-");

                if (fechaInicio != fechaFinal) {
                    let fechaCaptura = `${getNameMonth(parseInt(ff[1]))}-${ff[0]}`;

                    // this.swalQuestion({

                    //     opts: {
                    //         title: `¿Deseas crear el ejercicio mensual de  <span class="text-success">${fechaCaptura}</span> ?`,
                    //         html: `Ten en cuenta que se utilizarán los datos del mes de
                    //     <span class="text-primary fw-bold">${getNameMonth(parseInt(fi[1]))}-${fi[0]}</span> como base para este nuevo ejercicio.`

                    //     },

                    //     extends: true,

                    // }).then((result) => {

                    //     if (result.isConfirmed) {

                    fn_ajax(datos, this._link).then((data) => {
                        if (data.created) {
                            alert({
                                icon: "info",
                                title:
                                    "Ya existe un ejercicio mensual para el mes de " +
                                    fechaCaptura,
                                btn1: true,
                            });
                        } else {
                            alert({
                                // icon: 'info',
                                title: "Se creo el ejercicio mensual de " + fechaCaptura + ".",
                                timer: 3500,
                            });

                            $("#contentCostoPotencial").rpt_json_table2({
                                data: data,
                                color_col: [12, 13, 14],
                            });
                        }

                        modal.modal("hide");
                    });
                    //     }

                    // });
                } else {
                    alert({
                        icon: "warning",
                        title: "No puedes capturar el ejercicio mensual de la misma fecha.",
                        timer: 3000,
                    });
                }
            }
        );
    }

    limpiarDesplazamientos() {
        this.swalQuestion({
            opts: {
                title: "¿ Estas seguro de eliminar todos los desplazamientos ?",
            },

            extends: true,
        }).then((result) => {
            if (result.isConfirmed) {
                fn_ajax(
                    {
                        opc: "limpiarDesplazamiento",
                        UDN: $("#UDNs").val(),
                        Anio: $("#Anio").val(),
                        Mes: $("#Mes").val(),
                        Clasificacion: $("#Clasificacion").val(),
                    },
                    this._link
                ).then((data) => {
                    this.lsCostoPotencial();
                });
            }
        });
    }

    preciosPropuestos() {
        let preciosPropuestos = new modal_complements();

        preciosPropuestos._attr_modal = {
            title: "¿Que te gustaria hacer con los precios propuesto ?",
            confirmButtonText: "Limpiar Precio Prop.",
            denyButtonText: "Actualizar Precios Receta",
        };

        // // asignar metodo multiple questions y extender el swal.fire:
        let swalPrecio = preciosPropuestos.multipleQuestions({ extends: true });

        swalPrecio.then((result) => {
            // Realiza la accion de acuerdo a la respuesta del usuario :

            if (result.isConfirmed) {
                this.limpiarPreciosPropuestos();
            } else if (result.isDenied) {
                this.actualizarPreciosReceta();
            }
        });
    }

    limpiarPreciosPropuestos() {
        let dtx = {
            opc: "LimpiarPrecioPropuesto",
            UDN: $("#UDNs").val(),
            Anio: $("#Anio").val(),
            Mes: $("#Mes").val(),
            Clasificacion: $("#Clasificacion").val(),
        };

        fn_ajax(dtx, ctrl_costo_potencial, "#tbDatos").then((data) => {
            this.lsCostoPotencial();
        });
    }

    actualizarPreciosReceta() {

        var dtx = {
            opc: "actualizarPrecios",
            UDN: $("#UDNs").val(),
            Anio: $("#Anio").val(),
            Mes: $("#Mes").val(),
            Clasificacion: $("#Clasificacion").val(),
        };

        fn_ajax(dtx, this._link, "#contentCostoPotencial").then((data) => {

            // $("#contentCostoPotencial").rpt_json_table2({ data: data, extends: true, });
            this.getTablero();
            this.lsCostoPotencial();
        });
    }

    actualizarProductosModificados() {
        this.swalQuestion({
            opts: {
                title: "¿Deseas actualizar los productos modificados?",
            },
            data: {
                opc: "productosModificados",
                Mes: $("#Mes").val(),
                Anio: $("#Anio").val(),
                UDN: $("#UDNs").val(),
                Clasificacion: $("#Clasificacion").val(),
            },
            methods: {
                request: (data) => {

                    if(data.row){

                        alert({
                            icon:'info',
                            title:'Se ha modificado con exito.',
                            timer:1000
                        });

                        this.lsCostoPotencial();

                        // $('#contentCostoPotencial').rpt_json_table2({

                        //     data    : data,
                        //     color_th: 'bg-secondary',
                        //     extends : true
                        // });

                    }   else{
                        $('#contentCostoPotencial').empty_state();
                    }



                },
            },
        });
    }

    // eventos inputs.
    precioPropuesto(idRow, event) {
        let tr = $(event.target).closest("tr");
        let receta = tr.find("td").eq(0).text();

        let json_precio = [
            {
                opc: "input-group",
                id: "precio_propuesto",
                lbl: "Precio Propuesto",
                tipo: "text",
                icon: "icon-dollar",
                placeholder: "0.00",
                align: "left",
                required: false,
                value: tr.find("td").eq(1).text(),
            },
        ];

        this.createModalForm({
            id: "modalPpropuesto",

            bootbox: { title: receta },
            json: json_precio,
            autovalidation: true,
            data: { opc: "iptPrecioPropuesto", idcostopotencial: idRow },

            success: (data) => {
                // Cambios en la tabla .
                tr.find("td").eq(1).text($("#precio_propuesto").val());
                tr.find("td").eq(1).addClass("bg-warning-1");

                // // Precio de venta sin iva
                tr.find("td").eq(3).text(evaluar(data.pVentaIva));
                tr.find("td").eq(3).removeClass("bg-warning-1");
                tr.find("td").eq(3).addClass("bg-warning-1 fw-bold");

                // Costo % :

                tr.find("td").eq(5).text(data.costo_porc.toFixed(2));
                tr.find("td").eq(5).addClass("fw-bold");

                // mc:

                tr.find("td").eq(6).text(data.mc.toFixed(2));
                tr.find("td").eq(6).addClass("fw-bold");

                // Ventas estimas :
                tr.find("td").eq(8).text(evaluar(data.ventasEstimadas));
                tr.find("td").eq(8).removeClass("bg-warning-1");
                tr.find("td").eq(8).addClass("bg-warning-1 fw-bold");

                // Costo Estimado :

                tr.find("td").eq(9).text(evaluar(data.costoEstimado));
                tr.find("td").eq(9).removeClass("bg-warning-1");
                tr.find("td").eq(9).addClass("bg-warning-1 fw-bold");

                // MC Estimado :

                tr.find("td").eq(10).text(evaluar(data.mcEstimado));
                tr.find("td").eq(10).removeClass("bg-warning-1");
                tr.find("td").eq(10).addClass("bg-warning-1 fw-bold");

                // cerramos modal
                // mdl.modal('hide');
                this.getTablero();
            },
        });

        // focus.
        setTimeout(function () {
            $("#precio_propuesto").focus();
        }, 600);
    }

    desplazamiento(idRow, event) {

        let tr = $(event.target).closest("tr");
        let receta = tr.find("td").eq(0).text();

        let jsonDesplazamiento = [
            {
                opc: "input-group",
                id: "desplazamiento",
                lbl: "Modificar desplazamiento",
                tipo: "text",
                required:false,
                value: tr.find("td").eq(7).text(),
            },
        ];


        // Crear Formulario de desplazamiento.


        this.createModalForm({
            id: 'modalDesplazamiento',

            bootbox       : { title: receta },
            json          : jsonDesplazamiento,
            autovalidation: true,
            data          : { opc: 'iptDesplazamiento', idcostopotencial: idRow },

            success: (data) => {

                // actualizar desplazamiento
                tr.find("td").eq(7).text(data.despl);
                tr.find("td").eq(7).removeClass("bg-danger-light");
                tr.find("td").eq(7).addClass("fw-bold");

                // Ventas estimas :
                tr.find("td").eq(8).text(evaluar(data.ventasEstimadas));
                // tr.find("td").eq(8).removeClass("bg-warning-1");
                tr.find("td").eq(8).addClass("fw-bold");

                // Costo Estimado :

                tr.find("td").eq(9).text(evaluar(data.costoEstimado));
                // tr.find("td").eq(9).removeClass("bg-warning-1");
                tr.find("td").eq(9).addClass("fw-bold");

                // MC Estimado :

                tr.find("td").eq(10).text(evaluar(data.mcEstimado));
                // tr.find("td").eq(10).removeClass("bg-warning-1");
                tr.find("td").eq(10).addClass("fw-bold");

                // this.getTablero();
             }
        });


        // focus.
        setTimeout(function () { $("#desplazamiento").focus(); }, 500);


    }

    lsTablero() {
        this.createTable({
            parent: "tbTablero",
            idFilterBar: "filterBar",
            data: {
                opc: "lsTablero",
                UDN: $("#UDNs").val(),
                Anio: $("#Anio").val(),
                Mes: $("#Mes").val(),
                Clasificacion: $("#Clasificacion").val(),
            },

            conf: {
                datatable: false,
                beforeSend: false,
                fn_datatable: "data_table_export",
            },

            attr: {

                color_th: "bg-default",
                right: [2, 3, 4],
                id: "tbTableroCollapse",
                // class: 'table table-bordered table-hover collapse',
            },

            extends: false,
        });

        // this.data_table = {
        //     opc: 'lsTablero',
        //     UDN: $("#UDNs").val(),
        //     Anio: $("#Anio").val(),
        //     Mes: $("#Mes").val(),
        //     Clasificacion: $("#Clasificacion").val(),
        // };

        // this.opts_table = {
        //     id: 'tbTablero',
        //     datatable: false,
        // };
        // this.attr_table = {
        //     color_th: 'bg-default',
        //     right: [2, 3, 4],
        //     id: 'tbTableroCollapse',
        //     // class: 'table table-bordered table-hover collapse',
        // };

        // this.lsTable();
    }
}

class modal_complements {
    _attr_modal = {};

    set attr_modal(value) {
        this._attr_modal = value;
    }

    multipleQuestions(options = {}) {
        var defaults = {
            fnConfirm: "",
            fnDeny: "",
            extends: false,
        };

        var opts = Object.assign(defaults, options);

        var atributos_modal = {
            title: "¿Que te gustaria hacer con los precios propuesto ?",

            showDenyButton: true,
            showCancelButton: true,

            confirmButtonText: "Actualizar",
            denyButtonText: "Eliminar costo Potencial",
            cancelButtonText: "Cancelar",
            // confirmButtonColor: "#66A997",
            denyButtonColor: "#003360",
            // cancelButtonColor: "#F44336",
        };

        var atributos_mdl = Object.assign(atributos_modal, this._attr_modal);

        let extends_swal = Swal.fire(atributos_mdl);

        if (opts.extends) {
            return extends_swal;
        } else {
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

//    -- Complementos  --

function evaluar(valor) {
    return valor ? "$ " + valor.toFixed(2) : "-";
}

function data_table_costsys(idTable) {
    $(idTable).DataTable({
        dom: "Bfrtip",



        language: {
            url: "../src/plugin/datatables/spanish.json",
        },
        responsive: false,
        ordering: false,
        paging: false,
        // scrollY: "550px",
        scrollX: true,
        scrollCollapse: true,
        fixedColumns: true,
    });
}

function lsBuscarFiltros() {
    lsClasificacion();
    lsSubClasificacion();
    // costsys.lsCostoPotencial();
}

function lsClasificacion() {
    let clasificacion = data_clasificacion.filter(
        (json) => json.udn === $("#UDNs").val()
    );
    $("#Clasificacion").option_select({ data: clasificacion });
}

function lsSubClasificacion() {
    let sub = [];

    sub.unshift({
        id: 0,
        valor: "-- Todos --",
        idClasificacion: 0,
    });

    const filterData = data_subclasificacion.filter(
        (json) => json.idClasificacion === $("#Clasificacion").val()
    );

    sub.push(...filterData);

    $("#Subclasificacion").option_select({ data: sub });
    costsys.lsCostoPotencial();
}
