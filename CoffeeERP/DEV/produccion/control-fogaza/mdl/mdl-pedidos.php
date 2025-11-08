
<?php
require_once('../../../conf/_CRUD.php');

class Pedidos extends CRUD{

    public $bd;
    public function __construct() {
        $this->bd = "rfwsmqex_gvsl_produccion.";
    }

    function lsUDN() {
        $query = "SELECT idUDN AS id, UDN AS valor FROM udn WHERE Stado = 1";
        return $this->_Read($query, null);
    }

    function getClasificacion(){
        $query = "SELECT idClasificacion AS id, Clasificacion AS valor
        FROM {$this->bd}clasificacion WHERE Status = 1 order by Clasificacion desc";
        return $this->_Read($query, null);
    }

    function getListColaboradores() {
        $query = "

            SELECT
                rh_empleados.idEmpleado,
                rh_empleados.Nombres as valor,
                rh_puestos.Nombre_Puesto,
                rh_puesto_area.id_AreaUDN,
                rh_empleados.Telefono_Movil as id
            FROM
                rfwsmqex_erp.rh_empleados
            INNER JOIN rfwsmqex_erp.rh_puesto_area ON rh_empleados.Puesto_Empleado = rh_puesto_area.idPuesto_Area
            INNER JOIN rfwsmqex_erp.rh_puestos ON rh_puesto_area.id_Puesto = rh_puestos.idPuesto
            WHERE id_AreaUDN = 6 ";

        return $this->_Read($query, null);
    }

    function getTickets(){
        $query = "
        SELECT
        pedidofolio.idLista AS id,
        CONCAT(pedidofolio.folio, ' - ', clientes.Name_Cliente) AS valor,

        pedidofolio.encargado,
        pedidofolio.`Status`,
        pedidofolio.Total,
        pedidofolio.foliofecha,
        clientes.Name_Cliente
        FROM
            {$this->bd}clientes
        INNER JOIN {$this->bd}pedidofolio ON pedidofolio.id_cliente = clientes.idCliente

        WHERE Status = 1";
        return $this->_Read($query, null);
    }

    function getFolio($array){
        $query = "
        SELECT
            pedidofolio.folio,
            pedidofolio.encargado,
            clientes.Name_Cliente,
            clientes.Telefono,
            pedidofolio.fechapedido,
            pedidofolio.fechaCumple,
            pedidofolio.anticipo,
            observacion,
            efectivo,
            discount,
            discount_percent,
            Total,
            tdc,
             TIME_FORMAT(pedidofolio.horapedido, '%h:%i %p') AS horapedido,
            pedidofolio.idLista
        FROM
        {$this->bd}pedidofolio
            INNER JOIN {$this->bd}clientes ON pedidofolio.id_cliente = clientes.idCliente
            WHERE idLista = ?
        ";
        $result = $this->_Read($query, $array);
        return !empty($result) ? $result[0] : [];
    }


    function newFolio(){
        $query = "
            SELECT
            idLista

            FROM {$this->bd}pedidofolio
            WHERE Status = 1
            ORDER BY idLista DESC LIMIT 1
        ";
        return $this->_Read($query, null);

    }

    function lsArea(){
        $query = "
        SELECT
        rfwsmqex_gvsl_produccion.almacen_area.idArea as id,
        rfwsmqex_gvsl_produccion.almacen_area.Nombre_Area as valor
        FROM
        rfwsmqex_gvsl_produccion.almacen_area
        WHERE idArea != 3
        ";
        return $this->_Read($query, null);
    }

    function getProduct($array) {
        $query = "
        SELECT
            almacen_productos.idAlmacen as id ,
            almacen_productos.NombreProducto,
            almacen_productos.Area,
            almacen_productos.price,
            almacen_productos.id_clasificacion
        FROM
            {$this->bd}almacen_productos
        WHERE Area = 2 and estadoProducto = 1 and idAlmacen = ?
        ORDER BY NombreProducto DESC ";
        return $this->_Read($query, $array)[0];
    }

    public function getProducts($array) {

        $query = "
            SELECT
                almacen_productos.idAlmacen AS id,
                almacen_productos.NombreProducto AS valor,
                almacen_productos.Area,
                almacen_productos.fechaIngreso,
                almacen_productos.price
            FROM
                {$this->bd}almacen_productos
            LEFT JOIN {$this->bd}homologado 
                ON homologado.id_Produccion = almacen_productos.idAlmacen
            WHERE 
                almacen_productos.Area = 2 
                AND almacen_productos.estadoProducto = 1 
                AND almacen_productos.id_clasificacion = ?
            ORDER BY 
                almacen_productos.idAlmacen DESC
        ";

        return $this->_Read($query, $array);
    }

