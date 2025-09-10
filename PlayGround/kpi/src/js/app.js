
// init vars.
let app, category, concept, order, dashboard;
let api = "https://erp-varoch.com/DEV/capital-humano/ctrl/ctrl-rotacion-de-personal.php";
let api2 = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos-catalogo.php";
let data, idFolio;


$(function () {
    app = new App(api, "root");
    category = new Category(api, "root");
    concept = new Concept(api, "root");
    order = new Order(api, "root");
    dashboard = new Dashboard(api, "root");
    // app.init();

    app.layoutPedidos();

    // render tabs content
    category.layout();
    concept.layout();
    order.layout();
    dashboard.init();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Inicio";
    }

    init() {
        this.render();
    }

    render() {
        // this.layout();
        this.lsInicio();
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: "flex p-2 bg-white rounded",
            card: {
                filterBar: { class: "w-full ", id: `filterBar${this.PROJECT_NAME}` },
                container: { class: "w-full line mt-2", id: `container${this.PROJECT_NAME}` },
            },
        });

        this.renderTabsCostsSys();

    }

    lsInicio() {
        $('#root').empty();
        this.itemCardInicio({
            parent: `root`,
            title: "Panel principal",
            json: [
                {
                    titulo: "Ventas",
                    descripcion: "Consulta las métricas de ventas",
                    icon: "icon icon-dollar",
                    color: "bg-blue-200",
                    textColor: "text-blue-600",
                    onClick: () => this.layout(),

                },
                {
                    titulo: "Costsys",
                    descripcion: "Accede a reportes de costos",
                    icon: "  icon-food",
                    color: "bg-green-200",
                    textColor: "text-green-600",
                    onClick: () => this.layoutPedidos(),

                },
                {
                    titulo: "Pedidos y Redes",
                    descripcion: "Revisa pedidos y actividad social",
                    icon: " icon-truck-1",
                    color: "bg-purple-200",
                    textColor: "text-purple-600",
                    onClick: () => this.layoutPedidos(),

                }
            ]
        });
    }

    itemCardInicio(options) {
        const defaults = {
            parent: "cardInicioContainer",
            title: "",
            theme: "light",
            json: [],
        };

        const opts = Object.assign({}, defaults, options);
        const isDark = opts.theme === "dark";

        const colors = {
            cardBg: isDark ? "bg-[#2C3544]" : "bg-white",
            titleColor: isDark ? "text-white" : "text-gray-800",
            subtitleColor: isDark ? "text-gray-400" : "text-gray-500",
        };

        const titleContainer = $("<div>", {
            class: "w-full px-4 my-3",
        });

        const title = $("<h3>", {
            class: "text-xl font-semibold text-gray-800",
            text: opts.title || "Panel principal",
        });

        const subtitle = $("<p>", {
            class: "text-sm text-gray-500",
            text: opts.subtitle || "Consulta rápida de métricas clave del sistema",
        });

        titleContainer.append(title, subtitle);

        const container = $("<div>", {
            class: "w-full flex gap-4 flex-wrap justify-start p-4",
        });

        opts.json.forEach((item) => {
            let imgContent = "";

            if (item.icon) {
                imgContent = `
        <div class="w-14 h-14 flex items-center justify-center
          ${item.color || "bg-blue-600"}
          ${item.textColor || "text-white"}
          rounded-lg  text-xl">
          <i class="${item.icon}"></i>
        </div>`;
            } else if (item.imagen) {
                imgContent = `<img class="w-14 h-14 rounded-lg mb-3" src="${item.imagen}" alt="${item.titulo}">`;
            }

            const card = $(`
      <div class="group
                  w-full
                  lg:w-1/5 md:w-1/4 sm:w-1/2
                  h-[200px]
                  ${colors.cardBg}
                  rounded-lg
                  shadow-md
                  overflow-hidden
                  p-4
                  flex flex-col justify-between
                  cursor-pointer
                  border
                  transition-all
                  hover:shadow-xl
                  hover:scale-105">
        ${imgContent}
        <div class="flex-grow flex flex-col justify-center">
          <h2 class="text-lg font-bold ${colors.titleColor}">
            ${item.titulo}
          </h2>
          ${item.descripcion
                    ? `<p class="${colors.subtitleColor} text-sm">${item.descripcion}</p>`
                    : ""
                }
        </div>
      </div>
    `).click(() => {
                    if (item.enlace) window.location.href = item.enlace;
                    if (item.onClick) item.onClick();
                });

            container.append(card);
        });

        if (title) {
            $("#" + opts.parent).append(titleContainer, container);
        } else {
            $("#" + opts.parent).append(container);
        }
    }

    // kpi

    renderTabsCostsSys() {
        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabsCostsSys",
            // theme: "dark",
            type: "short",
            json: [
                {
                    id: "Dashboard",
                    tab: "Dashboard",
                    onClick: () => this.lsVentas(),
                },
                {
                    id: "ventasCategoria",
                    tab: "categor",
                    onClick: () => this.lsVentas(),
                },
                {
                    id: "ventasCategoria",
                    tab: "Costo Potencial",
                    onClick: () => this.lsVentas(),

                },
                {
                    id: "costosPotenciales",
                    tab: "Desplazamiento por Mes",
                    onClick: () => this.lsCostos(),

                },

                {
                    id: "ventasMes",
                    tab: "Ventas por Mes",
                    onClick: () => this.lsVentasMes(),
                    active: true

                }
            ]
        });

        $(`#filterBar${this.PROJECT_NAME}`).append(`
        <div class="px-4 pt-3 pb-3">
            <h2 class="text-2xl font-semibold text-gray-900">📊 Panel CostSys</h2>
            <p class="text-gray-400">Consulta y visualiza ventas, costos y desplazamientos.</p>
        </div>
        `);



        // Crear contenedores visibles por pestaña
        $("#ventasCategoria").html(`
            <div id="cardVentas" class="mb-4"></div>
            <div id="tablaVentasCategoria"></div>
        `);

        $("#costosPotenciales").html(`<div id="tablaCostos"></div>`);
        $("#desplazamiento").html(`<div id="tablaDesplazamiento"></div>`);
        $("#ventasMes").html(`<div id="tablaVentasMes"></div>`);
    }


    // pedidos y redes sociales.
    layoutPedidos() {

        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: "flex p-2 bg-white rounded",
            card: {
                filterBar: { class: "w-full ", id: `filterBar${this.PROJECT_NAME}` },
                container: { class: "w-full line mt-2", id: `container${this.PROJECT_NAME}` },
            },

        });

        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabsCostsSys",
            theme: "light",
            type: "short",
            json: [
                {
                    id: "dashboard",
                    tab: "Dashboard",
                    onClick: () => this.lsCategoria(),
                    active: true,

                },
                {
                    id: "order",
                    tab: "Capturar Información de pedidos",
                    onClick: () => this.layoutCaptura(),

                },

                {
                    id: "categoria",
                    tab: "Categoría",
                    onClick: () => this.lsCategoria(),
                },
                {
                    id: "Concept",
                    tab: "Conceptos",
                    onClick: () => this.lsConceptos(),

                },

            ],
        });


        $(`#filterBar${this.PROJECT_NAME}`).append(`
            <div class="flex justify-between items-center px-4 pt-3 pb-3">
                <div>
                    <h2 class="text-2xl font-semibold ">📊 Pedidos y Redes</h2>
                    <p class="text-gray-400">Consulta los pedidos y las redes sociales.</p>
                </div>
                <div>
                    <button id="btnBackHome" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition">
                        <i class="icon-home mr-2"></i>Inicio
                    </button>
                </div>
            </div>
        `);

        $("#btnBackHome").on("click", function () {
            app.init();
        });


    }





}


