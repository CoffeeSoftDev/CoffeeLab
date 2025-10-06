<?php
require_once('../../../conf/_CRUD.php');


class CostoPotencial extendS CRUD {
    private $bd2;
    private $bd;
    private $cp2;
    public function __construct(){

        $this->bd2 = 'rfwsmqex_gvsl_produccion2.';
        $this->bd = 'rfwsmqex_gvsl_costsys.';
        $this->cp2  = 'rfwsmqex_gvsl_costsys2.';

    }

    function Productos_vendidos($array){
      

        $query = "
        SELECT

        idAlmacen,
        almacen_productos.NombreProducto,
        almacen_productos.Area,
        listaproductos.idListaProductos,
        lista_productos.foliofecha,
        almacen_productos.sugerencia,
        SUM(cantidad) as CANT,
        almacen_productos.estadoProducto
        FROM

            {$this->bd2}listaproductos

            INNER JOIN {$this->bd2}almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
            INNER JOIN {$this->bd2}lista_productos ON listaproductos.id_lista = lista_productos.idLista
        WHERE MONTH(foliofecha) = ?
            AND   YEAR(foliofecha)  = ?
            AND Area = ? 
            And id_tipo = 1
            GROUP BY NombreProducto
        order by NombreProducto asc

        ";

        return $this->_Read($query, $array);


    }

    function getListVentas($array){
        $sql = '';

        $query = '
        SELECT
        idAlmacen,
        almacen_productos.NombreProducto,
        almacen_productos.Area,
        listaproductos.idListaProductos,
        lista_productos.foliofecha,
        almacen_productos.sugerencia,
        SUM(cantidad) ,
        almacen_productos.estadoProducto
        FROM

            rfwsmqex_gvsl_produccion.listaproductos

        INNER JOIN rfwsmqex_gvsl_produccion.almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
        INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
        WHERE MONTH(foliofecha) = ?
        AND   YEAR(foliofecha)  = ?
        AND Area = ? 
        GROUP BY NombreProducto
        order by NombreProducto asc

';

        $sql = $this->_Read($query, $array);
        return $sql;

    }



