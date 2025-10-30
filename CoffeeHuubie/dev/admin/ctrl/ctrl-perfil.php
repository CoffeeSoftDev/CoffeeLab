<?php
session_start();
if (empty($_POST['opc'])) exit(0);

require_once '../mdl/mdl-perfil.php';

class ctrl extends mdl {
    // INFORMACIÓN DE USUARIO
    function getUser() {
        $id = $_SESSION['USR'];
        $status = 404;
        $message = 'Usuario no encontrado';
        $data = null;

        $usuario = $this->getUserById($id);

        if ($usuario > 0) {
            $status  = 200;
            $message = 'Usuario encontrado';

            if (!empty($usuario['photo'])) {
                $usuario['photo'] = 'https://huubie.com.mx/alpha' . $usuario['photo'];
            }

            $data    = [
                'id'              => $usuario['id'],
                'user'            => $usuario['user'],
                'phone'           => $usuario['phone'],
                'active'          => $usuario['active'],
                'subsidiaries_id' => $usuario['subsidiaries_id'],
                'photo'           => $usuario['photo'],
                'fullname'        => $usuario['fullname'],
                'date_creation'   => $usuario['date_creation'],
                'birthday'        => $usuario['birthday'],
                'rol'             => $usuario['rol'],
                'subsidiary'      => $usuario['subsidiary'],
                'company'         => $usuario['company'],
                'ubication'       => $usuario['ubication']
            ];  
        }

        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data,
            $usuario
        ];
    }

    function editUser() {
        $status = 500;
        $message = 'Error al editar usuario';

        $idUser = $_SESSION['USR'];
        $fullname = $_POST['fullname'];
        $user = $_POST['user'];
        $phone = $_POST['phone'];
        $birthday = $_POST['birthday'];

        // Validar que el usuario no exista
        $exists = $this->existsOtherUserByName([$user, $idUser, $_SESSION['SUB']]);
        if (!$exists) {
            return [
                'status' => 400,
                'message' => 'El nombre de usuario ya está en uso por otro usuario.'
            ];
        }

        $photoPath = "";
        // Validar si se cargó una foto
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] == UPLOAD_ERR_OK) {

            // Obtener foto anterior
            $prevData = $this->getUserById($idUser);
            if (!empty($prevData['photo'])) {
                $oldFile = $_SERVER['DOCUMENT_ROOT'] . '/alpha' . $prevData['photo'];
                if (file_exists($oldFile)) {
                    unlink($oldFile); // Eliminar archivo anterior
                } else {
                    return [
                        'status' => 500,
                        'message' =>  $oldFile
                    ];
                }
            }

            // Guardar nueva foto
            $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
            $fileName = "fotoUser" . $idUser . "_" . date('Ymd_His') . "." . $ext;
            $filePath = "../../src/img/perfil/" . $fileName;
            $photoPath = "/src/img/perfil/" . $fileName;

            if (!move_uploaded_file($_FILES['photo']['tmp_name'], $filePath)) {
                return [
                    'status' => 500,
                    'message' => 'Error al guardar la nueva imagen'
                ];
            }
        }

        $data = [
            'fullname' => $fullname,
            'user'     => $user,
            'phone'    => $phone,
            'birthday' => $birthday,
        ];

        // Si se cargó una foto, agregarla a los datos
        if (!empty($photoPath)) {
            $data['photo'] = $photoPath;
        }

        $data['id'] = $idUser;
        $update = $this->updateUser($this->util->sql($data, 1));

        if ($update) {
            $status = 200;
            $message = 'Usuario actualizado correctamente';
        }

        return [
            'status' => $status,
            'message' => $message
        ];
    }

}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());