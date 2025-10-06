<?php
if (empty($_POST['opc']))
    exit(0);

// incluir modelo
require_once ('../mdl/mdl-kpis-merca.php');

$encode = [];


class KPIS extends Kpismerca{

    function listKPI (){

        # Declarar variables
        $__row = [];

        $ingresosGral = $this->lsIngresosGRAL([5]);

        // #Consultar a la base de datos
        $ingresosAyB = $this->lsIngresosAyB([5]);
        $diferencia = $ingresosAyB[0]['ventaTotal'] - 0;

        $ingresosHospedaje = $this->lsIngresosHospedaje([5]);
         

            $__row =[ array(

                'id'       => 0,
                'Concepto'   => 'Suma de Ingresos',
                'ABR 24'     => evaluar($ingresosGral[0]['ventaTotal']),
                'ABR 23'     => '0',
                'Diferencia' => '0.00',
                'opc'      => 0
            ),
             
            array(

                'id'       => 0,
                'Concepto'   => 'Ingresos de Hospedaje',
                'ABR 24'     => evaluar($ingresosHospedaje[0]['ventaTotal']),
                'ABR 23'     => '0.00',
                'Diferencia' => $diferencia,
                'opc'      => 0
            ),

            array(

                'id' => 0,
                'Concepto'   => 'Ingresos AyB',
                'ABR 24'     => evaluar($ingresosAyB[0]['ventaTotal']),
                'ABR 23'     => '0',
                'Diferencia' => evaluar($diferencia),
                'opc' => 0
            ),

            array(

                'id' => 0,
                'Concepto' => 'Ingresos Diversos',
                'ABR 24' => '12,390',
                'ABR 23' => '8760',
                'Diferencia' => ' 3630',
                'opc' => 0
            ),
            
            array(

                'id' => 0,
                'Concepto' => '',
                'colgroup' => true
            )
            

            ];
       
       
       




        #encapsular datos
        return [

            "thead" => ['Concepto', 'ABR 24', 'ABR 23', 'Diferencia'],
            "row" => $__row,
        ];

    }


}


// Instancia del objeto

$obj    = new KPIS();
$fn     = $_POST['opc'];
$encode = $obj->$fn();


// Print JSON :
echo json_encode($encode);


// Utilerias:

function evaluar($val)
{
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}


