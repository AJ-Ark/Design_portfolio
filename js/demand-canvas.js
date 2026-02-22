/**
 * Demand Canvas — Interactive Component
 * Handles left nav, collapsible sections, and hover interactions
 */
(function () {
  'use strict';

  function initDemandCanvas() {
    var wrapper = document.getElementById('demandCanvas');
    if (!wrapper) return;

    // ─── Left nav item clicks ───
    var navItems = wrapper.querySelectorAll('.dc-nav-item');
    navItems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        navItems.forEach(function (n) { n.classList.remove('dc-nav-active'); });
        item.classList.add('dc-nav-active');
      });
    });

    // ─── Collapsible sections ───
    var collapsibles = wrapper.querySelectorAll('.dc-collapse');
    collapsibles.forEach(function (section) {
      var header = section.querySelector('.dc-clickable');
      if (!header) return;

      header.addEventListener('click', function () {
        var isCollapsed = section.getAttribute('data-collapsed') === 'true';
        var body = section.querySelector('.dc-card-body');
        if (!body) return;

        if (isCollapsed) {
          body.classList.remove('dc-hidden');
          section.setAttribute('data-collapsed', 'false');
        } else {
          body.classList.add('dc-hidden');
          section.setAttribute('data-collapsed', 'true');
        }
      });
    });

    // Re-init Lucide icons for canvas component
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemandCanvas);
  } else {
    initDemandCanvas();
  }
})();
