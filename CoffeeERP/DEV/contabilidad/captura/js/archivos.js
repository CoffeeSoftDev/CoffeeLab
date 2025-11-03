let api = 'ctrl/ctrl-archivos.php';
let app;
let modules, lsudn, counts, userLevel;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    modules   = data.modules;
    lsudn     = data.udn;
    counts    = data.counts;
    userLevel = data.userLevel;

    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "archivos";
    }

    render() {
        this.layout();
        this.filterBar();
        this.renderTotalCards();
        this.lsFiles();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full mb-3 p-3", id: `filterBar${this.PROJECT_NAME}` },
                container: { class: "w-full h-full p-2", id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#filterBar${this.PROJECT_NAME}`).prepend(`<div id="cardTotals" class="mb-5"></div>`);
    }

    filterBar() {
        const filterData = [
            {
                opc: "input-calendar",
                class: "col-sm-3",
                id: `calendar${this.PROJECT_NAME}`,
                lbl: "Rango de fechas:"
            },
            {
                opc: "select",
                id: "module",
                lbl: "Módulo:",
                class: "col-sm-3",
                data: [{ id: "", valor: "Mostrar todos los archivos" }, ...modules],
                onchange: `app.lsFiles()`
            }
        ];

        if (userLevel >= 3) {
            filterData.push({
                opc: "select",
                id: "udn",
                lbl: "Unidad de Negocio:",
                class: "col-sm-3",
                data: [{ id: "", valor: "Todas las UDN" }, ...lsudn],
                onchange: `app.lsFiles()`
            });
        }

       

        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: filterData
        });

        const dateType = userLevel === 1 ? 'simple' : 'all';
        
        dataPicker({
            parent: `calendar${this.PROJECT_NAME}`,
            type: dateType,
            onSelect: () => this.lsFiles()
        });
    }

    renderTotalCards() {
        this.infoCard({
            parent: "cardTotals",
            theme: "light",
            json: [
                {
                    id: "kpiTotal",
                    title: "Archivos totales",
                    data: {
                        value: counts.total || 0,
                        color: "text-[#103B60]"
                    }
                },
                {
                    id: "kpiVentas",
                    title: "Archivos de ventas",
                    data: {
                        value: counts.ventas || 0,
                        color: "text-green-600"
                    }
                },
                {
                    id: "kpiCompras",
                    title: "Archivos de compras",
                    data: {
                        value: counts.compras || 0,
                        color: "text-blue-600"
                    }
                },
                {
                    id: "kpiAlmacen",
                    title: "Archivos de almacén",
                    data: {
                        value: counts.almacen || 0,
                        color: "text-purple-600"
                    }
                },
                {
                    id: "kpiTesoreria",
                    title: "Archivos de tesorería",
                    data: {
                        value: counts.tesoreria || 0,
                        color: "text-orange-600"
                    }
                }
            ]
        });
    }

    lsFiles() {
        const rangePicker = getDataRangePicker(`calendar${this.PROJECT_NAME}`);
        const module = $(`#filterBar${this.PROJECT_NAME} #module`).val();
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { 
                opc: 'ls', 
                fi: rangePicker.fi, 
                ff: rangePicker.ff,
             
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 25 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
             
                center: [1, 5],
                right: [6]
            }
        });
    }

    async downloadFile(id) {
        try {
            const response = await useFetch({
                url: api,
                data: { opc: 'downloadFile', id: id }
            });

            if (response.status === 200) {
                window.open(response.url, '_blank');
                alert({
                    icon: "success",
                    text: "Descarga iniciada correctamente",
                    btn1: true,
                    btn1Text: "Aceptar"
                });
            } else {
                alert({
                    icon: "error",
                    text: response.message,
                    btn1: true,
                    btn1Text: "Ok"
                });
            }
        } catch (error) {
            alert({
                icon: "error",
                text: "Error de conexión. Intente nuevamente.",
                btn1: true,
                btn1Text: "Ok"
            });
        }
    }

    deleteFile(id) {
        this.swalQuestion({
            opts: {
                title: "¿Está seguro de querer eliminar el archivo?",
                text: "Esta acción no se puede deshacer y se registrará en el sistema.",
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
                        this.updateCounts();
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

    viewFile(id, path) {
        const fileUrl = '../../../' + path;
        window.open(fileUrl, '_blank');
    }

    async updateCounts() {
        const data = await useFetch({
            url: api,
            data: { opc: "getFileCounts" }
        });

        if (data.status === 200) {
            counts = data.data;
            this.renderTotalCards();
        }
    }

    // Components.

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
            ? "bg-[#1F2A37] text-white border rounded "
            : "bg-white text-gray-800 border rounded ";
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
                class: `text-2xl text-end font-bold ${card.data?.color || "text-gray-800"}`,
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
