<?php
require_once ('../../conf/_CRUD.php');

class Recetas extends CRUD
{
    private $bd;
    public function __construct()
    {
        $this->bd = 'rfwsmqex_gvsl_costsys.';
        // $this->bd = 'rfwsmqex_gvsl_costsys.';
    }

    // PRODUCCIÓN FOGAZA --------------------------------------------------------
    function getLinkFogaza($array)
    {

        $query = "
        SELECT
        almacen_productos.idAlmacen,
        almacen_productos.NombreProducto,
        estadoProducto
        FROM
        rfwsmqex_gvsl_produccion.almacen_productos
        INNER JOIN rfwsmqex_gvsl_produccion.homologado ON homologado.id_Produccion = almacen_productos.idAlmacen
        WHERE id_Costsys = ?
    ";

        return $this->_Read($query, $array);
    }

    function getProductosFogaza()
    {
        $query = "SELECT
            rfwsmqex_gvsl_produccion2.almacen_productos.idAlmacen AS id,
            rfwsmqex_gvsl_produccion2.almacen_productos.NombreProducto AS valor,
            homologado.id_Costsys AS idreceta,
            homologado.id_Produccion,
            homologado.idHomologado,
            rfwsmqex_gvsl_produccion2.almacen_productos.estadoProducto
        FROM
            rfwsmqex_gvsl_produccion2.almacen_productos
        LEFT JOIN rfwsmqex_gvsl_produccion2.homologado ON homologado.id_Produccion = rfwsmqex_gvsl_produccion2.almacen_productos.idAlmacen
        WHERE
            estadoProducto = 1
        ORDER BY
            valor ASC";

        return $this->_Read($query, null);
    }

    function createHomologado($array)
    {
        return $this->_Insert([
            'table' => 'rfwsmqex_gvsl_produccion2.homologado',
            'values' => 'id_Costsys, id_Produccion',
            'data' => $array['data']
        ]);
    }

    function updateHomologado($array)
    {
        return $this->_Update([
            'table' => 'rfwsmqex_gvsl_produccion2.homologado',
            'values' => 'id_Costsys',
            'where' => 'id_Produccion',
            'data' => $array['data']
        ]);
    }


    // SOFTRESTAURANT -----------------------------------------------------------
    function getRecetasSoft()
    {
        $query = "SELECT
            soft_productos.id_Producto AS id,
            soft_productos.descripcion AS valor,
            soft_costsys.id_costsys_recetas AS idreceta,
            soft_productos.id_udn AS idudn,
            soft_productos.activo_soft 
        FROM
            rfwsmqex_gvsl_finanzas.soft_productos
        LEFT JOIN rfwsmqex_gvsl_finanzas.soft_costsys ON soft_costsys.id_soft_productos = soft_productos.id_Producto
        WHERE
            soft_productos.descripcion IS NOT NULL
        AND soft_productos.activo_soft = 1
        ORDER BY
            soft_productos.descripcion ASC";

        return $this->_Read($query, null);
    }

    function createRecetaSoft($array)
    {
        return $this->_Insert([
            'table' => 'rfwsmqex_gvsl_finanzas.soft_costsys',
            'values' => 'id_costsys_recetas, id_soft_productos',
            'data' => $array['data']
        ]);
    }

    function updateRecetaSoft($array)
    {
        return $this->_Update([
            'table' => 'rfwsmqex_gvsl_finanzas.soft_costsys',
            'values' => 'id_costsys_recetas',
            'where' => 'id_soft_productos',
            'data' => $array['data']
        ]);
    }

    // RECETA ------------------------------------------------------------------
    // Listar recetas
    function getRecetas($array)
    {
        $query = "SELECT
            idReceta AS id,
            Clasificacion AS clasificacion,
            precioVenta AS precio,
            rendimiento,
            nota,
            observaciones,
            id_Clasificacion AS idclasificacion,
            id_Subclasificacion,
            {$this->bd}recetas.nombre AS valor,
            {$this->bd}unidad.nombre AS unidad,
            {$this->bd}recetas.id_UDN AS idudn,
            {$this->bd}recetas.iva AS iva,
            {$this->bd}recetas.foto AS foto,
            fecha AS fecha
        FROM
            {$this->bd}recetas
        LEFT JOIN {$this->bd}unidad ON id_Unidad = idUnidad
        LEFT JOIN {$this->bd}clasificacion ON id_Clasificacion = idClasificacion
        WHERE
            id_Clasificacion = ?
        -- AND {$this->bd}recetas.nombre LIKE '%natilla%'
        AND
            id_Estado = 1
        ORDER BY
            {$this->bd}recetas.nombre ASC";

        return $this->_Read($query, $array);
    }

    function getRecetaById($array)
    {
        return $this->_Select([
            'table' => "{$this->bd}recetas",
            'values' => "idReceta AS id, {$this->bd}recetas.nombre AS valor, UDN, Clasificacion AS clase, {$this->bd}subclasificacion.nombre AS subclase, nota, rendimiento, precioVenta AS precio, {$this->bd}recetas.iva, foto, observaciones, {$this->bd}recetas.id_Clasificacion AS idclasificacion, id_Subclasificacion AS idsubclasificacion",
            'where' => 'idReceta',
            'leftjoin' => ['udn' => "{$this->bd}recetas.id_UDN = idUDN", "{$this->bd}clasificacion" => "id_Clasificacion = idClasificacion", "{$this->bd}subclasificacion" => "id_Subclasificacion = idSubClasificacion"],
            'data' => $array
        ])[0];
    }

