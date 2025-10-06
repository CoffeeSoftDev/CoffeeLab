<?php 
    if( empty($_COOKIE["IDU"]) )  require_once('../acceso/ctrl/ctrl-logout.php');

    require_once('layout/head.php');
    require_once('layout/script.php'); 
?>

<body>
    <?php require_once('../layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">

            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>contabilidad</li>
                    <li class='breadcrumb-item fw-bold active'>Sobres</li>
                </ol>
            </nav>
            <div class="row mb-3 d-flex justify-content-end">
                <!-- SALDOS -->
                <div id="saldoCaja" class="row m-0 p-0">
                    <div class="row row-cols-1 row-cols-sm-3 justify-content-end p-0 m-0 mt-2">
                        <div class="col-12 mb-1 d-block d-md-none">
                            <button class="btn btn-sm btn-outline-warning col-12" id="ckSaldos" title="Ver saldos">
                                <i class="icon-dollar"></i> Ver Saldos
                            </button>
                        </div>
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 d-none d-md-block saldos">
                            <label class="fw-bold text-uppercase mt-2 mb-2"><i>Fondo de caja</i></label>
                        </div>
                        <div class="col mb-2 d-none d-md-block saldos">
                            <div class="bd-callout bd-callout-info d-flex p-2 bd-highlight align-items-center m-0">
                                <label>Saldo inicial</label>
                                <label class="ms-auto fw-bold fs-5" id="txtSaldoInicial"></label>
                            </div>
                        </div>
                        <div class="col mb-2 d-none d-md-block saldos" id="bd_egresos">
                            <div class="bd-callout bd-callout-warning d-flex p-2 bd-highlight align-items-center m-0">
                                <label>Egresos</label>
                                <label class="ms-auto fw-bold fs-5" id="txtEgresos"></label>
                            </div>
                        </div>
                        <div class="col mb-2 d-none d-md-block saldos">
                            <div class="bd-callout bd-callout-info d-flex p-2 bd-highlight align-items-center m-0">
                                <label>Saldo final</label>
                                <label class="ms-auto fw-bold fs-5" id="txtSaldoFinal"></label>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- FILTROS DE CONSULTA -->
                <div class="col mt-1 mb-3 nota hide">
                    <div class="bd-callout bd-callout-danger d-flex p-3 bd-highlight align-items-center m-0">
                        <label class="fw-bold fs-5 text-danger" id="nota"><i class="icon-attention-1"></i> Nota</label>
                    </div>
                </div>
                <div class="row m-0 p-0 d-flex justify-content-end" id="filterBarSoft">

                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <label class="form-label fw-bold" for="cbUDN">Seleccionar UDN</label>
                        <select class="form-select" id="cbUDN"></select>
                    </div>
                    <!-- <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <label class="form-label fw-bold" for="cbDate">Fechas permitidas</label>
                        <select class="form-select" id="cbDate"></select>
                    </div> -->
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <label class="form-label fw-bold" for="cbDate">Fechas permitidas</label>
                        <input type="date" class="form-control" id="cbDate">
                    </div>
                </div>
            </div>

            <div class="row" id="bodySobres"></div>
            <script src='src/js/_Contabilidad.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Turnos.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Ingresos.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Softrestaurant.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Clientes.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Compras.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Pagos.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Proveedores.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Archivos.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/_Facturas.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/sobres.js?t=<?php echo time(); ?>'></script>
        </div>
    </main>
</body>

</html>