let api = 'ctrl/ctrl-productos-vendidos.php';
let app;
let udn, categorias;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    udn = data.udn;
    categorias = data.categorias;

    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "productosVendidos";
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsSoftRestaurant();
    }

    layout() {
        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full mb-3', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full h-full', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-sm-2",
                    data: udn,
                    onchange: "app.actualizarVista()"
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-sm-2",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: "app.actualizarVista()"
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-2",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: "app.actualizarVista()"
                },
                {
                    opc: "select",
                    id: "tipoReporte",
                    lbl: "Tipo de Reporte",
                    class: "col-sm-3",
                    data: [
                        { id: "1", valor: "Productos Vendidos (Soft Restaurant)" },
                        { id: "2", valor: "Desplazamiento (Costsys)" },
                        { id: "3", valor: "Productos Fogaza" }
                    ],
                    onchange: "app.cambiarVista()"
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnSubirCosto",
                    text: "Subir Costo Potencial",
                    onClick: () => this.subirCostoPotencial()
                }
            ]
        });

        const currentMonth = moment().month() + 1;
        setTimeout(() => {
            $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    cambiarVista() {
        const tipo = $(`#filterBar${this.PROJECT_NAME} #tipoReporte`).val();
        
        switch(tipo) {
            case "1":
                this.lsSoftRestaurant();
                break;
            case "2":
                this.lsCostsys();
                break;
            case "3":
                this.lsFogaza();
                break;
        }
    }

    actualizarVista() {
        this.cambiarVista();
    }

    lsSoftRestaurant() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📊 Productos Vendidos</h2>
                <p class="text-gray-400">Productos vendidos desde Soft Restaurant</p>
            </div>
            <div id="tabla-soft"></div>
        `);

        this.createTable({
            parent: 'tabla-soft',
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'ls' },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbSoft',
                theme: 'corporativo',
                title: 'Productos Vendidos',
                subtitle: 'Datos de Soft Restaurant',
                center: [1, 3],
                right: [4, 5, 6, 7]
            }
        });
    }

    lsCostsys() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">📈 Desplazamiento Costsys</h2>
                <p class="text-gray-400">Cálculo de desplazamiento desde Costsys</p>
            </div>
            <div id="tabla-costsys"></div>
        `);

        this.createTable({
            parent: 'tabla-costsys',
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsCostsys' },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbCostsys',
                theme: 'corporativo',
                title: 'Desplazamiento',
                subtitle: 'Datos de Costsys',
                center: [1, 3],
                right: [4, 5]
            }
        });
    }

    lsFogaza() {
        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold">🍞 Productos Fogaza</h2>
                <p class="text-gray-400">Productos específicos de Fogaza</p>
            </div>
            <div id="filterbar-fogaza" class="mb-3"></div>
            <div id="tabla-fogaza"></div>
        `);

        this.createfilterBar({
            parent: 'filterbar-fogaza',
            data: [
                {
                    opc: "select",
                    id: "categoria",
                    lbl: "Categoría",
                    class: "col-sm-3",
                    data: categorias,
                    onchange: "app.lsFogaza()"
                }
            ]
        });

        this.createTable({
            parent: 'tabla-fogaza',
            idFilterBar: 'filterbar-fogaza',
            data: { opc: 'lsFogaza' },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbFogaza',
                theme: 'corporativo',
                title: 'Productos Fogaza',
                subtitle: 'Productos por categoría',
                center: [1, 2],
                right: [3, 4, 5, 6]
            }
        });
    }

    async subirCostoPotencial() {
        this.swalQuestion({
            opts: {
                title: "¿Subir Costo Potencial?",
                text: "Se compararán los productos vendidos con el desplazamiento de Costsys y se subirán los costos potenciales.",
                icon: "warning"
            },
            data: { opc: "subirCostoPotencial" },
            methods: {
                send: async (response) => {
                    if (response.status === 200) {
                        this.mostrarResultados(response);
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    mostrarResultados(response) {
        const html = `
            <div class="p-4">
                <h3 class="text-lg font-bold mb-3">Resultados de Carga</h3>
                
                <div class="mb-4">
                    <h4 class="font-semibold text-green-600">✓ Productos Agregados (${response.total_agregados})</h4>
                    <ul class="list-disc pl-5">
                        ${response.agregados.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-semibold text-orange-600">⚠ Productos No Encontrados (${response.total_no_encontrados})</h4>
                    <ul class="list-disc pl-5">
                        ${response.no_encontrados.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        bootbox.alert({
            title: "Proceso Completado",
            message: html,
            size: 'large'
        });
    }

    async lsDiasPendientes() {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "lsDiasPendientes",
                udn: $(`#filterBar${this.PROJECT_NAME} #udn`).val(),
                anio: $(`#filterBar${this.PROJECT_NAME} #anio`).val()
            }
        });

        if (request.status === 200) {
            alert({
                icon: "info",
                title: "Días Pendientes",
                text: `Total de días pendientes: ${request.total_pendientes}`,
                btn1: true,
                btn1Text: "Ok"
            });
        }
    }

    async lsRegistros() {
        const fi = $('#fi').val();
        const ff = $('#ff').val();

        if (!fi || !ff) {
            alert({
                icon: "warning",
                text: "Selecciona un rango de fechas",
                btn1: true,
                btn1Text: "Ok"
            });
            return;
        }

        this.createTable({
            parent: `container${this.PROJECT_NAME}`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsRegistros', fi: fi, ff: ff },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbRegistros',
                theme: 'corporativo',
                title: 'Registros por Fecha',
                subtitle: `Del ${fi} al ${ff}`,
                center: [1, 3],
                right: [4]
            }
        });
    }
}
