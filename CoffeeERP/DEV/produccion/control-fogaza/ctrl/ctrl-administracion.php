<?php
if(empty($_POST['opc'])){
exit(0);
}

require_once('../mdl/mdl-administracion.php');
$obj = new Administracion;

$encode = [];
switch ($_POST['opc']) {

    case 'lsCategoria':

        $encode = $obj->lsCategoria();
    break;

    case 'tabla':

        $fi   = $_POST['fi'];
        $ff   = $_POST['ff'];

        $f_i  = strtotime($fi);
        $f_f  = strtotime($ff);

        $th[] = ['Productos'];
        $tx[] = ['REPORTE'];
  
        for($i=$f_i; $i<=$f_f; $i+=86400) {
            $date = date("Y-m-d", $i);
            $f    = formatSpanishDate($date);
            $tx[] = [$f];

            ($_POST['Reporte'] == 1) ? $th[] = 'Prop Gerente' : $th[] = 'Prod. Real';

            ;
            $th[] = 'Prod. panadero ';
            $th[] = '%';
            // $th[] = 'Propuesta gerente ';
        } 
   
        $_row = list_($obj,[]);

        $encode = array(
            'thead'   => $th,
            'colspan' => $tx,
            'row'     => $_row
        );

    break;

}

function list_($obj,$th){
    # Declarar variables
    $fi      = $_POST['fi'];
    $ff      = $_POST['ff'];
    $arreglo = [$fi,$ff];
    
    $__row     = [];
    $categoria = $_POST['Categoria'];
    $Reporte   = $_POST['Reporte'];
      
   # Sustituir por consulta a la base de datos
   $ls     = $obj ->SELECT_PRODUCTOS_x_COSTSYS([6, $categoria]);
   $contar = count($ls);

    foreach ($ls as $_key) {
        $SubClasificacion = $obj->GET_SUB([$_key['id_SubClasificacion']]);

        if($SubClasificacion != 'DESCONTINUADO'){
        // # -- 
        $link             = $obj->_PRODUCTOS_FOGAZA_LINK_COSTSYS_ORDER([$_key['idReceta']]);
        $id_almacen       = '';
        $f_i              = strtotime($fi);
        $f_f              = strtotime($ff);

        $td  = [];
        $row = [];


        $gerente = '';
        
        foreach ($link as $_list) {
            // $estado_link = 1;
            $id_almacen = $_list['idAlmacen'];
            // $nombre_producto = $_list[1];
            $gerente = $_list['sugerencia'];
            // $dias_merma = $_list['diasMerma'];
            // $dia_consulta = $_list[6];
        }


        for($i=$f_i; $i<=$f_f; $i+=86400) {

            // -- Consulta de productos por dia --  
            $date       = date("Y-m-d", $i);
            $ls         = $obj->_REAL(array($date, $id_almacen));



             
             





            # -- Columnas de comparacion de productos -- 

            if($Reporte == 1 ){ // Sugerencia del gerente
                $td['x2_'.$i] = '<div class="bg-aliceblue" >'.evaluar($gerente).'</div>';
            

                $prod_vs_real = (( $gerente  / $ls['sug'] )) * 100  ;
                $porc         = ($prod_vs_real == 100) ? $prod_vs_real : number_format($prod_vs_real, 2);

                $porcentaje   =  '<small><strong>'.$porc.' % </strong> </small> ';
                
                if($ls['sug'] == 0){
                    $porcentaje = '<i class="text-warning icon-attention-3"></i>  '; 
                }




            }else if ($Reporte == 2){ // Produccion real
                $td['x2_'.$i] = '<div class="bg-aliceblue" >'.evaluar($ls['real']).'</div>';

                $prod_vs_real = (( $ls['real']  / $ls['sug'] )) * 100  ;
                $porc = ($prod_vs_real == 100) ? $prod_vs_real : number_format($prod_vs_real, 2);
                $porcentaje  =  '<small><strong>'.$porc.' % </strong> </small> ';
                
                if($ls['sug'] == 0){
                    $porcentaje = '<i class="text-warning icon-attention-3"></i>  '; 
                }

            }
            
            $td['x1_'.$i] = '<div class="bg-aliceblue" > '.evaluar($ls['sug']).'</div>';




           
            // $td['x2_'.$i] = '<div class="bg-aliceblue" >'.evaluar($ls['real']).'</div>';
            
            
            
            $td['x_'.$i]  = '<div class="bg-default text-center" >'.$porcentaje.'</div>';
      
        }  
        
        $td['opc'] = 1;

        if($SubClasificacion != 'DESCONTINUADO'){
            $td['opc'] = 0;
        }
        
       $row  = array(
        'id'     => $_key['idReceta'],
        'nombre' =>  '<span class="text-uppercase"> '.$_key['nombre'].'</span>',
        // 'sub'    => $SubClasificacion

       );

        
        
        $__row[] = array_merge($row, $td);
    }
    }// end lista de folios

    return $__row;
}

function evaluar($val){
    return $val ? $val: '-';
}

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

echo json_encode($encode);
?>