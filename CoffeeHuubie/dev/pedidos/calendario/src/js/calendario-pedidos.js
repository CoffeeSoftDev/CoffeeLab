let api = 'ctrl/ctrl-calendario.php';
let app;

$(function () {
    app = new App(api, 'root');
    app.init();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Calendario";
        this.calendar = null;
        this.filters = {
            fi: '',
            ff: '',
            status: ''
        };
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        this.createCalendar();
    }

    layout() {
        this.primaryLayout({
            parent: this._div_modulo,
            id: this.PROJECT_NAME,
            class: 'd-flex mx-2 my-2 h-100 mt-5 p-2',
            card: {
                container: {
                    id: `container${this.PROJECT_NAME}`,
                    class: 'w-full h-auto my-3 rounded-lg p-3 bg-[#1F2A37]'
                }
            }
        });

        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="p-2 flex flex-wrap items-center justify-between gap-3">
                <button title="Regresar" type="button"
                    class="btn bg-gray-700 hover:bg-purple-950 text-white px-4 py-2 rounded w-full sm:w-auto"
                    onclick="window.location.href = '/dev/pedidos/'">
                    <small><i class="icon-reply"></i> Volver a Lista</small>
                </button>

              <div class="flex flex-wrap items-center gap-2 ml-auto text-xs sm:text-sm">
                <p class="flex items-center">
                    <i class="icon-blank text-lg" style="color: #6E95C0"></i> Cotización
                </p>
                <p class="flex items-center">
                    <i class="icon-blank text-lg" style="color: #0E9E6E"></i> Pagado
                </p>
                <p class="flex items-center">
                    <i class="icon-blank text-lg" style="color: #FE6F00"></i> Pendiente
                </p>
                <p class="flex items-center">
                    <i class="icon-blank text-lg" style="color: #E60001"></i> Cancelado
                </p>
            </div>

            </div>

            <div class="row h-full mt-4">
                <div class="bg-[#111928] rounded-lg p-4 h-100 w-full" id="calendarFull"></div>
            </div>
        `);
    }

    async createCalendar() {
        let data = await useFetch({ url: this._link, data: { opc: 'getCalendar' } });
        const calendarEl = document.getElementById('calendarFull');

        if (!calendarEl) {
            console.error('Elemento del calendario no encontrado');
            return;
        }

        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: data,
            eventContent: (arg) => this.renderEventContent(arg),
            eventClick: (info) => this.showOrder(info.event.id),
            datesSet: () => this.customizeCalendarAppearance()
        });

        this.calendar.render();
    }

    renderEventContent(arg) {
        let envio_domicilio = arg.event.extendedProps.type  == 'Envío a Domicilio' ? true : false;
        let entregado = arg.event.extendedProps.delivery == 'Entregado' ? true : false;

        let titleEl = document.createElement("div");
        let deliveryEl = document.createElement("div");
        let timeEl = document.createElement("div");

        titleEl.classList.add("font-12", "font-bold");
        deliveryEl.classList.add("font-10", "text-gray-200");
        timeEl.classList.add("font-10", "text-gray-200");

        titleEl.innerHTML = arg.event.title;
        deliveryEl.innerHTML =  (envio_domicilio ? "<i class='icon-motorcycle'></i> " : "<i class='icon-shop'></i> ") + arg.event.extendedProps.delivery;
        timeEl.innerHTML = "<i class='icon-clock'></i> " + arg.event.extendedProps.hour;

        return { domNodes: [titleEl, deliveryEl, timeEl] };
    }

    customizeCalendarAppearance() {
        document.querySelectorAll('.fc-day-today').forEach(el => {
            el.style.backgroundColor = '#2C3E50';
        });

        document.querySelectorAll('.fc-daygrid-day, .fc-scrollgrid, .fc-theme-standard td, .fc-theme-standard th').forEach(el => {
            el.style.border = '1px solid #1F2A37';
        });
    }
    async showOrder(orderId) {
        const response = await useFetch({
            url: '../ctrl/ctrl-pedidos.php',
            data: { opc: 'getOrderDetails', id: orderId }
        });
        const modal = bootbox.dialog({
            title: `
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <i class="icon-birthday text-white text-sm"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold text-white">Detalles del Pedido</h2>
                    </div>
                </div>
            `,
            message: '<div id="orderDetailsContainer" class="min-h-[500px] max-h-[80vh] overflow-hidden"></div>',
            size: 'xl',
            closeButton: true,
            className: 'order-details-enhanced-modal'
        });

        this.layoutManager = {
            isMobile: () => window.innerWidth < 768,
            isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
            isDesktop: () => window.innerWidth >= 1024,

            applyLayout: function () {
                const container = $('#orderDetailsContainer');
                container.removeClass('flex flex-col flex-row space-y-4 gap-4 gap-6 p-4 p-6');

                if (this.isMobile()) {
                    container.addClass('flex flex-col space-y-4 p-4');
                } else if (this.isTablet()) {
                    container.addClass('flex flex-col lg:flex-row gap-4 p-4');
                } else {
                    container.addClass('flex flex-row gap-6 p-6');

                }
            }
        };

        setTimeout(() => {
            this.layoutManager.applyLayout();
            const orderData = response.data.order || {};
            const products = response.data.products || [];

            const container = $('#orderDetailsContainer');
            container.html(`
                <div id="orderInfoPanel" class="w-full lg:w-1/3 mb-6 lg:mb-0 lg:pr-3">
                    <div class="lg:sticky lg:top-4">
                        ${this.detailsCard(orderData)}
                    </div>
                </div>

                <div id="productDisplayArea" class="w-full lg:w-2/3 lg:pl-3">
                    ${this.listProducts(products)}
                </div>
            `);

            $(window).on('resize.orderDetails', () => {
                // this.layoutManager.applyLayout();
            });
        }, 100);

        modal.on('hidden.bs.modal', () => {
            $(window).off('resize.orderDetails');
        });

        $("<style>").text(`
            .order-details-enhanced-modal .modal-dialog {
                max-width: 1200px !important;
                width: 95vw !important;
            }
            .order-details-enhanced-modal .modal-body {
                padding: 0 !important;
            }

            @media (max-width: 768px) {
                .order-details-enhanced-modal .modal-dialog {
                    width: 98vw !important;
                    margin: 10px auto !important;
                }
            }
        `).appendTo("head");

        return modal;
    }

    detailsCard(orderData) {
        return `
            <div class="space-y-4">
                ${this.infoOrder(orderData)}
                ${this.infoSales(orderData)}
            </div>
        `;
    }

    infoOrder(orderData) {
        return `
            <div class="bg-[#2C3E50] rounded-lg p-3">
                <h3 class="text-white font-semibold text-lg mb-3 flex items-center">
                    <i class="icon-info text-blue-400 mr-3"></i>
                    Información del Pedido
                </h3>

                <div class="space-y-2">
                    <div class="flex items-start">
                        <i class="icon-doc-text-1 text-gray-400 text-xl mr-4 mt-1"></i>
                        <div>
                            <p class="text-gray-400 text-sm mb-1">Folio:</p>
                            <p class="text-white font-semibold text-lg">${orderData.folio || 'N/A'}</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <i class="icon-user text-gray-400 text-xl mr-4 mt-1"></i>
                        <div>
                            <p class="text-gray-400 text-sm mb-1">Cliente:</p>
                            <p class="text-white font-semibold">${orderData.name || 'N/A'}</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <i class="icon-calendar text-gray-400 text-xl mr-4 mt-1"></i>
                        <div>
                            <p class="text-gray-400 text-sm mb-1">Fecha de entrega:</p>
                            <p class="text-white font-semibold">${orderData.formatted_date_order || orderData.date_order || 'N/A'}</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <i class="icon-clock text-gray-400 text-xl mr-4 mt-1"></i>
                        <div>
                            <p class="text-gray-400 text-sm mb-1">Hora:</p>
                            <p class="text-white font-semibold">${orderData.time_order || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    infoSales(orderData) {
        const totalPay = parseFloat(orderData.total_pay || 0);
        const totalPaid = parseFloat(orderData.total_paid || 0);
        const balance = parseFloat(orderData.balance || 0);

        return `
            <div class="bg-[#2C3E50] rounded-lg p-3">
                <h3 class="text-white font-semibold text-lg mb-3 flex items-center">
                    <i class="icon-dollar text-green-400 mr-3"></i>
                     Resumen de pago
                </h3>

                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-400">Total:</span>
                        <span class="text-white font-bold text-sm">$${totalPay.toFixed(2)}</span>
                    </div>

                    <div class="flex items-center justify-between">
                        <span class="text-gray-400">Pagado:</span>
                        <span class="text-green-400 font-bold text-sm">$${totalPaid.toFixed(2)}</span>
                    </div>

                    <div class="border-t border-gray-600"></div>

                    <div class="flex items-center justify-between">
                        <span class="text-gray-400">Saldo:</span>
                        <span class="text-red-400 font-bold text-sm">$${balance.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }


    listProducts(products) {
        if (!products || products.length === 0) {
            return `
                <div class="bg-[#283341] rounded-lg p-2 text-center h-full flex flex-col items-center justify-center">
                    <i class="icon-basket text-gray-500 text-5xl mb-4"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">No hay productos</h3>
                    <p class="text-gray-400">Este pedido no contiene productos.</p>
                </div>
            `;
        }

        const totalItems = products.reduce((acc, item) => acc + parseInt(item.quantity || 1), 0);

        return `
            <div class="flex flex-col h-full">
                <div class="bg-[#283341] rounded-lg p-3 mb-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-white font-semibold text-lg flex items-center">
                            <i class="icon-basket mr-2 text-blue-400"></i>
                            Productos del Pedido
                        </h3>
                        <span class="text-gray-300 font-medium"> ${totalItems} productos</span>
                    </div>
                </div>
                <div id="productsContainer" class="space-y-4 overflow-y-auto flex-1">
                    ${products.map(product => {
            if (product.is_custom || (product.customer_products && product.customer_products.length > 0)) {
                return this.cardCustom(product);
            } else {
                return this.cardNormal(product);
            }
        }).join('')}
                </div>
            </div>
        `;
    }

    cardNormal(product) {
        const total = parseFloat(product.price || 0) * parseInt(product.quantity || 1);
        const hasDedication = product.dedication && product.dedication.trim() !== '';
        const hasDetails = product.order_details && product.order_details.trim() !== '';

        return `
            <div class="bg-[#2C3E50] rounded-lg p-3 relative">
                <div class="absolute top-5 right-6 text-right">
                    <span class="text-gray-400 text-sm">Cantidad: <span class="text-white font-bold text-sm">${product.quantity || 1}</span></span>
                </div>

                <div class="flex items-start gap-6 pr-32">
                    <div class="w-24 h-24 rounded-lg overflow-hidden bg-[#D8B4E2] flex-shrink-0">
                        ${this.renderProductImage(product)}
                    </div>

                    <div class="flex-1">
                        <h4 class="text-white font-bold text-lg mb-2 uppercase">${product.name || 'Producto sin nombre'}</h4>
                        <p class="text-blue-400 font-semibold text-xs mb-4">$${parseFloat(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u</p>

                        ${(hasDedication || hasDetails) ? `
                        <div class="flex gap-12">
                            ${hasDedication ? `
                            <div class="flex-1">
                                <span class="text-gray-400 text-sm font-medium">Dedicatoria:</span>
                                <p class="text-white text-xs">${product.dedication}</p>
                            </div>
                            ` : ''}
                            ${hasDetails ? `
                            <div class="flex-1">
                                <span class="text-gray-400 text-sm font-medium">Observaciones:</span>
                                <p class="text-white text-xs">${product.order_details}</p>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="absolute bottom-5 right-6 text-right">
                    <span class="text-gray-400 text-sm block mb-1">Total:</span>
                    <p class="text-white font-bold text-lg">$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        `;
    }

    cardCustom(product) {
        const hasDedication = product.dedication && product.dedication.trim() !== '';
        const hasDetails = product.order_details && product.order_details.trim() !== '';
        const hasImages = product.images && Array.isArray(product.images) && product.images.length > 0;
        const hasCustomization = product.customer_products && product.customer_products.length > 0;

        const customizationTotal = product.customer_products ?
            product.customer_products.reduce((sum, item) => sum + parseFloat(item.custom_price || 0), 0) : 0;
        const finalTotal = (parseFloat(product.price || 0) + customizationTotal) * parseInt(product.quantity || 1);

        return `
        <div class="bg-[#2C3E50] rounded-lg p-3 relative">
            <div class=" mb-6">
                <h4 class="text-white font-bold text-sm uppercase">${product.name || 'Pastel Personalizado'}</h4>
                <span class="inline-flex items-center px-3 py-2 mt-2 rounded-2xl text-[10px] font-bold bg-purple-500 text-purple-100 lowercase">
                    Personalizado
                </span>
            </div>

            <div class="absolute top-5 right-6 text-right">
                <span class="text-gray-400 text-sm">Cantidad: <span class="text-white font-bold text-sm">${product.quantity || 1}</span></span>
            </div>

            ${hasImages ? `
            <div class="flex gap-3 pb-4 border-b border-gray-700">
                ${product.images.slice(0, 3).map(img => {
            const thumbUrl = img.path.startsWith('http') ? img.path : `${img.path}`;
            return `
                        <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-700">
                            <img src="${thumbUrl}"
                                 alt="${img.original_name || 'Imagen'}"
                                 class="object-cover w-full h-full">
                        </div>
                    `;
        }).join('')}
            </div>
            ` : ''}

            ${(hasDedication || hasDetails) ? `
            <div class="flex gap-12 mb-6 pr-32 pt-4">
                ${hasDedication ? `
                <div class="flex-1">
                    <span class="text-gray-400 text-sm font-medium">Dedicatoria:</span>
                    <p class="text-white text-base">${product.dedication}</p>
                </div>
                ` : ''}
                ${hasDetails ? `
                <div class="flex-1">
                    <span class="text-gray-400 text-sm font-medium">Observaciones:</span>
                    <p class="text-white text-base">${product.order_details}</p>
                </div>
                ` : ''}
            </div>
            ` : ''}

            ${hasCustomization ? `
            <div class="border-t border-gray-600 pt-4 mb-6 pr-32">
                <h5 class="text-purple-300 font-bold text-sm mb-2 uppercase">Personalización:</h5>
                ${this.renderPersonalizationGrid(product.customer_products)}
            </div>
            ` : ''}

            <div class="absolute bottom-5 right-6 text-right">
                <span class="text-gray-400 text-sm block mb-1 ">Total:</span>
                <p class="text-white font-bold text-lg">$${finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
        </div>
    `;
    }

    renderProductImage(product) {
        const hasImage = product.image && product.image.trim() !== '';

        if (hasImage) {
            const imageUrl = product.image.startsWith('http') ?
                product.image : `https://huubie.com.mx/${product.image}`;
            return `
                <img src="${imageUrl}" alt="${product.name}"
                     class="object-cover w-full h-full"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="w-full h-full items-center justify-center hidden">
                    <i class="icon-image text-gray-500 text-2xl"></i>
                </div>
            `;
        } else {
            return `
                <div class="w-full h-full flex items-center justify-center">
                    <i class="icon-image text-gray-500 text-2xl"></i>
                </div>
            `;
        }
    }


    renderPersonalizationGrid(customizations) {
        console.log(customizations)
        const grouped = {};
        customizations.forEach(item => {
            const category = `${item.modifier_name || ''}:` || '';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(item);
        });

        const entries = Object.entries(grouped);
        const half = Math.ceil(entries.length / 2);
        const leftColumn = entries.slice(0, half);
        const rightColumn = entries.slice(half);

        return `
            <div class="grid grid-cols-2 gap-8">
                <div class="space-y-1">
                    ${leftColumn.map(([category, items]) => `
                        ${items.map(item => `
                            <div class="flex justify-between items-center">
                                <span class="text-purple-300 text-base">${category} ${item.name || 'N/A'}</span>
                                <span class="text-white text-sm">$${parseFloat(item.custom_price || 0).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    `).join('')}
                </div>

                <div class="space-y-3">
                    ${rightColumn.map(([category, items]) => `
                        ${items.map(item => `
                            <div class="flex justify-between items-center">
                                <span class="text-purple-300 font-medium">${category} ${item.name || 'N/A'}</span>
                                ${item.custom_price && parseFloat(item.custom_price) > 0 ?
                `<span class="text-white text-sm">$${parseFloat(item.custom_price).toFixed(2)}</span>` :
                ''
            }
                            </div>
                        `).join('')}
                    `).join('')}
                </div>
            </div>
        `;
    }
}
