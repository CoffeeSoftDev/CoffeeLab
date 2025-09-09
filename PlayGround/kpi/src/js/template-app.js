// Template básico de App
class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "MiAplicacion";
    }

    init() {
        this.render();
    }

    render(options = {}) {
        this.layout();
        this.filterBar();
        this.loadData();
    }

    layout() {
        this.tabsLayout({
            parent: "root",
            json: [
                {
                    tab: "Principal",
                    id: "mainTab",
                    contenedor: [
                        { class: "min-h-[10%] line", id: "filterBar" },
                        { class: "h-[83%] flex-grow line mt-2", id: "container" },
                    ],
                    active: true,
                },
            ],
        });
    }

    filterBar(options = {}) {
        this.createfilterBar({
            parent: "filterBar",
            data: [
                { 
                    opc: "select", 
                    class: "col-3", 
                    id: "filtro1", 
                    lbl: "Filtro 1: ", 
                    data: [
                        { id: 1, valor: 'Opción 1' },
                        { id: 2, valor: 'Opción 2' }
                    ] 
                },
                { 
                    opc: "input-calendar", 
                    class: "col-3", 
                    id: "calendar", 
                    lbl: "Fecha: " 
                },
            ],
        });

        // Inicializar el datepicker
        dataPicker({
            parent: "calendar",
            onSelect: (start, end) => {
                this.loadData();
            },
        });
    }

    async loadData(options = {}) {
        try {
            const response = await useFetch({ 
                url: this._link, 
                data: { 
                    opc: "getData",
                    ...options 
                } 
            });

            if (response.status === 200) {
                this.createTable({
                    parent: "container",
                    idFilterBar: "filterBar",
                    data: response.data,
                    conf: { 
                        datatable: true, 
                        pag: 10 
                    },
                    attr: {
                        class_table: "table table-bordered table-sm table-striped",
                        id: "mainTable",
                        center: [1, 2, 3],
                        extends: true,
                    },
                });
            } else {
                this.showError("Error al cargar los datos");
            }
        } catch (error) {
            this.showError("Error en la petición");
            console.error(error);
        }
    }

    showError(message) {
        alert({
            icon: "error",
            text: message,
            btn1: true,
            btn1Text: "Aceptar"
        });
    }

    showSuccess(message) {
        alert({
            icon: "success",
            text: message,
            timer: 1500
        });
    }
}

// Inicialización
$(async () => {
    const app = new App('tu-api-endpoint', 'root');
    app.init();
}); 