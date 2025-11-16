# Requirements Document - SoftRestaurant Modernization

## Introduction

Este documento define los requisitos para la modernización del sistema **SoftRestaurant** bajo el estándar del framework **CoffeeSoft**. El objetivo es reestructurar completamente la arquitectura del proyecto manteniendo al 100% su lógica funcional, consultas, validaciones y comportamiento operativo, pero aplicando las mejores prácticas, convenciones y patrones del framework CoffeeSoft.

El sistema SoftRestaurant es una aplicación de gestión de producción para restaurantes que incluye módulos de administración de productos, gestión de salidas, productos vendidos, desplazamientos y gestión de archivos.

## Glossary

- **System**: SoftRestaurant - Sistema de gestión de producción para restaurantes
- **CoffeeSoft**: Framework JavaScript/PHP basado en jQuery que proporciona componentes reutilizables y arquitectura MVC
- **UDN**: Unidad de Negocio - Identificador de sucursal o punto de venta
- **Desplazamiento**: Movimiento de productos vendidos en un período específico
- **Costo Potencial**: Cálculo de costos basado en productos vendidos y recetas
- **Fogaza**: Categoría específica de productos de panadería
- **Soft Restaurant**: Sistema POS del cual se importan datos de ventas
- **Templates**: Clase base de CoffeeSoft que proporciona layouts y componentes predefinidos
- **CRUD**: Clase base para operaciones de base de datos (Create, Read, Update, Delete)
- **Pivote**: Código de referencia inmutable que sirve como plantilla para nuevos desarrollos

## Requirements

### Requirement 1: Reestructuración de Arquitectura

**User Story:** Como desarrollador del sistema, quiero que el proyecto SoftRestaurant siga la estructura estándar de CoffeeSoft, para que sea más mantenible, escalable y consistente con otros proyectos del framework.

#### Acceptance Criteria

1. WHEN se cree la nueva versión del proyecto, THE System SHALL organizar los archivos en la estructura estándar de CoffeeSoft con carpetas `ctrl/`, `mdl/`, `js/`, `src/js/`, `src/components/`, y `layout/`

2. THE System SHALL renombrar todos los archivos siguiendo las convenciones de CoffeeSoft: `ctrl-[modulo].php`, `mdl-[modulo].php`, `[modulo].js`

3. THE System SHALL crear un archivo `index.php` principal que incluya obligatoriamente `<script src="src/js/coffeSoft.js"></script>` y `<script src="src/js/plugins.js"></script>`

4. WHERE existan múltiples módulos, THE System SHALL separar cada módulo en su propio conjunto de archivos (ctrl, mdl, js)

5. THE System SHALL eliminar archivos duplicados y consolidar funcionalidad común en componentes reutilizables

### Requirement 2: Modernización del Frontend (JavaScript)

**User Story:** Como desarrollador frontend, quiero que todos los archivos JavaScript extiendan la clase Templates de CoffeeSoft y usen sus componentes, para aprovechar la funcionalidad del framework y mantener consistencia.

#### Acceptance Criteria

1. THE System SHALL reescribir todos los archivos JavaScript para que extiendan la clase `Templates` del framework CoffeeSoft

2. WHEN se defina una clase JavaScript, THE System SHALL incluir el constructor con parámetros `(link, div_modulo)` y la propiedad `PROJECT_NAME`

3. THE System SHALL implementar los métodos estándar: `render()`, `layout()`, `filterBar()`, y métodos de listado usando nomenclatura `ls[Entidad]()`

4. THE System SHALL reemplazar todas las llamadas AJAX manuales (`$.ajax`, `send_ajax`) por el método estándar `useFetch()` de CoffeeSoft

5. THE System SHALL usar componentes de CoffeeSoft para tablas (`createTable()`), formularios (`createForm()`, `createModalForm()`), filtros (`createfilterBar()`), y confirmaciones (`swalQuestion()`)

6. THE System SHALL usar `primaryLayout()`, `tabLayout()` y otros layouts predefinidos en lugar de HTML manual

7. WHERE se requieran componentes personalizados, THE System SHALL crearlos siguiendo el patrón de `new-component.md` en la carpeta `src/components/`

