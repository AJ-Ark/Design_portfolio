/**
 * Resource Allocation Demo — Interactive Component
 * Handles filter removal, card expansion, and view-all button
 */
(function () {
  'use strict';

  function initResourceDemo() {
    var wrapper = document.getElementById('resourceDemo');
    if (!wrapper) return;

    // ─── Filter tag removal ───
    var filters = wrapper.querySelectorAll('.rd-filter-tag');
    filters.forEach(function (tag) {
      var closeBtn = tag.querySelector('.rd-filter-x');
      if (!closeBtn) return;
      closeBtn.addEventListener('click', function () {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        setTimeout(function () {
          tag.style.display = 'none';
          // Update match count
          var visible = wrapper.querySelectorAll('.rd-filter-tag[style*="display: none"]');
          var count = wrapper.querySelector('.rd-match-count');
          if (count && visible.length > 0) {
            count.textContent = 'Filters updated';
          }
        }, 200);
      });
    });

    // ─── Card click to expand details ───
    var cards = wrapper.querySelectorAll('.rd-card');
    cards.forEach(function (card) {
      var header = card;
      header.addEventListener('click', function (e) {
        // Don't toggle if clicking inside details
        if (e.target.closest('.rd-card-details')) return;

        var isExpanded = card.classList.contains('rd-card-expanded');
        // Collapse all first
        cards.forEach(function (c) { c.classList.remove('rd-card-expanded'); });
        // Toggle clicked card
        if (!isExpanded) {
          card.classList.add('rd-card-expanded');
        }
      });
    });

    // Start with the top card expanded
    var topCard = wrapper.querySelector('.rd-card-top');
    if (topCard) {
      topCard.classList.add('rd-card-expanded');
    }

    // ─── View All button ───
    var viewAll = wrapper.querySelector('.rd-view-all');
    if (viewAll) {
      viewAll.addEventListener('click', function () {
        viewAll.textContent = 'Loading all resources…';
        setTimeout(function () {
          viewAll.textContent = 'View All 427 Resources';
        }, 1500);
      });
    }

    // Re-init Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResourceDemo);
  } else {
    initResourceDemo();
  }
})();
