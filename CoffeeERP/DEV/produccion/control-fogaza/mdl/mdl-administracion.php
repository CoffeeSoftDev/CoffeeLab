<?php
require_once('../../../conf/_CRUD.php');

class Administracion extends CRUD{

function _CONSULTAR_SUGERENCIA($array){
  $t = '';
  $total = 0;

    $query = "
      SELECT
        lista_productos.folio,
        DATE_FORMAT(foliofecha,'%Y-%b-%d') as fecha,
        listaproductos.id_productos,
        listaproductos.sugerencia
      FROM
      rfwsmqex_gvsl_produccion.listaproductos
      INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
      WHERE DATE_FORMAT(foliofecha,'%Y-%m-%d') = ?  and id_productos = ? and id_tipo = 1 and new_estado = 2
    ";

    $sql = $this-> _Select($query, $array, "1");
    
    foreach ($sql as $key ) {
     $t .= 'Producción ['.$key['folio'].'] :  '.$key['sugerencia'].' <br>';

     $total = $total + $key['sugerencia'];
    }
     

    // $arreglo = array($t, $total );
    // return $arreglo;

    return [
        "total" => $total
     ];

}


function lsCategoria(){
    $query ="
        SELECT
        clasificacion.idClasificacion as id,
        clasificacion.Clasificacion as valor
        FROM
        rfwsmqex_gvsl_costsys.clasificacion
        WHERE id_UDN = 6 AND idClasificacion != 9
        AND idClasificacion != 7 
        AND idClasificacion != 12
        AND idClasificacion != 41

    ";
    return $this->_Read($query, null);
}

function _Select_Productos_Real($array){

    $query  =
    "
    SELECT
    idAlmacen,
    listaproductos.idListaProductos,
    almacen_productos.NombreProducto,
    lista_productos.foliofecha,
    almacen_productos.Area,
    almacen_productos.sugerencia,
    SUM(cantidad) 
    FROM

        rfwsmqex_gvsl_produccion.listaproductos

    INNER JOIN rfwsmqex_gvsl_produccion.almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
    INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
    WHERE foliofecha BETWEEN ? AND ?
    AND Area = ? 
    GROUP BY NombreProducto
    order by cantidad desc
    ";

    return $this->_Read($query, $array);

}

function _CONSULTAR_REAL($array){
    $t = '';
    $cantidad   = 0;
    $sugerencia = 0;

    $query = "
    SELECT
    lista_productos.folio,
    SUM(cantidad) as cant,
    SUM(listaproductos.sugerencia) as panadero
    
    FROM
    rfwsmqex_gvsl_produccion.listaproductos
    INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
    WHERE DATE_FORMAT(foliofecha,'%Y-%m-%d') = ?    
    and id_productos = ? and id_tipo = 1
    ";

    $sql = $this->_Read($query, $array);

    foreach ($sql as $key ) {
      $cantidad   = $key['cant'];
      $sugerencia = $key['panadero'];
    }

    // foreach ($sql as $key) {
    //     $t .= 'Real [' . $key['folio'] . '] : ->' . $key['cantidad'] . ' <br>';
    //     $total = $total + $key['cantidad'];
    // }

    return [
        "cant" => $cantidad,
        "sug" => $sugerencia
    ];
}

function _REAL($array){
    $t = '';
    $cantidad   = '';
    $sugerencia = '';

    

    $query = "
    SELECT
    folio,
    cantidad ,
    sugerencia as panadero
    
    FROM
    rfwsmqex_gvsl_produccion.listaproductos
    INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
    WHERE DATE_FORMAT(foliofecha,'%Y-%m-%d') = ?    
    and id_productos = ? and id_tipo = 1
    ";

    $sql = $this->_Read($query, $array);

    // foreach ($sql as $key ) {
    //   $cantidad   = $key['cant'];
    //   $sugerencia = $key['panadero'];
    // }

    foreach ($sql as $key) {

        // $cantidad .= 'Prod. Real [' . $key['folio'] . '] :: ' . $key['cantidad'] . ' <br>';
        // $sugerencia .= 'Real ['.$key['folio'] .'] ::' . $key['panadero'] . ' <br>';

        // $total = $total + $key['cantidad'];

        $cantidad   .= $key['cantidad'];
        $sugerencia .= $key['panadero'];
    }

    return [
        "real"  => $cantidad,
        "sug"   => $sugerencia
    ];
    

  
}






function SELECT_PRODUCTOS_x_COSTSYS($array){

$query = "
    SELECT
    idReceta as id,
    nombre,
    recetas.folio,
    clasificacion.Clasificacion,
    precioVenta as costo,
    DATE_FORMAT(fecha,'%Y-%m-%d') as fecha,
    id_Estado,
    id_SubClasificacion 
    FROM
    rfwsmqex_gvsl_costsys.recetas
    INNER JOIN rfwsmqex_gvsl_costsys.clasificacion 
    ON recetas.id_Clasificacion = clasificacion.idClasificacion
    WHERE recetas.id_UDN = ? and id_Clasificacion = ?
    ORDER BY nombre asc
";

return $this->_Read($query, $array);
}

function _PRODUCTOS_FOGAZA_LINK_COSTSYS_ORDER($array){

    $query = "
        SELECT
            almacen_productos.idAlmacen,
            almacen_productos.NombreProducto,
            almacen_productos.Area,
            NotFoundReceta,
            sugerencia,
            diasMerma
        FROM
        rfwsmqex_gvsl_produccion.almacen_productos
        INNER JOIN rfwsmqex_gvsl_produccion.homologado ON homologado.id_Produccion = almacen_productos.idAlmacen
        WHERE id_Costsys = ?
    ";

    return $this->_Read($query, $array);


}

  

function GET_SUB($array){
    $name = '';
    $query = '
    SELECT
    subclasificacion.idSubClasificacion,
    subclasificacion.nombre
    FROM rfwsmqex_gvsl_costsys.subclasificacion
    WHERE idSubClasificacion = ?
    ';
    $sql = $this->_Read($query, $array);
    foreach ($sql as $key) {
    $name = $key['nombre'];
    }
    return $name;
}

}
?>