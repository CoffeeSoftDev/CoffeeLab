<?php 
    if( empty($_COOKIE["IDU"]) )  require_once('../acceso/ctrl/ctrl-logout.php');

    require_once('layout/head.php');
    require_once('layout/script.php'); 
?>
<style>
table tbody td,
table thead th {
    min-width: 150px;
    /* Ancho mínimo para las celdas */
    max-width: 300px;
    /* Ancho máximo para las celdas */
    white-space: nowrap;
    /* Evitar salto de línea */
    overflow: hidden;
    /* Ocultar contenido que excede el ancho máximo */
    text-overflow: ellipsis;
    /* Mostrar puntos suspensivos para contenido que excede el ancho máximo */
    border: 1px solid #DDDDDD;
}
</style>

<body>
    <?php require_once('../layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">

            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>contabilidad</li>
                    <li class='breadcrumb-item fw-bold active'>Consultas</li>
                </ol>
            </nav>
            <div class="row mb-3">
                <div class="col-12 mb-3" id="saldos"></div>
                <div class="row p-0 col-12 mb-3 d-flex justify-content-end">
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 hide">
                        <label for="cbUDN">Seleccionar UDN</label>
                        <select class="form-select" id="cbUDN"></select>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <label for="cbDate">Fecha</label>
                        <div class="input-group">
                            <input type="text" class="form-control datepicker text-center" id="cbDate">
                            <span class="input-group-text"><i class="icon-calendar"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row" id="bodyConsulta"></div>

            <script src='src/js/_Contabilidad.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Ingresos.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Softrestaurant.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Clientes.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Compras.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Pagos.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Proveedores.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Archivos.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/consultas.js?t=<?php echo time(); ?>'></script>

        </div>
    </main>
</body>

</html>