<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="../src/img/logo/logo.ico" />
    <title>Calendario de Pedidos</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <!-- icons -->
    <link rel="stylesheet" href="../src/plugins/fontello/css/fontello.css" />
    <link rel="stylesheet" href="../src/css/style.css" />
    <link rel="stylesheet" href="../src/css/buttons.css" />
    <link rel="stylesheet" href="../src/css/colors.css" />
    <link rel="stylesheet" href="../src/plugins/sweetalert2/sweetalert2.min.css" />
    <script src="../src/plugins/sweetalert2/sweetalert2.all.min.js"></script>

    <!--BOOTBOX-->
    <script src="../src/plugins/jquery/jquery-3.7.0.js"></script>
    <script src="../src/plugins/moment.js"></script>
    
    <script src="../src/plugins/bootbox.min.js"></script>
    <script src="../src/js/complementos.js"></script>
    <script src="../src/js/plugins.js?t=<?php echo time(); ?>"></script>
    <script src="../src/js/coffeSoft.js?t=<?php echo time(); ?>"></script>

    <!-- datables -->
    <link rel="stylesheet" href="../src/plugins/datatables/1.13.6/css/dataTables.bootstrap5.min.css">

    <!-- datatables -->
    <script src="../src/plugins/datatables/datatables.min.js"></script>
    <script src="../src/plugins/datatables/dataTables.responsive.min.js"></script>
    <script src="../src/plugins/datatables/1.13.6/js/dataTables.bootstrap5.min.js"></script> 

    <!-- datarange picker -->
    <link rel="stylesheet" href="../src/plugins/daterangepicker/daterangepicker.css" />

    <link rel="stylesheet" href="../src/plugins/bootstrap-5/css/bootstrap.min.css" />
    <script src="../src/plugins/bootstrap-5/js/bootstrap.bundle.js"></script>

    <!--ANIMATE-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.0.0/animate.compat.css"/>
    
    <!-- rrule lib -->
    <script src='https://cdn.jsdelivr.net/npm/rrule@2.6.4/dist/es5/rrule.min.js'></script>
    
    <!-- FULL CALENDAR -->
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.14/index.global.min.js'></script>
    
    <!-- FULL CALENDAR LOCALE -->
    <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/moment@6.1.14/index.global.min.js'></script>
    
    <!-- the rrule-to-fullcalendar connector. must go AFTER the rrule lib -->
    <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/rrule@6.1.14/index.global.min.js'></script>

    <style>
        /* Estilos personalizados para FullCalendar - Tema Oscuro */
        .fc {
            background-color: #1F2A37;
            color: #fff;
        }

        .fc-button {
            background-color: #3B82F6 !important;
            border-color: #3B82F6 !important;
        }

        .fc-button:hover {
            background-color: #2563EB !important;
        }

        .fc-button:disabled {
            background-color: #1e3a8a !important;
            opacity: 0.6;
        }

        .fc-event {
            cursor: pointer;
            border-radius: 4px;
            padding: 2px 4px;
            font-size: 0.875rem;
        }

        .fc-event:hover {
            opacity: 0.8;
        }

        .fc-daygrid-day {
            background-color: #1F2A37;
        }

        .fc-daygrid-day:hover {
            background-color: #374151;
        }

        .fc-day-today {
            background-color: #1e3a8a !important;
        }

        .fc-col-header-cell {
            background-color: #111827;
            color: #9CA3AF;
        }

        .fc-scrollgrid {
            border-color: #374151 !important;
        }

        .fc-theme-standard td, 
        .fc-theme-standard th {
            border-color: #374151;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .fc-toolbar {
                flex-direction: column;
                gap: 10px;
            }
            
            .fc-event {
                font-size: 0.75rem;
            }

            .fc-toolbar-title {
                font-size: 1.2rem;
            }
        }
    </style>

</head>

<body data-bs-theme="dark">
    <?php
        require_once("../layout/navbar.php");
        require_once("../layout/sidebar.php");
    ?>
    <div id="mainContainer2"
        class="w-full h-[calc(100vh)] transition-all duration-500 bg-[#111928] text-white ">
        <div style="background-color:#111827;" id="root">

        </div>
    </div>

    <!-- Data range picker -->
    <script src="../src/plugins/daterangepicker/moment.min.js"></script>
    <script src="../src/plugins/daterangepicker/daterangepicker.js"></script>

    <!-- Calendario de Pedidos -->
    <script src="src/js/calendarioPedidos.js?t=<?php echo time(); ?>"></script>

</body>

</html>
