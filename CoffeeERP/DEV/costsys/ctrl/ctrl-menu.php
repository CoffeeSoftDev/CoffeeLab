<?php

if (empty($_POST['opc'])) exit(0);

setlocale(LC_TIME, 'es_ES.UTF-8');
date_default_timezone_set('America/Mexico_City');

header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos


require_once('../../conf/coffeSoft.php');

// Mdl.
require_once '../mdl/mdl-menu.php';
require_once ('../mdl/mdl-calculo.php');

class MenuCostsys extends Menu {

    public function __construct() {
        parent::__construct();
    }

    public function TypeReport(){

        $type  = $_POST['type'];

        if( $type == 2 || $type == 3){
          return   $this -> lsMenuCostsys();
        }else{
          return   $this -> lsCostoPotencial();

        }
    }

    // Dashboard
    function apiCostoPotencial() {

            $calculo = new aux_cp;

            $__row             = [];
            $sinVentaCount     = 0;
            $productosNoVenta  = [];
            $productosIngreso  = [];
            $productosMargen   = [];

            $mes              = $_POST['Mes'];
            $year             = $_POST['Anio'];
            $idClasificacion  = $_POST['Clasificacion'];
            $subClasificacion = $_POST['Subclasificacion'];
            $mostrar          = $_POST['mostrar'];
            $type             = $_POST['type'];

            // $tablero = $this->getTableroControl($idClasificacion, $mes, $year);

            $subClasificacion = $this->getListSubClasificacion(1, $idClasificacion);

          

            foreach ($subClasificacion as $sub) {

                $productos = $this->getListProducts($type, $mes, $year, $sub, $idClasificacion);

                $__row[] = [
                    'id'               => $sub['id'],
                    'clave'            => $sub['id'],
                    'nombre'           => $sub['nombre'],
                    'P.propuesto'      => '',
                    'p.venta'          => '',
                    'p.venta sin iva'  => '',
                    'costo'            => '',
                    '% cost'           => '',
                    'mc'               => '',
                    'desplazamiento'   => '',
                    'ventas estimadas' => '',
                    'costo estimado'   => '',
                    'mc estimado'      => '',
                    'opc'              => 1
                ];

                foreach ($productos as $_key) {

                    $filter = getFilterDate([
                        'mesPropuesto'  => $_POST['Mes'],
                        'anioPropuesto' => $_POST['Anio']
                    ]);

                    $costoPotencial = $this->aplicarCalculo([
                        'idReceta'        => $_key['idReceta'],
                        'precioPropuesto' => $_key['precio_propuesto'],
                        'iva'             => $_key['iva'],
                        'ieps'            => $_key['ieps'],
                        'pVenta'          => $_key['precioVenta'],
                        'rendimiento'     => $_key['rendimiento'],
                        'desplazamiento'  => $_key['desplazamiento'],
                        'costo'           => $_key['costo'],
                        'filter'          => $filter
                    ], $calculo);

                    $row = [
                        'id'               => $_key['idReceta'],
                        'clave'            => $_key['idReceta'],
                        'nombre'           => $_key['nombre'],
                        'clasificacion'    => $sub['nombre'],
                        'P.propuesto'      => $_key['precio_propuesto'],
                        'p.venta'          => $costoPotencial['pVenta'],
                        'p.venta sin iva'  => $costoPotencial['pVentaIVA'],
                        'costo'            => $_key['costo'],
                        '% cost'           => $costoPotencial['porcentajeCosto'],
                        'margen'           => $costoPotencial['mc'],
                        'desplazamiento'   => $_key['desplazamiento'] == 0 ? '' : $_key['desplazamiento'],
                        'ventas estimadas' => $costoPotencial['ventasEstimadas'],
                        'costo estimado'   => $costoPotencial['costoEstimado'],
                        'mc estimado'      => $costoPotencial['mcEstimado'],
                        'opc'              => 0
                    ];

                    // 🚫 Si no se vende
                    if ((float) $_key['desplazamiento'] == 0) {
                        $sinVentaCount++;
                        $productosNoVenta[] = $row;
                    }

                    // 📈 Ranking por ingreso y margen
                    $productosIngreso[] = [
                        'id'   => $_key['idReceta'],
                        'clave'   => $_key['idReceta'],
                        'nombre'  => $_key['nombre'],
                        'ingreso' => (float) $costoPotencial['ventasEstimadas'],
                        'ganancia' => (float) $costoPotencial['mcEstimado']
                    ];

                    $productosVendidosCantidad[] = [
                        'id'   => $_key['idReceta'],
                        'clave'   => $_key['idReceta'],
                        'nombre'  => $_key['nombre'],
                        'cantidad' => $_key['desplazamiento'],
                        'ganancia' => (float) $costoPotencial['mcEstimado']
                    ];

                    $productosMargen[] = [
                        'id' => $_key['idReceta'],
                        'clave' => $_key['idReceta'],
                        'nombre' => $_key['nombre'],
                        'desplazamiento' => $_key['desplazamiento'],
                        'margen' => (float) $costoPotencial['mc']
                    ];

                    $__row[] = $row;
                }
            }

            // 🔢 Ordenar mayores ingresos
            usort($productosIngreso, function ($a, $b) {
                return $b['ingreso'] <=> $a['ingreso'];
            });

            // 🔢 Ordenar mayores márgenes
            usort($productosMargen, function ($a, $b) {
                return $b['margen'] <=> $a['margen'];
            });

            $tablero = $this->selectTablero([$idClasificacion, $mes, $year]);

            $tablero['productosSinVenta'] =$sinVentaCount;

            return [
                'listSales'         => ['row' => $__row],
                'sinVentaCount'     => $sinVentaCount,
                'topIngreso'        => $this->lsPromotionByIngreso($productosIngreso),
                'topMargen'         => $this->lsProductosPromocionarMargen($productosMargen),
                'productosSinVenta' => $this->lsProductosSinVenta($productosNoVenta),
                'chartIngreso'      => $this->chartProductosIngreso($productosVendidosCantidad, $productosMargen),
                'chartMargen'      => $this->chartProductosMargen($productosMargen, $productosVendidosCantidad),
                'tablero'           => $tablero,
                // $subClasificacion
            ];
    }

