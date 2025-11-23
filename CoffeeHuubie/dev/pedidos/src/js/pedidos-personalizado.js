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
                    <section class="bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 shadow space-y-3" id="progressSection">
                    </section>

                    <!-- Contenido principal -->
                    <section class="grid lg:grid-cols-3 gap-8">
                        <!-- Columna izquierda -->
                        <div class="lg:col-span-2 space-y-6">
                            
                            <!-- Sección de opciones -->
                            <div id="optionsSection" class="space-y-6"></div>

                            <!-- 🧱 Sección de observaciones y fotos -->
                            <div id="extraContainer" class="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4"></div>
                        </div>

                        <!-- Sección de vista previa -->
                        <div id="previewSection" 
                            class="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow space-y-2">
                        </div>
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
            custom.renderExtraSection();
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
                        <button id="btnAgregarOpcion" class="border border-gray-500 px-4 py-1 rounded-full text-sm text-gray-300 hover:bg-violet-700/30" onclick="custom.handleAddOption()">+ Opción</button>
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
                // Cambiar la cantidad en el input
                $row.find(".qty-input").val(items[i].qty);
                custom.renderPreview();
            });
            $row.find(".btn-plus").on("click", () => {
                items[i].qty = (items[i].qty || 1) + 1;
                $row.find(".qty-input").val(items[i].qty);
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
            detalles.append(`
                <div class="flex justify-between items-center border-t border-violet-700 mt-2 pt-2 font-bold text-violet-300">
                    <span>Total:</span>
                    <span>${custom.formatPrice(total)}</span>
                </div>
            `);


            // 🧮 Si hay selección, inicializa el campo porciones y calcula automáticamente
            const $porciones = $("#porciones");
            const porciones = custom.numeroPorciones || 1;
            $porciones.val(porciones);

            // Llama directamente a tu función de cálculo con el input actual
            custom.calculateSuggestedPrice($porciones[0]);
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

    // Renderiza fotos, dedicatoria y observaciones
    renderExtraSection() {
        const parent = $("#extraContainer").empty();
        parent.append(`
            <form id="formEditProducto" novalidate="true">
                <div class="col-12 mb-3">
                    <label class="">Dedicatoria</label>
                        <input id="dedication" name="dedication" required="required" class="form-control input-sm bg-[#1F2A37]" onkeyup="">
                </div>
                <div>    
                    <label class="">Observaciones</label>
                    <textarea class="form-control bg-[#1F2A37] resize" id="order_details" name="order_details"></textarea>
                </div>
                    
                <div class="col-12 mt-2 mb-2">
                    <div class="w-full p-2 border-2 border-dashed border-gray-500 rounded-xl text-center">
                        <input
                            type="file"
                            id="archivos"
                            name="archivos"
                            class="hidden"
                            multiple
                            accept="image/*"
                            onchange="normal.previewImages(this, 'previewImagenes')"
                        >
                        <div class="flex flex-col items-center justify-center py-2 cursor-pointer" onclick="document.getElementById('archivos').click()">
                            <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                                <i class="icon-upload text-white"></i>
                            </div>
                            <p class="text-xs">Drag & Drop or <span class="text-purple-400 underline">choose file</span></p>
                            <p class="text-[10px] text-gray-400 mt-1">JPEG, PNG</p>
                        </div>
                        <div id="previewImagenes" class="flex gap-2 flex-wrap mt-1"></div>
                    </div>
                </div>
            </form>
        `);

        $("#formEditProducto").on("submit", function (e) {
            e.preventDefault(); // 🛑 Evita el envío automático
        });
    }


    handleFinished() {
        const $root = $("#modalArmarPastel");
        const payload = [];
        let total = 0;

        const isMultiCategory = (cat) => {
            return !!(cat && (cat.isExtra == 1 || /decoraci/i.test(cat.name || "")));
        };

        categories.forEach(cat => {
            const sel = custom.selectedOptions[cat.id];
            const multi = isMultiCategory(cat);

            if (multi) {
                (Array.isArray(sel) ? sel.filter(it => it && it.qty >= 1) : [])
                    .forEach(it => {
                        const qty = parseInt(it.qty) || 1;
                        const price = parseFloat(it.price || 0);
                        total += price * qty;
                        payload.push({ modifier_id: it.id, quantity: qty, price });
                    });
            } else if (sel?.id != null) {
                const price = parseFloat(sel.price || 0);
                total += price;
                cat.options.forEach(opt => {
                    if (opt.id === sel.id) payload.push({ modifier_id: opt.id, quantity: 1, price });
                });
            }
        });


        // 🔸 Nueva validación: debe haber al menos una selección
        if (payload.length == 0) {
            bootbox.alert({
                title: "Selecciona al menos una opción",
                message: `Por favor selecciona al menos una categoría o elemento antes de continuar.`
            });
            return false;
        }

        // Limpieza visual (si existía algún resaltado anterior)
        $root.find(".step-button").removeClass("ring-2 ring-red-500");

        // 🧾 Mostrar resultados en consola (para depurar)
        console.log("Payload listo para backend:", payload);

        const totalSugerido = $root.find("#precioSugerido").text().replace(/[^0-9.-]+/g, "");
        const priceRealStr = $root.find("#precioReal").val().replace(/,/g, "");
        const priceReal = parseFloat(priceRealStr) || total;
        const dedication = $root.find("#dedication").val().trim();
        const orderDetails = $root.find("#order_details").val().trim();




        // 📝 Pedir nombre del pedido personalizado
        bootbox.prompt({
            title: "Nombre del pedido personalizado",
            inputType: 'text',
            placeholder: "Ejemplo: Pastel de cumpleaños para Ana",
            callback: function (result) {
                if (result) {
                    custom.saveCustomOrder(result, payload, totalSugerido, priceReal, orderDetails, dedication);
                }
            }
        });

        return true;
    }


    // Guarda el pedido personalizado
    async saveCustomOrder(orderName, payload, totalSuggested, priceReal, orderDetails, dedication) {

        // GUARDAR PEDIDO PERSONALIZADO
        const orderData = {
            name: orderName,
            price: totalSuggested,
            price_real: priceReal,
            portion_qty: custom.numeroPorciones || 1,
            date_created: new Date().toISOString(),
            orderId: idFolio || null,               // idFolio viene de la app.js
            items: JSON.stringify(payload)
        };
        const response = await useFetch({ url: this._link, data: { opc: "addCustomOrder", ...orderData } });


        if (response.status == 200) {
            // GUARDAR DEDICATORIA Y OBSERVACIONES
            const responseOrder = await useFetch({
                url: custom._link,
                data:
                {
                    opc: "editOrderPackage",
                    order_details: orderDetails,
                    dedication: dedication,
                    id: response.data.orderId,
                }
            });

            // GUARDAR IMÁGENES

            const form = document.getElementById('formEditProducto');
            const formData = new FormData(form);

            formData.append('opc', 'addOrderImages');
            formData.append('id', response.data.orderId);
            formData.append('idFolio', idFolio);

            const files = document.getElementById('archivos').files;

            for (let i = 0; i < files.length; i++) {
                formData.append('archivos[]', files[i]);
            }

            console.log('form-data', formData);

            fetch(custom._link, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(response => {


                });


            if (responseOrder.status == 200) {
                bootbox.alert("¡Tu pedido personalizado ha sido guardado con éxito! 🎉");
            }


            // Guardar fotos si hay
            // const $root = $("#modalArmarPastel");
            // const form = document.getElementById('formEditProducto');
            // const formData = new FormData(form);

            // formData.append('opc', 'editProduct');

            // const files = document.getElementById('archivos').files;
            // for (let i = 0; i < files.length; i++) {
            //     formData.append('archivos[]', files[i]);
            // }

            // const uploadResponse = await fetch(custom._link, {
            //     method: 'POST',
            //     body: formData
            // });
            // if (uploadResponse.ok) {
            //     console.log("Archivos y detalles subidos con éxito.");
            // } else {
            //     console.error("Error al subir archivos y detalles:", uploadResponse.statusText);
            // }



            const listaProductosDeLaOrden = await useFetch({
                url: 'ctrl/ctrl-pedidos.php',
                data: {
                    opc: "getProductsOrder",
                    order_id: idFolio
                }
            });

            // Recargar la lista de pedidos
            normal.showOrder(listaProductosDeLaOrden.data || []);

            // temporal
            // bootbox.hideAll();
        } else {
            bootbox.alert("Error al guardar el pedido personalizado.");
            throw new Error(`Error del servidor: ${response.status}`);
        }


    }


    handleAddOption() {
        // Abrir modal para agregar nueva opción
        const cat = categories[custom.currentStep];
        if (!cat) return;

        // bootbox.prompt({
        //     title: "Agregar nueva opción",
        //     inputType: 'text',
        //     placeholder: "Ejemplo: Sabor de pastel",
        //     callback: async function (result) {
        //         if (result) {
        //             const response = await useFetch({ url: this._link, data: { opc: "addModifierProduct", categoryId: cat.id, name: result }});
        //             // console.log("Nueva opción agregada:", result);
        //             custom.addOptionToCategory(cat.id, result);
        //         }
        //     }
        // });

        const modalAddOption = bootbox.dialog({
            title: `Crea nueva opción a ${cat.name}`,
            size: "small",
            id: "modalAddOption",
            closeButton: true,
            message: `
                <div class="w-full">
                    <main class="max-w-md mx-auto p-2" id="modalContentOption">
                        <div class="space-y-4">
                            <div>
                                <label for="newOptionName" class="block text-sm font-medium text-gray-300 mb-1">Nombre de la opción</label>
                                <input type="text" id="newOptionName" class="w-full border border-gray-700 bg-gray-800 text-gray-200 rounded px-3 py-2" placeholder="" />
                            </div>
                            <div>
                                <label for="newOptionPrice" class="block text-sm font-medium text-gray-300 mb-1">Precio x unidad (opcional)</label>
                                <input type="text" id="newOptionPrice" class="w-full border border-gray-700 bg-gray-800 text-gray-200 rounded px-3 py-2 text-right" placeholder="0.00" oninput="custom.formatCifra(this)" />
                            </div>  
                        </div>
                    </main>
                </div>
            `,
            buttons: {
                cancel: {
                    label: "Cancelar",
                    className: "border border-gray-700 px-4 py-1 rounded-full text-sm text-gray-400 hover:bg-gray-700",
                    callback: function () {
                        // No hacer nada, solo cerrar   
                    }
                },
                confirm: {
                    label: "Agregar",
                    className: "border border-violet-500 px-4 py-1 rounded-full text-sm text-violet-300 hover:bg-violet-700/30",
                    callback: async function () {
                        const optionName = $("#newOptionName").val().trim();
                        const optionPriceStr = $("#newOptionPrice").val().replace(/,/g, "");
                        const optionPrice = parseFloat(optionPriceStr) || 0;
                        if (optionName) {
                            const response = await useFetch({ url: custom._link, data: { opc: "addModifierProduct", modifier_id: cat.id, name: optionName, price: optionPrice } });
                            if (response.status == 200) {
                                custom.addOptionToCategory(cat.id, optionName, optionPrice, response.data.id);
                            }
                        }
                    }
                }
            }
        });

    }

    addOptionToCategory(categoryId, optionName, optionPrice = 0, optionId = null) {
        const cat = categories.find(c => c.id == categoryId);
        if (!cat) return;
        if (!Array.isArray(cat.options)) cat.options = [];
        const newId = cat.options.length > 0 ? Math.max(...cat.options.map(o => o.id)) + 1 : 1;
        cat.options.push({ id: optionId || newId, name: optionName, price: optionPrice });
        custom.renderOptions();
    }



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
        // 📜 Regla:
        // PrecioSugerido = (SubtotalNoMultiples * Porciones) + SubtotalMultiples

        // 🔵 Identifica categorías múltiples (extras/decoración)
        const isMultiCategory = (cat) => !!(cat && (cat.isExtra == 1 || /decoraci/i.test(cat.name || "")));

        // 📌 Acumuladores separados
        let baseTotal = 0; // NO-múltiples (sabores, rellenos, etc.) → se multiplican por porciones
        let multiTotal = 0; // Múltiples (extras, decoración)       → NO se multiplican por porciones

        categories.forEach(cat => {
            const sel = custom.selectedOptions[cat.id];
            const multi = isMultiCategory(cat);

            // Normaliza a lista para manejar single/multiple de forma uniforme
            const items = Array.isArray(sel)
                ? sel.filter(it => it && (parseInt(it.qty, 10) || 1) >= 1)
                : (sel && sel.id != null ? [sel] : []);

            items.forEach(it => {
                const qty = parseInt(it.qty, 10) || 1;
                const price = parseFloat(it.price || 0);

                if (multi) {
                    // Extras/decoración → NO se multiplican por porciones
                    multiTotal += price * qty;
                } else {
                    // Sabores/rellenos → SÍ se multiplican por porciones (más adelante)
                    baseTotal += price * qty;
                }
            });
        });

        // 🧮 Porciones y precio sugerido final
        const numeroPorciones = parseFloat(inputPorciones.value) || 1;
        custom.numeroPorciones = numeroPorciones;

        const totalSugerido = (baseTotal * numeroPorciones) + multiTotal;

        // 📝 Salida UI
        $root.find("#precioSugerido").text(custom.formatPrice(totalSugerido));
    }

}
