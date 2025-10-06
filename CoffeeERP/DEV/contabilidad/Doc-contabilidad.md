# 📚 Manual Técnico del Sistema de Contabilidad CoffeeSoft

## 🎯 Introducción

Este manual documenta el funcionamiento completo del sistema de contabilidad desarrollado con el framework CoffeeSoft. El sistema gestiona múltiples aspectos financieros de las unidades de negocio (UDN) incluyendo ingresos, egresos, pagos, compras y control de fondos.

---

## 🏗️ Arquitectura del Sistema

### Estructura MVC
- **Modelos (mdl/)**: Acceso y manipulación de datos
- **Controladores (ctrl/)**: Lógica de negocio y validaciones
- **Vistas (src/js/)**: Interfaz de usuario e interacciones

### Flujo de Datos
1. **Usuario** → Interfaz (sobres.php)
2. **Frontend JS** → Petición AJAX
3. **Controlador** → Validación y procesamiento
4. **Modelo** → Consultas a base de datos
5. **Respuesta JSON** → Actualización de interfaz

---

## 📋 Módulos del Sistema

### 1. 💰 **SOBRES - Gestión Principal**

#### **Funcionalidad**
Módulo central que coordina todos los aspectos contables de una UDN específica.

#### **Características Principales**
- **Saldo de Fondo Fijo**: Cálculo automático basado en último reembolso
- **Control de Egresos**: Suma de gastos, anticipos y pagos a proveedores
- **Validación de Fechas**: Control de apertura/cierre contable
- **Permisos por UDN**: Acceso restringido según usuario

#### **Validaciones**
- ✅ **Fecha Válida**: Solo fechas con apertura contable
- ✅ **Horario de Cierre**: Respeta horarios de cierre mensual
- ✅ **Permisos UDN**: Admin ve todas, usuarios solo su UDN
- ✅ **Existencia de Retiros**: Valida retiros de venta activos

#### **Flujo de Trabajo**
```
1. Seleccionar UDN → Cargar saldos automáticamente
2. Elegir fecha → Validar apertura contable
3. Visualizar pestañas → Acceder a módulos específicos
4. Realizar operaciones → Actualizar saldos en tiempo real
```

#### **Archivos Involucrados**
- `ctrl/_Sobres.php` - Lógica principal
- `mdl/mdl-sobres.php` - Consultas de datos
- `src/js/sobres.js` - Orquestador frontend

---

### 2. 🔄 **TURNOS - Control de Operaciones**

#### **Funcionalidad**
Gestión de turnos operativos y control de actividades por periodo.

#### **Acceso**
- **Solo Administradores** (idE = 1)
- Pestaña visible únicamente para usuarios con permisos especiales

#### **Características**
- **Visualización Dual**: Contenedor de controles + tabla de datos
- **Filtros Dinámicos**: Por UDN y rango de fechas
- **Estados de Turno**: Abierto, cerrado, en proceso

#### **Validaciones**
- ✅ **Permisos de Usuario**: Solo admin puede acceder
- ✅ **Turno Activo**: Validar si existe turno en la fecha
- ✅ **Coherencia de Datos**: Verificar integridad de información

#### **Flujo de Trabajo**
```
1. Verificar permisos → Solo admin accede
2. Cargar turnos → Filtrar por UDN y fecha
3. Mostrar controles → Panel izquierdo
4. Visualizar datos → Tabla derecha
```

---

### 3. 💵 **INGRESOS - Gestión de Entradas**

#### **Funcionalidad**
Registro y control de todos los ingresos de la unidad de negocio.

#### **Características**
- **Pestaña Activa por Defecto**: Primera vista al cargar el sistema
- **Categorización**: Diferentes tipos de ingresos
- **Integración**: Conecta con sistema de ventas
- **Reportes**: Generación automática de informes

#### **Tipos de Ingresos**
- 💳 **Ventas Directas**: Ingresos por productos/servicios
- 🏦 **Depósitos**: Transferencias bancarias
- 💰 **Efectivo**: Pagos en efectivo
- 📱 **Digitales**: Pagos electrónicos

