// Tango Demo - Interactive Conversation Engine
(function () {
  'use strict';

  const STEPS = [
    {
      type: 'tango',
      text: "Hi! I'm Tango, your project assistant. What type of project are you creating?",
      buttons: ['Cloud Migration', 'Product Launch', 'Process Improvement'],
      confidence: 0
    },
    {
      type: 'user-button',
      field: 'field-project-type',
      confidence: 20
    },
    {
      type: 'tango',
      text: "Great choice! What's the primary objective for this project?",
      buttons: ['Cost Reduction', 'Performance Improvement', 'Compliance'],
      confidence: 20
    },
    {
      type: 'user-button',
      field: 'field-goal',
      confidence: 45
    },
    {
      type: 'tango',
      text: "What's your target timeline for completion?",
      input: true,
      placeholder: 'e.g., 6 months, Q3 2025',
      confidence: 45
    },
    {
      type: 'user-input',
      field: 'field-timeline',
      confidence: 65
    },
    {
      type: 'enrichment',
      confidence: 65
    },
    {
      type: 'tango',
      text: "Based on 3 similar projects in your org:\n\n• Team: 1 Architect, 2 Engineers, 1 PM\n• Budget range: $420K – $480K\n• Avg. duration: 9 months\n\nShall I create your demand with these recommendations?",
      buttons: ['Yes, create demand'],
      canvasUpdates: {
        'field-team': '1 Architect, 2 Engineers, 1 PM',
        'field-budget': '$420K – $480K'
      },
      confidence: 85
    },
    {
      type: 'user-button',
      confidence: 100
    },
    {
      type: 'final',
      text: "Your demand canvas is ready for review. All fields populated, team suggested, budget estimated.",
      confidence: 100
    }
  ];

  const ENRICHMENT_STEPS = [
    'Scanning organizational data...',
    'Matching 3 similar projects...',
    'Analyzing budget history...',
    'Generating recommendations...'
  ];

  let currentStep = 0;
  let isAnimating = false;

  const chatMessages = document.getElementById('chatMessages');
  const chatInputArea = document.getElementById('chatInputArea');
  const canvasFields = document.getElementById('canvasFields');
  const confidenceFill = document.getElementById('confidenceFill');
  const confidenceValue = document.getElementById('confidenceValue');
  const resetBtn = document.getElementById('resetDemo');

  if (!chatMessages) return; // Not on page

  function scrollChat() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function setConfidence(pct) {
    if (confidenceFill) confidenceFill.style.width = pct + '%';
    if (confidenceValue) confidenceValue.textContent = pct + '%';
  }

  function updateCanvasField(id, value) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('empty');
    el.classList.add('populated');
    var valEl = el.querySelector('.field-value');
    if (valEl) valEl.textContent = value;
  }

  function addMessage(type, content) {
    var msg = document.createElement('div');
    msg.className = 'message message-' + type;

    var avatar = document.createElement('div');
    avatar.className = 'message-avatar avatar-' + type;
    avatar.textContent = type === 'tango' ? 'T' : 'You';

    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = content;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    scrollChat();
  }

  function showTyping() {
    var wrap = document.createElement('div');
    wrap.className = 'message message-tango';
    wrap.id = 'typingMsg';

    var avatar = document.createElement('div');
    avatar.className = 'message-avatar avatar-tango';
    avatar.textContent = 'T';

    var indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    for (var i = 0; i < 3; i++) {
      var dot = document.createElement('div');
      dot.className = 'typing-dot';
      indicator.appendChild(dot);
    }

    wrap.appendChild(avatar);
    wrap.appendChild(indicator);
    chatMessages.appendChild(wrap);
    scrollChat();
  }

  function removeTyping() {
    var el = document.getElementById('typingMsg');
    if (el) el.remove();
  }

  function clearInput() {
    chatInputArea.innerHTML = '';
  }

  function showButtons(labels) {
    clearInput();
    labels.forEach(function (label) {
      var btn = document.createElement('button');
      btn.className = 'chat-button';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        handleButtonClick(label);
      });
      chatInputArea.appendChild(btn);
    });
  }

  function showTextInput(placeholder) {
    clearInput();
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'chat-text-input';
    input.placeholder = placeholder || 'Type your answer...';
    input.id = 'demoTextInput';

    var sendBtn = document.createElement('button');
    sendBtn.className = 'chat-send-btn';
    sendBtn.textContent = 'Send';
    sendBtn.addEventListener('click', function () {
      handleTextSubmit();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleTextSubmit();
    });

    chatInputArea.appendChild(input);
    chatInputArea.appendChild(sendBtn);
    setTimeout(function () { input.focus(); }, 100);
  }

  function handleButtonClick(label) {
    if (isAnimating) return;
    isAnimating = true;

    addMessage('user', label);
    clearInput();

    var step = STEPS[currentStep];
    if (step && step.field) {
      updateCanvasField(step.field, label);
    }
    if (step && step.confidence !== undefined) {
      setConfidence(step.confidence);
    }

    currentStep++;
    setTimeout(function () {
      isAnimating = false;
      runStep();
    }, 400);
  }

  function handleTextSubmit() {
    var input = document.getElementById('demoTextInput');
    if (!input) return;
    var val = input.value.trim();
    if (!val) return;
    if (isAnimating) return;
    isAnimating = true;

    addMessage('user', val);
    clearInput();

    var step = STEPS[currentStep];
    if (step && step.field) {
      updateCanvasField(step.field, val);
    }
    if (step && step.confidence !== undefined) {
      setConfidence(step.confidence);
    }

    currentStep++;
    setTimeout(function () {
      isAnimating = false;
      runStep();
    }, 400);
  }

  function showEnrichment() {
    clearInput();

    var wrap = document.createElement('div');
    wrap.className = 'message message-tango';
    wrap.id = 'enrichmentMsg';

    var avatar = document.createElement('div');
    avatar.className = 'message-avatar avatar-tango';
    avatar.textContent = 'T';

    var overlay = document.createElement('div');
    overlay.className = 'enrichment-overlay';

    var title = document.createElement('div');
    title.className = 'enrichment-title';
    var spinner = document.createElement('div');
    spinner.className = 'enrichment-spinner';
    spinner.id = 'enrichSpinner';
    title.appendChild(spinner);
    title.appendChild(document.createTextNode(' AI Enrichment'));
    overlay.appendChild(title);

    var stepsContainer = document.createElement('div');
    stepsContainer.id = 'enrichSteps';
    overlay.appendChild(stepsContainer);

    wrap.appendChild(avatar);
    wrap.appendChild(overlay);
    chatMessages.appendChild(wrap);
    scrollChat();

    // Animate steps one by one
    var i = 0;
    function nextEnrichStep() {
      if (i >= ENRICHMENT_STEPS.length) {
        // Done — remove spinner, proceed
        var sp = document.getElementById('enrichSpinner');
        if (sp) sp.style.display = 'none';
        setTimeout(function () {
          currentStep++;
          runStep();
        }, 500);
        return;
      }

      var item = document.createElement('div');
      item.className = 'enrichment-step-item';
      item.innerHTML = '<span class="step-check">&#10003;</span> ' + ENRICHMENT_STEPS[i];
      item.style.animation = 'msgFadeIn 0.3s ease';
      stepsContainer.appendChild(item);
      scrollChat();
      i++;
      setTimeout(nextEnrichStep, 700);
    }

    setTimeout(nextEnrichStep, 600);
  }

  function runStep() {
    if (currentStep >= STEPS.length) return;

    var step = STEPS[currentStep];

    if (step.confidence !== undefined) {
      setConfidence(step.confidence);
    }

    if (step.canvasUpdates) {
      Object.keys(step.canvasUpdates).forEach(function (id) {
        updateCanvasField(id, step.canvasUpdates[id]);
      });
    }

    if (step.type === 'tango') {
      isAnimating = true;
      showTyping();
      setTimeout(function () {
        removeTyping();
        addMessage('tango', step.text);

        if (step.buttons) {
          showButtons(step.buttons);
        } else if (step.input) {
          showTextInput(step.placeholder);
        }

        currentStep++;
        isAnimating = false;
      }, 800);

    } else if (step.type === 'user-button' || step.type === 'user-input') {
      // Wait for user interaction — buttons/input already shown
    } else if (step.type === 'enrichment') {
      isAnimating = true;
      showEnrichment();
    } else if (step.type === 'final') {
      isAnimating = true;
      showTyping();
      setTimeout(function () {
        removeTyping();
        addMessage('tango', step.text);
        clearInput();

        // Show completion state
        var done = document.createElement('div');
        done.className = 'chat-button';
        done.textContent = 'Demand Created';
        done.style.background = '#FFA426';
        done.style.color = '#ffffff';
        done.style.cursor = 'default';
        done.style.borderColor = '#FFA426';
        chatInputArea.appendChild(done);

        isAnimating = false;
      }, 800);
    }
  }

  function resetDemo() {
    currentStep = 0;
    isAnimating = false;
    chatMessages.innerHTML = '';
    clearInput();
    setConfidence(0);

    // Reset canvas fields
    var fields = canvasFields.querySelectorAll('.field-group');
    fields.forEach(function (f) {
      f.classList.remove('populated');
      f.classList.add('empty');
      var v = f.querySelector('.field-value');
      if (v) v.innerHTML = '&mdash;';
    });

    runStep();
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetDemo);
  }

  // Start the conversation
  runStep();

})();
