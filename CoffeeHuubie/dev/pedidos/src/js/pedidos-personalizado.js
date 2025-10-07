class CustomOrder extends Templates {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "customOrder";
        this.currentStep = 0;
        this.selectedOptions = {};
        this.numeroPorciones = 1;
    }

    render() {
        custom.modalAddCustomOrder();
    }

    modalAddCustomOrder() {
        const html = `
            <div id="pastelModalRoot" class="w-full">
                <main class="max-w-6xl mx-auto px-6 py-6 space-y-10" id="modalContent">

                    <!-- Título y subtítulo -->
                    <section class="text-center space-y-4">
                        <h2 class="text-4xl font-bold text-violet-300">
                            ¡Bienvenido a tu experiencia de repostería!✨
                        </h2>
                        <p class="text-lg text-gray-300 max-w-2xl mx-auto">
                            Personaliza cada detalle para hacer algo único y delicioso.
                        </p>
                    </section>

                    <!-- Progreso -->
                    <section class="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow space-y-4" id="progressSection">
                    </section>

                    <!-- Contenido principal -->
                    <section class="grid lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2 space-y-6" id="optionsSection"></div>
                        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow space-y-2" id="previewSection"></div>
                    </section>

                    <!-- Botones -->
                    <div class="flex justify-end mt-3 px-6 pb-6">
                        <button id="btnCancelar" class="border border-gray-700 px-4 py-1 rounded-full text-sm text-gray-400 hover:bg-gray-700 me-2" onclick="bootbox.hideAll()">Cancelar</button>
                        <button id="btnGuardar" class="border border-violet-500 px-4 py-1 rounded-full text-sm text-violet-300 hover:bg-violet-700/30">Guardar</button>
                    </div>
                </main>
            </div>
        `;

        const modalCustom = bootbox.dialog({
            title: `🎂 ¡Arma tu pastel!`,
            size: "extra-large",
            id: "modalArmarPastel",
            closeButton: true,
            message: html,
        });

        modalCustom.on("shown.bs.modal", async function () {
            custom.renderProgress();
            custom.renderOptions();
            custom.renderPreview();
            custom.renderNavigation();
            custom.actualizarEstilosPasos();
            $("#btnGuardar").on("click", function () {
                const canClose = custom.handleFinished();
            });
        });
    }

    // Renderiza el progreso del pedido
    renderProgress() {
        // Html
        const parent = $("#progressSection");
        parent.html(`
            <div class="flex justify-between items-center">
                <div class="flex gap-3 items-center">
                <span class="text-violet-400 text-xl">👨‍🍳</span>
                <div>
                    <h3 class="text-lg font-semibold text-violet-300">
                    Progreso de tu pastel
                    </h3>
                    <p id="progresoTexto" class="text-sm text-gray-400">
                    0 de 5 pasos completados
                    </p>
                </div>
                </div>
                <span id="progresoBadge" class="px-3 py-1 text-sm font-medium rounded-full bg-violet-700/30 text-violet-300">0 / 5</span>
            </div>

            <div class="w-full bg-gray-700 rounded h-3 overflow-hidden">
                <div id="barraProgreso" class="bg-violet-500 h-3 transition-all duration-500" style="width: 0%"></div>
            </div>

            <div class="flex justify-between text-sm text-gray-500 font-medium" id="stepButtonsContainer">
            </div>
        `);

        // Verificar la data (viene de app)
        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            parent.append('<div class="text-red-400">Error: No se encontraron categorías de pastel.</div>');
            return;
        }

        // FUNCIONALIDAD.
        // Variables
        const $progresoTexto = parent.find("#progresoTexto");
        const $progresoBadge = parent.find("#progresoBadge");
        const $barraProgreso = parent.find("#barraProgreso");
        const $stepButtonsContainer = parent.find("#stepButtonsContainer").empty();
        const categorias = categories;
        let completados = 0;


        // Botones de paso
        categories.forEach((cat, index) => {
            const $btn = $(`
              <button class="step-button flex flex-col items-center min-w-[80px] gap-1 p-2 rounded-lg text-xs ${index === 0 ? "bg-violet-700/30 text-violet-300" : "text-gray-500 hover:text-violet-300"}">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-violet-500 text-white" : "bg-gray-700"}">${index + 1}</div>
                <span class="hidden sm:block">${cat.name}</span>
              </button>
            `);
            $btn.on("click", function () {
                custom.currentStep = index;
                custom.renderProgress();
                custom.renderOptions();
                custom.renderNavigation();
                custom.actualizarEstilosPasos();
            });
            $stepButtonsContainer.append($btn);
        });

        // Calcula progreso
        categorias.forEach(cat => {
            const sel = custom.selectedOptions[cat.id];
            const isMulti = cat.isExtra == 1 || /decoraci/i.test(cat.name || "");
            const done = isMulti ? (Array.isArray(sel) && sel.length > 0) : !!sel;

            if (done) completados++;
        });

        const porcentaje = (completados / categorias.length) * 100;
        $barraProgreso.css("width", porcentaje + "%");
        $progresoBadge.text(`${completados} / ${categorias.length}`);
        $progresoTexto.text(
            completados === categorias.length
                ? "¡Tu pastel está listo! 🎉"
                : `${completados} de ${categorias.length} pasos completados`
        );

        // Actualizar estilos
        let $stepButtons = parent.find(".step-button");
        custom.actualizarEstilosPasos($stepButtons);
    }

    // Renderiza las opciones del paso actual
    renderOptions() {
        const parent = $("#optionsSection").empty();
        if (!categories || !Array.isArray(categories) || categories.length == 0) return;

        const cat = categories[custom.currentStep];
        if (!cat) return;

        // Renderiza las opciones
        parent.append(`
            <!-- Botones de navegación -->
            <div class="flex justify-end items-center">
                <div class="flex gap-2">
                    <button id="btnAnterior" class="border border-gray-700 px-4 py-1 rounded-full text-sm text-gray-400 hover:bg-gray-700">Anterior</button>
                    <button id="btnSiguiente" class="border border-violet-500 px-4 py-1 rounded-full text-sm text-violet-300 hover:bg-violet-700/30">Siguiente</button>
                </div>
            </div>

            <!-- Opciones para armar tu pastel -->
            <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow space-y-2">
                <div class="flex items-center justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-3xl">🔷</span>
                            <p id="tituloPaso" class="text-lg font-bold text-violet-300">Paso ${custom.currentStep + 1}: ${cat.name}</p>
                        </div>
                    </div>
                    <div>
                        <button id="btnAgregarOpcion" class="border border-gray-500 px-4 py-1 rounded-full text-sm text-gray-300 hover:bg-violet-700/30">+ Opción</button>
                    </div>
                </div>
                <div id="opcionesPaso" class="grid md:grid-cols-2 gap-4 pt-3">
                </div>
            </div>
        `);

        const $opcionesPaso = parent.find("#opcionesPaso");

        // MÚLTIPLES SELECCIONES (Decoraciones)
        const isMulti = cat.isExtra == 1 || /decoraci/i.test(cat.name || "");

        if (isMulti) {
            // Interfaz para varias selecciones (Select + cantidad + botón)
            const $uiWrap = $(`
                <div class="col-span-1 md:col-span-2">
                    <div class="flex flex-wrap items-end gap-3">
                        <div class="flex-1 min-w-[220px]">
                            <label class="block text-xs text-gray-400 mb-1">Decoración</label>
                            <select id="decorSelect" class="w-full border border-gray-700 bg-gray-800 text-gray-200 rounded px-3 py-2">
                                ${(cat.options || []).map(o => `<option value="${o.id}">${o.name}</option>`).join("")}
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs text-gray-400 mb-1">Cantidad</label>
                            <input id="decorQty" type="number" min="1" value="1" class="w-24 border border-gray-700 bg-gray-800 text-gray-200 rounded px-3 py-2 text-right"/>
                        </div>
                        <div>
                            <label class="block text-xs text-transparent mb-1">.</label>
                            <button id="btnAddDecor" class="px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 text-white" onclick="custom.handleAddDecor()">
                                + Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `);

            // Lista de decoraciones agregadas
            const $listWrap = $(`
                <div class="col-span-1 md:col-span-2" id="listWrap">
                    <div id="decorScroll" class="max-h-[40vh] lg:max-h-[40vh] overflow-y-auto overscroll-contain">
                        <div id="decorList" class="space-y-3">
                            
                        </div>
                    </div>
                </div>
            `);

            $opcionesPaso.append($uiWrap);
            $opcionesPaso.append($listWrap);

            custom.renderDecorList();
        } else {
            const selected = custom.selectedOptions[cat.id];
            (cat.options || []).forEach((opt) => {
                const isSelected = selected && selected.id == opt.id;
                const $btn = $(`
                    <button
                    class="group border border-gray-700 px-4 py-2 rounded-lg w-full transition-all duration-300
                            flex items-center justify-between gap-3
                            ${isSelected
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold scale-105 border-transparent"
                        : "hover:bg-gray-700 text-gray-200"}"
                    type="button">
                    <span class="truncate">${opt.name}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full
                                ${isSelected ? "bg-white/20 text-white" : "bg-gray-700 text-gray-300"}">
                        ${custom.formatPrice(opt.price)}
                    </span>
                    </button>
                `);

                $btn.on("click", () => {
                    if (custom.selectedOptions[cat.id] && custom.selectedOptions[cat.id].id == opt.id) {
                        custom.selectedOptions[cat.id] = null;
                    } else {
                        custom.selectedOptions[cat.id] = { id: opt.id, name: opt.name, price: parseFloat(opt.price || 0) };
                    }
                    custom.renderProgress();
                    custom.renderOptions();
                    custom.renderPreview();
                    custom.renderNavigation();
                    custom.actualizarEstilosPasos();
                });

                $opcionesPaso.append($btn);
            });
        }
    }

    // Render de la lista
    renderDecorList() {
        const cat = categories[custom.currentStep];
        if (!cat) return;
        if (!Array.isArray(custom.selectedOptions[cat.id])) custom.selectedOptions[cat.id] = [];
        let items = custom.selectedOptions[cat.id];
        const $parent = $("#decorScroll").find("#decorList").empty();

        if (!items.length) {
            $parent.html(`
                <div class="text-sm text-gray-400 border border-dashed border-gray-700 rounded p-3 text-center">
                    No hay decoraciones agregadas.
                </div>
            `);
            return;
        }

        items.forEach((it, i) => {
            const lineTotal = (parseFloat(it.price || 0) * (it.qty || 1));

            const $row = $(`
                <div class="flex items-center justify-between gap-3 bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                    <div class="flex-1">
                        <div class="text-gray-200 font-medium">${it.name}</div>
                        <div class="text-xs text-gray-400">Precio unitario: ${formatPrice(it.price)}</div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button class="btn-minus border border-gray-700 rounded px-2 py-1 hover:bg-gray-700">−</button>
                        <input type="text" class="qty-input w-12 text-center border border-gray-700 bg-gray-800 text-gray-200 rounded px-2 py-1" value="${it.qty || 1}" />
                        <button class="btn-plus border border-gray-700 rounded px-2 py-1 hover:bg-gray-700">+</button>
                    </div>

                    <div class="w-28 text-right font-semibold text-emerald-400">${formatPrice(lineTotal)}</div>
                    <button class="btn-remove text-gray-400 hover:text-red-400" title="Quitar"><i class="icon-trash text-red-400 hover:text-red-500"></i></button>
                </div>
            `);

            $row.find(".btn-minus").on("click", () => {
                items[i].qty = Math.max(1, (items[i].qty || 1) - 1);
                custom.renderPreview();
            });
            $row.find(".btn-plus").on("click", () => {
                items[i].qty = (items[i].qty || 1) + 1;
                custom.renderPreview();
            });
            $row.find(".qty-input").on("input", function () {
                let v = parseInt($(this).val() || "0", 10);
                if (Number.isNaN(v) || v < 1) v = 1;
                items[i].qty = v;
                custom.renderPreview();
            });
            $row.find(".btn-remove").on("click", () => {
                items.splice(i, 1);
                custom.renderProgress();
                custom.renderOptions();
                custom.renderPreview();
                custom.renderNavigation();
                custom.actualizarEstilosPasos();
            });

            $parent.prepend($row);
        });
    }

    // Agrega una decoración
    handleAddDecor() {
        const $root = $("#modalArmarPastel");
        const cat = categories[custom.currentStep];
        if (!cat) return;

        const selectedId = parseInt($root.find("#decorSelect").val(), 10);
        const qty = parseInt($root.find("#decorQty").val(), 10) || 1;

        if (!selectedId) return;
        const option = (cat.options || []).find(o => o.id == selectedId);

        if (!option) return;
        if (!Array.isArray(custom.selectedOptions[cat.id])) custom.selectedOptions[cat.id] = [];


        const items = custom.selectedOptions[cat.id];
        const existing = items.find(i => i.id == selectedId);
        if (existing) {
            existing.qty = (existing.qty || 1) + qty;
        } else {
            items.push({ id: option.id, name: option.name, price: parseFloat(option.price || 0), qty });
        }
        custom.renderProgress();
        custom.renderOptions();
        custom.renderPreview();
        custom.renderNavigation();
        custom.actualizarEstilosPasos();
        custom.renderDecorList();
    }

    // Renderiza la vista previa y el precio sugerido
    renderPreview() {
        const parent = $("#previewSection").empty();
        parent.append(`
            <div class="text-center">
                <div class="text-3xl animate-bounce">🎂</div>
                <span class="text-lg font-bold text-violet-300 mb-2">Vista previa de tu pastel</span>
                <div class="mt-2 text-sm text-gray-400">El precio sugerido se basa en las porciones.</div>
            </div>
            <div class="mt-4">
                <label for="porciones" class="block text-sm font-medium text-gray-300 mb-1">Número de porciones</label>
                <input type="text" id="porciones" class="w-full border border-gray-700 bg-gray-800 text-gray-200 rounded px-3 py-2 text-right" oninput="custom.calculateSuggestedPrice(this)" />
            </div>

            <div class="mt-4 flex justify-between items-center border-t border-violet-700 pt-2 font-bold text-violet-300">
                <span>💜 Precio sugerido:</span>
                <span id="precioSugerido">$0.00</span>
            </div>
            
        
            <div id="previewDetails" class="space-y-1"></div>
            <div class="mt-4">
                <label for="precioReal" class="block text-sm font-medium text-gray-300 mb-1">Precio real:</label>
                    <div class="flex items-center border border-gray-700 bg-gray-800 text-gray-200 rounded mt-2 w-full">
                        <span class="px-3 text-gray-400">$</span>
                        <input type="text" 
                                id="precioReal" 
                                class="w-full bg-gray-800 px-3 py-2 text-right" 
                                placeholder="Precio real" 
                                oninput="custom.formatCifra(this)">
                    </div>
            </div>
        `);

        const detalles = parent.find("#previewDetails").empty();


        if (!categories || !Array.isArray(categories) || categories.length == 0) return;

        let total = 0;
        categories.forEach(cat => {
            const sel = custom.selectedOptions[cat.id];
            if (!sel) return;

            const isMulti = cat.isExtra == 1 || /decoraci/i.test(cat.name || "");
            if (isMulti) {
                const items = Array.isArray(sel) ? sel : [];
                if (!items.length) return;
                detalles.append(`<div class="text-sm font-semibold text-violet-300 mt-3">${cat.name}</div>`);
                items.forEach(it => {
                    const lineTotal = parseFloat(it.price || 0) * (it.qty || 1);
                    total += lineTotal;
                    detalles.append(`
                        <div class="flex justify-between items-center border-t border-gray-700 py-1 text-sm">
                            <span class="text-gray-200"><span class="text-violet-300">x${it.qty || 1}</span> ${it.name}</span>
                            <span class="text-violet-400 font-semibold">${custom.formatPrice(lineTotal)}</span>
                        </div>
                    `);
                });
            } else {
                const lineTotal = parseFloat(sel.price || 0);
                total += lineTotal;
                detalles.append(`
                    <div class="grid grid-cols-3 items-center border-t border-gray-700 py-1 text-sm">
                        <span class="font-medium text-violet-300 justify-self-start">${cat.name}:</span>
                        <span class="text-gray-200 justify-self-start">${sel.name}</span>
                        <span class="text-violet-400 font-semibold justify-self-end">${custom.formatPrice(lineTotal)}</span>
                    </div>
                `);
            }
        });

        if (total > 0) {
            $("#porciones").val(custom.numeroPorciones || "1");
            let numeroPorciones = parseFloat($("#porciones").val()) || 1;
            let totalSugerido = total * numeroPorciones;
            detalles.append(`
                <div class="flex justify-between items-center border-t border-violet-700 mt-2 pt-2 font-bold text-violet-300">
                    <span>Total:</span>
                    <span>${custom.formatPrice(total)}</span>
                </div>
            `);
            $("#precioSugerido").text(custom.formatPrice(totalSugerido));
        } else {
            $("#porciones").val("1");
            $("#precioSugerido").text("$0.00");
        }
    }

    // Renderiza la navegación (botones anterior/siguiente)
    renderNavigation() {
        const $btnAnterior = $("#btnAnterior");
        const $btnSiguiente = $("#btnSiguiente");
        if (!categories || !Array.isArray(categories) || categories.length === 0) return;

        $btnAnterior.prop("disabled", custom.currentStep == 0);
        $btnSiguiente.prop("disabled", custom.currentStep == categories.length - 1);

        $btnAnterior.off("click").on("click", () => {
            if (custom.currentStep > 0) custom.currentStep--;
            custom.renderProgress();
            custom.renderOptions();
            custom.renderPreview();
            custom.renderNavigation();
            custom.actualizarEstilosPasos();
        });
        $btnSiguiente.off("click").on("click", () => {
            if (custom.currentStep < categories.length - 1) custom.currentStep++;
            custom.renderProgress();
            custom.renderOptions();
            custom.renderPreview();
            custom.renderNavigation();
            custom.actualizarEstilosPasos();
        });
    }

    // Actualiza los estilos de los botones de paso según el estado
    actualizarEstilosPasos() {
        let parent = $("#stepButtonsContainer").find(".step-button");
        parent.each(function (index) {
            const $btn = $(this);
            const $circle = $btn.find("div").first();
            const cat = categories[index];
            const sel = cat ? custom.selectedOptions[cat.id] : null;

            // Detecta multi por flag o por nombre
            const isMulti = !!(cat && (cat.isExtra == 1 || /decoraci/i.test(cat.name || "")));
            const done = isMulti ? (Array.isArray(sel) && sel.length > 0) : !!sel;

            if (index === custom.currentStep) {
                // Paso actual
                $btn
                    .removeClass("text-gray-500 hover:text-violet-300 text-green-500 bg-violet-700/30 text-violet-300 hover:text-purple-600")
                    .addClass("bg-violet-700/30 text-violet-300");

                $circle
                    .removeClass("bg-gray-700 bg-green-500")
                    .addClass("bg-violet-500 text-white");
            } else if (done) {
                // Paso completado
                $btn
                    .removeClass("bg-violet-700/30 text-violet-300 text-gray-500 hover:text-violet-300 hover:text-purple-600")
                    .addClass("text-green-500");

                $circle
                    .removeClass("bg-gray-700 bg-violet-500")
                    .addClass("bg-green-500 text-white");
            } else {
                // Paso pendiente
                $btn
                    .removeClass("bg-violet-700/30 text-violet-300 text-green-500 hover:text-purple-600")
                    .addClass("text-gray-500 hover:text-violet-300");

                $circle
                    .removeClass("bg-violet-500 bg-green-500 text-white")
                    .addClass("bg-gray-700");
            }
        });
    }




    handleFinished() {
        const $root = $("#modalArmarPastel");
        const missingCats = [];
        const payload = [];  // lo que enviarías al backend
        let total = 0;

        // Helper para detectar categoría multi (Decoraciones)
        const isMultiCategory = (cat) => {
            return !!(cat && (cat.isExtra == 1 || /decoraci/i.test(cat.name || "")));
        };

        // Función para marcar pasos incompletos
        const markIncompleteSteps = (missingIds = []) => {
            const set = new Set(missingIds);
            $root.find(".step-button").each(function (index) {
                const cat = categories[index];
                const $btn = $(this);
                if (cat && set.has(cat.id)) {
                    $btn.addClass("ring-2 ring-red-500");
                } else {
                    $btn.removeClass("ring-2 ring-red-500");
                }
            });
        };

        categories.forEach(cat => {
            const sel = custom.selectedOptions[cat.id];
            const multi = isMultiCategory(cat);

            if (multi) {
                const items = Array.isArray(sel) ? sel.filter(it => it && (parseInt(it.qty, 10) >= 1)) : [];
                if (items.length === 0) {
                    missingCats.push({ id: cat.id, name: cat.name });
                } else {
                    // Totaliza y arma payload
                    const mapItems = items.map(it => {
                        const qty = parseInt(it.qty, 10) || 1;
                        const price = parseFloat(it.price || 0);
                        total += (price * qty);
                        return { id: it.id, name: it.name, price, qty };
                    });
                    payload.push({ categoryId: cat.id, category: cat.name, items: mapItems });
                }
            } else {
                if (!sel || sel.id == null) {
                    missingCats.push({ id: cat.id, name: cat.name });
                } else {
                    const price = parseFloat(sel.price || 0);
                    total += price;
                    payload.push({ categoryId: cat.id, category: cat.name, item: { id: sel.id, name: sel.name, price } });
                }
            }
        });

        if (missingCats.length > 0) {
            // Marca pasos incompletos y alerta
            markIncompleteSteps(missingCats.map(m => m.id));

            const lista = missingCats.map(m => `• ${m.name}`).join("<br>");
            bootbox.alert({
                title: "Faltan campos por completar",
                message: `Por favor completa las siguientes categorías antes de guardar:<br><br>${lista}`
            });
            return false; // evita que se cierre el modal
        }

        // Limpia marcas de error si todo OK
        markIncompleteSteps([]);

        // Si quieres ver el payload y total:
        console.log("Payload listo para backend:", payload);
        const totalSugerido = $root.find("#precioSugerido").text().replace(/[^0-9.-]+/g, "");
        console.log("Total sugerido (limpio):", totalSugerido);
        const priceRealStr = $root.find("#precioReal").val().replace(/,/g, "");
        const priceReal = parseFloat(priceRealStr) || total;
        console.log("Precio real ingresado:", priceReal);

        // Abrir modal para insertar el nombre del pedido y confirmar
        bootbox.prompt({
            title: "Nombre del pedido personalizado",
            inputType: 'text',
            placeholder: "Ejemplo: Pastel de cumpleaños para Ana",
            callback: function (result) {
                if (result) {
                    // Aquí puedes enviar 'result' como el nombre del pedido junto con 'payload' y 'total'
                    console.log("Nombre del pedido:", result);
                    // Ejemplo de envío al backend:
                    custom.saveCustomOrder(result, payload, totalSugerido, priceReal);
                    
                }
            }
        });

        return true;
    }

    // Guarda el pedido personalizado
    async saveCustomOrder(orderName, payload, totalSuggested, priceReal) {
        // Preparar datos para enviar
        const orderData = {
            name: orderName,
            price: totalSuggested,
            price_real: priceReal,
            portion_qty: custom.numeroPorciones || 1,
            date_created: new Date().toISOString(),
            orderId: idFolio || null, // idFolio viene de la app.js
        };

        const response = await useFetch({
            url: this._link, data: {
                opc: "addCustomOrder",
                ...orderData
            }
        });

        if (response.status == 200) {
            bootbox.alert("¡Tu pedido personalizado ha sido guardado con éxito! 🎉");
        } else {
            bootbox.alert("Error al guardar el pedido personalizado.");
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const listaProductosDeLaOrden = await useFetch({
            url: 'ctrl/ctrl-pedidos.php', 
            data: {
                opc: "getProductsOrder",
                order_id: idFolio
            }
        });

        // Recargar la lista de pedidos
        normal.showOrder(listaProductosDeLaOrden.data || []);

        bootbox.hideAll();
    }

    // NO SE --------------------------------------------------------
    // Agrega un item al panel de pedidos (#orderItems)
    appendToOrderItems(item) {
        const orderItems = $("#orderItems");

        if (orderItems.length === 0) {
            console.warn('No se encontró el elemento #orderItems');
            return;
        }

        // Crear la tarjeta del pedido personalizado
        const card = $("<div>", {
            class: "flex justify-between items-center bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-sm"
        });

        const info = $("<div>", { class: "flex-1" }).append(
            $("<p>", {
                class: "text-gray-200 font-medium text-sm",
                text: item.name
            }),
            $("<p>", {
                class: "text-violet-400 font-semibold text-sm",
                text: this.formatPrice(item.price)
            }),
            $("<p>", {
                class: "text-gray-400 text-xs",
                text: "Pedido personalizado"
            })
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
                        this.updateOrderItemQuantity(item);
                    }
                }
            }),
            $("<span>", {
                class: "text-gray-200 px-2",
                text: item.quantity
            }),
            $("<button>", {
                class: "bg-gray-700 text-white rounded px-2",
                html: "+",
                click: () => {
                    item.quantity++;
                    this.updateOrderItemQuantity(item);
                }
            }),
            $("<button>", {
                class: "text-blue-400 hover:text-blue-600 ml-2",
                html: `<i class="icon-eye"></i>`,
                title: "Ver detalles",
                click: () => this.showCustomOrderDetails(item)
            }),
            $("<button>", {
                class: "text-gray-400 hover:text-red-400 ml-1",
                html: `<i class="icon-trash"></i>`,
                title: "Eliminar",
                click: () => {
                    card.remove();
                    this.updateOrderTotal();
                }
            })
        );

        const lineTotal = (item.price || 0) * (item.quantity || 1);
        const totalEl = $("<p>", {
            class: "text-gray-400 text-sm",
            text: `Total: ${this.formatPrice(lineTotal)}`
        });

        actions.append(quantityRow, totalEl);
        card.append(info, actions);
        orderItems.append(card);

        // Actualizar total general si existe
        this.updateOrderTotal();
    }

    // Actualiza la cantidad de un item en el pedido
    updateOrderItemQuantity(item) {
        // Aquí podrías agregar lógica adicional para actualizar el total
        // Por ahora solo actualizamos el display
        this.updateOrderTotal();
    }

    // Actualiza el total del pedido
    updateOrderTotal() {
        let total = 0;
        $("#orderItems").find(".text-sm:contains('Total:')").each(function () {
            const text = $(this).text().replace(/[^0-9.-]+/g, "");
            const num = parseFloat(text);
            if (!isNaN(num)) {
                total += num;
            }
        });

        // Buscar selector de total y actualizarlo
        const totalSelector = $("[id*='total'], .total-amount, #orderTotal");
        if (totalSelector.length > 0) {
            totalSelector.text(this.formatPrice(total));
        }
    }

    // Muestra los detalles del pedido personalizado
    showCustomOrderDetails(item) {
        let detailsHtml = `<div class="space-y-3">`;

        if (item.details && Array.isArray(item.details)) {
            item.details.forEach(detail => {
                detailsHtml += `<div class="border-b border-gray-600 pb-2">`;
                detailsHtml += `<h4 class="font-semibold text-violet-300">${detail.category}</h4>`;

                if (detail.items) {
                    // Categoría múltiple (decoraciones)
                    detail.items.forEach(subItem => {
                        detailsHtml += `<p class="text-sm text-gray-300">• ${subItem.name} (x${subItem.qty}) - ${this.formatPrice(subItem.price * subItem.qty)}</p>`;
                    });
                } else if (detail.item) {
                    // Categoría simple
                    detailsHtml += `<p class="text-sm text-gray-300">${detail.item.name} - ${this.formatPrice(detail.item.price)}</p>`;
                }
                detailsHtml += `</div>`;
            });
        }

        detailsHtml += `</div>`;

        bootbox.dialog({
            title: `Detalles: ${item.name}`,
            message: detailsHtml,
            size: 'large',
            buttons: {
                ok: {
                    label: 'Cerrar',
                    className: 'btn-primary'
                }
            }
        });
    }
    // ---------------------------------------------------------------


    
    formatPrice(price) {
        const num = parseFloat(price) || 0;
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    formatCifra(input) {
        // Quitar caracteres que no sean dígitos o punto
        let valor = input.value.replace(/[^0-9.]/g, "");

        // Permitir solo un punto decimal
        let partes = valor.split(".");
        if (partes.length > 2) {
            valor = partes[0] + "." + partes[1]; // conservar solo la primera parte decimal
        }

        // Si empieza con punto, corregir a "0."
        if (valor.startsWith(".")) {
            valor = "0" + valor;
        }

        // Separar parte entera y decimal
        let [entero, decimal] = valor.split(".");

        // Formatear parte entera con separador de miles
        if (entero) {
            entero = new Intl.NumberFormat("es-MX").format(entero);
        }

        // Reconstruir valor con decimal (si existe)
        input.value = decimal !== undefined ? `${entero}.${decimal}` : entero || "";
    }

    calculateSuggestedPrice(inputPorciones) {
        const $root = $("#modalArmarPastel");
        if ($root.length == 0) return; // No hacer nada si el modal no está abierto

        // Primero normaliza/limpia el input con la función formatCifra
        custom.formatCifra(inputPorciones);

        let total = 0;

        // Sumar todos los subtotales
        $root.find("#previewDetails .text-violet-400").each(function () {
            const text = $(this).text().replace(/[^0-9.-]+/g, "");
            const num = parseFloat(text);
            if (!isNaN(num)) {
                total += num;
            }
        });

        // Ahora obtener porciones (ya limpias por formatCifra)
        let porcionesVal = $(inputPorciones).val().replace(/,/g, "");
        custom.numeroPorciones = parseFloat(porcionesVal) || 1;

        // Calcular sugerido
        let totalSugerido = total * custom.numeroPorciones;
        $root.find("#precioSugerido").text(this.formatPrice(totalSugerido));
    }

}
