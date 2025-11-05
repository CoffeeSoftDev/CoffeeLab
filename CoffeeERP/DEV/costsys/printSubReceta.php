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
    #polaroid-container {
        background: white;
        padding: 10px;
        border: 1px solid #ddd;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 180px;
        margin: 0 auto;
    }

    #container_photo_receta {
        width: 150px;
        height: 150px;
        position: relative;
        margin: 0 auto;
        cursor: pointer;
    }

    #container_photo_receta img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @page {
        margin-top: 15px;
        margin-bottom: 15px;
        margin-right: 15px;
        margin-left: 10px;
    }

    #caption {
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-top: 10px;
    }
</style>

<body>
    <div class="container-fluid pt-5 pe-3 ps-3">
        <!-- Nombre de la subreceta -->
        <h1 id="nombre-subreceta" class="text-center mb-2 mt-5">Nombre de la SubReceta</h1>
        <h5 id="categoria-subreceta" class="text-center mb-5">Categoría de la SubReceta</h5>
        <!-- Cuerpo de la subreceta -->
        <div class="row">
            <!-- Imagen de la subreceta -->
            <div class="col-4 text-center ">
                <div id="polaroid-container">
                    <div class="p-0" id="container_photo_receta">
                        <img id="fotoSubReceta" alt="Foto SubReceta">
                    </div>
                    <!-- <div id="caption">Foto de la subreceta</div> -->
                </div>
            </div>

            <!-- Ingredientes y subrecetas -->
            <div class="col-7">
                <h3 id="titulo-ingredientes" class="mb-4">Ingredientes</h3>
                <ul id="lista-ingredientes" class="list-group mb-4">
                </ul>

                <h3 id="titulo-subrecetas" class="mb-4">Subrecetas</h3>
                <ul id="lista-subrecetas" class="list-group mb-4"></ul>

                <!-- <h3 id="titulo-subrecetas" class="mb-4"><span class='text-info'>1.36 KG</span> Rendimiento</h3> -->
            </div>
        </div>

        <!-- Procedimiento -->
        <div id="procedimiento-subreceta" class="mt-5 pe-3 ps-3">
            <h3 id="titulo-procedimiento" class="mb-4">Procedimiento</h3>
            <p>Descripción paso a paso del procedimiento.</p>
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
    <script src="src/js/printSubReceta.js?t=<?php echo time(); ?>"></script>
</body>

</html>