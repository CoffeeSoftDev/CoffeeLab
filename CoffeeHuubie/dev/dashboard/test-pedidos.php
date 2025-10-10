<?php
session_start();

// ⚠️ CONFIGURACIÓN IMPORTANTE - Ajusta estos valores
$_SESSION['DB'] = 'fayxzvov_coffee';  // Cambia por tu base de datos
$SUBSIDIARIES_ID = 1;  // Cambia por tu ID de sucursal

require_once 'mdl/mdl-pedidos.php';

$mdl = new mdl();

echo "<h1>Test Dashboard Pedidos</h1>";
echo "<hr>";

// Test 1: Verificar sucursal
echo "<h2>1. Test Sucursal</h2>";
try {
    $sucursal = $mdl->getSucursalByID([$SUBSIDIARIES_ID]);
    echo "<pre>";
    print_r($sucursal);
    echo "</pre>";
} catch (Exception $e) {
    echo "<p style='color:red'>Error: " . $e->getMessage() . "</p>";
    $sucursal = ['idSucursal' => $SUBSIDIARIES_ID]; // Fallback
}

// Test 2: Total pedidos del mes actual
echo "<h2>2. Test Total Pedidos Mes Actual</h2>";
try {
    $mes = date('m');
    $anio = date('Y');
    $fi = sprintf("%04d-%02d-01", $anio, $mes);
    $ultimoDia = date("t");
    $ff = sprintf("%04d-%02d-%02d", $anio, $mes, $ultimoDia);
    
    echo "<p>Período: $fi a $ff</p>";
    
    $sucursal = $mdl->getSucursalByID([$_SESSION['SUB']]);
    $total = $mdl->getTotalPedidosMes([
        $sucursal['idSucursal'],
        $fi,
        $ff
    ]);
    
    echo "<pre>";
    print_r($total);
    echo "</pre>";
} catch (Exception $e) {
    echo "<p style='color:red'>Error: " . $e->getMessage() . "</p>";
}

// Test 3: Dinero entrante
echo "<h2>3. Test Dinero Entrante</h2>";
try {
    $dinero = $mdl->getDineroEntranteMes([
        $sucursal['idSucursal'],
        $fi,
        $ff
    ]);
    
    echo "<pre>";
    print_r($dinero);
    echo "</pre>";
} catch (Exception $e) {
    echo "<p style='color:red'>Error: " . $e->getMessage() . "</p>";
}

// Test 4: Ventas cerradas
echo "<h2>4. Test Ventas Cerradas</h2>";
try {
    $ventas = $mdl->getVentasCerradasMes([
        $sucursal['idSucursal'],
        $fi,
        $ff
    ]);
    
    echo "<pre>";
    print_r($ventas);
    echo "</pre>";
} catch (Exception $e) {
    echo "<p style='color:red'>Error: " . $e->getMessage() . "</p>";
}

// Test 5: Cancelaciones
echo "<h2>5. Test Cancelaciones</h2>";
try {
    $cancelaciones = $mdl->getCancelacionesMes([
        $sucursal['idSucursal'],
        $fi,
        $ff
    ]);
    
    echo "<pre>";
    print_r($cancelaciones);
    echo "</pre>";
} catch (Exception $e) {
    echo "<p style='color:red'>Error: " . $e->getMessage() . "</p>";
}

// Test 6: Desglose
echo "<h2>6. Test Desglose Estados</h2>";
try {
    $desglose = $mdl->getDesgloseEstadosMes([
        $sucursal['idSucursal'],
        $fi,
        $ff
    ]);
    
    echo "<pre>";
    print_r($desglose);
    echo "</pre>";
} catch (Exception $e) {
    echo "<p style='color:red'>Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><strong>Si ves datos arriba, las consultas funcionan correctamente.</strong></p>";
echo "<p>Si ves errores, revisa:</p>";
echo "<ul>";
echo "<li>Que la tabla `order` exista en tu base de datos</li>";
echo "<li>Que la tabla `order_payments` exista</li>";
echo "<li>Que \$_SESSION['DB'] y \$_SESSION['SUB'] estén configurados correctamente</li>";
echo "</ul>";
?>
