const express = require('express');
const { getTopBattles } = require('../utils/storage');

const router = express.Router();

/**
 * GET /api/leaderboard
 * Get top roast battles
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const topBattles = await getTopBattles(limit);

        // Format battles for leaderboard display
        const leaderboard = topBattles.map((battle, index) => ({
            rank: index + 1,
            id: battle.id,
            topic: battle.topic,
            winner: battle.verdict?.winner || 'Unknown',
            score: battle.verdict?.score || 0,
            views: battle.views || 0,
            createdAt: battle.createdAt
        }));

        res.json(leaderboard);

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            error: 'Failed to fetch leaderboard',
            message: error.message
        });
    }
});

module.exports = router;
