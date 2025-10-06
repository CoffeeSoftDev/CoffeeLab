<?php 
    if( empty($_COOKIE["IDU"]) )  require_once('../../acceso/ctrl/ctrl-logout.php');

    require_once('layout/head.php');
    require_once('layout/script.php'); 
?>

 <style>
    table th:nth-child(4),
    table td:nth-child(4) {
      width: 150px; /* Ancho fijo para la cuarta columna */
      background: #f0f0f0; /* Color de fondo */
    }

    table th:nth-child(2),
    table td:nth-child(2) {
      width: 250px; /* Ancho fijo para la cuarta columna */
     background: #f2f2f2; /* Color de fondo */
    }
  </style>


<body>
    <?php require_once('../../layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">
            <nav aria-label='breadcrumb'>
    <ol class='breadcrumb'>
        <li class='breadcrumb-item text-uppercase text-muted'>produccion</li>
        <li class='breadcrumb-item text-uppercase text-muted'>control-fogaza</li>
        <li class='breadcrumb-item fw-bold active'>Control de merma</li>
    </ol>
</nav>

<div id="content-bar" class="row  d-flex mb-2">

    <div class="col-6 col-sm-3">
     
        <button id="btnCrearPedido" type="button" class="mt-3 btn btn-outline-primary col-12"
            onclick="Nuevo()">
            
            Nuevo</button>


        <button id="btnCerrarTicket" type="button" class="btn btn-outline-success col-12 d-none"
            onclick="TerminarFormato()">Terminar </button>

    </div>

  


    <div style="font-size:12px;" class="col-12 col-sm-9 text-end ">
        <label col="col-12" id="content-hora"></label> /
        <label col="col-12" id="content-nota"></label>
    </div>


</div>


<div class="" id="content-vista">
   <div class="mt-3" id="content"></div>



    <div id="content-data" class="col-12"></div>


</div>



<script src='src/js/control-de-merma.js?t=<?php echo time(); ?>'></script>
        </div>
    </main>
</body>

</html>
