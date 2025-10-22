class GestorActividadesAssign extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Asignados";
    }

    render() {
        this.filterBar();
        this.ls();
        $("#estadoAsignados").val(2).trigger("change");
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            data: [
                {
                    opc: "select",
                    class: "col-sm-6 col-md-4 col-lg-2",
                    id: "estado" + this.PROJECT_NAME,
                    lbl: "Seleccionar estados: ",
                    data: estados,
                    onchange: "assign.validateListView()",
                },
            {
                    opc: "select",
                    class: "col-sm-6 col-md-4 col-lg-2 d-none",
                    id: "filtroMesAsign",
                    lbl: "Seleccionar mes:",
                    data: meses,
                    onchange: "assign.validateListView()",
                },
            ],
        });
    }

    validateListView() {
        // Mostrar u ocultar filtro de mes
        if ($('#estadoAsignados').val() == "4") {
            $("#filtroMesAsign").parent().removeClass("d-none");
            // Agrega la opción solo si no existe
            if ($("#visualizarPorAsignados option[value='fecha_termino_asignados']").length == 0) {
                $("#visualizarPorAsignados").append('<option value="fecha_termino_asignados">✅ Fecha de término real</option>');
            }
        } else {
            $("#filtroMesAsign").parent().addClass("d-none");
            // Elimina la opción si existe
            $("#visualizarPorAsignados option[value='fecha_termino_asignados']").remove();
        }

        if ($("#btnListViewAssign").hasClass("bg-blue-200/70")) {
            assign.ls();
        } else {
            assign.calendar();
        }
    }

    ls() {
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "ls" },
            conf: { datatable: true, pag: 10 },
           coffeesoft: true,
            attr: {
                theme: 'corporativo',
                id: "tbConcentradoGestor" + this.PROJECT_NAME,
                center: [1, 2, 6, 7, 8],
              
                f_size: 12,
                extends: true,
            },
        });
    }

    async onShowActivity(id) {
        let idUserSession = getCookies().IDU || 0;
        let tareas = await useFetch({
            url: this._link,
            data: { opc: 'getActivity', id: id, idUserSession: idUserSession }
        });

        let datos = tareas.data;
        if (!datos) {
            alert({
                icon: "error",
                title: "Error",
                text: "No se encontraron datos",
            });
            return;
        } else {
            let bot =bootbox.dialog({
                title: "",
                closeButton: false,
                backdrop: true,
                message: `<div id="containerActivity"></div>`,
                id: "modal",
                buttons: {
                    close: {
                        label: "Cerrar",
                        className: "btn-secondary",
                        callback: function () {
                            bot.modal('hide');
                        }
                    },
                }
            });
        }
        this.createTaskDetail({
            parent: 'containerActivity',
            data: tareas.data
        });
    }

    createTaskDetail(options) {
        const defaults = {
            parent: 'containerprimaryLayout',
            data: [],
            onEdit: (id) => { },
            onClose: () => { }
        };

        const opts = Object.assign({}, defaults, options);
        const list = opts.data;
        const $root = $('<div class=""></div>');
        let idUserSession = getCookies().IDU || 0;

        list.forEach(item => {
            let concepto = '';
            let avances = item.advances || [];
            item.average = item.average != null ? item.average : '';

            // 📌 Mapeo visual por promedio.
            if (item.average != null) {
                if (item.average == 0) {
                    concepto = `
                    <div class="flex items-center gap-2 bg-red-500/10 text-red-600 px-3 py-2 rounded-full shadow-sm text-sm font-medium">
                        <span class="text-xs font-semibold uppercase">FALTA EVALUACIÓN!</span>
                    </div>`;
                }
                else if (item.average > 0 && item.average < 2) {
                    concepto = `
                    <div class="flex items-center gap-2 bg-red-500/10 text-red-600 px-3 py-2 rounded-full shadow-sm text-sm font-medium">
                        <label class="font-bold"> ${item.average}⭐</label>
                        <span class="text-xs font-semibold uppercase">BAJO DESEMPEÑO</span>
                    </div>`;
                }
                else if (item.average >= 2 && item.average < 3) {
                    concepto = `
                    <div class="flex items-center gap-2 bg-orange-500/10 text-orange-600 px-3 py-2 rounded-full shadow-sm text-sm font-medium">
                        <label class="font-bold"> ${item.average}⭐</label>
                        <span class="text-xs font-semibold uppercase">DESEMPEÑO CON ÁREAS DE OPORTUNIDAD</span>
                    </div>`;
                }
                else if (item.average >= 3 && item.average < 4) {
                    concepto = `
                    <div class="flex items-center gap-2 bg-yellow-500/10 text-yellow-600 px-3 py-2 rounded-full shadow-sm text-sm font-medium">
                        <label class="font-bold"> ${item.average}⭐</label>
                        <span class="text-xs font-semibold uppercase">DESEMPEÑO ESPERADO</span>
                    </div>`;
                }
                else if (item.average >= 4 && item.average < 5) {
                    concepto = `
                    <div class="flex items-center gap-2 bg-blue-500/10 text-blue-600 px-3 py-2 rounded-full shadow-sm text-sm font-medium">
                        <label class="font-bold"> ${item.average}⭐</label>
                        <span class="text-xs font-semibold uppercase">ALTO DESEMPEÑO</span>
                    </div>`;
                }
                else if (item.average >= 5) {
                    concepto = `
                    <div class="flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-2 rounded-full shadow-sm text-sm font-medium">
                        <label class="font-bold"> ${item.average}⭐</label>
                        <span class="text-xs font-semibold uppercase">DESEMPEÑO EXTRAORDINARIO 🏅</span>
                    </div>`;
                }
            }

            // 🟢 Colores dinámicos por estado
            const statusColorMap = {
                '1': { bg: 'bg-gray-100', text: 'text-gray-800' },
                '2': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
                '3': { bg: 'bg-purple-100', text: 'text-purple-800' },
                '4': { bg: 'bg-green-100', text: 'text-green-800' },
                '5': { bg: 'bg-red-100', text: 'text-red-800' },
                '6': { bg: 'bg-red-800', text: 'text-white' } // Atrasado
            };

            const statusStyle = statusColorMap[item.id_status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

            // 🔴 Color por prioridad
            const priorityMap = {
                '1': { bg: 'bg-red-100', text: 'text-red-800' },
                '2': { bg: 'bg-orange-100', text: 'text-orange-800' },
                '3': { bg: 'bg-blue-100', text: 'text-blue-800' }
            };

            const priorityStyle = priorityMap[item.id_priority] || { bg: 'bg-gray-100', text: 'text-gray-800' };

            const $card = $(`
                <div class="bg-white rounded-xl  text-sm text-gray-800 space-y-2 w-full max-w-md mx-auto">
                    <div class="flex justify-between items-start border-b pb-2">
                        <div class="flex flex-col">
                            <h2 class="text-lg font-bold uppercase">${item.title || ''}</h2>
                            <div class="flex flex-wrap gap-2">
                                <span class="text-xs font-bold px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}">
                                    ${item.name_status}
                                </span>
                                <span class="text-xs font-bold px-2 py-0.5 rounded-full ${priorityStyle.bg} ${priorityStyle.text}">
                                   ${item.priority} prioridad
                                </span>
                            </div>
                        </div>
                    </div>

                
                    <!-- ⭐ Calificación (solo si finalizado) -->
                    ${item.id_status == '4' ? `${concepto}` : ''}

                    <!-- 📋 Descripción -->
                    <div class="grid grid-cols-2 gap-3 text-[13px] mb-3">
                        <div class="flex items-start gap-2">
                            <i class="icon-user-2 text-[18px] text-gray-400 mt-1"></i>
                            <div>
                                <strong>Creado por:</strong><br>
                                ${item.userCreator}
                            </div>
                        </div>

                        <div class="flex items-start gap-2">
                            <i class="icon-user-2 text-[18px] text-gray-400 mt-1"></i>
                            <div>
                                <strong>Responsable:</strong><br>
                                ${item.name}
                            </div>
                        </div>

                        <div class="flex items-start gap-2">
                            <i class="icon-briefcase text-[18px] text-gray-400 mt-1"></i>
                            <div>
                                <strong>UDN:</strong><br>
                                ${item.UDN}
                            </div>
                        </div>

                        <div class="flex items-start gap-2">
                            <i class="  icon-calendar-2 text-[18px] text-gray-400 mt-1"></i>
                            <div>
                                <strong>Creado el:</strong><br>
                                ${item.date_creation}
                            </div>
                        </div>

                        <div class="flex items-start gap-2">
                            <i class="  icon-calendar-2 text-[18px] text-gray-400 mt-1"></i>
                            <div>
                                <strong>Inicio:</strong><br>
                                ${item.date_start}
                            </div>
                        </div>

                        <div class="flex items-start gap-2">
                            <i class="icon-calendar-2  text-[18px] text-gray-400 mt-1"></i>
                            <div>
                                <strong>Finaliza:</strong><br>
                                ${item.date_end}
                            </div>
                        </div>

                        <div class="flex items-start gap-2">
                            <i class=" icon-calendar-2 text-[18px] text-gray-400 mt-1"></i>
                            <div>
                                <strong>Terminado el:</strong><br>
                                ${item.date_finished || '-'}
                            </div>
                        </div>

                        <div class="flex items-start gap-2">
                            <i class=" icon-calendar-empty text-[18px] text-gray-400 mt-1"></i>
                            <div>
                                <strong>Días transcurridos:</strong><br>
                                ${item.days}
                            </div>
                        </div>
                    </div>

                    <!-- 📝 Objetivo -->
                    <div class="mb-3">
                        <p class="text-xs font-bold mb-1 uppercase text-gray-700">Objetivo</p>
                        <div class="bg-gray-50 border border-gray-200 p-2 px-3 rounded-md text-gray-700">${item.objetivo || '-'}</div>
                    </div>

                    <!-- 📝 Actividades -->
                    <div class="mb-3">
                        <p class="text-xs font-bold mb-1 uppercase text-gray-700">Actividades</p>
                        <div class="bg-gray-50 border border-gray-200 p-2 px-3 rounded-md text-gray-700">${item.activities || '-'}</div>
                    </div>

                    <!-- 📊 Avances -->
                    ${item.id_status != '4' ? `
                        <div class="mb-3">
                            <div class="flex justify-between items-center mb-2">
                                <p class="text-xs font-bold uppercase text-gray-700">Últimos avances</p>
                                <p class="text-xs text-gray-500 text-right">Visto por el responsable: ${item.date_seen ? item.date_seen : '-'}</p>
                            </div>
                            <div class="bg-gray-50 border border-gray-200 p-2 rounded-md text-gray-700 space-y-2">
                                ${avances.length > 0 ? `
                                    <div class="relative text-center">
                                        <a class="text-[11px] text-blue-400 px-2 bg-gray-50 z-10 relative cursor-pointer" onclick="gestor.advanceModal(${item.id},${item.idUserCreator},${item.idUserResponsible})">ver anteriores</a>
                                        <div class="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-300 z-0"></div>
                                    </div>` + avances
                                    .slice()
                                    .reverse()
                                    .map(
                                        (avance) => `
                                        <div class="flex gap-2 items-start">
                                            <div class="bg-white border border-gray-200 rounded-xl shadow-sm px-3 py-2 text-sm text-gray-800 w-full">
                                                <div class="mb-1 text-xs text-gray-500 flex justify-between items-center">
                                                    <div class="flex items-center gap-2">
                                                        <i class="icon-user text-gray-400"></i>
                                                        ${avance.usuario}
                                                    </div>
                                                    <div class="text-[11px] text-gray-400">${avance.date}</div>
                                                </div>
                                                <div class="text-gray-700 text-sm">
                                                    ${avance.avance}
                                                </div>
                                            </div>
                                        </div>
                                    `).join("") : `<div class="text-sm text-gray-500">-</div>`
                                }
                            </div>
                        </div>
                    ` : ''}

                    <!-- ⭐ Calificacion -->
                    ${item.id_status == '4' ? `
                        <!-- ❓ Preguntas de evaluación -->
                        <div class="mb-3">
                            <p class="text-xs font-bold mb-1 uppercase text-gray-700">Preguntas de evaluación</p>
                            <div class="bg-gray-50 border border-gray-200 p-2 px-3 rounded-md text-gray-700 space-y-3">
                                ${item.questions.length > 0 ? item.questions.map((q) => `
                                    <div class="p-2 border border-gray-200 rounded-md">
                                        <p class="text-sm font-medium mb-2">${q.question || ''}</p>

                                        <!-- Visualización de desempeño -->
                                        ${q.calification == null ? 
                                            `<p class="text-sm text-gray-400">No respondida</p>` : 
                                            `
                                            <div class="inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full shadow-sm 
                                                ${q.calification == 1 ? 'bg-red-500/10 text-red-600' : ''}
                                                ${q.calification == 2 ? 'bg-orange-500/10 text-orange-600' : ''}
                                                ${q.calification == 3 ? 'bg-yellow-500/10 text-yellow-600' : ''}
                                                ${q.calification == 4 ? 'bg-blue-500/10 text-blue-600' : ''}
                                                ${q.calification == 5 ? 'bg-green-500/10 text-green-600' : ''}">
                                                <span class="text-yellow-400">
                                                    ${'★'.repeat(q.calification)}
                                                </span>
                                                <span class="text-xs">
                                                    ${q.calification == 1 ? 'BD' : ''}
                                                    ${q.calification == 2 ? 'DA' : ''}
                                                    ${q.calification == 3 ? 'DE' : ''}
                                                    ${q.calification == 4 ? 'AD' : ''}
                                                    ${q.calification == 5 ? 'DEX' : ''}
                                                </span>
                                            </div>
                                            `
                                        }
                                    </div>
                                `).join('') : `<div class="text-sm text-gray-500">-</div>`}
                            </div>
                        </div>

                        <!-- 🗨️ Feedback -->
                        <div class="mb-3">
                            <p class="text-xs font-bold mb-1 uppercase text-gray-700">Retroalimentación</p>
                            <div class="bg-gray-50 border border-gray-200 p-2 px-3 rounded-md text-gray-700">
                                ${item.feedback != null ? item.feedback : ''}
                            </div>
                        </div>

                    ` : ''}

                    <!-- 🗂️ Boton Enviar recordatorio whatsap -->
                    ${item.idUserCreator == idUserSession && (item.id_status == '2' || item.id_status == '1' || item.id_status == '6') ? `
                    <div class="flex justify-end gap-2">
                      <button
                        onclick="assign.messageWhats(${item.id}, '${item.title}', '${item.phone}', '${item.userCreator}', '${item.name_status}', '${item.name}')"
                        class="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm shadow-md"
                        title="Enviar recordatorio por WhatsApp"
                        >
                        <i class="icon-whatsapp text-base"></i>
                        <span>Recordar</span>
                        </button>
                    </div>
                    ` : ''}
            </div>
            `);
            $root.append($card);
        });


        $(`#${opts.parent}`).html($root);
    }

    async messageWhats(id, actividad, telefono, creador, status, responsable) {
        // let data = await useFetch({ url: APP._link, data: { opc: 'messageWhats', id: id} });
        let mensaje =
            `👋 Hola, ${responsable}.\n\n` +
            `Te recordamos que tienes una actividad asignada con estado *${status}*.\n\n` +
            `📌 *Actividad:* ${actividad}\n` +
            `👤 *Asignado por:* ${creador}\n\n` +
            `🔗 Puedes ver los detalles completos en el Gestor de Actividades.\n\n` +
            `Gracias y buen día.`;

        wsp(telefono, mensaje);
        alert({
            icon: "success",
            title: "Mensaje enviado",
            text: "Mensaje enviado correctamente",
            timer: 1000,
        });
    }

    async calendar() {
        let estado = $("#estadoAsignados").val() || 0; 
        let filtroMes = $("#filtroMesAsign").val() || 0;
        let fechita = $("#visualizarPorAsignados").val() || 'fecha_final_asignados';

        let data = await useFetch({ url: this._link, data: { opc: 'getCalendario', estadoAsignados: estado, filtroMesAsign: filtroMes, fechita: fechita } });

        $(`#containerAsignados`).html('');
        var calendarEl = document.getElementById('containerAsignados');

        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', // Vista por defecto (mes)
            locale: 'es', // Idioma español
            buttonText: {
                today: "Hoy",
                month: "Mes",
                year: "Año",
            },
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            businessHours: true,
            events: data,
            eventDidMount: function (info) {
                info.el.classList.add('cursor-pointer');
            },
            datesSet: function () {

            },

            // Cómo se mostrará el evento en el calendario
            eventContent: function (arg) {
                let titleEl = document.createElement("div");
                let statusEl = document.createElement("div");
                let argColor = "";
                titleEl.classList.add("text-xs", "font-bold", "whitespace-normal",);

                // ✂️ Truncar a 30 palabras
                let fullTitle = `${arg.event.extendedProps.location} - ${arg.event.title || ''}`;
                let words = fullTitle.split(" ");
                let truncatedTitle = words.length > 12 ? words.slice(0, 12).join(" ") + "…" : fullTitle;
                titleEl.innerHTML = truncatedTitle;

                let idstatus = arg.event.extendedProps.idstatus || "";
                let status = arg.event.extendedProps.status || "";

                if (idstatus == 1) {
                    argColor =
                        '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(205, 73, 69); display: inline-flex; flex-shrink: 0;"></div>';
                    statusEl.classList.add(
                        "not-started",
                        "rounded-pill",
                        "text-center",
                        "d-inline-block",
                        "pe-1",
                        "ps-1",
                        "text-xs"
                    );
                    statusEl.innerHTML = argColor + status || "";
                } else if (idstatus == 2) {
                    argColor =
                        '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(202, 142, 27); display: inline-flex; flex-shrink: 0;"></div>';
                    statusEl.classList.add(
                        "in-progress",
                        "rounded-pill",
                        "text-center",
                        "d-inline-block",
                        "pe-1",
                        "ps-1",
                        "text-xs"
                    );
                    statusEl.innerHTML = argColor + status || "";
                } else if (idstatus == 4) {
                    argColor =
                        '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(45, 153, 100); display: inline-flex; flex-shrink: 0;"></div>';
                    statusEl.classList.add(
                        "completed",
                        "rounded-pill",
                        "text-center",
                        "d-inline-block",
                        "pe-1",
                        "ps-1",
                        "text-xs"
                    );
                    statusEl.innerHTML = argColor + status || "";
                } else if (idstatus == 5 || idstatus == 6) {
                    argColor =
                        '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #DC3545; display: inline-flex; flex-shrink: 0;"></div>';
                    statusEl.classList.add(
                        "cancelled",
                        "rounded-pill",
                        "text-center",
                        "d-inline-block",
                        "pe-1",
                        "ps-1",
                        "text-xs"
                    );
                    statusEl.innerHTML = argColor + status || "";
                } else if (idstatus == 3) {
                    argColor =
                        '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #6C757D; display: inline-flex; flex-shrink: 0;"></div>';
                    statusEl.classList.add(
                        "postponed",
                        "rounded-pill",
                        "text-center",
                        "d-inline-block",
                        "pe-1",
                        "ps-1",
                        "text-xs"
                    );
                    statusEl.innerHTML = argColor + status || "";
                } else {
                    statusEl.classList.add("text-muted");
                    statusEl.innerHTML = status || "";
                }

                let arrayOfDomNodes = [titleEl, statusEl];

                return { domNodes: arrayOfDomNodes };
            },

            // Click en el evento
            eventClick: function (info) {
                assign.onShowActivity(info.event.id);
            },
        });

        calendar.render();
        $(".fc-button").removeClass("fc-button-primary");

        $(".fc-button").css({
            backgroundColor: "#DADBDC",
            color: "#1e3a8a",
            border: "none",
            fontWeight: "500",
            boxShadow: "none"
        });

        $(".fc-button-active").css({
            backgroundColor: "#bfdbfe",
            color: "#1e3a8a"
        });
        const $toolbar = $(".fc-header-toolbar");

        // Verifica si ya existe el span antes de agregarlo
        if ($toolbar.find("span.fc-custom-note").length == 0) {
            // Agrega el span al último chunk **sin alterar el título**
            const $lastChunk = $toolbar.children(".fc-toolbar-chunk").last();

            // Inserta solo si ese chunk está vacío (evita mover el h2)
            if ($lastChunk.children().length == 0) {
                $lastChunk.append(`
                    <div class="flex flex-col gap-1 bg-blue-500/10 px-3 py-2 rounded-md shadow-sm w-fit">
                        <label for="visualizarPorAsignados" class="text-xs font-medium text-blue-700">
                            Visualizar por:
                        </label>
                        <select id="visualizarPorAsignados" class="text-xs border border-blue-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-400 focus:border-blue-400" onchange="assign.calendar()">
                            <option value="fecha_final_asignados">📅 Fecha final</option>
                            <option value="fecha_inicio_asignados">📅 Fecha inicio</option>
                        </select>
                    </div>
                `);
            }

            // Mostrar u ocultar filtro de mes
            if ($('#estadoAsignados').val() == "4") {
                // Agrega la opción solo si no existe
                if ($("#visualizarPorAsignados option[value='fecha_termino_asignados']").length == 0) {
                    $("#visualizarPorAsignados").append('<option value="fecha_termino_asignados">✅ Fecha de término real</option>');
                }
            } else {
                // Elimina la opción si existe
                $("#visualizarPorAsignados option[value='fecha_termino_asignados']").remove();
            }
        }

    }
}

removeOneDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString();
};
