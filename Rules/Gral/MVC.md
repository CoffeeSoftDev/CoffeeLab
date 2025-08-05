# FRONT-JS.md

## Objetivo General
Desarrollar un archivo JavaScript estructurado y modular, siguiendo estrictamente las convenciones del sistema y buenas prácticas de ingeniería.


### 1.Estructura Base del FRONT-JS
Debe respetarse el formato de CoffeeSoft
- Nombre del archivo bajo la convención:
  `[nombre].js`

- Construir una clase `App` que herede de `Templates`.
 ```JS
    let api = '';
    let app;
    $( async () => {
        const app = new App(api,'root');
        app.init();
    });
    class App extends Template{}
  ```
- El constructor debe recibir dos parámetros: el enlace del controlador (`api`) y el identificador de contenedor principal (`root`).
- El constructor debe de tener la variable PROJECT_NAME 

```
 this.PROJECT_NAME = "projectName";
 ```

- Si dos modulos , el segundo debe heredar la clase App
- Solo genera un submodulo si se necesita
```JS
    class SubModulo extends App{}
```



## Rules
- Se pueden usar pivotes para referencia o templates
- No agreges comentarios a las funciones
- Los nombres de las funciones deben:
  - Estar en inglés.
  - Usar notación `camelCase`.


## La clase debe implementar los siguientes métodos:

- init()
  - Ejecuta el método render().
- render()
  - Ejecuta los métodos layout() y filterBar().
- layout()
  - Se usa para crear la interfaz visual del sistema, se puede usar como referencia primaryLayout de CoffeeSoft
  ```JS
    layout() {
        this.primaryLayout({
            parent: `root`,
            class: 'flex p-2',
            id: this.PROJECT_NAME,
        });
    }
  ```
- filterBar()
  - Implementa el filtro principal utilizando createfilterBar() y configura el componente dataPicker() para capturar rangos de fechas.
```JS
     createFilterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-4",
                    id: "calendar"+this.PROJECT_NAME,
                    lbl: "Consultar fecha: ",
                },
                {
                    opc: "btn",
                    class: "col-sm-2",
                    color_btn: "primary",
                    id: "btn",
                    text: "Buscar",
                    fn: `${this.PROJECT_NAME.toLowerCase()}.ls()`,
                },
            ],
        });

        dataPicker({
            parent: "calendar"+this.PROJECT_NAME,
            onSelect: () => this.ls(),
        });
    }

```

- ls()
  - Carga datos de la tabla utilizando createTable(), incluyendo paginación y configuración responsiva.

  
- add()
  - Despliega un formulario modal mediante createModalForm() para agregar nuevos registros
- edit(id)
  - usa async en las funciones
  - Realiza una consulta asincrónica useFetch({ opc: 'get', id: id }).
  - Posteriormente despliega un formulario modal de edición, usando autofill para precargar los datos obtenidos.
  - El formulario, al ser enviado, debe ejecutar el flujo opc: 'edit'.
- cancel(id)
  - Utiliza swalQuestion() para confirmar la cancelación de un registro, y luego envía la acción opc: 'cancel'.


**Consideraciones Finales**
- Usa los pivotes , templates para generar las funciones



# CTRL.md


# Objetivo
Quiero que generes un **Controlador PHP** siguiendo esta estructura:

- El archivo debe iniciar la sesión PHP (`session_start();`).  
- Validar que `$_POST['opc']` esté definido o salir (`if (empty($_POST['opc'])) exit(0);`).  
- Requerir el modelo correcto (`require_once '../mdl/mdl-[name-project].php';`).  
- Crear una clase `ctrl` que extienda la clase del modelo.
- No agreges comentarios si no son necesarios.
- extiende de `mdl` (nombre base de la clase modelo).
- Respeta las reglas establecidas

```PHP
 class ctrl extends mdl {}
```

Implementar los métodos siguientes dentro de la clase `ctrl`:

## 1. **init()**
- Este método solo se crea si el frontend[JS] utiliza filtros dinámicos (como `select`, `radio`, etc.).
``` PHP
function init() {
        return [
            'udn' => $this->lsUDN(),
            'status'  => $this->lsStatus()
        ];
    }
```

- Cada lista se debe obtener mediante métodos del modelo, como `lsUDN()`, `lsStatus()`, `lsTipos()`, etc.

- El resultado debe retornarse como un arreglo asociativo, listo para ser consumido por JavaScript.

```PHP
    public function init() {
        $lsUDN    = $this->lsUDN();
        $lsStatus = $this->lsStatus();

        return [
            'udn'    => $lsUDN,
            'status' => $lsStatus
        ];
    } 
```

## 2. **ls[Entidad]()**

 Este método debe implementarse siempre que el frontend tenga una tabla con barra de filtros (`filterBar`) y posiblemente un calendario.

