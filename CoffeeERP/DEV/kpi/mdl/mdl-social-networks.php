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

    function lsUDN() {
        return $this->_Select([
            'table' => "{$this->bd}subsidiaries",
            'values' => "id, name AS valor",
            'where' => 'active = ?',
            'data' => [1]
        ]);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS name, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => [$array[1]]
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, nombre AS name, color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $leftjoin = [
            $this->bd . 'red_social' => 'metrica_red.red_social_id = red_social.id'
        ];

        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "
                metrica_red.id,
                metrica_red.nombre AS name,
                metrica_red.active,
                red_social.nombre AS social_network_name
            ",
            'leftjoin' => $leftjoin,
            'where' => 'metrica_red.active = ?',
            'order' => ['DESC' => 'metrica_red.id'],
            'data' => [$array[1]]
        ]);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre AS name, red_social_id AS social_network_id, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }
}
