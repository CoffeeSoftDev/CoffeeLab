<?php 
    if( empty($_COOKIE["IDU"]) )  require_once('../acceso/ctrl/ctrl-logout.php');

    require_once('layout/head.php');
    require_once('layout/script.php'); 
?>

<body>
    <?php require_once('../layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">

            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>contabilidad</li>
                    <li class='breadcrumb-item fw-bold active'>Documentación</li>
                </ol>
            </nav>

            <div class="row">
                <div class="col-12">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h3 class="mb-0">
                                <i class="icon-book-open"></i> Documentación del Sistema de Contabilidad
                            </h3>
                        </div>
                        <div class="card-body p-4">
                            <div class="row mb-4">
                                <div class="col-12">
                                    <p class="lead text-muted">
                                        Guía completa del sistema de contabilidad CoffeeSoft ERP. 
                                        Aquí encontrarás información detallada sobre cada módulo, 
                                        flujos de trabajo y mejores prácticas.
                                    </p>
                                </div>
                            </div>

                            <!-- Índice -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="card bg-light">
                                        <div class="card-body">
                                            <h4 class="card-title">
                                                <i class="icon-list"></i> Índice de Contenidos
                                            </h4>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <ul>
                                                        <li><a href="#descripcion">Descripción General</a></li>
                                                        <li><a href="#arquitectura">Arquitectura del Sistema</a></li>
                                                        <li><a href="#modulos">Módulos del Sistema</a></li>
                                                        <li><a href="#flujo">Flujo de Trabajo</a></li>
                                                    </ul>
                                                </div>
                                                <div class="col-md-6">
                                                    <ul>
                                                        <li><a href="#estructura">Estructura de Archivos</a></li>
                                                        <li><a href="#componentes">Componentes Visuales</a></li>
                                                        <li><a href="#seguridad">Seguridad</a></li>
                                                        <li><a href="#tecnologias">Tecnologías</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Descripción General -->
                            <div class="row mb-5" id="descripcion">
                                <div class="col-12">
                                    <h3 class="text-primary border-bottom pb-2">
                                        <i class="icon-info-circled"></i> Descripción General
                                    </h3>
                                    <p>
                                        El <strong>Sistema de Contabilidad</strong> es un módulo integral del ERP CoffeeSoft 
                                        diseñado para gestionar todas las operaciones financieras diarias de una empresa. 
                                        Permite el control de ingresos, egresos, compras, pagos, clientes, proveedores 
                                        y la generación de reportes contables.
                                    </p>
                                    <div class="row mt-3">
                                        <div class="col-md-6">
                                            <h5>Características Principales:</h5>
                                            <ul>
                                                <li>Gestión de sobres diarios por UDN</li>
                                                <li>Control de turnos y aperturas de caja</li>
                                                <li>Registro de ingresos y ventas</li>
                                                <li>Administración de compras y gastos</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-6">
                                            <ul class="mt-4 mt-md-0">
                                                <li>Control de pagos y salidas</li>
                                                <li>Gestión de clientes y proveedores</li>
                                                <li>Manejo de archivos y comprobantes</li>
                                                <li>Generación de carátulas y reportes</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Módulos del Sistema -->
                            <div class="row mb-5" id="modulos">
                                <div class="col-12">
                                    <h3 class="text-primary border-bottom pb-2">
                                        <i class="icon-folder-open"></i> Módulos del Sistema
                                    </h3>
                                </div>

                                <!-- Sobres -->
                                <div class="col-12 col-md-6 col-lg-4 mb-3">
                                    <div class="card border-primary h-100">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0">
                                                <i class="icon-folder"></i> Sobres
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="small">
                                                Módulo principal para gestión de operaciones financieras diarias 
                                                organizadas por UDN y fecha.
                                            </p>
                                            <h6>Funcionalidades:</h6>
                                            <ul class="small">
                                                <li>Control de saldos de caja</li>
                                                <li>Gestión de turnos</li>
                                                <li>Registro de movimientos</li>
                                                <li>Navegación por pestañas</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Ingresos -->
                                <div class="col-12 col-md-6 col-lg-4 mb-3">
                                    <div class="card border-success h-100">
                                        <div class="card-header bg-success text-white">
                                            <h5 class="mb-0">
                                                <i class="icon-dollar"></i> Ingresos
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="small">
                                                Administración de todos los ingresos de la empresa.
                                            </p>
                                            <h6>Funcionalidades:</h6>
                                            <ul class="small">
                                                <li>Registro de ventas</li>
                                                <li>Carga de archivos</li>
                                                <li>Integración SoftRestaurant</li>
                                                <li>Bitácora CCTV</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Compras -->
                                <div class="col-12 col-md-6 col-lg-4 mb-3">
                                    <div class="card border-warning h-100">
                                        <div class="card-header bg-warning text-dark">
                                            <h5 class="mb-0">
                                                <i class="icon-shopping-cart"></i> Compras
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="small">
                                                Gestión de compras y gastos de la empresa.
                                            </p>
                                            <h6>Funcionalidades:</h6>
                                            <ul class="small">
                                                <li>Registro de compras</li>
                                                <li>Carga de facturas</li>
                                                <li>Clasificación de gastos</li>
                                                <li>Gestión de IVA</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pagos -->
                                <div class="col-12 col-md-6 col-lg-4 mb-3">
                                    <div class="card border-danger h-100">
                                        <div class="card-header bg-danger text-white">
                                            <h5 class="mb-0">
                                                <i class="icon-credit-card"></i> Pagos y Salidas
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="small">
                                                Control de pagos y salidas de efectivo.
                                            </p>
                                            <h6>Funcionalidades:</h6>
                                            <ul class="small">
                                                <li>Pagos a proveedores</li>
                                                <li>Anticipos a empleados</li>
                                                <li>Gastos diversos</li>
                                                <li>Salidas de caja</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Clientes -->
                                <div class="col-12 col-md-6 col-lg-4 mb-3">
                                    <div class="card border-info h-100">
                                        <div class="card-header bg-info text-white">
                                            <h5 class="mb-0">
                                                <i class="icon-users"></i> Clientes
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="small">
                                                Administración de cartera de clientes.
                                            </p>
                                            <h6>Funcionalidades:</h6>
                                            <ul class="small">
                                                <li>Registro de clientes</li>
                                                <li>Control de créditos</li>
                                                <li>Pagos de clientes</li>
                                                <li>Estado de cuenta</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Proveedores -->
                                <div class="col-12 col-md-6 col-lg-4 mb-3">
                                    <div class="card border-secondary h-100">
                                        <div class="card-header bg-secondary text-white">
                                            <h5 class="mb-0">
                                                <i class="icon-briefcase"></i> Proveedores
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="small">
                                                Gestión de proveedores y cuentas por pagar.
                                            </p>
                                            <h6>Funcionalidades:</h6>
                                            <ul class="small">
                                                <li>Catálogo de proveedores</li>
                                                <li>Cuentas por pagar</li>
                                                <li>Historial de compras</li>
                                                <li>Estado de cuenta</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Carátula -->
                                <div class="col-12 col-md-6 col-lg-4 mb-3">
                                    <div class="card border-dark h-100">
                                        <div class="card-header bg-dark text-white">
                                            <h5 class="mb-0">
                                                <i class="icon-file-text"></i> Carátula
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="small">
                                                Generación de carátula contable del día.
                                            </p>
                                            <h6>Funcionalidades:</h6>
                                            <ul class="small">
                                                <li>Resumen de ingresos</li>
                                                <li>Resumen de egresos</li>
                                                <li>Formato imprimible</li>
                                                <li>Exportación a Excel</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Consultas -->
                                <div class="col-12 col-md-6 col-lg-4 mb-3">
                                    <div class="card border-primary h-100">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0">
                                                <i class="icon-search"></i> Consultas
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="small">
                                                Reportes y consultas avanzadas.
                                            </p>
                                            <h6>Funcionalidades:</h6>
                                            <ul class="small">
                                                <li>Consultas por rango</li>
                                                <li>Reportes de ingresos</li>
                                                <li>Reportes de egresos</li>
                                                <li>Exportación de datos</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Administración -->
                                <div class="col-12 col-md-6 col-lg-4 mb-3">
                                    <div class="card border-success h-100">
                                        <div class="card-header bg-success text-white">
                                            <h5 class="mb-0">
                                                <i class="icon-cog"></i> Administración
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="small">
                                                Configuración y administración del sistema.
                                            </p>
                                            <h6>Funcionalidades:</h6>
                                            <ul class="small">
                                                <li>Aperturas de sobres</li>
                                                <li>Conceptos contables</li>
                                                <li>Configuración general</li>
                                                <li>Documentación</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Flujo de Trabajo -->
                            <div class="row mb-5" id="flujo">
                                <div class="col-12">
                                    <h3 class="text-primary border-bottom pb-2">
                                        <i class="icon-flow-tree"></i> Flujo de Trabajo Diario
                                    </h3>
                                </div>
                                <div class="col-12">
                                    <div class="card bg-light">
                                        <div class="card-body">
                                            <ol class="mb-0">
                                                <li class="mb-3">
                                                    <strong>Apertura de Sobre:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Seleccionar UDN, verificar fecha permitida y registrar saldo inicial
                                                    </p>
                                                </li>
                                                <li class="mb-3">
                                                    <strong>Registro de Turnos:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Apertura de turnos de trabajo y asignación de responsables
                                                    </p>
                                                </li>
                                                <li class="mb-3">
                                                    <strong>Captura de Ingresos:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Registro de ventas, ingresos extraordinarios y otros ingresos
                                                    </p>
                                                </li>
                                                <li class="mb-3">
                                                    <strong>Registro de Compras:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Captura de gastos, compras del día y carga de facturas
                                                    </p>
                                                </li>
                                                <li class="mb-3">
                                                    <strong>Registro de Pagos:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Pagos a proveedores, anticipos y salidas de caja
                                                    </p>
                                                </li>
                                                <li class="mb-3">
                                                    <strong>Actualización de Clientes:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Movimientos de cartera y pagos de clientes
                                                    </p>
                                                </li>
                                                <li class="mb-3">
                                                    <strong>Actualización de Proveedores:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Cuentas por pagar y movimientos de proveedores
                                                    </p>
                                                </li>
                                                <li class="mb-3">
                                                    <strong>Carga de Archivos:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Comprobantes, facturas y documentos de respaldo
                                                    </p>
                                                </li>
                                                <li class="mb-3">
                                                    <strong>Generación de Carátula:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Resumen del día con todos los movimientos
                                                    </p>
                                                </li>
                                                <li class="mb-0">
                                                    <strong>Cierre de Sobre:</strong> 
                                                    <p class="mb-0 text-muted small">
                                                        Conciliación final y cierre del día
                                                    </p>
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Notas Importantes -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h3 class="text-primary border-bottom pb-2">
                                        <i class="icon-attention"></i> Notas Importantes
                                    </h3>
                                </div>
                                <div class="col-12">
                                    <div class="alert alert-warning">
                                        <h5 class="alert-heading">
                                            <i class="icon-attention-circled"></i> Consideraciones Importantes
                                        </h5>
                                        <ul class="mb-0">
                                            <li><strong>Fechas Permitidas:</strong> Solo se pueden realizar operaciones en fechas habilitadas por el sistema</li>
                                            <li><strong>Cierre de Sobres:</strong> Una vez cerrado un sobre, no se pueden realizar modificaciones</li>
                                            <li><strong>Saldos Automáticos:</strong> Los saldos se calculan automáticamente con cada movimiento</li>
                                            <li><strong>Comprobantes:</strong> Es recomendable adjuntar comprobantes a todos los movimientos</li>
                                            <li><strong>Conciliación:</strong> Se debe conciliar diariamente con los sistemas externos (SoftRestaurant, etc.)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- Tecnologías -->
                            <div class="row mb-4" id="tecnologias">
                                <div class="col-12">
                                    <h3 class="text-primary border-bottom pb-2">
                                        <i class="icon-code"></i> Tecnologías Utilizadas
                                    </h3>
                                </div>
                                <div class="col-md-6">
                                    <ul>
                                        <li><strong>Backend:</strong> PHP 7+</li>
                                        <li><strong>Frontend:</strong> JavaScript (ES6+), jQuery</li>
                                        <li><strong>Framework:</strong> CoffeeSoft</li>
                                        <li><strong>Estilos:</strong> Bootstrap 5, TailwindCSS</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <ul>
                                        <li><strong>Base de Datos:</strong> MySQL</li>
                                        <li><strong>Plugins:</strong> DataTables, Bootbox, SweetAlert2</li>
                                        <li><strong>Patrón:</strong> MVC (Modelo-Vista-Controlador)</li>
                                        <li><strong>Arquitectura:</strong> CoffeeSoft ERP</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Botones de Acción -->
                            <div class="row mt-5">
                                <div class="col-12 text-center">
                                    <a href="Doc-Sistema-Contable.md" download class="btn btn-primary btn-lg me-2">
                                        <i class="icon-download"></i> Descargar Documentación (MD)
                                    </a>
                                    <a href="administracion.php" class="btn btn-success btn-lg">
                                        <i class="icon-cog"></i> Ir a Administración
                                    </a>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="row mt-5">
                                <div class="col-12 text-center text-muted">
                                    <hr>
                                    <p class="mb-0">
                                        <strong>Versión:</strong> 2.0 | 
                                        <strong>Última actualización:</strong> Mayo 2025 | 
                                        <strong>Desarrollado por:</strong> CoffeeSoft Development Team ☕
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>

</html>
