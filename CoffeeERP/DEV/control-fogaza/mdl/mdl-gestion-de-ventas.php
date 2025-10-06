
<?php
require_once('../../conf/_CRUD.php');

class Gestiondeventas extends CRUD{
    private $bd;
    private $erp;

    

    public function __construct() {
        $this->bd = "rfwsmqex_gvsl_produccion2.";
        $this->erp = "rfwsmqex_gvsl_produccion2.";
    }
    function lsUDN(){
        $query ="SELECT idUDN AS id, UDN AS valor FROM udn WHERE Stado = 1";
        return $this->_Read($query, null);
    }

    function lsAreas() {
        $query = "SELECT idArea AS id, Nombre_Area AS valor 
        FROM {$this->bd}almacen_area WHERE estado_area = 1";
        return $this->_Read($query, null);
    }

  
    function getTotalProduccion($array){
        $total_area = 0;

        $sql = "
              SELECT
                idArea,
                almacen_area.Nombre_Area,
                SUM(cantidad * costo) as total
            FROM
                {$this->bd}almacen_area
                INNER JOIN {$this->bd}almacen_productos ON almacen_productos.Area = almacen_area.idArea
                INNER JOIN {$this->bd}listaproductos    ON listaproductos.id_productos = almacen_productos.idAlmacen
                INNER JOIN {$this->bd}lista_productos   ON listaproductos.id_lista = lista_productos.idLista
            WHERE
                DATE_FORMAT(foliofecha,'%Y-%m-%d') = ? 
                and id_grupo = ? and id_tipo = 1
            GROUP BY idArea
        ";


        $ps = $this->_Read($sql, $array);


        foreach ($ps as $key) {
            $total_area = $total_area + $key['total'];
        }

        return $total_area;
    }

    function listColaborador($array){
        $sql = "
        SELECT 
            colaborador.idEmpleado,
            Nombres 
        FROM 
        rfwsmqex_gvsl_rrhh.empleados,
        {$this->bd}colaborador 
        WHERE 
        {$this->bd}colaborador.id_ColaboradorRH = rfwsmqex_gvsl_rrhh.empleados.idEmpleado 
        AND Estado = 1 
        AND id_area = ?";

        $ps = $this->_Read($sql, $array, "1");
        
        return $ps;
    }

