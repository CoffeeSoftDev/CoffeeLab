
// init vars.
let app, category, concept,order;
let api = "https://erp-varoch.com/DEV/capital-humano/ctrl/ctrl-rotacion-de-personal.php";
let api2 = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos-catalogo.php";
let data,idFolio;


$(function () {
    app = new App(api, "root");
    category = new Category(api, "root");
    concept = new Concept(api, "root");
    order = new Order(api, "root");
    // app.init();

    app.layoutPedidos();

    // render tabs content
    category.layout();
    concept.layout();
    order.layout();
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
    layoutPedidos(){

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
                },
                {
                    id: "order",
                    tab: "Capturar Información",
                    onClick: () => this.layoutCaptura(),
                    active: true,

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

    render(){
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
                    className:'w-100',
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
            center: [ 2],
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
            center: [ 2],
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
                    id: "anio",
                    class: "col-md-3",
                    lbl: "Año",
                    data: [
                        { id: "2025", valor: "2025" },
                        { id: "2024", valor: "2024" }
                    ],
                    onchange: "pedidos.lsPedidos()"
                },
                {
                    opc: "select",
                    id: "mes",
                    class: "col-md-3",
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
                    onchange: "pedidos.lsPedidos()"
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

    lsPedidos() {
        this.createCoffeTable({
            parent: "tabla-pedidos",
            id: "tbPedidos",
            theme: "corporativo",
            data: this.jsonPedidos(),
            center: [0, 8],
            right: [9]
        });
    }

    jsonPedidos() {
        return {
            row: [
                {
                    "Mes": "Enero 2025",
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
                    "Mes": "Febrero 2025",
                    "Llamada": 62,
                    "WhatsApp": 79,
                    "Facebook": 0,
                    "Meep": 5,
                    "Ecommerce": 15,
                    "Uber": 5,
                    "Otro": 1,
                    "Total": 167
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