#### **Validaciones**
- ✅ **Monto Válido**: Números positivos únicamente
- ✅ **Fecha Coherente**: No futuras, dentro del periodo
- ✅ **Categoría Requerida**: Clasificación obligatoria
- ✅ **Documentación**: Comprobantes según tipo

#### **Flujo de Trabajo**
```
1. Registrar ingreso → Capturar datos básicos
2. Clasificar tipo → Seleccionar categoría
3. Adjuntar comprobante → Subir documentación
4. Validar información → Verificar coherencia
5. Confirmar registro → Actualizar saldos
```

---

### 4. 🛒 **COMPRAS - Control de Adquisiciones**

#### **Funcionalidad**
Gestión completa del proceso de compras y control de gastos.

#### **Características**
- **Categorías de Gasto**: Clasificación por tipo (CG)
- **Control de Proveedores**: Gestión de relaciones comerciales
- **Manejo de IVA**: Cálculos automáticos de impuestos
- **Fondo Fijo**: Compras con categoría CG=3 afectan fondo

#### **Tipos de Compras**
- 🏪 **Operativas**: Insumos y materiales
- 🔧 **Mantenimiento**: Reparaciones y servicios
- 📋 **Administrativas**: Gastos de oficina
- 💰 **Fondo Fijo**: Gastos menores (CG=3)

#### **Validaciones**
- ✅ **Proveedor Válido**: Debe existir en catálogo
- ✅ **Categoría Correcta**: CG debe estar activa
- ✅ **Cálculo IVA**: Verificar porcentajes correctos
- ✅ **Límites de Gasto**: Respetar presupuestos
- ✅ **Documentación**: Factura o comprobante requerido

#### **Flujo de Trabajo**
```
1. Seleccionar proveedor → Buscar en catálogo
2. Capturar compra → Datos básicos y montos
3. Clasificar gasto → Asignar categoría (CG)
4. Calcular impuestos → IVA automático
5. Registrar pago → Método y fecha
6. Actualizar saldos → Si es fondo fijo (CG=3)
```

---

### 5. 💳 **PAGOS - Gestión de Salidas**

#### **Funcionalidad**
Control de todos los pagos y egresos de la unidad de negocio.

#### **Características**
- **Múltiples Métodos**: Efectivo, transferencia, cheque
- **Control de Anticipos**: Gestión de adelantos a empleados
- **Pagos a Proveedores**: Liquidación de facturas
- **Impacto en Saldos**: Actualización automática de fondos

#### **Tipos de Pagos**
- 👥 **Anticipos**: Adelantos a personal
- 🏪 **Proveedores**: Liquidación de compras
- 🔧 **Servicios**: Pagos por servicios contratados
- 📋 **Gastos Varios**: Otros egresos operativos

#### **Validaciones**
- ✅ **Saldo Suficiente**: Verificar disponibilidad de fondos
- ✅ **Beneficiario Válido**: Empleado o proveedor activo
- ✅ **Método de Pago**: Selección obligatoria
- ✅ **Autorización**: Según montos y políticas
- ✅ **Documentación**: Comprobante de pago

#### **Flujo de Trabajo**
```
1. Verificar saldo → Confirmar disponibilidad
2. Seleccionar beneficiario → Empleado/proveedor
3. Capturar monto → Validar límites
4. Elegir método → Efectivo/transferencia/cheque
5. Generar comprobante → Documentar operación
6. Actualizar saldos → Descontar de fondo
```

---

### 6. 👥 **CLIENTES - Gestión Comercial**

#### **Funcionalidad**
Administración de la cartera de clientes y cuentas por cobrar.

#### **Características**
- **Catálogo de Clientes**: Base de datos completa
- **Cuentas por Cobrar**: Control de créditos
- **Historial de Pagos**: Seguimiento de transacciones
- **Análisis Crediticio**: Evaluación de riesgos

#### **Información del Cliente**
- 📋 **Datos Básicos**: Nombre, RFC, dirección
- 💳 **Información Crediticia**: Límite, plazo, garantías
- 📊 **Historial**: Compras, pagos, incidencias
- 📞 **Contacto**: Teléfonos, emails, referencias