8. THE System SHALL mantener todos los valores `opc` existentes para comunicación con el backend

### Requirement 3: Estandarización del Backend (PHP)

**User Story:** Como desarrollador backend, quiero que los controladores y modelos sigan las convenciones de CoffeeSoft, para que el código sea más legible y mantenible.

#### Acceptance Criteria

1. THE System SHALL reescribir todos los controladores para que extiendan la clase del modelo correspondiente

2. WHEN se cree un controlador, THE System SHALL incluir validación de `$_POST['opc']` al inicio y usar estructura switch-case o llamada dinámica de métodos

3. THE System SHALL aplicar nomenclatura correcta en controladores: `init()`, `ls()`, `add[Entidad]()`, `edit[Entidad]()`, `get[Entidad]()`, `status[Entidad]()`, `delete[Entidad]()`

4. THE System SHALL reescribir todos los modelos para que extiendan la clase `CRUD` y declaren propiedades `$bd` y `$util`

5. THE System SHALL aplicar nomenclatura correcta en modelos: `list[Entidad]()`, `create[Entidad]()`, `update[Entidad]()`, `get[Entidad]ById()`, `delete[Entidad]ById()`, `ls[Entidad]()`

6. THE System SHALL usar métodos heredados de CRUD (`_Select`, `_Insert`, `_Update`, `_Delete`, `_Read`) en lugar de consultas SQL directas donde sea posible

7. THE System SHALL mantener todas las consultas SQL existentes, solo adaptando su formato a los métodos de CRUD

8. WHERE existan funciones auxiliares (dropdown, status, formatters), THE System SHALL colocarlas después de la clase principal con comentario `// Complements`

9. THE System SHALL eliminar comentarios innecesarios y mantener solo los que expliquen lógica compleja

### Requirement 4: Preservación de Lógica Funcional

**User Story:** Como usuario del sistema, quiero que todas las funcionalidades existentes sigan funcionando exactamente igual después de la modernización, para no perder ninguna capacidad operativa.

#### Acceptance Criteria

1. THE System SHALL mantener al 100% todas las consultas SQL existentes, solo adaptando su sintaxis a los métodos de CoffeeSoft

2. THE System SHALL preservar todos los endpoints y valores `opc` del backend sin modificación

3. THE System SHALL mantener todas las validaciones de negocio existentes

4. THE System SHALL conservar el flujo operativo actual de cada módulo

5. THE System SHALL mantener la misma estructura de respuestas JSON del backend

6. WHERE existan cálculos o algoritmos específicos (costo potencial, desplazamientos), THE System SHALL preservarlos exactamente

7. THE System SHALL mantener la integración con archivos Excel (importación/exportación)

8. THE System SHALL conservar la funcionalidad de gestión de archivos diarios de Soft Restaurant

### Requirement 5: Módulo de Administración

**User Story:** Como administrador, quiero gestionar productos de Soft Restaurant y sus vínculos con recetas de Costsys, para mantener sincronizada la información entre sistemas.

#### Acceptance Criteria

1. THE System SHALL permitir seleccionar UDN (Unidad de Negocio) para filtrar productos

2. THE System SHALL mostrar productos en dos formatos: reporte detallado y por categoría

3. THE System SHALL permitir importar productos desde archivos Excel de Soft Restaurant

4. THE System SHALL comparar productos importados con los existentes antes de actualizar

5. WHERE el producto sea de Fogaza (UDN=6), THE System SHALL usar lógica específica de categorías de panadería

6. THE System SHALL permitir vincular productos de Soft Restaurant con recetas de Costsys

7. THE System SHALL mostrar el total de productos cargados

### Requirement 6: Módulo de Productos Vendidos

**User Story:** Como gerente de producción, quiero consultar productos vendidos por período y calcular desplazamientos, para analizar el consumo y planificar producción.

#### Acceptance Criteria

1. THE System SHALL permitir seleccionar UDN, año, mes y tipo de reporte (resumen/detallado)

2. THE System SHALL consultar datos de Soft Restaurant o Costsys según selección

3. WHERE la UDN sea Fogaza, THE System SHALL permitir filtrar por categoría (Frances, Bizcocho, Pastelería)

