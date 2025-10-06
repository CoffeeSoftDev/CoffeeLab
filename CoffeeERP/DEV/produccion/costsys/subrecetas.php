<style>
    #content_photo_receta {
        width: 150px;
        height: 150px;
        position: relative;
        margin: 0 auto;
        border-radius: 50%;
        cursor: pointer;
    }

    #content_photo_receta img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px dashed #ccc;
    }

    #content_photo_receta span {
        border-radius: 50%;
        background-color: var(--disabled6);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        font-size: 1.5rem;
        color: aliceblue;
        display: none;
        transition: all 0.5s ease;
    }

    #content_photo_receta:hover span {
        display: flex;
    }

    #content_photo_receta p {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.5rem;
        height: 1.5rem;
        bottom: 9px;
        right: 20px;
        margin: 0;
        border-radius: 50%;
        background-color: var(--info);
        color: aliceblue;
        font-size: 0.8rem;
    }

    #content_photo_receta:hover p {
        display: none;
    }
</style>

<!-- Página principal con tabla -->
<div class="main-sub">
    <div class="row mb-3 d-flex justify-content-end mt-1">
    </div>
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
                <img id="imgSubReceta" src="https://minuspain.cl/wp-content/uploads/2021/09/default-placeholder-1.png"
                    alt="Colaborador" />
                <span class="fs-6 text-uppercase" onclick="$('#photo-subreceta').click();" alt="Cambiar foto">
                    <i class="icon-camera fs-4"></i>Subir foto
                </span>
                <p><i class='icon-pencil-5'></i></p>
            </div>
        </div>
        <div class="col-12 col-md-4 flex-column">
            <label class="fw-bold">SubReceta</label>
            <input class="form-control mb-2" id="txtSubReceta" tipo="alfanumerico" name="txtSubReceta" required="required"
                placeholder="SubReceta">
            <label class="fw-bold">Clasificación</label>
            <select class="form-control" id="txtcbClasificacionSub" name="txtcbClasificacionSub" required="required">
            </select>
        </div>
        <div class="col-12 col-md-3 col-lg-4">
            <label class="fw-bold">Nota</label>
            <textarea class="form-control resize" id="textareaNotasSub" name="textareaNotasSub" placeholder="Nota"
                rows="4"></textarea>
        </div>
        <div class="col-12 col-md-2 flex-column">
            <button type="submit" class="btn btn-primary col-12 mt-4 mb-3 mb-sm-1 mb-lg-4" id="btnCreateSubReceta">
            </button>
            <button type="button" class="btn btn-primary col-12 mt-4 mb-1 mb-sm-4 hide" id="btnSaveSubReceta">
                Guardar Subreceta
            </button>
            <button type="button" class="btn btn-outline-danger col-12 mt-2 bootbox-close-button" id="btnCloseSubReceta">
                Cerrar
            </button>
        </div>
    </form>
    <div class="row p-0 m-0 justify-content-center" id="fillSubReceta">
        <hr>
        <div class="col-sm-12 col-md-12 col-lg-9 pe-1 ps-0">
            <h3 class="text-center mt-2 mb-4 fw-light"> Lista de ingredientes y subrecetas</h3>
            <!-- Agregar/Editar un ingrediente de la subreceta -->
            <div class="m-0 p-0 mb-4" id="frmAndTbSubRecetasIng" style="overflow-x: hidden; overflow-y: scroll;">
            </div>
            <!-- Agregar/Editar una subreceta de la subreceta -->
            <div class="m-0 p-0 mb-3" id="frmAndTbSubRecetasSub" style="overflow-x: hidden; overflow-y: scroll;">
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