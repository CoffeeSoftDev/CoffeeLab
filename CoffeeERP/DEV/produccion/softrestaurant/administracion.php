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
        <li class='breadcrumb-item text-uppercase text-muted'>softrestaurant</li>
        <li class='breadcrumb-item fw-bold active'>Administracion</li>
    </ol>
</nav>

<div class="row mb-3 ">
    <div class="col-12 mb-2">
        <div class="col-2 bd-callout bd-callout-primary p-3">
         <strong>PRODUCTOS :</strong> <span id="txtTotals" >0</span>
        </div>
    </div>

    
    <div class="col-12 col-sm-6 col-lg-2 mb-3">
        <label for="cbUDN"><strong>Seleccionar UDN</strong></label>
        <select class="form-select" id="txtUDN" onchange="ver_grupo()"></select>
    </div>
    
    <div class="col-12 col-sm-6 col-lg-2 mt-4">
         <select class="form-select"   id="txtRpt">

            <option value="1"> Reporte detallado </option>
            <option value="2"> Por categoria     </option>
           
        </select>
 
   </div>

   <div class="col-12 col-sm-6 col-lg-2 mb-3">
        <label col="col-12"> </label>
        <button type="button" class="btn btn-outline-primary col-12" id="btnBuscar">Buscar</button>
    </div>



    <!-- <div class="col-12 col-sm-6 col-lg-2 mb-3">
          <label for="cbUDN"><strong>Escoge un grupo</strong></label>

        <select class="form-select"   id="txtGrupo">
            <option value="0" selected> - Seleccionar Categoría - </option>

            <option value="10"> FRANCES </option>
            <option value="8">BIZCOCHO</option>
            <option value="11">PASTELERIA</option>
           
        </select>
    
    </div>


    <div class="col-12 col-sm-6 col-lg-2 mb-3">
        <label col="col-12"> </label>
        <button type="button" class="btn btn-primary col-12" id="btnAdministracion">Buscar</button>
    </div> -->

    <div class="col-12 col-sm-6 col-lg-2 mb-3">
        <label class="col-12"> </label>
        <input type="file" class="hide" value="" id="btn">
        <label for="btn" class="btn btn-success col-12">Productos Soft XLSX</label>
    </div>



</div>

<div class="row" id="tbDatos"></div>

<style>
.grid-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
}

.grid-item-card3 {
    flex-basis: 100;
    color: white;
    margin: 1.25em 1.25em;
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 133px;
    box-shadow: 0.25em 0.25em 1em rgba(0, 0, 0, 0.25);
    border-radius: 0.5em;
    overflow: hidden;
    cursor: pointer;
}

.grid-item-card3 .info_title {
    height: 4em;
    max-height: 100%;
}

.grid-item-card3 .info_footer {
    height: 5.1em;
    max-height: 100%;
    color: #000;
    background-color: #F4F4F4;
}

.grid-item-card3:hover {
    z-index: 2;
    transform: scale(1.05);
    opacity: calc(100% - 10%);
    transition: all 0.2s ease;
    box-shadow: 0.25em 0.25em 1em rgba(0, 0, 0, 0.5);
}
</style>



<link rel="stylesheet" href="https://15-92.com/ERP3/src/css/style.css">


<script src='src/js/administracion.js?t=<?php echo time(); ?>'></script>
<script src="https://15-92.com/ERP3/src/js/complementos.js?t=<?php echo time(); ?>"></script>
<script src="https://15-92.com/ERP3/src/js/plugin-table.js?t=<?php echo time(); ?>"></script>
        </div>
    </main>
</body>

</html>