// Datos de documentación de módulos
const modulesData = {
    sobres: {
        title: "Sobres",
        icon: "icon-folder",
        color: "primary",
        description: "Módulo principal para gestión de operaciones financieras diarias organizadas por UDN y fecha.",
        purpose: "Centralizar todas las operaciones contables del día en un solo lugar, permitiendo un control preciso de ingresos y egresos por unidad de negocio.",
        features: [
            "Control de saldos de caja en tiempo real",
            "Gestión de turnos de trabajo",
            "Registro de movimientos financieros",
            "Navegación por pestañas (Ingresos, Compras, Pagos, etc.)",
            "Validación de fechas permitidas",
            "Cálculo automático de saldos"
        ],
        files: {
            view: "sobres.php",
            js: ["_Contabilidad.js", "sobres.js"],
            ctrl: ["_Sobres.php", "ctrl-sobres.php"],
            mdl: ["mdl-sobres.php"]
        },
        workflow: [
            "Seleccionar UDN (Unidad de Negocio)",
            "Verificar fecha permitida",
            "Visualizar saldos de caja",
            "Navegar entre pestañas de módulos",
            "Registrar movimientos según corresponda"
        ],
        data: [
            "UDN seleccionada",
            "Fecha de operación",
            "Saldo inicial del día",
            "Egresos acumulados",
            "Saldo final calculado"
        ]
    },
    ingresos: {
        title: "Ingresos",
        icon: "icon-dollar",
        color: "success",
        description: "Administración completa de todos los ingresos de la empresa.",
        purpose: "Registrar y controlar todas las entradas de dinero, ya sea por ventas, pagos de clientes o ingresos extraordinarios.",
        features: [
            "Registro manual de ventas",
            "Carga de archivos de ventas (Excel/CSV)",
            "Integración con SoftRestaurant",
            "Bitácora de CCTV para suites",
            "Cálculo automático de impuestos",
            "Desglose de ventas por concepto",
            "Control de caja (efectivo, bancos, monedas)",
            "Gestión de pagos de clientes"
        ],
        files: {
            view: "sobres.php (pestaña Ingresos)",
            js: ["_Ingresos.js"],
            ctrl: ["_Ingresos.php"],
            mdl: ["mdl-ingresos.php"]
        },
        uploads: [
            {
                type: "Archivo de ventas",
                format: "Excel (.xlsx, .xls) o CSV",
                description: "Archivo con el detalle de ventas del día"
            },
            {
                type: "Bitácora CCTV",
                format: "Archivo específico del sistema de cámaras",
                description: "Registro de ocupación de suites"
            }
        ],
        workflow: [
            "Acceder a la pestaña 'Ingresos'",
            "Verificar ventas sin impuestos",
            "Cargar archivo de ventas (opcional)",
            "Integrar datos de SoftRestaurant (opcional)",
            "Registrar ventas por concepto",
            "Capturar descuentos e impuestos",
            "Registrar efectivo y bancos en caja",
            "Registrar pagos de clientes",
            "Guardar movimientos"
        ],
        data: [
            "Ventas sin impuestos",
            "Descuentos aplicados",
            "Impuestos (IVA, IEPS, etc.)",
            "Subtotal y total de ventas",
            "Efectivo en caja",
            "Propinas/Depósitos",
            "Pagos por banco",
            "Monedas extranjeras",
            "Pagos de clientes",
            "Consumos de clientes"
        ],
        calculations: [
            "Subtotal = Ventas - Descuentos",
            "Total Ventas = Subtotal + Impuestos",
            "Total Caja = Efectivo - Propina + Bancos + Monedas",
            "Diferencia = Total Caja - Pagos Clientes + Deudas Clientes - Total Ventas"
        ]
    },
    compras: {
        title: "Compras",
        icon: "icon-shopping-cart",
        color: "warning",
        description: "Gestión completa de compras y gastos de la empresa.",
        purpose: "Controlar todos los egresos por compras, clasificarlos correctamente y mantener un registro de facturas y comprobantes.",
        features: [
            "Registro de compras individuales",
            "Carga masiva de facturas",
            "Clasificación por tipo de gasto",
            "Vinculación con proveedores",
            "Gestión de IVA",
            "Tipos de compra (Fondo, Corporativo, Crédito, Almacén, Costo)",
            "Adjuntar comprobantes",
            "Observaciones por compra"
        ],
        files: {
            view: "sobres.php (pestaña Compras)",
            js: ["_Compras.js"],
            ctrl: ["_Compras.php"],
            mdl: ["mdl-compras.php"]
        },
        uploads: [
            {
                type: "Facturas",
                format: "PDF, XML",
                description: "Facturas electrónicas o digitalizadas"
            },
            {
                type: "Comprobantes",
                format: "PDF, JPG, PNG",
                description: "Tickets, notas de compra, recibos"
            }
        ],
        workflow: [
            "Acceder a la pestaña 'Compras'",
            "Clic en 'Nueva compra' o 'Subir archivos'",
            "Seleccionar proveedor",
            "Elegir clase de insumo",
            "Seleccionar insumo específico (opcional)",
            "Definir salida de compra (Fondo/Corporativo/Crédito)",
            "Seleccionar tipo de pago",
            "Capturar subtotal e IVA",
            "Vincular factura (opcional)",
            "Adjuntar comprobante",
            "Agregar observaciones",
            "Guardar compra"
        ],
        data: [
            "Proveedor",
            "Clase de insumo",
            "Insumo específico",
            "Tipo de compra (id_CG)",
            "Tipo de pago (id_TP)",
            "Subtotal",
            "IVA",
            "Total (Subtotal + IVA)",
            "Número de factura",
            "Ruta del comprobante",
            "Observaciones",
            "Fecha de compra",
            "UDN"
        ],
        types: [
            { id: 1, name: "Corporativo", description: "Compras pagadas por corporativo" },
            { id: 2, name: "Crédito", description: "Compras a crédito con proveedores" },
            { id: 3, name: "Fondo", description: "Compras pagadas con fondo fijo" },
            { id: 4, name: "Almacén", description: "Salidas de almacén" },
            { id: 5, name: "Costo", description: "Costos directos" }
        ]
    },
    pagos: {
        title: "Pagos y Salidas",
        icon: "icon-credit-card",
        color: "danger",
        description: "Control completo de pagos y salidas de efectivo.",
        purpose: "Registrar todos los pagos realizados a proveedores, anticipos a empleados y cualquier salida de efectivo del fondo de caja.",
        features: [
            "Pagos a proveedores",
            "Anticipos a empleados",
            "Gastos diversos",
            "Salidas de almacén",
            "Tipos de pago (Corporativo/Fondo)",
            "Adjuntar comprobantes",
            "Observaciones detalladas"
        ],
        files: {
            view: "sobres.php (pestaña Pagos y Salidas)",
            js: ["_Pagos.js"],
            ctrl: ["_Pagos.php"],
            mdl: ["mdl-pagos.php"]
        },
        uploads: [
            {
                type: "Comprobantes de pago",
                format: "PDF, JPG, PNG",
                description: "Recibos, transferencias, vouchers"
            }
        ],
        workflow: [
            "Acceder a la pestaña 'Pagos y Salidas'",
            "Clic en 'Nuevo pago o salida'",
            "Seleccionar proveedor O tipo de almacén",
            "Definir tipo de pago (Corporativo/Fondo)",
            "Capturar cantidad",
            "Adjuntar comprobante",
            "Agregar observaciones",
            "Guardar pago"
        ],
        data: [
            "Proveedor (id_UP) o Almacén (id_UI)",
            "Tipo de pago (id_CG)",
            "Cantidad pagada",
            "Ruta del comprobante",
            "Observaciones",
            "Fecha de pago",
            "UDN"
        ],
        validations: [
            "Si se selecciona proveedor, el almacén se deshabilita",
            "Si se selecciona almacén, el proveedor se deshabilita",
            "El tipo de pago solo se habilita si hay proveedor",
            "No se pueden hacer pagos si hay retiro de tesorería"
        ]
    },
    clientes: {
        title: "Clientes",
        icon: "icon-users",
        color: "info",
        description: "Administración completa de cartera de clientes.",
        purpose: "Controlar los créditos otorgados a clientes, registrar sus pagos y mantener un estado de cuenta actualizado.",
        features: [
            "Catálogo de clientes",
            "Control de créditos",
            "Registro de pagos (Efectivo/Banco)",
            "Registro de consumos",
            "Historial de movimientos",
            "Estado de cuenta por cliente",
            "Saldos iniciales y finales",
            "Consultas por rango de fechas"
        ],
        files: {
            view: "sobres.php (pestaña Clientes)",
            js: ["_Clientes.js"],
            ctrl: ["_Clientes.php"],
            mdl: ["mdl-clientes.php"]
        },
        workflow: [
            "Acceder a la pestaña 'Clientes'",
            "Visualizar lista de clientes con saldo",
            "Clic en cliente para ver movimientos del día",
            "Clic en '[+] Pagos / Consumos' para nueva transacción",
            "Seleccionar cliente",
            "Registrar pago (Efectivo/Banco) O consumo",
            "Guardar transacción",
            "Verificar actualización de saldo"
        ],
        data: [
            "Cliente (id_UC)",
            "Saldo inicial",
            "Pagos en efectivo",
            "Pagos por banco",
            "Consumos/Créditos",
            "Saldo final",
            "Fecha de movimiento",
            "UDN"
        ],
        calculations: [
            "Saldo Final = Saldo Inicial + Consumos - Pagos",
            "Total Pagos = Efectivo + Banco",
            "Deuda Actualizada = Deuda Anterior + Consumo - Pago"
        ],
        reports: [
            "Saldo inicial del período",
            "Total de consumos",
            "Total de pagos",
            "Saldo final del período",
            "Movimientos por cliente por día"
        ]
    },
    proveedores: {
        title: "Proveedores",
        icon: "icon-briefcase",
        color: "secondary",
        description: "Gestión de proveedores y cuentas por pagar.",
        purpose: "Mantener un control de las cuentas por pagar a proveedores, registrar pagos realizados y consultar el estado de cuenta.",
        features: [
            "Catálogo de proveedores",
            "Cuentas por pagar",
            "Registro de pagos",
            "Historial de compras",
            "Estado de cuenta por proveedor",
            "Movimientos del día",
            "Consultas por período"
        ],
        files: {
            view: "sobres.php (pestaña Proveedores)",
            js: ["_Proveedores.js"],
            ctrl: ["_Proveedores.php"],
            mdl: ["mdl-proveedores.php"]
        },
        workflow: [
            "Acceder a la pestaña 'Proveedores'",
            "Visualizar lista de proveedores con saldo",
            "Clic en proveedor para ver movimientos",
            "Los movimientos se generan automáticamente desde Compras y Pagos",
            "Consultar estado de cuenta"
        ],
        data: [
            "Proveedor (id_UP)",
            "Saldo inicial",
            "Compras del período",
            "Pagos realizados",
            "Saldo final",
            "Fecha de movimiento",
            "UDN"
        ],
        calculations: [
            "Saldo Final = Saldo Inicial + Compras - Pagos",
            "Cuentas por Pagar = Total Compras - Total Pagos"
        ]
    },
    archivos: {
        title: "Archivos",
        icon: "icon-file-text",
        color: "dark",
        description: "Administración de todos los archivos y comprobantes del sistema.",
        purpose: "Centralizar el almacenamiento y gestión de todos los documentos digitales relacionados con las operaciones contables.",
        features: [
            "Almacenamiento de comprobantes",
            "Facturas digitales (PDF/XML)",
            "Documentos de respaldo",
            "Organización por fecha y tipo",
            "Visualización en línea",
            "Descarga de archivos",
            "Vinculación con movimientos"
        ],
        files: {
            view: "sobres.php (pestaña Archivos)",
            js: ["_Archivos.js"],
            ctrl: ["_Archivos.php"],
            mdl: ["mdl-archivos.php"]
        },
        uploads: [
            {
                type: "Facturas",
                format: "PDF, XML",
                description: "Facturas electrónicas"
            },
            {
                type: "Comprobantes",
                format: "PDF, JPG, PNG",
                description: "Tickets, recibos, vouchers"
            },
            {
                type: "Documentos",
                format: "PDF, DOC, XLS",
                description: "Contratos, convenios, reportes"
            }
        ],
        workflow: [
            "Acceder a la pestaña 'Archivos'",
            "Visualizar archivos del día",
            "Clic en archivo para visualizar",
            "Descargar si es necesario",
            "Eliminar archivos incorrectos (si está permitido)"
        ],
        data: [
            "Nombre del archivo",
            "Tipo de archivo",
            "Ruta de almacenamiento",
            "Fecha de carga",
            "Usuario que cargó",
            "Movimiento vinculado",
            "UDN"
        ]
    },
    caratula: {
        title: "Carátula",
        icon: "icon-file-text",
        color: "dark",
        description: "Generación de carátula contable del día con todos los movimientos.",
        purpose: "Crear un resumen ejecutivo de todas las operaciones del día en formato imprimible y exportable.",
        features: [
            "Resumen de ingresos",
            "Resumen de egresos",
            "Saldos finales",
            "Formato imprimible",
            "Exportación a Excel",
            "Filtros por UDN y fecha"
        ],
        files: {
            view: "caratula.php",
            js: ["_Caratula.js", "caratula.js"],
            ctrl: ["_Caratula.php"],
            mdl: ["mdl-caratula.php"]
        },
        workflow: [
            "Acceder a 'Carátula'",
            "Seleccionar UDN",
            "Seleccionar fecha",
            "Visualizar resumen",
            "Imprimir o exportar a Excel"
        ],
        data: [
            "Ventas del día",
            "Descuentos",
            "Impuestos",
            "Total de ingresos",
            "Compras del día",
            "Pagos realizados",
            "Total de egresos",
            "Saldo inicial",
            "Saldo final"
        ],
        sections: [
            "Encabezado (UDN, Fecha)",
            "Ingresos detallados",
            "Egresos detallados",
            "Resumen de caja",
            "Firmas de responsables"
        ]
    },
    consultas: {
        title: "Consultas",
        icon: "icon-search",
        color: "primary",
        description: "Módulo de reportes y consultas avanzadas del sistema contable.",
        purpose: "Generar reportes personalizados por rangos de fechas y diferentes criterios de búsqueda, permitiendo análisis detallados de todas las operaciones contables.",
        features: [
            "Selector de rango de fechas con presets (últimos 7 días, mes actual, año actual, etc.)",
            "Consultas de ingresos con desglose completo",
            "Reportes de compras por tipo y clasificación",
            "Análisis de almacén y costos",
            "Estado de cuenta de clientes",
            "Estado de cuenta de proveedores",
            "Consulta de archivos por período",
            "Exportación a Excel con formato",
            "Tablas con columnas fijas para mejor visualización",
            "Saldos de fondo de caja por período"
        ],
        files: {
            view: "consultas.php",
            js: ["consultas.js", "_Ingresos.js", "_Compras.js", "_Pagos.js", "_Clientes.js", "_Proveedores.js", "_Archivos.js"],
            ctrl: ["_Ingresos.php", "_Compras.php", "_Pagos.php", "_Clientes.php", "_Proveedores.php", "_Archivos.php"],
            mdl: ["mdl-ingresos.php", "mdl-compras.php", "mdl-pagos.php", "mdl-clientes.php", "mdl-proveedores.php", "mdl-archivos.php"]
        },
        workflow: [
            "Acceder al módulo 'Consultas'",
            "Seleccionar UDN (si hay múltiples unidades)",
            "Elegir rango de fechas usando el selector de calendario",
            "Seleccionar pestaña del reporte deseado (Ingresos, Compras, Almacén, Clientes, Proveedores, Archivos)",
            "Aplicar filtros específicos según el tipo de consulta",
            "Visualizar resultados en tabla dinámica",
            "Expandir/contraer secciones para ver detalles",
            "Exportar a Excel si es necesario"
        ],
        data: [
            "Rango de fechas seleccionado",
            "UDN seleccionada",
            "Saldo inicial del período",
            "Saldo final del período",
            "Egresos totales",
            "Datos por fecha dentro del rango",
            "Totales por concepto",
            "Subtotales y gran total"
        ],
        tabs: [
            {
                name: "Ingresos",
                description: "Consulta detallada de todos los ingresos del período",
                features: [
                    "Ventas sin impuestos por concepto",
                    "Descuentos aplicados",
                    "Impuestos desglosados",
                    "Subtotal y total de ventas",
                    "Efectivo, monedas y bancos",
                    "Movimientos de clientes (pagos y consumos)",
                    "Diferencia de caja",
                    "Totales por fecha y gran total"
                ],
                data: "Ventas, descuentos, impuestos, efectivo, monedas, bancos, clientes"
            },
            {
                name: "Compras",
                description: "Análisis de compras por tipo y clasificación",
                features: [
                    "Filtro por tipo de compra (Fondo, Corporativo, Crédito, Almacén, Todas)",
                    "Filtro por forma de pago (cuando aplica)",
                    "Vista totales o detallada",
                    "Desglose por clase de insumo",
                    "Subtotal e impuestos por concepto",
                    "Detalle de compras por fecha al hacer clic",
                    "Exportación a Excel"
                ],
                data: "Tipo de compra, clase de insumo, subtotal, IVA, total, fechas"
            },
            {
                name: "Almacén y Costos",
                description: "Análisis de movimientos de almacén y costos",
                features: [
                    "Filtro: Almacén o Costos",
                    "Saldo inicial de almacén",
                    "Entradas (compras)",
                    "Salidas (pagos)",
                    "Saldo final",
                    "Desglose por tipo de almacén",
                    "Análisis de costos directos e indirectos",
                    "Totales por fecha"
                ],
                data: "Almacén, saldo inicial, entradas, salidas, saldo final, costos"
            },
            {
                name: "Clientes",
                description: "Estado de cuenta de clientes por período",
                features: [
                    "Saldo inicial por cliente",
                    "Consumos del período",
                    "Pagos recibidos",
                    "Saldo final",
                    "Movimientos por fecha",
                    "Totales generales",
                    "Expandir/contraer detalles por cliente"
                ],
                data: "Cliente, saldo inicial, consumos, pagos, saldo final, fechas"
            },
            {
                name: "Proveedores",
                description: "Estado de cuenta de proveedores por período",
                features: [
                    "Saldo inicial por proveedor",
                    "Compras del período",
                    "Pagos realizados",
                    "Saldo final (cuentas por pagar)",
                    "Movimientos por fecha",
                    "Totales generales",
                    "Expandir/contraer detalles por proveedor"
                ],
                data: "Proveedor, saldo inicial, compras, pagos, saldo final, fechas"
            },
            {
                name: "Archivos",
                description: "Consulta de archivos y comprobantes del período",
                features: [
                    "Filtros por tipo de archivo",
                    "Lista de archivos cargados",
                    "Fecha de carga",
                    "Usuario que cargó",
                    "Visualización de archivos",
                    "Descarga de comprobantes"
                ],
                data: "Nombre archivo, tipo, fecha, usuario, ruta"
            }
        ],
        dateRanges: [
            { name: "Últimos 7 días", description: "Consulta de la última semana" },
            { name: "Mes actual", description: "Del inicio del mes hasta ayer" },
            { name: "Mes anterior", description: "Todo el mes anterior completo" },
            { name: "Año actual", description: "Del inicio del año hasta ayer" },
            { name: "Año anterior", description: "Todo el año anterior completo" },
            { name: "Personalizado", description: "Seleccionar fechas manualmente" }
        ],
        exports: [
            {
                type: "Excel",
                description: "Exportación con formato de tablas dinámicas",
                features: [
                    "Columnas fijas para mejor lectura",
                    "Formato de moneda automático",
                    "Conversión de guiones a ceros",
                    "Nombre de archivo con UDN y fecha"
                ]
            }
        ],
        calculations: [
            "Totales por concepto",
            "Totales por fecha",
            "Gran total del período",
            "Subtotales por categoría",
            "Diferencias de caja",
            "Saldos iniciales y finales"
        ],
        visualFeatures: [
            "Tablas con scroll horizontal y vertical",
            "Columnas fijas (primeras 2 columnas)",
            "Filas expandibles/contraíbles",
            "Iconos indicadores de expansión",
            "Colores diferenciados por sección",
            "Formato de moneda con separadores",
            "Responsive design"
        ]
    },
    administracion: {
        title: "Administración",
        icon: "icon-cog",
        color: "success",
        description: "Configuración y administración del sistema contable.",
        purpose: "Gestionar las configuraciones base del sistema, aperturas de sobres y conceptos contables.",
        features: [
            "Aperturas de sobres",
            "Cierre de sobres",
            "Conceptos contables",
            "Configuración de UDN",
            "Control de fechas permitidas",
            "Gestión de usuarios",
            "Documentación del sistema"
        ],
        files: {
            view: "administracion.php",
            js: ["_Apertura.js", "_Conceptos.js", "administracion.js"],
            ctrl: ["_Apertura.php", "_Conceptos.php"],
            mdl: ["mdl-apertura.php", "mdl-conceptos.php"]
        },
        workflow: [
            "Acceder a 'Administración'",
            "Seleccionar pestaña (Aperturas/Conceptos/Documentación)",
            "Realizar configuraciones necesarias",
            "Guardar cambios"
        ],
        sections: [
            {
                name: "Aperturas",
                description: "Control de apertura y cierre de sobres por UDN",
                functions: ["Abrir sobres", "Cerrar sobres", "Validar fechas", "Control de horarios"]
            },
            {
                name: "Conceptos",
                description: "Catálogo de conceptos contables",
                functions: ["Conceptos de ingreso", "Conceptos de egreso", "Tipos de pago", "Clasificaciones"]
            },
            {
                name: "Documentación",
                description: "Guía completa del sistema",
                functions: ["Manual de usuario", "Flujos de trabajo", "Preguntas frecuentes"]
            }
        ]
    }
};

