
<?php

date_default_timezone_set('America/Mexico_City');
setlocale(LC_TIME, 'es_MX.UTF-8');

if ( empty($_POST['opc']) ) {
    exit(0);
}

require_once('../mdl/mdl-reportes.php');
$obj  = new Reportes();
require_once('../../../conf/_Message.php');
$msg = new Message();

require_once('../../../conf/_Utileria.php');
$util = new Utileria;
$encode = [];

require_once ('../src/libreria/dompdf/autoload.inc.php');
use Dompdf\Dompdf;
$dompdf = new Dompdf();

switch ($_POST['opc']) {

    case 'initComponents':
      $folio     = $obj->__getFolio([1]);
      $encode    = [
        "folio" => $folio[0],
         "hola"=> $folio,
    ];
    break;

    case 'ls':
        $encode = lsProduccion($obj);
    break;

    case 'crear-formato':

      $folio               = $obj   -> obtenerFolio(array(1));
      $_POST['foliofecha'] = $_POST['foliofecha'].' '.date("H:i:s");
      $_POST['new_estado'] = 1;
      $_POST['id_tipo']    = 1;
      $_POST['folio']      = 'P-'.$folio;

      $array  = $util  -> sql($_POST);
      $encode = $obj   -> CrearTicket($array);

    break;



    case 'terminar-formato':

      $array   = $util->sql($_POST,1);
      $encode  = $obj->cerrarTicket($array);
      $pedidos = [416];

      /* DETECTAR PRODUCCION DE COSTRA */
      $ls      = $obj->lsProduccion([$_POST['idLista']]);
       foreach ($ls as $_key) {
            if (in_array($_key['id_productos'], $pedidos)) {
                $mensj = 'Se ha dectado un pedido de '. $_key['NombreProducto'];
                $send  = $msg->whatsapp('120363040506662913@g.us', $mensj);
            }
       }
      $folio  = $obj->__getFolio([1]);
      $encode = [  "folio"     => $folio[0] ];
    break;

    case 'ipt':

        $select = [
            'id_productos' => $_POST['id_productos'],
            'id_lista'     => $_POST['id_lista']
        ];
        $update = ['sugerencia' => $_POST['sugerencia']];
        $encode = ipt($obj,$select,$update);
        $encode['total'] = $obj->consultar_total([$_POST['id_lista']]);
    break;

    case 'cancelar-folio':
        $array   = $util->sql($_POST,1);
        $obj->CancelarFolio($array);
        $folio = $obj->__getFolio([1]);
        $encode = [
        "folio" => $folio[0]
        ];
    break;

    case 'enviar-whatsapp':

         # --- Titulo del formato
        $lsFolio = $obj->lsDataTicket([$_POST['id']]);
        foreach ($lsFolio as $key);


        $enlace = $util->url();

        $url       = '../../../../erp_files/formato/';

        $options   = $dompdf->getOptions();
        $options  ->set(['isRemoteEnabled' => true]);
        $dompdf   ->setOptions($options);

        $html     = pdf_pedido($obj);

        $dompdf->loadHtml($html);
        $dompdf->setPaper('letter');
        $dompdf->render();

        $contenido      = $dompdf->output();
        $nombre_archivo = 'PEDIDO_FOGAZA_'.$key['Nombre_Area'].'.pdf';
        $rutaArchivoPdf = $url.$nombre_archivo;
        $bytesEscritos  = file_put_contents($rutaArchivoPdf, $contenido);

        /*-- --*/

        $ruta = $enlace[0].'erp_files/formato/';


        $encode = [
            'ok'  => $bytesEscritos,
            'html'=> $ruta,
            // 'table' => $html
        ];

        $tel  = [$_COOKIE['TEL'], $_POST['wp']];


        $send = $msg ->whatsapp_file(

            $tel,
            'Se ha creado un pedido de  '.$key['Nombre_Area'].' ',

            $ruta,
            $nombre_archivo

        );


        // $send = $msg->whatsapp(['9621501886','9621663421'], 'Hola mundo');
        // $encode = [
        //     'ok' => $send,
        // ];
    break;

    case 'quitar-lista':

        $idLista        = $_POST['idFolio'];
        $idProducto     = $_POST['idProducto'];

        $data = [$idLista, $idProducto];

        $existe   = $obj -> getIdListaProductos($data);

        if ($existe) {

            $estatus = 'eliminar';
            $ok      = $obj->quitar_lista([$existe['idListaProductos']]);


        }


       $encode = [
        'ok' => $ok,
        'data' => $data,
        'existe' => $existe
       ];

    break;

    case 'lsProductos':

        $encode = lsProductos($obj);
    break;

    case 'setEstatus':

        $data   = $util -> sql($_POST, 1);
        $ok     = $obj  -> update_estado_producto($data);
        $encode = [ 'data' => $data ,'ok' => $ok ];

    break;

}



