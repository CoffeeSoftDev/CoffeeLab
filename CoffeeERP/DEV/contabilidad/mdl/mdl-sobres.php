<?php
require_once('mdl-contabilidad.php');
class MSobres extends MContabilidad {
function lsUDN(){   
    return $this->_Select([
        'table'  => 'udn',
        'values' => 'idUDN AS id, UPPER(UDN) AS valor, Abreviatura AS alias',
        'where'  => 'Stado = 1,idUDN != 8',
        'order'  => ['ASC' => 'Antiguedad'],
    ]);
}
function horarioApertura($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}apertura_mensual",
        'values'    => 'Horario',
        'where'     => 'idAperturaMensual',
        'data'      => $array
    ])[0]['Horario'];
}
function apertura($array){
    return $this->_Select([
        'table'  => "{$this->bd_fzas}apertura",
        'values' => 'Fecha',
        'where'  => 'Stado = 1,id_UDN,Fecha,pestana',
        'order'  => ['DESC'=>'Fecha'],
        'limit'  => 1,
        'data'   => $array
    ])[0]['Fecha'];
}
// INFORMACIÓN DE REEMBOLSOS Y RETIROS
function ultimoReembolso($array){
    return $this->_Select([
        'table'  => "{$this->bd_fzas}retiros",
        'values' => 'idRetiro AS id,ROUND(SF,2) AS sFinal,Fecha_Rembolso AS fecha',
        'where'  => 'id_UDN',
        'order'  => ['DESC' => 'idRetiro'],
        'limit'  => '1',
        'data'   => $array
    ])[0];
}
function sumGastosFondo($array) {
    $where = [
        'id_CG = 3',
        'id_UDN',
        'Fecha_Compras BETWEEN ? AND NOW()'
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'ROUND(SUM(Gasto)+SUM(GastoIVA),2) AS cant',
        'where'     => $where,
        'data'      => $array
    ])[0]['cant'] ?? 0;
}
function sumAnticipos($array){
    $where = [
        "id_UDN",
        "DATE_FORMAT(Fecha_Anticipo, '%Y-%m-%d') BETWEEN ? AND NOW()"
    ];

    return $this->_Select([
        'table'     => "{$this->bd_ch}anticipos",
        'values'    => 'ROUND(SUM(Saldo),2) AS cant',
        'where'     => $where,
        'data'      => $array
    ])[0]['cant'] ?? 0;
}
function sumPagosProveedor($array){
    $where = [
        'id_UP IS NOT NULL',
        'id_CG = 3',
        'id_UDN',
        'Fecha_Compras BETWEEN ? AND NOW()'
    ];

    $sql =  $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'SUM(Pago) AS pagos,SUM(PagoIVA) as impuestos',
        'where'     => $where,
        'data'      => $array
    ])[0];

    return floatval($sql['pagos']) + floatval($sql['impuestos']);
}
function exiteRetiroVenta($array){
    $id = $this->_Select([
        'table'     => "{$this->bd_fzas}retiros_venta",
        'values'    => 'idRetiroVenta as id',
        'where'     => 'Stado = 1,id_UDN,Fecha_Retiro > ?',
        'data'      => $array
    ])[0]['id'];
    
    return isset($id) ?? false;
}
function existe_Reembolso($array){
    $id = $this->_Select([
        'table'     => "{$this->bd_fzas}retiros",
        'values'    => 'idRetiro AS id',
        'where'     => 'Stado = 1,id_UDN,Fecha_Rembolso > ?',
        'data'      => $array
    ])[0]['id'];
    
    return isset($id) ?? false;
}
}
?>