    function lsProductosSinVenta($productosSinVenta) {
        $rows = [];

        foreach ($productosSinVenta as $producto) {
            $product = $this->getLastProduct([$producto['id']]);
            $ultimaVenta = $product['fecha_costo'] ?? null;

            if ($ultimaVenta) {
                $fechaUltima  = new DateTime($ultimaVenta);
                $hoy          = new DateTime(date("Y-m-d"));
                $diff         = $hoy->diff($fechaUltima);
                $diasSinVenta = $diff->days;
            } else {
                // Nunca vendido
                $diasSinVenta = null;
                $ultimaVenta  = "Nunca";
            }

            // 🔹 Decidir acción recomendada
            if (is_null($diasSinVenta)) {
                $accion = 'Descontinuar';
            } elseif ($diasSinVenta >= 365) {
                $accion = 'Descontinuar';
            } elseif ($diasSinVenta >= 180) {
                $accion = 'Promocionar';
            } else {
                $accion = 'Mantener';
            }

            $badge = [
                'Descontinuar' => '<span class="px-3 py-1 rounded text-xs font-bold bg-red-100 text-red-700">Descontinuar</span>',
                'Promocionar'  => '<span class="px-3 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-700">Promocionar</span>',
                'Mantener'     => '<span class="px-3 py-1 rounded text-xs font-bold bg-green-100 text-green-700">Mantener</span>',
            ];

            $rows[] = [
                'id'                 => $producto['id'],
                'Producto'           => $producto['nombre'],
                'Categoria'          => $producto['clasificacion'] ?? 'SIN SUBCLASIFICACION',
                'Ultima Venta'       => $ultimaVenta,
                'Desplazamiento'     => $product['desplazamiento'] ?? '',
                'Dias Sin Venta'     => is_null($diasSinVenta) ? "Nunca" : "{$diasSinVenta} días",
                'Accion Recomendada' => $badge[$accion],
                'opc'                => 0
            ];
        }

        return ['row' => $rows];
    }