    function GET_SUB($array)
    {
        $name = "";
        $query = "SELECT
            subclasificacion.idSubClasificacion,
            subclasificacion.nombre
        FROM
            rfwsmqex_gvsl_costsys.subclasificacion
        WHERE
            idSubClasificacion = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $name = $key['nombre'];
        }
        return $name;
    }

    // Obtener id de receta
    function idReceta($array)
    {
        return $this->_Select([
            'table' => "{$this->bd}recetas",
            'values' => 'idReceta',
            'where' => $array['values'],
            'data' => $array['data']
        ])[0]['idReceta'];
    }

    // Crear receta
    function createReceta($array)
    {
        $insert = $this->_Insert([
            'table' => "{$this->bd}recetas",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
        return ($insert === true) ? $this->idReceta($array) : $insert;
    }

    // Actualizar receta
    function updateReceta($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}recetas",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Actualizar foto receta
    function updatePhotoReceta($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}recetas",
            'values' => 'foto',
            'where' => 'idReceta',
            'data' => $array
        ]);
    }

    // Eliminar foto de receta
    function deletePhotoReceta($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}recetas",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Validar receta
    function validateReceta($nombre, $udn)
    {
        $query = "SELECT
                idReceta AS id,
                nombre,
                id_UDN AS id_udn   
            FROM
                {$this->bd}recetas
            WHERE
                TRIM(nombre) LIKE ? AND id_UDN = ? AND id_Estado = 1";
        $array = ['%' . trim($nombre) . '%', $udn];
        return $this->_Read($query, $array);
    }

    // RECETAS-INGREDIENTES --------------------------------------------------------
    // Listar recetas-ingredientes
    function lsRecetasIngredientes($array)
    {
        $query = "SELECT
            id_Ingrediente AS id,
            {$this->bd}ingredientes.nombre AS valor,
            {$this->bd}unidad.nombre AS unidad,
            cantidad,
            ROUND(
                {$this->bd}ingredientes.precio / {$this->bd}ingredientes.contNeto,
                2
            ) AS precioUnidad,
            ROUND(
                {$this->bd}ingredientes.precio / {$this->bd}ingredientes.contNeto * cantidad,
                2
            ) AS costo
        FROM
            {$this->bd}recetas_ingredientes
        LEFT JOIN {$this->bd}ingredientes ON idIngrediente = id_Ingrediente
        LEFT JOIN {$this->bd}unidad ON idUnidad = ingredientes.id_Unidad
        WHERE
            id_Receta = ?
        ORDER BY
            {$this->bd}ingredientes.nombre ASC";
        return $this->_Read($query, $array);
    }

    // Crear o actualizar recetas-ingredientes
    function existRecetasIngredientes($array)
    {
        $query = "SELECT
            id_Ingrediente
        FROM
            {$this->bd}recetas_ingredientes
        WHERE
            id_Ingrediente = ?
        AND
            id_Receta = ?";

        $sql = $this->_Read($query, $array);
        foreach ($sql as $key)
            ;

        return count($key);
    }

    function createRecetasIngredientes($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}recetas_ingredientes",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateRecetasIngredientes($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}recetas_ingredientes",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Eliminar recetas-ingredientes
    function deleteRecetasIngredientes($array)
    {
        return $this->_Delete([
            'table' => "{$this->bd}recetas_ingredientes",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // RECETAS-SUBRECETAS ----------------------------------------------------------
    // Listar recetas-subrecetas
    function lsRecetasSubRecetas($array)
    {
        $query = "SELECT
            id_Subreceta AS id,
            {$this->bd}subreceta.nombre AS valor,
            {$this->bd}unidad.nombre AS unidad,
            cantidad,
            subreceta.rendimiento
        FROM
            {$this->bd}recetas_subrecetas
        LEFT JOIN {$this->bd}subreceta ON idSubreceta = id_Subreceta
        LEFT JOIN {$this->bd}unidad ON idUnidad = subreceta.id_Unidad 
        WHERE
            id_Receta = ?
        ORDER BY
            {$this->bd}subreceta.nombre ASC";
        return $this->_Read($query, $array);
    }

    // Crear o actualizar recetas-subrecetas
    function existRecetasSubRecetas($array)
    {
        $query = "SELECT
            id_Subreceta
        FROM
            {$this->bd}recetas_subrecetas
        WHERE
            id_Subreceta = ?
        AND 
            id_Receta = ?";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key)
            ;

        return count($key);
    }

    function createRecetasSubRecetas($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}recetas_subrecetas",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateRecetasSubRecetas($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}recetas_subrecetas",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Eliminar recetas-subrecetas
    function deleteRecetasSubRecetas($array)
    {
        return $this->_Delete([
            'table' => "{$this->bd}recetas_subrecetas",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }
}
?>