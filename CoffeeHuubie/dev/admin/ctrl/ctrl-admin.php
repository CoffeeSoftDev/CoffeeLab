<?php
session_start();
if (empty($_POST['opc'])) exit(0);

require_once '../mdl/mdl-admin.php';
class User extends MUser{

    function init(){

       $id_subsidiarie = isset($_SESSION['SUB']) ? $_SESSION['SUB'] : 1;

        return [
            'sucursal'    => $this -> lsSucursal([$id_subsidiarie]),
            'rol'         => $this -> lsRol(),
            'companies'   => $this -> lsCompany([$_SESSION['USR']]),
            'nameCompany' => $_SESSION['COMPANY']
        ];

    }

    // Company
    function editPhotoCompany() {
        $status = 500;
        $message = 'Error al actualizar el logo de la empresa';

        $companyId = $_POST['id'];

        if (!isset($_FILES['logo']) || $_FILES['logo']['error'] != UPLOAD_ERR_OK) {
            return [
                'status' => 400,
                'message' => 'No se recibió ninguna imagen válida'
            ];
        }

        // Obtener datos anteriores
        $prevData = $this->getCompanyById($companyId);
        if (!empty($prevData['logo'])) {
            $oldFile = $_SERVER['DOCUMENT_ROOT'] . '/alpha' . $prevData['logo'];
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }
        }

        // Guardar nueva imagen
        $ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
        $fileName = "logoCompany" . $companyId . "_" . date('Ymd_His') . "." . $ext;
        $filePath = "../../src/img/logo/" . $fileName;
        $photoPath = "/src/img/logo/" . $fileName;

        if (!move_uploaded_file($_FILES['logo']['tmp_name'], $filePath)) {
            return [
                'status' => 500,
                'message' => 'No se pudo guardar la nueva imagen'
            ];
        }

        // Actualizar en la base de datos
        $data = [
            'logo' => $photoPath,
            'id' => $companyId,
        ];

        $update = $this->updateCompany($this->util->sql($data, 1));

        if ($update) {
            $status = 200;
            $message = 'Logo actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    function editCompany() {
        $status = 500;
        $message = 'Error al editar la empresa';

        // $update = $this->updateUser($this->util->sql($_POST, 1));
          $update = $this->updateCompany($this->util->sql($_POST, 1));


        if ($update) {
            $status = 200;
            $message = 'Empresa actualizada correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Users
    function lsUsers(){
        // 📜 Obtener parámetros de la solicitud
        $__row = [];

        #Consultar a la base de datos
        $ls = $this->listUsers([$_POST['active'], $_POST['idCompany']]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                // Si el usuario está activo
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'usuarios.editar('.$key['id'].')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'usuarios.toggleStatus('.$key['id'].',0)'
                ];
            } else {
                // Si está inactivo, solo mostrar reactivación
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'usuarios.toggleStatus('.$key['id'].',1)'
                ];
            }

        // 🔵 Agregar datos a la fila
            $__row[] = [
                'id'       => $key['id'],
                'User'     => $key['user'],
                'Nombre'   => $key['fullname'],
                'Rol'      => $key['rols'],
                'Sucursal' => $key['sucursal'],
                'a'        => $a,
            ];
        }