    function lsPromotionByIngreso($productosIngreso) {
        $rows = [];
        $i = 1;

        foreach ($productosIngreso as $producto) {
            $ingresoTotal = (float) $producto['ingreso'];
            $ganancia = (float) $producto['ganancia'];

            // 🔹 Calcular porcentaje de ganancia
            $porcentajeGanancia = ($ingresoTotal > 0)
                ? round(($ganancia / $ingresoTotal) * 100, 2)
                : 0;

            // 🔹 Tendencia
            if ($ingresoTotal > 0 && $ingresoTotal >= 5000) {
                $tendencia = '<i class="icon-up-1 text-[18px] text-green-500"></i>';
            } elseif ($ingresoTotal > 0 && $ingresoTotal < 5000) {
                $tendencia = '<i class="icon-minus text-[18px] text-gray-600"></i>';
            } else {
                $tendencia = '<i class="icon-down text-[18px] text-red-500"></i>';
            }

            $rows[] = [
                'Top'          => $i,
                'id'           => $producto['clave'],
                'Producto'     => strtoupper($producto['nombre']),
                'Ingreso Total'=> [
                    'html'  => evaluar($ingresoTotal),
                    'class' => ' font-semibold text-end '
                ],
                'Ganancia'     => evaluar($ganancia),
                '% Ganancia'   => [
                    'html'  => $porcentajeGanancia . '%',
                    'class' => ($porcentajeGanancia >= 30)
                                ? 'text-green-600 font-semibold text-end'
                                : (($porcentajeGanancia >= 15)
                                    ? 'text-yellow-600 font-semibold text-end'
                                    : 'text-red-600 font-semibold text-end')
                ],
                'Tendencia'   => [
                    'html'  => $tendencia,
                    'class' => 'text-center '
                ],
                'opc' => 0
            ];

            $i++;
        }

            return ['row' => $rows];
    }

    function lsProductosPromocionarMargen($productosMargen) {
        $rows = [];
        $i = 1;

        // Calcular mínimos, máximos y promedio de margen
        $margenes = array_column($productosMargen, 'margen');
        $min = min($margenes);
        $max = max($margenes);
        $promedio = ($min + $max) / 2;

        // Calcular promedio de desplazamiento (solo > 0)
        $desplazamientos = array_filter(
            array_column($productosMargen, 'desplazamiento'),
            fn($d) => $d > 0
        );
        $desplazamientoPromedio = count($desplazamientos) > 0 
            ? array_sum($desplazamientos) / count($desplazamientos) 
            : 0;

        foreach ($productosMargen as $producto) {
            $margen = (float) $producto['margen'];
            $desplazamiento = isset($producto['desplazamiento']) ? (int) $producto['desplazamiento'] : 0;

            // Clasificación de margen
            if ($margen >= ($promedio * 1.2)) {
                $nivelMargen = 'alto';
            } elseif ($margen >= ($promedio * 0.8)) {
                $nivelMargen = 'medio';
            } else {
                $nivelMargen = 'bajo';
            }



            // Tendencia visual
            $tendencia = ($margen >= $promedio)
                ? '<i class="icon-up-1 text-[18px] text-green-500"></i>'
                : '<i class="icon-down-2 text-[18px] text-red-500"></i>';

            $rows[] = [
                'Top'                    => $i,
                'id'                     => $producto['clave'],
                'Producto'               => strtoupper($producto['nombre']),
                'desplazamiento'         => $desplazamiento,
                'Margen de contribución' => [
                    'html'  => evaluar($margen),
                    'class' => 'text-blue-600 font-semibold text-end '
                ],
               
                'Tendencia' => [
                    'html'  => $tendencia,
                    'class' => 'text-center'
                ],
                
                'opc' => 0
            ];

            $i++;
        }

        return [
            'row' => $rows,
            'promedio' => $promedio,
            'desplazamiento' => round($desplazamientoPromedio, 2)
        ];
    }


