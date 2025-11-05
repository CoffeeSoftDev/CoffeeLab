<!DOCTYPE html>
<html lang="es" dir="ltr">

<head>
    <meta charset="utf-8">
    <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title>GRUPO VAROCH</title>
    <link rel="shortcut icon" href="../src/img/logos/logo_icon.png" type="image/x-icon">

    <!-- FONTELLO -->
    <link rel="stylesheet" href="../src/plugin/fontello/css/fontello.css">
    <link rel="stylesheet" href="../src/plugin/fontello/css/animation.css">
    <!-- BOOTSTRAP 5 -->
    <link rel="stylesheet" href="../src/plugin/bootstrap-5/css/bootstrap.min.css">
</head>
<style>
    #container_photo_receta {
        width: 150px;
        height: 150px;
        position: relative;
        /* right: -82px; */
        margin: 0 auto;
        border-radius: 50%;
        cursor: pointer;
    }

    #container_photo_receta img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    @page {
        margin-top: 15px;
        margin-bottom: 15px;
        margin-right: 15px;
        margin-left: 10px;
    }
/* 
    textarea {
            overflow: hidden;
            resize: none;
            width: 100% !important;
        } */
</style>

<body>
    <div class="container-fluid">
        <div class="row p-0">
            <div class="col-3 p-0">
                <div class="p-0" id="container_photo_receta">
                    <img src="https://erp-varoch.com/erp_files/default.png" id="fotoReceta" alt="Foto Receta">
                </div>
            </div>
            <div class="col-9 d-flex align-items-center">
                <div>
                    <h2 id="title">Example page header</h2>
                    <small id="subtitle">UDN / Categoría / Subcategoría</small>
                </div>
            </div>
        </div>

        <div class="row mt-1 mb-2">
            <div class="col-12" style="font-size:0.8em;">
                <h5 class="text-center mb-2">Procedimiento culinario</h5>
                <div class="row">
                    <div class="col-4 mb-2">
                        <label for="iptTotal">Total Ingredientes</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="icon-dollar"></i></span>
                            <input type="text" class="form-control text-end" id="iptTotal" placeholder="$ 0.00"
                                readonly>
                        </div>
                    </div>
                    <div class="col-4 mb-2">
                        <label for="iptRendimiento">Rendimiento</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="icon-hash"></i></span>
                            <input type="text" class="form-control text-end" id="iptRendimiento" placeholder="$ 0.00"
                                readonly>
                        </div>
                    </div>
                    <div class="col-4 mb-2">
                        <label for="iptCosto">Costo</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="icon-dollar"></i></span>
                            <input type="text" class="form-control text-end" id="iptCosto" placeholder="$ 0.00"
                                readonly>
                        </div>
                    </div>
                    <div class="col-4 mb-2">
                        <label for="iptPVenta">Precio de venta</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="icon-dollar"></i></span>
                            <input type="text" class="form-control text-end" id="iptPVenta" placeholder="$ 0.00"
                                readonly>
                        </div>
                    </div>
                    <div class="col-4 mb-2">
                        <label for="iptImpuestos">Impuestos</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="icon-dollar"></i></span>
                            <input type="text" class="form-control text-end" id="iptImpuestos" placeholder="$ 0.00"
                                readonly>
                        </div>
                    </div>
                    <div class="col-4 mb-2">
                        <label for="iptPVentaSI">Precio de venta sin impuestos</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="icon-dollar"></i></span>
                            <input type="text" class="form-control text-end" id="iptPVentaSI" placeholder="$ 0.00"
                                readonly>
                        </div>
                    </div>
                    <div class="col-4 mb-2">
                        <label for="iptMC">Margen de contribución</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="icon-dollar"></i></span>
                            <input type="text" class="form-control text-end" id="iptMC" placeholder="$ 0.00" readonly>
                        </div>
                    </div>
                    <div class="col-4 mb-2">
                        <label for="iptPCosto">Porcentaje de costo</label>
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control text-end" id="iptPCosto" placeholder="$ 0.00"
                                readonly>
                            <span class="input-group-text"><i class="icon-percent"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-1">
            <div class="col-12" style="font-size:0.7em;">
                <h5 class="text-center">Lista de Ingredientes</h5>
                <table class="table table-bordered table-striped table-condensed table-sm" id="tbIngredientes">
                    <thead>
                        <tr>
                            <th class="text-center">INGREDIENTES</th>
                            <th class="text-center">UNIDAD</th>
                            <th class="text-center">CANTIDAD</th>
                            <th class="text-center">P. UNIDAD</th>
                            <th class="text-center">COSTO</th>
                        </tr>
                    </thead>
                </table>
                <h5 class="text-center">Lista de Subrecetas</h5>
                <table class="table table-bordered table-striped table-condensed table-sm" id="tbSubrecetas">
                    <thead>
                        <tr>
                            <th class="text-center">SUBRECETAS</th>
                            <th class="text-center">UNIDAD</th>
                            <th class="text-center">CANTIDAD</th>
                            <th class="text-center">P. UNIDAD</th>
                            <th class="text-center">COSTO</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>

        <div class="row mb-5">
            <div class="col-12" style="font-size:0.8em;">
                <h6>PROCEDIMIENTO</h6>
                <hr>
                <!-- <textarea class="col-12" id="notaReceta" readonly></textarea> -->
                <div id="notaReceta" class="p-0">
                </div>
            </div>
        </div>

        <div class="row justify-content-around">
            <div class="col-4 mt-5">
                <div class="row">
                    <p style="border-bottom:1px solid #000;" class="col-12"></p>
                    <p class="col-12 text-center">DIRECCION OPERATIVA</p>
                </div>
            </div>
            <div class="col-2">
                <img src="https://erp-varoch.com/erp_files/sello_calidad.png" alt="Foto Receta" height="120px">
            </div>
            <div class="col-4 mt-5">
                <div class="row">
                    <p style="border-bottom:1px solid #000;" class="col-12"></p>
                    <p class="col-12 text-center">GERENTE</p>
                </div>
            </div>
        </div>
    </div>

    <!--JQUERY-->
    <script src="../src/plugin/jquery/jquery-3.7.0.min.js"></script>
    <!--BOOTSTRAP 5-->
    <script src="../src/plugin/bootstrap-5/js/bootstrap.min.js"></script>
    <script src="../src/plugin/bootstrap-5/js/bootstrap.bundle.js"></script>
    <!-- PERSONALIZADO -->
    <script src="https://plugins.erp-varoch.com/ERP/JS/complementos.js?t=<?php echo time(); ?>"></script>
    <script src="https://plugins.erp-varoch.com/ERP/JS/plugin-table.js?t=<?php echo time(); ?>"></script>
    <script src="https://plugins.erp-varoch.com/ERP/JS/plugin-forms.js?t=<?php echo time(); ?>"></script>
    <script src="src/js/printReceta.js?t=<?php echo time(); ?>"></script>
</body>

</html>