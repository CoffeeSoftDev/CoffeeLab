<?php

if(empty($_POST['opc'])){
exit(0);
}

require_once('../mdl/mdl-productos-vendidos.php');
$obj = new Productosvendidos;
$fz = new __LineaProduccion;

require_once('../mdl/mdl-soft-restaurant.php');
$soft = new __SoftRestaurant;

$encode = [];

switch ($_POST['opc']) {

case 'dias-pendientes':
  $encode = lsDiasPendientes($obj);
break;

case 'ls':
  $encode = lsProductosVendidos($soft);
break;

case 'lsVentas':
  $encode = lsBTN($soft);
break;

case 'lsBitacora':
  $encode = lsBitacora($obj);
break;  

}

function lsBitacora($obj) {

    $__row = [];
    $th = ['Fecha', 'Folio', 'Ventas', 'Productos', 'Rpt Cheque Promedio', 'Rpt Desplazamiento'];

    # -- variables para fechas
    $fi = new DateTime($_POST['Anio'] . '-05-01');
    $hoy = new DateTime();

    $contar_dias_ventas = 0;
    $contar_dias_promedio = 0;

    while ($fi <= $hoy) {

        $fecha = $fi->format('Y-m-d');
        $fb = $fi->format('d-m-Y');
        $lsFolio = $obj->existe_folio([$fecha, $_POST['UDN']]);
        $folio = '';

        $monto_productos_vendidos = 0;
        $monto_ventas_dia = 0;
        $file_productos_vendidos = '';
        $file_ventas_dia = '';

        foreach ($lsFolio as $key) {

            $folio = $key['id_folio'];
            $monto_productos_vendidos = $key['monto_productos_vendidos'];
            $monto_ventas_dia = $key['monto_ventas_dia'];
            $file_productos_vendidos = $key['file_productos_vendidos'];
            $file_ventas_dia = $key['file_ventas_dia'];

        }

        $pintar = 0;

        if ($monto_productos_vendidos == 0) {
            $contar_dias_ventas++;
            $pintar = 1;

        }

        if ($monto_ventas_dia == 0) {
            $contar_dias_promedio++;
            $pintar = 1;

        }

        // $f = formatSpanishDate($fecha);
        $__row[] = array(
            'id' => '',
            'f' => $fecha,
            't' => $folio,
            'r' => evaluar($monto_productos_vendidos),
            'rp' => evaluar($monto_ventas_dia),
            'ff' => status_ico($file_ventas_dia),
            'fff' => status_ico($file_productos_vendidos),
            "opc" => $pintar
        );

        $fi->modify('+1 day');

    }

    // Encapsular arreglos
    $encode = [
        "thead" => $th,
        "row" => $__row,
        "dias" => $contar_dias_promedio
    ];

    return $encode;
}


function lsBTN($obj){
    # Variables
    $fecha = $_POST['fecha'];
    $__row = [];
    $udn = $_POST['udn'];
    $id_folio = $obj->get_folio([$fecha, $udn]);


    $list = $obj->reporte_ventas([$id_folio]);
    $total_general = 0;

    foreach ($list as $_key) {


        
         $__row[] = array(
            'id'        => $_key['id_venta'],
            'area'      => $_key['arearestaurant'],
            'personas'  => $_key['personas'],
            'cuentas'   => $_key['cuentas'],
            'alimentos' => evaluar($_key['alimentos']),
            'bebidas'   => evaluar($_key['bebidas']),
            'otros'     => evaluar($_key['otros']),
            'subtotal'  => evaluar($_key['subtotal']),
            'iva'       => evaluar($_key['iva']),
            'total'     => evaluar($_key['total']),
       
            "opc" => 0
        );

     $total_general += $_key['total'];
    }
        

$encode = [
"thead" => '',
"row"   => $__row,
"total" => evaluar($total_general)
];

    return $encode;
}

