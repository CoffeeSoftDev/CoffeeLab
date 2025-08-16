let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';
let api = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php";
let app;
$(function () {
    app = new App(api, 'root');
    app.init();
    // sub.init();
});

class App extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Order";
    }

    init() {

        this.render();

    }


    render() {
        this.layoutS();
        this.createFilterBar()
        this.ls();
        this.addProducto()
        // this.createFilterBar();
    }

    async showReservationModal(id) {
        const res = await useFetch({
            url: this._link,
            data: { opc: "getReservation", id }
        });

        const data = res.data;

        const estado = this.getStatusReservation(data.status_reservation_id);

        const datos = [
            { text: "Locación", value: data.location, icon: "icon-location" },
            { text: "Estado", value: estado.label, type: "status", icon: "icon-spinner", color: estado.color },
            { text: "Evento", value: data.name_event, icon: "icon-calendar" },
            { text: "Nombre", value: data.name_client, icon: "icon-user-1" },
            { text: "Teléfono", value: data.phone, icon: "icon-phone-1" },
            { text: "Creado el", value: data.date_creation, icon: "icon-calendar-1" },
            { text: "Correo", value: data.email, icon: "icon-mail-1" },
            { text: "Total", value: formatPrice(data.total_pay), icon: "icon-money" },
            { type: "observacion", value: data.notes }
        ];

        // Solo si está en estado activo (1), agrega los botones
        if (data.status_reservation_id === 1) {
            datos.push({
                type: "div",
                html: `
                <div class="flex gap-2 mt-4 justify-end">
                    <button class="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded flex items-center gap-2"
                        id="btnShowReservation" data-id="${data.id}">
                        <i class="icon-ok"></i> Show
                    </button>
                    <button class="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2 rounded flex items-center gap-2"
                        id="btnNoShowReservation" data-id="${data.id}">
                        <i class="icon-block-1"></i> No Show
                    </button>
                </div>
            `
            });
        }

        // Render
        bootbox.dialog({
            title: "📅 Reservación",
            closeButton: true,
            message: '<div id="containerReservation"></div>',

        });


        this.detailCard({
            parent: "containerReservation",
            data: datos,
        });

        // Event.
        if (data.status_reservation_id === 1) {
            $("#btnShowReservation").on("click", () => this.showReservation(data.id));
            $("#btnNoShowReservation").on("click", () => this.noShowReservation(data.id));
        }
    }

      layoutS() {

        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: 'flex mx-2 my-2 h-100 mt-5 p-2',
            card: {
                filterBar: { class: 'w-full my-3 ', id: 'filterBar' },
                container: { class: 'w-full my-3 bg-[#1F2A37] h-[calc(100vh)] rounded p-3', id: 'container' + this.PROJECT_NAME }
            }
        });

        // Filter bar.

        $('#filterBar').html(`
            <div id="containerHours"></div>
            <div id="filterBar${this.PROJECT_NAME}" class="w-full my-3 " ></div>
        `);

    }

     // Orders.
    createFilterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-3",
                    id: "calendar",
                    lbl: "Consultar fecha: ",
                },


                {
                    opc: 'select',
                    id: 'selectStatusPedido',
                    class: 'col-sm-3',
                    onchange:'order.ls()',
                    data: [
                        { id: '', valor: 'Todos los estados' },
                        { id: '1', valor: 'Pendiente' },
                        { id: '2', valor: 'Pagado' },
                        { id: '3', valor: 'Cancelado' }
                    ]
                },

                {
                    opc      : 'button',
                    id       : 'btnNuevoPedido',
                    class    : 'col-sm-2',
                    text     : 'Nuevo Pedido',
                    className: 'btn-primary w-100',
                    onClick  : () => this.showTypePedido()
                },

                {
                    opc: "button",
                    className: "w-100",
                    class: "col-sm-2",
                    color_btn: "secondary",
                    id: "btnCalendario",
                    text: "Calendario",
                    onClick: () => {
                        this.ls()
                        // window.location.href = '/dev/calendario/'
                    }
                },

            ]
        });

        dataPicker({
            parent: "calendar",
            rangepicker: {
                startDate: moment().startOf("month"), // Inicia con el primer dÃ­a del mes actual
                endDate: moment().endOf("month"), // Finaliza con el Ãºltimo dÃ­a del mes actual
                showDropdowns: true,
                ranges: {
                    "Mes actual"    : [moment().startOf("month"), moment().endOf("month")],
                    "Semana actual" : [moment().startOf("week"), moment().endOf("week")],
                    "PrÃ³xima semana": [moment().add(1, "week").startOf("week"), moment().add(1, "week").endOf("week")],
                    "PrÃ³ximo mes"   : [moment().add(1, "month").startOf("month"), moment().add(1, "month").endOf("month")],
                    "Mes anterior"  : [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
                },
            },
            onSelect: (start, end) => {
                this.ls();
            },
        });
    }

    ls() {

        let rangePicker = getDataRangePicker("calendar");

        this.createTable({

            parent     : `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: "listProductos", estado:1 },
            conf       : { datatable: false, pag: 10 },
            coffeesoft : true,

            attr: {
                id     : `tb${this.PROJECT_NAME}`,
                theme  : 'dark',
                center : [1, 2,  7, 8,9,10,11],
                right  : [4,5,6],
                extends: true,
            },
        });
    }



    addProducto() {
        const modal = bootbox.dialog({
            closeButton: true,
            title: 'Agregar Producto',
            message: `<div><form id="formAddProducto" novalidate></form></div>`
        });

        this.createForm({
            id: 'formAddProductoInternal',
            parent: 'formAddProducto',
            autovalidation: false,
            data: [],
            json: [
                {
                    opc: "input",
                    id: "name",
                    lbl: "Nombre del Producto",
                    class: "col-12 mb-3"
                },
                {
                    opc: "input-group",
                    id: "price",
                    lbl: "Precio",
                    tipo: "cifra",
                    class: "col-12 mb-3",
                    icon: "icon-dollar",
                    onkeyup: "validationInputForNumber('#price')"
                },
                {
                    opc: "textarea",
                    id: "description",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                },
                {
                    opc: "select",
                    id: "category_id",
                    lbl: "Clasificación",
                    class: "col-12",
                    text: "classification",
                    value: "id"
                },
                {
                    opc: "div",
                    id: "image",
                    lbl: "Foto del producto",
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
                                onchange="app.previewImages(this, 'previewImagenes')"
                            >
                            <div class="flex flex-col items-center justify-center py-2 cursor-pointer" onclick="document.getElementById('archivos').click()">
                                <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                                    <i class="icon-upload text-white"></i>
                                </div>
                                <p class="text-xs">Drag & Drop or <span class="text-purple-400 underline">choose file</span></p>
                                <p class="text-[10px] text-gray-400 mt-1">JPEG, PNG</p>
                            </div>
                            <div id="previewImagenes" class="flex gap-2 flex-wrap mt-1"></div>
                        </div>
                    </div>
                `
                },
                {
                    opc: "button",
                    id: "btnAddProducto",
                    class: "col-12 mt-2",
                    className: "w-full p-2",
                    text: "Guardar Producto",
                    onClick: () => {
                        const form = document.getElementById('formAddProducto');
                        const formData = new FormData(form);

                        formData.append('opc', 'add');

                        const files = document.getElementById('archivos').files;
                        for (let i = 0; i < files.length; i++) {
                            formData.append('archivos[]', files[i]);
                        }

                        fetch(this._link, {
                            method: 'POST',
                            body: formData
                        })
                            .then(response => response.json())
                            .then(response => {
                                if (response.status === 200) {
                                    alert({ icon: "success", text: response.message });
                                    this.lsProductos();
                                    modal.modal('hide');
                                } else {
                                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                                }
                            });
                    }
                }
            ]
        });
    }


    previewImages(input, previewId) {
        const previewContainer = document.getElementById(previewId);
        previewContainer.innerHTML = "";
        Array.from(input.files).forEach(file => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.classList.add("w-20", "h-20", "object-cover", "rounded");
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }



    getStatusReservation(id) {
        const map = {
            1: { label: "Reservación", color: "bg-[#EBD9FF] text-[#6B3FA0]" },
            2: { label: "Si llego", color: "bg-[#B9FCD3] text-[#032B1A]" },
            3: { label: "No llego", color: "bg-[#E5E7EB] text-[#374151]" }
        };
        return map[id] || { label: "-", color: "bg-gray-500 text-white" };
    }

    showReservation(id) {
        this.swalQuestion({
            opts: {
                title: "¿Confirmar asistencia del cliente?",
                text: "Esta acción marcará esta reservación como 'Show'.",
                icon: "question"
            },
            data: {
                opc: "editReservation",
                status_reservation_id: 2,
                id: id,
            },
            methods: {
                send: (res) => {
                    if (res.status === 200) {
                        alert({
                            icon: "success",
                            text: "La reservación fue marcada como Show",
                            btn1: true
                        });
                        this.ls();
                        bootbox.hideAll();

                    } else {
                        alert({
                            icon: "error",
                            text: res.message,
                            btn1: true
                        });
                    }
                }
            }
        });
    }

    noShowReservation(id) {
        this.swalQuestion({
            opts: {
                title: "¿Marcar como No Show?",
                text: "Esta acción marcará la reservación como No Show. ¿Deseas continuar?",
                icon: "warning"
            },
            data: {
                opc: "editReservation",
                status_reservation_id: 3,
                id: id,
            },
            methods: {
                send: (res) => {
                    if (res.status === 200) {
                        alert({
                            icon: "success",
                            text: "La reservación fue marcada como No Show",
                            btn1: true
                        });
                        this.ls();
                         bootbox.hideAll();
                    } else {
                        alert({
                            icon: "error",
                            text: res.message,
                            btn1: true
                        });
                    }
                }
            }
        });
    }

    detailCard(options = {}) {
        const defaults = {
            parent: "body",
            title: "",
            subtitle: "",
            class: "space-y-2",
            data: [],
        };

        const opts = Object.assign({}, defaults, options);

        const isCols2 = opts.class.includes("cols-2");
        let contentClass = isCols2
            ? `grid grid-cols-2 ${opts.class.replace("cols-2", "")}`
            : `flex flex-col ${opts.class}`;

        let infoHtml = `<div class="${contentClass}">`;

        opts.data.forEach(item => {
            if (item.type === "div") {
                infoHtml += `<div class="${item.class || ''}">${item.html || ''}</div>`;
            } else if (item.type === "status") {
                infoHtml += `
                <div class="flex items-center mb-1">
                    <span class="text-gray-400 font-medium flex items-center text-base">
                        ${item.icon ? `<i class="${item.icon} mr-2"></i>` : ""}
                        ${item.text}:
                    </span>
                    <span class="ml-2 px-3 py-1 rounded-full text-xs font-bold ${item.color || "bg-gray-500"}">${item.value}</span>
                </div>
            `;
            } else if (item.type === "observacion") {
                infoHtml += `
                <div class="col-span-2 mt-2">
                    <label class="text-gray-400 font-medium text-base mb-1 block">${item.text || "Observación"}:</label>
                    <div class="bg-[#28324c] rounded p-3 text-gray-300 min-h-[80px]">${item.value || ""}</div>
                </div>
            `;
            } else {
                infoHtml += `
                <div class="flex items-center mb-1">
                    <span class="text-gray-400 font-medium flex items-center text-base">
                        ${item.icon ? `<i class="${item.icon} mr-2"></i>` : ""}
                        ${item.text}:
                    </span>
                    <span class="ml-2 font-semibold text-white text-base">${item.value}</span>
                </div>
            `;
            }
        });

        infoHtml += `</div>`;

        const html = `
        <div class="text-white rounded-xl p-3 min-w-[320px]">
            ${infoHtml}
        </div>
    `;

        $(`#${opts.parent}`).html(html);
    }


    renderProductForm(idModifier) {
        this.createForm({
            parent: "formProductsContainer",
            id: "formProduct",
            data: { opc: "addProductModifier", id: idModifier },
            json: [
                {
                    opc: "div",
                    html: ` <label class="text-lg font-medium text-gray-100">Productos Incluidos</label>
                    <p class="text-sm text-muted-foreground mb-1">Añade los productos que incluye este modificador</p> `,
                    class: "col-12",
                },
                {
                    opc: "input",
                    id: "productName",
                    lbl: "Nombre ",
                    placeholder: "Ingrese nombre del producto",
                    required: true,
                    class: "col-5 mb-3",
                },

                {
                    opc: "input",
                    id: "price",
                    lbl: "Precio",
                    tipo: "numero",
                    placeholder: "0.00",
                    required: true,
                    class: "col-3",
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

        });
    }

    addProductToList() {
        const name = $("#productName").val().trim();
        const qty = parseInt($("#cant").val());
        const price = $("#price").val();

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
        $("#formProductsContainer")[0].reset();
    }

    renderProductList() {
        let html = `<div id="product-list" class="overflow-y-auto max-h-52">`;

        this.tempProductList.forEach((prod, idx) => {
            html += `
            <div class="product-item" data-index="${idx}">
                <div class="border border-gray-200 rounded-lg p-2 shadow-sm flex items-center justify-between gap-4 mb-2">
                    <div class="text-sm font-semibold text-gray-900 flex-1 truncate text-white">${prod.text}</div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-800 font-medium">Precio:</label>
                        <input
                            type="text"
                            placeholder="0.00"
                            class="form-control bg-[#1F2A37] w-20 text-sm text-end input-qty"
                            data-index="${idx}"
                            value="${prod.price}"
                        >
                    </div>
                    <button
                        type="button"
                        class="btn btn-outline-danger btn-sm btn-remove-product"
                        data-index="${idx}">
                        <i class="icon-trash"></i>
                    </button>
                </div>
            </div>
        `;
        });

        html += `</div>`;
        $("#product-list").html(html);

        // Eliminar producto por índice exacto
        $('#product-list').off('click', '.btn-remove-product').on('click', '.btn-remove-product', (e) => {
            const index = $(e.currentTarget).data('index');
            this.tempProductList.splice(index, 1);
            this.renderProductList();
        });

        // Actualizar cantidad por índice
        $('#product-list').off('keyup', '.input-qty').on('keyup', '.input-qty', (e) => {
            const input = $(e.currentTarget);
            const index = parseInt(input.data('index'));
            const value = parseFloat(input.val()) || 1;
            this.tempProductList[index].price = value;
        });
    }


    layout() {
        let nameCompany = '';

        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: "flex mx-2 my-2 h-full mt-5 p-2",
            card: {
                filterBar: { class: "w-full my-3 ", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full my-3 h-full bg-[#1F2A37] rounded-lg p-3", id: "container" + this.PROJECT_NAME },
            },
        });

        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabComponent",
            content: { class: "" },
            theme: "dark",
            type: 'short',
            json: [
                {
                    id: "company",
                    tab: "Empresa",
                    active: true,
                    onClick: () => { this.ls() },
                },

                {
                    id: "usuarios",
                    tab: "usuarios",
                    icon: "",
                    onClick: () => { },
                },

                {
                    id: "sucursal",
                    tab: "Sucursal",
                    icon: "",
                    onClick: () => { },
                },
            ],
        });



        // Titulo del modulo.

        $("#containerAdmin").prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold text-white">⚙️ Configuración de ${nameCompany}</h2>
                <p class="text-gray-400">Administra los datos de la empresa, los usuarios y sucursales de la aplicación.</p>
            </div>
        `);

        // usuarios.render();
        // sucursales.render();
        // company.render();
        // clausules.render();
        this.filterBarProductos()
    }



   
}