    function setCostoPotencial($array){

        return $this->_Update([
            'table'  => "{$this->bd}costopotencial",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function _CONSULTA_COSTSYS($array) {
        $query = "
        SELECT

        recetas.nombre,
        homologado.id_Produccion,
        homologado.id_Costsys,            
        recetas.precioVenta,
        homologado.idHomologado,
        homologado.homologado,
        recetas.idReceta,
        iva,
        ieps,
        recetas.rendimiento
        
        FROM
        rfwsmqex_gvsl_produccion.homologado
        INNER JOIN rfwsmqex_gvsl_costsys.recetas ON 
        rfwsmqex_gvsl_produccion.homologado.id_Costsys = rfwsmqex_gvsl_costsys.recetas.idReceta
        WHERE id_Produccion = ?";

        return $this->_Read($query, $array);


    }

    function calculoCostoPotencial($data,$calculo){

        $permiso = 1;

        $impuestos = $data['iva'] + $data['ieps'];
        $pVentaIVA = $data['pVenta'] / (1 + ($impuestos / 100));
        $receta    = $calculo->totalReceta($data['idReceta']);
        $total     = $receta['totalReceta'];
        $costo     = $total / $data['rendimiento'];
        
        //    -- Calculo de costo potencial -- 
        
        $porcentajeCosto = ($costo / $pVentaIVA) * 100;
        $mc              = $pVentaIVA - $costo;
        $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
        $costoEstimado   = $costo * $data['desplazamiento'];
        $mcEstimado      = $mc * $data['desplazamiento'];
       


        if($data['precioPropuesto']):

            $pVentaIVA       = $data['precioPropuesto'] / (1 + ($impuestos / 100));
            $mc              = $pVentaIVA - $costo;
            $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
            $mcEstimado      = $mc * $data['desplazamiento'];
        
        endif;    


    
        // -- Calculo propuesto  --
        $yearAnterior = $_POST['Anio'];
        $mesAnterior  = $_POST['Mes'];
        
        if ($_POST['Mes'] == 1) {
            $mesAnterior = 12;
            $yearAnterior = $_POST['Anio'] - 1;
        }

        // $cpAnterior = $this->selectDatosCostoPotencial([
        //     $data['idReceta'],
        //     $mesAnterior]
        // );

        // $ls = count($cpAnterior);


        // if ($data['desplazamiento'] == 0 && $permiso == 1) {
        //     $desplazamiento = $cpAnterior['desplazamiento'];
        // }

        //  if ( $data['precioPropuesto'] != 0 ):

        //  else: 
         
        //  if(isset($cpAnterior['precio_propuesto']) && $cpAnterior['precio_propuesto'] != 0 && $permiso == 1):

        //     $pPropuesto = $cpAnterior['precio_propuesto'];
        
        //  else:

        //     $pPropuesto = 0;
        //     $mcPropuesto = 0;
        //     $porcentajeCostoPropuesto = 0; 
            
            

        //  endif;

        // endif;


        // -- aplicar filtros modificables --

        $desplazamientoPromedio = 0;
        $costoAlto              = 0;
        $costoBajo              = 0;
        $mcAlto                 = 0;
        $mcBajo                 = 0;


        
        return [
            'pVenta'          => $data['pVenta'],
            'pVentaIVA'       => $pVentaIVA,
            'costo'           => $costo,
            'mc'              => $pVentaIVA - $costo,
            'porcentajeCosto' => $porcentajeCosto,
            'impuestos'       => $impuestos,
            'ventasEstimadas' => $ventasEstimadas,
            'costoEstimado'   => $costoEstimado,
            'mcEstimado'      => $mcEstimado,
            'desplazamiento'  => $desplazamiento,
             'total'          => $total,
            // 'precioPropuesto' => $cpAnterior['precio_propuesto'],
            'ls'              => $ls,
        ];
    }


}



class __LineaProduccion extends CRUD{
private $bd_erp;
private $bd;
private $_bd;
public function __construct() {

    $this->bd_erp = 'rfwsmqex_gvsl_produccion.';
    $this->bd     = 'rfwsmqex_gvsl_costsys.';
    $this->_bd    = 'rfwsmqex_gvsl_costsys.';

}
    
function Productos_vendidos($array){
    $t = 0;
    $lbl = '-';

    // $query = "
    // SELECT
    //     idAlmacen,
    //     almacen_productos.NombreProducto,
    //     almacen_productos.Area,
    //     listaproductos.idListaProductos,
    //     lista_productos.foliofecha,
    //     almacen_productos.sugerencia,
    //     SUM(cantidad) AS CANT,
    //     almacen_productos.estadoProducto
    // FROM

    // {$this->bd_erp}listaproductos

    // INNER JOIN {$this->bd_erp}almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
    // INNER JOIN {$this->bd_erp}lista_productos ON listaproductos.id_lista = lista_productos.idLista
    // WHERE MONTH(foliofecha) = ?
    // AND   YEAR(foliofecha)  = ?
    // AND Area = ? 
    //     And id_tipo = 1
    // GROUP BY NombreProducto
    // order by NombreProducto asc
    // ";

    $query = '
        SELECT

        idAlmacen,
        almacen_productos.NombreProducto,
        almacen_productos.Area,
        listaproductos.idListaProductos,
        lista_productos.foliofecha,
        almacen_productos.sugerencia,
        SUM(cantidad) as CANT,
        almacen_productos.estadoProducto
        FROM

            rfwsmqex_gvsl_produccion.listaproductos

            INNER JOIN rfwsmqex_gvsl_produccion.almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
            INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
        WHERE MONTH(foliofecha) = 3
            AND   YEAR(foliofecha)  = 2024
            AND Area = 2 
            And id_tipo = 1
            GROUP BY NombreProducto
        order by NombreProducto asc

    ';
    
    return  $this->_Read($query, $array);

    // foreach ($sql as $key) {
    //     $t   += $key['cantidad'];

    //     $lbl .= $key['foliofecha'].'=> '.$key['cantidad'] ;

    // }

    // return ['total'=> $t,'desc'=>$lbl];

}


function lsGrupoProduccion() {


    $query = "
 SELECT 
     idArea as id,
     Nombre_Area as name
     FROM rfwsmqex_gvsl_produccion.almacen_area
     WHERE estado_area = 1
    
    ";



    $sql = $this->_Read($query,null);
    return $sql;
}

function lsRecetas($array) {

    $query = "
    SELECT 
    	idReceta,
	nombre AS receta,
	Clasificacion AS clasificacion,
	id_Subclasificacion,
	rendimiento,
	recetas.iva,
	precioVenta AS pventa,
	nota,
	recetas.id_UDN,
	recetas.ieps,
	id_Clasificacion
    FROM
        {$this->bd}recetas,
        {$this->bd}clasificacion
    WHERE
    id_Clasificacion = idClasificacion AND 
    recetas.id_UDN = ? AND
    id_Estado = 1 AND idClasificacion <> 41 and idClasificacion <> 7 and idClasificacion <> 6 and idClasificacion <> 12
    ORDER BY clasificacion desc
   
    
    ";

    $sql = $this->_Read($query,$array);
    return $sql;
}


// function add_costo($array){
//     /* -- Nueva tabla -- */ 
//     $query =
//     "INSERT INTO {$this->bd}costopotencial
//     (
//     idE,
//     fecha_costo,
//     id_Clasificacion,
    
//     id_Receta,
//     precioventa,
//     iva,
    
//     ieps,
//     rendimiento
//     )
//     VALUES(?,?,?,?,?,?,?,?)";

//     return $this->_CUD($query, $array);

//     /* -- costsys 2 -- */ 
// }

function add_costo_potencial($array){

    return $this->_Insert([
        'table'  => "{$this->bd}costopotencial",
        'values' =>   $array['values'],
        'data'   =>   $array['data']
    ]);
}



function GET_SUB($array){
    $name = '';
    $query = '
    SELECT
        subclasificacion.idSubClasificacion,
        subclasificacion.nombre
    
    FROM rfwsmqex_gvsl_costsys.subclasificacion
    
    WHERE idSubClasificacion = ?
    ORDER BY nombre DESC
    ';

    $sql = $this->_Read($query, $array);
    foreach ($sql as $key) {
       $name = $key['nombre'];
    }

    return $name;
}

function lsGrupo($array) {


    $query = "
    SELECT
        idClasificacion as id,
        Clasificacion,
        stado,
        id_UDN
    FROM
    rfwsmqex_gvsl_costsys.clasificacion
    WHERE id_UDN = ? and stado = 1
    
    ";



    $sql = $this->_Read($query,$array);
    return $sql;
}

function reload_costoPotencial($array){
    $query = '
    UPDATE 
        rfwsmqex_erp.costsys_costopotencial
    SET precioventa   = ?,
    desplazamiento = ?,
    precioventa = ?
        WHERE  id_Receta = ? and fecha_costo = ? ';

    return   $this->_CUD($query, $array);

}

function update_costo_potencial($array){

    return $this->_Update([
        'table' => "{$this->bd}costopotencial",
        'values' => $array['values'],
        'where' => $array['where'],
        'data' => $array['data']
    ]);
}


function Productos_vendidos_desgloze($array){
    $t = 0;
    $lbl = '-';

    $query = '
    SELECT
        idAlmacen,
        almacen_productos.NombreProducto,
        listaproductos.idListaProductos,
        lista_productos.foliofecha,
        almacen_productos.sugerencia,
        listaproductos.id_productos
    FROM

    rfwsmqex_gvsl_produccion.listaproductos

    INNER JOIN rfwsmqex_gvsl_produccion.almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
    INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
    WHERE MONTH(foliofecha) = ?
    AND   YEAR(foliofecha)  = ?
    AND Area = ? 
    And id_tipo = 1
    GROUP BY NombreProducto
    order by NombreProducto asc
    ';

    return  $this->_Read($query, $array);

 

}

function get($array){
    $t = 0;
    $lbl = '';

    $query = '
    SELECT
        idAlmacen,
        almacen_productos.NombreProducto,
        listaproductos.idListaProductos,
        DATE_FORMAT(foliofecha,"%Y-%m-%d") as date, 
        listaproductos.cantidad,
        listaproductos.id_productos
    FROM

    rfwsmqex_gvsl_produccion.listaproductos

    INNER JOIN rfwsmqex_gvsl_produccion.almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
    INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
    WHERE MONTH(foliofecha) = ?
    AND   YEAR(foliofecha)  = ?
    AND   Area = ? 
    AND   id_productos = ?

    And id_tipo = 1
    
    order by NombreProducto asc
    ';

    $sql =  $this->_Read($query, $array);

    foreach ($sql as $key) {

        if ($key['cantidad']) {
            $t   += $key['cantidad'] ;
            $lbl .= '<span style="font-size:.78em; ">'.$key['date'].' - '.$key['cantidad'].'</span> <br>' ;
        }

    }
        $lbl .= '<strong>Total: '.$t.'</strong>';

    return $lbl;

}

function get_desplazamiento($array){

    $captura = 0;

    $query = '
        SELECT
        costopotencial.fecha_costo,
        costopotencial.desplazamiento,
        costopotencial.idE,
        costopotencial.receta
        FROM
        rfwsmqex_gvsl_costsys.costopotencial
        WHERE MONTH(fecha_costo) = ? AND YEAR(fecha_costo) = ?
        AND idE = ?
        AND receta = ?

    ';

    $sql = $this->_Read($query, $array);
    
    foreach ($sql as $key) {
      $captura = $key['desplazamiento'];  
    }

    return $captura;
}


function _CONSULTA_COSTSYS($array){
    $query = '
    SELECT

        rfwsmqex_gvsl_costsys.recetas.nombre,
        rfwsmqex_gvsl_produccion.homologado.id_Produccion,
        rfwsmqex_gvsl_produccion.homologado.id_Costsys,            
        rfwsmqex_gvsl_costsys.recetas.precioVenta,
        rfwsmqex_gvsl_produccion.homologado.idHomologado,
        rfwsmqex_gvsl_produccion.homologado.homologado,
        rfwsmqex_gvsl_costsys.recetas.idReceta

    FROM
        rfwsmqex_gvsl_produccion.homologado
        INNER JOIN rfwsmqex_gvsl_costsys.recetas ON 
        rfwsmqex_gvsl_produccion.homologado.id_Costsys = rfwsmqex_gvsl_costsys.recetas.idReceta
    WHERE id_Produccion = ?';

    return $this->_Read($query, $array);


}

function SelectCostoPotencial($array){

      $query = '
        SELECT
        fecha_costo,
        receta,
        idcostopotencial
        FROM
        costsys_costopotencial
        WHERE MONTH(fecha_costo) = ? AND
        YEAR(fecha_costo) = ?
        AND idE = ?

    ';
    //   $query = '
    //     SELECT
    //     costopotencial.fecha_costo,
    //     costopotencial.receta,
    //     costopotencial.idcostopotencial
    //     FROM
    //     rfwsmqex_gvsl_costsys.costopotencial
    //     WHERE MONTH(fecha_costo) = ? AND
    //     YEAR(fecha_costo) = ?
    //     AND idE = ?

    // ';


    $ls = $this->_Read($query, $array);
    $existen_datos = count($ls);

    return $existen_datos;

}

function GetCostoPotencial($array){
    $query = "
        SELECT
        *
        FROM
        rfwsmqex_gvsl_costsys.costopotencial
        WHERE
        MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND idE = ?
    ";
 
   return $this->_Read($query, $array);   
}


function add_vendido($array){
        $query =
            "INSERT INTO costsys_costopotencial
    (id_Receta,
    idE,
    fecha_costo
    )
    VALUES(?,?,?)";

        return $this->_CUD($query, $array);
}


}


class Productosvendidos extends CRUD{
function lsUDN(){
      $query = "SELECT idUDN AS id, UDN AS valor FROM udn 
      WHERE Stado = 1 AND idUDN != 10 AND idUDN != 8  
      ORDER BY Antiguedad DESC";
        return $this->_Read($query, null);
}

  
function getVentas($array){
        $folio = 10;

    $query ="
        SELECT
        soft_ventas.id_area,
        SUM(soft_ventas.total) total,
        soft_ventas.soft_folio,
        soft_ventas.soft_ventas_fecha
        FROM
        rfwsmqex_gvsl_finanzas.soft_ventas

        WHERE soft_folio = ?
    ";

    $sql = $this->_Read($query, $array);


    foreach ($sql as $key) {
    $folio = $key['total'];
    }

    return $folio;
}


function select_list_grupo_sn($array){

    $id_grupo = 0;

    $query = "
    SELECT
    subclasificacion.nombre,
    subclasificacion.idSubClasificacion,
    subclasificacion.id_Clasificacion
    FROM
    rfwsmqex_gvsl_costsys.subclasificacion
    WHERE id_Clasificacion = ?

    ";

    return $this->_Read($query, $array);
}

function existe_folio($array){
    $folio = 0;
    $contador_ticket = 0;

    $query = "
    SELECT
        id_folio,
        file_productos_vendidos,
        file_ventas_dia,
        monto_productos_vendidos,
        monto_ventas_dia
    FROM
        rfwsmqex_gvsl_finanzas.soft_folio
    WHERE 
        date_format(fecha_folio,'%Y-%m-%d') = ?
        AND id_udn = ?
    ";

    $sql = $this->_Read($query, $array);
    // foreach ($sql as $key ) {
    //  $folio            = 1;
    // }


    return $sql;
}

function Enlace_Costsys($array){

    $query = '
    SELECT
        rfwsmqex_gvsl_costsys.recetas.nombre,
        rfwsmqex_gvsl_finanzas.soft_costsys.idhomologado,
        rfwsmqex_gvsl_finanzas.soft_costsys.id_costsys_recetas,
        rfwsmqex_gvsl_costsys.recetas.precioVenta,
        rfwsmqex_gvsl_finanzas.soft_costsys.id_soft_productos,
        
        id_Clasificacion,
        recetas.idReceta,
        iva,
        ieps,
        recetas.rendimiento
    FROM
        rfwsmqex_gvsl_costsys.recetas
    INNER JOIN rfwsmqex_gvsl_finanzas.soft_costsys ON rfwsmqex_gvsl_finanzas.soft_costsys.id_costsys_recetas = rfwsmqex_gvsl_costsys.recetas.idReceta
    WHERE id_soft_productos = ?
    
    ';

    return $this->_Read($query, $array);


}

function get_desplazamiento($array){

    $captura = 0;

    $query = '
        SELECT
        costopotencial.fecha_costo,
        costopotencial.desplazamiento,
        costopotencial.idE,
        costopotencial.receta
        FROM
        rfwsmqex_gvsl_costsys.costopotencial
        WHERE MONTH(fecha_costo) = ? AND YEAR(fecha_costo) = ?
        AND idE = ?
        AND receta = ?

    ';

    $sql = $this->_Read($query, $array);
    
    foreach ($sql as $key) {
      $captura = $key['desplazamiento'];  
    }

    return $captura;
}


function select_homologar($array){
    $query ="
    SELECT
    *
    FROM
        rfwsmqex_gvsl_produccion.homologado
    WHERE id_Produccion = ? ";

    return $this->_Read($query, $array);
}

function SELECT_PRODUCTOS_x_SOFT($array){
    $query ="
    SELECT
        soft_productos.id_Producto,
        soft_productos.clave_producto,
        soft_productos.descripcion as producto,

        id_grupoc,
        soft_productos.id_udn,
        soft_productos.status,
        
        soft_productos.id_costsys,
        DATE_FORMAT(fecha,'%Y-%m-%d') as dat, 
        soft_productos.costo
    FROM
        rfwsmqex_gvsl_finanzas.soft_productos
    WHERE soft_productos.id_udn = ? and id_grupo_productos = ?
    -- AND id_Producto = ?
    --    and activo_soft = 1
    order by producto asc

    
    ";

    return $this->_Read($query, $array);

}

function select_list_grupo($array){
    $id_grupo = 0;   
    $query ="
        SELECT
            soft_grupoproductos.idgrupo,
            soft_grupoproductos.grupoproductos,
            soft_grupoproductos.clavegrupo,
            soft_grupoproductos.id_udn
        FROM
        rfwsmqex_gvsl_finanzas.soft_grupoproductos
        WHERE id_udn = ? and estatus = 1 and idgrupo <>28

        order by grupoproductos asc
    ";
    return $this->_Read($query, $array);
}

function grupo_productos($array){
    $query = "
    SELECT 
    idgrupo, grupoproductos 
    
    FROM 
    rfwsmqex_gvsl_finanzas.soft_grupoproductos
    
    WHERE id_udn = ?
    ORDER BY grupoproductos ASC";
    return $this->_Read($query, $array);
}

function mostrar_productos_soft($array){
    $query = " SELECT 
    id_Producto, 
    clave_producto, descripcion, activo_soft,fecha as dat
    FROM rfwsmqex_gvsl_finanzas.soft_productos
    WHERE id_grupo_productos = ?
    ORDER BY descripcion ASC";
    return $this->_Read($query, $array);
}


/* ---------------------------- */
/*     Recetas ->               */
/* ---------------------------- */
function list_grupo_recetas($array){
    $query ="
    SELECT
    idClasificacion as id,
    Clasificacion as name
    FROM
    rfwsmqex_gvsl_costsys.clasificacion
    WHERE id_UDN = ? ";

    return $this->_Read($query, $array);
}

function list_productos($array){
    $query ="
    SELECT
    idReceta,
    nombre,
    precioVenta,
     DATE_FORMAT(fecha,'%Y-%m-%d') as fecha,
     folio
    FROM
    rfwsmqex_gvsl_costsys.recetas
    WHERE 
    -- id_Clasificacion = ? 
    id_Subclasificacion = ? 
    ";

     return $this->_Read($query, $array);
}


function get_cantidad($array) {
    $cantidad = 0;
    $query = "
    SELECT
        id_folio,
        DATE_FORMAT(fecha_folio,'%Y-%m-%d'),
        SUM(cantidad) as scant,
        soft_productosvendidos.idvendidos as id
    FROM
        rfwsmqex_gvsl_finanzas.soft_folio
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_productosvendidos ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
    WHERE
        DATE_FORMAT(fecha_folio,'%Y-%m-%d')  BETWEEN ? AND ? 
        AND id_productos   = ?
    ";

    $sql = $this->_Read($query, $array);

    foreach ($sql as $key ) {
        $cantidad =   $key['scant'];
    }

    return $cantidad;
}

function _GET_CANT_X_MES($array) {
    $cantidad = 0;
    $lbl_cantidad = '';
    // $query = "
    // SELECT
    //     id_folio,
    //     DATE_FORMAT(fecha_folio,'%Y-%m-%d'),
    //     SUM(cantidad) as scant,
    //     soft_productosvendidos.idvendidos as id
    // FROM
    //     rfwsmqex_gvsl_finanzas.soft_folio
    //     INNER JOIN rfwsmqex_gvsl_finanzas.soft_productosvendidos ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
    // WHERE
    //     MONTH(fecha_folio) = ? AND YEAR(fecha_folio) = ?
    //     AND id_productos   = ?
    // ";

     $query = "
    SELECT
        id_folio,
        DATE_FORMAT(fecha_folio,'%Y-%m-%d') as fecha,
        cantidad,
        soft_productosvendidos.idvendidos as id
    FROM
        rfwsmqex_gvsl_finanzas.soft_folio
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_productosvendidos ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
    WHERE
        MONTH(fecha_folio) = ? AND YEAR(fecha_folio) = ?
        AND id_productos   = ? 
        order by fecha asc
    ";

    $sql = $this->_Read($query, $array);

    foreach ($sql as $key ) {
        $cantidad  +=  $key['cantidad'];
        $lbl_cantidad  .=  $key['fecha'].' - '.$key['cantidad'].', <br>';
    }
     
    if(count($sql) != 0){
       $lbl_cantidad  .= '<strong> Total : '.$cantidad.' </strong>'; 
    }
    
    $data = [
        "total" => $cantidad,
        "lbl"   => $lbl_cantidad
    ];

    return $data;
}

function select_softrestaurant_costsys($array){
    $lbl   =  '';

    $query ="
    SELECT
        descripcion,
        id_costsys_recetas,
        idhomologado,
        id_soft_productos
    FROM
        rfwsmqex_gvsl_finanzas.soft_costsys
    INNER JOIN rfwsmqex_gvsl_finanzas.soft_productos ON 
            soft_costsys.id_soft_productos = soft_productos.id_Producto
    WHERE id_costsys_recetas = ?";

    $sql = $this->_Read($query, $array);
    
    // $contador = 0;
    // foreach ($sql as $key ) {
    //     if($contador == 0){
    //         $lbl   .=  '<span  class="pointer" title="'.$key[2].'">'.$key['descripcion'].' </span>';
    //     }else {
    //         $lbl   .=  ', <span class="pointer" title="'.$key[2].'">'.$key['descripcion'].'  </span> ';
    //     }
    //     $contador += 1;
    // }

    return $sql;
}



}
?>