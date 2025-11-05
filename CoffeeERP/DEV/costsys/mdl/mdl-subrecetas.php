<?php
require_once ('../../conf/_CRUD.php');

class Subrecetas extends CRUD
{
    private $bd;
    public function __construct()
    {
        $this->bd = 'rfwsmqex_gvsl_costsys.';
        // $this->bd = 'rfwsmqex_gvsl_costsys.';
    }
    // SUBRECETA ------------------------------------------------------------------
    // Listar subrecetas
    function getSubRecetas($array)
    {
        $query = "SELECT
            idSubreceta AS id,
            Clasificacion AS clasificacion,
            precioVenta AS precio,
            rendimiento,
            nota,
            observaciones,
            id_Clasificacion AS idclasificacion,
            id_Unidad AS idunidad,
            {$this->bd}subreceta.nombre AS valor,
            {$this->bd}unidad.nombre AS unidad,
            {$this->bd}subreceta.id_UDN AS idudn,
            {$this->bd}subreceta.foto AS foto,
            fecha AS fecha
        FROM
            {$this->bd}subreceta
        LEFT JOIN {$this->bd}unidad ON id_Unidad = idUnidad
        LEFT JOIN {$this->bd}clasificacion ON id_Clasificacion = idClasificacion
        WHERE
            id_Clasificacion = ?
        AND 
            subreceta.id_Status = 1
        AND 
            stado = 1
        ORDER BY
            {$this->bd}subreceta.nombre ASC";
        return $this->_Read($query, $array);
    }

    function getSubRecetaById($array)
    {
        return $this->_Select([
            'table' => "{$this->bd}subreceta",
            'values' => "{$this->bd}subreceta.nombre AS valor,UDN as udn,Clasificacion AS clase, nota, id_Clasificacion AS idclasificacion, observaciones, foto, rendimiento, {$this->bd}unidad.nombre AS unidad",
            'where' => 'idSubreceta',
            'innerjoin' => ['udn' => "{$this->bd}subreceta.id_UDN = idUDN", "{$this->bd}clasificacion" => "idClasificacion = id_Clasificacion"],
            'leftjoin' => ["{$this->bd}unidad" => "id_Unidad = idUnidad"], 
            'data' => $array
        ])[0];
    }

    function selectSubReceta()
    {
        return $this->_Select([
            'table' => "{$this->bd}subreceta",
            'values' => 'idSubreceta AS id, nombre AS valor, id_Clasificacion AS idclasificacion, id_UDN AS idudn',
            'order' => [
                'ASC' => 'nombre'
            ],
            'where' => 'id_Status = 1',
        ]);
    }

    // Obtener id de subreceta
    function idSubreceta($array)
    {
        return $this->_Select([
            'table' => "{$this->bd}subreceta",
            'values' => 'idSubreceta',
            'where' => $array['values'],
            'data' => $array['data']
        ])[0]['idSubreceta'];
    }

    // Crear subreceta
    function createSubReceta($array)
    {
        $insert = $this->_Insert([
            'table' => "{$this->bd}subreceta",
            'values' => $array['values'],
            'data' => $array['data']
        ]);

        return ($insert == true) ? $this->idSubreceta($array) : $insert;
    }

    // Actualizar subreceta
    function updateSubReceta($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}subreceta",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Actualizar foto de subreceta
    function updatePhotoSubReceta($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}subreceta",
            'values' => 'foto',
            'where' => 'idSubreceta',
            'data' => $array
        ]);
    }

    // Eliminar foto de subreceta
    function deletePhotoSubReceta($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}subreceta",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Validar subreceta
    function validateSubReceta($nombre, $udn)
    {
        $query = "SELECT
            idSubreceta AS id,
            nombre,
            id_UDN AS id_udn   
        FROM
            {$this->bd}subreceta
        WHERE
            TRIM(nombre) LIKE ? AND id_UDN = ?";
        $array = ['%' . trim($nombre) . '%', $udn];
        return $this->_Read($query, $array);
    }

    // SUBRECETA-INGREDIENTE --------------------------------------------------------
    // Listar subreceta-ingrediente
    function lsSubRecetaIngrediente($array)
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
            {$this->bd}subreceta_ingrediente
        LEFT JOIN {$this->bd}ingredientes ON idIngrediente = id_Ingrediente
        LEFT JOIN {$this->bd}unidad ON idUnidad = ingredientes.id_Unidad
        WHERE
            id_Subreceta = ?
        ORDER BY
            {$this->bd}ingredientes.nombre ASC";
        return $this->_Read($query, $array);
    }

    // Crear o actualizar subreceta-ingrediente
    function existSubRecetaIngrediente($array)
    {
        $query = "SELECT
            id_Ingrediente
        FROM
            {$this->bd}subreceta_ingrediente
        WHERE
            id_Ingrediente = ?  
        AND 
            id_Subreceta = ?";

        $sql = $this->_Read($query, $array);
        foreach ($sql as $key)
            ;

        return count($key);
    }

    function createSubRecetaIngrediente($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}subreceta_ingrediente",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSubRecetaIngrediente($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}subreceta_ingrediente",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Eliminar subreceta-ingrediente
    function deleteSubRecetaIngrediente($array)
    {
        return $this->_Delete([
            'table' => "{$this->bd}subreceta_ingrediente",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // SUBRECETA-SUBRECETA --------------------------------------------------------
    // Listar subreceta-subreceta
    function lsSubRecetaSubReceta($array)
    {
        $query = "SELECT
            id_Subreceta2 AS id,
            {$this->bd}subreceta.nombre AS valor,
            {$this->bd}unidad.nombre AS unidad,
            cantidad,
            subreceta.rendimiento
        FROM
            {$this->bd}subreceta_subreceta
        LEFT JOIN {$this->bd}subreceta ON idSubreceta = id_Subreceta2
        LEFT JOIN {$this->bd}unidad ON idUnidad = subreceta.id_Unidad
        WHERE
            id_Subreceta1 = ?
        ORDER BY
            {$this->bd}subreceta.nombre ASC";
        return $this->_Read($query, $array);
    }

    // Crear o actualizar subreceta-subreceta
    function existSubRecetaSubReceta($array)
    {
        $query = "SELECT
            id_Subreceta2
        FROM
            {$this->bd}subreceta_subreceta
        WHERE
            id_Subreceta2 = ?
        AND
            id_Subreceta1 = ?";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key)
            ;

        return count($key);
    }

    function createSubRecetaSubReceta($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}subreceta_subreceta",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSubRecetaSubReceta($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}subreceta_subreceta",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Eliminar subreceta-subreceta
    function deleteSubRecetaSubReceta($array)
    {
        return $this->_Delete([
            'table' => "{$this->bd}subreceta_subreceta",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // SUBRECETA-RECETA --------------------------------------------------------
    // Listar subreceta-receta
    function lsSubRecetaReceta($array)
    {
        $query = "SELECT
            id_Receta AS id,
            {$this->bd}recetas.nombre AS valor
        FROM
            {$this->bd}recetas_subrecetas
        LEFT JOIN {$this->bd}recetas ON idReceta = id_Receta
        WHERE
            id_Subreceta = ?
        ORDER BY
            {$this->bd}recetas.nombre ASC";
        return $this->_Read($query, $array);
    }
}
?>