#----------------------
#
#----------------------

function lsProductos($obj){
    # Variables
    $__row = [];
    $idCategoria = $_POST['grupo'];


    $ls = $obj->listProduction([$idCategoria,$_POST['Estado']]);

    if($_POST['Estado'] == 2)
    $ls =  $obj -> lsFogazaLink([$idCategoria],'lunes');

    foreach ($ls as $key) {


        $estatus        = $key['estadoProducto'];
        $desplazamiento = $obj->consultar_x_mes(array(9, 2024, 1, $key['idAlmacen']));

        $icon = $estatus == 1 ? ' icon-toggle-on' : ' icon-toggle-off';


        $btn = [];

        $btn[] = [

            'class'   => 'text-primary pointer py-0',
            'html'    => '<i class="'.$icon.'"></i>',
            'id'      => 'btnEstatus'.$key['idAlmacen'],
            'estatus' => $estatus,

            'onclick' => 'toggleEstatus('.$key['idAlmacen'].')'


        ];

        $__row[] = array(
            'id'       => $key['idAlmacen'],
            'idx'      => $key['idAlmacen'],
            'active'   => status_day($key['dia']),

            'Producto' => $key['NombreProducto'],
            'ventas'   => $desplazamiento,
            // 'estatus'  => '', // consultar estado de homologado
            'a'        => $btn
        );

    }// end lista de folios


    // Encapsular arreglos
    return [ "thead"    => '', "row" => $__row,];

}


function pdf_pedido($obj) {
  $id     = $_POST['id'];

  $table .= '
    <html>
    <head>
    </head>

    <style>

        body{
             font-family: Arial, Helvetica, sans-serif;
        }

        table.tb-report {
            border-collapse: collapse;
        }

        .tb-report>th,
        .tb-report>td {
            padding: 5px;
        }

        .tb tbody tr>td, .tb tbody tr>th, .tb tfoot tr>td, .tb tfoot tr>th, .tb thead tr>td, .tb thead tr>th {
            border: 1px solid #dee2e6;
            vertical-align: middle;

        }

        .bg-primary{
            background-color: #7d8590f7;
            color: #fff;
        }

        .text-uppercase {
            text-transform: uppercase !important;
        }

        .text-end {
            text-align: right !important;
        }

        .text-center {
            text-align: center !important;
        }

    </style>
  ';

  # --- Titulo del formato
    $lsFolio = $obj->lsDataTicket([$_POST['id']]);
    foreach ($lsFolio as $key);

    $data = [
        'fecha'   => $key['fecha'],
        'titulo'  => '<span class="text-primary">' . $key['Nombre_Area'] . ' </span>',
        'folio'   => $key['folio'],
        'hora'    => $key['hora'],
        'estado'  => $key['new_estado'],
        'id_tipo' => $key['estado_revisado'],
    ];

    $table .= '
    <table style="font-size:.76em; " width="100%" class="tb tb-report">

        <tr>
        <td class="col-sm-1 bg-primary fw-bold">FECHA: </td>
        <td class="col-sm-2 text-end">' . $data['fecha'] . ' </td>
        <td class="col-sm-6 text-center"><center> <strong> LINEA DE PRODUCCION ' . $data['titulo'] . '</strong> </center></td>
        <td class="col-sm-1 bg-primary fw-bold"> FOLIO:  </td>
        <td class="col-sm-2 text-right text-end text-danger fw-bold">' . $data['folio'] . '</td>
        </tr>

        <tr>
        <td class="col-sm-1 bg-primary fw-bold"> HORA:  </td>
        <td class="col-sm-2 text-end">' . $data['hora'] . '</td>
        <td class="col-sm-6"></td>
        <td class="col-sm-1 fw-bold bg-primary ">DIA: </td>
        <td class="col-sm-2 text-uppercase text-end">  ' . formatDAYSpanishDate($data['fecha']) . ' </td>
        </tr>

    </table>';






  # Lista de productos
  $ls = $obj->lsProduccion(array($id));

  foreach ($ls as $_key) {


    $totalx = $_key['sugerencia'] * $_key['costo'];
    $total_aprox += $totalx;

    $__row[] = array(

      'PRODUCTO' => '<span class="text-uppercase">' . $_key['NombreProducto'] . '</span>',
      'CANTIDAD' => ''.$_key['sugerencia'].'',
      'PRECIO'   => evaluar($_key['costo']),
      'TOTAL'    => evaluar($totalx),
    );

  }

    $__row[] = array(

        'Producto' => '<strong> TOTAL </strong>',
        'Cantidad' => '',
        'precio'   => '',
        'total'    => '<strong style="font-size:1.2em;">'.evaluar($total_aprox).'</strong>',
    );


  $table .= simple_tabla_php($__row);

  $table .= '</html>';

  return $table;
}


