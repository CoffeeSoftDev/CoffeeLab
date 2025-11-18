<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once('../mdl/mdl-productos-vendidos.php');

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'categorias' => $this->lsCategorias([])
        ];
    }

    function ls() {
        $rows = [];
        $udn = $_POST['udn'];
        $mes = $_POST['mes'];
        $anio = $_POST['anio'];

        $data = $this->listProductosVendidos([$udn, $mes, $anio]);

        foreach ($data as $item) {
            $rows[] = [
                'id' => $item['id'],
                'Producto' => $item['producto'],
                'Categoría' => $item['categoria'],
                'Cantidad' => number_format($item['cantidad'], 2),
                'Costo Unitario' => evaluar($item['costo_unitario']),
                'Costo Total' => evaluar($item['costo_total']),
                'Precio Venta' => evaluar($item['precio_venta']),
                'Total Venta' => evaluar($item['total_venta']),
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows
        ];
    }

    function lsCostsys() {
        $rows = [];
        $udn = $_POST['udn'];
        $mes = $_POST['mes'];
        $anio = $_POST['anio'];

        $data = $this->listDesplazamiento([$udn, $mes, $anio]);

        foreach ($data as $item) {
            $rows[] = [
                'id' => $item['id'],
                'Producto' => $item['producto'],
                'Categoría' => $item['categoria'],
                'Desplazamiento' => number_format($item['desplazamiento'], 2),
                'Costo Unitario' => evaluar($item['costo_unitario']),
                'Costo Total' => evaluar($item['costo_total']),
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows
        ];
    }

    function lsFogaza() {
        $rows = [];
        $udn = $_POST['udn'];
        $mes = $_POST['mes'];
        $anio = $_POST['anio'];
        $categoria = $_POST['categoria'];

        $data = $this->listFogaza([$udn, $mes, $anio, $categoria]);

        foreach ($data as $item) {
            $rows[] = [
                'id' => $item['id'],
                'Producto' => $item['producto'],
                'Cantidad' => number_format($item['cantidad'], 2),
                'Costo Unitario' => evaluar($item['costo_unitario']),
                'Costo Total' => evaluar($item['costo_total']),
                'Precio Venta' => evaluar($item['precio_venta']),
                'Total Venta' => evaluar($item['total_venta']),
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows
        ];
    }

    function subirCostoPotencial() {
        $status = 500;
        $message = 'Error al subir costo potencial';
        $agregados = [];
        $noEncontrados = [];

        $udn = $_POST['udn'];
        $mes = $_POST['mes'];
        $anio = $_POST['anio'];

        $desplazamiento = $this->listDesplazamiento([$udn, $mes, $anio]);
        $productosVendidos = $this->listProductosVendidos([$udn, $mes, $anio]);

        foreach ($desplazamiento as $desp) {
            $encontrado = false;
            
            foreach ($productosVendidos as $vendido) {
                if ($desp['id_producto'] == $vendido['id_producto']) {
                    $encontrado = true;
                    
                    $exists = $this->existsCostoPotencial([
                        $vendido['id_producto'],
                        $mes,
                        $anio,
                        $udn
                    ]);

                    if (!$exists) {
                        $data = [
                            'id_producto' => $vendido['id_producto'],
                            'mes' => $mes,
                            'anio' => $anio,
                            'id_udn' => $udn,
                            'cantidad' => $vendido['cantidad'],
                            'costo_unitario' => $desp['costo_unitario'],
                            'costo_total' => $desp['costo_total'],
                            'fecha_registro' => date('Y-m-d H:i:s')
                        ];

                        $this->createCostoPotencial($this->util->sql($data));
                        $agregados[] = $vendido['producto'];
                    }
                    break;
                }
            }

            if (!$encontrado) {
                $noEncontrados[] = $desp['producto'];
            }
        }

        if (count($agregados) > 0 || count($noEncontrados) > 0) {
            $status = 200;
            $message = 'Proceso completado';
        }

        return [
            'status' => $status,
            'message' => $message,
            'agregados' => $agregados,
            'no_encontrados' => $noEncontrados,
            'total_agregados' => count($agregados),
            'total_no_encontrados' => count($noEncontrados)
        ];
    }

    function lsDiasPendientes() {
        $rows = [];
        $udn = $_POST['udn'];
        $anio = $_POST['anio'];

        $data = $this->lsDiasPendientes([$udn, $anio]);

        foreach ($data as $item) {
            $rows[] = [
                'Mes' => $item['mes_nombre'],
                'Días Pendientes' => $item['dias_pendientes'],
                'Estado' => $item['dias_pendientes'] > 0 
                    ? '<span class="text-warning">Pendiente</span>' 
                    : '<span class="text-success">Completo</span>',
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows,
            'total_pendientes' => array_sum(array_column($data, 'dias_pendientes'))
        ];
    }

    function lsRegistros() {
        $rows = [];
        $udn = $_POST['udn'];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];

        $data = $this->listRegistrosByFecha([$udn, $fi, $ff]);

        foreach ($data as $item) {
            $rows[] = [
                'id' => $item['id'],
                'Fecha' => formatSpanishDate($item['fecha']),
                'Producto' => $item['producto'],
                'Cantidad' => number_format($item['cantidad'], 2),
                'Costo Total' => evaluar($item['costo_total']),
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows
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

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
