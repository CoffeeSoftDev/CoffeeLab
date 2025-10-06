
<?php
if (empty($_POST['opc'])) exit(0);
date_default_timezone_set('America/Mexico_City');

require_once ('../mdl/mdl-control-de-merma.php');
$obj = new Controldemerma;

require_once ('../../../conf/_Utileria.php');
$util = new Utileria;

$encode = [];

$fecha_actual = date('Y-m-d');


switch ($_POST['opc']) {

    case 'listUDN':
        $encode = $obj->lsUDN();
        break;

    case 'initComponents':

        $folio     = $obj->__getFolio();
        $area      = $obj->lsArea();
        $lsRecetas = $obj->lsRecetas();
        $Productos = $obj->lsAlmacenProductos();

        /*--    --*/

        $encode = [

            'area'      => $area,
            'recetas'   => $lsRecetas,
            'productos' => $Productos,
            "folio"     => $folio[0]
        
        ];

        break;

    case 'ls':
        $encode = lsProductos($obj);
    break;

    case 'crear-formato':
        // get vars. 
        $folio               = $obj->obtenerFolio([2]);
        $hr                  = date("H:i:s");
        // empaquetar.
        $data = [
            'folio'      => "M-{$folio}",
            'id_tipo'    => 2,
            'foliofecha' => "{$_POST['foliofecha']} {$hr}"
        ];

        $array  = $util->sql($data);

        $ok          = $obj->CrearTicket($util->sql($data));
        $folio       = $obj->__getFolio();
        $lsProductos = $obj->lsAlmacenProductos();
        
        $encode = [
            'ok'        => $ok,
            'folio'     => $folio[0],
            'productos' => $lsProductos
        ];

    break;


    case 'terminar-formato':

        $encode = $_POST;
        $array = $util->sql($_POST, 1);
        $ok    = $obj->cerrarTicket($array);
       
        // $folio = $obj->__getFolio();

        $encode = [

            'ok'    => $ok,
            // 'folio' => $folio[0],
            'array' => $array
        
        ];
       
        // MENU / SELCCIONA RED / WLAN / CONF ASIST.
    break;

    case 'add-frm-data':

        $array  = $util->sql($_POST);
        $ok     = $obj->add_productos($array);
        $encode = ['ok' => $ok, 'data' => $array];

        break;

    case 'Quitar':

        $ok = $obj->remove_producto([$_POST['idListaProductos']]);

        $encode = ['ok' => $ok];

        break;

    case 'ipt':

        $array = $util->sql($_POST, 1);
        $ok = $obj->update_cant($array);


        $encode = ['ok' => $ok, 'data' => $array];

    break;



}

function formatSpanishDate($fecha = null){
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    $formatoFecha = "%A, %d de %B del %Y"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}

function lsProductos($obj){

    $__row = [];
    $total_general = 0;

    $ls = $obj->Select_Productos([$_POST['id_lista']]);

    foreach ($ls as $_key):

        $val = $_key['cantidad'] != null ? $_key['cantidad'] : '';

        $ipt = [];
        $precio = [];

        $ipt[] = [
            "id"    => $_key['id'],
            "name"  => "cantidad",
            "value" => $val,
            'fn'    => 'holaMundo()'
        ];


        $btn = [];

        $btn[] = [

            'color' => 'danger',
            'icon' => 'icon-trash',
            'fn' => 'QuitarProducto'
        ];


        $total = $_key['cantidad'] * $_key['costo'];


        $__row[] = array(

            'id'       => $_key['id'],
            'Producto' => '<span class="text-uppercase">' . $_key['NombreProducto'] . '</span>',
            'Categoria'=> $_key['Nombre_Area'],

            
            'Cantidad' => $ipt,
            'costo'    => $_key['costo'],
            'total'    => evaluar($total),

            'btn' => $btn,

        );

        $total_general += $total;

    endforeach;



    $html = '
    <div style="font-size:.8rem;" class="d-flex justify-content-between">
        
        <label class="fw-bold"> Registros: ' . count($ls) . '
            <span id="lblTotalRecetaIng"></span>
        </label>
        
        <label class="fw-bold"> Total: 
            <span id="lblTotalCostoRecetaIng">' . evaluar($total_general) . '</span> 
        </label>
    </div>
   ';




    // Encapsular arreglos
    $encode = [
        "thead" => ['Producto', 'CATEGORIA', 'Cantidad', 'Precio', 'Total' ,'Opciones'],
        "row" => $__row,
        'frm_head' => $html

    ];

    return $encode;
}

function evaluar($val){
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}


echo json_encode($encode);
?>