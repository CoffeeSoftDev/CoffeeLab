<nav aria-label='breadcrumb'>
    <ol class='breadcrumb'>
        <li class='breadcrumb-item text-uppercase text-muted'>produccion</li>
        <li class='breadcrumb-item text-uppercase text-muted'>softrestaurant</li>
        <li class='breadcrumb-item fw-bold active'>Salidas</li>
    </ol>
</nav>
<div class="row mb-3 d-flex justify-content-end">
    <!-- <div class="col-12 col-sm-6 col-lg-3 mb-3">
        <label for="cbUDN">Seleccionar UDN</label>
        <select class="form-select" id="cbUDN"></select>
    </div>
    <div class="col-12 col-sm-6 col-lg-3 mb-3">
        <label for="iptDate">Fecha</label>
        <div class="input-group">
            <input type="text" class="form-control" id="iptDate">
            <span class="input-group-text"><i class="icon-calendar"></i></span>
        </div>
    </div> -->
    <div class="col-12 col-sm-6 col-lg-3 mb-3">
        <label col="col-12"> </label>
        <button type="button" class="btn btn-primary col-12" id="btnOk"><i class="icon-history"></i> Historial</button>
    </div>
    <div class="col-12 col-sm-6 col-lg-3 mb-3">
        <label col="col-12"> </label>
        <button type="button" class="btn btn-info col-12" id="btnAgregarSalida"><i class="icon-plus"></i>
            Salida</button>
    </div>
</div>

<div class="row" id="tbDatos">
    <table class="table table-sm table-hover no-wrap" id="tb">
        <thead>
            <tr>
                <th>Titulo 1</th>
                <th>Titulo 2</th>
                <th>opciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Celda 1</td>
                <td>Celda 1</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-outline-primary" onClick="updateModal(1,'Celda 1');">
                        <i class="icon-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" estado="1" id="btnStatus1"
                        onClick="toggleStatus(1)">
                        <i class="icon-toggle-on"></i>
                    </button>
                </td>
            </tr>
            <tr>
                <td>Celda 2</td>
                <td>Celda 2</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-outline-primary" onClick="updateModal(2,'Celda 2');">
                        <i class="icon-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" estado="1" id="btnStatus2"
                        onClick="toggleStatus(2)">
                        <i class="icon-toggle-on"></i>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<script src='softrestaurant/src/js/salidas.js?t=1696371705'></script>