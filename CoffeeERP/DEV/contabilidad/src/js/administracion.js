window.ctrlsobres = "ctrl/ctrl-sobres.php";
const apertura = new Apertura(ctrlsobres);
const concepto = new Conceptos(ctrlsobres);

$(async () => {
    await createTabs();
    historyTabs();
});

async function createTabs() {
    const data = [
        {
            tab: "Documentación",
            fn: "tabDocumentacion()",
            class: "text-dark",
            active: true,
            card: { head: { html: "📚 Documentación del Sistema" } },
            contenedor: [
                { class: "row", id: "contentDocumentacion" },
            ],
        },
        {
            tab: "Aperturas",
            fn: "tabAperturas()",
            class: "text-dark",
            card: { head: { html: "Apertura de sobres" } },
            contenedor: [
                { class: "row mb-3 d-flex justify-content-end", id: "filterApertura" },
                { class: "row", id: "tbDatosApertura" },
            ],
        },
        {
            tab: "Conceptos",
            fn: "tabConceptos()",
            class: "text-dark",
            card: { head: { html: "Conceptos de sobres" } },
            contenedor: [
                { class: "line-2 row mb-3 d-flex justify-content-end", id: "filterCompras" },
                { class: "line-2 row", id: "tbDatosCompras" },
            ],
        },
    ];
    $("#bodyAdmin").simple_json_nav(data);
}

async function historyTabs() {
    const tab = sessionStorage.getItem("tab");
    if ($("#" + tab).length) $("#" + tab).click();
    else $("#documentacion").click();
}

function tabAperturas() {
    sessionStorage.setItem("tab", "aperturas");
    apertura.Container = "#filterApertura";
    apertura.tbContainer = "#tbDatosApertura";
    apertura.aperturas();
}

function tabConceptos() {
    sessionStorage.setItem("tab", "conceptos");
    concepto.Container = "#filterCompras";
    concepto.tbContainer = "#tbDatosCompras";
    concepto.conceptos();
}

function tabDocumentacion() {
    sessionStorage.setItem("tab", "documentacion");
    loadDocumentacion();
}

async function loadDocumentacion() {
    const container = $("#contentDocumentacion");
    
    const modulesInfo = [
        { key: 'sobres', title: 'Sobres', icon: 'icon-folder', color: 'primary', desc: 'Módulo principal para gestión de operaciones financieras diarias' },
        { key: 'ingresos', title: 'Ingresos', icon: 'icon-dollar', color: 'success', desc: 'Administración de todos los ingresos de la empresa' },
        { key: 'compras', title: 'Compras', icon: 'icon-shopping-cart', color: 'warning', desc: 'Gestión de compras y gastos de la empresa' },
        { key: 'pagos', title: 'Pagos y Salidas', icon: 'icon-credit-card', color: 'danger', desc: 'Control de pagos y salidas de efectivo' },
        { key: 'clientes', title: 'Clientes', icon: 'icon-users', color: 'info', desc: 'Administración de cartera de clientes' },
        { key: 'proveedores', title: 'Proveedores', icon: 'icon-briefcase', color: 'secondary', desc: 'Gestión de proveedores y cuentas por pagar' },
        { key: 'archivos', title: 'Archivos', icon: 'icon-file-text', color: 'dark', desc: 'Administración de archivos y comprobantes' },
        { key: 'caratula', title: 'Carátula', icon: 'icon-file-text', color: 'dark', desc: 'Generación de carátula contable del día' },
        { key: 'consultas', title: 'Consultas', icon: 'icon-search', color: 'primary', desc: 'Reportes y consultas avanzadas' },
        { key: 'administracion', title: 'Administración', icon: 'icon-cog', color: 'success', desc: 'Configuración y administración del sistema' }
    ];
    
    let cardsHTML = '';
    modulesInfo.forEach(module => {
        cardsHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-3">
                <div class="card border-${module.color} h-100 module-card" onclick="showModuleDetail('${module.key}')">
                    <div class="card-body">
                        <h5 class="card-title text-${module.color}">
                            <i class="${module.icon}"></i> ${module.title}
                        </h5>
                        <p class="card-text small">${module.desc}</p>
                        <div class="text-end">
                            <small class="text-muted">Clic para ver detalles <i class="icon-right-open"></i></small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    const content = `
        <style>
            .module-card {
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            .module-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            .module-detail {
                animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .detail-section {
                background: #f8f9fa;
                border-left: 4px solid #0d6efd;
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
            }
            .badge-file {
                background: #e7f3ff;
                color: #0066cc;
                padding: 3px 8px;
                border-radius: 3px;
                font-size: 0.85rem;
                margin: 2px;
                display: inline-block;
            }
            .workflow-step {
                padding: 8px 12px;
                margin: 5px 0;
                background: white;
                border-left: 3px solid #28a745;
                border-radius: 3px;
            }
            .back-button {
                position: sticky;
                top: 10px;
                z-index: 100;
            }
        </style>
        
        <div class="col-12">
            <div class="card shadow-sm">
                <div class="card-body p-4">
                    <div class="row mb-4">
                        <div class="col-12">
                            <h2 class="text-primary mb-3">
                                <i class="icon-book-open"></i> Documentación del Sistema de Contabilidad
                            </h2>
                            <p class="text-muted">
                                Guía completa del sistema de contabilidad CoffeeSoft ERP. 
                                Haz clic en cualquier módulo para ver información detallada.
                            </p>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-12">
                            <h4 class="text-secondary mb-3">
                                <i class="icon-folder-open"></i> Módulos del Sistema
                            </h4>
                        </div>
                        ${cardsHTML}
                    </div>

                    <div class="row mt-4">
                        <div class="col-12 text-center">
                            <a href="Doc-Sistema-Contable.md" download class="btn btn-primary btn-lg">
                                <i class="icon-download"></i> Descargar Documentación Completa (Markdown)
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.html(content);
}

const openTabs  = () => apertura.openTabs();
const closedUDN = (mod) => apertura.closedUDN(mod);
const outhours  = () => apertura.outhours();
const addConcept = () => concepto.addConcept();
