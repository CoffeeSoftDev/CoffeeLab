











<?php

$encode = [];
// # Incluir el modelo
// require_once('../mdl/mdl-gestion-de-ventas.php');
// $obj = new Gestiondeventas();

// require_once('../../../conf/_Utileria.php');
// $util = new Utileria;

// $lsFolio = $obj->lsDataTicket([$_POST['id']]);
// foreach ($lsFolio as $key)
//     ;
// $data = [
//     'fecha'   => $key['fecha'],
//     'titulo'  => '<span class="text-primary">' . $key['Nombre_Area'] . ' </span>',
//     'folio'   => $key['folio'],
//     'hora'    => $key['hora'],
//     'estado'  => $key['new_estado'],
//     'id_tipo' => $key['estado_revisado'],
// ];

// // Cabecera de formato
// $html = '
//     <div class="p-3">

//      <div style="margin-top:10px;" class=" col-12">
//  <table style="font-size:.76em; " class="tb tb-bordered">
     
//     <tr>
//         <td class="col-sm-1 bg-disabled fw-bold">FECHA: </td>
//         <td class="col-sm-2">' . $data['fecha'] . ' </td>
//         <td class="col-sm-6 text-center"> <strong> LINEA DE PRODUCCION ' . $data['titulo'] . '</strong> </td>
//         <td class="col-sm-1 bg-disabled fw-bold"> FOLIO:  </td>
//         <td class="col-sm-2 text-right text-end text-danger fw-bold">' . $data['folio'] . '</td>
//     </tr>

//     <tr>
//         <td class="col-sm-1 bg-disabled fw-bold"> HORA:  </td>
//         <td class="col-sm-2">' . $data['hora'] . '</td>
//         <td class="col-sm-6"></td>
//         <td class="col-sm-1 fw-bold bg-disabled ">DIA: </td>
//         <td class="col-sm-2 text-uppercase ">  ' . formatDAYSpanishDate($data['fecha']) . ' </td>
//     </tr>
      
//       </table>
//       </div>
  
//     ';

//     $__row = [];
//     $total_aprox = 0;

//     # Lista de productos     
//     $ls = $obj->lsProduccion(array($_GET['id']));

//     foreach ($ls as $_key) {

// //         // $_key['cantidad'] = $_key['cantidad'] != null ? $_key['cantidad'] : '';
// //         // $_key['total'] = $_key['total'] != null ? $_key['total'] : '';

//     $totalx        = $_key['sugerencia'] * $_key['costo'];
//     $total_aprox += $totalx;

//         $__row[] = array(

//             'Producto' => '<span class="text-uppercase">' . $_key['NombreProducto'] . '</span>',
//             'Cantidad'     => $_key['sugerencia'],
//             'precio'   => $_key['costo'],
//             'total'    => $totalx,
//         );



//     }

// $__row[] = array(

//     'Producto' => '<strong> TOTAL </strong>',
//     'Cantidad' => '',
//     'precio' => '',
//     'total' => '<strong style="font-size:1.2em;">'.$total_aprox.'</strong>',
// );
// $html .= simple_tabla_php($__row);











// function simple_tabla_php($row){
//     $thead = '';
//     $tbody = '';

//     $thead .= "<tr>";
//     $position = 0;
//     foreach ($row[0] as $key => $value):
//         $align = ($position == 0) ? 'text-start' : 'text-end';
//         $thead .= "<th class='{$align}'> " . ucfirst($key) . "</th>";
//         $position++;
//     endforeach;

//     $thead .= '</tr>';


//     foreach ($row as $rows => $keyx):
//         $tbody .= "<tr>";
//         $position = 0;
//         foreach ($keyx as $value):
//             $align = ($position == 0) ? 'text-start' : 'text-end';

//             $tbody .= "<td class='{$align}'> " . $value . "</td>";
//             $position++;
//         endforeach;
//         $tbody .= '</tr>';
//     endforeach;




//     // Imprime los resultados en una tabla

//     $table .= '
//         <table style="margin-top:15px; font-size:.68em; font-weight:500;"
//          class="tb tb-report" width="100%" id="tb-formato-">

//         <thead>
//           ' . $thead . '
//         </thead>

//         <tbody>
//            ' . $tbody . '
//         </tbody>
//         </table>
//     ';


//     return $table;
// }
// function formatDAYSpanishDate($fecha = null){

//     setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

//     if ($fecha === null) {
//         $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
//     }

//     // Convertir la cadena de fecha a una marca de tiempo
//     $marcaTiempo     = strtotime($fecha);
//     $formatoFecha    = "%A";                                   // Formato de fecha en español
//     $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

//     return $fechaFormateada;
// }

// $html = ob_get_clean();
// echo $html;



// require_once ('../src/libreria/dompdf/autoload.inc.php');
// use Dompdf\Dompdf;
// $dompdf  = new Dompdf();

// $enlace = $util->url();

// $url = '../../../../erp_files/formato/';

// $options = $dompdf->getOptions();
// $options->set(['isRemoteEnabled' => true]);
// $dompdf->setOptions($options);

// $dompdf->loadHtml($html);
// $dompdf->setPaper('letter');
// $dompdf->render();

// $contenido = $dompdf->output();
// $rutaArchivoPdf = $url . 'pedido.pdf';
// $bytesEscritos = file_put_contents($rutaArchivoPdf, $contenido);


// $ruta = $enlace[0] . 'erp_files/formato/';


// $encode = [
//     'ok' => $bytesEscritos,
//     'html' => $ruta,
//     'table' => $html
// ];

echo json_encode($encode);