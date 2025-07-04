
let api = 'https://huubie.com.mx/alpha/eventos/ctrl/ctrl-sub-eventos.php';

let sub, idEvent, id_subevent;

class Sub extends Templates {



    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SubEvent";



    }

    init(){
        this.showSubEvent();
        idEvent = 10;
    }



    async showSubEvent() {

        let subEvents = await useFetch({
            url: this._link,
            data: {
                opc: "listSubEvents",
                id: 10
            }
        });

        console.log(subEvents);


        if (subEvents.status == 200) {
            this.accordingMenu({
                parent: 'containerprojectName',
                title: 'Evento  : ' + subEvents.event.name_event,
                subtitle: subEvents.event.status,
                data: subEvents.data,

                center: [1, 2, 3, 6],
                right: [5],

                onAdd: () => { this.addSubEvent() },

                onEdit: (item, index) => {
                    this.editSubEvent(item)
                },
                onDelete: (item, index) => {
                    this.cancelSubEvent(item)
                },

                onPrint: (item) => {
                    payment.onShowDocument(idEvent)
                },

                onShow: (id) => {
                    id_subevent = id;

                    this.addMenu(id);


                }
            });

        } else {
            const emptySubEvent = $(`
                    <div class="flex flex-col items-center justify-content-start py-12 text-center h-full  bg-[#1F2A37] rounded-lg">
                    <i class="icon-calendar-1 text-[52px] text-gray-100"></i>
                    <h3 class="text-xl font-medium text-gray-100 mb-2">No hay sub-eventos</h3>
                    <p class="text-gray-400 mb-4">Comienza agregando tu primer sub-evento</p>
                    <button  id="btnAddSubEvent" class=" bg-gray-600 hover:bg-gray-700  px-4 py-2 rounded text-white ">
                    <span class="icon-plus-1"></span>
                    Nuevo Sub-evento
                    </button>
                </div> `);

            emptySubEvent.find("#btnAddSubEvent").on("click", () => {
                this.addSubEvent();
            });


            // 📌 Render
            $(`#tab-new-subevent`).html(emptySubEvent);


        }

    }

    // Menu package,extra.
    async addMenu(id) {

        let response = await useFetch({
            url: this._link,
            data: { opc: "getSubEventMenus", subevent_id: id }
        });

        let initMenu = await useFetch({ url: this._link, data: { opc: "getInitMenu", subevent_id: id } });

        this.MenuComponent({
            parent: 'containerInfo' + id,
            id: id,
            menus: initMenu.packages,
            extras: initMenu.products,

            sub: {
                menusSeleccionados: response.menus,
                extrasSeleccionados: response.extras
            },

            // eventos:
            onAddPackage: () => { this.addPackage(id) },
            onAddExtra: () => { this.addExtra(id) },

        });

    }

    MenuComponent(options) {
        const defaults = {
            parent: 'root',
            id: 0,
            title: 'Selecciona Menú',
            class: '',
            sub: null,
            menus: [],
            extras: [],
            resumen: {},
            onAddPackage: () => { },
            onAddExtra: () => { },
            onSubmit: () => { }
        };

        const opts = Object.assign({}, defaults, options);

        $(`#${opts.parent}`).empty();
        // <div>
        //     <label class="block text-sm font-medium text-gray-300 mb-1">Tiempos</label>
        //     <select class="selectMenu w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2">
        //     </select>
        // </div>

        // Interfaz.
        const paquetes = `
            <div class="md:col-span-2">
            <div class="bg-[#1F2A37] rounded-lg border border-gray-700 shadow-md p-6 text-white">
                <div class="mb-4">
                <h3 class="text-xl font-bold">${opts.title}</h3>
                <p class="text-sm text-gray-400">Elija uno o más menús/paquetes y la cantidad de personas</p>
                </div>
                <form id="formMenu${opts.id
            }" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Paquete Precargado</label>
                        <select class="selectMenu w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2">
                        <option value="">Seleccione un menú</option>
                        ${opts.menus
                .map(
                    (m) =>
                        `<option value="${m.id}">${m.nombre
                        } - ${formatPrice(
                            m.precioPorPersona
                        )} / persona</option>`
                )
                .join("")}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Cantidad</label>
                        <input type="number" min="1" value="1" class="cantidadPersonas w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2" />
                    </div>



                    <div class="flex items-end">
                        <button type="button" class="btnAgregarMenu w-full flex items-center justify-center gap-2 bg-[#1A56DB] hover:bg-[#274DCD] text-white font-medium py-2 px-4 rounded-md">
                        <i class="icon-plus-circle"></i> Agregar Menú
                        </button>
                    </div>
                </form>
                <hr class="border-gray-700 mb-4" />
                <div>
                <h4 class="font-semibold text-white mb-2">Menús seleccionados</h4>
                <div class="contentPaquetes bg-gray-900 text-gray-400 p-4 rounded-md text-center">
                    No hay menús seleccionados
                </div>
                <div class="detalleMenuSeleccionado-${opts.id} mt-6"></div>
                </div>
            </div>
            </div>`;

        const resumen = `
            <div class="bg-[#1F2A37] h-full rounded-lg border border-gray-700 shadow-md p-6 text-white">
            <div class="mb-4">
                <h3 class="text-xl font-bold">Resumen del Pedido</h3>
                <p class="text-sm text-gray-400">Detalles de su selección</p>
            </div>
            <div class="contentResumen bg-gray-900 text-gray-400 p-4 rounded-md text-center">
                ${opts.resumen.mensaje || 'Seleccione al menos un menú para ver el resumen'}
            </div>
            </div>`;

        const extras = `
            <div class="col-span-3 mt-4">
            <div class="bg-[#1F2A37] rounded-lg border border-gray-700 shadow-md p-6 text-white">
                <div class="mb-4">
                <h3 class="text-xl font-bold">Agregar Extras</h3>
                <p class="text-sm text-gray-400">Personalice su menú con opciones adicionales</p>
                </div>
                <form id="formExtra${opts.id}" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-semibold mb-2">Extras predefinidos</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                        <select class="selectExtra col-span-1 rounded-md bg-gray-800 text-white border border-gray-600 p-2 text-sm">
                            <option value="">Seleccione un extra</option>
                            ${opts.extras.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
                        </select>
                        <input type="number" min="1" value="1" class="extraCantidad col-span-1 rounded-md bg-gray-800 text-white border border-gray-600 p-2 text-sm" placeholder="Cantidad">
                        <button type="button" class="btnAgregarExtra col-span-1 px-3 py-2 text-sm text-white rounded bg-[#1A56DB] hover:bg-[#274DCD]">
                            <i class="icon-plus-circle"></i> Agregar
                        </button>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-2">Extras agregados</h4>
                        <div class="contentExtras bg-gray-900 text-gray-400 p-4 rounded-md min-h-[300px] overflow-auto text-center text-sm">
                        No hay extras agregados
                        </div>
                    </div>

                </form>


            </div>
            </div>`;

        const layout = `
        <div id="${opts.id}"
        class="grid grid-cols-1 md:grid-cols-3 gap-6 ${opts.class}">${paquetes}${resumen}${extras}</div>`;

        $(`#${opts.parent}`).append(layout);


        // if (opts.sub?.menusSeleccionados?.length) {

        this.renderPackages(opts.id, opts.sub);
        this.renderResumen(opts.id, opts.sub);
        this.renderExtras(opts.id, opts.sub);

        // }

        // Eventos
        $(`#${opts.id} .btnAgregarMenu`).on("click", () => opts.onAddPackage());
        $(`#${opts.id} .btnAgregarExtra`).on("click", () => opts.onAddExtra());
        $(`#${opts.id} .saveMenuEvent`).on("click", () => opts.onSubmit());
    }

    renderPackages(id, sub) {
        const contenedor = $(`#${id} .contentPaquetes`);
        contenedor.empty();

        if (sub.menusSeleccionados.length === 0) {
            contenedor.html(`<p>No hay menús seleccionados</p>`);
            return;
        }

        sub.menusSeleccionados.forEach((item, index) => {
            const cardId = `menu-card-${index}`;
            const total = item.menu.precioPorPersona * item.cantidadPersonas;

            const card = $(`
            <div id="${cardId}" class="border border-gray-700 p-3 rounded-lg bg-gray-800 mb-3">
                <div class="grid grid-cols-12 items-center gap-4">
                    <div class="col-span-6 flex flex-col justify-start text-left">
                        <div class="flex items-center gap-2">
                            <h4 class="font-semibold text-white truncate">${item.menu.nombre}</h4>
                            <button class="btn-ver-detalles text-sm px-2 py-1 bg-[#333D4C] text-blue-300 hover:text-blue-100 hover:bg-[#3f4b5c] border border-gray-600 rounded-md transition-colors duration-200" title="Ver detalles">Ver detalles</button>
                        </div>
                        <p class="text-gray-400 text-sm truncate">${item.menu.descripcion}</p>
                    </div>

                    <div class="col-span-3 flex justify-end items-center">
                        <div class="inline-flex items-center border border-gray-600 rounded-md overflow-hidden bg-gray-700 h-9">
                            <button class="btn-decrement px-2 text-white hover:bg-gray-600 h-full">−</button>
                            <span id="cantIndex${index}" class="px-4 text-white text-center font-medium min-w-[30px] h-full flex items-center justify-center">${item.cantidadPersonas}</span>
                            <button class="btn-increment px-2 text-white hover:bg-gray-600 h-full">+</button>
                        </div>
                    </div>

                    <div class="col-span-2 flex justify-end">
                        <span id="totalPrecio${index}" class="text-[#3FC189] font-bold block">${formatPrice(total)}</span>
                    </div>

                    <div class="col-span-1 flex justify-end">
                        <button class="btn-eliminar text-red-400 hover:text-red-600"><i class="icon-trash"></i></button>
                    </div>
                </div>
            </div>`);


            card.find(".btn-ver-detalles").on("click", (e) => {
                e.stopPropagation();
                this.renderDetails(id, item.menu.idEvt);
            });

            // Evento eliminar
            card.find(".btn-eliminar").on("click", (e) => {
                e.stopPropagation();
                this.deletePackage(id, item.menu.idEvt);
            });

            // Evento incrementar cantidad
            card.find(".btn-increment").on("click", (e) => {
                e.stopPropagation();
                item.cantidadPersonas += 1;
                $(`#cantIndex${index}`).text(item.cantidadPersonas);
                const nuevoTotal = item.menu.precioPorPersona * item.cantidadPersonas;

                $(`#totalPrecio${index}`).text(formatPrice(nuevoTotal));
                this.renderResumen(id, sub);
                this.updatePackageQuantity(id, item.menu.idEvt, item.cantidadPersonas)
            });

            // Evento decrementar cantidad
            card.find(".btn-decrement").on("click", (e) => {
                e.stopPropagation();
                if (item.cantidadPersonas > 1) {
                    item.cantidadPersonas -= 1;
                    $(`#cantIndex${index}`).text(item.cantidadPersonas);
                    const nuevoTotal = item.menu.precioPorPersona * item.cantidadPersonas;

                    $(`#totalPrecio${index}`).text(formatPrice(nuevoTotal));
                    this.renderResumen(id, sub);
                    this.updatePackageQuantity(id, item.menu.idEvt, item.cantidadPersonas)

                }
            });

            contenedor.append(card);
        });
    }

    renderResumen(id, sub) {
        const contenedorResumen = $(`#${id} .contentResumen`);
        const menu = sub.menusSeleccionados;
        const extras = sub.extrasSeleccionados;

        console.log('resumen', menu, extras);

        contenedorResumen.empty();

        if (menu.length === 0 && extras.length === 0) {
            contenedorResumen.html(`<p class="text-sm text-gray-400">Seleccione al menos un menú o un extra para ver el resumen</p>`);
            return;
        }

        let montoTotal = 0;

        const containerMenu = menu.length > 0
            ? `<h4 class="text-sm font-semibold text-white mb-2">Menús:</h4>` +
            menu.map((item) => {
                let subtotal = item.menu.precioPorPersona * item.cantidadPersonas;
                montoTotal += subtotal;
                return `<div class="flex justify-between text-xs text-white mb-1">
                          <span class="w-1/2 truncate">(${item.cantidadPersonas}) ${item.menu.nombre}</span>
                          <span class="w-1/4 text-right">${formatPrice(item.menu.precioPorPersona)}</span>
                          <span class="w-1/4 text-right">${formatPrice(subtotal)}</span>
                      </div>`;
            }).join("")
            : "";

        const containerExtra = extras.length > 0
            ? `<h4 class="text-sm font-semibold text-white mt-4 mb-2">Extras:</h4>` +
            extras.map((extra) => {
                let subtotal = extra.precio * extra.cantidad;
                montoTotal += subtotal;
                return `<div class="flex justify-between text-xs text-white mb-1">
                          <span class="w-1/2 truncate">(${extra.cantidad}) ${extra.nombre}</span>
                          <span class="w-1/4 text-right">${formatPrice(extra.precio)}</span>
                          <span class="w-1/4 text-right">${formatPrice(subtotal)}</span>
                      </div>`;
            }).join("")
            : "";

        contenedorResumen.html(`
                <div class="text-left">
                ${containerMenu}
                ${containerExtra}

            </div>
            <hr class="border-gray-600 my-3" />
            <div class="flex justify-between font-bold text-white text-lg">
                <span>Total:</span>
                <span id="pagoTotal">${formatPrice(montoTotal)}</span>
            </div>
        `);
    }

    renderExtras(id, sub) {
        const contenedor = $(`#${id} .contentExtras`);
        contenedor.empty();

        if (!sub.extrasSeleccionados || sub.extrasSeleccionados.length === 0) {
            contenedor.html(`<p>No hay extras agregados</p>`);
            return;
        }

        sub.extrasSeleccionados.forEach((item, index) => {
            const total = item.precio * item.cantidad;
            const cardId = `extra-card-${index}`;

            const card = $(`
            <div id="${cardId}" class="border border-gray-700 p-3 rounded-lg bg-gray-800 mb-3">
                <div class="grid grid-cols-12 items-center gap-4">
                    <!-- Nombre y clasificación -->
                    <div class="col-span-6 flex flex-col justify-start text-left">
                        <h4 class="font-semibold text-white truncate">${item.nombre}</h4>
                        <p class="text-gray-400 text-sm truncate">${item.clasificacion || 'Sin clasificación'}</p>
                    </div>

                    <!-- Contador -->
                    <div class="col-span-3 flex justify-end items-center">
                        <div class="inline-flex items-center border border-gray-600 rounded-md overflow-hidden bg-gray-700 h-9">
                            <button type="button" class="btn-decrement px-2 text-white hover:bg-gray-600 h-full">−</button>
                            <span id="cantExtra${index}" class="px-4 text-white text-center font-medium min-w-[30px] h-full flex items-center justify-center">${item.cantidad}</span>
                            <button type="button" class="btn-increment px-2 text-white hover:bg-gray-600 h-full">+</button>
                        </div>
                    </div>

                    <!-- Total -->
                    <div class="col-span-2 flex justify-end">
                        <span id="totalExtra${index}" class="text-[#3FC189] font-bold block">${formatPrice(total)}</span>
                    </div>

                    <!-- Eliminar -->
                    <div class="col-span-1 flex justify-end">
                        <button type="button" class="btn-eliminar text-red-400 hover:text-red-600">
                            <i class="icon-trash"></i>
                        </button>
                    </div>
                </div>
            </div>`);

            card.find(".btn-eliminar").on("click", (e) => {
                e.stopPropagation();

                this.deleteExtra(id, item.idEvt);
            });

            // Evento incrementar cantidad
            card.find(".btn-increment").on("click", (e) => {
                e.stopPropagation();
                item.cantidad += 1;
                $(`#cantExtra${index}`).text(item.cantidad);
                $(`#totalExtra${index}`).text(formatPrice(item.precio * item.cantidad));
                this.renderResumen(id, sub);
                this.updatePackageQuantity(id, item.idEvt, item.cantidad);
            });

            // Evento decrementar cantidad
            card.find(".btn-decrement").on("click", (e) => {
                e.stopPropagation();
                if (item.cantidad > 1) {
                    item.cantidad -= 1;
                    $(`#cantExtra${index}`).text(item.cantidad);
                    $(`#totalExtra${index}`).text(formatPrice(item.precio * item.cantidad));
                    this.renderResumen(id, sub);
                    this.updatePackageQuantity(id, item.idEvt, item.cantidad);
                }
            });

            contenedor.append(card);
        });
    }

    renderDetails(id_subevent, menu) {
        const contenedor = $(`#detalleMenuSeleccionado-${id_subevent}`);
        if (!menu) return contenedor.empty();

        const detallesMenuHTML = `
        <div class="bg-[#1F2A37] rounded-lg border border-gray-700 shadow-md p-6 text-white">
            <div class="mb-4">
                <h3 class="text-xl font-bold">Detalles del Menú: ${menu.nombre} ${formatPrice(menu.precioPorPersona)} /persona</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                    <h4 class="font-semibold mb-2">Platillos incluidos:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        ${menu.platillos.map(p => `<li>${p.nombre}</li>`).join("")}
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-2">Bebidas incluidas:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        ${menu.bebidas.map(b => `<li>${b.nombre}</li>`).join("")}
                    </ul>
                </div>
            </div>
            <div class="mt-6 text-right">
                <button onclick="sub.cerrarDetallesMenu('#detalleMenuSeleccionado-${id_subevent}')" class="text-blue-400 hover:underline">Cerrar detalles</button>
            </div>
        </div>
    `;

        contenedor.html(detallesMenuHTML);
    }
}
