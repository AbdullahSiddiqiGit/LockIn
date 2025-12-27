// Game State
let gameState = {
    currentImageIndex: 0,
    answers: [],
    score: 0,
    dailyChallenge: null,
    hasPlayedToday: false
};

// Image Database - This would ideally be loaded from a server
// For now, using placeholder images with known AI/Real status
const imageDatabase = [
    // Day 1 challenge
    [
        { url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', type: 'real', hint: 'Notice the natural lighting' },
        { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', type: 'real', hint: 'Check the texture details' },
        { url: 'https://picsum.photos/seed/ai1/500/500', type: 'ai', hint: 'Look at the symmetry' },
        { url: 'https://picsum.photos/seed/real2/500/500', type: 'real', hint: 'Natural imperfections' },
        { url: 'https://picsum.photos/seed/ai2/500/500', type: 'ai', hint: 'Too perfect?' }
    ],
    // Day 2 challenge
    [
        { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', type: 'real', hint: 'Natural scenery' },
        { url: 'https://picsum.photos/seed/ai3/500/500', type: 'ai', hint: 'Strange patterns' },
        { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', type: 'real', hint: 'Authentic details' },
        { url: 'https://picsum.photos/seed/ai4/500/500', type: 'ai', hint: 'Unnatural elements' },
        { url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff', type: 'real', hint: 'Real photography' }
    ],
    // Day 3 challenge
    [
        { url: 'https://picsum.photos/seed/ai5/500/500', type: 'ai', hint: 'Check the details' },
        { url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6', type: 'real', hint: 'Natural composition' },
        { url: 'https://picsum.photos/seed/ai6/500/500', type: 'ai', hint: 'Artificial look' },
        { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', type: 'real', hint: 'Genuine photo' },
        { url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5', type: 'real', hint: 'Real landscape' }
    ]
];

// Get today's challenge index based on date
function getTodaysChallengeIndex() {
    const startDate = new Date('2025-01-01');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % imageDatabase.length;
}

// Get today's date string
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Initialize game
function initGame() {
    loadStats();
    checkIfPlayedToday();
    setupEventListeners();

    if (gameState.hasPlayedToday) {
        showResults();
    } else {
        showWelcomeScreen();
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Check if user has played today
function checkIfPlayedToday() {
    const today = getTodayDateString();
    const lastPlayed = localStorage.getItem('lastPlayed');

    if (lastPlayed === today) {
        gameState.hasPlayedToday = true;
        const savedAnswers = JSON.parse(localStorage.getItem('todayAnswers') || '[]');
        gameState.answers = savedAnswers;
        calculateScore();
    } else {
        gameState.hasPlayedToday = false;
        gameState.answers = [];
        gameState.score = 0;
    }
}

// Load daily challenge
function loadDailyChallenge() {
    const challengeIndex = getTodaysChallengeIndex();
    gameState.dailyChallenge = imageDatabase[challengeIndex];
    gameState.currentImageIndex = 0;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('playBtn').addEventListener('click', startGame);
    document.getElementById('aiBtn').addEventListener('click', () => handleChoice('ai'));
    document.getElementById('realBtn').addEventListener('click', () => handleChoice('real'));
    document.getElementById('shareBtn').addEventListener('click', shareResults);

    document.getElementById('helpBtn').addEventListener('click', () => showModal('helpModal'));
    document.getElementById('statsBtn').addEventListener('click', () => {
        updateStatsModal();
        showModal('statsModal');
    });

    document.getElementById('closeHelp').addEventListener('click', () => hideModal('helpModal'));
    document.getElementById('closeStats').addEventListener('click', () => hideModal('statsModal'));

    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });
}

// Show welcome screen
function showWelcomeScreen() {
    hideAllScreens();
    document.getElementById('welcomeScreen').classList.remove('hidden');
}

// Start game
function startGame() {
    loadDailyChallenge();
    gameState.currentImageIndex = 0;
    gameState.answers = [];
    gameState.score = 0;

    hideAllScreens();
    document.getElementById('gameScreen').classList.remove('hidden');
    loadImage();
}

// Load current image
function loadImage() {
    const currentImage = gameState.dailyChallenge[gameState.currentImageIndex];
    const imgElement = document.getElementById('gameImage');

    // Reset buttons and overlay
    document.getElementById('aiBtn').disabled = false;
    document.getElementById('realBtn').disabled = false;
    document.getElementById('aiBtn').className = 'choice-btn';
    document.getElementById('realBtn').className = 'choice-btn';
    document.getElementById('imageOverlay').className = 'image-overlay hidden';
    document.getElementById('feedback').className = 'feedback hidden';

    imgElement.src = currentImage.url;

    // Update progress
    updateProgress();
    document.getElementById('currentQuestion').textContent = gameState.currentImageIndex + 1;
}

// Update progress bar
function updateProgress() {
    const progress = ((gameState.currentImageIndex) / 5) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// Handle user choice
function handleChoice(choice) {
    const currentImage = gameState.dailyChallenge[gameState.currentImageIndex];
    const isCorrect = choice === currentImage.type;

    // Disable buttons
    document.getElementById('aiBtn').disabled = true;
    document.getElementById('realBtn').disabled = true;

    // Show feedback
    showFeedback(isCorrect, currentImage);

    // Save answer
    gameState.answers.push({
        correct: isCorrect,
        userChoice: choice,
        actualType: currentImage.type
    });

    // Move to next image or show results
    setTimeout(() => {
        gameState.currentImageIndex++;

        if (gameState.currentImageIndex < 5) {
            loadImage();
        } else {
            finishGame();
        }
    }, 2000);
}

// Show feedback
function showFeedback(isCorrect, image) {
    const overlay = document.getElementById('imageOverlay');
    const feedback = document.getElementById('feedback');
    const aiBtn = document.getElementById('aiBtn');
    const realBtn = document.getElementById('realBtn');

    // Show overlay
    overlay.classList.remove('hidden');
    overlay.classList.add(isCorrect ? 'correct' : 'incorrect');
    overlay.textContent = isCorrect ? '✓' : '✗';

    // Highlight correct button
    if (image.type === 'ai') {
        aiBtn.classList.add('correct');
    } else {
        realBtn.classList.add('correct');
    }

    // Show feedback message
    feedback.classList.remove('hidden');
    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    feedback.innerHTML = isCorrect
        ? `<strong>Correct!</strong> This image is ${image.type === 'ai' ? 'AI-generated' : 'a real photo'}.`
        : `<strong>Not quite!</strong> This image is actually ${image.type === 'ai' ? 'AI-generated' : 'a real photo'}. ${image.hint}`;
}

// Calculate score
function calculateScore() {
    gameState.score = gameState.answers.filter(a => a.correct).length;
}

// Finish game
function finishGame() {
    calculateScore();
    saveTodayResults();
    updateStats();
    showResults();
}

// Save today's results
function saveTodayResults() {
    const today = getTodayDateString();
    localStorage.setItem('lastPlayed', today);
    localStorage.setItem('todayAnswers', JSON.stringify(gameState.answers));
}

// Update stats
function updateStats() {
    let stats = JSON.parse(localStorage.getItem('stats') || '{}');

    if (!stats.totalGames) stats.totalGames = 0;
    if (!stats.totalCorrect) stats.totalCorrect = 0;
    if (!stats.currentStreak) stats.currentStreak = 0;
    if (!stats.maxStreak) stats.maxStreak = 0;
    if (!stats.history) stats.history = [];

    // Update totals
    stats.totalGames++;
    stats.totalCorrect += gameState.score;

    // Update streak
    const today = getTodayDateString();
    const lastPlayed = stats.lastPlayedDate;
    const yesterday = getYesterdayDateString();

    if (!lastPlayed || lastPlayed === yesterday) {
        stats.currentStreak++;
    } else if (lastPlayed !== today) {
        stats.currentStreak = 1;
    }

    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.lastPlayedDate = today;

    // Add to history
    stats.history.unshift({
        date: today,
        score: gameState.score,
        answers: gameState.answers
    });

    // Keep only last 30 games
    if (stats.history.length > 30) {
        stats.history = stats.history.slice(0, 30);
    }

    localStorage.setItem('stats', JSON.stringify(stats));
}

// Load stats
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('stats') || '{}');
    return stats;
}

// Get yesterday's date string
function getYesterdayDateString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

// Show results
function showResults() {
    hideAllScreens();
    document.getElementById('resultsScreen').classList.remove('hidden');

    // Update score display
    document.getElementById('finalScore').textContent = `${gameState.score}/5`;
    const accuracy = (gameState.score / 5) * 100;
    document.getElementById('accuracyPercent').textContent = `${accuracy}% Accurate`;

    // Show results grid
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    gameState.answers.forEach((answer, index) => {
        const box = document.createElement('div');
        box.className = `result-box ${answer.correct ? 'correct' : 'incorrect'}`;
        box.textContent = answer.correct ? '✓' : '✗';
        box.style.animationDelay = `${index * 0.1}s`;
        resultsGrid.appendChild(box);
    });

    // Update stats summary
    const stats = loadStats();
    document.getElementById('streakDisplay').textContent = stats.currentStreak || 0;
    document.getElementById('totalGamesDisplay').textContent = stats.totalGames || 0;
}

// Share results
function shareResults() {
    const today = getTodayDateString();
    const emojis = gameState.answers.map(a => a.correct ? '✅' : '❌').join('');
    const accuracy = ((gameState.score / 5) * 100).toFixed(0);

    const shareText = `AI or Real? ${today}\n${gameState.score}/5 (${accuracy}%)\n\n${emojis}\n\nPlay at: ${window.location.href}`;

    if (navigator.share) {
        navigator.share({
            title: 'AI or Real?',
            text: shareText
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('shareBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied to Clipboard!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Update stats modal
function updateStatsModal() {
    const stats = loadStats();

    document.getElementById('totalPlayed').textContent = stats.totalGames || 0;

    const totalQuestions = (stats.totalGames || 0) * 5;
    const accuracy = totalQuestions > 0
        ? ((stats.totalCorrect || 0) / totalQuestions * 100).toFixed(0)
        : 0;
    document.getElementById('totalAccuracy').textContent = accuracy + '%';

    document.getElementById('currentStreak').textContent = stats.currentStreak || 0;
    document.getElementById('maxStreak').textContent = stats.maxStreak || 0;

    // Update history
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (stats.history && stats.history.length > 0) {
        stats.history.slice(0, 10).forEach(game => {
            const item = document.createElement('div');
            item.className = 'history-item';

            const date = new Date(game.date);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            item.innerHTML = `
                <span class="history-date">${dateStr}</span>
                <span class="history-score">${game.score}/5</span>
            `;
            historyList.appendChild(item);
        });
    } else {
        historyList.innerHTML = '<p style="text-align: center; color: var(--color-gray);">No games played yet</p>';
    }
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

// Hide modal
function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Hide all screens
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
}

// Update countdown to next game
function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
