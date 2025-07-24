"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', function () { return ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        url: process.env.DATABASE_URL,
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-4',
    },
    puppeteer: {
        headless: process.env.PUPPETEER_HEADLESS === 'true',
        executablePath: process.env.PUPPETEER_EXEC_PATH,
    },
    instagram: {
        baseUrl: 'https://www.instagram.com',
        actionDelay: parseInt(process.env.ACTION_DELAY, 10) || 5000,
    },
}); });