    function chartProductosIngreso($productosVendidosCantidad, $productosMargen = []) {
        $labels = [];
        $data   = [];

        // 🔹 Solo los 10 primeros
        // Ordenar de mayor a menor según cantidad
        usort($productosVendidosCantidad, function ($a, $b) {
            return $b['cantidad'] <=> $a['cantidad'];
        });

        $top = array_slice($productosVendidosCantidad, 0, 10);

        foreach ($top as $producto) {
            $labels[] = $producto['nombre'];
            $data[]   = $producto['cantidad'];
        }

        // Obtener colores dinámicos si se proporcionan datos de margen
        $backgroundColor = [];
        if (!empty($productosMargen)) {
            $colores = $this->evaluateProductsColors($productosVendidosCantidad, $productosMargen);
            $backgroundColor = $colores['ingreso'];
        } else {
            // // Colores por defecto si no hay datos de margen
            // $backgroundColor = [
            //     "#8CC63F", "#103B60", "#1E88E5", "#26A69A", "#F0B200",
            //     "#FF7043", "#AB47BC", "#29B6F6", "#66BB6A", "#EF5350"
            // ];
        }

        return [
            'labels' => $labels,
            'datasets' => [[
                'label' => 'Cantidad Vendida',
                'data'  => $data,
                'backgroundColor' => $backgroundColor,
                'borderRadius' => 6
            ]]
        ];
    }

    function chartProductosMargen($productosMargen, $productosVendidosCantidad = []) {
        $labels = [];
        $data   = [];

        // 🔹 Solo los 10 primeros
        $top = array_slice($productosMargen, 0, 10);

        foreach ($top as $producto) {
            $labels[] = $producto['nombre'];
            $data[]   = evaluar($producto['margen']);
        }

        // Obtener colores dinámicos si se proporcionan datos de ingreso
        $backgroundColor = "#1E88E5"; // Color por defecto
        if (!empty($productosVendidosCantidad)) {
            $colores = $this->evaluateProductsColors($productosVendidosCantidad, $productosMargen);
            $backgroundColor = $colores['margen'];
        }

        return [
            'labels' => $labels,
            'datasets' => [[
                'label' => 'Margen',
                'data'  => $data,
                'backgroundColor' => $backgroundColor,
                'borderRadius'    => 6
            ]]
        ];
    }

    function evaluateProductsColors($productosVendidosCantidad, $productosMargen) {
        // Ordenar de mayor a menor según cantidad
        usort($productosVendidosCantidad, function ($a, $b) {
            return $b['cantidad'] <=> $a['cantidad'];
        });
        // Obtener los top 10 de cada array
        $topIngreso = array_slice($productosVendidosCantidad, 0, 10);
        $topMargen = array_slice($productosMargen, 0, 10);
        
        // Crear arrays de IDs para comparación
        $idsIngreso = array_column($topIngreso, 'id');
        $idsMargen = array_column($topMargen, 'id');
        
        // Encontrar IDs coincidentes
        $idsCoincidentes = array_intersect($idsIngreso, $idsMargen);
        
        // Colores para productos que coinciden en ambas listas
            $coloresCoincidentes = [
                "#E53118", // Rojo  
                "#084D76", // Azul marino
                "#EF6131", // Naranja
                "#F0AE7C", // Durazno
                "#9B2226", // Rojo oscuro
                "#229B97", // Verde azulado
                "#5A229B", // Morado
                "#9B2263", // Magenta oscuro
                "#269B22"  // Verde
            ];
        
        // Color celeste para productos no coincidentes
        $colorCeleste = "#87CEEB";
        
        // Crear mapeo de ID coincidente a color específico
        $mapaColoresCoincidentes = [];
        $indexCoincidente = 0;
        foreach ($idsCoincidentes as $id) {
            $mapaColoresCoincidentes[$id] = $coloresCoincidentes[$indexCoincidente % count($coloresCoincidentes)];
            $indexCoincidente++;
        }
        
        // Generar colores para ingresos
        $backgroundIngreso = [];
        
        foreach ($topIngreso as $producto) {
            if (in_array($producto['id'], $idsCoincidentes)) {
                $backgroundIngreso[] = $mapaColoresCoincidentes[$producto['id']];
            } else {
                $backgroundIngreso[] = $colorCeleste;
            }
        }
        
        // Generar colores para margen
        $backgroundMargen = [];
        
        foreach ($topMargen as $producto) {
            if (in_array($producto['id'], $idsCoincidentes)) {
                $backgroundMargen[] = $mapaColoresCoincidentes[$producto['id']];
            } else {
                $backgroundMargen[] = $colorCeleste;
            }
        }
        
        return [
            'ingreso' => $backgroundIngreso,
            'margen' => $backgroundMargen,
            'coincidencias' => $idsCoincidentes
        ];
    }







