<?php
require_once('mdl-contabilidad.php');
class MApertura extends MContabilidad {
    function newApertura($array){
        return $this->_Insert([
            'table'  => "{$this->bd_fzas}apertura",
            'values' => $array['values'],
            'data'   => $array['data']
        ]);
    }
    function listAperturas(){
        $values = [
            "idApertura AS id",
            "{$this->bd_fzas}pestana.pestana AS tab",
            "{$this->bd_fzas}apertura.id_UDN AS idE",
            "{$this->bd_fzas}apertura.Pestana AS idT",
            "UDN AS udn",
            "Fecha AS date"
        ];

        $innerjoin = [
            "{$this->bd_fzas}pestana" => "{$this->bd_fzas}apertura.Pestana = idPestana",
            "udn"                     => "id_UDN = idUDN"
        ];

        return $this->_Select([
            'table'     => "{$this->bd_fzas}apertura",
            'values'    => $values,
            'innerjoin' => $innerjoin,
            'where'     => "{$this->bd_fzas}apertura.Stado = 1",
        ]);
    }
    function closeApertura($idE = '',$idT = '',$idA = ''){
        $where = ['Stado'];
        $array = [1];
        
        if($idA != '' && $idA != '0') {
            $where[] = 'idApertura';
            $array[] = $idA;
        } 
        else if ( $idT != '' && $idT != '0' ) {
            $where[] = 'Pestana';
            $where[] = 'id_UDN';
            $array[] = $idT;
            $array[] = $idE;
        }
        else if ( $idE != '' && $idE != '8' ) {
            $where[] = 'id_UDN';
            $array[] = $idE;
        }

        return $this->_Update([
            'table'  => "{$this->bd_fzas}apertura",
            'values' => "Stado = 0",
            'where'  => $where,
            'data'   => $array
        ]);
    }
    function tbHistorial($array){
        $values = [
            "Abreviatura AS udn",
            "{$this->bd_fzas}pestana.pestana",
            "Fecha AS fecha",
            "{$this->bd_fzas}apertura.apertura",
            "bloqueo",
            "Nombres AS colaborador",
            "observaciones AS motivo",
        ];

        $innerjoin = [
            "udn"                     => "{$this->bd_fzas}apertura.id_UDN = idUDN",
            "{$this->bd_fzas}pestana" => "{$this->bd_fzas}apertura.Pestana = idPestana",
        ];

        $leftjoin = [
            "usuarios"                 => "id_Usr = idUser",
            "{$this->bd_ch}empleados" => "usr_empleado = idEmpleado"
        ];

        return $this->_Select([
            'table'     => "{$this->bd_fzas}apertura",
            'values'    => $values,
            'innerjoin' => $innerjoin,
            'leftjoin'  => $leftjoin,
            'where'     => "{$this->bd_fzas}apertura.Stado  = 0 AND DATE_FORMAT({$this->bd_fzas}apertura.apertura,'%Y-%m-%d') BETWEEN ? AND ?",
            'data'      => $array
        ]);
    }
    function lsHours(){
        return $this->_Select([
            'table'     => "{$this->bd_fzas}apertura_mensual",
            'values'    => 'idAperturaMensual AS id,Horario AS hrs',
        ]);
    }
    function updateHrs($array){
        return $this->_Update([
            'table'  => "{$this->bd_fzas}apertura_mensual",
            'values' => 'Horario',
            'where'  => 'idAperturaMensual',
            'data'   => $array
        ]);
    }
}
?>