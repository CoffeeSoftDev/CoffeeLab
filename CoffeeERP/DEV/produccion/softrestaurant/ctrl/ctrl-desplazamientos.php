<?php
if (empty($_POST['opc'])) {
    exit(0);
}

require_once('../mdl/mdl-desplazamientos.php');
$obj = new Desplazamiento;

$encode = [];
switch ($_POST['opc']) {
    case 'udn':
            $encode = $obj->udn_select();
        break;
    case 'listGroups':
            $encode = $obj->selectGroups([$_POST['udn']]);
        break;
    case 'listProduct':
            $name = $_POST['nombre'];
            $productos = [];
            $sql = $obj->selectProduct([$_POST['group']]);
            foreach ($sql as $row) {
                $productos[] = [
                    "id" => $row['id'],
                    "clave" => $row['clave'],
                    "nombre" => mb_strtoupper($row['nombre'],'UTF-8'),
                    "estado" => $row['estado'],
                    "paquetes" => []
                ];
            }

            foreach ($productos as &$p) {
                if ( strpos($p['nombre'], "PAQUETE") !== false ) {
                    $sql = $obj->selectPaquetes([$p['nombre']]);
                    foreach ($sql as $value) {
                        $p['paquetes'][] = [
                            "id" => $value['id'],
                            "nombre" => $value['producto'],
                            "precio" => number_format($value['precio'],2,'.',',')
                        ];
                    }
                }
            }
            
            $encode = $productos;
        break;
    case 'homologados':
            $grupos = [];
            $thead = ['Clave', 'Producto', 'Receta', 'Activo', ''];
            
            $list_group = $obj->grupo_productos([$_POST['udn']]);
            foreach ($list_group as $group) {
                $list_product = $obj->mostrar_productos_soft([$group['idgrupo']]);
                $total_productos = count($list_product);
                $__productos = [];
                $total_homologados = 0;
        
        
                foreach ($list_product as $product) {
                    $homologados = $obj->homologados_soft([$product['id_Producto']]);
                    if ($product['activo_soft'] == 1) {
                        $product['activo_soft'] = 'ACTIVO';
                    } else {
                        $product['activo_soft'] = 'INACTIVO';
                    }
        
                    if ($group['grupoproductos'] == 'PAQUETES') {
                        $precios_paquetes = $obj->paquetes_precios(array($product[2]));
                        foreach ($precios_paquetes as $precio) {
                            $__productos[] = array(
                                'suma_precios' => $precio['suma'],
                            );
                        }
                        $list_paquetes = $obj->paquetes(array($product[2]));
                        foreach ($list_paquetes as $paquete) {
                            $__productos[] = array(
                                'id' => $paquete[0],
                                'nombre' => $paquete[1],
                                'precio' => $paquete[2],
                            );
        
                        }
                    } else {
                        if ($homologados != "<label class='text-danger'>No encontrado</label>") {
                            $total_homologados += 1;
                        }
        
                        $__productos[] = array(
                            'id' => $product['id_Producto'],
                            'nombre' => $product['descripcionP'],
                            'homologados' => $homologados,
                            'stado' => $product['activo_soft'],
                            "btn" => ''
                        );
                    }
                }
        
                $grupos[] = array(
                    "idGrupo" => $group['idgrupo'],
                    "nombre" => $group['grupoproductos'] . '  (' . $total_homologados . ' / ' . $total_productos . ') ',
                    "total" => $total_homologados,
                    "estado" => 0,
                    "productos" => $__productos
                );
            } // end lista de grupos
        
            $encode = [
                "thead" => $thead,
                "grupos" => $grupos
            ];        
        break;
}

echo json_encode($encode);
?>