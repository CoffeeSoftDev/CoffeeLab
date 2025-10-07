<?php
session_start();

// Simular datos de sesión si no existen
if (empty($_SESSION['SUB'])) {
    $_SESSION['SUB'] = 1;
}
if (empty($_SESSION['DB'])) {
    $_SESSION['DB'] = 'rfwsmqex_kpi';
}

header("Content-Type: application/json");

try {
    require_once '../conf/_CRUD.php';
    require_once '../conf/_Utileria.php';
    
    $crud = new CRUD();
    
    // Probar conexión básica
    $test = $crud->_Read("SELECT 1 as test", []);
    
    echo json_encode([
        'status' => 200,
        'message' => 'Conexión exitosa',
        'database_test' => $test,
        'session' => [
            'SUB' => $_SESSION['SUB'] ?? 'No definido',
            'DB' => $_SESSION['DB'] ?? 'No definido'
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 500,
        'message' => 'Error de conexión: ' . $e->getMessage()
    ]);
}
?>