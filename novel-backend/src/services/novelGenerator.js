const openai = require('../config/openai');
const { validateChapterRepetitions } = require('./repetitionValidator');

// Primary models list (Qwen 3.6 27B generates immediately, GPT-OSS as backup)
const MODELS = [
  'qwen/qwen3.6-27b',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b'
];

function extractJson(rawText) {
  if (!rawText) throw new Error("Empty response from AI.");
  let text = rawText.trim();
  
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    text = text.substring(firstBrace, lastBrace + 1);
  }
  
  try {
    return JSON.parse(text);
  } catch (err) {
    const cleaned = text.replace(/,\s*([\]}])/g, '$1').replace(/[\u0000-\u001F]+/g, ' ');
    return JSON.parse(cleaned);
  }
}

async function callGroqFast(messages) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(` Generating with model: ${model}...`);
      
      const response = await openai.chat.completions.create({
        model: model,
        temperature: 0.72,
        max_completion_tokens: 4096,
        messages: messages
      });

      const messageObj = response.choices[0]?.message;
      // Extract from content OR fallback to reasoning if content is empty
      const content = messageObj?.content || messageObj?.reasoning_content || messageObj?.reasoning;

      if (!content) {
        throw new Error("Model returned empty content payload.");
      }

      return extractJson(content);
    } catch (err) {
      console.warn(`Model ${model} failed (${err.message}). Trying fallback...`);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate novel content.");
}

async function generateUniqueChapter(memory, targetChapterIndex, totalChapters) {
  const messages = [
    {
      role: 'system',
      content: `You are an elite bilingual novelist.
Generate Chapter ${targetChapterIndex} of a ${totalChapters}-chapter novel.
Return ONLY a valid JSON object matching:
{
  "title": "Chapter Title",
  "textEnglish": "Full chapter story in English with paragraphs...",
  "textHindi": "पूरा अध्याय हिंदी में...",
  "summary": "2-sentence summary of this chapter events",
  "locationsUsed": ["Current Location Name"],
  "timeSetting": "Atmosphere and time",
  "dominantEmotion": "Core emotional frequency",
  "events": ["event 1", "event 2"],
  "keyPhrases": ["distinctive phrase 1"]
}`
    },
    {
      role: 'user',
      content: JSON.stringify({
        title: memory.novelData.title,
        genre: memory.novelData.genre,
        coreIdea: memory.novelData.idea,
        characters: memory.characters,
        alreadyUsedPlaces: memory.usedPlaces,
        alreadyUsedEmotions: memory.usedEmotions,
        previousSummaries: memory.previousChapters.map(c => `Ch.${c.chapterNumber || ''}: ${c.summary || ''}`)
      })
    }
  ];

  const draft = await callGroqFast(messages);
  return draft;
}

module.exports = { generateUniqueChapter };
