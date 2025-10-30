# 🚀 Guía de Implementación - Módulo de Gestión de Paquetes y Productos

## 📋 Resumen

Este módulo permite gestionar automáticamente los productos relacionados con cada paquete de evento, proporcionando una interfaz visual con checkboxes para activar/desactivar productos individuales.

## ✅ Archivos Modificados/Creados

### Base de Datos
- ✅ `migrations/001_create_package_check_tables.sql` - Script de migración
- ✅ `migrations/README.md` - Documentación de migraciones

### Backend
- ✅ `mdl/mdl-eventos.php` - 7 nuevas funciones del modelo
- ✅ `ctrl/ctrl-eventos.php` - 3 nuevas funciones + 2 modificadas

### Frontend
- ✅ `src/js/eventos.js` - 1 nueva función + event handler
- ✅ `src/css/package-check.css` - Estilos para checkboxes

### Documentación
- ✅ `IMPLEMENTATION_GUIDE.md` - Este archivo
- ✅ `.kiro/specs/package-product-management/` - Especificación completa

## 🔧 Pasos de Instalación

### Paso 1: Ejecutar Migración de Base de Datos

#### Opción A: Desde phpMyAdmin
1. Accede a phpMyAdmin
2. Selecciona tu base de datos
3. Ve a la pestaña "SQL"
4. Copia y pega el contenido de `migrations/001_create_package_check_tables.sql`
5. Haz clic en "Continuar"

#### Opción B: Desde MySQL CLI
```bash
mysql -u usuario -p nombre_base_datos < dev/eventos/migrations/001_create_package_check_tables.sql
```

#### Verificación
Ejecuta estas queries para verificar que las tablas se crearon:
```sql
SHOW TABLES LIKE 'evt_%check%';
DESCRIBE evt_package_check;
DESCRIBE evt_check_products;
```

### Paso 2: Importar CSS

Agrega esta línea en el `<head>` de tu archivo HTML principal (probablemente `index.php`):

```html
<link rel="stylesheet" href="src/css/package-check.css">
```

### Paso 3: Verificar Archivos

Asegúrate de que estos archivos existen y están actualizados:
- ✅ `dev/eventos/mdl/mdl-eventos.php`
- ✅ `dev/eventos/ctrl/ctrl-eventos.php`
- ✅ `dev/eventos/src/js/eventos.js`
- ✅ `dev/eventos/src/css/package-check.css`

## 🧪 Pruebas Funcionales

### Test 1: Crear Evento con Paquete
1. Ve a la sección de eventos
2. Crea un nuevo evento
3. Agrega un paquete (menú)
4. Guarda el evento
5. **Verificar en BD**: Debe existir un registro en `evt_package_check` y múltiples en `evt_check_products`

```sql
-- Verificar registros creados
SELECT * FROM evt_package_check ORDER BY id DESC LIMIT 5;
SELECT * FROM evt_check_products ORDER BY id DESC LIMIT 10;
```

### Test 2: Ver Detalles del Evento
1. Abre el evento que acabas de crear
2. Ve a la pestaña "Menú"
3. **Verificar**: Debes ver checkboxes para cada producto del paquete
4. **Verificar**: Todos los checkboxes deben estar marcados por defecto

### Test 3: Cambiar Estado de Producto
1. Desmarca un checkbox de un producto
2. **Verificar**: Debe aparecer una animación flash verde
3. **Verificar**: No debe recargar la página
4. Recarga la página manualmente
5. **Verificar**: El checkbox debe seguir desmarcado

```sql
-- Verificar cambio en BD
SELECT 
    cp.id,
    cp.active,
    p.name as product_name
FROM evt_check_products cp
INNER JOIN evt_products p ON cp.product_id = p.id
WHERE cp.package_check_id = [ID_DEL_CHECK]
ORDER BY p.name;
```

### Test 4: Editar Evento
1. Edita un evento existente con paquetes
2. Modifica el menú (agrega o quita paquetes)
3. Guarda los cambios
4. **Verificar**: Los estados personalizados de productos se mantienen
5. **Verificar**: No hay duplicados en `evt_check_products`

```sql
-- Verificar que no hay duplicados
SELECT 
    package_check_id,
    product_id,
    COUNT(*) as count
FROM evt_check_products
GROUP BY package_check_id, product_id
HAVING count > 1;
```

## 🐛 Solución de Problemas

### Error: "No se encontró registro de control"
**Causa**: El paquete no tiene un registro en `evt_package_check`

**Solución**:
```sql
-- Crear registro manualmente
INSERT INTO evt_package_check (events_package_id, created_at)
SELECT id, NOW() FROM evt_events_package WHERE id = [ID_DEL_PAQUETE];
```

### Error: Checkboxes no aparecen
**Causa**: Puede ser que el paquete no tenga productos o que la petición AJAX falle

