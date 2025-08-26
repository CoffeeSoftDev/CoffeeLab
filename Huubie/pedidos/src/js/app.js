let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';
let api = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos-catalogo.php";
let app,pos;
let modifier, products;
let idFolio;

$(async () => {

    // const data = await useFetch({ url: api, data: { opc: "init" } });
    // modifier = data.modifier;
    // products = data.products;
    // idFolio  = data.products;
    app = new App(api, 'root');
    pos = new Pos(api, 'root');
    app.init();
    pos.render();
});

class Pos extends Templates {

    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Order";
    }

    render(){
        this.layout();

    }

    layout(){

        this.createPOSContainers({
            parent: "container-package",
            id: "pedido",
            theme:'dark',
            onChange: (item) => {
                this.searchFilter({ parent: 'searchProduct' })
            }
        });

    }


    // Components.
    createPOSContainers(options) {
        const opts = Object.assign({
            parent: "container-package",
            id: "posLayout",
            theme: "dark", // 'light' | 'dark'
            class: "flex flex-col md:flex-row text-sm h-screen text-white ",
            onChange: (item) => { }
        }, options);

        const isDark = opts.theme === "dark";

        const colors = {
            containerBg: isDark ? "" : "bg-white",
            textColor: isDark ? "text-white" : "text-gray-600",
            leftPaneBg: isDark ? "bg-[#1F2A37]" : "bg-gray-100",
            inputBg: isDark ? "bg-[#111827]" : "bg-white",
            borderColor: isDark ? "border-gray-700" : "border-gray-300",
            cardGridBg: isDark ? "" : "bg-white",//bg-[#111827]
            tabBg: isDark ? "" : "bg-gray-100"
        };

        // 📦 Container principal
        const container = $("<div>", {
            id: opts.id,
            class: `${opts.class} ${colors.containerBg} ${colors.textColor}`
        });

        // 🟩 Left Pane
        const leftPane = $("<div>", {
            class: `flex-1 flex flex-col  overflow-hidden ${colors.leftPaneBg} ${colors.borderColor}`
        });

        // 🔍 Contenedor de búsqueda
        const searchContainer = $("<div>", {
            class: `p-3 flex items-center justify-between space-x-2 ${colors.borderColor}`
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

        // 🔽 Área visual de tabs de categoría
        const categoryTabs = $("<div>", {
            id: "categoryTabs",
            class: `${colors.textColor} p-3 ${colors.tabBg} mb-2 text-center ${colors.borderColor}`,
            text: "Tabs Categoría"
        });

        // 🧁 Contenedor de cards
        const productGridContainer = $("<div>", {
            class: "flex-1 overflow-auto p-3"
        });

        const grid = $("<div>", {
            id: "productGrid",
            class: `grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 ${colors.borderColor} p-3  rounded ${colors.cardGridBg}`
        });

        productGridContainer.append(grid);

        // Ensamblar left pane
        leftPane.append(searchContainer, categoryTabs, productGridContainer);

        // 🟥 Ticket (Right Panel)
        const rightPane = $("<div>", {
            id: "orderPanel",
            class: `
            w-full

            md:w-[25rem]
            max-w-full
            flex flex-col
            border-l
            ${colors.leftPaneBg}
            ${colors.borderColor}

        `
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
        const hoverClass = opts.hoverColor || (isDark ? "hover:bg-blue-700" : "hover:bg-gray-300");
        const inactiveColor = opts.inactiveColor || (isDark ? "" : "bg-gray-200");
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
                // $("<div>", { class: "flex justify-between" }).append(
                //     $("<span>").text("Subtotal:"),
                //     $("<span>", { id: "subtotal", text: "$0.00" })
                // ),
                // $("<div>", { class: "flex justify-between" }).append(
                //     $("<span>").text("IVA (16%):"),
                //     $("<span>", { id: "tax", text: "$0.00" })
                // ),
                // $("<div>", { class: "border-t my-2 border-gray-700" }),
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
                    id   : 'finishOrder',
                    class: "bg-blue-700 text-white rounded px-3 py-2 text-sm hover:bg-blue-800",
                    html : "Terminar"
                })
            )
        );

        $(document).off("click", "#printOrder").on("click", "#printOrder", () => {
            if (typeof opts.onPrint === "function") opts.onPrint(opts.data);
        });

        $(document).off("click", "#finishOrder").on("click", "#finishOrder", () => {
            if (typeof opts.onFinish === "function") opts.onFinish(opts.data);
        });

        // 🧩 Ensamblar
        container.append(header, orderItems, totals);
    }

    renderOrderPanel(options) {
        const defaults = {
            parent: "orderPanel",
            title: "Orden Actual",
            data: [],
            theme: "dark",
            totalSelector: "#total",
            onClear: () => { },
            onQuanty: (id, action, newQuantity) => { },
            onEdit: (id) => { },
            onRemove: (id) => { },
            onCleared: () => { },
            onPrint: () => { },
            onFinish: () => { }
        };

        const opts = Object.assign({}, defaults, options);

        const isDark = opts.theme === "dark";
        const textColor = isDark ? "text-white" : "text-gray-800";
        const subColor = isDark ? "text-blue-300" : "text-blue-600";
        const borderColor = isDark ? "border-gray-700" : "border-gray-300";
        const bgCard = isDark ? "bg-[#1E293B]" : "bg-white";
        const mutedColor = isDark ? "text-gray-300" : "text-gray-600";

        const container = $(`#${opts.parent}`).empty();

        // Header
        const header = $("<div>", {
            class: "p-4 border-b border-gray-700 flex justify-between items-center"
        }).append(
            $("<h2>", {
                class: "text-lg font-semibold text-white",
                text: opts.title
            }),
            $("<button>", {
                id: "clearOrder",
                class: "text-red-400 border border-[#C53030] px-2 py-1 rounded hover:bg-red-700",
                html: "🗑 Limpiar",
                click: opts.onClear
            })
        );

        // Contenedor dinámico
        const orderItems = $("<div>", {
            id: "orderItems",
            class: "flex-1 overflow-auto p-3 space-y-3"
        });

        // Footer
        const footer = $("<div>", {
            class: "p-4 border-t border-gray-700 bg-[#333D4C]"
        }).append(
            $("<div>", { class: "space-y-1 text-sm text-gray-300" }).append(
                $("<div>", {
                    class: "flex justify-between font-bold text-blue-400"
                }).append(
                    $("<span>").text("Total:"),
                    $("<span>", { id: "total", text: "$0.00" })
                )
            ),
            $("<div>", { class: "grid grid-cols-2 gap-2 mt-4" }).append(
                $("<button>", {
                    id: "printOrder",
                    class: "border border-gray-600 text-white rounded px-3 py-2 text-sm",
                    html: "🖨 Imprimir"
                }),
                $("<button>", {
                    id: "finishOrder",
                    class: "bg-blue-700 text-white rounded px-3 py-2 text-sm hover:bg-blue-800",
                    html: "Terminar"
                })
            )
        );

        // Ensamblar panel
        container.append(header, orderItems, footer);

        // Render productos
        const data = [...opts.data];
        let totalAcc = 0;

        data.forEach((item, index) => {
            const card = $("<div>", {
                class: `flex justify-between items-center ${bgCard} border ${borderColor} rounded-xl p-3 shadow-sm`
            });

            const info = $("<div>", { class: "flex-1" }).append(
                $("<p>", { class: `${textColor} font-medium text-sm`, text: item.name }),
                $("<p>", { class: `${subColor} font-semibold text-sm`, text: formatPrice(item.price) })
            );

            const actions = $("<div>", { class: "flex flex-col items-end gap-2" });
            const quantityRow = $("<div>", { class: "flex items-center gap-2" });

            quantityRow.append(
                $("<button>", {
                    class: "bg-gray-700 text-white rounded px-2",
                    html: "−",
                    click: () => {
                        if (item.quantity > 1) {
                            item.quantity--;
                            opts.onQuanty(item.id, 0, item.quantity);
                            opts.data = data;
                            this.renderOrderPanel(opts);
                        }
                    }
                }),
                $("<span>", { class: `${textColor}`, text: item.quantity }),
                $("<button>", {
                    class: "bg-gray-700 text-white rounded px-2",
                    html: "+",
                    click: () => {
                        item.quantity++;
                        opts.onQuanty(item.id, 2, item.quantity);
                        opts.data = data;
                        this.renderOrderPanel(opts);
                    }
                }),
                $("<button>", {
                    class: "text-blue-400 hover:text-blue-600",
                    html: `<i class="icon-pencil"></i>`,
                    click: () => opts.onEdit(item.id)
                }),
                $("<button>", {
                    class: "text-gray-400 hover:text-red-400",
                    html: `<i class="icon-trash"></i>`,
                    click: () => {
                        data.splice(index, 1);
                        opts.onRemove(item.id);
                        opts.data = data;
                        this.renderOrderPanel(opts);
                    }
                })
            );

            const lineTotal = (item.price || 0) * (item.quantity || 0);
            totalAcc += lineTotal;

            const totalEl = $("<p>", {
                class: `${mutedColor} text-sm`,
                text: `Total: ${formatPrice(lineTotal)}`
            });

            actions.append(quantityRow, totalEl);
            card.append(info, actions);
            orderItems.append(card);
        });

        if (opts.totalSelector) $(opts.totalSelector).text(formatPrice(totalAcc));

        // Eventos
        $(document).off("click", "#clearOrder").on("click", "#clearOrder", () => {
            opts.data = [];
            $(`#orderItems`).empty();
            this.renderOrderPanel(opts);
            if (typeof opts.onCleared === "function") opts.onCleared();
        });

        $(document).off("click", "#printOrder").on("click", "#printOrder", () => {
            if (typeof opts.onPrint === "function") opts.onPrint(opts.data);
        });

        $(document).off("click", "#finishOrder").on("click", "#finishOrder", () => {
            if (typeof opts.onFinish === "function") opts.onFinish(opts.data);
        });
    }

    renderCart(options) {
        const opts = Object.assign({
            parent: "orderItems",
            data: [],
            theme: "dark",
            totalSelector: "#total",
            onQuanty: (id, action, newQuantity) => { },
            onEdit: (id) => { },  // ← aseguramos el callback
            onRemove: (id) => { },
            onCleared: () => { }
        }, options);

        const isDark = opts.theme === "dark";
        const textColor = isDark ? "text-white" : "text-gray-800";
        const subColor = isDark ? "text-blue-300" : "text-blue-600";
        const borderColor = isDark ? "border-gray-700" : "border-gray-300";
        const bgCard = isDark ? "bg-[#1E293B]" : "bg-white";
        const mutedColor = isDark ? "text-gray-300" : "text-gray-600";
        const emptyTitle = isDark ? "text-gray-300" : "text-gray-700";
        const emptySub = isDark ? "text-gray-400" : "text-gray-500";

        const container = $(`#${opts.parent}`).empty();
        const data = [...opts.data];
        let totalAcc = 0;

        // 🛒 Empty state
        if (data.length === 0) {
            const empty = $("<div>", {
                class: "w-full h-full flex items-center justify-center"
            }).append(
                $("<div>", { class: "text-center" }).append(
                    $(`<svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-3" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${isDark ? '#9CA3AF' : '#6B7280'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L21 6H6"></path>
                </svg>`),
                    $("<p>", { class: `text-base font-medium ${emptyTitle}`, text: "No hay productos en la orden" }),
                    $("<p>", { class: `text-sm mt-1 ${emptySub}`, text: "Selecciona productos del catálogo" })
                )
            );

            container.append(empty);
            if (opts.totalSelector) $(opts.totalSelector).text(formatPrice(0));

            $(document).off("click", "#clearOrder").on("click", "#clearOrder", () => {
                opts.data = [];
                this.renderCart(opts);
                if (typeof opts.onCleared === "function") opts.onCleared();
            });

            return;
        }

        // 🔁 Render items
        data.forEach((item, index) => {
            const card = $("<div>", {
                class: `flex justify-between items-center ${bgCard} border ${borderColor} rounded-xl p-3 shadow-sm`
            });

            const info = $("<div>", { class: "flex-1" }).append(
                $("<p>", { class: `${textColor} font-medium text-sm`, text: item.name }),
                $("<p>", { class: `${subColor} font-semibold text-sm`, text: formatPrice(item.price) })
            );

            const actions = $("<div>", { class: "flex flex-col items-end gap-2" });
            const quantityRow = $("<div>", { class: "flex items-center gap-2" });

            quantityRow.append(
                $("<button>", {
                    class: "bg-gray-700 text-white rounded px-2",
                    html: "−",
                    click: () => {
                        if (item.quantity > 1) {
                            item.quantity--;
                            opts.onQuanty(item.id, 0, item.quantity);
                            opts.data = data;
                            this.renderCart(opts);
                        }
                    }
                }),
                $("<span>", { class: `${textColor}`, text: item.quantity }),
                $("<button>", {
                    class: "bg-gray-700 text-white rounded px-2",
                    html: "+",
                    click: () => {
                        item.quantity++;
                        opts.onQuanty(item.id, 2, item.quantity);
                        opts.data = data;
                        this.renderCart(opts);
                    }
                }),

                // ✏️ Botón editar
                $("<button>", {
                    class: "text-blue-400 hover:text-blue-600",
                    html: `<i class="icon-pencil"></i>`,
                    click: () => {
                        if (typeof opts.onEdit === "function") opts.onEdit(item.id);
                    }
                }),

                $("<button>", {
                    class: "text-gray-400 hover:text-red-400",
                    html: `<i class="icon-trash"></i>`,
                    click: () => {
                        data.splice(index, 1);
                        opts.onRemove(item.id);
                        opts.data = data;
                        this.renderCart(opts);
                    }
                })
            );

            const lineTotal = (item.price || 0) * (item.quantity || 0);
            totalAcc += lineTotal;

            const totalEl = $("<p>", {
                class: `${mutedColor} text-sm`,
                text: `Total: ${formatPrice(lineTotal)}`
            });

            actions.append(quantityRow, totalEl);
            card.append(info, actions);
            container.append(card);
        });

        if (opts.totalSelector) $(opts.totalSelector).text(formatPrice(totalAcc));

        // 🔗 Botón limpiar
        $(document).off("click", "#clearOrder").on("click", "#clearOrder", () => {
            opts.data = [];
            this.renderCart(opts);
            if (typeof opts.onCleared === "function") opts.onCleared();
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

class App extends Pos {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "Order";
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        this.initPos();
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



    }


    async initPos() {

        const pos = await useFetch({ url: api, data: { opc: "init" } });
        idFolio = pos.id;

        // tabs product.

        this.createProductTabs({
            data: pos.modifier,
            onChange: (category) => {
                this.listProduct(category)
            }
        });

        // Products.

        this.createProductGrid({
            data: pos.products,
            onClick: (item) => {
                this.addProduct(item.id)
            }
        });

        this.createOrderPanel({
            title: `Orden Actual #P-00${idFolio}`,
            onClear: () => {
                this.confirmClearOrder(idFolio);
            },
            onFinish: (data) => {
                this.addPayment(data);
            }

        });

        this.renderCart({
            data: pos.list,
            onRemove: (id) => {
                this.removeProduct(id);
            },
            onEdit: (id) => { 
                editProduct(id);
            }, 
        });


    }

    // Product.

    async listProduct(id) {

        const pos = await useFetch({ url: api, data: { opc: "lsProducto", id: id } });

        this.createProductGrid({
            data: pos.products,
            onClick: (item) => {
                this.addProduct(item.id)
            }
        });


    }

    async addProduct(product_id) {

        const pos = await useFetch({
            url: api,
            data: {
                opc: "addProduct",
                quantity: 1,
                pedidos_id: idFolio,
                product_id: product_id
            }
        });

        this.renderCart({
            data: pos.list,
            onRemove: (id) => {
                this.removeProduct(id);
            }
        });
    }

    async removeProduct(id) {
        const pos = await useFetch({
            url: api,
            data: {
                opc: "removeProduct",
                pedidos_id: idFolio,
                id: id
            }
        });

    }

    confirmClearOrder(id) {


        this.swalQuestion({
            opts: {
                title: "¿Desea eliminar todos los productos del ticket?",
                text: "Esta acción vaciará el pedido actual.",
                icon: "warning"
            },
            data: {
                opc: "deleteAllProducts",
                pedidos_id: idFolio
            },
            methods: {
                send: (response) => {
                    if (response?.status === 200) {
                        alert({ icon: "success", text: response.message || "Ticket limpiado." });

                        this.renderCart({
                            data: response.list,
                            onRemove: (id) => {
                                this.removeProduct(id);
                            }
                        });

                    } else {
                        alert({ icon: "info", title: "Oops!...", text: response?.message || "No se pudo limpiar el ticket." });
                    }
                }
            }
        });
    }

    async editProduct(id) {
        const product = await useFetch({
            url: api,
            data: {
                opc: "getProduct",
                product_id
            }
        });
       

        const modalContent = $(`
        <div class="p-4 bg-[#111827] rounded-lg">
        
        <h2 class="text-xl text-white font-semibold mb-1"></h2>
        <p class="text-blue-400 text-md font-bold mb-2">$</p>
        <p class="text-gray-400 text-sm">Descripción del producto disponible próximamente.</p>
        </div>
    `);

        bootbox.dialog({
            title: ``,
            size: "large",
            id: 'modalAdvance',
            closeButton: true,
            message: modalContent,
        });
    }

    // Pos.
    addPayment(data) {

        console.log(data)

        // let tr = $(event.target).closest("tr");

        // // Obtiene el valor
        let saldo = $('#total').text();
        let saldoOriginal = $('#total').text().replace(/[^0-9.-]+/g, "");
        let total = parseFloat(saldoOriginal);

        this.createModalForm({
            id: "modalRegisterPayment",
            bootbox: { title: "Registrar Pago", id: "registerPaymentModal", size: "medium" },
            data: { opc: 'addPayment', total: total, id: idFolio },
            json: [
                {
                    opc: "input",
                    type: "number",
                    id: "pay",
                    lbl: "Pago",
                    class: "col-12 mb-3",
                    placeholder: "$ 0",
                    required: true,
                    min: 0, // 📛 Evita valores negativos desde el input
                    onkeyup: 'app.(' + saldoOriginal + ')'
                },
             

                {
                    opc: "select",
                    id: "method_pay_id",
                    lbl: "Método de pago",
                    class: "col-12 mb-3",
                    data: [
                        { id: "1", valor: "Efectivo" },
                        { id: "2", valor: "Tarjeta" },
                        { id: "3", valor: "Transferencia" }
                    ],
                    required: true
                },
                {
                    opc: "div",
                    id: "dueAmount",
                    class: "col-12 text-center bg-gray-800 text-white p-2 rounded",
                    html: `<strong>Monto a pagar</strong><br> <span id="SaldoEvent">${saldo}</span>`
                }
            ],

            success: (response) => {
                if (response.status == 200) {
                    alert({ icon: "success", text: response.message, btn1: true, btn1Text: "Ok" });
                    app.ls();
                } else {
                    alert({ icon: "error", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });

        $("#btnSuccess").addClass("text-white");
        $("#btnExit").addClass("text-white");
    }







}

