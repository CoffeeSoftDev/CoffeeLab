<!-- Navbar SoftRestaurant -->
<nav class="bg-[#103B60] shadow-lg">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
            <!-- Logo y Título -->
            <div class="flex items-center">
                <a href="index.php" class="flex items-center">
                    <i class="icon-restaurant text-white text-3xl mr-3"></i>
                    <div>
                        <h1 class="text-white text-xl font-bold">SoftRestaurant</h1>
                        <p class="text-gray-300 text-xs">Sistema Modernizado</p>
                    </div>
                </a>
            </div>

            <!-- Menú Principal -->
            <div class="hidden md:flex items-center space-x-4">
                <a href="index.php" class="text-white hover:bg-[#8CC63F] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <i class="icon-home mr-1"></i> Inicio
                </a>
                <a href="administracion.php" class="text-white hover:bg-[#8CC63F] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <i class="icon-cog mr-1"></i> Administración
                </a>
                <a href="productos-vendidos.php" class="text-white hover:bg-[#8CC63F] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <i class="icon-chart-bar mr-1"></i> Productos Vendidos
                </a>
                <a href="salidas.php" class="text-white hover:bg-[#8CC63F] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <i class="icon-export mr-1"></i> Salidas
                </a>
            </div>

            <!-- Usuario -->
            <div class="flex items-center">
                <div class="relative">
                    <button id="userMenuButton" class="flex items-center text-white hover:bg-[#8CC63F] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        <i class="icon-user mr-2"></i>
                        <span><?php echo $_COOKIE['NOMBRE'] ?? 'Usuario'; ?></span>
                        <i class="icon-chevron-down ml-2"></i>
                    </button>
                    
                    <!-- Dropdown Menu -->
                    <div id="userMenu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <i class="icon-user mr-2"></i> Mi Perfil
                        </a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <i class="icon-settings mr-2"></i> Configuración
                        </a>
                        <hr class="my-1">
                        <a href="../../acceso/ctrl/ctrl-logout.php" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                            <i class="icon-logout mr-2"></i> Cerrar Sesión
                        </a>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden">
                <button id="mobileMenuButton" class="text-white hover:bg-[#8CC63F] p-2 rounded-md">
                    <i class="icon-menu text-2xl"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobileMenu" class="hidden md:hidden pb-4">
            <a href="index.php" class="block text-white hover:bg-[#8CC63F] px-3 py-2 rounded-md text-sm font-medium">
                <i class="icon-home mr-2"></i> Inicio
            </a>
            <a href="administracion.php" class="block text-white hover:bg-[#8CC63F] px-3 py-2 rounded-md text-sm font-medium">
                <i class="icon-cog mr-2"></i> Administración
            </a>
            <a href="productos-vendidos.php" class="block text-white hover:bg-[#8CC63F] px-3 py-2 rounded-md text-sm font-medium">
                <i class="icon-chart-bar mr-2"></i> Productos Vendidos
            </a>
            <a href="salidas.php" class="block text-white hover:bg-[#8CC63F] px-3 py-2 rounded-md text-sm font-medium">
                <i class="icon-export mr-2"></i> Salidas
            </a>
        </div>
    </div>
</nav>

<script>
// Toggle User Menu
document.getElementById('userMenuButton')?.addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('userMenu').classList.toggle('hidden');
});

// Toggle Mobile Menu
document.getElementById('mobileMenuButton')?.addEventListener('click', function() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

// Close menus when clicking outside
document.addEventListener('click', function(e) {
    const userMenu = document.getElementById('userMenu');
    const userButton = document.getElementById('userMenuButton');
    
    if (userMenu && !userButton?.contains(e.target)) {
        userMenu.classList.add('hidden');
    }
});
</script>
