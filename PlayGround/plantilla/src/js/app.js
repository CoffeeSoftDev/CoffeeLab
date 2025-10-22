
// init vars.
let app, sub;
let api = "https://erp-varoch.com/DEV/capital-humano/ctrl/ctrl-rotacion-de-personal.php";
let api2 = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos-catalogo.php";
let data, idFolio;

// hello

$(async () => {
    // instancias.
    app = new App(api2, 'root');
    app.init();
    idFolio = 24;
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Ingresos";
    }

    init() {
        this.render();
    }

    render(options) {
        this.layout();
        // this.filterBar();
        this.sideBar({ theme: 'light' });
        this.navBar({ theme: 'light' });

        this.topClientesComponent({data: this.jsonTop()});

    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full  pb-3 ', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full mt-5 bg-white rounded-lg p-3 h-[calc(100vh-6rem)] ', id: `container${this.PROJECT_NAME}` }
            }
        });

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            class: '',
            type: "short",
            json: [
                {
                    id: "dashboard",
                    tab: "Tab 1",
                    class: "mb-1",
                    active: true,
                    onClick: () => dashboardSocialNetwork.renderDashboard()
                },
                {
                    id: "capture",
                    tab: "Tab 2",

                    onClick: () => registerSocialNetWork.render()
                },

            ]
        });

        // this.renderTabsCostsSys()
    }

   

    topClientesComponent(options = {}) {
        const defaults = {
            parent: "body",
            udn_id: $("#udn_id").val(),
            limit: 10,
            data: [],
        };

        const opts = Object.assign({}, defaults, options);
        const topClientes = opts.data;

        let topHTML = "";

        if (topClientes && topClientes.length > 0) {
            topClientes.forEach((cliente, index) => {
                const nombreCompleto = `${cliente.nombre} ${cliente.apellido_paterno || ""} ${cliente.apellido_materno || ""}`.trim();
                const badgeVIP = cliente.vip == 1
                    ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-400  text-white "><i class="icon-star mr-1 text-yellow-900"></i>VIP</span>'
                    : "";
                const medalIcon =
                    index === 0
                        ? "🥇"
                        : index === 1
                            ? "🥈"
                            : index === 2
                                ? "🥉"
                                : `<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-semibold text-sm">${index + 1}</span>`;

                const bgColor =
                    index === 0
                        ? "bg-orange-100 border-yellow-200"
                        : index === 1
                            ? "bg-gray-50  border-gray-200"
                            : index === 2
                                ? "bg-gray-50  border-gray-200"
                                : "bg-white border-gray-200";

                topHTML += `
                    <div class="relative mb-3 p-2 rounded-xl border-2 ${bgColor} transition-all duration-300 transform hover:-translate-y-1">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="flex-shrink-0">
                                    ${medalIcon}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center space-x-2 mb-1">
                                        <h3 class="text-lg font-bold text-gray-800 truncate">${nombreCompleto}</h3>
                                        ${badgeVIP}
                                    </div>
                                    <div class="flex flex-wrap items-center text-sm text-gray-600 space-x-4">
                                        <span class="inline-flex items-center">
                                            <i class="icon-building mr-1 text-blue-500"></i>
                                            ${cliente.udn_nombre}
                                        </span>
                                        <span class="inline-flex items-center">
                                            <i class="icon-shopping-cart mr-1 text-green-500"></i>
                                            ${cliente.total_pedidos} pedidos
                                        </span>
                                        <span class="inline-flex items-center">
                                            <i class="icon-calendar mr-1 text-purple-500"></i>
                                            ${cliente.ultima_compra ? new Date(cliente.ultima_compra).toLocaleDateString('es-MX') : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-right ml-4">
                                <div class="text-LG font-bold text-[#103B60] mb-1">
                                    $${parseFloat(cliente.monto_total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </div>
                                <div class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    Ticket: $${parseFloat(cliente.ticket_promedio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            topHTML = `
                <div class="flex flex-col items-center justify-center py-12 text-center">
                    <div class="w-24 h-24 bg-gray-100 rounded flex items-center justify-center mb-4">
                        <i class="icon-users text-4xl text-gray-400"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-2">No hay datos disponibles</h3>
                    <p class="text-gray-500">Selecciona una unidad de negocio para ver el ranking</p>
                </div>
            `;
        }

        bootbox.dialog({
            title: `
                <div class="flex items-center space-x-3 p-2">
                    <div class="w-12 h-12 bg-orange-400  rounded flex items-center justify-center">
                        <i class="icon-trophy text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-0">Top 10 Clientes</h3>
                        <p class="text-sm text-gray-600 mb-0">Ranking por monto total de compras</p>
                    </div>
                </div>
            `,
            message: `
                <div class="bg-gray-50 -mx-4 -mb-4 px-6 py-4">
                    <div class="max-h-96 overflow-y-auto pr-2 mt-3" style="scrollbar-width: thin; scrollbar-color: #CBD5E0 #F7FAFC;">
                        ${topHTML}
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <div class="flex items-center justify-center space-x-6 text-sm text-gray-600">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                                <span>Top 3 destacados</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                                <span>Cliente VIP</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            size: 'large',
            className: 'top-clients-modal',
            closeButton:true
        });
    }

    async onShowTopClientes() {
        const udnId = $("#udn_id").val();
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getTopClientes",
                limit: 10,
                udn_id: udnId
            }
        });

        if (request.status === 200) {
            this.topClientesComponent({
                parent: "body",
                data: request.data
            });
        } else {
            alert({ icon: "error", text: "Error al obtener top clientes" });
        }
    }


     jsonTop(){
         return [
             {
                 nombre: "Carlos",
                 apellido_paterno: "López",
                 apellido_materno: "García",
                 vip: 1,
                 udn_nombre: "Sucursal Centro",
                 total_pedidos: 28,
                 ultima_compra: "2025-09-15",
                 monto_total: 45999.5,
                 ticket_promedio: 1642.84
             },
             {
                 nombre: "Ana",
                 apellido_paterno: "Martínez",
                 apellido_materno: "Ramos",
                 vip: 0,
                 udn_nombre: "Sucursal Norte",
                 total_pedidos: 22,
                 ultima_compra: "2025-09-10",
                 monto_total: 37850.75,
                 ticket_promedio: 1720.49
             },
             {
                 nombre: "Luis",
                 apellido_paterno: "Hernández",
                 apellido_materno: "",
                 vip: 0,
                 udn_nombre: "Sucursal Este",
                 total_pedidos: 18,
                 ultima_compra: "2025-09-01",
                 monto_total: 29900.0,
                 ticket_promedio: 1661.11
             },
             {
                 nombre: "María",
                 apellido_paterno: "Sánchez",
                 apellido_materno: "Castro",
                 vip: 1,
                 udn_nombre: "Sucursal Sur",
                 total_pedidos: 15,
                 ultima_compra: "2025-08-20",
                 monto_total: 27800.25,
                 ticket_promedio: 1853.35
             },
             {
                 nombre: "Juan",
                 apellido_paterno: "Pérez",
                 apellido_materno: "Mora",
                 vip: 0,
                 udn_nombre: "Sucursal Centro",
                 total_pedidos: 14,
                 ultima_compra: "2025-08-30",
                 monto_total: 24300.0,
                 ticket_promedio: 1735.71
             },
             {
                 nombre: "Laura",
                 apellido_paterno: "Jiménez",
                 apellido_materno: "Delgado",
                 vip: 0,
                 udn_nombre: "Sucursal Norte",
                 total_pedidos: 13,
                 ultima_compra: "2025-09-05",
                 monto_total: 19950.5,
                 ticket_promedio: 1534.27
             },
             {
                 nombre: "Ricardo",
                 apellido_paterno: "Mendoza",
                 apellido_materno: "Flores",
                 vip: 1,
                 udn_nombre: "Sucursal Sur",
                 total_pedidos: 12,
                 ultima_compra: "2025-09-02",
                 monto_total: 18999.99,
                 ticket_promedio: 1583.33
             },
             {
                 nombre: "Paola",
                 apellido_paterno: "Ramírez",
                 apellido_materno: "Cruz",
                 vip: 0,
                 udn_nombre: "Sucursal Este",
                 total_pedidos: 11,
                 ultima_compra: "2025-08-15",
                 monto_total: 17600.0,
                 ticket_promedio: 1600.0
             },
           
         ]









}
}