    // Costo Potencial

    function lsCostoPotencial() {

        $calculo = new aux_cp;

        # Declarar variables
        $__row   = [];
        $__lsMod = [];

        $mes                  = $_POST['Mes'];
        $year                 = $_POST['Anio'];
        $idClasificacion      = $_POST['Clasificacion'];
        $subClasificacion     = $_POST['Subclasificacion'];
        $productosModificados = false;
        $mostrar              = $_POST['mostrar'];
        $type                 = $_POST['type'];

        // Consultar tablero.
        $tablero = $this -> getTableroControl($idClasificacion, $mes, $year);

        // // Obtener la subclasificación según el type
        $subClasificacion = $this->getListSubClasificacion($type, $idClasificacion);

        foreach ($subClasificacion as $sub) {


            $productos = $this->getListProducts($type, $mes, $year, $sub, $idClasificacion);

            $__row[] = [
                'id'               => $sub['id'],
                'clave'            => $sub['id'],
                'nombre'           => $sub['nombre'],
                'P.propuesto'      => '',
                'p.venta'          => '',
                'p.venta sin iva'  => '',
                'costo'            => '',
                '% cost'           => '',
                'mc'               => '',
                'desplazamiento'   => '',
                'ventas estimadas' => '',
                'costo estimado'   => '',
                'mc estimado'      => '',
                'opc'              => 1
            ];

            // Obtener los productos según el type


            foreach ($productos as $_key) {

                // Aplicar calculo de costo potencial
                $filter =  getFilterDate([ 'mesPropuesto' => $_POST['Mes'],'anioPropuesto' => $_POST['Anio']]);

                $costoPotencial = $this->aplicarCalculo([
                    'idReceta'        => $_key['idReceta'],
                    'precioPropuesto' => $_key['precio_propuesto'],
                    'iva'             => $_key['iva'],
                    'ieps'            => $_key['ieps'],
                    'pVenta'          => $_key['precioVenta'],
                    'rendimiento'     => $_key['rendimiento'],
                    'desplazamiento'  => $_key['desplazamiento'],
                    'costo'           => $_key['costo'],
                    'filter'          => $filter
                ], $calculo);


                // Pintar costos.
                $bgCosto           = verificarCostoDiferente($_key['costo'], $costoPotencial['costoReceta']);
                $bgDesplazamiento  = getDesplazamientoClass($_key['desplazamiento'], $tablero['desplazamientoPromedio']);
                $bgPorcentajeCosto = determinarBgCosto($costoPotencial['porcentajeCosto'], $tablero['costoAlto'], $tablero['costoBajo']);
                $bgMC              = determinarBgMC($costoPotencial['mc'], $tablero['mcAlto'], $tablero['mcBajo']);
                $bg                = $_key['precio_propuesto'] ? '' : '';


                // add P.Propuesto , Desplazamiento
                $desp  = [

                    'class'   => $bgCosto['bgCostoDif'].' '.$bgDesplazamiento.' fw-bold text-end ',
                    'html'    => ($_key['desplazamiento'] == 0) ? '' : $_key['desplazamiento']

                ];

                // draw table.
                $__row[] = [
                    'id'          => $sub['id'],
                    'clave'       => $_key['idReceta'],
                    'nombre'      => $_key['nombre'],
                    'P.propuesto' => evaluar($_key['precio_propuesto']),

                    'p.venta'          => [
                        'html'  => evaluar($costoPotencial['pVenta']),
                        'class' => ' text-end ' . $bgCosto['bgCostoDif']
                    ],

                    'p.venta sin iva'  => [
                        'html'  => evaluar($costoPotencial['pVentaIVA']),
                        'class' => 'text-end ' . $bgCosto['bgCostoDif']
                    ],

                    'costo'            => [
                        'class' => 'text-end text-success' . $bgCosto['bgCostoDif'],
                        'html'  => evaluar($_key['costo']) . $bgCosto['iconCosto']
                    ],

                    '% cost'           => [
                        'class' => ' text-end ' . $bgPorcentajeCosto,
                        'html'  => evaluar($costoPotencial['porcentajeCosto'],'%')
                    ],

                    'mc'               => [
                        'class' => 'text-end ' . $bgMC,
                        'html'  => evaluar($costoPotencial['mc'])
                    ],

                    'desplazamiento'   => $desp,

                    'ventas estimadas' => [
                        'class' => $bgCosto['bgCostoDif'] . ' text-end ' . $bg,
                        'html'  => evaluar($costoPotencial['ventasEstimadas'])
                    ],

                    'costo estimado'   => [
                        'class' => $bgCosto['bgCostoDif'] . ' text-end '. $bg,
                        'html'  => evaluar($costoPotencial['costoEstimado'])
                    ],

                    'mc estimado'      => [
                        'class' => $bgCosto['bgCostoDif'] . ' text-end ' . $bg,
                        'html'  => evaluar($costoPotencial['mcEstimado'])
                    ],

                    'opc'              => 0

                ];
            }
        }

        # Encapsular datos
        return [

            "thead"  => '',
            "row"    => $__row,
            $subClasificacion

        ];

    }


