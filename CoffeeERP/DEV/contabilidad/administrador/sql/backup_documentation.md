# Documentación de Backup - Modelo de Banco

## Fecha de Backup
**Fecha:** 2025-10-26  
**Responsable:** Sistema CoffeeIA  
**Propósito:** Backup antes de actualización del modelo de banco

---

## Estado Actual de las Tablas

### Tabla: banks

**Estructura Actual:**
```sql
-- Estructura esperada basada en el código actual
CREATE TABLE banks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Datos de Referencia:**
- La tabla almacena el catálogo de bancos disponibles
- Campo `name` debe ser único (validado en aplicación)
- Campo `active` controla visibilidad (1=activo, 0=inactivo)

---

### Tabla: bank_accounts

**Estructura Actual:**
```sql
-- Estructura esperada basada en el código actual
CREATE TABLE bank_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    bank_id INT NOT NULL,
    account_alias VARCHAR(100) DEFAULT NULL,
    last_four_digits CHAR(4) NOT NULL,
    payment_method_id INT DEFAULT NULL,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Relaciones Actuales:**
- `bank_id` → referencia a tabla `banks`
- `udn_id` → referencia a tabla `udn`
- `payment_method_id` → referencia a tabla `payment_methods`

**Nota:** Las foreign keys pueden no estar implementadas a nivel de base de datos, solo a nivel de aplicación.

---

## Script de Backup

### Backup Completo de Tablas

```sql
-- =====================================================
-- BACKUP DE TABLAS - Ejecutar ANTES de la migración
-- =====================================================

-- Backup de tabla banks
CREATE TABLE banks_backup_20251026 AS SELECT * FROM rfwsmqex_contabilidad.banks;

-- Backup de tabla bank_accounts
CREATE TABLE bank_accounts_backup_20251026 AS SELECT * FROM rfwsmqex_contabilidad.bank_accounts;

-- Verificar backups
SELECT COUNT(*) as total_banks FROM banks_backup_20251026;
SELECT COUNT(*) as total_accounts FROM bank_accounts_backup_20251026;
```

### Verificación de Integridad

```sql
-- Verificar que los backups tengan la misma cantidad de registros
SELECT 
    (SELECT COUNT(*) FROM rfwsmqex_contabilidad.banks) as original_banks,
    (SELECT COUNT(*) FROM banks_backup_20251026) as backup_banks,
    (SELECT COUNT(*) FROM rfwsmqex_contabilidad.bank_accounts) as original_accounts,
    (SELECT COUNT(*) FROM bank_accounts_backup_20251026) as backup_accounts;
```

---

## Script de Rollback

En caso de que la migración falle, ejecutar el siguiente script para restaurar:

```sql
-- =====================================================
-- ROLLBACK - Restaurar desde backup
-- =====================================================

-- Eliminar tablas actuales
DROP TABLE IF EXISTS rfwsmqex_contabilidad.bank_accounts;
DROP TABLE IF EXISTS rfwsmqex_contabilidad.banks;

-- Restaurar desde backup
CREATE TABLE rfwsmqex_contabilidad.banks AS 
SELECT * FROM banks_backup_20251026;

CREATE TABLE rfwsmqex_contabilidad.bank_accounts AS 
SELECT * FROM bank_accounts_backup_20251026;

-- Verificar restauración
SELECT COUNT(*) as restored_banks FROM rfwsmqex_contabilidad.banks;
SELECT COUNT(*) as restored_accounts FROM rfwsmqex_contabilidad.bank_accounts;
```

---

## Checklist de Verificación

### Antes de la Migración
- [ ] Ejecutar script de backup
- [ ] Verificar que las tablas de backup se crearon correctamente
- [ ] Verificar que el conteo de registros coincida
- [ ] Documentar cantidad de registros en cada tabla
- [ ] Verificar permisos de usuario para ejecutar DDL

### Después de la Migración
- [ ] Verificar que las tablas actualizadas existan
- [ ] Verificar que los datos se hayan preservado
- [ ] Verificar que las foreign keys estén creadas
- [ ] Verificar que los índices estén creados
- [ ] Ejecutar queries de prueba

### En Caso de Rollback
- [ ] Ejecutar script de rollback
- [ ] Verificar que las tablas se restauraron
- [ ] Verificar que el conteo de registros coincida con el backup
- [ ] Notificar al equipo sobre el rollback
- [ ] Investigar causa del fallo

---

## Información Adicional

### Tablas Relacionadas
- `payment_methods` - Formas de pago (no se modifica)
- `udn` - Unidades de negocio (no se modifica)

### Archivos Afectados
- `contabilidad/administrador/mdl/mdl-banco.php` - Se agregará método updateBank()
- `contabilidad/administrador/ctrl/ctrl-banco.php` - Sin cambios
- `contabilidad/administrador/js/banco.js` - Sin cambios

### Consideraciones de Seguridad
- Los backups contienen datos sensibles (información bancaria)
- Mantener backups en ubicación segura
- Eliminar backups después de verificar migración exitosa (30 días)
- No compartir backups fuera del equipo autorizado

---

## Notas del Sistema

**Estado:** Documentación creada  
**Próximo Paso:** Crear script SQL de actualización (Tarea 2)  
**Responsable de Ejecución:** Administrador de Base de Datos  
**Ambiente:** Desarrollo → Producción

---

## Registro de Cambios

| Fecha | Acción | Responsable | Notas |
|-------|--------|-------------|-------|
| 2025-10-26 | Documentación creada | CoffeeIA | Preparación para migración |
| - | Backup ejecutado | - | Pendiente |
| - | Migración ejecutada | - | Pendiente |
| - | Verificación completada | - | Pendiente |
