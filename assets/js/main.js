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
  const formNext = document.getElementById('formNext');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const focusTargetLinks = document.querySelectorAll('[data-focus-target]');
  const contactSection = document.getElementById('contato');
  const contactShell = document.querySelector('.contact-shell');
  const submitToast = document.getElementById('submitToast');
  const whatsappFloat = document.getElementById('whatsappFloat');
  const testimonialCarousels = Array.from(document.querySelectorAll('[data-testimonial-carousel]'));
  const testimonialCarousel = testimonialCarousels.at(-1) || null;
  const testimonialShell = testimonialCarousel ? testimonialCarousel.closest('.testimonial-carousel-shell') : null;
  const testimonialPrev = testimonialShell ? testimonialShell.querySelector('[data-carousel-prev]') : null;
  const testimonialNext = testimonialShell ? testimonialShell.querySelector('[data-carousel-next]') : null;
  const emailRegex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[A-Za-z]{2,63}|\[(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\])$/;
  const refreshIcons = () => {
    if (!window.lucide) return false;
    window.lucide.createIcons();
    return true;
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
  window.requestAnimationFrame(() => refreshIcons());
  window.setTimeout(() => refreshIcons(), 120);
  window.setTimeout(() => refreshIcons(), 420);
  window.addEventListener('load', () => {
    refreshIcons();
  }, { once: true });

  if (formNext) {
    formNext.value = `${window.location.origin}${window.location.pathname}?sent=1#topo`;
  }

  const showSubmitToast = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (submitToast) {
      window.requestAnimationFrame(() => {
        submitToast.classList.add('is-visible');
        window.setTimeout(() => {
          submitToast.classList.remove('is-visible');
        }, 7000);
      });
    }
  };

  const scrollToFocusTarget = (target) => {
    if (!target) return;

    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
    const headerOffset = header ? header.offsetHeight : 0;
    const extraOffset = isMobileViewport ? 20 : 48;
    const scrollTarget = isMobileViewport ? target : (contactShell || contactSection || target);
    const top = scrollTarget.getBoundingClientRect().top + window.scrollY - headerOffset - extraOffset;

    window.scrollTo({ top, behavior: 'smooth' });

    window.setTimeout(() => {
      target.focus({ preventScroll: true });

      if (isMobileViewport) {
        const mobileTop = target.getBoundingClientRect().top + window.scrollY - headerOffset - 20;
        window.scrollTo({ top: mobileTop, behavior: 'smooth' });
      }
    }, 420);
  };

  const currentUrl = new window.URL(window.location.href);
  const hasSubmitSuccessFlag = currentUrl.searchParams.get('sent') === '1' || window.sessionStorage.getItem('ckdev_submit_success') === '1';
  if (hasSubmitSuccessFlag) {
    showSubmitToast();
    window.sessionStorage.removeItem('ckdev_submit_success');
    currentUrl.searchParams.delete('sent');
    currentUrl.hash = '';
    window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
  }

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

  if (whatsappFloat) {
    let ticking = false;
    let lastTransform = '';

    const animateWhatsappFloat = () => {
      const isMobileViewport = window.matchMedia('(max-width: 820px)').matches;
      const scrollProgress = Math.min(window.scrollY / 900, 1);
      const verticalAmplitude = isMobileViewport ? 8 : 12;
      const travelDistance = isMobileViewport ? 20 : 28;
      const horizontalLimit = isMobileViewport ? 0 : 18;
      const verticalOffset = Math.sin(window.scrollY / 180) * verticalAmplitude - (scrollProgress * travelDistance);
      const horizontalOffset = Math.min(window.scrollY / 35, horizontalLimit);
      const transform = `translate3d(${horizontalOffset.toFixed(2)}px, ${verticalOffset.toFixed(2)}px, 0)`;

      if (transform !== lastTransform) {
        whatsappFloat.style.transform = transform;
        lastTransform = transform;
      }

      ticking = false;
    };

    animateWhatsappFloat();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(animateWhatsappFloat);
    }, { passive: true });
  }

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
      scrollToFocusTarget(target);
    });
  });

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      const sanitized = nameInput.value
        .toUpperCase()
        .replace(/[^\p{L} ]+/gu, '')
        .replace(/\s{2,}/g, ' ');
      if (sanitized !== nameInput.value) {
        const end = sanitized.length;
        nameInput.value = sanitized;
        nameInput.setSelectionRange(end, end);
      }
      const normalizedName = nameInput.value.trim();
      const isValidName = !normalizedName || /^[\p{Lu} ]+$/u.test(normalizedName);
      nameInput.setCustomValidity(isValidName ? '' : 'Use apenas letras maiusculas e espacos.');
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
    const getCarouselStep = () => {
      const firstCard = testimonialCarousel.querySelector('.carousel-card');
      if (!firstCard) return testimonialCarousel.clientWidth;
      const styles = window.getComputedStyle(testimonialCarousel);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const scrollCarousel = (direction = 1) => {
      const step = getCarouselStep();
      const maxScrollLeft = testimonialCarousel.scrollWidth - testimonialCarousel.clientWidth;
      const nextLeft = testimonialCarousel.scrollLeft + (step * direction);

      if (direction > 0 && nextLeft >= maxScrollLeft - 8) {
        testimonialCarousel.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      if (direction < 0 && testimonialCarousel.scrollLeft <= 8) {
        testimonialCarousel.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        return;
      }

      testimonialCarousel.scrollBy({ left: step * direction, behavior: 'smooth' });
    };

    let autoRotateId = null;

    const stopAutoRotate = () => {
      if (!autoRotateId) return;
      window.clearInterval(autoRotateId);
      autoRotateId = null;
    };

    const startAutoRotate = () => {
      stopAutoRotate();
      autoRotateId = window.setInterval(() => {
        scrollCarousel(1);
      }, 4800);
    };

    testimonialPrev.addEventListener('click', () => {
      scrollCarousel(-1);
      startAutoRotate();
    });

    testimonialNext.addEventListener('click', () => {
      scrollCarousel(1);
      startAutoRotate();
    });

    testimonialCarousel.addEventListener('pointerenter', stopAutoRotate);
    testimonialCarousel.addEventListener('pointerleave', startAutoRotate);
    testimonialCarousel.addEventListener('focusin', stopAutoRotate);
    testimonialCarousel.addEventListener('focusout', startAutoRotate);

    startAutoRotate();
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
    form.addEventListener('submit', (event) => {
      const button = form.querySelector('button[type="submit"]');
      if (!button) return;

      const name = form.querySelector('#name')?.value.trim() || '';
      const email = form.querySelector('#email')?.value.trim() || '';
      const message = form.querySelector('#message')?.value.trim() || '';
      const normalizedName = nameInput.value.trim();
      const isValidName = !normalizedName || /^[\p{Lu} ]+$/u.test(normalizedName);
      const isValidEmail = emailRegex.test(email);

      if (nameInput) {
        nameInput.setCustomValidity(name && !isValidName ? 'Use apenas letras maiusculas e espacos.' : '');
      }
      if (emailInput) {
        emailInput.setCustomValidity(email && !isValidEmail ? 'Informe um e-mail valido.' : '');
      }

      if (!name || !email || !message || !isValidName || !isValidEmail || !form.reportValidity()) {
        event.preventDefault();
        if (formNote) {
          formNote.textContent = 'Revise o nome e o e-mail antes de enviar.';
        }
        return;
      }

      button.disabled = true;
      button.innerHTML = 'Enviando diagnostico <i data-lucide="loader-2" class="spin"></i>';
      if (formNote) {
        formNote.textContent = 'Enviando sua mensagem pela rota segura do FormSubmit...';
      }
      window.sessionStorage.setItem('ckdev_submit_success', '1');
      refreshIcons();
    });
  }
});