    function lsMenuCostsys(){

        $calculo = new aux_cp;

        // 📏 Declarar variables
        $__row   = [];
        $__lsMod = [];
        $row     = [];

        $mes                  = $_POST['Mes'];
        $name_month           = $_POST['name_month'];
        $year                 = $_POST['Anio'];
        $idClasificacion      = $_POST['Clasificacion'];
        $subClasificacion     = $_POST['Subclasificacion'];
        $productosModificados = false;
        $mostrar              = $_POST['mostrar'];
        $type                 = $_POST['type'];



        // 📜 Obtener subclasificaciones
        $subClasificacion = $this->listMenu([$idClasificacion]);

        foreach ($subClasificacion as $sub) {
            $row = [];
            $productos = $this->listDishes([$mes, $year, $sub['id']]);

            $fechas     = [];
            $fechasName = [];

            // 📜 Generar los últimos 6 meses
            for ($i = 0; $i < 6; $i++) {
                $time         = strtotime("-$i months", strtotime("$year-$mes-01"));
                $monthName    = date('M', $time);
                $yearName     = date('Y', $time);
                $fechasName[] = "$monthName/$yearName";
                $monthNumber  = date('m', $time);
                $yearNumber   = date('Y', $time);
                $fechas[]     = "$monthNumber/$yearNumber";
            }

            // 📌 Inicializar acumulador por columna (mes)
            $totalesGrupo = array_fill_keys($fechasName, 0);

            // 📜 Fila de encabezado
            $campos = [
                'id'     => $sub['id'],
                'clave'  => '',
                'nombre' => $sub['nombre'],
            ];

            $dates = [];
            foreach ($fechasName as $fechaName) {
                $dates[$fechaName] = ''; // se actualizará luego con totales
            }

            $indexEncabezado = count($__row); // 📌 Guardar índice para editar después
            $__row[] = array_merge($campos, $dates, ['opc' => 1]);

            // 📜 Fila de productos
            foreach ($productos as $_key) {

                $campos = [
                    'id'     => $sub['id'],
                    'clave'  => $_key['idDishes'],
                    'nombre' => $_key['nombre'],
                ];

                $dates = [];

                foreach ($fechas as $index => $fecha) {

                    list($m, $y) = explode("/", $fecha);
                    $costo_potencial = $this->selectDatosCostoPotencial([$_key['idReceta'], $m, $y]);



                    if($type == 3){
                        $valor = $costo_potencial['costo'] * $costo_potencial['desplazamiento'];
                        $totalesGrupo[$fechasName[$index]] += $valor; // 🔵 Acumular total por grupo
                         $dates[$fechasName[$index]] = [
                            'html'  => evaluar($valor),
                            'val'   => $valor,
                            'class' => ' text-end '
                        ];
                    }else{
                        $valor                              = floatval($costo_potencial['desplazamiento'] ?? 0);
                        $totalesGrupo[$fechasName[$index]] += $valor; // 🔵 Acumular total por grupo
                         $mostrar_valor                      = ($valor == 0) ? '-' : $valor;  // 📌 Mostrar guion si es cero
                        $dates[$fechasName[$index]] = [
                            'html'  => $mostrar_valor,
                            'val'   => $valor,
                            'class' => 'text-end'
                        ];
                    }





                }

                $row[] = array_merge($campos, $dates, ['opc' => 0]);
            }

            $res   = pintarValPromedios($row,$fechasName);
            $__row = array_merge($__row,$res);

            // 📌 Insertar totales al encabezado del grupo
            foreach ($fechasName as $fechaName) {

                $totalGroup = ($totalesGrupo[$fechaName]) ? $totalesGrupo[$fechaName] : '-';
                if($type == 3){
                    $totalGroup = evaluar($totalesGrupo[$fechaName]);
                }


                $__row[$indexEncabezado][$fechaName] = [
                    'html'  => '<strong>' .$totalGroup. '</strong>',
                    'class' => 'text-end bg-disabled2'
                ];
            }
        }




        // 📦 Devolver datos
        return [
            "thead" => '',
            "row"   => $__row
        ];
    }


//     function MenuByDesplazamiento(){

//     }

