<?php
if (empty($_COOKIE["IDU"]))  require_once('../acceso/ctrl/ctrl-logout.php');
require_once('layout/head.php');
require_once('layout/script.php');
?>
<!-- CDN TAILWIND -->
<script src="https://cdn.tailwindcss.com"></script>

<body>
    <?php require_once('../layout/navbar.php'); ?>
    <main>
    <!-- 🎨 Estilos personalizados -->
    <style>
    .rating input:checked ~ label {
        color: #FBBF24;
    }

    .rating label:hover,
    .rating label:hover ~ label {
        color: #FCD34D;
    }

    .rating-blue input:checked ~ label {
         color: #FBBF24;
    }

    .rating-blue label:hover,
    .rating-blue label:hover ~ label {
         color: #FBBF24;
    }

    .not-started {
        background-color: #6E3630 !important;
        color: white !important;
    }

    .in-progress {
        background-color: #89632A !important;
        color: white !important;
    }

    .completed {
        background-color: #29553C !important;
        color: white !important;
    }

    .paused {
        background-color: #3A2372 !important;
        color: white !important;
    }

    .cancelled {
        background-color: #91242E !important;
        color: white !important;
    }

    /* .modal-body {
        padding: 0 !important;
        margin: 0 !important;   
    } */
    </style>

        <section id="sidebar"></section>
        <div id="main__content">

            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>calendarizacion</li>

                    <li class='breadcrumb-item fw-bold active'>Gestor de actividades</li>
                </ol>
            </nav>

            <div class="main-container h-screen" id="root"></div>
            <script src='src/js/app.js?t=<?php echo time(); ?>'></script>
            
         
        </div>
    </main>
</body>
</html>