<?php
if (empty($_POST['opc'])) {
    exit(0);
}

require_once('../mdl/mdl-gestion-de-archivos.php');
$obj = new GestionArchivos;

$encode = [];
switch ($_POST['opc']) {

    case 'initComponents':
        $lsUDN = $obj->udn_select();

        $encode = [
            'udn' =>$lsUDN
        ];
    break;

    case 'calendario':

        $th = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        $_row = [];

        $lunes     = obtener_fecha(2024, $_POST['Mes'], 1, $obj);
        $martes    = obtener_fecha(2024, $_POST['Mes'], 2, $obj);
        $miercoles = obtener_fecha(2024, $_POST['Mes'], 3, $obj);
        $jueves    = obtener_fecha(2024, $_POST['Mes'], 4, $obj);
        $viernes   = obtener_fecha(2024, $_POST['Mes'], 5, $obj);
        $sabado    = obtener_fecha(2024, $_POST['Mes'], 6, $obj);
        $domingo   = obtener_fecha(2024, $_POST['Mes'], 7, $obj);


        $__row[] = array(

            'l' => $lunes,
            'm' => $martes,
            'x' => $miercoles,
            'j' => $jueves,
            'v' => $viernes,
            's' => $sabado,
            'd' => $domingo,

            "opc" => 0
        );



        // Encapsular arreglos
        $encode = [
            "thead" => $th,
            "row" => $__row
        ];

    break;

    case 'visor':
        $th = ['area', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        $_row = [];

        # Sustituir por consulta a la base de datos
        $list = $obj->ls_area_soft([$_POST['UDN']]);


        foreach ($list as $_key) {
            $lunes = obtener_fecha(2024, $_POST['Mes'], 1);

            $__row[] = array(

                'l' => $lunes,
                'm' => $lunes,
                'x' => $lunes,
                'j' => $lunes,
                'v' => $lunes,
                's' => $lunes,
                'd' => $lunes,

                "opc" => 0
            );

        }

        // Encapsular arreglos
        $encode = [
            "thead" => $th,
            "row" => $__row
        ];
    break;

    case 'productos-nuevos-fogaza':

        
        $th   = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        $_row = [];

        $lunes     = crear_fechas(2024, $_POST['Mes'], 1, $obj);
        $martes    = crear_fechas(2024, $_POST['Mes'], 2, $obj);
        $miercoles = crear_fechas(2024, $_POST['Mes'], 3, $obj);
        $jueves    = crear_fechas(2024, $_POST['Mes'], 4, $obj);
        $viernes   = crear_fechas(2024, $_POST['Mes'], 5, $obj);
        $sabado    = crear_fechas(2024, $_POST['Mes'], 6, $obj);
        $domingo   = crear_fechas(2024, $_POST['Mes'], 7, $obj);

            $__row[] = array(
            'l'   => $lunes,
            'm'   => $martes,
            'x'   => $miercoles,
            'j'   => $jueves,
            'v'   => $viernes,
            's'   => $sabado,
            'd'   => $domingo,
            "opc" => 0
            );

        // Encapsular arreglos
        $encode = [
            "thead" => $th,
            "row" => $__row
        ];
    
    
    break;
    
    case 'calendario-php':
        // $month     = date("n")-1;

    $month     = $_POST['Mes'];
    $year      = date("Y");
    $diaActual = date("j");
    $diaSemana    = date("w", mktime(0, 0, 0, $month, 1, $year)) + 3;
    $ultimoDiaMes = date("d", (mktime(0, 0, 0, $month + 1, 1, $year) - 1));

    
    $td = '';
    $td .='<tr bgcolor="">';
    $last_cell = $diaSemana + $ultimoDiaMes;

    for ($i = 1; $i <= 35; $i++) {
             
        if ($i == $diaSemana) {
         $day = 1;
        }

        if ($i < $diaSemana || $i >= $last_cell) {

         $td .= "<td class='bg-secondary'> &nbsp; </td>";
        
        }else{

            $f          = $year.'-'.$month.'-'.$day;
            $fecha      = date("Y-m-d", strtotime($f));
            $list_folio = $obj-> existe_folio([$fecha,$_POST['UDN']]);

            $monto_productos_vendidos = 0;
            $monto_ventas_dia         = 0;
            $folio                    = '';
           
            foreach ($list_folio as $key) {
                $folio                    = $key['id_folio'];

                $file_status              = $key['monto_productos_vendidos'];
                $file_ventas              = $key['monto_ventas_dia'];

                $monto_productos_vendidos = evaluar($key['monto_productos_vendidos']);
                $monto_ventas_dia         = evaluar($key['monto_ventas_dia']);

            }


            // $check = status_check($file_status);
            // $check_ventas = status_check($file_ventas);

            if($file_status != ''){
              $check = status_check(1);
            }else{
              $check = status_check(0);   
            }

            if($file_ventas != ''){
                $check_ventas = status_check(1);
            }else{
                $check_ventas = status_check(0);
            }

            
            $td .= "<td class='col-1'>
             <div class='p-1 fecha pointer text-center' onclick='view()'>
                <div  class='bg-secondary text-center'>
                <i class='icon-calendar'></i> {$fecha} / {$folio} <br>
            </div>
            ";
           

            if($folio){

                $td .= "
                <div class=' row justify-content-start p-1'> 
                    <div class='col-12'><span style='font-size:.7rem; font-weight:500; '>  Desp {$check} ${monto_productos_vendidos}</div> 
                    <div class='col-12'><span style='font-size:.7rem; font-weight:500; '>  Cheq {$check_ventas} ${monto_ventas_dia}</div> 
                </div> 
                ";

            }


           $td .= " </div></td>";


    //  </span> <b> </b><br>
    //         <span style='font-size:.87rem; font-weight:500; '>  Cheque prom. {$check_ventas}   </span> <b>${monto_ventas_dia} </b><br>




            // if ($day == $diaActual)
              


            // else
            //     $td .= "
            //     <td>
            //     <div class='p-1 fecha pointer' onclick='view()'>
            //     <label class='fw-1'> <i class='icon-calendar'></i>  {$fecha}</label>
            //     <div class='justify-content-left p-0'> 
            //     <label class='p-0' style='font-size:.876em; font-weight:bold;'> a</label>
            //     </div>
            //     </div>
            //     </td>";
                $day++;
        }
            if ($i % 7 == 0) {
              $td .= "</tr> <tr>";
            }
    }
    
    
    $td .= '</tr>';


    $th   = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

    $table = '
    <table class="table table-bordered ">
    <tr class="">';
    for($x = 0; $x < count($th ); $x++){
      $table .= '<td>'.$th[$x].'</td>';
    }
    
      
    $table .='</tr>
    '.$td.'
    </table>
    ';

    $encode = [
    "table" => $table

    ];
    
    break;


    


}



echo json_encode($encode);




// -- Funciones --
function get_fecha(){

}



function crear_fechas($year, $month, $day, $obj){
    $mondays = [];
    $txt_dia = '';
    $udn     = $_POST['UDN'];

    $startDate = new DateTime("$year-$month-01");
    $endDate   = new DateTime("$year-$month-" . date('t', strtotime("$year-$month-01")));

    while ($startDate <= $endDate) {

        if ($startDate->format('N') == $day) { 

            $fecha     = $startDate->format('Y-m-d');
            $txt  = $obj-> get_nuevo_fogaza([$fecha]);
            
        //   '.$cantidad.'

            $txt_dia  .= " 

              <div class=' text-center fechax pointer' onclick='view()'>
              <label class='fw-1'> <i class='icon-calendar'></i> {$fecha} </label>

              <div class='justify-content-left p-0'> 
                <label class='p-0' style='font-size:.67em; font-weight:bold;'> {$txt}</label>
              </div>
              </div>
        ";
            
  
        }

        $startDate->add(new DateInterval('P1D')); // Avanzar un día
    }

    return $txt_dia;

}


function obtener_fecha($year, $month, $day, $obj)
{
    $mondays = [];
    $txt_dia = '';
    $udn = $_POST['UDN'];

    $startDate = new DateTime("$year-$month-01");
    $endDate = new DateTime("$year-$month-" . date('t', strtotime("$year-$month-01")));

    while ($startDate <= $endDate) {

        if ($startDate->format('N') == $day) { // 'N' devuelve el día de la semana (1 = lunes)
            $fecha = $startDate->format('Y-m-d');
            
            $list_folio   = $obj-> existe_folio([$fecha,$udn]);
            
            $monto_productos_vendidos = 0;
            $monto_ventas_dia = 0;
            foreach ($list_folio as $key) {
                $file_status = $key['file_productos_vendidos'];
                $file_ventas = $key['file_ventas_dia'];
                $monto_productos_vendidos = evaluar($key['monto_productos_vendidos']);
                $monto_ventas_dia = evaluar($key['monto_ventas_dia']);
                
            }
            
   
            $check = status_check($file_status);
            $check_ventas = status_check($file_ventas);


            $txt_dia .= "
           <div class='fecha pointer' onclick='view()'>
               <div  class='bg-secondary text-center'>
                    <i class='icon-calendar'></i> {$fecha} <br>
                </div>
                
                <div class='p-2'>  
                    <span style='font-size:.87rem; font-weight:500; '>  Desplazamiento {$check}   </span> <b> ${monto_productos_vendidos}</b><br>
                    <span style='font-size:.87rem; font-weight:500; '>  Cheque prom. {$check_ventas}   </span> <b>${monto_ventas_dia} </b><br>
                
                </div> 
            </div>
            ";
        }

        $startDate->add(new DateInterval('P1D')); // Avanzar un día
    }

    return $txt_dia;
}


function status_check($check)
{
    $lbl = '';

    switch ($check) {
        case "1":
            $lbl = '<i class="text-success  icon-ok-circled-1"></i>';
            break;

        default:
            $lbl = '<i class="text-danger  icon-cancel-circled"></i>';
            break;


    }

    return $lbl;
}


function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '$ 0.00';
}


?>