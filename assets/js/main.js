document.addEventListener('DOMContentLoaded', () => {
  const contactEmail = document.body.dataset.contactEmail || 'contato@ckdev.com.br';
  const mapCanvas = document.getElementById('brazilMapCanvas');
  const mapSource = document.getElementById('brazilMapSource');
  const header = document.querySelector('.header');
  const nav = document.querySelector('.nav');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;
  const aboutDrawerSection = document.getElementById('sobre-nos');
  const aboutDrawerClose = document.querySelector('.about-drawer-close');
  const aboutDrawerLinks = document.querySelectorAll('a[href="#sobre-nos"]');
  const form = document.getElementById('leadForm');
  const formNote = document.getElementById('formNote');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const formSubmitName = document.getElementById('formsubmitName');
  const formSubmitEmail = document.getElementById('formsubmitEmail');
  const formSubmitMessage = document.getElementById('formsubmitMessage');
  const focusTargetLinks = document.querySelectorAll('[data-focus-target]');
  const contactSection = document.getElementById('contato');
  const contactShell = document.querySelector('.contact-shell');
  const testimonialCarousel = document.querySelector('[data-testimonial-carousel]');
  const testimonialPrev = document.querySelector('[data-carousel-prev]');
  const testimonialNext = document.querySelector('[data-carousel-next]');
  const emailRegex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[A-Za-z]{2,63}|\[(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\])$/;
  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const closeMobileMenu = () => {
    if (!mobileMenuBtn || !nav || !menuIcon) return;
    nav.classList.remove('active');
    menuIcon.setAttribute('data-lucide', 'menu');
    refreshIcons();
  };

  const openAboutDrawer = () => {
    if (!aboutDrawerSection) return;
    aboutDrawerSection.classList.add('is-open');
    aboutDrawerSection.setAttribute('aria-hidden', 'false');
    aboutDrawerLinks.forEach((link) => link.setAttribute('aria-expanded', 'true'));

    const headerOffset = header ? header.offsetHeight + 12 : 0;
    const top = aboutDrawerSection.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const closeAboutDrawer = ({ scrollToTop = false } = {}) => {
    if (!aboutDrawerSection) return;
    aboutDrawerSection.classList.remove('is-open');
    aboutDrawerSection.setAttribute('aria-hidden', 'true');
    aboutDrawerLinks.forEach((link) => link.setAttribute('aria-expanded', 'false'));
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        closeMobileMenu();
      });
    });
  }

  aboutDrawerLinks.forEach((link) => {
    link.setAttribute('aria-expanded', 'false');
    link.addEventListener('click', (event) => {
      event.preventDefault();
      closeMobileMenu();
      openAboutDrawer();
    });
  });

  if (aboutDrawerClose) {
    aboutDrawerClose.addEventListener('click', () => {
      closeAboutDrawer({ scrollToTop: true });
    });
  }

  focusTargetLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.dataset.focusTarget;
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;
      event.preventDefault();
      closeAboutDrawer();
      closeMobileMenu();
      const scrollTarget = contactShell || contactSection || target;
      const headerOffset = header ? header.offsetHeight + 48 : 48;
      const top = scrollTarget.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      window.setTimeout(() => target.focus({ preventScroll: true }), 420);
    });
  });

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      const sanitized = nameInput.value
        .toUpperCase()
        .replace(/[^A-ZÀ-ÖØ-Ý ]+/g, '')
        .replace(/\s{2,}/g, ' ');
      if (sanitized !== nameInput.value) {
        const end = sanitized.length;
        nameInput.value = sanitized;
        nameInput.setSelectionRange(end, end);
      }
      const isValidName = /^[A-ZÀ-ÖØ-Ý ]+$/.test(nameInput.value.trim());
      nameInput.setCustomValidity(nameInput.value.trim() && !isValidName ? 'Use apenas letras maiúsculas e espaços.' : '');
    });
  }

  if (emailInput) {
    const validateEmailInput = () => {
      const value = emailInput.value.trim();
      const isValid = !value || emailRegex.test(value);
      emailInput.setCustomValidity(isValid ? '' : 'Informe um e-mail válido.');
    };

    emailInput.addEventListener('input', validateEmailInput);
    emailInput.addEventListener('blur', validateEmailInput);
  }

  if (testimonialCarousel && testimonialPrev && testimonialNext) {
    const scrollAmount = () => testimonialCarousel.clientWidth * 0.92;

    testimonialPrev.addEventListener('click', () => {
      testimonialCarousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    testimonialNext.addEventListener('click', () => {
      testimonialCarousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
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
      if (anchor.hasAttribute('data-focus-target')) return;
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      if (targetId === '#topo') {
        event.preventDefault();
        closeAboutDrawer();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (targetId === '#sobre-nos') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      closeAboutDrawer();
      const headerOffset = targetId === '#depoimentos'
        ? (header ? Math.max(header.offsetHeight - 28, 0) : 0)
        : (header ? header.offsetHeight + 12 : 0);
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (!button) return;

      const name = form.querySelector('#name')?.value.trim() || '';
      const email = form.querySelector('#email')?.value.trim() || '';
      const message = form.querySelector('#message')?.value.trim() || '';
      const isValidName = /^[A-ZÀ-ÖØ-Ý ]+$/.test(name);
      const isValidEmail = emailRegex.test(email);

      if (nameInput) {
        nameInput.setCustomValidity(name && !isValidName ? 'Use apenas letras maiúsculas e espaços.' : '');
      }
      if (emailInput) {
        emailInput.setCustomValidity(email && !isValidEmail ? 'Informe um e-mail válido.' : '');
      }

      if (!name || !email || !message || !isValidName || !isValidEmail || !form.reportValidity()) {
        if (formNote) {
          formNote.textContent = 'Revise o nome e o e-mail antes de enviar.';
        }
        return;
      }

      const originalMarkup = button.innerHTML;
      button.disabled = true;
      button.innerHTML = 'Enviando diagnostico <i data-lucide="loader-2" class="spin"></i>';
      if (formNote) {
        formNote.textContent = 'Enviando sua mensagem pela rota segura do FormSubmit...';
      }
      refreshIcons();

      try {
        if (!formSubmitName || !formSubmitEmail || !formSubmitMessage) {
          throw new Error('missing_formsubmit_fields');
        }

        formSubmitName.value = name;
        formSubmitEmail.value = email;
        formSubmitMessage.value = message;
        form.submit();

        button.innerHTML = 'Diagnostico enviado <i data-lucide="check"></i>';
        if (formNote) {
          formNote.textContent = 'Recebemos sua mensagem e o FormSubmit encaminhou o diagnóstico.';
        }
        refreshIcons();

        window.setTimeout(() => {
          form.reset();
          button.disabled = false;
          button.innerHTML = originalMarkup;
          if (formNote) {
            formNote.textContent = 'Seu pedido vai direto para a caixa de entrada local da CKDEV e da Resolve Planilhas.';
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
