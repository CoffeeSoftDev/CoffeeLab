<?php 
    if(empty($_COOKIE["IDU"])) require_once('../../acceso/ctrl/ctrl-logout.php');
    require_once('layout/head.php');
?>
<body>
    <?php require_once('layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">
            <div id="root" class="container mx-auto p-6">
                <div class="mb-6">
                    <h1 class="text-3xl font-bold text-gray-800">🍽️ SoftRestaurant - Sistema Modernizado</h1>
                    <p class="text-gray-600 mt-2">Gestión integral de productos y ventas</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Administración -->
                    <a href="administracion.php" class="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-blue-500">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="icon-cog text-blue-600 text-2xl"></i>
                            </div>
                            <h2 class="ml-4 text-xl font-semibold text-gray-800">Administración</h2>
                        </div>
                        <p class="text-gray-600">Gestión de productos, categorías y homologación con Costsys</p>
                    </a>

                    <!-- Productos Vendidos -->
                    <a href="productos-vendidos.php" class="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-green-500">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="icon-chart-bar text-green-600 text-2xl"></i>
                            </div>
                            <h2 class="ml-4 text-xl font-semibold text-gray-800">Productos Vendidos</h2>
                        </div>
                        <p class="text-gray-600">Consulta de ventas, desplazamiento y costo potencial</p>
                    </a>

                    <!-- Salidas -->
                    <a href="salidas.php" class="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-orange-500">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <i class="icon-export text-orange-600 text-2xl"></i>
                            </div>
                            <h2 class="ml-4 text-xl font-semibold text-gray-800">Salidas</h2>
                        </div>
                        <p class="text-gray-600">Registro de salidas, mermas y cortesías</p>
                    </a>

                    <!-- Archivos Diarios -->
                    <a href="#" class="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-purple-500 opacity-75">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="icon-folder text-purple-600 text-2xl"></i>
                            </div>
                            <h2 class="ml-4 text-xl font-semibold text-gray-800">Archivos Diarios</h2>
                        </div>
                        <p class="text-gray-600">Gestión de archivos y días pendientes (Próximamente)</p>
                    </a>

                    <!-- Reportes -->
                    <a href="#" class="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-red-500 opacity-75">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <i class="icon-file-text text-red-600 text-2xl"></i>
                            </div>
                            <h2 class="ml-4 text-xl font-semibold text-gray-800">Reportes</h2>
                        </div>
                        <p class="text-gray-600">Reportes avanzados y análisis (Próximamente)</p>
                    </a>

                    <!-- Configuración -->
                    <a href="#" class="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-gray-500 opacity-75">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <i class="icon-settings text-gray-600 text-2xl"></i>
                            </div>
                            <h2 class="ml-4 text-xl font-semibold text-gray-800">Configuración</h2>
                        </div>
                        <p class="text-gray-600">Configuración del sistema (Próximamente)</p>
                    </a>
                </div>

                <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 class="font-semibold text-blue-800 mb-2">ℹ️ Información del Sistema</h3>
                    <ul class="text-sm text-blue-700 space-y-1">
                        <li>✓ Framework: CoffeeSoft 2.0</li>
                        <li>✓ Arquitectura: MVC (Modelo-Vista-Controlador)</li>
                        <li>✓ Estilos: TailwindCSS</li>
                        <li>✓ Base de Datos: MySQL</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>
    <?php require_once('layout/footer.php'); ?>
</body>
</html>