    function RegistroPagos($array){
        $key = null;
        $sql = "
        SELECT
            pagodestajo destajo,
            DiasExtras dias,
            Fonacot as fonacot,
            Infonavit as infonavit,
            perdidaMaterial as perdidaMaterial,
            prestamoPersonal as prestamoPersonal,
            formatopago.FechaPago fecha
        FROM
            {$this->bd}destajo
        INNER JOIN {$this->bd}formatopago ON destajo.id_Pago = formatopago.idPago
        WHERE
            destajo.id_Colaborador = ? AND
        DATE_FORMAT(FechaPago,'%Y-%m-%d') = ?
        ";
        $ps = $this->_Read($sql, $array);
        foreach ($ps as $key);
        return $key;
    }

    
    function CancelarFolio($array) {

        return $this->_Update([
            'table' => "{$this->bd}lista_productos",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lsFolio($array){
        $query="
        SELECT
            idLista,
            lista_productos.folio, 
            lista_productos.foliofecha, 
            lista_productos.id_tipo, 
            lista_productos.new_estado, 
            lista_productos.estado_revisado, 
            lista_productos.turno,
            nota, 
            lista_productos.fecha_cierre,
            DATE_FORMAT(foliofecha,'%Y-%m-%d') as fecha,
            DATE_FORMAT(foliofecha,'%r') as hora
        FROM
        {$this->bd}lista_productos
        WHERE id_tipo = ? and
        DATE_FORMAT(foliofecha,'%Y-%m-%d')  BETWEEN ? AND ?
        ORDER BY foliofecha DESC
        ";
        //  WHERE new_estado = ? and
        return 	 $this->_Read($query,$array);
    }

    function Select_Areas($array){

    $query = "
    SELECT
        idArea,
        Nombre_Area
        FROM
        {$this->bd}almacen_area,
        {$this->bd}almacen_productos,
        {$this->bd}listaproductos
    WHERE
    Area = idArea
    AND id_productos = idAlmacen
    AND id_lista = ?
    GROUP BY
    idArea";
    $sql = $this->_Read($query,$array);
    return $sql;
    }

    function Select_Productos($area,$id_lista){
    $array = array($area,$id_lista);

    $query = "SELECT
    NombreProducto,
    cantidad,
    listaproductos.sugerencia as sugerencia,

    costo,
    cantidad * costo as total,
    idListaProductos,

    almacen_productos.EstadoProducto,
    estado_sugerencia,
    almacen_productos.sugerencia as sugerido
    FROM
    {$this->bd}listaproductos
    INNER JOIN {$this->bd}almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
    WHERE area  = ? and id_lista = ?

    ORDER BY NombreProducto ASC
    ";

    $sql = $this->_Read($query,$array);
    return $sql;
    }

    function lsDataTicket($array) { 

    $query="
    SELECT
    lista_productos.folio,
    lista_productos.foliofecha,
    lista_productos.id_tipo,
    lista_productos.new_estado,
    lista_productos.estado_revisado,
    lista_productos.turno,
    lista_productos.fecha_cierre,
    DATE_FORMAT(foliofecha,'%Y-%m-%d') AS fecha,
    DATE_FORMAT(foliofecha,'%r') AS hora,
    almacen_area.Nombre_Area,
    nota
    FROM
    {$this->bd}lista_productos
    LEFT JOIN {$this->bd}almacen_area ON lista_productos.id_grupo = almacen_area.idArea
    WHERE idLista = ? 
    ";



    return 	 $this->_Read($query,$array);
    }

    function row_data($array) { 

    $sql  = "
        SELECT
            venta_productos.NombreProducto,
            SUM( cantidad) as cantidad
        FROM
        hgpqgijw_ventas.CierrePedidos
        INNER JOIN hgpqgijw_ventas.lista_productos ON lista_productos.id_cierre = CierrePedidos.idCierre
        INNER JOIN hgpqgijw_ventas.listaproductos  ON listaproductos.id_lista = lista_productos.idLista
        INNER JOIN hgpqgijw_ventas.venta_productos ON listaproductos.id_productos = venta_productos.idProducto
        WHERE idCierre = 1
        GROUP BY id_productos
        ORDER BY NombreProducto ASC
    ";


    return 	 $this->_Read($sql,$array);
    }

    function __actualizar_ticket($array){
        $query = "UPDATE {$this->bd}lista_productos 
        SET  id_tipo = ? , estado_revisado = ? 
        WHERE  idLista= ? ";

        return $this->_CUD($query, $array);
    }

    function actualizar_cantidad($array)
    {

        return $this->_Update([
            'table'  => "{$this->bd}listaproductos",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function lsProduccion($array){
        $query = "
        SELECT
            listaproductos.id_productos,
            listaproductos.cantidad,
            listaproductos.costo,
            listaproductos.EstadoProducto,
            listaproductos.motivo,
            listaproductos.id_lista,
            listaproductos.idListaProductos,
            listaproductos.sugerencia,
            almacen_productos.NombreProducto
        FROM
        {$this->bd}listaproductos
        INNER JOIN {$this->bd}almacen_productos 
        ON listaproductos.id_productos = almacen_productos.idAlmacen
        WHERE id_lista = ? 
        ";

        return $this->_Read($query, $array);

    }


    // Crear formato de pago:

    function createFolio($array){
        $query = "INSERT INTO {$this->bd}formatopago 
        (Folio, FechaPago) 
        VALUES (?,?)";

        return $this->_CUD($query, $array);
    }

    function getFolio($array){

        $query = "SELECT * FROM {$this->bd}formatopago 
        WHERE DATE_FORMAT(FechaPago, '%Y-%m-%d' )= ?";
        return $this->_Read($query, $array);
    }

    function getPago($array)
    {

        $query = "SELECT idDestajo FROM {$this->bd}destajo 
        WHERE  id_Pago = ? AND id_Colaborador = ? ";
        return $this->_Read($query, $array);
    }


    function createPago($array){

        return $this->_Insert([
            'table'  => "{$this->bd}destajo",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updatePago($array){

        return $this->_Update([
            'table'  => "{$this->bd}destajo",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function consultarProduccion($array){
        $merma = 0;
        $sql = "
        SELECT
            almacen_area.Nombre_Area,
            SUM(cantidad*Costo) as cantidad
        FROM
            {$this->bd}almacen_area
            INNER JOIN {$this->bd}almacen_productos ON almacen_productos.Area = almacen_area.idArea
            INNER JOIN {$this->bd}listaproductos ON listaproductos.id_productos = almacen_productos.idAlmacen
            INNER JOIN {$this->bd}lista_productos ON listaproductos.id_lista = lista_productos.idLista
        WHERE
        DATE_FORMAT(foliofecha,'%Y-%m-%d') BETWEEN ? and ?
        and id_tipo = ? and idArea = ? ";

        $ps = $this->_Read($sql, $array);
        foreach ($ps as $key) {
            $merma = $key['cantidad'];
        }
        return $merma;
    }

    function merma_dia($array){
        $merma = 0;
        
        $sql   = "
        SELECT
            almacen_area.Nombre_Area,
            SUM(cantidad*Costo) as total
        FROM
            {$this->bd}almacen_area
            INNER JOIN {$this->bd}almacen_productos ON almacen_productos.Area = almacen_area.idArea
            INNER JOIN {$this->bd}listaproductos ON listaproductos.id_productos = almacen_productos.idAlmacen
            INNER JOIN {$this->bd}lista_productos ON listaproductos.id_lista = lista_productos.idLista
        WHERE
        DATE_FORMAT(foliofecha,'%Y-%m-%d') = ?
        and id_tipo = ? and idArea = ? ";

        $ps = $this->_Read($sql, $array);

        foreach ($ps as $key) {
            $merma = $key['total'];
        }
        return $merma;
    }





}
?>