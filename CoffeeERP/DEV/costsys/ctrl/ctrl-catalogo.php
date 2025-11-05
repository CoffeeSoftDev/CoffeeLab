<?php
if (empty ($_POST['opc']))
    exit (0);

require_once ('../mdl/mdl-catalogo.php'); $obj     = new Catalogo;
require_once('../../conf/_Utileria.php'); $util    = new Utileria;
require_once ('../mdl/mdl-ingredientes.php'); $ing = new Ingredientes;
require_once ('../mdl/mdl-subrecetas.php'); $sub   = new Subrecetas;
require_once ('../mdl/mdl-recetas.php'); $rec      = new Recetas;

switch ($_POST['opc']) {
      // Data para selects
    case 'initComponents': 
        $udn              = $obj->lsUDN();
        $clasificacion    = $obj->lsClasificacion();
        $subclasificacion = $obj->lsSubClasificacion();
        $unidad           = $obj->lsUnidad();
        $marca            = $obj->lsMarca();
        $proveedor        = $obj->lsProveedor();
        $ingredientes     = $ing->getIngredientes();
        $subrecetas       = $sub->selectSubReceta();
        $recetasoft       = $rec->getRecetasSoft();
        $productosfz      = $rec->getProductosFogaza();

        $encode = [
            "udn"              => $udn,
            "clasificacion"    => $clasificacion,
            "subclasificacion" => $subclasificacion,
            "unidad"           => $unidad,
            "marca"            => $marca,
            "proveedor"        => $proveedor,
            "ingredientes"     => $ingredientes,
            "subrecetas"       => $subrecetas,
            "recetasoft"       => $recetasoft,
            "productosfz"      => $productosfz
        ];
        break;
    case 'createProveedor': 
        $encode = $obj->createProveedor($util->sql($_POST));
        break;
    case 'createMarca': 
        $array = array();
        foreach ($_POST as $key => $value) {
            if ($key != 'opc' && $key != 'id')
                if ($value == '' || $value == '0')
                    $array[] = null;
                else
                    $array[] = $value;
        }
        $encode = $obj->createMarca($array);
        break;
    case 'createUnidad': 
        $array = array();
        foreach ($_POST as $key => $value) {
            if ($key != 'opc' && $key != 'id')
                if ($value == '' || $value == '0')
                    $array[] = null;
                else
                    $array[] = $value;
        }
        $encode = $obj->createUnidad($array);
        break;
}

echo json_encode($encode);
?>