<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');

class MUser extends CRUD {
    protected $util;
    public function __construct(){
        $this->util = new Utileria;
    }

    // Companies
    function lsCompany($array){
        $query = "
            SELECT
                com.id,
                com.social_name,
                com.address,
                com.rfc,
                com.logo,
                com.rute,
                com.ubication,
                com.phone
            FROM
            fayxzvov_admin.companies AS com
            LEFT JOIN subsidiaries AS sub ON companies_id = com.id
            LEFT JOIN usr_users AS us ON subsidiaries_id = sub.id
            WHERE us.id = ?";

        return $this->_Read($query, $array)[0];
    }

    function updateCompany($array){
        return $this->_Update([
            'table' => 'fayxzvov_admin.companies',
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    function getCompanyById($id){
        $query = "
            SELECT
                com.id,
                com.social_name,
                com.address,
                com.rfc,
                com.logo,
                com.rute,
                com.ubication,
                com.phone
            FROM
            fayxzvov_admin.companies AS com
            LEFT JOIN subsidiaries AS sub ON companies_id = com.id
            LEFT JOIN usr_users AS us ON subsidiaries_id = sub.id
            WHERE com.id = ?";

        return $this->_Read($query, [$id])[0];
    }



    // Sucursal
    function lsSucursal($d){
        $query = "SELECT

        subsidiaries.id,
            subsidiaries.name as valor,
            subsidiaries.companies_id
        FROM
        subsidiaries
        WHERE companies_id = ?
            ";

        return $this->_Read($query, $d);
    }

    function lsRol(){
        $query = "SELECT
            usr_rols.id as id ,
            usr_rols.rols as valor
            FROM
            usr_rols  ";

        return $this->_Read($query, null);
    }



    // Users
    function listUsers($array){
        $query = "
        SELECT
            usr_users.id,
            subsidiaries.name as sucursal,
            usr_users.fullname,
            usr_users.user,
            usr_users.active,
            usr_rols.rols

            FROM
            usr_users
            INNER JOIN subsidiaries ON usr_users.subsidiaries_id = subsidiaries.id
            INNER JOIN usr_rols ON usr_users.usr_rols_id = usr_rols.id
            INNER JOIN fayxzvov_admin.companies ON subsidiaries.companies_id = fayxzvov_admin.companies.id
            WHERE usr_users.active = ?
            AND fayxzvov_admin.companies.id = ?

            ";

        return $this->_Read($query, $array);
    }

    function getUserByID($array){
        $query = "
        SELECT
            usr_users.user,
            subsidiaries_id,
            usr_users.fullname,

            usr_users.usr_rols_id
            FROM
            usr_users
            INNER JOIN subsidiaries ON usr_users.subsidiaries_id = subsidiaries.id
            INNER JOIN usr_rols ON usr_users.usr_rols_id = usr_rols.id
            WHERE usr_users.id = ?

            ";

        return $this->_Read($query, $array);
    }

    function existsUserByName($array){
        $res = $this->_Select([
            'table' => 'usr_users',
            'values' => 'id',
            'where' => 'LOWER(user) = LOWER(?) AND (active = 1 OR enabled = 1) AND subsidiaries_id = ?',
            'data' => $array
        ]);
        return count($res) > 0; // TRUE si hay otro con ese nombre
    }

    function existsOtherUserByName($array){
        $res = $this->_Select([
            'table' => 'usr_users',
            'values' => 'id',
            'where' => 'LOWER(user) = LOWER(?) AND id != ? AND (active = 1 OR enabled = 1) AND subsidiaries_id = ?',
            'data' => $array
        ]);
        return count($res) > 0; // TRUE si hay otro con ese nombre
    }

    function createUser($array){
           $query	=
            "INSERT INTO
            usr_users
            (fullname, date_creation, usr_rols_id, user, subsidiaries_id, `key`)
            VALUE (?,?,?,?,?,MD5(?))";

           return  $this->_CUD($query,$array);
    }

    function updateUser($array){
        $query = "UPDATE usr_users SET usr_rols_id = ?, user = ?, fullname = ?, subsidiaries_id = ?";

        $data = [
            $array['usr_rols_id'],
            $array['user'],
            $array['fullname'],
            $array['subsidiaries_id']
        ];

        // Si hay nueva contraseña, agregar al update
        if (!empty($array['key'])) {
            $query .= ", `key` = MD5(?)";
            $data[] = $array['key'];
        }

        $query .= " WHERE id = ?";
        $data[] = $array['id'];

        return $this->_CUD($query, $data);
    }

    function deleteUsr($array){
        return $this->_Update([
        'table' => "usr_users",
        'values' => $array['values'],
        'where' => $array['where'],
        'data' => $array['data']
        ]);
    }



    // Sucursales
    function listSucursales($array){
        $query = "
        SELECT
            fayxzvov_alpha.subsidiaries.id as id,
            fayxzvov_alpha.subsidiaries.name as name,
            fayxzvov_alpha.subsidiaries.ubication,
            fayxzvov_alpha.subsidiaries.logo as logo,
            fayxzvov_admin.companies.social_name,
            subsidiaries.active,
            DATE_FORMAT(date_creation, '%d-%m-%Y') AS date_creation
            FROM
            fayxzvov_alpha.subsidiaries
            INNER JOIN fayxzvov_admin.companies ON fayxzvov_alpha.subsidiaries.companies_id = fayxzvov_admin.companies.id
            WHERE subsidiaries.active = ?
            AND fayxzvov_admin.companies.id = ? 
        ";
        return $this->_Read($query, $array);
    }

    function getSucursalById($array){
        $query = "
        SELECT
            fayxzvov_alpha.subsidiaries.name as name,
            fayxzvov_alpha.subsidiaries.id as id,
            fayxzvov_alpha.subsidiaries.ubication,
            fayxzvov_admin.companies.social_name
            FROM
            fayxzvov_alpha.subsidiaries
            INNER JOIN fayxzvov_admin.companies ON fayxzvov_alpha.subsidiaries.companies_id = fayxzvov_admin.companies.id
            WHERE subsidiaries.id = ?
        ";
        return $this->_Read($query, $array);
    }

    function existsSucursalByName($array){
        $res = $this->_Select([
            'table' => 'subsidiaries',
            'values' => 'id',
            'where' => 'LOWER(name) = LOWER(?) AND (active = 1 OR enabled = 1) AND companies_id = ?',
            'data' => $array
        ]);
        return count($res) > 0; // TRUE si ya existe
    }

    function existsOtherSucursalByName($array){
        $res = $this->_Select([
            'table' => 'subsidiaries',
            'values' => 'id',
            'where' => 'LOWER(name) = LOWER(?) AND id != ? AND (active = 1 OR enabled = 1) AND companies_id = ?',
            'data' => $array
        ]);
        return count($res) > 0; // TRUE si ya existe
    }

    function createSucursal($array){
        return $this->_Insert([
            'table'  => "subsidiaries",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }

    function updateSucursal($array){

        return $this->_Update([
            'table'  => "subsidiaries",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function deleteSuc($array){
        return $this->_Update([
            'table'  => "subsidiaries",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }



    // Clausulas
    function listClausulas($array){
        $query = "
            SELECT
                fayxzvov_alpha.evt_clausules.id AS id,
                fayxzvov_alpha.evt_clausules.name AS name,
                fayxzvov_admin.companies.social_name,
                fayxzvov_alpha.evt_clausules.active,
                DATE_FORMAT(date_creation, '%d-%m-%Y') AS date_creation
            FROM
                fayxzvov_alpha.evt_clausules
            INNER JOIN fayxzvov_admin.companies ON fayxzvov_alpha.evt_clausules.companies_id = fayxzvov_admin.companies.id
            WHERE
                evt_clausules.active = ?
            AND fayxzvov_admin.companies.id = ?
        ";
        return $this->_Read($query, $array);
    }
    
    function getClausulaById($array){
        $query = "
            SELECT
                fayxzvov_alpha.evt_clausules.name AS name,
                fayxzvov_alpha.evt_clausules.id AS id,
                fayxzvov_admin.companies.social_name
            FROM
                fayxzvov_alpha.evt_clausules
            INNER JOIN fayxzvov_admin.companies ON fayxzvov_alpha.evt_clausules.companies_id = fayxzvov_admin.companies.id
            WHERE
                evt_clausules.id = ?
        ";
        return $this->_Read($query, $array);
    }

    function existsClausulaByName($array){
        $res = $this->_Select([
            'table' => 'fayxzvov_alpha.evt_clausules',
            'values' => 'id',
            'where' => 'LOWER(name) = LOWER(?) AND active = 1 AND companies_id = ?',
            'data' => $array
        ]);
        return count($res) > 0; // TRUE si ya existe
    }

    function existsOtherClausulaByName($array){
        $res = $this->_Select([
            'table' => 'fayxzvov_alpha.evt_clausules',
            'values' => 'id',
            'where' => 'LOWER(name) = LOWER(?) AND id != ? AND active = 1 AND companies_id = ?',
            'data' => $array
        ]);
        return count($res) > 0; // TRUE si ya existe
    }

    function createClausula($array){
        return $this->_Insert([
            'table'  => "fayxzvov_alpha.evt_clausules",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }

    function updateClausula($array){
        return $this->_Update([
            'table'  => "fayxzvov_alpha.evt_clausules",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function deleteClausula($array){
        return $this->_Update([
            'table'  => "fayxzvov_alpha.evt_clausules",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

}
?>