    private function getTableroControl($idClasificacion, $mes, $year) {
        $tablero = $this->selectTablero([$idClasificacion, $mes, $year]);

        if (!isset($tablero)) {
            // $this->insertTablero($idClasificacion, $mes, $year);
            $tablero = $this->selectTablero([$idClasificacion, $mes, $year]);
        }

        return [
            'desplazamientoPromedio' => $tablero['desplazamientoPromedio'],
            'costoBajo'              => $tablero['CostoProduccionBajo'],
            'costoAlto'              => $tablero['CostoProduccionAlto'],
            'mcBajo'                 => $tablero['MargenContribucionBajo'],
            'mcAlto'                 => $tablero['MargenContribucionAlto']
        ];
    }


    // list subs and products.
    private function getListSubClasificacion($type, $idClasificacion) {

        // Realizar cambio de consulta por tipo
        switch ($type) {
            case 0:
                return $this->listMenu([$idClasificacion]);
                break;
            case 1:
                $subClasificacion = $this->listSubClasificacion([$idClasificacion]);
                array_unshift($subClasificacion, ['id' => 0, 'nombre' => 'SIN SUBCLASIFICACION']);
                return $subClasificacion;
                break;
            default:
                return [];
        }
    }

    private function getListProducts($type, $mes, $year, $sub, $idClasificacion) {
        switch ($type) {
            case 0:
                return $this->listDishes([$mes, $year, $sub['id']]);
                break;
            case 1:
                if ($sub['id'] != 0) {
                    return $this->lsCostoPotencialSubClasificacion([$mes, $year, $sub['id']]);
                } else {

                    if($_POST['UDNs'] != 4){

                        return $this->lsCostoPotencialReceta([$mes, $year, $idClasificacion]);
                    }
                    // return $this->lsCostoPotencialReceta([$mes, $year, $idClasificacion]);
                }
                break;
            default:
                return [];
        }
    }




}



function getFilterDate($data){
    $mesActual  = intval(date('m'));
    $anioActual = date('Y');

    /*
        Los productos solo se pueden actualizar con un mes de diferencia hacia atrás.
        Obtenemos año y mes propuestos por el usuario y
        obtenemos la fecha con un mes de diferencia para realizar comparativo.
    */

    $mesAnterior  = $mesActual - 1;
    $anioAnterior = intval($anioActual) - 1;


    if (  intval($data['mesPropuesto']) == $mesActual && intval($data['anioPropuesto']) == intval($anioActual) ) {
        return 1;

    }else if ( intval($data['mesPropuesto']) == $mesAnterior && intval($data['anioPropuesto']) == intval($anioActual)) {

        return true;

    }
    if (intval($data['mesPropuesto']) == 12 && $data['anioPropuesto'] == $anioAnterior) {
        return true;
    }else {

        return 0;

    }

}

