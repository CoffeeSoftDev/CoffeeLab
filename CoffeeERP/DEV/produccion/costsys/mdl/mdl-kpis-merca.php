
<?php
require_once('../../../conf/_CRUD.php');

class Kpismerca extends CRUD{
        
    function lsUDN(){
        return $this->_Select([
            'table'  => 'udn',
            'values' => 'idUDN AS id, UDN AS valor',
            'where'  => 'Stado = 1',
            'order'  => ['ASC'=>'Antiguedad']
        ]);
    }

    function lsIngresosAyB($array){

        $query = "

            SELECT

            SUM(soft_productosvendidos.ventatotal) as ventaTotal

            FROM
            rfwsmqex_gvsl_finanzas.soft_productos
            INNER JOIN rfwsmqex_gvsl_finanzas.soft_productosvendidos ON soft_productosvendidos.id_productos = soft_productos.id_Producto
            INNER JOIN rfwsmqex_gvsl_finanzas.soft_grupoc_erp ON soft_productos.id_grupoc = soft_grupoc_erp.idgrupo
            INNER JOIN rfwsmqex_gvsl_finanzas.soft_folio ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
            WHERE soft_productos.id_udn = 1
            AND MONTH(fecha_folio) = ? AND YEAR(fecha_folio) = 2024 AND idgrupo <> 11


        ";

        return $this->_Read($query, $array);

    }

    function lsIngresosHospedaje($array)
    {

        $query = "
        SELECT
            SUM(soft_productosvendidos.ventatotal) AS ventaTotal
        FROM
        rfwsmqex_gvsl_finanzas.soft_productos
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_productosvendidos ON soft_productosvendidos.id_productos = soft_productos.id_Producto
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_folio ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_grupoc ON soft_productosvendidos.grupo = soft_grupoc.idgrupo
        WHERE
        soft_productos.id_udn = 1 AND
        MONTH(fecha_folio) = ? AND
        YEAR(fecha_folio) = 2024 
        AND soft_grupoc.grupo = 27


        ";

        return $this->_Read($query, $array);

    }

    function lsIngresosGRAL($array)
    {

        $query = "

        SELECT
        SUM(soft_productosvendidos.ventatotal) AS ventaTotal
        FROM
        rfwsmqex_gvsl_finanzas.soft_productos
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_productosvendidos ON soft_productosvendidos.id_productos = soft_productos.id_Producto
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_folio ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_grupoc ON soft_productosvendidos.grupo = soft_grupoc.idgrupo
        WHERE
        soft_productos.id_udn = 1 AND
        MONTH(fecha_folio) = ? AND
        YEAR(fecha_folio) = 2024 
       


        ";

        return $this->_Read($query, $array);

    }

}
?>