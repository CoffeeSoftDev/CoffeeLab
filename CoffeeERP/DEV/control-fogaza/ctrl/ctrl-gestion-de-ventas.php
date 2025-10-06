<?php

// if(empty($_POST['opc'])) exit(0);


require_once('../mdl/mdl-gestion-de-ventas.php');
$obj = new Gestiondeventas;

require_once('../../conf/_Utileria.php');
$util = new Utileria;


   $encode = [];

   switch ($_POST['opc']) {
    case 'lsFolios':

        $th     = ['Folio','Fecha','Hora','Area','Turno',''];   
        
        if($_POST['rpt'] == 1):
            $encode = ls($obj,$th);
        
        else:
            $encode = lsMermas_Cancelados($obj);
        endif;    
            
    break;
    
    case 'ver-ticket':
        $th     = ['Producto','Propuesta Gte','Produccion Panadero','Prod. Real','Precio','Total'];
        $encode = ticket($obj,$th);
    break;

    case 'ticketMermas':
        $encode = ticketMermas($obj);
    break;


    case 'cancelar-folio':
        $array  = $util->sql($_POST, 1);
        $encode = $obj->CancelarFolio($array);
    break;

    case 'ipt':
        $array  = $util->sql($_POST, 1);
        $ok     = $obj->actualizar_cantidad($array);
        $encode = $ok;
    break;

    case 'cerrar-ticket':
        $encode =  $obj->__actualizar_ticket([1, 1, $_POST['idFolio']]);
    break;

    case 'lsIngresos':
      $encode = lsDestajo($obj);
    break;


    case 'pagoColaborador':
        $estado = '';

        $idPago = $obj->getPago([ $_POST['id_Pago'], $_POST['id_Colaborador'] ]);

        if($idPago){ // actualizar registro:
            
            // Eliminar los registros inecesarios
            
            unset($_POST['id_Pago']);
            unset($_POST['id_Colaborador']);
            
            $_POST['idDestajo'] = $idPago[0]['idDestajo'];
            
            // actualizar registro:
            $data = $util->sql($_POST,1);

            $ok = $obj->updatePago($data);


            $estado = 'actualizar';

        } else{ // crear un nuevo pago:
            $estado = 'insertar';
            
            $data  = $util->sql($_POST);
            $ok    = $obj->createPago($data);




        }

        $encode = [
            'ok'     => $ok,
            'data0'  => $data,
            'estado' => $estado
        ];

    break;
       
   }


#----------------------
# Mermas y Cancelados
#----------------------

function lsMermas_Cancelados($obj){
    # Declarar variables
    $__row = [];


    $fi = $_POST['fi'];
    $ff = $_POST['ff'];

    # Consultar a la base de datos
    $ls = $obj->lsFolio(array($_POST['rpt'], $fi, $ff));


    $cont = count($ls);

    foreach ($ls as $key) {
        $btn = [];

        $btn[] = [
            "icon"  => " icon-eye",
            "color" => "primary",
            "fn"    => "lsTicket"
        ];

            $btn[] = [
                "icon" => "icon-block-2",
                "color" => "danger",
                "fn" => "CancelarFolio"
            ];


        $list_area = $obj->Select_Areas(array($key['idLista']));
        $txt_area = '';

        foreach ($list_area as $_key) {
            $txt_area .= '' . $_key['Nombre_Area'] . '';
        }

        // /*creacion de paquete */

        $__row[] = array(
            'id'    => $key['idLista'],
            'Folio' => '<span class="fw-bold ">' . $key['folio'] . '</span>',
            'fecha' => formatSpanishDate($key['fecha']),
            'hora'  => $key['hora'],
            'area'  => $txt_area,
            'nota'  => $key['nota'],
            "btn"   => $btn
        );
    }


    #encapsular datos
    $encode = [
        "thead" => '',
        "row" => $__row,
        "cont" => $cont
    ];

    return $encode;

}

