# Módulo de Banco - Instrucciones de Instalación

## 📋 Descripción

Este módulo permite administrar bancos y cuentas bancarias dentro del sistema contable CoffeeSoft, proporcionando herramientas para registrar instituciones financieras, crear cuentas vinculadas a unidades de negocio y controlar su disponibilidad operativa.

## 🗄️ Instalación de Base de Datos

### Paso 1: Ejecutar Script SQL

1. Accede a tu gestor de base de datos (phpMyAdmin, MySQL Workbench, etc.)
2. Selecciona la base de datos: `rfwsmqex_contabilidad`
3. Ejecuta el archivo: `banco-schema.sql`

```sql
-- El script creará las siguientes tablas:
-- 1. banks (instituciones bancarias)
-- 2. bank_accounts (cuentas bancarias por UDN)
```

### Paso 2: Verificar Tablas Creadas

Ejecuta la siguiente consulta para verificar:

```sql
SHOW TABLES LIKE '%bank%';
```

Deberías ver:
- `banks`
- `bank_accounts`

### Paso 3: Verificar Relaciones

```sql
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME IN ('banks', 'bank_accounts')
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## 📁 Estructura de Archivos

```
contabilidad/administrador/
├── banco.php                    # Vista principal
├── js/
│   └── banco.js                 # Frontend JavaScript
├── ctrl/
│   └── ctrl-banco.php           # Controlador PHP
├── mdl/
│   └── mdl-banco.php            # Modelo PHP
└── sql/
    ├── banco-schema.sql         # Script de base de datos
    └── README-banco.md          # Este archivo
```

## 🚀 Acceso al Módulo

Una vez instalado, accede al módulo mediante:

```
https://tu-dominio.com/contabilidad/administrador/banco.php
```

## ✨ Funcionalidades

### 1. Gestión de Bancos
- ✅ Registrar nuevos bancos
- ✅ Validación de duplicidad
- ✅ Control de estados (activo/inactivo)

### 2. Gestión de Cuentas Bancarias
- ✅ Crear cuentas vinculadas a bancos y UDN
- ✅ Asignar alias a cuentas
- ✅ Registrar últimos 4 dígitos
- ✅ Vincular formas de pago
- ✅ Editar información de cuentas
- ✅ Activar/desactivar sin pérdida de datos históricos

### 3. Filtros Dinámicos
- 🔍 Filtrar por unidad de negocio
- 🔍 Filtrar por forma de pago
- 🔍 Filtrar por estado (activa/inactiva)

## 🔒 Validaciones Implementadas

### Frontend (banco.js)
- Campo nombre de banco obligatorio
- Campo banco obligatorio en cuentas
- Últimos 4 dígitos: exactamente 4 números
- Validación en tiempo real con regex

### Backend (ctrl-banco.php)
- Validación de duplicidad de bancos
- Validación de formato de 4 dígitos: `/^\d{4}$/`
- Validación de campos obligatorios
- Sanitización de inputs con `$this->util->sql()`

## 📊 Modelo de Datos

### Tabla: banks
```sql
- id (PK)
- name (UNIQUE)
- active (1=activo, 0=inactivo)
- created_at
- updated_at
```

### Tabla: bank_accounts
```sql
- id (PK)
- udn_id (FK → udn.idUDN)
- bank_id (FK → banks.id)
- account_alias (opcional)
- last_four_digits (CHAR(4))
- payment_method_id (FK → payment_methods.id)
- active (1=activa, 0=inactiva)
- created_at
- updated_at
```

## 🛠️ Dependencias

### Framework
- CoffeeSoft Framework (jQuery + TailwindCSS)
- PHP 7.4+
- MySQL 5.7+

### Tablas Relacionadas (deben existir)
- `udn` (unidades de negocio)
- `payment_methods` (formas de pago)

## 📝 Notas Importantes

1. **Soft Delete**: Las cuentas desactivadas mantienen su información histórica
2. **Integridad Referencial**: No se pueden eliminar bancos con cuentas asociadas
3. **Validación Dual**: Frontend y backend validan los datos
4. **Cache Busting**: El archivo JS incluye timestamp para evitar caché

## 🐛 Troubleshooting

### Error: "Tabla no existe"
- Verifica que ejecutaste el script SQL en la base de datos correcta
- Confirma que el prefijo de base de datos es `rfwsmqex_contabilidad.`

### Error: "Cannot add foreign key constraint"
- Verifica que existan las tablas: `udn` y `payment_methods`
- Confirma que los campos referenciados existen

### Error: "Banco no aparece en select"
- Verifica que el banco esté activo (active = 1)
- Refresca la página para recargar los datos de init()

## 📞 Soporte

Para reportar problemas o solicitar mejoras, contacta al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Fecha**: 2025  
**Framework**: CoffeeSoft
