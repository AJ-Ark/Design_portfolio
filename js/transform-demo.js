/**
 * Transformation Demo — Interactive Click-to-Convert
 * Clicking the button triggers a multi-step animation:
 *  1. Demand cards highlight sequentially (sending)
 *  2. Particles fly from left → right across center
 *  3. Project cards appear one by one (receiving)
 *  4. Stats and bottom message fade in
 *  5. Button can be reset to replay
 */
(function () {
  'use strict';

  function initTransformDemo() {
    var wrapper = document.getElementById('transformDemo');
    var btn = document.getElementById('tfConvertBtn');
    if (!wrapper || !btn) return;

    var isConverting = false;
    var hasConverted = false;

    var demandCards = wrapper.querySelectorAll('.tf-demand .tf-card');
    var resultCards = wrapper.querySelectorAll('.tf-card-result');
    var emptyState = document.getElementById('tfEmpty');
    var projectStatus = document.getElementById('tfProjectStatus');
    var stats = document.getElementById('tfStats');
    var bottomMsg = document.getElementById('tfBottomMsg');
    var canvas = document.getElementById('tfParticles');
    var ctx = canvas ? canvas.getContext('2d') : null;
    var particles = [];
    var animFrameId = null;

    // ─── Particle system ───
    function resizeCanvas() {
      if (!canvas) return;
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width + 80;
      canvas.height = rect.height + 120;
    }

    function spawnParticle(fromLeft) {
      if (!canvas) return;
      var w = canvas.width;
      var h = canvas.height;
      var startX = fromLeft ? -10 : w + 10;
      var endX = fromLeft ? w + 10 : -10;
      var y = h * 0.3 + Math.random() * h * 0.4;

      particles.push({
        x: startX,
        y: y,
        targetX: endX,
        targetY: h * 0.3 + Math.random() * h * 0.4,
        speed: 2 + Math.random() * 3,
        size: 2 + Math.random() * 3,
        alpha: 0.6 + Math.random() * 0.4,
        hue: Math.random() > 0.5 ? 20 : 25 // orange hues
      });
    }

    function animateParticles() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.speed;
        p.y += (p.targetY - p.y) * 0.02;
        p.alpha -= 0.005;

        if (p.alpha <= 0 || p.x > canvas.width + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 107, 53, ' + p.alpha + ')';
        ctx.fill();

        // Trailing glow
        ctx.beginPath();
        ctx.arc(p.x - p.speed * 2, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 107, 53, ' + (p.alpha * 0.3) + ')';
        ctx.fill();
      }

      if (particles.length > 0) {
        animFrameId = requestAnimationFrame(animateParticles);
      }
    }

    function burstParticles() {
      resizeCanvas();
      for (var i = 0; i < 30; i++) {
        setTimeout(function () {
          spawnParticle(true);
        }, i * 60);
      }
      animateParticles();
    }

    // ─── Conversion sequence ───
    function runConversion() {
      if (isConverting) return;
      isConverting = true;

      wrapper.classList.add('tf-converting');

      // Button active state
      btn.classList.add('tf-btn-active');
      btn.querySelector('.tf-btn-label').textContent = 'Converting…';
      btn.querySelector('.tf-btn-sub').textContent = 'Transferring context';

      // Start particles
      burstParticles();

      // Phase 1: Highlight demand cards sequentially
      demandCards.forEach(function (card, idx) {
        setTimeout(function () {
          card.classList.add('tf-card-sending');
        }, idx * 200);

        // Remove highlight after a bit
        setTimeout(function () {
          card.classList.remove('tf-card-sending');
        }, idx * 200 + 600);
      });

      // Phase 2: Hide empty state, show project canvas receiving
      var phase2Delay = demandCards.length * 200 + 300;
      setTimeout(function () {
        wrapper.querySelector('.tf-demand').classList.add('tf-converting');
        wrapper.querySelector('.tf-project').classList.add('tf-receiving');

        if (emptyState) emptyState.style.display = 'none';

        if (projectStatus) {
          projectStatus.textContent = 'Generating…';
          projectStatus.classList.add('tf-active');
        }
      }, phase2Delay);

      // Phase 3: Reveal project cards one by one
      var phase3Start = phase2Delay + 400;
      resultCards.forEach(function (card, idx) {
        setTimeout(function () {
          card.classList.remove('tf-card-hidden');
          card.classList.add('tf-card-received');
        }, phase3Start + idx * 300);
      });

      // Phase 4: Finish
      var finishDelay = phase3Start + resultCards.length * 300 + 400;
      setTimeout(function () {
        wrapper.classList.remove('tf-converting');
        wrapper.querySelector('.tf-demand').classList.remove('tf-converting');
        wrapper.querySelector('.tf-project').classList.remove('tf-receiving');

        // Button done state
        btn.classList.remove('tf-btn-active');
        btn.classList.add('tf-btn-done');
        btn.querySelector('.tf-btn-label').textContent = 'Converted!';
        btn.querySelector('.tf-btn-sub').textContent = 'Click to reset';
        btn.querySelector('.tf-btn-icon').setAttribute('data-lucide', 'check');
        if (typeof lucide !== 'undefined') lucide.createIcons();

        if (projectStatus) {
          projectStatus.textContent = 'Ready';
        }

        // Show stats
        if (stats) stats.classList.add('tf-stats-visible');

        // Show bottom message
        if (bottomMsg) bottomMsg.classList.add('tf-msg-visible');

        isConverting = false;
        hasConverted = true;
      }, finishDelay);
    }

    // ─── Reset sequence ───
    function resetConversion() {
      if (isConverting) return;

      hasConverted = false;
      btn.classList.remove('tf-btn-done');
      btn.querySelector('.tf-btn-label').textContent = 'Convert to Project';
      btn.querySelector('.tf-btn-sub').textContent = 'Click to transform';
      btn.querySelector('.tf-btn-icon').setAttribute('data-lucide', 'zap');
      if (typeof lucide !== 'undefined') lucide.createIcons();

      // Hide project cards
      resultCards.forEach(function (card) {
        card.classList.add('tf-card-hidden');
        card.classList.remove('tf-card-received');
      });

      // Show empty state
      if (emptyState) emptyState.style.display = '';

      if (projectStatus) {
        projectStatus.textContent = 'Waiting\u2026';
        projectStatus.classList.remove('tf-active');
      }

      // Hide stats and message
      if (stats) stats.classList.remove('tf-stats-visible');
      if (bottomMsg) bottomMsg.classList.remove('tf-msg-visible');

      // Clear particles
      particles = [];
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    }

    // ─── Button click handler ───
    btn.addEventListener('click', function () {
      if (hasConverted) {
        resetConversion();
      } else {
        runConversion();
      }
    });

    // Re-init Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTransformDemo);
  } else {
    initTransformDemo();
  }
})();
