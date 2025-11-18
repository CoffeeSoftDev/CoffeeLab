# 🍽️ SoftRestaurant - Sistema Modernizado

Sistema de gestión integral para restaurantes, modernizado con el framework CoffeeSoft 2.0.

## 📋 Descripción

Este proyecto es una modernización completa del sistema SoftRestaurant, manteniendo el 100% de la funcionalidad original mientras se implementa una arquitectura MVC moderna, componentes reutilizables y una interfaz de usuario mejorada.

## 🏗️ Arquitectura

### Framework Base
- **CoffeeSoft 2.0** - Framework JavaScript basado en jQuery
- **TailwindCSS** - Framework de estilos utility-first
- **PHP 7.4+** - Backend con arquitectura MVC
- **MySQL** - Base de datos relacional

### Estructura del Proyecto

```
softrestaurant-update/
├── index.php                    # Dashboard principal
├── administracion.php           # Módulo de administración
├── productos-vendidos.php       # Módulo de ventas
├── salidas.php                  # Módulo de salidas
│
├── ctrl/                        # Controladores PHP
│   ├── ctrl-administracion.php
│   ├── ctrl-productos-vendidos.php
│   ├── ctrl-salidas.php
│   └── ctrl-soft-archivos-diarios.php
│
├── mdl/                         # Modelos PHP
│   ├── mdl-administracion.php
│   ├── mdl-productos-vendidos.php
│   ├── mdl-salidas.php
│   ├── mdl-costo-potencial.php
│   └── mdl-gestion-archivos.php
│
├── js/                          # Scripts JavaScript principales
│   ├── administracion.js
│   ├── productos-vendidos.js
│   └── salidas.js
│
├── src/
│   ├── js/                      # Framework CoffeeSoft
│   │   ├── coffeSoft.js        # Núcleo del framework
│   │   └── plugins.js          # Plugins jQuery
│   │
│   ├── components/              # Componentes personalizados
│   │   ├── product-card.js
│   │   ├── excel-uploader.js
│   │   └── category-selector.js
│   │
│   └── css/
│       └── custom.css
│
└── layout/                      # Layouts compartidos
    ├── head.php
    └── footer.php
```

## 🚀 Módulos Implementados

### 1. Administración de Productos
**Archivo:** `administracion.php`

Funcionalidades:
- ✅ Gestión CRUD de productos
- ✅ Homologación con Costsys
- ✅ Vista por categorías
- ✅ Reporte detallado
- ✅ Importación desde Excel (próximamente)

**Endpoints:**
- `init()` - Inicializar filtros
- `ls()` - Listar productos
- `lsGrupo()` - Listar por categoría
- `rptDetallado()` - Reporte detallado
- `addProducto()` - Agregar producto
- `editProducto()` - Editar producto
- `statusProducto()` - Cambiar estado
- `enlaceCostsys()` - Homologar con Costsys

### 2. Productos Vendidos
**Archivo:** `productos-vendidos.php`

Funcionalidades:
- ✅ Consulta de productos vendidos (Soft Restaurant)
- ✅ Desplazamiento (Costsys)
- ✅ Productos Fogaza
- ✅ Subir costo potencial
- ✅ Días pendientes
- ✅ Registros por fecha

**Endpoints:**
- `init()` - Inicializar filtros
- `ls()` - Productos vendidos
- `lsCostsys()` - Desplazamiento Costsys
- `lsFogaza()` - Productos Fogaza
- `subirCostoPotencial()` - Subir costos
- `lsDiasPendientes()` - Días pendientes
- `lsRegistros()` - Registros por rango

### 3. Salidas
**Archivo:** `salidas.php`

Funcionalidades:
- ✅ Registro de salidas
- ✅ Gestión de mermas
- ✅ Cortesías y degustaciones
- ✅ Filtros por fecha
- ✅ Estados activo/inactivo

**Endpoints:**
- `init()` - Inicializar filtros
- `ls()` - Listar salidas
- `getSalida()` - Obtener salida
- `addSalida()` - Agregar salida
- `editSalida()` - Editar salida
- `statusSalida()` - Cambiar estado

### 4. Archivos Diarios
**Archivo:** `ctrl-soft-archivos-diarios.php`

Funcionalidades:
- ✅ Gestión de archivos CSV
- ✅ Validación de archivos
- ✅ Tracking de días pendientes
- ✅ Historial de cargas

**Endpoints:**
- `init()` - Inicializar
- `ls()` - Listar archivos
- `lsDiasPendientes()` - Días pendientes
- `getArchivo()` - Obtener archivo
- `addArchivo()` - Registrar archivo
- `validarArchivo()` - Validar CSV

## 🎨 Componentes Personalizados

### ProductCard
Tarjeta visual para mostrar productos con imagen, precio, categoría y acciones.

```javascript
this.productCard({
    parent: 'container',
    json: productos,
    onClick: (item) => console.log(item),
    onEdit: (id) => this.editProducto(id),
    onDelete: (id) => this.deleteProducto(id)
});
```

### ExcelUploader
Componente para subir archivos Excel con drag & drop, validación y barra de progreso.

```javascript
this.excelUploader({
    parent: 'container',
    title: 'Subir Productos',
    acceptedFormats: ['.xlsx', '.xls', '.csv'],
    maxSize: 5,
    showCompare: true,
    onUpload: (response) => console.log(response),
    onCompare: (response) => console.log(response)
});
```

### CategorySelector
Selector de categorías con búsqueda, selección múltiple y filtros especiales.

```javascript
this.categorySelector({
    parent: 'container',
    json: categorias,
    multiple: false,
    searchable: true,
    showFogaza: true,
    onChange: (selected, category) => console.log(selected)
});
```

## 📊 Base de Datos

### Tablas Principales

