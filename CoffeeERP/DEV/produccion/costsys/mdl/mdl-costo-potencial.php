<?php
require_once('../../../conf/_CRUD.php');

class TableroControl extends CRUD{
    private $bd;

    public function __construct(){
        $this->bd = 'rfwsmqex_gvsl_costsys.';
    }

    function selectTablero($array){
        $query = "
        SELECT * FROM 
        {$this->bd}tablerocontrol 
        WHERE 
        id_UDN = ? AND 
        id_Clasificacion = ? AND 
        MONTH(fechaMovimiento) = ? AND 
        YEAR(fechaMovimiento) = ?";

        $sql = $this->_Read($query, $array);

        $row = null;
        foreach ($sql as $row);
        return $row;
    }

    function countRecetas($idE, $idClasificacion){
        $array = array($idE, $idClasificacion);
        $query = "SELECT COUNT(*) as total FROM {$this->bd}recetas WHERE id_UDN = ? AND id_Clasificacion = ?";
        $sql = $this->_Read($query, $array);

        $row = null;
        foreach ($sql as $row);
        if (!isset($row)) {
            $row['total'] = 0;
        }
        return $row['total'];
    }

    function countMCAlto($arreglo, $mcAlto){
        $array1 = array($mcAlto);
        $array = array_merge($arreglo, $array1);
        $query = "SELECT COUNT(*) as total FROM 
                        {$this->bd}costopotencial 
                    WHERE 
                        idE = ? AND 
                        id_Clasificacion = ? AND 
                        MONTH(fecha_costo) = ? AND 
                        YEAR(fecha_costo) = ? AND 
                        margencontribucion >= ?";
        $sql = $this->_Read($query, $array);

        $row = null;
        foreach ($sql as $row)
            ;
        if (!isset($row)) {
            $row['total'] = 0;
        }
        return $row['total'];
    }

    function sumaMC($array){
        $query = "SELECT 
                            SUM(margencontribucion) as total
                        FROM 
                            {$this->bd}costopotencial 
                        WHERE 
                            idE = 4 AND 
                            id_Clasificacion = 13 AND 
                            MONTH(fecha_costo) = 2 AND 
                            YEAR(fecha_costo) = 2022";
        $sql = $this->_Read($query, $array, "8");

        $row = null;
        foreach ($sql as $row);
        if (!isset($row)) {
            $row['total'] = 0;
        }
        return $row['total'];
    }

    function countMCBajo($arreglo, $mcBajo){
        $array1 = array($mcBajo);
        $array = array_merge($arreglo, $array1);
        $query = "SELECT COUNT(*) as total FROM 
                        {$this->bd}costopotencial 
                    WHERE 
                        idE = ? AND 
                        id_Clasificacion = ? AND 
                        MONTH(fecha_costo) = ? AND 
                        YEAR(fecha_costo) = ? AND 
                        margencontribucion < ? ";
        $sql = $this->_Read($query, $array);

        $row = null;
        foreach ($sql as $row)
            ;
        if (!isset($row)) {
            $row['total'] = 0;
        }
        return $row['total'];
    }

    function countPorcentajeCostoAlto($arreglo, $CostoAlto){
        $array1 = array($CostoAlto);
        $array = array_merge($arreglo, $array1);
        $query = "SELECT COUNT(*) as total FROM 
                        {$this->bd}costopotencial 
                    WHERE 
                        idE = ? AND 
                        id_Clasificacion = ? AND 
                        MONTH(fecha_costo) = ? AND 
                        YEAR(fecha_costo) = ? AND 
                        costo_porc >= ?";
        $sql = $this->_Read($query, $array);

        $row = null;
        foreach ($sql as $row)
            ;
        if (!isset($row)) {
            $row['total'] = 0;
        }
        return $row['total'];
    }

    function countPorcentajeCostoBajo($arreglo, $CostoBajo){
        $array1 = array($CostoBajo);
        $array  = array_merge($arreglo, $array1);

        $query = "SELECT COUNT(*) as total FROM 
                        {$this->bd}costopotencial 
                    WHERE 
                        idE = ? AND 
                        id_Clasificacion = ? AND 
                        MONTH(fecha_costo) = ? AND 
                        YEAR(fecha_costo) = ? AND 
                        costo_porc < ? ";
        $sql = $this->_Read($query, $array);

        $row = null;

        foreach ($sql as $row);
        
        if (!isset($row)) {
            $row['total'] = 0;
        }
        
        return $row['total'];
    }

