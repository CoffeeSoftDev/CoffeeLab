// init vars.
let app, template, baja, rotation;

let udn, periodo;

let api          = "ctrl/ctrl-rotacion-de-personal.php";
let api_template = "ctrl/ctrl-rotacion-plantilla.php";
let api_baja     = "ctrl/ctrl-rotacion-bajas.php";

$(async () => {

    const init    = await useFetch({ url: api, data: { opc: "init" } });
    // vars
          udn     = init.udn || [];
          periodo = init.periodo || [];

    // instancias.
    app      = new App(api, 'root');
    rotation = new Rotacion(api, 'root');
    template = new Plantilla(api_template, 'root');
    baja     = new Bajas(api_baja, 'root');

    app.init();
    template.init();
    baja.init();

});


class App extends Templates {
    constructor(link, divModulo) {
        super(link, divModulo);
        this.PROJECT_NAME = "Rotacion";
    }

    init() {

        this.render();
    }

    render() {

        this.layout();
        this.createFilterBar();
        this.ls();

    }

    layout() {
        this.tabLayout({
            parent: "root",
            json: [
                { id: "rotacion", tab: "Porcentaje de Rotación", icon: "", active: true, onClick: () => this.initRotacion() },
                { id: "plantilla", tab: "Porcentaje de Plantilla", icon: "", },
                { id: "bajas", tab: "Concentrado de Bajas", icon: "" },
            ]
        });

        this.primaryLayout({
            parent: "container-rotacion",
            id: this.PROJECT_NAME,
            class: "mx-2 my-2",
            card: {
                filterBar: { class: "w-full mb-3 line", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full ", id: "container" + this.PROJECT_NAME },
            },
        });
    
    }

  
    createFilterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            data: [
                {
                    opc: "select",
                    id: "id",
                    lbl: "Seleccionar periodo",
                    class: "col-12 col-md-3",
                    data: periodo,
                },

                {
                    opc: "select",
                    id: "concentrado",
                    lbl: "Tipo de reporte",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "General", valor: "General" },
                        { id: "Detallado", valor: "Detallado" },
                    ],
                    onchange: 'app.ls()'
                },
                {
                    opc: "button",
                    id: "btnNuevaRotacion",
                    text: "+ Nueva rotación mensual",
                    class: "col-12 col-md-3",
                    className: "w-100",
                    onClick: () => this.addNewRotacion(),
                },
            ],
        });


    }

    // Rotation:
    layoutNewRotation() {

        $("#root").html(`
            <div class="flex justify-between items-center mb-4">
                <button id="btnRegresar" class="btn btn-outline-primary" >
                    <i class="icon-left"></i> Regresar
                </button>
                <div class="text-xl font-semibold">NUEVA ROTACIÓN</div>
                <div class="text-base font-medium"></div>
            </div>
            <div id="rotacionModulo" class="mb-2 p-3 border rounded-lg"></div>
            <div id="plantillaRotacion" class="mb-2 p-3 border rounded-lg "></div>
            <div id="plantillaBaja" class=" p-3 border rounded-lg "></div>
        `);

        // Evento click para el botón regresar
        $("#btnRegresar").on("click", function () {
            app.layout();
        });

        this.newRotation();


    }

    addNewRotacion() {
        const mes = moment().format('MMMM').toUpperCase();
        const anio = moment().format('YYYY');

        this.swalQuestion({
            opts: {
                title: "📅 NUEVA ROTACIÓN MENSUAL",
                html: `<p class='text-[18px] text-center font-bold'>¿Desea crear la rotación mensual correspondiente al mes de <span class='text-blue-600'>${mes} - ${anio}</span>?</p>
                       <p class='text-[14px] text-gray-400 mt-3'>Al confirmar se crearán los siguientes módulos:</p>
                       <ul class='text-gray-400 text-sm mt-1 text-left ml-4 list-disc'>
                          <li>porcentaje de rotación</li>
                          <li>porcentaje de plantilla</li>
                          <li>concentrado de bajas</li>
                       </ul>`,
                icon: "info"
            },
            data: {
                opc: 'addNewRotacion',
                month: mes,
                year: anio
            },
            methods: {
                request: (data) => {
                    this.layoutNewRotation();
                }
            }
        });
    }
  
    async newRotation() {

        const request = await useFetch({
            url: api,
            data: {
                opc: "addNewRotacion",
            }
        });


        // Crea la tabla de rotación
        this.createCoffeTable({
            parent: "rotacionModulo",
            title: "Rotación Mensual",
            data: request.data.editRotation,
            conf: {
                datatable: false,
                pag: 10
            },

            right: [2, 3, 4, 5, 6],

            attr: {
                class: "table-auto w-full",
                id: "tabla-rotacion-mensual",
                extends: true
            }
        })

        // Crea la tabla de rotación
        this.createCoffeTable({
            parent: "plantillaRotacion",
            title: "Plantilla Rotación",
            data: request.data.editTemplate,
            conf: {
                datatable: false,
                pag: 10
            },
            attr: {
                class: "table-auto w-full",
                id: "tabla-rotacion-mensual",
                right: [2, 3, 4, 5, 6],
                extends: true
            }
        })

        // Crea la tabla de rotación
        this.createCoffeTable({
            parent: "plantillaBaja",
            title: "Plantilla Rotación",
            data: request.data.editRotation,
            conf: {
                datatable: false,
                pag: 10
            },
            attr: {
                class: "table-auto w-full",
                id: "tabla-rotacion-mensual",
                right: [2, 3, 4, 5, 6],
                extends: true
            }
        })


    }

    async editRotation(input) {
        const id = input.dataset.id;
        const field = input.dataset.field;
        const value = input.value;

        if (!id || !field) {
            alert({ icon: "error", text: "Identificador o campo inválido." });
            return;
        }

        input.disabled = true;
        input.classList.remove("border-green-500", "border-red-500");

        let request = await useFetch({
            url: api,
            data: {
                opc: "editRotationField",
                id: id,
                field: field,
                value: value,
            },
        });

    }

    ls() {

        // Obtén el texto seleccionado del select
        const udnText = $("#filterBarRotacion #id option:selected").text();


        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: {
                opc: "list",
            },
            coffeesoft: true,
            conf: {
                datatable: false,
                pag: 10,
            },
            attr: {
                id: "tb" + this.PROJECT_NAME,
                theme: "corporativo",
                title: `Rotación de Personal${udnText ? " - " + udnText : ""}`,

                extends: true,
                striped: false,
                center: [2, 3, 4, 5, 6],
            },
        });
    }





}

