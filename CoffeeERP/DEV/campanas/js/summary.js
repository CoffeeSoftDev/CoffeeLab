class CampaignSummary extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Summary";
        this.apiSummary = 'ctrl/ctrl-summary.php';
    }

    render() {
        this.layout();
        this.filterBar();
        this.lsSummary();
    }

    layout() {
        this.primaryLayout({
            parent: `container-summary`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "udn_id",
                    lbl: "Unidad de Negocio",
                    class: "col-sm-3",
                    data: udn,
                    onchange: `summary.lsSummary()`,
                },
                {
                    opc: "select",
                    id: "red_social_id",
                    lbl: "Red Social",
                    class: "col-sm-3",
                    data: red_social,
                    onchange: `summary.lsSummary()`,
                },
                {
                    opc: "select",
                    id: "mes",
                    lbl: "Mes",
                    class: "col-sm-3",
                    data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                    onchange: `summary.lsSummary()`,
                },
                {
                    opc: "select",
                    id: "año",
                    lbl: "Año",
                    class: "col-sm-3",
                    data: Array.from({ length: 5 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                    onchange: `summary.lsSummary()`,
                },
            ],
        });

        const currentMonth = moment().month() + 1;
        setTimeout(() => {
            $(`#filterBar${this.PROJECT_NAME} #mes`).val(currentMonth).trigger("change");
        }, 100);
    }

    lsSummary() {
        const nombreMes = $(`#filterBar${this.PROJECT_NAME} #mes option:selected`).text();
        const año = $(`#filterBar${this.PROJECT_NAME} #año`).val();

        $(`#container${this.PROJECT_NAME}`).html(`
            <div class="px-2 pt-2 pb-2">
                <h2 class="text-2xl font-semibold text-white">📋 Resumen de Campaña - ${nombreMes} ${año}</h2>
                <p class="text-gray-400">Desglose detallado de campañas y anuncios del mes</p>
            </div>
            <div id="container-table-summary"></div>
        `);

        const tempLink = this._link;
        this._link = this.apiSummary;

        this.createTable({
            parent: "container-table-summary",
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'lsSummary' },
            coffeesoft: true,
            conf: { datatable: false, pag: 50 },
            attr: {
                id: "tbSummary",
                theme: 'corporativo',
                right: [3, 5],
                center: [2, 4]
            },
            success: () => {
                this._link = tempLink;
               
            }
        });
    }
}
