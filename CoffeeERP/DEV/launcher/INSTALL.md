# 🚀 Instalación Rápida - ERP Launcher

## Pasos de Instalación

### 1. Ejecutar Script SQL

Ejecuta el archivo `database_schema.sql` en tu base de datos `erp_varoch`:

```bash
mysql -u root -p erp_varoch < database_schema.sql
```

### 2. Verificar Estructura

El script realiza las siguientes acciones:

✅ Agrega campos a la tabla `modulos`:
- `mod_descripcion` - Descripción del módulo
- `mod_icono` - Clase de icono Font Awesome
- `mod_color` - Color del icono (Tailwind)
- `mod_badge` - Badge de estado (nuevo/legacy)

✅ Crea tabla `modulos_access_logs` para auditoría

✅ Actualiza módulos existentes con información visual

### 3. Acceder al Launcher

Abre tu navegador y ve a:

```
http://localhost/launcher/index.php
```

O en producción:

```
https://tu-dominio.com/launcher/index.php
```

### 4. Configurar como Página de Inicio

Para que el launcher sea la página principal después del login, modifica el archivo de redirección después de autenticación:

**En `acceso/ctrl/ctrl-login.php` (o similar):**

```php
// Cambiar de:
header('Location: ../kpi/index.php');

// A:
header('Location: ../launcher/index.php');
```

## Verificación

### Verificar Módulos en Base de Datos

```sql
SELECT 
    idModulo,
    modulo,
    mod_descripcion,
    mod_icono,
    mod_color,
    mod_badge,
    mod_estado
FROM modulos
WHERE mod_estado = 1
ORDER BY mod_orden;
```

### Verificar Logs de Acceso

```sql
SELECT 
    l.*,
    m.modulo
FROM modulos_access_logs l
LEFT JOIN modulos m ON l.module_id = m.idModulo
ORDER BY l.access_date DESC
LIMIT 10;
```

## Solución de Problemas

### Problema: No se muestran módulos

**Solución:**
1. Verifica que los módulos tengan `mod_estado = 1`
2. Ejecuta:
```sql
UPDATE modulos SET mod_estado = 1 WHERE modulo IN ('KPI', 'PRODUCCION', 'CONTABILIDAD', 'COSTSYS');
```

### Problema: Error de sesión

**Solución:**
1. Verifica que `session_start()` esté al inicio de `index.php`
2. Confirma que `$_SESSION['user_id']` esté definido después del login

### Problema: Módulos no redirigen correctamente

**Solución:**
1. Verifica las rutas en `mod_ruta` de la tabla `modulos`
2. Ajusta las rutas según tu estructura:
```sql
UPDATE modulos SET mod_ruta = '../kpi/index.php' WHERE modulo = 'KPI';
UPDATE modulos SET mod_ruta = '../produccion/index.php' WHERE modulo = 'PRODUCCION';
```

## Personalización

### Agregar Nuevo Módulo

```sql
INSERT INTO modulos (
    modulo, 
    mod_ruta, 
    mod_descripcion, 
    mod_icono, 
    mod_color, 
    mod_badge, 
    mod_estado, 
    mod_orden
) VALUES (
    'NUEVO_MODULO',
    '../nuevo-modulo/index.php',
    'Descripción del módulo',
    'icon-star',
    'text-yellow-600',
    'nuevo',
    1,
    10
);
```

### Cambiar Orden de Módulos

```sql
UPDATE modulos SET mod_orden = 1 WHERE modulo = 'KPI';
UPDATE modulos SET mod_orden = 2 WHERE modulo = 'PRODUCCION';
UPDATE modulos SET mod_orden = 3 WHERE modulo = 'CONTABILIDAD';
UPDATE modulos SET mod_orden = 4 WHERE modulo = 'COSTSYS';
```

### Cambiar Iconos

Iconos disponibles (Simple Line Icons):
- `icon-chart` - Gráficos
- `icon-cog` - Configuración
- `icon-calculator` - Calculadora
- `icon-dollar` - Dinero
- `icon-users` - Usuarios
- `icon-calendar` - Calendario
- `icon-clipboard` - Portapapeles
- `icon-grid` - Grid
- `icon-home` - Inicio

```sql
UPDATE modulos SET mod_icono = 'icon-chart' WHERE modulo = 'KPI';
```

## Mantenimiento

### Limpiar Logs Antiguos

```sql
-- Eliminar logs de más de 90 días
DELETE FROM modulos_access_logs 
WHERE access_date < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

### Estadísticas de Uso

```sql
-- Módulos más accedidos
SELECT 
    m.modulo,
    COUNT(*) as accesos
FROM modulos_access_logs l
JOIN modulos m ON l.module_id = m.idModulo
GROUP BY m.modulo
ORDER BY accesos DESC;
```

## Soporte

Para más información, consulta el archivo `README.md` o contacta al equipo de desarrollo.
