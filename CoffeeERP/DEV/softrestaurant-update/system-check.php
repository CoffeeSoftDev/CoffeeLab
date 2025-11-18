<?php
/**
 * System Check - SoftRestaurant
 * Verifica que todos los componentes estén correctamente instalados
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Check - SoftRestaurant</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .check-ok { color: #10b981; }
        .check-warning { color: #f59e0b; }
        .check-error { color: #ef4444; }
    </style>
</head>
<body class="bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">🔍 System Check - SoftRestaurant</h1>
        
        <?php
        $checks = [];
        
        // 1. Verificar versión de PHP
        $phpVersion = phpversion();
        $checks[] = [
            'name' => 'Versión de PHP',
            'status' => version_compare($phpVersion, '7.4.0', '>=') ? 'ok' : 'error',
            'message' => "PHP $phpVersion " . (version_compare($phpVersion, '7.4.0', '>=') ? '✓' : '✗ (Se requiere 7.4+)'),
            'required' => true
        ];
        
        // 2. Verificar extensiones PHP
        $extensions = ['mysqli', 'json', 'mbstring', 'session'];
        foreach ($extensions as $ext) {
            $checks[] = [
                'name' => "Extensión PHP: $ext",
                'status' => extension_loaded($ext) ? 'ok' : 'error',
                'message' => extension_loaded($ext) ? 'Instalada ✓' : 'No instalada ✗',
                'required' => true
            ];
        }
        
        // 3. Verificar archivos críticos
        $criticalFiles = [
            'src/js/coffeSoft.js' => 'CoffeeSoft Framework',
            'src/js/plugins.js' => 'Plugins jQuery',
            'layout/head.php' => 'Layout Head',
            'layout/footer.php' => 'Layout Footer',
            'layout/navbar.php' => 'Navbar',
            'ctrl/ctrl-administracion.php' => 'Controlador Administración',
            'mdl/mdl-administracion.php' => 'Modelo Administración',
            'js/administracion.js' => 'Frontend Administración'
        ];
        
        foreach ($criticalFiles as $file => $name) {
            $exists = file_exists($file);
            $checks[] = [
                'name' => $name,
                'status' => $exists ? 'ok' : 'error',
                'message' => $exists ? "Encontrado: $file ✓" : "No encontrado: $file ✗",
                'required' => true
            ];
        }
        
        // 4. Verificar componentes personalizados
        $components = [
            'src/components/product-card.js' => 'ProductCard',
            'src/components/excel-uploader.js' => 'ExcelUploader',
            'src/components/category-selector.js' => 'CategorySelector'
        ];
        
        foreach ($components as $file => $name) {
            $exists = file_exists($file);
            $checks[] = [
                'name' => "Componente: $name",
                'status' => $exists ? 'ok' : 'warning',
                'message' => $exists ? "Encontrado ✓" : "No encontrado (opcional)",
                'required' => false
            ];
        }
        
        // 5. Verificar permisos de escritura
        $writableDirs = ['logs', 'uploads', 'temp'];
        foreach ($writableDirs as $dir) {
            if (!is_dir($dir)) {
                @mkdir($dir, 0755, true);
            }
            $writable = is_writable($dir);
            $checks[] = [
                'name' => "Permisos de escritura: $dir/",
                'status' => $writable ? 'ok' : 'warning',
                'message' => $writable ? 'Escribible ✓' : 'No escribible (crear manualmente)',
                'required' => false
            ];
        }
        
        // 6. Verificar configuración
        $configExists = file_exists('conf/database.php');
        $checks[] = [
            'name' => 'Configuración de Base de Datos',
            'status' => $configExists ? 'ok' : 'warning',
            'message' => $configExists ? 'Configurada ✓' : 'Usar database.example.php como plantilla',
            'required' => true
        ];
        
        // Contar resultados
        $totalChecks = count($checks);
        $okChecks = count(array_filter($checks, fn($c) => $c['status'] === 'ok'));
        $errorChecks = count(array_filter($checks, fn($c) => $c['status'] === 'error'));
        $warningChecks = count(array_filter($checks, fn($c) => $c['status'] === 'warning'));
        
        // Mostrar resumen
        echo "<div class='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>";
        echo "<h2 class='text-xl font-semibold text-blue-800 mb-2'>📊 Resumen</h2>";
        echo "<div class='grid grid-cols-4 gap-4'>";
        echo "<div class='text-center'><div class='text-3xl font-bold text-gray-800'>$totalChecks</div><div class='text-sm text-gray-600'>Total</div></div>";
        echo "<div class='text-center'><div class='text-3xl font-bold check-ok'>$okChecks</div><div class='text-sm text-gray-600'>OK</div></div>";
        echo "<div class='text-center'><div class='text-3xl font-bold check-warning'>$warningChecks</div><div class='text-sm text-gray-600'>Advertencias</div></div>";
        echo "<div class='text-center'><div class='text-3xl font-bold check-error'>$errorChecks</div><div class='text-sm text-gray-600'>Errores</div></div>";
        echo "</div></div>";
        
        // Mostrar estado general
        if ($errorChecks === 0) {
            echo "<div class='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>";
            echo "<p class='text-green-800 font-semibold'>✅ Sistema listo para usar</p>";
            echo "</div>";
        } else {
            echo "<div class='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>";
            echo "<p class='text-red-800 font-semibold'>❌ Se encontraron $errorChecks errores críticos</p>";
            echo "</div>";
        }
        
        // Mostrar detalles
        echo "<h2 class='text-xl font-semibold text-gray-800 mb-4'>📋 Detalles</h2>";
        echo "<div class='space-y-2'>";
        
        foreach ($checks as $check) {
            $statusClass = "check-{$check['status']}";
            $icon = $check['status'] === 'ok' ? '✓' : ($check['status'] === 'warning' ? '⚠' : '✗');
            $required = $check['required'] ? '<span class="text-xs text-gray-500">(requerido)</span>' : '<span class="text-xs text-gray-400">(opcional)</span>';
            
            echo "<div class='flex items-center justify-between p-3 bg-gray-50 rounded-md'>";
            echo "<div class='flex items-center'>";
            echo "<span class='$statusClass text-2xl mr-3'>$icon</span>";
            echo "<div>";
            echo "<div class='font-semibold text-gray-800'>{$check['name']} $required</div>";
            echo "<div class='text-sm text-gray-600'>{$check['message']}</div>";
            echo "</div></div></div>";
        }
        
        echo "</div>";
        ?>
        
        <div class="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-800 mb-2">📚 Próximos Pasos</h3>
            <ol class="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Corregir todos los errores críticos (✗)</li>
                <li>Configurar la base de datos en <code>conf/database.php</code></li>
                <li>Verificar permisos de carpetas</li>
                <li>Probar la conexión a la base de datos</li>
                <li>Acceder a <a href="index.php" class="text-blue-600 underline">index.php</a> para comenzar</li>
            </ol>
        </div>
        
        <div class="mt-6 text-center">
            <a href="index.php" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Ir al Sistema →
            </a>
        </div>
    </div>
</body>
</html>
