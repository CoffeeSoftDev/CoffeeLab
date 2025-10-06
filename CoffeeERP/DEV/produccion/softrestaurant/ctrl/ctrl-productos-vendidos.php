<?php

if(empty($_POST['opc'])){
 exit(0);
}

require_once('../mdl/mdl-productos-vendidos.php');
$obj =  new Productosvendidos;
$fz  =  new __LineaProduccion;

require_once('../mdl/aux-costo-potencial.php');
$aux =  new aux_cp;

require_once ('../../../conf/_Utileria.php');


$encode = [];

switch ($_POST['opc']) {

    case 'listUDN':
    $encode = $obj->lsUDN();
    break;

    case 'desplazamiento':
        $th     = ['Producto','LINK SOFT','Costo','Desplazamiento','Desplazamiento Costsys'];
        $encode = list_($obj, $th);
    break;

    case 'soft-restaurant':
        $th   = ['Producto','LINK COSTSYS','Precio','Desplazamiento','Desplazamiento Costsys'];
        $encode = soft_productos_vendidos($obj, $th);
    break;

    case 'fogaza-desplazamiento':
        $encode = fz_productos_vendidos($fz);
    break;

    case 'subir-costo-potencial':
        $encode =  subir_costo_potencial($fz,$obj,$aux);
    break;

    case 'dias-pendientes':
        $encode = lsDiasPendientes($obj);
    break;

    case 'lsGrupo':
      $encode = lsGrupo($obj);
    break;
}

# ===========================
#  Costsys
# ===========================

function lsGrupo($obj)
{
    # Declarar variables
    $__row = [];
    $total = 0;


   $list = $obj->list_grupo_recetas([$_POST['UDN']]);
   

//     $total = count($list);

    foreach ($list as $_key) {


        $ls  = $obj->select_list_grupo_sn([$_key['id']]);

        foreach ($ls as $key) {

            $atributos[] = [
                "fn"        => 'fn_costsys',
                "color"     => 'bg-primary',
                "url_image" => '',
                "disabled"  => ''
            ];

            // $total = $total + $total_productos;

            $__row[] = array(
                'id'     => $key['idSubClasificacion'],
                'nombre' => $key['nombre'],
                'costo'  => 0,
                'atrr'   => $atributos,
                "opc"    => 0
            );

            
        }
      

       



    } // end lista de folios



    return [
        "thead" => '',
        "row" => $__row,
        "Productos" => $total
    ];

//     return $encode;
}


# ===========================
#  Contar fechas pendientes   
# ===========================
function lsDiasPendientes($obj){

    $__row   = [];
    $th      = ['Fecha','Folio','Reporte de ventas','Reporte de productos','Rpt Cheque Promedio','Rpt Desplazamiento'];

    # -- variables para fechas
    $fi  = new DateTime($_POST['Anio'].'-'.$_POST['Mes'].'-01');
    $hoy = new DateTime();

    $contar_dias_ventas   = 0;
    $contar_dias_promedio = 0;

    while ($fi<= $hoy) {

        $fecha   = $fi->format('Y-m-d');
        $fb      = $fi->format('d-m-Y');
        $lsFolio = $obj->existe_folio([$fecha, $_POST['UDN']]);
        $folio   = '';  

        $monto_productos_vendidos = 0;
        $monto_ventas_dia         = 0;
        $file_productos_vendidos  = '';
        $file_ventas_dia          = '';

        foreach ($lsFolio as $key) {

          $folio                    = $key['id_folio'];
          $monto_productos_vendidos = $key['monto_productos_vendidos'];
          $monto_ventas_dia         = $key['monto_ventas_dia'];
          $file_productos_vendidos  = $key['file_productos_vendidos'];
          $file_ventas_dia          = $key['file_ventas_dia'];
        
        }

        $pintar = 0;

        if($monto_productos_vendidos == 0){
            $contar_dias_ventas++;
            $pintar = 1;

        }

        if($monto_ventas_dia == 0){
            $contar_dias_promedio++;
            $pintar = 1;

        }

        $f = formatSpanishDate( $fecha );
        $__row[] = array(
            'id'  => '',
            'f'   => $f,
            't'   => $folio,
            'r'   => evaluar($monto_productos_vendidos),
            'rp'  => evaluar($monto_ventas_dia),
            'ff'  => status_($file_ventas_dia),
            'fff' => status_($file_productos_vendidos),
            "opc" => $pintar
        );

      $fi->modify('+1 day');
    
    }

    // Encapsular arreglos
    $encode = [
        "thead" => $th,
        "row" => $__row,
        "dias" =>$contar_dias_promedio
    ];

    return $encode;
}

