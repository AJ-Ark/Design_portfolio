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

  // Scroll-triggered animations for other sections (to be added)
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
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

});
