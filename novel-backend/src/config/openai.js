const OpenAI = require('openai');
require('dotenv').config();

const groqKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

if (!groqKey) {
  console.warn("⚠️ Warning: No GROQ_API_KEY found in .env file!");
}

const openai = new OpenAI({
  apiKey: groqKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

module.exports = openai;
