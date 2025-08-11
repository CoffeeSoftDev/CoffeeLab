
// init vars.
let app, sub;
let api = "https://erp-varoch.com/DEV/capital-humano/ctrl/ctrl-rotacion-de-personal.php";
let api2 = "https://erp-varoch.com/ERP24/produccion/control-fogaza/ctrl/ctrl-pedidos.php";

$(async () => {
    // instancias.
    app = new App(api2, 'root');
    app.init();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";
    }

    init() {
        this.render();
    }


    render(options) {
        // this.viewLayout();
        // this.filterBar();
        // this.ls()
        this.editProduct(243)
    }

    addProduct() {
        const modal = bootbox.dialog({
            closeButton: true,
            title: 'Agregar pedido',
            message: `<div><form id="formAddItems" novalidate></form></div>`
        });

        this.createForm({
            id: 'formAddItems',
            parent: 'formAddItems',
            autovalidation: false,
            data: [],

            json: [
                { opc: 'radio', name: 'tipo', value: 1, text: 'Normal', onchange: 'pos.onShowPedidos()', class: 'col-sm-6 col-12 mb3-3', },
                { opc: 'radio', name: 'tipo', value: 2, text: 'Personalizado', onchange: 'pos.onShowPedidos({ hide:false })', class: 'col-sm-6 col-12 mb-3', checked: true },

                ... this.jsonProduct(),
                {
                    opc: 'div',
                    id: 'image',
                    lbl: 'Fotos del producto',
                    class: 'col-12 mt-2',
                    html: `
                        <div class="col-12 mb-2">
                            <div class="w-full p-2 border-2 border-dashed border-gray-500 rounded-xl text-center">
                            <input
                                type="file"
                                id="archivos"
                                name="archivos"
                                class="hidden"
                                multiple
                                accept="image/*"
                                onchange="app.previewSelectedImages(this, 'previewImagenes')"
                            >
                            <div class="flex flex-col items-center justify-center py-2 cursor-pointer" onclick="document.getElementById('archivos').click()">
                                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                                <i class="icon-upload text-white"></i>
                                </div>
                                <p class="text-xs">
                                Drag & Drop or <span class="text-blue-400 underline">choose file</span>
                                </p>
                                <p class="text-[10px] text-gray-400 mt-1">JPEG, PNG</p>
                            </div>
                            <div id="previewImagenes" class="flex gap-2 flex-wrap mt-1"></div>
                            </div>
                        </div>
                    `
                },

                {
                    opc: 'button',
                    id: 'btnModalPedido',
                    className: 'w-100 p-2',
                    class: 'col-12',
                    text: 'Agregar pedido',
                    onClick: () => {
                        const form = document.getElementById('formAddItems');
                        const formData = new FormData(form);

                        formData.append('opc', 'addItem');
                        formData.append('id_producto', 401);
                        formData.append('idFolio',94);

                        const files = document.getElementById('archivos').files;
                        for (let i = 0; i < files.length; i++) formData.append('archivos[]', files[i]);


                        console.log(...formData);

                        fetch(this._link, {
                            method: 'POST', // Método HTTP
                            body: formData, // FormData como cuerpo de la solicitud

                        }).then(response => { }).then(data => {
                            // pos.cardTicket();
                            // modal.modal('hide');
                        })



                    }

                }
            ],

            success: (resp) => {
                // si tu ctrl regresa status/mensaje, puedes validar aquí
                pos.cardTicket();
                modal.modal('hide');
            }
        });

        this.onShowPedidos({
            positions: [3, 4, 6, 7, 8]
        });
    }

    async editProduct(id){

        let request = await useFetch({
            url: this._link,
            data: {
                opc: "getTicket",
                idFolio: 95,
                id_producto: id
            },
        });


        const modal = bootbox.dialog({
            closeButton: true,
            title: 'Agregar pedido',
            message: `<div><form id="formAddItems" novalidate></form></div>`
        });

        this.createForm({
          id: "formAddItems",
          parent: "formAddItems",
          autofill: request.data,
          autovalidation: false,
          data: [],

          json: [
            ...this.jsonProduct(),

            {
              opc: "div",
              id: "image",
              lbl: "Fotos del producto ( Máximo 3 fotos )",
              class: "col-12 mt-2",
              html: `
                        <div class="col-12 mb-2">
                            <div class="w-full p-2 border-2 border-dashed border-gray-500 rounded-xl text-center">
                            <input
                                type="file"
                                id="archivos"
                                name="archivos"
                                class="hidden"
                                multiple
                                accept="image/*"
                                onchange="app.previewSelectedImages(this, 'previewImagenes')"
                            >
                            <div class="flex flex-col items-center justify-center py-2 cursor-pointer" onclick="document.getElementById('archivos').click()">
                                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                                <i class="icon-upload text-white"></i>
                                </div>
                                <p class="text-xs">
                                Drag & Drop or <span class="text-blue-400 underline">choose file</span>
                                </p>
                                <p class="text-[10px] text-gray-400 mt-1">JPEG, PNG</p>
                            </div>
                            <div id="previewImagenes" class="flex gap-2 flex-wrap mt-1"></div>
                            </div>
                        </div>
                    `,
            },

            {
              opc: "button",
              id: "btnModalPedido",
              className: "w-100 p-2",
              class: "col-12",
              text: "Actualizar pedido",
              onClick: () => {
                const form = document.getElementById("formAddItems");
                const formData = new FormData(form);

                formData.append("opc", "updateItem");
                formData.append("id", id);
                formData.append("idFolio", 95);

                  const files = document.getElementById('archivos').files;
                  for (let i = 0; i < files.length; i++) formData.append('archivos[]', files[i]);



                fetch(this._link, {
                  method: "POST", // Método HTTP
                  body: formData, // FormData como cuerpo de la solicitud
                })
                  .then((response) => {})
                  .then((data) => {
                    // pos.cardTicket();
                    // modal.modal('hide');
                  });
              },
            },
          ],

          success: (resp) => {
            // si tu ctrl regresa status/mensaje, puedes validar aquí
            pos.cardTicket();
            modal.modal("hide");
          },
        });

        this.renderImages(request.orderImages,'previewImagenes')





    }

    onShowPedidos(options) {
        let defaults = {
            parent: 'formAddItems',
            hide: true,         // Indica si ocultar o mostrar los divs
            positions: [3, 4, 6, 7, 8]     // Array con las posiciones de los divs a ocultar
        };

        let opts = Object.assign(defaults, options);
        const form = document.getElementById(opts.parent);
        if (!form) {
            console.warn(`El formulario con ID "${opts.parent}" no existe.`);
            return;
        }

        const allDivs = form.querySelectorAll('.row > div'); // Seleccionar todos los divs directos dentro del formulario

        allDivs.forEach((div, index) => {
            // Si la posición del div está en el array `positions`, se aplica el estilo
            if (opts.positions.includes(index)) {
                div.style.display = opts.hide ? 'none' : '';
            } else {
                div.style.display = ''; // Por defecto, mostrar
            }
        });
    }

    jsonProduct(){
        return [


            { opc: 'input-group', lbl: 'Precio', id: 'costo', class: 'col-12 mb-2', placeholder: '0.00', required: false, icon: 'icon-dollar', tipo: 'cifra' },
            { opc: 'input-group', lbl: 'Importe base', id: 'importeBase', class: 'col-6 mb-2', tipo: 'cifra', icon: 'icon-dollar', required: false },
            { opc: 'input-group', lbl: 'Importe Oblea', id: 'importeOblea', class: 'col-6', tipo: 'cifra', icon: 'icon-dollar', required: false },

            { opc: 'input', lbl: 'Leyenda', id: 'leyenda', class: 'col-6' },
            { opc: 'input', lbl: 'Relleno', id: 'relleno', class: 'col-6', required: false },
            { opc: 'textarea', lbl: 'Observaciones', id: 'observaciones', class: 'col-12' },

        ];
    }





    addProducts() {

        // let idCard = event.currentTarget;
        // let title = idCard.querySelectorAll("label")[0];
        // let costo = event.currentTarget.getAttribute('costo');
        // let idPedido = idCard.getAttribute('id');


        // crear modal.

        let modal = bootbox.dialog({
            // title: ' BASE :   <span class="text-primary">  ' + title.textContent + '   </span>',
            closeButton: true,
            message: `<form class="" id="addItems"  novalidate></form> `,
        });


        // add formulario.

        $('#addItems').content_json_form({
            type: '',
            data: [
                {
                    opc: 'radio',
                    name: 'tipo',
                    value: 1,
                    text: 'Normal',
                    onchange: 'pos.onShowPedidos()',
                    class: 'col-sm-6 col-12 mb3-3',
                    checked: true
                },
                {
                    opc: 'radio',
                    name: 'tipo',
                    value: 2,
                    onchange: 'pos.onShowPedidos({ hide:false })',
                    text: 'Personalizado',
                    class: 'col-sm-6 col-12 mb-3',
                    checked: false
                },
                {
                    opc: 'input-group',
                    lbl: 'Precio',
                    id: 'costo',
                    class: 'col-12 mb-2',
                    placeholder: '0.00',
                    required: false,
                    icon: 'icon-dollar',
                    // value: costo,
                    tipo: 'cifra'
                },

                {
                    opc: 'input-group',
                    lbl: 'Importe base',
                    id: 'importeBase',
                    class: 'col-6 mb-2',
                    tipo: 'cifra',
                    icon: 'icon-dollar',
                    required: false
                },

                {
                    opc: 'input-group',
                    lbl: 'Importe Oblea',
                    id: 'importeOblea',
                    class: 'col-6 ',
                    tipo: 'cifra',
                    icon: 'icon-dollar',
                    required: false
                },


                {
                    opc: 'input',
                    lbl: 'Leyenda',
                    id: 'leyenda',
                    class: 'col-6'
                },
                {
                    opc: 'input',
                    lbl: 'Relleno',
                    id: 'relleno',
                    class: 'col-6',
                    required: false
                },
                {
                    opc: 'textarea',
                    lbl: 'Observaciones',
                    id: 'observaciones',
                    class: 'col-12'
                },


                {
                    opc: "div",
                    id: "image",
                    lbl: "Fotos del producto",
                    class: "col-12 mt-2",
                    html: `
                    <div class="col-12 mb-2">
                        <div class="w-full p-2 border-2 border-dashed border-gray-500 rounded-xl text-center">
                            <input
                                type="file"
                                id="archivos"
                                class="hidden"
                                multiple
                                accept="image/*"
                                onchange="app.previewSelectedImages(this, 'previewImagenes')"
                            >
                            <div class="flex flex-col items-center justify-center py-3 cursor-pointer" onclick="document.getElementById('archivos').click()">
                                <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                                    <i class="icon-upload text-white "></i>
                                </div>
                                <p class=" text-sm">
                                    Drag & Drop or <span class="text-blue-400 underline">choose file</span> to upload
                                </p>
                                <p class="text-xs text-gray-400 mt-1">Supported formats: JPEG, PNG</p>
                            </div>
                            <div id="previewImagenes" class="flex gap-2 flex-wrap mt-1"></div>
                        </div>
                    </div>
                    `
                },
                {
                    opc: 'button',
                    id: 'btnModalPedido',
                    className: 'w-100 p-2',
                    class: 'col-12',
                    text: 'Agregar pedido',
                    onClick: () => {
                        const form = document.getElementById('addItems');
                        let formData = new FormData(form);

                        console.log("formData", ...formData);

                        formData.append('opc', 'addItem');
                        formData.append('id_producto', idPedido);
                        formData.append('idFolio', $('#NoFolio').val());

                        fetch(this._link, {
                            method: 'POST', // Método HTTP
                            body: formData, // FormData como cuerpo de la solicitud

                        }).then(response => { }).then(data => {
                            pos.cardTicket();
                            modal.modal('hide');
                        })
                    }

                }

            ]
        });



    }

    renderImages(images, previewId) {
        const previewContainer = document.getElementById(previewId);
        previewContainer.innerHTML = ""; // Limpia primero

        const urlBase = 'https://erp-varoch.com/';

        images.forEach(imgData => {
            const img = document.createElement("img");
            img.src = urlBase+imgData.path; // Usamos el path tal cual
            img.alt = imgData.original_name || "Imagen del producto";
            img.classList.add("w-20", "h-20", "object-cover", "rounded", "border");
            previewContainer.appendChild(img);
        });
    }

    previewSelectedImages(input, previewId) {
        const previewContainer = document.getElementById(previewId);
        previewContainer.innerHTML = "";
        Array.from(input.files).forEach(file => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.classList.add("w-20", "h-20", "object-cover", "rounded","border");
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            card: {
                filterBar: {
                    class: "line",
                    id: "filterBar" + this.PROJECT_NAME,
                },
                container: {
                    id: "container" + this.PROJECT_NAME,
                    class:''
                },
            },
        });

        // this.addModifier()
    }

    // Rotation.
    layoutNewRotation(request) {
        const data = request.data;

        $("#root").html(`
            <div class="flex flex-col ">
                <div class="grid grid-cols-3 items-center gap-4 px-4 pb-4 pt-6">
                    <!-- Columna 1: Botones -->
                    <div class="flex gap-2">
                        <button id="btnRegresar"
                            class="inline-flex items-center gap-2 px-5 py-2 border border-blue-600 bg-white text-blue-600 font-semibold rounded-lg transition hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200">
                            <i class="icon-left text-lg"></i>
                            <span>Regresar</span>
                        </button>
                        <button id="btnGuardarRotation"
                            class="inline-flex items-center gap-2 px-5 py-2 border border-green-400 bg-white text-green-600 font-semibold rounded-lg transition hover:bg-green-50 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-200">
                            <i class="icon-save text-lg"></i>
                            <span>Guardar</span>
                        </button>
                    </div>
                    <!-- Columna 2: Título Centrado -->
                    <div class="flex flex-col items-center">
                        <h2 class="text-2xl md:text-3xl font-bold text-gray-700 tracking-wide text-center">
                            Rotación de Personal
                        </h2>
                        <p>Gestión y análisis de rotación mensual</p>
                    </div>
                    <!-- Columna 3: Info derecha -->
                    <div class="flex flex-col items-end">
                        <span class="text-xl font-semibold text-gray-800">${request.period.name}</span>
                        <span class="text-base font-medium text-gray-600"># 00${request.period.id}</span>
                    </div>
                </div>
            </div>

            <div id="rotacionModulo" class="mb-2 p-3 border rounded-lg bg-white"></div>
            <div id="plantillaRotacion" class="mb-2 p-3 border rounded-lg bg-white"></div>
            <div id="plantillaBaja" class="p-3 border rounded-lg bg-white"></div>
        `);

        $("#btnRegresar").on("click", () => {
            app.layout();
        });

        $("#btnGuardarRotation").on("click", () => {
            this.saveRotationTemplate(request.period.id);
        });

        this.newRotation(data);
    }


    async viewLayout() {
        const mes = moment().format('MMMM').toUpperCase();
        const anio = moment().format('YYYY');

        let request = await useFetch({
            url: api,
            data: {
                opc: "getRotation",
                month: mes,
                year: anio
            },
        });

        this.layoutNewRotation(request)

    }

    newRotation(data) {
        this.createCoffeTable({
            parent: "rotacionModulo",
            title: "Rotación Mensual",
            subtitle:'EPM (Empleados Por Mes): Promedio de empleados por mes.',

            data: data.editRotation,
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
            data: data.editTemplate,
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
            title: "Causas de Bajas - " + data.periodo,
            data: data.lsDismissal,
            conf: {
                datatable: false,
                pag: 10
            },
            attr: {
                id: "tabla-rotacion-mensual",
                right: [2, 3, 4, 5, 6],
                border_row: "px-2 py-2",
                extends: true
            }
        })
    }

    saveRotationTemplate(id) {

        this.swalQuestion({
            opts: {
                title: "¿Deseas guardar la plantilla de rotación?",
                text: "Esta acción almacenará la plantilla actual para futuras rotaciones.",
                icon: "question",
            },
            data: {
                opc: 'updateRotation',
                status: 2,
                id: id
            },
            methods: {
                send:  () => {

                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            title: "Guardado exitoso",
                            text: response.message || "La plantilla se guardó correctamente.",
                            btn1: true,
                            btn1Text: "Aceptar"
                        });

                        app.render();

                    } else {
                        alert({
                            icon: "error",
                            title: "Ocurrió un error",
                            text: response.message || "No fue posible guardar la plantilla.",
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                    }

                }
            }
        });
    }

    async onEditRotation(input) {
        const id    = input.dataset.id;
        const field = input.dataset.field;
        const value = parseFloat(input.value);

        if (!id || !field || isNaN(value)) {
            alert({ icon: "error", text: "Identificador o campo inválido." });
            return;
        }

        const row = input.closest('tr');

        // Obtener los valores actuales de la fila
        const initialInput = row.querySelector('input[name="initial_template"]');
        const endInput     = row.querySelector('input[name="end_template"]');

        const initialValue = parseFloat(initialInput?.value || 0);
        const endValue     = parseFloat(endInput?.value || 0);

        const epm  = initialValue + (endValue / 2);
        const bajas = parseFloat(row.cells[4]?.innerText || 0); // Asumiendo columna 4 = BAJAS
        const rotacion = epm > 0 ? ((bajas * 100) / epm).toFixed(2) : 0;

        // Actualizar la fila visualmente
        row.cells[3].innerText = epm.toFixed(2);     // EPM
        row.cells[5].innerText = rotacion;           // ROTACION

        // Llamar backend
        await useFetch({
            url: api,
            data: {
                opc     : "editRotationField",
                [field] : value,
                epm     : epm.toFixed(2),
                rotation: rotacion,
                id      : id,
            },
        });

    }

    // Template Rotation.

    async onEditTemplate(input) {
        const id = input.dataset.id;
        const field = input.dataset.field;
        const value = parseFloat(input.value);

        if (!id || !field || isNaN(value)) {
            alert({ icon: "error", text: "Identificador o campo inválido." });
            return;
        }

        const row = input.closest('tr');

        // Obtener inputs de la fila
        const realInput = row.querySelector('input[name="real_template"]');
        const authorizedInput = row.querySelector('input[name="authorized_template"]');

        const realValue = parseFloat(realInput?.value || 0);
        const authorizedValue = parseFloat(authorizedInput?.value || 0);

        // Calcular ROTACIÓN
        const rotacion = authorizedValue > 0 ? ((realValue * 100) / authorizedValue).toFixed(2) : "0.00";

        // Actualizar celda visualmente
        row.cells[3].innerText = rotacion;

        // Enviar datos al backend
        await useFetch({
            url: api,
            data: {
                opc: "editTemplateField",
                [field]: value,
                percentage_template: rotacion,
                id: id,
            },
        });
    }



}



