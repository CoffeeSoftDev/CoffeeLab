<?php
if (empty($_POST['opc'])) {

    exit(0);
}

require_once('../mdl/mdl-administracion.php');
$obj = new Administracion;

$encode = [];

switch ($_POST['opc']) {

    case 'listUDN':
    
        $encode = $obj->lsUDN();

    
    break;

    case 'listGrupo':
        $encode = $obj->lsGrupo([$_POST['UDN']]);
        break;

    case 'listGroupFogaza':
        $encode = $obj->lsGrupoFogaza([$_POST['UDN']]);
        break;

    case 'categoria-soft':
        $encode = list_($obj);
        break;

    case 'list-productos':
        // $th = array('status', 'Fecha Mod.', 'Productos', 'Producto Costsys', 'Precio Costsys', 'Precio ERP', 'Grupo ERP');
        $encode = list_productos($obj, $th);
        break;

    case 'list-productos-fogaza':
        $udn = $_POST['UDN'];

    

        $encode = ls_productos_fogaza_detallado($obj);
    break;

    case 'enlace-costsys':

        $encode = $_POST;

        $idReceta   = $_POST['idreceta'];
        $idProducto = $_POST['idProducto'];
        $homologo   = $_POST['idHomologo'];

        $date_now   = date("Y-m-d");


        if($homologo != 0){

            $data = [
                $idReceta,
                $date_now,
                $homologo
            ];
            
        //     $obj->mod_producto_softCost([$idReceta, $date_now, $homologo]);
            $estado = 'actualizar';


        }else { // Crea un nuevo vinculo 
            // $date_now = date("Y-m-d");
            
            $data = [
                $idProducto,
                $idReceta,
                $date_now
            ]; 

            $obj->enlace_costsys($data);
            $estado = 'insertar';

        }

        

        // $encode = [
        //     'idProducto' => $idProducto,
        //     'idReceta'   => $idReceta
        // ];

        $encode = [
            "data"=>$data,
            "estado"=>$estado
        ];

    break;    


    case 'link':
        # Data --
        $idReceta = $_POST['id'];
        // $titulo   = $_POST['titulo'];
        $titulo      = 'PASTELERIA';

        # data para crear un nuevo producto 
        $nombre         = $_POST['nombre_receta'];
        $FechaIngreso   = date("Y-m-d H:i:s");
        $estadoProducto = 1;
        $costo          = 0;
        $id_area        = $obj->__get_id_area([$titulo]);

        $data = [
            $id_area,
            $FechaIngreso,
            $nombre,
            $estadoProducto
        ];

        #Crear producto en erp-produccion --


        // $encode = $data;

        $obj->CrearProducto($data);
        $id_producto = $obj->__get_id_producto([$nombre]);

        # Crear vinculo entre erp-costsys --
        $dataX =
            [
                $id_producto,
                $idReceta,
                'Creado desde ERP2'
            ];

         $encode = $obj->crearVinculo($dataX);
        // $encode = $data;
        // $encode = $dataX;
    break;

    case 'lsGrupo':
     $encode = list_($obj);
    break;

    case 'lsGrupoFz':
      $encode = lsGrupoFz($obj);
    break;

    case 'rpt_detallado':
      $encode = rpt_detallado($obj);
    break;

    case 'list_productos_fogaza':
      $encode = list_productos_fogaza($obj);
    break;    


}

echo json_encode($encode);

function lsGrupoFz($obj){
    # Declarar variables
    $__row = [];
    $grupo = $_POST['Grupo'];
    $total = 0;

    $list   = $obj->lsGrupoFogaza([$_POST['UDN']]);
    $total  = count($list);


    foreach ($list as $_key) {

        $atributos = [];
        $list      = $obj->SELECT_PRODUCTOS_x_COSTSYS([6, $_key['id']]);

        // $list_productos = $obj->SELECT_PRODUCTOS_x_SOFT([$_POST['UDN'], $_key['idgrupo']]);
        // $total_productos = count($list_productos);

        // $lsHomologado = $obj->productos_homologados_soft([$_POST['UDN'], $_key['idgrupo']]);

        $atributos[] = [
            "fn"        => 'ver_productos_soft',
            "color"     => 'bg-primary',
            "url_image" => '',
            "disabled"  => ''
        ];

        // $total = $total + $total_productos;

        $__row[] = array(
            'id'      => $_key['id'],
            'nombre'  => $_key['valor'],
            'value_1' => count($list),
            'value_2' => 0,
            'atrr'    => $atributos,
            "opc"     => 0
        );



    } // end lista de folios



    $encode = [
        "thead" => '',
        "row" => $__row,
        "Productos" => $total
    ];

    return $encode;
}

