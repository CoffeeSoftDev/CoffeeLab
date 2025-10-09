let api_campaign = "ctrl/ctrl-kpi-campaign.php";
let campaign, campaignTypes, campaignClassification, ads;
let udnList, campaignsList, typesList, classificationsList, socialNetworksList;

$(async () => {
    const data                = await useFetch({ url: api_campaign, data: { opc: "init" } });
          udnList             = data.udn;
          campaignsList       = data.campaigns;
          typesList           = data.types;
          classificationsList = data.classifications;
          socialNetworksList  = data.socialNetworks;

    campaign               = new Campaign(api_campaign, "root");
    campaignTypes          = new CampaignTypes(api_campaign, "root");
    campaignClassification = new CampaignClassification(api_campaign, "root");
    ads                    = new Ads(api_campaign, "root");

    campaign.init();
    ads.render();
});

class Campaign extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Campaign";
    }

    init() {
        this.render();

    }

    render() {
        this.layout();
        this.layoutTabs();
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: '',
            card: {
                filterBar: { class: 'w-full my-3', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full  h-full rounded-lg p-3', id: 'container' + this.PROJECT_NAME }
            }
        });

        $("#filterBar" + this.PROJECT_NAME).html(`
            <div class="px-4 pt-3 ">
                <h2 class="text-2xl font-semibold ">📊 Módulo de Campañas</h2>
                <p class="text-gray-400">Gestiona campañas de marketing, anuncios y análisis de rendimiento.</p>
            </div>
        `);
    }

    layoutTabs() {
        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabsCampaignMain",
            content: { class: "" },
            theme: "light",
            type: 'short',
            json: [
                {
                    id: "dashboard",
                    tab: "Dashboard",
                    class: 'mb-1',
                    onClick: () => this.renderDashboard(),

                },
                {
                    id: "anuncios",
                    tab: "Anuncios",
                    active: true,
                    onClick: () => this.renderAnuncios()
                },
                {
                    id: "resumen",
                    tab: "Resumen de campaña",
                    onClick: () => this.renderResumen()
                },
                {
                    id: "historial",
                    tab: "Historial Anual",
                    onClick: () => this.renderHistorial()
                },
                {
                    id: "administrador",
                    tab: "Administrador",
                    onClick: () => campaignTypes.render(),
                    
                }
            ]
        });
    }

    renderDashboard() {
        const container = $("#container-dashboard");
        container.html(`
            <div class="p-6">
                <div class="bg-[#1F2A37] rounded-lg p-6 text-center">
                    <i class="icon-chart-bar text-6xl text-blue-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-white mb-2">Dashboard de Campañas</h3>
                    <p class="text-gray-400">Visualiza métricas y KPIs de tus campañas activas</p>
                    <p class="text-sm text-gray-500 mt-4">En desarrollo...</p>
                </div>
            </div>
        `);
    }

    renderAnuncios() {
        ads.render();
    }

    renderResumen() {
        const container = $("#container-resumen");
        container.html(`
            <div id="resumen-header" class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📈 Resumen de Campaña</h2>
                <p class="text-gray-400">Reporte desglosado de datos por campaña.</p>
            </div>
            <div id="filterbar-resumen" class="mb-2 px-4"></div>
            <div id="tabla-resumen" class="px-4"></div>
        `);

        this.filterBarResumen();
        this.lsResumenCampana();
    }

    filterBarResumen() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        this.createfilterBar({
            parent: "filterbar-resumen",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: udnList,
                    onchange: 'campaign.lsResumenCampana()'
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-12 col-md-2",
                    data: [
                        { id: 1, valor: "Enero" },
                        { id: 2, valor: "Febrero" },
                        { id: 3, valor: "Marzo" },
                        { id: 4, valor: "Abril" },
                        { id: 5, valor: "Mayo" },
                        { id: 6, valor: "Junio" },
                        { id: 7, valor: "Julio" },
                        { id: 8, valor: "Agosto" },
                        { id: 9, valor: "Septiembre" },
                        { id: 10, valor: "Octubre" },
                        { id: 11, valor: "Noviembre" },
                        { id: 12, valor: "Diciembre" }
                    ],
                    valor: currentMonth,
                    onchange: 'campaign.lsResumenCampana()'
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-12 col-md-2",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = currentYear - i;
                        return { id: year, valor: year.toString() };
                    }),
                    valor: currentYear,
                    onchange: 'campaign.lsResumenCampana()'
                },
                {
                    opc: "select",
                    id: "red_social",
                    lbl: "Red Social",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Todas las redes" },
                        ...socialNetworksList
                    ],
                    onchange: 'campaign.lsResumenCampana()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-2",
                    id: "btnBuscarResumen",
                    text: "Buscar",
                    onClick: () => this.lsResumenCampana(),
                },
            ],
        });
    }

    lsResumenCampana() {
        this.createTable({
            parent: "tabla-resumen",
            idFilterBar: "filterbar-resumen",
            data: { opc: "lsResumenCampana" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbResumen",
                theme: 'corporativo',
                title: "📈 Resumen de Campaña",
                subtitle: "Reporte desglosado de los datos por campaña",
                center: [2, 5, 6, 7, 8],
                right: [5, 6, 7, 8]
            },
        });
    }

    renderHistorial() {
        const container = $("#container-historial");
        container.html(`
            <div id="historial-header" class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📊 Historial Anual</h2>
                <p class="text-gray-400">Reportes CPC y CAC por período.</p>
            </div>
            <div id="filterbar-historial" class="mb-2 px-4"></div>
            <div id="tabla-historial" class="px-4"></div>
        `);

        this.filterBarHistorial();
        this.lsHistorialReports();
    }

    filterBarHistorial() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        this.createfilterBar({
            parent: "filterbar-historial",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-2",
                    data: udnList,
                    onchange: 'campaign.lsHistorialReports()'
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-12 col-md-2",
                    data: [
                        { id: 1, valor: "Enero" },
                        { id: 2, valor: "Febrero" },
                        { id: 3, valor: "Marzo" },
                        { id: 4, valor: "Abril" },
                        { id: 5, valor: "Mayo" },
                        { id: 6, valor: "Junio" },
                        { id: 7, valor: "Julio" },
                        { id: 8, valor: "Agosto" },
                        { id: 9, valor: "Septiembre" },
                        { id: 10, valor: "Octubre" },
                        { id: 11, valor: "Noviembre" },
                        { id: 12, valor: "Diciembre" }
                    ],
                    valor: currentMonth,
                    onchange: 'campaign.lsHistorialReports()'
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-12 col-md-2",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = currentYear - i;
                        return { id: year, valor: year.toString() };
                    }),
                    valor: currentYear,
                    onchange: 'campaign.lsHistorialReports()'
                },
                {
                    opc: "select",
                    id: "tipo_reporte",
                    lbl: "Tipo de Reporte",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "CPC", valor: "Reporte CPC" },
                        { id: "CAC", valor: "Reporte CAC" }
                    ],
                    valor: "CPC",
                    onchange: 'campaign.lsHistorialReports()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-2",
                    id: "btnBuscarHistorial",
                    text: "Buscar",
                    onClick: () => this.lsHistorialReports(),
                },
            ],
        });
    }

    lsHistorialReports() {
        const tipoReporte = $('#filterbar-historial #tipo_reporte').val() || 'CPC';

        let tableConfig = {
            parent: "tabla-historial",
            idFilterBar: "filterbar-historial",
            data: { opc: tipoReporte === 'CPC' ? "lsReporteCPC" : "lsReporteCAC" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbHistorial",
                theme: 'corporativo',
                center: [0, 4, 5],
                right: [4, 5]
            },
        };

        if (tipoReporte === 'CPC') {
            tableConfig.attr.title = "📊 Anuncios por CPC";
            tableConfig.attr.subtitle = "Detalle de cada anuncio y su inversión total";
        } else {
            tableConfig.attr.title = "📊 Anuncios por CAC";
            tableConfig.attr.subtitle = "Detalle de cada anuncio, inversión y clientes adquiridos";
        }

        this.createTable(tableConfig);
    }
}

