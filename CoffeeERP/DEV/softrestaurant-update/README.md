# SoftRestaurant - Versión Modernizada

## Descripción

Sistema de gestión de producción para restaurantes modernizado bajo el framework **CoffeeSoft**. Esta versión mantiene al 100% la funcionalidad original mientras aplica las mejores prácticas de arquitectura MVC, componentes reutilizables y código limpio.

## Estructura del Proyecto

```
softrestaurant-update/
│
├── index.php                 # Punto de entrada principal
├── ctrl/                     # Controladores (Lógica de negocio)
├── mdl/                      # Modelos (Acceso a datos)
├── js/                       # Scripts principales del proyecto
├── src/
│   ├── js/
│   │   ├── coffeSoft.js     # Framework CoffeeSoft (CORE)
│   │   └── plugins.js       # Plugins jQuery
│   ├── components/          # Componentes personalizados
│   └── css/                 # Estilos personalizados
└── layout/                  # Layouts compartidos
    ├── head.php
    └── footer.php
```

## Configuración de Base de Datos

### Requisitos

- MySQL 5.7 o superior
- PHP 7.4 o superior
- Extensión PDO habilitada

### Configuración

La conexión a la base de datos se gestiona a través de la clase `CRUD` ubicada en `conf/_CRUD.php`.

**Nombre de la base de datos:** `rfwsmqex_softrestaurant`

Para configurar la conexión:

1. Verifica que el archivo `conf/_CRUD.php` existe en la raíz del proyecto
2. Asegúrate de que las credenciales de conexión sean correctas
3. El nombre de la base de datos debe seguir el patrón: `rfwsmqex_softrestaurant`

### Verificación de Conexión

Todos los modelos extienden la clase `CRUD` y declaran la propiedad `$bd`:

```php
class mdl extends CRUD {
    protected $util;
    public $bd;
    
    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_softrestaurant.";
    }
}
```

## Módulos del Sistema

### 1. Administración
- Gestión de productos de Soft Restaurant
- Vinculación con recetas de Costsys
- Importación de productos desde Excel
- Reportes detallados y por categoría

### 2. Productos Vendidos
- Consulta de productos vendidos por período
- Cálculo de desplazamientos
- Integración con Soft Restaurant y Costsys
- Subida a Costo Potencial

### 3. Salidas
- Registro de salidas de productos
- Control de inventario
- Historial de movimientos

### 4. Desplazamientos
- Análisis de desplazamientos por categoría
- Comparativas de consumo

### 5. Gestión de Archivos
- Carga de archivos diarios de Soft Restaurant
- Seguimiento de días pendientes
- Validación de archivos

## Tecnologías Utilizadas

### Frontend
- **CoffeeSoft Framework** - Framework JavaScript base
- **jQuery 3.7.1** - Manipulación del DOM
- **TailwindCSS** - Framework de estilos
- **Bootstrap 5.3** - Componentes UI
- **DataTables** - Tablas interactivas
- **Select2** - Selectores avanzados
- **SweetAlert2** - Alertas y confirmaciones
- **Moment.js** - Manejo de fechas
- **DateRangePicker** - Selector de rangos de fechas

### Backend
- **PHP 7.4+** - Lenguaje del servidor
- **MySQL** - Base de datos
- **PHPSpreadsheet** - Procesamiento de Excel
- **Clase CRUD** - Abstracción de base de datos

## Convenciones de Código

### Nomenclatura de Archivos
- Controladores: `ctrl-[modulo].php`
- Modelos: `mdl-[modulo].php`
- JavaScript: `[modulo].js`
- Componentes: `[nombre-componente].js`

### Nomenclatura de Funciones

**Controladores (CTRL):**
- `init()` - Inicializar datos/filtros
- `ls()` - Listar registros
- `add[Entidad]()` - Agregar
- `edit[Entidad]()` - Editar
- `get[Entidad]()` - Obtener por ID
- `status[Entidad]()` - Cambiar estado

**Modelos (MDL):**
- `list[Entidad]()` - Listar registros
- `create[Entidad]()` - Crear
- `update[Entidad]()` - Actualizar
- `get[Entidad]ById()` - Obtener por ID
- `delete[Entidad]ById()` - Eliminar
- `ls[Entidad]()` - Consultas para filtros

**Frontend (JS):**
- `render()` - Renderizar módulo
- `layout()` - Crear estructura visual
- `filterBar()` - Barra de filtros
- `ls[Entidad]()` - Listar en tabla

## Instalación

1. Clonar o copiar el proyecto a la carpeta del servidor web
2. Verificar que la base de datos `rfwsmqex_softrestaurant` existe
3. Verificar que el archivo `conf/_CRUD.php` tiene las credenciales correctas
4. Acceder a `index.php` desde el navegador

## Desarrollo

### Agregar un Nuevo Módulo

1. Crear modelo en `mdl/mdl-[modulo].php`
2. Crear controlador en `ctrl/ctrl-[modulo].php`
3. Crear frontend en `js/[modulo].js`
4. Registrar en el menú de navegación

### Crear un Componente Personalizado

1. Crear archivo en `src/components/[nombre-componente].js`
2. Seguir el patrón de componentes de CoffeeSoft
3. Usar jQuery + TailwindCSS exclusivamente
4. Documentar parámetros y uso

## Testing

### Verificar Funcionalidad
1. Probar cada módulo individualmente
2. Verificar que las consultas retornan datos correctos
3. Probar importación/exportación de Excel
4. Validar cálculos de Costo Potencial

### Verificar Integración
1. Probar flujos completos de usuario
2. Verificar comunicación entre módulos
3. Validar consistencia de datos

## Soporte

Para soporte técnico o reportar problemas, contactar al equipo de desarrollo.

## Licencia

Uso interno - Todos los derechos reservados

---

**Versión:** 2.0 (Modernizada con CoffeeSoft)  
**Fecha:** Noviembre 2025  
**Framework:** CoffeeSoft 2.0
