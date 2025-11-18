<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once('../mdl/mdl-gestion-archivos.php');

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN()
        ];
    }

    function ls() {
        $rows = [];
        $udn = $_POST['udn'];
        $anio = $_POST['anio'];

        $data = $this->listArchivos([$udn, $anio]);

        foreach ($data as $item) {
            $rows[] = [
                'id' => $item['id'],
                'Fecha' => formatSpanishDate($item['fecha']),
                'Archivo' => $item['nombre_archivo'],
                'Registros' => number_format($item['total_registros']),
                'Estado' => renderEstadoArchivo($item['estado']),
                'Usuario' => $item['usuario'],
                'Fecha Carga' => formatDateTime($item['fecha_carga']),
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows
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
                'Días con Archivo' => $item['dias_con_archivo'],
                'Días Pendientes' => $item['dias_pendientes'],
                'Porcentaje' => number_format($item['porcentaje'], 1) . '%',
                'Estado' => $item['dias_pendientes'] > 0 
                    ? '<span class="text-warning">Incompleto</span>' 
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

    function getArchivo() {
        $status = 500;
        $message = 'Error al obtener archivo';
        $data = null;

        $archivo = $this->getArchivoByFecha([$_POST['fecha'], $_POST['udn']]);

        if ($archivo) {
            $status = 200;
            $message = 'Archivo encontrado';
            $data = $archivo;
        } else {
            $status = 404;
            $message = 'No se encontró archivo para esta fecha';
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addArchivo() {
        $status = 500;
        $message = 'Error al registrar archivo';

        $_POST['fecha_carga'] = date('Y-m-d H:i:s');
        $_POST['estado'] = 1;

        $exists = $this->getArchivoByFecha([$_POST['fecha'], $_POST['id_udn']]);

        if (!$exists) {
            $create = $this->createArchivo($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Archivo registrado correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe un archivo para esta fecha';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function validarArchivo() {
        $status = 500;
        $message = 'Error al validar archivo';
        $errores = [];
        $validos = 0;

        if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] == 0) {
            $archivo = $_FILES['archivo']['tmp_name'];
            $extension = pathinfo($_FILES['archivo']['name'], PATHINFO_EXTENSION);

            if (strtolower($extension) !== 'csv') {
                $status = 400;
                $message = 'El archivo debe ser formato CSV';
            } else {
                $handle = fopen($archivo, 'r');
                $linea = 0;

                while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
                    $linea++;
                    
                    if ($linea == 1) continue;

                    if (count($data) < 5) {
                        $errores[] = "Línea $linea: Formato incorrecto";
                    } else {
                        $validos++;
                    }
                }

                fclose($handle);

                $status = 200;
                $message = 'Archivo validado correctamente';
            }
        } else {
            $status = 400;
            $message = 'No se recibió ningún archivo';
        }

        return [
            'status' => $status,
            'message' => $message,
            'registros_validos' => $validos,
            'errores' => $errores,
            'total_errores' => count($errores)
        ];
    }
}

// Complements
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

function formatDateTime($datetime) {
    $timestamp = strtotime($datetime);
    return date('d/m/Y H:i', $timestamp);
}

function renderEstadoArchivo($estado) {
    switch ($estado) {
        case 1:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Procesado</span>';
        case 0:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#8a4600] text-[#f0ad28]">Pendiente</span>';
        case 2:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Error</span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-500 text-white">Desconocido</span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
