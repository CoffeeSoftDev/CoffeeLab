<?php

if (empty($_POST['opc']))
    exit(0);

// incluir tu modelo
require_once ('../mdl/mdl-softrestaurant.php');
require_once('../../conf/coffeSoft.php');
require_once '../../conf/_Utileria.php';


class ctrl extends SoftRestaurant{
    public $util;

     public function __construct() {
        
        parent::__construct(); // Llama al constructor de la clase padre
        $this->util = new Utileria(); // Inicializa la propiedad util
    }


    function lsProductosVendidos(){
        $__row         = [];
        $udn           = $_POST['udn'];
        $fecha         = $_POST['iptSoftFecha'];
        $id_folio      = $this ->get_folio([$fecha, $udn]);

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

        // Total kpi con iva

        $grupos_kpi           =[]; 
        $alimentos_iva        = 0;
        $bebidas_iva          = 0;
        $complementos_iva     = 0;
        $servicio_dom_iva     = 0; 
        $carbon_iva           = 0; 
        $sales_iva            = 0; 
       
        $lsgrupoc = $this->soft_grupoc_erp([$udn]);

    
        foreach ($lsgrupoc as $key) {

            $total_grupo_erp = 0;

            $paq = $this :: lsPaquetes( $id_folio, $key['name']);
            
            $__row[] = array(
                'id'            => $key['id'],
                'CATEGORIA'     => $key['name'],
                'TOTAL'         => '',
                'TOTAL SIN IVA' => '',
                'IVA'           => '',
                'opc'           => 1
            );
            
            $__row[]  = $paq['row'];
            $ls       = $this -> soft_grupoproductos([$udn,$key['id']]);
            
            foreach ($ls as $_key): 
                $total_grupo = 0;

                if ($_key['grupoproductos'] != 'CORTESIAS'){

                    $list_grupo = $this -> soft_vendidos_por_grupo__([$id_folio,$_key['idgrupo']]);
                    $productos = [];
                    foreach($list_grupo as $keyx):
                        
                       
                        $productos[] = array(
                            'id'             => $keyx['id_Producto'],
                            'NombreProducto' => $keyx['id_Producto'].'-'.$keyx['descripcion'],
                            'total'          => $keyx['cantidad'] * $keyx['precioventa'],
                            'cantidad'       => $keyx['cantidad'],
                            'precio venta'   => $keyx['precioventa'],
                            'opc'            => 2
                        );

                        $total_grupo += $keyx['cantidad'] * $keyx['precioventa'];

                    endforeach;


                    $total_grupo_erp += $total_grupo ;
    
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


                     if($mostrarLista)
                     $__row = array_merge($__row,$productos);   


                }
            endforeach;
            
            $total_categoria = $total_grupo_erp+ $paq['total'];
            $total_general += ($total_grupo_erp+ $paq['total']);

            $subtotal = 0;

            if( $key['id'] != 35 && $key['id'] != 1 ){
                $subtotal  = $total_categoria / 1.08;
                $iva       = $total_categoria - $subtotal;
            }

            if ($key['id'] == 1) {
                $alimentos = $total_categoria;
                $grupos_kpi['alimentos'] = $total_categoria;
            }

            if ($key['id'] == 3) {
                $bebidas = $subtotal;
                $grupos_kpi['bebidas'] = $total_categoria;
            }

            if ($key['id'] == 2) {
                $complementos = $subtotal;
                $grupos_kpi['complementos'] = $total_categoria;
            }

            if ($key['id'] == 5) {
                $servicio_dom = $subtotal;
                $grupos_kpi['servicio_dom'] = $total_categoria;
            }

            if ($key['id'] == 4) {
                $carbon = $subtotal;
                $grupos_kpi['carbon'] = $total_categoria;
            }

            if ($key['id'] == 35) {
                $sales = $total_categoria;
                $grupos_kpi['sales'] = $total_categoria;
            }
            

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
        $data_ventas = [];

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
                'SUBTOTAL'     => evaluar($total_productos_vendidos),
            ];

            // Solo por la junta / agregar iva.
         
            $data_ventas['alimentos'] = $grupos_kpi['alimentos'];
            $data_ventas['bebidas']   = $grupos_kpi['bebidas'];
            $data_ventas['AyB']       = $grupos_kpi['alimentos'] + $grupos_kpi['bebidas'];
            
            $data_ventas['guarniciones'] = $grupos_kpi['complementos'];
            $data_ventas['domicilio']    = $grupos_kpi['servicio_dom'];
            $data_ventas['sales']        = $grupos_kpi['sales'];
            
            $isCreatedFolio           =  $this -> getCreatedFolio([ $id_folio ]);
         
            // Revisar en el tablero .

            if (!$isCreatedFolio) { // agregar a sistema

                $data_ventas['soft_folio'] = $id_folio;
                $updt                      = $this->util->sql($data_ventas);
                $query                     = $this->add_Ventas($updt);

            } else { // actualizar registros

                $data_ventas['id_venta'] = $isCreatedFolio[0]['id_venta'];
                $updt                    = $this-> util->sql($data_ventas, 1);
                $query                   = $this->actualizarVentas($updt);

            }


        } else if($_POST['udn'] == 4) {




        }



