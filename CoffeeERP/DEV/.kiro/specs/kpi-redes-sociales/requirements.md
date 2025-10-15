# Requirements Document

## Introduction

El módulo de **Redes Sociales** es un sistema integral de gestión y análisis de métricas de redes sociales para el departamento de Publicidad. Permite capturar, visualizar y comparar el desempeño de diferentes plataformas sociales por unidad de negocio (UDN), facilitando la toma de decisiones estratégicas basadas en datos de alcance, interacciones, seguidores, inversión y ROI.

El sistema está diseñado para proporcionar una visión completa del rendimiento de las campañas en redes sociales, con capacidades de comparación mensual, anual e histórica, así como análisis de tendencias y métricas clave de desempeño.

## Requirements

### Requirement 1: Dashboard de Métricas de Redes Sociales

**User Story:** Como usuario del departamento de Publicidad, quiero visualizar un dashboard con las métricas principales de redes sociales, para tener una visión general del desempeño de nuestras plataformas.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar tarjetas con las siguientes métricas del mes actual: Total de Alcance, Interacciones, Visualizaciones del Mes e Inversión Total
2. WHEN el usuario visualiza el dashboard THEN el sistema SHALL mostrar una comparativa mensual de las redes sociales con respecto a la métrica aplicada
3. WHEN el usuario consulta el dashboard THEN el sistema SHALL mostrar una gráfica de tendencia de interacciones con opciones de visualización para últimos 6 meses, 3 meses o anual
4. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar una tabla de resumen general con las columnas: Plataforma, Alcance, Interacciones, Seguidores, Inversión y ROI
5. WHEN el usuario selecciona una UDN en el filtro THEN el sistema SHALL actualizar todas las visualizaciones del dashboard con los datos correspondientes a esa unidad de negocio
6. WHEN el usuario selecciona un rango de fechas THEN el sistema SHALL actualizar las métricas y gráficas según el período seleccionado

### Requirement 2: Captura de Información de Redes Sociales

**User Story:** Como usuario del departamento de Publicidad, quiero capturar las métricas mensuales de cada red social por unidad de negocio, para mantener un registro histórico del desempeño.

#### Acceptance Criteria

1. WHEN el usuario accede al módulo de captura THEN el sistema SHALL mostrar una barra de filtros con: UDN, Red Social, Año de Consulta y Tipo de Reporte (Concentrado Anual, Comparativa Mensual, Comparativa Anual)
2. WHEN el usuario selecciona "Nueva Captura Mensual" THEN el sistema SHALL mostrar un componente de captura con: barra de filtro (UDN, Red Social, Mes, Año) y botón "Crear"
3. WHEN el usuario hace clic en "Crear" THEN el sistema SHALL mostrar un formulario con inputs de captura para todas las métricas asociadas a la red social seleccionada
4. WHEN el usuario captura las métricas THEN el sistema SHALL permitir editar o eliminar cada métrica mediante botones de acción
5. WHEN el usuario guarda la captura THEN el sistema SHALL crear un movimiento del mes y validar que no exista un registro previo para ese mes, año, UDN y red social
6. IF existe un movimiento previo THEN el sistema SHALL permitir actualizar el registro existente
7. WHEN el usuario guarda exitosamente THEN el sistema SHALL mostrar un mensaje de confirmación y actualizar el historial de métricas capturadas
8. WHEN el usuario selecciona "Concentrado Anual" THEN el sistema SHALL mostrar una tabla con las columnas: Métrica y todos los meses (Enero-Diciembre) con el total de suma de movimientos
9. WHEN el usuario selecciona "Comparativa Mensual" THEN el sistema SHALL mostrar una tabla con: Métrica, Mes Anterior, Mes de Consulta, Comparación y Porcentaje
10. WHEN el usuario selecciona "Comparativa Anual" THEN el sistema SHALL mostrar una tabla con: Métrica, Suma del Año Anterior, Suma del Año Actual, Comparación y Porcentaje

### Requirement 3: Administrador de Redes Sociales

**User Story:** Como administrador del sistema, quiero gestionar el catálogo de redes sociales disponibles, para mantener actualizada la lista de plataformas que se pueden monitorear.

#### Acceptance Criteria

1. WHEN el usuario accede al administrador de redes sociales THEN el sistema SHALL mostrar una barra de filtros con: UDN y Estado (Activos/Inactivos)
2. WHEN el usuario visualiza el listado THEN el sistema SHALL mostrar una tabla con las columnas: Icono, Nombre, Activo, Fecha de Creación y Acciones (Editar/Eliminar)
3. WHEN el usuario hace clic en "Agregar Red Social" THEN el sistema SHALL mostrar un modal con los campos: UDN, Nombre, Icono, Color y Descripción
4. WHEN el usuario guarda una nueva red social THEN el sistema SHALL validar que no exista otra red social con el mismo nombre para esa UDN
5. WHEN el usuario hace clic en "Editar" THEN el sistema SHALL cargar los datos de la red social en un modal y permitir modificar los campos
6. WHEN el usuario hace clic en "Eliminar" THEN el sistema SHALL cambiar el estado de la red social a inactivo (baja lógica)
7. WHEN el usuario actualiza el estado THEN el sistema SHALL reflejar el cambio en la tabla de listado

