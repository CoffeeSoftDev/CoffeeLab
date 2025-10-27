-- ============================================
-- Módulo de Compras - Initial Data
-- ============================================

-- Datos iniciales: purchase_type
INSERT INTO rfwsmqex_contabilidad.purchase_type (id, name, active) VALUES 
(1, 'Fondo fijo', 1),
(2, 'Corporativo', 1),
(3, 'Crédito', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Datos iniciales: method_pay
INSERT INTO rfwsmqex_contabilidad.method_pay (id, name, active) VALUES 
(1, 'Efectivo', 1),
(2, 'Tarjeta de débito', 1),
(3, 'Tarjeta de crédito', 1),
(4, 'Transferencia', 1),
(5, 'Almacén del área compras', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);
