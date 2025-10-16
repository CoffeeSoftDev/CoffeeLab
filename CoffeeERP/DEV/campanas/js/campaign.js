let api = 'ctrl/ctrl-campaign.php';
let api_admin = 'ctrl/ctrl-admin.php';
let app, campaign, dashboard, summary, history, admin;

let udn, red_social, tipo_anuncio, clasificacion;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn           = data.udn;
    red_social    = data.red_social;
    tipo_anuncio  = data.tipo_anuncio;
    clasificacion = data.clasificacion;

    app       = new App(api, "root");
    campaign  = new Campaign(api, "root");
    dashboard = new CampaignDashboard(api, "root");
    summary   = new CampaignSummary(api, "root");
    history   = new AnnualHistory(api, "root");
    admin     = new Admin(api_admin, "root");

    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Campaigns";
    }

    render() {
        this.layout();
        dashboard.render();
        admin.render();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterBarCampaigns" },
                container: { class: "w-full h-full", id: "containerCampaigns" },
            },
        });

        this.headerBar({
            parent: `filterBarCampaigns`,
            title: "📊 Gestión de Campañas Publicitarias",
            subtitle: "Administra campañas, anuncios y métricas de redes sociales",
            onClick: () => app.render(),
        });

        this.tabLayout({
            parent: `containerCampaigns`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "short",
            json: [
                {
                    id: "dashboard",
                    tab: "Dashboard",
                    class: "mb-1",
                   
                    onClick: () => dashboard.render()
                },
                {
                    id: "campaigns",
                    tab: "Campañas",
                    onClick: () => campaign.render()
                },
                {
                    id: "summary",
                    tab: "Resumen de Campaña",
                    onClick: () => summary.render()
                },
                {
                    id: "history",
                    tab: "Historial Anual",
                    onClick: () => history.render()
                },
                {
                    id: "admin",
                    tab: "Administrador",
                     active: true,
                    onClick: () => admin.lsTypes()
                },
            ]
        });

        $('#content-tabsCampaigns').removeClass('h-screen');
    }

    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Título por defecto",
            subtitle: "Subtítulo por defecto",
            icon: "icon-home",
            textBtn: "Inicio",
            classBtn: "bg-blue-600 hover:bg-blue-700",
            onClick: null,
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "flex justify-between items-center px-2 pt-3 pb-3"
        });

        const leftSection = $("<div>").append(
            $("<h2>", {
                class: "text-2xl font-semibold ",
                text: opts.title
            }),
            $("<p>", {
                class: "text-gray-400",
                text: opts.subtitle
            })
        );

        const rightSection = $("<div>").append(
            $("<button>", {
                class: `${opts.classBtn} text-white font-semibold px-4 py-2 rounded transition flex items-center`,
                html: `<i class="${opts.icon} mr-2"></i>${opts.textBtn}`,
                click: () => {
                    if (typeof opts.onClick === "function") {
                        opts.onClick();
                    }
                }
            })
        );

        container.append(leftSection, rightSection);
        $(`#${opts.parent}`).html(container);
    }
}