### Requirement 4: Administrador de Métricas

**User Story:** Como administrador del sistema, quiero gestionar el catálogo de métricas por red social, para definir qué indicadores se capturarán para cada plataforma.

#### Acceptance Criteria

1. WHEN el usuario accede al administrador de métricas THEN el sistema SHALL mostrar una barra de filtros con: UDN y Estado (Activos/Inactivos)
2. WHEN el usuario visualiza el listado THEN el sistema SHALL mostrar una tabla con las columnas: Tipo, Descripción, Estado y Acciones (Editar/Eliminar)
3. WHEN el usuario hace clic en "Agregar Métrica" THEN el sistema SHALL mostrar un modal con los campos: UDN, Red Social, Nombre de la Métrica y Descripción
4. WHEN el usuario guarda una nueva métrica THEN el sistema SHALL validar que no exista otra métrica con el mismo nombre para esa red social y UDN
5. WHEN el usuario hace clic en "Editar" THEN el sistema SHALL cargar los datos de la métrica en un modal y permitir modificar los campos
6. WHEN el usuario hace clic en "Eliminar" THEN el sistema SHALL cambiar el estado de la métrica a inactivo (baja lógica)
7. IF una métrica está asociada a capturas existentes THEN el sistema SHALL permitir eliminarla pero mantener los registros históricos

### Requirement 5: Comparativas y Análisis

**User Story:** Como usuario del departamento de Publicidad, quiero comparar las métricas de redes sociales entre diferentes períodos, para identificar tendencias y evaluar el desempeño.

#### Acceptance Criteria

1. WHEN el usuario selecciona "Comparativa Mensual" THEN el sistema SHALL calcular y mostrar la diferencia entre el mes seleccionado y el mes anterior
2. WHEN el usuario selecciona "Comparativa Anual" THEN el sistema SHALL calcular y mostrar la diferencia entre el año seleccionado y el año anterior
3. WHEN el sistema muestra comparativas THEN el sistema SHALL calcular el porcentaje de variación con la fórmula: ((Valor Actual - Valor Anterior) / Valor Anterior) * 100
4. WHEN el sistema muestra comparativas THEN el sistema SHALL indicar visualmente si la variación es positiva (verde) o negativa (roja)
5. WHEN el usuario consulta tendencias THEN el sistema SHALL mostrar gráficas lineales con la evolución de las métricas en el período seleccionado
6. WHEN el usuario visualiza el resumen general THEN el sistema SHALL calcular el ROI con la fórmula: (Alcance + Interacciones) / Inversión

### Requirement 6: Filtros y Navegación

**User Story:** Como usuario del sistema, quiero filtrar la información por UDN, fecha y tipo de reporte, para consultar datos específicos de manera eficiente.

#### Acceptance Criteria

1. WHEN el usuario accede a cualquier módulo THEN el sistema SHALL mostrar filtros de: UDN, Año y Mes (cuando aplique)
2. WHEN el usuario cambia un filtro THEN el sistema SHALL actualizar automáticamente las tablas y gráficas sin recargar la página
3. WHEN el usuario selecciona una UDN THEN el sistema SHALL mostrar solo las redes sociales y métricas asociadas a esa unidad de negocio
4. WHEN el usuario navega entre pestañas THEN el sistema SHALL mantener los filtros seleccionados
5. WHEN el usuario accede por primera vez THEN el sistema SHALL establecer por defecto: UDN actual del usuario, mes actual y año actual

### Requirement 7: Validaciones y Seguridad

**User Story:** Como administrador del sistema, quiero que se validen los datos capturados y se controle el acceso, para garantizar la integridad de la información.

#### Acceptance Criteria

1. WHEN el usuario intenta guardar una captura THEN el sistema SHALL validar que todos los campos obligatorios estén completos
2. WHEN el usuario intenta guardar una métrica duplicada THEN el sistema SHALL mostrar un mensaje de error indicando que ya existe
3. WHEN el usuario intenta eliminar una red social con capturas asociadas THEN el sistema SHALL realizar una baja lógica en lugar de eliminar físicamente
4. WHEN el usuario accede al sistema THEN el sistema SHALL validar que tenga permisos para el módulo de redes sociales
5. WHEN el usuario captura valores numéricos THEN el sistema SHALL validar que sean números válidos y mayores o iguales a cero
6. WHEN el usuario intenta acceder a datos de otra UDN THEN el sistema SHALL validar que tenga permisos para esa unidad de negocio