function rpt_detallado($obj){
    # Declarar variables
    $__row   = [];
    
    #Consultar a la base de datos
    $ls    = $obj->productos_softrestaurant([$_POST['UDN']]);
   
    
    foreach ($ls as $key) {

        $nombre_costsys = $obj->select_homologar(array($key['id']));

        $idhomologo = 0;
        $id_costsys = 0;

        foreach ($nombre_costsys as $costsys) {
            $id_costsys = $costsys['id_costsys_recetas'];
            $idhomologo = $costsys['idhomologado'];
        }


        $select = cb_grupo($obj, $key['id'], $id_costsys, $idhomologo);

        $lbl_status = '
            <span class="text-danger">
               <strong>Pendiente</strong>
            </span>
        ';

        if ($idhomologo != 0) {

            if ($key['costo'] != $select[1]) {
                $lbl_status = '<i class="text-warning  icon-warning-1"></i> El precio es diferente ';
            } else {
                $lbl_status = '<i class="text-success icon-flag-2"></i>';
            }

        }




        $__row[] = array(
            'id'               => $key['id'],
            // 'status'           => 'id: ' . $key['id'] .  ', hom:' . $idhomologo,
            'fecha'            => $key['fecha'],
            'id_grupo_productos'            => $key['grupoproductos'],
            'producto'         => '<span  id="txtProducto'.$key['id'].'" name="'.$key['descripcion'].'">'.$key['descripcion'].'</span>',
            'producto costsys' => $select[0],
            'precio costsys'   => evaluar($select[1]),
            'precio erp'       => evaluar($key['costo']),
            'Revision'        =>  $lbl_status,
            "opc"              => 0
        );
    }
    
    #encapsular datos
        return [
            "thead" => '',
            "row"   => $__row
        ];
}

function list_($obj){
    # Declarar variables
    $__row = [];
    $grupo = $_POST['Grupo'];
    $total = 0;


    // # Sustituir por consulta a la base de datos
    // if ($grupo == 0) {
        $list = $obj->select_list_grupo_sn([$_POST['UDN']]);
        // $__row = $obj->productos_softrestaurant([$_POST['UDN']]);
    // } else {
    //     $list = $obj->select_list_grupo([$_POST['UDN'], $grupo]);
    // }


    $total = count($list);

    foreach ($list as $_key) {
        $atributos = [];

        $list_productos = $obj->SELECT_PRODUCTOS_x_SOFT([$_POST['UDN'], $_key['idgrupo']]);
        $total_productos = count($list_productos);

        $lsHomologado = $obj->productos_homologados_soft([$_POST['UDN'], $_key['idgrupo']]);

        $atributos[] = [
            "fn"        => 'ver_productos_soft',
            "color"     => 'bg-primary',
            "url_image" => '',
            "disabled"  => ''
        ];

        $total = $total + $total_productos;

        $__row[] = array(
            'id' => $_key['idgrupo'],
            'nombre' => $_key['grupoproductos'],
            'value_1' => $total_productos,
            'value_2' => count($lsHomologado),
            'atrr' => $atributos,
            "opc" => 0
        );

       

    } // end lista de folios
       


    $encode = [
        "thead"     => '',
        "row"       => $__row,
        "Productos" => $total
    ];

    return $encode;
}

