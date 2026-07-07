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
        'http://127.0.0.1:5500', // Autoriza Live Server de VS Code
        'http://localhost:5500'  // Alternativa local
    ],
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

// Servir archivos estáticos del frontend (opcional, dependiendo del despliegue)
//app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
