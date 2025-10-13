# Requirements Document

## Introduction

El sistema de **Gestión de Campañas Publicitarias** es una plataforma integral diseñada para administrar anuncios publicitarios en redes sociales por unidad de negocio. Permite controlar métricas clave como ROI, CPC (Costo Por Clic), CAC (Costo de Adquisición de Cliente), resultados de campañas y gestión de pautas publicitarias.

El sistema está dirigido a tres tipos de usuarios:
- **Jefa de publicidad**: Acceso completo al sistema
- **Jefe de atención a clientes**: Acceso de visualización
- **Auxiliares de marketing**: Acceso de visualización

## Requirements

### Requirement 1: Gestión de Campañas

**User Story:** Como jefa de publicidad, quiero crear y gestionar campañas publicitarias con múltiples anuncios, para organizar estrategias de marketing por red social y unidad de negocio.

#### Acceptance Criteria

1. WHEN el usuario accede al módulo de anuncios THEN el sistema SHALL mostrar un formulario para crear una nueva campaña
2. WHEN el usuario crea una campaña THEN el sistema SHALL generar automáticamente el nombre con el formato "Campaña" + ${lastId + 1}
3. WHEN el usuario crea una campaña THEN el sistema SHALL solicitar: estrategia (text), unidad de negocio (select), red social (select) y fecha de creación (datetime)
4. WHEN el usuario guarda una campaña THEN el sistema SHALL almacenar los datos en la tabla `campaña` con los campos: id, nombre, estrategia, fecha_creacion, udn_id, red_social_id, active
5. WHEN una campaña es creada THEN el sistema SHALL permitir agregar uno o más anuncios asociados a esa campaña

### Requirement 2: Gestión de Anuncios

**User Story:** Como jefa de publicidad, quiero agregar múltiples anuncios a una campaña, para ejecutar diferentes estrategias publicitarias dentro de la misma campaña.

#### Acceptance Criteria

1. WHEN el usuario agrega un anuncio a una campaña THEN el sistema SHALL solicitar: nombre, fecha_inicio, fecha_fin, tipo_id (select), clasificacion_id (select), total_monto, imagen
2. WHEN el usuario guarda un anuncio THEN el sistema SHALL almacenar los datos en la tabla `anuncio` con los campos: id, nombre, fecha_inicio, fecha_fin, total_monto, total_clics, imagen, campaña_id, tipo_id, clasificacion_id
3. WHEN el usuario sube una imagen THEN el sistema SHALL validar el formato (jpeg, png, pdf) y almacenar la ruta en el campo `imagen`
4. WHEN el usuario guarda un anuncio THEN el sistema SHALL actualizar automáticamente los datos de la campaña asociada
5. IF el anuncio tiene fecha_fin vencida THEN el sistema SHALL permitir capturar total_clics y total_monto para calcular métricas

### Requirement 3: Captura de Resultados de Anuncios

**User Story:** Como jefa de publicidad, quiero capturar los resultados finales de cada anuncio (clics y monto gastado), para calcular el CPC y evaluar el rendimiento.

#### Acceptance Criteria

1. WHEN el anuncio finaliza (fecha_fin alcanzada) THEN el sistema SHALL permitir capturar total_clics y total_monto
2. WHEN el usuario captura total_clics y total_monto THEN el sistema SHALL calcular automáticamente el CPC con la fórmula: CPC = total_monto / total_clics
3. WHEN el CPC es calculado THEN el sistema SHALL almacenar el valor en la base de datos
4. WHEN los resultados son guardados THEN el sistema SHALL actualizar las métricas de la campaña asociada
5. IF total_clics es 0 THEN el sistema SHALL mostrar un mensaje de advertencia y no calcular CPC

### Requirement 4: Dashboard de Métricas

**User Story:** Como jefa de publicidad, quiero visualizar un dashboard con métricas clave de campañas, para tomar decisiones informadas sobre estrategias publicitarias.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar KPIs principales: inversión total, total de clics, CPC promedio, CAC promedio
2. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar gráficos comparativos anuales de inversión vs resultados
3. WHEN el usuario selecciona filtros (año, UDN, red social) THEN el sistema SHALL actualizar dinámicamente los gráficos y métricas
4. WHEN el dashboard carga THEN el sistema SHALL mostrar tendencias mensuales de inversión y resultados
5. WHEN el usuario visualiza el dashboard THEN el sistema SHALL mostrar comparativas año vs año de métricas clave

### Requirement 5: Resumen de Campaña

**User Story:** Como jefa de publicidad, quiero visualizar un resumen detallado de campañas por mes, para analizar el desempeño de cada anuncio y campaña.

#### Acceptance Criteria

