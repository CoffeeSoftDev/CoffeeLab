/**
 * Clase CalendarioPedidos
 * Gestiona la vista de calendario de pedidos
 */

class CalendarioPedidos {
    constructor(link, div_modulo) {
        this.link = link;
        this.div_modulo = div_modulo;
        this.calendar = null;
        this.filters = {
            fi: '',
            ff: '',
            status: ''
        };
    }

    /**
     * Inicializa el módulo
     */
    init() {
        this.layout();
        this.createCalendar();
    }

    /**
     * Crea el layout principal
     */
    layout() {
        const name = "CalendarioPedidos";
        const container = document.getElementById(this.div_modulo);
        
        container.innerHTML = `
            <div id="container${name}" class="d-flex mx-2 my-2 h-100 mt-5 p-2">
                <div class="w-full h-auto my-3 rounded-lg p-3 bg-[#1F2A37]">
                    <!-- Barra de controles -->
                    <div class="p-2 flex flex-wrap items-center justify-between gap-3">
                        <button title="Regresar" type="button"
                            class="btn bg-gray-700 hover:bg-purple-950 text-white px-4 py-2 rounded w-full sm:w-auto"
                            onclick="window.location.href = '/alpha/pedidos/'">
                            <small><i class="icon-reply"></i> Volver a Lista</small>
                        </button>

                        <div class="flex flex-wrap items-center gap-2 ml-auto text-xs sm:text-sm">
                            <p class="flex items-center"><i class="icon-blank text-lg" style="color: #1E90FF"></i> Cotización</p>
                            <p class="flex items-center"><i class="icon-blank text-lg" style="color: #8CC63F"></i> Pagado</p>
                            <p class="flex items-center"><i class="icon-blank text-lg" style="color: #FFCC00"></i> Pendiente</p>
                            <p class="flex items-center"><i class="icon-blank text-lg" style="color: #FF3B30"></i> Cancelado</p>
                        </div>
                    </div>

                    <!-- Contenedor del calendario -->
                    <div class="row h-full">
                        <div class="bg-[#111928] rounded-lg p-4 h-100" id="calendarFull">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Crea e inicializa el calendario de FullCalendar
     */
    async createCalendar() {
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
            
            // Cargar eventos desde el backend
            events: (info, successCallback, failureCallback) => {
                this.loadEvents(info, successCallback, failureCallback);
            },
            
            // Personalizar contenido del evento
            eventContent: (arg) => {
                return this.renderEventContent(arg);
            },
            
            // Click en evento
            eventClick: (info) => {
                this.showOrderDetail(info.event.id);
            },
            
            // Personalizar apariencia después de renderizar
            datesSet: () => {
                this.customizeCalendarAppearance();
            }
        });

        this.calendar.render();
    }

    /**
     * Carga eventos desde el backend
     */
    async loadEvents(info, successCallback, failureCallback) {
        try {
            // Obtener fechas del rango visible
            const fi = moment(info.start).format('YYYY-MM-DD');
            const ff = moment(info.end).format('YYYY-MM-DD');
            
            const response = await $.ajax({
                url: this.link,
                type: 'POST',
                data: {
                    opc: 'getCalendarioData',
                    fi: fi,
                    ff: ff,
                    status: this.filters.status || '0'
                },
                dataType: 'json'
            });

            if (response.status === 200 && response.data) {
                successCallback(response.data);
            } else {
                console.error('Error al cargar eventos:', response.message);
                failureCallback(new Error(response.message));
            }
            
        } catch (error) {
            console.error('Error en la petición AJAX:', error);
            failureCallback(error);
        }
    }

    /**
     * Renderiza el contenido personalizado del evento
     */
    renderEventContent(arg) {
        let titleEl = document.createElement("div");
        let clientEl = document.createElement("div");
        let timeEl = document.createElement("div");

        titleEl.classList.add("font-12", "font-bold");
        clientEl.classList.add("font-10", "text-gray-200");
        timeEl.classList.add("font-10", "text-gray-200");

        titleEl.innerHTML = arg.event.title;
        clientEl.innerHTML = "<i class='icon-user-5'></i> " + arg.event.extendedProps.cliente;
        timeEl.innerHTML = "<i class='icon-clock'></i> " + moment(arg.event.start).format('HH:mm');

        return { domNodes: [titleEl, clientEl, timeEl] };
    }

    /**
     * Personaliza la apariencia del calendario
     */
    customizeCalendarAppearance() {
        // Resaltar día actual
        document.querySelectorAll('.fc-day-today').forEach(el => {
            el.style.backgroundColor = '#2C3E50';
        });

        // Personalizar bordes
        document.querySelectorAll('.fc-daygrid-day').forEach(el => {
            el.style.border = '1px solid #1F2A37';
        });

        document.querySelectorAll('.fc-scrollgrid').forEach(el => {
            el.style.border = '1px solid #1F2A37';
        });

        document.querySelectorAll('.fc-theme-standard td, .fc-theme-standard th').forEach(el => {
            el.style.border = '1px solid #1F2A37';
        });
    }

    /**
     * Muestra el detalle de un pedido
     */
    async showOrderDetail(orderId) {
        try {
            const response = await $.ajax({
                url: this.link,
                type: 'POST',
                data: {
                    opc: 'getOrderDetail',
                    id: orderId
                },
                dataType: 'json'
            });

            if (response.status === 200 && response.data) {
                this.displayOrderModal(response.data);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'No se pudo cargar el detalle del pedido'
                });
            }
            
        } catch (error) {
            console.error('Error al cargar detalle:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar el detalle del pedido'
            });
        }
    }

    /**
     * Muestra el modal con los detalles del pedido
     */
    displayOrderModal(data) {
        // Por ahora, mostrar con SweetAlert2
        // En la siguiente tarea se implementará un modal más completo
        const order = data.order;
        
        Swal.fire({
            title: `Pedido ${order.folio}`,
            html: `
                <div class="text-left">
                    <p><strong>Cliente:</strong> ${order.name}</p>
                    <p><strong>Teléfono:</strong> ${order.phone}</p>
                    <p><strong>Fecha de entrega:</strong> ${order.date_order}</p>
                    <p><strong>Hora:</strong> ${order.time_order}</p>
                    <p><strong>Total:</strong> $${parseFloat(order.total_pay).toFixed(2)}</p>
                    <p><strong>Tipo de entrega:</strong> ${order.delivery_type == 1 ? '🏍️ Envío a domicilio' : 'Recoger en tienda'}</p>
                    ${order.note ? `<p><strong>Notas:</strong> ${order.note}</p>` : ''}
                </div>
            `,
            width: 600,
            confirmButtonText: 'Cerrar'
        });
    }

    /**
     * Aplica filtros al calendario
     */
    applyFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        if (this.calendar) {
            this.calendar.refetchEvents();
        }
    }

    /**
     * Limpia los filtros
     */
    clearFilters() {
        this.filters = { fi: '', ff: '', status: '' };
        if (this.calendar) {
            this.calendar.refetchEvents();
        }
    }
}
