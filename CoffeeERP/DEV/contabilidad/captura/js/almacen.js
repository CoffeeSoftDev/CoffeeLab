let api = 'ctrl/ctrl-almacen.php';
let app, warehouseReport, fileUpload;
let products, productClass, businessUnits;

$(async () => {
    
    const data          = await useFetch({ url: api, data: { opc: "init" } });
          products      = data.products;
          productClass  = data.productClass;
          businessUnits = data.businessUnits;

    app = new App(api, "root");
    // warehouseReport = new WarehouseReport(api, "root");
    // fileUpload = new FileUpload(api, "root");



    app.render();
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "almacen";
    }

    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }

    layout() {

        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: 'w-full',
            card: {
                filterBar: { class: 'w-full border-b pb-2', id: `filterBar${this.PROJECT_NAME}` },
                container: { class: 'w-full my-2 h-full', id: `container${this.PROJECT_NAME}` }
            }
        });

        $(`#container${this.PROJECT_NAME}`).prepend(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📦 Salidas de Almacén</h2>
                <p class="text-gray-400">Gestiona las salidas de almacén del día</p>
            </div>
        `);

        this.tabLayout({
            parent: `container${this.PROJECT_NAME}`,
            id: `tabs${this.PROJECT_NAME}`,
            theme: "light",
            type: "short",
            json: [
                {
                    id: "salidas",
                    tab: "Salidas del día",
                    active: true,
                    onClick: () => this.ls()
                },
                {
                    id: "concentrado",
                    tab: "Concentrado de almacén",
                    onClick: () => warehouseReport.renderReport()
                },
                {
                    id: "archivos",
                    tab: "Archivos",
                    onClick: () => fileUpload.renderFiles()
                }
            ]
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "input",
                    id: "date",
                    lbl: "Fecha",
                    type: "date",
                    class: "col-sm-3",
                    value: moment().format('YYYY-MM-DD'),
                    onchange: `app.ls()`
                },
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Unidad de Negocio",
                    class: "col-sm-3",
                    data: businessUnits,
                    onchange: `app.ls()`
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    id: "btnNewOutput",
                    text: "Nueva Salida",
                    onClick: () => this.addWarehouseOutput()
                }
            ]
        });
    }

    ls() {
        const date = $(`#filterBar${this.PROJECT_NAME} #date`).val();
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();

        this.createTable({
            parent: `container-salidas`,
            idFilterBar: `filterBar${this.PROJECT_NAME}`,
            data: { opc: 'ls', date: date, udn: udn },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: `tb${this.PROJECT_NAME}`,
                theme: 'corporativo',
                title: 'Lista de Salidas',
                subtitle: '',
                center: [1],
                right: [2, 3]
            },
            success: (response) => {
                $(`#container-salidas`).prepend(`
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-3">
                        <strong>Total de salidas del día:</strong> ${response.dailyTotal}
                    </div>
                `);
            }
        });
    }

    addWarehouseOutput() {
        this.createModalForm({
            id: 'formOutputAdd',
            data: { 
                opc: 'addWarehouseOutput',
                date: $(`#filterBar${this.PROJECT_NAME} #date`).val(),
                udn: $(`#filterBar${this.PROJECT_NAME} #udn`).val(),
                user_id: 1
            },
            bootbox: {
                title: 'Nueva Salida de Almacén'
            },
            json: this.jsonWarehouseOutput(),
            success: (response) => {
                if (response.status === 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    async editWarehouseOutput(id) {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getWarehouseOutput", id: id }
        });

        if (request.status === 200) {
            this.createModalForm({
                id: 'formOutputEdit',
                data: { 
                    opc: 'editWarehouseOutput',
                    id: id,
                    udn: $(`#filterBar${this.PROJECT_NAME} #udn`).val(),
                    user_id: 1
                },
                bootbox: {
                    title: 'Editar Salida de Almacén'
                },
                autofill: request.data,
                json: this.jsonWarehouseOutput(),
                success: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            });
        }
    }

    deleteWarehouseOutput(id) {
        this.swalQuestion({
            opts: {
                title: "¿Está seguro?",
                text: "¿Desea eliminar esta salida de almacén?",
                icon: "warning"
            },
            data: { 
                opc: "deleteWarehouseOutput", 
                id: id,
                udn: $(`#filterBar${this.PROJECT_NAME} #udn`).val(),
                user_id: 1
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.ls();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }

    showDescription(id, description) {
        bootbox.alert({
            title: "Descripción de la Salida",
            message: `<div class="p-3">${description}</div>`,
            size: 'large'
        });
    }

    jsonWarehouseOutput() {
        return [
            {
                opc: "select",
                id: "product_id",
                lbl: "Almacén / Producto",
                class: "col-12 mb-3",
                data: products,
                required: true
            },
            {
                opc: "input",
                id: "amount",
                lbl: "Cantidad",
                tipo: "cifra",
                class: "col-12 mb-3",
                required: true,
                onkeyup: "validationInputForNumber('#amount')"
            },
            {
                opc: "textarea",
                id: "description",
                lbl: "Descripción",
                class: "col-12 mb-3",
                rows: 3,
                required: true
            }
        ];
    }
}

class WarehouseReport extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    renderReport() {
        this.filterBarReport();
        this.lsReport();
    }

    filterBarReport() {
        const container = $(`#container-concentrado`);
        container.html(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📊 Concentrado de Almacén</h2>
                <p class="text-gray-400">Reporte consolidado de salidas por clasificación</p>
            </div>
            <div id="filterBarReport" class="mb-2 px-4"></div>
            <div id="tableReport"></div>
        `);

        this.createfilterBar({
            parent: "filterBarReport",
            data: [
                {
                    opc: "input-calendar",
                    id: "dateRange",
                    lbl: "Rango de fechas",
                    class: "col-sm-4"
                },
                {
                    opc: "select",
                    id: "udnReport",
                    lbl: "Unidad de Negocio",
                    class: "col-sm-3",
                    data: businessUnits,
                    onchange: `warehouseReport.lsReport()`
                },
                {
                    opc: "button",
                    class: "col-sm-2",
                    text: "Buscar",
                    onClick: () => this.lsReport()
                }
            ]
        });

        dataPicker({
            parent: "dateRange",
            onSelect: () => this.lsReport()
        });
    }

    lsReport() {
        const rangePicker = getDataRangePicker("dateRange");
        const udn = $("#filterBarReport #udnReport").val();

        this.createTable({
            parent: "tableReport",
            idFilterBar: "filterBarReport",
            data: { 
                opc: 'lsReport',
                fi: rangePicker.fi,
                ff: rangePicker.ff,
                udn: udn
            },
            coffeesoft: true,
            conf: { datatable: false, pag: 15 },
            attr: {
                id: "tbReport",
                theme: 'corporativo',
                title: 'Reporte de Salidas por Clasificación',
                subtitle: '',
                right: [1]
            },
            success: (response) => {
                $("#tableReport").prepend(`
                    <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-3">
                        <strong>Balance Total:</strong> ${response.totalBalance}
                    </div>
                `);
            }
        });
    }
}

class FileUpload extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    renderFiles() {
        const container = $(`#container-archivos`);
        container.html(`
            <div class="px-4 pt-3 pb-3">
                <h2 class="text-2xl font-semibold">📁 Archivos de Respaldo</h2>
                <p class="text-gray-400">Gestiona los archivos de respaldo del almacén</p>
            </div>
            <div id="uploadSection" class="px-4 mb-4"></div>
            <div id="filesList"></div>
        `);

        this.renderUploadForm();
        this.listFiles();
    }

    renderUploadForm() {
        $("#uploadSection").html(`
            <div class="bg-white p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-3">Subir Archivo</h3>
                <form id="uploadForm" enctype="multipart/form-data">
                    <div class="mb-3">
                        <label class="block text-sm font-medium mb-2">Seleccionar archivo (máx. 20 MB)</label>
                        <input type="file" id="fileInput" name="file" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-upload"></i> Subir Archivo
                    </button>
                </form>
            </div>
        `);

        $("#uploadForm").on("submit", (e) => {
            e.preventDefault();
            this.uploadFile();
        });
    }

    async uploadFile() {
        const formData = new FormData();
        const fileInput = document.getElementById("fileInput");
        
        if (fileInput.files.length === 0) {
            alert({ icon: "warning", text: "Por favor selecciona un archivo" });
            return;
        }

        formData.append("file", fileInput.files[0]);
        formData.append("opc", "uploadFile");
        formData.append("udn", $(`#filterBar${this.PROJECT_NAME} #udn`).val());
        formData.append("user_id", 1);
        formData.append("date", $(`#filterBar${this.PROJECT_NAME} #date`).val());

        try {
            const response = await fetch(this._link, {
                method: "POST",
                body: formData
            });
            const data = await response.json();

            if (data.status === 200) {
                alert({ icon: "success", text: data.message });
                $("#uploadForm")[0].reset();
                this.listFiles();
            } else {
                alert({ icon: "error", text: data.message });
            }
        } catch (error) {
            alert({ icon: "error", text: "Error al subir el archivo" });
        }
    }

    listFiles() {
        const udn = $(`#filterBar${this.PROJECT_NAME} #udn`).val();
        const date = $(`#filterBar${this.PROJECT_NAME} #date`).val();

        this.createTable({
            parent: "filesList",
            data: { 
                opc: 'listUploadedFiles',
                udn: udn,
                date: date
            },
            coffeesoft: true,
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbFiles",
                theme: 'corporativo',
                title: 'Archivos Subidos',
                subtitle: '',
                center: [1, 2, 3],
                right: [4]
            }
        });
    }

    deleteFile(id) {
        this.swalQuestion({
            opts: {
                title: "¿Está seguro?",
                text: "¿Desea eliminar este archivo?",
                icon: "warning"
            },
            data: { 
                opc: "deleteFile", 
                id: id
            },
            methods: {
                send: (response) => {
                    if (response.status === 200) {
                        alert({ icon: "success", text: response.message });
                        this.listFiles();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }
}