- Usa ls() como nombre del método del controlador.

- **Entrada esperada:**
  - Si la barra de filtros incluye un calendario, el método debe recibir las fechas `fi` (fecha inicial) y `ff` (fecha final) desde `$_POST`.

- **Flujo del método:**
  1. Llama al método del modelo `list['Entidad']()`, pasando como parámetros las fechas `fi` y `ff`.
  2. Itera sobre los resultados obtenidos.
  3. Para cada elemento, construye una fila (`$__row[]`) como arreglo asociativo:
     - Incluir campos relevantes como: `id`, fechas, totales, estado, etc.
     - Usar funciones auxiliares como `formatSpanishDate()` para fechas y `evaluar()` para montos si es necesario.
  4. Agrega un campo `dropdown` en cada fila con las opciones de acción disponibles, como `editar`, `eliminar`, etc.
  5. Si las únicas acciones disponibles son `editar` y `eliminar`, no uses dropdown y añade una columna adicional (`a`) en la última celda con botones para estas acciones. 
  6.- Si no se especifica acciones usa `'opc' => 0` 

- **Salida esperada:**
  - El método debe retornar un arreglo con al menos la clave `row`, que contenga el arreglo de filas (`$__row[]`).

  - Ejemplos:
```php
    function ls[Entidad](){

            $__row = [];

            $ls = $this->list['Entidad']([$_POST['id']]);

            foreach ($ls as $key) {
                $__row[] = [

                    'id'    => $key['id'],
                    'valor' => $key['valor'],
                    'price' => evaluar($key['price']) ,
                    'cant ' => $key['cant'] ,
                    'date'  => formatSpanishDate($key['date']),                                     
                    'opc'   => 0                                       
                ];
            }

            return ['row'=> $__row ,'thead' => ''];
    }


  function ls[Entidad]() {
            $__row = [];

            $fi = $_POST['fi'];
            $ff = $_POST['ff'];

            $ls = $this->list['Entidad']([
                'fi' => $fi,
                'ff' => $ff,
             
            ]);

            foreach ($ls as $key) {
                $__row[] = [
                    'id'              => $key['id'],
                    'Creación'        => $key['date'],
                    'Fecha de evento' => formatSpanishDate($key['date_start'], 'normal'),
                    'Horario'         => $key['hours_start'],
                    'Total'           => [
                        "html"  => evaluar($key['total']),
                        "class" => "text-end bg-[#283341]"
                    ],
                    'Estado'   => status($key['estado']),
                    'dropdown' => dropdown($key['id'], $key['estado'])
                ];
            }

            return [
                "row" => $__row,
                'ls'  => $ls,
            ];
        }


```

## 3. **get['Entidad']()**
    Este método recupera los datos de un solo registro de la entidad correspondiente, a partir de un `id` recibido vía POST.

    1. Recibe el `id`.
    2. Llama al método `get[Entidad]ById()` del modelo.
    3. Si los datos son encontrados, retorna `status: 200` y un mensaje de éxito.
    4. Si ocurre un error o no se encuentran datos, retorna `status: 500`.

   Ejemplo de uso:

   ```php
         function getEvent(){
            $status = 500;
            $message = 'Error al obtener los datos';
            $getEvent = $this->getEventById([$_POST['id']]);

        
            if ($getEvent) {
                $status = 200;
                $message = 'Datos obtenidos correctamente.';
            }

            return [
                'status'  => $status,
                'message' => $message,
                'data'    => $getEvent,
            ];
        }
  ```
## 4. **add['Entidad']()** 
    Crea un nuevo registro en la base de datos. Si el campo tiene unicidad lógica, se debe validar previamente.

    1.- Obtener los datos de $_POST, preferentemente usando $this->util->sql($_POST).
    
    2.- Validar si ya existe el registro con exists[Entidad]ByName().

        - Si sí existe, retornar status: 409 con un mensaje adecuado.
        - Si no existe, llamar a create[Entidad]().

    3.- Retornar status: 200 si se crea con éxito, o 500 si falla.

 Ejemplos:

 ```php

    function addProducto() {
            $status = 500;
            $message = 'No se pudo agregar el producto';
            $_POST['date_creation'] = date('Y-m-d H:i:s');

            $exists = $this->exists['Entidad']ByName([$_POST['name']]);

            if ($exists === 0) {
                $create = $this->createProducto($this->util->sql($_POST));
                if ($create) {
                    $status = 200;
                    $message = 'Producto agregado correctamente';
                }
            } else {
                $status = 409;
                $message = 'Ya existe un producto con ese nombre.';
            }

            return [
                'status' => $status,
                'message' => $message,
            ];
        }

 ```

 5. **edit[Entidad]()**
   - Recibe datos por POST.
   - Ejecuta `update[Entidad]()`.
   - Retorna `status` y `message` de actualización.

    Ejemplo:
   ```php

        function editProducto() {
            $id      = $_POST['id'];
            $status  = 500;
            $message = 'Error al editar producto';
            $edit    = $this->updateProducto($this->util->sql($_POST, 1));
            
            if ($edit) {
                $status  = 200;
                $message = 'Producto editado correctamente';
            }
            
            return [
                'status'  => $status,
                'message' => $message
            ];
        }

   ```

