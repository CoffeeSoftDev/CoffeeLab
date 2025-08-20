let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';
let api = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos-catalogo.php";
let app;
let modifier, products;
let idFolio;

$(async () => {

    // const data = await useFetch({ url: api, data: { opc: "init" } });
    // modifier = data.modifier;
    // products = data.products;
    // idFolio  = data.products;
    app = new App(api, 'root');
    app.init();
    // sub.init();
});

class App extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Order";
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        this.layoutPos();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "flex mx-2 my-2 mt-5 p-2",
            card: {
                filterBar: {
                    id: "filterBar" + this.PROJECT_NAME,
                    class: "w-full my-3"
                },
                container: {
                    class: "w-full my-3 bg-[#1F2A37] rounded-lg p-4",
                },
            },
        });

        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabsPedido",
            theme: "dark",
            type: "short",
            content: { class: "" },
            json: [
                {
                    id: "datos",

                    tab: "Datos del pedido",
                },
                {
                    id: "package",
                    active: true,

                    tab: "Paquetes",
                },
            ],
        });

        // this.createPOSContainers({
        //     parent: "container-package",
        //     id: "pedido",
        //     onChange: (item) => {
        //         this.searchFilter({ parent: 'searchProduct' })
        //     }
        // });

        // this.createProductTabs({ data: modifier });

        // this.createProductGrid({
        //     data: products,
        //     onClick: (request) => {

        //     }
        // });

        // this.createOrderPanel();

    }


    async layoutPos() {

        const pos = await useFetch({ url: api, data: { opc: "init" } });
        idFolio = pos.id;

        this.createPOSContainers({
            parent: "container-package",
            id: "pedido",
            onChange: (item) => {
                this.searchFilter({ parent: 'searchProduct' })
            }
        });

        this.createProductTabs({ data: pos.modifier,

        onChange: (category) => {
            console.log('>',category);
            this.listProduct(category)
        }

        });

        this.createProductGrid({
            data: pos.products,
            onClick: (item) => {
                this.addProduct(item.id)
            }
        });

        this.createOrderPanel();

    }

    createPOSContainers(options) {
        const opts = Object.assign({
            parent: "container-package",
            id: "posLayout",
            theme: "dark", // 'light' | 'dark'
            class: "flex text-sm h-100 text-white gap-3 ",
            onChange: (item) => { }
        }, options);

        const isDark = opts.theme === "dark";

        const colors = {
            containerBg: isDark ? "" : "bg-white",
            textColor: isDark ? "text-white" : "text-gray-600",
            leftPaneBg: isDark ? "bg-[#1F2A37]" : "bg-gray-100",
            inputBg: isDark ? "bg-[#111827]" : "bg-white",
            borderColor: isDark ? "border-gray-700" : "border-gray-300",
            cardGridBg: isDark ? "bg-[#111827]" : "bg-white",
            tabBg: isDark ? "" : "bg-gray-100"
        };

        // 📦 Container principal
        const container = $("<div>", {
            id: opts.id,
            class: `${opts.class} ${colors.containerBg} ${colors.textColor}`
        });

        // 🟩 Left Pane
        const leftPane = $("<div>", {
            class: `flex-1 flex sm:w-[60%] flex-col rounded-xl overflow-hidden ${colors.leftPaneBg}  ${colors.borderColor} shadow-md`
        });

        // 🔍 Contenedor de búsqueda
        const searchContainer = $("<div>", {
            class: `p-3 flex items-center justify-between space-x-2  ${colors.borderColor}`
        });

        const searchInputWrap = $("<div>", {
            class: "relative w-full md:w-[20rem]"
        });

        const inputSearch = $("<input>", {
            id: "searchProduct",
            type: "text",
            placeholder: "Buscar productos...",
            class: `pl-10 py-2 pr-3 rounded-md border ${colors.borderColor} ${colors.inputBg} ${colors.textColor} w-full focus:outline-none focus:ring-2 focus:ring-blue-500`
        }).on("input", function () {
            const keyword = $(this).val().toLowerCase();
            opts.onChange(keyword);
        });

        const searchIcon = $("<i>", {
            class: `icon-search absolute left-3 top-2 ${isDark ? "text-gray-400" : "text-gray-500"}`
        });

        searchInputWrap.append(inputSearch, searchIcon);
        searchContainer.append(searchInputWrap);

        // 🔽 Área visual de tabs de categoría (temporal)
        const categoryTabs = $("<div>", {
            id: "categoryTabs",
            class: `${colors.textColor} p-4 ${colors.tabBg} mb-2 text-center ${colors.borderColor}`,
            text: "Tabs Categoría"
        });

        // 🧁 Contenedor de cards
        const productGridContainer = $("<div>", {
            class: "flex-1 overflow-auto p-3"
        });

        const grid = $("<div>", {
            id: "productGrid",
            class: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4  ${colors.borderColor} p-4 rounded ${colors.cardGridBg}`
        });

        productGridContainer.append(grid);

        // Ensamblar left pane
        leftPane.append(searchContainer, categoryTabs, productGridContainer);

        // 🟥 Ticket
        const rightPane = $("<div>", {
            id: "orderPanel",
            class: `w-full xs:w-[40%] md:w-[27rem] flex flex-col ${colors.leftPaneBg} ${colors.borderColor} rounded-xl shadow-md`,
        });

        container.append(leftPane, rightPane);
        $(`#${opts.parent}`).html(container);
    }

    createProductTabs(options) {
        const opts = Object.assign({
            parent: "categoryTabs",
            data: [
                { text: "Chocolate", id: "chocolate", icon: "icon-cake" },
                { text: "Frutas", id: "frutas", emoji: "🍓" },
                { text: "Queso", id: "queso" },
                { text: "Merengue", id: "merengue" },
                { text: "Todos", id: "todos" }
            ],
            active: null, // Si es null, se activa el primero
            activeColor: "bg-blue-600",
            inactiveColor: "", // auto-definido por tema
            hoverColor: "",
            theme: "dark",
            onChange: (category) => { }
        }, options);

        const isDark = opts.theme === "dark";
        const hoverClass = opts.hoverColor || (isDark ? "hover:bg-[#1E293B]" : "hover:bg-gray-300");
        const inactiveColor = opts.inactiveColor || (isDark ? "bg-gray-700" : "bg-gray-200");
        const textColor = isDark ? "text-white" : "text-gray-800";

        const container = $(`#${opts.parent}`).empty().addClass("flex gap-2 flex-wrap px-4 py-2 mt-2 rounded-md");

        // Aseguramos que siempre haya uno activo
        const defaultActiveId = opts.active ?? (opts.data.length > 0 ? opts.data[0].id : null);

        opts.data.forEach((cat, index) => {
            const isActive = cat.id === defaultActiveId;

            // Icono o emoji opcional
            let prefix = "";
            if (cat.icon) prefix = `<i class="${cat.icon} mr-1"></i>`;
            else if (cat.emoji) prefix = `${cat.emoji} `;

            const formattedText = cat.text.charAt(0).toUpperCase() + cat.text.slice(1).toLowerCase();

            const btn = $("<button>", {
                class: `tab-btn flex-1 ${textColor} px-2 py-2 rounded-lg text-sm transition-colors duration-200 text-center ${isActive ? opts.activeColor : `${inactiveColor} ${hoverClass}`}`,
                html: `${prefix}${formattedText}`,
                "data-category": cat.id,
                click: function () {
                    container.find(".tab-btn").each(function () {
                        $(this)
                            .removeClass(opts.activeColor)
                            .removeClass(inactiveColor)
                            .removeClass(hoverClass)
                            .addClass(`${inactiveColor} ${hoverClass}`);
                    });

                    $(this)
                        .removeClass(inactiveColor)
                        .removeClass(hoverClass)
                        .addClass(opts.activeColor);

                    // Callback general
                    opts.onChange(cat.id);

                    // Callback individual si existe
                    if (typeof cat.onClick === "function") {
                        cat.onClick(cat.id);
                    }
                }
            });

            container.append(btn);
        });
    }

    createProductGrid(options) {
        const defaults = {
            parent: "productGrid",
            data: [],
            theme: "dark",
            icon: "icon-star",
            onClick: (item) => { }
        };

        const opts = Object.assign(defaults, options);

        const isDark = opts.theme === "dark";
        const cardBg = isDark ? "bg-[#111827]" : "bg-white";
        const borderColor = isDark ? "border-gray-700" : "border-gray-300";
        const textColor = isDark ? "text-white" : "text-gray-800";
        const priceColor = isDark ? "text-blue-300" : "text-blue-600";
        const buttonColor = "bg-blue-600 hover:bg-blue-700";

        const container = $(`#${opts.parent}`).empty();
        const baseUrl = "https://huubie.com.mx/";

        opts.data.forEach(item => {
            const card = $("<div>", {
                class: `${cardBg} border ${borderColor} rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 card`,
                click: () => opts.onClick(item)
            });

            // Imagen o ícono
            const imageWrap = $("<div>", {
                class: "bg-gray-800 h-28 flex items-center justify-center"
            });

            if (item.image && item.image.trim() !== "") {

                imageWrap.append(
                    $("<img>", {
                        src: baseUrl + item.image,
                        alt: item.name,
                        class: "object-cover h-full w-full"
                    })
                );

            } else {
                imageWrap.append(
                    $("<i>", {
                        class: `${item.icon || opts.icon} text-3xl text-gray-500`
                    })
                );
            }

            const body = $("<div>", { class: "p-2" }).append(
                $("<h3>", {
                    class: `${textColor} text-sm font-medium truncate`,
                    text: item.name ?? item.valor
                }),
                $("<p>", {
                    class: `${priceColor} font-semibold text-sm mt-1`,
                    text: `${formatPrice(item.price)}`
                }),
                $("<div>", { class: "text-right mt-1" }).append(
                    $("<button>", {
                        class: `inline-block ${buttonColor} text-white rounded px-2 py-1 text-xs`,
                        html: `<i class="icon-eye"></i>`,
                        click: (e) => {
                            e.stopPropagation();
                            opts.onClick(item);
                        }
                    })
                )
            );

            card.append(imageWrap, body);
            container.append(card);
        });
    }

    posLayout(options) {
        const defaults = {
            parent: "container-package",
            id: "posLayout",
            class: "flex text-sm text-white gap-4 p-4 bg-[#0F172A]",
            data: [],
            json: [],
            onAdd: () => { },
            onGet: () => { },
            onDelete: () => { }
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            id: opts.id,
            class: opts.class
        });

        const leftPane = $("<div>", {
            class: "flex-1 flex flex-col rounded-xl overflow-hidden bg-[#1F2A37]  shadow-md"
        });

        const rightPane = $("<div>", {
            class: "w-full md:w-[27rem] flex flex-col bg-[#1F2A37]  rounded-xl shadow-md"
        });

        const headerRight = $("<div>", {
            class: "p-2 border-gray-700 flex justify-between items-center"
        }).append(
            $("<h2>", {
                class: "text-lg font-semibold text-white",
                text: "Orden Actual"
            }),
            $("<button>", {
                id: "clearOrder",
                class: "text-red-400 border border-[#C53030] px-2 py-1 rounded hover:bg-red-700",
                html: "🗑 Limpiar",
                click: () => {
                    $("#orderItems").html("");
                    $("#subtotal").text("$0.00");
                    $("#tax").text("$0.00");
                    $("#total").text("$0.00");
                }
            })
        );

        const orderItems = $("<div>", {
            id: "orderItems",
            class: "flex-1 overflow-auto p-3 space-y-3"
        });

        const totals = $("<div>", {
            class: "p-4 border-t border-gray-700 bg-[#333D4C]"
        }).append(
            $("<div>", { class: "space-y-1 text-sm text-gray-300" }).append(
                $("<div>", { class: "flex justify-between" }).append(
                    $("<span>").text("Subtotal:"),
                    $("<span>", { id: "subtotal", text: "$0.00" })
                ),
                $("<div>", { class: "flex justify-between" }).append(
                    $("<span>").text("IVA (16%):"),
                    $("<span>", { id: "tax", text: "$0.00" })
                ),
                $("<div>", { class: "border-t my-2 border-gray-700" }),
                $("<div>", { class: "flex justify-between font-bold text-blue-400" }).append(
                    $("<span>").text("Total:"),
                    $("<span>", { id: "total", text: "$0.00" })
                )
            ),
            $("<div>", { class: "grid grid-cols-2 gap-2 mt-4" }).append(
                $("<button>", {
                    class: "border border-gray-600 text-white rounded px-3 py-2 text-sm",
                    html: "🖨 Imprimir"
                }),
                $("<button>", {
                    class: "bg-blue-700 text-white rounded px-3 py-2 text-sm hover:bg-blue-800",
                    html: "Cobrar"
                })
            )
        );

        const searchContainer = $("<div>", {
            class: "p-4 flex items-center justify-between space-x-2 border-gray-700 bg-[#111827]"
        });

        const searchInputWrap = $("<div>", {
            class: "relative w-full md:w-[20rem]"
        });

        const inputSearch = $("<input>", {
            id: "searchProduct",
            type: "text",
            placeholder: "Buscar productos...",
            class: "pl-10 py-2 pr-3 rounded-md border border-gray-700 bg-[#111827] text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        });

        const searchIcon = $("<i>", {
            class: "icon-search absolute left-3 top-3 text-gray-400"
        });

        const btnPastel = $("<button>", {
            id: "btnArmarPastel",
            class: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2",
            text: "¡Arma tu pastel! 🎂"
        });

        const tabs = $("<div>", {
            id: "categoryTabs",
            class: "px-4 py-3 flex gap-2 flex-wrap border-b border-gray-700 bg-[#1E293B]"
        });

        const categories = [
            { text: "☕ Chocolate", category: "chocolate" },
            { text: "🍇 Frutas", category: "frutas" },
            { text: "🧀 Queso", category: "queso" },
            { text: "🍰 Merengue", category: "merengue" },
            { text: "🎂 Todos", category: "todos" },
        ];

        categories.forEach(c => {
            const btn = $("<button>", {
                class: "tab-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg",
                text: c.text,
                "data-category": c.category
            });
            tabs.append(btn);
        });

        const productGridContainer = $("<div>", {
            class: "flex-1 overflow-auto p-4"
        });

        const grid = $("<div>", {
            id: "productGrid",
            class: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        });

        const sampleData = opts.data.length > 0 ? opts.data : [
            {
                id: 1,
                name: "Pastel de Chocolate",
                price: "25.00",
                image: "https://www.casadulce.com.mx/wp-content/uploads/2019/09/chocolate-extremo-grande.jpg"
            },
            {
                id: 2,
                name: "Pastel Negro por Siempre",
                price: "35.00",
                image: "https://lospastelesdelaura.com/wp-content/uploads/2020/06/2020-04-17-Chocolate-Chocolate-Drip-Cake.jpeg"
            },
            {
                id: 3,
                name: "Bosque de Chocolate",
                price: "40.00",
                image: "https://img.freepik.com/fotos-premium/tarta-rollo-troncos-navidad-navidad_1148901-918.jpg"
            },
        ];

        sampleData.forEach((item) => {
            const card = $("<div>", {
                class: "bg-[#111827] border border-gray-700 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
            });

            const imageWrap = $("<div>", {
                class: "bg-gray-800 h-32 flex items-center justify-center"
            }).append(
                $("<img>", {
                    src: item.image,
                    alt: item.name,
                    class: "object-cover h-full w-full"
                })
            );

            const body = $("<div>", {
                class: "p-3"
            }).append(
                $("<h3>", {
                    class: "text-white text-sm font-medium truncate",
                    text: item.name
                }),
                $("<p>", {
                    class: "text-blue-300 font-semibold text-sm mt-1",
                    text: `$${item.price}`
                }),
                $("<div>", {
                    class: "text-right mt-2"
                }).append(
                    $("<button>", {
                        class: "inline-block bg-blue-600 text-white rounded px-2 py-1 text-xs",
                        html: '<i class="icon-eye"></i>',
                        click: () => opts.onGet(item.id)
                    })
                )
            );

            card.append(imageWrap, body);
            grid.append(card);
        });

        // Ensamblaje
        searchInputWrap.append(inputSearch, searchIcon);
        searchContainer.append(searchInputWrap, btnPastel);
        productGridContainer.append(grid);
        leftPane.append(searchContainer, tabs, productGridContainer);

        rightPane.append(headerRight, orderItems, totals);
        container.append(leftPane, rightPane);

        $(`#${opts.parent}`).html(container);
    }

    createOrderPanel(options) {
        const opts = Object.assign({
            parent: "orderPanel", // ID donde se monta
            title: "Orden Actual",
            onClear: () => {
                // lógica externa que puedes conectar
            }
        }, options);

        const container = $(`#${opts.parent}`).empty();

        // 🧾 Header
        const header = $("<div>", {
            class: "p-4 border-b border-gray-700 flex justify-between items-center"
        }).append(
            $("<h2>", {
                class: "text-lg font-semibold text-white",
                text: opts.title
            }),
            $("<button>", {
                class: "text-red-400 border border-[#C53030] px-2 py-1 rounded hover:bg-red-700",
                html: "🗑 Limpiar",
                click: opts.onClear
            })
        );

        // 📦 Lista de productos agregados
        const orderItems = $("<div>", {
            id: "orderItems",
            class: "flex-1 overflow-auto p-3 space-y-3"
        });

        // 💰 Totales
        const totals = $("<div>", {
            class: "p-4 border-t border-gray-700 bg-[#333D4C]"
        }).append(
            $("<div>", { class: "space-y-1 text-sm text-gray-300" }).append(
                $("<div>", { class: "flex justify-between" }).append(
                    $("<span>").text("Subtotal:"),
                    $("<span>", { id: "subtotal", text: "$0.00" })
                ),
                $("<div>", { class: "flex justify-between" }).append(
                    $("<span>").text("IVA (16%):"),
                    $("<span>", { id: "tax", text: "$0.00" })
                ),
                $("<div>", { class: "border-t my-2 border-gray-700" }),
                $("<div>", { class: "flex justify-between font-bold text-blue-400" }).append(
                    $("<span>").text("Total:"),
                    $("<span>", { id: "total", text: "$0.00" })
                )
            ),
            $("<div>", { class: "grid grid-cols-2 gap-2 mt-4" }).append(
                $("<button>", {
                    class: "border border-gray-600 text-white rounded px-3 py-2 text-sm",
                    html: "🖨 Imprimir"
                }),
                $("<button>", {
                    class: "bg-blue-700 text-white rounded px-3 py-2 text-sm hover:bg-blue-800",
                    html: "Cobrar"
                })
            )
        );

        // 🧩 Ensamblar
        container.append(header, orderItems, totals);
    }



    // Product.

    async listProduct(id){

        const pos = await useFetch({ url: api, data: { opc: "lsProducto",id:id } });

        this.createProductGrid({
            data: pos.products,
            onClick: (item) => {
                this.addProduct(item.id)
            }
        });


    }





    async addProduct(product_id){

        const data = await useFetch({
        url: api,
        data: {
            opc       : "addProduct",
            id: idFolio,
            product_id: product_id
        }
        });


    }

    // auxiliares.
    searchFilter(options) {
        const opts = Object.assign({
            parent: "searchProduct",
            gridId: "productGrid",
            selector: ".card",
            targetTextSelector: "h3"

        }, options);

        const input = $(`#${opts.parent}`);
        const grid = document.querySelector(`#${opts.gridId}`);

        console.log(input, grid);

        if (!input.length || !grid) return;

        const search = () => {
            const keyword = input.val().toLowerCase().trim();
            const cards = grid.querySelectorAll(opts.selector);

            cards.forEach(card => {
                const label = card.querySelector(opts.targetTextSelector)?.textContent.toLowerCase() || "";
                card.style.display = label.includes(keyword) ? "" : "none";
            });
        };

        input.off("input").on("input", search);
    }


}

