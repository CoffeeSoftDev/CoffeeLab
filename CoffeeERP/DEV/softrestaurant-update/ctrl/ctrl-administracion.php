<?php
session_start();

if (empty($_POST['opc'])) exit(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once('../mdl/mdl-administracion.php');

class ctrl extends mdl {

    function init() {
        return [
            'udn' => $this->lsUDN(),
            'categorias' => $this->lsCategorias([])
        ];
    }

    function ls() {
        $udn = $_POST['udn'];
        $data = $this->listProductos([$udn]);
        $rows = [];

        foreach ($data as $item) {
            $homologado = $this->getHomologado([$item['id']]);
            $idHomologo = 0;
            $idCostsys = 0;

            foreach ($homologado as $h) {
                $idCostsys = $h['id_costsys_recetas'];
                $idHomologo = $h['idhomologado'];
            }

            $selectCostsys = $this->buildCostsysSelect($item['id'], $idCostsys, $idHomologo);
            
            $status = '<span class="text-danger"><strong>Pendiente</strong></span>';
            if ($idHomologo != 0) {
                if ($item['costo'] != $selectCostsys['precio']) {
                    $status = '<i class="text-warning icon-warning-1"></i> Precio diferente';
                } else {
                    $status = '<i class="text-success icon-flag-2"></i>';
                }
            }

            $rows[] = [
                'id' => $item['id'],
                'Fecha' => $item['fecha'],
                'Categoría' => $item['categoria'],
                'Producto' => '<span id="txtProducto'.$item['id'].'" name="'.$item['nombre'].'">'.$item['nombre'].'</span>',
                'Producto Costsys' => $selectCostsys['html'],
                'Precio Costsys' => evaluar($selectCostsys['precio']),
                'Precio ERP' => evaluar($item['costo']),
                'Revisión' => $status,
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows
        ];
    }

    function lsGrupo() {
        $rows = [];
        $total = 0;
        $list = $this->selectListGrupoSN([$_POST['udn']]);

        foreach ($list as $item) {
            $productos = $this->listProductosByGrupo([$_POST['udn'], $item['idgrupo']]);
            $homologados = $this->listProductosHomologados([$_POST['udn'], $item['idgrupo']]);
            $totalProductos = count($productos);

            $rows[] = [
                'id' => $item['idgrupo'],
                'nombre' => $item['grupoproductos'],
                'value_1' => $totalProductos,
                'value_2' => count($homologados),
                'atrr' => [[
                    'fn' => 'ver_productos_soft',
                    'color' => 'bg-primary',
                    'url_image' => '',
                    'disabled' => ''
                ]],
                'opc' => 0
            ];

            $total += $totalProductos;
        }

        return [
            'thead' => '',
            'row' => $rows,
            'Productos' => $total
        ];
    }

    function lsGrupoFz() {
        $rows = [];
        $total = 0;
        $list = $this->lsGrupoFogaza([$_POST['udn']]);

        foreach ($list as $item) {
            $productos = $this->listProductosCostsys([6, $item['id']]);

            $rows[] = [
                'id' => $item['id'],
                'nombre' => $item['valor'],
                'value_1' => count($productos),
                'value_2' => 0,
                'atrr' => [[
                    'fn' => 'ver_productos_soft',
                    'color' => 'bg-primary',
                    'url_image' => '',
                    'disabled' => ''
                ]],
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows,
            'Productos' => $total
        ];
    }

    function rptDetallado() {
        $rows = [];
        $ls = $this->listProductos([$_POST['udn']]);

        foreach ($ls as $key) {
            $homologado = $this->getHomologado([$key['id']]);
            $idHomologo = 0;
            $idCostsys = 0;

            foreach ($homologado as $h) {
                $idCostsys = $h['id_costsys_recetas'];
                $idHomologo = $h['idhomologado'];
            }

            $select = $this->buildCostsysSelect($key['id'], $idCostsys, $idHomologo);
            
            $status = '<span class="text-danger"><strong>Pendiente</strong></span>';
            if ($idHomologo != 0) {
                if ($key['costo'] != $select['precio']) {
                    $status = '<i class="text-warning icon-warning-1"></i> Precio diferente';
                } else {
                    $status = '<i class="text-success icon-flag-2"></i>';
                }
            }

            $rows[] = [
                'id' => $key['id'],
                'fecha' => $key['fecha'],
                'id_grupo_productos' => $key['categoria'],
                'producto' => '<span id="txtProducto'.$key['id'].'" name="'.$key['nombre'].'">'.$key['nombre'].'</span>',
                'producto costsys' => $select['html'],
                'precio costsys' => evaluar($select['precio']),
                'precio erp' => evaluar($key['costo']),
                'Revision' => $status,
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows
        ];
    }

    function listProductosFogaza() {
        $rows = [];
        $list = $this->listProductosByGrupo([$_POST['udn'], $_POST['id']]);

        foreach ($list as $item) {
            $homologado = $this->getHomologado([$item['id']]);
            $idHomologo = 0;
            $idCostsys = 0;

            foreach ($homologado as $h) {
                $idCostsys = $h['id_costsys_recetas'];
                $idHomologo = $h['idhomologado'];
            }

            $select = $this->buildCostsysSelect($item['id'], $idCostsys, $idHomologo);
            
            $rows[] = [
                'id' => $item['id'],
                'producto' => $item['nombre'],
                'grupo' => $select['html'],
                'precio Soft' => evaluar($item['costo']),
                'Precio Costsys' => evaluar($select['precio']),
                'opc' => 0
            ];
        }

        return [
            'thead' => '',
            'row' => $rows
        ];
    }

    function getProducto() {
        $status = 500;
        $message = 'Error al obtener producto';
        $data = null;

        $producto = $this->getProductoById([$_POST['id']]);

        if ($producto) {
            $status = 200;
            $message = 'Producto encontrado';
            $data = $producto;
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    function addProducto() {
        $status = 500;
        $message = 'Error al agregar producto';
        
        $_POST['fecha'] = date('Y-m-d');
        $_POST['activo_soft'] = 1;

        $exists = $this->existsProductoByName([$_POST['descripcion'], $_POST['id_udn']]);

        if (!$exists) {
            $create = $this->createProducto($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Producto agregado correctamente';
            }
        } else {
            $status = 409;
            $message = 'Ya existe un producto con ese nombre';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editProducto() {
        $status = 500;
        $message = 'Error al editar producto';

        $edit = $this->updateProducto($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Producto editado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function statusProducto() {
        $status = 500;
        $message = 'Error al cambiar estado';

        $update = $this->updateProducto($this->util->sql($_POST, 1));

        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function enlaceCostsys() {
        $idReceta = $_POST['idreceta'];
        $idProducto = $_POST['idProducto'];
        $homologo = $_POST['idHomologo'];
        $dateNow = date("Y-m-d");
        $estado = '';

        if ($homologo != 0) {
            $data = [$idReceta, $dateNow, $homologo];
            $estado = 'actualizar';
        } else {
            $data = [$idProducto, $idReceta, $dateNow];
            $this->createEnlaceCostsys($data);
            $estado = 'insertar';
        }

        return [
            'status' => 200,
            'data' => $data,
            'estado' => $estado
        ];
    }

    function link() {
        $idReceta = $_POST['id'];
        $titulo = 'PASTELERIA';
        $nombre = $_POST['nombre_receta'];
        $fechaIngreso = date("Y-m-d H:i:s");
        $estadoProducto = 1;
        $idArea = $this->getIdArea([$titulo]);

        $data = [$idArea, $fechaIngreso, $nombre, $estadoProducto];
        $this->createProductoProduccion($data);
        
        $idProducto = $this->getIdProducto([$nombre]);
        $dataVinculo = [$idProducto, $idReceta, 'Creado desde ERP2'];
        
        return $this->createVinculo($dataVinculo);
    }

    private function buildCostsysSelect($idProducto, $idCostsys, $idHomologo) {
        $html = '';
        $precio = 0;

        if ($idCostsys != 0) {
            $recetas = $this->lsProductosCostsys([$_POST['udn']]);
            $html = '<select class="js-example-basic-single" id="cb_producto'.$idProducto.'">';
            
            foreach ($recetas as $r) {
                $selected = ($r['idReceta'] == $idCostsys) ? 'selected' : '';
                $html .= '<option value="'.$r['idReceta'].'" '.$selected.'>'.$r['nombre'].'</option>';
                if ($r['idReceta'] == $idCostsys) {
                    $precio = $r['precioVenta'];
                }
            }
            
            $html .= '</select>';
            $html .= '<button class="btn btn-sm btn-primary" onclick="enlace_receta('.$idProducto.','.$idHomologo.')">
                        <i class="icon-link"></i>
                      </button>';
        } else {
            $html = '<button class="btn btn-sm btn-success" onclick="quest_agregar('.$idProducto.')">
                        <i class="icon-plus"></i> Agregar
                     </button>';
        }

        return [
            'html' => $html,
            'precio' => $precio
        ];
    }
}

// Complements
function evaluar($val) {
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

function dropdown($id) {
    return [
        ['icon' => 'icon-pencil', 'text' => 'Editar', 'onclick' => "app.editProducto($id)"],
        ['icon' => 'icon-trash', 'text' => 'Eliminar', 'onclick' => "app.deleteProducto($id)"]
    ];
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