function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}


#----------------------
# Funciones y metodos
#----------------------
function ipt($obj,$select,$update){
    $util    = new Utileria();
    $idLista = $obj-> get_id_lista($util->sql($select, 2));

    $array   = [];


    if($idLista == 0){
        $estatus = 'insertar';
        $array   = $util->sql($_POST);
        $ok      = $obj->_fn($array);

    }else{

        $estatus = 'actualizar';
        $update['idListaProductos'] = $idLista;
        $array = $util->sql($update, 1);
        $ok    = $obj->actualizar_lista_productos($array);

    }

    return [
        "ok" => $ok,
        "array" => $array,
        "estatus" => $estatus,
        'idLista' => $idLista,
        // "total_producto" => $total_producto
    ];

}

function ls($obj){

  $__row   = [];
 /* -- Titulo del formato -- */
  $lsFolio   = $obj -> lsFolio([$_POST['id']]);
  foreach ($lsFolio as $key) ;
  $date     = $key['fecha'];
  #Identificador de la catetoria del producto --

  $ID_AREA  = $obj -> __get_IDAREA(array($key['Nombre_Area']));

  $total_produccion = _get_total_produccion($obj, $_POST['id']);

  $objs = ticket_head(
    [

    'fecha'  => $key['fecha2'],
    'hora'   => $key['hora'],
    'titulo' => $key['Nombre_Area'].' - '.$_COOKIE['TEL'],
    'folio'  => $key['folio'],
    'dia'    => formatSpanishDate($key['fecha']),
    'turno'  => $key['turno'],
    'total'  => $total_produccion,

    ]
  );


  $ls      = $obj ->lsProductosCostsys([6,$ID_AREA]);


  foreach ($ls as $_key):

    $bg               = 0;
    $SubClasificacion = $obj->NombreSubcategoria([$_key['id_SubClasificacion']]);

    if( $SubClasificacion != 'DESCONTINUADO' ){

    /* -- --*/

    $id_almacen   = 0;
    $sugerencia   = '<span class="text-danger"> Revisar sugerencia </span>';
    $dias_merma   =  0 ;

    $dia_consulta   = '0';
    $estado_link    =  0;
    $estadoProducto = '';

    $link         = $obj ->_PRODUCTOS_FOGAZA_LINK_COSTSYS_ORDER([$_key['id']],'lunes');

    foreach($link as $_list){

      $estado_link     = 1;
      $id_almacen      = $_list['idAlmacen'];
      $estadoProducto  = $_list['estadoProducto'];

      $nombre_producto = $_list['NombreProducto'];
      $sugerencia      = ($_list['sugerencia'] == null) ? '' : $_list['sugerencia'];
      $dias_merma      = $_list['diasMerma'];
      $dia_consulta    = $_list['dia'];

    }

    /*-- Orden de produccion activa --*/


    $data_pedido = $obj->Productos_folio_activo(array($_POST['id'], $id_almacen));


    /* Calculo de estadistica para producción */

    $total_producto = $data_pedido[4]* $_key['costo'];
    $PrecioProducto = $_key['costo'];


    // $semana = una_semana_atras($obj,$id_almacen,$date,$dias_merma);
    // $cuatro = desgloze_4_dias_atras($obj,$id_almacen,$date,$dias_merma);


    // /*Inputs & totales */
    $total  = '';
    $precio = '';
    $orden  = '';

    if($estado_link != 0){

      $orden  = _input_group([$id_almacen,'txtSugerencia', $data_pedido[4],''] );

    }

    $total  = _input([$id_almacen,'txtTotalCtrl',$total_producto ,'']);
    $precio = _input([$id_almacen,'txtPrecioCtrl',$PrecioProducto,'actualizar_precio']);



    if($estado_link)
    $__row[] = array(
      'id'         => $_key['idReceta'],
      'dia'        => status_day($dia_consulta),
      'nombre'     => $_key['nombre'],
      "sugerencia" => $sugerencia,

      // "semana"            => $semana,
      // "c0"                => $cuatro[0],
      // "c1"                => $cuatro[1],
      // "c2"                => $cuatro[2],

      "Orden"             => $orden,
      "precio"            => $precio,
      "total"             => $total,

      // 'stado'  => $_key['id'],
      "opc"    => $bg
    );

    }

  endforeach;

    // Encapsular arreglos

    return  [
          'frm_head' => $objs,
          "thead"    => '',
          "row"      => $__row,
          "a"        => $ID_AREA
      ];


}

