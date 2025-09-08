# CRUD.md

## DATOS TECNICOS.
EL CRUD (Create, READ, UPDATE Y DELETE) se ha establecido en este archivo, para facilitar el llamado de las diferentes Querys a la base de datos.
Forma parte de la creación de los modelos.


## Workflow:
- El archivo debe iniciar con un acceso a la configuración de la conexion(`require('_Conect.php'`).

- Esta dividido en diferentes Querys, para facilitar su uso.


### _CUD (Create, Update, Delete)
**Nombre** _CUD(string $query, array $values)
**Propósito** Ejecuta consultas de escritura (INSERT, UPDATE, DELETE) mediante PDO usando bindParam dinámico y seguro.
**Tipo** Interna / compartida por _Insert, _Update, _Delete.
**Tipo de retorno** bool (true si ejecutó correctamente, false si no; puede retornar null si hay excepción y no se maneja).

**Lógica general**

- Se conecta a la base de datos ($this->connect()).
- Prepara la sentencia SQL ($query).
- Vincula los datos ($values) a los placeholders ? usando bindParam.
- Soporta tanto arrays simples (['valor1', 'valor2']) como múltiples filas ([[fila1], [fila2]]).
- Ejecuta la consulta y retorna el resultado (true o false).
- En caso de error, lo registra en un log (writeToLog).

Código:
```php
    public function _CUD($query, $values) {
        try {
            $this->connect();
            $stm = $this->mysql->prepare($query);

            // Verificar si $values es un array multidimensional
            $isMultidimensional = is_array($values) && is_array($values[0]);

            //Se recorre la variable $values para iterar correctamente los datos
            foreach($values as $key => $row){
                // Si es multidimensional, vincular cada valor en la fila
                if ($isMultidimensional) {
                    foreach ($row as $colKey => $colValue) {
                        $num = ($key * count($row)) + $colKey + 1;
                        $stm->bindParam($num, $values[$key][$colKey]);
                    }
                } else {
                    // Si es un array simple, vincular cada valor directamente
                    $num = $key + 1;
                    $stm->bindParam($num, $values[$key]);
                }
            }

            // Almacenamos el resultado de la ejecución
            $result = $stm->execute();
            // Cerrar la conexión después de realizar la consulta
            $this->disconnect();
            // Retornamos el resultado
            return $result;
        } catch (PDOException $e) {
            $message  =  "[ INFO ] ::  $query";
            $message .=  "\n[ ERROR C.U.D. ] :: ". $e->getMessage()."\n";
            $this->writeToLog($message);
        }
    }
```

### _Read()

**Nombre**: _Read(sql, params = null, retorno = false).

**Proposito**: Ejecuta una consulta SELECT preparada con PDO, retornando todas las filas como arreglo asociativo.
Acepta parámetros posicionales de tipo (?)

**Parámetros**:

- sql (string): Consulta SQL con placeholders.
- params (array|null): Valores para los placeholders. Opcional.
- retorno (bool): Si true, no ejecuta; devuelve ['_debug_sql','_debug_params'].

**Devuelve**: array de filas ([] en error o sin resultados).

Funcion _Read()
```php
    function _Read($query, $values = null,$retorno = false) {
        try {

            $this->connect();
            $stm = $this->mysql->prepare($query); // prepara la consulta para recibir los datos.


            if (!isset($values)) { // consulta simple sin data.
                $stm->execute();

        } else { // consulta con parametros has el recorrido.
                foreach($values as $key => $value){
                    $num = $key + 1;
                    $stm->bindParam($num,$values[$key]);
                }

                $stm->execute();
            }

            //almacenamos el resultado de la consulta en una variable para poder retornarla
            $result = $stm->fetchAll(PDO::FETCH_ASSOC);

            // Cerrar la conexión después de realizar la consulta
            $this->disconnect();

            return $result;

        } catch (PDOException $e) {
            $message  =  "[ INFO ] ::  $query";
            $message .=  "\n[ ERROR READ] :: ". $e->getMessage()."\n";
            $this->writeToLog($message);
        }
    }

```

Ejemplo de uso:
```php
    function getUserByid($array){

        $sql = "SELECT * FROM usuarios WHERE id = ?";
        return $this->_Read($sql,$array, true);
    }
```

### _Insert()
**Nombre**: _Insert(array $array, string|bool $tbSQL = '', bool $string = false)

**Propósito**: Construir y ejecutar (o devolver como string) una sentencia INSERT INTO con placeholders ?, aceptando inserciones simples o múltiples y validando que las columnas coincidan con los datos.

**Parámetros**

- $array (array, requerido)
- table (string): nombre de la tabla destino.
- values (array|string): lista de columnas; puede ser array o cadena separada por comas.
- data (array|array[]|string):
- Array simple: una fila ([v1, v2, ...]).
- Array de arrays: múltiples filas ([[v1,v2,...],[w1,w2,...]]).
- $tbSQL (string|bool, opcional):

