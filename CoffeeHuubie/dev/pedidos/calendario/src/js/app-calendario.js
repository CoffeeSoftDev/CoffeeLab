/**
 * Inicialización del módulo de Calendario de Pedidos
 */

// Variables globales
const link = "calendario/ctrl/ctrl-calendario.php";
const div_modulo = "root2";

// Instancia del calendario
let calendarioPedidos;

// Inicializar al cargar el documento
$(document).ready(function() {
    calendarioPedidos = new CalendarioPedidos(link, div_modulo);
    calendarioPedidos.init();
});
