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
            
<style>
    
td div {
  width     : 100%;
  border    : none;
  background: transparent;
  text-align: right;
  margin    : 0 !important;
  outline   : 0 !important;
  box-sizing: border-box;
  padding   : 0px 5px 0px 0px;
  box-shadow: none !important;
}
</style>

<nav aria-label='breadcrumb'>
    <ol class='breadcrumb'>
        <li class='breadcrumb-item text-uppercase text-muted'>produccion</li>
        <li class='breadcrumb-item text-uppercase text-muted'>control-fogaza</li>
        <li class='breadcrumb-item fw-bold active'>Administracion</li>
    </ol>
</nav>



<div class="row mb-3 " id="frm-panel">
  
    <div class="col-12 col-sm-3 col-lg-3 mb-3">
        <label class="fw-bold" for="iptDate">Fecha</label>
        <div class="input-group">
            <input type="text" name="date" class="form-control" id="iptDate" required>
            <span class="input-group-text"><i class="icon-calendar"></i></span>
        </div>
    </div>

    <div class="col-12 col-sm-3 col-lg-2 mb-3">
        <label class="fw-bold" for="iptTurno">Categoria</label>

        <select class="form-select" name="Categoria" id="txtCategoria" required>
        </select>
    </div>
    
    
     <div class="col-12 col-sm-3 col-lg-3 mb-3">
        <label class="fw-bold" for="iptTurno">Tipo reporte</label>

        <select class="form-select" name="Reporte" id="txtReporte" required>
            <option value="1">Por sugerencia del gerente</option>
            <option value="2">Por producción de panadero</option>        
        </select>
    </div>


    <div class="col-12 col-sm-3 col-lg-2 mb-3">
        <label col="col-12"> </label>
        <button type="button" class="btn btn-primary col-12" id="btnOk"> Buscar </button>
    </div>

</div>


<div class="row" id="tbDatos"></div>
<!-- externo -->
<script src="https://15-92.com/ERP3/src/js/complementos.js?t=<?= time() ?>"></script>
<script src="https://15-92.com/ERP3/src/js/plugin-table.js?t=<?= time() ?>"></script>

<script src='src/js/administracion.js?t=<?php echo time(); ?>'></script>
        </div>
    </main>
</body>

</html>