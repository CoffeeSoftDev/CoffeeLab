<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';


class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function listUDN() {
        return $this->_Select([
            'table' => "{$this->bd}udn",
            'values' => 'id, name',
            'where' => 'active = ?',
            'order' => ['ASC' => 'name'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks() {
        return $this->_Select([
            'table' => "{$this->bd}social_networks",
            'values' => 'id, name',
            'where' => 'active = ?',
            'order' => ['ASC' => 'name'],
            'data' => [1]
        ]);
    }

    function getMonths() {
        return [
            ['id' => 1, 'name' => 'Enero'],
            ['id' => 2, 'name' => 'Febrero'],
            ['id' => 3, 'name' => 'Marzo'],
            ['id' => 4, 'name' => 'Abril'],
            ['id' => 5, 'name' => 'Mayo'],
            ['id' => 6, 'name' => 'Junio'],
            ['id' => 7, 'name' => 'Julio'],
            ['id' => 8, 'name' => 'Agosto'],
            ['id' => 9, 'name' => 'Septiembre'],
            ['id' => 10, 'name' => 'Octubre'],
            ['id' => 11, 'name' => 'Noviembre'],
            ['id' => 12, 'name' => 'Diciembre']
        ];
    }


    function getMetricsList($filters) {
        $where = "1=1";
        $data = [];

        if (!empty($filters['udn_id'])) {
            $where .= " AND sm.udn_id = ?";
            $data[] = $filters['udn_id'];
        }

        if (!empty($filters['social_id'])) {
            $where .= " AND sm.social_id = ?";
            $data[] = $filters['social_id'];
        }

        if (!empty($filters['year'])) {
            $where .= " AND sm.year = ?";
            $data[] = $filters['year'];
        }

        if (!empty($filters['month'])) {
            $where .= " AND sm.month = ?";
            $data[] = $filters['month'];
        }

        $query = "
            SELECT 
                sm.*,
                sn.name as social_name,
                u.name as udn_name,
                CASE sm.month
                    WHEN 1 THEN 'Enero'
                    WHEN 2 THEN 'Febrero'
                    WHEN 3 THEN 'Marzo'
                    WHEN 4 THEN 'Abril'
                    WHEN 5 THEN 'Mayo'
                    WHEN 6 THEN 'Junio'
                    WHEN 7 THEN 'Julio'
                    WHEN 8 THEN 'Agosto'
                    WHEN 9 THEN 'Septiembre'
                    WHEN 10 THEN 'Octubre'
                    WHEN 11 THEN 'Noviembre'
                    WHEN 12 THEN 'Diciembre'
                END as month_name
            FROM {$this->bd}social_metrics sm
            LEFT JOIN {$this->bd}social_networks sn ON sm.social_id = sn.id
            LEFT JOIN {$this->bd}udn u ON sm.udn_id = u.id
            WHERE {$where}
            ORDER BY sm.year DESC, sm.month DESC
        ";

        return $this->_Read($query, $data);
    }

    function getMetricById($array) {
        return $this->_Select([
            'table' => "{$this->bd}social_metrics",
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }

    function existsMetric($array) {
        $query = "
            SELECT COUNT(*) as total
            FROM {$this->bd}social_metrics
            WHERE udn_id = ? 
            AND social_id = ? 
            AND year = ? 
            AND month = ?
        ";
        
        $result = $this->_Read($query, $array);
        return $result[0]['total'];
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}social_metrics",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}social_metrics",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function deleteMetricById($array) {
        return $this->_Delete([
            'table' => "{$this->bd}social_metrics",
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function getAnnualReport($filters) {
        $query = "
            SELECT 
                'Seguidores' as metric_name,
                MAX(CASE WHEN month = 1 THEN followers END) as jan,
                MAX(CASE WHEN month = 2 THEN followers END) as feb,
                MAX(CASE WHEN month = 3 THEN followers END) as mar,
                MAX(CASE WHEN month = 4 THEN followers END) as apr,
                MAX(CASE WHEN month = 5 THEN followers END) as may,
                MAX(CASE WHEN month = 6 THEN followers END) as jun,
                MAX(CASE WHEN month = 7 THEN followers END) as jul,
                MAX(CASE WHEN month = 8 THEN followers END) as aug,
                MAX(CASE WHEN month = 9 THEN followers END) as sep,
                MAX(CASE WHEN month = 10 THEN followers END) as oct,
                MAX(CASE WHEN month = 11 THEN followers END) as nov,
                MAX(CASE WHEN month = 12 THEN followers END) as dec,
                SUM(followers) as total
            FROM {$this->bd}social_metrics
            WHERE udn_id = ? AND social_id = ? AND year = ?
            
            UNION ALL
            
            SELECT 
                'Publicaciones' as metric_name,
                SUM(CASE WHEN month = 1 THEN publications END) as jan,
                SUM(CASE WHEN month = 2 THEN publications END) as feb,
                SUM(CASE WHEN month = 3 THEN publications END) as mar,
                SUM(CASE WHEN month = 4 THEN publications END) as apr,
                SUM(CASE WHEN month = 5 THEN publications END) as may,
                SUM(CASE WHEN month = 6 THEN publications END) as jun,
                SUM(CASE WHEN month = 7 THEN publications END) as jul,
                SUM(CASE WHEN month = 8 THEN publications END) as aug,
                SUM(CASE WHEN month = 9 THEN publications END) as sep,
                SUM(CASE WHEN month = 10 THEN publications END) as oct,
                SUM(CASE WHEN month = 11 THEN publications END) as nov,
                SUM(CASE WHEN month = 12 THEN publications END) as dec,
                SUM(publications) as total
            FROM {$this->bd}social_metrics
            WHERE udn_id = ? AND social_id = ? AND year = ?
        ";

        $data = array_merge(
            [$filters['udn_id'], $filters['social_id'], $filters['year']],
            [$filters['udn_id'], $filters['social_id'], $filters['year']]
        );

        return $this->_Read($query, $data);
    }

    function getMonthlyComparison($filters) {
        $previousMonth = $filters['month'] - 1;
        $previousYear = $filters['year'];

        if ($previousMonth == 0) {
            $previousMonth = 12;
            $previousYear--;
        }

        $query = "
            SELECT 
                'Seguidores' as metric_name,
                (SELECT followers FROM {$this->bd}social_metrics 
                 WHERE udn_id = ? AND social_id = ? AND year = ? AND month = ?) as previous,
                (SELECT followers FROM {$this->bd}social_metrics 
                 WHERE udn_id = ? AND social_id = ? AND year = ? AND month = ?) as current
            
            UNION ALL
            
            SELECT 
                'Publicaciones' as metric_name,
                (SELECT publications FROM {$this->bd}social_metrics 
                 WHERE udn_id = ? AND social_id = ? AND year = ? AND month = ?) as previous,
                (SELECT publications FROM {$this->bd}social_metrics 
                 WHERE udn_id = ? AND social_id = ? AND year = ? AND month = ?) as current
        ";

        $data = [
            $filters['udn_id'], $filters['social_id'], $previousYear, $previousMonth,
            $filters['udn_id'], $filters['social_id'], $filters['year'], $filters['month'],
            $filters['udn_id'], $filters['social_id'], $previousYear, $previousMonth,
            $filters['udn_id'], $filters['social_id'], $filters['year'], $filters['month']
        ];

        return $this->_Read($query, $data);
    }

    function getYearlyComparison($filters) {
        $previousYear = $filters['year'] - 1;

        $query = "
            SELECT 
                'Seguidores' as metric_name,
                (SELECT MAX(followers) FROM {$this->bd}social_metrics 
                 WHERE udn_id = ? AND social_id = ? AND year = ?) as previous_year,
                (SELECT MAX(followers) FROM {$this->bd}social_metrics 
                 WHERE udn_id = ? AND social_id = ? AND year = ?) as current_year
            
            UNION ALL
            
            SELECT 
                'Publicaciones' as metric_name,
                (SELECT SUM(publications) FROM {$this->bd}social_metrics 
                 WHERE udn_id = ? AND social_id = ? AND year = ?) as previous_year,
                (SELECT SUM(publications) FROM {$this->bd}social_metrics 
                 WHERE udn_id = ? AND social_id = ? AND year = ?) as current_year
        ";

        $data = [
            $filters['udn_id'], $filters['social_id'], $previousYear,
            $filters['udn_id'], $filters['social_id'], $filters['year'],
            $filters['udn_id'], $filters['social_id'], $previousYear,
            $filters['udn_id'], $filters['social_id'], $filters['year']
        ];

        return $this->_Read($query, $data);
    }
}
