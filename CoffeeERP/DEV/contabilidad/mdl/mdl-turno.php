<?php
require_once('mdl-contabilidad.php');
class MTurno extends MContabilidad {
  // INIT
function lsTurnos(){
    return [
        ['id' => 'N', 'valor' => 'NOCHE'],
        ['id' => 'M', 'valor' => 'MAÑANA'],
        ['id' => 'V', 'valor' => 'TARDE']
    ];
}
function lsJefes(){
    return $this->_Select([
        'table'     => "{$this->bd_ch}empleados",
        'values'    => 'idEmpleado AS id,Nombres AS valor',
        'innerjoin' => ["rh_area_udn" => "idAreaUDN = Area_Empleado"],
        'where'     => "rh_area_udn.stado = 1, idAreaUDN = 14",
        'order'     => ['ASC'=>'Nombres']
    ]);
}
function lsVentas($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}ventas",
        'values'    => 'idUV AS id,Name_Venta AS valor',
        'innerjoin' => ["{$this->bd_fzas}ventas_udn" => 'idVenta = id_Venta'],
        'where'     => 'id_UDN,Stado = 1',
        'data'      => $array
    ]   );
}
function lsImpuestos($array){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}impuestos",
        'values'    => 'idUI AS id,Porcentaje AS valor',
        'innerjoin' => ["{$this->bd_fzas}impuestos_udn" => 'idImpuesto = id_Impuesto'],
        'where'     => 'id_UDN,Stado = 1',
        'order'     => ['DESC'=>'idUI'],
        'data'      => $array
    ]);
}
  // BITACORA
function lsBitacora($array){
    return $this->_Read("SELECT
                    idTurno AS id,
                    Nombres AS jefe,
                    turno,
                    suite,
                    ( SELECT SUM( cantidad ) FROM {$this->bd_fzas}turno_bitacora WHERE id_Turno = idTurno AND id_UV IS NOT NULL ) + ( SELECT SUM( cantidad ) FROM {$this->bd_fzas}turno_bitacora WHERE id_Turno = idTurno AND id_UI IS NOT NULL ) AS total
                    
                FROM
                    {$this->bd_fzas}turno
                    INNER JOIN rfwsmqex_gvsl_rrhh.empleados ON {$this->bd_fzas}turno.id_Employed = rfwsmqex_gvsl_rrhh.empleados.idEmpleado
                WHERE
                    {$this->bd_fzas}turno.fecha_turno = ?",$array);
}
function sumaCantidad($date,$id){
    $sql = $this->_Select([
        'table'     => "{$this->bd_fzas}turno_bitacora",
        'values'    => 'cantidad',
        'where'     => "fecha_turno, {$id} IS NOT NULL",
        'innerjoin' => ["{$this->bd_fzas}turno" => 'idTurno = id_Turno'],
        'data'      => [$date]
    ]);
    
            $result                   = 0;
    foreach ($sql as $value) $result += $value['cantidad'];
    
    return $result;
}
function deleteTurnByID($array){
    return $this->_Delete([
        'table' => "{$this->bd_fzas}turno",
        'where' => 'idTurno',
        'data'  => $array
    ]);
}
function idTurnByArray($array){
    $array['table']  = "{$this->bd_fzas}turno";
    $array['values'] = "idTurno AS id";
    return $this->_Select($array)[0]['id'];
}
function insertTurn($array){
    $array['table'] = "{$this->bd_fzas}turno";
    return $this->_Insert($array);
}
function maxTurn(){
    return $this->_Select([
        'table'  => "{$this->bd_fzas}turno",
        'values' => 'MAX(idTurno) AS id'
    ])[0]['id'];
}
function updateTurn(){
    $array['table'] = "{$this->bd_fzas}turno";
    return $this->_Update($array);
}
function insertBitacora($array){
    $array['table'] = "{$this->bd_fzas}turno_bitacora";
    return $this->_Insert($array);
}

  // INGRESOS DEL DIA
function ingresosByDate($date){
    return $this->_Select([
        'table'     => "{$this->bd_fzas}venta_bitacora",
        'values'    => 'idBV AS id',
        'innerjoin' => ["{$this->bd_fzas}ventas_udn"=>'idUV = idUV'],
        'where'     => 'id_UDN = 1,Fecha_Venta',
        'data'      => [$date]
    ]);
}
function deleteIngresos($date){
    $this->deleteSales($date);
    return $this->deleteTax($date);
}
function deleteSales($date){
    $this->_Read("DELETE t1 
                        FROM
                            {$this->bd_fzas}venta_bitacora AS t1
                            INNER JOIN {$this->bd_fzas}ventas_udn AS t2 ON t1.id_UV = t2.idUV
                        WHERE
                                t2.id_UDN      = 1
                            AND t1.Fecha_Venta = ?",[$date]);
}
function deleteTax($date){
    return $this->_Read("DELETE t1 
                        FROM
                        {$this->bd_fzas}impuestos_bitacora AS t1
                            INNER JOIN {$this->bd_fzas}impuestos_udn AS t2 ON t1.id_UI = t2.idUI
                        WHERE
                                t2.id_UDN         = 1
                            AND t1.Fecha_Impuesto = ?",[$date]);
}
function sumTotalTurnByDate($date){
    $sql = $this->_Select([
        'table'     => "{$this->bd_fzas}turno",
        'values'    => 'id_UI,id_UV,cantidad',
        'innerjoin' => ["{$this->bd_fzas}turno_bitacora"=>'id_Turno = idTurno'],
        'where'     => 'fecha_turno',
        'data'      => [$date]
    ]);

    $idUV = [];
    $idUI = [];

    foreach ($sql as $key => $value) {
        if (!empty($value['id_UV'])) {
            $id = $value['id_UV'];
            $cantidad = floatval($value['cantidad']);
            
            // Acumular cantidad sin redondear
            if (isset($idUV[$id])) {
                $idUV[$id]['cantidad'] += $cantidad;
            } else {
                // Crear una nueva entrada si no existe
                $idUV[$id] = [
                    'id_UV'       => $id,
                    'cantidad'    => $cantidad,   // No redondear aún
                    'Fecha_Venta' => $date
                ];
            }
        } elseif (!empty($value['id_UI'])) {
            $id = $value['id_UI'];
            $cantidad = floatval($value['cantidad']);
            
            // Acumular cantidad sin redondear
            if (isset($idUI[$id])) {
                $idUI[$id]['cantidad'] += $cantidad;
            } else {
                // Crear una nueva entrada si no existe
                $idUI[$id] = [
                    'id_UI'          => $id,
                    'cantidad'       => $cantidad,   // No redondear aún
                    'Fecha_Impuesto' => $date
                ];
            }
        }
    }

    // Redondear los valores acumulados al final
    foreach ($idUV as &$item) {
        $item['cantidad'] = round($item['cantidad'], 2);
    }

    foreach ($idUI as &$item) {
        $item['cantidad'] = round($item['cantidad'], 2);
    }

    // Convertir los arrays asociativos a arrays numéricos
    $idUV = array_values($idUV);
    $idUI = array_values($idUI);

    return [
        "ventas" => $idUV,
        "impuestos" => $idUI
    ];
}
function insertVenta($array){
    $array['table'] = "{$this->bd_fzas}venta_bitacora";
    return $this->_Insert($array);
}
function insertImpuesto($array){
    $array['table'] = "{$this->bd_fzas}impuestos_bitacora";
    return $this->_Insert($array);
}
}
?>