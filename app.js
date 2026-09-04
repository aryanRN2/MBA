// CUET PG MBA Ultra-Fast Testing Engine & Practice App
// Zero-latency in-memory state, KaTeX rendering, localStorage persistence

const STATE = {
  currentPaper: 'CUET_PG_MBA_2022.json',
  allQuestions: [],
  filteredQuestions: [],
  currentIndex: 0,
  selectedOptions: {}, // { [qNum]: optionKey }
  revealedAnswers: {}, // { [qNum]: boolean }
  flaggedQuestions: {}, // { [qNum]: boolean }
  mode: 'practice', // 'practice' | 'exam'
  selectedSection: 'ALL',
  languageView: 'both', // 'en' | 'hi' | 'both'
  timerSeconds: 7200, // 120 mins for exam mode
  timerInterval: null,
  examSubmitted: false
};

// Available papers
const PAPERS = [
  { id: 'CUET_PG_MBA_2022.json', name: 'CUET PG MBA 2022 (PGQP38 Slot 1)' },
  { id: 'CUET_PG_MBA_2023.json', name: 'CUET PG MBA 2023' },
  { id: 'CUET_PG_MBA_2024.json', name: 'CUET PG MBA 2024' },
  { id: 'CUET_PG_MBA_2025.json', name: 'CUET PG MBA 2025' },
  { id: 'CUET_PG_MBA_2026.json', name: 'CUET PG MBA 2026' },
  { id: 'CUET_PG_MBA_All_PYQs.json', name: 'All PYQs Master Collection (425 Qs)' }
];

// Sound Synthesizer via Web Audio API
const Sound = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e) {}
  },
  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch(e) {}
  }
};

// Initialize App
async function initApp() {
  loadSavedState();
  setupEventListeners();
  setupKeyboardShortcuts();
  await loadPaperData(STATE.currentPaper);
  lucide.createIcons();
}

