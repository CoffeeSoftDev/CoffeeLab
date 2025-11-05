<?php
session_start();
if (empty($_POST['opc'])) exit(0);

setlocale(LC_TIME, 'es_ES.UTF-8');
date_default_timezone_set('America/Mexico_City');

header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

// incluir modelo
require_once ('../mdl/mdl-costo-potencial.php');
require_once ('../mdl/mdl-calculo.php');
require_once ('../../conf/_Utileria.php');
require_once('../../conf/coffeSoft.php');

$encode = [];
class ctrl extends Costsys {

    function init(){

    }

    function list() {
        $__row = [];
        $mes = $_POST['mes'];
        $year = $_POST['year'];

        $data = $this->selectRecetas([14]);

        foreach ($data as $key) {

            // 🔵 Extraemos el año de la receta
            $anioReceta = date('Y', strtotime($key['fecha']));

            // // 🔵 Validamos si la receta pertenece al año solicitado
            // if ($anioReceta != $year) {
            //     continue;
            // }


            $productos      = $this ->selectDatosCostoPotencial([$key['idReceta'],$mes,$year]);
            $desplazamiento = $productos['desplazamiento'];

            // 📌 Verificamos que NO esté en la tabla de costo potencial
            if (empty($productos['fecha_costo'])) {

                $__row[] = [
                    'id'               => $key['idReceta'],
                    'Ult. Mod'         => formatSpanishDate($key['fecha']),
                    'Receta'           => $key['nombre'],
                    'Precio de venta'  => evaluar($key['precioVenta']),
                    'desplazamiento'   => $productos['desplazamiento'] ?? '',
                    'fecha_costo'      => $productos['fecha_costo'] ?? '',
                    'status'           => status($key['id_Estado']),
                    'opc'              => 0,
                ];
                
            }
          
        }

        return [
            'row' => $__row,
            'ls'  => $data
        ];
    }

   
}

function status($idEstado){
    switch ($idEstado) {
        case 1:
            return '<span class=" w-32 text-[#014737] text-xs font-semibold mr-2 px-3 py-1 rounded">ACTIVO</span>';
        case 0:
            return '<span class=" w-32 text-[#E05562] text-xs font-semibold mr-2 px-3 py-1 rounded">NO ACTIVO</span>';    
        case 4:
            return '<span class="bg-[#572A34] w-32 text-[#E05562] text-xs font-semibold mr-2 px-3 py-1 rounded">CANCELADO</span>';

    }
}

$obj = new ctrl();
$fn = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);
