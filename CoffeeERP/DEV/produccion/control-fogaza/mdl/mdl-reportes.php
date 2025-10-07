<?php
require_once ('../../../conf/_CRUD.php');

class Reportes extends CRUD
{
    private $bd;
    public function __construct(){
        $this->bd = "rfwsmqex_gvsl_produccion.";
    }

    function lsUDN() {
        $query = "SELECT idUDN AS id, UDN AS valor FROM {$this->bd}udn WHERE Stado = 1";
        return $this->_Read($query, null);
    }

    function CrearTicket($array) {

        return $this->_Insert([
            'table' => "{$this->bd}lista_productos",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function lsDataTicket($array){

        $query = "
        SELECT
            lista_productos.folio,
            lista_productos.foliofecha,
            lista_productos.id_tipo,
            lista_productos.new_estado,
            lista_productos.estado_revisado,
            lista_productos.turno,
            lista_productos.fecha_cierre,
            DATE_FORMAT(foliofecha,'%Y-%m-%d') AS fecha,
            DATE_FORMAT(foliofecha,'%r') AS hora,
            almacen_area.Nombre_Area,
            nota
        FROM
        {$this->bd}lista_productos
        INNER JOIN {$this->bd}almacen_area ON lista_productos.id_grupo = almacen_area.idArea
        WHERE idLista = ? ";

        return $this->_Read($query, $array);
    }

    function CancelarFolio($array) {

        return $this->_Update([
            'table' => "{$this->bd}lista_productos",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function cerrarTicket($array) {

        return $this->_Update([
            'table' => "{$this->bd}lista_productos",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }


    function lsProductosCostsys($array){

        $query = "
        SELECT
            idReceta as id,
            recetas.nombre,
            clasificacion.Clasificacion,
            precioVenta as costo,
            DATE_FORMAT(fecha,'%Y-%m-%d') as fecha,
            id_SubClasificacion, 
            id_Estado
        FROM
            rfwsmqex_gvsl_costsys.recetas
        INNER JOIN rfwsmqex_gvsl_costsys.clasificacion 
        ON recetas.id_Clasificacion = clasificacion.idClasificacion
        WHERE recetas.id_UDN = ? and id_Clasificacion = ?

        
        ORDER BY nombre asc
        ";

        return $this->_Read($query, $array);
    }

    function idListaProducto($array){
        $id = '';
        
        $query = "

            SELECT
                idListaProductos
            FROM
                {$this->bd}listaproductos
            WHERE id_productos = ? and  id_lista = ?";

        $sql   = $this->_Read($query, $array);
        


        foreach ($sql as $key ){
            $id = $key['idListaProductos'];
        }

        return $id;
    }

    function NombreSubcategoria($array){
        $name = '';
        $query = '
        SELECT
        subclasificacion.idSubClasificacion,
        subclasificacion.nombre
        FROM rfwsmqex_gvsl_costsys.subclasificacion
        WHERE idSubClasificacion = ? ';

        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $name = $key['nombre'];
        }
        return $name;
    }

    function _PRODUCTOS_FOGAZA_LINK_COSTSYS_ORDER($array, $dia){
        $query = "
        SELECT
            almacen_productos.idAlmacen,
            almacen_productos.NombreProducto,
            almacen_productos.Area,

            NotFoundReceta,
            sugerencia,
            diasMerma,
            
            " . $dia . " as dia,
            estadoProducto
        FROM
        {$this->bd}almacen_productos
        INNER JOIN {$this->bd}homologado ON homologado.id_Produccion = almacen_productos.idAlmacen
        WHERE id_Costsys = ?
        ";

        return $this->_Read($query, $array);

    }

    function update_estado_producto($array) {

        return $this->_Update([
            'table'  => "{$this->bd}almacen_productos",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);

    }




    function lsFogazaLink($array, $dia){
        $query = "
        
      SELECT        
            almacen_productos.idAlmacen,
            almacen_productos.NombreProducto,
            almacen_productos.Area,

            NotFoundReceta,
            sugerencia,
            diasMerma,
            
            lunes as dia,
            estadoProducto,
            id_Costsys
        FROM
        {$this->bd}almacen_productos
        
        
        INNER JOIN {$this->bd}homologado ON homologado.id_Produccion = almacen_productos.idAlmacen
        WHERE Area = ? 
        ORDER BY NombreProducto asc
        
        ";

        return $this->_Read($query, $array);

    }


    function listProduction($array){
        $query = "
        
         SELECT        
            almacen_productos.idAlmacen,
            almacen_productos.NombreProducto,
            almacen_productos.Area,

            NotFoundReceta,
            sugerencia,
            diasMerma,
            
            lunes as dia,
            estadoProducto,
            id_Costsys
        FROM
        {$this->bd}almacen_productos
        
        
        INNER JOIN {$this->bd}homologado ON homologado.id_Produccion = almacen_productos.idAlmacen
        WHERE Area = ? and estadoProducto = ?
        ORDER BY NombreProducto asc
        
        ";

        return $this->_Read($query, $array);

    }


    function lsReceta($id)
    {
        return $this->_Select([
            "table"  => "rfwsmqex_gvsl_costsys.recetas",
            "values" => "idReceta,id_SubClasificacion,nombre,precioVenta as costo",
            "where"  => "idReceta",
            "data"   => [$id]
        ]);
    }




    function PRODUCCION_X_FECHA($array)
    {

        $list_ticket = '';

        $query =
            "SELECT
        listaproductos.cantidad,
        id_lista
        FROM
        {$this->bd}listaproductos
        INNER JOIN {$this->bd}lista_productos ON listaproductos.id_lista = lista_productos.idLista
        INNER JOIN {$this->bd}almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
        WHERE
            id_tipo   = ? 
        AND idAlmacen = ?
        AND DATE_FORMAT(foliofecha,'%Y-%m-%d') = ?
        ";

        $sql = $this->_Read($query, $array);
        $TotalProduccion = '0';

        foreach ($sql as $key) {

            $TotalProduccion = $TotalProduccion + $key['cantidad'];
            $list_ticket .= $key['id_lista'] . '->' . $key['cantidad'] . ', ';

        }

        $arreglo = array($TotalProduccion, $list_ticket);
        return $arreglo;
    }

    function lsFolio($array)
    {
        $folio = 0;

        $query = "
        SELECT

            idLista as id,
            id_Estado,
            folio,
            Nombre_Area,
            DATE_FORMAT(foliofecha,'%Y-%m-%d') as fecha,
            DATE_FORMAT(foliofecha,'%r') as hora,
            DATE_FORMAT(foliofecha,'%d/%m/%Y') as fecha2,
            turno,
            id_grupo

        FROM
        {$this->bd}almacen_area
        INNER JOIN {$this->bd}lista_productos ON {$this->bd}lista_productos.id_grupo = {$this->bd}almacen_area.idArea

        WHERE idLista = ?

        ";

        $sql = $this->_Read($query, $array);


        return $sql;
    }

    function __getFolio($array)
    {

        $query = "
            SELECT

                idLista as id,
                id_Estado,
                folio,
                Tipo,
                nota,
                DATE_FORMAT(foliofecha,'%Y-%m-%d') as fecha,
                DATE_FORMAT(foliofecha,'%r') as hora 
            
            FROM
            {$this->bd}lista_productos
            INNER JOIN {$this->bd}tiposolicitud
            ON lista_productos.id_tipo = tiposolicitud.idtipo
            WHERE id_tipo = ? and new_estado = 1
            order by idLista desc LIMIT 1

        ";

        return $this->_Read($query, $array);

    }

    function obtenerFolio($array)
    {
        $folio = 0;
        $query =
            "
      SELECT
      count(*) as folio
      FROM
      {$this->bd}lista_productos
      WHERE id_tipo = ?
      ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $folio = $key['folio'];
        }

        $new_folio = $folio + 1;
        return $new_folio;


    }

    function Productos_folio_activo($array)
    {

        $cantidad_total = '';
        $Costo = 0;
        $bandera = 0;
        $id_productos = 0;

        $sugerencia = '';
        $query = "
        SELECT
        listaproductos.id_productos,
        listaproductos.cantidad,
        listaproductos.costo,

        listaproductos.EstadoProducto,
        listaproductos.motivo,
        listaproductos.id_lista,

        idListaProductos,
        sugerencia
        FROM
        {$this->bd}listaproductos
        WHERE id_lista = ? and id_productos = ?

        ";

        $sql = $this->_Read($query, $array, "4");

        foreach ($sql as $key) {
            $cantidad_total = $cantidad_total + $key['cantidad'];
            $Costo = $key['costo'];
            $bandera = 1;
            $id_productos = $key['idListaProductos'];

            $sugerencia = $key['sugerencia'];
        }

        $data = array($bandera, $cantidad_total, $Costo, $id_productos, $sugerencia);
        return $data;
    }

    function __get_IDAREA($array)
    {
        $area = '';


        $query = '
        SELECT
            clasificacion.idClasificacion,
            clasificacion.Clasificacion
        FROM rfwsmqex_gvsl_costsys.clasificacion
        WHERE clasificacion = ?';

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $area = $key['idClasificacion'];
        }


        return $area;
    }

    function _fn($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}listaproductos",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }
    function actualizar_lista_productos($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}listaproductos",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }
    function get_id_lista($array)
    {
        $id = 0;

        $sql = $this->_Select([
            'table' => "{$this->bd}listaproductos",
            'values' => 'idListaProductos',
            'where' => $array['where'],
            'data' => $array['data']
        ]);

        foreach ($sql as $key) {
            $id = $key['idListaProductos'];
        }

        return $id;
    }

    function __getTotalProductos($array)
    {
        $query = "
             SELECT
             almacen_productos.NombreProducto,
             listaproductos.sugerencia,
             listaproductos.costo,
             listaproductos.id_lista
             FROM
             {$this->bd}listaproductos
             INNER JOIN {$this->bd}almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
             WHERE id_lista = ?
          ";

        return $this->_Read($query, $array);


    }

    function consultar_total($array)
    {
        $total = 0;

        $query = "
        SELECT
       
        
            SUM(sugerencia*costo) as totalcosto

        FROM {$this->bd}listaproductos
        WHERE id_lista = ?
    ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $total = $key['totalcosto'];
        }

        return $total;
    }

    function lsProduccion($array){
        $query = "
        SELECT
            listaproductos.id_productos,
            listaproductos.cantidad,
            listaproductos.costo,
            listaproductos.EstadoProducto,
            listaproductos.motivo,
            listaproductos.id_lista,
            listaproductos.idListaProductos,
            listaproductos.sugerencia,
            almacen_productos.NombreProducto
        FROM
        {$this->bd}listaproductos
        INNER JOIN {$this->bd}almacen_productos 
        ON listaproductos.id_productos = almacen_productos.idAlmacen
        WHERE id_lista = ? 
        ";

        return $this->_Read($query, $array);
    }

    // Quitar producto de la lista .
    function consultar_x_mes($array){

        $TotalProduccion = 0;
        $listPrecios = '';
        $query =
        "SELECT
        costo,
        cantidad,
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
        $listPrecios += $key['cantidad'];
        // $listPrecios .= ', (  '.$key['cantidad'].' / '. $key['fecha'].' )';
        }

        return $listPrecios;
    }

    function getIdListaProductos($array){

        $query = "

        SELECT
            idListaProductos,
            id_lista,
            id_productos,
            cantidad
        FROM {$this->bd}listaproductos

        WHERE id_lista = ? and id_productos = ?
     
        ";

        $sql = $this->_Read($query, $array);

        return $sql[0];
        
    }


    function quitar_lista($array){

        $query = "DELETE FROM {$this->bd}listaproductos WHERE idListaProductos = ?";
        return $this->_CUD($query, $array);

    }


}
?>