/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    if (!input || typeof input !== 'string') return '';

    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim()
        .substring(0, 100); // Max 100 characters
}

/**
 * Validate topic input
 * @param {string} topic - Topic to validate
 * @returns {Object} - {valid: boolean, error: string}
 */
function validateTopic(topic) {
    if (!topic || topic.trim().length === 0) {
        return { valid: false, error: 'Topic is required' };
    }

    if (topic.length > 100) {
        return { valid: false, error: 'Topic must be less than 100 characters' };
    }

    return { valid: true };
}

module.exports = {
    sanitizeInput,
    validateTopic
};
