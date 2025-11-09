<?php
function evaluar($val, $simbol = '$'){

    $value = is_nan( $val ) ? 0 : $val;

    if($simbol == ''){
        
        if($value < 0):
            
            $valor =  number_format($value, 2, '.', '');
            return $value ?  "<span class='text-danger'>  $valor </span>"     : '';

        
        else:
           return $value ?  number_format($value, 2, '.', '').'' : '';
        
        endif;    
        
        
    }if($simbol == '%'){
        
        if($value < 0):
            
            $valor =  number_format($value, 2, '.', ',');
            return $value ?  "<span class='text-danger'>$  $valor </span>"     : '-';
       
        else:
            return $value ?  number_format($value, 2, '.', ',').' % ' : '-';
        endif; 
        
        
        
    }else {
     
       if($value < 0):
        $valor =  number_format($value, 2, '.', ',');

        return $value ?  "<span class='text-danger'>$  $valor </span>"     : '-';

       else:
            return $value ? '$ ' . number_format($value, 2, '.', ',') : '-';
       endif; 

    }


    
}

function formatSpanishDateAll($fecha = null) {
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    $formatoFecha = "%A, %d de %B del %Y"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}

function formatSpanishDate($fecha = null, $type = 'short') {
    if ($fecha === null) {
        $fecha = date('Y-m-d');
    }

    $marcaTiempo = strtotime($fecha);
    $hoy = date('Y-m-d');
    $ayer = date('Y-m-d', strtotime('-1 day'));

    if ($fecha == $hoy) {
        return "Hoy";
    } elseif ($fecha == $ayer) {
        return "Ayer";
    }

    $meses = [
        1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
        5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
        9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
    ];

    $mesesCortos = [
        1 => 'Ene', 2 => 'Feb', 3 => 'Mar', 4 => 'Abr',
        5 => 'May', 6 => 'Jun', 7 => 'Jul', 8 => 'Ago',
        9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dic'
    ];

    $dia = date('d', $marcaTiempo);
    $mes = (int)date('m', $marcaTiempo);
    $anio = date('Y', $marcaTiempo);

    if ($type === 'normal') {
        return "$dia de {$meses[$mes]} del $anio";
    }

    return "$dia/{$mesesCortos[$mes]}/$anio";
}

function formatSpanishNoDay($fecha = null){
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

   // Si no se proporciona una fecha específica, usar la fecha actual
    if ($fecha === null) {
        $fecha = date('Y-m-d');
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    // Obtener el número del día de la semana (0 para domingo, 6 para sábado)
    $numeroDia = date('w', $marcaTiempo);

    return $numeroDia;
}



function formatSpanishDay($fecha = null){
    setlocale(LC_TIME, 'es_ES.UTF-8'); // Establecer la localización a español

    if ($fecha === null) {
        $fecha = date('Y-m-d'); // Utilizar la fecha actual si no se proporciona una fecha específica
    }

    // Convertir la cadena de fecha a una marca de tiempo
    $marcaTiempo = strtotime($fecha);

    $formatoFecha = "%A"; // Formato de fecha en español
    $fechaFormateada = strftime($formatoFecha, $marcaTiempo);

    return $fechaFormateada;
}

function listDays(){
    
    return [
        2 => 'Lunes',
        3 => 'Martes',
        4 => 'Miercoles',
        5 => 'Jueves',
        6 => 'Viernes',
        7 => 'Sabado',
        1 => 'Domingo'
        
    ];
}

