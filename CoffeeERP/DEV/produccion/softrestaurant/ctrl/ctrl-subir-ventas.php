<?php

# Libreria.
require '../src/vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

require_once('../mdl/mdl-soft-restaurant.php');
$obj = new __SoftRestaurant;


require_once('../../../conf/_Utileria.php');
$util = new Utileria;

# -- Variables --
$output           = '';
$Productos_Nuevos = '';
$UNIDAD_NEGOCIO   = $_POST['UDN'];
$fechaActual      = date('Y-m-d H:i:s');
$hora_actual      = date("H:i:s");

$fecha_archivo = $_POST['fecha_archivo'];

$data = [$fecha_archivo, $UNIDAD_NEGOCIO];

$id_folio = $obj->get_folio($data);

if ($id_folio == 0) {
    $ok_folio       = $obj->insert_folio($data);
    $id_folio = $obj->get_folio($data);
}

# Recorrido por archivos -----------
foreach ($_FILES as $cont => $key) {

        if($key['error'] == UPLOAD_ERR_OK ){
        # Metadatos de excel

                $fichero     = $key['name'];
                $rutaArchivo = $key['tmp_name'];
                $documento   = IOFactory::load($rutaArchivo);
                $hojaActual  = $documento->getSheet(0);

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
                    
                        $inicio_fila    = 6;
                        $contador_grupo = [];
                        $__row          = [];
                        $total_gral     = 0;

                        $contador_nuevos = [];

                        // Verificas si existe informacion almacenada en la base de datos

                            #Actualiza los indicadores de subida
                            $update     = $obj->update_file_productos(array(1, $id_folio), 'productosvendidosperiodo');
                            $id_vendido = $obj->existe_folio(array($id_folio), "file_productos_vendidos");

                            // #Elimina todos los registros de la base de datos
                            if ($id_vendido == 1) {

                            if($subir_a_sistema)    
                                $delete =   $obj->delete_data_row(array($id_folio));

                            }

                            $total_gral = 0;

                        // Recorrer Libro de excel 

                        for ($filas=$inicio_fila ; $filas <= ($numeroMayorDeFila-1) ; $filas++) {

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

                                # ** Nota : en baos el grupo esta en la columna C
                                $D                = $hojaActual->getCell('C' . $filas)->getValue();       //grupo c
                                $idCategoria      = $obj->get_soft_grupoc([$D,$UNIDAD_NEGOCIO]);
                                $idGrupoProductos = $obj->get_soft_grupoproductos([$D,$UNIDAD_NEGOCIO]);



                                $lbl = $idCategoria;

                                if($idCategoria == 0){
                                    $lbl = '<span class="text-danger fw-bold">Not found </span>';

                                    if (!in_array($D, $contador_grupo)) {
                                        $contador_grupo[]= $D;
                                    }

                                    /*Agregar categoria a la base de datos */

                                    $dtx = [
                                        'grupo'       => '',
                                        'id_soft_udn' => $UNIDAD_NEGOCIO,
                                        'grupoc'      => $D,
                                        'status'      => 1
                                    ];

                                    $array       = $util-> sql($dtx);
                                    // $lbl         = $obj -> add_soft_grupoc($array);
                                    // $idCategoria = $obj -> get_soft_grupoc([$D, $UNIDAD_NEGOCIO]);
                                }

                                $opc = 2;

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
                                        $id_producto = $obj->get_producto_name($busqueda);
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
                                        $lbl = $obj->add_productos_paq($array_paq);
                                        
                                        // $lbl       = $array_paq;


                            //     # comentado
                                    //     $obj->insert_row_paq($arreglo_datos);

                                    //     $output .= '<tr class="bg-default-soft">';

                                    //     for ($i = 0; $i < count($arreglo_new); $i++) {
                                    //         $output .= '<td> ' . $arreglo_new[$i] . '</td>';
                                    //     }

                                    //     $output .= '</tr>';
                                    $opc = 1;
                                    break;


                                    default:
                                    $opc = 0;

                                        if ($id_producto == 0) {

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


                                            $contador_nuevo[] = $producto;

                                            
                                            // if($subir_a_sistema) 
                                            // $obj-> crear_producto_soft($data_soft);

                                            /* PENDIENTE */ 
                                            $lbl = '<span class="text-danger fw-bold">Not found PRODUCTO</span>';


                                            // Despues de crear agregalo al sistema

                                            $busqueda    = array($producto, $UNIDAD_NEGOCIO);
                                            $id_producto = $obj->get_producto_name($busqueda);


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

                                            // if ($subir_a_sistema)
                                                // $lbl = $obj->add_productosvendidos($array);


                                        

                                        } else {

                                            # agregar productos al sistema  

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

                                             if ($subir_a_sistema)
                                            $lbl = $obj->add_productosvendidos($array);





                                        }

                                        $total_gral  += $cantidad * $precio_venta; 
                                    break;
                                }// end switch 
                            /*----------  [  Imprimir tabla de productos ]  --------*/ 
                            $__row[] = [

                                'id'          => $clave,
                                'producto'    => $producto,
                                'id_producto' => $id_producto,
                                'cantidad'    => $cantidad,
                                'precio'      => $precio,
                                'grupo'       => $D,
                                'gp'          => $idGrupoProductos,
                                'ok'          => $lbl,

                                // 'venta_total'   => $venta_total,
                                // 'clasificacion' => $clasificacion,
                                // 'porcentaje'    => $porcentaje,
                                // 'iva'   => $iva,
                                'opc'   => $opc
                            ];

                        
                        
                        
                        }


                        $obj_ventas = [
                        'monto_productos_vendidos' => $total_gral,
                        'id_folio'                 => $id_folio
                        ];

                        $array = $util->sql($obj_ventas, 1);

                        $ok =    $obj-> update_monto_ventas_dia($array);


                    break;


                    case 'ventas':
                    case 'VENTAS':

                    $__row = [];

                    $update     = $obj->update_file_productos(array(1, $id_folio), 'ventas');
                    $lsVentas   = $obj->ls_ventas([$id_folio]);
                    $id_vendido = count($lsVentas);

                    // #Elimina todos los registros de la base de datos
                    if ($id_vendido != 0) {

                        $delete = $obj->delete_data_row_ventas(array($id_folio));

                    }

                    $total_ventas = 0;

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
                            'id_area'       => $id_area,
                            // 'tipo_servicio' => $tiposervicio,
                            // 'tipo_venta'    => $tipoventa,

                            'porcentaje'    => evaluar2($porcentaje),
                            'alimentos'     => evaluar2($alimentos),
                            'bebidas'       => evaluar2($bebidas),
                            'otros'         => evaluar2($otros),
                            
                            'subtotal'      => $subtotal,
                            'prod_vend'     => $prod_vend,
                            'ok'            =>$ok,
                            'opc'           => 0
                        ];


                    $total_gral += $total;




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


    $frm = ticket_head([
        'folio' => $id_folio.'( '. $id_vendido.' -'. $delete.' )',
        'fecha' => $fecha_archivo,
        'nuevos' => count($contador_nuevo),
        

    ]);

    $frm_foot = ticket_footer([
        'total' => $total_gral
    ]);

    $encode = [
        'frm_head' => $frm,
        'row'      => $__row,
        'thead'    => '',
        'frm_foot' => $frm_foot,
        'ok'       => $ok
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
            <input disabled class="form-control text-end cell" value="' . evaluar($data['total']) . '" id="frm_txtTotalControl">
            </td>
          </tr>

         

        
    </table>
      
     
     ';



}


echo json_encode($encode);


function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}


function evaluar2($val){

    return $val ? number_format($val, 2, '.', ',') : 0;
}
