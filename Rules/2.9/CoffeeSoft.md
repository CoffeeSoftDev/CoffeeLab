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