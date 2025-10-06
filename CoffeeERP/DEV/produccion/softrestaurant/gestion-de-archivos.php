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
        <li class='breadcrumb-item fw-bold active'>Gestión de archivos</li>
    </ol>
</nav>

<div class="row d-flex mb-3" id="content-gestion-archivos">

    <!-- <div class="col-12 col-sm-6 col-md-2 col-lg-2">
        <label for="">Selecciona una UDN</label>
        <select class="form-select" name="" id="txtUDN">
        </select>
    </div>

    <div class="col-12 col-sm-6 col-md-2 col-lg-2">
        <label for="">Seleccione el mes</label>
        <select class="form-select" id="txtMes">
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="">Junio</option>
            <option value="">Julio</option>
            <option value="">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
        </select>
    </div>

    <div class="col-12 col-md-2 col-lg-2 mb-3 mb-sm-0">
        <label class="col-12 d-block hide">&nbsp;</label>
        <button class="btn btn-primary col-12" id="btnBusqueda">
            Buscar
        </button>
    </div> -->

</div>

<div id="content-calendario">
</div>

    <style>
        .calendar {
            width: 100%;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            background-color: #fff;
        }

        .calendar-header {
            text-align: center;
            background-color: #003360;
            color: #fff;
            padding: 10px;
            display: flex;
            justify-content: center;
        }

        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }

        .calendar-grid-container {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }

        .day-header {
            text-align: center;
            background-color: #003360;
            color: #fff;
            padding: 10px;
            font-weight: bold;
            /* Agregamos negrita para hacer el texto visible */
        }

        .prev-month,
        .next-month {
            cursor: pointer;
        }

        .current-month {
            font-weight: bold;
            justify-content: center;
        }

        .fecha {
            border: 1px solid #ccc;
            height: 100px;
        }

        .table td {
          vertical-align: top;  
        }
    </style>



    <script src="src/js/gestion-de-archivos.js?t=<?php echo time(); ?>"></script>
    <script src="https://15-92.com/ERP3/src/js/complementos.js?t=<?php echo time(); ?>"></script>
        </div>
    </main>
</body>

</html>