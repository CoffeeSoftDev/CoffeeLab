<?php
require_once('../../../conf/_CRUD.php');

class sub extends CRUD{
    private $bd;
    public function __construct(){
        $this->bd = 'rfwsmqex_gvsl_costsys2.';
    }


    function lsSubRecetas($array){

        $query = "

            SELECT
            idSubreceta as id,
            nombre as subreceta,
            precioVenta,
            id_Clasificacion,
            id_Unidad,
            rendimiento,
            fecha,
            id_UDN
            FROM {$this->bd}subreceta
            WHERE id_Clasificacion = ?
            ORDER BY fecha asc
        
        ";

        return $this->_Read($query, $array);
    }

    function GET_SUB($array){
        $name = "";
        $query = "SELECT
            idClasificacion,
            Clasificacion
        FROM
            {$this->bd}clasificacion
        WHERE
            idC = ?
        ";
        $sql = $this->_Read($query, $array);
        foreach ($sql as $key) {
            $name = $key['nombre'];
        }
        return $name;
    }


}


?>
