const express = require('express');
const cors = require('cors');
require('dotenv').config();

const novelRoutes = require('./src/routes/novelRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Lunara Quill API is healthy and operational.' });
});

// Mount Novel API Routes directly on /api/novels
app.use('/api/novels', novelRoutes);

// Root info route
app.get('/', (req, res) => {
  res.json({ message: 'Lunara Quill API Server is Online. Use /api/novels endpoints.' });
});

// JSON 404 Handler for unmatched routes (NEVER return HTML)
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Lunara Quill Novel Backend running on port ${PORT}`);
});
