require('dotenv').config();
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const bodyParser = require('body-parser');

const projectRoutes = require('./routes/projects');
const { getReadmeHtml } = require('../services/readmeService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  const html = await getReadmeHtml();
  res.type('html').send(html)
});

app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
