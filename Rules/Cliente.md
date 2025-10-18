# 🧭 Pivote Estratégico — Clientes (Módulo KPI / Marketing)

---

## 📜 Descripción
El módulo **Gestión de Clientes** forma parte del sistema de marketing dentro del ERP CoffeeSoft.  
Se encarga de la **administración integral de los clientes** de las unidades de negocio que realizan pedidos a domicilio, asegurando un control completo sobre su información, procedencia, comportamiento y estatus (activo, inactivo o VIP).

Permite mantener actualizados los datos de contacto, realizar seguimiento personalizado y clasificar clientes según su unidad de negocio de origen, facilitando la comunicación y toma de decisiones estratégicas.

---

## 🎯 Objetivos Específicos
1. Registrar nuevos clientes con información completa (nombre, teléfono, correo, domicilio, cumpleaños, unidad de negocio, etc.).
2. Editar o actualizar los datos existentes de un cliente.
3. Dar de baja clientes de manera controlada mediante un cambio de estatus.
4. Clasificar clientes por unidad de negocio de origen.
5. Identificar si el cliente proviene de una unidad específica (ej. *Quinta Tabachines*).
6. Marcar a los clientes como **VIP** cuando corresponda.

---

## 📊 Resultados Esperados
- Base de datos centralizada de clientes **activos e inactivos**.
- Reporte consolidado de clientes **por unidad de negocio**.
- Identificación visual de **clientes VIP**.
- Registro histórico de **modificaciones y actualizaciones**.
- Listado dinámico con **filtros avanzados** (nombre, teléfono, UDN, estatus).

---

## 🔹 Submódulos del Módulo de Clientes

### 1. 🧾 Cliente
**Descripción:**  
Se encarga de la visualización, alta, edición y baja de clientes, mostrando toda su información personal y de contacto.  

**Funciones principales:**
- Formulario de captura completo:
  - Nombre, apellido paterno y materno.
  - Teléfono y correo electrónico.
  - Domicilio completo.
  - Fecha de cumpleaños.
  - Unidad de negocio de procedencia.
  - Campo de selección VIP.
- Edición y actualización de información existente.
- Baja controlada mediante campo de estatus (activo/inactivo).
- Búsqueda avanzada y filtrado por:
  - Nombre.
  - Teléfono.
  - Unidad de negocio.
  - Tipo de cliente (VIP o general).

---

## 🧠 Lógica de Negocio (Back-End)
**Controlador:** `ctrl-clientes.php`  
**Modelo:** `mdl-clientes.php`  

### Funciones principales:
| Tipo | Función | Descripción |
|------|----------|-------------|
| 📥 | `addCliente()` | Inserta un nuevo cliente con validaciones. |
| ✏️ | `updateCliente()` | Actualiza los datos existentes de un cliente. |
| 📤 | `deleteCliente()` | Cambia el estatus del cliente a inactivo. |
| 🔍 | `lsClientes()` | Lista los clientes con filtros avanzados (nombre, UDN, estatus, VIP). |
| 📊 | `getClienteById()` | Obtiene la información detallada de un cliente. |

---

## 💻 Requisitos para el Programador

### 🧩 Funcionales
- Validaciones en la captura de datos:
  - Campos obligatorios.
  - Formato correcto de correo electrónico.
  - Formato numérico de teléfono.
- Filtros dinámicos por:
  - Unidad de negocio.
  - Estatus (activo/inactivo).
  - Tipo de cliente (VIP).
- Confirmaciones visuales al eliminar o modificar clientes (`swalQuestion` / `bootbox`).
- Etiquetas visuales para identificar clientes VIP (badges verdes o dorados).
- Interfaz **responsive** (adaptada a escritorio, tablet y móvil).
- Tabla paginada con buscador dinámico y botones de acción (editar / eliminar).

---

## 🧩 Estructura Técnica (Front-End)
**Archivo:** `src/js/clientes.js`  
**Clase base:** `Clientes`  

### Métodos clave:
| Método | Descripción |
|--------|--------------|
| `init()` | Inicializa el módulo, carga filtros y lista de clientes. |
| `layout()` | Renderiza el layout base con título, filtros y contenedor principal. |
| `filterBar()` | Genera los filtros: Unidad de Negocio, Estatus y Tipo de Cliente. |
| `createFormCliente()` | Crea el formulario dinámico para registro/edición. |
| `ls()` | Consulta los registros filtrados mediante AJAX. |
| `renderTable()` | Crea la tabla dinámica de clientes con acciones y etiquetas VIP. |

---

## 🧩 Campos del Formulario de Cliente

| Campo | Tipo | Validación | Descripción |
|-------|------|-------------|--------------|
| Nombre | Texto | Obligatorio | Nombre del cliente |
| Apellido Paterno | Texto | Opcional | Apellido del cliente |
| Apellido Materno | Texto | Opcional | Apellido del cliente |
| Teléfono | Numérico | Obligatorio / Longitud mínima 10 | Contacto principal |
| Correo | Email | Formato válido | Correo electrónico del cliente |
| Domicilio | Texto | Obligatorio | Dirección completa del cliente |
| Fecha de Cumpleaños | Date | Opcional | Fecha para segmentación personalizada |
| Unidad de Negocio | Select | Obligatorio | UDN de procedencia |
| VIP | Checkbox | Opcional | Marca al cliente como preferente |

---

## 🧩 Reglas Visuales (UI)
- Título superior: **Gestión de Clientes**  
  Descripción: *“Administración de información y seguimiento de clientes de las unidades de negocio.”*
- Botones principales:
  - ➕ **Agregar Cliente**
  - 🔄 **Actualizar Listado**
  - 🔍 **Buscar**
- Indicadores visuales:
  - Badge **VIP** en color verde o dorado.
  - Estatus **Activo / Inactivo** con iconos y colores diferenciados.
- Tablas:
  - Columnas: Nombre, Teléfono, Correo, Unidad de Negocio, Estatus, VIP, Acciones.
  - Paginadas, ordenables y filtrables.

---

## 📊 Resultados Esperados
- Gestión centralizada y accesible de todos los clientes del sistema.
- Mejora en el control y actualización de información de clientes.
- Filtros avanzados que permiten análisis por unidad de negocio.
- Identificación rápida de clientes VIP para seguimiento preferencial.
- Registro confiable para estrategias de marketing y fidelización.

---

## 🌈 Integración con KPIs
- Total de clientes activos.
- Clientes VIP por unidad de negocio.
- Nuevos clientes registrados por mes.
- Clientes dados de baja por periodo.
- Comparativo histórico entre unidades de negocio.

---