function lsProduccion($obj){

    $__row = [];
    /* -- Titulo del formato -- */
    $lsFolio = $obj->lsFolio([$_POST['id']]);
    foreach ($lsFolio as $key) ;
    $date = $key['fecha'];

    #Identificador de la catetoria del producto

    $ID_AREA = $obj->__get_IDAREA(array($key['Nombre_Area']));
    $total_produccion = _get_total_produccion($obj, $_POST['id']);

    $objs = ticket_head(
        [

            'fecha'  => $key['fecha2'],
            'hora'   => $key['hora'],
            'titulo' => $key['Nombre_Area'],
            'folio'  => $key['folio'],
            'dia'    => formatSpanishDate($key['fecha']),
            'turno'  => $key['turno'],
            'total'  => $total_produccion,

        ]
    );



        $link = $obj->lsFogazaLink([$key['id_grupo']], 'lunes');


        $totalProductos = count($link);



        foreach ($link as $_list) :



            $estado_link    = 1;
            $id_almacen     = $_list['idAlmacen'];
            $estadoProducto = $_list['estadoProducto'];

            $nombre_producto = $_list['NombreProducto'];
            $sugerencia      = ($_list['sugerencia'] == null) ? '' : $_list['sugerencia'];
            $dias_merma      = $_list['diasMerma'];
            $dia_consulta    = $_list['dia'];


            $lsReceta = $obj->lsReceta($_list['id_Costsys']);


            /*-- Orden de produccion activa --*/

            $data_pedido = $obj->Productos_folio_activo(array($_POST['id'], $id_almacen));

        /* Consultar info del costsys */
        foreach ($lsReceta as $receta );

           $SubClasificacion = $obj->NombreSubcategoria([$receta['id_SubClasificacion']]);

        /* Calculo de estadistica para producción */

        $total_producto = $data_pedido[4] * $receta['costo'];
        $PrecioProducto = $receta['costo'];


        // /*Inputs & totales */
        $total  = '';
        $precio = '';
        $orden  = '';

        if ($estado_link != 0) {

            $orden = _input_group([$id_almacen, 'txtSugerencia', $data_pedido[4], '']);

        }

        $total  = _input([$id_almacen, 'txtTotalCtrl', $total_producto, '']);
        $precio = _input([$id_almacen, 'txtPrecioCtrl', $PrecioProducto, 'actualizar_precio']);



                if ($estadoProducto)
        $__row[] = array(

            'id'         => $id_almacen,
            'dia'        => status_day($dia_consulta),
            'nombre'     => $nombre_producto.'<span class= "text-muted fw-bold" style="font-size:.76em;" >
            ( '. $receta['nombre'].' ) </span>  ',
            "sugerencia" => $sugerencia,
            // 'id_costsys' => $_list['id_Costsys'].' / '.$SubClasificacion,
//
//                 // "semana"            => $semana,
//                 // "c0"                => $cuatro[0],
//                 // "c1"                => $cuatro[1],
//                 // "c2"                => $cuatro[2],

            "Orden"  => $orden,
            "precio" => $precio,
            "total"  => $total,

//                 // 'stado'  => $_key['id'],
            "opc" => 0
        );

        endforeach;


    // $ls = $obj->lsProductosCostsys([6, $ID_AREA]);


    // foreach ($ls as $_key):

    //     $bg = 0;
    //     $SubClasificacion = $obj->NombreSubcategoria([$_key['id_SubClasificacion']]);

    //     if ($SubClasificacion != 'DESCONTINUADO') {

    //         /* -- --*/

    //         $id_almacen = 0;
    //         $sugerencia = '<span class="text-danger"> Revisar sugerencia </span>';
    //         $dias_merma = 0;

    //         $dia_consulta = '0';
    //         $estado_link = 0;
    //         $estadoProducto = '';

    //

    //         foreach ($link as $_list) {

    //             $estado_link = 1;
    //             $id_almacen = $_list['idAlmacen'];
    //             $estadoProducto = $_list['estadoProducto'];

    //             $nombre_producto = $_list['NombreProducto'];
    //             $sugerencia = ($_list['sugerencia'] == null) ? '' : $_list['sugerencia'];
    //             $dias_merma = $_list['diasMerma'];
    //             $dia_consulta = $_list['dia'];

    //         }





    //         // $semana = una_semana_atras($obj,$id_almacen,$date,$dias_merma);
    //         // $cuatro = desgloze_4_dias_atras($obj,$id_almacen,$date,$dias_merma);











    //     }

    // endforeach;

    // Encapsular arreglos

    return [
        'frm_head'    => $objs,
        "thead"       => '',
        "row"         => $__row,

        "NoProductos" => $totalProductos
    ];


}
function simple_tabla_php($row){
  $thead = '';
  $tbody = '';

  $thead .= "<tr class='bg-primary'>";
  $position = 0;
  foreach ($row[0] as $key => $value):
    $align = 'text-center';
    // $align = ($position == 0) ? 'text-start' : 'text-end';
    $thead .= "<th class='{$align}'> <center>" . ucfirst($key) . "</center></th>";
    $position++;
  endforeach;

  $thead .= '</tr>';


  foreach ($row as $rows => $keyx):
    $tbody .= "<tr>";
    $position = 0;
    foreach ($keyx as $value):

        $align = 'text-end';

         if($position == 0){
            $align = 'text-start';
        }else if($position == 1){
           $align = 'text-center';
        }



      $tbody .= "<td class='{$align}'> " . $value . "</td>";
      $position++;
    endforeach;
    $tbody .= '</tr>';
  endforeach;




  // Imprime los resultados en una tabla

  $table .= '
        <table style="margin-top:15px; font-size:.86em; "
         class="tb tb-report" width="100%" id="tb-formato-">

        <thead>
          '.$thead.'
        </thead>

        <tbody>
           ' . $tbody . '
        </tbody>
        </table>
    ';


  return $table;
}

