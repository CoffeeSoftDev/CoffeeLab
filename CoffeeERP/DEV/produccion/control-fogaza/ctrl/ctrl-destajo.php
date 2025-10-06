<?php
if (empty($_POST['opc'])) exit(0);

// incluir tu modelo
require_once('../mdl/mdl-gestion-de-ventas.php');

require_once('../../../conf/coffeSoft.php');

require_once('../../../conf/_Utileria.php');


class ctrl extends Gestiondeventas{

    public $util;

    public function __construct() {
        parent::__construct(); // Llama al constructor de la clase padre
        $this->util = new Utileria(); 
    }


    function lsDestajo(){

        # Declarar variables
        $lsAreas      = $this->lsAreas();

       

        $random = str_pad(mt_rand(0, 999), 3, '0', STR_PAD_LEFT);


        $set_employed = [];
        
        $folio        = $this-> getFolio([$_POST['date']]);
        if(!$folio){

             // Crear un nuevo folio.
             $this->createFolio([$random,$_POST['date'].' '. date("H:i:s")]);
             $folio        = $this-> getFolio([$_POST['date']]);


            // Agregar trabajadores
            foreach($lsAreas as $area): 
                 $lsColaborador = $this ->listColaborador(array($area['id']));
                 foreach ($lsColaborador as $colaborador) {
                    $data = $this -> util :: sql(
                        [
                            'id_Pago'        => $folio[0]['idPago'],
                            'id_Colaborador' => $colaborador['idEmpleado'],
                            'pagodestajo'    => 200
                        ]
                    );
                    $success = $this -> setDestajo($data);
                    $set_employed[] = $success;
                 }
            endforeach;
        }

        $listVentas        = $this -> lsVentas($lsAreas);
        $listControlMermas = $this -> lsControlMermas($lsAreas);
        $pagoColaborador   = $this -> lsPagosColaborador($lsAreas);
        
        


        // $ok = $this-> addColaboradores(); 
        
        return [
           
            'addColaboradores'    => $set_employed,
            'folio'               => $folio,
            'listVentas'          => $listVentas,
            'listMermas'          => $listControlMermas,
            'listPagoColaborador' => $pagoColaborador,
        ];

    }


    function lsVentas($ls){
        $__row = [];


        foreach ($ls as $key) {

            $total   = $this -> getTotalProduccion([$_POST['date'],$key['id']]);
            $destajo = $total * 0.098;

            $totalDestajo    += $destajo;
            $totalProduccion += $total;

            $__row[] = array(

                'id'     => $key['id'],
                'area'   => $key['valor'],
                'Monto'  => evaluar($total),
                'Destajo'=> evaluar($destajo),
                'Firma'  => '_____________________________________',
                'opc'    => 0        
            );

        }

        // Total general :

        $__row[] = array(

            'id'      => $key['id'],
            'area'    => 'TOTAL',
            'Monto'   => evaluar($totalProduccion),
            'Destajo' => evaluar($totalDestajo),
            'Firma'   => '',
            'opc'     => 2
        );


           $head =  frmHead([
            
            'title' => 'DESTAJO FOGAZA',
            'folio' => $folio[0]['idPago'],
            'fecha' => $_POST['date']

        ]);


        return [
        
            'frm_head' => $head,
            'thead'    => '',
            'row'      => $__row,
        ];

    }

    function lsControlMermas(){
        # Declarar variables
        $__row = [];
        $date  = $_POST['date'];

        $y = date('Y', strtotime("$date"));
        $m = date('m', strtotime("$date"));
        $d = date('d', strtotime("$date"));
        $fi = $y . '-' . $m . '-01 ';

        # Consultar a la base de datos
        $lsAreas = $this ->lsAreas();
        
        $totalProduccion = 0;
        $totalDestajo    = 0;

        foreach ($lsAreas as $key) {

            $mermaAcomulada   = $this -> consultarProduccion(array($fi, $date, 2, $key['id']));
            $totalProduccion  = $this -> consultarProduccion(array($fi, $date, 1, $key['id']));

            $merma = $this -> merma_dia(array($date, 2, $key['id']));


            $__row[] = array(

                'id'                   => $key['id'],
                'departamento'         => $key['valor'],
                'merma del dia'        => evaluar($merma),
                'merma acumulada'      => evaluar($mermaAcomulada),
                'Produccion acumulada' => evaluar($totalProduccion),
                'Destajo acomulado'    => evaluar($totalProduccion * 0.098),
                'opc'                  => 0
            );


        }
        
        
        return [

            'thead'          => '',
            'row'            => $__row,
        ];
    }

