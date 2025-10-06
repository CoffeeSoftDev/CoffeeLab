<?php
require_once('mdl-contabilidad.php');
class MPagos extends MContabilidad {
function lsProveedores($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}proveedor",
        'values'    => 'idUP AS id,UPPER(Name_Proveedor) AS valor',
        'innerjoin' => ["{$this->bd_fzas}proveedor_udn" => 'idProveedor = id_Proveedor'],
        'where'     => 'Stado = 1,id_UDN',
        'order'     => ['ASC' => 'valor'],
        'data'      => $array
    ]);
}
function lsCostosxAlmacen($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}insumos_clase",
        'values'    => 'idUI AS id,UPPER(Name_IC) AS valor',
        'innerjoin' => ["{$this->bd_fzas}insumos_udn" => 'idIC = id_IC'],
        'where'     => "Name_IC LIKE '%Costo%',Name_IC NOT LIKE '%Indirecto%',Stado = 1,id_UDN",
        'order'     => ['ASC'=>'Name_IC'],
        'data'      => $array
    ]);
}
function listPagos($array,$campo) {
    $leftjoin = [
        "{$this->bd_fzas}gasto_clase"   => 'idCG = id_CG',
        "{$this->bd_fzas}insumos_udn"   => 'idUI = id_UI',
        "{$this->bd_fzas}insumos_clase" => 'idIC = id_IC',
        "{$this->bd_fzas}proveedor_udn" => 'idUP = id_UP',
        "{$this->bd_fzas}proveedor"     => 'idProveedor = id_Proveedor',
        "{$this->bd_fzas}sobres"        => 'idCompras = id_Compras',
    ];

    $values = [
        'idCompras AS folio',
        'idUP',
        'Name_Proveedor AS proveedor',
        'idCG',
        'Name_CG AS tPago',
        'idUI',
        'Name_IC AS almacen',
        'Pago AS pago',
        'Observacion AS obs',
        'Ruta AS ruta',
        'Archivo AS archivo',
        'Titulo AS titulo'
    ];

    return $this->_Select([
        'table'    => "{$this->bd_fzas}compras",
        'values'   => $values,
        'leftjoin' => $leftjoin,
        'where'    => "Pago IS NOT NULL,{$this->bd_fzas}compras.id_UDN,Fecha_Compras".$campo,
        'order'    => ['DESC' => 'idCompras'],
        'data'     => $array
    ]);
}
function lsAlmacen($array){
    $innerjoin = [
        "{$this->bd_fzas}gastos_udn" => "idGastos = id_Gastos",
        "{$this->bd_fzas}insumos_udn" => "id_UI = idUI",
        "{$this->bd_fzas}insumos_clase" => "id_IC = idIC",
    ];

    $where = [
        "{$this->bd_fzas}gastos_udn.Stado = 1",
	    "Name_IC LIKE '%almacen%'",
	    "{$this->bd_fzas}insumos_udn.id_UDN",
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}gastos",
        'values'    => 'idUG AS id,UPPER(Name_Gastos) AS valor',
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'order'     => ['ASC'=>'Name_Gastos'],
        'data'      => $array
    ]);
}

