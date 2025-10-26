# Formas de Pago - Database Documentation

## Overview
Este módulo gestiona las formas de pago disponibles en el sistema para todas las unidades de negocio.

## Database Schema

### Table: payment_methods

Almacena los métodos de pago disponibles para compras.

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Nombre de la forma de pago |
| active | TINYINT(1) | DEFAULT 1 | Estado (1=activo, 0=inactivo) |
| date_creation | DATETIME | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| date_updated | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Fecha de última actualización |

#### Indexes

- `PRIMARY KEY (id)` - Clave primaria
- `UNIQUE KEY (name)` - Previene duplicados
- `INDEX idx_payment_methods_name` - Búsquedas por nombre
- `INDEX idx_payment_methods_active` - Filtros por estado

#### Constraints

- `unique_payment_method_name` - Garantiza nombres únicos de formas de pago

## Installation

```bash
# Ejecutar el script SQL
mysql -u username -p database_name < payment_methods.sql
```

## Default Data

El script incluye 5 formas de pago predeterminadas:
- Efectivo
- Transferencia
- Tarjeta de débito
- Tarjeta de crédito
- Almacén de compras (corporativo)

## Integration

Esta tabla es utilizada por:
- Módulo de Compras (filtros y captura)
- Módulo de Administración (gestión CRUD)
- Reportes de compras por forma de pago

## Business Rules

1. **Unicidad**: No se permiten nombres duplicados de formas de pago
2. **Estado**: Solo formas de pago activas (active=1) están disponibles en módulos de compra
3. **Eliminación**: No se eliminan registros físicamente, solo se desactivan (active=0)
4. **Auditoría**: Se mantiene registro de fecha de creación y última actualización

## API Endpoints

Ver documentación en:
- `ctrl-formasPago.php` - Controlador
- `mdl-formasPago.php` - Modelo
- `formasPago.js` - Frontend

## Notes

- La tabla no tiene relación con `udn` porque las formas de pago son globales para todas las unidades de negocio
- El campo `name` es case-sensitive en la base de datos pero la validación de duplicados es case-insensitive
- Se recomienda mantener nombres cortos y descriptivos para mejor UX
