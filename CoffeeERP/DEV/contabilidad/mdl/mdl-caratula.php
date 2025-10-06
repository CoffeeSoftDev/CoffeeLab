<?php
require_once('mdl-contabilidad.php');
class MCaratula extends MContabilidad {
function totalVentas($array){
    $valor =  $this->_Select([
        'table'     => "{$this->bd_fzas}venta_bitacora",
        'values'    => 'SUM(Cantidad) AS Cantidad',
        'innerjoin' => ["{$this->bd_fzas}ventas_udn" => 'idUV = id_UV'],
        'where'     => 'id_UDN,Fecha_Venta BETWEEN ? AND ?',
        'data'      => $array
    ])[0]['Cantidad'];
    
    return isset($valor) ? $valor : 0;
}
function totalDescuentos($array){
    $valor =   $this->_Select([
        'table'     => "{$this->bd_fzas}descuentos_bitacora",
        'values'    => 'SUM(Cantidad) AS Cantidad',
        'innerjoin' => ["{$this->bd_fzas}descuentos_udn" => 'idUD = id_UD'],
        'where'     => 'id_UDN,Fecha_Desc BETWEEN ? AND ?',
        'data'      => $array
    ])[0]['Cantidad'];
    
    return isset($valor) ? $valor : 0;
}
function totalImpuestos($array){
    $valor =   $this->_Select([
        'table'     => "{$this->bd_fzas}impuestos_bitacora",
        'values'    => 'SUM(Cantidad) AS Cantidad',
        'innerjoin' => ["{$this->bd_fzas}impuestos_udn" => 'idUI = id_UI'],
        'where'     => 'id_UDN,Fecha_Impuesto BETWEEN ? AND ?',
        'data'      => $array
    ])[0]['Cantidad'];
    
    return isset($valor) ? $valor : 0;
}
// EFECTIVO
function lsEfectivo(){
    return $this->_Select([
        'table'  => "{$this->bd_fzas}efectivo",
        'values' => 'idEfectivo AS id,Name_Efectivo AS valor'
    ]);
}
function valorEfectivo($array){
    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}efectivo_bitacora",
        'values' => 'SUM(Cantidad) AS Cantidad',
        'where'  => 'id_Efectivo,id_UDN,Fecha_Efectivo BETWEEN ? AND ?',
        'data'   => $array
    ])[0]['Cantidad'];
    return isset($valor) ? $valor : 0;
}
//MONEDAS EXTRANJERAS
function lsMonedasExtranjeras(){
    return $this->_Select([
        'table' => "{$this->bd_fzas}moneda_extranjera",
        'values' => 'idMoneda AS id,Moneda AS valor,Abreviatura AS icon,Valor AS mxn',
        'where'  => 'Stado = 1'
    ]);
}
function valorMonedaExtranjera($array,$tipo = '') {
    $where = ($tipo == 'si') ? 'Fecha_Moneda >= ?, Fecha_Moneda < ?' : 'Fecha_Moneda BETWEEN ? AND ?';

    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}moneda_extranjera_bitacora",
        'values' => 'SUM(Cantidad) AS Cantidad, SUM(ROUND((Cantidad * Valor),2)) AS mxnCantidad',
        'where'  => 'id_Moneda,id_UDN,'.$where,
        'data'   => $array
    ])[0];
    return isset($valor) ? $valor : 0;
}
// BANCOS
function lsBancos($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}bancos_udn",
        'values'    => 'idUB AS id,Name_Bancos AS valor',
        'innerjoin' => ["{$this->bd_fzas}bancos" => 'id_Bancos = idBancos'],
        'where'     => 'Stado = 1,id_UDN',
        'data'      => $array
    ]);
}
function valorBancos($array){
    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}bancos_bitacora",
        'values' => 'SUM(Pago) AS Pago',
        'where'  => 'id_UB,Fecha_Banco',
        'data'   => $array
    ])[0]['Pago'];
    return isset($valor) ? $valor : 0;
}
function valorTotalBancos($array){
    $valor = $this->_Select([
        'table'     => "{$this->bd_fzas}bancos_bitacora",
        'values'    => 'SUM(Pago) AS Pago',
        'innerjoin' => ["{$this->bd_fzas}bancos_udn" => 'id_UB = idUB'],
        'where'     => 'id_UDN,Fecha_Banco BETWEEN ? AND ?',
        'data'      => $array
    ])[0]['Pago'];
    return isset($valor) ? $valor : 0;
}
function totalDeudaCredito($array){
    $valor1 = $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_consumo",
        'values'    => 'IFNULL(SUM(Cantidad),0) as Cantidad',
        'innerjoin' => ["{$this->bd_fzas}creditos_udn" => 'idUC = id_UC'],
        'where'     => 'id_UDN,Fecha_Consumo BETWEEN ? AND ?',
        'data'      => $array
    ])[0]['Cantidad'];

    $valor2 = $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_bitacora",
        'values'    => 'IFNULL(SUM(Consumo),0) as Cantidad',
        'innerjoin' => ["{$this->bd_fzas}creditos_udn" => 'idUC = id_UC'],
        'where'     => 'id_UDN,Fecha_Credito BETWEEN ? AND ?',
        'data'      => $array
    ])[0]['Cantidad'];

    return $valor1 + $valor2;
}
function totalPagoCredito($array){
    $valor = $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_bitacora",
        'values'    => 'ROUND(SUM(Pago),2) as Cantidad',
        'innerjoin' => ["{$this->bd_fzas}creditos_udn" => 'idUC = id_UC'],
        'where'     => 'id_UDN,Fecha_Credito BETWEEN ? AND ?',
        'data'      => $array
    ])[0]['Cantidad'];
    return isset($valor) ? $valor : 0;
}

