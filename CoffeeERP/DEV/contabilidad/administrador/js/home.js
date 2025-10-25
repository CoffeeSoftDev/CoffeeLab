let api = 'ctrl/ctrl-home.php';
let app;

$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    
    app = new App(api, "root");
    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Home";
    }

    render() {
        this.layout();
        this.loadDashboard();
    }

    layout() {
        this.primaryLayout({
            parent: 'root',
            id: this.PROJECT_NAME,
            class: 'w-full bg-gray-50 min-h-screen',
            card: {
                filterBar: { class: 'w-full', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full h-full', id: 'container' + this.PROJECT_NAME }
            }
        });

        this.headerDashboard();
    }

    headerDashboard() {
        const container = $("<div>", {
            class: "bg-white p-6 rounded-lg shadow-sm mb-6"
        });

        const header = $("<div>", {
            class: "flex justify-between items-center"
        });

        const welcomeSection = $("<div>");
        welcomeSection.append(
            $("<h1>", {
                class: "text-2xl font-bold text-gray-800",
                text: "Bienvenido, Alicia Rosas"
            }),
            $("<p>", {
                class: "text-sm text-gray-500",
                text: moment().format('dddd, DD [de] MMMM [de] YYYY')
            })
        );

        const dateSection = $("<div>", {
            class: "flex items-center gap-2"
        });

        dateSection.append(
            $("<label>", {
                class: "text-sm text-gray-600",
                text: "Fecha de consulta"
            }),
            $("<div>", {
                id: "calendarHome",
                class: "w-64"
            })
        );

        header.append(welcomeSection, dateSection);
        container.append(header);
        $('#filterBar' + this.PROJECT_NAME).html(container);

        dataPicker({
            parent: "calendarHome",
            onSelect: () => this.loadDashboard()
        });
    }

    async loadDashboard() {
        const rangePicker = getDataRangePicker("calendarHome");

        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getDashboardData",
                fi: rangePicker.fi,
                ff: rangePicker.ff
            }
        });

        this.renderSummary(request.summary);
        this.renderMainMenu();
    }

    renderSummary(data) {
        const container = $("<div>", {
            class: "mb-8"
        });

        const title = $("<h2>", {
            class: "text-lg font-semibold text-gray-700 mb-4",
            text: "Resumen del periodo"
        });

        const cardsContainer = $("<div>", {
            class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        });

        const cards = [
            {
                icon: "icon-basket",
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
                title: "Ventas del periodo",
                value: formatPrice(data.ventas || 0)
            },
            {
                icon: "icon-basket",
                iconColor: "text-green-500",
                bgColor: "bg-green-50",
                title: "Compras del periodo",
                value: formatPrice(data.compras || 0)
            },
            {
                icon: "icon-folder-open",
                iconColor: "text-purple-500",
                bgColor: "bg-purple-50",
                title: "Archivos subidos del periodo",
                value: data.archivos || 0
            },
            {
                icon: "icon-money",
                iconColor: "text-red-500",
                bgColor: "bg-red-50",
                title: "Retiros del periodo",
                value: formatPrice(data.retiros || 0)
            }
        ];

        cards.forEach(card => {
            const cardElement = $("<div>", {
                class: "bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            });

            const iconContainer = $("<div>", {
                class: `w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center mb-3`
            });

            iconContainer.append(
                $("<i>", {
                    class: `${card.icon} text-xl ${card.iconColor}`
                })
            );

            cardElement.append(
                iconContainer,
                $("<p>", {
                    class: "text-sm text-gray-600 mb-2",
                    text: card.title
                }),
                $("<p>", {
                    class: "text-2xl font-bold text-gray-800",
                    text: card.value
                })
            );

            cardsContainer.append(cardElement);
        });

        container.append(title, cardsContainer);
        $('#container' + this.PROJECT_NAME).html(container);
    }

    renderMainMenu() {
        const menuContainer = $("<div>", {
            class: "mt-8"
        });

        const title = $("<h2>", {
            class: "text-lg font-semibold text-gray-700 mb-4",
            text: "Menú principal"
        });

        const gridContainer = $("<div>", {
            class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        });

        const modules = [
            {
                icon: "icon-folder-open",
                iconColor: "text-green-600",
                bgColor: "bg-green-50",
                title: "Archivos",
                description: "Concentrado de archivos",
                link: "../archivos/"
            },
            {
                icon: "icon-basket",
                iconColor: "text-green-600",
                bgColor: "bg-green-50",
                title: "Ventas",
                description: "Concentrado de ventas",
                link: "../ventas/"
            },
            {
                icon: "icon-users",
                iconColor: "text-green-600",
                bgColor: "bg-green-50",
                title: "Clientes",
                description: "Concentrado de consumos y pagos a créditos",
                link: "../clientes/"
            },
            {
                icon: "icon-basket",
                iconColor: "text-green-600",
                bgColor: "bg-green-50",
                title: "Compras",
                description: "Concentrado de compras",
                link: "../compras/"
            },
            {
                icon: "icon-box",
                iconColor: "text-green-600",
                bgColor: "bg-green-50",
                title: "Almacén",
                description: "Concentrado de entradas y salidas de almacén",
                link: "../almacen/"
            },
            {
                icon: "icon-calculator",
                iconColor: "text-green-600",
                bgColor: "bg-green-50",
                title: "Costos",
                description: "Concentrado de costos",
                link: "../costos/"
            },
            {
                icon: "icon-briefcase",
                iconColor: "text-green-600",
                bgColor: "bg-green-50",
                title: "Proveedores",
                description: "Concentrado de compras y pagos",
                link: "../proveedores/"
            },
            {
                icon: "icon-doc-text",
                iconColor: "text-green-600",
                bgColor: "bg-green-50",
                title: "Carátula",
                description: "Consulta el resumen por periodo",
                link: "../caratula/"
            },
            {
                icon: "icon-money",
                iconColor: "text-blue-600",
                bgColor: "bg-blue-50",
                title: "Tesorería",
                description: "Concentrado de retiros y reembolsos",
                link: "../tesoreria/"
            },
            {
                icon: "icon-user",
                iconColor: "text-blue-600",
                bgColor: "bg-blue-50",
                title: "Capital Humano",
                description: "Consulta de anticipos",
                link: "../capital-humano/"
            },
            {
                icon: "icon-cog",
                iconColor: "text-blue-600",
                bgColor: "bg-blue-50",
                title: "Administración",
                description: "Desbloqueo de módulos y gestión de conceptos",
                link: "index.php"
            }
        ];

        modules.forEach(module => {
            const card = $("<div>", {
                class: "bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            });

            card.on('click', () => {
                window.location.href = module.link;
            });

            const iconContainer = $("<div>", {
                class: `w-12 h-12 ${module.bgColor} rounded-lg flex items-center justify-center mb-3`
            });

            iconContainer.append(
                $("<i>", {
                    class: `${module.icon} text-2xl ${module.iconColor}`
                })
            );

            card.append(
                iconContainer,
                $("<h3>", {
                    class: "text-base font-semibold text-gray-800 mb-1",
                    text: module.title
                }),
                $("<p>", {
                    class: "text-sm text-gray-500",
                    text: module.description
                })
            );

            gridContainer.append(card);
        });

        menuContainer.append(title, gridContainer);
        $('#container' + this.PROJECT_NAME).append(menuContainer);
    }
}
