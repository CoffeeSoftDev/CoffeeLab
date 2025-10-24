<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "[name_bd].";
    }

    // Módulos Desbloqueados

    function listModulesUnlocked($array) {
        $leftjoin = [
            $this->bd . 'udn' => 'module_unlock.udn_id = udn.idUDN',
            $this->bd . 'module' => 'module_unlock.module_id = module.id'
        ];

        return $this->_Select([
            'table' => $this->bd . 'module_unlock',
            'values' => "
                module_unlock.id,
                udn.UDN as udn_name,
                module.name as module_name,
                DATE_FORMAT(module_unlock.unlock_date, '%d/%m/%Y') as unlock_date_formatted,
                module_unlock.lock_reason,
                module_unlock.active,
                module_unlock.operation_date
            ",
            'leftjoin' => $leftjoin,
            'where' => 'module_unlock.active = ?',
            'order' => ['DESC' => 'module_unlock.unlock_date'],
            'data' => $array
        ]);
    }

    function getUnlockRequestById($id) {
        return $this->_Select([
            'table' => $this->bd . 'module_unlock',
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ])[0];
    }

    function existsActiveUnlock($array) {
        $query = "
            SELECT id
            FROM {$this->bd}module_unlock
            WHERE udn_id = ?
            AND module_id = ?
            AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return count($result) > 0;
    }

    function createUnlockRequest($array) {
        return $this->_Insert([
            'table' => $this->bd . 'module_unlock',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateModuleStatus($array) {
        return $this->_Update([
            'table' => $this->bd . 'module_unlock',
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Horarios de Cierre

    function listCloseTime() {
        return $this->_Select([
            'table' => $this->bd . 'close_time',
            'values' => "
                id,
                month,
                TIME_FORMAT(close_time, '%H:%i') as close_time_formatted,
                close_time,
                updated_at,
                updated_by
            ",
            'order' => ['ASC' => 'month']
        ]);
    }

    function updateCloseTimeByMonth($array) {
        return $this->_Update([
            'table' => $this->bd . 'close_time',
            'values' => $array['values'],
            'where' => 'month = ?',
            'data' => $array['data']
        ]);
    }

    // Listas para Filtros

    function lsUDN() {
        return $this->_Select([
            'table' => $this->bd . 'udn',
            'values' => 'idUDN as id, UDN as valor',
            'where' => 'Estado = 1',
            'order' => ['ASC' => 'UDN']
        ]);
    }

    function lsModules() {
        return $this->_Select([
            'table' => $this->bd . 'module',
            'values' => 'id, name as valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }
}
