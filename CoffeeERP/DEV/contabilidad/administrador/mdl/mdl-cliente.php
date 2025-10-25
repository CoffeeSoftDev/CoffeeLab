<?php
require_once '../../../conf/_CRUD.php';
require_once '../../../conf/_Utileria.php';


class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_contabilidad.";
    }

    function lsUDN() {
        return $this->_Select([
            'table'  => $this->bd . 'udn',
            'values' => 'id, valor',
            'where'  => 'active = ?',
            'order'  => ['ASC' => 'valor'],
            'data'   => [1]
        ]);
    }

    function listClientes($array) {
        
        $query = "
            SELECT 
                id, 
                name, 
                active, 
                DATE_FORMAT(date_create, '%d %M %Y') as date_create,
                udn_id
            FROM {$this->bd}customer
            WHERE active = ? AND udn_id = ?
            ORDER BY id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getClienteById($array) {
        return $this->_Select([
            'table'  => $this->bd . 'customer',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => $array
        ])[0];
    }

    function existsClienteByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}customer
            WHERE LOWER(name) = LOWER(?)
            AND udn_id = ?
            AND active = 1
        ";

        $exists = $this->_Read($query, $array);
        return count($exists);
    }

    function createCliente($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'customer',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateCliente($array) {
        return $this->_Update([
            'table'  => $this->bd . 'customer',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }
}
