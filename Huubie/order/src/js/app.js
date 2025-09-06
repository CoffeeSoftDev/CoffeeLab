let url = 'https://huubie.com.mx/dev/pedidos/ctrl/ctrl-admin.php';
let api = "https://huubie.com.mx/dev/pedidos/ctrl/ctrl-pedidos-catalogo.php";
let app, pos;
let modifier, products;
let idFolio;

$(async () => {

    // instancias.
    app = new App(api, 'root');
    app.init();
    idFolio = 24;


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
        this.navBar()
        this.layout();
        this.addPayment(24);

    }

    navBar(options) {
        const defaults = {
            id: "navBar",
            theme: "dark", // "light" | "dark" (Huubie)
            class: "h-[56px] px-4 shadow-md",
            logoFull: "https://erp-varoch.com/ERP24/src/img/logos/logo_row_wh.png",
            logoMini: "https://erp-varoch.com/ERP24/src/img/logos/logo_icon_wh.png",
            user: {
                name: "Sergio Osorio",
                photo: "https://huubie.com.mx/alpha/src/img/perfil/fotoUser26_20250803_120920.png",
                onProfile: () => redireccion('perfil/perfil.php'),
                onLogout: () => cerrar_sesion()
            },
            apps: [
                { icon: "icon-calculator", name: "Contabilidad", color: "text-indigo-400" },
                { icon: "icon-box", name: "Inventario", color: "text-blue-600" },
                { icon: "icon-cart", name: "Ventas", color: "text-green-600" },
                { icon: "icon-bag", name: "Compras", color: "text-yellow-600" },
                { icon: "icon-users", name: "Recursos", color: "text-pink-600" },
                { icon: "icon-chart", name: "Reportes", color: "text-purple-600" },
                { icon: "icon-handshake", name: "CRM", color: "text-red-600" },
                { icon: "icon-industry", name: "Producción", color: "text-orange-600" },
                { icon: "icon-cog", name: "Configuración", color: "text-gray-600" }
            ]
        };

        const opts = Object.assign({}, defaults, options);

        // ===== THEME: Huubie Dark =====
        const isDark = String(opts.theme).toLowerCase() === "dark";
        const colors = {
            navbar: isDark ? "bg-[#1F2A37] text-white" : "bg-[#0A2B4B] text-white", // Huubie dark / Light azul prof.
            dropdownBg: isDark ? "bg-[#1F2A37] text-white" : "bg-white text-gray-800",
            hoverText: isDark ? "hover:text-blue-300" : "hover:text-blue-200",
            userHover: isDark ? "" : "hover:bg-blue-100",
            userBg: isDark ? "bg-[#1F2A37]" : "bg-white",
            border: isDark ? "border border-gray-700" : "border border-gray-200",
            chipBg: isDark ? "bg-gray-700" : "bg-gray-100"
        };

        // NAVBAR
        const header = $("<header>", {
            id: opts.id,
            class: `${colors.navbar} ${opts.class} flex justify-between items-center w-full fixed top-0 left-0 z-40`
        });

        const left = $("<div>", { class: "flex items-center gap-4" }).append(
            $("<span>", {
                id: "btnSidebar",
                html: `<i class="icon-menu text-2xl cursor-pointer ${colors.hoverText}"></i>`
            }),
            $("<img>", {
                src: opts.logoFull,
                class: "h-8 hidden sm:block cursor-pointer",
                click: () => location.reload()
            }),
            $("<img>", {
                src: opts.logoMini,
                class: "h-8 block sm:hidden cursor-pointer",
                click: () => location.reload()
            })
        );

        const launcherButton = $("<div>", {
            id: "launcherBtn",
            class: `relative ${colors.hoverText} text-xl cursor-pointer`,
            html: `<i class="icon-th-3"></i>`,
            click: (e) => {
                e.stopPropagation();
                $("#appsLauncher").toggleClass("hidden");
            }
        });

        // USER (click para abrir menú)
        const user = $("<div>", {
            class: "flex items-center gap-2 ml-4 cursor-pointer relative",
            id: "userDropdown"
        }).append(
            $("<img>", {
                src: opts.user.photo,
                class: "w-9 h-9 rounded-full border-2 border-white shadow"
            }),
            $("<span>", {
                class: "hidden sm:block font-medium text-sm",
                text: opts.user.name
            }),
            $("<ul>", {
                id: "userMenu",
                class: `hidden fixed top-16 right-4 w-[280px] ${colors.dropdownBg} rounded-lg ${colors.border} shadow p-2 z-50`
            }).append(
                $("<li>", {
                    class: `px-3 py-2 rounded ${colors.userHover} cursor-pointer flex items-center gap-2`,
                    html: `<i class="icon-user"></i><span>Mi perfil</span>`,
                    click: opts.user.onProfile
                }),
                $("<li>", { class: `my-1 ${colors.border}` }),
                $("<li>", {
                    class: `px-3 py-2 rounded ${colors.userHover} cursor-pointer flex items-center gap-2`,
                    html: `<i class="icon-off"></i><span>Cerrar sesión</span>`,
                    click: opts.user.onLogout
                })
            )
        );

        const right = $("<div>", {
            class: "flex items-center gap-3 relative"
        }).append(launcherButton, user);

        header.append(left, right);
        $("body").prepend(header);

        // APPS LAUNCHER (Huubie dark)
        const launcher = $("<div>", {
            id: "appsLauncher",
            class: `hidden fixed top-16 right-4 w-[320px] ${colors.dropdownBg} rounded-lg ${colors.border} shadow p-4 z-50`
        }).append(
            $("<div>", { class: "mb-3 flex items-center justify-between" }).append(
                $("<h3>", { class: "text-sm font-semibold", text: "Módulos ERP" }),
                $("<span>", { class: `text-[10px] px-2 py-1 rounded ${colors.chipBg} opacity-80`, text: "Huubie UI" })
            ),
            $("<div>", { class: "grid grid-cols-3 gap-3" }).append(
                ...opts.apps.map(app =>
                    $("<button>", {
                        type: "button",
                        class: `flex flex-col items-center gap-2 text-xs px-2 pt-2 pb-3 rounded hover:scale-105 transition ${colors.userHover}`
                    }).append(
                        $("<div>", {
                            class: `w-12 h-12 rounded-lg flex items-center justify-center text-xl ${app.color} ${colors.chipBg}`
                        }).append($("<i>", { class: app.icon })),
                        $("<span>", { class: "opacity-90", text: app.name })
                    )
                )
            )
        );

        $("body").append(launcher);

        // Eventos de toggle/cierre (user & launcher)
        $("#userDropdown").on("click", function (e) {
            e.stopPropagation();
            $("#userMenu").toggleClass("hidden");
            $("#appsLauncher").addClass("hidden");
        });

        $(document).on("click", (e) => {
            if (!$(e.target).closest("#launcherBtn").length && !$(e.target).closest("#appsLauncher").length) {
                $("#appsLauncher").addClass("hidden");
            }
            if (!$(e.target).closest("#userDropdown").length && !$(e.target).closest("#userMenu").length) {
                $("#userMenu").addClass("hidden");
            }
        });
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class:'mt-3 p-3 h-full',

        });
    }

    // payment.
    async addPayment(id) {

        let saldo, saldoOriginal, total, total_paid;

        if (id) {
            const req = await useFetch({ url: this._link, data: { opc: "getPayment", id: id } });
            const response = req.order;

            saldo = formatPrice(response.total_pay);
            saldoOriginal = response.total_pay;
            total = response.total_pay;
            total_paid = req.total_paid;

        } else {
            const totalText = $('#total').text();
            saldo = totalText;
            saldoOriginal = totalText.replace(/[^0-9.-]+/g, "");
            total = parseFloat(saldoOriginal);
        }

        this.createModalForm({
            id: "modalRegisterPayment",
            bootbox: {
                title: `
                <div class="flex items-center gap-2 text-white text-lg font-semibold">
                    <i class="icon-dollar text-blue-400 text-xl"></i>
                    Registrar Pago
                </div>
            `,
                id: "registerPaymentModal",
                size: "medium"
            },
            data: { opc: 'addPayment', total: total, id: idFolio },

            json: [


                this.cardTotalPay(total, total_paid),


                {
                    opc: "div",
                    id: "anticipoSwitch",
                    class: "col-12 mb-2",
                    html: `
                    <div   class = "flex items-center justify-between text-white p-3 rounded-lg border border-gray-700 bg-[#1F2937]">
                        <div   class = "flex items-center gap-2">
                        <i     id    = "iconAnticipo" class  = "icon-minus-square text-gray-400 transition-colors duration-200"></i>
                        <label id    = "labelAnticipo" class = "text-sm">Dejar abono</label>
                        </div>

                        <label class = "inline-flex items-center cursor-pointer relative">
                        <input type  = "checkbox" id = "toggleAnticipo" class = "sr-only peer" onchange = "app.toggleAnticipoView()">
                        <div   class = "w-11 h-6 bg-gray-700 peer-checked:bg-blue-600 rounded-full transition-colors duration-300"></div>
                        <div   class = "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                        </label>
                    </div>
                `
                },
                {
                    opc: "input",
                    type: "number",
                    id: "advanced_pay",
                    lbl: "Importe",
                    class: "col-12 mb-3 hidden",
                    placeholder: "$ 0",
                    required: false,
                    min: 0,
                    onkeyup: 'app.updateSaldoEvent(' + total + ', ' + (total_paid || 0) + ')'
                },
                {
                    opc: "select",
                    id: "method_pay_id",
                    lbl: "Método de pago del anticipo",
                    class: "col-12 mb-3 hidden",
                    data: [
                        { id: "1", valor: "Efectivo" },
                        { id: "2", valor: "Tarjeta" },
                        { id: "3", valor: "Transferencia" }
                    ],
                    required: true
                },


            ],
            success: (response) => {
                if (response.status == 200) {
                    alert({ icon: "success", text: response.message, btn1: true, btn1Text: "Ok" });
                    order.init();
                } else {
                    alert({ icon: "error", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });

        setTimeout(() => {
            document.getElementById("toggleAnticipo")?.addEventListener("change", () => app.toggleAnticipoView());
        }, 500);

        $("#btnSuccess").addClass("text-white");
        $("#btnExit").addClass("text-white");
    }

    cardTotalPay(total, total_paid = 0) {
        const restante = total - total_paid;

        // Si no hay abonos previos, solo se muestra el monto restante
        if (!total_paid || total_paid <= 0) {
            return {
                opc: "div",
                id: "Amount",
                class: "col-12",
                html: `
                <div id="dueAmount" class="p-4 rounded-xl bg-[#1E293B] text-white text-center">
                    <p class="text-sm opacity-80">Monto a pagar</p>
                    <p id="SaldoEvent" class="text-3xl font-bold mt-1">
                        ${formatPrice(restante)}
                    </p>
                </div>

            `
            };
        }

        // Si hay abono previo, mostrar resumen completo
        return {
            opc: "div",
            id: "Amount",
            class: "col-12",
            html: `
           <div id="dueAmount" class="p-4 rounded-xl bg-[#1E293B] text-white space-y-4 border border-slate-800 shadow-sm">

                <!-- Total de la venta -->
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-semibold">Total de la venta</span>
                    </div>
                    <div class="text-right text-white font-bold text-lg">
                        ${formatPrice(total)}
                    </div>
                </div>



                <hr class="border-slate-600">

                <!-- Monto restante -->
                <div class="flex justify-between items-center">
                    <span class="text-sm font-semibold">Restante</span>
                    <div id="SaldoEvent" class="text-right text-white font-bold text-md">
                        ${formatPrice(restante)}
                    </div>
                </div>
            </div>

        `
        };
    }

    updateSaldoEvent(totalOriginal, totalPaid = 0) {
        const input = document.getElementById("advanced_pay");
        const display = document.getElementById("SaldoEvent");
        const btnOk = document.getElementById("btnSuccess");
        const btnExit = document.getElementById("btnExit");

        if (!input || !display) return;

        let anticipo = parseFloat(input.value) || 0;
        let restante = totalOriginal - totalPaid - anticipo;

        // Validación: no permitir que anticipo exceda el monto disponible
        if (anticipo + totalPaid > totalOriginal) {
            anticipo = totalOriginal - totalPaid;
            input.value = anticipo.toFixed(2);
            restante = 0;
        }

        display.textContent = `$${restante.toFixed(2)}`;

        // Activar o desactivar botones según el valor del anticipo
        const isValid = anticipo > 0;

        if (btnOk) btnOk.disabled = !isValid;
        if (btnExit) btnExit.disabled = !isValid;
    }


    toggleAnticipoView() {
        const show = document.getElementById("toggleAnticipo")?.checked;

        const advancedPay = document.getElementById("advanced_pay")?.parentElement;
        const methodPay = document.getElementById("method_pay_id")?.parentElement;
        // const dueAmount = document.getElementById("dueAmount");

        const icon = document.getElementById("iconAnticipo");
        const label = document.getElementById("labelAnticipo");

        if (show) {
            advancedPay?.classList.remove("hidden");
            methodPay?.classList.remove("hidden");
            // dueAmount?.classList.remove("hidden");

            // 🔄 Cambiar ícono y texto
            if (icon) icon.className = "icon-check-square text-blue-400 transition-colors duration-200";
            if (label) label.textContent = "Abono selecionado";
        } else {
            advancedPay?.classList.add("hidden");
            methodPay?.classList.add("hidden");
            // dueAmount?.classList.add("hidden");

            if (icon) icon.className = "icon-minus-square text-gray-400 transition-colors duration-200";
            if (label) label.textContent = "Dejar abono";
        }
    }




}




