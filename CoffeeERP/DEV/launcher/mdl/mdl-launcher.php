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

    // Modules

    function listModules($array) {
        return $this->_Select([
            'table'  => "{$this->bd}modulos",
            'values' => "
                idModulo as id,
                modulo as name,
                mod_descripcion as description,
                mod_icono as icon,
                mod_color as icon_color,
                mod_ruta as url,
                mod_badge as status,
                mod_orden as order_index,
                mod_estado as active
            ",
            'where'  => 'mod_estado = ?',
            'order'  => ['ASC' => 'mod_orden'],
            'data'   => $array
        ]);
    }

    function getModulesByUser($array) {
        $query = "
            SELECT 
                m.idModulo as id,
                m.modulo as name,
                m.mod_descripcion as description,
                m.mod_icono as icon,
                m.mod_color as icon_color,
                m.mod_ruta as url,
                m.mod_badge as status,
                m.mod_orden as order_index,
                m.mod_estado as active
            FROM {$this->bd}modulos m
            WHERE m.mod_estado = 1
            ORDER BY m.mod_orden ASC
        ";
        
        return $this->_Read($query, $array);
    }

    function getModuleById($array) {
        return $this->_Select([
            'table'  => "{$this->bd}modulos",
            'values' => "
                idModulo as id,
                modulo as name,
                mod_descripcion as description,
                mod_icono as icon,
                mod_color as icon_color,
                mod_ruta as url,
                mod_badge as status,
                mod_orden as order_index,
                mod_estado as active
            ",
            'where'  => 'idModulo = ?',
            'data'   => $array
        ])[0] ?? null;
    }

    // Submodules

    function listSubmodulesByModule($array) {
        return $this->_Select([
            'table'  => "{$this->bd}submodulos",
            'values' => "
                idSubmodulo as id,
                submodulo as name,
                sub_ruta as url,
                sub_estado as active,
                sub_orden as order_index,
                sub_idModulo as module_id
            ",
            'where'  => 'sub_idModulo = ? AND sub_estado = ?',
            'order'  => ['ASC' => 'sub_orden'],
            'data'   => $array
        ]);
    }

    // Access Logs

    function createAccessLog($array) {
        return $this->_Insert([
            'table'  => "{$this->bd}modulos_access_logs",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function listAccessLogsByUser($array) {
        $query = "
            SELECT 
                l.id,
                l.user_id,
                l.module_id,
                l.access_date,
                l.ip_address,
                l.module_type,
                m.modulo as module_name
            FROM {$this->bd}modulos_access_logs l
            LEFT JOIN {$this->bd}modulos m ON l.module_id = m.idModulo AND l.module_type = 'modulo'
            WHERE l.user_id = ?
            ORDER BY l.access_date DESC
            LIMIT 50
        ";
        
        return $this->_Read($query, $array);
    }
}
