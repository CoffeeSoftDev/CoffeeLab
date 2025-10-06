<?php
require_once('mdl-contabilidad.php');
class MClientes extends MContabilidad{
public function lsClientes($array){
    $value = [
        'idUC AS id', 
        'Name_Credito AS valor'
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos",
        'values'    => $value,
        'innerjoin' => ["{$this->bd_fzas}creditos_udn" => 'idCredito = id_Credito '],
        'where'     => 'Stado = 1,id_UDN',
        'order'     => ['ASC'=>'Name_Credito'],
        'data'      => $array
    ]);
}
function debtUDN($array,$symbol = ''){
    $symbol .= $symbol != '' ? ' ?' : ' BETWEEN ? AND ? ';
    
    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_consumo",
        'values'    => 'IFNULL(SUM(Cantidad),0) AS cantidad',
        'innerjoin' => ["{$this->bd_fzas}creditos_udn"=>'id_UC = idUC'],
        'where'     => "{$this->bd_fzas}creditos_udn.Stado = 1, id_UDN, Fecha_Consumo ".$symbol,
        'data'      => $array
    ])[0]['cantidad'];
}
function payUDN($array,$symbol = ''){
    $symbol .= ($symbol != '') ? ' ?' : ' BETWEEN ? AND ? ';
    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_bitacora",
        'values'    => 'IFNULL(SUM(Pago),0) AS pago, IFNULL(SUM(Consumo),0) AS consumo',
        'innerjoin' => ["{$this->bd_fzas}creditos_udn" => 'id_UC = idUC'],
        'where'     => "Stado = 1, id_UDN, Fecha_Credito ".$symbol,
        'data'      => $array
    ])[0];
}
function deudaCliente($array,$symbol = ''){
    $symbol .= ($symbol != '') ? ' ?' : ' BETWEEN ? AND ? ';

    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_consumo",
        'values'    => 'IFNULL(SUM(Cantidad),0) AS cantidad',
        'where'     => 'id_UC,Fecha_Consumo '.$symbol,
        'data'      => $array
    ])[0]['cantidad'];
}
function pagosCliente($array,$symbol = '') {
    $symbol .= ($symbol != '') ? ' ?' : ' BETWEEN ? AND ? ';

    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_bitacora",
        'values'    => 'IFNULL(SUM(Pago),0) AS pagos, IFNULL(SUM(Consumo),0) as consumos',
        'where'     => 'id_UC,Fecha_Credito '.$symbol,
        'data'      => $array
    ])[0];
}
function countTransaction($array,$table){
    $values = ($table == 'bitacora') ? 'idBC' : 'idCC';
    $where = ($table == 'bitacora') ? 'Fecha_Credito' : 'Fecha_Consumo';

    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_{$table}",
        'values'    => "COUNT({$values}) AS cant", 
        'where'     => "id_UC,{$where} BETWEEN ? AND ?",
        'data'      => $array
    ])[0]['cant'];
}
function newConsumo($array){
    return $this->_Insert([
        'table'  => "{$this->bd_fzas}creditos_consumo",
        'values' => "id_UC,Cantidad,Fecha_Consumo",
        'data'   => $array
    ]);
}
function newTransaction($array){
    return $this->_Insert([
        'table'  => "{$this->bd_fzas}creditos_bitacora",
        'values' => $array['values'],
        'data'   => $array['data']
    ]);
}
function payDay($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_bitacora",
        'values'    => 'idBC,Consumo,Pago,id_TP,Fecha_Credito AS fecha',
        'where'     => 'id_UC,Fecha_Credito BETWEEN ? AND ?',
        'data'      => $array
    ]);
}
function debtDay($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_consumo",
        'values'    => 'idCC,Cantidad,Fecha_Consumo as fecha',
        'where'     => 'id_UC,Fecha_Consumo BETWEEN ? AND ?',
        'data'      => $array
    ]);
}
function editMovCustomer($array,$table){
    return $this->_Update([
        'table'  => "{$this->bd_fzas}creditos_{$table}",
        'values' => $array['values'],
        'where'  => $array['where'],
        'data'   => $array['data']
    ]);
}
function deleteMovCustomer($array,$table){
    $where = ($table != 'bitacora') ? 'idCC' : 'idBC';

    $table = 'creditos_'.$table;

    return $this->_Delete([
        'table'  => "{$this->bd_fzas}{$table}",
        'where'  => $where,
        'data'   => $array
    ]);
}
function consultDatesCustomers($array){
    $date1 = $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_consumo",
        'values'    => 'Fecha_Consumo AS fecha',
        'innerjoin' => ["{$this->bd_fzas}creditos_udn" => "idUC = id_UC"],
        "where"     => 'id_UDN,Fecha_Consumo BETWEEN ? AND ?',
        "group"     => 'fecha',
        "order"     => ['ASC','fecha'],
        "data"      => $array
    ]) ?? [];

    $date2 = $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_bitacora",
        'values'    => 'Fecha_Credito as fecha',
        'innerjoin' => ["{$this->bd_fzas}creditos_udn"=>'idUC = id_UC'],
        'where'     => 'id_UDN,Fecha_Credito BETWEEN ? AND ?',
        'group'     => 'fecha',
        'order'     => ['ASC'=>'fecha'],
        'data'      => $array
    ]) ?? [];

    $dates = array_merge($date1,$date2);
    $fechas = array_map("unserialize", array_unique(array_map("serialize", $dates)));
    sort($fechas);
    return $fechas;
}
}
?>