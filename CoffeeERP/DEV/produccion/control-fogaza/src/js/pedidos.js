const ctrl = "ctrl/ctrl-pedidos.php";
const ctrl_list = "ctrl/ctrl-pedidos-list.php";

let pos, pedidos, products;

let grupo, productos, tickets, colaboradores, idFolio;

/* Init components */
$(function () {
    fn_ajax({ opc: "init" }, ctrl).then((data) => {

        grupo = data.grupo;
        productos = data.productos;
        tickets = data.tickets;
        colaboradores = data.colaboradores;

        pos = new App(ctrl, "root");
        pedidos = new ListaPedidos(ctrl_list, '');
        products = new Products(ctrl, '');

        pos.initComponents();
        pedidos.render();
        products.initComponents();

    });
});

class App extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    initComponents() {
        this.render();
    }

    render() {

        // app gral
        this.tabPedidos();

        // ticket
        this.layout();
        this.filterBarTicket();
        this.cardEndTicket();
        this.cardEmpty();

        // box
        this.searchItems();
        this.ButtonGroups();

        this.cardTicket();

    }

    tabPedidos() {
        let jsonTabs = [
            { tab: "Pedidos Pasteleria", id: "pedidos", active: true },
            { tab: "Lista de pedidos", id: "tab-lista-pedidos", fn: "pedidos.lsPedidos()" },
            { tab: "Productos", id: "tab-products", fn: "products.ls()" },
        ];

        $("#" + this._div_modulo).simple_json_tab({ data: jsonTabs });
    }

    layout() {
        let jsonComponents = {
            id: "content",
            class: "d-flex mx-2 my-3 gap-2 ",

            contenedor: [
                {
                    type: "div",
                    id: "ticket",
                    class: "d-flex flex-column gap-2 h-[80vh] col-4 col-lg-4 col-sm-5 line",

                    children: [
                        { class: "w-full py-2", id: "containerSelected" },
                        { class: "w-full flex-grow-1 mt-1 overflow-x-auto", id: "containerTicket" },
                        { class: "w-full  ", id: "totalTicket" },
                        { class: "col-12   ", id: "cardEndTicket" },

                    ],
                },
                {
                    type: "div",
                    id: "box",
                    class: "d-flex flex-col  gap-2 col-8 col-lg-8 col-sm-7 me-2  box-panel line",

                    children: [

                        { type: 'h5', class: ' text-muted w-100 font-bold ', text: 'Elige el tamaño del pastel:' },

                        { class: "col-12 items-center line", id: "groupButtons" },
                        { class: "col-12 text-end  d-flex  ", id: "containerSearch" },
                        { class: "w-full flex-grow-1 line  ", id: "containerBox" },

                    ],
                },


            ],
        };

        this.createPlantilla({
            data: jsonComponents,
            parent: "pedidos",
            design: false,
        });
    }

    // app.ticket.

    filterBarTicket() {
        this.createfilterBar({
            id: "frm",
            parent: "containerSelected",
            data: [

                {
                    opc: "btn-select",
                    id: "NoFolio",
                    class: "col-8 ",
                    lbl: 'Seleccionar un pedido:',
                    fn: 'pos.cardTicket()',
                    onchange: 'pos.cardTicket()',
                    icon: "icon-search",
                    data: tickets,
                    required: false,
                    selected: "-- Elige un folio para continuar--",
                },
                {
                    opc: 'button',
                    id: 'btnNewTicket',
                    text: 'Nuevo',
                    color_btn: 'success',
                    class: 'col-4',
                    className: 'w-100',
                    onClick: () => { this.modalNuevoTicket(); }
                },

            ],
        });

    }

    cardTicket(options) {

        if ($('#NoFolio').val() > 0) {
            this.enabledGroupButtons({ parent: 'cardEndTicket' });
            this.enabledGroupButtons({ parent: 'groupButtons' });
            this.enabledGroupButtons({ parent: 'filterTicket', file: true, index: 0 });
            this.useAjax({
                data: { opc: 'getProductsByFol', NoFolio: $('#NoFolio').val() },
                success: (data) => {

                    if (data.row.length) {

                        this.createItemCard({ parent: 'containerTicket', data: data });

                    } else {
                        this.cardEmpty();
                    }
                }
            });


        } else {

            this.initialState();
        }
    }

    initialState() {
        this.cardEmpty();
        $('#containerBox').empty();
        $('#totalTicket').empty();
        this.disabledGroupButtons({ parent: 'filterTicket', file: true, index: 0 });
        this.disabledGroupButtons({ parent: 'cardEndTicket' });
        this.disabledGroupButtons({ parent: 'groupButtons' });
    }

    async addPayment() {

        let numero = parseFloat($('#total').text().replace('$', ''));

        this.createModalForm({
            id: "modalRegisterPayment",
            bootbox: {
                title: `
                <div class="flex items-center gap-2  text-lg font-semibold">
                    <i class="icon-dollar text-blue-400 text-xl"></i>
                   CERRAR TICKET DE VENTA
                </div>`,
                id: "registerPaymentModal",
                size: "medium"
            },
            autovalidation: true,
            data: { opc: 'endTicket', Total: numero, idFolio: $("#NoFolio").val() },
            json: [
                {
                    opc: "div",
                    id: "Amount",
                    class: "col-12",
                    html: `
                        <div class="rounded-xl p-4 mb-2 border border-gray-600">
                            <div class="flex justify-between items-center mb-2 ">
                                <span class="text-sm">Precio original:</span>
                                <span class="font-medium">$<span id="originalPrice">${numero.toFixed(2)}</span></span>
                            </div>
                            <div class="flex justify-between items-center mb-2 text-red-400">
                                <span class="text-sm font-semibold">Descuento:</span>
                                <span class="font-medium">-$<span id="discountAmount">0.00</span></span>
                            </div>
                            <div class="flex justify-between items-center pt-2 mt-2 border-t border-gray-200 ">
                                <span class="text-base font-semibold">Total a pagar:</span>
                                <span class="text-lg font-bold">$<span id="finalPrice">${numero.toFixed(2)}</span></span>
                            </div>
                        </div>
                        <div id="dueAmount" class="p-4 rounded-xl text-center border border-gray-700 mt-3 hidden">
                            <p class="text-sm opacity-80">Monto a pagar</p>
                            <p id="SaldoEvent" class="text-3xl font-bold mt-1">
                                $${numero}
                            </p>
                        </div> `
                },

                {
                    opc: "input-group",
                    lbl: "Descuento",
                    id: "descuento",
                    tipo: "cifra",
                    icon: "icon-percent",
                    class: "col-12 py-2",
                    placeholder: "0.00",
                    required: false,
                    onkeyup: "calculateWithDiscount()"
                },



                {
                    opc: "div",
                    id: "paymentToggle",
                    class: "col-12 mb-2",
                    html: `
                    <div class="flex items-center justify-between p-3 rounded-lg border border-gray-700">

                        <div class="flex items-center gap-2">
                            <i id="iconPaymentFields" class="icon-eye text-gray-400 transition-colors duration-200"></i>
                            <label id="labelPaymentFields" class="text-sm">Mostrar campos de pago detallados</label>
                        </div>
                        <label class="inline-flex items-center cursor-pointer relative">
                            <input type="checkbox" id="togglePaymentFields" class="sr-only peer" onchange="toggleFields(this.checked)">
                            <div class="w-11 h-6 bg-gray-700 peer-checked:bg-blue-600 rounded-full transition-colors duration-300"></div>
                            <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                        </label>
                    </div> `
                },



                {
                    opc: 'input-group',
                    lbl: 'Efectivo',
                    id: 'efectivo',
                    tipo: 'cifra',
                    icon: 'icon-dollar',
                    class: 'col-sm-12 col-12 mb-2',
                    placeholder: '0.00',
                    required: false,
                    onkeyup: 'CalculoDiferencia()'
                },
                {
                    opc: 'input-group',
                    lbl: 'Transferencia',
                    id: 'tdc',
                    tipo: 'cifra',
                    icon: 'icon-dollar',
                    class: 'col-sm-12 col-12 mb-2',
                    onkeyup: 'CalculoDiferencia()',
                    required: false,
                    placeholder: '0.00',
                },
                {
                    opc: 'input-group',
                    lbl: 'Diferencia',
                    tipo: 'cifra',
                    id: 'diferencia',
                    icon: 'icon-dollar',
                    value: numero,
                    class: 'col-sm-12 col-12 py-2',
                    placeholder: '0.00',
                    required: false,
                    disabled: true
                },



                {
                    opc: 'btn-submit',
                    tipo: 'cifra',
                    id: 'btnTerminarTicket',
                    color: 'outline-primary',
                    text: 'Terminar pedido',
                    class: 'col-12 py-3'
                },

            ],
            success: (response) => {
                if (response.status == 200) {
                    this.initialState();
                    alert({ icon: "success", text: "¡El pedido se ha creado correctamente!", timer: 1000 });

                } else {
                    alert({ icon: "error", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });

        // toogle.
        toggleFields()


    }



    modalPaymentMethod() {
        let numero = parseFloat($('#total').text().replace('$', ''));

        this.createModalForm({
            id: 'modalPayment',
            bootbox: { title: 'TICKET DE VENTA' }, // agregar conf. bootbox
            json: [
                {
                    opc: 'radio',
                    name: 'tipo',
                    value: 1,
                    text: 'Sin Anticipo',
                    class: 'col-sm-6 col-12 py-3',
                    onchange: 'toggleInputs({hide:true})',
                    checked: true
                },
                {
                    opc: 'radio',
                    name: 'tipo',
                    value: 2,
                    text: 'Dejo anticipo',
                    class: 'col-sm-6 col-12 text-center py-3',
                    onchange: 'toggleInputs({hide:false})',
                    checked: false
                },
                {
                    opc: 'hr',
                    class: 'w-100'
                },
                {
                    opc: 'input-group',
                    lbl: 'Precio',
                    id: 'costo',
                    class: 'col-12 mt-2',
                    placeholder: '0.00',
                    value: numero,
                    disabled: true,
                    required: false,
                    icon: 'icon-dollar',
                    tipo: 'cifra'
                },
                {
                    opc: 'input-group',
                    lbl: 'Efectivo',
                    id: 'efectivo',
                    tipo: 'cifra',
                    icon: 'icon-dollar',
                    class: 'col-sm-4 col-12 py-2',
                    placeholder: '0.00',
                    required: false,
                    onkeyup: 'CalculoDiferencia()'
                },
                {
                    opc: 'input-group',
                    opc: 'input-group',
                    lbl: 'Transferencia',
                    id: 'tdc',
                    tipo: 'cifra',
                    icon: 'icon-dollar',
                    class: 'col-sm-4 col-12 py-2',
                    onkeyup: 'CalculoDiferencia()',
                    required: false,
                    placeholder: '0.00',
                },
                {
                    opc: 'input-group',
                    lbl: 'Diferencia',
                    tipo: 'cifra',
                    id: 'diferencia',
                    icon: 'icon-dollar',
                    value: numero,
                    class: 'col-sm-4 col-12 py-2',
                    placeholder: '0.00',
                    required: false,
                    disabled: true
                },
                {
                    opc: 'btn-submit',
                    tipo: 'cifra',
                    id: 'btnTerminarTicket',
                    color: 'outline-primary',
                    text: 'Terminar pedido',
                    class: 'col-12 py-3'
                },
            ],
            autovalidation: true,
            data: { opc: 'endTicket', Total: numero, idFolio: $("#NoFolio").val() },
            success: (data) => {
                this.initialState();
                alert({ icon: "success", text: "¡El pedido se ha creado correctamente!", timer: 1000 });

            }
        });

        toggleInputs({ hide: true });

    }

    cardEndTicket() {

        // events.
        let closeTicket = () => {
            // this.modalPaymentMethod();
            this.addPayment();

        }

        let cancelTicket = () => {
            this.swalQuestion({

                opts: { title: `¿Esta seguro de cancelar el pedido ?` },
                data: { opc: 'cancelTicket', idFolio: $('#NoFolio').val() },
                methods: {
                    request: (data) => {
                        $('#NoFolio option[value="' + $('#NoFolio').val() + '"]').remove();
                        this.initialState();
                    }
                }
            });
        }

        // Components.
        this.createButtonGroup({
            parent: 'cardEndTicket', data: [
                {
                    id: "btnCerrarCuenta",
                    text: "Terminar",
                    icon: 'icon-truck',
                    color: 'outline-primary',
                    onClick: () => { closeTicket() },
                    class: 'col-sm-6 col-12'
                },
                {
                    color: 'outline-danger',
                    class: 'col-sm-6 col-12',
                    icon: ' icon-cancel-circle',
                    onClick: () => { cancelTicket() },
                    text: 'Cancelar'
                }
            ], size: 'sm', cols: 'w-50'
        });

    }

    createItemCard(options) {

        let defaults = { parent: '', data: [], type: 'details' };
        let opts = { ...defaults, ...options };
        let container = $('<div>');
        let data = opts.data.head.data;


        let head = `
            <div class="flex-1 text-xs text-uppercase" >
                <div class="mb-2 grid grid-cols-2 gap-1 line ">
                    <div>
                        <div class="font-bold  text-gray-600 "> NOMBRE: </div>
                        <div class="text-muted ">${data.cliente}</div>
                    </div>
                    <div>
                        <div class="font-bold text-gray-600 text-right">FECHA Y HORA DE ENTREGA: </div>
                        <div class="text-muted text-right">${data.pedido}</div>
                    </div>
                    </div>
                </div>
            </div>
        `;

        container.append(head);

        options.data.row.map((Element) => {
            const divBox = $('<div>', {
                class: 'border border-gray-100 rounded-md p-2 mb-2 bg-white'
            });

            let custom = Element.data[0];
            console.log(Element.countImages)
            let countImages = Element.countImages; // ← Esta línea es nueva


            const photoHandler = () => {
                const file = $("#photo-receta")[0].files[0];
                if (file) {
                    const span = $("#content_photo span");
                    span.css({ display: "flex" }).html('<i class="animate-spin icon-spin6"></i>');
                    setTimeout(() => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            $("#img-photo").attr("src", e.target.result);
                            span.hide().removeAttr("style").addClass("text-uppercase").html('<i class="icon-edit"></i>');
                        };
                        reader.readAsDataURL(file);
                    }, 500);
                }
            };

            const iconContainer = () => {
                const span = $('<span>', {
                    class: 'text-sm text-gray-600 cursor-pointer',
                }).append($('<i>', { class: 'icon-birthday text-2xl text-gray-400' }));

                const fileInput = $('<input>', {
                    type: 'file',
                    class: 'hidden',
                    id: 'photo-receta',
                    accept: '.jpg, .jpeg, .png'
                }).on('change', photoHandler);

                const containerClass = Element.src
                    ? 'w-24 h-24 p-1 bg-gray-100 rounded overflow-hidden'
                    : 'flex w-24 h-24 bg-gray-100 rounded items-center justify-center';

                const content = Element.src
                    ? $('<img>', {
                        src: 'https://erp-varoch.com/' + Element.src,
                        class: 'w-full h-full object-cover rounded',
                        id: 'img-photo',
                    })
                    : null;

                const imageBox = $('<div>', {
                    class: containerClass,
                    id: 'content_photo'
                }).append(fileInput, content, span);

                const wrapper = $('<div>', { class: 'flex flex-col items-center' }).append(imageBox);

                if (countImages > 0) {
                    const spanInfo = $('<span>', {
                        class: 'block text-center mt-1 text-xs text-gray-500',
                        // html: `<i class="icon-camera"></i> ${countImages}  subidas`,
                        html: `<button class="text-blue-500 underline text-xs" onclick="pos.modalShowImages(${Element.id})">Ver ${countImages} imagenes</button>`,
                    });
                    wrapper.append(spanInfo); // ✅ fuera del contenedor, pero justo debajo
                }

                return wrapper;
            };


            const detailsContainer = () => {
                const container = $('<div>', {
                    class: 'flex flex-col gap-y-1 flex-1'
                });

                const costo = parseFloat(Element.costo) || 0;
                const leyenda = Element.leyenda || '-';

                const oblea = custom?.importeOblea ? parseFloat(custom.importeOblea) : 0;
                const base = custom?.importeBase ? parseFloat(custom.importeBase) : 0;

                const total = costo + oblea + base;

                const info = {
                    Modelo: Element.valor,
                    Leyenda: leyenda,
                    Precio: `1 x ${formatPrice(costo)}`,
                    ...(oblea ? { "Importe Oblea": formatPrice(oblea) } : {}),
                    ...(base ? { "Importe Base": formatPrice(base) } : {}),
                    ...((oblea || base) ? { "Total": formatPrice(total) } : {})
                };

                Object.entries(info).forEach(([key, value]) => {
                    const isImporte = key.includes('Importe') || key === 'Total';

                    const row = $('<div>', { class: 'flex items-start' });

                    row.append(
                        $('<div>', {
                            class: 'w-28 text-xs font-semibold text-gray-700 pr-2',
                            html: `${key}:`
                        }),
                        $('<div>', {
                            class: `flex-1 text-xs text-gray-600 ${isImporte ? 'ms-3' : ''}`,
                            html: value
                        })
                    );

                    container.append(row);
                });

                return container;
            };

            const buttonsContainer = () => $('<div>', {
                class: 'flex flex-col items-center justify-start gap-2'
            }).append(
                $('<button>', {
                    class: 'text-blue-500 hover:text-blue-700',
                    html: '<i class="icon-edit text-lg"></i>',
                    click: () => {
                        this.editOrderProduct(Element.id)
                    }
                }),
                $('<button>', {
                    class: 'text-red-500 hover:text-red-700',
                    html: '<i class="icon-trash text-lg"></i>',
                    click: () => this.removeItem(Element.id)
                })
            );

            const cardBox = $('<div>', {
                class: 'flex gap-4'
            }).append(iconContainer(), detailsContainer(), buttonsContainer());

            divBox.append(cardBox);

            const observaciones = Element.data[0]?.observaciones?.trim();
            if (observaciones) {
                divBox.append($('<div>', {
                    class: 'text-xs text-gray-600 mt-2',
                    html: `<strong>Nota: </strong>  ${observaciones}`
                }));
            }

            container.append(divBox);
        });

        var nota = $('<div>', { class: 'mt-2 border-t ' })
            .append($('<p>', { class: 'text-gray-600 text-sm font-semibold', text: 'NOTA:' }))
            .append($('<p>', { class: 'bg-gray-100 text-gray-700 p-2 my-3 rounded-md', text: '' || 'Sin comentarios adicionales' }));


        $('#totalTicket').html(options.data.frm_foot);




        $('#' + opts.parent).html(container);
    }

    searchItems() {

        const search = () => {
            const busqueda = $('#searchInput').val();
            const products = document.querySelectorAll('#containerBox .card');

            products.forEach(function (product) {
                const label = product.querySelector('.card-content label').textContent.toLowerCase(); // Texto del nombre
                if (label.includes(busqueda)) {
                    product.style.display = ''; // Mostrar si coincide
                } else {
                    product.style.display = 'none'; // Ocultar si no coincide
                }
            });

        };

        // Crear component de busqueda.
        let ipt = $('<input>', {
            id: 'searchInput', class: 'form-control w-100', placeholder: 'Buscar producto'
        }).on('keyup', search);

        let div = $('<div>', { class: 'col-sm-4 col-12 mt-2' }).append(ipt);
        $('#containerSearch').empty().append(div);
    }

    removeItem(idProduct) {

        this.swalQuestion({
            opts: {
                title: '¿Deseas quitar el siguiente producto de la lista?',
            },
            data: {
                opc: 'removeItem',
                id: idProduct
            },
            methods: {
                request: (data) => {

                    this.cardTicket();

                }
            }
        });
    }

    async modalShowImages(id) {
        let request = await useFetch({
            url: this._link,
            data: {
                opc: "getTicket",
                idFolio: $('#NoFolio').val(),
                id_producto: id
            },
        });
        const modal = bootbox.dialog({
            closeButton: true,
            title: 'Imágenes del producto',
            message: `<div id="previewImagenes" class="flex gap-2 flex-wrap mt-1"></div>`
        });
        this.renderImagesEnlarged(request.orderImages, 'previewImagenes');
    }

    // Order Product
    async editOrderProduct(id) {
        let request = await useFetch({
            url: this._link,
            data: {
                opc: "getTicket",
                idFolio: $('#NoFolio').val(),
                id_producto: id
            },
        });

        const modal = bootbox.dialog({
            closeButton: true,
            title: 'Editar pedido',
            message: `<div><form id="formAddItems" novalidate></form></div>`
        });

        this.createdForm({
            id: "formAddItems",
            parent: "formAddItems",
            autofill: request.data,
            autovalidation: false,
            data: [],

            json: [
                ...this.jsonCake(),
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
                                onchange="pos.previewSelectedImages(this, 'previewImagenes')"
                            >
                            <div class="flex flex-col items-center justify-center py-2 cursor-pointer" onclick="document.getElementById('archivos').click()">
                                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                                <i class="icon-upload text-white"></i>
                                </div>
                                <p class="text-xs">
                                   Arrastra & Pega o <span class="text-blue-400 underline">sube una imagen</span>
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
                        formData.append("idFolio", $('#NoFolio').val());

                        const files = document.getElementById('archivos').files;
                        for (let i = 0; i < files.length; i++) formData.append('archivos[]', files[i]);



                        fetch(this._link, {
                            method: "POST", // Método HTTP
                            body: formData, // FormData como cuerpo de la solicitud
                        })
                            .then((response) => { })
                            .then((data) => {
                                pos.cardTicket();
                                modal.modal('hide');
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

        this.renderImages(request.orderImages, 'previewImagenes');
    }

    renderImages(images, previewId) {
        const previewContainer = document.getElementById(previewId);
        previewContainer.innerHTML = ""; // Limpia primero

        const urlBase = 'https://erp-varoch.com/';

        images.forEach(imgData => {
            const img = document.createElement("img");
            img.src = urlBase + imgData.path; // Usamos el path tal cual
            img.alt = imgData.original_name || "Imagen del producto";
            img.classList.add("w-28", "h-28", "object-cover", "rounded", "border");
            previewContainer.appendChild(img);
        });
    }

    renderImagesEnlarged(images, previewId) {
        const previewContainer = document.getElementById(previewId);
        previewContainer.innerHTML = ""; // Limpia primero

        const urlBase = 'https://erp-varoch.com/';

        images.forEach(imgData => {
            const img = document.createElement("img");
            img.src = urlBase + imgData.path; // Usamos el path tal cual
            img.alt = imgData.original_name || "Imagen del producto";
            img.classList.add("w-48", "object-cover", "rounded", "object-cover");
            previewContainer.appendChild(img);
        });
    }

    jsonCake() {
        return [
            { opc: 'input-group', lbl: 'Nombre de pedido', id: 'name', class: 'col-12 mb-2', icon: 'icon-birthday', required: false },
            { opc: 'input-group', lbl: 'No Personas', placeholder: 'Indica el número de personas', id: 'portion', class: 'col-12 mb-2', tipo: 'cifra', icon: 'icon-user-1', required: false },
            { opc: 'input-group', lbl: 'Precio', id: 'costo', class: 'col-6 mb-2', placeholder: '0.00', required: false, icon: 'icon-dollar', tipo: 'cifra' },
            { opc: 'input-group', lbl: 'Importe base', placeholder: '0.00', id: 'importeBase', class: 'col-6 mb-2', tipo: 'cifra', icon: 'icon-dollar', required: false },
            { opc: 'input-group', lbl: 'Importe Oblea', placeholder: '0.00', id: 'importeOblea', class: 'col-6 mb-2', tipo: 'cifra', icon: 'icon-dollar', required: false },
            { opc: 'input', lbl: 'Leyenda', id: 'leyenda', class: 'col-6 mb-2' },
            { opc: 'input', lbl: 'Relleno', id: 'relleno', class: 'col-6 mb-2', required: false },
            { opc: 'input', lbl: 'Sabor de pan', id: 'saborPan', class: 'col-6 mb-2', required: false },
            { opc: 'textarea', lbl: 'Observaciones', id: 'observaciones', class: 'col-12' },
        ];
    }

    async modalEditTicket(id) {

        let data = await useFetch({
            url: this._link,
            data: { opc: 'getTicket', idFolio: $('#NoFolio').val(), id_producto: id }
        });


        let product = data.producto;
        let personalizado = data.personalizado;

        // crear modal.

        let modal = bootbox.dialog({
            title: 'Editar pedido ',
            closeButton: true,
            message: `<form class="" id="editItems"  novalidate></form> `,
        });


        // add formulario.

        $('#editItems').content_json_form({
            type: '',
            data: [

                {
                    opc: 'input-group',
                    lbl: 'Precio',
                    id: 'costo',
                    class: 'col-12',
                    placeholder: '0.00',
                    required: false,
                    icon: 'icon-dollar',
                    tipo: 'cifra',
                    value: product.costo
                },
                {
                    opc: 'textarea',
                    lbl: 'Leyenda',
                    id: 'leyenda',
                    value: product.leyenda,
                    class: 'col-12'
                },
                {
                    opc: 'input-group',
                    lbl: 'Importe base',
                    id: 'importeBase',
                    class: 'col-12',
                    tipo: 'cifra',
                    icon: 'icon-dollar',
                    value: personalizado?.base || '',
                    required: false
                },
                {
                    opc: 'input',
                    lbl: 'Relleno',
                    id: 'relleno',
                    class: 'col-12',
                    value: personalizado?.relleno || '',
                    required: false
                },
                {
                    opc: 'textarea',
                    lbl: 'Observaciones',
                    id: 'observaciones',
                    value: personalizado?.observaciones || '',

                    class: 'col-12'
                },
                {
                    opc: 'input',
                    type: 'file',
                    required: false,
                    id: 'archivos',
                    class: 'col-6 h-24 w-full'
                },

                {
                    opc: 'button',
                    id: 'btnEditPedido',
                    className: 'w-100',
                    class: 'col-12',
                    text: 'Actualizar pedido',

                    onClick: () => {

                        const form = document.getElementById('editItems');
                        let formData = new FormData(form);

                        formData.append('opc', 'updateItem');
                        formData.append('id', id);
                        formData.append('idFolio', $('#NoFolio').val());

                        fetch(this._link, { method: 'POST', body: formData }).then(response => { }).then(data => {
                            this.cardTicket();
                            modal.modal('hide');
                        });
                    }

                },




            ],

        });


    }

    // Box -  .
    ButtonGroups() {

        this.createButtonGroup({
            parent: "groupButtons",
            onClick: () => { this.CardItems() },
            dataEl: {
                icon: "icon-shop",
                data: grupo,
                size: "lg",
            },
        });
    }

    async CardItems() {

        let idCard = event.currentTarget.getAttribute('id');

        let products = await useFetch({
            url: ctrl,
            data: {
                opc: "getProductsBy",
                id: idCard,

            }

        });

        this.createGridCard({
            data: products,
            type: 'pos',
            color: "bg-gray-100 text-xs",
            class: 'grid grid-cols-6 overflow-y-auto max-h-[500px] gap-2',
            parent: "containerBox",
            onClick: () => {


                this.addProduct();
            },
        });
    }

    createGridCard(options) {

        let defaults = {

            parent: '',
            color: 'bg-default',
            data: [{ id: 1, nombre: 'BOSQUE DE CHOCOLATE' }],
            size: 'soft',
            type: '',
            image: true,
            class: 'grid-container'

        };

        let opts = Object.assign(defaults, options);
        let divs = $('<div>', { class: opts.class, id: 'gridcontainer' });


        opts.data.forEach((element) => {



            if (opts.type == 'catalog') {
                var img = "https://15-92.com/ERP3/src/img/default_flower.png";
                var grid_item = $('<div>', { class: ` ${opts.color} grid-item  `, onClick: element.onclick });
                var link = (element.attr.src) ? element.attr.src : img;
                var imagen = $('<img>', { src: link, class: 'col-12' });

                // add image.
                var details = $('<div>', { class: 'col-12 div1 pointer' }).append(imagen);

                // add text.
                var description = $('<div>', { class: 'col-12 bg-primary d-flex flex-column pt-1 div2 pointer' });
                var h6 = $('<label>', { text: element.nombre, class: 'fw-bold col-12' });
                var sub = $('<sub>', { text: element.costo, class: 'fw-bold py-2' })

                description.append(h6, sub);
                // draw grid items.
                grid_item.append(details, description);

            } else if (opts.type == 'almacen') {
                // Config. Evento onclick.

                let props = {
                    onclick: element.onclick
                }

                if (opts.onClick) {
                    props = {
                        click: opts.onClick
                    }
                }


                // Config. disponibilidad.

                const disp = element.disponible ? element.disponible : '';
                var class_disp = element.disponible == 0 ? 'disabled bg-gray-200 text-gray-400' : 'hover:shadow-md hover:bg-slate-800 hover:text-gray-100 ';
                var especial = element.especial ? element.especial : 0;
                var price = especial > 0 ? element.especial : element.costo;

                var card = $('<div>', {

                    id: element.id,
                    costo: price ? price : 0,
                    class: 'card h-32 transition-all text-center pointer ' + class_disp,

                    ...props
                });



                var details = $('<div>', { class: 'p-2 card-content flex flex-col py-3 gap-2 w-full ' });
                var label = $('<label>', { text: element.nombre ? element.nombre : element.valor, class: 'fw-semibold text-uppercase text-xs' });
                var precio = $('<label>', { class: ` ${especial > 0 ? ' text-lime-600 ' : ''} font-bold text-lg`, text: element.costo ? formatPrice(price) : '' });
                var text_almacen = $('<span>', { class: `text-xs font-semibold ${disp == 0 ? 'text-red-400 font-bold' : 'text-gray-400'} `, html: disp == 0 ? 'Sin stock' : `disponibles: ` });

                var almacen = $('<span>', { id: 'cantidad' + element.id, class: `text-xs font-semibold text-gray-400 `, html: disp == 0 ? '' : disp })

                var container_disponibilidad = $('<div>', { class: 'flex justify-center items-center' }).append(text_almacen, almacen);
                details.append(label, precio, container_disponibilidad);

                card.append(details);
                divs.append(card);



            } else if (opts.type == 'pos') {

                let props = {
                    onclick: element.onclick
                };
                if (opts.onClick) {
                    props = {
                        click: opts.onClick
                    };
                }

                const disp = element.disponible ? element.disponible : '';
                const class_disp = element.disponible == 0
                    ? 'disabled bg-gray-200 text-gray-400'
                    : 'hover:shadow-md hover:bg-slate-800 hover:text-gray-100';

                const card = $('<div>', {
                    id: element.id,
                    costo: element.costo || 0,
                    class: 'card h-52 transition-all text-center pointer flex flex-col justify-between ' + class_disp,
                    ...props
                });

                // Imagen o icono
                let mediaContainer = element.src
                    ? $('<div>', {
                        class: 'w-full h-32 p-1 flex justify-center items-center',
                    }).append(
                        $('<img>', {
                            class: 'rounded-md object-cover w-full h-full',
                            src: element.src,
                            alt: element.nombre || "Imagen"
                        })
                    )
                    : $('<div>', {
                        class: 'mx-2 py-4 mt-2 bg-gray-200 rounded-lg text-center flex justify-center items-center h-32',
                    }).append(
                        $('<i>', {
                            class: 'icon-birthday text-[42px] text-blue-900 drop-shadow-lg'
                        })
                    );

                // Título
                let label = $('<div>', {
                    class: 'fw-semibold text-xs text-gray-700 uppercase truncate px-2 pb-1',
                    text: element.nombre || element.valor
                });

                // Precio + isRecent
                let priceRow = $('<div>', {
                    class: 'flex justify-between items-center px-2 pb-2 text-sm'
                });

                // Precio
                priceRow.append(
                    $('<span>', {
                        class: 'text-sm font-bold text-gray-700',
                        text: element.costo ? formatPrice(element.costo) : ''
                    })
                );

                // Badge "Nuevo"
                if (element.isRecent) {
                    priceRow.append(
                        $('<span>', {
                            class: 'text-[10px] bg-green-700 text-white px-2 py-[1px] rounded-full font-bold',
                            text: ' Nuevo'
                        })
                    );
                }

                // Armar card
                card.append(mediaContainer, label, priceRow);
                divs.append(card);


            } else {

                let props = { // propiedades del evento click/onClick
                    onclick: element.onclick
                }
                if (opts.onClick) {
                    props = {
                        click: opts.onClick
                    }
                }

                var grid_item = $('<div>', {

                    id: element.id,
                    costo: element.costo ? element.costo : 0,
                    class: ` ${opts.color} grid-item-${opts.size}  `,
                    ...props
                    // click: element.onclick ? element.onclick : opts.onClick
                });

                // add cost.
                var details = $('<div>', { class: 'col-12 pointer' });
                var lbl = $('<label>', { text: element.costo ? formatPrice(element.costo) : '', class: 'col-12 fw-semibold py-2 text-muted' });
                details.append(lbl);
                // add text.
                var description = $('<div>', { class: 'col-12 fw-bold d-flex flex-column pt-1 div1 pointer' });
                var label = $('<label>', { text: element.nombre ? element.nombre : element.valor, class: 'fw-bold col-12' });
                description.append(label);
                // draw grid items.
                grid_item.append(description, details);

            }

            divs.append(grid_item);


        });

        $('#' + opts.parent).html(divs);

    }

    // Pedidos
    addProduct() {
        
        let idCard   = event.currentTarget;
        let costo    = idCard.getAttribute('costo') || '0';
        let idPedido = idCard.getAttribute('id');
        let nombre   = idCard.querySelector('.fw-semibold')?.textContent.trim() || 'Sin nombre';


        const modal = bootbox.dialog({
            closeButton: true,
            title: `
                <div class="flex items-center gap-3">
                  
                    <div>
                        <h2 class="text-lg font-bold mb-2"> Agregar producto</h2>
                        <p class="text-sm text-gray-700">
                            <i class="icon-doc-text-1"></i> Pastel base: ${nombre} | 
                            Precio: ${formatPrice(costo) }
                        </p>
                    </div>
                </div>
            `,
        
            message: `<div><form id="containerForm" novalidate></form></div>`
        });

        this.createForm({
            id: 'formAddItems',
            parent: 'containerForm',
            autovalidation: false,
            data: [],
            json: [
             
                { opc: 'radio', name: 'tipo', value: 1, text: 'Normal', onchange: 'pos.onShowPedidos()', class: 'col-sm-6 col-12 mb3-3', checked: true },
                { opc: 'radio', name: 'tipo', value: 2, text: 'Personalizado', onchange: 'pos.onShowPedidos({ hide:false })', class: 'col-sm-6 col-12 mb-3' },
                ...pos.jsonCake(),
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
                                onchange="pos.previewSelectedImages(this, 'previewImagenes')"
                            >
                            <div class="flex flex-col items-center justify-center py-2 cursor-pointer" onclick="document.getElementById('archivos').click()">
                                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                                <i class="icon-upload text-white"></i>
                                </div>
                                <p class="text-xs">
                                   Arrastra & Pega o <span class="text-blue-400 underline">sube una imagen</span>
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
                        const form = document.getElementById('containerForm');
                        const formData = new FormData(form);

                        formData.append('opc', 'addItem');
                        formData.append('id_producto', idPedido);
                        formData.append('nombre_producto', nombre);
                        formData.append('costo_producto', costo);
                        formData.append('idFolio', $('#NoFolio').val());

                        const files = document.getElementById('archivos').files;
                        for (let i = 0; i < files.length; i++) formData.append('archivos[]', files[i]);

                        fetch(this._link, {
                            method: 'POST', // Método HTTP
                            body: formData, // FormData como cuerpo de la solicitud

                        }).then(response => { }).then(data => {

                            pos.cardTicket();
                            modal.modal('hide');
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

        //Agregar nombre del pedido.
        // document.getElementById('name').value = title.textContent.trim();
        document.getElementById('costo').value = costo;

        this.onShowPedidos({
            positions: [4, 5, 6, 7, 8, 9, 11]
        });

    }

    addProducts() {
        let idCard = event.currentTarget;
        let title = idCard.querySelectorAll("label")[0];
        let costo = event.currentTarget.getAttribute('costo');
        let idPedido = idCard.getAttribute('id');


        // crear modal.
        let modal = bootbox.dialog({
            title: ' PASTEL BASE :   <span class="text-primary">  ' + title.textContent + '   </span>',
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
                    checked: false
                },
                {
                    opc: 'radio',
                    name: 'tipo',
                    value: 2,
                    onchange: 'pos.onShowPedidos({ hide:false })',
                    text: 'Personalizado',
                    class: 'col-sm-6 col-12 mb-3',
                    checked: true
                },
                {
                    opc: 'input-group',
                    lbl: 'Precio',
                    id: 'costo',
                    class: 'col-12 mb-3',
                    placeholder: '0.00',
                    required: false,
                    icon: 'icon-dollar',
                    value: costo,
                    tipo: 'cifra'
                },

                {
                    opc: 'input-group',
                    lbl: 'Importe base',
                    id: 'importeBase',
                    class: 'col-6 mb-3',
                    tipo: 'cifra',
                    icon: 'icon-dollar',
                    required: false
                },

                {
                    opc: 'input-group',
                    lbl: 'Importe de Oblea',
                    id: 'importeOblea',
                    class: 'col-6 mb-3',
                    tipo: 'cifra',
                    icon: 'icon-dollar',
                    required: false
                },

                {
                    opc: 'input-group',
                    lbl: 'No personas',
                    id: 'portion',
                    class: 'col-12 mb-3',
                    tipo: 'cifra',
                    icon: 'icon-user-1',
                    required: true
                },



                {
                    opc: 'textarea',
                    lbl: 'Leyenda',
                    id: 'leyenda',
                    class: 'col-12'
                },
                {
                    opc: 'input',
                    lbl: 'Relleno',
                    id: 'relleno',
                    class: 'col-12',
                    required: false
                },
                {
                    opc: 'textarea',
                    lbl: 'Observaciones',
                    id: 'observaciones',
                    class: 'col-12'
                },
                {
                    opc: 'button',
                    id: 'btnModalPedido',
                    className: 'w-100',
                    class: 'col-12',
                    text: 'Agregar pedido',
                    onClick: () => {
                        const form = document.getElementById('addItems');
                        let formData = new FormData(form);

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

        this.onShowPedidos({
            positions: [4, 5, 6, 7, 8, 9, 11]
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
                    img.classList.add("w-20", "h-20", "object-cover", "rounded");
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }


    onShowPedidos(options) {

        let defaults = {
            parent: 'formAddItems',
            hide: true,         // Indica si ocultar o mostrar los divs
            positions: [4, 5, 6, 7, 8, 9, 11]
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

    createdCheckGroup(options) {

        let defaults = {
            data: {},
            id: '',
            parent: '',
            value: ''
        };

        let opts = Object.assign(defaults, options);
        let ul = $('<ul>', { class: 'grid w-full gap-6 md:grid-cols-2' });
        opts.data.forEach(Element => {

            let li = $('<li>');

            let input = $('<input>', {
                type: 'radio',
                id: Element.id,
                name: Element.name || 'hosting',
                value: Element.value,
                class: 'hidden peer',
                checked: Element.checked ? true : false,
                required: Element.required || false
            });

            let label = $('<label>', {
                for: Element.id,
                class: 'inline-flex items-center justify-between w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700'
            });

            let block = $('<div>', { class: 'block' });

            block.append(
                $('<div>', { class: 'w-full text-sm font-semibold', text: Element.title }),
            );



            label.append(block);
            li.append(input, label);
            ul.append(li);


        });

        $('#' + options.parent).html(ul);


    }



    // Options.
    disabledGroupButtons(options) {
        const defaults = {
            parent: '',
            idButtonFile: 'btnfile',
            file: false,
            extends: true,
            index: null
        };

        const { parent, idButtonFile, file, index } = { ...defaults, ...options };

        const buttons = document.querySelectorAll(`#${parent} a`);
        const fileButton = file ? document.getElementById(idButtonFile) : null;

        buttons.forEach((button, i) => {
            const shouldDisable = index !== null ? i !== 0 : true;

            if (shouldDisable) {
                button.classList.add('disabled');
                button.setAttribute('disabled', 'true');

                if (fileButton) {
                    fileButton.classList.add('disabled');
                    fileButton.setAttribute('disabled', 'true');
                }
            }
        });
    }

    enabledGroupButtons(options) {

        const defaults = {
            parent: '',
            idButtonFile: 'btnfile',
            file: false,
            index: 0
        };

        const { parent, idButtonFile, file } = { ...defaults, ...options };

        const buttons = document.querySelectorAll(`#${parent} a`);
        const fileButton = file ? document.getElementById(idButtonFile) : null;

        buttons.forEach((button) => {

            button.classList.remove('disabled');
            button.removeAttribute('disabled');

            if (fileButton) {
                fileButton.classList.remove('disabled');
                fileButton.removeAttribute('disabled');
            }
        });

    }

    modalNuevoTicket() {

        this.createModalForm({
            id: "modal",
            bootbox: { title: "NUEVO PEDIDO", id: 'modalNuevo' },
            json: [
                {
                    opc: "input",
                    lbl: "Nombre del cliente: ",
                    id: "cliente",
                    class: "col-12 my-1",
                },
                {
                    opc: "input",
                    lbl: "Telefono",
                    id: "telefono",
                    class: "col-6 my-1",
                    required: true
                },
                {
                    opc: "input",
                    lbl: "Correo",
                    id: "correo",
                    class: "col-6 my-1",
                    required: false
                },
                {
                    opc: "input-calendar",
                    lbl: "Fecha para entrega",
                    id: "fechapedido",
                    class: "col-6 ",
                },

                {
                    opc: "input",
                    type: 'time',
                    lbl: "Hora de la entrega",
                    id: "horapedido",
                    class: "col-6 ",
                },
                {
                    opc: "div",
                    html: `<span class="text-xs text-gray-500  ms-1">Nota: El pedido debe registrarse mínimo con 48 horas de anticipación.</span>`,
                    class: "col-12 -mt-3 mb-2"
                },

                {
                    opc: "input-group",
                    lbl: "Fecha de cumpleaños",
                    id: "fechaCumpleaños",
                    icon: 'icon-birthday',
                    class: "col-12 my-1",
                    tipo: "texto",
                },
                {
                    opc: 'hr',
                    class: 'w-100 py-2'
                },

                {
                    opc: "input",
                    lbl: "Responsable del pedido",
                    id: "responsable",
                    class: "col-12",
                    required: true
                },
                {
                    opc: "textarea",
                    lbl: "Nota:",
                    id: "observacion",
                    class: "col-12",
                },
                // 🔘 Componente switch agregado
                {
                    opc: "div",
                    id: "extraSwitch",
                    class: "col-12 mb-2",
                    html: `
                    <div class="flex items-center justify-between p-3  bg-green-50 rounded-lg border border-green-200">
                        <div class="flex items-center space-x-3">
                            <div class="bg-green-100 rounded-full p-2">
                                <i class="icon-whatsapp text-green-600 text-lg"></i>
                            </div>
                            <div>
                                <p class="font-medium text-gray-800">Pedido de WhatsApp</p>

                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="toggleWhatsapp" class="sr-only peer">
                            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300
                                        peer peer-checked:after:translate-x-full peer-checked:after:border-white
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                        after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>

                    <input type="hidden" name="isWhatsapp" id="isWhatsapp" value="0" />
                `
                },

                {
                    opc: "btn-submit",
                    class: "col-12",
                    className: 'w-full',
                    id: 'btnNewTicket',
                    color_btn: "primary",
                    text: "Guardar",

                },
            ],
            autovalidation: false,
        });

        // initialized.
        dataPicker({ parent: "fechaCumpleaños", type: "simple" });
        dataPicker({ parent: "fechapedido", type: "simple" });

        $(document).on("change", "#toggleWhatsapp", function () {
            $("#isWhatsapp").val(this.checked ? 1 : 0);
            console.log('console', $("#isWhatsapp").val())
        });

        $("#modal").validation_form(
            {
                tipo: "text",
                opc: "newTicket",
            },
            (datos) => {
                let timer = $('#horapedido').val();
                let fechaEntrega = new Date(`${$("#fechapedido").val()}T${timer}`);
                let ahora = new Date();
                let diffHoras = (fechaEntrega - ahora) / (1000 * 60 * 60); // diferencia en horas

                // ❌ Si la fecha es mayor a 48h
                if (diffHoras < 48) {
                    this.promptClave(() => {
                        // clave válida, continuar con flujo original
                        this.continuarFlujo(datos, fechaEntrega, timer);
                    });
                    return; // detener flujo
                }

                // ✅ Fecha dentro del rango, continuar normalmente
                this.continuarFlujo(datos, fechaEntrega, timer);
            }
        );


    }


    // 👉 Función que ejecuta el flujo original
    continuarFlujo(datos, fechaEntrega, hora) {
        this.swalQuestion({
            opts: {

                html: `
                   <div class="text-left">
                    <h2 class="text-lg font-semibold text-gray-800 mb-2">🗓 Confirmar fecha de entrega</h2>
                    <p class="text-lg text-gray-600">
                        La fecha de entrega será el <strong>${fomartSpanishDate($("#fechapedido").val())}</strong> a las <strong>${hora}</strong>.
                    </p>
                    </div> `,
            },

            data: datos,
            methods: {
                request: (data) => {

                    // data.lsFolio.unshift({ opc: 0, text: '-- seleccionar folio --' });

                    alert({ title: "Se ha creado un nuevo ticket" });
                    $("#modalNuevo").modal("hide");
                    $("#totalTicket").empty();

                    $("#NoFolio").option_select({ data: data.lsFolio });
                    $('#NoFolio').val(data.idFolio);

                    this.cardTicket();
                }
            }
        });
    }

    // 🔐 Prompt para ingresar clave manual
    promptClave(onSuccess) {
        const dialog = bootbox.dialog({
            message: `
                <div class="text-lg font-semibold">
                El pedido debe registrarse mínimo con
                <span class="text-blue-600 font-bold">48 horas</span> de anticipación.<br/>
                Por favor, ingresa la clave para confirmar este pedido.
                </div>
                <div class="form-group mt-3">
                <input type="password" id="claveAutorizacion" class="form-control form-control-sm" placeholder="Ingresa clave" />
                </div>
            `,
            buttons: {
                cancel: {
                    label: "Cancelar",
                    className: "btn-danger btn-sm",
                },
                confirm: {
                    label: "Validar",
                    className: "btn-primary btn-sm",
                    callback: function () {
                        const clave = $("#claveAutorizacion").val();
                        if (clave === "fogaza25") {
                            onSuccess();
                        } else if (clave) {
                            alert({
                                icon: "error",
                                title: "Clave incorrecta",
                                text: "No se puede validar la entrega con esa clave.",
                            });
                        }
                    },
                },
            },
        });

        // Aplicar estilos solo a este modal
        dialog.find('.modal-dialog').css({ maxWidth: '350px' });
        dialog.find('.modal-content').addClass('text-sm p-2');
        dialog.find('.modal-title').addClass('text-xs');
    }

    cardEmpty(options) {
        $('#containerTicket').empty();
        $('#totalTicket').empty();

        let div = $("<div>", {
            class: "flex flex-col items-center justify-center py-4 bg-gray-100 h-100",
        });


        let icon = $("<i>", { class: "icon-cart-plus text-6xl text-primary" });
        let text = $("<p>", { class: "text-gray-500 font-semibold", text: "Agrega un producto" });

        div.append(icon, text);
        $("#containerTicket").append(div);
    }

    // Components.
    // Components coffeeSoft.
    createdTable(options) {

        var defaults = {
            extends: false,
            parent: this.div_modulo,
            idFilterBar: '',
            parent: 'lsTable',
            coffeesoft: false,
            conf: {
                datatable: true,
                fn_datatable: 'simple_data_table',
                beforeSend: true,
                pag: 15,
            },
            methods: {
                send: (data) => { }
            }
        };

        // configurations.
        const dataConfig = Object.assign(defaults.conf, options.conf);
        let opts = Object.assign(defaults, options);



        const idFilter = options.idFilterBar ? options.idFilterBar : '';
        if (idFilter) { // se activo la validacion por filtro




            const sendData = { tipo: 'text', opc: 'ls', ...options.data };
            var extendsAjax = null; // extender la funcion ajax
            $(`#${idFilter}`).validar_contenedor(sendData, (datos) => {
                // console.log('opts', dataConfig);
                let beforeSend = (dataConfig.beforeSend) ? '#' + options.parent : '';
                extendsAjax = fn_ajax(datos, this._link, beforeSend);
                if (!options.extends) { // si la variable extends no esta definida se ejectuta de forma normal
                    extendsAjax.then((data) => {
                        let attr_table_filter = {
                            data: data,
                            f_size: '14',
                            id: 'tbSearch'
                        };
                        attr_table_filter = Object.assign(attr_table_filter, opts.attr);
                        opts.methods.send(data);
                        if (opts.success)
                            opts.success(data);

                        if (opts.coffeesoft) {
                            attr_table_filter.parent = opts.parent;
                            this.createCoffeTable(attr_table_filter);
                        } else {
                            $('#' + options.parent).rpt_json_table2(attr_table_filter);
                        }
                        if (dataConfig.datatable) {
                            window[dataConfig.fn_datatable]('#' + attr_table_filter.id, dataConfig.pag);
                        }
                    });
                }
            });
            if (opts.extends) {
                return extendsAjax;
            }
        } else {
            let sendData = {
                opc: 'ls',
                ...opts.data
            };
            extendsAjax = fn_ajax(sendData, this._link, '#' + opts.parent);
            if (!opts.extends) { // si la variable extends no esta definida se ejectuta de forma normal
                extendsAjax.then((data) => {
                    opts.methods.send(data);
                    this.processData(data, opts, dataConfig);
                });
            }
        }

    }

    createCoffeTable(options) {
        const defaults = {
            theme: 'light',
            subtitle: null,
            dark: false,
            parent: "root",
            id: "coffeeSoftGridTable",
            title: null,
            data: { thead: [], row: [] },
            center: [],
            right: [],
            color_th: "bg-[#003360] text-gray-100",
            color_row: "bg-white hover:bg-gray-50",
            color_group: "bg-gray-200",
            class: "w-full table-auto text-sm text-gray-800",
            onEdit: () => { },
            onDelete: () => { },
            extends: true,
            f_size: 14,
            includeColumnForA: false,
            border_table: "border border-gray-300",
            border_row: "border-t border-gray-200",
            color_row_alt: "bg-gray-100",
            striped: false
        };

        if (options.theme === 'dark') {
            defaults.dark = true;
            defaults.color_th = "bg-[#374151] text-gray-300";
            defaults.color_row = "bg-[#283341] text-gray-300 ";
            defaults.color_group = "bg-[#334155] text-white";
            defaults.class = "w-full table-auto text-sm ";
            defaults.border_table = "";
            defaults.border_row = "border-t border-gray-700";
            defaults.color_row_alt = "bg-[#111827]";
        } else if (options.theme === 'corporativo') {
            defaults.color_th = "bg-[#003360] text-white";
            defaults.color_row = "bg-white ";
            defaults.color_group = "bg-[#D0E3FF] ";
            defaults.class = "w-full table-auto text-sm ";
            defaults.border_table = "border border-gray-300";
            defaults.border_row = "border-t border-gray-300";
            defaults.color_row_alt = "bg-gray-200";
        } else {
            defaults.color_th = "bg-gray-100 text-gray-600";
            defaults.color_row = "bg-white hover:bg-gray-600";
            defaults.color_group = "bg-gray-200";
            defaults.class = "w-full table-auto text-sm text-gray-800";
            defaults.border_table = "border border-gray-300";
            defaults.border_row = "border-t border-gray-200";
            defaults.color_row_alt = "bg-gray-100";
        }

        const opts = Object.assign({}, defaults, options);
        const container = $("<div>", {
            class: "rounded-lg h-full table-responsive ",
        });

        if (opts.title) {
            const titleRow = $(`
            <div class="flex flex-col px-4 py-3  border-b ${opts.dark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}">
                <h2 class="text-base font-semibold ${opts.dark ? 'text-gray-100' : 'text-gray-800'}">${opts.title}</h2>
                ${opts.subtitle ? `<p class="text-sm ${opts.dark ? 'text-gray-400' : 'text-gray-600'} mt-1">${opts.subtitle}</p>` : ''}
            </div>`);
            container.append(titleRow);
        }

        const table = $("<table>", { id: opts.id, class: `border-separate border-spacing-0  ${opts.border_table} ${opts.class}` });
        const thead = $("<thead>");

        if (opts.data.thead) {
            if (opts.extends) {
                const columnHeaders = opts.data.thead;
                if (Array.isArray(columnHeaders)) {
                    const headerRow = $('<tr>');
                    columnHeaders.forEach(column => {
                        if (typeof column === 'string') {
                            headerRow.append(`<th class="text-center px-3 py-2 ${opts.color_th}">${column}</th>`);
                        } else {
                            const complexHeaderRow = $('<tr>');
                            Object.keys(column).forEach(key => {
                                const cell = (typeof column[key] === 'object')
                                    ? $('<th>', column[key])
                                    : $('<th>', { text: column[key], class: `text-center ${opts.color_th}` });
                                complexHeaderRow.append(cell);
                            });
                            thead.append(complexHeaderRow);
                        }
                    });
                    thead.append(headerRow);
                } else {
                    columnHeaders.forEach(columnGroup => {
                        const headerGroup = $("<tr>");
                        Object.keys(columnGroup).forEach(key => {
                            const cell = (typeof columnGroup[key] === 'object')
                                ? $('<th>', columnGroup[key])
                                : $('<th>', { text: key });
                            headerGroup.append(cell);
                        });
                        thead.append(headerGroup);
                    });
                }
            } else {
                const simpleHeaderRow = $('<tr>');
                opts.data.thead.forEach(header => {
                    simpleHeaderRow.append(`<th class="text-center px-3 py-2 capitalize ${opts.color_th}">${header}</th>`);
                });
                thead.append(simpleHeaderRow);
            }
        } else {
            const autoHeaderRow = $("<tr>");
            for (let clave in opts.data.row[0]) {
                if (clave != "opc" && clave != "id") {
                    clave = (clave == 'btn' || clave == 'btn_personalizado' || clave == 'a' || clave == 'dropdown') ? '<i class="icon-gear"> </i>' : clave;
                    autoHeaderRow.append($("<th>", {
                        class: `px-2 py-2 ${opts.color_th} capitalize text-center font-semibold`,
                        style: `font-size:${opts.f_size}px;`
                    }).html(clave));
                }
            }
            thead.append(autoHeaderRow);
        }

        table.append(thead);
        const tbody = $("<tbody>", { class: '' });

        opts.data.row.forEach((data, i) => {
            const colorBg = opts.striped && i % 2 === 0 ? opts.color_row_alt : opts.color_row;
            delete data.opc;

            const tr = $("<tr>", {
                class: ``,
            });

            Object.keys(data).forEach((key, colIndex) => {
                if (["btn", "a", "dropdown", "id"].includes(key)) return;

                const align =
                    opts.center.includes(colIndex) ? "text-center" :
                        opts.right.includes(colIndex) ? "text-right" : "text-left";

                let tdText = data[key];
                let cellAttributes = {
                    id: `${key}_${data.id}`,
                    style: `font-size:${opts.f_size}px;`,
                    class: `${align} ${opts.border_row} px-3 py-2 truncate ${colorBg}`,
                    html: tdText
                };



                // Si opts.extends está activo y data[key] es objeto, sobrescribe atributos
                if (opts.extends && typeof data[key] === 'object' && data[key] !== null) {
                    cellAttributes = Object.assign(cellAttributes, data[key]);
                    cellAttributes.class += ` ${opts.border_row} ${colorBg}`;
                }

                tr.append($("<td>", cellAttributes));
            });

            let actions = '';

            if (data.a?.length) {
                actions = $("<td>", { class: `px-2 py-2 relative w-15 justify-center items-center text-center ${colorBg} ${opts.border_row}` });
                data.a.forEach(atributos => {

                    const button_a = $("<a>", atributos);
                    actions.append(button_a);
                });
                tr.append(actions);
            }

            if (data.dropdown) {
                actions = $("<td>", {
                    class: `px-2 py-2 w-10 relative justify-center items-center ${colorBg} ${opts.border_row}`
                });

                const wrapper = $("<div>", {
                    class: "relative"
                });

                const btn = $("<button>", {
                    class: "icon-dot-3 text-gray-200 hover:text-gray-600",
                    click: function (e) {
                        e.stopPropagation();
                        $("ul.dropdown-menu").hide(); // cerrar todos los menús antes
                        $(this).next("ul").toggle();  // abrir solo el actual
                    }
                });

                const menu = $("<ul>", {
                    class: "dropdown-menu absolute top-full right-0 mt-2 w-44 z-10 bg-[#1F2A37] border rounded-md shadow-md hidden"
                });

                data.dropdown.forEach((item) =>
                    menu.append(`
                        <li>
                            <a onclick="${item.onclick}" class="block px-4 py-2 text-sm hover:bg-[#283341] text-gray-200 text-left">
                                <i class="${item.icon}"></i> ${item.text}
                            </a>
                        </li>
                    `)
                );

                wrapper.append(btn, menu);
                actions.append(wrapper);

                // Cerrar todos los dropdowns al hacer clic fuera
                $(document).on("click", () => {
                    $("ul.dropdown-menu").hide();
                });
            }

            tr.append(actions);
            tbody.append(tr);
        });

        table.append(tbody);
        container.append(table);
        $(`#${opts.parent}`).html(container);

        $("<style>").text(`
        #${opts.id} th:first-child { border-top-left-radius: 0.5rem; }
        #${opts.id} th:last-child { border-top-right-radius: 0.5rem; }
        #${opts.id} tr:last-child td:first-child { border-bottom-left-radius: 0.5rem; }
        #${opts.id} tr:last-child td:last-child { border-bottom-right-radius: 0.5rem; }
        `).appendTo("head");
    }

    createdForm(options) {
        // Conf:
        let defaults = {

            parent: 'formsContent',
            id: 'idForm',
            autofill: false,
            plugin: 'content_json_form',
            plugin_validation: 'validation_form',
            extends: false,
            type: 'div',
            class: 'row',
            methods: {
                send: (data = '') => { }
            },
        };

        let formulario = [
            {
                opc: "input",
                lbl: "Producto",
                class: 'col-12'
            },

            {
                opc: "btn-submit",
                id: "btnEnviar",
                text: 'Guardar',
                class: 'col-12'
            },


        ];



        // Reemplazar formulario:
        const jsonForm = options.json || formulario;
        // Fusionar opciones con valores por defecto
        const opts = Object.assign(defaults, options);
        opts.methods = Object.assign({}, defaults.methods, options.methods);  // Asegurar que los mÃ©todos personalizados se fusionen correctamente

        $('#' + opts.parent)[opts.plugin]({ data: jsonForm, class: opts.class, type: 'default', id: opts.id, Element: opts.type });



        if (opts.autofill) {
            // Init process auto inputs
            for (const frm in opts.autofill) {
                // Buscar elementos en el DOM cuyo atributo name coincida con la clave
                const $element = $('#' + opts.id).find(`[name="${frm}"]`);

                if ($element.length > 0) {
                    // Establecer valor dependiendo del tipo de elemento
                    if ($element.is('select')) {
                        // Seleccionar la opciÃ³n correcta en el select
                        $element.val(opts.autofill[frm]).trigger('change');
                    } else {
                        // Para otros elementos como input o textarea
                        $element.val(opts.autofill[frm]);
                    }


                } else {

                }
            }
        }


        let dataForm = {
            tipo: 'text',
            opc: 'set',
            ...options.data
        };

        var extends_ajax;



        $("#" + opts.parent).validation_form(dataForm, (datos) => {

            if (options.beforeSend)
                options.beforeSend();



            extends_ajax = fn_ajax(datos, this._link, '');

            if (!opts.extends) {

                extends_ajax.then((data) => {

                    // $("#" + opts.parent)[0].reset();
                    if (opts.success)
                        opts.success(data);

                    if (opts.methods.send)
                        opts.methods.send(data);

                });

            }


        });
        // return extends_ajax;
        // if(opts.extends){
        //     return extends_ajax;
        // }



    }


}

function toggleInputs(options) {


    let defaults = {
        parent: 'modalRegisterPayment',
        hide: true
    };

    let opts = Object.assign(defaults, options);


    const form = document.getElementById(opts.parent);
    const allDivs = form.querySelectorAll('.row > div');
    const divsWithRadios = form.querySelectorAll('input[type="radio"]');
    const parentsWithRadios = Array.from(divsWithRadios).map(radio => radio.closest('div'));
    const lastDiv = form.querySelector('.row > div:last-child');




    allDivs.forEach(div => {


        if (!parentsWithRadios.includes(div) && div !== lastDiv) {

            div.style.display = opts.hide ? 'none' : ''; // Ocultar o mostrar

        }



        // else {
        //     div.style.display = ''; // Siempre visible

        // }

    });



}

function toggleFields(checked) {
    const fields = ['efectivo', 'tdc', 'diferencia'];

    fields.forEach(id => {
        const parent = document.getElementById(id)?.closest('.col-sm-12, .col-12, .col-12 py-2, .col-12 mb-2');
        if (parent) {
            parent.style.display = checked ? 'block' : 'none';
        }
    });

    const icon = document.getElementById("iconPaymentFields");
    const label = document.getElementById("labelPaymentFields");

    if (checked) {
        icon?.classList.replace("icon-eye", "icon-eye-off");
        label && (label.textContent = "Ocultar campos de pago detallados");
    } else {
        icon?.classList.replace("icon-eye-off", "icon-eye");
        label && (label.textContent = "Mostrar campos de pago detallados");
    }
}


function CalculoDiferencia() {
    const efectivoInput = document.getElementById('efectivo');
    const tdcInput = document.getElementById('tdc');

    let efectivo = parseFloat($("#efectivo").val());
    let tdc = parseFloat($("#tdc").val());

    // Validar que no sean números negativos
    if (efectivo < 0) {
        efectivo = 0;
        if (efectivoInput) efectivoInput.value = '0.00';
    }
    if (tdc < 0) {
        tdc = 0;
        if (tdcInput) tdcInput.value = '0.00';
    }

    efectivo = isNaN(efectivo) ? 0 : efectivo;
    tdc = isNaN(tdc) ? 0 : tdc;

    // Usar el precio final (con descuento) - SIEMPRE usar finalPrice
    const finalPriceElement = document.getElementById('finalPrice');
    if (!finalPriceElement) {
        console.error('No se encontró el elemento finalPrice');
        return;
    }

    let total = parseFloat(finalPriceElement.textContent) || 0;
    let pago = efectivo + tdc;

    // Validar que el pago no exceda el total (evitar diferencia negativa)
    if (pago > total) {
        // Ajustar el último campo modificado
        const exceso = pago - total;
        if (document.activeElement === tdcInput) {
            tdc = Math.max(0, tdc - exceso);
            if (tdcInput) tdcInput.value = tdc.toFixed(2);
        } else {
            efectivo = Math.max(0, efectivo - exceso);
            if (efectivoInput) efectivoInput.value = efectivo.toFixed(2);
        }
        pago = efectivo + tdc;
    }

    let diferencia = total - pago;

    // Asegurar que la diferencia nunca sea negativa
    diferencia = Math.max(0, diferencia);

    $('#diferencia').val(diferencia.toFixed(2));

    // Cambiar color del campo diferencia según el valor
    const diferenciaInput = document.getElementById('diferencia');
    if (diferenciaInput) {
        if (diferencia > 0) {
            // Falta dinero - color rojo
            diferenciaInput.style.color = '#ef4444';
        } else {
            // Pago exacto - color verde
            diferenciaInput.style.color = '#22c55e';
        }
    }
}

function togglePaymentFieldsVisibility(show) {
    const paymentFieldsRow = document.getElementById('paymentFieldsRow');
    const iconPaymentFields = document.getElementById('iconPaymentFields');
    const labelPaymentFields = document.getElementById('labelPaymentFields');

    if (!paymentFieldsRow) return;

    if (show) {
        // Mostrar campos con display block (sin animación para simplicidad)
        paymentFieldsRow.style.display = 'block';

        // Cambiar icono y texto
        iconPaymentFields.className = 'icon-eye-off text-blue-400 transition-colors duration-200';
        labelPaymentFields.textContent = 'Ocultar campos de pago';

    } else {
        // Ocultar campos
        paymentFieldsRow.style.display = 'none';

        // Resetear valores cuando se ocultan
        const efectivoInput = document.getElementById('efectivo');
        const tdcInput = document.getElementById('tdc');
        const diferenciaInput = document.getElementById('diferencia');
        const finalPriceElement = document.getElementById('finalPrice');

        if (efectivoInput) efectivoInput.value = '';
        if (tdcInput) tdcInput.value = '';
        if (diferenciaInput && finalPriceElement) {
            diferenciaInput.value = finalPriceElement.textContent;
        }

        // Cambiar icono y texto
        iconPaymentFields.className = 'icon-eye text-gray-400 transition-colors duration-200';
        labelPaymentFields.textContent = 'Mostrar campos de pago detallados';
    }
}

function calculateWithDiscount() {
    const originalPriceElement = document.getElementById('originalPrice');
    const discountInput = document.getElementById('descuento');
    const discountAmountElement = document.getElementById('discountAmount');
    const finalPriceElement = document.getElementById('finalPrice');

    if (!originalPriceElement || !discountInput || !discountAmountElement || !finalPriceElement) {
        return;
    }

    const originalPrice = parseFloat(originalPriceElement.textContent) || 0;
    let discount = parseFloat(discountInput.value) || 0;

    // Validar que el descuento no sea negativo
    if (discount < 0) {
        discount = 0;
        discountInput.value = '0.00';
        showDiscountError('El descuento no puede ser negativo');
        return;
    }

    // Validar que el descuento no sea mayor al precio original
    if (discount > originalPrice) {
        discount = originalPrice;
        discountInput.value = originalPrice.toFixed(2);
        showDiscountError('El descuento no puede ser mayor al precio del pedido');
    } else {
        clearDiscountError();
    }

    // Calcular precio final
    const finalPrice = originalPrice - discount;

    // Actualizar elementos en la interfaz
    discountAmountElement.textContent = discount.toFixed(2);
    finalPriceElement.textContent = finalPrice.toFixed(2);

    // Actualizar el campo diferencia si está visible
    const diferenciaInput = document.getElementById('diferencia');
    if (diferenciaInput) {
        diferenciaInput.value = finalPrice.toFixed(2);
    }

    // Recalcular diferencia si hay pagos ingresados
    CalculoDiferencia();
}

function showDiscountError(message) {
    let errorElement = document.getElementById('discountError');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'discountError';
        errorElement.className = 'text-red-500 text-sm mt-1';
        document.getElementById('descuento').parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    document.getElementById('descuento').classList.add('border-red-500');
}

function clearDiscountError() {
    const errorElement = document.getElementById('discountError');
    if (errorElement) {
        errorElement.remove();
    }
    document.getElementById('descuento').classList.remove('border-red-500');
}

function formatPrice(amount, locale = 'es-MX', currency = 'MXN') {
    // Verificar si el monto es null, undefined o 0
    if (!amount) {
        return '-';
    }
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}




