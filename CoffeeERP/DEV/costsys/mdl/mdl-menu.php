<?php
require_once ('../../conf/_CRUD.php');
require_once('../mdl/mdl-costo-potencial.php');

class Menu extends Costsys{
    public $bd;

    public function __construct(){
         parent::__construct();
        $this->bd = 'rfwsmqex_gvsl_costsys.';
    }

    function lsCostoPotencialReceta($arreglo){

        $query = "
        SELECT
            recetas.idReceta,
            recetas.nombre,
            recetas.precioVenta,
            recetas.rendimiento,
            precio_propuesto,
            desplazamiento,
            costopotencial.iva,
            costopotencial.costo,
            recetas.ieps,
            costopotencial.idcostopotencial,
            recetas.id_Clasificacion,
            recetas.id_Subclasificacion
        FROM
        {$this->bd}costopotencial,
        {$this->bd}recetas
        WHERE
        receta = idReceta
        AND MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND costopotencial.id_Clasificacion = ?

        AND id_Subclasificacion IS NULL ORDER BY nombre asc
        ";



        return $this->_Read($query, $arreglo);


    }

     function lsCostoPotencialSubClasificacion($arreglo){

        $query = "
        SELECT
            recetas.idReceta,
            recetas.nombre,
            recetas.precioVenta,
            recetas.rendimiento,
            precio_propuesto,
            desplazamiento,
            costo,
            costopotencial.iva,
            recetas.ieps,
            costopotencial.idcostopotencial as idcostopotencial,
            recetas.id_Clasificacion,
            recetas.id_Subclasificacion

        FROM
            {$this->bd2}costopotencial,
            {$this->bd2}recetas
        
        WHERE
            
            receta                                   = idReceta
            AND MONTH (fecha_costo)                  = ?
            AND YEAR (fecha_costo)                   = ?
            -- AND costopotencial.id_Clasificacion   = ?
            AND id_Subclasificacion                  = ?

            ORDER BY nombre ASC
        ";

        return $this->_Read($query, $arreglo);

    }

    function listSubclasificacion($array){
        $query = "
        SELECT idSubClasificacion as id, nombre FROM {$this->bd}subclasificacion 
        WHERE id_Clasificacion = ? 
        AND (subclasificacion.nombre != 'DESCONTINUADO' 
        AND subclasificacion.nombre != 'PRODUCTOS CON EMPAQUE') 
        ORDER BY nombre ASC";


        $sql = $this->_Read($query, $array);
        return $sql;
    }


    function listMenu($array){
        $query = "SELECT
        costsys_menu.idmenu as id,
        costsys_menu.categoria as nombre,
        status,
        costsys_menu.id_udn,
        costsys_menu.id_clasificacion,
        clasificacion.Clasificacion
        FROM
        {$this->bd}costsys_menu
        INNER JOIN {$this->bd}clasificacion ON costsys_menu.id_clasificacion = clasificacion.idClasificacion
        WHERE costsys_menu.id_udn = 4 and id_clasificacion = ?
        order by orderMenu DESC
        ";


        $sql = $this->_Read($query, $array);
        return $sql;
    }

    function listDishes($array){
        $query = "SELECT
            recetas.idReceta,
            recetas.nombre,
            recetas.precioVenta,
            recetas.rendimiento,
            precio_propuesto,
            desplazamiento,
            costo,
            costopotencial.iva,
            recetas.ieps,
            costopotencial.idcostopotencial AS idcostopotencial,
            recetas.id_Clasificacion,
            recetas.id_Subclasificacion,
            id_menu,
            dishes.idDishes
        FROM
            {$this->bd}costopotencial,
            {$this->bd}recetas,
            {$this->bd}dishes
        WHERE
            receta = idReceta 
        AND idReceta = dishes.id_receta
        AND MONTH (fecha_costo)                  = ?
        AND YEAR (fecha_costo)                   = ?
        AND id_menu = ?
        ";


        $sql = $this->_Read($query, $array);
        return $sql;
    }

    // Analitycs

    function getLastProduct($array){
        $query = "SELECT
            costopotencial.fecha_costo,
            costopotencial.receta,
            costopotencial.desplazamiento
            FROM
            {$this->bd}costopotencial
            WHERE receta = ? and desplazamiento <> 0
            ORDER BY fecha_costo DESC
            LIMIT 1
        ";


        return $this->_Read($query, $array)[0];
    }






}    