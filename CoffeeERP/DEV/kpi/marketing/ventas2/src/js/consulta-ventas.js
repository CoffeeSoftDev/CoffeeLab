let apiVentas = 'ctrl/ctrl-ventas2.php';
let app, lsudn;

$(async () => {
    const data = await useFetch({ url: apiVentas, data: { opc: "init" } });
    lsudn = data.udn;

    app = new ConsultaVentas(apiVentas, "root");
    app.render();
});

class ConsultaVentas extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "consultaVentas";
    }

    render() {
        this.layout();
        this.filterBar();
        this.listSales();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full mb-3", id: `filterBar${this.PROJECT_NAME}` },
                container: { class: "w-full h-full", id: `container${this.PROJECT_NAME}` }
            }
        });

        this.headerBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            title: "📊 Consulta de Ventas",
            subtitle: "Visualiza y gestiona las ventas diarias por unidad de negocio",
            onClick: () => this.redirectToHome()
        });
    }

    filterBar() {
        const filterContainer = $("<div>", {
            class: "bg-white rounded-lg shadow-sm p-4 mb-4"
        });

        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-sm-3",
                    data: lsudn,
                    onchange: `app.listSales()`,
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-sm-3",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: `app.listSales()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `app.listSales()`,
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnSubirInfo",
                    text: "Subir Información",
                    color_btn: "primary",
                    onClick: () => this.addSale(),
                },
            ],
        });

        const currentMonth = moment().month() + 1;
        setTimeout(() => {
            $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    listSales() {
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const anio = $(`#filterBar${this.PROJECT_NAME} #anio`).val();
        const mes = $(`#filterBar${this.PROJECT_NAME} #mes`).val();
        const monthText = $(`#filterBar${this.PROJECT_NAME} #mes option:selected`).text();

        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="bg-white rounded-lg shadow-sm p-4 mb-3">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-[#103B60]">📦 Ventas Diarias</h2>
                        <p class="text-gray-500 mt-1">Consulta y gestiona las ventas por categoría</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500">Período</p>
                        <p class="text-lg font-semibold text-[#103B60]">${monthText} ${anio}</p>
                    </div>
                </div>
            </div>
            <div id="container-table-ventas"></div>
        `);

        this.createTable({
            parent: "container-table-ventas",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { 
                opc: 'lsSales', 
               
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbVentasDiarias",
                theme: 'corporativo',
                title: `Ventas de ${monthText} ${anio}`,
                subtitle: 'Desglose detallado por categorías',
                center: [1, 2, 3, 4],
                right: [5, 6, 7]
            },
        });
    }

    addSale() {
        this.createModalForm({
            id: 'formSaleAdd',
            data: { opc: 'addSale' },
            bootbox: {
                title: '➕ Agregar Nueva Venta',
                closeButton: true,
                size: 'large'
            },
            json: this.jsonSale(),
            success: (response) => {
                if (response.status === 200) {
                    alert({
                        icon: "success",
                        title: "¡Éxito!",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Aceptar"
                    });
                    this.listSales();
                } else {
                    alert({
                        icon: "error",
                        title: "Error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Cerrar"
                    });
                }
            }
        });
    }

    async editSale(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getSale", id: id }
        });

        if (request.status === 200) {
            this.createModalForm({
                id: 'formSaleEdit',
                data: { opc: 'editSale', id: id },
                bootbox: {
                    title: '✏️ Editar Venta',
                    closeButton: true,
                    size: 'large'
                },
                autofill: request.data,
                json: this.jsonSale(),
                success: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            title: "¡Actualizado!",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                        this.listSales();
                    } else {
                        alert({
                            icon: "error",
                            title: "Error",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Cerrar"
                        });
                    }
                }
            });
        } else {
            alert({
                icon: "error",
                title: "Error",
                text: "No se pudieron obtener los datos de la venta",
                btn1: true,
                btn1Text: "Cerrar"
            });
        }
    }

    statusSale(id, active) {
        const action = active === 1 ? 'desactivar' : 'activar';
        const actionText = active === 1 ? 'desactivará' : 'activará';
        
        this.swalQuestion({
            opts: {
                title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} esta venta?`,
                text: `Esta acción ${actionText} el registro en el sistema`,
                icon: "warning",
                confirmButtonText: `Sí, ${action}`,
                cancelButtonText: "Cancelar"
            },
            data: {
                opc: "statusSale",
                id: id,
                active: active
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            title: "¡Actualizado!",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Aceptar"
                        });
                        this.listSales();
                    } else {
                        alert({
                            icon: "error",
                            title: "Error",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Cerrar"
                        });
                    }
                }
            }
        });
    }

    jsonSale() {
        return [
            {
                opc: "label",
                id: "lblInfo",
                text: "Información de la Venta",
                class: "col-12 fw-bold text-lg mb-2 border-b pb-2"
            },
            {
                opc: "select",
                id: "udn",
                lbl: "Unidad de Negocio",
                class: "col-12 col-md-6 mb-3",
                data: lsudn,
                text: "valor",
                value: "id"
            },
            {
                opc: "input",
                id: "fecha",
                lbl: "Fecha de Venta",
                type: "date",
                class: "col-12 col-md-6 mb-3"
            },
            {
                opc: "label",
                id: "lblDesglose",
                text: "Desglose por Categoría",
                class: "col-12 fw-bold text-lg mb-2 mt-3 border-b pb-2"
            },
            {
                opc: "input",
                id: "clientes",
                lbl: "Número de Clientes",
                tipo: "numero",
                class: "col-12 mb-3",
                onkeyup: "validationInputForNumber('#clientes')"
            },
            {
                opc: "input",
                id: "alimentos",
                lbl: "Ventas en Alimentos ($)",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                onkeyup: "validationInputForNumber('#alimentos')"
            },
            {
                opc: "input",
                id: "bebidas",
                lbl: "Ventas en Bebidas ($)",
                tipo: "cifra",
                class: "col-12 col-md-6 mb-3",
                onkeyup: "validationInputForNumber('#bebidas')"
            }
        ];
    }

    headerBar(options) {
        const defaults = {
            parent: "root",
            title: "Título por defecto",
            subtitle: "Subtítulo por defecto",
            icon: "icon-home",
            textBtn: "Inicio",
            classBtn: "border-2 border-blue-700 text-blue-600 hover:bg-blue-700 hover:text-white transition-colors duration-200",
            onClick: null,
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            class: "relative flex justify-center items-center px-4 py-4 bg-white rounded-lg shadow-sm mb-4"
        });

        const leftSection = $("<div>", {
            class: "absolute left-4"
        }).append(
            $("<button>", {
                class: `${opts.classBtn} font-semibold px-4 py-2 rounded-lg transition flex items-center`,
                html: `<i class="${opts.icon} mr-2"></i>${opts.textBtn}`,
                click: () => typeof opts.onClick === "function" && opts.onClick()
            })
        );

        const centerSection = $("<div>", {
            class: "text-center"
        }).append(
            $("<h2>", {
                class: "text-2xl font-bold text-[#103B60]",
                text: opts.title
            }),
            $("<p>", {
                class: "text-gray-500 mt-1",
                text: opts.subtitle
            })
        );

        container.append(leftSection, centerSection);
        $(`#${opts.parent}`).prepend(container);
    }

    redirectToHome() {
        const base = window.location.origin + '/ERP24';
        window.location.href = `${base}/kpi/marketing.php`;
    }
}
