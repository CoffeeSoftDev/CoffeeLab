# Requirements Document

## Introduction

El Dashboard de Cheque Promedio es un módulo analítico dentro del sistema ERP CoffeeSoft que permite visualizar y comparar métricas clave de ventas, clientes y consumo promedio por cliente. Este dashboard forma parte del módulo de Ventas/Análisis y proporciona insights sobre el desempeño comercial comparando períodos actuales con históricos.

## Glossary

- **Sistema**: Dashboard de Cheque Promedio
- **UDN**: Unidad de Negocio (restaurante, hotel, etc.)
- **Cheque Promedio**: Valor promedio de consumo calculado como total_venta / total_clientes
- **KPI**: Key Performance Indicator (Indicador Clave de Desempeño)
- **FilterBar**: Barra de filtros para seleccionar mes, año y UDN
- **Backend**: Controlador PHP que procesa las consultas de datos
- **Frontend**: Interfaz JavaScript que renderiza los componentes visuales

## Requirements

### Requirement 1

**User Story:** Como analista de ventas, quiero visualizar las métricas principales de ventas del mes actual, para evaluar el desempeño comercial de la unidad de negocio.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard, THE Sistema SHALL mostrar 4 cards con métricas principales (ventas del día anterior, ventas del mes, total de clientes, cheque promedio)
2. WHEN se selecciona una UDN en el FilterBar, THE Sistema SHALL actualizar todas las métricas mostradas según la unidad de negocio seleccionada
3. WHEN se carga el dashboard, THE Sistema SHALL calcular el cheque promedio como total_venta dividido entre total_clientes
4. WHERE los datos están disponibles, THE Sistema SHALL mostrar el valor formateado con símbolo de moneda y dos decimales
5. IF no existen datos para el período seleccionado, THEN THE Sistema SHALL mostrar valores en cero sin generar errores

### Requirement 2

**User Story:** Como gerente de operaciones, quiero comparar las métricas actuales con el mismo período del año anterior, para identificar tendencias de crecimiento o decrecimiento.

#### Acceptance Criteria

1. WHEN se muestran las cards de métricas, THE Sistema SHALL calcular la variación porcentual comparada con el año anterior
2. WHEN la variación es positiva, THE Sistema SHALL mostrar el porcentaje con símbolo "+" y color verde
3. WHEN la variación es negativa, THE Sistema SHALL mostrar el porcentaje con símbolo "-" y color rojo
4. WHERE existe información del año anterior, THE Sistema SHALL incluir un mensaje descriptivo tipo "+5% comparado con el año pasado"
5. IF no existe información del año anterior, THEN THE Sistema SHALL omitir el mensaje comparativo

### Requirement 3

**User Story:** Como analista de ventas, quiero visualizar el cheque promedio por día de la semana, para identificar patrones de consumo según el día.

#### Acceptance Criteria

1. WHEN el dashboard se carga, THE Sistema SHALL generar un gráfico de barras o líneas con el cheque promedio agrupado por día de la semana
2. WHEN se calcula el promedio por día, THE Sistema SHALL agrupar todas las ocurrencias del mismo día (ej: todos los lunes del mes)
3. WHEN se muestra el gráfico, THE Sistema SHALL ordenar los días de Lunes a Domingo
4. WHERE existen múltiples registros para un día, THE Sistema SHALL calcular el promedio aritmético de todos los valores
5. IF un día no tiene registros, THEN THE Sistema SHALL mostrar valor cero en el gráfico

### Requirement 4

**User Story:** Como gerente comercial, quiero comparar el cheque promedio por categoría de producto entre el año actual y el anterior, para evaluar el desempeño de cada línea de negocio.

#### Acceptance Criteria

1. WHEN el dashboard se renderiza, THE Sistema SHALL mostrar un gráfico comparativo de cheque promedio por categoría
2. WHEN se consultan las categorías, THE Sistema SHALL incluir al menos: A&B, Alimentos, Bebidas
3. WHEN se muestra el gráfico, THE Sistema SHALL usar barras de diferentes colores para cada año (azul #103B60 para año actual, verde #8CC63F para año anterior)
4. WHERE la UDN es tipo hotel (udn=1), THE Sistema SHALL incluir categorías: Hospedaje, A&B, Diversos
5. IF la UDN es tipo restaurante, THEN THE Sistema SHALL incluir categorías: Alimentos, Bebidas, Complementos

### Requirement 5

**User Story:** Como usuario del sistema, quiero filtrar los datos del dashboard por mes, año y unidad de negocio, para analizar períodos específicos.

#### Acceptance Criteria

1. WHEN el dashboard se carga, THE Sistema SHALL mostrar un FilterBar con selectores de UDN, mes y año
2. WHEN el usuario cambia cualquier filtro, THE Sistema SHALL recargar automáticamente todos los componentes del dashboard
3. WHEN se inicializa el FilterBar, THE Sistema SHALL preseleccionar el mes y año actual por defecto
4. WHERE existen múltiples UDN, THE Sistema SHALL listar todas las unidades de negocio disponibles
5. IF el usuario selecciona un período sin datos, THEN THE Sistema SHALL mostrar el dashboard con valores en cero

### Requirement 6

**User Story:** Como desarrollador del sistema, quiero que el dashboard utilice la API existente de ingresos, para mantener consistencia con el módulo de ventas actual.

#### Acceptance Criteria

1. WHEN el dashboard solicita datos, THE Sistema SHALL utilizar el endpoint ctrl/ctrl-ingresos.php
2. WHEN se consultan métricas, THE Sistema SHALL invocar la operación "getDashboardChequePromedio" o reutilizar "apiPromediosDiarios"
3. WHEN se procesan datos en el backend, THE Sistema SHALL heredar de la clase mdl existente en mdl-ingresos.php
4. WHERE se requieran nuevas consultas, THE Sistema SHALL agregar métodos al modelo existente sin duplicar lógica
5. IF se crean nuevas funciones, THEN THE Sistema SHALL seguir la nomenclatura establecida (camelCase, nombres en inglés)

### Requirement 7

**User Story:** Como usuario del sistema, quiero que el dashboard sea visualmente consistente con el módulo de ventas, para mantener una experiencia uniforme.

#### Acceptance Criteria

1. WHEN se renderiza el dashboard, THE Sistema SHALL utilizar la paleta de colores corporativa CoffeeSoft (azul #103B60, verde #8CC63F, gris #EAEAEA)
2. WHEN se muestran componentes, THE Sistema SHALL usar la clase Templates de CoffeeSoft para mantener consistencia
3. WHEN se crean gráficos, THE Sistema SHALL utilizar Chart.js con la configuración estándar del módulo
4. WHERE se requieran cards, THE Sistema SHALL usar el componente infoCard() existente
5. IF se necesitan tablas, THEN THE Sistema SHALL usar createTable() con theme 'corporativo' o 'light'
