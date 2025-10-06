<?php
date_default_timezone_set('America/Mexico_City');
setlocale(LC_TIME, 'es_ES.UTF-8');
require_once('../mdl/mdl-pagos.php');
require_once('../../conf/_Utileria.php');
class Pagos {
    private $c;//conta
    private $obj;
    private $util;

    public function __construct($conta) {
        $this->c = $conta;
        $this->obj = new MPagos();
        $this->util = new Utileria();
    }
private function filtroTipoPago() {
    $filtro = $this->c->getVar('filtro');
    switch ($filtro) {
        case '1': return ",Name_IC LIKE '%costo%', Name_IC NOT LIKE '%indirecto%'"; break;
        case '2': return ",id_UP IS NOT NULL"; break;
        default: return ""; break;
    }
}
public function initPagos() {
    $idE   = $this->c->getVar('idE');
    return [
        'proveedores' => $this->obj->lsProveedores([$idE]),
        'almacenes'   => $this->obj->lsCostosxAlmacen([$idE])
    ];
}
public function tbPagos() {
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $campo = $this->filtroTipoPago();
    return $this->obj->listPagos([$idE,$date1],$campo);
}
public function newPay() {
    $idCompras = $this->obj->insPay($this->util->sql($_POST));
    
    if ( $idCompras != null && $_FILES['comprobante']['name'] != '' ) 
        return $this->newFile($idCompras);
    else 
        return true;
}
private function newFile($idCompras){
    $year  = date('Y');
    $month = date('m');
    $time  = date('H:m:s');
    $date  = new DateTime(date('Y-m-d'));
    $mes   = strftime('%B', $date->getTimestamp());
    $idE   = $_POST['id_UDN'];
    $udn   = $this->obj->onlyUDN([$idE])['Abreviatura'];

    $destino = "erp_files/finanzas/{$year}/{$month}.-{$mes}/".$udn.'/pagos/';
    
    $extension = end(explode('.',$_FILES['comprobante']['name']));
    $newName   = $udn.'_'.date('d-m-Y').'_'.date('H.m.s');

    $array = [
        'UDN_Sobre'     => $idE,
        'Fecha'         => $_POST['Fecha_Compras'],
        'Ruta'          => $destino,
        'Hora'          => $time,
        'Archivo'       => $newName.'.'.$extension,
        'Type_File'     => $extension,
        'Peso'          => ROUND(($_FILES['comprobante']['size']/1024),4),
        'id_Area'       => 16,
        'clasificacion' => 'PAG',
        'id_Compras'    => $idCompras,
        'titulo'        => $_FILES['comprobante']['name'],
    ];

    $exito = $this->obj->_Insert($this->util->sql($array),$this->obj->getFzas().'sobres');
    if($exito == true) return $this->util->upload_file($_FILES['comprobante'],'../../../'.$destino,$newName);
}
public function editPay() {
    return $this->obj->editPay($this->util->sql($_POST,1));
}
public function deletePay() {
    return $this->obj->deletePay([$_POST['folio']]);
} 
// DATOS CONSULTAS
public function balanceStorage() {
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $entrada = floatval($this->obj->sum_incomeUDNStorage([$idE,$date1],'<'));
    $salida  = floatval($this->obj->sum_egressUDNStorage([$idE,$date1],'<'));
    $initial = $entrada - $salida;

    $income  = floatval($this->obj->sum_incomeUDNStorage([$idE,$date1,$date2]));
    $egress  = floatval($this->obj->sum_egressUDNStorage([$idE,$date1,$date2]));
    $final   = $initial + $income - $egress;

    return [
        'initial' => $this->util->format_number($initial),
        'income'  => $this->util->format_number($income),
        'egress'  => $this->util->format_number($egress),
        'final'   => $this->util->format_number($final),
    ];
}
public function tbStorage(){
    $idE    = $this->c->getVar('idE');
    $date1  = $this->c->getVar('date1');
    $date2  = $this->c->getVar('date2');
    $result = [];
    $thead  = [];
    $list   = [];
    $dates  = $this->obj->datesStorage($idE,$date1,$date2);
    foreach ($dates as $value) {
        $fecha            = $value['fecha'];
        $date             = new DateTime($fecha);
        $thead[]          = strftime('%A<br>%d %B',$date->getTimestamp());
        $list['income'][] = $this->obj->sum_incomeUDNStorage([$idE,$fecha],'=');
        $list['egress'][] = $this->obj->sum_egressUDNStorage([$idE,$fecha],'=');
    }

    return [
        'thDates' => $thead,
        'list'    => $list,
        'storage' => $this->lsAlmacen($idE,$date1,$date2,$dates)
    ];
}
public function lsAlmacen($idE,$date1,$date2,$dates){
    $result = [];
    $sql = $this->obj->lsAlmacen([$idE]);
    foreach ($sql as  $value) {
        $idUG = $value['id'];
        $name = $value['valor'];
        
        $income = $this->obj->entradaUG([$idUG,$date1],'<');
        $egress = $this->obj->salidaUG([$idE,$date1],$name,'<');
        $initial = $income - $egress;

        $income = $this->obj->entradaUG([$idUG,$date1,$date2]);
        $egress = $this->obj->salidaUG([$idE,$date1,$date2],$name);
        $final = $initial + $income - $egress;

        $rowData = [];
        foreach ($dates as $value) {
            $fecha   = $value['fecha'];
            $incomeUG  = $this->obj->entradaUG([$idUG,$fecha],'<');
            $egressUG  = $this->obj->salidaUG([$idE,$fecha],$name,'<');
            $initialUG = $incomeUG - $egressUG;

            $incomeUG = $this->obj->entradaUG([$idUG,$fecha],'=');
            $egressUG = $this->obj->salidaUG([$idE,$fecha],$name,'=');
            $finalUG  = $initialUG + $incomeUG - $egressUG;

            $rowData[] = [
                'initial' => $this->util->format_number($initialUG),
                'income'  => $this->util->format_number($incomeUG),
                'egress'  => $this->util->format_number($egressUG),
                'final'   => $this->util->format_number($finalUG)
            ];
        }


        $result[] = [
            'id'      => $idUG,
            'name'    => $name,
            'initial' => $this->util->format_number($initial),
            'income'  => $this->util->format_number($income),
            'egress'  => $this->util->format_number($egress),
            'final'   => $this->util->format_number($final),
            'data'    => $rowData
        ];
    }

    return $result;
}
public function tbStorageFZ(){
    $idE    = $this->c->getVar('idE');
    $date1  = $this->c->getVar('date1');
    $date2  = $this->c->getVar('date2');

    $thead = [];
    $list  = [];
    $dates = $this->obj->datesStorage($idE,$date1,$date2);
    foreach ($dates as $value) {
        $fecha            = $value['fecha'];
        $date             = new DateTime($fecha);
        $thead[]          = strftime('%A<br>%d %B',$date->getTimestamp());
        $list['income'][] = $this->obj->sum_incomeUDNStorage([$idE,$fecha],'=');
        $list['egress'][] = $this->obj->sum_egressUDNStorage([$idE,$fecha],'=');
    }

    return [
        'thDates' => $thead,
        'list'    => $list,
        'cost'    => $this->lsCosts($idE,$date1,$date2,$dates)
    ];
}
public function lsCosts($idE,$date1,$date2,$dates){
    $result = [];
    $sql    = $this->obj->lsCostosxAlmacen([$idE]);
    foreach ($sql as $value) {
        $idUI  = $value['id'];
        $name  = str_replace('COSTO','',$value['valor']);
        $fecha = [];
        foreach ($dates as $value) $fecha[] = $this->obj->sumCost([$idUI,$value['fecha']],'=');
        
        $result[] = [
            'id'    => $idUI,
            'cost'  => $name,
            'valor' => $this->obj->sumCost([$idUI,$date1,$date2]),
            'fecha' => $fecha
        ];

    }
    return $result;
}
public function tbCosts(){
    $idE              = $this->c->getVar('idE');
    $date1            = $this->c->getVar('date1');
    $date2            = $this->c->getVar('date2');
    $thead            = [];
    $list             = [];
    $granTotal        = 0;
    $totalDirecto     = 0;
    $totalCosto       = 0;
    $dataTotalDirecto = [];
    $dataTotalCosto   = [];
    $dataTotal        = [];
    
    $dates = $this->obj->dateCost([$idE,$date1,$date2]);
    foreach ($dates as $value) {
        $fecha               = $value['fecha'];
        $date                = new DateTime($fecha);
        $thead[]             = strftime('%A<br>%d %B',$date->getTimestamp());
        $directo             = $this->obj->totalUDNCost([$idE,$fecha],'Gasto','=');
        $costo               = $this->obj->totalUDNCost([$idE,$fecha],'Pago','=');
        $dataTotalDirecto[]  = $this->util->format_number($directo);
        $dataTotalCosto[]    = $this->util->format_number($costo);
        $dataTotal[]         = $this->util->format_number($directo + $costo);
        $totalDirecto       += $directo;
        $totalCosto         += $costo;
        $granTotal          += ($directo + $costo);

    }



    return [
        'thDates'     => $thead,
        'cost'        => $this->AllCost($idE,$date1,$date2,$dates),
        'total'       => $this->util->format_number($granTotal),
        'directo'     => $this->util->format_number($totalDirecto),
        'costo'       => $this->util->format_number($totalCosto),
        'dataTotal'   => $dataTotal,
        'dataDirecto' => $dataTotalDirecto,
        'dataCosto'   => $dataTotalCosto,
    ];
}
public function AllCost($idE,$date1,$date2,$dates){
    $result = [];
    $sql    = $this->obj->lsCostosxAlmacen([$idE]);
    foreach ($sql as $value) {
        $idUI        = $value['id'];
        $name        = trim(str_replace('COSTO','',$value['valor']));
        $dataDirecto = [];
        $dataCosto   = [];
        $dataTotal   = [];

        $totalCosto = 0;
        $totalDirecto   = 0;
        foreach ($dates as $value) {
            $fecha          = $value['fecha'];
            $directo        = $this->obj->dayCost([$idUI,$fecha],'Gasto','=');
            $costo      = $this->obj->dayCost([$idUI,$fecha],'Pago','=');
            $dataDirecto[]  = $this->util->format_number($directo);
            $dataCosto[]    = $this->util->format_number($costo);
            $dataTotal[]    = $this->util->format_number($directo + $costo);
            $totalDirecto  += $directo;
            $totalCosto    += $costo;
        }

        $result[] = [
            'id'          => $idUI,
            'cost'        => $name,
            'cost2'       => (mb_strlen($name,'UTF-8') < 16) ? $name : substr($name,0,-6).'...',
            'directo'     => $this->util->format_number($totalDirecto),
            'costo'       => $this->util->format_number($totalCosto),
            'total'       => $this->util->format_number($totalDirecto + $totalCosto),
            'dataDirecto' => $dataDirecto,
            'dataCosto'   => $dataCosto,
            'dataTotal'   => $dataTotal,
        ];
    }

    return $result;
}
}
?>