    function countProductosProducidos($array){
        $query = "
            SELECT 
                COUNT(*) as contar
            FROM 
                {$this->bd}costopotencial 
            WHERE 
            idE = ? AND 
            id_Clasificacion = ? AND
            MONTH(fecha_costo) = ? AND 
            YEAR(fecha_costo) = ? AND
            desplazamiento IS NOT NULL AND 
            desplazamiento != 0 ";
        $sql = $this->_Read($query, $array);

        $row = null;

        foreach ($sql as $row);
        
        if (!isset($row)) {
            $row['contar'] = 0;
        }
        return $row['contar'];
    }


}

class cuadroComp extends CRUD {
    private $bd;

    public function __construct(){
        $this->bd = 'rfwsmqex_gvsl_costsys.';
    }

    function selectCategorias($idE)
    {
        $query = "
        SELECT
                * 
            FROM
                {$this->bd}clasificacion 
            WHERE
                id_UDN = $idE 
                AND stado = 1 
            ORDER BY
                Clasificacion ASC";
        $sql = $this->_Read($query, null);
        return $sql;
    }

    function selectTableroControl($idClase, $mensualidad) {
        $row = null;
        $query = "SELECT
                            * 
                        FROM
                            {$this->bd}tablerocontrol 
                        WHERE
                            id_Clasificacion = $idClase 
                            AND fechaMovimiento 
                            
                            BETWEEN DATE_SUB( NOW()- 2, INTERVAL $mensualidad MONTH ) 
                            
                            AND NOW() 
                            AND costoPotencialReal IS NOT NULL 
                            AND costoPotencialReal != 0
                        
                        ORDER BY
                            fechaMovimiento ASC";
        $sql = $this->_Read($query, null);
        foreach ($sql as $row) ;
        return $sql;
    }
    
    

    
}

// Tablero costo potencial
class Costsys extends CRUD {
    private $bd2;

    public function __construct(){
        $this->bd2 = 'rfwsmqex_gvsl_costsys.';

    }

    function selectSumatoriasEstimadas($array) {
        $query = "
        SELECT
            SUM(ventasestimadas) AS ventasestimada,
            SUM(costoestimado) AS costoestimado,
            SUM(mc_estimado) AS mc_estimado,
            SUM(ventasestimadas_propuesto) AS ventasestimadas_propuesto,
            SUM(costoestimado_propuesto) AS costoestimado_propuesto,
            SUM(mcestimado_propuesto) AS mcestimado_propuesto,
            SUM(desplazamiento) AS desplazamiento,
            COUNT(idcostopotencial) AS produccion
        FROM
        {$this->bd2}costopotencial 
        WHERE
        desplazamiento != 0 
        AND id_Clasificacion = ?
        AND YEAR (fecha_costo) = ? 
        AND MONTH (fecha_costo) = ? ";
        
        $sql = $this->_Read($query, $array);
        $row = null;
        foreach ($sql as $row);
        return $row;
    }

    function selectTablero($idClasificacion, $mes, $year){
        $array = array($idClasificacion, $mes, $year);
        
        $query = "
        
        SELECT * FROM {$this->bd2}tablerocontrol 
            WHERE id_Clasificacion = ? 
        AND MONTH(fechaMovimiento) = ? 
        AND YEAR(fechaMovimiento) = ?";

        $sql = $this->_Read($query, $array);
        $row = null;
        foreach ($sql as $row) ;
        return $row;
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

            ORDER BY recetas.nombre ASC


        ";

        $sql = $this->_Read($query, $arreglo);

        return $sql;
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
        {$this->bd2}costopotencial,
        {$this->bd2}recetas
        WHERE
        receta = idReceta
        AND MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND costopotencial.id_Clasificacion = ?

        AND id_Subclasificacion IS NULL ORDER BY nombre ASC
        ";



        return $this->_Read($query, $arreglo);
        

    }

