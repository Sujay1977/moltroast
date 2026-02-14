const fs = require('fs').promises;
const path = require('path');

const STORAGE_FILE = path.join(__dirname, '../../roasts.json');

/**
 * Initialize storage file if it doesn't exist
 */
async function initStorage() {
    try {
        await fs.access(STORAGE_FILE);
    } catch {
        await fs.writeFile(STORAGE_FILE, JSON.stringify({ battles: [] }, null, 2));
        console.log('📁 Created roasts.json storage file');
    }
}

/**
 * Read all battles from storage
 */
async function readBattles() {
    await initStorage();
    const data = await fs.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
}

/**
 * Write battles to storage
 */
async function writeBattles(data) {
    await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
}

/**
 * Save a new battle
 * @param {Object} battle - Battle data
 */
async function saveBattle(battle) {
    const data = await readBattles();
    data.battles.push({
        ...battle,
        createdAt: new Date().toISOString(),
        views: 0
    });
    await writeBattles(data);
    console.log(`💾 Saved battle: ${battle.id}`);
}

/**
 * Get a battle by ID
 * @param {string} id - Battle ID
 * @returns {Object|null} - Battle data or null
 */
async function getBattle(id) {
    const data = await readBattles();
    return data.battles.find(b => b.id === id) || null;
}

/**
 * Increment view count for a battle
 * @param {string} id - Battle ID
 */
async function incrementViews(id) {
    const data = await readBattles();
    const battle = data.battles.find(b => b.id === id);
    if (battle) {
        battle.views = (battle.views || 0) + 1;
        await writeBattles(data);
    }
}

/**
 * Get top battles sorted by score and views
 * @param {number} limit - Number of battles to return
 * @returns {Array} - Array of top battles
 */
async function getTopBattles(limit = 10) {
    const data = await readBattles();
    return data.battles
        .sort((a, b) => {
            // Sort by score first, then views
            if (b.score !== a.score) return b.score - a.score;
            return (b.views || 0) - (a.views || 0);
        })
        .slice(0, limit);
}

module.exports = {
    saveBattle,
    getBattle,
    incrementViews,
    getTopBattles
};