        $frm = ticket_footer([
            'total'   => $total_general,
            'destajo' => ''
        ],$grupo);

        $head =ticket_head(array(
            'folio' => $id_folio,
            'fecha' => formatSpanishDate($fecha),
            'title' => 'Reporte de ventas'
        ));


        // Encapsular arreglos
        return [
            "thead"    => '',
            "row"      => $__row,
            "frm_foot" => $frm,
            'frm_head' => $head,
            "add"      => $data_ventas
        ];

    }

    function lsPaquetes($id,$grupo = 'CORTES'){
        $paquetes = [];

        # lista de paquetes unicamente Sonoras Meat 
        $lsPAQ = $this->reporte_paquetes_vendidos(array($id, 4));

        $total = 0;

        foreach ($lsPAQ as $_key) {

            // $paquetes[] = array(
            //     'id'           => $_key['id'],
            //     'Categoria'    => $_key['descripcion'],
            //     'cantidad'     => $_key['cantidad'],
            //     'precio venta' => $id,
            //     'grupo'        => '',
            //     'opc'          => 2
            // );

            $ls = $this ->desgloze_paquete2([$_key['id']]);    

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

    function lsVentas(){

        # Variables
        $fecha    = $_POST['iptSoftFecha'];
        $__row    = [];
        $udn      = $_POST['udn'];
        $id_folio = $this->get_folio([$fecha, $udn]);


        $list = $this ->reporte_ventas([$id_folio]);
        $total_general = 0;

        foreach ($list as $_key) {



        $__row[] = array(
            
            'id'        => $_key['id_venta'],
            'area'      => $_key['arearestaurant'],
            'personas'  => $_key['personas'],
            'cuentas'   => $_key['cuentas'],

            'alimentos'    => evaluar($_key['alimentos']),
            'bebidas'      => evaluar($_key['bebidas']),
            'guarniciones' => evaluar($_key['guarniciones']),
            
            'otros'     => evaluar($_key['otros']),
            'subtotal'  => evaluar($_key['subtotal']),
            'iva'       => evaluar($_key['iva']),
            'total'     => evaluar($_key['total']),

            "opc" => 0
        );

            $total_general += $_key['total'];
        }

        // Cabecera.
          $head =ticket_head(array(
            'folio' => $id_folio,
            'fecha' => $fecha,
            'title' => $this ->bd
            
        ));


        return [
            'frm_head' => $head,
            "thead"    => '',
            "row"      => $__row,
            "total"    => evaluar($total_general)
        ];


    }

    function lsBitacora() {

        $__row = [];
        $th    = ['Fecha', 'Folio', 'Ventas', 'Productos', 'Rpt Cheque Promedio', 'Rpt Desplazamiento'];

        # -- variables para fechas
        // $fi = new DateTime($_POST['Anio'] . '-05-01');
        $fi= new DateTime($_POST['iptSoftFecha']);
        $fi->setDate($fi->format('Y'), $fi->format('m'), 1); // Establece el día a '01'

        $hoy = clone $fi;
        $hoy->modify('last day of this month'); // Establece el último día del mes


        $contar_dias_ventas = 0;
        $contar_dias_promedio = 0;

        while ($fi <= $hoy) {

            $fecha   = $fi->format('Y-m-d');
            $fb      = $fi->format('d-m-Y');
            $lsFolio = $this->getFolio([$fecha, $_POST['udn']]);
            $folio   = $lsFolio[0]['id_folio'];


                $monto_productos_vendidos = $lsFolio[0]['monto_productos_vendidos'];
                $monto_ventas_dia         = $lsFolio[0]['monto_ventas_dia'];
                $file_productos_vendidos  = $lsFolio[0]['file_productos_vendidos'];
                $file_ventas_dia          = $lsFolio[0]['file_ventas_dia'];


            $pintar = 0;


            $btn = [];

            $btn[] = [
                'color' => 'primary',
                'icon' => 'icon-table',
                'fn' => 'appSoft.addVentas',
               
            ];

        //     // $f = formatSpanishDate($fecha);
            $__row[] = array(

                'id'                 => $folio,
                'fecha'              => $fecha,
                'Folio'              => $folio,
                'productos vendidos' => evaluar($monto_productos_vendidos),
                'ventas diarias'     => evaluar($monto_ventas_dia),
                // 'ff' => status_ico($file_ventas_dia),
                // 'fff' => status_ico($file_productos_vendidos),
                "btn" => $btn
            );

            $fi->modify('+1 day');

        }

        // Encapsular arreglos
        $encode = [
            "thead" => '',
            "row" => $__row,
            "dias" => $contar_dias_promedio
        ];

        return $encode;
    }

    function addVentas(){

        $udn           = $_POST['udn'];
      
        $ls          = $this -> getGroups([$_POST['udn']]);
        $data_ventas = [];
        $row         = [];

        foreach ($ls as $grupo):

        //     $campo = strtolower($grupo['descripcion']);
            $ls    = $this -> soft_grupoproductos([$udn,$grupo['idgrupo']]);
            
        //     $total = 0;

            foreach ($ls as $group): 

                $row[] = [
                    'id'        => $group['idgrupo'],
                    'group'     => $group['grupoproductos'],
                    'Categoria' => '',
                    'TOTAL'     => $group['total'],
                    'opc'       => 1,
                ];

        //         $lsProducts = $this -> soft_vendidos_por_grupo__([$_POST['folio'] ,$group['idgrupo']]);


        //         foreach($lsProducts as $keyx):

        //             $row[] = array(
        //                 'id'             => $keyx['id_Producto'],
        //                 'NombreProducto' => $keyx['descripcion'],
        // //             //     'total'          => $campo,
        // //             //     // 'cantidad'       => $keyx['cantidad'],
        // //             //     'precio venta'   => $keyx['ventatotal'],
        //                 'opc'            => 0
        //             );

        //             $total += $keyx['ventatotal'];

        //         endforeach;

            endforeach;
            
        //     $data_ventas[$campo] = number_format($total, 4, '.', '');

        //     $row[]               = [ 
        //         'id'      => 0,
        //         'Grupo'   => $campo,
        //         'Ingreso' => evaluar($total),
        //         'opc'     => 0
        //     ];
        
        endforeach;


        // $data_ventas['AyB'] = $data_ventas['alimentos'] + $data_ventas['bebidas'];
        // $isCreatedFolio =  $this -> getCreatedFolio([ $_POST['folio'] ]);


        // if (!$isCreatedFolio) { // agregar a sistema

        //     $data_ventas['soft_folio'] = $_POST['folio'];

        //     $updt  = $this->util->sql($data_ventas);
        //     // $query = $this->add_Ventas($updt);

        // } else { // actualizar registros

        //     $data_ventas['id_venta'] = $isCreatedFolio[0]['id_venta'];
        //     $updt                    = $this-> util->sql($data_ventas, 1);
        //     // $query                   = $this->actualizarVentas($updt);

        // }



        return ['row' => $row, 'thead' => '', 'data' => $updt, 'query' => $query];


    }

    function lsKPI(){

        $fi    = new DateTime($_POST['iptSoftFecha']);
        $fi->setDate($fi->format('Y'), $fi->format('m'), 1); 

        $hoy   = clone $fi;
        $__row = [];
        $hoy->modify('last day of this month'); // Establece el último día del mes
        
        while ($fi <= $hoy) {
            
            $idRow++;

            $fecha      = $fi->format('Y-m-d');
            $softVentas = $this->getsoft_ventas([$_POST['udn'],$fecha]);

            $row = array(

                'id'    => $idRow,
                'fecha' => $fecha,

                'dia' => formatSpanishDay($fecha),
                'Fol' => $softVentas['id_venta'] ? '<i class="icon-ok-circled-2 text-success"></i>': '<i class="icon-info-circled-3 text-warning"></i>',
                'No'  => $softVentas['id_venta'],

                'alimentos'    => evaluar($softVentas['alimentos']),
                'bebidas'      => evaluar($softVentas['bebidas']),
                'guarniciones' => evaluar($softVentas['guarniciones']),
                'sales'        => evaluar($softVentas['sales']),
                'domicilio'    => evaluar($softVentas['domicilio']),
                'clientes'     => $softVentas['noHabitaciones'],

            );

            $grupo   = array( 'opc' => 0 );
            $__row[] = array_merge($row, $grupo);
            
            $fi->modify('+1 day');
        } 
        
        
        #encapsular datos
        return [

            "row"      => $__row,
            "thead"    => '',

        ];



    }



}

/* -- Complementos -- */

function ticket_footer($data,$grupo = []){
  

    // $lsgrupoc_erp = $obj->soft_grupoc_erp(array($_POST['udn']));
    $ipt_group = "<div class='row'>";
    
    foreach($grupo as $rows => $key):
       
        $name = strtolower($rows);
       
        $ipt_group .= "
        <div class='col-lg-3 col-sm-4 col-4 mb-2'>
            <div class='input-group'>
            <span style='font-size:.6em; font-weight:700;' class='input-group-text'>{$rows}</span>

            <input id='_{$name}'  style='font-size:.6em; font-weight:700;'
            class='form-control input-sm text-end' 
            value = '{$key} ' disabled >
            </div>
        </div>";

        
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

function ticket_head($data){

    $title = $data['title'] ? $data['title']  : '';


    $div = '
     <div class=" ">
     <table style="font-size:.6em; " class="table table-sm table-bordered">
     
      <tr>
             <td class="col-sm-1 fw-bold"> Fecha:   </td>
        <td class="col-sm-2 text-center"> '.$data['fecha'].'  </td>
      
        <td colspan="2" class="col-sm-6 text-center"> <strong>'.$title.'</strong> </td>
        <td class="col-sm-1 fw-bold"> Folio:  </td>
        <td class="col-sm-2 text-right text-end">No. '.$data['folio'].'</td>
      </tr>
        
     
   
      </table>
      </div>
    
   ' ;
  

    return $div;
}


// Instancia del objeto

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);





// require_once('../mdl/mdl-proveedores.php');
// require_once('../../conf/_Utileria.php');
// class Proveedores extends MSoft {
//     // INSTANCIAS
//     private $c;
//     private $obj;
//     private $util;

//     public function __construct($conta) {
//         $this->c    = $conta;
//         $this->util = new Utileria();
//     }
// }
?>