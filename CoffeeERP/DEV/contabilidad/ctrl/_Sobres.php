<?php
date_default_timezone_set('America/Mexico_City');

require_once('../mdl/mdl-sobres.php');
require_once('../../conf/_Utileria.php');
class Sobres {
    // INSTANCIAS
    private $c;
    private $obj;
    private $util;

    public function __construct($conta) {
        $this->c = $conta;
        $this->obj = new MSobres();
        $this->util = new Utileria();
    }

function initComponent(){

    $udn = $this->listUDN();
    if(count($udn) > 1 ) $this->c->setVar('idE',$udn[0]['id']); 


    return [
        'udn'    => $udn,
        'saldos' => $this->saldoFondoFijo(),
        'ayer'   => $this->yesterday()
    ];    
}
function yesterday(){
    // Obtener la fecah de ayer
    $date       = new DateTime();
    $date->modify('-1 day');
    return $date->format('Y-m-d');
}
function listUDN(){
    $idE = $this->c->getVar('idE');
    
    $result = [];
    $sql = $this->obj->lsUDN();
    if ( $idE == 8 ) $result = $sql;
    else {
        foreach ($sql as $key => $value) 
            if($value['id'] == $idE) 
                $result[] = $value;
    }

    return $result;
}
function fechasPermitidas(){
    $idE    = $this->c->getVar('idE');
    $fecha  = $this->c->getVar('date1');
    $filtro = $this->c->getVar('filtro');
    
    $retiro    = $this->obj->exiteRetiroVenta([$idE,$fecha]);
    $reembolso = $this->obj->existe_Reembolso([$idE,$fecha]);

    $date       = new DateTime();
    $hoy        = $date->format('Y-m-d');
    $mesActual  = intval($date->format('m'));
    $horaActual = $date->format('H');
    // Obtener la fecha de ayer
    $ayer = $this->yesterday();
    // Consultar la hora del cierre del mes actual
    $horarioCierre = $this->obj->horarioApertura([$mesActual]);

    $apertura   = $this->obj->apertura([$idE,$fecha,$filtro]);
    $open       = ($fecha == $ayer && $horaActual < $horarioCierre) || (isset($apertura) || ($hoy === $fecha) );
    $closed     = ($fecha == $ayer && $horaActual < $horarioCierre) ? "; se cerrará a las {$horarioCierre}:00 hrs." : (isset($apertura) ? " por contabilidad." : ".");

    $result = [
        'retiro'    => $retiro,
        'reembolso' => $reembolso,
        'open'      => $open,
        'closed'    => $closed,
        'info' => [$fecha,$ayer,$horaActual,$horarioCierre,isset($apertura)],
    ];

    return $result;
}
function saldoFondoFijo(){
    $idE = $this->c->getVar('idE');
    
    $reembolso  = $this->obj->ultimoReembolso([$idE]);

    $result = [
        'saldo_inicial' => '-',
        'egreso'        => '-',
        'saldo_final'   => '-',
    ];

    // El saldo final de hoy es el saldo final de ayer.
    $sInicial = $reembolso['sFinal'] ?? 0;
    if ( isset($reembolso['fecha']) ) {
        $fecha       = $reembolso['fecha'];
        $gasto       = $this->obj->sumGastosFondo([$idE,$fecha]);
        $anticipos   = $this->obj->sumAnticipos([$idE,$fecha]);
        $proveedores = $this->obj->sumPagosProveedor([$idE,$fecha]);
        $egreso      = $gasto + $anticipos + $proveedores;
        $sFinal      = $sInicial - $egreso;
        
        $result      = [
            'saldo_inicial' => $this->util->format_number($sInicial),
            'egreso'        => $this->util->format_number($egreso),
            'saldo_final'   => $this->util->format_number($sFinal),
            'gasto'         => $this->util->format_number($gasto),
            'anticipos'     => $this->util->format_number($anticipos),
            'proveedores'   => $this->util->format_number($proveedores),
        ];
    }

    return $result;
}
}
?>