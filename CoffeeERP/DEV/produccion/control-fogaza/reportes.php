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
        <li class='breadcrumb-item fw-bold active'>Reportes</li>
    </ol>
</nav>


<div class="row mb-3 d-flex ">

    <div class="col-12 col-md-3 col-lg-2 mb-2">
        <label col="col-12"> </label>

        <button id="btnCrearPedido" type="button" class="btn btn-outline-primary col-12"
            onclick="CrearFormatoPedido()">Crear Pedido</button>

        <button id="btnCerrarTicket" type="button" class="btn btn-success col-12 d-none"
            onclick="TerminarFormato()">Terminar </button>

    </div>


    <div class="col-12 col-lg-2 mt-4">

        <a class="btn btn-outline-secondary w-100 " onclick="lsProducts()">
            Productos
        </a>

    </div>


    <div class="col-12 col-md-3 col-lg-2 mb-2 ">
        <button type="button"   id="CancelarBtn" class="btn btn-outline-danger col-12 mt-4 d-none" onclick="CancelarFolio()"> Cancelar </button>
    </div>


    <div class="col-12 col-md-3 col-lg-2 mb-2 ">
                <button type="button" 
                id="btnImprimir"
                class="btn btn-outline-primary col-12 mt-4 d-none" 
                onclick="modal_envio_whatsapp()"> Imprimir
                </button>

    </div>

    <div class="col-12 col-md-3 col-lg-2 mb-2 " >
        <a class="btn btn-outline-secondary mt-4" 
        onclick="verFormato()" > <i class=" icon-arrows-cw"></i></a>
    </div>
<!-- print_ctrl_linea_produccion -->
    <!-- 
    <div class="col-12 col-md-3 col-lg-2 mb-3">
     
        <label  col="col-12"> </label>
        <select class="form-control " id="txtClasificacion">
            <option value="8">BIZCOCHO</option>
            <option value="10">FRANCES</option>
            <option value="11">PASTELERIA</option>

        </select>

    </div> -->

    <div class="col-12 col-md-3 col-lg-4 mb-2 text-end ">
        <label col="col-12" id="content-hora"></label>
        <label col="col-12" id="content-nota"></label>
    </div>

    <div class="col-12 col-md-3 col-lg-2 mb-2 d-none">
        <label col="col-12"> </label>

        <button type="button" class="btn btn-primary col-12" onclick="verFormato()"> Ver formato
        </button>

    </div>
</div>

<div class="row" id="content-visor">

   

</div>


<script src='src/js/reportes.js?t=<?php echo time(); ?>'></script>
<!-- externo -->
<script src="https://15-92.com/ERP3/src/js/plugin-forms.js?t=<?php echo time(); ?>"></script>

        </div>
    </main>
</body>

</html>