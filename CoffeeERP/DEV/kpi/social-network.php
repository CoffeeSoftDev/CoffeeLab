<?php
session_start();
require_once '../conf/_Sesion.php';
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <?php require_once 'layout/head.php'; ?>
    <title>KPI - Redes Sociales</title>
</head>

<body>
    <?php require_once '../layout/menu.php'; ?>

    <div id="root"></div>

    <?php require_once 'layout/script.php'; ?>
    <script src="src/js/social-network.js"></script>
</body>

</html>