- Si es string no vacío, sobreescribe table.
- Si es bool true, activa el modo $string = true (devolver SQL).
- $string (bool, opcional): si es true, no ejecuta y devuelve el SQL generado.

**Devuelve**

- string cuando $string === true (consulta SQL generada).

- De otro modo, el resultado de $this->_CUD($query, $data) (depende de la implementación de _CUD, p. ej., filas afectadas/éxito).

```php

    public function _Insert($array,$tbSQL = '',$string = false){

        // Verificamos que el data no este vacío
        if(!empty($array['data'])){
            $data = $array['data'];
            $tabla = $array["table"];

            if (is_string($tbSQL) && $tbSQL != '' ) $tabla = $tbSQL;
            else if(is_bool($tbSQL) && $tbSQL == true ) $string = true;

            $valueMatch = is_array($array["values"]) ? $array["values"] : array_map("trim",explode(",",$array["values"]));

            // Comprobamos si 'data' es una inserción múltiple o simple

            if (is_array($data) && is_array($data[0])) {
                // Validamos que cada subarray en 'data' tenga la misma longitud que 'valueMatch'
                foreach ($data as $row) {
                    if (count($row) !== count($valueMatch)) return "VALUES \ DATA => DOES NOT MATCH INSERT";
                }
            } else {
                // Validamos que 'data' tenga la misma longitud que 'valueMatch'
                if (count($data) !== count($valueMatch))  return "VALUES \ DATA => DOES NOT MATCH INSERT";
            }

            // Obtenemos los values si es un array lo convertirmos a string
            $values = is_array($array["values"]) ? implode(",", $array["values"]) : $array["values"];

            $placeholders = ""; // Valores temporales "?"

            // Comprobamos si el data es un array multiple
            if (is_array($data) && is_array($data[0]))  {
                // Creamos un array de los grupos [(?), (?), (?)]
                $group = [];
                foreach ($data as $key => $row)
                    $group[] = "(" . implode(",", array_fill(0, count($row), '?')) . ")";

                // Lo convertimos a string
                $placeholders = implode(", ", $group);
            } else {
                // Si data es un solo array, convertimos sus valores a placeholders "?"
                // Si data es un string lo convertimos array y luego convertimos sus valores a placeholders "?"
                $placeholders = is_array($data)
                            ? "(".implode(",", array_fill(0, count($data), '?')).")"
                            : "(".implode(",", array_fill(0, count(explode(",",$data)), '?')).")";
            }

            $query = "INSERT INTO {$tabla} ({$values}) VALUES {$placeholders}";
            if($string) return $query;
            else return $this->_CUD($query,$data);

        } else return "¡NO DATA!";
    }

```

```php
    // Funcion simple
     function add($array){ // recibir del ctrl

         return $this->_Insert([
             'table'  => "{$this->bd}name_bd",
             'values' => $array['values'],
             'data'   => $array['data'],
         ]);
     }


//  insert multiple rows

    $array = [
        'table'  => 'users',
        'values' => 'name,email,role_id',
        'data'   => [
            ['Rosa','rosa@example.com',2],
            ['Somx','somx@example.com',1],
        ]
    ];



    $result = $this->_Insert($array);

    // Esperado: INSERT INTO users (name,email,role_id) VALUES (?, ?, ?), (?, ?, ?)


```


### _Update()
**Nombre**: _Update(array $array, string|bool $tbSQL = '', bool $string = false)

**Propósito**: Construir una sentencia UPDATE ... SET ... WHERE ... con placeholders ? para ejecutar vía _CUD,  o devolver el SQL en modo preview. Valida que la cantidad de datos coincida con el número de placeholders generados.

Parámetros:

- array $array
- table (string): nombre de la tabla.
- values (array|string): campos para SET. Cada elemento puede ser:
- Solo el nombre del campo (ej. name) → se transforma en name = ?.
- Una expresión completa (ej. updated_at = NOW()) → se respeta tal cual.
- Una expresión con ? (ej. qty = qty + ?) → se respeta y se cuentan sus ?.
- where (array|string, opcional): condiciones WHERE. Igual lógica que values; si solo viene el campo (ej. id) → id = ?. Si incluye operador/?, se respeta (ej. status <> ?, name LIKE ?).
- data (array): valores en orden de aparición de los ?: primero los del SET, luego los del WHERE.
- string|bool $tbSQL:
- Si es string (no vacío): sobreescribe table.
- Si es bool true: activa modo preview ($string = true).
- bool $string: si true, no ejecuta; devuelve el SQL generado.

**Devuelve**:

- string con el SQL si $string === true.
- Si no, el resultado de $_CUD($query, $data) (p. ej., filas afectadas / éxito).