    function lsPagosColaborador($ls){

        // Pagos a destajo :
        $__rowColaborador = [];

        $arreglo = [];
        foreach ($ls as $key) {

            $lsColaborador = $this ->listColaborador(array($key['id']));
            $data = [];

            $__rowColaborador[] = array(

                'id'               => $key['id'],
                'Colaborador'      => $key['valor'],
                'Destajo'          => '',
                'Dias festivos'    => '',
                'Fonacot'          => '',
                'Infonavit'        => '',
                'Perdida material' => '',
                'prestamos'        => '',
                'pago destajo'     => '',
                'opc'              => 1
            );


            $Total = 0;

            foreach ($lsColaborador as $_key) {

            $colaborador = $this -> RegistroPagos(array($_key['idEmpleado'], $_POST['date']));

            $Total = $colaborador['destajo'] - $colaborador['dias']-$colaborador['fonacot']  - $colaborador['perdidaMaterial'] - $colaborador['infonavit'] - $colaborador['prestamoPersonal'];

            $data['destajo']          += $colaborador['destajo'];
            $data['dias']             += $colaborador['dias'];
            $data['fonacot']          += $colaborador['fonacot'];
            $data['infonavit']        += $colaborador['infonavit'];
            $data['perdidaMaterial']  += $colaborador['perdidaMaterial'];
            $data['prestamoPersonal'] += $colaborador['prestamoPersonal'];
            $data['total']            += $Total;

            // Settear valores:
            $colaborador['destajo']   = $colaborador['destajo']   != null ? ($colaborador['destajo']==0) ? '' : $colaborador['destajo'] : '';
            $colaborador['dias']      = $colaborador['dias']      != null ? ($colaborador['dias'] == 0) ? '' : $colaborador['dias'] : '';
            $colaborador['fonacot']   = ($colaborador['fonacot']  != null) ? ($colaborador['fonacot'] == 0) ? '' : $colaborador['fonacot'] : '';
            $colaborador['infonavit'] = $colaborador['infonavit'] != null ? ($colaborador['infonavit'] ==0) ? '': $colaborador['infonavit'] : '';
            $colaborador['perdidaMaterial'] = $colaborador['perdidaMaterial'] != null ? ($colaborador['perdidaMaterial'] ==0 ) ? '' : $colaborador['perdidaMaterial'] : '';



            $colaborador['prestamoPersonal'] = $colaborador['prestamoPersonal'] != null ? ($colaborador['prestamoPersonal'] ==0) ? '': $colaborador['prestamoPersonal'] : '';



            $dias_festivos    = [];
            $fonacot          = [];
            $infonavit        = [];
            $perdidaMaterial  = [];
            $prestamoPersonal = [];
            $destajo          = [];


            $destajo[] = [

                "id"     => $_key['idEmpleado'],
                "name"   => "pagodestajo",
                "value"  => $colaborador['destajo'],
                "id_row" => $key['id'],
                'fn' => 'calcularTotal(this);'
            ];

            $dias_festivos[] = [
            "id"     => $_key['idEmpleado'],
            "name"   => "DiasExtras",
            "value"  => $colaborador['dias'],
            "id_row" => $key['id']

            ];

            $fonacot[] = [
            "id"     => $_key['idEmpleado'],
            "name"   => "Fonacot",
            "value"  => $colaborador['fonacot'],
            "id_row" => $key['id']

            ];

            $infonavit[] = [
            "id"     => $_key['idEmpleado'],
            "name"   => "Infonavit",
            "value"  => $colaborador['infonavit'],
            "id_row" => $key['id']

            ];

            $perdidaMaterial[] = [
            "id"     => $_key['idEmpleado'],
            "name"   => "perdidaMaterial",
            "value"  => $colaborador['perdidaMaterial'],
            "id_row" => $key['id']

            ];

            $prestamoPersonal[] = [
            "id"     => $_key['idEmpleado'],
            "name"   => "prestamoPersonal",
            "value"  => $colaborador['prestamoPersonal'],
            "id_row" => $key['id']

            ];



            $__rowColaborador[] = array(

            'id'               => $_key['idEmpleado'],
            'area'             => $_key['Nombres'],
            'Destajo'          => $destajo,
            'Dias festivos'    => $dias_festivos,
            'Fonacot'          => $fonacot,
            'Infonavit'        => $infonavit,
            'Perdida material' => $perdidaMaterial,
            'prestamos'        => $prestamoPersonal,
            'pago'             => evaluar($Total),

            'opc' => 0
            );
            }

            // Guardar totales por categoria

            $arreglo['destajo']          += $data['destajo'];
            $arreglo['dias']             += $data['dias'];
            $arreglo['fonacot']          += $data['fonacot'];
            $arreglo['infonavit']        += $data['infonavit'];
            $arreglo['perdidaMaterial']  += $data['perdidaMaterial'];
            $arreglo['prestamoPersonal'] += $data['prestamoPersonal'];
            $arreglo['total']            += $data['total'];

            // Total por categoria:

            $__rowColaborador[] = array(

                'id'               => $key['id'],
                'area'             => 'TOTAL '. $key['valor'],
                'Destajo'          => '<span id="totalpagodestajo'.$key['id'].'">'.evaluar($data['destajo']).'</span>',
                'Dias festivos'    => '<span id="totalDiasExtras'.$key['id'].'">'.evaluar($data['dias']).'</span>',
                'Fonacot'          => '<span id="totalFonacot'.$key['id'].'">'.evaluar($data['fonacot']).'</span>',
                'Infonavit'        => '<span id="totalInfonavit'.$key['id'].'">'.evaluar($data['infonavit']).'</span>',
                'Perdida material' => '<span id="totalperdidaMaterial'.$key['id'].'">'.evaluar($data['perdidaMaterial']).'</span>',
                'prestamos'        => '<span id="totalprestamoPersonal'.$key['id'].'">'.evaluar($data['prestamoPersonal']).'</span>',
                'pago'             => '<span id="totalPago'.$key['id'].'">'.evaluar($data['total']).'</span>',
                'opc'              => 2
            );


        }


        // Total general :

        $__rowColaborador[] = array(

            'id'               => 5,
            'area'             => 'TOTAL GRAL',
            'Destajo'          => '<span id="totalpagodestajo5">' .evaluar($arreglo['destajo']).'</span>',
            'Dias festivos'    => '<span id="totalDiasExtras5">' .evaluar($arreglo['dias']) . '</span>',
            'Fonacot'          => '<span id="totalFonacot5">' .evaluar($arreglo['fonacot']) . '</span>',
            'Infonavit'        => '<span id="totalInfonavit5">' .evaluar($arreglo['infonavit']) . '</span>',
            'Perdida material' => '<span id="totalperdidaMaterial5">' .evaluar($arreglo['perdidaMaterial']) . '</span>',
            'prestamos'        => '<span id="totalprestamoPersonal5">' .evaluar($arreglo['prestamoPersonal']) . '</span>',
            'pago'             => '<span id="totalPago5">' .evaluar($arreglo['total']) . '</span>',
            'opc'              => 1
        );




        return [

        'thead' => '',
        'row' => $__rowColaborador,
        ];

    }


