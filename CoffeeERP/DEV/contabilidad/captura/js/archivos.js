let api = 'ctrl/ctrl-archivos.php';
let app, dashboardFiles, adminFiles;
let modules, lsudn, counts;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    modules = data.modules;
    lsudn = data.udn;
    counts = data.counts;

    app = new App(api, "root");
    dashboardFiles = new DashboardFiles(api, "root");
    adminFiles = new AdminFiles(api, "root");

    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "archivos";
    }

    render() {
        this.layout();
        dashboardFiles.render();
        adminFiles.render();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full", id: "filterBarArchivos" },
                container: { class: "w-full h-full", id: "containerArchivos" }
            }
        });

        this.headerBarUser({
            parent: `filterBarArchivos`,
            title: "📦 Módulo de Archivos",
            subtitle: "Gestiona y visualiza archivos del sistema.",
            onClick: () => app.render()
        });

        this.tabLayout({
            parent: `containerArchivos`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "short",
            json: [
                {
                    id: "ventas",
                    tab: "Ventas",
                    onClick: () => adminFiles.lsFiles()
                },
                {
                    id: "clientes",
                    tab: "Clientes",
                    onClick: () => adminFiles.lsFiles()
                },
                {
                    id: "admin",
                    tab: "Compras",
                    onClick: () => adminFiles.lsFiles()
                },
                {
                    id: "admin",
                    tab: "Salidas de almacén",
                    onClick: () => adminFiles.lsFiles()
                },
                {
                    id: "admin",
                    tab: "Pagos a proveedor",
                    onClick: () => adminFiles.lsFiles()
                },
                {
                    id: "admin",
                    tab: "Administrador de archivos",
                    active: true,
                    onClick: () => adminFiles.lsFiles()
                },
                {
                    id: "dashboard",
                    tab: "Dashboard",
                    class: "mb-1",
                  
                    onClick: () => dashboardFiles.renderDashboard()
                },
            
            ]
        });

        $('#content-tabsarchivos').removeClass('h-screen');
    }

    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Título por defecto",
            subtitle: "Subtítulo por defecto",
            icon: "icon-home",
            textBtn: "Inicio",
            classBtn: "bg-blue-600 hover:bg-blue-700",
            onClick: null
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "flex justify-between items-center px-2 pt-3 pb-3"
        });

        const leftSection = $("<div>").append(
            $("<h2>", {
                class: "text-2xl font-semibold",
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

    headerBarUser(options) {
        const defaults = {
            parent: "root",
            userName: "Usuario",
            userGreeting: "Bienvenido",
            userSubtitle: "Fecha de captura",
            captureDate: new Date().toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            icon: "icon-arrow-left",
            textBtn: "Menú principal",
            classBtn: "bg-[#2196F3] hover:bg-[#1976D2]",
            onClick: null
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200"
        });

        const leftSection = $("<div>", {
            class: "flex items-center gap-3"
        });

        const backButton = $("<button>", {
            class: `${opts.classBtn} text-white font-semibold px-3 py-2 rounded transition flex items-center gap-2`,
            html: `<i class="${opts.icon}"></i> ${opts.textBtn}`,
            click: () => {
                if (typeof opts.onClick === "function") {
                    opts.onClick();
                }
            }
        });

        const userInfo = $("<div>", {
            class: "ml-3"
        }).append(
            $("<h2>", {
                class: "text-lg font-semibold text-gray-800",
                text: `${opts.userGreeting}, ${opts.userName}`
            }),
            $("<p>", {
                class: "text-sm text-gray-500",
                text: opts.captureDate
            })
        );

        leftSection.append(backButton, userInfo);

        const rightSection = $("<div>", {
            class: "flex items-center gap-2"
        });

        const dateLabel = $("<div>", {
            class: "text-right"
        }).append(
            $("<p>", {
                class: "text-xs text-gray-500 mb-1",
                text: opts.userSubtitle
            }),
            $("<div>", {
                class: "flex items-center gap-2 bg-gray-50 border border-gray-300 rounded px-3 py-1"
            }).append(
                $("<input>", {
                    type: "date",
                    class: "bg-transparent border-none text-sm focus:outline-none",
                    value: new Date().toISOString().split('T')[0]
                }),
                $("<i>", {
                    class: "icon-calendar text-gray-600"
                })
            )
        );

        rightSection.append(dateLabel);

        container.append(leftSection, rightSection);
        $(`#${opts.parent}`).html(container);
    }
}

class DashboardFiles extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "dashboard";
    }

    render() {
        this.layout();
    }

    async layout() {
        this.dashboardComponent({
            parent: "container-dashboard",
            id: "dashboardComponent",
            title: "📊 Dashboard de Archivos",
            subtitle: "Resumen de archivos por módulo del sistema",
            json: []
        });

        this.filterBarDashboard();
        await this.renderDashboard();
    }

    filterBarDashboard() {
        this.createfilterBar({
            parent: `filterBarDashboard`,
            data: [
                {
                    opc: "select",
                    id: "module",
                    lbl: "Módulo",
                    class: "col-sm-3",
                    data: [{ id: "", valor: "Todos los módulos" }, ...modules],
                    onchange: `dashboardFiles.renderDashboard()`
                },
                {
                    opc: "input",
                    id: "search",
                    lbl: "Buscar archivo",
                    tipo: "texto",
                    class: "col-sm-6",
                    placeholder: "Nombre del archivo...",
                    onkeyup: `dashboardFiles.renderDashboard()`
                }
            ]
        });
    }

    async renderDashboard() {
        const countsData = await useFetch({
            url: api,
            data: { opc: "getFileCounts" }
        });

        this.showCards(countsData.data);
    }

    showCards(data) {
        this.infoCard({
            parent: "cardDashboard",
            theme: "light",
            json: [
                {
                    id: "kpiTotal",
                    title: "Archivos totales",
                    data: {
                        value: data.total,
                        color: "text-[#103B60]"
                    }
                },
                {
                    id: "kpiVentas",
                    title: "Archivos de ventas",
                    data: {
                        value: data.ventas,
                        color: "text-[#8CC63F]"
                    }
                },
                {
                    id: "kpiCompras",
                    title: "Archivos de compras",
                    data: {
                        value: data.compras,
                        color: "text-blue-600"
                    }
                },
                {
                    id: "kpiProveedores",
                    title: "Archivos de proveedores",
                    data: {
                        value: data.proveedores,
                        color: "text-orange-600"
                    }
                },
                {
                    id: "kpiAlmacen",
                    title: "Archivos de almacén",
                    data: {
                        value: data.almacen,
                        color: "text-purple-600"
                    }
                }
            ]
        });
    }

    dashboardComponent(options) {
        const defaults = {
            parent: "root",
            id: "dashboardComponent",
            title: "📊 Dashboard",
            subtitle: "Resumen del sistema",
            json: []
        };

        const opts = Object.assign(defaults, options);

        const container = $(`
        <div id="${opts.id}" class="w-full">
            <div class="p-6 border-b border-gray-200">
                <div class="mx-auto">
                    <h1 class="text-2xl font-bold text-[#103B60]">${opts.title}</h1>
                    <p class="text-sm text-gray-600">${opts.subtitle}</p>
                </div>
            </div>

            <div id="filterBarDashboard" class="mx-auto px-4 py-4"></div>

            <section id="cardDashboard" class="mx-auto px-4 py-4"></section>

            <section id="content-${opts.id}" class="mx-auto px-4 py-6 grid gap-6 lg:grid-cols-2"></section>
        </div>`);

        opts.json.forEach(item => {
            let block = $("<div>", {
                id: item.id,
                class: "bg-white p-4 rounded-xl shadow-md border border-gray-200 min-h-[200px]"
            });

            if (item.title) {
                block.prepend(`<h3 class="text-sm font-semibold text-gray-800 mb-3">${item.title}</h3>`);
            }

            $(`#content-${opts.id}`, container).append(block);
        });

        $(`#${opts.parent}`).html(container);
    }

    infoCard(options) {
        const defaults = {
            parent: "root",
            id: "infoCardKPI",
            class: "",
            theme: "light",
            json: []
        };
        const opts = Object.assign({}, defaults, options);
        const isDark = opts.theme === "dark";
        const cardBase = isDark
            ? "bg-[#1F2A37] text-white rounded-xl shadow"
            : "bg-white text-gray-800 rounded-xl shadow";
        const titleColor = isDark ? "text-gray-300" : "text-gray-600";

        const renderCard = (card, i = "") => {
            const box = $("<div>", {
                id: `${opts.id}_${i}`,
                class: `${cardBase} p-4`
            });
            const title = $("<p>", {
                class: `text-sm ${titleColor}`,
                text: card.title
            });
            const value = $("<p>", {
                id: card.id || "",
                class: `text-2xl font-bold ${card.data?.color || "text-gray-800"}`,
                text: card.data?.value
            });
            box.append(title, value);
            return box;
        };

        const container = $("<div>", {
            id: opts.id,
            class: `grid grid-cols-2 md:grid-cols-5 gap-4 ${opts.class}`
        });

        opts.json.forEach((item, i) => {
            container.append(renderCard(item, i));
        });

        $(`#${opts.parent}`).html(container);
    }
}