class CampaignTypes extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "CampaignTypes";
    }

    render() {
        const container = $("#container-administrador");
        container.html(`
          
            <div id="admin-tabs"></div>
        `);

        this.layoutTabs();
        this.filterBar();
        this.lsCampaignTypes();
    }

    layoutTabs() {
        this.tabLayout({
            parent: "admin-tabs",
            id: "tabsAdmin",
            content: { class: "" },

            type: 'short',
            json: [
                {
                    id: "tipos",
                    tab: "Tipos de anuncios",
                    class: 'mb-1',
                    onClick: () => this.lsCampaignTypes(),
                    active: true,
                },
                {
                    id: "clasificacion",
                    tab: "Clasificación de anuncios",
                    onClick: () => campaignClassification.lsCampaignClassification()
                }
            ]
        });
    }

    filterBar() {
        const container = $("#container-tipos");
        container.html('<div id="filterbar-tipos" class="mb-2"></div><div id="tabla-tipos"></div>');

        this.createfilterBar({
            parent: "filterbar-tipos",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: udnList,
                    onchange: 'campaignTypes.lsCampaignTypes()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'campaignTypes.lsCampaignTypes()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoTipo",
                    text: "Nuevo Tipo",
                    onClick: () => this.addCampaignType(),
                },
            ],
        });
    }

    lsCampaignTypes() {
        this.createTable({
            parent: "tabla-tipos",
            idFilterBar: "filterbar-tipos",
            data: { opc: "lsCampaignTypes" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbCampaignTypes",
                theme: 'corporativo',
                right: [4],
                center: [3]
            },
        });
    }

    addCampaignType() {
        this.createModalForm({
            id: 'formCampaignTypeAdd',
            data: { opc: 'addCampaignType' },
            bootbox: {
                title: 'Agregar Tipo de Campaña',
            },
            json: this.jsonCampaignType(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCampaignTypes();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editCampaignType(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getCampaignType",
                id: id,
            },
        });

        const data = request.data;

        this.createModalForm({
            id: 'formCampaignTypeEdit',
            data: { opc: 'editCampaignType', id: data.id },
            bootbox: {
                title: 'Editar Tipo de Campaña',
            },
            autofill: data,
            json: this.jsonCampaignType(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCampaignTypes();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message });
                }
            }
        });
    }

    statusCampaignType(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Desea cambiar el estado del tipo de campaña?",
                text: "Esta acción activará o desactivará el tipo.",
                icon: "warning",
            },
            data: {
                opc: "statusCampaignType",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: () => this.lsCampaignTypes(),
            },
        });
    }

    jsonCampaignType() {
        return [
            {
                opc: "input",
                id: "name",
                lbl: "Nombre del Tipo",
                class: "col-12 mb-3"
            },
            {
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de Negocio",
                class: "col-12 mb-3",
                data: udnList,
                text: "valor",
                value: "id"
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción",
                class: "col-12 mb-3"
            }
        ];
    }
}

