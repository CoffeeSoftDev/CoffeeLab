<?php
session_start();
require_once '../conf/_conf.php';

// Verificar sesión activa
if (!isset($_SESSION['user_id'])) {
    header('Location: ../acceso/index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lanzador de Aplicaciones - ERP Grupo Varoch</title>
    
    <!-- TailwindCSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Simple Line Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.5.5/css/simple-line-icons.min.css">
    
    <!-- Custom Styles -->
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .module-card {
            transition: all 0.3s ease;
        }
        
        .module-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .module-card:active {
            transform: translateY(-4px);
        }
        
        .badge-nuevo {
            background: #10B981;
            color: white;
        }
        
        .badge-legacy {
            background: #6B7280;
            color: white;
        }
        
        .search-input:focus {
            outline: none;
            ring: 2px;
            ring-color: #667eea;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- CoffeeSoft Framework -->
    <script src="../src/js/coffeeSoft.js"></script>
    <script src="../src/js/plugins.js"></script>
    
    <!-- Launcher App -->
    <script src="js/launcher.js"></script>
</body>
</html>
