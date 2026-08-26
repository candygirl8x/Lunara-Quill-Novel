const express = require('express');
const cors = require('cors');
require('dotenv').config();

const novelRoutes = require('./src/routes/novelRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Lunara Quill API is healthy and operational.' });
});

app.use('/api/novels', novelRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Lunara Quill Novel Backend running on http://localhost:${PORT}`);
});
