<?php
session_start();
if (empty($_POST['opc'])) exit(0);

require_once '../../conf/coffeSoft.php';
// incluir tu modelo
require_once '../mdl/mdl-gestordeactividades-asignados.php';

class ctrl extends mdl{

    function ls() {
        // 📜 Vars.
        $__row = [];

        // Obtener empleado activo
        $idEmpleado = $this->employedByUser([$_COOKIE['IDU']]);

        // Obtener todas las actividades
        $ls = $this->listTask($_POST, $idEmpleado['id']);

        $conAvance = [];
        $sinAvance = [];

        // Clasificar por avances
        foreach ($ls as $item) {
            $lastAdvance = $this->getLastAdvance([$item['id']]);
            if ($lastAdvance && $lastAdvance['date_advance']) {
                $item['__ultimo_avance'] = $lastAdvance['date_advance'];
                $item['__lastAdvance'] = $lastAdvance; // guardamos completo
                $conAvance[] = $item;
            } else {
                $item['__ultimo_avance'] = null;
                $item['__lastAdvance'] = null;
                $sinAvance[] = $item;
            }
        }

        // Ordenar los que sí tienen avances (por fecha más antigua primero)
        usort($conAvance, function ($a, $b) {
            return strtotime($b['__ultimo_avance']) <=> strtotime($a['__ultimo_avance']);
        });

        $ordered = array_merge($conAvance, $sinAvance);

        // Construir la respuesta final
        foreach ($ordered as $key) {
            $UserCreator     = $this->getEmployedByID([$key['id_user_creator']]);
            $UserResponsible = $this->getEmployedByID([$key['id_employed']]);

            $lastAdvance         = $key['__lastAdvance'] ?? null;
            $numeroAvanceNoleido = $this->getCountAdvanceNotSeen([$key['id'], $UserCreator['idUser']]);

            $a = [
                [
                    'class'   => 'btn btn-sm btn-outline-primary me-1',
                    'html'    => '<i class=" icon-eye text-info"></i> Ver detalles',
                    'onclick' => "assign.onShowActivity({$key['id']})",
                ],
                [
                    'class'   => 'btn btn-sm btn-outline-primary ',
                    'html'    => '<i class="icon-comment text-info"></i> Avances',
                    'onclick' => "gestor.advanceModal({$key['id']}, {$UserCreator['idUser']}, {$UserResponsible['idUser']})",
                ]

            ];

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

            $advance = $lastAdvance
                ? formatSpanishDate($lastAdvance['date_advance']) . $iconoCampana
                : "<span class='text-gray-500'>Sin registro</span>";

            $activity = !empty($key['title']) ? $key['title'] : $key['activities'];

            $fechas = dateAnalitycs($key['date_start'], $key['date_end'], $key['id_status']);
            
            $__row[] = [
                'id'          => $key['id'],
                'Fecha Inicio'    => $fechas['start'],
                'Fecha Fin'       => $fechas['end'],
                'prioridad'   => getPriority($key['id_priority']),
                'Titulo'      => [
                    'html' => $key['title'] ? $key['title'] : $key['activities'],
                ],
                'Creado por'  => $UserCreator['FullName'] . ' ' . $UserCreator['APaterno'],
                'Ult. Avance' => $advance,
                'Estado'      => getEstatus($key['id_status']),
                'a'           => $a
            ];
        }

        return [
            "row" => $__row,
            'ls'  => $ordered,
        ];
    }

    function get(){
        $list = $this -> getTableByID([ $_POST['id'] ]);
        return ['data' => $list ];  
    }

    function cancel() {
        $status = 500;
        $message = 'Error al eliminar registro.';
        // Eliminar platillos
        $delete = $this->delete($this->util->sql($_POST, 1));

        if ($delete == true) {
            $status  = 200;
            $message = 'Se ha eliminado correctamente';
        }

        return [
            'status'   => $status,
            'message' => $message
        ];
    }

