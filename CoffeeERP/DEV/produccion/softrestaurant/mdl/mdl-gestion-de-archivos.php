<?php
require_once('../../../conf/_CRUD.php');

class GestionArchivos extends CRUD
{
    function udn_select()
    {
        $query = "SELECT idUDN AS id, UDN AS valor FROM udn WHERE Stado = 1 
        AND idUDN != 10 AND idUDN != 8  ORDER BY idUDN ASC";
        return $this->_Read($query, null);

    }

    function ls_area_soft($array)
    {
        $query = "SELECT idarea as id,arearestaurant FROM rfwsmqex_gvsl_finanzas.soft_area_restaurant WHERE id_udn = ? ";
        return $this->_Read($query, $array);
    }
      
    function existe_folio($array){
        $folio            = 0;
        $contador_ticket  = 0;

        $query  =
        "
        SELECT
            id_folio,
            file_productos_vendidos,
            file_ventas_dia,
            monto_productos_vendidos,
            monto_ventas_dia

        FROM
            rfwsmqex_gvsl_finanzas.soft_folio
        WHERE 
            date_format(fecha_folio,'%Y-%m-%d') = ?
         AND id_udn = ?
        ";

        $sql	=	$this->_Read($query, $array);
        // foreach ($sql as $key ) {
        //  $folio            = 1;
        // }
     

        return	$sql;
    }
    
    function get_cantidad($array) {
    $cantidad = 0;

    $query = "
    SELECT
    DATE_FORMAT(fecha_folio,'%Y-%m-%d'),
    id_folio,
    SUM(cantidad) as scant,
    soft_productosvendidos.idvendidos
    FROM
    rfwsmqex_gvsl_finanzas.soft_folio
    INNER JOIN rfwsmqex_gvsl_finanzas.soft_productosvendidos ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
    WHERE
    DATE_FORMAT(fecha_folio,'%Y-%m-%d')  BETWEEN ? AND ? 
    AND id_productos   = ?
    ";

    $sql = $this->_Read($query, $array);

    
    foreach ($sql as $key ) {
    $cantidad =   $key['scant'];
    }

    return $cantidad;
    }


   
    function get_nuevo_fogaza($array) {
        $list_productos = '';

        $query          = "
        SELECT
            almacen_productos.idAlmacen,
            almacen_productos.Area,
            almacen_productos.NombreProducto,
            almacen_productos.NotFoundReceta,
            almacen_productos.FechaIngreso,
            almacen_productos.homologado
        FROM
           rfwsmqex_gvsl_produccion.almacen_productos
        WHERE 
        DATE_FORMAT(FechaIngreso,'%Y-%m-%d') = ? ";
        
        $sql    = $this-> _Read($query,$array);

        foreach ($sql as $key) {

          $list_productos  .= '<p class="m-0 p-0">'.$key['NombreProducto'].'</p>';
        
        }

        return $list_productos;
    }


    


}
?>