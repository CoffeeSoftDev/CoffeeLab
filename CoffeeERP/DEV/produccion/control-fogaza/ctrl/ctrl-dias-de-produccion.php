
<?php
if(empty($_POST['opc'])) exit(0);


require_once('../mdl/mdl-dias-de-produccion.php');
$obj = new Diasdeproduccion;

require_once('../../../conf/_Utileria.php'); 
$util = new Utileria;


$encode = [];


switch ($_POST['opc']) {

  case 'initComponents':
      $ls = $obj->lsCategoria();


      $encode = [
          'ls' => $ls
      ];
  break;

  case 'lsData':
      $encode = ls($obj, $util);
  break;

  case 'ipt':
    $array  = $util  -> sql($_POST,1);
    $encode = $obj -> ipt($array);
  break;

  case 'estadoProducto':
    $id             = $_POST['id'];
    $estadoProducto = $_POST['estadoProducto'];
    
    $data   = ['estadoProducto' => $estadoProducto, 'idAlmacen' => $id];
    $dtx    = $util ->sql($data,1);
    $ok     = $obj  ->estado_producto($dtx);

    
    $encode = ['ok' => $ok];
  
  break;

  case 'crear-enlace':

    $ok     = $encode = $obj->CrearEnlace($array);
    $encode = ['ok' => $ok];

  break;

}


function ls($obj, $util){
  # Declarar variables
  $_estado = $_POST['estado'];
  $__row   = [];

  $ls             = $obj ->listProducts([$_POST['idcategoria']]);
  $totalProductos = 0;

    
  foreach ($ls as $key) {
      $estado = 1;

      $id_almacen = $key['id'];
      $estadoProducto = $key['estadoProducto'];

      $sugerencia = $key['sugerencia'];
      $dias_merma = $key['diasMerma'];
      $multiplox  = $key['multiploProduccion'];


      $link        = $obj->lsCostsys([$key['id']]);
      $nombre_cost = '<span class="text-danger">No encontrado </span>';

    //   $desplazamiento = $obj->lsRangeDate(array('2024-01-01', '2024-05-26', 1, $key['id']));

        $desplazamiento = $obj->consultar_x_mes(array(9, 2024, 1, $key['id']));



        $idCostsys    = 0;
        $fecha        = '';
        $precioVenta  = 0;   
        foreach ($link as $_key) {

            $idCostsys   = $_key['idReceta'];
            $nombre_cost = '<span class="text-muted" style="font-size:.87em;">'.$_key['nombre'].'</span>';
            $fecha       = $_key['fecha'];
            $precioVenta = $_key['precioVenta'];

         
        }
           


    //     $gerente    = '';
    //     $id_almacen = '';
    //     $estado     = 0;

    //     $nombre_producto = '';

    //     $estadoProducto     = 0;
    //     $contadorProductos  = 0; 

    //     foreach ($link as $key) {
    //         $contadorProductos ++;
    
    //         // $dia_consulta = $_list[6];


    //         $data_almacen_productos =[
    //             'NombreProducto' => $_key['nombre'],
    //             'idAlmacen'      => $id_almacen,
    //         ]; 


    //         $array = $util->sql($data_almacen_productos,1);
    //         $ok    = false;

    //         // if($_key['id'] != 1056 && $_key['id'] != 1054)

    //         // $ok = $obj->set_name_producto($array);


    //         /*--  Dias de produccion -- */
    //         $Lunes         = CheckDia($key['idAlmacen'], $key['lunes'], 1);
    //         $Martes        = CheckDia($key['idAlmacen'], $key['martes'], 2);
    //         $Miercoles     = CheckDia($key['idAlmacen'], $key['miercoles'], 3);
    //         $Jueves        = CheckDia($key['idAlmacen'], $key['jueves'], 4);
    //         $Viernes       = CheckDia($key['idAlmacen'], $key['viernes'], 5);
    //         $Sabado        = CheckDia($key['idAlmacen'], $key['sabado'], 6);
    //         $Domingo       = CheckDia($key['idAlmacen'], $key['domingo'], 7);
    //     }



    //     $multiplo       = _input(['id' => $id_almacen, 'name' => 'multiploProduccion', 'value' => $multiplox]);
    //     $limite         = _input(['id' => $id_almacen, 'name' => 'diasMerma',          'value' => $dias_merma]);
    //     $ipt_sugerencia = _input(['id' => $id_almacen, 'name' => 'sugerencia',         'value' => $sugerencia]);

    //     $idSubCategoria = $obj->consultar_subcategoria_costsys(array($_key['id_SubClasificacion']));

    //     // $limite       = _input($id_almacen, $dias_merma,'txtLimiteMerma','dias_limite_merma');
    //     // $sugerencia   = _input($id_almacen, $gerente,'txtSugerencia','sugerencia_minima');

    if($estadoProducto == $_estado):
        $totalProductos++;

        // $select = cb_grupo($obj, $key['id'], $idCostsys, '');


            $__row[]   = array(

            'id'             => $key['id'],
            'idSoft'         => $key['id'].'/'. $idCostsys,
            'estado'         => btn_toggle($estadoProducto,$key['id']),
            'fecha'          => $fecha,
            'Productos'      => $key['NombreProducto'],
            'link'           => $nombre_cost,
            'Costo costsys'  => '<strong>'.evaluar($precioVenta).'</strong>',
            'desplazamiento' => $desplazamiento,

            
            // 'grupo'          => $select[0],
            // 'fecha'           => formatSpanishDate($key['fecha']),
            // 'a'               => 'a',
      
             
    //         'Grupo'           => $idSubCategoria,
    //         "multiplo"        => $multiplo,
    //         "limite de merma" => $limite,
    //         "Gerente"         => $ipt_sugerencia,

    //         "L"   => $Lunes,
    //         "M"   => $Martes,
    //         "X"   => $Miercoles,
    //         "J"   => $Jueves,
    //         "V"   => $Viernes,
    //         "S"   => $Sabado,
    //         "D"   => $Domingo,
    //         // "ALL" => $estado,


            "opc"  => 0
        );

    endif;
    }

    #encapsular datos
    return [
        "thead"       => '',
        "row"         => $__row,
        "noProductos" => $totalProductos
    ];
}