#### **Validaciones**
- ✅ **RFC Único**: No duplicar registros
- ✅ **Datos Completos**: Información mínima requerida
- ✅ **Límite Crediticio**: Según políticas comerciales
- ✅ **Referencias**: Validar información de contacto

#### **Flujo de Trabajo**
```
1. Registrar cliente → Capturar datos básicos
2. Evaluar crédito → Asignar límite y plazo
3. Generar ventas → Crear facturas/notas
4. Controlar cobros → Seguimiento de pagos
5. Analizar cartera → Reportes de antigüedad
```

---

### 7. 🏪 **PROVEEDORES - Gestión de Suministros**

#### **Funcionalidad**
Administración de proveedores y cuentas por pagar.

#### **Características**
- **Catálogo de Proveedores**: Base de datos de suministradores
- **Cuentas por Pagar**: Control de adeudos
- **Evaluación de Proveedores**: Calificación de desempeño
- **Condiciones Comerciales**: Plazos, descuentos, términos

#### **Información del Proveedor**
- 🏢 **Datos Empresariales**: Razón social, RFC, giro
- 💰 **Condiciones**: Plazos de pago, descuentos
- 📦 **Productos/Servicios**: Catálogo de suministros
- 📈 **Evaluación**: Calidad, puntualidad, precio

#### **Validaciones**
- ✅ **RFC Válido**: Formato correcto y único
- ✅ **Datos Fiscales**: Información completa para facturación
- ✅ **Condiciones Claras**: Plazos y términos definidos
- ✅ **Evaluación Periódica**: Revisión de desempeño

#### **Flujo de Trabajo**
```
1. Registrar proveedor → Datos básicos y fiscales
2. Negociar condiciones → Plazos y descuentos
3. Generar órdenes → Solicitudes de compra
4. Recibir facturas → Validar y registrar
5. Programar pagos → Según condiciones pactadas
```

---

### 8. 📁 **ARCHIVOS - Gestión Documental**

#### **Funcionalidad**
Control y almacenamiento de documentos contables y fiscales.

#### **Características**
- **Repositorio Digital**: Almacenamiento seguro de documentos
- **Clasificación**: Organización por tipo y fecha
- **Búsqueda Avanzada**: Localización rápida de archivos
- **Control de Versiones**: Historial de modificaciones

#### **Tipos de Documentos**
- 🧾 **Facturas**: Compras y ventas
- 📋 **Comprobantes**: Pagos y ingresos
- 📊 **Reportes**: Estados financieros
- 📑 **Contratos**: Acuerdos comerciales

#### **Validaciones**
- ✅ **Formato Válido**: PDF, imagen, documento
- ✅ **Tamaño Límite**: Restricciones de almacenamiento
- ✅ **Clasificación**: Categoría obligatoria
- ✅ **Integridad**: Verificar que no esté corrupto

#### **Flujo de Trabajo**
```
1. Subir archivo → Seleccionar documento
2. Clasificar → Asignar categoría y fecha
3. Validar → Verificar integridad y formato
4. Almacenar → Guardar en repositorio
5. Indexar → Facilitar búsquedas futuras
```

---

## 🔐 Sistema de Permisos

### Niveles de Acceso

#### **Administrador (idE = 8)**
- ✅ Acceso a todas las UDN
- ✅ Módulo de Turnos disponible
- ✅ Reportes consolidados
- ✅ Configuración del sistema

#### **Gerente UDN (idE = 1)**
- ✅ Acceso al módulo de Turnos
- ✅ Su UDN asignada únicamente
- ✅ Reportes de su unidad
- ❌ Configuración limitada

#### **Usuario Regular**
- ✅ Su UDN asignada únicamente
- ❌ Sin acceso a Turnos
- ✅ Operaciones básicas
- ❌ Sin configuración

### Validaciones de Seguridad
- 🔒 **Autenticación**: Cookie IDU requerida
- 🔒 **Autorización**: Permisos por módulo
- 🔒 **Auditoría**: Log de operaciones
- 🔒 **Integridad**: Validación de datos

---

## ⚙️ Configuración y Mantenimiento

### Variables del Sistema

