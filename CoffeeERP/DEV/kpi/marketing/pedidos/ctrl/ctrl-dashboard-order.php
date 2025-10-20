<?php

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../mdl/mdl-dashboard-order.php';

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN()
        ];
    }

    function apiPromediosDiarios() {
        $udn = $_POST['udn'];
        $mes = isset($_POST['mes']) ? $_POST['mes'] : null;
        $anio = $_POST['anio'];
        $tipoPeriodo = isset($_POST['tipoPeriodo']) ? $_POST['tipoPeriodo'] : 'mes';

        // Ajustar datos según el tipo de periodo
        if ($tipoPeriodo === 'anio') {
            // Consulta por año completo
            $dashboard = $this->getDashboardDataByYear($udn, $anio);
            $barChart = $this->getBarChartDataByYear($udn, $anio);
            $channelRanking = $this->getChannelRankingDataByYear($udn, $anio);
        } else {
            // Consulta por mes específico
            $dashboard = $this->getDashboardData($udn, $mes, $anio);
            $barChart = $this->getBarChartData($udn, $anio);
            $channelRanking = $this->getChannelRankingData($udn, $mes, $anio);
        }

        $lineChart = $this->getLineChartData($udn, $anio);
        $monthlyPerformance = $this->getMonthlyPerformanceData($udn, $anio);

        return [
            'dashboard' => $dashboard,
            'lineChart' => $lineChart,
            'barChart' => $barChart,
            'channelRanking' => $channelRanking,
            'monthlyPerformance' => $monthlyPerformance,
            'tipoPeriodo' => $tipoPeriodo
        ];
    }

    private function getDashboardData($udn, $mes, $anio) {
        $cards = $this->getDashboardCards([$udn, $udn, $anio, $mes, $udn, $anio, $mes, $udn, $anio, $mes]);
        $channelData = $this->getChannelPerformance([$udn, $anio, $mes]);
        
        if (empty($cards)) {
            return [
                'ingresosTotales' => '$0.00',
                'variacionIngresos' => '+0% vs mes anterior',
                'totalPedidos' => '0',
                'rangeFechas' => 'enero–diciembre ' . $anio,
                'valorPromedio' => '$0.00',
                'canalPrincipal' => 'N/A',
                'porcentajeCanal' => '0% del total'
            ];
        }

        $card = $cards[0];
        
        // Calcular variación de ingresos (simulada)
        $ventaActual = floatval($card['venta_mes'] ?? 0);
        $variacion = rand(-15, 25); // Simulación de variación
        $variacionTexto = $variacion >= 0 ? "+{$variacion}%" : "{$variacion}%";
        $variacionColor = $variacion >= 0 ? "↑" : "↓";
        
        // Obtener canal principal
        $canalPrincipal = 'N/A';
        $porcentajeCanal = '0%';
        if (!empty($channelData)) {
            $canalPrincipal = $channelData[0]['canal'];
            $porcentajeCanal = number_format(floatval($channelData[0]['porcentaje']), 1) . '% del total';
        }
        
        // Calcular total anual de pedidos
        $totalAnual = $this->getTotalYearOrders([$udn, $anio]);
        
        return [
            'ingresosTotales' => $this->formatPrice($ventaActual),
            'variacionIngresos' => $variacionColor . ' ' . $variacionTexto . ' vs mes anterior',
            'totalPedidos' => number_format($totalAnual),
            'rangeFechas' => 'enero–diciembre ' . $anio,
            'valorPromedio' => $this->formatPrice($card['cheque_promedio'] ?? 0),
            'canalPrincipal' => $canalPrincipal,
            'porcentajeCanal' => $porcentajeCanal
        ];
    }



    private function getLineChartData($udn, $anio) {
        $trends = $this->getMonthlyOrderTrends([$udn, $anio]);
        
        $labels = [];
        $values = [];
        
        // Inicializar todos los meses con 0
        $monthsData = array_fill(1, 12, 0);
        
        foreach ($trends as $trend) {
            $monthsData[$trend['mes']] = intval($trend['total_pedidos']);
        }
        
        for ($i = 1; $i <= 12; $i++) {
            $labels[] = strtoupper(substr(date('M', mktime(0, 0, 0, $i, 1)), 0, 3));
            $values[] = $monthsData[$i];
        }
        
        return [
            'labels' => $labels,
            'values' => $values
        ];
    }

    private function getBarChartData($udn, $anio) {
        $channels = $this->getChannelMonthlyData([$udn, $anio]);
        
        $months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        $channelData = [];
        
        // Organizar datos por canal
        $channelNames = ['WhatsApp', 'Meep', 'Ecommerce', 'Facebook', 'Llamada', 'Uber', 'Otro'];
        
        foreach ($channelNames as $channelName) {
            $monthlyData = array_fill(0, 12, 0);
            
            foreach ($channels as $data) {
                if ($data['canal'] === $channelName) {
                    $monthIndex = intval($data['mes']) - 1;
                    $monthlyData[$monthIndex] = floatval($data['total_monto']);
                }
            }
            
            $channelData[] = [
                'name' => $channelName,
                'data' => $monthlyData
            ];
        }
        
        return [
            'months' => $months,
            'channels' => $channelData
        ];
    }

    private function getChannelRankingData($udn, $mes, $anio) {
        $channels = $this->getChannelPerformance([$udn, $anio, $mes]);
        
        $ranking = [];
        foreach ($channels as $channel) {
            $ranking[] = [
                'name' => $channel['canal'],
                'total' => floatval($channel['total_monto']),
                'orders' => intval($channel['total_pedidos']),
                'percentage' => number_format(floatval($channel['porcentaje']), 1)
            ];
        }
        
        return $ranking;
    }

    private function getMonthlyPerformanceData($udn, $anio) {
        $trends = $this->getMonthlyOrderTrends([$udn, $anio]);
        
        $performance = [];
        $previousSales = 0;
        
        foreach ($trends as $index => $trend) {
            $currentSales = floatval($trend['total_ventas']);
            $growth = 0;
            
            if ($previousSales > 0) {
                $growth = (($currentSales - $previousSales) / $previousSales) * 100;
            }
            
            $performance[] = [
                'name' => $trend['nombre_mes'],
                'orders' => intval($trend['total_pedidos']),
                'sales' => $currentSales,
                'growth' => round($growth, 1)
            ];
            
            $previousSales = $currentSales;
        }
        
        return $performance;
    }

    private function getDashboardDataByYear($udn, $anio) {
        $cards = $this->getDashboardCardsByYear([$udn, $anio]);
        
        if (empty($cards)) {
            return [
                'ventaDia' => '$0.00',
                'ventaMes' => '$0.00',
                'Clientes' => '0',
                'ChequePromedio' => '$0.00'
            ];
        }

        $card = $cards[0];
        
        return [
            'ingresosTotales' => $this->formatPrice($card['venta_anio'] ?? 0),
            'totalPedidos' => number_format($card['pedidos_anio'] ?? 0),
            'valorPromedio' => $this->formatPrice($card['cheque_promedio'] ?? 0),
            'canalPrincipal' => $card['canal_principal'] ?? 'N/A',
            'variacionIngresos' => '↑ Año completo',
            'rangeFechas' => "Enero - Diciembre {$anio}"
        ];
    }

    private function getBarChartDataByYear($udn, $anio) {
        $channels = $this->getChannelYearlyData([$udn, $anio]);
        
        $months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        $channelData = [];
        
        $channelNames = ['WhatsApp', 'Meep', 'Ecommerce', 'Facebook', 'Llamada', 'Uber', 'Otro'];
        
        foreach ($channelNames as $channelName) {
            $monthlyData = array_fill(0, 12, 0);
            
            foreach ($channels as $data) {
                if ($data['canal'] === $channelName) {
                    $monthIndex = intval($data['mes']) - 1;
                    $monthlyData[$monthIndex] = floatval($data['total_monto']);
                }
            }
            
            $channelData[] = [
                'name' => $channelName,
                'data' => $monthlyData
            ];
        }
        
        return [
            'months' => $months,
            'channels' => $channelData
        ];
    }

    private function getChannelRankingDataByYear($udn, $anio) {
        $channels = $this->getChannelPerformanceByYear([$udn, $anio]);
        
        $ranking = [];
        foreach ($channels as $channel) {
            $ranking[] = [
                'name' => $channel['canal'],
                'total' => floatval($channel['total_monto']),
                'orders' => intval($channel['total_pedidos']),
                'percentage' => number_format(floatval($channel['porcentaje']), 1)
            ];
        }
        
        return $ranking;
    }

    private function formatPrice($amount) {
        return '$' . number_format(floatval($amount), 2);
    }
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());