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
        <li class='breadcrumb-item fw-bold active'>Dias de produccion</li>
    </ol>
</nav>

<div class="row mb-3" id="content-filter"></div>

<div class="row" id="content-data"></div>


<!-- externo -->
<script src="https://15-92.com/ERP3/src/js/plugin-forms.js?t=<?php echo time(); ?>"></script>
<script src='src/js/dias-de-produccion.js?t=<?php echo time(); ?>'></script>
        </div>
    </main>
</body>

</html>