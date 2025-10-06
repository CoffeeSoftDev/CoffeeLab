<?php
require_once('../mdl/mdl-clientes.php');
require_once('../../conf/_Utileria.php');
class Clientes {
    private $c;//conta
    private $obj;
    private $util;

    public function __construct($conta) {
        $this->c = $conta;
        $this->obj = new MClientes();
        $this->util = new Utileria();
    }
public function lsCustomer(){
    $result = [];
    $idE    = $this->c->getVar('idE');
    $date1  = $this->c->getVar('date1');
    $date2  = $this->c->getVar('date2');
    
    $sql = $this->obj->lsClientes([$idE]);
    foreach ($sql as $value) {
        $idUC  = $value['id'];

        $existTransaction  = $this->obj->countTransaction([$idUC,$date1,$date2],'bitacora');
        $existTransaction += $this->obj->countTransaction([$idUC,$date1,$date2],'consumo');

        $pagos      = $this->obj->pagosCliente([$idUC,$date2],'<=');
        $deuda      = $this->obj->deudaCliente([$idUC,$date2],'<=') + $pagos['consumos'];
        $totalDeuda = floatval($deuda) - floatval($pagos['pagos']);
        
        $result[] = [
            'id'    => $idUC,
            'valor' => $value['valor'],
            'deuda' => number_format($totalDeuda,2,'.',','),
            'mov'   => ($existTransaction > 0) ? true : false,
        ];
    }
    return $result;
}
public function payDebtUDN(){
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $array = [$idE,$date1,$date2];
    $pays  = $this->obj->payUDN($array);
    $debt  = $this->obj->debtUDN($array) + $pays['consumo'];

    return [
        'debt' => number_format($debt,2,'.',','),
        'pay'  => number_format($pays['pago'],2,'.',','),
    ];
}
public function newTransaction(){
    $efectivo = $_POST['efectivo'];
    $banco    = $_POST['banco'];
    $consumo = $_POST['consumo'];
    $idUC    = $_POST['cliente'];
    $date    = $this->c->getVar('date1');

    $array = [];
    if( $efectivo != 0 || $banco != 0 || $consumo != 0){
        $array['values'] = ['Consumo','Pago','id_TP','id_UC','Fecha_Credito'];
        
        if( $efectivo != 0 && $banco != 0) {
            $array['data'][] = [0,$efectivo,1,$idUC,$date];
            $array['data'][] = [0,$banco,2,$idUC,$date];
        } else if( $efectivo != 0 || $banco != 0) {
            $pago            = $efectivo != '0' ? $efectivo : $banco;
            $idTP            = $efectivo != '0' ? 1 : 2;
            $array['data'] = [0,$pago,$idTP,$idUC,$date];
        }

        if ($consumo != 0) {
            if( is_array($array['data'])  && is_array($array['data'][0]) ) 
                $array['data'][] = [$consumo,0,null,$idUC,$date];

            else if ( count($array['data']) > 0 ) 
                $array['data'] = [$array['data'],[$consumo,0,null,$idUC,$date]];

            else  
                $array['data'] = [$consumo,0,null,$idUC,$date];
        }

        return $this->obj->newTransaction($array);
    }
}
public function payDebtCustomer(){
    $date1       = $this->c->getVar('date1');
    $date2       = $this->c->getVar('date2');
    $idUC        = $_POST['folio'];
    $result      = [];
    $array       = [$idUC,$date1,$date2];
    $sqlPays     = $this->obj->payDay($array);
    $sqlConsumos = $this->obj->debtDay($array);

    foreach ($sqlPays as $value) {
        $result[] = [
            'table'    => 'bitacora',
            'customer' => $idUC,
            'folio'    => 'P'.$value['idBC'],
            'id'       => $value['idBC'],
            'consumo'  => $value['Consumo'] ?? 0,
            'pago'     => $value['Pago'],
            'tipoPago' => ( $value['id_TP'] == 1 )  ? 'Efectivo' :( $value['id_TP'] == 2  ? 'Banco' : '')
        ];
    }

    foreach ($sqlConsumos as $value) {
        $result[] = [
            'table'    => 'consumo',
            'customer' => $idUC,
            'folio'    => 'C'.$value['idCC'],
            'id'       => $value['idCC'],
            'consumo'  => $value['Cantidad'],
            'pago'     => '0',
            'tipoPago' => ''
        ];
    }

    return $result;
}
public function balanceCustomer(){
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $pays    = $this->obj->payUDN([$idE,$date1],'<');
    $debt    = $this->obj->debtUDN([$idE,$date1],'<') + $pays['consumo'];
    $initial = $debt - $pays['pago'];

    $array = [$idE,$date1,$date2];
    $pays  = $this->obj->payUDN($array);
    $debt  = $this->obj->debtUDN($array) + $pays['consumo'];
    $final = $initial + $debt - $pays['pago'];

    return [
        "initial" => $this->util->format_number($initial),
        "debt"    => $this->util->format_number($debt),
        "pays"    => $this->util->format_number($pays['pago']),
        "final"   => $this->util->format_number($final),
    ];
}
public function initCustomerTab(){
    return [
        "customers" => $this->lsCustomer(),
        "balance"   => $this->balanceCustomer(),
    ];
}
public function editMovCustomer(){
    $folio     = substr($_POST['folio'], 1);
    $efectivo = $_POST['efectivo'];
    $banco    = $_POST['banco'];
    $consumo  = $_POST['consumo'];
    $table    = $_POST['table'];

    $array = ['values'=>[],'where'=>[],'data'=>[]];

    if(!empty($efectivo)){
        $array['values'] = 'Pago,id_TP,Consumo';
        $array['where']  = 'idBC';
        $array['data']   = [$efectivo,1,0,$folio];
    } 
    else if(!empty($banco)){
        $array['values'] = 'Pago,id_TP,Consumo';
        $array['where']  = 'idBC';
        $array['data']   = [$banco,2,0,$folio];
    } 
    else if(!empty($consumo)){
        if($table == 'bitacora'){
            $array['values'] = 'Consumo,id_TP,Pago';
            $array['where']  = 'idBC';
            $array['data']   = [$consumo,null,0,$folio];
        } else {
            $array['values'] = 'Cantidad';
            $array['where']  = 'idCC';
            $array['data']   = [$consumo,$folio];
        }
    } 

    return $this->obj->editMovCustomer($array,$table);
}
public function deleteMovCustomer(){
    return $this->obj->deleteMovCustomer([$_POST['folio']],$_POST['table']);
}
public function consultCustomers(){
    $lsCustomers = $this->lsCustomer();
    $movements   = $this->datesConsultCustomers($lsCustomers);

    return [
        'customers' => $lsCustomers,
        'balance'   => $this->balanceTotalCustomer($lsCustomers),
        'dates'     => $movements['dates'],
        'list'      => $movements['list'],
    ];
}
private function balanceTotalCustomer($list){
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $result = [];
    foreach ($list as  $val) {
        $idUC = $val['id'];

        $paysInit = $this->obj->pagosCliente([$idUC,$date1],'<');
        $debtInit = $this->obj->deudaCliente([$idUC,$date1],'<') + $paysInit['consumos'];
        $initial  = $debtInit - $paysInit['pagos'];
        
        $pays  = $this->obj->pagosCliente([$idUC,$date1,$date2]);
        $debt  = $this->obj->deudaCliente([$idUC,$date1,$date2]) + $pays['consumos'];
        $final = $initial + $debt - $pays['pagos'];

        $result[] = [
            "initial" => $this->util->format_number($initial),
            "debt"    => $this->util->format_number($debt),
            "pays"    => $this->util->format_number($pays['pagos']),
            "final"   => $this->util->format_number($final),
            'id'      => $idUC,
        ];
    }
    return $result;
}
private function datesConsultCustomers($list){
    setlocale(LC_TIME, 'es_ES.UTF-8');
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $dates  = $this->obj->consultDatesCustomers([$idE,$date1,$date2]);
    $result = [];
    $thead  = [];
    foreach ($dates as $value) {
        $date1   = $value['fecha'];
        $date2   = $date1;
        $date    = new DateTime($date1);
        $thead[] = strftime('%A<br>%d %B',$date->getTimestamp());

        foreach ($list as $key => $row) {
            $idUC   = $row['id'];
            $count = $this->obj->countTransaction([$idUC,$date1,$date2],'consumo');
            $count += $this->obj->countTransaction([$idUC,$date1,$date2],'bitacora');
            
            
            $paysInit = $this->obj->pagosCliente([$idUC,$date1],'<');
            $debtInit = $this->obj->deudaCliente([$idUC,$date1],'<') + $paysInit['consumos'];
            $initial  = $debtInit - $paysInit['pagos'];

            if ( $count == 0 ) {
                $result[] = [
                    'initial' => $this->util->format_number($initial),
                    'buys'    => '-',
                    'pays'    => '-',
                    'final'   => $this->util->format_number($initial),
                    'id'      => $idUC,
                    'fecha'   => $date1
                ];
            } else {
                $pays  = $this->obj->pagosCliente([$idUC,$date1,$date2]);
                $debt  = $this->obj->deudaCliente([$idUC,$date1,$date2]) + $pays['consumos'];
                $final = $initial + $debt - $pays['pagos'];

                $result[] = [
                    "initial" => $this->util->format_number($initial),
                    "debt"    => $this->util->format_number($debt),
                    "pays"    => $this->util->format_number($pays['pagos']),
                    "final"   => $this->util->format_number($final),
                    'id'      => $idUC,
                    'fecha'   => $date1
                ];
            }
        }
    }
    

    return [
        'dates' => $thead,
        'list'  => $result
    ];
}
}
?>