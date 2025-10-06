
            <?php
            if(empty($_POST['opc'])) exit(0);


            require_once('../mdl/mdl-agregar-subreceta.php');
            $obj = new Agregarsubreceta;

            $encode = [];
            switch ($_POST['opc']) {
            case 'listUDN':
                    $encode = $obj->lsUDN();
                break;
            }

            echo json_encode($encode);
            ?>