    function addColaboradores(){

        $folio   = $this-> getFolio([$_POST['date']]);
        $lsAreas = $this -> lsAreas();

        $list_colaborador    = [];

        if(!$folio){

            // return data
            $this->createFolio(['00',$_POST['date'].' '. date("H:i:s")]);
            return $this -> getFolio([$_POST['date']]);



        }else{ // crear folio y agregar colaboradores.

        foreach ($lsAreas as $area) :

            $lsColaboradores  =  $this  -> listColaborador([$area['id']]);

          
            foreach ($lsColaboradores as $colaborador) {
                
                $list_colaborador[]   = $this -> util -> sql([
                    'id_Colaborador' => $colaborador['idEmpleado'],
                    'id_Pago'        => $folio,
                    'pagodestajo'    => 0
                ]);

                // $this -> addColaboradorInFormat($list_colaborador);
            }

        endforeach;

        }

        return [

            'folio' => $folio[0]['idPago'],
            'colaboradores' => $list_colaborador
            
        ];

    }


   




}


// Instancia del objeto

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();

function frmHead($data){

    return '
    <div class="row m-0 ">
        <div class="col-3" id="logo">
        <img src="../../src/img/logos/logo_row.png" style="height:40px;" alt="Grupo Varoch">
        </div>
        <div class="col-6 vertical-center">
        <p class="fw-bold text-uppercase m-0 fs-5" id="format_title">'.$data['title'].'</p>
        <p class="text-uppercase m-0" id="udn"></p>
        </div>
        <div class="col-3 text-end">
        <p class="fw-bold m-0" id="folio">Folio: # <span class="text-primary">'.$data['folio'].'</span></p>
        <p style="font-size:.68em;" class="fw-bold m-0" id="f"><span class="text-primary">'.formatSpanishDate($data['fecha']).'</span></p>
        </div>
    </div>';

}

echo json_encode($encode);