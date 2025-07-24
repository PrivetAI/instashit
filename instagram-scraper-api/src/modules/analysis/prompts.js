"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPTS = void 0;
exports.PROMPTS = {
    RELEVANCE: {
        system: 'You are analyzing Instagram reels for job search relevance. Respond with JSON only.',
        user: function (description) { return "\n      Analyze if this Instagram reel is about job search, career development, employment opportunities, \n      work tips, or professional growth.\n      \n      Description: \"".concat(description, "\"\n      \n      Respond ONLY with valid JSON:\n      {\n        \"relevant\": true/false,\n        \"confidence\": 0.0-1.0,\n        \"reason\": \"brief explanation\"\n      }\n    "); },
    },
    TONE: {
        system: 'You analyze the tone of Instagram comments. Respond with JSON only.',
        user: function (comments) { return "\n      Analyze the overall tone of these Instagram comments:\n      \n      ".concat(comments.map(function (c, i) { return "".concat(i + 1, ". ").concat(c); }).join('\n'), "\n      \n      Categorize the tone as one of:\n      - professional (formal, business-like)\n      - casual (friendly, relaxed)\n      - motivational (inspiring, encouraging)\n      \n      Respond ONLY with valid JSON:\n      {\n        \"tone\": \"professional|casual|motivational\",\n        \"confidence\": 0.0-1.0,\n        \"keywords\": [\"keyword1\", \"keyword2\"]\n      }\n    "); },
    },
    GENERATE: {
        system: function (tone) { return "\n      You write natural Instagram comments about job search and career topics.\n      Your tone should be ".concat(tone, ".\n      Comments must be authentic, engaging, and under 100 characters.\n      Never use hashtags or emojis unless specifically asked.\n    "); },
        user: function (context, tone) { return "\n      Write a short Instagram comment (max 100 chars) related to: \"".concat(context, "\"\n      \n      Requirements:\n      - Match the ").concat(tone, " tone\n      - Be natural and conversational\n      - Add value to the discussion\n      - No hashtags or excessive emojis\n      \n      Respond with just the comment text, nothing else.\n    "); },
    },
};
