class AppSoft extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";

    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        // this.filterBar();
        // this.ls();
    }

    layout() {
        this.CreateTab({
            parent:'tab-desplazamiento',
            json: [
                { id: "subir", tab: "Subir Desplazamiento", icon: "icon-doc", active: true, onClick: () => { this.layoutUpload() } },
                { id: "desplazamiento", tab: "Soft Restaurant", icon: "", content: 'Hola' },
                { id: "desplazamiento", tab: "Homologar recetas", icon: "", content: 'Hola' },
            ]
        });

        this.layoutUpload();




    }

    layoutUpload() {
        this.CardComponent({
            parent: 'container-subir',
            title: "Cargar los desplazamientos del mes",
            subtitle: "Seleccione una de las siguientes opciones para realizar la acción deseada",
            json: [
                {
                    titulo: "Subir Desplazamientos",
                    descripcion:
                        "Subir los desplazamientos pertenecientes del mes actual desde SOFT al sistema COSTSYS.",
                    icon: "icon-upload",
                    onClick: () => alert("Subir Desplazamientos")
                },
                {
                    titulo: "Subir Recetas Nuevas",
                    descripcion:
                        "Subir recetas nuevas al desplazamiento actual desde SOFT al sistema COSTSYS.",
                    icon: "icon-doc",
                    onClick: () => {
                        this.ls()
                    }
                }
            ],
        })
    }

    ls() {


        this.createTable({
            parent: "container-subir",
            idFilterBar: "filterBar",
            data: { opc: "list"},
            conf: { datatable: false, pag: 10 },
            attr: {
                id: "tb" + this.PROJECT_NAME,
                right: [3],
                center: [1, 4, 5],
                f_size: 12,
                extends: true,
            },

        });
    }







    CreateTab(options) {
        const defaults = {
            parent: "root",
            id: "tabComponent",
            class: "bg-gray-100 rounded-lg flex p-1 w-full overflow-hidden",
            renderContainer: true,
            json: [
                { id: "default", tab: "Tab 1", icon: "", active: true, onClick: () => { } },
            ]
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            id: opts.id,
            class: opts.class
        });

        opts.json.forEach(tab => {
            const isActive = tab.active || false;

            const tabButton = $("<button>", {
                id: `tab-${tab.id}`,
                html: tab.icon ? `<i class='${tab.icon} mr-2'></i>${tab.tab}` : tab.tab,
                class: `flex-1 py-2 text-sm font-semibold text-center rounded-lg transition duration-150 ease-in-out
                ${isActive ? "bg-white text-black" : "text-gray-500 hover:bg-white"}`,
                click: () => {
                    // reset all tabs
                    $(`#${opts.id} button`).removeClass("bg-white text-black").addClass("text-gray-500");
                    tabButton.addClass("bg-white text-black").removeClass("text-gray-500");

                    // manejar renderizado
                    if (opts.renderContainer) {
                        $(`#content-${opts.id} > div`).addClass("hidden");
                        $(`#container-${tab.id}`).removeClass("hidden");
                    }

                    if (typeof tab.onClick === "function") tab.onClick(tab.id);
                }
            });

            container.append(tabButton);
        });

        $(`#${opts.parent}`).html(container);

        // Crear contenedor de contenido si se activa renderContainer
        if (opts.renderContainer) {
            const contentContainer = $("<div>", {
                id: `content-${opts.id}`,
                class: "mt-2"
            });

            opts.json.forEach(tab => {
                const contentView = $("<div>", {
                    id: `container-${tab.id}`,
                    class: `hidden border p-4 rounded-lg`,
                    html: tab.content || ""
                });
                contentContainer.append(contentView);
            });

            $(`#${opts.parent}`).append(contentContainer);

            // mostrar el tab activo
            const activeTab = opts.json.find(t => t.active);
            if (activeTab) {
                $(`#container-${activeTab.id}`).removeClass("hidden");
            }
        }
    }

    CardComponent(options) {
        // 📌 Configuración por defecto
        const defaults = {
            parent: "root",
            id: "uploadCardComponent",
            title: "Subir de SOFT a COSTSYS",
            subtitle: "Seleccione una de las siguientes opciones para realizar la acción deseada",
            class: "bg-white p-6 rounded-lg  ",
            json: [
                {
                    titulo: "Demo",
                    descripcion:
                        "",
                    icon: "icon-upload",
                    onClick: () => alert("Subir Desplazamientos")
                },

            ],
            info: {
                icon: "icon-info",
                text:
                    "Antes de realizar cualquier acción de subida, asegúrese de que los datos en el sistema SOFT estén actualizados y correctos."
            }
        };

        const opts = Object.assign({}, defaults, options);

        // 🧱 Construcción de la interfaz
        const container = $("<div>", {
            id: opts.id,
            class: opts.class
        });

        const header = $("<div>").append(
            $("<h2>", {
                class: "text-lg font-bold text-gray-900",
                text: opts.title
            }),
            $("<p>", {
                class: "text-sm text-gray-500 mb-4",
                text: opts.subtitle
            })
        );

        const grid = $("<div>", {
            class: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        });

        opts.json.forEach((item) => {
            const card = $("<div>", {
                class:
                    "flex flex-col gap-2 cursor-pointer p-4 border rounded-lg hover:text-red-500 transition-all"
            }).append(
                $("<div>", { class: "text-xl text-blue-600" }).append(
                    $("<i>", { class: item.icon })
                ),
                $("<h3>", {
                    class: "text-base font-semibold text-gray-900",
                    text: item.titulo
                }),
                $("<p>", {
                    class: "text-sm text-gray-500",
                    text: item.descripcion
                })
            );

            if (item.onClick) card.on("click", item.onClick);
            grid.append(card);
        });

        const info = $("<div>", {
            class: "bg-gray-50 border border-gray-300 rounded-md p-3 text-sm text-gray-600 flex items-center gap-2"
        }).append(
            $("<i>", { class: opts.info.icon }),
            $("<span>", { text: opts.info.text })
        );

        // 📤 Inserción al DOM
        $(`#${opts.parent}`).html("").append(container.append(header, grid, info));
    }



}    