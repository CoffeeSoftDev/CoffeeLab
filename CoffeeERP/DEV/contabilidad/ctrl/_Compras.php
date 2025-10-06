<?php
date_default_timezone_set('America/Mexico_City');
setlocale(LC_TIME, 'es_ES.UTF-8');
require_once('../mdl/mdl-compras.php');
require_once('../../conf/_Utileria.php');
require_once('../../conf/_Message.php');
class Compras{
    // INSTANCIAS
    private $c;
    private $obj;
    private $util;
    private $msg;
    // VARS
    private $idE;
    private $date1;
    private $date2;

    public function __construct($conta) {
        $this->c    = $conta;
        $this->obj  = new MCompras();
        $this->util = new Utileria();
        $this->msg  = new Message();
    }
private function filtroTipoCompra() {
    $filtro = $this->c->getVar('filtro');
    switch ($filtro) {
        case '1'    : 
        case '2'    : 
        case '3'    : return ',id_CG = '.$filtro; break;
        case '4'    : return ",Name_IC LIKE '%almacen%'"; break;
        case '5'    : return ",Name_IC LIKE '%costo%'"; break;
        default: return ""; break;
    }
}
public function lsTPago(){
    $ls = $this->obj->_Select([
        'table'  => $this->obj->getFzas()."tipo_pago",
        'values' => 'idTP AS id,Name_TP AS valor',
        'where'  => 'idTP != 2',
    ]);
    
    return array_merge([['id'=>0,"valor" => "SELECCIONAR"]],$ls);
}
public function lsCompras(){
    $idE = $this->c->getVar('idE');
    return [
        'proveedores' => $this->obj->lsProveedores([$idE]),
        'cInsumos'    => $this->obj->lsClaseInsumo([$idE]),
        'insumos'     => $this->obj->lsInsumos([$idE]),
        'facturas'    => $this->lsFacturas()
    ];
}
public function lsFacturas(){
    $idE = $this->c->getVar('idE');
    $ls = $this->obj->lsFacturas([$idE]);
    
    return array_merge([['id'=>0,"valor" => "SELECCIONAR"]],$ls);
}
public function tbCompras(){
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $campo = $this->filtroTipoCompra();
    $sql =  $this->obj->listCompras([$idE,$date1],$campo);
    return $sql;
}
public function putBuy() {
    if($_POST['exist_bill'] == 'false' && !empty($_POST['id_F']) ) $this->newBill();
    
    
    if(empty($_POST['idCompras']))
        return $this->newBuy();
    else 
        return $this->editBuy();
}
private function newBill() {
    $table = $this->obj->getFzas().'facturas';
    
    $array = $this->util->sql([
        'id_UDN'        => $_POST['id_UDN'],
        'folio'         => $_POST['id_F'],
        'fecha_compra' => $_POST['Fecha_Compras']
    ]);

    $exito = $this->obj->_Insert($array,$table);
    if($exito == true) $_POST['id_F'] = $this->obj->_Read("SELECT MAX(idF) AS max FROM {$table}",null)[0]['max'];

    unset($_POST['exist_bill']);
}
private function newBuy() {
    $table = $this->obj->getFzas().'compras';
    if(!empty($_POST['exist_bill'])) unset($_POST['exist_bill']);
    if($_POST['id_TP'] == '0' ) unset($_POST['id_TP']);
    
    $exito =  $this->obj->_Insert($this->util->sql($_POST),$table);
    if($exito == true) {
        if($_FILES['comprobante']['name'] == '')
            return $exito;
        else {
            $_POST['idCompras'] = $this->obj->maxBuy();
            return $this->newFile();
        }
    } else return $exito;
}
private function editBuy(){
    unset($_POST['Fecha_Compras']);
    unset($_POST['exist_bill']);
    $idCompra = $_POST['idCompras'];
    unset($_POST['idCompras']);

    if($_POST['id_F'] == '0' || $_POST['id_F'] == "") $_POST['id_F'] = null;
    if($_POST['id_TP'] == '0' || $_POST['id_TP'] == "") $_POST['id_TP'] = null;
    if($_POST['id_UP'] == '0' || $_POST['id_UP'] == "") $_POST['id_UP'] = null;
    if($_POST['id_CG'] == '0' || $_POST['id_CG'] == "") $_POST['id_CG'] = null;
    if($_POST['id_UG'] == '0' || $_POST['id_UG'] == "") $_POST['id_UG'] = null;
    if($_POST['id_CG'] == '1') $_POST['id_TP'] = null;
    if($_POST['id_UI'] == '0' || $_POST['id_UI'] == "") $_POST['id_UI'] = null;
    if($_POST['GastoIVA'] == '0' || $_POST['GastoIVA'] == "") $_POST['GastoIVA'] = null;
    $_POST['idCompras'] = $idCompra;

    return $this->obj->editBuy($this->util->sql($_POST,1));
    // if($_POST['id_F'] == 'null' ) {
    //     $this->obj->resetBill([null,$_POST['idCompras']]);
    //     unset($_POST['id_F']);
    // }
}
private function newFile() {
    $year  = date('Y');
    $month = date('m');

    $hoy   = date('d').date('m').date('Y');

    $time  = date('H:m:s');

    $idE   = $_POST['id_UDN'];

    $date  = new DateTime(date('Y-m-d'));

    $mes   = strftime('%B', $date->getTimestamp());
    $udn   = $this->obj->onlyUDN([$idE])['Abreviatura'];

    $destino = "erp_files/finanzas/{$year}/{$month}.-{$mes}/".$udn.'/compras/';    

    $idCompra = $this->obj->maxBuy();

    $extension = end(explode('.',$_FILES['comprobante']['name']));

    $newName = $udn.'_'.date('d-m-Y').'_'.date('H.m.s');


    $arrayFile = [
        'UDN_Sobre'     => $idE,
        'Fecha'         => $_POST['Fecha_Compras'],
        'Ruta'          => $destino,
        'Hora'          => $time,
        'Archivo'       => $newName.'.'.$extension,
        'Type_File'     => $extension,
        'Peso'          => ROUND(($_FILES['comprobante']['size']/1024),4),
        'id_Area'       => 16,
        'clasificacion' => 'GAS',
        'titulo'        => $_FILES['comprobante']['name'],
        'id_F'          => $_POST['id_F'],
        'id_Compras'    => $_POST['idCompras']
    ];

    $upFile = false;
    $exito = $this->obj->_Insert($this->util->sql($arrayFile),$this->obj->getFzas().'sobres'); 
    if($exito == true) $upFile = $this->util->upload_file($_FILES['comprobante'],'../../../'.$destino,$newName);

    // if($upFile == true) return 'https://www.erp-varoch.com/'.$destino.'/'.$newName.'.'.$extension;

    // $grupoWhatsaap = '120363040506662913@g.us';
    $grupoWhatsaap = '5219621663421@c.us';
    $rutaCompleta  = 'https://www.erp-varoch.com/'.$destino;
    $comprobante   = $newName.'.'.$extension;
    if($upFile == true) return $this->msg->whatsapp_file($grupoWhatsaap,"Se realiz¨® una nueva compra de mantenimiento en ".$udn.", se adjunta comprobante.",$rutaCompleta,$comprobante);

}
public function deleteBuy(){
    return $this->obj->deleteBuy([$_POST['folio']]);
}
public function tbConsultBuy(){
    $idE    = $this->c->getVar('idE');
    $date1  = $this->c->getVar('date1');
    $date2  = $this->c->getVar('date2');
    $filtro = $this->c->getVar('filtro');
    $idCG   = $_POST['tCompra'];
    $idTP   = $_POST['fPago'];

    $granTotal = 0;
    $totalDate = [];
    $thead     = [];
    $fechasTH  = [];
    $dates     = $this->obj->dates_ConsultBuys([$idCG,$idE,$date1,$date2],$idTP);
    foreach ($dates as  $value) {
        $fecha        = $value['fecha'];
        $date         = new DateTime($fecha);
        $fechasTH[]   = $date->format('Y-m-d');
        $thead[]      = strftime('%A<br>%d %B',$date->getTimestamp());
        $data         = $this->obj->insumosUDN([$idCG,$idE,$value['fecha']],$idTP);
        $totalDate[]  = $this->util->format_number($data['subtotal'] + $data['impuesto']);
        $granTotal   += ($data['subtotal'] + $data['impuesto']);
    }
    
    $list = [];
    $sql   = $this->obj->lsConsultBuys([$idCG,$idE,$date1,$date2],$idTP);
    foreach ($sql as  $value) {
        $idUI = $value['id'];
        $name = $value['valor'];

        $lsGastos  = [];
        $sqlGastos = null;
        if ( $filtro == 2 ) {
            $sqlGastos = $this->obj->listGastosBuys([$idCG,$idUI,$date1,$date2],$idTP);
            foreach ($sqlGastos as $valueUG ) {
                $idUG        = $valueUG['id'];
                $nameUG      = $valueUG['valor'];
                $subtotalUG  = [];
                $impuestosUG = [];
                $totalUG     = [];
                foreach ($dates as $val) {
                    $dataUG        = $this->obj->insumosDia([$idCG,$idUG,$val['fecha']],'id_UG',$idTP);
                    $subtotalUG[]  = $this->util->format_number($dataUG['subtotal']);
                    $impuestosUG[] = $this->util->format_number($dataUG['impuesto']);
                    $totalUG[]     = $this->util->format_number($dataUG['subtotal'] + $dataUG['impuesto']);
                }
                
                $lsGastos[] = [
                    'id'            => $idUG,
                    'valor'         => $nameUG,
                    'name'          => (mb_strlen($nameUG,'UTF-8') < 20) ? $nameUG : substr($nameUG,0,-6).'...',
                    'subtotal'      => $this->util->format_number($valueUG['subtotal']),
                    'impuesto'      => $this->util->format_number($valueUG['impuesto']),
                    'total'         => $this->util->format_number($valueUG['subtotal'] + $valueUG['impuesto']),
                    'subtotalDate'  => $subtotalUG,
                    'impuestosDate' => $impuestosUG,
                    'totalDate'     => $totalUG,
                ];
            }
        }

        
        $subtotal       = [];
        $impuestos      = [];
        $total          = [];

        foreach ($dates as $val) {
            $data        = $this->obj->insumosDia([$idCG,$idUI,$val['fecha']],'id_UI',$idTP);
            $subtotal[]  = $this->util->format_number($data['subtotal']);
            $impuestos[] = $this->util->format_number($data['impuesto']);
            $total[]     = $this->util->format_number($data['subtotal'] + $data['impuesto']);
        }

        $list[] = [
            'id'            => $idUI,
            'valor'         => $name,
            'name'          => (mb_strlen($name,'UTF-8') < 20) ? $name : substr($name,0,-6).'...',
            'subtotal'      => $value['subtotal'],
            'impuesto'      => $value['impuesto'],
            'subtotalDate'  => $subtotal,
            'impuestosDate' => $impuestos,
            'totalDate'     => $total,
            'gastos'        => $lsGastos
        ];
    }

    return [
        'list'      => $list,
        'thDates'   => $thead,
        'dates'     => $fechasTH,
        'total'     => $this->util->format_number($granTotal),
        'totalDate' => $totalDate,
    ];
}
public function fileBuy() {
    if(!empty($_FILES)) {
        $year  = date('Y');
        $month = date('m');
        $hoy   = date('d').date('m').date('Y');
        $time  = date('H:m:s');
        $idE   = $_POST['id_UDN'];
        $date  = new DateTime(date('Y-m-d'));
        $mes   = strftime('%B', $date->getTimestamp());
        $udn   = $this->obj->onlyUDN([$idE])['Abreviatura'];

        $destino = "erp_files/finanzas/{$year}/{$month}.-{$mes}/{$udn}/compras/";

        $listFile  = [];
        foreach ($_FILES['archivos']['name'] as $key => $archivo) {
            $archivoIndividual = [
                'name'     => $_FILES['archivos']['name'][$key],
                'type'     => $_FILES['archivos']['type'][$key],
                'tmp_name' => $_FILES['archivos']['tmp_name'][$key],
                'error'    => $_FILES['archivos']['error'][$key],
                'size'     => $_FILES['archivos']['size'][$key]
            ];

            // Kilobytes (KB): size en bytes / 1024
            // Megabytes (MB): size en bytes / 1024 / 1024
            $sizeKb  = $_FILES['archivos']['size'][$key]/1024; 
            $sizeMb  = floor($sizeKb/1024);

            if ( $sizeMb >= 20 ) {
                $listFile[] = [
                    'id'    => 0,
                    'file' => $archivo,
                    'size'  => ROUND(($sizeKb / 1024),3).' MB'
                ];
            } else {
                $newName   = $udn.'_'.date('dmY').'_'.date('H:m:s').'('.($key+1).')';
                $extension = end(explode('.',$archivo));

                $arrayFile = [
                    'UDN_Sobre'     => $idE,
                    'Fecha'         => $_POST['Fecha_Compras'],
                    'Ruta'          => $destino,
                    'Hora'          => $time,
                    'Archivo'       => $newName.'.'.$extension,
                    'Type_File'     => $extension,
                    'Peso'          => $sizeMb,
                    'id_Area'       => 16, // Gerencia
                    'clasificacion' => 'GAS',
                    'titulo'        => $archivo
                ];

                $exito = $this->obj->_Insert($this->util->sql($arrayFile),$this->obj->getFzas().'sobres');
                if($exito == true)  $upFile = $this->util->upload_file($archivoIndividual,'../../../'.$destino,$newName);

                $listFile[] = [
                    'id'   => $this->obj->maxFile(),
                    'file' => $archivo,
                    'size' => ($sizeMb == 0 ) ? ROUND($sizeKb,3).' KB' : ROUND(($sizeKb / 1024),3).' MB'
                ];
            }

            usort($listFile, function ($a, $b) {
                return ($a['id'] === 0 ? -1 : $a['id']) <=> ($b['id'] === 0 ? -1 : $b['id']);
            });
        }

        return [
            'files'=>$listFile,
            'bills'=>$this->lsFacturas()
        ];
    } return false;
}
public function fileBill() {
    $lsFacturas = explode(',',$_POST['id_F']);

    $result = [];
    foreach ($lsFacturas as $key => $idF) {
        $result[] = [
            'id_Sobre'   => $_POST['idSobre'],
            'id_Factura' => $idF
        ];
    }

    $result          = $this->util->sql($result);
    $result['table'] = $this->obj->getFzas().'factura_sobres';

    return $this->obj->_Insert($result);
}
public function lsDetails(){
    $idUI = $_POST['id'];
    
    $ls = $this->obj->lsDetails([$idUI,$_POST['tCompra'],$_POST['fecha']]);
    foreach ($ls as &$tr) {
        $tr['subtotal'] = $this->util->format_number($tr['subtotal']);
        $tr['impuesto'] = $this->util->format_number($tr['impuesto']);
    }


    return [
        'clase' => $this->obj->insumoClasexid([$idUI]),
        'ls'    => $ls
    ];
}
}
?>