function entradaUG($array,$symbol = '') {
    $symbol .= ($symbol != '')  ? ' ?' : ' BETWEEN ? AND ?';  

    $innerjoin = [
        "{$this->bd_fzas}gastos_udn"    => "{$this->bd_fzas}compras.id_UG = idUG",
        "{$this->bd_fzas}gastos"        => "id_Gastos = idGastos",
        "{$this->bd_fzas}insumos_udn"   => "{$this->bd_fzas}compras.id_UI = idUI AND {$this->bd_fzas}gastos_udn.id_UI = idUI",
        "{$this->bd_fzas}insumos_clase" => "id_IC = idIC",
    ];
    
    $where = [
        "Name_IC LIKE '%almacen%'",
        "{$this->bd_fzas}compras.id_UDN IS NOT NULL",
        "id_UG",
        "Fecha_Compras ".$symbol,
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'SUM(Gasto) AS entrada',
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'data'      => $array
    ])[0]['entrada'];
}
function salidaUG($array,$name,$symbol = ''){
    $symbol .= ($symbol != '')  ? ' ?' : ' BETWEEN ? AND ?';  

    $innerjoin = [
        "{$this->bd_fzas}insumos_udn"   => "id_UI = idUI",
        "{$this->bd_fzas}insumos_clase" => "id_IC = idIC",
    ];

    $where = [
        "{$this->bd_fzas}insumos_udn.Stado = 1",
        "Name_IC LIKE '%costo ".$name."%'",
        "{$this->bd_fzas}compras.id_UDN",
        'Fecha_Compras '.$symbol,
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'SUM(Pago) AS costo',
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'data'      => $array
    ])[0]['costo'];
}
function insPay($array) {
    $exito = $this->_Insert([
        'table'  => "{$this->bd_fzas}compras",
        'values' => $array['values'],
        'data'   => $array['data']
    ]);

    if ( $exito == true ){
        return $this->_Select([
            'table'  => "{$this->bd_fzas}compras",
            'values' => 'MAX(idCompras) AS max',
        ])[0]['max'];
    }

    return $exito;
}
function editPay($array) {
    return $this->_Update([
        'table'  => "{$this->bd_fzas}compras",
        'values' => $array['values'],
        'where'  => $array['where'],
        'data'   => $array['data']
    ]);
}
function deletePay($array) {
    return $this->_Delete([
        'table'  => "{$this->bd_fzas}compras",
        'where'  => 'idCompras',
        'data'   => $array
    ]);
}
function sum_incomeUDNStorage($array,$symbol = '') {
    $symbol .= ($symbol != '') ? '?' : ' BETWEEN ? AND ?' ;

    $innerjoin = [
        "{$this->bd_fzas}insumos_udn"   => "{$this->bd_fzas}compras.id_UI = idUI",
        "{$this->bd_fzas}insumos_clase" => "{$this->bd_fzas}insumos_udn.id_IC = idIC"
    ];

    $where = [
        "Name_IC LIKE '%Almacen%'",
        "{$this->bd_fzas}insumos_udn.Stado = 1",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras ".$symbol
    ];

    if($array[0] != 6 ) {
        $innerjoin["{$this->bd_fzas}gastos_udn"] = "id_UG = idUG AND {$this->bd_fzas}gastos_udn.id_UI = idUI";
        $where[]                                 = "{$this->bd_fzas}gastos_udn.Stado = 1";
    }

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'IFNULL(SUM(Gasto),0) AS entrada',
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'data'      => $array
    ])[0]['entrada'];
}
function sum_egressUDNStorage($array,$symbol = '') {
    $symbol .= ($symbol != '') ? '?' : ' BETWEEN ? AND ?' ;

    $innerjoin = [
        "{$this->bd_fzas}insumos_udn"   => "{$this->bd_fzas}compras.id_UI = idUI",
        "{$this->bd_fzas}insumos_clase" => "id_IC = idIC"
    ];

    $where = [
        "Name_IC LIKE '%costo%'",
        "{$this->bd_fzas}insumos_udn.Stado = 1",
        "Name_IC NOT LIKE '%indirecto%'",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras ".$symbol,
    ];

    if($array[0] == 5) $where[] = "Name_IC NOT LIKE '%guarniciones%'";
    
    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'IFNULL(SUM(Pago),0) AS salida',
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'data'      => $array
    ])[0]['salida'];
}
function dates_incomeStorage($array) {
    $innerjoin = [
        "{$this->bd_fzas}insumos_udn"   => "{$this->bd_fzas}compras.id_UI = idUI",
        "{$this->bd_fzas}insumos_clase" => "{$this->bd_fzas}insumos_udn.id_IC = idIC"
    ];

    $where = [
        "Name_IC LIKE '%Almacen%'",
        "{$this->bd_fzas}insumos_udn.Stado = 1",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras BETWEEN ? AND ?"
    ];

    if($array[0] != 6 ) {
        $innerjoin["{$this->bd_fzas}gastos_udn"] = "id_UG = idUG AND {$this->bd_fzas}gastos_udn.id_UI = idUI";
        $where[]                                 = "{$this->bd_fzas}gastos_udn.Stado = 1";
    }

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'Fecha_Compras AS fecha',
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'data'      => $array
    ]);
}
function date_egressStorage($array) {
    $innerjoin = [
        "{$this->bd_fzas}insumos_udn"   => "{$this->bd_fzas}compras.id_UI = idUI",
        "{$this->bd_fzas}insumos_clase" => "id_IC = idIC"
    ];

    $where = [
        "Name_IC LIKE '%costo%'",
        "{$this->bd_fzas}insumos_udn.Stado = 1",
        "Name_IC NOT LIKE '%indirecto%'",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras BETWEEN ? AND ?",
    ];

    if($array[0] == 5) $where[] = "Name_IC NOT LIKE '%guarniciones%'";
    
    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'Fecha_Compras AS fecha',
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'data'      => $array
    ]);
}
function dates_entradasFZ($array){
    $innerjoin = [
        "{$this->bd_fzas}insumos_udn"   => "id_UI = idUI",
        "{$this->bd_fzas}insumos_clase" => "id_IC = idIC"
    ];

    $where = [
        "Name_IC LIKE '%almacen%'",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras BETWEEN ? AND ?",
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'Fecha_compras AS fecha',
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'data'      => $array
    ]);
}
function dates_salidasFZ($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'Fecha_Compras AS fecha',
        'where'     => 'id_UDN,Fecha_Compras BETWEEN ? AND ?',
        'data'      => $array
    ]);
}
function datesStorage($idE,$date1,$date2){
    $fecha1 = null;
    $fecha2 = null;
    $array = [$idE,$date1,$date2];
    if( $idE == 6 ) {
        $fecha1 = $this->dates_entradasFZ($array);
        $fecha2 = $this->dates_salidasFZ($array);
    } else {
        $fecha1 = $this->dates_incomeStorage($array);
        $fecha2 = $this->date_egressStorage($array);
    }
    
    $dates = array_merge($fecha1,$fecha2);
    $fechas = array_map("unserialize", array_unique(array_map("serialize", $dates)));
    sort($fechas); 
    return $fechas;
}
function sumCost($array,$symbol = ''){
    $symbol .= ($symbol != '') ? ' ?' : 'BETWEEN ? AND ?';

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'IFNULL(SUM(Pago),0) AS salida',
        'where'     => 'id_UI,Fecha_Compras '.$symbol,
        'data'      => $array
    ])[0]['salida'];
}
function dateCost($array){
    $innerjoin = [
        "{$this->bd_fzas}insumos_udn" => "idUI = id_UI",
        "{$this->bd_fzas}insumos_clase" => "idIC = id_IC"
    ];

    $where = [
        "Name_IC LIKE '%Costo%'",
        "Name_IC NOT LIKE '%Indirecto%'",
        "insumos_udn.Stado = 1",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras BETWEEN ? AND ?"
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => "Fecha_Compras AS fecha",
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'group'     => 'Fecha_Compras',
        'order'     => ['ASC','Fecha_Compras'],
        'data'      => $array
    ]);
}
function totalUDNCost($array,$movimiento,$symbol = ''){
    $symbol .= $symbol != '' ? '? ' : 'BETWEEN ? AND ?';
    $innerjoin = [
        "{$this->bd_fzas}insumos_udn" => "idUI = id_UI",
        "{$this->bd_fzas}insumos_clase" => "idIC = id_IC"
    ];

    $where = [
        "Name_IC LIKE '%Costo%'",
        "Name_IC NOT LIKE '%Indirecto%'",
        "insumos_udn.Stado = 1",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras ".$symbol
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => "IFNULL(SUM(".$movimiento."),0) AS cantidad",
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'data'      => $array
    ])[0]['cantidad'];
}
function dayCost($array,$movimiento,$symbol = ''){
    $symbol .= ($symbol != '') ? ' ?' : 'BETWEEN ? AND ?';

    $where = [
        "{$this->bd_fzas}insumos_udn.Stado = 1",
        "{$this->bd_fzas}compras.id_UDN IS NOT NULL",
        "id_UI",
        "Fecha_Compras ".$symbol
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => "IFNULL(SUM({$movimiento}),0) AS cantidad",
        'innerjoin' => ["{$this->bd_fzas}insumos_udn" => 'idUI = id_UI'],
        'where'     => $where,
        'data'      => $array
    ])[0]['cantidad'];
}
}
?>