    function getPriceByCostsys($array) {
        $query = "
        SELECT
            NombreProducto,
            nombre,
            precioVenta,
            foto
        FROM
        {$this->bd}almacen_productos
        INNER JOIN {$this->bd}homologado ON {$this->bd}homologado.id_Produccion = rfwsmqex_gvsl_produccion.almacen_productos.idAlmacen
        INNER JOIN rfwsmqex_gvsl_costsys.recetas ON {$this->bd}homologado.id_Costsys = rfwsmqex_gvsl_costsys.recetas.idReceta
        WHERE id_Produccion = ?
        ";

        return $this->_Read($query, $array);
    }

    function CrearTicket($array){

        return $this->_Insert([
            'table'  => "{$this->bd}pedidofolio",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function addClient($array){

        $this->_Insert([
            'table'  => "{$this->bd}clientes",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);

        $query = "SELECT  idCliente FROM {$this->bd}clientes ORDER BY idCliente DESC LIMIT 1 ";

        return $this->_Read($query, $array)[0];

    }

    function getClientByName($array) {

        $query = "

         SELECT
            idAlmacen as id ,
            almacen_productos.NombreProducto as valor,
            almacen_productos.Area
        FROM

        {$this->bd}almacen_productos


        INNER JOIN {$this->bd}homologado ON homologado.id_Produccion = almacen_productos.idAlmacen
        WHERE Area = 2 and estadoProducto = 1 and id_clasificacion = ?
        ORDER BY NombreProducto DESC ";



        return $this->_Read($query, $array);

    }

    function getIdPedidoByFol($array){
        $id = 0;

        $query =
        "
        SELECT
            idListaProductos
        FROM
        {$this->bd}pedido_productos
        WHERE id_folio = ? and id_productos = ?
        ORDER BY idListaProductos DESC
        ";

        return $this->_Read($query, $array);

    }

    function getPedidoByIdList($array){
        $id = 0;

        $query =
        "
        SELECT
            *
        FROM
        {$this->bd}pedido_productos
        WHERE id_folio = ? and idListaProductos = ?

        ";

        return $this->_Read($query, $array);

    }

    function updatePedido($array) {

        return $this->_Update([
            'table'  => "{$this->bd}pedido_productos",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);


    }


    // Order images.
    public function createOrderImages($array) {
        return $this->_Insert([
            'table'  => "{$this->bd}order_images",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function getOrderImages($array){
        $id = 0;

        $query =
        "
        SELECT
            order_images.id,
            order_images.path,
            order_images.name,
            order_images.original_name,
            order_images.product_id
        FROM {$this->bd}order_images
        WHERE product_id = ?

        ";

        return $this->_Read($query, $array);

    }

    function removeOrderImages($array){
        $query = "
            DELETE FROM {$this->bd}order_images
            WHERE product_id = ?
        ";

        return $this->_CUD($query, $array);
    }


    // Personalizado.
    function getInfoPersonalizado($array){

        $query ="

            SELECT
            *
            FROM {$this->bd}pedidopersonalizado
            WHERE id_pedidoproducto = ? ";

        return $this->_Read($query, $array);

    }

    function setPedidoPersonalizado($array){

        return $this -> _Insert([
            'table'  => "{$this->bd}pedidopersonalizado",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);

    }

    function updatePersonalizado($array) {

        return $this->_Update([
            'table' => "{$this->bd}pedidopersonalizado",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function update_ticket($array){
        $query = "
        UPDATE
        {$this->bd}pedidofolio
        SET Status   = ?

        WHERE  idLista = ? ";

        return $this->_CUD($query, $array);
    }

    function setTickets($array) {

        return $this->_Update([
            'table'  => "{$this->bd}pedidofolio",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function add_producto_vendido($array){

        return $this->_Insert([

            'table'  => "{$this->bd}pedido_productos",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);

    }

    function listProducts($array){

        $sql = "
        SELECT
            pedido_productos.idListaProductos AS id,
            almacen_productos.NombreProducto,
            pedido_productos.cantidad,
            pedido_productos.id_folio,
            pedido_productos.id_productos,
            pedido_productos.costo,
            pedido_productos.personalizado,
            pedido_productos.leyenda,
            pedido_productos.image,
            pedido_productos.name,
            
            pedido_productos.portion,
            pedido_productos.imageCatalog,
            almacen_productos.idAlmacen,
            clasificacion.Clasificacion,
            clasificacion.rendimiento
        FROM
            {$this->bd}clasificacion
        INNER JOIN {$this->bd}almacen_productos ON almacen_productos.id_clasificacion = clasificacion.idClasificacion
        INNER JOIN {$this->bd}pedido_productos ON pedido_productos.id_productos = almacen_productos.idAlmacen

            where id_folio = ? ORDER BY idListaProductos desc
        ";

        return $this->_Read($sql, $array);

    }

    function getCustomerProduct($array){

        $sql = "
          SELECT
                pedidopersonalizado.idpersonalizado,
                pedidopersonalizado.descripcion,
                pedidopersonalizado.total,
                pedidopersonalizado.relleno,
                pedidopersonalizado.leyenda,
                pedidopersonalizado.observaciones,
                pedidopersonalizado.importeBase,
                pedidopersonalizado.importeOblea,
                pedidopersonalizado.saborPan
            FROM
            {$this->bd}pedidopersonalizado
            WHERE id_pedidoproducto = ?
        ";

        return $this->_Read($sql, $array)[0];

    }

    function removeProducts($array){
        $query = "
            DELETE FROM {$this->bd}pedido_productos
            WHERE idListaProductos = ?
        ";

        return $this->_CUD($query, $array);
    }

    function updateClasificacion($array) {

        return $this->_Update([
            'table'  => "{$this->bd}almacen_productos",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    // Products.
    function listProduction($array){
        $query = "
            SELECT
                idAlmacen,
                almacen_productos.NombreProducto,
                almacen_productos.Area,
                NotFoundReceta,
                sugerencia,
                diasMerma,
                id_clasificacion,
                lunes as dia,
                estadoProducto,
                id_Costsys,
               
                price
            FROM
                {$this->bd}almacen_productos
            LEFT JOIN {$this->bd}homologado
                ON homologado.id_Produccion = almacen_productos.idAlmacen
            WHERE
                Area = ? AND estadoProducto = ?
            ORDER BY
                idAlmacen DESC
        ";

        return $this->_Read($query, $array);

    }

    function existsProductoByName($array) {
        $query = "
            SELECT idAlmacen as id
            FROM {$this->bd}almacen_productos
            WHERE LOWER(NombreProducto) = LOWER(?)
            AND estadoProducto = 1
        ";

        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    function createProduct($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'almacen_productos',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function getOrderImagesById($array) {
        $query = "
            SELECT 
                pf.idLista AS id,
                pf.folio,
                c.Name_Cliente AS cliente,
                pf.fechapedido AS fecha_entrega,
                pf.Status AS estado,
                'Local' AS canal,
                pf.Total AS price,
                pp.name,
                pp.imageCatalog AS reference_image,
                pp.image AS production_image,
                pp.portion,
                pp.costo,
                pf.anticipo,
                pf.observacion,
                TIME_FORMAT(pf.horapedido, '%h:%i %p') AS horapedido
            FROM {$this->bd}pedidofolio pf
            INNER JOIN {$this->bd}clientes c ON pf.id_cliente = c.idCliente
            LEFT JOIN {$this->bd}pedido_productos pp ON pf.idLista = pp.id_folio
            WHERE pf.idLista = ?
            LIMIT 1
        ";
        
        $result = $this->_Read($query, $array);
        return !empty($result) ? $result[0] : null;
    }




}

class listPedidos extends Pedidos {

    function list_ticket($array) {
        $fechaCampo = isset($array['tipo']) && $array['tipo'] === 'entrega' ? 'fechapedido' : 'foliofecha';

        $sql  = "
            SELECT
                pedidofolio.idLista as id,
                pedidofolio.folio,
                clientes.Name_Cliente,
                pedidofolio.encargado,
                pedidofolio.Status,
                pedidofolio.Total,
                DATE_FORMAT(foliofecha,'%Y-%m-%d') as foliofecha,
                fechapedido,
                efectivo,
                tdc,
                anticipo,
                discount,
                discount_percent,
                whatsapp
            FROM
                {$this->bd}pedidofolio
            INNER JOIN {$this->bd}clientes ON pedidofolio.id_cliente = clientes.idCliente
            WHERE DATE_FORMAT($fechaCampo,'%Y-%m-%d') BETWEEN ? AND ?
            AND Status IN (2, 4, 5)
            ORDER BY " . ($fechaCampo === 'fechapedido' ? 'fechapedido' : 'idLista') . " DESC
        ";

        return $this->_Read($sql, [$array['fi'], $array['ff']]);
    }

    function list_pedidos($array) {


      $sql  = "
            SELECT
                pedidofolio.idLista as id,
                pedidofolio.folio,
                clientes.Name_Cliente,
                pedidofolio.encargado,
                pedidofolio.Status,
                pedidofolio.Total,
                pedidofolio.foliofecha,
                pedidofolio.observacion,
                fechapedido,
                TIME_FORMAT(pedidofolio.horapedido, '%h:%i %p') AS horapedido,
                anticipo
            FROM
                {$this->bd}pedidofolio
            INNER JOIN {$this->bd}clientes ON pedidofolio.id_cliente = clientes.idCliente

            WHERE DATE_FORMAT(foliofecha,'%Y-%m-%d') Between  ? and ?

            AND Status IN (2,4,5)

            order by idLista desc
        ";

        return   $this->_Read($sql, $array);
    }


}

?>
