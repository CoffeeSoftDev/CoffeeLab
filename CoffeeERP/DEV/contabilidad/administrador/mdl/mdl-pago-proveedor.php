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

    function listPagos($array) {
        $where = "pp.fecha_pago BETWEEN ? AND ?";
        $data = [$array['fi'], $array['ff']];

        if (!empty($array['tipo_pago'])) {
            $where .= " AND pp.tipo_pago_id = ?";
            $data[] = $array['tipo_pago'];
        }

        $leftjoin = [
            $this->bd . 'proveedores AS p' => 'pp.proveedor_id = p.id',
            $this->bd . 'tipo_pago AS tp' => 'pp.tipo_pago_id = tp.id'
        ];

        return $this->_Select([
            'table' => $this->bd . 'pago_proveedor AS pp',
            'values' => "
                pp.id,
                pp.fecha_pago,
                pp.monto,
                pp.descripcion,
                p.nombre AS proveedor,
                tp.tipo AS tipo_pago,
                pp.fecha_registro
            ",
            'leftjoin' => $leftjoin,
            'where' => $where,
            'order' => ['DESC' => 'pp.fecha_pago'],
            'data' => $data
        ]);
    }

    function getPagoById($array) {
        return $this->_Select([
            'table' => $this->bd . 'pago_proveedor',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0] ?? null;
    }

    function createPago($array) {
        return $this->_Insert([
            'table' => $this->bd . 'pago_proveedor',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updatePago($array) {
        return $this->_Update([
            'table' => $this->bd . 'pago_proveedor',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function deletePagoById($array) {
        return $this->_Delete([
            'table' => $this->bd . 'pago_proveedor',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function lsProveedores() {
        return $this->_Select([
            'table' => $this->bd . 'proveedores',
            'values' => 'id, nombre',
            'where' => 'active = 1',
            'order' => ['ASC' => 'nombre']
        ]);
    }

    function lsTipoPago() {
        return $this->_Select([
            'table' => $this->bd . 'tipo_pago',
            'values' => 'id, tipo',
            'where' => 'active = 1',
            'order' => ['ASC' => 'tipo']
        ]);
    }

    function getTotalesPagos($array) {
        $where = "fecha_pago BETWEEN ? AND ?";
        $data = [$array['fi'], $array['ff']];

        if (!empty($array['tipo_pago'])) {
            $where .= " AND tipo_pago_id = ?";
            $data[] = $array['tipo_pago'];
        }

        $query = "
            SELECT 
                SUM(monto) AS total_general,
                SUM(CASE WHEN tipo_pago_id = 1 THEN monto ELSE 0 END) AS total_fondo_fijo,
                SUM(CASE WHEN tipo_pago_id = 2 THEN monto ELSE 0 END) AS total_corporativo
            FROM {$this->bd}pago_proveedor
            WHERE {$where}
        ";

        return $this->_Read($query, $data)[0] ?? [
            'total_general' => 0,
            'total_fondo_fijo' => 0,
            'total_corporativo' => 0
        ];
    }
}
