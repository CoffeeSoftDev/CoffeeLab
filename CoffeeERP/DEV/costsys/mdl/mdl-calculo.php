<?php

class aux_cp extends CRUD
{

    private $bd_erp;
    public function __construct()
    {
        // $this->bd_erp = 'rfwsmqex_gvsl_costsys2.';
        $this->bd_erp = 'rfwsmqex_gvsl_costsys.';
    }

    /* Calculo de SubReceta */
    function totalSubreceta($idSubreceta) {
        #creas un array donde almacenaran todos los idSubrecetas encontrados
        #creamos una variable para almacenar el total de los ingredientes utilizados
        $subrecetasEncontradas = array();
        $totalIng = 0;
        $totalCostoIngredientes = 0;
        $totalCostoIngredientes = $this->totalIngredientesxSubreceta($idSubreceta);
        $totalIng = $totalCostoIngredientes;
        $busquedaSubreceta = $this->select_idSubreceta2($idSubreceta);

        $lsSubReceta = [];

        #realizamos la búsqueda de las primeras subrecetas

        // #validamos que se encontro idSubreceta si no es igual a 0
        if ($busquedaSubreceta != 0 && is_array($busquedaSubreceta)) {
            #anexamos los idSubreceta al final del array declarado arriba
            $lsSubReceta = array_merge($busquedaSubreceta);
        }

        // $lbl = '';

        $TotalSubxSub = [];
        // $totalIng = [];
        $SUBxSUBxSUB = [];

        for ($i = 0; $i < count($lsSubReceta); $i++) {

            //     // if($busquedaSubreceta[$i] != '')
            //     //         #realizamos la búsqueda de las siguientes subrecetas
            //     $lbl .= '<span class="text-danger fw-strong "> [</span> <span class="fs-3">'.$busquedaSubreceta[$i].'';

            // $busquedaSubreceta = $this->select_idSubreceta2($busquedaSubreceta[$i]);
            //     #validamos que se encontro idSubreceta si no es igual a 0
            //     if ( $busquedaSubreceta != 0 ) {
            //         #anexamos los idSubreceta al final del array declarado arriba
            //         $subrecetasEncontradas = array_merge($subrecetasEncontradas,$busquedaSubreceta);
            //     }

            if ($lsSubReceta[$i] != 0) {

                $totalReceta = 0;

                $totalIngredientes = $this->totalIngredientesxSubreceta($busquedaSubreceta[$i]);
                $rendimiento = $this->SelectRendimientoSubreceta($busquedaSubreceta[$i]);
                $cantidad = $this->SelectCantidadSubreceta($idSubreceta, $busquedaSubreceta[$i]);

                if ($rendimiento != 0) {
                    $totalReceta = ($totalIngredientes / $rendimiento) * $cantidad;
                    $SUBxSUBxSUB[$i] = $totalReceta;

                    $totalCostoIngredientes += $totalReceta;

                }

                // $totalIngredientes . '/' . $rendimiento . '*' . $cantidad;

            }


            // if ( $rendimiento != 0 ) {
            //     $totalCostoIngredientes += ($totalIngredientes / $rendimiento) * $cantidad;
            // }

        }



        // // #validamos que tenga ids adentro del array
        // if ( count($subrecetasEncontradas) >= 1 ) {
        // //     #iniciamos el do-while para encontrar mas subrecetas
        //     // do {
        //     //    
        // //         array_splice($subrecetasEncontradas, 0, 1);
        //     // } while (count($subrecetasEncontradas) >= 1);
        // }

        return [
            'TotalIngredientesSubreceta' => $totalCostoIngredientes,
            'Subrecetas2' => $lsSubReceta,
            'TotalSubxSub' => $$TotalSubxSub,
            'totalIng' => $totalIng,
            'SUBxSUBxSUB' => $SUBxSUBxSUB,

            'totalSubreceta' => $totalCostoIngredientes
        ];


        /*habilitar */
        // return $totalCostoIngredientes;
/*--*/
        //    return $totalCostoIngredientes;

    }