function list_productos($obj, $th){
    # Declarar variables
    $__row = [];
    # Sustituir por consulta a la base de datos
    $list = $obj->SELECT_PRODUCTOS_x_SOFT([$_POST['UDN'], $_POST['id']]);
    $total = count($list);

    foreach ($list as $_key) {

        $nombre_costsys = $obj->select_homologar(array($_key['id_Producto']));
        $idhomologo = 0;
        $id_costsys = 0;
        $receta = '';
        $precio_costsys = 0;

        $idPlus = '';
        foreach ($nombre_costsys as $costsys) {
            $id_costsys = $costsys['id_costsys_recetas'];
            $idhomologo = $costsys['idhomologado'];

            $idPlus .= ', '.$idhomologo;

        }



        $select = cb_grupo($obj, $_key['id_Producto'], $id_costsys, $idhomologo);



        $nombre_erp = $obj->consultar_grupo_erp([$_key['id_grupoc']]);
        $lbl_status = '
            <span class="text-danger">
               <strong>Pendiente</strong>
            </span>
        ';

        if ($idhomologo != 0) {

            if ($_key['costo'] != $select[1]) {
                $lbl_status = '<i class="text-warning  icon-warning-1"></i> El precio es diferente ';
            } else {
                $lbl_status = '<i class="text-success icon-flag-2"></i>';
            }

        }

        $__row[] = array(
      
            'id'             => $_key['id_Producto'],
            'dat'            => '<'.$_key['id_Producto'].'<=> homologado: '. $idPlus,
            // 'Fecha Mod'      => $_key['dat'],
            'producto'       => '<span  id="txtProducto'.$_key['id_Producto'].'" name="'.$_key['descripcion'].'">' . $_key['descripcion'] . '</span>',
            'grupo'          => $select[0],

            "precio Soft"    => evaluar($_key['costo']),
            "Precio Costsys" => evaluar($select[1]),
            'Revision'       => $lbl_status,



            "opc" => 0
        );

    } // end lista de folios

    $Categoria =   $obj-> get_Categoria([$_POST['id']]);

    $frm = ticket_head_breadcumbs(["Categoria"=>$Categoria, "id" => $_POST['id'], "UDN" => $_POST['UDN']]);

  
    // Encapsular arreglos
    $encode = [
        "frm_head" => $frm,
        "thead"    => '',
        "row"      => $__row,
        "total"    => $total
    ];

    return $encode;
}


function ls_productos_fogaza_detallado($obj){

    # Declarar variables
    $__row = [];

    # Sustituir por consulta a la base de datos

    $list = $obj->_SELECT_FROM_COSTSYS_FZ([6]);
    $total = count($list);


    foreach ($list as $_key) {

        $btn = [];

        $btn[] = [
            "fn" => 'quest_agregar',
            "color" => 'primary btn-default btn-xs',
            "icon" => 'icon-link-1'
        ];


        #Consulta los vinculos que tiene cada receta con el soft 
        $list_nombre = $obj->_SET_NOMBRE_COSTSYS(array($_key['idReceta']));


        $data_name = '';
        $status    = '';
        $links     = '<span class="text-danger fw-bold">Revisar</span>';

        $total = 0;

        //  Recorrido de recetas
        foreach ($list_nombre as $list_x) {
            $links       = '<span title="' . $list_x['idAlmacen'] . '" class="text-uppercase pointer">' . $list_x['NombreProducto'] . '</span>';
            $cantidad_fz = $obj->get_cantidad_erp([$list_x['idAlmacen']]);
            $total = $total + $cantidad_fz;
            if (next($list_nombre)) {
                $links .= ', ';
            }
        }


        # Consulta si esta vigente en costo potencial y el desplazamiento agregado
        $list_cp = $obj-> get_producto_cp([$_key['idReceta'],01,2024]);
        $txt_cp  = ''.count($list_cp);

        foreach ($list_cp as $lcp) {
            $txt_cp  =  $lcp['precioventa']; 
        }


        # Consultar subcategoria 
        $idSubCategoria = $obj->consultar_subcategoria_costsys(array($_key['id_SubClasificacion']));
        $bg = 0;

        if ($_key['id_SubClasificacion'] == 59 || $_key['id_SubClasificacion'] == 62 || $_key['id_SubClasificacion'] == 71) {
            $bg = 1;
        }

        $__row[] = array(
            'id'             => $_key['idReceta'],
            'fecha'          => $_key['fecha'],
            'Categoria'      => $idSubCategoria,
            'Producto'       => '<span id="txtProducto' . $_key['idReceta'] . '" title="' . $_key['idReceta'] . '" name="' . $_key['nombre'] . '">' . $_key['nombre'] . '</span>',
            'link'           => $links,
            "precio Costsys"     => evaluar($_key['costo']),
            "cp"     => $txt_cp,
            'Desplazamiento' => evaluar2($total),
            // "opc"            => $bg,
            "btn"            => $btn
        );

    } // end lista de folios


    // Encapsular arreglos
    return [
        "thead" => '',
        "row" => $__row,
        "Productos" => $total,
        "grupo" => $_POST['Grupo']
    ];

  
}


