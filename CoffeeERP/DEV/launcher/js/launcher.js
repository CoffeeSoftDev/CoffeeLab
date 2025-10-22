let api = 'ctrl/ctrl-launcher.php';
let app;

$(async () => {
    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "launcher";
        this.modules = [];
        this.filteredModules = [];
        this.systemInfo = {};
    }

    async render() {
        await this.loadSystemInfo();
        this.layout();
        await this.loadModules();
    }

    async loadSystemInfo() {
        try {
            const response = await useFetch({
                url: this._link,
                data: { opc: "init" }
            });
            
            this.systemInfo = response;
        } catch (error) {
            console.error('Error loading system info:', error);
        }
    }

    layout() {
        const container = $("<div>", {
            id: this.PROJECT_NAME,
            class: "min-h-screen w-full p-6"
        });

        const header = this.createHeader();
        const searchBar = this.createSearchBar();
        const moduleGrid = $("<div>", {
            id: "moduleGrid",
            class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6"
        });
        const footer = this.createFooter();

        container.append(header, searchBar, moduleGrid, footer);
        $(`#${this._div_modulo}`).html(container);
    }

    createHeader() {
        const header = $("<div>", {
            class: "mb-8 text-center fade-in"
        });

        const logo = $("<div>", {
            class: "mb-4"
        }).append(
            $("<img>", {
                src: "../src/img/logo-varoch.png",
                alt: "Grupo Varoch",
                class: "h-16 mx-auto"
            })
        );

        const title = $("<h1>", {
            class: "text-4xl font-bold text-white mb-2",
            text: "Lanzador de Aplicaciones"
        });

        const subtitle = $("<p>", {
            class: "text-white text-opacity-80 text-lg",
            text: "Accede a todos los módulos del sistema ERP"
        });

        header.append(logo, title, subtitle);
        return header;
    }

    createSearchBar() {
        const searchContainer = $("<div>", {
            class: "mb-6 max-w-2xl mx-auto fade-in"
        });

        const searchWrapper = $("<div>", {
            class: "relative"
        });

        const searchIcon = $("<i>", {
            class: "fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        });

        const searchInput = $("<input>", {
            type: "text",
            id: "searchModules",
            placeholder: "Buscar aplicaciones...",
            class: "w-full pl-12 pr-4 py-4 rounded-xl bg-white bg-opacity-20 backdrop-blur-lg text-white placeholder-white placeholder-opacity-60 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition search-input"
        });

        searchInput.on('keyup', () => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.filterModules();
            }, 300);
        });

        searchWrapper.append(searchIcon, searchInput);
        searchContainer.append(searchWrapper);
        return searchContainer;
    }

    createFooter() {
        const footer = $("<div>", {
            class: "mt-8 text-center fade-in"
        });

        const statusContainer = $("<div>", {
            class: "inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30"
        });

        const statusDot = $("<span>", {
            class: "w-3 h-3 rounded-full bg-green-400 animate-pulse"
        });

        const statusText = $("<span>", {
            class: "text-white font-medium",
            text: this.systemInfo.status === 'online' ? 'Sistema Online' : 'Sistema Offline'
        });

        const divider = $("<span>", {
            class: "w-px h-6 bg-white bg-opacity-30"
        });

        const moduleCount = $("<span>", {
            id: "moduleCount",
            class: "text-white font-medium",
            text: "0 módulos disponibles"
        });

        const version = $("<span>", {
            class: "text-white text-opacity-60 text-sm",
            text: `ERP ${this.systemInfo.version || 'v3.0'}`
        });

        statusContainer.append(statusDot, statusText, divider, moduleCount, divider, version);
        footer.append(statusContainer);
        return footer;
    }

    async loadModules() {
        try {
            const response = await useFetch({
                url: this._link,
                data: { opc: "getModules" }
            });

            if (response.status === 200) {
                this.modules = response.data || [];
                this.filteredModules = this.modules;
                this.renderModuleCards();
                this.updateModuleCount();
            } else if (response.status === 401) {
                window.location.href = '../acceso/index.php';
            } else {
                this.showEmptyState('No hay módulos disponibles');
            }
        } catch (error) {
            console.error('Error loading modules:', error);
            this.showEmptyState('Error al cargar los módulos');
        }
    }

    renderModuleCards() {
        const grid = $("#moduleGrid");
        grid.empty();

        if (this.filteredModules.length === 0) {
            this.showEmptyState('No se encontraron módulos que coincidan con tu búsqueda');
            return;
        }

        this.filteredModules.forEach((module, index) => {
            const card = this.createModuleCard(module, index);
            grid.append(card);
        });
    }

    createModuleCard(module, index) {
        const card = $("<div>", {
            class: "module-card bg-white rounded-xl shadow-lg p-6 cursor-pointer fade-in",
            style: `animation-delay: ${index * 0.1}s`
        });

        const iconContainer = $("<div>", {
            class: "mb-4"
        });

        const icon = $("<i>", {
            class: `${module.icon || 'icon-grid'} text-5xl ${module.icon_color || 'text-blue-600'}`
        });

        iconContainer.append(icon);

        const title = $("<h3>", {
            class: "text-xl font-bold text-gray-800 mb-2",
            text: module.name
        });

        const description = $("<p>", {
            class: "text-gray-600 text-sm mb-4 line-clamp-2",
            text: module.description || 'Sin descripción'
        });

        const footer = $("<div>", {
            class: "flex items-center justify-between"
        });

        if (module.status) {
            const badge = $("<span>", {
                class: `px-3 py-1 rounded-full text-xs font-semibold ${
                    module.status === 'nuevo' ? 'badge-nuevo' : 'badge-legacy'
                }`,
                text: module.status === 'nuevo' ? 'Nuevo' : 'Legacy'
            });
            footer.append(badge);
        } else {
            footer.append($("<span>"));
        }

        const arrow = $("<i>", {
            class: "fas fa-arrow-right text-gray-400"
        });

        footer.append(arrow);

        card.append(iconContainer, title, description, footer);

        card.on('click', () => {
            this.navigateToModule(module);
        });

        return card;
    }

    async navigateToModule(module) {
        try {
            await useFetch({
                url: this._link,
                data: {
                    opc: "logAccess",
                    module_id: module.id
                }
            });

            window.location.href = module.url;
        } catch (error) {
            console.error('Error logging access:', error);
            window.location.href = module.url;
        }
    }

    filterModules() {
        const searchTerm = $("#searchModules").val().toLowerCase();

        if (!searchTerm) {
            this.filteredModules = this.modules;
        } else {
            this.filteredModules = this.modules.filter(module => {
                const nameMatch = module.name.toLowerCase().includes(searchTerm);
                const descMatch = (module.description || '').toLowerCase().includes(searchTerm);
                return nameMatch || descMatch;
            });
        }

        this.renderModuleCards();
        this.updateModuleCount();
    }

    updateModuleCount() {
        const count = this.filteredModules.length;
        const text = count === 1 ? '1 módulo disponible' : `${count} módulos disponibles`;
        $("#moduleCount").text(text);
    }

    showEmptyState(message) {
        const grid = $("#moduleGrid");
        grid.empty();

        const emptyState = $("<div>", {
            class: "col-span-full text-center py-12"
        });

        const icon = $("<i>", {
            class: "fas fa-inbox text-6xl text-white text-opacity-40 mb-4"
        });

        const text = $("<p>", {
            class: "text-white text-opacity-60 text-lg",
            text: message
        });

        emptyState.append(icon, text);
        grid.append(emptyState);
    }
}
