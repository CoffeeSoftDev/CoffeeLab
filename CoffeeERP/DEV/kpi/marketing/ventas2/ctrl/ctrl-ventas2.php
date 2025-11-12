<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-ventas2.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'ventas' => $this->lsVentas()
        ];
    }

    function lsSales() {
        $__row = [];
        $udn = $_POST['udn'];
        $anio = $_POST['anio'];
        $mes = $_POST['mes'];

        $ls = $this->listSales([$udn, $anio, $mes]);

        $ventasPorFecha = [];
        foreach ($ls as $key) {
            $fecha = $key['fecha'];
            if (!isset($ventasPorFecha[$fecha])) {
                $ventasPorFecha[$fecha] = [
                    'id'        => $key['id'],
                    'fecha'     => $fecha,
                    'dia'       => traducirDia($key['dia']),
                    'clientes'  => $key['clientes'],
                    'estado'    => $key['estado'],
                    'alimentos' => 0,
                    'bebidas'   => 0
                ];
            }

            if (strtolower($key['categoria']) == 'alimentos') {
                $ventasPorFecha[$fecha]['alimentos'] += floatval($key['clientes']);
            } elseif (strtolower($key['categoria']) == 'bebidas') {
                $ventasPorFecha[$fecha]['bebidas'] += floatval($key['clientes']);
            }
        }

        foreach ($ventasPorFecha as $venta) {
            $total = $venta['alimentos'] + $venta['bebidas'];

            $__row[] = [
                'id' => $venta['id'],
                'Fecha'     => formatSpanishDate($venta['fecha']),
                'Día'       => $venta['dia'],
                'Estado'    => renderStatus($venta['estado']),
                'Clientes'  => $venta['clientes'],
                'Alimentos' => evaluar($venta['alimentos']),
                'Bebidas'   => evaluar($venta['bebidas']),
                'Total' => [
                    'html'  => evaluar($total),
                    'class' => 'text-end bg-[#283341]'
                ],
                'dropdown' => dropdown($venta['id'], $venta['estado'])
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }


    function getSale() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al obtener los datos';
        $data = null;

        $sale = $this->getSaleById($id);

        if ($sale) {
            $status = 200;
            $message = 'Datos obtenidos correctamente';
            $data = $sale;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSale() {
        $status = 500;
        $message = 'No se pudo agregar la venta';
        
        $_POST['Fecha_Venta'] = $_POST['fecha'];
        $_POST['Cantidad'] = $_POST['clientes'];

        $exists = $this->existsSaleByDate([$_POST['udn'], $_POST['fecha']]);

        if ($exists == 0) {
            $idFolio = $this->createVentaUDN($this->util->sql([
                'id_UDN' => $_POST['udn'],
                'id_Venta' => 1,
                'Stado' => 1,
                'creacion' => date('Y-m-d H:i:s')
            ]));

            if ($idFolio) {
                $_POST['id_Folio'] = $idFolio;
                $create = $this->createSale($this->util->sql($_POST));

                if ($create) {
                    $status = 200;
                    $message = 'Venta agregada correctamente';
                }
            }
        } else {
            $status = 409;
            $message = 'Ya existe un registro para esta fecha y UDN';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSale() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar la venta';

        $_POST['Fecha_Venta'] = $_POST['fecha'];
        $_POST['Cantidad'] = $_POST['clientes'];

        $edit = $this->updateSale($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Venta editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSale() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $sale = $this->getSaleById($_POST['id']);
        
        if ($sale && isset($sale['id_Folio'])) {
            $update = $this->updateVentaUDN($this->util->sql([
                'Stado' => $_POST['active'],
                'idUV' => $sale['id_Folio']
            ], 1));

            if ($update) {
                $status = 200;
                $message = 'Estado actualizado correctamente';
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}


// Complements

function dropdown($id, $estado) {
    $options = [];

    if ($estado == 1) {
        $options[] = [
            'icon' => 'icon-pencil',
            'text' => 'Editar',
            'onclick' => "sales.editSale($id)"
        ];

        $options[] = [
            'icon' => 'icon-toggle-on',
            'text' => 'Desactivar',
            'onclick' => "sales.statusSale($id, 0)"
        ];
    } else {
        $options[] = [
            'icon' => 'icon-toggle-off',
            'text' => 'Activar',
            'onclick' => "sales.statusSale($id, 1)"
        ];
    }

    return $options;
}

function renderStatus($estado) {
    switch ($estado) {
        case 1:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Capturado</span>';
        case 0:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Inactivo</span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-500 text-white">Desconocido</span>';
    }
}

function traducirDia($dia) {
    $dias = [
        'Monday' => 'Lunes',
        'Tuesday' => 'Martes',
        'Wednesday' => 'Miércoles',
        'Thursday' => 'Jueves',
        'Friday' => 'Viernes',
        'Saturday' => 'Sábado',
        'Sunday' => 'Domingo'
    ];

    return $dias[$dia] ?? $dia;
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