class Campaign extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Campaign";
        this.currentCampaignId = null;
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsCampaigns();
    }

    layout() {
        this.primaryLayout({
            parent: `container-campaigns`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn_id",
                    lbl: "Unidad de Negocio",
                    class: "col-sm-3",
                    data: udn,
                    onchange: `campaign.lsCampaigns()`,
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Activas" },
                        { id: "0", valor: "Inactivas" }
                    ],
                    onchange: `campaign.lsCampaigns()`,
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNewCampaign",
                    text: "Nueva Campaña",
                    onClick: () => this.addCampaign(),
                },
            ],
        });
    }

    lsCampaigns() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold text-white">📦 Campañas Publicitarias</h2>
                <p class="text-gray-400">Gestiona campañas y anuncios por red social</p>
            </div>
            <div id="container-table-campaigns"></div>
        `);

        this.createTable({
            parent: "container-table-campaigns",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsCampaigns' },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbCampaigns",
                theme: 'corporativo',
                center: [5]
            },
        });
    }

    addCampaign() {
        this.createModalForm({
            id: 'formCampaignAdd',
            data: { opc: 'addCampaign' },
            bootbox: {
                title: 'Crear Nueva Campaña',
            },
            json: this.jsonCampaign(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsCampaigns();
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });
    }

    async editCampaign(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getCampaign", id: id },
        });

        const campaignData = request.data;

        this.createModalForm({
            id: 'formCampaignEdit',
            data: { opc: 'editCampaign', id: id },
            bootbox: {
                title: 'Editar Campaña',
            },
            autofill: campaignData,
            json: this.jsonCampaign(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.lsCampaigns();
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });
    }

    statusCampaign(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Cambiar estado de la campaña?",
                text: "Esta acción activará o desactivará la campaña.",
                icon: "warning",
            },
            data: {
                opc: "statusCampaign",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: () => this.lsCampaigns(),
            },
        });
    }

    viewAnnouncements(campaña_id) {
        this.currentCampaignId = campaña_id;
        
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2 flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-semibold text-white">📢 Anuncios de la Campaña</h2>
                    <p class="text-gray-400">Gestión y seguimiento de anuncios publicitarios</p>
                </div>
                <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" onclick="campaign.addMultipleAnnouncements(${campaña_id})">
                    <i class="icon-plus mr-2"></i>Agregar Anuncios
                </button>
            </div>
            <div id="container-table-announcements"></div>
            <div class="px-2 pt-2">
                <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded" onclick="campaign.lsCampaigns()">
                    <i class="icon-arrow-left mr-2"></i>Volver a Campañas
                </button>
            </div>
        `);

        this.createTable({
            parent: "container-table-announcements",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsAnnouncements', campaña_id: campaña_id },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbAnnouncements",
                theme: 'dark',
                center: [0, 3, 4]
            },
        });
    }

    addMultipleAnnouncements(campaña_id) {
        const modalContent = `
            <div class="bg-[#1F2A37] p-6 rounded-lg">
                <h3 class="text-xl font-bold text-white mb-4">Agregar Anuncios a la Campaña</h3>
                <p class="text-gray-400 mb-6">Puedes agregar uno o varios anuncios a esta campaña</p>
                
                <div id="announcements-container" class="space-y-4">
                    <div class="announcement-form border border-gray-700 rounded-lg p-4 bg-[#111827]" data-index="0">
                        <h4 class="text-white font-semibold mb-3">Anuncio 1</h4>
                        ${this.getAnnouncementFormHTML(0)}
                    </div>
                </div>
                
                <div class="mt-4 flex gap-2">
                    <button type="button" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onclick="campaign.addAnnouncementForm()">
                        <i class="icon-plus mr-2"></i>Agregar Otro Anuncio
                    </button>
                    <button type="button" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" onclick="campaign.saveAllAnnouncements(${campaña_id})">
                        <i class="icon-check mr-2"></i>Guardar Todos
                    </button>
                    <button type="button" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded" onclick="bootbox.hideAll()">
                        Cancelar
                    </button>
                </div>
            </div>
        `;

        bootbox.dialog({
            message: modalContent,
            size: 'extra-large',
            closeButton: true
        });
    }

    getAnnouncementFormHTML(index) {
        return `
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <label class="text-gray-300 text-sm">Nombre del Anuncio</label>
                    <input type="text" class="form-control bg-[#1F2A37] text-white border-gray-600" id="nombre_${index}" placeholder="Ej: Anuncio Carnes Premium">
                </div>
                <div>
                    <label class="text-gray-300 text-sm">Fecha Inicio</label>
                    <input type="date" class="form-control bg-[#1F2A37] text-white border-gray-600" id="fecha_inicio_${index}">
                </div>
                <div>
                    <label class="text-gray-300 text-sm">Fecha Fin</label>
                    <input type="date" class="form-control bg-[#1F2A37] text-white border-gray-600" id="fecha_fin_${index}">
                </div>
                <div>
                    <label class="text-gray-300 text-sm">Tipo de Anuncio</label>
                    <select class="form-control bg-[#1F2A37] text-white border-gray-600" id="tipo_id_${index}">
                        ${tipo_anuncio.map(t => `<option value="${t.id}">${t.valor}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="text-gray-300 text-sm">Clasificación</label>
                    <select class="form-control bg-[#1F2A37] text-white border-gray-600" id="clasificacion_id_${index}">
                        ${clasificacion.map(c => `<option value="${c.id}">${c.valor}</option>`).join('')}
                    </select>
                </div>
                <div class="col-span-2">
                    <label class="text-gray-300 text-sm">Imagen</label>
                    <div class="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                        <i class="icon-upload text-gray-400 text-2xl"></i>
                        <p class="text-gray-400 text-sm mt-2">Arrastra o selecciona una imagen</p>
                        <input type="file" class="hidden" id="imagen_${index}" accept="image/*">
                    </div>
                </div>
            </div>
        `;
    }

    addAnnouncementForm() {
        const container = $('#announcements-container');
        const currentCount = container.find('.announcement-form').length;
        const newIndex = currentCount;

        const newForm = `
            <div class="announcement-form border border-gray-700 rounded-lg p-4 bg-[#111827]" data-index="${newIndex}">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="text-white font-semibold">Anuncio ${newIndex + 1}</h4>
                    <button type="button" class="text-red-400 hover:text-red-300" onclick="$(this).closest('.announcement-form').remove()">
                        <i class="icon-trash"></i>
                    </button>
                </div>
                ${this.getAnnouncementFormHTML(newIndex)}
            </div>
        `;

        container.append(newForm);
    }

    async saveAllAnnouncements(campaña_id) {
        const forms = $('.announcement-form');
        const announcements = [];

        forms.each(function() {
            const index = $(this).data('index');
            const announcement = {
                nombre: $(`#nombre_${index}`).val(),
                fecha_inicio: $(`#fecha_inicio_${index}`).val(),
                fecha_fin: $(`#fecha_fin_${index}`).val(),
                tipo_id: $(`#tipo_id_${index}`).val(),
                clasificacion_id: $(`#clasificacion_id_${index}`).val(),
                campaña_id: campaña_id
            };

            if (announcement.nombre && announcement.fecha_inicio && announcement.fecha_fin) {
                announcements.push(announcement);
            }
        });

        if (announcements.length === 0) {
            alert({
                icon: "warning",
                text: "Debes completar al menos un anuncio",
                btn1: true,
                btn1Text: "Ok"
            });
            return;
        }

        let successCount = 0;
        for (const announcement of announcements) {
            const response = await useFetch({
                url: this._link,
                data: { opc: 'addAnnouncement', ...announcement }
            });

            if (response.status === 200) {
                successCount++;
            }
        }

        bootbox.hideAll();
        
        alert({
            icon: "success",
            title: "Anuncios Guardados",
            text: `Se guardaron ${successCount} de ${announcements.length} anuncios correctamente`,
            btn1: true,
            btn1Text: "Aceptar"
        });

        this.viewAnnouncements(campaña_id);
    }

    addAnnouncement(campaña_id) {
        this.createModalForm({
            id: 'formAnnouncementAdd',
            data: { opc: 'addAnnouncement', campaña_id: campaña_id },
            bootbox: {
                title: 'Agregar Anuncio',
                size: 'large'
            },
            json: this.jsonAnnouncement(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.viewAnnouncements(campaña_id);
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });
    }

    async editAnnouncement(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getAnnouncement", id: id },
        });

        const announcementData = request.data;

        this.createModalForm({
            id: 'formAnnouncementEdit',
            data: { opc: 'editAnnouncement', id: id },
            bootbox: {
                title: 'Editar Anuncio',
                size: 'large'
            },
            autofill: announcementData,
            json: this.jsonAnnouncement(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.viewAnnouncements(this.currentCampaignId);
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });
    }

    async captureResults(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getAnnouncement", id: id },
        });

        const announcementData = request.data;

        this.createModalForm({
            id: 'formCaptureResults',
            data: { opc: 'captureResults', id: id },
            bootbox: {
                title: 'Capturar Resultados del Anuncio',
            },
            autofill: announcementData,
            json: [
                {
                    opc: "label",
                    text: `Anuncio: ${announcementData.nombre}`,
                    class: "col-12 text-lg font-bold mb-3"
                },
                {
                    opc: "input",
                    id: "total_monto",
                    lbl: "Inversión Total ($)",
                    tipo: "cifra",
                    class: "col-12 col-sm-6 mb-3",
                    onkeyup: "validationInputForNumber('#total_monto')"
                },
                {
                    opc: "input",
                    id: "total_clics",
                    lbl: "Total de Clics",
                    tipo: "number",
                    class: "col-12 col-sm-6 mb-3"
                },
            ],
            success: (response) => {
                if (response.status === 200) {
                    const cpc = response.data?.total_monto / response.data?.total_clics || 0;
                    alert({
                        icon: "success",
                        title: "Resultados Capturados",
                        text: `${response.message}\nCPC Calculado: $${cpc.toFixed(2)}`,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.viewAnnouncements(this.currentCampaignId);
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                }
            }
        });
    }

    jsonCampaign() {
        return [
            {
                opc: "label",
                text: "Información de la Campaña",
                class: "col-12 font-bold text-lg mb-2"
            },
            {
                opc: "select",
                id: "red_social_id",
                lbl: "Red Social",
                class: "col-12 col-sm-6 mb-3",
                data: red_social,
                text: "valor",
                value: "id"
            },
            {
                opc: "textarea",
                id: "estrategia",
                lbl: "Estrategia de Campaña",
                rows: 4,
                class: "col-12 mb-3",
                placeholder: "Describe la estrategia: alcance, mensajes, objetivos, etc."
            },
        ];
    }

    jsonAnnouncement() {
        return [
            {
                opc: "label",
                text: "Información del Anuncio",
                class: "col-12 font-bold text-lg mb-2"
            },
            {
                opc: "input",
                id: "nombre",
                lbl: "Nombre del Anuncio",
                tipo: "texto",
                class: "col-12 mb-3"
            },
            {
                opc: "input",
                id: "fecha_inicio",
                lbl: "Fecha de Inicio",
                type: "date",
                class: "col-12 col-sm-6 mb-3"
            },
            {
                opc: "input",
                id: "fecha_fin",
                lbl: "Fecha de Fin",
                type: "date",
                class: "col-12 col-sm-6 mb-3"
            },
            {
                opc: "select",
                id: "tipo_id",
                lbl: "Tipo de Anuncio",
                class: "col-12 col-sm-6 mb-3",
                data: tipo_anuncio,
                text: "valor",
                value: "id"
            },
            {
                opc: "select",
                id: "clasificacion_id",
                lbl: "Clasificación",
                class: "col-12 col-sm-6 mb-3",
                data: clasificacion,
                text: "valor",
                value: "id"
            },
            {
                opc: "div",
                id: "imagen",
                lbl: "Imagen del Anuncio",
                class: "col-12 mt-3",
                html: `
                    <div class="w-full p-4 border-2 border-dashed border-violet-500 rounded-xl bg-[#1F2A37] text-center">
                        <div class="flex flex-col items-center justify-center py-6">
                            <div class="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mb-4">
                                <i class="fas fa-upload text-white"></i>
                            </div>
                            <p class="text-white text-sm">
                                Drag & Drop or <span class="text-violet-400 cursor-pointer underline">choose file</span> to upload
                            </p>
                            <p class="text-xs text-gray-400 mt-2">Formatos soportados: JPEG, PNG, PDF</p>
                        </div>
                    </div>
                `
            },
        ];
    }
}
