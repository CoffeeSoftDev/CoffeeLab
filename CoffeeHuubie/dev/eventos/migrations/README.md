# Migraciones de Base de Datos - Módulo Eventos

Este directorio contiene los scripts de migración SQL para el módulo de eventos del sistema CoffeeSoft.

## 📋 Lista de Migraciones

| # | Archivo | Descripción | Fecha |
|---|---------|-------------|-------|
| 001 | `001_create_package_check_tables.sql` | Crea tablas para gestión de paquetes y productos relacionados | 2025-01-30 |

## 🚀 Cómo Ejecutar una Migración

### Opción 1: Desde phpMyAdmin

1. Accede a phpMyAdmin
2. Selecciona la base de datos del proyecto
3. Ve a la pestaña "SQL"
4. Copia y pega el contenido del archivo de migración
5. Haz clic en "Continuar" para ejecutar

### Opción 2: Desde línea de comandos (MySQL CLI)

```bash
# Conectarse a MySQL
mysql -u usuario -p nombre_base_datos

# Ejecutar el archivo de migración
source /ruta/completa/dev/eventos/migrations/001_create_package_check_tables.sql

# O en una sola línea
mysql -u usuario -p nombre_base_datos < dev/eventos/migrations/001_create_package_check_tables.sql
```

### Opción 3: Desde PHP (script de migración)

Puedes crear un archivo `run_migration.php` en el directorio raíz:

```php
<?php
require_once 'conf/_CRUD.php';

$db = new CRUD();
$sql = file_get_contents(__DIR__ . '/eventos/migrations/001_create_package_check_tables.sql');

// Dividir por punto y coma para ejecutar múltiples queries
$queries = array_filter(array_map('trim', explode(';', $sql)));

foreach ($queries as $query) {
    if (!empty($query) && !preg_match('/^--/', $query)) {
        try {
            $db->query($query);
            echo "✓ Query ejecutado correctamente\n";
        } catch (Exception $e) {
            echo "✗ Error: " . $e->getMessage() . "\n";
        }
    }
}

echo "\n✅ Migración completada\n";
?>
```

## ⚠️ Antes de Ejecutar

1. **Hacer backup de la base de datos**:
   ```bash
   mysqldump -u usuario -p nombre_base_datos > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Verificar que las tablas referenciadas existen**:
   - `evt_events_package`
   - `evt_products`
   - `evt_package_products`

3. **Revisar el script** para asegurarte de que es compatible con tu versión de MySQL/MariaDB

## 🔍 Verificación Post-Migración

Después de ejecutar la migración, verifica que todo se creó correctamente:

```sql
-- Verificar que las tablas existen
SHOW TABLES LIKE 'evt_%check%';

-- Verificar estructura de evt_package_check
DESCRIBE evt_package_check;

-- Verificar estructura de evt_check_products
DESCRIBE evt_check_products;

-- Verificar foreign keys
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME IN ('evt_package_check', 'evt_check_products')
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Verificar datos migrados
SELECT COUNT(*) as total_checks FROM evt_package_check;
SELECT COUNT(*) as total_products FROM evt_check_products;
```

## 🔄 Rollback

Si necesitas revertir una migración, cada archivo incluye una sección de rollback al final. **Úsala con precaución** ya que eliminará datos.

```sql
-- Ejemplo de rollback para migración 001
DROP TABLE IF EXISTS evt_check_products;
DROP TABLE IF EXISTS evt_package_check;
```

## 📝 Notas Importantes

- Las migraciones deben ejecutarse en orden numérico
- Nunca modifiques una migración que ya fue ejecutada en producción
- Si necesitas hacer cambios, crea una nueva migración
- Mantén siempre un backup antes de ejecutar migraciones en producción
- Las tablas usan `ON DELETE CASCADE` para mantener integridad referencial

## 🆘 Solución de Problemas

### Error: "Table already exists"

Si ves este error, la tabla ya fue creada. Puedes:
1. Verificar si la estructura es correcta con `DESCRIBE nombre_tabla`
2. Si necesitas recrearla, primero ejecuta el rollback

### Error: "Cannot add foreign key constraint"

Esto significa que:
1. La tabla referenciada no existe
2. El tipo de dato de la columna no coincide
3. El valor que intentas referenciar no existe

Verifica que las tablas `evt_events_package` y `evt_products` existan y tengan los IDs correctos.

### Error: "Duplicate entry"

Si la migración de datos falla por duplicados:
1. Verifica que no hayas ejecutado la migración anteriormente
2. Revisa la cláusula `WHERE NOT EXISTS` en los INSERT

## 📞 Soporte

Si encuentras problemas con las migraciones, contacta al equipo de desarrollo o revisa la documentación en `.kiro/specs/package-product-management/`.
