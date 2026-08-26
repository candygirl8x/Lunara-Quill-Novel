const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const novelRoutes = require('./src/routes/novelRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// 1. Permissive CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors());
app.use(express.json());

// 2. Serve static frontend files (index.html) from parent folder
app.use(express.static(path.join(__dirname, '../')));

// 3. Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Lunara Quill API is healthy and operational.' });
});

// 4. Mount API Routes
app.use('/api/novels', novelRoutes);

// 5. Default route serves index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 6. Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Lunara Quill Platform is LIVE!`);
  console.log(` 👉 Open in your browser: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
