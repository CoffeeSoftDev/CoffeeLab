-- Tabla para salidas de almacén
CREATE TABLE IF NOT EXISTS warehouse_output (
    id INT PRIMARY KEY AUTO_INCREMENT,
    insumo_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    operation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT fk_warehouse_output_insumo FOREIGN KEY (insumo_id) REFERENCES insumo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_insumo_id (insumo_id),
    INDEX idx_active (active),
    INDEX idx_operation_date (operation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