class AdminFiles extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "admin";
    }

    render() {
        this.layout();
        this.filterBarFiles();
        this.lsFiles();
    }

    layout() {
        this.primaryLayout({
            parent: `container-admin`,
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#container${this.PROJECT_NAME}`).prepend(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📦 Administrador de Archivos</h2>
                <p class="text-gray-400">Gestiona los archivos del sistema por módulo.</p>
            </div>
        `);
    }

    filterBarFiles() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "module",
                    lbl: "Mostrar archivos de",
                    class: "col-sm-2",
                    data: [{ id: "", valor: "Mostrar todas los archivos" }, ...modules],
                    onchange: `adminFiles.lsFiles()`
                },
                // {
                //     opc: "input",
                //     id: "search",
                //     lbl: "Buscar",
                //     tipo: "texto",
                //     class: "col-sm-6",
                //     placeholder: "Nombre del archivo...",
                //     onkeyup: `adminFiles.lsFiles()`
                // },
                {
                    opc: "button",
                    class: "col-sm-2",
                    id: "btnRefresh",
                    text: "Actualizar",
                    color_btn: "primary",
                    onClick: () => this.lsFiles()
                }
            ]
        });
    }

    lsFiles() {
        const module = $(`#filterBar${this.PROJECT_NAME} #module`).val();
        const search = $(`#filterBar${this.PROJECT_NAME} #search`).val();

        this.createTable({
            parent: `containeradmin`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'ls', module: module, search: search },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tbFiles`,
                theme: 'corporativo',
                title: '📋 Lista de Archivos',
                subtitle: 'Archivos registrados en el sistema',
                center: [0, 3]
            }
        });
    }

    deleteFile(id) {
        this.swalQuestion({
            opts: {
                title: "¿Está seguro de querer eliminar el archivo?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning"
            },
            data: {
                opc: "deleteFile",
                id: id
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                        this.lsFiles();
                        dashboardFiles.renderDashboard();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Ok"
                        });
                    }
                }
            }
        });
    }

    viewFile(id, src) {
        const fileUrl = '../../../' + src;
        window.open(fileUrl, '_blank');
    }

    downloadFile(id, src) {
        const fileUrl = '../../../' + src;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = src.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
