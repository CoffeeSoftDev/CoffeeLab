<?php
require_once ('../../conf/_CRUD.php');

class Administracion extends CRUD
{
    private $bd;
    public function __construct()
    {
        $this->bd = 'rfwsmqex_gvsl_costsys.';
        // $this->bd = 'rfwsmqex_gvsl_costsys.';
    }

    // Lista select de UDN
    function lsUDN()
    {
        $query = "SELECT
            idUDN AS id,
            UDN AS valor
        FROM
            udn
        INNER JOIN costsys_clasificacion ON id_UDN = idUDN
        WHERE
            costsys_clasificacion.Stado = 1
        GROUP BY
            idUDN
        ORDER BY 
            Antiguedad ASC";
        return $this->_Read($query, null);
    }

    // Lista de clasificaciones
    function lsClassifications()
    {
        $query = "SELECT
            idClasificacion AS id,
            Clasificacion AS valor,
            id_UDN AS idudn,
            udn.UDN AS udn,
            udn.Abreviatura AS abreviatura,
            iva AS impuestos,
            {$this->bd}clasificacion.stado AS estado
        FROM
            {$this->bd}clasificacion
        LEFT JOIN udn ON idUDN = id_UDN
        WHERE 
            {$this->bd}clasificacion.stado = 1
        ORDER BY
            Antiguedad, Clasificacion ASC";
        return $this->_Read($query, null);
    }

    // Lista de subclasificaciones
    function lsSubClassifications()
    {
        $query = "SELECT
            idSubClasificacion AS id,
            nombre AS valor,
            id_Clasificacion AS idclasificacion,
            Clasificacion AS clasificacion
        FROM
            {$this->bd}subclasificacion
        LEFT JOIN {$this->bd}clasificacion ON idClasificacion = id_Clasificacion
        WHERE
            {$this->bd}subclasificacion.Stado = 1
        ORDER BY
            nombre ASC";
        return $this->_Read($query, null);
    }
    
    // Lista de clasificaciones por UDN
    function lsClassificationsTb($array)
    {
        $query = "SELECT
            idClasificacion AS id,
            Clasificacion AS valor,
            id_UDN AS idudn,
            udn.UDN AS udn,
            udn.Abreviatura AS abreviatura,
            iva AS impuestos,
            {$this->bd}clasificacion.stado AS estado
        FROM
            {$this->bd}clasificacion
        LEFT JOIN udn ON idUDN = id_UDN
        WHERE 
            {$this->bd}clasificacion.stado = 1
        AND id_UDN = ?
        ORDER BY
            Antiguedad, Clasificacion ASC";
        return $this->_Read($query, $array);
    }

    // Lista de subclasificaciones por clasificación
    function lsSubClassificationTb($array)
    {
        $query = "SELECT
            idSubClasificacion AS id,
            nombre AS valor,
            id_Clasificacion AS idclasificacion,
            Clasificacion AS clasificacion
        FROM
            {$this->bd}subclasificacion
        LEFT JOIN {$this->bd}clasificacion ON idClasificacion = id_Clasificacion
        WHERE
            {$this->bd}subclasificacion.Stado = 1
        AND id_Clasificacion = ?
        ORDER BY
            nombre ASC";
        return $this->_Read($query, $array);
    }

    // Crear clasificación
    function createClassification($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}clasificacion",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // Crear subclasificación
    function createSubClassification($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}subclasificacion",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }
    // Eliminar clasificación
    function deleteClassification($array)
    {
        $query = "UPDATE {$this->bd}clasificacion SET stado = 0 WHERE idClasificacion = ?";
        return $this->_CUD($query, $array);
    }

    // Eliminar subclasificación
    function deleteSubClassification($array)
    {
        $query = "UPDATE {$this->bd}subclasificacion SET Stado = 0 WHERE idSubClasificacion = ?";
        return $this->_CUD($query, $array);
    }
}
?>