        // 📜 Encapsular y retornar datos
        return [
            "row" => $__row,
            'ls'  => $ls,
        ];
    }

    function getUser(){

        $status = 500;
        $message = 'Error al obtener los datos ';
        $lsUser = $this->getUserByID([$_POST['id']]);

         if ($lsUser) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $lsUser[0]
        ];
    }

    function addUser() {
        $status  = 500;
        $message = 'No se pudo insertar el usuario';

        // Validación del nombre de usuario
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $_POST['user'])) {
            return [
                'status'  => 422,
                'message' => 'El nombre de usuario solo puede contener letras, números y guiones bajos.'
            ];
        }

        // Validar que el usuario no exista
        $exists = $this->existsUserByName([$_POST['user'], $_SESSION['SUB']]);
        if ($exists) {
            return [
                'status' => 400,
                'message' => 'El nombre de usuario ya está en uso por otro usuario.'
            ];
        }

        $__values = [
            $_POST['fullname'],
            date('Y-m-d H:i:s'),
            $_POST['usr_rols_id'],
            $_POST['user'],
            $_POST['subsidiaries_id'],
            $_POST['key'],
        ];
        // Crear el usuario
        $create = $this->createUser($__values);

        if ($create) {
            $status  = 200;
            $message = 'Usuario creado correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    function editUser() {
        $group = null;
        $status = 500;
        $message = 'Error al editar';

        // Validación del nombre de usuario
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $_POST['user'])) {
            return [
                'status'  => 422,
                'message' => 'El nombre de usuario solo puede contener letras, números y guiones bajos.'
            ];
        }

        // Validar que el usuario no exista
        $exists = $this->existsOtherUserByName([$_POST['user'], $_POST['id'], $_SESSION['SUB']]);
        if ($exists) {
            return [
                'status' => 400,
                'message' => 'El nombre de usuario ya está en uso por otro usuario.'
            ];
        }

        $edit = $this->updateUser($_POST);

        if ($edit == true) {
            $status = 200;
            $message = 'Se ha editado correctamente';
        }
        return [
            'status' => $status,
            'message' => $message,
        ];
    }

    function toggleStatusUser(){
        $status = 500;
        $message = 'Error al cambiar el estado del usuario';
        $delete = $this->deleteUsr($this->util->sql($_POST, 1));

        if ($delete == true) {
            $status = 200;
            $message = 'Ha cambiado exitosamente el estado del usuario.';
        }

        return [
            'status'  => $status,
            'message' => $message,
            $delete
        ];
    }

    // Sucursal.
    function lsSucursales() {
        $__row = [];
        $ls = $this->listSucursales([$_POST['active'], $_POST['idCompany']]);

        foreach ($ls as $key) {
            
            $a = [];

            if ($key['active'] == 1) {
                // Activa: permite editar y desactivar
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'sucursales.edit('.$key['id'].')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'sucursales.toggleStatus('.$key['id'].',0)'
                ];
            } else {

                // Inactiva: solo opción de reactivar
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'sucursales.toggleStatus('.$key['id'].',1)'
                ];
            }

            $__row[] = [
                
                'id'             => $key['id'],
                'Empresa'        => $key['social_name'],
                'Sucursal'       => $key['name'],
                'Ubicación'      => $key['ubication'],
                'Fecha creación' => $key['date_creation'],
                'a'              => $a,
            ];
        }

        return [
            "row" => $__row,
            'ls'  => $ls,
        ];
    }

    function getSucursal() {
        $status = 500;
        $message = 'Error al obtener los datos';

        $data = $this->getSucursalById([$_POST['id']]);

        if ($data) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
        }

        return [
            'status'   => $status,
            'message'  => $message,
            'data'     => $data[0],
        ];
    }

    function addSucursal() {
        $status                 = 500;
        $message                = 'No se pudo agregar la sucursal';
        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['companies_id']  = $_SESSION['COMPANY_ID'];
        $_POST['active']        = 1; // Por defecto, la sucursal se crea activa

        // Validar que el nombre de la sucursal no exista
        $exists = $this->existsSucursalByName([$_POST['name'], $_SESSION['COMPANY_ID']]);
        if ($exists) {
            return [
                'status'  => 400,
                'message' => 'El nombre de la sucursal ya está en uso por otra sucursal.'
            ];
        }

        // Crear la sucursal
        $save = $this->createSucursal($this->util->sql($_POST));

        if ($save) {
            $status = 200;
            $message = 'Sucursal registrada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    function editSucursal() {
        $status = 500;
        $message = 'Error al editar';

        // Validar que el nombre de la sucursal no exista
        $exists = $this->existsOtherSucursalByName([$_POST['name'], $_POST['id'], $_SESSION['COMPANY_ID']]);
        if ($exists) {
            return [
                'status'  => 400,
                'message' => 'El nombre de la sucursal ya está en uso por otra sucursal.'
            ];
        }

        // Actualizar la sucursal
        $edit = $this->updateSucursal($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Sucursal actualizada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    function toggleStatusSucursal() {
        $status = 500;
        $message = 'Error al cambiar el estado de la sucursal';

        $delete = $this->deleteSuc($this->util->sql($_POST, 1));

        if ($delete) {
            $status = 200;
            $message = 'Ha cambiado exitosamente el estado de la sucursal.';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    // Clausulas
    function lsClausulas() {
        $__row = [];
        $ls = $this->listClausulas([$_POST['active'], $_POST['idCompany']]);

        foreach ($ls as $key) {
            $a = [];

            if ($key['active'] == 1) {
                // Activa: permite editar y desactivar
                $a[] = [
                    'class'   => 'btn btn-sm btn-primary me-1',
                    'html'    => '<i class="icon-pencil"></i>',
                    'onclick' => 'clausulas.edit('.$key['id'].')'
                ];

                $a[] = [
                    'class'   => 'btn btn-sm btn-danger',
                    'html'    => '<i class="icon-toggle-on"></i>',
                    'onclick' => 'clausulas.toggleStatus('.$key['id'].',0)'
                ];
            } else {
                // Inactiva: solo opción de reactivar
                $a[] = [
                    'class'   => 'btn btn-sm btn-outline-danger',
                    'html'    => '<i class="icon-toggle-off"></i>',
                    'onclick' => 'clausulas.toggleStatus('.$key['id'].',1)'
                ];
            }

            $__row[] = [
                'id'       => $key['id'],
                'Nombre'   => $key['name'],
                // 'Empresa'  => $key['social_name'],
                'Fecha creación' => $key['date_creation'],
                'a'        => $a,
            ];
        }

        return [
            "row" => $__row,
            'ls'  => $ls,
        ];
    }

    function getClausula() {
        $status = 500;
        $message = 'Error al obtener los datos';

        $data = $this->getClausulaById([$_POST['id']]);

        if ($data) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
        }

        return [
            'status'   => $status,
            'message'  => $message,
            'data'     => $data[0],
        ];
    }

    function addClausula() {
        $status  = 500;
        $message = 'No se pudo agregar la cláusula';
        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['companies_id']  = $_SESSION['COMPANY_ID'];

        // Validar que el nombre de la cláusula no exista
        $exists = $this->existsClausulaByName([$_POST['name'], $_POST['companies_id']]);
        if ($exists) {
            return [
                'status'  => 400,
                'message' => 'El nombre de la cláusula ya está en uso por otra cláusula.'
            ];
        }

        // Crear la cláusula
        $save = $this->createClausula($this->util->sql($_POST));

        if ($save) {
            $status = 200;
            $message = 'Cláusula registrada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message,
             $_SESSION['COMPANY_ID']   
        ];
    }

    function editClausula() {
        $status = 500;
        $message = 'Error al editar';

        // Validar que el nombre de la cláusula no exista
        $exists = $this->existsOtherClausulaByName([$_POST['name'], $_POST['id'], $_SESSION['COMPANY_ID']]);
        if ($exists) {
            return [
                'status'  => 400,
                'message' => 'El nombre de la cláusula ya está en uso por otra cláusula.'
            ];
        }
        // Actualizar la cláusula
        $edit = $this->updateClausula($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Cláusula actualizada correctamente';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    function toggleStatusClausula() {
        $status = 500;
        $message = 'Error al cambiar el estado de la cláusula';

        $delete = $this->deleteClausula($this->util->sql($_POST, 1));

        if ($delete) {
            $status = 200;
            $message = 'Ha cambiado exitosamente el estado de la cláusula.';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

}

    $obj    = new User();
    $fn     = $_POST['opc'];
    $encode = [];
    $encode = $obj->$fn();
    echo json_encode($encode);
?>
