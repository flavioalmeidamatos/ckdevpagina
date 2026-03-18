document.addEventListener('DOMContentLoaded', () => {
  const contactEmail = document.body.dataset.contactEmail || 'contato@ckdev.com.br';
  const mapCanvas = document.getElementById('brazilMapCanvas');
  const mapSource = document.getElementById('brazilMapSource');
  const header = document.querySelector('.header');
  const nav = document.querySelector('.nav');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;
  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  refreshIcons();

  const renderBrazilMap = () => {
    if (!mapCanvas || !mapSource || !mapSource.complete) return;

    const context = mapCanvas.getContext('2d');
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const width = mapCanvas.clientWidth || 900;
    const height = mapCanvas.clientHeight || 520;

    mapCanvas.width = Math.round(width * dpr);
    mapCanvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const sourceWidth = mapSource.naturalWidth;
    const sourceHeight = mapSource.naturalHeight;
    if (!sourceWidth || !sourceHeight) return;

    const scale = Math.min((width * 0.82) / sourceWidth, (height * 0.82) / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2 - 4;

    const offscreen = document.createElement('canvas');
    offscreen.width = sourceWidth;
    offscreen.height = sourceHeight;
    const offscreenContext = offscreen.getContext('2d');
    if (!offscreenContext) return;

    offscreenContext.drawImage(mapSource, 0, 0);
    const imageData = offscreenContext.getImageData(0, 0, sourceWidth, sourceHeight);
    const pixels = imageData.data;

    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const alpha = pixels[index + 3];
      const isLightBackground = red > 230 && green > 230 && blue > 230;
      const isSoftGray = red > 215 && green > 215 && blue > 215 && Math.abs(red - green) < 12 && Math.abs(green - blue) < 12;

      if (alpha > 0 && (isLightBackground || isSoftGray)) {
        pixels[index + 3] = 0;
      }
    }

    offscreenContext.putImageData(imageData, 0, 0);

    context.save();
    context.shadowColor = 'rgba(103, 232, 249, 0.28)';
    context.shadowBlur = 42;
    context.drawImage(offscreen, offsetX, offsetY, drawWidth, drawHeight);
    context.restore();

    context.save();
    context.globalAlpha = 0.18;
    context.filter = 'blur(18px)';
    context.drawImage(offscreen, offsetX, offsetY + 10, drawWidth, drawHeight);
    context.restore();

    context.save();
    context.drawImage(offscreen, offsetX, offsetY, drawWidth, drawHeight);
    context.restore();
  };

  if (mapSource) {
    if (mapSource.complete) {
      renderBrazilMap();
    } else {
      mapSource.addEventListener('load', renderBrazilMap, { once: true });
    }
    window.addEventListener('resize', renderBrazilMap);
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader);

  if (mobileMenuBtn && nav && menuIcon) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuIcon.setAttribute('data-lucide', nav.classList.contains('active') ? 'x' : 'menu');
      refreshIcons();
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuIcon.setAttribute('data-lucide', 'menu');
        refreshIcons();
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        currentObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('active'));
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      const headerOffset = header ? header.offsetHeight + 12 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const form = document.getElementById('leadForm');
  const formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (!button) return;

      const name = form.querySelector('#name')?.value.trim() || '';
      const email = form.querySelector('#email')?.value.trim() || '';
      const message = form.querySelector('#message')?.value.trim() || '';
      const originalMarkup = button.innerHTML;
      button.disabled = true;
      button.innerHTML = 'Enviando diagnostico <i data-lucide="loader-2" class="spin"></i>';
      if (formNote) {
        formNote.textContent = 'Enviando sua mensagem para a CKDEV...';
      }
      refreshIcons();

      try {
        const response = await window.fetch('/api/diagnosticos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            message
          })
        });

        let payload = null;
        try {
          payload = await response.json();
        } catch (parseError) {
          payload = null;
        }

        if (!response.ok || !payload.ok) {
          throw new Error(payload?.error || 'request_failed');
        }

        button.innerHTML = 'Diagnostico enviado <i data-lucide="check"></i>';
        if (formNote) {
          formNote.textContent = `Recebemos sua mensagem. Se precisar, fale tambem por ${contactEmail}.`;
        }
        refreshIcons();

        window.setTimeout(() => {
          form.reset();
          button.disabled = false;
          button.innerHTML = originalMarkup;
          if (formNote) {
            formNote.textContent = 'Seu pedido vai direto para a caixa de entrada local da CKDEV, sem abrir cliente de e-mail.';
          }
          refreshIcons();
        }, 2200);
      } catch (error) {
        button.disabled = false;
        button.innerHTML = 'Tentar novamente <i data-lucide="send"></i>';
        if (formNote) {
          formNote.textContent = `Nao foi possivel enviar agora. Tente novamente ou use ${contactEmail}.`;
        }
        refreshIcons();
      }
    });
  }
});
