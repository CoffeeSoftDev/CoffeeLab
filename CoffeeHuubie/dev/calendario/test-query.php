<?php
session_start();
require_once '../conf/_CRUD.php';
require_once '../conf/_Utileria.php';

class TestQuery extends CRUD {
    public $bd;
    
    public function __construct() {
        $this->bd = 'fayxzvov_coffee.';
    }
    
    public function testQuery() {
        $fi = date('Y-m-01'); // Primer día del mes
        $ff = date('Y-m-t');  // Último día del mes
        
        $query = "
            SELECT 
                o.id,
                o.folio_id AS folio,
                COALESCE(oc.name, 'Sin nombre') AS cliente,
                COALESCE(oc.phone, '') AS telefono,
                o.date_order,
                o.time_order,
                o.status,
                COALESCE(o.location, '') AS location,
                COALESCE(o.total_pay, 0) AS total,
                o.subsidiaries_id
            FROM {$this->bd}order o
            LEFT JOIN {$this->bd}order_clients oc ON o.client_id = oc.id
            WHERE o.date_order BETWEEN ? AND ?
            ORDER BY o.date_order ASC, o.time_order ASC
            LIMIT 10
        ";
        
        try {
            $result = $this->_Read($query, [$fi, $ff]);
            return [
                'status' => 'success',
                'count' => count($result),
                'data' => $result,
                'query' => $query,
                'params' => [$fi, $ff]
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
                'query' => $query,
                'params' => [$fi, $ff]
            ];
        }
    }
}

$test = new TestQuery();
$result = $test->testQuery();

header('Content-Type: application/json');
echo json_encode($result, JSON_PRETTY_PRINT);
?>
