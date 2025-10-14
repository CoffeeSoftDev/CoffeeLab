<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";

    }

    function getCampaignSummary($array) {
        $query = "
            SELECT 
                c.id as campaña_id,
                c.nombre as campaña,
                c.estrategia,
                a.id as anuncio_id,
                a.nombre as anuncio,
                DATE_FORMAT(a.fecha_inicio, '%d/%m/%Y') as fecha_inicio,
                DATE_FORMAT(a.fecha_fin, '%d/%m/%Y') as fecha_fin,
                DATEDIFF(a.fecha_fin, a.fecha_inicio) as duracion_dias,
                t.nombre as tipo,
                cl.nombre as clasificacion,
                a.total_monto as inversion,
                a.total_clics as clics,
                CASE 
                    WHEN a.total_clics > 0 
                    THEN a.total_monto / a.total_clics
                    ELSE 0 
                END as cpc
            FROM {$this->bd}campaña c
            INNER JOIN {$this->bd}anuncio a ON c.id = a.campaña_id
            INNER JOIN {$this->bd}tipo_anuncio t ON a.tipo_id = t.id
            INNER JOIN {$this->bd}clasificacion_anuncio cl ON a.clasificacion_id = cl.id
            WHERE c.udn_id = ?
            AND c.red_social_id = ?
            AND YEAR(a.fecha_inicio) = ?
            AND MONTH(a.fecha_inicio) = ?
            ORDER BY c.id DESC, a.id ASC
        ";
        
        return $this->_Read($query, $array);
    }

    function getCampaignTotals($array) {
        $query = "
            SELECT 
                c.id as campaña_id,
                c.nombre as campaña,
                SUM(a.total_monto) as total_inversion,
                SUM(a.total_clics) as total_clics,
                AVG(CASE 
                    WHEN a.total_clics > 0 
                    THEN a.total_monto / a.total_clics
                    ELSE 0 
                END) as cpc_promedio,
                COUNT(a.id) as total_anuncios
            FROM {$this->bd}campaña c
            INNER JOIN {$this->bd}anuncio a ON c.id = a.campaña_id
            WHERE c.udn_id = ?
            AND c.red_social_id = ?
            AND YEAR(a.fecha_inicio) = ?
            AND MONTH(a.fecha_inicio) = ?
            GROUP BY c.id, c.nombre
            ORDER BY c.id DESC
        ";
        
        return $this->_Read($query, $array);
    }

    function getMonthlySummary($array) {
        $query = "
            SELECT 
                SUM(a.total_monto) as costo_total,
                SUM(a.total_clics) as total_resultados,
                AVG(CASE 
                    WHEN a.total_clics > 0 
                    THEN a.total_monto / a.total_clics
                    ELSE 0 
                END) as cpc_promedio_mes
            FROM {$this->bd}campaña c
            INNER JOIN {$this->bd}anuncio a ON c.id = a.campaña_id
            WHERE c.udn_id = ?
            AND c.red_social_id = ?
            AND YEAR(a.fecha_inicio) = ?
            AND MONTH(a.fecha_inicio) = ?
        ";
        
        return $this->_Read($query, $array)[0];
    }
}
