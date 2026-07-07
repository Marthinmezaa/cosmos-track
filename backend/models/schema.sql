-- Esquema para PostgreSQL (Neon)
CREATE TABLE IF NOT EXISTS contactos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(20) NOT NULL,
    asunto VARCHAR(200),
    mensaje TEXT,
    servicio VARCHAR(50), -- Para el formulario de cotización
    tipo_formulario VARCHAR(20) NOT NULL, -- 'contacto' o 'cotizacion'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTA: Si la tabla ya existe sin la columna 'apellido', ejecute el siguiente comando:
-- ALTER TABLE contactos ADD COLUMN apellido VARCHAR(100);