function una_semana_atras($obj,$id_Producto,$date,$diasmerma){
  $tb         = '';
  $fecha      = date("Y-m-d",strtotime($date." -1  week"));
  $produccion = $obj-> PRODUCCION_X_FECHA(array(1,$id_Producto, $fecha));
  // -------------
     $mermas     = 0;
     $title      = '';

     if($diasmerma !=0){

      $f_merma = date("Y-m-d",strtotime($fecha."+ ".$diasmerma." days"));
      $merma   = $obj-> PRODUCCION_X_FECHA(array(2,$id_Producto,$f_merma));
      $mermas  = $merma[0];
      $title   = $fecha.''.$merma[1];

      }

      if($produccion[0] != 0){
         $tb .= '<span style="font-weight:bold;">'.evaluar2($produccion[0]).' / '.evaluar2($mermas).'</span>';

      }

  return $tb;
}

function desgloze_4_dias_atras($obj,$id_Producto,$date,$diasmerma){
  $tb             = '';
  $promedio       = 0;
  $promedio_m     = 0;
  $contador_prod  = 0;
  $contador_merma = 0;
  $arreglo_dias   = [];

  for ($i=3; $i >=1 ; $i--) {

    $dia = date("Y-m-d",strtotime($date."- ".$i." days"));
    $produccion = $obj-> PRODUCCION_X_FECHA(array(1,$id_Producto, $dia));
    $mermas     = 0;
    $title      = '';

     if($diasmerma !=0){
       $proximo = $i + $diasmerma;
        $dia = date("Y-m-d",strtotime($date."- ".$proximo." days"));

       $merma  = $obj-> PRODUCCION_X_FECHA(array(2,$id_Producto,$dia));
       $mermas = $merma[0];
       $title  = $merma[1];
     }

     if($produccion[0] != 0){

       array_push($arreglo_dias,  '<span style="font-weight:bold;">'.evaluar2($produccion[0]).' /  '.$mermas.'</span>');
     }

   }

    return $arreglo_dias;
}

