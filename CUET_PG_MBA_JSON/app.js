/**
 * CUET PG MBA (COQP12) — Interactive Master Prep & CBT Platform Logic
 * Author: Antigravity AI
 */

(() => {
  'use strict';

  // State Management
  const state = {
    currentPaperFile: 'CUET_PG_MBA_2024.json',
    allQuestions: [],
    filteredQuestions: [],
    currentIndex: 0,
    currentSectionFilter: 'all',
    currentStatusFilter: 'all',
    searchQuery: '',
    
    // User progress stored per question ID: { [question_id]: { selectedOption, isCorrect, timestamp } }
    userAnswers: {},
    bookmarks: new Set(),
    
    // CBT Mock Exam State
    mockExam: {
      active: false,
      paperFile: 'CUET_PG_MBA_2024.json',
      questions: [],
      currentIndex: 0,
      currentSection: 'all',
      durationMinutes: 105,
      secondsRemaining: 105 * 60,
      timerInterval: null,
      startTime: null,
      // Status per question: 'not_visited' | 'not_answered' | 'answered' | 'marked' | 'ans_marked'
      questionStatuses: {},
      selectedAnswers: {}, // { [question_id]: selectedOptionKey }
      completed: false
    },

    // Flashcard State
    flashcardIndex: 0,
    flashcardQuestions: [],
    isCardFlipped: false,

    // App Preferences
    soundEnabled: true,
    theme: 'dark'
  };

  // Audio Synth for Sound Effects (Web Audio API)
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'incorrect') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      console.warn('Audio effect error:', e);
    }
  }

  // LocalStorage Helpers
  const STORAGE_KEYS = {
    ANSWERS: 'cuet_pg_mba_answers',
    BOOKMARKS: 'cuet_pg_mba_bookmarks',
    THEME: 'cuet_pg_mba_theme',
    SOUND: 'cuet_pg_mba_sound',
    MOCK_HISTORY: 'cuet_pg_mba_mock_history'
  };

  function loadPersistedData() {
    try {
      const answers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
      if (answers) state.userAnswers = JSON.parse(answers);

      const bookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (bookmarks) state.bookmarks = new Set(JSON.parse(bookmarks));

      const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
      setTheme(theme);

      const sound = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (sound !== null) state.soundEnabled = sound === 'true';
      updateSoundIcon();
    } catch (e) {
      console.error('Error loading localStorage:', e);
    }
  }

  function savePersistedData() {
    try {
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(state.userAnswers));
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([...state.bookmarks]));
    } catch (e) {
      console.error('Error saving localStorage:', e);
    }
  }

  // DOM Elements
  const el = {
    // Navigation Modes
    btnModePractice: document.getElementById('btnModePractice'),
    btnModeMock: document.getElementById('btnModeMock'),
    btnModeFlashcards: document.getElementById('btnModeFlashcards'),
    btnModeAnalytics: document.getElementById('btnModeAnalytics'),
    viewPractice: document.getElementById('viewPractice'),
    viewMock: document.getElementById('viewMock'),
    viewFlashcards: document.getElementById('viewFlashcards'),
    viewAnalytics: document.getElementById('viewAnalytics'),

    // Utility actions
    btnThemeToggle: document.getElementById('btnThemeToggle'),
    themeIconDark: document.getElementById('themeIconDark'),
    themeIconLight: document.getElementById('themeIconLight'),
    btnSoundToggle: document.getElementById('btnSoundToggle'),
    soundIconOn: document.getElementById('soundIconOn'),
    soundIconOff: document.getElementById('soundIconOff'),
    btnKeyboardShortcuts: document.getElementById('btnKeyboardShortcuts'),
    shortcutsModal: document.getElementById('shortcutsModal'),
    btnCloseShortcuts: document.getElementById('btnCloseShortcuts'),

    // Practice controls
    paperSelect: document.getElementById('paperSelect'),
    sectionSelect: document.getElementById('sectionSelect'),
    statusFilter: document.getElementById('statusFilter'),
    searchInput: document.getElementById('searchInput'),
    btnClearSearch: document.getElementById('btnClearSearch'),
    practiceSolvedCount: document.getElementById('practiceSolvedCount'),
    practiceTotalCount: document.getElementById('practiceTotalCount'),
    practiceAccuracyBadge: document.getElementById('practiceAccuracyBadge'),

    // Question arena
    qYearBadge: document.getElementById('qYearBadge'),
    qSectionBadge: document.getElementById('qSectionBadge'),
    btnBookmark: document.getElementById('btnBookmark'),
    btnResetCurrent: document.getElementById('btnResetCurrent'),
    qDisplayNum: document.getElementById('qDisplayNum'),
    qDisplayId: document.getElementById('qDisplayId'),
    qText: document.getElementById('qText'),
    optionsContainer: document.getElementById('optionsContainer'),

    // Solution
    solutionPanel: document.getElementById('solutionPanel'),
    solutionCorrectOpt: document.getElementById('solutionCorrectOpt'),
    solutionCorrectAns: document.getElementById('solutionCorrectAns'),
    solutionExplanation: document.getElementById('solutionExplanation'),
    btnToggleExplanation: document.getElementById('btnToggleExplanation'),

    // Navigation & Palette
    btnPrevQ: document.getElementById('btnPrevQ'),
    btnNextQ: document.getElementById('btnNextQ'),
    paletteCount: document.getElementById('paletteCount'),
    paletteGrid: document.getElementById('paletteGrid'),

    // Mock Exam Setup
    mockSetupScreen: document.getElementById('mockSetupScreen'),
    mockActiveScreen: document.getElementById('mockActiveScreen'),
    mockResultScreen: document.getElementById('mockResultScreen'),
    mockPaperSelect: document.getElementById('mockPaperSelect'),
    mockTimerSelect: document.getElementById('mockTimerSelect'),
    btnStartMockExam: document.getElementById('btnStartMockExam'),

    // Mock Active Exam
    mockExamTitle: document.getElementById('mockExamTitle'),
    mockTimerDisplay: document.getElementById('mockTimerDisplay'),
    btnOpenSubmitModal: document.getElementById('btnOpenSubmitModal'),
    mockSectionBar: document.getElementById('mockSectionBar'),
    mockQNum: document.getElementById('mockQNum'),
    mockQText: document.getElementById('mockQText'),
    mockOptionsContainer: document.getElementById('mockOptionsContainer'),
    btnMockSaveNext: document.getElementById('btnMockSaveNext'),
    btnMockClear: document.getElementById('btnMockClear'),
    btnMockMarkNext: document.getElementById('btnMockMarkNext'),
    btnMockPrev: document.getElementById('btnMockPrev'),
    btnMockNext: document.getElementById('btnMockNext'),
    mockGrid: document.getElementById('mockGrid'),
    summaryAnswered: document.getElementById('summaryAnswered'),
    summaryNotAnswered: document.getElementById('summaryNotAnswered'),
    summaryNotVisited: document.getElementById('summaryNotVisited'),
    summaryMarked: document.getElementById('summaryMarked'),
    summaryAnsMarked: document.getElementById('summaryAnsMarked'),

    // Mock Submit Modal
    submitModal: document.getElementById('submitModal'),
    btnCloseSubmitModal: document.getElementById('btnCloseSubmitModal'),
    btnCancelSubmit: document.getElementById('btnCancelSubmit'),
    btnConfirmSubmit: document.getElementById('btnConfirmSubmit'),
    modalTotalQ: document.getElementById('modalTotalQ'),
    modalAnsweredQ: document.getElementById('modalAnsweredQ'),
    modalMarkedQ: document.getElementById('modalMarkedQ'),
    modalNotAnsweredQ: document.getElementById('modalNotAnsweredQ'),

    // Mock Result
    resultTotalScore: document.getElementById('resultTotalScore'),
    resultMaxScore: document.getElementById('resultMaxScore'),
    resultFeedback: document.getElementById('resultFeedback'),
    resultAccuracy: document.getElementById('resultAccuracy'),
    resultAttempted: document.getElementById('resultAttempted'),
    resultTimeTaken: document.getElementById('resultTimeTaken'),
    resultCorrectCount: document.getElementById('resultCorrectCount'),
    resultPositiveMarks: document.getElementById('resultPositiveMarks'),
    resultIncorrectCount: document.getElementById('resultIncorrectCount'),
    resultNegativeMarks: document.getElementById('resultNegativeMarks'),
    resultUnattemptedCount: document.getElementById('resultUnattemptedCount'),
    resultSectionTableBody: document.getElementById('resultSectionTableBody'),
    btnRetakeMock: document.getElementById('btnRetakeMock'),
    btnReviewMockSolutions: document.getElementById('btnReviewMockSolutions'),

    // Flashcards
    flashcardPaperSelect: document.getElementById('flashcardPaperSelect'),
    flashcardCurrentIndex: document.getElementById('flashcardCurrentIndex'),
    flashcardTotalCount: document.getElementById('flashcardTotalCount'),
    flashcardElement: document.getElementById('flashcardElement'),
    fcFrontText: document.getElementById('fcFrontText'),
    fcBackAnswer: document.getElementById('fcBackAnswer'),
    fcBackExplanation: document.getElementById('fcBackExplanation'),
    btnFcPrev: document.getElementById('btnFcPrev'),
    btnFcFlip: document.getElementById('btnFcFlip'),
    btnFcNext: document.getElementById('btnFcNext'),

    // Analytics
    anaTotalAttempted: document.getElementById('anaTotalAttempted'),
    anaAccuracy: document.getElementById('anaAccuracy'),
    anaBookmarksCount: document.getElementById('anaBookmarksCount'),
    anaMocksCount: document.getElementById('anaMocksCount'),
    anaMasteryBars: document.getElementById('anaMasteryBars'),
    btnResetAllProgress: document.getElementById('btnResetAllProgress')
  };

  // =========================================================================
  // THEME & SOUND TOGGLES
  // =========================================================================
  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      el.themeIconDark.classList.remove('hidden');
      el.themeIconLight.classList.add('hidden');
    } else {
      el.themeIconDark.classList.add('hidden');
      el.themeIconLight.classList.remove('hidden');
    }
  }

  function updateSoundIcon() {
    if (state.soundEnabled) {
      el.soundIconOn.classList.remove('hidden');
      el.soundIconOff.classList.add('hidden');
    } else {
      el.soundIconOn.classList.add('hidden');
      el.soundIconOff.classList.remove('hidden');
    }
  }

  // =========================================================================
  // VIEW SWITCHING
  // =========================================================================
  function switchMode(mode) {
    [el.btnModePractice, el.btnModeMock, el.btnModeFlashcards, el.btnModeAnalytics].forEach(btn => {
      btn.classList.remove('active');
    });
    [el.viewPractice, el.viewMock, el.viewFlashcards, el.viewAnalytics].forEach(view => {
      view.classList.remove('active');
    });

    if (mode === 'practice') {
      el.btnModePractice.classList.add('active');
      el.viewPractice.classList.add('active');
    } else if (mode === 'mock') {
      el.btnModeMock.classList.add('active');
      el.viewMock.classList.add('active');
    } else if (mode === 'flashcards') {
      el.btnModeFlashcards.classList.add('active');
      el.viewFlashcards.classList.add('active');
      loadFlashcards(el.flashcardPaperSelect.value);
    } else if (mode === 'analytics') {
      el.btnModeAnalytics.classList.add('active');
      el.viewAnalytics.classList.add('active');
      renderAnalytics();
    }
    playSound('click');
  }

  // =========================================================================
  // DATA FETCHING & FILTERING (PRACTICE MODE)
  // =========================================================================
  async function loadPaper(filename) {
    try {
      state.currentPaperFile = filename;
      const res = await fetch(filename);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      state.allQuestions = await res.json();

      // Extract unique sections
      const sections = ['all', ...new Set(state.allQuestions.map(q => q.section || 'General'))];
      el.sectionSelect.innerHTML = sections.map(sec => 
        `<option value="${escapeHtml(sec)}">${sec === 'all' ? 'All Sections (Full Paper)' : escapeHtml(sec)}</option>`
      ).join('');

      applyFilters();
    } catch (err) {
      console.error('Failed to load paper:', err);
      el.qText.innerHTML = `<div class="text-danger">Failed to load questions from ${filename}. Please verify the file is available.</div>`;
    }
  }

  function applyFilters() {
    let list = [...state.allQuestions];

    // Section Filter
    if (state.currentSectionFilter !== 'all') {
      list = list.filter(q => (q.section || 'General') === state.currentSectionFilter);
    }

    // Status Filter
    if (state.currentStatusFilter === 'unattempted') {
      list = list.filter(q => !state.userAnswers[q.question_id]);
    } else if (state.currentStatusFilter === 'correct') {
      list = list.filter(q => state.userAnswers[q.question_id]?.isCorrect === true);
    } else if (state.currentStatusFilter === 'incorrect') {
      list = list.filter(q => state.userAnswers[q.question_id] && !state.userAnswers[q.question_id]?.isCorrect);
    } else if (state.currentStatusFilter === 'bookmarked') {
      list = list.filter(q => state.bookmarks.has(String(q.question_id)));
    }

    // Search Query Filter
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase().trim();
      list = list.filter(q => {
        const inQ = (q.question || '').toLowerCase().includes(query);
        const inExp = (q.explanation || '').toLowerCase().includes(query);
        const inOpt = Object.values(q.options || {}).some(opt => (opt || '').toLowerCase().includes(query));
        return inQ || inExp || inOpt;
      });
    }

    state.filteredQuestions = list;
    state.currentIndex = 0;
    renderPracticeView();
    updatePracticeStats();
  }

  function updatePracticeStats() {
    const total = state.allQuestions.length;
    const answeredIds = state.allQuestions.filter(q => state.userAnswers[q.question_id]);
    const correctCount = answeredIds.filter(q => state.userAnswers[q.question_id]?.isCorrect).length;
    const accuracy = answeredIds.length > 0 ? Math.round((correctCount / answeredIds.length) * 100) : 0;

    el.practiceSolvedCount.textContent = answeredIds.length;
    el.practiceTotalCount.textContent = total;
    el.practiceAccuracyBadge.textContent = `${accuracy}% Acc`;
  }

  // =========================================================================
  // PRACTICE VIEW RENDERING
  // =========================================================================
  function renderPracticeView() {
    if (state.filteredQuestions.length === 0) {
      el.qText.innerHTML = `<em>No questions match the current filters or search query.</em>`;
      el.optionsContainer.innerHTML = '';
      el.solutionPanel.classList.add('hidden');
      el.qDisplayNum.textContent = '0';
      el.qDisplayId.textContent = '--';
      el.btnPrevQ.disabled = true;
      el.btnNextQ.disabled = true;
      el.paletteCount.textContent = '0 / 0';
      el.paletteGrid.innerHTML = '';
      return;
    }

    const q = state.filteredQuestions[state.currentIndex];
    const qId = String(q.question_id);
    const userAnswer = state.userAnswers[qId];

    // Meta Badges
    el.qYearBadge.textContent = q.year || 'CUET PG';
    el.qSectionBadge.textContent = q.section || 'General';
    el.qDisplayNum.textContent = `${state.currentIndex + 1} / ${state.filteredQuestions.length}`;
    el.qDisplayId.textContent = qId;

    // Bookmark State
    if (state.bookmarks.has(qId)) {
      el.btnBookmark.classList.add('bookmarked');
    } else {
      el.btnBookmark.classList.remove('bookmarked');
    }

    // Question Text
    el.qText.textContent = q.question;

    // Options Rendering
    el.optionsContainer.innerHTML = '';
    const optionsObj = q.options || {};
    const correctOptionKey = String(q.correct_option || '').trim();

    Object.keys(optionsObj).sort().forEach(optKey => {
      const optVal = optionsObj[optKey];
      const optCard = document.createElement('div');
      optCard.className = 'option-card';
      optCard.dataset.optionKey = optKey;

      const isUserChoice = userAnswer && String(userAnswer.selectedOption) === String(optKey);
      const isCorrectOption = String(optKey) === correctOptionKey;

      if (userAnswer) {
        if (isUserChoice) {
          if (userAnswer.isCorrect) {
            optCard.classList.add('selected-correct');
          } else {
            optCard.classList.add('selected-incorrect');
          }
        } else if (isCorrectOption) {
          optCard.classList.add('highlight-correct');
        }
      }

      optCard.innerHTML = `
        <div class="opt-prefix">${optKey}</div>
        <div class="opt-text">${escapeHtml(optVal)}</div>
        <div class="opt-badge-state">${isCorrectOption ? '✓' : '✗'}</div>
      `;

      optCard.addEventListener('click', () => {
        handleOptionSelect(q, optKey);
      });

      el.optionsContainer.appendChild(optCard);
    });

    // Solution Panel
    el.solutionCorrectOpt.textContent = `Option ${q.correct_option}`;
    el.solutionCorrectAns.textContent = q.correct_answer || (q.options ? q.options[q.correct_option] : '--');
    el.solutionExplanation.textContent = q.explanation || 'No explanation provided.';

    if (userAnswer) {
      el.solutionPanel.classList.remove('hidden');
    } else {
      el.solutionPanel.classList.add('hidden');
    }

    // Navigation Buttons State
    el.btnPrevQ.disabled = state.currentIndex === 0;
    el.btnNextQ.disabled = state.currentIndex === state.filteredQuestions.length - 1;

    // Palette Render
    renderPaletteGrid();
  }

  function handleOptionSelect(q, optKey) {
    const qId = String(q.question_id);
    const correctKey = String(q.correct_option).trim();
    const isCorrect = String(optKey).trim() === correctKey;

    state.userAnswers[qId] = {
      selectedOption: optKey,
      isCorrect: isCorrect,
      timestamp: Date.now()
    };

    savePersistedData();
    playSound(isCorrect ? 'correct' : 'incorrect');
    renderPracticeView();
    updatePracticeStats();
  }

  function renderPaletteGrid() {
    el.paletteCount.textContent = `${state.currentIndex + 1} of ${state.filteredQuestions.length}`;
    el.paletteGrid.innerHTML = '';

    state.filteredQuestions.forEach((q, idx) => {
      const qId = String(q.question_id);
      const ans = state.userAnswers[qId];
      const btn = document.createElement('button');
      btn.className = 'grid-q-btn';
      btn.textContent = idx + 1;

      if (idx === state.currentIndex) btn.classList.add('active');
      if (ans) {
        if (ans.isCorrect) btn.classList.add('correct');
        else btn.classList.add('incorrect');
      }
      if (state.bookmarks.has(qId)) btn.classList.add('bookmarked');

      btn.addEventListener('click', () => {
        state.currentIndex = idx;
        renderPracticeView();
        playSound('click');
      });

      el.paletteGrid.appendChild(btn);
    });
  }

  // =========================================================================
  // CBT MOCK EXAM MODE LOGIC
  // =========================================================================
  async function startMockExam() {
    const paperFile = el.mockPaperSelect.value;
    const duration = parseInt(el.mockTimerSelect.value, 10);

    try {
      const res = await fetch(paperFile);
      if (!res.ok) throw new Error('Failed to load paper');
      const data = await res.json();

      state.mockExam.active = true;
      state.mockExam.paperFile = paperFile;
      state.mockExam.questions = data;
      state.mockExam.currentIndex = 0;
      state.mockExam.currentSection = 'all';
      state.mockExam.durationMinutes = duration;
      state.mockExam.secondsRemaining = duration * 60;
      state.mockExam.selectedAnswers = {};
      state.mockExam.questionStatuses = {};
      state.mockExam.completed = false;
      state.mockExam.startTime = Date.now();

      // Initialize all to not_visited except question 0 (not_answered upon visit)
      data.forEach((q, i) => {
        state.mockExam.questionStatuses[q.question_id] = i === 0 ? 'not_answered' : 'not_visited';
      });

      // Switch views
      el.mockSetupScreen.classList.add('hidden');
      el.mockResultScreen.classList.add('hidden');
      el.mockActiveScreen.classList.remove('hidden');

      el.mockExamTitle.textContent = `${el.mockPaperSelect.options[el.mockPaperSelect.selectedIndex].text}`;

      // Build section tabs
      const sections = ['all', ...new Set(data.map(q => q.section || 'General'))];
      el.mockSectionBar.innerHTML = sections.map(sec => 
        `<button class="cbt-sec-tab ${sec === 'all' ? 'active' : ''}" data-sec="${escapeHtml(sec)}">${sec === 'all' ? 'All Sections' : escapeHtml(sec)}</button>`
      ).join('');

      el.mockSectionBar.querySelectorAll('.cbt-sec-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          el.mockSectionBar.querySelectorAll('.cbt-sec-tab').forEach(t => t.classList.remove('active'));
          e.currentTarget.classList.add('active');
          const sec = e.currentTarget.dataset.sec;
          state.mockExam.currentSection = sec;
          // find first question matching this section
          if (sec !== 'all') {
            const matchIdx = state.mockExam.questions.findIndex(q => (q.section || 'General') === sec);
            if (matchIdx !== -1) {
              navigateToMockQuestion(matchIdx);
            }
          }
        });
      });

      // Start timer
      if (state.mockExam.timerInterval) clearInterval(state.mockExam.timerInterval);
      if (duration > 0) {
        state.mockExam.timerInterval = setInterval(updateMockTimer, 1000);
        updateMockTimerDisplay();
      } else {
        el.mockTimerDisplay.textContent = 'UNLIMITED';
      }

      renderMockQuestion();
      playSound('click');
    } catch (e) {
      alert('Failed to launch CBT Mock exam: ' + e.message);
    }
  }

  function updateMockTimer() {
    if (state.mockExam.secondsRemaining > 0) {
      state.mockExam.secondsRemaining--;
      updateMockTimerDisplay();

      if (state.mockExam.secondsRemaining === 300) {
        alert('⚠️ 5 Minutes Remaining in Exam!');
      }
    } else {
      clearInterval(state.mockExam.timerInterval);
      alert('⏳ Time is up! Submitting exam automatically.');
      submitMockExam();
    }
  }

  function updateMockTimerDisplay() {
    const totalSec = state.mockExam.secondsRemaining;
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    el.mockTimerDisplay.textContent = `${hrs}:${mins}:${secs}`;

    if (totalSec <= 300) {
      el.mockTimerDisplay.classList.add('timer-warning');
    } else {
      el.mockTimerDisplay.classList.remove('timer-warning');
    }
  }

  function renderMockQuestion() {
    const questions = state.mockExam.questions;
    const idx = state.mockExam.currentIndex;
    const q = questions[idx];
    const qId = q.question_id;

    el.mockQNum.textContent = idx + 1;
    el.mockQText.textContent = q.question;

    const currentSelected = state.mockExam.selectedAnswers[qId];

    // Render Options with Radios
    el.mockOptionsContainer.innerHTML = '';
    const optionsObj = q.options || {};
    Object.keys(optionsObj).sort().forEach(optKey => {
      const optVal = optionsObj[optKey];
      const item = document.createElement('label');
      item.className = 'cbt-option-item';
      if (currentSelected === optKey) item.classList.add('selected');

      item.innerHTML = `
        <input type="radio" name="mockOptRadio" value="${optKey}" ${currentSelected === optKey ? 'checked' : ''}>
        <span class="opt-prefix">${optKey}</span>
        <span class="opt-text">${escapeHtml(optVal)}</span>
      `;

      item.addEventListener('click', () => {
        el.mockOptionsContainer.querySelectorAll('.cbt-option-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        const radio = item.querySelector('input');
        if (radio) radio.checked = true;
        state.mockExam.selectedAnswers[qId] = optKey;
      });

      el.mockOptionsContainer.appendChild(item);
    });

    renderMockPalette();
  }

  function navigateToMockQuestion(index) {
    if (index < 0 || index >= state.mockExam.questions.length) return;
    state.mockExam.currentIndex = index;
    const q = state.mockExam.questions[index];
    const qId = q.question_id;

    // If never visited, now visited & not answered (unless already answered/marked)
    if (state.mockExam.questionStatuses[qId] === 'not_visited') {
      state.mockExam.questionStatuses[qId] = 'not_answered';
    }

    renderMockQuestion();
  }

  function renderMockPalette() {
    const questions = state.mockExam.questions;
    const statuses = state.mockExam.questionStatuses;
    const answers = state.mockExam.selectedAnswers;

    let countAns = 0, countNotAns = 0, countNotVisited = 0, countMarked = 0, countAnsMarked = 0;

    el.mockGrid.innerHTML = '';

    questions.forEach((q, idx) => {
      const qId = q.question_id;
      const status = statuses[qId] || 'not_visited';

      if (status === 'answered') countAns++;
      else if (status === 'not_answered') countNotAns++;
      else if (status === 'not_visited') countNotVisited++;
      else if (status === 'marked') countMarked++;
      else if (status === 'ans_marked') countAnsMarked++;

      const box = document.createElement('button');
      box.className = `cbt-q-box cbt-${status.replace('_', '-')}`;
      if (idx === state.mockExam.currentIndex) box.classList.add('active');
      box.textContent = idx + 1;

      box.addEventListener('click', () => {
        navigateToMockQuestion(idx);
        playSound('click');
      });

      el.mockGrid.appendChild(box);
    });

    el.summaryAnswered.textContent = countAns;
    el.summaryNotAnswered.textContent = countNotAns;
    el.summaryNotVisited.textContent = countNotVisited;
    el.summaryMarked.textContent = countMarked;
    el.summaryAnsMarked.textContent = countAnsMarked;
  }

  // Mock Exam Action Handlers
  function handleMockSaveNext() {
    const q = state.mockExam.questions[state.mockExam.currentIndex];
    const qId = q.question_id;
    const selected = state.mockExam.selectedAnswers[qId];

    if (selected) {
      state.mockExam.questionStatuses[qId] = 'answered';
    } else {
      state.mockExam.questionStatuses[qId] = 'not_answered';
    }

    if (state.mockExam.currentIndex < state.mockExam.questions.length - 1) {
      navigateToMockQuestion(state.mockExam.currentIndex + 1);
    } else {
      renderMockQuestion();
    }
  }

  function handleMockClear() {
    const q = state.mockExam.questions[state.mockExam.currentIndex];
    const qId = q.question_id;
    delete state.mockExam.selectedAnswers[qId];
    state.mockExam.questionStatuses[qId] = 'not_answered';
    renderMockQuestion();
  }

  function handleMockMarkNext() {
    const q = state.mockExam.questions[state.mockExam.currentIndex];
    const qId = q.question_id;
    const selected = state.mockExam.selectedAnswers[qId];

    if (selected) {
      state.mockExam.questionStatuses[qId] = 'ans_marked';
    } else {
      state.mockExam.questionStatuses[qId] = 'marked';
    }

    if (state.mockExam.currentIndex < state.mockExam.questions.length - 1) {
      navigateToMockQuestion(state.mockExam.currentIndex + 1);
    } else {
      renderMockQuestion();
    }
  }

  function openSubmitConfirmationModal() {
    const statuses = state.mockExam.questionStatuses;
    let ans = 0, marked = 0, notAns = 0;
    Object.values(statuses).forEach(st => {
      if (st === 'answered' || st === 'ans_marked') ans++;
      else if (st === 'marked') marked++;
      else notAns++;
    });

    el.modalTotalQ.textContent = state.mockExam.questions.length;
    el.modalAnsweredQ.textContent = ans;
    el.modalMarkedQ.textContent = marked;
    el.modalNotAnsweredQ.textContent = notAns;

    el.submitModal.classList.remove('hidden');
  }

  function submitMockExam() {
    if (state.mockExam.timerInterval) clearInterval(state.mockExam.timerInterval);
    el.submitModal.classList.add('hidden');
    el.mockActiveScreen.classList.add('hidden');
    el.mockResultScreen.classList.remove('hidden');

    const questions = state.mockExam.questions;
    const answers = state.mockExam.selectedAnswers;

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let sectionStats = {};

    questions.forEach(q => {
      const qId = q.question_id;
      const sec = q.section || 'General';
      if (!sectionStats[sec]) {
        sectionStats[sec] = { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 };
      }
      sectionStats[sec].total++;

      const selected = answers[qId];
      const correctOpt = String(q.correct_option).trim();

      if (selected !== undefined) {
        sectionStats[sec].attempted++;
        if (String(selected).trim() === correctOpt) {
          correctCount++;
          sectionStats[sec].correct++;
          sectionStats[sec].score += 4;
        } else {
          incorrectCount++;
          sectionStats[sec].incorrect++;
          sectionStats[sec].score -= 1;
        }
      } else {
        unattemptedCount++;
      }
    });

    const totalScore = (correctCount * 4) - (incorrectCount * 1);
    const maxScore = questions.length * 4;
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const timeTakenMinutes = Math.round((Date.now() - state.mockExam.startTime) / 60000);

    // Save mock test result to localStorage history
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOCK_HISTORY) || '[]');
      history.push({
        paper: state.mockExam.paperFile,
        score: totalScore,
        maxScore: maxScore,
        accuracy: accuracy,
        date: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.MOCK_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Error saving mock history:', e);
    }

    // Populate Results Screen
    el.resultTotalScore.textContent = totalScore;
    el.resultMaxScore.textContent = maxScore;
    el.resultAccuracy.textContent = `${accuracy}%`;
    el.resultAttempted.textContent = `${attemptedCount} / ${questions.length}`;
    el.resultTimeTaken.textContent = `${timeTakenMinutes} mins`;

    el.resultCorrectCount.textContent = correctCount;
    el.resultPositiveMarks.textContent = correctCount * 4;
    el.resultIncorrectCount.textContent = incorrectCount;
    el.resultNegativeMarks.textContent = incorrectCount * 1;
    el.resultUnattemptedCount.textContent = unattemptedCount;

    // Section table
    el.resultSectionTableBody.innerHTML = Object.keys(sectionStats).map(sec => {
      const st = sectionStats[sec];
      const secAcc = st.attempted > 0 ? Math.round((st.correct / st.attempted) * 100) : 0;
      return `
        <tr>
          <td><strong>${escapeHtml(sec)}</strong></td>
          <td>${st.total}</td>
          <td>${st.attempted}</td>
          <td class="text-success font-bold">${st.correct}</td>
          <td class="text-danger font-bold">${st.incorrect}</td>
          <td><strong>${st.score}</strong></td>
          <td>${secAcc}%</td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // FLASHCARDS / RAPID REVISION MODE
  // =========================================================================
  async function loadFlashcards(filename) {
    try {
      const res = await fetch(filename);
      if (!res.ok) throw new Error('Failed to load flashcard paper');
      state.flashcardQuestions = await res.json();
      state.flashcardIndex = 0;
      state.isCardFlipped = false;
      renderFlashcard();
    } catch (e) {
      console.error(e);
    }
  }

  function renderFlashcard() {
    if (state.flashcardQuestions.length === 0) return;
    const q = state.flashcardQuestions[state.flashcardIndex];
    state.isCardFlipped = false;
    el.flashcardElement.classList.remove('flipped');

    el.flashcardCurrentIndex.textContent = state.flashcardIndex + 1;
    el.flashcardTotalCount.textContent = state.flashcardQuestions.length;

    el.fcFrontText.textContent = q.question;
    el.fcBackAnswer.textContent = `Correct Answer: ${q.correct_answer || 'Option ' + q.correct_option}`;
    el.fcBackExplanation.textContent = q.explanation || 'No detailed explanation provided.';

    el.btnFcPrev.disabled = state.flashcardIndex === 0;
    el.btnFcNext.disabled = state.flashcardIndex === state.flashcardQuestions.length - 1;
  }

  function flipFlashcard() {
    state.isCardFlipped = !state.isCardFlipped;
    if (state.isCardFlipped) {
      el.flashcardElement.classList.add('flipped');
    } else {
      el.flashcardElement.classList.remove('flipped');
    }
    playSound('click');
  }

  // =========================================================================
  // ANALYTICS & INSIGHTS VIEW
  // =========================================================================
  function renderAnalytics() {
    const answeredKeys = Object.keys(state.userAnswers);
    const totalAttempted = answeredKeys.length;
    const correctCount = answeredKeys.filter(k => state.userAnswers[k].isCorrect).length;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

    let mockHistory = [];
    try {
      mockHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOCK_HISTORY) || '[]');
    } catch (e) {}

    el.anaTotalAttempted.textContent = totalAttempted;
    el.anaAccuracy.textContent = `${accuracy}%`;
    el.anaBookmarksCount.textContent = state.bookmarks.size;
    el.anaMocksCount.textContent = mockHistory.length;

    // Calculate Section Mastery from current loaded paper & answers
    const secCounts = {};
    state.allQuestions.forEach(q => {
      const sec = q.section || 'General';
      if (!secCounts[sec]) secCounts[sec] = { total: 0, correct: 0 };
      secCounts[sec].total++;
      if (state.userAnswers[q.question_id]?.isCorrect) {
        secCounts[sec].correct++;
      }
    });

    el.anaMasteryBars.innerHTML = Object.keys(secCounts).map(sec => {
      const data = secCounts[sec];
      const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      return `
        <div class="mastery-item">
          <div class="mastery-meta">
            <span>${escapeHtml(sec)}</span>
            <span>${data.correct} / ${data.total} (${pct}%)</span>
          </div>
          <div class="mastery-bar-bg">
            <div class="mastery-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // EVENT LISTENERS & SETUP
  // =========================================================================
  function setupEventListeners() {
    // Mode Switcher
    el.btnModePractice.addEventListener('click', () => switchMode('practice'));
    el.btnModeMock.addEventListener('click', () => switchMode('mock'));
    el.btnModeFlashcards.addEventListener('click', () => switchMode('flashcards'));
    el.btnModeAnalytics.addEventListener('click', () => switchMode('analytics'));

    // Theme & Sound
    el.btnThemeToggle.addEventListener('click', () => {
      setTheme(state.theme === 'dark' ? 'light' : 'dark');
      playSound('click');
    });

    el.btnSoundToggle.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem(STORAGE_KEYS.SOUND, state.soundEnabled);
      updateSoundIcon();
      playSound('click');
    });

    // Shortcuts Modal
    el.btnKeyboardShortcuts.addEventListener('click', () => {
      el.shortcutsModal.classList.remove('hidden');
    });
    el.btnCloseShortcuts.addEventListener('click', () => {
      el.shortcutsModal.classList.add('hidden');
    });
    el.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === el.shortcutsModal) el.shortcutsModal.classList.add('hidden');
    });

    // Practice Filters
    el.paperSelect.addEventListener('change', (e) => {
      loadPaper(e.target.value);
    });

    el.sectionSelect.addEventListener('change', (e) => {
      state.currentSectionFilter = e.target.value;
      applyFilters();
    });

    el.statusFilter.addEventListener('change', (e) => {
      state.currentStatusFilter = e.target.value;
      applyFilters();
    });

    el.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (e.target.value) el.btnClearSearch.classList.remove('hidden');
      else el.btnClearSearch.classList.add('hidden');
      applyFilters();
    });

    el.btnClearSearch.addEventListener('click', () => {
      el.searchInput.value = '';
      state.searchQuery = '';
      el.btnClearSearch.classList.add('hidden');
      applyFilters();
    });

    // Practice Navigation
    el.btnPrevQ.addEventListener('click', () => {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        renderPracticeView();
        playSound('click');
      }
    });

    el.btnNextQ.addEventListener('click', () => {
      if (state.currentIndex < state.filteredQuestions.length - 1) {
        state.currentIndex++;
        renderPracticeView();
        playSound('click');
      }
    });

    el.btnToggleExplanation.addEventListener('click', () => {
      el.solutionPanel.classList.toggle('hidden');
      playSound('click');
    });

    el.btnBookmark.addEventListener('click', () => {
      if (state.filteredQuestions.length === 0) return;
      const qId = String(state.filteredQuestions[state.currentIndex].question_id);
      if (state.bookmarks.has(qId)) {
        state.bookmarks.delete(qId);
      } else {
        state.bookmarks.add(qId);
      }
      savePersistedData();
      renderPracticeView();
      playSound('click');
    });

    el.btnResetCurrent.addEventListener('click', () => {
      if (state.filteredQuestions.length === 0) return;
      const qId = String(state.filteredQuestions[state.currentIndex].question_id);
      delete state.userAnswers[qId];
      savePersistedData();
      renderPracticeView();
      updatePracticeStats();
      playSound('click');
    });

    // Mock Exam Handlers
    el.btnStartMockExam.addEventListener('click', startMockExam);
    el.btnMockSaveNext.addEventListener('click', handleMockSaveNext);
    el.btnMockClear.addEventListener('click', handleMockClear);
    el.btnMockMarkNext.addEventListener('click', handleMockMarkNext);
    el.btnMockPrev.addEventListener('click', () => {
      if (state.mockExam.currentIndex > 0) {
        navigateToMockQuestion(state.mockExam.currentIndex - 1);
      }
    });
    el.btnMockNext.addEventListener('click', () => {
      if (state.mockExam.currentIndex < state.mockExam.questions.length - 1) {
        navigateToMockQuestion(state.mockExam.currentIndex + 1);
      }
    });

    el.btnOpenSubmitModal.addEventListener('click', openSubmitConfirmationModal);
    el.btnCloseSubmitModal.addEventListener('click', () => el.submitModal.classList.add('hidden'));
    el.btnCancelSubmit.addEventListener('click', () => el.submitModal.classList.add('hidden'));
    el.btnConfirmSubmit.addEventListener('click', submitMockExam);

    el.btnRetakeMock.addEventListener('click', () => {
      el.mockResultScreen.classList.add('hidden');
      el.mockSetupScreen.classList.remove('hidden');
    });

    el.btnReviewMockSolutions.addEventListener('click', () => {
      switchMode('practice');
    });

    // Flashcards
    el.flashcardPaperSelect.addEventListener('change', (e) => loadFlashcards(e.target.value));
    el.flashcardElement.addEventListener('click', flipFlashcard);
    el.btnFcFlip.addEventListener('click', flipFlashcard);
    el.btnFcPrev.addEventListener('click', () => {
      if (state.flashcardIndex > 0) {
        state.flashcardIndex--;
        renderFlashcard();
        playSound('click');
      }
    });
    el.btnFcNext.addEventListener('click', () => {
      if (state.flashcardIndex < state.flashcardQuestions.length - 1) {
        state.flashcardIndex++;
        renderFlashcard();
        playSound('click');
      }
    });

    // Reset Progress
    el.btnResetAllProgress.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all solved questions and mock scores?')) {
        state.userAnswers = {};
        state.bookmarks.clear();
        localStorage.removeItem(STORAGE_KEYS.ANSWERS);
        localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
        localStorage.removeItem(STORAGE_KEYS.MOCK_HISTORY);
        renderPracticeView();
        updatePracticeStats();
        renderAnalytics();
        alert('All local progress has been reset!');
      }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in search
      if (document.activeElement === el.searchInput) return;

      if (e.key === 'ArrowLeft') {
        if (el.viewPractice.classList.contains('active')) el.btnPrevQ.click();
        else if (el.viewFlashcards.classList.contains('active')) el.btnFcPrev.click();
        else if (el.viewMock.classList.contains('active') && state.mockExam.active) el.btnMockPrev.click();
      } else if (e.key === 'ArrowRight') {
        if (el.viewPractice.classList.contains('active')) el.btnNextQ.click();
        else if (el.viewFlashcards.classList.contains('active')) el.btnFcNext.click();
        else if (el.viewMock.classList.contains('active') && state.mockExam.active) el.btnMockNext.click();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        if (el.viewPractice.classList.contains('active') && state.filteredQuestions.length > 0) {
          const optCard = el.optionsContainer.querySelector(`[data-option-key="${e.key}"]`);
          if (optCard) optCard.click();
        }
      } else if (e.key.toLowerCase() === 'e') {
        if (el.viewPractice.classList.contains('active')) el.btnToggleExplanation.click();
      } else if (e.key.toLowerCase() === 'b') {
        if (el.viewPractice.classList.contains('active')) el.btnBookmark.click();
      } else if (e.key === ' ' || e.code === 'Space') {
        if (el.viewFlashcards.classList.contains('active')) {
          e.preventDefault();
          flipFlashcard();
        }
      } else if (e.key === 'Escape') {
        el.shortcutsModal.classList.add('hidden');
        el.submitModal.classList.add('hidden');
      }
    });
  }

  // Utilities
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize Application
  function init() {
    loadPersistedData();
    setupEventListeners();
    loadPaper(el.paperSelect.value);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
