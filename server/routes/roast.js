const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { generateRound, generateVerdict } = require('../services/openai');
const { saveBattle, getBattle, incrementViews } = require('../utils/storage');
const { generateBattleHash } = require('../utils/hash');
const { sanitizeInput, validateTopic } = require('../utils/sanitize');
const rateLimitMiddleware = require('../middleware/rateLimit');

const router = express.Router();

/**
 * POST /api/roast
 * Generate a new roast battle
 */
router.post('/roast', rateLimitMiddleware, async (req, res) => {
    try {
        const { topic, persona } = req.body;

        // Validate and sanitize input
        const validation = validateTopic(topic);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const cleanTopic = sanitizeInput(topic);
        const battleId = uuidv4();

        console.log(`🔥 Starting roast battle for topic: "${cleanTopic}" with persona: ${persona}`);

        // Generate 3 rounds
        const rounds = [];

        try {
            // Round 1: Agent A
            const round1 = await generateRound(1, cleanTopic, 'Agent A');
            rounds.push({ agent: 'Agent A', roast: round1 });

            // Round 2: Agent B (with context)
            const round2 = await generateRound(2, cleanTopic, 'Agent B', round1);
            rounds.push({ agent: 'Agent B', roast: round2 });

            // Round 3: Agent A (final)
            const round3 = await generateRound(3, cleanTopic, 'Agent A', round2);
            rounds.push({ agent: 'Agent A', roast: round3 });

            // Generate jury verdict
            const verdict = await generateVerdict(cleanTopic, rounds);

            // Generate verifiable hash
            const hash = generateBattleHash(battleId, rounds);

            // Save battle
            const battle = {
                id: battleId,
                topic: cleanTopic,
                persona: persona || 'Crypto Chad vs Normie',
                rounds,
                verdict,
                hash
            };

            await saveBattle(battle);

            console.log(`✅ Battle created successfully: ${battleId}`);

            res.json({
                success: true,
                battleId,
                battle
            });

        } catch (error) {
            console.error('Error generating battle:', error);

            // Check if it's an OpenAI API error
            if (error.message.includes('API key')) {
                return res.status(500).json({
                    error: 'OpenAI API key not configured',
                    message: 'Please set your OPENAI_API_KEY in the .env file'
                });
            }

            throw error;
        }

    } catch (error) {
        console.error('Roast generation error:', error);
        res.status(500).json({
            error: 'Failed to generate roast battle',
            message: error.message
        });
    }
});

/**
 * GET /api/battle/:id
 * Retrieve a battle by ID
 */
router.get('/battle/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const battle = await getBattle(id);

        if (!battle) {
            return res.status(404).json({ error: 'Battle not found' });
        }

        // Increment view count
        await incrementViews(id);

        res.json(battle);

    } catch (error) {
        console.error('Error fetching battle:', error);
        res.status(500).json({
            error: 'Failed to fetch battle',
            message: error.message
        });
    }
});

module.exports = router;
