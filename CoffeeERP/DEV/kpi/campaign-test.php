<?php
// Incluir configuración de prueba
require_once('config-test.php');
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KPI Campañas - Test</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Chart.js para gráficos -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <style>
        .main-container {
            min-height: 500px;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
        }
        
        .nav-tabs .nav-link {
            color: #495057;
        }
        
        .nav-tabs .nav-link.active {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
        }
        
        .card {
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
            border: 1px solid rgba(0, 0, 0, 0.125);
        }
        
        .spinner-border {
            width: 3rem;
            height: 3rem;
        }
    </style>
</head>
<body>
    <div class="container-fluid mt-4">
        <nav aria-label='breadcrumb'>
            <ol class='breadcrumb'>
                <li class='breadcrumb-item text-uppercase text-muted'>KPI</li>
                <li class='breadcrumb-item fw-bold active'>Campañas (Test)</li>
            </ol>
        </nav>

        <div class="main-container" id="root">
            <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-3">Inicializando módulo de campañas...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Incluir Templates básico -->
    <script src='src/js/templates-basic.js?t=<?php echo time(); ?>'></script>
    
    <!-- Incluir el JavaScript del módulo -->
    <script src='src/js/kpi-campaign.js?t=<?php echo time(); ?>'></script>
    
    <script>
        // Función useFetch simplificada si no existe
        if (typeof useFetch === 'undefined') {
            window.useFetch = async function(options) {
                const formData = new FormData();
                for (const key in options.data) {
                    formData.append(key, options.data[key]);
                }
                
                const response = await fetch(options.url, {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            };
        }
        
        // Función alert simplificada si no existe
        if (typeof alert === 'undefined' || typeof alert !== 'function') {
            window.alert = function(options) {
                if (typeof options === 'string') {
                    window.alert(options);
                } else {
                    const message = options.text || options.message || 'Mensaje';
                    const title = options.title || 'Información';
                    
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: options.icon || 'info',
                            title: title,
                            text: message,
                            confirmButtonText: options.btn1Text || 'OK'
                        });
                    } else {
                        window.alert(`${title}: ${message}`);
                    }
                }
            };
        }
    </script>
</body>
</html>