    function totalIngredientesxSubreceta($idSubreceta)
    {
        $value = null;
        $array = array($idSubreceta);

        $query = "
    SELECT 
        ROUND(SUM( (precio/contNeto) * cantidad),2) as total 
    FROM 
        {$this->bd_erp}subreceta_ingrediente,
        {$this->bd_erp}ingredientes
    WHERE 
        idIngrediente = id_Ingrediente AND 
        id_Subreceta = ? ";


        $sql = $this->_Read($query, $array);

        $lbl = 'idSubreceta: ' . $idSubreceta;

        foreach ($sql as $key) {
            //    $lbl .= '>'.$key['total'];
            $value = $key['total'];
        }

        return $value;





        // foreach ($sql as $key => $value);
// if ( !isset($value['total']) ) { $value['total'] = 0; }

        // return $value['total'];


    }

    function select_idSubreceta2($idSubreceta)
    {
        $value = null;
        $array = array($idSubreceta);
        $query = "SELECT id_Subreceta2 FROM {$this->bd_erp}subreceta_subreceta WHERE id_Subreceta1 = ?";
        $sql = $this->_Read($query, $array);

        $respuesta = array();

        $lbl = '';

        foreach ($sql as $key => $value) {
            $respuesta[$key] = $value['id_Subreceta2'];
            //  $lbl       .= '>'.$value['id_Subreceta2'];
        }

        // return $lbl;

        if (count($respuesta) >= 1) {
            return $respuesta;

        } else {
            return 0;
        }
    }

    function SelectRendimientoSubreceta($idSubreceta)
    {
        $value = ['rendimiento' => 0];
        $array = array($idSubreceta);
        $query = "SELECT rendimiento FROM {$this->bd_erp}subreceta WHERE idSubreceta = ?";
        $sql = $this->_Read($query, $array);
        
        if (is_array($sql) && !empty($sql)) {
            foreach ($sql as $key => $item) {
                $value = $item;
            }
        }
        
        if (!isset($value['rendimiento'])) {
            $value['rendimiento'] = 0;
        }

        return $value['rendimiento'];
    }

    function SelectCantidadSubreceta($idSubreceta1, $idSubreceta2)
    {
        $value = ['cantidad' => 0];
        $array = array($idSubreceta1, $idSubreceta2);
        $query = "SELECT cantidad FROM {$this->bd_erp}subreceta_subreceta WHERE id_Subreceta1 = ? AND id_Subreceta2 = ?";
        $sql = $this->_Read($query, $array);
        
        if (is_array($sql) && !empty($sql)) {
            foreach ($sql as $key => $item) {
                $value = $item;
            }
        }
        
        if (!isset($value['cantidad'])) {
            $value['cantidad'] = 0;
        }

        return $value['cantidad'];
    }



