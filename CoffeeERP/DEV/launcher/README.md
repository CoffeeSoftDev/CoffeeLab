# 🚀 ERP Launcher Module

Módulo de lanzador de aplicaciones para el sistema ERP Grupo Varoch.

## 📋 Instalación

### 1. Estructura de Archivos

```
launcher/
├── ctrl/
│   └── ctrl-launcher.php
├── mdl/
│   └── mdl-launcher.php
├── js/
│   └── launcher.js
├── index.php
├── database_schema.sql
└── README.md
```

### 2. Configuración de Base de Datos

Ejecuta el archivo `database_schema.sql` en tu base de datos:

```bash
mysql -u usuario -p erp_varoch < database_schema.sql
```

O desde phpMyAdmin:
1. Abre phpMyAdmin
2. Selecciona tu base de datos `erp_varoch`
3. Ve a la pestaña "SQL"
4. Copia y pega el contenido de `database_schema.sql`
5. Ejecuta

**Nota:** El script utiliza las tablas existentes `modulos` y `submodulos`, solo agrega campos adicionales y crea la tabla de logs.

### 3. Verificar Datos de Módulos

El script SQL actualiza automáticamente los módulos existentes con iconos y descripciones. Verifica que los módulos estén correctos:

```sql
SELECT idModulo, modulo, mod_descripcion, mod_icono, mod_estado 
FROM modulos 
WHERE mod_estado = 1;
```

### 4. Acceso al Módulo

Una vez instalado, accede a:
```
http://tu-dominio/launcher/index.php
```

## 🎨 Características

- ✅ Interfaz moderna con TailwindCSS
- ✅ Búsqueda en tiempo real de módulos
- ✅ Control de acceso basado en permisos
- ✅ Diseño responsive (desktop, tablet, mobile)
- ✅ Indicadores de estado (Nuevo, Legacy)
- ✅ Registro de accesos para auditoría
- ✅ Animaciones suaves y transiciones

## 🔧 Módulos Incluidos

1. **KPI** - Indicadores clave de rendimiento
2. **Producción** - Gestión de producción
3. **Contabilidad** - Sistema contable
4. **CostSys** - Costeo de recetas
5. **Capital Humano** - Recursos humanos
6. **Gestor de Actividades** - Organizador de tareas
7. **Calendarización** - Programación anual

## 🛠️ Tecnologías

- **Frontend**: jQuery + TailwindCSS
- **Backend**: PHP 7.4+
- **Base de Datos**: MySQL 5.7+
- **Framework**: CoffeeSoft

## 📝 Notas

- Asegúrate de tener una sesión activa antes de acceder
- Los módulos se filtran automáticamente según permisos del usuario
- Las URLs de los módulos deben ajustarse según tu estructura de carpetas

## 🐛 Troubleshooting

**Problema**: No se muestran módulos
- Verifica que las tablas estén creadas correctamente
- Confirma que el usuario tiene permisos asignados en `erp_module_permissions`
- Revisa que los módulos estén activos (`active = 1`)

**Problema**: Error de conexión a base de datos
- Verifica la configuración en `conf/_conf.php`
- Confirma que el usuario de BD tenga permisos suficientes

**Problema**: Módulos no redirigen correctamente
- Ajusta las URLs en la tabla `erp_modules` según tu estructura de carpetas