function subir_costo_potencial($fz,$obj,$aux){
    $util    = new Utileria;
    $CP      = new CostoPotencial;
    $calculo = new aux_cp;

    # Declarar variables

    $year   = '2024';
    $mes    = $_POST['Mes'];
    $UDN    = $_POST['UDN'];
    $area   = $_POST['Categoria'];

    $clasificacion = $_POST['clasificacion'];
    
    $__row            = [];
    $_rowNotFound     = [];
    $lsCostoPotencial = [];
    $data_recetas_cp  = [];
    
       
    # Buscamos si existe el costo potencial 

    $lsCostoPotencial        = $fz ->GetCostoPotencial([$mes,$year,$UDN]);
    $tablero_costo_potencial = false;
     

    if(count($lsCostoPotencial)): // Existe costo potencial : actualiza desplazamiento

        
        if($UDN == 6):

            $fecha     = $year.'-'.$mes.'-01';
            $date      = date('Y-m-d', strtotime($fecha));

            $lsProductosVendidos = $CP ->Productos_vendidos([$mes, $year , $clasificacion ]);
            // $lsProductosVendidos = $CP ->getListVentas([$mes, $year , $clasificacion ]);

            
            foreach ($lsProductosVendidos as $key) {

                $nombre_cost  = '';
                $costo        = 0;
                $contador     = 0;
                $verificar    = false;
                $desplazamiento = $key['CANT'];
                
                // -- data receta --
                $idCostsys    = 0;
                $idReceta     = null;
                $iva         = 0;
                $ieps        = 0;
                $pVenta      = 0;
                $rendimiento = 0;

                // if($desplazamiento != 0):
                
                
                    $list_costsys = $CP-> _CONSULTA_COSTSYS(array($key['idAlmacen']));
                    
                    foreach($list_costsys as $_key){
                        $verificar    = true;
                        
                        $idCostsys    = $_key['id_Costsys'];
                        $nombre_cost .= '<span class="text-muted" style="font-size:.678rem;">'.$_key['nombre'].'</span>';
                        $costo        = $_key['precioVenta'];
                        $contador     = 1;

                        $idReceta    = $_key['idReceta'];
                        $iva         = $_key['iva'];
                        $ieps        = $_key['ieps'];
                        $pVenta      = $_key['precioVenta'];
                        $rendimiento = $_key['rendimiento'];

                    }


                    if($verificar): // Encontro resultado , agregar a costo potencial
                        
                                   
                    // Realizar el calculo de costo Potencial:

                        $costoPotencial = $CP  ->calculoCostoPotencial([
                            'idReceta'        => $idReceta,
                            'precioPropuesto' => '0',
                            'iva'             => $iva,
                            'ieps'            => $ieps,
                            'pVenta'          => $pVenta,
                            'rendimiento'     => $rendimiento,
                            'desplazamiento'  => $desplazamiento,

                        ], $calculo);
                    

                            # ------- [ actualizar desplazamiento ] ------- #
                            if($_POST['subir']){

                                $update_data =[
                                    'desplazamiento'     => $desplazamiento,
                                    'costo'              => $costoPotencial['costo'],
                                    'costo_porc'         => $costoPotencial['porcentajeCosto'],
                                    'margencontribucion' => $costoPotencial['mc'],
                                    'ventasestimadas'    => $costoPotencial['ventasEstimadas'],
                                    'costoestimado'      => $costoPotencial['costoEstimado'],
                                    'mc_estimado'        => $costoPotencial['mcEstimado'],
                                    'receta'             => $idReceta,
                                    'fecha_costo'        => $date
                                ];

                                $update = $util->sql($update_data,2);

                                $ok = $CP->setCostoPotencial($update);
                            }    
                       
                            if (!$ok)
                             $ok = '<strong class="text-danger">Error</strong>';


                    # -- list de productos vendidos --

                                $__row[] = array(
                                    'id'                 => $key['idAlmacen'],
                                    'fecha'             => $date,
                                    'producto'           => $key['NombreProducto'],
                                    // 'idReceta'           => $idReceta,
                                    'link'               => $nombre_cost,
                                    'desplazamiento'     => $desplazamiento,
                                    
                                    'pVenta'             => evaluar($pVenta),
                                    // 'pVenta Sin iva'     => evaluar($costoPotencial['pVentaIVA']),
                                    // 'iva'                => $iva,
                                    // 'costo'              => $costoPotencial['costo'],
                                    // 'costo_porc'         => evaluar3($costoPotencial['porcentajeCosto']),
                                    // 'margencontribucion' => evaluar($costoPotencial['mc']),
                                    'ventasestimadas'    => evaluar($costoPotencial['ventasEstimadas']),
                                    // 'costoestimado'      => evaluar($costoPotencial['costoEstimado']),
                                    // 'mc_estimado'        => evaluar($costoPotencial['mcEstimado']),
                                    'Cargar despl.' => $_POST['subir'],
                                    'ok'                 => $ok,
                                    'opc'                => 0
                                );


                
                    else: // No encontro enlace crear objeto not Found

                            $_rowNotFound[] = array(
                                'id'             => $key['id_Producto'],
                                'Producto'       => $key['NombreProducto'],
                                'grupo'          => '',
                                'desplazamiento' => $desplazamiento,
                                'Estado'         => status_costoPotencial($verificar),
                                'opc'            => 0
                            );

                    endif;



                // endif;   
                            
                            


                  



                                

                            
                


            }// end foreach
            
            

        else: // pertenece a otra unidad de negocio   
        
            $tablero_costo_potencial = true;
            $ls        = $obj ->select_list_grupo([$UDN]);

                foreach($ls as $group){


                    $lsProducto = $obj ->SELECT_PRODUCTOS_x_SOFT([$UDN,$group['idgrupo']]);

                    foreach($lsProducto as $key){ 

                        #Obtener el enlace con el soft y el costsys 
                        $list_costsys = $obj-> Enlace_Costsys(array($key['id_Producto']));
                        $nombre_cost  = '<span class="text-danger">No encontrado </span>';
                        $verificar    = false;
         
                        foreach($list_costsys as $_key){
                            $idCostsys       = $_key['id_costsys_recetas'];
                            $nombre_cost     = $_key['nombre'];
                            $costo           = $_key['precioVenta'];
                            $idClasificacion = $_key['id_Clasificacion'];
                            $verificar       = true;
                            $bg              = 0;

                            $idReceta    = $_key['idReceta'];
                            $iva         = $_key['iva'];
                            $ieps        = $_key['ieps'];
                            $pVenta      = $_key['precioVenta'];
                            $rendimiento = $_key['rendimiento'];
                        }


                        /*-- Separar recetas encontradas  --*/ 
                        $CANT_MES       = $obj-> _GET_CANT_X_MES([$mes,$year,$key['id_Producto']]);
                        $desplazamiento = $CANT_MES['total'];


                        if($verificar): // Agregar a costo Potencial

                        $costoPotencial = $CP->calculoCostoPotencial([
                            'idReceta'        => $idReceta,
                            'precioPropuesto' => '0',
                            'iva'             => $iva,
                            'ieps'            => $ieps,
                            'pVenta'          => $pVenta,
                            'rendimiento'     => $rendimiento,
                            'desplazamiento'  => $desplazamiento,

                        ], $calculo);



                            $fecha     = $year.'-'.$mes.'-01';
                            $date      = date('Y-m-d', strtotime($fecha));    


                                # ------- [ actualizar desplazamiento ] ------- #


                        $update_data = [
                            'desplazamiento'     => $desplazamiento,
                            'costo'              => $costoPotencial['costo'],
                            'costo_porc'         => $costoPotencial['porcentajeCosto'],
                            'margencontribucion' => $costoPotencial['mc'],
                            'ventasestimadas'    => $costoPotencial['ventasEstimadas'],
                            'costoestimado'      => $costoPotencial['costoEstimado'],
                            'mc_estimado'        => $costoPotencial['mcEstimado'],
                            'receta'             => $idReceta,
                            'fecha_costo'        => $date
                        ];

                            $update = $util->sql($update_data,2);

                            $ok = $fz->update_costo_potencial($update);


                            if(!$ok)
                            $ok ='<strong class="text-danger">Error</strong>';



                            if($desplazamiento != 0):

                            // if($group['idgrupo'] == 14):    
                              

                            $__row[] = array(
                                'id'                 => $key['id_Producto'],
                                'fecha'              => $date,
                                'idReceta'           => $idReceta,
                                'grupo'              => $group['grupoproductos'],
                                'producto'           => $key['producto'],
                                // 'clasificacion'      => $idClasificacion,
                                'desplazamiento'     => $desplazamiento,

                                'pVenta'             => evaluar($pVenta),

                                // 'costo'              => $costoPotencial['costo'],
                                // 'costo_porc'         => evaluar3($costoPotencial['porcentajeCosto']),

                                // 'pVenta Sin iva'     => evaluar($costoPotencial['pVentaIVA']),
                                // 'iva'                => $iva,
                                // 'margencontribucion' => evaluar($costoPotencial['mc']),
                                // 'ventasestimadas'    => evaluar($costoPotencial['ventasEstimadas']),
                                // 'costoestimado'      => evaluar($costoPotencial['costoEstimado']),
                                // 'mc_estimado'        => evaluar($costoPotencial['mcEstimado']),
                                'ok' => $ok,
                                'opc' => 0
                            );
                            endif;

                        else:    




                            if($desplazamiento != 0)
                        // _rowNotFound

                            $_rowNotFound[] = array(
                                'id'             => $key['id_Producto'],
                                'Producto'       => $key['producto'],
                                'grupo'          => $group['grupoproductos'],
                                'desplazamiento' => evaluar2($desplazamiento),
                                'Estado'         => status_costoPotencial($verificar),
                                'opc'            => 0
                            );

                        endif; 
                    }
                }// end foreach group
            
            
        endif;

    else:// Crea el costo potencial


            $fecha     = $year.'-'.$mes.'-01';
            $date      = date('Y-m-d', strtotime($fecha));
            $lsRecetas = $fz->lsRecetas([$UDN]);


            # Creamos el tablero de costo potencial

            foreach ($lsRecetas as $key) :

                $sub    = $fz->GET_SUB([$key['id_Subclasificacion']]);
                // $receta = $aux->  totalReceta($key['idReceta']);


                if($sub != 'DESCONTINUADO' && $sub != 'DESCONTINUADOS'):


                    $data = [

                        'idE'              => $UDN,
                        'fecha_costo'      => $date,
                        'id_Clasificacion' => $key['id_Clasificacion'],
                        'receta'        => $key['idReceta'],
                        'precioventa'      => $key['pventa'],
                        'iva'              => $key['iva'],
                        'ieps'             => $key['ieps'],
                        // 'rendimiento'      => $key['rendimiento']

                    ];


                    $paq = $util->sql($data);
                    $ok  = $fz ->add_costo_potencial($paq);


                    $__row[] = array(

                        'id'            => $UDN,
                        'fecha_costo'   => $date,
                        'clasificacion' => $key['clasificacion'],
                        'receta'        => $key['receta'],
                        'precioventa'   => $key['pventa'],
                        'iva'           => $key['iva'],
                        'ieps'          => $key['ieps'],
                        'rendimiento'   => $key['rendimiento'],
                        'ok'            => $ok,
                        'opc'           => 0
                    );




                endif;    






            endforeach;
    
    endif;




    
    $data = [
        "thead" =>['SUBRECETA','ESTADO','CANTIDAD','OPC'],
        "row"   => $_rowNotFound,
    ];

    // // lsCostoPotencial
    //  $dataCP = [
    //     "thead" => [],
    //     "row"   => $lsCostoPotencial,
    // ];


    // Encapsular arreglos

    $tabla_no_subidos = [
        "thead" => '',
        "row"   => $_rowNotFound,
        'total' => count($_rowNotFound)
    ];

    return [

        "thead"       => '',
        "row"         => $__row,
        'frm_head'    => $_head,
        'total'       => count($__row),

        'notFound'    => $tabla_no_subidos,

        'existeCosto' =>$lsCostoPotencial


        // "existe"      => $existe,
        // // "lsCP"        => $dataCP,
        // "ls"          => $$existe,
        // "arreglo"     => $data,
        // "title"       => $titulo,
    ];


}

