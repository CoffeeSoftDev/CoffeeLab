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
            'table' => "{$this->bd}kpi_social_networks",
            'values' => "id, name AS valor",
            'where' => 'subsidiaries_id = ? AND active = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}kpi_metrics",
            'values' => "id, name AS valor",
            'where' => 'subsidiaries_id = ? AND active = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}kpi_social_networks",
            'values' => "id, name, icon, color, description, active, date_creation",
            'where' => 'subsidiaries_id = ? AND active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}kpi_social_networks",
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}kpi_social_networks
            WHERE LOWER(name) = LOWER(?)
            AND active = 1
            AND subsidiaries_id = ?
        ";
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}kpi_social_networks",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}kpi_social_networks",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $leftjoin = [
            $this->bd . 'kpi_social_networks' => 'kpi_metrics.social_network_id = kpi_social_networks.id'
        ];

        return $this->_Select([
            'table' => "{$this->bd}kpi_metrics",
            'values' => "
                kpi_metrics.id,
                kpi_metrics.name,
                kpi_metrics.description,
                kpi_metrics.active,
                kpi_social_networks.name AS social_network_name
            ",
            'leftjoin' => $leftjoin,
            'where' => 'kpi_metrics.subsidiaries_id = ? AND kpi_metrics.active = ?',
            'order' => ['DESC' => 'kpi_metrics.id'],
            'data' => $array
        ]);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}kpi_metrics",
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}kpi_metrics
            WHERE LOWER(name) = LOWER(?)
            AND social_network_id = ?
            AND active = 1
            AND subsidiaries_id = ?
        ";
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}kpi_metrics",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}kpi_metrics",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.name = 'Alcance' THEN mm.value ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.name = 'Interacciones' THEN mm.value ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.name = 'Visualizaciones' THEN mm.value ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.name = 'Inversión' THEN mm.value ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}kpi_social_captures sc
            LEFT JOIN {$this->bd}kpi_metric_movements mm ON sc.id = mm.capture_id
            LEFT JOIN {$this->bd}kpi_metrics m ON mm.metric_id = m.id
            WHERE sc.subsidiaries_id = ?
            AND sc.year = ?
            AND sc.month = ?
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
                sc.month,
                DATE_FORMAT(CONCAT(sc.year, '-', LPAD(sc.month, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.name = 'Interacciones' THEN mm.value ELSE 0 END), 0) AS interactions
            FROM {$this->bd}kpi_social_captures sc
            LEFT JOIN {$this->bd}kpi_metric_movements mm ON sc.id = mm.capture_id
            LEFT JOIN {$this->bd}kpi_metrics m ON mm.metric_id = m.id
            WHERE sc.subsidiaries_id = ?
            AND sc.year = ?
            AND sc.month <= ?
            GROUP BY sc.month, sc.year
            ORDER BY sc.month ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                sn.name AS social_network,
                COALESCE(SUM(CASE WHEN sc.month = ? THEN mm.value ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN sc.month = ? - 1 THEN mm.value ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}kpi_social_networks sn
            LEFT JOIN {$this->bd}kpi_social_captures sc ON sn.id = sc.social_network_id
            LEFT JOIN {$this->bd}kpi_metric_movements mm ON sc.id = mm.capture_id
            WHERE sn.subsidiaries_id = ?
            AND sn.active = 1
            AND sc.year = ?
            GROUP BY sn.id, sn.name
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                sn.name AS platform,
                COALESCE(SUM(CASE WHEN m.name = 'Alcance' THEN mm.value ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.name = 'Interacciones' THEN mm.value ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.name = 'Seguidores' THEN mm.value ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.name = 'Inversión' THEN mm.value ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.name = 'Inversión' THEN mm.value ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.name = 'Alcance' THEN mm.value ELSE 0 END) + 
                          SUM(CASE WHEN m.name = 'Interacciones' THEN mm.value ELSE 0 END)) / 
                         SUM(CASE WHEN m.name = 'Inversión' THEN mm.value ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}kpi_social_networks sn
            LEFT JOIN {$this->bd}kpi_social_captures sc ON sn.id = sc.social_network_id
            LEFT JOIN {$this->bd}kpi_metric_movements mm ON sc.id = mm.capture_id
            LEFT JOIN {$this->bd}kpi_metrics m ON mm.metric_id = m.id
            WHERE sn.subsidiaries_id = ?
            AND sn.active = 1
            AND sc.year = ?
            AND sc.month = ?
            GROUP BY sn.id, sn.name
        ";
        return $this->_Read($query, $array);
    }
}

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}kpi_metrics",
            'values' => "id, name, description",
            'where' => 'social_network_id = ? AND subsidiaries_id = ? AND active = ?',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}kpi_social_captures
            WHERE subsidiaries_id = ?
            AND social_network_id = ?
            AND year = ?
            AND month = ?
        ";
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}kpi_social_captures",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}kpi_metric_movements",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.name AS metric_name,
                COALESCE(SUM(CASE WHEN sc.month = 1 THEN mm.value ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN sc.month = 2 THEN mm.value ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN sc.month = 3 THEN mm.value ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN sc.month = 4 THEN mm.value ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN sc.month = 5 THEN mm.value ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN sc.month = 6 THEN mm.value ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN sc.month = 7 THEN mm.value ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN sc.month = 8 THEN mm.value ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN sc.month = 9 THEN mm.value ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN sc.month = 10 THEN mm.value ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN sc.month = 11 THEN mm.value ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN sc.month = 12 THEN mm.value ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mm.value), 0) AS total
            FROM {$this->bd}kpi_metrics m
            LEFT JOIN {$this->bd}kpi_metric_movements mm ON m.id = mm.metric_id
            LEFT JOIN {$this->bd}kpi_social_captures sc ON mm.capture_id = sc.id
            WHERE sc.subsidiaries_id = ?
            AND sc.social_network_id = ?
            AND sc.year = ?
            GROUP BY m.id, m.name
            ORDER BY m.name
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.name AS metric_name,
                COALESCE(MAX(CASE WHEN sc.month = MONTH(CURDATE()) - 1 THEN mm.value END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN sc.month = MONTH(CURDATE()) THEN mm.value END), 0) AS current_value
            FROM {$this->bd}kpi_metrics m
            LEFT JOIN {$this->bd}kpi_metric_movements mm ON m.id = mm.metric_id
            LEFT JOIN {$this->bd}kpi_social_captures sc ON mm.capture_id = sc.id
            WHERE sc.subsidiaries_id = ?
            AND sc.social_network_id = ?
            AND sc.year = ?
            GROUP BY m.id, m.name
            ORDER BY m.name
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.name AS metric_name,
                COALESCE(SUM(CASE WHEN sc.year = ? - 1 THEN mm.value ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN sc.year = ? THEN mm.value ELSE 0 END), 0) AS current_year
            FROM {$this->bd}kpi_metrics m
            LEFT JOIN {$this->bd}kpi_metric_movements mm ON m.id = mm.metric_id
            LEFT JOIN {$this->bd}kpi_social_captures sc ON mm.capture_id = sc.id
            WHERE sc.subsidiaries_id = ?
            AND sc.social_network_id = ?
            GROUP BY m.id, m.name
            ORDER BY m.name
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }
}