/** CONSULTAS PARA LOS SALDOS */
// FONDO DE CAJA

function retiro_venta($array){
    return $this->_Select([
        'table'  => "{$this->bd_fzas}retiros",
        'values' => 'idRetiro AS id_retiro,ROUND(SF,2) AS saldo_final,Fecha_Rembolso AS fechaInicial',
        'where'  => 'id_UDN,Fecha_Rembolso < ?',
        'order'  => ['DESC' => 'id_retiro'],
        'limit'  => '1',
        'data'   => $array
    ]);
}
function sumatoria_gastos_fondo($array,$tipo){
    $where = ($tipo == 'si') ? 'Fecha_Compras >= ?, Fecha_Compras < ?' : 'Fecha_Compras BETWEEN ? AND ?';
    
    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'ROUND(SUM(IFNULL(Gasto,0))+SUM(IFNULL(GastoIVA,0)),2) AS cantidad',
        'where'  => 'id_CG = 3, id_UDN,'.$where,
        'data'   => $array
    ])[0]['cantidad'];
    
    return isset($valor) ? $valor : 0;
}
function sumatoria_anticipos($array,$tipo){
    $where = ($tipo == 'si') ? "DATE_FORMAT(Fecha_Anticipo, '%Y-%m-%d') >= ?,  DATE_FORMAT(Fecha_Anticipo, '%Y-%m-%d') < ?" : " DATE_FORMAT(Fecha_Anticipo, '%Y-%m-%d') BETWEEN ? AND ?";
    
    $valor = $this->_Select([
        'table'  => "{$this->bd_ch}anticipos",
        'values' => 'ROUND(SUM(Saldo),2) AS cantidad',
        'where'  => "id_UDN,".$where,
        'innerjoin' => ["{$this->bd_ch}empleados"=>'idEmpleado = Empleado_Anticipo'],
        'data'   => $array
    ])[0]['cantidad'];

    return isset($valor) ? $valor : 0;
}
function sumatoria_pago_proveedor($array,$tipo){
    $where = ($tipo == 'si') ? 'Fecha_Compras >= ?, Fecha_Compras < ?' : 'Fecha_Compras BETWEEN ? AND ?';
    
    $valor = $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'ROUND(SUM(Pago+PagoIVA),2) as cantidad',
        'where'     => 'id_UP IS NOT NULL, Status = 2, id_CG = 3,id_UDN,'.$where,
        'data'      => $array
    ])[0]['cantidad'];
    
    return isset($valor) ? $valor : 0;
}
function reembolso($array){
    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}retiros",
        'values' => 'SUM(Rembolso) AS cantidad',
        'where'  => 'Stado = 1, id_UDN,Fecha_Rembolso BETWEEN ? AND ?',
        'data'   => $array
    ])[0]['cantidad'];

    return isset($valor) ? $valor : 0;
}
function retiro($array){
    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}retiros_venta",
        'values' => 'Fecha_Retiro AS fechaRetiro,SF_Total AS sfTotal,SF_Efectivo AS sfEfectivo,idRetiroVenta AS idRetiro',
        'where'  => 'Stado = 1,id_UDN,Fecha_Retiro < ?',
        'order'  => ['DESC'=>'Fecha_Retiro'],
        'limit'  => 1,
        'data'   => $array
    ]);

    return isset($valor) ? $valor : 0;
}
function retiroEfectivo($array,$tipo = '') {
    $where = ($tipo == 'si') ? 'Fecha_Efectivo >= ?, Fecha_Efectivo < ?' : 'Fecha_Efectivo BETWEEN ? AND ?';

    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}efectivo_bitacora",
        'values' => 'ROUND(SUM(Cantidad),2) AS cantidad',
        'where'  => 'id_UDN,id_Efectivo,'.$where,
        'data'   => $array
    ])[0]['cantidad'];
    
    return isset($valor) ? $valor : 0;
}
function retiroVenta($array){
    $valor = $this->_Select([
                    'table'  => "{$this->bd_fzas}retiros_venta",
                    'values' => 'SUM(Retiro_Total) AS cantidad',
                    'where'  => 'Stado = 1,id_UDN,Fecha_Retiro BETWEEN ? AND ?',
                    'data'   => $array
                ])[0]['cantidad'];

  return isset($valor) ? $valor : 0;
}
function siProveedor($array,$tipo = ''){
    $gasto    = $this->sumaGastoProveedor($array,$tipo);
    $gastoIVA = $this->sumaGastoIVAProveedor($array,$tipo);
    $pago     = $this->sumaPagoProveedor($array,$tipo);
    $valor    = ($gasto + $gastoIVA) - $pago;
    return $valor;
}
function sumaGastoProveedor($array,$tipo = ''){
    $where = ($tipo == 'si') ? 'Fecha_Compras < ?' : 'Fecha_Compras BETWEEN ? AND ?';

    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(Gasto) AS cantidad',
        'where'  => 'id_UP IS NOT NULL,Gasto IS NOT NULL,id_CG = 2,id_UDN,'.$where,
        'data'   => $array
    ])[0]['cantidad']; 

    return isset($valor) ? $valor : 0;
}
function sumaGastoIVAProveedor($array,$tipo = ''){
    $where = ($tipo == 'si') ? 'Fecha_Compras < ?' : 'Fecha_Compras BETWEEN ? AND ?';

    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(GastoIVA) AS cantidad',
        'where'  => 'id_UP IS NOT NULL,GastoIVA IS NOT NULL,id_CG = 2,id_UDN,'.$where,
        'data'   => $array
    ])[0]['cantidad']; 

    return isset($valor) ? $valor : 0;
}
function sumaPagoProveedor($array,$tipo = ''){
    $where = ($tipo == 'si') ? 'Fecha_Compras < ?' : 'Fecha_Compras BETWEEN ? AND ?';

    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(Pago) AS cantidad',
        'where'  => 'id_UP IS NOT NULL,Pago IS NOT NULL,id_UDN,'.$where,
        'data'   => $array
    ])[0]['cantidad']; 

    return isset($valor) ? $valor : 0;
}
function sumaVentas($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}venta_bitacora",
        'values'    => 'idUV,Name_Venta,SUM(Cantidad) AS cantidad',
        'innerjoin' => ["{$this->bd_fzas}ventas_udn" => 'idUV = id_UV',"{$this->bd_fzas}ventas" => 'idVenta = id_Venta'],
        'where'     => 'Stado = 1,id_UDN,Fecha_Venta BETWEEN ? AND ?',
        'group'     => ['id_UV'],
        'order'     => ['ASC'=>'Name_Venta'],
        'data'      => $array
    ]);
}
function sumaDescuentos($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}descuentos_bitacora",
        'values'    => 'idUD,Name_Descuentos,SUM(Cantidad) AS cantidad',
        'innerjoin' => ["{$this->bd_fzas}descuentos_udn" => 'idUD = id_UD',"{$this->bd_fzas}descuentos" => 'idDescuentos = id_Descuentos'],
        'where'     => 'Stado = 1,id_UDN,Fecha_Desc BETWEEN ? AND ?',
        'group'     => ['id_UD'],
        'order'     => ['ASC'=>'Name_Descuentos'],
        'data'      => $array
    ]);
}
function sumaImpuestos($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}impuestos_bitacora",
        'values'    => 'idUI,Porcentaje,SUM(Cantidad) AS cantidad',
        'innerjoin' => ["{$this->bd_fzas}impuestos_udn" => 'idUI = id_UI',"{$this->bd_fzas}impuestos" => 'idImpuesto = id_Impuesto'],
        'where'     => 'Stado = 1,id_UDN,Fecha_Impuesto BETWEEN ? AND ?',
        'group'     => ['id_UI'],
        'order'     => ['ASC'=>'Porcentaje'],
        'data'      => $array
    ]);
}
function sumaBancos($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}bancos_bitacora",
        'values'    => 'idUB,Name_Bancos,SUM(Pago) AS cantidad',
        'innerjoin' => ["{$this->bd_fzas}bancos_udn" => 'idUB = id_UB',"{$this->bd_fzas}bancos" => 'idBancos = id_Bancos'],
        'where'     => 'Stado = 1,id_UDN,Fecha_Banco BETWEEN ? AND ?',
        'group'     => ['id_UB'],
        'order'     => ['ASC'=>'Name_Bancos'],
        'data'      => $array
    ]);
}
function sumaAnticipos($array){
    return $this->_Select([
        'table'     => "{$this->bd_ch}anticipos",
        'values'    => 'Nombres,SUM(Saldo) AS cantidad',
        'innerjoin' => ["{$this->bd_ch}empleados" => 'idEmpleado = Empleado_Anticipo'],
        'where'     => "Estado = 1,id_UDN,DATE_FORMAT(Fecha_Anticipo,'%Y-%m-%d') BETWEEN ? AND ?",
        'group'     => ['idEmpleado'],
        'order'     => ['ASC'=>'Nombres'],
        'data'      => $array
    ]);
}
function sumaComprasFondo($array){
    $value = [
        'id_UI AS id',
        'Name_IC AS valor',
        'SUM( Gasto ) AS c1',
        'SUM( GastoIVA ) AS c2',
        '(SUM( Gasto ) + SUM( GastoIVA )) AS total'
    ];

    $innerJoin = [
        "{$this->bd_fzas}insumos_udn" => 'idUI = id_UI',
        "{$this->bd_fzas}insumos_clase" => 'idIC = id_IC',
    ];

    $where = [
        "id_CG = 3",
        "{$this->bd_fzas}compras.id_UDN",
        "Fecha_Compras BETWEEN ? AND ?",
    ];

    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => $value,
        'innerjoin' => $innerJoin,
        'where'     => $where,
        'group'     => ['idUI'],
        'order'     => ['ASC'=>'valor'],
        'data'      => $array
    ]);
}
function listAlmacen($idE,$date1,$date2) {
    $array = array($idE,$date1,$date2,$idE,$date1,$date2);
    $query = "SELECT
                    idUI,
                    Name_IC 
                FROM
                    {$this->bd_fzas}compras,
                    {$this->bd_fzas}insumos_clase,
                    {$this->bd_fzas}insumos_udn 
                WHERE
                    id_UI = idUI 
                    AND idIC = id_IC 
                    AND Name_IC LIKE '%Almacen%' 
                    AND {$this->bd_fzas}compras.id_UDN = ? 
                    AND Fecha_Compras BETWEEN ? 
                    AND ? UNION
                SELECT
                    idUI,
                    Name_IC 
                FROM
                    {$this->bd_fzas}compras,
                    {$this->bd_fzas}insumos_clase,
                    {$this->bd_fzas}insumos_udn 
                WHERE
                    Pago IS NOT NULL 
                    AND id_UI = idUI 
                    AND idIC = id_IC 
                    AND ( Name_IC LIKE '%Costo%' AND Name_IC NOT LIKE '%Indirectos%' ) 
                    AND {$this->bd_fzas}compras.id_UDN = ? 
                    AND Fecha_Compras BETWEEN ? 
                    AND ? 
                ORDER BY
                    Name_IC ASC";
    $sql = $this->_Read($query,$array);
    return $sql;
}
function listInsumosAlmacen($array){    
    $query = "SELECT
                idUG,
                Name_Gastos AS valor,
                SUM( Gasto ) AS c1,
                SUM( GastoIVA ) AS c2,
                SUM( Pago ) AS c3
            FROM
                {$this->bd_fzas}gastos_udn
                INNER JOIN {$this->bd_fzas}gastos ON id_Gastos = idGastos
                INNER JOIN {$this->bd_fzas}compras ON idUG = id_UG 
            WHERE
                {$this->bd_fzas}gastos_udn.id_UI = ? 
                AND Fecha_Compras BETWEEN ? 
                AND ? 
            GROUP BY
                {$this->bd_fzas}gastos.Name_Gastos";
      $sql = $this->_Read($query,$array);
      return $sql;
}
function subtotalAlmacen($array) {
  $query = "SELECT
                SUM( Gasto ) as cantidad
            FROM
                {$this->bd_fzas}compras,
                {$this->bd_fzas}insumos_clase,
                {$this->bd_fzas}insumos_udn 
            WHERE
                id_UI = idUI 
                AND idIC = id_IC 
                AND Gasto IS NOT NULL 
                AND Name_IC LIKE '%Almacen%' 
                AND {$this->bd_fzas}compras.id_UDN IS NOT NULL 
                AND id_UI = ? 
                AND Fecha_Compras BETWEEN ? 
                AND ?";
  $sql = $this->_Read($query,$array);
  foreach ($sql as $row);
  return isset($row['cantidad']) ? $row['cantidad'] : 0;
}
function impuestosAlmacen($array) {
  $query = "SELECT
                SUM( GastoIVA ) AS cantidad
            FROM
                {$this->bd_fzas}compras,
                {$this->bd_fzas}insumos_clase,
                {$this->bd_fzas}insumos_udn 
            WHERE
                id_UI = idUI 
                AND idIC = id_IC 
                AND Gasto IS NOT NULL 
                AND Name_IC LIKE '%Almacen%' 
                AND {$this->bd_fzas}compras.id_UDN IS NOT NULL 
                AND id_UI = ? 
                AND Fecha_Compras BETWEEN ? 
                AND ?";
  $sql = $this->_Read($query,$array);
  foreach ($sql as $row);
  return isset($row['cantidad']) ? $row['cantidad'] : 0;
}
function pagosAlmacen($array) {
  $query = "SELECT
                SUM( Pago ) AS cantidad
            FROM
                {$this->bd_fzas}compras,
                {$this->bd_fzas}insumos_clase,
                {$this->bd_fzas}insumos_udn 
            WHERE
                id_UI = idUI 
                AND idIC = id_IC 
                AND ( Name_IC LIKE '%Costo%' AND Name_IC NOT LIKE '%Indirectos%' ) 
                AND {$this->bd_fzas}compras.id_UDN IS NOT NULL 
                AND id_UI = ? 
                AND Fecha_Compras BETWEEN ? 
                AND ?";
  $sql = $this->_Read($query,$array);
  foreach ($sql as $row);
  return isset($row['cantidad']) ? $row['cantidad'] : 0;
}
function listCostos($array){
    $query = "SELECT
                idUI,
                Name_IC 
            FROM
                {$this->bd_fzas}compras,
                {$this->bd_fzas}insumos_udn,
                {$this->bd_fzas}insumos_clase
            WHERE
                id_UI = idUI 
                AND idIC = id_IC 
                AND ( Name_IC LIKE '%Costo%' AND Name_IC NOT LIKE '%Indirectos%' ) 
                AND {$this->bd_fzas}compras.id_UDN = ? 
                AND Stado = 1 
                AND Fecha_Compras BETWEEN ? 
                AND ? 
            GROUP BY
                idUI 
            ORDER BY
                Name_IC ASC";
    return $this->_Read($query,$array);
}
function subtotalCosto($array) {
    $query = "SELECT
                SUM( Gasto ) AS cantidad
            FROM
                {$this->bd_fzas}compras,
                {$this->bd_fzas}insumos_clase,
                {$this->bd_fzas}insumos_udn 
            WHERE
                id_UI = idUI 
                AND idIC = id_IC 
                AND Gasto IS NOT NULL 
                AND ( Name_IC LIKE '%Costo%' AND Name_IC NOT LIKE '%Indirectos%' ) 
                AND {$this->bd_fzas}compras.id_UDN IS NOT NULL 
                AND id_UI = ? 
                AND Fecha_Compras BETWEEN ? 
                AND ?";
    $sql = $this->_Read($query,$array);
    foreach ($sql as $row);
    return isset($row['cantidad']) ? $row['cantidad'] : 0;
}
function impuestosCosto($array) {
    $query = "SELECT
                SUM( GastoIVA ) AS cantidad
            FROM
                {$this->bd_fzas}compras,
                {$this->bd_fzas}insumos_clase,
                {$this->bd_fzas}insumos_udn 
            WHERE
                id_UI = idUI 
                AND idIC = id_IC 
                AND Gasto IS NOT NULL 
                AND ( Name_IC LIKE '%Costo%' AND Name_IC NOT LIKE '%Indirectos%' ) 
                AND {$this->bd_fzas}compras.id_UDN IS NOT NULL 
                AND id_UI = ? 
                AND Fecha_Compras BETWEEN ? 
                AND ?";
    $sql = $this->_Read($query,$array);
    foreach ($sql as $row);
    return isset($row['cantidad']) ? $row['cantidad'] : 0;
}
function listCreditos($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}creditos_consumo",
        'values'    => 'idUC,Name_Credito',
        'innerjoin' => ["{$this->bd_fzas}creditos_udn" => 'idUC = id_UC ',"{$this->bd_fzas}creditos"=>'id_Credito = idCredito '],
        'where'     => 'id_UDN',
        'group'     => 'Name_Credito',
        'order'     => ['ASC' => 'Name_Credito'],
        'data'      => $array
    ]);
}
function consumoCreditos($array,$tipo = '') {
    $where = ($tipo == 'si') ? 'Fecha_Consumo <= ?' : 'Fecha_Consumo BETWEEN ? AND ?'; 
    
    $valor1 = $this->_Select([
        'table'  => "{$this->bd_fzas}creditos_consumo",
        'values' => 'IFNULL(SUM(Cantidad),0) AS cantidad',
        'where'  => 'id_UC,'.$where,
        'data'   => $array
        ])[0]['cantidad'];
        
    $where = ($tipo == 'si') ? 'Fecha_Credito <= ?' : 'Fecha_Credito BETWEEN ? AND ?'; 
    $valor2 = $this->_Select([
        'table'  => "{$this->bd_fzas}creditos_bitacora",
        'values' => 'IFNULL(SUM(Consumo),0) AS cantidad',
        'where'  => 'id_UC,'.$where,
        'data'   => $array
    ])[0]['cantidad'];


    return $valor1 + $valor2;
}
function pagoCreditos($array,$tipo = '') {
    $where = ($tipo == 'si') ? 'Fecha_Credito <= ?' : 'Fecha_Credito BETWEEN ? AND ?'; 
    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}creditos_bitacora",
        'values' => 'SUM(Pago) AS cantidad',
        'where'  => 'id_UC,'.$where,
        'data'   => $array
    ])[0]['cantidad'];
    return isset($valor) ? $valor : 0;
}
function totalDeudaCreditos($array) {
    $consumo = $this->totalDeudaCredito($array);
    $pagos   = $this->totalPagoCredito($array);

    return ($consumo - $pagos);
}
function listProveedores($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}compras",
        'values'    => 'idUP,Name_Proveedor',
        'innerjoin' => ["{$this->bd_fzas}proveedor_udn" => 'idUP = id_UP',"{$this->bd_fzas}proveedor" => 'idProveedor = id_Proveedor'],
        'where'     => "id_UP IS NOT NULL,id_CG = 2,{$this->bd_fzas}compras.id_UDN",
        'group'     => 'idUP',
        'order'     => ['ASC' => 'Name_Proveedor'],
        'data'      => $array
    ]);
}
function sumaGastoProveedorEspecifico($array,$tipo = ''){
    $where = ($tipo == 'si') ? 'Fecha_Compras < ?' : 'Fecha_Compras BETWEEN ? AND ?';

    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(Gasto) AS cantidad',
        'where'  => 'id_UDN IS NOT NULL,id_CG = 2,id_UP,'.$where,
        'data'   => $array
    ])[0]['cantidad']; 

    return isset($valor) ? $valor : 0;
}
function sumaGastoIVAProveedorEspecifico($array,$tipo = ''){
    $where = ($tipo == 'si') ? 'Fecha_Compras < ?' : 'Fecha_Compras BETWEEN ? AND ?';

    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(GastoIVA) AS cantidad',
        'where'  => 'id_UDN IS NOT NULL,id_CG = 2,id_UP,'.$where,
        'data'   => $array
    ])[0]['cantidad']; 

    return isset($valor) ? $valor : 0;
}
function sumaPagoProveedorEspecifico($array,$tipo = ''){
    $where = ($tipo == 'si') ? 'Fecha_Compras < ?' : 'Fecha_Compras BETWEEN ? AND ?';

    $valor = $this->_Select([
        'table'  => "{$this->bd_fzas}compras",
        'values' => 'SUM(Pago) AS cantidad',
        'where'  => 'id_UDN IS NOT NULL,id_UP,'.$where,
        'data'   => $array
    ])[0]['cantidad']; 

    return isset($valor) ? $valor : 0;
}
function totalDeudaProveedor($array,$tipo = ''){    
    $subtotal  = $this->sumaGastoProveedorEspecifico($array,$tipo);
    $impuestos = $this->sumaGastoIVAProveedorEspecifico($array,$tipo);
    $pagos     = $this->sumaPagoProveedorEspecifico($array,$tipo);

    $total = $subtotal + $impuestos - $pagos;
    return $total;
}

// FUNCIONES ADICIONALES TAB_INGRESOS
function ventasDia($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}venta_bitacora",
        'values'    => 'Cantidad',
        'where'     => 'id_UV,Fecha_Venta',
        'data'      => $array
    ])[0]['Cantidad'];
}
function descuentosDia($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}descuentos_bitacora",
        'values'    => 'Cantidad',
        'where'     => 'id_UD,Fecha_Desc',
        'data'      => $array
    ])[0]['Cantidad'];
}
function impuestosDia($array){
    return $this->_Select([
        'table'  => "{$this->bd_fzas}impuestos_bitacora",
        'values' => 'Cantidad',
        'where'  => 'id_UI,Fecha_Impuesto',
        'data'   => $array
    ])[0]['Cantidad'];
}
function bancosDia($array){
    return $this->_Select([
        'table'  => "{$this->bd_fzas}bancos_bitacora",
        'values' => 'SUM(Pago) AS cantidad',
        'where'  => 'id_UB,Fecha_Banco BETWEEN ? AND ?',
        'data'   => $array
    ])[0]['cantidad'];
    
}

}
?>