    /* Calculo de Receta */
    function totalReceta($idReceta)
    {
        $subrecetasEncontradas = array();

        #creamos una variable para almacenar el total de los ingredientes utilizados
        $totalCostoIngredientes = $this->totalIngredientesxReceta($idReceta);

        // #realizamos la búsqueda de las primeras subrecetas
        $busquedaSubreceta = $this->select_idSubreceta($idReceta);
        
        // Validar que sea un array
        if (!is_array($busquedaSubreceta)) {
            $busquedaSubreceta = [];
        }

        $totalSub       = [];
        $SubxSub        = [];
        $SubxSubIng     = [];
        $TotalSubIng    = [];
        $totalSubxSub   = [];
        $totalSubreceta = [];
        $rendimiento    = [];
        $cantidad       = [];

        /* ----------*/
        $totalReceta = 0;
        $totalSubRecetas = 0;

        for ($i = 0; $i < count($busquedaSubreceta); $i++) {


            if ($busquedaSubreceta[$i] != 0)

                $totalCostoSubrecetas = $this->totalSubreceta($busquedaSubreceta[$i]);


            $totalSub[$i] = $totalCostoSubrecetas['TotalIngredientesSubreceta'];
            if ($totalCostoSubrecetas['Subrecetas2'] != null)
                $SubxSub[$i] = $totalCostoSubrecetas['Subrecetas2'];
            $SubxSubIng[$i] = $totalCostoSubrecetas['SubxSubIng'];

            $totalSubxSub[$i] = $totalCostoSubrecetas['SUBxSUBxSUB'];
            $totalSubreceta[$i] = $totalCostoSubrecetas['totalSubreceta'];

            $rendimiento[$i] = $this->SelectRendimientoSubreceta($busquedaSubreceta[$i]);
            $cantidad[$i] = $this->SelectCantidadReceta($idReceta, $busquedaSubreceta[$i]);

            if ($rendimiento[$i] != 0)
                $totalSubRecetas += ($totalSubreceta[$i] / $rendimiento[$i]) * $cantidad[$i];




            // 

            // if($totalCostoSubrecetas['TotalSubxSub'] != null)
            // $totalSubxSub[$i] = $totalCostoSubrecetas['TotalSubxSub'];        



        }// end for

        $totalReceta = $totalCostoIngredientes + $totalSubRecetas;

        $total = $totalCostoIngredientes + number_format($totalSubRecetas,2,'.','');

        // #validamos que se encontro idSubreceta si no es igual a 0
        // if ( $busquedaSubreceta != 0 ) {
        //     #anexamos los idSubreceta al final del array declarado arriba
        //     $subrecetasEncontradas = array_merge($busquedaSubreceta);
        // }

        // // #validamos que tenga ids adentro del array
        // $lbl = '';

        // // if ( count($subrecetasEncontradas) >= 1 ) {
        //     $contador = count($busquedaSubreceta);
        // // //     #iniciamos el do-while para encontrar mas subrecetas
        // // do {



        // //         
        // //         // $totalIngredientes = $this->totalIngredientesxSubreceta($subrecetasEncontradas[0]);

        // //         if ( $rendimiento != 0 ) {
        // //             $totalCostoIngredientes += ($totalCostoSubrecetas / $rendimiento) * $cantidad;
        // //         }

        // //         array_splice($subrecetasEncontradas, 0, 1);

        // } while (count($subrecetasEncontradas) >= 1);
        // }

        return [
            // $idReceta,
            "TotalIngredientes"          => $totalCostoIngredientes,
            "Subrecetas"                 => $busquedaSubreceta,
            "TotalIngredientesSubreceta" => $totalSub,
            "SubxSub"                    => $SubxSub,
            "SubxSubIng"                 => $SubxSubIng,
            "totalSubxSub"               => $totalSubxSub,
            "totalSubreceta"             => $totalSubreceta,
            'Rendimiento'                => $rendimiento,
            'cantidad'                   => $cantidad,
            "totalSubRecetas"            => $totalSubRecetas,
            "totalReceta"                => $totalReceta,
            'total'                      => $total,
            'lblTotalReceta'             => $totalCostoIngredientes.' + '.number_format($totalSubRecetas,2,'.','')



            // $totalCostoSubrecetas
        ];


    }

    function select_idSubreceta($idReceta)
    {
        $value = null;

        $array = [$idReceta];
        $query = "SELECT id_Subreceta FROM {$this->bd_erp}recetas_subrecetas WHERE id_Receta = ?";
        $sql = $this->_Read($query, $array);

        $respuesta = array();

        if (is_array($sql) && !empty($sql)) {
            foreach ($sql as $key => $value) {
                $respuesta[$key] = $value['id_Subreceta'];
            }
        }

        if (count($respuesta) >= 1) {
            return $respuesta;
        } else {
            return 0;
        }
    }

    function totalIngredientesxReceta($idReceta)
    {
        $value = null;
        $array = array($idReceta);


        $query = "SELECT 
        ROUND(SUM( (precio/contNeto) * cantidad),2) as total 
    FROM 
        {$this->bd_erp}recetas_ingredientes,
        {$this->bd_erp}ingredientes
    WHERE 
        idIngrediente = id_Ingrediente AND 
        id_Receta = ?";
        $sql = $this->_Read($query, $array);

        $value = ['total' => 0];
        
        if (is_array($sql) && !empty($sql)) {
            foreach ($sql as $key => $item) {
                $value = $item;
            }
        }
        
        if (!isset($value['total'])) {
            $value['total'] = 0;
        }
        
        return $value['total'];

    }

    function SelectCantidadReceta($idReceta, $idSubreceta)
    {
        $value = ['cantidad' => 0];
        $array = array($idReceta, $idSubreceta);
        $query = "SELECT cantidad FROM {$this->bd_erp}recetas_subrecetas WHERE id_Receta = ? AND id_Subreceta = ?";
        $sql = $this->_Read($query, $array);
        
        if (is_array($sql) && !empty($sql)) {
            foreach ($sql as $key => $item) {
                $value = $item;
            }
        }
        
        if (!isset($value['cantidad'])) {
            $value['cantidad'] = 0;
        }

        return $value['cantidad'];
    }

}



