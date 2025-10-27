# Base de Datos - Módulo de Clientes a Crédito

## 📋 Descripción

Este módulo gestiona clientes con cuentas a crédito, permitiendo registrar consumos, anticipos y pagos con control automático de saldos.

## 🗄️ Estructura de Tablas

### Tabla: `customer`
Catálogo de clientes con capacidad de crédito.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK) |
| udn_id | INT | Unidad de negocio (FK) |
| name | VARCHAR(50) | Nombre del cliente |
| balance | DECIMAL(12,2) | Saldo actual de deuda |
| active | TINYINT | Estado (1=Activo, 0=Inactivo) |
| created_at | TIMESTAMP | Fecha de creación |

**Índices:**
- PRIMARY KEY (id)
- INDEX idx_udn_active (udn_id, active)
- INDEX idx_name (name)
- FOREIGN KEY (udn_id) → udn(id)

### Tabla: `detail_credit_customer`
Registro detallado de movimientos de crédito.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único (PK) |
| customer_id | INT | Cliente (FK) |
| daily_closure_id | INT | Corte diario (FK) |
| movement_type | VARCHAR(20) | Tipo: Consumo/Anticipo/Pago |
| method_pay | VARCHAR(100) | Forma de pago |
| amount | DECIMAL(15,2) | Monto del movimiento |
| description | TEXT | Descripción opcional |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |
| updated_by | VARCHAR(100) | Usuario que modificó |

**Índices:**
- PRIMARY KEY (id)
- INDEX idx_customer (customer_id)
- INDEX idx_daily_closure (daily_closure_id)
- INDEX idx_movement_type (movement_type)
- INDEX idx_created_at (created_at)
- INDEX idx_customer_date (customer_id, created_at)
- FOREIGN KEY (customer_id) → customer(id)
- FOREIGN KEY (daily_closure_id) → daily_closure(id)

## 🚀 Instalación

### Paso 1: Ejecutar Script SQL
```bash
mysql -u usuario -p rfwsmqex_contabilidad < sql/clientes-credito.sql
```

O desde phpMyAdmin:
1. Seleccionar base de datos `rfwsmqex_contabilidad`
2. Ir a pestaña "SQL"
3. Copiar y pegar el contenido de `sql/clientes-credito.sql`
4. Ejecutar

### Paso 2: Verificar Instalación
```sql
-- Verificar que las tablas existen
SHOW TABLES LIKE 'customer';
SHOW TABLES LIKE 'detail_credit_customer';

-- Verificar estructura
DESCRIBE customer;
DESCRIBE detail_credit_customer;
```

### Paso 3: Datos de Prueba (Opcional)
Descomentar las líneas de INSERT en el script SQL para crear clientes de prueba.

## 🔄 Lógica de Negocio

### Tipos de Movimiento

1. **Consumo a crédito**
   - Incrementa el balance del cliente
   - method_pay = "N/A"
   - Fórmula: `balance = balance + amount`

2. **Anticipo**
   - Decrementa el balance del cliente
   - method_pay = "Efectivo" o "Banco"
   - Fórmula: `balance = balance - amount`

3. **Pago total**
   - Decrementa el balance del cliente
   - method_pay = "Efectivo" o "Banco"
   - Validación: `amount <= balance`
   - Fórmula: `balance = balance - amount`

### Cálculo de Balance
```
Balance Actual = Balance Inicial
               + SUM(Consumos a crédito)
               - SUM(Anticipos)
               - SUM(Pagos totales)
```

## 🔗 Relaciones

```
udn (1) ──────< customer (N)
                    │
                    │ (1)
                    │
                    ▼
daily_closure (1) ──< detail_credit_customer (N)
```

## 📊 Consultas Útiles

### Ver clientes con saldo pendiente
```sql
SELECT id, name, balance, active 
FROM customer 
WHERE balance > 0 AND active = 1
ORDER BY balance DESC;
```

### Ver movimientos recientes
```sql
SELECT 
    dcm.id,
    c.name as customer_name,
    dcm.movement_type,
    dcm.method_pay,
    dcm.amount,
    dcm.created_at
FROM detail_credit_customer dcm
INNER JOIN customer c ON dcm.customer_id = c.id
ORDER BY dcm.created_at DESC
LIMIT 20;
```

### Resumen por cliente
```sql
SELECT 
    c.name,
    c.balance as saldo_actual,
    COUNT(dcm.id) as total_movimientos,
    SUM(CASE WHEN dcm.movement_type = 'Consumo a crédito' THEN dcm.amount ELSE 0 END) as total_consumos,
    SUM(CASE WHEN dcm.movement_type IN ('Anticipo', 'Pago total') THEN dcm.amount ELSE 0 END) as total_pagos
FROM customer c
LEFT JOIN detail_credit_customer dcm ON c.id = dcm.customer_id
WHERE c.active = 1
GROUP BY c.id, c.name, c.balance
ORDER BY c.balance DESC;
```

## ⚠️ Consideraciones Importantes

1. **Integridad Referencial**: Las foreign keys previenen eliminación de registros relacionados
2. **Transacciones**: Los movimientos deben ejecutarse en transacciones para garantizar consistencia
3. **Corte Diario**: Todos los movimientos deben vincularse a un corte diario activo
4. **Balance**: El balance se actualiza automáticamente desde la aplicación, no manualmente
5. **Auditoría**: El campo `updated_by` registra quién realizó cambios

## 🔧 Mantenimiento

### Backup
```bash
mysqldump -u usuario -p rfwsmqex_contabilidad customer detail_credit_customer > backup_clientes_credito.sql
```

### Restauración
```bash
mysql -u usuario -p rfwsmqex_contabilidad < backup_clientes_credito.sql
```

## 📝 Notas de Versión

- **v1.0** - Estructura inicial con tablas customer y detail_credit_customer
- Índices optimizados para consultas frecuentes
- Soporte para múltiples UDN
- Vinculación con sistema de corte diario
