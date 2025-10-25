

class Efectivo extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "efectivo";
    }

    render() {
        this.layout();
        this.filterBarConceptos();
        this.lsConceptos();
        cashMovement.filterBarMovimientos();
    }

    layout() {
        this.primaryLayout({
            parent: "container-formasPago",
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: "w-full", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full h-full", id: "container" + this.PROJECT_NAME },
            },
        });

        this.layoutTabs();
    }

    layoutTabs() {
        this.tabLayout({
            parent: "container" + this.PROJECT_NAME,
            id: "tabs" + this.PROJECT_NAME,
            theme: "light",
            type: "short",
            json: [
                {
                    id: "conceptos",
                    tab: "Efectivo",
                    class: "mb-1",
                    active: true,
                    onClick: () => this.lsConceptos()
                },
                {
                    id: "conceptos",
                    tab: "Moneda extranjera",
                    class: "mb-1",
                    // active: true,
                    onClick: () => this.lsConceptos()
                },
                {
                    id: "conceptos",
                    tab: "Bancos",
                    class: "mb-1",
                    // active: true,
                    onClick: () => this.lsConceptos()
                },
                // {
                //     id: "movimientos",
                //     tab: "Movimientos",
                //     onClick: () => cashMovement.lsMovimientos()
                // }
            ]
        });

        // $("#container" + this.PROJECT_NAME).prepend(`
        //     <div class="px-4 pt-3 pb-3">
        //         <h2 class="text-2xl font-semibold">💵 Administrador de Efectivo</h2>
        //         <p class="text-gray-400">Gestiona conceptos y movimientos de efectivo.</p>
        //     </div>
        // `);
    }

    filterBarConceptos() {
        const container = $("#container-conceptos");
        container.html('<div id="filterbar-conceptos" class="mb-2"></div><div id="tabla-conceptos"></div>');

        this.createfilterBar({
            parent: "filterbar-conceptos",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: udn,
                    onchange: 'app.lsConceptos()'
                },
                {
                    opc: "select",
                    id: "active",
                    lbl: "Estado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "1", valor: "Activos" },
                        { id: "0", valor: "Inactivos" }
                    ],
                    onchange: 'app.lsConceptos()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoConcepto",
                    text: "Nuevo Concepto",
                    onClick: () => this.addConcepto(),
                },
            ],
        });
    }

    lsConceptos() {
        this.createTable({
            parent: "tabla-conceptos",
            idFilterBar: "filterbar-conceptos",
            data: { opc: "lsConceptos" },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbConceptos",
                theme: 'corporativo',
                center: [2, 4],
                right: [6]
            },
        });
    }

    addConcepto() {
        this.createModalForm({
            id: 'formConceptoAdd',
            data: { opc: 'addConcepto' },
            bootbox: {
                title: 'Agregar Concepto de Efectivo',
            },
            json: this.jsonConcepto(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsConceptos();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });
    }

    async editConcepto(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getConcepto",
                id: id,
            },
        });

        const concepto = request.data;

        this.createModalForm({
            id: 'formConceptoEdit',
            data: { opc: 'editConcepto', id: concepto.id },
            bootbox: {
                title: 'Editar Concepto de Efectivo',
            },
            autofill: concepto,
            json: this.jsonConcepto(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsConceptos();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message });
                }
            }
        });
    }

    statusConcepto(id, active) {
        const action = active === 1 ? 'desactivar' : 'activar';
        const message = active === 1
            ? 'El flujo de efectivo se ha deshabilitado temporalmente para esta unidad.'
            : 'El flujo de efectivo está habilitado nuevamente para registrar movimientos.';

        this.swalQuestion({
            opts: {
                title: `¿Desea ${action} este concepto?`,
                text: message,
                icon: "warning",
            },
            data: {
                opc: "statusConcepto",
                active: active === 1 ? 0 : 1,
                id: id,
            },
            methods: {
                send: () => this.lsConceptos(),
            },
        });
    }

    jsonConcepto() {
        return [
            {
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de Negocio",
                class: "col-12 mb-3",
                data: udn
            },
            {
                opc: "input",
                id: "name",
                lbl: "Nombre del Concepto",
                class: "col-12 mb-3"
            },
            {
                opc: "select",
                id: "operation_type",
                lbl: "Tipo de Operación",
                class: "col-12 mb-3",
                data: [
                    { id: "suma", valor: "suma" },
                    { id: "resta", valor: "resta" }
                ],
              
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción (opcional)",
                class: "col-12 mb-3",
                required: false
            }
        ];
    }
}

