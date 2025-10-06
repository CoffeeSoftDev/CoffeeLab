<?php
require_once ('../../../conf/_CRUD.php');


class Ingredientes extends CRUD
{
    private $bd;
    public function __construct()
    {
        $this->bd = 'rfwsmqex_gvsl_costsys2.';
        // $this->bd = 'costsys_';
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

    // Crear ingrediente
    function createIngrediente($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}ingredientes",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
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


}
?>