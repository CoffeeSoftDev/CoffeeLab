<?php
date_default_timezone_set('America/Mexico_City');

require_once('_Sobres.php'); 
require_once('_Apertura.php');
require_once('_Conceptos.php');
require_once('_Ingresos.php');
require_once('_Clientes.php');
require_once('_Compras.php');
require_once('_Pagos.php');
require_once('_Proveedores.php');
require_once('_Archivos.php');
require_once('_Facturas.php');
require_once('_Caratula.php');
require_once('_Turnos.php');

class Contabilidad {
    private $sobres;
    private $apertura;
    private $conceptos;
    private $ingresos;
    private $clientes;
    private $compras;
    private $pagos;
    private $proveedores;
    private $archivos;
    private $facturas;
    private $caratula;
    private $turno;

    private $_var = [
        'idE'    => '',
        'date1'  => '',
        'date2'  => '',
        'filtro' => ''
    ];

    public function __construct() {
        $this->sobres      = new Sobres($this);
        $this->apertura    = new Apertura($this);
        $this->conceptos   = new Conceptos($this);
        $this->ingresos    = new Ingresos($this);
        $this->clientes    = new Clientes($this);
        $this->compras     = new Compras($this);
        $this->pagos       = new Pagos($this);
        $this->proveedores = new Proveedores($this);
        $this->archivos    = new Archivos($this);
        $this->facturas    = new Facturas($this);
        $this->caratula    = new Caratula($this);
        $this->turno       = new Turno($this);
    }

    public function __call($name, $arguments) {
        $instancias = [
            $this->sobres,
            $this->apertura,
            $this->conceptos,
            $this->ingresos,
            $this->clientes,
            $this->compras,
            $this->pagos,
            $this->proveedores,
            $this->archivos,
            $this->facturas,
            $this->caratula,
            $this->turno,
        ];
        foreach ($instancias as $obj) {
            if (method_exists($obj, $name)) {
                return call_user_func_array([$obj, $name], $arguments);
            }
        }
        throw new BadMethodCallException("El método {$name} no existe en ninguna de las clases contenidas.");
    }

    public function getVar($nombre = null) {
        return ($nombre == null) ? $this->_var : $this->_var[$nombre];
    }
    public function setVar($nombre, $valor) {
        $this->_var[$nombre] = $valor;
    }
}
?>