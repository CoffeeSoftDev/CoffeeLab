<?php

if (empty($_POST['opc'])) exit(0);



require_once '../mdl/mdl-summary.php';

class ctrl extends mdl {

    function lsSummary() {
        $__row         = [];
        $udn_id        = $_POST['udn_id'];
        $red_social_id = $_POST['red_social_id'];
        $año           = $_POST['año'];
        $mes           = $_POST['mes'];

        $data           = $this->getCampaignSummary([$udn_id, $red_social_id, $año, $mes]);
        $totals         = $this->getCampaignTotals([$udn_id, $red_social_id, $año, $mes]);
        $monthlySummary = $this->getMonthlySummary([$udn_id, $red_social_id, $año, $mes]);

    //     $campaignGroups = [];
    //     foreach ($data as $item) {
    //         $campaña_id = $item['campaña_id'];
            
    //         if (!isset($campaignGroups[$campaña_id])) {
    //             $campaignGroups[$campaña_id] = [
    //                 'campaña' => $item['campaña'],
    //                 'estrategia' => $item['estrategia'],
    //                 'anuncios' => []
    //             ];
    //         }
            
    //         $campaignGroups[$campaña_id]['anuncios'][] = $item;
    //     }

    //     foreach ($campaignGroups as $campaña_id => $group) {
    //         $campaignTotal = null;
    //         foreach ($totals as $total) {
    //             if ($total['campaña_id'] == $campaña_id) {
    //                 $campaignTotal = $total;
    //                 break;
    //             }
    //         }

    //         $__row[] = [
    //             'Campaña' => [
    //                 'html' => '<strong class="text-[#8CC63F]">' . $group['campaña'] . '</strong>',
    //             ],
    //             'Estrategia' => [
    //                 'html' => $group['estrategia'],
    //             ],
    //             'Anuncios' => [
    //                 'html' => $campaignTotal['total_anuncios'] . ' anuncios',
    //                 'class' => ' text-center'
    //             ],
    //             'Inversión Total' => [
    //                 'html' => evaluar($campaignTotal['total_inversion']),
    //                 'class' => ' text-end'
    //             ],
    //             'Total Clics' => [
    //                 'html' => number_format($campaignTotal['total_clics'], 0, '.', ','),
    //                 'class' => ' text-center'
    //             ],
    //             'CPC Promedio' => [
    //                 'html' => evaluar($campaignTotal['cpc_promedio']),
    //                 'class' => 'text-end'
    //             ]
    //         ];

    //         foreach ($group['anuncios'] as $anuncio) {
    //             $__row[] = [
    //                 'Campaña' => '↳ ' . $anuncio['anuncio'],
    //                 'Estrategia' => $anuncio['fecha_inicio'] . ' - ' . $anuncio['fecha_fin'],
    //                 'Anuncios' => [
    //                     'html' => $anuncio['duracion_dias'] . ' días',
    //                     'class' => 'text-center'
    //                 ],
    //                 'Inversión Total' => [
    //                     'html' => evaluar($anuncio['inversion']),
    //                     'class' => 'text-end'
    //                 ],
    //                 'Total Clics' => [
    //                     'html' => number_format($anuncio['clics'], 0, '.', ','),
    //                     'class' => 'text-center'
    //                 ],
    //                 'CPC Promedio' => [
    //                     'html' => evaluar($anuncio['cpc']),
    //                     'class' => 'text-end'
    //                 ]
    //             ];
    //         }
    //     }

    //     $__row[] = [
    //         'Campaña' => [
    //             'html' => '<strong class="text-white">TOTAL MENSUAL</strong>',
    //         ],
    //         'Estrategia' => [
    //             'html' => '',
    //             'class' => ''
    //         ],
    //         'Anuncios' => [
    //             'html' => '',
    //             'class' => 'bg-[#103B60]'
    //         ],
    //         'Inversión Total' => [
    //             'html' => '<strong>' . evaluar($monthlySummary['costo_total']) . '</strong>',
    //         ],
    //         'Total Clics' => [
    //             'html' => '<strong>' . number_format($monthlySummary['total_resultados'], 0, '.', ',') . '</strong>',
    //         ],
    //         'CPC Promedio' => [
    //             'html' => '<strong>' . evaluar($monthlySummary['cpc_promedio_mes']) . '</strong>',
    //         ]
    //     ];

        return [
            'row' => $__row,
            'data' => $data,
            'totals' => $totals,
            'monthlySummary' => $monthlySummary
        ];
    }
}


$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
