<?php
require_once('mdl-contabilidad.php');
class MIngresos extends MContabilidad {
    // VENTAS
function lsVentas($array) {
    return $this->_Select([
        "table"     => "{$this->bd_fzas}ventas_udn",
        "values"    => "idUV,Name_Venta",
        "innerjoin" => ["{$this->bd_fzas}ventas" => 'id_Venta = idVenta'],
        "where"     => "Stado = 1,id_UDN",
        "data"      => $array
    ]);
}
function ventasDia($array) {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}venta_bitacora",
        'values' => 'Cantidad',
        'where'  => 'id_UV,Fecha_Venta',
        'data'   => $array
    ])[0]['Cantidad'];
}
    // DESCUENTOS
function lsDescuentos($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}descuentos_udn",
        'values'    => "idUD,Name_Descuentos",
        'innerjoin' => ["{$this->bd_fzas}descuentos"=>'id_Descuentos = idDescuentos'],
        'where'     => "Stado=1,id_UDN",
        'order'     => ['ASC' => 'Name_Descuentos'],
        'data'      => $array
    ]);
}
function descuentosDia($array) {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}descuentos_bitacora",
        'values' => 'Cantidad',
        'where'  => 'id_UD,Fecha_Desc',
        'data'   => $array
    ])[0]['Cantidad'];
}
    // IMPUESTOS
function lsImpuestos($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}impuestos_udn",
        'values'    => 'idUI,Porcentaje',
        'innerjoin' => ["{$this->bd_fzas}impuestos"=>'id_Impuesto = idImpuesto'],
        'where'     => 'Stado = 1,id_UDN',
        "order"     => ['ASC' => 'Porcentaje'],
        'data'      => $array
    ]);
}
function impuestosDia($array) {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}impuestos_bitacora",
        'values' => 'Cantidad',
        'where'  => 'id_UI,Fecha_Impuesto',
        'data'   => $array
    ])[0]['Cantidad'];
}
    // EFECTIVO
function lsEfectivo() {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}efectivo",
        'values' => 'idEfectivo AS id,Name_Efectivo AS valor'
    ]);
}
function valorEfectivoDia($array) {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}efectivo_bitacora",
        'values' => 'Cantidad',
        'where'  => 'id_Efectivo,id_UDN,Fecha_Efectivo',
        'data'   => $array
    ])[0]['Cantidad'];
}
    // MONEDAS
function lsMonedasExtranjeras() {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}moneda_extranjera",
        'values' => 'idMoneda AS id,Moneda AS valor,Abreviatura AS icon,Valor AS mxn',
        'where'  => 'Stado = 1'
    ]);
}
function valueMonedaDia($array) {
    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}moneda_extranjera_bitacora",
        'values' => 'IFNULL(Cantidad,0) AS Cantidad,Valor',
        'where'  => 'id_Moneda,id_UDN,Fecha_Moneda',
        'data'   => $array
    ])[0];
    return isset($valor) ? $valor : [];
}
function valorMonedaDia($array) {
    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}moneda_extranjera_bitacora",
        'values' => 'IFNULL((Cantidad*Valor),0) AS Cantidad',
        'where'  => 'id_Moneda,id_UDN,Fecha_Moneda',
        'data'   => $array
    ])[0]['Cantidad'];
    return isset($valor) ? $valor: '';
}
    // BANCOS
function lsBancos($array) {
    return $this->_Select([
        'table'     => "{$this->bd_fzas}bancos_udn",
        'values'    => 'idUB AS id,Name_Bancos AS valor',
        'innerjoin' => ["{$this->bd_fzas}bancos" => 'id_Bancos = idBancos'],
        'where'     => 'Stado,id_UDN',
        'data'      => $array
    ]);
}
function bancosDia($array) {
    return $this->_Select([
        'table'  => "{$this->bd_fzas}bancos_bitacora",
        'values' => 'Pago AS cantidad',
        'where'  => 'id_UB,Fecha_Banco',
        'data'   => $array
    ])[0]['cantidad'];
}
    // INFORMACION DE INGRESOS

    // ELIMINAR INFORMACION
    //Información de ventas
