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

    // Campaign Methods

    function listCampaigns($array) {
        $leftjoin = [
            $this->bd . 'red_social' => 'campaña.red_social_id = red_social.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'campaña',
            'values'   => "
                campaña.id,
                campaña.nombre,
                campaña.estrategia,
                DATE_FORMAT(campaña.fecha_creacion, '%d/%m/%Y %H:%i') as fecha_creacion,
                campaña.udn_id,
                campaña.red_social_id,
                red_social.nombre as red_social,
                campaña.active
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'campaña.active = ? AND campaña.udn_id = ?',
            'order'    => ['DESC' => 'campaña.id'],
            'data'     => $array
        ]);
    }

    function getCampaignById($array) {
        return $this->_Select([
            'table'  => $this->bd . 'campaña',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => $array
        ])[0];
    }

    function createCampaign($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'campaña',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateCampaign($array) {
        return $this->_Update([
            'table'  => $this->bd . 'campaña',
            'values' => $array['values'],
            'where'  => 'id = ?',
            'data'   => $array['data']
        ]);
    }

    function getLastCampaignId() {
        $query = "SELECT MAX(id) as last_id FROM {$this->bd}campaña";
        $result = $this->_Read($query, []);
        return $result[0]['last_id'] ?? 0;
    }

    // Announcement Methods

    function listAnnouncements($array) {
        $leftjoin = [
            $this->bd . 'tipo_anuncio' => 'anuncio.tipo_id = tipo_anuncio.id',
            $this->bd . 'clasificacion_anuncio' => 'anuncio.clasificacion_id = clasificacion_anuncio.id',
            $this->bd . 'campaña' => 'anuncio.campaña_id = campaña.id'
        ];

        return $this->_Select([
            'table'    => $this->bd . 'anuncio',
            'values'   => "
                anuncio.id,
                anuncio.nombre,
                DATE_FORMAT(anuncio.fecha_inicio, '%d/%m/%Y') as fecha_inicio,
                DATE_FORMAT(anuncio.fecha_fin, '%d/%m/%Y') as fecha_fin,
                anuncio.total_monto,
                anuncio.total_clics,
                anuncio.imagen,
                anuncio.campaña_id,
                campaña.nombre as campaña_nombre,
                tipo_anuncio.nombre as tipo,
                clasificacion_anuncio.nombre as clasificacion
            ",
            'leftjoin' => $leftjoin,
            'where'    => 'anuncio.campaña_id = ?',
            'order'    => ['DESC' => 'anuncio.id'],
            'data'     => $array
        ]);
    }

    function getAnnouncementById($array) {
        return $this->_Select([
            'table'  => $this->bd . 'anuncio',
            'values' => '*',
            'where'  => 'id = ?',
            'data'   => $array
        ])[0];
    }

    function createAnnouncement($array) {
        return $this->_Insert([
            'table'  => $this->bd . 'anuncio',
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }

    function updateAnnouncement($array) {
        return $this->_Update([
            'table'  => $this->bd . 'anuncio',
            'values' => $array['values'],
            'where'  => 'id = ?',
            'data'   => $array['data']
        ]);
    }

    // Catalog Methods

    function lsTypes($array = []) {
        return $this->_Select([
            'table'  => $this->bd . 'tipo_anuncio',
            'values' => 'id, nombre as valor',
            'where'  => 'active = 1',
            'order'  => ['ASC' => 'nombre']
        ]);
    }

    function lsClassifications($array = []) {
        return $this->_Select([
            'table'  => $this->bd . 'clasificacion_anuncio',
            'values' => 'id, nombre as valor',
            'where'  => 'active = 1',
            'order'  => ['ASC' => 'nombre']
        ]);
    }

    function lsRedSocial($array = []) {
        return $this->_Select([
            'table'  => $this->bd . 'red_social',
            'values' => 'id, nombre as valor, color',
            'where'  => 'active = 1',
            'order'  => ['ASC' => 'nombre']
        ]);
    }

    function lsUDN($array = []) {
         $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }
}
