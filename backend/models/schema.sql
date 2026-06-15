CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20) NOT NULL,
    asunto VARCHAR(200),
    mensaje TEXT,
    servicio VARCHAR(50), -- Para el formulario de cotización
    tipo_formulario VARCHAR(20) NOT NULL, -- 'contacto' o 'cotizacion'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
