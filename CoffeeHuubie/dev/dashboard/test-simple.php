<?php
// Test ultra simple
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Test Simple del Backend</h1>";
echo "<hr>";

// Simular POST
$_POST['opc'] = 'apiVentas';
$_POST['mes'] = '01';
$_POST['anio'] = '2025';
$_POST['subsidiaries_id'] = 1;

echo "<h2>Parámetros:</h2>";
echo "<pre>";
print_r($_POST);
echo "</pre>";

echo "<h2>Intentando ejecutar ctrl-pedidos-simple.php...</h2>";

try {
    // Capturar la salida
    ob_start();
    include 'ctrl/ctrl-pedidos-simple.php';
    $output = ob_get_clean();
    
    echo "<h3>✅ Respuesta del servidor:</h3>";
    echo "<textarea style='width:100%; height:200px; font-family:monospace;'>";
    echo $output;
    echo "</textarea>";
    
    // Intentar decodificar JSON
    $json = json_decode($output, true);
    
    if ($json) {
        echo "<h3>✅ JSON Decodificado:</h3>";
        echo "<pre>";
        print_r($json);
        echo "</pre>";
        
        if (isset($json['cards'])) {
            echo "<p style='color:green; font-size:20px;'>✅ ¡El backend funciona correctamente!</p>";
            echo "<p>Total de pedidos: <strong>" . $json['cards']['total_pedidos'] . "</strong></p>";
            echo "<p>Dinero entrante: <strong>$" . number_format($json['cards']['dinero_entrante'], 2) . "</strong></p>";
        }
    } else {
        echo "<p style='color:red;'>❌ Error: La respuesta no es JSON válido</p>";
        echo "<p>Error JSON: " . json_last_error_msg() . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color:red;'>❌ ERROR: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

echo "<hr>";
echo "<h2>Siguiente paso:</h2>";
echo "<p>Si ves '✅ El backend funciona correctamente' arriba, entonces el problema está en el frontend.</p>";
echo "<p>Si ves errores, compártelos para ayudarte a resolverlos.</p>";
?>
