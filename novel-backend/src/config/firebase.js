const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 1. Check for a local serviceAccountKey.json file in root
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log(" Firebase initialized using serviceAccountKey.json");
} else if (process.env.FIREBASE_PRIVATE_KEY && !process.env.FIREBASE_PRIVATE_KEY.includes('PASTE_YOUR_KEY_HERE')) {
  // 2. Otherwise try reading from .env
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log(" Firebase initialized using .env credentials");
  } catch (err) {
    console.warn(" Warning: Could not parse Firebase credentials from .env. Running in local in-memory mode.");
  }
} else {
  console.log(" Running in Local In-Memory Mode (No Firebase keys detected). Stories will save in RAM during runtime.");
}

const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;

module.exports = { admin, db, auth };
