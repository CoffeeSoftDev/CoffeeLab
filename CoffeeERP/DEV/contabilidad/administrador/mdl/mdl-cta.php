<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "erp_varoch.";
    }

    function lsUDN() {
        return $this->_Select([
            'table'  => "{$this->bd}udn",
            'values' => "id, nombre AS valor",
            'where'  => 'active = ?',
            'order'  => ['ASC' => 'nombre'],
            'data'   => [1]
        ]);
    }

    function listMayorAccount($array) {
        $leftjoin = [
            $this->bd . 'udn' => 'mayor_account.udn_id = udn.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'mayor_account',
            'values'   => "
                mayor_account.id,
                mayor_account.name,
                mayor_account.active,
                udn.nombre AS udn_name,
                DATE_FORMAT(mayor_account.date_creation, '%d %M %Y') as date_creation
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'mayor_account.udn_id = ?',
            'order'    => ['DESC' => 'mayor_account.id'],
            'data'     => $array
        ]);
    }

    function getMayorAccountById($array) {
        $leftjoin = [
            $this->bd . 'udn' => 'mayor_account.udn_id = udn.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'mayor_account',
            'values'   => "
                mayor_account.*,
                udn.nombre AS udn_name
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'mayor_account.id = ?',
            'data'     => $array
        ])[0];
    }

    function existsMayorAccountByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}mayor_account
            WHERE LOWER(name) = LOWER(?)
            AND udn_id = ?
            AND active = 1
        ";

        $exists = $this->_Read($query, $array);
        return count($exists);
    }

    function createMayorAccount($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'mayor_account',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateMayorAccount($array) {
        return $this->_Update([
            'table'  => $this->bd . 'mayor_account',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function listSubAccount($array) {
        $leftjoin = [
            $this->bd . 'mayor_account' => 'sub_account.mayor_account_id = mayor_account.id',
            $this->bd . 'udn' => 'sub_account.udn_id = udn.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'sub_account',
            'values'   => "
                sub_account.id,
                sub_account.name,
                sub_account.active,
                mayor_account.name AS mayor_account_name,
                DATE_FORMAT(sub_account.date_creation, '%d %M %Y') as date_creation
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'sub_account.udn_id = ?',
            'order'    => ['DESC' => 'sub_account.id'],
            'data'     => $array
        ]);
    }

    function listPurchaseType($array) {
        return $this->_Select([
            'table'  => $this->bd . 'purchase_type',
            'values' => "
                id,
                name,
                description,
                active,
                DATE_FORMAT(date_creation, '%d %M %Y') as date_creation
            ",
            'where'  => 'udn_id = ?',
            'order'  => ['DESC' => 'id'],
            'data'   => $array
        ]);
    }

    function listPaymentMethod($array) {
        return $this->_Select([
            'table'  => $this->bd . 'payment_method',
            'values' => "
                id,
                name,
                description,
                active,
                DATE_FORMAT(date_creation, '%d %M %Y') as date_creation
            ",
            'where'  => 'udn_id = ?',
            'order'  => ['DESC' => 'id'],
            'data'   => $array
        ]);
    }
}
