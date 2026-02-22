/**
 * AI Enrichment Demo — Animated Scan + Insight Reveal
 * Sequence:
 *  1. Sources scan one-by-one (status: Queued → Scanning → Done)
 *  2. Phase progress bars fill sequentially
 *  3. Insight cards fade in staggered on the right
 *  4. Time-saved card appears last
 *  5. Replay resets everything
 */
(function () {
  'use strict';

  function initEnrichmentDemo() {
    var wrapper = document.getElementById('aiEnrichDemo');
    if (!wrapper) return;

    var scanPanel = wrapper.querySelector('.ai-scan-panel');
    var sources = wrapper.querySelectorAll('.ai-source');
    var phases = wrapper.querySelectorAll('.ai-phase');
    var insights = wrapper.querySelectorAll('.ai-insight');
    var timeSaved = document.getElementById('aiTimeSaved');
    var scanTitle = document.getElementById('aiScanTitle');
    var scanTime = document.getElementById('aiScanTime');
    var insightCount = document.getElementById('aiInsightCount');
    var replayBtn = document.getElementById('aiReplayBtn');

    var phaseFills = [
      document.getElementById('phaseMatchFill'),
      document.getElementById('phaseRecommendFill'),
      document.getElementById('phaseAssembleFill')
    ];

    var isRunning = false;
    var hasPlayed = false;
    var timers = [];

    function clearTimers() {
      timers.forEach(function (t) { clearTimeout(t); });
      timers = [];
    }

    function schedule(fn, delay) {
      var t = setTimeout(fn, delay);
      timers.push(t);
      return t;
    }

    // ─── Reset ───
    function reset() {
      clearTimers();

      // Sources
      sources.forEach(function (s) {
        s.classList.remove('ai-scanning', 'ai-scanned');
        var status = s.querySelector('.ai-source-status');
        if (status) {
          status.className = 'ai-source-status ai-status-queued';
          status.textContent = 'Queued';
        }
        var count = s.querySelector('.ai-source-count');
        if (count && count.getAttribute('data-target')) {
          count.textContent = '0 ' + (s.getAttribute('data-source') === 'resources' ? 'resources' : 'found');
        }
      });

      // Phases
      phases.forEach(function (p) {
        p.classList.remove('ai-phase-active', 'ai-phase-done');
      });
      phaseFills.forEach(function (f) {
        if (f) f.style.width = '0%';
      });

      // Insights
      insights.forEach(function (card) {
        card.classList.remove('ai-insight-visible');
        card.classList.add('ai-insight-hidden');
      });

      if (timeSaved) {
        timeSaved.classList.remove('ai-insight-visible');
        timeSaved.classList.add('ai-insight-hidden');
      }

      // Panel
      if (scanPanel) scanPanel.classList.remove('ai-done');
      if (scanTitle) scanTitle.textContent = 'Analyzing organizational data\u2026';
      if (scanTime) scanTime.textContent = '0 seconds elapsed';
      if (insightCount) insightCount.textContent = 'Waiting for analysis\u2026';
    }

    // ─── Count-up animation ───
    function countUp(el, target, suffix, duration) {
      var start = 0;
      var step = Math.ceil(target / (duration / 30));
      var interval = setInterval(function () {
        start += step;
        if (start >= target) {
          start = target;
          clearInterval(interval);
        }
        el.textContent = start + ' ' + suffix;
      }, 30);
    }

    // ─── Timer tick ───
    function startTimer() {
      var sec = 0;
      var interval = setInterval(function () {
        sec++;
        if (scanTime) scanTime.textContent = sec + ' seconds elapsed';
        if (sec >= 30 || !isRunning) {
          clearInterval(interval);
          if (scanTime) scanTime.textContent = '30 seconds total';
        }
      }, 500);
    }

    // ─── Source scan sequence ───
    var sourceLabels = [
      'Scanning historical projects\u2026',
      'Checking resource availability\u2026',
      'Analyzing budget constraints\u2026',
      'Scoring strategic alignment\u2026'
    ];

    function scanSource(index, callback) {
      if (index >= sources.length) { callback(); return; }

      var source = sources[index];
      var status = source.querySelector('.ai-source-status');
      var count = source.querySelector('.ai-source-count');

      // Start scanning
      source.classList.add('ai-scanning');
      if (status) {
        status.className = 'ai-source-status ai-status-scanning';
        status.textContent = 'Scanning';
      }
      if (scanTitle) scanTitle.textContent = sourceLabels[index] || 'Analyzing\u2026';

      // Count up numbers if applicable
      var target = count ? parseInt(count.getAttribute('data-target')) : 0;
      if (target > 0) {
        var suffix = source.getAttribute('data-source') === 'resources' ? 'resources' : 'found';
        countUp(count, target, suffix, 800);
      }

      // Complete after delay
      schedule(function () {
        source.classList.remove('ai-scanning');
        source.classList.add('ai-scanned');
        if (status) {
          status.className = 'ai-source-status ai-status-done';
          status.textContent = 'Done';
        }

        // Next source
        schedule(function () {
          scanSource(index + 1, callback);
        }, 150);
      }, 900);
    }

    // ─── Phase fill sequence ───
    function runPhases(callback) {
      var phaseData = [
        { fill: phaseFills[0], duration: 800 },
        { fill: phaseFills[1], duration: 600 },
        { fill: phaseFills[2], duration: 500 }
      ];

      var delay = 0;
      phaseData.forEach(function (p, i) {
        schedule(function () {
          phases[i].classList.add('ai-phase-active');
          if (p.fill) {
            p.fill.style.transition = 'width ' + p.duration + 'ms ease';
            p.fill.style.width = '100%';
          }
        }, delay);

        delay += p.duration + 100;

        schedule(function () {
          phases[i].classList.remove('ai-phase-active');
          phases[i].classList.add('ai-phase-done');
        }, delay);

        delay += 50;
      });

      schedule(callback, delay + 100);
    }

    // ─── Insight reveal sequence ───
    function revealInsights() {
      if (scanTitle) scanTitle.textContent = 'Analysis complete';
      if (scanPanel) scanPanel.classList.add('ai-done');
      if (insightCount) insightCount.textContent = '4 insights \u00b7 3 recommendations';

      insights.forEach(function (card, i) {
        schedule(function () {
          card.classList.remove('ai-insight-hidden');
          card.classList.add('ai-insight-visible');
        }, i * 350);
      });

      // Time saved card last
      schedule(function () {
        if (timeSaved) {
          timeSaved.classList.remove('ai-insight-hidden');
          timeSaved.classList.add('ai-insight-visible');
        }
        isRunning = false;
      }, insights.length * 350 + 400);
    }

    // ─── Main run sequence ───
    function run() {
      if (isRunning) return;
      isRunning = true;
      reset();

      // Let reset paint first
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          startTimer();

          // Phase 1: Scan sources
          scanSource(0, function () {
            // Phase 2: Run analysis phases
            schedule(function () {
              runPhases(function () {
                // Phase 3: Reveal insights
                revealInsights();
              });
            }, 300);
          });
        });
      });
    }

    // ─── Scroll trigger ───
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasPlayed) {
          hasPlayed = true;
          setTimeout(run, 500);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(wrapper);

    // ─── Replay button ───
    if (replayBtn) {
      replayBtn.addEventListener('click', function () {
        hasPlayed = true;
        run();
      });
    }

    // Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnrichmentDemo);
  } else {
    initEnrichmentDemo();
  }
})();