    // activity.
    function getActivity() {
        $row   = $this->getActivityById([$_POST['id']]);
        $now   = date("Y-m-d");
        $__row = [];

        foreach ($row as $key) {
            $userCreator     = $this->getEmployedByID([$key['id_user_creator']]);
            $userResponsible = $this->getEmployedByID([$key['id_employed']]);
            $lastAdvance     = $this->getLastAdvance([$key['id']]);
            $twoLastAdvance  = $this->getTwoLastAdvance([$key['id']]);
            $questions       = $this->getQuestionsByRating([$key['idRating']]);

            // Logic.
            $status = false;
            if ($key['date_seen'] == null && $_POST['idUserSession'] == $userResponsible['idUser']) {
                $status = true;
                $ok = $this-> updateDateSeen([
                     $now,
                     $key['id']
                ]);
            }

            // Si el evento sigue en proceso y paso ya la fecha de entrega.
            if (($key['id_status'] == 1 || $key['id_status'] == 2) && (date('Y-m-d', strtotime($key['date_end'])) < date('Y-m-d'))) {
                $nameStatus = 'ATRASADO';
                $idstatus = 6; // Asignar estado de vencido
            } else {
                $nameStatus = $key['name_status'];
                $idstatus = $key['id_status'];
            }

            $__row[] = [
                'id'                => $key['id'],
                'name'              => $key['Nombres'],
                'UDN'               => $key['UDN'],
                'userCreator'       => $userCreator['FullName'],
                'title'             => !empty($key['title']) ? $key['title'] : $key['activities'],
                'description'       => $key['description'],
                'priority'          => getPriority($key['id_priority']),
                'id_priority'       => $key['id_priority'],
                'activities'        => $key['activities'],
                'name_status'       => getEstatus($idstatus),
                'date_creation'     => formatSpanishDate($key['date_creation']),
                'date_start'        => formatSpanishDate($key['date_start']),
                'date_end'          => formatSpanishDate($key['date_end']),
                'date_seen'         => $key['date_seen'],
                'date_follow'       => formatSpanishDate($lastAdvance['date_advance']),
                'date_finished'     => isset($key['date_finished']) ? formatSpanishDate($key['date_finished']) : '',
                'feedback'          => $key['feedback'],
                'average'           => $key['average'],
                'id_status'         => $idstatus,
                'days'              => getAccumulatedDays($key['date_start'], $now),
                'status'            => $status,
                'advances'          => $twoLastAdvance,
                'idUserCreator'     => $userCreator['idUser'],
                'idUserResponsible' => $userResponsible['idUser'],
                'phone'             => $userResponsible['Telefono_Movil'],
                'objetivo'          => $key['objetivo'],
                'questions'         => $questions,
            ];
        }

        return [
            'data'    => $__row
        ];
    }

    function getCalendario() {
        $event = [];
        $fecha = $_POST['fechita'] ?? 'fecha_final_asignados'; 
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
                $idstatus = 6; // Asignar estado de vencido
            } else {
                $nameStatus = $key['name_status'];
                $idstatus = $key['id_status'];
            }

            // Determinar la fecha de inicio y fin según el valor de 'fechita'
            $start = '';    
            $end = '';
            if ($fecha == 'fecha_final_asignados') {
                $start = date('Y-m-d', strtotime($key['date_end']));
                $end = date('Y-m-d', strtotime($key['date_end']. ' + 1 days'));
            } else if ($fecha == 'fecha_inicio_asignados') {
                $start = date('Y-m-d', strtotime($key['date_start']));
                $end = date('Y-m-d', strtotime($key['date_start']. ' + 1 days'));
            } else if ($fecha == 'fecha_termino_asignados') {
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
}

    // Complements.
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
                'class' => "w-20 text-center text-xs",
                'html'  => $start,
                'style' => "background:{$bgClass}"
            ],
            'end'   => [
                'class' => "w-20 text-center text-xs",
                'html'  => $end,
                'style' => "background:{$bgClass}"
            ]
        ];
    }

    function dropdown($idTask, $idStatus,  $idUserCreator) {

         // 📏 INSTANCIA BASE
        $instancia = 'gestor';

        $values = [
            'inProgress' => ['icon' => 'icon-play',    'text' => 'Iniciar',   'onclick' => "{$instancia}.statusTasks(2,{$idTask})"],
            'finalize'   => ['icon' => 'icon-ok',      'text' => 'Finalizar', 'onclick' => "{$instancia}.statusTasks(4,{$idTask})"],
            'delete'     => ['icon' => 'icon-cancel',  'text' => 'Cancelar',  'onclick' => "{$instancia}.statusTasks(5,{$idTask})"],
            'edit'       => ['icon' => 'icon-pencil',  'text' => 'Editar',    'onclick' => "{$instancia}.editTaskModal({$idTask})"],
            'advance'    => ['icon' => 'icon-comment', 'text' => 'Avances',   'onclick' => "{$instancia}.advanceModal({$idTask},{$idUserCreator})"],
            'reminder'   => ['icon' => 'icon-whatsapp','text' => 'Recordar',  'onclick' => "{$instancia}.reminderModal({$idTask})"],
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
                $values['edit'],
                $values['advance'],
                $values['reminder'],
                $values['delete'],
            ],
            '4' => [
                $values['advance'],
                $values['delete'],
            ],
            '5' => [
                $values['advance'],
            ],
        ];


        // 📌 Verificar estado, si no crea dropdown vacion
        return $options[$idStatus] ?? [];
    }

    function getEstatus($idEstado) {
        switch ($idEstado) {
            case '1': return '⌚ POR INICIAR';
            case '2': return '⏳  EN PROCESO';
            case '3': return '⏸️ PAUSADO';
            case '4': return '✅ FINALIZADO';
            case '5': return '🚫 CANCELADO';
            case '6': return '⏰ ATRASADO';
        }
    }
    
    function getPriority($idPrioridad) {
        switch ($idPrioridad){ 
            case '1': return '🔥 Alta';
            case '2': return '⚠️ Media';
            case '3': return '🔷 Baja';
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

$encode = [];
$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);