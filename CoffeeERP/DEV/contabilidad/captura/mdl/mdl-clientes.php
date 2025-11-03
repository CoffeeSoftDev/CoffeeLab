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

    // Client Management

    function listClients($array) {
        return $this->_Select([
            'table'  => "{$this->bd}clients",
            'values' => "
                id,
                name,
                phone,
                email,
                udn_id,
                current_balance,
                active,
                DATE_FORMAT(date_create, '%d/%m/%Y') as date_create
            ",
            'where'  => 'active = ? AND udn_id = ?',
            'order'  => ['ASC' => 'name'],
            'data'   => $array
        ]);
    }

    function getClientById($array) {
        $result = $this->_Select([
            'table'  => "{$this->bd}clients",
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => $array
        ]);
        return $result ? $result[0] : null;
    }

    function getClientBalance($array) {
        $result = $this->_Select([
            'table'  => "{$this->bd}clients",
            'values' => 'current_balance',
            'where'  => 'id = ?',
            'data'   => $array
        ]);
        return $result ? $result[0]['current_balance'] : 0.00;
    }

    // Movement Management

    function listMovements($array) {
        $leftjoin = [
            $this->bd . 'clients' => 'credit_movements.client_id = clients.id'
        ];

        return $this->_Select([
            'table'    => "{$this->bd}credit_movements",
            'values'   => "
                credit_movements.id,
                credit_movements.client_id,
                clients.name as client_name,
                credit_movements.movement_type,
                credit_movements.payment_method,
                credit_movements.amount,
                credit_movements.previous_balance,
                credit_movements.new_balance,
                credit_movements.description,
                credit_movements.capture_date,
                credit_movements.created_by,
                credit_movements.updated_by,
                DATE_FORMAT(credit_movements.date_create, '%d/%m/%Y %H:%i') as date_create,
                DATE_FORMAT(credit_movements.date_update, '%d/%m/%Y %H:%i') as date_update
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'credit_movements.active = ? AND credit_movements.capture_date = ? AND credit_movements.udn_id = ?',
            'order'    => ['DESC' => 'credit_movements.id'],
            'data'     => $array
        ]);
    }

    function createMovement($array) {
        return $this->_Insert([
            'table'  => "{$this->bd}credit_movements",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateMovement($array) {
        return $this->_Update([
            'table'  => "{$this->bd}credit_movements",
            'values' => $array['values'],
            'where'  => 'id = ?',
            'data'   => $array['data']
        ]);
    }

    function deleteMovementById($array) {
        return $this->_Update([
            'table'  => "{$this->bd}credit_movements",
            'values' => 'active = ?',
            'where'  => 'id = ?',
            'data'   => $array
        ]);
    }

    function getMovementById($array) {
        $leftjoin = [
            $this->bd . 'clients' => 'credit_movements.client_id = clients.id'
        ];

        $result = $this->_Select([
            'table'    => "{$this->bd}credit_movements",
            'values'   => "
                credit_movements.*,
                clients.name as client_name,
                clients.phone as client_phone,
                clients.email as client_email,
                DATE_FORMAT(credit_movements.date_update, '%d/%m/%Y %H:%i') as formatted_date_update
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'credit_movements.id = ?',
            'data'     => $array
        ]);
        return $result ? $result[0] : null;
    }

    // Balance Calculations

    function calculateClientBalance($array) {
        $query = "
            SELECT 
                COALESCE(
                    SUM(CASE 
                        WHEN movement_type = 'consumo' THEN amount
                        WHEN movement_type IN ('abono_parcial', 'pago_total') THEN -amount
                        ELSE 0
                    END),
                    0.00
                ) as balance
            FROM {$this->bd}credit_movements
            WHERE client_id = ?
                AND capture_date <= ?
                AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result ? $result[0]['balance'] : 0.00;
    }

    function getConsolidatedReport($array) {
        $query = "
            SELECT 
                c.id,
                c.name as client_name,
                c.current_balance as initial_balance,
                COALESCE(SUM(CASE WHEN cm.movement_type = 'consumo' THEN cm.amount ELSE 0 END), 0) as total_consumptions,
                COALESCE(SUM(CASE WHEN cm.movement_type IN ('abono_parcial', 'pago_total') THEN cm.amount ELSE 0 END), 0) as total_payments,
                c.current_balance as final_balance,
                COUNT(cm.id) as movement_count
            FROM {$this->bd}clients c
            LEFT JOIN {$this->bd}credit_movements cm ON c.id = cm.client_id
                AND cm.capture_date BETWEEN ? AND ?
                AND cm.active = 1
            WHERE c.udn_id = ?
                AND c.active = 1
            GROUP BY c.id
            ORDER BY c.name
        ";
        return $this->_Read($query, $array);
    }

    function updateClientBalance($array) {
        return $this->_Update([
            'table'  => "{$this->bd}clients",
            'values' => 'current_balance = ?',
            'where'  => 'id = ?',
            'data'   => $array
        ]);
    }

    // Filter Methods

    function lsMovementTypes() {
        return [
            ['id' => 'consumo', 'valor' => 'Consumo a crédito'],
            ['id' => 'abono_parcial', 'valor' => 'Abono parcial'],
            ['id' => 'pago_total', 'valor' => 'Pago total'],
            ['id' => 'anticipo', 'valor' => 'Anticipo']
        ];
    }

    function lsPaymentMethods() {
        return [
            ['id' => 'n/a', 'valor' => 'N/A (No aplica)'],
            ['id' => 'efectivo', 'valor' => 'Efectivo'],
            ['id' => 'banco', 'valor' => 'Banco']
        ];
    }

    // Audit Log

    function logMovementAction($array) {
        return $this->_Insert([
            'table'  => "{$this->bd}movement_audit_log",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function getAuditLog($array) {
        $query = "
            SELECT 
                mal.*,
                DATE_FORMAT(mal.action_date, '%d/%m/%Y %H:%i:%s') as formatted_action_date
            FROM {$this->bd}movement_audit_log mal
            WHERE mal.movement_id = ?
            ORDER BY mal.action_date DESC
        ";
        return $this->_Read($query, $array);
    }

    // Daily Totals

    function getDailyTotals($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN movement_type = 'consumo' THEN amount ELSE 0 END), 0) as total_consumptions,
                COALESCE(SUM(CASE WHEN movement_type IN ('abono_parcial', 'pago_total') AND payment_method = 'efectivo' THEN amount ELSE 0 END), 0) as total_cash_payments,
                COALESCE(SUM(CASE WHEN movement_type IN ('abono_parcial', 'pago_total') AND payment_method = 'banco' THEN amount ELSE 0 END), 0) as total_bank_payments
            FROM {$this->bd}credit_movements
            WHERE capture_date = ?
                AND udn_id = ?
                AND active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result ? $result[0] : [
            'total_consumptions' => 0,
            'total_cash_payments' => 0,
            'total_bank_payments' => 0
        ];
    }

    // Movement Details by Date Range

    function getMovementsByDateRange($array) {
        $leftjoin = [
            $this->bd . 'clients' => 'credit_movements.client_id = clients.id'
        ];

        return $this->_Select([
            'table'    => "{$this->bd}credit_movements",
            'values'   => "
                credit_movements.id,
                credit_movements.client_id,
                clients.name as client_name,
                credit_movements.movement_type,
                credit_movements.payment_method,
                credit_movements.amount,
                credit_movements.capture_date,
                DATE_FORMAT(credit_movements.capture_date, '%d/%m/%Y') as formatted_capture_date
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'credit_movements.active = ? AND credit_movements.capture_date BETWEEN ? AND ? AND credit_movements.udn_id = ?',
            'order'    => ['DESC' => 'credit_movements.capture_date, credit_movements.id'],
            'data'     => $array
        ]);
    }

    // Client Movement History

    function getClientMovementHistory($array) {
        return $this->_Select([
            'table'  => "{$this->bd}credit_movements",
            'values' => "
                id,
                movement_type,
                payment_method,
                amount,
                previous_balance,
                new_balance,
                description,
                DATE_FORMAT(capture_date, '%d/%m/%Y') as formatted_capture_date,
                DATE_FORMAT(date_create, '%d/%m/%Y %H:%i') as formatted_date_create
            ",
            'where'  => 'client_id = ? AND active = 1',
            'order'  => ['DESC' => 'capture_date, id'],
            'data'   => $array
        ]);
    }
}
