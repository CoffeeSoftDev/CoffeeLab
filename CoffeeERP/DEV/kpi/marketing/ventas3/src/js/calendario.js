// class SalesCalendar extends Templates {
//     constructor(link, div_modulo) {
//         super(link, div_modulo);
//         this.PROJECT_NAME = "SalesCalendar";
//         this._ventasData = [];
//     }

//     render() {
//         this.layout();
//     }

//     layout() {
//         this.primaryLayout({
//             parent: `container-calendar`,
//             id: this.PROJECT_NAME,
//             card: {
//                 filterBar: { class: 'w-full border-b pb-2', id: `filterBar` },
//                 container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
//             }
//         });

//         $(`#container${this.PROJECT_NAME}`).html(`
//         <!-- 🧭 Encabezado flexible -->
//         <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-3 pt-3 pb-2 flex-wrap">
            
//             <!-- 📅 Título -->
//             <div class="flex flex-col">
//                 <h2 class="text-2xl font-semibold text-[#103B60] leading-tight">
//                     📅 Calendario de Ventas
//                 </h2>
//                 <p class="text-gray-500 text-sm">
//                     Visualiza las ventas de las últimas 5 semanas
//                 </p>
//             </div>

//                 <!-- 🧭 Filtro UDN -->
//                 <div id="filterBar${this.PROJECT_NAME}"
//                     class="w-full sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 flex justify-start sm:justify-end items-center"></div>
//             </div>

//             <!-- 📆 Contenedor del calendario -->
//             <div id="calendario-container" class="px-2"></div>
//         `);

//         this.renderCalendar();
//         this.filterBar();
//     }

//     filterBar() {
//         this.createfilterBar({
//             parent: `filterBar${this.PROJECT_NAME}`,
//             data: [
//                 {
//                     opc: "select",
//                     id: "udn",
//                     lbl: "UDN",
//                     class: "w-full",
//                     data: lsudn,
//                     onchange: `salesCalendar.renderCalendar()`
//                 }
//             ]
//         });
//     }

//     async renderCalendar() {
//         // 🧠 Obtener datos
//         const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
//         const data = await useFetch({
//             url: this._link,
//             data: { opc: 'getCalendarioVentas', udn: udn }
//         });

//         // 📆 Renderizar calendario
//         this.calendarioVentas({
//             parent: 'calendario-container',
//             id: 'calendarioVentas',
//             json: data.semanas || [],
//             onDayClick: (dia) => {
//                 bootbox.dialog({
//                     title: `<p class="text-2xl">📊 Ventas del ${dia.dia} de ${dia.mesAbreviado}</p>`,
//                     size: 'large',
//                     message: `
//                     <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-3">
//                         <!-- 💰 Total -->
//                         <div class="bg-gradient-to-br from-[#EAF3FA] to-[#C9E3F8] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] 
//                                     hover:shadow-[0_8px_24px_rgba(16,59,96,0.12)] hover:-translate-y-1 transition-all duration-300">
//                             <div class="flex flex-col items-center">
//                                 <div class="text-3xl mb-2 text-[#103B60]">💰</div>
//                                 <h3 class="text-xs uppercase tracking-wide font-semibold text-[#335D84] mb-1">Total</h3>
//                                 <p class="text-2xl font-bold text-[#103B60] mt-1">${dia.totalFormateado}</p>
//                             </div>
//                         </div>

//                         <!-- 👥 Clientes -->
//                         <div class="bg-gradient-to-br from-[#E8F8ED] to-[#C9F3D7] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] 
//                                     hover:shadow-[0_8px_24px_rgba(140,198,63,0.18)] hover:-translate-y-1 transition-all duration-300">
//                             <div class="flex flex-col items-center">
//                                 <div class="text-3xl mb-2 text-[#639C3F]">👥</div>
//                                 <h3 class="text-xs uppercase tracking-wide font-semibold text-[#6A9E56] mb-1">Clientes</h3>
//                                 <p class="text-2xl font-bold text-[#447733] mt-1">${dia.clientes}</p>
//                             </div>
//                         </div>

