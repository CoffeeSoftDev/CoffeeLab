<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

echo "<h1>Test de Conexión y Tablas</h1>";
echo "<hr>";

// Configuración
$_SESSION['DB'] = 'fayxzvov_coffee'; // ⚠️ CAMBIA ESTO
$subsidiaries_id = 1; // ⚠️ CAMBIA ESTO

echo "<h2>1. Verificar archivos necesarios</h2>";

$archivos = [
    '../../conf/_CRUD.php',
    '../../conf/_Utileria.php',
    'mdl/mdl-pedidos.php',
    'ctrl/ctrl-pedidos-simple.php'
];

foreach ($archivos as $archivo) {
    if (file_exists($archivo)) {
        echo "✅ $archivo existe<br>";
    } else {
        echo "❌ $archivo NO existe<br>";
    }
}

echo "<h2>2. Intentar cargar el modelo</h2>";

try {
    require_once '../../conf/_CRUD.php';
    echo "✅ _CRUD.php cargado<br>";
    
    require_once '../../conf/_Utileria.php';
    echo "✅ _Utileria.php cargado<br>";
    
    require_once 'mdl/mdl-pedidos.php';
    echo "✅ mdl-pedidos.php cargado<br>";
    
    $mdl = new mdl();
    echo "✅ Modelo instanciado<br>";
    
} catch (Exception $e) {
    echo "<p style='color:red'>❌ Error: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    exit;
}

echo "<h2>3. Verificar tablas en la base de datos</h2>";

try {
    // Obtener conexión (asumiendo que CRUD tiene una propiedad de conexión)
    $query = "SHOW TABLES LIKE 'order'";
    $result = $mdl->_Read($query, []);
    
    if (!empty($result)) {
        echo "✅ Tabla 'order' existe<br>";
    } else {
        echo "❌ Tabla 'order' NO existe<br>";
    }
    
} catch (Exception $e) {
    echo "<p style='color:red'>❌ Error verificando tabla: " . $e->getMessage() . "</p>";
}

try {
    $query = "SHOW TABLES LIKE 'order_payments'";
    $result = $mdl->_Read($query, []);
    
    if (!empty($result)) {
        echo "✅ Tabla 'order_payments' existe<br>";
    } else {
        echo "❌ Tabla 'order_payments' NO existe<br>";
    }
    
} catch (Exception $e) {
    echo "<p style='color:red'>❌ Error verificando tabla: " . $e->getMessage() . "</p>";
}

echo "<h2>4. Probar consulta simple</h2>";

try {
    $mes = date('m');
    $anio = date('Y');
    $fi = sprintf("%04d-%02d-01", $anio, $mes);
    $ultimoDia = date("t");
    $ff = sprintf("%04d-%02d-%02d", $anio, $mes, $ultimoDia);
    
    echo "<p>Período: $fi a $ff</p>";
    echo "<p>Sucursal ID: $subsidiaries_id</p>";
    
    $total = $mdl->getTotalPedidosMes([
        $subsidiaries_id,
        $fi,
        $ff
    ]);
    
    echo "<h3>Resultado:</h3>";
    echo "<pre>";
    print_r($total);
    echo "</pre>";
    
    if ($total['total_pedidos'] > 0) {
        echo "<p style='color:green'>✅ ¡Hay {$total['total_pedidos']} pedidos en este período!</p>";
    } else {
        echo "<p style='color:orange'>⚠️ No hay pedidos en este período (esto es normal si no hay datos)</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color:red'>❌ Error en consulta: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

echo "<hr>";
echo "<p><strong>Si ves errores arriba, compártelos para ayudarte mejor.</strong></p>";
?>
