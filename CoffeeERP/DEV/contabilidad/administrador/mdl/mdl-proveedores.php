<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_contabilidad.";
    }

    function listProveedores($array) {
        return $this->_Select([
            'table'  => $this->bd . 'proveedores',
            'values' => "
                id,
                nombre,
                rfc,
                telefono,
                email,
                direccion,
                DATE_FORMAT(fecha_creacion, '%d/%m/%Y') AS fecha_creacion,
                activo
            ",
            'where'  => 'activo = ?',
            'order'  => ['DESC' => 'id'],
            'data'   => $array
        ]);
    }

    function getProveedorById($id) {
        return $this->_Select([
            'table'  => $this->bd . 'proveedores',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
        ])[0];
    }

    function createProveedor($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'proveedores',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateProveedor($array) {
        return $this->_Update([
            'table'  => $this->bd . 'proveedores',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function existsProveedorByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}proveedores
            WHERE LOWER(nombre) = LOWER(?)
            AND activo = 1
        ";
        
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    function existsOtherProveedorByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}proveedores
            WHERE LOWER(nombre) = LOWER(?)
            AND id != ?
            AND activo = 1
        ";
        
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }
}