class Plantilla extends Templates {
    constructor(link, divModulo) {
        super(link, divModulo);
        this.PROJECT_NAME = "Templates";
    }

    init() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: "container-plantilla",
            id: "_" + this.PROJECT_NAME,
            class: "mx-2 my-2",
            card: {
                filterBar: { class: "w-full line", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full ", id: "container" + this.PROJECT_NAME },
            },
        });

        this.createFilterBar();
        this.ls();
    }

    createFilterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            data: [
                {
                    opc: "select",
                    id: "periodo" + this.PROJECT_NAME,
                    lbl: "Seleccionar periodo",
                    class: "col-12 col-md-3",
                    data: periodo,
                    onchange: "template.ls()",
                },
                {
                    opc: "select",
                    id: "concentrado" + this.PROJECT_NAME,
                    lbl: "Concentrado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "General", valor: "General" },
                        { id: "Detallada", valor: "Detallada" },
                    ],
                    onchange: "template.ls()",
                },
            ],
        });
    }

    ls() {
        const typeConcentrado = $("#concentrado" + this.PROJECT_NAME).val();
        const fnScrollX = typeConcentrado == "Detallada" ? { fn_datatable: "scrollX" } : {};

        // Llama a la API, recibe el tipo correcto de tabla
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: {
                opc: "list",
            },
            // coffeesoft: true,
            conf: {
                datatable: true,
                pag: 10,
                ...fnScrollX,
            },
            attr: {
                title: `INFORMACIÓN ${typeConcentrado.toUpperCase()} DEL PORCENTAJE DE PLANTILLA.`,
                id: "tb" + this.PROJECT_NAME,
                extends: true,
                theme: "corporativo",
                color_th: "bg-primary",
            },
        });
    }
}

class Bajas extends Templates {
    constructor(link, divModulo) {
        super(link, divModulo);
        this.PROJECT_NAME = "Bajas";
    }

    init() {
        this.layoutBajas();
    }

    layoutBajas() {
        this.primaryLayout({
            parent: "container-bajas",
            id: this.PROJECT_NAME,
            class: "mx-2 my-2",
            card: {
                filterBar: { class: "w-full line my-2 p-2", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full bg-[#FAFCFF] p-2", id: "container" + this.PROJECT_NAME },
            },
        });

        this.createFilterBar();
        this.ls();
    }

    createFilterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            data: [
                {
                    opc: "select",
                    id: "periodo" + this.PROJECT_NAME,
                    lbl: "Seleccionar periodo",
                    class: "col-12 col-md-3",
                    data: periodo,
                    onchange: "baja.ls()",
                },
                {
                    opc: "select",
                    id: "udn" + this.PROJECT_NAME,
                    lbl: "Seleccionar UDN",
                    class: "col-12 col-md-3",
                    data: udn,
                    onchange: "baja.ls()",
                },
            ],
        });
    }

    exportIMG() {
        const node = document.getElementById("container" + this.PROJECT_NAME);

        domtoimage
            .toPng(node)
            .then(function (dataUrl) {
                const link = document.createElement("a");
                link.download = "concentrado-de-bajas.jpeg";
                link.href = dataUrl;
                link.click();
            })
            .catch(function (error) {
                console.error("Error al exportar:", error);
            });
    }

    renderBtnExport() {
        const udnSelected = $("#udnBajas").val();
        const $btnExport = $("#divExport");
        const $filterBar = $(`#filterBar${this.PROJECT_NAME} > #idFilterBar`);

        if (udnSelected !== "0") {
            if (!$btnExport.length && $filterBar.length) {
                $filterBar.append(
                    `<div class="col-12 col-md-3" id="divExport">
                        <button class="mt-4 col-12 btn btn-primary" id="exportBajas" type="button" onClick="baja.exportIMG()"> <i class="icon-picture"></i> Exportar imagen </button>
                    </div>`
                );
            }
        } else $btnExport.remove();
    }

    ls() {
        this.renderBtnExport();

        // Llama a la API, recibe el tipo correcto de tabla
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: {
                opc: "list",
            },
            coffeesoft: true,
            conf: {
                datatable: false,
                pag: 10,
            },
            attr: {
                title: "CONCENTRADO DE BAJAS",
                subtitle: `Información de ${$(`#udn${this.PROJECT_NAME} option:selected`).text().toLowerCase()} del mes de ${$(`#periodo${this.PROJECT_NAME} option:selected`).text()}`,
                id: "tb" + this.PROJECT_NAME,
                extends: true,
                theme: "corporativo",
                // border_table:"",
                border_row: "px-2 py-2"
            },
        });
    }
}






