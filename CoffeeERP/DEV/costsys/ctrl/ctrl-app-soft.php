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
        $mes = $_POST['Mes'];
        $year = $_POST['Anio'];

        $fecha = $year . '-' . $mes . '-01';
        $date  = date('Y-m-d', strtotime($fecha));

        // Library
           $util    = new Utileria;
           $calculo = new aux_cp;

        $data = $this->selectRecetas([$_POST['Clasificacion']]);

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

                $sub    = $this->getSubcategory([$key['id_Subclasificacion']]);

               
                 $costoPotencial = $this->calculateCostoPotencial([

                    'idReceta'        => $key['idReceta'],
                    'precioPropuesto' => '0',
                    'costo'           => '',
                    'iva'             => $key['iva'],
                    'ieps'            => $key['ieps'],
                    'pVenta'          => $key['precioVenta'],
                    'rendimiento'     => $key['rendimiento'],
                    'desplazamiento'  => 0,

                ], $calculo);


                  $data = [

              
                     'idE'                       => $_POST['UDNs'],
                    'fecha_costo'               => $date,
                    'id_Clasificacion'          => $_POST['Clasificacion'],
                    'receta'                    => $key['idReceta'],
                  
                    'precioventa'               => $key['precioVenta'],
                    'iva'                       => $key['iva'],
                    'ieps'                      => $key['ieps'],

                    'costo'              => $costoPotencial['costo'],
                    'costo_porc'         => $costoPotencial['porcentajeCosto'],
                    'margencontribucion' => $costoPotencial['mc'],

                ];


                $ok    = $this  -> add_costo_potencial($util -> sql($data));


               
               
                $__row[] = [
                    'id'               => $key['idReceta'],
                    'Ult. Mod'         => formatSpanishDate($key['fecha']),
                    'Receta'           => $key['nombre'],
                    'SubCategoria'     => $sub ,    
                    'Precio de venta'  => evaluar($key['precioVenta']),
                    'desplazamiento'   => $productos['desplazamiento'] ?? '',
                    // 'Sub categoria'    => $sub ?? '',
                    // 'fecha_costo'      => $productos['fecha_costo'] ?? '',
                    'status'           => status($key['id_Estado']),
                    'Agregado'         => $ok ? 'Si' : 'No',
                
                 
                    
                    'opc'              => 0,
                ];




              
                
            }
          
        }

        return [
            'frm_head' => "<strong>Conectado a </strong> {$this->bd}",
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