**softrestaurant_productos**
- `id` - ID del producto
- `descripcion` - Nombre del producto
- `id_grupo_productos` - Categoría
- `costo` - Costo del producto
- `id_udn` - Unidad de negocio
- `activo_soft` - Estado (1=activo, 0=inactivo)
- `fecha` - Fecha de registro

**softrestaurant_productos_vendidos**
- `id` - ID del registro
- `id_producto` - Producto vendido
- `cantidad` - Cantidad vendida
- `costo_unitario` - Costo unitario
- `costo_total` - Costo total
- `mes` - Mes de venta
- `anio` - Año de venta
- `id_udn` - Unidad de negocio

**softrestaurant_salidas**
- `id` - ID de la salida
- `id_producto` - Producto
- `cantidad` - Cantidad
- `motivo` - Motivo (Merma, Cortesía, etc.)
- `fecha` - Fecha de salida
- `id_udn` - Unidad de negocio
- `activo` - Estado

**softrestaurant_costo_potencial**
- `id` - ID del registro
- `id_producto` - Producto
- `cantidad` - Cantidad
- `costo_unitario` - Costo unitario
- `costo_total` - Costo total
- `mes` - Mes
- `anio` - Año
- `id_udn` - Unidad de negocio

## 🔧 Instalación

### Requisitos
- PHP 7.4 o superior
- MySQL 5.7 o superior
- Apache/Nginx
- Extensiones PHP: mysqli, json, mbstring

### Pasos

1. **Clonar/Copiar archivos**
```bash
cp -r softrestaurant-update /var/www/html/produccion/
```

2. **Configurar base de datos**
- Editar `conf/_CRUD.php` con credenciales de BD
- Verificar nombre de BD: `rfwsmqex_softrestaurant`

3. **Permisos**
```bash
chmod -R 755 softrestaurant-update/
chown -R www-data:www-data softrestaurant-update/
```

4. **Acceder al sistema**
```
http://tu-dominio.com/produccion/softrestaurant-update/
```

## 📖 Uso

### Ejemplo: Listar Productos

**Frontend (JS):**
```javascript
class App extends Templates {
    ls() {
        this.createTable({
            parent: 'container',
            idFilterBar: 'filterBar',
            data: { opc: 'ls' },
            coffeesoft: true,
            conf: { datatable: true, pag: 15 },
            attr: {
                id: 'tbProductos',
                theme: 'corporativo'
            }
        });
    }
}
```

**Controlador (PHP):**
```php
function ls() {
    $data = $this->listProductos([$_POST['udn']]);
    $rows = [];
    
    foreach ($data as $item) {
        $rows[] = [
            'id' => $item['id'],
            'Producto' => $item['nombre'],
            'Precio' => evaluar($item['costo']),
            'opc' => 0
        ];
    }
    
    return ['row' => $rows];
}
```

**Modelo (PHP):**
```php
function listProductos($array) {
    return $this->_Select([
        'table' => "{$this->bd}softrestaurant_productos",
        'values' => '*',
        'where' => 'id_udn = ? AND activo_soft = 1',
        'data' => $array
    ]);
}
```

## 🧪 Testing

### Pruebas Funcionales
```bash
# Probar endpoints
curl -X POST http://localhost/produccion/softrestaurant-update/ctrl/ctrl-administracion.php \
  -d "opc=ls&udn=1"
```

### Validación de Datos
- Todos los formularios tienen validación client-side
- Validación server-side en controladores
- Sanitización de datos con `$this->util->sql()`

## 📝 Convenciones de Código

### Nomenclatura

**Controladores (CTRL):**
- `init()` - Inicializar
- `ls()` - Listar
- `add[Entidad]()` - Agregar
- `edit[Entidad]()` - Editar
- `get[Entidad]()` - Obtener
- `status[Entidad]()` - Cambiar estado

**Modelos (MDL):**
- `list[Entidad]()` - Listar
- `create[Entidad]()` - Crear
- `update[Entidad]()` - Actualizar
- `get[Entidad]ById()` - Obtener por ID
- `delete[Entidad]ById()` - Eliminar

**Frontend (JS):**
- `ls[Entidad]()` - Listar
- `add[Entidad]()` - Agregar
- `edit[Entidad](id)` - Editar
- `status[Entidad](id)` - Cambiar estado

### Estándares
- **PHP:** PSR-12
- **JavaScript:** ES6+
- **CSS:** TailwindCSS utility classes
- **SQL:** Prepared statements obligatorios

## 🐛 Troubleshooting

### Error: "Cannot find coffeSoft.js"
**Solución:** Verificar que los archivos estén en `src/js/`

### Error: "Database connection failed"
**Solución:** Revisar credenciales en `conf/_CRUD.php`

### Error: "Undefined function _Select"
**Solución:** Verificar que el modelo extienda la clase `CRUD`

### Tablas no cargan datos
**Solución:** Verificar que `idFilterBar` coincida con el ID del filterBar

## 📚 Documentación Adicional

- [CoffeeSoft Framework](./docs/coffeesoft.md)
- [Guía de Componentes](./docs/components.md)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contribución

Este proyecto sigue las convenciones del framework CoffeeSoft. Para contribuir:

1. Respetar la arquitectura MVC
2. Seguir las convenciones de nomenclatura
3. Documentar nuevos componentes
4. Probar antes de commit

## 📄 Licencia

Propietario: CoffeeSoft Development Team
Uso interno exclusivo.

## 👥 Equipo

- **Desarrollo:** CoffeeIA ☕
- **Framework:** CoffeeSoft 2.0
- **Arquitectura:** MVC + Components

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo.

---

**Versión:** 2.0.0  
**Última actualización:** Noviembre 2025  
**Estado:** En desarrollo activo
