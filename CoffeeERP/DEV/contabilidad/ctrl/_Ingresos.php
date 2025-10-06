<?php
date_default_timezone_set('America/Mexico_City');
setlocale(LC_TIME, 'es_ES.UTF-8');
require_once('../mdl/mdl-ingresos.php');
require_once('../mdl/mdl-clientes.php');
require_once('../../conf/_Utileria.php');
class Ingresos {
    // INSTANCIAS
    private $c;
    private $obj;
    private $util;
    // VARS
    private $idE;
    private $date1;
    private $date2;
    public function __construct($conta) {
        $this->c    = $conta;
        $this->obj  = new MIngresos();
        $this->objC = new MClientes();
        $this->util = new Utileria();
    }
// DATOS DE VENTAS
public function datosVentas(){
    $this->idE   = $this->c->getVar('idE');
    $this->date1 = $this->c->getVar('date1');

    $result = [];
    $datos = ['Ventas','Descuentos','Impuestos'];
    foreach ($datos as $valor) {
        $fn = 'form'.$valor;
        
        $result[] = [
            'container' => 'ing'.$valor,
            'elements'=>$this->$fn()
        ];
    }
    return $result;
}
private function formVentas(){
    $result = [];
    $sql = $this->obj->lsVentas([$this->idE]);
    foreach ($sql as $key => $value) {
        $id    = $value['idUV'];
        $name  = $value['Name_Venta'];
        $valor = $this->obj->ventasDia([$id,$this->date1]);

        $result[] = [
            "lbl"      => $name,
            "elemento" => "input-group",
            "tipo"     => "cifra",
            "idUV"     => $id,
            "value"    => $valor,
            "class"    => "iptVentas",
        ];
    }
    return $result;
}
private function formDescuentos(){
    $result = [];
    $sql = $this->obj->lsDescuentos([$this->idE]);
    foreach ($sql as $key => $value) {
        $id    = $value['idUD'];
        $name  = $value['Name_Descuentos'];
        $valor = $this->obj->descuentosDia([$id,$this->date1]);

        $result[] = [
            "lbl"      => $name,
            "elemento" => "input-group",
            "tipo"     => "cifra",
            "idUD"     => $id,
            "value"    => $valor,
            "class"    => "iptDescuentos",
        ];
    }
    return $result;
}
private function formImpuestos(){
    $result = [];
    $sql = $this->obj->lsImpuestos([$this->idE]);
    foreach ($sql as $key => $value) {
        $id    = $value['idUI'];
        $name  = $value['Porcentaje'];
        $valor = $this->obj->impuestosDia([$id,$this->date1]);

        $result[] = [
            "lbl"      => $name,
            "elemento" => "input-group",
            "tipo"     => "cifra",
            "idUI"     => $id,
            "value"    => $valor,
            "class"    => "iptImpuestos",
        ]; 
    }
    return $result;
}
// DATOS DE CAJA
public function datosCaja(){
    $this->idE   = $this->c->getVar('idE');
    $this->date1 = $this->c->getVar('date1');
    $result      = [];
    $datos       = ['Efectivo','Monedas','Bancos'];
    foreach ($datos as $valor) {
        $fn = 'form'.$valor;
        $elementos = $this->$fn();
        $result = array_merge($result,$elementos);
    }
    return $result;
}
private function formEfectivo(){
    $result = [];
    // EFECTIVO/PROPINA
    $sqlEfectivos = $this->obj->lsEfectivo();

    // Encontrar índices
    $indexComision = array_search('Comisión', array_column($sqlEfectivos, 'valor'));
    $indexDescuento = array_search('Descuento destajo', array_column($sqlEfectivos, 'valor'));

    // Intercambiar si existen
    if ($indexComision !== false && $indexDescuento !== false) {
        [$sqlEfectivos[$indexComision], $sqlEfectivos[$indexDescuento]] = [$sqlEfectivos[$indexDescuento], $sqlEfectivos[$indexComision]];
    }


    foreach ($sqlEfectivos as $value) {
        $id     = $value['id'];
        $valor  = $this->obj->valorEfectivoDia([$id, $this->idE, $this->date1]);
        $label  = $value['valor'];

        // Etiqueta personalizada para id == 1 según empresa
        if ($id == 1) {
            if ($this->idE == 5) {
                $label = 'Comisión por UBER';
            } elseif (in_array($this->idE, [1, 7])) {
                $label = 'Fichas de depósito';
            }
        }

        // Caso general: id no es comisión, descuento ni destajo
        if (!in_array($id, [3, 4, 5])) {
            $result[] = [
                "lbl"        => $label,
                "elemento"   => "input-group",
                "idEfectivo" => $id,
                "value"      => $valor,
                "tipo"       => "cifra",
                "class"      => "caja_efectivo",
            ];
            continue;
        }

        // Empresa 6: mostrar id 3, 4, 5 tal cual
        if ($this->idE == 6 && in_array($id, [3, 4, 5])) {
            $result[] = [
                "lbl"        => $value['valor'],
                "elemento"   => "input-group",
                "idEfectivo" => $id,
                "value"      => $valor,
                "tipo"       => "cifra",
                "class"      => "caja_efectivo",
            ];
            continue;
        }
    }
    return $result;
}
private function formMonedas(){
    // MONEDAS EXTRANJERAS
    $result = [];
    $sqlMonedas = $this->obj->lsMonedasExtranjeras();
    foreach ($sqlMonedas as $value) {
        $id = $value['id'];
        $valor = $this->obj->valueMonedaDia([$id,$this->idE,$this->date1]);

        if($id != 4){
            $result[] = [
                "lbl"      => $value['valor'],
                "elemento" => "input-group",
                "idMoneda" => $id,
                "value"    => $valor['Cantidad'],
                "icon"     => '<i class="fw-bold">'.$value["icon"].'</i>',
                "mxn"      => count($valor) > 0 ? $valor['Valor'] : $value["mxn"],
                "tipo"     => "cifra",
                "class"    => "caja_moneda",
            ]; 
        }
    }

    return $result;
}
private function formBancos(){
    // BANCOS
    $result = [];
    $sqlBancos = $this->obj->lsBancos([1,$this->idE]);
    foreach ($sqlBancos as $value) {
        $id = $value['id'];            
        $valor = $this->obj->bancosDia([$id,$this->date1]);

        $result[] = [
            "lbl"      => $value['valor'],
            "elemento" => "input-group",
            "idUB"     => $id,
            "value"    => $valor,
            "tipo"     => "cifra",
            "class"    => "caja_bancos",
        ]; 
    }

    return $result;
}
// INSERTAR INGRESOS Y ARCHIVOS
public function insIncome2(){
    
    $monedas   = $_POST['datos']['monedas'];
    $result    = [];
    $updateMon = [];

    foreach ($monedas as $key => $mon) {
        $array                 = [];
        $array["id_Moneda"]    = $mon["id_Moneda"];
        $array["id_UDN"]       = $mon["id_UDN"];
        $array["Fecha_Moneda"] = $mon["Fecha_Moneda"];
        $id = $this->obj->existeMoneda($this->util->sql($array,3));
        
        if ( !empty($id) ) {
            $updateMon = $mon;
            unset($updateMon['Valor']);
            $arrayUpd           = $this->util->sql($updateMon,3);
            $arrayUpd['table']  = $this->obj->getFzas().'moneda_extranjera_bitacora';
            $result[]['update'] = $this->obj->_Update($arrayUpd);
        }
        else $result[]['insert'] = $this->obj->insSales($this->util->sql($mon), 'moneda_extranjera');
    }

    $data = ['venta','descuentos','impuestos','efectivo','bancos'];
    
    $idE   = $this->c->getVar('idE');
    $date  = $this->c->getVar('date1');
    $array = [$idE, $date];

    foreach ($data as $methods) {
        $value = $_POST['datos'][$methods] ?? null;
        
        if ( !empty($value) ) {
            $existsMethod = "existe" . ucfirst($methods); // Construir nombre del metodo "existe*"
            $deleteMethod = "eliminar" . ucfirst($methods); // Construir nombre del metodo "eliminar*"

            if ($this->obj->{$existsMethod}($array)) $this->obj->{$deleteMethod}($array);

            $result[][$methods] = $this->obj->insSales($this->util->sql($value), $methods);
        }
    }
    return $result;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    // return $this->obj->bitacoraFzasIngresos([$idE,$_COOKIE['IDU'],$date,'Inserto ingresos en sobres']);
}
public function insIncome(){
    $udn = [$this->c->getVar('idE'),$this->c->getVar('date1')];

    // return $_POST;
    return [
        'ventas'     => !empty($_POST['ventas']) ? $this->ventasBD($udn) : [],
        'descuentos' => !empty($_POST['descuentos']) ? $this->descuentosBD($udn) : [],
        'impuestos'  => !empty($_POST['impuestos']) ? $this->impuestosBD($udn) : [],
        'efectivo'   => !empty($_POST['efectivo']) ? $this->efectivoBD($udn) : [],
        'monedas'    => !empty($_POST['monedas']) ? $this->monedasBD($udn) : [],
        'bancos'     => !empty($_POST['bancos']) ? $this->bancosBD($udn) : [],
    ];
}
public function filtrarDuplicados($array){
    // return $array;
    $result = [];
    $ids     = [];
    foreach ($array as $item) {
        if(!in_array($item['id'],$ids)){
            $ids[] = $item['id'];
            unset($item['id']);
            $result[] = $item;
        }
    }
    return $result;
}
public function ventasBD($udn){ 
    $sucess = $this->obj->eliminarVentas($udn);

    $data = $this->util->sql($this->filtrarDuplicados($_POST['ventas']));
    if($sucess === true) return $this->obj->insertVentas($data);
}
public function descuentosBD($udn){ 
    $sucess = $this->obj->eliminarDescuentos($udn);

    $data = $this->util->sql($this->filtrarDuplicados($_POST['descuentos']));
    if($sucess === true) return $this->obj->insertDescuentos($data);
}
public function impuestosBD($udn){ 
    $sucess = $this->obj->eliminarImpuestos($udn);
    
    $data = $this->util->sql($this->filtrarDuplicados($_POST['impuestos']));
    if($sucess === true) return $this->obj->insertImpuestos($data);
}
public function efectivoBD($udn){ 
    $sucess = $this->obj->eliminarEfectivo($udn);

    $data = $this->util->sql($this->filtrarDuplicados($_POST['efectivo']));
    if($sucess === true) return $this->obj->insertEfectivo($data);
}
public function monedasBD($udn){
    $filtrado = $this->filtrarDuplicados($_POST['monedas']);

    $success = $this->obj->existeMoneda($udn);
    if( count($success) == 0 ) return $this->obj->insertMoneda($this->util->sql($filtrado));
    else {
        $result = [];
        foreach ($success as $key => &$value) {
            foreach ($filtrado as $item) {
                if ($item['id_Moneda'] === $value['id_Moneda']) {
                    $result['update'][] = $this->obj->updateMoneda($this->util->sql($item,4));
                    unset($success[$key]);
                    break;
                } else {
                    $result['insert'][] = $this->obj->insertMoneda($this->util->sql($item));
                    break;
                }
            }
        }

        foreach ($success as  $value) {
            unset($value['id_Moneda']);
            $result['delete'][] = $this->obj->deleteMonedaByID($this->util->sql($value,1));
        }
        return $result;
    }
}
public function bancosBD($udn){
    $sucess = $this->obj->eliminarBancos($udn);

    $data = $this->util->sql($this->filtrarDuplicados($_POST['bancos']));
    if($sucess === true) return $this->obj->insertBancos($data);
}

// Archivo de ventas
public function insFileIncome(){
    $year  = date('Y');
    $month = date('m');
    $time  = date('H:m:s');
    $date  = new DateTime(date('Y-m-d'));
    $mes   = strftime('%B', $date->getTimestamp());
    $idE   = $this->c->getVar('idE');

    $udn   = [
        1  => 'QT',
        4  => 'BS',
        5  => 'SM',
        6  => 'FZ',
        7  => 'PM',
        8  => 'CO',
        10 => 'CH'
    ];

    $destino = "erp_files/finanzas/{$year}/{$month}.-{$mes}/".$udn[$idE]."/ventas/";
    
    $array = [
        'UDN_Sobre'     => $idE,
        'Fecha'         => $this->c->getVar('date1'),
        'Ruta'          => $destino,
        'Hora'          => $time,
        'Archivo'       => $_FILES['file']['name'],
        'Type_File'     => end(explode('.',$_FILES['file']['name'])),
        'Peso'          => ROUND(($_FILES['file']['size']/1024),4),
        'id_Area'       => 16,
        'clasificacion' => 'ING',
        'titulo'        => $_FILES['file']['name'],
    ];

    $exito = $this->obj->_Insert($this->util->sql($array),$this->obj->getFzas().'sobres');
    if($exito == true) return $this->util->upload_file($_FILES['file'],'../../../'.$destino);
}

// BITACORA DE CCTV
public function dataCCTV(){
    $suite = $this->obj->_Select([
        'table'     => $this->obj->getFzas()."turno",
        'values'    => 'IFNULL(SUM(suite),0) AS suite',
        'where'     => 'fecha_turno',
        'data'      => [$_POST['date']]
    ])[0]['suite'];

    $cctv = $this->obj->_Select([
        'table'     => $this->obj->getFzas()."suite",
        'values'    => 'CONCAT(rutaBitacora,nameBitacora) as file',
        'where'     => 'fechaSuite,id_UDN',
        'data'      => [$_POST['date'],1]
    ])[0]['file'];

    $file = isset($cctv) ?  '../../'.$cctv : null;

    return ['file'=>$file,'suite' => $suite];
}//CONSULTAS POR RANGOS DE FECHA
function tbVentas(){
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');
    $dates = $this->util->intervalDates($date1,$date2);

    return [
        'ventas'     => $this->listIngresosDate($idE,$date1,$date2,$dates),
        'descuentos' => $this->listDescuentosDate($idE,$date1,$date2,$dates),
        'impuestos'  => $this->listImpuestosDate($idE,$date1,$date2,$dates),
        'efectivo'   => $this->listEfectivoDate($idE,$date1,$date2,$dates),
        'moneda'     => $this->listMonedaDate($idE,$date1,$date2,$dates),
        'banco'      => $this->listBancoDate($idE,$date1,$date2,$dates),
        'clientes'   => $this->listClientesDate($idE,$date1,$date2,$dates),
        'thDate'     => $dates['thead']
    ];
}
function listIngresosDate($idE,$date1,$date2,$dates){
    $result         = [];
    $sql            = $this->obj->lsVentas([$idE]);
    $granTotal      = 0;
    $granTotalDates = [];
    foreach ($sql as $i => $val) {
        $idUV      = $val['idUV'];
        $total     = 0;
        $totalDate = [];
        foreach($dates['dates'] AS $key => $value) {
            $ventaDia              = $this->obj->ventasDia([$idUV,$value]);
            $totalDate[]           = floatval($ventaDia);
            $total                += $ventaDia;
            $granTotalDates[$key] += $ventaDia;
        }

        $granTotal += $total;

        $result['list'][] = [
            'id'        => $idUV,
            'name'      => $val['Name_Venta'],
            'total'     => $total,
            'totalDate' => $totalDate
        ];
    }
    $result['granTotal']     = $granTotal;
    $result['granTotalDate'] = $granTotalDates;

    return $result;
}
function listDescuentosDate($idE,$date1,$date2,$dates) {
    $result         = [];
    $sql            = $this->obj->lsDescuentos([$idE]);
    $granTotal      = 0;
    $granTotalDates = [];
    foreach ($sql as $i => $val) {
        $idUD      = $val['idUD'];
        $total     = 0;
        $totalDate = [];

        foreach($dates['dates'] AS $key => $value) {
            $cant                  = $this->obj->descuentosDia([$idUD,$value]);
            $totalDate[]           = floatval($cant);
            $total                += $cant;
            $granTotalDates[$key] += $cant;
        }

        $granTotal += $total;

        $result['list'][] = [
            'id'        => $idUD,
            'name'      => $val['Name_Descuentos'],
            'total'     => $total,
            'totalDate' => $totalDate
        ];
    }
    
    $result['granTotal'] = $granTotal;
    $result['granTotalDate'] = $granTotalDates;

    return $result;
}
function listImpuestosDate($idE,$date1,$date2,$dates) {
    $result         = [];
    $sql            = $this->obj->lsImpuestos([$idE]);
    $granTotal      = 0;
    $granTotalDates = [];
    foreach ($sql as $i => $val) {
        $idUD      = $val['idUI'];
        $total     = 0;
        $totalDate = [];

        foreach($dates['dates'] AS $key => $value) {
            $cant                  = $this->obj->impuestosDia([$idUD,$value]);
            $totalDate[]           = floatval($cant);
            $total                += $cant;
            $granTotalDates[$key] += $cant;
        }

        $granTotal += $total;

        $result['list'][] = [
            'id'        => $idUD,
            'name'      => $val['Porcentaje'],
            'total'     => $total,
            'totalDate' => $totalDate
        ];
    }
    
    $result['granTotal'] = $granTotal;
    $result['granTotalDate'] = $granTotalDates;

    return $result;
}
function listEfectivoDate($idE,$date1,$date2,$dates) {
    $result         = [];
    $sqlEfectivos   = $this->obj->lsEfectivo([$idE]);
    $granTotal      = 0;
    $granTotalDates = [];

    
    // Encontrar índices
    $indexComision = array_search('Comisión', array_column($sqlEfectivos, 'valor'));
    $indexDescuento = array_search('Descuento destajo', array_column($sqlEfectivos, 'valor'));

    // Intercambiar si existen
    if ($indexComision !== false && $indexDescuento !== false) {
        [$sqlEfectivos[$indexComision], $sqlEfectivos[$indexDescuento]] = [$sqlEfectivos[$indexDescuento], $sqlEfectivos[$indexComision]];
    }
    foreach ($sqlEfectivos as $i => $val) {
        $id      = $val['id'];
        $total     = 0;
        $totalDate = [];

        foreach($dates['dates'] AS $key => $value) {
            $cant         = $this->obj->valorEfectivoDia([$id,$idE,$value]);
            $totalDate[]  = floatval($cant);
            $total       += $cant;

            if( $id == 1 ) $granTotalDates[$key] -= $cant;
            else $granTotalDates[$key] += $cant;
        }

        $granTotal += $total;

        $result['list'][] = [
            'id'        => $id,
            'name'      => ($idE == 6 && $id == 1 ) ? 'Fichas de depósito' : $val['valor'],
            'total'     => $total,
            'totalDate' => $totalDate
        ];
    }
    
    $result['granTotal']     = $granTotal;
    $result['granTotalDate'] = $granTotalDates;

    return $result;
}
function listMonedaDate($idE,$date1,$date2,$dates) {
    $result         = [];
    $sql            = $this->obj->lsMonedasExtranjeras();
    $granTotal      = 0;
    $granTotalDates = [];
    foreach ($sql as $i => $val) {
        $id        = $val['id'];
        $total     = 0;
        $totalDate = [];

        foreach($dates['dates'] AS $key => $value) {
            $cant                  = $this->obj->valorMonedaDia([$id,$idE,$value]);
            $totalDate[]           = $cant;
            $total                += floatval($cant);
            $granTotalDates[$key] += floatval($cant);
        }

        $granTotal += $total;

        $result['list'][] = [
            'id'        => $id,
            'name'      => $val['valor'],
            'total'     => $total,
            'totalDate' => $totalDate
        ];
    }
    
    $result['granTotal'] = $granTotal;
    $result['granTotalDate'] = $granTotalDates;

    return $result;
}
function listBancoDate($idE,$date1,$date2,$dates) {
    $result         = [];
    $sql            = $this->obj->lsBancos([1,$idE]);
    $granTotal      = 0;
    $granTotalDates = [];
    foreach ($sql as $i => $val) {
        $id        = $val['id'];
        $total     = 0;
        $totalDate = [];

        foreach($dates['dates'] AS $key => $value) {
            $cant                  = $this->obj->bancosDia([$id,$value]);
            $totalDate[]           = floatval($cant);
            $total                += $cant;
            $granTotalDates[$key] += $cant;
        }

        $granTotal += $total;

        $result['list'][] = [
            'id'        => $id,
            'name'      => $val['valor'],
            'total'     => $total,
            'totalDate' => $totalDate
        ];
    }
    
    $result['granTotal'] = $granTotal;
    $result['granTotalDate'] = $granTotalDates;

    return $result;
}
function listClientesDate($idE,$date1,$date2,$dates) {
    $result         = [];
    $granTotal      = 0;
    $granTotalDates = [];

    //CONSUMO
    $totalConsumo     = 0;
    $totalDateConsumo = [];

    foreach($dates['dates'] AS $key => $value) {
        $cant                    = $this->objC->debtUDN([$idE,$value],'=');
        $totalDateConsumo[$key]  = $cant;
        $totalConsumo           += $cant;
        $granTotalDates[$key]   += $cant;
    }
    
    //PAGOS
    $totalPagos     = 0;
    $totalDatePagos = [];

    foreach($dates['dates'] AS $key => $value) {
        $cant                    = $this->objC->payUDN([$idE,$value],'=');
        $totalPagos             += $cant['pago'];
        $totalDatePagos[]        = $cant['pago'];
        $totalConsumo           += $cant['consumo'];
        $totalDateConsumo[$key] += $cant['consumo'];
        $granTotalDates[$key]   += $cant['consumo'];
        $granTotalDates[$key]   -= $cant['pago'];
    }

    
    $result['list'][] = [
        'id'        => 'C',
        'name'      => 'Consumo de cliente',
        'total'     => $totalConsumo,
        'totalDate' => $totalDateConsumo
    ];
    
    $result['list'][] = [
        'id'        => 'P',
        'name'      => 'Pagos de cliente',
        'total'     => $totalPagos,
        'totalDate' => $totalDatePagos
    ];
    
    $granTotal = $totalConsumo - $totalPagos;
    
    $result['granTotal']     = $granTotal;
    $result['granTotalDate'] = $granTotalDates;

    return $result;
}
}
?>