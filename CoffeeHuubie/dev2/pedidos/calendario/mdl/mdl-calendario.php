<?php
require_once('../../mdl/mdl-pedidos.php');

/**
 * Modelo del Calendario de Pedidos
 * Hereda todos los métodos de MPedidos
 * Preparado para extensiones futuras específicas del calendario
 */
class MCalendarioPedidos extends MPedidos {
    
    public function __construct() {
        parent::__construct();
    }
    
    // Heredar todos los métodos de MPedidos
    // No se requieren métodos adicionales en esta fase
    // Esta clase está preparada para agregar funcionalidad específica del calendario en el futuro
}
?>
