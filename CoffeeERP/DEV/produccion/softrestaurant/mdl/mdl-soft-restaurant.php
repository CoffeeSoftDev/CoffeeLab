<?php
require_once('../../../conf/_CRUD.php');

class __SoftRestaurant extends CRUD{
private $bd;
public function __construct() {
    $this->bd = 'rfwsmqex_gvsl_finanzas.';
}

    function get_folio($array) {
        $folio = 0;

        $query ="
        SELECT
            id_folio
        FROM
            rfwsmqex_gvsl_finanzas.soft_folio
            WHERE fecha_folio = ? and id_udn = ?
        ";

        $sql = $this->_Read($query, $array);


        foreach ($sql as $key) {
        $folio = $key['id_folio'];
        }

        return $folio;
    }

    function insert_folio($array){
        $query = "
            INSERT INTO
            {$this->bd}soft_folio
            (fecha_folio,id_udn)
            VALUES(?,?)
        ";

       return  $this->_CUD($query, $array);
    }


    function update_file_productos($array, $opc){
        $campo = '';
        switch ($opc) {
        case 'productosvendidosperiodo':
            $campo = 'file_productos_vendidos';
        break;
        case 'ventas':
            $campo = 'file_ventas_dia';
        break;
        }

        $query = "UPDATE rfwsmqex_gvsl_finanzas.soft_folio 
        SET " . $campo . " = ?
        WHERE id_folio = ? ";

        return  $this->_CUD($query, $array);
    }

    function update_monto_ventas_dia($array){

        return $this->_Update([
            'table' => "{$this->bd}soft_folio",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);


    }


    function existe_folio($array, $campo) {
        $folio = 0;

        $query =
        "
        SELECT
        id_folio
        FROM
        rfwsmqex_gvsl_finanzas.soft_folio
        WHERE " . $campo . " = 1 and id_folio = ?
        ";

        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
        $folio = 1;
        }

        return $folio;
    }

    function lsUDN() {
        $query = "SELECT idUDN AS id, UDN AS valor FROM udn WHERE Stado = 1 AND idUDN != 10 AND idUDN != 8  ORDER BY idUDN ASC";
        return $this->_Read($query, null);
    }

    function soft_grupoc_erp($array){
        $query = 'SELECT idgrupo as id,descripcion as name FROM rfwsmqex_gvsl_finanzas.soft_grupoc_erp WHERE id_udn = ? and status = 1';
        return $this->_Read($query, $array);

    }

    function soft_grupoproductos($array) {
        $query = 'SELECT * FROM rfwsmqex_gvsl_finanzas.soft_grupoproductos 
        WHERE id_udn = ? and id_grupo_erp = ? ';
        return $this->_Read($query, $array);
    }


    function soft_vendidos_por_grupo__($array) {
        $query = '
        SELECT
            soft_productos.descripcion, 
            soft_productosvendidos.cantidad, 
            soft_productosvendidos.precioventa,
            soft_productos.id_grupoc
        FROM
        rfwsmqex_gvsl_finanzas.soft_productos
        INNER JOIN
        rfwsmqex_gvsl_finanzas.soft_productosvendidos
        ON 
        soft_productos.id_Producto = soft_productosvendidos.id_productos
        WHERE  idFolioRestaurant = ? 
        and id_grupo_productos = ?
        -- and grupo = ?
        ';
        return $this->_Read($query, $array);
    }

    function get_soft_grupoc($array) {
        $idCat = 0;
        $SQL = "
            SELECT
                idgrupo
            FROM 
                rfwsmqex_gvsl_finanzas.soft_grupoc
            WHERE
            grupoc = ? and id_soft_udn = ?
        ";
        $ps = $this->_Read($SQL, $array);
        foreach ($ps as $key) {
            $idCat = $key['idgrupo'];
        }
        return $idCat;
    }

