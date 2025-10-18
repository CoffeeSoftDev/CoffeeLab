<?php
/**
 * Controlador - Gestión de Clientes
 * Sistema: KPI / Marketing - CoffeeSoft ERP
 * 
 * Este controlador maneja todas las peticiones AJAX del módulo de clientes,
 * valida datos de entrada y coordina las operaciones del modelo
 */

session_start();
if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-clientes.php';

class ctrl extends mdl {

    /**
     * Inicializa el módulo cargando datos necesarios
     * @return array Datos iniciales (UDN)
     */
    function init() {
        return [
            'udn' => $this->lsUDN()
        ];
    }

    // ============================================
    // GESTIÓN DE CLIENTES
    // ============================================

    /**
     * Lista clientes con filtros y formatea para tabla
     * @return array Filas formateadas y datos originales
     */
    function listClientes() {
        $__row = [];
        
        // Obtener filtros
        $active = isset($_POST['active']) ? $_POST['active'] : 1;
        $udnId = isset($_POST['udn_id']) && $_POST['udn_id'] !== 'all' ? $_POST['udn_id'] : null;
        $vip = isset($_POST['vip']) && $_POST['vip'] !== 'all' ? $_POST['vip'] : null;

        // Obtener lista de clientes
        $ls = $this->lsClientes([$active, $udnId, $vip]);

        foreach ($ls as $key) {
            $a = [];

            // Formatear nombre completo
            $nombreCompleto = trim($key['nombre'] . ' ' . $key['apellido_paterno'] . ' ' . $key['apellido_materno']);

            // Badge VIP
            $badgeVIP = $key['vip'] == 1 
                ? '<span class="px-2 py-1 rounded-md text-xs font-semibold bg-yellow-500 text-white"><i class="icon-star"></i> VIP</span>' 
                : '<span class="px-2 py-1 rounded-md text-xs font-semibold bg-gray-300 text-gray-600">Regular</span>';

            // Botones de acción según estatus
            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'clientes.editCliente(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'clientes.statusCliente(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-success',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'clientes.statusCliente(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Nombre Completo' => $nombreCompleto,
                'Teléfono' => $key['telefono'],
                'Correo' => $key['correo'] ?? '-',
                'Unidad de Negocio' => $key['udn_nombre'],
                'Estatus' => renderStatus($key['active']),
                'VIP' => ['html' => $badgeVIP, 'class' => 'text-center'],
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    /**
     * Obtiene un cliente específico por ID
     * @return array Status, mensaje y datos del cliente
     */
    function getCliente() {
        $status = 500;
        $message = 'Error al obtener los datos del cliente';
        $data = null;

        if (empty($_POST['id'])) {
            return [
                'status' => 400,
                'message' => 'ID de cliente no proporcionado',
                'data' => null
            ];
        }

        $cliente = $this->getClienteById($_POST['id']);

        if ($cliente) {
            $status = 200;
            $message = 'Cliente obtenido correctamente';
            $data = $cliente;
        } else {
            $status = 404;
            $message = 'Cliente no encontrado';
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Crea un nuevo cliente con validaciones
     * @return array Status y mensaje de resultado
     */
    function addCliente() {
        $status = 500;
        $message = 'No se pudo registrar el cliente';

        // Validar campos obligatorios
        if (empty($_POST['nombre']) || empty($_POST['telefono']) || empty($_POST['udn_id'])) {
            return [
                'status' => 400,
                'message' => 'Los campos Nombre, Teléfono y Unidad de Negocio son obligatorios'
            ];
        }

        // Validar formato de teléfono
        if (!is_numeric($_POST['telefono']) || strlen($_POST['telefono']) < 10) {
            return [
                'status' => 400,
                'message' => 'El teléfono debe tener al menos 10 dígitos numéricos'
            ];
        }

        // Validar formato de correo (si se proporciona)
        if (!empty($_POST['correo']) && !filter_var($_POST['correo'], FILTER_VALIDATE_EMAIL)) {
            return [
                'status' => 400,
                'message' => 'El formato del correo electrónico no es válido'
            ];
        }

        // Validar domicilio obligatorio
        if (empty($_POST['calle'])) {
            return [
                'status' => 400,
                'message' => 'El domicilio (calle) es obligatorio'
            ];
        }

        // Verificar si ya existe un cliente con ese teléfono
        $exists = $this->existsClienteByPhone($_POST['telefono']);
        if ($exists > 0) {
            return [
                'status' => 409,
                'message' => 'Ya existe un cliente registrado con ese número de teléfono'
            ];
        }

        // Preparar datos del cliente
        $_POST['fecha_creacion'] = date('Y-m-d H:i:s');
        $_POST['active'] = 1;
        $_POST['vip'] = isset($_POST['vip']) && $_POST['vip'] == 1 ? 1 : 0;

        // Guardar datos del domicilio antes de eliminarlos del POST
        $domicilioData = [
            'calle' => $_POST['calle'] ?? '',
            'numero_exterior' => $_POST['numero_exterior'] ?? '',
            'numero_interior' => $_POST['numero_interior'] ?? '',
            'colonia' => $_POST['colonia'] ?? '',
            'ciudad' => $_POST['ciudad'] ?? '',
            'estado' => $_POST['estado'] ?? '',
            'codigo_postal' => $_POST['codigo_postal'] ?? '',
            'referencias' => $_POST['referencias'] ?? '',
            'es_principal' => 1
        ];

        // Eliminar campos de domicilio del POST para no insertarlos en la tabla cliente
        unset($_POST['calle'], $_POST['numero_exterior'], $_POST['numero_interior'], 
              $_POST['colonia'], $_POST['ciudad'], $_POST['estado'], 
              $_POST['codigo_postal'], $_POST['referencias']);

        // Crear cliente
        $clienteId = $this->createCliente($this->util->sql($_POST));

        if ($clienteId) {
            // Crear domicilio asociado
            $domicilioData['cliente_id'] = $clienteId;
            $domicilioCreated = $this->createDomicilio($this->util->sql($domicilioData));

            if ($domicilioCreated) {
                $status = 200;
                $message = 'Cliente registrado correctamente';
            } else {
                $status = 200;
                $message = 'Cliente registrado pero hubo un error al guardar el domicilio';
            }
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    /**
     * Actualiza los datos de un cliente existente
     * @return array Status y mensaje de resultado
     */
    function editCliente() {
        $status = 500;
        $message = 'Error al actualizar el cliente';

        // Validar campos obligatorios
        if (empty($_POST['id']) || empty($_POST['nombre']) || empty($_POST['telefono']) || empty($_POST['udn_id'])) {
            return [
                'status' => 400,
                'message' => 'Los campos ID, Nombre, Teléfono y Unidad de Negocio son obligatorios'
            ];
        }

        // Validar formato de teléfono
        if (!is_numeric($_POST['telefono']) || strlen($_POST['telefono']) < 10) {
            return [
                'status' => 400,
                'message' => 'El teléfono debe tener al menos 10 dígitos numéricos'
            ];
        }

        // Validar formato de correo (si se proporciona)
        if (!empty($_POST['correo']) && !filter_var($_POST['correo'], FILTER_VALIDATE_EMAIL)) {
            return [
                'status' => 400,
                'message' => 'El formato del correo electrónico no es válido'
            ];
        }

        // Verificar si ya existe otro cliente con ese teléfono (excluyendo el actual)
        $exists = $this->existsClienteByPhone($_POST['telefono'], $_POST['id']);
        if ($exists > 0) {
            return [
                'status' => 409,
                'message' => 'Ya existe otro cliente registrado con ese número de teléfono'
            ];
        }

        // Actualizar VIP
        $_POST['vip'] = isset($_POST['vip']) && $_POST['vip'] == 1 ? 1 : 0;

        // Guardar datos del domicilio antes de eliminarlos del POST
        $domicilioData = [
            'calle' => $_POST['calle'] ?? '',
            'numero_exterior' => $_POST['numero_exterior'] ?? '',
            'numero_interior' => $_POST['numero_interior'] ?? '',
            'colonia' => $_POST['colonia'] ?? '',
            'ciudad' => $_POST['ciudad'] ?? '',
            'estado' => $_POST['estado'] ?? '',
            'codigo_postal' => $_POST['codigo_postal'] ?? '',
            'referencias' => $_POST['referencias'] ?? '',
            'cliente_id' => $_POST['id']
        ];

        // Eliminar campos de domicilio del POST
        unset($_POST['calle'], $_POST['numero_exterior'], $_POST['numero_interior'], 
              $_POST['colonia'], $_POST['ciudad'], $_POST['estado'], 
              $_POST['codigo_postal'], $_POST['referencias']);

        // Actualizar cliente
        $updated = $this->updateCliente($this->util->sql($_POST, 1));

        if ($updated) {
            // Verificar si existe domicilio
            $domicilioExiste = $this->getDomicilioPrincipal($_POST['id']);

            if ($domicilioExiste) {
                // Actualizar domicilio existente
                $this->updateDomicilio($this->util->sql($domicilioData, 1));
            } else {
                // Crear nuevo domicilio
                $domicilioData['es_principal'] = 1;
                $this->createDomicilio($this->util->sql($domicilioData));
            }

            $status = 200;
            $message = 'Cliente actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    /**
     * Cambia el estatus de un cliente (activo/inactivo)
     * @return array Status y mensaje de resultado
     */
    function statusCliente() {
        $status = 500;
        $message = 'No se pudo actualizar el estatus del cliente';

        if (empty($_POST['id'])) {
            return [
                'status' => 400,
                'message' => 'ID de cliente no proporcionado'
            ];
        }

        // Invertir el estatus actual
        $_POST['active'] = $_POST['active'] == 1 ? 0 : 1;

        $updated = $this->updateCliente($this->util->sql($_POST, 1));

        if ($updated) {
            $status = 200;
            $nuevoEstatus = $_POST['active'] == 1 ? 'activado' : 'desactivado';
            $message = "El cliente ha sido {$nuevoEstatus} correctamente";
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // ============================================
    // REPORTES Y ESTADÍSTICAS
    // ============================================

    /**
     * Obtiene estadísticas generales de clientes
     * @return array Estadísticas de clientes
     */
    function getEstadisticas() {
        $udnId = isset($_POST['udn_id']) && $_POST['udn_id'] !== 'all' ? $_POST['udn_id'] : null;

        $totalActivos = $this->getTotalClientesActivos($udnId);
        $totalVIP = $this->getTotalClientesVIP($udnId);
        $cumpleañosMes = $this->getClientesCumpleañosMes($udnId);

        return [
            'status' => 200,
            'data' => [
                'total_activos' => $totalActivos,
                'total_vip' => $totalVIP,
                'cumpleaños_mes' => count($cumpleañosMes),
                'lista_cumpleaños' => $cumpleañosMes
            ]
        ];
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Renderiza el badge de estatus (activo/inactivo)
 * @param int $status Estatus (1 = activo, 0 = inactivo)
 * @return string HTML del badge
 */
function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#014737] text-[#3FC189]">Activo</span>';
        case 0:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-[#721c24] text-[#ba464d]">Inactivo</span>';
        default:
            return '<span class="px-2 py-1 rounded-md text-sm font-semibold bg-gray-500 text-white">Desconocido</span>';
    }
}

/**
 * Formatea fecha en español
 * @param string $date Fecha en formato Y-m-d
 * @return string Fecha formateada
 */
function formatSpanishDate($date) {
    if (empty($date)) return '-';
    $timestamp = strtotime($date);
    $months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return date('d', $timestamp) . ' ' . $months[date('n', $timestamp) - 1] . ' ' . date('Y', $timestamp);
}

// Ejecutar método solicitado
$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
