<!-- Página principal con tabla -->
<div class="main-rec">
    <div class="row mb-3 d-flex justify-content-end mt-1">
    </div>
    <div class="row" id="containerTbReceta"></div>
</div>
<!-- Página agregar/editar receta -->
<div class="secondary-rec hide">
    <h4 class="text-capitalize mb-3" id="titleReceta">
    </h4>
    <!-- Form para agregar/editar receta -->
    <form id="formAddReceta" class="row row-cols-1 mb-2" novalidate="true">
        <div class="col-12 col-md-3 col-lg-2 d-flex aling-items-center justify-content-center">
            <div class="col-12 p-0 mb-3" id="content_photo_receta">
                <input type="file" class="hide" id="photo-receta" accept=".jpg, .jpeg, .png">
                <img id="imgReceta" src="https://minuspain.cl/wp-content/uploads/2021/09/default-placeholder-1.png"
                    alt="Colaborador" />
                <span class="fs-6 text-uppercase" onclick="$('#photo-receta').click();" alt="Cambiar foto">
                    <i class="icon-camera fs-4"></i>Subir foto
                </span>
                <p><i class='icon-pencil-5'></i></p>
            </div>
        </div>
        <div class="col-12 col-md-4 flex-column">
            <label class="fw-bold">Receta</label>
            <input class="form-control mb-2" id="txtRecetas" tipo="alfanumerico" name="txtRecetas" required="required"
                placeholder="Receta">
            <label class="fw-bold">Clasificación</label>
            <select class="form-control" id="txtcbClasificacionRec" name="txtcbClasificacionRec" required="required">
            </select>
        </div>
        <div class="col-12 col-md-3 col-lg-4">
            <label class="fw-bold">Nota</label>
            <textarea class="form-control resize" id="textareaNotasRec" name="textareaNotasRec" placeholder="Nota"
                rows="4"></textarea>
        </div>
        <div class="col-12 col-md-2 flex-column">
            <button type="submit" class="btn btn-primary col-12 mt-4 mb-3 mb-sm-1 mb-lg-4" id="btnCreateReceta">
            </button>
            <button type="button" class="btn btn-primary col-12 mt-4 mb-1 mb-sm-4 hide" id="btnSaveReceta">
                Guardar receta
            </button>
            <button type="button" class="btn btn-outline-danger col-12 mt-2 bootbox-close-button" id="btnCloseReceta">
                Cerrar
            </button>
        </div>
    </form>
    <div class="row p-0 m-0 justify-content-center" id="fillReceta">
        <hr>
        <div class="col-sm-12 col-md-12 col-lg-9 pe-1 ps-0">
            <h3 class="text-center mt-2 mb-4 fw-light"> Lista de ingredientes y subrecetas</h3>
            <!-- Agregar/Editar un ingrediente de la receta -->
            <div class="m-0 p-0 mb-4" id="frmAndTbRecetasIng" style="overflow-x: hidden; overflow-y: scroll;">
            </div>
            <!-- Agregar/Editar una subreceta de la receta -->
            <div class="m-0 p-0 mb-3" id="frmAndTbRecetasSub" style="overflow-x: hidden; overflow-y: scroll;">
            </div>
        </div>
        <!-- Procedimiento culinario -->
        <div class="col-sm-6 col-md-5 col-lg-3 p-0">
            <h3 class="text-center mt-2 fw-light mb-4">Procedimiento culinario</h3>
            <div id="containerFormProcCulinarioRec">
            </div>
        </div>
    </div>
</div>
<script src='src/js/recetas.js?t=<?php echo time(); ?>'></script>