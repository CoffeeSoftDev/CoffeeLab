
// init vars.
let app, sub;

let api = "https://www.huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php";
let link = "https://erp-varoch.com/DEV/gestor-de-actividades/ctrl/ctrl-gestordeactividades.php";



$(async () => {
    // instancias.
    app = new App(api, 'root');
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

        // this.layout();
        // this.filterBar();
        // this.ls()
        this.addModifier()
    }

    // Gestor activity


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

    async addModifier() {
        // Estado temporal para productos
        this.tempProductList = [];

        // 1. Renderiza el modal con ambos formularios separados, pero solo el primero activo al inicio
        bootbox.dialog({
            // size:'lg',
            closeButton:true,
            title: `
            <h2 class="text-lg font-semibold leading-none tracking-tight text-white">Crear Nuevo Modificador</h2>
            <p class="text-sm text-muted-foreground">Completa la información del modificador.</p>
        `,
            message: `
            <form id="formModifierContainer" novalidate></form>
                <label class="text-lg font-medium text-gray-600 mt-3">Productos Incluidos</label>
                <p class="text-sm text-muted-foreground">Añade los productos que incluye este modificador</p>
            <form id="formProductsContainer" novalidate class="mt-4 d-none"></form>
            <div id="product-list" class="overflow-y-auto max-h-52 mt-2"></div>
        `,

        });

        // 2. Renderiza el primer formulario con createForm (nombre + descripción)
        this.createForm({
            parent: "formModifierContainer",
            id: "formModifier",
            data: { opc: 'addModifier' },
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del Modificador",
                    required: true,
                    class: "col-12 mb-3",
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12",
                },
                {
                    opc: "btn-submit",
                    text: "Crear Modificador",
                    class: "col-12",
                }
            ],
            success: (response) => {
                if (response.status == 200) {
                    // Desactiva form y habilita el de productos
                    $('#formModifier :input').prop('disabled', true);
                    $('#formProductsContainer').removeClass('d-none');
                    // this.modifierId = response.modifierId; // Guarda el id si tu backend lo da
                    this.renderProductForm(); // Activa el siguiente paso
                }
            }
        });


    }

    renderProductForm() {
        this.createForm({
          parent: "formProductsContainer",
          id: "formProduct",

          data: { opc: "tempProduct" },
          json: [
            {
              opc: "input",
              id: "productName",
              lbl: "Nombre ",
              placeholder: "Ingrese nombre del producto",
              required: true,
                  class: "col-12 mb-3",
            },
            {
              opc: "input",
              id: "cant",
              lbl: "Cantidad",
              tipo: "numero",
              value: 1,
              required: true,
              class: "col-4",
            },
            {
              opc: "input",
              id: "price",
              lbl: "Precio",
              tipo: "numero",
              value: 1,
              required: true,
              class: "col-4",
            },
            {
              opc: "button",
              text: "Añadir",
              className: "w-full",
              class: "col-4",
              onClick: () => this.addProductToList(),
            },
          ],
        });

        $("#formProduct").on('reset', () => {
            $("#productName").val('');
            $("#cant").val(1);
            $("#price").val(1);
        });
    }

    addProductToList() {
        const name = $("#productName").val().trim();
        const qty = parseInt($("#cant").val());
        const price = parseFloat($("#price").val());

        if (!name || qty < 1 || price < 0) {
            alert({ icon: "info", text: "Nombre, cantidad y precio son requeridos y válidos." });
            return;
        }
        this.tempProductList.push({
            id: name, // Aquí puedes poner el id real si usas catálogo
            text: name,
            qty,
            price
        });
        this.renderProductList();
        $("#formProduct")[0].reset();
    }

    renderProductList() {
        let html = "";
        this.tempProductList.forEach((prod, idx) => {
            const prodId = prod.id || idx + 1;

            html += `
            <div class="product-item" data-id="${prodId}">
                <div class="border border-gray-200 bg-gray-500 rounded-lg p-3 shadow-sm flex items-center justify-between gap-4 mb-2">
                    <div class="text-sm font-semibold text-white flex-1 truncate">${prod.text}</div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-800 font-medium">Cantidad:</label>
                        <input
                            type="number"
                            min="1"
                            class="form-control bg-[#1F2A37] w-20 text-sm"
                            id="quantity-${prodId}"
                            value="${prod.qty}"
                            onkeyup="validationInputForNumber('#quantity-${prodId}')"
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-800 font-medium">Precio:</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            class="form-control bg-[#1F2A37] w-24 text-sm"
                            id="price-${prodId}"
                            value="${prod.price}"
                        >
                    </div>
                    <button
                        type="button"
                        class="btn btn-outline-danger btn-sm"
                        id="remove-product-${prodId}"
                        onclick="app.deleteProductToList('#remove-product-${prodId}')">
                        <i class="icon-trash"></i>
                    </button>
                </div>
            </div>
        `;
        });
        $("#product-list").html(html);
    }




    filterBar() {
        const admin =

            [
                {
                    opc: "btn",
                    class: "col-sm-6 col-md-6 col-lg-3",
                    color_btn: "primary",
                    id: "btnNuevaActividad",
                    text: "Nueva actividad",
                    fn: "gestor.addTaskModal()",
                },

                {
                    opc: "btn",
                    class: "col-sm-6 col-md-6 col-lg-3",
                    color_btn: "success",
                    icon: "icon-whatsapp",
                    id: "btnSendRecorders",
                    text: "Enviar Recordatorios",
                    fn: "gestor.reminderModal()",
                },
            ]
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            data: [
                {
                    opc: "select",
                    class: "col-sm-6 col-md-4 col-lg-2",
                    id: "udn",
                    lbl: "Seleccionar udn: ",
                    data: [
                        {id:0, valor:'Corporativo'}
                    ],
                    onchange: "app.ls()",
                },
                {
                    opc: "input-calendar",
                    class: "col-sm-6 col-md-4 col-lg-2",
                    id: "calendar",
                    lbl: "Consultar fecha: ",
                },
                {
                    opc: "select",
                    class: "col-sm-6 col-md-4 col-lg-2",
                    id: "estado",
                    lbl: "Seleccionar estados: ",
                    data: [
                        {id:0, valor:'Pendiente'},
                        {id:2, valor:'En curso'},
                        {id:3, valor:'Terminado'}
                    ],
                    onchange: "app.ls()",
                },
                ...admin,
            ],
        });
        // initialized.
        dataPicker({
            parent: "calendar",
            rangepicker: {
                startDate: moment().startOf("year"),
                endDate: moment().endOf("year"),
                showDropdowns: true,

                ranges: {
                    "Mes actual": [moment().startOf("month"), moment().endOf("month")],
                    "Semana actual": [moment().startOf("week"), moment().endOf("week")],
                    "Proxima semana": [moment().add(1, "week").startOf("week"), moment().add(1, "week").endOf("week")],
                    "Proximo mes": [moment().add(1, "month").startOf("month"), moment().add(1, "month").endOf("month")],
                    "Mes anterior": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
                },
            },
            onSelect: (start, end) => {
                this.ls();
            },
        });

        // $("#estado").val(1); // cambiar a en proceso
    }

    ls() {



        let rangePicker = getDataRangePicker("calendar");
        const fi = rangePicker.fi;
        const ff = rangePicker.ff;

        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "lsTasks", fi: rangePicker.fi, ff: rangePicker.ff },
            conf: { datatable: true, pag: 10 },
            coffeesoft: true,
            attr: {
                theme:'corporativo',
                title: " Lista de Actividades Creadas ",
                subtitle: `Periodo del ${fi} al ${ff}`,
                id: "tbGestorActivityMac",
                center: [1, 2, 4, 5, 6, 7, 8],
                right: [4],
                f_size: 12,
                extends: true,
            },
        });
    }

    async onShowDocument(id) {

        // let modal = bootbox.dialog({

        //     title: "Imprimir nota de evento",
        //     closeButton: true,
        //     size: "xl",
        //     message:
        //         '<div class="flex justify-content-end  mt-3" id="containerButtons"></div><div class="flex justify-content-center  mt-3" id="containerPDF"></div> ',
        //     id: "modalDocument",
        // }); // Crear componente modal.


        let data = await useFetch({
            url: this._link,
            data: { opc: 'getFormatedEvent', idEvent: id, }
        });


        console.log('data: ', data.SubEvent);
        this.createPDFComponent({
            parent: "container",
            dataEvent: data.Event,
            dataSubEvent: data.SubEvent,
            dataPayment: data.Payment,
            dataMenu: data.menu,
            dataExtra: data.extras,
            logo: data.company.logo,
            location: data.company.location,
            type: data.type


        });

        // // Función para imprimir y cerrar el modal correctamente
        let printDiv = () => {

            let divToPrint = document.getElementById("docEvent");
            let popupWin = window.open("", "_blank");

            popupWin.document.open();
            popupWin.document.write(`
                <html>
                <head>
                    <link href="https://15-92.com/ERP3/src/plugin/bootstrap-5/css/bootstrap.min.css" rel="stylesheet" type="text/css">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style type="text/css" media="print">
                        @page { margin: 5px; }
                        body { margin: 5px; padding: 10px; }
                    </style>
                </head>
                <body>
                    ${divToPrint.innerHTML}
                    <script>
                        window.onload = function() {
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        };
                    <\/script>
                </body>
                </html>`);

            popupWin.document.close();

            // Cierra el modal inmediatamente después de lanzar la impresión
            modal.modal('hide');

        };

        $('#containerButtons').append(
            $('<button>', {
                class: 'btn btn-primary text-white',

                html: '<i class="icon-print"></i> Imprimir ',
                click: function () {
                    printDiv();
                }
            }),

        );


    }


    createPDFComponent(options) {

        const defaults = {
            parent: 'containerprimaryLayout',
            dataPackage: [],
            dataMenu: [],
            dataExtra: [],
            dataPayment: [],
            dataSubEvent: [],
            logo: "",
            location: 'Tapachula,Chis ',
            link: 'https://huubie.com.mx/alpha',
            type: 'Event',
            dataEvent: {
                name: "[name]",
                email: "[email]",
                phone: "[phone]",
                contact: "[contact]",
                idEvent: "[idEvent]",
                location: "[location]",
                date_creation: "[date_creation]",
                date_start: "[date_start]",
                date_start_hr: "[date_start_hr]",
                date_end: "[date_end]",
                date_end_hr: "[date_end_hr]",
                day: "[day]",
                quantity_people: "[quantity_people]",
                advance_pay: "[advance_pay]",
                total_pay: "[total_pay]",
                notes: "[notes]",
                type_event: "[type_event]",
                status: "[status]"
            },
            clauses: ["", "", "", ""]
        };

        const opts = Object.assign({}, defaults, options);


        const header = `
            <div class="flex justify-between items-start mb-4">
                ${opts.logo ? `<img src="${opts.link + opts.logo}" alt="Logo" class="w-20 h-20 rounded-full object-cover">` : ""}
                <p id="location-label">${opts.location ? opts.location : '<span class="text-gray-400">Ubicación no disponible </span>'}, a ${opts.dataEvent.date_creation}</p>
            </div>

            <div class="event-header text-sm text-gray-800 mb-4">
                <p class="font-bold uppercase">${opts.dataEvent.name}</p>
                ${opts.dataEvent.status === 'Cotización' ? `<p class="font-bold uppercase text-red-500">${opts.dataEvent.status}</p>` : ''}
                <p>${opts.dataEvent.date_start} ${opts.dataEvent.date_start_hr}</p>
                <p id="location-event">${opts.dataEvent.location ? opts.dataEvent.location : '<span class="text-gray-400">Obteniendo ubicación...</span>'}</p>
            </div>

            <div class="mb-3 text-justify">
                <p>Agradecemos su preferencia por celebrar su evento con nosotros el día
                <strong>${opts.dataEvent.day}</strong>,
                <strong>${opts.dataEvent.date_start} ${opts.dataEvent.date_start_hr}</strong>
                a <strong>${opts.dataEvent.date_end} ${opts.dataEvent.date_end_hr}</strong>, en el salón
                <strong id="location-detail">${opts.dataEvent.location ? opts.dataEvent.location : '...'}</strong>.</p>
                <p>Estamos encantados de recibir a <strong>${opts.dataEvent.quantity_people}</strong> invitados y nos aseguraremos de que cada detalle esté a la altura de sus expectativas.</p>
                <br>
                ${opts.dataEvent.notes ? `<p><strong>NOTAS:</strong> ${opts.dataEvent.notes}</p>` : ""}
            </div>
        `;



        let subEvents = "";
        console.log(opts.type)
        if (opts.type == 'Event') {


            opts.dataMenu.forEach(menu => {

                subEvents += `
                    <div class="mb-3 text-sm leading-5 ">
                    <p><strong>${menu.name || ""}  (${
                  menu.quantity || 0
                })</strong>
                    ${
                      Array.isArray(menu.dishes) && menu.dishes.length > 0
                        ? `
                            <ul class=" text-[12px]  mt-1 pl-6">
                                ${menu.dishes
                                  .map(
                                    (d) =>
                                      `<li>- ${d.name}  <span class="text-gray-400">(${d.quantity})</span></li>`
                                  )
                                  .join("")}
                            </ul>
                        `
                        : ""
                    }
                    <p class="mt-2"><strong>Costo:</strong>$ ${menu.price}</p>
                    </div>
                    `;
            });

            // ------ EXTRAS ------

            // Calcula el costo total de los extras (cantidad * precio, suma todo)
            const totalExtras = Array.isArray(opts.dataExtra)
                ? opts.dataExtra.reduce((acc, extra) => {
                    const quantity = Number(extra.quantity) || 0;
                    const price = Number(extra.price) || 0;
                    return acc + (quantity * price);
                }, 0)
                : 0;

            // Render extras con lista y total elegante
            const extraItems =
                Array.isArray(opts.dataExtra) && opts.dataExtra.length > 0
                    ? `
                <div class="mt-2 text-sm">
                    <p class="font-semibold">Extras</p>
                    <ul class="list-disc list-inside pl-6">
                    ${opts.dataExtra
                                .map(
                                    (extra) => `
                            <li class="text-gray-700 text-[13px]">
                            ${extra.name || ""}
                            <span class="text-gray-400">
                                ${extra.quantity ? `(${extra.quantity})` : ""}
                            </span>

                            </li>`
                                )
                                .join("")}
                    </ul>
                    <div class="mt-2 flex ">
                    <p class="mt-2"><strong>Costo:</strong>$ ${totalExtras.toLocaleString('es-MX') }</p>

                    </div>
                </div>`
                    : "";

            // Ejemplo de uso:
            subEvents += `
            <div class="mb-3 text-sm leading-6">
                ${extraItems}
            </div>
            `;

        }else{

            if (Array.isArray(opts.dataSubEvent) && opts.dataSubEvent.length > 0) {
                opts.dataSubEvent.forEach(sub => {

                    if (!sub) return;

                    // ------ PAQUETES ------
                    let menuPackages = "";
                    if (
                        sub.menu &&
                        typeof sub.menu === 'object' &&
                        Object.keys(sub.menu).some(key => !isNaN(key))
                    ) {
                        menuPackages = Object.entries(sub.menu)
                            .filter(([key]) => !isNaN(key)) // solo claves numéricas
                            .map(([key, pkg]) => {
                                const pkgDishes = (sub.menu.dishes || [])
                                    .filter(dish => dish.package_id === pkg.package_id)
                                    .map(dish =>
                                        `<li class="mb-0.5 text-[12px] text-gray-600">${dish.name}${dish.quantity ? ` <span class="text-gray-400">(${dish.quantity})</span>` : ""}</li>`
                                    ).join("");
                                return `
                    <div class="">
                        <div class=" text-[14px] text-black mb-1">${pkg.name || "Paquete"}</div>
                        <ul class=" pl-5">
                            ${pkgDishes}
                        </ul>
                    </div>`;
                            }).join("");
                    }

                    // ------ EXTRAS ------
                    const extraItems = Array.isArray(sub.extras) && sub.extras.length > 0
                        ? `
                        <div class="mt-2 text-sm">
                            <p class="font-semibold">Extras</p>
                            <ul class="list-disc list-inside pl-6">
                                ${sub.extras.map(extra => `
                                    <li class="text-gray-700 text-[12px]">
                                        ${extra.name || ""} (${extra.quantity || 0})
                                    </li>`).join("")}
                            </ul>
                        </div>`
                        : "";

                    // ------ Costo seguro ------
                    let costo = sub.total_pay !== null && sub.total_pay !== undefined && !isNaN(sub.total_pay)
                        ? `$${parseFloat(sub.total_pay).toLocaleString('es-MX')}`
                        : "-";

                    // ------ Render Subevento ------
                    subEvents += `
                        <div class="mb-3 text-sm leading-5">
                            <p><strong>${sub.name_subevent || ""} para ${sub.quantity_people || 0} personas</strong>
                            (${sub.time_start || "-"} a ${sub.time_end || "-"} horas)</p>
                            <p class="text-capitalize font-semibold">${sub.location || ""}</p>
                            ${menuPackages}
                            ${extraItems}
                            <p class="mt-2"><strong>Costo:</strong> ${costo}</p>
                        </div>
                    `;
                });
            }


        }







        const total = parseFloat(opts.dataEvent.total_pay) || 0;
        const advance = parseFloat(opts.dataEvent.advance_pay) || 0;
        const discount = parseFloat(opts.dataEvent.discount || 0);     // nuevo campo opcional

        let totalPagos = 0;
        let templatePayment = '';

        opts.dataPayment.forEach((item) => {
            const monto = parseFloat(item.valor) || 0;
            totalPagos += monto;
            templatePayment += `
            <div class="flex justify-between text-sm">
                <p class="font-semibold">${item.method_pay}</p>
                <p>${monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
            </div>`;
        });




        templatePayment += `

            <div class="flex justify-between text-sm border-t pt-2 mt-2">
                <p class="font-bold">Total Pagado</p>
                <p class="">${totalPagos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
            </div>

            <div class="flex justify-between text-sm mt-3 border-t">
                <p class="font-bold"> Restante</p>
                <p class="">${(total - advance - discount - totalPagos).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
            </div>`;

        const blockTotals = `
            <div class="mt-6 mb-2 text-sm  flex justify-end">
                <div class="w-1/3">
                    <div class="flex justify-between pt-2">
                        <p class="font-bold"> Total </p>
                        <p>${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold"> Anticipo </p>
                        <p>${advance.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold"> Descuento </p>
                        <p>${discount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold"> Saldo </p>
                        <p>${(total - advance - discount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                </div>
            </div>

            <div class="flex text-sm justify-end mt-2">
                <div class="w-1/3">
                    <p class="font-bold border-t my-1">Forma de pago</p>
                    ${templatePayment}
                </div>
            </div>`;


        let templateClauses = `
            <div class="mb-4 mt-3 text-xs">
                <p class="font-bold">Cláusulas</p>
                <ul class="list-decimal pl-5">`;

        opts.clauses.forEach((clause, index) => {

            templateClauses += `<li>${clause}</li>`;
            if ((index + 1) % 5 === 0 && index + 1 < opts.clauses.length) {
                templateClauses += `</ul><div style="page-break-after: always;"></div><ul class='list-decimal pl-5'>`;
            }
        });

        templateClauses += `</ul></div>`;

        const docs = `
        <div id="docEvent"
            class="flex flex-col justify-between px-12 py-10 bg-white text-gray-800 shadow-lg rounded-lg"
            style="
                width: 816px;
                min-height: 1056px;
                background-image: url('https://huubie.com.mx/alpha/eventos/src/img/background.png');
                background-repeat: no-repeat;
                background-size: 90% 100%;
                background-position: left top;
            ">

            <div class="w-full pl-[120px] grow">
                ${header}
                ${subEvents}
            </div>

            <div class="w-full pl-[120px] mt-10">
                ${blockTotals}
                ${templateClauses}
            </div>
        </div>`;

        $('#' + opts.parent).append(docs);
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



