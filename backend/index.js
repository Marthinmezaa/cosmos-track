require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
    origin: [
        'https://www.cosmostrak.com.py', 
        'https://cosmostrak.com.py',
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'http://localhost:3000'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/form', require('./routes/formRoutes'));
app.use('/api', require('./routes/systemRoutes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'Servidor funcionando correctamente' });
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend'), {
    extensions: ['html', 'htm']
}));

// Redirigir cualquier ruta no encontrada al index.html (para navegación limpia)
app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    } else {
        res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
