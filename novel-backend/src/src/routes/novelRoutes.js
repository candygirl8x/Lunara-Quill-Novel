const express = require('express');
const router = express.Router();
const verifyAuth = require('../middlewares/auth');
const { loadNovelMemory, commitChapterMemory } = require('../services/continuityEngine');
const { generateUniqueChapter } = require('../services/novelGenerator');
const { db, admin } = require('../config/firebase');

// Route 1: Initialize Novel
router.post('/init', verifyAuth, async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { title, genre, characterOne, characterTwo, leadType, idea, totalChapters } = req.body;

        if (!title || !genre || !idea) {
            return res.status(400).json({ error: 'Title, genre, and idea are required.' });
        }

        const novelRef = db.collection(`users/${userId}/novels`).doc();

        const characters = [];
        if (characterOne) characters.push({ name: characterOne, role: 'Protagonist' });
        if (characterTwo && (leadType === 'both' || !leadType)) {
            characters.push({ name: characterTwo, role: 'Deuteragonist' });
        }

        const initialData = {
            id: novelRef.id,
            title,
            genre,
            leadType: leadType || 'both',
            idea,
            totalChapters: Number(totalChapters) || 5,
            currentChapter: 0,
            characters,
            worldRules: [`Core Premise: ${idea}`],
            usedPlaces: [],
            usedTimeSettings: [],
            usedEmotions: [],
            recentPhrases: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await novelRef.set(initialData);

        res.status(201).json({ success: true, novelId: novelRef.id, novel: initialData });
    } catch (err) {
        next(err);
    }
});

// Route 2: Generate Next Chapter
router.post('/:novelId/chapters/next', verifyAuth, async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { novelId } = req.params;

        const memory = await loadNovelMemory(userId, novelId);
        const nextChapterNum = (memory.novelData.currentChapter || 0) + 1;

        if (nextChapterNum > memory.novelData.totalChapters) {
            return res.status(400).json({ error: 'Novel has reached its final chapter.' });
        }

        const completedChapter = await generateUniqueChapter(
            memory,
            nextChapterNum,
            memory.novelData.totalChapters
        );

        await commitChapterMemory(memory.novelRef, completedChapter, nextChapterNum);

        res.status(200).json({
            success: true,
            chapterNumber: nextChapterNum,
            chapter: {
                title: completedChapter.title,
                textEnglish: completedChapter.textEnglish,
                textHindi: completedChapter.textHindi,
                summary: completedChapter.summary,
                dominantEmotion: completedChapter.dominantEmotion,
                location: completedChapter.locationsUsed,
                timeSetting: completedChapter.timeSetting,
                events: completedChapter.events
            }
        });
    } catch (err) {
        next(err);
    }
});

// CRITICAL: Export the router directly (no curly braces)
module.exports = router;