     function aplicarCalculo($data,$calculo){

        $permiso = 1;

        $impuestos = $data['iva'] + $data['ieps'];
        $pVentaIVA = $data['pVenta'] / (1 + ($impuestos / 100));
        $receta    = $calculo->totalReceta($data['idReceta']);
        $total     = $receta['totalReceta'];
        $costo     = $total / $data['rendimiento'];
        
        //    -- Calculo de costo potencial -- 
        
        $porcentajeCosto = ($costo / $pVentaIVA) * 100;
        $mc              = $pVentaIVA - $costo;
        $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
        $costoEstimado   = $costo * $data['desplazamiento'];
        $mcEstimado      = $mc * $data['desplazamiento'];
       


        if($data['precioPropuesto']):

            $pVentaIVA       = $data['precioPropuesto'] / (1 + ($impuestos / 100));
            $mc              = $pVentaIVA - $costo;
            $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
            $mcEstimado      = $mc * $data['desplazamiento'];
        
        endif;    


    
        // -- Calculo propuesto  --
        $yearAnterior = $_POST['Anio'];
        $mesAnterior  = $_POST['Mes'];
        
        if ($_POST['Mes'] == 1) {
            $mesAnterior = 12;
            $yearAnterior = $_POST['Anio'] - 1;
        }

    
        // -- aplicar filtros modificables --

        $desplazamientoPromedio = 0;
        $costoAlto              = 0;
        $costoBajo              = 0;
        $mcAlto                 = 0;
        $mcBajo                 = 0;


        
        return [
            'pVenta'          => $data['pVenta'],
            'pVentaIVA'       => $pVentaIVA,
            'costo'           => $costo,
            'mc'              => $pVentaIVA - $costo,
            'porcentajeCosto' => $porcentajeCosto,
            'impuestos'       => $impuestos,
            'ventasEstimadas' => $ventasEstimadas,
            'costoEstimado'   => $costoEstimado,
            'mcEstimado'      => $mcEstimado,
            'desplazamiento'  => $desplazamientoPromedio,
             'total'          => $total,
            // 'precioPropuesto' => $cpAnterior['precio_propuesto'],
            // 'ls'              => $ls,
        ];
    }

    function listSubclasificacion($array){
        $query = "
        SELECT idSubClasificacion as id, nombre FROM {$this->bd2}subclasificacion 
        WHERE id_Clasificacion = ? 
        AND (subclasificacion.nombre != 'DESCONTINUADO' 
        AND subclasificacion.nombre != 'PRODUCTOS CON EMPAQUE') 
        ORDER BY nombre ASC";
        
        
        $sql = $this->_Read($query, $array);
        return $sql;
    }

    function listSubclasificacionNull($array){
       
        // $query = "SELECT * FROM {$this->bd}recetas WHERE id_Clasificacion = ? 
        // AND id_Subclasificacion IS NULL ORDER BY nombre ASC";


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
        {$this->bd2}costopotencial,
        {$this->bd2}recetas
        WHERE
        receta = idReceta
        AND MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND costopotencial.id_Clasificacion = ?

       -- AND id_Subclasificacion IS NULL ORDER BY nombre ASC
        ";

        $sql = $this->_Select($query, $array);
        return $sql;
    }



}

class Costopotencial extends CRUD{
    private $bd2;
    public function __construct(){
        $this->bd2 = 'rfwsmqex_gvsl_costsys2.';
        $this->bd = 'costsys_';
    }


    function selectTablero($idClasificacion, $mes, $year) {
        $array = array($idClasificacion, $mes, $year);

        $query = "SELECT * FROM {$this->bd2}tablerocontrol 
        WHERE id_Clasificacion = ? 
        AND MONTH(fechaMovimiento) = ? 
        AND YEAR(fechaMovimiento) = ?";
        $sql = $this->_Read($query, $array);
        $row = null;
        foreach ($sql as $row)
            ;
        return $row;
    }


    function listSubclasificacion($array) {
        $query = "
        SELECT idSubClasificacion as id, nombre FROM {$this->bd2}subclasificacion 
        WHERE id_Clasificacion = ? 
        AND (subclasificacion.nombre != 'DESCONTINUADO' 
        AND subclasificacion.nombre != 'PRODUCTOS CON EMPAQUE') 
        ORDER BY nombre ASC";


        $sql = $this->_Read($query, $array);
        return $sql;
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
        costopotencial.costo,
        costopotencial.iva,
        recetas.ieps,
        costopotencial.idcostopotencial,
        recetas.id_Clasificacion,
        recetas.id_Subclasificacion
        FROM
        {$this->bd2}costopotencial,
        {$this->bd2}recetas
        WHERE
        receta = idReceta
        AND MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND costopotencial.id_Clasificacion = ?

        AND id_Subclasificacion IS NULL ORDER BY nombre ASC

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


        ";

        $sql = $this->_Read($query, $arreglo);

        return $sql;
    }