function lsPaquetes($obj,$id,$grupo = 'CORTES'){
    $paquetes = [];

    # lista de paquetes unicamente Sonoras Meat 
    $lsPAQ = $obj->reporte_paquetes_vendidos(array($id, 4));

    $total = 0;

    foreach ($lsPAQ as $_key) {

        // $paquetes[] = array(
        //     'id' => $_key['id'],
        //     'Categoria' => $_key['descripcion'],
        //     'cantidad' => $_key['cantidad'],
        //     'precio venta' => '',
        //     'grupo' => '',
        //     'opc' => 2
        // );

        $ls = $obj->desgloze_paquete2([$_key['id']]);    

    foreach ($ls as $key) {
        if ($key['desc_grupo'] == $grupo) {
                    
                    
                $total_paquete = $_key['cantidad'] * $key['costo_producto'];
                $total = $total + $total_paquete;

                    // $paquetes[] = array(
                    //     'id'           => $_key['id'],
                    //     'Categoria'    => $key['descripcion'].' > '. $key['desc_grupo'],
                    //     'cantidad'     => $_key['cantidad'],
                    //     'precio venta' => $key['costo_producto'],
                    //     'grupo'        => $total_paquete,
                    //     'opc'          => 0
                    // );

                   



        }
    }
       
    }// end
    
    if($total != 0)
    $paquetes = array(
        'id'           => '',
        'Categoria'    => 'PAQ. '. $grupo,
        'cantidad'     => evaluar($total),
        'precio venta' => '',
        'grupo'        => '',
        'opc'          => 2
    );


    return [
        "thead" => '',
        "row" => $paquetes,
        "total" => $total 
    ];



    

}

