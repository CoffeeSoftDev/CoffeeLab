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
        width: 250px;
        height: 250px;
        position: relative;
        margin: 0 auto;
    }
    #container_photo_receta img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    @page {
        margin-top: 30px;
        margin-bottom: 30px;
        margin-right: 12px;
        margin-left: 12px;
    }
    #caption {
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-top: 10px;
    }
</style>

<body>
    <div class="container-fluid pe-3 ps-3">
        <!-- Nombre de la receta -->
        <h1 id="nombre-receta" class="text-center mb-3">Nombre de la Receta</h1>
        <h5 id="categoria-receta" class="text-center mb-3">Categoría de la Receta</h5>
        <!-- Cuerpo de la receta -->
        <div class="row mb-1">
            <!-- Imagen de la receta -->
            <div class="col-5 text-center">
                <div class="p-0" id="container_photo_receta">
                    <img src="https://erp-varoch.com/erp_files/default.png" id="fotoReceta" alt="Foto Receta">
                </div>
            </div>

            <!-- Ingredientes y subrecetas -->
            <div class="col-6">
                <h3 id="titulo-ingredientes">Ingredientes</h3>
                <ul id="lista-ingredientes" class="list-group mb-4">
                </ul>
                <h3 id="titulo-subrecetas">Subrecetas</h3>
                <ul id="lista-subrecetas" class="list-group">
                </ul>
            </div>
        </div>

        <!-- Procedimiento -->
        <div id="procedimiento-receta" class="pe-4 ps-4">
            <h3 id="titulo-procedimiento" class="mb-1">Procedimiento</h3>
            <div id="procedimiento"></div>
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
    <script src="src/js/printRecetario.js?t=<?php echo time(); ?>"></script>
</body>

</html>