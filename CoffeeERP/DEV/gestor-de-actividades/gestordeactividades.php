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
            .rating input:checked~label {
                color: #FBBF24;
            }

            .rating label:hover,
            .rating label:hover~label {
                color: #FCD34D;
            }

            .rating-blue input:checked~label {
                color: #FBBF24;
            }

            .rating-blue label:hover,
            .rating-blue label:hover~label {
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

            /* 🌌 Estilo base del Swal */
            .swal-top {
                border-radius: 1rem !important;
                background: linear-gradient(135deg, #ffffff, #f8f9fa);
                font-family: 'Poppins', sans-serif;
                box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
            }

            /* 🪄 Contenedor de la varita */
            .wand-container {
                position: relative;
                width: 40px;
                height: 40px;
            }

            /* Animación de agitación mágica */
            .wand {
                display: inline-block;
                animation: waveWand 1s ease-in-out infinite;
                transform-origin: bottom right;
            }

            @keyframes waveWand {
                0% {
                    transform: rotate(0deg);
                }

                25% {
                    transform: rotate(15deg);
                }

                50% {
                    transform: rotate(-10deg);
                }

                75% {
                    transform: rotate(12deg);
                }

                100% {
                    transform: rotate(0deg);
                }
            }

            /* ✨ Brillos que aparecen alrededor */
            .sparkles {
                position: absolute;
                top: 0;
                left: 20px;
                font-size: 1.2rem;
                opacity: 0;
                animation: sparklePulse 1s ease-in-out infinite;
            }

            @keyframes sparklePulse {

                0%,
                100% {
                    opacity: 0;
                    transform: scale(0.8) translateY(0px);
                }

                50% {
                    opacity: 1;
                    transform: scale(1.2) translateY(-6px);
                }
            }

            /* 🌌 CoffeeIA SweetAlert – Aurora Indigo Final */
            .swal-coffee {
                border-radius: 1.2rem !important;
                background: linear-gradient(145deg, #1E3A8A, #7E22CE, #9333EA);
                background-size: 200% 200%;
                color: #fff;
                font-family: 'Poppins', sans-serif;
                box-shadow: 0 0 35px rgba(147, 51, 234, 0.3), 0 0 60px rgba(59, 130, 246, 0.3);
                animation: auroraShift 6s ease infinite;
            }

            @keyframes auroraShift {
                0%   { background-position: 0% 50%; }
                50%  { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            /* ✨ Varita mágica – animación sutil y elegante */
            .wand-container {
                position: relative;
                width: 45px;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .wand {
                display: inline-block;
                animation: waveWand 1.3s ease-in-out infinite;
                transform-origin: bottom right;
                filter: drop-shadow(0 0 6px rgba(255,255,255,0.6));
            }

            @keyframes waveWand {
                0% { transform: rotate(0deg); }
                25% { transform: rotate(14deg); }
                50% { transform: rotate(-10deg); }
                75% { transform: rotate(12deg); }
                100% { transform: rotate(0deg); }
            }

            /* 🌠 Entrada / salida suave */
            .swal2-container {
                transition: opacity 0.25s ease-in-out;
            }
        </style>

        <section id="sidebar"></section>
        <div id="main__content">

            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>calendarizacion</li>

                    <li class='breadcrumb-item fw-bold active'>Gestor de actividades</li>
                </ol>
            </nav>

            <div class="main-container h-auto" id="root"></div>
            <script src='src/js/app.js?t=<?php echo time(); ?>'></script>
            
            <script src='src/js/gestordeactividades.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/gestordeactividades-asignados.js?t=<?php echo time(); ?>'></script>
        </div>
    </main>
</body>
</html>