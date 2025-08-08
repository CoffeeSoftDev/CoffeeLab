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
        this.viewReservation(12);
    }

    render() {
        this.layout();
        // this.createFilterBar();
    }

    async viewReservation(id) {
        const res = await useFetch({ url: this._link, data: { opc: "getReservation", id: id } });
        const data = res.data;

        bootbox.dialog({
            title: "📅 Reservación ",
            closeButton: true,
            message: '<div id="containerReservation"></div>',
           
        });


        this.detailCard({
          parent: "containerReservation",
        //   class:'cols-2',
          data: [
              {
                  text: "Estado",
                  value: data.status_process_id,
                  type: "status",
                  icon: "icon-spinner",
              },
            { text: "Evento", value: data.name_event, icon: "icon-calendar" },
            { text: "Nombre", value: data.name_client, icon: "icon-user-1" },
            { text: "Telefono", value: data.phone, icon: "icon-phone-1" },
            {
              text: "Creado el",
              value: data.date_creation,
              icon: "icon-calendar-1",
            },
            { text: "Correo", value: data.email, icon: "icon-mail-1" },

            { text: "Total", value: data.total_pay, icon: "icon-dollar" },
          ],
          id: id,

          subtitle: `Lugar: ${data.location}`,
        });



        // const status = statusMap[data.status_reservation_id] || { txt: "Desconocido", color: "bg-gray-400" };

        // const html = `
        //     <div class="text-white p-4 min-w-[350px]">
        //         <div class="flex items-center justify-between mb-2">
        //             <div class="flex items-center gap-2">
        //                 <span class="text-2xl"></span>
        //                 <h5 class="text-xl font-bold ml-2">📅 ${data.name_event || '-'}</h5>
        //             </div>
        //             <div class="flex gap-2">
        //                 <button class="btn btn-success rounded-lg px-4 py-1" id="btnShowRes"><i class="icon-check"></i> Show</button>
        //                 <button class="btn btn-danger rounded-lg px-4 py-1" id="btnNoShowRes"><i class="icon-block"></i> No Show</button>
        //             </div>
        //         </div>
        //         <!-- Info -->
        //         <div class="grid grid-cols-1  gap-x-6 gap-y-1 mt-2 mb-2">
        //             <div><span class="text-gray-400"><i class="icon-"></i> Estado:</span>   <span class="px-3 py-1 rounded-full text-xs font-bold ${status.color}">${status.txt}</span></div>
        //             <div><span class="text-gray-400"><i class="icon-user"></i> Cliente:</span> <b>${data.name_client || '-'}</b></div>
        //             <div><span class="text-gray-400"><i class="icon-phone"></i> Tel:</span> <b>${data.phone || '-'}</b></div>
        //             <div><span class="text-gray-400"><i class="icon-location"></i> Locación:</span> <b>${data.location || '-'}</b></div>
        //             <div><span class="text-gray-400"><i class="icon-calendar-2"></i> Fecha:</span> <b>${data.date_start || '-'} ${data.time_start || ''}</b></div>
        //             <div><span class="text-gray-400"><i class="icon-mail"></i> Correo:</span> <b>${data.email || '-'}</b></div>
        //             <div><span class="text-gray-400"><i class="icon-money"></i> Total:</span> <b>$${data.total_pay || '-'}</b></div>
        //         </div>
        //         <!-- Notas -->
        //         <div class="mb-2">
        //             <span class="text-gray-400"><i class="icon-clipboard"></i> Notas:</span>
        //             <div class="bg-[#28324c] rounded p-2 text-gray-300 mt-1">${data.notes || '-'}</div>
        //         </div>
        //         <!-- STATUS abajo -->
        //         <div class="flex items-center gap-2 mt-3"></div>
        //     </div>`;

        // bootbox.dialog({
        //     closeButton: true,
        //     title: "Detalle de Reservación",
        //     message: html,
        //     size: "large",
        //     onShown: function () {
        //         $("#btnShowRes").off().on("click", async () => {
        //             await useFetch({ url: this._link, data: { opc: "setShow", id: id, status_reservation_id: 2 } });
        //             alert({ icon: "success", text: "¡La reservación fue marcada como Show!" });
        //             $('.bootbox-close-button').trigger('click');
        //             app.ls();
        //         });
        //         $("#btnNoShowRes").off().on("click", async () => {
        //             await useFetch({ url: this._link, data: { opc: "setShow", id: id, status_reservation_id: 3 } });
        //             alert({ icon: "info", text: "La reservación fue marcada como No Show." });
        //             $('.bootbox-close-button').trigger('click');
        //             app.ls();
        //         });
        //     }.bind(this)
        // });
    }


    detailCard(options = {}) {
        const defaults = {
            parent: "body",
            title: "",
            subtitle: "",
            class: "space-y-2", // Por defecto una columna
            data: [],
            notes: "",
            onShow: () => { },
            onNoShow: () => { }
        };
        const opts = Object.assign({}, defaults, options);

        // Detecta si hay cols-2 en la clase
        const isCols2 = opts.class.includes("cols-2");
        let contentClass = isCols2
            ? `grid grid-cols-2 ${opts.class.replace("cols-2", "")}`
            : `flex flex-col ${opts.class}`;

        // Construcción del detalle
        let infoHtml = `<div class="${contentClass}">`;

        opts.data.forEach(item => {
            if (item.type === "status") {
                infoHtml += `
                <div class="flex items-center mb-1">
                    <span class="text-gray-400 font-medium flex items-center text-base">
                        ${item.icon ? `<i class="${item.icon} mr-2"></i>` : ""}
                        ${item.text}:
                    </span>
                    <span class="ml-2 px-3 py-1 rounded-full text-xs font-bold ${item.color || "bg-gray-500"}">${item.value}</span>
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

        // Bloque de notas
        let notesHtml = `
        <div class="mt-3">
            <label class="text-gray-400 font-medium text-base mb-1 block">Notas:</label>
            <div class="bg-[#28324c] rounded p-2 text-gray-300">${opts.notes || ""}</div>
        </div>
    `;

        // Layout final (card)
        const html = `
        <div class="text-white rounded-xl p-3 min-w-[320px]">
            ${infoHtml}
            ${notesHtml}
            <div class="flex gap-2 mt-4">
                <button class="btn btn-success rounded-lg px-4 py-1" id="btnShowRes">
                    <i class="icon-check"></i> Show
                </button>
                <button class="btn btn-danger rounded-lg px-4 py-1" id="btnNoShowRes">
                    <i class="icon-block"></i> No Show
                </button>
            </div>
        </div>
    `;

        // Renderiza en el parent
        $(`#${opts.parent}`).html(html);

        // Eventos (desacoplados)
        $(`#${opts.parent} #btnShowRes`).off().on("click", async () => {
            await opts.onShow();
        });
        $(`#${opts.parent} #btnNoShowRes`).off().on("click", async () => {
            await opts.onNoShow();
        });
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
