<?php

# Libreria.
require '../../produccion/softrestaurant/src/vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

require_once ('../mdl/mdl-app-soft-restaurant.php');
$obj = new SoftRestaurant;

require_once('../../conf/coffeSoft.php');


require_once('../../conf/_Utileria.php');
$util = new Utileria;

// Instancia del objeto
$kpi    = new KPI;


// # -- Variables --
$output           = '';
$Productos_Nuevos = '';
$UNIDAD_NEGOCIO   = $_POST['udn'];
$fechaActual      = date('Y-m-d H:i:s');
$hora_actual      = date("H:i:s");
$fecha_archivo    = $_POST['fecha_archivo'];
$data             = [$fecha_archivo, $UNIDAD_NEGOCIO];
$id_folio         = $obj->get_folio($data);

$success          = 0;


if ($id_folio == 0) {
    $ok_folio       = $obj->insert_folio($data);
    $id_folio = $obj->get_folio($data);
}

// # Recorrido por archivos -----------
foreach ($_FILES as $cont => $key) :

    if($key['error'] == UPLOAD_ERR_OK ){
        # Metadatos de excel
                $fichero              = $key['name'];
                $rutaArchivo          = $key['tmp_name'];
                $documento            = IOFactory::load($rutaArchivo);

                $hojaActual           = $documento->getSheet(0);
                
                $numeroMayorDeFila    = $hojaActual->getHighestRow();                                                            // Numérico
                $letraMayorDeColumna  = $hojaActual->getHighestColumn();                                                         // Letra
                $numeroMayorDeColumna = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($letraMayorDeColumna);
                
                # Separar metodos por nombre de archivos ---
                $file_array     = explode(".", $fichero);
                $nombre_archivo = preg_split('/[0-9]+/', $file_array[0]);


                switch ($nombre_archivo[0]) { //Recorrido por nombre de archivo 
                    
                    case 'productosvendidosperiodo':
                    case 'PRODUCTOSVENDIDOSPERIODO':

                        $subir_a_sistema = true;
                    
                        $inicio_fila     = 6;
                        $contador_grupo  = [];
                        $productosNuevos = [];
                        $grupoNuevo      = [];
                        
                        $total_gral      = 0;
                        $__row           = [];
                  
                        #Actualiza los indicadores de subida.
                        $update     = $obj->update_file_productos(array(1, $id_folio), 'productosvendidosperiodo');
                        $id_vendido = $obj->existe_folio(array($id_folio), "file_productos_vendidos");

                        // Elimina todos los registros de la base de datos.
                        if($UNIDAD_NEGOCIO != 5) {

                            if ($id_vendido == 1) {
                                $subir_a_sistema ? $obj->delete_data_row(array($id_folio)) : null;
                            }

                        }

                    

                        // Recorrer Libro de excel 
                        for ($filas=$inicio_fila ; $filas <= ($numeroMayorDeFila-1) ; $filas++) :

                                $clave         = $hojaActual->getCell('A' . $filas)->getValue();
                                $producto      = $hojaActual->getCell('B' . $filas)->getValue();
                                $cantidad      = $hojaActual->getCell('E' . $filas)->getValue();
                                $precio        = $hojaActual->getCell('D' . $filas)->getValue();
                                $precio_venta  = $hojaActual->getCell('J' . $filas)->getValue();
                                $venta_total   = $hojaActual->getCell('F' . $filas)->getValue();
                                $clasificacion = 0;
                                $porcentaje    = 0;
                                $costo         = $hojaActual->getCell('G' . $filas)->getValue();
                                $iva           = $hojaActual->getCell('M' . $filas)->getValue();
                                
                                $D                = $hojaActual -> getCell('C' . $filas)->getValue();       //grupo c
                                
                                $idCategoria      = $obj -> get_soft_grupoc([$D,$UNIDAD_NEGOCIO]);
                                $grupo_erp        = $obj -> get_soft_grupoproductos([$D,$UNIDAD_NEGOCIO]);
                                $idGrupoProductos = $grupo_erp[0]['idgrupo'];
                                

                                $idGrupoERP       = $grupo_erp[0]['id_grupo_erp'];

                                $idGrupoProductos_Actually     = '';    
                             
                                $estadoCategoria  = '';
                                $lbl              = '';
                                $opc              = 0;
                                

                                if($idCategoria == 0 ){
                                                                  
                                    if (!in_array($D, $grupoNuevo)) {  $grupoNuevo[]= $D;  }


                                    $request         = addCategoria(
                                        $obj,
                                        $util,
                                        [$UNIDAD_NEGOCIO,$D]);

                                    $dtx         = $util-> sql([

                                        'id_udn'         => $UNIDAD_NEGOCIO,
                                        'grupoproductos' => $D,
                                        'estatus'        => 1

                                    ]); 
                                    
                                    $grupoSoft   = $obj -> add_soft_grupoproctos($dtx);
                                    $idCategoria = $obj -> get_soft_grupoc([$D,$UNIDAD_NEGOCIO]);
                                    // $idGrupoProductos     = $obj -> get_soft_grupoproductos([$D,$UNIDAD_NEGOCIO]);

                                    $grupo_erp        = $obj -> get_soft_grupoproductos([$D,$UNIDAD_NEGOCIO]);
                                    $idGrupoProductos = $grupo_erp[0]['idgrupo'];
                                    $idGrupoERP       = $grupo_erp[0]['id_grupo_erp'];
                                    
                                    
                                    $estadoCategoria = $request['sql'];
                                    $opc             = 1;
                                

                                }


                                
                                switch ($clave) {
                                    case '801':
                                    case '802':
                                    case '803':
                                    case '804':
                                    case '805':
                                    case '806':
                                    case '807':
                                    case '808':
                                    case '809':
                                    
                                        $data = array($producto, $UNIDAD_NEGOCIO);
                                        $id_producto = $obj->get_paq_name($data);
                                    
                                    break;

                                    default:
                                        $busqueda = array($producto, $UNIDAD_NEGOCIO);
                                        $lsproducto = $obj->get_producto_name($busqueda);

                                        $results    = count($lsproducto);

                                        $class = '';

                                       
                                        if($results == 1){
                                            $id_producto  = $lsproducto[0]['id_Producto'];
                                            $idGrupoProductos_Actually = $lsproducto[0]['id_grupo_productos'];
                                            
                                        }elseif($results > 1){

                                              $getProducts  = $obj ->get_producto_by_name_group([$producto,$UNIDAD_NEGOCIO,$idGrupoProductos]);
                                              $id_producto  = $getProducts[0]['id_Producto'];
                                              $idGrupoProductos_Actually = $getProducts[0]['id_grupo_productos'];
                                          
                                              $class = 'bg-warning-1';
                                        } else{
                                            $id_producto   = 0;
                                        }       


                                        // $id_producto =

                                    break;

                                }
                                 
                                /*----------  [  Agregar productos nuevos  ]  --------*/

                                switch ($clave) {
                                     # DESGLOZE DE PAQUETES ** UNICAMENTE SONORAS MEAT **
                                    
                                    case '801':
                                    case '802':
                                    case '803':
                                    
                                    case '804':
                                    case '805':
                                    case '806':
                                    
                                    case '807':
                                    case '808':
                                    case '809':

                                        $opc = 2;

                                        $data_paq = [

                                            'clave'             => $clave,
                                            'id_paquete'        => $id_producto,
                                            'grupo'             => $idCategoria,
                                            'cantidad'          => $cantidad,
                                            'precioventa'       => $precio_venta,
                                            'ventatotal'        => $venta_total,
                                            'costo'             => $costo,
                                            'precio'            => $precio,
                                            'id_udn'            => $UNIDAD_NEGOCIO,
                                            'idFolioRestaurant' => $id_folio,
                                            'fecha_producto'    => $fechaActual

                                        ];

                                        $array_paq = $util->sql($data_paq);
                                        $obj->add_productos_paq($array_paq);      

                                    break;

                                    default: // No son paquetes.

                                        $ok = '';
                                        
                                        if($id_producto == 0): // crear nuevo producto

                                            $data_soft = array(
                                                $clave,
                                                $producto,
                                                $idCategoria,
                                                $UNIDAD_NEGOCIO,
                                                1,
                                                $costo,
                                                1,
                                                $idGrupoProductos
                                            );


                                            $sql_new_producto = $util -> sql([
                                                'clave_producto'   => $clave,
                                                'descripcion'      => $producto,
                                                // 'id_grupoc'        => $idCategoria,
                                                'id_udn'           => $UNIDAD_NEGOCIO,
                                                'status'           => 1,
                                                'costo'            => $costo,
                                                'activo_soft'      => 1,
                                                'fecha'            => $fechaActual, 
                                                'id_grupo_productos' => $idGrupoProductos
                                            ]);    

                
                                            $ok                = $subir_a_sistema ? $obj->crear_producto_soft($sql_new_producto)  : false;
                                            $productosNuevos[] = $producto;
                                         
                                                                                          
                                            /* PENDIENTE */ 
                                            
                                            $lbl = '<i class="text-danger fw-bold  icon-flag-2"></i>';


                                            // Despues de crear agregalo al sistema

                                            $busqueda    = array($producto, $UNIDAD_NEGOCIO);
                                            $lsproducto    = $obj->get_producto_name($busqueda);
                                            $id_producto = $lsproducto[0]['id_Producto'];

                                            $data = [
                                                'clave'             => $clave,
                                                
                                                'id_productos'      => $id_producto,
                                                'grupo'             => $idCategoria,
                                                'cantidad'          => $cantidad,

                                                'costo'             => $costo,
                                                'precioventa'       => $precio_venta,
                                                'precio'            => $precio,
                                                
                                                'id_udn'            => $UNIDAD_NEGOCIO,
                                                'ventatotal'        => $venta_total,
                                                'idFolioRestaurant' => $id_folio,

                                                'fecha_producto'    => $fechaActual


                                            ];

                                            $array = $util->sql($data);
                                            $ok    = $subir_a_sistema ? $obj->add_productosvendidos($array) : null;


                                        else: 

                                         #agregar productos al sistema  

                                            $data = [

                                                'clave'             => $clave,
                                                'id_productos'      => $id_producto,
                                                'grupo'             => $idCategoria,
                                                'cantidad'          => $cantidad,
                                                'costo'             => $costo,
                                                'precioventa'       => $precio_venta,
                                                'precio'            => $precio,
                                                'id_udn'            => $UNIDAD_NEGOCIO,
                                                'ventatotal'        => $venta_total,
                                                'idFolioRestaurant' => $id_folio,
                                                'fecha_producto'    => $fechaActual
                                            
                                            ];

                                            $array = $util->sql($data);
                                            $ok    = $subir_a_sistema ? $obj->add_productosvendidos($array) : null;

                               
                                        endif;

                                    break;    


                                }// endswitch


                            $total_gral  += $cantidad * $precio_venta; 


                            /*----------  [  Imprimir tabla de productos ]  --------*/ 
                            $flag = $idGrupoProductos_Actually != $idGrupoProductos ? 'bg-danger fw-bold' : '';

                            $__row[] = [

                                'id'           => $clave,
                                'clave'        => $clave,
                                'producto'     => $producto,
                                // 'id_producto'  => ['text' => $id_producto,'class'=> ' text-center '.$flag],
                                
                                // 'grupo'        => ['text' => $idGrupoProductos,'class' => 'text-soft fw-bold text-center'],
                                 'nombreGrupo'  => ['text' => $D, 'class' => 'text-soft fw-600'],

                                // 'grupo_actual' => $idGrupoProductos_Actually,
                                // 'venta_total'  => $venta_total,
                                'totally'      => $total_gral,
                                'cantidad'     => ['class'=> 'fw-bold text-center text-soft', 'html'=>$cantidad],
                                'opc'          => $opc
                                

                                //   'soft'         => $idGrupoProductos, 
                            ];

                  
                        endfor;

                        $obj_ventas = ['monto_productos_vendidos' => $total_gral, 'id_folio'  => $id_folio  ];

                        $array = $util->sql($obj_ventas, 1);

                        $ok = $obj-> update_monto_ventas_dia($array);
          
                        $tb = [ 'row' =>  $_row , 'thead' => ''];
                    break;


                    case 'ventas':
                    case 'VENTAS':

                        $flag  = 'Creado';

                        $__row = [];

                        $update     = $obj->update_file_productos(array(1, $id_folio), 'ventas');
                        $lsVentas   = $obj->ls_ventas([$id_folio]);

                
                        // #Elimina todos los registros de la base de datos
                        if ($lsVentas) {

                            $success = $obj->delete_data_row_ventas(array($id_folio));

                        }

                        $total_gral = 0;
                        $total_personas = 0;

                        for ($filas=2; $filas <= $numeroMayorDeFila  ; $filas++) {
                        


                            $clave        = $hojaActual->getCell('A' . $filas)->getValue();  //tipo_agrupacion
                            $area         = $hojaActual->getCell('B' . $filas)->getValue();
                            $alimentos    = $hojaActual->getCell('C' . $filas)->getValue();
                            $bebidas      = $hojaActual->getCell('D' . $filas)->getValue();
                            $otros        = $hojaActual->getCell('E' . $filas)->getValue();
                            $subtotal     = $hojaActual->getCell('F' . $filas)->getValue();
                            $iva          = $hojaActual->getCell('G' . $filas)->getValue();
                            $total        = $hojaActual->getCell('H' . $filas)->getValue();
                            $tiposervicio = $hojaActual->getCell('I' . $filas)->getValue();

                            $tipoventa = $hojaActual->getCell('J' . $filas)->getValue();
                            $personas  = $hojaActual->getCell('K' . $filas)->getValue();
                            $promedio  = $hojaActual->getCell('L' . $filas)->getValue();

                            $cuentas    = $hojaActual->getCell('M' . $filas)->getValue();
                            $porcentaje = $hojaActual->getCell('N' . $filas)->getValue();
                            $prod_vend  = $hojaActual->getCell('O' . $filas)->getValue();


                            $id_area = $obj->get_area(array($area, $UNIDAD_NEGOCIO));

                    

                            $dtx  = [

                                'id_area'           => $id_area,
                                'tipo_servicio'     => $tiposervicio,
                                // 'tipo_venta'        => $tipoventa,
                                // 'porcentaje'        => $porcentaje,
                                'alimentos'         => $alimentos,
                                'bebidas'           => $bebidas,
                                'otros'             => $otros,
                                'subtotal'          => $subtotal,
                                'iva'               => $iva,
                                'total'             => $total,
                                'personas'          => $personas,
                                'cuentas'           => $cuentas,
                                'productosvendidos' => $prod_vend,
                                'soft_folio'        => $id_folio,
                                'soft_ventas_fecha' => $fechaActual

                            ]; 




                            $data = $util->sql($dtx);

                            $ok = $obj->add_row_ventas($data);


                            $__row[] = [
                                'id'            => $clave,
                                'soft_folio'    => $id_folio,
                                
                                'id_area'       => $id_area,
                                'tipo_servicio' => $tiposervicio,
                                'tipo_venta'    => $tipoventa,
                                // 'porcentaje'    => evaluar($porcentaje,''),
                                // 'alimentos'     => evaluar($alimentos,''),

                                'bebidas'       => evaluar($bebidas,''),
                                'otros'         => evaluar($otros,''),
                                'personas'      => ['text'=>$personas ,'class' => 'bg-default text-center'],
                                
                                'subtotal'      => evaluar($subtotal,''),
                                'prod_vend'     => $prod_vend,
                                'ok'            => $ok,
                                'opc'           => 0
                            ];


                            $total_gral += $total;
                            $total_personas += $personas;



                        }// end for


                         $obj_ventas = [
                            'monto_ventas_dia' => $total_gral,
                            'id_folio'         => $id_folio
                        ];

                        $array = $util->sql($obj_ventas, 1);

                        $ok =    $obj-> update_monto_ventas_dia($array);



                


                    break;

                }    

        
    }

    $txt = $obj-> connected();
   
    $frm = ticket_head([
        'folio'  => $id_folio,
        'fecha'  => $fecha_archivo,
        'nuevos' => $txt
    ]);

    $frm_foot = ticket_footer([
        'total' => evaluar($total_gral)
    ]);

    $encode = [
        
        'thead' => '',
        
        'row'      => $__row,
        'frm_head' => $frm ,
        'frm_foot' => $frm_foot,

        'success'  => $success


    ];


