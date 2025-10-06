<?php
require_once ('../../../conf/_CRUD.php');

class Catalogo extends CRUD
{
    private $bd;
    public function __construct()
    {
        $this->bd = 'rfwsmqex_gvsl_costsys2.';
        // $this->bd = 'costsys_';
    }

    // Lista de UDN
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
        GROUP BY idUDN";
        return $this->_Read($query, null);
    }

    // Lista de clasificaciones
    function lsClasificacion()
    {
        $query = "SELECT
            idClasificacion AS id,
            Clasificacion AS valor,
            id_UDN AS udn
        FROM
            costsys_clasificacion
        WHERE
            stado = 1";
        return $this->_Read($query, null);
    }

    // PROVEEDORES ------------------------------------------------------------------
    // Lista de proveedores
    function lsProveedor()
    {
        $query = "SELECT
            idProveedor AS id,
            nombre AS valor
        FROM
            {$this->bd}proveedor
        WHERE
            nombre NOT REGEXP '^[0-9.]+$'
        AND nombre != ''
        ORDER BY
            nombre ASC";
        return $this->_Read($query, null);
    }
    // Obtener id de proveedor
    function idProveedor($array)
    {
        $values = "idProveedor AS id, nombre AS valor";
        return $this->_Select([
            'table' => "{$this->bd}proveedor",
            'values' => $values,
            'where' => $array['values'],
            'data' => $array['data']
        ])[0];
    }

    // Crear proveedor
    function createProveedor($array)
    {
        $insert = $this->_Insert([
            'table' => "{$this->bd}proveedor",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
        return ($insert === true) ? $this->idProveedor($array) : $insert;
    }

    // MARCAS -----------------------------------------------------------------------
    // Lista de marcas
    function lsMarca()
    {
        $query = "SELECT
            idMarca AS id,
            nombre AS valor
        FROM
            {$this->bd}marca
        WHERE
            nombre NOT REGEXP '^[0-9.]+$'
        AND nombre != ''
        ORDER BY
            nombre ASC";
        return $this->_Read($query, null);
    }
    // Crear marca
    function createMarca($array)
    {
        $query = "INSERT INTO {$this->bd}marca (
            nombre
        )
        VALUES (?)";
        $this->_CUD($query, $array);

        return $this->_Read("SELECT idMarca AS id, nombre AS valor FROM {$this->bd}marca ORDER BY idMarca DESC LIMIT 1", null);
    }

    // UNIDADES ---------------------------------------------------------------------
    // Lista de unidades
    function lsUnidad()
    {
        $query = "SELECT
            idUnidad AS id,
            nombre AS valor
        FROM
            {$this->bd}unidad
        WHERE
            nombre NOT REGEXP '^[0-9.]+$'
        AND nombre != ''
        ORDER BY
            nombre ASC";
        return $this->_Read($query, null);
    }
    // Crear unidad
    function createUnidad($array)
    {
        $query = "INSERT INTO {$this->bd}unidad (
                nombre
            )
            VALUES (?)";
        $this->_CUD($query, $array);

        return $this->_Read("SELECT idUnidad AS id, nombre AS valor FROM {$this->bd}unidad ORDER BY idUnidad DESC LIMIT 1", null);
    }

}
?>