function showModuleDetail(moduleKey) {
    const module = modulesData[moduleKey];
    if (!module) return;

    const detailHTML = `
        <div class="col-12 module-detail active" id="detail-${moduleKey}">
            <button class="btn btn-secondary mb-3 back-button" onclick="hideModuleDetail()">
                <i class="icon-left-open"></i> Volver a módulos
            </button>
            
            <div class="card shadow-lg">
                <div class="card-header bg-${module.color} text-white">
                    <h3 class="mb-0">
                        <i class="${module.icon}"></i> ${module.title}
                    </h3>
                </div>
                <div class="card-body">
                    <!-- Descripción -->
                    <div class="detail-section">
                        <h5><i class="icon-info-circled"></i> Descripción</h5>
                        <p>${module.description}</p>
                    </div>

                    <!-- Propósito -->
                    <div class="detail-section">
                        <h5><i class="icon-target"></i> Propósito</h5>
                        <p>${module.purpose}</p>
                    </div>

                    <!-- Características -->
                    <div class="detail-section">
                        <h5><i class="icon-star"></i> Características Principales</h5>
                        <ul>
                            ${module.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Archivos del Sistema -->
                    <div class="detail-section">
                        <h5><i class="icon-file-code"></i> Archivos del Sistema</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Vista:</strong><br>
                                <span class="badge-file">${module.files.view}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>JavaScript:</strong><br>
                                ${module.files.js.map(f => `<span class="badge-file">${f}</span>`).join(' ')}
                            </div>
                            <div class="col-md-6 mt-2">
                                <strong>Controladores:</strong><br>
                                ${module.files.ctrl.map(f => `<span class="badge-file">${f}</span>`).join(' ')}
                            </div>
                            <div class="col-md-6 mt-2">
                                <strong>Modelos:</strong><br>
                                ${module.files.mdl.map(f => `<span class="badge-file">${f}</span>`).join(' ')}
                            </div>
                        </div>
                    </div>

                    <!-- Archivos que sube -->
                    ${module.uploads ? `
                    <div class="detail-section">
                        <h5><i class="icon-upload"></i> Archivos que Sube</h5>
                        ${module.uploads.map(u => `
                            <div class="mb-2">
                                <strong>${u.type}:</strong> <span class="badge bg-info">${u.format}</span><br>
                                <small class="text-muted">${u.description}</small>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <!-- Flujo de Trabajo -->
                    <div class="detail-section">
                        <h5><i class="icon-flow-tree"></i> Flujo de Trabajo</h5>
                        ${module.workflow.map((step, i) => `
                            <div class="workflow-step">
                                <strong>${i + 1}.</strong> ${step}
                            </div>
                        `).join('')}
                    </div>

                    <!-- Datos que Usa -->
                    <div class="detail-section">
                        <h5><i class="icon-database"></i> Datos que Utiliza</h5>
                        <div class="row">
                            ${module.data.map(d => `
                                <div class="col-md-6">
                                    <i class="icon-right-dir text-primary"></i> ${d}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Cálculos (si existen) -->
                    ${module.calculations ? `
                    <div class="detail-section">
                        <h5><i class="icon-calculator"></i> Cálculos Automáticos</h5>
                        <ul>
                            ${module.calculations.map(c => `<li><code>${c}</code></li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <!-- Tipos (si existen) -->
                    ${module.types ? `
                    <div class="detail-section">
                        <h5><i class="icon-list"></i> Tipos de Compra</h5>
                        ${module.types.map(t => `
                            <div class="mb-2">
                                <strong>${t.name}:</strong> ${t.description}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <!-- Validaciones (si existen) -->
                    ${module.validations ? `
                    <div class="detail-section">
                        <h5><i class="icon-attention"></i> Validaciones</h5>
                        <ul>
                            ${module.validations.map(v => `<li>${v}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <!-- Reportes (si existen) -->
                    ${module.reports ? `
                    <div class="detail-section">
                        <h5><i class="icon-chart-bar"></i> Reportes Disponibles</h5>
                        <ul>
                            ${module.reports.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <!-- Pestañas/Tabs (si existen) -->
                    ${module.tabs ? `
                    <div class="detail-section">
                        <h5><i class="icon-th-large"></i> Pestañas del Módulo</h5>
                        ${module.tabs.map((tab, index) => `
                            <div class="card mb-3">
                                <div class="card-header bg-light">
                                    <strong>${index + 1}. ${tab.name}</strong>
                                </div>
                                <div class="card-body">
                                    <p>${tab.description}</p>
                                    <strong>Características:</strong>
                                    <ul class="small">
                                        ${tab.features.map(f => `<li>${f}</li>`).join('')}
                                    </ul>
                                    <strong>Datos:</strong> <span class="badge bg-secondary">${tab.data}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <!-- Rangos de Fecha (si existen) -->
                    ${module.dateRanges ? `
                    <div class="detail-section">
                        <h5><i class="icon-calendar"></i> Rangos de Fecha Disponibles</h5>
                        <div class="row">
                            ${module.dateRanges.map(dr => `
                                <div class="col-md-6 mb-2">
                                    <strong>${dr.name}:</strong> ${dr.description}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Exportaciones (si existen) -->
                    ${module.exports ? `
                    <div class="detail-section">
                        <h5><i class="icon-download"></i> Opciones de Exportación</h5>
                        ${module.exports.map(exp => `
                            <div class="mb-3">
                                <strong>${exp.type}:</strong> ${exp.description}<br>
                                <ul class="small mt-2">
                                    ${exp.features.map(f => `<li>${f}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <!-- Características Visuales (si existen) -->
                    ${module.visualFeatures ? `
                    <div class="detail-section">
                        <h5><i class="icon-eye"></i> Características Visuales</h5>
                        <div class="row">
                            ${module.visualFeatures.map(vf => `
                                <div class="col-md-6">
                                    <i class="icon-ok text-success"></i> ${vf}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Secciones (si existen) -->
                    ${module.sections ? `
                    <div class="detail-section">
                        <h5><i class="icon-th-list"></i> Secciones del Módulo</h5>
                        ${Array.isArray(module.sections) && typeof module.sections[0] === 'object' ? 
                            module.sections.map(s => `
                                <div class="mb-3">
                                    <strong>${s.name}:</strong> ${s.description}<br>
                                    <small>${s.functions.join(', ')}</small>
                                </div>
                            `).join('') :
                            `<ul>${module.sections.map(s => `<li>${s}</li>`).join('')}</ul>`
                        }
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    $("#contentDocumentacion").html(detailHTML);
    window.scrollTo(0, 0);
}

function hideModuleDetail() {
    loadDocumentacion();
}
