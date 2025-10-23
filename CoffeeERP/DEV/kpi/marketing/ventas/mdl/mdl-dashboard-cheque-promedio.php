<?php
require_once('../../../../conf/_CRUD.php');
require_once('../../../../conf/_Utileria.php');

class mdl extends CRUD {
    public $bd;
    public $bd2;
    public $util;

    function __construct() {
        $this->bd  = "rfwsmqex_gvsl_finanzas.";
        $this->bd2 = "rfwsmqex_gvsl_finanzas.";
        $this->util = new Utileria();
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

    function lsCategoriasByUDN($array) {
        $query = "
            SELECT idClasificacion AS id, Clasificacion AS valor, id_UDN as udn
            FROM rfwsmqex_gvsl_costsys.clasificacion
            WHERE id_UDN = ? AND idClasificacion NOT IN (7, 9)
            ORDER BY Clasificacion ASC
        ";
        return $this->_Read($query, $array);
    }

    function getVentasDia($array) {
        $query = "
            SELECT 
                COALESCE(SUM(alimentos + bebidas + Hospedaje + AyB + Diversos), 0) as total
            FROM {$this->bd}soft_restaurant_ventas
            WHERE id_udn = ? 
            AND DATE(fecha_folio) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
        ";
        $result = $this->_Read($query, $array);
        return $result[0]['total'] ?? 0;
    }

    function getVentasMes($array) {
        $query = "
            SELECT 
                COALESCE(SUM(alimentos + bebidas + Hospedaje + AyB + Diversos), 0) as total
            FROM {$this->bd}soft_restaurant_ventas
            WHERE id_udn = ? 
            AND YEAR(fecha_folio) = ? 
            AND MONTH(fecha_folio) = ?
        ";
        $result = $this->_Read($query, $array);
        return $result[0]['total'] ?? 0;
    }

    function getClientesMes($array) {
        $query = "
            SELECT 
                COALESCE(SUM(noHabitaciones), 0) as total_clientes
            FROM {$this->bd}soft_restaurant_ventas
            WHERE id_udn = ? 
            AND YEAR(fecha_folio) = ? 
            AND MONTH(fecha_folio) = ?
        ";
        $result = $this->_Read($query, $array);
        return $result[0]['total_clientes'] ?? 0;
    }

    function getChequePromedioMes($array) {
        $query = "
            SELECT 
                COALESCE(SUM(alimentos + bebidas + Hospedaje + AyB + Diversos), 0) as total_ventas,
                COALESCE(SUM(noHabitaciones), 0) as total_clientes
            FROM {$this->bd}soft_restaurant_ventas
            WHERE id_udn = ? 
            AND YEAR(fecha_folio) = ? 
            AND MONTH(fecha_folio) = ?
        ";
        $result = $this->_Read($query, $array);
        
        $totalVentas = $result[0]['total_ventas'] ?? 0;
        $totalClientes = $result[0]['total_clientes'] ?? 0;
        
        if ($totalClientes > 0) {
            return $totalVentas / $totalClientes;
        }
        
        return 0;
    }

    function listChequePromedioDashboard($array) {
        $udn = $array[0];
        $anio = $array[1];
        $mes = $array[2];
        $anioAnterior = $anio - 1;

        $ventaDia = $this->getVentasDia([$udn]);
        $ventaMesActual = $this->getVentasMes([$udn, $anio, $mes]);
        $ventaMesAnterior = $this->getVentasMes([$udn, $anioAnterior, $mes]);
        
        $clientesMesActual = $this->getClientesMes([$udn, $anio, $mes]);
        $clientesMesAnterior = $this->getClientesMes([$udn, $anioAnterior, $mes]);
        
        $chequePromedioActual = $this->getChequePromedioMes([$udn, $anio, $mes]);
        $chequePromedioAnterior = $this->getChequePromedioMes([$udn, $anioAnterior, $mes]);

        $variacionCheque = 0;
        if ($chequePromedioAnterior > 0) {
            $variacionCheque = (($chequePromedioActual - $chequePromedioAnterior) / $chequePromedioAnterior) * 100;
        }

        $tendencia = 'estable';
        if ($variacionCheque > 5) {
            $tendencia = 'positiva';
        } elseif ($variacionCheque < -5) {
            $tendencia = 'negativa';
        }

        return [
            'ventaDia' => $ventaDia,
            'ventaMes' => $ventaMesActual,
            'ventaMesAnterior' => $ventaMesAnterior,
            'Clientes' => $clientesMesActual,
            'ClientesAnterior' => $clientesMesAnterior,
            'ChequePromedio' => $chequePromedioActual,
            'ChequePromedioAnterior' => $chequePromedioAnterior,
            'variacionCheque' => $variacionCheque,
            'tendencia' => $tendencia
        ];
    }

    function listChequePromedioByCategory($array) {
        $udn = $array[0];
        $anio = $array[1];
        $mes = $array[2];
        $anioAnterior = $anio - 1;

        $categorias = [];
        $dataActual = [];
        $dataAnterior = [];

        if ($udn == 1) {
            $categorias = ['Hospedaje', 'AyB', 'Diversos'];
            
            foreach ($categorias as $cat) {
                $queryActual = "
                    SELECT 
                        COALESCE(SUM($cat), 0) as total,
                        COALESCE(SUM(noHabitaciones), 0) as clientes
                    FROM {$this->bd}soft_restaurant_ventas
                    WHERE id_udn = ? AND YEAR(fecha_folio) = ? AND MONTH(fecha_folio) = ?
                ";
                $resultActual = $this->_Read($queryActual, [$udn, $anio, $mes]);
                $chequeActual = $resultActual[0]['clientes'] > 0 
                    ? $resultActual[0]['total'] / $resultActual[0]['clientes'] 
                    : 0;
                
                $resultAnterior = $this->_Read($queryActual, [$udn, $anioAnterior, $mes]);
                $chequeAnterior = $resultAnterior[0]['clientes'] > 0 
                    ? $resultAnterior[0]['total'] / $resultAnterior[0]['clientes'] 
                    : 0;
                
                $dataActual[] = round($chequeActual, 2);
                $dataAnterior[] = round($chequeAnterior, 2);
            }
        } elseif ($udn == 5) {
            $categorias = ['Alimentos', 'Bebidas', 'Guarniciones', 'Sales', 'Domicilio'];
            $campos = ['alimentos', 'bebidas', 'guarniciones', 'sales', 'domicilio'];
            
            foreach ($campos as $index => $campo) {
                $queryActual = "
                    SELECT 
                        COALESCE(SUM($campo), 0) as total,
                        COALESCE(SUM(noHabitaciones), 0) as clientes
                    FROM {$this->bd}soft_restaurant_ventas
                    WHERE id_udn = ? AND YEAR(fecha_folio) = ? AND MONTH(fecha_folio) = ?
                ";
                $resultActual = $this->_Read($queryActual, [$udn, $anio, $mes]);
                $chequeActual = $resultActual[0]['clientes'] > 0 
                    ? $resultActual[0]['total'] / $resultActual[0]['clientes'] 
                    : 0;
                
                $resultAnterior = $this->_Read($queryActual, [$udn, $anioAnterior, $mes]);
                $chequeAnterior = $resultAnterior[0]['clientes'] > 0 
                    ? $resultAnterior[0]['total'] / $resultAnterior[0]['clientes'] 
                    : 0;
                
                $dataActual[] = round($chequeActual, 2);
                $dataAnterior[] = round($chequeAnterior, 2);
            }
        } else {
            $categorias = ['Alimentos', 'Bebidas'];
            $campos = ['alimentos', 'bebidas'];
            
            foreach ($campos as $campo) {
                $queryActual = "
                    SELECT 
                        COALESCE(SUM($campo), 0) as total,
                        COALESCE(SUM(noHabitaciones), 0) as clientes
                    FROM {$this->bd}soft_restaurant_ventas
                    WHERE id_udn = ? AND YEAR(fecha_folio) = ? AND MONTH(fecha_folio) = ?
                ";
                $resultActual = $this->_Read($queryActual, [$udn, $anio, $mes]);
                $chequeActual = $resultActual[0]['clientes'] > 0 
                    ? $resultActual[0]['total'] / $resultActual[0]['clientes'] 
                    : 0;
                
                $resultAnterior = $this->_Read($queryActual, [$udn, $anioAnterior, $mes]);
                $chequeAnterior = $resultAnterior[0]['clientes'] > 0 
                    ? $resultAnterior[0]['total'] / $resultAnterior[0]['clientes'] 
                    : 0;
                
                $dataActual[] = round($chequeActual, 2);
                $dataAnterior[] = round($chequeAnterior, 2);
            }
        }

        return [
            'labels' => $categorias,
            'dataActual' => $dataActual,
            'dataAnterior' => $dataAnterior
        ];
    }

    function listVentasPorDiaSemana($array) {
        $udn = $array[0];
        $anio = $array[1];
        $mes = $array[2];
        $anioAnterior = $anio - 1;

        $diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        $dataActual = [];
        $dataAnterior = [];

        for ($dia = 1; $dia <= 7; $dia++) {
            $queryActual = "
                SELECT 
                    COALESCE(AVG(alimentos + bebidas + Hospedaje + AyB + Diversos), 0) as promedio
                FROM {$this->bd}soft_restaurant_ventas
                WHERE id_udn = ? 
                AND YEAR(fecha_folio) = ? 
                AND MONTH(fecha_folio) = ?
                AND DAYOFWEEK(fecha_folio) = ?
            ";
            
            $resultActual = $this->_Read($queryActual, [$udn, $anio, $mes, $dia]);
            $dataActual[] = round($resultActual[0]['promedio'], 2);
            
            $resultAnterior = $this->_Read($queryActual, [$udn, $anioAnterior, $mes, $dia]);
            $dataAnterior[] = round($resultAnterior[0]['promedio'], 2);
        }

        return [
            'labels' => $diasSemana,
            'dataActual' => $dataActual,
            'dataAnterior' => $dataAnterior
        ];
    }

    function listTopDiasMes($array) {
        $udn = $array[0];
        $anio = $array[1];
        $mes = $array[2];

        $query = "
            SELECT 
                DATE_FORMAT(fecha_folio, '%Y-%m-%d') as fecha,
                DAYNAME(fecha_folio) as dia,
                SUM(noHabitaciones) as clientes,
                SUM(alimentos + bebidas + Hospedaje + AyB + Diversos) as total
            FROM {$this->bd}soft_restaurant_ventas
            WHERE id_udn = ? 
            AND YEAR(fecha_folio) = ? 
            AND MONTH(fecha_folio) = ?
            GROUP BY DATE(fecha_folio)
            ORDER BY total DESC
            LIMIT 5
        ";
        
        return $this->_Read($query, $array);
    }

    function listTopDiasSemanaPromedio($array) {
        $udn = $array[0];
        $anio = $array[1];
        $mes = $array[2];

        $query = "
            SELECT 
                CASE DAYOFWEEK(fecha_folio)
                    WHEN 1 THEN 'Domingo'
                    WHEN 2 THEN 'Lunes'
                    WHEN 3 THEN 'Martes'
                    WHEN 4 THEN 'Miércoles'
                    WHEN 5 THEN 'Jueves'
                    WHEN 6 THEN 'Viernes'
                    WHEN 7 THEN 'Sábado'
                END as dia,
                AVG(alimentos + bebidas + Hospedaje + AyB + Diversos) as promedio,
                COUNT(*) as veces,
                SUM(noHabitaciones) as clientes
            FROM {$this->bd}soft_restaurant_ventas
            WHERE id_udn = ? 
            AND YEAR(fecha_folio) = ? 
            AND MONTH(fecha_folio) = ?
            GROUP BY DAYOFWEEK(fecha_folio)
            ORDER BY promedio DESC
        ";
        
        return $this->_Read($query, $array);
    }

    function listIngresosDiariosComparativos($array) {
        $udn = $array[0];
        $anio = $array[1];
        $mes = $array[2];
        $categoria = isset($array[3]) ? $array[3] : null;
        $anioAnterior = $anio - 1;

        $campoVentas = "alimentos + bebidas + Hospedaje + AyB + Diversos";
        
        if ($categoria) {
            $categoria = strtolower(trim($categoria));
            if (in_array($categoria, ['alimentos', 'bebidas', 'hospedaje', 'ayb', 'diversos', 'guarniciones', 'sales', 'domicilio'])) {
                $campoVentas = $categoria;
            }
        }

        $diasMes = cal_days_in_month(CAL_GREGORIAN, $mes, $anio);
        $labels = [];
        $dataActual = [];
        $dataAnterior = [];

        for ($dia = 1; $dia <= $diasMes; $dia++) {
            $labels[] = str_pad($dia, 2, '0', STR_PAD_LEFT);
            
            $queryActual = "
                SELECT 
                    COALESCE(SUM($campoVentas), 0) as total
                FROM {$this->bd}soft_restaurant_ventas
                WHERE id_udn = ? 
                AND DATE(fecha_folio) = ?
            ";
            
            $fechaActual = sprintf('%04d-%02d-%02d', $anio, $mes, $dia);
            $resultActual = $this->_Read($queryActual, [$udn, $fechaActual]);
            $dataActual[] = round($resultActual[0]['total'], 2);
            
            $fechaAnterior = sprintf('%04d-%02d-%02d', $anioAnterior, $mes, $dia);
            $resultAnterior = $this->_Read($queryActual, [$udn, $fechaAnterior]);
            $dataAnterior[] = round($resultAnterior[0]['total'], 2);
        }

        return [
            'labels' => $labels,
            'dataActual' => $dataActual,
            'dataAnterior' => $dataAnterior
        ];
    }
}
