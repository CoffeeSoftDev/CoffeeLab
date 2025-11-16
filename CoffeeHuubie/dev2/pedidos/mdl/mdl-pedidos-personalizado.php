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

    function createOrderPackage($array){
        return $this->_Insert([
            'table'  => "{$this->bd}order_package",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }

}
?>
