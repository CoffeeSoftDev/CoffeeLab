<?php
    require_once('layout/head.php');
    require_once('layout/core-libraries.php');
?>

<!-- CoffeeSoft Framework -->
<script src="../../../../DEV/src/js/coffeeSoft.js"></script>
<script src="https://rawcdn.githack.com/SomxS/Grupo-Varoch/refs/heads/main/src/js/plugins.js"></script>
<script src="https://www.plugins.erp-varoch.com/ERP/JS/complementos.js"></script>


<body>
    <?php require_once('../../../layout/navbar.php'); ?>

    <main>
        <section id="sidebar"></section>

        <div id="main__content">
            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>KPI</li>
                    <li class='breadcrumb-item fw-bold active'>Ventas</li>
                </ol>
            </nav>

            <div class="main-container" id="root"></div>

            <!-- Module Scripts -->
            <script src="src/js/kpi-ventas.js?t=<?php echo time(); ?>"></script>
            <script src="src/js/dashboard.js?t=<?php echo time(); ?>"></script>
        
        </div>
    </main>
</body>
</html>
