function normalize(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractNGrams(text, size = 5) {
  const words = normalize(text).split(' ').filter(w => w.length > 2);
  const ngrams = new Set();
  for (let i = 0; i <= words.length - size; i++) {
    ngrams.add(words.slice(i, i + size).join(' '));
  }
  return ngrams;
}

function validateChapterRepetitions(draft, novelMemory) {
  const errors = [];
  const pastText = (novelMemory.previousChapters || [])
    .map(c => `${c.textEnglish || ''} ${c.summary || ''}`)
    .join(' ');
  
  const pastNGrams = extractNGrams(pastText, 5);
  const currentNGrams = extractNGrams(draft.textEnglish, 5);
  const matchedPhrases = [];

  for (const phrase of currentNGrams) {
    if (pastNGrams.has(phrase)) {
      matchedPhrases.push(phrase);
    }
  }

  if (matchedPhrases.length > 2) {
    errors.push(`Repeated phrases detected: "${matchedPhrases.slice(0, 3).join('", "')}"`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    matchedPhrases,
    repeatedLocations: []
  };
}

module.exports = { normalize, extractNGrams, validateChapterRepetitions };