// Load Paper JSON Data
async function loadPaperData(filename) {
  try {
    const res = await fetch(`CUET_PG_MBA_JSON/${filename}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    STATE.allQuestions = data;
    filterQuestions();
    renderCurrentQuestion();
    renderPalette();
    updateHeaderStats();
    if (STATE.mode === 'exam' && !STATE.timerInterval && !STATE.examSubmitted) {
      startTimer();
    }
  } catch (err) {
    console.error("Failed to load paper:", err);
    document.getElementById('question-body').innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #ef4444;">
        <h3>Failed to load question paper: ${filename}</h3>
        <p>Please check your connection or file location.</p>
      </div>
    `;
  }
}

// Section Filtering
function filterQuestions() {
  if (STATE.selectedSection === 'ALL') {
    STATE.filteredQuestions = [...STATE.allQuestions];
  } else {
    STATE.filteredQuestions = STATE.allQuestions.filter(q => 
      (q.section || '').toLowerCase().includes(STATE.selectedSection.toLowerCase())
    );
  }
  if (STATE.currentIndex >= STATE.filteredQuestions.length) {
    STATE.currentIndex = 0;
  }
}

// Render Current Question (Sub-50ms)
function renderCurrentQuestion() {
  const q = STATE.filteredQuestions[STATE.currentIndex];
  if (!q) return;

  const qNum = q.question_number;
  const isRevealed = STATE.revealedAnswers[qNum] || false;
  const selectedOpt = STATE.selectedOptions[qNum];
  const isFlagged = STATE.flaggedQuestions[qNum] || false;

  // Header meta
  document.getElementById('q-number').textContent = `Question ${qNum}`;
  document.getElementById('q-section').textContent = q.section || 'General';
  
  // Flag button state
  const flagBtn = document.getElementById('flag-btn');
  if (isFlagged) {
    flagBtn.classList.add('flagged');
    flagBtn.innerHTML = `<i data-lucide="bookmark-check" style="width: 14px; height: 14px;"></i> Flagged`;
  } else {
    flagBtn.classList.remove('flagged');
    flagBtn.innerHTML = `<i data-lucide="bookmark" style="width: 14px; height: 14px;"></i> Flag for Review`;
  }

  // Question Text
  const bodyEl = document.getElementById('question-body');
  let qHtml = '';

  const qEn = q.question_en || q.question || '';
  const qHi = q.question_hi || '';

  if (STATE.languageView === 'en' || !qHi) {
    qHtml += `<div class="question-text-en">${formatLatex(qEn)}</div>`;
  } else if (STATE.languageView === 'hi' && qHi) {
    qHtml += `<div class="question-text-hi" style="border-top: none; padding-top: 0;">${formatLatex(qHi)}</div>`;
  } else {
    qHtml += `<div class="question-text-en">${formatLatex(qEn)}</div>`;
    if (qHi) {
      qHtml += `<div class="question-text-hi">${formatLatex(qHi)}</div>`;
    }
  }

  // Visual Chart Preview if present
  if (q.chart_image) {
    qHtml += `
      <div class="chart-container">
        <img src="${q.chart_image}" alt="Question Chart" class="chart-image" />
        <div class="chart-caption">Data Visualization Chart (High-Resolution)</div>
      </div>
    `;
  }

  bodyEl.innerHTML = qHtml;

  // Render Options
  const optionsListEl = document.getElementById('options-list');
  optionsListEl.innerHTML = '';

  const options = q.options || {};
  const correctOpt = String(q.correct_option || '').trim();

  Object.entries(options).forEach(([key, val]) => {
    const isSelected = selectedOpt === key;
    const isCorrect = isRevealed && (key === correctOpt);
    const isIncorrect = isRevealed && isSelected && (key !== correctOpt);

    let optClass = 'option-item';
    if (isSelected) optClass += ' selected';
    if (isCorrect) optClass += ' correct-revealed';
    if (isIncorrect) optClass += ' incorrect-revealed';

    const optEl = document.createElement('div');
    optEl.className = optClass;
    optEl.setAttribute('data-key', key);
    optEl.innerHTML = `
      <div class="option-key">${key}</div>
      <div class="option-text">${formatLatex(val)}</div>
    `;
    optEl.onclick = () => handleOptionSelect(key);
    optionsListEl.appendChild(optEl);
  });

  // Render Explanation Box if revealed or exam submitted
  const expBoxEl = document.getElementById('explanation-box');
  if (isRevealed || (STATE.mode === 'exam' && STATE.examSubmitted)) {
    expBoxEl.style.display = 'flex';
    document.getElementById('explanation-text').innerHTML = formatLatex(q.explanation || `Correct option is (${q.correct_option}).`);
  } else {
    expBoxEl.style.display = 'none';
  }

  // Update navigation buttons
  document.getElementById('prev-btn').disabled = (STATE.currentIndex === 0);
  document.getElementById('next-btn').disabled = (STATE.currentIndex === STATE.filteredQuestions.length - 1);

  // Reveal Answer button text
  const revealBtn = document.getElementById('reveal-btn');
  if (STATE.mode === 'exam' && !STATE.examSubmitted) {
    revealBtn.style.display = 'none';
  } else {
    revealBtn.style.display = 'flex';
    if (isRevealed) {
      revealBtn.innerHTML = `<i data-lucide="eye-off" style="width: 16px; height: 16px;"></i> Hide Explanation`;
    } else {
      revealBtn.innerHTML = `<i data-lucide="eye" style="width: 16px; height: 16px;"></i> Reveal Answer & Explanation`;
    }
  }

  renderPaletteCurrent();
  saveState();
  lucide.createIcons();
  renderKaTeXFormulas();
}

// Option Click Handler
function handleOptionSelect(key) {
  if (STATE.mode === 'exam' && STATE.examSubmitted) return;

  const q = STATE.filteredQuestions[STATE.currentIndex];
  if (!q) return;

  Sound.playClick();
  const qNum = q.question_number;

  // Toggle selection
  if (STATE.selectedOptions[qNum] === key) {
    delete STATE.selectedOptions[qNum];
  } else {
    STATE.selectedOptions[qNum] = key;
    if (STATE.mode === 'practice') {
      // In practice mode, optionally reveal upon selection if correct
      if (String(key) === String(q.correct_option)) {
        Sound.playSuccess();
      }
    }
  }

  renderCurrentQuestion();
  renderPalette();
  updateHeaderStats();
}

// Reveal Answer Toggle Handler
function toggleRevealAnswer() {
  const q = STATE.filteredQuestions[STATE.currentIndex];
  if (!q) return;

  const qNum = q.question_number;
  STATE.revealedAnswers[qNum] = !STATE.revealedAnswers[qNum];
  Sound.playClick();
  renderCurrentQuestion();
  renderPalette();
}

// Toggle Flag Question
function toggleFlagQuestion() {
  const q = STATE.filteredQuestions[STATE.currentIndex];
  if (!q) return;

  const qNum = q.question_number;
  STATE.flaggedQuestions[qNum] = !STATE.flaggedQuestions[qNum];
  Sound.playClick();
  renderCurrentQuestion();
  renderPalette();
}

// Navigate Questions
function goToQuestion(index) {
  if (index < 0 || index >= STATE.filteredQuestions.length) return;
  STATE.currentIndex = index;
  renderCurrentQuestion();
}

function nextQuestion() {
  if (STATE.currentIndex < STATE.filteredQuestions.length - 1) {
    goToQuestion(STATE.currentIndex + 1);
  }
}

function prevQuestion() {
  if (STATE.currentIndex > 0) {
    goToQuestion(STATE.currentIndex - 1);
  }
}

// Question Palette Render
function renderPalette() {
  const gridEl = document.getElementById('palette-grid');
  gridEl.innerHTML = '';

  STATE.filteredQuestions.forEach((q, idx) => {
    const qNum = q.question_number;
    const isAnswered = !!STATE.selectedOptions[qNum];
    const isFlagged = !!STATE.flaggedQuestions[qNum];
    const isCurrent = (idx === STATE.currentIndex);

    let btnClass = 'palette-btn';
    if (isCurrent) btnClass += ' current';
    else if (isFlagged) btnClass += ' flagged';
    else if (isAnswered) btnClass += ' answered';

    const btn = document.createElement('button');
    btn.className = btnClass;
    btn.textContent = qNum;
    btn.onclick = () => goToQuestion(idx);
    gridEl.appendChild(btn);
  });
}

function renderPaletteCurrent() {
  const buttons = document.querySelectorAll('.palette-btn');
  buttons.forEach((btn, idx) => {
    const q = STATE.filteredQuestions[idx];
    if (!q) return;
    const qNum = q.question_number;
    const isAnswered = !!STATE.selectedOptions[qNum];
    const isFlagged = !!STATE.flaggedQuestions[qNum];
    const isCurrent = (idx === STATE.currentIndex);

    btn.className = 'palette-btn';
    if (isCurrent) btn.classList.add('current');
    else if (isFlagged) btn.classList.add('flagged');
    else if (isAnswered) btn.classList.add('answered');
  });
}

// Update Header Stats
function updateHeaderStats() {
  const total = STATE.allQuestions.length;
  const answered = Object.keys(STATE.selectedOptions).length;
  const flagged = Object.keys(STATE.flaggedQuestions).length;

  document.getElementById('answered-count').textContent = answered;
  document.getElementById('total-count').textContent = total;
  document.getElementById('flagged-count').textContent = flagged;
}

// Timer Logic for Exam Mode
function startTimer() {
  if (STATE.timerInterval) clearInterval(STATE.timerInterval);
  updateTimerDisplay();
  STATE.timerInterval = setInterval(() => {
    if (STATE.timerSeconds > 0) {
      STATE.timerSeconds--;
      updateTimerDisplay();
      if (STATE.timerSeconds % 10 === 0) saveState();
    } else {
      clearInterval(STATE.timerInterval);
      submitExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(STATE.timerSeconds / 60);
  const secs = STATE.timerSeconds % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  document.getElementById('timer-val').textContent = display;
}

// Submit Exam & Show Score Modal
function submitExam() {
  if (STATE.timerInterval) clearInterval(STATE.timerInterval);
  STATE.examSubmitted = true;

  let score = 0;
  let correct = 0;
  let incorrect = 0;
  let unattempted = 0;

  STATE.allQuestions.forEach(q => {
    const qNum = q.question_number;
    const userOpt = STATE.selectedOptions[qNum];
    const correctOpt = String(q.correct_option).trim();

    if (!userOpt) {
      unattempted++;
    } else if (String(userOpt).trim() === correctOpt) {
      correct++;
      score += 4; // CUET PG Marking (+4 for correct)
    } else {
      incorrect++;
      score -= 1; // CUET PG Marking (-1 for negative)
    }
  });

  const accuracy = (correct + incorrect > 0) ? Math.round((correct / (correct + incorrect)) * 100) : 0;

  document.getElementById('modal-score').textContent = `${score} / ${STATE.allQuestions.length * 4}`;
  document.getElementById('modal-accuracy').textContent = `${accuracy}%`;
  document.getElementById('modal-correct').textContent = correct;
  document.getElementById('modal-incorrect').textContent = incorrect;
  document.getElementById('modal-unattempted').textContent = unattempted;

  document.getElementById('score-modal').style.display = 'flex';
  renderCurrentQuestion();
  renderPalette();
}

function closeModal() {
  document.getElementById('score-modal').style.display = 'none';
}

// KaTeX Formatting
function formatLatex(text) {
  if (!text) return '';
  // Convert standard markdown math $$...$$ and $...$ into KaTeX-compatible spans
  let formatted = text
    .replace(/\$\$(.+?)\$\$/g, '<span class="katex-block" data-expr="$1"></span>')
    .replace(/\$(.+?)\$/g, '<span class="katex-inline" data-expr="$1"></span>');
  return formatted;
}

function renderKaTeXFormulas() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.getElementById('question-card'), {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ],
      throwOnError: false
    });
  }
}

