<!-- Página principal con tabla -->
<div class="main-sub">
    <h5 id="containerTitleSubRecetas" class="text-capitalize"></h5>
    <div class="row" id="containerTbSubReceta"></div>
</div>
<!-- Página agregar/editar subreceta -->
<div class="secondary-sub hide">
    <h4 class="text-capitalize mb-3" id="titleSubReceta">
    </h4>
    <!-- Form para agregar/editar subreceta -->
    <form id="formAddSubReceta" class="row row-cols-1 mb-2" novalidate="true">
        <div class="col-12 col-md-3 col-lg-2 d-flex aling-items-center justify-content-center">
            <div class="col-12 p-0 mb-3" id="content_photo_subreceta">
                <input type="file" class="hide" id="photo-subreceta" accept=".jpg, .jpeg, .png">
                <img id="imgSubReceta" src="./src/img/default.png"
                    alt="SubReceta" />
                <span class="fs-6 text-uppercase" onclick="$('#photo-subreceta').click();" alt="Cambiar foto">
                    <i class="icon-camera fs-4"></i>Subir foto
                </span>
                <p class="hide"><i class='icon-trash'></i></p>
            </div>
        </div>
        <div class="col-12 col-md-4 flex-column">
            <label class="fw-bold">SubReceta</label>
            <input class="form-control mb-2" id="txtSubReceta" tipo="alfanumerico" name="txtSubReceta"
                required="required" placeholder="SubReceta">
            <label class="fw-bold">Clasificación</label>
            <select class="form-control" id="txtcbClasificacionSub" name="txtcbClasificacionSub" required="required">
            </select>
        </div>
        <div class="col-12 col-md-3 col-lg-4">
            <label class="fw-bold">Observaciones</label>
            <textarea class="form-control resize" id="textareaNotasSub" name="textareaNotasSub"
                placeholder="Observaciones" rows="4"></textarea>
        </div>
        <div class="col-12 col-md-2 flex-column">
            <button type="submit" class="btn btn-primary col-12 mt-4 mb-3 mb-sm-1 mb-lg-4" id="btnCreateSubReceta">
            </button>
            <button type="button" class="btn btn-primary col-12 mt-4 mb-1 mb-sm-4 hide" id="btnSaveSubReceta">
                Guardar Subreceta
            </button>
            <button type="button" class="btn btn-danger col-12 mt-2 bootbox-close-button"
                id="btnCloseSubReceta">
                Salir <i class="icon-logout-3"></i>
            </button>
        </div>
    </form>
    <div class="row p-0 m-0 justify-content-center" id="fillSubReceta">
        <hr>
        <div class="col-sm-12 col-md-12 col-lg-9 pe-1 ps-0">
            <h3 class="text-center mt-2 mb-4 fw-light"> Lista de ingredientes y subrecetas</h3>
            <!-- Agregar/Editar un ingrediente de la subreceta -->
            <div class="m-0 p-0 mb-4" id="frmAndTbSubRecetasIng">
            </div>
            <!-- Agregar/Editar una subreceta de la subreceta -->
            <div class="m-0 p-0 mb-3" id="frmAndTbSubRecetasSub">
            </div>
        </div>
        <!-- Procedimiento culinario -->
        <div class="col-sm-6 col-md-5 col-lg-3 p-0">
            <h3 class="text-center mt-2 fw-light mb-4">Procedimiento culinario</h3>
            <div id="containerFormProcCulinarioSub">
            </div>
        </div>
    </div>
</div>
<script src='src/js/subrecetas.js?t=<?php echo time(); ?>'></script>