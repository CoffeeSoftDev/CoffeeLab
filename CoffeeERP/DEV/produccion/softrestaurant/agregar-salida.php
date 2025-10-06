<link rel="stylesheet" href="softrestaurant/src/css/agregar-salida.css">
<nav aria-label='breadcrumb'>
    <ol class='breadcrumb'>
        <li class='breadcrumb-item text-uppercase text-muted'>produccion</li>
        <li class='breadcrumb-item text-uppercase text-muted'>softrestaurant</li>
        <li class='breadcrumb-item text-uppercase pointer'
            onClick="redireccion('produccion/softrestaurant/salidas.php');">salidas</li>
        <li class='breadcrumb-item fw-bold active'>Agregar salida</li>
    </ol>
</nav>

<div class="row p-0 d" id="father">
    <div class="col-12 col-md-6 col-lg-5 rounded-start p-0" id="divCarritoCompras">
        <div class="col-12 bg-secondary p-0 d-flex justify-content-center align-items-center" id="divSeparadorNav">
            <label class="text-center fs-5" for="">Carrito de compras</label>
        </div>
        <div class="col-12 table-responsive">
            <table class="table table-striped table-hover table-bordered ">
                <thead>
                    <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Presentación</th>
                        <th scope="col">Total</th>
                        <th scope="col">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Producto 1</td>
                        <td>
                            <input class="form-control text-end" type="text" placeholder="0">
                        </td>
                        <td class="text-end">$150</td>
                        <td>
                            <select class="form-select" name="" id="">
                                <option value="">Decena</option>
                                <option value="">Pza</option>
                            </select>
                        </td>
                        <td class="text-end">$150</td>
                        <td class="text-center"><button class="btn btn-danger"><i class="icon-trash"></i></button></td>
                    </tr>
                    <tr>
                        <td>Producto 1</td>
                        <td>
                            <input class="form-control text-end" type="text" placeholder="0">
                        </td>
                        <td class="text-end">$150</td>
                        <td>
                            <select class="form-select" name="" id="">
                                <option value="">Decena</option>
                                <option value="">Pza</option>
                            </select>
                        </td>
                        <td class="text-end">$150</td>
                        <td class="text-center"><button class="btn btn-danger"><i class="icon-trash"></i></button></td>
                    </tr>
                    <tr>
                        <td>Producto 1</td>
                        <td>
                            <input class="form-control text-end" type="text" placeholder="0">
                        </td>
                        <td class="text-end">$150</td>
                        <td>
                            <select class="form-select" name="" id="">
                                <option value="">Decena</option>
                                <option value="">Pza</option>
                            </select>
                        </td>
                        <td class="text-end">$150</td>
                        <td class="text-center"><button class="btn btn-danger"><i class="icon-trash"></i></button></td>
                    </tr>
                    <tr>
                        <td>Producto 1</td>
                        <td>
                            <input class="form-control text-end" type="text" placeholder="0">
                        </td>
                        <td class="text-end">$150</td>
                        <td>
                            <select class="form-select" name="" id="">
                                <option value="">Decena</option>
                                <option value="">Pza</option>
                            </select>
                        </td>
                        <td class="text-end">$150</td>
                        <td class="text-center"><button class="btn btn-danger"><i class="icon-trash"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- <div class="col-12 bg-dark d-flex align-items-end" style="height:70%; overflow:hidden"></div> -->
        <!-- <div class="col-12 bg-info align-self-end" style="height:6em;">

        </div> -->
    </div>
    <div class="col-12 col-md-6 col-lg-7 rounded-end" id="divProductosLista">
        <div class="row">
            <ul class="nav nav-tabs bg-secondary" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="agregar-list-tab" data-bs-toggle="tab" data-bs-target="#agregar-list"
                        type="button" role="tab" aria-controls="agregar-list" aria-selected="true">+</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="table-tab" data-bs-toggle="tab" data-bs-target="#table"
                        type="button" role="tab" aria-controls="table" aria-selected="true">P-123</button>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="table" role="tabpanel" aria-labelledby="table-tab">
                    <div class="row mb-3">
                        <div class="col-12 col-md-6 col-lg-4 ms-auto me-5 pe-4 ps-4 ps-md-0 pt-2">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Buscar producto"
                                    aria-label="Buscar producto" aria-describedby="btnBuscarProducto">
                                <button class="btn btn-outline-secondary" type="button" id="btnBuscarProducto"><i
                                        class="icon-search"></i></button>
                            </div>
                        </div>
                    </div>
                    <?php
                     include('card3.php');
                      ?>
                    <script src=""></script>
                </div>
                <div class="tab-pane fade bg-secondary" id="agregar-list" role="tabpanel"
                    aria-labelledby="agregar-list-tab">
                    <div class="row p-2">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script src="softrestaurant/src/js/conexion.js?t=<?php echo time(); ?>"></script>