function getDesplazamientoClass($desplazamiento, $desplazamientoPromedio) {
    if ($desplazamiento >= $desplazamientoPromedio && $desplazamiento != 0) {
        return 'bg-success-light';
    } else if ($desplazamiento < $desplazamientoPromedio && $desplazamiento != 0) {
        return 'bg-danger-light';
    }
    return '';
}

function verificarCostoDiferente($costoActual, $costoPotencial){

    $bgCostoDif           = '';
    $iconCosto            = '';
    $productosModificados = false;

    if (number_format($costoActual, 2) != number_format($costoPotencial, 2)) {

        $bgCostoDif = 'bg-warning-2x ';
        $productosModificados = true;
        $iconCosto = '<i style="font-size:.8em; " class="text-danger  icon-info-1" title="precio diferente: '.evaluar($costoActual).'  / '.$costoPotencial.'    "></i>';

    }

    return [

        'bgCostoDif'           => $bgCostoDif,
        'iconCosto'            => $iconCosto,
        'productosModificados' => $productosModificados

    ];
}

function determinarBgCosto($porcentajeCosto, $costoAlto, $costoBajo){
    $bgCosto = '';

    if ($porcentajeCosto >= $costoAlto) {
        $bgCosto = 'bg-danger-light';
    } elseif ($porcentajeCosto <= $costoBajo) {
        $bgCosto = 'bg-success-light';
    }

    return $bgCosto;
}

function determinarBgMC($mcPotencial, $mcAlto, $mcBajo){
    $bgMC = '';

    if ($mcPotencial >= $mcAlto) {
        $bgMC = 'bg-success-light';
    } elseif ($mcPotencial <= $mcBajo) {
        $bgMC = 'bg-danger-light';
    }

    return $bgMC;
}

function pintarValPromedios($row, $campos) {
    $totalPromedio = 0;
    $countPromedios = 0;

    foreach ($campos as $campo) {
        // 📜 **Extraer valores del campo**
        $currents = array_column($row, $campo);
        $currentsVals = array_column($currents, 'val');

        // 📜 **Filtrar valores diferentes de cero para calcular el mínimo**
        $nonZeroVals = array_filter($currentsVals, function($val) {
            return $val != 0;
        });

        // 📜 **Calcular valores máximos y mínimos distintos de cero**
        $maxCurrentMonth = max($currentsVals);
        $minCurrentMonth = !empty($nonZeroVals) ? min($nonZeroVals) : 0;

        // 📜 **Sumar promedios para calcular el promedio total**
        foreach ($currentsVals as $val) {
            $totalPromedio += $val;
            $countPromedios++;
        }

        // 📜 **Calcular y agregar Promedio Total**
        $promTotal = $countPromedios > 0 ? round($totalPromedio / $countPromedios, 2) : 0;

        // 📜 **Aplicar estilos inline para mayor y menor**
        foreach ($row as &$rows) {
            $valor = $rows[$campo]['val'];
             $rows[$campo]['style'] = 'text-align: right;';

            if ($valor == $maxCurrentMonth && $valor != 0) {
                $rows[$campo]['style'] = 'background-color: #d4edda; color: #274F48; font-size:14px; text-align: right; '; // 🔵 Mayor valor (verde claro)
            } elseif ($valor == $minCurrentMonth && $valor != 0) {
                $rows[$campo]['style'] = 'background-color: #f8d7da; color:#521212; font-size:14px; text-align: right; '; // 🔴 Menor valor distinto de 0 (rojo claro)
            }

            // 📝 Si decides mostrar el promedio total, puedes descomentar esta línea:
            // $rows['Prom Total']['html'] = $promTotal;
        }
    }

    return $row;
}


// Instancia del objeto
$obj      = new MenuCostsys();
$fn       = $_POST['opc'];
$response = $obj->$fn();

echo json_encode($response);

