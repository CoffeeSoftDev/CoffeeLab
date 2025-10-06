<?php
session_start();
if (empty($_POST['opc'])) exit(0);

require_once '../mdl/mdl-kpi-costsys.php';

class ctrl extends mdl {

    public function init() {
        return [
            'udn'  => $this->lsUDN(),
            'year' => $this->lsYears(),
            'clasificacion' => $this->lsClasificacion(),
        ];
    }

    // public function lsIngresos() {
    //     $__row = [];
    //     $fi = $_POST['fi'];
    //     $ff = $_POST['ff'];

    //     $ls = $this->listIngresos([
    //         'fi' => $fi,
    //         'ff' => $ff,
    //     ]);

    //     foreach ($ls as $key) {
    //         $__row[] = [
    //             'id'     => $key['id'],
    //             'name'   => $key['name'],
    //             'total'  => evaluar($key['total']),
    //             'opc'    => 0
    //         ];
    //     }

    //     return ['row' => $__row, 'thead' => ''];
    // }

    // public function lsMargen() {
    //     $__row = [];
    //     $ls = $this->listMargen([]);

    //     foreach ($ls as $key) {
    //         $__row[] = [
    //             'id'     => $key['id'],
    //             'name'   => $key['name'],
    //             'margen' => evaluar($key['margen']),
    //             'opc'    => 0
    //         ];
    //     }

    //     return ['row' => $__row, 'thead' => ''];
    // }

    // public function lsPromotionSales() {
    //     $__row = [];
    //     $ls = $this->listPromotionSales([]);

    //     foreach ($ls as $key) {
    //         $__row[] = [
    //             'id'       => $key['id'],
    //             'Producto' => $key['producto'],
    //             'Ingreso'  => evaluar($key['ingreso']),
    //             'opc'      => 0
    //         ];
    //     }

    //     return ['row' => $__row, 'thead' => ''];
    // }

    // public function lsPromotionMargen() {
    //     $__row = [];
    //     $ls = $this->listPromotionMargen([]);

    //     foreach ($ls as $key) {
    //         $__row[] = [
    //             'id'       => $key['id'],
    //             'Producto' => $key['producto'],
    //             'Margen'   => evaluar($key['margen']),
    //             'opc'      => 0
    //         ];
    //     }

    //     return ['row' => $__row, 'thead' => ''];
    // }

    // public function lsProductosAtencion() {
    //     $__row = [];
    //     $ls = $this->listProductosAtencion([]);

    //     foreach ($ls as $key) {
    //         $__row[] = [
    //             'id'       => $key['id'],
    //             'Producto' => $key['producto'],
    //             'Dias'     => $key['dias'],
    //             'opc'      => 0
    //         ];
    //     }

    //     return ['row' => $__row, 'thead' => ''];
    // }
}

$ctrl = new ctrl();
echo json_encode($ctrl->{$_POST['opc']}());
