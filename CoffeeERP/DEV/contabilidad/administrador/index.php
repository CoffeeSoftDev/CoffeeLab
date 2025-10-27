<?php
session_start();

// Validar sesión de usuario
if (!isset($_SESSION['usuario'])) {
    header('Location: ../../login.php');
    exit();
}
?>
<<<<<<< HEAD
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Módulo de Compras - Contabilidad</title>
    
    <!-- TailwindCSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- DataTables CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/dataTables.bootstrap5.min.css">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../../src/css/icons.css">
    
    <!-- SweetAlert2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    
    <!-- Select2 -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8f9fa;
        }
        
        .modal-backdrop {
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        .bootbox .modal-content {
            border-radius: 12px;
            border: none;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .bootbox .modal-header {
            background: linear-gradient(135deg, #103B60 0%, #1a5a8f 100%);
            color: white;
            border-radius: 12px 12px 0 0;
            padding: 1.5rem;
        }
        
        .bootbox .modal-title {
            font-weight: 600;
            font-size: 1.25rem;
        }
    </style>
</head>
=======

<!-- CoffeeSoft Framework -->
<script src="../../../../DEV/src/js/coffeeSoft.js"></script>
<script src="https://rawcdn.githack.com/SomxS/Grupo-Varoch/refs/heads/main/src/js/plugins.js"></script>
<script src="https://www.plugins.erp-varoch.com/ERP/JS/complementos.js"></script>

>>>>>>> ebba68b5452f35b0a4bbd1da087c1aa15b436806
<body>
    <div id="root" class="container-fluid p-4"></div>

<<<<<<< HEAD
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- DataTables -->
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap5.min.js"></script>
    
    <!-- Bootbox -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/6.0.0/bootbox.min.js"></script>
    
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Select2 -->
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    
    <!-- Moment.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/locale/es.min.js"></script>
    
    <!-- CoffeeSoft Framework -->
    <script src="../../src/js/coffeSoft.js"></script>
    <script src="../../src/js/plugins.js"></script>
    
    <!-- Módulo de Compras -->
    <script src="js/compras.js"></script>
=======
    <main>
        <section id="sidebar"></section>

        <div id="main__content">
            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>KPI</li>
                    <li class='breadcrumb-item fw-bold active'>Ventas</li>
                </ol>
            </nav>

          

            <div class=" main-container" id="root"></div>

          <!-- Módulos del Sistema -->
        <script src="js/admin.js?t=<?php echo time(); ?>"></script>
        <script src="js/cuenta-venta.js?t=<?php echo time(); ?>"></script>
        <script src="js/proveedores.js?t=<?php echo time(); ?>"></script>
        <script src="js/cliente.js?t=<?php echo time(); ?>"></script>
        <script src="js/formasPago.js?t=<?php echo time(); ?>"></script>
        <script src="js/cta.js?t=<?php echo time(); ?>"></script>
        <script src="js/efectivo.js?t=<?php echo time(); ?>"></script>
        <script src="js/moneda.js?t=<?php echo time(); ?>"></script>
        <script src="js/banco.js?t=<?php echo time(); ?>"></script>
        
        


        </div>
    </main>
>>>>>>> ebba68b5452f35b0a4bbd1da087c1aa15b436806
</body>
</html>