function btn_toggle($status,$id){

    
    $iconToggle = "icon-toggle-off";
    $color      ='danger';
    
    if($status){
        $iconToggle = "icon-toggle-on";
        $color = 'success';
    }
    
    
    $btn_toggle = "<a id='btnEstado{$id}'  status={$status}  class='pointer btn btn-outline-success text-{$color} btn-sm '
     onclick='estadoProducto({$status},{$id})'><i class='{$iconToggle}'></i> </a>";

    return $btn_toggle;
}

 function CheckDia($idProducto,$check,$dia){
  $var = '';
//   $diaSemana = dia_short($dia);

  if($check == 1){
   
    $var = '<input class="ck'.$idProducto.'"  onclick="getDia('.$idProducto.','.$check.','.$dia.')"  id="'.$dia.'_'.$idProducto.'" type="checkbox" checked />';
  
  }else{
    $check = 0;
    $var = '<input class="ck'.$idProducto.'" onclick="getDia('.$idProducto.','.$check.','.$dia.')" id="'.$dia.'_'.$idProducto.'" type="checkbox" />';

  }

  return $var;
}
function _input($data){
  return '
         <input type="number" name="'.$data['name'].'" class="form-control form-control-sm text-primary cellx fw-bold text-end " 
         id="'.$data['id'].'"  value="'.$data['value'].'"  >
        ';
  
}

function formatSpanishDate($fecha = null) {
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    $formatoFecha = "%d/%b/%y"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}

function cb_grupo($obj, $id, $id_softs, $idhomologo)
{
    $txt = '';
    $precioVenta = 0;

    $idCategoria = $obj->getCategoriaCostsys([  $_POST['categoria']  ]);


    $data = $obj->cb_producto_costsys(array(6, $idCategoria)); // RECETAS DEL COSTSYS
    $txt .= '<div class="input-group  input-group-sm w-100">';
    // input js-example-basic-single' . $id . '
    $txt .= '

    <select 
    class="form-control form-control-sm js-example-basic-single " id="cb_producto' . $id . '">

    <option value="0"> --  -- </option>
    ';

    foreach ($data as $row) {
        if ($row['idReceta'] == $id_softs) {

            $txt .= '<option value="' . $row['idReceta'] . '" selected>
            ' . $row['nombre'] . ' ($ ' . $row['precioVenta'] . ')  </option>';

            $precioVenta = $row['precioVenta'];

        } else {

            $txt .= '<option value="' . $row['idReceta'] . '" >
                ' . $row['nombre'] . ' ($ ' . $row['precioVenta'] . ')    </option>';
        }
    }

    $txt = $txt . '</select>

    <a class="input-group-text btn-primary btn-sm" onclick="enlace_receta(' . $id . ',' . $idhomologo . ')">
     <i class="icon-plus pointer" ></i>
    </a>

    </div>
    ';

    $arreglo_datos = [$txt, $precioVenta];
    return $arreglo_datos;
}

function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

echo json_encode($encode);
?>