#### **Bases de Datos**
- `bd_fzas`: `rfwsmqex_gvsl_finanzas2` - Datos financieros
- `bd_ch`: `rfwsmqex_gvsl_rrhh` - Recursos humanos

#### **Configuraciones Clave**
- **Horarios de Cierre**: Tabla `apertura_mensual`
- **Categorías de Gasto**: Catálogo CG
- **UDN Activas**: Estado = 1 en tabla UDN

### Mantenimiento Preventivo

#### **Diario**
- ✅ Verificar saldos de fondo fijo
- ✅ Revisar operaciones del día
- ✅ Validar respaldos automáticos

#### **Semanal**
- ✅ Conciliación bancaria
- ✅ Revisión de cuentas por pagar
- ✅ Análisis de variaciones

#### **Mensual**
- ✅ Cierre contable
- ✅ Reportes financieros
- ✅ Auditoría de procesos

---

## 🚨 Solución de Problemas

### Errores Comunes

#### **"Fecha no disponible"**
- **Causa**: Fecha fuera del periodo de apertura
- **Solución**: Verificar tabla `apertura` y horarios

#### **"Saldo insuficiente"**
- **Causa**: Fondo fijo agotado
- **Solución**: Revisar último reembolso y egresos

#### **"Sin permisos"**
- **Causa**: Usuario sin acceso al módulo
- **Solución**: Verificar permisos en tabla usuarios

#### **"Error de conexión"**
- **Causa**: Problema con base de datos
- **Solución**: Verificar configuración en `_CRUD.php`

### Logs de Error
- **Ubicación**: `ctrl/error.log`
- **Formato**: Fecha, hora, error, usuario
- **Rotación**: Automática cada mes

---

## 📊 Reportes y Análisis

### Reportes Disponibles

#### **Saldos Diarios**
- Saldo inicial, egresos, saldo final
- Por UDN y fecha específica
- Actualización en tiempo real

#### **Flujo de Efectivo**
- Ingresos vs egresos por periodo
- Análisis de tendencias
- Proyecciones futuras

#### **Cuentas por Pagar**
- Adeudos por proveedor
- Vencimientos próximos
- Análisis de antigüedad

#### **Análisis de Gastos**
- Por categoría (CG)
- Comparativo mensual
- Desviaciones presupuestales

### Exportación de Datos
- **Formatos**: Excel, PDF, CSV
- **Filtros**: Por fecha, UDN, categoría
- **Programación**: Reportes automáticos

---

## 🔄 Integración con Otros Sistemas

### SoftRestaurant
- **Ventas**: Importación automática de tickets
- **Productos**: Sincronización de inventarios
- **Clientes**: Unificación de bases de datos

### Sistema Bancario
- **Conciliación**: Importación de estados de cuenta
- **Pagos**: Generación de archivos para transferencias
- **Consultas**: Saldos en tiempo real

### Facturación Electrónica
- **CFDI**: Generación automática
- **Timbrado**: Integración con PAC
- **Cancelaciones**: Proceso automatizado

---

## 📝 Notas Importantes

### Buenas Prácticas
- 📋 **Documentar todas las operaciones**
- 🔍 **Revisar saldos diariamente**
- 💾 **Respaldar información regularmente**
- 🔐 **Mantener credenciales seguras**
- 📊 **Analizar reportes periódicamente**

### Consideraciones Especiales
- ⏰ **Horarios de cierre son estrictos**
- 💰 **Fondo fijo tiene límites operativos**
- 📅 **Fechas futuras no están permitidas**
- 🔒 **Permisos no son transferibles**
- 📋 **Documentación es obligatoria**

---

## 📞 Soporte Técnico

### Contacto
- **Desarrollador**: CoffeeIA ☕
- **Framework**: CoffeeSoft
- **Versión**: 2024.1

### Recursos Adicionales
- 📚 **Documentación CoffeeSoft**: Consultar framework
- 🎓 **Capacitación**: Cursos disponibles
- 🔧 **Actualizaciones**: Notificaciones automáticas

---

*Este manual es un documento vivo que se actualiza conforme evoluciona el sistema. Para sugerencias o correcciones, contactar al equipo de desarrollo.*