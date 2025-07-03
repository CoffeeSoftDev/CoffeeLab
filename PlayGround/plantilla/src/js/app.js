
// init vars.
let app, sub;

let api = "https://huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php";



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
        this.layout();
        this.filterBar();
        this.onShowDocument(10);
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            card: {
                filterBar: {
                    class: "lg:h-[20%] line",
                    id: "filterBar" + this.PROJECT_NAME,
                },
                container: {
                    id: "container" + this.PROJECT_NAME,
                },
            },
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            type: 'simple',
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-4",
                    id: "calendar" + this.PROJECT_NAME,
                    lbl: "Rango de fechas",
                },
                {
                    opc: "button",
                    class: "col-sm-4",
                    className: 'w-100',
                    color_btn: "primary",
                    id: "btnNuevoDestajo",
                    text: "Consultar",
                    onClick: () => {
                        this.onShowDocument(8);
                    },
                },
            ],
        });

        // Init del rango de fechas
        dataPicker({
            parent: "calendar" + this.PROJECT_NAME,
            rangepicker: {
                startDate: moment().subtract(2, "month").startOf("month"),
                endDate: moment().endOf("month"),
                showDropdowns: true,
                ranges: {
                    "Mes actual": [moment().startOf("month"), moment().endOf("month")],
                    "Mes anterior": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
                    "Primeros 6 meses": [moment().startOf("year"), moment().month(5).endOf("month")],
                    "Últimos 6 meses": [moment().month(6).startOf("month"), moment().endOf("year")]
                }
            },
            onSelect: (start, end) => {
                this.ls();
            },
        });
    }

    ls() {
        let range = getDataRangePicker("calendar" + this.PROJECT_NAME);

        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            coffeesoft: true,
            data: {
                opc: "list",
                fi: range.fi,
                ff: range.ff,
                udn: 0,
                status: 0
            },
            conf: { datatable: false, pag: 10 },
            attr: {
                id: "tb" + this.PROJECT_NAME,
                extends: true,
                title: 'Reporte de pagos por destajo',
                subtitle: `Correspondiente del ${this.formatDateText(range.fi)} a ${this.formatDateText(range.ff)}`,
                theme: 'corporativo',
                right: [3, 4, 5, 6, 7, 8, 9],
                center: [2, 10],
                f_size: 12,
                striped: false
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