endforeach;






function addCategoria($obj,$util,$array){

    $estadoCategoria = '<span class="text-danger fw-bold">Not found </span>';
    $opc             = 1;

    /* Agregar categoria a la base de datos */

    $array         = $util-> sql([

        'grupo'       => '',
        'id_soft_udn' => $array[0],
        'grupoc'      => $array[1],
        'status'      => 1

    ]);

    
    $query         = $obj -> add_soft_grupoc($array);
    

    return [

        'status'      => $estadoCategoria,
        'idCategoria' => $idCategoria,
        'opc'         => 2,
        'sql'         => $grupoSoft
     ];

}

function ticket_head($data){

    $btn_cerrar = '';
  
    $div = '
  
     <div class="table-responsive mb-3 mt-3" id="content-rpt">
     <table style="font-size:.76em; " class="tb table-bordered">
     
    <tr>
        <td class="col-sm-1 fw-bold">FECHA: </td>
        <td class="col-sm-2">' . $data['fecha'] . '</td>
        <td class="col-sm-1 fw-bold"> FOLIO:  </td>
        <td class="col-sm-2 text-right text-end text-danger fw-bold">' . $data['folio'] . '</td>
        <td class="col-sm-1 fw-bold"> Prod. Nuevos :  </td>
        <td class="col-sm-2 text-end">' . $data['nuevos'] . '</td>
    </tr>

     
      </table>
      </div>
    
   ';

    return $div;
}

function ticket_footer($data){
    return '
    <table style="font-size:.75em;" class="tb ">
          <tr>
            <td class="col-8">
                <label id="respuesta"> </label>
                <b>TOTAL </b>
            </td>
            <td > 
            <input disabled class="form-control text-end cell" value="' . $data['total'] . '" id="frm_txtTotalControl">
            </td>
          </tr>

         

        
    </table> ';



}


echo json_encode($encode);


// function evaluar($val)
// {
//     return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
// }


// function evaluar2($val){

//     return $val ? number_format($val, 2, '.', ',') : 0;
// }

// // $noti = new Notification();




