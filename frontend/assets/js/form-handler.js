document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const msgSubmit = document.getElementById('msgSubmit');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Recoger datos
            const formData = {
                nombre: document.getElementById('name').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('phone_number').value,
                asunto: document.getElementById('msg_subject').value,
                mensaje: document.getElementById('message').value,
                tipo_formulario: 'contacto'
            };

            submitFormData(formData, contactForm);
        });
    }

    // Manejar el formulario de cotización (el de arriba)
    const quoteForm = document.querySelector('.courses-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = {
                servicio: quoteForm.querySelector('select').value,
                nombre: document.getElementById('txtNombre').value,
                apellido: document.getElementById('txtApellido').value,
                telefono: document.getElementById('txtTelefono').value,
                tipo_formulario: 'cotizacion',
                asunto: 'Solicitud de Cotización'
            };

            submitFormData(formData, quoteForm);
        });
    }

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
        form.reset();
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