1. WHEN el usuario accede al módulo de resumen THEN el sistema SHALL mostrar filtros: año, mes, unidad de negocio, red social
2. WHEN el usuario aplica filtros THEN el sistema SHALL mostrar una tabla con: estrategia, nombre de anuncio, duración, tipo, inversión, clics, CPC por anuncio
3. WHEN el sistema muestra el resumen THEN el sistema SHALL calcular y mostrar: total de clics por campaña, CPC promedio, costo total, total de resultados
4. WHEN el usuario visualiza el resumen THEN el sistema SHALL agrupar anuncios por campaña
5. WHEN el resumen es generado THEN el sistema SHALL calcular CPC promedio como: (suma de CPC de anuncios) / (número de anuncios)

### Requirement 6: Historial Anual - Reporte CPC

**User Story:** Como jefa de publicidad, quiero visualizar un historial anual de inversión y CPC por mes, para evaluar la eficiencia de las campañas a lo largo del año.

#### Acceptance Criteria

1. WHEN el usuario accede al historial anual THEN el sistema SHALL mostrar filtros: año, unidad de negocio, red social, tipo de reporte (CPC/CAC)
2. WHEN el usuario selecciona reporte CPC THEN el sistema SHALL mostrar una tabla con columnas: Mes, Inversión Total, Total Clics, CPC Promedio
3. WHEN el sistema calcula CPC promedio THEN el sistema SHALL usar la fórmula: (inversión / resultado) * 1000
4. WHEN el usuario visualiza el reporte THEN el sistema SHALL mostrar datos de los 12 meses del año seleccionado
5. IF no hay datos para un mes THEN el sistema SHALL mostrar valores en 0 o "Sin datos"

### Requirement 7: Historial Anual - Reporte CAC

**User Story:** Como jefa de publicidad, quiero visualizar un historial anual de CAC (Costo de Adquisición de Cliente), para medir el costo de conversión de anuncios a clientes.

#### Acceptance Criteria

1. WHEN el usuario selecciona reporte CAC THEN el sistema SHALL mostrar una tabla con columnas: Mes, Inversión Total, Número de Clientes, CAC
2. WHEN el sistema calcula CAC THEN el sistema SHALL usar la fórmula: CAC = inversión / número de clientes
3. WHEN el usuario visualiza el reporte THEN el sistema SHALL obtener el número de clientes desde pedidos asociados a anuncios
4. WHEN el reporte es generado THEN el sistema SHALL mostrar datos mensuales del año seleccionado
5. IF no hay clientes en un mes THEN el sistema SHALL mostrar CAC como "N/A" o 0

### Requirement 8: Administrador de Tipos de Anuncios

**User Story:** Como jefa de publicidad, quiero gestionar los tipos de anuncios disponibles (video, publicación, reel, etc.), para mantener actualizado el catálogo de formatos publicitarios.

#### Acceptance Criteria

1. WHEN el usuario accede al administrador THEN el sistema SHALL mostrar una tabla con tipos de anuncios: id, nombre, estado (activo/inactivo)
2. WHEN el usuario crea un nuevo tipo THEN el sistema SHALL solicitar: nombre y guardar con active = 1
3. WHEN el usuario edita un tipo THEN el sistema SHALL permitir modificar el nombre
4. WHEN el usuario cambia el estado THEN el sistema SHALL actualizar el campo `active` (1 = activo, 0 = inactivo)
5. WHEN un tipo está inactivo THEN el sistema SHALL ocultarlo de los selects en formularios de anuncios

### Requirement 9: Administrador de Clasificaciones de Anuncios

**User Story:** Como jefa de publicidad, quiero gestionar las clasificaciones de anuncios (pauta 1, pauta 2, video A, video B), para categorizar y organizar los anuncios por estrategia.

#### Acceptance Criteria

1. WHEN el usuario accede al administrador THEN el sistema SHALL mostrar una tabla con clasificaciones: id, nombre, estado
2. WHEN el usuario crea una clasificación THEN el sistema SHALL solicitar: nombre y guardar con active = 1
3. WHEN el usuario edita una clasificación THEN el sistema SHALL permitir modificar el nombre
4. WHEN el usuario cambia el estado THEN el sistema SHALL actualizar el campo `active`
5. WHEN una clasificación está inactiva THEN el sistema SHALL ocultarlo de los selects en formularios

### Requirement 10: Control de Accesos por Rol

**User Story:** Como administrador del sistema, quiero controlar los permisos de acceso según el rol del usuario, para garantizar la seguridad y privacidad de la información.

#### Acceptance Criteria