```php
    public function _Update($array,$tbSQL = '',$string = false){
        if(!empty($array['data'])) {
            $data = $array['data'];
            $tabla = $array["table"];

            if (is_string($tbSQL) && $tbSQL != '' ) $tabla = $tbSQL;
            else if(is_bool($tbSQL) && $tbSQL == true ) $string = true;

            $placeholders = 0;
            $values = "";
            if (!empty($array["values"])) {
                $campos = is_array($array["values"]) ? $array["values"] : explode(",",$array["values"]);
                foreach ($campos as $key => $row) {
                    if(strpos($row,"=")) $values .= "$row,";
                    else {
                        $values .= "$row = ?,";
                        $placeholders++;
                    }

                    if( strpos($row,"=") && strpos($row,"?")) $placeholders++;
                }
                $values = rtrim($values,",");
            }

            $where = "";
            if (!empty($array["where"])) {
                $condicion = is_array($array["where"]) ? $array["where"] : explode(",",$array["where"]);
                foreach ($condicion as $key => $row) {
                    if(strpos($row,"=") || strpos(mb_strtoupper($row),"LIKE") ) $where .= "$row AND ";
                    else {
                        $where .= "$row = ? AND ";
                        $placeholders++;
                    }

                    if( ( strpos($row,"=") || strpos($row,"<") || strpos($row,">") ) && strpos($row,"?")) $placeholders++;
                }
                $where = "WHERE ".rtrim($where," AND ");
            }


            if(count($data) === $placeholders){
                $query = "UPDATE {$tabla} SET {$values} {$where}";
                if($string) return $query;
                else return $this->_CUD($query,$data);
            } else return "VALUES \ WHERE \ DATA => DOES NOT MATCH UPDATE";
        } else return "¡NO DATA!";
    }

```

```php
// Ejemplo de uso:
    // funcion simple
    function update($array){

        return $this->_Update([
            'table'  => "{$this->bd}name_bd",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }


```

### _Delete()

**Nombre** _Delete(array $array, string|bool $tbSQL = '', bool $string = false)

**Propósito**
Construye una sentencia DELETE FROM ... WHERE ... con placeholders ?, y la ejecuta (o devuelve como string) validando que las condiciones where coincidan con los datos enviados.

**Parámetros**

- array $array
- table (string): nombre de la tabla.
- where (array|string): condiciones para el WHERE.
- Puede ser una lista de campos: ['id', 'status'] O expresiones directas: ['id = ?', 'status = ?']
- data (array): valores a aplicar en los placeholders ?.
- Debe tener la misma longitud que los ? generados en el WHERE.
- string|bool $tbSQL
- Si es string no vacío, sobreescribe table.
- Si es bool true, activa modo preview ($string = true).
- bool $string:
- Si es true, devuelve el SQL sin ejecutar.

**Devuelve**
- string del SQL si $string === true.
- Resultado de $this->_CUD(...) si se ejecuta.
- String de error si hay desajustes.

** Código de _delete() **
```php
    public function _Delete($array,$tbSQL = '',$string = false){
        if(!empty($array['data']) && !empty($array['where'])) {
            $tabla = $array["table"];

            if (is_string($tbSQL) && $tbSQL != '' ) $tabla = $tbSQL;
            else if(is_bool($tbSQL) && $tbSQL == true ) $string = true;

            $where = "";
            $condicion = is_array($array["where"]) ? $array["where"] : explode(",",$array["where"]);

            if(count($condicion) === count($array['data'])){
                foreach ($condicion as $key => $row) $where .= "$row = ? AND ";
                $where = rtrim($where," AND ");

                $query = "DELETE FROM {$tabla} WHERE {$where}";
                if($string) return $query;
                else return $this->_CUD($query,$array['data']);
            } else return "WHERE \ DATA => DOES NOT MATCH DELETE";
        } else return "¡NO DATA, NO WHERE!";
    }

```



### _Select ()

**Nombre** _Select(array|string $array, bool $string = false)

**Propósito**
Construye una consulta SQL SELECT de forma dinámica, con soporte para múltiples joins, condiciones, agrupamientos, ordenamientos y límites.
Devuelve el resultado (o el SQL generado si se indica).

**Ejemplo de uso **
```php
    // 1.- SELECT simple
    $params = [
    'table'  => 'usuarios',
    'values' => ['id', 'nombre', 'correo'],
    'where'  => ['status'],
    'data'   => [1]
    ];

    $this->_Select($params);

    // 2.- INNER JOIN con WHERE compuesto
    $params = [
        'table'     => 'ventas',
        'values'    => '*',
        'innerjoin' => [
            'clientes' => ['ventas.cliente_id', 'clientes.id']
        ],
        'where'     => ['ventas.fecha BETWEEN ? AND ?', 'clientes.status'],
        'data'      => ['2023-01-01', '2023-12-31', 'activo']
    ];

    $this->_Select($params);


```
