
let api_costsys = 'https://erp-varoch.com/ERP24/costsys/ctrl/ctrl-menu.php';
let costsys;
let udn;

$(async () => {
    // instancias.
    costsys = new Costsys(api_costsys, 'root');
    costsys.render();
    idFolio = 24;

    udn = [{ id:4 , valor:'Baos'} ];

});

class Costsys extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "costsys";
    }


    render() {
        this.layout();
        this.filterBar();
        this.lsCostoPotencial();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: "w-full",
            card: {
                filterBar: { class: "w-full my-3", id: "filterBar" + this.PROJECT_NAME },
                container: {
                    class: "w-full border rounded h-screen",
                    id: "container" + this.PROJECT_NAME,
                },
            },
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "UDNs",
                    lbl: "UDN",
                    class: "col-sm-3",
                    data: [{ id: 4, valor: 'Baos' }]
                },
                {
                    opc: "select",
                    id: "Clasificacion",
                    lbl: "Clasificación",
                    class: "col-sm-3",
                    data: [
                        { id: 13, valor: "ALIMENTOS" },
                        { id: "BEBIDAS", valor: "BEBIDAS" }
                    ]
                },
                {
                    opc: "select",
                    id: "Anio",
                    lbl: "Año",
                    class: "col-sm-2",
                    data: Array.from({ length: 2 }, (_, i) => {
                        const year = moment().year() - i;
                        return { id: year, valor: year.toString() };
                    }),
                },
                {
                    opc: "select",
                    id: "Mes",
                    lbl: "Mes",
                    class: "col-sm-2",
                    data: Array.from({ length: 12 }, (_, i) => {
                        const month = moment().month(i); // i = 0 to 11
                        return {
                            id: month.format("MM"),
                            valor: month.format("MMMM") // "Enero", "Febrero", ...
                        };
                    }),
                },
                {
                    opc: "button",
                    id: "btnBuscar",
                    class: "col-sm-2",
                    text: "Buscar",
                    className: "btn-primary w-100",
                    onClick: () => this.lsCostoPotencial()
                }
            ]
        });
    }

    lsCostoPotencial() {

        // this.createTable({
        //     parent: `container${this.PROJECT_NAME}`,
        //     idFilterBar: `filterBar${this.PROJECT_NAME}`,
        //     data: {
        //         opc: "TypeReport",
        //         type: 1,
        //         name_month: $('#Mes option:selected').text()

        //     },
        //     conf: { datatable: false, pag: 10 },
        //     coffeesoft: true,
        //     attr: {
        //         id: `tb${this.PROJECT_NAME}`,
        //         theme: "corporativo",
        //         title: 'Sistema de costos',
        //         right: [3, 4, 5, 6, 7, 8, 9],
        //         center: [1],
        //         extends: true,
        //         collapse: true
        //     },
        // });

        this.createCoffeTable({
                     parent: `container${this.PROJECT_NAME}`,
                     data: this.jsonActividades2025(),
                    id: `tb${this.PROJECT_NAME}`,
                    theme: "corporativo",
                    title: 'Sistema de costos',
                    right: [3, 4, 5, 6, 7, 8, 9],
                    center: [1],
                    extends: true,
                    collapse: true
        });
    }


    jsonActividades2025() {
        return {
            row: [
                {
                    id: "341",
                    "Fecha Inicio": {
                        class: "w-16 text-center text-xs",
                        html: "15/sep/25",
                        style: "background:"
                    },
                    "Fecha Fin": {
                        class: "w-16 text-center text-xs",
                        html: "16/sep/25",
                        style: "background:"
                    },
                    prioridad: {
                        html: "🔴 Alta",
                        class: "text-start ps-3 bg-white"
                    },
                    actividad: "Prueba: Actividad 1",
                    Encargado: {
                        html: "ROSA ANGELICA PEREZ",
                        class: "text-xs bg-white"
                    },
                    UDN: "CO",
                    "Ult. Avance": "15/sep/25\n<div class='relative inline-block ms-2'><i class='icon-bell-alt text-[#F0B200] text-lg pointer' onclick=\"gestor.advanceModal(341,'1', '6')\"></i><span class='absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-full leading-tight'>1</span></div>",
                    "Fecha visto": "15/sep/25",
                    "Dias acomulados": 1,
                    estado: "⏳  EN PROCESO",
                    dropdown: [
                        {
                            icon: "icon-ok",
                            text: "Finalizar",
                            onclick: "gestor.statusTasks(4,341,117,750)"
                        },
                        {
                            icon: "icon-eye",
                            text: "Ver detalles",
                            onclick: "assign.onShowActivity(341)"
                        },
                        {
                            icon: "icon-pencil",
                            text: "Editar",
                            onclick: "gestor.editTaskModal(341)"
                        },
                        {
                            icon: "icon-comment",
                            text: "Avances",
                            onclick: "gestor.advanceModal(341,1,6)"
                        },
                        {
                            icon: "icon-whatsapp",
                            text: "Recordar",
                            onclick: "gestor.sendIndividualRecorder(341)"
                        },
                        {
                            icon: "icon-cancel",
                            text: "Cancelar",
                            onclick: "gestor.statusTasks(5,341)"
                        }
                    ]
                },
                {
                    id: "338",
                    "Fecha Inicio": {
                        class: "w-16 text-center text-xs",
                        html: "15/sep/25",
                        style: "background:"
                    },
                    "Fecha Fin": {
                        class: "w-16 text-center text-xs",
                        html: "16/sep/25",
                        style: "background:"
                    },
                    prioridad: {
                        html: "🔴 Alta",
                        class: "text-start ps-3 bg-white"
                    },
                    actividad: "Prueba: Actividad 2",
                    Encargado: {
                        html: "ROSA ANGELICA PEREZ",
                        class: "text-xs bg-white"
                    },
                    UDN: "CO",
                    "Ult. Avance": "<span class='text-gray-500'>Sin avances</span>",
                    "Fecha visto": "15/sep/25",
                    "Dias acomulados": 1,
                    estado: "⏳  EN PROCESO",
                    dropdown: [
                        {
                            icon: "icon-ok",
                            text: "Finalizar",
                            onclick: "gestor.statusTasks(4,338,117,750)"
                        },
                        {
                            icon: "icon-eye",
                            text: "Ver detalles",
                            onclick: "assign.onShowActivity(338)"
                        },
                        {
                            icon: "icon-pencil",
                            text: "Editar",
                            onclick: "gestor.editTaskModal(338)"
                        },
                        {
                            icon: "icon-comment",
                            text: "Avances",
                            onclick: "gestor.advanceModal(338,1,6)"
                        },
                        {
                            icon: "icon-whatsapp",
                            text: "Recordar",
                            onclick: "gestor.sendIndividualRecorder(338)"
                        },
                        {
                            icon: "icon-cancel",
                            text: "Cancelar",
                            onclick: "gestor.statusTasks(5,338)"
                        }
                    ]
                }
            ],
            th: "0"
        };
    }


}
