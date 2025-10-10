<?php
// Test simple del API
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// Configurar sesión
$_SESSION['DB'] = 'fayxzvov_coffee'; // ⚠️ CAMBIA ESTO

echo "<h1>Test API Pedidos</h1>";
echo "<hr>";

// Simular POST
$_POST['opc'] = 'apiVentas';
$_POST['mes'] = date('m');
$_POST['anio'] = date('Y');
$_POST['subsidiaries_id'] = 1; // ⚠️ CAMBIA ESTO

echo "<h2>Parámetros de entrada:</h2>";
echo "<pre>";
print_r($_POST);
echo "</pre>";

echo "<h2>Ejecutando ctrl-pedidos-simple.php...</h2>";

try {
    ob_start();
    include 'ctrl/ctrl-pedidos-simple.php';
    $output = ob_get_clean();
    
    echo "<h3>Respuesta JSON:</h3>";
    echo "<pre>";
    echo $output;
    echo "</pre>";
    
    echo "<h3>Respuesta Decodificada:</h3>";
    $decoded = json_decode($output, true);
    echo "<pre>";
    print_r($decoded);
    echo "</pre>";
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "<p style='color:red'>Error JSON: " . json_last_error_msg() . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color:red'>ERROR: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>
