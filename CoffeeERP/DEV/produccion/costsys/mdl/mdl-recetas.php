<?php
require_once ('../../../conf/_CRUD.php');

class Recetas extends CRUD
{
    private $bd;
    public function __construct()
    {
        $this->bd = 'rfwsmqex_gvsl_costsys2.';
        // $this->bd = 'costsys_';
    }
    
    // RECETA ------------------------------------------------------------------
    // Listar recetas
    function lsRecetas($array)
    {
        $query = "SELECT
            idReceta AS id,
            Clasificacion AS clasificacion,
            precioVenta AS precio,
            rendimiento,
            nota,
            id_Subclasificacion,
            id_Clasificacion,
            {$this->bd}recetas.nombre AS valor,
            {$this->bd}unidad.nombre AS unidad,
            {$this->bd}recetas.id_UDN
        FROM
            {$this->bd}recetas
        LEFT JOIN {$this->bd}unidad ON id_Unidad = idUnidad
        LEFT JOIN {$this->bd}clasificacion ON id_Clasificacion = idClasificacion
        WHERE
            id_Clasificacion = ?
        AND id_Estado = 1
        ORDER BY {$this->bd}recetas.nombre ASC";

        return $this->_Read($query, $array);
    }

    function getRecetas()
    {
        $query = "SELECT
            idReceta AS id,
            Clasificacion AS clasificacion,
            precioVenta AS precio,
            rendimiento,
            nota,
            id_Clasificacion AS idclasificacion,
            {$this->bd}recetas.nombre AS valor,
            {$this->bd}unidad.nombre AS unidad,
            {$this->bd}recetas.id_UDN AS idudn,
            {$this->bd}recetas.iva AS iva,
            {$this->bd}recetas.foto AS foto
        FROM
            {$this->bd}recetas
        LEFT JOIN {$this->bd}unidad ON id_Unidad = idUnidad
        LEFT JOIN {$this->bd}clasificacion ON id_Clasificacion = idClasificacion
        WHERE
            id_Estado = 1
        ORDER BY
            {$this->bd}recetas.nombre ASC";
        return $this->_Read($query, null);
    }

    function getRecetaById($array)
    {
        return $this->_Select([
            'table' => "{$this->bd}recetas",
            'values' => 'nombre,UDN,Clasificacion AS clase',
            'where' => 'idReceta',
            'innerjoin' => ['udn' => "{$this->bd}recetas.id_UDN = idUDN", "{$this->bd}clasificacion" => "idClasificacion = id_Clasificacion"],
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

    // Eliminar ingredientes-recetas
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