class TableroControl extends CostSys {

    lsTableroControl() {

        this.createTable({

            parent: 'tab-tablero-control',
            idFilterBar:'filterBar',

            data: {
                opc: "lsTableroControl",
            },

            conf: {
                datatable:false,
        
            },

            attr: {
                     
                        f_size: "16",
                        right: [2, 3, 4],
                        color_group: 'bg-disabled3'
            },

            extends: false




        });

        // this._dataSearchTable = {
        //     tipo: "text",
        //     opc: "lsTableroControl",
        //     UDN: $("#UDNs").val(),
        //     Anio: $("#Anio").val(),
        //     Mes: $("#Mes").val(),
        //     Clasificacion: $("#Clasificacion").val(),

        // };

        // var ajax = this.searchTable({ id: "tab-tablero-control", extends: true });

        // ajax.then((data) => {

        //     $("#tab-tablero-control").rpt_json_table2({

        //         data: data,
        //         f_size: "16",
        //         right: [2, 3, 4],
        //         color_group: 'bg-disabled3'

        //     });
        // });

    }

    setTablero(e) {

        let sendCosto = {

            opc: 'setTablero',
            ventascosto: $('#ventasCosto').val(),
            ventasoficial: $('#costoOficial').val(),
            idTablero: e.getAttribute('idtablero')

        };

        fn_ajax(sendCosto, this._link).then((data) => {
            $('#diferencia_costo_ventas').html(data.diferenciaVentasCostos);
            $('#diferencia_costo_oficial').html(data.diferenciaVentasOficial);
        })

    }

    setCostoTablero(e) {


        this.fnAjax({

            idFilterBar: 'filterBar', // indica la filterBar

            data:{
                opc: 'setCostoTablero',
                idTablero: e.getAttribute('idtablero'),
                ipt: e.name,
                valor: e.value

            },
            methods:{
                request:(data)=>{
                }

            }

        });




    }

    setMargenContribucion(e){

        this.fnAjax({

            idFilterBar: 'filterBar', // indica la filterBar

            data: {
                opc      : 'setMargenContribucion',
                idTablero: e.getAttribute('idtablero'),
                ipt      : e.name,
                valor    : e.value

            },
            methods: {
                success: (data) => {
                    console.log('#propuesta_' + e.name);

                    $('#propuesta_'+e.name).html(data.count);
                    $('#diferencia_'+e.name).html(data.porcentaje);

                   
                }

            }

        });

    }








    fnAjax(options) {

        let defaults = {

            idFilterBar: 'filter',

            data: {
                tipo: 'text',
                opc: 'frm-data',
            },

            methods:''




        };

        const settings = this.ObjectMerge(defaults, options);

        // console.warn(settings.data);


        $("#" + settings.idFilterBar).validar_contenedor(settings.data, (datos) => {
          
            fn_ajax(datos, this._link).then((data) => {


                if (settings.methods) {
                    // Obtener las llaves de los métodos
                    let methodKeys = Object.keys(settings.methods);
                    methodKeys.forEach((key) => {
                        const method = settings.methods[key];
                        method(data);
                    });

                }




            });

        });
    }

}