//                         <!-- 🍽️ Cheque Promedio -->
//                         <div class="bg-gradient-to-br from-[#FFF9E8] to-[#FCEFC2] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] 
//                                     hover:shadow-[0_8px_24px_rgba(255,200,80,0.18)] hover:-translate-y-1 transition-all duration-300">
//                             <div class="flex flex-col items-center">
//                                 <div class="text-3xl mb-2 text-[#C79A00]">🍽️</div>
//                                 <h3 class="text-xs uppercase tracking-wide font-semibold text-[#B58900] mb-1">Cheque Promedio</h3>
//                                 <p class="text-2xl font-bold text-[#9A7400] mt-1">${dia.chequePromedio}</p>
//                             </div>
//                         </div>
//                     </div>
//                 `,
//                     buttons: {
//                         ok: {
//                             label: 'Cerrar',
//                             className: 'btn-primary'
//                         }
//                     }
//                 });
//             }
//         });
//     }

//     calendarioVentas(options) {
//         const defaults = {
//             parent: "calendario-container",
//             id: "calendarioVentas",
//             class: "w-full",
//             data: {},
//             json: [],
//             onDayClick: () => { },
//             onWeekClick: () => { }
//         };

//         const opts = Object.assign({}, defaults, options);

//         const container = $("<div>", {
//             id: opts.id,
//             class: opts.class
//         });

//         const calendarContainer = $("<div>", {
//             class: "bg-white rounded-lg shadow-md p-4 border border-gray-200"
//         });

//         // Header con días de la semana (solo una vez)
//         const diasHeader = $("<div>", {
//             class: "grid grid-cols-7 gap-2 mb-4"
//         });

//         const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
//         diasSemana.forEach(dia => {
//             diasHeader.append(
//                 $("<div>", {
//                     class: "text-center text-sm font-semibold text-gray-600 py-2",
//                     text: dia
//                 })
//             );
//         });

//         // Container para todos los días
//         const diasContainer = $("<div>", {
//             class: "grid grid-cols-7 gap-2"
//         });

//         if (opts.json && opts.json.length > 0) {
//             opts.json.forEach((semana) => {
//                 semana.dias.forEach(dia => {
//                     this._ventasData.push(dia); // 🧩 se almacenan todas las ventas
//                     const diaCard = this.renderDia(dia, opts);
//                     diasContainer.append(diaCard);
//                 });
//             });
//         }


//         calendarContainer.append(diasHeader, diasContainer);
//         container.append(calendarContainer);
//         $(`#${opts.parent}`).html(container);
//     }

//     // 🌸 Renderiza una card diaria con estilo Rosy Light ✨
//     renderDia(dia, opts) {
//         const total = parseFloat(dia.total) || 0;
//         const colorClass = this.highlightExtremes(total);
//         const bestCP = this.getBestChequePromedio(); // 🧠 obtenemos el mejor cheque promedio
//         const chequito = (dia.chequePromedio || "")
//             .toString()
//             .replace(/[^\d.,-]/g, " ") // quita $ , y espacios
//             .replace(",", ".");   // normaliza coma decimal

//         let cpValue = parseFloat(chequito) || 0;

//         const diaCard = $("<div>", {
//             id: `card-dia-${dia.dia}`,
//             class: `
//             group relative rounded-2xl p-4 bg-white/80 backdrop-blur-sm
//             shadow-[0_4px_16px_rgba(0,0,0,0.08)]
//             hover:shadow-[0_6px_24px_rgba(16,59,96,0.15)]
//             transition-all duration-300 ease-out cursor-pointer
//         `,
//             click: () => opts?.onDayClick?.(dia)
//         });

//         const diaNumero = $("<div>", {
//             class: "text-sm font-medium text-gray-500 uppercase tracking-wide mb-1",
//             text: `${dia.dia}/${dia.mes}`
//         });

