<?php
session_start();
require_once '../../conf/_conf.php';

if (!isset($_SESSION['usuario'])) {
    header('Location: ../../');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagos a Proveedor - CoffeeSoft</title>
    <?php require_once '../../src/layout/head.php'; ?>
</head>
<body>
    <?php require_once '../../src/layout/navbar.php'; ?>
    
    <div id="root" class="container-fluid p-4"></div>

    <?php require_once '../../src/layout/footer.php'; ?>
    <script src="../../src/js/coffeSoft.js"></script>
    <script src="../../src/js/plugins.js"></script>
    <script src="js/pago-proveedor.js"></script>
</body>
</html>