function eliminarVentas($array){
    return $this->_CUD("DELETE t1 FROM {$this->bd_fzas}venta_bitacora t1
                        INNER JOIN {$this->bd_fzas}ventas_udn t2 ON t2.idUV = t1.id_UV
                        WHERE id_UDN                                        = ? AND Fecha_Venta = ?",$array);
}
function insertVentas($array){
    $array['table'] = "{$this->bd_fzas}venta_bitacora";
    return $this->_Insert($array);
}
    //Información de descuentos
function eliminarDescuentos($array){
    return $this->_CUD("DELETE t1 FROM {$this->bd_fzas}descuentos_bitacora t1
                        JOIN  {$this->bd_fzas}descuentos_udn t2 ON t2.idUD = t1.id_UD
                        WHERE id_UDN                                       = ? AND Fecha_Desc = ?",$array);
}
function insertDescuentos($array){
    $array['table'] = "{$this->bd_fzas}descuentos_bitacora";
    return $this->_Insert($array);
}
    //Información de impuestos
function eliminarImpuestos($array){
    return $this->_CUD("DELETE t1 FROM {$this->bd_fzas}impuestos_bitacora t1
                        JOIN  {$this->bd_fzas}impuestos_udn t2 ON t2.idUI = t1.id_UI
                        WHERE id_UDN                                      = ? AND Fecha_Impuesto = ?",$array);
}
function insertImpuestos($array){
    $array['table'] = "{$this->bd_fzas}impuestos_bitacora";
    return $this->_Insert($array);
}
    //Información de efectivo
function eliminarEfectivo($array){
    return $this->_CUD("DELETE FROM {$this->bd_fzas}efectivo_bitacora WHERE id_UDN = ? AND Fecha_Efectivo = ?",$array);
}
function insertEfectivo($array){
    $array['table'] = "{$this->bd_fzas}efectivo_bitacora";
    return $this->_Insert($array);
}
    //Información de monedas
function existeMoneda($array){
    return $this->_Select([
        'table'  => "{$this->bd_fzas}moneda_extranjera_bitacora",
        'values' => 'idME,id_Moneda',
        'where'  => 'id_UDN,Fecha_Moneda',
        'data'   => $array
    ]);
}
function insertMoneda($array){
    $array['table'] = "{$this->bd_fzas}moneda_extranjera_bitacora";
    return $this->_Insert($array);
}
function existeMonedaByID($array){
    $array['table']  = "{$this->bd_fzas}moneda_extranjera_bitacora";
    $array['values'] = "idME AS id";
    return $this->_Select($array)[0]['id'];
}
function updateMoneda($array){
    $array['table'] = "{$this->bd_fzas}moneda_extranjera_bitacora";
    return $this->_Update($array);
}
function deleteMonedaByID($array){
    $array['table'] = "{$this->bd_fzas}moneda_extranjera_bitacora";
    return $this->_Delete($array);
}
    //Información de bancos
function eliminarBancos($array){
    return $this->_CUD("DELETE t1 FROM {$this->bd_fzas}bancos_bitacora t1
                        JOIN  {$this->bd_fzas}bancos_udn t2 ON t2.idUB = t1.id_UB
                        WHERE id_UDN                                   = ? AND Fecha_Banco = ?",$array);
}
function insertBancos($array){
    $array['table'] = "{$this->bd_fzas}bancos_bitacora";
    return $this->_Insert($array);
}

    // BITACORA INGRESOS
function bitacoraFzasIngresos($array){
    return $this->_Insert([
        'table'  => "{$this->bd_fzas}bitacora_finanzas",
        'values' => 'idE,idu,fecha,motivo',
        'data'   => $array
    ]);
}
}
?>