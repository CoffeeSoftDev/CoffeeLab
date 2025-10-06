<?php
require_once('../mdl/mdl-turno.php');
require_once('../../conf/_Utileria.php');
class Turno extends MTurno{
      // INSTANCIAS
    private $c;
    private $util;

    public function __construct($conta) {
        $this->c    = $conta;
        $this->util = new Utileria();
    }
/** INIT */
public function init(){
    $idE  = $this->c->getVar('idE');

    return [
        'turnos'    => $this->lsTurnos(),
        'jefes'     => $this->lsJefes(),
        'ventas'    => $this->lsVentas([$idE]),
        'impuestos' => $this->lsImpuestos([$idE]),
        'bitacora'  => $this->listTurn(),
        'saldos'    => $this->listBalance()
    ];
}
public function changeFilter(){
    return [
        'bitacora'  => $this->listTurn(),
        'saldos'    => $this->listBalance()
    ];
}
public function listBalance(){
    $date  = $this->c->getVar('date1');

    $subtotal  = $this->sumaCantidad($date,'id_UV');
    $impuestos = $this->sumaCantidad($date,'id_UI');
    $total     = $subtotal + $impuestos;
    
    return [
        [
            'color' => 'info',
            'text'  => 'Subtotal del día',
            'valor' => $this->util->format_number($subtotal),
        ],
        [
            'color' => 'info',
            'text'  => 'Impuestos del día',
            'valor' => $this->util->format_number($impuestos),
        ],
        [
            'color' => 'info',
            'text'  => 'Total del día',
            'valor' => $this->util->format_number($total),
        ]
    ];
}
public function listTurn(){
    $date  = $this->c->getVar('date1');

    $tbody = [];
    $thead = 'JEFE DE TURNO,TURNO,SUITE,TOTAL,ELIMINAR';
    $sql = $this->lsBitacora([$date]);
    foreach ($sql as $key => $row) {
        $tbody [$key][] = ['html' => $row['jefe']];
        $tbody [$key][] = ['html' => $row['turno'] == 'N' ? 'NOCHE' : ($row['turno'] == 'M' ? 'MAÑANA' : 'TARDE'), "class" => 'text-center'];
        $tbody [$key][] = ['html' => $row['suite'], "class"=>"text-center"];
        $tbody [$key][] = ['html' => $this->util->format_number($row['total']),"class"=>'text-end'];
        $tbody [$key][] = ['html' => '<button class="btn btn-sm btn-outline-danger" onclick="turn.removeTurn('.$row['id'].')"><i class="icon-trash"></i></button>',"class"=>'text-center'];
    }
    return ['thead' => $thead,'tbody' => $tbody,'table'=>['id'=>'bitacora']];
}
/** ELIMINAR TURNO */
public function removeTurn(){
    $date = $this->c->getVar('date1');
    $success = $this->deleteTurnByID([$_POST['id']]);
    if($success === true){
        return $this->ingresosDia($date);
    }
    return ['success' => $success];
}
/** GUARDAR BITACORA */
public function saveBitacora(){
    $date = $this->c->getVar('date1');   

    $array = [
        'turno'       => $_POST['turno'],
        'id_Employed' => $_POST['id_Employed'],
        'fecha_turno' => $date,
    ];

    $_POST['id'] = $this->idTurnByArray($this->util->sql($array,3));
    if(!isset($_POST['id'])) return $this->saveTurn();
    else {
        $this->deleteTurnByID([$_POST['id']]);
        return $this->saveTurn();
    }
}
public function saveTurn(){
    $date  = $this->c->getVar('date1');
    $array = [
        'suite'       => $_POST['suite'],
        'turno'       => $_POST['turno'],
        'id_Employed' => $_POST['id_Employed'],
        'fecha_turno' => $date,
    ];

    $success = $this->insertTurn($this->util->sql($array));
    if($success === true){
        $idTurno  = $this->maxTurn();
        $success = $this->insertBitacora($this->iterarImpuestoVenta($idTurno));
        if( $success === true ) return $this->ingresosDia($date);
    }
}
public function iterarImpuestoVenta($idTurno) {
    $result = [];

    foreach ($_POST as $key => $value) {
        if ( !empty($value) ){
            $idUV       = null;
            $idUI       = null;

            if     (strpos($key, 'idUV_') === 0)  $idUV = explode('_', $key)[1];
            elseif (strpos($key, 'idUI_') === 0) $idUI  = explode('_', $key)[1];

            if($idUV !== null || $idUI !== null){
                $result[] = [
                    'id_UV'    => $idUV,
                    'id_UI'    => $idUI,
                    'cantidad' => $value,
                    'id_Turno'  => $idTurno
                ];
            }
        }
    }

    return $this->util->sql($result);
}
public function ingresosDia($date){
    // Comprobar la existencia de datos a la fecha solicitada
    $id   = $this->ingresosByDate($date);
    // Eliminarlos los datos para evitar dupllicidad de información.
    if(isset($id)) $this->deleteIngresos($date);
    // Obtener la sumatoria de las ventas e impuestos de todos los turnos
    $data = $this->sumTotalTurnByDate($date);
    
    $success1 = $this->insertVenta($this->util->sql($data['ventas']));
    $success2 = $this->insertImpuesto($this->util->sql($data['impuestos']));
    if($success1 === true && $success2 === true){
        return [
            'success' => true,
            'bitacora' => $this->listTurn(),
            'saldos'   => $this->listBalance(),
        ];
    }
}
}
?>