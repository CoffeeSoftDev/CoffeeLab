<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once('../mdl/mdl-administracion.php');
require_once('../../vendor/autoload.php');

use PhpOffice\PhpSpreadsheet\IOFactory;

class ctrl extends mdl {

    function uploadExcel() {
        $idList = $_POST['idList'];
        $udn = $_POST['UDN'];
        $rows = [];
        $totalProductos = 0;
        $productosAgregados = 0;
        $productosActualizados = 0;

        if (isset($_FILES['excel_file0'])) {
            $file = $_FILES['excel_file0']['tmp_name'];
            
            try {
                $spreadsheet = IOFactory::load($file);
                $sheet = $spreadsheet->getActiveSheet();
                $highestRow = $sheet->getHighestRow();

                for ($row = 2; $row <= $highestRow; $row++) {
                    $clave = $sheet->getCell('A' . $row)->getValue();
                    $descripcion = $sheet->getCell('B' . $row)->getValue();
                    $grupo = $sheet->getCell('C' . $row)->getValue();
                    $costo = $sheet->getCell('D' . $row)->getValue();

                    if (empty($descripcion)) continue;

                    $idGrupo = $this->selectGrupo([$grupo, $udn]);
                    $existe = $this->existsProductoByName([$descripcion, $udn]);

                    $status = '';
                    $accion = '';

                    if ($idList == 1) {
                        // Modo comparar
                        if ($existe) {
                            $status = '<span class="text-warning">Ya existe</span>';
                            $accion = 'Comparar';
                        } else {
                            $status = '<span class="text-success">Nuevo</span>';
                            $accion = 'Agregar';
                        }
                    } else {
                        // Modo subir
                        if ($existe) {
                            $producto = $this->getProductoByName([$descripcion, $udn]);
                            $this->updateProducto([
                                'values' => 'costo = ?, id_grupo_productos = ?',
                                'data' => [$costo, $idGrupo, $producto['id']]
                            ]);
                            $status = '<span class="text-info">Actualizado</span>';
                            $productosActualizados++;
                        } else {
                            $this->createProducto([
                                'values' => 'clave_producto, descripcion, id_grupoc, id_udn, costo, fecha, id_grupo_productos, activo_soft',
                                'data' => [$clave, $descripcion, 0, $udn, $costo, date('Y-m-d'), $idGrupo, 1]
                            ]);
                            $status = '<span class="text-success">Agregado</span>';
                            $productosAgregados++;
                        }
                    }

                    $rows[] = [
                        'Clave' => $clave,
                        'Producto' => $descripcion,
                        'Grupo' => $grupo,
                        'ID Grupo' => $idGrupo,
                        'Costo' => evaluar($costo),
                        'Estado' => $status,
                        'id_grupo' => $idGrupo
                    ];

                    $totalProductos++;
                }

            } catch (Exception $e) {
                return [
                    'status' => 500,
                    'message' => 'Error al procesar archivo: ' . $e->getMessage()
                ];
            }
        }

        return [
            'thead' => '',
            'row' => $rows,
            'prod_soft' => $totalProductos,
            'agregados' => $productosAgregados,
            'actualizados' => $productosActualizados
        ];
    }
}

// Complements
function evaluar($val) {
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