function lsProductosVendidos($obj){
    $fecha         = $_POST['fecha'];
    $__row         = [];
    $udn           = $_POST['udn'];
    $id_folio      = $obj->get_folio([$fecha, $udn]);
    $total_general = 0;
    $subtotal      = 0;

    // Totales por grupo
    $alimentos        = 0;
    $bebidas          = 0;
    $complementos     = 0;
    $servicio_dom     = 0; 
    $carbon           = 0; 
    $sales            = 0; 
    $mostrarLista     = false;


    $lsgrupoc = $obj->soft_grupoc_erp(array($udn));
  
    foreach ($lsgrupoc as $key) {

        $total_grupo_erp = 0;

        $paq = lsPaquetes($obj, $id_folio, $key['name']);
        
        $__row[] = array(
            'id'            => $key['id'],
            'CATEGORIA'     => $key['name'],
            'TOTAL'         => '',
            'TOTAL SIN IVA' => '',
            'IVA'           => '',
            'opc'           => 1
        );
        
        $__row[]  = $paq['row'];
        $ls       = $obj->soft_grupoproductos([$udn,$key['id']]);
        
        foreach ($ls as $_key) {
        

            $total_grupo = 0;

            if ($_key['grupoproductos'] != 'CORTESIAS'){
                $list_grupo = $obj->soft_vendidos_por_grupo__(array($id_folio, $_key['idgrupo']));

                foreach($list_grupo as $keyx){
                    
                    if($mostrarLista)
                    $__row[] = array(
                        'id'             => $keyx['id'],
                        'NombreProducto' => $keyx['descripcion'],
                        'cantidad'       => $keyx['cantidad'],
                        'precio venta'   => $keyx['precioventa'],
                        'total'          => $keyx['cantidad'] * $keyx['precioventa'],
                        'opc'            => 1
                    );

                    $total_grupo += $keyx['cantidad'] * $keyx['precioventa'];

                }


                $total_grupo_erp += $total_grupo ;
// 

                $iva_subcategoria       = 0;
                $sub_total_subcategoria = 0;

                if($key['id'] != 35 && $key['id'] != 1){
                    $sub_total_subcategoria = $total_grupo / 1.08;

                    $iva_subcategoria = $total_grupo - $sub_total_subcategoria;
                }


                if($total_grupo !=0)
                    $__row[] = array(
                        'id'             => $_key['idgrupo'],
                        'NombreProducto' => $_key['grupoproductos'],
                        'total'          => evaluar($total_grupo),
                        'cantidad'       => evaluar($sub_total_subcategoria),
                        'precio venta'   => evaluar($iva_subcategoria),
                        'opc'            => 0
                    );


            }
        
        }// end foreach de grupo
        
        $total_categoria = $total_grupo_erp+ $paq['total'];
        $total_general += ($total_grupo_erp+ $paq['total']);

        $subtotal = 0;

        if( $key['id'] != 35 && $key['id'] != 1 ){
            $subtotal  = $total_categoria / 1.08;
            $iva       = $total_categoria - $subtotal;
        }



        if($key['id'] ==  1)
            $alimentos = $total_categoria;

        if ($key['id'] == 3)
            $bebidas   = $subtotal;

        if ($key['id'] == 2)
            $complementos = $subtotal;

        if ($key['id'] == 5)
            $servicio_dom = $subtotal;

        if ($key['id'] == 4)
            $carbon = $subtotal;
        
        if ($key['id'] == 35)
            $sales = $total_categoria;
        



        if ($total_grupo_erp != 0)

        $__row[] = array(
            'id'             => $key['id'],
            'NombreProducto' => '<b>TOTAL </b>',
            'total'          => evaluar($total_grupo_erp + $paq['total']),
            'cantidad'       => evaluar($subtotal),
            'precio venta'   => evaluar($iva),
            'opc' => 2
        );



    }



    /*-----------------------------*/
    /* Totales por grupo
    /*-----------------------------*/

    if($_POST['udn'] == 5){ // Sonora's Meat

        $total_productos_vendidos     = $alimentos + $bebidas + $complementos + $servicio_dom + $carbon + $sales;
        $total_iva_productos_vendidos = $total_general - $total_productos_vendidos;
        
        $grupo = [
           'ALIMENTOS'    => evaluar($alimentos),
           'BEBIDAS'      => evaluar($bebidas),
           'GUARN'        => evaluar($complementos),
           'SALES'        => evaluar($sales),
           'DOMICILIO'    => evaluar($servicio_dom),
           'ADITAMENTOS'  => evaluar($carbon),
           'IVA'          => evaluar($total_iva_productos_vendidos),
           'SUBTOTAL'          => evaluar($total_productos_vendidos),
        ];

    } else if($_POST['udn'] == 4) {

    }



    $frm = ticket_footer([
        'total'   => $total_general,
        'destajo' => ''

    ],$grupo);


    // Encapsular arreglos
    return [
        "thead"    => '',
        "row"      => $__row,
        "frm_foot" => $frm,
        "total"    => evaluar($total_general)
    ];

}

function ticket_footer($data,$grupo = []){
  

    // $lsgrupoc_erp = $obj->soft_grupoc_erp(array($_POST['udn']));
    $ipt_group = "<div class='row'>";
    
    foreach($grupo as $rows => $key):
       
        $ipt_group .= "
        <div class='col-sm-3 mb-2'>
            <div class='input-group'>
            <span style='font-size:.6em; font-weight:700;' class='input-group-text'>{$rows}</span>

            <input disabled style='font-size:.8em; font-weight:700;'
            class='form-control input-sm text-end' 
            value = '{$key}' >
            </div>
        </div>
        ";
    endforeach;
        
    $ipt_group .= "</div>";

    return '
    <table style="font-size:1em;" class="tb mb-2">
          <tr>
            <td class="col-8">
                <label id="respuesta"> </label>
                <b>TOTAL </b>
            </td>
            <td class="text-end"> 
             '.evaluar($data['total']).'
            </td>
          </tr>
    </table>
    
    ' . $ipt_group . '
    ';



}

