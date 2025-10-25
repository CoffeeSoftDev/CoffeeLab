<?php
    if (empty($_COOKIE["IDU"])) require_once('../acceso/ctrl/ctrl-logout.php');
    require_once('layout/head.php');
    require_once('layout/core-libraries.php');
?>

<!-- CoffeeSoft Framework -->
<script src="https://erp-varoch.com/ERP24/gestor-de-actividades/src/js/CoffeeSoft.js"></script>
<script src="https://rawcdn.githack.com/SomxS/Grupo-Varoch/refs/heads/main/src/js/plugins.js"></script>
<script src="https://www.plugins.erp-varoch.com/ERP/JS/complementos.js"></script>

<body>
    <?php require_once('../../layout/navbar.php'); ?>

    <main>
        <section id="sidebar"></section>

        <div id="main__content">
            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>KPI</li>
                    <li class='breadcrumb-item fw-bold active'>Ventas</li>
                </ol>
            </nav>

          

            <div class=" main-container" id="root"></div>

          <!-- Módulos del Sistema -->
        <script src="js/admin.js?t=<?php echo time(); ?>"></script>
        <script src="js/cuenta-venta.js?t=<?php echo time(); ?>"></script>
        <script src="js/proveedores.js?t=<?php echo time(); ?>"></script>
        <script src="js/cliente.js?t=<?php echo time(); ?>"></script>
        <script src="js/efectivo.js?t=<?php echo time(); ?>"></script>



        </div>
    </main>
</body>
</html>

