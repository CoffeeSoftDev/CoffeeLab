<?php

require_once('../../../../conf/_CRUD.php');
require_once('../../../../conf/_Utileria.php');

class mdl extends CRUD {

    public $util;
    public $bd;

    function __construct() {
        $this->util = new Utileria();
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsClientes($params) {
        $leftjoin = [
            'udn' => 'cliente.udn_id = udn.idUDN'
        ];

        $whereClause = "1=1";
        $data = [];

        if (isset($params[0]) && $params[0] !== '') {
            $whereClause .= " AND cliente.active = ?";
            $data[] = $params[0];
        }

        if (isset($params[1]) && $params[1] !== '' && $params[1] !== 'all') {
            $whereClause .= " AND cliente.udn_id = ?";
            $data[] = $params[1];
        }

        if (isset($params[2]) && $params[2] !== '' && $params[2] !== 'all') {
            $whereClause .= " AND cliente.vip = ?";
            $data[] = $params[2];
        }

        return $this->_Select([
            'table' => "{$this->bd}cliente",
            'values' => "
                cliente.id,
                cliente.nombre,
                cliente.apellido_paterno,
                cliente.apellido_materno,
                cliente.vip,
                cliente.telefono,
                cliente.correo,
                cliente.fecha_cumpleaños,
                DATE_FORMAT(cliente.fecha_creacion, '%d/%m/%Y %H:%i') as fecha_creacion,
                cliente.udn_id,
                cliente.active,
                udn.UDN as udn_nombre,
                udn.Abreviatura as udn_abreviatura
            ",
            'leftjoin' => $leftjoin,
            'where' => $whereClause,
            'order' => ['DESC' => 'cliente.id'],
            'data' => $data
        ]);
    }

    function getClienteById($id) {
        $cliente = $this->_Select([
            'table' => "{$this->bd}cliente",
            'values' => '*',
            'where' => 'id = ?',
            'data' => [$id]
        ]);

        if (empty($cliente)) {
            return null;
        }

        $clienteData = $cliente[0];

        $domicilio = $this->_Select([
            'table' => "{$this->bd}domicilio_cliente",
            'values' => '*',
            'where' => 'cliente_id = ? AND es_principal = 1',
            'data' => [$id]
        ]);

        if (!empty($domicilio)) {
            $clienteData['domicilio'] = $domicilio[0];
        } else {
            $clienteData['domicilio'] = null;
        }

        return $clienteData;
    }

    function createCliente($data) {
        return $this->_Insert([
            'table' => "{$this->bd}cliente",
            'values' => $data['values'],
            'data' => $data['data']
        ]);
    }

    function createDomicilio($data) {
        return $this->_Insert([
            'table' => "{$this->bd}domicilio_cliente",
            'values' => $data['values'],
            'data' => $data['data']
        ]);
    }

    function updateCliente($data) {
        return $this->_Update([
            'table' => "{$this->bd}cliente",
            'values' => $data['values'],
            'where' => 'id = ?',
            'data' => $data['data']
        ]);
    }

    function updateDomicilio($data) {
        return $this->_Update([
            'table' => "{$this->bd}domicilio_cliente",
            'values' => $data['values'],
            'where' => 'cliente_id = ? AND es_principal = 1',
            'data' => $data['data']
        ]);
    }

    function existsClienteByPhone($telefono, $excludeId = null) {
        $query = "
            SELECT COUNT(*) as total
            FROM {$this->bd}cliente 
            WHERE telefono = ?
        ";
        
        $params = [$telefono];

        if ($excludeId !== null) {
            $query .= " AND id != ?";
            $params[] = $excludeId;
        }

        $result = $this->_Read($query, $params);
        return isset($result[0]['total']) ? (int)$result[0]['total'] : 0;
    }

    function getDomicilioPrincipal($clienteId) {
        $result = $this->_Select([
            'table' => "{$this->bd}domicilio_cliente",
            'values' => '*',
            'where' => 'cliente_id = ? AND es_principal = 1',
            'data' => [$clienteId]
        ]);

        return !empty($result) ? $result[0] : null;
    }

    function lsUDN() {
        return $this->_Select([
            'table' => "udn",
            'values' => "idUDN as id, UDN as valor, Abreviatura",
            'where' => 'Stado = 1',
            'order' => ['ASC' => 'UDN']
        ]);
    }

    function getTotalClientesActivos($udnId = null) {
        $whereClause = "active = 1";
        $params = [];

        if ($udnId !== null) {
            $whereClause .= " AND udn_id = ?";
            $params[] = $udnId;
        }

        $query = "
            SELECT COUNT(*) as total
            FROM {$this->bd}cliente
            WHERE {$whereClause}
        ";

        $result = $this->_Read($query, $params);
        return isset($result[0]['total']) ? (int)$result[0]['total'] : 0;
    }

    function getTotalClientesVIP($udnId = null) {
        $whereClause = "active = 1 AND vip = 1";
        $params = [];

        if ($udnId !== null) {
            $whereClause .= " AND udn_id = ?";
            $params[] = $udnId;
        }

        $query = "
            SELECT COUNT(*) as total
            FROM {$this->bd}cliente
            WHERE {$whereClause}
        ";

        $result = $this->_Read($query, $params);
        return isset($result[0]['total']) ? (int)$result[0]['total'] : 0;
    }

    function getClientesCumpleañosMes($udnId = null) {
        $whereClause = "active = 1 AND MONTH(fecha_cumpleaños) = MONTH(CURDATE())";
        $params = [];

        if ($udnId !== null) {
            $whereClause .= " AND udn_id = ?";
            $params[] = $udnId;
        }

        return $this->_Select([
            'table' => "{$this->bd}cliente",
            'values' => "
                id,
                nombre,
                apellido_paterno,
                apellido_materno,
                telefono,
                correo,
                fecha_cumpleaños,
                DAY(fecha_cumpleaños) as dia_cumpleaños
            ",
            'where' => $whereClause,
            'order' => ['ASC' => 'DAY(fecha_cumpleaños)'],
            'data' => $params
        ]);
    }
}
