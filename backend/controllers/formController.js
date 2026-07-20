const Contacto = require('../models/contacto');
const { sendContactEmail } = require('../config/mailer');
const { sendWhatsAppNotification } = require('../config/whatsapp');

const TELEFONO_REGEX = /^\(0\d{3}\) \d{3}-\d{3}$/;

const submitForm = async (req, res) => {
    try {
        const formData = req.body;

        // Validar formato estricto de teléfono antes de guardar o notificar nada
        if (!TELEFONO_REGEX.test(formData.telefono || '')) {
            return res.status(400).json({
                status: 'error',
                message: 'El teléfono debe tener el formato (0986) 456-000'
            });
        }

        // 1. Guardar en Base de Datos (MySQL)
        const savedContact = await Contacto.create(formData);

        // 2. Enviar Correo
        try {
            await sendContactEmail(formData);
        } catch (emailError) {
            console.error('Error al enviar correo, pero el contacto fue guardado:', emailError);
            // No bloqueamos la respuesta si solo falla el correo
        }

        // 3. Enviar WhatsApp (solo para cotizaciones)
        if (formData.tipo_formulario === 'cotizacion') {
            try {
                await sendWhatsAppNotification(formData);
            } catch (waError) {
                console.error('Error al enviar WhatsApp:', waError);
            }
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
