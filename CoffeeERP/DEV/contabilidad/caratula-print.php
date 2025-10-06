<?php 
    if( empty($_COOKIE["IDU"]) )  require_once('../acceso/ctrl/ctrl-logout.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../src/img/logos/logo_icon.png" type="image/x-icon">
    <title>Grupo Varoch</title>
    <!--FONTELLO-->
    <link rel="stylesheet" href="../src/plugin/fontello/css/fontello.css">
    <link rel="stylesheet" href="../src/plugin/fontello/css/animation.css">
    <!--BOOTSTRAP-->
    <link rel="stylesheet" href="../src/plugin/bootstrap-5/css/bootstrap.min.css">
    <!--SWEETALERT-->
    <link rel="stylesheet" href="../src/plugin/sweetalert2/sweetalert2.min.css">
    <!--DATERANGEPICKER-->
    <link rel="stylesheet" href="../src/plugin/daterangepicker/daterangepicker.css">
    <link rel="stylesheet" href="../src/css/table.css">
    <!--DATATABLES-->
    <link rel="stylesheet" href="../src/plugin/datatables/dataTables.responsive.min.css">
    <link rel="stylesheet" href="../src/plugin/datatables/1.13.6/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="../src/plugin/datatables/1.13.7/css/fixedColumns.bootstrap5.min.css">
    <link rel="stylesheet" href="../src/plugin/datatables/keyTable/keyTable.bootstrap5.min.css">

    <!-- JAVASCRIPT -->
    <!--JQUERY-->
    <script src="../src/plugin/jquery/jquery-3.7.0.min.js"></script>
    <!--BOOTSTRAP-->
    <script src="../src/plugin/bootstrap-5/js/bootstrap.bundle.js"></script>
    <!-- SWEETALERT -->
    <script src="../src/plugin/sweetalert2/sweetalert2.all.min.js"></script>
    <!--DATERANGEPICKER-->
    <script src="../src/plugin/daterangepicker/moment.min.js"></script>
    <script src="../src/plugin/daterangepicker/daterangepicker.js"></script>
    <!--DATATABLES-->
    <script src="../src/plugin/datatables/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="../src/plugin/datatables/dataTables.responsive.min.js"></script>
    <script src="../src/plugin/datatables/1.13.7/js/dataTables.bootstrap5.min.js"></script>
    <script src="../src/plugin/datatables/1.13.7/js/dataTables.fixedColumns.min.js"></script>
    <script src="../src/plugin/datatables/1.13.7/js/dataTables.fixedHeader.min.js"></script>
    <script src="../src/plugin/datatables/keyTable/dataTables.keyTable.min.js"></script>
    <!--PERSONALIZADOS-->
    <script src="../src/js/navbar.js"></script>
    <script src="../src/js/sidebar.js"></script>

    <script src="https://15-92.com/ERP3/src/js/CoffeSoft.js?t=<?php echo time(); ?>"></script>
    <script src="https://www.plugins.erp-varoch.com/ERP/JS/complementos.js"></script>
    <script src="https://www.plugins.erp-varoch.com/ERP/JS/plugin-forms.js"></script>
    <script src="https://www.plugins.erp-varoch.com/ERP/JS/plugin-table.js"></script>


    <style>
    .vertical-center {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .mt-200 {
        margin-top: 200px !important;
    }

    .mt-100 {
        margin-top: 100px !important;
    }

    .mt-50 {
        margin-top: 50px !important;
    }

    @page {
        margin-top: 20px;
        margin-bottom: 20px;
        margin-right: 20px;
        margin-left: 20px;
    }
    </style>
</head>

<body>
    <main>
        <div id="main__content">
            <div class="row mb-3 d-flex justify-content-end d-none">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                    <input type="text" class="form-control" id="cbUDN" placeholder="UDN">
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                    <input type="text" class="form-control" id="iptDate" placeholder="00/00/0000">
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-4"><img src="../src/img/logos/logo_row.png" width="150px" alt="Grupo Varoch"></img> </div>
                <div class="col-4 text-center fw-bold fs-5" id="strUDN"></div>
                <div class="col-4 text-end" id="strDate"></div>
            </div>
            <div class="row" id="tbDatos"></div>
        </div>
    </main>
    <script src='src/js/_Contabilidad.js?t=<?php echo time(); ?>'></script>
    <script src='src/js/_Caratula.js?t=<?php echo time(); ?>'></script>
    <script src='src/js/caratula-print.js?t=<?php echo time(); ?>'></script>
</body>

</html>