<?php


# Libreria.
require '../src/vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

require_once '../mdl/mdl-administracion.php';
$obj = new Administracion();

require_once('../../../conf/_Utileria.php');
$util = new Utileria;


# -- variables --
$encode                  = [];
$output                  = '';
$idList                  = $_POST['idList'];
$UNIDAD_NEGOCIO          = $_POST['UDN'];
$new_productos           = 0;
$contador_productos_soft = 0;

$fecha_actual   = date('Y-m-d H:i:s');


 $__row       = [];

 $hojaActual = [];

foreach ($_FILES as $cont => $key) {
  if($key['error'] == UPLOAD_ERR_OK ){

    $fichero     = $key['name'];
    $rutaArchivo = $key['tmp_name'];
    $documento   = IOFactory::load($rutaArchivo);
    $hojaActual  = $documento->getSheet(0);


    $numeroMayorDeFila    = $hojaActual->getHighestRow(); // Numérico
    $letraMayorDeColumna  = $hojaActual->getHighestColumn(); // Letra
    $numeroMayorDeColumna = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($letraMayorDeColumna);
    

    $inicio_fila = 1;
    $Noproductos  =  $numeroMayorDeFila-6;

    # Recorrido de archivo Excel
    for ($filas=6 ; $filas <= $numeroMayorDeFila  ; $filas++) {
        $contador_productos_soft += 1;

        $clave       = $hojaActual->getCell('A'.$filas)->getValue();
        $producto    = $hojaActual->getCell('B'.$filas)->getValue();
        $clavegrupo  = $hojaActual->getCell('C'.$filas)->getValue();
        $grupo       = $hojaActual->getCell('D'.$filas)->getValue();
        $precio      = $hojaActual->getCell('H'.$filas)->getValue();
        $clave_soft  = '';
        $etiqueta    = 1;

        $busqueda       = array($producto, $UNIDAD_NEGOCIO);

        $id_producto = '';
        $clave_soft  = '';
        $nombre_prod = '';
        $status = '<strong class="text-danger">No encontrado</strong>';

        $list = $obj -> get_producto_nombre($busqueda);
        
        foreach($list as $data_productos){

           $id_producto  .= $data_productos['id_Producto'];
           $clave_soft   = $data_productos['clave_producto'];
           $nombre_prod  = $data_productos['descripcion'];
           $status       = '<i class="text-success icon-flag"></i>';
           $id_grupo_erp = $data_productos['id_grupo_productos'];

           $group_name   = $obj->getGroupName([$id_grupo_erp]);


        }

        $id_grupo       = $obj-> select_grupo(array($grupo, $UNIDAD_NEGOCIO));

        // CREAR GRUPO 
         


         if($idList == 2 ){ // Se agregara

            # EL PRODUCTO NO FUE ENCONTRADO, CREAR NUEVO PRODUCTO
            if ($id_producto == 0) {

                $etiqueta      = 2;
                $new_productos = $new_productos + 1;

                $data = array(
                    'clave_producto'     => $clave,
                    'descripcion'        => $producto,
                    'id_udn'             => $UNIDAD_NEGOCIO,
                    'status'             => 1,
                    'fecha'              => $fecha_actual,
                    'activo_soft'        => 1,
                    'id_grupo_productos' => $id_grupo,
                    'costo'              => $precio,
                );

                $array = $util->sql($data);

                $status      = '<i class="icon-bookmark-2 text-info"></i> Nuevo';
                $ok = $obj->add_soft($array);
                
                
                    $__row[] = array(

                        'id'     => $clave,
                        'estado' => $status,
                        'idx'    => $clave,
                        'prod'   => $producto,
                
                        'fec'      => $fecha_actual,
                        'costo'    => $precio,
                        'id grupo' => ['class' => $bg, 'html' => $id_grupo],
                        'grupo'    => ['class' => $bg, 'html' => $grupo],
                        'ok'       => $ok,
                        'list'     => $array,
                        "opc"      => 1
                    );
                           
            } 


            
            else { // EL PRODUCTO FUE ENCONTRADO, ACTUALIZAR  
                
                // $status = '<i class="text-success icon-ok"></i>';
                // $bg     = '';
                
                // $id_grupo = $obj->select_grupo(array($grupo, $UNIDAD_NEGOCIO));
                // $ok = '';
                // if($grupo != $group_name){
                //     $status = '<i class="text-warning icon-warning-1"></i>';
                //     $bg     = 'bg-warning-1';

                //     // $ok     =  $obj-> updateGroup([$id_grupo,$id_producto]);
                // } 
                
                
                // $data_update = array(
                //    'activo_soft'        => 1,
                //    'costo'              => $precio,
                //    'id_Producto'        => $id_producto
                   
                // );


                // $array_ = $util->sql($data_update,1);

                // $query   = $obj-> actualizar_registro($array_);

 

                // $__row[] = array(
                //     'id'       => $id_producto,
                //     'estado'   => $status,
                //     'idx'      => $id_producto,
                //     'prod'     => $nombre_prod,
                //     'costo'    => $precio,
                //     'id grupo' => ['class' => $bg, 'html' => $id_grupo],
                //     'grupo'    => ['class' => $bg, 'html' => $grupo],
               

                //     'grupo erp' => ['class' => $bg, 'html' => $id_grupo_erp],

                //         'clave' => $clave,

                //     'id_Producto' => $id_producto,
                //     'query'       => $query,
                //     "opc"         => 0
                // );

            }
            






         }// end List
         else{

                $status_grupo = ''; 
                if($group_name != $grupo) $status_grupo = '<i class="text-warning icon-flag"></i>';

                $__row[] = array(
                    'id'              => $id_producto,
                    'estado'          => $status,
                    'clave'           => $clave,
                    "nombre soft"     => $producto,
                    "id producto erp" => $id_producto,
                    "nombre erp"      => $nombre_prod,
                    "id "             => $id_grupo_erp,
                    'grupo erp'       => ['class'=>'bg-default','html'=>$group_name],
                    'id_grupo'        => $id_grupo,
                    'grupo'           => ['class'=>'bg-default','html'=>$grupo],
                    'status'          => $status_grupo,

                    'costo'           => evaluar($precio),
                    "opc"             => 0
                );

         }

        
    
    }//END ARCHIVO EXCEL
 
  } // end error
} 




$th  = ['STATUS {'.$idList.'}','ID','Clave ','Productos (Soft)- '.$Noproductos,'Nombre(ERP)','id Grupo','Grupo productos','Precio'];

 # Encapsular arreglos
    $encode = [
        "thead" => '',
        "row" => $__row,
        "prod_soft" => $contador_productos_soft,
    ];


# ----------------------- #
#  JSON DECODE            #
# ----------------------- #
echo json_encode($encode);

function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

?>
