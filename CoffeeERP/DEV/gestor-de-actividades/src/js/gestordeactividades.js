class GestorActividades extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    // Listas ----------------------------------------
    initComponents() {
        this.filterBar();
    }

    async getListEmployed() {
        let data = await useFetch({
            url: this._link,
            data: { opc: "getListEmployed", udn: $("#id_udn").val() },
        });

        $("#id_employed").option_select({ select2: true, father: true, data: data.employeds });
    }


    // Actividad -------------------------------------
    addTaskModal() {
        this.formTaskModal({
            bootbox: {
                title: "NUEVA ACTIVIDAD", id: "modalNewActivity", size: "large",
            },
            data: { opc: "addTask" },
            success: (data) => {
                $("#btnSuccess").prop("disabled", true);
                if (data.success === true) {
                    alert({ text: "Se ha creado una nueva tarea", timer: 1000 });
                    this.ls();
                    $("#btnSuccess").prop("disabled", false);
                }
            },
        });

        this.getListEmployed();
        this.datesDefaultModalForm();
    }

    async editTaskModal(id) {
        let data = await useFetch({ url: this._link, data: { opc: "getTask", id: id } });

        this.formTaskModal({
            id: "containerModalEdit",
            bootbox: { title: "Editar Evento ", id: "modalNuevoEvento", size: "large" },
            data: { opc: "editTask", idActivity: id },
            autofill: data,
            success: (data) => {
                if (data.success === true) {
                    alert({ text: "Se ha actualizado la tarea.", timer: 1500 });
                    this.ls();
                }
            },
        });

        $("#id_udn").val(data.id_udn).trigger("change");

        // // ESTO SE TIENE QUE CORREGIR, !! OJO, el autofill funciona unicamente con componentes html.
        setTimeout(() => {
            $("#id_employed").val(data.id_employed).trigger("change");
        }, 400);
    }

    async statusTasks(id_status, idActivity, creador, responsable) {
        const lblStatus = ["", "", "Comenzar", "", "Finalizar", "Cancelar",];
        let tr = $(event.target).closest("tr");
        let activity = tr.find("td").eq(3).text();

        const result = await alert({
            icon: "question",
            title: lblStatus[id_status] + " tarea",
            text: "¿Estás seguro de " + lblStatus[id_status].toLowerCase() + ' la tarea "' + activity + '"?',
        });

        if (result.isConfirmed) {
            id_status = id_status == 6 ? 2 : id_status;
            fn_ajax({ opc: "statusTasks", id_status, idActivity }, this._link).then((data) => {
                if (data.success == true) {
                    alert();
                    this.ls();
                    if (id_status == 4 && creador != responsable) {
                        // Abrir evaluación si no eres el mismo responsable y creador de la tarea.
                        this.evaluationModal(idActivity);
                    }
                } else {
                    alert({ icon: "error", text: "Ocurrió un error al " + lblStatus[id_status].toLowerCase() + " la tarea." });
                }
            });
        }
    }


    // Avances ---------------------------------------
    async advanceModal(id, userCreator, userResponsible) {
        let tr = $(event.target).closest("tr");
        let tarea = tr.find("td").eq(3).text();
        let userActive = parseInt(gestor.getCookie("IDU")); // ID del usuario activo

        // 1. Obtener lista de avances primero
        let listAdvances = await useFetch({ url: this._link, data: { opc: "lsAdvances", id: id } });

        // 2. Validar y actualizar fecha de visto antes de abrir chat
        if (userCreator != userActive) {
            let pendiente = listAdvances.find(advance => advance.date_seen == null && advance.user.id == userCreator);
            if (pendiente) {
                let response = await fn_ajax({ opc: "updateSeenAdvance", id_activity: id, id_user: userCreator }, this._link);
                if (response.status == 200) {
                    pendiente.date_seen = response.data.date_seen;
                }
            }
        } else {
            let pendiente = listAdvances.find(advance => advance.date_seen == null && advance.user.id == userResponsible);
            if (pendiente) {
                let response = await fn_ajax({ opc: "updateSeenAdvance", id_activity: id, id_user: userResponsible }, this._link);
                if (response.status == 200) {
                    pendiente.date_seen = response.data.date_seen;
                }
            }
        }

        // 3. Mostrar chatito después de validación
        let modalAdvance = bootbox.dialog({
            title: `<h3 class="text-uppercase">AVANCE DE ${tarea}</h3>`,
            size: "large",
            closeButton: true,
            message: `<div id="containerChat"></div>`,
        });

        let datos = {
            id: id,
            data: listAdvances,
            parent: "#containerChat",
            opc: "addAdvance",
            url: this._link,
            extends: true,
        };

        this.chatito(datos);


        // Scroll al mostrar
        modalAdvance.on("shown.bs.modal", () => {
            let chatContainer = $(`#Chat-${id}`);
            chatContainer.scrollTop(chatContainer[0].scrollHeight);
        });

        // 💥 Acción al cerrar modal
        modalAdvance.on("hidden.bs.modal", () => {
            // Valida que boton de calendario este activo
            if ($("#btnCalendarView").hasClass("bg-blue-200/70")) {
                // Recargar el calendario
                gestor.calendar();
            } else {
                // Recargar la lista de actividades
                gestor.ls();
            }

            if ($("#btnCalendarViewAssign").hasClass("bg-blue-200/70")) {
                // Recargar el calendario
                assign.calendar();
            } else {
                // Recargar la lista de actividades asignadas
                assign.ls();
            }
        });
    }


    // Recordatorios ---------------------------------
    reminderModal() {
        this.basicModal({
            bootbox: {
                title: 'Recordatorios',
                size: "xl",
                message: '<div id="filterBarReminder" class="line"></div> <div id="containerReminder" class="line mt-2"></div>'
            },

            filterBar: {
                json: [
                    {
                        opc: 'select',
                        class: 'col-4',
                        id: 'udnReminder',
                        lbl: 'Selecciona una udn:',
                        data: udn,
                        onchange: 'gestor.lsReminder()',
                    },
                    {
                        opc: 'select',
                        class: 'col-4',
                        id: 'cbUDNReminder',
                        lbl: 'Selecciona eventos a recordar:',
                        onchange: 'gestor.lsReminder()',
                        data: [
                            { id: 'inprogress', valor: 'TAREAS EN PROCESO' },
                            { id: 'atrasados', valor: 'TAREAS ATRASADAS' },
                            // { id: 'siete_dias', valor: 'TAREAS DE LA SEMANA' },
                        ]

                    },
                    {
                        opc: 'button',
                        class: 'col-4',
                        icon: 'icon-whatsapp',
                        color_btn: 'success',
                        className: ' w-100',
                        text: 'Enviar lista',
                        onClick: () => this.sendRecorder()
                    },
                ]
            }
        });
        this.lsReminder();
    }

    lsReminder(options) {
        this.createTable({
            parent: "containerReminder",
            idFilterBar: "filterBarReminder",
            data: { opc: "lsReminder" },
            conf: { datatable: true, pag: 12 },
            coffeesoft:true,
            attr: {
                theme: "corporativo",
                id: "tbGestorActivity",
                center: [5],
                // right: [4],
                f_size: 12,
                extends: true,
            },
        });
    }

    sendRecorder() {
        this.swalQuestion({
            opts: { html: `¿Deseas enviar la lista de recordatorios ?` },
            data: { opc: 'sendRecorders', udn: $('#udnReminder').val(), reminder: $('#cbUDNReminder').val() },
            methods: {
                request: (data) => {
                    if (data.status == 200) {

                        alert({ title: 'Se ha enviado correctamente ', timer: 1000 });

                    } else {
                        alert('Ocurrio un error, verificar con soporte');
                    }

                }
            }
        });
    }

    sendIndividualRecorder(id) {
        let tr = $(event.target).closest("tr");
        let activity = tr.find("td").eq(3).text();
        let asign = tr.find("td").eq(4).text();

        this.swalQuestion({

            opts: { html: `¿Deseas enviar el recordatorio de la actividad <strong>${activity}</strong> asignado a <strong>${asign}</strong>?` },
            data: {
                opc: 'sendIndividualRecorder',
                udn: $('#udnReminder').val(),
                reminder: $('#cbUDNReminder').val(),
                idList: id
            },

            methods: {
                request: (data) => {
                    if (data.status == 200) {

                        alert({ title: 'Se ha enviado correctamente ', timer: 1000 });

                    } else {

                        alert('Ocurrio un error, verificar con soporte');
                    }

                }
            }
        });
    }


    // Evaluaciones ----------------------------------
    async evaluationModal(id) {
        let data = await useFetch({ url: this._link, data: { opc: "getEvaluation", idActivity: id } });

        let nombre = "";
        let src = data.data.src;
        let idResponsable = 0;
        let idCreador = 0;
        let preguntas = [];
        let actividad = '';
        let phone = '';

        if (data.status == 200) {
            // Asignar los valores de la respuesta a las variables
            idResponsable = data.data.idResponsible;
            idCreador = data.data.idCreator;
            nombre = toPascalCase(data.data.nameResponsible);
            preguntas = data.data.questions;
            actividad = data.data.activity;
            phone = data.data.phone;
        }

        bootbox.dialog({
            title: `<h3 class="text-uppercase">Actividad: ${actividad}</h3>`,
            closeButton: true,
            message: `
                <!-- 📸 Foto y Encabezado Fijo -->
                <div class="flex flex-col items-center text-center sticky top-0 z-20 bg-white pb-2 pt-3">
                    <img src="${src}" alt="User Photo" class="w-20 h-20 rounded-full object-cover mb-1">
                    <h5 class="text-center font-semibold mb-2 text-gray-800 text-xl">¿Qué te pareció el servicio de ${nombre}?</h5>
                    <div class="flex flex-wrap justify-center gap-2 text-sm text-gray-700 font-medium mb-2">
                        <div title="Bajo Desempeño" class="flex items-center gap-1 bg-red-500/10 text-red-600 px-2 py-1 rounded-full shadow-sm cursor-pointer">
                            <span class="text-yellow-400">★</span><span class="text-xs">BD</span>
                        </div>
                        <div title="Desempeño con Áreas de Oportunidad" class="flex items-center gap-1 bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full shadow-sm cursor-pointer">
                            <span class="text-yellow-400">★★</span><span class="text-xs">DA</span>
                        </div>
                        <div title="Desempeño Esperado" class="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full shadow-sm cursor-pointer">
                            <span class="text-yellow-400">★★★</span><span class="text-xs">DE</span>
                        </div>
                        <div title="Alto Desempeño" class="flex items-center gap-1 bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full shadow-sm cursor-pointer">
                            <span class="text-yellow-400">★★★★</span><span class="text-xs">AD</span>
                        </div>
                        <div title="Desempeño Extraordinario" class="flex items-center gap-1 bg-green-500/10 text-green-600 px-2 py-1 rounded-full shadow-sm cursor-pointer">
                            <span class="text-yellow-400">★★★★★</span><span class="text-xs">DEX</span>
                        </div>
                    </div>
                </div>

                <!-- ✨ Sección con scroll solo para lo demás -->
                <div class="max-h-[340px] overflow-y-auto p-2 space-y-4">
                    <!-- 🧾 Evaluación detallada -->
                    <div class="w-full bg-white rounded-2xl shadow-md p-6 transition-all mb-3">
                        <h2 class="text-xl font-semibold text-gray-800 mb-3 text-center">Califica el servicio</h2>

                        ${preguntas.map((pregunta, index) => `
                            <div class="flex flex-col md:flex-row justify-between items-center gap-4 py-2">
                                <p class="text-sm text-gray-800 w-full md:w-1/2">${pregunta.valor}</p>
                                <div class="rating-blue flex flex-row-reverse gap-x-1">
                                    ${[5, 4, 3, 2, 1].map(num => `
                                        <input type="radio" name="rating_${pregunta.id}" id="star${num}_${pregunta.id}" value="${num}" class="hidden">
                                        <label for="star${num}_${pregunta.id}" class="cursor-pointer text-3xl text-gray-400 transition-all hover:scale-110">★</label>
                                    `).join("")}
                                </div>
                            </div>
                            ${index != preguntas.length - 1 ? '<hr class="my-3 text-gray-300">' : ''}
                        `).join("")}
                    </div>

                    <!-- 📝 Retroalimentación -->
                    <label for="feedback" class="text-sm text-gray-800">¿Tienes alguna retroalimentación adicional que te gustaría compartir?</label>
                    <textarea id="feedback" name="feedback" rows="4" class="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm" placeholder="Escribe aquí..."></textarea>
                    <div class="flex justify-center mt-3">
                        <button type="button" class="btn btn-primary" id="btnSendEvaluation">Enviar evaluación</button>
                    </div>
                </div>
            `,
        });

        // Asignar el ID del empleado al botón de enviar evaluación
        $("#btnSendEvaluation").on("click", () => {
            let feedback = $("#feedback").val();
            let rating = [];
            let suma = 0;
            let cantidad = 0;

            let preguntasIncompletas = false; // 📌 Bandera para validar todas las preguntas

            // 📜 Calificación de preguntas iteradas
            preguntas.forEach((pregunta) => {
                let ratingPregunta = $(`input[name='rating_${pregunta.id}']:checked`).val();
                rating.push({ id: pregunta.id, rating: ratingPregunta });

                if (ratingPregunta) {
                    suma += parseInt(ratingPregunta);
                    cantidad++;
                } else {
                    preguntasIncompletas = true;
                }
            });

            // 📜 Promedio por preguntas iteradas
            let average = cantidad > 0 ? (suma / cantidad).toFixed(2) : 0;

            // 📌 Validar campos obligatorios
            if (preguntasIncompletas) {
                alert({
                    icon: "warning",
                    title: 'Por favor completa todos los campos',
                    text: "Antes de enviar la evaluación 👀.",
                    btn1: true,
                    btn1Text: "Aceptar"
                });
                return;
            }

            // ✅ Enviar evaluación si todo está completo
            this.sendEvaluation(id, feedback, average, rating, phone, actividad);
        });

    }

    sendEvaluation(id, feedback, average, rating, phone, activity) {
        let datos = {
            opc: "addRating",
            ga_activities_id: id,
            phone: phone,
            activity: activity,
            feedback: feedback,
            average: average,
            rating: rating,
        };

        $("#btnSendEvaluation").prop("disabled", true); // Deshabilitar botón para evitar múltiples envíos
        fn_ajax(datos, this._link).then((response) => {
            if (response.status == 200) {
                alert({ icon: "success", text: response.message });
                bootbox.hideAll();
                this.ls();
                $("#btnSendEvaluation").prop("disabled", false); // Habilitar botón nuevamente
            } else {
                alert({ icon: "error", text: response.message });
                $("#btnSendEvaluation").prop("disabled", false); // Habilitar botón nuevamente
            }
        });
    }


    // Funciones Auxliliares--------------------------
    datesDefaultModalForm() {
        // Obtener los valores de las fechas calculadas
        let nextMonday = this.getNextMonday();
        let nextFriday = this.getNextWeekFriday();

        // Asignar los valores a los inputs
        $("#date_start").val(new Date().toISOString().split("T")[0]);
        $("#date_end").val(this.getNextMondays());
        $("#date_follow").val(this.getNextFridays());
    }
}

// Convierte texto a PascalCase
function toPascalCase(texto) {
    return texto
        .toLowerCase()                                 // 🔵 Todo a minúsculas
        .split(' ')                                    // 🔵 Separa por espacios
        .filter(p => p.trim() !== '')                  // 🔵 Elimina espacios vacíos
        .map(p => p.charAt(0).toUpperCase() + p.slice(1)) // 🔵 Capitaliza
        .join(' ');                                     // 🔵 Une con espacios
}