function list_($obj,$th){
    $th     = ['Folio','Cliente','Fecha','Estado',''];



    # Declarar variables
    $fi      = $_POST['fi'];
    $ff      = $_POST['ff'];
    $arreglo = [$fi,$ff];
    $__row   = [];

    # Sustituir por consulta a la base de datos
    $list    = $obj->list_($arreglo);
    $total_productos = count($list);

    foreach ($list as $_key) {

        $__row[] = array(
            'id'     => $_key['idLista'],
            'nombre' => $_key['nombredestino'],
            "fecha"  => $_key['fecha_folio'],
            "dia"    => $_key['fecha_folio'],
            'stado'  => $_key['id_estado'],
            "opc"    => $fi
        );

    }// end lista de folios

    // Encapsular arreglos
    $encode = [
        "thead" => $th,
        "row" => $__row
    ];

    return $encode;
}

function ticket_head($data){

  return  '

      <div style="margin-bottom:15px;" class="col-sm-12   ">

      <table style="font-size: .87em; " class="table table-bordered  table-sm">


      <tr>
           <td class="col-sm-1 bg-default"> <strong> FECHA :  </strong></td>
      <td class="col-sm-3 text-endx"> '.$data['fecha'].' - '.$data['hora'].'</td>

        <td class="col-sm-4 text-center" style="font-size:1.2em;"> LINEA DE PRODUCCIÓN: <strong>'.$data['titulo'].'</strong>  </td>

        <td class="col-sm-1 bg-default"> <strong> FOLIO: </strong></td>
        <td class="col-sm-3 text-end text-danger" style="font-size:1.2em;"><strong>'.$data['folio'].' </strong></td>
      </tr>

      <tr>

      <td class="col-sm-1 bg-default"><b>DÍA :</b></td>
        <td class="col-sm-3 text-endx text-uppercase">'.$data['dia'].'</td>

      <td class="col-sm-4"></td>

      <td class="col-sm-1 bg-default"><strong>  TURNO :  </strong></td>
      <td class="col-sm-3 text-end text-uppercase">  '.turno($data['turno']).'  </td>

      </tr>

      <tr>

      <td  class="text-right" colspan="4"> TOTAL DE PRODUCCIÓN:   </td>

      <td class="text-right">
      <div class="input-group">
      <span class="input-group-text fw-bold" id="basic-addon2"> $ </span>

      <input
        id="TotalProduccionCtrl"
        style="font-size:1.4em; "
        class="form-control form-control-sm text-end fw-bold text-primary"
        value="'.$data['total'].'"  disabled >

      </div>
      </td>
      </tr>

      </table>

      </div>

   ';

}