//         const diaTotal = $("<div>", {
//             class: `text-2xl font-bold mt-1 ${colorClass}`,
//             text: dia.totalFormateado
//         });

//         const diaClientes = $("<div>", {
//             class: "text-xs text-gray-600",
//             text: `${dia.clientes} clientes`
//         });

//         // 🧾 Badge solo si es el mejor CP
//         let diaCheque;
//         if (cpValue == bestCP && cpValue > 0) {
//             diaCheque = $("<div>", {
//                 class: "flex items-center justify-center mt-1",
//                 html: `
//                 <span class="
//                     inline-flex items-center gap-1 px-2 py-1 rounded-full
//                     bg-gradient-to-r from-[#EAF3FA] to-[#C9E3F8]
//                     text-[#103B60] font-semibold text-[11px] tracking-wide
//                     shadow-[0_1px_4px_rgba(16,59,96,0.15)]
//                     border border-white/40 backdrop-blur-sm animate-pulse
//                 ">
//                     <i class="icon-trophy text-[#103B60] text-[12px]"></i>
//                     CP: <span class="font-bold">${dia.chequePromedio}</span>
//                 </span>
//             `
//             });
//         } else {
//             diaCheque = $("<div>", {
//                 class: "text-xs text-gray-500 italic",
//                 text: `CP: ${dia.chequePromedio}`
//             });
//         }

//         const accentLine = $("<div>", {
//             class: `
//             absolute bottom-0 left-0 w-0 h-1
//             bg-gradient-to-r from-[#8CC63F] to-[#A7E056]
//             rounded-tr-xl rounded-bl-xl
//             group-hover:w-full transition-all duration-300 ease-out
//         `
//         });

//         diaCard.append(
//             $("<div>", {
//                 class: "flex flex-col items-center text-center select-none",
//                 html: `
//                 ${diaNumero.prop("outerHTML")}
//                 ${diaTotal.prop("outerHTML")}
//                 ${diaClientes.prop("outerHTML")}
//                 ${diaCheque.prop("outerHTML")}
//             `
//             }),
//             accentLine
//         );

//         return diaCard;
//     }

//     // 📊 Determina la clase de color para el número según máximo y mínimo con venta
//     highlightExtremes(total) {
//         // Validamos que exista la data en memoria
//         if (!this._ventasData || this._ventasData.length === 0) return "text-gray-700";

//         // 🔹 Convertir totales a números válidos
//         const valores = this._ventasData
//             .map(d => parseFloat(d.total) || 0)
//             .filter(v => v > 0); // ✅ solo ventas reales (ignora ceros o nulos)

//         if (valores.length === 0) return "text-gray-700";

//         // 🔍 Determinar máximos y mínimos con venta
//         const maxVenta = Math.max(...valores);
//         const minVenta = Math.min(...valores);

//         // 🎨 Retornar clases de color según el valor actual
//         if (total === maxVenta) {
//             return "text-green-600 font-extrabold";
//         } else if (total === minVenta && total > 0) {
//             return "text-red-500 font-extrabold animate-pulse";
//         } else {
//             return "text-[#103B60]";
//         }
//     }

//     // 🏆 Devuelve el cheque promedio más alto con venta (corrigido)
//     getBestChequePromedio() {
//         if (!this._ventasData || this._ventasData.length === 0) return 0;

//         const valores = this._ventasData
//             .map(d => {
//                 const val = (d.chequePromedio || "")
//                     .toString()
//                     .replace(/[^\d.,-]/g, " ") // quita $ , y espacios
//                     .replace(",", ".");       // normaliza coma decimal
//                 return parseFloat(val) || 0;
//             })
//             .filter(v => v > 0);
//         // console.log(valores)
//         return valores.length ? Math.max(...valores) : 0;
//     }
// }

