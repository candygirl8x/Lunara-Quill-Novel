const { db, admin } = require('../config/firebase');

// In-memory store fallback if Firebase credentials are not yet set
const localStore = new Map();

async function loadNovelMemory(userId, novelId) {
  if (db) {
    const novelRef = db.doc(`users/${userId}/novels/${novelId}`);
    const novelSnap = await novelRef.get();
    if (!novelSnap.exists) throw { status: 404, message: `Novel ${novelId} not found.` };
    const novelData = novelSnap.data();
    const chaptersSnap = await novelRef.collection('chapters').orderBy('chapterNumber', 'desc').limit(5).get();
    return {
      novelRef,
      novelData,
      previousChapters: chaptersSnap.docs.map(doc => doc.data()).reverse(),
      usedPlaces: novelData.usedPlaces || [],
      usedTimeSettings: novelData.usedTimeSettings || [],
      usedEmotions: novelData.usedEmotions || [],
      recentPhrases: novelData.recentPhrases || [],
      characters: novelData.characters || []
    };
  }

  const novel = localStore.get(novelId);
  if (!novel) throw { status: 404, message: `Novel ${novelId} not found.` };
  return {
    novelRef: null,
    novelData: novel,
    previousChapters: novel.chapters || [],
    usedPlaces: novel.usedPlaces || [],
    usedTimeSettings: novel.usedTimeSettings || [],
    usedEmotions: novel.usedEmotions || [],
    recentPhrases: novel.recentPhrases || [],
    characters: novel.characters || []
  };
}

async function commitChapterMemory(novelRef, chapterData, chapterNumber, novelId, userId) {
  if (db && novelRef) {
    const chapterRef = novelRef.collection('chapters').doc(`chapter-${chapterNumber}`);
    const batch = db.batch();
    batch.set(chapterRef, {
      chapterNumber,
      title: chapterData.title,
      textEnglish: chapterData.textEnglish,
      textHindi: chapterData.textHindi,
      summary: chapterData.summary,
      locationsUsed: chapterData.locationsUsed,
      timeSetting: chapterData.timeSetting,
      dominantEmotion: chapterData.dominantEmotion,
      events: chapterData.events,
      plan: chapterData.plan,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    batch.update(novelRef, {
      currentChapter: chapterNumber,
      usedPlaces: admin.firestore.FieldValue.arrayUnion(...(chapterData.locationsUsed || [])),
      usedTimeSettings: admin.firestore.FieldValue.arrayUnion(chapterData.timeSetting),
      usedEmotions: admin.firestore.FieldValue.arrayUnion(chapterData.dominantEmotion),
      recentPhrases: admin.firestore.FieldValue.arrayUnion(...(chapterData.keyPhrases || [])),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return await batch.commit();
  }

  const novel = localStore.get(novelId);
  if (novel) {
    novel.currentChapter = chapterNumber;
    novel.chapters.push(chapterData);
    novel.usedPlaces.push(...(chapterData.locationsUsed || []));
    novel.usedTimeSettings.push(chapterData.timeSetting);
    novel.usedEmotions.push(chapterData.dominantEmotion);
  }
}

module.exports = { loadNovelMemory, commitChapterMemory, localStore };