function formatDAYSpanishDate($fecha = null){

    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo     = strtotime($fecha);
    $formatoFecha    = "%A";                                   // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}

function _input_group($data){
    // onkeyup="'.$data[3].'('.$data[0].')"

    return '

    <div class="input-group">
        <button onclick="QuitarLista('.$data[0].')" class="btn btn-sm btn-outline-secondary" type="button"><i class="icon-trash-empty"></i></button>
        <input type="number" value="' . $data[2] . '" id="'.$data[0].'"
               name="sugerencia"
               class="form-control form-control-sm text-end"
               placeholder="Ingresa un valor"
        >
    </div>
    ';
}

function _get_total_produccion($obj, $id_folio){

    $ls = $obj->__getTotalProductos([$id_folio]);

    $x = 0;
    $total = 0;
    $cantidad = 0;

    // // $costo      = 0;

    foreach ($ls as $key) {
        $sugerencia = $key['sugerencia'];
        $total = $key['costo'];


        $x += $sugerencia * $total;

    }


    return $x;
}
#----------------------
# Complementos
#----------------------
function _input($data){
// onkeyup="'.$data[3].'('.$data[0].')"
    return '
    <div class="input-group">
      <span class="input-group-text" id="basic-addon2"> $ </span>
      <input type="number" id="'.$data[1].''.$data[0].'" value="' . $data[2] . '"  class="form-control form-control-sm text-end" disabled>
    </div>
    ';
}

function DynamicRow($ls) {
    $__row = [];
    foreach ($ls as $fila) {

        foreach ($fila as $key => $valor) {

            $fila[$key] = $valor;
        }

        $fila['opc'] = 0;

        $__row[] = $fila;
    }
    return $__row;
}

function DynamicRowBTN($ls,$btn) {
    $__row = [];
    foreach ($ls as $fila) {
    $_btn  = [];

        foreach ($fila as $key => $valor) {

            $fila[$key] = $valor;
        }

        $_btn        = $btn;
        $fila['btn'] = $_btn;

        $__row[] = $fila;
    }
    return $__row;
}

function evaluar2($val){
    return $val ? $val : '-';
}

function obtenerDiaSemana($fecha) {
  // Crear un objeto DateTime con la fecha proporcionada
    $fecha_objeto = new DateTime($fecha);

    // Crear un formateador de fecha con el idioma español
    $formateador = new IntlDateFormatter('es_ES', IntlDateFormatter::FULL, IntlDateFormatter::NONE);

    // Formatear la fecha para obtener el día de la semana en español
    $dia_semana_espanol = $formateador->format($fecha_objeto);

    return $dia_semana_espanol;
}

function formatSpanishDate($fecha = null) {
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    $formatoFecha = "%A"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}



function turno($opc){
  $lbl_status = '';

  switch($opc){

    case 1:
          $lbl_status = 'Normal';
    break;

    case 2:
        $lbl_status = 'Matutino';
    break;

     case 3:
        $lbl_status = 'Vespertino';
    break;

  }

  return $lbl_status;
}

function status_day($opc){
  $lbl_status = '';
  switch($opc){

    case 1:
          $lbl_status = '<i class="text-warning  icon-bell-alt"></i> ';
    break;

    default:
        $lbl_status = '';
    break;

  }

  return $lbl_status;
}

function status_receta($opc){
  $lbl_status = '';
  switch($opc){

    case 1:
          $lbl_status = '<i class="text-success ">activo</i> ';
    break;

    default:
      $lbl_status = '<i class="text-danger ">no activo</i> ';

      break;
  }

  return $lbl_status;
}

#----------------------
# Package JSON
#----------------------
 echo json_encode($encode);
?>