function fz_productos_vendidos($obj){ 
    # Declarar variables
    $mes    = $_POST['Mes'];
    $year   = $_POST['Anio'];
    $UDN    = $_POST['UDN'];
    $area   = $_POST['Categoria'];
    $report = $_POST['Reporte'];

    if ($report == 1) {
        $list = $obj ->Productos_vendidos([$mes,$year,$area]);
    
    } else {
        $list = $obj ->Productos_vendidos_desgloze([$mes,$year,$area]);
    }

    $t = count($list);
    $__row = [];
      $lsNombres = 'x';

    foreach ($list as $key) {
        $list_costsys = $obj-> _CONSULTA_COSTSYS(array($key['idAlmacen']));
        $nombre_cost  = '<span class="text-danger"> Verificar </span>';
        $costo        = 0;
        $idCostsys    = 0;
        $contador     = 0;

        foreach($list_costsys as $_key){
            $idCostsys   = $_key['id_Costsys'];
            $nombre_cost = '<span >'.$_key['nombre'].'</span>';
            $costo       = $_key['precioVenta'];
            $contador    = 1;
        }

        if ($contador == 0) {
            $lsNombres .= $key['NombreProducto'].'<br>';
        }

        # buscar por tipo de reporte 
        $cant = 0;
        if ($report == 1) {
            $cant = $key['CANT'];
        }else{
            $cant =  $obj-> get( [$mes,$year,$area, $key['id_productos']]);
        } 
        // $bg = '';
        // if($key['costo'] != $costo){
        //     $bg = '<span class="text-danger fw-bold"> REVISAR CONCHI !</span>';
        // }
  
        $desplazamiento_costsys = $obj->get_desplazamiento([$mes,$year,$idCostsys,$UDN]);


         $__row[] = array(
            'id'             => $key['idAlmacen'],
            'Producto'       => '<span class="text-uppercase">'.$key['NombreProducto'].'</span>',
            "Costsys"        => $nombre_cost,
            "Precio"         => evaluar($costo),
            'Desplazamiento' => evaluar2($cant),
            "opc"            => 0
            // "dess"  => evaluar2($desplazamiento_costsys),
        );

        

    }// end lista de folios

//    $th     = ['Productos de Fogaza ('.$t.')','NOMBRE EN COSTSYS','Precio','Desplazamiento','Costo Potencial'];
  
     // Encapsular arreglos
    $encode = [

        "thead" => '',
        "row"   => $__row
    ];

    return $encode;

     
}
function soft_productos_vendidos($obj,$th){
    # Declarar variables
    $mes   = $_POST['Mes'];
    $year  = $_POST['Anio'];
    $UDN   = $_POST['UDN'];
    $list  = $obj ->select_list_grupo([$UDN]);
    $__row = [];

    foreach ($list as $_key) {

        $list_producto = $obj ->SELECT_PRODUCTOS_x_SOFT([$UDN,$_key['idgrupo']]);
        $ls            = count($list_producto);

        $__row[] = array(
            'id'    => $_key['idgrupo'],
            'Producto'  => '<i class="icon icon-right-open"></i>'.$_key['grupoproductos'],
            "Enlace"  => '',
            "costo" => '',
            "desplazamiento"   => '',
            "desplazamiento costsys"  => '',
            "Estado"   => "",
            "opc"   => 1
        );

         
        foreach ($list_producto as $key) {

            #Obtener el enlace con el soft y el costsys 

            $list_costsys = $obj-> Enlace_Costsys(array($key['id_Producto']));
            $nombre_cost  = '<span class="text-danger"> Verificar </span>';
            $idCostsys    = 0;

            foreach($list_costsys as $_keyx){
            $idCostsys   = $_keyx['id_costsys_recetas'];
            $nombre_cost = '<span >'.$_keyx['nombre'].'</span>';
            }


            
            $CANT_MES  = $obj-> _GET_CANT_X_MES([$mes,$year,$key['id_Producto']]);

            if($_POST['Reporte'] == 1){
            $rpt = $CANT_MES['total'];   
            }else{
            $rpt = $CANT_MES['lbl'];
            }
           
            $desplazamiento_costsys = $obj->get_desplazamiento([
                $mes,
                $year,
                $UDN,
                $idCostsys
                ]);
            
            // Encontrar diferencia de desplazamiento:
            $lbl = '<i class ="text-success icon-flag"></i>'; 


            if($rpt != $desplazamiento_costsys){
                $lbl = '<i class ="text-danger icon-flag"></i>';
            }
            
            if($rpt !=0)
            


            $__row[] = array(
                'id'    => $_key['idgrupo'],
                'Producto'  => '<span title="'.$key['id_Producto'].'">'.$key['producto'].'</span>',
                "Enlace"  => $nombre_cost,
                "costo" => evaluar($key['costo']),
                "Cant"   => $rpt,
                "Desplazamiento"  => $desplazamiento_costsys,
                'flag'  => $lbl,
                "opc"   => 0
            );

        }

    }// end lista de folios

    // Encapsular arreglos
    return [
        "thead" => '',
        "row" => $__row
    ];

   
}

