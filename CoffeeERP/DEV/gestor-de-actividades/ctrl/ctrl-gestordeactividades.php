<?php
if (empty($_POST['opc'])) exit(0);
header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

setlocale(LC_TIME, 'es_MX.UTF-8', 'spanish'); 
date_default_timezone_set('America/Mexico_City');

require_once(__DIR__ . '/../../conf/coffeSoft.php');
require_once(__DIR__ . '/../../conf/_Utileria.php');
require_once(__DIR__ . '/../../conf/_Message.php');
require_once '../mdl/mdl-gestordeactividades.php';

// sustituir 'mdl' extends de acuerdo al nombre que tiene el modelo
$encode = [];
class ctrl extends Gestordeactividades{
    public $util;

    public function __construct() {
        parent::__construct();
        $this->util = new Utileria();
    }

    public function init() {
        $lsUDN = $this-> lsUDN();
        
        $udnZero = ["id" => "0", "valor" => "TODAS LAS UDN"];
        array_unshift($lsUDN, $udnZero);

        // 📌 Lista de meses: mes actual y 6 meses atrás
        $meses = [];
        $meses[] = [
            'id'    => 0,
            'valor' => "Todo el año"
        ];

        for ($i = 0; $i < 7; $i++) {
            $timestamp = strtotime("-$i month"); 
            $meses[] = [
                'id'    => date("n", $timestamp), // número de mes (1-12)
                'valor' => strftime("%B %Y", $timestamp) // nombre del mes en español
            ];
        }

        return[
            'udn'      => $lsUDN,
            'udnForm'  => $this->lsUDN(),
            'estados'  => $this->lsStatus(),
            'priority' => $this->lsPriority(),
            'meses'    => $meses
        ];
    }

    public function getListEmployed() {
        return [ 'employeds' => $this -> lsEmployed([$_POST['udn']]) ];
    }

