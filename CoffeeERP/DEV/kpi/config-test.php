<?php
// Configuración de prueba para el módulo KPI
session_start();

// Configurar variables de sesión necesarias
$_SESSION['SUB'] = 1; // ID de subsidiaria
$_SESSION['DB'] = 'rfwsmqex_kpi'; // Base de datos
$_SESSION['IDU'] = 1; // ID de usuario

// Configurar zona horaria
date_default_timezone_set('America/Mexico_City');

// Mostrar errores para debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo json_encode([
    'status' => 200,
    'message' => 'Configuración de prueba aplicada',
    'session' => [
        'SUB' => $_SESSION['SUB'],
        'DB' => $_SESSION['DB'],
        'IDU' => $_SESSION['IDU']
    ]
]);
?>