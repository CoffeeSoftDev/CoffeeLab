<?php
require_once('../mdl/mdl-proveedores.php');
require_once('../../conf/_Utileria.php');
class Proveedores {
      // INSTANCIAS
    private $c;
    private $obj;
    private $util;

    public function __construct($conta) {
        $this->c    = $conta;
        $this->obj  = new MProveedores();
        $this->util = new Utileria();
    }
public function lsSuppliers() {
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $suppliers = [];
    $sql       = $this->obj->lsProveedores([$idE]);
    foreach ($sql as $value) {
        $idUP = $value['id'];

        $array = [$idUP,$date2];
        $buy   = $this->obj->sum_buysSuppliers($array,'<=');
        $buy   = $buy['subtotal'] + $buy['impuesto'];
        $pay   = $this->obj->sum_paysSuppliers($array,'<=');
        $debt  = $buy - $pay;

        $array = [$idUP,$date1,$date2];
        $pays  = $this->obj->count_paysSuppliers($array);
        $buys  = $this->obj->count_buysSuppliers($array);

        $suppliers[] = [
            'id'    => $idUP,
            'valor' => $value['valor'],
            'debt'  => number_format($debt,2,'.',','),
            'mov'   => ($pays+$buys),
        ];
    }

    return $suppliers;
}
public function balanceSuppliers(){
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $buyInit     = $this->obj->buysUDNSuppliers([$idE,$date1],'<');
    $payInit     = $this->obj->payUDNSuppliers([$idE,$date1],'<');
    $initBalance = $buyInit - $payInit;

    $buy = $this->obj->buysUDNSuppliers([$idE,$date1,$date2]);
    $pay = $this->obj->payUDNSuppliers([$idE,$date1,$date2]);

    $endBalance = $initBalance + $buy - $pay;

    return [
        'initial' => $this->util->format_number($initBalance),
        'pays'    => $this->util->format_number($pay),
        'buys'    => $this->util->format_number($buy),
        'final'   => $this->util->format_number($endBalance),
    ];
}
public function initSuppliers(){
    return [
        'suppliers' => $this->lsSuppliers(),
        'balance'   => $this->balanceSuppliers()
    ];
}
public function movSuppliersDay(){
    $idUP  = $_POST['id'];
    $date1 = $this->c->getVar('date1');

    $result = [];
    $sqlBuy = $this->obj->day_buySuppliers([$idUP,$date1]);
    foreach ($sqlBuy as $row) {
        $result[] = [
            'folio'     => $row['id'],
            'subtotal'  => $row['subtotal'],
            'impuesto'  => $row['impuesto'],
            'pago'      => 0,
            'idTP'      => 2,
            'clase'     => 'Crédito',
            'obs'       => $row['obs'],
            'suppliers' => $idUP,
        ];
    }
    $sqlPay = $this->obj->day_paySuppliers([$idUP,$date1]);
    foreach ($sqlPay as $row) {
        $result[] = [
            'folio'     => $row['id'],
            'subtotal'  => 0,
            'impuesto'  => 0,
            'pago'      => $row['pago'],
            'idTP'      => $row['id_CG'],
            'clase'     => $row['clase'],
            'obs'       => $row['obs'],
            'suppliers' => $idUP,
        ];
    }

    return $result;
}
public function editMovSuppliers(){
    return $this->obj->editMovSuppliers($this->util->sql($_POST,1));
}
public function deleteMovSuppliers(){
    return $this->obj->deleteMovSuppliers([$_POST['folio']]);
}
public function consultSuppliers() {
    $lsSuppliers = $this->lsSuppliers();
    $movements   = $this->datesConsultSuppliers($lsSuppliers);

    return [
        'suppliers' => $lsSuppliers,
        'balance'   => $this->balanceTotalidUP($lsSuppliers),
        'dates'     => $movements['dates'],
        'list'      => $movements['list']
    ];
}
private function balanceTotalidUP($list){
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $result = [];
    foreach ($list as $val) {
        $idUP = $val['id'];
        
        $buyInit     = $this->obj->sum_buysSuppliers([$idUP,$date1],'<');
        $buyInit     = $buyInit['subtotal'] + $buyInit['impuesto'];
        $payInit     = $this->obj->sum_paysSuppliers([$idUP,$date1],'<');
        $initBalance = $buyInit - $payInit;
        $buy         = $this->obj->sum_buysSuppliers([$idUP,$date1,$date2]);
        $pay         = $this->obj->sum_paysSuppliers([$idUP,$date1,$date2]);

        $endBalance = $initBalance + $buy['subtotal'] + $buy['impuesto'] - $pay;

        $result[] = [
            'initial' => $this->util->format_number($initBalance),
            'buys'    => $buy['subtotal'],
            'taxs'    => $buy['impuesto'],
            'pays'    => $this->util->format_number($pay),
            'final'   => $this->util->format_number($endBalance),
            'id'      => $idUP
        ];
    }
    return $result;
}
private function datesConsultSuppliers($list){
    setlocale(LC_TIME, 'es_ES.UTF-8');
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $result = [];
    $dates = $this->obj->consultDatesSuppliers([$idE,$date1,$date2]);
    $thead = [];
    foreach ($dates as $value) {
        $date1   = $value['fecha'];
        $date2   = $date1;
        $date    = new DateTime($value['fecha']);
        $thead[] = strftime('%A<br>%d %B',$date->getTimestamp());

        foreach ($list as $row) {
            $idUP = $row['id'];
            $count = $this->obj->countMovetSuppliers([$idUP,$date1]);
            
            $buyInit     = $this->obj->sum_buysSuppliers([$idUP,$date1],'<');
            $buyInit     = $buyInit['subtotal'] + $buyInit['impuesto'];
            $payInit     = $this->obj->sum_paysSuppliers([$idUP,$date1],'<');
            $initBalance = $buyInit - $payInit;

            if($count == 0) {
                $result[] = [
                    'initial' => $this->util->format_number($initBalance),
                    'buys'    => 0,
                    'taxs'    => 0,
                    'pays'    => '-',
                    'final'   => $this->util->format_number($initBalance),
                    'id'      => $idUP,
                    'fecha'   => $date1
                ];    
            } else {
                $buy        = $this->obj->sum_buysSuppliers([$idUP,$date1,$date2]);
                $pay        = $this->obj->sum_paysSuppliers([$idUP,$date1,$date2]);
                $endBalance = $initBalance + $buy['subtotal'] + $buy['impuesto'] - $pay;

                $result[]   = [
                    'initial' => $this->util->format_number($initBalance),
                    'buys'    => $buy['subtotal'],
                    'taxs'    => $buy['impuesto'],
                    'pays'    => $this->util->format_number($pay),
                    'final'   => $this->util->format_number($endBalance),
                    'id'      => $idUP,
                    'fecha'   => $date1
                ];
            }
        }
    }
    

    return [
        'list'  => $result,
        'dates' => $thead
    ];
}
}
?>