<?php
require_once('mdl-contabilidad.php');
class MCompras extends MContabilidad {
function lsProveedores($array) {
    $data = $this->_Select([
        'table'  => "{$this->bd_fzas}proveedor",
        'values' => 'idUP AS id,UPPER(Name_Proveedor) AS valor',
        'innerjoin' => ["{$this->bd_fzas}proveedor_udn" => 'idProveedor = id_Proveedor'],
        'where'  => 'Stado = 1,id_UDN',
        'order'  => ['ASC' => 'valor'],
        'data'   => $array
    ]);

    array_unshift($data, ['id'=>'','valor'=>'- SELECCIONAR -']);
    return $data;
}
function lsClaseInsumo($array) {
    $data = $this->_Select([
        'table'  => "{$this->bd_fzas}insumos_clase",
        'values' => 'idUI AS id,UPPER(Name_IC) AS valor,descripcion',
        'innerjoin' => ["{$this->bd_fzas}insumos_udn" => 'idIC = id_IC'], 
        'where'  => 'Stado = 1,id_UDN',
        'order'  => ['ASC' => 'valor'],
        'data'   => $array
    ]);
    
    array_unshift($data, ['id'=>'','valor'=>'- SELECCIONAR -']);
    return $data;
}
function lsInsumos($array) {
    $data = $this->_Select([
        'table'  => "{$this->bd_fzas}gastos",
        'values' => 'idUG AS id,UPPER(Name_Gastos) AS valor, id_UI',
        'innerjoin' => ["{$this->bd_fzas}gastos_udn" => 'id_Gastos = idGastos'],
        'where'  => 'Stado = 1,id_UI IS NOT NULL,id_UDN',
        'order'  => ['ASC' => 'valor'],
        'data'   => $array
    ]);

    array_unshift($data, ['id'=>'','valor'=>'- SELECCIONAR -']);
    return $data;
}
function lsFacturas($array) {
    $data = $this->_Select([
        'table'     => "{$this->bd_fzas}facturas",
        'values'    => 'idF AS id,folio AS valor',
        'where'     => 'id_UDN,fecha_compra >= DATE_SUB(NOW(), INTERVAL 4 MONTH)',
        'data'      => $array
    ]);

    // array_unshift($data, ['id'=>'null','valor'=>'- SELECCIONAR -']);
    
    return $data;
}
function listCompras($array,$campo) {
    $leftjoin = [
        "{$this->bd_fzas}gasto_clase"   => 'idCG = id_CG',
        "{$this->bd_fzas}insumos_udn"   => 'idUI = id_UI',
        "{$this->bd_fzas}insumos_clase" => 'idIC = id_IC',
        "{$this->bd_fzas}gastos_udn"    => 'idUG = id_UG',
        "{$this->bd_fzas}gastos"        => 'idGastos = id_Gastos',
        "{$this->bd_fzas}proveedor_udn" => 'idUP = id_UP',
        "{$this->bd_fzas}proveedor"     => 'idProveedor = id_Proveedor',
        "{$this->bd_fzas}facturas"     => 'idF = id_F',
        "{$this->bd_fzas}tipo_pago"     => 'idTP = id_TP',
    ];

    $values = [
        'idCompras AS folio',
        'idUP',
        'UPPER(Name_Proveedor) AS proveedor',
        'idUI',
        'UPPER(Name_IC) as cinsumo',
        'idUG',
        'UPPER(Name_Gastos) as insumo',
        'Gasto as subtotal',
        'GastoIVA AS impuesto',
        'idCG',
        'UPPER(Name_CG) AS tCompra',
        'id_TP AS idTP',
        'Name_TP AS tPago',
        'Observacion as obs',
        'idF',
        'folio AS factura'
    ];

    return $this->_Select([
        'table'    => "{$this->bd_fzas}compras",
        'values'   => $values,
        'leftjoin' => $leftjoin,
        'where'    => "Gasto IS NOT NULL,{$this->bd_fzas}compras.id_UDN,{$this->bd_fzas}compras.Fecha_Compras".$campo,
        'order'    => ['DESC' => 'idCompras'],
        'data'     => $array
    ]);
}
function maxBill() {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}facturas",
        'values'    => 'MAX(idF) As id',
    ])[0]['id'];
}
function newBill($array) {
    $exit = $this->_Insert([
        'table'  => "{$this->bd_fzas}facturas",
        'values' => 'folio,id_UDN,Fecha_Compras',
        'data'   => $array
    ]);

    if($exit) return $this->maxBill();
    else return $exit;
}
function resetBill($array) {
    return $this->_Update([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'id_F',
        'where'  => 'idCompras',
        'data'   => $array
    ]);
}
function maxBuy() {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'MAX(idCompras) As id',
    ])[0]['id'];
}
function insBuy($array) {
    return $this->_Insert([
        'table'  => "{$this->bd_fzas}compras",
        'values' => $array['values'],
        'data'   => $array['data']
    ]);
}
function editBuy($array) {
    return $this->_Update([
        'table'  => "{$this->bd_fzas}compras",
        'values' => $array['values'],
        'where'  => $array['where'],
        'data'   => $array['data']
    ]);
}
function deleteBuy($array) {
    return $this->_Delete([
        'table'  => "{$this->bd_fzas}compras",
        'where'  => 'idCompras',
        'data'   => $array
    ]);
}
function fileBill($array){
    return $this->_Update([
        'table'  => "{$this->bd_fzas}sobres",
        'values' => $array['values'],
        'where'  => $array['where'],
        'data'   => $array['data']
    ]);
}
function maxFile(){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}sobres",
        'values'    => 'MAX(idSobre) AS max',
    ])[0]['max'];
}
// CONSULTS
function lsConsultBuys($array,$idTP) {
    $value     = [
        'idUI AS id',
        'Name_IC AS valor',
        'SUM( IFNULL(Gasto,0) ) AS subtotal',
        'SUM( IFNULL(GastoIVA,0) ) AS impuesto',
    ];

    $innerjoin = [
        "{$this->bd_fzas}insumos_udn"   => 'idUI = id_UI',
        "{$this->bd_fzas}insumos_clase" => 'idIC = id_IC',
    ];

    $where = [
        "Gasto IS NOT NULL",
        "id_CG",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras BETWEEN ? AND ?",
    ];

    if($array[0] == '5'){
        // Eliminar el idCG = 5 porque no existe en la BD
        unset($array[0]);
        // Eliminar Id_CG del where, para coincidir en valores con el array
        unset($where[1]);
        // Reindexar los arreglos para corregir el orden númerico.
        $array = array_values($array);
        $where = array_values($where);
    }

    if($idTP != "0") {
        $array[] = $idTP;
        $where[] = "id_TP";
    }

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => $value,
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'group'     => 'idUI',
        'order'     => ['ASC'=>'Name_IC'],
        'data'      => $array
    ]);
}
function listGastosBuys($array,$idTP) {
    $value     = [
        'idUG AS id',
        'Name_Gastos AS valor',
        'SUM( IFNULL(Gasto,0) ) AS subtotal',
        'SUM( IFNULL(GastoIVA,0) ) AS impuesto'
    ];

    $innerjoin = [
        "{$this->bd_fzas}gastos_udn" => 'idUG = id_UG',
        "{$this->bd_fzas}gastos"     => 'idGastos = id_Gastos',
    ];

    $where     = [
        'Gasto IS NOT NULL',
        "{$this->bd_fzas}compras.id_UDN IS NOT NULL",
        'id_CG',
        "{$this->bd_fzas}gastos_udn.id_UI",
        'Fecha_Compras BETWEEN ? AND ?'
    ];

    if($array[0] == '5'){
        // Eliminar el idCG = 5 porque no existe en la BD
        unset($array[0]);
        // Eliminar Id_CG del where, para coincidir en valores con el array
        unset($where[2]);
        // Reindexar los arreglos para corregir el orden númerico.
        $array = array_values($array);
        $where = array_values($where);
    }

    if($idTP != "0") {
        $array[] = $idTP;
        $where[] = "id_TP";
    }

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => $value,
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'group'     => 'idUG',
        'order'     => ['ASC'=>'Name_Gastos'],
        'data'      => $array
    ]);
}
function dates_ConsultBuys($array,$idTP) {
    
    $innerjoin = [
        "{$this->bd_fzas}insumos_udn"   => 'idUI = id_UI',
        "{$this->bd_fzas}insumos_clase" => 'idIC = id_IC',
    ];

    $where     = [
        "Gasto IS NOT NULL",
        "id_CG",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras BETWEEN ? AND ?",
    ];

    if($array[0] == '5'){
        // Eliminar el idCG = 5 porque no existe en la BD
        unset($array[0]);
        // Eliminar Id_CG del where, para coincidir en valores con el array
        unset($where[1]);
        // Reindexar los arreglos para corregir el orden númerico.
        $array = array_values($array);
        $where = array_values($where);
    }

    if($idTP != "0") {
        $array[] = $idTP;
        $where[] = "id_TP";
    }

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'Fecha_Compras AS fecha',
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'group'     => 'Fecha_Compras',
        'order'     => ['ASC'=>'Fecha_Compras'],
        'data'      => $array
    ]);
}
function insumosDia($array,$cuenta,$idTP) {

    $where = [
        "id_UDN IS NOT NULL",
        "id_CG",
        $cuenta,
        "Fecha_Compras"
    ];

    if($array[0] == '5'){
        // Eliminar el idCG = 5 porque no existe en la BD
        unset($array[0]);
        // Eliminar Id_CG del where, para coincidir en valores con el array
        unset($where[1]);
        // Reindexar los arreglos para corregir el orden númerico.
        $array = array_values($array);
        $where = array_values($where);
    }

    if($idTP != "0") {
        $array[] = $idTP;
        $where[] = "id_TP";
    }

    return $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(IFNULL(Gasto,0)) AS subtotal,SUM(IFNULL(GastoIVA,0)) AS impuesto',
        'where'  => $where,
        'data'   => $array
    ])[0];
}
function insumosUDN($array,$idTP) {
    $where = ['id_CG','id_UDN','Fecha_Compras'];

    if($array[0] == '5'){
        // Eliminar el idCG = 5 porque no existe en la BD
        unset($array[0]);
        // Eliminar Id_CG del where, para coincidir en valores con el array
        unset($where[0]);
        // Reindexar los arreglos para corregir el orden númerico.
        $array = array_values($array);
        $where = array_values($where);
    }

    if($idTP != "0") {
        $array[] = $idTP;
        $where[] = "id_TP";
    }

    return $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(IFNULL(Gasto,0)) AS subtotal,SUM(IFNULL(GastoIVA,0)) AS impuesto',
        'where'  => $where,
        'data'   => $array
    ])[0];
}
function lsDetails($array){
    return $this->_Select([
        'table'    => "{$this->bd_fzas}compras",
        'values'   => 'idCompras AS folio,Gasto AS subtotal,GastoIVA AS impuesto,UPPER(Name_Gastos) AS insumo,Observacion AS obs',
        'leftjoin' => ["{$this->bd_fzas}gastos_udn" => "id_UG = idUG", "{$this->bd_fzas}gastos" => "id_Gastos = idGastos"],
        'where'    => "{$this->bd_fzas}compras.id_UI,id_CG,Fecha_Compras",
        'data'     => $array
    ]);
}
function insumoClasexid($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}insumos_clase",
        'values'    => 'Name_IC',
        'innerjoin' => ["{$this->bd_fzas}insumos_udn"=>'idIC = id_IC'],
        'where'     => 'idUI',
        'data'      => $array
    ])[0]['Name_IC'];
}
}
?>