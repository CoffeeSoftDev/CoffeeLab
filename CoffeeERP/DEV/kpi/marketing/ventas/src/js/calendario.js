class SalesCalendar extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SalesCalendar";
        this._ventasData = [];
        this._extremes = {
            ventas: {},
            cheque: {},
            clientes: {}
        };
        this._maxVentaGlobal  = 0;
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-calendar`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#container${this.PROJECT_NAME}`).html(`
        <!-- 🧭 Encabezado flexible -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-3 pt-3 pb-2 flex-wrap">
            
            <!-- 📅 Título -->
            <div class="flex flex-col">
                <h2 class="text-2xl font-semibold text-[#103B60] leading-tight">
                    📅 Calendario de Ventas
                </h2>
                <p class="text-gray-500 text-sm">
                    Visualiza las ventas de las últimas 5 semanas
                </p>
            </div>

                <!-- 🧭 Filtro UDN -->
                <div id="filterBar${this.PROJECT_NAME}"
                    class="w-full sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 flex justify-start sm:justify-end items-center"></div>
            </div>

            <!-- 📆 Contenedor del calendario -->
            <div id="calendario-container" class="px-2"></div>
        `);

        this.renderCalendar();
        this.filterBar();
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "w-full",
                    data: lsudn,
                    onchange: `calendar.renderCalendar()`
                }
            ]
        });
    }

    async renderCalendar() {
        const udn  = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const data = await useFetch({
            url : this._link,
            data: { opc: 'getCalendarioVentas', udn: udn }
        });

        // 🧮 Acumulamos todos los días
        this._ventasData = [];
        (data.semanas || []).forEach(sem => {
            sem.dias.forEach(dia => this._ventasData.push(dia));
        });

        // 📊 Calcular máximos/mínimos por día de la semana
        this._extremes = this.getWeeklyExtremes(this._ventasData);

        // 💰 Calcular la venta global más alta
        const valores = this._ventasData.map(d => parseFloat(d.total) || 0).filter(v => v > 0);
        this._maxVentaGlobal = valores.length ? Math.max(...valores) : 0;

        // 📅 Renderizar calendario
        this.calendarioVentas({
            parent     : 'calendario-container',
            id         : 'calendarioVentas',
            json       : data.semanas || [],
            onDayClick : this.showDayDetail.bind(this)
        });
    }

    calendarioVentas(options) {
        const defaults = {
            parent: "calendario-container",
            id: "calendarioVentas",
            class: "w-full",
            data: {},
            json: [],
            onDayClick: () => { },
            onWeekClick: () => { }
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            id: opts.id,
            class: opts.class
        });

        const calendarContainer = $("<div>", {
            class: "bg-white rounded-lg shadow-md p-4 border border-gray-200"
        });

        const diasHeader = $("<div>", {
            class: "grid grid-cols-7 gap-2 mb-4"
        });

        const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
        diasSemana.forEach(dia => {
            diasHeader.append(
                $("<div>", {
                    class: "text-center text-sm font-semibold text-gray-600 py-2",
                    text: dia
                })
            );
        });

        const diasContainer = $("<div>", {
            class: "grid grid-cols-7 gap-2"
        });

        if (opts.json && opts.json.length > 0) {
            const todosDias = [];
            opts.json.forEach((semana) => {
                semana.dias.forEach(dia => {
                    todosDias.push(dia);
                    this._ventasData.push(dia);
                });
            });

            todosDias.sort((a, b) => {
                return moment(a.fecha, 'YYYY-MM-DD') - moment(b.fecha, 'YYYY-MM-DD');
            });

            const semanas = this.agruparPorSemanas(todosDias);

            semanas.forEach(semana => {
                semana.forEach(dia => {
                    if (dia) {
                        const diaCard = this.renderDia(dia, opts);
                        diasContainer.append(diaCard);
                    } else {
                        diasContainer.append($("<div>", { class: "p-4" }));
                    }
                });
            });
        }

        calendarContainer.append(diasHeader, diasContainer);
        container.append(calendarContainer);
        $(`#${opts.parent}`).html(container);
    }

    // 📈 Calcula máximos/mínimos por día de la semana
    getWeeklyExtremes(data) {
        const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        const extremes = { ventas: {}, cheque: {}, clientes: {} };

        dias.forEach(d => {
            const diasSemana = data.filter(el => moment(el.fecha).format('dddd') === d);

            const ventas   = diasSemana.map(el => parseFloat(el.total) || 0).filter(v => v > 0);
            const cheque   = diasSemana.map(el => parseFloat((el.chequePromedio || "").replace(/[^\d.]/g, "")) || 0);
            const clientes = diasSemana.map(el => parseInt(el.clientes) || 0);

            extremes.ventas[d]   = { max: Math.max(...ventas, 0),   min: Math.min(...ventas,   ...ventas.length   ? [Infinity] : [0]) };
            extremes.cheque[d]   = { max: Math.max(...cheque, 0),   min: Math.min(...cheque,   ...cheque.length   ? [Infinity] : [0]) };
            extremes.clientes[d] = { max: Math.max(...clientes, 0), min: Math.min(...clientes, ...clientes.length ? [Infinity] : [0]) };
        });

        return extremes;
    }

    agruparPorSemanas(dias) {
        if (!dias || dias.length === 0) return [];

        const semanas = [];
        let semanaActual = new Array(7).fill(null);
        let primerDia = moment(dias[0].fecha, 'YYYY-MM-DD');
        let inicioSemana = primerDia.clone().startOf('isoWeek');

        dias.forEach(dia => {
            const fecha = moment(dia.fecha, 'YYYY-MM-DD');
            const diaSemana = fecha.isoWeekday() - 1;
            const semanaDia = fecha.clone().startOf('isoWeek');

            if (!semanaDia.isSame(inicioSemana, 'day')) {
                const semanaCompleta = this.completarSemana(semanaActual, inicioSemana);
                semanas.push(semanaCompleta);
                semanaActual = new Array(7).fill(null);
                inicioSemana = semanaDia;
            }

            semanaActual[diaSemana] = dia;
        });

        if (semanaActual.some(d => d !== null)) {
            const semanaCompleta = this.completarSemana(semanaActual, inicioSemana);
            semanas.push(semanaCompleta);
        }

        return semanas;
    }

    completarSemana(semana, inicioSemana) {
        return semana.map((dia, index) => {
            if (dia) return dia;

            const fecha = inicioSemana.clone().add(index, 'days');
            return {
                dia: fecha.format('DD'),
                mes: fecha.format('MM'),
                mesAbreviado: fecha.format('MMM').toLowerCase(),
                fecha: fecha.format('YYYY-MM-DD'),
                diaSemana: fecha.format('dddd'),
                total: 0,
                totalFormateado: '-',
                clientes: 0,
                chequePromedio: '-',
                isEmpty: true
            };
        });
    }

    // 🎨 Aplica color según máximo o mínimo
    getExtremeClass(value, { max, min }) {
        if (value === max && value > 0)
            return "text-green-600 font-extrabold";
        if (value === min && value > 0)
            return "text-red-500 font-bold ";
        return "text-[#103B60]";
    }

    // 📊 Detalle modal de día
    showDayDetail(dia) {
        bootbox.dialog({
            title: `<p class="text-2xl">📊 Ventas del ${dia.dia} de ${dia.mesAbreviado}</p>`,
            size: 'large',
            message: `
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-3">
                    <!-- 💰 Total -->
                    <div class="bg-gradient-to-br from-[#EAF3FA] to-[#C9E3F8] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(16,59,96,0.12)] hover:-translate-y-1 transition-all duration-300">
                        <div class="flex flex-col items-center">
                            <div class="text-3xl mb-2 text-[#103B60]">💰</div>
                            <h3 class="text-xs uppercase tracking-wide font-semibold text-[#335D84] mb-1">Total</h3>
                            <p class="text-2xl font-bold text-[#103B60] mt-1">${dia.totalFormateado}</p>
                        </div>
                    </div>
                    <!-- 👥 Clientes -->
                    <div class="bg-gradient-to-br from-[#E8F8ED] to-[#C9F3D7] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(140,198,63,0.18)] hover:-translate-y-1 transition-all duration-300">
                        <div class="flex flex-col items-center">
                            <div class="text-3xl mb-2 text-[#639C3F]">👥</div>
                            <h3 class="text-xs uppercase tracking-wide font-semibold text-[#6A9E56] mb-1">Clientes</h3>
                            <p class="text-2xl font-bold text-[#447733] mt-1">${dia.clientes}</p>
                        </div>
                    </div>
                    <!-- 🍽️ Cheque Promedio -->
                    <div class="bg-gradient-to-br from-[#FFF9E8] to-[#FCEFC2] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(255,200,80,0.18)] hover:-translate-y-1 transition-all duration-300">
                        <div class="flex flex-col items-center">
                            <div class="text-3xl mb-2 text-[#C79A00]">🍽️</div>
                            <h3 class="text-xs uppercase tracking-wide font-semibold text-[#B58900] mb-1">Cheque Promedio</h3>
                            <p class="text-2xl font-bold text-[#9A7400] mt-1">${dia.chequePromedio}</p>
                        </div>
                    </div>
                </div>
            `,
            buttons: {
                ok: { label: 'Cerrar', className: 'btn-primary' }
            }
        });
    }

    // 🧾 Renderización diaria con ribbon dorado si es el mejor día
    renderDia(dia, opts) {
        const isEmpty     = dia.isEmpty || dia.total === 0;
        const diaSemana   = moment(dia.fecha).format('dddd');
        const extremes    = this._extremes;
        const total       = parseFloat(dia.total) || 0;
        const cheque      = parseFloat((dia.chequePromedio || "").replace(/[^\d.]/g, "")) || 0;
        const clientes    = parseInt(dia.clientes) || 0;

        const totalClass    = this.getExtremeClass(total, extremes.ventas[diaSemana]);
        const chequeClass   = this.getExtremeClass(cheque, extremes.cheque[diaSemana]);
        const clientesClass = this.getExtremeClass(clientes, extremes.clientes[diaSemana]);

        const estrella      = (clientes === extremes.clientes[diaSemana].max && clientes > 0) ? "⭐" : "";
        const trofeoCheque  = (cheque === extremes.cheque[diaSemana].max && cheque > 0) ? "🏆" : "";

        // 💰 Es el mejor día global de ventas
        const esTopVentaGlobal = total === this._maxVentaGlobal && total > 0;

        // 🧱 Card base
        const card = $("<div>", {
            class: `relative rounded-2xl p-4 transition-all duration-300 ease-out cursor-pointer 
                    ${isEmpty ? 'bg-gray-50 text-gray-400' : 'bg-white shadow hover:shadow-lg'}`,
            click: isEmpty ? null : () => opts?.onDayClick?.(dia)
        });

        // ✨ Ribbon dorado (45°)
        if (esTopVentaGlobal) {
            const ribbon = $(`
                <div class="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                    <div class="ribbon-gold text-white text-[10px] font-bold rotate-45 absolute top-4 right-[-32px] text-center shadow-md">
                        MEJOR VENTA
                    </div>
                </div>
            `);
            card.append(ribbon);
        }

        // 🧭 Contenido
        card.append(`
            <div class="flex flex-col items-center text-center select-none">
                <div class="text-sm font-medium text-gray-500 mb-1">${dia.dia}/${dia.mes}</div>
                <div class="text-lg font-bold ${totalClass}">${dia.totalFormateado}</div>
                <div class="text-xs mt-1 ${clientesClass}">${estrella} ${dia.clientes} clientes</div>
                <div class="text-xs italic ${chequeClass}">${trofeoCheque} CP: ${dia.chequePromedio}</div>
            </div>
        `);

        // 🟩 Línea decorativa inferior
        card.append(`
            <div class="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#8CC63F] to-[#A7E056]
                 rounded-tr-xl rounded-bl-xl group-hover:w-full transition-all duration-300 ease-out"></div>
        `);

        return card;
    }
}
