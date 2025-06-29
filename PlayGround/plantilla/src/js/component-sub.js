class SubEvent {

    // Menu.

    async addMenu(id) {

        let response = await useFetch({
            url: api,
            data: { opc: "getSubEventMenus", subevent_id: id }
        });

        let initMenu = await useFetch({ url: api, data: { opc: "getInitMenu", subevent_id: id } });

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


        // Interfaz.
        const paquetes = `
            <div class="md:col-span-2">
            <div class="bg-[#1F2A37] rounded-lg border border-gray-700 shadow-md p-6 text-white">
                <div class="mb-4">
                <h3 class="text-xl font-bold">${opts.title}</h3>
                <p class="text-sm text-gray-400">Elija uno o más menús/paquetes y la cantidad de personas</p>
                </div>
                <form id="formMenu${opts.id
            }" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <div class="detalleMenuSeleccionado mt-6"></div>
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

            // Evento eliminar
            card.find(".btn-eliminar").on("click", (e) => {
                e.stopPropagation();
                app.deletePackage(id, item.menu.idEvt);
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

                app.deleteExtra(id, item.idEvt);
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


    async addPackage(id) {
        const form = $(`#formMenu${id}`);
        const idMenu = form.find(".selectMenu").val();
        const cantidad = parseInt(form.find(".cantidadPersonas").val());

        if (!idMenu || cantidad <= 0) {
            alert({ icon: "warning", text: "Debe seleccionar un paquete y una cantidad válida." });
            return;
        }

        const response = await useFetch({
            url: api,
            data: {
                opc: "addPackage",
                package_id: idMenu,
                quantity: cantidad,
                subevent_id: id
            },
        });

        if (response.status === 200) {
            this.renderPackages(id, response.sub);
            this.renderResumen(id, response.sub);
        } else {
            alert(response.message);
        }
    }

    async deletePackage(targetId, menuId) {

        const response = await useFetch({
            url: api,
            data: { opc: "deletePackage", subevent_id: targetId, id: menuId },
        });

        if (response.status === 200) {

            this.renderResumen(targetId, response.sub);
            this.renderPackages(targetId, response.sub);

        } else {
            alert(response.message);
        }

    }

    async updatePackageQuantity(targetId, menuId, newQuantity) {
        const response = await useFetch({
            url: api,
            data: {
                opc: "updatePackageQuantity",
                subevent_id: targetId,
                id: menuId,
                quantity: newQuantity
            },
        });

        if (response.status === 200) {
            this.renderResumen(targetId, response.sub);
        } else {
            alert(response.message);
        }
    }

    async addExtra(id) {
        const form = $(`#formExtra${id}`);
        const idExtra = form.find(".selectExtra").val();
        const cantidad = parseInt(form.find(".extraCantidad").val());

        if (!idExtra || cantidad <= 0) {
            alert({ icon: "warning", text: "Debe seleccionar un extra y una cantidad válida." });
            return;
        }

        const response = await useFetch({
            url: api,
            data: {
                opc: "addExtra",
                product_id: idExtra,
                quantity: cantidad,
                subevent_id: id
            },
        });

        if (response.status === 200) {
            console.log('add extra ', response)
            this.renderExtras(id, response.sub);
            this.renderResumen(id, response.sub);
        } else {
            alert(response.message);
        }
    }

    async deleteExtra(targetId, menuId) {
        console.log(targetId, menuId);
        const response = await useFetch({
            url: api,
            data: {
                opc: "deleteExtra",
                subevent_id: targetId,
                id: menuId,
            },
        });

        if (response.status === 200) {
            this.renderResumen(targetId, response.sub);
            this.renderExtras(targetId, response.sub);
        } else {
            alert(response.message);
        }
    }


    async layoutMenu(id, isEdit) {
        // $('#containerInfo' + id).empty();
        // let menusPrecargadosData = await useFetch({ url: link, data: { opc: "getPackages" } });
        // let extrasDisponiblesData = await useFetch({ url: link, data: { opc: "getProducts" } });
        // let clasificacionesData = await useFetch({ url: link, data: { opc: "getClassifications" } });

        // let menusPrecargados = menusPrecargadosData.data;
        // let extrasDisponibles = extrasDisponiblesData.data;
        // let clasificaciones = clasificacionesData.data;

        $('#containerInfo' + id).append(`
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

              <!-- Card Selecciona Paquetes -->
              <div id="divPaquetes-${id}" class="md:col-span-2">
                <div class="bg-[#1F2A37] rounded-lg border border-gray-700 shadow-md p-6 text-white">
                  <div class="mb-4">
                    <h3 class="text-xl font-bold">Selecciona Paquetes</h3>
                    <p class="text-sm text-gray-400">Elija uno o más menús/paquetes y la cantidad de personas</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label for="selectMenu-${id}" class="block text-sm font-medium text-gray-300 mb-1">Paquete Precargado</label>
                      <select id="selectMenu-${id}" class="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2">
                        <option value="">Seleccione un menú</option>
                      </select>
                    </div>
                    <div>
                      <label for="cantidadPersonas-${id}" class="block text-sm font-medium text-gray-300 mb-1">Cantidad</label>
                      <input type="number" min="1" value="1" id="cantidadPersonas-${id}" class="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2" />
                    </div>
                    <div class="flex items-end">
                      <button id="btnAgregarMenu-${id}" class="w-full flex items-center justify-center gap-2 bg-[#1A56DB] hover:bg-[#274DCD] text-white font-medium py-2 px-4 rounded-md">
                        <i class="icon-plus-circle"></i> Agregar Menú
                      </button>
                    </div>
                  </div>

                  <hr class="border-gray-700 mb-4" />

                  <div>
                    <h4 class="font-semibold text-white mb-2">Menús seleccionados</h4>
                    <div id="contentPaquetes-${id}" class="bg-gray-900 text-gray-400 p-4 rounded-md text-center">
                      No hay menús seleccionados
                    </div>
                    <div id="detalleMenuSeleccionado-${id}" class="mt-6"></div>

                  </div>
                </div>
              </div>

              <!-- Card Resumen -->
              <div id="divResumen-${id}">
                <div class="bg-[#1F2A37] h-full rounded-lg border border-gray-700 shadow-md p-6 text-white">
                  <div class="mb-4">
                    <h3 class="text-xl font-bold">Resumen del Pedido</h3>
                    <p class="text-sm text-gray-400">Detalles de su selección</p>
                  </div>

                  <div id="contentResumen-${id}" class="bg-gray-900 text-gray-400 p-4 rounded-md text-center">
                    Seleccione al menos un menú para ver el resumen
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Agregar Extras -->
            <div id="divExtras-${id}" class="col-span-3 mt-4 d-none">
                <div class="bg-[#1F2A37] rounded-lg border border-gray-700 shadow-md p-6 text-white">
                    <div class="mb-4">
                    <h3 class="text-xl font-bold">Agregar Extras</h3>
                    <p class="text-sm text-gray-400">Personalice su menú con opciones adicionales</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Formulario para agregar -->
                        <div>
                            <div class="mb-4">
                                <h4 class="font-semibold mb-2">Extras predefinidos</h4>
                                <div class="flex gap-2">
                                    <select id="selectExtra-${id}" class="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2">
                                        <option value="">Seleccione un extra</option>
                                    </select>
                                    <input id="extraCantidad-${id}" type="number" min="1" value="1" class="w-20 rounded-md bg-gray-800 text-white border border-gray-600 p-2" placeholder="Cantidad">
                                    <button id="btnAgregarExtra" class="w-50 px-4 py-2 text-white rounded bg-[#1A56DB] hover:bg-[#274DCD]"><i class="icon-plus-circle"></i>Agregar</button>
                                </div>
                            </div>

                            <div class="mb-4">
                                <h4 class="font-semibold mb-2">Extra personalizado</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label class="block text-sm text-gray-300 mb-1">Nombre del platillo</label>
                                        <input id="extraNombre-${id}" type="text" class="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2" placeholder="Ej. Postre especial">
                                    </div>
                                    <div>
                                        <label class="block text-sm text-gray-300 mb-1">Clasificación</label>
                                        <select id="selectClass-${id}" class="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2">
                                            <option value="">Seleccione una clasificación</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm text-gray-300 mb-1">Precio (MXN)</label>
                                        <input id="extraPrecio-${id}" type="number" min="0" class="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2" placeholder="Ej. 250">
                                    </div>
                                    <div>
                                        <label class="block text-sm text-gray-300 mb-1">Cantidad</label>
                                        <input id="extraCantidadCustom-${id}" type="number" min="1" value="1" class="w-full rounded-md bg-gray-800 text-white border border-gray-600 p-2" placeholder="Cantidad">
                                    </div>

                                    <div>
                                        <button id="btnAgregarExtraPersonalizado-${id}" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1A56DB] text-white rounded hover:bg-[#274DCD]">
                                            <i class="icon-plus-circle"></i> Agregar extra personalizado
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Lista de extras agregados -->
                        <div>
                            <h4 class="font-semibold mb-2">Extras agregados</h4>
                            <div id="contentExtras-${id}"  class="bg-gray-900 text-gray-400 p-4 rounded-md min-h-[300px] overflow-auto text-center">
                            No hay extras agregados
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 text-right">
                        <button id="saveMenuEvent-${id}" class="px-6 py-2 font-semibold rounded-md bg-[#1A56DB] hover:bg-[#274DCD]">Guardar</button>
                    </div>
                </div>
            </div>

          `);


        // MENUS PRECARGADOS --------------------
        // Cargar opciones en el select
        menusPrecargados.forEach(menu => {
            $(`#selectMenu-${id}`).append(`<option value="${menu.id}">${menu.nombre} - $${menu.precioPorPersona}/persona</option>`);
        });

        // Escuchar clic en Agregar Menú
        $(`#btnAgregarMenu-${id}`).on("click", () => {
            let idSeleccionado = $(`#selectMenu-${id}`).val();
            let cantidad = parseInt($(`#cantidadPersonas-${id}`).val()) || 1;
            let menu = menusPrecargados.find(m => m.id == idSeleccionado);

            if (!menu) return;

            let existente = this.menusSeleccionados.find(item => item.menu.id == idSeleccionado);

            if (existente) {
                existente.cantidadPersonas += cantidad;
            } else {
                this.menusSeleccionados.push({ menu, cantidadPersonas: cantidad });
            }

            $(`#divExtras-${id}`).removeClass("d-none");
            $(`#selectMenu-${id}`).val("");
            $(`#cantidadPersonas-${id}`).val(1);

            sub.renderPaquetes("#contentPaquetes-" + id);
            sub.renderResumen("#contentResumen-" + id);
        });


        // Función para cambiar cantidad de personas
        window.cambiarCantidad = (index, delta) => {
            let nuevaCantidad = sub.menusSeleccionados[index].cantidadPersonas + delta;
            if (nuevaCantidad > 0) {
                sub.menusSeleccionados[index].cantidadPersonas = nuevaCantidad;
                sub.renderPaquetes("#contentPaquetes-" + id);
                sub.renderResumen("#contentResumen-" + id);
            }
        };

        // Función para eliminar menú
        window.eliminarMenu = (index) => {
            sub.menusSeleccionados.splice(index, 1);
            if (sub.menusSeleccionados.length == 0) {
                $(`#divExtras-${id}`).addClass("d-none");
            }
            sub.renderPaquetes("#contentPaquetes-" + id);
            sub.renderResumen("#contentResumen-" + id);
        };



        // EXTRAS ------------------------------
        extrasDisponibles.forEach(extra => {
            $(`#selectExtra-${id}`).append(`<option value="${extra.id}">${extra.nombre} - $${extra.precio}</option>`);
        });

        // Evento único de Agregar Extra
        $(document).off("click", "#btnAgregarExtra").on("click", "#btnAgregarExtra", () => {
            let idExtra = $(`#selectExtra-${id}`).val();
            let cantidad = parseInt($(`#extraCantidad-${id}`).val()) || 1;
            let extra = extrasDisponibles.find(e => e.id == idExtra);

            if (extra && cantidad > 0) {
                let yaExiste = this.extrasSeleccionados.find(e => e.id == extra.id && !e.custom);
                if (yaExiste) {
                    yaExiste.cantidad += cantidad;
                } else {
                    this.extrasSeleccionados.push({
                        ...extra,
                        cantidad,
                        total: extra.precio * cantidad,
                        custom: false
                    });
                }

                $(`#selectExtra-${id}`).val("");
                $(`#extraCantidad-${id}`).val("1");
                sub.renderExtras("#contentExtras-" + id);
                sub.renderResumen("#contentResumen-" + id);
            }
        });

        // Evento de Extra Personalizado
        $(document).off("click", `#btnAgregarExtraPersonalizado-${id}`).on("click", `#btnAgregarExtraPersonalizado-${id}`, () => {
            let nombre = $(`#extraNombre-${id}`).val().trim();
            let precio = parseFloat($(`#extraPrecio-${id}`).val());
            let cantidad = parseInt($(`#extraCantidadCustom-${id}`).val()) || 1;
            let id_classification = $(`#selectClass-${id}`).val();

            if (nombre && !isNaN(precio) && precio > 0 && cantidad > 0 && id_classification) {
                let data = {
                    opc: "addProduct",
                    name: nombre,
                    price: precio,
                    id_classification,
                };

                fn_ajax(data, link).then((response) => {
                    if (response.status == 200 && response.data.id) {
                        this.extrasSeleccionados.push({
                            id: response.data.id,
                            nombre,
                            precio,
                            cantidad,
                            id_clasificacion: id_classification,
                            custom: true
                        });

                        alert({
                            icon: "success",
                            text: response.message,
                            timer: 1000
                        });

                        // Limpiar inputs
                        $(`#extraNombre-${id}`).val("");
                        $(`#extraPrecio-${id}`).val("");
                        $(`#extraCantidadCustom-${id}`).val("1");
                        $(`#selectClass-${id}`).val("");

                        sub.renderExtras("#contentExtras-" + id);
                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Ok"
                        });
                    }
                });
            }
        });

        // Render Extras
        // Hacer pública la función para botón eliminar
        window.eliminarExtra = (index) => {
            this.extrasSeleccionados.splice(index, 1);
            sub.renderExtras("#contentExtras-" + id);
            sub.renderResumen("#contentResumen-" + id);
        };

        // Función para cambiar cantidad de extras
        window.cambiarCantidadExtra = (index, delta) => {
            let extra = sub.extrasSeleccionados[index];
            let nuevaCantidad = extra.cantidad + delta;

            if (nuevaCantidad > 0) {
                extra.cantidad = nuevaCantidad;
                sub.renderExtras("#contentExtras-" + id);
                sub.renderResumen("#contentResumen-" + id);
            }
        };

        // CLASIFICACIONES -------------------
        this.clasificaciones = clasificaciones;
        clasificaciones.forEach(clas => {
            $("#selectClass").append(`<option value="${clas.id}">${clas.nombre}</option>`);
        });

        // GUARDAR MENÚ ----------------------
        $(`#saveMenuEvent-${id}`).on("click", () => {
            // Validar que se haya guardado el evento
            if (!id_subevent || id_subevent == 0) {
                alert({
                    icon: "error",
                    text: "No has creado un evento aún.",
                    btn1: true,
                    btn1Text: "Ok"
                });
                return;
            }

            // Validar que se haya seleccionado al menos un menú
            if (sub.menusSeleccionados.length == 0) {
                alert({
                    icon: "error",
                    text: "Agrega al menos un menú",
                    btn1: true,
                    btn1Text: "Ok"
                });
                return;
            }

            // Detectar si es edición o creación
            let action = "editSubEventMenus";
            if (isEdit == false) {
                action = "addSubEventMenus";
            }

            let data = {
                opc: action,
                id_subevent: id,
                menus: JSON.stringify(sub.menusSeleccionados),
                extras: JSON.stringify(sub.extrasSeleccionados),
                total: $(`#pagoTotal`).text().replace("$", "").replace(",", "")
            };

            fn_ajax(data, this._link).then((response) => {
                if (response.status == 200) {
                    alert({
                        icon: "success",
                        text: response.message,
                        timer: 2000,
                    });

                    // Solo cerrar si es nuevo (no edición)
                    // if (!isEdit) {
                    //     sub.closeEvent();
                    // }
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok",
                    });
                }
            });
        });
    }
}