function ticketMermas($obj)
{

    $__row = [];
    $total_general = 0;

    /* --      Data ticket      --*/

    $lsFolio = $obj->lsDataTicket([$_POST['id']]);
    foreach ($lsFolio as $key);


    /*--      end consulta   -- */

    $lsAreas = $obj->Select_Areas([$_POST['id']]);

    foreach ($lsAreas as $_key) {

        # Lista de productos     
        $sql_producto = $obj->Select_Productos($_key['idArea'], $_POST['id']);


        foreach ($sql_producto as $_key) {

         
            $__row[] = array(
                'id'       => $_key['idListaProductos'],
                'Producto' => '<span class="text-uppercase">' . $_key['NombreProducto'] . '</span>',
                'Real'     => $_key['cantidad'],
                'precio'   => evaluar($_key['costo']),
                'total'    => evaluar($_key['total']),
                'opc'      => 0,
            );


            $total_general += $_key['total'];
        }
    }

    $__row[] = array(
        'id'       => 0,
        'Producto' => '<b> TOTAL    </b>',
        'Real'     => '',
        'precio'   => '',
        'total'    => '<strong>'.evaluar($total_general).'</strong>',
        'opc'      => 1,
    );



    //  Titulo del ticket :
    $objs = headers([
        'fecha'   => $key['fecha'],
        'folio'   => $key['folio'],
        'hora'    => $key['hora'],
        'titulo'  => ($key['id_tipo'] ==2 ) ? 'MERMA ' : 'CANCELADO',
        'id_tipo' => $key['estado_revisado'],
        'total'   => $total_general,
    ]);

    /* --     Footer      --*/
 
        $frm = ticket_footer([
            'total' => $total_general,
            'destajo' => ''
        ]);

    // Encapsular arreglos
    $encode = [
        "thead"    => '',
        "row"      => $__row,
        "frm_head" => $objs,
        'lsFolio'  => $lsFolio
    ];

    return $encode;
}

function headers($data){
    return '
    
    <div style ="font-size:.8em;" class="row m-0 mb-2">
        <div class="col-4" >
        <p class="fw-bold m-0" id="folio"><span class="text-primary">' . formatSpanishDate($data['fecha']) . '</span></p>

        </div>
        <div class="col-4 vertical-center">
            <p class="fw-bold text-uppercase m-0 fs-5" id="format_title">'. $data['titulo'].'</p>
            <p class="text-uppercase m-0" id="udn"></p>
        </div>
        <div class="col-4 text-end ">
            <p class="fw-bold m-0" id="folio">Folio: # <span class="text-primary">'.$data['folio'].'</span></p>
        </div>';

}


#----------------------
# Historial de ventas
#----------------------
function lsDestajo($obj){
    
    # Declarar variables
    
    
    $folio = $obj-> getFolio([$_POST['date']]);

    if(!$folio){
   
        $obj-> createFolio(['00',$_POST['date'].' '. date("H:i:s")]);
        $folio = $obj->getFolio([$_POST['date']]);
   
    }




    # lista de areas : 
    $head = frmHead([
        'title' => 'DESTAJO FOGAZA',
        'folio' => $folio[0]['idPago'],
        'fecha' => $_POST['date']
    ]);
    
    $lsAreas = $obj->lsAreas();
    

    // Consultar ventas por área:   
    // $lsVentas = lsVentas($obj,$lsAreas, $head);

    // // Consultar control de mermas:
    $lsControlMerma = lsControlMermas($obj);

    // // Consultar pago de colaborador:
    $pagoColaborador = lsPagosColaborador($obj, $lsAreas);


    # encapsular datos :

    return [
       'folio'           => $folio[0],
       'ventasArea'      => $lsVentas,
       'pagoColaborador' => $pagoColaborador,
       'controlMermas'   => $lsControlMerma,
    ];

}

function lsControlMermas($obj){
    # Declarar variables
    $__row = [];
    $date  = $_POST['date'];

    $y = date('Y', strtotime("$date"));
    $m = date('m', strtotime("$date"));
    $d = date('d', strtotime("$date"));
    $fi = $y . '-' . $m . '-01 ';

    # Consultar a la base de datos
    $lsAreas = $obj->lsAreas();
    
    $totalProduccion = 0;
    $totalDestajo    = 0;

    foreach ($lsAreas as $key) {

        $mermaAcomulada   = $obj->consultarProduccion(array($fi, $date, 2, $key['id']));
        $totalProduccion  = $obj->consultarProduccion(array($fi, $date, 1, $key['id']));

        $merma = $obj->merma_dia(array($date, 2, $key['id']));


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
        'thead' => '',
        'row' => $__row,
    ];
}

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

#----------------------
#  Formato Destajo
#----------------------

