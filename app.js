require('dotenv').config();
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const bodyParser = require('body-parser');

const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  const readme = await fs.readFile(path.join(__dirname, 'readme.md'), 'utf-8');
  res.type('text/markdown').send(readme);
});

app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
