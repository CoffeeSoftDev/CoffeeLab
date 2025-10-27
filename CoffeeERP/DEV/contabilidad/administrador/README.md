# 🛒 Módulo de Compras - Sistema de Contabilidad

## 📋 Descripción

Módulo integral para la gestión de compras empresariales, clasificadas por tipo (fondo fijo, corporativo, crédito). Permite registrar, visualizar, editar y eliminar compras, con control de proveedores, productos y categorías.

## ✨ Características

- ✅ Dashboard con totales por tipo de compra
- ✅ CRUD completo de compras
- ✅ Gestión de proveedores
- ✅ Filtrado dinámico por tipo de compra
- ✅ Cálculo automático de totales (subtotal + impuesto)
- ✅ Interfaz responsive con TailwindCSS
- ✅ Validaciones frontend y backend
- ✅ Relación dinámica categoría-producto

## 🗂️ Estructura de Archivos

```
contabilidad/administrador/
├── index.php                      # Punto de entrada
├── js/
│   └── compras.js                # Frontend principal
├── ctrl/
│   └── ctrl-compras.php          # Controlador
├── mdl/
│   ├── mdl-compras.php           # Modelo de compras
│   └── mdl-proveedores.php       # Modelo de proveedores
├── sql/
│   └── schema_compras.sql        # Script de base de datos
└── README.md                      # Este archivo
```

## 🚀 Instalación

### 1. Configurar Base de Datos

Ejecuta el script SQL para crear las tablas:

```bash
mysql -u usuario -p < sql/schema_compras.sql
```

O desde phpMyAdmin:
1. Abre phpMyAdmin
2. Selecciona la base de datos `rfwsmqex_contabilidad`
3. Importa el archivo `sql/schema_compras.sql`

### 2. Verificar Configuración

Asegúrate de que los archivos de configuración existan:
- `../../conf/_CRUD.php`
- `../../conf/_Utileria.php`

### 3. Verificar Framework CoffeeSoft

Verifica que los archivos del framework estén disponibles:
- `../../src/js/coffeSoft.js`
- `../../src/js/plugins.js`

### 4. Configurar Sesión

El módulo requiere una sesión activa. Asegúrate de que el usuario esté autenticado antes de acceder.

## 📊 Base de Datos

### Tablas Principales

- **compras**: Registro principal de compras
- **proveedores**: Catálogo de proveedores
- **insumo**: Productos/insumos
- **clase_insumo**: Categorías de productos
- **tipo_compra**: Tipos de compra (Fondo fijo, Corporativo, Crédito)
- **forma_pago**: Métodos de pago

### Datos Iniciales

El script incluye datos de ejemplo:
- 3 tipos de compra
- 5 formas de pago
- 6 categorías de productos
- 9 productos de ejemplo
- 3 proveedores de ejemplo

## 🎯 Uso del Módulo

### Acceso

Navega a: `http://tu-dominio/contabilidad/administrador/`

### Funcionalidades Principales

#### 1. Registrar Nueva Compra

1. Clic en "Registrar nueva compra"
2. Selecciona categoría de producto
3. Selecciona producto (se carga dinámicamente)
4. Selecciona tipo de compra y método de pago
5. Selecciona proveedor
6. Ingresa subtotal e impuesto (el total se calcula automáticamente)
7. Agrega descripción (opcional)
8. Clic en "Guardar compra"

#### 2. Editar Compra

1. Clic en el ícono de lápiz en la tabla
2. Modifica los campos necesarios
3. Clic en "Guardar compra"

#### 3. Ver Detalle de Compra

1. Clic en el ícono de ojo en la tabla
2. Se muestra un modal con toda la información

#### 4. Eliminar Compra

1. Clic en el ícono de papelera en la tabla
2. Confirma la eliminación
3. El registro se elimina permanentemente

#### 5. Filtrar Compras

Usa el selector "Filtrar por tipo" para mostrar:
- Todas las compras
- Solo fondo fijo
- Solo corporativo
- Solo crédito

#### 6. Gestionar Proveedores

1. Clic en la pestaña "Proveedores"
2. Agrega, edita o cambia el estado de proveedores
3. Los cambios se reflejan automáticamente en el selector de compras

## 🔧 Configuración Avanzada

### Cambiar UDN (Unidad de Negocio)

Por defecto, el módulo usa `udn: 1`. Para cambiar:

En `js/compras.js`, busca y modifica:
```javascript
data: { 
    opc: 'lsCompras',
    tipo_compra_id: tipoCompra,
    udn: 1  // Cambia este valor
}
```

### Personalizar Totales

Los totales se calculan automáticamente. Para modificar la lógica:

Edita el método en `mdl/mdl-compras.php`:
```php
function getTotalesByType($array) {
    // Modifica la consulta SQL aquí
}
```

## 🐛 Solución de Problemas

### Error: "No se puede conectar a la base de datos"

**Solución**: Verifica la configuración en `../../conf/_CRUD.php`

### Error: "Función no encontrada"

**Solución**: Asegúrate de que CoffeeSoft esté cargado correctamente

### Los productos no se cargan al seleccionar categoría

**Solución**: Verifica que existan productos asociados a esa categoría en la BD

### Los totales no se actualizan

**Solución**: Verifica que el método `getTotales()` esté funcionando en el controlador

## 📝 API Endpoints

### Compras

- `init` - Carga catálogos iniciales
- `lsCompras` - Lista compras con filtros
- `getCompra` - Obtiene una compra por ID
- `addCompra` - Registra nueva compra
- `editCompra` - Actualiza compra existente
- `deleteCompra` - Elimina compra
- `getTotales` - Calcula totales por tipo

### Proveedores

- `lsProveedores` - Lista proveedores
- `getProveedor` - Obtiene proveedor por ID
- `addProveedor` - Registra nuevo proveedor
- `editProveedor` - Actualiza proveedor
- `statusProveedor` - Cambia estado del proveedor

## 🔐 Seguridad

- ✅ Validación de sesión en todas las peticiones
- ✅ Sanitización de inputs con `$this->util->sql()`
- ✅ Prepared statements en todas las consultas
- ✅ Validación dual (frontend + backend)
- ✅ Prevención de SQL injection

## 📈 Mejoras Futuras

- [ ] Importación masiva desde Excel/CSV
- [ ] Exportación de reportes en PDF
- [ ] Gráficas de tendencias
- [ ] Adjuntar archivos de facturas
- [ ] Historial de cambios (auditoría)
- [ ] Notificaciones por email

## 👥 Soporte

Para soporte técnico o reportar bugs, contacta al equipo de desarrollo.

## 📄 Licencia

© 2025 CoffeeSoft - Sistema de Contabilidad
