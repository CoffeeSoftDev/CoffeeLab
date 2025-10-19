<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-reportes.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'canales' => $this->lsCanales(),
            'años' => $this->lsAños()
        ];
    }

    function lsResumenPedidos() {
        $udn = $_POST['filterUDN'] ?? $_POST['udn'];
        $año = $_POST['filterAño'] ?? $_POST['año'];
        
        $canales = $this->lsCanales();
        
        // Organizar datos por mes
        $meses = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
            5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
            9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];
        
        $rows = [];
        
        foreach ($meses as $numMes => $nombreMes) {
            $row = [
                'Mes' => $nombreMes
            ];
            
            $totalMes = 0;
            
            foreach ($canales as $canal) {
                // Consulta optimizada por canal específico
                $pedido                = $this->getPedidosByUdnYearCanal([5,$numMes, 2025, $canal['id']]);
                $cantidad              = $pedido['cantidad'] ?? '-';
                $row[$canal['valor']]  = $cantidad;
                $totalMes             += $pedido['cantidad'];
            
            }

            $row['Total'] = [
                'html'  => '<strong>' . $totalMes . '</strong>',
                'class' => 'text-center  '
            ];
            // Resaltar mes actual
            $row['opc'] =0;
            
            if ($numMes == date('n')) {
                $row['opc'] = 2;
            }
            
            $rows[] = $row;
        }
        
        return [
            'row' => $rows,
            'data' => $data
        ];
    }

    function lsResumenVentas() {
        $udn = $_POST['filterUDN'] ?? $_POST['udn'];
        $año = $_POST['filterAño'] ?? $_POST['año'];
        
        $data = $this->listVentasByCanal([$udn, $año]);
        $canales = $this->lsCanales();
        
        $meses = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
            5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
            9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];
        
        $rows = [];
        
        foreach ($meses as $numMes => $nombreMes) {
            $row = [
                'Mes' => $nombreMes
            ];
            
            $totalMes = 0;
            
            foreach ($canales as $canal) {
                // Consulta optimizada por canal específico
                $dataCanal = $this->getVentasByUdnYearCanal([$udn, $año, $canal['id']]);
                $monto = 0;
                
                // Buscar el mes específico en los resultados
                foreach ($dataCanal as $item) {
                    if ((int)$item['mes'] == $numMes) {
                        $monto = (float)$item['monto_total'];
                        break;
                    }
                }
                
                $row[$canal['valor']] = evaluar($monto);
                $totalMes += $monto;
            }
            
            $row['Total'] = [
                'html' => '<strong>' . evaluar($totalMes) . '</strong>',
                'class' => 'text-center bg-green-50 font-bold text-green-800'
            ];
            
            if ($numMes == date('n')) {
                $row['class'] = 'bg-yellow-50';
            }
            
            $rows[] = $row;
        }
        
        return [
            'row' => $rows,
            'data' => $data
        ];
    }

    function lsBitacoraIngresos() {
        $udn = $_POST['filterUDN'] ?? $_POST['udn'];
        $año = $_POST['filterAño'] ?? $_POST['año'];
        $mes = $_POST['filterMes'] ?? $_POST['mes'] ?? date('n');
        
        $data = $this->listIngresosDiarios([$udn, $año, $mes]);
        $rows = [];
        
        foreach ($data as $item) {
            $rows[] = [
                'Fecha' => formatSpanishDate($item['fecha']),
                'Canal' => ucfirst($item['canal_comunicacion']),
                'Monto' => evaluar($item['monto']),
                'Pedidos' => $item['cantidad_pedidos'],
                'Registrado' => $item['fecha_creacion']
            ];
        }
        
        return [
            'row' => $rows,
            'data' => $data
        ];
    }

    function addIngreso() {
        $status = 500;
        $message = 'Error al agregar ingreso';
        
        $_POST['created_at'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;
        
        // Validar duplicidad
        $exists = $this->existsIngresoByDateAndCanal([
            $_POST['fecha'],
            $_POST['canal_comunicacion'],
            $_POST['udn_id']
        ]);
        
        if (!$exists) {
            $create = $this->createIngreso($this->util->sql($_POST));
            
            if ($create) {
                $status = 200;
                $message = 'Ingreso agregado correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe un registro para esta fecha y canal';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editIngreso() {
        $status = 500;
        $message = 'Error al editar ingreso';
        
        $edit = $this->updateIngreso($this->util->sql($_POST, 1));
        
        if ($edit) {
            $status = 200;
            $message = 'Ingreso actualizado correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getIngreso() {
        $id = $_POST['id'];
        $data = $this->getIngresoById($id);
        
        return [
            'status' => $data ? 200 : 404,
            'message' => $data ? 'Datos obtenidos' : 'Registro no encontrado',
            'data' => $data
        ];
    }

    function deleteIngreso() {
        $id = $_POST['id'];
        $delete = $this->deleteIngresoById($id);
        
        return [
            'status' => $delete ? 200 : 500,
            'message' => $delete ? 'Ingreso eliminado correctamente' : 'Error al eliminar'
        ];
    }

    function getKPIDashboard() {
        $udn = $_POST['filterUDN'] ?? $_POST['udn'];
        $año = $_POST['filterAño'] ?? $_POST['año'];
        
        $kpiData = $this->getKPIData([$udn, $año]);
        $comparativeData = $this->getComparativeData([$udn, $año]);
        
        return [
            'status' => 200,
            'message' => 'Datos obtenidos correctamente',
            'data' => [
                'kpis' => $kpiData['kpis'],
                'canales' => $kpiData['canales'],
                'comparative' => $comparativeData
            ]
        ];
    }

    // Método temporal de debug - REMOVER EN PRODUCCIÓN
    function debugReportes() {
        $udn = $_POST['filterUDN'] ?? $_POST['udn'] ?? 1;
        $año = $_POST['filterAño'] ?? $_POST['año'] ?? 2024;
        
        $data = $this->listPedidosByCanal([$udn, $año]);
        $canales = $this->lsCanales();
        
        return [
            'status' => 200,
            'message' => 'Debug data',
            'debug' => [
                'udn' => $udn,
                'año' => $año,
                'data_count' => count($data),
                'canales_count' => count($canales),
                'sample_data' => array_slice($data, 0, 3),
                'sample_canales' => array_slice($canales, 0, 3),
                'data_structure' => !empty($data) ? array_keys($data[0]) : [],
                'canales_structure' => !empty($canales) ? array_keys($canales[0]) : []
            ]
        ];
    }
}

// Complements
function evaluar($monto) {
    return '$' . number_format($monto, 2, '.', ',');
}

function formatSpanishDate($date) {
    $meses = [
        1 => 'Ene', 2 => 'Feb', 3 => 'Mar', 4 => 'Abr',
        5 => 'May', 6 => 'Jun', 7 => 'Jul', 8 => 'Ago',
        9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dic'
    ];
    
    $fecha = new DateTime($date);
    $dia = $fecha->format('d');
    $mes = $meses[(int)$fecha->format('n')];
    $año = $fecha->format('Y');
    
    return "$dia $mes $año";
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());