class SalesCalendar extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SalesCalendar";
        this._ventasData = [];
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
        // 🧠 Obtener datos
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const data = await useFetch({
            url: this._link,
            data: { opc: 'getCalendarioVentas', udn: udn }
        });

        console.log('📅 Datos del backend:', data);
        console.log('📅 Estructura semanas:', data.semanas);

        // 📆 Renderizar calendario
        this.calendarioVentas({
            parent: 'calendario-container',
            id: 'calendarioVentas',
            json: data.semanas || [],
            onDayClick: (dia) => {
                bootbox.dialog({
                    title: `<p class="text-2xl">📊 Ventas del ${dia.dia} de ${dia.mesAbreviado}</p>`,
                    size: 'large',
                    message: `
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-3">
                        <!-- 💰 Total -->
                        <div class="bg-gradient-to-br from-[#EAF3FA] to-[#C9E3F8] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] 
                                    hover:shadow-[0_8px_24px_rgba(16,59,96,0.12)] hover:-translate-y-1 transition-all duration-300">
                            <div class="flex flex-col items-center">
                                <div class="text-3xl mb-2 text-[#103B60]">💰</div>
                                <h3 class="text-xs uppercase tracking-wide font-semibold text-[#335D84] mb-1">Total</h3>
                                <p class="text-2xl font-bold text-[#103B60] mt-1">${dia.totalFormateado}</p>
                            </div>
                        </div>

                        <!-- 👥 Clientes -->
                        <div class="bg-gradient-to-br from-[#E8F8ED] to-[#C9F3D7] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] 
                                    hover:shadow-[0_8px_24px_rgba(140,198,63,0.18)] hover:-translate-y-1 transition-all duration-300">
                            <div class="flex flex-col items-center">
                                <div class="text-3xl mb-2 text-[#639C3F]">👥</div>
                                <h3 class="text-xs uppercase tracking-wide font-semibold text-[#6A9E56] mb-1">Clientes</h3>
                                <p class="text-2xl font-bold text-[#447733] mt-1">${dia.clientes}</p>
                            </div>
                        </div>

                        <!-- 🍽️ Cheque Promedio -->
                        <div class="bg-gradient-to-br from-[#FFF9E8] to-[#FCEFC2] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] 
                                    hover:shadow-[0_8px_24px_rgba(255,200,80,0.18)] hover:-translate-y-1 transition-all duration-300">
                            <div class="flex flex-col items-center">
                                <div class="text-3xl mb-2 text-[#C79A00]">🍽️</div>
                                <h3 class="text-xs uppercase tracking-wide font-semibold text-[#B58900] mb-1">Cheque Promedio</h3>
                                <p class="text-2xl font-bold text-[#9A7400] mt-1">${dia.chequePromedio}</p>
                            </div>
                        </div>
                    </div>
                `,
                    buttons: {
                        ok: {
                            label: 'Cerrar',
                            className: 'btn-primary'
                        }
                    }
                });
            }
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

    // 🌸 Renderiza una card diaria con estilo Rosy Light ✨
    renderDia(dia, opts) {
        const isEmpty = dia.isEmpty || dia.total === 0;
        const total = parseFloat(dia.total) || 0;
        const colorClass = isEmpty ? 'text-gray-400' : this.highlightExtremes(total);
        const bestCP = this.getBestChequePromedio();
        const chequito = (dia.chequePromedio || "")
            .toString()
            .replace(/[^\d.,-]/g, " ")
            .replace(",", ".");

        let cpValue = parseFloat(chequito) || 0;

        const cardClass = isEmpty
            ? `group relative rounded-2xl p-4 bg-gray-50/50 backdrop-blur-sm
               shadow-[0_2px_8px_rgba(0,0,0,0.04)]
               transition-all duration-300 ease-out`
            : `group relative rounded-2xl p-4 bg-white/80 backdrop-blur-sm
               shadow-[0_4px_16px_rgba(0,0,0,0.08)]
               hover:shadow-[0_6px_24px_rgba(16,59,96,0.15)]
               transition-all duration-300 ease-out cursor-pointer`;

        const diaCard = $("<div>", {
            id: `card-dia-${dia.dia}-${dia.mes}`,
            class: cardClass,
            click: isEmpty ? null : () => opts?.onDayClick?.(dia)
        });

        const diaNumero = $("<div>", {
            class: "text-sm font-medium text-gray-500 uppercase tracking-wide mb-1",
            text: `${dia.dia}/${dia.mes}`
        });

        const diaTotal = $("<div>", {
            class: `text-2xl font-bold mt-1 ${colorClass}`,
            text: dia.totalFormateado
        });

        const diaClientes = $("<div>", {
            class: "text-xs text-gray-600",
            text: `${dia.clientes} clientes`
        });

        // 🧾 Badge solo si es el mejor CP
        let diaCheque;
        if (cpValue == bestCP && cpValue > 0) {
            diaCheque = $("<div>", {
                class: "flex items-center justify-center mt-1",
                html: `
                <span class="
                    inline-flex items-center gap-1 px-2 py-1 rounded-full
                    bg-gradient-to-r from-[#EAF3FA] to-[#C9E3F8]
                    text-[#103B60] font-semibold text-[11px] tracking-wide
                    shadow-[0_1px_4px_rgba(16,59,96,0.15)]
                    border border-white/40 backdrop-blur-sm animate-pulse
                ">
                    <i class="icon-trophy text-[#103B60] text-[12px]"></i>
                    CP: <span class="font-bold">${dia.chequePromedio}</span>
                </span>
            `
            });
        } else {
            diaCheque = $("<div>", {
                class: "text-xs text-gray-500 italic",
                text: `CP: ${dia.chequePromedio}`
            });
        }

        const accentLine = $("<div>", {
            class: `
            absolute bottom-0 left-0 w-0 h-1
            bg-gradient-to-r from-[#8CC63F] to-[#A7E056]
            rounded-tr-xl rounded-bl-xl
            group-hover:w-full transition-all duration-300 ease-out
        `
        });

        diaCard.append(
            $("<div>", {
                class: "flex flex-col items-center text-center select-none",
                html: `
                ${diaNumero.prop("outerHTML")}
                ${diaTotal.prop("outerHTML")}
                ${diaClientes.prop("outerHTML")}
                ${diaCheque.prop("outerHTML")}
            `
            }),
            accentLine
        );

        return diaCard;
    }

    // 📊 Determina la clase de color para el número según máximo y mínimo con venta
    highlightExtremes(total) {
        // Validamos que exista la data en memoria
        if (!this._ventasData || this._ventasData.length === 0) return "text-gray-700";

        // 🔹 Convertir totales a números válidos
        const valores = this._ventasData
            .map(d => parseFloat(d.total) || 0)
            .filter(v => v > 0); // ✅ solo ventas reales (ignora ceros o nulos)

        if (valores.length === 0) return "text-gray-700";

        // 🔍 Determinar máximos y mínimos con venta
        const maxVenta = Math.max(...valores);
        const minVenta = Math.min(...valores);

        // 🎨 Retornar clases de color según el valor actual
        if (total === maxVenta) {
            return "text-green-600 font-extrabold";
        } else if (total === minVenta && total > 0) {
            return "text-red-500 font-extrabold animate-pulse";
        } else {
            return "text-[#103B60]";
        }
    }

    // 🏆 Devuelve el cheque promedio más alto con venta (corrigido)
    getBestChequePromedio() {
        if (!this._ventasData || this._ventasData.length === 0) return 0;

        const valores = this._ventasData
            .map(d => {
                const val = (d.chequePromedio || "")
                    .toString()
                    .replace(/[^\d.,-]/g, " ") // quita $ , y espacios
                    .replace(",", ".");       // normaliza coma decimal
                return parseFloat(val) || 0;
            })
            .filter(v => v > 0);
        // console.log(valores)
        return valores.length ? Math.max(...valores) : 0;
    }
}
