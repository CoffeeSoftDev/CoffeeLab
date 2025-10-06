<?php
require_once('../../../conf/_CRUD.php');

Class Desplazamiento extends CRUD {
    // SELECTS
    function udn_select() {
        $query ="SELECT idUDN AS id, UDN AS valor FROM udn WHERE Stado = 1 AND idUDN != 10 AND idUDN != 8 ORDER BY Antiguedad ASC";
        return $this->_Read($query, null);

    }
    function selectGroups($array) {
        $query = "SELECT
                        idgrupo AS id,
                        grupoproductos AS nombre
                    FROM
                        rfwsmqex_gvsl_finanzas.soft_grupoproductos
                    WHERE
                        id_udn = ? 
                    ORDER BY
                        grupoproductos ASC";
        return $this->_Read($query, $array);
    }
    function selectProduct($array) {
        $query = "SELECT
                        id_Producto AS id,
                        clave_producto AS clave,
                        descripcion AS nombre,
                        activo_soft AS estado
                    FROM
                        rfwsmqex_gvsl_finanzas.soft_productos 
                    WHERE
                        id_grupo_productos = ?
                    ORDER BY
                        nombre ASC";
        return $this->_Read($query, $array);
    }
    function selectPaquetes($array){
        $query = "SELECT
                    p.id_Producto AS id,
                    p.descripcion AS producto,
                    spp.costo_producto AS precio 
                FROM
                    rfwsmqex_gvsl_finanzas.soft_paquetes_productos spp
                    JOIN rfwsmqex_gvsl_finanzas.soft_productos p ON spp.id_producto = p.id_Producto
                    JOIN rfwsmqex_gvsl_finanzas.soft_paquetes paq ON spp.id_paquete = paq.idpaquete 
                WHERE
                    paq.descripcion = ? 
                ORDER BY
                    p.descripcion ASC";
        return $this->_Read($query,$array);
    }

    // SOFT
    function grupo_productos($array) {
        $query = "SELECT
                        idgrupo,
                        grupoproductos 
                    FROM
                        rfwsmqex_gvsl_finanzas.soft_grupoproductos
                    WHERE
                        id_udn = ? 
                    ORDER BY
                        grupoproductos ASC";
        return $this->_Read($query, $array);
    }
    // function count_soft($array) {
    //     $query = "SELECT activo_soft
    //     FROM soft_productos
    //     INNER JOIN rfwsmqex_gvsl_finanzas.soft_grupoproductos ON idgrupo = id_grupo_productos
    //     WHERE rfwsmqex_gvsl_finanzas.soft_grupoproductos.id_udn = ?
    //     ORDER BY rfwsmqex_gvsl_finanzas.soft_grupoproductos.grupoproductos ASC";
    //     return $this->_Read($query, $array);
    // }
    function mostrar_productos_soft($array) {
        $query = "SELECT
                        id_Producto,
                        clave_producto,
                        descripcion AS descripcionP,
                        activo_soft 
                    FROM
                        rfwsmqex_gvsl_finanzas.soft_productos 
                    WHERE
                        id_grupo_productos = ?
                    ORDER BY
                        descripcionP ASC";
        return $this->_Read($query, $array);
    }
    function homologados_soft($array) {
        $existe_producto = "<label class='text-danger'>No encontrado</label>";
        $query = "SELECT        
                        soft_productos.descripcion as descripcion,
                        recetas.nombre as nombre
                    FROM
                        rfwsmqex_gvsl_finanzas.soft_costsys
                        INNER JOIN rfwsmqex_gvsl_finanzas.soft_productos ON id_Producto = id_soft_productos
                        INNER JOIN rfwsmqex_gvsl_costsys.recetas ON idReceta = id_costsys_recetas 
                    WHERE
                        id_soft_productos = ? 
                    ORDER BY
                        id_soft_productos ASC";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $existe_producto = $key['nombre'];
        }
        return $existe_producto;
    }
    function paquetes($array) {
        $query = "SELECT
                        p.id_Producto AS id,
                        p.descripcion AS producto,
                        spp.costo_producto AS precio 
                    FROM
                        soft_paquetes_productos spp
                        JOIN soft_productos p ON spp.id_producto = p.id_Producto
                        JOIN soft_paquetes paq ON spp.id_paquete = paq.idpaquete 
                    WHERE
                        paq.descripcion = ? 
                    ORDER BY
                        p.descripcion ASC";
        return $this->_Read($query, $array);
    }
    function paquetes_precios($array) {
        $query = "SELECT SUM(spp.costo_producto) AS suma
        FROM soft_paquetes_productos spp
        JOIN soft_productos p ON spp.id_producto = p.id_Producto
        JOIN soft_paquetes paq ON spp.id_paquete = paq.idpaquete
        WHERE paq.descripcion = ?
        ORDER BY p.descripcion ASC";
        return $this->_Read($query, $array);
    }
}










































































// // COSTSYS
// function grupo_costsys($array)
// {
//     $query = "SELECT idClasificacion, Clasificacion AS nameSubclasificacion 
//     FROM clasificacion
//     WHERE id_UDN = ?
//     ORDER BY Clasificacion ASC";
//     $sql = $this->_Select($query, $array, "8");
//     return $sql;
// }
// function count_costsys($array)
// {
//     $query = "SELECT idReceta FROM recetas
//     INNER JOIN clasificacion ON idClasificacion =id_Clasificacion
//     WHERE clasificacion.id_UDN = ?
//     ORDER BY recetas.nombre ASC";
//     $sql = $this->_Select($query, $array, "8");
//     return $sql;
// }
// function mostrar_productos_costsys($array)
// {
//     $query = "SELECT idReceta, nombre AS nameReceta, id_Estado FROM recetas
//     WHERE id_Clasificacion = ?
//     ORDER BY recetas.nombre ASC";
//     $sql = $this->_Select($query, $array, "8");
//     return $sql;
// }
// function homologados_costsys($array)
// {
//     $existe_producto = "<label class='text-danger'>No encontrado</label>";
//     $query = "SELECT soft_productos.descripcion, recetas.nombre 
//     FROM soft_costsys
//     INNER JOIN soft_productos ON id_Producto = id_soft_productos
//     INNER JOIN rfwsmqex_gvsl_costsys.recetas ON idReceta = id_costsys_recetas
//     WHERE id_costsys_recetas = ?
//     ORDER BY id_costsys_recetas ASC";
//     $sql = $this->_Select($query, $array, "5");
//     foreach ($sql as $key) {
//         $existe_producto = $key[1];
//     }
//     return $existe_producto;
// }
?>