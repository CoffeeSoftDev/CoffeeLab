<?php
    if( empty($_COOKIE["IDU"]) )  require_once('../../acceso/ctrl/ctrl-logout.php');

    require_once('layout/head.php');
    require_once('layout/script.php');
?>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

<body>

<style>

.modal-title{
    font-weight: 700;
}

.container-main{
    min-height: calc(100vh - calc(4rem + 2px) - calc(4rem + 1px));
}

.container-main2{
    min-height: calc(100vh - calc(6rem + 1px) - calc(6rem + 1px));
}

#containerTicketPedidos{
     font-family: Arial, sans-serif;
    font-size: 15px;
    line-height: 1.42857143;
    color: #2c3e50;
}

#content_photo:hover span {
  display: flex;
}

</style>
    <?php require_once('../../layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content" >



            <!-- <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>produccion</li>
                    <li class='breadcrumb-item text-uppercase text-muted'>control-fogaza</li>
                    <li class='breadcrumb-item fw-bold active'>Pedidos</li>
                </ol>
            </nav> -->


            <div class="container-main" id="root"></div>
            <script src='src/js/pedidos.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/pedidos-list.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/pedidos-productos.js?t=<?php echo time(); ?>'></script>


               <!-- externo -->
        </div>
    </main>
</body>

</html>
