<?php
require_once ('../../../conf/_CRUD.php');

class Controldemerma extends CRUD
{

    private $bd;
    public function __construct()
    {
        $this->bd = "rfwsmqex_gvsl_produccion.";
    }

    function lsUDN()
    {
        $query = "SELECT idUDN AS id, UDN AS valor FROM udn WHERE Stado = 1";
        return $this->_Read($query, null);
    }

    function lsArea()
    {
        $query = "
            SELECT
            rfwsmqex_gvsl_produccion.almacen_area.idArea as id,
            rfwsmqex_gvsl_produccion.almacen_area.Nombre_Area as valor
            FROM
            rfwsmqex_gvsl_produccion.almacen_area
            WHERE idArea != 3
        ";
        return $this->_Read($query, null);
    }

    function lsProductos()
    {
        $query = "
            SELECT
            idAlmacen as id,
            NombreProducto as valor,
            Area
            FROM
            {$this->bd}almacen_productos

        ";
        return $this->_Read($query, null);
    }
    function lsRecetas()
    {
        $query = "
            SELECT
            recetas.idReceta,
            recetas.nombre,
            recetas.precioVenta,
            homologado.id_Produccion,
            recetas.id_Clasificacion
            FROM
            rfwsmqex_gvsl_costsys.recetas
            INNER JOIN rfwsmqex_gvsl_produccion.homologado ON rfwsmqex_gvsl_produccion.homologado.id_Costsys = rfwsmqex_gvsl_costsys.recetas.idReceta

        ";
        return $this->_Read($query, null);
    }

    function lsAlmacenProductos()
    {
        // $query = "

        // SELECT
        //     idAlmacen as id,
        //     NombreProducto as valor,
        //     Area
        // FROM
        // {$this->bd}almacen_productos

        // WHERE Area = ? and estadoProducto = 1
        // ORDER BY NombreProducto DESC

        // ";
        $query = "
       
            SELECT
            almacen_productos.idAlmacen AS id,
            almacen_productos.NombreProducto AS valor,
            almacen_productos.Area
            FROM
            {$this->bd}almacen_productos

            INNER JOIN {$this->bd}homologado ON homologado.id_Produccion = almacen_productos.idAlmacen
            WHERE estadoProducto = 1
            ORDER BY NombreProducto DESC

        ";
        return $this->_Read($query,null);
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

    function __getFolio(){


        // $query = "
            
        //     SELECT
        //       
        //         almacen_area.Nombre_Area,
        //         lista_productos.id_Estado,
        //         lista_productos.folio,
        //         lista_productos.id_tipo,
        //         lista_productos.id_grupo,
        //         lista_productos.nota,
       
       
        //     FROM
        //     {$this->bd}almacen_area
        //     INNER JOIN {$this->bd}lista_productos ON lista_productos.id_grupo = almacen_area.idArea
        //     WHERE
        //     id_tipo = ? 
        //     -- and id_Estado = 1 
        //     order by idLista desc
            
        //     LIMIT 1
        //     -- AND DATE_FORMAT(foliofecha,'%Y-%m-%d') = ?
        //     ";
        $query = "

            SELECT
                lista_productos.idLista as id,
                lista_productos.folio,
                lista_productos.foliofecha,
                lista_productos.nota,
                lista_productos.id_grupo,
                lista_productos.id_Estado,
                lista_productos.new_estado,
                lista_productos.estado_revisado,
                lista_productos.id_tipo,
                lista_productos.idLista,
                DATE_FORMAT(foliofecha,'%Y-%m-%d') as fecha,
                DATE_FORMAT(foliofecha,'%r') as hora 
            FROM
            {$this->bd}lista_productos
            WHERE id_Estado = 1 and id_tipo = 2 
            and estado_revisado = 0
            ORDER BY idLista desc

            LIMIT 1 
           


        
        ";

        return $this->_Read($query,null);

    }

    function CrearTicket($array)
    {

        return $this->_Insert([
            'table' => "{$this->bd}lista_productos",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function Select_Productos($array)
    {

        // $query = "
        // SELECT
        // idListaProductos as id,

        // NombreProducto,
        // cantidad,
        // listaproductos.sugerencia as sug,

        // costo,
        // cantidad * costo as total,

        // almacen_productos.EstadoProducto,
        // estado_sugerencia,
        // almacen_productos.sugerencia as sugerido
        // FROM
        // {$this->bd}listaproductos
        // INNER JOIN {$this->bd}almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
        // WHERE  id_lista = ?

        // ORDER BY idListaProductos DESC
        // ";


        $query = "

        SELECT
            idListaProductos as id,
            listaproductos.sugerencia as sug,
            cantidad * costo AS total,
            almacen_area.Nombre_Area,
            almacen_productos.NombreProducto,
            listaproductos.cantidad,
            listaproductos.costo,
            listaproductos.EstadoProducto,
            listaproductos.id_lista
        FROM
        {$this->bd}almacen_area
        INNER JOIN {$this->bd}almacen_productos ON almacen_productos.Area = almacen_area.idArea
        INNER JOIN {$this->bd}listaproductos ON listaproductos.id_productos = almacen_productos.idAlmacen

        WHERE  id_lista = ?
        ORDER BY idListaProductos DESC
        
        ";

        $sql = $this->_Read($query, $array);
        return $sql;
    }

    function add_productos($array)
    {

        return $this->_Insert([
            'table' => "{$this->bd}listaproductos",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function remove_producto($array)
    {

        $query = "
            DELETE FROM 
                {$this->bd}listaproductos 
            WHERE idListaProductos = ?
        ";

        return $this->_CUD($query, $array);
    }


    function cerrarTicket($array){

        return $this->_Update([
            'table' => "{$this->bd}lista_productos",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);

    }

    function update_cant($array)
    {

        return $this->_Update([
            'table' => "{$this->bd}listaproductos",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }


}
?>