    function limpiar_desplazamiento($array) {
        $query = "
        UPDATE {$this->bd2}costopotencial

        SET desplazamiento = null

        WHERE YEAR(fecha_costo) = ? 
        AND MONTH(fecha_costo) = ? 
        AND idE = ?
        ";

        return $this->_CUD($query, $array);


    }

    function lsPrecioPropuesto($array = null){

        $query = "
            SELECT
                idE,
               
                id_Clasificacion,
                fecha_costo,
                precio_propuesto,
                receta
            FROM
                rfwsmqex_gvsl_costsys2.costopotencial
            WHERE 

                 MONTH(fecha_costo)      =  ?
                AND YEAR(fecha_costo)    =  ?
                AND id_Clasificacion     =  ?

            AND precio_propuesto <> 0
            ";


        return $this->_Read($query, $array);
       
    }
    function updateDatosCostoPotencial($array = null){

        $query = "
            UPDATE {$this->bd2}costopotencial 
        SET 
            margencontribucion        = ?,
            costo_porc                = ?,
            ventasestimadas           = ?,
            costoestimado             = ?,
            mc_estimado               = ?,
            mc_propuesto              = ?,
            costo_porc_propuesto      = ?,
            ventasestimadas_propuesto = ?,
            costoestimado_propuesto   = ?,
            mcestimado_propuesto      = ?,
            precio_propuesto          = ?,
            desplazamiento            = ?
        WHERE 
        idcostopotencial = ?
        ";


        return $this->_Read($query, $array);
       
    }

