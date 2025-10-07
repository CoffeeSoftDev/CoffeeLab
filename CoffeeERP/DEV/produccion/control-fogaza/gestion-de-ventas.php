<?php 
    if( empty($_COOKIE["IDU"]) )  require_once('../../acceso/ctrl/ctrl-logout.php');

    require_once('layout/head.php');
    require_once('layout/script.php'); 
?>
<body>
    <?php require_once('../../layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">
            <nav aria-label='breadcrumb'>
    <ol class='breadcrumb'>
        <li class='breadcrumb-item text-uppercase text-muted'>produccion</li>
        <li class='breadcrumb-item text-uppercase text-muted'>control-fogaza</li>
        <li class='breadcrumb-item fw-bold active'>Gestion de ventas</li>
    </ol>
</nav>

<div class="mb-3 content" id="content-data"></div>


<div class="row d-none">

    <div class="col-lg-6 col-12 mt-3" id="lsTabla">
        <div class="row">



        </div>

        <div class="mt-4 table-responsive" id="scontent-folios"> </div>



    </div><!-- lsTabla  -->


    <div class="col-lg-6 col-12  mt-3" id="contents-visor"></div> <!-- Layout visor  -->

</div>

<script src='src/js/gestion-de-ventas.js?t=<?php echo time(); ?>'></script>
<script src='src/js/destajo-formato.js?t=<?php echo time(); ?>'></script>
<script src='src/js/gestion-de-ventas-destajo.js?t=<?php echo time(); ?>'></script>
<!-- externo -->
        </div>
    </main>
</body>

</html>
