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
        <li class='breadcrumb-item text-uppercase text-muted'>producción</li>
        <li class='breadcrumb-item text-uppercase text-muted'>costsys</li>
        <li class='breadcrumb-item fw-bold active'>Catálogo</li>
    </ol>
</nav>
<link rel="stylesheet" href="src/css/catalogo.css?t=<?php echo time(); ?>">
<script src='src/js/ls-catalago.js?t=<?php echo time(); ?>'></script>
<script src='src/js/catalogo.js?t=<?php echo time(); ?>'></script>
<div id="containerCatalogo">
    <h4 class="p-0 ms-2 m-0">COSTSYS</h4>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-5 p-0 m-0">
        <div class="col mb-3">
            <label for="txtcbUDN">Seleccionar UDN</label>
            <select class="form-select" id="txtcbUDN"></select>
        </div>
        <div class="col mb-1 clasificacion-select">
            <label for="txtcbClasificacion">Clasificación</label>
            <select class="form-select" id="txtcbClasificacion"></select>
        </div>
        <div class="col col-sm-12 mb-1 ms-auto" id="containerButtonAdd">
        </div>
    </div>
</div>
<div class="row mt-2 p-0">
    <ul class="nav nav-tabs m-0 shadow-border" id="tabCatalogo" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="ingredientes-tab" data-bs-toggle="tab" data-bs-target="#ingredientes"
                type="button" role="tab" aria-controls="ingredientes" aria-selected="true">Ingredientes
            </button>
        </li>
        <li class="nav-item active" role="presentation">
            <button class="nav-link active" id="subrecetas-tab" data-bs-toggle="tab" data-bs-target="#subrecetas"
                type="button" role="tab" aria-controls="subrecetas" aria-selected="true">Subrecetas
            </button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="recetas-tab" data-bs-toggle="tab" data-bs-target="#recetas" type="button"
                role="tab" aria-controls="recetas" aria-selected="true">Recetas
            </button>
        </li>
    </ul>
    <div class="tab-content p-3" id="tabContentCatalago">
        <div class="tab-pane fade" id="ingredientes" role="tabpanel" aria-labelledby="ingredientes-tab">
            <?php require_once ('ingredientes.php'); ?>
        </div>
        <div class="tab-pane show active" id="subrecetas" role="tabpanel" aria-labelledby="subrecetas-tab">
            <?php require_once ('subrecetas.php'); ?>
        </div>
        <div class="tab-pane fade" id="recetas" role="tabpanel" aria-labelledby="recetas-tab">
            <?php require_once ('recetas.php'); ?>
        </div>
    </div>
</div>
        </div>
    </main>
</body>

</html>