<?php
require_once '../../../conf/_CRUD.php';
require_once '../../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_contabilidad.";
    }

    // Módulos Desbloqueados

    function listModulesUnlocked($array) {
        $query = "
          SELECT 
                module_unlock.id,
                module_unlock.udn_id,
                module_unlock.module_id,
                udn.UDN as udn_name,
                module.name as module_name,
                module_unlock.unlock_date,
                module_unlock.lock_date,
                module_unlock.lock_reason,
                module_unlock.operation_date,
                module_unlock.active
            FROM {$this->bd}module_unlock
            LEFT JOIN udn ON module_unlock.udn_id = udn.idUDN
            LEFT JOIN {$this->bd}module ON module_unlock.module_id = module.id
            WHERE module_unlock.active = 1
            ORDER BY module_unlock.unlock_date DESC
        ";
        
        return $this->_Read($query, null);
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
            'where' => 'id = ?',
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
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsModules() {
        return $this->_Select([
            'table' => $this->bd . 'module',
            'values' => 'id, name as valor, description',
            'where' => 'active = 1',
            'order' => ['ASC' => 'name']
        ]);
    }
}
