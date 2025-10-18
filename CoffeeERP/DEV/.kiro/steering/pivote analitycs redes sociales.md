# 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([# 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'], 1]),
            'metrics'        => $this->lsMetricsFilter([# 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            # 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => # 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = # 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([# 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'], 1]),
            'metrics'        => $this->lsMetricsFilter([# 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            # 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => # 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = # 🧭 Pivote Estratégico — Módulo de Redes Sociales

---

## 🎯 Propósito General

El **Módulo de Redes Sociales** tiene como objetivo centralizar, analizar y administrar la información de desempeño de las distintas plataformas digitales de cada Unidad de Negocio (UDN).  
Permite registrar métricas de campañas, generar comparativos anuales y mensuales, administrar redes y métricas personalizadas, y visualizar KPIs clave en un **dashboard interactivo** para la toma de decisiones estratégicas dentro del ERP CoffeeSoft.

---

## ⚙️ Key Features

1. **Dashboard centralizado** con indicadores clave de desempeño (alcance, interacciones, inversión, ROI).
2. **Visualizaciones dinámicas** mediante gráficos de barras y líneas para comparativas mensuales y tendencias.
3. **Captura manual de métricas** con validación, historial de registros y edición directa.
4. **Gestor de métricas personalizadas**, permitiendo definir nuevas variables de medición para cada red social.
5. **Administrador de redes sociales**, con control de íconos, colores, activación/desactivación y edición.
6. **Comparativos anuales y mensuales** automáticos, generados mediante consultas dinámicas a la base de datos.
7. **Diseño modular y reutilizable**, basado en clases extendidas de `Templates`, adaptable a otros módulos CoffeeSoft.
8. **Integración de filtros inteligentes** por UDN, red social, año y tipo de reporte, sincronizados con eventos de renderización.

---

## 🧭 Notas de Diseño

- Se implementa la **estructura CoffeeSoft modular**, separando responsabilidades por clase:  
  `DashboardSocialNetwork`, `RegisterSocialNetWork`, `AdminMetrics`, `AdminSocialNetWork`.
- Utiliza componentes visuales de CoffeeSoft como `createfilterBar`, `createTable`, `createModalForm`, `primaryLayout` y `infoCard`.
- Los colores y estilos siguen la **paleta corporativa**:
  - Azul oscuro `#103B60` (encabezados, títulos)
  - Verde `#8CC63F` (indicadores positivos)
  - Blanco y gris claro para fondos y tarjetas.
- Cada subsección o pestaña usa el método `tabLayout` con carga dinámica (`onClick`) para optimizar rendimiento.
- Todas las operaciones asíncronas usan el helper `useFetch` para comunicación con el controlador `ctrl-social-networks.php`.
- Las gráficas se generan con **Chart.js**, usando tooltips personalizados y leyendas adaptables.
- Cumple con el **principio Rosy**: código limpio, modular y estructurado con consistencia visual y semántica.

---

### 🧩 Componentes UI utilizados

- `primaryLayout()` → estructura base de vista.  
- `tabLayout()` → navegación entre pestañas.  
- `createfilterBar()` → barra de filtros dinámica.  
- `createTable()` → tablas dinámicas con soporte de DataTables.  
- `createModalForm()` → formularios modales con validación.  
- `infoCard()` → tarjetas KPI con valores destacados.  
- `dashboardComponent()` → contenedor para gráficas y comparativos.

```javascript FRONT JS
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());



```

```PHP CTRL
<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-social-networks.php';

class ctrl extends mdl {

    function init() {
        
        return [
            'udn'            => $this->lsUDN(),
            'lsudn'          => $this->lsUDN(),
            'socialNetworks' => $this->lsSocialNetworksFilter([$_SESSION['SUB'], 1]),
            'metrics'        => $this->lsMetricsFilter([$_SESSION['SUB'], 1])
        ];
    }

    function apiDashboardMetrics() {
        $udn = $_POST['udn'];
        $month = $_POST['mes'];
        $year = $_POST['anio'];

        $metrics            = $this->getDashboardMetrics([$udn, $year, $month]);
        $trendData          = $this->getTrendData([$udn, $year, $month]);
        $monthlyComparative = $this->getMonthlyComparativeData([$udn, $year, $month]);
        $comparativeTable   = $this->getComparativeTableData([$udn, $year, $month]);

        return [
            'dashboard' => [
                'totalReach'      => evaluar($metrics['total_reach'] ?? 0),
                'interactions'    => evaluar($metrics['total_interactions'] ?? 0),
                'monthViews'      => evaluar($metrics['total_views'] ?? 0),
                'totalInvestment' => evaluar($metrics['total_investment'] ?? 0)
            ],
            'trendData' => $this->formatTrendChartData($trendData),
            'monthlyComparative' => $this->formatMonthlyComparativeData($monthlyComparative),
            'comparativeTable' => $comparativeTable
        ];
    }

    function lsSocialNetworks() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listSocialNetworks([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminSocialNetWork.editSocialNetwork(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminSocialNetWork.statusSocialNetwork(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id' => $key['id'],
                'Icono' => '<i class="' . $key['icono'] . '" style="color:' . $key['color'] . '; font-size: 24px;"></i>',
                'Nombre' => $key['nombre'],
                'Estado' => renderStatus($key['active']),
                'Fecha' => formatSpanishDate($key['date_creation']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getSocialNetwork() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Red social no encontrada';
        $data = null;

        $network = $this->getSocialNetworkById([$id]);

        if ($network) {
            $status = 200;
            $message = 'Red social encontrada';
            $data = $network;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addSocialNetwork() {
        $status = 500;
        $message = 'No se pudo agregar la red social';
        $_POST['active'] = 1;
      
        $exists = $this->existsSocialNetworkByName([$_POST['nombre']]);

        if (!$exists) {
            $create = $this->createSocialNetwork($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Red social agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una red social con ese nombre.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editSocialNetwork() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar red social';
        
     

        $edit = $this->updateSocialNetwork($this->util->sql($_POST, 1));


        if ($edit) {
            $status = 200;
            $message = 'Red social editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusSocialNetwork() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateSocialNetwork($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Metrics.

    function lsMetrics() {
        $__row = [];
        $udn = $_POST['udn'];
        $active = $_POST['active'];

        $ls = $this->listMetrics([ $active]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                $a[] = [
                    'class' => 'btn btn-sm btn-primary me-1',
                    'html' => '<i class="icon-pencil"></i>',
                    'onclick' => 'adminMetrics.editMetric(' . $key['id'] . ')'
                ];

                $a[] = [
                    'class' => 'btn btn-sm btn-danger',
                    'html' => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            } else {
                $a[] = [
                    'class' => 'btn btn-sm btn-outline-danger',
                    'html' => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'adminMetrics.statusMetric(' . $key['id'] . ', ' . $key['active'] . ')'
                ];
            }

            $__row[] = [
                'id'         => $key['id'],
                'Metrica'    => $key['name'],
                'Red Social' => '<div class="flex items-center gap-2">
                                    <i class = "' . $key['social_network_icon'] . ' text-xs "
                                       style = "color:' . $key['social_network_color'] . '; font-size: 15px;"></i>
                                    <span>' . $key['social_network_name'] . '</span>
                                </div>',
                'Estado' => renderStatus($key['active']),
                'a' => $a
            ];
        }

        return [
            'row' => $__row,
            'ls' => $ls
        ];
    }

    function getMetric() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Métrica no encontrada';
        $data = null;

        $metric = $this->getMetricById([$id]);

        if ($metric) {
            $status = 200;
            $message = 'Métrica encontrada';
            $data = $metric;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addMetric() {
        $status = 500;
        $message = 'No se pudo agregar la métrica';
        $_POST['active'] = 1;
    
        $exists = $this->existsMetricByName([
            $_POST['nombre'],
            $_POST['red_social_id']
        ]);

        if (!$exists) {
            $create = $this->createMetric($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Métrica agregada correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe una métrica con ese nombre para esta red social.';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editMetric() {
        $id = $_POST['id'];
        $status = 500;
        $message = 'Error al editar métrica';
        
       
        $edit = $this->updateMetric($this->util->sql($_POST, 1));
        if ($edit) {
            $status = 200;
            $message = 'Métrica editada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusMetric() {
        $status = 500;
        $message = 'No se pudo actualizar el estado';

        $update = $this->updateMetric($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'El estado se actualizó correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    private function formatTrendChartData($data) {
        $labels = [];
        $datasets = [];

        foreach ($data as $item) {
            $labels[] = $item['month_name'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Interacciones',
                    'data' => array_column($data, 'interactions'),
                    'backgroundColor' => '#103B60',
                    'borderColor' => '#103B60',
                    'fill' => false
                ]
            ]
        ];
    }

    private function formatMonthlyComparativeData($data) {
        $labels = [];
        $currentMonth = [];
        $previousMonth = [];

        foreach ($data as $item) {
            $labels[] = $item['social_network'];
            $currentMonth[] = $item['current_month'];
            $previousMonth[] = $item['previous_month'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Mes Actual',
                    'data' => $currentMonth,
                    'backgroundColor' => '#103B60'
                ],
                [
                    'label' => 'Mes Anterior',
                    'data' => $previousMonth,
                    'backgroundColor' => '#8CC63F'
                ]
            ]
        ];
    }

    function getMetricsByNetwork() {
        $networkId = $_POST['social_network_id'];
        $metrics = $this->lsMetricsByNetwork([$networkId, 1]);

        return [
            'status' => 200,
            'metrics' => $metrics
        ];
    }

    function addCapture() {
        $status = 500;
        $message = 'No se pudo guardar la captura';

        $month = $_POST['month'];
        $year = $_POST['year'];
        $metrics = json_decode($_POST['metrics'], true);

        $exists = $this->existsCapture([
            $_SESSION['SUB'],
            $year,
            $month
        ]);

        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe una captura para este mes y año'
            ];
        }

        $captureData = [
            'udn_id' => $_SESSION['SUB'],
            'año' => $year,
            'mes' => $month,
            'fecha_creacion' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        $captureId = $this->createCapture($this->util->sql($captureData));

        if ($captureId) {
            foreach ($metrics as $metric) {
                $movementData = [
                    'historial_id' => $captureId,
                    'metrica_id' => $metric['metric_id'],
                    'cantidad' => $metric['value']
                ];
                $this->createMetricMovement($this->util->sql($movementData));
            }

            $status = 200;
            $message = 'Captura guardada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function apiAnnualReport() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $__row[] = [
                'Métrica' => $key['metric_name'],
                'Enero' => evaluar($key['month_1']),
                'Febrero' => evaluar($key['month_2']),
                'Marzo' => evaluar($key['month_3']),
                'Abril' => evaluar($key['month_4']),
                'Mayo' => evaluar($key['month_5']),
                'Junio' => evaluar($key['month_6']),
                'Julio' => evaluar($key['month_7']),
                'Agosto' => evaluar($key['month_8']),
                'Septiembre' => evaluar($key['month_9']),
                'Octubre' => evaluar($key['month_10']),
                'Noviembre' => evaluar($key['month_11']),
                'Diciembre' => evaluar($key['month_12']),
                'Total' => evaluar($key['total'])
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiMonthlyComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getMonthlyComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_value'] - $key['previous_value'];
            $percentage = $key['previous_value'] > 0 
                ? (($comparison / $key['previous_value']) * 100) 
                : 0;

            $__row[] = [
                'Métrica'      => $key['metric_name'],
                'Mes Anterior' => $key['previous_value'],
                'Mes Actual'   => $key['current_value'],
                'Comparación'  => $comparison,
                'Porcentaje'   => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiAnnualComparative() {
        $__row = [];
        $udn = $_POST['udn'];
        $networkId = $_POST['social_network_id'];
        $year = $_POST['year'];

        $data = $this->getAnnualComparativeReport([$udn, $networkId, $year]);

        foreach ($data as $key) {
            $comparison = $key['current_year'] - $key['previous_year'];
            $percentage = $key['previous_year'] > 0 
                ? (($comparison / $key['previous_year']) * 100) 
                : 0;

            $__row[] = [
                              'Métrica'     => $key['metric_name'],
                       'Año ' . ($year - 1) => $key['previous_year'],
                       'Año ' . $year       => $key['current_year'],
                              'Comparación' => $comparison,
                              'Porcentaje'  => number_format($percentage, 2) . '%'
            ];
        }

        return [
            'row' => $__row
        ];
    }

    function apiGetHistoryMetrics() {
        $udn = $_SESSION['SUB'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
POST['udn'];
        $data = $this->getHistoryMetrics([$udn]);
        $history = [];

        foreach ($data as $item) {
            $metrics = [];
            if (!empty($item['metrics_data'])) {
                $metricsArray = explode('|', $item['metrics_data']);
                foreach ($metricsArray as $metric) {
                    $parts = explode(':', $metric);
                    if (count($parts) == 2) {
                        $metrics[] = [
                            'name' => $parts[0],
                            'value' => $parts[1]
                        ];
                    }
                }
            }

            $history[] = [
                'id' => $item['id'],
                'network' => $item['social_network_name'],
                'icon' => $item['social_network_icon'],
                'color' => $item['social_network_color'],
                'date' => formatSpanishDate($item['fecha_creacion']),
                'year' => $item['año'],
                'month' => $item['mes'],
                'metrics' => $metrics
            ];
        }

        return [
            'status' => 200,
            'data' => $history
        ];
    }

    function deleteCapture() {
        $status = 500;
        $message = 'No se pudo eliminar la captura';

        $update = $this->updateCapture($this->util->sql(['active' => 0, 'id' => $_POST['id']], 1));

        if ($update) {
            $status = 200;
            $message = 'Captura eliminada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function getCaptureById() {
        $id = $_POST['id'];
        $status = 404;
        $message = 'Captura no encontrada';
        $data = null;

        $capture = $this->_getCaptureById([$id]);

        if ($capture) {
            $metrics = $this->getMetricsByHistorialId([$id]);
            $capture['metrics'] = $metrics;
            $capture['date'] = formatSpanishDate($capture['fecha_creacion']);

            $status = 200;
            $message = 'Captura encontrada';
            $data = $capture;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function updateCaptureMetrics() {
        $status = 500;
        $message = 'No se pudo actualizar la captura';
        $id = $_POST['id'];
        $metrics = json_decode($_POST['metrics'], true);

        if (empty($metrics)) {
            return [
                'status' => 400,
                'message' => 'No se recibieron métricas para actualizar'
            ];
        }

        $updated = true;
        foreach ($metrics as $metric) {
            $updateData = [
                'cantidad' => $metric['value'],
                'id' => $metric['historial_metric_id']
            ];
            
            $result = $this->updateMetricHistorial($this->util->sql($updateData, 1));
            if (!$result) {
                $updated = false;
                break;
            }
        }

        if ($updated) {
            $status = 200;
            $message = 'Captura actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }
}

function renderStatus($status) {
    switch ($status) {
        case 1:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Activo
                    </span>';
        case 0:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactivo
                    </span>';
        default:
            return '<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <span class="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Desconocido
                    </span>';
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());

```


```PHP MDL
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';
session_start();

class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_marketing.";
    }

    function lsUDN() {
        $query = "
            SELECT idUDN AS id, UDN AS valor
            FROM udn
            WHERE Stado = 1 AND idUDN NOT IN (8, 10, 7)
            ORDER BY UDN DESC
        ";
        return $this->_Read($query, null);
    }

    function lsSocialNetworksFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function lsMetricsFilter($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS valor",
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => [1]
        ]);
    }

    function listSocialNetworks($array) {
        return $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => "id, nombre ,icono, color, active",
            'where' => 'active = ?',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }

    function getSocialNetworkById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}red_social",
            'values' => 'id, icono,nombre , color, active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsSocialNetworkByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}red_social
            WHERE LOWER(nombre) = LOWER(?)
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0]]);
        return count($exists) > 0;
    }

    function createSocialNetwork($array) {
        return $this->_Insert([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateSocialNetwork($array) {
        return $this->_Update([
            'table' => "{$this->bd}red_social",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function listMetrics($array) {
        $query = "
            SELECT 
                m.id,
                m.nombre AS name,
                m.active,
                r.nombre AS social_network_name,
                r.icono AS social_network_icon,
                r.color AS social_network_color
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}red_social r ON m.red_social_id = r.id
            WHERE m.active = ?
            ORDER BY m.id DESC
        ";
        return $this->_Read($query, $array);
    }

    function getMetricById($array) {
        $result = $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => 'id, nombre , red_social_id , active',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    function existsMetricByName($array) {
        $query = "
            SELECT id
            FROM {$this->bd}metrica_red
            WHERE LOWER(nombre) = LOWER(?)
            AND red_social_id = ?
            AND active = 1
        ";
        $exists = $this->_Read($query, [$array[0], $array[1]]);
        return count($exists) > 0;
    }

    function createMetric($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateMetric($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function lsMetricsByNetwork($array) {
        return $this->_Select([
            'table' => "{$this->bd}metrica_red",
            'values' => "id, nombre AS name",
            'where' => 'red_social_id = ? AND active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    function existsCapture($array) {
        $query = "
            SELECT id
            FROM {$this->bd}historial_red
            WHERE udn_id = ?
            AND año = ?
            AND mes = ?
        ";
        $exists = $this->_Read($query, [$array[0], $array[2], $array[3]]);
        return count($exists) > 0;
    }

    function createCapture($array) {
        return $this->_Insert([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function createMetricMovement($array) {
        return $this->_Insert([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function getDashboardMetrics($array) {
        $query = "
            SELECT 
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS total_reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS total_interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Visualizaciones' THEN mh.cantidad ELSE 0 END), 0) AS total_views,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS total_investment
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? [
            'total_reach' => 0,
            'total_interactions' => 0,
            'total_views' => 0,
            'total_investment' => 0
        ];
    }

    function getTrendData($array) {
        $query = "
            SELECT 
                h.mes AS month,
                DATE_FORMAT(CONCAT(h.año, '-', LPAD(h.mes, 2, '0'), '-01'), '%M') AS month_name,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.año = ?
            AND h.mes <= ?
            AND h.active = 1
            GROUP BY h.mes, h.año
            ORDER BY h.mes ASC
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeData($array) {
        $query = "
            SELECT 
                rs.nombre AS social_network,
                COALESCE(SUM(CASE WHEN h.mes = ? THEN mh.cantidad ELSE 0 END), 0) AS current_month,
                COALESCE(SUM(CASE WHEN h.mes = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_month
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getComparativeTableData($array) {
        $query = "
            SELECT 
                rs.nombre AS platform,
                COALESCE(SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END), 0) AS reach,
                COALESCE(SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END), 0) AS interactions,
                COALESCE(SUM(CASE WHEN m.nombre = 'Seguidores' THEN mh.cantidad ELSE 0 END), 0) AS followers,
                COALESCE(SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END), 0) AS investment,
                CASE 
                    WHEN SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END) > 0 
                    THEN (SUM(CASE WHEN m.nombre = 'Alcance' THEN mh.cantidad ELSE 0 END) + 
                          SUM(CASE WHEN m.nombre = 'Interacciones' THEN mh.cantidad ELSE 0 END)) / 
                         SUM(CASE WHEN m.nombre = 'Inversión' THEN mh.cantidad ELSE 0 END)
                    ELSE 0 
                END AS roi
            FROM {$this->bd}red_social rs
            LEFT JOIN {$this->bd}metrica_red m ON rs.id = m.red_social_id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND rs.active = 1
            AND h.año = ?
            AND h.mes = ?
            AND h.active = 1
            GROUP BY rs.id, rs.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.mes = 1 THEN mh.cantidad ELSE 0 END), 0) AS month_1,
                COALESCE(SUM(CASE WHEN h.mes = 2 THEN mh.cantidad ELSE 0 END), 0) AS month_2,
                COALESCE(SUM(CASE WHEN h.mes = 3 THEN mh.cantidad ELSE 0 END), 0) AS month_3,
                COALESCE(SUM(CASE WHEN h.mes = 4 THEN mh.cantidad ELSE 0 END), 0) AS month_4,
                COALESCE(SUM(CASE WHEN h.mes = 5 THEN mh.cantidad ELSE 0 END), 0) AS month_5,
                COALESCE(SUM(CASE WHEN h.mes = 6 THEN mh.cantidad ELSE 0 END), 0) AS month_6,
                COALESCE(SUM(CASE WHEN h.mes = 7 THEN mh.cantidad ELSE 0 END), 0) AS month_7,
                COALESCE(SUM(CASE WHEN h.mes = 8 THEN mh.cantidad ELSE 0 END), 0) AS month_8,
                COALESCE(SUM(CASE WHEN h.mes = 9 THEN mh.cantidad ELSE 0 END), 0) AS month_9,
                COALESCE(SUM(CASE WHEN h.mes = 10 THEN mh.cantidad ELSE 0 END), 0) AS month_10,
                COALESCE(SUM(CASE WHEN h.mes = 11 THEN mh.cantidad ELSE 0 END), 0) AS month_11,
                COALESCE(SUM(CASE WHEN h.mes = 12 THEN mh.cantidad ELSE 0 END), 0) AS month_12,
                COALESCE(SUM(mh.cantidad), 0) AS total
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getMonthlyComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) - 1 THEN mh.cantidad END), 0) AS previous_value,
                COALESCE(MAX(CASE WHEN h.mes = MONTH(CURDATE()) THEN mh.cantidad END), 0) AS current_value
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.año = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, $array);
    }

    function getAnnualComparativeReport($array) {
        $query = "
            SELECT 
                m.nombre AS metric_name,
                COALESCE(SUM(CASE WHEN h.año = ? - 1 THEN mh.cantidad ELSE 0 END), 0) AS previous_year,
                COALESCE(SUM(CASE WHEN h.año = ? THEN mh.cantidad ELSE 0 END), 0) AS current_year
            FROM {$this->bd}metrica_red m
            LEFT JOIN {$this->bd}metrica_historial_red mh ON m.id = mh.metrica_id
            LEFT JOIN {$this->bd}historial_red h ON mh.historial_id = h.id
            WHERE h.udn_id = ?
            AND m.red_social_id = ?
            AND h.active = 1
            GROUP BY m.id, m.nombre
            ORDER BY m.nombre
        ";
        return $this->_Read($query, [$array[2], $array[2], $array[0], $array[1]]);
    }

    function getHistoryMetrics($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color,
                GROUP_CONCAT(
                    CONCAT(m.nombre, ':', mh.cantidad) 
                    SEPARATOR '|'
                ) AS metrics_data
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            LEFT JOIN {$this->bd}metrica_historial_red mh ON h.id = mh.historial_id
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE h.udn_id = ?
            AND h.active = 1
            GROUP BY h.id, h.año, h.mes, h.fecha_creacion, rs.nombre, rs.icono, rs.color
            ORDER BY h.fecha_creacion DESC
            LIMIT 10
        ";
        return $this->_Read($query, $array);
    }

    function updateCapture($array) {
        return $this->_Update([
            'table' => "{$this->bd}historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    function _getCaptureById($array) {
        $query = "
            SELECT 
                h.id,
                h.año,
                h.mes,
                h.fecha_creacion,
                h.red_social_id,
                rs.nombre AS social_network_name,
                rs.icono AS social_network_icon,
                rs.color AS social_network_color
            FROM {$this->bd}historial_red h
            LEFT JOIN {$this->bd}red_social rs ON h.red_social_id = rs.id
            WHERE h.id = ?
            AND h.active = 1
        ";
        $result = $this->_Read($query, $array);
        return $result[0] ?? null;
    }

    function getMetricsByHistorialId($array) {
        $query = "
            SELECT 
                mh.id AS historial_metric_id,
                mh.cantidad AS value,
                mh.metrica_id AS metric_id,
                m.nombre AS name
            FROM {$this->bd}metrica_historial_red mh
            LEFT JOIN {$this->bd}metrica_red m ON mh.metrica_id = m.id
            WHERE mh.historial_id = ?
        ";
        return $this->_Read($query, $array);
    }

    function updateMetricHistorial($array) {
        return $this->_Update([
            'table' => "{$this->bd}metrica_historial_red",
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
}



```
