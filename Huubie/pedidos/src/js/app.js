let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';
let api = "https://huubie.com.mx/dev/reservaciones/ctrl/ctrl-reservaciones.php";
let sub, app;
$(function () {
    const app = new App(api, 'root');
    app.init();
    // sub.init();
});

class App extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Admin";
    }

    init() {
        this.render();
        this.showReservationModal(12);
    }

    render() {
        this.layout();
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



    createFilterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-4",
                    id: "calendar",
                    lbl: "Consultar fecha: ",
                },

                {
                    opc: "btn",
                    class: "col-sm-2",
                    color_btn: "primary",
                    id: "btn",
                    text: "Buscar",
                    fn: `${this.PROJECT_NAME.toLowerCase()}.ls()`,
                },
            ],
        });

        dataPicker({
            parent: "calendar",
            onSelect: () => this.ls(),
        });
    }

    filterBarProductos() {
        const container = $("#container-company");
        container.html('<div id="filterbar-company" class="mb-2"></div><div id="table-company"></div>');

        this.createfilterBar({
            parent: "filterbar-company",
            data: [
                {
                    opc: "select",
                    id: "estado-productos",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Disponibles" },
                        { id: "0", valor: "No disponibles" }
                    ],
                    // onchange: () => this.lsProductos()
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoProducto",
                    text: "Nuevo Producto",
                    onClick: () => this.addProducto(),
                },
            ],
        });


        // setTimeout(() => this.lsProductos(), 50);
    }

    ls() {
        let rangePicker = getDataRangePicker("calendar");

        this.createTable({
            parent: `table-company`,
            idFilterBar: `filterbar-company`,
            data: { opc: "listProductos" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbProductos",
                theme: 'dark',
                right: [2],
                center: [3, 6]
            },
        });
    }
}