    // Evaluation
    public function getEvaluation() {
        $status      = 500;
        $message     = 'Error al obtener los datos.';
        $ls          = $this->lsActivities([$_POST['idActivity']]);
        $lsQuestions = $this->lsQuestions();

        if ($ls && $lsQuestions) {
            $status  = 200;
            $message = 'Datos obtenidos correctamente.';
        }

        $data = [
            'idResponsible'   => $ls['id_employed'],
            'nameResponsible' => $ls['nameResponsible'],
            'src'             => $ls['src'],
            'activity'        => $ls['title'] ?? $ls['activities'],
            'idCreator'       => $ls['id_user_creator'],
            'phone'           => $ls['phone'],
            'questions'       => $lsQuestions,
        ];

        if ($ls['src'] != '' && $ls['src'] != null) {
            $data['src'] = "https://www.erp-varoch.com/" . $ls['src'];
        } else {
            $data['src'] = "https://www.erp-varoch.com/DEV/src/img/user.png";
        }
        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data,
        ];  
    }

    public function addRating() {
        $ratings = $_POST['rating'];
        $phone = $_POST['phone'];
        $activity = $_POST['activity'];
        unset($_POST['rating']);
        unset($_POST['phone']);
        unset($_POST['activity']);
        $status  = 500;
        $message = 'Error al crear la evaluación';
        $msg    = new Message();

        $create  = $this->createRating($this->util->sql($_POST));

        if ($create == true) {
            $max = $this->maxRating();
            $message   = 'Error al agregar respuestas.';

            // Crear array para inserción múltiple
            $calificaciones = [];
            foreach ($ratings as $rating) {
                $calificaciones[] = [
                    'ga_questions_id' => $rating['id'],
                    'answered'        => $rating['rating'],
                    'ga_ratings_id'   => $max
                ];
            }

            $addRatings = $this->createAnsweredRating($this->util->sql($calificaciones));
            
            if ($addRatings) {
                $status  = 200;
                $message = 'Evaluación creada correctamente 🌟';
            }
           
            $msg->whatsapp(
                // "9625291311",
                $phone,
                "¡Hola! 🤗\n\n".
                "📧⭐ Tienes una nueva EVALUACIÓN de la actividad: {$activity}.\n\n" .
                "¿Alguna duda? 🤔\nVisita la página: https://www.erp-varoch.com/ERP24/gestor-de-actividades/gestordeactividades.php"
            );        
        }
        return [
            'status'  => $status,
            'message' => $message,
        ];  
    }

    public function getEvaluationsGeneral() {
        $status      = 500;
        $message     = 'Error al obtener los datos.';
        $data        = [];

        $employed            = $this->employedByUser([$_COOKIE['IDU']]);
        $ownTaskFinished     = $this->getMyCompletedTasks([$employed['id']]);
        $createdTaskFinished = $this->getCreatedCompletedTasks([$employed['id']]);

        $total       = 0;
        $sum         = 0;
        $distribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
        $lastUpdate  = null;

        $evaluadas = [];
        $recibidas = [];
        $pendientes = [];

        // 🔹 Recibidas: tareas que YO terminé y otros evaluaron
        foreach ($ownTaskFinished as $actividad) {
            $calificaciones = $this->getRatingsByActivityId([$actividad['id']]);
            foreach ($calificaciones as $calificacion) {
                $total++;
                $sum += $calificacion['average'];

                // 🔹 Redondear el promedio al entero más cercano para ubicarlo en 1..5
                $rating = (int) round($calificacion['average']);
                if ($rating >= 1 && $rating <= 5) {
                    $distribution[$rating]++;
                }
                if ($lastUpdate == null || $actividad['date_finished'] > $lastUpdate) {
                    $lastUpdate = $actividad['date_finished'];
                }

                $recibidas[] = [
                    'id'        => $actividad['id'],
                    'taskTitle' => $actividad['title'] ?? $actividad['activities'],
                    'reviewer'  => ($actividad['FullName'] . ' ' . $actividad['APaterno']) ?? 'N/A',
                    'rating'    => $calificacion['average'],
                    'comment' => $calificacion['feedback'] 
                        ? '"' . $calificacion['feedback'] . '"' 
                        : '',
                    'date'      => $actividad['date_finished'],
                    'department'=> $actividad['Abreviatura'] ?? '',
                ];
            }
        }

        // 🔹 Evaluadas / Pendientes: tareas que YO creé y tengo que evaluar
        foreach ($createdTaskFinished as $actividad) {
            if ($actividad['id_priority'] == 1) {
                $actividad['priority'] = 'Alta';
            } elseif ($actividad['id_priority'] == 2) {
                $actividad['priority'] = 'Media';
            } else {
                $actividad['priority'] = 'Baja';
            }
            $calificaciones = $this->getRatingsByActivityId([$actividad['id']]);
            if (count($calificaciones) > 0) {
                foreach ($calificaciones as $calificacion) {
                    $evaluadas[] = [
                        'id'        => $actividad['id'],
                        'taskTitle' => $actividad['title'] ?? $actividad['activities'],
                        'reviewer'  => ($actividad['FullName'] . ' ' . $actividad['APaterno']) ?? 'N/A',
                        'rating'    => $calificacion['average'],
                        'comment' => $calificacion['feedback'] 
                            ? '"' . $calificacion['feedback'] . '"' 
                            : '',
                        'date'      => $actividad['date_finished'],
                        'department'=> $actividad['Abreviatura'] ?? '',
                    ];
                }
            } else {
                // Si no tiene calificaciones => pendiente
                // Verifica que no sea una autoevaluación
                if ($actividad['id_employed'] != $actividad['id_user_creator']) {
                    $pendientes[] = [
                        'id'            => $actividad['id'],
                        'taskTitle'     => $actividad['title'] ?? $actividad['activities'],
                        'assignee'      => ($actividad['FullName'] . ' ' . $actividad['APaterno']) ?? 'N/A',
                        'completedDate' => $actividad['date_finished'],
                        'department'    => $actividad['Abreviatura'] ?? '',
                        'priority'      => $actividad['priority'] ?? 'Normal',
                    ];
                }
             
            }
        }

        // 🔹 Promedio general
        $average = $total > 0 ? round($sum / $total, 1) : 0;
        $promedio = [
            'average'      => $average,
            'total'        => $total,
            'distribution' => $distribution,
            'last_update'  => $lastUpdate ? date("d/m/Y", strtotime($lastUpdate)) : null,
        ];

        $status  = 200;
        $message = 'Datos obtenidos correctamente.';
        $data    = [
            'promedio'  => $promedio,
            'evaluadas' => $evaluadas,
            'recibidas' => $recibidas,
            'pendientes'=> $pendientes,
        ];

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data,
        ];
    }
    
    

    // CRUD Task 
    public function getActivity() {
        $status  = 500;
        $message = 'Error al obtener los datos.';

        $ls = $this->lsActivity([$_POST['id']]);
        if ($ls) {
            $status  = 200;
            $message = 'Datos obtenidos correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $ls,
        ];  
    }

    public function addTask() {
        $userCreator              = $this->employedByUser([$_COOKIE['IDU']]);
        $_POST['date_creation']   = date('Y-m-d H:i:s');
        $_POST['date_start']      = $this->util->formatDate($_POST['date_start']);
        $_POST['date_follow']     = $this->util->formatDate($_POST['date_follow']);
        $_POST['date_end']        = $this->util->formatDate($_POST['date_end']);
        $_POST['id_user_creator'] = $userCreator['id'];


        // get data 
        $employed    = $this->getEmployedByID([$_POST['id_employed']]);
     

         $ok = $this -> MessageWhatsApp([

            'phone'      => $employed['Telefono_Movil'],
            // 'phone'      => 9621501886,
            'name'       => $employed['FullName'],
            'assign'     => $userCreator['FullName'],
            'activities' => $_POST['title'],
            'noActivity' => 1

        ]);
    

        return [
            "success" => $this->newTask($this->util->sql($_POST)),
            $userCreator,
            $_POST
        ];
     

    }

    public function getTask() {
        return $this->getTaskByID([$_POST['id']]);
    }

    public function editTask() {
        $_POST['date_start']  = $this->util->formatDate($_POST['date_start'],'database');
        $_POST['date_follow'] = $this->util->formatDate($_POST['date_follow'],'database');
        $_POST['date_end']    = $this->util->formatDate($_POST['date_end'],'database');
        // return $this->util->sql($_POST,1);
        return ["success" => $this->updateTask($this->util->sql($_POST,1))];
    }

    function statusTasks() {
        if ($_POST['id_status'] == 4) {
            $update  = $this->updateTask($this->util->sql([
                'date_finished' => date('Y-m-d H:i:s'),
                'idActivity'    => $_POST['idActivity'],
            ], 1));
        }

        return ["success" => $this->statusTask($this->util->sql($_POST,1))];
    }
    
    public function lsTasks() {
        $now = date("Y-m-d");
        $__row = [];

        // 
        $userCreator = $this->employedByUser([$_COOKIE['IDU']]);
    
        // 🔹 Obtener tareas sin orden prioritario todavía
        $ls = $this->listTask($_POST, $userCreator['id']);
    
        $conAvance = [];
        $sinAvance = [];
        
        // Clasificamos primero
        foreach ($ls as $item) {
            $ultimo = $this->getLastAdvance([$item['id']]);
            if ($ultimo && $ultimo['date_advance']) {
                $item['__ultimo_avance'] = $ultimo['date_advance'];
                $conAvance[] = $item;
            } else {
                $item['__ultimo_avance'] = null;
                $sinAvance[] = $item;
            }
        }
        
        // Ordenar solo los que tienen avances
        usort($conAvance, function ($a, $b) {
            return strtotime($b['__ultimo_avance']) <=> strtotime($a['__ultimo_avance']);
        });
        
        // Reunimos los dos arreglos
        $ls = array_merge($conAvance, $sinAvance);
    
        foreach ($ls as $key) {
            $userResponsible     = $this->getEmployedByID([$key['id_employed']]);
            $date_advance        = formatSpanishDate($key['date_follow']);
            $lastAdvance         = $this->getLastAdvance([$key['id']]);
            $numeroAvanceNoleido = $this->getCountAdvanceNotSeen([$key['id'], $userResponsible['idUser']]);
            $rating              = $this->hasRatingByActivityId([$key['id']]); // Retorna true o false 
    
            $iconoCampana = '';
            if ($numeroAvanceNoleido > 0) {
                $iconoCampana = "
                    <div class='relative inline-block ms-2'>
                        <i class='icon-bell-alt text-[#F0B200] text-lg pointer' onclick=\"gestor.advanceModal({$key['id']},'{$userCreator['idUser']}', '{$userResponsible['idUser']}')\"></i>
                        <span class='absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-full leading-tight'>
                            {$numeroAvanceNoleido}
                        </span>
                    </div>";
            }
    
            $advance = $lastAdvance['date_advance']
                ? strftime("%d/%b/%y", strtotime($lastAdvance['date_advance'])) . $iconoCampana
                : "<span class='text-gray-500'>Sin avances</span>";

            $activity = !empty($key['title']) ? $key['title'] : $key['activities'];

            $date_seen = $key['date_seen'] ? strftime("%d/%b/%y", strtotime($key['date_seen'])) :"<span class='text-gray-500'>Sin ver</span>";

            $fechas = $this->dateAnalitycs($key['date_start'], $key['date_end'], $key['id_status']);

            $principal = [
                'id'               => $key['id'],
                'Fecha Inicio'    => $fechas['start'],
                'Fecha Fin'       => $fechas['end'],
                'prioridad'       => ['html'=>getPriority($key['id_priority']),'class'=>'text-start ps-3 bg-white'],
                'actividad'       => $activity,
                'Encargado'       => ['html'  => $userResponsible['FullName']. ' ' . $userResponsible['APaterno'], 'class' => 'text-xs bg-white'],
                'UDN'        => $key['Abreviatura'],
                'Ult. Avance'     => $advance,
                'Fecha visto'     => $date_seen,
                'Dias acomulados' => getAccumulatedDays($key['date_start'], $now),
                'estado'          => getEstatus($key['id_status']),
                
            ];
    
            $admin = ['dropdown' => lsDropdown(
                $key['id_status'],
                $key['id'],
                $key['id_user_creator'],
                $key['id_employed'],
                $userCreator['idUser'],
                $userResponsible['idUser'],
                $rating  
            )];
    
            $__row[] = array_merge($principal, $admin);
        }
    
        return ["row" => $__row, $userCreator['id'],'ID'=>$_COOKIE['IDU']];
        
    }

    function getCalendario() {
        $event = [];
        $fecha = $_POST['fechita'] ?? 'fecha_final'; 
        unset($_POST['fechita']);
        $userCreator = $this->employedByUser([$_COOKIE['IDU']]);
        $getTasks = $this->listTask($_POST, $userCreator['id']);

        foreach ($getTasks as $key) {

            // 🎨 Asignar color por estatus
            $color = '';
            if     ($key['id_udn'] == 1) $color = "#FAD4D4"; // QT - Rosa claro
            elseif ($key['id_udn'] == 4) $color = "#D5F2E3"; // BS - Verde menta
            elseif ($key['id_udn'] == 5) $color = "#FDEAB9"; // SM - Rojo pálido
            elseif ($key['id_udn'] == 6) $color = "#EDE7E3"; // FZ - Beige grisáceo
            elseif ($key['id_udn'] == 7) $color = "#F9ECE2"; // PM - Durazno claro
            elseif ($key['id_udn'] == 8) $color = "#D6E8F5"; // CO - Azul cielo pálido


            if (($key['id_status'] == 1 || $key['id_status'] == 2) && (date('Y-m-d', strtotime($key['date_end'])) < date('Y-m-d'))) {
                $nameStatus = 'ATRASADO';
                $idstatus = '6'; // Asignar estado de vencido
            } else {
                $nameStatus = $key['name_status'];
                $idstatus = $key['id_status'];
            }

            // Determinar la fecha de inicio y fin según el valor de 'fechita'
            $start = '';    
            $end = '';
            if ($fecha == 'fecha_final') {
                $start = date('Y-m-d', strtotime($key['date_end']));
                $end = date('Y-m-d', strtotime($key['date_end']. ' + 1 days'));
            } else if ($fecha == 'fecha_inicio') {
                $start = date('Y-m-d', strtotime($key['date_start']));
                $end = date('Y-m-d', strtotime($key['date_start']. ' + 1 days'));
            } else if ($fecha == 'fecha_termino') {
                $start = date('Y-m-d', strtotime($key['date_finished']));
                $end = date('Y-m-d', strtotime($key['date_finished']. ' + 1 days'));
            } else {
                // Por defecto, usar fecha de finalización
                $start = date('Y-m-d', strtotime($key['date_end']));
                $end = date('Y-m-d', strtotime($key['date_end']. ' + 1 days'));
            }

            $event[] = [
                'id'        => $key['id'],
                'title'     => !empty($key['title']) ? $key['title'] : $key['activities'],
                'start'     => $start,
                'end'       => $end,
                'status'    => $nameStatus,
                'idstatus'  => $idstatus,
                'location'  => $key['Abreviatura'],
                'udn'       => $key['UDN'],
                'client'    => $key['Nombres'],
                'priority'  => $key['priority'],
                'color'     => $color,
                'textColor' => '#000000',
            ];
        }

        return $event;
    }



    // CRUD Reminder
    public function lsReminder() {
        $__row = [];

        $ls    = $this->listReminder([
            'udn'      => $_POST['udnReminder'],
            'reminder' => $_POST['cbUDNReminder']
        ]);

        // fecha de avance 
        foreach ($ls as $key) {
            $a   = [];
            
            $a[] = [
                "class"   => 'btn btn-sm btn-outline-success me-1',
                "html"    => '<i class="icon-whatsapp"></i>',
                "onclick" => 'gestor.sendIndividualRecorder('.$key['id'].')',
            ];
            $fechas = $this->dateAnalitycs($key['date_start'], $key['date_end'], $key['id_status']);

            $__row[] = [
                'id'           => $key['id'],
                'Fecha inicio' => $fechas['start'],
                'Fecha fin'    => $fechas['end'],
                'actividad'    =>  ['html'=>!empty($key['title']) ? $key['title'] : $key['activities'],'class'=>'pe-2 ps-2 bg-white w-40'],
                'Encargado'    => $key['FullName'],
                'estado'       => getEstatus($key['id_status']),
                'a'            => $a
            ];
        }
    
        # encapsular datos
        return [
            'row'   => $__row,
            'ls'    => $ls         
        ];
    }

    public function sendIndividualRecorder() {
        $userCreator   = $this->employedByUser([$_COOKIE['IDU']]);

        $idList = $_POST['idList'];
        $task   = $this -> listTaskByID([$_POST['idList']]);


        $ok = $this -> MessageWhatsApp([

            'phone'      => $task['Telefono_movil'],
            // 'phone'      => 9621501886,
            'name'       => $task['FullName'],
            'title'      => 'Activity',
            'assign'     => $userCreator['FullName'],
            'activities' => $task['activities'],
            'noActivity' => 1

        ]);
         
        return [
            'status'  => 200,
            'success' => $ok,
        ];
    }

    public function sendRecorders() {
        $lsEncargados = [];
        $userCreator  = [];
        $tasks        = [];

        $tasks = $this->listTaskByEmployed([
            'udn'      => $_POST['udn'],
            'reminder' => $_POST['reminder']
        ]);
    
        foreach ($tasks as $task) {  
            $userCreator = $this->getEmployedByID([$task['id_user_creator']]);
            // Convertir titles (separados por coma) en array
            $titlesArray = explode(',', $task['titles']); 

            // Lista con guiones (texto plano)
            $listText = "";
            foreach ($titlesArray as $title) {
                $listText .= "• " . trim($title) . "\n"; 
            }

            $ok = $this -> MessageWhatsApp([
                'phone'      => $task['Telefono_movil'],
                // 'phone'      => '9625291311',
                'name'       => $task['nameResponsible'],
                'noActivity' => $task['total_actividades'],
                'activities' => $listText,
                'assign'     => $userCreator['Nombres'],
                'title'      => 'Lista de actividades ⚠️',
            ]);
        }

        return [
            'status'     => 200,
            'message'    => 'Recordatorios enviados correctamente.',
        ];    
    }
    

    // CRUD Advances
    public function lsAdvances() {
        $mensaje = [];
        $ls = $this->lsAdvance([$_POST['id']]);
        foreach ($ls as $key) {
            $photo = $key['src'];
            if ($key['src'] != '' && $key['src'] != null) {
                $photo = "https://www.erp-varoch.com/" . $key['src'];
            }
            if ($key['empleado'] == null) {
                $key['empleado'] = 'ADMIN';
            }
            $mensaje[] = [
                'id'   => $key['id'],
                'user' => [
                    'id'    => $key['iduser'],
                    'valor' => $key['empleado'],
                    'sexo'  => $key['sexo'],
                    'src'   => $photo,
                ],
                'date'      => $key['date'],
                'valor'     => $key['valor'],
                'date_seen' => $key['date_seen'],
            ];
        }

        return $mensaje;
    }

    public function addAdvance() {
        $data = [];  
        $status  = 500;
        $message = 'Error al enviar el avance.';

        $id_user_creator = $_POST['id_user_creator'];
        $activity = $_POST['activity'];
        $id_employed = $_POST['id_employed'];
        unset($_POST['id_user_creator']);
        unset($_POST['activity']);
        unset($_POST['id_employed']);

        $_POST['date_advance'] = date('Y-m-d H:i:s');
        $create  = $this->createAdvance($this->util->sql($_POST));

        if ($create == true) {
            $status  = 200;
            $message = 'Avance agregado correctamente.';
            $max = $this->maxAdvance();

            $name            = '';
            $message         = '';
            $phone           = '';
            $dataResponsible = [];
            $dataCreator     = [];
            $msg             = new Message();

            // Obtener datos del responsable y creador
            if (isset($_POST['id_user'])) {
                $dataUsuario = $this->employedByUser([$_POST['id_user']]);
                $dataResponsible = $this->getEmployedByID([$id_employed]);
                $dataCreator     = $this->getEmployedByID([$id_user_creator]);
            }

            // Enviar notificación por WhatsApp |
            if ($dataUsuario['id'] ==  $id_employed) {
                // Si el responsable envía avance al creador.
                $phone = $dataCreator['Telefono_Movil'];
                $name = $dataCreator['FullName'];

                $message = "¡Hola {$name}! 🤗\n\n".
                "📧 Tienes un nuevo AVANCE de {$dataUsuario['FullName']}, responsable de la actividad: ".
                "{$activity}\n\n" .
                "¿Alguna duda? 🤔\nVisita la página: https://www.erp-varoch.com/ERP24/gestor-de-actividades/gestordeactividades.php";

                $msg->whatsapp(
                     $phone ,
                    $message
                );
            } else {
                // Si el creador envía avance al responsable.
                $phone = $dataResponsible['Telefono_Movil'];
                $name = $dataResponsible['FullName'];

                $message = "¡Hola {$name}! 🤗\n\n".
                "📧 Tienes un nuevo AVANCE de {$dataUsuario['FullName']}, creador de la actividad: ".
                "{$activity}\n\n" .
                "¿Alguna duda? 🤔\nVisita la página: https://www.erp-varoch.com/ERP24/gestor-de-actividades/gestordeactividades.php";

                $msg->whatsapp(
                   $phone ,
                    $message
                );
            }

            $datos = $this->getAdvanceById([$max]);
            if ($datos) {
                $photo = $datos['src'];
                if ($datos['src'] != '' && $datos['src'] != null) {
                    $photo = "https://www.erp-varoch.com/" . $datos['src'];
                }
                if ($datos['empleado'] == null) {
                    $datos['empleado'] = 'ADMIN';
                }

                $data = [
                    'id'   => $datos['id'],
                    'user' => [
                        'id'    => $datos['id_user'],
                        'valor' => $datos['empleado'],
                        'sexo'  => $datos['sexo'],
                        'src'   => $photo,
                    ],
                    'date'      => $datos['date'],
                    'valor'     => $datos['valor'],
                    'date_seen' => $datos['date_seen'],
                ];
            }
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data,
        ];  
    }
    
    public function updateSeenAdvance() {
        $status = 500;
        $message = 'Error al agregar la fecha.';

        $newArray = [
            'date_seen'   => date('Y-m-d H:i:s'),
            'id_activity' => $_POST['id_activity'],
            'id_user'     => $_POST['id_user'],
        ];

        $update = $this->updateAdvance($this->util->sql($newArray, 2));

        if ($update) {
            $status = 200;
            $message = 'Agregado correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => 
                [
                    'id'        => $_POST['id_activity'],
                    'date_seen' => $newArray['date_seen'],
                ]
         
        ];
    }

    public function destroyAdvance() {
        $status = 500;
        $message = 'Error al eliminar el avance.';
        $delete = $this->deleteAdvance($this->util->sql($_POST, 1));

        if ($delete) {
            $status = 200;
            $message = 'Eliminado correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }


    // Complements.
    function MessageWhatsApp($opts) {
        $msg    = new Message();

        // Determinar el texto correcto para el número de actividades
        $actividad_texto = ($opts['noActivity'] == 1) ? "actividad pendiente" : "actividades pendientes";

        // Construcción del mensaje con saltos de línea explícitos
        $message = "¡Hola {$opts['name']}!\n\n".
        "📌Tienes ({$opts['noActivity']}) {$actividad_texto}:\n".
        " Asignado por : {$opts['assign']} \n\n".
               
        "{$opts['activities']} \n\n".
        "¿Alguna duda? \nComunícate con la persona que te asigno la actividad. 💬👥";
        
        // Process api
        return $msg->whatsapp(
            $opts['phone'],
            // "9625291311",
            $message
        );
    }

    function dateAnalitycs($inicio, $fin, $status) {
        $hoy     = date("Y-m-d");
        $start = strftime("%d/%b/%y", strtotime($inicio)); // 05/sep/23
        $end   = strftime("%d/%b/%y", strtotime($fin));    // 12/sep/23
        $bgClass = "";
        $red     = "#f87171";  // rojo
        $orange  = "#fdba74";  // naranja

        if (strtotime($fin) < strtotime($hoy) && ($status == 1 || $status == 2)) {
            $bgClass = $red;
        } elseif (strtotime($hoy) > strtotime($inicio) && $status == 1) {
            $bgClass = $orange;
        }

        return [
            'start' => [
                'class' => "w-16 text-center text-xs",
                'html'  => $start,
                'style' => "background:{$bgClass}"
            ],
            'end'   => [
                'class' => "w-16 text-center text-xs",
                'html'  => $end,
                'style' => "background:{$bgClass}"
            ]
        ];
    }

}


// Complements
function lsDropdown($idStatus, $idTask,  $idEmployedCreator, $idEmployed, $idUserCreator, $idUserResponsible = null, $rating) {
    $values = [
        'inProgress' => ['icon' => 'icon-play',    'text' => 'En Proceso', 'onclick' => "gestor.statusTasks(2,{$idTask},{$idEmployedCreator},{$idEmployed})"],
        'finalize'   => ['icon' => 'icon-ok',      'text' => 'Finalizar', 'onclick' => "gestor.statusTasks(4,{$idTask},{$idEmployedCreator},{$idEmployed})"],
        'delete'     => ['icon' => 'icon-cancel',  'text' => 'Cancelar',  'onclick' => "gestor.statusTasks(5,{$idTask})"],
        'edit'       => ['icon' => 'icon-pencil',  'text' => 'Editar',    'onclick' => "gestor.editTaskModal({$idTask})"],
        'advance'    => ['icon' => 'icon-comment', 'text' => 'Avances',   'onclick' => "gestor.advanceModal({$idTask},{$idUserCreator},{$idUserResponsible})"],
        'reminder'   => ['icon' => 'icon-whatsapp','text' => 'Recordar',  'onclick' => "gestor.sendIndividualRecorder({$idTask})"],
        'evaluation' => ['icon' => 'icon-star',    'text' => 'Evaluación',  'onclick' => "gestor.evaluationModal({$idTask})"],
        'details'    => ['icon' => 'icon-eye',     'text' => 'Ver detalles', 'onclick' => "assign.onShowActivity({$idTask})"],
    ];

    $options = [
        '1' => [
            $values['inProgress'],
            $values['edit'],
            $values['advance'],
            $values['reminder'],
            $values['delete'],
        ],
        '2' => [
            $values['finalize'],
            $values['details'],
            $values['edit'],
            $values['advance'],
            $values['reminder'],
            $values['delete'],
        ],
        '4' => [
            $values['details'],
            $values['advance'],
        ],
        '5' => [
            $values['advance'],
        ],
    ];
    // ✅ Agrega evaluación si no se ha calificado y no es autoevaluación
    if ($idStatus == '4' && $rating != true && $idEmployedCreator != $idEmployed) {
        $options['4'][] = $values['evaluation'];
    }
    return $options[$idStatus] ?? [];
}

function nextMonday(){
    $date = new DateTime();
    $date->modify('next monday');
    return $date->format('Y-m-d 09:00:00');
}

function getEstatus($idEstado){
    switch ($idEstado) {
        case '1': return '⌚ POR INICIAR';
        case '2': return '⏳  EN PROCESO';
        case '3': return '⏸️ PAUSADO';
        case '4': return '✅ FINALIZADO';
        case '5': return '🚫 CANCELADO';
    }
}

function getPriority($idPrioridad){
    switch ($idPrioridad){ 
        case '1': return '🔴 Alta';
        case '2': return '🟠 Media';
        case '3': return '🟡 Baja';
    }
}

function getAccumulatedDays($fechaInicio, $fechaFin) {
    // Convertir las fechas a objetos DateTime
    $inicio = new DateTime($fechaInicio);
    $fin = new DateTime($fechaFin);

    // Calcular la diferencia
    $diferencia = $inicio->diff($fin);

    // Retornar el número de días
    return $diferencia->days;
}



// Instancia del objeto

$obj = new ctrl();
$fn = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);