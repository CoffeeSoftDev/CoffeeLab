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

    // Cash Concepts

    function listConceptos($array) {
        return $this->_Select([
            'table'  => $this->bd . 'cash_concept',
            'values' => "
                id,
                name,
                operation_type,
                description,
                active,
                DATE_FORMAT(date_creation, '%d/%m/%Y') as date_creation
            ",
            'where'  => 'udn_id = ? AND active = ?',
            'order'  => ['DESC' => 'id'],
            'data'   => $array
        ]);
    }

    function getConceptoById($id) {
        return $this->_Select([
            'table'  => $this->bd . 'cash_concept',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
        ])[0];
    }

    function createConcepto($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'cash_concept',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateConcepto($array) {
        return $this->_Update([
            'table'  => $this->bd . 'cash_concept',
            'values' => $array['values'],
            'where'  => 'id = ?',
            'data'   => $array['data']
        ]);
    }

    function existsConceptoByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}cash_concept
            WHERE LOWER(name) = LOWER(?)
            AND udn_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    // Cash Movements

    function listMovimientos($array) {
        $leftjoin = [
            $this->bd . 'cash_concept' => 'cash_movement.concept_id = cash_concept.id',
            $this->bd . 'users' => 'cash_movement.user_id = users.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'cash_movement',
            'values'   => "
                cash_movement.id,
                cash_movement.movement_type,
                cash_movement.amount,
                cash_movement.description,
                cash_concept.name as concept_name,
                cash_concept.operation_type,
                users.name as user_name,
                DATE_FORMAT(cash_movement.date_creation, '%d/%m/%Y %H:%i') as date_creation,
                cash_movement.active
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'cash_movement.udn_id = ? AND cash_movement.active = ?',
            'order'    => ['DESC' => 'cash_movement.id'],
            'data'     => $array
        ]);
    }

    function getMovimientoById($id) {
        return $this->_Select([
            'table'  => $this->bd . 'cash_movement',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
        ])[0];
    }

    function createMovimiento($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'cash_movement',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateMovimiento($array) {
        return $this->_Update([
            'table'  => $this->bd . 'cash_movement',
            'values' => $array['values'],
            'where'  => 'id = ?',
            'data'   => $array['data']
        ]);
    }

    function getAvailableAmount($udn_id) {
        $query = "
            SELECT 
                COALESCE(SUM(
                    CASE 
                        WHEN movement_type = 'entrada' THEN amount
                        WHEN movement_type = 'salida' THEN -amount
                        ELSE 0
                    END
                ), 0) as available_amount
            FROM {$this->bd}cash_movement
            WHERE udn_id = ?
            AND active = 1
        ";
        
        $result = $this->_Read($query, [$udn_id]);
        return $result[0]['available_amount'] ?? 0;
    }

    // Cash Closure

    function createClosure($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'cash_closure',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function getLastClosure($udn_id) {
        return $this->_Select([
            'table'  => $this->bd . 'cash_closure',
            'values' => '*',
            'where'  => 'udn_id = ?',
            'order'  => ['DESC' => 'closure_date'],
            'limit'  => 1,
            'data'   => [$udn_id]
        ]);
    }

    function lockMovements($udn_id) {
        $query = "
            UPDATE {$this->bd}cash_movement
            SET active = 0
            WHERE udn_id = ?
            AND active = 1
        ";
        return $this->_Execute($query, [$udn_id]);
    }

    // Filter Data

    function lsUDN() {
        return $this->_Select([
            'table'  => $this->bd . 'udn',
            'values' => 'id, name as valor',
            'where'  => 'active = 1',
            'order'  => ['ASC' => 'name']
        ]);
    }

    function lsOperationType() {
        return [
            ['id' => 'suma', 'valor' => 'Suma (Entrada)'],
            ['id' => 'resta', 'valor' => 'Resta (Salida)']
        ];
    }

    function lsMovementType() {
        return [
            ['id' => 'entrada', 'valor' => 'Entrada'],
            ['id' => 'salida', 'valor' => 'Salida']
        ];
    }

    function lsStatus() {
        return [
            ['id' => '1', 'valor' => 'Activo'],
            ['id' => '0', 'valor' => 'Inactivo']
        ];
    }

    function lsConceptsByUdn($udn_id) {
        return $this->_Select([
            'table'  => $this->bd . 'cash_concept',
            'values' => 'id, name as valor',
            'where'  => 'udn_id = ? AND active = 1',
            'order'  => ['ASC' => 'name'],
            'data'   => [$udn_id]
        ]);
    }
}
