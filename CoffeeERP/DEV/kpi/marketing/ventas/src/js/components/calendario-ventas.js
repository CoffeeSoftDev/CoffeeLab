/**
 * Componente: Calendario de Ventas Semanales
 * Muestra las últimas 5 semanas con totales diarios y semanales
 * Basado en el framework CoffeeSoft
 */

function calendarioVentas(options) {
    const defaults = {
        parent: "root",
        id: "calendarioVentas",
        class: "w-full p-4",
        title: "Calendario de Ventas - Últimas 5 Semanas",
        data: {},
        json: [],
        onDayClick: () => {},
        onWeekClick: () => {}
    };

    const opts = Object.assign({}, defaults, options);

    const container = $("<div>", {
        id: opts.id,
        class: opts.class
    });

    const header = $("<div>", {
        class: "mb-6"
    }).append(
        $("<h2>", {
            class: "text-2xl font-bold text-gray-800",
            text: opts.title
        })
    );

    const calendarContainer = $("<div>", {
        class: "space-y-6"
    });

    if (opts.json && opts.json.length > 0) {
        opts.json.forEach((semana, index) => {
            const semanaBlock = renderSemana(semana, index + 1, opts);
            calendarContainer.append(semanaBlock);
        });
    }

    container.append(header, calendarContainer);
    $(`#${opts.parent}`).html(container);
}

function renderSemana(semana, numeroSemana, opts) {
    const semanaContainer = $("<div>", {
        class: "bg-white rounded-lg shadow-md p-4 border border-gray-200"
    });

    const semanaHeader = $("<div>", {
        class: "flex justify-between items-center mb-4 pb-2 border-b border-gray-300"
    }).append(
        $("<h3>", {
            class: "text-lg font-semibold text-gray-700",
            text: `Semana ${numeroSemana}`
        }),
        $("<span>", {
            class: "text-lg font-bold text-[#8CC63F]",
            html: `Total: <span class="text-xl">${semana.totalSemana}</span>`
        })
    );

    const diasHeader = $("<div>", {
        class: "grid grid-cols-7 gap-2 mb-2"
    });

    const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    diasSemana.forEach(dia => {
        diasHeader.append(
            $("<div>", {
                class: "text-center text-sm font-semibold text-gray-600 py-1",
                text: dia
            })
        );
    });

    const diasContainer = $("<div>", {
        class: "grid grid-cols-7 gap-2"
    });

    semana.dias.forEach(dia => {
        const diaCard = renderDia(dia, opts);
        diasContainer.append(diaCard);
    });

    semanaContainer.append(semanaHeader, diasHeader, diasContainer);
    return semanaContainer;
}

function renderDia(dia, opts) {
    const total = parseFloat(dia.total) || 0;
    const colorClass = getColorByAmount(total);

    const diaCard = $("<div>", {
        class: `${colorClass} rounded-lg p-3 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[#8CC63F]`,
        click: () => {
            if (typeof opts.onDayClick === "function") {
                opts.onDayClick(dia);
            }
        }
    });

    const diaNumero = $("<div>", {
        class: "text-sm font-bold text-gray-700 mb-1",
        text: dia.dia
    });

    const diaTotal = $("<div>", {
        class: "text-lg font-bold text-gray-900",
        text: dia.totalFormateado
    });

    const diaClientes = $("<div>", {
        class: "text-xs text-gray-600 mt-1",
        text: `${dia.clientes} clientes`
    });

    const diaCheque = $("<div>", {
        class: "text-xs text-gray-500",
        text: `CP: ${dia.chequePromedio}`
    });

    diaCard.append(diaNumero, diaTotal, diaClientes, diaCheque);
    return diaCard;
}

function getColorByAmount(total) {
    if (total === 0) return "bg-gray-100";
    if (total < 20000) return "bg-blue-100";
    if (total < 30000) return "bg-yellow-100";
    if (total < 40000) return "bg-green-100";
    if (total < 50000) return "bg-green-200";
    return "bg-green-300";
}
