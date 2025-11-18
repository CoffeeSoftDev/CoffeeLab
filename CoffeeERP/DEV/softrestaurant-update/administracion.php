<?php 
    if(empty($_COOKIE["IDU"])) require_once('../../acceso/ctrl/ctrl-logout.php');
    require_once('layout/head.php');
?>
<body>
    <?php require_once('layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">
            <div id="root"></div>
        </div>
    </main>
    <?php require_once('layout/footer.php'); ?>
    <script src="js/administracion.js"></script>
</body>
</html>
