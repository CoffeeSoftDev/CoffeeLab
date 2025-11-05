<?php 
    if( empty($_COOKIE["IDU"]) )  require_once('../acceso/ctrl/ctrl-logout.php');

    require_once('layout/head.php');
    require_once('layout/script.php'); 
    
?>
 <script src="https://cdn.tailwindcss.com"></script>
<body>
    <?php require_once('../layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">

            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>costsys</li>

                    <li class='breadcrumb-item fw-bold active'>Costo potencial</li>
                </ol>
            </nav>


            <div id="filterBar" class=" line mb-2"></div>

            <div class=" " id="contentData"></div>

            <!-- EXTERNOS -->
            <script src="https://15-92.com/ERP3/src/js/CoffeSoft.js?t=<?php echo time(); ?>"></script>

            <script src='src/js/costo-potencial-cuadro-comparativo.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/costo-potencial-soft.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/costo-potencial.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/costo-potencial-desplazamiento.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/costo-potencial-tablero.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/app-soft-restaurant.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/menu-costsys.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/app-soft-restaurant-desplazamiento.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/app-soft.js?t=<?php echo time(); ?>'></script>



        </div>
    </main>
</body>

</html>