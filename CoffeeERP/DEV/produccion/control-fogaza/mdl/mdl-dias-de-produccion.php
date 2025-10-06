
<?php
require_once('../../../conf/_CRUD.php');

class Diasdeproduccion extends CRUD{
private $bd;

private $_bd;


    public function __construct() {
        $this->bd = "rfwsmqex_gvsl_produccion.";
        $this->_bd = "rfwsmqex_gvsl_produccion.";
    }

    function lsUDN(){
        $query ="SELECT idUDN AS id, UDN AS valor FROM udn WHERE Stado = 1";
        return $this->_Read($query, null);
    }

    function getCategoriaCostsys($array){
        $idCategoria = 0;
        
        $query = "
            SELECT
                idClasificacion
            FROM
            rfwsmqex_gvsl_costsys.clasificacion
            WHERE Clasificacion = ? ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $idCategoria = $key['idClasificacion'];
        }

        return $idCategoria;
    }





function lsCategoria(){
    // $query ="
    //     SELECT
    //     clasificacion.idClasificacion as id,
    //     clasificacion.Clasificacion as valor
    //     FROM
    //     rfwsmqex_gvsl_costsys.clasificacion
    //     WHERE id_UDN = 6 AND idClasificacion != 9
    //     AND idClasificacion != 7 
    //     AND idClasificacion != 12
    //     AND idClasificacion != 41

    // ";

    $query = 
    "SELECT idArea as id, Nombre_Area as valor 
    FROM rfwsmqex_gvsl_produccion.almacen_area 
    WHERE estado_area = 1";


    return $this->_Read($query, null);
}

function consultar_subcategoria_costsys($array) {
    $nombre_grupo = '';

    $query = "
    SELECT
    *
    FROM
    rfwsmqex_gvsl_costsys.subclasificacion
    WHERE idSubClasificacion = ? ";

    $sql = $this->_Read($query, $array);

    foreach ($sql as $key) {
    $nombre_grupo = '<span style="font-size:.87em; font-weight:700;">' .$key['nombre'].'</span>';
    }
    return $nombre_grupo;
}

function SELECT_PRODUCTOS_x_COSTSYS($array){

$query = "
SELECT
recetas.idReceta AS id,
DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,
recetas.nombre,
recetas.precioVenta AS costo,
recetas.id_Estado,
id_SubClasificacion
FROM
rfwsmqex_gvsl_costsys.recetas
    WHERE recetas.id_UDN = ? and id_Clasificacion = ?
    ORDER BY fecha desc
";

return $this->_Read($query, $array);
}

function consultar_x_mes($array){

        $TotalProduccion = 0;
        $listPrecios = '';
        $query =
            "SELECT
         costo,
         DATE_FORMAT(foliofecha,'%Y-%m-%d') as fecha,
   -- SUM(listaproductos.cantidad) as total,
   id_lista
   FROM
   rfwsmqex_gvsl_produccion.listaproductos
   INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
   INNER JOIN rfwsmqex_gvsl_produccion.almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
   WHERE
      MONTH(foliofecha) = ?
   AND  YEAR(foliofecha)  = ?
   AND  id_tipo           = ? 
   AND  idAlmacen         = ?

   -- GROUP BY idAlmacen
   ";
        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            // $TotalProduccion = $key['total'];
            $listPrecios .= ', ( $ '.$key['costo'].' / '. $key['fecha'].' )';
        }

        return $listPrecios;
}

    function lsRangeDate($array)
    {

        $TotalProduccion = 0;
        $query =
            "SELECT
   SUM(listaproductos.cantidad) as total,
   id_lista
   FROM
   rfwsmqex_gvsl_produccion.listaproductos
   INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
   INNER JOIN rfwsmqex_gvsl_produccion.almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
   WHERE
  foliofecha
    BETWEEN ? AND ?
   AND  id_tipo           = ? 
   AND  idAlmacen         = ?

   GROUP BY idAlmacen
   ";
        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $TotalProduccion = $key['total'];
        }

        return $TotalProduccion;
    }


function CrearEnlace($array){

        return $this->_Insert([
            'table' => "{$this->bd}homologado",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }


function listProducts($array){

    $query = "
    SELECT
        idAlmacen as id,
        FechaIngreso as fecha,
        NombreProducto,
        estadoProducto,

        NotFoundReceta,
        sugerencia,
        diasMerma,
        multiploProduccion,

        lunes,
        martes,
        miercoles,
        jueves,
        viernes,
        sabado,
        domingo
    FROM
    {$this->_bd}almacen_productos

    WHERE Area = ?  

    order BY NombreProducto ASC
    ";

    return $this->_Read($query, $array);
}


function lsCostsys($array){

    $query = "
    SELECT

        rfwsmqex_gvsl_costsys.recetas.nombre,
        rfwsmqex_gvsl_produccion.homologado.id_Produccion,
        rfwsmqex_gvsl_produccion.homologado.id_Costsys,            
        rfwsmqex_gvsl_costsys.recetas.precioVenta,
        rfwsmqex_gvsl_produccion.homologado.idHomologado,
        rfwsmqex_gvsl_produccion.homologado.homologado,
        rfwsmqex_gvsl_costsys.recetas.idReceta,
        DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha

    FROM
        rfwsmqex_gvsl_produccion.homologado
        INNER JOIN rfwsmqex_gvsl_costsys.recetas ON 
        rfwsmqex_gvsl_produccion.homologado.id_Costsys = rfwsmqex_gvsl_costsys.recetas.idReceta
    WHERE id_Produccion = ?

    ";

    return $this->_Read($query, $array);


}

    function cb_producto_costsys($array) {
        $query = "
    SELECT
        idReceta,nombre,precioVenta
    FROM
        rfwsmqex_gvsl_costsys.recetas WHERE id_UDN = ? 
        AND id_Clasificacion = ?
        order by id_Subclasificacion desc
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
        diasMerma,
        estadoProducto,
        multiploProduccion,
        lunes,
        martes,
        miercoles,
        jueves,
        viernes,
        sabado,
        domingo
        FROM
        {$this->bd}almacen_productos
        INNER JOIN {$this->bd}homologado ON homologado.id_Produccion = almacen_productos.idAlmacen
        WHERE id_Costsys = ?
    ";

    return $this->_Read($query, $array);
}

function ipt($array){
    return $this->_Update([
        'table'  => "{$this->bd}almacen_productos",
        'values' => $array['values'],
        'where'  => $array['where'],
        'data'   => $array['data']
    ]);
}
    function set_name_producto($array) {

        return $this->_Update([
            'table'  => "{$this->bd}almacen_productos",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function estado_producto($array)
    {

        return $this->_Update([

            'table'  => "{$this->bd}almacen_productos",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }





}
?>