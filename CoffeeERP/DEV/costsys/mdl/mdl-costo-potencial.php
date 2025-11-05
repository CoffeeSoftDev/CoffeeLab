<?php
require_once('../../conf/_CRUD.php');


class Costsys extends CRUD {
    public $bd;
    public $bd2;
    public $costopotencial;
    
    public function __construct(){
        $this->bd2 = 'rfwsmqex_gvsl_costsys2.';
        $this->bd = 'rfwsmqex_gvsl_costsys2.';

        $this-> costopotencial = $this -> bd.'costopotencial';
    }

    function lsUDN(){
        $query = "
            SELECT idUDN AS id, UDN AS valor FROM udn 
            WHERE Stado = 1 AND idUDN != 10 AND idUDN != 8  
            ORDER BY UDN ASC";

        return $this->_Read($query, null);
    }

    function updTablero($array) {

        return $this->_Update([
            'table'  => "{$this->bd}tablerocontrol",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);

   }

    function lsClasificacion(){

        $query= $this->_Select([
            "table"  => "{$this->bd2}clasificacion",
            "values" => "idClasificacion AS id,Clasificacion AS valor,id_UDN as udn",
            "where"  => "idClasificacion != 7 AND idClasificacion != 9",
        ],true);

        return $this->_Read($query, null);
    }

    function lsSubClasificacion() {

        return $this->_Select([

            "table" => "{$this->bd2}subclasificacion",
            "values" => "idSubClasificacion AS id, nombre AS valor, id_Clasificacion AS idClasificacion ",
            "where" => "idSubClasificacion != 70",
            "order" => ["ASC" => "idSubClasificacion"]
        ]);
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

        AND id_Subclasificacion IS NULL ORDER BY nombre asc
        ";



        return $this->_Read($query, $arreglo);


    }

    function aplicarCalculo($data, $calculo) {

        $permiso = 1;

        $pPropuesto = $data['precioPropuesto'];
        $filter     = $data['filter'];


        $impuestos = $data['iva'] + $data['ieps'];
        $pVentaIVA = $data['pVenta'] / (1 + ($impuestos / 100));
        $receta    = $calculo->totalReceta($data['idReceta']);
        $total     = $receta['total'];
        $costoReceta     = $total / $data['rendimiento'];
        $costo     = $data['costo'];

        //    -- Calculo de costo potencial -- 
        $mc              = $pVentaIVA - $costo;
        $mcEstimado      = $mc * $data['desplazamiento'];
        $porcentajeCosto = ($costo / $pVentaIVA) * 100;


        // $ventasEstimadas   = $pVentaIVA * $data['desplazamiento'];
        $costoEstimado     = $costo * $data['desplazamiento'];
        // $mcEstimado        = $mc * $data['desplazamiento'];
     

        if ($data['precioPropuesto'] != 0): // calculo si tiene precio pPropuesto.
            
            $pVentaIVA       = $pPropuesto / (1 + ($impuestos / 100));
            
            
            // calculo pPropuesto
            $mcPropuesto              = $pVentaIVA - $costo;
            $porcentajeCostoPropuesto = ($costo / $pVentaIVA) * 100;
            $ventasEstimadasPropuesto = $pVentaIVA * $data['desplazamiento'];
            $costoEstimadoPropuesto   = $costo * $data['desplazamiento'];
            $mcEstimadoPropuesto      = $mc * $data['desplazamiento'];
        
      
        else: // calculo con pVenta. 
            
            $pPropuesto               = 0;
            $mcPropuesto              = 0;
            $porcentajeCostoPropuesto = 0;

            $ventasEstimadas          = $pVentaIVA * $data['desplazamiento'];
            $costoEstimado            = $costo * $data['desplazamiento'];
            $mcEstimado               = $mc * $data['desplazamiento'];
            
            $ventasEstimadasPropuesto = $ventasEstimadas;
            $costoEstimadoPropuesto   = $costoEstimado;
            $mcEstimadoPropuesto      = $mcEstimado;
        
       
        endif;


        // aplicar filtro modificable.

        if($filter):

            if ( $pPropuesto != 0 ) {

                $bgPPropuesto    = 'bg-warning';
                $pVentaIVA       = $pPropuesto / (1 + ($impuestos / 100));
                $mc              = $mcPropuesto;
                $porcentajeCosto = $porcentajeCostoPropuesto;
                $ventasEstimadas = $ventasEstimadasPropuesto;
                $costoEstimadas  = $costoEstimadoPropuesto;
                $mcEstimado      = $mcEstimadoPropuesto;
            }


        endif;



        // -- Calculo propuesto  --
        $yearAnterior = $_POST['Anio'];
        $mesAnterior = $_POST['Mes'];

        if ($_POST['Mes'] == 1) {
            $mesAnterior = 12;
            $yearAnterior = $_POST['Anio'] - 1;
        }






        return [
            'pVenta'          => $data['pVenta'],
            'pVentaIVA'       => $pVentaIVA,
            'costo'           => $costo,
            'costoReceta'      => $costoReceta,
            'mc'              => $mc,
            'porcentajeCosto' => $porcentajeCosto,
            'impuestos'       => $impuestos,
            'ventasEstimadas' => $ventasEstimadas,
            'costoEstimado'   => $costoEstimado,
            'mcEstimado'      => $mcEstimado,
            'desplazamiento'  => $data['desplazamiento'],
            'total'           => $total,


            'lbl' =>  $receta['lblTotalReceta'].' / '.$data['rendimiento']
            // 'precioPropuesto' => $cpAnterior['precio_propuesto'],
            // 'ls'              => $ls,
        ];
    }

    // aplicar actualizacion de desplazamiento, temporal.

    function getCostoPotencialbyid($array){
        $query = "SELECT * FROM {$this->bd}costopotencial 
        WHERE idcostopotencial = ?";
        $sql = $this->_Read($query,$array);
        return $sql[0];
    }

    function updDesplazamiento($array){

        return $this->_Update([
            'table' => "{$this->bd}costopotencial",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);


    }

    

    //  Actualizar precios propuestos

    function udpt_precio_propuesto($array){

        return $this->_Update([
            'table'  => "{$this->bd2}costopotencial",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);


    }

    function limpiarCostoPotencial($array) {
        return $this->_Update([
            'table'  => "{$this->bd2}costopotencial",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }


    function limpiarPrecioPro($array) {

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

    
    function selectSumatoriasEstimadas($array){

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
        foreach ($sql as $row)
            ;
        return $row;
    }


    // tablero de botones :

    function listCostoPotencial($arreglo){

        $query = "
        SELECT
            recetas.idReceta,
            costopotencial.idE,
            recetas.nombre,
            recetas.precioVenta,
            recetas.rendimiento,
            precio_propuesto,
            desplazamiento,
            costopotencial.fecha_costo,
            costopotencial.iva,
            costopotencial.costo,
            costopotencial.costo_porc,
            costopotencial.margencontribucion,

            costopotencial.ventasestimadas,
            costopotencial.costoestimado,
            costopotencial.mc_estimado,


            costopotencial.ventasestimadas_propuesto,
            costopotencial.costoestimado_propuesto,
            costopotencial.mcestimado_propuesto,
            costopotencial.mc_propuesto,
            costopotencial.costo_porc_propuesto,
            
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


        ORDER BY nombre asc
        ";



        return $this->_Read($query, $arreglo);


    }

    function add_costo_potencial($array){

        return $this->_Insert([
           
            'table'  => "{$this->bd2}costopotencial",
            'values' => $array['values'],
            'data'   => $array['data']
        
        ]);

    }

    function listCostoPotencialPropuesto($arreglo){

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

        AND precio_propuesto != 0
        AND precio_propuesto is not NULL
        ORDER BY nombre asc

         
        ";



        return $this->_Read($query, $arreglo);


    }

   

    function updateProductosMod($array){

        $query = $array;

        $query['where'][1] = 'MONTH ( fecha_costo )';
        $query['where'][2] = 'YEAR ( fecha_costo )';


        return $this -> _Update($query,$costopotencial,true);

    }

    function updateProductosModificados($array){
          
    }

    function insertTablero($idClasificacion, $mes, $year) {
        $ultimoTablero = $this->selectUltimoTablero($idClasificacion);

        $array = array(
            $ultimoTablero['id_UDN'],
            $idClasificacion,
            $year . '-' . $mes . '-01',
            $ultimoTablero['CostoProduccionAlto'],
            $ultimoTablero['CostoProduccionBajo'],
            $ultimoTablero['MargenContribucionAlto'],
            $ultimoTablero['MargenContribucionBajo'],
            $ultimoTablero['ventascosto'],
            $ultimoTablero['desplazamientoPromedio']
        );

        // return $array;

        $query = "INSERT INTO {$this->bd}tablerocontrol (
                        id_UDN,
                        id_Clasificacion,
                        fechaMovimiento,
                        CostoProduccionAlto,
                        CostoProduccionBajo,
                        MargenContribucionAlto,
                        MargenContribucionBajo,
                        ventascosto,
                        desplazamientoPromedio
                    ) VALUES (
                        ?,?,?,?,
                        ?,?,?,?,
                        ?
                    )";

        return $this->_CUD($query, $array);
     
    }

    function selectUltimoTablero($idClasificacion) {
        $array = array($idClasificacion);

        $query = "SELECT * FROM {$this->bd}tablerocontrol 
        WHERE id_Clasificacion = ? ORDER BY idTablero DESC LIMIT 1";
        
        $sql = $this->_Read($query, $array);
        foreach ($sql as $row);
        return $row;
    }





    function selectTablero($array)
    {
        $query = "
        SELECT * FROM 
        {$this->bd}tablerocontrol 
        WHERE 
        -- id_UDN = ? AND 
        id_Clasificacion = ? AND 
        MONTH(fechaMovimiento) = ? AND 
        YEAR(fechaMovimiento) = ?";

        $sql = $this->_Read($query, $array);

        $row = null;

        foreach ($sql as $row)
            ;
        return $row;
    }



    // actualizar Productos
    function selectRecetas($array){
        $query = "SELECT * FROM {$this->bd}recetas WHERE id_Clasificacion = ?";
        return  $this->_Read($query,$array);
    }

     function selectDatosCostoPotencial($array){
             
            $query = "SELECT * FROM {$this->bd}costopotencial 
            WHERE receta = ? 
            AND MONTH(fecha_costo) = ? AND YEAR(fecha_costo) = ?";


            return  $this->_Read($query,$array)[0];
          }


       function getSubcategory($array){
        $name = '';
        $query = "
        SELECT
            subclasificacion.idSubClasificacion,
            subclasificacion.nombre
        
        FROM {$this->bd2}subclasificacion
        
        WHERE idSubClasificacion = ?
        ORDER BY nombre DESC
        ";

        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $name = $key['nombre'];
        }

        return $name;
    }  
    
    
      function calculateCostoPotencial($data, $calculo)
    {

        $permiso = 1;

        $impuestos = $data['iva'] + $data['ieps'];
        $pVentaIVA = $data['pVenta'] / (1 + ($impuestos / 100));
        $receta    = $calculo->totalReceta($data['idReceta']);
        $total     = $receta['totalReceta'];

        
        
        $costo = $data['costo'];

        if(!$data['costo']){
            $costo     = $total / $data['rendimiento'];
        }

        
        //    -- Calculo de costo potencial -- 

        $porcentajeCosto = ($costo   /  $pVentaIVA ) * 100;
        $mc              = $pVentaIVA - $costo;
        $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
        $costoEstimado   = $costo * $data['desplazamiento'];
        $mcEstimado      = $mc * $data['desplazamiento'];

        $lbl  = "{$costo} ";



        if ($data['precioPropuesto']):

            $pVentaIVA = $data['precioPropuesto'] / (1 + ($impuestos / 100));
            $mc = $pVentaIVA - $costo;
            $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
            $mcEstimado = $mc * $data['desplazamiento'];

        endif;



        // -- Calculo propuesto  --
        $yearAnterior = $_POST['Anio'];
        $mesAnterior = $_POST['Mes'];

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
            'desplazamiento'  => $desplazamiento,
            'total'           => $total,
            // 'precioPropuesto' => $cpAnterior['precio_propuesto'],
            'lbl' => $lbl,
        ];
    }







}


class TableroControl extends CRUD{
    public $bd;
    public $bd2;
    public function __construct()
    {
        $this->bd2 = 'rfwsmqex_gvsl_costsys.';
        $this->bd = 'rfwsmqex_gvsl_costsys.';
    }

    // TableroControl

    function selectTablero($array)
    {
        $query = "
        SELECT * FROM 
        {$this->bd}tablerocontrol 
        WHERE 
        -- id_UDN = ? AND 
        id_Clasificacion = ? AND 
        MONTH(fechaMovimiento) = ? AND 
        YEAR(fechaMovimiento) = ?";

        $sql = $this->_Read($query, $array);

        $row = null;

        foreach ($sql as $row)
            ;
        return $row;
    }

    function countRecetas($idE, $idClasificacion)
    {
        $array = array($idE, $idClasificacion);
        $query = "SELECT COUNT(*) as total FROM {$this->bd}recetas WHERE id_UDN = ? AND id_Clasificacion = ?";
        $sql = $this->_Read($query, $array);

        $row = null;
        foreach ($sql as $row)
            ;
        if (!isset($row)) {
            $row['total'] = 0;
        }
        return $row['total'];
    }

    function countMCAlto($arreglo, $mcAlto)
    {
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

    function sumaMC($array)
    {
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
        foreach ($sql as $row)
            ;
        if (!isset($row)) {
            $row['total'] = 0;
        }
        return $row['total'];
    }

    function countMCBajo($arreglo, $mcBajo)
    {
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

    function countPorcentajeCostoAlto($arreglo, $CostoAlto)
    {
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

    function countPorcentajeCostoBajo($arreglo, $CostoBajo)
    {
        $array1 = array($CostoBajo);
        $array = array_merge($arreglo, $array1);

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

        foreach ($sql as $row)
            ;

        if (!isset($row)) {
            $row['total'] = 0;
        }

        return $row['total'];
    }

    function countProductosProducidos($array)
    {

        $query = "
            SELECT 
                COUNT(*) as contar
            FROM 
                {$this->bd}costopotencial 
            WHERE 
            idE = ? AND 

            id_Clasificacion   = ?  AND
            MONTH(fecha_costo) = ?  AND 
            YEAR(fecha_costo)  = ?  AND
            
            desplazamiento IS NOT NULL AND 
            desplazamiento != 0 ";

        $sql = $this->_Read($query, $array);

        $row = null;

        foreach ($sql as $row)
            ;

        if (!isset($row)) {
            $row['contar'] = 0;
        }
        return $row['contar'];
    }

    function updateVentasCostos($array)
    {

        return $this->_Update([
            'table' => "{$this->bd2}tablerocontrol",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);


    }

    function selectDatosTablero($array)
    {

        $query = "SELECT * FROM {$this->bd}tablerocontrol WHERE idTablero = ?";
        $sql = $this->_Read($query, $array);

        return $sql[0];
    }

    function updateEstadoCosto($array)
    {

        return $this->_Update([
            'table'  => "{$this->bd}tablerocontrol",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }


    function updtMargenContribucion($array){

        return $this->_Update([

            'table'  => "{$this->bd}tablerocontrol",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        
        ]);
    }

}


class SoftRestaurant extends CRUD {
    public $bd2;
    public function __construct()
    {
        $this->bd2 = 'rfwsmqex_gvsl_costsys.';
        $this->bdp = 'rfwsmqex_gvsl_produccion.';

    }
    function lsUDN()
    {
        $query = "
       SELECT idUDN AS id, UDN AS valor FROM udn 
      WHERE Stado = 1 AND idUDN != 10 AND idUDN != 8  
      ORDER BY Antiguedad ASC";
        return $this->_Read($query, null);
    }

    function GetCostoPotencial($array){
        $query = "
        SELECT
        *
        FROM
        {$this->bd2}costopotencial
        WHERE
        MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND idE = ?
        AND id_Clasificacion = ? ";

        return $this->_Read($query, $array);
    }

    function getCostoPotencialAll($array){
        $query = "
        SELECT
        *
        FROM
        {$this->bd2}costopotencial
        WHERE
        MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND idE = ?
       ";

        return $this->_Read($query, $array);
    }

    function getCostoPotencialByID($array){
        $query = "
        SELECT
        *
        FROM
        {$this->bd2}costopotencial
        WHERE
        MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND idE = ?
        AND id_Clasificacion = ? 
        AND receta = ?
        ";

        $sql = $this->_Read($query, $array);

        return $sql[0];
    }

    function lsRecetas($array){

        $query = "
        SELECT 
            idReceta,
            nombre AS receta,
            Clasificacion AS clasificacion,
            id_Subclasificacion,
            rendimiento,
            recetas.iva,
            precioVenta AS pventa,
            nota,
            recetas.id_UDN,
            recetas.ieps,
            id_Clasificacion
        FROM
        {$this->bd2}recetas,
        {$this->bd2}clasificacion
        WHERE
        id_Clasificacion = idClasificacion AND 
        recetas.id_UDN = ? AND
        id_Estado = 1 AND idClasificacion <> 41 and idClasificacion <> 7 and idClasificacion <> 6 and idClasificacion <> 12
        ORDER BY clasificacion desc


        ";

        $sql = $this->_Read($query, $array);
        return $sql;
    }

    function lsRecetasByClasificacion($array){

        $query = "
        SELECT 
            idReceta,
            nombre AS receta,
            Clasificacion AS clasificacion,
            id_Subclasificacion,
            rendimiento,
            recetas.iva,
            precioVenta AS pventa,
            nota,
            recetas.id_UDN,
            recetas.ieps,
            id_Clasificacion
        FROM
        {$this->bd2}recetas,
        {$this->bd2}clasificacion
        WHERE
        id_Clasificacion = idClasificacion AND 
        recetas.id_UDN = ? AND
        id_Estado = 1 AND 
        id_Clasificacion = ?
        ORDER BY Clasificacion desc


        ";

        $sql = $this->_Read($query, $array);
        return $sql;
    }


    function Productos_vendidos($array)
    {
        $query = "
        SELECT

        idAlmacen,
        almacen_productos.NombreProducto,
        almacen_productos.Area,
        listaproductos.idListaProductos,
        lista_productos.foliofecha,
        almacen_productos.sugerencia,
        SUM(cantidad) as CANT,
        almacen_productos.estadoProducto
        FROM

            {$this->bdp}listaproductos

            INNER JOIN {$this->bdp}almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
            INNER JOIN {$this->bdp}lista_productos ON listaproductos.id_lista = lista_productos.idLista
        WHERE MONTH(foliofecha) = ?
            AND   YEAR(foliofecha)  = ?
            AND Area = ? 
            And id_tipo = 1
            GROUP BY NombreProducto
        order by NombreProducto asc
      
        ";

        return $this->_Read($query, $array);


    }

    function _CONSULTA_COSTSYS($array)
    {
        $query = "
        SELECT

        recetas.nombre,
        homologado.id_Produccion,
        homologado.id_Costsys,            
        recetas.precioVenta,
        homologado.idHomologado,
        homologado.homologado,
        recetas.idReceta,
        iva,
        ieps,
        recetas.rendimiento
        
        FROM
        rfwsmqex_gvsl_produccion.homologado
        INNER JOIN {$this->bd2}recetas ON 
        rfwsmqex_gvsl_produccion.homologado.id_Costsys = {$this->bd2}recetas.idReceta
        WHERE id_Produccion = ?";

        return $this->_Read($query, $array);


    }

    function calculoCostoPotencial($data, $calculo)
    {

        $permiso = 1;

        $impuestos = $data['iva'] + $data['ieps'];
        $pVentaIVA = $data['pVenta'] / (1 + ($impuestos / 100));
        $receta    = $calculo->totalReceta($data['idReceta']);
        $total     = $receta['totalReceta'];

        
        
        $costo = $data['costo'];

        if(!$data['costo']){
            $costo     = $total / $data['rendimiento'];
        }

        
        //    -- Calculo de costo potencial -- 

        $porcentajeCosto = ($costo   /  $pVentaIVA ) * 100;
        $mc              = $pVentaIVA - $costo;
        $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
        $costoEstimado   = $costo * $data['desplazamiento'];
        $mcEstimado      = $mc * $data['desplazamiento'];

        $lbl  = "{$costo} ";



        if ($data['precioPropuesto']):

            $pVentaIVA = $data['precioPropuesto'] / (1 + ($impuestos / 100));
            $mc = $pVentaIVA - $costo;
            $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
            $mcEstimado = $mc * $data['desplazamiento'];

        endif;



        // -- Calculo propuesto  --
        $yearAnterior = $_POST['Anio'];
        $mesAnterior = $_POST['Mes'];

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
            'desplazamiento'  => $desplazamiento,
            'total'           => $total,
            // 'precioPropuesto' => $cpAnterior['precio_propuesto'],
            'lbl' => $lbl,
        ];
    }

    function setCostoPotencial($array)
    {

        return $this->_Update([
            'table' => "{$this->bd2}costopotencial",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function getAreaByName($array)
    {
        $query = "
        SELECT idArea FROM {$this->bdp}almacen_area WHERE Nombre_Area =?
        ";
        return $this->_Read($query, $array);
    }

    function GET_SUB($array){
        $name = '';
        $query = "
        SELECT
            subclasificacion.idSubClasificacion,
            subclasificacion.nombre
        
        FROM {$this->bd2}subclasificacion
        
        WHERE idSubClasificacion = ?
        ORDER BY nombre DESC
        ";

        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $name = $key['nombre'];
        }

        return $name;
    }

    function add_costo_potencial($array){

        return $this->_Insert([
            'table'  => "{$this->bd2}costopotencial",
            'values' =>   $array['values'],
            'data'   =>   $array['data']
        ]);
    
    }


    // Subir desplazamientos de las UDNs

    function select_list_grupo($array)
    {
        $id_grupo = 0;
        $query = "
        SELECT
            soft_grupoproductos.idgrupo,
            soft_grupoproductos.grupoproductos,
            soft_grupoproductos.clavegrupo,
            soft_grupoproductos.id_udn
        FROM
        rfwsmqex_gvsl_finanzas.soft_grupoproductos
        WHERE id_udn = ? and estatus = 1 and idgrupo <>28

        order by grupoproductos asc
    ";
        return $this->_Read($query, $array);
    }

    function SELECT_PRODUCTOS_x_SOFT($array){
    $query = "
        SELECT
            soft_productos.id_Producto,
            soft_productos.clave_producto,
            soft_productos.descripcion as producto,

            id_grupoc,
            soft_productos.id_udn,
            soft_productos.status,

            soft_productos.id_costsys,
            DATE_FORMAT(fecha,'%Y-%m-%d') as dat, 
            soft_productos.costo
        FROM
        rfwsmqex_gvsl_finanzas.soft_productos
        WHERE soft_productos.id_udn = ? and id_grupo_productos = ?
        -- AND id_Producto = ?
        --    and activo_soft = 1
        order by producto ASC


    ";

    return $this->_Read($query, $array);

    }

    function Enlace_Costsys($array){

        $query = '
        SELECT
            rfwsmqex_gvsl_costsys.recetas.nombre,
            rfwsmqex_gvsl_finanzas.soft_costsys.idhomologado,
            rfwsmqex_gvsl_finanzas.soft_costsys.id_costsys_recetas,
            rfwsmqex_gvsl_costsys.recetas.precioVenta,
            rfwsmqex_gvsl_finanzas.soft_costsys.id_soft_productos,

            id_Clasificacion,
            recetas.idReceta,
            iva,
            ieps,
            recetas.rendimiento
        FROM
        rfwsmqex_gvsl_costsys.recetas
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_costsys ON rfwsmqex_gvsl_finanzas.soft_costsys.id_costsys_recetas = rfwsmqex_gvsl_costsys.recetas.idReceta
        WHERE id_soft_productos = ?
        ORDER BY nombre ASC
        ';

        return $this->_Read($query, $array);


    }

    function _GET_CANT_X_MES($array){
        $cantidad = 0;
        $lbl_cantidad = '';
     
        $query = "
        SELECT
            id_folio,
            DATE_FORMAT(fecha_folio,'%Y-%m-%d') as fecha,
            cantidad,
            soft_productosvendidos.idvendidos as id
        FROM
            rfwsmqex_gvsl_finanzas.soft_folio
            INNER JOIN rfwsmqex_gvsl_finanzas.soft_productosvendidos ON soft_productosvendidos.idFolioRestaurant = soft_folio.id_folio
        WHERE
            MONTH(fecha_folio) = ? AND YEAR(fecha_folio) = ?
            AND id_productos   = ? 
            order by fecha asc
        ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $cantidad += $key['cantidad'];
            $lbl_cantidad .= $key['fecha'] . ' - ' . $key['cantidad'] . ', <br>';
        }

        if (count($sql) != 0) {
            $lbl_cantidad .= '<strong> Total : ' . $cantidad . ' </strong>';
        }

        $data = [
            "total" => $cantidad,
            "lbl" => $lbl_cantidad
        ];

        return $data;
    }

    function update_costo_potencial($array)
    {

        return $this->_Update([
            'table' => "{$this->bd2}costopotencial",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }


    // Tablero de consulta:

    function getCostoPotencialByMonth($array) {
        $query = "      
            SELECT
            
            idReceta,
            SUM(desplazamiento) as totalDesplazamiento,
            count(idReceta) as totalRecetas
            FROM
            {$this->bd2}costopotencial,
            {$this->bd2}recetas
            WHERE
            receta = idReceta
            AND fecha_costo = ?

            AND costopotencial.id_Clasificacion = ?

           
            ORDER BY nombre asc
        ";

        $sql = $this->_Read($query, $array);

        return $sql[0];
    
    }

 

    function deleteCostoPotencial($array) {

        return $this->_Delete([
            'table'  => "{$this->bd2}costopotencial",
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
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

    function selectPromedioManual($array)
    {
        $query = "
            SELECT
            * 
            FROM
            {$this->bd}comparativo 
            WHERE
            id_Clasificacion = ?";

        $sql = $this->_Read($query, $array);
       
        return $sql[0];
    }
    
    

    
}




class Costopotencial extends CRUD{
    private $bd;
    public function __construct()
    {
        $this->bd3 = 'rfwsmqex_gvsl_costsys.';
        $this->bd2 = 'rfwsmqex_gvsl_costsys.';
        $this->bd = 'costsys_';
    }

    function selectSumatoriasEstimadas($array) {
        $query = "SELECT
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


    function lsUDN(){
        $query ="SELECT idUDN AS id, UDN AS valor 
        FROM udn WHERE Stado = 1  ORDER BY Antiguedad ASC ";
        return $this->_Read($query, null);
    }

    function lsClase($array){

        $query ="
            SELECT idClasificacion as id, Clasificacion as valor 
            FROM   costsys_clasificacion 
            WHERE  Stado = 1 
            AND id_UDN = ?
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
        {$this->bd3}costopotencial
        WHERE
        MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND id_Clasificacion = ?
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
        recetas.ieps,
        costopotencial.idcostopotencial,
        recetas.id_Clasificacion,
        recetas.id_Subclasificacion
        FROM
        {$this->bd3}costopotencial,
        {$this->bd3}recetas
        WHERE
        receta = idReceta
        AND MONTH (fecha_costo) = ?
        AND YEAR (fecha_costo) = ?
        AND costopotencial.id_Clasificacion = ?

       -- LIMIT 10
        ";

        $sql = $this->_Read($query, $arreglo);
        
        return $sql;
    }

    function selectTablero($idClasificacion, $mes, $year){
        $array = array($idClasificacion, $mes, $year);
        
        $query = "SELECT * FROM {$this->bd3}tablerocontrol 
        WHERE id_Clasificacion = ? 
        AND MONTH(fechaMovimiento) = ? 
        AND YEAR(fechaMovimiento) = ?";
        $sql = $this->_Read($query, $array);
        $row = null;
        foreach ($sql as $row) ;
        return $row;
    }

    function calculoCostoPotencial($data,$calculo){

        $permiso = 1;

        $impuestos = $data['iva'] + $data['ieps'];
        $pVentaIVA = $data['pVenta'] / (1 + ($impuestos / 100));

        $receta = $calculo->totalReceta($data['idReceta']);
        
        $total = $receta['totalReceta'];
        
        
        $costo = $total / $data['rendimiento'];

        $mc = $pVentaIVA - $costo;
        $porcentajeCosto = ($costo / $pVentaIVA) * 100;

        $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
        $costoEstimado = $costo * $data['desplazamiento'];
        $mcEstimado = $mc * $data['desplazamiento'];

        // --- .Calculo propuesto . ---
        $yearAnterior = $_POST['Anio'];
        $mesAnterior  = $_POST['Mes'];
        
        if ($_POST['Mes'] == 1) {
            $mesAnterior = 12;
            $yearAnterior = $_POST['Anio'] - 1;
        }

        $cpAnterior = $this->selectDatosCostoPotencial([
            $data['idReceta'],
            $mesAnterior]);

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
        $costoAlto = 0;
        $costoBajo = 0;
        $mcAlto = 0;
        $mcBajo = 0;





        
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

            'precioPropuesto' => $cpAnterior['precio_propuesto'],
            'ls'              => $ls,
        ];
    }

    // -- actualizar Precios Modificados
    
    
    




}