# ===========================
#  Contar fechas pendientes   
# ===========================
function lsDiasPendientes($obj){

    $__row = [];
    $th = ['Fecha', 'Folio', 'Reporte de ventas', 'Reporte de productos', 'Productos vendidos', 'Ventas'];

    # -- variables para fechas
    $fi = new DateTime($_POST['Anio'] . '-' . $_POST['Mes']. '-01');

    // Clonar el objeto para evitar modificar la fecha inicial
    $hoy = clone $fi;

    // Modificar la fecha clonada para obtener el último día del mes
    $hoy->modify('last day of this month');

    $contar_dias_ventas = 0;
    $contar_dias_promedio = 0;
    $idRow = 0;

    $totalGralVentas = 0;
    $totalGralProductos = 0;

    while ($fi <= $hoy) {
        $idRow++;

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

      
        //     /* Crear botones */ 
        $btn = [];

      

        $btn[] = [
            "fn"    => 'fn_modal',
            "color" => 'primary p-1',
            "icon"  => 'icon-shop'
        ];

        // Calcular suma de las ventas del dia:
        $total =    $obj->getVentas([$folio]);
        
        $lbl = '';

        if(number_format($monto_productos_vendidos, 2, '.', ',') != number_format($total, 2, '.', ','))
        $lbl = '<span class="text-muted">El precio '.number_format($monto_productos_vendidos, 2, '.', ',').' es diferente </span>';

     
        $__row[] = array(

            'id'                   => $idRow,
            'fecha'                => $fecha,
            'folio'                => $folio,

            'REPORTE DE VENTAS'    => evaluar($monto_productos_vendidos),
            'REPORTE DE PRODUCTOS' => evaluar($total),
            'Observaciones'        => $lbl,
            'RPT CHEQUE PROMEDIO'  => status_($file_ventas_dia),
            'RPT DESPLAZAMIENTO'   => status_($file_productos_vendidos),

            'btn'              => $btn
            // 'opc'=> 0
       
        );

        $totalGralVentas += $total;
        $totalGralProductos += $monto_productos_vendidos;


        $fi->modify('+1 day');

    }


    // Sumar los dias

    // $__row[] = [
    //     'id'                   => '',
    //     'fecha'                => 'TOTAL DE VENTAS:',
    //     'folio'                => '',
    //     'REPORTE DE VENTAS'    => evaluar($totalGralProductos),
    //     'REPORTE DE PRODUCTOS' => evaluar($totalGralVentas),
    //     'Observaciones'        => '',
    //     'RPT CHEQUE PROMEDIO'  => '',
    //     'RPT DESPLAZAMIENTO'   => '',
      
    //     'btn'                => [],
    // ];
    

    // Encapsular arreglos
    $encode = [
        "thead" => '',
        "row"   => $__row,
        "dias"  => $contar_dias_promedio
    ];

    return $encode;
}

function opc_btn($data){

    return  "

    
    <a class='btn btn-outline-primary btn-sm' onclick='fn_modal()'> 
        <i class='icon-doc-text-2' ></i> </a>

    
        
    ";

    //   <label class='btn btn-outline-success btn-sm'><i class='icon-upload'></i>
    //     <input class='hide' type='file' id='btn{$data["id"]}' onclick='subir_fichero_ventas({$data["id"]})' >
    //     </label>


}



echo json_encode($encode);


// --- Funciones de apoyo ---

function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

function status_($opc){
    $lbl_status = '';
    switch ($opc) {

        case 1:
            $lbl_status = '<i class="text-success icon-ok-circle-1"></i> ';
            break;

        case 2:
        default:
            $lbl_status = '<i class="text-warning  icon-warning-1"></i> ';
            break;

    }

    return $lbl_status;
}


function status_ico($opc)
{
    $lbl_status = '';
    switch ($opc) {

        case 1:
            $lbl_status = '<i class="text-success icon-check-2"></i>  ';
            break;

        case 2:
        default:
            $lbl_status = '<i class="text-warning  icon-warning-1"></i> ';
            break;

    }

    return $lbl_status;
}

