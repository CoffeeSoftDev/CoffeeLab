<?php
require_once('../../conf/_CRUD.php');


class Ingredientes extends CRUD
{
    private $bd;
    public function __construct()
    {
        $this->bd = 'rfwsmqex_gvsl_costsys.';
        // $this->bd = 'rfwsmqex_gvsl_costsys2.';
    }

    // INGREDIENTES ------------------------------------------------------------------
    // Listar ingredientes
    function lsIngredientes($array)
    {
        $query = "SELECT 
            idIngrediente AS id,
            contNeto AS neto,
            precio AS costo,
            ROUND(precio / contNeto,2) AS precioUnidad,
            {$this->bd}ingredientes.nombre AS valor,
            {$this->bd}ingredientes.id_UDN AS idudn,
            {$this->bd}unidad.nombre AS unidad,
            {$this->bd}unidad.idUnidad AS idunidad,
            {$this->bd}proveedor.nombre AS proveedor,
            {$this->bd}proveedor.idProveedor AS idproveedor,
            {$this->bd}marca.nombre AS marca,
            {$this->bd}marca.idMarca AS idmarca,
            descripcion
        FROM 
            {$this->bd}ingredientes
        LEFT JOIN {$this->bd}unidad ON id_Unidad = idUnidad
        LEFT JOIN {$this->bd}proveedor ON id_Proveedor = idProveedor
        LEFT JOIN {$this->bd}marca ON id_Marca = idMarca
        WHERE 
            id_UDN = ?
        ORDER BY {$this->bd}ingredientes.nombre ASC";

        return $this->_Read($query, $array);
    }

    // Listar recetas de ingredientes
    function lsIngredientesReceta($array)
    {
        $query = "SELECT
                id_Receta id,
                {$this->bd}ingredientes.nombre AS ing,
                {$this->bd}recetas.nombre AS rec
            FROM
                {$this->bd}recetas_ingredientes
            LEFT JOIN {$this->bd}ingredientes ON idIngrediente = id_Ingrediente
            LEFT JOIN {$this->bd}recetas ON idReceta = id_Receta
            LEFT JOIN {$this->bd}clasificacion ON idClasificacion = id_Clasificacion
            WHERE
                id_Ingrediente = ?
            AND {$this->bd}clasificacion.stado = 1
            ORDER BY
                {$this->bd}recetas.nombre ASC";

        return $this->_Read($query, $array);
    }

    // Listar ingredientes por subreceta
    function lsIngredientesSubreceta($array)
    {
        $query = "SELECT
                id_Subreceta id,
                {$this->bd}ingredientes.nombre AS ing,
                {$this->bd}subreceta.nombre AS sub
            FROM
                {$this->bd}subreceta_ingrediente
            LEFT JOIN {$this->bd}ingredientes ON idIngrediente = id_Ingrediente
            LEFT JOIN {$this->bd}subreceta ON idSubreceta = id_Subreceta
            LEFT JOIN {$this->bd}clasificacion ON idClasificacion = id_Clasificacion
            WHERE
                id_Ingrediente = ?
            AND {$this->bd}clasificacion.stado = 1
            ORDER BY
                {$this->bd}subreceta.nombre ASC";

        return $this->_Read($query, $array);
    }

    // Select ingredientes
    function getIngredientes()
    {
        $query = "SELECT
            idIngrediente AS id,
            contNeto AS neto,
            precio AS costo,
            ROUND(precio / contNeto, 2) AS precioUnidad,
            {$this->bd}ingredientes.nombre AS valor,
            {$this->bd}ingredientes.id_UDN AS idudn,
            {$this->bd}unidad.nombre AS unidad,
            {$this->bd}unidad.idUnidad AS idunidad,
            {$this->bd}proveedor.nombre AS proveedor,
            {$this->bd}proveedor.idProveedor AS idproveedor,
            {$this->bd}marca.nombre AS marca,
            {$this->bd}marca.idMarca AS idmarca,
            descripcion
        FROM
            {$this->bd}ingredientes
        LEFT JOIN {$this->bd}unidad ON id_Unidad = idUnidad
        LEFT JOIN {$this->bd}proveedor ON id_Proveedor = idProveedor
        LEFT JOIN {$this->bd}marca ON id_Marca = idMarca
        ORDER BY
            {$this->bd}ingredientes.nombre ASC";
        return $this->_Read($query, null);
    }

    // Obtener id de ingrediente
    function idIngrediente()
    {
        $query = "SELECT MAX(idIngrediente) AS id FROM {$this->bd}ingredientes";
        return $this->_Read($query, null);
    }

    // Crear ingrediente
    function createIngrediente($array)
    {
        $insert = $this->_Insert([
            'table' => "{$this->bd}ingredientes",
            'values' => $array['values'],
            'data' => $array['data']
        ]);

        return ($insert === true) ? $this->idIngrediente() : $insert;
    }

    // Actualizar ingrediente
    function updateIngrediente($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}ingredientes",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Eliminar ingrediente
    function deleteIngrediente($array)
    {
        return $this->_Delete([
            'table' => "{$this->bd}ingredientes",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }
}
