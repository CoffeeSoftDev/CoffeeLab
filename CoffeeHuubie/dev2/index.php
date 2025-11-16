<?php
session_start();

// Verifica si la sesión está iniciada
if (isset($_SESSION['USR'])) {
    // Redirige al login si no está autenticado
    header('Location: /alpha/menu/');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="src/img/logo/logo.ico" />
    <link rel="Huubie" href="src/img/logo/logo.ico">
    <title>Huubie Alpha</title>
    <link rel="stylesheet" href="src/plugins/sweetalert2/sweetalert2.min.css">
    <script src="src/plugins/sweetalert2/sweetalert2.all.min.js"></script>
    <link rel="stylesheet" href="/alpha/src/plugins/fontello/css/fontello.css">

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="src/plugins/jquery/jquery-3.7.0.js"></script>
    <script src="src/js/complementos.js?t=<?= time() ?>"></script>
    <script src="src/js/plugins.js?t=<?= time() ?>"></script>
    <script src="src/js/coffeSoft.js?t=<?= time() ?>"></script>
</head>

<body class="bg-gradient-to-br from-[#1E293B] via-[#1F2937] to-[#111827] flex items-center justify-center min-h-screen relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, #3B82F6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8B5CF6 0%, transparent 50%);"></div>
    </div>
    
    <div class="w-full flex flex-wrap items-center justify-center px-4 relative z-10 max-w-6xl mx-auto">
        <!-- Sección formulario -->
        <div class="w-full md:w-1/2 flex flex-col items-center justify-center mb-6 md:mb-0 md:pr-8">
            <!-- Bienvenida -->
            <div class="w-full md:w-4/5 bg-gradient-to-r from-[#333D4C] to-[#3B4A5C] p-6 flex items-center justify-between text-white rounded-xl shadow-2xl border border-gray-600/20 backdrop-blur-sm">
                <!-- Texto -->
                <div class="flex flex-col">
                    <h2 class="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Bienvenido Dev</h2>
                    <p class="text-sm text-gray-300 mt-1">Accede a tu panel de control</p>
                </div>
                <!-- Logo -->
                <div class="flex-shrink-0">
                    <img src="src/img/logo/logo.png" alt="Huubie Logo" class="w-20 h-16 object-contain drop-shadow-lg">
                </div>
            </div>

            <!-- Formulario -->
            <form id="formLogin" action="none" class="w-full md:w-4/5 mt-6 text-white bg-[#1F2937]/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-600/20">
                <!-- Campos de Usuario y Contraseña -->
                <div class="flex flex-col md:flex-row justify-between gap-4">
                    <!-- Usuario -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label for="user" class="text-sm font-medium text-gray-200 mb-2">Usuario</label>
                        <input type="text" id="user" name="user"
                            class="p-3 bg-[#374151]/80 backdrop-blur-sm rounded-lg outline-none text-white border border-gray-600/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 placeholder-gray-400" 
                            placeholder="Ingresa tu usuario" required>
                    </div>
                    <!-- Contraseña con Input Group -->
                    <div class="flex flex-col w-full md:w-1/2">
                        <label for="key" class="text-sm font-medium text-gray-200 mb-2">Contraseña</label>
                        <div class="relative">
                            <input type="password" id="key" name="key"
                                class="w-full p-3 pr-12 bg-[#374151]/80 backdrop-blur-sm rounded-lg outline-none text-white border border-gray-600/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 placeholder-gray-400" 
                                placeholder="Ingresa tu contraseña" required>
                            <!-- Icono del ojo -->
                            <button type="button" id="togglePassword"
                                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400">
                                <i class="icon-eye text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Recuerdame & ¿Olvidaste la contraseña? -->
                <div class="flex flex-col md:flex-row justify-between items-center mt-5 text-sm">
                    <label class="flex items-center gap-x-3 cursor-pointer group">
                        <input type="checkbox" id="rememberMe" name="rememberMe" 
                            class="w-4 h-4 bg-[#374151] border border-gray-600 rounded focus:ring-2 focus:ring-blue-400/50 text-blue-500 transition-all duration-200">
                        <span class="text-gray-300 group-hover:text-white transition-colors duration-200">Recuérdame</span>
                    </label>
                    <a href="#" class="text-blue-400 hover:text-blue-300 transition-colors duration-200 mt-4 md:mt-0 relative group">
                        ¿Olvidaste la contraseña?
                        <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                </div>

                <!-- Botón -->
                <button type="submit"
                    class="w-full mt-6 p-3 bg-gradient-to-r from-[#1C64F2] to-[#3B82F6] hover:from-[#1E40AF] hover:to-[#2563EB] rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-[0.98]">
                    <span class="flex items-center justify-center gap-2">
                        <i class="icon-login text-sm"></i>
                        Iniciar sesión
                    </span>
                </button>
            </form>
        </div>

        <!-- Sección empresa -->
        <div class="hidden md:flex w-1/2 items-center justify-center md:pl-8">
            <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                <div class="w-80 h-80 rounded-full overflow-hidden backdrop-blur-sm border border-gray-600/20 shadow-2xl relative">
                    <div class="absolute inset-0 bg-gradient-to-br from-[#333D4C]/20 to-[#3B4A5C]/20"></div>
                    <img src="src/img/logo/logos.png" alt="< / >" class="w-full h-full object-cover relative z-10">
                </div>
            </div>
        </div>
        
        <!-- Logo móvil -->
        <div class="md:hidden w-full flex justify-center mt-8">
            <img src="src/img/logo/huubie.svg" alt="Huubie Logo" class="w-32 object-contain opacity-60">
        </div>

    </div>

    <script src="access/src/js/access.js?t=<?= time() ?>"></script>
</body>

</html>