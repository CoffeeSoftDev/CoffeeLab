<?php
/**
 * Configuración de Base de Datos - SoftRestaurant
 * 
 * INSTRUCCIONES:
 * 1. Copiar este archivo como database.php
 * 2. Actualizar las credenciales con los valores correctos
 * 3. Verificar que el nombre de la base de datos siga la convención
 */

// Configuración de conexión
define('DB_HOST', 'localhost');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_contraseña');
define('DB_NAME', 'rfwsmqex_softrestaurant'); // Convención: rfwsmqex_[nombre_proyecto]
define('DB_CHARSET', 'utf8mb4');

// Configuración adicional
define('DB_PREFIX', 'softrestaurant_'); // Prefijo de tablas
define('DB_COLLATE', 'utf8mb4_unicode_ci');

/**
 * Tablas del sistema
 */
define('TABLE_PRODUCTOS', DB_PREFIX . 'productos');
define('TABLE_PRODUCTOS_VENDIDOS', DB_PREFIX . 'productos_vendidos');
define('TABLE_SALIDAS', DB_PREFIX . 'salidas');
define('TABLE_COSTO_POTENCIAL', DB_PREFIX . 'costo_potencial');
define('TABLE_ARCHIVOS_DIARIOS', DB_PREFIX . 'archivos_diarios');
define('TABLE_CATEGORIAS', DB_PREFIX . 'categorias');
define('TABLE_UDN', DB_PREFIX . 'udn');

/**
 * Configuración de errores
 */
define('DB_DEBUG', true); // Cambiar a false en producción
define('DB_LOG_ERRORS', true);
define('DB_ERROR_LOG_FILE', __DIR__ . '/../logs/db_errors.log');

/**
 * Configuración de conexión
 */
define('DB_PERSISTENT', false); // Conexión persistente
define('DB_TIMEOUT', 30); // Timeout en segundos

/**
 * Notas de implementación:
 * 
 * - La clase CRUD en _CRUD.php debe usar estas constantes
 * - Verificar que todas las tablas existan en la base de datos
 * - Ejecutar scripts de migración si es necesario
 * - Probar conexión antes de desplegar
 */
