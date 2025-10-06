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
      <li class='breadcrumb-item fw-bold active'>Productos vendidos</li>
   </ol>
</nav>

<style>
.bg-default-coffe {
   color: #828282;
   background: #EBEBEB;

}
</style>

<script src='src/js/productos-vendidos.js?t=<?= time() ?>'></script>

<!-- externo -->
<script src="https://15-92.com/ERP3/src/js/complementos.js?t=<?= time() ?>"></script>


<div class="row mb-3 " id="content-bar">

    <div class="col-12  col-lg-2 col-md-4 ">
    <!-- <label for="txtcbUDN">Seleccionar UDN</label>     -->
    <select onchange="add_componente()" class="form-select" name="UDN" id="txtUDN"></select>
    </div>


    <div id="" class="col-6 col-lg-2">

        <div id="content-consultar">
        <select class="form-control full input-sm" name="Soft" id="txtSoft" onchange="">
        <option value="1">Soft Restaurant</option>
        <option value="2">Costsys</option>
        </select>
        </div>


        <div id="content-cat-fogaza"></div>

    </div>



    <div class="col-6 col-lg-1 col-md-4">
    <!-- <label for="txtcbUDN">Año</label>  -->
    <select class="form-control full input-sm" id="txtAnio" name="Anio" onchange="">  
    <option value="2024" selected="">2024</option>
    <option value="2023" >2023</option>
    <option value="2022">2022</option>
    <option value="2021">2021</option>


    </select>
    </div>

   
 

   <div class="col-12 col-lg-1 col-md-4">

      <select class="form-control full input-sm" name="Mes" id="txtMes" onchange="">
         <option value="1">Enero</option>
         <option value="2">Febrero</option>
         <option value="3">Marzo</option>
         <option value="4">Abril</option>
         <option value="5">Mayo</option>
         <option value="6">Junio</option>
         <option value="7">Julio</option>
         <option value="8">Agosto</option>
         <option value="9">Septiembre</option>
         <option value="10">Octubre</option>
         <option value="11" selected="">Noviembre</option>
         <option value="12">Diciembre</option>
      </select>

   </div>



   <div class="col-lg-2">


      <select class="form-control full input-sm" id="txtReporte" name="Reporte" onchange="">
         <option value="1">Resumen</option>
         <option value="2">Detallado</option>
      </select>
   </div>


   <div class="col-12 col-sm-6 col-lg-2 mb-2 hide">
      <label for="iptDate">Fecha</label>
      <div class="input-group">
         <input type="text" class="form-control" id="iptDate">
         <span class="input-group-text"><i class="icon-calendar"></i></span>
      </div>
   </div>

   <div class="col-12 col-sm-3">
   <input type="text" class="form-control input-sm" id="iptDate"/>
   </div>


   <div class="col-12 col-sm-6 col-lg-2 mb-2">
      <button type="button" class="btn btn-primary col-12" onclick="buscar()">Buscar</button>
   </div>




   <div class="col-12 col-sm-6 col-lg-2 mb-2">
      <button type="button" class="btn btn-outline-primary col-12" onclick="SubirDesplazamiento()">
         <i class=" icon-upload"></i>CP</button>
   </div>

   <!-- Form -->




</div>



<!-- height:800px; -->


<div style="" class="row" id="tbDatos">
   <div id="content-plus"></div>
  <div id="content-categoria"></div>
   <div id="content-desplazamiento"></div>
</div>






<style>
.grid-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.grid-item {
  flex-basis: 100;
  color: white;
  margin: 10px 10px;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 168px;
  border-radius: 10px;
  background-color: #003360;
}

.grid-item .div1 {
  height: 7.5em;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.grid-item .div2 {
  height: 3.8em;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

.grid-item .div3 {
  height: 2em;
  width: 2em;
  position: relative;
  top: -11.3em;
  border-top-right-radius: 8px;
}

.grid-item img {
  max-height: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.grid-item:hover {
  z-index: 1;
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.disabled-item {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.5;
  filter: grayscale(100%);
}

</style>