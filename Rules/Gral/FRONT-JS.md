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
````   parent: `[nombreComponente]${this.PROJECT_NAME}`, ```


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

