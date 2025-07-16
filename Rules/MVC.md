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
    $(function () {
        const app = new App(api,'root');
        app.init();
    }
    class App extends Template{}
  ```
- El constructor debe recibir dos parámetros: el enlace del controlador (`link`) y el identificador de contenedor principal (`div_modulo`).
- El constructor debe de tener la variable PROJECT_NAME
``` this.PROJECT_NAME = "projectName";``

- Si dos modulos , el segundo debe heredar la clase App
- Solo genera un submodulo si se necesita
```JS
    class SubModulo extends App{}
```

- Todos los componentes de coffeeSoft incluyen el parametro parent
debe llevar la siguiente nomenclatura
```JS   
    parent: `[nombreComponente]${this.PROJECT_NAME}`, 
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

## Objetivo
Quiero que generes un **Controlador PHP** siguiendo esta estructura:

- El archivo debe iniciar la sesión PHP (`session_start();`).  
- Validar que `$_POST['opc']` esté definido o salir (`if (empty($_POST['opc'])) exit(0);`).  
- Requerir el modelo correcto (`require_once '../mdl/mdl-[proyecto].php';`).  
- Crear una clase `ctrl` que extienda la clase del modelo.
- No agreges comentarios si no son necesarios.
- Respeta las reglas establecidas

```PHP
 class ctrl extends mdl {}
```
Implementar los métodos siguientes dentro de la clase `ctrl`:

1. ** init() **
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
- Si el perfil del usuario requiere condiciones especiales (como admin), se deben aplicar en este método.
- El resultado debe retornarse como un arreglo asociativo, listo para ser consumido por JavaScript.

   ```php ejemplo
    public function init() {
        $lsUDN    = $this->lsUDN();
        $lsStatus = $this->lsStatus();

        return [
            'udn'    => $lsUDN,
            'status' => $lsStatus
        ];
       }

2. **list()**
   - Si la filterBar tiene calendar Recibe fechas `fi` y `ff`.
   - Llama al método `getEntities()`.
   - Formatea el resultado en arreglo `__row` para tabla.
   - Agrega `dropdown` para cada fila con opciones de acciones (`editar`, `eliminar`, etc.).
   - Agrega `a` a la ultima fila de row si , solo es editar y eliminar. 

3. **get()**
   - Recibe `id` por POST.
   - Ejecuta `getById(id)`.
   - Retorna `status`, `message` y `data`.

4. **add()** *(si aplica)*
   - Recibe datos por POST.
   - Ejecuta `create()`.
   - Retorna `status` y `message` de inserción.
   - Puede existir el caso en que debas validar si un registro ya existe en la base de datos antes de crearlo. Esta validación es obligatoria cuando el campo tiene unicidad lógica
      1. Obtener los datos del `$_POST` usando `$this->util->sql($_POST)` o forma estructurada.
      2. Ejecutar un `_Select` para validar existencia previa.
      3. Si existe, retornar `status: 400` con mensaje explicativo.
      4. Si no existe, proceder con `_Insert`.
      5. Dev5. Devolver respuesta estandarizada `status: 200` o `500`.

5. **edit()**
   - Recibe datos por POST.
   - Ejecuta `update()`.
   - Retorna `status` y `message` de actualización.

6. **cancel() / ** *(según flujo)*
   - Cambia estatus de registros con `update()`.

Funciones extra:

- **dropdown($id)**: Construye opciones de acciones disponibles según el estado del registro.
- **getEstatus($idStatus)**: Devuelve el texto correspondiente al estado (opcional).
- **a**: arreglo dentro de row para crear botones

Formato de salida:
- Al final instanciar `$obj = new ctrl();`
- Llamar a la función dinámica:  
  ```php
  $fn = $_POST['opc'];
  $encode = $obj->$fn();
  echo json_encode($encode);


  ** funciones auxiliares
<merge-multiple>

🎯 **Objetivo**  
Combinar un conjunto de claves fijas con atributos calculados dinámicamente desde una lista, generando una fila homogénea que puede ser usada para inserción, consolidación o visualización.
Se puede sugerir usar cuando son consultas por grupos o de forma dinamica.

🧩🧩 **Estructura Base**

```php

$base = [
    'clave_fija_1' => $idReferencia,
    'clave_fija_2' => $registro['identificador'],
];

$atributos = [];

foreach ($lista as $item) {
    $resultado = $this->obtenerDato([$item['id']]);
    $atributos[$item['clave']] = floatval($resultado['valor']);
}

$atributos['conteo'] = 1;

$row = array_merge($base, $atributos);

```

</merge-multiple>

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


