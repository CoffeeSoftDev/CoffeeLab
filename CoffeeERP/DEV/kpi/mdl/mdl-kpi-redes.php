<?php

require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');

class mdl extends CRUD {

  public $util;
  public $bd;

    function __construct() {
        $this->util = new Utileria();
        $this->bd  = "rfwsmqex_kpi.";
    }

    function listBusinessUnits($array = []) {
        $where = "status = 1";
        $data = [];

        return $this->_Select([
            'table' => "{$this->bd}business_units",
            'values' => 'id, name, code, description, status',
            'where' => $where,
            'order' => ['ASC' => 'name'],
            'data' => $data
        ]);
    }
    
    // Metricas:
    
    function listMetrics($array = []) {
        $where = "m.status = 1";
        $data = [];

        // if (!empty($array['nombre'])) {
        //     $where .= " AND m.name LIKE ?";
        //     $data[] = '%' . $array['nombre'] . '%';
        // }

        // if (!empty($array['tipo'])) {
        //     $where .= " AND m.type = ?";
        //     $data[] = $array['tipo'];
        // }

        // if (!empty($array['social_network_id'])) {
        //     $where .= " AND m.social_networks_id = ?";
        //     $data[] = $array['social_network_id'];
        // }

        $query = "
            SELECT 
                m.id,
                m.name,
                m.type,
                m.unit_measure,
                m.description,
                m.status,
                m.created_at,
                sn.name as social_network_name,
                sn.icon as social_network_icon,
                sn.color as social_network_color
            FROM {$this->bd}metrics m
            JOIN {$this->bd}social_networks sn ON m.social_networks_id = sn.id
            WHERE {$where}
            ORDER BY sn.name ASC, m.name ASC
        ";


        return $this->_Read($query, $data);
    }

    function getMetricById($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrics",
            'values' => 'id, social_networks_id, name, type, unit_measure, description, status',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrics",
            'values' => 'social_networks_id, name, type, unit_measure, description',
            'data' => $array
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table'  => "{$this->bd}metrics",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
         ]);
    }

    function updateMetricStatus($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrics",
            'values' => 'status = ?',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function getMetricsBySocialNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrics",
            'values' => 'id, name, type, unit_measure, description',
            'where' => 'social_networks_id = ? AND status = 1',
            'order' => ['ASC' => 'name'],
            'data' => $array
        ]);
    }


    // Social Network: 
    function listSocialNetworks($array = []) {
        $where = "1=1";
        $data = [];

        if (!empty($array['nombre'])) {
            $where .= " AND name LIKE ?";
            $data[] = '%' . $array['nombre'] . '%';
        }

        if (isset($array['status']) && $array['status'] !== '') {
            $where .= " AND status = ?";
            $data[] = $array['status'];
        }

        return $this->_Select([
            'table' => "{$this->bd}social_networks",
            'values' => 'id, name as valor, description, icon, color, status, created_at',
            'where' => $where,
            'order' => ['ASC' => 'name'],
            'data' => $data
        ]);
    }

      function getSocialNetworkById($array) {
        return $this->_Select([
            'table' => "{$this->bd}social_networks",
            'values' => 'id, name, description, icon, color, status',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function createSocialNetwork($array) {
         return $this->_Insert([
            'table'  => "{$this->bd}social_networks",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table'  => "{$this->bd}social_networks",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function updateSocialNetworkStatus($array) {
        return $this->_Update([
            'table' => "{$this->bd}social_networks",
            'values' => 'status = ?',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }

    function existsSocialNetworkByName($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}social_networks",
            'values' => 'COUNT(*) as count',
            'where' => 'name = ? AND id != ?',
            'data' => $array
        ]);
        return $result[0]['count'] ?? 0;
    }





}