    function add_soft_grupoc($array){
        return $this->_Insert([
            'table' => "{$this->bd}soft_grupoc",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function get_soft_grupoproductos($array){
        $idCat = 0;
        $SQL = "
            SELECT
                idgrupo
            FROM 
                rfwsmqex_gvsl_finanzas.soft_grupoproductos
            WHERE
            grupoproductos = ? and id_udn = ?
        ";
        $ps = $this->_Read($SQL, $array);
        foreach ($ps as $key) {
            $idCat = $key['idgrupo'];
        }
        return $idCat;
    }

    function get_producto_name($array) {
        $folio = 0;

        $query =
        "
        SELECT
            id_Producto
        FROM
            rfwsmqex_gvsl_finanzas.soft_productos
        WHERE descripcion = ? and id_udn = ?

        ";

        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $folio = $key['id_Producto'];
        }

        return $folio;
    }

    function add_productosvendidos($array){
        return $this->_Insert([
            'table'  => "{$this->bd}soft_productosvendidos",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function crear_producto_soft($array) {
        $query = " INSERT INTO rfwsmqex_gvsl_finanzas.soft_productos
        (clave,descripcion,id_grupoc,id_udn,status,costo,
        revision,id_grupo_productos)
        VALUES(
        ?,?,?, 
        ?,?,?,?,? )";


       return $this->_CUD($query, $array);
    }

    function delete_data_row($array){

        $query = "
            DELETE 
            FROM
            rfwsmqex_gvsl_finanzas.soft_productosvendidos
            WHERE  idFolioRestaurant = ?
        ";

        return $this->_CUD($query, $array);
    }

    function reporte_ventas($array){
        $query =
        "
        SELECT
        id_venta,
        soft_area_restaurant.arearestaurant,
        porcentaje,
        alimentos,

        bebidas,
        otros,
        subtotal,

        iva,
        total,
        personas,

        cuentas,
        soft_folio

        FROM
        rfwsmqex_gvsl_finanzas.soft_ventas
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_area_restaurant ON soft_ventas.id_area = soft_area_restaurant.idarea
        WHERE soft_folio = ?
        ";

        return $this->_Read($query, $array);


    }

    function get_area($array){
        $idCat = 'No encontrado';

        $SQL = "
            SELECT
                idarea
            FROM 
                rfwsmqex_gvsl_finanzas.soft_area_restaurant
            WHERE
                arearestaurant = ? and id_udn = ?";


        $ps = $this->_Read($SQL, $array);

        foreach ($ps as $key) {
           $idCat = $key['idarea'];
        }

        return $idCat;
    }

    function add_row_ventas($array){


        return $this->_Insert([
            'table'  => "{$this->bd}soft_ventas",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function ls_ventas($array){

        $sql = 'SELECT
            soft_ventas.id_venta,
            soft_ventas.soft_folio,
            soft_ventas.id_area,
            soft_ventas.alimentos,
            soft_ventas.personas,
            soft_ventas.cuentas,
            soft_ventas.bebidas,
            soft_ventas.otros,
            soft_ventas.subtotal,
            soft_ventas.iva,
            soft_ventas.total
        FROM rfwsmqex_gvsl_finanzas.soft_ventas
        WHERE soft_folio = ?';

        return $this->_Read($sql, $array);
    }

    function get_paq_name($array){
        $idPaquete = 0;

        $query =
        "
        SELECT
        idpaquete
        FROM
        rfwsmqex_gvsl_finanzas.soft_paquetes
        WHERE descripcion = ? and id_udn = ?

        ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $idPaquete = $key['idpaquete'];
        }

        return $idPaquete;
    }

    function add_productos_paq($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}soft_productosvendidos",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }


    function delete_data_row_ventas($array){

        $query = "
        DELETE 
        FROM
        rfwsmqex_gvsl_finanzas.soft_ventas
        WHERE  soft_folio = ?
        ";

       return $this->_CUD($query, $array);
    }

    function reporte_paquetes_vendidos($array){
        $query =
        "
        SELECT
            idpaquete as id,
            soft_paquetes.descripcion,
            soft_productosvendidos.clave,
            soft_productosvendidos.cantidad,
            soft_productosvendidos.precioventa,
            soft_productosvendidos.ventatotal,
            idpaquete
        FROM
        rfwsmqex_gvsl_finanzas.soft_productosvendidos
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_paquetes ON 
        soft_productosvendidos.id_paquete = soft_paquetes.idpaquete
        WHERE idFolioRestaurant = ? and grupo = ? order by descripcion asc
        ";

        return $this->_Read($query, $array);
    }

    function desgloze_paquete2($array){
       $query =
        "
        SELECT
        soft_paquetes.descripcion as desc_paq,
        soft_productos.descripcion,
        soft_paquetes_productos.costo_producto,
        soft_grupoc_erp.descripcion as desc_grupo
        
        FROM
        rfwsmqex_gvsl_finanzas.soft_productos
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_grupoc_erp ON soft_productos.id_grupoc = soft_grupoc_erp.idgrupo
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_paquetes_productos ON soft_paquetes_productos.id_producto = soft_productos.id_Producto
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_paquetes ON soft_paquetes_productos.id_paquete = soft_paquetes.idpaquete
        WHERE id_paquete = ?
        ";

        return $this->_Read($query, $array);

    }





}