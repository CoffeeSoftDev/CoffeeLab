let app, gestor, assign; // vars. instancia
let udn, udnForm, estados, priority, eventos, meses; // vars. gral

const link = "ctrl/ctrl-gestordeactividades.php"; // api.
const api_assing = "ctrl/ctrl-gestordeactividades-asignados.php"; // api.

$(function () {
    fn_ajax({ opc: "init" }, link).then((data) => {
        udn = data.udn;
        udnForm = data.udnForm;
        estados = data.estados;
        priority = data.priority;
        meses = data.meses;

        app = new App(link, "");
        gestor = new GestorActividades(link, "");
        assign = new GestorActividadesAssign(api_assing, "");

        app.init();
        assign.render();
    });
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo)
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }

    layout() {
        let cookies = getCookies();
        const puesto = cookies.IDP;  // ejemplo: 2

        // 🔵 Definición de pestañas
        const tabCreadas = {
            id: "gestorCreados",
            tab: "📌 Actividades Creadas",
            class: "flex flex-col h-full",
            onClick: () => this.ls(),
        };

        const tabAsignadas = {
            id: "gestorAsignados",
            tab: "📅 Actividades Asignadas",
            class: "flex flex-col h-full",
            onClick: () => assign.ls(),
        };

        const tabEvaluadas = {
            id: "gestorEvaluadas",
            tab: "🏆 Evaluaciones",
            class: "flex flex-col h-full",
            onClick: () => app.lsEvaluadas(),
        };

        // 📌 Orden y activo según puesto
        const tabs = puesto != "2"
            ? [{ ...tabAsignadas, active: true }, tabCreadas, tabEvaluadas]
            : [{ ...tabCreadas, active: true }, tabAsignadas, tabEvaluadas];

        this.tabLayout({
            parent: "root",
            id: "tabComponent",
            content: { class: "" },
            theme: "light",
            type: 'short',
            json: tabs
        });

        // CREADOS ----------------------------------------------------------------------
        $(`#container-gestorCreados`).html(`
            <div class="lg:h-[10%] w-full pt-2 flex justify-between items-center">
                <div id="filterBarGestorCreados" class="w-full"></div>
                
                <!-- 🔵 Grupo de botones -->
                <div id="viewToggle" class="btn-group ms-2 mt-4" role="group">
                    <button id="btnListView" 
                        class="btn p-1 rounded-l text-sm text-blue-900 hover:bg-blue-200/70 bg-blue-200/70 border border-blue-500" 
                        title="Vista de lista">
                        <i class="icon-list text-blue-900"></i>
                    </button>
                    <button id="btnCalendarView" 
                        class="btn p-1 rounded-r text-sm text-blue-900 hover:bg-blue-200/70 border border-blue-100/60" 
                        title="Vista de calendario">
                        <i class="icon-calendar text-blue-900"></i>
                    </button>
                </div>
            </div>

            <div class="lg:h-[80%] h-full mt-2 w-full" id="containerGestorCreados"></div>
        `);


        // ✅ Activación de botones
        $("#btnListView").on("click", function () {
            $("#tbGestorActivityMac").removeClass("calendar-view").addClass("list-view");
            $(this).removeClass("border-blue-100/60").addClass("bg-blue-200/70 border-blue-500");
            $("#btnCalendarView").removeClass("bg-blue-200/70 border-blue-500").addClass("border-blue-100/60");

            app.ls();
        });

        $("#btnCalendarView").on("click", function () {
            $("#tbGestorActivityMac").removeClass("list-view").addClass("calendar-view");
            $(this).removeClass("border-blue-100/60").addClass("bg-blue-200/70 border-blue-500");
            $("#btnListView").removeClass("bg-blue-200/70 border-blue-500").addClass("border-blue-100/60");

            app.calendar();
        });

        // ASIGNADOS ----------------------------------------------------------------------
        $(`#container-gestorAsignados`).html(`
            <div class="lg:h-[10%] w-full flex justify-between items-center">
                <div id="filterBarAsignados" class="w-full"></div>
                
                <!-- 🔵 Grupo de botones -->
                <div id="viewToggleAssign" class="btn-group ms-2 mt-4" role="group">
                    <button id="btnListViewAssign" 
                        class="btn p-1 rounded-l text-sm text-blue-900 hover:bg-blue-200/70 bg-blue-200/70 border border-blue-500" 
                        title="Vista de lista">
                        <i class="icon-list text-blue-900"></i>
                    </button>
                    <button id="btnCalendarViewAssign" 
                        class="btn p-1 rounded-r text-sm text-blue-900 hover:bg-blue-200/70 border border-blue-100/60" 
                        title="Vista de calendario">
                        <i class="icon-calendar text-blue-900"></i>
                    </button>
                </div>
            </div>

            <div class="lg:h-[80%] h-full mt-2 w-full" id="containerAsignados"></div>
        `);

        // ✅ Activación de botones
        $("#btnListViewAssign").on("click", function () {
            $("#tbGestorActivityAssign").removeClass("calendar-view").addClass("list-view");
            $(this).removeClass("border-blue-100/60").addClass("bg-blue-200/70 border-blue-500");
            $("#btnCalendarViewAssign").removeClass("bg-blue-200/70 border-blue-500").addClass("border-blue-100/60");

            assign.ls();
        });

        $("#btnCalendarViewAssign").on("click", function () {
            $("#tbGestorActivityAssign").removeClass("list-view").addClass("calendar-view");
            $(this).removeClass("border-blue-100/60").addClass("bg-blue-200/70 border-blue-500");
            $("#btnListViewAssign").removeClass("bg-blue-200/70 border-blue-500").addClass("border-blue-100/60");

            assign.calendar();
        });

        // EVALUADAS ----------------------------------------------------------------------
        $(`#container-gestorEvaluadas`).html(``);
    }

    filterBar() {
        const admin =
            [
                {
                    opc: "btn",
                    class: "col-sm-6 col-md-6 col-lg-2",
                    color_btn: "primary",
                    id: "btnNuevaActividad",
                    text: "Nueva actividad",
                    fn: "gestor.addTaskModal()",
                },
                {
                    opc: "btn",
                    class: "col-sm-6 col-md-6 col-lg-2",
                    color_btn: "success",
                    icon: "icon-whatsapp",
                    id: "btnSendRecorders",
                    text: "Recordar",
                    fn: "gestor.reminderModal()",
                },
            ]

        this.createfilterBar({
            parent: "filterBarGestorCreados",
            data: [
                {
                    opc: "select",
                    class: "col-sm-6 col-md-4 col-lg-2",
                    id: "udn",
                    lbl: "Seleccionar udn: ",
                    data: udn,
                    onchange: "app.validateListView()",
                },
                {
                    opc: "select",
                    class: "col-sm-6 col-md-4 col-lg-2",
                    id: "estado",
                    lbl: "Seleccionar estados: ",
                    data: estados,
                    onchange: "app.validateListView()",
                },
                {
                    opc: "select",
                    class: "col-sm-6 col-md-4 col-lg-2 d-none",
                    id: "filtroMes",
                    lbl: "Seleccionar mes:",
                    data: meses,
                    onchange: "app.validateListView()",
                },
                ...admin,
            ],
        });

    }

    validateListView() {
        if ($('#estado').val() == "4") {
            $("#filtroMes").parent().removeClass("d-none");
            // Agrega la opción solo si no existe
            if ($("#visualizarPor option[value='fecha_termino']").length == 0) {
                $("#visualizarPor").append('<option value="fecha_termino">✅ Fecha de término real</option>');
            }
        } else {
            $("#filtroMes").parent().addClass("d-none");
            // Elimina la opción si existe
            $("#visualizarPor option[value='fecha_termino']").remove();
        }

        if ($("#btnListView").hasClass("bg-blue-200/70")) {
            app.ls();
        } else {
            app.calendar();
        }
    }

    ls() {
        this.createTable({
            parent: "containerGestorCreados",
            idFilterBar: "filterBarGestorCreados",
            data: { opc: "lsTasks", },
            conf: { datatable: true, pag: 10 },
            coffeesoft: true,
            attr: {
                theme: 'corporativo',
                id: "tbGestorActivityMac",
                center: [6, 9],
                f_size: 12,
                extends: true,
            },
        });
    }

    formTaskModal(options) {
        let defaults = {
            id: "mdlActivity",
            bootbox: {
                title: "Activity",
                closeButton: true,
                id: "addTaskModal"
            },
            json: [
                { id: "title", opc: "input", class: "col-12 mb-2", lbl: "Título (breve)", required: true },
                { id: "objetivo", opc: "textarea", class: "col-12 mb-2", lbl: "Objetivo", placeholder: "Propósito e impacto esperado de la tarea", rows: 2, required: true },
                {
                    opc: "input",
                    lbl: "Fecha de inicio",
                    id: "date_start",
                    class: "col-6 mb-2",
                    type: "date",
                    required: true
                },
                {
                    opc: "input",
                    lbl: "Fecha de término",
                    id: "date_end",
                    class: "col-6 mb-2",
                    type: "date",
                    required: true
                },
                {
                    opc: "input",
                    lbl: "Fecha de seguimiento",
                    id: "date_follow",
                    class: "col-6 mb-2",
                    type: "date",
                    required: true
                },
                { id: "id_priority", opc: "select", class: "col-6 mb-2", data: priority, lbl: "Prioridad", required: true },
                { id: "id_udn", opc: "select", lbl: "UDN", data: udnForm, value: 8, class: "col-6 mb-2", required: true, onchange: "gestor.getListEmployed()" },
                { id: "id_employed", opc: "select", class: "col-6 mb-2", lbl: "Responsable" },
                { id: "activities", opc: "textarea", class: "col-12", lbl: "Actividades ", rows: 3, placeholder: "Explica de forma concreta la acción o entregable esperado", required: false },
            ],
            validation: true,
            success: (data) => {
                if (data.success === true) {
                    alert();
                }
            },
        };

        let opts = this.ObjectMerge(defaults, options);
        this.createModalForm(opts);

        $("#id_udn").option_select({ select2: true, father: true });
    }

    getNextMondays() {
        const startDate = new Date($("#date_start").val());
        const result = new Date(startDate);
        result.setDate(result.getDate() + ((8 - result.getDay()) % 7 || 7));
        return result.toISOString().split("T")[0];
    }

    getNextFridays() {
        const startDate = new Date($("#date_start").val());
        const result = new Date(startDate);
        const day = result.getDay();
        const daysUntilFriday = day <= 5 ? 5 - day : 12 - day;
        result.setDate(result.getDate() + daysUntilFriday);
        return result.toISOString().split("T")[0];
    }

    getNextMonday() {
        let today = new Date();
        let dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        let daysUntilMonday = (8 - dayOfWeek) % 7 || 7; // Calcula los días hasta el próximo lunes
        let nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilMonday); // Suma los días necesarios

        // Formatear la fecha en "dd-mm-yyyy"
        let dd = String(nextMonday.getDate()).padStart(2, "0");
        let mm = String(nextMonday.getMonth() + 1).padStart(2, "0"); // Mes comienza desde 0
        let yyyy = nextMonday.getFullYear();

        return `${dd}-${mm}-${yyyy}`;
    }

    getNextWeekFriday() {
        let today = new Date();
        let dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        let daysUntilNextFriday = ((12 - dayOfWeek) % 7) + 7; // Calcula los días hasta el próximo viernes

        let nextFriday = new Date(today);
        nextFriday.setDate(today.getDate() + daysUntilNextFriday); // Suma los días necesarios

        // Formatear la fecha en "dd-mm-yyyy"
        let dd = String(nextFriday.getDate()).padStart(2, "0");
        let mm = String(nextFriday.getMonth() + 1).padStart(2, "0"); // Mes comienza desde 0
        let yyyy = nextFriday.getFullYear();

        return `${dd}-${mm}-${yyyy}`;
    }

    // AGREGAR A COFFEE SOFT
    chatito(options) {
        let defaults = {
            id: 0,
            name: "Chat",
            parent: "",
            data: [],
            opc: "addChat",
            url: "",
            form_id: "formChat",
            input_id: "iptChat",
            class: "p-2 bg-secondary-subtle d-flex flex-column gap-2 rounded-1 h-80 overflow-y-auto scroll-smooth",
            colors: ["text-cyan-700", "text-blue-600", "text-indigo-500", "text-purple-600", "text-fuchsia-600", "text-pink-500", "text-red-700", "text-orange-600", "text-amber-500", "text-lime-600", "text-green-700", "text-teal-600"],
            foto: "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
            gender: {
                H: "https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_640.png",
                M: "https://cdn.pixabay.com/photo/2014/03/25/16/54/user-297566_640.png",
            },
        };

        const opts = this.ObjectMerge(defaults, options);
        let userColors = {};
        let idUser = parseInt(app.getCookie("IDU"));

        // Función anónima para obtener la foto del usuario
        let foto = (gender, src) => {
            if (src) {
                return src;
            } else {
                if (opts.extends) {
                    if (gender == "H") {
                        return opts.gender.H;
                    }
                    if (gender == "M") {
                        return opts.gender.M;
                    } else {
                        return opts.foto;
                    }
                } else {
                    return opts.foto;
                }
            }
        };

        // Mensajes del chat
        let mensaje = opts.data
            .map((item) => {
                let user = item.user;
                if (!userColors[user.id]) {
                    userColors[user.id] = opts.colors[Object.keys(userColors).length % opts.colors.length];
                }
                let textColor = userColors[user.id];
                let photo = foto(user.sexo, user.src);

                // Palomita si ya fue visto
                let visto = item.date_seen
                    ? `<img src="./src/img/double-check.svg" alt="Visto" title="Visto el ${item.date_seen}" class="ms-2" style="width: 16px; height: auto;" />`
                    : `<img src="./src/img/check.svg" alt="No visto" title="No visto" class="ms-2" style="width: 16px; height: auto;" />`;

                return `
            <div class="d-flex align-items-start" id="${item.id}">
                <div class="me-2" style="min-width: 35px;">
                    <img src="${photo}" class="rounded-circle w-8 h-8" alt="foto de ${user.valor}">
                </div>
                <div>
                    <small>
                        <strong class="text-xs ${textColor}">${user.valor}</strong>
                        <span class="text-body-tertiary">${item.date}</span>
                        
                    </small>
                    <div class="rounded-2 bg-gray-50 p-2 d-flex justify-content-between cursor-pointer hover:bg-gray-300 align-items-center position-relative" id="msj${item.id}" onclick="app.openDelete('msj${item.id}', '${item.date}', '${user.id}', '${idUser}')">
                        <span class="me-2">${escapeHTML(item.valor)}</span>
                        ${visto}
                        <button class="btn d-none btn-danger btn-sm p-1 position-absolute top-0 end-0 m-1" 
                            onclick="app.deleteMessage('${item.id}')">
                            <i class="icon-trash"></i>
                        </button>
                    </div>
                </div>          
            </div>
            `;
            })
            .join("");


        let form = "";
        form = ` <form class="row" id="${opts.form_id}" novalidate>
                    <div class="input-group mb-3">
                        <input id="${opts.input_id}" class="form-control" required="required" placeholder="Escribe aquí...">
                        <button type="submit" class="btn btn-primary">
                            <i class="icon-direction-outline" title="Enviar"></i>
                        </button>
                    </div>
                </form>`;

        // Chat
        let chat = `<div class="row mb-3">
                <div class="col-12">
                    <div class="${opts.class}" id="${opts.name}-${opts.id}">
                        ${mensaje}
                    </div>
                </div>
            </div>
            ${form}
            `;

        $(opts.parent).append(chat);

        $(`#${opts.form_id}`).validation_form({}, function (result) {
            $(`#${opts.form_id} button[type='submit']`).attr("disabled", "disabled");

            async function addMessage() {
                let dataActivity = await useFetch({ url: `${opts.url}`, data: { opc: "getActivity", id: opts.id } });
                let datos = {
                    opc: opts.opc,
                    id_activity: opts.id,
                    advance: $(`#${opts.form_id} #${opts.input_id}`).val(),
                    id_user: idUser,
                    id_user_creator: dataActivity.data.id_user_creator,
                    activity: dataActivity.data.title || dataActivity.data.activities,
                    id_employed: dataActivity.data.id_employed,
                };

                let data = await useFetch({ url: `${opts.url}`, data: datos });
                if (data.status == 200) {
                    let mensaje = data.data;
                    let usuario = mensaje.user;
                    alert({ icon: "success" });
                    $(`#${opts.form_id} button[type='submit']`).removeAttr("disabled");
                    $(`#${opts.form_id} #${opts.input_id}`).val("");

                    // Colores al usuario
                    if (!userColors[usuario.id]) {
                        userColors[usuario.id] = opts.colors[Object.keys(userColors).length % opts.colors.length];
                    }
                    let textColor = userColors[usuario.id];
                    let photo = foto(usuario.sexo, usuario.src);


                    // Palomita si ya fue visto
                    let visto = mensaje.date_seen
                        ? `<img src="./src/img/double-check.svg" alt="Visto" title="Visto el ${mensaje.date_seen}" class="ms-2" style="width: 16px; height: auto;" />`
                        : `<img src="./src/img/check.svg" alt="No visto" title="No visto" class="ms-2" style="width: 16px; height: auto;" />`;


                    // Agregar mensaje al chat
                    $(`#${opts.name}-${opts.id}`).append(`
                        <div class="d-flex align-items-start" id="${mensaje.id}">
                            <div class="me-2" style="min-width: 35px;">
                                <img src="${photo}" class="rounded-circle w-8 h-8" alt="foto de ${usuario.valor}">
                            </div>
                            <div>
                                <small>
                                    <strong class="text-xs ${textColor}">${usuario.valor}</strong>
                                    <span class="text-body-tertiary">${mensaje.date}</span>
                                </small>
                                <div class="rounded-2 bg-gray-50 p-2 d-flex justify-content-between cursor-pointer hover:bg-gray-300 align-items-center position-relative" id="msj${mensaje.id}" 
                                onclick="app.openDelete('msj${mensaje.id}', '${mensaje.date}', '${usuario.id}', '${idUser}')">
                                   <span class="me-2">${escapeHTML(mensaje.valor)}</span>
                                    ${visto}
                                     <button class="btn d-none btn-danger btn-sm p-1 position-absolute top-0 end-0 m-1" onclick="app.deleteMessage('${mensaje.id}')">
                                        <i class="icon-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `);

                    // Hacer scroll al final del contenedor
                    let chatContainer = $(`#${opts.name}-${opts.id}`);
                    chatContainer.scrollTop(chatContainer[0].scrollHeight);
                } else {
                    alert({ icon: "error", text: data.message });
                    $(`#${opts.form_id} button[type='submit']`).removeAttr("disabled");
                }
            }

            addMessage();
        });
    }

    openDelete(id, date, idUser, idU) {
        // Si el mensaje es del usuario actual y el mensaje es del dia de hoy
        if (idUser == idU && new Date(date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {
            $(`#${id} button`).toggleClass("d-none");
        }
    }

    deleteMessage(id) {
        alert({
            icon: "question",
            title: "¿Estás seguro de eliminarlo?",
            text: "Será de forma permanente.",
        }).then((response) => {
            if (response.isConfirmed) {
                let datos = {
                    opc: "destroyAdvance",
                    idAdvance: id,
                };

                fn_ajax(datos, app._link).then((response) => {
                    if (response.status == 200) {
                        alert({ icon: "success", text: response.message });
                        document.getElementById(id).remove();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                });
            }
        });
    }

    // AGREGAR A COFFEE SOFT
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Verifica si la cookie comienza con el nombre deseado
                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    basicModal(options) {
        let defaults = {
            id: 'Reminder',
            bootbox: {
                title: 'Modal example',
                closeButton: true,
                message: ' ',
                id: 'modal'
            },

            filterBar: {
                json: []
            }
        };

        let opts = this.ObjectMerge(defaults, options);
        let modal = bootbox.dialog(opts.bootbox); // Crear componente modal.

        // Proceso de construccion de un formulario
        $('#filterBar' + opts.id).content_json_form({ data: opts.filterBar.json, type: '' });
    }

    async calendar() {
        let udn = $("#udn").val() || 0;
        let estado = $("#estado").val() || 0;
        let filtroMes = $("#filtroMes").val() || 0;
        let fechita = $("#visualizarPor").val() || 0;

        let data = await useFetch({ url: link, data: { opc: 'getCalendario', udn: udn, estado: estado, filtroMes: filtroMes, fechita: fechita } });

        $(`#containerGestorCreados`).html('');
        var calendarEl = document.getElementById('containerGestorCreados');

        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
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
                        <label for="visualizarPor" class="text-xs font-medium text-blue-700">
                            Visualizar por:
                        </label>
                        <select id="visualizarPor" class="text-xs border border-blue-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-400 focus:border-blue-400" onchange="app.calendar()">
                            <option value="fecha_final">📅 Fecha final</option>
                            <option value="fecha_inicio">📅 Fecha inicio</option>
                        </select>
                    </div>
                `);
            }

            if ($('#estado').val() == "4") {
                // Agrega la opción solo si no existe
                if ($("#visualizarPor option[value='fecha_termino']").length == 0) {
                    $("#visualizarPor").append('<option value="fecha_termino">✅ Fecha de término real</option>');
                }
            } else {
                // Elimina la opción si existe
                $("#visualizarPor option[value='fecha_termino']").remove();
            }
        }
    }

    async lsEvaluadas() {
        let data = await useFetch({ url: link, data: { opc: 'getEvaluationsGeneral' } });
        let promedio = data.data.promedio;
        let evaluadas = data.data.evaluadas;
        let recibidas = data.data.recibidas;
        let pendientes = data.data.pendientes;

        const container = $("#container-gestorEvaluadas");
        container.html(""); // limpia antes de renderizar
        // 📊 Header
        const header = $(`
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Evaluaciones y Calificaciones</h2>
                    <p class="text-gray-500 text-sm">Gestiona las evaluaciones de desempeño</p>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <i class="icon-clock-7"></i> Última evaluación recibida: ${promedio.last_update || 'N/A'}
                </div>
            </div>
        `);
        container.append(header);

        const cardPromedio = $(`
            <div class="bg-[#F4F6FA] border border-[#C9D1E4] rounded-lg shadow-sm mb-6">
                <div class="p-4">
                    <h3 class="font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up h-5 w-5 text-primary"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline>
                    </svg> Mi Promedio de Calificaciones</h3>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="flex flex-col items-center">
                        <div class="text-4xl font-bold text-blue-900 mb-2">${promedio.average}</div>
                        <div id="starsEvaluadas" class="flex gap-1 mb-2"></div>
                        <div id="badgeDesempenoPromedio"></div>
                        <p class="text-xs text-gray-500 mt-3">Basado en ${promedio.total} evaluaciones</p>
                    </div>
                    <div class="col-span-2">
                        <h4 class="text-sm font-medium text-gray-700 mb-2">Distribución de calificaciones</h4>
                        <div id="barsEvaluadas" class="space-y-2"></div>
                    </div>
                </div>
            </div>
        `);
        container.append(cardPromedio);

        // ⭐ Render estrellas promedio (soporta decimales)
        const avg = promedio.average;
        for (let i = 1; i <= 5; i++) {
            let starSvg;

            if (i <= Math.floor(avg)) {
                // ⭐ estrella rellena
                starSvg = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="h-5 w-5 fill-yellow-400 text-yellow-400">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                    </svg>`;
            } else if (i === Math.ceil(avg) && avg % 1 !== 0) {
                // ⭐ estrella vacía (para el decimal)
                starSvg = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="h-5 w-5 fill-gray-300">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                    </svg>`;
            } else {
                // ⭐ estrellas vacías
                starSvg = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="h-5 w-5 fill-gray-300">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                    </svg>`;
            }

            $("#starsEvaluadas").append(starSvg);
        }

        // 🏅 Clasificación por desempeño (badge)
        function getDesempenoBadge(promedio) {
            let badge = "";
            let avg = Number(promedio);
            if (avg >= 4.75) {
                badge = `<span class="inline-flex items-center gap-1 bg-green-500/10 text-green-700 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
                           Desempeño Extraordinario
                        </span>`;
            } else if (avg >= 4) {
                badge = `<span class="inline-flex items-center gap-1 bg-blue-500/10 text-blue-700 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
                            Alto Desempeño
                        </span>`;
            } else if (avg >= 3) {
                badge = `<span class="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-700 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
                            Desempeño Esperado
                        </span>`;
            } else if (avg >= 2) {
                badge = `<span class="inline-flex items-center gap-1 bg-orange-500/10 text-orange-700 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
                            Desempaño con Áreas de Oportunidad
                        </span>`;
            } else  if (avg >= 1) {
                badge = `<span class="inline-flex items-center gap-1 bg-red-500/10 text-red-700 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
                            Bajo Desempeño
                        </span>`;
            } else {
                badge = `<span class="inline-flex items-center gap-1 bg-gray-500/10 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
                            Sin Calificación
                        </span>`;
            }
            return badge;
        }
        $("#badgeDesempenoPromedio").html(getDesempenoBadge(avg));

        // 📊 Render barras distribución (de 5 a 1)
        const total = Object.values(promedio.distribution).reduce((a, b) => a + b, 0);

        // recorremos manualmente de 5 a 1
        [5, 4, 3, 2, 1].forEach(stars => {
            const count = promedio.distribution[stars] || 0;
            const percent = total > 0 ? (count / total) * 100 : 0;

            const row = $(`
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1 w-12">
                        <span class="text-sm font-semibold">${stars}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            class="h-3 w-3 fill-yellow-400 text-yellow-400">
                            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                        </svg>
                    </div>
                    <div class="flex-1 bg-gray-200 rounded h-2 overflow-hidden">
                        <div class="bg-blue-900 h-2" style="width: ${percent}%"></div>
                    </div>
                    <span class="w-6 text-sm text-gray-500 text-right">${count}</span>
                </div>
            `);

            $("#barsEvaluadas").append(row);
        });

        // 🔀 Tabs internas
        const tabs = $(`
            <div class="flex flex-col sm:flex-row bg-[#F1F5F9] p-1 rounded-lg mb-4 w-full justify-center gap-2 sm:gap-0">
                <button class="tab-btn flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md 
                                text-gray-600 bg-[#F1F5F9] hover:text-blue-900 w-full sm:w-auto justify-center"
                        data-tab="realizadas">
                    <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-message-square h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Evaluaciones Realizadas
                </button>

                <button class="tab-btn flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md 
                                text-blue-900 bg-white shadow-sm active w-full sm:w-auto justify-center"
                        data-tab="recibidas">
                    <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-user h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Evaluaciones Recibidas
                </button>

                <button class="tab-btn flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md 
                                text-gray-600 bg-[#F1F5F9] hover:text-blue-900 w-full sm:w-auto justify-center"
                        data-tab="pendientes">
                    <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-clock h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Pendientes de Evaluar
                    ${(pendientes.length > 0) ? `<span class="ml-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">${pendientes.length}</span>` : ''}
                </button>
            </div>

            <div id="tabContent">
                <div class="tab-pane hidden" data-tab="realizadas"></div>
                <div class="tab-pane " data-tab="recibidas"></div>
                <div class="tab-pane hidden" data-tab="pendientes"></div>
            </div>
        `);


        container.append(tabs);

        // Secciones de cada tab
        const sectionRealizadas = $(`
            <div class="bg-[#F4F6FA] border border-[#C9D1E4] rounded-lg shadow-sm">
                <div class="p-4 pb-0">
                    <h2 class="text-lg font-semibold text-gray-700">Evaluaciones que he realizado</h2>
                    <p class="text-sm text-gray-500">Historial de evaluaciones que has dado a otros colaboradores</p>
                </div>
                <div id="cardsEvaluadas" class="p-4 space-y-4">
                    ${(evaluadas.length == 0) ? '<p class="text-gray-500 italic">No has realizado ninguna evaluación aún.</p>' : ''}
                </div>
            </div>
        `);

        const sectionRecibidas = $(`
            <div class="bg-[#F4F6FA] border border-[#C9D1E4] rounded-lg shadow-sm">
                <div class="p-4 pb-0">
                    <h2 class="text-lg font-semibold text-gray-700">Evaluaciones recibidas</h2>
                    <p class="text-sm text-gray-500">Feedback y calificaciones que has recibido de otros colaboradores</p>
                </div>
                <div id="cardsRecibidas" class="p-4 space-y-4">
                    ${(recibidas.length == 0) ? '<p class="text-gray-500 italic">No has recibido evaluaciones aún.</p>' : ''}
                </div>
            </div>
        `);

        const sectionPendientes = $(`
            <div class="bg-[#F4F6FA] border border-[#C9D1E4] rounded-lg shadow-sm">
                <div class="p-4 pb-0">
                    <h2 class="text-lg font-semibold text-gray-700">Evaluaciones pendientes</h2>
                    <p class="text-sm text-gray-500">Tareas completadas que requieren tu evaluación</p>
                </div>
                <div id="cardsPendientes" class="p-4 space-y-4">
                    ${(pendientes.length == 0) ? '<p class="text-gray-500 italic">No tienes evaluaciones pendientes por evaluar.</p>' : ''}
                </div>
            </div>
        `);

        $("#tabContent .tab-pane[data-tab='realizadas']").append(sectionRealizadas);
        $("#tabContent .tab-pane[data-tab='recibidas']").append(sectionRecibidas);
        $("#tabContent .tab-pane[data-tab='pendientes']").append(sectionPendientes);

        // Render cards evaluadas
        evaluadas.forEach(ev => {
            const card = $(`
                <div class="bg-white border rounded-lg p-4 shadow-sm">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-800">${ev.taskTitle}</h4>
                            <p class="text-sm text-gray-500">Responsable: ${ev.reviewer}</p>
                        </div>
                        <span class="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded ml-2">${ev.department}</span>
                    </div>
                    <div class="flex items-center gap-1 my-2">
                        <div class="flex text-yellow-400">
                            ${"★".repeat(ev.rating)}${"☆".repeat(5 - ev.rating)}
                        </div>
                        <span class="text-sm font-medium ml-1">${ev.rating}/5</span>
                    </div>
                    <div class="bg-blue-50 border-l-2 border-blue-200 p-2 rounded min-h-[30px]">
                        <p class="text-sm text-gray-600">${ev.comment ? ev.comment : '<i>No hay comentarios.</i>'}</p>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">📅 ${new Date(ev.date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })}</p>
                </div>
            `);
            $("#cardsEvaluadas").append(card);
        });

        // Render cards recibidas
        recibidas.forEach(ev => {
            const card = $(`
                <div class="bg-white border rounded-lg p-4 shadow-sm">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-800">${ev.taskTitle}</h4>
                            <p class="text-sm text-gray-500">Evaluado por: ${ev.reviewer}</p>
                        </div>
                        <span class="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded ml-2">${ev.department}</span>
                    </div>
                    <div class="flex items-center gap-1 my-2">
                        <div class="flex text-yellow-400">
                            ${"★".repeat(ev.rating)}${"☆".repeat(5 - ev.rating)}
                        </div>
                        <span class="text-sm font-medium ml-1">${ev.rating}/5</span>
                    </div>
                    <div class="bg-blue-50 border-l-2 border-blue-200 p-2 rounded min-h-[30px]">
                        <p class="text-sm text-gray-600">${ev.comment ? ev.comment : '<i>No hay comentarios.</i>'}</p>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">📅 ${new Date(ev.date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })}</p>
                </div>
            `);
            $("#cardsRecibidas").append(card);
        });

        // Render cards pendientes
        pendientes.forEach(task => {
            // 🔢 días desde completada
            const daysSince = Math.floor(
                (new Date().getTime() - new Date(task.completedDate).getTime()) / (1000 * 60 * 60 * 24)
            );

            let className = "bg-green-600 text-white";
            if (task.priority == "Alta") {
                className = "bg-red-600 text-white";
            } else if (task.priority == "Media") {
                className = "bg-yellow-600 text-white";
            }

            const card = $(`
                <div class="bg-white border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-start hover:shadow-md transition relative overflow-hidden gap-3">
                    
                    <!-- Línea azul en el borde -->
                    <div class="absolute left-0 top-0 h-full w-1 bg-blue-900 rounded-l"></div>
                    
                    <!-- Info principal -->
                    <div class="flex-1 sm:pl-4">
                        <h4 class="font-medium text-gray-800 text-base sm:text-lg">${task.taskTitle}</h4>
                        <p class="text-sm text-gray-500">Responsable: ${task.assignee}</p>
                        
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-sm text-gray-500">
                            <div class="flex items-center gap-1">
                                📅 Completada: ${new Date(task.completedDate).toLocaleDateString("es-ES")}
                            </div>
                            <div class="flex items-center gap-1 text-orange-600 font-medium">
                                ⏳ Hace ${daysSince} días
                            </div>
                        </div>
                    </div>

                    <!-- Acciones -->
                    <div class="flex flex-col sm:items-end gap-2 sm:ml-4">
                        <div class="flex flex-wrap gap-2">
                            <span class="${className} text-xs px-2 py-1 rounded">${task.priority}</span>
                            <span class="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">${task.department}</span>
                        </div>
                        <button class="flex items-center justify-center gap-1 bg-blue-900 text-white text-sm px-3 py-1.5 rounded-md shadow hover:bg-blue-800 w-full sm:w-auto" onclick="gestor.evaluationModal('${task.id}')">
                            ⭐ Evaluar Ahora
                        </button>
                    </div>
                </div>
            `);

            $("#cardsPendientes").append(card);
        });



        // 🎯 Activación de tabs con diseño pill
        $(".tab-btn").on("click", function () {
            $(".tab-btn").removeClass("bg-white text-blue-900 shadow-sm active")
                .addClass("bg-[#F1F5F9] text-gray-600 hover:text-blue-900");
            $(this).removeClass("bg-[#F1F5F9] text-gray-600 hover:text-blue-900").addClass("bg-white text-blue-900 shadow-sm active")

            $(".tab-pane").addClass("hidden");
            $("#tabContent .tab-pane[data-tab='" + $(this).data("tab") + "']").removeClass("hidden");
        });

    }

}



function escapeHTML(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