**Solución**:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Busca la petición a `ctrl-eventos.php` con `opc=getProductsCheckByPackage`
4. Verifica la respuesta

### Error: "Duplicate entry" al insertar
**Causa**: Ya existe un registro con la misma combinación package_check_id + product_id

**Solución**: La función `insertProductCheck()` ya maneja esto automáticamente. Si ves este error, verifica que estés usando la versión actualizada del código.

### Checkboxes no se actualizan
**Causa**: Error en la petición AJAX o timeout

**Solución**:
1. Verifica la consola del navegador
2. Asegúrate de que el servidor responde en menos de 5 segundos
3. Verifica que la función `updateProductActive()` existe en el controlador

## 📊 Estructura de Datos

### evt_package_check
```
id (PK)
events_package_id (FK → evt_events_package.id)
created_at
```

### evt_check_products
```
id (PK)
package_check_id (FK → evt_package_check.id)
product_id (FK → evt_products.id)
active (0 o 1)
```

### Relaciones
```
evt_events_package (1) → (1) evt_package_check
evt_package_check (1) → (N) evt_check_products
evt_check_products (N) → (1) evt_products
```

## 🔍 Queries Útiles

### Ver todos los productos de un paquete con su estado
```sql
SELECT 
    ep.id as events_package_id,
    pkg.name as package_name,
    p.name as product_name,
    cp.active,
    c.classification
FROM evt_events_package ep
INNER JOIN evt_package pkg ON ep.package_id = pkg.id
INNER JOIN evt_package_check pc ON ep.id = pc.events_package_id
INNER JOIN evt_check_products cp ON pc.id = cp.package_check_id
INNER JOIN evt_products p ON cp.product_id = p.id
LEFT JOIN evt_classification c ON p.id_classification = c.id
WHERE ep.event_id = [ID_DEL_EVENTO]
ORDER BY c.classification, p.name;
```

### Contar productos activos vs inactivos por paquete
```sql
SELECT 
    pc.id as check_id,
    COUNT(*) as total_products,
    SUM(cp.active) as active_products,
    COUNT(*) - SUM(cp.active) as inactive_products
FROM evt_package_check pc
INNER JOIN evt_check_products cp ON pc.id = cp.package_check_id
GROUP BY pc.id;
```

### Ver eventos con paquetes sin productos configurados
```sql
SELECT 
    e.id,
    e.name_event,
    ep.id as events_package_id,
    pkg.name as package_name
FROM evt_events e
INNER JOIN evt_events_package ep ON e.id = ep.event_id
INNER JOIN evt_package pkg ON ep.package_id = pkg.id
LEFT JOIN evt_package_check pc ON ep.id = pc.events_package_id
WHERE pc.id IS NULL
AND ep.package_id IS NOT NULL;
```

## 📝 Notas Importantes

1. **Backup**: Siempre haz backup de la base de datos antes de ejecutar migraciones
2. **Orden de ejecución**: Las migraciones deben ejecutarse en orden numérico
3. **Cascada**: Las tablas usan `ON DELETE CASCADE`, así que eliminar un paquete eliminará sus productos relacionados
4. **Performance**: Los índices están optimizados para búsquedas frecuentes
5. **Validación**: El código valida duplicados automáticamente, no es necesario hacerlo manualmente

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs de PHP: `error_log`
2. Revisa la consola del navegador (F12)
3. Verifica que todas las tablas existen
4. Consulta la especificación completa en `.kiro/specs/package-product-management/`

## 📚 Documentación Adicional

- **Especificación completa**: `.kiro/specs/package-product-management/requirements.md`
- **Diseño técnico**: `.kiro/specs/package-product-management/design.md`
- **Plan de tareas**: `.kiro/specs/package-product-management/tasks.md`
- **Migraciones**: `migrations/README.md`

## ✨ Características Implementadas

- ✅ Inserción automática de productos al agregar paquetes
- ✅ Interfaz visual con checkboxes por clasificación (platillos/bebidas)
- ✅ Actualización en tiempo real sin recargar página
- ✅ Feedback visual con animación
- ✅ Manejo de errores robusto
- ✅ Validación de duplicados
- ✅ Timeout de 5 segundos en peticiones
- ✅ Reversión automática en caso de error
- ✅ Tema oscuro compatible
- ✅ Responsive design

## 🎯 Próximas Mejoras (Opcional)

- [ ] Bulk operations (seleccionar/deseleccionar todos)
- [ ] Historial de cambios
- [ ] Productos obligatorios vs opcionales
- [ ] Notificaciones al desactivar productos críticos
- [ ] Dashboard con estadísticas de productos

---

**Versión**: 1.0.0  
**Fecha**: 2025-01-30  
**Autor**: CoffeeIA ☕