class CampaignClassification extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "CampaignClassification";
    }

    lsCampaignClassification() {
        const container = $("#container-clasificacion");
        container.html('<div id="filterbar-clasificacion" class="mb-2"></div><div id="tabla-clasificacion"></div>');

        this.filterBar();
        this.lsClasification();
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterbar-clasificacion",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "UDN",
                    class: "col-12 col-md-3",
                    data: udnList,
                    onchange: 'campaignClassification.lsClasification()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'campaignClassification.lsClasification()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevaClasificacion",
                    text: "Nueva Clasificación",
                    onClick: () => this.addCampaignClassification(),
                },
            ],
        });
    }

    lsClasification() {
        this.createTable({
            parent: "tabla-clasificacion",
            idFilterBar: "filterbar-clasificacion",
            data: { opc: "lsCampaignClassification" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbCampaignClassification",
                theme: 'corporativo',
                right: [4],
                center: [3]
            },
        });
    }

    addCampaignClassification() {
        this.createModalForm({
            id: 'formCampaignClassificationAdd',
            data: { opc: 'addCampaignClassification' },
            bootbox: {
                title: 'Agregar Clasificación de Campaña',
            },
            json: this.jsonCampaignClassification(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsClasification();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editCampaignClassification(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getCampaignClassification",
                id: id,
            },
        });

        const data = request.data;

        this.createModalForm({
            id: 'formCampaignClassificationEdit',
            data: { opc: 'editCampaignClassification', id: data.id },
            bootbox: {
                title: 'Editar Clasificación de Campaña',
            },
            autofill: data,
            json: this.jsonCampaignClassification(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsClasification();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message });
                }
            }
        });
    }

    statusCampaignClassification(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Desea cambiar el estado de la clasificación?",
                text: "Esta acción activará o desactivará la clasificación.",
                icon: "warning",
            },
            data: {
                opc: "statusCampaignClassification",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: () => this.lsClasification(),
            },
        });
    }

    jsonCampaignClassification() {
        return [
            {
                opc: "input",
                id: "name",
                lbl: "Nombre de la Clasificación",
                class: "col-12 mb-3"
            },
            {
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de Negocio",
                class: "col-12 mb-3",
                data: udnList,
                text: "valor",
                value: "id"
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción",
                class: "col-12 mb-3"
            }
        ];
    }
}

