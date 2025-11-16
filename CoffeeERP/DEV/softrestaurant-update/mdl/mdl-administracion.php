<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_softrestaurant.";
    }

    function lsUDN() {
        return $this->_Select([
            'table' => $this->bd . 'udn',
            'values' => 'id, nombre AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'nombre']
        ]);
    }

    function listProductos($array) {
        $leftjoin = [
            $this->bd . 'categorias' => 'productos.categoria_id = categorias.id'
        ];

        return $this->_Select([
            'table' => $this->bd . 'productos',
            'values' => 
                "productos.id,
                productos.nombre AS valor,
                productos.precio,
                productos.costo,
                productos.categoria_id,
                productos.udn,
                productos.imagen,
                productos.active,
                productos.fecha_creacion,
                productos.fecha_modificacion,
                categorias.nombre AS categoria",
            'leftjoin' => $leftjoin,
            'where' => 'productos.udn = ? AND productos.active = 1',
            'order' => ['DESC' => 'productos.id'],
            'data' => $array
        ]);
    }

    function getProductoById($array) {
        return $this->_Select([
            'table' => $this->bd . 'productos',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function existsProductoByName($array) {
        $query = "
            SELECT id 
            FROM {$this->bd}productos 
            WHERE LOWER(nombre) = LOWER(?) 
            AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return count($result) > 0;
    }

    function createProducto($array) {
        return $this->_Insert([
            'table' => $this->bd . 'productos',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateProducto($array) {
        return $this->_Update([
            'table' => $this->bd . 'productos',
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function lsCategorias($array = []) {
        return $this->_Select([
            'table' => $this->bd . 'categorias',
            'values' => 'id, nombre AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'nombre']
        ]);
    }

    function lsGrupo($array) {
        $leftjoin = [
            $this->bd . 'categorias' => 'productos.categoria_id = categorias.id'
        ];

        return $this->_Select([
            'table' => $this->bd . 'productos',
            'values' => 
                "productos.id,
                productos.nombre AS valor,
                productos.precio,
                productos.costo,
                productos.categoria_id,
                productos.imagen,
                categorias.nombre AS categoria",
            'leftjoin' => $leftjoin,
            'where' => 'productos.udn = ? AND productos.active = 1',
            'order' => ['ASC' => 'categorias.nombre', 'ASC' => 'productos.nombre'],
            'data' => $array
        ]);
    }

    function lsGrupoFogaza($array) {
        $leftjoin = [
            $this->bd . 'categorias' => 'productos.categoria_id = categorias.id'
        ];

        $where = 'productos.udn = 6 AND productos.active = 1';
        
        if (!empty($array[1])) {
            $where .= ' AND productos.categoria_id = ?';
        }

        return $this->_Select([
            'table' => $this->bd . 'productos',
            'values' => 
                "productos.id,
                productos.nombre AS valor,
                productos.precio,
                productos.costo,
                productos.categoria_id,
                productos.imagen,
                categorias.nombre AS categoria",
            'leftjoin' => $leftjoin,
            'where' => $where,
            'order' => ['ASC' => 'categorias.nombre', 'ASC' => 'productos.nombre'],
            'data' => !empty($array[1]) ? [$array[1]] : []
        ]);
    }
}
