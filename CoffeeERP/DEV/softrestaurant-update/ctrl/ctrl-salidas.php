<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once('../mdl/mdl-salidas.php');

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'productos' => $this->lsProductos([])
        ];
    }

    function ls() {
        $rows = [];
        $udn = $_POST['udn'];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];

        $data = $this->listSalidas([$udn, $fi, $ff]);

        foreach ($data as $item) {
            $a = [];

            if ($item['activo'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => "app.editSalida({$item['id']})"
                ];
                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => "app.statusSalida({$item['id']}, 1)"
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => "app.statusSalida({$item['id']}, 0)"
                ];
            }

            $rows[] = [
                'id' => $item['id'],
                'Fecha' => formatSpanishDate($item['fecha']),
                'Producto' => $item['producto'],
                'Cantidad' => number_format($item['cantidad'], 2),
                'Motivo' => $item['motivo'],
                'Usuario' => $item['usuario'],
                'Estado' => renderStatus($item['activo']),
                'a' => $a
            ];
        }

        return [
            'thead' => '',
            'row' => $rows
        ];
    }

    function getSalida() {
        $status = 500;
        $message = 'Error al obtener salida';
        $data = null;

        $salida = $this->getSalidaById([$_POST['id']]);

        if ($salida) {
            $status = 200;
            $message = 'Salida encontrada';
            $data = $salida;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSalida() {
        $status = 500;
        $message = 'Error al agregar salida';

        $_POST['fecha'] = date('Y-m-d');
        $_POST['fecha_registro'] = date('Y-m-d H:i:s');
        $_POST['activo'] = 1;

        $create = $this->createSalida($this->util->sql($_POST));

        if ($create) {
            $status = 200;
            $message = 'Salida registrada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSalida() {
        $status = 500;
        $message = 'Error al editar salida';

        $edit = $this->updateSalida($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Salida editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSalida() {
        $status = 500;
        $message = 'Error al cambiar estado';

        $update = $this->updateSalida($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

// Complements
function evaluar($val) {
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

function formatSpanishDate($date) {
    $meses = [
        1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
        5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
        9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
    ];
    
    $timestamp = strtotime($date);
    $dia = date('d', $timestamp);
    $mes = $meses[(int)date('m', $timestamp)];
    $anio = date('Y', $timestamp);
    
    return "$dia de $mes de $anio";
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Activo</span>';
        case 0:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Inactivo</span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-500 text-white">Desconocido</span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