class Ads extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Ads";
    }

    render() {
        const container = $("#container-anuncios");
        container.html(`
            <div id="ads-header" class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold ">📢 Gestión de Anuncios</h2>
                <p class="text-gray-400">Crea y administra anuncios para tus campañas de marketing.</p>
            </div>
            <div id="filterbar-ads" class="mb-2 px-4"></div>
            <div id="tabla-ads" class="px-4"></div>
        `);

        this.filterBar();
        this.lsCampaignAds();
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterbar-ads",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: udnList,
                    onchange: 'ads.lsCampaignAds()'
                },
                {
                    opc: "select",
                    id: "social_network",
                    lbl: "Red Social",
                    class: "col-12 col-md-3",
                    data: socialNetworksList,
                    onchange: 'ads.lsCampaignAds()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnAgregarCampana",
                    text: "Agregar Campaña",
                    onClick: () => this.addCampaign(),
                },
            ],
        });
    }

    lsCampaignAds() {
        this.createTable({
            parent: "tabla-ads",
            idFilterBar: "filterbar-ads",
            data: { opc: "lsCampaignAds", active: 1 },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbCampaignAds",
                theme: 'corporativo',
                right: [10],
                center: [3, 8, 9]
            },
        });
    }

    addCampaign() {
        alert({
            icon: "question",
            title: "Crear Nueva Campaña",
            text: "¿Deseas crear una nueva campaña con anuncio?",
            btn1: true,
            btn1Text: "Sí, crear",
            btn2: true,
            btn2Text: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                this.showCampaignForm();
            }
        });
    }

    showCampaignForm() {

        const currentDate  = new Date();
        const firstDay     = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const fifteenthDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        bootbox.dialog({
            title: '📢 CAMPAÑA 1',
            size: 'xl',
            message: this.buildCampaignFormHTML(formatDate(firstDay), formatDate(fifteenthDay)),
            buttons: {
                cancel: {
                    label: 'Cancelar',
                    className: 'btn-secondary'
                },
                ok: {
                    label: 'Guardar Campaña',
                    className: 'btn-primary',
                    callback: () => {
                        this.saveCampaignWithAds();
                        return false;
                    }
                }
            },
            onShown: () => {
                this.initCampaignFormEvents();
            }
        });
    }

    buildCampaignFormHTML(defaultStartDate, defaultEndDate) {
        return `
            <div class="campaign-form-container">
                <!-- Barra superior de campaña -->
                <div class="row mb-4 p-3 mx-1 bg-light border rounded">
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Estrategia</label>
                        <input type="text" id="campaign_strategy" class="form-control" placeholder="Mensajes">
                    </div>
                    <div class="col-md-3 mb-2">
                        <label class="form-label">Unidad de negocio</label>
                        <select id="campaign_udn" class="form-select">
                            ${udnList.map(u => `<option value="${u.id}">${u.valor}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-3 mb-2">
                        <label class="form-label">Red social</label>
                        <select id="campaign_social" class="form-select">
                            ${socialNetworksList.map(s => `<option value="${s.id}">${s.valor}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-2 mb-2 d-flex align-items-end">
                        <button type="button" id="btnAddAd" class="btn btn-success w-100">
                            <i class="icon-plus"></i> Agregar
                        </button>
                    </div>
                </div>

                <!-- Contenedor de anuncios -->
                <div id="ads-container" class="row">
                    ${this.buildAdCardHTML(1, defaultStartDate, defaultEndDate)}
                    ${this.buildAdCardHTML(2, defaultStartDate, defaultEndDate)}
                </div>
            </div>
        `;
    }

    buildAdCardHTML(index, startDate, endDate) {
        return `
            <div class="col-md-6 mb-3 ad-card" data-ad-index="${index}">
                <div class="card border">
                    <div class="card-body">
                        <h6 class="card-title mb-3">Nombre del anuncio</h6>
                        
                        <div class="mb-3">
                            <input type="text" class="form-control ad-name" placeholder="Diseño imagen" data-field="ad_name">
                        </div>

                        <div class="row mb-3">
                            <div class="col-6">
                                <label class="form-label small">Fecha inicio</label>
                                <input type="date" class="form-control form-control-sm ad-start-date" value="${startDate}" data-field="start_date">
                            </div>
                            <div class="col-6">
                                <label class="form-label small">Fecha fin</label>
                                <input type="date" class="form-control form-control-sm ad-end-date" value="${endDate}" data-field="end_date">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small">Tipo de anuncio</label>
                            <select class="form-select form-select-sm ad-type" data-field="type_id">
                                <option value="">Publicación</option>
                                ${typesList.map(t => `<option value="${t.id}">${t.valor}</option>`).join('')}
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small">Clasificación</label>
                            <input type="text" class="form-control form-control-sm ad-classification" placeholder="Pauta ${index}" data-field="classification_name">
                        </div>

                        <div class="mb-3">
                            <label class="form-label small">Imagen</label>
                            <div class="border rounded p-4 text-center bg-light ad-image-upload" style="min-height: 100px; cursor: pointer;">
                                <i class="icon-upload text-muted" style="font-size: 2rem;"></i>
                                <p class="text-muted small mb-0 mt-2">Click para subir imagen</p>
                                <input type="file" class="d-none ad-image-input" accept="image/*" data-field="image">
                                <input type="hidden" class="ad-image-url" data-field="image_url">
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-sm btn-info flex-fill btn-update-ad">
                                <i class="icon-check"></i> Actualizar
                            </button>
                            <button type="button" class="btn btn-sm btn-danger flex-fill btn-delete-ad">
                                <i class="icon-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initCampaignFormEvents() {
        let adCounter = 2;

        // Botón agregar anuncio
        $('#btnAddAd').on('click', () => {
            adCounter++;
            const currentDate = new Date();
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const fifteenthDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);

            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            $('#ads-container').append(this.buildAdCardHTML(adCounter, formatDate(firstDay), formatDate(fifteenthDay)));
            this.initAdCardEvents();
        });

        this.initAdCardEvents();
    }

    initAdCardEvents() {
        // Click en área de imagen
        $('.ad-image-upload').off('click').on('click', function () {
            $(this).find('.ad-image-input').click();
        });

        // Cambio de imagen
        $('.ad-image-input').off('change').on('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const $upload = $(this).closest('.ad-image-upload');
                    $upload.html(`
                        <img src="${e.target.result}" class="img-fluid rounded" style="max-height: 150px;">
                        <p class="text-success small mb-0 mt-2">Imagen cargada</p>
                    `);
                    $upload.siblings('.ad-image-url').val(e.target.result);
                }.bind(this);
                reader.readAsDataURL(file);
            }
        });

        // Botón eliminar anuncio
        $('.btn-delete-ad').off('click').on('click', function () {
            if ($('.ad-card').length > 1) {
                $(this).closest('.ad-card').remove();
            } else {
                alert({ icon: "warning", text: "Debe haber al menos un anuncio" });
            }
        });

        // Botón actualizar anuncio (validación individual)
        $('.btn-update-ad').off('click').on('click', function () {
            const $card = $(this).closest('.ad-card');
            const adName = $card.find('.ad-name').val();

            if (!adName) {
                alert({ icon: "warning", text: "El nombre del anuncio es requerido" });
                return;
            }

            alert({ icon: "success", text: "Anuncio validado correctamente" });
        });
    }

    saveCampaignWithAds() {
        const campaignData = {
            strategy: $('#campaign_strategy').val(),
            udn_id: $('#campaign_udn').val(),
            social_network: $('#campaign_social').val(),
            ads: []
        };

        $('.ad-card').each(function () {
            const adData = {
                ad_name: $(this).find('.ad-name').val(),
                start_date: $(this).find('.ad-start-date').val(),
                end_date: $(this).find('.ad-end-date').val(),
                type_id: $(this).find('.ad-type').val(),
                classification_name: $(this).find('.ad-classification').val(),
                image_url: $(this).find('.ad-image-url').val()
            };

            if (adData.ad_name) {
                campaignData.ads.push(adData);
            }
        });

        if (campaignData.ads.length === 0) {
            alert({ icon: "warning", text: "Debe agregar al menos un anuncio" });
            return;
        }

        useFetch({
            url: this._link,
            data: {
                opc: 'addCampaignWithMultipleAds',
                ...campaignData
            }
        }).then(response => {
            if (response.status === 200) {
                alert({ icon: "success", text: response.message });
                this.lsCampaignAds();
                bootbox.hideAll();
            } else {
                alert({ icon: "error", text: response.message });
            }
        });
    }

    addCampaignAd(campaignId = null) {
        this.createModalForm({
            id: 'formCampaignAdAdd',
            data: { opc: 'addCampaignAd' },
            bootbox: {
                title: '📝 Crear Anuncio de Campaña',
                size: 'large'
            },
            json: this.jsonCampaignAd(campaignId),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCampaignAds();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });

        $("#lblAnuncio").addClass("border-b p-2 mb-2 font-bold");
    }

    async editCampaignAd(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getCampaignAd",
                id: id,
            },
        });

        const data = request.data;

        this.createModalForm({
            id: 'formCampaignAdEdit',
            data: { opc: 'editCampaignAd', id: data.id },
            bootbox: {
                title: '✏️ Editar Anuncio',
                size: 'large'
            },
            autofill: data,
            json: this.jsonCampaignAd(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCampaignAds();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message });
                }
            }
        });

        $("#lblAnuncio").addClass("border-b p-2 mb-2 font-bold");
    }

    async showResults(adId) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getAdResults",
                ad_id: adId,
            },
        });

        const data = request.data || {};

        this.createModalForm({
            id: 'formAdResults',
            data: { opc: 'saveAdResults', ad_id: adId, id: data.id || '' },
            bootbox: {
                title: '📊 Resultados del Anuncio',
            },
            autofill: data,
            json: this.jsonAdResults(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message });
                }
            }
        });
    }

    jsonCampaignWithAd(defaultStartDate, defaultEndDate) {
        return [
            {
                opc: "label",
                id: "lblCampaign",
                text: "📋 Información de la Campaña",
                class: "col-12 text-lg mb-3"
            },
            {
                opc: "input",
                id: "strategy",
                lbl: "Estrategia",
                class: "col-12 mb-3",
                placeholder: "Describe la estrategia de la campaña"
            },
            {
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de Negocio",
                class: "col-12 col-md-6 mb-3",
                data: udnList,
                text: "valor",
                value: "id",
                required: true
            },
            {
                opc: "select",
                id: "social_network",
                lbl: "Red Social",
                class: "col-12 col-md-6 mb-3",
                data: socialNetworksList,
                required: true
            },
            {
                opc: "label",
                id: "lblAnuncio",
                text: "📢 Datos del Anuncio",
                class: "col-12 text-lg mb-3 mt-4"
            },
            {
                opc: "input",
                id: "ad_name",
                lbl: "Nombre del Anuncio",
                class: "col-12 mb-3",
                required: true
            },
            {
                opc: "input",
                id: "start_date",
                lbl: "Fecha Inicio",
                type: "date",
                class: "col-12 col-md-6 mb-3",
                valor: defaultStartDate
            },
            {
                opc: "input",
                id: "end_date",
                lbl: "Fecha Final",
                type: "date",
                class: "col-12 col-md-6 mb-3",
                valor: defaultEndDate
            },
            {
                opc: "select",
                id: "type_id",
                lbl: "Tipo de Anuncio",
                class: "col-12 col-md-6 mb-3",
                data: typesList,
                text: "name",
                value: "id"
            },
            {
                opc: "select",
                id: "classification_id",
                lbl: "Clasificación",
                class: "col-12 col-md-6 mb-3",
                data: classificationsList,
                text: "name",
                value: "id"
            },
            {
                opc: "input",
                id: "image",
                lbl: "Imagen del Anuncio (URL)",
                class: "col-12 mb-3",
                placeholder: "https://ejemplo.com/imagen.jpg"
            }
        ];
    }

    jsonCampaignAd(campaignId = null) {
        return [
            {
                opc: "label",
                id: "lblAnuncio",
                text: "Datos del Anuncio",
                class: "col-12 text-lg mb-2"
            },
            {
                opc: "input",
                id: "ad_name",
                lbl: "Nombre del Anuncio",
                class: "col-12 mb-3",
                required: true
            },
            {
                opc: "select",
                id: "campaign_id",
                lbl: "Campaña",
                class: "col-12 col-md-6 mb-3",
                data: campaignsList,
                text: "valor",
                value: "id",
                required: true,
                ...(campaignId && { valor: campaignId })
            },
            {
                opc: "select",
                id: "type_id",
                lbl: "Tipo de Anuncio",
                class: "col-12 col-md-6 mb-3",
                data: typesList,
                text: "name",
                value: "id"
            },
            // {
            //     opc: "input",
            //     id: "title",
            //     lbl: "Título",
            //     class: "col-12 mb-3"
            // },
            // {
            //     opc: "input",
            //     id: "subtitle",
            //     lbl: "Subtítulo",
            //     class: "col-12 mb-3"
            // },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción",
                class: "col-12 mb-3",
                rows: 3
            },
            {
                opc: "select",
                id: "classification_id",
                lbl: "Clasificación",
                class: "col-12 col-md-6 mb-3",
                data: classificationsList,
                text: "name",
                value: "id"
            },
            {
                opc: "input",
                id: "image",
                lbl: "URL de Imagen",
                class: "col-12 col-md-6 mb-3",
                placeholder: "https://ejemplo.com/imagen.jpg"
            },
            {
                opc: "input",
                id: "start_date",
                lbl: "Fecha de Inicio",
                type: "date",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "end_date",
                lbl: "Fecha Final",
                type: "date",
                class: "col-12 col-md-6 mb-3"
            }
        ];
    }

    jsonAdResults() {
        return [
            {
                opc: "input",
                id: "total_spent",
                lbl: "Total Gastado ($)",
                type: "number",
                step: "0.01",
                class: "col-12 col-md-6 mb-3",
                required: true
            },
            {
                opc: "input",
                id: "total_clicks",
                lbl: "Total de Clics",
                type: "number",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "total_results",
                lbl: "Total de Resultados",
                type: "number",
                class: "col-12 col-md-6 mb-3",
                required: true
            },
            {
                opc: "div",
                id: "cost_info",
                class: "col-12 mb-3",
                html: `
                    <div class="alert alert-info">
                        <i class="icon-info-circle"></i>
                        <strong>Nota:</strong> El costo por resultado se calculará automáticamente.
                    </div>
                `
            }
        ];
    }
}
