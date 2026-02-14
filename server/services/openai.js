const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a roast round using OpenAI GPT-4
 * @param {number} round - Round number (1, 2, or 3)
 * @param {string} topic - The topic to roast
 * @param {string} agentName - Name of the agent (Agent A or Agent B)
 * @param {string} previousRound - Previous round's roast (for context)
 * @returns {Promise<string>} - The generated roast
 */
async function generateRound(round, topic, agentName, previousRound = '') {
    let prompt = '';

    if (round === 1) {
        prompt = `As ${agentName}, roast "${topic}" savagely in 2-3 sentences. Be hilarious, creative, and brutal. Make meme-worthy burns.`;
    } else if (round === 2) {
        prompt = `As ${agentName}, counter the previous roast: "${previousRound}" and add your own savage burn about "${topic}". Be hilarious and destructive in 2-3 sentences.`;
    } else if (round === 3) {
        prompt = `As ${agentName}, deliver the final roast responding to: "${previousRound}" about "${topic}". Go absolutely nuclear. 2-3 sentences of pure devastation.`;
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a savage AI roast master. Your roasts are hilarious, creative, and meme-worthy. You spare no feelings and deliver maximum emotional damage.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 1.0,
            max_tokens: 150
        });

        const roast = completion.choices[0].message.content.trim();
        console.log(`Generated ${agentName} Round ${round}:`, roast);
        return roast;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate roast. Check your API key and try again.');
    }
}

/**
 * Generate jury verdict for the roast battle
 * @param {string} topic - The roasted topic
 * @param {Array} rounds - Array of round objects {agent, roast}
 * @returns {Promise<Object>} - Verdict with winner, score, and quote
 */
async function generateVerdict(topic, rounds) {
    const transcript = rounds.map((r, i) =>
        `Round ${i + 1} - ${r.agent}: "${r.roast}"`
    ).join('\n');

    const prompt = `Judge this roast battle about "${topic}":

${transcript}

Pick the winner (Agent A or Agent B), give them a score out of 100, and provide a funny, meme-worthy verdict quote (1-2 sentences) explaining why they won.

Respond in this exact format:
Winner: [Agent A or Agent B]
Score: [0-100]
Verdict: "[funny quote]"`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an elite AI jury that judges roast battles. You appreciate creativity, humor, and devastating burns. Your verdicts are funny and decisive.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: 200
        });

        const response = completion.choices[0].message.content.trim();
        console.log('Jury Response:', response);

        // Parse the response
        const winnerMatch = response.match(/Winner:\s*(Agent [AB])/i);
        const scoreMatch = response.match(/Score:\s*(\d+)/);
        const verdictMatch = response.match(/Verdict:\s*"([^"]+)"/i);

        const winner = winnerMatch ? winnerMatch[1] : 'Agent A';
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 85;
        const verdict = verdictMatch ? verdictMatch[1] : 'Absolute devastation delivered!';

        return { winner, score, verdict };
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate verdict. Check your API key and try again.');
    }
}

module.exports = {
    generateRound,
    generateVerdict
};
