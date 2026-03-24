document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const heroSection = document.querySelector('.hero');
  const nav = document.querySelector('.nav');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const menuIcon = mobileMenuBtn?.querySelector('i') || null;
  const aboutDrawerSection = document.getElementById('sobre-nos');
  const aboutDrawerClose = document.querySelector('.about-drawer-close');
  const aboutDrawerLinks = document.querySelectorAll('a[href="#sobre-nos"]');
  const contactSection = document.getElementById('contato');
  const contactShell = document.querySelector('.contact-shell');
  const submitToast = document.getElementById('submitToast');
  const whatsappFloat = document.getElementById('whatsappFloat');
  const testimonialsSection = document.getElementById('depoimentos');
  const testimonialShell = testimonialsSection?.querySelector('.testimonial-carousel-shell') || null;
  const testimonialCarousel = testimonialShell?.querySelector('[data-testimonial-carousel]') || null;
  const testimonialPrev = testimonialShell?.querySelector('[data-carousel-prev]') || null;
  const testimonialNext = testimonialShell?.querySelector('[data-carousel-next]') || null;
  const mapCanvas = document.getElementById('brazilMapCanvas');
  const mapSource = document.getElementById('brazilMapSource');
  const form = document.getElementById('leadForm');
  const formNote = document.getElementById('formNote');
  const formNext = document.getElementById('formNext');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const focusTargetLinks = document.querySelectorAll('[data-focus-target]');
  const emailRegex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[A-Za-z]{2,63}|\[(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\])$/;

  const refreshIcons = () => {
    if (!window.lucide) return false;
    window.lucide.createIcons();
    return true;
  };

  const isMobileViewport = () => window.matchMedia('(max-width: 767px)').matches;

  const scheduleIdleTask = (callback) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 1200 });
      return;
    }

    window.setTimeout(callback, 180);
  };

  const scheduleNonCriticalSetup = (callback) => {
    if (isMobileViewport()) {
      scheduleIdleTask(callback);
      return;
    }

    callback();
  };

  const getHeaderOffset = (extraOffset = 12) => (header ? header.offsetHeight + extraOffset : extraOffset);

  const scrollToElement = (target, extraOffset = 12) => {
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(extraOffset);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const getHomeHeroTop = () => {
    if (!heroSection) return 0;
    const top = heroSection.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight - 2 : 0);
    return Math.max(top, 0);
  };

  const scrollToHomeHero = (behavior = 'smooth') => {
    window.scrollTo({ top: getHomeHeroTop(), behavior });
  };

  const closeMobileMenu = () => {
    if (!mobileMenuBtn || !nav || !menuIcon) return;
    nav.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    menuIcon.setAttribute('data-lucide', 'menu');
    refreshIcons();
  };

  const openAboutDrawer = () => {
    if (!aboutDrawerSection) return;
    aboutDrawerSection.classList.add('is-open');
    aboutDrawerSection.setAttribute('aria-hidden', 'false');
    aboutDrawerSection.inert = false;
    aboutDrawerLinks.forEach((link) => link.setAttribute('aria-expanded', 'true'));
    scrollToElement(aboutDrawerSection, 12);
  };

  const closeAboutDrawer = ({ scrollToTop = false } = {}) => {
    if (!aboutDrawerSection) return;
    aboutDrawerSection.classList.remove('is-open');
    aboutDrawerSection.setAttribute('aria-hidden', 'true');
    aboutDrawerSection.inert = true;
    aboutDrawerLinks.forEach((link) => link.setAttribute('aria-expanded', 'false'));

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToContactIntro = () => {
    const target = contactSection || contactShell;
    if (!target) return;
    scrollToElement(target, 0);
  };

  const scrollToFocusTarget = (target) => {
    if (!target) return;

    const mobileViewport = isMobileViewport();
    const scrollTarget = mobileViewport ? target : (contactShell || contactSection || target);
    const extraOffset = mobileViewport ? 20 : 48;
    scrollToElement(scrollTarget, extraOffset);

    window.setTimeout(() => {
      target.focus({ preventScroll: true });

      if (mobileViewport) {
        const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(20);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 420);
  };

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  };

  const showSubmitToast = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (!submitToast) return;
    window.requestAnimationFrame(() => {
      submitToast.classList.add('is-visible');
      window.setTimeout(() => {
        submitToast.classList.remove('is-visible');
      }, 7000);
    });
  };

  const setSubmittingState = (button, isSubmitting) => {
    if (!button) return;
    button.disabled = isSubmitting;
    button.innerHTML = isSubmitting
      ? 'Enviando sua solicitacao <i data-lucide="loader-2" class="spin"></i>'
      : 'Solicitar diagnóstico inicial <i data-lucide="send"></i>';
    refreshIcons();
  };

  const validateNameInput = () => {
    if (!nameInput) return false;

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
    const isValid = !normalizedName || /^[\p{Lu} ]+$/u.test(normalizedName);
    nameInput.setCustomValidity(isValid ? '' : 'Use apenas letras maiusculas e espacos.');
    return isValid;
  };

  const validateEmailInput = () => {
    if (!emailInput) return false;
    const value = emailInput.value.trim();
    const isValid = !value || emailRegex.test(value);
    emailInput.setCustomValidity(isValid ? '' : 'Informe um e-mail valido.');
    return isValid;
  };

  const initializeHeroSnap = () => {
    window.addEventListener('load', () => {
      refreshIcons();
      const shouldSnapToHomeHero = (!window.location.hash || window.location.hash === '#topo') && !isMobileViewport();
      if (!shouldSnapToHomeHero) return;

      window.requestAnimationFrame(() => {
        scrollToHomeHero('auto');
      });
    }, { once: true });
  };

  const initializeSuccessState = () => {
    const currentUrl = new window.URL(window.location.href);
    const hasSubmitSuccessFlag =
      currentUrl.searchParams.get('sent') === '1' ||
      window.sessionStorage.getItem('ckdev_submit_success') === '1';

    if (!hasSubmitSuccessFlag) return;

    showSubmitToast();
    window.sessionStorage.removeItem('ckdev_submit_success');
    currentUrl.searchParams.delete('sent');
    currentUrl.hash = '';
    window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
  };

  const initializeMap = () => {
    if (!(mapCanvas && mapSource)) return;

    const renderBrazilMap = () => {
      if (!mapSource.complete) return;

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
        const isSoftGray =
          red > 215 &&
          green > 215 &&
          blue > 215 &&
          Math.abs(red - green) < 12 &&
          Math.abs(green - blue) < 12;

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

      context.drawImage(offscreen, offsetX, offsetY, drawWidth, drawHeight);
    };

    scheduleNonCriticalSetup(() => {
      let hasRendered = false;

      const renderWhenReady = () => {
        if (hasRendered) {
          renderBrazilMap();
          return;
        }

        const runRender = () => {
          renderBrazilMap();
          hasRendered = true;
          window.addEventListener('resize', renderBrazilMap, { passive: true });
        };

        if (mapSource.complete) {
          scheduleIdleTask(runRender);
          return;
        }

        mapSource.addEventListener('load', () => scheduleIdleTask(runRender), { once: true });
      };

      if ('IntersectionObserver' in window) {
        const mapObserver = new IntersectionObserver((entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            renderWhenReady();
            currentObserver.disconnect();
          });
        }, {
          rootMargin: '220px 0px'
        });

        mapObserver.observe(mapCanvas);
        return;
      }

      renderWhenReady();
    });
  };

  const initializeWhatsappFloat = () => {
    if (!whatsappFloat) return;

    let ticking = false;
    let lastTransform = '';

    const animateWhatsappFloat = () => {
      const mobileViewport = window.matchMedia('(max-width: 820px)').matches;
      const scrollProgress = Math.min(window.scrollY / 900, 1);
      const verticalAmplitude = mobileViewport ? 8 : 12;
      const travelDistance = mobileViewport ? 20 : 28;
      const horizontalLimit = mobileViewport ? 0 : 18;
      const verticalOffset = Math.sin(window.scrollY / 180) * verticalAmplitude - (scrollProgress * travelDistance);
      const horizontalOffset = Math.min(window.scrollY / 35, horizontalLimit);
      const transform = `translate3d(${horizontalOffset.toFixed(2)}px, ${verticalOffset.toFixed(2)}px, 0)`;

      if (transform !== lastTransform) {
        whatsappFloat.style.transform = transform;
        lastTransform = transform;
      }

      ticking = false;
    };

    if (isMobileViewport()) {
      whatsappFloat.style.transform = 'translate3d(0, 0, 0)';
      whatsappFloat.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = whatsappFloat.href;
      });
      return;
    }

    animateWhatsappFloat();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(animateWhatsappFloat);
    }, { passive: true });
  };

  const initializeMobileMenu = () => {
    if (!(mobileMenuBtn && nav && menuIcon)) return;

    mobileMenuBtn.addEventListener('click', () => {
      const isActive = nav.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', String(isActive));
      menuIcon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
      refreshIcons();
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  };

  const initializeAboutDrawer = () => {
    aboutDrawerLinks.forEach((link) => {
      link.setAttribute('aria-expanded', 'false');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        closeMobileMenu();
        openAboutDrawer();
      });
    });

    aboutDrawerClose?.addEventListener('click', () => {
      closeAboutDrawer({ scrollToTop: true });
    });
  };

  const initializeFocusLinks = () => {
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
  };

  const initializeAnchors = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        if (anchor.hasAttribute('data-focus-target')) return;

        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#' || targetId === '#sobre-nos') return;

        if (targetId === '#topo') {
          event.preventDefault();
          closeAboutDrawer();
          closeMobileMenu();
          scrollToHomeHero('smooth');
          return;
        }

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        closeAboutDrawer();
        closeMobileMenu();

        if (targetId === '#contato' && isMobileViewport()) {
          scrollToContactIntro();
          return;
        }

        const extraOffset = targetId === '#depoimentos' ? -28 : 12;
        scrollToElement(target, extraOffset);
      });
    });
  };

  const initializeForm = () => {
    if (formNext) {
      formNext.value = `${window.location.origin}${window.location.pathname}?sent=1#topo`;
    }

    if (nameInput) {
      nameInput.setAttribute('enterkeyhint', 'next');
      nameInput.addEventListener('input', validateNameInput);
      nameInput.addEventListener('keydown', (event) => {
        if (!isMobileViewport() || event.key !== 'Enter' || !emailInput) return;
        event.preventDefault();
        emailInput.focus();
      });
    }

    if (emailInput) {
      emailInput.setAttribute('enterkeyhint', 'next');
      emailInput.addEventListener('input', validateEmailInput);
      emailInput.addEventListener('blur', validateEmailInput);
      emailInput.addEventListener('keydown', (event) => {
        if (!isMobileViewport() || event.key !== 'Enter' || !messageInput) return;
        event.preventDefault();
        messageInput.focus();
      });
    }

    if (messageInput) {
      messageInput.setAttribute('enterkeyhint', 'done');
    }

    if (!form) return;

    form.addEventListener('submit', async (event) => {
      const button = form.querySelector('button[type="submit"]');
      if (!button) return;

      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const message = messageInput?.value.trim() || '';
      const isValidName = validateNameInput();
      const isValidEmail = validateEmailInput();

      if (!name || !email || !message || !isValidName || !isValidEmail || !form.reportValidity()) {
        event.preventDefault();
        if (formNote) {
          formNote.textContent = 'Revise seus dados para que possamos retornar com mais agilidade.';
        }
        return;
      }

      event.preventDefault();
      setSubmittingState(button, true);

      if (formNote) {
        formNote.textContent = 'Estamos enviando sua solicitacao para analise.';
      }

      try {
        const response = await window.fetch(form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/'), {
          method: 'POST',
          headers: {
            Accept: 'application/json'
          },
          body: new FormData(form)
        });

        if (!response.ok) {
          throw new Error(`FormSubmit responded with ${response.status}`);
        }

        form.reset();
        window.sessionStorage.setItem('ckdev_submit_success', '1');
        showSubmitToast();

        if (formNote) {
          formNote.textContent = 'Solicitacao enviada com sucesso. Em breve retornaremos no e-mail informado.';
        }
      } catch {
        if (formNote) {
          formNote.textContent = 'Nao foi possivel concluir o envio agora. Tente novamente em instantes ou fale conosco pelo e-mail ao lado.';
        }
      } finally {
        setSubmittingState(button, false);
      }
    });
  };

  const initializeTestimonialCarousel = () => {
    if (!(testimonialCarousel && testimonialPrev && testimonialNext)) return;

    scheduleNonCriticalSetup(() => {
      const carouselCards = Array.from(testimonialCarousel.querySelectorAll('.carousel-card'));
      if (!carouselCards.length) return;

      let activeIndex = 0;
      let autoRotateId = null;
      let visibleCount = 3;

      const renderCarousel = () => {
        visibleCount = window.matchMedia('(max-width: 560px)').matches
          ? 1
          : window.matchMedia('(max-width: 1080px)').matches
            ? 2
            : 3;

        const maxIndex = Math.max(0, carouselCards.length - visibleCount);
        activeIndex = Math.min(activeIndex, maxIndex);

        const gap = Number.parseFloat(window.getComputedStyle(testimonialCarousel).gap || '0') || 0;
        const cardWidth = carouselCards[0].getBoundingClientRect().width;
        const offset = (cardWidth + gap) * activeIndex;

        testimonialCarousel.style.transform = `translate3d(-${offset}px, 0, 0)`;
        testimonialCarousel.style.minHeight = `${Math.max(...carouselCards.map((card) => card.offsetHeight), 0)}px`;

        carouselCards.forEach((card, index) => {
          const isVisible = index >= activeIndex && index < activeIndex + visibleCount;
          card.classList.toggle('is-active', isVisible);
          card.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
          card.tabIndex = isVisible ? 0 : -1;
        });
      };

      const goToSlide = (nextIndex) => {
        const maxIndex = Math.max(0, carouselCards.length - visibleCount);

        if (nextIndex < 0) {
          activeIndex = maxIndex;
        } else if (nextIndex > maxIndex) {
          activeIndex = 0;
        } else {
          activeIndex = nextIndex;
        }

        renderCarousel();
      };

      const stopAutoRotate = () => {
        if (!autoRotateId) return;
        window.clearInterval(autoRotateId);
        autoRotateId = null;
      };

      const startAutoRotate = () => {
        stopAutoRotate();
        autoRotateId = window.setInterval(() => {
          goToSlide(activeIndex + 1);
        }, 4800);
      };

      testimonialPrev.addEventListener('click', () => {
        goToSlide(activeIndex - 1);
        startAutoRotate();
      });

      testimonialNext.addEventListener('click', () => {
        goToSlide(activeIndex + 1);
        startAutoRotate();
      });

      testimonialShell?.addEventListener('pointerenter', stopAutoRotate);
      testimonialShell?.addEventListener('pointerleave', startAutoRotate);
      testimonialShell?.addEventListener('focusin', stopAutoRotate);
      testimonialShell?.addEventListener('focusout', startAutoRotate);
      window.addEventListener('resize', renderCarousel);

      renderCarousel();
      startAutoRotate();
    });
  };

  const initializeRevealAnimations = () => {
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
      return;
    }

    revealItems.forEach((item) => item.classList.add('active'));
  };

  refreshIcons();
  updateHeader();
  initializeHeroSnap();
  initializeSuccessState();
  initializeMap();
  initializeWhatsappFloat();
  initializeMobileMenu();
  initializeAboutDrawer();
  initializeFocusLinks();
  initializeAnchors();
  initializeForm();
  initializeTestimonialCarousel();
  initializeRevealAnimations();

  window.addEventListener('scroll', updateHeader, { passive: true });
});
