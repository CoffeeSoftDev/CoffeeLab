<?php
require_once('mdl-contabilidad.php');
class MArchivos extends MContabilidad {
    function lsFilesTesoreria($array){
        return $this->_Select([
            'table'  => "{$this->bd_fzas}sobres",
            'values' => 'idSobre AS id,titulo,Ruta AS ruta,Archivo AS archivo,Fecha AS fecha',
            'where'  => "(id_Area IS NULL OR id_Area = ?),UDN_Sobre,Fecha BETWEEN ? AND ?",
            'order'  => ['DESC'=>'Fecha'],
            'data'   => $array
        ]);
    }
    function lsFilesSales($array){
        return $this->_Select([
            'table'  => "{$this->bd_fzas}sobres",
            'values' => 'idSobre AS id,titulo,Ruta AS ruta,Archivo AS archivo,Fecha AS fecha',
            'where'  => "clasificacion,UDN_Sobre,Fecha BETWEEN ? AND ?",
            'order'  => ['DESC'=>'Fecha'],
            'data'   => $array
        ]);
    }
    function lsFilesPayBuy($array){
        $values = [
            'titulo',
            'Ruta AS ruta',
            'Archivo AS archivo',
            'Fecha AS fecha',
            'UPPER(Name_IC) AS insumo',
            'UPPER(Name_Gastos) AS gasto',
            'UPPER(Name_Proveedor) AS proveedor',
            'Gasto AS subtotal',
            'GastoIVA AS impuesto',
            'Pago AS pago',
        ];
    
        $leftjoin = [
            "{$this->bd_fzas}compras"       => "id_Compras = idCompras",
            "{$this->bd_fzas}insumos_udn"   => "{$this->bd_fzas}compras.id_UI = idUI",
            "{$this->bd_fzas}insumos_clase" => "id_IC = idIC",
            "{$this->bd_fzas}gastos_udn"    => "id_UG = idUG  AND idUI = {$this->bd_fzas}gastos_udn.id_UI",
            "{$this->bd_fzas}gastos"        => "id_Gastos = idGastos",
            "{$this->bd_fzas}proveedor_udn" => "id_UP = idUP",
            "{$this->bd_fzas}proveedor"     => "id_Proveedor = idProveedor ",
        ];
    
        $where = [
            "{$this->bd_fzas}compras.id_UDN IS NOT NULL",
            'clasificacion',
            'UDN_Sobre',
            'Fecha BETWEEN ? AND ?'
        ];
    
        return $this->_Select([
            'table'  => "{$this->bd_fzas}sobres",
            'values' => $values,
            'leftjoin' => $leftjoin,
            'where'  => $where,
            'order'  => ['DESC'=>'Fecha'],
            'data'   => $array
        ]);
    }
}
?>