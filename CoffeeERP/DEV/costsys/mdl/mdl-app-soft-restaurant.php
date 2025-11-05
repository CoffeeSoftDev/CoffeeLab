<?php
require_once('../../conf/_CRUD.php');

class main extends CRUD{
    public $bd;
    public $bd2;
    public $_;
    
    public function __construct(){
        $this->bd = 'rfwsmqex_gvsl_finanzas.';
        $this->bd2 = 'rfwsmqex_gvsl_finanzas.';
        $this-> _ = $this -> bd.'costopotencial2';

    }
}

class SoftRestaurant extends main {

    function connected(){
        return $this-> bd;
    }


    function get_folio($array) {
        $folio = 0;

        $query ="
        SELECT
            id_folio
        FROM
            {$this->bd}soft_folio
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
            INSERT INTO  {$this->bd}soft_folio
            (fecha_folio,id_udn) VALUES(?,?)
        ";

       return  $this->_CUD($query, $array);
    }

    function soft_grupoc_erp($array){
        $query = 'SELECT idgrupo as id,descripcion as name FROM 
        rfwsmqex_gvsl_finanzas.soft_grupoc_erp 
        
        WHERE id_udn = ? and status = 1';
        return $this->_Read($query, $array);

    }

    function soft_grupoproductos($array) {
        $query = "SELECT * FROM {$this->bd}soft_grupoproductos 
        WHERE id_udn = ? and id_grupo_erp = ? ORDER BY grupoproductos asc";
        return $this->_Read($query, $array);
    }

