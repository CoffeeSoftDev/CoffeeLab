<?php
if (empty($_COOKIE["IDU"]))
    require_once ('../acceso/ctrl/ctrl-logout.php');

require_once ('layout/head.php');
require_once ('layout/script.php');
?>

<body>
    <?php require_once ('../layout/navbar.php'); ?>
    <main>

        <section id="sidebar"></section>
        <div id="main__content">
            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>costsys</li>
                    <li class='breadcrumb-item fw-bold active'>Administración</li>
                </ol>
            </nav>
            <script src='src/js/administracion.js?t=<?php echo time(); ?>'></script>
            <div class="row">
                <nav>
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active text-dark" id="classification-tab" data-bs-toggle="tab"
                                data-bs-target="#classification-tab-pane" type="button" role="tab"
                                aria-controls="classification-tab-pane" aria-selected="true">Clasificación</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link text-dark" id="subclassification-tab" data-bs-toggle="tab"
                                data-bs-target="#subclassification-tab-pane" type="button" role="tab"
                                aria-controls="subclassification-tab-pane"
                                aria-selected="false">SubClasificación</button>
                        </li>
                    </ul>
                </nav>
                <div class="tab-content" id="myTabContent">
                    <!-- CLASIFICACIÓN -->
                    <div class="tab-pane fade show active pt-3" id="classification-tab-pane" role="tabpanel"
                        aria-labelledby="classification-tab" tabindex="0">
                        <form id="formClasificacion" novalidate
                            class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 justify-content-end mb-3">
                            <div class="col mb-3">
                                <label for="txtcbUDN">UDN</label>
                                <select class="form-select" name="udn" id="txtcbUDN" required>
                                </select>
                            </div>
                            <div class="col mb-3">
                                <label for="txtClasificacion">Clasificación</label>
                                <input type="text" class="form-control" name="clasificacion" id="txtClasificacion"
                                    placeholder="Nueva Clasificación" required>
                            </div>
                            <div class="col mb-3">
                                <label for="txtIva">Impuestos</label>
                                <input type="text" class="form-control" name="IVA" id="txtIva" placeholder="Impuestos">
                            </div>
                            <div class="col mb-3">
                                <label for="">&nbsp;</label>
                                <button type="submit" id="btnClasificacion" class="btn btn-primary col-12"><i
                                        class="icon-plus"></i> Clasificación
                                </button>
                            </div>
                        </form>
                        <hr>
                        <div id="containerTbClasificacion"></div>
                    </div>

                    <!-- SUB-CLASIFICACIÓN -->
                    <div class="tab-pane fade pt-3" id="subclassification-tab-pane" role="tabpanel"
                        aria-labelledby="subclassification-tab" tabindex="0">

                        <form id="formSubClasificacion" novalidate
                            class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 justify-content-end mb-3">
                            <div class="col mb-3">
                                <label for="txtcbClasificacion">Clasificación</label>
                                <select class="form-select" name="clasificacion" id="txtcbClasificacion" required>
                                </select>
                            </div>
                            <div class="col mb-3">
                                <label for="txtSubClasificacion">SubClasificación</label>
                                <input type="text" class="form-control" name="subclasificacion" id="txtSubClasificacion"
                                    placeholder="Nueva SubClasificación" required>
                            </div>
                            <div class="col mb-3">
                                <label for="">&nbsp;</label>
                                <button type="submit" id="btnDepto" class="btn btn-primary col-12"><i
                                        class="icon-plus"></i> SubClasificación
                                </button>
                            </div>
                        </form>
                        <hr>
                        <div id="containerTbSubClasificacion"></div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- externo -->
    <script src="https://15-92.com/ERP3/src/js/CoffeSoft.js?t=<?php echo time(); ?>"></script>
</body>

</html>