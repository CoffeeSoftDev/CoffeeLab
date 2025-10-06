<nav aria-label='breadcrumb'>
    <ol class='breadcrumb'>
        <li class='breadcrumb-item text-camelcase text-muted'>Produccion</li>
        <li class='breadcrumb-item text-uppercase text-muted'>SoftRestaurant</li>
        <li class='breadcrumb-item fw-bold active'>Desplazamientos</li>
    </ol>
</nav>
<div class="row d-flex justify-content-end mb-3">
    <div class="col-12 col-sm-6 col-lg-3">
        <label for="cbUDN">Seleccionar UDN</label>
        <select class="form-select" name="" id="cbUDN"></select>
    </div>
    <div class="col-12 col-sm-6 col-lg-3 mb-3 mb-sm-0">
        <label for="costys-or-soft">Filtrar consulta</label>
        <select class="form-select" id="costys-or-soft">
            <option value="0" selected>SOFTRESTAURANT</option>
            <option value="1">COSTYS</option>
        </select>
    </div>
</div>
<div class="row">
    <div class="col-12 col-md-7 col-lg-12" id="gpDatos"></div>
    <div id="cardForm" class="col-12 col-md-5 col-lg-4 p-4 hide">
        <h3 class="text-center text-primary" id="formTitle">Soft</h3>
        <h5 class="text-center">Soft</h5>
        <hr>
        <div class="row mb-3">
            <div class="col-12 col-md-3">
                <label class="fw-bold">Grupo<span class="text-danger">&nbsp;*</span></label>
            </div>
            <div class="col-12 col-md-9">
                <select class="form-select" name="" id="">

                </select>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-12 col-md-3">
                <label class="fw-bold">Clave<span class="text-danger">&nbsp;*</span></label>
            </div>
            <div class="col-12 col-md-9">
                <input class="form-control" type="text" placeholder="CLAVE" id="gv-clave">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-12 col-md-3">
                <label class="fw-bold">Nombre<span class="text-danger">&nbsp;*</span></label>
            </div>
            <div class="col-12 col-md-9">
                <input class="form-control" type="text" placeholder="NOMBRE" id="gv-nombre-soft">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-12 col-md-3">
                <label class="fw-bold">Precio<span class="text-danger">&nbsp;*</span></label>
            </div>
            <div class="col-12 col-md-9">
                <input class="form-control" type="text" placeholder="$" id="gv-ultimo-costo">
            </div>
        </div>
        <h5 class="text-center">Costys</h5>
        <hr>
        <div class="row mb-3">
            <div class="col-12 col-md-3">
                <label class="fw-bold">Grupo<span class="text-danger">&nbsp;*</span></label>
            </div>
            <div class="col-12 col-md-9">
                <select class="form-select" name="" id="">
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-12 col-md-3">
                <label class="fw-bold">Nombre<span class="text-danger">&nbsp;*</span></label>
            </div>
            <div class="col-12 col-md-9">
                <input class="form-control" type="text" placeholder="NOMBRE" id="gv-nombre-soft">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-12 col-md-3">
                <label class="fw-bold">Precio<span class="text-danger">&nbsp;*</span></label>
            </div>
            <div class="col-12 col-md-9">
                <input class="form-control" type="text" placeholder="$" id="gv-ultimo-costo">
            </div>
        </div>
        <div class="row mb-3">
            <button type="button" class="col-12 col-sm-5 btn btn-primary">Continuar</button>
            <button type="button" class="col-12 col-sm-5 offset-sm-2 btn btn-outline-danger"
                id="btnCerrarForm">Cancelar</button>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-12 col-md-7 col-lg-12" id="table-gv-soft"></div>
</div>
<script src="softrestaurant/src/js/desplazamientos.js?t=<?php echo time(); ?>"></script>