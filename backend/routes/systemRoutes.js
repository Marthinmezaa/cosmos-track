const express = require('express');
const router = express.Router();
const packageJson = require('../package.json');

/**
 * @route GET /api/version
 * @desc Devuelve la versión actual de la aplicación desde package.json
 */
router.get('/version', (req, res) => {
    try {
        res.json({ version: packageJson.version });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo obtener la versión' });
    }
});

module.exports = router;
