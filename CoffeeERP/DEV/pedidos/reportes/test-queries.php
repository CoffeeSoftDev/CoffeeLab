<?php
// Archivo de pruebas unitarias para las consultas del modelo de reportes
require_once 'mdl/mdl-reportes.php';

// Configurar salida para mostrar en navegador
if (isset($_SERVER['HTTP_HOST'])) {
    header('Content-Type: text/plain; charset=utf-8');
    echo "<pre>";
}

try {
    $model = new mdl();
    
    echo "INICIANDO PRUEBAS UNITARIAS DEL MODELO DE REPORTES\n";
    echo "Base de datos: " . $model->bd . "\n";
    echo "Fecha de prueba: " . date('Y-m-d H:i:s') . "\n\n";
    
    // Ejecutar todas las pruebas
    $model->runAllTests();
    
    // Pruebas adicionales de estructura
    echo "\n=== PRUEBAS DE ESTRUCTURA ===\n";
    
    // Test de UDN
    echo "TEST: lsUDN\n";
    $udns = $model->lsUDN();
    echo "UDNs encontradas: " . count($udns) . "\n";
    if (!empty($udns)) {
        echo "Primera UDN: " . $udns[0]['valor'] . " (ID: " . $udns[0]['id'] . ")\n";
    }
    echo "\n";
    
    // Test de Canales
    echo "TEST: lsCanales\n";
    $canales = $model->lsCanales();
    echo "Canales encontrados: " . count($canales) . "\n";
    if (!empty($canales)) {
        echo "Primer canal: " . $canales[0]['valor'] . " (ID: " . $canales[0]['id'] . ")\n";
    }
    echo "\n";
    
    // Test de Años
    echo "TEST: lsAños\n";
    $años = $model->lsAños();
    echo "Años generados: " . count($años) . "\n";
    if (!empty($años)) {
        echo "Primer año: " . $años[0]['valor'] . "\n";
        echo "Último año: " . end($años)['valor'] . "\n";
    }
    echo "\n";
    
    echo "========================================\n";
    echo "TODAS LAS PRUEBAS COMPLETADAS\n";
    echo "========================================\n";
    
} catch (Exception $e) {
    echo "ERROR EN LAS PRUEBAS: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
}

if (isset($_SERVER['HTTP_HOST'])) {
    echo "</pre>";
}
?>