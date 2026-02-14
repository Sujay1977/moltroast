const crypto = require('crypto');

/**
 * Generate a verifiable hash for a battle
 * @param {string} battleId - Battle ID
 * @param {Array} rounds - Battle rounds
 * @returns {string} - SHA256 hash
 */
function generateBattleHash(battleId, rounds) {
    const transcript = rounds.map(r => r.roast).join('|');
    const data = `${battleId}|${transcript}|provable`;

    const hash = crypto
        .createHash('sha256')
        .update(data)
        .digest('hex');

    return hash.substring(0, 16); // Shortened for display
}

module.exports = {
    generateBattleHash
};
