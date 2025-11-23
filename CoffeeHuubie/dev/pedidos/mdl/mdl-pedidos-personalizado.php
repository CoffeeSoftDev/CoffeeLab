<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');

class OrderCustom extends CRUD {
    protected $util;
    protected $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd   = 'fayxzvov_coffee.';
    }

    // PEDIDOS PERSONALIZADOS --------------------------------
    public function getByIdCustomOrder($array) {
        return $this->_Select([
            'table' => "{$this->bd}order_custom",
            'values' => "*",
            'where' => "id = ?",
            'data' => $array
        ])[0];
    }

    function createCustomOrder($array){
        return $this->_Insert([
            'table'  => "{$this->bd}order_custom",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }

    function updateCustomOrder($array){
        return $this->_Update([
            'table'  => "{$this->bd}order_custom",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function deleteCustomOrder($array){
        return $this->_Delete([
            'table' => "{$this->bd}order_custom",
            'where' => $array['where'],
            'data'  => $array['data'],
        ]);
    }

    function maxCustomOrder(){
        return $this->_Select([
            'table' => "{$this->bd}order_custom",
            'values' => "MAX(id) as max_id",
        ])[0]['max_id'];
    }

    // ORDEN PAQUETE -----------------------------------------
    // Agregar a la orden el pastel personalizado.
    function createOrderPackage($array){
        return $this->_Insert([
            'table'  => "{$this->bd}order_package",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }

    // Actualizar orden paquete.
    function updateOrderPackage($array){
        return $this->_Update([
            'table'  => "{$this->bd}order_package",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    // Obtener el último id de orden paquete.
    function maxOrderPackage(){
        return $this->_Select([
            'table' => "{$this->bd}order_package",
            'values' => "MAX(id) as max_id",
        ])[0]['max_id'];
    }

    // PRODUCTOS DE MODIFICADOR ------------------------------
    // Crear producto de modificador.
    function createOrderModifierProduct($array){
        return $this->_Insert([
            'table'  => "{$this->bd}order_modifier_products",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }

    // Obtener el último id de producto de modificador.
    function maxOrderModifierProduct(){
        return $this->_Select([
            'table' => "{$this->bd}order_modifier_products",
            'values' => "MAX(id) as max_id",
        ])[0]['max_id'];
    }

    // PRODUCTOS EN EL PEDIDO PERSONALIZADO -----------------
    // Agregar producto al pedido personalizado
    function createProductInOrderCustom($array){
        return $this->_Insert([
            'table'  => "{$this->bd}order_custom_products",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }

    //IMÁGENES ----------------------------------------------
    function createOrderImages($array){
        return $this->_Insert([
            'table'  => "{$this->bd}order_images",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }
}
?>
