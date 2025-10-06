<?php
setlocale(LC_TIME, 'es_ES.UTF-8');
require_once('../mdl/mdl-caratula.php');
require_once('../../conf/_Utileria.php');
class Caratula {
    private $totalVentas     = 0;
    private $totalDescuentos = 0;
    private $totalImpuestos  = 0;
    public function __construct($conta) {
        $this->c = $conta;
        $this->util = new Utileria();
        $this->obj = new MCaratula();
    }
public function caratula(){
    $idE   = $this->c->getVar('idE');
    $date1 = $this->c->getVar('date1');
    $date2 = $this->c->getVar('date2');

    $saldoFondo       = $this->fondo($idE,$date1,$date2);
    $saldoRetiros     = $this->retiros($idE,$date1,$date2);
    $saldoProveedores = $this->proveedores($idE,$date1,$date2);

    $saldos = array_merge($saldoFondo,$saldoRetiros,$saldoProveedores);

    return [
        'caja'        => $this->caja($idE,$date1,$date2),
        'saldo'       => $saldos,
        'ingreso'     => $this->ingresos($idE,$date1,$date2),
        'descuentos'  => $this->descuentos($idE,$date1,$date2),
        'impuestos'   => $this->impuestos($idE,$date1,$date2),
        'totales'     => $this->totales(),
        'bancos'      => $this->bancos($idE,$date1,$date2),
        'anticipos'   => $this->anticipos($idE,$date1,$date2),
        'gastosFondo' => $this->gastosFondo($idE,$date1,$date2),
        'almacen'     => $this->almacen($idE,$date1,$date2),
        'costos'      => $this->costos($idE,$date1,$date2),
        'creditos'    => $this->creditos($idE,$date1,$date2),
    ];
}
public function caja($idE,$date1,$date2){
    $cajas['Total de venta'] = '';

    $ventas     = $this->obj->totalVentas([$idE,$date1,$date2]);
    $descuentos = $this->obj->totalDescuentos([$idE,$date1,$date2]);
    $impuestos  = $this->obj->totalImpuestos([$idE,$date1,$date2]);
    $totalVenta = $ventas - $descuentos + $impuestos;

    // LISTA DE EFECTIVO/PROPINA
    $sqlEfectivos = $this->obj->lsEfectivo();
    $valorEfectivo = 0;
    foreach ($sqlEfectivos as $value) {
        $id    = $value['id'];
        $valor = $this->obj->valorEfectivo([$id,$idE,$date1,$date2]);

        $valorEfectivo += ($id == 1) ?  -$valor : +$valor;
        
        $stringValor = ($idE == 6 && $value['valor'] == 'Propina') ? 'Fichas de depósito' : $value['valor'];
        
        $stringValor = ($idE == 5 && $value['valor'] == 'Destajo') ? 'Comisión por Uber' : $value['valor'];
        
        $cajas[$stringValor] = $this->util->format_number($valor);
    }

    
    // LISTA DE MONEDAS EXTRANJERAS
    $sqlMonedas = $this->obj->lsMonedasExtranjeras();
    $valorMoneda = 0;
    foreach ($sqlMonedas as $value) {
        $id           = $value['id'];
        $cantidades   = $this->obj->valorMonedaExtranjera([$id,$idE,$date1,$date2]);
        $realCant     = isset($cantidades['Cantidad']) ? $cantidades['Cantidad'] : '-';
        $valorMoneda += $cantidades['mxnCantidad'];

        $cajas[$value['valor']] = $this->util->format_number($realCant);
    }


    // LISTA DE BANCOS
    $valorBancos     = $this->obj->valorTotalBancos([$idE,$date1,$date2]);
    $cajas['Bancos'] = $this->util->format_number($valorBancos);


    
    // LISTA DE CREDITOS DE CLIENTES
    $deuda               = $this->obj->totalDeudaCredito([$idE,$date1,$date2]);
    $pagos               = $this->obj->totalPagoCredito([$idE,$date1,$date2]);
    $valorCreditos       = $deuda - $pagos;
    $cajas['Créditos'][] = $this->util->format_number($deuda);
    $cajas['Créditos'][] = $this->util->format_number($pagos);
    $cajas['Créditos'][] = [$idE,$date1,$date2];

    // OBTENER LA DIFERENCIA
    $totalCaja = $valorEfectivo + $valorMoneda + $valorBancos + $valorCreditos;

    $diferencia              = $totalCaja - $totalVenta;
    $cajas['Total de venta'] = $this->util->format_number($totalVenta);
    $cajas['Diferencia']     = $this->util->format_number($diferencia);

    return $cajas;
}
function fondo($idE,$date1,$date2) {
    $result       = [];
    $sqlReembolso = $this->obj->retiro_venta([$idE,$date1]);
    foreach ($sqlReembolso as $reembolso);

    $fechaInicial = $reembolso['fechaInicial'];

    $siGastos     = $this->obj->sumatoria_gastos_fondo([$idE,$fechaInicial,$date1],'si');
    $siAnticipos  = $this->obj->sumatoria_anticipos([$idE,$fechaInicial,$date1],'si');
    $siProveedor  = $this->obj->sumatoria_pago_proveedor([$idE,$fechaInicial,$date1],'si');
    $saldoInicial = $reembolso['saldo_final'] - ($siGastos + $siAnticipos + $siProveedor);
    $reembolso    = $this->obj->reembolso([$idE,$date1,$date2]);
    $gastos       = $this->obj->sumatoria_gastos_fondo([$idE,$date1,$date2],'');
    $anticipos    = $this->obj->sumatoria_anticipos([$idE,$date1,$date2],'');
    $proveedor    = $this->obj->sumatoria_pago_proveedor([$idE,$date1,$date2],'');
    $egreso       = ($gastos + $anticipos + $proveedor);
    $saldoFinal   = $saldoInicial + $reembolso - $egreso;

    $result['FONDO'][]    = $this->util->format_number($saldoInicial);
    $result['FONDO'][]    = $this->util->format_number($reembolso);
    $result['FONDO'][]    = $this->util->format_number($egreso);
    $result['FONDO'][]    = $this->util->format_number($saldoFinal);
    $result['ANTICIPO']   = ['-','-'];
    $result['ANTICIPO'][] = $this->util->format_number($anticipos);
    $result['ANTICIPO'][] = $this->util->format_number($anticipos);

    return $result;
}
function retiros($idE,$date1,$date2){
    $result    = [];
    $sqlRetiros = $this->obj->retiro([$idE,$date1]);
    foreach ($sqlRetiros as $retiro);
    $fechaRetiro = $retiro['fechaRetiro'];
    $retiroTotal = $retiro['sfTotal'];
    // efectivo inicial
    $siPropina  = $this->obj->retiroEfectivo([$idE,1,$fechaRetiro,$date1],'si');
    $siEfectivo = $this->obj->retiroEfectivo([$idE,2,$fechaRetiro,$date1],'si');
    // efectivo actual
    $propina  = $this->obj->retiroEfectivo([$idE,1,$date1,$date2]);
    $efectivo = $this->obj->retiroEfectivo([$idE,2,$date1,$date2]);

    $valorSIMoneda = 0;
    $valorMoneda = 0;
    $sqlMonedas = $this->obj->lsMonedasExtranjeras();
    foreach ($sqlMonedas as $value) {
        $id = $value['id'];

        if ( $id != 3 ) {
            $siCantidades   = $this->obj->valorMonedaExtranjera([$id,$idE,$fechaRetiro,$date1],'si');
            $valorSIMoneda += $siCantidades['mxnCantidad'];

            $cantidades   = $this->obj->valorMonedaExtranjera([$id,$idE,$date1,$date2]);
            $valorMoneda += $cantidades['mxnCantidad'];
        }
    }

    
    $siRetiro       = $retiroTotal + ($siEfectivo - $siPropina) + $valorSIMoneda;
    $efectivoActual = ($efectivo - $propina) + $valorMoneda;
    $retiro         = $this->obj->retiroVenta([$idE,$date1,$date2]);
    $sfRetiro       = $siRetiro + $efectivoActual - $retiro;

    $result['RETIROS'][] = $this->util->format_number($siRetiro);
    $result['RETIROS'][] = $this->util->format_number($efectivoActual);
    $result['RETIROS'][] = $this->util->format_number($retiro);
    $result['RETIROS'][] = $this->util->format_number($sfRetiro);

    return $result;
}
function proveedores($idE,$date1,$date2){
    $result = [];

    $siProveedor = $this->obj->siProveedor([$idE,$date1],'si');
    $gasto       = $this->obj->sumaGastoProveedor([$idE,$date1,$date2]);
    $gastoIVA    = $this->obj->sumaGastoIVAProveedor([$idE,$date1,$date2]);
    $egreso      = $this->obj->sumaPagoProveedor([$idE,$date1,$date2]);
    $ingreso     = ($gasto + $gastoIVA);
    $sfProveedor = ($siProveedor + $ingreso) - $egreso;
    
    $result['PROVEEDORES'][] = $this->util->format_number($siProveedor);
    $result['PROVEEDORES'][] = $this->util->format_number($ingreso);
    $result['PROVEEDORES'][] = $this->util->format_number($egreso);
    $result['PROVEEDORES'][] = $this->util->format_number($sfProveedor);

    return $result;
}
function ingresos($idE,$date1,$date2){
    $result = [];
    $sql    = $this->obj->sumaVentas([$idE,$date1,$date2]);
    foreach ($sql as $value) {
        $this->totalVentas += $value['cantidad'];
        $result[$value['Name_Venta']] = $this->util->format_number($value['cantidad']);
    }
    
    return $result;
}
function descuentos($idE,$date1,$date2){
    $result = [];
    $sql    = $this->obj->sumaDescuentos([$idE,$date1,$date2]);
    
    foreach ($sql as $value){
        $this->totalDescuentos += $value['cantidad'];
        $result[$value['Name_Descuentos']] = $this->util->format_number($value['cantidad']);
    }

    return $result;
}
function impuestos($idE,$date1,$date2){
    $result = [];
    
    $sql = $this->obj->sumaImpuestos([$idE,$date1,$date2]);
    foreach ($sql as $value) {
        $this->totalImpuestos += $value['cantidad'];
        $result[$value['Porcentaje']] = $this->util->format_number($value['cantidad']);
    }

    return $result;
}
function totales(){
    $result = [];
    
    $subtotal = $this->totalVentas - $this->totalDescuentos;
    $total = $subtotal + $this->totalImpuestos;
    
    $result['Subtotal'] = $this->util->format_number($this->totalVentas);
    $result['Impuestos'] = $this->util->format_number($this->totalImpuestos);
    $result['Total'] = $this->util->format_number($total);
    
    return $result;
}
function bancos($idE,$date1,$date2){
    $result = [];

    $sql = $this->obj->sumaBancos([$idE,$date1,$date2]);
    foreach ($sql as $value) {
        $result[$value['Name_Bancos']] = $this->util->format_number($value['cantidad']);
    }

    return $result;
}
function anticipos($idE,$date1,$date2){
    $result = [];

    $sql = $this->obj->sumaAnticipos([$idE,$date1,$date2]);
    foreach ($sql as $value) {
        $result[$value['Nombres']] = $this->util->format_number($value['cantidad']);
    }

    return $result;
}
function gastosFondo($idE,$date1,$date2){
    $result = [];
    
    $result['tr1'][] = ['html'=>'CONCEPTO','rowspan'=>'2','class'=>'bg-thead text-center'];
    $result['tr1'][] = ['html'=>'COMPRAS','colspan'=>"2",'class'=>'bg-thead text-center'];
    $result['tr1'][] = ['html'=>'TOTAL','rowspan'=>'2','class'=>'bg-thead text-center'];
    $result['tr2'][] = ['html'=>'SUBTOTAL','class'=>'bg-thead text-center'];
    $result['tr2'][] = ['html'=>'IMPUESTO','class'=>'bg-thead text-center'];

    $sql = $this->obj->sumaComprasFondo([$idE,$date1,$date2]);
    foreach ($sql as $key => $val) {
        $total = $val['c1'] + $val['c2'];
        $result[$key][] = ['html'=>$val['valor']];
        $result[$key][] = ['html'=>$this->util->format_number($val['c1']),'class'=>'text-end'];
        $result[$key][] = ['html'=>$this->util->format_number($val['c2']),'class'=>'text-end'];
        $result[$key][] = ['html'=>$this->util->format_number($total),'class'=>'text-end'];
    }
    return $result;
}
function almacen($idE,$date1,$date2){
    $result = [];
    $result['tr1'][] = ['html'=>'CONCEPTO','rowspan'=>'2','class'=>'bg-thead text-center'];
    $result['tr1'][] = ['html'=>'ENTRADAS','colspan'=>"2",'class'=>'bg-thead text-center'];
    $result['tr1'][] = ['html'=>'SALIDAS','rowspan'=>'2','class'=>'bg-thead text-center'];
    $result['tr2'][] = ['html'=>'SUBTOTAL','class'=>'bg-thead text-center'];
    $result['tr2'][] = ['html'=>'IMPUESTO','class'=>'bg-thead text-center'];

    $sql = $this->obj->listAlmacen($idE,$date1,$date2);
    foreach ($sql as $key => $val) {
        $idUI = $val['idUI'];
        $sql2 = $this->obj->listInsumosAlmacen([$idUI,$date1,$date2]);
        foreach ($sql2 as $key2 => $value) {
            $result['1'.$key2][] = ['html'=>$value['valor']];
            $result['1'.$key2][] = ['html'=>$this->util->format_number($value['c1']),'class'=>'text-end'];
            $result['1'.$key2][] = ['html'=>$this->util->format_number($value['c2']),'class'=>'text-end'];
            $result['1'.$key2][] = ['html'=>$this->util->format_number($value['c3']),'class'=>'text-end'];
        }

        $subtotal       = $this->obj->subtotalAlmacen([$idUI,$date1,$date2]);
        $impuesto       = $this->obj->impuestosAlmacen([$idUI,$date1,$date2]);
        $pago           = $this->obj->pagosAlmacen([$idUI,$date1,$date2]);
        $result[$key][] = ['html'=>'Total '.$val['Name_IC']];
        $result[$key][] = ['html'=>$this->util->format_number($subtotal),'class'=>'text-end'];
        $result[$key][] = ['html'=>$this->util->format_number($impuesto),'class'=>'text-end'];
        $result[$key][] = ['html'=>$this->util->format_number($pago),'class'=>'text-end'];
    }

    return $result;
}
function costos($idE,$date1,$date2){
    $result = [];
    $result['tr1'][] = ['html'=>'CONCEPTO','rowspan'=>'2','class'=>'bg-thead text-center'];
    $result['tr1'][] = ['html'=>'COMPRAS','colspan'=>"2",'class'=>'bg-thead text-center'];
    $result['tr1'][] = ['html'=>'SALIDAS','class'=>'bg-thead text-center'];
    $result['tr2'][] = ['html'=>'SUBTOTAL','class'=>'bg-thead text-center'];
    $result['tr2'][] = ['html'=>'IMPUESTO','class'=>'bg-thead text-center'];
    $result['tr2'][] = ['html'=>'ALMACEN','class'=>'bg-thead text-center'];

    $sql = $this->obj->listCostos([$idE,$date1,$date2]);
    foreach ($sql as $key => $val) {
        $idUI           = $val['idUI'];
        $subtotal       = $this->obj->subtotalCosto([$idUI,$date1,$date2]);
        $impuesto       = $this->obj->impuestosCosto([$idUI,$date1,$date2]);
        $pago           = $this->obj->pagosAlmacen([$idUI,$date1,$date2]);
        $result[$key][] = ['html'=>$val['Name_IC']];
        $result[$key][] = ['html'=>$this->util->format_number($subtotal),'class'=>'text-end'];
        $result[$key][] = ['html'=>$this->util->format_number($impuesto),'class'=>'text-end'];
        $result[$key][] = ['html'=>$this->util->format_number($pago),'class'=>'text-end'];
    }

    return $result;
}
function creditos($idE,$date1,$date2){
    $result          = [];
    $result['tr1'][] = ['html' => 'CONCEPTO', 'class' => 'bg-thead text-center'];
    $result['tr1'][] = ['html' => 'CONSUMO', 'class' => 'bg-thead text-center'];
    $result['tr1'][] = ['html' => 'PAGOS', 'class' => 'bg-thead text-center'];
    $result['tr1'][] = ['html' => 'TOTAL', 'class' => 'bg-thead text-center'];

    $sql = $this->obj->listCreditos([$idE]);
    foreach ($sql as $key => $val) {
        $idUC    = $val['idUC'];
        $consumo = $this->obj->consumoCreditos([$idUC,$date1,$date2]);
        $pago    = $this->obj->pagoCreditos([$idUC,$date1,$date2]);
        $total1  = $this->obj->consumoCreditos([$idUC,$date2],"si");
        $total2  = $this->obj->pagoCreditos([$idUC,$date2],"si");
        $total   = $total1 - $total2;

        if(intval($total) != 0) {
            $result[$key][] = ['html'=>$val['Name_Credito']];
            $result[$key][] = ['html'=>$this->util->format_number($consumo),'class'=>'text-end'];
            $result[$key][] = ['html'=>$this->util->format_number($pago),'class'=>'text-end'];
            $result[$key][] = ['html'=>$this->util->format_number($total),'class'=>'text-end'];
        }
    }

    return $result;
}
}
?>