function formatSpanishDate(fecha = null, type = "normal") {
    let date;

    if (!fecha) {
        // Si no se pasa nada, usamos la fecha actual
        date = new Date();
    } else {
        // Dividimos fecha y hora si existe
        // ejemplo: "2025-03-08 09:14" => ["2025-03-08", "09:14"]
        const [fechaPart, horaPart] = fecha.split(" ");

        // Descomponer "YYYY-MM-DD"
        const [year, month, day] = fechaPart.split("-").map(Number);

        if (horaPart) {
            // Si hay hora, por ejemplo "09:14"
            const [hours, minutes] = horaPart.split(":").map(Number);
            // Crear Date con hora local
            date = new Date(year, month - 1, day, hours, minutes);
        } else {
            // Solo fecha
            date = new Date(year, month - 1, day);
        }
    }

    // Extraer partes de la fecha
    const dia = date.getDate();
    const anio = date.getFullYear();

    // Obtenemos el mes en español (México).
    // Nota: El mes corto en español a veces incluye punto (ej: "mar."). Lo eliminamos:
    const mesCorto = date
        .toLocaleString("es-MX", { month: "short" })
        .replace(".", "");
    const mesLargo = date.toLocaleString("es-MX", { month: "long" });

    // Asegurar que el día tenga 2 dígitos
    const diaPadded = String(dia).padStart(2, "0");

    // Formatos deseados
    const formatos = {
        short: `${diaPadded}/${mesCorto}/${anio}`, // p.ej. "08/mar/2025"
        normal: `${diaPadded} de ${mesLargo} del ${anio}`, // p.ej. "08 de marzo del 2025"
    };

    // Devolvemos el formato según type
    return formatos[type] || formatos.short;
}



