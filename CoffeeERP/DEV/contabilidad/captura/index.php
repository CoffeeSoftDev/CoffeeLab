<?php
    if (empty($_COOKIE["IDU"])) require_once('../acceso/ctrl/ctrl-logout.php');
    require_once('layout/head.php');
    require_once('layout/core-libraries.php');
?>

<!-- CoffeeSoft Framework -->
<script src="../../../../DEV/src/js/coffeeSoft.js"></script>
<script src="https://rawcdn.githack.com/SomxS/Grupo-Varoch/refs/heads/main/src/js/plugins.js"></script>
<script src="https://www.plugins.erp-varoch.com/ERP/JS/complementos.js"></script>

<body>
    <?php require_once('../../layout/navbar.php'); ?>

    <main>
        <section id="sidebar"></section>

        <div id="main__content">
            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>Contabilidad</li>
                    <li class='breadcrumb-item fw-bold active'>Captura</li>
                </ol>
            </nav>

          

            <div class=" main-container" id="root"></div>

          <!-- Módulos del Sistema -->
        <!-- <script src="js/ventas.js?t=<?php echo time(); ?>"></script> -->
        <script src="js/compras.js?t=<?php echo time(); ?>"></script> 
      <script src="js/archivos.js?t=<?php echo time(); ?>"></script>
        <script src="js/salidas-almacen.js?t=<?php echo time(); ?>"></script>

        
        


        </div>
    </main>
</body>
</html>
