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
<li class='breadcrumb-item text-uppercase text-muted'>costsys</li>
<li class='breadcrumb-item fw-bold active'>Costo potencial</li>
</ol>
</nav>



<div id="content-bar" class="row mb-3"></div>


<div class="row mb-3 d-flex d-none ">


    <div class="col-12 col-sm-6 col-md-4 col-lg-2 mb-3">
    <label class="fw-bold" for="cbUDN">Seleccionar UDN</label>
    <select onchange="lsClase()"  class="form-select" id="txtUDN"></select>
    </div>

    <div class="col-12 col-sm-6 col-md-4 col-lg-2 mb-3">
    <label class="fw-bold" for="cbUDN">Clasificación</label>
    <select class="form-select" id="txtClase"></select>
    </div>




    <div class="col-12 col-sm-6 col-md-4 col-lg-2 mb-3">
        <label class="fw-bold" >Año </label>
        
        <select class="form-control input-sm" id="txtAnio">
            <option value="2024">2024</option>   
            <option value="2024">2023</option>
        </select>

    </div>

    <div class="col-12 col-sm-6 col-md-4 col-lg-2 mb-3">
        <label class="fw-bold" >Mes </label>

        <select class="form-control input-sm" id="txtMes">
            <option value="1">Enero</option>   
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="3">Abril</option>
        </select>

    </div>

    <div class="col-12 col-md-4 col-lg-2 mb-3">
        <label col="col-12"> </label>
        <button type="button" class="btn btn-primary col-12" onclick="lsCostoPotencial()"> Buscar </button>
    </div>

</div>

<div style="margin-height:800px; " class="row" >
<div id="contentTab"></div>

</div>


<!-- externo -->
<script src='src/js/costo-potencial-kpi.js?t=<?php echo time(); ?>'></script>
<script src='src/js/costo-potencial.js?t=<?php echo time(); ?>'></script>
<script src='src/js/costo-potencial-tablero.js?t=<?php echo time(); ?>'></script>
<!-- <script src='https://plugins.erp-varoch.com/ERP/JS/CoffeSoft.js?t=<?php echo time(); ?>'></script> -->
        </div>
    </main>
</body>

</html>



