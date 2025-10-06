<?php
require_once('mdl-contabilidad.php');
class MProveedores extends MContabilidad {
function lsProveedores($array) {
    $where  = count($array) == 1 ? 'Stado = 1,id_UDN': 'id_UDN';
    return $this->_Select([
        'table'     => "{$this->bd_fzas}proveedor",
        'values'    => 'idUP AS id,Name_Proveedor AS valor',
        'innerjoin' => ["{$this->bd_fzas}proveedor_udn"=>'idProveedor = id_Proveedor'],
        'where'     => $where,
        'order'     => ['ASC'=>'Name_Proveedor'],
        'data'      => $array
    ]);
}
function sum_paysSuppliers($array,$symbol = '') {
    $symbol = ($symbol !== '') ? $symbol.'?' : 'BETWEEN ? AND ?';
    
    $pay = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(IFNULL(Pago,0)) as subtotal, SUM(IFNULL(PagoIVA,0)) AS impuesto',
        'where'  => 'id_UDN IS NOT NULL,id_UP,Fecha_Compras '.$symbol,
        'data'   => $array
    ])[0];

    return floatval($pay['subtotal']) + floatval($pay['impuesto']);
}
function sum_buysSuppliers($array,$symbol = '') {
    $symbol = ($symbol !== '') ? $symbol.'?' : 'BETWEEN ? AND ?';

    return $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(IFNULL(Gasto,0)) as subtotal, SUM(IFNULL(GastoIVA,0)) AS impuesto',
        'where'  => 'id_UDN IS NOT NULL,id_CG = 2,id_UP,Fecha_Compras '.$symbol,
        'data'   => $array
    ])[0];
}
function count_paysSuppliers($array,$symbol = '') {
    $symbol = ($symbol != '') ? $symbol.'?' : 'BETWEEN ? AND ?';
    
    return $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'COUNT(idCompras) AS cant',
        'where'  => 'id_UDN IS NOT NULL,Pago IS NOT NULL,id_UP,Fecha_Compras '.$symbol,
        'data'   => $array
    ])[0]['cant'];
}
function count_buysSuppliers($array,$symbol = '') {
    $symbol = ($symbol != '') ? $symbol.'?' : 'BETWEEN ? AND ?';

    return $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'COUNT(idCompras) AS cant',
        'where'  => 'id_UDN IS NOT NULL,id_CG = 2,id_UP,Fecha_Compras '.$symbol,
        'data'   => $array
    ])[0]['cant'];
}
function payUDNSuppliers($array,$symbol = '') {
    $symbol = ($symbol != '' ) ? $symbol.'?' : 'BETWEEN ? AND ?';

    $cant = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(IFNULL(Pago,0)) as subtotal,SUM(IFNULL(PagoIVA,0)) AS impuesto',
        'where'  => 'id_UP IS NOT NULL,id_UDN,Fecha_Compras '.$symbol,
        'data'   => $array
    ])[0];

    return floatval($cant['subtotal']) + floatval($cant['impuesto']);
}
function buysUDNSuppliers($array,$symbol = '') {
    $symbol = ($symbol !== '' ) ? $symbol.'?' : 'BETWEEN ? AND ?';

    $cant = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(IFNULL(Gasto,0)) as subtotal,SUM(IFNULL(GastoIVA,0)) AS impuesto',
        'where'  => 'id_UP IS NOT NULL,id_CG = 2,id_UDN,Fecha_Compras '.$symbol,
        'data'   => $array
    ])[0];

    return floatval($cant['subtotal']) + floatval($cant['impuesto']);
}
function day_paySuppliers($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'idCompras AS id,Pago AS pago,id_CG,Name_CG AS clase',
        'innerjoin' => ["{$this->bd_fzas}gasto_clase" => 'idCG = id_CG'],
        'where'     => 'id_UDN IS NOT NULL,Pago IS NOT NULL,id_UP,Fecha_Compras',
        'data'      => $array
    ]);
}
function day_buySuppliers($array) {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'idCompras AS id,Gasto AS subtotal,GastoIVA AS impuesto, Observacion AS obs',
        'where'  => 'id_UDN IS NOT NULL,id_CG = 2,id_UP,Fecha_Compras',
        'data'   => $array
    ]);
}
function consultDatesSuppliers($array) {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => "Fecha_Compras AS fecha",
        'where'  => 'id_UP IS NOT NULL,id_UDN,Fecha_Compras BETWEEN ? AND ?,(Pago IS NOT NULL OR ( Gasto IS NOT NULL AND id_CG = 2 )) ',
        'group'  => 'Fecha_Compras',
        'order'  => ['ASC'=>'Fecha_Compras'],
        'data'   => $array
    ]);
}
function countMovetSuppliers($array) {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => "count(idCompras) AS cant",
        'where'  => 'id_UP,Fecha_Compras,(Pago IS NOT NULL OR ( Gasto IS NOT NULL AND id_CG = 2 )) ',
        'data'   => $array
    ])[0]['cant'];
}
function editMovSuppliers($array) {
    return $this->_Update([
        'table'  => "{$this->bd_fzas}compras",
        'values' => $array['values'],
        'where'  => $array['where'],
        'data'   => $array['data']
    ]);
}
function deleteMovSuppliers($array) {
    return $this->_Delete([
        'table'  => "{$this->bd_fzas}compras",
        'where'  => 'idCompras',
        'data'   => $array
    ]);
}
}
?>