const Contacto = require('../models/contacto');
const { sendContactEmail } = require('../config/mailer');

const submitForm = async (req, res) => {
    try {
        const formData = req.body;

        // 1. Guardar en Base de Datos (Neon)
        const savedContact = await Contacto.create(formData);

        // 2. Enviar Correo
        try {
            await sendContactEmail(formData);
        } catch (emailError) {
            console.error('Error al enviar correo, pero el contacto fue guardado:', emailError);
            // No bloqueamos la respuesta si solo falla el correo
        }

        res.status(201).json({
            status: 'success',
            message: 'Formulario procesado correctamente',
            data: savedContact
        });

    } catch (error) {
        console.error('Error en el controlador de formulario:', error);
        res.status(500).json({
            status: 'error',
            message: 'Hubo un error al procesar tu solicitud'
        });
    }
};

module.exports = { submitForm };
