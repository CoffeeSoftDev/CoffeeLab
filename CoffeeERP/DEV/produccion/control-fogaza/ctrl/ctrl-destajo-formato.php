<?php
session_start();
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

require_once('../mdl/mdl-gestion-de-ventas.php');
// require_once('../../../conf/_Utileria.php');
// require_once('../../../conf/coffeesoft.php');


class ctrl extends Destajo {

    // Inicializar filtros dinámicos si aplica
    public function init() {
        return []; // Agrega catálogos si es necesario
    }

    function listDestajo() {

        $ls          = $this->lsAreas();
        $__row       = [];
        $totalGlobal = 0;

        foreach ($ls as $key) {

            $lsColaborador = $this->listColaborador([$key['id']]);
            $totalArea = 0;
            $tmpColaboradores = [];

            foreach ($lsColaborador as $_key) {

                // CORREGIDO: ahora sí se obtiene el registro del colaborador
                $colaborador = $this->RegistroPagos([$_key['idEmpleado'], $_POST['fi'], $_POST['ff']]);

                $Total = $colaborador['destajo']
                    - $colaborador['dias']
                    - $colaborador['fonacot']
                    - $colaborador['perdidaMaterial']
                    - $colaborador['infonavit']
                    - $colaborador['prestamoPersonal'];

                $totalArea   += $Total;
                $totalGlobal += $Total;

                $tmpColaboradores[] = [
                    'id'               => $_key['idEmpleado'],
                    'Colaborador'      => $_key['Nombres'],
                    'area'             => $key['valor'],
                    'Destajo'          => evaluar($colaborador['destajo']),
                    'Dias festivos'    => evaluar($colaborador['dias']),
                    'Fonacot'          => evaluar($colaborador['fonacot']),
                    'Infonavit'        => evaluar($colaborador['infonavit']),
                    'Perdida material' => evaluar($colaborador['perdidaMaterial']),
                    'prestamos'        => evaluar($colaborador['prestamoPersonal']),
                    'porcentaje'       => '', // temporal
                    'pago'             => $Total,
                    'opc'              => 0
                ];
            }

            foreach ($tmpColaboradores as &$row) {
                $pago = $row['pago'];
                $row['porcentaje'] = $totalArea > 0 ? round(($pago * 100) / $totalArea, 2) . '%' : '0%';
                $row['pago'] = evaluar($row['pago']);
            }

            $__row = array_merge($__row, $tmpColaboradores);

            $__row[] = [
                'id'               => '',
                'Colaborador'      => '<strong>TOTAL DE ' . $key['valor'] . '</strong>',
                'area'             => '',
                'Destajo'          => '',
                'Dias festivos'    => '',
                'Fonacot'          => '',
                'Infonavit'        => '',
                'Perdida material' => '',
                'prestamos'        => '',
                'porcentaje'       => '<strong>100%</strong>',
                'pago destajo'     => '<strong>' . evaluar($totalArea) . '</strong>',
                'opc'              => 1
            ];
        }

        $__row[] = [
            'id'               => '',
            'Colaborador'      => '<strong  class="text-sm">TOTAL GENERAL</strong>',
            'area'             => '',
            'Destajo'          => '',
            'Dias festivos'    => '',
            'Fonacot'          => '',
            'Infonavit'        => '',
            'Perdida material' => '',
            'prestamos'        => '',
            'porcentaje'       => '',
            'pago destajo'     => '<strong class="text-sm">' . evaluar($totalGlobal) . '</strong>',
            'opc'              => 2
        ];

        return [
            'ConcentradoDestajo' => [ 'row'=>$__row],
            'ConcentradoArea'    => $this -> lsConcentradoAreas($ls)
        ];
    }

    function lsConcentradoAreas($areas){


        $__row       = [];
        $totalGlobal = 0;

        foreach ($areas as $key) {

        $mermaAcomulada   = $this -> listProduction(array( $_POST['fi'], $_POST['ff'], 2, $key['id']));
        $totalProduccion  = $this -> listProduction(array( $_POST['fi'], $_POST['ff'], 1, $key['id']));


              $__row[] = [
                'id'                   => $key['id'],
                'Departamento'         => $key['valor'],
                'Merma acomulada'      => evaluar($mermaAcomulada),
                'Producción acomulada' => evaluar($totalProduccion ),
                'Destajo acomulado'    =>  evaluar($totalProduccion * 0.098),
                'opc'                  => 0
            ];

        }


        return [
            'row' => $__row
        ];

    }





   }

    function evaluar($val){
        return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
    }



// Instancia del objeto

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);