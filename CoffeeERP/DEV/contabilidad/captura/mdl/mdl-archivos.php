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

    function listFiles($array) {
        $where = 'files.active = 1';
        $data = [];

        // if (!empty($array['module'])) {
        //     $where .= ' AND files.description = ?';
        //     $data[] = $array['module'];
        // }

        // if (!empty($array['search'])) {
        //     $where .= ' AND files.file_name LIKE ?';
        //     $data[] = '%' . $array['search'] . '%';
        // }

        if (!empty($array['udn_id'])) {
            $where .= ' AND files.udn_id = ?';
            $data[] = $array['udn_id'];
        }

        $query = "
            SELECT 
                files.id,
                files.udn_id,
                files.src,
                files.file_name,
                files.description as module,
                files.date_created_at,
                COALESCE(users.nombre, 'Sistema') as uploaded_by,
                COALESCE(LENGTH(files.src), 0) as file_size
            FROM {$this->bd}files
            LEFT JOIN users ON files.udn_id = users.idUDN
            WHERE {$where}
            ORDER BY files.date_created_at DESC
        ";

        return $this->_Read($query, $data);
    }

    function getFileById($array) {
        return $this->_Select([
            'table' => $this->bd . 'files',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function deleteFileById($array) {
        return $this->_Delete([
            'table' => $this->bd . 'files',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function lsModules() {
        return [
            ['id' => 'Ventas', 'valor' => 'Ventas'],
            ['id' => 'Clientes', 'valor' => 'Clientes'],
            ['id' => 'Compras', 'valor' => 'Compras'],
            ['id' => 'Salidas de almacén', 'valor' => 'Salidas de almacén'],
            ['id' => 'Pagos a proveedor', 'valor' => 'Pagos a proveedor'],
            ['id' => 'Archivos', 'valor' => 'Archivos']
        ];
    }

    function getFileCountsByModule() {
        $query = "
            SELECT 
                description as module,
                COUNT(*) as count
            FROM {$this->bd}files
            WHERE active = 1
            GROUP BY description
        ";
        
        $results = $this->_Read($query, null);
        
        $counts = [
            'total' => 0,
            'ventas' => 0,
            'compras' => 0,
            'proveedores' => 0,
            'almacen' => 0
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
                    case 'Pagos a proveedor':
                        $counts['proveedores'] = $row['count'];
                        break;
                    case 'Salidas de almacén':
                        $counts['almacen'] = $row['count'];
                        break;
                }
            }
        }
        
        return $counts;
    }

    function getFilesByModule($array) {
        return $this->_Select([
            'table' => $this->bd . 'files',
            'values' => '*',
            'where' => 'description = ? AND active = 1',
            'data' => $array,
            'order' => ['DESC' => 'date_created_at']
        ]);
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
}
