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

    function listSalidasAlmacen($array) {
        return $this->_Select([
            'table'  => "{$this->bd}salidas_almacen",
            'values' => "
                id,
                folio,
                producto,
                cantidad,
                precio_unitario,
                total,
                motivo,
                responsable,
                DATE_FORMAT(fecha_salida, '%d/%m/%Y') as fecha_salida,
                DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') as created_at,
                status
            ",
            'where'  => 'DATE(fecha_salida) BETWEEN ? AND ?',
            'order'  => ['DESC' => 'id'],
            'data'   => $array
        ]);
    }

    function getSalidaAlmacenById($array) {
        return $this->_Select([
            'table'  => "{$this->bd}salidas_almacen",
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => $array
        ])[0];
    }

    function createSalidaAlmacen($array) {
        return $this->_Insert([
            'table'  => "{$this->bd}salidas_almacen",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateSalidaAlmacen($array) {
        return $this->_Update([
            'table'  => "{$this->bd}salidas_almacen",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function lsProductos($array = []) {
        return $this->_Select([
            'table'  => "{$this->bd}productos",
            'values' => 'id, nombre as valor',
            'where'  => 'active = 1',
            'order'  => ['ASC' => 'nombre']
        ]);
    }

    function lsMotivos() {
        return [
            ['id' => 'Venta', 'valor' => 'Venta'],
            ['id' => 'Merma', 'valor' => 'Merma'],
            ['id' => 'Donación', 'valor' => 'Donación'],
            ['id' => 'Uso interno', 'valor' => 'Uso interno'],
            ['id' => 'Otro', 'valor' => 'Otro']
        ];
    }
}ileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_contabilidad.";
    }

    function listWarehouseOutputs($array) {
        $leftjoin = [
            $this->bd . 'insumo' => 'warehouse_output.insumo_id = insumo.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'warehouse_output',
            'values'   => "
                warehouse_output.id,
                warehouse_output.amount,
                warehouse_output.description,
                warehouse_output.operation_date,
                insumo.nombre AS warehouse_name,
                warehouse_output.active
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'warehouse_output.active = ?',
            'order'    => ['DESC' => 'warehouse_output.id'],
            'data'     => [$array['active']]
        ]);
    }

    function getWarehouseOutputById($id) {
        return $this->_Select([
            'table'  => $this->bd . 'warehouse_output',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => [$id]
        ])[0];
    }

    function calculateTotalOutputs($array) {
        $query = "
            SELECT SUM(amount) AS total
            FROM {$this->bd}warehouse_output
            WHERE active = ?
        ";
        
        $result = $this->_Read($query, [$array['active']])[0];
        return $result['total'] ?? 0;
    }

    function createWarehouseOutput($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'warehouse_output',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateWarehouseOutput($array) {
        return $this->_Update([
            'table'  => $this->bd . 'warehouse_output',
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function deleteWarehouseOutputById($id) {
        return $this->_Update([
            'table'  => $this->bd . 'warehouse_output',
            'values' => 'active = ?',
            'where'  => 'id = ?',
            'data'   => [0, $id]
        ]);
    }

    function lsWarehouses() {
        return $this->_Select([
            'table'  => $this->bd . 'insumo',
            'values' => 'id, nombre AS valor',
            'where'  => 'activo = ?',
            'order'  => ['ASC' => 'nombre'],
            'data'   => [1]
        ]);
    }
}
