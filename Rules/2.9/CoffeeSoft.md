# CoffeeSoft.md

## DATOS TECNICOS.
CoffeeSoft es un framework profesional para desarrollo modular de sistemas. Está diseñado para:

- Usar clases base (Templates, Components, Complements) para extender funcionalidad.
- Estar basado en **TailwindCSS** para el diseño.

> Todo el ecosistema se orquesta a través de **CoffeeSoft.js**, que contiene los bloques fundamentales de trabajo para módulos, formularios, tablas y más.

## 🔄 WORKFLOW
CoffeeSoft sigue un flujo de trabajo modular, compuesto por tres bloques fundamentales:

### 1. COMPLEMENTS

Clase base: `Complements`

Los **Complements** agrupan funciones de utilidad generales. No generan interfaz directamente, pero dan soporte a componentes visuales.

### 2. COMPONENTS

Clase: `Components` (hereda de `Complements`)

Representan **elementos funcionales y visuales** que pueden usarse de forma independiente o dentro de módulos. Son reutilizables y configurables vía `options`.

**Características clave:**

- Son **métodos de clase**.
- Se invocan con `this.nombreComponente(opts)`.
- Usan exclusivamente **jQuery** + **TailwindCSS**.
- Toman su estructura del archivo `NEW-COMPONENT.md`.


### 3. TEMPLATES

Clase: `Templates` (padre de `App`, vista en `FRONT-JS.md`)

Los **Templates** definen la **estructura general del sistema o módulo**.

> Toda clase `App` de CoffeeSoft **debe heredar** de `Templates`.


#Component Class
## createCoffeeTable



## createTable
**Nombre**: createTable(options)

**Propósito**:
Este método permite crear tablas dinámicas a partir de datos obtenidos vía AJAX. Puede integrarse con un FilterBar (filtros de búsqueda), soporta configuración de DataTables, y puede renderizar tablas bajo el estándar CoffeeSoft (createCoffeTable) o mediante el plugin rpt_json_table2.
**Parámetros**:

`options (Object)`
– Objeto de configuración con los siguientes atributos:
extends (boolean): Si es true, retorna la promesa extendsAjax en lugar de renderizar directamente.

- parent (string): ID del contenedor donde se insertará la tabla.
- idFilterBar (string): ID del filtro de búsqueda; si se define, se activa validación de filtro.

- coffeesoft (boolean): Si es true, utiliza createCoffeTable; en caso contrario usa rpt_json_table2.

- conf (Object): Configuración extra:
- datatable (boolean): Habilita o no DataTables.
- fn_datatable (string): Nombre de la función de inicialización del datatable.
- beforeSend (boolean): Controla si se muestra el loader en el contenedor.
pag (int): Número de registros por página.

- success (function): Callback que se ejecuta después de recibir los datos.
- attr (Object): Atributos adicionales para configurar la tabla generada.
- data (Object): Parámetros extra que se envían al backend.

**Código**
```javascript
    createTable(options) {
        var defaults = {
            extends: false,
            parent: this.div_modulo,
            idFilterBar: '',
            parent: 'lsTable',
            coffeesoft: false,
            conf: {
                datatable: true,
                fn_datatable: 'simple_data_table',
                beforeSend: true,
                pag: 15,
            },
            methods: {
                send: (data) => { }
            }
        };

        const dataConfig = Object.assign(defaults.conf, options.conf);
        let opts = Object.assign(defaults, options);
        const idFilter = options.idFilterBar ? options.idFilterBar : '';

        if (idFilter) {
            const sendData = { tipo: 'text', opc: 'ls', ...options.data };
            var extendsAjax = null;

            $(`#${idFilter}`).validar_contenedor(sendData, (datos) => {
                let beforeSend = (dataConfig.beforeSend) ? '#' + options.parent : '';
                extendsAjax = fn_ajax(datos, this._link, beforeSend);

                if (!options.extends) {
                    extendsAjax.then((data) => {
                        let attr_table_filter = {
                            data: data,
                            f_size: '14',
                            id: 'tbSearch'
                        };
                        attr_table_filter = Object.assign(attr_table_filter, opts.attr);

                        opts.methods.send(data);
                        if (opts.success) opts.success(data);

                        if (opts.coffeesoft) {
                            attr_table_filter.parent = opts.parent;
                            this.createCoffeTable(attr_table_filter);
                        } else {
                            $('#' + options.parent).rpt_json_table2(attr_table_filter);
                        }

                        if (dataConfig.datatable) {
                            window[dataConfig.fn_datatable]('#' + attr_table_filter.id, dataConfig.pag);
                        }
                    });
                }
            });

            if (opts.extends) return extendsAjax;

        } else {
            let sendData = { opc: 'ls', ...opts.data };
            extendsAjax = fn_ajax(sendData, this._link, '#' + opts.parent);

            if (!opts.extends) {
                extendsAjax.then((data) => {
                    opts.methods.send(data);
                    this.processData(data, opts, dataConfig);
                });
            }
        }
    }



```

### ejemplo
```javascript
    this.createTable({
        parent: 'tableContainer',
        idFilterBar: 'filterForm',
        coffeesoft: true,
        conf: {
            datatable: true,
            fn_datatable: 'custom_data_table',
            pag: 20
        },
        data: { extraParam: 'value' },

        success: (data) => {
            console.log('Tabla renderizada con éxito');
        },
        attr: {
            class: 'table-auto w-full'
        }
    });
```