function lsVentas($obj,$ls,$head){
    $__row = [];


    foreach ($ls as $key) {

        $total   = $obj->getTotalProduccion([$_POST['date'],$key['id']]);
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


    return [
        'frm_head' => $head,
        'thead'    => '',
        'row'      => $__row,
    ];

}

function lsPagosColaborador($obj,$ls){

    // Pagos a destajo :
    $__rowColaborador = [];

    $arreglo = [];
    foreach ($ls as $key) {

        $lsColaborador = $obj->listColaborador(array($key['id']));
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

            $colaborador = $obj->RegistroPagos(array($_key['idEmpleado'], $_POST['date']));
                        
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
                "id_row" => $key['id']
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

                'id'               => $key['id'].'_'.$_key['idEmpleado'],
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


#----------------------
#  Producción
#----------------------
function ls($obj,$th){
    # Declarar variables
    $__row   = [];
  

    $fi = $_POST['fi'];
    $ff = $_POST['ff'];

    # Consultar a la base de datos
    $ls    = $obj->lsFolio(array($_POST['rpt'],$fi,$ff));
 

    $cont = count($ls);

        foreach ($ls as $key) {
            $btn = [];

            $btn[] = [
                "icon"  => " icon-doc-3",
                "color" => "primary",
                "fn"    => "verTicket"
            ];

            if($_POST['rpt'] == 3){


                $btn[] = [
                   "icon"  => "icon-warning",
                   "color" => "warning",
                   "fn"    => "AbrirFolio"
                ];


            }else{
                $btn[] = [
                    "icon" => "icon-block-2",
                    "color" => "danger",
                    "fn" => "CancelarFolio"
                ]; 
            }

            
            $list_area = $obj-> Select_Areas(array($key['idLista']));
            $txt_area = '';

            foreach ($list_area as $_key) {
            $txt_area .= ''.$_key['Nombre_Area'].'';
            }
            
            /*creacion de paquete */

            $__row[] = array(
            'id'     => $key['idLista'],
            'Folio'  => '<span class="fw-bold ">'.$key['folio'].'</span>',
            'fecha'  => formatSpanishDate($key['fecha']),
            'hora'   => $key['hora'],
            'area'   => $txt_area,
            // 'turno'  => select_turno($key['turno']),
            'estado' => estado_ticket($key['estado_revisado']),
            'nota'   => $key['nota'],
            "btn"    => $btn
            );
        }


    #encapsular datos
        $encode = [
            "thead" => '',
            "row" => $__row,
            "cont" => $cont
        ];

    return $encode;  

}

function ticket($obj,$th){
    
    $__row        = [];
    $total_general = 0;
    
    /* --      Data ticket      --*/

    $lsFolio = $obj->lsDataTicket([$_POST['id']]);
    foreach ($lsFolio as $key);
   

    /*--      end consulta   -- */

    $lsAreas = $obj-> Select_Areas([$_POST['id']]); 
        
    foreach ($lsAreas as $_key) {

        # Lista de productos     
        $sql_producto = $obj->Select_Productos($_key['idArea'],$_POST['id']);
        
        
        foreach ($sql_producto as $_key) {

            $val           = $_key['cantidad'] != null ? $_key['cantidad'] : '';
            $_key['total'] = $_key['total']    != null ? $_key['total'] : '';

            $ipt      = [];
            $precio   = [];
            $total    = [];



            if($key['estado_revisado'] != 1) {
              
                $ipt[] = [
                    "id"    => $_key['idListaProductos'],
                    "name"  => "cantidad",
                    "value" => $val,
                ];


            } else {
                               
                $ipt = $val;
            }
            

         
            $__row[] = array(
                'id'       => $_key['idListaProductos'],
                'Producto' => '<span class="text-uppercase">'.$_key['NombreProducto'].'</span>',
                'Gerente'  => $key['new_estado'],
                'Panadero' => $_key['sugerencia'],
                'Real'     => $ipt,
                'precio'   => $_key['costo'],
                'total'    => $_key['total'],
                'opc'      => 0,

            );

            $total_general += $_key['total'];
        }
    }

   // 

    $objs = ticket_head( [
            'fecha'   => formatSpanishDate($key['fecha']),
            'titulo'  => 'LINEA DE PRODUCCION <span class="text-primary">' . $key['Nombre_Area'] .'</span>',
            'folio'   => $key['folio'],
            'hora'    => $key['hora'],
            'estado'  => $key['new_estado'],
            'id'      => $_POST['id'],
            'id_tipo' => $key['estado_revisado'],
            'total'   => $total_general,
            'NoProductos' => count($__row)
    ]);

    /* --     Footer      --*/
    $frm = '';
    if($key['estado_revisado'] != 0)

    $frm = ticket_footer([
        'total'   => $total_general,
        'destajo' => ''    
    ]);

      






    // Encapsular arreglos
    $encode = [
    "thead"    => '',
    "row"      => $__row,
    "frm_head" => $objs,
    "frm_foot"   => $frm,
    ];

    return $encode;
}

function ticket_footer($data){

    $total_destajo = $data['total'] * 0.098;

    return '
    <table style="font-size:.75em;" class="tb tb-bordered">
          <tr>
            <td class="col-10">
                <label id="respuesta"> </label>
                <b>TOTAL DE PRODUCCIÓN </b>
            </td>
            <td > 
            <input disabled class="form-control text-end cell" value="'.evaluar2($data['total']).'" id="frm_txtTotalControl">
            </td>
          </tr>

              <tr>
          <td><b>DESTAJO </b></td>
          <td  >
          <input disabled class="form-control text-end cell" value="'. $total_destajo.'" id="txtDestajoControl">
          </td>
          </tr>

        
    </table>
      
     
     ';


   
}   

function ticket_head($data){

    $btn_cerrar = '';
    if($data['id_tipo'] ==0) 
    $btn_cerrar = '<a class="btn btn-outline-success" onclick="cerrarTicket(' . $data['id'] . ')" ><i class="icon-print"></i>Cerrar Ticket  </a>';

    $div = '
    <div class="row mt-2">
    <div class="col-sm-12 ">
    <a class="btn btn-outline-primary" onclick="print_formato(' . $data['id'] . ')" ><i class="icon-print"></i>Imprimir </a>
    '.$btn_cerrar.'
    </div>
    
    </div>

    <div class="table-responsive mb-3 mt-3" id="content-rpt">
    
    <table style="font-size:.76em; " class="tb table-bordered">
     
        <tr>
            <td class="col-sm-1 fw-bold">FECHA: </td>
            <td class="col-sm-3">'.$data['fecha'].'</td>
            <td class="col-sm-2 text-center"> <strong>'.$data['titulo'].'</strong> </td>
            <td class="col-sm-1 fw-bold"> FOLIO:  </td>
            <td class="col-sm-4 text-right text-end text-danger fw-bold">'.$data['folio'].'</td>
        </tr>

        <tr>
            <td class="col-sm-1 fw-bold"> HORA:  </td>
            <td class="col-sm-2">'.$data['hora'].'</td>
            <td class="col-sm-4"></td>
            <td class="col-sm-1 fw-bold">ESTADO: </td>
            <td class="col-sm-3 text-end">  '. estado_ticket($data['id_tipo']).' </td>
        </tr>
      
    </table>
    
    </div>

      <div style="font-size:.86em;" class="row mt-2">
      
      <div class="col-6">
      <label class="fw-bold"> Productos:</label>  '.$data['NoProductos'].'
      </div>
      
      <div class="col-6 text-end">
       <label class="fw-bold">  Total: </label>
       <span id="txtTotal">'.$data['total'].'</span>
       </div>
      </div>
    
   ' ;

    return $div;
}

function estado($opc){
  $lbl_status = '';

  switch($opc){

    case 1:
          $lbl_status = '<i class="text-success  icon-thumbs-up">Pendiente </i> ';
    break;

    case 2:
        $lbl_status   = '<i class="text-success  icon-ok-circle"> Terminado  </i> ';
    break;

  }

  return $lbl_status;
}

function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}
function evaluar2($val){
    return $val ? number_format($val, 2, '.', ','): '-';
}

#----------------------
# Complementos
#----------------------
function formatSpanishDate($fecha = null) {
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    $formatoFecha = "%A, %d de %B del %Y"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}

function Folio($Folio, $Area) {
    $Folio = (int)$Folio; // Convertir a entero por si acaso

    // Asegurarse de que el folio tenga al menos 4 dígitos
    $Folio = str_pad($Folio, 4, '0', STR_PAD_LEFT);

    $NewFolio = $Area .'-'. $Folio;
    return $NewFolio;
}

function select_turno($txt){
  $rp = '';

  switch($txt){
    
    case 1: 
      $rp    = 'MATUTINO';
    break;

    case 2: 
      $rp    = 'VESPERTINO';
    break;

     case 3: 
      $rp    = 'UNICO';
    break;


  }
 

  return $rp;

}


function estado_ticket($estado){
    $rp = '';
    switch ($estado) {
        case 0:
            $rp = '<i class="text-warning icon-warning-1"></i>  Pendiente';
            break;

        case 1:
            $rp = '<i class="text-success icon-ok-circled"></i>  Terminado';

            break;


    }
    return $rp;
}


#----------------------
# Enpaquetar
#----------------------
 echo json_encode($encode);
  