4. THE System SHALL mostrar desplazamiento de productos con precio y cantidades

5. THE System SHALL permitir subir desplazamiento a Costo Potencial

6. WHEN se suba a Costo Potencial, THE System SHALL ofrecer opción de comparar antes de subir

7. THE System SHALL mostrar productos agregados y productos no encontrados en pestañas separadas

8. THE System SHALL contar y mostrar días pendientes de carga de archivos

9. THE System SHALL permitir consultar registros por rango de fechas

### Requirement 7: Módulo de Salidas

**User Story:** Como encargado de almacén, quiero registrar y consultar salidas de productos, para llevar control de inventario.

#### Acceptance Criteria

1. THE System SHALL mostrar historial de salidas registradas

2. THE System SHALL permitir agregar nuevas salidas

3. THE System SHALL permitir editar salidas existentes

4. THE System SHALL permitir activar/desactivar salidas

5. THE System SHALL filtrar salidas por UDN y rango de fechas

### Requirement 8: Módulo de Desplazamientos

**User Story:** Como analista, quiero consultar desplazamientos de productos por período, para analizar tendencias de consumo.

#### Acceptance Criteria

1. THE System SHALL mostrar desplazamientos agrupados por categoría

2. THE System SHALL permitir ver detalle de productos por categoría

3. THE System SHALL calcular totales de desplazamiento

4. THE System SHALL comparar desplazamiento de Soft Restaurant vs Costsys

### Requirement 9: Módulo de Gestión de Archivos

**User Story:** Como operador, quiero gestionar archivos diarios de Soft Restaurant, para mantener actualizada la información de ventas.

#### Acceptance Criteria

1. THE System SHALL permitir cargar archivos diarios de Soft Restaurant

2. THE System SHALL validar formato y contenido de archivos

3. THE System SHALL mostrar días pendientes de carga

4. THE System SHALL permitir consultar registros cargados por fecha

5. THE System SHALL detectar y reportar archivos faltantes

### Requirement 10: Interfaz de Usuario Moderna

**User Story:** Como usuario del sistema, quiero una interfaz moderna y consistente, para tener mejor experiencia de uso.

#### Acceptance Criteria

1. THE System SHALL usar TailwindCSS para todos los estilos

2. THE System SHALL implementar temas consistentes (light, dark, corporativo) en tablas y componentes

3. THE System SHALL usar componentes visuales de CoffeeSoft (cards, tabs, modals, alerts)

4. THE System SHALL implementar breadcrumbs de navegación en todas las vistas

5. THE System SHALL usar iconos consistentes de la librería icon-font

6. THE System SHALL implementar tablas responsivas con DataTables

7. THE System SHALL usar date pickers con moment.js para selección de fechas

8. THE System SHALL mostrar mensajes de confirmación con SweetAlert2

### Requirement 11: Documentación y Mantenibilidad

**User Story:** Como desarrollador futuro, quiero código limpio y bien documentado, para poder mantener y extender el sistema fácilmente.

#### Acceptance Criteria

1. THE System SHALL incluir comentarios solo en lógica compleja o no obvia

2. THE System SHALL usar nombres descriptivos en variables y funciones

3. THE System SHALL seguir convenciones de nomenclatura de CoffeeSoft estrictamente

4. THE System SHALL organizar código en métodos pequeños y específicos

5. THE System SHALL incluir documento de mapeo "antes → después" por cada módulo

6. THE System SHALL incluir lista de mejoras aplicadas y beneficios obtenidos

7. THE System SHALL documentar cambios en estructura de archivos

### Requirement 12: Testing y Validación

**User Story:** Como QA, quiero validar que la nueva versión funciona igual que la anterior, para asegurar que no se perdió funcionalidad.

#### Acceptance Criteria

1. THE System SHALL mantener todos los endpoints del backend funcionando

2. THE System SHALL producir las mismas respuestas JSON que la versión anterior

3. THE System SHALL ejecutar las mismas consultas SQL (adaptadas a métodos CRUD)

4. THE System SHALL mantener las mismas validaciones de datos

5. THE System SHALL preservar el comportamiento de importación/exportación de Excel

6. THE System SHALL mantener la integración con sistemas externos (Soft Restaurant, Costsys)