function list_($obj,$th){
    # Declarar variables
    $__row = [];
    // // $fi    = $_POST['fi'];
    // // $ff    = $_POST['ff'];

    $mes   = $_POST['Mes'];
    $year  = 2024;
    
    // $UDN   = $_POST['UDN'];
    // $list  = $obj->list_grupo_recetas([$UDN]);
    
    // foreach ($list as $_key) {

        $RECETAS_COSTSYS = $obj->list_productos([$_POST['id']]);
    //     $total_productos = count($RECETAS_COSTSYS);
        
    //     $__row[] = array(
    //         'id'   => $_key['id'],
    //         'name' => '<span style="color:white">'.$_key['name'].' ('.$total_productos.')</span>',
            
    //         'c'    => '',
    //         'cff'  => '',
    //         'cf'   => '',
    //         'asf'   => '',
    //         "opc"  => 1
    //     );

    //     # lista de productos de RECETAS COSTSYS
        foreach ($RECETAS_COSTSYS as $COSTSYS) {
            
                $erp_productos  = $obj -> select_softrestaurant_costsys([$COSTSYS['idReceta']]);    

                $lbl      = '<span class="text-danger">No encontrado </span>';
                $id       = '';
            
                foreach($erp_productos as $erp){
                
                    $lbl     = $erp['descripcion'];
                    $id      = $erp['id_soft_productos'];
                
                }

    //             // $cant    =  $obj->get_cantidad([$fi,$ff,$id]);
                
                $CANT_MES    =  $obj->_GET_CANT_X_MES([$mes,$year,$id]);

    //             $rpt = '';

    //             if($_POST['Reporte'] == 1){
                  $rpt = $CANT_MES['total'];   
    //             }else{
                //   $rpt = $CANT_MES['lbl'];
    //             }
                

    //             //  $costo_potencial_desplazamiento = $obj->costo_potencial([$_key[0],9,2023]);

    //             $costo_potencial_desplazamiento = 0;

                $__row[] = array(

                    'id'       => $COSTSYS['id'],
                

                    'nombre'   => ''.$COSTSYS['nombre'].'',
                    'link'     => $lbl,
                    'costo'    => evaluar($COSTSYS['precioVenta']),
                    'desplazamiento'      => $rpt,
   
    //                 'descos'   => $costo_potencial_desplazamiento,
                    "opc"      => 0

                ); 

        }


    // }// end lista de folios

    $frm = ticket_head_breadcumbs(["Categoria" => $_POST['id'], "id" => $_POST['id'], "UDN" => $_POST['UDN']]); 

   
    // Encapsular arreglos
    return [
        "frm_head" => $frm,
        "thead"    => '',
        "row"      => $__row
    ];

  
}