// Keyboard Shortcuts (1-4, Arrows, R for Reveal, M for Mark)
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
      nextQuestion();
    } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
      prevQuestion();
    } else if (['1', '2', '3', '4'].includes(e.key)) {
      handleOptionSelect(e.key);
    } else if (['a', 'A'].includes(e.key)) {
      handleOptionSelect('1');
    } else if (['b', 'B'].includes(e.key)) {
      handleOptionSelect('2');
    } else if (['c', 'C'].includes(e.key)) {
      handleOptionSelect('3');
    } else if (['d', 'D'].includes(e.key)) {
      handleOptionSelect('4');
    } else if (e.key === 'r' || e.key === 'R') {
      toggleRevealAnswer();
    } else if (e.key === 'm' || e.key === 'M') {
      toggleFlagQuestion();
    }
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // Paper change
  document.getElementById('paper-select').addEventListener('change', (e) => {
    STATE.currentPaper = e.target.value;
    STATE.currentIndex = 0;
    STATE.selectedOptions = {};
    STATE.revealedAnswers = {};
    STATE.flaggedQuestions = {};
    STATE.examSubmitted = false;
    STATE.timerSeconds = 7200;
    loadPaperData(STATE.currentPaper);
  });

  // Mode change
  document.getElementById('practice-mode-btn').addEventListener('click', () => {
    STATE.mode = 'practice';
    document.getElementById('practice-mode-btn').classList.add('active');
    document.getElementById('exam-mode-btn').classList.remove('active');
    document.getElementById('timer-box').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
    if (STATE.timerInterval) clearInterval(STATE.timerInterval);
    renderCurrentQuestion();
  });

  document.getElementById('exam-mode-btn').addEventListener('click', () => {
    STATE.mode = 'exam';
    document.getElementById('exam-mode-btn').classList.add('active');
    document.getElementById('practice-mode-btn').classList.remove('active');
    document.getElementById('timer-box').style.display = 'flex';
    document.getElementById('submit-btn').style.display = 'flex';
    if (!STATE.examSubmitted) startTimer();
    renderCurrentQuestion();
  });

  // Section tabs
  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      STATE.selectedSection = tab.dataset.section;
      filterQuestions();
      renderCurrentQuestion();
      renderPalette();
    });
  });

  // Language views
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.languageView = btn.dataset.lang;
      renderCurrentQuestion();
    });
  });

  // Action buttons
  document.getElementById('prev-btn').addEventListener('click', prevQuestion);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('reveal-btn').addEventListener('click', toggleRevealAnswer);
  document.getElementById('flag-btn').addEventListener('click', toggleFlagQuestion);
  document.getElementById('submit-btn').addEventListener('click', submitExam);
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
}

// State Persistence (localStorage)
function saveState() {
  try {
    const key = `cuet_test_state_${STATE.currentPaper}`;
    const payload = {
      currentIndex: STATE.currentIndex,
      selectedOptions: STATE.selectedOptions,
      revealedAnswers: STATE.revealedAnswers,
      flaggedQuestions: STATE.flaggedQuestions,
      timerSeconds: STATE.timerSeconds,
      examSubmitted: STATE.examSubmitted,
      mode: STATE.mode
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch(e) {}
}

function loadSavedState() {
  try {
    const key = `cuet_test_state_${STATE.currentPaper}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const data = JSON.parse(raw);
      STATE.selectedOptions = data.selectedOptions || {};
      STATE.revealedAnswers = data.revealedAnswers || {};
      STATE.flaggedQuestions = data.flaggedQuestions || {};
      STATE.currentIndex = data.currentIndex || 0;
      STATE.timerSeconds = data.timerSeconds || 7200;
      STATE.examSubmitted = data.examSubmitted || false;
      STATE.mode = data.mode || 'practice';
    }
  } catch(e) {}
}

// Start app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initApp);
