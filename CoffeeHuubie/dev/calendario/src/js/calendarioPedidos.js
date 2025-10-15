let api = 'ctrl/ctrl-calendarioPedidos.php';
let calendarApp;
let udn, status;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn = data.udn || [];
    status = data.status || [];

    calendarApp = new CalendarApp(api, 'root');
    calendarApp.render();
});

class CalendarApp extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "CalendarioPedidos";
        this.calendar = null;
    }

    render() {
        this.layout();
        this.filterBar();
        this.initCalendar();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "flex mx-2 my-2 p-2",
            card: {
                filterBar: { 
                    class: "w-full my-3", 
                    id: "filterBar" + this.PROJECT_NAME 
                },
                container: { 
                    class: "w-full my-3 bg-[#1F2A37] rounded p-3", 
                    id: "container" + this.PROJECT_NAME 
                }
            }
        });

        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-3 pb-3">
                <h2 class="text-2xl font-semibold text-white">📅 Calendario de Pedidos</h2>
                <p class="text-gray-400">Visualiza todos los pedidos organizados por fecha</p>
            </div>
            <div id="calendar" class="p-3"></div>
        `);
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-4",
                    id: "calendar" + this.PROJECT_NAME,
                    lbl: "Rango de fechas:",
                },
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Sucursal:",
                    class: "col-sm-3",
                    data: [
                        { id: "", valor: "Todas las sucursales" },
                        ...udn
                    ],
                    onchange: "calendarApp.loadEvents()"
                },
                {
                    opc: "button",
                    id: "btnListado",
                    class: "col-sm-2",
                    text: "Ver Listado",
                    className: "btn-secondary w-100",
                    onClick: () => {
                        window.location.href = '../pedidos/index.php';
                    }
                }
            ]
        });

        dataPicker({
            parent: "calendar" + this.PROJECT_NAME,
            rangepicker: {
                startDate: moment().startOf("month"),
                endDate: moment().endOf("month"),
                showDropdowns: true,
                ranges: {
                    "Mes actual": [moment().startOf("month"), moment().endOf("month")],
                    "Semana actual": [moment().startOf("week"), moment().endOf("week")],
                    "Próxima semana": [
                        moment().add(1, "week").startOf("week"),
                        moment().add(1, "week").endOf("week")
                    ],
                    "Próximo mes": [
                        moment().add(1, "month").startOf("month"),
                        moment().add(1, "month").endOf("month")
                    ],
                    "Mes anterior": [
                        moment().subtract(1, "month").startOf("month"),
                        moment().subtract(1, "month").endOf("month")
                    ]
                }
            },
            onSelect: (start, end) => {
                this.loadEvents();
            }
        });
    }

    initCalendar() {
        const calendarEl = document.getElementById('calendar');
        
        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día'
            },
            events: (info, successCallback, failureCallback) => {
                this.loadEvents()
                    .then(events => successCallback(events))
                    .catch(error => {
                        console.error('Error loading events:', error);
                        failureCallback(error);
                    });
            },
            eventClick: (info) => {
                this.handleEventClick(info);
            },
            eventContent: (arg) => {
                return this.renderEventContent(arg);
            },
            eventDidMount: (info) => {
                this.addEventTooltip(info);
            },
            height: 'auto',
            contentHeight: 'auto',
            aspectRatio: 1.8
        });

        this.calendar.render();
    }

    async loadEvents() {
        try {
            const rangePicker = getDataRangePicker("calendar" + this.PROJECT_NAME);
            const udnValue = $(`#filterBar${this.PROJECT_NAME} #udn`).val();

            const response = await useFetch({
                url: this._link,
                data: {
                    opc: 'getOrders',
                    fi: rangePicker.fi,
                    ff: rangePicker.ff,
                    udn: udnValue || null
                }
            });

            if (response.status === 200) {
                if (this.calendar) {
                    this.calendar.removeAllEvents();
                    this.calendar.addEventSource(response.events);
                }
                return response.events;
            } else {
                alert({
                    icon: 'error',
                    text: response.message || 'Error al cargar los pedidos del calendario'
                });
                return [];
            }
        } catch (error) {
            console.error('Error en loadEvents:', error);
            alert({
                icon: 'error',
                text: 'Error de conexión con el servidor'
            });
            return [];
        }
    }

    handleEventClick(info) {
        const orderId = info.event.id;
        
        if (typeof app !== 'undefined' && typeof app.editOrder === 'function') {
            app.editOrder(orderId);
        } else {
            window.location.href = `../pedidos/index.php?action=view&id=${orderId}`;
        }
    }

    renderEventContent(arg) {
        const props = arg.event.extendedProps;
        const timeText = arg.timeText || '';
        
        let html = `
            <div class="fc-event-main-frame">
                <div class="fc-event-time">${timeText}</div>
                <div class="fc-event-title-container">
                    <div class="fc-event-title fc-sticky">
                        <strong>#${props.folio}</strong><br>
                        ${this.truncateText(props.cliente, 20)}
                    </div>
                </div>
            </div>
        `;

        return { html: html };
    }

    addEventTooltip(info) {
        const props = info.event.extendedProps;
        
        $(info.el).tooltip({
            title: `
                <div class="text-left">
                    <strong>Folio:</strong> #${props.folio}<br>
                    <strong>Cliente:</strong> ${props.cliente}<br>
                    <strong>Teléfono:</strong> ${props.telefono}<br>
                    <strong>Estado:</strong> ${props.estado}<br>
                    <strong>Total:</strong> ${formatPrice(props.total)}
                </div>
            `,
            html: true,
            placement: 'top',
            container: 'body',
            trigger: 'hover'
        });
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}