function formatSpanishDate(fecha = null, type = "normal") {
    let date;

    if (!fecha) {
        // Si no se pasa nada, usamos la fecha actual
        date = new Date();
    } else {
        // Dividimos fecha y hora si existe
        // ejemplo: "2025-03-08 09:14" => ["2025-03-08", "09:14"]
        const [fechaPart, horaPart] = fecha.split(" ");

        // Descomponer "YYYY-MM-DD"
        const [year, month, day] = fechaPart.split("-").map(Number);

        if (horaPart) {
            // Si hay hora, por ejemplo "09:14"
            const [hours, minutes] = horaPart.split(":").map(Number);
            // Crear Date con hora local
            date = new Date(year, month - 1, day, hours, minutes);
        } else {
            // Solo fecha
            date = new Date(year, month - 1, day);
        }
    }

    // Extraer partes de la fecha
    const dia = date.getDate();
    const anio = date.getFullYear();

    // Obtenemos el mes en español (México).
    // Nota: El mes corto en español a veces incluye punto (ej: "mar."). Lo eliminamos:
    const mesCorto = date
        .toLocaleString("es-MX", { month: "short" })
        .replace(".", "");
    const mesLargo = date.toLocaleString("es-MX", { month: "long" });

    // Asegurar que el día tenga 2 dígitos
    const diaPadded = String(dia).padStart(2, "0");

    // Formatos deseados
    const formatos = {
        short: `${diaPadded}/${mesCorto}/${anio}`, // p.ej. "08/mar/2025"
        normal: `${diaPadded} de ${mesLargo} del ${anio}`, // p.ej. "08 de marzo del 2025"
    };

    // Devolvemos el formato según type
    return formatos[type] || formatos.short;
}