    function soft_vendidos_por_grupo__($array) {
        $query = "
        SELECT
            soft_productos.descripcion, 
            soft_productosvendidos.cantidad, 
            soft_productosvendidos.precioventa,
            soft_productos.id_grupoc,
             soft_productosvendidos.ventatotal,
            id_Producto
        FROM
        {$this->bd}soft_productos
        INNER JOIN
        {$this->bd}soft_productosvendidos
        ON 
        soft_productos.id_Producto = soft_productosvendidos.id_productos
        WHERE  idFolioRestaurant = ? 
        and id_grupo_productos = ?  ";

        return $this->_Read($query, $array);
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
        {$this->bd}soft_productosvendidos
        INNER JOIN {$this->bd}soft_paquetes ON 
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


    // Actualizar la tabla de folio con las ventas neto.

    function update_monto_ventas_dia($array){

        return $this->_Update([
            'table' => "{$this->bd}soft_folio",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }



    // file excel

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

        $query = "UPDATE {$this->bd}soft_folio 
        SET " . $campo . " = ?
        WHERE id_folio = ? ";

        return  $this->_CUD($query, $array);
    }

     function existe_folio($array, $campo) {
        $folio = 0;

        $query =
        "
        SELECT
        id_folio
        FROM
        {$this->bd}soft_folio
        WHERE " . $campo . " = 1 and id_folio = ?
        ";

        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
        $folio = 1;
        }

        return $folio;
    }

    function delete_data_row($array){

        $query = "
            DELETE 
            FROM
            {$this->bd}soft_productosvendidos
            WHERE  idFolioRestaurant = ?
        ";

        return $this->_CUD($query, $array);
    }

    function get_soft_grupoc($array) {
        $idCat = 0;
        
        $SQL = "
            SELECT
                idgrupo
            FROM 
                {$this->bd}soft_grupoc
            WHERE
            grupoc = ? and id_soft_udn = ? ";

        $ps = $this->_Read($SQL, $array);

        foreach ($ps as $key) {
            $idCat = $key['idgrupo'];
        }
        
        return $idCat;
    }

    function get_soft_grupoproductos($array){
          $idCat = 0;

        $SQL = "
            SELECT
                idgrupo,
                id_grupo_erp
              
            FROM 
                {$this->bd}soft_grupoproductos
            WHERE
            grupoproductos = ? and id_udn = ? ";

        return $this->_Read($SQL, $array);
       
        // foreach ($ps as $key) {
        //     $idCat = $key['idgrupo'];
        // }
        
        // return $idCat;
    }

    function getGrupoERP($array){

        $SQL = "
            SELECT
                idgrupo as id,
                descripcion as name
            FROM 
                {$this->bd}soft_grupoc_erp
            WHERE
            id_udn = ? and status = 1";

        return $this->_Read($SQL, $array);
     

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

    function get_producto_name($array) {

        $query ="
        SELECT
            id_Producto,
            id_grupo_productos
        FROM
            {$this->bd}soft_productos
        WHERE descripcion = ? and id_udn = ?
        and activo_soft = 1
        ";

         return $this->_Read($query, $array);
    }

    function get_producto_by_name_group($array) {

        $query ="
        SELECT
            id_Producto,
            id_grupo_productos
        FROM
            {$this->bd}soft_productos
        WHERE descripcion = ? and id_udn = ?
        and id_grupo_productos = ? and activo_soft = 1
        ";

         return $this->_Read($query, $array);
    }

    function add_productosvendidos($array){
        return $this->_Insert([
            'table'  => "{$this->bd}soft_productosvendidos",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function add_productos_paq($array){

        return $this->_Insert([
            'table' => "{$this->bd}soft_productosvendidos",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function add_soft_grupoc($array){
        return $this->_Insert([
            'table' => "{$this->bd}soft_grupoc",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function add_soft_grupoproctos($array){
        return $this->_Insert([
            'table' => "{$this->bd}soft_grupoproductos",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }



    function crear_producto_soft($array) {


        return $this->_Insert([
            'table'  => "{$this->bd}soft_productos",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);

  
    }

    // ventas.
    function ls_ventas($array){

        $sql = "SELECT
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
        FROM {$this->bd}soft_ventas
        WHERE soft_folio = ?";

        return $this->_Read($sql, $array);
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
        {$this->bd}soft_ventas
        INNER JOIN {$this->bd}soft_area_restaurant ON soft_ventas.id_area = soft_area_restaurant.idarea
        WHERE soft_folio = ?
        ";

        return $this->_Read($query, $array);


    }


    function delete_data_row_ventas($array){

        $query = "
        DELETE 
            FROM
            {$this->bd}soft_ventas
        WHERE  soft_folio = ?
        ";

       return $this->_CUD($query, $array);
    }

    function get_area($array){
        $idCat = 'No encontrado';

        $SQL = "
            SELECT
                idarea
            FROM 
                {$this->bd}soft_area_restaurant
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


    function getFolio($array){
        $folio = 0;
        $contador_ticket = 0;

        $query = "
            SELECT
                id_folio,
                file_productos_vendidos,
                file_ventas_dia,
                monto_productos_vendidos,
                monto_ventas_dia
            FROM
                {$this->bd}soft_folio
            WHERE
                date_format(fecha_folio,'%Y-%m-%d') = ?
                AND id_udn = ?
        ";

        $sql = $this->_Read($query, $array);
    

        return $sql;
    }

    function getGroups($array){

        $query = "
                SELECT * FROM {$this->bd2}soft_grupoc_erp WHERE id_udn = ?
            ";

        return $this->_Read($query, $array);
    }

    function getTotalGroup($array){

        $query = "
            SELECT
                soft_folio.id_folio,
                soft_folio.fecha_folio,
                soft_productos.descripcion,
                soft_productosvendidos.cantidad,
                soft_productosvendidos.precioventa,
                soft_productos.id_grupo_productos,
            
                soft_grupoc.grupo_erp
            FROM
                {$this->bd}soft_folio
            INNER JOIN {$this->bd}soft_productosvendidos ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
            INNER JOIN {$this->bd}soft_productos ON soft_productosvendidos.id_productos = soft_productos.id_Producto
            WHERE fecha_folio = ? and grupo_erp = ?
            
            ";

        return $this->_Read($query, $array);

    }

    function getCreatedFolio($array){

        $query = "
                SELECT * FROM {$this->bd2}soft_restaurant_ventas
                WHERE soft_folio = ? ";

        return $this->_Read($query, $array);
    }

    function add_Ventas($array){

        return $this->_Insert([
            'table' => "{$this->bd2}soft_restaurant_ventas",
            'values' => $array['values'],
            'data' => $array['data'],
        ]);
    }

    function actualizarVentas($array){

        return $this->_Update([
            'table' => "{$this->bd2}soft_restaurant_ventas",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data'],
        ]);
    }

    function getsoft_ventas($array){

        $query = "
            SELECT
                soft_folio.id_folio,
                soft_folio.fecha_folio,
                soft_folio.id_udn,
                alimentos,
                bebidas,
                (alimentos + bebidas) as totalAyB,


                id_venta,
                noHabitaciones,
                Hospedaje,
                AyB,
                Diversos,
                soft_restaurant_ventas.RupturaHabitaciones,
                soft_restaurant_ventas.costoDiversos,

                CASE 
                    WHEN noHabitaciones != 0 THEN AyB / noHabitaciones 
                    ELSE 0 
                END AS promedio_total_ayb,

                CASE 
                    WHEN noHabitaciones != 0 THEN noHabitaciones / 12 
                    ELSE 0 
                END AS porcOcupacion,
                
                CASE 
                    WHEN noHabitaciones != 0 THEN alimentos / noHabitaciones 
                    ELSE 0 
                END AS promedio_alimentos,

                CASE 
                    WHEN noHabitaciones != 0 THEN bebidas / noHabitaciones 
                    ELSE 0 
                END AS promedio_bebidas

            FROM
            {$this->bd2}soft_folio
            INNER JOIN {$this->bd2}soft_restaurant_ventas ON soft_restaurant_ventas.soft_folio = soft_folio.id_folio
            WHERE id_udn = ? 
            AND DATE_FORMAT(fecha_folio,'%Y-%m-%d') = ?

            ";

        $sql = $this->_Read($query, $array);

        return $sql[0];
    }


    function set_soft_restaurant_ventas($array) {

        return $this->_Update([
            'table' => "{$this->bd}soft_restaurant_ventas",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
   }








    // Notifications.

    function sendNotification($array){


        return $this->_Insert([
            'table'  => "rfwsmqex_erp.notifications",
            'values' => $array['values'],
            'data'   => $array['data']
        ] );
  
    }




} 

class KPI extends main{

    function getGroups($array){
        
        $query = "
            SELECT * FROM {$this->bd}soft_grupoc_erp WHERE id_udn = ?
        ";

        return $this->_Read($query, $array);
    }

    function getTotalGroup($array){

        $query = "
        SELECT
            soft_folio.id_folio,
            soft_folio.fecha_folio,
            soft_productos.descripcion,
            soft_productosvendidos.cantidad,
            soft_productosvendidos.precioventa,
            soft_productos.id_grupo_productos,
            SUM(cantidad * precioventa ) AS total,
            soft_grupoc.grupo_erp,
            soft_grupoc.grupoc
        FROM
            {$this->bd}soft_folio
        INNER JOIN {$this->bd}soft_productosvendidos ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
        INNER JOIN {$this->bd}soft_productos ON soft_productosvendidos.id_productos = soft_productos.id_Producto
        INNER JOIN {$this->bd}soft_grupoc ON soft_productosvendidos.grupo = soft_grupoc.idgrupo
        WHERE fecha_folio = ? and grupo_erp = ?
        ";

        return $this->_Read($query, $array);

    }

    function getFolio($array){

        $query = "
            SELECT * FROM {$this->bd}soft_restaurant_ventas 
            WHERE soft_folio = ? ";

        return $this->_Read($query,$array);
    }

    function addVentas($array){

        return $this->_Insert([
            'table'  => "{$this->bd}soft_restaurant_ventas",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function actualizarVentas($array) {

        return $this->_Update([
            'table' => "{$this->bd}soft_restaurant_ventas",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
   }

    
}