class CashMovement extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "movimientos";
    }

    filterBarMovimientos() {
        const container = $("#container-movimientos");
        container.html('<div id="filterbar-movimientos" class="mb-2"></div><div id="tabla-movimientos"></div>');

        this.createfilterBar({
            parent: "filterbar-movimientos",
            data: [
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-12 col-md-3",
                    data: udn,
                    onchange: 'cashMovement.lsMovimientos()'
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnNuevoMovimiento",
                    text: "Nuevo Movimiento",
                    onClick: () => this.addMovimiento(),
                },
                {
                    opc: "button",
                    class: "col-12 col-md-3",
                    id: "btnCerrarEfectivo",
                    text: "Cerrar Efectivo",
                    color_btn: "danger",
                    onClick: () => this.closeCashFlow(),
                },
            ],
        });
    }

    lsMovimientos() {
        this.createTable({
            parent: "tabla-movimientos",
            idFilterBar: "filterbar-movimientos",
            data: { opc: "lsMovimientos" },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: "tbMovimientos",
                theme: 'corporativo',
                center: [3],
                right: [4, 7]
            },
        });
    }

    addMovimiento() {
        this.createModalForm({
            id: 'formMovimientoAdd',
            data: { opc: 'addMovimiento' },
            bootbox: {
                title: 'Registrar Movimiento de Efectivo',
            },
            json: this.jsonMovimiento(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsMovimientos();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message, btn1: true, btn1Text: "Ok" });
                }
            }
        });

        $('#udn_id').on('change', function () {
            cashMovement.loadConceptsByUdn($(this).val());
        });
    }

    async editMovimiento(id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getMovimiento",
                id: id,
            },
        });

        const movimiento = request.data;

        this.createModalForm({
            id: 'formMovimientoEdit',
            data: { opc: 'editMovimiento', id: movimiento.id },
            bootbox: {
                title: 'Editar Movimiento de Efectivo',
            },
            autofill: movimiento,
            json: this.jsonMovimiento(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.lsMovimientos();
                } else {
                    alert({ icon: "info", title: "Oops!...", text: response.message });
                }
            }
        });

        await this.loadConceptsByUdn(movimiento.udn_id);
    }

    async loadConceptsByUdn(udn_id) {
        const request = await useFetch({
            url: this._link,
            data: {
                opc: "getConceptsByUdn",
                udn_id: udn_id,
            },
        });

        $('#concept_id').option_select({
            data: request.data,
            placeholder: "Seleccionar concepto"
        });
    }

    closeCashFlow() {
        const udn_id = $('#filterbar-movimientos #udn').val();

        this.swalQuestion({
            opts: {
                title: "¿Desea realizar el cierre de efectivo?",
                text: "Esta acción consolidará los movimientos y generará un registro contable final. No se permitirán más movimientos hasta el siguiente periodo.",
                icon: "warning",
            },
            data: {
                opc: "closeCash",
                udn_id: udn_id,
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({
                            icon: "success",
                            title: "Cierre Exitoso",
                            text: response.message,
                            btn1: true
                        });
                        this.lsMovimientos();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message
                        });
                    }
                },
            },
        });
    }

    jsonMovimiento() {
        return [
            {
                opc: "select",
                id: "udn_id",
                lbl: "Unidad de Negocio",
                class: "col-12 mb-3",
                data: udn
            },
            {
                opc: "select",
                id: "concept_id",
                lbl: "Concepto",
                class: "col-12 mb-3",
                data: []
            },
            {
                opc: "select",
                id: "movement_type",
                lbl: "Tipo de Movimiento",
                class: "col-12 mb-3",
                data: [
                    { id: "suma", valor: "suma" },
                    { id: "resta", valor: "resta" }
                ],
            },
            {
                opc: "input",
                id: "amount",
                lbl: "Monto",
                tipo: "cifra",
                class: "col-12 mb-3",
                onkeyup: "validationInputForNumber('#amount')"
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción o Comentario",
                class: "col-12 mb-3",
                required: false
            }
        ];
    }
}
