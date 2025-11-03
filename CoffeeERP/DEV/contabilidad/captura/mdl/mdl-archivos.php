<?php
require_once '../../../conf/_CRUD.php';
require_once '../../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_gvsl_finanzas2.";
    }

    function listFiles($array) {
        $where = '1=1';
        $data = [];

        if (!empty($array['fi']) && !empty($array['ff'])) {
            $where .= ' AND file.operation_date BETWEEN ? AND ?';
            $data[] = $array['fi'];
            $data[] = $array['ff'];
        }

        if (!empty($array['module'])) {
            $where .= ' AND file.module = ?';
            $data[] = $array['module'];
        }

        if (!empty($array['udn_id'])) {
            $where .= ' AND file.udn_id = ?';
            $data[] = $array['udn_id'];
        }

        $query = "
            SELECT 
                file.id,
                file.udn_id,
                file.file_name,
                file.upload_date,
                file.size_bytes,
                file.path,
                file.extension,
                file.operation_date,
                file.module,
                usuarios.usser as uploaded_by,
                udn.UDN as udn_name
            FROM {$this->bd}file
            LEFT JOIN usuarios ON file.user_id = usuarios.idUser
            LEFT JOIN udn ON file.udn_id = udn.idUDN
            WHERE {$where}
            ORDER BY file.upload_date DESC
        ";

        return $this->_Read($query, $data);
    }

    function getFileById($array) {
        $result = $this->_Select([
            'table' => $this->bd . 'file',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ]);
        
        return !empty($result) ? $result[0] : null;
    }

    function deleteFileById($array) {
        return $this->_Delete([
            'table' => $this->bd . 'file',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function createFileLog($array) {
        return $this->_Insert([
            'table' => $this->bd . 'file_logs',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function lsModules() {
        return [
            ['id' => 'Ventas', 'valor' => 'Ventas'],
            ['id' => 'Compras', 'valor' => 'Compras'],
            ['id' => 'Almacén', 'valor' => 'Almacén'],
            ['id' => 'Tesorería', 'valor' => 'Tesorería']
        ];
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function getUserLevel($array) {
        $result = $this->_Select([
            'table' => 'usuarios',
            'values' => 'usr_perfil',
            'where' => 'id = ?',
            'data' => $array
        ]);
        
        if (!empty($result)) {
            $perfil = $result[0]['usr_perfil'];
            if ($perfil == 1) return 3;
            if ($perfil == 2) return 2;
            return 1;
        }
        
        return 1;
    }

    function getFileCountsByModule() {
        $query = "
            SELECT 
                module,
                COUNT(*) as count
            FROM {$this->bd}file
            GROUP BY module
        ";
        
        $results = $this->_Read($query, []);
        
        $counts = [
            'total' => 0,
            'ventas' => 0,
            'compras' => 0,
            'almacen' => 0,
            'tesoreria' => 0
        ];
        
        if (is_array($results) && !empty($results)) {
            foreach ($results as $row) {
                $counts['total'] += $row['count'];
                
                switch ($row['module']) {
                    case 'Ventas':
                        $counts['ventas'] = $row['count'];
                        break;
                    case 'Compras':
                        $counts['compras'] = $row['count'];
                        break;
                    case 'Almacén':
                        $counts['almacen'] = $row['count'];
                        break;
                    case 'Tesorería':
                        $counts['tesoreria'] = $row['count'];
                        break;
                }
            }
        }
        
        return $counts;
    }
}
