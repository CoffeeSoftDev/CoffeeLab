<?php


# Libreria.
require '../src/vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

require_once '../mdl/mdl-administracion.php';
$obj = new Administracion();

require_once('../../../conf/_Utileria.php');
$util = new Utileria;


$notify = new Notify();

class Notify{

    function createNotify($users,$Notify){

        $notify = [];

        foreach ($users as $user) {

            // $Notify['id_User'] = $user;
            $notify[] = $Notify;

        }


        return $notify;

    }


}


# -- variables --
$encode                  = [];
$output                  = '';
$idList                  = $_POST['idList'];
$UNIDAD_NEGOCIO          = $_POST['UDN'];
$new_productos           = 0;
$contador_productos_soft = 0;
$fecha_actual            = date('Y-m-d H:i:s');
$__row                   = [];
$hojaActual              = [];

// send notify
$productsCreated = [];

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

       
        $clave_soft  = '';
        $nombre_prod = '';
        $status = '<strong class="text-danger">agregar</strong>';

        $lsProducts = $obj -> get_producto_nombre($busqueda);
        
        $noProducts = count($lsProducts);
        $listProducts = '';
        $group_name   = '';
        
        if($noProducts == 1):

           $id_producto  = $lsProducts[0]['id_Producto'];
           $clave_soft   = $lsProducts[0]['clave_producto'];
           $nombre_prod  = $lsProducts[0]['descripcion'];
           $id_grupo_erp = $lsProducts[0]['id_grupo_productos'];
           
           $status       = '<i class="text-success icon-flag"></i>';

            $listProducts = 'Solo tiene un producto';
            $group_name   = $obj->getGroupName([$id_grupo_erp]);
        
        elseif($noProducts > 1):

            $cleanKey = str_replace("'", "", $clave);


            $lsProducts  =  $obj ->   get_producto_nombre_por_clave([$producto,$UNIDAD_NEGOCIO,$cleanKey]);


            foreach($lsProducts as $__key){

                // if($data_productos['activo_soft']){
                    $id_producto  = $__key['id_Producto'];
                    $nombre_prod  = $__key['descripcion'];
                    $clave_soft   = $__key['clave_producto'];
                    $id_grupo_erp = $__key['id_grupo_productos'];
                // }


                $group_name   = $obj->getGroupName([ $__key['id_grupo_productos']]);

                $listProducts .= " {$__key['id_Producto']} | ({$__key['clave_producto']}) = {$cleanKey}   {$__key['descripcion']}  / ";


            }
            // $listProducts = $clave;
            

            $status       = '<i class="text-info icon-flag"></i>';
        
        else: 
           
            $productsCreated[] =  $producto.' - '.$precio;

            $listProducts = 'No existe'; 
            $id_grupo_erp = ''; 
            $id_producto  = 0; 
            
        endif; 



        // $listProducts = '';
        
        // foreach($list as $data_productos){

      
        //    $id_producto  .= $data_productos['id_Producto'];
        //    $clave_soft   = $data_productos['clave_producto'];
        //    $nombre_prod  = $data_productos['descripcion'];
        //    $status       = '<i class="text-success icon-flag"></i>';
        //    $id_grupo_erp = $data_productos['id_grupo_productos'];

        //    $group_name   = $obj->getGroupName([$id_grupo_erp]);

        //    $listProducts .= "{$data_productos['descripcion']} +  $group_name |";


        // }

        $id_grupo       = $obj-> select_grupo(array($grupo, $UNIDAD_NEGOCIO));

        // CREAR GRUPO 
         


         if($idList == 2 ){ // Se agregara

            // Crear un nuevo grupo 
            $okas = '';
            if($id_grupo == 0):


                $dataGroup  = $util-> sql([

                    'id_udn'         => $UNIDAD_NEGOCIO,
                    'grupoproductos' => $grupo,
                    'estatus'        => 1

                ]); 

               $okas = $obj-> add_soft_grupoproductos($dataGroup);

            endif;

            

            # EL PRODUCTO NO FUE ENCONTRADO, CREAR NUEVO PRODUCTO
            if ($id_producto == 0) {


                $productsCreated[] = [ $producto.' - '.$precio];

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
                        'query'    => $okas,
                        "opc"      => 1
                    );
                           
            } 


            
            else { // EL PRODUCTO FUE ENCONTRADO, ACTUALIZAR  
                
                $status = '<i class="text-success icon-arrows-cw-1"></i>';
                $bg     = '';
                
                $id_grupo = $obj->select_grupo(array($grupo, $UNIDAD_NEGOCIO));
               
               
                $ok = '';
                if($grupo != $group_name){

                    $status = '<i class="text-warning icon-arrows-cw-1"></i>';
                    $bg     = 'bg-warning-1';

                    $ok     =  $obj-> updateGroup([$id_grupo,$id_producto]);
                } 
                
                
                $data_update = array(
                   'activo_soft'        => 1,
                   'costo'              => $precio,
                   'id_Producto'        => $id_producto
                   
                );
               
                 if($group_name != $grupo):

                    $array_  = $util->sql($data_update,1);
                    $query   = $obj-> actualizar_registro($array_);

                    $__row[] = array(
                        'id'          => $id_producto,
                        'estado'      => $status,
                        'idx'         => $id_producto,
                        'prod'        => $nombre_prod,
                        'costo'       => $precio,
                        'id grupo'    => ['class' => $bg, 'html' => $id_grupo],
                        'grupo'       => ['class' => $bg, 'html' => $grupo],
                        'grupo erp'   => ['class' => $bg, 'html' => $id_grupo_erp],
                        'clave'       => $clave,
                        'id_Producto' => $id_producto,
                        'query'       => $query,
                        "opc"         => 0
                    );

                endif;

            }
            






         }// end List
         else{

                $status_grupo = ''; 
                if($group_name != $grupo) $status_grupo = '<i class="text-warning icon-flag"></i>';

                // if($group_name != $grupo)
                $__row[] = array(

                    'id'           => $id_producto,
                    'idx'          => $id_producto,
                    'clave'        => $clave,
                    "nombre soft"  => $producto,
                    
                    'grupo_soft'   => ['text'=>$grupo,        'class'=>'text-center bg-warning-1'],
                    'idgrupo_soft' => ['text'=>$id_grupo,     'class'=>'text-center bg-warning-1'],
                    'grupo_erp'    => ['text'=>$group_name,   'class'=>'text-center bg-aliceblue'],
                    'idgrupo_erp'  => ['text'=>$id_grupo_erp, 'class'=>'text-center bg-aliceblue'],
                    
                    'estado'       => $status,
                    'listProducts' => $listProducts,
                    "opc"             => 0
                );

         }

        
    
    }//END ARCHIVO EXCEL
 

  } // end error


}




$products = implode(',', $productsCreated);


$message = [
    
    'title'       => ' SoftRestaurant ',
    'description' => ' Productos creados: '.$products,
    'creation'    => $fecha_actual,
    'id_Area'     => 1,
    'id_UDN'      => 8 
];

$lsNotify  = $notify -> createNotify([1], $message );
$data      = $util -> sql($lsNotify);

$ok = $obj-> addNotify($data);




$th  = ['STATUS {'.$idList.'}','ID','Clave ','Productos (Soft)- '.$Noproductos,'Nombre(ERP)','id Grupo','Grupo productos','Precio'];

 # Encapsular arreglos
    $encode = [
        "thead"     => '',
        "row"       => $__row,
        "prod_soft" => $contador_productos_soft,
        'notify'    =>  $ok
    ];


# ----------------------- #
#  JSON DECODE            #
# ----------------------- #
echo json_encode($encode);

function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

?>
