<?php
/**
 * Script de instalación para la tabla warehouse_output
 * Ejecutar una sola vez: http://localhost/contabilidad/administrador/install-warehouse-output.php
 */

// Configuración de base de datos
$host = 'localhost';
$dbname = 'rfwsmqex_contabilidad';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "
    CREATE TABLE IF NOT EXISTS `warehouse_output` (
        `id` INT(11) NOT NULL AUTO_INCREMENT,
        `insumo_id` INT(11) NOT NULL COMMENT 'ID del insumo/almacén',
        `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Cantidad/Monto de la salida',
        `description` TEXT NULL COMMENT 'Descripción opcional de la salida',
        `operation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de la operación',
        `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Eliminado',
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        INDEX `idx_insumo` (`insumo_id`),
        INDEX `idx_active` (`active`),
        INDEX `idx_operation_date` (`operation_date`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Salidas de almacén';
    ";
    
    $pdo->exec($sql);
    
    echo "✅ <strong>Tabla 'warehouse_output' creada exitosamente</strong><br><br>";
    echo "📋 Estructura de la tabla:<br>";
    echo "<pre>";
    echo "- id (INT, AUTO_INCREMENT, PRIMARY KEY)\n";
    echo "- insumo_id (INT, NOT NULL)\n";
    echo "- amount (DECIMAL(10,2), NOT NULL)\n";
    echo "- description (TEXT, NULL)\n";
    echo "- operation_date (DATETIME, NOT NULL)\n";
    echo "- active (TINYINT(1), DEFAULT 1)\n";
    echo "- created_at (TIMESTAMP)\n";
    echo "- updated_at (TIMESTAMP)\n";
    echo "</pre>";
    
    echo "<br>🎯 <strong>Siguiente paso:</strong><br>";
    echo "Accede al módulo en: <a href='salidas-almacen.php'>salidas-almacen.php</a><br><br>";
    
    echo "⚠️ <strong>Importante:</strong> Elimina este archivo después de ejecutarlo por seguridad.";
    
} catch(PDOException $e) {
    echo "❌ <strong>Error al crear la tabla:</strong><br>";
    echo $e->getMessage();
    echo "<br><br>";
    echo "💡 <strong>Posibles soluciones:</strong><br>";
    echo "1. Verifica que la base de datos 'rfwsmqex_contabilidad' exista<br>";
    echo "2. Verifica las credenciales de MySQL (usuario/contraseña)<br>";
    echo "3. Verifica que el servidor MySQL esté corriendo<br>";
}
?>