6. **cancel() / status['entidad']()** 
   - Cambia estatus de registros con `update()`.

   ```php
   function statusProducto() {
            $status = 500;
            $message = 'No se pudo actualizar el estado del producto';

            $update = $this->updateProducto($this->util->sql($_POST, 1));

            if ($update) {
                $status = 200;
                $message = 'El estado del producto se actualizó correctamente';
            }

            return [
                'status' => $status,
                'message' => $message,
                'update' => $update

            ];
        }
   ```


    Funciones extra:

    - **dropdown($id)**: Construye opciones de acciones disponibles según el estado del registro.
    - **getEstatus($idStatus)**: Devuelve el texto correspondiente al estado (opcional).
    - **a**: arreglo dentro de row para crear botones




 ## Formato de salida:
    - Al final instanciar `$obj = new ctrl();`
    - Llamar a la función dinámica:  
  
  ```php
    $fn = $_POST['opc'];
    $encode = $obj->$fn();
    echo json_encode($encode);
  ```

# MDL.md
**Objetivo General**  
Crear un archivo modelo PHP que extienda la clase `CRUD`, conforme a los estándares de desarrollo de CoffeeSoft. Este modelo debe incluir configuración base, estructura ordenada por módulos y funciones orientadas a la consulta de datos (incluyendo filtros tipo `<select>`).

**Reglas y Requisitos Técnicos**

### 1.Estructura Base del Modelo
Debe respetarse el formato de CoffeeSoft
- Nombre del archivo bajo la convención:  
  `mdl-[nombre].php`

- Todos los modelos deben extender la clase `CRUD` y el modelo debe llamarse mdl:
  ```php
  class mdl extends CRUD {}
  ```
- Carga obligatoria de archivos de configuración:

  ```php
    require_once '../../conf/_CRUD.php';
    require_once '../../conf/_Utileria.php';

  ```

- Propiedades comunes a declarar en la clase:
  ```php
  public $util;
  public $bd;
  ```

  ### 2.Organización de Métodos por Módulo
-  Separar lógicamente las funciones según el módulo al que pertenecen, con comentarios ( Solo aplica si es diferente modulo):
  
```php
  // Finanzas:
  public function getFinanzasList() { ... }

  // Eventos:
  public function getEventList() { ... }
  ```

- Los nombres de las funciones deben:
  - Estar en inglés.
  - Usar notación `camelCase`.


### 3. Uso de Métodos CRUD Heredados

- Utiliza los métodos de la clase base `CRUD` según el tipo de operación:
  _Select : Consultas estructuradas tipo array 
  _Delete : Eliminar un registro 
  _Update : Actualizaciones                    
  _Read   : SQL personalizados (raw queries) 

  <_Insert>
  ```php
    function create($array){
      return $this->_Insert([
        'table' =>  "{$this->bd}table_name",
        'values' => $array['values'],
        'data' => $array['data']
      ]);
    }
  ```

  <_Update>

```php
  function update($array){
    return $this->_Update([
      'table'  => "{$this->bd}table_name",
      'values' => $array['values'],
      'where'  => $array['where'],
      'data'   => $array['data'],
    ]);
  }
```

<_Delete>

```php
  function update($array){

    return $this->_Delete([
      'table' => "{$this->bd}table_name",
      'where' => $array['where'],
      'data'  => $array['data'],
    ]);
  }
```

### 4. Estructura para Consultas tipo `<select>`

  ####  Nivel 1: Consulta directa (_Read)

  Para consultas SQL manuales sin estructura:

  ```php
    public function getTableByID($array) {
        $query = "
            SELECT *
            FROM {$this->bd}table_name
            WHERE id = ?
        ";
        return $this->_Read($query, $array);
    }
  ```
  #### Nivel 2: Consulta estructurada (_Select)

  Para obtener valores usando estructura predefinida:

  ```php
    public function getMaxSeasonId() {
      return $this->_Select([
      'table'     => "{$this->bd}table_name",
      'values'    => 'id,name',
      'where'     => 'id',
      'order'     => ['ASC'=>'Nombres'],
      'data'      => $array
      ]);
    
    }
  ```

**Consideraciones Finales**
- Este prompt puede ser reutilizado para todos los módulos que requieran interacción con datos tipo filtro `<mdl>`.
- Se puede integrar fácilmente en controladores PHP que inicialicen datos para vistas en JS.
- Puedes usar de referencias los <pivotes>


