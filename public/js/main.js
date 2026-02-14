// Loading quotes for displaying during battle generation
const loadingQuotes = [
    "Heating up the burns...",
    "Assembling savage agents...",
    "Preparing emotional damage...",
    "Charging the roast cannons...",
    "Summoning the jury...",
    "Loading maximum insult capacity..."
];

/**
 * Show loading spinner with random quote
 */
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');

    if (loadingOverlay && loadingText) {
        const randomQuote = loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)];
        loadingText.textContent = randomQuote;
        loadingOverlay.classList.remove('hidden');
    }
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

/**
 * Submit roast battle form
 */
async function submitRoastBattle(event) {
    event.preventDefault();

    const topicInput = document.getElementById('topic-input');
    const personaSelect = document.getElementById('persona-select');

    const topic = topicInput.value.trim();
    const persona = personaSelect.value;

    if (!topic) {
        alert('Please enter a topic to roast!');
        return;
    }

    showLoading();

    try {
        const response = await fetch('/api/roast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic, persona })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Failed to generate battle');
        }

        // Redirect to battle page
        window.location.href = `/battle.html?id=${data.battleId}`;

    } catch (error) {
        hideLoading();
        console.error('Error:', error);

        // Show user-friendly error
        if (error.message.includes('API key')) {
            alert('⚠️ OpenAI API key not configured. Please check the server setup.');
        } else if (error.message.includes('Cool down')) {
            alert(error.message);
        } else {
            alert(`Failed to start roast battle: ${error.message}`);
        }
    }
}

/**
 * Load battle data on battle.html page
 */
async function loadBattle() {
    const urlParams = new URLSearchParams(window.location.search);
    const battleId = urlParams.get('id');

    if (!battleId) {
        alert('No battle ID provided');
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch(`/api/battle/${battleId}`);

        if (!response.ok) {
            throw new Error('Battle not found');
        }

        const battle = await response.json();
        displayBattle(battle);

    } catch (error) {
        console.error('Error loading battle:', error);
        alert('Failed to load battle. Redirecting to home...');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }
}

/**
 * Display battle data on the page
 */
function displayBattle(battle) {
    // Update topic
    const topicElement = document.getElementById('battle-topic');
    if (topicElement) {
        topicElement.textContent = `ROAST BATTLE: ${battle.topic}`;
    }

    // Update rounds
    if (battle.rounds && battle.rounds.length >= 3) {
        for (let i = 0; i < 3; i++) {
            const round = battle.rounds[i];
            const roastElement = document.getElementById(`round${i + 1}-roast`);
            if (roastElement) {
                roastElement.textContent = `"${round.roast}"`;
            }
        }
    }

    // Update verdict
    if (battle.verdict) {
        const winnerElement = document.getElementById('jury-winner');
        const scoreElement = document.getElementById('jury-score');
        const verdictElement = document.getElementById('jury-verdict');
        const bannerElement = document.getElementById('winner-banner');

        if (winnerElement) winnerElement.textContent = `JURY SAYS: Winner ${battle.verdict.winner}`;
        if (scoreElement) scoreElement.textContent = `Score: ${battle.verdict.score}/100`;
        if (verdictElement) verdictElement.textContent = `"${battle.verdict.verdict}"`;
        if (bannerElement) bannerElement.textContent = `WINNER: ${battle.verdict.winner}`.toUpperCase();
    }

    // Setup share buttons
    setupShareButtons(battle);

    // Trigger confetti
    setTimeout(() => {
        if (typeof triggerConfetti === 'function') {
            triggerConfetti();
        }
    }, 3000);
}

/**
 * Setup share button handlers
 */
function setupShareButtons(battle) {
    const tweetButton = document.getElementById('tweet-button');
    const copyButton = document.getElementById('copy-button');

    const battleUrl = `${window.location.origin}/battle.html?id=${battle.id}`;
    const tweetText = `AI roasted "${battle.topic}" 🔥 ${battleUrl} #MoltRoast #AIRoast`;

    if (tweetButton) {
        tweetButton.onclick = () => {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
            window.open(twitterUrl, '_blank');
        };
    }

    if (copyButton) {
        copyButton.onclick = () => {
            navigator.clipboard.writeText(battleUrl).then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = '✓ Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy link');
            });
        };
    }
}

/**
 * Load leaderboard data
 */
async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard?limit=10');
        const leaderboard = await response.json();

        displayLeaderboard(leaderboard);

    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

/**
 * Display leaderboard data
 */
function displayLeaderboard(leaderboard) {
    const tbody = document.getElementById('leaderboard-tbody');
    if (!tbody) return;

    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-white/40">No battles yet. Be the first!</td></tr>';
        return;
    }

    tbody.innerHTML = leaderboard.map((battle, index) => {
        const rankDisplay = index < 3 ? getRankBadge(index + 1) : `<span class="text-white/40 font-bold">${index + 1}</span>`;
        const avatar = battle.topic.charAt(0).toUpperCase();

        return `
      <tr class="row-hover transition-all group cursor-pointer" onclick="window.location.href='/battle.html?id=${battle.id}'">
        <td class="px-8 py-6 text-center">${rankDisplay}</td>
        <td class="px-6 py-6">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">${avatar}</div>
            <span class="text-cyan-accent font-semibold text-base">${escapeHtml(battle.topic)}</span>
          </div>
        </td>
        <td class="px-6 py-6 text-center">
          <span class="text-primary font-black text-xl tracking-tighter">${battle.score}</span>
        </td>
        <td class="px-8 py-6 text-right font-medium text-white/90">${formatViews(battle.views)}</td>
      </tr>
    `;
    }).join('');
}

/**
 * Get rank badge HTML
 */
function getRankBadge(rank) {
    const colors = [
        'yellow-500', // Gold
        'slate-300',  // Silver
        'orange-700'  // Bronze
    ];

    const color = colors[rank - 1];

    return `
    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-${color}/20 border border-${color}/30">
      <span class="material-symbols-outlined text-${color} fill-1">workspace_premium</span>
    </div>
  `;
}

/**
 * Format view count
 */
function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Simple confetti animation
 */
function triggerConfetti() {
    // Simple confetti particles (optional enhancement)
    console.log('🎉 Confetti triggered!');
    // Could integrate confetti.js library here for full effect
}