    function updatePrecioReceta($array){

        return $this->_Update([
            'table'  => "{$this->bd2}recetas",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }


    function limpiarCostoPotencial($array){
        $query = "
            DELETE FROM rfwsmqex_gvsl_costsys2.costopotencial 
            WHERE idE = ? 
            AND fecha_costo = ?
        ";

        return $this->_CUD($query, $array);
    }

    function LimpiarPrecioPropuesto($array){
       
        $query = "
        
            UPDATE {$this->bd2}costopotencial
            SET precio_propuesto = null

            WHERE YEAR(fecha_costo) = ? 
            
            AND MONTH(fecha_costo)  = ? 
            AND idE                 = ?
            AND id_Clasificacion    = ?
        
        ";

        return $this->_CUD($query, $array);


    }

    function add_costo_potencial($array){

        return $this->_Insert([
            'table'  => "{$this->bd2}costopotencial",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function GetCostoPotencial($array){
        $query = "
            SELECT
                *
            FROM
                {$this->bd2}costopotencial
            WHERE
                MONTH (fecha_costo)    = ?
                AND YEAR (fecha_costo) = ?
                AND idE = ?
        ";

        return $this->_Read($query, $array);
    }

    function lsSubRecetas($array){
        
        $query = "
        SELECT
            idSubreceta AS id,
            nombre AS subreceta,
            precioVenta,
            id_Clasificacion,
            id_Unidad,
            rendimiento,
             DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
            id_UDN
        FROM
            {$this->bd2} subreceta
        WHERE
            id_Clasificacion = ?
        ORDER BY
            idSubreceta ASC";

        return $this->_Read($query, $array);
    }

    function selectSumatoriasEstimadas($array) {
        $query = "
        SELECT
            SUM(ventasestimadas) AS ventasestimada,
            SUM(costoestimado) AS costoestimado,
            SUM(mc_estimado) AS mc_estimado,
            SUM(ventasestimadas_propuesto) AS ventasestimadas_propuesto,
            SUM(costoestimado_propuesto) AS costoestimado_propuesto,
            SUM(mcestimado_propuesto) AS mcestimado_propuesto,
            SUM(desplazamiento) AS desplazamiento,
            COUNT(idcostopotencial) AS produccion
        FROM
        {$this->bd2}costopotencial 
        WHERE

        desplazamiento != 0 
        AND id_Clasificacion = 8
        AND YEAR (fecha_costo) = 2024 
        AND MONTH (fecha_costo) = 3 
        
        ";
        
        $sql = $this->_Read($query, $array);
        $row = null;
        foreach ($sql as $row);
        return $row;
    }
   
    function lsClasificacion(){

        return $this->_Select([
            "table"  => "{$this->bd2}clasificacion",
            "values" => "idClasificacion AS id, 
            Clasificacion AS valor,id_UDN as udn",
            "where" => "idClasificacion != 7 AND idClasificacion != 9",
        ]);
    }




    function lsSubClasificacion(){

        return $this->_Select([

            "table"  => "{$this->bd2}subclasificacion",
            "values" => "idSubClasificacion AS id,
             nombre AS valor, id_Clasificacion AS idClasificacion ",
            "where" => "idSubClasificacion != 70",
            "order" => ["ASC" => "idSubClasificacion"]
        ]);
    }

    function udpt_precio_propuesto($array){

        return $this->_Update([
            'table'  => "{$this->bd2}costopotencial",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
        
        
    }



    function lsUDN(){
        $query ="
       SELECT idUDN AS id, UDN AS valor FROM udn 
      WHERE Stado = 1 AND idUDN != 10 AND idUDN != 8  
      ORDER BY Antiguedad ASC";
        return $this->_Read($query, null);
    }

    function lsClase($array){

        $query ="
            SELECT idClasificacion as id, Clasificacion as valor 
            FROM   costsys_clasificacion 
            WHERE  Stado = 1 
            AND id_UDN = ?

            ORDER BY Clasificacion ASC
        ";

        return $this->_Read($query, $array);

    }

    function selectSubclasificaciones($idClasificacion){
        $array = array($idClasificacion);
        $query = "SELECT * FROM costsys_subclasificacion WHERE id_Clasificacion = ? 
        AND (costsys_subclasificacion.nombre != 'DESCONTINUADO' 
        AND costsys_subclasificacion.nombre != 'PRODUCTOS CON EMPAQUE') ORDER BY nombre ASC";
        $sql = $this->_Read($query,$array);
    
        return $sql;
    }

    function selectRecetasSubclasificacionNull($idClasificacion) {
    $array = array($idClasificacion);
    
    $query = "
    SELECT * FROM 
      costsys_recetas 
    WHERE id_Clasificacion = ? 
    AND id_Subclasificacion IS NULL 
    ORDER BY nombre ASC";

    $sql = $this->_Read($query,$array);
    return $sql;
    }

function selectRecetasSubclasificacion($idSubclasificacion) {
    $array = array($idSubclasificacion);
    $query = "SELECT * FROM costsys_recetas 
    WHERE id_Subclasificacion = ? ORDER BY nombre ASC";
    $sql = $this->_Read($query,$array);
    return $sql;
}


function selectDatosCostoPotencial($a){
    // $array = array($idReceta,$mes,$year);
    $query = "
    SELECT * FROM {$this->bd3}costopotencial 
    
    WHERE receta = ? 
    
    AND MONTH(fecha_costo) = ? 
    AND YEAR(fecha_costo)  = 2023";
    
    $sql = $this->_Read($query,$a);
    $row = null;
    foreach($sql as $row);
    return $row;
}




/* Existe el tablero creado */ 
  
    function Tabla_costoPotencial($arreglo){
        
        
        $query = "
        SELECT
        *
        FROM
        {$this->bd2}costopotencial
        WHERE
        MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND id_Clasificacion = ?
        ";

        $sql = $this->_Read($query, $arreglo);
        
        return $sql;
    }
   



    function calculoCostoPotencial($data,$calculo){

        $permiso = 1;

        $impuestos = $data['iva'] + $data['ieps'];
        $pVentaIVA = $data['pVenta'] / (1 + ($impuestos / 100));
        $receta    = $calculo->totalReceta($data['idReceta']);
        $total     = $receta['totalReceta'];
        $costo     = $total / $data['rendimiento'];
        
        //    -- Calculo de costo potencial -- 
        
        $porcentajeCosto = ($costo / $pVentaIVA) * 100;
        $mc              = $pVentaIVA - $costo;
        $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
        $costoEstimado   = $costo * $data['desplazamiento'];
        $mcEstimado      = $mc * $data['desplazamiento'];
       


        if($data['precioPropuesto']):

            $pVentaIVA       = $data['precioPropuesto'] / (1 + ($impuestos / 100));
            $mc              = $pVentaIVA - $costo;
            $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
            $mcEstimado      = $mc * $data['desplazamiento'];
        
        endif;    


    
        // -- Calculo propuesto  --
        $yearAnterior = $_POST['Anio'];
        $mesAnterior  = $_POST['Mes'];
        
        if ($_POST['Mes'] == 1) {
            $mesAnterior = 12;
            $yearAnterior = $_POST['Anio'] - 1;
        }

        $cpAnterior = $this->selectDatosCostoPotencial([
            $data['idReceta'],
            $mesAnterior]
        );

        $ls = count($cpAnterior);





        if ($data['desplazamiento'] == 0 && $permiso == 1) {
            $desplazamiento = $cpAnterior['desplazamiento'];
        }

         if ( $data['precioPropuesto'] != 0 ):

         else: 
         
         if(isset($cpAnterior['precio_propuesto']) && $cpAnterior['precio_propuesto'] != 0 && $permiso == 1):

            $pPropuesto = $cpAnterior['precio_propuesto'];
        
         else:

            $pPropuesto = 0;
            $mcPropuesto = 0;
            $porcentajeCostoPropuesto = 0; 
            
            

         endif;

        endif;


        // -- aplicar filtros modificables --

        $desplazamientoPromedio = 0;
        $costoAlto              = 0;
        $costoBajo              = 0;
        $mcAlto                 = 0;
        $mcBajo                 = 0;


        
        return [
            'pVenta'          => $data['pVenta'],
            'pVentaIVA'       => $pVentaIVA,
            'costo'           => $costo,
            'mc'              => $pVentaIVA - $costo,
            'porcentajeCosto' => $porcentajeCosto,
            'impuestos'       => $impuestos,
            'ventasEstimadas' => $ventasEstimadas,
            'costoEstimado'   => $costoEstimado,
            'mcEstimado'      => $mcEstimado,
            'desplazamiento'  => $desplazamiento,
             'total'          => $total,
            'precioPropuesto' => $cpAnterior['precio_propuesto'],
            'ls'              => $ls,
        ];
    }


     
    function aplicarCalculo($data,$calculo){

        $permiso = 1;

        $impuestos = $data['iva'] + $data['ieps'];
        $pVentaIVA = $data['pVenta'] / (1 + ($impuestos / 100));
        $receta    = $calculo->totalReceta($data['idReceta']);
        $total     = $receta['totalReceta'];
        $costo     = $total / $data['rendimiento'];
        
        //    -- Calculo de costo potencial -- 
        
        $porcentajeCosto = ($costo / $pVentaIVA) * 100;
        $mc              = $pVentaIVA - $costo;
        $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
        $costoEstimado   = $costo * $data['desplazamiento'];
        $mcEstimado      = $mc * $data['desplazamiento'];
       


        if($data['precioPropuesto']):

            $pVentaIVA       = $data['precioPropuesto'] / (1 + ($impuestos / 100));
            $mc              = $pVentaIVA - $costo;
            $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
            $mcEstimado      = $mc * $data['desplazamiento'];
        
        endif;    


    
        // -- Calculo propuesto  --
        $yearAnterior = $_POST['Anio'];
        $mesAnterior  = $_POST['Mes'];
        
        if ($_POST['Mes'] == 1) {
            $mesAnterior = 12;
            $yearAnterior = $_POST['Anio'] - 1;
        }

        // $cpAnterior = $this->selectDatosCostoPotencial([
        //     $data['idReceta'],
        //     $mesAnterior]
        // );

        // $ls = count($cpAnterior);


        // if ($data['desplazamiento'] == 0 && $permiso == 1) {
        //     $desplazamiento = $cpAnterior['desplazamiento'];
        // }

        //  if ( $data['precioPropuesto'] != 0 ):

        //  else: 
         
        //  if(isset($cpAnterior['precio_propuesto']) && $cpAnterior['precio_propuesto'] != 0 && $permiso == 1):

        //     $pPropuesto = $cpAnterior['precio_propuesto'];
        
        //  else:

        //     $pPropuesto = 0;
        //     $mcPropuesto = 0;
        //     $porcentajeCostoPropuesto = 0; 
            
            

        //  endif;

        // endif;


        // -- aplicar filtros modificables --

        $desplazamientoPromedio = 0;
        $costoAlto              = 0;
        $costoBajo              = 0;
        $mcAlto                 = 0;
        $mcBajo                 = 0;


        
        return [
            'pVenta'          => $data['pVenta'],
            'pVentaIVA'       => $pVentaIVA,
            'costo'           => $costo,
            'mc'              => $pVentaIVA - $costo,
            'porcentajeCosto' => $porcentajeCosto,
            'impuestos'       => $impuestos,
            'ventasEstimadas' => $ventasEstimadas,
            'costoEstimado'   => $costoEstimado,
            'mcEstimado'      => $mcEstimado,
            'desplazamiento'  => $desplazamiento,
             'total'          => $total,
            // 'precioPropuesto' => $cpAnterior['precio_propuesto'],
            'ls'              => $ls,
        ];
    }






}
 