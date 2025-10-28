// script.js - Envío con fetch a Formspree + mensaje centrado con retardo de 2 segundos
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const ENDPOINT = 'https://formspree.io/f/xvgbjrvk'; // tu endpoint Formspree

  const showFeedback = (msg, ok = true) => {
    if (!feedback) return;
    feedback.hidden = false;
    feedback.textContent = msg;
    feedback.style.background = ok ? 'var(--gold)' : '#c94b4b';
    feedback.style.color = ok ? '#000' : '#fff';
    feedback.style.textAlign = 'center';
    feedback.style.marginTop = '1rem';
    feedback.style.padding = '10px';
    feedback.style.borderRadius = '8px';
    feedback.style.transition = 'opacity 0.4s ease';
    feedback.style.opacity = '1';

    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        feedback.hidden = true;
      }, 400);
    }, 6000);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      var prevText = submitButton.textContent;
      submitButton.textContent = 'Enviando...';
    }

    try {
      const formData = new FormData(form);

      // 🔸 Mostrar el mensaje 2 segundos después de iniciar el envío
      setTimeout(() => {
        showFeedback('Gracias, tu mensaje fue enviado 💫', true);
      }, 2000);

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.reset();
      } else {
        let msg = 'No se pudo enviar. Intenta nuevamente.';
        try {
          const json = await response.json();
          if (json && json.errors) msg = json.errors.map(x => x.message).join('\n');
        } catch (_) {}
        showFeedback(msg, false);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showFeedback('Error de conexión. Intenta más tarde.', false);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.textContent = prevText || 'Enviar';
      }
    }
  });
});
