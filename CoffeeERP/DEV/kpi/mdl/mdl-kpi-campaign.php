<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');

class mdl extends CRUD {

    public $util;
    public $bd;

    function __construct() {
        $this->util = new Utileria();
        $this->bd = "rfwsmqex_kpi.";
    }

    // Campaign Types

    function listCampaignTypes($array) {
        return $this->_Select([
            'table' => "{$this->bd}campaign_types",
            'values' => "id, name as valor,name, udn_id, description, active, DATE_FORMAT(date_creation, '%d/%m/%Y') as date_creation",
            'where' => 'active = ? AND udn_id = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getCampaignTypeById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}campaign_types",
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ]);
        
        return (is_array($result) && !empty($result)) ? $result[0] : null;
    }

    function createCampaignType($array) {
        return $this->_Insert([
            'table' => "{$this->bd}campaign_types",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCampaignType($array) {
        return $this->_Update([
            'table' => "{$this->bd}campaign_types",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function existsCampaignTypeByName($array) {
        $query = "
            SELECT id 
            FROM {$this->bd}campaign_types 
            WHERE LOWER(name) = LOWER(?) 
            AND udn_id = ? 
            AND active = 1
        ";
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    // Campaign Classification

    function listCampaignClassification($array) {
        return $this->_Select([
            'table' => "{$this->bd}campaign_classification",
            'values' => "id, name, udn_id, description, active, DATE_FORMAT(date_creation, '%d/%m/%Y') as date_creation",
            'where' => 'active = ? AND udn_id = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getCampaignClassificationById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}campaign_classification",
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ]);
        
        return (is_array($result) && !empty($result)) ? $result[0] : null;
    }

    function createCampaignClassification($array) {
        return $this->_Insert([
            'table' => "{$this->bd}campaign_classification",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCampaignClassification($array) {
        return $this->_Update([
            'table' => "{$this->bd}campaign_classification",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function existsCampaignClassificationByName($array) {
        $query = "
            SELECT id 
            FROM {$this->bd}campaign_classification 
            WHERE LOWER(name) = LOWER(?) 
            AND udn_id = ? 
            AND active = 1
        ";
        $exists = $this->_Read($query, $array);
        return count($exists) > 0;
    }

    // UDN List

    function lsUDN() {
        return $this->_Select([
            'table' => "rfwsmqex_gvsl_finanzas.udn",
            'values' => "idUDN as id, UDN as valor, Abreviatura",
            'where' => 'Stado = 1',
            'order' => ['ASC' => 'UDN']
        ]);
    }

    // Campaigns

    function listCampaigns() {
        return $this->_Select([
            'table' => "{$this->bd}campaigns",
            'values' => "id, name as valor, udn_id, social_network, strategy, start_date, end_date, active",
            'where' => 'active = 1',
            'order' => ['DESC' => 'id']
        ]);
    }

    function createCampaign($array) {
        return $this->_Insert([
            'table' => "{$this->bd}campaigns",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // Campaign Ads

    function listCampaignAds($array) {
        $leftjoin = [
            $this->bd . 'campaigns' => 'campaign_ads.campaign_id = campaigns.id',
            $this->bd . 'campaign_types' => 'campaign_ads.type_id = campaign_types.id',
            $this->bd . 'campaign_classification' => 'campaign_ads.classification_id = campaign_classification.id'
        ];

        return $this->_Select([
            'table' => "{$this->bd}campaign_ads",
            'values' => "
                campaign_ads.id,
                campaign_ads.ad_name,
                campaign_ads.title,
                campaign_ads.subtitle,
                campaign_ads.description,
                campaign_ads.image,
                campaign_ads.start_date,
                campaign_ads.end_date,
                campaign_ads.active,
                campaigns.name as campaign_name,
                campaigns.social_network,
                campaign_types.name as type_name,
                campaign_classification.name as classification_name,
                DATE_FORMAT(campaign_ads.date_creation, '%d/%m/%Y') as date_creation
            ",
            'leftjoin' => $leftjoin,
            'where' => 'campaign_ads.active = ? AND campaigns.udn_id = ?',
            'order' => ['DESC' => 'campaign_ads.id'],
            'data' => $array
        ]);
    }

    function getCampaignAdById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}campaign_ads",
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ]);
        
        return (is_array($result) && !empty($result)) ? $result[0] : null;
    }

    function createCampaignAd($array) {
        return $this->_Insert([
            'table' => "{$this->bd}campaign_ads",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCampaignAd($array) {
        return $this->_Update([
            'table' => "{$this->bd}campaign_ads",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    // Campaign Ad Results

    function getCampaignAdResults($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}campaign_ad_results",
            'values' => '*',
            'where' => 'ad_id = ?',
            'order' => ['DESC' => 'date_recorded'],
            'data' => $array
        ]);
        
        return (is_array($result) && !empty($result)) ? $result[0] : null;
    }

    function createCampaignAdResult($array) {
        return $this->_Insert([
            'table' => "{$this->bd}campaign_ad_results",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCampaignAdResult($array) {
        return $this->_Update([
            'table' => "{$this->bd}campaign_ad_results",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

      // Reportes Historial Anual

      function getReporteCPC($array) {
        $leftjoin = [
            $this->bd . 'campaigns' => 'campaign_ads.campaign_id = campaigns.id',
            $this->bd . 'campaign_ad_results' => 'campaign_ads.id = campaign_ad_results.ad_id',
            $this->bd . 'campaign_types' => 'campaign_ads.type_id = campaign_types.id'
        ];

        $whereClause = "campaign_ads.active = 1";
        $params = [];

        if (!empty($array[0])) {
            $whereClause .= " AND campaigns.udn_id = ?";
            $params[] = $array[0];
        }
        if (!empty($array[1])) {
            $whereClause .= " AND MONTH(campaign_ads.start_date) = ?";
            $params[] = $array[1];
        }
        if (!empty($array[2])) {
            $whereClause .= " AND YEAR(campaign_ads.start_date) = ?";
            $params[] = $array[2];
        }

        return $this->_Select([
            'table' => "{$this->bd}campaign_ads",
            'values' => "
                campaign_ads.id,
                campaigns.name as campaign_name,
                campaign_ads.ad_name,
                campaigns.social_network,
                campaign_ad_results.total_spent as inversion_total,
                campaign_ad_results.total_clicks as clics_cpc,
                MONTHNAME(campaign_ads.start_date) as mes_nombre
            ",
            'leftjoin' => $leftjoin,
            'where' => $whereClause,
            'order' => ['ASC' => 'campaign_ads.start_date'],
            'data' => $params
        ]);
    }

    function getReporteCAC($array) {
        $leftjoin = [
            $this->bd . 'campaigns' => 'campaign_ads.campaign_id = campaigns.id',
            $this->bd . 'campaign_ad_results' => 'campaign_ads.id = campaign_ad_results.ad_id',
            $this->bd . 'campaign_types' => 'campaign_ads.type_id = campaign_types.id'
        ];

        $whereClause = "campaign_ads.active = 1";
        $params = [];

        if (!empty($array[0])) {
            $whereClause .= " AND campaigns.udn_id = ?";
            $params[] = $array[0];
        }
        if (!empty($array[1])) {
            $whereClause .= " AND MONTH(campaign_ads.start_date) = ?";
            $params[] = $array[1];
        }
        if (!empty($array[2])) {
            $whereClause .= " AND YEAR(campaign_ads.start_date) = ?";
            $params[] = $array[2];
        }

        return $this->_Select([
            'table' => "{$this->bd}campaign_ads",
            'values' => "
                campaign_ads.id,
                campaigns.name as campaign_name,
                campaign_ads.ad_name,
                campaigns.social_network,
                campaign_ad_results.total_spent as inversion_total,
                campaign_ad_results.total_results as clientes_cac,
                MONTHNAME(campaign_ads.start_date) as mes_nombre
            ",
            'leftjoin' => $leftjoin,
            'where' => $whereClause,
            'order' => ['ASC' => 'campaign_ads.start_date'],
            'data' => $params
        ]);
    }

    // Resumen de Campaña

    function getResumenByCampana($array) {
        $leftjoin = [
            $this->bd . 'campaigns' => 'campaign_ads.campaign_id = campaigns.id',
            $this->bd . 'campaign_ad_results' => 'campaign_ads.id = campaign_ad_results.ad_id',
            $this->bd . 'campaign_types' => 'campaign_ads.type_id = campaign_types.id',
            $this->bd . 'campaign_classification' => 'campaign_ads.classification_id = campaign_classification.id'
        ];

        $whereClause = "campaign_ads.active = 1";
        $params = [];

        if (!empty($array[0])) {
            $whereClause .= " AND campaigns.udn_id = ?";
            $params[] = $array[0];
        }
        if (!empty($array[1])) {
            $whereClause .= " AND MONTH(campaign_ads.start_date) = ?";
            $params[] = $array[1];
        }
        if (!empty($array[2])) {
            $whereClause .= " AND YEAR(campaign_ads.start_date) = ?";
            $params[] = $array[2];
        }
        if (!empty($array[3])) {
            $whereClause .= " AND campaigns.social_network = ?";
            $params[] = $array[3];
        }

        return $this->_Select([
            'table' => "{$this->bd}campaign_ads",
            'values' => "
                campaign_ads.id,
                campaigns.name as campaign_name,
                campaign_ads.ad_name,
                campaign_ads.start_date,
                campaign_ads.end_date,
                campaign_types.name as type_name,
                campaign_classification.name as classification_name,
                campaign_ad_results.total_spent as inversion,
                campaign_ad_results.total_clicks as clic,
                campaign_ad_results.cost_per_result as cpc
            ",
            'leftjoin' => $leftjoin,
            'where' => $whereClause,
            'order' => ['ASC' => 'campaigns.name, campaign_ads.ad_name'],
            'data' => $params
        ]);
    }
}
  