let app;
const api = "ctrl/ctrl-social-metrics.php";

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    
    app = new App(api, "root", data);
    app.init();
});

class App extends Templates {
    constructor(link, div_modulo, initData) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SocialMetrics";
        this.initData = initData;
        this.currentView = "capture";
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        this.showCaptureView();
      
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: "w-full my-3", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full my-3 h-full rounded-lg p-3", id: "container" + this.PROJECT_NAME }
            }
        });

        this.layoutTabs();
    }

    layoutTabs() {
        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabsMetrics",
            content: { class: "" },
            theme: "light",
            type: "short",
            json: [
                {
                    id: "capture",
                    tab: "Captura de Métricas",
                    onClick: () => this.showCaptureView(),
                    active: true
                },
                {
                    id: "annual",
                    tab: "Concentrado Anual",
                    onClick: () => this.showAnnualReport()
                },
                {
                    id: "monthly",
                    tab: "Comparativo Mensual",
                    onClick: () => this.showMonthlyReport()
                },
                {
                    id: "yearly",
                    tab: "Comparativo Anual",
                    onClick: () => this.showYearlyReport()
                }
            ]
        });

        $("#container" + this.PROJECT_NAME).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold ">📊 Métricas de Redes Sociales</h2>
                <p class="text-gray-400">Captura y análisis de métricas mensuales por red social</p>
            </div>
        `);
    }

    createFilterBar() {
        this.createfilterBar({
            parent: "filterBarCapture",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: this.initData.udn,
                    text: "name",
                    value: "id",
                    onchange: "app.loadMetrics()"
                },
                {
                    opc: "select",
                    id: "social_network",
                    lbl: "Red Social",
                    class: "col-12 col-md-3",
                    data: this.initData.social_networks,
                    text: "name",
                    value: "id",
                    onchange: "app.loadMetrics()"
                },
                {
                    opc: "select",
                    id: "year",
                    lbl: "Año",
                    class: "col-12 col-md-2",
                    data: this.generateYears(),
                    onchange: "app.loadMetrics()"
                },
                {
                    opc: "select",
                    id: "month",
                    lbl: "Mes",
                    class: "col-12 col-md-2",
                    data: this.initData.months,
                    text: "name",
                    value: "id",
                    onchange: "app.loadMetrics()"
                },
                {
                    opc: "button",
                    class: "col-12 col-md-2",
                    id: "btnNewCapture",
                    text: "Nueva Captura",
                    onClick: () => this.addMetric()
                }
            ]
        });
    }

    generateYears() {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 5; i--) {
            years.push({ id: i, valor: i.toString() });
        }
        return years;
    }

    showCaptureView() {
     
        const container = $("#container-capture");
        container.html(`
            <div id="filterBarCapture" class="border p-4"></div>
            <div id="capture-form" class="mb-4"></div>
            <div id="capture-history"></div>
        `);

        this.createFilterBar();


        // this.loadMetrics();
    }




    loadMetrics() {
        const filters = {
            udn: $("#udn").val(),
            social_network: $("#social_network").val(),
            year: $("#year").val(),
            month: $("#month").val()
        };

        this.createTable({
            parent: "capture-history",
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "listMetrics", ...filters },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbMetrics",
                theme: "dark",
                title: "Historial de Métricas",
                center: [1, 2, 3, 4, 5],
                right: [6]
            }
        });
    }

    addMetric() {
        const udn = $("#udn").val();
        const social = $("#social_network").val();
        const year = $("#year").val();
        const month = $("#month").val();

        if (!udn || !social || !year || !month) {
            alert({
                icon: "warning",
                text: "Por favor selecciona todos los filtros antes de crear una nueva captura",
                btn1: true,
                btn1Text: "Ok"
            });
            return;
        }

        this.createModalForm({
            id: "formMetricAdd",
            data: { 
                opc: "addMetric",
                udn_id: udn,
                social_id: social,
                year: year,
                month: month
            },
            bootbox: {
                title: "Captura de Métricas Mensuales",
                size: "large"
            },
            json: this.jsonMetric(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.loadMetrics();
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

    async editMetric(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getMetric", id: id }
        });

        if (request.status !== 200) {
            alert({
                icon: "error",
                text: "Error al obtener los datos de la métrica",
                btn1: true
            });
            return;
        }

        const metric = request.data;

        this.createModalForm({
            id: "formMetricEdit",
            data: { opc: "editMetric", id: id },
            bootbox: {
                title: "Editar Métricas",
                size: "large"
            },
            autofill: metric,
            json: this.jsonMetric(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        btn1: true
                    });
                    this.loadMetrics();
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true
                    });
                }
            }
        });
    }

    deleteMetric(id) {
        this.swalQuestion({
            opts: {
                title: "¿Eliminar métrica?",
                text: "Esta acción no se puede deshacer",
                icon: "warning"
            },
            data: { opc: "deleteMetric", id: id },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true
                        });
                        this.loadMetrics();
                    }
                }
            }
        });
    }

    jsonMetric() {
        return [
            {
                opc: "label",
                text: "Métricas de Engagement",
                class: "col-12 fw-bold text-lg mb-2 border-b p-1"
            },
            {
                opc: "input",
                id: "followers",
                lbl: "Seguidores",
                tipo: "number",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "publications",
                lbl: "Publicaciones",
                tipo: "number",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "likes",
                lbl: "Likes",
                tipo: "number",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "comments",
                lbl: "Comentarios",
                tipo: "number",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "shares",
                lbl: "Compartidos",
                tipo: "number",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "reach",
                lbl: "Alcance",
                tipo: "number",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "input",
                id: "engagement_rate",
                lbl: "Tasa de Engagement (%)",
                tipo: "number",
                step: "0.01",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "btn-submit",
                text: "Guardar Métricas",
                class: "col-12 col-md-4 offset-md-8"
            }
        ];
    }

    showAnnualReport() {
        this.currentView = "annual";
        const container = $("#container-annual");
        
        const filters = {
            udn: $("#udn").val(),
            social_network: $("#social_network").val(),
            year: $("#year").val()
        };

        container.html('<div id="annual-report"></div>');

        this.createTable({
            parent: "annual-report",
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "annualReport", ...filters },
            coffeesoft: true,
            conf: { datatable: false },
            attr: {
                id: "tbAnnualReport",
                theme: "dark",
                title: "Concentrado Anual",
                subtitle: "Métricas totales por mes"
            }
        });
    }

    showMonthlyReport() {
        this.currentView = "monthly";
        const container = $("#container-monthly");
        
        const filters = {
            udn: $("#udn").val(),
            social_network: $("#social_network").val(),
            year: $("#year").val(),
            month: $("#month").val()
        };

        container.html('<div id="monthly-report"></div>');

        this.createTable({
            parent: "monthly-report",
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "monthlyReport", ...filters },
            coffeesoft: true,
            conf: { datatable: false },
            attr: {
                id: "tbMonthlyReport",
                theme: "dark",
                title: "Comparativo Mensual",
                subtitle: "Comparación mes actual vs anterior"
            }
        });
    }

    showYearlyReport() {
        this.currentView = "yearly";
        const container = $("#container-yearly");
        
        const filters = {
            udn: $("#udn").val(),
            social_network: $("#social_network").val(),
            year: $("#year").val()
        };

        container.html('<div id="yearly-report"></div>');

        this.createTable({
            parent: "yearly-report",
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "yearlyReport", ...filters },
            coffeesoft: true,
            conf: { datatable: false },
            attr: {
                id: "tbYearlyReport",
                theme: "dark",
                title: "Comparativo Anual",
                subtitle: "Comparación año actual vs anterior"
            }
        });
    }
}
