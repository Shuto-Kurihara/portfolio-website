const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
    mobileNav.hidden = isOpen;
  });
  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'メニューを開く');
      mobileNav.hidden = true;
    }
  });
}

const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const pageLoader = document.querySelector('.page-loader');
if (pageLoader && !motionPreference.matches) {
  let loaderSeen = false;
  try {
    loaderSeen = sessionStorage.getItem('portfolio-loader-seen') === 'true';
  } catch (error) {
    loaderSeen = false;
  }

  if (loaderSeen) {
    document.documentElement.classList.add('is-loaded');
  } else {
    document.documentElement.classList.add('has-page-loader');
    let loaderFinished = false;
    const finishLoading = () => {
      if (loaderFinished) return;
      loaderFinished = true;
      document.documentElement.classList.add('is-loaded');
      try {
        sessionStorage.setItem('portfolio-loader-seen', 'true');
      } catch (error) {
        // Continue without storing the session preference.
      }
    };
    window.addEventListener('load', () => window.setTimeout(finishLoading, 640), { once: true });
    window.setTimeout(finishLoading, 1800);
  }
} else {
  document.documentElement.classList.add('is-loaded');
}

if ('IntersectionObserver' in window && !motionPreference.matches) {
  document.documentElement.classList.add('js-reveal');
  const revealTargets = document.querySelectorAll(
    'main > section, .hero-name, .hero-image, .timeline-entry, .work-card, .skill-group, .project, .contact-inner'
  );
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    if (element.matches('.timeline-entry, .work-card, .skill-group, .project')) {
      element.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
    }
    observer.observe(element);
  });
}