1. WHEN un usuario con rol "Jefa de publicidad" accede THEN el sistema SHALL permitir acceso completo (crear, editar, eliminar, visualizar)
2. WHEN un usuario con rol "Jefe de atención a clientes" accede THEN el sistema SHALL permitir solo visualización (sin edición ni eliminación)
3. WHEN un usuario con rol "Auxiliar de marketing" accede THEN el sistema SHALL permitir solo visualización
4. WHEN un usuario sin permisos intenta acceder THEN el sistema SHALL mostrar mensaje de acceso denegado
5. WHEN el sistema valida permisos THEN el sistema SHALL verificar el rol desde la sesión PHP ($_SESSION['ROL'])

### Requirement 11: Filtros Dinámicos por Unidad de Negocio y Red Social

**User Story:** Como usuario del sistema, quiero filtrar información por unidad de negocio y red social, para visualizar datos específicos de cada contexto.

#### Acceptance Criteria

1. WHEN el usuario accede a cualquier módulo con filtros THEN el sistema SHALL cargar dinámicamente las opciones de UDN desde la base de datos
2. WHEN el usuario accede a cualquier módulo con filtros THEN el sistema SHALL cargar dinámicamente las opciones de redes sociales
3. WHEN el usuario selecciona una UDN THEN el sistema SHALL filtrar los datos mostrados según la selección
4. WHEN el usuario selecciona una red social THEN el sistema SHALL filtrar los datos mostrados según la selección
5. WHEN los filtros cambian THEN el sistema SHALL actualizar automáticamente tablas y gráficos sin recargar la página

### Requirement 12: Validaciones de Formularios

**User Story:** Como jefa de publicidad, quiero que el sistema valide los datos ingresados en formularios, para evitar errores y garantizar la integridad de la información.

#### Acceptance Criteria

1. WHEN el usuario envía un formulario THEN el sistema SHALL validar que los campos obligatorios no estén vacíos
2. WHEN el usuario ingresa fechas THEN el sistema SHALL validar que fecha_fin sea mayor o igual a fecha_inicio
3. WHEN el usuario ingresa montos THEN el sistema SHALL validar que sean valores numéricos positivos
4. WHEN el usuario ingresa clics THEN el sistema SHALL validar que sean valores enteros positivos
5. IF la validación falla THEN el sistema SHALL mostrar mensajes de error específicos por campo

### Requirement 13: Cálculos Automáticos de Métricas

**User Story:** Como jefa de publicidad, quiero que el sistema calcule automáticamente las métricas clave, para ahorrar tiempo y evitar errores manuales.

#### Acceptance Criteria

1. WHEN se capturan resultados de un anuncio THEN el sistema SHALL calcular automáticamente CPC = total_monto / total_clics
2. WHEN se genera el resumen de campaña THEN el sistema SHALL calcular CPC promedio de todos los anuncios de la campaña
3. WHEN se genera el historial anual CPC THEN el sistema SHALL calcular (inversión / resultado) * 1000 por mes
4. WHEN se genera el historial anual CAC THEN el sistema SHALL calcular inversión / número de clientes por mes
5. WHEN se muestran totales THEN el sistema SHALL sumar automáticamente inversiones, clics y resultados

### Requirement 14: Interfaz Responsiva y Moderna

**User Story:** Como usuario del sistema, quiero una interfaz moderna y responsiva, para acceder desde cualquier dispositivo y tener una experiencia visual agradable.

#### Acceptance Criteria

1. WHEN el usuario accede desde desktop THEN el sistema SHALL mostrar la interfaz optimizada para pantallas grandes
2. WHEN el usuario accede desde tablet o móvil THEN el sistema SHALL adaptar la interfaz al tamaño de pantalla
3. WHEN el sistema renderiza componentes THEN el sistema SHALL usar TailwindCSS para estilos consistentes
4. WHEN el usuario interactúa con tablas THEN el sistema SHALL usar el tema corporativo de CoffeeSoft
5. WHEN el sistema muestra gráficos THEN el sistema SHALL usar Chart.js con colores corporativos (#103B60, #8CC63F)

### Requirement 15: Integración con Base de Datos

**User Story:** Como desarrollador, quiero que el sistema respete estrictamente los nombres de campos de la base de datos, para garantizar la integridad y compatibilidad del sistema.

#### Acceptance Criteria

1. WHEN el sistema consulta la tabla `campaña` THEN el sistema SHALL usar los campos: id, nombre, estrategia, fecha_creacion, udn_id, red_social_id, active
2. WHEN el sistema consulta la tabla `anuncio` THEN el sistema SHALL usar los campos: id, nombre, fecha_inicio, fecha_fin, total_monto, total_clics, imagen, campaña_id, tipo_id, clasificacion_id
3. WHEN el sistema consulta la tabla `tipo_anuncio` THEN el sistema SHALL usar los campos: id, nombre, active
4. WHEN el sistema consulta la tabla `clasificacion_anuncio` THEN el sistema SHALL usar los campos: id, nombre, active
5. WHEN el sistema consulta la tabla `red_social` THEN el sistema SHALL usar los campos: id, nombre, color, active
