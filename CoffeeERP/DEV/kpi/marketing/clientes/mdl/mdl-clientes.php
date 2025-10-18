<?php
/**
 * Modelo de Datos - Gestión de Clientes
 * Sistema: KPI / Marketing - CoffeeSoft ERP
 * 
 * Este modelo maneja todas las operaciones de base de datos
 * relacionadas con clientes y sus domicilios
 */

require_once('../../../../conf/_CRUD.php');
require_once('../../../../conf/_Utileria.php');

class mdl extends CRUD {

    public $util;
    public $bd;

    function __construct() {
        $this->util = new Utileria();
        $this->bd = "rfwsmqex_kpi.";
    }

    // ============================================
    // CLIENTES - Operaciones CRUD
    // ============================================

    /**
     * Lista clientes con filtros opcionales
     * @param array $params [active, udn_id, vip]
     * @return array Lista de clientes
     */
    function lsClientes($params) {
        $leftjoin = [
            'udn' => 'cliente.udn_id = udn.idUDN'
        ];

        $whereClause = "1=1";
        $data = [];

        // Filtro por estatus (activo/inactivo)
        if (isset($params[0]) && $params[0] !== '') {
            $whereClause .= " AND cliente.active = ?";
            $data[] = $params[0];
        }

        // Filtro por unidad de negocio
        if (isset($params[1]) && $params[1] !== '' && $params[1] !== 'all') {
            $whereClause .= " AND cliente.udn_id = ?";
            $data[] = $params[1];
        }

        // Filtro por tipo VIP
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

    /**
     * Obtiene un cliente específico por ID con su domicilio
     * @param int $id ID del cliente
     * @return array|null Datos del cliente o null si no existe
     */
    function getClienteById($id) {
        // Obtener datos del cliente
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

        // Obtener domicilio principal del cliente
        $domicilio = $this->_Select([
            'table' => "{$this->bd}domicilio_cliente",
            'values' => '*',
            'where' => 'cliente_id = ? AND es_principal = 1',
            'data' => [$id]
        ]);

        // Agregar domicilio al array del cliente
        if (!empty($domicilio)) {
            $clienteData['domicilio'] = $domicilio[0];
        } else {
            $clienteData['domicilio'] = null;
        }

        return $clienteData;
    }

    /**
     * Crea un nuevo cliente
     * @param array $data Datos del cliente con prepared statement format
     * @return bool True si se creó correctamente
     */
    function createCliente($data) {
        return $this->_Insert([
            'table' => "{$this->bd}cliente",
            'values' => $data['values'],
            'data' => $data['data']
        ]);
    }

    /**
     * Crea un domicilio para un cliente
     * @param array $data Datos del domicilio con prepared statement format
     * @return bool True si se creó correctamente
     */
    function createDomicilio($data) {
        return $this->_Insert([
            'table' => "{$this->bd}domicilio_cliente",
            'values' => $data['values'],
            'data' => $data['data']
        ]);
    }

    /**
     * Actualiza los datos de un cliente
     * @param array $data Datos del cliente con prepared statement format
     * @return bool True si se actualizó correctamente
     */
    function updateCliente($data) {
        return $this->_Update([
            'table' => "{$this->bd}cliente",
            'values' => $data['values'],
            'where' => 'id = ?',
            'data' => $data['data']
        ]);
    }

    /**
     * Actualiza el domicilio de un cliente
     * @param array $data Datos del domicilio con prepared statement format
     * @return bool True si se actualizó correctamente
     */
    function updateDomicilio($data) {
        return $this->_Update([
            'table' => "{$this->bd}domicilio_cliente",
            'values' => $data['values'],
            'where' => 'cliente_id = ? AND es_principal = 1',
            'data' => $data['data']
        ]);
    }

    /**
     * Verifica si existe un cliente con el teléfono especificado
     * @param string $telefono Teléfono a verificar
     * @param int|null $excludeId ID del cliente a excluir (para edición)
     * @return int Cantidad de clientes encontrados
     */
    function existsClienteByPhone($telefono, $excludeId = null) {
        $query = "
            SELECT COUNT(*) as total
            FROM {$this->bd}cliente 
            WHERE telefono = ?
        ";
        
        $params = [$telefono];

        // Si se proporciona un ID, excluirlo de la búsqueda (para edición)
        if ($excludeId !== null) {
            $query .= " AND id != ?";
            $params[] = $excludeId;
        }

        $result = $this->_Read($query, $params);
        return isset($result[0]['total']) ? (int)$result[0]['total'] : 0;
    }

    /**
     * Obtiene el domicilio principal de un cliente
     * @param int $clienteId ID del cliente
     * @return array|null Datos del domicilio o null si no existe
     */
    function getDomicilioPrincipal($clienteId) {
        $result = $this->_Select([
            'table' => "{$this->bd}domicilio_cliente",
            'values' => '*',
            'where' => 'cliente_id = ? AND es_principal = 1',
            'data' => [$clienteId]
        ]);

        return !empty($result) ? $result[0] : null;
    }

    // ============================================
    // CATÁLOGOS - Unidades de Negocio
    // ============================================

    /**
     * Lista todas las unidades de negocio activas
     * @return array Lista de UDN
     */
    function lsUDN() {
        return $this->_Select([
            'table' => "udn",
            'values' => "idUDN as id, UDN as valor, Abreviatura",
            'where' => 'Stado = 1',
            'order' => ['ASC' => 'UDN']
        ]);
    }

    // ============================================
    // REPORTES Y ESTADÍSTICAS
    // ============================================

    /**
     * Obtiene el total de clientes activos
     * @param int|null $udnId Filtrar por unidad de negocio (opcional)
     * @return int Total de clientes activos
     */
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

    /**
     * Obtiene el total de clientes VIP activos
     * @param int|null $udnId Filtrar por unidad de negocio (opcional)
     * @return int Total de clientes VIP
     */
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

    /**
     * Obtiene clientes con cumpleaños en el mes actual
     * @param int|null $udnId Filtrar por unidad de negocio (opcional)
     * @return array Lista de clientes con cumpleaños
     */
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
