document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const msgSubmit = document.getElementById('msgSubmit');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Recoger datos
            const formData = {
                nombre: document.getElementById('name').value,
                apellido: document.getElementById('apellido') ? document.getElementById('apellido').value : '',
                email: document.getElementById('email') ? document.getElementById('email').value : '',
                telefono: document.getElementById('phone_number').value,
                asunto: document.getElementById('msg_subject') ? document.getElementById('msg_subject').value : 'Contacto desde Web',
                mensaje: document.getElementById('message').value,
                tipo_formulario: 'contacto'
            };

            submitFormData(formData, contactForm);
        });
    }

    // Manejar el formulario de cotización (el de arriba) o instalación
    const quoteForms = document.querySelectorAll('.courses-form, #installForm');
    quoteForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = {
                servicio: (form.querySelector('select[name="servicio"]') || form.querySelector('select[name="txtTipoVehiculo"]') || form.querySelector('select'))?.value || '',
                nombre: form.querySelector('[name="txtNombre"]')?.value || '',
                apellido: form.querySelector('[name="txtApellido"]')?.value || '',
                telefono: form.querySelector('[name="txtTelefono"]')?.value || '',
                mensaje: (form.querySelector('[name="message"]') || form.querySelector('#message'))?.value || '',
                tipo_formulario: form.querySelector('[name="tipo_formulario"]')?.value || 'cotizacion',
                asunto: form.querySelector('[name="asunto"]')?.value || 'Solicitud de Cotización'
            };

            submitFormData(formData, form);
        });
    });

    function submitFormData(data, formElement) {
        // Mostrar estado de carga
        const btn = formElement.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span>Enviando...</span>';

        fetch('/api/form/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                formSuccess(formElement);
                showFeedback(true, '¡Mensaje enviado con éxito!', formElement);
            } else {
                showFeedback(false, 'Error: ' + result.message, formElement);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showFeedback(false, 'Hubo un error al conectar con el servidor.', formElement);
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = originalBtnText;
        });
    }

    function formSuccess(form) {
        // Verificamos si el elemento que pasamos tiene la función reset nativa (es decir, es un <form>)
        if (typeof form.reset === 'function') {
            form.reset();
        } 
        // Si no es un formulario (ej: es un <div>), buscamos el <form> real que está adentro
        else {
            const formularioReal = form.querySelector('form');
            if (formularioReal && typeof formularioReal.reset === 'function') {
                formularioReal.reset();
            } else {
                console.warn('Se envió con éxito, pero no se encontró la etiqueta <form> para limpiar los campos.');
            }
        }
    }


    function showFeedback(success, message, formElement) {
        let feedbackElement;

        if (formElement.id === 'contactForm') {
            feedbackElement = document.getElementById('msgSubmit');
        } else {
            // Para el formulario de cotización creamos uno o usamos uno existente
            feedbackElement = formElement.querySelector('.feedback-msg');
            if (!feedbackElement) {
                feedbackElement = document.createElement('div');
                feedbackElement.className = 'feedback-msg h4 text-center mt-3';
                formElement.appendChild(feedbackElement);
            }
        }

        feedbackElement.textContent = message;
        feedbackElement.classList.remove('hidden', 'text-danger', 'text-success');
        feedbackElement.classList.add(success ? 'text-success' : 'text-danger');

        // Ocultar después de 5 segundos
        setTimeout(() => {
            feedbackElement.textContent = '';
        }, 5000);
    }
});
