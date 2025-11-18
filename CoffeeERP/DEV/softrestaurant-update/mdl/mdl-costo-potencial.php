<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');

class mdl extends CRUD {
    protected $util;
    public $bd;
    private $bd_costsys;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_gvsl_finanzas.";
        $this->bd_costsys = "rfwsmqex_gvsl_costsys.";
    }

    function totalReceta($idReceta) {
        $totalCostoIngredientes = $this->totalIngredientesxReceta($idReceta);
        $busquedaSubreceta = $this->selectIdSubreceta($idReceta);
        
        $totalSub = [];
        $SubxSub = [];
        $SubxSubIng = [];
        $totalSubxSub = [];
        $totalSubreceta = [];
        $rendimiento = [];
        $cantidad = [];
        $arregloSubreceta = '';
        
        $totalReceta = 0;
        $totalSubRecetas = 0;

        for ($i = 0; $i < count($busquedaSubreceta); $i++) {
            $arregloSubreceta .= $busquedaSubreceta[$i] . ' / ';

            if ($busquedaSubreceta[$i] != 0) {
                $totalCostoSubrecetas = $this->totalSubreceta($busquedaSubreceta[$i]);
            }

            $totalSub[$i] = $totalCostoSubrecetas['TotalIngredientesSubreceta'];
            if ($totalCostoSubrecetas['Subrecetas2'] != null) {
                $SubxSub[$i] = $totalCostoSubrecetas['Subrecetas2'];
            }
            $SubxSubIng[$i] = $totalCostoSubrecetas['SubxSubIng'];
            $totalSubxSub[$i] = $totalCostoSubrecetas['SUBxSUBxSUB'];
            $totalSubreceta[$i] = $totalCostoSubrecetas['totalSubreceta'];

            $rendimiento[$i] = $this->selectRendimientoSubreceta($busquedaSubreceta[$i]);
            $cantidad[$i] = $this->selectCantidadReceta($idReceta, $busquedaSubreceta[$i]);

            if ($rendimiento[$i] != 0) {
                $totalSubRecetas += ($totalSubreceta[$i] / $rendimiento[$i]) * $cantidad[$i];
            }
        }

        $totalReceta = $totalCostoIngredientes + $totalSubRecetas;

        return [
            "TotalIngredientes" => $totalCostoIngredientes,
            "Subrecetas" => $busquedaSubreceta,
            "TotalIngredientesSubreceta" => $totalSub,
            "SubxSub" => $SubxSub,
            "SubxSubIng" => $SubxSubIng,
            "totalSubxSub" => $totalSubxSub,
            "totalSubreceta" => $totalSubreceta,
            'Rendimiento' => $rendimiento,
            'cantidad' => $cantidad,
            "totalSubRecetas" => $totalSubRecetas,
            "totalReceta" => number_format($totalReceta, 2, '.', ','),
            'lsSubReceta' => $arregloSubreceta,
        ];
    }

    function totalSubreceta($idSubreceta) {
        $subrecetasEncontradas = array();
        $totalIng = 0;
        $totalCostoIngredientes = 0;
        $totalCostoIngredientes = $this->totalIngredientesxSubreceta($idSubreceta);
        $totalIng = $totalCostoIngredientes;
        $busquedaSubreceta = $this->selectIdSubreceta2($idSubreceta);

        $lsSubReceta = [];

        if ($busquedaSubreceta != 0) {
            $lsSubReceta = array_merge($busquedaSubreceta);
        }

        $TotalSubxSub = [];
        $SUBxSUBxSUB = [];

        for ($i = 0; $i < count($lsSubReceta); $i++) {
            if ($lsSubReceta[$i] != 0) {
                $totalReceta = 0;
                $totalIngredientes = $this->totalIngredientesxSubreceta($busquedaSubreceta[$i]);
                $rendimiento = $this->selectRendimientoSubreceta($busquedaSubreceta[$i]);
                $cantidad = $this->selectCantidadSubreceta($idSubreceta, $busquedaSubreceta[$i]);

                if ($rendimiento != 0) {
                    $totalReceta = ($totalIngredientes / $rendimiento) * $cantidad;
                    $SUBxSUBxSUB[$i] = $totalReceta;
                    $totalCostoIngredientes += $totalReceta;
                }
            }
        }

        return [
            'TotalIngredientesSubreceta' => $totalCostoIngredientes,
            'Subrecetas2' => $lsSubReceta,
            'TotalSubxSub' => $TotalSubxSub,
            'totalIng' => $totalIng,
            'SUBxSUBxSUB' => $SUBxSUBxSUB,
            'totalSubreceta' => $totalCostoIngredientes
        ];
    }

    function calculoCostoPotencial($data, $calculo) {
        $permiso = 1;
        $impuestos = $data['iva'] + $data['ieps'];
        $pVentaIVA = $data['pVenta'] / (1 + ($impuestos / 100));
        $receta = $calculo->totalReceta($data['idReceta']);
        $total = $receta['totalReceta'];
        $costo = $total / $data['rendimiento'];
        
        $porcentajeCosto = ($costo / $pVentaIVA) * 100;
        $mc = $pVentaIVA - $costo;
        $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
        $costoEstimado = $costo * $data['desplazamiento'];
        $mcEstimado = $mc * $data['desplazamiento'];

        if ($data['precioPropuesto']) {
            $pVentaIVA = $data['precioPropuesto'] / (1 + ($impuestos / 100));
            $mc = $pVentaIVA - $costo;
            $ventasEstimadas = $pVentaIVA * $data['desplazamiento'];
            $mcEstimado = $mc * $data['desplazamiento'];
        }

        $desplazamientoPromedio = 0;
        $costoAlto = 0;
        $costoBajo = 0;
        $mcAlto = 0;
        $mcBajo = 0;

        return [
            'pVenta' => $data['pVenta'],
            'pVentaIVA' => $pVentaIVA,
            'costo' => $costo,
            'mc' => $pVentaIVA - $costo,
            'porcentajeCosto' => $porcentajeCosto,
            'impuestos' => $impuestos,
            'ventasEstimadas' => $ventasEstimadas,
            'costoEstimado' => $costoEstimado,
            'mcEstimado' => $mcEstimado,
            'desplazamiento' => $data['desplazamiento'],
            'total' => $total,
        ];
    }

    function totalIngredientesxReceta($idReceta) {
        $value = null;
        $array = array($idReceta);
        $query = "
            SELECT 
                ROUND(SUM((precio/contNeto) * cantidad), 2) AS total 
            FROM {$this->bd_costsys}recetas_ingredientes,
                {$this->bd_costsys}ingredientes
            WHERE idIngrediente = id_Ingrediente 
                AND id_Receta = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key => $value);
        if (!isset($value['total'])) {
            $value['total'] = 0;
        }
        return $value['total'];
    }

    function totalIngredientesxSubreceta($idSubreceta) {
        $value = null;
        $array = array($idSubreceta);
        $query = "
            SELECT 
                ROUND(SUM((precio/contNeto) * cantidad), 2) AS total 
            FROM {$this->bd_costsys}subreceta_ingrediente,
                {$this->bd_costsys}ingredientes
            WHERE idIngrediente = id_Ingrediente 
                AND id_Subreceta = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $value = $key['total'];
        }
        return $value;
    }

    function selectIdSubreceta($idReceta) {
        $value = null;
        $array = [$idReceta];
        $query = "
            SELECT id_Subreceta 
            FROM {$this->bd_costsys}recetas_subrecetas 
            WHERE id_Receta = ?
        ";
        $sql = $this->_Read($query, $array);
        $respuesta = array();
        foreach ($sql as $key => $value) {
            $respuesta[$key] = $value['id_Subreceta'];
        }
        if (count($respuesta) >= 1) {
            return $respuesta;
        } else {
            return 0;
        }
    }

    function selectIdSubreceta2($idSubreceta) {
        $value = null;
        $array = array($idSubreceta);
        $query = "
            SELECT id_Subreceta2 
            FROM {$this->bd_costsys}subreceta_subreceta 
            WHERE id_Subreceta1 = ?
        ";
        $sql = $this->_Read($query, $array);
        $respuesta = array();
        foreach ($sql as $key => $value) {
            $respuesta[$key] = $value['id_Subreceta2'];
        }
        if (count($respuesta) >= 1) {
            return $respuesta;
        } else {
            return 0;
        }
    }

    function selectRendimientoSubreceta($idSubreceta) {
        $value = null;
        $array = array($idSubreceta);
        $query = "
            SELECT rendimiento 
            FROM {$this->bd_costsys}subreceta 
            WHERE idSubreceta = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key => $value);
        if (!isset($value)) {
            $value['rendimiento'] = 0;
        }
        return $value['rendimiento'];
    }

    function selectCantidadSubreceta($idSubreceta1, $idSubreceta2) {
        $value = null;
        $array = array($idSubreceta1, $idSubreceta2);
        $query = "
            SELECT cantidad 
            FROM {$this->bd_costsys}subreceta_subreceta 
            WHERE id_Subreceta1 = ? 
                AND id_Subreceta2 = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key => $value);
        if (!isset($value)) {
            $value['cantidad'] = 0;
        }
        return $value['cantidad'];
    }

    function selectCantidadReceta($idReceta, $idSubreceta) {
        $value = null;
        $array = array($idReceta, $idSubreceta);
        $query = "
            SELECT cantidad 
            FROM {$this->bd_costsys}recetas_subrecetas 
            WHERE id_Receta = ? 
                AND id_Subreceta = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key => $value);
        if (!isset($value)) {
            $value['cantidad'] = 0;
        }
        return $value['cantidad'];
    }

    function getNameSubreceta($data) {
        $nombre = 'not found';
        $query = "
            SELECT nombre 
            FROM {$this->bd_costsys}subreceta 
            WHERE idSubreceta = ?
        ";
        $sql = $this->_Read($query, $data);
        foreach ($sql as $key) {
            $nombre = $key['nombre'];
        }
        return $nombre;
    }

    function listCostoPotencial($array) {
        return $this->_Select([
            'table' => "{$this->bd_costsys}costopotencial",
            'values' => '*',
            'where' => 'idE = ? AND MONTH(fecha_costo) = ? AND YEAR(fecha_costo) = ?',
            'order' => ['DESC' => 'fecha_costo'],
            'data' => $array
        ]);
    }

    function getCostoPotencialById($array) {
        return $this->_Select([
            'table' => "{$this->bd_costsys}costopotencial",
            'values' => '*',
            'where' => 'idcostopotencial = ?',
            'data' => $array
        ])[0];
    }

    function createCostoPotencial($array) {
        return $this->_Insert([
            'table' => "{$this->bd_costsys}costopotencial",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    function updateCostoPotencial($array) {
        return $this->_Update([
            'table' => "{$this->bd_costsys}costopotencial",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }
}
