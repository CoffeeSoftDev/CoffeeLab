<?php
require_once '../../../conf/_CRUD.php';

class Administracion extends CRUD
{
    private $bd;

    public function __construct()
    {
        $this->bd = "rfwsmqex_gvsl_finanzas.";
    }

    public function lsUDN()
    {
        $query = "
        SELECT
        idUDN AS id,
        UDN AS valor
        FROM udn WHERE Stado = 1 AND idUDN != 10 AND idUDN != 8";
        return $this->_Read($query, null);
    }

    public function get_Categoria($array)
    {
        $query = "
            SELECT
            soft_grupoproductos.grupoproductos,
            soft_grupoproductos.idgrupo
            FROM rfwsmqex_gvsl_finanzas.soft_grupoproductos
            WHERE idgrupo = ?

        ";
        $ls = $this->_Read($query, $array);
        foreach ($ls as $key) {
            $categoria = $key['grupoproductos'];
        }

        return $categoria;
    }

    public function actualizar_registro($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}soft_productos",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data'],
        ]);
    }

    public function updateGroup($array)
    {
        $query = '
        UPDATE
        rfwsmqex_gvsl_finanzas.soft_productos
        SET id_grupo_productos   = ?
        WHERE  id_Producto = ? ';

        return $this->_CUD($query, $array);
    }

    public function PRODUCTOS_VENDIDOS($array)
    {
        $sql = '';

        $query = '
        SELECT
        idAlmacen,
        almacen_productos.NombreProducto,
        almacen_productos.Area,
        listaproductos.idListaProductos,
        lista_productos.foliofecha,
        almacen_productos.sugerencia,
        SUM(cantidad) AS CANT,
        costo,
        almacen_productos.estadoProducto
        FROM

        rfwsmqex_gvsl_produccion.listaproductos

        INNER JOIN rfwsmqex_gvsl_produccion.almacen_productos ON listaproductos.id_productos = almacen_productos.idAlmacen
        INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
        WHERE MONTH(foliofecha) = ?
        AND   YEAR(foliofecha)  = ?
        AND Area = ? AND id_tipo = 1
        GROUP BY NombreProducto
        order by NombreProducto asc

        ';

        return $this->_Read($query, $array);

    }

    public function get_cantidad_erp($array)
    {
        $cant = 0;

        $query = "
        SELECT
        listaproductos.cantidad,
        listaproductos.id_productos,
        lista_productos.foliofecha
        FROM
        rfwsmqex_gvsl_produccion.listaproductos
        INNER JOIN rfwsmqex_gvsl_produccion.lista_productos ON listaproductos.id_lista = lista_productos.idLista
        WHERE id_productos = ?

        AND MONTH(foliofecha) = 02
        AND YEAR(foliofecha) = 2024

    ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $cant = $cant + $key['cantidad'];
        }

        return $cant;
    }

    public function lsGrupo($array)
    {

        $query = "
    SELECT
      idgrupo as id,
      descripcion as valor
    FROM
        rfwsmqex_gvsl_finanzas.soft_grupoc_erp
    WHERE id_udn = ?";

        return $this->_Read($query, $array);
    }

    public function lsGrupoFogaza($array)
    {

        $query = "
  SELECT
      idClasificacion as id,
      Clasificacion as valor
    FROM
        rfwsmqex_gvsl_costsys.clasificacion
    WHERE id_udn = ?
    and idClasificacion != 12
    and idClasificacion != 7
    and idClasificacion != 9
    and idClasificacion != 41

    ";

        return $this->_Read($query, $array);
    }

    public function select_list_grupo($array)
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

    WHERE id_udn = ? and id_grupo_erp = ?

    ";

        return $this->_Read($query, $array);
    }

    public function select_list_grupo_sn($array)
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

        WHERE id_udn = ?

        ";

        return $this->_Read($query, $array);
    }

    public function productos_softrestaurant($array)
    {
        $query = "
        SELECT
        soft_productos.id_Producto as id,
        soft_productos.clave_producto,
        soft_productos.descripcion,
        soft_productos.id_grupoc,
        DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,
        soft_productos.costo,
        soft_productos.id_grupo_productos,
        soft_productos.activo_soft,
        soft_grupoproductos.idgrupo,
        soft_grupoproductos.grupoproductos
        FROM
        rfwsmqex_gvsl_finanzas.soft_productos
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_grupoproductos ON soft_productos.id_grupo_productos = soft_grupoproductos.idgrupo

        WHERE rfwsmqex_gvsl_finanzas.soft_productos.id_udn = ?
        ORDER BY fecha desc
    ";

        return $this->_Read($query, $array);
    }

    public function SELECT_PRODUCTOS_x_SOFT($array)
    {
        $query = "
    SELECT
        soft_productos.id_Producto,
        soft_productos.clave_producto,
        soft_productos.descripcion,

        id_grupoc,
        soft_productos.id_udn,
        soft_productos.status,

        soft_productos.id_costsys,
        DATE_FORMAT(fecha,'%Y-%m-%d') as dat,
    soft_productos.costo
    FROM
    rfwsmqex_gvsl_finanzas.soft_productos
    WHERE soft_productos.id_udn = ? and id_grupo_productos = ?
    --    and activo_soft = 1

    ORDER BY descripcion asc
    ";

        return $this->_Read($query, $array);
    }

    public function SELECT_PRODUCTOS_x_COSTSYS($array)
    {

        $query = "
    SELECT
        idReceta,
        recetas.folio,
        recetas.nombre,
        clasificacion.Clasificacion,
        precioVenta as costo,
        DATE_FORMAT(fecha,'%Y-%m-%d') as fecha,
        id_Estado,
        id_SubClasificacion
    FROM
        rfwsmqex_gvsl_costsys.recetas
    INNER JOIN rfwsmqex_gvsl_costsys.clasificacion
    ON recetas.id_Clasificacion = clasificacion.idClasificacion

    WHERE recetas.id_UDN = ? and id_Clasificacion = ?
    ORDER BY fecha desc
    ";

        return $this->_Read($query, $array);
    }

    public function _SELECT_FROM_COSTSYS_FZ($array)
    {

        $query = "
    SELECT
        idReceta,
        recetas.folio,
        recetas.nombre,
        clasificacion.Clasificacion,
        precioVenta as costo,
        DATE_FORMAT(fecha,'%Y-%m-%d') as fecha,
        id_Estado,
        id_SubClasificacion
    FROM
        rfwsmqex_gvsl_costsys.recetas
    INNER JOIN rfwsmqex_gvsl_costsys.clasificacion
    ON recetas.id_Clasificacion = clasificacion.idClasificacion

    WHERE recetas.id_UDN = ?
    ORDER BY fecha desc
    ";

        return $this->_Read($query, $array);
    }

    public function _SET_NOMBRE_COSTSYS($array)
    {

        $query = "
    SELECT
    rfwsmqex_gvsl_produccion.homologado.idHomologado,
    rfwsmqex_gvsl_produccion.almacen_productos.NombreProducto,
    estadoProducto,
    almacen_productos.idAlmacen,
    homologado.descripcion
    FROM
    rfwsmqex_gvsl_produccion.almacen_productos
    INNER JOIN rfwsmqex_gvsl_produccion.homologado ON
    rfwsmqex_gvsl_produccion.homologado.id_Produccion = rfwsmqex_gvsl_produccion.almacen_productos.idAlmacen
    WHERE id_Costsys = ?

    ";

        return $this->_Read($query, $array);
    }

    public function select_homologar($array)
    {
        $query = "
    SELECT
    *
    FROM
    rfwsmqex_gvsl_finanzas.soft_costsys
    WHERE id_soft_productos = ? ";

        return $this->_Read($query, $array);
    }

    public function cb_producto_costsys($array)
    {
        $query = "
    SELECT
        idReceta,nombre,precioVenta
    FROM
        rfwsmqex_gvsl_costsys.recetas WHERE id_UDN = ?
        order by id_Subclasificacion desc
    ";

        return $this->_Read($query, $array);
    }

    public function productos_homologados_soft($array)
    {
        $query = "SELECT
        soft_productos.descripcion,
        soft_costsys.id_soft_productos,
        soft_costsys.id_costsys_recetas,
        soft_productos.id_grupo_productos,
        soft_grupoproductos.grupoproductos
        FROM
        rfwsmqex_gvsl_finanzas.soft_costsys
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_productos ON soft_costsys.id_soft_productos = soft_productos.id_Producto
        INNER JOIN rfwsmqex_gvsl_finanzas.soft_grupoproductos ON soft_productos.id_grupo_productos = soft_grupoproductos.idgrupo
        WHERE soft_productos.id_udn = ? and id_grupo_productos = ?";

        return $this->_Read($query, $array);
    }

    public function consultar_grupo_erp($array)
    {
        $nombre_grupo = 'SIN GRUPO';
        $query = "
    SELECT
    *
    FROM
    rfwsmqex_gvsl_finanzas.soft_grupoc_erp
    WHERE idgrupo = ? ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $nombre_grupo = $key['descripcion'];
        }
        return $nombre_grupo;
    }

    public function get_producto_nombre($array)
    {
        $id_Producto = 0;
        $clave_producto = 0;

        $query =
            "
        SELECT
        id_Producto,
        clave_producto,
        descripcion,
        id_grupo_productos

        FROM
        rfwsmqex_gvsl_finanzas.soft_productos
        WHERE descripcion = ? and id_udn = ? and activo_soft = 1

        ";

        $sql = $this->_Read($query, $array);
        return $sql;
    }

    public function getGroupName($array)
    {
        $name = '';

        $query = '

            SELECT grupoproductos
            FROM rfwsmqex_gvsl_finanzas.soft_grupoproductos
            WHERE idgrupo = ?

       ';

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {

            $name = $key['grupoproductos'];

        }

        return $name;
    }

    public function get_producto_cp($array)
    {
        $query =
            "
    SELECT
        precioventa,
        desplazamiento,
        fecha_costo
    FROM
    rfwsmqex_gvsl_costsys.costopotencial
    WHERE receta = ? and MONTH(fecha_costo) = ? AND YEAR(fecha_costo) = ?
    ";
        $sql = $this->_Read($query, $array);
        return $sql;
    }

    public function select_grupo($array)
    {

        $id_grupo = '<i class="text-danger  icon-flag"></i> not found';

        $query = "
        SELECT
            soft_grupoproductos.idgrupo,
            soft_grupoproductos.grupoproductos,
            soft_grupoproductos.clavegrupo,
            soft_grupoproductos.id_udn

        FROM
        rfwsmqex_gvsl_finanzas.soft_grupoproductos

        WHERE grupoproductos = ? and id_udn = ?

        ";

        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $id_grupo = $key['idgrupo'];
        }

        return $id_grupo;
    }

    public function add_producto_soft($array)
    {
        $query =
            "INSERT INTO
    rfwsmqex_gvsl_finanzas.soft_productos
    (clave_producto,
    descripcion,
    id_udn,
    activo_soft,
    fecha,
    id_grupo_productos
    )
    VALUES(?,?,?,?,?,?)";

        return $this->_CUD($query, $array);
    }

    public function consultar_subcategoria_costsys($array)
    {
        $nombre_grupo = '';

        $query = "
    SELECT
    *
    FROM
    rfwsmqex_gvsl_costsys.subclasificacion
    WHERE idSubClasificacion = ? ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $nombre_grupo = $key['nombre'];
        }
        return $nombre_grupo;
    }

    public function __get_id_area($array)
    {
        $__getter = 0;

        $query = "
    SELECT
    idArea
    FROM
    rfwsmqex_gvsl_produccion.almacen_area
    WHERE Nombre_Area = ?

    ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $__getter = $key['idArea'];
        }

        return $__getter;
    }

    public function CrearProducto($array)
    {
        $query =
            "INSERT INTO
    rfwsmqex_gvsl_produccion.almacen_productos
    (Area,FechaIngreso,NombreProducto,estadoProducto)
    VALUES(?,?,?,?)";

        return $this->_CUD($query, $array);
    }

    public function __get_id_producto($array)
    {
        $__getter = 0;

        $query = "
        SELECT
        idAlmacen
        FROM
        rfwsmqex_gvsl_produccion.almacen_productos
        WHERE  NombreProducto= ?
    ";

        $sql = $this->_Read($query, $array);

        foreach ($sql as $key) {
            $__getter = $key['idAlmacen'];
        }

        return $__getter;
    }

    public function mod_producto_softCost($array)
    {
        $query = '
        UPDATE
        rfwsmqex_gvsl_finanzas.soft_costsys
        SET id_costsys_recetas   = ?,
        fecha = ?
        WHERE  idhomologado = ? ';

        return $this->_CUD($query, $array);
    }

    public function crearVinculo($array)
    {
        $query = "INSERT INTO
        rfwsmqex_gvsl_produccion.homologado
        (id_Produccion, id_Costsys, descripcion)
        VALUES(?,?,?)";

        return $this->_CUD($query, $array);
    }

    public function enlace_costsys($array)
    {
        $query = "INSERT INTO
        rfwsmqex_gvsl_finanzas.soft_costsys
        (id_soft_productos, id_costsys_recetas, fecha)
        VALUES(?,?,?)";

        return $this->_CUD($query, $array);
    }

    public function add_soft($array)
    {

        return $this->_Insert([
            'table' => "{$this->bd}soft_productos",
            'values' => $array['values'],
            'data' => $array['data'],
        ]);
    }

}
