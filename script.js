// script.js - Envío con fetch a Formspree + popup
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const popup = document.getElementById('popup');
  const popupClose = document.getElementById('popup-close');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const ENDPOINT = 'https://formspree.io/f/xvgbjrvk'; // tu endpoint Formspree

  const showPopup = () => {
    if (!popup) return;
    popup.setAttribute('aria-hidden', 'false');
    if (popupClose) popupClose.focus();
    clearTimeout(window._altesabiaPopupTimer);
    window._altesabiaPopupTimer = setTimeout(() => {
      popup.setAttribute('aria-hidden', 'true');
    }, 6000);
  };

  const hidePopup = () => {
    if (!popup) return;
    popup.setAttribute('aria-hidden', 'true');
    clearTimeout(window._altesabiaPopupTimer);
  };

  const showFeedback = (msg, ok = true) => {
    if (!feedback) return;
    feedback.hidden = false;
    feedback.textContent = msg;
    feedback.style.background = ok ? 'var(--gold)' : '#c94b4b';
    setTimeout(() => {
      feedback.hidden = true;
    }, 6000);
  };

  // Detecta ?success=true en la URL (si usas redirección _next)
  if (new URLSearchParams(window.location.search).get('success') === 'true') {
    showPopup();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // validación nativa
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

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.reset();
        showPopup();
        showFeedback('Mensaje enviado correctamente', true);
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

  if (popupClose) popupClose.addEventListener('click', hidePopup);
  window.addEventListener('click', (ev) => {
    if (popup && ev.target === popup) hidePopup();
  });
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') hidePopup();
  });
});