function ticket_head_breadcumbs($data)
{

    return "
    <div class='row'>
        <div class='col-sm-12 mt-3'>

        <nav aria-label='breadcrumb'>
            <ol class='breadcrumb'>
        
            <li onclick='CostSys()' class='breadcrumb-item  text-muted pointer'>
            <i class='icon-left-circle'></i> Regresar </li>
            <li onclick='fn_costsys({$data['id']})' class='pointer breadcrumb-item fw-bold active'> {$data['Categoria']}</li>
            </ol>
        </nav>
        
        </div>
    </div>

    ";
}

echo json_encode($encode);


// --- Funciones de apoyo ---
function status_($opc){
  $lbl_status = '';
  switch($opc){

    case 1:
          $lbl_status = '<i class="text-success icon-thumbs-up"></i> Se subio correctamente ';
    break;

    case 2:
    default:
        $lbl_status = '<i class="text-warning  icon-warning-1"></i> Pendiente por subir';
    break;

  }

  return $lbl_status;
}

function status_costoPotencial($opc){
  $lbl_status = '';
  switch($opc){

    case 1:
          $lbl_status = '<i class="text-success icon-ok-circled2-1"></i> ';
    break;

    case 2:
    default:
        $lbl_status = '<i class="text-warning  icon-warning-1"></i> Revisar Receta';
    break;

  }

  return $lbl_status;
}

function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

function evaluar3($val)
{
    return $val ?  number_format($val, 2, '.', ','). ' %' : '-';
}

function evaluar2($val){
    return $val ? '' .$val : '-';
}




function formatSpanishDate($fecha = null) {
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    $formatoFecha = " %d de %B de %Y"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}

?>