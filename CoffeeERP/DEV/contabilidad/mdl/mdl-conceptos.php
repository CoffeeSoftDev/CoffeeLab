<?php
require_once('mdl-contabilidad.php');
class MConceptos extends MContabilidad {
// INGRESOS
function lsVentas($array) {
    return $this->_Select([
        "table"     => "{$this->bd_fzas}ventas_udn",
        "values"    => "idUV AS id,Name_Venta AS valor,Stado AS stado",
        "innerjoin" => ["{$this->bd_fzas}ventas" => 'id_Venta = idVenta'],
        "where"     => "id_UDN",
        "order"     => ['DESC' => 'Stado','ASC' => 'Name_Venta'],
        "data"      => $array
    ]);
}
// DESCUENTOS
function lsDescuentos($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}descuentos_udn",
        'values'    => "idUD AS id,Name_Descuentos AS valor,Stado AS stado",
        'innerjoin' => ["{$this->bd_fzas}descuentos"=>'id_Descuentos = idDescuentos'],
        'where'     => "id_UDN",
        'order'     => ['DESC' => 'Stado','ASC' => 'Name_Descuentos'],
        'data'      => $array
    ]);
}
// IMPUESTOS
function lsImpuestos($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}impuestos_udn",
        'values'    => 'idUI AS id,Porcentaje AS valor,Stado AS stado',
        'innerjoin' => ["{$this->bd_fzas}impuestos"=>'id_Impuesto = idImpuesto'],
        'where'     => 'id_UDN',
        "order"     => ['DESC' => 'Stado', 'ASC' => 'Porcentaje'],
        'data'      => $array
    ]);
}
// MONEDAS EXTRANJERAS
function lsMonedasExtranjeras() {
    return $this->_Select([
        'table' => "{$this->bd_fzas}moneda_extranjera",
        'values' => 'idMoneda AS id,Moneda AS valor,Abreviatura AS icon,Valor AS mxn,Stado AS stado',
    ]);
}
// BANCOS
function lsBancos($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}bancos_udn",
        'values'    => 'idUB AS id, Name_Bancos AS valor, Stado AS stado',
        'innerjoin' => ["{$this->bd_fzas}bancos" => 'id_Bancos = idBancos'],
        'where'     => 'id_UDN',
        "order"     => ['DESC' => 'Stado','ASC' => 'Name_Bancos'],
        'data'      => $array
    ]);
}
// CLIENTES
public function lsClientes($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos",
        'values'    => 'idUC AS id, Name_Credito AS valor,Stado AS stado',
        'innerjoin' => ["{$this->bd_fzas}creditos_udn" => 'idCredito = id_Credito '],
        'where'     => 'id_UDN',
        'order'     => ['DESC' => 'Stado','ASC' => 'Name_Credito'],
        'data'      => $array
    ]);
}
// PROVEEDORES
function lsProveedores($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}proveedor",
        'values'    => 'idUP AS id,Name_Proveedor AS valor,Stado AS stado',
        'innerjoin' => ["{$this->bd_fzas}proveedor_udn"=>'idProveedor = id_Proveedor'],
        'where'     => 'id_UDN',
        'order'     => ['DESC' => 'Stado','ASC'=>'Name_Proveedor'],
        'data'      => $array
    ]);
}
// CLASE DE INSUMO
function lsClaseInsumo($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}insumos_clase",
        'values'    => 'idUI AS id,UPPER(Name_IC) AS valor,Stado AS stado,descripcion AS nota',
        'innerjoin' => ["{$this->bd_fzas}insumos_udn" => 'idIC = id_IC'],
        'where'     => 'id_UDN',
        'order'     => ['DESC' => 'Stado', 'ASC' => 'valor'],
        'data'      => $array
    ]);
}
// INSUMOS
function lsInsumos($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}gastos",
        'values'    => "idUG AS id,UPPER(Name_Gastos) AS valor, {$this->bd_fzas}gastos_udn.Stado AS stado,id_UI AS idClase",
        'innerjoin' => ["{$this->bd_fzas}gastos_udn" => 'id_Gastos = idGastos'],
        'where'     => 'id_UI IS NOT NULL,id_UDN',
        'order'     => ['ASC' => 'idClase','DESC'=>'Stado'],
        'data'      => $array
    ]);
}
}
?>