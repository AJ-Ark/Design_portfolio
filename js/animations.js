// Scroll-triggered fade-up animations
document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Animate hero elements on load
  const heroElements = document.querySelectorAll('[data-animate="fade-up"]');

  heroElements.forEach((el, index) => {
    const delay = parseInt(el.getAttribute('data-delay')) || 0;

    setTimeout(() => {
      el.classList.add('animate-in');
    }, delay);
  });

  // Scroll-triggered animations for other sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });

  // ==========================================
  // MOUSE PARALLAX (desktop only)
  // ==========================================
  const heroGlow = document.querySelector('.hero-glow');
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;

  if (heroGlow && isDesktop) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroGlow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  }

  // ==========================================
  // GSAP SCROLL-BASED GRADIENT SHIFTS
  // ==========================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Subtle body background color shift as user scrolls
    gsap.to('body', {
      backgroundColor: '#060A14',
      ease: 'none',
      scrollTrigger: {
        trigger: 'main',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    // Hero glow fades out as user scrolls past hero
    if (heroGlow) {
      gsap.to(heroGlow, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'center center',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // Grid overlay fades slightly as user scrolls deeper
    const gridOverlay = document.querySelector('.grid-overlay');
    if (gridOverlay) {
      gsap.to(gridOverlay, {
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: 'main',
          start: '30% top',
          end: 'bottom bottom',
          scrub: 1
        }
      });
    }
  }

  // ==========================================
  // SCROLL TO TOP BUTTON
  // ==========================================
  const scrollBtn = document.getElementById('scrollToTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