function list_productos_fogaza($obj){
    # Declarar variables
    $__row = [];

    # Sustituir por consulta a la base de datos
    // 
    $list = $obj->SELECT_PRODUCTOS_x_COSTSYS([6,$_POST['id']]);
    $total = count($list);

    foreach ($list as $_key) {

        $btn = [];

        $btn[] = [
            "fn" => 'quest_agregar',
            "color" => 'primary btn-default btn-xs',
            "icon" => 'icon-link-1'
        ];


        #Consulta los vinculos que tiene cada receta con el soft 
        $list_nombre = $obj->_SET_NOMBRE_COSTSYS(array($_key['idReceta']));


        $data_name = '';
        $status = '';
        $links = '<span class="text-danger fw-bold">Revisar</span>';

        $total = 0;

        //  Recorrido de recetas
        foreach ($list_nombre as $list_x) {

            $links = '<span title="' . $list_x['idAlmacen'] . '" class="text-uppercase pointer">' . $list_x['NombreProducto'] . '</span>';

            $cantidad_fz = $obj->get_cantidad_erp([$list_x['idAlmacen']]);

            $total = $total + $cantidad_fz;

            if (next($list_nombre)) {
                $links .= ', ';
            }
        }


        # Consulta si esta vigente en costo potencial y el desplazamiento agregado
        // $list_cp = $obj-> get_producto_cp([$_key['idReceta'],9,2023]);
        // $txt_cp  = ''.count($list_cp);

        // foreach ($list_cp as $lcp) {
        //     // $txt_cp  =  $lcp['precioventa']; 
        // }


        # Consultar subcategoria 
        $idSubCategoria = $obj->consultar_subcategoria_costsys(array($_key['id_SubClasificacion']));
        $bg = 0;

        if ($_key['id_SubClasificacion'] == 59 || $_key['id_SubClasificacion'] == 62 || $_key['id_SubClasificacion'] == 71) {
            $bg = 1;
        }

        $__row[] = array(
            'id'     => $_key['idReceta'],
            'fecha'  => '<span >' . $_key['fecha'] . '</span>',
            'status' => ' <span style="font-size:.76em; font-weight:bold;">' . $idSubCategoria . '</span>',
            'Producto' => '
                <span id="txtProducto' . $_key['idReceta'] . '" title="' . $_key['idReceta'] . '" name="' . $_key['nombre'] . '">
                ' . $_key['nombre'] . '
                </span>',

            'link' => $links,
            "precio" => evaluar($_key['costo']),
            // "s"        =>1,
            'cp' => evaluar2($total),
            "btn" => $btn
        );

    } // end lista de folios

     
    // Encapsular arreglos
    $encode = [
        "thead"     =>$th,
        "row"       => $__row,
        "Productos" => $total,
        "grupo"     => $_POST['Grupo']
    ];

    return $encode;
}

function ticket_head_breadcumbs($data){

    return "
    <div class='row'>
        <div class='col-sm-12 mt-3'>

        <nav aria-label='breadcrumb'>
            <ol class='breadcrumb'>
        
            <li onclick='lsGrupo()' class='breadcrumb-item  text-muted pointer'>
            <i class='icon-left-circle'></i> Regresar </li>
            <li onclick='ver_productos_soft({$data['id']},{$data['UDN']})' class='pointer breadcrumb-item fw-bold active'> {$data['Categoria']}</li>
            </ol>
        </nav>
        
        </div>
    </div>

    ";
}

function cb_grupo($obj, $id, $id_softs, $idhomologo){
    $txt         = '';
    $precioVenta = 0;


    $data = $obj->cb_producto_costsys(array($_POST['UDN'])); // RECETAS DEL COSTSYS
    $txt .= '<div class="input-group w-100">';

    $txt .= '

    <select 
    class="form-control js-example-basic-single " id="cb_producto' . $id . '">

    <option value="0"  > --  -- </option>
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

    <a class="input-group-text btn-primary" onclick="enlace_receta(' . $id . ','.$idhomologo.')">
     <i class="icon-plus pointer" ></i>
    </a>

    </div>
    ';

    $arreglo_datos = [$txt, $precioVenta];
    return $arreglo_datos;
}

# --------------------
#  Complementos ..
# --------------------

function status($opc)
{
    $lbl_status = '';
    switch ($opc) {

        case 1:
            $lbl_status = '<i class="text-success  icon-thumbs-up"></i> ACTIVO';
            break;

        default:
            $lbl_status = '<i class="text-warning  icon-warning-1"></i> REVISAR';
            break;

    }

    return $lbl_status;
}

function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

function evaluar2($val)
{
    return $val ? $val : '-';
}

?>