class Category extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Category";
    }

    render() {
        this.layout();


    }

    layout() {
        this.primaryLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            class: 'flex mx-2 my-2 h-100 mt-5 p-2',
            card: {
                filterBar: {
                    class: "w-full my-3",
                    id: "filterBarCategoria"
                },
                container: {
                    class: "w-full my-3 h-full bg-[#1F2A37] rounded-lg p-3",
                    id: "container-categoria"
                }
            }
        });

        // Encabezado
        $("#container-categoria").prepend(`
        <div class="px-4 pt-3 ">
            <h2 class="text-2xl font-semibold ">🏷️ Categorías</h2>
            <p class="text-gray-400">Administra las categorías de productos.</p>
        </div>`);

        this.filterBarCategory();
        this.lsCategory();


    }

    filterBarCategory() {
        const container = $("#container-categoria");
        container.append('<div id="filterbar-categoria" class="mb-3"></div><div id="tabla-categoria"></div>');

        this.createfilterBar({
            parent: "filterbar-categoria",
            data: [

                {
                    opc: "select",
                    id: "selectStatusCategoria",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Todos los estados" },
                        { id: "1", valor: "Activo" },
                        { id: "0", valor: "Inactivo" }
                    ],
                    onchange: "category.lsCategory()"
                },

                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    className: 'w-100',
                    id: "btnNuevaCategoria",
                    text: "Nueva Categoría",
                    onClick: () => this.addCategory(),
                },

            ],
        });
    }

    lsCategory() {
        // this.createTable({
        //     parent: "tabla-categoria",
        //     idFilterBar: "filterbar-categoria",
        //     data: { opc: "lsCategoria" },
        //     coffeesoft: true,
        //     conf: { datatable: true, pag: 10 },
        //     attr: {
        //         id: "tbCategoria",
        //         theme: 'dark',
        //         right: [2],
        //         center: [1]
        //     },
        // });

        this.createCoffeTable({
            parent: "tabla-categoria",
            id: "tbClientes",
            theme: "corporativo",
            data: this.jsonCategory(),
            center: [2],
            right: [4]
        });

    }

    jsonCategory() {
        return {
            "row": [
                {
                    "id": "152",
                    "Categoría": "Pedidos por redes",
                    "Estatus": {
                        html: '<span class="badge text-green-600 p-2">Activo</span>',
                        class: "text-center"
                    },
                    "a": [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    "id": "153",
                    "Categoría": "Ventas por redes sociales",
                    "Estatus": {
                        html: '<span class="badge text-red-600  p-2">Inactivo</span>',
                        class: "text-center"
                    },
                    "a": [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    "id": "153",
                    "Categoría": "Envios por Categoria",
                    "Estatus": {
                        html: '<span class="badge text-red-600  p-2">Inactivo</span>',
                        class: "text-center"
                    },
                    "a": [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                }
            ],
            "th": "0"
        };

    }

    addCategory() {
        this.createModalForm({
            id: 'formCategoriaAdd',
            data: { opc: 'addCategoria' },
            bootbox: {
                title: 'Agregar Categoría',
            },
            json: [
                {
                    opc: "input",
                    id: "nombre",
                    lbl: "Nombre de la categoría",
                    class: "col-12 mb-3"
                },
                {
                    opc: "select",
                    id: "estado",
                    lbl: "Estado",
                    class: "col-12 mb-3",
                    data: [
                        { id: "1", valor: "Activo" },
                        { id: "0", valor: "Inactivo" }
                    ]
                },
                {
                    opc: "textarea",
                    id: "descripcion",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsCategory();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }


    async editCategory(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getCategoria",
                id: id,
            },
        });

        const categoria = request.data;

        this.createModalForm({
            id: 'formCategoriaEdit',
            data: { opc: 'editCategoria', id: categoria.id },
            bootbox: {
                title: 'Editar Categoría',
            },
            autofill: categoria,
            json: [
                {
                    opc: "input",
                    id: "nombre",
                    lbl: "Nombre de la categoría",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                this.lsCategory();
            },
        });
    }

    statusCategory(id, active) {
        this.swalQuestion({
            opts: {
                title: "¿Desea cambiar el estado de la categoría?",
                text: "Esta acción activará o desactivará la categoría.",
                icon: "warning",
            },

            data: {
                opc: "statusCategoria",
                active: active === 1 ? 0 : 1,
                id: id,
            },

            methods: {
                success: () => {
                    this.lsCategory();
                }
            }
        });
    }
}

class Concept extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Concept";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            class: 'flex ',
            card: {
                filterBar: {
                    class: "w-full ",
                    id: "filterBarConcepto"
                },
                container: {
                    class: "w-full my-3 h-full  ",
                    id: "container-concepto"
                }
            }
        });

        // Encabezado
        $("#container-concepto").prepend(`
      <div class="px-3 ">
          <h2 class="text-2xl font-semibold">🧠 Conceptos</h2>
          <p class="text-gray-400">Administra los conceptos asignados a cada categoría.</p>
      </div>
    `);

        this.filterBarConcept();
        this.lsConcept();
    }

    filterBarConcept() {
        const container = $("#container-concepto");
        container.append('<div id="filterbar-concepto" class="mb-3"></div><div id="tabla-concepto"></div>');

        this.createfilterBar({
            parent: "filterbar-concepto",
            data: [
                {
                    opc: "select",
                    id: "selectStatusConcepto",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "", valor: "Todos los estados" },
                        { id: "1", valor: "Activo" },
                        { id: "0", valor: "Inactivo" }
                    ],
                    onchange: "concept.lsConcept()"
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    className: "w-100",
                    id: "btnNuevoConcepto",
                    text: "Nuevo Concepto",
                    onClick: () => this.addConcept(),
                }
            ],
        });
    }

    lsConcept() {
        this.createCoffeTable({
            parent: "tabla-concepto",
            id: "tbConcepto",
            theme: "corporativo",
            data: this.jsonConcept(),
            center: [2],
            right: [4]
        });

        simple_data_table("#tbConcepto", 5);
    }

    jsonConcept() {
        return {
            row: [
                {
                    id: "1",
                    "Concepto": "Entrega inmediata",
                    "Categoría": "Pedidos por redes",
                    "Estatus": {
                        html: '<span class="badge text-green-600 p-2">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "2",
                    "Concepto": "Requiere validación de stock",
                    "Categoría": "Ventas por redes sociales",
                    "Estatus": {
                        html: '<span class="badge text-red-600  p-2">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "3",
                    "Concepto": "Llamada",
                    "Categoría": "Atención al cliente",
                    "Estatus": {
                        html: '<span class="badge text-green-600 p-2">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "4",
                    "Concepto": "Whatsapp",
                    "Categoría": "Pedidos por redes",
                    "Estatus": {
                        html: '<span class="badge text-green-600 p-2">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "5",
                    "Concepto": "Facebook",
                    "Categoría": "Pedidos por redes",
                    "Estatus": {
                        html: '<span class="badge text-red-600  p-2">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "6",
                    "Concepto": "Mepp",
                    "Categoría": "Canales digitales",
                    "Estatus": {
                        html: '<span class="badge text-green-600 p-2">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "7",
                    "Concepto": "Ecommerce",
                    "Categoría": "Ventas por redes sociales	",
                    "Estatus": {
                        html: '<span class="badge text-red-600  p-2">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "8",
                    "Concepto": "Uber",
                    "Categoría": "Ventas por redes sociales	",
                    "Estatus": {
                        html: '<span class="badge text-green-600 p-2">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "9",
                    "Concepto": "Otro",
                    "Categoría": "Ventas por redes sociales	",
                    "Estatus": {
                        html: '<span class="badge text-red-600  p-2">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "10",
                    "Concepto": "Envio a Domicilio",
                    "Categoría": "Logística",
                    "Estatus": {
                        html: '<span class="badge text-green-600 p-2">Activo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                },
                {
                    id: "11",
                    "Concepto": "Pasaron a recoger",
                    "Categoría": "Logística",
                    "Estatus": {
                        html: '<span class="badge text-red-600  p-2">Inactivo</span>',
                        class: "text-center"
                    },
                    a: [
                        { html: '<i class="icon-pencil"></i>', class: 'btn btn-success p-1 me-1' },
                        { html: '<i class="icon-trash"></i>', class: 'btn btn-danger p-1' }
                    ]
                }
            ],
            th: "0"
        };

    }

    addConcept() {
        this.createModalForm({
            id: 'formConceptoAdd',
            data: { opc: 'addConcepto' },
            bootbox: {
                title: 'Agregar Concepto',
            },
            json: [
                {
                    opc: "input",
                    id: "nombre",
                    lbl: "Nombre del concepto",
                    class: "col-12 mb-3"
                },
                {
                    opc: "select",
                    id: "categoria_id",
                    lbl: "Categoría",
                    class: "col-12 mb-3",
                    data: [], // se llena en init() si aplicas fetch
                    text: "nombre",
                    value: "id"
                },
                {
                    opc: "select",
                    id: "estado",
                    lbl: "Estado",
                    class: "col-12 mb-3",
                    data: [
                        { id: "1", valor: "Activo" },
                        { id: "0", valor: "Inactivo" }
                    ]
                },
                {
                    opc: "textarea",
                    id: "descripcion",
                    lbl: "Descripción",
                    class: "col-12 mb-3"
                }
            ],
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsConcept();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }
}

class Order extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "order";
    }

    render() {
        this.layout();
    }

    layout() {
        this.primaryLayout({
            parent: `container-${this.PROJECT_NAME}`,
            id: this.PROJECT_NAME,
            class: 'flex  h-100 ',
            card: {
                filterBar: {
                    class: "w-full ",
                    id: "filterBarPedidos"
                },
                container: {
                    class: "w-full my-3 h-full  rounded-lg p-3",
                    id: "container-pedidos"
                }
            }
        });


        $("#container-order").prepend(`
        <div class="px-4 pt-3 ">
            <h2 class="text-xl font-bold ">PEDIDOS SONORA'S MEAT 2025</h2>
            <p class="text-gray-500 text-sm">Pedidos por canal para el análisis mensual.</p>
        </div>
        `);


        this.filterBarPedidos();
        this.lsPedidos();
    }

    filterBarPedidos() {
        $("#container-pedidos").prepend(`
      <div id="filterbar-pedidos" class="mb-3"></div>
      <div id="tabla-pedidos"></div>
    `);

        this.createfilterBar({
            parent: "filterbar-pedidos",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    class: "col-md-2",
                    lbl: "UDN",
                    data: [
                        { id: "4", valor: "SONORAS MEAT" },
                        { id: "5", valor: "BAOS" }
                    ],
                    onchange: "order.ls()"
                },
                {
                    opc: "select",
                    id: "anio",
                    class: "col-md-2",
                    lbl: "Año",
                    data: [
                        { id: "2025", valor: "2025" },
                        { id: "2024", valor: "2024" }
                    ],
                    onchange: "order.ls()"
                },
                {
                    opc: "select",
                    id: "mes",
                    class: "col-md-2",
                    lbl: "Mes",
                    data: [
                        { id: "01", valor: "Enero" },
                        { id: "02", valor: "Febrero" },
                        { id: "03", valor: "Marzo" },
                        { id: "04", valor: "Abril" },
                        { id: "05", valor: "Mayo" },
                        { id: "06", valor: "Junio" },
                        { id: "07", valor: "Julio" }
                    ],
                    onchange: "order.ls()"
                },
                {
                    opc: "select",
                    id: "report",
                    class: "col-md-3",
                    lbl: "Reporte",
                    data: [
                        { id: 1, valor: "RESUMEN DE PEDIDOS " },
                        { id: 2, valor: "RESUMEN DE VENTAS " },

                    ],
                    onchange: "order.ls()"
                },

                {
                    opc: "button",
                    class: "col-md-3",
                    className: "w-100",
                    id: "btnNuevoPedido",
                    text: "+ Nuevo registro de pedidos",
                    onClick: () => this.agregarPedidos()
                }
            ]
        });
    }

    ls() {
        console.log("Cargando datos de pedidos o ventas según selección...");
        const value = $("#report").val();
        switch (value) {
            case "1":
                this.lsPedidos();
                break;
            case "2":
                this.lsVentas();
                break;
            default:
                // Opcional: acción por defecto
                break;
        }

    }

    lsPedidos() {
        this.createCoffeTable({
            parent: "tabla-pedidos",
            id: "tbOrder",
            theme: "corporativo",
            data: this.jsonPedidos(),
            center: [2, 3, 4, 5, 6, 7, 8],
            color_group: 'bg-blue-100',
            right: [],
            left: []

        });
    }

    lsVentas() {
        this.createCoffeTable({
            parent: "tabla-pedidos",
            id: "tbOrder",
            theme: "corporativo",
            data: this.jsonVentas(),
            center: [2, 3, 4, 5, 6, 7, 8],
            color_group: 'bg-blue-100',
            right: [],
            left: []

        });
    }

    lsVentas() {
        this.createCoffeTable({
            parent: "tabla-pedidos",
            id: "tbOrderSales",
            theme: "corporativo",
            data: this.jsonVentas(),
            center: [2, 3, 4, 5, 6, 7, 8],
            color_group: 'bg-blue-100',
            right: [],
            left: []

        });
    }

    jsonPedidos() {
        return {
            row: [
                {
                    "Mes": "enero 2025",
                    "Llamada": 49,
                    "WhatsApp": 129,
                    "Facebook": 0,
                    "Meep": 10,
                    "Ecommerce": 8,
                    "Uber": 3,
                    "Otro": 0,
                    "Total": 199
                },
                {
                    "Mes": "febrero 2025",
                    "Llamada": 62,
                    "WhatsApp": 79,
                    "Facebook": 0,
                    "Meep": 5,
                    "Ecommerce": 15,
                    "Uber": 5,
                    "Otro": 1,
                    "Total": 167
                },
                {
                    "Mes": "marzo 2025",
                    "Llamada": 54,
                    "WhatsApp": 93,
                    "Facebook": 0,
                    "Meep": 11,
                    "Ecommerce": 17,
                    "Uber": 4,
                    "Otro": 0,
                    "Total": 179
                },
                {
                    "Mes": "abril 2025",
                    "Llamada": 51,
                    "WhatsApp": 86,
                    "Facebook": 0,
                    "Meep": 4,
                    "Ecommerce": 18,
                    "Uber": 4,
                    "Otro": 1,
                    "Total": 164
                },
                {
                    "Mes": "mayo 2025",
                    "Llamada": 53,
                    "WhatsApp": 107,
                    "Facebook": 0,
                    "Meep": 10,
                    "Ecommerce": 21,
                    "Uber": 4,
                    "Otro": 2,
                    "Total": 197
                },
                {
                    "Mes": "junio 2025",
                    "Llamada": 63,
                    "WhatsApp": 115,
                    "Facebook": 0,
                    "Meep": 10,
                    "Ecommerce": 21,
                    "Uber": 3,
                    "Otro": 0,
                    "Total": 212
                },
                {
                    "Mes": "julio 2025",
                    "Llamada": 48,
                    "WhatsApp": 100,
                    "Facebook": 0,
                    "Meep": 5,
                    "Ecommerce": 14,
                    "Uber": 3,
                    "Otro": 0,
                    "Total": 170
                },
                {
                    "Mes": "agosto 2025",
                    "Llamada": 96,
                    "WhatsApp": 95,
                    "Facebook": 0,
                    "Meep": 6,
                    "Ecommerce": 11,
                    "Uber": 5,
                    "Otro": 8,
                    "Total": 221,
                    'opc': 2
                },
                {
                    "Mes": "septiembre 2025",
                    "Llamada": 0,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otro": 0,
                    "Total": 0
                },
                {
                    "Mes": "octubre 2025",
                    "Llamada": 0,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otro": 0,
                    "Total": 0
                },
                {
                    "Mes": "noviembre 2025",
                    "Llamada": 0,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otro": 0,
                    "Total": 0
                },
                {
                    "Mes": "diciembre 2025",
                    "Llamada": 0,
                    "WhatsApp": 0,
                    "Facebook": 0,
                    "Meep": 0,
                    "Ecommerce": 0,
                    "Uber": 0,
                    "Otro": 0,
                    "Total": 0
                }
            ],
            th: "0"
        };
    }

    jsonVentas() {
        return {
            row: [
                {
                    "Mes": "enero 2025",
                    "Llamada": "$ 37,993.94",
                    "WhatsApp": "$ 132,110.11",
                    "Facebook": "-",
                    "Meep": "$ 8,808.85",
                    "Ecommerce": "$ 5,297.33",
                    "Uber": "$ 2,533.00",
                    "Otro": "-",
                    "Total": "$ 186,743.23"
                },
                {
                    "Mes": "febrero 2025",
                    "Llamada": "$ 32,423.93",
                    "WhatsApp": "$ 74,101.61",
                    "Facebook": "-",
                    "Meep": "$ 3,031.50",
                    "Ecommerce": "$ 16,157.11",
                    "Uber": "$ 2,792.00",
                    "Otro": "$ 1,482.95",
                    "Total": "$ 151,030.91"
                },
                {
                    "Mes": "marzo 2025",
                    "Llamada": "$ 49,707.99",
                    "WhatsApp": "$ 93,452.03",
                    "Facebook": "-",
                    "Meep": "$ 7,787.98",
                    "Ecommerce": "$ 13,396.59",
                    "Uber": "$ 2,979.00",
                    "Otro": "-",
                    "Total": "$ 167,863.59"
                },
                {
                    "Mes": "abril 2025",
                    "Llamada": "$ 44,572.98",
                    "WhatsApp": "$ 90,697.29",
                    "Facebook": "-",
                    "Meep": "$ 2,088.75",
                    "Ecommerce": "$ 16,834.65",
                    "Uber": "$ 3,489.00",
                    "Otro": "$ 1,920.00",
                    "Total": "$ 159,412.67"
                },
                {
                    "Mes": "mayo 2025",
                    "Llamada": "$ 50,089.68",
                    "WhatsApp": "$ 110,498.10",
                    "Facebook": "-",
                    "Meep": "$ 6,649.13",
                    "Ecommerce": "$ 18,732.73",
                    "Uber": "$ 1,635.00",
                    "Otro": "$ 2,306.00",
                    "Total": "$ 189,910.64"
                },
                {
                    "Mes": "junio 2025",
                    "Llamada": "$ 50,926.07",
                    "WhatsApp": "$ 129,174.49",
                    "Facebook": "-",
                    "Meep": "$ 10,169.68",
                    "Ecommerce": "$ 16,544.79",
                    "Uber": "$ 1,550.00",
                    "Otro": "$ 1,495.00",
                    "Total": "$ 211,859.63"
                },
                {
                    "Mes": "julio 2025",
                    "Llamada": "$ 48,606.35",
                    "WhatsApp": "$ 112,443.11",
                    "Facebook": "-",
                    "Meep": "$ 5,035.10",
                    "Ecommerce": "$ 12,479.43",
                    "Uber": "$ 1,385.00",
                    "Otro": "-",
                    "Total": "$ 179,948.99"
                },
                {
                    "Mes": "agosto 2025",
                    "Llamada": "$ 89,254.58",
                    "WhatsApp": "$ 105,373.77",
                    "Facebook": "-",
                    "Meep": "$ 6,366.70",
                    "Ecommerce": "$ 12,249.98",
                    "Uber": "$ 2,865.00",
                    "Otro": "$ 1,550.00",
                    "Total": "$ 217,660.03",
                    'opc': 2
                },
                {
                    "Mes": "septiembre 2025",
                    "Llamada": "-",
                    "WhatsApp": "-",
                    "Facebook": "-",
                    "Meep": "-",
                    "Ecommerce": "-",
                    "Uber": "-",
                    "Otro": "-",
                    "Total": "-"
                },
                {
                    "Mes": "octubre 2025",
                    "Llamada": "-",
                    "WhatsApp": "-",
                    "Facebook": "-",
                    "Meep": "-",
                    "Ecommerce": "-",
                    "Uber": "-",
                    "Otro": "-",
                    "Total": "-"
                },
                {
                    "Mes": "noviembre 2025",
                    "Llamada": "-",
                    "WhatsApp": "-",
                    "Facebook": "-",
                    "Meep": "-",
                    "Ecommerce": "-",
                    "Uber": "-",
                    "Otro": "-",
                    "Total": "-"
                },
                {
                    "Mes": "diciembre 2025",
                    "Llamada": "-",
                    "WhatsApp": "-",
                    "Facebook": "-",
                    "Meep": "-",
                    "Ecommerce": "-",
                    "Uber": "-",
                    "Otro": "-",
                    "Total": "-"
                }
            ],
            th: "0"
        };
    }

    agregarPedidos() {
        this.createModalForm({
            id: "formNuevoPedido",
            data: { opc: "addPedido" },
            bootbox: {
                title: "Agregar pedidos mensuales"
            },
            json: [
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-md-6 mb-3",
                    data: [
                        { id: "01", valor: "Enero" },
                        { id: "02", valor: "Febrero" },
                        { id: "03", valor: "Marzo" },
                        { id: "04", valor: "Abril" },
                        { id: "05", valor: "Mayo" },
                        { id: "06", valor: "Junio" },
                        { id: "07", valor: "Julio" }
                    ]
                },
                {
                    opc: "select",
                    id: "anio",
                    lbl: "Año",
                    class: "col-md-6 mb-3",
                    data: [
                        { id: "2025", valor: "2025" },
                        { id: "2024", valor: "2024" }
                    ]
                },
                { opc: "input", id: "llamada", lbl: "Llamada", class: "col-md-3 mb-3" },
                { opc: "input", id: "whatsapp", lbl: "WhatsApp", class: "col-md-3 mb-3" },
                { opc: "input", id: "facebook", lbl: "Facebook", class: "col-md-3 mb-3" },
                { opc: "input", id: "meep", lbl: "Meep", class: "col-md-3 mb-3" },
                { opc: "input", id: "ecommerce", lbl: "Ecommerce", class: "col-md-3 mb-3" },
                { opc: "input", id: "uber", lbl: "Uber", class: "col-md-3 mb-3" },
                { opc: "input", id: "otro", lbl: "Otro", class: "col-md-3 mb-3" }
            ],
            success: (response) => {
                alert({ icon: "success", text: "Registro agregado" });
                this.lsPedidos();
            }
        });
    }
}



class Dashboard extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Dashboard";
    }

    init(){
        this.renderDashboard();
    }

    renderDashboard() {

        // let udn = $('#filterBarDashboard #udn').val();
        // let month = $('#filterBarDashboard #mes').val();
        // let year = $('#filterBarDashboard #anio').val();

        // let mkt = await useFetch({
        //     url: api_marketing,
        //     data: {
        //         opc: "init",
        //         udn: udn,
        //         month: month,
        //         year: year,
        //     },
        // });

        $("#container-dashboard").html(`
            <div class=" font-sans  mx-auto">

            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                <h1 class="text-2xl font-bold text-[#103B60]">Dashboard de Ventas</h1>
                <p class="text-sm text-gray-600 mt-1 ">Análisis anual, por período y por hora</p>
                </div>
            </div>


            <!-- KPIs -->
            <div class=" p-4 my-2" id="containerKpi"></div>

            <!-- Resto del dashboard (gráficas, tabla, etc.) -->
            <h2 class="text-lg font-semibold text-[#103B60] mt-3">
                Promedios Diarios (Comparativa Anual)
            </h2>

            <div class="grid lg:grid-cols-2 gap-4 mb-2">
            <!-- Cheque Promedio A & B -->
            <div class="bg-white rounded-lg shadow-sm p-3 !h-auto" id="containerBar"></div>

            <!-- Ventas por Categoría -->
            <div class="bg-white rounded-lg shadow-sm p-3 " id="cardCategorias">
              <div id="containerVentas" class="overflow-auto max-h-[90vh]"></div>
            </div>
            </div>

            <div class="bg-white rounded-xl shadow overflow-auto">
                <div class="p-4 border-b border-gray-200 text-lg font-semibold text-[#103B60]">
                Qué se vendió
                </div>

            </div>
        `);


        this.cardsDashboard({
            parent: "containerKpi", // Cambia esto por el contenedor real
            id: "cardsPedidos",
            class: "mb-6",
            theme: "light",
            json: [
                {
                    title: "Ingresos Totales",
                    data: {
                        value: "$1,464,429.69",
                        description: "📈 21.0% vs mes anterior",
                        color: "text-green-700"
                    }
                },
                {
                    title: "Total Pedidos",
                    data: {
                        value: "1,509",
                        description: "Enero - Agosto 2025",
                        color: "text-orange-800"
                    }
                },
                {
                    title: "Valor Promedio",
                    data: {
                        value: "$970",
                        description: "Por pedido",
                        color: "text-blue-700"
                    }
                },
                {
                    title: "Canal Principal",
                    data: {
                        value: "WhatsApp",
                        description: "57.9% del total",
                        color: "text-green-800"
                    }
                }
            ]
        });

        this.barChart({ parent: 'containerBar', data: this.jsonBar()});


    }



    cardsDashboard(options) {
        const defaults = {
            parent: "root",
            id: "infoCardKPI",
            class: "",
            theme: "light", // light | dark
            json: [],
            data: {
                value: "0",
                description: "",
                color: "text-gray-800"
            },
            onClick: () => { }
        };

        const opts = Object.assign({}, defaults, options);

        const isDark = opts.theme === "dark";

        const cardBase = isDark
            ? "bg-[#1F2A37] text-white rounded-xl shadow"
            : "bg-white text-gray-800 rounded-xl shadow";

        const titleColor = isDark ? "text-gray-300" : "text-gray-600";
        const descColor = isDark ? "text-gray-400" : "text-gray-500";

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
                class: `text-2xl font-bold ${card.data?.color || "text-white"}`,
                text: card.data?.value
            });

            const description = $("<p>", {
                class: `text-xs mt-1 ${card.data?.color || descColor}`,
                text: card.data?.description
            });

            box.append(title, value, description);
            return box;
        };

        const container = $("<div>", {
            id: opts.id,
            class: `grid grid-cols-2 md:grid-cols-4 gap-4 ${opts.class}`
        });

        if (opts.json.length > 0) {
            opts.json.forEach((item, i) => {
                container.append(renderCard(item, i));
            });
        } else {
            container.append(renderCard(opts));
        }

        $(`#${opts.parent}`).html(container);
    }

    barChart(options) {
        const defaults = {
            parent: "containerChequePro",
            id: "chart",
            title: "Comparativa Cheque Promedio",
            class: "border p-4 rounded-xl",
            data: {},
            json: [],
            onShow: () => { },
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", { class: opts.class });

        const title = $("<h2>", {
            class: "text-lg font-bold mb-2",
            text: opts.title
        });

        const canvas = $("<canvas>", {
            id: opts.id,
            class: "w-full h-[300px]"
        });

        container.append(title, canvas);
        $('#' + opts.parent).html(container);

        const anioA = new Date().getFullYear();
        const anioB = anioA - 1;

        const dCheque = {
            labels: ["A&B", "Alimentos", "Bebidas"],
            A: [673.18, 613.0, 54.6],
            B: [640.25, 590.5, 49.75]
        };

        const ctx = document.getElementById(opts.id).getContext("2d");

        if (window._chq) window._chq.destroy();

        window._chq = new Chart(ctx, {
            type: "bar",
            data: opts.data,
            options: {
                responsive: true,
                animation: {
                    onComplete: function () {
                        const chart = this;
                        const ctx = chart.ctx;
                        ctx.font = "12px sans-serif";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "bottom";
                        ctx.fillStyle = "#000";

                        chart.data.datasets.forEach(function (dataset, i) {
                            const meta = chart.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                const value = dataset.data[index];
                                const label = typeof formatPrice === "function" ? formatPrice(value) : value;
                                ctx.fillText(label, bar.x, bar.y - 5);
                            });
                        });
                    }
                },
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${formatPrice(ctx.parsed.y)}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (v) => formatPrice(v)
                        }
                    }
                }
            }
        });
    }

    jsonBar(){
        return  {
            labels: [
                "enero 2025", "febrero 2025", "marzo 2025", "abril 2025", "mayo 2025",
                "junio 2025", "julio 2025", "agosto 2025", "septiembre 2025", "octubre 2025",
                "noviembre 2025", "diciembre 2025"
            ],
            datasets: [
                {
                    label: "Ecommerce",
                    data: [5, 3, 4, 6, 7, 6, 4, 7, 0, 0, 0, 0],
                    backgroundColor: "#4CAF50"
                },
                {
                    label: "Meep",
                    data: [7, 6, 8, 6, 6, 6, 5, 6, 0, 0, 0, 0],
                    backgroundColor: "#FFEB3B"
                },
                {
                    label: "Facebook",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "#9E9E9E"
                },
                {
                    label: "WhatsApp",
                    data: [201, 190, 187, 211, 212, 213, 192, 215, 0, 0, 0, 0],
                    backgroundColor: "#FF5722"
                },
                {
                    label: "Llamada",
                    data: [0, 2, 0, 4, 2, 4, 0, 3, 0, 0, 0, 0],
                    backgroundColor: "#2196F3"
                }
            ]
        };

    }



}

