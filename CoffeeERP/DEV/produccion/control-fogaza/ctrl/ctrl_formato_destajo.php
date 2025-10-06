

<!DOCTYPE html>
<html lang="es" dir="ltr">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=gb18030">

    <link rel="stylesheet" href="../../../src/plugin/bootstrap-5/css/bootstrap.min.css">
  
    <!-- <link rel="stylesheet" href="../icon-font/fontello.css"> -->
    <!-- CSS  -->
    <link rel="stylesheet" href="https://plugins.erp-varoch.com/style.css" />

    <script type="text/javascript">
    function miticket() {
        if (window.print) {
            window.print();
            // setTimeout(window.close(),5000);
        } else {
            alert("No se puede imprimir en este navegador.");
        }
    }
    </script>

</head>

<body onload="miticket()">


<?php



// # Incluir el modelo
require_once('../mdl/mdl-gestion-de-ventas.php');
$obj = new Gestiondeventas();

// require_once('../../../conf/_Utileria.php');
// $util = new Utileria;

 $lsFolio= $obj->lsDataTicket([$_GET['id']]);
foreach ($lsFolio as $key);
$data=[
            'fecha'   => $key['fecha'],
            'titulo'  => '<span class="text-primary">' . $key['Nombre_Area'] . ' </span>',
            'folio'   => $key['folio'],
            'hora'    => $key['hora'],
            'estado'  => $key['new_estado'],
            'id_tipo' => $key['estado_revisado'],
];

// Cabecera de formato
$tb .= '
    <div class="p-3">

     <div style="margin-top:10px;" class=" col-12">
 <table style="font-size:.76em; " class="tb table-bordered">
     
    <tr>
        <td class="col-sm-1 bg-default fw-bold">FECHA: </td>
        <td class="col-sm-2">' . $data['fecha'] . ' </td>
        <td class="col-sm-6 text-center"> <strong> LINEA DE PRODUCCION ' . $data['titulo'] . '</strong> </td>
        <td class="col-sm-1 bg-default fw-bold"> FOLIO:  </td>
        <td class="col-sm-2 text-right text-end text-danger fw-bold">' . $data['folio'] . '</td>
    </tr>

    <tr>
        <td class="col-sm-1 bg-default fw-bold"> HORA:  </td>
        <td class="col-sm-2">' . $data['hora'] . '</td>
        <td class="col-sm-6"></td>
        <td class="col-sm-1 fw-bold bg-default ">DIA: </td>
        <td class="col-sm-2 text-end">  ' . formatSpanishDate($data['fecha']) . ' </td>
    </tr>
      
      </table>
      </div>
  
    ';


$total_general = 0;
$__row =[];
$lsAreas = $obj-> Select_Areas([$_GET['id']]); 

foreach ($lsAreas as $_key) {

       # Lista de productos     
        $sql_producto = $obj->Select_Productos($_key['idArea'],$_GET['id']);
        foreach ($sql_producto as $_key) {

            $_key['cantidad'] = $_key['cantidad'] != null ? $_key['cantidad'] : '';
            $_key['total']    = $_key['total']    != null ? $_key['total'] : '';
            
            $__row[] = array(
                'Producto' => '<span class="text-uppercase">' . $_key['NombreProducto'] . '</span>',
                'Real'     => $_key['cantidad'],
                'precio'   => $_key['costo'],
                'total'    => $_key['total'],
            );
         

            $total_general += $_key['total'];
        }



}

$tb .= simple_tabla_php($__row);

    // -- Pie de formato --


$tb .= '
    <div class="mt-3">
    <table style="font-size:.8em; font-weight:500;" class="tb tb-bordered table-condensed ">';

$tb .= '
    
    <tr > 
      <td class="bg-disabled" >TOTAL : </td>
      <td class="text-end">' . evaluar($total_general) . '</td>
    </tr>';

# Calculo del destajo 

$total_destajo = $total_general * 0.098;



#------
$tb .= '
    <tr > 
      <td class="bg-disabled" >DESTAJO : </td>
      <td class="text-end">' . evaluar($total_destajo) . '</td>
    </tr>


    </table></div></div>
    ';

 

echo $tb ;

function formatSpanishDate($fecha = null)
{
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

function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

function simple_tabla_php($row){
    $thead = '';
    $tbody = '';
    
    $thead .= "<tr>";
    $position = 0;
    foreach ($row[0] as $key => $value): 
    $align = ($position == 0) ? 'text-start' : 'text-end';
         $thead .= "<th class='{$align}'> " . ucfirst($key) . "</th>";
     $position++;
    endforeach;

     $thead .= '</tr>';


     foreach ($row as $rows => $keyx):
        $tbody .= "<tr>";
        $position = 0;
        foreach ($keyx as $value):
            $align = ($position == 0) ? 'text-start' : 'text-end';    
            
            $tbody .= "<td class='{$align}'> " . $value . "</td>";
            $position++;    
        endforeach;
        $tbody .= '</tr>';
    endforeach;
    
    


    // Imprime los resultados en una tabla

    $table .= '
        <table style="margin-top:15px; font-size:.68em; font-weight:500;"
         class="tb table-report" width="100%" id="tb-formato-">

        <thead>
          ' . $thead . '
        </thead>

        <tbody>
           ' . $tbody . '
        </tbody>
        </table>
    ';


    return $table;
}